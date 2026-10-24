import React from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";
import { getB1WritingTask } from "../data/b1WritingTasks";
import { getB1ReadingTask } from "../data/b1ReadingTasks";

const config = {
  day: 25,
  chapter: "8.25",
  assignmentKey: "B1-8.25",
  workbookId: "B1Day25OnlineShoppingRightsRisks",
  title: "Online einkaufen – Rechte und Risiken",
  heroImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "Person shopping online with a laptop",
  speaking: {
    question: "Welche Vorteile und Risiken hat Online-Shopping, und wie kann man sicher einkaufen?",
    instructions: "Sprich über Gründe für Online-Shopping, Verbraucherrechte, typische Probleme und sichere Bezahl- und Rückgabemöglichkeiten.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Online shopping and digital payment",
    ideaTitle: "Brain Map: Online einkaufen",
    ideaGroups: [
      { title: "Gründe für Online-Shopping", items: ["Rund um die Uhr einkaufen", "Große Auswahl", "Preise vergleichen", "Lieferung nach Hause", "Oft günstiger"] },
      { title: "Typische Produkte", items: ["Kleidung", "Elektronik", "Bücher", "Lebensmittel", "Möbel und Haushaltsartikel"] },
      { title: "Rechte beim Online-Kauf", items: ["Widerrufsrecht", "Rücksendung", "Geld zurück", "Klare Informationen zu Preis und Lieferzeit", "Garantie"] },
      { title: "Risiken und Probleme", items: ["Beschädigte oder falsche Ware", "Lange Lieferzeit", "Fake-Shops", "Datenschutzprobleme", "Schwierige Rückgabe"] },
      { title: "Sichere Shops erkennen", items: ["Gütesiegel", "Kundenbewertungen", "Impressum", "HTTPS", "Sichere Bezahlmethoden"] },
      { title: "Sicher einkaufen", items: ["Bei bekannten Anbietern bestellen", "Zahlungsbestätigung speichern", "Preise vergleichen", "Rückgabebedingungen lesen", "Persönliche Daten schützen"] },
    ],
    activityTitle: "Gemeinsam einen sicheren Online-Einkauf planen",
    activityIntro: "Plant einen Online-Einkauf und entscheidet gemeinsam:",
    activityPoints: [
      "Was möchtet ihr kaufen?",
      "Welche Webseite oder App nutzt ihr?",
      "Wie bezahlt ihr sicher?",
      "Welche Informationen prüft ihr vor der Bestellung?",
      "Was macht ihr bei beschädigter oder falscher Ware?",
    ],
    answerStructure: [
      "Das Thema Online-Shopping vorstellen.",
      "Wichtige Vorteile beschreiben.",
      "Risiken und Verbraucherrechte erklären.",
      "Ein persönliches Beispiel oder eine typische Reklamation nennen.",
      "Tipps für sicheres Einkaufen geben und die Meinung zusammenfassen.",
    ],
    usefulPhrases: ["Ich möchte die Ware zurückgeben.", "Das Produkt ist beschädigt angekommen.", "Wie funktioniert die Rücksendung?", "Ich möchte mein Geld zurück.", "Könnten Sie mir bitte Ersatz schicken?"],
  },
  writing: getB1WritingTask(25),
  reading: getB1ReadingTask(25),
  submitWritingDescription: "Write your approx. 80-word opinion for the online-shopping discussion.",
  submitReadingDescription: "Submit the seven reading letters in the form 1A, 2B, 3C …",
};

export default function B1Day25OnlineShoppingRightsRisksWorkbookPage() {
  return <B1StandardWorkbookPage config={config} />;
}
