import React from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";
import { getB1WritingTask } from "../data/b1WritingTasks";

export const B1_DAY14_TRADITIONELLES_DIGITALES_LERNEN_WORKBOOK_CONFIG = {
  day: 14,
  chapter: "5.14",
  assignmentKey: "B1-5.14",
  workbookId: "B1Day14TraditionellesDigitalesLernen",
  title: "Traditionelles vs. digitales Lernen",
  subtitle: "Vergleiche traditionelle und digitale Lernmethoden. Teil 1 ist Gruppenpraxis; Teil 2, Teil 3 und Teil 4 bereitest du für die Abgabe vor.",
  heroImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "Digitales Lernen am Laptop",
  speaking: {
    question: "Welche Lernmethode findest du besser: traditionelles oder digitales Lernen? Warum?",
    instructions: "Bereite eine kurze B1-Präsentation vor. Vergleiche beide Lernmethoden, nenne Vor- und Nachteile und erkläre deine persönliche Meinung.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Lernende vergleichen Unterricht und digitales Lernen",
    ideaTitle: "Zentrales Thema: Traditionelles vs. Digitales Lernen",
    ideaIntro: "Diese Mindmap hilft B1-Schülern, die Unterschiede zwischen traditionellem und digitalem Lernen zu vergleichen und ihre Vorlieben zu erklären.",
    ideaGroups: [
      {
        title: "1. Lernumgebung",
        items: [
          "Traditionelles Lernen: Schule, Klassenzimmer, Bibliothek, Tafel.",
          "Digitales Lernen: Online-Kurse, Lern-Apps, E-Books, virtuelle Klassenzimmer.",
        ],
      },
      {
        title: "2. Methoden",
        items: [
          "Traditionelles Lernen: Bücher, Papier, Notizen mit der Hand schreiben.",
          "Digitales Lernen: Videos, interaktive Übungen, digitale Präsentationen.",
        ],
      },
      {
        title: "3. Interaktion und Kommunikation",
        items: [
          "Traditionell: direkter Kontakt mit Lehrern und Mitschülern, Gruppenarbeit.",
          "Digital: virtuelle Meetings, Online-Diskussionen, Chats.",
        ],
      },
      {
        title: "4. Flexibilität und Zeitmanagement",
        items: [
          "Traditionell: feste Schulzeiten, strukturierter Tagesablauf.",
          "Digital: selbstbestimmtes Lernen, Lernen von überall.",
        ],
      },
      {
        title: "5. Vor- und Nachteile",
        items: [
          "Traditionelles Lernen – Vorteile: persönlicher Kontakt, bessere Konzentration, soziale Interaktion und Teamarbeit.",
          "Traditionelles Lernen – Nachteile: weniger flexibel, oft teure Schulbücher und Materialien.",
          "Digitales Lernen – Vorteile: Lernen in eigenem Tempo, Zugriff auf viele Online-Ressourcen, Lernen von überall.",
          "Digitales Lernen – Nachteile: technische Probleme und weniger persönliche Kommunikation.",
        ],
      },
      {
        title: "6. Eigene Meinung",
        items: [
          "Welche Methode findest du besser? Warum?",
          "Welche Lernmethode nutzt du häufiger?",
          "Sollten Schulen mehr digitale Methoden einsetzen?",
        ],
      },
    ],
    exampleTitle: "Beispielantwort",
    exampleSteps: [
      "Ich finde digitales Lernen sehr praktisch, weil ich flexibel lernen kann.",
      "Ich kann mir Videos anschauen, wenn ich etwas nicht verstehe, und ich habe viele Informationen im Internet.",
      "Aber traditionelles Lernen ist auch wichtig, weil man direkten Kontakt mit Lehrern und Mitschülern hat.",
      "Ich denke, die beste Lösung ist eine Kombination aus beiden Methoden.",
    ],
    activityTitle: "Schlüsselwörter für deine Präsentation",
    activityPoints: [
      "Begrüßung und Vorstellung des Themas: Ich möchte heute über verschiedene Lernmethoden sprechen und erklären, welche ich besser finde.",
      "Beschreibung der beiden Methoden: Traditionelles Lernen bedeutet ... Digitales Lernen bedeutet ...",
      "Persönliche Erfahrung: Ich habe beide Methoden ausprobiert und finde ...",
      "Situation in deinem Heimatland: In meinem Heimatland wird eher ... bevorzugt, weil ...",
      "Vor- und Nachteile: Ein Vorteil des traditionellen Lernens ist ... Ein Nachteil ist ... Ein Vorteil des digitalen Lernens ist ...",
      "Schluss und Dank: Zusammenfassend kann ich sagen ... Danke fürs Zuhören!",
    ],
    activityOrdered: true,
    answerStructure: [
      "Begrüße dein Publikum und nenne das Thema.",
      "Erkläre traditionelles und digitales Lernen mit Beispielen.",
      "Vergleiche Lernumgebung, Methoden und Kommunikation.",
      "Nenne Vorteile und Nachteile beider Methoden.",
      "Beschreibe kurz die Situation in deinem Heimatland.",
      "Gib deine Meinung und schließe mit einem Dank.",
    ],
    usefulPhrases: [
      "Traditionelles Lernen bedeutet ...",
      "Digitales Lernen bedeutet ...",
      "Während traditionelles Lernen persönlichen Kontakt bietet, ist digitales Lernen flexibler.",
      "Ein Vorteil ist, dass ...",
      "Ein Nachteil besteht darin, dass ...",
      "Ich bevorzuge ..., weil ...",
      "Die beste Lösung ist meiner Meinung nach eine Kombination aus beiden Methoden.",
    ],
  },
  writing: getB1WritingTask(14),
  reading: getB1ReadingTask(14),
  listening: {
    title: "Hören Sie den Dialog über lebenslanges Lernen und beantworten Sie die fünf Fragen.",
    instructions: "Hören Sie aufmerksam zu. Notieren Sie die richtigen Antwortbuchstaben und reichen Sie sie im Submit-Tab ein.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Online-Kurs und lebenslanges Lernen",
    embedUrl: "https://www.youtube.com/embed/PwA3HJ_V1HA",
    externalUrl: "https://youtu.be/PwA3HJ_V1HA",
    videoTitle: "B1 Day 14 Traditionelles vs digitales Lernen Hören",
    submitRequired: true,
    selfCheckText: "Hören ist Teil dieser Übung. Reichen Sie Ihre fünf Antwortbuchstaben im Submit-Tab ein.",
    questions: [
      { stem: "Warum hat Anna einen Online-Kurs gemacht?", options: ["a) Sie möchte in ihrem Beruf vorankommen.", "b) Sie hatte zu viel Freizeit.", "c) Sie musste es für ihre Arbeit machen.", "d) Sie wollte einen neuen Job finden."] },
      { stem: "Was lernt Lukas gerade?", options: ["a) Programmierung.", "b) Digitale Fotografie.", "c) Marketing.", "d) Fremdsprachen."] },
      { stem: "Welche Herausforderung haben beide beim lebenslangen Lernen?", options: ["a) Die Kursinhalte sind langweilig.", "b) Sie haben wenig Zeit.", "c) Sie können sich keine Kurse leisten.", "d) Die Kurse sind zu einfach."] },
      { stem: "Wie schafft Lukas es, Zeit zum Lernen zu finden?", options: ["a) Er nimmt sich jeden Tag eine Stunde Zeit.", "b) Er lernt nur am Wochenende.", "c) Er nimmt sich Urlaub für seine Kurse.", "d) Er lernt nur, wenn er motiviert ist."] },
      { stem: "Was raten Anna und Lukas am Ende?", options: ["a) Große Lernziele setzen.", "b) Nur dann lernen, wenn man Zeit hat.", "c) Regelmäßig und in kleinen Schritten lernen.", "d) So viel wie möglich auf einmal lernen."] },
    ],
    steps: [
      "Hören Sie den Dialog einmal komplett.",
      "Lesen Sie die Fragen und Antwortmöglichkeiten.",
      "Hören Sie wichtige Stellen ein zweites Mal.",
      "Schreiben Sie Ihre fünf Antwortbuchstaben in den Submit-Tab.",
    ],
  },
  submitListening: true,
  submitWritingDescription: "Paste your formal email to your boss about the Weiterbildung programme.",
  submitReadingDescription: "Paste your seven reading answer letters.",
  submitListeningDescription: "Paste your five listening answer letters.",
};

export default function B1Day14TraditionellesDigitalesLernenWorkbookPage() {
  return <B1StandardWorkbookPage config={B1_DAY14_TRADITIONELLES_DIGITALES_LERNEN_WORKBOOK_CONFIG} />;
}
