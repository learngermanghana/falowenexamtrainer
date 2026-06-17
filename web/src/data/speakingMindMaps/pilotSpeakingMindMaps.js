const cleanQuestion = (value = "") =>
  String(value)
    .replace(/^Sprechen:\s*/i, "")
    .trim();

export const a2Day9UrlaubSpeakingMindMap = {
  id: "a2-day9-urlaub",
  level: "A2",
  title: "Urlaub",
  question: "Wohin reist du gern und warum?",
  targetSeconds: 45,
  branches: [
    {
      id: "reiseziel",
      title: "Reiseziel",
      keywords: ["Land", "Stadt", "Strand", "Berge", "Sehenswürdigkeit"],
      prompt: "Wohin möchtest du reisen?",
      example: "Ich möchte nach Spanien reisen, weil das Wetter dort warm ist.",
      starter: "Ich möchte nach ... reisen, weil ...",
    },
    {
      id: "verkehrsmittel",
      title: "Verkehrsmittel",
      keywords: ["Flugzeug", "Zug", "Bus", "Auto", "Boot"],
      prompt: "Wie möchtest du dorthin fahren oder fliegen?",
      example: "Ich fliege mit dem Flugzeug, weil es schneller ist.",
      starter: "Ich fahre / fliege mit ...",
    },
    {
      id: "unterkunft",
      title: "Unterkunft",
      keywords: ["Hotel", "Ferienwohnung", "Pension", "Campingplatz"],
      prompt: "Wo möchtest du wohnen?",
      example: "Ich möchte in einem kleinen Hotel am Strand wohnen.",
      starter: "Während meines Urlaubs wohne ich ...",
    },
    {
      id: "aktivitaeten",
      title: "Aktivitäten",
      keywords: ["schwimmen", "wandern", "besichtigen", "essen", "Safari"],
      prompt: "Was möchtest du im Urlaub machen?",
      example: "Ich möchte schwimmen und lokale Spezialitäten probieren.",
      starter: "Dort möchte ich ...",
    },
    {
      id: "vorbereitung",
      title: "Reisevorbereitung",
      keywords: ["Koffer", "Reisepass", "Visum", "Tickets", "Versicherung"],
      prompt: "Was musst du vor der Reise vorbereiten?",
      example: "Vor der Reise packe ich meinen Koffer und kontrolliere meinen Reisepass.",
      starter: "Vor der Reise muss ich ...",
    },
  ],
  speakingRoute: [
    "Reiseziel nennen",
    "Verkehrsmittel erklären",
    "Unterkunft beschreiben",
    "Aktivitäten nennen",
    "kurzen Schluss sagen",
  ],
};

export const b1Day4WohnungSuchenSpeakingMindMap = {
  id: "b1-day4-wohnung-suchen",
  level: "B1",
  title: "Wohnung suchen",
  question: "Was sind die wichtigsten Punkte, wenn man eine Wohnung sucht?",
  targetSeconds: 90,
  branches: [
    {
      id: "wohnungsarten",
      title: "Wohnungsarten",
      keywords: ["Mietwohnung", "WG", "Einzimmerwohnung", "Eigentumswohnung"],
      prompt: "Welche Wohnungsart passt zu welcher Lebenssituation?",
      example: "Für Studierende ist eine WG häufig günstiger und sozialer.",
      starter: "Zunächst sollte man überlegen, welche Wohnungsart ...",
    },
    {
      id: "wohnungssuche",
      title: "Wohnungssuche",
      keywords: ["Online-Portal", "Zeitung", "Makler", "Kontakte", "Aushang"],
      prompt: "Wo kann man eine passende Wohnung finden?",
      example: "Online-Portale bieten viele Angebote, persönliche Empfehlungen sind aber oft zuverlässiger.",
      starter: "Eine Möglichkeit besteht darin, ...",
    },
    {
      id: "kriterien",
      title: "Kriterien",
      keywords: ["Mietpreis", "Lage", "Nebenkosten", "Verkehr", "Einkaufen"],
      prompt: "Welche Kriterien sind besonders wichtig?",
      example: "Neben dem Mietpreis spielt auch die Verkehrsanbindung eine wichtige Rolle.",
      starter: "Ein entscheidendes Kriterium ist meiner Meinung nach ...",
    },
    {
      id: "besichtigung",
      title: "Besichtigung und Vertrag",
      keywords: ["Termin", "Fragen", "Mietvertrag", "Kaution", "Kündigungsfrist"],
      prompt: "Was sollte man bei der Besichtigung und vor der Unterschrift prüfen?",
      example: "Vor der Unterschrift sollte man den Vertrag und die Nebenkosten genau prüfen.",
      starter: "Bei der Besichtigung sollte man darauf achten, dass ...",
    },
    {
      id: "einzug",
      title: "Einzug und Einrichtung",
      keywords: ["Umzug", "Möbel", "Nachbarn", "Anmeldung", "Strom"],
      prompt: "Was muss nach der Wohnungssuche organisiert werden?",
      example: "Nach dem Einzug muss man Strom und Internet anmelden und die Nachbarn kennenlernen.",
      starter: "Nach dem Einzug ist es wichtig, ...",
    },
  ],
  speakingRoute: [
    "Wohnungsart nennen",
    "Suchmöglichkeiten vergleichen",
    "wichtige Kriterien erklären",
    "Besichtigung erwähnen",
    "eigene Meinung zusammenfassen",
  ],
};

export const b2Day1IdentitySpeakingMindMap = {
  id: "b2-day1-identitaet",
  level: "B2",
  title: "Persönliche Identität",
  question:
    "Welche Faktoren prägen deine persönliche Identität, und wie unterscheidet sich dein Selbstbild online und offline?",
  targetSeconds: 120,
  branches: [
    {
      id: "selbstbild",
      title: "Persönlichkeit und Selbstbild",
      keywords: ["Eigenschaften", "Stärken", "Schwächen", "Authentizität"],
      prompt: "Wie beschreibst du dich selbst, und wie stabil ist dieses Selbstbild?",
      example: "Das eigene Selbstbild entsteht aus persönlichen Stärken, Erfahrungen und der Reaktion anderer Menschen.",
      starter: "Mein Selbstbild wird vor allem dadurch geprägt, dass ...",
    },
    {
      id: "werte",
      title: "Werte und Überzeugungen",
      keywords: ["Ehrlichkeit", "Respekt", "Verantwortung", "Familie", "Ziele"],
      prompt: "Welche Werte beeinflussen deine Entscheidungen?",
      example: "Werte wie Verantwortung und Respekt bestimmen, wie Menschen handeln und Beziehungen gestalten.",
      starter: "Von besonderer Bedeutung sind für mich Werte wie ...",
    },
    {
      id: "erfahrungen",
      title: "Prägende Erfahrungen",
      keywords: ["Kindheit", "Schule", "Arbeit", "Erfolge", "Rückschläge"],
      prompt: "Welche Erfahrungen haben deine Identität besonders verändert?",
      example: "Erfolge stärken das Selbstvertrauen, während Rückschläge oft zu persönlicher Entwicklung führen.",
      starter: "Eine Erfahrung, die mich nachhaltig geprägt hat, ist ...",
    },
    {
      id: "zugehoerigkeit",
      title: "Herkunft und Zugehörigkeit",
      keywords: ["Kultur", "Sprache", "Heimat", "Familie", "Gemeinschaft"],
      prompt: "Welche Rolle spielen Herkunft, Sprache und Zugehörigkeit?",
      example: "Mehrere kulturelle Zugehörigkeiten können die Identität bereichern, aber auch Spannungen erzeugen.",
      starter: "Meine Herkunft beeinflusst mich insofern, als ...",
    },
    {
      id: "online-offline",
      title: "Online und offline",
      keywords: ["soziale Medien", "Selbstdarstellung", "Privatsphäre", "Rollen"],
      prompt: "Warum unterscheidet sich das Selbstbild online manchmal vom Alltag?",
      example: "In sozialen Medien zeigen Menschen häufig nur ausgewählte Seiten ihrer Persönlichkeit.",
      starter: "Zwischen meiner Online-Präsenz und meinem Alltag besteht der Unterschied, dass ...",
    },
    {
      id: "entwicklung",
      title: "Persönliche Entwicklung",
      keywords: ["Entscheidungen", "Veränderung", "Vorbilder", "Zukunft", "Lernen"],
      prompt: "Wie kann sich Identität im Laufe des Lebens verändern?",
      example: "Identität ist kein fester Zustand, sondern entwickelt sich durch neue Erfahrungen und Entscheidungen weiter.",
      starter: "Langfristig verändert sich Identität, wenn ...",
    },
  ],
  speakingRoute: [
    "Selbstbild erklären",
    "Werte nennen",
    "eine prägende Erfahrung geben",
    "Online und offline vergleichen",
    "Entwicklung zusammenfassen",
  ],
};

export const c1Day3MediaSpeakingMindMap = {
  id: "c1-day3-medienkompetenz",
  level: "C1",
  title: "Medien und Informationskompetenz",
  question:
    "Warum ist Medienkompetenz wichtig, und wie lassen sich Desinformation, Regulierung und Meinungsfreiheit sinnvoll miteinander verbinden?",
  targetSeconds: 120,
  speakingRoute: [
    "Quellen prüfen",
    "Desinformation erklären",
    "Verantwortung abwägen",
    "Freiheit schützen",
    "Medienbildung als Lösung nennen",
  ],
};

export const buildC1Day3SpeakingMindMap = (lesson = {}) => ({
  ...c1Day3MediaSpeakingMindMap,
  title: lesson.title || c1Day3MediaSpeakingMindMap.title,
  question:
    cleanQuestion(lesson.speakingTopic) || c1Day3MediaSpeakingMindMap.question,
  branches:
    Array.isArray(lesson?.speakingBuilder?.branches) &&
    lesson.speakingBuilder.branches.length
      ? lesson.speakingBuilder.branches
      : [],
});

export const resolvePilotSpeakingMindMapFromPath = (pathname = "") => {
  const path = String(pathname || "").toLowerCase();
  const match =
    path.match(/\/campus\/course\/lesson\/(a2|b1)\/(\d+)/) ||
    path.match(/(a2|b1)-day-(\d+)/);

  if (!match) return null;
  const key = `${match[1]}-${Number(match[2])}`;
  const registry = {
    "a2-9": a2Day9UrlaubSpeakingMindMap,
    "b1-4": b1Day4WohnungSuchenSpeakingMindMap,
  };
  return registry[key] || null;
};
