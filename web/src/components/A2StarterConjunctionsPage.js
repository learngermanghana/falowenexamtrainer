import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 10 };
const paragraph = { margin: 0, lineHeight: 1.78 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.8 };

export default function A2StarterConjunctionsPage() {
  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

      <header style={card}>
        <h1 style={{ ...styles.title, margin: 0 }}>A2 Day 1 · Small Talk 1.1</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Grammar: <strong>giving reasons and showing results</strong> with <strong>weil</strong>, <strong>denn</strong> and <strong>deshalb</strong>.</p>
        <p style={paragraph}>
          <strong>Learning goal:</strong> Do not just memorise three connector words. First decide whether you want to give a
          <strong> reason</strong> (Grund) or show a <strong>result</strong> (Folge). Then use the correct German word order.
        </p>
      </header>

      <section style={card}>
        <h2 style={{ margin: 0 }}>1. First understand the meaning: reason or result?</h2>
        <p style={paragraph}>
          In small talk, you often explain <strong>why</strong> something is true. For this, German commonly uses <strong>weil</strong>
          or <strong>denn</strong>. If you want to show <strong>what happens as a result</strong>, use <strong>deshalb</strong>.
        </p>
        <ul style={list}>
          <li><strong>Reason (Grund):</strong> Ich bin heute müde. Warum? → Ich habe schlecht geschlafen.</li>
          <li><strong>With weil:</strong> Ich bin heute müde, <strong>weil ich schlecht geschlafen habe</strong>.</li>
          <li><strong>With denn:</strong> Ich bin heute müde, <strong>denn ich habe schlecht geschlafen</strong>.</li>
          <li><strong>Result (Folge):</strong> Ich habe schlecht geschlafen. <strong>Deshalb bin ich heute müde</strong>.</li>
        </ul>
        <p style={paragraph}>
          The information can be very similar, but the direction changes: <strong>weil/denn introduce the reason;</strong>
          <strong> deshalb introduces the result.</strong>
        </p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>2. weil: the conjugated verb goes to the end</h2>
        <p style={paragraph}>
          <strong>weil</strong> introduces a subordinate clause (Nebensatz). In this clause, the conjugated verb moves to the end.
          There is normally a comma before the <strong>weil</strong> clause.
        </p>
        <ul style={list}>
          <li>Ich lerne Deutsch, <strong>weil ich in Deutschland arbeiten möchte</strong>.</li>
          <li>Ich bleibe heute zu Hause, <strong>weil ich krank bin</strong>.</li>
          <li>Ich bin entspannt, <strong>weil ich heute frei habe</strong>.</li>
        </ul>
        <p style={paragraph}>
          <strong>With a modal verb:</strong> the modal verb comes at the end: … weil ich in Deutschland arbeiten <strong>möchte</strong>.
          <br /><strong>With Perfekt:</strong> the conjugated auxiliary comes at the end: … weil ich schlecht geschlafen <strong>habe</strong>.
        </p>
        <p style={paragraph}>
          The <strong>weil</strong> clause can also come first: <strong>Weil ich morgen früh arbeite, gehe ich heute früh ins Bett.</strong>
          When the subordinate clause comes first, the main clause begins immediately with the verb: <strong>gehe ich</strong>.
        </p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>3. denn: normal main-clause word order stays</h2>
        <p style={paragraph}>
          <strong>denn</strong> also means <strong>because</strong>, but it does not send the verb to the end. After <strong>denn</strong>,
          you keep normal main-clause word order: subject + conjugated verb + the rest of the sentence.
        </p>
        <ul style={list}>
          <li>Ich lerne Deutsch, <strong>denn ich möchte in Deutschland arbeiten</strong>.</li>
          <li>Ich trinke Tee, <strong>denn Kaffee ist mir zu stark</strong>.</li>
          <li>Ich gehe heute früh nach Hause, <strong>denn ich bin müde</strong>.</li>
        </ul>
        <p style={paragraph}>
          Compare: <strong>weil ich müde bin</strong> ↔ <strong>denn ich bin müde</strong>. The meaning is similar, but the German
          word order is different.
        </p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>4. deshalb: show the result, then put the verb in position 2</h2>
        <p style={paragraph}>
          <strong>deshalb</strong> means <strong>therefore / that is why</strong>. It is not used like <strong>weil</strong> or
          <strong>denn</strong>. When <strong>deshalb</strong> is in position 1, the conjugated verb must come immediately after it
          in position 2.
        </p>
        <ul style={list}>
          <li>Ich bin müde. <strong>Deshalb gehe ich</strong> früh schlafen.</li>
          <li>Es regnet. <strong>Deshalb bleibe ich</strong> zu Hause.</li>
          <li>Ich habe morgen Unterricht. <strong>Deshalb stehe ich</strong> früh auf.</li>
        </ul>
        <p style={paragraph}>
          <strong>Wrong:</strong> Deshalb ich gehe früh schlafen. <br />
          <strong>Correct:</strong> Deshalb <strong>gehe ich</strong> früh schlafen.
        </p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>5. The same idea with three different structures</h2>
        <p style={paragraph}>Basic idea: <strong>Ich bin krank. Ich bleibe zu Hause.</strong></p>
        <ul style={list}>
          <li><strong>weil:</strong> Ich bleibe zu Hause, <strong>weil ich krank bin</strong>.</li>
          <li><strong>denn:</strong> Ich bleibe zu Hause, <strong>denn ich bin krank</strong>.</li>
          <li><strong>deshalb:</strong> Ich bin krank. <strong>Deshalb bleibe ich zu Hause</strong>.</li>
        </ul>
        <p style={paragraph}>
          Memory rule: <strong>weil = verb at the end</strong> · <strong>denn = normal word order</strong> ·
          <strong> deshalb = deshalb + verb + subject</strong>.
        </p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>6. How to use this grammar in real small talk</h2>
        <p style={paragraph}>
          A natural answer often contains a short piece of information, a reason and a follow-up question. This helps the conversation
          continue instead of sounding like a list of short answers.
        </p>
        <p style={paragraph}>
          <strong>A:</strong> Wie geht es dir heute?<br />
          <strong>B:</strong> Ganz gut, <strong>weil ich heute frei habe</strong>. Und dir?<br />
          <strong>A:</strong> Ich bin etwas müde, <strong>denn ich habe gestern lange gearbeitet</strong>.<br />
          <strong>B:</strong> Ach so. Musst du heute wieder arbeiten?<br />
          <strong>A:</strong> Nein. Ich habe heute keine Termine. <strong>Deshalb kann ich mich ausruhen</strong>.
        </p>
        <p style={paragraph}>
          The goal is not grammar in isolation. These structures help you <strong>extend an answer, explain yourself and keep a conversation going</strong>.
        </p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>7. Common mistakes</h2>
        <ul style={list}>
          <li><strong>Wrong:</strong> weil ich bin müde. → <strong>Correct:</strong> weil ich müde <strong>bin</strong>.</li>
          <li><strong>Wrong:</strong> denn ich müde bin. → <strong>Correct:</strong> denn ich <strong>bin</strong> müde.</li>
          <li><strong>Wrong:</strong> Deshalb ich bleibe zu Hause. → <strong>Correct:</strong> Deshalb <strong>bleibe ich</strong> zu Hause.</li>
          <li><strong>Wrong:</strong> Ich lerne Deutsch weil ich in Deutschland arbeiten möchte. → Add the comma: Ich lerne Deutsch, <strong>weil</strong> ...</li>
          <li><strong>Meaning mistake:</strong> <strong>deshalb</strong> does not directly answer “Why?”. It shows the <strong>result</strong>.</li>
        </ul>
      </section>

      <A2MiniLearningBlock
        title="Knowledge Test · weil, denn, deshalb"
        rule="First decide: reason or result? Then check the German word order."
        examples={[
          "Reason + weil → verb at the end",
          "Reason + denn → normal main-clause word order",
          "Result + deshalb → deshalb + verb + subject",
        ]}
        questions={[
          { stem: "Which sentence with weil has the correct word order?", options: ["Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte.", "Ich lerne Deutsch, weil ich möchte in Deutschland arbeiten."], answer: 0, explanation: "In a weil-clause, the conjugated verb goes to the end: arbeiten möchte." },
          { stem: "Which sentence with denn has the correct word order?", options: ["Ich bin müde, denn ich habe schlecht geschlafen.", "Ich bin müde, denn ich schlecht geschlafen habe."], answer: 0, explanation: "After denn, normal main-clause word order stays: ich habe schlecht geschlafen." },
          { stem: "Es regnet. ___ bleibe ich zu Hause.", options: ["Weil", "Deshalb", "Denn"], answer: 1, explanation: "The rain is the reason; staying home is the result. Deshalb introduces the result." },
          { stem: "Which word order is correct after deshalb?", options: ["Deshalb ich gehe früh.", "Deshalb gehe ich früh.", "Deshalb ich früh gehe."], answer: 1, explanation: "Deshalb is in position 1, so the conjugated verb comes immediately after it in position 2." },
          { stem: "Which sentence directly means: I stay home because I am sick?", options: ["Ich bleibe zu Hause, weil ich krank bin.", "Ich bin krank. Deshalb bleibe ich zu Hause.", "Both sentences show the same relationship, but sentence A uses because directly."], answer: 2, explanation: "A uses weil to give the reason directly. B expresses the same logic as reason + result." },
          { stem: "Complete the sentence: weil ich gestern lange gearbeitet ___", options: ["habe", "bin", "hat"], answer: 0, explanation: "In Perfekt, the conjugated auxiliary goes to the end of the weil-clause: gearbeitet habe." },
          { stem: "Which answer sounds more natural in small talk?", options: ["Gut.", "Gut, weil ich heute frei habe. Und dir?"], answer: 1, explanation: "A little information + a reason + a follow-up question keeps the conversation going." },
          { stem: "Which statement is correct?", options: ["weil and denn always use the same word order.", "deshalb usually introduces a result.", "after denn the verb goes to the end."], answer: 1, explanation: "Deshalb connects a reason with its result. The other two statements are grammatically incorrect." },
        ]}
        outputPrompt="Write or say five small-talk sentences about your day: two with weil, one with denn, one with deshalb, and one follow-up question."
        starters={["Mir geht es ..., weil ...", "Ich ..., denn ...", "Ich habe ..., deshalb ...", "Und du? ..."]}
      />
    </div>
  );
}
