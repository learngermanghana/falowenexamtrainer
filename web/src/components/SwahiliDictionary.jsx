import React, { useEffect, useMemo, useState } from "react";
import { SWAHILI_DICTIONARY_WORDS } from "../data/swahili/vocabulary";
import {
  getSwahiliWordId, readSavedSwahiliWordIds, setSwahiliWordSaved,
} from "../services/swahiliSavedVocabulary";

// Preserve previous named exports for existing lesson consumers.
export { SWAHILI_DICTIONARY_WORDS, SWAHILI_DICTIONARY_TOPICS } from "../data/swahili/vocabulary";

export default function SwahiliDictionary({ uid = null, allowSave = false }) {
  const [savedIds, setSavedIds] = useState(() => allowSave ? readSavedSwahiliWordIds(uid) : []);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    setSavedIds(allowSave ? readSavedSwahiliWordIds(uid) : []);
    setSaveError("");
  }, [uid, allowSave]);

  const saved = useMemo(() => new Set(savedIds), [savedIds]);
  const toggleSave = (word) => {
    if (!allowSave || !uid) return;
    const id = getSwahiliWordId(word);
    try {
      setSavedIds(setSwahiliWordSaved(uid, id, !saved.has(id)));
      setSaveError("");
    } catch {
      setSaveError("Could not save this word. Check browser storage settings.");
    }
  };
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("all");
  const matches = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return SWAHILI_DICTIONARY_WORDS.filter((entry) =>
      (!needle || (entry.sw + " " + entry.en).toLocaleLowerCase().includes(needle))
      && (selected === "all" || entry.source === selected)
    );
  }, [query, selected]);

  return (
    <section className="swahili-book__card swahili-book__activity" aria-label="Kamusi ya Kiswahili">
      <h2>Kamusi ya Kiswahili · Swahili Dictionary</h2>
      <p>Search verified words from Somo la 1 and Somo la 6 (Mgahawani). Remaining syllabus topics will be added when their materials are provided.</p>
      <div className="swahili-book__form">
        <label htmlFor="swahili-dictionary-search">Tafuta neno · Search
          <input id="swahili-dictionary-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. mama, mother, chai" />
        </label>
        <label htmlFor="swahili-dictionary-topic">Chanzo · Source
          <select id="swahili-dictionary-topic" value={selected} onChange={(event) => setSelected(event.target.value)}>
            <option value="all">All available words</option>
            <option value="day-1">Somo la 1 · Alfabeti na matamshi</option>
            <option value="day-6">Somo la 6 · Mgahawani (Topic 4)</option>
          </select>
        </label>
      </div>
      <p className="swahili-book__small" role="status">{matches.length} / {SWAHILI_DICTIONARY_WORDS.length} words</p>
      {saveError && <p role="alert" className="swahili-book__note">{saveError}</p>}
      {matches.length ? (
        <div className="swahili-book__grid">
          {matches.map((entry) => (
            <div className="swahili-book__tile" key={getSwahiliWordId(entry)}>
              <strong lang="sw">{entry.sw}</strong>
              <div className="swahili-book__small" lang="en">{entry.en}</div>
              {allowSave && uid && (
                <button type="button" className="swahili-book__button swahili-book__button--soft"
                  aria-label={`${saved.has(getSwahiliWordId(entry)) ? "Remove" : "Save"} ${entry.sw}`}
                  aria-pressed={saved.has(getSwahiliWordId(entry))}
                  onClick={() => toggleSave(entry)}>
                  {saved.has(getSwahiliWordId(entry)) ? "Saved ✓" : "Save word"}
                </button>
              )}
            </div>
          ))}
        </div>
      ) : <p>No matching words yet. Try another search.</p>}
    </section>
  );
}
