import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles";
import {
  fetchMyClassParticipation,
  summarizeClassParticipation,
} from "../services/classParticipationService";
import { PillBadge, SectionHeader } from "./ui";

const formatLessonLabel = (record = {}) => {
  const day = String(record.lessonDay || record.assignmentId || "Lesson").trim();
  const title = String(record.lessonTitle || "").trim();
  return title && !day.toLowerCase().includes(title.toLowerCase()) ? `${day} · ${title}` : day;
};

const formatParticipationDate = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const [year, month, day] = raw.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (Number.isNaN(parsed.getTime())) return raw;
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(parsed);
};

const latestDetail = (record = {}) => {
  const turns = Number(record.turns || 0);
  if (turns <= 0) return "No response recorded";
  const correct = Number(record.correct || 0);
  const needsReview = Number(record.needsReview || 0);
  const responseLabel = `${turns} response${turns === 1 ? "" : "s"}`;
  return `${responseLabel} · ${correct} correct · ${needsReview} to review`;
};

const nextClassGoal = (record = {}) => {
  if (Number(record.turns || 0) <= 0) {
    return "Answer at least one question or attempt one class activity.";
  }
  const reviewConcept = String(record.reviewConcepts?.[0] || record.focusConcept || "").trim();
  if (reviewConcept) return `Contribute at least once, especially when ${reviewConcept} comes up.`;
  return "Contribute at least once again in your next class.";
};

const recordElementId = (record = {}) => `participation-session-${encodeURIComponent(
  record.classSessionId || record.sessionId || record.id || record.assignmentId || "record"
)}`;

const recordMatchesRequest = (record = {}, requestedClassSessionId = "", requestedSessionId = "") => Boolean(
  (requestedClassSessionId && record.classSessionId === requestedClassSessionId)
  || (requestedSessionId && record.sessionId === requestedSessionId)
);

const statStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  padding: "11px 12px",
  background: "#f8fafc",
  display: "grid",
  gap: 3,
  minWidth: 0,
};

const buildOverallSummary = (records = []) => {
  const normalized = Array.isArray(records) ? records : [];
  const classesRecorded = normalized.length;
  const participated = normalized.filter((record) => Number(record.turns || 0) > 0).length;
  const responses = normalized.reduce((sum, record) => sum + Number(record.turns || 0), 0);
  const correct = normalized.reduce((sum, record) => sum + Number(record.correct || 0), 0);
  const needsReview = normalized.reduce((sum, record) => sum + Number(record.needsReview || 0), 0);
  const skipped = normalized.reduce((sum, record) => sum + Number(record.skipped || 0), 0);
  const scoredResponses = correct + needsReview;
  const accuracy = scoredResponses > 0 ? Math.round((correct / scoredResponses) * 100) : null;

  return {
    classesRecorded,
    participated,
    responses,
    correct,
    needsReview,
    skipped,
    accuracy,
  };
};

const Stat = ({ label, value }) => (
  <div style={statStyle}>
    <span style={{ ...styles.helperText, fontSize: 12 }}>{label}</span>
    <strong style={{ fontSize: 21 }}>{value}</strong>
  </div>
);

const QuestionHistory = ({ record, open = false }) => {
  const questions = Array.isArray(record.questionResponses) ? record.questionResponses : [];
  if (questions.length === 0) return null;

  return (
    <details style={{ marginTop: 8 }} open={open || undefined}>
      <summary style={{ cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#1d4ed8" }}>
        Review {questions.length} recorded question{questions.length === 1 ? "" : "s"}
      </summary>
      <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
        {questions.map((question, index) => {
          const isCorrect = question.result === "correct";
          return (
            <div
              key={question.questionId || `${record.id || record.sessionId || "record"}-${index}`}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 10,
                background: "#f8fafc",
                padding: "9px 10px",
                display: "grid",
                gap: 4,
              }}
            >
              <span style={{ fontSize: 13, lineHeight: 1.4 }}>{question.question}</span>
              {question.conceptLabel ? (
                <span style={{ ...styles.helperText, fontSize: 12 }}>Topic: {question.conceptLabel}</span>
              ) : null}
              {question.questionContext ? (
                <span style={{ ...styles.helperText, fontSize: 12 }}>{question.questionContext}</span>
              ) : null}
              <strong style={{ fontSize: 12, color: isCorrect ? "#166534" : "#92400e" }}>
                {isCorrect ? "Correct" : "Needs review"}
              </strong>
            </div>
          );
        })}
      </div>
    </details>
  );
};

const ParticipationRecap = ({ record, highlighted = false }) => {
  const strongConcepts = Array.isArray(record.strongConcepts) ? record.strongConcepts : [];
  const reviewConcepts = Array.isArray(record.reviewConcepts) ? record.reviewConcepts : [];
  const reviewRecommendation = String(record.reviewRecommendation || "").trim();

  return (
    <div
      style={{
        marginTop: 4,
        padding: "10px 12px",
        borderRadius: 12,
        border: highlighted ? "1px solid #818cf8" : "1px solid #e2e8f0",
        background: highlighted ? "#eef2ff" : "#f8fafc",
        display: "grid",
        gap: 5,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <strong style={{ fontSize: 13 }}>Class recap</strong>
        {highlighted ? <PillBadge tone="info">From your email</PillBadge> : null}
      </div>
      <span style={{ ...styles.helperText, fontSize: 12 }}>
        Attempted: {Number(record.turns || 0)} · Correct: {Number(record.correct || 0)} · Needs review: {Number(record.needsReview || 0)}
      </span>
      {strongConcepts.length > 0 ? (
        <span style={{ fontSize: 12 }}><strong>Strong topics:</strong> {strongConcepts.join(" · ")}</span>
      ) : null}
      {reviewRecommendation || reviewConcepts.length > 0 ? (
        <span style={{ fontSize: 12 }}>
          <strong>Review next:</strong> {reviewRecommendation.replace(/^Review(?: recommended| next)?:\s*/i, "") || reviewConcepts.join(" · ")}
        </span>
      ) : null}
      <span style={{ fontSize: 12 }}><strong>Next class goal:</strong> {nextClassGoal(record)}</span>
    </div>
  );
};

const ClassParticipationCard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const { requestedClassSessionId, requestedSessionId } = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      requestedClassSessionId: String(params.get("classSessionId") || "").trim(),
      requestedSessionId: String(params.get("sessionId") || "").trim(),
    };
  }, [location.search]);

  const refresh = useCallback(async () => {
    if (!user?.uid) {
      setRecords([]);
      setStatus("idle");
      setError("");
      return;
    }

    setStatus("loading");
    setError("");
    try {
      const rows = await fetchMyClassParticipation({ user });
      setRecords(rows);
      setStatus("success");
    } catch (loadError) {
      console.warn("Could not load Class Participation", loadError);
      setRecords([]);
      setStatus("error");
      setError("Class Participation is temporarily unavailable.");
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onFocus = () => refresh();
    const onVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [refresh]);

  const weekly = useMemo(() => summarizeClassParticipation(records), [records]);
  const overall = useMemo(() => buildOverallSummary(records), [records]);
  const hasRequestedRecap = Boolean(requestedClassSessionId || requestedSessionId);
  const displayedRecords = useMemo(() => {
    if (!hasRequestedRecap) return records;
    return [...records].sort((left, right) => {
      const leftMatch = recordMatchesRequest(left, requestedClassSessionId, requestedSessionId) ? 1 : 0;
      const rightMatch = recordMatchesRequest(right, requestedClassSessionId, requestedSessionId) ? 1 : 0;
      return rightMatch - leftMatch;
    });
  }, [hasRequestedRecap, records, requestedClassSessionId, requestedSessionId]);

  useEffect(() => {
    if (status !== "success" || !hasRequestedRecap) return;
    const selected = records.find((record) => (
      recordMatchesRequest(record, requestedClassSessionId, requestedSessionId)
    ));
    if (!selected) return;
    const timer = window.setTimeout(() => {
      document.getElementById(recordElementId(selected))?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [hasRequestedRecap, records, requestedClassSessionId, requestedSessionId, status]);

  const requestedRecapMissing = hasRequestedRecap && !records.some((record) => (
    recordMatchesRequest(record, requestedClassSessionId, requestedSessionId)
  ));

  return (
    <section
      aria-label="Your class participation"
      style={{
        ...styles.card,
        display: "grid",
        gap: 16,
        border: "1px solid #c7d2fe",
        background: "linear-gradient(135deg, #ffffff, #f8faff)",
      }}
    >
      <SectionHeader
        eyebrow="Your learning record"
        title="Class Participation"
        subtitle="See how often you respond in teacher-led lessons, what you answered correctly and what to revise next."
        actions={<PillBadge tone="info">Learning support</PillBadge>}
      />

      {status === "loading" ? (
        <p style={{ ...styles.helperText, margin: 0 }}>Loading your participation…</p>
      ) : null}

      {status === "error" ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <p role="status" style={{ ...styles.helperText, margin: 0 }}>{error}</p>
          <button type="button" style={styles.secondaryButton} onClick={refresh}>Try again</button>
        </div>
      ) : null}

      {status === "success" && records.length === 0 ? (
        <p style={{ ...styles.helperText, margin: 0 }}>
          Your participation will appear here after your teacher records a classroom response.
        </p>
      ) : null}

      {status === "success" && records.length > 0 && requestedRecapMissing ? (
        <p style={{ ...styles.helperText, margin: 0, fontSize: 12 }}>
          That class recap is not available yet. Your other participation records are shown below.
        </p>
      ) : null}

      {status === "success" && records.length > 0 ? (
        <>
          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
              <h3 style={{ margin: 0, fontSize: 17 }}>This week</h3>
              <span style={{ ...styles.helperText, fontSize: 12 }}>Monday to today</span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(125px, 1fr))",
                gap: 8,
              }}
            >
              <Stat label="Classes recorded" value={weekly.classesRecorded} />
              <Stat label="Participated" value={weekly.participated} />
              <Stat label="Responses" value={weekly.responses} />
              <Stat label="Needs review" value={weekly.needsReview} />
            </div>
          </div>

          <div style={{ display: "grid", gap: 8, borderTop: "1px solid #e2e8f0", paddingTop: 14 }}>
            <h3 style={{ margin: 0, fontSize: 17 }}>Overall participation</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(125px, 1fr))",
                gap: 8,
              }}
            >
              <Stat label="Classes recorded" value={overall.classesRecorded} />
              <Stat label="Classes participated" value={overall.participated} />
              <Stat label="Total responses" value={overall.responses} />
              <Stat label="Correct" value={overall.correct} />
              <Stat label="Needs review" value={overall.needsReview} />
              <Stat label="Accuracy" value={overall.accuracy === null ? "—" : `${overall.accuracy}%`} />
            </div>
            {overall.skipped > 0 ? (
              <p style={{ ...styles.helperText, margin: 0, fontSize: 12 }}>
                Teacher-marked skipped turns: {overall.skipped}. A skipped turn is not the same as an absence.
              </p>
            ) : null}
          </div>

          <div style={{ display: "grid", gap: 8, borderTop: "1px solid #e2e8f0", paddingTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
              <h3 style={{ margin: 0, fontSize: 17 }}>Class history</h3>
              <span style={{ ...styles.helperText, fontSize: 12 }}>{records.length} recorded class{records.length === 1 ? "" : "es"}</span>
            </div>
            <div style={{ display: "grid" }}>
              {displayedRecords.map((record) => {
                const highlighted = recordMatchesRequest(
                  record,
                  requestedClassSessionId,
                  requestedSessionId
                );
                return (
                  <article
                    id={recordElementId(record)}
                    key={record.classSessionId || record.sessionId || record.id || `${record.sessionDate}-${record.assignmentId}`}
                    style={{
                      display: "grid",
                      gap: 6,
                      padding: highlighted ? "14px 12px" : "12px 2px",
                      margin: highlighted ? "4px 0" : 0,
                      border: highlighted ? "2px solid #818cf8" : "none",
                      borderBottom: highlighted ? "2px solid #818cf8" : "1px solid #f1f5f9",
                      borderRadius: highlighted ? 14 : 0,
                      background: highlighted ? "#f8faff" : "transparent",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12, flexWrap: "wrap" }}>
                      <div style={{ minWidth: 0, flex: "1 1 220px", display: "grid", gap: 2 }}>
                        <strong style={{ display: "block" }}>{formatLessonLabel(record)}</strong>
                        <span style={{ ...styles.helperText, fontSize: 12 }}>
                          <strong>Lesson:</strong> {formatParticipationDate(record.sessionDate) || "Class lesson"}
                        </span>
                        {record.markedDate ? (
                          <span style={{ ...styles.helperText, fontSize: 12 }}>
                            <strong>Recorded:</strong> {formatParticipationDate(record.markedDate)}
                          </span>
                        ) : null}
                      </div>
                      <span style={{ ...styles.helperText, fontSize: 12, fontWeight: 700 }}>
                        {latestDetail(record)}
                      </span>
                    </div>
                    <ParticipationRecap record={record} highlighted={highlighted} />
                    <QuestionHistory record={record} open={highlighted} />
                  </article>
                );
              })}
            </div>
          </div>
        </>
      ) : null}

      <p style={{ ...styles.helperText, margin: 0, fontSize: 12 }}>
        Class Participation is for learning support only. It does not change your course grade or official attendance.
      </p>
    </section>
  );
};

export default ClassParticipationCard;

export const __private__ = {
  buildOverallSummary,
  formatLessonLabel,
  formatParticipationDate,
  latestDetail,
  nextClassGoal,
  recordElementId,
  recordMatchesRequest,
};
