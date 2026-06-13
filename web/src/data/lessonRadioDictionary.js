export const LESSON_RADIO_DICTIONARY = {
  A2: {
    9: {
      key: "a2-day9-urlaub-falowen-radio",
      title: "Urlaub planen",
      youtubeId: "BD663tMiWpg",
      duration: "",
      instruction:
        "Höre einfach zu und stimme dich auf das Thema Urlaub ein. Danach gehst du weiter zu Teil 1.",
    },
    16: {
      key: "a2-day16-wohlbefinden-falowen-radio",
      title: "Wohlbefinden und Entspannung",
      youtubeId: "6lq6uWK1wAs",
      duration: "",
      instruction:
        "Höre einfach zu und stimme dich auf das Thema Wohlbefinden und Entspannung ein.",
    },
  },
};

export const getLessonRadioResource = (level = "", day = "") => {
  const normalizedLevel = String(level || "")
    .trim()
    .toUpperCase();
  const normalizedDay = Number(day);

  return LESSON_RADIO_DICTIONARY[normalizedLevel]?.[normalizedDay] || null;
};
