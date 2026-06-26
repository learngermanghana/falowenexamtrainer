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
  dock: {
    position: "fixed",
    right: 18,
    bottom: 18,
    zIndex: 2147483000,
    display: "grid",
    gap: 8,
    maxWidth: 280,
    padding: 12,
    borderRadius: 18,
    border: "1px solid rgba(37, 99, 235, 0.22)",
    background: "rgba(255, 255, 255, 0.96)",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.18)",
    color: "#0f172a",
  },
  button: {
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
    fontSize: 12,
    lineHeight: 1.35,
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
      <aside className="book-pdf-download-dock" style={styles.dock} aria-label="PDF download tools">
        <button type="button" style={styles.button} onClick={() => window.print()}>
          Download / Print PDF
        </button>
        <p style={styles.note}>Choose “Save as PDF” in the print dialog to download the book form.</p>
      </aside>
      <div className="book-print-stamp" style={styles.stamp} aria-hidden="true">
        <strong>{SCHOOL_PRINT_STAMP}</strong>
        <span>{title}</span>
        <span>Printed {printedAt}</span>
      </div>
    </>
  );
}
