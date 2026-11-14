/**
 * Public Kiswahili previews remain available to visitors. Signed-in Kiswahili
 * students belong in the existing Falowen Campus shell, which supplies the
 * shared navigation, account controls and logout.
 */
export const getSwahiliCampusRoute = ({ pathname = "", search = "", user, studentProfile } = {}) => {
  if (!user || String(studentProfile?.program || "").trim().toLowerCase() !== "swahili") {
    return null;
  }

  const preview = String(pathname).match(/^\/swahili(?:\/(day-(?:1|6)))?\/?$/);
  if (!preview) return null;

  return preview[1]
    ? `/campus/course/swahili/${preview[1]}${search || ""}`
    : "/campus/course";
};
