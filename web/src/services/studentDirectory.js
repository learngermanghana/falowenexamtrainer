import {
  collection,
  db,
  getDocs,
  isFirebaseConfigured,
  query,
  where,
} from "../firebase";

const normalizeEmail = (email) => (email || "").trim().toLowerCase();

const normalizeDirectoryMember = (docSnapshot) => {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    name: data.name || data.displayName || "Student",
    photoURL: data.photoURL || data.avatarUrl || "",
    biography: data.biography || "",
    learningGoal: data.learningGoal || data.goal || "",
    interests: Array.isArray(data.interests) ? data.interests.filter(Boolean) : [],
    level: data.level || "",
    className: data.className || "",
  };
};

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

export const fetchClassDirectoryMembers = async ({ level, className }) => {
  const normalizedLevel = String(level || "").trim().toUpperCase();
  const normalizedClassName = String(className || "").trim();
  if (!normalizedLevel || !normalizedClassName || !isFirebaseConfigured || !db) {
    return [];
  }

  const studentsRef = collection(db, "students");
  const lookup = query(
    studentsRef,
    where("level", "==", normalizedLevel),
    where("className", "==", normalizedClassName),
  );
  const snapshot = await getDocs(lookup);
  return snapshot.docs
    .map(normalizeDirectoryMember)
    .sort((a, b) => a.name.localeCompare(b.name));
};

export default deriveStudentProfile;
