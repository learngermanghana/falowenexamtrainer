import React, { useEffect, useState } from "react";
import { getWritingCheatSheet } from "../data/writingCheatSheets";
import {
  getOpinionStructureChecks,
  getWritingPattern,
  suggestWritingStyle,
  WRITING_LEVEL_GUIDANCE,
} from "../data/consistentWritingPatterns";

const panel = {
  border: "1px solid #bfdbfe",
  borderRadius: 14,
  padding: 14,
  background: "#eff6ff",
  color: "#1e293b",
  display: "grid",
  gap: 12,
};
const button = {
  background: "#fff",
  color: "#1e3a8a",
  border: "1px solid #93c5fd",
  borderRadius: 10,
  padding: "9px 12px",
  cursor: "pointer",
  fontWeight: 700,
};
const STEPS = [
  ["informal", "Informal letter"],
  ["formal", "Formal letter"],
  ["opinion", "B1 opinion essay"],
];

/**
 * Teaching-only guidance. Never writes into an answer field, never calls AI,
 * and is never mounted inside the timed full-mock screens.
 */
export default function ConsistentWritingPatternGuide({
  level = "A2",
  taskTitle = "",
  text = "",
  defaultOpen = false,
}) {
  const normalizedLevel = String(level || "").toUpperCase();
  const [style, setStyle] = useState(() => suggestWritingStyle(taskTitle, normalizedLevel));
  useEffect(() => setStyle(suggestWritingStyle(taskTitle, normalizedLevel)), [taskTitle, normalizedLevel]);
  if (!WRITING_LEVEL_GUIDANCE[normalizedLevel]) return null;

  const available = STEPS.filter(([id]) => id !== "opinion" || normalizedLevel === "B1");
  const selected = style === "opinion" && normalizedLevel !== "B1" ? "informal" : style;
  const letter = getWritingPattern(selected);
  const opinion = selected === "opinion"
    ? getWritingCheatSheet("B1", 1).find((item) => item.id === "b1-opinion-text-template")
    : null;
  const steps = letter?.steps || opinion?.items.map(({phrase,label,meaning}) => ({
    label: phrase || label,
    text: meaning,
  })) || [];
  const checks = selected === "opinion" && String(text).trim()
    ? getOpinionStructureChecks(text)
    : [];

  return (
    <details data-consistent-writing-pattern={normalizedLevel} open={defaultOpen ? true : undefined} style={panel}>
      <summary style={{ cursor: "pointer", fontWeight: 800, color: "#1e3a8a" }}>
        Learn one repeatable writing pattern · A1–B1
      </summary>
      <p style={{ margin: 0, lineHeight: 1.6 }}>
        Learn the same framework every time. Replace [brackets] with the exact task details rather than memorizing a different opening for each question.
      </p>
      <p style={{ margin: 0, fontSize: ".92rem", lineHeight: 1.6 }}>{WRITING_LEVEL_GUIDANCE[normalizedLevel]}</p>
      <div role="group" aria-label="Choose writing style" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {available.map(([id, label]) => (
          <button key={id} type="button" aria-pressed={selected === id} onClick={() => setStyle(id)}
            style={selected === id ? {...button, background: "#1d4ed8", color: "#fff", borderColor: "#1d4ed8"} : button}>
            {label}
          </button>
        ))}
      </div>
      <ol style={{ margin: 0, paddingLeft: 24, display: "grid", gap: 9 }}>
        {steps.map(({label, text: example}) => (
          <li key={label} style={{ lineHeight: 1.6 }}>
            <strong>{label}: </strong>
            <span style={{ whiteSpace: "pre-line" }}>{example}</span>
          </li>
        ))}
      </ol>
      <p style={{ margin: 0, fontSize: ".85rem", color: "#334155", lineHeight: 1.55 }}>
        After weil, place the conjugated verb at the end (weil ich krank bin / weil ich nicht kommen kann).
        For a short A1 task, shorten the introduction and prioritize all required points and the word limit.
        Use connectors naturally rather than adding extra words only to fit the template.
        An opinion essay needs no letter greeting or signature.
      </p>
      {checks.length > 0 && (
        <section aria-label="B1 opinion essay structure check" style={{ background: "#fff", borderRadius: 10, padding: 12, border: "1px solid #bfdbfe" }}>
          <strong>B1 opinion essay structure check · {checks.filter(item => item.found).length}/{checks.length} cues found</strong>
          <ul style={{ margin: "8px 0", paddingLeft: 20 }}>
            {checks.map(({label, found}) => (
              <li key={label}>{found ? "✓" : "○"} {label}</li>
            ))}
          </ul>
          <small>Guidance only: synonyms and equivalent structures can also be correct. This is not your exam score.</small>
        </section>
      )}
    </details>
  );
}
