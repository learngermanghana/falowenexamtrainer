const {
  validateA1AudioKey,
  validateA1MockAudioKey,
  validateA2AudioKey,
  validateB1AudioKey,
  validateC2AudioKey,
  validateB2AudioKey,
  validateCourseAudioKey,
  getR2AudioConfig,
  createA1AudioSignedUrl,
  createA1MockAudioSignedUrl,
  createA2AudioSignedUrl,
  createB1AudioSignedUrl,
  createC2AudioSignedUrl,
  createB2AudioSignedUrl,
  getCourseMediaStaffEmails,
  hasCourseMediaStaffAccess,
  hasCourseMediaLevelAccess,
} = require("../r2CourseAudio");

describe("A1/A2/B1/B2/C2 R2 course audio", () => {
  test("accepts the protected A1 Day 13 and Chapter 14.1 folders", () => {
    expect(validateA1AudioKey({ day: 13, key: "a1/day-13/day-13.mp3" })).toEqual({ day: 13, key: "a1/day-13/day-13.mp3" });
    expect(validateA1AudioKey({ day: "14.1", key: "a1/day-14-1/day-14-1.mp3" })).toEqual({ day: "14.1", key: "a1/day-14-1/day-14-1.mp3" });
    expect(validateA1AudioKey({ day: "14.1", key: "a1/day-14/day-14.mp3" })).toBeNull();
    expect(validateA1AudioKey({ day: 12, key: "a1/day-12/day-12.mp3" })).toBeNull();
  });

  test("accepts protected A1 mock Hören files without treating them as Course Book days", () => {
    expect(validateA1MockAudioKey({
      mockId: "mock-01",
      part: "teil-1",
      key: "a1/mock-hoeren/mock-01/teil-1.wav",
    })).toEqual({
      level: "A1",
      mockId: "mock-01",
      part: "teil-1",
      key: "a1/mock-hoeren/mock-01/teil-1.wav",
    });

    expect(validateA1MockAudioKey({
      mockId: "mock-01",
      part: "teil-4",
      key: "a1/mock-hoeren/mock-01/teil-4.wav",
    })).toBeNull();

    expect(validateA1MockAudioKey({
      mockId: "mock-01",
      part: "teil-1",
      key: "a1/day-13/day-13.mp3",
    })).toBeNull();
  });
  test("accepts protected A2 Day 6–12, Day 24 and Day 26–28 audio folders", () => {
    expect(validateA2AudioKey({ day: 12, key: "a2/day-12/day-12.mp3" })).toEqual({ day: 12, key: "a2/day-12/day-12.mp3" });
    expect(validateA2AudioKey({ day: 12, key: "a2/day-11/day-11.mp3" })).toBeNull();
    expect(validateA2AudioKey({ day: 11, key: "a2/day-11/day-11.mp3" })).toEqual({ day: 11, key: "a2/day-11/day-11.mp3" });
    expect(validateA2AudioKey({ day: 11, key: "a2/day-10/day-10.mp3" })).toBeNull();
    expect(validateA2AudioKey({ day: 10, key: "a2/day-10/day-10.mp3" })).toEqual({ day: 10, key: "a2/day-10/day-10.mp3" });
    expect(validateA2AudioKey({ day: 10, key: "a2/day-09/day-09.mp3" })).toBeNull();
    expect(validateA2AudioKey({ day: 6, key: "a2/day-06/day-06.mp3" })).toEqual({ day: 6, key: "a2/day-06/day-06.mp3" });
    expect(validateA2AudioKey({ day: 6, key: "a2/day-07/day-07.mp3" })).toBeNull();
    expect(validateA2AudioKey({ day: 9, key: "a2/day-09/day-09.mp3" })).toEqual({ day: 9, key: "a2/day-09/day-09.mp3" });
    expect(validateA2AudioKey({ day: 9, key: "a2/day-08/day-08.mp3" })).toBeNull();
    expect(validateA2AudioKey({ day: 7, key: "a2/day-07/day-07.mp3" })).toEqual({ day: 7, key: "a2/day-07/day-07.mp3" });
    expect(validateA2AudioKey({ day: 7, key: "a2/day-08/day-08.mp3" })).toBeNull();
    expect(validateA2AudioKey({ day: 8, key: "a2/day-08/day-08.mp3" })).toEqual({ day: 8, key: "a2/day-08/day-08.mp3" });
    expect(validateA2AudioKey({ day: 8, key: "a2/day-24/day-24.mp3" })).toBeNull();
    expect(
      validateA2AudioKey({ day: 28, key: "a2/day-28/day-28.mp3" }),
    ).toEqual({ day: 28, key: "a2/day-28/day-28.mp3" });

    expect(validateA2AudioKey({ day: 24, key: "a2/day-24/day-24.mp3" })).toEqual({ day: 24, key: "a2/day-24/day-24.mp3" });
    expect(validateA2AudioKey({ day: 26, key: "a2/day-26/day-26.mp3" })).toEqual({ day: 26, key: "a2/day-26/day-26.mp3" });
    expect(validateA2AudioKey({ day: 27, key: "a2/day-27/day-27.mp3" })).toEqual({ day: 27, key: "a2/day-27/day-27.mp3" });
    expect(validateA2AudioKey({ day: 25, key: "a2/day-25/day-25.mp3" })).toBeNull();
    expect(validateA2AudioKey({ day: 28, key: "b2/day-28/day-28.mp3" })).toBeNull();
    expect(validateA2AudioKey({ day: 28, key: "../day-28.mp3" })).toBeNull();
  });
  test("accepts the flat Cloudflare B1 Day 15 and Day 16 audio keys", () => {
    expect(validateB1AudioKey({ day: 15, key: "audio/day_15.mp3" })).toEqual({
      day: 15,
      key: "audio/day_15.mp3",
    });
    expect(validateB1AudioKey({ day: 16, key: "audio/day_16.mp3" })).toEqual({
      day: 16,
      key: "audio/day_16.mp3",
    });
    expect(validateB1AudioKey({ day: 15, key: "audio/day_16.mp3" })).toBeNull();
    expect(validateB1AudioKey({ day: 14, key: "audio/day_14.mp3" })).toBeNull();
    expect(validateB1AudioKey({ day: 15, key: "../day_15.mp3" })).toBeNull();
  });

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

  test("creates A1, A2, B1, C2 and B2 R2 presigned GET URLs without contacting R2", async () => {
    const a1 = await createA1AudioSignedUrl({
      day: "14.1",
      key: "a1/day-14-1/day-14-1.mp3",
      env: {
        R2_ACCOUNT_ID: "1234567890abcdef",
        R2_ACCESS_KEY_ID: "test-access",
        R2_SECRET_ACCESS_KEY: "test-secret",
        R2_AUDIO_BUCKET: "falowen-course-audio",
        R2_AUDIO_URL_EXPIRES_SECONDS: "3600",
      },
    });

    expect(a1.url).toContain("/a1/day-14-1/day-14-1.mp3");
    expect(a1.url).toContain("X-Amz-Signature=");
    expect(a1.level).toBe("A1");

    const a1Mock = await createA1MockAudioSignedUrl({
      mockId: "mock-01",
      part: "teil-1",
      key: "a1/mock-hoeren/mock-01/teil-1.wav",
      env: {
        R2_ACCOUNT_ID: "1234567890abcdef",
        R2_ACCESS_KEY_ID: "test-access",
        R2_SECRET_ACCESS_KEY: "test-secret",
        R2_AUDIO_BUCKET: "falowen-course-audio",
        R2_AUDIO_URL_EXPIRES_SECONDS: "3600",
      },
    });

    expect(a1Mock.url).toContain("/a1/mock-hoeren/mock-01/teil-1.wav");
    expect(a1Mock.url).toContain("X-Amz-Signature=");
    expect(a1Mock.mockId).toBe("mock-01");
    expect(a1Mock.part).toBe("teil-1");

    const a2 = await createA2AudioSignedUrl({
      day: 28,
      key: "a2/day-28/day-28.mp3",
      env: {
        R2_ACCOUNT_ID: "1234567890abcdef",
        R2_ACCESS_KEY_ID: "test-access",
        R2_SECRET_ACCESS_KEY: "test-secret",
        R2_AUDIO_BUCKET: "falowen-course-audio",
        R2_AUDIO_URL_EXPIRES_SECONDS: "3600",
      },
    });

    expect(a2.url).toContain("/a2/day-28/day-28.mp3");
    expect(a2.url).toContain("X-Amz-Signature=");
    expect(a2.level).toBe("A2");

    const b1 = await createB1AudioSignedUrl({
      day: 16,
      key: "audio/day_16.mp3",
      env: {
        R2_ACCOUNT_ID: "1234567890abcdef",
        R2_ACCESS_KEY_ID: "test-access",
        R2_SECRET_ACCESS_KEY: "test-secret",
        R2_AUDIO_BUCKET: "falowen-course-audio",
        R2_AUDIO_URL_EXPIRES_SECONDS: "3600",
      },
    });

    expect(b1.url).toContain("/audio/day_16.mp3");
    expect(b1.url).toContain("X-Amz-Signature=");
    expect(b1.level).toBe("B1");

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
