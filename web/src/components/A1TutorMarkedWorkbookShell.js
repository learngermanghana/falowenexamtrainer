import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
import VerifiedCloudDraftSubmissionPage from "./VerifiedCloudDraftSubmissionPage";
import AssignmentSubmissionDebugPanel from "./AssignmentSubmissionDebugPanel";
import { getInlineCourseAssignments } from "../utils/courseLessonAssignments";
import { styles } from "../styles";

export const A1_TUTOR_MARKED_ASSIGNMENT_CHAPTERS = [
  "0.1",
  "0.2",
  "1.1",
  "1.2",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12.1",
  "12.2",
  "12.3",
  "13",
  "14.1",
];

const shellCard = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const tabButtonBase = {
  ...styles.secondaryButton,
  fontWeight: 800,
  minWidth: 120,
};

const buildSubmitClassName = (level, day, chapter) =>
  `a1-tutor-marked-submit-${String(level || "a1").toLowerCase()}-${String(day || "day").replace(/[^a-z0-9]/gi, "-")}-${String(
    chapter || "chapter"
  ).replace(/[^a-z0-9]/gi, "-")}`;

const normalizeFallbackAssignmentKey = (level, value) => {
  const normalizedLevel = String(level || "A1").trim().toUpperCase();
  const raw = String(value || "").trim();
  if (!raw) return "";
  return new RegExp(`^${normalizedLevel}-`, "i").test(raw) ? raw.toUpperCase() : `${normalizedLevel}-${raw}`;
};

const A1TutorMarkedWorkbookShell = ({
  level = "A1",
  day,
  chapter,
  fallbackAssignmentKey,
  title,
  subtitle,
  assignmentIntro,
  submitTitle,
  submitDescription,
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const submitRootRef = useRef(null);
  const normalizedLevel = String(level || "A1").toUpperCase();
  const searchParams = useMemo(() => new URLSearchParams(location.search || ""), [location.search]);
  const requestedTab = searchParams.get("workbookTab");
  const [activeTab, setActiveTab] = useState(requestedTab === "submit" ? "submit" : "assignment");

  const assignmentKey = useMemo(() => {
    const assignment = getInlineCourseAssignments(normalizedLevel, day).find(
      (item) => String(item.chapter || "").trim() === String(chapter || "").trim()
    );
    return (
      assignment?.assignmentKey ||
      normalizeFallbackAssignmentKey(normalizedLevel, fallbackAssignmentKey) ||
      normalizeFallbackAssignmentKey(normalizedLevel, chapter || day)
    );
  }, [chapter, day, fallbackAssignmentKey, normalizedLevel]);

  const submissionContextReady =
    searchParams.get("assignmentKey") === assignmentKey &&
    searchParams.get("assignmentId") === assignmentKey &&
    searchParams.get("level") === normalizedLevel;
  const submitDebugEnabled = searchParams.get("submitDebug") === "1";

  useEffect(() => {
    setActiveTab(requestedTab === "submit" ? "submit" : "assignment");
  }, [requestedTab]);

  useEffect(() => {
    if (requestedTab !== "submit") return;
    if (submissionContextReady) return;

    const nextSearch = new URLSearchParams(location.search || "");
    nextSearch.set("workbookTab", "submit");
    nextSearch.set("assignmentKey", assignmentKey);
    nextSearch.set("assignmentId", assignmentKey);
    nextSearch.set("level", normalizedLevel);

    navigate(
      {
        pathname: location.pathname,
        search: `?${nextSearch.toString()}`,
      },
      {
        replace: true,
        state: {
          ...(location.state || {}),
          level: normalizedLevel,
          day,
          assignmentKey,
          assignmentId: assignmentKey,
          canonicalAssignmentKey: assignmentKey,
          inlineCourseSubmission: true,
        },
      }
    );
  }, [
    assignmentKey,
    day,
    location.pathname,
    location.search,
    location.state,
    navigate,
    normalizedLevel,
    requestedTab,
    submissionContextReady,
  ]);

  const openTab = (tabKey) => {
    setActiveTab(tabKey);
    const nextSearch = new URLSearchParams(location.search || "");
    nextSearch.set("workbookTab", tabKey);
    nextSearch.set("assignmentKey", assignmentKey);
    nextSearch.set("assignmentId", assignmentKey);
    nextSearch.set("level", normalizedLevel);

    navigate(
      {
        pathname: location.pathname,
        search: `?${nextSearch.toString()}`,
      },
      {
        replace: true,
        state: {
          ...(location.state || {}),
          level: normalizedLevel,
          day,
          assignmentKey,
          assignmentId: assignmentKey,
          canonicalAssignmentKey: assignmentKey,
          inlineCourseSubmission: true,
        },
      }
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitClassName = buildSubmitClassName(normalizedLevel, day, chapter);

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={shellCard}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <h1 style={{ ...styles.title, marginBottom: 0 }}>{title}</h1>
        {subtitle ? <p style={{ ...styles.subtitle, margin: 0 }}>{subtitle}</p> : null}
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          {assignmentIntro || `Complete the assignment, then open Submit to send your final answers for ${assignmentKey}.`}
        </p>

        <div
          role="tablist"
          aria-label={`${title} workbook tabs`}
          style={{ display: "flex", gap: 8, flexWrap: "wrap", borderTop: "1px solid #dbeafe", paddingTop: 12 }}
        >
          {[
            { key: "assignment", label: "Assignment" },
            { key: "submit", label: "Submit" },
          ].map((tab) => {
            const selected = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => openTab(tab.key)}
                style={{
                  ...tabButtonBase,
                  background: selected ? "#2563eb" : "#ffffff",
                  borderColor: selected ? "#2563eb" : "#93c5fd",
                  color: selected ? "#ffffff" : "#1d4ed8",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === "assignment" ? (
        <>
          {children}
          <div style={{ ...shellCard, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
            <p style={{ margin: 0, fontWeight: 700 }}>
              Finished the assignment? Open Submit and send your final answers for tutor marking.
            </p>
            <button type="button" style={{ ...styles.button, width: "fit-content" }} onClick={() => openTab("submit")}>
              Open Submit Tab
            </button>
          </div>
        </>
      ) : (
        <section style={{ ...shellCard, border: "1px solid #bfdbfe" }} aria-label={`Submit ${title} answers`}>
          <div>
            <p
              style={{
                color: "#1d4ed8",
                fontSize: 13,
                fontWeight: 900,
                letterSpacing: ".04em",
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              Tutor-marked assignment
            </p>
            <h2 style={{ margin: "4px 0" }}>{submitTitle || `Submit ${normalizedLevel} · Day ${day} · Chapter ${chapter}`}</h2>
            <p style={{ color: "#475569", margin: 0 }}>
              {submitDescription || `This submission box is locked to ${assignmentKey}, so your work is saved under the correct assignment.`}
            </p>
          </div>
          <div ref={submitRootRef} className={submitClassName} data-a1-built-in-submission>
            <style>{`
              .${submitClassName} > div > section:first-child { display: none !important; }
              .${submitClassName} textarea {
                background: #ffffff !important;
                color: #111827 !important;
                -webkit-text-fill-color: #111827 !important;
                caret-color: #111827 !important;
                opacity: 1 !important;
                visibility: visible !important;
                font-size: 16px !important;
                line-height: 1.7 !important;
                pointer-events: auto !important;
                touch-action: manipulation !important;
                -webkit-user-select: text !important;
                user-select: text !important;
                position: relative !important;
                z-index: 1 !important;
              }
              .${submitClassName} textarea::placeholder {
                color: #6b7280 !important;
                -webkit-text-fill-color: #6b7280 !important;
                opacity: 1 !important;
              }
            `}</style>
            {submitDebugEnabled ? (
              <AssignmentSubmissionDebugPanel
                rootRef={submitRootRef}
                assignmentKey={assignmentKey}
                level={normalizedLevel}
                day={day}
                contextReady={submissionContextReady}
              />
            ) : null}
            {submissionContextReady ? (
              <VerifiedCloudDraftSubmissionPage
                submissionContext={{
                  level: normalizedLevel,
                  day,
                  chapter,
                  assignmentKey,
                  canonicalAssignmentKey: assignmentKey,
                }}
              />
            ) : (
              <p role="status" style={{ color: "#475569", margin: 8 }}>
                Preparing the correct assignment submission…
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default A1TutorMarkedWorkbookShell;
