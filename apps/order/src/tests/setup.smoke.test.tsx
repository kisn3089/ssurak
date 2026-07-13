import { http } from "@ssurak/api/core/axios/http";
import { Button } from "@ssurak/ui/components/buttons/button";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { API_BASE_URL } from "./msw/handlers";

function Counter() {
  const [count, setCount] = useState(0);
  return <Button onClick={() => setCount((c) => c + 1)}>클릭 {count}</Button>;
}

describe("테스트 환경 셋업 검증", () => {
  it("RTL 렌더링, user-event 클릭, jest-dom matcher가 동작한다", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    const button = screen.getByRole("button", { name: "클릭 0" });
    expect(button).toBeEnabled();

    await user.click(button);
    expect(button).toHaveTextContent("클릭 1");
  });

  it("MSW가 axios 요청을 가로챈다", async () => {
    const res = await http.get<{ ok: boolean }>(`${API_BASE_URL}/health`);
    expect(res.data).toEqual({ ok: true });
  });
});
