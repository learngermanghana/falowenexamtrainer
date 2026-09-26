import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 10 };
const paragraph = { margin: 0, lineHeight: 1.78 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.8 };

export default function A2Day22DieWochePlanungGrammarPage() {
  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

      <header style={card}>
        <h1 style={{ ...styles.title, margin: 0 }}>A2 Day 22 · Die Woche planen</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Grammar: <strong>Präsens for future plans</strong>, <strong>time expressions</strong>, <strong>verb position</strong> and <strong>modal verbs</strong>.
        </p>
        <p style={paragraph}>
          <strong>Learning goal:</strong> Talk about a real weekly plan clearly. German often uses the present tense for a future plan when the time is already clear.
        </p>
      </header>

      <section style={card}>
        <h2 style={{ margin: 0 }}>1. Präsens can describe the future</h2>
        <p style={paragraph}>
          You do not need <em>werden</em> for every future sentence. With a clear future time expression, German commonly uses the present tense.
        </p>
        <ul style={list}>
          <li><strong>Morgen arbeite ich</strong> bis 17 Uhr.</li>
          <li><strong>Am Dienstag treffe ich</strong> meine Freundin.</li>
          <li><strong>Nächste Woche habe ich</strong> drei Termine.</li>
          <li><strong>Am Wochenende fahre ich</strong> nach Kumasi.</li>
        </ul>
        <p style={paragraph}><strong>Memory rule:</strong> clear future time + Präsens = a normal way to talk about planned future events.</p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>2. Time first → verb in position 2</h2>
        <p style={paragraph}>
          When a time expression comes first, the conjugated verb follows immediately. The subject comes after the verb.
        </p>
        <ul style={list}>
          <li><strong>Am Montag arbeite ich</strong> im Büro.</li>
          <li><strong>Um 18 Uhr beginnt</strong> mein Deutschkurs.</li>
          <li><strong>Danach gehe ich</strong> ins Fitnessstudio.</li>
          <li><strong>Am Freitag kann ich</strong> früher nach Hause gehen.</li>
        </ul>
        <p style={paragraph}>
          <strong>Wrong:</strong> Am Montag ich arbeite im Büro. <br />
          <strong>Correct:</strong> Am Montag <strong>arbeite ich</strong> im Büro.
        </p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>3. Useful weekly time expressions</h2>
        <ul style={list}>
          <li><strong>am Montag / Dienstagabend / Wochenende</strong></li>
          <li><strong>morgens / mittags / nachmittags / abends</strong></li>
          <li><strong>um 8 Uhr / gegen 18 Uhr</strong></li>
          <li><strong>von 9 bis 17 Uhr</strong></li>
          <li><strong>morgen / übermorgen / nächste Woche</strong></li>
          <li><strong>zuerst / danach / später / anschließend</strong></li>
        </ul>
        <p style={paragraph}>
          These expressions help you order your week instead of producing disconnected sentences.
        </p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>4. Modal verbs for duties and availability</h2>
        <p style={paragraph}>
          Use <strong>müssen</strong> for duties and <strong>können</strong> for possibility or availability. The second verb goes to the end in the infinitive.
        </p>
        <ul style={list}>
          <li>Am Mittwoch <strong>muss ich zum Arzt gehen</strong>.</li>
          <li>Am Donnerstag <strong>kann ich länger arbeiten</strong>.</li>
          <li>Am Freitag <strong>kann ich mich mit dir treffen</strong>.</li>
          <li>Um 18 Uhr <strong>muss ich zum Deutschkurs fahren</strong>.</li>
        </ul>
        <p style={paragraph}><strong>Pattern:</strong> time + modal verb + subject + rest + infinitive.</p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>5. Accept, reject and suggest another time</h2>
        <p style={paragraph}>Weekly planning is not only listing appointments. You also need to react to another person.</p>
        <ul style={list}>
          <li><strong>Das passt gut.</strong></li>
          <li><strong>Da kann ich leider nicht.</strong></li>
          <li><strong>Am Mittwoch habe ich schon einen Termin.</strong></li>
          <li><strong>Wie wäre es mit Donnerstag?</strong></li>
          <li><strong>Dann treffen wir uns um 18 Uhr.</strong></li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>6. Build one connected weekly plan</h2>
        <p style={paragraph}>
          <strong>Example:</strong> Am Montag arbeite ich bis 17 Uhr. Danach habe ich einen Deutschkurs. Am Dienstag muss ich zum Arzt gehen. Mittwochabend kann ich mich mit Freunden treffen. Am Freitag habe ich frei, deshalb möchte ich einkaufen und mich ausruhen.
        </p>
      </section>

      <A2MiniLearningBlock
        title="Knowledge Test · Wochenplanung"
        rule="Use Präsens with a clear future time, keep the verb in position 2, and put the infinitive at the end after a modal verb."
        examples={[
          "Am Montag arbeite ich bis 17 Uhr.",
          "Um 18 Uhr beginnt mein Kurs.",
          "Am Mittwoch muss ich zum Arzt gehen.",
          "Am Freitag kann ich mich mit Freunden treffen.",
        ]}
        questions={[
          { stem: "Which sentence has correct word order?", options: ["Am Dienstag ich arbeite bis 16 Uhr.", "Am Dienstag arbeite ich bis 16 Uhr.", "Am Dienstag ich bis 16 Uhr arbeite."], answer: 1, explanation: "When the time expression is first, the conjugated verb is in position 2." },
          { stem: "Morgen ___ ich meine Freundin.", options: ["treffe", "traf", "getroffen"], answer: 0, explanation: "Präsens plus morgen can express a planned future action." },
          { stem: "Am Mittwoch ___ ich zum Arzt gehen.", options: ["muss", "bin", "habe"], answer: 0, explanation: "müssen expresses a duty; gehen stays at the end." },
          { stem: "Which sentence means you are not available?", options: ["Da kann ich leider nicht.", "Das passt gut.", "Ich habe Zeit."], answer: 0, explanation: "Da kann ich leider nicht is a natural way to reject a proposed time." },
          { stem: "Which phrase orders events?", options: ["danach", "warum", "wer"], answer: 0, explanation: "danach means afterwards and helps connect a sequence." },
          { stem: "Which sentence is natural for a weekly plan?", options: ["Nächste Woche habe ich drei Termine.", "Nächste Woche ich drei Termine habe.", "Nächste Woche drei Termine ich habe."], answer: 0, explanation: "The time expression can come first, followed by the conjugated verb." },
        ]}
        outputPrompt="Describe four days of your coming week in 5–6 sentences. Use two time expressions, one modal verb and one alternative proposal."
        starters={["Am Montag ...", "Danach ...", "Am Mittwoch muss ich ...", "Da kann ich leider nicht. Wie wäre es mit ...?"]}
      />
    </div>
  );
}
