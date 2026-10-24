import {
  getTimedAssignmentRemainingSeconds,
  normalizeTimedAssignmentSession,
  resolveTimedAssignmentSessionDuration,
} from "./timedAssignmentClock";

describe("timed assignment clock", () => {
  test("never displays more time than the configured assignment duration", () => {
    const now = 1_000_000;
    const staleCloudSession = {
      startedAt: now,
      endsAt: now + (106 * 60 + 1) * 1000,
    };

    expect(
      getTimedAssignmentRemainingSeconds(staleCloudSession, 45 * 60, now),
    ).toBe(45 * 60);
  });

  test("hard-caps a stale resumed session's actual expiry, not only its display", () => {
    const now = 1_000_000;
    const staleSession = {
      startedAt: now,
      endsAt: now + (106 * 60 + 1) * 1000,
    };

    expect(
      normalizeTimedAssignmentSession(staleSession, 45 * 60, now),
    ).toEqual({
      startedAt: now,
      endsAt: now + 45 * 60 * 1000,
    });
  });

  test("normalizes legacy sessions without startedAt to a one-time 45-minute maximum", () => {
    const now = 1_000_000;
    expect(
      normalizeTimedAssignmentSession(
        { endsAt: now + (106 * 60 + 1) * 1000 },
        45 * 60,
        now,
      ),
    ).toEqual({
      startedAt: now,
      endsAt: now + 45 * 60 * 1000,
    });
  });

  test("continues counting down normally below the configured cap", () => {
    const now = 1_000_000;
    const session = { endsAt: now + (12 * 60 + 34) * 1000 };

    expect(
      getTimedAssignmentRemainingSeconds(session, 45 * 60, now),
    ).toBe(12 * 60 + 34);
  });

  test("returns zero after expiry", () => {
    const now = 1_000_000;
    expect(
      getTimedAssignmentRemainingSeconds({ endsAt: now - 1000 }, 45 * 60, now),
    ).toBe(0);
  });

  test("resumed attempts retain the original promised duration after a shorter policy ships", () => {
    const start = 1_000_000;
    const newAssignmentLimit = 20 * 60;
    const oldPromisedLimit = 55 * 60;
    const persistedDuration = resolveTimedAssignmentSessionDuration(oldPromisedLimit, newAssignmentLimit);
    expect(persistedDuration).toBe(oldPromisedLimit);
    const resumedSession = normalizeTimedAssignmentSession({
      startedAt: start,
      endsAt: start + oldPromisedLimit * 1000,
    }, persistedDuration);
    expect(getTimedAssignmentRemainingSeconds(
      resumedSession, persistedDuration, start + 25 * 60 * 1000,
    )).toBe(30 * 60);
    expect(getTimedAssignmentRemainingSeconds(
      resumedSession, persistedDuration, start + 55 * 60 * 1000,
    )).toBe(0);
  });

  test("old local sessions without durationSeconds recover their original limit", () => {
    const start = 1_000_000;
    const legacySession = {
      startedAt: start,
      endsAt: start + 40 * 60 * 1000,
    };
    expect(resolveTimedAssignmentSessionDuration(undefined, 20 * 60, legacySession))
      .toBe(40 * 60);
  });

  test("new starts use the latest duration and old shorter starts never get extended", () => {
    expect(resolveTimedAssignmentSessionDuration(null, 20 * 60)).toBe(20 * 60);
    expect(resolveTimedAssignmentSessionDuration(10 * 60, 20 * 60)).toBe(10 * 60);
    expect(resolveTimedAssignmentSessionDuration(55 * 60, 20 * 60)).toBe(55 * 60);
  });

});
