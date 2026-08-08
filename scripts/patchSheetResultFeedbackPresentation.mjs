import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const resultHistoryPath = path.join(repositoryRoot, "web/src/components/ResultHistory.js");
let source = fs.readFileSync(resultHistoryPath, "utf8");

const replaceOnce = (before, after, label) => {
  if (source.includes(after)) return;
  if (!source.includes(before)) {
    throw new Error(`Sheet result feedback patch anchor missing: ${label}`);
  }
  source = source.replace(before, after);
};

replaceOnce(
  `const getNextStep = (item = {}) => {
  if (item.numericScore < PASS_MARK) {
    return "Revise the correction points, practise the weak area, then submit an improved version.";
  }
  return "You passed this task. Still revise the feedback so the same mistakes do not appear in your next work.";
};`,
  `const getNextStep = (item = {}) => {
  if (item.numericScore < PASS_MARK) {
    return "Revise the correction points, practise the weak area, then submit an improved version.";
  }
  return "You passed this task. Still revise the feedback so the same mistakes do not appear in your next work.";
};

export const hasStructuredResultFeedback = (item = {}) => {
  const objectiveDetails = normalizeObject(item.objectiveDetails);
  const hasWritingScore =
    item.writingScore !== null && item.writingScore !== undefined && item.writingScore !== "";

  return Boolean(
    String(item.markingReason || "").trim() ||
      String(item.improvementSummary || "").trim() ||
      normalizeArray(item.corrections).length ||
      normalizeArray(item.wrongAnswers).length ||
      normalizeArray(item.scoreBreakdown).length ||
      Object.keys(objectiveDetails).length ||
      Number(item.objectiveTotal || 0) > 0 ||
      hasWritingScore
  );
};`,
  "structured feedback detector",
);

replaceOnce(
  `  const correctionPoints = getCorrectionPoints(item);
  const resubmitTarget = ["B2", "C1"].includes(item.level) ? "/campus/writing" : "/campus/course?submitWork=1";`,
  `  const hasStructuredFeedback = hasStructuredResultFeedback(item);
  const correctionPoints = hasStructuredFeedback ? getCorrectionPoints(item) : [];
  const resubmitTarget = ["B2", "C1"].includes(item.level) ? "/campus/writing" : "/campus/course?submitWork=1";`,
  "structured feedback state",
);

replaceOnce(
  `      <div style={{ border: "1px solid #dbeafe", borderRadius: 12, background: "#eff6ff", padding: 12, display: "grid", gap: 8 }}>
        <h4 style={{ ...styles.resultHeading, margin: 0 }}>Why you got this score</h4>
        <p style={{ ...styles.resultText, margin: 0 }}>{getWhyThisScore(item)}</p>
      </div>`,
  `      {hasStructuredFeedback ? (
        <div style={{ border: "1px solid #dbeafe", borderRadius: 12, background: "#eff6ff", padding: 12, display: "grid", gap: 8 }}>
          <h4 style={{ ...styles.resultHeading, margin: 0 }}>Why you got this score</h4>
          <p style={{ ...styles.resultText, margin: 0 }}>{getWhyThisScore(item)}</p>
        </div>
      ) : null}`,
  "why score block",
);

replaceOnce(
  `      <div style={{ border: "1px solid #bbf7d0", borderRadius: 12, background: "#f0fdf4", padding: 12, display: "grid", gap: 8 }}>
        <h4 style={{ ...styles.resultHeading, margin: 0 }}>Next step</h4>
        <p style={{ ...styles.resultText, margin: 0 }}>{getNextStep(item)}</p>
        {!passed ? (
          <button
            type="button"
            style={{ ...styles.primaryButton, width: "fit-content" }}
            onClick={() => navigate(resubmitTarget)}
          >
            Improve and resubmit
          </button>
        ) : null}
      </div>`,
  `      {hasStructuredFeedback ? (
        <div style={{ border: "1px solid #bbf7d0", borderRadius: 12, background: "#f0fdf4", padding: 12, display: "grid", gap: 8 }}>
          <h4 style={{ ...styles.resultHeading, margin: 0 }}>Next step</h4>
          <p style={{ ...styles.resultText, margin: 0 }}>{getNextStep(item)}</p>
          {!passed ? (
            <button
              type="button"
              style={{ ...styles.primaryButton, width: "fit-content" }}
              onClick={() => navigate(resubmitTarget)}
            >
              Improve and resubmit
            </button>
          ) : null}
        </div>
      ) : !passed ? (
        <button
          type="button"
          style={{ ...styles.primaryButton, width: "fit-content" }}
          onClick={() => navigate(resubmitTarget)}
        >
          Improve and resubmit
        </button>
      ) : null}`,
  "next step block",
);

fs.writeFileSync(resultHistoryPath, source, "utf8");
console.log("Applied basic Sheet result feedback presentation.");

// Keep submission-history status in sync with the same marked A1/A2/B1 results source.
await import("./patchAssignmentMarkedStatusReconciliation.mjs");
