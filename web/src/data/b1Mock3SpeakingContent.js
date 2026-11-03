// Teacher-supplied Goethe-Zertifikat B1 speaking outline for B1 Mock 3.
// All source tasks and Redemittel are public exam instructions. The scripted
// second-candidate presentation (in the server examiner) is Falowen simulation,
// not a claim that the teacher supplied a second candidate recording.
export const B1_MOCK3_SPEAKING = Object.freeze({
  mockId: "b1-mock-03",
  title: "Goethe-Zertifikat B1 · Mock 3 · Sprechen",
  durationMinutes: 15,
  preparationMinutes: 15,
  context: "Paarprüfung mit zwei Teilnehmenden (hier durch eine KI-Partnerin bzw. einen KI-Partner simuliert).",
  assessment: Object.freeze({ maxPoints: 100, passPoints: 60, status: "practice-only" }),
  teil1: Object.freeze({
    id: "teil1",
    title: "Gemeinsam etwas planen",
    durationLabel: "ca. 3 Minuten",
    situation: "Ein Teilnehmer aus Ihrem Deutschkurs hatte einen Unfall und liegt im Krankenhaus. Diese Woche möchten Sie ihn besuchen und ein Geschenk von der ganzen Gruppe mitbringen. Nächste Woche braucht er Hilfe zu Hause. Überlegen Sie, wie Sie ihn unterstützen können.",
    points: Object.freeze([
      "Wann besuchen? (Tag, Uhrzeit?)",
      "Wie hinkommen?",
      "Was mitnehmen?",
      "Wie kann man helfen? (vom Krankenhaus abholen, einkaufen, ...)",
    ]),
    objective: "Machen Sie Vorschläge, reagieren Sie auf Vorschläge Ihres Partners und vereinbaren Sie einen konkreten gemeinsamen Plan.",
    phrases: Object.freeze([
      { label: "Vorschlagen", value: "Ich schlage vor, dass wir… / Wie wäre es, wenn wir…?" },
      { label: "Zustimmen", value: "Das ist eine gute Idee! / Da stimme ich dir zu." },
      { label: "Anderer Vorschlag", value: "Ich weiß nicht… Wäre es nicht besser, wenn…? / An diesem Tag kann ich leider nicht, weil…" },
      { label: "Einigung", value: "Gut, dann halten wir das so fest. / Ausgezeichnet, machen wir das so." },
    ]),
  }),
  teil2: Object.freeze({
    id: "teil2",
    title: "Ein Thema präsentieren",
    durationLabel: "ca. 3 Minuten pro Person",
    topics: Object.freeze([
      { id: "a", title: "Brauchen Kinder Mobiltelefone?" },
      { id: "b", title: "Sehen Kinder zu viel fern?" },
    ]),
    slides: Object.freeze([
      {
        number: 1, label: "Thema & Struktur",
        prompt: "Stellen Sie Ihr Thema vor und erklären Sie den Aufbau Ihrer Präsentation.",
        phrase: "Mein Thema ist… Ich möchte zuerst von meinen persönlichen Erfahrungen berichten, dann…",
      },
      {
        number: 2, label: "Eigene Erfahrungen",
        prompt: "Berichten Sie über Ihre eigenen Erfahrungen mit dem Thema.",
        phrase: "Ich persönlich habe die Erfahrung gemacht, dass…",
      },
      {
        number: 3, label: "Situation im Heimatland",
        prompt: "Beschreiben Sie die Situation in Ihrem Heimatland.",
        phrase: "In meinem Heimatland ist das Thema sehr wichtig / verbreitet…",
      },
      {
        number: 4, label: "Vor- und Nachteile & Meine Meinung",
        prompt: "Nennen Sie Vorteile und Nachteile und begründen Sie Ihre Meinung.",
        phrase: "Ein wichtiger Vorteil ist…, aber ein Nachteil ist… Meiner Meinung nach…",
      },
      {
        number: 5, label: "Abschluss & Dank",
        prompt: "Fassen Sie Ihre Präsentation zusammen und bedanken Sie sich.",
        phrase: "Hiermit bin ich am Ende meiner Präsentation. Vielen Dank für Ihre Aufmerksamkeit.",
      },
    ]),
    objective: "Sprechen Sie circa drei Minuten frei. Verwenden Sie die fünf Folien als Orientierung, lesen Sie keinen ausformulierten Text ab.",
  }),
  teil3: Object.freeze({
    id: "teil3",
    title: "Über ein Thema sprechen",
    durationLabel: "ca. 2 Minuten pro Person",
    steps: Object.freeze([
      { label: "Feedback geben", phrase: "Vielen Dank für deine Präsentation. Ich fand es besonders interessant, dass…" },
      { label: "Frage stellen", phrase: "Ich hätte noch eine Frage: Wie denkst du über…?" },
      { label: "Frage beantworten & Dank", phrase: "Danke für dein Feedback. Zu deiner Frage möchte ich sagen, dass…" },
    ]),
    objective: "Hören Sie die Präsentation Ihres Partners, geben Sie Feedback, stellen Sie eine relevante Frage und beantworten Sie anschließend seine Frage zu Ihrer eigenen Präsentation.",
  }),
});

export const B1_MOCK3_SPEAKING_TEILS = Object.freeze(["teil1", "teil2", "teil3"]);

export const buildB1Mock3SpeakingTasks = (topicChoice = "a") => {
  const chosen = B1_MOCK3_SPEAKING.teil2.topics.find(topic => topic.id === topicChoice)
    || B1_MOCK3_SPEAKING.teil2.topics[0];
  const { teil1, teil2, teil3 } = B1_MOCK3_SPEAKING;
  return [
    {
      teil: "1",
      title: teil1.title,
      english: "Plan a hospital visit and a group gift with your AI partner, then agree how to help the classmate at home next week.",
      prompt: `${teil1.situation} Planen Sie gemeinsam: ${teil1.points.join(" / ")} ${teil1.objective}`,
      keywords: teil1.points.join(", "),
      hint: "Agree on the visiting time, transport, group gift and practical help at home.",
    },
    {
      teil: "2",
      title: teil2.title,
      english: "Choose one of two topics. Speak freely for about 3 minutes, following all five Goethe presentation slides.",
      prompt: `Thema: ${chosen.title} Folie 1 Thema und Struktur. Folie 2 Eigene Erfahrungen. Folie 3 Situation im Heimatland. Folie 4 Vor- und Nachteile und eigene Meinung. Folie 5 Abschluss und Dank. Sprechen Sie circa drei Minuten frei.`,
      keywords: chosen.title,
      hint: "Five slides: topic and structure; personal experience; home country; pros, cons and opinion; conclusion and thanks.",
    },
    {
      teil: "3",
      title: teil3.title,
      english: "Listen to your AI partner's simulated presentation, give feedback, ask one question, and answer their question about your own topic.",
      prompt: `Feedback zu einer Präsentation und eine Frage stellen. Beantworten Sie danach die Frage zu Ihrer eigenen Präsentation. Eigenes Thema: ${chosen.title}. ${teil3.objective}`,
      keywords: chosen.title,
      hint: "Give feedback, ask one relevant question, then answer the partner's question and thank them.",
    },
  ];
};
