const {
  TRIAL_ACTIVE_STATUS,
  TRIAL_EXPIRED_STATUS,
  getTrialLifecycle,
  isTrialStudent,
} = require("../trialLifecycle");

describe("seven-day trial lifecycle", () => {
  const startedAt = "2026-09-01T12:00:00.000Z";
  const endsAt = "2026-09-08T12:00:00.000Z";
  const deletesAt = "2026-10-08T12:00:00.000Z";
  const trial = {
    enrollmentType: "trial",
    status: TRIAL_ACTIVE_STATUS,
    paymentStatus: "pending",
    initialPaymentAmount: 0,
    trialStartedAt: startedAt,
    trialEndsAt: endsAt,
    contractStart: startedAt,
    contractEnd: endsAt,
    dataDeleteAt: deletesAt,
  };

  test("keeps learning access active for seven days", () => {
    const lifecycle = getTrialLifecycle(trial, "2026-09-08T11:59:59.000Z");
    expect(lifecycle.isTrial).toBe(true);
    expect(lifecycle.isActive).toBe(true);
    expect(lifecycle.isRetained).toBe(false);
    expect(lifecycle.shouldPurge).toBe(false);
  });

  test("retains the expired account and progress for thirty days", () => {
    const lifecycle = getTrialLifecycle(
      { ...trial, status: TRIAL_EXPIRED_STATUS },
      "2026-09-20T12:00:00.000Z"
    );
    expect(lifecycle.isActive).toBe(false);
    expect(lifecycle.isExpired).toBe(true);
    expect(lifecycle.isRetained).toBe(true);
    expect(lifecycle.shouldPurge).toBe(false);
  });

  test("purges at the retention boundary", () => {
    const lifecycle = getTrialLifecycle(trial, deletesAt);
    expect(lifecycle.isRetained).toBe(false);
    expect(lifecycle.shouldPurge).toBe(true);
  });

  test("payment converts the same profile out of trial handling", () => {
    expect(
      isTrialStudent({
        ...trial,
        enrollmentType: "paid",
        paymentStatus: "partial",
        initialPaymentAmount: 2000,
      })
    ).toBe(false);
  });

  test("recognizes legacy unpaid seven-day records", () => {
    expect(
      isTrialStudent({
        paymentStatus: "pending",
        initialPaymentAmount: 0,
        contractStart: startedAt,
        contractEnd: endsAt,
      })
    ).toBe(true);
  });
});
