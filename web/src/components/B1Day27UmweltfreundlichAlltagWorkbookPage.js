import React from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";
import { getB1WritingTask } from "../data/b1WritingTasks";

export const B1_DAY27_UMWELTFREUNDLICH_ALLTAG_WORKBOOK_CONFIG = {
  day: 27,
  chapter: "10.27",
  assignmentKey: "B1-10.27",
  workbookId: "B1Day27UmweltfreundlichAlltag",
  title: "Umweltfreundlich im Alltag",
  heroImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "Eco-friendly daily choices",
  speaking: {
    question: "Plant zusammen, wie ihr euren Alltag umweltfreundlicher gestalten könnt.",
    instructions: "Sprechen Sie über umweltfreundliche Möglichkeiten zu Hause, beim Einkaufen, unterwegs, in Arbeit oder Schule und im Gespräch mit anderen.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Eco-friendly everyday life",
    ideaTitle: "Umweltfreundlich im Alltag",
    ideaIntro: "In this chapter, we'll engage in group exercises discussing practical ways to live more environmentally friendly every day.",
    ideaGroups: [
      { title: "Zuhause", items: ["Energie sparen: LED-Lampen, Geräte ausschalten und Heizung richtig einstellen", "Wasser sparen: kurz duschen und Wasserhahn beim Zähneputzen zudrehen", "Müll trennen: Papier, Plastik, Biomüll, Restmüll und Glascontainer nutzen", "Umweltfreundliche Produkte kaufen: Bio-Produkte, Recyclingpapier und Nachfüllpackungen"] },
      { title: "Unterwegs", items: ["Zu Fuß gehen oder Fahrrad fahren", "Öffentliche Verkehrsmittel benutzen", "Fahrgemeinschaften bilden", "Weniger Auto fahren"] },
      { title: "Einkaufen", items: ["Stofftaschen statt Plastiktüten benutzen", "Regionale und saisonale Produkte kaufen", "Weniger Verpackung wählen", "Keine Einwegprodukte kaufen"] },
      { title: "Arbeit / Schule", items: ["Weniger Papier drucken", "Digital arbeiten", "Papier beidseitig nutzen", "Wiederverwendbare Flaschen und Becher benutzen"] },
      { title: "Bewusstsein und Information", items: ["Umweltbildung durch Dokumentationen und Bücher", "Mit anderen über Umweltschutz sprechen", "Kindern ein Vorbild sein"] },
    ],
    activityTitle: "Thema: Umweltfreundlich im Alltag – Gemeinsam planen",
    activityIntro: "Plant zusammen, wie ihr euren Alltag umweltfreundlicher gestalten könnt.",
    activityOrdered: true,
    activityPoints: ["Was kann man zu Hause tun?", "Wie kann man umweltfreundlich einkaufen?", "Wie kann man umweltfreundlich unterwegs sein?", "Was fällt euch schwer? Was klappt gut?"],
    answerStructure: ["Das Thema vorstellen.", "Möglichkeiten zu Hause beschreiben.", "Einkaufen und Mobilität erklären.", "Schwierigkeiten und Vorteile vergleichen.", "Eine realistische Lösung formulieren."],
    usefulPhrases: ["Zu Hause kann man umweltfreundlicher leben, indem man ...", "Beim Einkaufen ist es sinnvoll, ...", "Unterwegs könnte man öfter ...", "Für mich ist schwierig, dass ...", "Gut klappt schon, dass ..."],
  },
  writing: getB1WritingTask(27),
  reading: getB1ReadingTask(27),
  listening: {
    title: "Bearbeiten Sie den Hörtest und kontrollieren Sie Ihre Antworten selbst.",
    instructions: "Hören Sie zuerst aufmerksam zu. Kontrollieren Sie Ihre Antworten danach mit dem Video.",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Headphones for listening practice",
    videoId: "jzm-MnWC7I0",
    externalUrl: "https://youtu.be/jzm-MnWC7I0",
    selfCheckText: "This Hören part is self-check practice. The school officially evaluates Lesen and Schreiben. Mark your own listening result after watching the video.",
  },
  submitWritingDescription: "Paste your final opinion text about eco-friendly living.",
  submitReadingDescription: "Paste your seven reading answer letters.",
};

export default function B1Day27UmweltfreundlichAlltagWorkbookPage() {
  return <B1StandardWorkbookPage config={B1_DAY27_UMWELTFREUNDLICH_ALLTAG_WORKBOOK_CONFIG} />;
}
