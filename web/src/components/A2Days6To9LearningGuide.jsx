import React from "react";
import A2MiniLearningBlock from "./A2MiniLearningBlock";

const guides = {
  6: {
    title: "Wo? oder Wohin? bei Möbeln und Räumen",
    rule: "Wo? beschreibt eine Position und nimmt Dativ. Wohin? beschreibt eine Bewegung und nimmt Akkusativ. Bei Wechselpräpositionen wie in, an, auf, unter, über, vor, hinter, neben und zwischen ändert sich deshalb oft der Artikel.",
    examples: [
      "Wo? Der Stuhl steht neben dem Tisch.",
      "Wohin? Ich stelle den Stuhl neben den Tisch.",
      "Wo? Das Bild hängt an der Wand.",
      "Wohin? Ich hänge das Bild an die Wand."
    ],
    questions: [
      { stem: "Wo steht der Stuhl?", options: ["Neben dem Tisch.", "Neben den Tisch."], answer: 0, explanation: "Wo? = Dativ: neben dem Tisch." },
      { stem: "Wohin stellst du den Stuhl?", options: ["Neben dem Tisch.", "Neben den Tisch."], answer: 1, explanation: "Wohin? = Akkusativ: neben den Tisch." },
      { stem: "Welcher Satz beschreibt eine Position?", options: ["Das Buch liegt auf dem Tisch.", "Ich lege das Buch auf den Tisch."], answer: 0, explanation: "liegen beschreibt einen Ort: Wo?" },
      { stem: "Was passt? Ich hänge das Bild ___ Wand.", options: ["an der", "an die"], answer: 1, explanation: "Bewegung zu einem Ziel: Wohin? = Akkusativ." }
    ],
    outputPrompt: "Beschreibe dein Zimmer mit zwei Wo-Sätzen und zwei Wohin-Sätzen.",
    starters: ["Mein Bett steht ...", "Der Schrank ist ...", "Ich stelle ...", "Ich hänge ..."]
  },
  7: {
    title: "Relativsätze: die Wohnung genauer beschreiben",
    rule: "Ein Relativsatz gibt zusätzliche Information zu einem Nomen. Das Relativpronomen richtet sich nach Genus und Funktion: der, die, das. Das Verb steht am Ende des Relativsatzes.",
    examples: [
      "Ich suche eine Wohnung, die nicht zu teuer ist.",
      "Ich brauche ein Zimmer, das viel Licht hat.",
      "Der Vermieter, der sehr freundlich ist, zeigt mir die Wohnung.",
      "Das ist die Wohnung, die ich besichtigen möchte."
    ],
    questions: [
      { stem: "Ich suche eine Wohnung, ___ einen Balkon hat.", options: ["der", "die", "das"], answer: 1, explanation: "die Wohnung → die." },
      { stem: "Ich brauche ein Zimmer, ___ ruhig ist.", options: ["der", "die", "das"], answer: 2, explanation: "das Zimmer → das." },
      { stem: "Wo steht das Verb im Relativsatz?", options: ["Am Anfang", "An Position 2", "Am Ende"], answer: 2, explanation: "Im Relativsatz steht das konjugierte Verb am Ende." },
      { stem: "Welcher Satz ist richtig?", options: ["Das ist die Wohnung, die ist günstig.", "Das ist die Wohnung, die günstig ist."], answer: 1, explanation: "Das Verb steht am Ende: günstig ist." }
    ],
    outputPrompt: "Beschreibe deine Wunschwohnung mit vier Relativsätzen.",
    starters: ["Ich suche eine Wohnung, die ...", "Ich möchte ein Zimmer, das ...", "Der Vermieter, der ...", "Wichtig ist eine Lage, die ..."]
  },
  8: {
    title: "Imperativ: ein Rezept Schritt für Schritt erklären",
    rule: "Mit dem Imperativ gibst du Anweisungen. du: Schneide! / ihr: Schneidet! / Sie: Schneiden Sie! Bei Rezepten stehen oft kurze Imperativsätze in einer klaren Reihenfolge.",
    examples: [
      "Schneide die Tomaten.",
      "Gib etwas Salz dazu.",
      "Mischt alle Zutaten gut.",
      "Backen Sie den Kuchen 30 Minuten."
    ],
    questions: [
      { stem: "Imperativ für du: ___ die Zwiebel klein.", options: ["Schneidest", "Schneide", "Schneiden Sie"], answer: 1, explanation: "du-Imperativ: Schneide!" },
      { stem: "Imperativ für ihr: ___ alles gut.", options: ["Mischt", "Mischen", "Mischst"], answer: 0, explanation: "ihr-Imperativ entspricht der ihr-Form ohne Pronomen." },
      { stem: "Höflicher Imperativ: ___ bitte das Wasser dazu.", options: ["Gib", "Gebt", "Geben Sie"], answer: 2, explanation: "Sie-Imperativ: Verb + Sie." },
      { stem: "Welche Reihenfolge klingt wie ein Rezept?", options: ["Zuerst ... Dann ... Zum Schluss ...", "Vielleicht ... Trotzdem ... Obwohl ..."], answer: 0, explanation: "Rezepte brauchen klare Schrittfolge." }
    ],
    outputPrompt: "Erkläre ein einfaches Rezept in 4–6 Imperativsätzen.",
    starters: ["Zuerst ...", "Dann ...", "Danach ...", "Zum Schluss ..."]
  },
  9: {
    title: "Perfekt: über den letzten Urlaub sprechen",
    rule: "Das Perfekt besteht aus haben oder sein + Partizip II. Viele Bewegungsverben und Zustandswechsel nehmen sein; die meisten anderen Verben nehmen haben.",
    examples: [
      "Ich bin nach Berlin gefahren.",
      "Wir haben ein Museum besucht.",
      "Ich habe viele Fotos gemacht.",
      "Am Abend sind wir ins Restaurant gegangen."
    ],
    questions: [
      { stem: "Ich ___ nach München gefahren.", options: ["habe", "bin"], answer: 1, explanation: "fahren mit Ortswechsel nimmt sein." },
      { stem: "Wir ___ ein Museum besucht.", options: ["haben", "sind"], answer: 0, explanation: "besuchen nimmt haben." },
      { stem: "Was ist das Partizip II von machen?", options: ["gemacht", "gemachen", "macht"], answer: 0, explanation: "machen → gemacht." },
      { stem: "Welcher Satz ist richtig?", options: ["Ich habe nach Berlin gefahren.", "Ich bin nach Berlin gefahren."], answer: 1, explanation: "fahren mit Bewegung: sein + gefahren." }
    ],
    outputPrompt: "Erzähle in 5–6 Sätzen von deinem letzten Urlaub.",
    starters: ["Letztes Jahr bin ich ...", "Ich habe ...", "Danach sind wir ...", "Am besten hat mir ... gefallen."]
  }
};

export default function A2Days6To9LearningGuide({ day }) {
  const guide = guides[Number(day)];
  if (!guide) return null;
  return <A2MiniLearningBlock {...guide} />;
}
