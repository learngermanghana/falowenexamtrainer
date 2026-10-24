export const B1_FALOWEN_RADIO_FALLBACKS = Object.freeze({
  5: Object.freeze({
    key: "b1-day5-besichtigungstermin-falowen-radio",
    title: "Der Besichtigungstermin 2.5",
    youtubeId: "TBMrwDohEdE",
    duration: "",
    instruction: "Höre aufmerksam zu und gehe danach weiter zum Workbook.",
  }),
  24: Object.freeze({
    key: "b1-day24-konsum-nachhaltigkeit-falowen-radio",
    title: "Konsum und Nachhaltigkeit 8.24",
    youtubeId: "mqG3AjH8mPM",
    duration: "",
    instruction: "Höre aufmerksam zu und gehe danach weiter zum Workbook.",
  }),
  25: Object.freeze({
    key: "b1-day25-online-einkaufen-falowen-radio",
    title: "Online einkaufen - Rechte und Risiken 8.25",
    youtubeId: "uVfJPcRQUiA",
    duration: "",
    instruction: "Höre aufmerksam zu und gehe danach weiter zum Workbook.",
  }),
});

export const B1_DAY5_FALOWEN_RADIO = B1_FALOWEN_RADIO_FALLBACKS[5];

export const getB1Day5RadioResource = (level = "", day = 0) => {
  if (String(level || "").trim().toUpperCase() !== "B1") return null;
  return B1_FALOWEN_RADIO_FALLBACKS[Number(day)] || null;
};
