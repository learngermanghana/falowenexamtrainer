export const SUBMISSION_LOCAL_DRAFT_VERSION = 1;
export const SUBMISSION_LOCAL_DRAFT_PREFIX = `falowen:submission-local-draft:v${SUBMISSION_LOCAL_DRAFT_VERSION}`;

const normalizeIdPart = (value = "") =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "_")
    .slice(0, 180);

const toMillis = (value) => {
  if (!value) return 0;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.toDate === "function") return value.toDate().getTime();
  if (Number.isFinite(value?.seconds)) return Number(value.seconds) * 1000;
  if (value instanceof Date) return value.getTime();
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
};

const activeStorage = (storage) => storage || (typeof window !== "undefined" ? window.localStorage : null);

export const buildSubmissionLocalDraftKey = ({
  studentScopeKey,
  level,
  assignmentKey,
  assignmentTitle,
  mode = "submission",
} = {}) => {
  const student = normalizeIdPart(studentScopeKey || "anonymous");
  const normalizedLevel = normalizeIdPart(level || "general");
  const assignment = normalizeIdPart(assignmentKey || assignmentTitle || "unknown");
  const normalizedMode = normalizeIdPart(mode || "submission");
  return `${SUBMISSION_LOCAL_DRAFT_PREFIX}:${student}:${normalizedLevel}:${assignment}:${normalizedMode}`;
};

export const writeSubmissionLocalDraft = ({ storage, key, payload, now = Date.now() } = {}) => {
  const target = activeStorage(storage);
  if (!target || !key) return null;

  const savedAt = new Date(Number(now) || Date.now()).toISOString();
  const value = {
    ...(payload || {}),
    localDraftVersion: SUBMISSION_LOCAL_DRAFT_VERSION,
    savedAt,
  };

  try {
    target.setItem(key, JSON.stringify(value));
    return value;
  } catch {
    return null;
  }
};

export const readSubmissionLocalDraft = ({ storage, key } = {}) => {
  const target = activeStorage(storage);
  if (!target || !key) return null;
  try {
    const raw = target.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};

export const clearSubmissionLocalDraft = ({ storage, key } = {}) => {
  const target = activeStorage(storage);
  if (!target || !key) return false;
  try {
    target.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

export const getSubmissionDraftUpdatedMillis = (draft = {}) =>
  Math.max(
    toMillis(draft?.savedAt),
    toMillis(draft?.updatedAt),
    toMillis(draft?.createdAt),
    toMillis(draft?.resubmittedAt),
    toMillis(draft?.submittedAt)
  );

export const pickFreshestSubmissionDraft = ({ localDraft, cloudDraft } = {}) => {
  if (!localDraft && !cloudDraft) return { source: "none", draft: null };
  if (localDraft && !cloudDraft) return { source: "local", draft: localDraft };
  if (!localDraft && cloudDraft) return { source: "cloud", draft: cloudDraft };

  const localMillis = getSubmissionDraftUpdatedMillis(localDraft);
  const cloudMillis = getSubmissionDraftUpdatedMillis(cloudDraft);
  if (localMillis >= cloudMillis) return { source: "local", draft: localDraft };
  return { source: "cloud", draft: cloudDraft };
};
