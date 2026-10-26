import React from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";
import { getB1WritingTask } from "../data/b1WritingTasks";
import { getB1ListeningTask } from "../data/b1ListeningTasks";
import { getB1ReadingTask } from "../data/b1ReadingTasks";

export const B1_DAY24_KONSUM_NACHHALTIGKEIT_WORKBOOK_CONFIG = {
  day: 24,
  chapter: "8.24",
  assignmentKey: "B1-8.24",
  workbookId: "B1Day24KonsumNachhaltigkeit",
  title: "Konsum und Nachhaltigkeit",
  heroImage: "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "Sustainable shopping and consumption choices",
  speaking: {
    question:
      "Wie wichtig ist dir Nachhaltigkeit beim Konsum, und welche Maßnahmen ergreifst du, um umweltbewusster zu leben?",
    instructions:
      "Beschreiben Sie verschiedene Möglichkeiten, wie man nachhaltiger konsumieren kann. Nennen Sie Vor- und Nachteile und bewerten Sie diese. Beschreiben Sie eine Maßnahme zur Förderung der Nachhaltigkeit, die für Sie besonders wichtig ist.",
    image: "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Sustainable products and shopping choices",
    ideaTitle: "Zentrales Thema: Konsum und Nachhaltigkeit (B1)",
    ideaIntro:
      "In this chapter, we'll engage in group exercises discussing the seven main branches and their sub-topics.",
    ideaGroups: [
      {
        title: "1. Konsumverhalten",
        items: [
          "Bewusster Konsum",
          "Kulturelle Unterschiede im Konsum, zum Beispiel in Deutschland und Ghana",
          "Konsumgewohnheiten bei Lebensmitteln, Kleidung und Elektronik",
          "Online-Shopping versus stationärer Handel",
          "Trends: Minimalismus und Slow Living",
        ],
      },
      {
        title: "2. Nachhaltigkeit im Alltag",
        items: [
          "Recycling und Müllvermeidung",
          "Nachhaltige Produkte, zum Beispiel Bioprodukte und Fair Trade",
          "Strom- und Wassersparen",
          "Regionale Produkte kaufen",
          "Secondhand kaufen, zum Beispiel Kleidung und Möbel",
          "Ökologische Verpackungen: Papier statt Plastik",
        ],
      },
      {
        title: "3. Umweltschutz und Klimawandel",
        items: [
          "Ursachen und Folgen des Klimawandels",
          "CO₂-Emissionen und deren Reduzierung",
          "Erneuerbare Energien: Solar, Wind und Wasser",
          "Mülltrennung und Kompostierung",
          "Klimaschutzorganisationen und -initiativen, zum Beispiel Fridays for Future",
        ],
      },
      {
        title: "4. Wirtschaft und Nachhaltigkeit",
        items: [
          "Nachhaltige Unternehmen und ihre Verantwortung",
          "Die Bedeutung der Kreislaufwirtschaft",
          "Grüne Technologien und Innovationen",
          "Fairer Handel und soziale Verantwortung",
          "Zertifikate und Siegel für nachhaltige Produkte, zum Beispiel Bio und Fair Trade",
        ],
      },
      {
        title: "5. Verantwortung des Einzelnen",
        items: [
          "Persönliche Entscheidungen treffen, zum Beispiel weniger Fleisch essen oder umweltfreundlich reisen",
          "Bewusster Konsum und Vermeidung von Überkonsum",
          "Verantwortung für die Umwelt in der Familie und Gemeinschaft",
          "Bildung und Aufklärung über Nachhaltigkeit",
          "Politische Beteiligung und Einfluss auf nachhaltige Gesetze",
        ],
      },
      {
        title: "6. Redemittel für Diskussion oder Schreiben",
        items: [
          "Ich denke, dass Nachhaltigkeit eine wichtige Rolle spielt, weil …",
          "Es ist notwendig, dass wir unser Konsumverhalten ändern, um …",
          "Ein Beispiel für nachhaltigen Konsum ist …",
          "Meiner Meinung nach sollten wir mehr auf … achten.",
          "In Zukunft wird nachhaltiger Konsum immer wichtiger sein, weil …",
        ],
      },
      {
        title: "7. Herausforderungen und Lösungen",
        items: [
          "Herausforderungen bei der Umsetzung von Nachhaltigkeit: Kosten, Verfügbarkeit und Gewohnheiten",
          "Lösungsansätze, zum Beispiel Umweltschutzgesetze, Aufklärung und innovative Produkte",
          "Nachhaltigkeit und Wirtschaftswachstum: Konflikt oder Chance?",
        ],
      },
    ],
    activityTitle: "Anweisung für die Gruppenpraxis",
    activityOrdered: true,
    activityPoints: [
      "Beschreiben Sie verschiedene Möglichkeiten, wie man nachhaltiger konsumieren kann.",
      "Nennen Sie Vor- und Nachteile und bewerten Sie diese.",
      "Beschreiben Sie eine Maßnahme zur Förderung der Nachhaltigkeit, die für Sie besonders wichtig ist.",
    ],
    discussionQuestions: [
      "Welche nachhaltigen Produkte kaufst du bereits?",
      "Welche kulturellen Unterschiede beim Konsum gibt es zwischen Deutschland und Ghana?",
      "Sollten Unternehmen oder Verbraucher mehr Verantwortung tragen?",
      "Kann nachhaltiger Konsum auch günstig sein?",
      "Ist Nachhaltigkeit für die Wirtschaft eher ein Konflikt oder eine Chance?",
    ],
    answerStructure: [
      "Das Thema Nachhaltigkeit beim Konsum vorstellen.",
      "Mehrere Möglichkeiten für nachhaltigen Konsum beschreiben.",
      "Vor- und Nachteile wie Preis, Qualität, Verfügbarkeit und Bequemlichkeit nennen.",
      "Die Möglichkeiten bewerten und ein persönliches Beispiel geben.",
      "Eine besonders wichtige Maßnahme auswählen und die Wahl begründen.",
    ],
    usefulPhrases: [
      "Ich denke, dass Nachhaltigkeit eine wichtige Rolle spielt, weil …",
      "Es ist notwendig, dass wir unser Konsumverhalten ändern, um …",
      "Ein Beispiel für nachhaltigen Konsum ist …",
      "Meiner Meinung nach sollten wir mehr auf … achten.",
      "Einerseits …, andererseits …",
      "In Zukunft wird nachhaltiger Konsum immer wichtiger sein, weil …",
    ],
  },
  writing: getB1WritingTask(24),
  reading: getB1ReadingTask(24),
  listening: getB1ListeningTask(24),
  submitWritingDescription: "Paste your final blog/forum post of about 80 words covering all four points.",
  submitReadingDescription: "Paste your seven answer letters (A, B or C).",
};

export default function B1Day24KonsumNachhaltigkeitWorkbookPage() {
  return (
    <B1StandardWorkbookPage
      config={B1_DAY24_KONSUM_NACHHALTIGKEIT_WORKBOOK_CONFIG}
    />
  );
}
