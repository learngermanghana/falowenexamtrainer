export const A2_MOCK_2_SPEAKING = Object.freeze({
  mockId: "a2-mock-02",
  level: "A2",
  title: "A2 Mock 2 · Sprechen",
  cards: [
    { theme: "Wohnen", keyword: "Balkon", samplePartnerQuestion: "Haben Sie einen Balkon?" },
    { theme: "Freizeit", keyword: "Wochenende", samplePartnerQuestion: "Was machen Sie am Wochenende?" },
    { theme: "Arbeit / Beruf", keyword: "Arbeitszeiten", samplePartnerQuestion: "Wie sind Ihre Arbeitszeiten?" },
    { theme: "Sprachen", keyword: "Deutschkurs", samplePartnerQuestion: "Wann haben Sie Deutschkurs?" },
  ],
  teil2: {
    topic: "Was machen Sie an einem freien Nachmittag?",
    instruction: "Sprechen Sie ca. 1–2 Minuten und gehen Sie auf alle vier Punkte ein.",
    points: [
      "Was machen Sie gern? (Aktivitäten / Hobbys)",
      "Mit wem verbringen Sie die Zeit? (allein, mit Familie, mit Freunden)",
      "Wo sind Sie am liebsten? (zu Hause, im Park, in der Stadt)",
      "Wie oft haben Sie frei?",
    ],
    followups: [
      "Was machen Sie an einem freien Nachmittag, wenn das Wetter schlecht ist?",
      "Gehen Sie an freien Tagen lieber in die Natur oder in die Stadt?",
    ],
  },
  teil3: {
    situation: "Ein gemeinsamer Freund aus Ihrem Deutschkurs, Thomas, hat Geburtstag. Sie möchten für ihn eine Überraschungsparty organisieren. Planen Sie die Party zusammen.",
    points: [
      "Wann und wo soll die Party stattfinden?",
      "Geschenk: Was wollen Sie kaufen und wie viel Geld gibt jeder aus?",
      "Essen und Trinken: Wer bringt was mit?",
      "Einladungen: Wie und wann informieren Sie die anderen Kursteilnehmer?",
    ],
    partnerOpening: "Wir möchten für Thomas eine Überraschungsparty organisieren. Wann und wo wollen wir feiern?",
    partnerFollowup: "Gute Idee! Was kaufen wir als Geschenk, und wie viel Geld geben wir beide aus?",
    partnerLast: "Wer bringt Essen und Getränke mit, und wann laden wir die anderen aus dem Kurs ein?",
  },
});
export const A2_MOCK_2_SPEAKING_RUBRIC = Object.freeze({
  assessmentIdentity: "A2 Mock 2 Sprechen — never grade against A2 Mock 1 topics",
  teil1: "Assess four meaningful, grammatically intelligible questions that relate respectively to Balkon, Wochenende, Arbeitszeiten, Deutschkurs, and responses to four matching partner questions. Accept diverse correct A2 formulations.",
  teil2: "Assess a 1–2 minute personal response covering activity, company, preferred place, frequency of free time, plus meaningful answers to weather and nature-vs-city followups. Do not require a specific personal preference.",
  teil3: "Assess interaction and collaboration: time and place, gift and contributions, food/drink responsibilities, and invitation channels/timing. Reward proposals, partner response, negotiation and a shared plan, not merely monologue.",
  global: "Focus on task completion, comprehensibility, appropriate A2 grammar/vocabulary, interaction and pronunciation evidenced by the recording. Do not penalize accents or alternate legitimate responses. Never assume missing transcript text was spoken; do not hallucinate partner turns.",
});
