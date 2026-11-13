import React, { useMemo, useState } from "react";
import { SWAHILI_DAY_ONE } from "../data/swahili/dayOne";
import { SWAHILI_DAY_SIX } from "../data/swahili/daySix";

// The emailed "HATUA YA AWALI (Kiswahili A1 and A2)" is a teaching syllabus,
// not a translation dictionary. Topics are sourced from its 20-topic outline.
// Verified vocabulary comes from the original Day 1 teaching material and
// Ruth's two A1 restaurant PDFs for Lesson 6. Unpublished topics remain headings only.
export const SWAHILI_DICTIONARY_TOPICS = [
  "Salamu", "Utambulisho", "Familia", "Mgahawani", "Sokoni",
  "Dukani", "Mapishi ya Kitanzania", "Nyumbani", "Shughuli za Kila Siku",
  "Hospitalini", "Kusafiri", "Safari ya Kitalii", "Hali ya Hewa na Majira",
  "Watu na Taaluma Zao", "Ofisini", "Sikukuu na Matukio Mbalimbali",
  "Huduma za Malazi", "Kutoa Taarifa za Matukio", "Mawasiliano ya Kirafiki",
  "Nchi ya Tanzania",
];

const starterVocabulary = [
  ...SWAHILI_DAY_ONE.vowels.map(({ word, meaning }) => ({ sw: word, en: meaning, source: "day-1" })),
  ...SWAHILI_DAY_ONE.combinations.map(({ word, meaning }) => ({ sw: word, en: meaning, source: "day-1" })),
  ...[...SWAHILI_DAY_SIX.food, ...SWAHILI_DAY_SIX.drinks].map(({sw,en}) => ({sw,en,source:"day-6"})),
];

export const SWAHILI_DICTIONARY_WORDS = Array.from(
  new Map(starterVocabulary.filter(({ sw, en }) => sw && en).map((entry) => [entry.sw.toLocaleLowerCase("sw"), entry])).values()
).sort((a, b) => a.sw.localeCompare(b.sw, "sw"));

export default function SwahiliDictionary() {
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
      {matches.length ? (
        <div className="swahili-book__grid">
          {matches.map(({ sw, en }) => (
            <div className="swahili-book__tile" key={sw}>
              <strong lang="sw">{sw}</strong>
              <div className="swahili-book__small" lang="en">{en}</div>
            </div>
          ))}
        </div>
      ) : <p>No matching words yet. Try another search.</p>}
    </section>
  );
}
