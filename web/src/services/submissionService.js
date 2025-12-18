const STORAGE_KEY = "exam-coach-submission-store";
const STUDENT_CODE_KEY = "exam-coach-student-codes";

const isBrowser = typeof window !== "undefined";

const createEmptyStore = () => ({
  drafts_v2: {},
  draft_answers: {},
  submissions: {},
  submission_locks: {},
});

const readStore = () => {
  if (!isBrowser) return createEmptyStore();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : createEmptyStore();
  } catch (error) {
    console.warn("Failed to read submission store", error);
    return createEmptyStore();
  }
};

const writeStore = (store) => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (error) {
    console.warn("Failed to persist submission store", error);
  }
};

const normalizeLevel = (level) => (level || "general").toString();

const sanitizeKey = (value) =>
  (value || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9@._-]/gi, "-");

const buildStudentKey = (email, studentCode) => {
  const safeEmail = sanitizeKey(email || "guest");
  const safeCode = sanitizeKey(studentCode || "no-code");
  return `${safeEmail}__${safeCode || "no-code"}`;
};

const buildLockId = ({ level, studentCode, lessonKey }) =>
  `${normalizeLevel(level)}__${sanitizeKey(studentCode || "no-code")}__${sanitizeKey(
    lessonKey || "lesson"
  )}`;

export const loadStudentCodeForEmail = (email) => {
  if (!isBrowser || !email) return "";
  try {
    const raw = window.localStorage.getItem(STUDENT_CODE_KEY);
    if (!raw) return "";
    const parsed = JSON.parse(raw);
    return parsed[email] || "";
  } catch (error) {
    console.warn("Failed to load student code", error);
    return "";
  }
};

export const rememberStudentCodeForEmail = (email, studentCode) => {
  if (!isBrowser || !email) return;
  try {
    const raw = window.localStorage.getItem(STUDENT_CODE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed[email] = studentCode;
    window.localStorage.setItem(STUDENT_CODE_KEY, JSON.stringify(parsed));
  } catch (error) {
    console.warn("Failed to remember student code", error);
  }
};

export const loadDraftForStudent = ({ email, studentCode, level, lessonKey }) => {
  const store = readStore();
  const studentKey = sanitizeKey(studentCode || "no-code");
  const combinedKey = buildStudentKey(email, studentCode);
  const levelKey = normalizeLevel(level);
  const safeLessonKey = sanitizeKey(lessonKey || "lesson");

  const userRootDraft =
    store.drafts_v2?.[studentKey]?.lessons?.[safeLessonKey] ||
    store.drafts_v2?.[combinedKey]?.lessons?.[safeLessonKey] || {};
  const legacyFlatDraft =
    store.drafts_v2?.[studentKey]?.[levelKey] ||
    store.drafts_v2?.[combinedKey]?.[levelKey] || {};
  const levelRootDraft =
    store.drafts_v2?.[levelKey]?.lessons?.[safeLessonKey]?.users?.[studentKey] || {};
  const legacyDraft = store.draft_answers?.[safeLessonKey]?.[studentKey] || {};

  const draft = userRootDraft.updatedAt
    ? userRootDraft
    : legacyFlatDraft.updatedAt
      ? legacyFlatDraft
    : levelRootDraft.updatedAt
      ? levelRootDraft
      : legacyDraft;

  return {
    content: draft.content || draft.text || "",
    text: draft.text || draft.content || "",
    updatedAt: draft.updatedAt || draft.updated_at || null,
    updated_at: draft.updated_at || draft.updatedAt || null,
    assignmentTitle: draft.assignmentTitle || "",
    level: draft.level || levelKey,
    lessonKey: draft.lessonKey || safeLessonKey,
    path: `drafts_v2/${studentKey}/lessons/${safeLessonKey}`,
  };
};

export const saveDraftForStudent = ({
  email,
  studentCode,
  level,
  lessonKey,
  content,
  assignmentTitle,
}) => {
  const store = readStore();
  const studentKey = sanitizeKey(studentCode || "no-code");
  const levelKey = normalizeLevel(level);
  const safeLessonKey = sanitizeKey(lessonKey || "lesson");
  const now = new Date().toISOString();

  if (!store.drafts_v2[studentKey]) {
    store.drafts_v2[studentKey] = { lessons: {} };
  }
  if (!store.drafts_v2[studentKey].lessons) {
    store.drafts_v2[studentKey].lessons = {};
  }

  store.drafts_v2[studentKey].lessons[safeLessonKey] = {
    content,
    text: content,
    updatedAt: now,
    updated_at: now,
    assignmentTitle: assignmentTitle || "",
    level: levelKey,
    lessonKey: safeLessonKey,
    email,
    studentCode,
  };

  writeStore(store);

  return {
    savedAt: now,
    updatedAt: now,
    text: content,
    content,
    path: `drafts_v2/${studentKey}/lessons/${safeLessonKey}`,
  };
};

export const loadDraftMetaFromDb = (params) => loadDraftForStudent(params);

const writeContentToPath = ({ path, content, timestampKey }) => {
  const store = readStore();
  const now = new Date().toISOString();
  const safePath = (path || "").replace(/^\/+/, "");
  const segments = safePath.split("/").filter(Boolean);

  if (segments.length === 0) {
    return { savedAt: now, path: safePath };
  }

  let node = store;
  segments.forEach((segment, index) => {
    if (index === segments.length - 1) {
      node[segment] = { content, text: content, [timestampKey]: now };
    } else {
      if (!node[segment]) node[segment] = {};
      node = node[segment];
    }
  });

  writeStore(store);

  return { savedAt: now, path: safePath };
};

export const saveDraftToSpecificPath = ({ path, content }) =>
  writeContentToPath({ path, content, timestampKey: "updatedAt" });

export const isSubmissionLocked = ({ email, studentCode, level, lessonKey }) => {
  const store = readStore();
  const lockId = buildLockId({ level, studentCode, lessonKey });
  const lock = store.submission_locks?.[lockId];
  const levelKey = normalizeLevel(level);
  const safeLessonKey = sanitizeKey(lessonKey || "lesson");
  const safeStudentCode = sanitizeKey(studentCode || "no-code");

  const submission = store.submissions?.[levelKey]?.posts?.find(
    (post) =>
      post.student_code === safeStudentCode &&
      (post.lesson_key === safeLessonKey || post.lessonKey === safeLessonKey)
  );

  return {
    locked: Boolean(lock?.locked || submission),
    lockedAt: lock?.lockedAt || submission?.submittedAt || null,
    lockPath: `submission_locks/${lockId}`,
    level: lock?.level || submission?.level,
    submission,
  };
};

export const loadSubmissionForStudent = ({ level, studentCode, lessonKey }) => {
  const store = readStore();
  const levelKey = normalizeLevel(level);
  const safeLessonKey = sanitizeKey(lessonKey || "lesson");
  const safeStudentCode = sanitizeKey(studentCode || "no-code");

  const submission = store.submissions?.[levelKey]?.posts?.find(
    (post) =>
      post.student_code === safeStudentCode &&
      (post.lesson_key === safeLessonKey || post.lessonKey === safeLessonKey)
  );

  if (!submission) return null;

  return {
    ...submission,
    content: submission.content || submission.text || submission.answer || "",
    text: submission.content || submission.text || submission.answer || "",
    receiptCode: submission.receiptCode,
    submissionPath: `submissions/${levelKey}/posts`,
    submittedAt: submission.submittedAt,
  };
};

export const submitFinalWork = ({
  email,
  studentCode,
  level,
  content,
  assignmentTitle,
  lessonKey,
}) => {
  const store = readStore();
  const levelKey = normalizeLevel(level);
  const lockId = buildLockId({ level, studentCode, lessonKey });
  const existingLock = store.submission_locks?.[lockId];

  if (existingLock?.locked) {
    return {
      locked: true,
      lockedAt: existingLock.lockedAt,
      submissionPath: `submissions/${levelKey}/${lockId}`,
      lockPath: `submission_locks/${lockId}`,
    };
  }

  const now = new Date().toISOString();

  if (!store.submissions[levelKey]) {
    store.submissions[levelKey] = {};
  }

  const receiptCode = Math.random().toString(36).slice(2, 8).toUpperCase();

  store.submissions[levelKey][lockId] = {
    email,
    studentCode,
    lessonKey: sanitizeKey(lessonKey || "lesson"),
    content,
    text: content,
    submittedAt: now,
    assignmentTitle: assignmentTitle || "",
    status: "submitted",
    receiptCode,
  };

  store.submission_locks[lockId] = {
    locked: true,
    lockedAt: now,
    level: levelKey,
    lessonKey: sanitizeKey(lessonKey || "lesson"),
    studentCode,
  };

  writeStore(store);

  return {
    locked: false,
    submittedAt: now,
    submissionPath: `submissions/${levelKey}/${lockId}`,
    lockPath: `submission_locks/${lockId}`,
    receiptCode,
  };
};

export const submitWorkToSpecificPath = ({
  path,
  content,
  studentCode,
  lessonKey,
  level,
  email,
  assignmentTitle,
}) => {
  const store = readStore();
  const now = new Date().toISOString();
  const levelKey = normalizeLevel(level);
  const safeLessonKey = sanitizeKey(lessonKey || "lesson");
  const safeStudentCode = sanitizeKey(studentCode || "no-code");
  const lockId = buildLockId({ level, studentCode, lessonKey });
  const receiptCode = Math.random().toString(36).slice(2, 8).toUpperCase();

  const existingLock = store.submission_locks?.[lockId];
  const existingSubmission = store.submissions?.[levelKey]?.posts?.find(
    (post) =>
      post.student_code === safeStudentCode &&
      (post.lesson_key === safeLessonKey || post.lessonKey === safeLessonKey)
  );

  if (existingLock?.locked || existingSubmission) {
    return {
      locked: true,
      lockedAt: existingLock?.lockedAt || existingSubmission?.submittedAt,
      lockPath: `submission_locks/${lockId}`,
      submissionPath: `submissions/${levelKey}/posts`,
      receiptCode: existingSubmission?.receiptCode,
    };
  }

  if (!store.submissions[levelKey]) {
    store.submissions[levelKey] = { posts: [] };
  }
  if (!store.submissions[levelKey].posts) {
    store.submissions[levelKey].posts = [];
  }

  if (!store.submission_locks) {
    store.submission_locks = {};
  }
  store.submission_locks[lockId] = {
    locked: true,
    lockedAt: now,
    level: levelKey,
    lessonKey: safeLessonKey,
    studentCode: safeStudentCode,
  };

  store.submissions[levelKey].posts.push({
    content,
    text: content,
    submittedAt: now,
    student_code: safeStudentCode,
    lesson_key: safeLessonKey,
    level: levelKey,
    email,
    assignment_title: assignmentTitle || "",
    status: "submitted",
    receiptCode,
  });

  if (store.drafts_v2?.[safeStudentCode]?.lessons?.[safeLessonKey]) {
    store.drafts_v2[safeStudentCode].lessons[safeLessonKey].archivedAt = now;
  }

  writeStore(store);

  return { savedAt: now, path, receiptCode, lockPath: `submission_locks/${lockId}` };
};
