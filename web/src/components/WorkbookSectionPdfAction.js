import React from "react";

const buttonStyle = {
  border: "1px solid #1d4ed8",
  borderRadius: 999,
  background: "#ffffff",
  color: "#1d4ed8",
  padding: "8px 12px",
  fontSize: 12,
  fontWeight: 900,
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(30, 64, 175, 0.12)",
};

export default function WorkbookSectionPdfAction({ sectionLabel = "section" }) {
  const normalizedLabel = String(sectionLabel || "section").trim();

  return (
    <div className="book-pdf-download-action" data-workbook-section-pdf-action="true">
      <style>{`@media print { .book-pdf-download-action { display: none !important; } }`}</style>
      <button
        type="button"
        style={buttonStyle}
        onClick={() => window.print()}
        aria-label={`Save ${normalizedLabel} as PDF`}
        title="Your browser's print window will open. Choose Save as PDF as the destination."
      >
        Save {normalizedLabel} as PDF
      </button>
    </div>
  );
}
