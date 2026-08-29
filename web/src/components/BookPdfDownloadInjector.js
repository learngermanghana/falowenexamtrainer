import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export const SCHOOL_PRINT_STAMP = "learn Language Education Academy";

const BOOK_ROUTE_PATTERN = /(?:grammar-notes|workbook\/?$)/i;
const A1_WORKBOOK_ROUTE_PATTERN = /^\/campus\/course\/a1-[^/]*-workbook\/?$/i;
const A1_DAY15_WORKBOOK_PATH = "/campus/course/speaking-exams-intro-4-7";
const COURSE_LESSON_PATTERN = /^\/campus\/course\/lesson\/(A1|A2|B1|B2|C1)\/\d+\/?$/i;

export const getPrintableBookKind = (pathname = "", search = "") => {
  if ((pathname.replace(/\/+$/, "") || "/") === A1_DAY15_WORKBOOK_PATH) {
    return "combined";
  }

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

export const needsInlineA1PdfAction = (pathname = "") =>
  A1_WORKBOOK_ROUTE_PATTERN.test(pathname) ||
  (pathname.replace(/\/+$/, "") || "/") === A1_DAY15_WORKBOOK_PATH;

const humanizeBookTitle = (pathname = "") => {
  const slug = pathname.split("/").filter(Boolean).pop() || "course-book";
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const stampStyle = {
  display: "none",
};

const inlineActionStyle = {
  display: "flex",
  justifyContent: "flex-end",
  width: "min(100% - 32px, 1120px)",
  margin: "14px auto",
};

const inlineButtonStyle = {
  border: "1px solid #cbd5e1",
  borderRadius: 12,
  background: "#ffffff",
  color: "#0f172a",
  padding: "10px 16px",
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
};

export default function BookPdfDownloadInjector() {
  const location = useLocation();
  const bookKind = getPrintableBookKind(location.pathname, location.search);
  const isBookRoute = Boolean(bookKind);
  const showInlineA1Action = needsInlineA1PdfAction(location.pathname);
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
      {showInlineA1Action ? (
        <div className="book-pdf-download-action" style={inlineActionStyle}>
          <button
            type="button"
            style={inlineButtonStyle}
            onClick={() => window.print()}
            aria-label="Download or print PDF"
          >
            Download / Print PDF
          </button>
        </div>
      ) : null}
      <div className="book-print-stamp" style={stampStyle} aria-hidden="true">
        <strong>{SCHOOL_PRINT_STAMP}</strong>
        <span>{title}</span>
        <span>Printed {printedAt}</span>
      </div>
    </>
  );
}
