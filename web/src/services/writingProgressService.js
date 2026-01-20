import { db, doc, getDoc, isFirebaseConfigured, serverTimestamp, setDoc } from "../firebase";

const COLLECTION_NAME = "writingProgress";
const LOCAL_STORAGE_PREFIX = "falowen:writingProgress";

const normalizeOwnerKey = (value = "") => value.trim().toLowerCase();

const buildDocId = ({ userId, studentCode, mode } = {}) => {
  const owner = normalizeOwnerKey(studentCode) || normalizeOwnerKey(userId);
  if (!owner) return "";
  return `${owner}__${mode || "course"}`;
};

const buildLocalStorageKey = (docId) => `${LOCAL_STORAGE_PREFIX}:${docId}`;

const loadFromLocalStorage = (docId) => {
  if (typeof window === "undefined" || !docId) return null;
  try {
    const raw = window.localStorage.getItem(buildLocalStorageKey(docId));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to parse cached writing progress", error);
    return null;
  }
};

const saveToLocalStorage = (docId, data) => {
  if (typeof window === "undefined" || !docId) return;
  try {
    window.localStorage.setItem(buildLocalStorageKey(docId), JSON.stringify(data));
  } catch (error) {
    console.error("Failed to cache writing progress locally", error);
  }
};

export const loadWritingProgress = async ({ userId, studentCode, mode } = {}) => {
  const docId = buildDocId({ userId, studentCode, mode });
  if (!docId) return null;

  if (!isFirebaseConfigured || !db) {
    return loadFromLocalStorage(docId);
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, docId);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      return loadFromLocalStorage(docId);
    }
    const data = { id: snapshot.id, ...snapshot.data() };
    saveToLocalStorage(docId, data);
    return data;
  } catch (error) {
    console.error("Failed to load writing progress from Firebase", error);
    return loadFromLocalStorage(docId);
  }
};

export const saveWritingProgress = async ({ userId, studentCode, mode, data } = {}) => {
  const docId = buildDocId({ userId, studentCode, mode });
  if (!docId) return false;
  const payload = {
    ...data,
    userId,
    studentCode: studentCode || null,
    mode: mode || "course",
    updatedAt: new Date().toISOString(),
  };

  saveToLocalStorage(docId, payload);

  if (!isFirebaseConfigured || !db) return true;

  try {
    const docRef = doc(db, COLLECTION_NAME, docId);
    await setDoc(
      docRef,
      {
        ...payload,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error("Failed to save writing progress to Firebase", error);
    return false;
  }
};
