const {
  B1_COURSE_SPEAKING_MS, sessionDeadline, visibleExpiry, firestoreTimeMs,
} = require("../courseSpeakingSessionClock");

const session = (minutes, startedMinutesAgo, assignment = "B1-7.23") => ({
  expiresAt: new Date(Date.now() + minutes * 60000).toISOString(),
  startedAt: { seconds: Math.floor((Date.now() - startedMinutesAgo * 60000) / 1000) },
  examTask: { courseAssignmentKey: assignment },
});

describe("graded B1 course speaking clock", () => {
  test("a fresh B1 session has exactly a 20-minute server-owned window", () => {
    expect(B1_COURSE_SPEAKING_MS).toBe(1200000);
    const now = Date.now();
    const exam = { expiresAt: new Date(now + B1_COURSE_SPEAKING_MS).toISOString(),
      startedAt: new Date(now), examTask: { courseAssignmentKey: "B1-7.23" } };
    expect(sessionDeadline(exam)).toBe(now + B1_COURSE_SPEAKING_MS);
  });

  test("older 70-minute B1 sessions are capped using Firestore startedAt", () => {
    const old = session(70, 3);
    expect(sessionDeadline(old)).toBeLessThanOrEqual(Date.now() + 17 * 60000);
    expect(sessionDeadline(old)).toBeGreaterThan(Date.now() + 16 * 60000);
    expect(Date.parse(visibleExpiry(old))).toBe(sessionDeadline(old));
  });

  test("a resumed incomplete Teil gets its own renewed bounded window", () => {
    const old = session(70, 25);
    expect(sessionDeadline(old)).toBeLessThan(Date.now());
    const renewed = { ...old, expiresAt: new Date(Date.now() + B1_COURSE_SPEAKING_MS).toISOString(),
      windowStartedAt: { toMillis: () => Date.now() } };
    expect(sessionDeadline(renewed)).toBeGreaterThan(Date.now() + 19 * 60000);
    expect(firestoreTimeMs(renewed.windowStartedAt)).toBeGreaterThan(0);
  });

  test("A1/A2 and ordinary B1 examiner sessions retain their own timing", () => {
    for (const key of ["A1-5.9", "A2-8.22", null]) {
      const ordinary = session(70, 3, key);
      expect(sessionDeadline(ordinary)).toBe(Date.parse(ordinary.expiresAt));
    }
  });

  test("existing sessions with missing start timestamp keep their stored deadline", () => {
    const old = { expiresAt: new Date(Date.now() + 70000).toISOString(),
      examTask: { courseAssignmentKey: "B1-7.23" } };
    expect(visibleExpiry(old)).toBe(old.expiresAt);
  });
});
