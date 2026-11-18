/**
 * Public Kiswahili previews remain available to visitors. Signed-in Kiswahili
 * students belong in the existing Falowen Campus shell, which supplies the
 * shared navigation, account controls and logout.
 */
const A1_DAY_SEGMENT = "day-(?:[1-9]|1[0-9]|20)";
const publicRoute = new RegExp(`^/swahili(?:/(${A1_DAY_SEGMENT}))?/?$`);
const campusLessonRoute = new RegExp(`^/campus/course/swahili/${A1_DAY_SEGMENT}$`);

export const matchSwahiliPreview = (pathname) => String(pathname).match(publicRoute);
export const isSwahiliCampusLesson = (pathname) => campusLessonRoute.test(pathname) || pathname === "/campus/course/swahili/b1/day-28";

export const getSwahiliCampusRoute = ({ pathname = "", search = "", user, studentProfile } = {}) => {
  if (!user || String(studentProfile?.program || "").trim().toLowerCase() !== "swahili") {
    return null;
  }

  const preview = matchSwahiliPreview(pathname);
  if (!preview) return null;

  return preview[1]
    ? `/campus/course/swahili/${preview[1]}${search || ""}`
    : "/campus/course";
};
