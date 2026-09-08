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
  `    if (minimumSubmissionWords > 0 && submissionWordCount < minimumSubmissionWords) {\n      const wordError = buildAssignmentSubmissionWordError({\n        wordCount: submissionWordCount,\n        minimumWords: minimumSubmissionWords,\n        level: selectedAssignmentLevel,\n        chapter: selectedAssignmentChapter,\n      });\n      setWordMinimumError(wordError);\n      setStatus({ loading: false, error: "", success: "" });\n      triggerInteractionFeedback({ sound: "error" });\n      window.requestAnimationFrame(() => {\n        const textarea = submissionTextRef.current;\n        textarea?.focus?.();\n        textarea?.scrollIntoView?.({ behavior: "smooth", block: "center" });\n      });\n      return;\n    }`,
  "inline word minimum submit validation",
);

replaceOnce(
  `              <textarea\n                ref={submissionTextRef}\n                value={form.submissionText}`,
  `              <textarea\n                ref={submissionTextRef}\n                data-submission-word-feedback="inline"\n                aria-invalid={wordMinimumError ? "true" : undefined}\n                aria-describedby={wordMinimumError ? "assignment-word-minimum-error" : undefined}\n                value={form.submissionText}`,
  "inline word feedback textarea ownership",
);

replaceOnce(
  `              <WordProgress value={submissionAnswerText} minimumWords={minimumSubmissionWords} />`,
  `              <WordProgress value={submissionAnswerText} minimumWords={minimumSubmissionWords} />\n              {wordMinimumError ? (\n                <div\n                  id="assignment-word-minimum-error"\n                  role="alert"\n                  aria-live="assertive"\n                  data-submission-word-error="true"\n                  style={{\n                    marginTop: 8,\n                    border: "1px solid #fecaca",\n                    borderRadius: 10,\n                    background: "#fef2f2",\n                    color: "#991b1b",\n                    padding: "10px 12px",\n                    fontWeight: 700,\n                    lineHeight: 1.5,\n                  }}\n                >\n                  {wordMinimumError}\n                </div>\n              ) : null}`,
  "inline word error presentation",
);

const requiredMarkers = [
  "buildAssignmentSubmissionWordProgressText,",
  "buildAssignmentSubmissionWordProgressText({",
  'data-submission-word-feedback="inline"',
  'data-submission-word-error="true"',
  "minimumSubmissionWords > 0 && submissionWordCount < minimumSubmissionWords",
  "setWordMinimumError(wordError);",
  'textarea?.scrollIntoView?.({ behavior: "smooth", block: "center" });',
];

requiredMarkers.forEach((marker) => {
  if (!source.includes(marker)) throw new Error(`Submission word feedback marker missing: ${marker}`);
});

fs.writeFileSync(targetPath, source, "utf8");
console.log("Assignment submissions now use task-aware word targets with inline missing-word feedback.");
