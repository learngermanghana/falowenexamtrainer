import React from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";
import { getB1WritingTask } from "../data/b1WritingTasks";

export const B1_DAY23_ERSTES_DATE_WORKBOOK_CONFIG = {
  day: 23,
  chapter: "7.23",
  assignmentKey: "B1-7.23",
  workbookId: "B1Day23ErstesDate",
  title: "Erstes Date – Typische Situationen",
  heroImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "Two people meeting and talking on a first date",
  speaking: {
    question: "Was sind typische Situationen bei einem ersten Date, und wie verhält man sich am besten?",
    instructions:
      "Beschreiben Sie verschiedene Möglichkeiten für ein erstes Treffen. Nennen Sie Vor- und Nachteile, zum Beispiel Restaurant versus Spaziergang. Bewerten Sie, was für ein gutes erstes Date wichtig ist. Beschreiben Sie eine Möglichkeit genauer und sagen Sie, warum Sie sie wählen würden.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Two people meeting for a first date",
    ideaTitle: "Zentrales Thema: Erstes Date – Typische Situationen",
    ideaIntro:
      "In this chapter, we'll engage in group exercises discussing the six main branches and their typical situations.",
    ideaGroups: [
      {
        title: "1. Vorbereitung",
        items: [
          "Kleidung auswählen",
          "Pünktlich sein",
          "Nervosität oder Vorfreude",
          "Blumen oder ein kleines Geschenk mitbringen",
        ],
      },
      {
        title: "2. Ort des Treffens",
        items: [
          "Café oder Restaurant",
          "Spaziergang im Park",
          "Kino oder Museum",
          "Öffentliche Orte für Sicherheit",
        ],
      },
      {
        title: "3. Gesprächsthemen",
        items: [
          "Hobbys und Interessen",
          "Familie und Freunde",
          "Beruf oder Studium",
          "Reisen und Zukunftspläne",
          "Was man mag oder nicht mag",
        ],
      },
      {
        title: "4. Gefühle und Eindrücke",
        items: [
          "Aufregung",
          "Neugier",
          "Unsicherheit",
          "Sympathie oder Desinteresse",
          "Überraschung – positiv oder negativ",
        ],
      },
      {
        title: "5. Verhalten und Höflichkeit",
        items: [
          "Zuhören",
          "Fragen stellen",
          "Freundlich und respektvoll sein",
          "Nicht zu privat werden",
          "Handy weglegen",
        ],
      },
      {
        title: "6. Möglicher Verlauf",
        items: [
          "Das Date war schön: ein Wiedersehen verabreden",
          "Kein Interesse: höflich bleiben",
          "Gemeinsame Interessen: ein längeres Gespräch führen",
          "Missverständnisse oder unangenehme Momente",
        ],
      },
    ],
    activityTitle: "Anweisung für die Gruppenpraxis",
    activityOrdered: true,
    activityPoints: [
      "Beschreiben Sie verschiedene Möglichkeiten für ein erstes Treffen.",
      "Nennen Sie Vor- und Nachteile, zum Beispiel Restaurant versus Spaziergang.",
      "Bewerten Sie, was für ein gutes erstes Date wichtig ist.",
      "Beschreiben Sie eine Möglichkeit genauer und sagen Sie, warum Sie sie wählen würden.",
    ],
    answerStructure: [
      "Das Thema und eine typische Situation bei einem ersten Date vorstellen.",
      "Verschiedene Treffpunkte und Möglichkeiten beschreiben.",
      "Vor- und Nachteile vergleichen.",
      "Erklären, welches Verhalten und welche Höflichkeit wichtig sind.",
      "Eine Möglichkeit genauer beschreiben und die eigene Wahl begründen.",
    ],
    usefulPhrases: [
      "Für ein erstes Date würde ich … wählen.",
      "Ein Vorteil davon ist, dass …",
      "Ein Nachteil könnte sein, dass …",
      "Im Vergleich zu einem Restaurant ist ein Spaziergang …",
      "Für ein gutes erstes Date ist wichtig, dass …",
      "Ich würde diese Möglichkeit wählen, weil …",
    ],
  },
  writing: getB1WritingTask(23),
  reading: getB1ReadingTask(23),
  listening: {
    status: "planned",
    title: "Hören material for Day 23 will be added here.",
    instructions:
      "The listening section is already prepared structurally. Add the video, instructions and self-check questions when the audio material is available.",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Headphones reserved for future listening content",
  },
  submitWritingDescription: "Paste your final 80–100 word opinion text.",
  submitReadingDescription: "Paste your seven reading answer letters.",
};

export default function B1Day23ErstesDateWorkbookPage() {
  return <B1StandardWorkbookPage config={B1_DAY23_ERSTES_DATE_WORKBOOK_CONFIG} />;
}
