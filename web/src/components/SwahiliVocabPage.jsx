import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { SWAHILI_DICTIONARY_WORDS } from "../data/swahili/vocabulary";
import {
  getSwahiliWordId, readSavedSwahiliWordIds, setSwahiliWordSaved,
} from "../services/swahiliSavedVocabulary";
import { styles } from "../styles";

const sourceLabels = {
  "day-1": "Somo la 1 · Alfabeti na matamshi",
  "day-6": "Somo la 6 · Mgahawani",
};

export default function SwahiliVocabPage() {
  const { user } = useAuth();
  const uid = user?.uid || null;
  const [savedIds, setSavedIds] = useState(() => readSavedSwahiliWordIds(uid));
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("all");
  const [savedOnly, setSavedOnly] = useState(false);
  const [mode, setMode] = useState("browse");
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [storageError, setStorageError] = useState("");

  // Never retain another account's saved state if authentication changes.
  useEffect(() => {
    setSavedIds(readSavedSwahiliWordIds(uid));
    setStorageError("");
  }, [uid]);

  const saved = useMemo(() => new Set(savedIds), [savedIds]);
  const filtered = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase("sw");
    return SWAHILI_DICTIONARY_WORDS.filter((entry) => {
      if (source !== "all" && source !== entry.source) return false;
      if (savedOnly && !saved.has(getSwahiliWordId(entry))) return false;
      return !needle || `${entry.sw} ${entry.en}`.toLocaleLowerCase("sw").includes(needle);
    });
  }, [search, source, savedOnly, saved]);

  useEffect(() => {
    setIndex(0);
    setRevealed(false);
  }, [search, source, savedOnly, mode]);

  // Saving a later flashcard should not restart practice at the first card.
  useEffect(() => {
    setIndex((previous) => Math.min(previous, Math.max(0, filtered.length - 1)));
  }, [filtered.length]);

  const currentIndex = Math.min(index, Math.max(0, filtered.length - 1));
  const current = filtered[currentIndex] || null;

  const toggleSave = (entry) => {
    if (!uid) return;
    const id = getSwahiliWordId(entry);
    try {
      const next = setSwahiliWordSaved(uid, id, !saved.has(id));
      setSavedIds(next);
      setStorageError("");
    } catch {
      setStorageError("Saved words could not be updated on this device. Check browser storage settings.");
    }
  };

  const saveButton = (entry) => (
    <button
      type="button"
      style={styles.secondaryButton}
      aria-label={`${saved.has(getSwahiliWordId(entry)) ? "Remove" : "Save"} ${entry.sw}`}
      aria-pressed={saved.has(getSwahiliWordId(entry))}
      disabled={!uid}
      onClick={() => toggleSave(entry)}
    >
      {saved.has(getSwahiliWordId(entry)) ? "Saved ✓" : "Save word"}
    </button>
  );

  const moveCard = (offset) => {
    setIndex((previous) => Math.max(0, Math.min(filtered.length - 1, previous + offset)));
    setRevealed(false);
  };

  return (
    <div style={{ display: "grid", gap: 12 }} data-swahili-vocabulary="true">
      <section style={styles.card}>
        <p style={{ ...styles.helperText, margin: 0 }}>Falowen Campus · Kiswahili A1</p>
        <h2 style={{ ...styles.sectionTitle, margin: "4px 0 2px" }}>Msamiati · Vocabulary Practice</h2>
        <p style={{ ...styles.helperText, margin: 0 }}>
          Search the published Kiswahili–English dictionary, save useful words and practise with flashcards.
        </p>
        <p style={{ ...styles.helperText, margin: "8px 0 0" }}>
          {SWAHILI_DICTIONARY_WORDS.length} published words · {saved.size} saved on this device
        </p>
      </section>

      <section style={styles.card}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input
            type="search"
            aria-label="Search Kiswahili or English"
            placeholder="Search Kiswahili or English..."
            style={{ ...styles.textArea, minHeight: "auto", height: 44, flex: "1 1 220px" }}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select aria-label="Filter by lesson" style={{ ...styles.select, minHeight: 44 }}
            value={source} onChange={(event) => setSource(event.target.value)}>
            <option value="all">All published lessons</option>
            {Object.entries(sourceLabels).map(([key, label]) =>
              <option key={key} value={key}>{label}</option>)}
          </select>
          <select aria-label="Vocabulary practice mode" style={{ ...styles.select, minHeight: 44 }}
            value={mode} onChange={(event) => setMode(event.target.value)}>
            <option value="browse">Browse / Scan list</option>
            <option value="cards">Flashcards</option>
          </select>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={savedOnly} onChange={(event) => setSavedOnly(event.target.checked)} />
            Saved words only
          </label>
        </div>
        <p style={{ ...styles.helperText, margin: "10px 0 0" }} role="status">
          {filtered.length} matching words. Saved words are private to this account on this device, not synced between devices.
        </p>
        {storageError && <p role="alert" style={styles.errorBox}>{storageError}</p>}
        {!uid && <p role="status">Sign in to your Falowen Kiswahili account to save words.</p>}
      </section>

      {filtered.length === 0 ? (
        <section style={styles.card}>
          <p style={{ ...styles.helperText, margin: 0 }}>
            {savedOnly ? "No saved words match these filters. Save a word in Browse mode first." :
              "No matching words. Try a different search or lesson."}
          </p>
        </section>
      ) : mode === "cards" ? (
        <section style={styles.card}>
          <div style={{ display: "grid", gap: 14 }}>
            <p style={{ ...styles.helperText, margin: 0 }}>Flashcard {currentIndex + 1} of {filtered.length}</p>
            <div style={{ ...styles.vocabCard, background: "#fff", minHeight: 148, display: "grid", alignContent: "center", gap: 12 }}>
              <strong lang="sw" style={{ fontSize: 26 }}>{current.sw}</strong>
              {revealed ? <p lang="en" style={{ fontSize: 18, margin: 0 }}>{current.en}</p> :
                <button type="button" style={styles.primaryButton}
                  onClick={() => setRevealed(true)}>Reveal English meaning</button>}
              <span style={styles.levelPill}>{sourceLabels[current.source]}</span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <button type="button" style={styles.secondaryButton} disabled={currentIndex === 0}
                onClick={() => moveCard(-1)}>Previous</button>
              <button type="button" style={styles.primaryButton} disabled={currentIndex >= filtered.length - 1}
                onClick={() => moveCard(1)}>Next card</button>
              {revealed && <button type="button" style={styles.secondaryButton} onClick={() => setRevealed(false)}>
                Hide meaning
              </button>}
              {saveButton(current)}
            </div>
          </div>
        </section>
      ) : (
        <section style={styles.card}>
          <div style={{ ...styles.vocabGrid, marginTop: 0 }}>
            {filtered.map((entry) => (
              <div key={getSwahiliWordId(entry)} style={{ ...styles.vocabCard, background: "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <strong lang="sw" style={{ fontSize: 16 }}>{entry.sw}</strong>
                  <span style={styles.levelPill}>Somo la {entry.source === "day-1" ? "1" : "6"}</span>
                </div>
                <p lang="en" style={{ ...styles.helperText, margin: "6px 0 12px" }}>{entry.en}</p>
                {saveButton(entry)}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
