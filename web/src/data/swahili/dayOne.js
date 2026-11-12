// Kiswahili lesson source: “Kiswahili Alfabeti Sauti na Matamshi” (Ruth's Day 1 teaching material).
// This is a single-topic, first-day pilot; do not generate extra days or scored assessments.
export const SWAHILI_DAY_ONE = Object.freeze({
  day: 1,
  title: "Alfabeti, sauti na matamshi",
  chapter: "Somo la 1",
  objective: "Kutambua vokali na konsonanti, kusoma silabi, na kutamka maneno ya Kiswahili kwa usahihi.",
  vowels: [
    { letter: "A", word: "mama", meaning: "mother" },
    { letter: "E", word: "wewe", meaning: "you" },
    { letter: "I", word: "kiti", meaning: "chair" },
    { letter: "O", word: "mtoto", meaning: "child" },
    { letter: "U", word: "kuku", meaning: "chicken" },
  ],
  combinations: [
    { letters: "ch", word: "chai", meaning: "tea" },
    { letters: "dh", word: "dhahabu", meaning: "gold" },
    { letters: "gh", word: "gharama", meaning: "cost" },
    { letters: "ng’", word: "ng’ombe", meaning: "cow" },
    { letters: "ny", word: "nyanya", meaning: "tomato" },
    { letters: "sh", word: "shule", meaning: "school" },
    { letters: "th", word: "thelathini", meaning: "thirty" },
  ],
  syllables: [
    { stem: "B", forms: "ba · be · bi · bo · bu" },
    { stem: "CH", forms: "cha · che · chi · cho · chu" },
    { stem: "L", forms: "la · le · li · lo · lu" },
  ],
  stress: ["ma-MA", "ra-FI-ki", "mwa-LI-mu", "cha-KU-la", "Ki-swa-HI-li"],
  // The teacher reads these words; there is no approved recorded audio for this pilot.
  listening: [
    { word: "mama", answer: "A" },
    { word: "wewe", answer: "E" },
    { word: "kiti", answer: "I" },
    { word: "moto", answer: "O" },
    { word: "kuku", answer: "U" },
  ],
});
