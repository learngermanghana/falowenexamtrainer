import fs from "node:fs";
import path from "node:path";

const onboarding = fs.readFileSync(path.join(process.cwd(), "src/components/OnboardingChecklist.js"), "utf8");
const buddy = fs.readFileSync(path.join(process.cwd(), "src/components/StudyBuddyBar.js"), "utf8");

describe("first-login Study Buddy onboarding", () => {
  test("keeps a single orientation entry and moves Study Buddy under help", () => {
    expect(onboarding).toContain("learnerFirstName");
    expect(onboarding).toContain("Where can I get help?");
    expect(onboarding).toContain("Ask Study Buddy");
    expect(onboarding).not.toContain("showWorkbookGuide");
    expect(onboarding).not.toContain("showGettingStarted");
    expect(onboarding).toContain('finishAndGo(firstLessonPath, "orientation")');
    expect(onboarding).toContain('finishAndGo("/campus/course", "course")');
    expect(onboarding).toContain("await onSaveOnboarding?.()");
  });

  test("opens the existing chat only on explicit onboarding request", () => {
    expect(buddy).toContain('params.get("studyBuddy") !== "open"');
    expect(buddy).toContain("setIsDismissed(false)");
    expect(buddy).toContain("setIsCollapsed(false)");
    expect(buddy).toContain("params.delete(\"studyBuddy\")");
  });
});
