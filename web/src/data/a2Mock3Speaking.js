// A2 Mock-03 · examiner tasks. No audio recordings are stored in client storage.
export const A2_MOCK_3_SPEAKING = Object.freeze({
  mockId: "a2-mock-03", level: "A2", title: "A2 Mock 3 · Sprechen",
  cards: [
    {theme:"Freizeit",keyword:"Wochenende",samplePartnerQuestion:"Was machen Sie am Wochenende?"},
    {theme:"Freizeit",keyword:"Sport",samplePartnerQuestion:"Welchen Sport machen Sie gern?"},
    {theme:"Freizeit",keyword:"Freunde",samplePartnerQuestion:"Wie oft treffen Sie Ihre Freunde?"},
    {theme:"Freizeit",keyword:"Abend",samplePartnerQuestion:"Was machen Sie normalerweise am Abend?"},
    {theme:"Wohnen & Alltag",keyword:"Wohnung",samplePartnerQuestion:"Wie groß ist Ihre Wohnung?"},
    {theme:"Wohnen & Alltag",keyword:"Einkaufen",samplePartnerQuestion:"Wo kaufen Sie Lebensmittel ein?"},
    {theme:"Wohnen & Alltag",keyword:"Frühstück",samplePartnerQuestion:"Was essen Sie zum Frühstück?"},
    {theme:"Wohnen & Alltag",keyword:"Nachbarn",samplePartnerQuestion:"Kennen Sie Ihre Nachbarn?"},
  ],
  teil2: {
    topic: "Mein letzter Urlaub",
    instruction: "Sprechen Sie 1–2 Minuten über Ihren letzten Urlaub.",
    points: ["Wohin sind Sie gereist?", "Mit wem waren Sie dort?", "Was haben Sie dort gemacht?", "Wie war das Wetter dort?"],
    followups: ["Was hat Ihnen an Ihrem Urlaub am besten gefallen?", "Wohin möchten Sie beim nächsten Mal reisen?"],
    alternate: {
      topic:"Mein Lieblingstag in der Woche",
      points:["Welcher Tag ist Ihr Lieblingstag?", "Warum mögen Sie diesen Tag?", "Was machen Sie an diesem Tag?", "Mit wem verbringen Sie diesen Tag?"],
    },
  },
  teil3: {
    situation:"Ein gemeinsamer Freund hat nächste Woche Geburtstag. Sie möchten für ihn eine Überraschungsparty organisieren.",
    points:["Wann wollen Sie feiern (Tag und Uhrzeit)?", "Wo soll die Party stattfinden?", "Was bringen Sie mit (Essen, Getränke und Musik)?", "Welches Geschenk wollen Sie zusammen kaufen?"],
    partnerOpening:"Unser Freund hat nächste Woche Geburtstag. Wann sollen wir feiern?",
    partnerFollowup:"Wo feiern wir am besten? Und was bringen wir mit?",
    partnerLast:"Was kaufen wir als Geschenk? Wer organisiert was?",
  },
});
export const A2_MOCK_3_SPEAKING_RUBRIC = Object.freeze({
  assessmentIdentity:"A2 Mock 03 Sprechen — use only Mock 03 topics",
  teil1:"Ask and answer relevant A2 questions about four cards drawn from Freizeit (Wochenende, Sport, Freunde, Abend) and Wohnen & Alltag (Wohnung, Einkaufen, Frühstück, Nachbarn). Accept valid alternate questions.",
  teil2:"Speak for 1–2 minutes about last holiday: destination, travel partner, activities, weather; assess follow-up answers. Accept the alternative favorite-day topic when selected.",
  teil3:"Negotiate a joint surprise birthday party: time/day, place, food/drinks/music, gift and responsibilities. Reward interactive turn-taking.",
  global:"Assess authentic A2 language, comprehension and task completion; do not invent spoken material, and do not penalize legitimate personal choices or accent.",
});
