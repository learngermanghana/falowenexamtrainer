import React from "react";
import A2MiniLearningBlock from "./A2MiniLearningBlock";

const lesson = {
  title: "Die Woche planen: Präsens für Zukunft + Zeitangaben",
  rule: "Für feste Pläne in der nahen Zukunft benutzt du oft Präsens mit einer Zeitangabe. Modalverben wie können und müssen helfen, Verfügbarkeit und Pflichten auszudrücken.",
  examples: ["Am Montag arbeite ich bis 17 Uhr.", "Morgen treffe ich meine Freundin.", "Am Mittwoch kann ich nicht kommen.", "Um 18 Uhr muss ich zum Deutschkurs gehen."],
  questions: [
    { stem: "Was passt für einen festen Plan? Morgen ___ ich meine Freundin.", options: ["treffe", "traf", "getroffen"], answer: 0, explanation: "Präsens + morgen kann Zukunft ausdrücken." },
    { stem: "Welcher Satz ist richtig?", options: ["Am Dienstag ich arbeite bis 16 Uhr.", "Am Dienstag arbeite ich bis 16 Uhr.", "Am Dienstag arbeiten ich bis 16 Uhr."], answer: 1, explanation: "Steht die Zeitangabe zuerst, steht das Verb an Position 2." },
    { stem: "Was passt? Am Freitag ___ ich nicht kommen.", options: ["kann", "können", "konnte"], answer: 0, explanation: "ich kann beschreibt aktuelle Verfügbarkeit." },
    { stem: "Was passt? Um 8 Uhr ___ ich zur Arbeit gehen.", options: ["muss", "musste", "bin"], answer: 0, explanation: "müssen beschreibt eine Pflicht; der Infinitiv gehen steht am Ende." },
  ],
  outputPrompt: "Beschreibe deinen Plan für drei Wochentage in 4–5 Sätzen. Benutze mindestens eine Uhrzeit und ein Modalverb.",
  starters: ["Am Montag ...", "Um ... Uhr ...", "Am Mittwoch kann ich ...", "Am Freitag muss ich ..."],
};

export default function A2Day22DieWochePlanungGrammarPage() {
  return <main style={{ maxWidth: 980, margin: "0 auto", padding: "24px 16px 64px" }}><h1>A2 · Day 22 · Die Woche planen</h1><A2MiniLearningBlock {...lesson} /></main>;
}
