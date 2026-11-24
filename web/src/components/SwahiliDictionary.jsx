import React, { useMemo, useState } from "react";
import { SWAHILI_A1_PRACTICE_UNITS } from "../data/swahili/a1PracticeUnits";
import { SWAHILI_DAY_ONE } from "../data/swahili/dayOne";
import { SWAHILI_DAY_SIX } from "../data/swahili/daySix";

// The emailed "HATUA YA AWALI (Kiswahili A1 and A2)" is a teaching syllabus,
// not a translation dictionary. Topics are sourced from its 20-topic outline.
// Vocabulary comes from pronunciation, restaurant, shopping, calendar and daily routine lessons.
export const SWAHILI_DICTIONARY_TOPICS = [
  "Salamu", "Utambulisho", "Familia", "Mgahawani", "Sokoni",
  "Dukani", "Siku, Miezi na Tarehe", "Kutaja Saa na Shughuli za Kila Siku", "Shughuli za Kila Siku",
  "Hospitalini", "Kusafiri", "Safari ya Kitalii", "Hali ya Hewa na Majira",
  "Watu na Taaluma Zao", "Ofisini", "Sikukuu na Matukio Mbalimbali",
  "Huduma za Malazi", "Kutoa Taarifa za Matukio", "Mawasiliano ya Kirafiki",
  "Nchi ya Tanzania",
];

const vocabularyDays = [10, 11, 12, 13];

const starterVocabulary = [
  ...SWAHILI_DAY_ONE.vowels.map(({ word, meaning }) => ({ sw: word, en: meaning, source: "day-1" })),
  ...SWAHILI_DAY_ONE.combinations.map(({ word, meaning }) => ({ sw: word, en: meaning, source: "day-1" })),
  ...[...SWAHILI_DAY_SIX.food, ...SWAHILI_DAY_SIX.drinks].map(({sw,en}) => ({sw,en,source:"day-6"})),
  ...vocabularyDays.flatMap((day) => SWAHILI_A1_PRACTICE_UNITS[day].vocabulary.map((entry) => ({ ...entry, source: `day-${day}` }))),
];

export const SWAHILI_DICTIONARY_WORDS = Array.from(
  new Map(starterVocabulary.filter(({ sw, en }) => sw && en).map((entry) => [`${entry.source}:${entry.sw.toLocaleLowerCase("sw")}`, entry])).values()
).sort((a, b) => a.sw.localeCompare(b.sw, "sw"));

const dictionaryWordCount = new Set(SWAHILI_DICTIONARY_WORDS.map(({ sw }) => sw.toLocaleLowerCase("sw"))).size;

export default function SwahiliDictionary() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("all");
  const matches = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    const filtered = SWAHILI_DICTIONARY_WORDS.filter((entry) =>
      (!needle || (entry.sw + " " + entry.en).toLocaleLowerCase().includes(needle))
      && (selected === "all" || entry.source === selected)
    );
    return Array.from(new Map(filtered.map((entry) => [entry.sw.toLocaleLowerCase("sw"), entry])).values());
  }, [query, selected]);

  return (
    <section className="swahili-book__card swahili-book__activity" aria-label="Kamusi ya Kiswahili">
      <h2>Kamusi ya Kiswahili · Swahili Dictionary</h2>
      <p>Search words in Kiswahili or English.</p>
      <div className="swahili-book__form">
        <label htmlFor="swahili-dictionary-search">Tafuta neno · Search
          <input id="swahili-dictionary-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. mama, mother, chai" />
        </label>
        <label htmlFor="swahili-dictionary-topic">Chanzo · Source
          <select id="swahili-dictionary-topic" value={selected} onChange={(event) => setSelected(event.target.value)}>
            <option value="all">All available words</option>
            <option value="day-1">Somo la 1 · Alfabeti na matamshi</option>
            <option value="day-6">Somo la 6 · Mgahawani (Topic 4)</option>
            {vocabularyDays.map((day) => (
              <option key={day} value={`day-${day}`}>Somo la {day} · {SWAHILI_A1_PRACTICE_UNITS[day].title}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="swahili-book__small" role="status">{matches.length} / {dictionaryWordCount} words</p>
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
