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
    15: {
      key: "a2-day15-lieblingssport-falowen-radio",
      title: "Mein Lieblingssport",
      youtubeId: "WbsTFqIT058",
      duration: "",
      instruction:
        "Höre einfach zu und stimme dich auf das Thema Lieblingssport ein. Danach gehst du weiter zu Teil 1.",
    },
    16: {
      key: "a2-day16-wohlbefinden-falowen-radio",
      title: "Wohlbefinden und Entspannung",
      youtubeId: "6lq6uWK1wAs",
      duration: "",
      instruction:
        "Höre einfach zu und stimme dich auf das Thema Wohlbefinden und Entspannung ein.",
    },
    26: {
      key: "a2-day26-gefuehle-beschreiben-falowen-radio",
      title: "Gefühle in verschiedenen Situationen beschreiben 10.26",
      youtubeId: "9OVfA1B-nuU",
      duration: "",
      instruction:
        "Höre einfach zu und stimme dich auf das Thema Gefühle in verschiedenen Situationen ein. Danach gehst du weiter zu Teil 1.",
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

export const resolveLessonRoute = (pathname = "") => {
  const match = String(pathname).match(/^\/campus\/course\/lesson\/(A2|B1|B2|C1)\/(\d+)\/?$/i)
    || String(pathname).match(/^\/campus\/course\/(A2|B1|B2|C1)-day-(\d+)-.*-workbook\/?$/i);
  return match ? { level: match[1].toUpperCase(), day: Number(match[2]) } : null;
};