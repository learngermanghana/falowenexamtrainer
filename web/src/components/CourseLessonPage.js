import React, { useMemo, useState } from "react";
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
const getExternalProps = (url = "") => (isInternalLink(url) ? {} : { target: "_blank", rel: "noreferrer" });
const SELF_LEARNING_LEVELS = new Set(["B2", "C1"]);

const B1_GRAMMAR_PAGES = {
  1: B1Day1TraumweltGrammarNotesPage,
  2: B1Day2FreundeFuersLebenGrammarNotesPage,
};

const B1_WORKBOOK_PAGES = {
  1: B1Day1TraumweltWorkbookPage,
};

const palette = {
  page: "#f6f1e9",
  card: "#fffaf3",
  ink: "#1f1d2b",
  muted: "#6f6a80",
  amber: "#d97706",
  amberSoft: "#fed7aa",
  navy: "#262b5f",
  blueSoft: "#eef3ff",
  border: "#eadfd0",
  success: "#059669",
};

const actionButtonStyle = {
  ...styles.primaryButton,
  background: palette.navy,
  borderColor: palette.navy,
  color: "#fff",
  display: "inline-flex",
  width: "fit-content",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  gap: 6,
  borderRadius: 14,
  padding: "8px 12px",
  fontSize: 13,
  lineHeight: 1.15,
};

const secondaryActionButtonStyle = {
  ...styles.secondaryButton,
  background: "#fff",
  borderColor: "#d8d1f2",
  color: palette.navy,
  display: "inline-flex",
  width: "fit-content",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  gap: 6,
  borderRadius: 14,
  padding: "8px 12px",
  fontSize: 13,
  lineHeight: 1.15,
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

const ActionLink = ({ href, children, primary = false, onClick }) => {
  if (!href) return null;
  return (
    <a href={href} {...getExternalProps(href)} onClick={onClick} style={primary ? actionButtonStyle : secondaryActionButtonStyle}>
      {children}
    </a>
  );
};

const ResourceAnchor = ({ label, url }) => {
  if (!url) return null;
  return (
    <a href={url} {...getExternalProps(url)} style={secondaryActionButtonStyle}>
      {label}
    </a>
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

const getVideoActionLabel = (resource = {}) => {
  const title = String(resource.title || "").toLowerCase();
  if (title.includes("teacher")) return "Watch teacher video";
  if (title.includes("ai")) return "Watch AI video";
  return "Watch video";
};

const VideoResourceCard = ({ resource, onOpen }) => {
  if (!resource?.url) return null;

  return (
    <article
      style={{
        border: "1px solid #c7d2fe",
        background: palette.blueSoft,
        borderRadius: 14,
        padding: 10,
        display: "grid",
        gap: 8,
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "28px minmax(0, 1fr)", gap: 9, alignItems: "start" }}>
        <span style={{ fontSize: 22, lineHeight: 1 }}>🎬</span>
        <div style={{ display: "grid", gap: 6, minWidth: 0 }}>
          <strong style={{ color: palette.ink, fontSize: 14, lineHeight: 1.25 }}>{resource.title}</strong>
          {resource.description ? <span style={{ color: palette.muted, lineHeight: 1.4, fontSize: 13 }}>{resource.description}</span> : null}
          <ActionLink href={resource.url} primary onClick={onOpen}>
            {getVideoActionLabel(resource)} ›
          </ActionLink>
        </div>
      </div>
    </article>
  );
};

const LessonStepCard = ({ number, title, children, active, complete, locked, onToggle }) => (
  <article
    style={{
      border: active ? `1px solid ${palette.amberSoft}` : `1px solid ${palette.border}`,
      borderRadius: 14,
      background: active ? "#fffdf8" : "rgba(255,255,255,0.65)",
      boxShadow: active ? "0 8px 18px rgba(146, 64, 14, 0.06)" : "none",
      overflow: "hidden",
    }}
  >
    <button
      type="button"
      onClick={onToggle}
      style={{
        width: "100%",
        border: 0,
        background: "transparent",
        padding: "11px 12px",
        display: "grid",
        gridTemplateColumns: "34px minmax(0, 1fr) auto",
        gap: 9,
        alignItems: "center",
        textAlign: "left",
        cursor: "pointer",
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
          background: active ? palette.amber : complete ? palette.success : "#eee7dc",
          color: active || complete ? "#fff" : palette.muted,
          fontWeight: 800,
          fontSize: 15,
        }}
      >
        {complete ? "✓" : number}
      </span>
      <strong style={{ color: active ? palette.ink : palette.muted, fontSize: 15, lineHeight: 1.15 }}>{title}</strong>
      <span style={{ color: palette.muted, fontSize: 13 }}>{locked ? "🔒" : active ? "⌃" : "⌄"}</span>
    </button>
    {active ? <div style={{ padding: "0 12px 12px 12px", display: "grid", gap: 9 }}>{children}</div> : null}
  </article>
);

const LessonStartGuide = ({ entry, videoResources, isSelfLearning, onSubmit }) => {
  const grammarUrl = lessonResourceUrl(entry, "grammarbook_link");
  const workbookUrl = lessonResourceUrl(entry, "workbook_link");
  const primaryResource = firstLessonResource(entry);
  const submitLabel = primaryResource.chapter ? `Submit Kapitel ${primaryResource.chapter} assignment` : "Submit assignment";
  const canSubmit = Boolean(entry?.assignment && !isSelfLearning);
  const [openStep, setOpenStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(() => new Set());

  const markComplete = (step, nextStep) => {
    setCompletedSteps((previous) => {
      const next = new Set(previous);
      next.add(step);
      return next;
    });
    if (nextStep) setOpenStep(nextStep);
  };

  const isComplete = (step) => completedSteps.has(step);

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
        <span style={{ color: palette.amber, letterSpacing: 1.6, textTransform: "uppercase", fontWeight: 800, fontSize: 10 }}>Start here</span>
        <h2 style={{ margin: 0, color: palette.ink, fontSize: 19, lineHeight: 1.15 }}>Follow the steps.</h2>
        <p style={{ margin: 0, color: palette.muted, fontSize: 13, lineHeight: 1.45 }}>Watch, review, complete the workbook, then submit.</p>
      </div>

      <div style={{ display: "grid", gap: 9 }}>
        <LessonStepCard
          number={1}
          title="Step 1: Watch videos"
          active={openStep === 1}
          complete={isComplete(1)}
          onToggle={() => setOpenStep(openStep === 1 ? 0 : 1)}
        >
          {videoResources?.length ? (
            videoResources.map((resource) => (
              <VideoResourceCard key={resource.key || resource.url} resource={resource} onOpen={() => markComplete(1, 2)} />
            ))
          ) : (
            <ActionLink href={entry.video || entry.youtube_link || entry.tutorial_video_url} primary onClick={() => markComplete(1, 2)}>
              🎬 Watch video ›
            </ActionLink>
          )}
        </LessonStepCard>

        <LessonStepCard
          number={2}
          title="Step 2: Review grammar"
          active={openStep === 2}
          complete={isComplete(2)}
          locked={!isComplete(1)}
          onToggle={() => setOpenStep(openStep === 2 ? 0 : 2)}
        >
          <p style={{ margin: 0, color: palette.muted, lineHeight: 1.45, fontSize: 13 }}>Read the grammar before doing the workbook.</p>
          <ActionLink href={grammarUrl} primary onClick={() => markComplete(2, 3)}>
            📘 Open grammar ›
          </ActionLink>
        </LessonStepCard>

        <LessonStepCard
          number={3}
          title="Step 3: Complete workbook"
          active={openStep === 3}
          complete={isComplete(3)}
          locked={!isComplete(2)}
          onToggle={() => setOpenStep(openStep === 3 ? 0 : 3)}
        >
          <p style={{ margin: 0, color: palette.muted, lineHeight: 1.45, fontSize: 13 }}>Open the workbook and prepare your final answers.</p>
          <ActionLink href={workbookUrl} primary onClick={() => markComplete(3, 4)}>
            📝 Open workbook ›
          </ActionLink>
        </LessonStepCard>

        {canSubmit ? (
          <LessonStepCard
            number={4}
            title="Step 4: Submit"
            active={openStep === 4}
            complete={false}
            locked={!isComplete(3)}
            onToggle={() => setOpenStep(openStep === 4 ? 0 : 4)}
          >
            <div style={{ display: "grid", gap: 8 }}>
              <p style={{ margin: 0, color: palette.muted, lineHeight: 1.45, fontSize: 13 }}>Submit after you complete the workbook.</p>
              <button type="button" style={actionButtonStyle} onClick={onSubmit}>
                {submitLabel} ›
              </button>
            </div>
          </LessonStepCard>
        ) : null}
      </div>
    </section>
  );
};

const LessonResourceList = ({ title, lessons, isSelfLearning, hideVideoLink = false }) => {
  const rows = toLessonArray(lessons).filter(Boolean);
  if (!rows.length) return null;

  return (
    <section style={{ display: "grid", gap: 8 }}>
      <h2 style={{ margin: 0, color: palette.ink, fontSize: 18 }}>📄 {title}</h2>
      <div style={{ display: "grid", gap: 8 }}>
        {rows.map((lesson, index) => (
          <article
            key={`${title}-${lesson.chapter || lesson.title || index}`}
            style={{
              border: `1px solid ${palette.border}`,
              borderRadius: 14,
              background: "#fffaf3",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: 12, display: "grid", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                <strong style={{ color: palette.ink, fontSize: 15 }}>{lesson.chapter ? `Kapitel ${lesson.chapter}` : lesson.title || "Resource"}</strong>
                {lesson.assignment && !isSelfLearning ? <span style={styles.badge}>Assignment</span> : null}
                {isSelfLearning ? <span style={styles.badge}>AI practice</span> : null}
              </div>
              {lesson.title && lesson.chapter ? <p style={{ ...styles.helperText, margin: 0, lineHeight: 1.4 }}>{lesson.title}</p> : null}
              {lesson.note ? <p style={{ margin: 0, color: palette.muted, lineHeight: 1.45, fontSize: 13 }}>{lesson.note}</p> : null}
            </div>
            <div style={{ borderTop: `1px solid ${palette.border}`, padding: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {!hideVideoLink ? <ResourceAnchor label={RESOURCE_ACTION_LABELS.video} url={lesson.video || lesson.youtube_link} /> : null}
              <ResourceAnchor label={RESOURCE_ACTION_LABELS.grammarbook} url={lesson.grammarbook_link} />
              <ResourceAnchor label={RESOURCE_ACTION_LABELS.workbook} url={lesson.workbook_link} />
            </div>
          </article>
        ))}
      </div>
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
      <button type="button" style={{ ...styles.secondaryButton, justifySelf: "start", padding: "6px 10px", fontSize: 12 }} onClick={() => navigate("/campus/course")}>
        ← Course Book
      </button>

      <article style={{ display: "grid", gap: 14 }}>
        <header
          style={{
            position: "static",
            background: "rgba(255, 250, 243, 0.96)",
            border: `1px solid ${palette.border}`,
            borderRadius: 14,
            padding: 12,
            display: "grid",
            gap: 9,
          }}
        >
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

        <LessonStartGuide entry={entry} videoResources={videoResources} isSelfLearning={isSelfLearning} onSubmit={handleSubmitAssignment} />

        <LessonResourceList title="Lesson resources" lessons={entry.lesen_hören} isSelfLearning={isSelfLearning} hideVideoLink={Boolean(videoResources.length)} />
        <LessonResourceList title="Extra practice" lessons={entry.schreiben_sprechen} isSelfLearning={isSelfLearning} hideVideoLink={Boolean(videoResources.length)} />

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {!videoResources.length ? <ResourceAnchor label={RESOURCE_ACTION_LABELS.video} url={entry.video || entry.youtube_link || entry.tutorial_video_url} /> : null}
          <ResourceAnchor label={RESOURCE_ACTION_LABELS.grammarbook} url={entry.grammarbook_link} />
          <ResourceAnchor label={RESOURCE_ACTION_LABELS.workbook} url={entry.workbook_link} />
        </div>

        <TextBlock title="Schreiben">{entry.schreiben}</TextBlock>
        <TextBlock title="Sprechen">{entry.sprechen}</TextBlock>
        <TextBlock title="Zusatzmaterial">{entry.zusatzmaterial}</TextBlock>
      </article>
    </div>
  );
};

export default CourseLessonPage;
