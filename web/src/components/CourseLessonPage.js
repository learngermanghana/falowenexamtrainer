import React, { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { styles } from "../styles";
import { courseSchedules } from "../data/courseSchedule";
import { getLessonVideoResources } from "../data/lessonVideoDictionary";
import { getSelfLearningLessonComponent } from "./SelfLearningLessonRegistry";
import B1Day1TraumweltWorkbookPage from "./B1Day1TraumweltWorkbookPage";
import B1Day1TraumweltGrammarNotesPage from "./B1Day1TraumweltGrammarNotesPage";
import B1Day2FreundeFuersLebenGrammarNotesPage from "./B1Day2FreundeFuersLebenGrammarNotesPage";

const DAY0_AI_ORIENTATION_VIDEO = {
  id: "qPwxBYlu3CE",
  url: "https://youtu.be/qPwxBYlu3CE",
  title: "A1 Orientation AI video",
  description:
    "Watch this AI orientation first, then scroll down to read the guide and open the workbook.",
};

const toLessonArray = (value) =>
  Array.isArray(value) ? value : value ? [value] : [];
const normalizeLevel = (level = "") =>
  String(level || "")
    .trim()
    .toUpperCase();
const normalizeChapter = (chapter = "") => String(chapter || "").trim();
const isInternalLink = (url = "") => String(url || "").startsWith("/");
const getExternalProps = (url = "") =>
  isInternalLink(url) ? {} : { target: "_blank", rel: "noreferrer" };
const SELF_LEARNING_LEVELS = new Set(["B2", "C1"]);

const isA1Day0Orientation = (level = "", day = "") =>
  normalizeLevel(level) === "A1" && String(Number(day || 0)) === "0";

const getYouTubeEmbedUrl = (videoId = "") =>
  `https://www.youtube-nocookie.com/embed/${videoId}`;

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

const lessonResourceEntries = (entry = {}, level = "", day = "") => {
  const nestedResources = [
    ...toLessonArray(entry.schreiben_sprechen),
    ...toLessonArray(entry.lesen_hören),
  ].filter(Boolean);
  const resources = nestedResources.length ? nestedResources : [entry];
  const internalRoutes =
    INTERNAL_RESOURCE_ROUTES[normalizeLevel(level)]?.[
      Number(day || entry.day)
    ] || {};

  return resources.map((resource) => ({
    ...resource,
    chapter: resource?.chapter || entry?.chapter || null,
    ...internalRoutes,
  }));
};

const firstLessonResource = (entry = {}) =>
  lessonResourceEntries(entry)[0] || {};

const isTeacherVideo = (resource = {}) =>
  `${resource.key || ""} ${resource.title || ""}`
    .toLowerCase()
    .includes("teacher");

const LessonResourceCard = ({
  number,
  icon,
  title,
  description,
  actionLabel,
  url,
}) => {
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
        <p
          style={{
            margin: 0,
            color: palette.muted,
            fontSize: 13,
            lineHeight: 1.45,
          }}
        >
          {description}
        </p>
        <a href={url} {...getExternalProps(url)} style={resourceButtonStyle}>
          {actionLabel} ›
        </a>
      </div>
    </article>
  );
};

const LessonVideoCard = ({ video, number, chapterLabel }) => {
  const teacherVideo = isTeacherVideo(video);
  const fallbackTitle = teacherVideo
    ? "Teacher lecture video"
    : "AI lecture / grammar video";
  const title = video.title || fallbackTitle;
  const displayTitle = chapterLabel && !title.includes(chapterLabel)
    ? `${chapterLabel} ${teacherVideo ? "teacher lecture video" : "AI grammar video"}`
    : title;

  return (
    <LessonResourceCard
      key={video.url}
      number={number}
      icon={teacherVideo ? "🎬" : "🤖"}
      title={displayTitle}
      description={
        video.description ||
        (teacherVideo
          ? "Recorded class explanation from the teacher."
          : "AI explanation for revision and self-study.")
      }
      actionLabel={teacherVideo ? "Watch teacher video" : "Watch AI video"}
      url={video.url}
    />
  );
};

const OrientationAiVideoHero = () => (
  <section
    style={{
      ...styles.card,
      background: "#111827",
      border: "1px solid #f59e0b",
      color: "#fff",
      display: "grid",
      gap: 10,
      padding: 12,
      marginBottom: 0,
    }}
  >
    <div style={{ display: "grid", gap: 4 }}>
      <span
        style={{
          ...pillStyle,
          width: "fit-content",
          color: "#fef3c7",
          background: "rgba(255,255,255,0.12)",
          borderColor: "rgba(254, 243, 199, 0.4)",
        }}
      >
        🤖 AI orientation video
      </span>
      <h2 style={{ margin: 0, fontSize: 20, color: "#fff" }}>
        {DAY0_AI_ORIENTATION_VIDEO.title}
      </h2>
      <p style={{ margin: 0, color: "#fde68a", fontSize: 13, lineHeight: 1.45 }}>
        {DAY0_AI_ORIENTATION_VIDEO.description}
      </p>
    </div>

    <div
      style={{
        position: "relative",
        width: "100%",
        paddingTop: "56.25%",
        borderRadius: 14,
        overflow: "hidden",
        background: "#000",
        boxShadow: "0 14px 30px rgba(0,0,0,0.18)",
      }}
    >
      <iframe
        title={DAY0_AI_ORIENTATION_VIDEO.title}
        src={getYouTubeEmbedUrl(DAY0_AI_ORIENTATION_VIDEO.id)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: 0,
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  </section>
);

const LessonResourcesHub = ({ entry, videoResources, level, day }) => {
  const lessonResources = lessonResourceEntries(entry, level, day).filter(
    (resource) => resource.grammarbook_link || resource.workbook_link,
  );
  const groupedVideoUrls = new Set();
  let resourceNumber = 0;
  const nextNumber = () => String(++resourceNumber);

  const videosForResource = (resource) => {
    const resourceChapter = normalizeChapter(resource.chapter);
    return videoResources.filter((video) => {
      const videoChapter = normalizeChapter(video.chapter);
      if (videoChapter && resourceChapter && videoChapter === resourceChapter) {
        groupedVideoUrls.add(video.url);
        return true;
      }
      if (!videoChapter && lessonResources.length === 1) {
        groupedVideoUrls.add(video.url);
        return true;
      }
      return false;
    });
  };

  const remainingVideos = () =>
    videoResources.filter((video) => !groupedVideoUrls.has(video.url));

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
        <h2
          style={{
            margin: 0,
            color: palette.ink,
            fontSize: 20,
            lineHeight: 1.15,
          }}
        >
          Lesson resources
        </h2>
        <p
          style={{
            margin: 0,
            color: palette.muted,
            fontSize: 13,
            lineHeight: 1.45,
          }}
        >
          Use the available videos, then study the grammar or open the workbook.
        </p>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        {lessonResources.map((resource, index) => {
          const chapterLabel = resource.chapter
            ? `Kapitel ${resource.chapter}`
            : lessonResources.length > 1
              ? `Lesson ${index + 1}`
              : "";
          const relatedVideos = videosForResource(resource);

          return (
            <React.Fragment
              key={`${resource.chapter || index}-${resource.grammarbook_link || ""}-${resource.workbook_link || ""}`}
            >
              {chapterLabel ? (
                <strong style={{ color: palette.ink, marginTop: 4 }}>
                  {chapterLabel}
                </strong>
              ) : null}
              {resource.grammarbook_link ? (
                <LessonResourceCard
                  number={nextNumber()}
                  icon="📘"
                  title={
                    chapterLabel
                      ? `${chapterLabel} grammar book`
                      : "Grammar book"
                  }
                  description="Read the grammar notes and examples before or after watching the videos."
                  actionLabel="Open grammar book"
                  url={resource.grammarbook_link}
                />
              ) : null}
              {resource.workbook_link ? (
                <LessonResourceCard
                  number={nextNumber()}
                  icon="📝"
                  title={chapterLabel ? `${chapterLabel} workbook` : "Workbook"}
                  description="Open the workbook, answer the tasks, and prepare your final answers."
                  actionLabel="Open workbook"
                  url={resource.workbook_link}
                />
              ) : null}
              {relatedVideos.map((video) => (
                <LessonVideoCard
                  key={video.url}
                  video={video}
                  number={nextNumber()}
                  chapterLabel={chapterLabel}
                />
              ))}
            </React.Fragment>
          );
        })}

        {remainingVideos().map((video) => (
          <LessonVideoCard
            key={video.url}
            video={video}
            number={nextNumber()}
            chapterLabel=""
          />
        ))}
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
      <strong style={{ color: "#1e3a8a", fontSize: 14 }}>
        Finished the workbook?
      </strong>
      <p
        style={{ margin: 0, color: "#334155", fontSize: 13, lineHeight: 1.45 }}
      >
        Submit your final answers when you are ready.
      </p>
      <button
        type="button"
        style={{
          ...resourceButtonStyle,
          borderColor: "#2563eb",
          background: "#2563eb",
        }}
        onClick={onSubmit}
      >
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
    return (
      (courseSchedules[level] || []).find(
        (lesson) => String(lesson.day) === String(day),
      ) || null
    );
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
  const assignmentKey =
    location.state?.assignmentKey ||
    entry?.assignmentId ||
    entry?.assignment_id ||
    `${level}-DAY-${day}`;
  const status =
    location.state?.status ||
    entry?.completion?.nonActionableStatus ||
    "notStarted";
  const scoreText = location.state?.scoreText || "";
  const videoResources = getLessonVideoResources(level, day, entry || {});
  const isOrientationLesson = isA1Day0Orientation(level, day);
  const resourceHubVideoResources = isOrientationLesson ? [] : videoResources;
  const primaryResource = firstLessonResource(entry || {});
  const submitLabel = primaryResource.chapter
    ? `Submit Kapitel ${primaryResource.chapter} assignment`
    : "Submit assignment";
  const canSubmit = Boolean(entry?.assignment && !isSelfLearning);

  const handleSubmitAssignment = () => {
    if (!assignmentKey || isSelfLearning) return;
    navigate(
      `/campus/submit?assignmentKey=${encodeURIComponent(assignmentKey)}&assignmentId=${encodeURIComponent(assignmentKey)}`,
      {
        state: {
          assignmentKey,
          assignmentId: assignmentKey,
          canonicalAssignmentId: assignmentKey,
          day: entry?.day || day,
          level,
          assignmentTitle: entry?.topic || "Assignment",
        },
      },
    );
  };

  if (SelfLearningComponent) {
    return <SelfLearningComponent />;
  }

  if (!entry) {
    return (
      <div style={{ ...styles.container, display: "grid", gap: 12 }}>
        <button
          type="button"
          style={{ ...styles.secondaryButton, justifySelf: "start" }}
          onClick={() => navigate("/campus/course")}
        >
          ← Course Book
        </button>
        <div style={styles.card}>
          <h1 style={{ marginTop: 0 }}>Lesson not found</h1>
          <p style={{ marginBottom: 0 }}>
            We could not find Day {day} for {level || "this level"}.
          </p>
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
      <button
        type="button"
        style={{
          ...styles.secondaryButton,
          justifySelf: "start",
          padding: "6px 10px",
          fontSize: 12,
        }}
        onClick={() => navigate("/campus/course")}
      >
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
          <div
            style={{
              display: "flex",
              gap: 7,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <span style={pillStyle}>{level}</span>
            <span style={pillStyle}>Day {entry.day ?? day}</span>
            {entry.chapter ? (
              <span style={pillStyle}>Kapitel {entry.chapter}</span>
            ) : null}
            {isSelfLearning ? (
              <span style={styles.badge}>AI self-learning</span>
            ) : (
              <span style={styles.badge}>Status: {status}</span>
            )}
            {scoreText ? <span style={styles.badge}>{scoreText}</span> : null}
          </div>
          <div style={{ display: "grid", gap: 5 }}>
            <h1
              style={{
                margin: 0,
                color: palette.ink,
                fontSize: 24,
                lineHeight: 1.12,
              }}
            >
              {entry.topic || `Day ${entry.day ?? day}`}
            </h1>
            {entry.grammar_topic ? (
              <p style={{ ...styles.helperText, margin: 0, lineHeight: 1.4 }}>
                Grammar topic: {entry.grammar_topic}
              </p>
            ) : null}
            {entry.goal ? (
              <p
                style={{
                  margin: 0,
                  color: palette.muted,
                  lineHeight: 1.45,
                  fontSize: 14,
                }}
              >
                {entry.goal}
              </p>
            ) : null}
          </div>
          {isSelfLearning ? (
            <div
              style={{
                border: "1px solid #bfdbfe",
                background: "#eff6ff",
                borderRadius: 12,
                padding: 10,
                fontSize: 13,
                lineHeight: 1.45,
              }}
            >
              <strong>No tutor submission.</strong> This level is self-learning.
              Practise with Falowen AI, use the feedback, enter your score and
              self-mark your progress.
            </div>
          ) : null}
        </header>

        {isOrientationLesson ? <OrientationAiVideoHero /> : null}

        {entry.instruction ? (
          <section
            style={{
              ...styles.card,
              background: "#fffaf3",
              border: `1px solid ${palette.border}`,
              display: "grid",
              gap: 6,
              padding: 12,
              marginBottom: 0,
            }}
          >
            <h2 style={{ margin: 0, fontSize: 18, color: palette.ink }}>
              Lesson instructions
            </h2>
            <p
              style={{
                margin: 0,
                lineHeight: 1.55,
                whiteSpace: "pre-line",
                color: palette.muted,
                fontSize: 14,
              }}
            >
              {entry.instruction}
            </p>
          </section>
        ) : null}

        <LessonResourcesHub
          entry={entry}
          videoResources={resourceHubVideoResources}
          level={level}
          day={day}
        />
        <SubmitAssignmentCard
          canSubmit={canSubmit}
          submitLabel={submitLabel}
          onSubmit={handleSubmitAssignment}
        />

        <TextBlock title="Schreiben">{entry.schreiben}</TextBlock>
        <TextBlock title="Sprechen">{entry.sprechen}</TextBlock>
        <TextBlock title="Zusatzmaterial">{entry.zusatzmaterial}</TextBlock>
      </article>
    </div>
  );
};

export default CourseLessonPage;
