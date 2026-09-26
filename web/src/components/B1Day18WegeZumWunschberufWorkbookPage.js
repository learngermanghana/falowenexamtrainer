import React from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";
import { getB1WritingTask } from "../data/b1WritingTasks";

export const B1_DAY18_WEGE_ZUM_WUNSCHBERUF_WORKBOOK_CONFIG = {
  day: 18,
  chapter: "6.18",
  assignmentKey: "B1-6.18",
  workbookId: "B1Day18WegeZumWunschberuf",
  title: "Wege zum Wunschberuf",
  subtitle: "Sprich über Traumberufe, Ausbildung, Qualifikationen, Bewerbungen und Karrierechancen. Teil 1 ist Gruppenpraxis; Teil 2, Teil 3 und Teil 4 bereitest du für die Abgabe vor.",
  heroImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "Menschen sprechen über Karriere und Beruf",
  speaking: {
    question: "Wie kannst du deinen Wunschberuf erreichen?",
    instructions: "Bereite eine kurze B1-Präsentation vor. Erkläre deinen Wunschberuf, die nötige Ausbildung, wichtige Fähigkeiten und mögliche Karrierechancen.",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Bewerbung und Karriereplanung",
    ideaTitle: "Zentrales Thema: Wege zum Wunschberuf",
    ideaIntro: "In this chapter, we'll engage in group exercises discussing paths to a dream job, qualifications, applications and future career opportunities.",
    ideaGroups: [
      {
        title: "1. Traumberuf finden",
        items: [
          "Was interessiert mich? Persönliche Stärken und Leidenschaften entdecken.",
          "Welche Berufe gibt es? Verschiedene Branchen und Berufsfelder erkunden.",
          "Praktika und Berufserfahrung: den Job ausprobieren.",
        ],
      },
      {
        title: "2. Ausbildung und Qualifikation",
        items: [
          "Schule und Schulabschlüsse: Hauptschule, Realschule, Abitur.",
          "Studium an der Universität oder Fachhochschule: theoretische Ausbildung.",
          "Berufsausbildung im dualen System: Lernen und Arbeiten gleichzeitig.",
          "Zertifikate und Weiterbildungen: Spezialisierungen und neue Kenntnisse erwerben.",
        ],
      },
      {
        title: "3. Bewerbungsprozess",
        items: [
          "Lebenslauf schreiben: Ausbildung, Erfahrung und Fähigkeiten zeigen.",
          "Bewerbungsschreiben: erklären, warum man diesen Job möchte.",
          "Vorstellungsgespräch vorbereiten: typische Fragen üben.",
        ],
      },
      {
        title: "4. Wichtige Fähigkeiten und Eigenschaften",
        items: [
          "Kommunikationsfähigkeit: gut sprechen und schreiben können.",
          "Zeitmanagement: Aufgaben organisieren.",
          "Teamfähigkeit: gut mit anderen zusammenarbeiten.",
          "Digitale Kompetenzen: Computer- und Technikkenntnisse.",
        ],
      },
      {
        title: "5. Karrierechancen und Zukunft",
        items: [
          "Aufstiegsmöglichkeiten: Weiterbildung und neue Positionen.",
          "Arbeiten im Ausland: internationale Chancen.",
          "Selbstständigkeit: ein eigenes Unternehmen gründen.",
        ],
      },
      {
        title: "6. Eigene Erfahrungen und Meinung",
        items: [
          "Welcher Beruf interessiert dich? Warum?",
          "Welche Ausbildung oder Qualifikationen brauchst du für diesen Beruf?",
          "Welche Fähigkeiten möchtest du noch verbessern?",
        ],
      },
    ],
    exampleTitle: "Beispielantwort",
    exampleSteps: [
      "Mein Wunschberuf ist Lehrer, weil ich gerne mit Menschen arbeite.",
      "Ich brauche dafür ein Studium an der Universität.",
      "Zurzeit mache ich ein Praktikum an einer Schule, um Erfahrungen zu sammeln.",
      "Ich möchte meine Kommunikationsfähigkeiten verbessern, weil sie im Unterricht wichtig sind.",
    ],
    activityTitle: "Struktur deiner Präsentation",
    activityPoints: [
      "Begrüßung und Vorstellung des Themas.",
      "Inhalt und Struktur: Erkläre, welchen Beruf du erreichen möchtest und worüber du sprichst.",
      "Persönliche Erfahrung: Beschreibe deine Interessen, Stärken oder Erfahrungen.",
      "Situation in deinem Heimatland: Erkläre, welche Wege es dort zu diesem Beruf gibt.",
      "Vor- und Nachteile: Nenne Vorteile und Herausforderungen dieses Berufs oder Ausbildungswegs.",
      "Schluss: Fasse zusammen, wie du deinen Wunschberuf erreichen kannst.",
    ],
    activityOrdered: true,
    answerStructure: [
      "Begrüße dein Publikum und nenne deinen Wunschberuf.",
      "Erkläre, warum dich dieser Beruf interessiert.",
      "Nenne die nötige Ausbildung oder Qualifikation.",
      "Beschreibe wichtige Fähigkeiten und Eigenschaften.",
      "Erkläre Praktika, Bewerbung oder Weiterbildung als Weg zum Ziel.",
      "Gib ein Fazit mit deinem nächsten Schritt.",
    ],
    usefulPhrases: [
      "Mein Wunschberuf ist ...",
      "Ich interessiere mich für diesen Beruf, weil ...",
      "Für diesen Beruf braucht man ...",
      "Es ist wichtig, ... zu ...",
      "Ich möchte meine ... verbessern.",
      "Ein Vorteil dieses Berufs ist, dass ...",
      "Eine Herausforderung ist, dass ...",
      "Zusammenfassend kann ich sagen, dass ...",
    ],
  },
  writing: getB1WritingTask(18),
  reading: getB1ReadingTask(18),
  listening: {
    title: "Hören Sie den Text über Berufswahl und beantworten Sie die fünf Fragen.",
    instructions: "Hören Sie aufmerksam zu. Notieren Sie die richtigen Antwortbuchstaben und reichen Sie sie im Submit-Tab ein.",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Beratung zur Berufswahl",
    embedUrl: "https://www.youtube-nocookie.com/embed/t0OIJ3Upz18",
    externalUrl: "https://youtu.be/t0OIJ3Upz18",
    videoTitle: "B1 Day 18 Wege zum Wunschberuf Hören",
    submitRequired: true,
    selfCheckText: "Hören ist Teil dieser Übung. Reichen Sie Ihre fünf Antwortbuchstaben im Submit-Tab ein.",
    questions: [
      { stem: "Was wird als erstes wichtiges Kriterium bei der Berufswahl genannt?", options: ["a) Hohe Gehälter.", "b) Spaß an der Arbeit.", "c) Eine feste Stelle.", "d) Gute Arbeitszeiten."] },
      { stem: "Warum sollte man Praktika machen?", options: ["a) Um ein gutes Gehalt zu bekommen.", "b) Um den Traumberuf zu garantieren.", "c) Um Einblicke in das Berufsfeld zu erhalten.", "d) Um sicherzustellen, dass man keine Fehler macht."] },
      { stem: "Was sollte man laut dem Hörtext neben dem Traumberuf auch beachten?", options: ["a) Ob es genug Stellen im Beruf gibt.", "b) Ob der Beruf sehr einfach ist.", "c) Ob der Beruf gute Arbeitszeiten hat.", "d) Ob man den Beruf ohne Ausbildung ausüben kann."] },
      { stem: "Welche Balance ist laut dem Hörtext wichtig?", options: ["a) Zwischen Spaß und Freizeit.", "b) Zwischen Wunsch und Realität.", "c) Zwischen Gehalt und Urlaub.", "d) Zwischen Arbeit und Familie."] },
      { stem: "Was wird laut dem Hörtext empfohlen, wenn man sich nicht sicher ist, welchen Beruf man wählen soll?", options: ["a) Sich keine Sorgen machen.", "b) Einen Beruf nach dem Gehalt wählen.", "c) Flexibel sein und sich anpassen.", "d) Immer den Beruf wechseln, wenn man unzufrieden ist."] },
    ],
    steps: [
      "Hören Sie den Text einmal komplett.",
      "Lesen Sie die Fragen und Antwortmöglichkeiten.",
      "Hören Sie wichtige Stellen ein zweites Mal.",
      "Schreiben Sie Ihre fünf Antwortbuchstaben in den Submit-Tab.",
    ],
  },
  submitListening: true,
  submitWritingDescription: "Paste your opinion about Wege zum Wunschberuf.",
  submitReadingDescription: "Paste your seven reading answer letters.",
  submitListeningDescription: "Paste your five listening answer letters.",
};

export default function B1Day18WegeZumWunschberufWorkbookPage() {
  return <B1StandardWorkbookPage config={B1_DAY18_WEGE_ZUM_WUNSCHBERUF_WORKBOOK_CONFIG} />;
}
