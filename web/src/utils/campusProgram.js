/**
 * The Falowen learner shell is shared by programmes, but German-only learning
 * services must not appear as Kiswahili features or read German records.
 * Keep the signed-in programme derived from the server-provided profile;
 * never derive it from a public URL, lesson day or stored interface language.
 */
export const getCampusProgram = (studentProfile) =>
  String(studentProfile?.program || "").trim().toLowerCase() === "swahili" ? "swahili" : "german";

const SWAHILI_CAMPUS_SECTIONS = new Set(["course", "account"]);
const GERMAN_ONLY_SECTIONS = ["music", "books", "vocab", "attendance", "results", "discussion", "classMembers"];

export const getProgramCampusTabs = (tabs, studentProfile) =>
  getCampusProgram(studentProfile) === "swahili"
    ? tabs.filter((tab) => SWAHILI_CAMPUS_SECTIONS.has(tab.section))
    : tabs;

export const getProgramAllowedSections = (sections, studentProfile) => {
  if (getCampusProgram(studentProfile) !== "swahili") return sections;
  return { ...sections, ...Object.fromEntries(GERMAN_ONLY_SECTIONS.map((section) => [section, false])) };
};

export const getProgramCourseRedirect = ({ pathname = "", studentProfile, isStaff = false } = {}) => {
  // Staff keep their existing cross-programme review and admin access.
  if (isStaff) return null;
  const path = String(pathname).replace(/\/+$/, "");
  if (getCampusProgram(studentProfile) === "swahili") {
    if (path === "/exams" || path.startsWith("/exams/")) return "/campus/course";
    if (path.startsWith("/campus/course/") &&
        !/^\/campus\/course\/swahili\/day-(?:1|6)$/.test(path)) return "/campus/course";
  } else if (path.startsWith("/campus/course/swahili/")) {
    return "/campus/course";
  }
  return null;
};

export const canSubmitSwahiliWorkbook = ({ user, studentProfile, preview = false } = {}) =>
  Boolean(user?.uid && !preview && getCampusProgram(studentProfile) === "swahili");
