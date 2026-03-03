import { db, doc, getDoc, isFirebaseConfigured, serverTimestamp, setDoc } from "../firebase";

const COLLECTION_NAME = "writingProgress";

const normalizeOwnerKey = (value = "") => value.trim().toLowerCase();

const buildDocId = ({ userId, studentCode, mode } = {}) => {
  const owner = normalizeOwnerKey(studentCode) || normalizeOwnerKey(userId);
  if (!owner) return "";
  return `${owner}__${mode || "course"}`;
};

export const loadWritingProgress = async ({ userId, studentCode, mode } = {}) => {
  const docId = buildDocId({ userId, studentCode, mode });
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

  if (!isFirebaseConfigured || !db) return false;

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
