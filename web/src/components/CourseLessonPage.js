import React, { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { styles } from "../styles";
import { courseSchedules } from "../data/courseSchedule";
import { getLessonVideoResources } from "../data/lessonVideoDictionary";
import { getSelfLearningLessonComponent } from "./SelfLearningLessonRegistry";
import B1Day1TraumweltWorkbookPage from "./B1Day1TraumweltWorkbookPage";
import B1Day1TraumweltGrammarNotesPage from "./B1Day1TraumweltGrammarNotesPage";
import B1Day2FreundeFuersLebenGrammarNotesPage from "./B1Day2FreundeFuersLebenGrammarNotesPage";

const toLessonArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);
const normalizeLevel = (level = "") => String(level || "").trim().toUpperCase();
const isInternalLink = (url = "") => String(url || "").startsWith("/");
const getExternalProps = (url = "") => (isInternalLink(url) ? {} : { target: "_blank", rel: "noreferrer" });
const SELF_LEARNING_LEVELS = new Set(["B2", "C1"]);

const B1_GRAMMAR_PAGES = {
  1: B1Day1TraumweltGrammarNotesPage,
  2: B1Day2FreundeFuersLebenGrammarNotesPage,
};

const B1_WORKBOOK_PAGES = {
  1: B1Day1TraumweltWorkbookPage,
};

const INTERNAL_RESOURCE_ROUTES = {
  B1: {
    1: {
      grammarbook_link: "/campus/course/lesson/B1/1?view=grammar",
      workbook_link: "/campus/course/lesson/B1/1?view=workbook",
    },
  },
};

const palette = {
  page: "#f6f1e9",
  card: "#fffaf3",
  ink: "#1f1d2b",
  muted: "#6f6a80",
  amber: "#d97706",
  amberSoft: "#fed7aa",
  navy: "#262b5f",
  border: "#eadfd0",
};

const pillStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  border: `1px solid ${palette.border}`,
  borderRadius: 999,
  padding: "5px 8px",
  color: palette.muted,
  background: "rgba(255,255,255,0.72)",
  fontWeight: 700,
  fontSize: 12,
};

const resourceButtonStyle = {
  display: "inline-flex",
  width: "fit-content",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  border: `1px solid ${palette.navy}`,
  background: palette.navy,
  color: "#fff",
  borderRadius: 999,
  padding: "8px 12px",
  fontSize: 13,
  fontWeight: 800,
  lineHeight: 1.15,
};

const firstLessonResource = (entry = {}) => {
  const lesenHoeren = toLessonArray(entry.lesen_hören).filter(Boolean);
  const schreibenSprechen = toLessonArray(entry.schreiben_sprechen).filter(Boolean);
  return lesenHoeren[0] || schreibenSprechen[0] || {};
};

const lessonResourceUrl = (entry = {}, key, level = "", day = "") => {
  const internalUrl = INTERNAL_RESOURCE_ROUTES[normalizeLevel(level)]?.[Number(day || entry.day)]?.[key];
  if (internalUrl) return internalUrl;

  const primaryResource = firstLessonResource(entry);
  const nestedSchreiben = toLessonArray(entry.schreiben_sprechen).find((resource) => resource?.[key]);
  const nestedLesen = toLessonArray(entry.lesen_hören).find((resource) => resource?.[key]);
  return entry[key] || primaryResource[key] || nestedSchreiben?.[key] || nestedLesen?.[key] || "";
};

const findVideo = (videos = [], keyword) => videos.find((resource) => String(resource.title || "").toLowerCase().includes(keyword));

const LessonResourceCard = ({ number, icon, title, description, actionLabel, url }) => {
  if (!url) return null;

  return (
    <article
      style={{
        border: `1px solid ${palette.border}`,
        borderRadius: 14,
        background: "#fffaf3",
        padding: 12,
        display: "grid",
        gridTemplateColumns: "34px minmax(0, 1fr)",
        gap: 10,
        alignItems: "start",
      }}
    >
      <span
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff7ed",
          border: `1px solid ${palette.amberSoft}`,
          fontWeight: 900,
          color: palette.amber,
          fontSize: 13,
        }}
      >
        {number}
      </span>
      <div style={{ display: "grid", gap: 6, minWidth: 0 }}>
        <strong style={{ color: palette.ink, fontSize: 15, lineHeight: 1.25 }}>
          {icon} {title}
        </strong>
        <p style={{ margin: 0, color: palette.muted, fontSize: 13, lineHeight: 1.45 }}>{description}</p>
        <a href={url} {...getExternalProps(url)} style={resourceButtonStyle}>
          {actionLabel} ›
        </a>
      </div>
    </article>
  );
};

const LessonResourcesHub = ({ entry, videoResources, level, day }) => {
  const normalizedLevel = normalizeLevel(level);
  const showTeacherLecture = normalizedLevel === "A1";
  const teacherVideo = showTeacherLecture ? findVideo(videoResources, "teacher") || videoResources?.[0] : null;
  const aiVideo =
    findVideo(videoResources, "ai") ||
    (showTeacherLecture ? videoResources?.find((resource) => resource?.url !== teacherVideo?.url) : videoResources?.[0]);
  const grammarUrl = lessonResourceUrl(entry, "grammarbook_link", level, day);
  const workbookUrl = lessonResourceUrl(entry, "workbook_link", level, day);
  const aiVideoNumber = showTeacherLecture ? "2" : "1";
  const grammarNumber = showTeacherLecture ? "3" : "2";
  const workbookNumber = showTeacherLecture ? "4" : "3";

  return (
    <section
      style={{
        background: palette.card,
        border: `1px solid ${palette.amberSoft}`,
        borderRadius: 16,
        padding: 12,
        display: "grid",
        gap: 10,
        boxShadow: "0 8px 20px rgba(120, 53, 15, 0.06)",
      }}
    >
      <div style={{ display: "grid", gap: 4 }}>
        <h2 style={{ margin: 0, color: palette.ink, fontSize: 20, lineHeight: 1.15 }}>Lesson resources</h2>
        <p style={{ margin: 0, color: palette.muted, fontSize: 13, lineHeight: 1.45 }}>
          {showTeacherLecture
            ? "Choose what you want to use first: watch a lecture, study the grammar, or open the workbook."
            : "Use the AI lecture first, then study the grammar or open the workbook."}
        </p>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        {showTeacherLecture ? (
          <LessonResourceCard
            number="1"
            icon="🎬"
            title="Teacher lecture video"
            description={teacherVideo?.description || "Recorded class explanation from the teacher."}
            actionLabel="Watch teacher video"
            url={teacherVideo?.url}
          />
        ) : null}
        <LessonResourceCard
          number={aiVideoNumber}
          icon="🤖"
          title="AI lecture / grammar video"
          description={aiVideo?.description || "AI explanation for revision and self-study."}
          actionLabel="Watch AI video"
          url={aiVideo?.url}
        />
        <LessonResourceCard
          number={grammarNumber}
          icon="📘"
          title="Grammar book"
          description="Read the grammar notes and examples before or after watching the videos."
          actionLabel="Open grammar book"
          url={grammarUrl}
        />
        <LessonResourceCard
          number={workbookNumber}
          icon="📝"
          title="Workbook"
          description="Open the workbook, answer the tasks, and prepare your final answers."
          actionLabel="Open workbook"
          url={workbookUrl}
        />
      </div>
    </section>
  );
};

const SubmitAssignmentCard = ({ canSubmit, submitLabel, onSubmit }) => {
  if (!canSubmit) return null;

  return (
    <section
      style={{
        background: "#eff6ff",
        border: "1px solid #bfdbfe",
        borderRadius: 14,
        padding: 12,
        display: "grid",
        gap: 8,
      }}
    >
      <strong style={{ color: "#1e3a8a", fontSize: 14 }}>Finished the workbook?</strong>
      <p style={{ margin: 0, color: "#334155", fontSize: 13, lineHeight: 1.45 }}>Submit your final answers when you are ready.</p>
      <button type="button" style={{ ...resourceButtonStyle, borderColor: "#2563eb", background: "#2563eb" }} onClick={onSubmit}>
        {submitLabel} ›
      </button>
    </section>
  );
};

const TextBlock = ({ title, children }) => {
  if (!children) return null;
  return (
    <section style={{ display: "grid", gap: 6 }}>
      <h2 style={{ margin: 0, fontSize: 18 }}>{title}</h2>
      <p style={{ margin: 0, lineHeight: 1.55, fontSize: 14 }}>{children}</p>
    </section>
  );
};

const CourseLessonPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const level = normalizeLevel(location.state?.level || params.level);
  const day = location.state?.day ?? params.day;
  const entry = useMemo(() => {
    if (location.state?.entry) return location.state.entry;
    return (courseSchedules[level] || []).find((lesson) => String(lesson.day) === String(day)) || null;
  }, [day, level, location.state]);

  if (level === "B1") {
    const query = new URLSearchParams(location.search);
    const dayNumber = Number(day);

    if (query.get("view") === "grammar" && B1_GRAMMAR_PAGES[dayNumber]) {
      const GrammarPage = B1_GRAMMAR_PAGES[dayNumber];
      return <GrammarPage />;
    }

    if (query.get("view") === "workbook" && B1_WORKBOOK_PAGES[dayNumber]) {
      const WorkbookPage = B1_WORKBOOK_PAGES[dayNumber];
      return <WorkbookPage />;
    }
  }

  const SelfLearningComponent = getSelfLearningLessonComponent(level, day);
  const isSelfLearning = SELF_LEARNING_LEVELS.has(level);
  const assignmentKey = location.state?.assignmentKey || entry?.assignmentId || entry?.assignment_id || `${level}-DAY-${day}`;
  const status = location.state?.status || entry?.completion?.nonActionableStatus || "notStarted";
  const scoreText = location.state?.scoreText || "";
  const videoResources = getLessonVideoResources(level, day, entry || {});
  const primaryResource = firstLessonResource(entry || {});
  const submitLabel = primaryResource.chapter ? `Submit Kapitel ${primaryResource.chapter} assignment` : "Submit assignment";
  const canSubmit = Boolean(entry?.assignment && !isSelfLearning);

  const handleSubmitAssignment = () => {
    if (!assignmentKey || isSelfLearning) return;
    navigate(`/campus/submit?assignmentKey=${encodeURIComponent(assignmentKey)}&assignmentId=${encodeURIComponent(assignmentKey)}`, {
      state: {
        assignmentKey,
        assignmentId: assignmentKey,
        canonicalAssignmentId: assignmentKey,
        day: entry?.day || day,
        level,
        assignmentTitle: entry?.topic || "Assignment",
      },
    });
  };

  if (SelfLearningComponent) {
    return <SelfLearningComponent />;
  }

  if (!entry) {
    return (
      <div style={{ ...styles.container, display: "grid", gap: 12 }}>
        <button type="button" style={{ ...styles.secondaryButton, justifySelf: "start" }} onClick={() => navigate("/campus/course")}>← Course Book</button>
        <div style={styles.card}>
          <h1 style={{ marginTop: 0 }}>Lesson not found</h1>
          <p style={{ marginBottom: 0 }}>We could not find Day {day} for {level || "this level"}.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        ...styles.container,
        display: "grid",
        gap: 12,
        background: palette.page,
        borderRadius: 16,
        padding: "12px 10px 30px",
        maxWidth: 900,
      }}
    >
      <button type="button" style={{ ...styles.secondaryButton, justifySelf: "start", padding: "6px 10px", fontSize: 12 }} onClick={() => navigate("/campus/course")}>← Course Book</button>

      <article style={{ display: "grid", gap: 14 }}>
        <header style={{ position: "static", background: "rgba(255, 250, 243, 0.96)", border: `1px solid ${palette.border}`, borderRadius: 14, padding: 12, display: "grid", gap: 9 }}>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", alignItems: "center" }}>
            <span style={pillStyle}>{level}</span>
            <span style={pillStyle}>Day {entry.day ?? day}</span>
            {entry.chapter ? <span style={pillStyle}>Kapitel {entry.chapter}</span> : null}
            {isSelfLearning ? <span style={styles.badge}>AI self-learning</span> : <span style={styles.badge}>Status: {status}</span>}
            {scoreText ? <span style={styles.badge}>{scoreText}</span> : null}
          </div>
          <div style={{ display: "grid", gap: 5 }}>
            <h1 style={{ margin: 0, color: palette.ink, fontSize: 24, lineHeight: 1.12 }}>{entry.topic || `Day ${entry.day ?? day}`}</h1>
            {entry.grammar_topic ? <p style={{ ...styles.helperText, margin: 0, lineHeight: 1.4 }}>Grammar topic: {entry.grammar_topic}</p> : null}
            {entry.goal ? <p style={{ margin: 0, color: palette.muted, lineHeight: 1.45, fontSize: 14 }}>{entry.goal}</p> : null}
          </div>
          {isSelfLearning ? (
            <div style={{ border: "1px solid #bfdbfe", background: "#eff6ff", borderRadius: 12, padding: 10, fontSize: 13, lineHeight: 1.45 }}>
              <strong>No tutor submission.</strong> This level is self-learning. Practise with Falowen AI, use the feedback, enter your score and self-mark your progress.
            </div>
          ) : null}
        </header>

        {entry.instruction ? (
          <section style={{ ...styles.card, background: "#fffaf3", border: `1px solid ${palette.border}`, display: "grid", gap: 6, padding: 12, marginBottom: 0 }}>
            <h2 style={{ margin: 0, fontSize: 18, color: palette.ink }}>Lesson instructions</h2>
            <p style={{ margin: 0, lineHeight: 1.55, whiteSpace: "pre-line", color: palette.muted, fontSize: 14 }}>{entry.instruction}</p>
          </section>
        ) : null}

        <LessonResourcesHub entry={entry} videoResources={videoResources} level={level} day={day} />
        <SubmitAssignmentCard canSubmit={canSubmit} submitLabel={submitLabel} onSubmit={handleSubmitAssignment} />

        <TextBlock title="Schreiben">{entry.schreiben}</TextBlock>
        <TextBlock title="Sprechen">{entry.sprechen}</TextBlock>
        <TextBlock title="Zusatzmaterial">{entry.zusatzmaterial}</TextBlock>
      </article>
    </div>
  );
};

export default CourseLessonPage;
