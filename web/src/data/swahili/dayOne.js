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
  stress: ["MA-ma", "ra-FI-ki", "mwa-LI-mu", "cha-KU-la", "Ki-swa-HI-li"],
  // Small reading checks extend the vocabulary from the supplied Day 1 teaching material.
  reading: [
    { id: "mother", question: "Katika kifungu, ni neno gani lina maana ya “mother”?", choices: ["kiti", "mama", "kuku"], answer: "mama" },
    { id: "child", question: "Katika kifungu, ni neno gani lina maana ya “child”?", choices: ["mtoto", "wewe", "kiti"], answer: "mtoto" },
    { id: "chair", question: "Katika kifungu, ni neno gani lina maana ya “chair”?", choices: ["kuku", "mama", "kiti"], answer: "kiti" },
    { id: "u", question: "Katika kifungu, ni neno gani lina vokali U mara mbili?", choices: ["wewe", "kuku", "kiti"], answer: "kuku" },
  ],
  // Comprehension questions from the recorded Day 1 conversation.
  listening: [
    {"id":"listen-topic","question":"Leo wanajifunza nini?","choices":["Salamu na majina","Alfabeti na sauti za Kiswahili","Namba na siku"],"answer":"Alfabeti na sauti za Kiswahili"},
    {"id":"listen-count","question":"Kiswahili kina irabu ngapi?","choices":["Tano","Nne","Sita"],"answer":"Tano"},
    {"id":"listen-vowels","question":"Mwalimu anataja irabu zipi?","choices":["a, e, i, o, t","a, e, b, o, u","a, e, i, o, u"],"answer":"a, e, i, o, u"},
    {"id":"listen-practice","question":"Mwalimu anamwambia mwanafunzi aseme neno gani?","choices":["Tata","Baba","Mama"],"answer":"Baba"},
    {"id":"listen-next","question":"Mwalimu anasema watakutana lini?","choices":["Kesho","Leo jioni","Wiki ijayo"],"answer":"Kesho"},
  ],
});
