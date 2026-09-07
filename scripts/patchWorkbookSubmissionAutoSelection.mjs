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

if (!source.includes('from "../utils/workbookSubmissionContext"')) {
  replaceOnce(
    'import { triggerInteractionFeedback } from "../services/interactionFeedback";',
    `import { triggerInteractionFeedback } from "../services/interactionFeedback";\nimport {\n  findWorkbookContextAssignment,\n  resolveWorkbookSubmissionContext,\n} from "../utils/workbookSubmissionContext";`,
    "workbook submission context import",
  );
}

if (!source.includes('from "../utils/structuredSubmissionTemplate"')) {
  replaceOnce(
    `import {\n  findWorkbookContextAssignment,\n  resolveWorkbookSubmissionContext,\n} from "../utils/workbookSubmissionContext";`,
    `import {\n  findWorkbookContextAssignment,\n  resolveWorkbookSubmissionContext,\n} from "../utils/workbookSubmissionContext";\nimport {\n  buildStructuredSubmissionTemplate,\n  formatMissingStructuredParts,\n  getStructuredAnswerText,\n  getStructuredSubmissionProfile,\n  parseStructuredSubmissionText,\n} from "../utils/structuredSubmissionTemplate";`,
    "structured submission helper import",
  );
}

replaceOnce(
  `  const requestedSubmitLevel = useMemo(\n    () =>\n      normalizeCourseLevel(\n        submissionContext?.level ||\n          location?.state?.level ||\n          new URLSearchParams(location?.search || "").get("level")\n      ),\n    [location?.search, location?.state?.level, submissionContext?.level]\n  );`,
  `  const workbookSubmissionContext = useMemo(\n    () =>\n      resolveWorkbookSubmissionContext({\n        submissionContext,\n        locationState: location?.state,\n        search: location?.search || "",\n      }),\n    [location?.search, location?.state, submissionContext]\n  );\n  const requestedSubmitLevel = normalizeCourseLevel(workbookSubmissionContext.level);`,
  "route-owned submit level",
);

replaceOnce(
  `  const requestedAssignmentKey = useMemo(\n    () =>\n      location?.state?.assignmentKey ||\n      location?.state?.canonicalAssignmentKey ||\n      new URLSearchParams(location?.search || "").get("assignmentKey") ||\n      "",\n    [location?.search, location?.state]\n  );`,
  `  const requestedAssignmentKey = workbookSubmissionContext.assignmentKey;`,
  "route-owned assignment key",
);

replaceOnce(
  `  const requestedAssignmentMatch = useMemo(() => {\n    if (!requestedAssignmentKey || !assignmentDictionary.length) return null;\n    const requestedNormalized = normalizeAssignmentIdentity(requestedAssignmentKey);\n    return (\n      assignmentDictionary.find(\n        (entry) => normalizeAssignmentIdentity(entry.assignmentKey || entry.canonicalAssignmentId || "") === requestedNormalized\n      ) || null\n    );\n  }, [assignmentDictionary, requestedAssignmentKey]);`,
  `  const requestedAssignmentMatch = useMemo(\n    () =>\n      findWorkbookContextAssignment({\n        assignmentDictionary,\n        assignmentKey: requestedAssignmentKey,\n        day: workbookSubmissionContext.day,\n        chapter: workbookSubmissionContext.chapter,\n      }),\n    [\n      assignmentDictionary,\n      requestedAssignmentKey,\n      workbookSubmissionContext.chapter,\n      workbookSubmissionContext.day,\n    ]\n  );`,
  "route assignment resolution",
);

replaceOnce(
  `  const [assignmentSelectionUnlocked, setAssignmentSelectionUnlocked] = useState(false);\n  const isAssignmentContextLocked = Boolean(requestedAssignmentMatch && !assignmentSelectionUnlocked);`,
  `  const [assignmentSelectionUnlocked, setAssignmentSelectionUnlocked] = useState(false);\n  const isWorkbookSubmissionContext = workbookSubmissionContext.locked;\n  const isAssignmentContextLocked = Boolean(\n    isWorkbookSubmissionContext || (requestedAssignmentMatch && !assignmentSelectionUnlocked)\n  );`,
  "workbook assignment lock",
);

replaceOnce(
  `  const selectedCanonicalAssignmentKey = useMemo(\n    () =>\n      form.assignmentTitle\n        ? resolveAssignmentCanonicalKey({\n            level: selectedAssignmentLevel,\n            assignmentId: selectedAssignmentId,\n            assignmentTitle: form.assignmentTitle,\n          })\n        : "",\n    [form.assignmentTitle, selectedAssignmentId, selectedAssignmentLevel]\n  );`,
  `  const selectedCanonicalAssignmentKey = useMemo(\n    () =>\n      form.assignmentTitle\n        ? resolveAssignmentCanonicalKey({\n            level: selectedAssignmentLevel,\n            assignmentId: selectedAssignmentId,\n            assignmentTitle: form.assignmentTitle,\n          })\n        : "",\n    [form.assignmentTitle, selectedAssignmentId, selectedAssignmentLevel]\n  );\n\n  const selectedSubmissionProfile = useMemo(\n    () =>\n      getStructuredSubmissionProfile({\n        level: selectedAssignmentLevel,\n        day: selectedAssignmentDay,\n        chapter: selectedAssignmentChapter,\n        assignmentKey: selectedCanonicalAssignmentKey || selectedAssignmentId,\n      }),\n    [\n      selectedAssignmentChapter,\n      selectedAssignmentDay,\n      selectedAssignmentId,\n      selectedAssignmentLevel,\n      selectedCanonicalAssignmentKey,\n    ]\n  );\n\n  const parsedStructuredSubmission = useMemo(\n    () =>\n      selectedSubmissionProfile\n        ? parseStructuredSubmissionText(form.submissionText, selectedSubmissionProfile)\n        : null,\n    [form.submissionText, selectedSubmissionProfile]\n  );\n\n  const submissionAnswerText = useMemo(\n    () => getStructuredAnswerText(parsedStructuredSubmission) || form.submissionText.trim(),\n    [form.submissionText, parsedStructuredSubmission]\n  );\n\n  useEffect(() => {\n    if (!form.assignmentTitle || !selectedSubmissionProfile) return;\n    const template = buildStructuredSubmissionTemplate(selectedSubmissionProfile);\n    if (!template) return;\n\n    setForm((prev) => {\n      if (prev.assignmentTitle !== form.assignmentTitle || prev.submissionText.trim()) return prev;\n      return { ...prev, submissionText: template };\n    });\n  }, [form.assignmentTitle, selectedSubmissionProfile]);`,
  "structured submission profile",
);

replaceOnce(
  `      submissionText: form.submissionText.trim(),\n      answer: form.submissionText.trim(),\n      workContent: form.submissionText.trim(),`,
  `      submissionText: form.submissionText.trim(),\n      answer: form.submissionText.trim(),\n      workContent: form.submissionText.trim(),\n      ...(parsedStructuredSubmission\n        ? {\n            submissionStructureVersion: selectedSubmissionProfile?.version || 1,\n            structuredSections: parsedStructuredSubmission.sections,\n            submissionSectionOrder: parsedStructuredSubmission.sectionOrder,\n            requiredSubmissionParts: selectedSubmissionProfile.parts.map((part) => part.partId),\n          }\n        : {}),`,
  "structured submission payload",
);

replaceOnce(
  `      selectedCanonicalAssignmentKey,\n      studentCode,`,
  `      selectedCanonicalAssignmentKey,\n      parsedStructuredSubmission,\n      selectedSubmissionProfile,\n      studentCode,`,
  "structured submission payload dependencies",
);

replaceOnce(
  `    if (form.submissionText.trim().length < MIN_SUBMISSION_CHARACTERS) {`,
  `    if (selectedSubmissionProfile && parsedStructuredSubmission) {\n      const incompleteParts = [\n        ...new Set([\n          ...parsedStructuredSubmission.missingHeadings,\n          ...parsedStructuredSubmission.unansweredParts,\n        ]),\n      ];\n      if (incompleteParts.length) {\n        setStatus({\n          loading: false,\n          error: \`Please answer every required section before submitting: \${formatMissingStructuredParts(incompleteParts)}. Keep the TEIL headings in the box and type your answers underneath them.\`,\n          success: "",\n        });\n        return;\n      }\n    }\n\n    if (submissionAnswerText.length < MIN_SUBMISSION_CHARACTERS) {`,
  "required structured section validation",
);

replaceOnce(
  `    const submissionWordCount = countWords(form.submissionText);`,
  `    const submissionWordCount = countWords(submissionAnswerText);`,
  "structured answer word count",
);

replaceOnce(
  `              <span style={{ ...styles.label, display: "flex", alignItems: "center", gap: 8 }}>\n                Your text *`,
  `              <span style={{ ...styles.label, display: "flex", alignItems: "center", gap: 8 }}>\n                Your answers *`,
  "structured submission field label",
);

replaceOnce(
  `              <textarea\n                ref={submissionTextRef}`,
  `              {selectedSubmissionProfile ? (\n                <div\n                  data-structured-submission-template="true"\n                  style={{\n                    border: "1px solid #bfdbfe",\n                    borderRadius: 10,\n                    background: "#eff6ff",\n                    color: "#1e3a8a",\n                    padding: "10px 12px",\n                    fontSize: 13,\n                    lineHeight: 1.5,\n                  }}\n                >\n                  One answer box, already organised for this assignment. Type underneath every TEIL heading. Falowen will separate the sections automatically for marking.\n                </div>\n              ) : null}\n              <textarea\n                ref={submissionTextRef}`,
  "structured submission helper",
);

replaceOnce(
  `              <WordProgress value={form.submissionText} minimumWords={minimumSubmissionWords} />`,
  `              <WordProgress value={submissionAnswerText} minimumWords={minimumSubmissionWords} />`,
  "structured answer progress",
);

replaceOnce(
  `        <form style={{ display: "grid", gap: 12 }} onSubmit={handleSubmit}>\n          <div\n            style={{\n              display: "grid",`,
  `        <form style={{ display: "grid", gap: 12 }} onSubmit={handleSubmit}>\n          {isWorkbookSubmissionContext ? (\n            <div\n              data-workbook-submission-context="locked"\n              style={{\n                border: "1px solid #bfdbfe",\n                borderRadius: 12,\n                background: "#eff6ff",\n                display: "grid",\n                gap: 4,\n                padding: 12,\n              }}\n            >\n              <span style={{ color: "#1d4ed8", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>\n                Submitting for\n              </span>\n              <strong style={{ color: "#0f172a" }}>\n                {requestedAssignmentMatch?.label ||\n                  [workbookSubmissionContext.level, workbookSubmissionContext.day ? \`Day \${workbookSubmissionContext.day}\` : "", workbookSubmissionContext.chapter ? \`Chapter \${workbookSubmissionContext.chapter}\` : ""]\n                    .filter(Boolean)\n                    .join(" · ")}\n              </strong>\n              <span style={styles.helperText}>\n                The workbook selected this assignment automatically. Continue with the answer fields below.\n              </span>\n            </div>\n          ) : null}\n          <div\n            data-manual-submission-selectors="true"\n            style={{\n              display: isWorkbookSubmissionContext ? "none" : "grid",`,
  "read-only workbook assignment summary",
);

const requiredMarkers = [
  'from "../utils/workbookSubmissionContext"',
  'from "../utils/structuredSubmissionTemplate"',
  "const workbookSubmissionContext = useMemo(",
  "const requestedAssignmentKey = workbookSubmissionContext.assignmentKey;",
  "findWorkbookContextAssignment({",
  "const isWorkbookSubmissionContext = workbookSubmissionContext.locked;",
  "const selectedSubmissionProfile = useMemo(",
  "parseStructuredSubmissionText(form.submissionText, selectedSubmissionProfile)",
  "structuredSections: parsedStructuredSubmission.sections",
  "requiredSubmissionParts: selectedSubmissionProfile.parts.map",
  "Please answer every required section before submitting",
  'data-structured-submission-template="true"',
  'data-workbook-submission-context="locked"',
  'display: isWorkbookSubmissionContext ? "none" : "grid"',
];

requiredMarkers.forEach((marker) => {
  if (!source.includes(marker)) throw new Error(`Workbook submission auto-selection marker missing: ${marker}`);
});

fs.writeFileSync(targetPath, source, "utf8");
console.log("Workbook submissions now auto-select assignments and use canonical one-box TEIL templates.");
await import("./patchStructuredResubmission.mjs");
await import("./patchLocalSubmissionDraftResilience.mjs");
