import React, { useMemo, useState } from "react";

const CEFR_EXPECTATIONS = {
  A1: "Task complete + understandable + basic accuracy",
  A2: "Task complete + understandable + basic accuracy",
  B1: "Range, coherence, grammatical control, register",
  B2: "Range, coherence, grammatical control, register",
  C1: "Range, coherence, grammatical control, register",
};

const RUBRIC_LABELS = {
  task: "Task",
  coherence: "Coherence",
  grammar: "Grammar",
  lexis: "Lexis",
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const countWords = (value = "") => (String(value || "").trim().match(/\S+/g) || []).length;

const cleanTags = (text = "") =>
  String(text || "")
    .replace(/\[\/?wrong\]/gi, "")
    .replace(/\[\/?correct\]/gi, "")
    .replace(/\r/g, "")
    .trim();

const stripMarkdownSections = (text = "") =>
  cleanTags(text)
    .replace(/\*\*(Grammar|Good|Needs Improvement)\s*:\s*\*\*/gi, "")
    .replace(/^\s*#{1,6}\s*Strengths and Weaknesses\s*$/gim, "")
    .replace(/^\s*#{1,6}\s*(Grammar|Good|Needs Improvement)\s*:?\s*$/gim, "")
    .replace(/\*\*/g, "")
    .trim();

const parseCorrectionsFromText = (feedback = "") => {
  const text = cleanTags(feedback);
  const correctionLines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /→|->/.test(line))
    .slice(0, 8);

  return correctionLines.map((line) => {
    const [wrong, rightAndReason] = line.split(/→|->/);
    const [correct, reason] = String(rightAndReason || "").split(/\s+[–-]\s+/);
    return {
      wrong: (wrong || "").trim(),
      correct: (correct || "").trim(),
      reason: (reason || "Use the corrected form for accuracy.").trim(),
    };
  }).filter((item) => item.wrong && item.correct);
};

const extractScoreFromFeedback = (feedback = "", maxScore = 25) => {
  const text = String(feedback || "");
  const slashMatch = text.match(/score\s*:\s*(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/i);
  if (slashMatch) {
    const score = Number(slashMatch[1]);
    const max = Number(slashMatch[2]);
    if (Number.isFinite(score) && Number.isFinite(max) && max > 0) {
      return clamp(Math.round((score / max) * maxScore), 0, maxScore);
    }
  }
  return null;
};

const toSimpleFeedback = (raw = "", mappedCorrections = [], simplifiedFeedback = null) => {
  const clean = stripMarkdownSections(raw);
  const sentencePool = clean.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const strengthsFromSimple = (simplifiedFeedback?.strengths || []).map(stripMarkdownSections).filter(Boolean);
  const fixesFromSimple = (simplifiedFeedback?.topFixes || []).map(stripMarkdownSections).filter(Boolean);

  const strengths = strengthsFromSimple.length
    ? strengthsFromSimple.slice(0, 2)
    : sentencePool.filter((line) => /good|clear|strong|well|accurate|effective/i.test(line)).slice(0, 2);

  const corrections = mappedCorrections.length
    ? mappedCorrections.slice(0, 4)
    : fixesFromSimple.slice(0, 4).map((line) => {
      const [wrong, correct] = line.split(/→|->/).map((part) => (part || "").trim());
      return {
        wrong: wrong || "Review this phrase",
        correct: correct || "Use the correct form",
        reason: "Keep this sentence clear and correct.",
      };
    });

  const nextAction = stripMarkdownSections(simplifiedFeedback?.nextAction || "Rewrite 2 sentences using the corrections above.");

  return {
    strengths: strengths.length ? strengths : ["You answered the task and your message is understandable."],
    corrections,
    nextAction,
  };
};

const styles = {
  wrap: { display: "grid", gap: 12 },
  card: { border: "1px solid #cbd5e1", background: "#f8fafc", borderRadius: 12, padding: 12 },
  correctionCard: { border: "1px solid #d1d5db", borderRadius: 12, padding: 10, background: "#ffffff" },
  wrong: { color: "#7f1d1d", background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, padding: "6px 8px" },
  correct: { color: "#14532d", background: "#dcfce7", border: "1px solid #86efac", borderRadius: 8, padding: "6px 8px" },
};

const WritingFeedbackCard = ({
  feedback = "",
  level = "A1",
  rubric = null,
  corrections = null,
  simplifiedFeedback = null,
}) => {
  const [copyState, setCopyState] = useState("");
  const mappedCorrections = useMemo(() => {
    if (Array.isArray(corrections) && corrections.length) {
      return corrections
        .map((item) => ({
          wrong: cleanTags(item?.wrong || ""),
          correct: cleanTags(item?.correct || ""),
          reason: cleanTags(item?.reason || "") || "Use the corrected form for accuracy.",
        }))
        .filter((item) => item.wrong && item.correct)
        .filter((item) => countWords(item.wrong) <= 18 && countWords(item.correct) <= 18 && countWords(item.reason) <= 20)
        .slice(0, 4);
    }
    return parseCorrectionsFromText(feedback).slice(0, 4);
  }, [corrections, feedback]);

  const overall = useMemo(() => {
    const fromRubric = Number(rubric?.overall || 0);
    if (fromRubric > 0) return fromRubric;
    return extractScoreFromFeedback(feedback, 25) ?? 0;
  }, [rubric, feedback]);

  const simple = useMemo(() => toSimpleFeedback(feedback, mappedCorrections, simplifiedFeedback), [feedback, mappedCorrections, simplifiedFeedback]);

  const handleCopy = async () => {
    const text = [
      `AI Feedback`,
      `Score: ${overall}/25`,
      "",
      "What you did well",
      ...simple.strengths.slice(0, 2).map((s) => `- ${s}`),
      "",
      "Fix these mistakes",
      ...simple.corrections.slice(0, 4).flatMap((c) => [`- ❌ Needs fix: ${c.wrong}`, `  ✅ Better: ${c.correct}`, `  Why: ${c.reason}`]),
      "",
      "Next action",
      `- ${simple.nextAction}`,
    ].join("\n");

    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
      setCopyState("Copy is unavailable in this browser.");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopyState("Clean feedback copied.");
      window.setTimeout(() => setCopyState(""), 2000);
    } catch (e) {
      setCopyState("Could not copy feedback right now.");
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <strong>AI Feedback</strong>
        <div style={{ marginTop: 4, fontWeight: 700 }}>Score: {overall}/25</div>
      </div>

      <div style={styles.card}>
        <strong>What you did well</strong>
        <ul style={{ margin: "8px 0 0 18px" }}>
          {simple.strengths.slice(0, 2).map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
        </ul>
      </div>

      <div style={styles.card}>
        <strong>Fix these mistakes</strong>
        <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
          {simple.corrections.slice(0, 4).map((item, index) => (
            <div key={`${item.wrong}-${index}`} style={styles.correctionCard}>
              <div style={styles.wrong}><strong>❌ Needs fix:</strong> {item.wrong}</div>
              <div style={{ height: 6 }} />
              <div style={styles.correct}><strong>✅ Better:</strong> {item.correct}</div>
              <div style={{ marginTop: 6, fontSize: 14 }}><strong>Why:</strong> {item.reason}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.card}>
        <strong>Next action</strong>
        <div style={{ marginTop: 6 }}>- {simple.nextAction}</div>
      </div>

      <div style={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <strong>Compact score rubric</strong>
          <button type="button" onClick={handleCopy}>Copy feedback</button>
        </div>
        {copyState ? <div style={{ marginTop: 6, fontSize: 13 }}>{copyState}</div> : null}
        <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8, fontSize: 13 }}>
          {Object.entries(RUBRIC_LABELS).map(([key, label]) => (
            <div key={key} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 8px" }}>
              <div>{label}</div>
              <strong>{Number(rubric?.[key] || 0)}</strong>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: "#475569" }}>Level focus ({level}): {CEFR_EXPECTATIONS[level] || CEFR_EXPECTATIONS.A1}</div>
      </div>

    </div>
  );
};

export default WritingFeedbackCard;
