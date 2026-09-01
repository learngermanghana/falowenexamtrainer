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

const interactionImport = 'import { triggerInteractionFeedback } from "../services/interactionFeedback";';
const workbookContextImport = `import {
  findWorkbookContextAssignment,
  resolveWorkbookSubmissionContext,
} from "../utils/workbookSubmissionContext";`;
if (!source.includes('from "../utils/workbookSubmissionContext";')) {
  if (!source.includes(interactionImport)) {
    throw new Error("Could not patch workbook submission context import: source anchor was not found.");
  }
  source = source.replace(interactionImport, `${interactionImport}\n${workbookContextImport}`);
}

replaceOnce(
  `  const requestedSubmitLevel = useMemo(
    () =>
      normalizeCourseLevel(
        submissionContext?.level ||
          location?.state?.level ||
          new URLSearchParams(location?.search || "").get("level")
      ),
    [location?.search, location?.state?.level, submissionContext?.level]
  );`,
  `  const workbookSubmissionContext = useMemo(
    () =>
      resolveWorkbookSubmissionContext({
        submissionContext,
        locationState: location?.state,
        search: location?.search || "",
      }),
    [location?.search, location?.state, submissionContext]
  );
  const requestedSubmitLevel = normalizeCourseLevel(workbookSubmissionContext.level);`,
  "route-owned submit level",
);

replaceOnce(
  `  const requestedAssignmentKey = useMemo(
    () =>
      location?.state?.assignmentKey ||
      location?.state?.canonicalAssignmentKey ||
      new URLSearchParams(location?.search || "").get("assignmentKey") ||
      "",
    [location?.search, location?.state]
  );`,
  `  const requestedAssignmentKey = workbookSubmissionContext.assignmentKey;`,
  "route-owned assignment key",
);

replaceOnce(
  `  const requestedAssignmentMatch = useMemo(() => {
    if (!requestedAssignmentKey || !assignmentDictionary.length) return null;
    const requestedNormalized = normalizeAssignmentIdentity(requestedAssignmentKey);
    return (
      assignmentDictionary.find(
        (entry) => normalizeAssignmentIdentity(entry.assignmentKey || entry.canonicalAssignmentId || "") === requestedNormalized
      ) || null
    );
  }, [assignmentDictionary, requestedAssignmentKey]);`,
  `  const requestedAssignmentMatch = useMemo(
    () =>
      findWorkbookContextAssignment({
        assignmentDictionary,
        assignmentKey: requestedAssignmentKey,
        day: workbookSubmissionContext.day,
        chapter: workbookSubmissionContext.chapter,
      }),
    [
      assignmentDictionary,
      requestedAssignmentKey,
      workbookSubmissionContext.chapter,
      workbookSubmissionContext.day,
    ]
  );`,
  "route assignment resolution",
);

replaceOnce(
  `  const [assignmentSelectionUnlocked, setAssignmentSelectionUnlocked] = useState(false);
  const isAssignmentContextLocked = Boolean(requestedAssignmentMatch && !assignmentSelectionUnlocked);`,
  `  const [assignmentSelectionUnlocked, setAssignmentSelectionUnlocked] = useState(false);
  const isWorkbookSubmissionContext = workbookSubmissionContext.locked;
  const isAssignmentContextLocked = Boolean(
    isWorkbookSubmissionContext || (requestedAssignmentMatch && !assignmentSelectionUnlocked)
  );`,
  "workbook assignment lock",
);

if (!source.includes('data-workbook-submission-context="locked"')) {
  replaceOnce(
    `        <form style={{ display: "grid", gap: 12 }} onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",`,
    `        <form style={{ display: "grid", gap: 12 }} onSubmit={handleSubmit}>
          {isWorkbookSubmissionContext ? (
            <div
              data-workbook-submission-context="locked"
              style={{
                border: "1px solid #bfdbfe",
                borderRadius: 12,
                background: "#eff6ff",
                display: "grid",
                gap: 4,
                padding: 12,
              }}
            >
              <span style={{ color: "#1d4ed8", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>
                Submitting for
              </span>
              <strong style={{ color: "#0f172a" }}>
                {requestedAssignmentMatch?.label ||
                  [
                    workbookSubmissionContext.level,
                    workbookSubmissionContext.day ? "Day " + workbookSubmissionContext.day : "",
                    workbookSubmissionContext.chapter ? "Chapter " + workbookSubmissionContext.chapter : "",
                  ]
                    .filter(Boolean)
                    .join(" · ")}
              </strong>
              <span style={styles.helperText}>
                The workbook selected this assignment automatically. Continue with the answer fields below.
              </span>
            </div>
          ) : null}
          <div
            data-manual-submission-selectors="true"
            style={{
              display: isWorkbookSubmissionContext ? "none" : "grid",`,
    "read-only workbook assignment summary",
  );
}

const requiredMarkers = [
  'from "../utils/workbookSubmissionContext"',
  "const workbookSubmissionContext = useMemo(",
  "const requestedAssignmentKey = workbookSubmissionContext.assignmentKey;",
  "findWorkbookContextAssignment({",
  "const isWorkbookSubmissionContext = workbookSubmissionContext.locked;",
  'data-workbook-submission-context="locked"',
  'display: isWorkbookSubmissionContext ? "none" : "grid"',
];

requiredMarkers.forEach((marker) => {
  if (!source.includes(marker)) throw new Error(`Workbook submission auto-selection marker missing: ${marker}`);
});

fs.writeFileSync(targetPath, source, "utf8");
console.log("Workbook submissions now auto-select and lock A1–B1 route assignments.");
