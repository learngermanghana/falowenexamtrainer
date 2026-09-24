export const B2_LISTENING_PRACTICE = Object.freeze({
  2: { title: "Mülltrennung, Recycling und Kreislaufwirtschaft", audioKey: "", transcript: "" },
  6: { title: "Energie sparen und erneuerbare Energien", audioKey: "", transcript: "" },
  10: { title: "Kindergarten und frühkindliche Bildung", audioKey: "", transcript: "" },
  14: { title: "Wissenschaft, Desinformation und verlässliche Quellen", audioKey: "", transcript: "" },
  18: { title: "Arbeitswelt, Fachkräftemangel und Weiterbildung", audioKey: "", transcript: "" },
  22: { title: "Künstliche Intelligenz, Automatisierung und Arbeitsplätze", audioKey: "", transcript: "" },
  26: { title: "Migration, Integration und Sprache", audioKey: "", transcript: "" },
});

export const getB2ListeningPractice = (day) =>
  B2_LISTENING_PRACTICE[Number(day)] || null;

export const hasB2ListeningSource = (practice) =>
  Boolean(String(practice?.audioKey || "").trim());

export default B2_LISTENING_PRACTICE;
