import legacyStudents from "../data/legacyStudents";

const toSafeList = (value) => (Array.isArray(value) ? value : []);

const normalizeEmail = (email) => (email || "").trim().toLowerCase();

const runtimeStudents = () =>
  typeof window !== "undefined" && Array.isArray(window.__LEGACY_STUDENTS__)
    ? window.__LEGACY_STUDENTS__
    : [];

const allStudents = () => [...runtimeStudents(), ...toSafeList(legacyStudents)];

export const findStudentByEmail = (email) => {
  const target = normalizeEmail(email);
  if (!target) return null;

  return allStudents().find(
    (student) => normalizeEmail(student.email) === target
  ) || null;
};

export const deriveStudentProfile = (user) => {
  const email = user?.email;
  const profileFromAuth = user?.profile || {};
  const studentFromDirectory = findStudentByEmail(email) || {};

  return {
    email: email || "",
    studentCode: profileFromAuth.studentCode || studentFromDirectory.studentCode || "",
    level: profileFromAuth.level || studentFromDirectory.level || "",
    assignmentTitle:
      profileFromAuth.assignmentTitle || studentFromDirectory.assignmentTitle || "",
  };
};

export default findStudentByEmail;
