import React, { useEffect, useState } from "react";
import { styles } from "../styles";

export const prepositionCaseTextareaWarningStyle = {
  borderColor: "#d97706",
  boxShadow: "0 0 0 2px rgba(217, 119, 6, 0.14)",
};

const hintCardStyle = {
  border: "1px solid #fcd34d",
  borderRadius: 12,
  padding: 12,
  background: "#fffbeb",
  display: "grid",
  gap: 8,
};

const summaryBadgeStyle = {
  border: "1px solid #fde68a",
  borderRadius: 999,
  padding: "4px 9px",
  background: "#ffffff",
  color: "#78350f",
  fontSize: 12,
  fontWeight: 800,
};

const setsMatch = (left, right) =>
  left.size === right.size && [...left].every((id) => right.has(id));

const PrepositionCaseHints = ({
  hints = [],
  summary = { checked: 0, current: 0, cleared: 0, dismissed: 0 },
  onDismiss,
  onSelectHint,
}) => {
  const [revealedIds, setRevealedIds] = useState(() => new Set());
  const [explanationIds, setExplanationIds] = useState(() => new Set());

  useEffect(() => {
    const currentIds = new Set(hints.map((hint) => hint.id));
    setRevealedIds((current) => {
      const next = new Set([...current].filter((id) => currentIds.has(id)));
      return setsMatch(current, next) ? current : next;
    });
    setExplanationIds((current) => {
      const next = new Set([...current].filter((id) => currentIds.has(id)));
      return setsMatch(current, next) ? current : next;
    });
  }, [hints]);

  if (!hints.length && !summary.checked) return null;

  const toggleSetValue = (setter, id) => {
    setter((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section
      aria-label="Preposition Case Coach"
      style={{
        marginTop: 10,
        border: "1px solid #fde68a",
        borderRadius: 14,
        padding: 12,
        background: "#fffdf5",
        display: "grid",
        gap: 10,
      }}
    >
      <div style={{ display: "grid", gap: 7 }}>
        <strong style={{ color: "#92400e" }}>Preposition Case Coach</strong>
        <span style={{ ...styles.helperText, margin: 0 }}>
          Local grammar guidance only. Your text is never changed automatically.
        </span>
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          style={{ display: "flex", flexWrap: "wrap", gap: 6 }}
        >
          <span style={summaryBadgeStyle}>{summary.current} current</span>
          <span style={summaryBadgeStyle}>{summary.cleared} cleared</span>
          <span style={summaryBadgeStyle}>{summary.dismissed} dismissed</span>
        </div>
      </div>

      {!hints.length ? (
        <p style={{ margin: 0, color: "#166534", fontWeight: 700 }}>
          No active phrase to check. Keep writing.
        </p>
      ) : null}

      {hints.map((hint) => {
        const correctionVisible = revealedIds.has(hint.id);
        const explanationVisible = explanationIds.has(hint.id);
        return (
          <article key={hint.id} style={hintCardStyle}>
            <strong>Check “{hint.fullPhrase || `${hint.preposition} ${hint.phrase}`}”</strong>
            <p style={{ margin: 0, color: "#78350f", lineHeight: 1.55 }}>
              {hint.hint}
            </p>

            {explanationVisible ? (
              <p
                id={`${hint.id}-explanation`}
                style={{ margin: 0, color: "#475569", lineHeight: 1.55 }}
              >
                {hint.explanation}
              </p>
            ) : null}

            {correctionVisible ? (
              <p
                id={`${hint.id}-correction`}
                style={{ margin: 0, color: "#166534", fontWeight: 800 }}
              >
                Try: {hint.fullCorrection || `${hint.preposition} ${hint.correction}`}
              </p>
            ) : null}

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                type="button"
                style={styles.secondaryButton}
                aria-expanded={correctionVisible}
                aria-controls={`${hint.id}-correction`}
                onClick={() => toggleSetValue(setRevealedIds, hint.id)}
              >
                {correctionVisible ? "Hide correction" : "Show correction"}
              </button>
              <button
                type="button"
                style={styles.secondaryButton}
                aria-expanded={explanationVisible}
                aria-controls={`${hint.id}-explanation`}
                onClick={() => toggleSetValue(setExplanationIds, hint.id)}
              >
                {explanationVisible ? "Hide why" : "Why?"}
              </button>
              {typeof onSelectHint === "function" ? (
                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={() => onSelectHint(hint)}
                >
                  Find in text
                </button>
              ) : null}
              <button
                type="button"
                style={styles.secondaryButton}
                onClick={() => onDismiss?.(hint.id)}
              >
                Dismiss
              </button>
            </div>
          </article>
        );
      })}
    </section>
  );
};

export default PrepositionCaseHints;
