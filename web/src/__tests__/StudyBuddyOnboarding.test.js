import fs from "node:fs";
import path from "node:path";

const onboarding = fs.readFileSync(path.join(process.cwd(), "src/components/OnboardingChecklist.js"), "utf8");
const buddy = fs.readFileSync(path.join(process.cwd(), "src/components/StudyBuddyBar.js"), "utf8");

describe("first-login Study Buddy onboarding", () => {
  test("introduces Study Buddy and offers orientation, Day 1 and a live chat", () => {
    expect(onboarding).toContain("I’m Study Buddy, your learning partner");
    expect(onboarding).toContain("learnerFirstName");
    expect(onboarding).toContain("Show my getting started guide");
    expect(onboarding).toContain("This is a guide, not a completion tracker.");
    expect(onboarding).toContain("Start Orientation");
    expect(onboarding).toContain("Day 1 Workbook");
    expect(onboarding).toContain("Ask Study Buddy anything");
    expect(onboarding).toContain('finishAndGo("/campus?studyBuddy=open", "ask")');
  });

  test("preserves the real Day 0 teacher-navigation entry and level-specific guarded lesson route", () => {
    expect(onboarding).toContain("day0WorkbookByLevel[level]");
    expect(onboarding).toContain('dayOnePath = level ? `/campus/course/lesson/${level}/1?view=workbook`');
    expect(onboarding).toContain('finishAndGo(firstLessonPath, "video")');
    expect(onboarding).toContain('finishAndGo(dayOnePath, "day1")');
    expect(onboarding).toContain("await onSaveOnboarding?.()");
  });

  test("opens the existing chat only on explicit onboarding request", () => {
    expect(buddy).toContain('params.get("studyBuddy") !== "open"');
    expect(buddy).toContain("setIsDismissed(false)");
    expect(buddy).toContain("setIsCollapsed(false)");
    expect(buddy).toContain("params.delete(\"studyBuddy\")");
  });
});
