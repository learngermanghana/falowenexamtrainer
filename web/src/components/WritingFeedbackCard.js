import React, { useMemo } from "react";

const parseCorrections = (feedback = "") => {
  const text = String(feedback || "");
  if (!text.includes("[wrong]") || !text.includes("[correct]")) return [];

  const regex = /\[wrong\]([\s\S]*?)\[\/wrong\]\s*→\s*\[correct\]([\s\S]*?)\[\/correct\](?:\s*—\s*Reason:\s*([\s\S]*?))?(?=(?:\n\s*\d+\.|\n\s*[-*]\s|\n\s*\[wrong\]|$))/gi;
  const items = [];
  let match = regex.exec(text);
  while (match) {
    items.push({
      wrong: (match[1] || "").trim().replace(/^"|"$/g, ""),
      correct: (match[2] || "").trim().replace(/^"|"$/g, ""),
      reason: (match[3] || "").trim(),
    });
    match = regex.exec(text);
  }
  return items;
};

const countWords = (value = "") => {
  const trimmed = String(value || "").trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
};

const WORD_RANGE_BY_LEVEL = {
  A1: { min: 20, max: 50 },
  A2: { min: 50, max: 80 },
  B1: { min: 80, max: 120 },
  B2: { min: 120, max: 180 },
  C1: { min: 180, max: 220 },
};

const LEVEL_STRICTNESS = {
  A1: 0.55,
  A2: 0.7,
  B1: 0.9,
  B2: 1.05,
  C1: 1.2,
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const estimateScore = ({ feedback = "", draft = "", level = "A1" }) => {
  const corrections = parseCorrections(feedback).length;
  const words = countWords(draft);
  const target = WORD_RANGE_BY_LEVEL[level] || WORD_RANGE_BY_LEVEL.A1;
  const strictness = LEVEL_STRICTNESS[level] || 1;

  const ratioToMax = words / target.max;
  const wordQuality = ratioToMax < 0.45 ? 2 : ratioToMax < 0.75 ? 3.2 : ratioToMax <= 1.2 ? 4.6 : 3.8;
  const correctionPenalty = corrections * strictness * 0.55;

  const positiveHints = ["clear", "good", "strong", "well", "excellent", "accurate"];
  const lower = String(feedback || "").toLowerCase();
  const positiveBoost = positiveHints.reduce((sum, hint) => sum + (lower.includes(hint) ? 0.2 : 0), 0);

  const total = clamp(Math.round((wordQuality + 3.8 + positiveBoost - correctionPenalty) * 2.5), 0, 25);
  return total;
};

const stripMarkup = (text = "") =>
  String(text || "")
    .replace(/\[wrong\]/gi, "❌ ")
    .replace(/\[\/wrong\]/gi, "")
    .replace(/\[correct\]/gi, "✅ ")
    .replace(/\[\/correct\]/gi, "");

const styles = {
  wrap: { display: "grid", gap: 12 },
  scoreCard: { border: "1px solid #dbeafe", background: "#eff6ff", borderRadius: 12, padding: 12 },
  correctionCard: { border: "1px solid #e5e7eb", borderRadius: 12, padding: 10, background: "#f9fafb" },
  row: { display: "grid", gap: 6 },
  wrong: { color: "#b91c1c", background: "#fee2e2", borderRadius: 8, padding: "6px 8px" },
  correct: { color: "#166534", background: "#dcfce7", borderRadius: 8, padding: "6px 8px" },
  reason: { color: "#374151", fontSize: 14 },
  pre: { whiteSpace: "pre-wrap", lineHeight: 1.5, margin: 0 },
};

const WritingFeedbackCard = ({ feedback = "", level = "A1", draft = "" }) => {
  const corrections = useMemo(() => parseCorrections(feedback), [feedback]);
  const estimatedScore = useMemo(() => estimateScore({ feedback, draft, level }), [feedback, draft, level]);
  const readableFeedback = useMemo(() => stripMarkup(feedback), [feedback]);

  return (
    <div style={styles.wrap}>
      <div style={styles.scoreCard}>
        <strong>Level-adjusted estimated score: {estimatedScore}/25</strong>
        <div style={{ marginTop: 4, fontSize: 13, color: "#1e3a8a" }}>
          Uses your selected level ({level}), word target, and number of corrections.
        </div>
      </div>

      {corrections.length ? (
        <div style={{ display: "grid", gap: 8 }}>
          <strong>Word and phrase corrections</strong>
          {corrections.map((item, index) => (
            <div key={`${item.wrong}-${index}`} style={styles.correctionCard}>
              <div style={styles.row}>
                <div style={styles.wrong}><strong>Needs fix:</strong> {item.wrong}</div>
                <div style={styles.correct}><strong>Better:</strong> {item.correct}</div>
                {item.reason ? <div style={styles.reason}><strong>Why:</strong> {item.reason}</div> : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <pre style={styles.pre}>{readableFeedback}</pre>
    </div>
  );
};

export default WritingFeedbackCard;
