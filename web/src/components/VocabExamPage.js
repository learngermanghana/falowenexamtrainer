import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import { useExam, ALLOWED_LEVELS } from "../context/ExamContext";
import { useAuth } from "../context/AuthContext";
import { fetchVocabularyFromSheet, VOCAB_SOURCE_URL } from "../services/vocabService";

const normalizeProfileLevel = (rawLevel) => {
  const normalized = (rawLevel || "").trim().toUpperCase();
  if (ALLOWED_LEVELS.includes(normalized)) return normalized;
  const fuzzyMatch = ALLOWED_LEVELS.find((allowed) => normalized.startsWith(allowed));
  return fuzzyMatch || "";
};

const VocabExamPage = () => {
  const { level, setLevel, setError } = useExam();
  const { studentProfile } = useAuth();
  const profileLevel = normalizeProfileLevel(studentProfile?.level);
  const isLevelLocked = ALLOWED_LEVELS.includes(profileLevel);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setLocalError] = useState("");

  useEffect(() => {
    if (isLevelLocked && level !== profileLevel) {
      setLevel(profileLevel);
    }
  }, [isLevelLocked, level, profileLevel, setLevel]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setLocalError("");
      try {
        const vocab = await fetchVocabularyFromSheet();
        if (!isMounted) return;
        setItems(vocab);
      } catch (err) {
        console.error("Failed to load vocab sheet", err);
        if (!isMounted) return;
        setLocalError(err?.message || "Konnte Vokabeln nicht laden.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const levelItems = useMemo(
    () => items.filter((item) => item.level === level),
    [items, level]
  );

  const hasAudio = (entry) => entry.audioNormal || entry.audioSlow;

  const renderAudio = (entry) => {
    if (!hasAudio(entry)) return null;

    return (
      <div style={{ display: "grid", gap: 6, marginTop: 8 }}>
        {entry.audioNormal ? (
          <audio controls style={styles.audioPlayer} src={entry.audioNormal}>
            Your browser does not support the audio element.
          </audio>
        ) : null}
        {entry.audioSlow ? (
          <audio controls style={styles.audioPlayer} src={entry.audioSlow}>
            Your browser does not support the audio element.
          </audio>
        ) : null}
      </div>
    );
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div>
            <p style={{ ...styles.helperText, margin: 0 }}>Exam Room</p>
            <h2 style={{ ...styles.sectionTitle, margin: "4px 0 2px" }}>Vokabeln aus dem Sheet</h2>
            <p style={{ ...styles.helperText, margin: 0 }}>
              Gefiltert nach deinem Niveau. Quelle: Sheet1 (Google Sheet).
            </p>
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ ...styles.label, margin: 0 }}>
              Level auswählen {isLevelLocked ? "(aus Profil)" : ""}
            </label>
            <select
              value={level}
              onChange={(e) => {
                setLevel(e.target.value);
                setError("");
              }}
              style={styles.select}
              disabled={isLevelLocked}
            >
              {ALLOWED_LEVELS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {loading ? (
        <section style={styles.card}>
          <p style={{ ...styles.helperText, margin: 0 }}>Lade Vokabeln aus dem Sheet ...</p>
        </section>
      ) : error ? (
        <section style={styles.card}>
          <div style={styles.errorBox}>
            <strong>Hinweis:</strong> {error}
          </div>
        </section>
      ) : levelItems.length === 0 ? (
        <section style={styles.card}>
          <p style={{ ...styles.helperText, margin: 0 }}>
            Keine Vokabeln für Niveau {level} gefunden. Bitte prüfe das Sheet oder wähle ein anderes Niveau.
          </p>
        </section>
      ) : (
        <section style={styles.card}>
          <div style={{ ...styles.metaRow, marginTop: 0, marginBottom: 12 }}>
            <h3 style={{ ...styles.sectionTitle, margin: 0 }}>Vokabel-Liste (Niveau {level})</h3>
            <a href={VOCAB_SOURCE_URL} target="_blank" rel="noreferrer" style={styles.secondaryButton}>
              Sheet öffnen
            </a>
          </div>
          <div style={{ ...styles.vocabGrid, marginTop: 0 }}>
            {levelItems.map((entry) => (
              <div key={entry.id} style={{ ...styles.vocabCard, background: "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>{entry.german || "—"}</div>
                  <span style={styles.levelPill}>{entry.level}</span>
                </div>
                <p style={{ ...styles.helperText, margin: "4px 0 6px" }}>{entry.english || "No English translation"}</p>
                {hasAudio(entry) ? (
                  <div style={{ display: "grid", gap: 4 }}>
                    {entry.audioNormal ? <span style={styles.badge}>Audio (normal)</span> : null}
                    {entry.audioSlow ? <span style={styles.badge}>Audio (slow)</span> : null}
                  </div>
                ) : null}
                {renderAudio(entry)}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default VocabExamPage;
