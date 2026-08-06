import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export const SCHOOL_PRINT_STAMP = "learn Language Education Academy";

const BOOK_ROUTE_PATTERN = /(?:grammar-notes|workbook\/?$)/i;
const COURSE_LESSON_PATTERN = /^\/campus\/course\/lesson\/(A1|A2|B1|B2|C1)\/\d+\/?$/i;

export const getPrintableBookKind = (pathname = "", search = "") => {
  if (BOOK_ROUTE_PATTERN.test(pathname)) {
    return /workbook\/?$/i.test(pathname) ? "combined" : "grammar";
  }

  const lessonMatch = pathname.match(COURSE_LESSON_PATTERN);
  if (!lessonMatch) return null;

  const level = String(lessonMatch[1] || "").toUpperCase();
  const view = new URLSearchParams(search || "").get("view");

  if (view === "grammar") return "grammar";
  if (view === "workbook") return level === "B1" ? "workbook" : "combined";

  // Canonical B2 and C1 self-learning links open the complete lesson without
  // a view query parameter. Those pages contain both grammar and workbook work.
  if ((level === "B2" || level === "C1") && !view) return "combined";

  return null;
};

export const isPrintableBookRoute = (pathname = "", search = "") =>
  Boolean(getPrintableBookKind(pathname, search));

const humanizeBookTitle = (pathname = "") => {
  const slug = pathname.split("/").filter(Boolean).pop() || "course-book";
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const stampStyle = {
  display: "none",
};

const getBookKindLabel = (bookKind) => {
  if (bookKind === "combined") return "Grammar + workbook";
  if (bookKind === "workbook") return "Workbook";
  return "Grammar book";
};

export default function BookPdfDownloadInjector() {
  const location = useLocation();
  const bookKind = getPrintableBookKind(location.pathname, location.search);
  const isBookRoute = Boolean(bookKind);
  const title = useMemo(() => humanizeBookTitle(location.pathname), [location.pathname]);
  const printedAt = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date()),
    [location.pathname]
  );

  if (!isBookRoute) return null;

  return (
    <>
      <style>{`@media print { .book-pdf-download-action { display: none !important; } }`}</style>
      <aside className="book-pdf-download-dock" aria-label="PDF download">
        <div>
          <strong>{getBookKindLabel(bookKind)}</strong>
          <span>Save the complete lesson you are viewing.</span>
        </div>
        <button type="button" className="book-pdf-download-action" onClick={() => window.print()}>
          <span aria-hidden="true">↓</span>
          Download PDF
        </button>
      </aside>
      <div className="book-print-stamp" style={stampStyle} aria-hidden="true">
        <strong>{SCHOOL_PRINT_STAMP}</strong>
        <span>{title}</span>
        <span>Printed {printedAt}</span>
      </div>
    </>
  );
}
