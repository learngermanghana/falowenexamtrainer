const chapterRadioKey = (day = "", chapter = "") =>
  `${Number(day)}:${String(chapter || "").trim()}`;

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
    chapter: "1.1",
    title: "A1 Day 3 · Kapitel 1.1",
    youtubeId: "y9LhKQkjsqM",
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
    youtubeId: "XrSTHS60LI4",
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
  12: Object.freeze({
    key: "a1-day12-24-hour-clock-dates-falowen-radio",
    chapter: "8",
    title: "The 24 Hour Clock and Dates · Kapitel 8",
    youtubeId: "nfr-oVo4lco",
    duration: "",
    instruction:
      "Listen carefully to the 24-hour clock and dates episode. Then continue to the Kapitel 8 lesson resources.",
  }),
  13: Object.freeze({
    key: "a1-day13-revision-numbers-time-prices-falowen-radio",
    title: "Revision: Numbers, Time and Prices",
    youtubeId: "owCQscHPmzQ",
    duration: "",
    instruction:
      "Listen carefully and revise numbers, time and prices. Then continue to the workbook practice.",
  }),
  14: Object.freeze({
    key: "a1-day14-modal-verbs-separable-verbs-falowen-radio",
    chapter: "3.6",
    title: "Modal Verbs with Separable Verbs · Kapitel 3.6",
    youtubeId: "GeHygJE7Hww",
    duration: "",
    instruction:
      "Listen carefully to the modal-verbs episode. Then continue to the tutor lecture and lesson resources. The AI lesson video opens inside the workbook.",
  }),
  15: Object.freeze({
    key: "a1-day15-speaking-exams-introduction-falowen-radio",
    chapter: "4.7",
    title: "Speaking Exams Introduction · Kapitel 4.7",
    youtubeId: "HfNlBfUwGBo",
    duration: "",
    instruction:
      "Listen carefully to the speaking-exam introduction. Then continue to the teacher lecture and supporting resources before opening the workbook.",
  }),
  16: Object.freeze({
    key: "a1-day16-negation-food-daily-life-falowen-radio",
    chapter: "9",
    title: "Negation, Food and Daily Life · Kapitel 9",
    youtubeId: "cQAsQ14a77c",
    duration: "",
    instruction:
      "Listen carefully to the Kapitel 9 episode. Then continue to the teacher lecture and lesson resources. The AI lesson video opens inside the workbook.",
  }),
  17: Object.freeze({
    key: "a1-day17-chapter-11-falowen-radio",
    chapter: "11",
    title: "A1 Day 17 · Kapitel 11",
    youtubeId: "8Mh4PCSm6QE",
    duration: "",
    instruction:
      "Listen carefully to the Kapitel 11 episode. Then continue to the lesson resources and workbook.",
  }),
  18: Object.freeze({
    key: "a1-day18-chapter-12-1-falowen-radio",
    chapter: "12.1",
    title: "A1 Day 18 · Kapitel 12.1",
    youtubeId: "G6khh2VagPA",
    duration: "",
    instruction:
      "Listen carefully to the Kapitel 12.1 episode. Then continue to the lesson resources and workbook.",
  }),
  19: Object.freeze({
    key: "a1-day19-verboten-erlaubt-falowen-radio",
    chapter: "5.9",
    title: "Verboten und erlaubt · Kapitel 5.9",
    youtubeId: "wjBYShPq-RM",
    duration: "",
    instruction:
      "Listen carefully to the Kapitel 5.9 episode. Then continue to the self-learning materials and workbook.",
  }),
  20: Object.freeze({
    key: "a1-day20-letter-writing-intro-falowen-radio",
    chapter: "12.3",
    title: "Letter Writing Introduction · Kapitel 12.3",
    youtubeId: "Ve-iOgbgSw4",
    duration: "",
    instruction:
      "Listen carefully to the letter-writing introduction. Then continue to the Kapitel 12.3 workbook assignment.",
  }),
  21: Object.freeze({
    key: "a1-day21-weather-falowen-radio",
    chapter: "13",
    title: "Weather · Kapitel 13",
    youtubeId: "Ve-iOgbgSw4",
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

export const A1_CHAPTER_RADIO_RESOURCES = Object.freeze({
  [chapterRadioKey(3, "1.2")]: Object.freeze({
    key: "a1-day3-chapter-1-2-falowen-radio",
    chapter: "1.2",
    title: "A1 Day 3 · Kapitel 1.2",
    youtubeId: "XrSTHS60LI4",
    duration: "",
    instruction:
      "Listen carefully to the Kapitel 1.2 episode. Then continue to the lesson resources and workbook.",
  }),
  [chapterRadioKey(16, "10")]: Object.freeze({
    key: "a1-day16-food-daily-life-kapitel-10-falowen-radio",
    chapter: "10",
    title: "Food and Daily Life · Kapitel 10",
    youtubeId: "lp7ePIbp-Ws",
    duration: "",
    instruction:
      "Listen carefully to the Kapitel 10 episode. Then continue to the supporting lesson resources and workbook.",
  }),
  [chapterRadioKey(18, "12.2")]: Object.freeze({
    key: "a1-day18-chapter-12-2-falowen-radio",
    chapter: "12.2",
    title: "A1 Day 18 · Kapitel 12.2",
    youtubeId: "d_iHJMUUl6o",
    duration: "",
    instruction:
      "Listen carefully to the Kapitel 12.2 episode. Then continue to the lesson resources and workbook.",
  }),
});

export const getA1RadioResource = (day = "", chapter = "") => {
  const requestedChapter = String(chapter ?? "").trim();
  const chapterSpecific = requestedChapter
    ? A1_CHAPTER_RADIO_RESOURCES[chapterRadioKey(day, requestedChapter)] || null
    : null;
  if (chapterSpecific) return chapterSpecific;

  const resource = A1_RADIO_RESOURCES[Number(day)] || null;
  if (resource?.chapter && requestedChapter && resource.chapter !== requestedChapter) return null;
  return resource;
};
