import { CreateTablePayload } from "@ssurak/api/schemas/model/table.schema";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse, PathParams } from "msw";
import { describe, expect, it, vi } from "vitest";
import { buildTable } from "@/tests/fixtures/table";
import { API_BASE_URL } from "@/tests/msw/handlers";
import { server } from "@/tests/msw/server";
import { renderWithProviders } from "@/tests/renderWithProviders";
import TableAddForm from "./TableAddForm";

vi.mock("next/navigation", () => ({
  useParams: () => ({ storeId: "store-1" }),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

const TABLES_URL = `${API_BASE_URL}/stores/v1/store-1/tables`;

/** 목록 조회(중복 검사용)와 생성 요청을 스텁하고, POST body를 캡처해 돌려준다. */
function captureCreateRequests() {
  const captured: CreateTablePayload[] = [];

  server.use(
    http.get(TABLES_URL, () => HttpResponse.json([buildTable()])),
    http.post<PathParams, CreateTablePayload>(
      TABLES_URL,
      async ({ request }) => {
        const body = await request.json();
        captured.push(body);
        return HttpResponse.json(buildTable({ publicId: "table-new" }), {
          status: 201,
        });
      }
    )
  );

  return captured;
}

async function submitButton() {
  return screen.findByRole("button", { name: "테이블 추가" });
}

describe("TableAddForm 제출 payload", () => {
  it("필수값(테이블 번호)만 입력하면 비어 있는 옵션 필드를 제외하고 전송한다", async () => {
    const captured = captureCreateRequests();
    const user = userEvent.setup();
    renderWithProviders(<TableAddForm />);

    await user.type(await screen.findByLabelText(/테이블 번호/), "5");

    const submit = await submitButton();
    await waitFor(() => expect(submit).toBeEnabled());
    await user.click(submit);

    await waitFor(() => expect(captured).toHaveLength(1));
    expect(captured[0]).toEqual({ tableNumber: "5", isActive: true });
  });

  it("모든 필드를 입력하면 숫자 변환·공백 trim·스위치 값을 반영해 전송한다", async () => {
    const captured = captureCreateRequests();
    const user = userEvent.setup();
    renderWithProviders(<TableAddForm />);

    await user.type(await screen.findByLabelText(/테이블 번호/), "  3-1  ");
    await user.type(screen.getByLabelText(/좌석 수/), "4");
    await user.type(screen.getByLabelText(/층/), "0");
    await user.type(screen.getByLabelText(/구역/), "테라스");
    await user.click(screen.getByRole("switch"));

    const submit = await submitButton();
    await waitFor(() => expect(submit).toBeEnabled());
    await user.click(submit);

    await waitFor(() => expect(captured).toHaveLength(1));
    // floor: 0은 falsy지만 유효한 값이므로 payload에서 탈락하면 안 된다.
    expect(captured[0]).toEqual({
      tableNumber: "3-1",
      seats: 4,
      floor: 0,
      section: "테라스",
      isActive: false,
    });
  });

  it("이미 존재하는 테이블 번호면 에러를 표시하고 전송하지 않는다", async () => {
    const captured = captureCreateRequests();
    const user = userEvent.setup();
    renderWithProviders(<TableAddForm />);

    await user.type(await screen.findByLabelText(/테이블 번호/), "1-1");

    expect(
      await screen.findByText("이미 존재하는 테이블 번호입니다.")
    ).toBeVisible();
    expect(await submitButton()).toBeDisabled();
    expect(captured).toHaveLength(0);
  });
});
