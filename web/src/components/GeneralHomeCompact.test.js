const fs = require("fs");
const path = require("path");

const home = fs.readFileSync(path.join(__dirname, "GeneralHome.js"), "utf8");
const css = fs.readFileSync(path.join(__dirname, "GeneralHome.css"), "utf8");
const welcome = home.slice(home.indexOf("const WelcomeHero ="), home.indexOf("const QuickMainAccess ="));

describe("compact signed-in learner homepage", () => {
  test("welcome heading is kept without the redundant course-ready copy, badge or top Campus action", () => {
    expect(welcome).toContain('t("homeAccess.welcomeBack", { name: studentName })');
    expect(welcome).not.toContain("Open Campus");
    expect(welcome).not.toContain("course is ready.");
    expect(welcome).not.toContain("falowen-learner-hero__badge");
    expect(welcome).not.toContain("onContinueLearning");
    expect(welcome).toContain('t("homeAccess.welcomeLead")');
  });

  test("Account and Zoom stay accessible, while the main Campus card retains the real entry point", () => {
    expect(welcome).toMatch(/className="falowen-learner-hero__secondary" onClick={onOpenAccount}>\{t\("homeAccess.account"\)\}/);
    expect(welcome).toMatch(/className="falowen-learner-hero__zoom" onClick={onJoinZoom}/);
    expect(home).toContain('onClick={openCampus}>{t("homeAccess.openCourseBook")}');
    expect(home).toContain('aria-label={t("homeAccess.spaces")}');
    expect(welcome).toContain('aria-label={t("homeAccess.scheduleAria")}');
  });

  test("mobile hero starts high and uses tighter spacing so learning spaces appear sooner", () => {
    expect(css).toMatch(/\.falowen-learner-hero__welcome \{[\s\S]*?justify-content: flex-start;/);
    expect(css).toMatch(/\.falowen-learner-hero__actions \{[\s\S]*?margin-top: 16px;/);
    expect(css).toContain(".falowen-home-dashboard { padding: 12px; gap: 14px; border-radius: 12px; }");
    expect(css).toContain(".falowen-learner-hero { padding: 14px; border-radius: 15px; }");
    expect(css).toContain(".falowen-home-class-schedule { padding: 17px; }");
  });
});
