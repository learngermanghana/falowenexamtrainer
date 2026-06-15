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
    27: {
      key: "a2-day27-digitale-kommunikation-falowen-radio",
      title: "Digitale Kommunikation 10.27",
      youtubeId: "XLyXDfsM-HY",
      duration: "",
      instruction:
        "Höre einfach zu und stimme dich auf das Thema digitale Kommunikation ein. Danach gehst du weiter zu Teil 1.",
    },
  },
  B2: {
    1: {
      key: "b2-day1-persoenliche-identitaet-falowen-radio",
      title: "Persönliche Identität und Selbstverständnis",
      youtubeId: "0lTNin1NTgc",
      duration: "",
      instruction:
        "Höre aufmerksam zu und stimme dich auf das Thema persönliche Identität und Selbstverständnis ein. Danach gehst du weiter zum Lernteil.",
    },
  },
  C1: {
    1: {
      key: "c1-day1-ziele-lernweg-falowen-radio",
      title: "Ziele und Lernweg",
      youtubeId: "McNk1VTFvMk",
      duration: "",
      instruction:
        "Höre aufmerksam zu und stimme dich auf realistische Lernziele und einen flexiblen Lernweg ein. Danach gehst du weiter zum Lernteil.",
    },
    2: {
      key: "c1-day2-kultur-identitaet-falowen-radio",
      title: "Kultur und Identität",
      youtubeId: "rmaxh302FEY",
      duration: "",
      instruction:
        "Höre aufmerksam zu und stimme dich auf das Thema Kultur und Identität ein. Danach gehst du weiter zum Lernteil.",
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
