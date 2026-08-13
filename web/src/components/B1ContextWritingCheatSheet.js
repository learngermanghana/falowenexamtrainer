import React, { useState } from "react";
import { getWritingCheatSheet } from "../data/writingCheatSheets";
import { styles } from "../styles";

const B1_TEMPLATE_BY_TASK_TYPE = {
  opinion: "b1-opinion-text-template",
  "opinion-essay": "b1-opinion-text-template",
  formal: "b1-formal-letter-template",
  "formal-letter": "b1-formal-letter-template",
  informal: "b1-informal-letter-template",
  "informal-letter": "b1-informal-letter-template",
};

export const getB1WritingTemplateForTaskType = (taskType = "") => {
  const templateId = B1_TEMPLATE_BY_TASK_TYPE[String(taskType || "").trim().toLowerCase()];
  if (!templateId) return null;
  return getWritingCheatSheet("B1", 1).find((section) => section.id === templateId) || null;
};

export default function B1ContextWritingCheatSheet({ taskType, children }) {
  const [view, setView] = useState("task");
  const template = getB1WritingTemplateForTaskType(taskType);
  if (!template) return children;
  return (
    <div data-b1-context-writing-cheat-sheet={taskType} style={{ display: "grid", gap: 14 }}>
      <div role="tablist" aria-label="B1 writing support" style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: 6, border: "1px solid #dbeafe", borderRadius: 14, background: "#eff6ff" }}>
        <button type="button" role="tab" aria-selected={view === "task"} onClick={() => setView("task")} style={{ ...(view === "task" ? styles.primaryButton : styles.secondaryButton), borderRadius: 999 }}>Schreiben Task</button>
        <button type="button" role="tab" aria-selected={view === "cheat"} onClick={() => setView("cheat")} style={{ ...(view === "cheat" ? styles.primaryButton : styles.secondaryButton), borderRadius: 999 }}>Cheat Sheet</button>
      </div>
      {view === "task" ? children : (
        <section data-b1-selected-writing-template={template.id} style={{ display: "grid", gap: 10 }}>
          <h3 style={{ margin: 0, fontSize: "1rem", color: "#1e3a8a" }}>{template.title}</h3>
          <div style={{ display: "grid", gap: 8 }}>
            {template.items.map((item) => (
              <div key={`${template.id}-${item.phrase}`} style={{ display: "grid", gridTemplateColumns: "minmax(110px,180px) minmax(0,1fr)", gap: 12, alignItems: "start", border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, background: "#fff", overflowWrap: "anywhere" }}>
                <strong style={{ color: "#0f172a" }}>{item.phrase}</strong>
                <span style={{ color: "#475569", whiteSpace: "pre-line", lineHeight: 1.7 }}>{item.meaning}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
