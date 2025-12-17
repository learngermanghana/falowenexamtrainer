import React from "react";
import { styles } from "../styles";

const formatDate = (value) => {
  if (!value) return "";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toLocaleString();
};

const ResultHistory = ({ results = [] }) => {
  if (!results.length) return null;

  return (
    <section style={{ ...styles.card, marginTop: 16 }}>
      <h2 style={styles.sectionTitle}>Past feedback</h2>
      <p style={styles.helperText}>
        Review your previous speaking and writing analyses to track your progress.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {results.map((entry) => {
          const created =
            formatDate(entry.createdAt || entry.date || entry.dateIso || entry.created_at) || "";

          const assignmentLabel =
            entry.assignmentText ||
            entry.assignment ||
            (entry.assignmentId ? `Assignment ${entry.assignmentId}` : "");
          const heading = entry.mode || assignmentLabel || "Feedback";
          const levelLabel = entry.level || entry.overall_level || "";
          const scoreValue =
            entry.overall_score !== undefined ? entry.overall_score : entry.score;
          const hasScoreDetails = entry.scores && Object.keys(entry.scores || {}).length > 0;
          const hasBasicSummary =
            !hasScoreDetails &&
            (scoreValue !== undefined || entry.comments || entry.link || assignmentLabel);

          const metaParts = [heading, entry.teil, levelLabel, created].filter(Boolean);

          return (
            <article key={entry.id || created} style={{ ...styles.resultCard, marginTop: 0 }}>
              <div style={{ ...styles.helperText, marginBottom: 8 }}>
                {metaParts.length ? metaParts.join(" · ") : ""}
              </div>

              {assignmentLabel && heading !== assignmentLabel && (
                <p style={{ ...styles.helperText, marginTop: 0 }}>
                  Assignment: {assignmentLabel}
                </p>
              )}

              {entry.assignmentId && !assignmentLabel && heading !== `Assignment ${entry.assignmentId}` && (
                <p style={{ ...styles.helperText, marginTop: 0 }}>
                  Assignment ID: {entry.assignmentId}
                </p>
              )}

              {entry.transcript && (
                <>
                  <h4 style={styles.resultHeading}>Transcript</h4>
                  <p style={styles.resultText}>{entry.transcript}</p>
                </>
              )}

              {scoreValue !== undefined && (
                <p style={{ ...styles.resultText, fontWeight: 600 }}>
                  Overall: {scoreValue}/100 ({entry.overall_level || levelLabel || "-"})
                </p>
              )}

              {hasScoreDetails && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 8,
                  }}
                >
                  <div style={styles.helperText}>
                    Aufgabenbewältigung (task fulfilment): {" "}
                    {entry.scores.task_fulfilment || 0}/25
                  </div>
                  <div style={styles.helperText}>
                    Interaktion (mapped from fluency): {entry.scores.fluency || 0}/25
                  </div>
                  <div style={styles.helperText}>
                    Aussprache · Ausspracheklarheit (mapped from fluency): {" "}
                    {entry.scores.fluency || 0}/25
                  </div>
                  <div style={styles.helperText}>
                    Sprachrichtigkeit (grammar accuracy): {entry.scores.grammar || 0}/25
                  </div>
                  <div style={styles.helperText}>
                    Wortschatz (vocabulary range): {entry.scores.vocabulary || 0}/25
                  </div>
                </div>
              )}

              {hasBasicSummary && (
                <div style={{ display: "grid", gap: 4 }}>
                  {scoreValue !== undefined && (
                    <p style={styles.resultText}>
                      <strong>Score:</strong> {scoreValue}
                    </p>
                  )}

                  {entry.comments && (
                    <p style={styles.resultText}>
                      <strong>Comments:</strong> {entry.comments}
                    </p>
                  )}

                  {entry.link && (
                    <a
                      href={entry.link}
                      target="_blank"
                      rel="noreferrer"
                      style={{ ...styles.resultText, color: "#0070f3" }}
                    >
                      View submission
                    </a>
                  )}
                </div>
              )}

              {entry.corrected_text && (
                <>
                  <h4 style={styles.resultHeading}>Corrected German Version</h4>
                  <p style={styles.resultText}>{entry.corrected_text}</p>
                </>
              )}

              {entry.strengths && entry.strengths.length > 0 && (
                <>
                  <h4 style={styles.resultHeading}>Strengths</h4>
                  <ul style={{ paddingLeft: 18, margin: 0, display: "grid", gap: 4 }}>
                    {entry.strengths.map((item, idx) => (
                      <li key={`strength-${entry.id}-${idx}`} style={styles.resultText}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {entry.improvements && entry.improvements.length > 0 && (
                <>
                  <h4 style={styles.resultHeading}>Improvements</h4>
                  <ul style={{ paddingLeft: 18, margin: 0, display: "grid", gap: 4 }}>
                    {entry.improvements.map((item, idx) => (
                      <li key={`improve-${entry.id}-${idx}`} style={styles.resultText}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {entry.practice_phrases && entry.practice_phrases.length > 0 && (
                <>
                  <h4 style={styles.resultHeading}>Practice phrases</h4>
                  <ul style={{ paddingLeft: 18, margin: 0, display: "grid", gap: 4 }}>
                    {entry.practice_phrases.map((phrase, idx) => (
                      <li key={`phrase-${entry.id}-${idx}`} style={styles.resultText}>
                        {phrase}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {entry.next_task_hint && (
                <p style={{ ...styles.resultText, marginTop: 6 }}>
                  <strong>Next task hint:</strong> {entry.next_task_hint}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default ResultHistory;
