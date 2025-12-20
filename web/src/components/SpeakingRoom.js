import React, { useMemo, useState } from "react";
import { styles } from "../styles";
import { speakingSheetQuestions } from "../data/speakingSheet";

const levels = ["All", "A1", "A2", "B1", "B2"];

const SpeakingRoom = () => {
  const [levelFilter, setLevelFilter] = useState("All");

  const filteredPrompts = useMemo(
    () =>
      speakingSheetQuestions.filter((prompt) =>
        levelFilter === "All" ? true : prompt.level.toLowerCase() === levelFilter.toLowerCase()
      ),
    [levelFilter]
  );

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <p style={{ ...styles.helperText, margin: 0 }}>Exam speaking room</p>
            <h2 style={{ ...styles.sectionTitle, margin: "4px 0" }}>Warm-up prompts and responses</h2>
            <p style={{ ...styles.helperText, margin: "6px 0 0 0" }}>
              Choose a level and practise answering out loud. Keep answers short, stay calm, and repeat each prompt a few times
              with different ideas.
            </p>
          </div>
          <span style={styles.badge}>Time-box: 10–12 minutes</span>
        </div>
      </section>

      <section style={styles.card}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <label style={styles.label}>Filter by level</label>
            <div style={styles.segmentedControl}>
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  style={levelFilter === lvl ? styles.segmentedActive : styles.segmentedButton}
                  onClick={() => setLevelFilter(lvl)}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
          <div style={styles.helperText}>Tip: Record yourself and listen back for pace and clarity.</div>
        </div>

        <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
          {filteredPrompts.map((prompt) => (
            <div key={prompt.id} style={{ ...styles.uploadCard, border: "1px solid #e5e7eb" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <div style={{ display: "grid", gap: 4 }}>
                  <span style={styles.levelPill}>{prompt.level}</span>
                  <strong>{prompt.teilLabel}</strong>
                  <span style={styles.helperText}>{prompt.text}</span>
                </div>
                <div style={{ display: "grid", gap: 6, minWidth: 220 }}>
                  <span style={{ ...styles.helperText, margin: 0 }}>Response focus</span>
                  <div style={{ ...styles.card, padding: 10, margin: 0 }}>
                    <p style={{ ...styles.helperText, margin: 0 }}>{prompt.hint}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SpeakingRoom;
