const c1Day2LearningSpeakingGuide = {
  learn: {
    intro:
      "In diesem Kapitel lernst du, wie Kultur, Sprache, Traditionen und persönliche Erfahrungen die Identität eines Menschen prägen. Du lernst außerdem, starre kulturelle Zuordnungen kritisch zu bewerten und deine Gedanken mit C1-Strukturen klar auszudrücken.",
    outcomes: [
      {
        title: "Kultur und Identität erklären",
        description:
          "Du kannst erklären, wie Sprache, Familie, Religion, Alltag, Medien und Migration das Selbstverständnis beeinflussen.",
      },
      {
        title: "Mehrfachzugehörigkeit verstehen",
        description:
          "Du kannst beschreiben, warum sich Menschen gleichzeitig mehreren Kulturen oder Gruppen zugehörig fühlen können.",
      },
      {
        title: "Starre Zuordnungen hinterfragen",
        description:
          "Du kannst erklären, warum Herkunft allein einen Menschen nicht vollständig beschreibt.",
      },
      {
        title: "C1-Grammatik anwenden",
        description:
          "Du verwendest Partizip I und Partizip II als Adjektive, zum Beispiel: eine prägende Kultur und eine kulturell geprägte Identität.",
      },
    ],
    videos: [
      {
        key: "grammar-video",
        type: "Grammar video",
        title: "Partizip I und Partizip II als Adjektiv",
        description:
          "Schau dir zuerst die Grammatikerklärung an. Achte besonders auf Partizipialattribute und Adjektivendungen.",
        url: "https://youtu.be/MF0SDU0Gsp4",
      },
      {
        key: "ai-topic-video",
        type: "AI video",
        title: "Kultur und Identität",
        description:
          "Nutze das AI-Video als zweite Erklärung und zur Wiederholung des Kapitels.",
        url: "",
      },
    ],
  },
  speaking: {
    title: "C1-Ideenmap: Kultur und Identität",
    instruction:
      "Wähle mindestens drei Bereiche aus. Sammle zu jedem Bereich ein Beispiel oder eine persönliche Beobachtung. Danach beantwortest du die Sprechfrage unter der Ideenmap.",
    center: "Kultur & Identität",
    branches: [
      {
        id: "sprache",
        title: "Sprache",
        keywords: ["Muttersprache", "Zweitsprache", "bilingual", "mehrsprachig", "Dialekt", "Akzent"],
        prompt: "Welche Rolle spielt Sprache für Zugehörigkeit und Selbstbild?",
        example: "Eine mehrsprachig aufgewachsene Person kann sich mehreren Kulturräumen verbunden fühlen.",
      },
      {
        id: "traditionen",
        title: "Traditionen",
        keywords: ["Feste", "Essen", "Kleidung", "Rituale", "Werte", "Bräuche"],
        prompt: "Welche Traditionen prägen den Alltag oder die Familie?",
        example: "Überlieferte Feste und Rituale können das Gemeinschaftsgefühl stärken.",
      },
      {
        id: "familie",
        title: "Familie & Erziehung",
        keywords: ["Eltern", "Generationen", "Religion", "Regeln", "Erwartungen", "Vorbild"],
        prompt: "Welche Werte und Verhaltensweisen werden in der Familie vermittelt?",
        example: "Von der Familie vermittelte Werte beeinflussen häufig spätere Entscheidungen.",
      },
      {
        id: "migration",
        title: "Migration & Lebensräume",
        keywords: ["Herkunft", "neues Land", "Integration", "Anpassung", "Heimat", "Mehrfachzugehörigkeit"],
        prompt: "Wie verändert das Leben zwischen mehreren Ländern oder Kulturen die Identität?",
        example: "In zwei Ländern lebende Menschen entwickeln oft ein vielschichtiges Zugehörigkeitsgefühl.",
      },
      {
        id: "gesellschaft",
        title: "Medien & Gesellschaft",
        keywords: ["Schule", "Freundeskreis", "soziale Medien", "Rollenbilder", "Normen", "Öffentlichkeit"],
        prompt: "Wie beeinflussen Gesellschaft und Medien das Selbstbild?",
        example: "In sozialen Medien verbreitete Rollenbilder können das eigene Selbstverständnis beeinflussen.",
      },
      {
        id: "erfahrungen",
        title: "Persönliche Erfahrungen",
        keywords: ["Reisen", "Arbeit", "Beziehungen", "Konflikte", "Entscheidungen", "Entwicklung"],
        prompt: "Welche persönlichen Erfahrungen haben die eigene Identität verändert?",
        example: "Prägende Lebenserfahrungen können kulturelle Vorstellungen erweitern oder verändern.",
      },
    ],
  },
};

export default c1Day2LearningSpeakingGuide;
