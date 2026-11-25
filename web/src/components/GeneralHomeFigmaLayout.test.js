import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.join(__dirname, name), "utf8");

describe("Figma-inspired signed-in learner homepage", () => {
  const home = read("GeneralHome.js");
  const styles = read("GeneralHome.css");
  const readiness = read("ExamReadinessBadge.js");

  test("has accessible welcome, class timetable card and two learning cards", () => {
    expect(home).toContain('className="falowen-learner-hero__welcome"');
    expect(home).toContain('t("homeAccess.liveClass")');
    expect(home).toContain('t("homeAccess.viewSchedule")');
    expect(home).toContain('t("homeAccess.manageClass")');
    expect(home).not.toContain("<ExamReadinessBadge");
    expect(home).toContain('t("homeAccess.spaces")');
    expect(home).toContain('t("homeAccess.welcomeBack", { name: studentName })');
    expect(home).toContain('<h3>{t("homeAccess.examsRoom")}</h3>');
    expect(home).toContain('t("homeAccess.openCourseBook")');
    expect(home).toContain('t("homeAccess.openExams")');
    expect(home).toContain("onJoinZoom={joinZoom}");
  });

  test("links the assigned class to the existing full timetable route", () => {
    expect(home).toContain("getHomeClassIdentity(studentProfile)");
    expect(home).toContain("buildFullClassScheduleUrl({ className: preferredClass, classId: preferredClassId })");
    expect(home).toContain('navigate("/campus/account")');
    expect(home).toContain("onViewClassSchedule={openFullClassSchedule}");
    expect(readiness).toContain('if (variant === "homepage")'); // Legacy reusable component remains intact.
  });

  test("preserves Kiswahili without showing German exam preparation", () => {
    expect(home).toContain('isSwahili ? " falowen-learner-hero--single"');
    expect(home).toContain('{!isSwahili && (');
    expect(home).toContain('isSwahili && !openExamsRoom ? " falowen-home-spaces__grid--single"');
  });

  test("does not reuse the public landing page hero selector", () => {
    const marketing = read("LandingPageMarketing.css");
    expect(marketing).toContain(".falowen-home-hero {");
    expect(home).toContain('className={"falowen-learner-hero"');
    expect(home).not.toContain("falowen-home-hero");
    expect(styles).toContain(".falowen-learner-hero {");
    expect(styles).not.toContain(".falowen-home-hero {");
    expect(styles).toContain("background: transparent;");
  });

  test("responds to mobile widths and keyboard focus", () => {
    expect(styles).toContain("@media (max-width: 900px)");
    expect(styles).toContain("@media (max-width: 680px)");
    expect(styles).toContain(".falowen-home-dashboard button:focus-visible");
    expect(styles).toContain(".falowen-home-class-schedule {");
    expect(styles).toContain(".falowen-home-section-break {");
    expect(styles).toContain(".falowen-home-spaces__grid:not(.falowen-home-spaces__grid--single)::before");
    expect(styles).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
