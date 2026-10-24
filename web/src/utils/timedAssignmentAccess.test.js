import {
  isTimedAssignmentReviewUnlocked,
  isTimedAssignmentTabLocked,
} from "./timedAssignmentAccess";

const timedTabs = ["schreiben", "lesen", "hoeren"];

describe("timed assignment review access", () => {
  test("a passed used attempt reopens timed tabs for review", () => {
    const reviewUnlocked = isTimedAssignmentReviewUnlocked({
      attemptState: "submitted",
      progress: { status: "passed", passed: true },
    });

    expect(reviewUnlocked).toBe(true);
    expect(isTimedAssignmentTabLocked({
      enabled: true,
      timedTabs,
      attemptState: "submitted",
      secondsLeft: 0,
      tabKey: "schreiben",
      reviewUnlocked,
    })).toBe(false);
    expect(isTimedAssignmentTabLocked({
      enabled: true,
      timedTabs,
      attemptState: "submitted",
      secondsLeft: 0,
      tabKey: "lesen",
      reviewUnlocked,
    })).toBe(false);
  });

  test("submitted work stays locked while the result is pending", () => {
    const reviewUnlocked = isTimedAssignmentReviewUnlocked({
      attemptState: "submitted",
      progress: { status: "submitted", passed: false },
    });

    expect(reviewUnlocked).toBe(false);
    expect(isTimedAssignmentTabLocked({
      enabled: true,
      timedTabs,
      attemptState: "submitted",
      secondsLeft: 0,
      tabKey: "lesen",
      reviewUnlocked,
    })).toBe(true);
  });

  test("verified failed work unlocks sections for review without reopening the timed attempt", () => {
    const reviewUnlocked = isTimedAssignmentReviewUnlocked({
      attemptState: "submitted",
      progress: { status: "failed", passed: false, failed: true, hasResult: true, bestScore: 40 },
    });

    expect(reviewUnlocked).toBe(true);
    expect(isTimedAssignmentTabLocked({
      enabled: true,
      timedTabs,
      attemptState: "submitted",
      secondsLeft: 0,
      tabKey: "schreiben",
      reviewUnlocked,
    })).toBe(false);
  });

  test("unverified failures, expired unsubmitted work, and reset timers do not unlock review", () => {
    const failed = { status: "failed", failed: true, passed: false, hasResult: true };
    expect(isTimedAssignmentReviewUnlocked({
      attemptState: "submitted", progress: { ...failed, hasResult: false },
    })).toBe(false);
    expect(isTimedAssignmentReviewUnlocked({ attemptState: "expired", progress: failed })).toBe(false);
    expect(isTimedAssignmentReviewUnlocked({ attemptState: "none", progress: failed })).toBe(false);
    expect(isTimedAssignmentReviewUnlocked({ attemptState: "active", progress: failed })).toBe(false);
  });

  test("active timed work remains open regardless of grade history", () => {
    expect(isTimedAssignmentReviewUnlocked({
      attemptState: "active",
      progress: { status: "passed", passed: true },
    })).toBe(false);

    expect(isTimedAssignmentTabLocked({
      enabled: true,
      timedTabs,
      attemptState: "active",
      secondsLeft: 120,
      tabKey: "hoeren",
      reviewUnlocked: false,
    })).toBe(false);
  });

  test("pre-start timed work and Submit stay locked but preparation tabs remain open", () => {
    expect(isTimedAssignmentTabLocked({
      enabled: true,
      timedTabs,
      attemptState: "none",
      secondsLeft: 2400,
      tabKey: "lesen",
    })).toBe(true);
    expect(isTimedAssignmentTabLocked({
      enabled: true,
      timedTabs,
      attemptState: "none",
      secondsLeft: 2400,
      tabKey: "submit",
    })).toBe(true);
    expect(isTimedAssignmentTabLocked({
      enabled: true,
      timedTabs,
      attemptState: "none",
      secondsLeft: 2400,
      tabKey: "grammar",
    })).toBe(false);
  });
});
