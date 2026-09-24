import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appPath = path.join(root, "web/src/App.js");
const appCssPath = path.join(root, "web/src/App.css");
const healthPath = path.join(root, "web/src/components/HealthIndicator.js");
const notificationPath = path.join(root, "web/src/components/NotificationBell.js");
const courseTabPath = path.join(root, "web/src/components/CourseTab.js");
const studyBuddyCssPath = path.join(root, "web/src/components/StudyBuddyBar.css");

let app = fs.readFileSync(appPath, "utf8");
let appCss = fs.readFileSync(appCssPath, "utf8");
let health = fs.readFileSync(healthPath, "utf8");
let notification = fs.readFileSync(notificationPath, "utf8");
let courseTab = fs.readFileSync(courseTabPath, "utf8");
let studyBuddyCss = fs.readFileSync(studyBuddyCssPath, "utf8");

const replaceOnce = (source, before, after, label) => {
  if (source.includes(after)) return source;
  if (!source.includes(before)) throw new Error(`Compact navigation patch anchor missing: ${label}`);
  return source.replace(before, after);
};

const replaceRange = (source, startMarker, endMarker, replacement, label) => {
  if (source.includes(replacement.trim().slice(0, 80))) return source;
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  if (start === -1 || end === -1) throw new Error(`Compact navigation range missing: ${label}`);
  return `${source.slice(0, start)}${replacement}${source.slice(end)}`;
};

// Compact top bar: brand + notifications + profile. Account controls move into the profile menu.
if (!app.includes("const getProfileInitials =")) {
  app = replaceOnce(
    app,
    `const AppShell = ({`,
    `const getProfileInitials = (studentProfile = {}, user = {}) => {
  const raw =
    studentProfile?.name ||
    studentProfile?.fullName ||
    studentProfile?.displayName ||
    user?.displayName ||
    user?.email ||
    "F";
  const clean = String(raw || "").trim();
  const parts = clean.includes("@") ? [clean.split("@")[0]] : clean.split(/\\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part.charAt(0)).join("").toUpperCase() || "F";
};

const AppShell = ({`,
    "profile initials helper",
  );
}

app = replaceOnce(
  app,
  `  const resolvedInterfaceLanguage = i18n.resolvedLanguage || i18n.language;`,
  `  const resolvedInterfaceLanguage = i18n.resolvedLanguage || i18n.language;
  const profileInitials = getProfileInitials(studentProfile, user);`,
  "profile initials state",
);

app = replaceOnce(
  app,
  `      className={isOnboarding ? "onboarding-shell" : "app-shell"}`,
  `      className={
        isOnboarding
          ? "onboarding-shell"
          : \`app-shell${location.pathname.startsWith("/campus") ? " has-campus-bottom-nav" : ""}\`
      }`,
  "campus shell class",
);

if (!app.includes('className="app-header app-header--compact"')) {
  const headerStart = `        <header\n        className="app-header"`;
  const headerEnd = `        </header>`;
  const start = app.indexOf(headerStart);
  const end = app.indexOf(headerEnd, start) + headerEnd.length;
  if (start === -1 || end < headerEnd.length) throw new Error("Compact header block not found.");
  const compactHeader = `        <header className="app-header app-header--compact">
          <button type="button" className="app-brand" onClick={() => navigate("/")} aria-label="Falowen Home">
            <img src="/logo192.png" alt="" aria-hidden="true" />
            <span>Falowen</span>
          </button>

          <div className="app-header-actions">
            <HealthIndicator />
            <NotificationBell
              notificationStatus={notificationStatus}
              onEnablePush={enableNotifications}
            />
            <details className="profile-menu">
              <summary className="profile-menu__trigger" aria-label="Open profile menu">
                <span aria-hidden="true">{profileInitials}</span>
              </summary>
              <div className="profile-menu__panel">
                <div className="profile-menu__identity">
                  <span>Signed in</span>
                  <strong>{user.email}</strong>
                </div>
                <label className="profile-menu__language">
                  <span>{t("interfaceLanguage.shortLabel")}</span>
                  <select
                    value={resolvedInterfaceLanguage}
                    onChange={handleInterfaceLanguageChange}
                    aria-label={t("interfaceLanguage.ariaLabel")}
                  >
                    {interfaceLanguageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <button type="button" className="profile-menu__action" onClick={() => navigate("/campus/account")}>
                  Account settings
                </button>
                <button type="button" className="profile-menu__action profile-menu__logout" onClick={logout}>
                  {t("appNav.logout")}
                </button>
              </div>
            </details>
          </div>
        </header>`;
  app = `${app.slice(0, start)}${compactHeader}${app.slice(end)}`;
}

// Shared campus navigation. Desktop uses one horizontal row; mobile uses a fixed five-destination bar.
if (!app.includes("const CampusPrimaryNavigation =")) {
  const quickStart = `const CampusQuickNavigation = ({ allowedSections, availableTabs, tabStructure }) => {`;
  const campusAreaMarker = `const CampusArea = ({`;
  const start = app.indexOf(quickStart);
  const end = app.indexOf(campusAreaMarker, start);
  if (start === -1 || end === -1) throw new Error("CampusQuickNavigation block not found.");

  const navigationHelpers = `const getCampusNavigationItems = (allowedSections = {}) => [
  { key: "learn", label: "Learn", route: "/campus/course", enabled: true },
  { key: "practice", label: "Practice", route: "/campus/vocab", enabled: Boolean(allowedSections.vocab) },
  { key: "attendance", label: "Attendance", route: "/campus/attendance", enabled: Boolean(allowedSections.attendance) },
  { key: "results", label: "Results", route: "/campus/results", enabled: Boolean(allowedSections.results) },
  { key: "examFile", label: "Exam File", route: "/campus/examFile", enabled: Boolean(allowedSections.examFile) },
  { key: "classMembers", label: "Class Members", route: "/campus/classMembers", enabled: Boolean(allowedSections.classMembers) },
  { key: "home", label: "Falowen Home", route: "/", enabled: true },
].filter((item) => item.enabled);

const isCampusNavigationItemActive = (item, location) => {
  if (item.key === "learn") return location.pathname.startsWith("/campus/course");
  if (item.key === "practice") return location.pathname.startsWith("/campus/vocab");
  if (item.key === "attendance") return location.pathname.startsWith("/campus/attendance");
  if (item.key === "results") return location.pathname.startsWith("/campus/results");
  if (item.key === "examFile") return location.pathname.startsWith("/campus/examFile");
  if (item.key === "classMembers") return location.pathname.startsWith("/campus/classMembers") || new URLSearchParams(location.search || "").get("classMembers") === "1";
  return location.pathname === "/";
};

const CampusPrimaryNavigation = ({ allowedSections }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const items = getCampusNavigationItems(allowedSections);

  return (
    <nav className="campus-primary-nav" aria-label="Campus navigation">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          className={\`campus-primary-nav__item${isCampusNavigationItemActive(item, location) ? " is-active" : ""}\`}
          onClick={() => navigate(item.route)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
};

const MOBILE_NAV_ITEMS = [
  { key: "learn", label: "Learn", icon: "▤", route: "/campus/course", permission: "course" },
  { key: "practice", label: "Practice", icon: "✦", route: "/campus/vocab", permission: "vocab" },
  { key: "attendance", label: "Attendance", icon: "✓", route: "/campus/attendance", permission: "attendance" },
  { key: "results", label: "Results", icon: "◎", route: "/campus/results", permission: "results" },
];

const CampusMobileBottomNav = ({ allowedSections }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const moreItems = getCampusNavigationItems(allowedSections).filter((item) =>
    ["examFile", "classMembers", "home"].includes(item.key)
  );
  const moreActive = moreItems.some((item) => isCampusNavigationItemActive(item, location));

  const closeMoreAndNavigate = (event, route) => {
    event.currentTarget.closest("details")?.removeAttribute("open");
    navigate(route);
  };

  return (
    <nav className="campus-mobile-bottom-nav" aria-label="Mobile campus navigation">
      {MOBILE_NAV_ITEMS.map((item) => {
        const enabled = item.permission === "course" || Boolean(allowedSections[item.permission]);
        const active = enabled && isCampusNavigationItemActive(item, location);
        return (
          <button
            key={item.key}
            type="button"
            className={\`campus-mobile-bottom-nav__item${active ? " is-active" : ""}\`}
            onClick={() => enabled && navigate(item.route)}
            disabled={!enabled}
            aria-disabled={!enabled}
          >
            <span className="campus-mobile-bottom-nav__icon" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}

      <details className={\`campus-mobile-more${moreActive ? " is-active" : ""}\`}>
        <summary className="campus-mobile-bottom-nav__item">
          <span className="campus-mobile-bottom-nav__icon" aria-hidden="true">•••</span>
          <span>More</span>
        </summary>
        <div className="campus-mobile-more__panel">
          {moreItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={isCampusNavigationItemActive(item, location) ? "is-active" : ""}
              onClick={(event) => closeMoreAndNavigate(event, item.route)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </details>
    </nav>
  );
};

const CampusQuickNavigation = ({ allowedSections }) => <CampusPrimaryNavigation allowedSections={allowedSections} />;

`;
  app = `${app.slice(0, start)}${navigationHelpers}${app.slice(end)}`;
}

if (!app.includes('<CampusPrimaryNavigation allowedSections={allowedSections} />\n\n      {showCampusHero ? (')) {
  const campusNavStart = `      <div style={{ marginBottom: 10 }}>`;
  const campusNavEnd = `      {showCampusHero ? (`;
  const start = app.indexOf(campusNavStart, app.indexOf("const CampusArea ="));
  const end = app.indexOf(campusNavEnd, start);
  if (start === -1 || end === -1) throw new Error("CampusArea legacy navigation block not found.");
  app = `${app.slice(0, start)}      <CampusPrimaryNavigation allowedSections={allowedSections} />\n\n${app.slice(end)}`;
}

if (!app.includes("<CampusMobileBottomNav allowedSections={allowedSections} />")) {
  app = replaceOnce(
    app,
    `      </main>\n      {!isOnboarding ? <StudyBuddyBar studentProfile={studentProfile} /> : null}`,
    `      </main>
      {!isOnboarding && location.pathname.startsWith("/campus") ? (
        <CampusMobileBottomNav allowedSections={allowedSections} />
      ) : null}
      {!isOnboarding ? <StudyBuddyBar studentProfile={studentProfile} /> : null}`,
    "mobile bottom navigation mount",
  );
}

// Health status stays silent when healthy. Auto-mount helpers remain active.
if (!health.includes('data-connection-problem="true"')) {
  health = replaceOnce(
    health,
    `  const label = isOffline ? "Offline mode" : statusCopy[status] || "API status";
  const color = isOffline ? "#f59e0b" : statusColor[status] || statusColor.loading;
  const showDay0Return = isDay0CoursePath(location.pathname);`,
    `  const showDay0Return = isDay0CoursePath(location.pathname);
  const hasConnectionProblem = isOffline || status === "offline" || status === "retrying";
  const connectionMessage = isOffline
    ? "Offline mode — changes will sync when you reconnect."
    : status === "retrying"
      ? "Connection problem — reconnecting to Falowen."
      : "Connection problem — some updates may be delayed.";`,
    "health problem state",
  );

  const healthVisualStart = `      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }} aria-live="polite">`;
  const healthVisualEnd = `      </div>\n    </>`;
  const start = health.indexOf(healthVisualStart);
  const end = health.indexOf(healthVisualEnd, start);
  if (start === -1 || end === -1) throw new Error("Health indicator visual block not found.");
  const healthUi = `      {hasConnectionProblem ? (
        <div className="app-connection-warning" data-connection-problem="true" role="status" aria-live="polite">
          {connectionMessage}
        </div>
      ) : null}
      {showDay0Return ? (
        <button
          type="button"
          onClick={() => navigate("/")}
          style={{
            ...styles.primaryButton,
            padding: "6px 10px",
            fontSize: 12,
            background: "#dcfce7",
            color: "#166534",
            borderColor: "#86efac",
          }}
        >
          I finished Day 0 — continue setup
        </button>
      ) : null}
`;
  health = `${health.slice(0, start)}${healthUi}${health.slice(end + `      </div>\n`.length)}`;
}

// Let CSS turn the existing notification trigger into a compact bell without changing inbox behavior.
notification = replaceOnce(
  notification,
  `<div ref={rootRef} style={{ position: "relative", maxWidth: "100%" }}>`,
  `<div ref={rootRef} className="notification-bell" style={{ position: "relative", maxWidth: "100%" }}>`,
  "notification root class",
);
notification = replaceOnce(
  notification,
  `      <button\n        type="button"\n        style={{ ...styles.secondaryButton, display: "inline-flex", alignItems: "center", gap: 6, maxWidth: "100%" }}\n        onClick={handleToggle}`,
  `      <button
        type="button"
        className="notification-bell-button"
        style={{ ...styles.secondaryButton, display: "inline-flex", alignItems: "center", gap: 6, maxWidth: "100%" }}
        onClick={handleToggle}`,
  "notification trigger class",
);

// Course Book: keep canonical completion, but make the first screen smaller and student-focused.
if (!courseTab.includes("const latestCourseResult = useMemo(")) {
  const latestResultAnchor = courseTab.includes(
    `  const nextPracticeState = nextLesson ? effectivePracticeProgress[nextLesson.assignmentKey] || {} : {};`,
  )
    ? `  const nextPracticeState = nextLesson ? effectivePracticeProgress[nextLesson.assignmentKey] || {} : {};`
    : `  const nextPracticeState = nextLesson ? practiceProgress[nextLesson.assignmentKey] || {} : {};`;
  courseTab = replaceOnce(
    courseTab,
    latestResultAnchor,
    `${latestResultAnchor}
  const latestCourseResult = useMemo(() => {
    const scored = Object.values(progressByAssignmentId || {}).filter((record) => {
      const score = Number(record?.latestScore ?? record?.bestScore);
      return Number.isFinite(score);
    });
    return scored.sort((left, right) => toUpdatedMillis(right) - toUpdatedMillis(left))[0] || null;
  }, [progressByAssignmentId]);
  const latestResultScore = latestCourseResult
    ? Number(latestCourseResult.latestScore ?? latestCourseResult.bestScore)
    : null;
  const latestResultTitle = String(
    latestCourseResult?.assignmentTitle || latestCourseResult?.lessonTitle || latestCourseResult?.title || ""
  ).trim();`,
    "latest course result summary",
  );
}

courseTab = replaceOnce(
  courseTab,
  `  hero: {
    borderRadius: 24,
    padding: 20,
    background: "linear-gradient(135deg, #172554 0%, #2563eb 54%, #38bdf8 100%)",
    color: "#f8fafc",
    boxShadow: "0 22px 50px rgba(37, 99, 235, 0.28)",
    display: "grid",
    gap: 16,
  },
  heroHeader: { display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", flexWrap: "wrap" },
  heroEyebrow: { margin: 0, color: "#bfdbfe", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.6 },
  heroTitle: { margin: "4px 0 6px", fontSize: 28, lineHeight: 1.08, letterSpacing: -0.6 },
  heroText: { margin: 0, color: "#dbeafe", fontSize: 14, lineHeight: 1.5, maxWidth: 640 },
  heroActions: { display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-end", flexWrap: "wrap" },
  heroSelect: { ...styles.select, minWidth: 110, background: "rgba(255,255,255,0.96)", border: "1px solid rgba(255,255,255,0.35)" },
  statGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 },
  statCard: { border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.12)", borderRadius: 16, padding: 12, backdropFilter: "blur(8px)" },
  statLabel: { margin: 0, color: "#bfdbfe", fontSize: 12, fontWeight: 700 },
  statValue: { margin: "4px 0 0", color: "#ffffff", fontSize: 20, fontWeight: 900 },
  progressShell: { height: 10, borderRadius: 999, background: "rgba(255,255,255,0.22)", overflow: "hidden", border: "1px solid rgba(255,255,255,0.18)" },
  progressFill: { height: "100%", borderRadius: 999, background: "linear-gradient(90deg, #dcfce7, #86efac)" },`,
  `  hero: {
    borderRadius: 18,
    padding: 14,
    background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 72%)",
    color: "#0f172a",
    border: "1px solid #bfdbfe",
    boxShadow: "0 12px 28px rgba(37, 99, 235, 0.10)",
    display: "grid",
    gap: 12,
  },
  heroHeader: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" },
  heroEyebrow: { margin: 0, color: "#2563eb", fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.55 },
  heroTitle: { margin: "2px 0 4px", fontSize: 24, lineHeight: 1.08, letterSpacing: -0.45, color: "#0f172a" },
  heroText: { margin: 0, color: "#475569", fontSize: 13, lineHeight: 1.45, maxWidth: 620 },
  heroActions: { display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-end", flexWrap: "wrap" },
  heroSelect: { ...styles.select, minWidth: 94, minHeight: 44, background: "#ffffff", border: "1px solid #93c5fd" },
  statGrid: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 },
  statCard: { border: "1px solid #dbeafe", background: "#ffffff", borderRadius: 12, padding: "9px 10px", minWidth: 0 },
  statLabel: { margin: 0, color: "#64748b", fontSize: 11, fontWeight: 800 },
  statValue: { margin: "3px 0 0", color: "#0f172a", fontSize: 18, fontWeight: 900, lineHeight: 1.2 },
  progressShell: { height: 7, borderRadius: 999, background: "#dbeafe", overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 999, background: "linear-gradient(90deg, #2563eb, #38bdf8)" },`,
  "compact Course Book hero styles",
);

if (!courseTab.includes('data-compact-course-hero="true"')) {
  const heroStart = `          <section className="course-book-hero" style={courseBookStyles.hero}>`;
  const heroEnd = `          <div style={{ display: "flex", justifyContent: "flex-end" }}>`;
  const start = courseTab.indexOf(heroStart);
  const end = courseTab.indexOf(heroEnd, start);
  if (start === -1 || end === -1) throw new Error("Course Book hero block not found.");

  const compactCourseHero = `          <section className="course-book-hero course-book-hero--compact" data-compact-course-hero="true" style={courseBookStyles.hero}>
            <div data-a1-coursebook-hero-header="true" style={courseBookStyles.heroHeader}>
              <div className="course-book-hero-copy">
                <p style={courseBookStyles.heroEyebrow}>{selectedCourseLevel || "Course"} course</p>
                <h2 style={courseBookStyles.heroTitle}>Course Book</h2>
                <p style={courseBookStyles.heroText}>
                  {nextLesson ? (
                    <>Next: <strong>{getCourseBookDayLabel(nextLesson, dayTaskCounts)} · {nextLessonTitle}</strong></>
                  ) : (
                    "All required course work is complete."
                  )}
                  {loadingLessonProgress || (isC2CourseBook && loadingC2Progress) ? " Syncing progress…" : ""}
                </p>
                {lessonProgressError ? <p style={{ margin: "4px 0 0", color: "#b91c1c", fontSize: 12 }}>{lessonProgressError}</p> : null}
              </div>

              <div data-a1-coursebook-hero-actions="true" className="course-book-hero-actions" style={courseBookStyles.heroActions}>
                <label className="course-book-level-picker" style={{ display: "grid", gap: 3 }}>
                  <span style={{ color: "#475569", fontSize: 11, fontWeight: 800 }}>Level</span>
                  <select style={courseBookStyles.heroSelect} value={selectedCourseLevel} onChange={(e) => setSelectedCourseLevel(e.target.value)}>
                    {levels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  className="course-book-continue-button"
                  style={{ ...styles.primaryButton, minHeight: 44 }}
                  onClick={() => nextLesson && openLesson(nextLesson)}
                  disabled={!nextLesson}
                >
                  Continue learning
                </button>
                {canShowCourseSubmit ? (
                  <button
                    type="button"
                    className="course-book-submit-secondary"
                    style={{ ...styles.secondaryButton, minHeight: 44, background: "#ffffff", fontWeight: 800 }}
                    onClick={() => setCourseSubmitOpen(true)}
                  >
                    Submit work
                  </button>
                ) : null}
              </div>
            </div>

            <div className="course-book-quick-stats" style={courseBookStyles.statGrid}>
              <div style={courseBookStyles.statCard}>
                <p style={courseBookStyles.statLabel}>Completed</p>
                <p style={courseBookStyles.statValue}>{completedCount}/{isC2CourseBook ? courseLessons.length : (courseCompletion?.total || courseLessons.length)}</p>
              </div>
              {isC2CourseBook ? (
                <>
                  {[
                    ["lesen", "Lesen"],
                    ["hoeren", "Hören"],
                    ["speak", "Sprechen"],
                    ["write", "Schreiben"],
                  ].map(([key, label]) => (
                    <div key={key} style={courseBookStyles.statCard}>
                      <p style={courseBookStyles.statLabel}>{label}</p>
                      <p style={courseBookStyles.statValue}>{c2SkillSummary[key]?.completed || 0}/{c2SkillSummary[key]?.total || 7}</p>
                      {key === "hoeren" && c2SkillSummary[key]?.waitingForSource ? (
                        <p style={{ ...styles.helperText, margin: "2px 0 0", fontSize: 10 }}>
                          {c2SkillSummary[key].waitingForSource} source{c2SkillSummary[key].waitingForSource === 1 ? "" : "s"} pending
                        </p>
                      ) : null}
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div style={courseBookStyles.statCard}>
                    <p style={courseBookStyles.statLabel}>Next lesson</p>
                    <p style={{ ...courseBookStyles.statValue, fontSize: 14, overflowWrap: "anywhere" }}>
                      {nextLesson ? getCourseBookDayLabel(nextLesson, dayTaskCounts) : "Course complete"}
                    </p>
                    {nextLessonTitle ? <p style={{ ...styles.helperText, margin: "2px 0 0", fontSize: 11 }}>{nextLessonTitle}</p> : null}
                  </div>
                  <div style={courseBookStyles.statCard}>
                    <p style={courseBookStyles.statLabel}>Latest result</p>
                    <p style={courseBookStyles.statValue}>{latestResultScore !== null ? Math.round(latestResultScore) + "/100" : "—"}</p>
                    {latestResultTitle ? <p style={{ ...styles.helperText, margin: "2px 0 0", fontSize: 11 }}>{latestResultTitle}</p> : null}
                  </div>
                </>
              )}
            </div>

            <div style={{ display: "grid", gap: 5 }}>
              <div style={courseBookStyles.progressShell}>
                <div style={{ ...courseBookStyles.progressFill, width: \`${"${progressPercent}"}%\` }} />
              </div>
              <p style={{ margin: 0, color: "#475569", fontSize: 12, fontWeight: 700 }}>{progressPercent}% complete</p>
            </div>
          </section>

`;
  courseTab = `${courseTab.slice(0, start)}${compactCourseHero}${courseTab.slice(end)}`;
}

const appCssMarker = "/* Compact student navigation chrome */";
if (!appCss.includes(appCssMarker)) {
  appCss += `

${appCssMarker}
.app-shell {
  background: #f8fafc !important;
  padding-top: 12px !important;
}

.app-header.app-header--compact {
  min-height: 56px;
  margin: 0 0 10px !important;
  padding: 6px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 10px !important;
  flex-wrap: nowrap !important;
}

.app-brand {
  min-height: 44px;
  border: 0;
  background: transparent;
  color: #0f172a;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 12px;
  cursor: pointer;
  font: inherit;
  font-size: 18px;
  font-weight: 900;
}

.app-brand:hover,
.app-brand:focus-visible {
  background: #eff6ff;
  outline: none;
}

.app-brand img {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  object-fit: cover;
}

.app-header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  min-width: 0;
}

.notification-bell-button {
  min-width: 44px !important;
  min-height: 44px !important;
  justify-content: center !important;
  padding: 7px 9px !important;
  border-radius: 12px !important;
}

.app-header-actions .notification-bell-button > span:nth-child(2) {
  display: none;
}

.profile-menu {
  position: relative;
}

.profile-menu > summary {
  list-style: none;
}

.profile-menu > summary::-webkit-details-marker {
  display: none;
}

.profile-menu__trigger {
  width: 44px;
  height: 44px;
  box-sizing: border-box;
  display: grid;
  place-items: center;
  border: 1px solid #bfdbfe;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
}

.profile-menu[open] .profile-menu__trigger,
.profile-menu__trigger:focus-visible {
  background: #dbeafe;
  outline: 2px solid #93c5fd;
  outline-offset: 2px;
}

.profile-menu__panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 120;
  width: min(300px, calc(100vw - 28px));
  padding: 12px;
  display: grid;
  gap: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.16);
}

.profile-menu__identity {
  display: grid;
  gap: 2px;
  min-width: 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
}

.profile-menu__identity span,
.profile-menu__language span {
  color: #64748b;
  font-size: 11px;
  font-weight: 800;
}

.profile-menu__identity strong {
  overflow-wrap: anywhere;
  color: #0f172a;
  font-size: 13px;
}

.profile-menu__language {
  display: grid;
  gap: 4px;
}

.profile-menu__language select {
  min-height: 44px;
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: #ffffff;
  color: #0f172a;
  padding: 8px 10px;
  font: inherit;
}

.profile-menu__action {
  min-height: 44px;
  width: 100%;
  border: 1px solid #dbe3ee;
  border-radius: 10px;
  background: #f8fafc;
  color: #0f172a;
  padding: 9px 11px;
  text-align: left;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
}

.profile-menu__action:hover,
.profile-menu__action:focus-visible {
  border-color: #93c5fd;
  background: #eff6ff;
  outline: none;
}

.profile-menu__logout {
  color: #475569;
  background: #ffffff;
}

.app-connection-warning {
  max-width: 260px;
  color: #92400e;
  font-size: 12px;
  font-weight: 800;
  line-height: 1.35;
}

.campus-primary-nav {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
  padding: 2px 0 10px;
  margin: 0 0 4px;
  scrollbar-width: thin;
}

.campus-primary-nav__item {
  min-height: 44px;
  flex: 0 0 auto;
  border: 1px solid #dbe3ee;
  border-radius: 12px;
  background: #ffffff;
  color: #334155;
  padding: 8px 13px;
  font: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
}

.campus-primary-nav__item:hover,
.campus-primary-nav__item:focus-visible {
  border-color: #93c5fd;
  background: #eff6ff;
  outline: none;
}

.campus-primary-nav__item.is-active {
  border-color: #2563eb;
  background: #2563eb;
  color: #ffffff;
}

.campus-mobile-bottom-nav {
  display: none;
}

.course-book-hero--compact .course-book-continue-button,
.course-book-hero--compact .course-book-submit-secondary {
  min-height: 44px;
}

@media (max-width: 900px) {
  .app-header.app-header--compact {
    flex-direction: row !important;
    align-items: center !important;
  }
}

@media (max-width: 640px) {
  .app-shell.has-campus-bottom-nav {
    padding: 10px 10px calc(112px + env(safe-area-inset-bottom)) !important;
  }

  .app-header.app-header--compact {
    margin-bottom: 8px !important;
    padding: 5px 6px;
    border-radius: 14px;
  }

  .app-brand {
    padding-inline: 5px;
    font-size: 17px;
  }

  .app-brand img {
    width: 30px;
    height: 30px;
  }

  .app-header-actions {
    gap: 4px;
  }

  .app-connection-warning {
    position: fixed;
    left: 10px;
    right: 10px;
    top: 68px;
    z-index: 130;
    max-width: none;
    padding: 8px 10px;
    border: 1px solid #fcd34d;
    border-radius: 10px;
    background: #fffbeb;
  }

  .campus-primary-nav {
    display: none;
  }

  .campus-mobile-bottom-nav {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    min-height: calc(64px + env(safe-area-inset-bottom));
    padding: 4px 4px max(4px, env(safe-area-inset-bottom));
    border-top: 1px solid #dbe3ee;
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 -10px 28px rgba(15, 23, 42, 0.10);
    backdrop-filter: blur(14px);
  }

  .campus-mobile-bottom-nav__item {
    min-width: 44px;
    min-height: 52px;
    border: 0;
    border-radius: 12px;
    background: transparent;
    color: #64748b;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    padding: 4px 2px;
    font: inherit;
    font-size: 10px;
    font-weight: 800;
    line-height: 1.15;
    cursor: pointer;
  }

  .campus-mobile-bottom-nav__item.is-active,
  .campus-mobile-more.is-active > summary,
  .campus-mobile-more[open] > summary {
    background: #eff6ff;
    color: #1d4ed8;
  }

  .campus-mobile-bottom-nav__item:disabled {
    cursor: default;
    opacity: 0.38;
  }

  .campus-mobile-bottom-nav__icon {
    font-size: 18px;
    line-height: 1;
  }

  .campus-mobile-more {
    position: relative;
    min-width: 0;
  }

  .campus-mobile-more > summary {
    list-style: none;
    width: 100%;
    box-sizing: border-box;
  }

  .campus-mobile-more > summary::-webkit-details-marker {
    display: none;
  }

  .campus-mobile-more__panel {
    position: absolute;
    right: 4px;
    bottom: calc(100% + 8px);
    width: min(230px, calc(100vw - 20px));
    display: grid;
    gap: 6px;
    padding: 8px;
    border: 1px solid #dbe3ee;
    border-radius: 14px;
    background: #ffffff;
    box-shadow: 0 18px 42px rgba(15, 23, 42, 0.18);
  }

  .campus-mobile-more__panel button {
    min-height: 44px;
    border: 1px solid transparent;
    border-radius: 10px;
    background: #f8fafc;
    color: #334155;
    padding: 8px 10px;
    text-align: left;
    font: inherit;
    font-size: 13px;
    font-weight: 800;
  }

  .campus-mobile-more__panel button.is-active {
    border-color: #93c5fd;
    background: #eff6ff;
    color: #1d4ed8;
  }

  .course-book-hero--compact {
    padding: 12px !important;
    border-radius: 16px !important;
  }

  .course-book-hero--compact .course-book-hero-actions {
    width: 100%;
    display: grid !important;
    grid-template-columns: minmax(82px, 0.7fr) minmax(0, 1.4fr);
    justify-content: stretch !important;
  }

  .course-book-hero--compact .course-book-level-picker {
    min-width: 0;
  }

  .course-book-hero--compact .course-book-level-picker select,
  .course-book-hero--compact .course-book-continue-button,
  .course-book-hero--compact .course-book-submit-secondary {
    width: 100%;
    min-width: 0;
  }

  .course-book-hero--compact .course-book-submit-secondary {
    grid-column: 1 / -1;
  }

  .course-book-hero--compact .course-book-quick-stats {
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
  }

  .course-book-hero--compact .course-book-quick-stats > div {
    padding: 8px !important;
  }

  .course-book-hero--compact .course-book-quick-stats p {
    overflow-wrap: anywhere;
  }

  .course-book-floating-submit {
    right: 12px !important;
    bottom: calc(76px + env(safe-area-inset-bottom)) !important;
    min-height: 44px !important;
    padding: 0 14px !important;
  }
}
`;
}

const studyBuddyCssMarker = "/* Compact mobile navigation collision guard */";
if (!studyBuddyCss.includes(studyBuddyCssMarker)) {
  studyBuddyCss += `

${studyBuddyCssMarker}
@media (max-width: 640px) {
  .study-buddy-reopen {
    left: 12px;
    right: auto;
    bottom: calc(76px + env(safe-area-inset-bottom));
    min-height: 44px;
    padding: 8px 12px;
  }

  .study-buddy-reopen::after {
    content: "Study Buddy";
    font-size: 12px;
  }

  .study-buddy-bar {
    bottom: calc(74px + env(safe-area-inset-bottom));
  }
}
`;
}

const requiredAppMarkers = [
  'className="app-header app-header--compact"',
  'className="app-brand"',
  'className="profile-menu"',
  "const CampusPrimaryNavigation =",
  "const CampusMobileBottomNav =",
  'aria-label="Mobile campus navigation"',
  "<CampusMobileBottomNav allowedSections={allowedSections} />",
];
requiredAppMarkers.forEach((marker) => {
  if (!app.includes(marker)) throw new Error(`App compact navigation marker missing: ${marker}`);
});

[
  'data-connection-problem="true"',
  "hasConnectionProblem",
].forEach((marker) => {
  if (!health.includes(marker)) throw new Error(`Health indicator compact marker missing: ${marker}`);
});

[
  'className="notification-bell-button"',
  'className="notification-bell"',
].forEach((marker) => {
  if (!notification.includes(marker)) throw new Error(`Notification compact marker missing: ${marker}`);
});

[
  'data-compact-course-hero="true"',
  "Latest result",
  "const latestCourseResult = useMemo(",
].forEach((marker) => {
  if (!courseTab.includes(marker)) throw new Error(`Course Book compact marker missing: ${marker}`);
});

if (courseTab.includes("Your badges now use real submissions and marked scores from Falowen")) {
  throw new Error("Retired Course Book badge-system explanation is still visible.");
}

fs.writeFileSync(appPath, app, "utf8");
fs.writeFileSync(appCssPath, appCss, "utf8");
fs.writeFileSync(healthPath, health, "utf8");
fs.writeFileSync(notificationPath, notification, "utf8");
fs.writeFileSync(courseTabPath, courseTab, "utf8");
fs.writeFileSync(studyBuddyCssPath, studyBuddyCss, "utf8");

console.log("Compact student top bar, campus navigation, Course Book hero and mobile action spacing applied.");
