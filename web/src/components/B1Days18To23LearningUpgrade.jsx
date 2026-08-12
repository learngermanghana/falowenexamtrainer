import React from "react";
import A2MiniLearningBlock from "./A2MiniLearningBlock";

const LESSONS = {
  18: {
    title: "Wege zum Wunschberuf: Ziel, Weg und Begründung",
    rule: "Denke zuerst: Was ist mein Ziel? Welcher Weg bringt mich dorthin? Warum passt er? Nutze um ... zu für Ziele, Relativsätze für Fähigkeiten und weil/dass/wenn für Begründungen.",
    examples: ["Ich mache ein Praktikum, um Berufserfahrung zu sammeln.", "Ich suche einen Beruf, der zu meinen Stärken passt."],
    questions: [
      { stem: "Welche Form drückt ein Ziel korrekt aus?", options: ["Ich mache einen Kurs, um meine Chancen zu verbessern.", "Ich mache einen Kurs, weil meine Chancen verbessern."], answer: 0, explanation: "um ... zu + Infinitiv drückt ein Ziel aus." },
      { stem: "Welche Form ist ein korrekter Relativsatz?", options: ["Ich suche einen Beruf, der mich interessiert.", "Ich suche einen Beruf, interessiert der mich."], answer: 0, explanation: "Im Relativsatz steht das Verb am Ende." },
    ],
    outputPrompt: "Formuliere drei Sätze über deinen Wunschberuf: Ziel → Weg → Begründung.",
    starters: ["Mein Wunschberuf ist ...", "Um dieses Ziel zu erreichen, ...", "Ich brauche eine Fähigkeit, die ..."],
  },
  19: {
    title: "Vorstellungsgespräch: höflich, klar, begründet",
    rule: "Baue Antworten in drei Schritten: höfliche Aussage → konkrete Stärke/Erfahrung → Begründung. Konjunktiv II macht Wünsche professioneller; weil/da erklärt die Motivation.",
    examples: ["Ich würde gern in Ihrem Unternehmen arbeiten, weil mich der Bereich interessiert.", "Eine meiner Stärken ist, dass ich zuverlässig arbeite."],
    questions: [
      { stem: "Welche Antwort klingt professioneller?", options: ["Ich will hier arbeiten.", "Ich würde gern in Ihrem Unternehmen arbeiten."], answer: 1, explanation: "würde gern klingt höflicher und professioneller." },
      { stem: "Welche Begründung ist korrekt?", options: ["..., weil ich arbeite gern im Team.", "..., weil ich gern im Team arbeite."], answer: 1, explanation: "Nach weil steht das konjugierte Verb am Ende." },
    ],
    outputPrompt: "Beantworte eine typische Interviewfrage mit Wunsch + Stärke + Begründung.",
    starters: ["Ich würde gern ...", "Eine meiner Stärken ist ...", "Das ist wichtig, weil ..."],
  },
  20: {
    title: "Berufe kennenlernen: Aufgaben, Anforderungen und Eignung",
    rule: "Denke bei einem Beruf an drei Punkte: Was macht man? Was muss man können? Für wen passt der Beruf? Nutze Relativsätze, Modalverben und weil/dass, um diese Punkte zu verbinden.",
    examples: ["Ein Arzt ist eine Person, die Patienten untersucht.", "Für diesen Beruf muss man gut mit Menschen umgehen können."],
    questions: [
      { stem: "Welche Beschreibung ist korrekt?", options: ["Ein Lehrer ist jemand, der Schüler unterrichtet.", "Ein Lehrer ist jemand, der unterrichtet Schüler."], answer: 0, explanation: "Im Relativsatz steht das Verb am Ende." },
      { stem: "Welche Form beschreibt eine Anforderung?", options: ["Man muss zuverlässig arbeiten können.", "Man zuverlässig muss können arbeiten."], answer: 0, explanation: "Beim Modalverb steht der Infinitiv am Satzende." },
    ],
    outputPrompt: "Beschreibe einen Beruf mit Aufgabe → Anforderung → persönliche Eignung.",
    starters: ["Ein/e ... ist jemand, der/die ...", "Man muss ... können.", "Dieser Beruf passt zu mir, weil ..."],
  },
  21: {
    title: "Lebensformen: vergleichen und abwägen",
    rule: "Baue deine Meinung als Vergleich: Möglichkeit A → Vorteil/Nachteil → Möglichkeit B → eigene Bewertung. Nutze einerseits ... andererseits, zwar ... aber, obwohl und während.",
    examples: ["Einerseits ist eine WG günstig, andererseits braucht man Kompromisse.", "Obwohl das Singleleben flexibel ist, kann es manchmal einsam sein."],
    questions: [
      { stem: "Welche Struktur wägt zwei Seiten ab?", options: ["einerseits ... andererseits", "deshalb ... weil"], answer: 0, explanation: "einerseits ... andererseits stellt zwei Seiten gegenüber." },
      { stem: "Welche Form ist korrekt?", options: ["Obwohl eine WG günstig ist, braucht man Kompromisse.", "Obwohl ist eine WG günstig, man braucht Kompromisse."], answer: 0, explanation: "Nach obwohl steht das Verb im Nebensatz am Ende." },
    ],
    outputPrompt: "Vergleiche zwei Lebensformen und gib am Ende deine Meinung.",
    starters: ["Einerseits ...", "Andererseits ...", "Für mich ist ... besser, weil ..."],
  },
  22: {
    title: "Beziehungen: Eigenschaften erklären und Erwartungen ausdrücken",
    rule: "Denke zuerst: Welche Eigenschaft ist wichtig? Warum? Wie zeigt sie sich im Alltag? Nutze dass/weil, Relativsätze und reziproke Ausdrücke wie miteinander und füreinander.",
    examples: ["Mir ist wichtig, dass man offen miteinander spricht.", "Ich wünsche mir einen Partner, der zuverlässig ist."],
    questions: [
      { stem: "Welche Form ist korrekt?", options: ["Mir ist wichtig, dass wir offen miteinander sprechen.", "Mir ist wichtig, dass wir sprechen offen miteinander."], answer: 0, explanation: "Im dass-Satz steht das Verb am Ende." },
      { stem: "Welche Form beschreibt eine gewünschte Person?", options: ["Ich suche jemanden, der ehrlich ist.", "Ich suche jemanden, ehrlich ist der."], answer: 0, explanation: "Relativsatz: Relativpronomen + ... + Verb am Ende." },
    ],
    outputPrompt: "Nenne drei wichtige Eigenschaften für eine Beziehung und begründe jede kurz.",
    starters: ["Für mich ist wichtig, dass ...", "Ich schätze Menschen, die ...", "Eine gute Beziehung funktioniert, wenn ..."],
  },
  23: {
    title: "Erstes Date: Vorschläge, Höflichkeit und Reaktion",
    rule: "Plane ein erstes Date in vier Schritten: Vorschlag → Grund → höfliche Frage → mögliche Reaktion. Nutze könnten/würden, weil, wenn und obwohl für natürliche B1-Sätze.",
    examples: ["Wir könnten in ein Café gehen, weil man dort gut sprechen kann.", "Wenn das Treffen gut läuft, würde ich ein zweites Date vorschlagen."],
    questions: [
      { stem: "Welcher Vorschlag klingt höflich?", options: ["Wir gehen ins Café.", "Wir könnten in ein Café gehen."], answer: 1, explanation: "könnten macht den Vorschlag höflicher und offener." },
      { stem: "Welche Form ist korrekt?", options: ["Wenn das Date gut läuft, würde ich mich wieder treffen.", "Wenn das Date gut läuft, ich würde mich wieder treffen."], answer: 0, explanation: "Nach dem vorangestellten Nebensatz steht das Verb im Hauptsatz direkt danach." },
    ],
    outputPrompt: "Plane ein erstes Date: Ort → Begründung → Verhalten → möglicher nächster Schritt.",
    starters: ["Wir könnten ...", "Das wäre gut, weil ...", "Wenn ...", "Ich würde ..."],
  },
};

export default function B1Days18To23LearningUpgrade({ day }) {
  const lesson = LESSONS[Number(day)];
  if (!lesson) return null;
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={{ border: "1px solid #bfdbfe", borderRadius: 16, padding: 16, background: "#eff6ff" }}>
        <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", color: "#1d4ed8" }}>Think first · Erst verstehen, dann anwenden</div>
        <p style={{ margin: "8px 0 0", lineHeight: 1.7 }}><strong>Idea → decision → German sentence.</strong> Entscheide zuerst, was du sagen willst. Wähle dann die passende Struktur und formuliere erst danach den vollständigen Satz.</p>
      </section>
      <A2MiniLearningBlock {...lesson} />
    </div>
  );
}
