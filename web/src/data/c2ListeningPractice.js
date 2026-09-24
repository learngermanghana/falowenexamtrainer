export const C2_LISTENING_PRACTICE = Object.freeze({
  2: { title: "Schulpflicht und Bildungsgerechtigkeit", audioKey: "c2/day-02/day-02.m4a", audioUrl: "", transcript: "" },
  6: { title: "Soziale Ungleichheit und Chancengerechtigkeit", audioKey: "", audioUrl: "", transcript: "" },
  10: { title: "Medizin, Gesundheit und Forschungsethik", audioKey: "", audioUrl: "", transcript: "" },
  14: { title: "Kultur, Literatur und gesellschaftliches Gedächtnis", audioKey: "", audioUrl: "", transcript: "" },
  18: { title: "Studium, Weiterbildung und lebenslanges Lernen", audioKey: "", audioUrl: "", transcript: "" },
  22: { title: "Reisen, Tourismus und kulturelle Begegnung", audioKey: "", audioUrl: "", transcript: "" },
  26: { title: "Philosophie, Ethik und technischer Fortschritt", audioKey: "", audioUrl: "", transcript: "" },
});

export const getC2ListeningPractice = (day) =>
  C2_LISTENING_PRACTICE[Number(day)] || null;

export const hasC2ListeningSource = (practice) =>
  Boolean(
    String(practice?.audioKey || "").trim() ||
      String(practice?.audioUrl || "").trim(),
  );

export default C2_LISTENING_PRACTICE;
