import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

export default function A2StarterConjunctionsPage() {
  return <div style={{ ...styles.container, display:"grid", gap:16 }}>
    <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
    <header style={{ ...styles.card, display:"grid", gap:8 }}>
      <h1 style={{ ...styles.title, margin:0 }}>A2 Starter Grammar Note: weil, deshalb, denn</h1>
      <p style={{ ...styles.subtitle, margin:0 }}>Topic: Small talk • Day 1 • Chapter 1.1</p>
      <p style={{ margin:0, color:"#475569" }}>Ziel: kurze Gründe geben und die richtige Wortstellung sehen.</p>
    </header>

    <A2MiniLearningBlock
      title="Drei Wörter – drei Satzmuster"
      rule="weil schickt das konjugierte Verb ans Ende. denn behält die normale Wortstellung. Nach deshalb kommt sofort das Verb."
      examples={[
        "weil: Ich bleibe zu Hause, weil ich krank bin.",
        "denn: Ich bleibe zu Hause, denn ich bin krank.",
        "deshalb: Ich bin krank. Deshalb bleibe ich zu Hause.",
        "Natürliches Small Talk: Mir geht es gut, weil ich heute frei habe."
      ]}
      questions={[
        { stem:"Welcher Satz ist richtig?", options:["Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte.","Ich lerne Deutsch, weil ich möchte in Deutschland arbeiten."], answer:0, explanation:"Bei weil steht das konjugierte Verb am Ende." },
        { stem:"Welcher Satz mit deshalb ist richtig?", options:["Ich bin müde. Deshalb ich gehe früh schlafen.","Ich bin müde. Deshalb gehe ich früh schlafen."], answer:1, explanation:"Nach deshalb steht das Verb direkt an Position 2." },
        { stem:"Welcher Satz mit denn ist richtig?", options:["Ich trinke Tee, denn Kaffee ist mir zu stark.","Ich trinke Tee, denn Kaffee mir zu stark ist."], answer:0, explanation:"denn verbindet zwei Hauptsätze; die normale Wortstellung bleibt." },
        { stem:"Was passt? Es regnet. ___ bleibe ich zu Hause.", options:["Weil","Deshalb","Denn"], answer:1, explanation:"Der erste Satz nennt den Grund; deshalb leitet die Folge ein." }
      ]}
      outputPrompt="Bilde drei kurze Sätze über deinen heutigen Tag: einmal mit weil, einmal mit denn und einmal mit deshalb."
      starters={["Ich bin heute ..., weil ...", "Ich ..., denn ...", "Ich habe ..., deshalb ..."]}
    />
  </div>;
}
