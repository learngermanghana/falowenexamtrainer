import React, { useState } from "react";
import { styles } from "../styles";

// Kapitel 11 · A1 Day 17: simple, lesson-specific notes for Wegbeschreibung
// und Imperativ. The tutor workbook assesses Sprechen/Hören/Lesen separately.
const section = { ...styles.card, display: "grid", gap: 12, lineHeight: 1.7 };
const rowCell = { padding: "10px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "left", verticalAlign: "top" };
const model = { background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: 14, lineHeight: 1.8 };
const exampleLines = [
  ["Wo ist der Bahnhof?", "Where is the train station?"],
  ["Wie komme ich zum Bahnhof?", "How do I get to the train station?"],
  ["Wie komme ich zur Post?", "How do I get to the post office?"],
  ["Entschuldigung, können Sie mir helfen?", "Excuse me, can you help me?"],
];
const imperativeForms = [
  ["gehen", "Geh geradeaus.", "Geht geradeaus.", "Gehen Sie geradeaus."],
  ["abbiegen", "Bieg links ab.", "Biegt links ab.", "Biegen Sie links ab."],
  ["nehmen", "Nimm die erste Straße rechts.", "Nehmt die erste Straße rechts.", "Nehmen Sie die erste Straße rechts."],
  ["warten", "Warte hier.", "Wartet hier.", "Warten Sie hier."],
];
const quickChecks = [
  { prompt: "Sie sprechen mit einem Fremden. Was ist höflich?", choices: ["Geh geradeaus.", "Gehen Sie geradeaus.", "Geht geradeaus."], answer: 1, explanation: "Für Sie: Infinitiv + Sie. / Formal commands use infinitive + Sie." },
  { prompt: "Du: Welche Form passt zu „abbiegen“?", choices: ["Bieg rechts ab.", "Biegen Sie rechts ab.", "Biegt rechts ab."], answer: 0, explanation: "Für du: Bieg … ab. / The prefix ab goes at the end." },
  { prompt: "Ihr: Welche Form passt zu „nehmen“?", choices: ["Nimm die erste Straße.", "Nehmen Sie die erste Straße.", "Nehmt die erste Straße."], answer: 2, explanation: "Für ihr: nehmt. / Use nehmt when speaking to several friends." },
  { prompt: "Welche Richtung ist richtig? „An der Ampel ...“", choices: ["biegen Sie links ab.", "links Sie biegen ab.", "Sie abbiegen links."], answer: 0, explanation: "An der Ampel biegen Sie links ab. / Turn left at the traffic light." },
];

export default function A1Day17DirectionsGrammarNotes() {
  const [selected, setSelected] = useState({});
  return (
    <div data-a1-day17-directions-grammar="chapter-11-v2" style={{ display: "grid", gap: 16 }}>
      <section style={section}>
        <h1 style={{ margin: 0 }}>Kapitel 11 · Wegbeschreibung und Imperativ</h1>
        <p style={{ margin: 0 }}>In this lesson you learn how to ask for directions, describe a route and give polite instructions. German examples include English explanations.</p>
        <p style={{ margin: 0, color: "#475569" }}>Lesson goal: ask for directions, explain a simple route and use <strong>du, ihr</strong> and <strong>Sie</strong> commands correctly.</p>
        <div style={model}>
          <strong>Remember / Merken Sie sich:</strong>
          <span>Gehen Sie geradeaus. (Go straight ahead.) → Biegen Sie rechts ab. (Turn right.) → Das Haus ist auf der linken Seite. (The house is on the left.)</span>
        </div>
      </section>

      <section style={section}>
        <h2 style={{ margin: 0 }}>1. Wichtige Wörter · Directions vocabulary</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[
            "geradeaus · straight ahead", "links · left", "rechts · right",
            "die Ampel · traffic light", "die Kreuzung · intersection",
            "die Straße · street", "die Ecke · corner",
            "der Bahnhof · train station", "die Post · post office",
            "der Supermarkt · supermarket",
          ].map(item => <span key={item} style={{ borderRadius: 10, padding: "9px 12px", border: "1px solid #cbd5e1", background: "#f8fafc" }}>{item}</span>)}
        </div>
        <p style={{ margin: 0 }}><strong>Useful expressions / Wichtige Ausdrücke:</strong> an der Ampel (at the traffic light) · bis zur Ampel (up to the traffic light) · an der Kreuzung (at the intersection) · die erste Straße links (first street on the left) · auf der rechten Seite (on the right) · auf der linken Seite (on the left) · gegenüber der Bäckerei (opposite the bakery) · neben der Post (next to the post office).</p>
      </section>

      <section style={section}>
        <h2 style={{ margin: 0 }}>2. Nach dem Weg fragen · Asking for directions</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><th style={rowCell}>Deutsch</th><th style={rowCell}>English</th></tr></thead>
            <tbody>{exampleLines.map(([german, english]) => <tr key={german}><td style={rowCell}><strong>{german}</strong></td><td style={rowCell}>{english}</td></tr>)}</tbody>
          </table>
        </div>
        <div style={model}>
          <strong>zum oder zur?</strong>
          <span>zu + dem = <strong>zum</strong> (to the, masculine/neuter) → zum Bahnhof (to the station), zum Supermarkt (to the supermarket).</span>
          <span>zu + der = <strong>zur</strong> (to the, feminine) → zur Post (to the post office), zur Schule (to the school).</span>
          <span>Example / Beispiel: Wie komme ich <strong>zur</strong> Schule? (How do I get to the school?)</span>
        </div>
      </section>

      <section style={section}>
        <h2 style={{ margin: 0 }}>3. Den Weg beschreiben · Giving directions</h2>
        <div style={model}>
          <strong>Ein einfacher Weg zum Bahnhof · A simple route to the station</strong>
          <ol style={{ margin: 0, paddingLeft: 23 }}>
            <li>Gehen Sie <strong>geradeaus</strong> bis zur Ampel. (Go straight ahead to the traffic light.)</li>
            <li>An der Ampel biegen Sie <strong>rechts</strong> ab. (Turn right at the traffic light.)</li>
            <li>Nehmen Sie die <strong>erste Straße links</strong>. (Take the first street on the left.)</li>
            <li>Der Bahnhof ist <strong>auf der rechten Seite</strong>, <strong>gegenüber der Post</strong>. (The station is on the right, opposite the post office.)</li>
          </ol>
        </div>
        <p style={{ margin: 0 }}>The verb <strong>abbiegen</strong> (to turn) is separable: its prefix moves to the end. In German / Auf Deutsch: „Biegen Sie rechts <strong>ab</strong>.“ Also possible / Auch möglich: „An der Ampel <strong>biegen</strong> Sie rechts <strong>ab</strong>.“</p>
      </section>

      <section style={section}>
        <h2 style={{ margin: 0 }}>4. Imperativ · du, ihr und Sie</h2>
        <p style={{ margin: 0 }}>Use the imperative for instructions. <strong>Sie</strong> is formal/polite for strangers, <strong>du</strong> addresses one friend, and <strong>ihr</strong> addresses several friends.</p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 570 }}>
            <thead><tr>{["Verb", "du", "ihr", "Sie"].map(h => <th key={h} style={rowCell}>{h}</th>)}</tr></thead>
            <tbody>{imperativeForms.map(forms => <tr key={forms[0]}>{forms.map((cell, i) => <td key={i} style={rowCell}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <div style={model}>
          <strong>Rule / Regel:</strong>
          <span><strong>du:</strong> Geh! / Bieg ab! / Nimm! — omit „du“ (for one friend).</span>
          <span><strong>ihr:</strong> Geht! / Biegt ab! / Nehmt! — omit „ihr“ (for several friends).</span>
          <span><strong>Sie:</strong> Gehen Sie! / Biegen Sie ab! / Nehmen Sie! (formal, infinitive + Sie)</span>
        </div>
      </section>

      <section style={section}>
        <h2 style={{ margin: 0 }}>5. Beispielgespräch · Mini-dialogue</h2>
        <div style={model}>
          <p style={{ margin: 0 }}><strong>A:</strong> Entschuldigung, wie komme ich zur Post? (Excuse me, how do I get to the post office?)</p>
          <p style={{ margin: 0 }}><strong>B:</strong> Gehen Sie geradeaus bis zur Ampel. Biegen Sie links ab. Die Post ist neben dem Supermarkt. (Go straight to the light. Turn left. The post office is next to the supermarket.)</p>
          <p style={{ margin: 0 }}><strong>A:</strong> Vielen Dank! (Thank you very much!)</p>
          <p style={{ margin: 0 }}><strong>B:</strong> Bitte schön! (You are welcome!)</p>
        </div>
        <p style={{ margin: 0 }}>Practise the dialogue with a partner. Replace <em>Post</em> with <em>Bahnhof</em> (train station) or <em>Schule</em> (school), then change the directions.</p>

      </section>

      <section style={section}>
        <h2 style={{ margin: 0 }}>6. Kurz prüfen · Self-check</h2>
        <p style={{ margin: 0 }}>Choose the correct answer. This grammar self-check is not graded. / Diese Grammatikübung ist nicht Teil der benoteten Hausaufgabe.</p>
        {quickChecks.map((item, index) => (
          <div key={item.prompt} style={{ border: "1px solid #cbd5e1", borderRadius: 12, padding: 12, display: "grid", gap: 7 }}>
            <strong>{index + 1}. {item.prompt}</strong>
            {item.choices.map((choice, optionIndex) => (
              <label key={choice} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <input type="radio" name={`a1-day17-grammar-${index}`} checked={selected[index] === optionIndex}
                  onChange={() => setSelected(previous => ({ ...previous, [index]: optionIndex }))} />
                <span>{choice}</span>
              </label>
            ))}
            {selected[index] !== undefined ? (
              <p style={{ margin: 0, color: selected[index] === item.answer ? "#166534" : "#9f1239" }}>
                {selected[index] === item.answer ? "Correct! / Richtig!" : "Try again. / Versuchen Sie es noch einmal."} {item.explanation}
              </p>
            ) : null}
          </div>
        ))}
        <p style={{ margin: 0, color: "#475569" }}>After studying, open Teil 1 (Speaking), Teil 2 (Listening) and Teil 3 (Reading) in the workbook.</p>
      </section>
    </div>
  );
}
