import React from "react";
import { getReadingQualityAudit } from "../data/a2B1ReadingQualityAudit";

const shell = {
  border: "2px solid #c7d2fe",
  borderRadius: 16,
  padding: 14,
  background: "linear-gradient(135deg, #eef2ff, #ffffff)",
  display: "grid",
  gap: 10,
};

const item = {
  border: "1px solid #dbeafe",
  borderRadius: 12,
  padding: 11,
  background: "#ffffff",
  display: "grid",
  gap: 5,
  lineHeight: 1.6,
};

export default function A2B1ReadingQualityChallenge({ level, day }) {
  const audit = getReadingQualityAudit(level, day);
  if (!audit?.needsDepthCheck) return null;

  const label = "Reading upgrade";
  const intro = audit.level === "A2"
    ? "The basic questions check comprehension. Complete this short second pass so you also practise evidence, inference and distractor control at the right A2 stage."
    : "The basic questions check comprehension. Complete this second pass to practise B1 evidence, paraphrasing, inference and distractor control.";

  return (
    <section
      data-reading-quality-challenge="true"
      data-reading-quality-status={audit.status}
      data-reading-quality-phase={audit.phase}
      style={shell}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 900, color: "#4338ca", textTransform: "uppercase", letterSpacing: ".05em" }}>
            {label}
          </div>
          <h3 style={{ margin: "3px 0 0" }}>Go beyond finding the obvious answer</h3>
        </div>
        <span style={{ borderRadius: 999, padding: "5px 9px", background: "#e0e7ff", color: "#3730a3", fontSize: 12, fontWeight: 900 }}>
          No extra submission
        </span>
      </div>
      <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>{intro}</p>
      <div style={{ display: "grid", gap: 8 }}>
        {audit.prompts.map((prompt) => (
          <div key={prompt.title} style={item}>
            <strong>{prompt.title}</strong>
            <span>{prompt.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
