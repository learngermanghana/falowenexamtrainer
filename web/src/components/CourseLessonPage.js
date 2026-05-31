import React, { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { styles } from "../styles";
import { courseSchedules } from "../data/courseSchedule";
import { RESOURCE_ACTION_LABELS } from "./ResourceLinkRow";

const toLessonArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const normalizeLevel = (level = "") => String(level || "").trim().toUpperCase();

const isInternalLink = (url = "") => String(url || "").startsWith("/");

const renderInlineMarkdown = (text, keyPrefix) => {
  if (!text) return null;

  const tokenRegex = /(\*\*([^*]+)\*\*)|(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\))|(https?:\/\/[^\s]+)/g;
  const nodes = [];
  let lastIndex = 0;
  let match;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(<React.Fragment key={`${keyPrefix}-txt-${lastIndex}`}>{text.slice(lastIndex, match.index)}</React.Fragment>);
    }

    if (match[2]) {
      nodes.push(<strong key={`${keyPrefix}-bold-${match.index}`}>{match[2]}</strong>);
    } else if (match[4] && match[5]) {
      nodes.push(
        <a key={`${keyPrefix}-mdlink-${match.index}`} href={match[5]} target="_blank" rel="noreferrer">
          {match[4]}
        </a>
      );
    } else if (match[6]) {
      nodes.push(
        <a key={`${keyPrefix}-link-${match.index}`} href={match[6]} target="_blank" rel="noreferrer">
          {match[6]}
        </a>
      );
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(<React.Fragment key={`${keyPrefix}-txt-end`}>{text.slice(lastIndex)}</React.Fragment>);
  }

  return nodes;
};

const renderInstructionBlocks = (instruction = "") => {
  const lines = String(instruction)
    .split(/\n/)
    .map((line) => line.trimEnd());

  const blocks = [];
  let paragraphLines = [];
  let listItems = [];
  let listType = null;

  const flushParagraph = () => {
    if (!paragraphLines.length) return;
    blocks.push({ type: "paragraph", lines: paragraphLines });
    paragraphLines = [];
  };

  const flushList = () => {
    if (!listItems.length) return;
    blocks.push({ type: listType, items: listItems });
    listItems = [];
    listType = null;
  };

  lines.forEach((line) => {
    const ordered = line.match(/^\d+\.\s+(.*)$/);
    const unordered = line.match(/^[-*]\s+(.*)$/);

    if (!line.trim()) {
      flushParagraph();
      flushList();
      return;
    }

    if (ordered) {
      flushParagraph();
      if (listType && listType !== "ordered") flushList();
      listType = "ordered";
      listItems.push(ordered[1]);
      return;
    }

    if (unordered) {
      flushParagraph();
      if (listType && listType !== "unordered") flushList();
      listType = "unordered";
      listItems.push(unordered[1]);
      return;
    }

    flushList();
    paragraphLines.push(line);
  });

  flushParagraph();
  flushList();

  return blocks;
};

const ResourceAnchor = ({ label, url }) => {
  if (!url) return null;

  const externalProps = isInternalLink(url) ? {} : { target: "_blank", rel: "noreferrer" };

  return (
    <li>
      <a href={url} {...externalProps}>
        {label}
      </a>
    </li>
  );
};

const LessonResourceList = ({ title, lessons }) => {
  const rows = toLessonArray(lessons).filter(Boolean);
  if (!rows.length) return null;

  return (
    <section style={{ display: "grid", gap: 10 }}>
      <h2 style={{ margin: 0, fontSize: 20 }}>{title}</h2>
      <div style={{ display: "grid", gap: 10 }}>
        {rows.map((lesson, index) => (
          <article
            key={`${title}-${lesson.chapter || lesson.title || index}-${index}`}
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
              {lesson.assignment ? <span style={styles.badge}>Assignment</span> : null}
            </div>
            {lesson.title && lesson.chapter ? <p style={{ ...styles.helperText, margin: 0 }}>{lesson.title}</p> : null}
            {lesson.note ? <p style={{ margin: 0 }}>{lesson.note}</p> : null}
            <ul style={{ ...styles.checklist, margin: 0 }}>
              <ResourceAnchor label={RESOURCE_ACTION_LABELS.video} url={lesson.video || lesson.youtube_link} />
              <ResourceAnchor label={RESOURCE_ACTION_LABELS.grammarbook} url={lesson.grammarbook_link} />
              <ResourceAnchor label={RESOURCE_ACTION_LABELS.workbook} url={lesson.workbook_link} />
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
};

const InstructionSection = ({ instruction }) => {
  if (!instruction) return null;

  return (
    <section style={{ display: "grid", gap: 10 }}>
      <h2 style={{ margin: 0, fontSize: 20 }}>Lesson instructions</h2>
      <div style={{ display: "grid", gap: 8 }}>
        {renderInstructionBlocks(instruction).map((block, index) => {
          if (block.type === "ordered") {
            return (
              <ol key={`instruction-ol-${index}`} style={{ margin: 0, paddingLeft: 22 }}>
                {block.items.map((item, itemIndex) => (
                  <li key={`instruction-ol-${index}-${itemIndex}`}>{renderInlineMarkdown(item, `instruction-ol-${index}-${itemIndex}`)}</li>
                ))}
              </ol>
            );
          }

          if (block.type === "unordered") {
            return (
              <ul key={`instruction-ul-${index}`} style={{ margin: 0, paddingLeft: 22 }}>
                {block.items.map((item, itemIndex) => (
                  <li key={`instruction-ul-${index}-${itemIndex}`}>{renderInlineMarkdown(item, `instruction-ul-${index}-${itemIndex}`)}</li>
                ))}
              </ul>
            );
          }

          return (
            <p key={`instruction-p-${index}`} style={{ margin: 0 }}>
              {block.lines.map((line, lineIndex) => (
                <React.Fragment key={`instruction-p-${index}-${lineIndex}`}>
                  {lineIndex ? <br /> : null}
                  {renderInlineMarkdown(line, `instruction-p-${index}-${lineIndex}`)}
                </React.Fragment>
              ))}
            </p>
          );
        })}
      </div>
    </section>
  );
};

const TextSection = ({ title, text }) => {
  if (!text) return null;

  return (
    <section style={{ display: "grid", gap: 8 }}>
      <h2 style={{ margin: 0, fontSize: 20 }}>{title}</h2>
      <p style={{ margin: 0 }}>{text}</p>
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

  const assignmentKey = location.state?.assignmentKey || entry?.assignmentId || entry?.assignment_id || "";
  const status = location.state?.status || entry?.completion?.nonActionableStatus || "notStarted";
  const scoreText = location.state?.scoreText || "";

  const handleSubmitAssignment = () => {
    if (!assignmentKey) return;

    navigate(`/campus/submit?assignmentKey=${encodeURIComponent(assignmentKey)}&assignmentId=${encodeURIComponent(assignmentKey)}`, {
      state: {
        assignmentKey,
        assignmentId: assignmentKey || entry?.assignmentId || null,
        canonicalAssignmentId: assignmentKey || entry?.assignmentId || null,
        day: entry?.day || day,
        occurrence: entry?.occurrence,
        level,
      },
    });
  };

  if (!entry) {
    return (
      <div style={{ ...styles.container, display: "grid", gap: 16 }}>
        <button type="button" style={{ ...styles.secondaryButton, justifySelf: "start" }} onClick={() => navigate("/campus/course")}>
          ← Back to Course Book
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
        ← Back to Course Book
      </button>

      <article style={{ ...styles.card, display: "grid", gap: 18 }}>
        <header style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={styles.levelPill}>{level}</span>
            <span style={styles.levelPill}>Day {entry.day ?? day}</span>
            {status ? <span style={styles.badge}>Status: {status}</span> : null}
            {scoreText ? <span style={styles.badge}>{scoreText}</span> : null}
          </div>
          <h1 style={{ margin: 0 }}>{entry.topic || `Day ${entry.day ?? day}`}</h1>
          {entry.chapter ? <p style={{ ...styles.helperText, margin: 0 }}>Chapter: {entry.chapter}</p> : null}
          {entry.grammar_topic ? <p style={{ ...styles.helperText, margin: 0 }}>Grammar topic: {entry.grammar_topic}</p> : null}
          {entry.goal ? <p style={{ margin: 0 }}>{entry.goal}</p> : null}
          {assignmentKey ? (
            <button type="button" style={{ ...styles.primaryButton, justifySelf: "start" }} onClick={handleSubmitAssignment}>
              Submit this assignment
            </button>
          ) : null}
        </header>

        <InstructionSection instruction={entry.instruction} />

        <LessonResourceList title="Lesen & Hören" lessons={entry.lesen_hören} />
        <LessonResourceList title="Schreiben & Sprechen" lessons={entry.schreiben_sprechen} />

        <ul style={{ ...styles.checklist, margin: 0 }}>
          <ResourceAnchor label={RESOURCE_ACTION_LABELS.video} url={entry.video || entry.youtube_link || entry.tutorial_video_url} />
          <ResourceAnchor label={RESOURCE_ACTION_LABELS.grammarbook} url={entry.grammarbook_link} />
          <ResourceAnchor label={RESOURCE_ACTION_LABELS.workbook} url={entry.workbook_link} />
        </ul>

        <TextSection title="Schreiben" text={entry.schreiben} />
        <TextSection title="Sprechen" text={entry.sprechen} />
        <TextSection title="Zusatzmaterial" text={entry.zusatzmaterial} />
      </article>
    </div>
  );
};

export default CourseLessonPage;
