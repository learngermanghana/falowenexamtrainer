export const A1_RADIO_RESOURCES = Object.freeze({
  1: Object.freeze({
    key: "a1-day1-greetings-wellbeing-falowen-radio",
    title: "Greetings and Asking About Well-being · Kapitel 0.1",
    youtubeId: "rqnqC3AyfDk",
    duration: "",
    instruction:
      "Listen carefully and repeat the greetings and well-being questions. Then continue to the workbook assignment.",
  }),
  13: Object.freeze({
    key: "a1-day13-revision-numbers-time-prices-falowen-radio",
    title: "Revision: Numbers, Time and Prices",
    youtubeId: "owCQscHPmzQ",
    duration: "",
    instruction:
      "Listen carefully and revise numbers, time and prices. Then continue to the workbook practice.",
  }),
  21: Object.freeze({
    key: "a1-day21-weather-falowen-radio",
    title: "Weather · Kapitel 13",
    youtubeId: "scaiyC3AD3E",
    duration: "",
    instruction:
      "Listen carefully to the weather lesson. Then continue to the Kapitel 13 workbook assignment.",
  }),
});

export const getA1RadioResource = (day = "") =>
  A1_RADIO_RESOURCES[Number(day)] || null;
