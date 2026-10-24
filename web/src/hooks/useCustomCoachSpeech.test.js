import { describeCoachSpeechError } from "./useCustomCoachSpeech";

describe("Goethe coach audio error descriptions", () => {
  test("explains quota failures and disables useless retries", () => {
    expect(describeCoachSpeechError({ status: 429, code: "quota_reached" })).toEqual({
      message: expect.stringContaining("Daily German audio limit reached"),
      code: "quota_reached",
      retryable: false,
    });
  });

  test("explains authentication failures", () => {
    expect(describeCoachSpeechError({ status: 401, code: "http_401" })).toEqual({
      message: expect.stringContaining("sign in again"),
      code: "http_401",
      retryable: false,
    });
  });

  test("keeps provider and network failures retryable", () => {
    expect(describeCoachSpeechError({ status: 502, code: "speech_generation_failed" })).toEqual({
      message: expect.stringContaining("temporarily unavailable"),
      code: "speech_generation_failed",
      retryable: true,
    });
    expect(describeCoachSpeechError({ code: "network_error", retryable: true }).retryable).toBe(true);
  });
});
