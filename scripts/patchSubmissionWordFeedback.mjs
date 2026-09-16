import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetPath = path.join(root, "web/src/components/AssignmentSubmissionPage.js");
let source = fs.readFileSync(targetPath, "utf8");

const replaceOnce = (before, after, label) => {
  if (source.includes(after)) return;
  if (!source.includes(before)) {
    throw new Error(`Could not patch ${label}: source anchor was not found.`);
  }
  source = source.replace(before, after);
};

replaceOnce(
  `  DEFAULT_ASSIGNMENT_SUBMISSION_WORDS,\n  buildAssignmentSubmissionWordError,\n  getAssignmentSubmissionWordMinimum,`,
  `  DEFAULT_ASSIGNMENT_SUBMISSION_WORDS,\n  buildAssignmentSubmissionWordError,\n  buildAssignmentSubmissionWordProgressText,\n  getAssignmentSubmissionWordMinimum,`,
  "assignment word progress import",
);

replaceOnce(
  `  const [status, setStatus] = useState({ loading: false, error: "", success: "" });`,
  `  const [status, setStatus] = useState({ loading: false, error: "", success: "" });\n  const [wordMinimumError, setWordMinimumError] = useState("");`,
  "inline word error state",
);

replaceOnce(
  `  useEffect(() => {\n    if (status.error) {\n      triggerInteractionFeedback({ sound: "error" });\n    }\n  }, [status.error]);`,
  `  useEffect(() => {\n    if (status.error) {\n      triggerInteractionFeedback({ sound: "error" });\n    }\n  }, [status.error]);\n\n  useEffect(() => {\n    setWordMinimumError("");\n  }, [form.assignmentTitle, form.submissionText]);`,
  "clear inline word error while editing",
);

replaceOnce(
  `const WordProgress = ({ value, minimumWords, label = "Minimum word target" }) => {\n  const progress = getMinimumWordProgress(value, minimumWords);`,
  `const WordProgress = ({ value, minimumWords, label = "Minimum word target" }) => {\n  if (!(Number(minimumWords) > 0)) return null;\n  const progress = getMinimumWordProgress(value, minimumWords);`,
  "hide word progress when no word target applies",
);

replaceOnce(
  `        {progress.wordCount} / {minimumWords} words · {isReady ? "Word target reached" : \`${"${progress.wordsRemaining}"} word${"${progress.wordsRemaining === 1 ? \"\" : \"s\"}"} left\`}`,
  `        {buildAssignmentSubmissionWordProgressText({\n          wordCount: progress.wordCount,\n          minimumWords,\n        })}`,
  "live word progress wording",
);

replaceOnce(
  `  const handleSubmit = async (event) => {\n    event.preventDefault();\n    setStatus({ loading: true, error: "", success: "" });`,
  `  const handleSubmit = async (event) => {\n    event.preventDefault();\n    setWordMinimumError("");\n    setStatus({ loading: true, error: "", success: "" });`,
  "reset inline word error on submit",
);

replaceOnce(
  `    if (submissionWordCount < minimumSubmissionWords) {\n      setStatus({\n        loading: false,\n        error: buildAssignmentSubmissionWordError({\n          wordCount: submissionWordCount,\n          minimumWords: minimumSubmissionWords,\n          level: selectedAssignmentLevel,\n          chapter: selectedAssignmentChapter,\n        }),\n        success: "",\n      });\n      return;\n    }`,
  `    if (minimumSubmissionWords > 0 && submissionWordCount < minimumSubmissionWords) {\n      const wordError = buildAssignmentSubmissionWordError({\n        wordCount: submissionWordCount,\n        minimumWords: minimumSubmissionWords,\n        level: selectedAssignmentLevel,\n        chapter: selectedAssignmentChapter,\n      });\n      setWordMinimumError(wordError);\n      setStatus({ loading: false, error: "", success: "" });\n      triggerInteractionFeedback({\n        sound: "error",\n        toastMessage: wordError,\n        toastVariant: "error",\n        showToast,\n      });\n      window.requestAnimationFrame(() => {\n        const textarea = submissionTextRef.current;\n        textarea?.focus?.({ preventScroll: true });\n        const blockingAlert = document.querySelector('[data-submission-word-error="true"]');\n        blockingAlert?.scrollIntoView?.({ behavior: "smooth", block: "center" });\n      });\n      return;\n    }`,
  "prominent word minimum submit validation",
);

const structuredWordDeclaration = "    const submissionWordCount = countWords(submissionAnswerText);";
const plainWordDeclaration = "    const submissionWordCount = countWords(form.submissionText);";
const wordDeclaration = source.includes(structuredWordDeclaration) ? structuredWordDeclaration : plainWordDeclaration;
const structuredCharacterGuard = "    if (submissionAnswerText.length < MIN_SUBMISSION_CHARACTERS) {";
const plainCharacterGuard = "    if (form.submissionText.trim().length < MIN_SUBMISSION_CHARACTERS) {";
const characterGuard = source.includes(structuredCharacterGuard) ? structuredCharacterGuard : plainCharacterGuard;
const dynamicLengthGuard = "    if (form.submissionText.trim().length > dynamicMaxSubmissionCharacters) {";

const wordBlockStart = source.indexOf(wordDeclaration);
const characterBlockStart = source.indexOf(characterGuard);
const dynamicGuardStart = source.indexOf(dynamicLengthGuard);
if (wordBlockStart < 0 || characterBlockStart < 0 || dynamicGuardStart < 0) {
  throw new Error("Could not locate submission word/character validation blocks.");
}

if (characterBlockStart < wordBlockStart) {
  const characterBlock = source.slice(characterBlockStart, wordBlockStart).trimEnd();
  const wordBlock = source.slice(wordBlockStart, dynamicGuardStart).trimEnd();
  source = `${source.slice(0, characterBlockStart)}${wordBlock}\n\n${characterBlock}\n\n${source.slice(dynamicGuardStart)}`;
}

replaceOnce(
  `              <textarea\n                ref={submissionTextRef}\n                value={form.submissionText}`,
  `              <textarea\n                ref={submissionTextRef}\n                data-submission-word-feedback="inline"\n                aria-invalid={wordMinimumError ? "true" : undefined}\n                aria-describedby={wordMinimumError ? "assignment-word-minimum-error" : undefined}\n                value={form.submissionText}`,
  "inline word feedback textarea ownership",
);

replaceOnce(
  `          <div>\n            <div\n              style={{\n                border: "1px solid #e5e7eb",\n                borderRadius: 10,\n                background: selectedAssignmentEligibility.submittable ? "#ecfdf5" : "#fff7ed",\n                padding: "10px 12px",\n                marginBottom: 10,\n              }}\n            >\n              <div style={{ fontWeight: 700 }}>\n                {selectedAssignmentEligibility.submittable ? uiText.statusSubmittable : uiText.statusNotSubmittable}\n              </div>\n              {!selectedAssignmentEligibility.submittable ? (\n                <div style={styles.helperText}>\n                  {uiText.reasonLabel}: {!hasSelectedAssignment ? "Select assignment number." : selectedAssignmentEligibility.reason}\n                </div>\n              ) : null}\n            </div>\n            <label`,
  `          <div>\n            {!isSelectedLocked ? (\n              <div\n                style={{\n                  border: "1px solid #e5e7eb",\n                  borderRadius: 10,\n                  background: selectedAssignmentEligibility.submittable ? "#ecfdf5" : "#fff7ed",\n                  padding: "10px 12px",\n                  marginBottom: 10,\n                }}\n              >\n                <div style={{ fontWeight: 700 }}>\n                  {selectedAssignmentEligibility.submittable ? uiText.statusSubmittable : uiText.statusNotSubmittable}\n                </div>\n                {!selectedAssignmentEligibility.submittable ? (\n                  <div style={styles.helperText}>\n                    {uiText.reasonLabel}: {!hasSelectedAssignment ? "Select assignment number." : selectedAssignmentEligibility.reason}\n                  </div>\n                ) : null}\n              </div>\n            ) : null}\n            <label`,
  "hide redundant already-submitted eligibility notice",
);

replaceOnce(
  `          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>\n            <button`,
  `          {wordMinimumError ? (\n            <div\n              id="assignment-word-minimum-error"\n              role="alert"\n              aria-live="assertive"\n              data-submission-word-error="true"\n              style={{\n                border: "2px solid #ef4444",\n                borderRadius: 12,\n                background: "#fef2f2",\n                color: "#991b1b",\n                padding: "12px 14px",\n                display: "grid",\n                gap: 4,\n                lineHeight: 1.5,\n              }}\n            >\n              <strong style={{ fontSize: 16 }}>More words required before submission</strong>\n              <span>{wordMinimumError}</span>\n            </div>\n          ) : null}\n\n          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>\n            <button`,
  "blocking word minimum alert beside submit action",
);

const requiredMarkers = [
  "buildAssignmentSubmissionWordProgressText,",
  "buildAssignmentSubmissionWordProgressText({",
  'data-submission-word-feedback="inline"',
  'data-submission-word-error="true"',
  "More words required before submission",
  "minimumSubmissionWords > 0 && submissionWordCount < minimumSubmissionWords",
  "setWordMinimumError(wordError);",
  "toastMessage: wordError,",
  "showToast,",
  "!isSelectedLocked ? (",
  "hide redundant already-submitted eligibility notice",
].filter((marker) => marker !== "hide redundant already-submitted eligibility notice");

requiredMarkers.forEach((marker) => {
  if (!source.includes(marker)) throw new Error(`Submission word feedback marker missing: ${marker}`);
});

const wordValidationIndex = source.indexOf("minimumSubmissionWords > 0 && submissionWordCount < minimumSubmissionWords");
const structuredCharacterValidationIndex = source.indexOf("submissionAnswerText.length < MIN_SUBMISSION_CHARACTERS");
const plainCharacterValidationIndex = source.indexOf("form.submissionText.trim().length < MIN_SUBMISSION_CHARACTERS");
const characterValidationIndex = structuredCharacterValidationIndex >= 0
  ? structuredCharacterValidationIndex
  : plainCharacterValidationIndex;
if (wordValidationIndex < 0 || characterValidationIndex < 0 || wordValidationIndex > characterValidationIndex) {
  throw new Error("Submission word minimum validation must run before the generic character guard.");
}

fs.writeFileSync(targetPath, source, "utf8");
console.log("Assignment submissions now use task-aware word targets with prominent blocking feedback.");
