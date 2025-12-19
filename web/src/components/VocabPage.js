import React, { useEffect, useMemo, useState } from "react";
import { styles, vocabPrompts } from "../styles";
import { fetchVocabEntries } from "../services/sheetContentService";

const STORAGE_KEY = "shared-vocab-progress";

const loadProgress = () => {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (Array.isArray(stored)) {
      return new Set(stored);
    }
  } catch (error) {
    console.warn("Could not parse vocab progress", error);
  }
  return new Set();
};

const persistProgress = (set) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
};

const VocabPage = ({
  title = "Vokabel-Booster",
  subtitle =
    "Übe dieselben Wortschätze im Kursbuch und im Prüfungsraum. Dein Fortschritt wird synchronisiert, bis du auf 'Neu starten' klickst.",
  contextLabel = "Gemeinsamer Trainer",
}) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [practicedIds, setPracticedIds] = useState(() => loadProgress());

  useEffect(() => {
    let isMounted = true;
    const loadEntries = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchVocabEntries();
        if (!isMounted) return;
        setEntries(data);
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("Vokabeln konnten nicht geladen werden.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadEntries();
    return () => {
      isMounted = false;
    };
  }, []);

  const topics = useMemo(() => {
    const unique = new Set(entries.map((entry) => entry.topic || "Allgemein"));
    return ["all", ...Array.from(unique).sort()];
  }, [entries]);

  const filteredEntries = useMemo(() => {
    if (selectedTopic === "all") return entries;
    return entries.filter((entry) => entry.topic === selectedTopic);
  }, [entries, selectedTopic]);

  const handleTogglePracticed = (id) => {
    setPracticedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      persistProgress(next);
      return next;
    });
  };

  const handleReset = () => {
    setPracticedIds(new Set());
    persistProgress(new Set());
  };

  const completionRate = entries.length
    ? Math.round((practicedIds.size / entries.length) * 100)
    : 0;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={styles.card}>
        <div style={styles.cardHeader}>
          <div>
            <p style={{ ...styles.helperText, margin: "0 0 4px" }}>{contextLabel}</p>
            <h2 style={{ ...styles.sectionTitle, margin: 0 }}>{title}</h2>
            <p style={{ ...styles.helperText, margin: "4px 0 0" }}>{subtitle}</p>
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <label style={{ fontSize: 13, color: "#374151" }}>
                Thema wählen:
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  style={{ ...styles.input, marginLeft: 8, minWidth: 180 }}
                >
                  {topics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic === "all" ? "Alle Themen" : topic}
                    </option>
                  ))}
                </select>
              </label>
              <button style={styles.secondaryButton} onClick={handleReset}>
                Neu starten
              </button>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
              <span style={styles.badge}>Geteilt mit Prüfungsraum</span>
              <span style={styles.badge}>Fortschritt: {completionRate}%</span>
            </div>
          </div>
        </div>

        {loading && <p>Vokabeln werden geladen ...</p>}
        {error && <p style={{ color: "var(--color-error)" }}>{error}</p>}

        {!loading && filteredEntries.length === 0 && (
          <p style={styles.helperText}>Keine Vokabeln für dieses Thema gefunden.</p>
        )}

        <div style={styles.vocabGrid}>
          {filteredEntries.map((entry) => {
            const practiced = practicedIds.has(entry.id);
            return (
              <div key={entry.id} style={{ ...styles.vocabCard, position: "relative" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                    <span style={styles.badge}>{entry.topic || "Thema"}</span>
                    {practiced && <span style={styles.badge}>Fertig geübt</span>}
                  </div>
                  <button
                    style={practiced ? styles.secondaryButton : styles.primaryButton}
                    onClick={() => handleTogglePracticed(entry.id)}
                  >
                    {practiced ? "Nochmal üben" : "Markieren"}
                  </button>
                </div>
                <p style={{ ...styles.vocabTitle, marginBottom: 4 }}>{entry.phrase}</p>
                {entry.translation ? (
                  <p style={{ ...styles.helperText, margin: 0 }}>{entry.translation}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <section style={styles.card}>
        <h3 style={styles.sectionTitle}>Mini-Übung</h3>
        <p style={styles.helperText}>
          Wähle zwei Ausdrücke aus den Listen oben und schreibe oder spreche einen kurzen Dialog. Kombiniere mindestens eine
          Frage und eine Bitte.
        </p>
        <ul style={styles.promptList}>
          {vocabPrompts.map((prompt) => (
            <li key={prompt}>{prompt}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default VocabPage;
