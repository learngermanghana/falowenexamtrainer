import React, { useMemo, useState } from "react";
import WritingFeedbackCard from "./WritingFeedbackCard";

const clean = (value = "") => String(value || "").trim();

const normalizeCorrections = (items = []) =>
  (Array.isArray(items) ? items : [])
    .map((item) => ({
      wrong: clean(item?.wrong || item?.original),
      correct: clean(item?.correct || item?.corrected || item?.improved),
      reason: clean(item?.reason || item?.explanation),
    }))
    .filter((item) => item.wrong || item.correct || item.reason);

const cardStyle = {
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  borderRadius: 12,
  padding: 12,
};

export default function WritingFeedbackCardFull(props) {
  const [expanded, setExpanded] = useState(false);
  const structured =
    props?.structuredFeedback && typeof props.structuredFeedback === "object"
      ? props.structuredFeedback
      : null;
  const level = String(props?.level || "A1").toUpperCase();
  const compactCorrectionCount = ["B1", "B2", "C1"].includes(level) ? 10 : 5;

  const strengths = useMemo(
    () => (Array.isArray(structured?.strengths) ? structured.strengths.map(clean).filter(Boolean) : []),
    [structured],
  );
  const issues = useMemo(() => {
    const source = Array.isArray(structured?.mainIssues)
      ? structured.mainIssues
      : Array.isArray(structured?.areasToImprove)
        ? structured.areasToImprove
        : [];
    return source.map(clean).filter(Boolean);
  }, [structured]);
  const corrections = useMemo(
    () => normalizeCorrections(structured?.corrections),
    [structured],
  );

  const hasMore =
    strengths.length > 3 ||
    issues.length > 4 ||
    corrections.length > compactCorrectionCount ||
    corrections.some(
      (item) =>
        item.wrong.split(/\s+/).filter(Boolean).length > 18 ||
        item.correct.split(/\s+/).filter(Boolean).length > 18 ||
        item.reason.split(/\s+/).filter(Boolean).length > 28,
    );

  return (
    <div style={{ display: "grid", gap: 12 }} data-writing-feedback-full>
      <WritingFeedbackCard {...props} />

      {structured && (hasMore || corrections.length || issues.length || strengths.length) ? (
        <section style={{ ...cardStyle, display: "grid", gap: 10 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <div>
              <strong>Full AI feedback</strong>
              <div style={{ marginTop: 4, color: "#475569", fontSize: 14 }}>
                {corrections.length} correction{corrections.length === 1 ? "" : "s"} found
                {corrections.length > compactCorrectionCount
                  ? ` · ${compactCorrectionCount} shown in the summary`
                  : ""}
              </div>
            </div>
            <button type="button" onClick={() => setExpanded((value) => !value)}>
              {expanded ? "Show less" : "View full feedback"}
            </button>
          </div>

          {expanded ? (
            <div style={{ display: "grid", gap: 14 }}>
              {strengths.length ? (
                <div>
                  <strong>All strengths</strong>
                  <ul style={{ margin: "8px 0 0 18px" }}>
                    {strengths.map((item, index) => (
                      <li key={`${item}-${index}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {issues.length ? (
                <div>
                  <strong>All issues to improve</strong>
                  <ul style={{ margin: "8px 0 0 18px" }}>
                    {issues.map((item, index) => (
                      <li key={`${item}-${index}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {corrections.length ? (
                <div style={{ display: "grid", gap: 8 }}>
                  <strong>All corrections</strong>
                  {corrections.map((item, index) => (
                    <div key={`${item.wrong}-${index}`} style={{ ...cardStyle, background: "#f8fafc" }}>
                      {item.wrong ? (
                        <div><strong>Needs fix:</strong> {item.wrong}</div>
                      ) : null}
                      {item.correct ? (
                        <div style={{ marginTop: 5 }}><strong>Better:</strong> {item.correct}</div>
                      ) : null}
                      {item.reason ? (
                        <div style={{ marginTop: 5 }}><strong>Why:</strong> {item.reason}</div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}

              {structured?.improvedVersion ? (
                <div>
                  <strong>Complete improved version</strong>
                  <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>
                    {structured.improvedVersion}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
