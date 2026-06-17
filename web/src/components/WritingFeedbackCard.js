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
const countWords = (value = "") =>
  (String(value || "").trim().match(/\S+/g) || []).length;

const cleanTags = (text = "") =>
  String(text || "")
    .replace(/\[\/?wrong\]/gi, "")
    .replace(/\[\/?correct\]/gi, "")
    .replace(/```(?:json)?/gi, "")
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

  return correctionLines
    .map((line) => {
      const [wrong, rightAndReason] = line.split(/→|->/);
      const [correct, reason] = String(rightAndReason || "").split(/\s+[–-]\s+/);
      return {
        wrong: (wrong || "").trim(),
        correct: (correct || "").trim(),
        reason: (reason || "Use the corrected form for accuracy.").trim(),
      };
    })
    .filter((item) => item.wrong && item.correct);
};

const extractScoreFromFeedback = (feedback = "", maxScore = 25) => {
  const text = String(feedback || "");
  const patterns = [
    /score\s*:\s*(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/i,
    /score\s*:\s*(\d+(?:\.\d+)?)\s*\//i,
    /(\d+(?:\.\d+)?)\s*out\s+of\s+(\d+(?:\.\d+)?)/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match) continue;
    const score = Number(match[1]);
    const max = match[2] ? Number(match[2]) : maxScore;
    if (Number.isFinite(score) && Number.isFinite(max) && max > 0) {
      return clamp(Math.round((score / max) * maxScore), 0, maxScore);
    }
  }
  return null;
};

const rubricScore = (value) => {
  const candidate =
    value && typeof value === "object" && !Array.isArray(value)
      ? value.score ?? value.value
      : value;
  const parsed = Number(candidate);
  return Number.isFinite(parsed) ? parsed : 0;
};

const rubricMaximum = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return 0;
  const parsed = Number(value.maxScore ?? value.max_score ?? value.max);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toSimpleFeedback = (
  raw = "",
  mappedCorrections = [],
  simplifiedFeedback = null,
) => {
  const clean = stripMarkdownSections(raw);
  const sentencePool = clean
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const strengthsFromSimple = (simplifiedFeedback?.strengths || [])
    .map(stripMarkdownSections)
    .filter(Boolean);
  const fixesFromSimple = (simplifiedFeedback?.topFixes || [])
    .map(stripMarkdownSections)
    .filter(Boolean);

  const strengths = strengthsFromSimple.length
    ? strengthsFromSimple.slice(0, 2)
    : sentencePool
        .filter((line) => /good|clear|strong|well|accurate|effective/i.test(line))
        .slice(0, 2);

  const corrections = mappedCorrections.length
    ? mappedCorrections.slice(0, 4)
    : fixesFromSimple.slice(0, 4).map((line) => {
        const [wrong, correct] = line
          .split(/→|->/)
          .map((part) => (part || "").trim());
        return {
          wrong: wrong || "Review this phrase",
          correct: correct || "Use the correct form",
          reason: "Keep this sentence clear and correct.",
        };
      });

  const nextAction = stripMarkdownSections(
    simplifiedFeedback?.nextAction ||
      "Rewrite 2 sentences using the corrections above.",
  );

  return {
    strengths: strengths.length
      ? strengths
      : ["You answered the task and your message is understandable."],
    corrections,
    nextAction,
  };
};

const styles = {
  wrap: { display: "grid", gap: 12 },
  card: {
    border: "1px solid #cbd5e1",
    background: "#f8fafc",
    borderRadius: 12,
    padding: 12,
  },
  correctionCard: {
    border: "1px solid #d1d5db",
    borderRadius: 12,
    padding: 10,
    background: "#ffffff",
  },
  wrong: {
    color: "#7f1d1d",
    background: "#fee2e2",
    border: "1px solid #fca5a5",
    borderRadius: 8,
    padding: "6px 8px",
  },
  correct: {
    color: "#14532d",
    background: "#dcfce7",
    border: "1px solid #86efac",
    borderRadius: 8,
    padding: "6px 8px",
  },
};

const WritingFeedbackCard = ({
  feedback = "",
  level = "A1",
  rubric = null,
  corrections = null,
  simplifiedFeedback = null,
  structuredFeedback = null,
}) => {
  const [copyState, setCopyState] = useState("");
  const structured =
    structuredFeedback && typeof structuredFeedback === "object"
      ? structuredFeedback
      : null;
  const structuredCorrections = Array.isArray(structured?.corrections)
    ? structured.corrections
    : corrections;

  const mappedCorrections = useMemo(() => {
    if (Array.isArray(structuredCorrections) && structuredCorrections.length) {
      return structuredCorrections
        .map((item) => ({
          wrong: cleanTags(item?.wrong || item?.original || ""),
          correct: cleanTags(
            item?.correct || item?.corrected || item?.improved || "",
          ),
          reason:
            cleanTags(item?.reason || item?.explanation || "") ||
            "Use the corrected form for accuracy.",
        }))
        .filter(
          (item) =>
            item.wrong &&
            item.correct &&
            item.wrong.trim().toLowerCase() !==
              item.correct.trim().toLowerCase(),
        )
        .filter(
          (item) =>
            countWords(item.wrong) <= 18 &&
            countWords(item.correct) <= 18 &&
            countWords(item.reason) <= 20,
        )
        .slice(0, 5);
    }
    return parseCorrectionsFromText(feedback)
      .filter(
        (item) =>
          item.wrong.trim().toLowerCase() !==
          item.correct.trim().toLowerCase(),
      )
      .slice(0, 5);
  }, [structuredCorrections, feedback]);

  const activeRubric = structured?.rubric || rubric || {};
  const maxScore = useMemo(() => {
    const structuredMax = Number(structured?.maxScore);
    if (Number.isFinite(structuredMax) && structuredMax > 0) return structuredMax;
    const overallMax = rubricMaximum(activeRubric?.overall);
    return overallMax > 0 ? overallMax : 25;
  }, [activeRubric, structured]);

  const overall = useMemo(() => {
    const fromStructuredScore = Number(structured?.score ?? 0);
    if (Number.isFinite(fromStructuredScore) && fromStructuredScore > 0) {
      return fromStructuredScore;
    }

    const fromStructuredRubric = rubricScore(structured?.rubric?.overall);
    if (fromStructuredRubric > 0) return fromStructuredRubric;

    const fromRubric = rubricScore(rubric?.overall);
    if (fromRubric > 0) return fromRubric;

    return extractScoreFromFeedback(feedback, maxScore) ?? 0;
  }, [structured, rubric, feedback, maxScore]);

  const summary = stripMarkdownSections(structured?.summary || "");
  const strengths = Array.isArray(structured?.strengths)
    ? structured.strengths.map(stripMarkdownSections).filter(Boolean)
    : [];
  const structuredIssues = Array.isArray(structured?.mainIssues)
    ? structured.mainIssues
    : Array.isArray(structured?.areasToImprove)
      ? structured.areasToImprove
      : [];
  const mainIssues = structuredIssues
    .map(stripMarkdownSections)
    .filter(Boolean);
  const improvedVersion = stripMarkdownSections(
    structured?.improvedVersion || "",
  );
  const nextTask = stripMarkdownSections(structured?.nextTask || "");
  const simple = useMemo(() => {
    if (structured) {
      return {
        strengths: strengths.length
          ? strengths
          : [
              summary ||
                "You answered the task and your message is understandable.",
            ],
        corrections: mappedCorrections,
        nextAction:
          nextTask ||
          simplifiedFeedback?.nextAction ||
          "Rewrite 2 sentences using the corrections above.",
      };
    }
    return toSimpleFeedback(feedback, mappedCorrections, simplifiedFeedback);
  }, [
    feedback,
    mappedCorrections,
    simplifiedFeedback,
    structured,
    strengths,
    summary,
    nextTask,
  ]);

  const handleCopy = async () => {
    const text = [
      "AI Feedback",
      `Score: ${overall}/${maxScore}`,
      "",
      "What you did well",
      ...simple.strengths.slice(0, 3).map((item) => `- ${item}`),
      "",
      "Main issues",
      ...(mainIssues.length
        ? mainIssues.slice(0, 3).map((item) => `- ${item}`)
        : ["- None listed."]),
      "",
      "Fix these mistakes",
      ...simple.corrections
        .slice(0, 4)
        .flatMap((item) => [
          `- ❌ Needs fix: ${item.wrong}`,
          `  ✅ Better: ${item.correct}`,
          `  Why: ${item.reason}`,
        ]),
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
    } catch (error) {
      setCopyState("Could not copy feedback right now.");
    }
  };

  return (
    <div style={styles.wrap} data-writing-feedback-card>
      <div style={styles.card}>
        <strong>AI Feedback</strong>
        <div style={{ marginTop: 4, fontWeight: 700 }}>
          Score: {overall}/{maxScore}
        </div>
      </div>

      {summary ? (
        <div style={styles.card}>
          <strong>Short summary</strong>
          <div style={{ marginTop: 6 }}>{summary}</div>
        </div>
      ) : null}

      <div style={styles.card}>
        <strong>Strengths</strong>
        <ul style={{ margin: "8px 0 0 18px" }}>
          {simple.strengths.slice(0, 3).map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      </div>

      {mainIssues.length ? (
        <div style={styles.card}>
          <strong>Main issues</strong>
          <ul style={{ margin: "8px 0 0 18px" }}>
            {mainIssues.slice(0, 4).map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div style={styles.card}>
        <strong>Corrections</strong>
        <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
          {simple.corrections.length ? (
            simple.corrections.slice(0, 5).map((item, index) => (
              <div key={`${item.wrong}-${index}`} style={styles.correctionCard}>
                <div style={styles.wrong}>
                  <strong>❌ Needs fix:</strong> {item.wrong}
                </div>
                <div style={{ height: 6 }} />
                <div style={styles.correct}>
                  <strong>✅ Better:</strong> {item.correct}
                </div>
                <div style={{ marginTop: 6, fontSize: 14 }}>
                  <strong>Why:</strong> {item.reason}
                </div>
              </div>
            ))
          ) : (
            <div>No correction needed.</div>
          )}
        </div>
      </div>

      {improvedVersion ? (
        <div style={styles.card}>
          <strong>Improved version</strong>
          <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>
            {improvedVersion}
          </div>
        </div>
      ) : null}

      <div style={styles.card}>
        <strong>Next task</strong>
        <div style={{ marginTop: 6 }}>- {simple.nextAction}</div>
      </div>

      <div style={styles.card}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <strong>Compact score rubric</strong>
          <button type="button" onClick={handleCopy}>
            Copy feedback
          </button>
        </div>
        {copyState ? (
          <div style={{ marginTop: 6, fontSize: 13 }}>{copyState}</div>
        ) : null}
        <div
          style={{
            marginTop: 8,
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 8,
            fontSize: 13,
          }}
        >
          {Object.entries(RUBRIC_LABELS).map(([key, label]) => {
            const criterion = activeRubric?.[key];
            const score = rubricScore(criterion);
            const maximum = rubricMaximum(criterion);
            return (
              <div
                key={key}
                style={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: "6px 8px",
                }}
              >
                <div>{label}</div>
                <strong>
                  {score}
                  {maximum > 0 ? `/${maximum}` : ""}
                </strong>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: "#475569" }}>
          Level focus ({level}): {CEFR_EXPECTATIONS[level] || CEFR_EXPECTATIONS.A1}
        </div>
      </div>
    </div>
  );
};

export default WritingFeedbackCard;
