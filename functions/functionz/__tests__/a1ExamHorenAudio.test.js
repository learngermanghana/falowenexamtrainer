const {
  validateA1ExamHorenAudioKey,
  createA1ExamHorenAudioSignedUrl,
} = require("../r2CourseAudio");

describe("A1 Exams Room Hören practice audio", () => {
  test("accepts the protected A1 Sample 2 Teil 1 object", () => {
    expect(validateA1ExamHorenAudioKey({
      sampleId: "sample-2",
      part: "teil-1",
      key: "a1/horen-part-2/teil-1.mp3",
    })).toEqual({
      level: "A1",
      sampleId: "sample-2",
      part: "teil-1",
      key: "a1/horen-part-2/teil-1.mp3",
    });

    expect(validateA1ExamHorenAudioKey({
      sampleId: "sample-2",
      part: "teil-2",
      key: "a1/horen-part-2/teil-2.mp3",
    })).toEqual({
      level: "A1",
      sampleId: "sample-2",
      part: "teil-2",
      key: "a1/horen-part-2/teil-2.mp3",
    });

    expect(validateA1ExamHorenAudioKey({
      sampleId: "sample-1",
      part: "teil-1",
      key: "a1/horen-part-2/teil-1.mp3",
    })).toBeNull();

    expect(validateA1ExamHorenAudioKey({
      sampleId: "sample-2",
      part: "teil-1",
      key: "a1/mock-hoeren/mock-01/teil-1.mp3",
    })).toBeNull();

    expect(validateA1ExamHorenAudioKey({
      sampleId: "sample-2",
      part: "teil-1",
      key: "../teil-1.mp3",
    })).toBeNull();
  });

  test("signs the A1 Hören practice object without mock semantics", async () => {
    const signed = await createA1ExamHorenAudioSignedUrl({
      sampleId: "sample-2",
      part: "teil-1",
      key: "a1/horen-part-2/teil-1.mp3",
      env: {
        R2_ACCOUNT_ID: "1234567890abcdef",
        R2_ACCESS_KEY_ID: "test-access",
        R2_SECRET_ACCESS_KEY: "test-secret",
        R2_AUDIO_BUCKET: "falowen-course-audio",
        R2_AUDIO_URL_EXPIRES_SECONDS: "3600",
      },
      now: new Date("2026-10-08T09:00:00.000Z"),
    });

    expect(signed.url).toContain("/a1/horen-part-2/teil-1.mp3");
    expect(signed.url).toContain("X-Amz-Signature=");
    expect(signed.level).toBe("A1");
    expect(signed.sampleId).toBe("sample-2");
    expect(signed.part).toBe("teil-1");
  });
});
