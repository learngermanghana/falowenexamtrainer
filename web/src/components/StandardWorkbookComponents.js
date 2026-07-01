import React from "react";
import { styles } from "../styles";

export const STANDARD_WORKBOOK_TABS = [
  { key: "sprechen", label: "Teil 1 · Sprechen" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
  { key: "hoeren", label: "Teil 4 · Hören" },
  { key: "references", label: "Ref" },
  { key: "submit", label: "Submit" },
];

export const WorkbookTabNav = ({
  activeTab,
  onChange,
  tabs = STANDARD_WORKBOOK_TABS,
  ariaLabel = "Workbook sections",
}) => {
  const activeIndex = Math.max(0, tabs.findIndex((tab) => tab.key === activeTab));
  const activeLabel = tabs[activeIndex]?.label || "Workbook";

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          padding: 8,
          position: "sticky",
          top: 8,
          zIndex: 30,
          border: "1px solid #bfdbfe",
          borderRadius: 12,
          background: "#eff6ff",
          boxShadow: "0 8px 18px rgba(30, 64, 175, 0.08)",
        }}
      >
        {tabs.map((tab) => {
          const selected = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(tab.key)}
              style={{
                ...styles.secondaryButton,
                background: selected ? "#2563eb" : "#fff",
                borderColor: selected ? "#2563eb" : "#93c5fd",
                color: selected ? "#fff" : "#1d4ed8",
                fontWeight: 800,
                flex: "0 0 auto",
                whiteSpace: "nowrap",
                minWidth: tab.key === "references" || tab.key === "submit" ? 84 : 150,
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <p style={{ margin: 0, color: "#475569", fontSize: 14 }}>
        Open section: <strong>{activeLabel}</strong> · {activeIndex + 1} of {tabs.length}
      </p>
    </div>
  );
};

export const WorkbookTaskCard = ({
  eyebrow = "Your task",
  title,
  children,
  submissionNote = "",
  practiceOnly = false,
}) => (
  <section
    aria-label={eyebrow}
    style={{
      border: "2px solid #2563eb",
      borderRadius: 14,
      padding: 16,
      background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 72%)",
      display: "grid",
      gap: 10,
      boxShadow: "0 10px 24px rgba(37, 99, 235, 0.1)",
    }}
  >
    <span
      style={{
        ...styles.badge,
        width: "fit-content",
        background: practiceOnly ? "#fef3c7" : "#dbeafe",
        color: practiceOnly ? "#92400e" : "#1e3a8a",
      }}
    >
      {eyebrow}
    </span>
    {title ? <h3 style={{ margin: 0, fontSize: "1.2rem", lineHeight: 1.35 }}>{title}</h3> : null}
    <div style={{ display: "grid", gap: 8, lineHeight: 1.7 }}>{children}</div>
    {submissionNote ? (
      <div
        style={{
          borderTop: "1px solid #bfdbfe",
          paddingTop: 10,
          color: practiceOnly ? "#92400e" : "#1e40af",
          fontWeight: 700,
          lineHeight: 1.5,
        }}
      >
        {submissionNote}
      </div>
    ) : null}
  </section>
);
