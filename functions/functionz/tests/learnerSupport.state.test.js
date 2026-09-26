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
  safeResumeState,
  buildDailyLearningPlan,
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

  test("resumes the exact unfinished cloud section before a later untouched lesson", () => {
    const action = buildNextAction({
      access: { allowed: true, state: "paid-active" },
      level: "B2",
      review: { status: "none", pending: false },
      resume: {
        level: "B2",
        day: 6,
        title: "Migration und Integration",
        activeView: "hoeren",
        lastRoute: "/campus/course/lesson/B2/6?view=hoeren&radio=done",
        completed: false,
      },
      completion: {
        level: "B2",
        nextDay: 7,
        nextLabel: "Gesellschaftliche Vielfalt",
        nextRoute: "/campus/course/lesson/B2/7",
      },
    });

    expect(action).toEqual({
      type: "resume-learning",
      label: "Continue Migration und Integration · Hören",
      reason: "resume_last_active_section",
      url: "/campus/course/lesson/B2/6?view=hoeren&radio=done",
    });
  });

  test("keeps marking-pending progression ahead of an old Submit resume", () => {
    const action = buildNextAction({
      access: { allowed: true, state: "paid-active" },
      level: "A2",
      review: { pending: true },
      resume: {
        level: "A2",
        day: 5,
        activeView: "submit",
        lastRoute: "/campus/course/a2-day-5-workbook?view=submit&radio=done",
        completed: false,
      },
      completion: {
        level: "A2",
        nextDay: 6,
        nextLabel: "Möbel & Räume",
        nextRoute: "/campus/course/lesson/A2/6?chapter=3.6",
        awaitingReview: 1,
      },
    });

    expect(action).toMatchObject({
      type: "continue-course",
      reason: "continue_while_marking_pending",
      url: "/campus/course/lesson/A2/6?chapter=3.6",
    });
  });

  test("returns safe cross-device Radio and section state", () => {
    expect(
      safeResumeState({
        level: "C1",
        day: 16,
        chapter: "3.1",
        title: "Technologie im Alltag",
        activeView: "write",
        lastRoute: "/campus/course/lesson/C1/16?view=write&radio=done",
        sections: { learn: true, speak: true, write: false, secret: "ignore" },
        radioDone: true,
        completed: false,
        lastActivityAtClient: "2026-09-26T07:30:00.000Z",
      }),
    ).toEqual({
      level: "C1",
      day: 16,
      chapter: "3.1",
      title: "Technologie im Alltag",
      activeView: "write",
      lastRoute: "/campus/course/lesson/C1/16?view=write&radio=done",
      sections: { learn: true, speak: true, write: false },
      completed: false,
      radioDone: true,
      lastActivityAt: "2026-09-26T07:30:00.000Z",
    });
  });

  test("daily plan prioritizes failed work before resume and attendance", () => {
    const plan = buildDailyLearningPlan({
      access: { allowed: true, state: "paid-active" },
      level: "B1",
      review: {
        needsImprovement: true,
        lesson: {
          title: "Medien & Homeoffice",
          route: "/campus/course/lesson/B1/15?chapter=5.15",
        },
        updatedAt: "2026-09-26T09:00:00.000Z",
      },
      resume: {
        level: "B1",
        day: 16,
        title: "Bewerbung",
        activeView: "schreiben",
        lastRoute: "/campus/course/lesson/B1/16?view=schreiben",
        completed: false,
        lastActivityAt: "2026-09-26T10:00:00.000Z",
      },
      attendance: { available: true, rate: 65 },
      completion: { completionPercent: 48 },
      nowMs: now,
    });

    expect(plan.items[0]).toMatchObject({
      id: "repair-latest-work",
      type: "review-and-retry",
      title: "Improve: Medien & Homeoffice",
      url: "/campus/course/lesson/B1/15?chapter=5.15",
    });
    expect(plan.items.some((item) => item.id === "attendance-reset")).toBe(true);
    expect(plan.items.some((item) => item.id === "resume-last-section")).toBe(false);
  });

  test("daily plan moves forward while tutor marking is pending", () => {
    const plan = buildDailyLearningPlan({
      access: { allowed: true, state: "paid-active" },
      level: "A2",
      review: { pending: true, updatedAt: "2026-09-26T11:00:00.000Z" },
      resume: {
        level: "A2",
        day: 5,
        activeView: "submit",
        lastRoute: "/campus/course/lesson/A2/5?view=submit",
        completed: false,
      },
      completion: {
        nextDay: 6,
        nextChapter: "3.6",
        nextLabel: "Möbel & Räume",
        nextRoute: "/campus/course/lesson/A2/6?chapter=3.6",
        awaitingReview: 1,
      },
      nowMs: now,
    });

    expect(plan.items[0]).toMatchObject({
      id: "continue-while-marking",
      reason: "continue_while_marking_pending",
      url: "/campus/course/lesson/A2/6?chapter=3.6",
    });
    expect(plan.items.some((item) => item.id === "resume-last-section")).toBe(false);
  });

  test("daily plan adds a return warm-up after three inactive days without overriding resume", () => {
    const plan = buildDailyLearningPlan({
      access: { allowed: true, state: "paid-active" },
      level: "C1",
      review: { status: "none" },
      resume: {
        level: "C1",
        day: 16,
        title: "Technologie im Alltag",
        activeView: "write",
        lastRoute: "/campus/course/lesson/C1/16?view=write&radio=done",
        completed: false,
        radioDone: true,
        lastActivityAt: "2026-09-20T12:00:00.000Z",
      },
      completion: { completionPercent: 52 },
      nowMs: now,
    });

    expect(plan.items[0]).toMatchObject({
      id: "resume-last-section",
      title: "Finish Technologie im Alltag · Write",
    });
    expect(plan.items[1]).toMatchObject({
      id: "return-warmup",
      type: "warmup-review",
    });
    expect(plan.inactivityDays).toBe(6);
  });

  test("daily plan adds A1 finish preparation near course completion", () => {
    const plan = buildDailyLearningPlan({
      access: { allowed: true, state: "paid-active" },
      level: "A1",
      review: { status: "none" },
      completion: {
        completionPercent: 86,
        nextDay: 22,
        nextLabel: "Final review",
        nextRoute: "/campus/course/lesson/A1/22",
        courseWorkCompleted: false,
      },
      nowMs: now,
    });

    expect(plan.items[0]).toMatchObject({
      id: "next-course-item",
      url: "/campus/course/lesson/A1/22",
    });
    expect(plan.items.some((item) => item.id === "a1-finish-prep")).toBe(true);
  });

  test("daily plan uses one access-restoration item when access is blocked", () => {
    const plan = buildDailyLearningPlan({
      access: { allowed: false, state: "trial-ended", reason: "trial_ended" },
      nextAction: {
        type: "complete-payment",
        label: "Complete payment to continue after your trial",
        reason: "trial_ended",
        url: "/campus/account?tab=billing",
      },
      level: "A1",
      nowMs: now,
    });

    expect(plan.items).toHaveLength(1);
    expect(plan.primaryAction).toMatchObject({
      id: "restore-access",
      type: "complete-payment",
      url: "/campus/account?tab=billing",
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
