import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { courseSchedules } from "../data/courseSchedule";
import { getLessonVideoResources } from "../data/lessonVideoDictionary";

export const SCHOOL_PRINT_STAMP = "learn Language Education Academy";

const BOOK_ROUTE_PATTERN = /(?:grammar-notes|workbook\/?$)/i;
const A1_WORKBOOK_ROUTE_PATTERN = /^\/campus\/course\/a1-[^/]*-workbook\/?$/i;
const A1_SPECIAL_WORKBOOK_PATHS = new Set([
  "/campus/course/speaking-exams-intro-4-7",
  "/campus/course/two-case-prepositions-wechselpraepositionen-day-18",
  "/campus/course/a1-12-2-dative-articles-mit-bei-zu",
  "/campus/course/letter-writing-intro-german-a1-day-12-3",
]);
const COURSE_LESSON_PATTERN = /^\/campus\/course\/lesson\/(A1|A2|B1|B2|C1)\/(\d+)\/?$/i;
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

export const getA2B1WorkbookExperienceContext = (pathname = "", search = "") => {
  const normalizedPath = normalizePathname(pathname);
  const lessonMatch = normalizedPath.match(COURSE_LESSON_PATTERN);
  if (lessonMatch) {
    const level = String(lessonMatch[1] || "").toUpperCase();
    const day = Number(lessonMatch[2] || 0);
    const view = new URLSearchParams(search || "").get("view");
    if (!A2_B1_LEVELS.has(level) || view !== "workbook" || day < 1 || day > MAX_A2_B1_DAY) return null;
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

  // Canonical B2 and C1 self-learning links open the complete lesson without
  // a view query parameter. Those pages contain both grammar and workbook work.
  if ((level === "B2" || level === "C1") && !view) return "combined";

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

const mediaGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
  gap: 12,
};

const mediaCardStyle = {
  border: "1px solid #cbd5e1",
  borderRadius: 16,
  background: "#ffffff",
  padding: 12,
  display: "grid",
  gap: 10,
};

const teacherMediaCardStyle = {
  ...mediaCardStyle,
  border: "2px solid #2563eb",
  boxShadow: "0 10px 24px rgba(37, 99, 235, 0.12)",
};

const videoFrameStyle = {
  width: "100%",
  aspectRatio: "16 / 9",
  border: 0,
  borderRadius: 12,
  background: "#0f172a",
};

const WorkbookVideoCard = ({ resource, kind }) => {
  const youtubeId = extractYouTubeId(resource?.url);
  const isTeacher = kind === "teacher";
  return (
    <section style={isTeacher ? teacherMediaCardStyle : mediaCardStyle} aria-label={isTeacher ? "Teacher lecture" : "AI explanation"}>
      <span style={{ ...badgeStyle, background: isTeacher ? "#dbeafe" : "#f1f5f9", color: isTeacher ? "#1e3a8a" : "#334155" }}>
        {isTeacher ? "1 · Teacher lecture" : "2 · AI explanation"}
      </span>
      <div style={{ display: "grid", gap: 5 }}>
        <strong style={{ fontSize: "1.05rem" }}>{resource?.title || (isTeacher ? "Teacher lecture video" : "AI explanation video")}</strong>
        <span style={{ color: "#475569", lineHeight: 1.55 }}>
          {resource?.description || (isTeacher ? "Start here for the tutor explanation." : "Use this after the teacher lecture for revision and self-study.")}
        </span>
      </div>
      {youtubeId ? (
        <iframe
          title={resource?.title || (isTeacher ? "Teacher lecture video" : "AI explanation video")}
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&playsinline=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          style={videoFrameStyle}
        />
      ) : null}
      <a href={resource?.url} target="_blank" rel="noreferrer" style={{ ...inlineButtonStyle, width: "fit-content", textDecoration: "none" }}>
        Open video
      </a>
    </section>
  );
};

const A2B1WorkbookExperience = ({ context, onPrint, onNavigate }) => {
  const { level, day, chapter, title } = context;
  const resources = getLessonVideoResources(level, day);
  const teacherResources = resources.filter(isTeacherResource);
  const aiResources = resources.filter(isAiResource);
  const courseProgress = Math.max(0, Math.min(100, Math.round((day / MAX_A2_B1_DAY) * 100)));
  const previousDay = day > 1 ? day - 1 : null;
  const nextDay = day < MAX_A2_B1_DAY ? day + 1 : null;

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
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
            {teacherResources.length && aiResources.length
              ? "Start with the teacher lecture. Use the AI explanation afterwards for revision, then continue with the workbook sections below."
              : teacherResources.length
                ? "Start with the teacher lecture, then continue with the workbook sections below."
                : aiResources.length
                  ? "Use the AI explanation for revision, then continue with the workbook sections below."
                  : "Continue with the workbook sections below."}
          </p>
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
        <button type="button" style={primaryActionStyle} onClick={onPrint} aria-label="Download or print workbook PDF">
          Download / Print PDF
        </button>
        <button
          type="button"
          style={previousDay ? inlineButtonStyle : disabledActionStyle}
          disabled={!previousDay}
          onClick={() => previousDay && onNavigate(`/campus/course/lesson/${level}/${previousDay}?view=workbook`)}
        >
          ← Previous lesson
        </button>
        <button
          type="button"
          style={nextDay ? inlineButtonStyle : disabledActionStyle}
          disabled={!nextDay}
          onClick={() => nextDay && onNavigate(`/campus/course/lesson/${level}/${nextDay}?view=workbook`)}
        >
          Next lesson →
        </button>
      </div>

      {teacherResources.length || aiResources.length ? (
        <div style={mediaGridStyle}>
          {teacherResources.map((resource) => <WorkbookVideoCard key={resource.key || resource.url} resource={resource} kind="teacher" />)}
          {aiResources.map((resource) => <WorkbookVideoCard key={resource.key || resource.url} resource={resource} kind="ai" />)}
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
  const showInlineA1Action = needsInlineA1PdfAction(location.pathname);
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

  if (!isBookRoute) return null;

  return (
    <>
      <style>{`@media print { .book-pdf-download-action { display: none !important; } }`}</style>
      {a2B1Context ? (
        <A2B1WorkbookExperience context={a2B1Context} onPrint={() => window.print()} onNavigate={navigate} />
      ) : showInlineA1Action ? (
        <div className="book-pdf-download-action" style={inlineActionStyle}>
          <button
            type="button"
            style={inlineButtonStyle}
            onClick={() => window.print()}
            aria-label="Download or print PDF"
          >
            Download / Print PDF
          </button>
        </div>
      ) : null}
      <div className="book-print-stamp" style={stampStyle} aria-hidden="true">
        <strong>{SCHOOL_PRINT_STAMP}</strong>
        <span>{title}</span>
        <span>Printed {printedAt}</span>
      </div>
    </>
  );
}
