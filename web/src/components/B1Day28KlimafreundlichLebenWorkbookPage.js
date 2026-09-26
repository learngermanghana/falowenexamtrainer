import React from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";
import { getB1WritingTask } from "../data/b1WritingTasks";

export const B1_DAY28_KLIMAFREUNDLICH_LEBEN_WORKBOOK_CONFIG = {
  day: 28,
  chapter: "10.28",
  assignmentKey: "B1-10.28",
  workbookId: "B1Day28KlimafreundlichLeben",
  title: "Klimafreundlich leben",
  heroImage: "https://images.unsplash.com/photo-1497436072909-f5e4be1713fd?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "Climate-friendly living and nature",
  speaking: {
    question: "Wie kann man in deinem Land klimafreundlich leben? Sprich über Vorteile und Nachteile und beschreibe die Situation in deinem Land.",
    instructions: "Sprechen Sie über Energie, Verkehr, Konsum, Ernährung, Recycling, Bildung sowie die konkrete Situation in Ihrem Land.",
    image: "https://images.unsplash.com/photo-1497436072909-f5e4be1713fd?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Climate-friendly everyday choices",
    ideaTitle: "Klimafreundlich leben – Was kann jeder Einzelne tun?",
    ideaIntro: "In this chapter, we'll engage in group exercises discussing how every person can live more climate-friendly.",
    ideaGroups: [
      { title: "1. Energie sparen", items: ["Licht ausschalten", "Energiesparlampen benutzen", "Geräte nicht im Standby lassen", "Weniger heizen und richtig lüften"] },
      { title: "2. Verkehr", items: ["Fahrrad statt Auto", "Öffentliche Verkehrsmittel", "Fahrgemeinschaften", "Weniger fliegen"] },
      { title: "3. Konsum", items: ["Regionale Produkte kaufen", "Weniger Plastik", "Auf Verpackung achten", "Second-Hand-Kleidung"] },
      { title: "4. Ernährung", items: ["Weniger Fleisch essen", "Bio-Produkte kaufen", "Keine Lebensmittel verschwenden"] },
      { title: "5. Recycling und Müll", items: ["Müll trennen", "Wiederverwendbare Produkte nutzen", "Stofftaschen statt Plastiktüten"] },
      { title: "6. Bewusstsein und Bildung", items: ["Andere informieren", "Kinder umweltbewusst erziehen", "Umweltprojekte unterstützen"] },
    ],
    activityTitle: "Thema: Klimafreundlich leben – Was kann jeder Einzelne tun?",
    activityPoints: ["Beschreiben Sie Möglichkeiten für klimafreundliches Leben.", "Nennen Sie Vorteile und Nachteile.", "Beschreiben Sie die Situation in Ihrem Land.", "Sagen Sie, welche Maßnahme für Sie persönlich realistisch ist."],
    answerStructure: ["Das Thema Klimaschutz kurz vorstellen.", "Beispiele aus Energie, Verkehr, Konsum und Ernährung nennen.", "Vorteile und Nachteile erklären.", "Die Situation im eigenen Land beschreiben.", "Eine persönliche Meinung und einen Schluss formulieren."],
    usefulPhrases: ["In meinem Land kann man klimafreundlich leben, indem man ...", "Ein Vorteil ist, dass ...", "Ein Nachteil ist jedoch, dass ...", "Für viele Menschen ist es schwierig, weil ...", "Trotzdem kann jeder einen kleinen Beitrag leisten."],
  },
  writing: getB1WritingTask(28),
  reading: getB1ReadingTask(28),
  listening: {
    title: "Bearbeiten Sie den Hörtest und kontrollieren Sie Ihre Antworten selbst.",
    instructions: "Hören Sie zuerst aufmerksam zu. Kontrollieren Sie Ihre Antworten danach mit dem Video.",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Headphones for climate listening comprehension",
    videoId: "IGIxBJA222o",
    externalUrl: "https://youtu.be/IGIxBJA222o?list=PLos_fDJ_B3W0jhPa-8s_100ALd-HdTcmt",
    selfCheckText: "This Hören part is self-check practice. The school officially evaluates Lesen and Schreiben. Mark your own listening result after watching the video.",
  },
  submitWritingDescription: "Paste your final opinion text about climate-friendly living.",
  submitReadingDescription: "Paste your seven reading answer letters.",
};

export default function B1Day28KlimafreundlichLebenWorkbookPage() {
  return <B1StandardWorkbookPage config={B1_DAY28_KLIMAFREUNDLICH_LEBEN_WORKBOOK_CONFIG} />;
}
