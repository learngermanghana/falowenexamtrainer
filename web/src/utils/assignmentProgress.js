import { getCourseScheduleAssignmentMetadata } from "../data/assignmentMetadata";
import { getCurriculumEntriesForLevel } from "../data/curriculumManifest";
import { resolveAssignmentCanonicalKey } from "./assignmentIdentity";

export const PASS_MARK = 60;
const ASSIGNMENT_PROGRESS_DEBUG = String(process.env.REACT_APP_ASSIGNMENT_PROGRESS_DEBUG || "").trim() === "1";

const toIsoDate = (value) => {
  if (!value) return null;
  if (typeof value === "object" && typeof value.toDate === "function") {
    const dt = value.toDate();
    return Number.isNaN(dt?.getTime?.()) ? null : dt.toISOString();
  }
  const dt = new Date(value);
  return Number.isNaN(dt.getTime()) ? null : dt.toISOString();
};

const toNumericScore = (value) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^\d.+-]+/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const STRUCTURED_ASSIGNMENT_ID_PATTERN = /^(A1|A2|B1|B2|C1|C2)-\d+(?:\.\d+)?$/i;
const DAY_ALIAS_ID_PATTERN = /^(A1|A2|B1|B2|C1|C2)-DAY-\d+(?:-TASK-\d+)?$/i;

const getResultIdentityRank = (row = {}) => {
  const rawKey = String(
    row?.assignmentId || row?.assignment_id || row?.assignmentKey || row?.explicitId || ""
  )
    .trim()
    .toUpperCase();

  if (!rawKey) return 0;
  if (STRUCTURED_ASSIGNMENT_ID_PATTERN.test(rawKey)) return 3;
  if (DAY_ALIAS_ID_PATTERN.test(rawKey)) return 1;
  return 2;
};

const pickLatestIso = (...values) => {
  const valid = values
    .map(toIsoDate)
    .filter(Boolean)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  return valid[0] || null;
};

const DAY_ALIAS_PATTERN = /^(A1|A2|B1|B2|C1|C2)-DAY-(\d+)(?:-TASK-(\d+))?$/i;
const LEVEL_TOKEN_PATTERN = /(A1|A2|B1|B2|C1|C2)/i;
const inferLevelFromText = (value = "") => {
  const match = String(value || "").toUpperCase().match(LEVEL_TOKEN_PATTERN);
  return match?.[1] || "";
};

const inferResultLevel = (result = {}) =>
  String(
    result?.level ||
      inferLevelFromText(result?.assignmentId || result?.assignment_id || result?.assignmentKey || result?.explicitId) ||
      inferLevelFromText(result?.assignment || result?.assignmentTitle || result?.title || result?.text || result?.chapter) ||
      ""
  )
    .trim()
    .toUpperCase();

const remapDayAliasToCanonicalAssignmentId = ({ canonicalAssignmentId, level }) => {
  const canonicalToken = String(canonicalAssignmentId || "").trim().toUpperCase();
  if (!canonicalToken) return "";

  const match = canonicalToken.match(DAY_ALIAS_PATTERN);
  if (!match) return canonicalToken;

  const resolvedLevel = String(level || match[1] || "").trim().toUpperCase();
  const assignmentDay = Number(match[2] || 0);
  const taskIndex = Math.max(Number(match[3] || 1), 1);
  if (!resolvedLevel || !assignmentDay) return canonicalToken;

  const tutorMarkedEntries = getCurriculumEntriesForLevel(resolvedLevel)
    .filter((entry) => Number(entry?.assignmentDay || 0) === assignmentDay)
    .filter((entry) => entry?.assignment === true)
    .sort((left, right) => String(left?.chapter || "").localeCompare(String(right?.chapter || ""), undefined, { numeric: true }));

  if (!tutorMarkedEntries.length) return canonicalToken;

  return tutorMarkedEntries[Math.min(taskIndex - 1, tutorMarkedEntries.length - 1)]?.assignment_id || canonicalToken;
};

export const resolveAssignmentIdWithFallback = ({
  assignmentId,
  level,
  assignmentTitle,
  fallbackKey,
}) =>
  // Migration safety:
  // - canonical assignmentId should always be present on all NEW write paths.
  // - fallbackKey exists only to keep legacy records (missing assignmentId / assignmentKey) visible.
  // - once legacy backfill is complete, fallbackKey branches can be removed safely.
  (() => {
    const canonical = resolveAssignmentCanonicalKey({
      level,
      assignmentId,
      assignmentTitle,
    });
    if (canonical) {
      return String(canonical).trim().toUpperCase();
    }
    return fallbackKey ? String(fallbackKey).trim().toUpperCase() : "";
  })();

export const resolveAssignmentStatus = ({
  assignmentId,
  draftRecord,
  submissionRecord,
  resultRecords,
  passMark = PASS_MARK,
}) => {
  const results = Array.isArray(resultRecords) ? resultRecords : resultRecords ? [resultRecords] : [];

  const hasExplicitPassed = results.some((row) => {
    if (row?.passed === true) return true;
    return String(row?.status || "").trim().toLowerCase() === "passed";
  });
  const hasExplicitFailed = results.some((row) => {
    if (row?.failed === true) return true;
    return String(row?.status || "").trim().toLowerCase() === "failed";
  });
  const hasExplicitSubmitted = results.some((row) => {
    if (row?.submitted === true || row?.inProgress === true) return true;
    return ["submitted", "in_progress", "inprogress", "in-progress"].includes(
      String(row?.status || "").trim().toLowerCase()
    );
  });

  const scored = results
    .map((row) => ({
      score: toNumericScore(row?.score ?? row?.finalScore ?? row?.mark ?? row?.grade),
      identityRank: getResultIdentityRank(row),
      updatedAt:
        row?.updatedAt ||
        row?.date ||
        row?.createdAt ||
        row?.created_at ||
        row?.timestamp ||
        null,
    }))
    .filter((row) => typeof row.score === "number");

  const bestScore =
    scored.length > 0 ? scored.reduce((max, row) => Math.max(max, row.score), Number.NEGATIVE_INFINITY) : null;
  const latestScored =
    scored.length > 0
      ? scored
          .slice()
          .sort((a, b) => {
            if (b.identityRank !== a.identityRank) return b.identityRank - a.identityRank;

            const bUpdatedAt = new Date(b.updatedAt || 0).getTime();
            const aUpdatedAt = new Date(a.updatedAt || 0).getTime();
            const safeBUpdatedAt = Number.isFinite(bUpdatedAt) ? bUpdatedAt : 0;
            const safeAUpdatedAt = Number.isFinite(aUpdatedAt) ? aUpdatedAt : 0;
            if (safeBUpdatedAt !== safeAUpdatedAt) return safeBUpdatedAt - safeAUpdatedAt;

            return b.score - a.score;
          })[0]
      : null;

  const hasDraft = Boolean(draftRecord);
  const hasSubmission = Boolean(submissionRecord);
  const hasResult = scored.length > 0 || hasExplicitPassed || hasExplicitFailed || hasExplicitSubmitted;

  const passed = hasExplicitPassed || (scored.length > 0 && bestScore >= passMark);
  const failed = !passed && (hasExplicitFailed || (scored.length > 0 && bestScore < passMark));
  const submitted = hasSubmission || hasResult;
  const inProgress = hasDraft && !submitted;

  let status = "not_started";
  if (passed) status = "passed";
  else if (failed) status = "failed";
  else if (submitted) status = "submitted";
  else if (inProgress) status = "in_progress";

  return {
    assignmentId,
    status,
    bestScore: Number.isFinite(bestScore) ? bestScore : null,
    latestScore: latestScored?.score ?? null,
    hasDraft,
    hasSubmission,
    hasResult,
    passed,
    failed,
    submitted,
    inProgress,
    lastUpdatedAt: pickLatestIso(
      draftRecord?.updatedAt,
      draftRecord?.createdAt,
      submissionRecord?.updatedAt,
      submissionRecord?.createdAt,
      latestScored?.updatedAt
    ),
    source: {
      draft: hasDraft,
      results: hasResult,
    },
  };
};

const normalizeCurriculumEntry = (entry = {}) => ({
  assignmentId: entry.assignmentId || entry.assignment_id || entry.assignmentKey || entry.chapter || "",
  chapter: entry.chapter || "",
  title: entry.title || entry.topic || "",
  topic: entry.topic || entry.title || "",
  mode: entry.mode || entry.type || "",
  assignmentDay: Number(entry.assignmentDay || entry.day || entry.dayNumber || 0) || null,
  assignment: Boolean(entry.assignment),
  level: String(entry.level || "").trim().toUpperCase(),
  raw: entry,
});

export const mergeAssignmentProgress = ({
  curriculumEntries,
  firestoreDrafts,
  firestoreSubmissions,
  sheetResults,
  studentCode,
  passMark = PASS_MARK,
}) => {
  const normalizedStudentCode = String(studentCode || "").trim().toLowerCase();
  const curriculum = Array.isArray(curriculumEntries) ? curriculumEntries : [];
  const drafts = Array.isArray(firestoreDrafts) ? firestoreDrafts : [];
  const submissions = Array.isArray(firestoreSubmissions) ? firestoreSubmissions : [];
  const results = Array.isArray(sheetResults) ? sheetResults : [];

  if (ASSIGNMENT_PROGRESS_DEBUG) {
    console.debug("[assignmentProgress][mergeAssignmentProgress] inputCounts", {
      studentCode: normalizedStudentCode || null,
      curriculumCount: curriculum.length,
      draftCount: drafts.length,
      submissionCount: submissions.length,
      resultCount: results.length,
    });
  }

  const byAssignmentId = new Map();

  const ensureBucket = (assignmentId, seed = {}) => {
    if (!assignmentId) return null;
    if (!byAssignmentId.has(assignmentId)) {
      byAssignmentId.set(assignmentId, {
        assignmentId,
        level: seed.level || "",
        chapter: seed.chapter || "",
        title: seed.title || "",
        topic: seed.topic || "",
        mode: seed.mode || "",
        assignmentDay: seed.assignmentDay ?? null,
        assignment: seed.assignment ?? false,
        draftRecord: null,
        submissionRecord: null,
        resultRecords: [],
      });
    }
    return byAssignmentId.get(assignmentId);
  };

  curriculum.forEach((rawEntry) => {
    const entry = normalizeCurriculumEntry(rawEntry);
    const canonical = resolveAssignmentIdWithFallback({
      assignmentId: entry.assignmentId,
      level: entry.level,
      assignmentTitle: entry.title,
    });
    if (!canonical) return;

    const metadata = getCourseScheduleAssignmentMetadata({
      level: entry.level,
      assignmentId: canonical,
      chapter: entry.chapter,
    });

    ensureBucket(canonical, {
      level: entry.level,
      chapter: metadata?.chapter || entry.chapter,
      title: metadata?.topic || entry.title,
      topic: metadata?.topic || entry.topic,
      mode: entry.mode,
      assignmentDay: metadata?.assignmentDay || entry.assignmentDay,
      assignment: metadata?.assignment ?? entry.assignment,
    });
  });

  drafts.forEach((draft, index) => {
    const level = String(draft?.level || "").toUpperCase();
    const canonical = resolveAssignmentIdWithFallback({
      assignmentId: draft?.assignmentId || draft?.assignment_id || draft?.assignmentKey,
      level,
      assignmentTitle: draft?.assignmentTitle || draft?.title,
      fallbackKey: `DRAFT-${index}`,
    });
    const bucket = ensureBucket(canonical, { level });
    if (!bucket) return;
    bucket.draftRecord = draft;
  });

  submissions.forEach((submission, index) => {
    const level = String(submission?.level || "").toUpperCase();
    const canonical = resolveAssignmentIdWithFallback({
      assignmentId: submission?.assignmentId || submission?.assignment_id || submission?.assignmentKey,
      level,
      assignmentTitle: submission?.assignmentTitle || submission?.title,
      fallbackKey: `SUBMISSION-${index}`,
    });
    const bucket = ensureBucket(canonical, { level });
    if (!bucket) return;
    bucket.submissionRecord = submission;
  });

  results.forEach((result, index) => {
    const rowStudentCode = String(result?.studentCode || result?.studentcode || "").trim().toLowerCase();
    if (normalizedStudentCode && rowStudentCode && rowStudentCode !== normalizedStudentCode) return;

    const level = inferResultLevel(result);
    const rawAssignmentTitle = String(
      result?.assignment || result?.assignmentTitle || result?.title || result?.text || ""
    ).trim();
    const rawAssignmentId = String(
      result?.assignmentId || result?.assignment_id || result?.assignmentKey || result?.explicitId || ""
    ).trim();
    const canonical = resolveAssignmentIdWithFallback({
      assignmentId: rawAssignmentId,
      level,
      assignmentTitle: rawAssignmentTitle,
      fallbackKey: `RESULT-${index}`,
    });
    const canonicalForMerge = remapDayAliasToCanonicalAssignmentId({
      canonicalAssignmentId: canonical,
      level,
    });

    const bucket = ensureBucket(canonicalForMerge, { level });
    if (!bucket) return;
    bucket.resultRecords.push(result);
  });

  const mergedAssignments = Array.from(byAssignmentId.values()).map((item) => {
    const metadata = getCourseScheduleAssignmentMetadata({
      level: item.level,
      assignmentId: item.assignmentId,
      chapter: item.chapter,
    });

    const resolved = resolveAssignmentStatus({
      assignmentId: item.assignmentId,
      draftRecord: item.draftRecord,
      submissionRecord: item.submissionRecord,
      resultRecords: item.resultRecords,
      passMark,
    });

    return {
      assignmentId: item.assignmentId,
      assignment_id: item.assignmentId,
      chapter: metadata?.chapter || item.chapter || item.assignmentId.split("-").slice(1).join("-"),
      title: metadata?.topic || item.title || item.topic || item.assignmentId,
      topic: metadata?.topic || item.topic || item.title || "",
      mode: item.mode || "",
      assignmentDay: metadata?.assignmentDay || item.assignmentDay || null,
      assignment: metadata?.assignment ?? item.assignment ?? false,
      ...resolved,
    };
  });

  if (ASSIGNMENT_PROGRESS_DEBUG) {
    console.debug("[assignmentProgress][mergeAssignmentProgress] outputCount", {
      studentCode: normalizedStudentCode || null,
      assignmentCount: mergedAssignments.length,
    });
  }

  return mergedAssignments;
};

export const toCourseTabStatus = (status = "") => {
  switch (String(status || "").toLowerCase()) {
    case "passed":
      return "passed";
    case "failed":
      return "failed";
    case "submitted":
      return "submitted";
    case "in_progress":
      return "inProgress";
    default:
      return "notStarted";
  }
};
