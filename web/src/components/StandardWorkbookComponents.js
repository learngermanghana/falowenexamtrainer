import React from "react";
import { styles } from "../styles";

export const STANDARD_WORKBOOK_TABS = [
  { key: "sprechen", label: "Teil 1" },
  { key: "schreiben", label: "Teil 2" },
  { key: "lesen", label: "Teil 3" },
  { key: "hoeren", label: "Teil 4" },
  { key: "references", label: "Ref" },
  { key: "submit", label: "Submit" },
];

const TabButton = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      ...styles.secondaryButton,
      borderColor: active ? "#2563eb" : "#d1d5db",
      background: active ? "#2563eb" : "#fff",
      color: active ? "#fff" : "#1d4ed8",
      fontWeight: 800,
      flex: "0 0 auto",
      minWidth: 74,
    }}
  >
    {children}
  </button>
);

export const WorkbookTabNav = ({
  activeTab,
  onChange,
  tabs = STANDARD_WORKBOOK_TABS,
  ariaLabel = "Workbook sections",
}) => {
  const activeIndex = Math.max(0, tabs.findIndex((tab) => tab.key === activeTab));

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}
      >
        {tabs.map((tab) => (
          <TabButton
            key={tab.key}
            active={tab.key === activeTab}
            onClick={() => onChange(tab.key)}
          >
            {tab.label}
          </TabButton>
        ))}
      </div>

      <p style={{ margin: 0, color: "#4b5563" }}>
        Tab {activeIndex + 1} of {tabs.length}
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
