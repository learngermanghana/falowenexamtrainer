import React from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";
import { getB1WritingTask } from "../data/b1WritingTasks";

export const B1_DAY17_WIE_LERNT_MAN_AM_BESTEN_WORKBOOK_CONFIG = {
  day: 17,
  chapter: "5.17",
  assignmentKey: "B1-5.17",
  workbookId: "B1Day17WieLerntManAmBesten",
  title: "Wie lernt man am besten?",
  subtitle: "Vergleiche Lernmethoden, Lernumgebung, Zeitmanagement und Motivation. Teil 1 ist Gruppenpraxis; Teil 2, Teil 3 und Teil 4 bereitest du für die Abgabe vor.",
  heroImage: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "Effektiv lernen mit Büchern und Laptop",
  speaking: {
    question: "Was hilft dir, effektiv zu lernen?",
    instructions: "Bereite eine kurze B1-Präsentation vor. Erkläre deine besten Lernmethoden, deine Lernumgebung, dein Zeitmanagement und deine persönliche Erfahrung.",
    image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Schüler lernt effektiv",
    ideaTitle: "Zentrales Thema: Wie lernt man am besten?",
    ideaIntro: "In this chapter, we'll engage in group exercises discussing learning methods, learning environment, time management, motivation and personal learning strategies.",
    ideaGroups: [
      {
        title: "1. Lernmethoden",
        items: [
          "Notizen machen: wichtigste Informationen aufschreiben.",
          "Hörbücher oder Podcasts: zuhören und wiederholen.",
          "Texte lesen und markieren: wichtige Stellen hervorheben.",
          "Mit anderen sprechen oder in Gruppen lernen: Austausch mit Freunden oder Lehrern.",
          "Lernen mit Apps und Spielen: digitale Methoden nutzen.",
        ],
      },
      {
        title: "2. Lernumgebung",
        items: [
          "Ruhiger Arbeitsplatz: wenig Ablenkung.",
          "Gute Beleuchtung und bequemer Stuhl: Konzentration verbessern.",
          "Handy ausschalten: keine Ablenkung durch soziale Medien.",
          "Leise Musik oder Stille: hilft beim Fokussieren.",
        ],
      },
      {
        title: "3. Zeitmanagement",
        items: [
          "Feste Lernzeiten planen: jeden Tag zur gleichen Zeit lernen.",
          "Pausen machen: zum Beispiel Pomodoro-Technik mit 25 Minuten Lernen und 5 Minuten Pause.",
          "Lernziele setzen: Was möchte ich heute erreichen?",
          "Wiederholung einplanen: Gelerntes regelmäßig wiederholen.",
        ],
      },
      {
        title: "4. Motivation und Konzentration",
        items: [
          "Realistische Ziele setzen und kleine Erfolge feiern.",
          "Belohnungen geben: nach dem Lernen eine Pause oder ein kleines Geschenk.",
          "Entspannungsübungen machen: Meditation oder kurze Spaziergänge helfen.",
          "Visuelle Hilfsmittel nutzen: Mindmaps, Diagramme oder Karten.",
        ],
      },
      {
        title: "5. Eigene Erfahrungen und Meinung",
        items: [
          "Welche Lernmethoden funktionieren für dich am besten?",
          "Lernst du lieber allein oder in einer Gruppe? Warum?",
          "Was sind deine größten Herausforderungen beim Lernen?",
        ],
      },
    ],
    exampleTitle: "Beispielantwort",
    exampleSteps: [
      "Ich lerne am besten, wenn ich mir Notizen mache und in einer ruhigen Umgebung bin.",
      "Ich benutze oft die Pomodoro-Technik, um konzentriert zu bleiben.",
      "Außerdem finde ich es hilfreich, mit Freunden über das Thema zu sprechen.",
    ],
    activityTitle: "Struktur deiner Präsentation",
    activityPoints: [
      "Begrüßung und Vorstellung des Themas.",
      "Inhalt und Struktur: Erkläre, worüber du sprechen wirst.",
      "Persönliche Erfahrung: Beschreibe, wie du selbst am besten lernst.",
      "Situation in deinem Heimatland: Erkläre, wie Schüler dort meistens lernen.",
      "Vor- und Nachteile: Nenne Vorteile und Nachteile verschiedener Lernmethoden.",
      "Schluss und Dank: Fasse deine Meinung zusammen und bedanke dich.",
    ],
    activityOrdered: true,
    answerStructure: [
      "Begrüße dein Publikum und nenne das Thema.",
      "Beschreibe zwei oder drei Lernmethoden.",
      "Erkläre, welche Lernumgebung dir hilft.",
      "Sprich über Zeitmanagement, Pausen und Wiederholung.",
      "Nenne Vorteile und Nachteile von Alleinlernen oder Gruppenlernen.",
      "Gib deine persönliche Meinung und schließe mit einem Dank.",
    ],
    usefulPhrases: [
      "Ich lerne am besten, wenn ...",
      "Für mich ist wichtig, dass ...",
      "Eine gute Methode ist, ... zu ...",
      "Ich finde es hilfreich, ...",
      "Ein Vorteil dieser Methode ist, dass ...",
      "Ein Nachteil ist, dass ...",
      "Zusammenfassend kann ich sagen, dass ...",
    ],
  },
  writing: getB1WritingTask(17),
  reading: getB1ReadingTask(17),
  listening: {
    title: "Hören Sie den Text über Lerntechniken und beantworten Sie die fünf Fragen.",
    instructions: "Hören Sie aufmerksam zu. Notieren Sie die richtigen Antwortbuchstaben und reichen Sie sie im Submit-Tab ein.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Digitale Lerntechniken und Konzentration",
    embedUrl: "https://www.youtube-nocookie.com/embed/NCfwHzAHoJI?rel=0&playsinline=1",
    externalUrl: "https://youtu.be/NCfwHzAHoJI",
    videoTitle: "B1 Day 17 Wie lernt man am besten Hören",
    submitRequired: true,
    selfCheckText: "Hören ist Teil dieser Übung. Reichen Sie Ihre fünf Antwortbuchstaben im Submit-Tab ein.",
    questions: [
      { stem: "Was versteht man unter chunking?", options: ["a) Der Lernstoff wird in kleinere Abschnitte aufgeteilt.", "b) Man lernt den Stoff in einem Stück.", "c) Man ignoriert schwierige Themen.", "d) Man lernt alles am Prüfungstag."] },
      { stem: "Warum ist regelmäßiges Wiederholen wichtig?", options: ["a) Es spart Zeit.", "b) Es hilft, den Stoff dauerhaft zu behalten.", "c) Es hilft nur beim Sprachenlernen.", "d) Es verbessert die Prüfungsnoten."] },
      { stem: "Was ist laut dem Hörtext ein wichtiger Faktor beim Lernen?", options: ["a) Die Länge der Lernzeit.", "b) Eine ruhige und aufgeräumte Umgebung.", "c) Das Lernen mit Freunden.", "d) Ein fester Platz in der Bibliothek."] },
      { stem: "Wie kann man den Lernprozess reflektieren?", options: ["a) Indem man schwierige Themen ignoriert.", "b) Indem man sich selbst Fragen zum Gelernten stellt.", "c) Indem man nur stur auswendig lernt.", "d) Indem man den Stoff vor sich hin liest."] },
      { stem: "Was sollte man tun, nachdem man ein Lernziel erreicht hat?", options: ["a) Sofort weiterlernen.", "b) Sich selbst belohnen.", "c) Neue Ziele setzen.", "d) Eine lange Pause machen."] },
    ],
    steps: [
      "Hören Sie den Text einmal komplett.",
      "Lesen Sie die Fragen und Antwortmöglichkeiten.",
      "Hören Sie wichtige Stellen ein zweites Mal.",
      "Schreiben Sie Ihre fünf Antwortbuchstaben in den Submit-Tab.",
    ],
  },
  submitListening: true,
  submitWritingDescription: "Paste your opinion about how to learn best.",
  submitReadingDescription: "Paste your seven reading answer letters.",
  submitListeningDescription: "Paste your five listening answer letters.",
};

export default function B1Day17WieLerntManAmBestenWorkbookPage() {
  return <B1StandardWorkbookPage config={B1_DAY17_WIE_LERNT_MAN_AM_BESTEN_WORKBOOK_CONFIG} />;
}
