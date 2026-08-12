import React from "react";
import A2MiniLearningBlock from "./A2MiniLearningBlock";

export const A2_DAYS_26_TO_28_LEARNING = {
  26: {
    title: "Gefühle in Situationen ausdrücken",
    rule: "Mit wenn beschreibst du eine Situation oder Bedingung. Im wenn-Satz steht das konjugierte Verb am Ende. Danach kannst du sagen, wie du dich fühlst.",
    examples: [
      "Ich bin nervös, wenn ich eine Prüfung habe.",
      "Wenn ich gute Nachrichten bekomme, bin ich froh.",
      "Ich bin enttäuscht, wenn ein Plan nicht klappt.",
      "Wenn ich müde bin, brauche ich eine Pause.",
    ],
    questions: [
      { stem: "Was passt? Ich bin froh, ___ ich meine Freunde sehe.", options: ["wenn", "als", "denn"], answer: 0, explanation: "wenn beschreibt eine wiederkehrende oder mögliche Situation." },
      { stem: "Welcher Satz ist richtig?", options: ["Wenn ich eine Prüfung habe, bin ich nervös.", "Wenn ich habe eine Prüfung, bin ich nervös.", "Wenn habe ich eine Prüfung, bin ich nervös."], answer: 0, explanation: "Im wenn-Satz steht das konjugierte Verb am Ende." },
      { stem: "Wie heißt das passende Gefühl? Die Nachricht ist sehr gut. Ich bin ___.", options: ["froh", "wütend", "traurig"], answer: 0, explanation: "froh passt zu einer positiven Nachricht." },
      { stem: "Was passt? Wenn ich sehr müde bin, ___ ich eine Pause.", options: ["brauche", "brauchen", "gebraucht"], answer: 0, explanation: "Im Hauptsatz steht das konjugierte Verb auf Position 2." },
    ],
    outputPrompt: "Beschreibe 4 Situationen und sage jeweils, wie du dich fühlst.",
    starters: ["Ich bin ..., wenn ...", "Wenn ..., bin ich ...", "In dieser Situation fühle ich mich ..."],
  },
  27: {
    title: "Über digitale Kommunikation sprechen",
    rule: "Mit dass kannst du eine Meinung oder Aussage genauer erklären. Nach dass steht das konjugierte Verb am Ende.",
    examples: [
      "Ich finde, dass WhatsApp praktisch ist.",
      "Ich glaube, dass E-Mails im Beruf wichtig sind.",
      "Ich denke, dass soziale Medien nützlich sein können.",
      "Mir ist wichtig, dass meine Daten sicher sind.",
    ],
    questions: [
      { stem: "Was passt? Ich finde, ___ E-Mails praktisch sind.", options: ["dass", "denn", "als"], answer: 0, explanation: "dass leitet einen Nebensatz nach einer Meinung oder Aussage ein." },
      { stem: "Welcher Satz ist richtig?", options: ["Ich glaube, dass soziale Medien nützlich sind.", "Ich glaube, dass sind soziale Medien nützlich.", "Ich glaube, soziale Medien dass nützlich sind."], answer: 0, explanation: "Im dass-Satz steht das Verb am Ende." },
      { stem: "Was passt? Mir ist wichtig, dass meine Daten sicher ___.", options: ["sind", "sein", "ist"], answer: 0, explanation: "Daten ist Plural: sie sind sicher." },
      { stem: "Welche Einleitung passt zu einer Meinung?", options: ["Ich denke, dass ...", "Ich gehe, dass ...", "Ich habe, dass ..."], answer: 0, explanation: "Ich denke/glaube/finde, dass ... ist eine nützliche A2-Struktur." },
    ],
    outputPrompt: "Sprich 5 Sätze über deine digitale Kommunikation und benutze mindestens zwei dass-Sätze.",
    starters: ["Ich benutze meistens ...", "Ich finde, dass ...", "Ich glaube, dass ...", "Mir ist wichtig, dass ..."],
  },
  28: {
    title: "Zukunft mit Futur I ausdrücken",
    rule: "Futur I bildet man mit werden + Infinitiv. Das konjugierte werden steht auf Position 2 und der Infinitiv am Satzende.",
    examples: [
      "Ich werde nächstes Jahr Deutsch weiterlernen.",
      "Wir werden später in einer größeren Wohnung leben.",
      "Sie wird nach Deutschland reisen.",
      "In Zukunft werde ich mehr Verantwortung übernehmen.",
    ],
    questions: [
      { stem: "Was passt? Ich ___ nächstes Jahr mehr lernen.", options: ["werde", "wird", "werden"], answer: 0, explanation: "ich → werde." },
      { stem: "Welcher Satz ist richtig?", options: ["Ich werde in Berlin arbeiten.", "Ich werde arbeiten in Berlin.", "Ich in Berlin werde arbeiten."], answer: 0, explanation: "werden steht auf Position 2, der Infinitiv am Ende." },
      { stem: "Was passt? Sie ___ später eine Ausbildung machen.", options: ["wird", "werde", "werden"], answer: 0, explanation: "sie (Singular) → wird." },
      { stem: "Welche Form beschreibt einen Zukunftsplan?", options: ["Ich werde nächstes Jahr reisen.", "Ich bin gestern gereist.", "Reise jetzt!"], answer: 0, explanation: "werden + Infinitiv bildet Futur I." },
    ],
    outputPrompt: "Sprich 5–6 Sätze über deine Pläne für nächstes Jahr und die weitere Zukunft.",
    starters: ["Nächstes Jahr werde ich ...", "In Zukunft werde ich ...", "Ich glaube, dass ich ...", "Mein Ziel ist ..."],
  },
};

export default function A2Days26To28LearningUpgrade({ day }) {
  const lesson = A2_DAYS_26_TO_28_LEARNING[Number(day)];
  if (!lesson) return null;
  return (
    <section data-a2-days26-28-learning-upgrade={`day-${day}`} style={{ display: "grid", gap: 8 }}>
      <div style={{ color: "#1e3a8a", fontWeight: 800 }}>A2 Day {day} · Schnell lernen, dann anwenden</div>
      <A2MiniLearningBlock {...lesson} />
    </section>
  );
}
