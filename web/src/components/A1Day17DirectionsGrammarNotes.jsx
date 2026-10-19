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
  { prompt: "Sie sprechen mit einem Fremden. Was ist höflich?", choices: ["Geh geradeaus.", "Gehen Sie geradeaus.", "Geht geradeaus."], answer: 1, explanation: "Für Sie: Infinitiv + Sie." },
  { prompt: "Du: Welche Form passt zu „abbiegen“?", choices: ["Bieg rechts ab.", "Biegen Sie rechts ab.", "Biegt rechts ab."], answer: 0, explanation: "Für du: Bieg … ab. Das Präfix ab steht am Ende." },
  { prompt: "Ihr: Welche Form passt zu „nehmen“?", choices: ["Nimm die erste Straße.", "Nehmen Sie die erste Straße.", "Nehmt die erste Straße."], answer: 2, explanation: "Für ihr: nehmt." },
  { prompt: "Welche Richtung ist richtig? „An der Ampel ...“", choices: ["biegen Sie links ab.", "links Sie biegen ab.", "Sie abbiegen links."], answer: 0, explanation: "An der Ampel biegen Sie links ab." },
];

export default function A1Day17DirectionsGrammarNotes() {
  const [selected, setSelected] = useState({});
  return (
    <div data-a1-day17-directions-grammar="chapter-11-v2" style={{ display: "grid", gap: 16 }}>
      <section style={section}>
        <h1 style={{ margin: 0 }}>Kapitel 11 · Wegbeschreibung und Imperativ</h1>
        <p style={{ margin: 0 }}>In dieser Lektion lernen Sie, nach dem Weg zu fragen, den Weg zu beschreiben und höfliche Anweisungen zu geben.</p>
        <p style={{ margin: 0, color: "#475569" }}>Lesson goal: ask for directions, explain a simple route and use <strong>du, ihr</strong> and <strong>Sie</strong> commands correctly.</p>
        <div style={model}>
          <strong>Merken Sie sich:</strong>
          <span>Gehen Sie geradeaus. → Biegen Sie rechts ab. → Das Haus ist auf der linken Seite.</span>
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
        <p style={{ margin: 0 }}><strong>Wichtige Ausdrücke:</strong> an der Ampel · bis zur Ampel · an der Kreuzung · die erste Straße links · auf der rechten Seite · auf der linken Seite · gegenüber der Bäckerei · neben der Post.</p>
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
          <span>zu + dem = <strong>zum</strong> → zum Bahnhof, zum Supermarkt.</span>
          <span>zu + der = <strong>zur</strong> → zur Post, zur Schule.</span>
          <span>Beispiel: Wie komme ich <strong>zur</strong> Schule?</span>
        </div>
      </section>

      <section style={section}>
        <h2 style={{ margin: 0 }}>3. Den Weg beschreiben · Giving directions</h2>
        <div style={model}>
          <strong>Ein einfacher Weg zum Bahnhof</strong>
          <ol style={{ margin: 0, paddingLeft: 23 }}>
            <li>Gehen Sie <strong>geradeaus</strong> bis zur Ampel.</li>
            <li>An der Ampel biegen Sie <strong>rechts</strong> ab.</li>
            <li>Nehmen Sie die <strong>erste Straße links</strong>.</li>
            <li>Der Bahnhof ist <strong>auf der rechten Seite</strong>, <strong>gegenüber der Post</strong>.</li>
          </ol>
        </div>
        <p style={{ margin: 0 }}>Das Verb <strong>abbiegen</strong> ist trennbar: „Biegen Sie rechts <strong>ab</strong>.“ Auch möglich: „An der Ampel <strong>biegen</strong> Sie rechts <strong>ab</strong>.“</p>
      </section>

      <section style={section}>
        <h2 style={{ margin: 0 }}>4. Imperativ · du, ihr und Sie</h2>
        <p style={{ margin: 0 }}>Mit dem Imperativ geben wir Anweisungen. <strong>Sie</strong> ist höflich, <strong>du</strong> ist für eine Person, die Sie gut kennen, und <strong>ihr</strong> für mehrere Freunde.</p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 570 }}>
            <thead><tr>{["Verb", "du", "ihr", "Sie"].map(h => <th key={h} style={rowCell}>{h}</th>)}</tr></thead>
            <tbody>{imperativeForms.map(forms => <tr key={forms[0]}>{forms.map((cell, i) => <td key={i} style={rowCell}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <div style={model}>
          <strong>Regel:</strong>
          <span><strong>du:</strong> Geh! / Bieg ab! / Nimm! — ohne „du“.</span>
          <span><strong>ihr:</strong> Geht! / Biegt ab! / Nehmt! — ohne „ihr“.</span>
          <span><strong>Sie:</strong> Gehen Sie! / Biegen Sie ab! / Nehmen Sie!</span>
        </div>
      </section>

      <section style={section}>
        <h2 style={{ margin: 0 }}>5. Beispielgespräch · Mini-dialogue</h2>
        <div style={model}>
          <p style={{ margin: 0 }}><strong>A:</strong> Entschuldigung, wie komme ich zur Post?</p>
          <p style={{ margin: 0 }}><strong>B:</strong> Gehen Sie geradeaus bis zur Ampel. Biegen Sie links ab. Die Post ist neben dem Supermarkt.</p>
          <p style={{ margin: 0 }}><strong>A:</strong> Vielen Dank!</p>
          <p style={{ margin: 0 }}><strong>B:</strong> Bitte schön!</p>
        </div>
        <p style={{ margin: 0 }}>Üben Sie den Dialog mit einem Partner. Tauschen Sie <em>Post</em> gegen <em>Bahnhof</em> oder <em>Schule</em> aus und ändern Sie die Richtung.</p>
        <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", borderRadius: 12, overflow: "hidden" }}>
          <iframe title="Wegbeschreibung und Imperativ – Videolektion" src="https://www.youtube.com/embed/V9WNhHEkrkU"
            loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      </section>

      <section style={section}>
        <h2 style={{ margin: 0 }}>6. Kurz prüfen · Self-check</h2>
        <p style={{ margin: 0 }}>Wählen Sie die richtige Antwort. Diese Grammatikübung ist nicht Teil der benoteten Hausaufgabe.</p>
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
                {selected[index] === item.answer ? "Richtig!" : "Versuchen Sie es noch einmal."} {item.explanation}
              </p>
            ) : null}
          </div>
        ))}
        <p style={{ margin: 0, color: "#475569" }}>Nach dem Lernen: Öffnen Sie Teil 1 Sprechen, Teil 2 Hören und Teil 3 Lesen im Workbook.</p>
      </section>
    </div>
  );
}
