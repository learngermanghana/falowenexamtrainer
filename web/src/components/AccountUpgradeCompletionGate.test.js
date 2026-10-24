import fs from "fs";
import path from "path";

const read = (relativePath) => fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("Account upgrade course-completion gate", () => {
  const account = read("AccountSettings.js");
  const paymentBackend = fs.readFileSync(
    path.resolve(__dirname, "../../../functions/functionz/paymentAwareApp.js"),
    "utf8",
  );
  const courseProgressHook = fs.readFileSync(
    path.resolve(__dirname, "../hooks/useCourseCompletionProgress.js"),
    "utf8",
  );
  const lessonProgressHook = fs.readFileSync(
    path.resolve(__dirname, "../hooks/useLessonProgress.js"),
    "utf8",
  );

  test("uses canonical Course Book completion before enabling upgrade", () => {
    expect(account).toContain('import useCourseCompletionProgress from "../hooks/useCourseCompletionProgress";');
    expect(account).toContain("courseCompletion.courseWorkCompleted === true && awaitingReview === 0");
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
    expect(account).toContain("awaiting review. Upgrade opens after all required assignments have been reviewed.");
    expect(account).toContain("levelUpgrade.awaitingReview > 0");
    expect(account).toContain("disabled={!levelUpgrade.canUpgrade || isUpgradingLevel || courseCompletionLoading}");
  });

  test("Paystack derives tutor-course completion from trusted score records, not client snapshots", () => {
    expect(paymentBackend).toContain('const { getScoresForStudent } = require("./scoresSheet");');
    expect(paymentBackend).toContain('const { getCanonicalTutorAssignmentSet } = require("./routes/scoresSummaryCoursePlan");');
    expect(paymentBackend).toContain("getTrustedCourseCompletion");
    expect(paymentBackend).toContain("if (explicitLevelMatch && explicitLevelMatch[1] !== normalizedLevel) return");
    expect(paymentBackend).toContain("prefixedMatches.some((match) => match[1] !== normalizedLevel)");
    expect(paymentBackend).toContain('TRUSTED_COMPLETION_LEVELS = new Set(["A1", "A2", "B1"])');
    expect(paymentBackend).not.toContain("getCourseCompletionSnapshot");
    expect(paymentBackend).not.toContain("isCourseWorkCompleteSnapshot");
    expect(paymentBackend).toContain('code: "course_completion_required"');
  });

  test("Refresh progress retries the underlying remote lesson-progress loader", () => {
    expect(lessonProgressHook).toContain("const [refreshRevision, setRefreshRevision] = useState(0)");
    expect(lessonProgressHook).toContain("const refresh = useCallback(() => setRefreshRevision");
    expect(lessonProgressHook).toContain("[email, normalizedLevel, refreshRevision, studentCode, userId]");
    expect(lessonProgressHook).toContain("return { ...state, refresh }");
    expect(courseProgressHook).toContain('if (typeof lessonProgress.refresh === "function") lessonProgress.refresh()');
    expect(courseProgressHook).toContain("refresh,");
  });
});
