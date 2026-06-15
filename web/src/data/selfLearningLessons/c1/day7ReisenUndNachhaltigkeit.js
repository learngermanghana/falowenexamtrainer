import { makeLesson } from "../buildSelfLearningLesson";

const c1Day7ReisenUndNachhaltigkeit = makeLesson({
  level: "C1",
  day: 7,
  chapter: "2.2",
  title: "Reisen und Nachhaltigkeit",
  topic: "Mobilität, Tourismus, Umweltfolgen und Verantwortung differenziert vergleichen und bewerten",
  heroImage: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80",
  grammarFocus: "Erweiterte Vergleichsformen und abwägende Argumentation",
  objectives: [
    "Ich kann Reiseformen nach Umweltwirkung, Kosten, Zeit und Zugänglichkeit vergleichen.",
    "Ich kann Unterschiede mit im Vergleich zu, gegenüber, während, wohingegen und hingegen ausdrücken.",
    "Ich kann je ... desto beziehungsweise je ... umso korrekt verwenden.",
    "Ich kann eine C1-Erörterung mit Vergleich, Einwand und ausgewogener Position verfassen.",
  ],
  explanation: [
    "Nachhaltiges Reisen betrifft Verkehrsmittel, Entfernung, Aufenthaltsdauer, Unterkunft und die Auswirkungen auf die lokale Bevölkerung.",
    "Eine überzeugende C1-Argumentation vergleicht mehrere Kriterien und wägt Mobilität, Umwelt, Wirtschaft und soziale Teilhabe gegeneinander ab.",
    "Die Schreibaufgabe prüft, ob Tourismus stärker reguliert werden sollte.",
  ],
  grammarLesson: {
    title: "Erweiterte Vergleichsformen und abwägende Argumentation",
    explanation: [
      "Im Vergleich zu, gegenüber und verglichen mit stellen Möglichkeiten sachlich gegenüber.",
      "Während, wohingegen und hingegen markieren Unterschiede. Je ... desto oder je ... umso verbindet zwei parallele Entwicklungen.",
      "Weitaus, erheblich, deutlich, kaum und vergleichsweise machen Bewertungen präziser. Einerseits ... andererseits und zwar ... aber unterstützen eine ausgewogene Argumentation.",
    ],
    rules: [
      "Im Vergleich zu und gegenüber leiten die Vergleichsgröße ein.",
      "Nach während und wohingegen steht das Verb am Ende.",
      "Nach hingegen oder demgegenüber folgt das Verb auf Position zwei.",
      "Je + Komparativ ..., desto oder umso + Komparativ.",
      "Verstärke Komparative mit weitaus, erheblich, deutlich oder wesentlich.",
      "Nutze einerseits ... andererseits oder zwar ... aber für eine Abwägung.",
    ],
    examples: [
      "Im Vergleich zu Kurzstreckenflügen ist eine Bahnfahrt häufig weitaus klimafreundlicher.",
      "Während Pauschalreisen bequem sind, ermöglichen individuelle Reisen oft mehr Kontakt zur lokalen Bevölkerung.",
      "Je weiter ein Reiseziel entfernt ist, desto größer ist meist der Ressourcenverbrauch der Anreise.",
      "Eine Tourismusabgabe könnte zwar Naturschutz finanzieren, sie würde Reisen aber zugleich verteuern.",
      "Kleine Unterkünfte sind nicht automatisch nachhaltiger; gegenüber großen Anlagen können sie jedoch stärker lokal eingebunden sein.",
    ],
    miniExercise: "Verbinde die Aussagen: 1) Bahn und Flugzeug mit während. 2) Entfernung und Emissionen mit je ... desto. 3) Nutzen und Kosten einer Tourismusabgabe mit zwar ... aber. 4) Bus und Auto mit im Vergleich zu und deutlich.",
    knowledgeTest: [
      {
        question: "Welche Formulierung stellt zwei Reiseformen sachlich gegenüber?",
        options: ["Im Vergleich zum Flugzeug ist die Bahn emissionsärmer.", "Damit das Flugzeug ist die Bahn emissionsärmer.", "Wegen Flugzeug die Bahn emissionsärmer.", "Obwohl Flugzeug die Bahn emissionsärmer."],
        answer: "Im Vergleich zum Flugzeug ist die Bahn emissionsärmer.",
        explanation: "Im Vergleich zu eignet sich für direkte Gegenüberstellungen.",
      },
      {
        question: "Welche Struktur ist korrekt?",
        options: ["Je weiter das Ziel entfernt ist, desto höher sind meist die Emissionen.", "Je das Ziel weiter ist, desto sind die Emissionen höher.", "Je weiter ist das Ziel, desto die Emissionen höher sind.", "Je weiter das Ziel, desto höher meist Emissionen."],
        answer: "Je weiter das Ziel entfernt ist, desto höher sind meist die Emissionen.",
        explanation: "Im je-Satz steht das Verb am Ende; im desto-Satz auf Position zwei.",
      },
      {
        question: "Welches Wort verstärkt einen Komparativ?",
        options: ["weitaus", "obwohl", "damit", "infolge"],
        answer: "weitaus",
        explanation: "Weitaus verstärkt Vergleiche wie weitaus günstiger.",
      },
      {
        question: "Welche Struktur eignet sich für eine ausgewogene Bewertung?",
        options: ["einerseits ... andererseits", "sodass ... daher", "weil ... deshalb", "nachdem ... bevor"],
        answer: "einerseits ... andererseits",
        explanation: "Die Struktur stellt zwei relevante Seiten gegenüber.",
      },
    ],
  },
  speakingTaskType: "C1 sustainable travel discussion",
  speakingTopic: "Sprechen: Wie lässt sich Reisen nachhaltiger gestalten, ohne Mobilität und wirtschaftliche Chancen unverhältnismäßig einzuschränken?",
  speakingBuilder: {
    branches: [
      { id: "verkehr", title: "Verkehrsmittel", keywords: ["Bahn", "Bus", "Auto", "Flugzeug", "Emissionen"] },
      { id: "gestaltung", title: "Reisegestaltung", keywords: ["Entfernung", "Aufenthaltsdauer", "Häufigkeit", "Unterkunft", "Nebensaison"] },
      { id: "umwelt", title: "Umweltfolgen", keywords: ["CO₂-Ausstoß", "Ressourcen", "Flächenverbrauch", "Abfall", "Naturschutz"] },
      { id: "lokal", title: "Lokale Bevölkerung", keywords: ["Wohnraum", "Kultur", "Lebenshaltungskosten", "Arbeitsplätze", "Respekt"] },
      { id: "wirtschaft", title: "Wirtschaft und Teilhabe", keywords: ["Einnahmen", "Beschäftigung", "Erreichbarkeit", "Reisefreiheit", "Gerechtigkeit"] },
      { id: "regulierung", title: "Regulierung und Verantwortung", keywords: ["Tourismusabgabe", "Besuchergrenzen", "Information", "Anreize", "Anbieter"] },
    ],
  },
  writingTaskType: "C1 discussion essay / Stellungnahme",
  writingTopic: "Schreiben: Soll Tourismus stärker reguliert werden? Verfassen Sie eine C1-Erörterung. Erklären Sie die aktuelle Debatte. Vergleichen Sie anhand eines Beispiels mindestens zwei Reiseformen oder Tourismusmodelle. Nennen Sie einen Einwand gegen strengere Regeln. Entwickeln Sie eine ausgewogene Position und schlagen Sie wirksame, sozial gerechte Maßnahmen vor.",
  writingBuilder: {
    structure: [
      "Einleitung und Grundposition",
      "Vergleich zweier Reiseformen oder Tourismusmodelle",
      "Argumente für geeignete Regulierungsmaßnahmen",
      "Einwand zu Freiheit, Kosten, Arbeitsplätzen oder Umsetzung",
      "Ausgewogene Lösung und Schlussurteil",
    ],
    usefulLines: [
      "Im Vergleich zu früher werden ökologische und soziale Reisefolgen stärker berücksichtigt.",
      "Während eine Reiseform durch Schnelligkeit überzeugt, ist die andere hinsichtlich der Umweltwirkung deutlich günstiger.",
      "Je stärker Reiseziele belastet werden, desto nachvollziehbarer erscheint eine gezielte Regulierung.",
      "Strengere Vorgaben könnten zwar schützen, sie könnten Reisen aber zugleich verteuern.",
      "Sinnvoll wäre eine Kombination aus Information, Anreizen und lokal angepassten Grenzen.",
    ],
  },
  tasks: {
    speaking: "Sprich 2 Minuten über nachhaltiges Reisen und vergleiche Reiseformen, Folgen und mögliche Regeln.",
    writing: "Schreibe 200–240 Wörter als C1-Erörterung zur Regulierung des Tourismus.",
    reading: "Lies einen Artikel über nachhaltigen Tourismus und notiere Vergleichskriterien sowie Pro- und Contra-Argumente.",
    listening: "Höre einen Beitrag über nachhaltiges Reisen und fasse Vergleiche, Kritik und Maßnahmen zusammen.",
  },
  vocabulary: ["Nachhaltigkeit", "Tourismusabgabe", "Massentourismus", "Emissionen", "Mobilität", "Besuchergrenze", "Reisefreiheit"],
});

export default c1Day7ReisenUndNachhaltigkeit;
