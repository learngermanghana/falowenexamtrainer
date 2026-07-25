import React, { useMemo } from "react";
import {
  applyLiveWritingSuggestion,
  findLiveGermanWritingIssues,
} from "../lib/liveGermanWritingChecks";

const COLORS = {
  capitalization: { background: "#fef3c7", border: "#f59e0b", label: "Capital letter" },
  "adjective-ending": { background: "#ede9fe", border: "#7c3aed", label: "Adjective ending" },
};

const buildSegments = (text, issues) => {
  const segments = [];
  let cursor = 0;
  issues.forEach((issue) => {
    if (issue.start < cursor) return;
    if (issue.start > cursor) segments.push({ text: text.slice(cursor, issue.start) });
    segments.push({ text: text.slice(issue.start, issue.end), issue });
    cursor = issue.end;
  });
  if (cursor < text.length) segments.push({ text: text.slice(cursor) });
  return segments;
};

const LiveGermanWritingCoach = ({ text, onChange }) => {
  const issues = useMemo(() => findLiveGermanWritingIssues(text), [text]);
  const segments = useMemo(() => buildSegments(text, issues), [issues, text]);

  return (
    <section
      aria-label="Live writing coach"
      style={{ marginTop: 12, border: "1px solid #cbd5e1", borderRadius: 12, padding: 12, background: "#f8fafc" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <strong>Live writing coach</strong>
        <span aria-live="polite" style={{ color: issues.length ? "#9a3412" : "#15803d", fontWeight: 700 }}>
          {issues.length ? `${issues.length} possible ${issues.length === 1 ? "fix" : "fixes"}` : "No common issues spotted"}
        </span>
      </div>
      <p style={{ color: "#475569", fontSize: 14, margin: "6px 0 10px" }}>
        Words are checked locally as you type. Yellow marks capitalization; purple marks adjective endings. Full AI feedback still checks context.
      </p>

      {text.trim() && (
        <div
          data-live-writing-preview="true"
          style={{ whiteSpace: "pre-wrap", lineHeight: 1.8, padding: 10, borderRadius: 8, background: "#fff", border: "1px solid #e2e8f0" }}
        >
          {segments.map((segment, index) => segment.issue ? (
            <mark
              key={`${segment.issue.id}-${index}`}
              title={segment.issue.message}
              style={{ background: COLORS[segment.issue.type].background, borderBottom: `2px solid ${COLORS[segment.issue.type].border}`, borderRadius: 3 }}
            >
              {segment.text}
            </mark>
          ) : <React.Fragment key={`text-${index}`}>{segment.text}</React.Fragment>)}
        </div>
      )}

      {issues.length > 0 && (
        <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
          {issues.slice(0, 5).map((issue) => (
            <div key={issue.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 14 }}>
                <strong style={{ color: COLORS[issue.type].border }}>{COLORS[issue.type].label}:</strong>{" "}
                <s>{issue.word}</s> → <strong>{issue.suggestion}</strong>. {issue.message}
              </span>
              <button
                type="button"
                onClick={() => onChange(applyLiveWritingSuggestion(text, issue))}
                style={{ border: `1px solid ${COLORS[issue.type].border}`, borderRadius: 8, padding: "6px 10px", background: "#fff", color: "#1e293b", cursor: "pointer", fontWeight: 700 }}
                aria-label={`Replace ${issue.word} with ${issue.suggestion}`}
              >
                Apply fix
              </button>
            </div>
          ))}
          {issues.length > 5 && <small>Fix the first suggestions to reveal the remaining hints.</small>}
        </div>
      )}
    </section>
  );
};

export default LiveGermanWritingCoach;

