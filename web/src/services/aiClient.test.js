import { buildApiCandidates, callAI } from "./aiClient";

jest.mock("./backendUrl", () => ({ getBackendUrl: () => "https://falowen.app/api" }));

const jsonResponse = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  text: jest.fn(async () => JSON.stringify(body)),
});

const htmlResponse = (body = "<!doctype html><html></html>", status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  text: jest.fn(async () => body),
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

  it("routes a same-origin backend root through the Vercel /api prefix", () => {
    expect(
      buildApiCandidates("/chatbuddy/respond", {
        baseUrl: "https://www.falowen.app",
        origin: "https://www.falowen.app",
      }),
    ).toEqual(["https://www.falowen.app/api/chatbuddy/respond"]);
  });

  it("retries the same-origin Vercel API after a browser network failure", async () => {
    fetch
      .mockRejectedValueOnce(new TypeError("NetworkError when attempting to fetch resource."))
      .mockResolvedValueOnce(jsonResponse({ reply: "Versuche es mit einem Beispielsatz." }));

    await expect(
      callAI({ path: "/chatbuddy/respond", payload: { message: "Erkläre mir obwohl" } }),
    ).resolves.toEqual({ reply: "Versuche es mit einem Beispielsatz." });

    expect(fetch).toHaveBeenNthCalledWith(
      1,
      "https://falowen.app/api/chatbuddy/respond",
      expect.objectContaining({ method: "POST" }),
    );
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      `${window.location.origin}/api/chatbuddy/respond`,
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("retries when a wrong route returns the frontend HTML shell", async () => {
    fetch
      .mockResolvedValueOnce(htmlResponse())
      .mockResolvedValueOnce(jsonResponse({ reply: "Die API ist erreichbar." }));

    await expect(
      callAI({ path: "/chatbuddy/respond", payload: { message: "Hallo" } }),
    ).resolves.toEqual({ reply: "Die API ist erreichbar." });

    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
