export const A1_RADIO_RESOURCES = Object.freeze({
  1: Object.freeze({
    key: "a1-day1-greetings-wellbeing-falowen-radio",
    title: "Greetings and Asking About Well-being · Kapitel 0.1",
    youtubeId: "rqnqC3AyfDk",
    duration: "",
    instruction:
      "Listen carefully and repeat the greetings and well-being questions. Then continue to the workbook assignment.",
  }),
});

export const getA1RadioResource = (day = "") =>
  A1_RADIO_RESOURCES[Number(day)] || null;
