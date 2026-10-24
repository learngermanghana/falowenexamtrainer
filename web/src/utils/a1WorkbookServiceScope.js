const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "") || "/";

export const resolveA1WorkbookServiceScope = ({ pathname = "", search = "" } = {}) => {
  const normalizedPath = normalizePath(pathname);
  const params = new URLSearchParams(search || "");
  const lessonView = String(params.get("view") || "").trim().toLowerCase();
  const isDynamicLesson = /^\/campus\/course\/lesson\/A1\/\d+$/i.test(normalizedPath);
  const isNamedWorkbook = /^\/campus\/course\/a1-day-.*workbook$/i.test(normalizedPath);
  const isDynamicWorkbook = isDynamicLesson && lessonView === "workbook";

  return {
    isDynamicLesson,
    isWorkbookView: isNamedWorkbook || isDynamicWorkbook,
    shouldMountWorkbookServices: !isDynamicLesson || isDynamicWorkbook,
  };
};

export default resolveA1WorkbookServiceScope;
