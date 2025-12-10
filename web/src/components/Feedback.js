import React, { useState } from "react";
import { styles } from "../styles";

const scoreBarStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "center",
    gap: 8,
  },
  bar: {
    position: "relative",
    height: 8,
    background: "#e5e7eb",
    borderRadius: 999,
    overflow: "hidden",
  },
  fill: (percent) => ({
    position: "absolute",
    inset: 0,
    width: `${Math.min(Math.max(percent, 0), 100)}%`,
    background: "linear-gradient(90deg, #2563eb, #06b6d4)",
  }),
  label: {
    fontSize: 13,
    color: "#1f2937",
    fontWeight: 600,
  },
  value: {
    fontSize: 13,
    color: "#374151",
    fontVariantNumeric: "tabular-nums",
  },
};

const renderScoreBar = (label, score, maxScore = 25) => {
  const percent = maxScore > 0 ? (score / maxScore) * 100 : 0;
  return (
    <div style={scoreBarStyles.row}>
      <div>
        <div style={scoreBarStyles.label}>{label}</div>
        <div style={scoreBarStyles.bar}>
          <div style={scoreBarStyles.fill(percent)} />
        </div>
      </div>
      <div style={scoreBarStyles.value}>
        {Math.round(score)} / {maxScore}
      </div>
    </div>
  );
};

const Feedback = ({ result }) => {
  const [showPracticeTask, setShowPracticeTask] = useState(false);

  if (!result) return null;

  const {
    transcript,
    corrected_text,
    overall_level,
    overall_score,
    scores,
    strengths = [],
    improvements = [],
    example_corrections = [],
    practice_phrases = [],
    next_task_hint,
  } = result;

  const hasScores = scores && Object.keys(scores).length > 0;

  return (
    <section style={styles.resultCard}>
      <h2 style={styles.sectionTitle}>3. Feedback</h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 180 }}>
          <h3 style={styles.resultHeading}>Overall level</h3>
          <p style={styles.resultText}>
            <strong>{overall_level || "-"}</strong> · {overall_score || 0}/100
          </p>
        </div>
        {hasScores && (
          <div style={{ flex: 2, minWidth: 240 }}>
            <h3 style={styles.resultHeading}>Skill breakdown</h3>
            <div style={scoreBarStyles.container}>
              {renderScoreBar("Task fulfilment", scores.task_fulfilment || 0)}
              {renderScoreBar("Fluency", scores.fluency || 0)}
              {renderScoreBar("Grammar", scores.grammar || 0)}
              {renderScoreBar("Vocabulary", scores.vocabulary || 0)}
            </div>
          </div>
        )}
      </div>

      {transcript && (
        <>
          <h3 style={styles.resultHeading}>Transcript (What the AI heard)</h3>
          <p style={styles.resultText}>{transcript}</p>
        </>
      )}

      {corrected_text && (
        <>
          <h3 style={styles.resultHeading}>Corrected German Version</h3>
          <p style={styles.resultText}>{corrected_text}</p>
        </>
      )}

      {strengths.length > 0 && (
        <>
          <h3 style={styles.resultHeading}>Strengths</h3>
          <ul style={{ paddingLeft: 18, margin: 0, display: "grid", gap: 4 }}>
            {strengths.map((item, idx) => (
              <li key={`strength-${idx}`} style={styles.resultText}>
                {item}
              </li>
            ))}
          </ul>
        </>
      )}

      {improvements.length > 0 && (
        <>
          <h3 style={styles.resultHeading}>Improvements</h3>
          <ul style={{ paddingLeft: 18, margin: 0, display: "grid", gap: 4 }}>
            {improvements.map((item, idx) => (
              <li key={`improve-${idx}`} style={styles.resultText}>
                {item}
              </li>
            ))}
          </ul>
        </>
      )}

      {example_corrections.length > 0 && (
        <>
          <h3 style={styles.resultHeading}>Example corrections</h3>
          <ul style={{ paddingLeft: 18, margin: 0, display: "grid", gap: 6 }}>
            {example_corrections.map((pair, idx) => (
              <li key={`correction-${idx}`} style={styles.resultText}>
                <div>
                  <strong>Student:</strong> {pair.student}
                </div>
                <div>
                  <strong>Corrected:</strong> {pair.corrected}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {practice_phrases.length > 0 && (
        <>
          <h3 style={styles.resultHeading}>Practice phrases to reuse</h3>
          <ul style={{ paddingLeft: 18, margin: 0, display: "grid", gap: 4 }}>
            {practice_phrases.map((phrase, idx) => (
              <li key={`phrase-${idx}`} style={styles.resultText}>
                {phrase}
              </li>
            ))}
          </ul>
        </>
      )}

      {next_task_hint && (
        <div style={{ marginTop: 12 }}>
          <button
            style={styles.primaryButton}
            onClick={() => setShowPracticeTask(true)}
          >
            Train this now
          </button>
          {showPracticeTask && (
            <div
              style={{
                marginTop: 10,
                padding: 12,
                borderRadius: 10,
                background: "#ecfeff",
                border: "1px solid #06b6d4",
                color: "#0f172a",
              }}
            >
              <strong>Next task hint:</strong> {next_task_hint}
              <p style={{ ...styles.resultText, marginTop: 6 }}>
                Try recording or typing a short answer that follows this hint, then
                send it for feedback.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Feedback;
