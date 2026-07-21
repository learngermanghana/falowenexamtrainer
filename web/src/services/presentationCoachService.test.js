import { requestCoachSpeech } from "./presentationCoachService";

jest.mock("./backendUrl", () => ({ getBackendUrl: () => "https://backend.test" }));

describe("requestCoachSpeech", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    global.URL.createObjectURL = jest.fn(() => "blob:coach-audio");
  });

  it("sends bearer token and payload, then returns an object URL", async () => {
    const blob = new Blob(["mp3"], { type: "audio/mpeg" });
    fetch.mockResolvedValueOnce({ ok: true, blob: jest.fn(async () => blob) });
    const url = await requestCoachSpeech({ text: "Hallo", level: "A2", idToken: "id-token" });
    expect(fetch).toHaveBeenCalledWith("https://backend.test/speech/synthesize", expect.objectContaining({
      method: "POST",
      headers: expect.objectContaining({ Authorization: "Bearer id-token", "Content-Type": "application/json" }),
      body: JSON.stringify({ text: "Hallo", level: "A2" }),
    }));
    expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
    expect(url).toBe("blob:coach-audio");
  });

  it("parses backend JSON errors", async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 429, json: jest.fn(async () => ({ error: "Daily speech synthesis limit reached" })) });
    await expect(requestCoachSpeech({ text: "Hallo", level: "A2" })).rejects.toThrow("Daily speech synthesis limit reached");
  });

  it("passes abort signals through to fetch", async () => {
    const controller = new AbortController();
    fetch.mockRejectedValueOnce(Object.assign(new Error("aborted"), { name: "AbortError" }));
    await expect(requestCoachSpeech({ text: "Hallo", level: "A2", signal: controller.signal })).rejects.toMatchObject({ name: "AbortError" });
    expect(fetch.mock.calls[0][1].signal).toBe(controller.signal);
  });
});
