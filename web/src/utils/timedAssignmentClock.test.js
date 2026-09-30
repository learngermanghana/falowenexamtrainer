import {
  getTimedAssignmentRemainingSeconds,
  normalizeTimedAssignmentSession,
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
});
