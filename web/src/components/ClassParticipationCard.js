import React, { useCallback, useEffect, useMemo, useState } from "react";
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

const latestDetail = (record = {}) => {
  const turns = Number(record.turns || 0);
  if (turns <= 0) return "No response recorded";
  const correct = Number(record.correct || 0);
  const needsReview = Number(record.needsReview || 0);
  const responseLabel = `${turns} response${turns === 1 ? "" : "s"}`;
  return `${responseLabel} · ${correct} correct · ${needsReview} to review`;
};

const latestQuestion = (record = {}) => {
  const rows = Array.isArray(record.questionResponses) ? record.questionResponses : [];
  return rows[rows.length - 1] || null;
};

const statStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  padding: "11px 12px",
  background: "#f8fafc",
  display: "grid",
  gap: 3,
  minWidth: 0,
};

const ClassParticipationCard = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

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

  const summary = useMemo(() => summarizeClassParticipation(records), [records]);

  return (
    <section
      aria-label="Your class participation"
      style={{
        ...styles.card,
        display: "grid",
        gap: 12,
        border: "1px solid #c7d2fe",
        background: "linear-gradient(135deg, #ffffff, #f8faff)",
      }}
    >
      <SectionHeader
        eyebrow="Your learning record"
        title="Class Participation"
        subtitle="Your own responses from teacher-led lessons. Use this to see what to revise next."
        actions={<PillBadge tone="info">This week</PillBadge>}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(125px, 1fr))",
          gap: 8,
        }}
      >
        <div style={statStyle}>
          <span style={{ ...styles.helperText, fontSize: 12 }}>Classes recorded</span>
          <strong style={{ fontSize: 21 }}>{summary.classesRecorded}</strong>
        </div>
        <div style={statStyle}>
          <span style={{ ...styles.helperText, fontSize: 12 }}>Participated</span>
          <strong style={{ fontSize: 21 }}>{summary.participated}</strong>
        </div>
        <div style={statStyle}>
          <span style={{ ...styles.helperText, fontSize: 12 }}>Responses</span>
          <strong style={{ fontSize: 21 }}>{summary.responses}</strong>
        </div>
        <div style={statStyle}>
          <span style={{ ...styles.helperText, fontSize: 12 }}>Needs review</span>
          <strong style={{ fontSize: 21 }}>{summary.needsReview}</strong>
        </div>
      </div>

      {status === "loading" ? (
        <p style={{ ...styles.helperText, margin: 0 }}>Loading your participation…</p>
      ) : null}

      {status === "error" ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <p role="status" style={{ ...styles.helperText, margin: 0 }}>{error}</p>
          <button type="button" style={styles.secondaryButton} onClick={refresh}>Try again</button>
        </div>
      ) : null}

      {status === "success" && summary.latest.length === 0 ? (
        <p style={{ ...styles.helperText, margin: 0 }}>
          Your participation will appear here after your teacher records a classroom response.
        </p>
      ) : null}

      {summary.latest.length > 0 ? (
        <div style={{ display: "grid", borderTop: "1px solid #e2e8f0" }}>
          {summary.latest.map((record) => {
            const question = latestQuestion(record);
            return (
              <div
                key={record.id || `${record.sessionDate}-${record.assignmentId}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) auto",
                  gap: 12,
                  padding: "10px 2px",
                  borderBottom: "1px solid #f1f5f9",
                  alignItems: "start",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <strong style={{ display: "block" }}>{formatLessonLabel(record)}</strong>
                  <span style={{ ...styles.helperText, fontSize: 12 }}>{record.sessionDate || "Class lesson"}</span>
                  {question ? (
                    <div
                      style={{
                        marginTop: 7,
                        borderRadius: 10,
                        background: "#f8fafc",
                        padding: "8px 10px",
                        display: "grid",
                        gap: 4,
                      }}
                    >
                      <span style={{ ...styles.helperText, fontSize: 11, fontWeight: 700 }}>Your latest class question</span>
                      <span style={{ fontSize: 13, lineHeight: 1.35 }}>{question.question}</span>
                      <strong style={{ fontSize: 12, color: question.result === "correct" ? "#166534" : "#92400e" }}>
                        {question.result === "correct" ? "Correct" : "Needs review"}
                      </strong>
                    </div>
                  ) : null}
                </div>
                <span style={{ ...styles.helperText, fontSize: 12, fontWeight: 700, textAlign: "right" }}>
                  {latestDetail(record)}
                </span>
              </div>
            );
          })}
        </div>
      ) : null}

      <p style={{ ...styles.helperText, margin: 0, fontSize: 12 }}>
        Class Participation is for learning support only. It does not change your course grade or official attendance.
      </p>
    </section>
  );
};

export default ClassParticipationCard;
