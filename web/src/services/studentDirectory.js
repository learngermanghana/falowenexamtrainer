import {
  collection,
  db,
  getDocs,
  isFirebaseConfigured,
  query,
  where,
} from "../firebase";
import { firestoreCollections, legacyStudentKey } from "../lib/firestorePaths";

const normalizeEmail = (email) => (email || "").trim().toLowerCase();

export const deriveStudentProfile = (user, studentProfile = null) => {
  const email = user?.email || studentProfile?.email;
  const profileFromAuth = user?.profile || {};
  const profileFromStore = studentProfile || {};

  const studentKey =
    legacyStudentKey(profileFromStore) ||
    profileFromAuth.studentCode ||
    profileFromStore.studentCode ||
    profileFromStore.id ||
    "";

  return {
    email: email || "",
    studentCode: studentKey,
    level: (profileFromAuth.level || profileFromStore.level || "").toUpperCase(),
    assignmentTitle: profileFromAuth.assignmentTitle || profileFromStore.assignmentTitle || "",
    className: profileFromStore.className || "",
  };
};

export const findStudentByEmail = async (email) => {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !isFirebaseConfigured || !db) return null;

  const studentsRef = collection(db, ...firestoreCollections.students());
  const lookup = query(studentsRef, where("email", "==", normalizedEmail));
  try {
    const snapshot = await getDocs(lookup);
    if (snapshot.empty) return null;

    const hit = snapshot.docs[0];
    return { id: hit.id, ...hit.data() };
  } catch (error) {
    if (error?.code === "permission-denied") {
      console.warn("Skipping student lookup: missing Firestore permissions.");
      return null;
    }
    throw error;
  }
};

export default deriveStudentProfile;
