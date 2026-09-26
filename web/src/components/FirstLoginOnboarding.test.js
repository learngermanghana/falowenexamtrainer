import fs from "fs";
import path from "path";
import { getTrialAccessState, TRIAL_LENGTH_MS } from "../lib/trialAccess";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("lean first-login onboarding", () => {
  test("derives a seven-day trial from trialStartedAt when trialEndsAt has not propagated yet", () => {
    const now = new Date("2026-09-26T12:00:00Z").getTime();
    const started = new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString();

    const state = getTrialAccessState({
      trialStatus: "active",
      trialStartedAt: started,
    }, now);

    expect(state.active).toBe(true);
    expect(state.source).toBe("derived");
    expect(state.daysRemaining).toBe(5);
    expect(state.endsAtMs).toBe(new Date(started).getTime() + TRIAL_LENGTH_MS);
  });

  test("does not grant an undated trial only because trialStatus says active", () => {
    const state = getTrialAccessState({ trialStatus: "active" }, Date.now());
    expect(state.active).toBe(false);
    expect(state.source).toBe("missing-start");
  });

  test("explicit trialEndsAt remains authoritative", () => {
    const now = new Date("2026-09-26T12:00:00Z").getTime();
    const state = getTrialAccessState({
      trialStatus: "active",
      trialStartedAt: "2026-09-01T00:00:00Z",
      trialEndsAt: "2026-09-27T12:00:00Z",
    }, now);

    expect(state.active).toBe(true);
    expect(state.source).toBe("explicit");
    expect(state.daysRemaining).toBe(1);
  });

  test("first-login panel uses only existing student profile data", () => {
    const source = read("OnboardingChecklist.js");

    [
      "studentProfile?.className",
      "studentProfile?.paymentStatus",
      "studentProfile?.balanceDue",
      "detectLevelKey(studentProfile)",
      "getTrialAccessState(studentProfile)",
      "Start learning",
      "View class details",
      "Pay now",
      "What happens next?",
    ].forEach((contract) => expect(source).toContain(contract));

    expect(source).not.toContain("LESSON_VIDEO_DICTIONARY");
    expect(source).not.toContain("watchedVideo");
    expect(source).not.toContain("YouTubeSubscribeButton");
  });

  test("onboarding completion remains the only profile write from the route", () => {
    const app = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");
    expect(app).toContain("onSaveOnboarding={() => saveStudentProfile({ onboardingCompleted: true })}");
    expect(app).toContain("getTrialAccessState(studentProfile)");
  });
});
