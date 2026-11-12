import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { courseSchedules } from "../data/courseSchedule";
import { getA2B1LessonProfile } from "../data/a2B1LessonProfile";
import { getAdditionalLessonVideoResources } from "../data/additionalLessonVideoResources";
import { normalizeA2B1SectionView } from "../utils/lessonSectionDeepLinks";
import { getLessonVideoResources } from "../data/lessonVideoDictionary";
import { getConfiguredInAppWorkbookResourceRoute } from "../data/inAppWorkbookRoutes";

export const SCHOOL_PRINT_STAMP = "learn Language Education Academy";

const BOOK_ROUTE_PATTERN = /(?:grammar-notes|workbook\/?$)/i;
const A1_WORKBOOK_ROUTE_PATTERN = /^\/campus\/course\/a1-[^/]*-workbook\/?$/i;
const A1_SPECIAL_WORKBOOK_PATHS = new Set([
  "/campus/course/speaking-exams-intro-4-7",
  "/campus/course/two-case-prepositions-wechselpraepositionen-day-18",
  "/campus/course/a1-12-2-dative-articles-mit-bei-zu",
  "/campus/course/letter-writing-intro-german-a1-day-12-3",
]);
const COURSE_LESSON_PATTERN = /^\/campus\/course\/lesson\/(A1|A2|B1|B2|C1|C2)\/(\d+)\/?$/i;
const A2_B1_LEVELS = new Set(["A2", "B1"]);
const MAX_A2_B1_DAY = 28;

const normalizePathname = (value = "") => {
  const raw = String(value || "").trim();
  if (!raw) return "/";
  try {
    if (/^https?:\/\//i.test(raw)) return new URL(raw).pathname.replace(/\/+$/, "") || "/";
  } catch {
    return raw.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  }
  return raw.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
};

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const workbookLinksForEntry = (entry = {}) => [
  entry,
  ...toArray(entry?.lesen_hören),
  ...toArray(entry?.schreiben_sprechen),
]
  .map((resource) => resource?.workbook_link || resource?.workbookLink || "")
  .filter(Boolean)
  .map(normalizePathname);

const findScheduleEntryByWorkbookPath = (level, pathname) => {
  const normalizedPath = normalizePathname(pathname);
  return (courseSchedules?.[level] || []).find((entry) =>
    workbookLinksForEntry(entry).includes(normalizedPath),
  ) || null;
};

const markRadioCompleted = (route = "") => {
  const raw = String(route || "").trim();
  if (!raw) return "";

  try {
    const url = new URL(raw, "https://www.falowen.app");
    if (!["falowen.app", "www.falowen.app"].includes(url.hostname)) return "";
    if (!url.pathname.startsWith("/campus/course/")) return "";

    url.searchParams.set("radio", "done");
    const query = url.searchParams.toString();
    return `${url.pathname}${query ? `?${query}` : ""}${url.hash || ""}`;
  } catch {
    return "";
  }
};

export const getA2B1WorkbookNavigationDestination = (level, day) => {
  const normalizedLevel = String(level || "").trim().toUpperCase();
  const numericDay = Number(day);
  if (!A2_B1_LEVELS.has(normalizedLevel) || !Number.isFinite(numericDay) || numericDay < 1 || numericDay > MAX_A2_B1_DAY) {
    return "";
  }

  const entry = (courseSchedules?.[normalizedLevel] || []).find((item) => Number(item?.day) === numericDay) || null;
  const resources = [entry, ...toArray(entry?.lesen_hören), ...toArray(entry?.schreiben_sprechen)].filter(Boolean);

  for (const resource of resources) {
    const chapter = resource?.chapter || entry?.chapter || "";
    const configured = getConfiguredInAppWorkbookResourceRoute({
      level: normalizedLevel,
      day: numericDay,
      chapter,
    });
    const configuredDestination = markRadioCompleted(configured);
    if (configuredDestination) return configuredDestination;

    const explicitDestination = markRadioCompleted(
      resource?.workbook_link || resource?.workbookLink || resource?.workbookRoute || "",
    );
    if (explicitDestination) return explicitDestination;
  }

  return markRadioCompleted(`/campus/course/lesson/${normalizedLevel}/${numericDay}?view=workbook`);
};

export const getA2B1WorkbookExperienceContext = (pathname = "", search = "") => {
  // App routes retain this old Day 2 bookmark for the Day 1 Small Talk lesson.
  // Resolve its canonical identity before selecting schedule metadata or videos.
  const originalPath = normalizePathname(pathname);
  const normalizedPath = originalPath === "/campus/course/a2-day-2-small-talk-workbook"
    ? "/campus/course/a2-day-1-small-talk-workbook"
    : originalPath;
  const lessonMatch = normalizedPath.match(COURSE_LESSON_PATTERN);
  if (lessonMatch) {
    const level = String(lessonMatch[1] || "").toUpperCase();
    const day = Number(lessonMatch[2] || 0);
    const view = normalizeA2B1SectionView(new URLSearchParams(search || "").get("view") || "");
    if (!A2_B1_LEVELS.has(level) || !view || view === "radio" || day < 1 || day > MAX_A2_B1_DAY) return null;
    if (view === "grammar" && (level !== "B1" || day === 23)) return null;
    const entry = (courseSchedules?.[level] || []).find((item) => Number(item?.day) === day) || null;
    return {
      level,
      day,
      chapter: entry?.chapter || null,
      title: entry?.topic || entry?.title || `${level} Day ${day}`,
      entry,
    };
  }

  for (const level of A2_B1_LEVELS) {
    const entry = findScheduleEntryByWorkbookPath(level, normalizedPath);
    if (entry) {
      return {
        level,
        day: Number(entry.day || 0),
        chapter: entry.chapter || null,
        title: entry.topic || entry.title || `${level} Day ${entry.day}`,
        entry,
      };
    }
  }

  const legacyMatch = normalizedPath.match(/^\/campus\/course\/(a2|b1)-day-(\d+).*workbook$/i);
  if (!legacyMatch) return null;
  const level = legacyMatch[1].toUpperCase();
  const day = Number(legacyMatch[2] || 0);
  if (day < 1 || day > MAX_A2_B1_DAY) return null;
  const entry = (courseSchedules?.[level] || []).find((item) => Number(item?.day) === day) || null;
  return {
    level,
    day,
    chapter: entry?.chapter || null,
    title: entry?.topic || entry?.title || `${level} Day ${day}`,
    entry,
  };
};

export const getPrintableBookKind = (pathname = "", search = "") => {
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  if (A1_SPECIAL_WORKBOOK_PATHS.has(normalizedPath)) {
    return "combined";
  }

  if (BOOK_ROUTE_PATTERN.test(pathname)) {
    return /workbook\/?$/i.test(pathname) ? "combined" : "grammar";
  }

  const lessonMatch = pathname.match(COURSE_LESSON_PATTERN);
  if (!lessonMatch) return null;

  const level = String(lessonMatch[1] || "").toUpperCase();
  const view = new URLSearchParams(search || "").get("view");

  if (view === "grammar") return "grammar";
  if (view === "workbook") return level === "B1" ? "workbook" : "combined";

  // Canonical B2, C1 and C2 self-learning links open the complete lesson without
  // a view query parameter. Those pages contain both grammar and workbook work.
  if (["B2", "C1", "C2"].includes(level) && !view) return "combined";

  return null;
};

export const isPrintableBookRoute = (pathname = "", search = "") =>
  Boolean(getPrintableBookKind(pathname, search));

export const needsInlineA1PdfAction = (pathname = "") => {
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  return A1_WORKBOOK_ROUTE_PATTERN.test(pathname) || A1_SPECIAL_WORKBOOK_PATHS.has(normalizedPath);
};

const humanizeBookTitle = (pathname = "") => {
  const slug = pathname.split("/").filter(Boolean).pop() || "course-book";
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const videoLabel = (resource = {}) => `${resource.key || ""} ${resource.title || ""}`.toLowerCase();
const isTeacherResource = (resource = {}) => /teacher|tutor lecture/.test(videoLabel(resource));
const isAiResource = (resource = {}) => /\bai\b|ai-|ai_/.test(videoLabel(resource));

const extractYouTubeId = (url = "") => {
  const value = String(url || "").trim();
  if (!value) return "";
  const shortMatch = value.match(/youtu\.be\/([^?&#/]+)/i);
  if (shortMatch?.[1]) return shortMatch[1];
  const watchMatch = value.match(/[?&]v=([^?&#/]+)/i);
  if (watchMatch?.[1]) return watchMatch[1];
  const embedMatch = value.match(/\/embed\/([^?&#/]+)/i);
  return embedMatch?.[1] || "";
};

const stampStyle = {
  display: "none",
};

const inlineActionStyle = {
  display: "flex",
  justifyContent: "flex-end",
  width: "min(100% - 32px, 1120px)",
  margin: "14px auto",
};

const inlineButtonStyle = {
  border: "1px solid #cbd5e1",
  borderRadius: 12,
  background: "#ffffff",
  color: "#0f172a",
  padding: "10px 16px",
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
};

const experienceStyle = {
  width: "min(100% - 32px, 1120px)",
  margin: "14px auto 18px",
  border: "1px solid #bfdbfe",
  borderRadius: 20,
  padding: 16,
  boxSizing: "border-box",
  background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 68%)",
  boxShadow: "0 14px 34px rgba(30, 64, 175, 0.1)",
  display: "grid",
  gap: 14,
};

const badgeStyle = {
  display: "inline-flex",
  width: "fit-content",
  borderRadius: 999,
  padding: "6px 10px",
  background: "#dbeafe",
  color: "#1e3a8a",
  fontSize: 12,
  fontWeight: 900,
};

const actionRowStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  alignItems: "center",
};

const primaryActionStyle = {
  ...inlineButtonStyle,
  border: "1px solid #1d4ed8",
  background: "#1d4ed8",
  color: "#ffffff",
};

const disabledActionStyle = {
  ...inlineButtonStyle,
  opacity: 0.45,
  cursor: "not-allowed",
};

const overviewStyle = {
  display: "grid",
  gap: 4,
  padding: "10px 12px",
  border: "1px solid #dbeafe",
  borderRadius: 12,
  background: "#f8fbff",
  color: "#334155",
  fontSize: 14,
  lineHeight: 1.45,
};

const WorkbookOverview = ({ level, day }) => {
  const profile = getA2B1LessonProfile(level, day);
  const assignment = profile?.submission.requiredLabel;

  return (
    <section style={overviewStyle} aria-label="How to use this lesson">
      <h3 style={{ margin: 0, color: "#0f172a", fontSize: 15 }}>How to use this lesson</h3>
      <p style={{ margin: 0 }}><strong>Music</strong> is optional listening practice.</p>
      {profile?.sections.grammar.visible ? (
        <p style={{ margin: 0 }}><strong>Grammar</strong> contains notes and examples for review.</p>
      ) : null}
      {profile?.sections.speaking.visible ? (
        <p style={{ margin: 0 }}><strong>Teil 1 · Sprechen</strong> is group practice we do together in class.</p>
      ) : null}
      {assignment ? (
        <p style={{ margin: 0 }}><strong>Assignment</strong> · Send your final answers for {assignment} through the <strong>Submit</strong> tab.</p>
      ) : null}
    </section>
  );
};

const WorkbookVideoLink = ({ resource, teacher = false }) => {
  const youtubeId = teacher ? extractYouTubeId(resource.url) : "";
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noreferrer"
      style={{ ...inlineButtonStyle, display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
    >
      {youtubeId ? (
        <img
          src={`https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`}
          alt=""
          width="96"
          height="54"
          loading="lazy"
          style={{ borderRadius: 6, objectFit: "cover", flexShrink: 0 }}
        />
      ) : null}
      <span style={{ display: "grid", gap: 2, minWidth: 0, overflowWrap: "anywhere" }}>
        <strong style={{ color: "#1d4ed8" }}>{teacher ? "Watch lesson" : "Watch grammar explanation"}</strong>
        <span style={{ fontSize: 12, fontWeight: 600 }}>{resource.title}</span>
      </span>
    </a>
  );
};

const A2B1WorkbookExperience = ({ context, onPrint, onNavigate }) => {
  const { level, day, chapter, title, entry } = context;
  const resources = getLessonVideoResources(level, day, entry || {});
  const aiResourcesByUrl = new Map(
    getAdditionalLessonVideoResources(level, day).filter(isAiResource).map((resource) => [resource.url, resource]),
  );
  resources.filter(isAiResource).forEach((resource) => aiResourcesByUrl.set(resource.url, resource));
  const teacherResources = resources.filter(isTeacherResource);
  const aiResources = [...aiResourcesByUrl.values()];
  const courseProgress = Math.max(0, Math.min(100, Math.round((day / MAX_A2_B1_DAY) * 100)));
  const previousDay = day > 1 ? day - 1 : null;
  const nextDay = day < MAX_A2_B1_DAY ? day + 1 : null;
  const previousDestination = previousDay ? getA2B1WorkbookNavigationDestination(level, previousDay) : "";
  const nextDestination = nextDay ? getA2B1WorkbookNavigationDestination(level, nextDay) : "";

  return (
    <section className="book-pdf-download-action a2-b1-workbook-experience" style={experienceStyle} aria-label={`${level} workbook tools`}>
      <div style={{ display: "grid", gap: 8 }}>
        <div style={actionRowStyle}>
          <span style={badgeStyle}>{level}</span>
          <span style={badgeStyle}>Day {day}</span>
          {chapter ? <span style={badgeStyle}>Chapter {chapter}</span> : null}
        </div>
        <div style={{ display: "grid", gap: 4 }}>
          <h2 style={{ margin: 0, color: "#0f172a", fontSize: "clamp(1.25rem, 3vw, 1.65rem)" }}>Workbook learning path · {title}</h2>
        </div>
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <strong style={{ color: "#1e3a8a" }}>Course progress</strong>
          <span style={{ color: "#475569", fontWeight: 800 }}>Day {day} of {MAX_A2_B1_DAY} · {courseProgress}%</span>
        </div>
        <div role="progressbar" aria-label="Course progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow={courseProgress} style={{ width: "100%", height: 9, borderRadius: 999, background: "#dbeafe", overflow: "hidden" }}>
          <div style={{ width: `${courseProgress}%`, height: "100%", background: "#2563eb", borderRadius: 999 }} />
        </div>
      </div>

      <div style={actionRowStyle}>
        {level !== "A2" ? (
          <button type="button" style={primaryActionStyle} onClick={onPrint} aria-label="Download or print workbook PDF">
            Download / Print PDF
          </button>
        ) : null}
        <button
          type="button"
          style={previousDestination ? inlineButtonStyle : disabledActionStyle}
          disabled={!previousDestination}
          onClick={() => previousDestination && onNavigate(previousDestination)}
        >
          ← Previous lesson
        </button>
        <button
          type="button"
          style={nextDestination ? inlineButtonStyle : disabledActionStyle}
          disabled={!nextDestination}
          onClick={() => nextDestination && onNavigate(nextDestination)}
        >
          Next lesson →
        </button>
      </div>

      <WorkbookOverview level={level} day={day} />

      {teacherResources.length || aiResources.length ? (
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
          {teacherResources.map((resource) => <WorkbookVideoLink key={resource.url} resource={resource} teacher />)}
          {aiResources.map((resource) => <WorkbookVideoLink key={resource.url} resource={resource} />)}
        </div>
      ) : null}
    </section>
  );
};

export default function BookPdfDownloadInjector() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookKind = getPrintableBookKind(location.pathname, location.search);
  const isBookRoute = Boolean(bookKind);
  const a2B1Context = getA2B1WorkbookExperienceContext(location.pathname, location.search);
  const title = useMemo(() => humanizeBookTitle(location.pathname), [location.pathname]);
  const printedAt = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date()),
    [location.pathname]
  );

  const isSpeakingMock = (a2B1Context?.level === "A2" && Number(a2B1Context.day) === 22)
    || (a2B1Context?.level === "B1" && Number(a2B1Context.day) === 23);
  // These are graded speaking exams, not print workbooks with chapter videos.
  if ((!isBookRoute && !a2B1Context) || isSpeakingMock) return null;

  return (
    <>
      <style>{`@media print { .book-pdf-download-action { display: none !important; } }`}</style>
      {a2B1Context ? (
        <A2B1WorkbookExperience context={a2B1Context} onPrint={() => window.print()} onNavigate={navigate} />
      ) : null}
      <div className="book-print-stamp" style={stampStyle} aria-hidden="true">
        <strong>{SCHOOL_PRINT_STAMP}</strong>
        <span>{title}</span>
        <span>Printed {printedAt}</span>
      </div>
    </>
  );
}
