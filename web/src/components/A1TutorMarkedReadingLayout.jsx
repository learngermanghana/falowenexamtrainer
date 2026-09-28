import React from "react";

const paper = {
  border: "1px solid #cbd5e1",
  borderRadius: 16,
  background: "#ffffff",
  boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
};

export const isA1TutorReadingLabel = (label = "") =>
  /\b(lesen|reading|anzeigen|nachricht)\b/i.test(String(label || ""));

export const getA1ReadingLayoutMode = (label = "") =>
  /\b(anzeigen|advert|ads?)\b/i.test(String(label || ""))
    ? "sources"
    : "document";

export function A1TutorMarkedReadingFrame({ label = "", children }) {
  const mode = getA1ReadingLayoutMode(label);

  return (
    <section
      data-a1-tutor-reading-layout={mode}
      style={{
        ...paper,
        padding: 16,
        display: "grid",
        gap: 14,
        background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 120px)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "grid", gap: 3 }}>
          <span
            style={{
              display: "inline-flex",
              width: "fit-content",
              borderRadius: 999,
              padding: "5px 9px",
              background: "#e0f2fe",
              color: "#075985",
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: "0.03em",
              textTransform: "uppercase",
            }}
          >
            Lesen · Prüfungsformat
          </span>
          <strong style={{ fontSize: 14 }}>{label}</strong>
        </div>
        <span style={{ color: "#64748b", fontSize: 12, fontWeight: 700 }}>
          {mode === "sources" ? "Quellen vergleichen" : "Text lesen → Aufgaben lösen"}
        </span>
      </div>

      <div
        style={{
          borderTop: "1px solid #e2e8f0",
          paddingTop: 14,
          display: "grid",
          gap: 12,
          width: "100%",
          maxWidth: mode === "document" ? 900 : "none",
          justifySelf: "center",
        }}
      >
        {children}
      </div>
    </section>
  );
}

export function A1ReadingDocument({ label = "Text", title = "", children }) {
  return (
    <article
      data-a1-reading-document="true"
      style={{
        ...paper,
        padding: 16,
        display: "grid",
        gap: 10,
        maxWidth: 820,
        width: "100%",
        justifySelf: "center",
      }}
    >
      <div style={{ display: "grid", gap: 3 }}>
        <span style={{ color: "#64748b", fontSize: 11, fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          {label}
        </span>
        {title ? <strong style={{ fontSize: 17 }}>{title}</strong> : null}
      </div>
      <div style={{ lineHeight: 1.75 }}>{children}</div>
    </article>
  );
}

export function A1ReadingSourceGrid({ children, minWidth = 240 }) {
  return (
    <div
      data-a1-reading-source-grid="true"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${minWidth}px), 1fr))`,
        gap: 12,
        alignItems: "stretch",
      }}
    >
      {children}
    </div>
  );
}

export function A1ReadingSourceCard({ label, title, children }) {
  return (
    <article
      data-a1-reading-source-card="true"
      style={{
        ...paper,
        padding: 14,
        display: "grid",
        gap: 8,
        minHeight: "100%",
        borderColor: "#bfdbfe",
      }}
    >
      <div style={{ display: "grid", gap: 3 }}>
        <span style={{ color: "#1d4ed8", fontSize: 11, fontWeight: 900, letterSpacing: "0.04em", textTransform: "uppercase" }}>
          {label}
        </span>
        {title ? <strong>{title}</strong> : null}
      </div>
      <div style={{ lineHeight: 1.7 }}>{children}</div>
    </article>
  );
}

export default A1TutorMarkedReadingFrame;
