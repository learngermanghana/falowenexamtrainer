import React, { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { styles } from "../styles";
import { courseSchedules, getCourseScheduleDictionaryEntry } from "../data/courseSchedule";
import { resolveAssignmentCanonicalKey } from "../utils/assignmentIdentity";
import { RESOURCE_ACTION_LABELS } from "./ResourceLinkRow";

const toLessonArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const normalizeLevel = (level = "") => String(level || "").trim().toUpperCase();

const isInternalLink = (url = "") => String(url || "").startsWith("/");

const resolveLessonAssignmentKey = ({ lesson = {}, entry = {}, level = "" }) => {
  const normalizedLevel = normalizeLevel(level);
  const dictionaryMatch = getCourseScheduleDictionaryEntry({
    level: normalizedLevel,
    assignmentId: lesson.assignmentId || lesson.assignment_id || entry.assignmentId || entry.assignment_id,
    chapter: lesson.chapter || entry.chapter,
    mode: lesson.type || lesson.mode,
    assignmentDay: entry.day,
  });

  if (dictionaryMatch?.assignment_id) return dictionaryMatch.assignment_id;

  return (
    resolveAssignmentCanonicalKey({
      level: normalizedLevel,
      assignmentId: lesson.assignmentId || lesson.assignment_id || lesson.chapter || entry.assignmentId || entry.assignment_id,
      assignmentTitle: lesson.title || lesson.topic || lesson.chapter || entry.topic || `Day ${entry.day}`,
    }) || ""
  );
};

const resolveEntryAssignmentKey = ({ entry = {}, level = "", fallbackAssignmentKey = "" }) => {
  const normalizedLevel = normalizeLevel(level);
  const dictionaryMatch = getCourseScheduleDictionaryEntry({
    level: normalizedLevel,
    assignmentId: entry.assignmentId || entry.assignment_id || fallbackAssignmentKey,
    chapter: entry.chapter,
    assignmentDay: entry.day,
  });

  if (dictionaryMatch?.assignment_id) return dictionaryMatch.assignment_id;

  return (
    resolveAssignmentCanonicalKey({
      level: normalizedLevel,
      assignmentId: entry.assignmentId || entry.assignment_id || fallbackAssignmentKey || entry.chapter,
      assignmentTitle: entry.topic || entry.chapter || `Day ${entry.day}`,
    }) || fallbackAssignmentKey || ""
  );
};

const buildLessonAssignmentTargets = ({ entry = {}, level = "", fallbackAssignmentKey = "" }) => {
  if (!entry) return [];

  const rawTargets = [
    ...toLessonArray(entry.lesen_hören).map((lesson) => ({ lesson, groupTitle: "Lesen & Hören" })),
    ...toLessonArray(entry.schreiben_sprechen).map((lesson) => ({ lesson, groupTitle: "Schreiben & Sprechen" })),
  ]
    .filter(({ lesson }) => lesson?.assignment)
    .map(({ lesson, groupTitle }) => {
      const assignmentKey = resolveLessonAssignmentKey({ lesson, entry, level });
      const chapter = lesson.chapter || entry.chapter || "";
      return {
        source: "lesson",
        assignmentKey,
        chapter,
        day: entry.day,
        label: chapter ? `${groupTitle} · Kapitel ${chapter}` : groupTitle,
        title: lesson.title || lesson.topic || entry.topic || "Assignment",
        lesson,
      };
    })
    .filter((target) => target.assignmentKey);

  const seen = new Set();
  const uniqueTargets = rawTargets.filter((target) => {
    const key = `${target.assignmentKey}::${target.label}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (uniqueTargets.length) return uniqueTargets;

  if (entry.assignment || entry.assignmentId || entry.assignment_id || fallbackAssignmentKey) {
    const assignmentKey = resolveEntryAssignmentKey({ entry, level, fallbackAssignmentKey });
    if (assignmentKey) {
      return [
        {
          source: "entry",
          assignmentKey,
          chapter: entry.chapter || "",
          day: entry.day,
          label: entry.topic || `Day ${entry.day}`,
          title: entry.topic || "Assignment",
          lesson: null,
        },
      ];
    }
  }

  return [];
};

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

const LessonResourceList = ({ title, lessons, entry, level, onSubmitAssignment }) => {
  const rows = toLessonArray(lessons).filter(Boolean);
  if (!rows.length) return null;

  return (
    <section style={{ display: "grid", gap: 10 }}>
      <h2 style={{ margin: 0, fontSize: 20 }}>{title}</h2>
      <div style={{ display: "grid", gap: 10 }}>
        {rows.map((lesson, index) => {
          const assignmentKey = lesson.assignment ? resolveLessonAssignmentKey({ lesson, entry, level }) : "";
          const target = assignmentKey
            ? {
                source: "lesson",
                assignmentKey,
                chapter: lesson.chapter || entry?.chapter || "",
                day: entry?.day,
                label: lesson.chapter ? `${title} · Kapitel ${lesson.chapter}` : title,
                title: lesson.title || lesson.topic || entry?.topic || "Assignment",
                lesson,
              }
            : null;

          return (
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
              {target ? (
                <button
                  type="button"
                  style={{ ...styles.primaryButton, justifySelf: "start" }}
                  onClick={() => onSubmitAssignment(target)}
                >
                  Submit {lesson.chapter ? `Kapitel ${lesson.chapter}` : "this"} assignment
                </button>
              ) : null}
            </article>
          );
        })}
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
  const assignmentTargets = useMemo(
    () => buildLessonAssignmentTargets({ entry, level, fallbackAssignmentKey: assignmentKey }),
    [assignmentKey, entry, level]
  );
  const lessonAssignmentCount = assignmentTargets.filter((target) => target.source === "lesson").length;

  const handleSubmitAssignment = (target = assignmentTargets[0]) => {
    const selectedAssignmentKey = target?.assignmentKey || assignmentKey;
    if (!selectedAssignmentKey) return;

    navigate(`/campus/submit?assignmentKey=${encodeURIComponent(selectedAssignmentKey)}&assignmentId=${encodeURIComponent(selectedAssignmentKey)}`, {
      state: {
        assignmentKey: selectedAssignmentKey,
        assignmentId: selectedAssignmentKey,
        canonicalAssignmentId: selectedAssignmentKey,
        day: target?.day || entry?.day || day,
        occurrence: entry?.occurrence,
        level,
        chapter: target?.chapter || entry?.chapter || "",
        assignmentTitle: target?.title || entry?.topic || "Assignment",
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
            {lessonAssignmentCount > 1 ? <span style={styles.badge}>{lessonAssignmentCount} assignments</span> : null}
          </div>
          <h1 style={{ margin: 0 }}>{entry.topic || `Day ${entry.day ?? day}`}</h1>
          {entry.chapter ? <p style={{ ...styles.helperText, margin: 0 }}>Chapter: {entry.chapter}</p> : null}
          {entry.grammar_topic ? <p style={{ ...styles.helperText, margin: 0 }}>Grammar topic: {entry.grammar_topic}</p> : null}
          {entry.goal ? <p style={{ margin: 0 }}>{entry.goal}</p> : null}
          {lessonAssignmentCount > 1 ? (
            <div style={{ ...styles.helperText, margin: 0 }}>
              This lesson has {lessonAssignmentCount} marked assignments. Submit each assignment from its own resource card below.
            </div>
          ) : lessonAssignmentCount === 0 && assignmentTargets[0] ? (
            <button type="button" style={{ ...styles.primaryButton, justifySelf: "start" }} onClick={() => handleSubmitAssignment(assignmentTargets[0])}>
              Submit this assignment
            </button>
          ) : null}
        </header>

        <InstructionSection instruction={entry.instruction} />

        <LessonResourceList title="Lesen & Hören" lessons={entry.lesen_hören} entry={entry} level={level} onSubmitAssignment={handleSubmitAssignment} />
        <LessonResourceList title="Schreiben & Sprechen" lessons={entry.schreiben_sprechen} entry={entry} level={level} onSubmitAssignment={handleSubmitAssignment} />

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
