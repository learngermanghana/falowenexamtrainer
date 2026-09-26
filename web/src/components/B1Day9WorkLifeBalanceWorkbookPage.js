import React from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";
import { getB1WritingTask } from "../data/b1WritingTasks";

const config = {
  day: 9,
  chapter: "3.9",
  assignmentKey: "B1-3.9",
  workbookId: "B1Day9WorkLifeBalance",
  title: "Work-Life-Balance im modernen Arbeitsumfeld",
  subtitle: "Choose Teil 1–4, Ref or Submit. Teil 1 is group practice, Teil 4 is self-check, and only Schreiben and Lesen are submitted.",
  heroImage: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "Professionals discussing work-life balance in a modern workplace",
  speaking: {
    question: "Ist eine gute Work-Life-Balance in der modernen Welt möglich?",
    instructions: "Diskutieren Sie Definition, Herausforderungen, Strategien, Vorteile und zukünftige Entwicklungen. Begründen Sie Ihre Meinung und nennen Sie Beispiele aus Ihrem Alltag oder Heimatland.",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Colleagues discussing work, stress and personal time",
    ideaTitle: "Diskussionspunkte zur Vorbereitung",
    ideaIntro: "Wählen Sie passende Punkte für Ihre Präsentation. Sie müssen nicht jeden Punkt einzeln behandeln.",
    ideaGroups: [
      {
        title: "Definition und Bedeutung",
        items: [
          "Gleichgewicht zwischen Beruf und Privatleben",
          "Wichtiger Faktor für Gesundheit und Zufriedenheit",
          "Herausforderung in der modernen Arbeitswelt",
          "Unterschiedliche Ansichten je nach Beruf und Kultur",
        ],
      },
      {
        title: "Herausforderungen und Probleme",
        items: [
          "Hoher Arbeitsdruck, viele Aufgaben und enge Fristen",
          "Überstunden und ständige Erreichbarkeit",
          "Wenig Freizeit für Familie und Hobbys",
          "Psychische und körperliche Belastung",
          "Schwierige Trennung von Arbeit und Privatleben im Homeoffice",
        ],
      },
      {
        title: "Strategien für eine bessere Balance",
        items: [
          "Klare Arbeitszeiten festlegen und Pausen respektieren",
          "Freizeit aktiv mit Sport, Hobbys und sozialen Kontakten gestalten",
          "Nein sagen und persönliche Grenzen setzen",
          "Yoga, Meditation, Atemübungen oder Spaziergänge nutzen",
          "Arbeitgeber mit Homeoffice, Teilzeit oder Gleitzeit suchen",
        ],
      },
      {
        title: "Vorteile einer guten Work-Life-Balance",
        items: [
          "Weniger Stress und bessere Gesundheit",
          "Mehr Zeit für Familie und Freunde",
          "Höhere Motivation und Produktivität",
          "Bessere Lebensqualität und Zufriedenheit",
          "Geringeres Risiko für Burnout und Depressionen",
        ],
      },
      {
        title: "Zukunft der Work-Life-Balance",
        items: [
          "Digitalisierung und Homeoffice – Fluch oder Segen?",
          "4-Tage-Woche als mögliches Zukunftsmodell",
          "Flexible Arbeitszeiten als neuer Standard",
          "Mehr Fokus auf Mitarbeiterwohlbefinden",
          "Größere Bedeutung mentaler Gesundheit im Berufsleben",
        ],
      },
    ],
    discussionQuestions: [
      "Welche Faktoren stören die Work-Life-Balance am stärksten?",
      "Hilft Homeoffice wirklich, Beruf und Privatleben besser zu verbinden?",
      "Sollten Unternehmen eine 4-Tage-Woche anbieten?",
      "Welche persönliche Strategie funktioniert für Sie am besten?",
    ],
    answerStructure: [
      "Einleitung: Thema und Fragestellung vorstellen.",
      "Argumente dafür: positive Aspekte und Begründungen nennen.",
      "Argumente dagegen: Probleme und Grenzen erklären.",
      "Eigene Meinung deutlich machen und kurz begründen.",
      "Die wichtigsten Punkte zusammenfassen und mit einem Abschlusssatz enden.",
    ],
    usefulPhrases: [
      "Eine gute Work-Life-Balance bedeutet für mich, dass …",
      "Einerseits bietet Homeoffice mehr Flexibilität, andererseits …",
      "Arbeitgeber können helfen, indem sie …",
      "Viele Menschen setzen klare Grenzen, um …",
      "Obwohl moderne Arbeitsmodelle Vorteile haben, …",
      "Zusammenfassend lässt sich sagen, dass …",
    ],
  },
  writing: getB1WritingTask(9),
  reading: getB1ReadingTask(9),
  listening: {
    title: "Hören Sie den Beitrag über Stressbewältigung und kontrollieren Sie Ihre Antworten selbst.",
    instructions: "Read the questions first. Listen carefully, answer all five questions and check your own work afterwards.",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Headphones for a listening exercise about stress management",
    embedUrl: "https://drive.google.com/file/d/13XH2YBmaUZYBzu8bu-pACmzuDIsRvIR5/preview",
    externalUrl: "https://drive.google.com/file/d/13XH2YBmaUZYBzu8bu-pACmzuDIsRvIR5/view?usp=sharing",
    videoTitle: "B1 Day 9 Hören · Stress reduzieren",
    selfCheckText: "Complete the listening task independently and mark your own answers. Only Teil 2 Schreiben and Teil 3 Lesen are submitted for tutor evaluation.",
    questions: [
      { stem: "Was ist ein wichtiger Tipp, um Stress zu reduzieren?", options: ["A) Ungeplante Aufgaben erledigen", "B) Realistische Ziele setzen", "C) Mehr Verpflichtungen übernehmen", "D) Aufgaben ignorieren"] },
      { stem: "Wie kann Bewegung bei Stress helfen?", options: ["A) Sie macht immer müde.", "B) Sie erhöht den Stress.", "C) Sie verbessert die Stimmung.", "D) Sie verringert die Immunabwehr."] },
      { stem: "Wie können Entspannungstechniken wie Yoga helfen?", options: ["A) Sie beruhigen Körper und Geist.", "B) Sie machen nervös.", "C) Sie verstärken den Druck.", "D) Sie verringern die Schlafqualität."] },
      { stem: "Warum ist Schlaf wichtig für den Stressabbau?", options: ["A) Weil er den Körper überfordert.", "B) Weil er den Körper regeneriert.", "C) Weil er Stress verursacht.", "D) Weil er ungesund ist."] },
      { stem: "Warum sind soziale Kontakte wichtig?", options: ["A) Sie sorgen für zusätzliche Aufgaben.", "B) Sie helfen, das Wohlbefinden zu steigern.", "C) Sie erhöhen den Stress.", "D) Sie verursachen mehr Arbeit."] },
    ],
  },
  submitWritingDescription: "Paste your final 80–100 word opinion text about Work-Life-Balance.",
  submitReadingDescription: "Paste your seven reading answer letters.",
};

export default function B1Day9WorkLifeBalanceWorkbookPage() {
  return <B1StandardWorkbookPage config={config} />;
}
