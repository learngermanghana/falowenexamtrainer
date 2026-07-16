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

export const getA1RadioResource = (day = "") =>
  A1_RADIO_RESOURCES[Number(day)] || null;
