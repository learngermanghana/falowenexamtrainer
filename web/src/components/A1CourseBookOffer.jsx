import React from "react";

// The A1 workbook and tutor-marked assignments remain available without buying.
// This compact optional book offer is shown outside interactive tablists.
export default function A1CourseBookOffer() {
  return (
    <aside
      aria-label="Complete A1 course book"
      data-a1-course-book-offer="true"
      data-pdf-exclude="a1-course-book-offer"
      style={{
        display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12,
        border: "1px solid #bfdbfe", borderRadius: 12, padding: "10px 12px",
        background: "#f8fbff",
      }}
    >
      <img
        src="/books/a1-cover.svg"
        alt="Falowen Deutsch A1 Course & Workbook cover"
        width="44"
        height="62"
        loading="lazy"
        style={{ width: 44, height: 62, objectFit: "contain", borderRadius: 4 }}
      />
      <div style={{ display: "grid", gap: 4, flex: "1 1 180px", minWidth: 0 }}>
        <strong style={{ fontSize: 13, color: "#172554" }}>Complete A1 Course & Workbook</strong>
        <span style={{ fontSize: 12, color: "#475569", lineHeight: 1.45 }}>
          Optional 250-page offline book · Digital GH₵100 · Printed on demand GH₵800
        </span>
        <a
          href="/books/deutsch-a1-course-workbook"
          style={{ color: "#1d4ed8", fontWeight: 800, fontSize: 13, width: "fit-content" }}
        >
          View complete A1 book →
        </a>
      </div>
      <style>{`@media print { [data-a1-course-book-offer="true"] { display: none !important; } }`}</style>
    </aside>
  );
}
