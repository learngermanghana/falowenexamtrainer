export const A1_RADIO_RESOURCES = Object.freeze({
  1: Object.freeze({
    key: "a1-day1-greetings-wellbeing-falowen-radio",
    title: "Greetings and Asking About Well-being · Kapitel 0.1",
    youtubeId: "rqnqC3AyfDk",
    duration: "",
    instruction:
      "Listen carefully and repeat the greetings and well-being questions. Then continue to the workbook assignment.",
  }),
  2: Object.freeze({
    key: "a1-day2-chapter-1-1-falowen-radio",
    title: "A1 Day 2 · Kapitel 1.1",
    youtubeId: "Uru9bvr14mw",
    duration: "",
    instruction:
      "Listen carefully to the Kapitel 1.1 lesson. Then continue to the Day 2 workbook assignment.",
  }),
  3: Object.freeze({
    key: "a1-day3-chapter-1-1-falowen-radio",
    title: "A1 Day 3 · Kapitel 1.1",
    youtubeId: "DnfWKdi6DsA",
    duration: "",
    instruction:
      "Listen carefully to the Kapitel 1.1 lesson. Then continue to the Day 3 workbook assignment.",
  }),
  4: Object.freeze({
    key: "a1-day4-german-numbers-falowen-radio",
    title: "German Numbers · Kapitel 2",
    youtubeId: "lMeNuJCloD0",
    duration: "",
    instruction:
      "Listen carefully to the German numbers lesson. Then continue to the Kapitel 2 workbook assignment.",
  }),
  5: Object.freeze({
    key: "a1-day5-introducing-yourself-articles-falowen-radio",
    title: "Introducing Yourself and Articles · Kapitel 1.3",
    youtubeId: "4yGJ9-Fz19A",
    duration: "",
    instruction:
      "Listen carefully to the lesson on introductions, articles, adjectives and W-questions. Then continue to the Day 5 workbook.",
  }),
  6: Object.freeze({
    key: "a1-day6-chapter-2-3-falowen-radio",
    chapter: "2.3",
    title: "A1 Day 6 · Kapitel 2.3",
    youtubeId: "0joiZBDlffk",
    duration: "",
    instruction: "Listen carefully to the Kapitel 2.3 episode. Then continue to the lesson resources.",
  }),
  7: Object.freeze({
    key: "a1-day7-chapter-3-falowen-radio",
    chapter: "3",
    title: "A1 Day 7 · Kapitel 3",
    youtubeId: "hQNDEyMrXds",
    duration: "",
    instruction: "Listen carefully to the Kapitel 3 episode. Then continue to the lesson resources.",
  }),
  8: Object.freeze({
    key: "a1-day8-chapter-4-falowen-radio",
    chapter: "4",
    title: "A1 Day 8 · Kapitel 4",
    youtubeId: "o1LAiSqPLag",
    duration: "",
    instruction: "Listen carefully to the Kapitel 4 episode. Then continue to the lesson resources.",
  }),
  9: Object.freeze({
    key: "a1-day9-german-cases-falowen-radio",
    chapter: "5",
    title: "German Cases · Kapitel 5",
    youtubeId: "DV8dSaI076o",
    duration: "",
    instruction:
      "Listen carefully to the German cases episode. Then continue to the Kapitel 5 teacher lecture and lesson resources.",
  }),
  11: Object.freeze({
    key: "a1-day11-understanding-time-falowen-radio",
    chapter: "7",
    title: "Understanding Time · Kapitel 7",
    youtubeId: "asJsRtaR1x0",
    duration: "",
    instruction:
      "Listen carefully to the Understanding Time episode. Then continue to the Kapitel 7 teacher lecture and lesson resources.",
  }),
  13: Object.freeze({
    key: "a1-day13-revision-numbers-time-prices-falowen-radio",
    title: "Revision: Numbers, Time and Prices",
    youtubeId: "owCQscHPmzQ",
    duration: "",
    instruction:
      "Listen carefully and revise numbers, time and prices. Then continue to the workbook practice.",
  }),
  20: Object.freeze({
    key: "a1-day20-letter-writing-intro-falowen-radio",
    title: "Letter Writing Introduction · Kapitel 12.3",
    youtubeId: "B-LFDrF0zsY",
    duration: "",
    instruction:
      "Listen carefully to the letter-writing introduction. Then continue to the Kapitel 12.3 workbook assignment.",
  }),
  21: Object.freeze({
    key: "a1-day21-weather-falowen-radio",
    title: "Weather · Kapitel 13",
    youtubeId: "fRYM7ojc0Yo",
    duration: "",
    instruction:
      "Listen carefully to the weather lesson. Then continue to the Kapitel 13 workbook assignment.",
  }),
  22: Object.freeze({
    key: "a1-day22-health-body-parts-falowen-radio",
    title: "Health and Body Parts · Kapitel 14.1",
    youtubeId: "23uCwszjahg",
    duration: "",
    instruction:
      "Listen carefully to the health and body-parts lesson. Then continue to the Kapitel 14.1 workbook assignment.",
  }),
});

export const getA1RadioResource = (day = "", chapter = "") => {
  const resource = A1_RADIO_RESOURCES[Number(day)] || null;
  const requestedChapter = String(chapter ?? "").trim();
  if (resource?.chapter && requestedChapter && resource.chapter !== requestedChapter) return null;
  return resource;
};
