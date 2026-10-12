import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 12 };
const paragraph = { margin: 0, lineHeight: 1.7 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const example = {
  padding: "12px 14px",
  borderRadius: 12,
  background: "#f8fbff",
  border: "1px solid #dbeafe",
  display: "grid",
  gap: 6,
  lineHeight: 1.7,
};

const GrammarContent = () => (
  <div data-a2-day26-gefuehle-notes="true" style={{ display: "grid", gap: 16 }}>
    <header style={card}>
      <h1 style={{ ...styles.title, margin: 0 }}>A2 · Day 26 · Gefühle in verschiedenen Situationen</h1>
      <p style={{ ...styles.subtitle, margin: 0 }}>
        Grammar focus: <strong>sich fühlen</strong> + adjective; explain why with <strong>weil</strong>
        and describe a situation with <strong>wenn</strong>.
      </p>
      <p style={paragraph}>
        <strong>Learning goal:</strong> Say how you feel, why you feel that way and what you do in that situation.
      </p>
      <div style={example}>
        <strong>Start with a real situation</strong>
        <span>Vor einer Prüfung <strong>fühle ich mich nervös</strong>, weil ich gute Noten bekommen möchte.</span>
        <span>Before an exam I feel nervous because I want good grades.</span>
      </div>
    </header>

    <section style={card}>
      <h2 style={{ margin: 0 }}>1. Gefühle ausdrücken: sich fühlen + Adjektiv</h2>
      <p style={paragraph}>
        <strong>sich fühlen</strong> means <em>to feel</em>. It is a <strong>reflexive verb</strong>:
        the small word after the verb changes with the person.
      </p>
      <div style={example}>
        <strong>Person + fühlen + reflexive pronoun + feeling</strong>
        <span>ich <strong>fühle mich</strong> · du <strong>fühlst dich</strong> · er/sie <strong>fühlt sich</strong></span>
        <span>wir <strong>fühlen uns</strong> · ihr <strong>fühlt euch</strong> · sie/Sie <strong>fühlen sich</strong></span>
      </div>
      <ul style={list}>
        <li>Ich <strong>fühle mich</strong> glücklich. (I feel happy.)</li>
        <li>Du <strong>fühlst dich</strong> nach dem Gespräch besser. (You feel better after the conversation.)</li>
        <li>Nach der Prüfung <strong>fühlen wir uns</strong> erleichtert. (After the exam we feel relieved.)</li>
      </ul>
      <p style={paragraph}>
        You can also say <strong>Ich bin nervös</strong>. Both are correct:
        <em> ich bin nervös</em> describes your state; <em>ich fühle mich nervös</em> emphasizes how you feel.
        The adjective does not change: <strong>ich fühle mich nervös</strong>, not <em>nervöse</em>.
      </p>
      <p style={paragraph}>
        <strong>Useful feelings:</strong> glücklich (happy), traurig (sad), nervös (nervous),
        erleichtert (relieved), stolz (proud), enttäuscht (disappointed), wütend (angry).
      </p>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>2. Warum? Explain the reason with weil</h2>
      <p style={paragraph}>
        Ask <strong>Warum?</strong> (Why?) and answer with <strong>weil</strong> (because).
        Put a comma before <em>weil</em>; in the <em>weil</em>-clause the
        <strong> conjugated verb goes to the end</strong>.
      </p>
      <div style={example}>
        <strong>Feeling + , weil + subject + information + verb at the end</strong>
        <span>Ich fühle mich nervös, <strong>weil ich morgen eine Prüfung habe</strong>.</span>
        <span>Ich bin stolz, <strong>weil ich die Prüfung bestanden habe</strong>.</span>
      </div>
      <p style={paragraph}>
        In the second example, the Perfekt helping verb <strong>habe</strong> comes last.
        Compare: <strong>Ich habe die Prüfung bestanden.</strong> →
        <strong> ..., weil ich die Prüfung bestanden habe.</strong>
      </p>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>3. Wann? Describe a situation with wenn</h2>
      <p style={paragraph}>
        Use <strong>wenn</strong> (when/if) for a repeated situation or condition.
        Like <em>weil</em>, it sends the conjugated verb to the end of its clause.
        If the <em>wenn</em>-clause comes first, the main-clause verb comes
        <strong> directly after the comma</strong>.
      </p>
      <div style={example}>
        <strong>Wenn + situation + verb, verb + person + feeling/reaction</strong>
        <span><strong>Wenn ich gute Nachrichten bekomme</strong>, <strong>freue</strong> ich mich.</span>
        <span><strong>Wenn ich gestresst bin</strong>, <strong>gehe</strong> ich spazieren.</span>
      </div>
      <p style={paragraph}>
        <strong>weil = why</strong> (reason): Ich bin nervös, <strong>weil ich morgen eine Prüfung habe</strong>.
        <strong> wenn = when/if</strong> (situation): <strong>Wenn ich eine Prüfung habe</strong>, bin ich oft nervös.
      </p>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>4. Build your own A2 answer</h2>
      <p style={paragraph}>Connect three short ideas instead of memorising a long text.</p>
      <ol style={list}>
        <li><strong>Situation:</strong> Vor einem Vorstellungsgespräch … (Before a job interview …)</li>
        <li><strong>Feeling + reason:</strong> … fühle ich mich nervös, weil ich einen guten Eindruck machen möchte.</li>
        <li><strong>Reaction:</strong> Wenn ich nervös bin, atme ich langsam.</li>
      </ol>
      <div style={example}>
        <strong>Model answer</strong>
        <span>
          Vor einem Vorstellungsgespräch fühle ich mich nervös, weil ich einen guten Eindruck
          machen möchte. Wenn ich nervös bin, atme ich langsam. Danach fühle ich mich ruhiger.
        </span>
      </div>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>5. Häufige Fehler · Common mistakes</h2>
      <ul style={list}>
        <li>❌ Ich fühle nervös. → ✅ Ich <strong>fühle mich</strong> nervös. (Don't omit the reflexive pronoun.)</li>
        <li>❌ Ich bin froh, weil ich habe frei. → ✅ Ich bin froh, <strong>weil ich frei habe</strong>. (Verb last after <em>weil</em>.)</li>
        <li>❌ Wenn ich Stress habe, ich gehe spazieren. → ✅ <strong>Wenn ich Stress habe, gehe ich</strong> spazieren. (Main verb immediately after the comma.)</li>
      </ul>
    </section>

    <A2MiniLearningBlock
      essential
      title="Kurz prüfen · Gefühle"
      english="Choose the correct pronoun, a reason (weil), or a situation (wenn)."
      rule="sich fühlen needs a reflexive pronoun. After weil/wenn, the conjugated verb goes to the end; when the wenn-clause is first, the next verb follows the comma."
      examples={[
        "Ich fühle mich erleichtert, weil die Prüfung vorbei ist.",
        "Wenn ich gute Nachrichten bekomme, freue ich mich.",
      ]}
      questions={[
        {
          stem: "Ich ___ nach der Prüfung erleichtert.",
          options: ["fühle mich", "fühle", "mich fühle"],
          answer: 0,
          explanation: "With ich, use fühle mich.",
        },
        {
          stem: "Ich bin enttäuscht, ___ mein Team verloren hat.",
          options: ["wenn", "weil", "dann"],
          answer: 1,
          explanation: "The speaker gives a reason (why), so use weil; hat goes to the end.",
        },
        {
          stem: "Which sentence has correct wenn word order?",
          options: [
            "Wenn ich nervös bin, höre ich Musik.",
            "Wenn ich bin nervös, höre ich Musik.",
            "Wenn ich nervös bin, ich höre Musik.",
          ],
          answer: 0,
          explanation: "The wenn-clause ends with bin, then höre starts the main clause.",
        },
      ]}
      outputPrompt="Beschreibe zwei Situationen. Sage, wie du dich fühlst, warum und was du dann machst."
      starters={[
        "Vor ... fühle ich mich ..., weil ...",
        "Wenn ich ..., ...",
      ]}
    />
  </div>
);

export default function A2Day26GefuehleGrammarPage({ embedded = false }) {
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
