import React, { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { styles } from "../styles";
import { courseSchedules } from "../data/courseSchedule";
import { RESOURCE_ACTION_LABELS } from "./ResourceLinkRow";
import { getSelfLearningLessonComponent } from "./SelfLearningLessonRegistry";

const toLessonArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);
const normalizeLevel = (level = "") => String(level || "").trim().toUpperCase();
const isInternalLink = (url = "") => String(url || "").startsWith("/");
const SELF_LEARNING_LEVELS = new Set(["B2", "C1"]);
const WORKSPACE_LEVELS = new Set(["A2", "B1"]);

const ResourceAnchor = ({ label, url }) => {
  if (!url) return null;
  const externalProps = isInternalLink(url) ? {} : { target: "_blank", rel: "noreferrer" };
  return (
    <li>
      <a href={url} {...externalProps}>{label}</a>
    </li>
  );
};

const pickPrimaryResource = (entry = {}) => {
  const rows = [...toLessonArray(entry.lesen_hören), ...toLessonArray(entry.schreiben_sprechen), entry].filter(Boolean);
  return rows.find((row) => row.workbook_link) || rows[0] || entry;
};

const buildSourceLesson = (entry = {}, level = "") => {
  const primary = pickPrimaryResource(entry);
  return {
    level,
    day: entry.day,
    chapter: primary.chapter || entry.chapter,
    topic: entry.topic || primary.title,
    goal: entry.goal,
    instruction: entry.instruction,
    grammarTopic: entry.grammar_topic,
    video: primary.video || primary.youtube_link || entry.video || entry.youtube_link,
    grammarLink: primary.grammarbook_link || entry.grammarbook_link,
    workbookLink: primary.workbook_link || entry.workbook_link,
  };
};

const LessonResourceList = ({ title, lessons, isSelfLearning, onSubmit }) => {
  const rows = toLessonArray(lessons).filter(Boolean);
  if (!rows.length) return null;

  return (
    <section style={{ display: "grid", gap: 10 }}>
      <h2 style={{ margin: 0, fontSize: 20 }}>{title}</h2>
      <div style={{ display: "grid", gap: 10 }}>
        {rows.map((lesson, index) => (
          <article
            key={`${title}-${lesson.chapter || lesson.title || index}`}
            style={{
              padding: 14,
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              background: "#f9fafb",
              display: "grid",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
              <strong>{lesson.chapter ? `Kapitel ${lesson.chapter}` : lesson.title || "Resource"}</strong>
              {lesson.assignment && !isSelfLearning ? <span style={styles.badge}>Assignment</span> : null}
              {isSelfLearning ? <span style={styles.badge}>AI practice</span> : null}
            </div>
            {lesson.title && lesson.chapter ? <p style={{ ...styles.helperText, margin: 0 }}>{lesson.title}</p> : null}
            {lesson.note ? <p style={{ margin: 0 }}>{lesson.note}</p> : null}
            <ul style={{ ...styles.checklist, margin: 0 }}>
              <ResourceAnchor label={RESOURCE_ACTION_LABELS.video} url={lesson.video || lesson.youtube_link} />
              <ResourceAnchor label={RESOURCE_ACTION_LABELS.grammarbook} url={lesson.grammarbook_link} />
              <ResourceAnchor label={RESOURCE_ACTION_LABELS.workbook} url={lesson.workbook_link} />
            </ul>
            {lesson.assignment && !isSelfLearning ? (
              <button type="button" style={{ ...styles.primaryButton, justifySelf: "start" }} onClick={onSubmit}>
                Submit {lesson.chapter ? `Kapitel ${lesson.chapter}` : "this"} assignment
              </button>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
};

const TextBlock = ({ title, children }) => {
  if (!children) return null;
  return (
    <section style={{ display: "grid", gap: 8 }}>
      <h2 style={{ margin: 0, fontSize: 20 }}>{title}</h2>
      <p style={{ margin: 0, lineHeight: 1.7 }}>{children}</p>
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

  const SelfLearningComponent = getSelfLearningLessonComponent(level, day);
  if (SelfLearningComponent) {
    return <SelfLearningComponent />;
  }

  const isSelfLearning = SELF_LEARNING_LEVELS.has(level);
  const isWorkbookWorkspaceLevel = WORKSPACE_LEVELS.has(level);
  const sourceLesson = useMemo(() => buildSourceLesson(entry || {}, level), [entry, level]);
  const workbookLink = sourceLesson.workbookLink;
  const assignmentKey = location.state?.assignmentKey || entry?.assignmentId || entry?.assignment_id || `${level}-DAY-${day}`;
  const status = location.state?.status || entry?.completion?.nonActionableStatus || "notStarted";
  const scoreText = location.state?.scoreText || "";

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

  const openWorkbook = () => {
    if (!workbookLink) return;
    if (isInternalLink(workbookLink)) {
      navigate(workbookLink, { state: { sourceLesson } });
      return;
    }
    window.open(workbookLink, "_blank", "noopener,noreferrer");
  };

  if (!entry) {
    return (
      <div style={{ ...styles.container, display: "grid", gap: 16 }}>
        <button type="button" style={{ ...styles.secondaryButton, justifySelf: "start" }} onClick={() => navigate("/campus/course")}>
          ← Course Book
        </button>
        <div style={styles.card}>
          <h1 style={{ marginTop: 0 }}>Lesson not found</h1>
          <p style={{ marginBottom: 0 }}>We could not find Day {day} for {level || "this level"}.</p>
        </div>
      </div>
    );
  }

  if (isWorkbookWorkspaceLevel) {
    return (
      <div style={{ ...styles.container, display: "grid", gap: 16 }}>
        <button type="button" style={{ ...styles.secondaryButton, justifySelf: "start" }} onClick={() => navigate("/campus/course")}>
          ← Course Book
        </button>

        <article style={{ ...styles.card, display: "grid", gap: 18 }}>
          <header style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <span style={styles.levelPill}>{level}</span>
              <span style={styles.levelPill}>Day {entry.day ?? day}</span>
              {entry.chapter ? <span style={styles.levelPill}>Chapter {entry.chapter}</span> : null}
              <span style={styles.badge}>Status: {status}</span>
              {scoreText ? <span style={styles.badge}>{scoreText}</span> : null}
            </div>
            <h1 style={{ margin: 0 }}>{entry.topic || `Day ${entry.day ?? day}`}</h1>
            {entry.goal ? <p style={{ margin: 0 }}>{entry.goal}</p> : null}
          </header>

          <section
            style={{
              border: "1px solid #bfdbfe",
              borderRadius: 16,
              padding: 16,
              background: "#eff6ff",
              display: "grid",
              gap: 12,
            }}
          >
            <h2 style={{ margin: 0, fontSize: 20 }}>Open your lesson workbook</h2>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Video, Grammar, Sprechen, Schreiben, Lesen, Hören and Class Notes are now inside one workbook workspace. Open the workbook and follow the tabs from left to right.
            </p>
            {entry.grammar_topic ? <p style={{ margin: 0 }}><strong>Grammar focus:</strong> {entry.grammar_topic}</p> : null}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" style={styles.primaryButton} onClick={openWorkbook} disabled={!workbookLink}>
                Open lesson workbook
              </button>
              {entry.assignment ? (
                <button type="button" style={styles.secondaryButton} onClick={handleSubmitAssignment}>
                  Submit final answers
                </button>
              ) : null}
            </div>
            {entry.assignment ? (
              <p style={{ ...styles.helperText, margin: 0 }}>
                Submit only final answers for Teil 2, Teil 3 and Teil 4 in the Submission tab. Teil 1 is for class preparation.
              </p>
            ) : null}
          </section>
        </article>
      </div>
    );
  }

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <button type="button" style={{ ...styles.secondaryButton, justifySelf: "start" }} onClick={() => navigate("/campus/course")}>
        ← Course Book
      </button>

      <article style={{ ...styles.card, display: "grid", gap: 18 }}>
        <header style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={styles.levelPill}>{level}</span>
            <span style={styles.levelPill}>Day {entry.day ?? day}</span>
            {entry.chapter ? <span style={styles.levelPill}>Chapter {entry.chapter}</span> : null}
            {isSelfLearning ? <span style={styles.badge}>AI self-learning</span> : <span style={styles.badge}>Status: {status}</span>}
            {scoreText ? <span style={styles.badge}>{scoreText}</span> : null}
          </div>
          <h1 style={{ margin: 0 }}>{entry.topic || `Day ${entry.day ?? day}`}</h1>
          {entry.grammar_topic ? <p style={{ ...styles.helperText, margin: 0 }}>Grammar topic: {entry.grammar_topic}</p> : null}
          {entry.goal ? <p style={{ margin: 0 }}>{entry.goal}</p> : null}
          {isSelfLearning ? (
            <div style={{ border: "1px solid #bfdbfe", background: "#eff6ff", borderRadius: 14, padding: 14 }}>
              <strong>No tutor submission.</strong> This level is self-learning. Practise with Falowen AI, use the feedback, enter your score and self-mark your progress.
            </div>
          ) : entry.assignment ? (
            <button type="button" style={{ ...styles.primaryButton, justifySelf: "start" }} onClick={handleSubmitAssignment}>
              Submit this assignment
            </button>
          ) : null}
        </header>

        {entry.instruction ? (
          <section style={{ display: "grid", gap: 8 }}>
            <h2 style={{ margin: 0, fontSize: 20 }}>Lesson instructions</h2>
            <p style={{ margin: 0, lineHeight: 1.7, whiteSpace: "pre-line" }}>{entry.instruction}</p>
          </section>
        ) : null}

        <LessonResourceList title="Lesen & Hören" lessons={entry.lesen_hören} isSelfLearning={isSelfLearning} onSubmit={handleSubmitAssignment} />
        <LessonResourceList title="Schreiben & Sprechen" lessons={entry.schreiben_sprechen} isSelfLearning={isSelfLearning} onSubmit={handleSubmitAssignment} />

        <ul style={{ ...styles.checklist, margin: 0 }}>
          <ResourceAnchor label={RESOURCE_ACTION_LABELS.video} url={entry.video || entry.youtube_link || entry.tutorial_video_url} />
          <ResourceAnchor label={RESOURCE_ACTION_LABELS.grammarbook} url={entry.grammarbook_link} />
          <ResourceAnchor label={RESOURCE_ACTION_LABELS.workbook} url={entry.workbook_link} />
        </ul>

        <TextBlock title="Schreiben">{entry.schreiben}</TextBlock>
        <TextBlock title="Sprechen">{entry.sprechen}</TextBlock>
        <TextBlock title="Zusatzmaterial">{entry.zusatzmaterial}</TextBlock>
      </article>
    </div>
  );
};

export default CourseLessonPage;
