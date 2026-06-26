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

const stampStyle = {
  display: "none",
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
      <style>{`@media print { .book-pdf-download-action { display: none !important; } }`}</style>
      <div className="book-print-stamp" style={stampStyle} aria-hidden="true">
        <strong>{SCHOOL_PRINT_STAMP}</strong>
        <span>{title}</span>
        <span>Printed {printedAt}</span>
      </div>
    </>
  );
}
