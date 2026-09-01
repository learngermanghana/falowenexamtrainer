import { validateSpeakingMindMapConfig as validateMultiLevelSpeakingMindMapConfig } from "../index";
import { earlyA2LessonBranchesByDay } from "./earlyLessonBranches";
import { personenBeschreibenBranches } from "./personenBeschreiben";

const branch = (id, label, type, keywords, guidingQuestion, sentenceStarter, modelSentence) => ({
  id,
  label,
  type,
  keywords,
  guidingQuestion,
  sentenceStarter,
  modelSentence,
});

const bankAnrufenBranches = [
  branch(
    "konto-karte-sperren",
    "Konto oder Karte sperren",
    "topic",
    ["sperren", "Karte verloren", "sofort"],
    "Warum musst du die Bank schnell anrufen?",
    "Ich rufe an, weil ich ...",
    "Ich rufe an, weil ich meine Bankkarte verloren habe. Könnten Sie die Karte bitte sofort sperren?",
  ),
  branch(
    "geld-abheben",
    "Geld abheben",
    "detail",
    ["Geldautomat", "Bargeld", "Limit"],
    "Was möchtest du über Geldabheben fragen?",
    "Ich möchte Geld abheben, aber ...",
    "Ich möchte Geld abheben, aber der Geldautomat funktioniert nicht. Können Sie bitte prüfen, ob mein Konto aktiv ist?",
  ),
  branch(
    "konto-eroeffnen",
    "Konto eröffnen",
    "example",
    ["Konto eröffnen", "Ausweis", "Termin"],
    "Welche Informationen brauchst du für ein neues Konto?",
    "Ich möchte ein Konto eröffnen. Welche ...?",
    "Ich möchte ein Konto eröffnen. Welche Dokumente brauche ich, und kann ich dafür einen Termin vereinbaren?",
  ),
  branch(
    "kontostand-ueberweisung",
    "Kontostand und Überweisung",
    "opinion",
    ["Kontostand", "Überweisung", "Online-Banking"],
    "Welche Kontoinformationen brauchst du?",
    "Könnten Sie bitte meinen ...?",
    "Könnten Sie bitte meinen Kontostand prüfen? Ich möchte wissen, ob meine Überweisung angekommen ist.",
  ),
  branch(
    "abschluss",
    "Höflich abschließen",
    "closing",
    ["vielen Dank", "wiederholen", "Auf Wiederhören"],
    "Wie beendest du das Bankgespräch höflich?",
    "Vielen Dank für Ihre Hilfe. ...",
    "Vielen Dank für Ihre Hilfe. Könnten Sie mir die Informationen bitte noch einmal wiederholen? Auf Wiederhören.",
  ),
];

const bankAnrufenExtraHelp = {
  title: "More speaking help: Die Bank anrufen",
  instructions: [
    "Beginne mit einer höflichen Begrüßung: Guten Tag, mein Name ist ...",
    "Nenne sofort den Grund des Anrufs: Ich rufe an, weil ...",
    "Gib wichtige Daten nur allgemein an: Kundennummer, Kontonummer, Ausweis oder Telefonnummer.",
    "Stelle klare Bitten mit Könnten Sie bitte ...? / Ich möchte ... / Ich hätte gern ...",
    "Beende das Gespräch mit Dank, Bestätigung und Auf Wiederhören.",
  ],
  phraseGroups: [
    {
      title: "1. Konto oder Karte sperren",
      items: [
        "Ich möchte meine Karte sperren lassen.",
        "Meine Bankkarte ist verloren gegangen.",
        "Ich glaube, meine Karte wurde gestohlen.",
        "Könnten Sie mein Konto bitte vorübergehend sperren?",
        "Ist mein Geld noch sicher?",
        "Wie bekomme ich eine neue Karte?",
        "Wie lange dauert es, bis ich eine Ersatzkarte bekomme?",
      ],
    },
    {
      title: "2. Geld abheben",
      items: [
        "Ich möchte Geld abheben.",
        "Der Geldautomat funktioniert nicht.",
        "Meine Karte wurde am Geldautomaten nicht akzeptiert.",
        "Wie hoch ist mein Tageslimit?",
        "Kann ich am Schalter Geld abheben?",
        "Welche Gebühren muss ich bezahlen?",
        "Könnten Sie mein Auszahlungslimit bitte prüfen?",
      ],
    },
    {
      title: "3. Konto eröffnen",
      items: [
        "Ich möchte ein Konto eröffnen.",
        "Welche Dokumente brauche ich für die Kontoeröffnung?",
        "Brauche ich einen Ausweis oder eine Meldebescheinigung?",
        "Kann ich das Konto online eröffnen?",
        "Könnte ich bitte einen Termin für die Kontoeröffnung bekommen?",
        "Gibt es ein kostenloses Konto für Studenten?",
      ],
    },
    {
      title: "4. Kontostand und Überweisung",
      items: [
        "Könnten Sie bitte meinen Kontostand prüfen?",
        "Ist die Überweisung angekommen?",
        "Ich habe eine Überweisung gemacht, aber das Geld ist noch nicht da.",
        "Könnten Sie mir bitte eine Bestätigung schicken?",
        "Ich kann mich nicht im Online-Banking anmelden.",
        "Könnten Sie mein Online-Banking bitte entsperren?",
      ],
    },
    {
      title: "5. Höfliche Rückfragen",
      items: [
        "Könnten Sie das bitte wiederholen?",
        "Könnten Sie bitte etwas langsamer sprechen?",
        "Was bedeutet das genau?",
        "Welche Unterlagen soll ich mitbringen?",
        "Könnten Sie mir das bitte per E-Mail schicken?",
        "Vielen Dank für Ihre Hilfe. Auf Wiederhören.",
      ],
    },
  ],
  vocabulary: [
    "die Bankkarte",
    "das Konto",
    "das Konto sperren",
    "die Karte sperren lassen",
    "die Ersatzkarte",
    "Geld abheben",
    "der Geldautomat",
    "das Bargeld",
    "das Tageslimit",
    "das Auszahlungslimit",
    "der Schalter",
    "der Kontostand",
    "die Überweisung",
    "das Online-Banking",
    "das Konto eröffnen",
    "die Kontoeröffnung",
    "der Ausweis",
    "die Meldebescheinigung",
    "die Gebühren",
    "die Bestätigung",
  ],
  modelAnswer:
    "Guten Tag, mein Name ist Ama Mensah. Ich rufe an, weil ich meine Bankkarte verloren habe. Könnten Sie die Karte bitte sofort sperren? Außerdem möchte ich wissen, ob ich am Schalter Geld abheben kann. Wie hoch ist mein Tageslimit? Könnten Sie mir die Informationen bitte per E-Mail schicken? Vielen Dank für Ihre Hilfe. Auf Wiederhören.",
};

const vorstellungsgespraechBranches = [
  branch(
    "vorstellung",
    "Vorstellung",
    "topic",
    ["Name", "Wohnort", "Interessen"],
    "Wer sind Sie?",
    "Guten Tag, mein Name ist ...",
    "Guten Tag, mein Name ist Ama Mensah. Ich wohne in Accra und interessiere mich für Kundenservice.",
  ),
  branch(
    "ausbildung",
    "Ausbildung",
    "detail",
    ["Abschluss", "Ausbildung", "Kurse"],
    "Welche Ausbildung bringen Sie mit?",
    "Ich habe eine Ausbildung als ... gemacht.",
    "Ich habe eine Ausbildung als Bürokauffrau gemacht und zusätzlich einen Computerkurs besucht.",
  ),
  branch(
    "berufserfahrung",
    "Berufserfahrung",
    "example",
    ["Praktikum", "Aufgaben", "Arbeitsstil"],
    "Welche Berufserfahrung haben Sie?",
    "Ich habe bereits als ... gearbeitet.",
    "Ich habe bereits im Verkauf gearbeitet und dort Bestellungen organisiert sowie Kunden beraten.",
  ),
  branch(
    "faehigkeiten",
    "Fähigkeiten",
    "opinion",
    ["Sprachen", "Teamarbeit", "Organisation"],
    "Welche Fähigkeiten und Qualifikationen besitzen Sie?",
    "Ich bin ... und kann gut ...",
    "Ich bin zuverlässig und freundlich, spreche Deutsch und Englisch und arbeite gern im Team.",
  ),
  branch(
    "motivation",
    "Motivation",
    "closing",
    ["Interesse", "Berufsziel", "Amazon"],
    "Warum interessieren Sie sich für diese Position bei Amazon?",
    "Ich interessiere mich für diese Stelle, weil ...",
    "Ich interessiere mich für diese Stelle, weil ich gern mit Menschen arbeite und mich beruflich weiterentwickeln möchte.",
  ),
];

const topics = [
  [1, "a2-day-1-small-talk", "Small Talk", "Wie führst du ein kurzes freundliches Gespräch?", ["Begrüßung", "Kennenlernen", "Arbeit oder Studium", "Freizeit", "Gespräch beenden"], earlyA2LessonBranchesByDay[1]],
  [2, "a2-day-2-personen-beschreiben", "Personen beschreiben", "Wie beschreibst du eine Person einfach und klar?", ["Aussehen", "Charakter", "Kleidung", "Beziehung", "Meinung"], personenBeschreibenBranches],
  [3, "a2-day-3-vergleichen", "Dinge und Personen vergleichen", "Was vergleichst du und was ist anders oder gleich?", ["Auswahl", "Gemeinsamkeiten", "Unterschiede", "Preis und Qualität", "Meinung"], earlyA2LessonBranchesByDay[3]],
  [4, "a2-day-4-treffen", "Wo möchten wir uns treffen?", "Wo und wann möchtest du dich treffen?", ["Aktivität", "Treffpunkt", "Zeit", "Anreise", "Bestätigung"], earlyA2LessonBranchesByDay[4]],
  [5, "a2-day-5-freizeit", "Freizeit", "Was machst du gern in deiner Freizeit?", ["Hobby", "Zeit und Häufigkeit", "Ort", "Mit wem?", "Grund und Gefühl"], earlyA2LessonBranchesByDay[5]],
  [6, "a2-day-6-moebel-raeume", "Möbel und Räume", "Wie beschreibst du dein Zimmer oder deine Wohnung?", ["Raum", "Möbel", "Position", "Farben und Zustand", "Lieblingsplatz"], earlyA2LessonBranchesByDay[6]],
  [7, "a2-day-7-wohnung-suchen", "Eine Wohnung suchen", "Welche Wohnung suchst du und warum?", ["Größe und Zimmer", "Lage", "Miete und Kosten", "Ausstattung", "Besichtigung"], earlyA2LessonBranchesByDay[7]],
  [8, "a2-day-8-rezepte-essen", "Rezepte und Essen", "Was kochst oder isst du gern?", ["Gericht", "Zutaten", "Vorbereitung", "Kochschritte", "Geschmack und Anlass"], earlyA2LessonBranchesByDay[8]],
  [9, "a2-day-9-urlaub", "Urlaub", "Wie war dein Urlaub oder wie planst du Urlaub?", ["Ort", "Reise", "Aktivitäten", "Wetter", "Meinung"]],
  [10, "a2-day-10-tourismus-feste", "Tourismus und traditionelle Feste", "Welches Fest oder welchen Ort empfiehlst du?", ["Ort", "Fest", "Essen", "Aktivitäten", "Tipp"]],
  [11, "a2-day-11-verkehrsmittel", "Verkehrsmittel vergleichen", "Welches Verkehrsmittel benutzt du und warum?", ["Verkehrsmittel", "Preis", "Zeit", "Komfort", "Meinung"]],
  [12, "a2-day-12-traumberuf", "Mein Traumberuf", "Was ist dein Traumberuf und warum?", ["Beruf", "Aufgaben", "Ort", "Stärken", "Ziel"]],
  [13, "a2-day-13-vorstellungsgespraech", "Ein Vorstellungsgespräch", "Sie sind bei Amazon im Vorstellungsgespräch. Wie stellen Sie sich vor?", ["Vorstellung", "Ausbildung", "Berufserfahrung", "Fähigkeiten", "Motivation"], vorstellungsgespraechBranches],
  [14, "a2-day-14-beruf-karriere", "Beruf und Karriere", "Was ist dir im Beruf wichtig?", ["Arbeit", "Team", "Arbeitszeit", "Gehalt", "Zukunft"]],
  [15, "a2-day-15-lieblingssport", "Mein Lieblingssport", "Welchen Sport magst du und warum?", ["Sportart", "Ort", "Personen", "Training", "Gefühl"]],
  [16, "a2-day-16-wohlbefinden", "Wohlbefinden und Entspannung", "Was machst du für dein Wohlbefinden?", ["Stress", "Entspannung", "Schlaf", "Bewegung", "Tipp"]],
  [17, "a2-day-17-apotheke", "In die Apotheke gehen", "Was sagst du in der Apotheke?", ["Problem", "Symptome", "Medizin", "Fragen", "Dank"]],
  [18, "a2-day-18-bank-anrufen", "Die Bank anrufen", "Warum rufst du die Bank an?", ["Grund", "Daten", "Fragen", "Termin", "Abschluss"], bankAnrufenBranches, bankAnrufenExtraHelp],
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

export const a2SpeakingMindMaps = topics.map(([day, lessonId, title, centralQuestion, labels, configuredBranches, extraHelp]) => {
  const branches = configuredBranches || labels.map((label, index) => makeBranch(label, index, title));
  return {
    level: "A2",
    branchTypeSet: "A2",
    day,
    lessonId,
    title,
    centralQuestion,
    branches,
    extraHelp,
    speakingRoute: branches.map((branchItem) => branchItem.id),
    targetDurationSeconds: 45,
  };
});

export const a2SpeakingMindMapsByDay = a2SpeakingMindMaps.reduce((registry, config) => ({ ...registry, [config.day]: config }), {});

export const getA2SpeakingMindMap = (day) => a2SpeakingMindMapsByDay[Number(day)] || null;

export const validateSpeakingMindMapConfig = (config) => validateMultiLevelSpeakingMindMapConfig(config, { requiredLevel: "A2" });
