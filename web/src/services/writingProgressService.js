import {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  isFirebaseConfigured,
  limit,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "../firebase";

const COLLECTION_NAME = "writingProgress";
const DEFAULT_ATTEMPT_PAGE_SIZE = 25;
const MAX_ATTEMPT_PAGE_SIZE = 50;

const normalizeOwnerKey = (value = "") => value.trim().toLowerCase();

const normalizeWorkspaceKey = (value = "") =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);

const buildDocId = ({ userId, studentCode, mode, workspaceKey } = {}) => {
  const owner = normalizeOwnerKey(studentCode) || normalizeOwnerKey(userId);
  if (!owner) return "";
  const baseId = `${owner}__${mode || "course"}`;
  const workspace = normalizeWorkspaceKey(workspaceKey);
  return workspace ? `${baseId}__${workspace}` : baseId;
};

const timestampToMillis = (value) => {
  if (!value) return 0;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.toDate === "function") return value.toDate().getTime();
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const safeAttemptId = (attempt = {}) =>
  String(attempt.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`)
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .slice(0, 120);

export const loadWritingProgress = async ({
  userId,
  studentCode,
  mode,
  workspaceKey,
} = {}) => {
  const docId = buildDocId({ userId, studentCode, mode, workspaceKey });
  if (!docId) return null;

  if (!isFirebaseConfigured || !db) {
    return null;
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, docId);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      return null;
    }
    return { id: snapshot.id, ...snapshot.data() };
  } catch (error) {
    console.error("Failed to load writing progress from Firebase", error);
    return null;
  }
};

export const saveWritingProgress = async ({
  userId,
  studentCode,
  mode,
  workspaceKey,
  data,
} = {}) => {
  const docId = buildDocId({ userId, studentCode, mode, workspaceKey });
  if (!docId || !userId) return false;
  const payload = {
    ...data,
    userId,
    studentCode: studentCode || null,
    mode: mode || "course",
    workspaceKey: normalizeWorkspaceKey(workspaceKey) || null,
    updatedAt: new Date().toISOString(),
  };

  if (!isFirebaseConfigured || !db) return false;

  try {
    const docRef = doc(db, COLLECTION_NAME, docId);
    await setDoc(
      docRef,
      {
        ...payload,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    return true;
  } catch (error) {
    console.error("Failed to save writing progress to Firebase", error);
    return false;
  }
};

export const saveWritingAttempt = async ({
  userId,
  studentCode,
  mode,
  workspaceKey,
  attempt,
} = {}) => {
  const ownerId = buildDocId({ userId, studentCode, mode, workspaceKey });
  if (!ownerId || !userId || !attempt || !isFirebaseConfigured || !db) {
    return false;
  }

  try {
    const attemptsRef = collection(db, COLLECTION_NAME, ownerId, "attempts");
    const attemptRef = doc(attemptsRef, safeAttemptId(attempt));
    await setDoc(
      attemptRef,
      {
        ...attempt,
        userId,
        studentCode: studentCode || null,
        mode: mode || "course",
        workspaceKey: normalizeWorkspaceKey(workspaceKey) || null,
        createdAt: attempt.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    return true;
  } catch (error) {
    console.error("Failed to save writing attempt", error);
    return false;
  }
};

export const loadWritingAttempts = async ({
  userId,
  studentCode,
  mode,
  workspaceKey,
  pageSize = DEFAULT_ATTEMPT_PAGE_SIZE,
  level,
  lessonId,
  workbookId,
} = {}) => {
  const ownerId = buildDocId({ userId, studentCode, mode, workspaceKey });
  if (!ownerId || !userId || !isFirebaseConfigured || !db) return [];

  try {
    const requestedSize = Math.min(
      Math.max(Number(pageSize) || DEFAULT_ATTEMPT_PAGE_SIZE, 1),
      MAX_ATTEMPT_PAGE_SIZE,
    );
    const attemptsQuery = query(
      collection(db, COLLECTION_NAME, ownerId, "attempts"),
      where("userId", "==", userId),
      limit(requestedSize),
    );
    const snapshot = await getDocs(attemptsQuery);
    const attempts = snapshot.docs
      .map((item) => ({ id: item.id, ...item.data() }))
      .filter((attempt) => {
        if (level && String(attempt.level || attempt.courseLevel || "").toUpperCase() !== String(level).toUpperCase()) {
          return false;
        }
        if (lessonId && attempt.lessonId !== lessonId) return false;
        if (workbookId && attempt.workbookId !== workbookId) return false;
        return true;
      })
      .sort(
        (left, right) =>
          timestampToMillis(right.createdAt || right.submissionDate) -
          timestampToMillis(left.createdAt || left.submissionDate),
      );

    return attempts;
  } catch (error) {
    console.error("Failed to load writing attempts from Firebase", error);
    return [];
  }
};

export const __TESTING__ = {
  buildDocId,
  normalizeWorkspaceKey,
};
