// Shared publication contract for mock examinations at ALL Goethe levels.
// Exam content can be drafted independently of the timed, verified examination engine.
export const MOCK_FACTORY_LEVELS = Object.freeze(["A1", "A2", "B1", "B2", "C1", "C2"]);
export const MOCK_FACTORY_SECTIONS = Object.freeze(["lesen", "hoeren", "schreiben", "sprechen"]);
export const REQUIRED_RUNTIME_CAPABILITIES = Object.freeze([
  "serverAttempt", "serverObjectiveScoring", "verifiedWriting",
  "verifiedSpeaking", "completedResultSync", "safeRetry", "productionVerified",
]);

// These are established, historically ready routes. Their existing published
// behavior is retained; this allowlist does NOT automatically promote new IDs.
const HISTORICAL_PUBLISHED_MOCKS = Object.freeze([
  "a1-final-01", "a1-final-02", "a1-final-03",
  "a2-final-01", "a2-mock-02", "b1-final-01", "b2-final-01",
]);

export const MOCK_RUNTIME_REGISTRY = Object.freeze(Object.fromEntries(
  HISTORICAL_PUBLISHED_MOCKS.map(id => [id, Object.freeze({
    existingProductionRoute: true,
    ...Object.fromEntries(REQUIRED_RUNTIME_CAPABILITIES.map(key => [key, true])),
  })]),
));

export function missingMockRuntimeCapabilities(mockId, registry = MOCK_RUNTIME_REGISTRY) {
  const flags = registry[mockId] || {};
  return REQUIRED_RUNTIME_CAPABILITIES.filter(key => flags[key] !== true);
}

export function assertFullMockReady(exam, registry = MOCK_RUNTIME_REGISTRY) {
  if (!exam || !MOCK_FACTORY_LEVELS.includes(exam.level)) return exam;
  if (exam.mode !== "full" || exam.status !== "ready") return exam;
  if (!MOCK_FACTORY_SECTIONS.every(section => exam.sections?.some(
    name => String(name).toLowerCase().replace(/ö/g, "oe") === section,
  ))) {
    throw new Error(`Mock ${exam.id} is missing one or more exam sections.`);
  }
  const missing = missingMockRuntimeCapabilities(exam.id, registry);
  if (missing.length) {
    throw new Error(`Mock ${exam.id} cannot be published: ${missing.join(", ")}. Keep it draft-only until server verification, end-to-end scoring, result sync, and production checks pass.`);
  }
  return exam;
}

// This is a content/QA checklist, not publication authorization.
// Only repository code plus deployment can add an ID to the runtime registry.
export function validateMockDraft(draft) {
  const errors = [];
  if (!MOCK_FACTORY_LEVELS.includes(draft?.level)) errors.push("Choose a Goethe level A1–C2.");
  if (!/^[a-z][a-z0-9-]*$/.test(String(draft?.id || ""))) errors.push("Provide a safe mock ID.");
  if (!String(draft?.title || "").trim()) errors.push("Provide an exam title.");
  for (const section of MOCK_FACTORY_SECTIONS) {
    const part = draft?.sections?.[section] || {};
    if (part.ready !== true) errors.push(`${section}: content review incomplete`);
    if (!Number.isInteger(Number(part.questionCount)) || Number(part.questionCount) < 1) {
      errors.push(`${section}: declare the number of tasks/questions`);
    }
    if (section === "lesen" || section === "hoeren") {
      if (Number(part.answerKeyCount) !== Number(part.questionCount)) errors.push(`${section}: answer key count differs from question count`);
      if (!part.serverAnswerKeyVerified) errors.push(`${section}: server answer key not verified`);
    }
    if (section === "hoeren" && !part.audioAccessVerified) errors.push("hoeren: protected audio playback not verified");
    if ((section === "schreiben" || section === "sprechen") && !part.rubricVerified) {
      errors.push(`${section}: scoring rubric not verified`);
    }
  }
  if (!draft?.endToEnd?.scoreSavedInAdmin) errors.push("Admin score write not verified");
  if (!draft?.endToEnd?.scoreVisibleToStudent) errors.push("Student /100 or level-specific result not verified");
  if (!draft?.endToEnd?.idempotentRetry) errors.push("Failed submission recovery not verified");
  if (!draft?.endToEnd?.backendDeployed) errors.push("Backend production revision not verified");
  if (!draft?.endToEnd?.frontendDeployed) errors.push("Frontend production revision not verified");
  return errors;
}

export function makeMockDraft(level, number = 1) {
  if (!MOCK_FACTORY_LEVELS.includes(level)) throw new Error("Unsupported Goethe level");
  const n = Number(number);
  if (!Number.isInteger(n) || n < 1 || n > 999) throw new Error("Invalid mock number");
  const id = `${level.toLowerCase()}-mock-${String(n).padStart(2, "0")}`;
  return {
    id, level, title: `${level} Mock ${n}`, status: "draft",
    sections: Object.fromEntries(MOCK_FACTORY_SECTIONS.map(key=>[key,{
      ready: false, questionCount: 0, answerKeyCount: 0,
      serverAnswerKeyVerified: false, audioAccessVerified: false,
      rubricVerified: false, notes: "",
    }])),
    endToEnd: {
      scoreSavedInAdmin: false, scoreVisibleToStudent: false,
      idempotentRetry: false, backendDeployed: false, frontendDeployed: false,
    },
  };
}
