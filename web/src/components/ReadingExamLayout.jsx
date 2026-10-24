import React from "react";

const paperStyle = {
  border: "1px solid #cbd5e1",
  borderRadius: 16,
  background: "#ffffff",
  boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
};

const sourceFormatPattern =
  /(anzeigen?|stellenanzeigen?|personenprofile?|profile|vergleich|wohnungen?|angebote?|zuordnen|matching|meinungen?|kommentare?)/i;

export const getReadingExamVariant = ({
  format = "",
  sourceCount = 0,
  forceVariant = "",
} = {}) => {
  if (forceVariant === "sources" || forceVariant === "document") return forceVariant;
  if (Number(sourceCount) > 1) return "sources";
  return sourceFormatPattern.test(String(format || "")) ? "sources" : "document";
};

export const splitReadingSourceText = (text = "", format = "") => {
  const value = String(text || "").trim();
  if (!value) return [];
  if (!sourceFormatPattern.test(String(format || ""))) return [value];

  const blocks = value
    .split(/\n\s*\n+/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.length > 1 ? blocks : [value];
};

export const readingSourceLabel = (index) =>
  `Text ${String.fromCharCode(65 + Number(index || 0))}`;

export function ReadingExamFrame({
  level = "",
  title = "",
  format = "",
  strategy = "",
  variant = "document",
  children,
}) {
  return (
    <section
      data-reading-exam-layout={variant}
      data-reading-exam-level={level}
      style={{
        ...paperStyle,
        padding: 16,
        display: "grid",
        gap: 14,
        background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 120px)",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        <div style={{ display: "grid", gap: 4, minWidth: 0 }}>
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
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {level ? `${level} · Lesen` : "Lesen"}
          </span>
          {title ? <strong style={{ fontSize: 17, color: "#0f172a" }}>{title}</strong> : null}
          {format ? <span style={{ color: "#475569", fontSize: 13 }}>{format}</span> : null}
        </div>
        <span style={{ color: "#64748b", fontSize: 12, fontWeight: 800 }}>
          {variant === "sources" ? "Quellen vergleichen" : "Text lesen · Aufgaben lösen"}
        </span>
      </header>

      {strategy ? (
        <div
          style={{
            border: "1px solid #bfdbfe",
            borderRadius: 12,
            padding: 11,
            background: "#eff6ff",
            color: "#1e3a8a",
            lineHeight: 1.6,
          }}
        >
          <strong>Lesestrategie:</strong> {strategy}
        </div>
      ) : null}

      <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 14 }}>
        {children}
      </div>
    </section>
  );
}

export function ReadingExamDocument({
  label = "Lesetext",
  title = "",
  subtitle = "",
  children,
}) {
  return (
    <article
      data-reading-exam-document="true"
      style={{
        ...paperStyle,
        maxWidth: 860,
        width: "100%",
        margin: "0 auto",
        padding: "clamp(14px, 2.5vw, 22px)",
        display: "grid",
        gap: 11,
        lineHeight: 1.8,
        color: "#1f2937",
      }}
    >
      <div style={{ display: "grid", gap: 3 }}>
        <span
          style={{
            color: "#64748b",
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
        {title ? <strong style={{ fontSize: 18, color: "#0f172a" }}>{title}</strong> : null}
        {subtitle ? <span style={{ color: "#64748b", fontSize: 13 }}>{subtitle}</span> : null}
      </div>
      {children}
    </article>
  );
}

export function ReadingSourceGrid({ children, minWidth = 250 }) {
  return (
    <div
      data-reading-exam-source-grid="true"
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

export function ReadingSourceCard({
  label = "",
  title = "",
  children,
}) {
  return (
    <article
      data-reading-exam-source-card="true"
      style={{
        ...paperStyle,
        padding: 14,
        display: "grid",
        alignContent: "start",
        gap: 8,
        minHeight: "100%",
        borderColor: "#bfdbfe",
        lineHeight: 1.7,
        color: "#1f2937",
      }}
    >
      <div style={{ display: "grid", gap: 3 }}>
        {label ? (
          <span
            style={{
              color: "#1d4ed8",
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {label}
          </span>
        ) : null}
        {title ? <strong style={{ color: "#0f172a" }}>{title}</strong> : null}
      </div>
      {children}
    </article>
  );
}

export function ReadingQuestionGrid({ children }) {
  return (
    <div
      data-reading-exam-question-grid="true"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
        gap: 12,
      }}
    >
      {children}
    </div>
  );
}

export default ReadingExamFrame;
