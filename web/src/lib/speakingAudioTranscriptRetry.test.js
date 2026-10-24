import { analyzeSpeakingAudioWithTranscriptRetry } from "./speakingAudio";

describe("analyzeSpeakingAudioWithTranscriptRetry", () => {
  test("retries once when the first response has no transcript", async () => {
    const analyze = jest
      .fn()
      .mockResolvedValueOnce({ transcript: "", feedback: "first" })
      .mockResolvedValueOnce({ transcript: "Ich trinke Wasser.", feedback: "second" });

    const response = await analyzeSpeakingAudioWithTranscriptRetry({
      analyze,
      payload: { level: "A1" },
      retryDelayMs: 0,
    });

    expect(analyze).toHaveBeenCalledTimes(2);
    expect(analyze).toHaveBeenNthCalledWith(1, { level: "A1" });
    expect(analyze).toHaveBeenNthCalledWith(2, { level: "A1", transcriptionRetry: true });
    expect(response.transcript).toBe("Ich trinke Wasser.");
  });

  test("does not retry when the first transcript is available", async () => {
    const analyze = jest.fn().mockResolvedValue({ transcript: "Guten Tag." });

    const response = await analyzeSpeakingAudioWithTranscriptRetry({
      analyze,
      payload: { level: "A2" },
      retryDelayMs: 0,
    });

    expect(analyze).toHaveBeenCalledTimes(1);
    expect(response.transcript).toBe("Guten Tag.");
  });
});
