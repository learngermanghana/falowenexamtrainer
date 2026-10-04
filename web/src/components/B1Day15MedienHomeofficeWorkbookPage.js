import React from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";
import { getB1WritingTask } from "../data/b1WritingTasks";
import { getB1ReadingTask } from "../data/b1ReadingTasks";

export const B1_DAY15_MEDIEN_HOMEOFFICE_WORKBOOK_CONFIG = {
  day: 15,
  chapter: "5.15",
  assignmentKey: "B1-5.15",
  workbookId: "B1Day15MedienHomeoffice",
  title: "Medien und Arbeiten im Homeoffice",
  subtitle:
    "Diskutiere digitale Medien im Homeoffice. Teil 1 ist Gruppenpraxis; Teil 2, Teil 3 und Teil 4 reichst du über den Submit-Tab ein.",
  heroImage:
    "https://images.unsplash.com/photo-1584931423298-c576fda54bd2?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "Person arbeitet mit Laptop im Homeoffice",
  speaking: {
    question:
      "Welche Vorteile und Nachteile hat die Arbeit im Homeoffice mit digitalen Medien?",
    instructions:
      "Bereite eine kurze B1-Präsentation vor. Erkläre die Rolle digitaler Medien, nenne Vor- und Nachteile des Homeoffice und begründe deine eigene Meinung.",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Digitale Zusammenarbeit und Videokonferenz",
    ideaTitle: "Zentrales Thema: Medien und Arbeiten im Homeoffice",
    ideaIntro:
      "Nutze die Themenfelder, um eine klare Präsentation über digitale Zusammenarbeit, Medienkompetenz und die Zukunft des Homeoffice vorzubereiten.",
    ideaGroups: [
      {
        title: "1. Medien im Homeoffice",
        items: [
          "Kommunikation: E-Mails, Videoanrufe und Chat-Programme wie Zoom, Teams oder Slack.",
          "Organisation: Online-Kalender, To-do-Listen und Projektmanagement-Tools wie Trello oder Asana.",
          "Information: Online-Nachrichten, Fachartikel und Blogs.",
          "Ablenkung oder Motivation: Musik und Podcasts während der Arbeit.",
        ],
      },
      {
        title: "2. Vorteile des Homeoffice",
        items: [
          "Flexibilität: von überall arbeiten und die Zeit selbstständiger einteilen.",
          "Kein Pendeln: Zeit und Geld sparen.",
          "Bessere Konzentration: weniger Ablenkung durch Kolleginnen und Kollegen.",
          "Bessere Work-Life-Balance: mehr Zeit für Familie und Hobbys.",
        ],
      },
      {
        title: "3. Nachteile des Homeoffice",
        items: [
          "Weniger soziale Kontakte und keine direkte Interaktion mit Kolleginnen und Kollegen.",
          "Bewegungsmangel, weil der Arbeitsweg fehlt.",
          "Ablenkung zu Hause durch Familie, Haushalt oder Lärm.",
          "Technische Probleme mit Internet, Geräten oder Software.",
        ],
      },
      {
        title: "4. Medienkompetenz und digitale Tools",
        items: [
          "Wie gut sind meine digitalen Fähigkeiten?",
          "Welche neuen Programme muss man lernen?",
          "Datenschutz beachten und sichere Passwörter verwenden.",
          "Phishing erkennen und persönliche Daten schützen.",
        ],
      },
      {
        title: "5. Eigene Meinung",
        items: [
          "Arbeitest du lieber im Homeoffice oder im Büro? Warum?",
          "Glaubst du, dass Homeoffice die Zukunft ist?",
          "Welche Medien und Programme helfen dir beim Arbeiten?",
        ],
      },
    ],
    exampleTitle: "Beispielantwort",
    exampleSteps: [
      "Ich finde Homeoffice gut, weil ich mir meine Zeit flexibel einteilen kann.",
      "Ich spare viel Zeit, weil ich nicht zur Arbeit fahren muss.",
      "Aber manchmal fehlt mir der Kontakt mit meinen Kolleginnen und Kollegen.",
      "Ich denke, eine Mischung aus Homeoffice und Büro ist die beste Lösung.",
    ],
    activityTitle: "Schlüsselwörter für deine Präsentation",
    activityPoints: [
      "Begrüßung und Thema: Ich möchte heute über die Arbeit im Homeoffice mit digitalen Medien sprechen.",
      "Inhalt und Struktur: Homeoffice bedeutet, dass man von zu Hause aus arbeitet. Digitale Medien spielen dabei eine wichtige Rolle.",
      "Persönliche Erfahrung: Ich habe selbst Homeoffice-Erfahrungen gemacht oder kenne jemanden, der im Homeoffice arbeitet.",
      "Situation im Heimatland: In meinem Heimatland ist Homeoffice weit verbreitet / nicht sehr üblich, weil ...",
      "Vor- und Nachteile: Ein Vorteil ist ... Ein Nachteil ist ...",
      "Schluss und Dank: Zusammenfassend kann ich sagen ... Danke fürs Zuhören!",
    ],
    activityOrdered: true,
    discussionQuestions: [
      "Welche digitalen Tools benutzt du am häufigsten?",
      "Wie kann man Ablenkung und ständige Erreichbarkeit reduzieren?",
      "Welche Mischung aus Büro und Homeoffice wäre für dich ideal?",
    ],
    answerStructure: [
      "Begrüße dein Publikum und nenne das Thema.",
      "Erkläre, welche digitalen Medien im Homeoffice wichtig sind.",
      "Nenne mindestens zwei Vorteile und zwei Nachteile.",
      "Beschreibe eine persönliche Erfahrung oder die Situation in deinem Heimatland.",
      "Gib deine Meinung und schließe mit einem kurzen Fazit.",
    ],
    usefulPhrases: [
      "Homeoffice bedeutet, dass ...",
      "Digitale Medien werden benutzt, um ...",
      "Ein großer Vorteil ist, dass ...",
      "Ein Nachteil besteht darin, dass ...",
      "Einerseits ..., andererseits ...",
      "Meiner Meinung nach sollte ...",
      "Zusammenfassend kann ich sagen, dass ...",
    ],
  },
  writing: getB1WritingTask(15),
  reading: getB1ReadingTask(15),
  listening: {
    title: "Hören Sie das Interview über Homeoffice und digitale Medien und beantworten Sie die fünf Fragen.",
    instructions: "Lesen Sie zuerst die Fragen. Hören Sie dann aufmerksam auf Ellens Erfahrungen, die verwendeten Medien und ihre praktischen Tipps.",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Hörübung über Homeoffice und digitale Medien",
    audioKey: "audio/day_15.mp3",
    videoTitle: "B1 Day 15 Medien und Arbeiten im Homeoffice Hören",
    submitRequired: true,
    selfCheckText: "Hören ist Teil dieser Aufgabe. Reichen Sie Ihre fünf Antwortbuchstaben im Submit-Tab ein.",
    questions: [
      {
        stem: "Welchen Vorteil des Homeoffice nennt Ellen?",
        options: [
          "a) Sie verdient im Homeoffice mehr Geld.",
          "b) Sie spart Zeit und kann ihren Tag flexibler planen.",
          "c) Sie hat dort mehr Besprechungen.",
          "d) Sie muss keine Pausen machen.",
        ],
      },
      {
        stem: "Welche Nachteile des Homeoffice beschreibt Ellen?",
        options: [
          "a) Sie muss häufiger pendeln und länger arbeiten.",
          "b) Sie hat zu viele persönliche Treffen.",
          "c) Sie hat weniger Kontakt zu den Kollegen und kann nach der Arbeit schwer abschalten.",
          "d) Sie kann digitale Medien nicht benutzen.",
        ],
      },
      {
        stem: "Welche Medien nutzt Ellens Team für die Zusammenarbeit?",
        options: [
          "a) Videokonferenzen für große Besprechungen und einen Chat für kurze Fragen.",
          "b) Nur E-Mails für alle Gespräche.",
          "c) Ausschließlich Telefonate.",
          "d) Soziale Medien für Besprechungen.",
        ],
      },
      {
        stem: "Wie prüft Ellen Informationen aus dem Internet?",
        options: [
          "a) Sie vertraut immer der ersten Webseite.",
          "b) Sie fragt nur Kolleginnen und Kollegen.",
          "c) Sie vergleicht mehrere Quellen.",
          "d) Sie liest keine Online-Nachrichten.",
        ],
      },
      {
        stem: "Welchen praktischen Rat gibt Ellen für gutes Arbeiten im Homeoffice?",
        options: [
          "a) Den ganzen Tag am Küchentisch arbeiten und Pausen vermeiden.",
          "b) Einen festen Arbeitsplatz haben, feste Pausen machen und Kollegen auch persönlich treffen.",
          "c) Nach Feierabend weiter erreichbar bleiben.",
          "d) Möglichst alle Aufgaben allein erledigen.",
        ],
      },
    ],
    steps: [
      "Hören Sie das Interview einmal vollständig.",
      "Lesen Sie die Fragen und Antwortmöglichkeiten.",
      "Hören Sie wichtige Stellen ein zweites Mal.",
      "Schreiben Sie Ihre fünf Antwortbuchstaben in den Submit-Tab.",
    ],
  },
  submitListening: true,
  submitTitle: "Submit Teil 2, Teil 3 and Teil 4.",
  submitNote:
    "Teil 1 ist Gruppenpraxis. Reiche Schreiben, Lesen und Hören für die Bewertung ein.",
  submitInstructions:
    "Füge deinen Meinungsbeitrag sowie die sieben Lese- und fünf Hörantworten in das Formular ein.",
  submitWritingDescription:
    "Paste your opinion text about media and working from home.",
  submitReadingDescription: "Paste your seven reading answer letters.",
  submitListeningDescription: "Paste your five listening answer letters.",
};

export default function B1Day15MedienHomeofficeWorkbookPage() {
  return (
    <B1StandardWorkbookPage
      config={B1_DAY15_MEDIEN_HOMEOFFICE_WORKBOOK_CONFIG}
    />
  );
}
