import {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  isFirebaseConfigured,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  addDoc,
} from "../firebase";

const COLLECTION_NAME = "writingProgress";

const normalizeOwnerKey = (value = "") => value.trim().toLowerCase();

const buildDocId = ({ userId, studentCode, mode } = {}) => {
  const owner = normalizeOwnerKey(studentCode) || normalizeOwnerKey(userId);
  if (!owner) return "";
  return `${owner}__${mode || "course"}`;
};

export const loadWritingProgress = async ({
  userId,
  studentCode,
  mode,
} = {}) => {
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

export const saveWritingProgress = async ({
  userId,
  studentCode,
  mode,
  data,
} = {}) => {
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
  attempt,
} = {}) => {
  const ownerId = buildDocId({ userId, studentCode, mode });
  if (!ownerId || !attempt || !isFirebaseConfigured || !db) return false;
  try {
    const attemptsRef = collection(db, COLLECTION_NAME, ownerId, "attempts");
    await addDoc(attemptsRef, {
      ...attempt,
      userId,
      studentCode: studentCode || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Failed to save writing attempt to Firebase", error);
    return false;
  }
};

export const loadWritingAttempts = async ({
  userId,
  studentCode,
  mode,
  pageSize = 25,
} = {}) => {
  const ownerId = buildDocId({ userId, studentCode, mode });
  if (!ownerId || !isFirebaseConfigured || !db) return [];
  try {
    const attemptsQuery = query(
      collection(db, COLLECTION_NAME, ownerId, "attempts"),
      orderBy("createdAt", "desc"),
      limit(pageSize),
    );
    const snapshot = await getDocs(attemptsQuery);
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  } catch (error) {
    console.error("Failed to load writing attempts from Firebase", error);
    return [];
  }
};
