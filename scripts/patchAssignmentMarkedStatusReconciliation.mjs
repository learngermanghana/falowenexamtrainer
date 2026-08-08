import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetPath = path.join(root, "web", "src", "components", "AssignmentSubmissionPage.js");
let source = fs.readFileSync(targetPath, "utf8");

const ensureReplace = (before, after, label) => {
  if (source.includes(after)) return;
  if (!source.includes(before)) throw new Error(`Could not find ${label}.`);
  source = source.replace(before, after);
};

ensureReplace(
  'import { triggerInteractionFeedback } from "../services/interactionFeedback";',
  'import { triggerInteractionFeedback } from "../services/interactionFeedback";\nimport { fetchStudentResultsHistory } from "../services/resultsApi";\nimport { fetchResultsFromPublishedSheet } from "../services/resultsSheetService";',
  "results service import anchor",
);

ensureReplace(
  '  const { user, studentProfile } = useAuth();',
  '  const { user, studentProfile, idToken } = useAuth();',
  "useAuth destructuring",
);

ensureReplace(
  '  const [recentSubmissions, setRecentSubmissions] = useState([]);\n  const [submissionsLoading, setSubmissionsLoading] = useState(false);',
  '  const [recentSubmissions, setRecentSubmissions] = useState([]);\n  const [markedResults, setMarkedResults] = useState([]);\n  const [submissionsLoading, setSubmissionsLoading] = useState(false);',
  "recent submissions state",
);

const markedResultsEffect = `\n  useEffect(() => {\n    let active = true;\n\n    const loadMarkedResults = async () => {\n      if (!studentCode) {\n        if (active) setMarkedResults([]);\n        return;\n      }\n\n      try {\n        const sheetUrl = String(process.env.REACT_APP_RESULTS_SHEET_CSV_URL || \"\").trim();\n        let rows = [];\n\n        if (sheetUrl) {\n          const allRows = await fetchResultsFromPublishedSheet(sheetUrl);\n          const normalizedStudentCode = String(studentCode || \"\").trim().toLowerCase();\n          rows = (Array.isArray(allRows) ? allRows : []).filter(\n            (row) => String(row?.studentcode || row?.studentCode || \"\").trim().toLowerCase() === normalizedStudentCode,\n          );\n        } else if (idToken) {\n          const apiRows = await fetchStudentResultsHistory({ idToken, studentCode });\n          rows = Array.isArray(apiRows) ? apiRows : [];\n        }\n\n        if (active) setMarkedResults(rows);\n      } catch (_error) {\n        // Submission history must remain usable even if the external results source is temporarily unavailable.\n        if (active) setMarkedResults([]);\n      }\n    };\n\n    loadMarkedResults();\n    return () => {\n      active = false;\n    };\n  }, [idToken, studentCode]);\n`;

if (!source.includes("const loadMarkedResults = async () =>")) {
  const anchor = '  const studentName = useMemo(';
  const index = source.indexOf(anchor);
  if (index < 0) throw new Error("Could not find studentName anchor for marked-results effect.");
  source = `${source.slice(0, index)}${markedResultsEffect}\n${source.slice(index)}`;
}

ensureReplace(
  '      sheetResults: firestoreSubmissions,',
  '      sheetResults: markedResults,',
  "assignment progress result source",
);

ensureReplace(
  '  }, [assignmentOptions, buildAssignmentId, deriveAssignmentDay, draftsByAssignment, recentSubmissions, selectedSubmitLevel, studentCode]);',
  '  }, [assignmentOptions, buildAssignmentId, deriveAssignmentDay, draftsByAssignment, markedResults, recentSubmissions, selectedSubmitLevel, studentCode]);',
  "merged progress dependencies",
);

const statusResolver = `\n  const resolveSubmissionHistoryStatus = useCallback((entry) => {\n    if (safeLower(entry?.status) === \"resubmitted\") return \"pending\";\n\n    const title = entry?.assignmentTitle || entry?.title || \"\";\n    const progress = mergedProgressByTitle[title] || null;\n    if (progress?.status === \"passed\") return \"passed\";\n    if (progress?.status === \"failed\") return \"failed\";\n\n    const score = getSubmissionScore(entry);\n    if (typeof score === \"number\") return score >= PASS_THRESHOLD_SCORE ? \"passed\" : \"failed\";\n\n    return getFeedbackFromSubmission(entry) ? \"marked\" : \"pending\";\n  }, [mergedProgressByTitle]);\n`;

if (!source.includes("const resolveSubmissionHistoryStatus = useCallback")) {
  const anchor = '  const selectedAssignmentPassedFromProgress = useMemo(() => {';
  const index = source.indexOf(anchor);
  if (index < 0) throw new Error("Could not find selectedAssignmentPassedFromProgress anchor.");
  source = `${source.slice(0, index)}${statusResolver}\n${source.slice(index)}`;
}

ensureReplace(
  'Status: {safeLower(entry.status) === "resubmitted" ? "pending" : getFeedbackFromSubmission(entry) ? "marked" : "pending"}',
  'Status: {resolveSubmissionHistoryStatus(entry)}',
  "submission history status label",
);

fs.writeFileSync(targetPath, source, "utf8");
console.log("Assignment submission history now reconciles A1/A2/B1 statuses with marked results.");
