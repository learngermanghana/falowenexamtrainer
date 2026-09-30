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

const replacePresentationOnce = (anchors, after, label) => {
  if (source.includes(after)) return;
  const candidates = Array.isArray(anchors) ? anchors : [anchors];
  const anchor = candidates.find((candidate) => source.includes(candidate));
  if (!anchor) {
    console.warn(`Skipping optional ${label}: the presentation copy changed, but structured resubmission logic can still build.`);
    return;
  }
  source = source.replace(anchor, after);
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

if (!source.includes('data-structured-resubmission-template="true"')) {
  const compactGuidanceAnchor = `            <p style={{ ...styles.helperText, margin: 0, lineHeight: 1.6 }}>
              Review your tutor feedback, correct the work, then submit the improved version below.
            </p>`;
  const correctedWorkFieldAnchor = `            <label style={{ ...styles.field, margin: 0 }}>
              <span style={styles.label}>Corrected work</span>`;
  const guidance = `            {structuredResubmissionEnabled ? (
              <p data-structured-resubmission-template="true" style={{ ...styles.helperText, margin: 0 }}>
                Your previous TEIL answers are loaded below. Keep the headings and correct only what needs improvement.
              </p>
            ) : null}`;

  if (source.includes(compactGuidanceAnchor)) {
    source = source.replace(compactGuidanceAnchor, `${compactGuidanceAnchor}
${guidance}`);
  } else if (source.includes(correctedWorkFieldAnchor)) {
    source = source.replace(correctedWorkFieldAnchor, `${guidance}
${correctedWorkFieldAnchor}`);
  } else {
    throw new Error("Could not patch structured resubmission guidance: no compact guidance or corrected-work field anchor was found.");
  }
}

replacePresentationOnce(
  [
    `              <span style={styles.label}>Corrected work</span>`,
    `              <span style={styles.label}>Corrected text</span>`,
  ],
  `              <span style={styles.label}>{structuredResubmissionEnabled ? "Corrected answers" : "Corrected work"}</span>`,
  "resubmission field label",
);

replacePresentationOnce(
  [
    `                placeholder="Paste or type your corrected work here."`,
    `                placeholder="Paste your corrected letter/text here."`,
  ],
  `                placeholder={structuredResubmissionEnabled ? "Your previous answers are loaded here." : "Paste or type your corrected work here."}`,
  "structured resubmission placeholder",
);

replaceOnce(
  `              <WordProgress value={resubmissionText} minimumWords={DEFAULT_ASSIGNMENT_SUBMISSION_WORDS} />`,
  `              <WordProgress value={resubmissionAnswerText} minimumWords={DEFAULT_ASSIGNMENT_SUBMISSION_WORDS} />`,
  "structured resubmission word count",
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
  "Your previous TEIL answers are loaded below.",
];
requiredMarkers.forEach((marker) => {
  if (!source.includes(marker)) throw new Error(`Structured resubmission marker missing: ${marker}`);
});

fs.writeFileSync(targetPath, source, "utf8");
console.log("Structured resubmissions now preload previous TEIL answers and preserve section metadata.");
