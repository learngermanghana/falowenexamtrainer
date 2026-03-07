import { db, doc, getDoc, isFirebaseConfigured, serverTimestamp, setDoc } from "../firebase";

const COLLECTION_NAME = "speakingProgress";

const normalizeOwnerKey = (value = "") => String(value).trim().toLowerCase();

const buildDocId = ({ userId, studentCode, mode } = {}) => {
  const owner = normalizeOwnerKey(studentCode) || normalizeOwnerKey(userId);
  if (!owner) return "";
  return `${owner}__${mode || "exam"}`;
};

export const loadSpeakingProgress = async ({ userId, studentCode, mode } = {}) => {
  const docId = buildDocId({ userId, studentCode, mode });
  if (!docId || !isFirebaseConfigured || !db) return null;

  try {
    const docRef = doc(db, COLLECTION_NAME, docId);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() };
  } catch (error) {
    console.error("Failed to load speaking progress from Firebase", error);
    return null;
  }
};

export const saveSpeakingProgress = async ({ userId, studentCode, mode, data } = {}) => {
  const docId = buildDocId({ userId, studentCode, mode });
  if (!docId || !isFirebaseConfigured || !db) return false;

  try {
    const docRef = doc(db, COLLECTION_NAME, docId);
    await setDoc(
      docRef,
      {
        ...data,
        userId: userId || null,
        studentCode: studentCode || null,
        mode: mode || "exam",
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error("Failed to save speaking progress to Firebase", error);
    return false;
  }
};
