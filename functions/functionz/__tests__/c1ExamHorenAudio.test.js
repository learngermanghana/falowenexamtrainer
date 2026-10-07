const {
  validateC1ExamHorenAudioKey,
  createC1ExamHorenAudioSignedUrl,
} = require("../r2CourseAudio");

describe("C1 Exams Room Hören audio", () => {
  test("accepts only the configured C1 exam-horen sample path", () => {
    expect(validateC1ExamHorenAudioKey({
      sampleId: "sample-1",
      part: "teil-1",
      key: "c1/exam-horen-1/teil-1.mp3",
    })).toEqual({
      level: "C1",
      sampleId: "sample-1",
      part: "teil-1",
      key: "c1/exam-horen-1/teil-1.mp3",
    });

    expect(validateC1ExamHorenAudioKey({
      sampleId: "sample-1",
      part: "teil-2",
      key: "c1/exam-horen-1/teil-2.mp3",
    })).toEqual({
      level: "C1",
      sampleId: "sample-1",
      part: "teil-2",
      key: "c1/exam-horen-1/teil-2.mp3",
    });

    expect(validateC1ExamHorenAudioKey({
      sampleId: "sample-1",
      part: "teil-3",
      key: "c1/exam-horen-1/teil-3.mp3",
    })).toEqual({
      level: "C1",
      sampleId: "sample-1",
      part: "teil-3",
      key: "c1/exam-horen-1/teil-3.mp3",
    });

    expect(validateC1ExamHorenAudioKey({
      sampleId: "sample-2",
      part: "teil-1",
      key: "c1/exam-horen-1/teil-1.mp3",
    })).toBeNull();

    expect(validateC1ExamHorenAudioKey({
      sampleId: "sample-1",
      part: "teil-1",
      key: "c1/mock-hoeren-1/teil-1.mp3",
    })).toBeNull();

    expect(validateC1ExamHorenAudioKey({
      sampleId: "sample-1",
      part: "teil-1",
      key: "../teil-1.mp3",
    })).toBeNull();
  });

  test("signs the C1 Exams Room Hören object without mock semantics", async () => {
    const signed = await createC1ExamHorenAudioSignedUrl({
      sampleId: "sample-1",
      part: "teil-1",
      key: "c1/exam-horen-1/teil-1.mp3",
      env: {
        R2_ACCOUNT_ID: "1234567890abcdef",
        R2_ACCESS_KEY_ID: "test-access",
        R2_SECRET_ACCESS_KEY: "test-secret",
        R2_AUDIO_BUCKET: "falowen-course-audio",
        R2_AUDIO_URL_EXPIRES_SECONDS: "3600",
      },
      now: new Date("2026-10-07T12:00:00.000Z"),
    });

    expect(signed.url).toContain("/c1/exam-horen-1/teil-1.mp3");
    expect(signed.url).toContain("X-Amz-Signature=");
    expect(signed.level).toBe("C1");
    expect(signed.sampleId).toBe("sample-1");
    expect(signed.part).toBe("teil-1");
  });
});
