import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export const SCHOOL_PRINT_STAMP = "learn Language Education Academy";

const BOOK_ROUTE_PATTERN = /(?:grammar-notes|workbook\/?$)/i;
const COURSE_LESSON_PATTERN = /^\/campus\/course\/lesson\/(A1|A2|B1|B2|C1)\/\d+\/?$/i;

export const getPrintableBookKind = (pathname = "", search = "") => {
  if (BOOK_ROUTE_PATTERN.test(pathname)) {
    return /workbook\/?$/i.test(pathname) ? "combined" : "grammar";
  }

  if (!COURSE_LESSON_PATTERN.test(pathname)) return null;
  const view = new URLSearchParams(search || "").get("view");
  if (view === "workbook") return "combined";
  if (view === "grammar") return "grammar";
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
          <strong>{bookKind === "combined" ? "Grammar + workbook" : "Grammar book"}</strong>
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
