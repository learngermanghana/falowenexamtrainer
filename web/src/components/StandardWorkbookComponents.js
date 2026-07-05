import React from "react";
import { styles } from "../styles";

export const A2_B1_WORKBOOK_TABS = [
  { key: "sprechen", label: "Teil 1", description: "Sprechen" },
  { key: "schreiben", label: "Teil 2", description: "Schreiben" },
  { key: "lesen", label: "Teil 3", description: "Lesen" },
  { key: "hoeren", label: "Teil 4", description: "Hören" },
  { key: "references", label: "Ref", description: "Notes" },
  { key: "submit", label: "Submit", description: "Send work" },
];

export const B2_C1_WORKBOOK_TABS = [
  { key: "learn", label: "Learn", description: "Input" },
  { key: "write", label: "Write", description: "Practice" },
  { key: "finish", label: "Finish", description: "Task" },
  { key: "references", label: "Ref", description: "Notes" },
];

export const STANDARD_WORKBOOK_TABS = A2_B1_WORKBOOK_TABS;

export const getWorkbookTabsForLevel = (level) => {
  const normalizedLevel = String(level || "").toUpperCase();
  if (normalizedLevel === "B2" || normalizedLevel === "C1") return B2_C1_WORKBOOK_TABS;
  return A2_B1_WORKBOOK_TABS;
};

const TabButton = ({ active, onClick, label, description }) => (
  <button
    type="button"
    role="tab"
    aria-label={label}
    aria-selected={active}
    onClick={onClick}
    style={{
      ...styles.secondaryButton,
      position: "relative",
      display: "grid",
      alignItems: "center",
      justifyItems: "center",
      gap: 4,
      width: "100%",
      minWidth: 0,
      minHeight: 74,
      padding: "13px 10px 12px",
      border: active ? "3px solid #1d4ed8" : "2px solid #bfdbfe",
      borderRadius: 16,
      background: active
        ? "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)"
        : "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)",
      color: active ? "#ffffff" : "#1e3a8a",
      boxShadow: active
        ? "0 14px 28px rgba(37, 99, 235, 0.28)"
        : "0 8px 18px rgba(15, 23, 42, 0.08)",
      fontWeight: 900,
      lineHeight: 1.15,
      opacity: 1,
      visibility: "visible",
      cursor: "pointer",
      transform: active ? "translateY(-1px)" : "none",
    }}
  >
    <span aria-hidden="true" style={{ fontSize: "1rem", letterSpacing: "0.01em" }}>
      {label}
    </span>
    {description ? (
      <span
        aria-hidden="true"
        style={{
          fontSize: 12,
          fontWeight: 800,
          opacity: active ? 0.95 : 0.78,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {description}
      </span>
    ) : null}
    {active ? (
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: -7,
          width: 42,
          height: 6,
          borderRadius: 999,
          background: "#facc15",
          boxShadow: "0 4px 10px rgba(250, 204, 21, 0.45)",
        }}
      />
    ) : null}
  </button>
);

export const WorkbookTabNav = ({
  activeTab,
  onChange,
  tabs = STANDARD_WORKBOOK_TABS,
  ariaLabel = "Workbook sections",
}) => {
  const activeIndex = Math.max(0, tabs.findIndex((tab) => tab.key === activeTab));
  const tabNames = tabs.map((tab) => tab.label).join(", ");

  return (
    <nav
      aria-label={ariaLabel}
      data-workbook-tab-navigation
      style={{
        position: "relative",
        zIndex: 30,
        display: "grid",
        gap: 10,
        width: "100%",
        padding: 12,
        border: "2px solid #2563eb",
        borderRadius: 18,
        background: "linear-gradient(135deg, #dbeafe 0%, #ffffff 70%)",
        boxShadow: "0 14px 30px rgba(15, 23, 42, 0.12)",
        opacity: 1,
        visibility: "visible",
      }}
    >
      <div
        role="tablist"
        aria-label={ariaLabel}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(96px, 1fr))",
          gap: 10,
          width: "100%",
          overflow: "visible",
          opacity: 1,
          visibility: "visible",
        }}
      >
        {tabs.map((tab) => (
          <TabButton
            key={tab.key}
            active={tab.key === activeTab}
            onClick={() => onChange(tab.key)}
            label={tab.label}
            description={tab.description}
          />
        ))}
      </div>

      <p style={{ margin: 0, color: "#1e3a8a", fontWeight: 800, fontSize: 13 }}>
        Tab {activeIndex + 1} of {tabs.length} · Select {tabNames}.
      </p>
    </nav>
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
