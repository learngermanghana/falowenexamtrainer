import React, { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { styles } from "../styles";
import { courseSchedules } from "../data/courseSchedule";
import { getLessonVideoResources } from "../data/lessonVideoDictionary";
import { RESOURCE_ACTION_LABELS } from "./ResourceLinkRow";
import { getSelfLearningLessonComponent } from "./SelfLearningLessonRegistry";
import B1Day1TraumweltWorkbookPage from "./B1Day1TraumweltWorkbookPage";
import B1Day1TraumweltGrammarNotesPage from "./B1Day1TraumweltGrammarNotesPage";
import B1Day2FreundeFuersLebenGrammarNotesPage from "./B1Day2FreundeFuersLebenGrammarNotesPage";

const toLessonArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);
const normalizeLevel = (level = "") => String(level || "").trim().toUpperCase();
const isInternalLink = (url = "") => String(url || "").startsWith("/");
const SELF_LEARNING_LEVELS = new Set(["B2", "C1"]);

const B1_GRAMMAR_PAGES = {
  1: B1Day1TraumweltGrammarNotesPage,
  2: B1Day2FreundeFuersLebenGrammarNotesPage,
};

const B1_WORKBOOK_PAGES = {
  1: B1Day1TraumweltWorkbookPage,
};

const actionButtonStyle = {
  ...styles.primaryButton,
  display: "inline-flex",
  width: "fit-content",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
};

const secondaryActionButtonStyle = {
  ...styles.secondaryButton,
  display: "inline-flex",
  width: "fit-content",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
};

const getExternalProps = (url = "") => (isInternalLink(url) ? {} : { target: "_blank", rel: "noreferrer" });

const ResourceAnchor = ({ label, url }) => {
  if (!url) return null;
  return (
    <li>
      <a href={url} {...getExternalProps(url)}>{label}</a>
    </li>
  );
};

const ActionLink = ({ href, children, primary = false }) => {
  if (!href) return null;
  return (
    <a href={href} {...getExternalProps(href)} style={primary ? actionButtonStyle : secondaryActionButtonStyle}>
      {children}
    </a>
  );
};

const getVideoActionLabel = (resource = {}) => {
  const title = String(resource.title || "").toLowerCase();
  if (title.includes("teacher")) return "🎬 Watch teacher explanation";
  if (title.includes("ai")) return "🎬 Watch AI grammar video";
  return "🎬 Watch video";
};

const VideoResourceCard = ({ resource }) => {
  if (!resource?.url) return null;

  return (
    <article
      style={{
        padding: 14,
        border: "1px solid #dbeafe",
        borderRadius: 12,
        background: "#eff6ff",
        display: "grid",
        gap: 8,
      }}
    >
      <strong>{resource.title}</strong>
      {resource.description ? <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.6 }}>{resource.description}</p> : null}
      <ActionLink href={resource.url}>{getVideoActionLabel(resource)}</ActionLink>
    </article>
  );
};

const firstLessonResource = (entry = {}) => {
  const lesenHoeren = toLessonArray(entry.lesen_hören).filter(Boolean);
  const schreibenSprechen = toLessonArray(entry.schreiben_sprechen).filter(Boolean);
  return lesenHoeren[0] || schreibenSprechen[0] || {};
};

const lessonResourceUrl = (entry = {}, key) => {
  const primaryResource = firstLessonResource(entry);
  const nestedSchreiben = toLessonArray(entry.schreiben_sprechen).find((resource) => resource?.[key]);
  const nestedLesen = toLessonArray(entry.lesen_hören).find((resource) => resource?.[key]);
  return entry[key] || primaryResource[key] || nestedSchreiben?.[key] || nestedLesen?.[key] || "";
};

const LessonStartGuide = ({ entry, videoResources, isSelfLearning, onSubmit }) => {
  const grammarUrl = lessonResourceUrl(entry, "grammarbook_link");
  const workbookUrl = lessonResourceUrl(entry, "workbook_link");
  const primaryResource = firstLessonResource(entry);
  const submitLabel = primaryResource.chapter ? `Submit Kapitel ${primaryResource.chapter} assignment` : "Submit assignment";
  const canSubmit = Boolean(entry?.assignment && !isSelfLearning);

  return (
    <section
      style={{
        border: "1px solid #bfdbfe",
        background: "#eff6ff",
        borderRadius: 16,
        padding: 16,
        display: "grid",
        gap: 14,
      }}
    >
      <div style={{ display: "grid", gap: 4 }}>
        <h2 style={{ margin: 0, fontSize: 22 }}>Start here</h2>
        <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.6 }}>
          Follow these steps in order. Watch, review, practise, then submit your work.
        </p>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        <article style={{ display: "grid", gap: 10 }}>
          <strong>Step 1: Watch the lesson videos</strong>
          {videoResources?.length ? (
            <div style={{ display: "grid", gap: 10 }}>
              {videoResources.map((resource) => <VideoResourceCard key={resource.key || resource.url} resource={resource} />)}
            </div>
          ) : (
            <ActionLink href={entry.video || entry.youtube_link || entry.tutorial_video_url}>🎬 Watch video</ActionLink>
          )}
        </article>

        <article style={{ display: "grid", gap: 8 }}>
          <strong>Step 2: Review the grammar</strong>
          <ActionLink href={grammarUrl}>📘 Open grammar notes</ActionLink>
        </article>

        <article style={{ display: "grid", gap: 8 }}>
          <strong>Step 3: Complete the workbook</strong>
          <ActionLink href={workbookUrl}>📝 Open workbook</ActionLink>
        </article>

        {canSubmit ? (
          <article style={{ display: "grid", gap: 8 }}>
            <strong>Step 4: Submit your assignment</strong>
            <button type="button" style={actionButtonStyle} onClick={onSubmit}>
              {submitLabel}
            </button>
          </article>
        ) : null}
      </div>

      {canSubmit ? (
        <div style={{ border: "1px solid #dbeafe", background: "#ffffff", borderRadius: 12, padding: 12, lineHeight: 1.6 }}>
          <strong>What should I submit?</strong> Complete the workbook task first, then submit your final answers in the submission area.
        </div>
      ) : null}
    </section>
  );
};

const LessonResourceList = ({ title, lessons, isSelfLearning, hideVideoLink = false }) => {
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
              {!hideVideoLink ? <ResourceAnchor label={RESOURCE_ACTION_LABELS.video} url={lesson.video || lesson.youtube_link} /> : null}
              <ResourceAnchor label={RESOURCE_ACTION_LABELS.grammarbook} url={lesson.grammarbook_link} />
              <ResourceAnchor label={RESOURCE_ACTION_LABELS.workbook} url={lesson.workbook_link} />
            </ul>
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
          ) : null}
        </header>

        {entry.instruction ? (
          <section style={{ display: "grid", gap: 8 }}>
            <h2 style={{ margin: 0, fontSize: 20 }}>Lesson instructions</h2>
            <p style={{ margin: 0, lineHeight: 1.7, whiteSpace: "pre-line" }}>{entry.instruction}</p>
          </section>
        ) : null}

        <LessonStartGuide entry={entry} videoResources={videoResources} isSelfLearning={isSelfLearning} onSubmit={handleSubmitAssignment} />

        <LessonResourceList title="Lesson resources" lessons={entry.lesen_hören} isSelfLearning={isSelfLearning} hideVideoLink={Boolean(videoResources.length)} />
        <LessonResourceList title="Extra practice" lessons={entry.schreiben_sprechen} isSelfLearning={isSelfLearning} hideVideoLink={Boolean(videoResources.length)} />

        <ul style={{ ...styles.checklist, margin: 0 }}>
          {!videoResources.length ? <ResourceAnchor label={RESOURCE_ACTION_LABELS.video} url={entry.video || entry.youtube_link || entry.tutorial_video_url} /> : null}
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
