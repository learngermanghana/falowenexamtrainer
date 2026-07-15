export const A1_RADIO_RESOURCES = Object.freeze({
  1: Object.freeze({
    key: "a1-day1-greetings-wellbeing-falowen-radio",
    title: "Greetings and Asking About Well-being · Kapitel 0.1",
    youtubeId: "rqnqC3AyfDk",
    duration: "",
    instruction:
      "Listen carefully and repeat the greetings and well-being questions. Then continue to the workbook assignment.",
  }),
  "2:0.2": Object.freeze({
    key: "a1-day2-german-alphabet-falowen-radio",
    title: "German Alphabet · Kapitel 0.2",
    youtubeId: "7F9nEMpvRpY",
    duration: "",
    instruction:
      "Listen carefully and repeat the German letters and sounds. Then continue to the Kapitel 0.2 workbook assignment.",
  }),
});

const radioKey = (day = "", chapter = "") =>
  `${Number(day)}:${String(chapter || "").trim()}`;

export const getA1RadioResource = (day = "", chapter = "") =>
  A1_RADIO_RESOURCES[radioKey(day, chapter)] ||
  A1_RADIO_RESOURCES[Number(day)] ||
  null;
