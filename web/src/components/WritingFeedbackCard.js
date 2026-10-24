import WritingMistakeList from "./WritingMistakeList";
import React, { useMemo, useState } from "react";

const CEFR_EXPECTATIONS = {
  A1: "Task complete + understandable + basic accuracy",
  A2: "Task complete + understandable + basic accuracy",
  B1: "Range, coherence, grammatical control, register",
  B2: "Range, coherence, grammatical control, register",
  C1: "Range, coherence, grammatical control, register",
  C2: "Nuance, precision, cohesion, register flexibility, grammatical control",
};

const RUBRIC_LABELS = {
  task: "Task",
  coherence: "Coherence",
  grammar: "Grammar",
  lexis: "Lexis",
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

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
    .filter((line) => /→|->/.test(line));

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
    ? mappedCorrections
    : fixesFromSimple.map((line) => {
        const [wrong, correct] = line
          .split(/→|->/)
          .map((part) => (part || "").trim());
        return {
          wrong,
          correct,
          reason: "Keep this sentence clear and correct.",
        };
      }).filter(item => item.wrong && item.correct && item.wrong !== item.correct);

  const nextAction = stripMarkdownSections(
    simplifiedFeedback?.nextAction ||
      (mappedCorrections.length ? "Start with the first correction and apply the same rule to similar sentences." : "Review the task feedback and any optional suggestions."),
  );

  return {
    strengths: strengths.length
      ? strengths
      : ["No specific strength was provided in this assessment."],
    corrections,
    nextAction,
  };
};

const styles = {
  wrap: { display: "grid", gap: 12 },
  card: {
    minWidth: 0,
    overflowWrap: "anywhere",
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
    overflowWrap: "anywhere",
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
  const normalizedLevel = String(level || "A1").toUpperCase();
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
        .map((item) => {
          const category = cleanTags(item?.category || "");
          const reason = cleanTags(item?.reason || item?.explanation || "");
          return {
            wrong: cleanTags(item?.wrong || item?.original || item?.from || ""),
            correct: cleanTags(
              item?.correct || item?.corrected || item?.improved || item?.to || "",
            ),
            category,
            reason: reason || "No explanation was provided for this correction.",
          };
        })
        .filter(
          (item) =>
            item.wrong &&
            item.correct &&
            item.wrong.trim() !== item.correct.trim(),
        );
    }
    return parseCorrectionsFromText(feedback)
      .filter(
        (item) =>
          item.wrong.trim() !== item.correct.trim(),
      );
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
              "No specific strength was provided in this assessment.",
            ],
        corrections: mappedCorrections,
        nextAction:
          nextTask ||
          simplifiedFeedback?.nextAction ||
          (mappedCorrections.length ? "Start with the first correction and apply the same rule to similar sentences." : "Review the task feedback and any optional suggestions."),
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

  const taskPoints = Array.isArray(structured?.taskPoints) ? structured.taskPoints : [];
  const optionalImprovements = Array.isArray(structured?.optionalImprovements)
    ? structured.optionalImprovements.map(stripMarkdownSections).filter(Boolean) : [];

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
        ? mainIssues.slice(0, 4).map((item) => `- ${item}`)
        : ["- None listed."]),
      "",
      "Fix these mistakes",
      ...simple.corrections
        .flatMap((item) => [
          `- You wrote: ${item.wrong}`,
          `  Correct: ${item.correct}`,
          `  Why: ${item.reason}`,
        ]),
      "",
      "Task points",
      ...taskPoints.map(point => `- ${point.label}: ${point.status}. ${point.evidence || ""} ${point.reason || ""}`),
      "",
      "Optional style improvements",
      ...optionalImprovements.map(item => `- ${item}`),
      "",
      "Main priority",
      `- ${simple.nextAction}`,
      ...(improvedVersion ? ["", "Corrected draft", improvedVersion] : []),
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

      <section style={styles.card} aria-label="Quick overview">
        <h3 style={{margin:0}}>Quick overview</h3>
        {summary ? <p>{summary}</p> : null}
        <strong>What you did well</strong>
        <ul>{simple.strengths.slice(0, 2).map((item,index)=><li key={index}>{item}</li>)}</ul>
        {mainIssues.length ? <p><strong>Main issue:</strong> {mainIssues[0]}</p> : null}
      </section>

      <WritingMistakeList corrections={simple.corrections} level={normalizedLevel}/>

      {taskPoints.length ? <section style={styles.card} aria-label="Task points">
        <h3 style={{margin:0}}>Task points</h3>
        <div style={{display:"grid",gap:10,marginTop:12}}>{taskPoints.map((point,index)=><article key={index} style={styles.correctionCard}>
          <strong>{point.label}</strong><p><strong>{({met:"Answered",partial:"Partly answered",missing:"Missing"})[point.status] || "Review"}</strong></p>
          {point.evidence ? <p><strong>Your evidence:</strong> {point.evidence}</p> : null}
          {point.reason ? <p>{point.reason}</p> : null}
        </article>)}</div>
      </section> : null}

      <section style={styles.card} aria-label="Main priority">
        <h3 style={{margin:0}}>Main priority · fix this first</h3><p>{simple.nextAction}</p>
      </section>

      {optionalImprovements.length ? <section style={styles.card} aria-label="Optional improvements">
        <h3 style={{margin:0}}>Optional style improvements</h3><p>These are suggestions, not language mistakes.</p>
        <ul>{optionalImprovements.map((item,index)=><li key={index}>{item}</li>)}</ul>
      </section> : null}

      {mainIssues.length > 1 ? <details style={styles.card}><summary style={{cursor:"pointer",fontWeight:700}}>More feedback on your writing</summary><ul>{mainIssues.slice(1).map((item,index)=><li key={index}>{item}</li>)}</ul></details> : null}
      {improvedVersion ? <details style={styles.card}>
        <summary style={{cursor:"pointer",fontWeight:700}}>Corrected draft · compare after reviewing your mistakes</summary>
        <div style={{marginTop:12,whiteSpace:"pre-wrap"}}>{improvedVersion}</div>
      </details> : null}

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
            gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
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
          Level focus ({normalizedLevel}): {CEFR_EXPECTATIONS[normalizedLevel] || CEFR_EXPECTATIONS.A1}
        </div>
      </div>
    </div>
  );
};

export default WritingFeedbackCard;
