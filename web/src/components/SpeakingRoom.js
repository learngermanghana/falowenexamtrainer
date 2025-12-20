import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import { speakingSheetQuestions } from "../data/speakingSheet";

const levels = ["A1", "A2", "B1", "B2", "C1"];

const SpeakingRoom = () => {
  const [levelFilter, setLevelFilter] = useState(levels[0]);
  const [teilFilter, setTeilFilter] = useState("Teil 1");
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  const promptsForLevel = useMemo(
    () => speakingSheetQuestions.filter((prompt) => prompt.level === levelFilter),
    [levelFilter]
  );

  const teilOptions = useMemo(() => {
    const uniqueTeile = Array.from(
      new Set(promptsForLevel.map((prompt) => prompt.teilLabel || prompt.teilId || prompt.teil))
    );

    return uniqueTeile.length ? uniqueTeile : ["Teil 1", "Teil 2", "Teil 3"];
  }, [promptsForLevel]);

  useEffect(() => {
    if (!teilOptions.includes(teilFilter)) {
      setTeilFilter(teilOptions[0]);
    }
  }, [teilOptions, teilFilter]);

  const filteredPrompts = useMemo(() => {
    const normalizedTeil = (teilFilter || "").toLowerCase();

    return promptsForLevel.filter((prompt) => {
      const teilLabel = (prompt.teilLabel || "").toLowerCase();
      const teilId = (prompt.teilId || "").toLowerCase();
      return !normalizedTeil || teilLabel === normalizedTeil || teilId === normalizedTeil;
    });
  }, [promptsForLevel, teilFilter]);

  useEffect(() => {
    setSelectedPrompt(filteredPrompts[0] || null);
  }, [filteredPrompts]);

  const aiPayload = useMemo(() => {
    if (!selectedPrompt) return "Wähle ein Thema, um es an die KI zu schicken.";

    const keyword = selectedPrompt.keywordSubtopic
      ? ` (Stichwort: ${selectedPrompt.keywordSubtopic})`
      : "";

    return `Niveau: ${selectedPrompt.level}\nTeil: ${selectedPrompt.teilLabel}\nThema: ${selectedPrompt.topicPrompt}${keyword}`;
  }, [selectedPrompt]);

  const copyToClipboard = async () => {
    if (!selectedPrompt || !navigator?.clipboard) return;

    try {
      await navigator.clipboard.writeText(aiPayload);
      alert("Thema kopiert. Füge es im KI-Chat ein.");
    } catch (error) {
      console.error("Clipboard copy failed", error);
    }
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <p style={{ ...styles.helperText, margin: 0 }}>Exam speaking room</p>
            <h2 style={{ ...styles.sectionTitle, margin: "4px 0" }}>Warm-up prompts and responses</h2>
            <p style={{ ...styles.helperText, margin: "6px 0 0 0" }}>
              Choose a level and practise answering out loud. Keep answers short, stay calm, and repeat each prompt a few times with
              different ideas.
            </p>
          </div>
          <span style={styles.badge}>Time-box: 10–12 minutes</span>
        </div>
      </section>

      <section style={styles.card}>
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <label style={styles.label}>Niveau</label>
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
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <label style={styles.label}>Teil</label>
              <div style={styles.segmentedControl}>
                {teilOptions.map((teil) => (
                  <button
                    key={teil}
                    style={teilFilter === teil ? styles.segmentedActive : styles.segmentedButton}
                    onClick={() => setTeilFilter(teil)}
                  >
                    {teil}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ ...styles.card, background: "#f9fafb", margin: 0 }}>
            <p style={{ ...styles.helperText, margin: 0 }}>
              Select a topic to rehearse and pass straight to the AI coach. Use the Teil buttons to view Teil 1, 2, or 3 prompts for
              your chosen level.
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
          {filteredPrompts.map((prompt) => (
            <div
              key={prompt.id}
              style={{
                ...styles.uploadCard,
                border: selectedPrompt?.id === prompt.id ? "2px solid #4f46e5" : "1px solid #e5e7eb",
                cursor: "pointer",
              }}
              onClick={() => setSelectedPrompt(prompt)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ display: "grid", gap: 4 }}>
                  <span style={styles.levelPill}>{prompt.level}</span>
                  <strong>{prompt.teilLabel}</strong>
                  <span style={{ ...styles.helperText, fontWeight: 600 }}>{prompt.topicPrompt}</span>
                  {prompt.keywordSubtopic ? (
                    <span style={{ ...styles.helperText, color: "#4f46e5" }}>
                      Stichwort: {prompt.keywordSubtopic}
                    </span>
                  ) : null}
                </div>
                <div style={{ display: "grid", gap: 6, minWidth: 220 }}>
                  <span style={{ ...styles.helperText, margin: 0 }}>KI-Anweisung</span>
                  <div style={{ ...styles.card, padding: 10, margin: 0 }}>
                    <p style={{ ...styles.helperText, margin: 0 }}>
                      {`Level ${prompt.level}, ${prompt.teilLabel}. Thema: ${prompt.topicPrompt}${prompt.keywordSubtopic ? ` (${prompt.keywordSubtopic})` : ""}.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ ...styles.card, marginTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div>
              <p style={{ ...styles.helperText, margin: 0 }}>Ausgewähltes Thema</p>
              <h3 style={{ margin: "4px 0" }}>{selectedPrompt?.topicPrompt || "Bitte ein Thema wählen"}</h3>
              <p style={{ ...styles.helperText, margin: 0 }}>
                Kopiere die Angaben und starte den KI-Dialog mit dem gewünschten Teil.
              </p>
            </div>
            <button style={styles.primaryButton} disabled={!selectedPrompt} onClick={copyToClipboard}>
              In die Zwischenablage kopieren
            </button>
          </div>

          <pre
            style={{
              background: "#0f172a",
              color: "#e2e8f0",
              padding: 12,
              borderRadius: 8,
              marginTop: 12,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {aiPayload}
          </pre>
        </div>
      </section>
    </div>
  );
};

export default SpeakingRoom;
