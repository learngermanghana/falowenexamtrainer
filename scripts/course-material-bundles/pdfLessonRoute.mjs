// PDF builds must access the actual student workbook without requiring a
// human to complete the Radio introduction. This is a navigation-only URL
// parameter already supported by Falowen; it does not alter student progress.
export const buildPdfLessonTargetUrl = (lessonRoute, baseUrl, level) => {
  const url = new URL(lessonRoute, baseUrl);
  if (["A2", "B1"].includes(String(level || "").trim().toUpperCase())) {
    url.searchParams.set("radio", "done");
  }
  return url.toString();
};
