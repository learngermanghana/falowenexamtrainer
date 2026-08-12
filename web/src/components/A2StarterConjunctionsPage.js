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
      <p style={{ margin:0, color:"#475569", lineHeight:1.7 }}>
        <strong>Learning goal:</strong> You will learn how to give a simple reason in German and how the word order changes. Du lernst, einen einfachen Grund zu nennen und die richtige Wortstellung zu benutzen.
      </p>
    </header>

    <section style={{ ...styles.card, display:"grid", gap:10 }}>
      <h2 style={{ margin:0 }}>1. First think about the message</h2>
      <p style={{ margin:0, lineHeight:1.7 }}>
        Before choosing a German connector, ask yourself: <strong>Am I giving a reason, or am I showing a result?</strong>
      </p>
      <ul style={{ margin:0, paddingLeft:22, lineHeight:1.8 }}>
        <li><strong>Reason / Grund:</strong> Why? → use <strong>weil</strong> or <strong>denn</strong>.</li>
        <li><strong>Result / Folge:</strong> What happens because of that? → use <strong>deshalb</strong>.</li>
      </ul>
      <p style={{ margin:0, lineHeight:1.7 }}>
        Example idea: <strong>I am tired.</strong> Why? Because I worked a lot. Result? I go to bed early.
      </p>
    </section>

    <A2MiniLearningBlock
      title="2. Three connectors – three sentence patterns"
      rule="weil = because: the conjugated verb moves to the end. denn = because: normal main-clause word order stays. deshalb = therefore/that is why: deshalb comes first and the verb follows immediately in position 2."
      examples={[
        "WEIL → Ich bin müde, weil ich viel gearbeitet habe. (I am tired because I worked a lot.)",
        "DENN → Ich bin müde, denn ich habe viel gearbeitet. (I am tired because I worked a lot.)",
        "DESHALB → Ich bin müde. Deshalb gehe ich früh schlafen. (I am tired. Therefore I go to bed early.)",
        "Small Talk → Mir geht es gut, weil ich heute frei habe. (I am doing well because I am off today.)"
      ]}
      questions={[
        { stem:"You want to say: I learn German because I want to work in Germany. Which sentence is correct?", options:["Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte.","Ich lerne Deutsch, weil ich möchte in Deutschland arbeiten."], answer:0, explanation:"After weil, the conjugated verb goes to the end: ... arbeiten möchte." },
        { stem:"You already gave the reason and now want to show the result. Which sentence is correct?", options:["Ich bin müde. Deshalb ich gehe früh schlafen.","Ich bin müde. Deshalb gehe ich früh schlafen."], answer:1, explanation:"Deshalb introduces the result. When deshalb is first, the verb comes directly after it: Deshalb gehe ich ..." },
        { stem:"Which sentence with denn is correct?", options:["Ich trinke Tee, denn Kaffee ist mir zu stark.","Ich trinke Tee, denn Kaffee mir zu stark ist."], answer:0, explanation:"Denn connects two main clauses, so normal word order remains: Kaffee ist ..." },
        { stem:"Think about the meaning: Es regnet. ___ bleibe ich zu Hause. Which word shows the result?", options:["Weil","Deshalb","Denn"], answer:1, explanation:"It is raining = reason. Staying at home = result. So use deshalb." }
      ]}
      outputPrompt="Now build your own ideas. First decide: reason or result? Then make three short sentences about your day: one with weil, one with denn and one with deshalb."
      starters={["Ich bin heute ..., weil ...", "Ich ..., denn ...", "Ich habe ..., deshalb ..."]}
    />

    <section style={{ ...styles.card, display:"grid", gap:10 }}>
      <h2 style={{ margin:0 }}>3. A simple thinking routine</h2>
      <p style={{ margin:0, lineHeight:1.7 }}><strong>Idea → meaning → connector → word order → sentence</strong></p>
      <p style={{ margin:0, lineHeight:1.7 }}>
        Example: <strong>Deutsch lernen → reason → weil → verb at the end → Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte.</strong>
      </p>
      <p style={{ margin:0, lineHeight:1.7, color:"#475569" }}>
        Don’t try to memorize a long German rule first. Understand what you want to express, then choose the sentence pattern.
      </p>
    </section>
  </div>;
}
