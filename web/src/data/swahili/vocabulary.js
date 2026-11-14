import { SWAHILI_DAY_ONE } from "./dayOne";
import { SWAHILI_DAY_SIX } from "./daySix";

// The mailed A1/A2 syllabus is a topic outline, not a translation dictionary.
// Only the teacher's published Day 1 materials and Lesson 6 restaurant PDFs
// supply verified Kiswahili–English pairs. Keep other topics unpublished.
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
  ...[...SWAHILI_DAY_SIX.food, ...SWAHILI_DAY_SIX.drinks].map(({ sw, en }) => ({ sw, en, source: "day-6" })),
];

export const SWAHILI_DICTIONARY_WORDS = Array.from(
  new Map(starterVocabulary.filter(({ sw, en }) => sw && en).map((entry) => [entry.sw.toLocaleLowerCase("sw"), entry])).values()
).sort((a, b) => a.sw.localeCompare(b.sw, "sw"));
