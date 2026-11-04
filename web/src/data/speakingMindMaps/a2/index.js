import { validateSpeakingMindMapConfig as validateMultiLevelSpeakingMindMapConfig } from "../index";
import { A2_PRESENTATION_CARDS } from "../../a2PresentationCards";

const lessons = [
  [
    1,
    "a2-day-1-small-talk",
    "Small Talk"
  ],
  [
    2,
    "a2-day-2-personen-beschreiben",
    "Deine Beschreibung"
  ],
  [
    3,
    "a2-day-3-vergleichen",
    "Dinge und Personen vergleichen"
  ],
  [
    4,
    "a2-day-4-treffen",
    "Wo möchten wir uns treffen?"
  ],
  [
    5,
    "a2-day-5-freizeit",
    "Freizeit"
  ],
  [
    6,
    "a2-day-6-moebel-raeume",
    "Möbel und Räume"
  ],
  [
    7,
    "a2-day-7-wohnung-suchen",
    "Eine Wohnung suchen"
  ],
  [
    8,
    "a2-day-8-rezepte-essen",
    "Rezepte und Essen"
  ],
  [
    9,
    "a2-day-9-urlaub",
    "Urlaub"
  ],
  [
    10,
    "a2-day-10-stadt-entdecken",
    "Eine Stadt entdecken und etwas erleben"
  ],
  [
    11,
    "a2-day-11-verkehrsmittel",
    "Verkehrsmittel vergleichen"
  ],
  [
    12,
    "a2-day-12-traumberuf",
    "Mein Traumberuf"
  ],
  [
    13,
    "a2-day-13-vorstellungsgespraech",
    "Ein Vorstellungsgespräch"
  ],
  [
    14,
    "a2-day-14-beruf-karriere",
    "Beruf und Karriere"
  ],
  [
    15,
    "a2-day-15-lieblingssport",
    "Mein Lieblingssport"
  ],
  [
    16,
    "a2-day-16-wohlbefinden",
    "Wohlbefinden und Entspannung"
  ],
  [
    17,
    "a2-day-17-apotheke",
    "In die Apotheke gehen"
  ],
  [
    18,
    "a2-day-18-bank-anrufen",
    "Die Bank anrufen"
  ],
  [
    19,
    "a2-day-19-einkaufen",
    "Einkaufen: wo und wie?"
  ],
  [
    20,
    "a2-day-20-reklamation",
    "Reklamationssituationen"
  ],
  [
    21,
    "a2-day-21-wochenende",
    "Ein Wochenende planen"
  ],
  [
    22,
    "a2-day-22-woche",
    "Die Woche planen"
  ],
  [
    23,
    "a2-day-23-schulweg-arbeitsweg",
    "Weg zur Schule oder Arbeit"
  ],
  [
    24,
    "a2-day-24-urlaub-planen",
    "Einen Urlaub planen"
  ],
  [
    25,
    "a2-day-25-tagesablauf",
    "Tagesablauf"
  ],
  [
    26,
    "a2-day-26-gefuehle",
    "Gefühle in Situationen"
  ],
  [
    27,
    "a2-day-27-digitale-kommunikation",
    "Digitale Kommunikation"
  ],
  [
    28,
    "a2-day-28-zukunft",
    "Über die Zukunft sprechen"
  ]
];

export const a2SpeakingMindMaps = lessons.map(([day, lessonId, title]) => {
  const card = A2_PRESENTATION_CARDS[day];
  const branches = card.branches.map((point, index) => ({
    id: point.id,
    label: point.label,
    type: ["topic", "detail", "example", "closing"][index],
    keywords: [point.label],
    guidingQuestion: point.question,
    sentenceStarter: point.starter,
    modelSentence: point.modelSentence,
  }));
  return {
    level: "A2", branchTypeSet: "A2", day, lessonId, title,
    centralQuestion: card.centralQuestion,
    presentation: card,
    branches,
    speakingRoute: branches.map((point) => point.id),
    targetDurationSeconds: 60,
    extraHelp: {
      title: "Präsentation vorbereiten · Von sich erzählen",
      instructions: [card.instruction, card.instructionEn, "Die Beispielsätze sind nur Ideen. Benutze eigene Informationen; lerne keinen fertigen Text auswendig."],
      phraseGroups: card.branches.map((point) => ({ title: point.label, items: [point.starter, point.modelSentence] })),
      vocabulary: card.keywords,
      modelAnswer: card.branches.map((point) => point.modelSentence).join(" "),
    },
  };
});

export const a2SpeakingMindMapsByDay = Object.fromEntries(a2SpeakingMindMaps.map((config) => [config.day, config]));
export const getA2SpeakingMindMap = (day) => a2SpeakingMindMapsByDay[Number(day)] || null;
export const validateSpeakingMindMapConfig = (config) => validateMultiLevelSpeakingMindMapConfig(config, { requiredLevel: "A2" });
