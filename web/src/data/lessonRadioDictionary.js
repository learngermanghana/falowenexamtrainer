export const LESSON_RADIO_DICTIONARY = {
  A2: {
    9: {
      key: "a2-day9-urlaub-falowen-radio",
      title: "Urlaub planen",
      youtubeId: "",
      duration: "",
      instruction:
        "Höre zweimal zu. Notiere fünf nützliche Ausdrücke und beantworte danach die Fragen.",
      questions: [
        "Wohin möchten die Personen reisen?",
        "Welches Verkehrsmittel wählen sie?",
        "Welche Unterkunft und Aktivitäten planen sie?",
      ],
      usefulExpressions: [
        "Ich möchte nach ... reisen.",
        "Wir fahren mit ...",
        "Wir möchten in ... übernachten.",
        "Dort wollen wir ...",
        "Das gefällt mir, weil ...",
      ],
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
