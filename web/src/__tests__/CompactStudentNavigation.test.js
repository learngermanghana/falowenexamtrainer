import fs from "fs";
import path from "path";

const readSource = (relativePath) =>
  fs.readFileSync(path.resolve(__dirname, `../${relativePath}`), "utf8");

const app = readSource("App.js");
const appCss = readSource("App.css");
const healthIndicator = readSource("components/HealthIndicator.js");
const notificationBell = readSource("components/NotificationBell.js");
const courseTab = readSource("components/CourseTab.js");
const studyBuddyCss = readSource("components/StudyBuddyBar.css");

describe("compact student navigation", () => {
  it("keeps the signed-in top bar compact and moves account controls into the profile menu", () => {
    expect(app).toContain('className="app-header app-header--compact"');
    expect(app).toContain('className="app-brand"');
    expect(app).toContain('src="/logo192.png"');
    expect(app).toContain('className="profile-menu"');
    expect(app).toContain("Account settings");
    expect(app).toContain('className="profile-menu__action profile-menu__logout"');
    expect(app).not.toContain('t("appNav.signedInAs", { email: user.email })');
    expect(notificationBell).toContain('className="notification-bell-button"');
  });

  it("shows connection status only when there is a problem", () => {
    expect(healthIndicator).toContain("hasConnectionProblem");
    expect(healthIndicator).toContain('data-connection-problem="true"');
    expect(healthIndicator).toContain("Connection problem");
    expect(healthIndicator).not.toContain("<span style={{ ...styles.helperText, margin: 0, color: \"#111827\" }}>{label}</span>");
  });

  it("uses one desktop campus row and the requested mobile bottom destinations", () => {
    expect(app).toContain("const CampusPrimaryNavigation =");
    expect(app).toContain("const CampusMobileBottomNav =");
    expect(app).toContain('aria-label="Mobile campus navigation"');
    ["Learn", "Practice", "Attendance", "Results", "More"].forEach((label) => {
      expect(app).toContain(label);
    });
    expect(app).toContain('label: "Exam File"');
    expect(app).toContain('label: "Class Members"');
    expect(app).toContain('label: "Falowen Home"');
    expect(appCss).toContain(".campus-primary-nav");
    expect(appCss).toContain(".campus-mobile-bottom-nav");
    expect(appCss).toContain("min-height: 52px");
    expect(appCss).toContain("min-width: 44px");
  });

  it("keeps the Course Book first screen focused on student data and actions", () => {
    expect(courseTab).toContain('data-compact-course-hero="true"');
    expect(courseTab).toContain("Completed");
    expect(courseTab).toContain("Next lesson");
    expect(courseTab).toContain("Latest result");
    expect(courseTab).toContain("Continue learning");
    expect(courseTab).toContain("Submit work");
    expect(courseTab).toContain("latestResultScore");
    expect(courseTab).not.toContain("Your badges now use real submissions and marked scores from Falowen");
  });

  it("keeps Study Buddy and Submit above the mobile navigation", () => {
    expect(studyBuddyCss).toContain("Compact mobile navigation collision guard");
    expect(studyBuddyCss).toContain('content: "Study Buddy"');
    expect(studyBuddyCss).toContain("bottom: calc(76px + env(safe-area-inset-bottom))");
    expect(appCss).toContain(".course-book-floating-submit");
    expect(appCss).toContain("bottom: calc(76px + env(safe-area-inset-bottom)) !important");
  });
});
