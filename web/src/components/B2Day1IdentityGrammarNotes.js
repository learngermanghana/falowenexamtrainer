import React from "react";
import { styles } from "../styles";

const card = {
  ...styles.card,
  display: "grid",
  gap: 14,
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  boxShadow: "0 10px 26px rgba(15,23,42,.06)",
};

const listStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const tableStyle = { width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" };
const cellStyle = { border: "1px solid #e5e7eb", padding: "10px 12px", textAlign: "left", verticalAlign: "top", lineHeight: 1.6 };

const NoteBox = ({ children, tone = "blue" }) => {
  const tones = {
    blue: ["#bfdbfe", "#eff6ff", "#1e3a8a"],
    green: ["#bbf7d0", "#f0fdf4", "#14532d"],
    amber: ["#fde68a", "#fffbeb", "#92400e"],
  };
  const [border, background, color] = tones[tone] || tones.blue;
  return <div style={{ border: `1px solid ${border}`, borderRadius: 14, padding: 14, background, color, lineHeight: 1.7 }}>{children}</div>;
};

const ExampleBox = ({ children }) => (
  <div style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 12, padding: 12, lineHeight: 1.75 }}>{children}</div>
);

const Table = ({ children }) => (
  <div style={{ width: "100%", overflowX: "auto" }}><table style={tableStyle}>{children}</table></div>
);

const Mistake = ({ wrong, correct }) => (
  <div style={{ display: "grid", gap: 5, border: "1px solid #fecaca", background: "#fff7f7", borderRadius: 12, padding: 12, lineHeight: 1.65 }}>
    <span><strong>✗ Nicht korrekt:</strong> {wrong}</span>
    <span><strong>✓ Korrekt:</strong> {correct}</span>
  </div>
);

const CheckAnswer = ({ question, children }) => (
  <details style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, background: "#fff" }}>
    <summary style={{ cursor: "pointer", fontWeight: 800 }}>{question}</summary>
    <div style={{ marginTop: 10, lineHeight: 1.7 }}>{children}</div>
  </details>
);

export default function B2Day1IdentityGrammarNotes({ checked = false, onCheckedChange }) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section style={card}>
        <span style={{ ...styles.badge, width: "fit-content" }}>B2 · Day 1 · Grammar Notes</span>
        <h2 style={{ ...styles.title, margin: 0, fontSize: "clamp(1.7rem,4vw,2.5rem)" }}>Adjektivdeklination und klare Selbstdarstellung</h2>
        <p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.7 }}>
          Grammatik zum Thema <strong>persönliche Identität</strong>: Eigenschaften präzise beschreiben, Adjektivendungen sicherer wählen und Aussagen überzeugend begründen.
        </p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Warum brauchst du diese Grammatik?</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Auf B2 reicht eine Aussage wie <em>Ich bin ruhig</em> oft nicht aus. Eine stärkere Antwort beschreibt eine Eigenschaft genauer, begründet sie und nennt ein konkretes Beispiel.
        </p>
        <NoteBox>
          <strong>Nach dieser Lektion kannst du:</strong>
          <ul style={{ ...listStyle, marginTop: 8 }}>
            <li>Adjektive vor Nomen und nach <em>sein</em> unterscheiden,</li>
            <li>häufige Endungen nach bestimmten und unbestimmten Artikeln verwenden,</li>
            <li>Adjektive ohne Artikel bilden,</li>
            <li>Gründe mit <em>weil, da, denn</em> und <em>deshalb</em> formulieren und</li>
            <li>eine B2-Selbstdarstellung mit Eigenschaft, Grund, Beispiel und Gegensatz aufbauen.</li>
          </ul>
        </NoteBox>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>1. Adjektiv nach sein oder vor einem Nomen?</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>Zuerst musst du erkennen, wo das Adjektiv im Satz steht.</p>
        <Table>
          <thead><tr><th style={cellStyle}>Position</th><th style={cellStyle}>Regel</th><th style={cellStyle}>Beispiel</th></tr></thead>
          <tbody>
            <tr><td style={cellStyle}><strong>Nach sein, werden, bleiben</strong></td><td style={cellStyle}>Keine Endung</td><td style={cellStyle}>Ich bin ruhig. Meine Werte bleiben wichtig. Mein Selbstbild wird realistischer.</td></tr>
            <tr><td style={cellStyle}><strong>Direkt vor einem Nomen</strong></td><td style={cellStyle}>Das Adjektiv bekommt eine Endung.</td><td style={cellStyle}>Ich bin ein ruhiger Mensch. Ehrliche Kommunikation ist wichtig.</td></tr>
          </tbody>
        </Table>
        <NoteBox tone="amber"><strong>Schnelltest:</strong> Steht direkt nach dem Adjektiv ein Nomen? Dann brauchst du normalerweise eine Adjektivendung.</NoteBox>
        <Mistake wrong="Ich bin ein ruhig Mensch." correct="Ich bin ein ruhiger Mensch." />
        <Mistake wrong="Ich bin ruhiger." correct="Ich bin ruhig. – Ruhiger ist nur korrekt, wenn du wirklich vergleichst." />
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>2. Das Grundprinzip der Adjektivdeklination</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Die Endung zeigt Genus, Kasus und Numerus. Entscheidend ist, wie viel Information der Artikel bereits liefert.
        </p>
        <NoteBox tone="green">
          <strong>Merksatz:</strong> Zeigt der Artikel Genus und Kasus klar, ist die Adjektivendung meist einfacher. Zeigt der Artikel nicht genug, übernimmt das Adjektiv mehr Information.
        </NoteBox>
        <ol style={listStyle}>
          <li>Bestimme das Nomen: der Mensch, die Erfahrung, das Selbstbild oder Plural.</li>
          <li>Bestimme den Kasus: Wer? Wen? Wem?</li>
          <li>Prüfe den Artikel: der/die/das, ein/eine, kein/mein oder kein Artikel.</li>
          <li>Wähle die passende Endung.</li>
        </ol>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>3. Nach einem unbestimmten Artikel</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Diese Gruppe umfasst <strong>ein, eine, kein</strong> und Possessivartikel wie <strong>mein, dein, sein, ihr, unser</strong>.
        </p>
        <Table>
          <thead><tr><th style={cellStyle}>Kasus</th><th style={cellStyle}>Maskulin</th><th style={cellStyle}>Feminin</th><th style={cellStyle}>Neutrum</th><th style={cellStyle}>Plural</th></tr></thead>
          <tbody>
            <tr><td style={cellStyle}><strong>Nominativ</strong></td><td style={cellStyle}>ein ruhig<strong>er</strong> Mensch</td><td style={cellStyle}>eine prägend<strong>e</strong> Erfahrung</td><td style={cellStyle}>ein ehrlich<strong>es</strong> Selbstbild</td><td style={cellStyle}>keine wichtig<strong>en</strong> Werte</td></tr>
            <tr><td style={cellStyle}><strong>Akkusativ</strong></td><td style={cellStyle}>einen ruhig<strong>en</strong> Menschen</td><td style={cellStyle}>eine prägend<strong>e</strong> Erfahrung</td><td style={cellStyle}>ein ehrlich<strong>es</strong> Selbstbild</td><td style={cellStyle}>keine wichtig<strong>en</strong> Werte</td></tr>
            <tr><td style={cellStyle}><strong>Dativ</strong></td><td style={cellStyle}>mit einem ruhig<strong>en</strong> Menschen</td><td style={cellStyle}>mit einer wichtig<strong>en</strong> Person</td><td style={cellStyle}>mit einem realistisch<strong>en</strong> Selbstbild</td><td style={cellStyle}>mit persönlich<strong>en</strong> Erfahrungen</td></tr>
          </tbody>
        </Table>
        <NoteBox tone="amber"><strong>Besonders wichtig:</strong> Im maskulinen Akkusativ heißt es <em>einen zuverlässigen Menschen</em>. Im Dativ steht sehr häufig <strong>-en</strong>.</NoteBox>
        <Mistake wrong="Ich würde mich als einen zuverlässiger Mensch beschreiben." correct="Ich würde mich als einen zuverlässigen Menschen beschreiben." />
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>4. Nach einem bestimmten Artikel</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>Nach <strong>der, die, das, dieser, jeder, welcher</strong> ist die Endung meistens <strong>-e</strong> oder <strong>-en</strong>.</p>
        <Table>
          <thead><tr><th style={cellStyle}>Form</th><th style={cellStyle}>Beispiel</th></tr></thead>
          <tbody>
            <tr><td style={cellStyle}>Nominativ Singular</td><td style={cellStyle}>der offen<strong>e</strong> Mensch · die wichtig<strong>e</strong> Entscheidung · das ehrlich<strong>e</strong> Selbstbild</td></tr>
            <tr><td style={cellStyle}>Akkusativ Feminin/Neutrum</td><td style={cellStyle}>die wichtig<strong>e</strong> Entscheidung · das ehrlich<strong>e</strong> Selbstbild</td></tr>
            <tr><td style={cellStyle}>Fast alle anderen Formen</td><td style={cellStyle}>den offen<strong>en</strong> Menschen · mit der wichtig<strong>en</strong> Person · die prägend<strong>en</strong> Erfahrungen</td></tr>
          </tbody>
        </Table>
        <NoteBox tone="green"><strong>Praktischer B2-Merksatz:</strong> Nach einem bestimmten Artikel steht im Singular-Nominativ oft <strong>-e</strong>; sehr viele andere Formen haben <strong>-en</strong>.</NoteBox>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>5. Ohne Artikel</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Ohne Artikel muss das Adjektiv die grammatische Information stärker zeigen. Solche Verbindungen sind bei abstrakten Themen besonders häufig.
        </p>
        <Table>
          <thead><tr><th style={cellStyle}>Beispiel</th><th style={cellStyle}>Verwendung</th></tr></thead>
          <tbody>
            <tr><td style={cellStyle}>ehrlich<strong>e</strong> Kommunikation</td><td style={cellStyle}>Feminin Nominativ</td></tr>
            <tr><td style={cellStyle}>stark<strong>es</strong> Selbstbewusstsein</td><td style={cellStyle}>Neutrum Nominativ</td></tr>
            <tr><td style={cellStyle}>persönlich<strong>e</strong> Erfahrungen</td><td style={cellStyle}>Plural Nominativ/Akkusativ</td></tr>
            <tr><td style={cellStyle}>mit ehrlich<strong>er</strong> Kommunikation</td><td style={cellStyle}>Feminin Dativ</td></tr>
            <tr><td style={cellStyle}>aus persönlich<strong>en</strong> Erfahrungen</td><td style={cellStyle}>Plural Dativ</td></tr>
          </tbody>
        </Table>
        <ExampleBox><strong>Nützliche Verbindungen:</strong> persönliche Werte · ehrliche Kommunikation · starkes Selbstbewusstsein · prägende Erfahrungen · realistisches Selbstbild</ExampleBox>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>6. Begründungen richtig verbinden</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>Eine B2-Aussage wird stärker, wenn du nicht nur eine Eigenschaft nennst, sondern auch erklärst, warum sie zu dir passt.</p>
        <Table>
          <thead><tr><th style={cellStyle}>Verbindung</th><th style={cellStyle}>Satzstruktur</th><th style={cellStyle}>Beispiel</th></tr></thead>
          <tbody>
            <tr><td style={cellStyle}><strong>weil / da</strong></td><td style={cellStyle}>Nebensatz: Verb am Ende</td><td style={cellStyle}>Ich bin zuverlässig, weil andere sich auf mich verlassen können.</td></tr>
            <tr><td style={cellStyle}><strong>denn</strong></td><td style={cellStyle}>Hauptsatz: normale Wortstellung</td><td style={cellStyle}>Ehrlichkeit ist mir wichtig, denn Vertrauen braucht Offenheit.</td></tr>
            <tr><td style={cellStyle}><strong>deshalb</strong></td><td style={cellStyle}>Verb auf Position zwei</td><td style={cellStyle}>Ich möchte authentisch wirken. Deshalb zeige ich nicht nur meine Erfolge.</td></tr>
            <tr><td style={cellStyle}><strong>zum Beispiel</strong></td><td style={cellStyle}>konkretes Beispiel</td><td style={cellStyle}>Ich bin geduldig. Zum Beispiel höre ich anderen zuerst aufmerksam zu.</td></tr>
          </tbody>
        </Table>
        <Mistake wrong="Ich bin zuverlässig, weil andere können sich auf mich verlassen." correct="Ich bin zuverlässig, weil andere sich auf mich verlassen können." />
        <Mistake wrong="Ich bin ruhig, denn ich zuerst beobachte." correct="Ich bin ruhig, denn ich beobachte zuerst." />
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>7. Eine strukturierte Selbstdarstellung</h2>
        <NoteBox>
          <strong>Die B2-Formel:</strong><br />Eigenschaft → Begründung → Beispiel → Gegensatz oder Entwicklung
        </NoteBox>
        <Table>
          <thead><tr><th style={cellStyle}>Schritt</th><th style={cellStyle}>Satzanfang</th><th style={cellStyle}>Beispiel</th></tr></thead>
          <tbody>
            <tr><td style={cellStyle}>1. Eigenschaft</td><td style={cellStyle}>Ich würde mich als … beschreiben.</td><td style={cellStyle}>Ich würde mich als einen zuverlässigen Menschen beschreiben.</td></tr>
            <tr><td style={cellStyle}>2. Begründung</td><td style={cellStyle}>Das liegt daran, dass …</td><td style={cellStyle}>Das liegt daran, dass ich Aufgaben ernst nehme.</td></tr>
            <tr><td style={cellStyle}>3. Beispiel</td><td style={cellStyle}>Ein gutes Beispiel dafür ist …</td><td style={cellStyle}>Ein gutes Beispiel dafür ist meine Arbeit, bei der andere auf meine Unterstützung zählen.</td></tr>
            <tr><td style={cellStyle}>4. Gegensatz</td><td style={cellStyle}>Während …, … / Im Gegensatz dazu …</td><td style={cellStyle}>Während ich im echten Leben eher ruhig bin, wirke ich online manchmal offener.</td></tr>
          </tbody>
        </Table>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>8. Online und offline vergleichen</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>Für das Thema Identität brauchst du häufig Kontraste.</p>
        <ul style={listStyle}>
          <li><strong>während:</strong> Während ich offline eher zurückhaltend bin, teile ich online häufiger meine Meinung.</li>
          <li><strong>hingegen:</strong> Im Alltag spreche ich wenig. Online hingegen formuliere ich meine Gedanken ausführlicher.</li>
          <li><strong>auf der einen Seite … auf der anderen Seite:</strong> Auf der einen Seite kann Selbstdarstellung motivieren, auf der anderen Seite kann sie Druck erzeugen.</li>
          <li><strong>im Gegensatz dazu:</strong> Online sieht man oft nur Erfolge. Im Gegensatz dazu gehören im echten Leben auch Zweifel und Rückschläge zur Persönlichkeit.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>9. B2-Modellabsatz</h2>
        <NoteBox tone="green">
          Ich würde mich als einen eher ruhigen, aber zuverlässigen Menschen beschreiben, weil ich zuerst beobachte, bevor ich reagiere. Ein wichtiger Wert in meinem Leben ist Ehrlichkeit, denn ohne ehrliche Kommunikation kann kein stabiles Vertrauen entstehen. Eine prägende Erfahrung war meine erste Arbeitsstelle, bei der ich gelernt habe, Verantwortung zu übernehmen. Während ich im echten Leben manchmal zurückhaltend wirke, äußere ich online häufiger meine Meinung. Trotzdem versuche ich, ein realistisches Selbstbild zu zeigen und nicht nur positive Erfahrungen zu präsentieren.
        </NoteBox>
        <ul style={listStyle}>
          <li><strong>Adjektiv-Nomen-Verbindungen:</strong> ruhiger Mensch, wichtiger Wert, ehrliche Kommunikation, prägende Erfahrung, realistisches Selbstbild</li>
          <li><strong>Begründungen:</strong> weil, denn</li>
          <li><strong>Gegensatz:</strong> während</li>
          <li><strong>Verknüpfung:</strong> trotzdem</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Typische Fehler</h2>
        <ul style={listStyle}>
          <li>Nach <em>sein</em> bekommt das Adjektiv keine Endung: <strong>Ich bin ruhig.</strong></li>
          <li>Vor einem Nomen braucht das Adjektiv eine Endung: <strong>ein ruhiger Mensch.</strong></li>
          <li>Im maskulinen Akkusativ heißt es: <strong>einen zuverlässigen Menschen.</strong></li>
          <li>Nach <em>weil</em> steht das konjugierte Verb am Ende.</li>
          <li>Nach <em>denn</em> bleibt die normale Hauptsatzstellung.</li>
          <li>Vermeide allgemeine Aussagen wie <em>Ich bin gut</em>. Beschreibe die Eigenschaft genauer und gib ein Beispiel.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Schrittweise Mini-Übung</h2>
        <ol style={listStyle}>
          <li>Schreibe fünf Adjektiv-Nomen-Verbindungen über Identität.</li>
          <li>Ergänze: <em>Ich bin ein ___ Mensch.</em> – ruhig</li>
          <li>Ergänze: <em>Eine ___ Erfahrung hat mich geprägt.</em> – wichtig</li>
          <li>Formuliere einen Satz mit <strong>weil</strong> und achte auf das Verb am Ende.</li>
          <li>Vergleiche dein Verhalten online und offline mit <strong>während</strong>.</li>
          <li>Schreibe einen Absatz mit 80–100 Wörtern nach der Formel Eigenschaft → Grund → Beispiel → Gegensatz.</li>
        </ol>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Selbstkontrolle</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>Beantworte zuerst die Frage und öffne danach die Lösung.</p>
        <CheckAnswer question="1. Welche Form ist richtig: ein ruhig__ Mensch?">
          <strong>Lösung:</strong> ein ruhig<strong>er</strong> Mensch. <em>Mensch</em> ist maskulin und steht hier im Nominativ.
        </CheckAnswer>
        <CheckAnswer question="2. Welche Form ist richtig: eine prägend__ Erfahrung?">
          <strong>Lösung:</strong> eine prägend<strong>e</strong> Erfahrung. <em>Erfahrung</em> ist feminin und steht im Nominativ.
        </CheckAnswer>
        <CheckAnswer question="3. Warum hat ruhig in „Ich bin ruhig“ keine Endung?">
          <strong>Lösung:</strong> Das Adjektiv steht nach <em>sein</em> und nicht direkt vor einem Nomen.
        </CheckAnswer>
        <CheckAnswer question="4. Welche Wortstellung ist richtig nach weil?">
          <strong>Lösung:</strong> Ich bin zuverlässig, weil andere sich auf mich verlassen <strong>können</strong>. Das konjugierte Verb steht am Ende.
        </CheckAnswer>
      </section>

      <section style={card}>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontWeight: 800, lineHeight: 1.6 }}>
          <input type="checkbox" checked={Boolean(checked)} onChange={(event) => onCheckedChange?.(event.target.checked)} style={{ marginTop: 4 }} />
          <span>Ich habe die vollständigen Grammatiknotizen gelesen und die Beispiele verstanden.</span>
        </label>
      </section>
    </div>
  );
}
