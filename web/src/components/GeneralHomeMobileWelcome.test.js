import fs from "fs";
import path from "path";

const source = fs.readFileSync(path.resolve(__dirname, "GeneralHome.js"), "utf8");
const css = fs.readFileSync(path.resolve(__dirname, "GeneralHomeWelcome.css"), "utf8");
const hero = source.slice(source.indexOf("const WelcomeHero"), source.indexOf("const QuickMainAccess"));

describe("signed-in student homepage phone layout", () => {
  test("preserves a personalized rotating headline without changing the homepage feature areas", () => {
    expect(hero).toContain("getSessionHomeMotivation({ studentId: learnerId, level: levelKey })");
    expect(hero).toContain('data-testid="home-motivation-heading"');
    expect(hero).toContain("${studentName}, ${motivation.headline}");
    expect(hero).toContain("Your {courseLabel} is ready.");
    expect(source).toContain("<QuickMainAccess");
    expect(source).toContain("<HomeMetrics");
    expect(source).toContain("<ClassCalendarCard");
  });

  test("shows Continue learning before all three secondary actions and keeps destinations intact", () => {
    expect(hero).toContain("Continue learning");
    expect(hero).toContain("className=\"falowen-welcome-primary\"");
    expect(hero).toContain("onClick={onContinueLearning}");
    expect(hero).toContain('role="group" aria-label="More student actions"');
    const primary = hero.indexOf("Continue learning");
    const account = hero.indexOf("onClick={onOpenAccount}");
    const zoom = hero.indexOf("onClick={onJoinZoom}");
    const exam = hero.indexOf("onClick={onOpenExamFile}");
    expect(primary).toBeGreaterThan(0);
    expect(primary).toBeLessThan(account);
    expect(primary).toBeLessThan(zoom);
    expect(primary).toBeLessThan(exam);
    expect(hero).toContain("<ExamReadinessBadge");
    expect(hero).toContain("Exam File");
    expect(hero).toContain('aria-label={t("generalHome.welcome.joinZoom")}');
  });

  test("uses a smaller welcome banner and a full-width accessible primary action on phones", () => {
    expect(source).toContain('import "./GeneralHomeWelcome.css"');
    expect(hero).toContain('className="falowen-student-welcome"');
    expect(css).toMatch(/@media\s*\(max-width:\s*640px\)/);
    const mobile = css.slice(css.indexOf("@media (max-width: 640px)"));
    expect(mobile).toMatch(/\.falowen-student-welcome\s*\{[^}]*padding:\s*12px 14px\s*!important/);
    expect(mobile).toMatch(/\.falowen-welcome-heading\s*\{[^}]*font-size:\s*clamp\(18px, 5vw, 21px\)\s*!important/);
    expect(mobile).toMatch(/\.falowen-welcome-primary\s*\{[^}]*width:\s*100%/);
    expect(mobile).toMatch(/\.falowen-welcome-primary\s*\{[^}]*min-height:\s*46px/);
  });

  test("presents Account, Zoom and Exam File as one compact row without mobile overflow", () => {
    const mobile = css.slice(css.indexOf("@media (max-width: 640px)"));
    expect(mobile).toMatch(/\.falowen-welcome-secondary\s*\{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/);
    expect(mobile).toMatch(/\.falowen-welcome-secondary-button\s*\{[^}]*min-width:\s*0/);
    expect(mobile).toMatch(/\.falowen-welcome-secondary-button\s*\{[^}]*min-height:\s*44px/);
    expect(mobile).toContain(".falowen-welcome-zoom-desktop { display: none; }");
    expect(mobile).toContain(".falowen-welcome-zoom-mobile { display: inline; }");
    expect(mobile).toContain(".falowen-welcome-exam-badge { display: none; }");
    expect(mobile).toContain(".falowen-welcome-mobile-exam");
    expect(css).toContain(".falowen-welcome-mobile-exam { display: none; }");
    expect(css).toContain(":focus-visible");
  });

  test("does not inject additional network or Firebase hooks into the mobile hero", () => {
    expect(hero).not.toMatch(/fetch\(|getDoc\(|getDocs\(|onSnapshot\(|setInterval\(/);
  });
});
