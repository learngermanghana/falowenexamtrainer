export const C2_LISTENING_PRACTICE = Object.freeze({
  2: { title: "Schulpflicht und Bildungsgerechtigkeit", audioUrl: "", transcript: "" },
  6: { title: "Soziale Ungleichheit und Chancengerechtigkeit", audioUrl: "", transcript: "" },
  10: { title: "Medizin, Gesundheit und Forschungsethik", audioUrl: "", transcript: "" },
  14: { title: "Kultur, Literatur und gesellschaftliches Gedächtnis", audioUrl: "", transcript: "" },
  18: { title: "Studium, Weiterbildung und lebenslanges Lernen", audioUrl: "", transcript: "" },
  22: { title: "Reisen, Tourismus und kulturelle Begegnung", audioUrl: "", transcript: "" },
  26: { title: "Philosophie, Ethik und technischer Fortschritt", audioUrl: "", transcript: "" },
});

export const getC2ListeningPractice = (day) =>
  C2_LISTENING_PRACTICE[Number(day)] || null;

export default C2_LISTENING_PRACTICE;
