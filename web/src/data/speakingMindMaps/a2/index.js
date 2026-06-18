import { validateSpeakingMindMapConfig as validateMultiLevelSpeakingMindMapConfig } from "../index";
import { personenBeschreibenBranches } from "./personenBeschreiben";

const topics = [
  [2, "a2-day-2-personen-beschreiben", "Personen beschreiben", "Wie beschreibst du eine Person einfach und klar?", ["Aussehen", "Charakter", "Kleidung", "Beziehung", "Meinung"], personenBeschreibenBranches],
  [3, "a2-day-3-vergleichen", "Dinge und Personen vergleichen", "Was vergleichst du und was ist anders oder gleich?", ["Personen", "Dinge", "Größe", "Preis", "Meinung"]],
  [4, "a2-day-4-treffen", "Wo möchten wir uns treffen?", "Wo und wann möchtest du dich treffen?", ["Ort", "Zeit", "Aktivität", "Weg", "Bestätigung"]],
  [5, "a2-day-5-freizeit", "Freizeit", "Was machst du gern in deiner Freizeit?", ["Hobbys", "Zeit", "Ort", "Freunde", "Warum"]],
  [6, "a2-day-6-moebel-raeume", "Möbel und Räume", "Wie beschreibst du dein Zimmer oder deine Wohnung?", ["Zimmer", "Möbel", "Farben", "Position", "Lieblingsplatz"]],
  [7, "a2-day-7-wohnung-suchen", "Eine Wohnung suchen", "Welche Wohnung suchst du und warum?", ["Größe", "Lage", "Preis", "Ausstattung", "Termin"]],
  [8, "a2-day-8-rezepte-essen", "Rezepte und Essen", "Was kochst oder isst du gern?", ["Gericht", "Zutaten", "Schritte", "Geschmack", "Anlass"]],
  [9, "a2-day-9-urlaub", "Urlaub", "Wie war dein Urlaub oder wie planst du Urlaub?", ["Ort", "Reise", "Aktivitäten", "Wetter", "Meinung"]],
  [10, "a2-day-10-tourismus-feste", "Tourismus und traditionelle Feste", "Welches Fest oder welchen Ort empfiehlst du?", ["Ort", "Fest", "Essen", "Aktivitäten", "Tipp"]],
  [11, "a2-day-11-verkehrsmittel", "Verkehrsmittel vergleichen", "Welches Verkehrsmittel benutzt du und warum?", ["Verkehrsmittel", "Preis", "Zeit", "Komfort", "Meinung"]],
  [12, "a2-day-12-traumberuf", "Mein Traumberuf", "Was ist dein Traumberuf und warum?", ["Beruf", "Aufgaben", "Ort", "Stärken", "Ziel"]],
  [13, "a2-day-13-vorstellungsgespraech", "Ein Vorstellungsgespräch", "Wie stellst du dich in einem Vorstellungsgespräch vor?", ["Begrüßung", "Erfahrung", "Stärken", "Fragen", "Abschluss"]],
  [14, "a2-day-14-beruf-karriere", "Beruf und Karriere", "Was ist dir im Beruf wichtig?", ["Arbeit", "Team", "Arbeitszeit", "Gehalt", "Zukunft"]],
  [15, "a2-day-15-lieblingssport", "Mein Lieblingssport", "Welchen Sport magst du und warum?", ["Sportart", "Ort", "Personen", "Training", "Gefühl"]],
  [16, "a2-day-16-wohlbefinden", "Wohlbefinden und Entspannung", "Was machst du für dein Wohlbefinden?", ["Stress", "Entspannung", "Schlaf", "Bewegung", "Tipp"]],
  [17, "a2-day-17-apotheke", "In die Apotheke gehen", "Was sagst du in der Apotheke?", ["Problem", "Symptome", "Medizin", "Fragen", "Dank"]],
  [18, "a2-day-18-bank-anrufen", "Die Bank anrufen", "Warum rufst du die Bank an?", ["Grund", "Daten", "Fragen", "Termin", "Abschluss"]],
  [19, "a2-day-19-einkaufen", "Einkaufen: wo und wie?", "Wo kaufst du gern ein und warum?", ["Geschäft", "Produkte", "Preis", "Qualität", "Meinung"]],
  [20, "a2-day-20-reklamation", "Reklamationssituationen", "Wie reklamierst du ein Problem höflich?", ["Produkt", "Problem", "Wunsch", "Beleg", "Lösung"]],
  [21, "a2-day-21-wochenende", "Ein Wochenende planen", "Was planst du für das Wochenende?", ["Tag", "Aktivität", "Personen", "Ort", "Plan B"]],
  [22, "a2-day-22-woche", "Die Woche planen", "Wie planst du deine Woche?", ["Wochentage", "Arbeit", "Freizeit", "Hausarbeit", "Termine"]],
  [23, "a2-day-23-schulweg-arbeitsweg", "Weg zur Schule oder Arbeit", "Wie kommst du zur Schule oder zur Arbeit?", ["Verkehrsmittel", "Dauer", "Route", "Kosten", "Problem"]],
  [24, "a2-day-24-urlaub-planen", "Einen Urlaub planen", "Wie planst du deinen nächsten Urlaub?", ["Reiseziel", "Unterkunft", "Transport", "Aktivitäten", "Budget"]],
  [25, "a2-day-25-tagesablauf", "Tagesablauf", "Wie sieht dein normaler Tag aus?", ["Morgen", "Mittag", "Nachmittag", "Abend", "Routine"]],
  [26, "a2-day-26-gefuehle", "Gefühle in Situationen", "Wie fühlst du dich in verschiedenen Situationen?", ["Freude", "Stress", "Angst", "Überraschung", "Hilfe"]],
  [27, "a2-day-27-digitale-kommunikation", "Digitale Kommunikation", "Wie kommunizierst du digital?", ["App", "Nachricht", "Anruf", "Regeln", "Problem"]],
  [28, "a2-day-28-zukunft", "Über die Zukunft sprechen", "Was möchtest du in der Zukunft machen?", ["Plan", "Beruf", "Familie", "Reise", "Wunsch"]],
];

const makeBranch = (label, index, title) => {
  const id = label.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return {
    id,
    label,
    keywords: [label, index === 0 ? "wichtig" : "einfach", index === 4 ? "zum Schluss" : "Beispiel"],
    guidingQuestion: `Was sagst du über ${label.toLowerCase()}?`,
    sentenceStarter: `Bei ${label.toLowerCase()} sage ich:`,
    modelSentence: `Bei ${label.toLowerCase()} sage ich einen einfachen Satz zum Thema ${title}.`,
  };
};

export const a2SpeakingMindMaps = topics.map(([day, lessonId, title, centralQuestion, labels, configuredBranches]) => {
  const branches = configuredBranches || labels.map((label, index) => makeBranch(label, index, title));
  return {
    level: "A2",
    branchTypeSet: "A2",
    day,
    lessonId,
    title,
    centralQuestion,
    branches,
    speakingRoute: branches.map((branch) => branch.id),
    targetDurationSeconds: 45,
  };
});

export const a2SpeakingMindMapsByDay = a2SpeakingMindMaps.reduce((registry, config) => ({ ...registry, [config.day]: config }), {});

export const getA2SpeakingMindMap = (day) => a2SpeakingMindMapsByDay[Number(day)] || null;

export const validateSpeakingMindMapConfig = (config) => validateMultiLevelSpeakingMindMapConfig(config, { requiredLevel: "A2" });
