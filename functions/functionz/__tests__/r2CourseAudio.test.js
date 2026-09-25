const {
  validateC2AudioKey,
  validateB2AudioKey,
  validateCourseAudioKey,
  getR2AudioConfig,
  createC2AudioSignedUrl,
  createB2AudioSignedUrl,
  getCourseMediaStaffEmails,
  hasCourseMediaStaffAccess,
  hasCourseMediaLevelAccess,
} = require("../r2CourseAudio");

describe("B2/C2 R2 course audio", () => {
  test("accepts only audio objects inside the matching C2 listening day folder", () => {
    expect(
      validateC2AudioKey({ day: 2, key: "c2/day-02/listening.mp3" }),
    ).toEqual({ day: 2, key: "c2/day-02/listening.mp3" });

    expect(validateC2AudioKey({ day: 2, key: "c2/day-06/listening.mp3" })).toBeNull();
    expect(validateC2AudioKey({ day: 1, key: "c2/day-01/listening.mp3" })).toBeNull();
    expect(validateC2AudioKey({ day: 2, key: "../secret.mp3" })).toBeNull();
    expect(validateC2AudioKey({ day: 2, key: "c2/day-02/notes.pdf" })).toBeNull();
  });

  test("accepts only audio objects inside matching B2 listening day folders", () => {
    expect(
      validateB2AudioKey({ day: 2, key: "b2/day-02/listening.m4a" }),
    ).toEqual({ day: 2, key: "b2/day-02/listening.m4a" });

    expect(validateB2AudioKey({ day: 2, key: "c2/day-02/listening.m4a" })).toBeNull();
    expect(validateB2AudioKey({ day: 1, key: "b2/day-01/listening.m4a" })).toBeNull();
    expect(validateCourseAudioKey({ level: "B2", day: 6, key: "b2/day-06/audio.mp3" })).toEqual({
      level: "B2",
      day: 6,
      key: "b2/day-06/audio.mp3",
    });
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

  test("recognizes authenticated Falowen staff without requiring a student profile", () => {
    expect(hasCourseMediaStaffAccess({
      authedUser: { email: "staff@falowen.app" },
      student: null,
      env: {},
    })).toBe(true);

    expect(hasCourseMediaStaffAccess({
      authedUser: { email: "other@example.com" },
      student: { role: "teacher" },
      env: {},
    })).toBe(true);

    expect(hasCourseMediaStaffAccess({
      authedUser: { email: "other@example.com" },
      student: null,
      env: {},
    })).toBe(false);
  });

  test("allows learners to use earlier-level protected audio through normal course progression", () => {
    expect(hasCourseMediaLevelAccess({
      student: { currentLevel: "B2" },
      requiredLevel: "B2",
    })).toBe(true);

    expect(hasCourseMediaLevelAccess({
      student: { level: "C1" },
      requiredLevel: "B2",
    })).toBe(true);

    expect(hasCourseMediaLevelAccess({
      student: { className: "C2 Advanced Klasse" },
      requiredLevel: "B2",
    })).toBe(true);

    expect(hasCourseMediaLevelAccess({
      student: { courseLevel: "B1" },
      requiredLevel: "B2",
    })).toBe(false);

    expect(hasCourseMediaLevelAccess({
      student: { currentLevel: "C1" },
      requiredLevel: "C2",
    })).toBe(false);
  });

  test("supports a configurable protected-course staff email allowlist", () => {
    const env = { COURSE_MEDIA_STAFF_EMAILS: "audio-admin@example.com, tutor@example.com" };
    expect(Array.from(getCourseMediaStaffEmails(env))).toEqual([
      "audio-admin@example.com",
      "tutor@example.com",
    ]);
    expect(hasCourseMediaStaffAccess({
      authedUser: { email: "TUTOR@example.com" },
      student: null,
      env,
    })).toBe(true);
  });

  test("creates C2 and B2 R2 presigned GET URLs without contacting R2", async () => {
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

    const b2 = await createB2AudioSignedUrl({
      day: 2,
      key: "b2/day-02/listening.m4a",
      env: {
        R2_ACCOUNT_ID: "1234567890abcdef",
        R2_ACCESS_KEY_ID: "test-access",
        R2_SECRET_ACCESS_KEY: "test-secret",
        R2_AUDIO_BUCKET: "falowen-course-audio",
        R2_AUDIO_URL_EXPIRES_SECONDS: "3600",
      },
    });

    expect(b2.url).toContain("/b2/day-02/listening.m4a");
    expect(b2.url).toContain("X-Amz-Signature=");
    expect(b2.level).toBe("B2");
  });
});
