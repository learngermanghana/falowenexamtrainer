import fs from "fs";
import path from "path";
import { getTrialLifecycleState, TRIAL_LENGTH_MS, TRIAL_RETENTION_MS } from "../lib/trialAccess";

const DAY_MS = 24 * 60 * 60 * 1000;
const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("central trial lifecycle", () => {
  test("active trial becomes ending soon during the final two days", () => {
    const now = new Date("2026-09-26T12:00:00Z").getTime();
    const state = getTrialLifecycleState({
      trialStatus: "active",
      trialStartedAt: new Date(now - 6 * DAY_MS).toISOString(),
    }, now);

    expect(state.key).toBe("ending_soon");
    expect(state.active).toBe(true);
    expect(state.daysRemaining).toBe(1);
  });

  test("expired trial keeps a 30-day recovery window", () => {
    const now = new Date("2026-09-26T12:00:00Z").getTime();
    const start = now - 10 * DAY_MS;
    const state = getTrialLifecycleState({
      trialStatus: "active",
      trialStartedAt: new Date(start).toISOString(),
    }, now);

    expect(state.key).toBe("expired_retained");
    expect(state.active).toBe(false);
    expect(state.endsAtMs).toBe(start + TRIAL_LENGTH_MS);
    expect(state.purgeAtMs).toBe(start + TRIAL_LENGTH_MS + TRIAL_RETENTION_MS);
    expect(state.retentionDaysRemaining).toBe(27);
  });

  test("recovery window warns during its final three days", () => {
    const now = new Date("2026-09-26T12:00:00Z").getTime();
    const end = now - 28 * DAY_MS;
    const state = getTrialLifecycleState({
      trialEndsAt: new Date(end).toISOString(),
      trialPurgeAt: new Date(end + 30 * DAY_MS).toISOString(),
    }, now);

    expect(state.key).toBe("retention_ending_soon");
    expect(state.retentionDaysRemaining).toBe(2);
  });

  test("confirmed part payment converts trial messaging immediately", () => {
    const now = Date.now();
    const state = getTrialLifecycleState({
      trialStatus: "active",
      trialStartedAt: new Date(now - DAY_MS).toISOString(),
      paymentStatus: "partial",
      paid: 2000,
      balanceDue: 1000,
    }, now);

    expect(state.key).toBe("converted");
    expect(state.paid).toBe(true);
    expect(state.active).toBe(false);
  });

  test("signup payment intent does not count as confirmed payment", () => {
    const now = Date.now();
    const state = getTrialLifecycleState({
      trialStatus: "active",
      trialStartedAt: new Date(now - DAY_MS).toISOString(),
      paymentStatus: "pending",
      initialPaymentAmount: 3000,
      tuitionFee: 3000,
      balanceDue: 3000,
    }, now);

    expect(["active", "ending_soon"]).toContain(state.key);
    expect(state.paid).toBe(false);
  });

  test("dashboard, onboarding, billing and checkpoint all use the shared lifecycle", () => {
    const files = [
      "TrialCountdownBanner.js",
      "OnboardingChecklist.js",
      "AccountSettings.js",
      "SetupCheckpoint.js",
    ];

    files.forEach((file) => {
      expect(read(file)).toContain("getTrialLifecycleState");
    });

    expect(read("TrialCountdownBanner.js")).toContain("Trial ending soon");
    expect(read("AccountSettings.js")).toContain("Trial expired · data retained");
    expect(read("AccountSettings.js")).toContain("Recovery window ending soon");
    expect(read("SetupCheckpoint.js")).toContain("recovery window is nearly over");
  });

  test("app access gating uses the same lifecycle", () => {
    const source = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");
    expect(source).toContain("getTrialLifecycleState(studentProfile)");
    expect(source).toContain("const hasActiveTrial = trialLifecycle.active");
  });
});
