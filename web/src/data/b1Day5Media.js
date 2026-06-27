export const B1_DAY5_FALOWEN_RADIO = Object.freeze({
  key: "b1-day5-besichtigungstermin-falowen-radio",
  title: "Der Besichtigungstermin 2.5",
  youtubeId: "TBMrwDohEdE",
  duration: "",
  instruction:
    "Höre aufmerksam zu und stimme dich auf Besichtigungen und höfliche Terminvereinbarungen ein. Danach gehst du weiter zum Workbook.",
});

export const getB1Day5RadioResource = (level = "", day = 0) =>
  String(level || "").trim().toUpperCase() === "B1" && Number(day) === 5
    ? B1_DAY5_FALOWEN_RADIO
    : null;
