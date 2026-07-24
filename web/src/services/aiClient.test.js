import { callAI } from "./aiClient";

jest.mock("./backendUrl", () => ({ getBackendUrl: () => "https://falowen.app/api" }));

const jsonResponse = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  text: jest.fn(async () => JSON.stringify(body)),
});

describe("callAI API URL fallback", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it("keeps an explicit /api backend path for speaking chat requests", async () => {
    fetch.mockResolvedValueOnce(jsonResponse({ reply: "Hallo!" }));

    await expect(callAI({ path: "/speaking/custom-chat", payload: { message: "Hallo" } })).resolves.toEqual({ reply: "Hallo!" });

    expect(fetch).toHaveBeenCalledWith(
      "https://falowen.app/api/speaking/custom-chat",
      expect.objectContaining({ method: "POST" }),
    );
  });
});
