import React from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";
import { getB1WritingTask } from "../data/b1WritingTasks";
import { getB1ReadingTask } from "../data/b1ReadingTasks";

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
    title: "Podcast · Wie lernt man am besten?",
    instructions: "Hören Sie den Podcast aufmerksam. Lesen Sie die fünf Fragen und wählen Sie jeweils A, B, C oder D. Reichen Sie danach nur die fünf Antwortbuchstaben im Submit-Tab ein.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Podcast über effektives Deutschlernen",
    videoTitle: "B1 Day 17 Podcast Wie lernt man am besten",
    submitRequired: true,
    selfCheckText: "Hören ist Teil dieser Übung. Reichen Sie Ihre fünf Antwortbuchstaben im Submit-Tab ein.",
    transcript: `Anna: Hallo und willkommen zu "Deutsch einfach"! Ich bin Anna.

Ben: Hallo Anna, und hallo an alle Deutschlernenden! Heute sprechen wir über eine wichtige Frage: Wie lernt man am besten?

Anna: Genau, Ben. Ich lerne seit zwei Jahren Deutsch, aber manchmal weiß ich nicht: Mache ich es richtig?

Ben: Das ist ganz normal. Mein erster Tipp: Lerne jeden Tag, auch wenn es nur zwanzig Minuten sind. Das ist besser als einmal pro Woche drei Stunden.

Anna: Wirklich? Ich dachte, lange Lernzeiten sind besser.

Ben: Nein. Das Gehirn braucht Wiederholung. Wenn du jeden Tag etwas wiederholst, bleiben die Wörter länger im Kopf.

Anna: Und was ist mit Vokabeln? Ich schreibe sie immer auf Karten, aber ich vergesse sie schnell.

Ben: Lerne Wörter nie allein, sondern in ganzen Sätzen. Zum Beispiel nicht nur "der Termin", sondern: "Ich habe morgen einen Termin beim Arzt."

Anna: Das ist eine tolle Idee! Und wie kann ich besser sprechen?

Ben: Sprich so viel wie möglich! Such dir einen Lernpartner oder sprich laut mit dir selbst. Fehler sind kein Problem, denn aus Fehlern lernt man.

Anna: Hören ist auch wichtig, oder? Ich höre gern Podcasts, so wie diesen hier.

Ben: Genau! Höre jeden Tag etwas auf Deutsch: Musik, Podcasts oder Filme. Und lies auch kurze Texte.

Anna: Okay, also zusammengefasst: jeden Tag lernen, Wörter in Sätzen lernen, viel sprechen und viel hören.

Ben: Perfekt! Und das Wichtigste: Hab Geduld und Spaß dabei.

Anna: Vielen Dank fürs Zuhören! Bis zur nächsten Folge. Tschüss!

Ben: Tschüss!`,
    questions: [
      { stem: "1. Wie sollte man laut Ben lernen?", options: ["A) Einmal pro Woche drei Stunden", "B) Jeden Tag, auch nur zwanzig Minuten", "C) Nur vor der Prüfung", "D) Nur am Wochenende"] },
      { stem: "2. Warum ist tägliches Lernen besser?", options: ["A) Weil man dann weniger Zeit braucht", "B) Weil das Gehirn Wiederholung braucht", "C) Weil Anna das sagt", "D) Weil Lernen am Abend leichter ist"] },
      { stem: "3. Wie soll man Vokabeln lernen?", options: ["A) Nur einzelne Wörter auf Karten", "B) Nur mit dem Wörterbuch", "C) In ganzen Sätzen", "D) Gar nicht, man lernt sie automatisch"] },
      { stem: "4. Was empfiehlt Ben, um besser zu sprechen?", options: ["A) Nur leise lesen", "B) Fehler immer vermeiden", "C) Nur Grammatik üben", "D) Viel sprechen, auch laut mit sich selbst"] },
      { stem: "5. Was ist laut Ben das Wichtigste beim Lernen?", options: ["A) Ein teures Buch", "B) Geduld und Spaß", "C) Perfekte Aussprache", "D) Jeden Tag drei Stunden Zeit"] },
    ],
    steps: [
      "Lesen Sie zuerst die fünf Fragen.",
      "Hören Sie den Podcast einmal komplett.",
      "Hören Sie wichtige Stellen ein zweites Mal.",
      "Schreiben Sie nur die fünf Antwortbuchstaben in den Submit-Tab.",
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
