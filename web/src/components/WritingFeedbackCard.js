import React, { useMemo, useState } from "react";

const CEFR_EXPECTATIONS = {
  A1: "Task complete + understandable + basic accuracy",
  A2: "Task complete + understandable + basic accuracy",
  B1: "Range, coherence, grammatical control, register",
  B2: "Range, coherence, grammatical control, register",
  C1: "Range, coherence, grammatical control, register",
};

const RUBRIC_LABELS = {
  task: "Task completion",
  coherence: "Coherence",
  grammar: "Grammar",
  lexis: "Lexis",
  overall: "Overall",
};

const CORRECTION_ICONS = {
  grammar: "🧩",
  "word order": "↔️",
  spelling: "🔤",
  register: "🗣️",
};

const parseCorrectionsFromText = (feedback = "") => {
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
      category: "Grammar",
    });
    match = regex.exec(text);
  }
  return items;
};

const splitSentences = (text = "") => {
  const normalized = String(text || "").replace(/\s+/g, " ").trim();
  if (!normalized) return [];
  return normalized.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
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
  const corrections = parseCorrectionsFromText(feedback).length;
  const words = countWords(draft);
  const target = WORD_RANGE_BY_LEVEL[level] || WORD_RANGE_BY_LEVEL.A1;
  const strictness = LEVEL_STRICTNESS[level] || 1;
  const ratioToMax = words / target.max;
  const wordQuality = ratioToMax < 0.45 ? 2 : ratioToMax < 0.75 ? 3.2 : ratioToMax <= 1.2 ? 4.6 : 3.8;
  const correctionPenalty = corrections * strictness * 0.55;
  const positiveHints = ["clear", "good", "strong", "well", "excellent", "accurate"];
  const lower = String(feedback || "").toLowerCase();
  const positiveBoost = positiveHints.reduce((sum, hint) => sum + (lower.includes(hint) ? 0.2 : 0), 0);
  return clamp(Math.round((wordQuality + 3.8 + positiveBoost - correctionPenalty) * 2.5), 0, 25);
};

const stripMarkup = (text = "") =>
  String(text || "")
    .replace(/\[wrong\]/gi, "❌ ")
    .replace(/\[\/wrong\]/gi, "")
    .replace(/\[correct\]/gi, "✅ ")
    .replace(/\[\/correct\]/gi, "");

const normalizeCategory = (raw = "") => {
  const lower = String(raw || "").toLowerCase();
  if (lower.includes("order")) return "Word order";
  if (lower.includes("spell")) return "Spelling";
  if (lower.includes("register") || lower.includes("tone")) return "Register";
  return "Grammar";
};

const styles = {
  wrap: { display: "grid", gap: 12 },
  card: { border: "1px solid #cbd5e1", background: "#f8fafc", borderRadius: 12, padding: 12 },
  chip: { fontSize: 12, fontWeight: 700, padding: "3px 8px", borderRadius: 999, border: "1px solid #94a3b8" },
  correctionCard: { border: "1px solid #d1d5db", borderRadius: 12, padding: 10, background: "#ffffff" },
  wrong: { color: "#7f1d1d", background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, padding: "6px 8px" },
  correct: { color: "#14532d", background: "#dcfce7", border: "1px solid #86efac", borderRadius: 8, padding: "6px 8px" },
  pre: { whiteSpace: "pre-wrap", lineHeight: 1.5, margin: 0 },
};

const WritingFeedbackCard = ({
  feedback = "",
  level = "A1",
  draft = "",
  rubric = null,
  corrections = null,
  simplifiedFeedback = null,
  trend = null,
}) => {
  const [showSimple, setShowSimple] = useState(["A1", "A2"].includes(level));
  const fallbackEstimated = useMemo(() => estimateScore({ feedback, draft, level }), [feedback, draft, level]);
  const mappedCorrections = useMemo(() => {
    if (Array.isArray(corrections) && corrections.length) {
      return corrections.map((item) => ({
        wrong: String(item?.wrong || "").trim(),
        correct: String(item?.correct || "").trim(),
        reason: String(item?.reason || "").trim(),
        category: normalizeCategory(item?.category),
      }));
    }
    return parseCorrectionsFromText(feedback);
  }, [corrections, feedback]);

  const resolvedRubric = useMemo(() => {
    if (rubric && typeof rubric === "object") return rubric;
    return {
      task: 0,
      coherence: 0,
      grammar: 0,
      lexis: 0,
      overall: fallbackEstimated,
      maxScore: 25,
      source: "heuristic",
    };
  }, [rubric, fallbackEstimated]);

  const readableFeedback = useMemo(() => stripMarkup(feedback), [feedback]);
  const fallbackSimple = useMemo(() => {
    const sentences = splitSentences(readableFeedback);
    return {
      topFixes: mappedCorrections.slice(0, 3).map((item) => `${item.wrong} → ${item.correct}`),
      strengths: sentences.filter((line) => /good|clear|strong|excellent|well/i.test(line)).slice(0, 2),
      nextAction: sentences.find((line) => /next improvement task|next action|focus on|improve/i.test(line)) || "Fix the top 3 errors, then rewrite one paragraph.",
    };
  }, [mappedCorrections, readableFeedback]);

  const simple = simplifiedFeedback || fallbackSimple;

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={{ fontWeight: 700 }}>What this level expects ({level})</div>
        <div style={{ marginTop: 4, fontSize: 13 }}>{CEFR_EXPECTATIONS[level] || CEFR_EXPECTATIONS.A1}</div>
      </div>

      <div style={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <strong>Score rubric ({resolvedRubric.overall || 0}/{resolvedRubric.maxScore || 25})</strong>
          {resolvedRubric.source === "heuristic" ? <span style={styles.chip}>Fallback estimate</span> : <span style={styles.chip}>Backend rubric</span>}
        </div>
        <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
          {Object.entries(RUBRIC_LABELS).map(([key, label]) => (
            <div key={key} style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
              <span>{label}</span>
              <strong>{Number(resolvedRubric[key] || 0)}</strong>
            </div>
          ))}
        </div>
      </div>

      {trend?.firstDraft ? (
        <div style={styles.card}>
          <strong>First draft vs improved draft</strong>
          <div style={{ marginTop: 6 }}>Score delta: {trend.firstDraft.overall} → {trend.improvedDraft?.overall || 0} ({trend.delta >= 0 ? "+" : ""}{trend.delta})</div>
          <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {(trend?.changes || []).map((chip) => <span key={chip} style={styles.chip}>{chip}</span>)}
          </div>
        </div>
      ) : null}

      {mappedCorrections.length ? (
        <div style={{ display: "grid", gap: 8 }}>
          <strong>Corrections (❌ Needs fix / ✅ Better)</strong>
          {mappedCorrections.map((item, index) => {
            const category = item.category || "Grammar";
            const icon = CORRECTION_ICONS[category.toLowerCase()] || "🧩";
            return (
              <div key={`${item.wrong}-${index}`} style={styles.correctionCard}>
                <div style={{ marginBottom: 6, fontWeight: 700 }}>{icon} {category}</div>
                <div style={styles.wrong}><strong>❌ Needs fix:</strong> {item.wrong}</div>
                <div style={{ height: 6 }} />
                <div style={styles.correct}><strong>✅ Better:</strong> {item.correct}</div>
                {item.reason ? <div style={{ marginTop: 6, fontSize: 14 }}><strong>Why:</strong> {item.reason}</div> : null}
              </div>
            );
          })}
        </div>
      ) : null}

      <div style={styles.card}>
        <label style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 700 }}>
          <input type="checkbox" checked={showSimple} onChange={() => setShowSimple((prev) => !prev)} />
          Show simplified feedback
        </label>
        {showSimple ? (
          <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
            <div><strong>Top 3 fixes</strong><ul>{(simple?.topFixes || []).slice(0, 3).map((item, idx) => <li key={`${item}-${idx}`}>{item}</li>)}</ul></div>
            <div><strong>Best 2 strengths</strong><ul>{(simple?.strengths || []).slice(0, 2).map((item, idx) => <li key={`${item}-${idx}`}>{item}</li>)}</ul></div>
            <div><strong>Next action</strong><div>{simple?.nextAction || "Revise and submit your improved draft."}</div></div>
          </div>
        ) : (
          <pre style={styles.pre}>{readableFeedback}</pre>
        )}
      </div>
    </div>
  );
};

export default WritingFeedbackCard;
