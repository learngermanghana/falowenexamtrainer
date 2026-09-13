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

// Failed tutor-marked work should return to the exact workbook lesson instead of
// a generic Course Book submit screen. The workbook's existing resubmission
// lifecycle then reloads the previous answer and keeps the marked feedback.
replaceOnce(
  `import { useTranslation } from "react-i18next";`,
  `import { useTranslation } from "react-i18next";
import { getCanonicalCourseRequirements } from "../data/courseCompletionJourney";
import { resolveAssignmentCanonicalKey } from "../utils/assignmentIdentity";`,
  "result recovery imports",
);

replaceOnce(
  `const TextBlock = ({ title, text, maxChars = 650 }) => {`,
  `export const getImproveLessonDestination = (item = {}) => {
  const level = String(item.level || "").trim().toUpperCase();
  if (["B2", "C1"].includes(level)) {
    return {
      route: "/campus/writing",
      state: { level, recoveryFromResults: true },
      exact: false,
    };
  }

  const canonicalAssignmentKey = resolveAssignmentCanonicalKey({
    level,
    assignmentId: item.assignmentId || item.assignmentKey || "",
    assignmentTitle: item.assignment || "",
  });
  const requirements = getCanonicalCourseRequirements(level);
  const requirement = requirements.find(
    (entry) =>
      canonicalAssignmentKey &&
      String(entry.assignmentKey || "").trim().toUpperCase() === canonicalAssignmentKey,
  );

  if (!requirement) {
    return {
      route: "/campus/course?filter=assignments&improve=1",
      state: {
        level,
        assignmentKey: canonicalAssignmentKey || item.assignmentId || item.assignmentKey || "",
        recoveryFromResults: true,
      },
      exact: false,
    };
  }

  const separator = requirement.route.includes("?") ? "&" : "?";
  const route = \`${"${requirement.route}"}${"${separator}"}improve=1&assignmentKey=${"${encodeURIComponent(requirement.assignmentKey)}"}\`;
  return {
    route,
    state: {
      level,
      day: requirement.day,
      chapter: requirement.chapter,
      assignmentKey: requirement.assignmentKey,
      canonicalAssignmentKey: requirement.assignmentKey,
      recoveryFromResults: true,
      resultScore: item.numericScore,
    },
    exact: true,
  };
};

const TextBlock = ({ title, text, maxChars = 650 }) => {`,
  "exact lesson recovery resolver",
);

replaceOnce(
  `  const correctionPoints = hasStructuredFeedback ? getCorrectionPoints(item) : [];
  const resubmitTarget = ["B2", "C1"].includes(item.level) ? "/campus/writing" : "/campus/course?submitWork=1";
  const passed = item.numericScore >= PASS_MARK;`,
  `  const correctionPoints = hasStructuredFeedback ? getCorrectionPoints(item) : [];
  const improveDestination = getImproveLessonDestination(item);
  const openImproveLesson = () =>
    navigate(improveDestination.route, { state: improveDestination.state });
  const passed = item.numericScore >= PASS_MARK;`,
  "result recovery state",
);

replaceOnce(
  `      </div>

      {hasStructuredFeedback ? (
        <div style={{ border: "1px solid #dbeafe", borderRadius: 12, background: "#eff6ff", padding: 12, display: "grid", gap: 8 }}>
          <h4 style={{ ...styles.resultHeading, margin: 0 }}>Why you got this score</h4>`,
  `      </div>

      {!passed ? (
        <div
          data-result-recovery="true"
          style={{
            border: "2px solid #2563eb",
            borderRadius: 14,
            background: "#eff6ff",
            padding: 14,
            display: "grid",
            gap: 8,
          }}
        >
          <h4 style={{ ...styles.resultHeading, margin: 0, color: "#1e3a8a" }}>Improve this lesson</h4>
          <p style={{ ...styles.resultText, margin: 0 }}>
            Open the workbook connected to this result and correct the parts highlighted in your feedback.
            Your previous submission stays in Falowen; when resubmission is available, your previous answers are loaded so you can improve them instead of starting again.
          </p>
          <button
            type="button"
            data-improve-this-lesson="true"
            style={{ ...styles.primaryButton, width: "fit-content" }}
            onClick={openImproveLesson}
          >
            Improve this lesson
          </button>
          {!improveDestination.exact ? (
            <span style={{ ...styles.helperText, margin: 0 }}>
              Falowen could not identify one exact workbook from this older result, so it will open the closest correction area.
            </span>
          ) : null}
        </div>
      ) : null}

      {hasStructuredFeedback ? (
        <div style={{ border: "1px solid #dbeafe", borderRadius: 12, background: "#eff6ff", padding: 12, display: "grid", gap: 8 }}>
          <h4 style={{ ...styles.resultHeading, margin: 0 }}>Why you got this score</h4>`,
  "prominent improve lesson panel",
);

source = source.replace(
  `          {!passed ? (
            <button
              type="button"
              style={{ ...styles.primaryButton, width: "fit-content" }}
              onClick={() => navigate(resubmitTarget)}
            >
              Improve and resubmit
            </button>
          ) : null}`,
  "",
);
source = source.replace(
  `      ) : !passed ? (
        <button
          type="button"
          style={{ ...styles.primaryButton, width: "fit-content" }}
          onClick={() => navigate(resubmitTarget)}
        >
          Improve and resubmit
        </button>
      ) : null}`,
  `      ) : null}`,
);

[
  "getImproveLessonDestination",
  "getCanonicalCourseRequirements",
  "resolveAssignmentCanonicalKey",
  'data-result-recovery="true"',
  'data-improve-this-lesson="true"',
  "Your previous submission stays in Falowen",
  "recoveryFromResults: true",
].forEach((marker) => {
  if (!source.includes(marker)) throw new Error(`Results recovery marker missing: ${marker}`);
});

if (source.includes("Improve and resubmit") || source.includes("/campus/course?submitWork=1")) {
  throw new Error("Results still contains the retired generic resubmission action.");
}

fs.writeFileSync(resultHistoryPath, source, "utf8");
console.log("Applied Results feedback presentation with exact lesson recovery for failed work.");

await import("./patchAssignmentMarkedStatusReconciliation.mjs");
await import("./patchMarkMyLetterFullFeedback.mjs");
await import("./patchC2Days1To7Foundation.mjs");
await import("./patchC2Days8To14Mastery.mjs");
await import("./patchA2RouteLockedSubmissionContextRuntimeFix.mjs");
