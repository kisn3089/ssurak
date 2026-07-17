import { UpdateTablePayload } from "@ssurak/api/schemas/model/table.schema";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse, PathParams } from "msw";
import { describe, expect, it, vi } from "vitest";
import { buildTable } from "@/tests/fixtures/table";
import { API_BASE_URL } from "@/tests/msw/handlers";
import { server } from "@/tests/msw/server";
import { renderWithProviders } from "@/tests/renderWithProviders";
import TableEditForm from "./TableEditForm";

vi.mock("next/navigation", () => ({
  useParams: () => ({ storeId: "store-1", tableId: "table-1" }),
}));

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

const TABLES_URL = `${API_BASE_URL}/stores/v1/store-1/tables`;

/**
 * 수정 대상(1-1, 좌석 4, 1층, 메인 홀, 활성)과 목록·PATCH 요청을 스텁하고,
 * PATCH body를 캡처해 돌려준다.
 */
function captureUpdateRequests() {
  const captured: UpdateTablePayload[] = [];
  const editingTable = buildTable();

  server.use(
    http.get(TABLES_URL, () =>
      HttpResponse.json([
        editingTable,
        buildTable({ publicId: "table-9", tableNumber: "9-9" }),
      ])
    ),
    http.get(`${TABLES_URL}/table-1`, () => HttpResponse.json(editingTable)),
    http.patch<PathParams, UpdateTablePayload>(
      `${TABLES_URL}/table-1`,
      async ({ request }) => {
        const body = await request.json();
        captured.push(body);
        return HttpResponse.json(buildTable(body));
      }
    )
  );

  return captured;
}

async function enabledSubmitButton() {
  const submit = await screen.findByRole("button", { name: "테이블 수정" });
  await waitFor(() => expect(submit).toBeEnabled());
  return submit;
}

describe("TableEditForm 제출 payload", () => {
  it("변경 없이 제출하면 요청을 보내지 않고 안내 에러를 표시한다", async () => {
    const captured = captureUpdateRequests();
    const user = userEvent.setup();
    renderWithProviders(<TableEditForm />);

    await user.click(await enabledSubmitButton());

    expect(await screen.findByText("변경된 사항이 없습니다.")).toBeVisible();
    expect(captured).toHaveLength(0);
  });

  it("옵션 필드를 비우면 값 해제 의미의 null만 전송한다", async () => {
    const captured = captureUpdateRequests();
    const user = userEvent.setup();
    renderWithProviders(<TableEditForm />);

    await user.clear(await screen.findByLabelText(/좌석 수/));

    await user.click(await enabledSubmitButton());

    await waitFor(() => expect(captured).toHaveLength(1));
    // 변경하지 않은 tableNumber·floor·section·isActive는 PATCH에 포함되면 안 된다.
    expect(captured[0]).toEqual({ seats: null });
  });

  it("여러 필드를 바꾸면 변경분만 모아 전송한다", async () => {
    const captured = captureUpdateRequests();
    const user = userEvent.setup();
    renderWithProviders(<TableEditForm />);

    const tableNumberInput = await screen.findByLabelText(/테이블 번호/);
    await user.clear(tableNumberInput);
    await user.type(tableNumberInput, "3-3");
    await user.click(screen.getByRole("switch"));

    await user.click(await enabledSubmitButton());

    await waitFor(() => expect(captured).toHaveLength(1));
    expect(captured[0]).toEqual({ tableNumber: "3-3", isActive: false });
  });
});
