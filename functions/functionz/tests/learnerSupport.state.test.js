jest.mock("firebase-admin", () => ({
  auth: () => ({ verifyIdToken: jest.fn() }),
  firestore: jest.fn(),
}));

const {
  resolveLearnerAccess,
  buildNextAction,
  normalizeProgressStatus,
  completionNextLesson,
  learnerSupportStateHandler,
} = require("../routes/learnerSupport");

describe("learner support state", () => {
  const now = Date.parse("2026-09-26T12:00:00Z");

  test("requires Firebase authentication", async () => {
    const req = { method: "GET", headers: {}, query: {} };
    const payloads = [];
    const res = {
      statusCode: 200,
      status(code) { this.statusCode = code; return this; },
      json(payload) { payloads.push(payload); return payload; },
      setHeader: jest.fn(),
    };

    await learnerSupportStateHandler(req, res);

    expect(res.statusCode).toBe(401);
    expect(payloads[0]).toEqual({ ok: false, error: "Authentication required" });
  });

  test("keeps an unpaid learner active during the seven-day trial", () => {
    const access = resolveLearnerAccess(
      {
        status: "pending",
        paymentStatus: "pending",
        trialStartedAt: "2026-09-22T12:00:00Z",
        tuitionFee: 2800,
        balanceDue: 2800,
      },
      now,
    );

    expect(access).toMatchObject({
      allowed: true,
      state: "trial-active",
      reason: "trial_access",
    });
    expect(access.trialEndsAt).toBe("2026-09-29T12:00:00.000Z");
  });

  test("blocks course access immediately after an unpaid trial ends", () => {
    const access = resolveLearnerAccess(
      {
        status: "trial_expired",
        paymentStatus: "pending",
        trialStartedAt: "2026-09-10T12:00:00Z",
        tuitionFee: 2800,
        balanceDue: 2800,
      },
      now,
    );

    expect(access).toMatchObject({
      allowed: false,
      state: "trial-ended",
      reason: "trial_ended",
    });

    expect(buildNextAction({ access, level: "A1" })).toMatchObject({
      type: "complete-payment",
      url: "/campus/account?tab=billing",
    });
  });

  test("distinguishes paid active access from an ended contract", () => {
    expect(
      resolveLearnerAccess(
        {
          status: "Active",
          paymentStatus: "paid",
          tuitionFee: 2800,
          balanceDue: 0,
          contractEnd: "2026-10-30T00:00:00Z",
        },
        now,
      ),
    ).toMatchObject({ allowed: true, state: "paid-active" });

    expect(
      resolveLearnerAccess(
        {
          status: "Active",
          paymentStatus: "paid",
          tuitionFee: 2800,
          balanceDue: 0,
          contractEnd: "2026-09-20T00:00:00Z",
        },
        now,
      ),
    ).toMatchObject({ allowed: false, state: "contract-ended" });
  });

  test("prioritizes failed work before the next unfinished lesson", () => {
    const action = buildNextAction({
      access: { allowed: true, state: "paid-active" },
      level: "B1",
      review: {
        needsImprovement: true,
        lesson: {
          title: "Medien & Homeoffice",
          route: "/campus/course/lesson/B1/15?chapter=5.15",
        },
      },
      completion: {
        nextDay: 16,
        nextChapter: "6.16",
        nextRoute: "/campus/course/lesson/B1/16?chapter=6.16",
      },
    });

    expect(action).toEqual({
      type: "review-and-retry",
      label: "Review and improve Medien & Homeoffice",
      reason: "latest_work_needs_improvement",
      url: "/campus/course/lesson/B1/15?chapter=5.15",
    });
  });

  test("continues to the canonical next lesson while marking is pending", () => {
    const action = buildNextAction({
      access: { allowed: true, state: "paid-active" },
      level: "A2",
      review: { pending: true },
      completion: {
        level: "A2",
        nextDay: 6,
        nextChapter: "3.6",
        nextLabel: "Möbel & Räume",
        nextRoute: "/campus/course/lesson/A2/6?chapter=3.6&view=workbook",
        awaitingReview: 1,
      },
    });

    expect(action).toMatchObject({
      type: "continue-course",
      label: "Continue: Möbel & Räume",
      reason: "continue_while_marking_pending",
      url: "/campus/course/lesson/A2/6?chapter=3.6&view=workbook",
    });
  });

  test("moves completed learners to exam practice", () => {
    const action = buildNextAction({
      access: { allowed: true, state: "paid-active" },
      level: "B2",
      review: { status: "none" },
      completion: { courseWorkCompleted: true },
    });

    expect(action).toMatchObject({
      type: "exam-practice",
      url: "/exams/overview",
    });
  });

  test("normalizes marking states and next lesson routes", () => {
    expect(normalizeProgressStatus({ reviewStatus: "pending_review" })).toBe("submitted");
    expect(normalizeProgressStatus({ score: 42, status: "failed" })).toBe("failed");

    expect(
      completionNextLesson(
        {
          level: "C1",
          nextDay: 16,
          nextChapter: "6.16",
          nextLabel: "Arbeit und Gesellschaft",
        },
        "C1",
      ),
    ).toMatchObject({
      level: "C1",
      day: 16,
      route: "/campus/course/lesson/C1/16?chapter=6.16",
    });
  });
});
