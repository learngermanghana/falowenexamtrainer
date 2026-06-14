import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
import FalowenRadioTabContent from "./FalowenRadioTabContent";
import { styles } from "../styles";

const toArray = (value) => Array.isArray(value) ? value : value ? [value] : [];
const isInternalLink = (url = "") => String(url || "").startsWith("/");
const getExternalProps = (url = "") =>
  isInternalLink(url) ? {} : { target: "_blank", rel: "noreferrer" };

const firstWorkbookUrl = (canonicalLesson = {}) => {
  const groups = canonicalLesson?.resources?.resourceGroups || [];
  const fromGroups = groups.find((group) => group?.workbook?.url)?.workbook?.url;
  return fromGroups || canonicalLesson?.resources?.workbook?.url || "";
};

const B1ResourceCard = ({ icon, title, description, url }) => {
  if (!url) return null;
  return (
    <article
      style={{
        border: "1px solid #eadfd0",
        borderRadius: 14,
        background: "#fffaf3",
        padding: 13,
        display: "grid",
        gap: 8,
      }}
    >
      <strong>{icon} {title}</strong>
      <p style={{ margin: 0, color: "#6f6a80", lineHeight: 1.5 }}>
        {description}
      </p>
      <a
        href={url}
        {...getExternalProps(url)}
        style={{ ...styles.linkButton, width: "fit-content" }}
      >
        Open
      </a>
    </article>
  );
};

const B1TutorResources = ({ canonicalLesson }) => {
  const groups = canonicalLesson?.resources?.resourceGroups || [];
  const videos = canonicalLesson?.resources?.videos || [];

  return (
    <section
      style={{
        ...styles.card,
        display: "grid",
        gap: 12,
        border: "1px solid #fed7aa",
        background: "#fffaf3",
      }}
    >
      <div>
        <h2 style={{ margin: 0 }}>Lesson resources</h2>
        <p style={{ margin: "5px 0 0", color: "#6f6a80" }}>
          Use the video and grammar notes, then open the original tutor-marked workbook.
        </p>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {groups.map((group, index) => (
          <React.Fragment key={`${group.chapter || index}-${group.workbook?.url || ""}`}>
            {group.chapter ? <strong>Kapitel {group.chapter}</strong> : null}
            <B1ResourceCard
              icon="📘"
              title="Grammar notes"
              description="Review the grammar explanations and examples."
              url={group.grammarBook?.url}
            />
            <B1ResourceCard
              icon="📝"
              title="Tutor-marked workbook"
              description="Complete Teil 1, Teil 2, Teil 3 and Teil 4, then submit your work normally."
              url={group.workbook?.url}
            />
          </React.Fragment>
        ))}

        {videos.map((video) => (
          <B1ResourceCard
            key={video.url}
            icon="🎬"
            title={video.title || "Lesson video"}
            description={video.description || "Watch this lesson video before completing the workbook."}
            url={video.url}
          />
        ))}
      </div>
    </section>
  );
};

export const shouldShowB1RadioEntrance = (canonicalLesson = {}) =>
  Boolean(canonicalLesson?.resources?.falowenRadio);

export default function B1TutorLessonPage({ canonicalLesson }) {
  const navigate = useNavigate();
  const raw = canonicalLesson?.raw || {};
  const level = "B1";
  const day = Number(canonicalLesson?.day || raw.day || raw.assignmentDay || 0);
  const radio = canonicalLesson?.resources?.falowenRadio || null;
  const workbookUrl = useMemo(
    () => firstWorkbookUrl(canonicalLesson),
    [canonicalLesson],
  );
  const [hasPassedRadio, setHasPassedRadio] = useState(
    () => !shouldShowB1RadioEntrance(canonicalLesson),
  );

  const openWorkbook = () => {
    if (!workbookUrl) {
      setHasPassedRadio(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (String(workbookUrl).startsWith("/")) {
      navigate(workbookUrl);
      return;
    }

    window.location.assign(workbookUrl);
  };

  if (!hasPassedRadio && radio) {
    return (
      <div style={{ ...styles.container, display: "grid", gap: 18, maxWidth: 900 }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <header
          style={{
            ...styles.card,
            display: "grid",
            gap: 10,
            border: "1px solid #bfdbfe",
            borderRadius: 20,
            background: "linear-gradient(135deg, #eff6ff, #f8fafc)",
          }}
        >
          <span
            style={{
              ...styles.badge,
              width: "fit-content",
              background: "#dbeafe",
              color: "#1e3a8a",
            }}
          >
            Start with Falowen Radio
          </span>
          <h1 style={{ margin: 0 }}>
            B1 · Day {day} · {canonicalLesson?.topic || raw.topic || `Lesson ${day}`}
          </h1>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>
            Listen first. Continue opens the existing tutor-marked workbook with Teil 1, Teil 2, Teil 3 and Teil 4. Your normal assignment submission remains unchanged.
          </p>
        </header>

        <FalowenRadioTabContent
          level={level}
          day={day}
          resource={radio}
          onContinue={openWorkbook}
        />
      </div>
    );
  }

  const assignmentId = canonicalLesson?.submission?.assignmentId;
  const canSubmit = Boolean(canonicalLesson?.submission?.enabled && assignmentId);
  const nested = [
    ...toArray(raw.schreiben_sprechen),
    ...toArray(raw.lesen_hören),
  ].filter(Boolean);
  const primary = nested[0] || raw;

  const submitAssignment = () => {
    if (!assignmentId) return;
    navigate(
      `/campus/submit?assignmentKey=${encodeURIComponent(assignmentId)}&assignmentId=${encodeURIComponent(assignmentId)}`,
      {
        state: {
          assignmentKey: assignmentId,
          assignmentId,
          canonicalAssignmentId: assignmentId,
          day,
          level,
          assignmentTitle: canonicalLesson?.topic || raw.topic || "B1 assignment",
        },
      },
    );
  };

  return (
    <div style={{ ...styles.container, display: "grid", gap: 14, maxWidth: 900 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

      <header
        style={{
          ...styles.card,
          display: "grid",
          gap: 8,
          borderRadius: 16,
          border: "1px solid #e5e7eb",
          background: "#fffaf3",
        }}
      >
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={styles.badge}>B1</span>
          <span style={styles.badge}>Day {day}</span>
          {canonicalLesson?.chapter || primary.chapter ? (
            <span style={styles.badge}>
              Kapitel {canonicalLesson?.chapter || primary.chapter}
            </span>
          ) : null}
          <span style={{ ...styles.badge, background: "#dbeafe", color: "#1e3a8a" }}>
            Tutor marked
          </span>
        </div>
        <h1 style={{ margin: 0 }}>
          {canonicalLesson?.topic || raw.topic || `B1 Day ${day}`}
        </h1>
        {raw.goal ? <p style={{ margin: 0, color: "#64748b" }}>{raw.goal}</p> : null}
        {raw.instruction ? (
          <p style={{ margin: 0, color: "#475569", whiteSpace: "pre-line", lineHeight: 1.6 }}>
            {raw.instruction}
          </p>
        ) : null}
      </header>

      <B1TutorResources canonicalLesson={canonicalLesson} />

      {canSubmit ? (
        <section
          style={{
            ...styles.card,
            display: "grid",
            gap: 8,
            border: "1px solid #bfdbfe",
            background: "#eff6ff",
          }}
        >
          <strong>Finished the tutor-marked workbook?</strong>
          <p style={{ margin: 0, color: "#475569" }}>
            Submit your final answers through the normal B1 assignment area.
          </p>
          <button
            type="button"
            style={{ ...styles.primaryButton, width: "fit-content" }}
            onClick={submitAssignment}
          >
            Submit assignment
          </button>
        </section>
      ) : null}
    </div>
  );
}
