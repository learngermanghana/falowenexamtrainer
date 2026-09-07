import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetPath = path.join(root, "web/src/components/AssignmentSubmissionPage.js");
let source = fs.readFileSync(targetPath, "utf8");

const replaceOnce = (before, after, label) => {
  if (source.includes(after)) return;
  if (!source.includes(before)) throw new Error(`Could not patch ${label}: source anchor was not found.`);
  source = source.replace(before, after);
};

replaceOnce(
  `import {\n  buildStructuredSubmissionTemplate,\n  formatMissingStructuredParts,\n  getStructuredAnswerText,\n  getStructuredSubmissionProfile,\n  parseStructuredSubmissionText,\n} from "../utils/structuredSubmissionTemplate";`,
  `import {\n  buildStructuredSubmissionTemplate,\n  compareStructuredSubmissionSections,\n  formatMissingStructuredParts,\n  getStructuredAnswerText,\n  getStructuredSubmissionProfile,\n  parseStructuredSubmissionText,\n  resolveStructuredResubmissionSeed,\n} from "../utils/structuredSubmissionTemplate";`,
  "structured resubmission imports",
);

replaceOnce(
  `  const resubmissionTextRef = useRef(null);\n  const resubmissionImprovementRef = useRef(null);`,
  `  const resubmissionTextRef = useRef(null);\n  const resubmissionImprovementRef = useRef(null);\n  const resubmissionSeedRef = useRef("");`,
  "resubmission seed ref",
);

replaceOnce(
  `      canonicalAssignmentKey: match.canonicalAssignmentKey || match.assignmentKey || null,\n      chapterKey: match.chapterKey || buildChapterKey(match.assignmentTitle || match.title || ""),`,
  `      canonicalAssignmentKey: match.canonicalAssignmentKey || match.assignmentKey || null,\n      chapterKey: match.chapterKey || buildChapterKey(match.assignmentTitle || match.title || ""),\n      structuredSections: match.structuredSections || match.submissionSections || null,\n      submissionSectionOrder: match.submissionSectionOrder || match.requiredSubmissionParts || [],\n      submissionStructureVersion: match.submissionStructureVersion || null,`,
  "preview structured metadata",
);

replaceOnce(
  `  const selectedDraft = useMemo(() => draftsByAssignment[form.assignmentTitle], [draftsByAssignment, form.assignmentTitle]);\n  const hasDraftForSelection = Boolean(selectedDraft?.submissionText);`,
  `  const selectedDraft = useMemo(() => draftsByAssignment[form.assignmentTitle], [draftsByAssignment, form.assignmentTitle]);\n  const hasDraftForSelection = Boolean(selectedDraft?.submissionText);\n\n  const latestSelectedAttempt = useMemo(() => {\n    return recentSubmissions\n      .filter((entry) => isSameSelectedAssignment(entry) && isSubmissionAttemptStatus(entry?.status))\n      .slice()\n      .sort((left, right) => {\n        const leftDate = toDateValue(left?.resubmittedAt || left?.submittedAt || left?.createdAt || left?.updatedAt);\n        const rightDate = toDateValue(right?.resubmittedAt || right?.submittedAt || right?.createdAt || right?.updatedAt);\n        return (rightDate?.getTime() || 0) - (leftDate?.getTime() || 0);\n      })[0] || null;\n  }, [isSameSelectedAssignment, recentSubmissions]);\n\n  const previousResubmissionSeed = useMemo(\n    () =>\n      resolveStructuredResubmissionSeed({\n        profile: selectedSubmissionProfile,\n        structuredSections:\n          latestSelectedAttempt?.structuredSections ||\n          latestSelectedAttempt?.submissionSections ||\n          selectedPreview?.structuredSections ||\n          null,\n        submissionText: latestSelectedAttempt?.submissionText || selectedPreview?.submissionText || "",\n      }),\n    [latestSelectedAttempt, selectedPreview, selectedSubmissionProfile]\n  );\n\n  const resubmissionEditorSeed = useMemo(() => {\n    const draftCanonicalKey = selectedDraft?.canonicalAssignmentKey || selectedDraft?.assignmentKey || "";\n    const selectedKey = selectedCanonicalAssignmentKey || selectedAssignmentId || "";\n    const hasMatchingResubmissionDraft =\n      selectedDraft?.status === "resubmission_draft" &&\n      draftCanonicalKey &&\n      selectedKey &&\n      normalizeAssignmentIdentity(draftCanonicalKey) === normalizeAssignmentIdentity(selectedKey) &&\n      String(selectedDraft?.resubmissionText || "").trim();\n\n    if (!hasMatchingResubmissionDraft) return previousResubmissionSeed;\n    return resolveStructuredResubmissionSeed({\n      profile: selectedSubmissionProfile,\n      structuredSections: selectedDraft?.structuredSections || selectedDraft?.submissionSections || null,\n      submissionText: selectedDraft.resubmissionText,\n    });\n  }, [\n    previousResubmissionSeed,\n    selectedAssignmentId,\n    selectedCanonicalAssignmentKey,\n    selectedDraft,\n    selectedSubmissionProfile,\n  ]);\n\n  const structuredResubmissionEnabled = Boolean(\n    selectedSubmissionProfile &&\n      previousResubmissionSeed?.mode === "structured" &&\n      resubmissionEditorSeed?.mode === "structured"\n  );\n\n  const parsedStructuredResubmission = useMemo(\n    () =>\n      structuredResubmissionEnabled\n        ? parseStructuredSubmissionText(resubmissionText, selectedSubmissionProfile)\n        : null,\n    [resubmissionText, selectedSubmissionProfile, structuredResubmissionEnabled]\n  );\n\n  const resubmissionAnswerText = useMemo(\n    () => getStructuredAnswerText(parsedStructuredResubmission) || resubmissionText.trim(),\n    [parsedStructuredResubmission, resubmissionText]\n  );\n\n  const structuredResubmissionDiff = useMemo(\n    () =>\n      structuredResubmissionEnabled && parsedStructuredResubmission\n        ? compareStructuredSubmissionSections(\n            previousResubmissionSeed.sections || {},\n            parsedStructuredResubmission.sections || {},\n            parsedStructuredResubmission.sectionOrder || []\n          )\n        : null,\n    [parsedStructuredResubmission, previousResubmissionSeed, structuredResubmissionEnabled]\n  );\n\n  useEffect(() => {\n    if (!canShowResubmissionForm || !resubmissionEditorSeed?.text) return;\n    const seedKey = [\n      selectedCanonicalAssignmentKey || selectedAssignmentId || form.assignmentTitle,\n      latestSelectedAttempt?.id || latestSelectedAttempt?.attemptNumber || latestSelectedAttempt?.attempt || "first",\n      resubmissionEditorSeed.source || resubmissionEditorSeed.mode || "legacy",\n    ].join("::");\n    if (resubmissionSeedRef.current === seedKey) return;\n\n    resubmissionSeedRef.current = seedKey;\n    setResubmissionText(resubmissionEditorSeed.text);\n    if (selectedDraft?.status === "resubmission_draft") {\n      setResubmissionImprovement(String(selectedDraft.resubmissionImprovement || ""));\n    }\n  }, [\n    canShowResubmissionForm,\n    form.assignmentTitle,\n    latestSelectedAttempt,\n    resubmissionEditorSeed,\n    selectedAssignmentId,\n    selectedCanonicalAssignmentKey,\n    selectedDraft,\n  ]);`,
  "structured resubmission hydration",
);

replaceOnce(
  `        resubmissionText: correctedText,\n        resubmissionImprovement: trimmedImprovement,`,
  `        resubmissionText: correctedText,\n        resubmissionImprovement: trimmedImprovement,\n        ...(structuredResubmissionEnabled && parsedStructuredResubmission\n          ? {\n              submissionStructureVersion: selectedSubmissionProfile?.version || 1,\n              structuredSections: parsedStructuredResubmission.sections,\n              submissionSectionOrder: parsedStructuredResubmission.sectionOrder,\n              requiredSubmissionParts: selectedSubmissionProfile.parts.map((part) => part.partId),\n              previousStructuredSections: previousResubmissionSeed.sections || null,\n              changedSubmissionParts: structuredResubmissionDiff?.changedParts || [],\n            }\n          : {}),`,
  "structured resubmission draft payload",
);

replaceOnce(
  `    if (!trimmedImprovement) {\n      setResubmissionStatus({\n        loading: false,\n        error: "Please explain what you improved in this submission.",\n        success: "",\n      });\n      return;\n    }\n\n    if (correctedText.length < MIN_SUBMISSION_CHARACTERS) {`,
  `    if (!trimmedImprovement) {\n      setResubmissionStatus({\n        loading: false,\n        error: "Please explain what you improved in this submission.",\n        success: "",\n      });\n      return;\n    }\n\n    let parsedResubmissionForSubmit = null;\n    let structuredDiffForSubmit = null;\n    if (structuredResubmissionEnabled && selectedSubmissionProfile) {\n      parsedResubmissionForSubmit = parseStructuredSubmissionText(correctedText, selectedSubmissionProfile);\n      const incompleteParts = [\n        ...new Set([\n          ...parsedResubmissionForSubmit.missingHeadings,\n          ...parsedResubmissionForSubmit.unansweredParts,\n        ]),\n      ];\n      if (incompleteParts.length) {\n        setResubmissionStatus({\n          loading: false,\n          error: \`Please keep every required TEIL and answer it before resubmitting: \${formatMissingStructuredParts(incompleteParts)}.\`,\n          success: "",\n        });\n        return;\n      }\n\n      structuredDiffForSubmit = compareStructuredSubmissionSections(\n        previousResubmissionSeed.sections || {},\n        parsedResubmissionForSubmit.sections || {},\n        parsedResubmissionForSubmit.sectionOrder || []\n      );\n      if (!structuredDiffForSubmit.hasChanges) {\n        setResubmissionStatus({\n          loading: false,\n          error: "Your answers are unchanged. Correct at least one Teil before resubmitting.",\n          success: "",\n        });\n        return;\n      }\n    }\n\n    if (correctedText.length < MIN_SUBMISSION_CHARACTERS) {`,
  "structured resubmission validation",
);

replaceOnce(
  `    if (selectedPreview?.submissionText && resubmissionDiff.mode === "objective") {`,
  `    if (!structuredResubmissionEnabled && selectedPreview?.submissionText && resubmissionDiff.mode === "objective") {`,
  "legacy objective resubmission threshold",
);

replaceOnce(
  `      selectedPreview?.submissionText &&\n      resubmissionDiff.mode === "text" &&`,
  `      !structuredResubmissionEnabled &&\n      selectedPreview?.submissionText &&\n      resubmissionDiff.mode === "text" &&`,
  "legacy text resubmission threshold",
);

replaceOnce(
  `        previousSubmissionText: selectedPreview?.submissionText || "",\n        attempt: selectedResubmissionCount + 2,`,
  `        previousSubmissionText: latestSelectedAttempt?.submissionText || selectedPreview?.submissionText || "",\n        ...(structuredResubmissionEnabled && parsedResubmissionForSubmit\n          ? {\n              submissionStructureVersion: selectedSubmissionProfile?.version || 1,\n              structuredSections: parsedResubmissionForSubmit.sections,\n              submissionSectionOrder: parsedResubmissionForSubmit.sectionOrder,\n              requiredSubmissionParts: selectedSubmissionProfile.parts.map((part) => part.partId),\n              previousStructuredSections: previousResubmissionSeed.sections || null,\n              changedSubmissionParts: structuredDiffForSubmit?.changedParts || [],\n              resubmissionStructureSource: previousResubmissionSeed.source || "structured",\n            }\n          : {}),\n        attempt: selectedResubmissionCount + 2,`,
  "structured callable resubmission payload",
);

replaceOnce(
  `            <p style={{ ...styles.helperText, margin: 0 }}>\n              You can resubmit <strong>{assignmentInfo}</strong> here in the app. Tell us exactly what improved so tutors can see this is stronger work.\n            </p>`,
  `            <p style={{ ...styles.helperText, margin: 0 }}>\n              You can resubmit <strong>{assignmentInfo}</strong> here in the app. Tell us exactly what improved so tutors can see this is stronger work.\n            </p>\n            {structuredResubmissionEnabled ? (\n              <div\n                data-structured-resubmission-template="true"\n                style={{ border: "1px solid #bfdbfe", borderRadius: 10, padding: 10, background: "#eff6ff", color: "#1e3a8a" }}\n              >\n                Your previous answers are loaded below. Correct only the Teile that need improvement, keep every TEIL heading, and leave correct answers unchanged.\n                {structuredResubmissionDiff?.changedParts?.length\n                  ? \` Changed now: \${formatMissingStructuredParts(structuredResubmissionDiff.changedParts)}.\`\n                  : ""}\n              </div>\n            ) : previousResubmissionSeed?.text ? (\n              <InfoBox tone="warning">\n                This is an older submission that Falowen could not separate confidently. Your previous text is loaded unchanged, so use the legacy corrected-text format.\n              </InfoBox>\n            ) : null}`,
  "structured resubmission guidance",
);

replaceOnce(
  `              <span style={styles.label}>Corrected text</span>`,
  `              <span style={styles.label}>{structuredResubmissionEnabled ? "Corrected answers" : "Corrected text"}</span>`,
  "resubmission field label",
);

replaceOnce(
  `                placeholder="Paste your corrected letter/text here."`,
  `                placeholder={structuredResubmissionEnabled ? "Your previous answers are loaded here." : "Paste your corrected letter/text here."}`,
  "structured resubmission placeholder",
);

replaceOnce(
  `              <WordProgress value={resubmissionText} minimumWords={DEFAULT_ASSIGNMENT_SUBMISSION_WORDS} />`,
  `              <WordProgress value={resubmissionAnswerText} minimumWords={DEFAULT_ASSIGNMENT_SUBMISSION_WORDS} />`,
  "structured resubmission word count",
);

replaceOnce(
  `            <p style={{ ...styles.helperText, margin: 0 }}>\n              Resubmissions must include clear edits. For full text: at least {MIN_RESUBMISSION_CHANGED_CHARACTERS} changed characters and {MIN_RESUBMISSION_NEW_WORDS} new words. For short answer lists (1.a, 2.b...), change at least {MIN_OBJECTIVE_CHANGED_ANSWERS} answers.\n            </p>`,
  `            <p style={{ ...styles.helperText, margin: 0 }}>\n              {structuredResubmissionEnabled\n                ? "Change only what needs correction. Falowen checks changes Teil by Teil, so one real correction is enough; correct Teile can remain unchanged."\n                : \`Resubmissions must include clear edits. For full text: at least \${MIN_RESUBMISSION_CHANGED_CHARACTERS} changed characters and \${MIN_RESUBMISSION_NEW_WORDS} new words. For short answer lists (1.a, 2.b...), change at least \${MIN_OBJECTIVE_CHANGED_ANSWERS} answers.\`}\n            </p>`,
  "structured resubmission edit guidance",
);

const requiredMarkers = [
  "resolveStructuredResubmissionSeed",
  "compareStructuredSubmissionSections",
  'const resubmissionSeedRef = useRef("")',
  "const previousResubmissionSeed = useMemo(",
  "const resubmissionEditorSeed = useMemo(",
  "const structuredResubmissionEnabled = Boolean(",
  "Your answers are unchanged. Correct at least one Teil",
  "previousStructuredSections: previousResubmissionSeed.sections || null",
  "changedSubmissionParts: structuredDiffForSubmit?.changedParts || []",
  'data-structured-resubmission-template="true"',
  "Falowen checks changes Teil by Teil",
];
requiredMarkers.forEach((marker) => {
  if (!source.includes(marker)) throw new Error(`Structured resubmission marker missing: ${marker}`);
});

fs.writeFileSync(targetPath, source, "utf8");
console.log("Structured resubmissions now preload previous TEIL answers and preserve section metadata.");
