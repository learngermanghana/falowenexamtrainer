import {
  MAX_COACH_SPEECH_CHARACTERS,
  normalizeCoachSpeechText,
  requestCoachSpeech,
} from "./presentationCoachService";

jest.mock("./backendUrl", () => ({ getBackendUrl: () => "https://backend.test" }));

const audioHeaders = { get: jest.fn(() => "audio/mpeg") };

const jsonErrorResponse = ({ status, error, code }) => ({
  ok: false,
  status,
  text: jest.fn(async () => JSON.stringify({ error, code })),
  headers: { get: jest.fn(() => "application/json") },
});

describe("requestCoachSpeech", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    global.URL.createObjectURL = jest.fn(() => "blob:coach-audio");
    audioHeaders.get.mockClear();
  });

  it("sends bearer token and payload, then returns an object URL", async () => {
    const blob = new Blob(["mp3"], { type: "audio/mpeg" });
    fetch.mockResolvedValueOnce({ ok: true, blob: jest.fn(async () => blob), headers: audioHeaders });
    const url = await requestCoachSpeech({ text: "Hallo", level: "A2", idToken: "id-token" });
    expect(fetch).toHaveBeenCalledWith("https://backend.test/speech/synthesize", expect.objectContaining({
      method: "POST",
      headers: expect.objectContaining({ Authorization: "Bearer id-token", "Content-Type": "application/json" }),
      body: JSON.stringify({ text: "Hallo", level: "A2" }),
    }));
    expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
    expect(url).toBe("blob:coach-audio");
  });

  it("shortens long coach replies before the backend 1200-character guard", async () => {
    const longReply = `${"Das ist eine hilfreiche Erklärung. ".repeat(80)}Warum denkst du das?`;
    const blob = new Blob(["mp3"], { type: "audio/mpeg" });
    fetch.mockResolvedValueOnce({ ok: true, blob: jest.fn(async () => blob), headers: audioHeaders });

    await requestCoachSpeech({ text: longReply, level: "B1", idToken: "id-token" });

    const payload = JSON.parse(fetch.mock.calls[0][1].body);
    expect(payload.text.length).toBeLessThanOrEqual(MAX_COACH_SPEECH_CHARACTERS);
    expect(payload.text).toMatch(/[…!?\.]$/);
    expect(payload.text).toBe(normalizeCoachSpeechText(longReply));
  });

  it("preserves backend status, code and non-retryable quota information", async () => {
    fetch.mockResolvedValueOnce(jsonErrorResponse({
      status: 429,
      error: "Daily speech synthesis limit reached",
      code: "quota_reached",
    }));

    await expect(requestCoachSpeech({ text: "Hallo", level: "A2" })).rejects.toMatchObject({
      message: "Daily speech synthesis limit reached",
      status: 429,
      code: "quota_reached",
      retryable: false,
    });
  });

  it("rejects non-audio success responses instead of creating broken players", async () => {
    const blob = new Blob(["html"], { type: "text/html" });
    fetch.mockResolvedValueOnce({
      ok: true,
      blob: jest.fn(async () => blob),
      headers: { get: jest.fn(() => "text/html") },
    });

    await expect(requestCoachSpeech({ text: "Hallo", level: "A2" })).rejects.toMatchObject({
      status: 502,
      code: "invalid_audio_response",
      retryable: true,
    });
    expect(URL.createObjectURL).not.toHaveBeenCalled();
  });

  it("passes abort signals through to fetch", async () => {
    const controller = new AbortController();
    fetch.mockRejectedValueOnce(Object.assign(new Error("aborted"), { name: "AbortError" }));
    await expect(requestCoachSpeech({ text: "Hallo", level: "A2", signal: controller.signal })).rejects.toMatchObject({ name: "AbortError" });
    expect(fetch.mock.calls[0][1].signal).toBe(controller.signal);
  });
});
