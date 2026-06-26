import React, { useEffect, useRef, useState } from "react";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import B1Day4WohnungSuchenWorkbookPage from "./B1Day4WohnungSuchenWorkbookPage";
import { styles } from "../styles";

const tabs = [
  { key: "sprechen", label: "Teil 1" },
  { key: "schreiben", label: "Teil 2" },
  { key: "lesen", label: "Teil 3" },
  { key: "hoeren", label: "Teil 4" },
  { key: "references", label: "5. Ref" },
  { key: "submit", label: "6. Submit" },
];

const nativeLabels = {
  sprechen: "Teil 1",
  schreiben: "Teil 2",
  lesen: "Teil 3",
  hoeren: "Teil 4",
  references: "5. Ref",
};

const findNativeButton = (root, tabKey) => {
  const label = nativeLabels[tabKey];
  if (!root || !label) return null;
  return Array.from(root.querySelectorAll("button")).find((button) =>
    String(button.textContent || "").trim().startsWith(label)
  ) || null;
};

const findNativeTabRow = (root) => {
  if (!root) return null;
  const buttons = Array.from(root.querySelectorAll("button")).filter((button) =>
    Object.values(nativeLabels).some((label) => String(button.textContent || "").trim().startsWith(label))
  );
  const parents = new Map();
  buttons.forEach((button) => {
    if (!button.parentElement) return;
    parents.set(button.parentElement, (parents.get(button.parentElement) || 0) + 1);
  });
  return [...parents.entries()].sort((a, b) => b[1] - a[1]).find(([, count]) => count >= 4)?.[0] || null;
};

export default function B1Day4WorkbookShell() {
  const [activeTab, setActiveTab] = useState("sprechen");
  const workbookRef = useRef(null);

  useEffect(() => {
    const root = workbookRef.current;
    if (!root) return undefined;

    const syncNativeRow = () => {
      const row = findNativeTabRow(root);
      if (row) row.style.display = "none";
      if (activeTab !== "submit") findNativeButton(root, activeTab)?.click();
    };

    syncNativeRow();
    const observer = new MutationObserver(syncNativeRow);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [activeTab]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section
        aria-label="B1 Day 4 workbook navigation"
        style={{
          ...styles.container,
          position: "sticky",
          top: 8,
          zIndex: 30,
          padding: "0 16px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          role="tablist"
          aria-label="B1 workbook sections"
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            padding: 10,
            border: "1px solid #bfdbfe",
            borderRadius: 14,
            background: "#eff6ff",
          }}
        >
          {tabs.map((tab) => {
            const selected = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  ...styles.secondaryButton,
                  background: selected ? "#2563eb" : "#fff",
                  borderColor: selected ? "#2563eb" : "#93c5fd",
                  color: selected ? "#fff" : "#1d4ed8",
                  flex: "0 0 auto",
                  fontWeight: 800,
                  minWidth: 82,
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      <div ref={workbookRef} style={{ display: activeTab === "submit" ? "none" : "block" }}>
        <B1Day4WohnungSuchenWorkbookPage />
      </div>

      {activeTab === "submit" ? (
        <section style={{ ...styles.container, padding: "0 16px", width: "100%", boxSizing: "border-box" }}>
          <div style={{ ...styles.card, display: "grid", gap: 12, border: "1px solid #bfdbfe" }}>
            <h2 style={{ margin: 0 }}>Submit workbook answers</h2>
            <p style={{ margin: 0, color: "#475569" }}>
              Submit your final Schreiben, Lesen and Hören answers for B1 Day 4.
            </p>
            <div className="b1-day4-submission-page">
              <style>{`.b1-day4-submission-page > div > section:first-child { display: none !important; }
              .b1-day4-submission-page select { display: none !important; }`}</style>
              <AssignmentSubmissionPage />
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
