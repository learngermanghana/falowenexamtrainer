const {
  validateC2AudioKey,
  getR2AudioConfig,
  createC2AudioSignedUrl,
} = require("../r2CourseAudio");

describe("C2 R2 course audio", () => {
  test("accepts only audio objects inside the matching C2 listening day folder", () => {
    expect(
      validateC2AudioKey({ day: 2, key: "c2/day-02/listening.mp3" }),
    ).toEqual({ day: 2, key: "c2/day-02/listening.mp3" });

    expect(validateC2AudioKey({ day: 2, key: "c2/day-06/listening.mp3" })).toBeNull();
    expect(validateC2AudioKey({ day: 1, key: "c2/day-01/listening.mp3" })).toBeNull();
    expect(validateC2AudioKey({ day: 2, key: "../secret.mp3" })).toBeNull();
    expect(validateC2AudioKey({ day: 2, key: "c2/day-02/notes.pdf" })).toBeNull();
  });

  test("requires the four server-side R2 settings and clamps expiry", () => {
    expect(() => getR2AudioConfig({})).toThrow("Missing R2 audio configuration");

    const config = getR2AudioConfig({
      R2_ACCOUNT_ID: "account",
      R2_ACCESS_KEY_ID: "access",
      R2_SECRET_ACCESS_KEY: "secret",
      R2_AUDIO_BUCKET: "falowen-course-audio",
      R2_AUDIO_URL_EXPIRES_SECONDS: "30",
    });

    expect(config.bucket).toBe("falowen-course-audio");
    expect(config.expiresIn).toBe(60);
  });

  test("creates an R2 presigned GET URL without contacting R2", async () => {
    const result = await createC2AudioSignedUrl({
      day: 2,
      key: "c2/day-02/listening.mp3",
      env: {
        R2_ACCOUNT_ID: "1234567890abcdef",
        R2_ACCESS_KEY_ID: "test-access",
        R2_SECRET_ACCESS_KEY: "test-secret",
        R2_AUDIO_BUCKET: "falowen-course-audio",
        R2_AUDIO_URL_EXPIRES_SECONDS: "3600",
      },
    });

    expect(result.url).toContain("r2.cloudflarestorage.com");
    expect(result.url).toContain("X-Amz-Signature=");
    expect(result.expiresIn).toBe(3600);
  });
});
