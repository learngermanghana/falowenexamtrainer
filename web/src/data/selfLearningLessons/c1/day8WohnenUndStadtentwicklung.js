import { makeLesson } from "../buildSelfLearningLesson";

const c1Day8WohnenUndStadtentwicklung = makeLesson({
  level: "C1",
  day: 8,
  chapter: "2.3",
  title: "Wohnen und Stadtentwicklung",
  topic: "Wohnraum, Infrastruktur, öffentlicher Raum und Lebensqualität sachlich analysieren und gestalten",
  heroImage: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1600&q=80",
  grammarFocus: "Nominalisierung und Präpositionalstil in formellen Sach- und Vorschlagstexten",
  objectives: [
    "Ich kann zentrale Wohn- und Stadtentwicklungsprobleme differenziert beschreiben.",
    "Ich kann verbale Aussagen in präzise Nominalstrukturen umformen.",
    "Ich kann Ursachen, Ziele, Mittel und Einschränkungen mit formellen Präpositionalgruppen ausdrücken.",
    "Ich kann einen formellen Vorschlag an eine kommunale Stelle verfassen.",
  ],
  explanation: [
    "Stadtentwicklung verbindet bezahlbaren Wohnraum, Verkehr, Grünflächen, soziale Infrastruktur und wirtschaftliche Interessen.",
    "Formelle Sachtexte verwenden häufig Nominalisierungen und Präpositionalgruppen, um komplexe Zusammenhänge knapp und unpersönlich darzustellen.",
    "Die Schreibaufgabe ist ein formelles Vorschlagsschreiben an eine Stadtverwaltung oder kommunale Stelle.",
  ],
  grammarLesson: {
    title: "Nominalisierung und Präpositionalstil",
    explanation: [
      "Bei der Nominalisierung wird ein Verb oder Adjektiv in ein Nomen umgewandelt: bauen wird zu der Bau, verbessern zu die Verbesserung und verfügbar zu die Verfügbarkeit.",
      "Der Präpositionalstil ersetzt Nebensätze durch präzise Präpositionalgruppen: weil Wohnraum fehlt wird zu aufgrund des Mangels an Wohnraum.",
      "Diese Formen passen zu Berichten, Stellungnahmen und formellen Vorschlägen. Zu viele Nominalisierungen können einen Text jedoch unnötig schwer verständlich machen.",
    ],
    rules: [
      "Nominalisierte Verben und Adjektive werden großgeschrieben.",
      "Nutze zur oder zum für Ziele: zur Verbesserung der Lebensqualität.",
      "Nutze durch für Mittel oder Maßnahmen: durch den Ausbau des Nahverkehrs.",
      "Nutze aufgrund, infolge oder angesichts für Ursachen und Rahmenbedingungen.",
      "Nutze trotz oder ungeachtet für Einschränkungen und Gegensätze.",
      "Verbinde Nominalstil mit klaren Verben, damit der Text verständlich bleibt.",
    ],
    examples: [
      "Aufgrund des Mangels an bezahlbarem Wohnraum steigen die sozialen Belastungen.",
      "Zur Verbesserung der Lebensqualität sollten zusätzliche Grünflächen geschaffen werden.",
      "Durch den Ausbau des öffentlichen Nahverkehrs ließe sich der Autoverkehr reduzieren.",
      "Bei der Planung neuer Wohnviertel müssen Schulen, Geschäfte und medizinische Angebote berücksichtigt werden.",
      "Trotz steigender Baukosten ist die Schaffung langfristig bezahlbarer Wohnungen notwendig.",
    ],
    miniExercise: "Formuliere nominal: 1) Weil Wohnungen fehlen, steigen die Mieten. 2) Damit die Lebensqualität verbessert wird, sollen Parks entstehen. 3) Indem der Nahverkehr ausgebaut wird, sinkt der Autoverkehr. 4) Obwohl die Kosten steigen, muss gebaut werden.",
    knowledgeTest: [
      {
        question: "Welche Formulierung nennt ein Ziel im Nominalstil?",
        options: ["zur Verbesserung der Lebensqualität", "weil die Lebensqualität verbessert wird", "obwohl die Lebensqualität steigt", "während die Lebensqualität verbessert"],
        answer: "zur Verbesserung der Lebensqualität",
        explanation: "Zur plus Nominalisierung drückt einen Zweck oder ein Ziel aus.",
      },
      {
        question: "Welche Umformung ist korrekt?",
        options: ["aufgrund des Mangels an Wohnraum", "aufgrund Wohnraum fehlt", "aufgrund dass Wohnraum fehlt", "aufgrund dem Wohnraum fehlen"],
        answer: "aufgrund des Mangels an Wohnraum",
        explanation: "Aufgrund steht im formellen Standard meist mit dem Genitiv.",
      },
      {
        question: "Welche Präposition drückt ein Mittel aus?",
        options: ["durch", "trotz", "aufgrund", "angesichts"],
        answer: "durch",
        explanation: "Durch bezeichnet häufig die Maßnahme oder das Mittel, mit dem ein Ziel erreicht wird.",
      },
      {
        question: "Welche Form ist eine Nominalisierung?",
        options: ["die Erweiterung", "erweitern", "erweitert", "weil erweitert wird"],
        answer: "die Erweiterung",
        explanation: "Erweiterung ist das Nomen zum Verb erweitern.",
      },
    ],
  },
  speakingTaskType: "C1 urban development discussion",
  speakingTopic: "Sprechen: Welche Maßnahmen braucht eine wachsende Stadt, damit Wohnraum bezahlbar bleibt und die Lebensqualität nicht sinkt?",
  speakingBuilder: {
    branches: [
      { id: "wohnraum", title: "Wohnungsangebot", keywords: ["Neubau", "Umbau", "Leerstand", "Nachverdichtung", "Wohnformen"] },
      { id: "bezahlbar", title: "Bezahlbarkeit", keywords: ["Mieten", "Sozialwohnungen", "Förderung", "Spekulation", "Einkommen"] },
      { id: "infrastruktur", title: "Soziale Infrastruktur", keywords: ["Schulen", "Kitas", "Gesundheit", "Einkauf", "Barrierefreiheit"] },
      { id: "mobilitaet", title: "Mobilität", keywords: ["Nahverkehr", "Radwege", "Fußwege", "Parkraum", "Erreichbarkeit"] },
      { id: "freiraum", title: "Öffentlicher Raum", keywords: ["Grünflächen", "Lärm", "Sicherheit", "Begegnungsorte", "Klima"] },
      { id: "planung", title: "Planung und Beteiligung", keywords: ["Bürgerbeteiligung", "Kosten", "Prioritäten", "Genehmigungen", "langfristige Planung"] },
    ],
  },
  writingTaskType: "Formal proposal / formelle Eingabe",
  writingTopic: "Schreiben: Formeller Vorschlag zur Verbesserung der Wohn- und Lebenssituation. Schreiben Sie an eine Stadtverwaltung oder kommunale Stelle. Beschreiben Sie ein konkretes Wohn- oder Infrastrukturproblem in Ihrem Stadtteil. Erläutern Sie die Folgen für die Bewohnerinnen und Bewohner. Schlagen Sie mindestens zwei realistische Maßnahmen vor. Berücksichtigen Sie mögliche Kosten, Flächenkonflikte oder Umsetzungsprobleme und bitten Sie um Prüfung sowie eine Rückmeldung.",
  writingBuilder: {
    structure: [
      "Betreff, Anrede und Anlass",
      "Sachliche Beschreibung des Problems",
      "Folgen für Wohnqualität und Bevölkerung",
      "Mindestens zwei konkrete Maßnahmen",
      "Einschränkung, Kosten oder Umsetzung",
      "Höfliche Bitte um Prüfung und Rückmeldung",
    ],
    usefulLines: [
      "Ich wende mich an Sie aufgrund der zunehmenden Belastung durch ...",
      "Infolge des Mangels an ... hat sich die Situation deutlich verschärft.",
      "Zur Verbesserung der Wohn- und Lebensqualität schlage ich folgende Maßnahmen vor.",
      "Durch den Ausbau von ... könnte eine spürbare Entlastung erreicht werden.",
      "Trotz der damit verbundenen Kosten erscheint eine schrittweise Umsetzung sinnvoll.",
      "Ich bitte Sie höflich um Prüfung der Vorschläge und um eine Rückmeldung zum weiteren Vorgehen.",
    ],
  },
  tasks: {
    speaking: "Sprich 2 Minuten über ein Stadtentwicklungsproblem und schlage ausgewogene Maßnahmen vor.",
    writing: "Schreibe 200–240 Wörter als formellen Vorschlag an eine kommunale Stelle.",
    reading: "Lies einen Text über Wohnraum oder Stadtplanung und notiere Problem, Ursachen, Folgen und Maßnahmen.",
    listening: "Höre einen Bericht über Stadtentwicklung und notiere Zahlen, Kritikpunkte und geplante Maßnahmen.",
  },
  vocabulary: ["Wohnraummangel", "Nachverdichtung", "Infrastruktur", "Stadtplanung", "Mietbelastung", "Bürgerbeteiligung", "Lebensqualität"],
});

export default c1Day8WohnenUndStadtentwicklung;
