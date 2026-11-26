import React, { useState } from "react";
import { styles } from "../styles";

// A1-11: quick revision before the unchanged Sprechen, Hören and Lesen tasks.
const section = { ...styles.card, display: "grid", gap: 9, lineHeight: 1.55 };
const model = { background: "#eff6ff", color: "#173453", border: "1px solid #bfdbfe", borderRadius: 12, padding: 12, display: "grid", gap: 5 };
const cell = { padding: "8px 6px", borderBottom: "1px solid #e2e8f0", textAlign: "left", verticalAlign: "top" };
const p = { margin: 0 };
const checks = [
  { prompt: "geradeaus gehen – Geben Sie eine Anweisung.", choices: ["Sie gehen geradeaus.", "Gehen Sie geradeaus!", "Gehen geradeaus Sie!"], answer: 1, explanation: "Verb + Sie + Rest." },
  { prompt: "Wie komme ich ___ Apotheke?", choices: ["zum", "zur", "zu dem"], answer: 1, explanation: "die Apotheke → zur Apotheke." },
  { prompt: "🚭 Rauchen verboten. Was bedeutet das?", choices: ["Man darf hier rauchen.", "Rauchen ist erlaubt.", "Man darf hier nicht rauchen."], answer: 2, explanation: "verboten = not allowed." },
  { prompt: "🅿️ Fragen Sie nach Erlaubnis.", choices: ["Darf ich hier parken?", "Ich darf hier parken.", "Parken Sie hier nicht!"], answer: 0, explanation: "Darf + ich + Rest + Infinitiv?" },
  { prompt: "📷 Fotografieren verboten. Welche höfliche Bitte passt?", choices: ["Bitte fotografieren Sie hier!", "Bitte fotografieren Sie hier nicht!", "Fotografieren ist erlaubt."], answer: 1, explanation: "A polite prohibition uses Sie + nicht. Reaktion: Entschuldigung." },
];

export default function A1Day17DirectionsGrammarNotes() {
  const [selected, setSelected] = useState({});
  return (
    <div data-a1-day17-directions-grammar="chapter-11-v2" style={{ display: "grid", gap: 12 }}>
      <section style={section}>
        <h1 style={p}>Kapitel 11 · Anweisungen, Wegbeschreibung, verboten und erlaubt</h1>
        <p style={p}>Quick revision: give polite instructions, ask for directions, understand signs and make requests in the A1 exam.</p>
      </section>

      <section style={section}>
        <h2 style={p}>1. Imperativ mit Sie</h2>
        <p style={p}>Use <strong>Verb + Sie + Rest</strong> to give a formal instruction. Add <strong>bitte</strong> to sound polite.</p>
        <div style={model}>
          <strong>Gehen + Sie + bitte geradeaus!</strong>
          <span>Sie gehen geradeaus. → Gehen Sie bitte geradeaus!</span>
          <span>Sie warten hier. → Warten Sie bitte hier!</span>
          <span>Sie biegen links ab. → Biegen Sie links ab!</span>
        </div>
        <p style={p}><strong>abbiegen:</strong> ab goes at the end. Also: Nehmen Sie die zweite Straße rechts. (Take the second street on the right.)</p>
      </section>

      <section style={section}>
        <h2 style={p}>2. Nach dem Weg fragen und den Weg beschreiben</h2>
        <div style={model}>
          <strong>Entschuldigung, wo ist der Bahnhof?</strong>
          <span>Wie komme ich zum Bahnhof? / Wie komme ich zur Apotheke?</span>
          <span>Ist das weit von hier? (Is it far from here?)</span>
        </div>
        <p style={p}><strong>zum</strong> = zu dem: zum Bahnhof, zum Hotel · <strong>zur</strong> = zu der: zur Post, zur Schule.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {["⬆ geradeaus · straight ahead", "⬅ links · left", "➡ rechts · right", "🚦 die Ampel · traffic light", "die Kreuzung · intersection", "die Haltestelle · stop", "neben · next to", "gegenüber · opposite", "hinter · behind"].map(word => (
            <span key={word} style={{ border: "1px solid #cbd5e1", borderRadius: 8, padding: "4px 8px" }}>{word}</span>
          ))}
        </div>
        <div style={model}>
          <strong>Ein kurzer Weg</strong>
          <span>Gehen Sie geradeaus bis zur Ampel. Biegen Sie rechts ab. Der Bahnhof ist auf der linken Seite, neben der Post.</span>
          <small>Go straight to the traffic light. Turn right. The station is on the left, next to the post office.</small>
        </div>
      </section>

      <section style={section}>
        <h2 style={p}>3. Verboten, erlaubt und dürfen</h2>
        <p style={p}><strong>verboten</strong> = forbidden · <strong>erlaubt</strong> = allowed · <strong>dürfen</strong> = to be allowed to.</p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><th style={cell}>Schild</th><th style={cell}>Bedeutung / Meaning</th></tr></thead>
            <tbody>
              <tr><td style={cell}><strong>🚭 Rauchen verboten</strong></td><td style={cell}>Man darf hier nicht rauchen.</td></tr>
              <tr><td style={cell}><strong>🅿️ Parken erlaubt</strong></td><td style={cell}>Man darf hier parken.</td></tr>
              <tr><td style={cell}><strong>🚫 Fotografieren verboten</strong></td><td style={cell}>Sie dürfen hier nicht fotografieren.</td></tr>
              <tr><td style={cell}><strong>🚫 Handys verboten</strong></td><td style={cell}>Sie dürfen hier kein Handy benutzen.</td></tr>
            </tbody>
          </table>
        </div>
        <div style={model}>
          <strong>Darf ich hier parken? (May I park here?)</strong>
          <span>Ja, natürlich. / Nein, das ist verboten.</span>
          <small>darf / dürfen + infinitive at the end: Man darf hier nicht rauchen.</small>
        </div>
        <p style={p}><strong>Lesen:</strong> Rauchen verboten → „Sie dürfen hier rauchen.“ = Falsch.</p>
      </section>

      <section style={section}>
        <h2 style={p}>4. Goethe A1 · Sprechen Teil 3</h2>
        <p style={p}>Look at the picture. Make a polite request and respond to your partner.</p>
        <div style={{ display: "grid", gap: 6 }}>
          <div style={model}><strong>🚭 Bitte rauchen Sie hier nicht!</strong><span>Entschuldigung. Natürlich.</span></div>
          <div style={model}><strong>📷 Bitte fotografieren Sie hier nicht!</strong><span>Ja, natürlich.</span></div>
          <div style={model}><strong>🪟 Öffnen Sie bitte das Fenster!</strong><span>Ja, gern.</span></div>
          <div style={model}><strong>🖊️ Geben Sie mir bitte einen Stift!</strong><span>Or: Können Sie mir bitte einen Stift geben? – Ja, gern. Hier, bitte.</span></div>
        </div>
        <p style={p}>A clear request and a short relevant reaction are enough. Use <strong>nicht</strong> for a prohibition: Rauchen Sie hier bitte nicht!</p>
      </section>

      <section style={section}>
        <h2 style={p}>5. Kurz prüfen · Quick practice</h2>
        <p style={p}>Choose an answer. This self-check is not graded.</p>
        {checks.map((item, index) => (
          <fieldset key={item.prompt} style={{ border: "1px solid #cbd5e1", borderRadius: 10, padding: 10, minWidth: 0, display: "grid", gap: 6, margin: 0 }}>
            <legend style={{ fontWeight: 700 }}>{index + 1}. {item.prompt}</legend>
            {item.choices.map((choice, optionIndex) => (
              <label key={choice} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="radio" name={`a1-day17-grammar-${index}`} checked={selected[index] === optionIndex}
                  onChange={() => setSelected(previous => ({ ...previous, [index]: optionIndex }))} />
                <span>{choice}</span>
              </label>
            ))}
            {selected[index] !== undefined && (
              <p role="status" style={{ ...p, color: selected[index] === item.answer ? "#166534" : "#9f1239" }}>
                {selected[index] === item.answer ? "Richtig!" : "Versuchen Sie es noch einmal."} {item.explanation}
              </p>
            )}
          </fieldset>
        ))}
        <button type="button" style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => setSelected({})}>Neu starten</button>
        <p style={p}>Now open the workbook tasks: Teil 1 Sprechen, Teil 2 Hören and Teil 3 Lesen.</p>
      </section>
    </div>
  );
}
