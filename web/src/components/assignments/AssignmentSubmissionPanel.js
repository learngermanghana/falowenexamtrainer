import React, { useState } from "react";
import { styles } from "../../styles";
import { formatSubmissionDate, useAssignmentSubmission } from "../../hooks/useAssignmentSubmission";

const GERMAN_SPECIAL_CHARACTERS = ["ä", "ö", "ü", "ß", "Ä", "Ö", "Ü"];

const panelStyles = {
  shell: { border: "1px solid #bfdbfe", borderRadius: 18, padding: 14, background: "#f8fbff", display: "grid", gap: 12, maxWidth: "100%", overflowX: "hidden" },
  top: { display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start", flexWrap: "wrap" },
  status: { borderRadius: 999, padding: "7px 11px", background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", fontWeight: 900, fontSize: 13 },
  grid: { display: "grid", gap: 10 },
  textarea: { ...styles.textarea, minHeight: 160, width: "100%", maxWidth: "100%", boxSizing: "border-box", resize: "vertical" },
  actions: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" },
  charButton: { ...styles.secondaryButton, minWidth: 42, minHeight: 42, padding: "8px 10px" },
};

export function SubmissionHistoryPanel({ history = [] }) {
  if (!history.length) return null;
  return (
    <details style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 10, background: "#fff" }}>
      <summary style={{ cursor: "pointer", fontWeight: 800 }}>Submission history</summary>
      <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
        {history.map((entry) => (
          <article key={entry.id} style={{ borderTop: "1px solid #e2e8f0", paddingTop: 8 }}>
            <strong>{entry.status || "submitted"}</strong> · {formatSubmissionDate(entry.submittedAt || entry.createdAt)}
            <p style={{ ...styles.helperText, margin: "4px 0 0", whiteSpace: "pre-wrap" }}>{entry.submissionText || entry.answer || entry.workContent || ""}</p>
          </article>
        ))}
      </div>
    </details>
  );
}

export default function AssignmentSubmissionPanel({ assignment, initiallyOpen = false, onSubmitted }) {
  const [open, setOpen] = useState(initiallyOpen);
  const submission = useAssignmentSubmission({ assignment, lockedContext: true, onSubmitted });
  const characterCount = submission.text.length;
  const insertSpecialCharacter = (char) => submission.setText(`${submission.text}${char}`);

  return (
    <section id={`assignment-submission-${submission.canonicalAssignmentKey}`} data-testid="assignment-submission-panel" style={panelStyles.shell} aria-label="Assignment submission">
      <div style={panelStyles.top}>
        <div style={{ minWidth: 0 }}>
          <p style={{ ...styles.helperText, margin: 0, fontWeight: 900 }}>Tutor-marked assignment</p>
          <h3 style={{ margin: "3px 0", color: "#0f172a" }}>{assignment?.title || assignment?.assignmentTitle || "Assignment"}</h3>
          <p style={{ ...styles.helperText, margin: 0 }}>Day {assignment?.day} {assignment?.chapter ? `· Chapter ${assignment.chapter}` : ""} · {submission.canonicalAssignmentKey}</p>
        </div>
        <span style={panelStyles.status}>{submission.displayStatus}</span>
      </div>

      {typeof submission.latestScore === "number" ? (
        <div style={{ ...styles.card, margin: 0, padding: 12, background: submission.passed ? "#ecfdf5" : "#fef2f2" }}>
          <strong>Score: {submission.latestScore}/100</strong>
          {submission.feedback ? <p style={{ margin: "6px 0 0", whiteSpace: "pre-wrap" }}>{submission.feedback}</p> : null}
        </div>
      ) : submission.latest ? <p style={{ margin: 0, color: "#92400e", fontWeight: 800 }}>Awaiting tutor score.</p> : null}

      {!open ? (
        <button type="button" style={styles.primaryButton} onClick={() => setOpen(true)} aria-expanded={open}>
          {submission.displayStatus}
        </button>
      ) : null}

      {open ? (
        <div style={panelStyles.grid}>
          {submission.latest && !submission.canResubmit ? (
            <details style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 10, background: "#fff" }}>
              <summary style={{ cursor: "pointer", fontWeight: 800 }}>Submitted answer preview</summary>
              <p style={{ whiteSpace: "pre-wrap" }}>{submission.latest.submissionText || submission.latest.answer || submission.latest.workContent}</p>
            </details>
          ) : (
            <>
              <label style={{ display: "grid", gap: 6, fontWeight: 800 }}>
                Your answer
                <textarea aria-label="Assignment answer" value={submission.text} onChange={(event) => submission.setText(event.target.value)} style={panelStyles.textarea} maxLength={submission.maxChars} />
              </label>
              <div style={panelStyles.actions} aria-label="German special characters">
                {GERMAN_SPECIAL_CHARACTERS.map((char) => <button key={char} type="button" style={panelStyles.charButton} onClick={() => insertSpecialCharacter(char)} aria-label={`Insert ${char}`}>{char}</button>)}
              </div>
              <p style={{ ...styles.helperText, margin: 0 }}>{characterCount}/{submission.maxChars} characters</p>
              <label style={{ display: "flex", gap: 8, alignItems: "flex-start", fontWeight: 700 }}>
                <input type="checkbox" checked={submission.confirmed} onChange={(event) => submission.setConfirmed(event.target.checked)} />
                I confirm this is my own final answer for this lesson assignment.
              </label>
              <div style={panelStyles.actions}>
                <button type="button" style={styles.secondaryButton} onClick={submission.saveDraft} disabled={submission.loading}>Save draft</button>
                <button type="button" style={styles.primaryButton} onClick={submission.submit} disabled={submission.loading || submission.isLocked}>{submission.canResubmit ? "Submit correction" : "Submit assignment"}</button>
                <button type="button" style={styles.secondaryButton} onClick={() => setOpen(false)}>Collapse</button>
              </div>
            </>
          )}
          {submission.status.error ? <p role="alert" style={{ margin: 0, color: "#b91c1c", fontWeight: 800 }}>{submission.status.error}</p> : null}
          {submission.status.success ? <p role="status" style={{ margin: 0, color: "#047857", fontWeight: 800 }}>{submission.status.success}</p> : null}
          <SubmissionHistoryPanel history={submission.history} />
        </div>
      ) : null}
    </section>
  );
}
