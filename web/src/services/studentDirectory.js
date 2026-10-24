import {
  collection,
  db,
  getDocs,
  isFirebaseConfigured,
  query,
  where,
} from "../firebase";

const normalizeEmail = (email) => (email || "").trim().toLowerCase();

export const deriveStudentProfile = (user, studentProfile = null) => {
  const email = user?.email || studentProfile?.email;
  const profileFromAuth = user?.profile || {};
  const profileFromStore = studentProfile || {};

  return {
    email: email || "",
    studentCode:
      profileFromAuth.studentCode ||
      profileFromStore.studentcode ||
      profileFromStore.id ||
      "",
    level: (profileFromAuth.level || profileFromStore.level || "").toUpperCase(),
    assignmentTitle: profileFromAuth.assignmentTitle || profileFromStore.assignmentTitle || "",
    className: profileFromStore.className || "",
  };
};

export const findStudentByEmail = async (email) => {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !isFirebaseConfigured || !db) return null;

  const studentsRef = collection(db, "students");
  const lookup = query(studentsRef, where("email", "==", normalizedEmail));
  const snapshot = await getDocs(lookup);
  if (snapshot.empty) return null;

  const hit = snapshot.docs[0];
  return { id: hit.id, ...hit.data() };
};

export default deriveStudentProfile;
