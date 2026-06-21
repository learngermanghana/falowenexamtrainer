import React, { useEffect, useState } from "react";
import { getWritingCheatSheet } from "../data/writingCheatSheets";
import { styles } from "../styles";

export default function WritingCheatSheetTabs({ level, day, children }) {
  const [writeView, setWriteView] = useState("task");
  const writingCheatSheet = getWritingCheatSheet(level, day);

  useEffect(() => setWriteView("task"), [level, day]);

  if (!writingCheatSheet.length) return children;

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div role="tablist" aria-label="Writing support" style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: 6, border: "1px solid #dbeafe", borderRadius: 14, background: "#eff6ff" }}>
        <button type="button" role="tab" aria-selected={writeView === "task"} onClick={() => setWriteView("task")} style={{ ...(writeView === "task" ? styles.primaryButton : styles.secondaryButton), borderRadius: 999 }}>Schreiben Task</button>
        <button type="button" role="tab" aria-selected={writeView === "cheatSheet"} onClick={() => setWriteView("cheatSheet")} style={{ ...(writeView === "cheatSheet" ? styles.primaryButton : styles.secondaryButton), borderRadius: 999 }}>Cheat Sheet</button>
      </div>

      {writeView === "task" ? <div>{children}</div> : null}

      {writeView === "cheatSheet" ? (
        <div style={{ display: "grid", gap: 16 }}>
          {writingCheatSheet.map((section) => (
            <section key={section.id} style={{ display: "grid", gap: 10 }}>
              <h3 style={{ margin: 0, fontSize: "1rem", color: "#1e3a8a" }}>{section.title}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))", gap: 8 }}>
                {section.items.map((item) => (
                  <div key={`${section.id}-${item.phrase}`} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,180px),1fr))", gap: 12, alignItems: "center", border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, background: "#f8fafc", overflowWrap: "anywhere" }}>
                    <strong style={{ color: "#0f172a" }}>{item.phrase}</strong>
                    <span style={{ color: "#475569" }}>{item.meaning}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : null}
    </div>
  );
}
