import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 10 };
const paragraph = { margin: 0, lineHeight: 1.78 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.8 };

export default function A2Day25TagesablaufGrammarPage() {
  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <header style={card}>
        <h1 style={{ ...styles.title, margin: 0 }}>A2 Day 25 · Tagesablauf</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Grammar: <strong>trennbare Verben</strong> + <strong>Zeitangaben</strong>.</p>
        <p style={paragraph}><strong>Learning goal:</strong> Describe a daily routine in a clear order and place separable verb prefixes correctly.</p>
      </header>

      <section style={card}>
        <h2 style={{ margin: 0 }}>1. Separable verbs split in the main clause</h2>
        <ul style={list}>
          <li><strong>aufstehen:</strong> Ich stehe um 6:30 Uhr <strong>auf</strong>.</li>
          <li><strong>einkaufen:</strong> Nach der Arbeit kaufe ich <strong>ein</strong>.</li>
          <li><strong>fernsehen:</strong> Abends sehe ich eine Stunde <strong>fern</strong>.</li>
          <li><strong>vorbereiten:</strong> Ich bereite meine Tasche am Abend <strong>vor</strong>.</li>
        </ul>
        <p style={paragraph}><strong>Pattern:</strong> conjugated verb in position 2 + prefix at the end.</p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>2. Put time first, but keep the verb second</h2>
        <ul style={list}>
          <li><strong>Morgens stehe ich</strong> früh auf.</li>
          <li><strong>Danach dusche ich</strong>.</li>
          <li><strong>Am Nachmittag mache ich</strong> meine Hausaufgaben.</li>
          <li><strong>Abends sehe ich</strong> kurz fern.</li>
        </ul>
        <p style={paragraph}>Useful sequence words: <strong>zuerst, dann, danach, später, am Nachmittag, abends, zum Schluss</strong>.</p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>3. Reflexive routine verbs</h2>
        <ul style={list}>
          <li>Ich <strong>ziehe mich</strong> an.</li>
          <li>Ich <strong>ruhe mich</strong> nach der Arbeit aus.</li>
          <li>Am Abend <strong>bereite ich mich</strong> auf den nächsten Tag vor.</li>
        </ul>
      </section>

      <A2MiniLearningBlock
        title="Knowledge Test · Tagesablauf"
        rule="In a main clause, separate the prefix and place it at the end. If a time phrase is first, the conjugated verb remains in position 2."
        examples={["Ich stehe um 6:30 Uhr auf.", "Danach ziehe ich mich an.", "Abends sehe ich kurz fern."]}
        questions={[
          { stem: "Which sentence is correct?", options: ["Ich aufstehe um 7 Uhr.", "Ich stehe um 7 Uhr auf.", "Ich um 7 Uhr aufstehe."], answer: 1, explanation: "The prefix auf goes to the end in a normal main clause." },
          { stem: "Morgens ___ ich mich schnell ___.", options: ["ziehe / an", "anziehe / —", "an / ziehe"], answer: 0, explanation: "anziehen splits: ich ziehe mich an." },
          { stem: "Which word best shows sequence?", options: ["danach", "ob", "wer"], answer: 0, explanation: "danach means afterwards." },
          { stem: "Which sentence has correct position 2?", options: ["Abends ich sehe fern.", "Abends sehe ich fern.", "Abends ich fern sehe."], answer: 1, explanation: "Time first, verb second." },
        ]}
        outputPrompt="Describe your normal day in 6–7 sentences. Use at least three time expressions and two separable verbs."
        starters={["Morgens ...", "Danach ...", "Am Nachmittag ...", "Abends ...", "Zum Schluss ..."]}
      />
    </div>
  );
}
