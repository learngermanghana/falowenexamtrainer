import React from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";
import { getB1WritingTask } from "../data/b1WritingTasks";
import { getB1ReadingTask } from "../data/b1ReadingTasks";

export const B1_DAY16_PRUEFUNGSANGST_STRESSBEWAELTIGUNG_WORKBOOK_CONFIG = {
  day: 16,
  chapter: "5.16",
  assignmentKey: "B1-5.16",
  workbookId: "B1Day16PruefungsangstStressbewaeltigung",
  title: "Prüfungsangst und Stressbewältigung",
  subtitle: "Sprich über Prüfungsangst, Symptome und Strategien gegen Stress. Teil 1 ist Gruppenpraxis; Teil 2, Teil 3 und Teil 4 bereitest du für die Abgabe vor.",
  heroImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "Schüler bereitet sich auf eine Prüfung vor",
  speaking: {
    question: "Wie gehst du mit Prüfungsangst und Stress um?",
    instructions: "Bereite eine kurze B1-Präsentation über Prüfungsangst und Stressbewältigung vor. Erkläre Ursachen, Symptome, Strategien und deine eigene Erfahrung.",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Lernen vor einer Prüfung",
    ideaTitle: "Zentrales Thema: Prüfungsangst und Stressbewältigung",
    ideaIntro: "In this chapter, we'll engage in group exercises discussing exam anxiety, stress symptoms and practical strategies for staying calm.",
    ideaGroups: [
      {
        title: "1. Ursachen von Prüfungsangst",
        items: [
          "Zu wenig Vorbereitung: Angst, weil man nicht genug gelernt hat.",
          "Zeitdruck: das Gefühl, nicht genug Zeit zu haben.",
          "Hohe Erwartungen: Druck von Eltern, Lehrern oder sich selbst.",
          "Blackout: Angst, in der Prüfung nichts mehr zu wissen.",
          "Vergleich mit anderen: Andere sind besser vorbereitet oder haben bessere Noten.",
        ],
      },
      {
        title: "2. Symptome von Prüfungsangst",
        items: [
          "Körperliche Symptome: Herzrasen, Schwitzen, Zittern.",
          "Mentale Symptome: Konzentrationsprobleme, negative Gedanken.",
          "Emotionale Symptome: Angst, Nervosität, Unsicherheit.",
          "Verhalten: Schlafprobleme, Prokrastination, Gereiztheit.",
        ],
      },
      {
        title: "3. Strategien zur Stressbewältigung",
        items: [
          "Gute Vorbereitung: frühzeitig lernen und einen Zeitplan erstellen.",
          "Entspannungstechniken: Atemübungen, Meditation, Musik hören.",
          "Bewegung: Sport treiben oder spazieren gehen.",
          "Schlaf: genug schlafen, um fit zu sein.",
          "Gesunde Ernährung: keine Energy-Drinks, sondern gesunde Snacks.",
          "Positive Gedanken: Ich kann das schaffen! Ich bin gut vorbereitet!",
          "Unterstützung suchen: mit Familie oder Freunden reden.",
        ],
      },
      {
        title: "4. Tipps für die Prüfung",
        items: [
          "Pünktlich sein und früh genug ankommen.",
          "Ruhig atmen und tief durchatmen.",
          "Fragen genau lesen und nicht überstürzen.",
          "Schritt für Schritt lösen: zuerst einfache Aufgaben, dann schwierige.",
          "Zeit einteilen und nicht zu lange an einer Aufgabe hängen bleiben.",
        ],
      },
      {
        title: "5. Eigene Erfahrungen und Meinung",
        items: [
          "Hattest du schon einmal Prüfungsangst? Wie hast du dich gefühlt?",
          "Welche Strategien helfen dir am besten gegen Stress?",
          "Wie bereitest du dich auf Prüfungen vor?",
          "Denkst du, Prüfungsangst ist normal? Warum?",
        ],
      },
    ],
    exampleTitle: "Beispielantwort",
    exampleSteps: [
      "Vor Prüfungen bin ich oft nervös, aber ich versuche, mich gut vorzubereiten.",
      "Ich mache einen Lernplan und wiederhole die wichtigsten Themen.",
      "Vor der Prüfung höre ich ruhige Musik und atme tief durch.",
      "Das hilft mir, mich zu entspannen.",
    ],
    activityTitle: "Struktur deiner Präsentation",
    activityPoints: [
      "Begrüßung und Vorstellung des Themas: Ich möchte heute über Prüfungsangst und Stress sprechen.",
      "Inhalt und Struktur: Prüfungsangst bedeutet, dass man vor oder während einer Prüfung sehr nervös ist.",
      "Persönliche Erfahrung: Ich habe selbst Prüfungsstress erlebt oder kenne jemanden, der darunter leidet.",
      "Situation in deinem Heimatland: In meinem Heimatland empfinden viele Schüler und Studenten Prüfungen als stressig, weil ...",
      "Vor- und Nachteile: Ein Vorteil von Stress ist, dass er motivieren kann. Ein Nachteil ist, dass er die Leistung verschlechtern kann.",
      "Schluss und Dank: Zusammenfassend kann ich sagen, dass es wichtig ist, mit Prüfungsangst richtig umzugehen. Danke fürs Zuhören!",
    ],
    activityOrdered: true,
    answerStructure: [
      "Begrüße dein Publikum und nenne das Thema.",
      "Erkläre, was Prüfungsangst bedeutet.",
      "Beschreibe Ursachen und Symptome.",
      "Nenne Strategien gegen Stress.",
      "Erzähle kurz von deiner Erfahrung oder der Situation in deinem Heimatland.",
      "Bewerte Vor- und Nachteile von Stress und schließe mit einem Fazit.",
    ],
    usefulPhrases: [
      "Prüfungsangst bedeutet, dass ...",
      "Viele Schüler sind nervös, weil ...",
      "Ein häufiges Symptom ist ...",
      "Mir hilft es, wenn ich ...",
      "Man sollte frühzeitig lernen und Pausen machen.",
      "Zusammenfassend ist wichtig, dass ...",
    ],
  },
  writing: getB1WritingTask(16),
  reading: getB1ReadingTask(16),
  listening: {
    title: "Hören Sie das Interview über Prüfungsangst und beantworten Sie die fünf Fragen.",
    instructions: "Lesen Sie zuerst die Fragen. Hören Sie dann aufmerksam auf Ellens Strategien vor und während einer Prüfung.",
    image: "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Stressbewältigung vor einer Prüfung",
    audioKey: "audio/day_16.mp3",
    videoTitle: "B1 Day 16 Prüfungsangst und Stressbewältigung Hören",
    submitRequired: true,
    selfCheckText: "Hören ist Teil dieser Übung. Reichen Sie Ihre fünf Antwortbuchstaben im Submit-Tab ein.",
    questions: [
      {
        stem: "Was hilft Ellen heute vor einer Prüfung?",
        options: [
          "a) Sie lernt die ganze Nacht.",
          "b) Sie lernt jeden Tag ein bisschen und macht eine Atemübung.",
          "c) Sie vermeidet den Prüfungsstoff.",
          "d) Sie trinkt viel Kaffee.",
        ],
      },
      {
        stem: "Was empfiehlt Ellen für die mündliche Prüfung?",
        options: [
          "a) Nur leise im Kopf üben.",
          "b) Schwierige Wörter auswendig lernen und sonst nicht sprechen.",
          "c) Mit einer anderen Person üben, laut sprechen und die Prüfungssituation trainieren.",
          "d) Erst am Prüfungstag mit dem Sprechen beginnen.",
        ],
      },
      {
        stem: "Warum ist Schlaf vor der Prüfung wichtig?",
        options: [
          "a) Das Gehirn braucht Schlaf, damit man das Gelernte behalten kann.",
          "b) Man hat dann weniger Zeit zum Nachdenken.",
          "c) Schlaf ersetzt die Prüfungsvorbereitung.",
          "d) Man kann dadurch jede Aufgabe sofort lösen.",
        ],
      },
      {
        stem: "Was soll man tun, wenn eine Aufgabe in der Prüfung zu schwer ist?",
        options: [
          "a) Sofort die Prüfung beenden.",
          "b) Die gleiche Aufgabe immer wieder schnell lesen.",
          "c) Den Prüfer nach der richtigen Lösung fragen.",
          "d) Ruhig bleiben, langsam noch einmal lesen und gegebenenfalls später zurückkommen.",
        ],
      },
      {
        stem: "Was sagt Ellen über Fehler in der Prüfung?",
        options: [
          "a) Jeder Fehler führt automatisch zum Nichtbestehen.",
          "b) Wichtig ist, dass man sich verständigen kann; ein fehlendes Wort kann man umschreiben.",
          "c) Nur Muttersprachler dürfen Fehler machen.",
          "d) Man sollte lieber schweigen, wenn ein Wort fehlt.",
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
  submitWritingDescription: "Paste your opinion about Prüfungsangst and Stressbewältigung.",
  submitReadingDescription: "Paste your seven reading answer letters.",
  submitListeningDescription: "Paste your five listening answer letters.",
};

export default function B1Day16PruefungsangstStressbewaeltigungWorkbookPage() {
  return <B1StandardWorkbookPage config={B1_DAY16_PRUEFUNGSANGST_STRESSBEWAELTIGUNG_WORKBOOK_CONFIG} />;
}
