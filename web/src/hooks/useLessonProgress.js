import { useEffect, useMemo, useState } from "react";
import { collection, db, getDocs, query, where } from "../firebase";
import { fetchResults } from "../services/resultsService";
import { resolveAssignmentCanonicalKey } from "../utils/assignmentIdentity";
import { normalizeCourseLevel } from "../utils/levelAccess";

const PASS_MARK = 60;
const SUBMISSION_COLLECTION = "submissions";

const normalizeString = (value) => String(value || "").trim();
const normalizeLower = (value) => normalizeString(value).toLowerCase();

const normalizeStudentCode = (studentProfile = {}, user = {}) =>
  normalizeString(
    studentProfile?.studentCode ||
      studentProfile?.studentcode ||
      studentProfile?.student_code ||
      studentProfile?.code ||
      studentProfile?.id ||
      user?.studentCode ||
      ""
  );

const normalizeEmail = (studentProfile = {}, user = {}) =>
  normalizeLower(studentProfile?.email || user?.email || "");

const unique = (values = []) => [...new Set(values.map(normalizeString).filter(Boolean))];

const studentCodeVariants = (studentCode) =>
  unique([studentCode, normalizeLower(studentCode), normalizeString(studentCode).toUpperCase()]);

const toMillis = (value) => {
  if (!value) return 0;
  if (typeof value?.toDate === "function") {
    const date = value.toDate();
    const millis = date?.getTime?.();
    return Number.isFinite(millis) ? millis : 0;
  }
  if (value?.seconds) return Number(value.seconds) * 1000;
  if (value instanceof Date) return Number.isFinite(value.getTime()) ? value.getTime() : 0;
  if (typeof value === "number") {
    // Firestore / JS timestamps are normally ms, but keep old second-based values safe.
    return value > 100000000000 ? value : value * 1000;
  }
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
};

const toIso = (millis) => (Number.isFinite(millis) && millis > 0 ? new Date(millis).toISOString() : null);

const toNumber = (value) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^\d.+-]+/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const inferLevelFromText = (value = "") => {
  const match = String(value || "").toUpperCase().match(/\b(A1|A2|B1|B2|C1|C2)\b/);
  return match?.[1] || "";
};

const getRowLevel = (row = {}, fallbackLevel = "") =>
  normalizeCourseLevel(
    row?.level ||
      row?.courseLevel ||
      inferLevelFromText(row?.assignmentId || row?.assignment_id || row?.assignmentKey || row?.canonicalAssignmentKey) ||
      fallbackLevel
  ) || "";

const getAssignmentIdFromRow = (row = {}, fallbackLevel = "") => {
  const rowLevel = getRowLevel(row, fallbackLevel);
  const rawAssignmentId =
    row?.assignmentId ||
    row?.assignment_id ||
    row?.assignmentKey ||
    row?.canonicalAssignmentKey ||
    row?.explicitId ||
    "";
  const assignmentTitle = row?.assignment || row?.assignmentTitle || row?.title || row?.topic || row?.text || "";

  const canonical = resolveAssignmentCanonicalKey({
    level: rowLevel,
    assignmentId: rawAssignmentId,
    assignmentTitle,
  });

  const direct = normalizeString(rawAssignmentId).toUpperCase();
  if (canonical) return canonical;
  if (/^(A1|A2|B1|B2|C1|C2)-/i.test(direct)) return direct;
  return direct && rowLevel ? `${rowLevel}-${direct}` : direct;
};

const getSubmissionMillis = (row = {}) =>
  Math.max(
    toMillis(row?.resubmittedAt),
    toMillis(row?.submittedAt),
    toMillis(row?.createdAt),
    toMillis(row?.updatedAt),
    toMillis(row?.date),
    toMillis(row?.timestamp)
  );

const getResultMillis = (row = {}) =>
  Math.max(
    toMillis(row?.markedAt),
    toMillis(row?.scoredAt),
    toMillis(row?.date),
    toMillis(row?.createdAt),
    toMillis(row?.created_at),
    toMillis(row?.updatedAt),
    toMillis(row?.timestamp)
  );

const isSameLevel = (row = {}, level = "") => {
  const expectedLevel = normalizeCourseLevel(level);
  if (!expectedLevel) return true;
  const rowLevel = getRowLevel(row, expectedLevel);
  return !rowLevel || rowLevel === "GENERAL" || rowLevel === expectedLevel;
};

const isSameStudent = (row = {}, studentCode = "") => {
  const expected = normalizeLower(studentCode);
  if (!expected) return true;
  const rowCode = normalizeLower(row?.studentCode || row?.studentcode || row?.student_code || row?.code || "");
  return !rowCode || rowCode === expected;
};

const isSubmissionStatus = (row = {}) => {
  const status = normalizeLower(row?.status || row?.reviewStatus || "");
  return !status || ["submitted", "resubmitted", "pending_review", "pending", "awaiting_review"].includes(status);
};

const compareByMillisDesc = (getMillis) => (left, right) => getMillis(right) - getMillis(left);

const pickLatest = (rows = [], getMillis) => {
  const sorted = rows.slice().sort(compareByMillisDesc(getMillis));
  return sorted[0] || null;
};

const buildBucketStatus = ({ assignmentId, submissions = [], results = [] }) => {
  const latestSubmission = pickLatest(submissions, getSubmissionMillis);
  const latestResult = pickLatest(results, getResultMillis);
  const latestSubmissionMillis = getSubmissionMillis(latestSubmission);
  const latestResultMillis = getResultMillis(latestResult);

  const scoredResults = results
    .map((row) => ({ row, score: toNumber(row?.score ?? row?.finalScore ?? row?.mark ?? row?.grade) }))
    .filter((entry) => typeof entry.score === "number");

  const bestScore = scoredResults.length
    ? Math.max(...scoredResults.map((entry) => entry.score))
    : null;
  const latestScore = toNumber(latestResult?.score ?? latestResult?.finalScore ?? latestResult?.mark ?? latestResult?.grade);
  const normalizedLatestResultStatus = normalizeLower(latestResult?.status || latestResult?.result || latestResult?.reviewStatus || "");
  const hasPendingSubmission = Boolean(
    latestSubmission && (!latestResult || latestSubmissionMillis >= latestResultMillis)
  );

  let status = "not_started";
  if (hasPendingSubmission) {
    status = normalizeLower(latestSubmission?.status) === "resubmitted" || Number(latestSubmission?.attempt || latestSubmission?.attemptNumber || 1) > 1
      ? "resubmitted"
      : "submitted";
  } else if (typeof latestScore === "number") {
    status = latestScore >= PASS_MARK ? "passed" : "failed";
  } else if (["passed", "pass", "approved", "complete", "completed"].includes(normalizedLatestResultStatus)) {
    status = "passed";
  } else if (["failed", "fail", "redo_required", "needs_correction"].includes(normalizedLatestResultStatus)) {
    status = "failed";
  } else if (latestSubmission) {
    status = normalizeLower(latestSubmission?.status) === "resubmitted" ? "resubmitted" : "submitted";
  }

  const passed = status === "passed";
  const failed = status === "failed";
  const submitted = ["submitted", "resubmitted", "passed", "failed"].includes(status);

  return {
    assignmentId,
    assignment_id: assignmentId,
    status,
    bestScore,
    latestScore,
    passed,
    failed,
    submitted,
    inProgress: false,
    hasSubmission: Boolean(latestSubmission),
    hasResult: Boolean(latestResult),
    submittedAt: toIso(latestSubmissionMillis),
    markedAt: toIso(latestResultMillis),
    lastUpdatedAt: toIso(Math.max(latestSubmissionMillis, latestResultMillis)),
    source: {
      submission: Boolean(latestSubmission),
      result: Boolean(latestResult),
      pendingSubmission: hasPendingSubmission,
    },
  };
};

export const buildProgressByAssignmentId = ({ submissions = [], results = [], level = "", studentCode = "" } = {}) => {
  const buckets = new Map();

  const ensureBucket = (assignmentId) => {
    if (!assignmentId) return null;
    if (!buckets.has(assignmentId)) buckets.set(assignmentId, { submissions: [], results: [] });
    return buckets.get(assignmentId);
  };

  submissions
    .filter((row) => isSameLevel(row, level) && isSameStudent(row, studentCode) && isSubmissionStatus(row))
    .forEach((row) => {
      const assignmentId = getAssignmentIdFromRow(row, level);
      const bucket = ensureBucket(assignmentId);
      if (bucket) bucket.submissions.push(row);
    });

  results
    .filter((row) => isSameLevel(row, level) && isSameStudent(row, studentCode))
    .forEach((row) => {
      const assignmentId = getAssignmentIdFromRow(row, level);
      const bucket = ensureBucket(assignmentId);
      if (bucket) bucket.results.push(row);
    });

  return Object.fromEntries(
    [...buckets.entries()].map(([assignmentId, bucket]) => [assignmentId, buildBucketStatus({ assignmentId, ...bucket })])
  );
};

const readSubmissionQuery = async (field, values) => {
  if (!db || !values.length) return [];
  const submissionsRef = collection(db, SUBMISSION_COLLECTION);
  const constraint = values.length > 1 ? where(field, "in", values.slice(0, 10)) : where(field, "==", values[0]);
  const snapshot = await getDocs(query(submissionsRef, constraint));
  return snapshot.docs.map((entry) => ({ id: entry.id, ...(entry.data() || {}) }));
};

const loadSubmissionsForStudent = async ({ studentCode, email, userId }) => {
  if (!db) return [];

  const tasks = [];
  if (userId) tasks.push(readSubmissionQuery("studentId", [userId]));
  if (studentCode) {
    const variants = studentCodeVariants(studentCode);
    tasks.push(readSubmissionQuery("studentCode", variants));
    tasks.push(readSubmissionQuery("studentcode", variants));
  }
  if (email) tasks.push(readSubmissionQuery("studentEmail", [email]));

  const settled = await Promise.allSettled(tasks);
  const rowsById = new Map();

  settled.forEach((result) => {
    if (result.status !== "fulfilled") {
      console.warn("Could not load one course-book submission query", result.reason);
      return;
    }
    result.value.forEach((row) => rowsById.set(row.id || `${row.assignmentKey}-${getSubmissionMillis(row)}`, row));
  });

  return [...rowsById.values()];
};

export const useLessonProgress = ({ studentProfile, user, level } = {}) => {
  const studentCode = useMemo(() => normalizeStudentCode(studentProfile, user), [studentProfile, user]);
  const email = useMemo(() => normalizeEmail(studentProfile, user), [studentProfile, user]);
  const userId = user?.uid || studentProfile?.uid || "";
  const normalizedLevel = normalizeCourseLevel(level) || "";
  const [state, setState] = useState({ loading: false, error: "", progressByAssignmentId: {} });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!studentCode && !email && !userId) {
        setState({ loading: false, error: "", progressByAssignmentId: {} });
        return;
      }

      setState((prev) => ({ ...prev, loading: true, error: "" }));

      try {
        const [submissionRows, resultPayload] = await Promise.all([
          loadSubmissionsForStudent({ studentCode, email, userId }),
          studentCode
            ? fetchResults({ level: normalizedLevel, studentCode, email }).catch((error) => {
                console.warn("Could not load course-book score rows", error);
                return { results: [] };
              })
            : Promise.resolve({ results: [] }),
        ]);

        const progressByAssignmentId = buildProgressByAssignmentId({
          submissions: submissionRows,
          results: resultPayload?.results || [],
          level: normalizedLevel,
          studentCode,
        });

        if (!cancelled) {
          setState({ loading: false, error: "", progressByAssignmentId });
        }
      } catch (error) {
        console.error("Failed to load lesson progress", error);
        if (!cancelled) {
          setState({ loading: false, error: "Could not load your latest lesson progress.", progressByAssignmentId: {} });
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [email, normalizedLevel, studentCode, userId]);

  return state;
};
