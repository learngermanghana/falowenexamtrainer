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
    assignmentTitle: profileFromAuth.assignmentTitle || "",
    className: profileFromStore.className || "",
  };
};

export const findStudentByEmail = () => null;

export default deriveStudentProfile;
