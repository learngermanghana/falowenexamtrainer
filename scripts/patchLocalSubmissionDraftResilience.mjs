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

if (!source.includes('from "../utils/submissionLocalDraftCache"')) {
  replaceOnce(
    `} from "../utils/structuredSubmissionTemplate";`,
    `} from "../utils/structuredSubmissionTemplate";\nimport {\n  buildSubmissionLocalDraftKey,\n  clearSubmissionLocalDraft,\n  pickFreshestSubmissionDraft,\n  readSubmissionLocalDraft,\n  writeSubmissionLocalDraft,\n} from "../utils/submissionLocalDraftCache";`,
    "local draft cache import",
  );
}

replaceOnce(
  `  const resubmissionSeedRef = useRef("");`,
  `  const resubmissionSeedRef = useRef("");\n  const localDraftSavedAtRef = useRef(null);\n  const [localDraftRevision, setLocalDraftRevision] = useState(0);`,
  "local draft state",
);

const localKeyAnchor = `  const getLockDocId = useCallback(`;
const localKeyBlock = `  const selectedLocalSubmissionDraftKey = useMemo(\n    () =>\n      buildSubmissionLocalDraftKey({\n        studentScopeKey,\n        level: selectedAssignmentLevel,\n        assignmentKey: selectedCanonicalAssignmentKey || selectedAssignmentId,\n        assignmentTitle: form.assignmentTitle,\n        mode: "submission",\n      }),\n    [\n      form.assignmentTitle,\n      selectedAssignmentId,\n      selectedAssignmentLevel,\n      selectedCanonicalAssignmentKey,\n      studentScopeKey,\n    ]\n  );\n\n  const selectedLocalResubmissionDraftKey = useMemo(\n    () =>\n      buildSubmissionLocalDraftKey({\n        studentScopeKey,\n        level: selectedAssignmentLevel,\n        assignmentKey: selectedCanonicalAssignmentKey || selectedAssignmentId,\n        assignmentTitle: form.assignmentTitle,\n        mode: "resubmission",\n      }),\n    [\n      form.assignmentTitle,\n      selectedAssignmentId,\n      selectedAssignmentLevel,\n      selectedCanonicalAssignmentKey,\n      studentScopeKey,\n    ]\n  );\n\n${localKeyAnchor}`;
replaceOnce(localKeyAnchor, localKeyBlock, "local draft keys");

replaceOnce(
  `    const currentAssignment = form.assignmentTitle;\n    const draft = draftsByAssignment[currentAssignment];\n    const assignmentChanged = lastAssignmentRef.current !== currentAssignment;`,
  `    const currentAssignment = form.assignmentTitle;\n    const cloudDraft = draftsByAssignment[currentAssignment] || null;\n    const localDraft = readSubmissionLocalDraft({ key: selectedLocalSubmissionDraftKey });\n    const freshestDraft = pickFreshestSubmissionDraft({ localDraft, cloudDraft });\n    const draft = freshestDraft.draft || cloudDraft;\n    const assignmentChanged = lastAssignmentRef.current !== currentAssignment;`,
  "freshest submission draft hydration",
);

replaceOnce(
  `      setAutosaveStatus((prev) => ({ ...prev, state: "idle" }));`,
  `      setAutosaveStatus(\n        freshestDraft.source === "local" && localDraft?.savedAt\n          ? { state: "local", savedAt: new Date(localDraft.savedAt) }\n          : { state: "idle", savedAt: null }\n      );`,
  "local recovery status",
);

replaceOnce(
  `    selectedAssignmentId,\n    selectedCanonicalAssignmentKey,\n  ]);`,
  `    selectedAssignmentId,\n    selectedCanonicalAssignmentKey,\n    selectedLocalSubmissionDraftKey,\n    localDraftRevision,\n  ]);`,
  "local hydration dependencies",
);

const remoteAutosaveAnchor = `  useEffect(() => {\n    if (autosaveTimerRef.current) {`;
const localAutosaveBlock = `  useEffect(() => {\n    if (!form.assignmentTitle || !selectedLocalSubmissionDraftKey || isSelectedLocked) return undefined;\n\n    const timer = setTimeout(() => {\n      const saved = writeSubmissionLocalDraft({\n        key: selectedLocalSubmissionDraftKey,\n        payload: {\n          status: "local_draft",\n          assignmentTitle: form.assignmentTitle,\n          assignmentKey: selectedCanonicalAssignmentKey || selectedAssignmentId,\n          canonicalAssignmentKey: selectedCanonicalAssignmentKey || selectedAssignmentId,\n          level: selectedAssignmentLevel,\n          day: selectedAssignmentDay,\n          chapter: selectedAssignmentChapter || "",\n          submissionText: form.submissionText,\n          ...(parsedStructuredSubmission\n            ? {\n                submissionStructureVersion: selectedSubmissionProfile?.version || 1,\n                structuredSections: parsedStructuredSubmission.sections,\n                submissionSectionOrder: parsedStructuredSubmission.sectionOrder,\n                requiredSubmissionParts: selectedSubmissionProfile.parts.map((part) => part.partId),\n              }\n            : {}),\n        },\n      });\n\n      if (!saved) return;\n      localDraftSavedAtRef.current = new Date(saved.savedAt);\n      setLocalDraftRevision((value) => value + 1);\n      setAutosaveStatus((previous) =>\n        previous.state === "saved"\n          ? previous\n          : { state: "local", savedAt: localDraftSavedAtRef.current }\n      );\n    }, 300);\n\n    return () => clearTimeout(timer);\n  }, [\n    form.assignmentTitle,\n    form.submissionText,\n    isSelectedLocked,\n    parsedStructuredSubmission,\n    selectedAssignmentChapter,\n    selectedAssignmentDay,\n    selectedAssignmentId,\n    selectedAssignmentLevel,\n    selectedCanonicalAssignmentKey,\n    selectedLocalSubmissionDraftKey,\n    selectedSubmissionProfile,\n  ]);\n\n${remoteAutosaveAnchor}`;
replaceOnce(remoteAutosaveAnchor, localAutosaveBlock, "local submission autosave");

replaceOnce(
  `      } catch (error) {\n        console.error("Autosave failed", error);\n        setAutosaveStatus((prev) => ({ ...prev, state: "idle" }));\n      }`,
  `      } catch (error) {\n        console.error("Autosave failed", error);\n        const localDraft = readSubmissionLocalDraft({ key: selectedLocalSubmissionDraftKey });\n        const localSavedAt = localDraft?.savedAt ? new Date(localDraft.savedAt) : localDraftSavedAtRef.current;\n        setAutosaveStatus(\n          localSavedAt\n            ? { state: "local", savedAt: localSavedAt }\n            : { state: "idle", savedAt: null }\n        );\n      }`,
  "cloud autosave fallback state",
);

replaceOnce(
  `  }, [form.assignmentTitle, form.submissionText, isSelectedLocked, persistSubmission, status.loading]);`,
  `  }, [form.assignmentTitle, form.submissionText, isSelectedLocked, persistSubmission, selectedLocalSubmissionDraftKey, status.loading]);`,
  "cloud autosave local key dependency",
);

replaceOnce(
  `  const selectedDraft = useMemo(() => draftsByAssignment[form.assignmentTitle], [draftsByAssignment, form.assignmentTitle]);\n  const hasDraftForSelection = Boolean(selectedDraft?.submissionText);`,
  `  const cloudSelectedDraft = useMemo(() => draftsByAssignment[form.assignmentTitle] || null, [draftsByAssignment, form.assignmentTitle]);\n  const localSelectedResubmissionDraft = useMemo(\n    () => readSubmissionLocalDraft({ key: selectedLocalResubmissionDraftKey }),\n    [localDraftRevision, selectedLocalResubmissionDraftKey]\n  );\n  const selectedDraft = useMemo(() => {\n    const cloudResubmissionDraft = cloudSelectedDraft?.status === "resubmission_draft" ? cloudSelectedDraft : null;\n    const freshestResubmissionDraft = pickFreshestSubmissionDraft({\n      localDraft: localSelectedResubmissionDraft,\n      cloudDraft: cloudResubmissionDraft,\n    });\n    return freshestResubmissionDraft.draft || cloudSelectedDraft;\n  }, [cloudSelectedDraft, localSelectedResubmissionDraft]);\n  const hasDraftForSelection = Boolean(selectedDraft?.submissionText || selectedDraft?.resubmissionText);`,
  "freshest structured resubmission draft",
);

const resubmissionAutosaveAnchor = `  const handleSaveDraft = async () => {`;
const resubmissionAutosaveBlock = `  useEffect(() => {\n    if (!canShowResubmissionForm || !form.assignmentTitle || !selectedLocalResubmissionDraftKey) return undefined;\n\n    const timer = setTimeout(() => {\n      const saved = writeSubmissionLocalDraft({\n        key: selectedLocalResubmissionDraftKey,\n        payload: {\n          status: "local_resubmission_draft",\n          assignmentTitle: form.assignmentTitle,\n          assignmentKey: selectedCanonicalAssignmentKey || selectedAssignmentId,\n          canonicalAssignmentKey: selectedCanonicalAssignmentKey || selectedAssignmentId,\n          level: selectedAssignmentLevel,\n          day: selectedAssignmentDay,\n          chapter: selectedAssignmentChapter || "",\n          resubmissionText,\n          resubmissionImprovement,\n          ...(structuredResubmissionEnabled && parsedStructuredResubmission\n            ? {\n                submissionStructureVersion: selectedSubmissionProfile?.version || 1,\n                structuredSections: parsedStructuredResubmission.sections,\n                submissionSectionOrder: parsedStructuredResubmission.sectionOrder,\n                requiredSubmissionParts: selectedSubmissionProfile.parts.map((part) => part.partId),\n                previousStructuredSections: previousResubmissionSeed.sections || null,\n              }\n            : {}),\n        },\n      });\n      if (saved) setLocalDraftRevision((value) => value + 1);\n    }, 300);\n\n    return () => clearTimeout(timer);\n  }, [\n    canShowResubmissionForm,\n    form.assignmentTitle,\n    parsedStructuredResubmission,\n    previousResubmissionSeed,\n    resubmissionImprovement,\n    resubmissionText,\n    selectedAssignmentChapter,\n    selectedAssignmentDay,\n    selectedAssignmentId,\n    selectedAssignmentLevel,\n    selectedCanonicalAssignmentKey,\n    selectedLocalResubmissionDraftKey,\n    selectedSubmissionProfile,\n    structuredResubmissionEnabled,\n  ]);\n\n${resubmissionAutosaveAnchor}`;
replaceOnce(resubmissionAutosaveAnchor, resubmissionAutosaveBlock, "local resubmission autosave");

replaceOnce(
  `      // Clear editor after submission (preview remains available below)\n      setForm((prev) => ({ ...prev, submissionText: "", confirmed: true }));`,
  `      // Final submission is durable; remove the device shadow draft.\n      clearSubmissionLocalDraft({ key: selectedLocalSubmissionDraftKey });\n      // Clear editor after submission (preview remains available below)\n      setForm((prev) => ({ ...prev, submissionText: "", confirmed: true }));`,
  "clear local draft after submission",
);

replaceOnce(
  `      setResubmissionText("");\n      setResubmissionImprovement("");`,
  `      clearSubmissionLocalDraft({ key: selectedLocalResubmissionDraftKey });\n      setResubmissionText("");\n      setResubmissionImprovement("");`,
  "clear local draft after resubmission",
);

replaceOnce(
  `            ? \`Saved automatically at \${autosaveStatus.savedAt.toLocaleTimeString([], {\n                hour: "2-digit",\n                minute: "2-digit",\n              })}\`\n            : "Your draft is saved automatically while you type."}`,
  `            ? \`Saved automatically at \${autosaveStatus.savedAt.toLocaleTimeString([], {\n                hour: "2-digit",\n                minute: "2-digit",\n              })}\`\n            : autosaveStatus.state === "local" && autosaveStatus.savedAt\n              ? \`Saved on this device at \${autosaveStatus.savedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · cloud sync pending\`\n              : "Your draft is saved automatically while you type."}`,
  "local autosave status copy",
);

const requiredMarkers = [
  'from "../utils/submissionLocalDraftCache"',
  "const selectedLocalSubmissionDraftKey = useMemo(",
  "const selectedLocalResubmissionDraftKey = useMemo(",
  'status: "local_draft"',
  'status: "local_resubmission_draft"',
  "pickFreshestSubmissionDraft({ localDraft, cloudDraft })",
  "clearSubmissionLocalDraft({ key: selectedLocalSubmissionDraftKey })",
  "clearSubmissionLocalDraft({ key: selectedLocalResubmissionDraftKey })",
  "cloud sync pending",
];
requiredMarkers.forEach((marker) => {
  if (!source.includes(marker)) throw new Error(`Local draft resilience marker missing: ${marker}`);
});

fs.writeFileSync(targetPath, source, "utf8");
console.log("Submission and resubmission drafts now keep an offline-safe local shadow and recover the freshest copy.");
