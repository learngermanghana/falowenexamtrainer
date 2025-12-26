import { db, doc, getDoc, isFirebaseConfigured, serverTimestamp, setDoc } from "../firebase";

const COLLECTION_NAME = "writingProgress";

const buildDocId = (userId, mode) => `${userId}__${mode || "course"}`;

export const loadWritingProgress = async ({ userId, mode } = {}) => {
  if (!userId || !isFirebaseConfigured || !db) return null;

  const docRef = doc(db, COLLECTION_NAME, buildDocId(userId, mode));
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
};

export const saveWritingProgress = async ({ userId, mode, data } = {}) => {
  if (!userId || !isFirebaseConfigured || !db) return false;

  const docRef = doc(db, COLLECTION_NAME, buildDocId(userId, mode));
  await setDoc(
    docRef,
    {
      ...data,
      userId,
      mode: mode || "course",
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  return true;
};
