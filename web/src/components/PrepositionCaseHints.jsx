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

const PrepositionCaseHints = ({ hints = [], onDismiss }) => {
  const [revealedIds, setRevealedIds] = useState(() => new Set());

  useEffect(() => {
    const currentIds = new Set(hints.map((hint) => hint.id));
    setRevealedIds((current) => {
      const next = new Set([...current].filter((id) => currentIds.has(id)));
      const unchanged =
        next.size === current.size && [...next].every((id) => current.has(id));
      return unchanged ? current : next;
    });
  }, [hints]);

  if (!hints.length) return null;

  const toggleCorrection = (id) => {
    setRevealedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section
      aria-label="Preposition Case Coach"
      aria-live="polite"
      aria-atomic="false"
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
      <div style={{ display: "grid", gap: 3 }}>
        <strong style={{ color: "#92400e" }}>Preposition Case Coach</strong>
        <span style={{ ...styles.helperText, margin: 0 }}>
          A local grammar check for adjective endings. Your text is never changed automatically.
        </span>
      </div>

      {hints.map((hint) => {
        const correctionVisible = revealedIds.has(hint.id);
        return (
          <article key={hint.id} style={hintCardStyle}>
            <strong>Check “{hint.fullPhrase || `${hint.preposition} ${hint.phrase}`}”</strong>
            <p style={{ margin: 0, color: "#78350f", lineHeight: 1.55 }}>
              {hint.hint}
            </p>
            {correctionVisible ? (
              <p style={{ margin: 0, color: "#166534", fontWeight: 800 }}>
                Try: {hint.fullCorrection || `${hint.preposition} ${hint.correction}`}
              </p>
            ) : null}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                type="button"
                style={styles.secondaryButton}
                aria-expanded={correctionVisible}
                onClick={() => toggleCorrection(hint.id)}
              >
                {correctionVisible ? "Hide correction" : "Show correction"}
              </button>
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
