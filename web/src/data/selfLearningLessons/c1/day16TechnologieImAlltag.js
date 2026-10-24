import { makeLesson } from "../buildSelfLearningLesson";

const c1Day16TechnologieImAlltag = makeLesson({
  level: "C1",
  day: 16,
  chapter: "4.1",
  title: "Technologie im Alltag",
  topic: "Digitale Werkzeuge, ständige Erreichbarkeit, Abhängigkeit und selbstbestimmte Nutzung kritisch bewerten",
  heroImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
  grammarFocus: "Ursache-Wirkung-Strukturen, kritische Zusammenfassung und Prüfungssprache",
  objectives: [
    "Ich kann Ursachen, unmittelbare Folgen und langfristige Auswirkungen digitaler Gewohnheiten unterscheiden.",
    "Ich kann Ursache-Wirkung-Beziehungen mit Nebensätzen, Präpositionen und Verknüpfungen formulieren.",
    "Ich kann zwischen nachgewiesener Ursache, möglichem Einfluss und bloßem Zusammenhang unterscheiden.",
    "Ich kann eine C1-Erörterung über digitale Überlastung und verbindliche Ruhezeiten verfassen.",
  ],
  explanation: [
    "Digitale Technologien erleichtern Kommunikation, Arbeit, Lernen und Organisation. Zugleich können Benachrichtigungen, algorithmische Anreize und permanente Erreichbarkeit Konzentration, Schlaf und Selbstbestimmung beeinträchtigen.",
    "Eine differenzierte Analyse zeigt, wodurch ein Verhalten entsteht, welche Wirkung wahrscheinlich ist, welche weiteren Faktoren beteiligt sind und unter welchen Bedingungen Gegenmaßnahmen greifen könnten.",
    "Die Schreibaufgabe ist eine Erörterung darüber, ob Schulen und Arbeitgeber verbindliche digitale Ruhezeiten einführen sollten.",
  ],
  grammarLesson: {
    title: "Ursache-Wirkung-Strukturen und kritische Prüfungssprache",
    explanation: [
      "Ursachen lassen sich verbal oder nominal ausdrücken: Weil viele Beschäftigte ständig erreichbar sind ... Aufgrund der ständigen Erreichbarkeit ...",
      "Folgen werden mit sodass, wodurch, daher, infolgedessen, dies führt dazu, dass oder dies hat zur Folge, dass formuliert.",
      "Bei unsicheren Zusammenhängen sind vorsichtige Formen wichtig: kann dazu beitragen, steht möglicherweise im Zusammenhang mit oder lässt sich teilweise darauf zurückführen.",
    ],
    rules: [
      "Formuliere Ursachen mit weil, da, dadurch dass, aufgrund, infolge oder angesichts.",
      "Formuliere Folgen mit sodass, weshalb, wodurch, infolgedessen, folglich oder hat zur Folge, dass.",
      "Baue Wirkungsketten auf: Ursache, unmittelbare Wirkung und langfristige Konsequenz.",
      "Kennzeichne begrenzte Sicherheit mit kann, könnte, dürfte, möglicherweise oder trägt dazu bei.",
      "Unterscheide Kausalität und Zusammenhang: X verursacht Y ist stärker als X steht mit Y im Zusammenhang.",
      "Fasse fremde Aussagen sachlich zusammen: Der Beitrag führt die Entwicklung darauf zurück, dass ...",
    ],
    examples: [
      "Dadurch, dass Benachrichtigungen jederzeit sichtbar sind, wird die Aufmerksamkeit wiederholt unterbrochen.",
      "Die ständige Unterbrechung hat zur Folge, dass komplexe Aufgaben mehr Zeit beanspruchen.",
      "Infolge permanenter Erreichbarkeit fällt es vielen Beschäftigten schwer, Arbeit und Freizeit zu trennen.",
      "Eine intensive Bildschirmnutzung am Abend kann zu einer schlechteren Schlafqualität beitragen.",
      "Der Zusammenhang lässt sich nicht ausschließlich auf die Technik zurückführen, da auch persönliche Gewohnheiten eine Rolle spielen.",
    ],
    miniExercise: "Verbinde Ursache und Wirkung differenziert: 1) Benachrichtigungen unterbrechen häufig. Die Konzentration sinkt. 2) Beschäftigte sind abends erreichbar. Erholung wird schwieriger. 3) Viele Menschen nutzen Navigationsapps. Sie orientieren sich seltener selbst. 4) Bildschirmzeit und Schlafprobleme treten gemeinsam auf, aber weitere Faktoren sind beteiligt.",
    knowledgeTest: [
      {
        question: "Welche Formulierung beschreibt eine Ursache-Wirkung-Beziehung präzise?",
        options: ["Die ständige Erreichbarkeit hat zur Folge, dass die Grenzen zwischen Arbeit und Freizeit verschwimmen.", "Erreichbarkeit und Freizeit sind irgendwie gleich.", "Weil Erreichbarkeit hat Folge Freizeit verschwimmt.", "Die Erreichbarkeit ist eine Folge, obwohl keine Ursache genannt wird."],
        answer: "Die ständige Erreichbarkeit hat zur Folge, dass die Grenzen zwischen Arbeit und Freizeit verschwimmen.",
        explanation: "Hat zur Folge, dass verbindet Ursache und Konsequenz formal und eindeutig.",
      },
      {
        question: "Welche Aussage formuliert einen möglichen Einfluss vorsichtig?",
        options: ["Abendliche Bildschirmnutzung kann zu einer schlechteren Schlafqualität beitragen.", "Bildschirme verursachen bei allen Menschen sicher Schlafprobleme.", "Bildschirmnutzung ist immer Schlaflosigkeit.", "Schlaf ist wegen Bildschirm vollständig unmöglich."],
        answer: "Abendliche Bildschirmnutzung kann zu einer schlechteren Schlafqualität beitragen.",
        explanation: "Kann beitragen kennzeichnet einen plausiblen, aber nicht absolut sicheren Einfluss.",
      },
      {
        question: "Welche Formulierung unterscheidet Zusammenhang und eindeutige Ursache?",
        options: ["Die Befunde zeigen einen Zusammenhang; eine eindeutige Ursache lässt sich daraus jedoch nicht ableiten.", "Wenn zwei Dinge gemeinsam auftreten, verursacht das erste immer das zweite.", "Der Zusammenhang beweist automatisch die Ursache.", "Die Daten sind ähnlich, also ist alles bewiesen."],
        answer: "Die Befunde zeigen einen Zusammenhang; eine eindeutige Ursache lässt sich daraus jedoch nicht ableiten.",
        explanation: "Die Formulierung vermeidet eine unzulässige Schlussfolgerung.",
      },
      {
        question: "Welche Formulierung fasst einen fremden Text prüfungsgerecht zusammen?",
        options: ["Der Beitrag führt die zunehmende Erschöpfung unter anderem auf permanente Erreichbarkeit zurück.", "Ich finde den Beitrag gut und Technologie schlecht.", "Der Text sagt Sachen über Handys.", "Permanente Erreichbarkeit, weil Beitrag und Erschöpfung."],
        answer: "Der Beitrag führt die zunehmende Erschöpfung unter anderem auf permanente Erreichbarkeit zurück.",
        explanation: "Die Kernaussage wird sachlich und verdichtet wiedergegeben.",
      },
    ],
  },
  speakingTaskType: "C1 digital life discussion",
  speakingTopic: "Sprechen: Wie verändert Technologie unseren Alltag, und wo sind bewusste Grenzen notwendig?",
  speakingBuilder: {
    branches: [
      { id: "nutzen", title: "Praktischer Nutzen", keywords: ["Kommunikation", "Organisation", "Navigation", "Barrierefreiheit", "Zeitersparnis"] },
      { id: "arbeit", title: "Arbeit und Lernen", keywords: ["Homeoffice", "Online-Kurse", "Produktivität", "Zusammenarbeit", "Erreichbarkeit"] },
      { id: "gesundheit", title: "Aufmerksamkeit und Gesundheit", keywords: ["Benachrichtigungen", "Konzentration", "Schlaf", "Stress", "Bewegung"] },
      { id: "beziehungen", title: "Soziale Beziehungen", keywords: ["Nähe", "Ablenkung", "soziale Medien", "Vergleichsdruck", "Gesprächskultur"] },
      { id: "kontrolle", title: "Abhängigkeit und Kontrolle", keywords: ["Algorithmen", "Gewohnheiten", "Nutzungsdaten", "Selbstkontrolle", "Datenschutz"] },
      { id: "grenzen", title: "Lösungen und Grenzen", keywords: ["Ruhezeiten", "Benachrichtigungen", "Medienbildung", "Arbeitsregeln", "digitale Auszeiten"] },
    ],
  },
  writingTaskType: "C1 opinion essay / Erörterung",
  writingTopic: "Schreiben: Sollten Schulen und Arbeitgeber verbindliche digitale Ruhezeiten einführen? Verfassen Sie für ein gesellschaftspolitisches Online-Magazin eine C1-Erörterung mit 220–280 Wörtern. Erklären Sie zwei Ursachen digitaler Überlastung und deren Folgen. Berücksichtigen Sie ein Gegenargument zur Flexibilität oder Eigenverantwortung. Bewerten Sie eine konkrete Maßnahme und entwickeln Sie eine ausgewogene Schlussposition.",
  writingBuilder: {
    structure: ["Einleitung, Problem und These", "Erste Ursache mit Wirkungskette", "Zweite Ursache und langfristige Folge", "Gegenargument und Abwägung", "Maßnahme, Bedingungen und Schluss"],
    usefulLines: [
      "Die Digitalisierung erleichtert zahlreiche Alltagsprozesse; zugleich führt permanente Erreichbarkeit zu neuen Belastungen.",
      "Eine zentrale Ursache digitaler Überlastung liegt darin, dass ...",
      "Dies hat unmittelbar zur Folge, dass ...; langfristig kann daraus ... entstehen.",
      "Darüber hinaus lässt sich die Entwicklung teilweise darauf zurückführen, dass ...",
      "Dem ist entgegenzuhalten, dass verbindliche Ruhezeiten die notwendige Flexibilität einschränken könnten.",
      "Meines Erachtens sind klare Ruhezeiten sinnvoll, sofern Ausnahmen transparent geregelt werden.",
    ],
  },
  tasks: {
    speaking: "Sprich 3 Minuten über Nutzen, Ursachen digitaler Überlastung, Folgen, Gegenargumente und sinnvolle Grenzen.",
    writing: "Schreibe 220–280 Wörter als C1-Erörterung über verbindliche digitale Ruhezeiten.",
    reading: "Lies einen Kommentar über digitale Gewohnheiten und markiere Ursache, Wirkung, Einschränkung, Gegenargument und Schlussfolgerung.",
    listening: "Höre einen Technikbeitrag und notiere Hauptaussagen, Ursache-Wirkung-Ketten und die Bewertung.",
  },
  resources: {
    grammarBook: { title: "C1 Day 16 grammar notes", url: "/campus/course/c1-day-16-technologie-im-alltag-grammar-notes" },
    workbook: { title: "C1 Day 16 workbook", url: "/campus/course/c1-day-16-technologie-im-alltag-workbook" },
  },
  vocabulary: ["Digitalisierung", "ständige Erreichbarkeit", "digitale Abhängigkeit", "Wirkungskette", "Ruhezeit", "Selbstbestimmung", "Aufmerksamkeit", "Nutzungsverhalten"],
});

export default c1Day16TechnologieImAlltag;
