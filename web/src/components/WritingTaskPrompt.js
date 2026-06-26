import React from "react";

const listStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

const cleanWritingTitle = (value = "") => {
  const text = String(value || "").replace(/^Schreiben:\s*/i, "").trim();
  if (!text) return "Schreibaufgabe";
  const firstSentence = text.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim();
  return firstSentence || text;
};

const getLeadInstruction = (value = "", title = "") => {
  const text = String(value || "").replace(/^Schreiben:\s*/i, "").trim();
  const remainder = text.slice(title.length).trim();
  if (!remainder) return "";
  const beforeTaskPoints = remainder.split(/Bearbeiten Sie (?:alle|folgende) Punkte\s*:/i)[0].trim();
  const firstSentence = beforeTaskPoints.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim();
  return firstSentence || beforeTaskPoints;
};

export default function WritingTaskPrompt({ lesson }) {
  const rawTopic = lesson?.writingTopic || `Schreibe einen Text zum Thema „${lesson?.title || "das Lektionsthema"}“.`;
  const title = cleanWritingTitle(rawTopic);
  const lead = getLeadInstruction(rawTopic, title);
  const bullets = Array.isArray(lesson?.writingPromptBullets)
    ? lesson.writingPromptBullets.filter(Boolean)
    : [];

  return (
    <div style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 14, background: "#eff6ff", color: "#1e3a8a", display: "grid", gap: 10, lineHeight: 1.65 }}>
      <div style={{ display: "grid", gap: 4 }}>
        <strong style={{ fontSize: "0.82rem", letterSpacing: ".04em", textTransform: "uppercase" }}>Schreibaufgabe</strong>
        <strong style={{ fontSize: "1.05rem" }}>{title}</strong>
      </div>
      {lead ? <p style={{ margin: 0 }}>{lead}</p> : null}
      {bullets.length ? (
        <div style={{ display: "grid", gap: 6 }}>
          <strong>Bearbeiten Sie diese Punkte:</strong>
          <ul style={listStyle}>
            {bullets.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export const __TESTING__ = { cleanWritingTitle, getLeadInstruction };
