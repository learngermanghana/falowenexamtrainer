const {
  buildMockHoerenObjectKey,
  isCanonicalMockHoerenObjectKey,
} = require("../mockHoerenObjectKeys");
const {
  validateA1MockAudioKey,
  validateA1ExamHorenAudioKey,
  validateA2MockAudioKey,
  validateB1MockAudioKey,
  validateB2MockAudioKey,
  validateC1ExamHorenAudioKey,
  createA2MockAudioSignedUrl,
} = require("../r2CourseAudio");

const validators = {
  A1: validateA1MockAudioKey, A2: validateA2MockAudioKey,
  B1: validateB1MockAudioKey, B2: validateB2MockAudioKey,
};

describe("future mock Hören R2 keys", () => {
  test.each([
    ["A1", "mock-01", "teil-1", "a1/mock-hoeren/mock-01/teil-1.mp3"],
    ["A1", "mock-04", "teil-3", "a1/mock-hoeren/mock-04/teil-3.mp3"],
    ["A2", "mock-02", "teil-4", "a2/mock-hoeren/mock-02/teil-4.mp3"],
    ["A2", "mock-04", "teil-2", "a2/mock-hoeren/mock-04/teil-2.mp3"],
    ["B1", "mock-01", "teil-1", "b1/mock-hoeren/mock-01/teil-1.mp3"],
    ["B1", "mock-02", "teil-4", "b1/mock-hoeren/mock-02/teil-4.mp3"],
    ["B2", "mock-01", "teil-3", "b2/mock-hoeren/mock-01/teil-3.mp3"],
    ["B2", "mock-03", "teil-2", "b2/mock-hoeren/mock-03/teil-2.mp3"],
  ])("%s %s %s follows the single canonical future layout", (level, mockId, part, key) => {
    expect(buildMockHoerenObjectKey({ level, mockId, part })).toBe(key);
    expect(isCanonicalMockHoerenObjectKey({ level, mockId, part, key })).toBe(true);
    expect(validators[level]({ mockId, part, key })).toEqual({ level, mockId, part, key });
  });

  test("existing legacy recordings remain playable at their exact original object keys", () => {
    const oldPaths = [
      [validateA1MockAudioKey, "mock-01", "teil-1", "a1/mock-hoeren/mock-01/teil-1.wav"],
      [validateA2MockAudioKey, "mock-02", "teil-1", "a2/mock-horen-2/teil-1.mp3"],
      [validateB1MockAudioKey, "mock-01", "teil-1", "b1/mock-hoeren-1/teil-1.mp3"],
      [validateB1MockAudioKey, "mock-01", "sprechen-teil-1", "b1/mock-hoeren-1/sprechen-teil-1.mp3"],
      [validateB2MockAudioKey, "mock-01", "teil-4", "b2/mock-hoeren-1/teil-4.mp3"],
    ];
    for (const [validate, mockId, part, key] of oldPaths) {
      expect(validate({ mockId, part, key })).toMatchObject({ mockId, part, key });
    }
    expect(validateA1ExamHorenAudioKey({
      sampleId: "sample-2", part: "teil-1", key: "a1/horen-part-2/teil-1.mp3",
    })).toMatchObject({ sampleId: "sample-2", part: "teil-1" });
    expect(validateC1ExamHorenAudioKey({
      sampleId: "sample-1", part: "teil-1", key: "c1/exam-horen-1/teil-1.mp3",
    })).toMatchObject({ sampleId: "sample-1", part: "teil-1" });
  });

  test("wrong level, mock ID, part, extension and lookalike prefixes are refused", () => {
    expect(() => buildMockHoerenObjectKey({ level: "B2", mockId: "../mock-01", part: "teil-1" })).toThrow();
    expect(() => buildMockHoerenObjectKey({ level: "A1", mockId: "mock-01", part: "teil-4" })).toThrow();
    expect(() => buildMockHoerenObjectKey({ level: "C1", mockId: "mock-01", part: "teil-1" })).toThrow();
    const cases = [
      [validateA1MockAudioKey, "A1", "mock-01", "teil-1", "a1/mock-hoeren/mock-01/teil-1-extra.mp3"],
      [validateA2MockAudioKey, "A2", "mock-02", "teil-1", "a2/mock-hoeren/mock-02/teil-1extra.mp3"],
      [validateB1MockAudioKey, "B1", "mock-01", "teil-1", "b1/mock-hoeren-1/teil-1-copy.mp3"],
      [validateB2MockAudioKey, "B2", "mock-01", "teil-1", "b2/mock-hoeren-1/teil-1-other.mp3"],
      [validateA2MockAudioKey, "A2", "mock-02", "teil-1", "A2/mock-hoeren/mock-02/teil-1.mp3"],
      [validateB1MockAudioKey, "B1", "mock-02", "teil-1", "b1/mock-hoeren/mock-01/teil-1.mp3"],
    ];
    for (const [validate, level, mockId, part, key] of cases) {
      expect(validate({ mockId, part, key })).toBeNull();
      expect(isCanonicalMockHoerenObjectKey({ level, mockId, part, key })).toBe(false);
    }
  });

  test("canonical new keys get normal protected R2 signed URLs without moving files", async () => {
    const key = buildMockHoerenObjectKey({ level: "A2", mockId: "mock-02", part: "teil-1" });
    const signed = await createA2MockAudioSignedUrl({
      mockId: "mock-02", part: "teil-1", key,
      env: {
        R2_ACCOUNT_ID: "1234567890abcdef",
        R2_ACCESS_KEY_ID: "test-access",
        R2_SECRET_ACCESS_KEY: "test-secret",
        R2_AUDIO_BUCKET: "falowen-course-audio",
      },
    });
    expect(signed.key).toBe(key);
    expect(signed.url).toContain("/a2/mock-hoeren/mock-02/teil-1.mp3");
    expect(signed.url).toContain("X-Amz-Signature=");
  });
});
