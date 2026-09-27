import fs from "fs";
import path from "path";

const read = (relativePath) => fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("Account upgrade course-completion gate", () => {
  const account = read("AccountSettings.js");
  const paymentBackend = fs.readFileSync(
    path.resolve(__dirname, "../../../functions/functionz/paymentAwareApp.js"),
    "utf8",
  );

  test("uses canonical Course Book completion before enabling upgrade", () => {
    expect(account).toContain('import useCourseCompletionProgress from "../hooks/useCourseCompletionProgress";');
    expect(account).toContain("courseCompletion.courseWorkCompleted === true");
    expect(account).toContain("data-upgrade-eligibility");
    expect(account).toContain("Course Book");
    expect(account).toContain("Current balance");
    expect(account).toContain("Continue Course Book");
    expect(account).toContain("Refresh progress");
    expect(account).toContain("!levelUpgrade?.courseCompleted");
  });

  test("keeps upgrade disabled while completion is incomplete or unverifiable", () => {
    expect(account).toContain('reason: "Checking your Course Book completion before upgrade."');
    expect(account).toContain("Falowen could not verify your Course Book completion");
    expect(account).toContain("Complete your ${currentLevel} Course Book first");
    expect(account).toContain("disabled={!levelUpgrade.canUpgrade || isUpgradingLevel || courseCompletionLoading}");
  });

  test("Paystack independently enforces canonical completion for queued upgrades", () => {
    expect(paymentBackend).toContain('collection("courseCompletionSnapshots")');
    expect(paymentBackend).toContain("isCourseWorkCompleteSnapshot");
    expect(paymentBackend).toContain('code: "course_completion_required"');
    expect(paymentBackend).toContain("Complete your ${currentLevel || \"current\"} Course Book before paying");
  });
});
