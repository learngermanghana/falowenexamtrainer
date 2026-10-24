import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 10 };
const paragraph = { margin: 0, lineHeight: 1.78 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.8 };

const GrammarContent = () => (
  <div style={{ display: "grid", gap: 16 }}>
    <header style={card}>
      <h1 style={{ ...styles.title, margin: 0 }}>A2 Day 24 · Einen Urlaub planen</h1>
      <p style={{ ...styles.subtitle, margin: 0 }}>
        Grammar: <strong>wenn</strong>, <strong>falls</strong>, <strong>weil</strong> und <strong>um … zu</strong>.
      </p>
      <p style={paragraph}>
        <strong>Learning goal:</strong> Connect holiday plans clearly: describe a condition, a less certain possibility,
        a reason and a purpose.
      </p>
    </header>

    <section style={card}>
      <h2 style={{ margin: 0 }}>1. wenn · when / if</h2>
      <p style={paragraph}>
        Use <strong>wenn</strong> for a condition or for something that can happen now or in the future.
        In the <strong>wenn</strong>-clause, the conjugated verb goes to the end.
      </p>
      <ul style={list}>
        <li>Wir fahren ans Meer, <strong>wenn das Wetter schön ist</strong>.</li>
        <li><strong>Wenn wir genug Geld haben</strong>, buchen wir ein Hotel.</li>
        <li><strong>Wenn ich Urlaub habe</strong>, reise ich gern.</li>
      </ul>
      <p style={paragraph}>
        <strong>Word order:</strong> wenn + subject + rest + <strong>verb at the end</strong>.
        If the wenn-clause comes first, the main-clause verb comes directly after the comma:
        <strong> Wenn das Wetter schön ist, fahren wir ans Meer.</strong>
      </p>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>2. falls · if / in case</h2>
      <p style={paragraph}>
        Use <strong>falls</strong> when the condition is possible but less certain. It is useful when making a Plan B.
        The conjugated verb also goes to the end.
      </p>
      <ul style={list}>
        <li><strong>Falls es regnet</strong>, bleiben wir im Hotel.</li>
        <li><strong>Falls der Flug zu teuer ist</strong>, fahren wir mit dem Zug.</li>
        <li>Wir nehmen eine Jacke mit, <strong>falls es kalt wird</strong>.</li>
      </ul>
      <p style={paragraph}>
        <strong>wenn</strong> = a normal or expected condition. <strong>falls</strong> = a possibility you are less sure about.
      </p>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>3. weil · give a reason</h2>
      <p style={paragraph}>
        Use <strong>weil</strong> to explain <strong>why</strong> you choose a destination, hotel, transport option or activity.
        The conjugated verb goes to the end.
      </p>
      <ul style={list}>
        <li>Wir fahren nach München, <strong>weil wir die Stadt sehen möchten</strong>.</li>
        <li>Ich buche dieses Hotel, <strong>weil es günstig ist</strong>.</li>
        <li>Wir fahren mit dem Zug, <strong>weil er bequem ist</strong>.</li>
        <li>Ich reise im August, <strong>weil ich dann Urlaub habe</strong>.</li>
      </ul>
      <p style={paragraph}>
        <strong>Pattern:</strong> Hauptsatz + <strong>weil</strong> + subject + rest + <strong>verb at the end</strong>.
      </p>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>4. um … zu · express a purpose</h2>
      <p style={paragraph}>
        Use <strong>um … zu</strong> to explain <strong>what the purpose of an action is</strong>.
        Usually, the person doing both actions is the same.
      </p>
      <ul style={list}>
        <li>Wir fahren nach Berlin, <strong>um die Stadt zu besichtigen</strong>.</li>
        <li>Ich fahre ans Meer, <strong>um mich zu entspannen</strong>.</li>
        <li>Wir buchen ein Hotel, <strong>um dort drei Nächte zu bleiben</strong>.</li>
        <li>Ich spare Geld, <strong>um im Sommer nach Österreich zu reisen</strong>.</li>
      </ul>
      <p style={paragraph}>
        <strong>Structure:</strong> main clause + <strong>um</strong> + rest + <strong>zu + infinitive</strong>.
        Do not add a second subject after <strong>um</strong>.
      </p>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>5. Which connector do you need?</h2>
      <ul style={list}>
        <li><strong>wenn</strong> → normal condition: <em>Wenn das Wetter gut ist, gehen wir wandern.</em></li>
        <li><strong>falls</strong> → less certain condition / Plan B: <em>Falls es regnet, besuchen wir ein Museum.</em></li>
        <li><strong>weil</strong> → reason: <em>Wir fahren nach Wien, weil die Stadt interessant ist.</em></li>
        <li><strong>um … zu</strong> → purpose: <em>Wir fahren nach Wien, um die Stadt zu besichtigen.</em></li>
      </ul>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>6. Put the holiday plan together</h2>
      <p style={paragraph}>
        <strong>Example:</strong> Im August fahren wir nach Österreich, <strong>weil wir die Berge mögen</strong>.
        <strong>Wenn das Wetter schön ist</strong>, gehen wir wandern.
        <strong>Falls es regnet</strong>, besuchen wir ein Museum.
        Wir nehmen eine Kamera mit, <strong>um viele Fotos zu machen</strong>.
      </p>
      <p style={paragraph}>
        A strong A2 answer does more than list plans. It connects ideas with a <strong>condition</strong>,
        a <strong>Plan B</strong>, a <strong>reason</strong> and a <strong>purpose</strong>.
      </p>
    </section>

    <A2MiniLearningBlock
      title="Knowledge Test · Urlaub planen"
      english="Choose the connector that matches the meaning: normal condition, less-certain condition, reason or purpose."
      rule="wenn, falls and weil introduce subordinate clauses, so the conjugated verb goes to the end. Use um … zu + infinitive to express purpose when the subject is the same."
      examples={[
        "Wenn das Wetter schön ist, fahren wir ans Meer.",
        "Falls es regnet, bleiben wir im Hotel.",
        "Wir fahren nach Wien, weil die Stadt interessant ist.",
        "Wir fahren nach Wien, um die Stadt zu besichtigen.",
      ]}
      commonMistake="Do not use weil for purpose. Reason: Ich fahre nach Berlin, weil ich die Stadt mag. Purpose: Ich fahre nach Berlin, um die Stadt zu besichtigen."
      questions={[
        {
          stem: "___ das Wetter schön ist, gehen wir wandern.",
          options: ["Wenn", "Weil", "Um"],
          answer: 0,
          explanation: "This is a normal condition, so use wenn.",
        },
        {
          stem: "___ es regnet, besuchen wir ein Museum.",
          options: ["Falls", "Weil", "Um"],
          answer: 0,
          explanation: "This is a possible Plan B, so falls is appropriate.",
        },
        {
          stem: "Wir buchen dieses Hotel, ___ es günstig ist.",
          options: ["wenn", "weil", "um"],
          answer: 1,
          explanation: "The sentence gives a reason, so use weil.",
        },
        {
          stem: "Wir fahren nach Berlin, ___ die Stadt zu besichtigen.",
          options: ["weil", "falls", "um"],
          answer: 2,
          explanation: "The sentence expresses purpose: um … zu + infinitive.",
        },
        {
          stem: "Which sentence has the correct word order?",
          options: [
            "Wenn das Wetter ist schön, fahren wir ans Meer.",
            "Wenn das Wetter schön ist, fahren wir ans Meer.",
            "Wenn ist das Wetter schön, fahren wir ans Meer.",
          ],
          answer: 1,
          explanation: "In a wenn-clause, the conjugated verb goes to the end.",
        },
        {
          stem: "Which sentence correctly expresses purpose?",
          options: [
            "Ich spare Geld, weil im Sommer zu reisen.",
            "Ich spare Geld, um im Sommer zu reisen.",
            "Ich spare Geld, falls im Sommer zu reisen.",
          ],
          answer: 1,
          explanation: "Use um … zu + infinitive to express purpose.",
        },
      ]}
      outputPrompt="Plane einen Urlaub in 4–6 Sätzen. Benutze mindestens einmal wenn, falls, weil und um … zu."
      starters={[
        "Wir fahren nach ..., weil ...",
        "Wenn ..., ...",
        "Falls ..., ...",
        "Wir ..., um ... zu ...",
      ]}
    />
  </div>
);

export default function A2Day24EinenUrlaubPlanenGrammarPage({ embedded = false }) {
  if (embedded) return <GrammarContent />;

  return (
    <main style={styles.pageWrap}>
      <div style={{ ...styles.container, display: "grid", gap: 16 }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <GrammarContent />
      </div>
    </main>
  );
}
