import React from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";

const config = {
  day: 28,
  chapter: "10.28",
  assignmentKey: "B1-10.28",
  workbookId: "B1Day28KlimafreundlichLeben",
  title: "Klimafreundlich leben",
  heroImage: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "Green landscape representing climate-friendly living",
  speaking: {
    question: "Wie kann man in deinem Land klimafreundlich leben?",
    instructions: "Sprich über konkrete Maßnahmen, Vorteile und Nachteile sowie die Situation in deinem Heimatland. Erkläre, was jeder Einzelne tun kann.",
    image: "https://images.unsplash.com/photo-1497436072909-f5e4be5584d2?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "People discussing climate-friendly choices",
    ideaTitle: "Brain Map: Klimafreundlich leben",
    ideaGroups: [
      { title: "Energie sparen", items: ["Licht ausschalten", "Energiesparlampen oder LED", "Geräte nicht im Standby lassen", "Weniger heizen", "Richtig lüften"] },
      { title: "Verkehr", items: ["Fahrrad statt Auto", "Öffentliche Verkehrsmittel", "Fahrgemeinschaften", "Weniger fliegen", "Kurze Wege zu Fuß"] },
      { title: "Konsum", items: ["Regionale Produkte", "Weniger Plastik", "Auf Verpackung achten", "Secondhand-Kleidung", "Produkte länger benutzen"] },
      { title: "Ernährung", items: ["Weniger Fleisch", "Bio-Produkte", "Keine Lebensmittel verschwenden", "Saisonale Lebensmittel"] },
      { title: "Recycling und Müll", items: ["Müll trennen", "Wiederverwendbare Produkte", "Stofftaschen", "Reparieren statt wegwerfen"] },
      { title: "Bewusstsein und Bildung", items: ["Andere informieren", "Kinder umweltbewusst erziehen", "Umweltprojekte unterstützen", "Politische Maßnahmen diskutieren"] },
    ],
    discussionQuestions: [
      "Welche klimafreundlichen Maßnahmen sind in deinem Land leicht umzusetzen?",
      "Welche Maßnahmen sind teuer oder schwierig?",
      "Sollte die Regierung strengere Regeln einführen?",
      "Welche Veränderung würdest du zuerst machen?",
    ],
    answerStructure: [
      "Das Thema und die Situation im Heimatland vorstellen.",
      "Mehrere klimafreundliche Maßnahmen beschreiben.",
      "Vorteile für Umwelt, Gesundheit oder Kosten nennen.",
      "Nachteile oder Schwierigkeiten erklären.",
      "Eine persönliche Priorität nennen und die Meinung zusammenfassen.",
    ],
    usefulPhrases: ["In meinem Land könnte man …", "Ein großer Vorteil ist …", "Ein Problem dabei ist, dass …", "Der Staat sollte …", "Jeder Einzelne kann …"],
  },
  writing: {
    title: "Kann jeder Mensch klimafreundlich leben?",
    instructions: "Schreiben Sie Ihre Meinung. Nennen Sie konkrete Maßnahmen, mögliche Schwierigkeiten und ein Beispiel aus Ihrem Alltag oder Heimatland.",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Student writing about climate-friendly living",
    sourceTitle: "Kurzer Impuls",
    sourceText: "Meiner Meinung nach kann jeder Mensch klimafreundlicher leben. Man kann zum Beispiel weniger Plastik benutzen, Strom sparen oder öfter mit dem Fahrrad fahren. Kleine Schritte im Alltag können der Umwelt helfen.",
    taskPoints: [
      "Sagen Sie, ob jeder Mensch klimafreundlich leben kann.",
      "Nennen Sie mindestens zwei konkrete Maßnahmen.",
      "Erklären Sie eine Schwierigkeit oder einen Nachteil.",
      "Geben Sie ein persönliches Beispiel oder beschreiben Sie Ihr Heimatland.",
      "Formulieren Sie einen klaren Schluss.",
    ],
    supportStructure: ["Einleitung", "Eigene Meinung", "Maßnahmen", "Schwierigkeit oder Gegenargument", "Beispiel", "Schluss"],
    vocabulary: ["klimafreundlich handeln", "CO₂ reduzieren", "Energie sparen", "erneuerbare Energien", "öffentliche Verkehrsmittel", "Verantwortung übernehmen"],
  },
  reading: {
    title: "Lesen Sie den Text und beantworten Sie alle sieben Fragen.",
    instructions: "Read the complete essay about water as a valuable resource. Then choose one answer, A–C, for every question.",
    image: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Glass of water and reading material",
    text: {
      title: "Bewusst leben: Wasser als kostbare Ressource",
      paragraphs: [
        "Wasser ist eine der wertvollsten Ressourcen auf unserem Planeten. Ohne Wasser wäre Leben, wie wir es kennen, nicht möglich. Doch in vielen Teilen der Welt ist Wasser knapp, und der bewusste Umgang mit dieser Ressource wird immer wichtiger. In den letzten Jahrzehnten hat der Wasserverbrauch weltweit stark zugenommen. Besonders in den Industrieländern ist der Wasserverbrauch pro Kopf sehr hoch. Hier wird Wasser nicht nur zum Trinken und Kochen verwendet, sondern auch in großen Mengen für die Landwirtschaft und die Industrie benötigt.",
        "Um Wasser zu sparen, gibt es viele Maßnahmen, die jeder Einzelne ergreifen kann. Zum Beispiel sollte man darauf achten, Wasser nicht unnötig laufen zu lassen, etwa beim Zähneputzen oder Geschirrspülen. Auch der Einsatz von wassersparenden Geräten, wie effizienten Duschköpfen und Toilettenspülungen, kann den Wasserverbrauch erheblich reduzieren.",
        "Ein weiteres Problem ist die Verschmutzung der Wasserressourcen. Industrieabfälle, chemische Düngemittel und Plastikmüll gelangen in Flüsse und Meere und verschmutzen das Trinkwasser. Daher ist es wichtig, umweltfreundliche Produkte zu verwenden und Abfälle korrekt zu entsorgen.",
        "Neben den individuellen Maßnahmen ist auch die Politik gefragt. Regierungen können durch Gesetze und Verordnungen den Wasserverbrauch regulieren und Anreize für wassersparende Technologien schaffen. Auch die Aufklärung der Bevölkerung über die Bedeutung des Wassersparens spielt eine wichtige Rolle.",
        "Zusammenfassend lässt sich sagen, dass der bewusste Umgang mit Wasser unerlässlich ist, um diese wertvolle Ressource zu schützen. Jeder Einzelne kann durch kleine Maßnahmen einen Beitrag leisten, und auch die Politik muss ihren Teil dazu beitragen. Nur so können wir sicherstellen, dass auch zukünftige Generationen ausreichend Wasser zur Verfügung haben.",
      ],
      questions: [
        { stem: "Warum ist Wasser eine kostbare Ressource?", options: ["A) Weil es unbegrenzt verfügbar ist.", "B) Weil es in vielen Teilen der Welt knapp ist.", "C) Weil es nicht verschmutzt werden kann."] },
        { stem: "Wofür wird in den Industrieländern besonders viel Wasser verwendet?", options: ["A) Nur zum Trinken und Kochen.", "B) Für Landwirtschaft und Industrie.", "C) Nur für die Industrie."] },
        { stem: "Welche Maßnahme können Einzelne ergreifen?", options: ["A) Wasser beim Zähneputzen laufen lassen.", "B) Wassersparende Geräte benutzen.", "C) Wasser nur zum Trinken verwenden."] },
        { stem: "Warum ist die Verschmutzung der Wasserressourcen ein Problem?", options: ["A) Weil sie die Landwirtschaft unterstützt.", "B) Weil sie das Trinkwasser verschmutzt.", "C) Weil sie die Industrie stärkt."] },
        { stem: "Was können Regierungen tun?", options: ["A) Gesetze und Verordnungen erlassen.", "B) Mehr Wasser verbrauchen.", "C) Wasserquellen verschmutzen."] },
        { stem: "Warum ist Aufklärung wichtig?", options: ["A) Damit die Industrie mehr Wasser verbraucht.", "B) Damit Menschen die Bedeutung des Wassersparens verstehen.", "C) Um den Wasserverbrauch zu erhöhen."] },
        { stem: "Was ist die Hauptaussage des Essays?", options: ["A) Wasser ist unbegrenzt verfügbar.", "B) Wasser ist eine kostbare Ressource, die geschützt werden muss.", "C) Der Wasserverbrauch sollte nicht reguliert werden."] },
      ],
    },
  },
  listening: {
    title: "Hören Sie den Beitrag und kontrollieren Sie Ihre Antworten selbst.",
    instructions: "Complete the listening task independently. Listen again where necessary and use the solutions only for self-checking.",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Headphones and laptop for listening comprehension",
    videoId: "IGIxBJA222o",
    externalUrl: "https://youtu.be/IGIxBJA222o?list=PLos_fDJ_B3W0jhPa-8s_100ALd-HdTcmt",
    selfCheckText: "Check and mark your own Hören result using the listening resource. Only Lesen and Schreiben are submitted for tutor evaluation.",
  },
  submitWritingDescription: "Paste your final 80–100 word opinion text.",
  submitReadingDescription: "Paste your seven reading answer letters.",
};

export default function B1Day28KlimafreundlichLebenWorkbookPage() {
  return <B1StandardWorkbookPage config={config} />;
}
