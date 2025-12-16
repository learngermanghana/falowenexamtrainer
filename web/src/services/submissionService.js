const STORAGE_KEY = "exam-coach-submission-store";
const STUDENT_CODE_KEY = "exam-coach-student-codes";

const isBrowser = typeof window !== "undefined";

const createEmptyStore = () => ({
  drafts_v2: {},
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

export const loadDraftForStudent = ({ email, studentCode, level }) => {
  const store = readStore();
  const studentKey = buildStudentKey(email, studentCode);
  const levelKey = normalizeLevel(level);
  const draft = store.drafts_v2?.[studentKey]?.[levelKey] || {};

  return {
    content: draft.content || "",
    updatedAt: draft.updatedAt || null,
    path: `drafts_v2/${studentKey}/${levelKey}`,
  };
};

export const saveDraftForStudent = ({ email, studentCode, level, content }) => {
  const store = readStore();
  const studentKey = buildStudentKey(email, studentCode);
  const levelKey = normalizeLevel(level);
  const now = new Date().toISOString();

  if (!store.drafts_v2[studentKey]) {
    store.drafts_v2[studentKey] = {};
  }

  store.drafts_v2[studentKey][levelKey] = {
    content,
    updatedAt: now,
  };

  writeStore(store);

  return {
    savedAt: now,
    path: `drafts_v2/${studentKey}/${levelKey}`,
  };
};

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
      node[segment] = { content, [timestampKey]: now };
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

export const isSubmissionLocked = ({ email, studentCode }) => {
  const store = readStore();
  const studentKey = buildStudentKey(email, studentCode);
  const lock = store.submission_locks?.[studentKey];

  return {
    locked: Boolean(lock?.locked),
    lockedAt: lock?.lockedAt || null,
    lockPath: `submission_locks/${studentKey}`,
    level: lock?.level,
  };
};

export const submitFinalWork = ({ email, studentCode, level, content }) => {
  const store = readStore();
  const studentKey = buildStudentKey(email, studentCode);
  const levelKey = normalizeLevel(level);
  const existingLock = store.submission_locks?.[studentKey];

  if (existingLock?.locked) {
    return {
      locked: true,
      lockedAt: existingLock.lockedAt,
      submissionPath: `submissions/${levelKey}/${studentKey}`,
      lockPath: `submission_locks/${studentKey}`,
    };
  }

  const now = new Date().toISOString();

  if (!store.submissions[levelKey]) {
    store.submissions[levelKey] = {};
  }

  store.submissions[levelKey][studentKey] = {
    email,
    studentCode,
    content,
    submittedAt: now,
  };

  store.submission_locks[studentKey] = {
    locked: true,
    lockedAt: now,
    level: levelKey,
  };

  writeStore(store);

  return {
    locked: false,
    submittedAt: now,
    submissionPath: `submissions/${levelKey}/${studentKey}`,
    lockPath: `submission_locks/${studentKey}`,
  };
};

export const submitWorkToSpecificPath = ({ path, content }) =>
  writeContentToPath({ path, content, timestampKey: "submittedAt" });
