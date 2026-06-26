import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export const SCHOOL_PRINT_STAMP = "learn Language Education Academy";

const BOOK_ROUTE_PATTERN = /(?:grammar-notes|workbook\/?$)/i;

export const isPrintableBookRoute = (pathname = "") => BOOK_ROUTE_PATTERN.test(pathname);

const humanizeBookTitle = (pathname = "") => {
  const slug = pathname.split("/").filter(Boolean).pop() || "course-book";
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const styles = {
  section: {
    width: "min(920px, calc(100% - 32px))",
    margin: "24px auto 96px",
    padding: 16,
    borderRadius: 18,
    border: "1px solid rgba(37, 99, 235, 0.22)",
    background: "#ffffff",
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.08)",
    color: "#0f172a",
    display: "grid",
    gap: 10,
    boxSizing: "border-box",
  },
  heading: {
    margin: 0,
    fontSize: 18,
  },
  button: {
    width: "100%",
    minHeight: 48,
    border: 0,
    borderRadius: 14,
    padding: "12px 16px",
    background: "#2563eb",
    color: "#ffffff",
    font: "inherit",
    fontWeight: 900,
    cursor: "pointer",
  },
  note: {
    margin: 0,
    fontSize: 13,
    lineHeight: 1.5,
    color: "#475569",
  },
  stamp: {
    display: "none",
  },
};

export default function BookPdfDownloadInjector() {
  const location = useLocation();
  const isBookRoute = isPrintableBookRoute(location.pathname);
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
      <section className="book-pdf-download-section" style={styles.section} aria-label="PDF download tools">
        <h2 style={styles.heading}>Keep a PDF copy of this course book</h2>
        <p style={styles.note}>
          You have reached the end of the course page. Download or print a copy for offline study.
        </p>
        <button type="button" style={styles.button} onClick={() => window.print()}>
          Download / Print PDF
        </button>
        <p style={styles.note}>Choose “Save as PDF” in the print dialog to download the book.</p>
      </section>
      <div className="book-print-stamp" style={styles.stamp} aria-hidden="true">
        <strong>{SCHOOL_PRINT_STAMP}</strong>
        <span>{title}</span>
        <span>Printed {printedAt}</span>
      </div>
    </>
  );
}
