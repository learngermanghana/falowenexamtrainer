import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 10 };
const paragraph = { margin: 0, lineHeight: 1.78 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.8 };

export default function A2Day26GefuehleGrammarPage() {
  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <header style={card}>
        <h1 style={{ ...styles.title, margin: 0 }}>A2 Day 26 · Gefühle</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Grammar: <strong>sich fühlen</strong>, <strong>weil</strong> and <strong>wenn</strong>.</p>
        <p style={paragraph}><strong>Learning goal:</strong> Describe a feeling, explain its reason and connect it to a situation.</p>
      </header>

      <section style={card}>
        <h2 style={{ margin: 0 }}>1. sich fühlen + adjective</h2>
        <ul style={list}>
          <li>Ich <strong>fühle mich</strong> nervös.</li>
          <li>Du <strong>fühlst dich</strong> heute besser.</li>
          <li>Nach der Prüfung <strong>fühlen wir uns</strong> erleichtert.</li>
        </ul>
        <p style={paragraph}>Common adjectives: <strong>glücklich, traurig, nervös, erleichtert, stolz, enttäuscht, wütend, ruhig</strong>.</p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>2. Explain the reason with weil</h2>
        <ul style={list}>
          <li>Ich bin nervös, <strong>weil ich morgen eine Prüfung habe</strong>.</li>
          <li>Sie ist stolz, <strong>weil sie die Prüfung bestanden hat</strong>.</li>
          <li>Ich fühle mich besser, <strong>weil ich mit meiner Freundin gesprochen habe</strong>.</li>
        </ul>
        <p style={paragraph}><strong>Rule:</strong> In the <em>weil</em>-clause, the conjugated verb goes to the end.</p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>3. Describe a recurring situation with wenn</h2>
        <ul style={list}>
          <li><strong>Wenn ich zu wenig schlafe, bin ich müde.</strong></li>
          <li><strong>Wenn ich gute Nachrichten bekomme, freue ich mich.</strong></li>
          <li><strong>Wenn ich gestresst bin, gehe ich spazieren.</strong></li>
        </ul>
        <p style={paragraph}>When the <em>wenn</em>-clause comes first, the main-clause verb follows immediately after the comma.</p>
      </section>

      <A2MiniLearningBlock
        title="Knowledge Test · Gefühle"
        rule="Use sich fühlen + adjective for feelings, weil for a reason and wenn for a situation or condition."
        examples={["Ich fühle mich nervös.", "Ich bin erleichtert, weil die Prüfung vorbei ist.", "Wenn ich gestresst bin, höre ich Musik."]}
        questions={[
          { stem: "Which sentence is correct?", options: ["Ich fühle nervös.", "Ich fühle mich nervös.", "Ich mich fühle nervös."], answer: 1, explanation: "sich fühlen is reflexive: ich fühle mich." },
          { stem: "Which clause gives a reason?", options: ["weil ich müde bin", "wenn ich müde bin", "morgen um acht"], answer: 0, explanation: "weil introduces a reason." },
          { stem: "Which sentence has correct weil word order?", options: ["weil ich bin müde", "weil ich müde bin", "weil bin ich müde"], answer: 1, explanation: "The conjugated verb goes to the end." },
          { stem: "Which sentence describes a situation?", options: ["Wenn ich Stress habe, gehe ich spazieren.", "Weil ich Stress habe?", "Ich Stress habe."], answer: 0, explanation: "wenn is used for a condition or recurring situation." },
        ]}
        outputPrompt="Describe three situations, how you feel and why. Use one weil-sentence and one wenn-sentence."
        starters={["Vor ... fühle ich mich ...", "Ich bin ..., weil ...", "Wenn ich ..., dann ..."]}
      />
    </div>
  );
}
