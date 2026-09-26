import React from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";
import { getB1WritingTask } from "../data/b1WritingTasks";

const config = {
  day: 10,
  chapter: "4.10",
  assignmentKey: "B1-4.10",
  workbookId: "B1Day10DigitaleAuszeitSelbstfuersorge",
  title: "Digitale Auszeit und Selbstfürsorge",
  subtitle: "Choose Teil 1–4, Ref or Submit. Teil 1 is group practice, Teil 4 is self-check, and only Schreiben and Lesen are submitted.",
  heroImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "A calm outdoor moment away from digital devices",
  speaking: {
    question: "Brauchen wir in der modernen Welt digitale Auszeiten für unsere Gesundheit?",
    instructions: "Diskutieren Sie, warum digitale Auszeiten wichtig sein können, welche Herausforderungen es gibt und wie Selbstfürsorge im Alltag gelingen kann. Nennen Sie Vor- und Nachteile, persönliche Erfahrungen und konkrete Strategien.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "People relaxing outdoors without using a phone",
    ideaTitle: "Themen und Leitfragen für die Gruppendiskussion",
    ideaIntro: "Wählen Sie die Punkte, die zu Ihrer Präsentation passen. Sie müssen nicht jeden Punkt einzeln behandeln.",
    ideaGroups: [
      {
        title: "Warum ist eine digitale Auszeit wichtig?",
        items: [
          "Weniger Bildschirmzeit: Augen und Geist entspannen",
          "Bessere Schlafqualität: kein Handy direkt vor dem Schlafen",
          "Mehr echte soziale Kontakte mit Familie und Freunden",
          "Mehr Zeit für Sport, Musik, Lesen, Kunst und andere Hobbys",
          "Weniger Stress durch weniger ständige Erreichbarkeit",
        ],
      },
      {
        title: "Selbstfürsorge im Alltag",
        items: [
          "Körperliche Gesundheit: ausgewogene Ernährung, Bewegung und genug Schlaf",
          "Mentale Gesundheit: Meditation, Achtsamkeit und positives Denken",
          "Zeit in der Natur: spazieren gehen und frische Luft genießen",
          "Persönliche Entwicklung: Bücher lesen und neue Fähigkeiten lernen",
          "Kreativität fördern: malen, schreiben oder Musik machen",
        ],
      },
      {
        title: "Herausforderungen",
        items: [
          "Handy-Sucht und das ständige Kontrollieren von Nachrichten",
          "Abhängigkeit von digitalen Medien in Arbeit und Studium",
          "Soziale Medien und FOMO – die Angst, etwas zu verpassen",
          "Gewohnheiten zu ändern braucht Disziplin und Geduld",
        ],
      },
      {
        title: "Strategien für eine erfolgreiche Auszeit",
        items: [
          "Feste Zeiten ohne Handy, zum Beispiel nach 20 Uhr",
          "Social-Media-Apps für einige Tage deaktivieren",
          "Handyfreie Zonen im Schlafzimmer und beim Essen einrichten",
          "Einen Digital-Detox-Tag pro Woche planen",
          "Freunde und Familie bewusst persönlich treffen",
        ],
      },
      {
        title: "Gesunder Umgang mit Technik",
        items: [
          "Bildschirmzeit beobachten und schrittweise reduzieren",
          "Unwichtige Benachrichtigungen ausschalten",
          "Blaulichtfilter nutzen und die Augen schützen",
          "Regelmäßige Pausen bei der Bildschirmarbeit einplanen",
          "Medien bewusst auswählen, zum Beispiel ruhige Musik oder Podcasts",
        ],
      },
    ],
    activityTitle: "Impulstext",
    activityIntro: "In der heutigen schnelllebigen Welt ist es immer schwieriger, Zeit für sich selbst zu finden. Zwischen Arbeit, Familie und anderen Verpflichtungen bleibt oft wenig Raum für persönliche Auszeiten. Doch es ist wichtig, sich regelmäßig Zeit für sich zu nehmen, damit Körper und Geist sich erholen können. Ein Spaziergang, das Lesen eines Buches oder ein paar Minuten Stille können Stress abbauen und neue Energie geben.",
    discussionQuestions: [
      "Haben Sie schon einmal eine digitale Auszeit gemacht?",
      "Wie fühlt es sich an, das Handy für einen Tag auszuschalten?",
      "Welche Alternativen gibt es zur Handynutzung?",
      "Wie kann man Selbstfürsorge realistisch in den Alltag integrieren?",
    ],
    answerStructure: [
      "Einleitung: Thema und Fragestellung vorstellen.",
      "Argumente dafür nennen und begründen.",
      "Argumente dagegen oder praktische Schwierigkeiten erklären.",
      "Die eigene Meinung deutlich machen und ein Beispiel geben.",
      "Die wichtigsten Punkte zusammenfassen und mit einem Abschlusssatz enden.",
    ],
    usefulPhrases: [
      "Eine digitale Auszeit ist wichtig, weil …",
      "Je weniger Zeit man am Bildschirm verbringt, desto …",
      "Im Vergleich zu einem normalen Arbeitstag …",
      "Einerseits hilft das Smartphone im Alltag, andererseits …",
      "Am wichtigsten ist für mich, dass …",
      "Zusammenfassend bin ich der Meinung, dass …",
    ],
  },
  writing: getB1WritingTask(10),
  reading: getB1ReadingTask(10),
  listening: {
    title: "Hören Sie den Beitrag über Zeit für sich und kontrollieren Sie Ihre Antworten selbst.",
    instructions: "Read the questions first. Listen carefully, answer all five questions and check your own work afterwards.",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Headphones for a listening exercise about self-care",
    embedUrl: "https://drive.google.com/file/d/1oU9BMq28aRoX5LKk7huwo5lP9z6lwhB0/preview",
    externalUrl: "https://drive.google.com/file/d/1oU9BMq28aRoX5LKk7huwo5lP9z6lwhB0/view?usp=sharing",
    videoTitle: "B1 Day 10 Hören · Zeit für sich und Selbstfürsorge",
    selfCheckText: "Complete the listening exercise independently and mark your own answers. Teil 4 is self-check; only Teil 2 Schreiben and Teil 3 Lesen are submitted for tutor evaluation.",
    questions: [
      { stem: "Was ist laut dem Hörtext ein häufiges Problem in unserer Gesellschaft?", options: ["A) Zu wenig Arbeit", "B) Zu viel Freizeit", "C) Stress und Überarbeitung", "D) Zu viel Schlaf"] },
      { stem: "Wie fühlen sich 70 Prozent der Befragten nach einer Pause?", options: ["A) Müder", "B) Produktiver", "C) Gestresster", "D) Unmotiviert"] },
      { stem: "Wie wirkt sich Zeit für sich auf zwischenmenschliche Beziehungen aus?", options: ["A) Sie verbessert die Kommunikation und Geduld.", "B) Sie führt zu mehr Konflikten.", "C) Sie verschlechtert die Beziehungen.", "D) Sie hat keinen Einfluss."] },
      { stem: "Was berichten Menschen mit einem gesunden Verhältnis zwischen Arbeit und Freizeit?", options: ["A) Sie haben häufiger Kopfschmerzen.", "B) Sie haben weniger Schlafprobleme und Rückenschmerzen.", "C) Sie sind weniger produktiv.", "D) Sie sind öfter krank."] },
      { stem: "Was kann eine negative Folge von zu viel Zeit allein sein?", options: ["A) Verbesserte Gesundheit", "B) Mehr Kreativität", "C) Gefühle der Einsamkeit und Isolation", "D) Bessere Beziehungen zu Freunden und Familie"] },
    ],
  },
  submitWritingDescription: "Paste your final 80–100 word opinion text about digital detox and self-care.",
  submitReadingDescription: "Paste your seven reading answer letters.",
};

export default function B1Day10DigitaleAuszeitWorkbookPage() {
  return <B1StandardWorkbookPage config={config} />;
}
