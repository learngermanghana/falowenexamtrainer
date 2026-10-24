import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 11 };
const paragraph = { margin: 0, lineHeight: 1.75 };
const list = { margin: 0, paddingLeft: 22, display: "grid", gap: 7, lineHeight: 1.7 };
const formula = {
  border: "1px solid #bfdbfe",
  background: "#eff6ff",
  borderRadius: 12,
  padding: 12,
  lineHeight: 1.7,
};
const note = {
  border: "1px solid #bbf7d0",
  background: "#f0fdf4",
  borderRadius: 12,
  padding: 12,
  lineHeight: 1.7,
};
const warning = {
  border: "1px solid #fde68a",
  background: "#fffbeb",
  borderRadius: 12,
  padding: 12,
  lineHeight: 1.7,
};
const tableWrap = { width: "100%", overflowX: "auto" };
const table = { width: "100%", minWidth: 620, borderCollapse: "collapse" };
const cell = {
  border: "1px solid #dbe3ef",
  padding: "9px 10px",
  textAlign: "left",
  verticalAlign: "top",
};

const Section = ({ title, children }) => (
  <section style={card}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const GrammarContent = () => (
  <div data-a2-day8-restaurant-grammar-notes="true" style={{ display: "grid", gap: 16 }}>
    <header style={card}>
      <span style={{ ...styles.badge, width: "fit-content" }}>A2 · 3.8 · Grammatik</span>
      <h1 style={{ margin: 0 }}>Höfliche Wünsche und Bitten im Restaurant</h1>
      <p style={paragraph}>
        Im Restaurant brauchst du nicht den Imperativ als Hauptgrammatik. Wichtiger sind
        <strong> höfliche Wünsche</strong>, <strong>höfliche Bitten</strong> und der richtige
        <strong> Satzbau bei Fragen</strong>. Dafür benutzt du besonders
        <strong> möchte</strong>, <strong>hätte gern</strong> und <strong>könnte</strong>.
      </p>
      <div style={formula}>
        <strong>Wunsch:</strong> Ich hätte gern einen Salat.<br />
        <strong>Bitte:</strong> Könnte ich bitte die Speisekarte bekommen?<br />
        <strong>Frage:</strong> Was empfehlen Sie heute?
      </div>
    </header>

    <Section title="1. Einen Wunsch höflich ausdrücken">
      <p style={paragraph}>
        Für Bestellungen sind <strong>möchte</strong> und <strong>hätte gern</strong> sehr häufig.
        Beide Formen klingen höflicher als ein direkter Befehl.
      </p>
      <div style={tableWrap}>
        <table style={table}>
          <thead>
            <tr>
              <th style={cell}>Struktur</th>
              <th style={cell}>Bedeutung</th>
              <th style={cell}>Beispiel</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={cell}><strong>ich möchte + Nomen</strong></td>
              <td style={cell}>I would like / I want</td>
              <td style={cell}>Ich möchte <strong>einen Kaffee</strong>.</td>
            </tr>
            <tr>
              <td style={cell}><strong>ich möchte + Infinitiv</strong></td>
              <td style={cell}>I would like to do something</td>
              <td style={cell}>Ich möchte <strong>bestellen</strong>.</td>
            </tr>
            <tr>
              <td style={cell}><strong>ich hätte gern + Nomen</strong></td>
              <td style={cell}>I would like to have</td>
              <td style={cell}>Ich hätte gern <strong>die Suppe</strong>.</td>
            </tr>
            <tr>
              <td style={cell}><strong>ich nehme + Nomen</strong></td>
              <td style={cell}>I’ll take</td>
              <td style={cell}>Ich nehme <strong>das Tagesmenü</strong>.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={note}>
        <strong>Merke:</strong> <em>hätte</em> is the Konjunktiv-II form of <em>haben</em>.
        In everyday restaurant language, <strong>Ich hätte gern ...</strong> is a very common polite formula.
      </div>
    </Section>

    <Section title="2. Höfliche Bitten mit könnte">
      <p style={paragraph}>
        <strong>Könnte</strong> is the Konjunktiv-II form of <strong>können</strong>.
        It makes a request softer and more polite.
      </p>
      <div style={formula}>
        <strong>Könnte + Subjekt + ... + Infinitiv?</strong><br />
        Könnte ich bitte die Speisekarte <strong>bekommen</strong>?<br />
        Könnten Sie mir bitte noch etwas Wasser <strong>bringen</strong>?
      </div>
      <ul style={list}>
        <li>Könnte ich bitte ein Glas Wasser bekommen?</li>
        <li>Könnten Sie uns bitte zwei Teller bringen?</li>
        <li>Könnte ich bitte mit Karte bezahlen?</li>
      </ul>
      <p style={paragraph}>
        Bei einem Satz mit Modalverb oder Konjunktiv-II-Modalform steht der zweite Verbteil
        als <strong>Infinitiv am Ende</strong>.
      </p>
      <div style={warning}>
        Falsch: <s>Könnte ich bekommen bitte die Speisekarte?</s><br />
        Richtig: <strong>Könnte ich bitte die Speisekarte bekommen?</strong>
      </div>
    </Section>

    <Section title="3. möchte + Infinitiv: Verb am Ende">
      <p style={paragraph}>
        Wenn nach <strong>möchte</strong> noch ein Verb kommt, steht dieses Verb am Satzende.
      </p>
      <ul style={list}>
        <li>Ich möchte jetzt <strong>bestellen</strong>.</li>
        <li>Wir möchten bitte <strong>zahlen</strong>.</li>
        <li>Ich möchte noch ein Dessert <strong>nehmen</strong>.</li>
      </ul>
      <div style={formula}>
        <strong>Subjekt + möchte + ... + Infinitiv</strong><br />
        Wir + möchten + bitte + <strong>zahlen</strong>.
      </div>
    </Section>

    <Section title="4. Akkusativ bei der Bestellung">
      <p style={paragraph}>
        Viele Dinge, die du bestellst, sind das direkte Objekt. Nach Verben wie
        <strong> nehmen</strong>, <strong>möchten</strong> oder in der festen Form
        <strong> hätte gern</strong> steht das Nomen normalerweise im <strong>Akkusativ</strong>.
      </p>
      <div style={tableWrap}>
        <table style={table}>
          <thead>
            <tr>
              <th style={cell}>Grundform</th>
              <th style={cell}>Akkusativ</th>
              <th style={cell}>Beispiel</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={cell}>der Salat</td>
              <td style={cell}><strong>einen Salat</strong></td>
              <td style={cell}>Ich hätte gern <strong>einen Salat</strong>.</td>
            </tr>
            <tr>
              <td style={cell}>die Suppe</td>
              <td style={cell}><strong>eine Suppe</strong></td>
              <td style={cell}>Ich nehme <strong>eine Suppe</strong>.</td>
            </tr>
            <tr>
              <td style={cell}>das Wasser</td>
              <td style={cell}><strong>ein Wasser</strong></td>
              <td style={cell}>Ich möchte <strong>ein Wasser</strong>.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={note}>
        Besonders wichtig: masculine nouns change in the accusative:
        <strong> ein Salat → einen Salat</strong>.
      </div>
    </Section>

    <Section title="5. Fragen richtig bilden">
      <p style={paragraph}>
        Im Restaurant brauchst du oft direkte Fragen. Die Wortstellung hängt davon ab,
        ob du eine Ja/Nein-Frage oder eine W-Frage stellst.
      </p>
      <div style={formula}>
        <strong>Ja/Nein-Frage: Verb + Subjekt + ...?</strong><br />
        Haben Sie auch vegetarische Gerichte?<br />
        Kann ich mit Karte bezahlen?
      </div>
      <div style={formula}>
        <strong>W-Frage: Fragewort + Verb + Subjekt + ...?</strong><br />
        Was empfehlen Sie heute?<br />
        Welche Suppe haben Sie?<br />
        Wie viel kostet das Tagesmenü?
      </div>
      <div style={warning}>
        Falsch: <s>Was Sie empfehlen heute?</s><br />
        Richtig: <strong>Was empfehlen Sie heute?</strong>
      </div>
    </Section>

    <Section title="6. Sie-Form im Restaurant">
      <p style={paragraph}>
        Mit Bedienung oder Servicepersonal benutzt du normalerweise die höfliche
        <strong> Sie-Form</strong>.
      </p>
      <ul style={list}>
        <li>Was empfehlen <strong>Sie</strong>?</li>
        <li>Haben <strong>Sie</strong> auch etwas Vegetarisches?</li>
        <li>Könnten <strong>Sie</strong> mir bitte helfen?</li>
        <li>Bringen <strong>Sie</strong> uns bitte noch zwei Gläser? — grammatisch möglich, aber direkter als <em>Könnten Sie ...?</em></li>
      </ul>
      <p style={paragraph}>
        Für A2 ist es sinnvoll, bei Bitten bevorzugt <strong>Könnten Sie bitte ...?</strong> zu verwenden,
        weil die Form eindeutig höflich klingt.
      </p>
    </Section>

    <Section title="7. Ein Problem höflich erklären">
      <p style={paragraph}>
        Wenn etwas falsch ist, musst du nicht nur sagen, dass es ein Problem gibt.
        Nenne zuerst höflich das Problem und dann die gewünschte Korrektur.
      </p>
      <div style={formula}>
        <strong>Entschuldigung, ich habe ... bestellt, aber ...</strong><br />
        Entschuldigung, ich habe Wasser ohne Kohlensäure bestellt, aber das hier ist Sprudelwasser.
      </div>
      <div style={formula}>
        <strong>Könnten Sie ... bitte ...?</strong><br />
        Könnten Sie das bitte austauschen?<br />
        Könnten Sie mir bitte einen neuen Teller bringen?
      </div>
      <p style={paragraph}>
        <strong>aber</strong> connects the expected situation with the actual problem:
        Ich habe die Suppe ohne Sahne bestellt, <strong>aber</strong> hier ist Sahne drin.
      </p>
    </Section>

    <Section title="8. Nützliche Satzmuster">
      <ul style={list}>
        <li><strong>Bestellen:</strong> Ich hätte gern ... / Ich nehme ... / Ich möchte ...</li>
        <li><strong>Nachfragen:</strong> Was empfehlen Sie? / Haben Sie ...? / Was ist in ...?</li>
        <li><strong>Bitten:</strong> Könnte ich bitte ... bekommen? / Könnten Sie bitte ... bringen?</li>
        <li><strong>Problem:</strong> Entschuldigung, ich habe ... bestellt, aber ...</li>
        <li><strong>Bezahlen:</strong> Wir möchten bitte zahlen. / Könnte ich bitte mit Karte bezahlen?</li>
      </ul>
    </Section>

    <Section title="9. Häufige Fehler">
      <ul style={list}>
        <li>
          <strong>Zu direkt:</strong> <s>Gib mir Wasser!</s> → <strong>Könnte ich bitte ein Wasser bekommen?</strong>
        </li>
        <li>
          <strong>Infinitiv nicht am Ende:</strong> <s>Ich möchte bestellen jetzt.</s> → <strong>Ich möchte jetzt bestellen.</strong>
        </li>
        <li>
          <strong>Falsche Fragewortstellung:</strong> <s>Was Sie empfehlen?</s> → <strong>Was empfehlen Sie?</strong>
        </li>
        <li>
          <strong>Akkusativ vergessen:</strong> <s>Ich hätte gern ein Salat.</s> → <strong>Ich hätte gern einen Salat.</strong>
        </li>
        <li>
          <strong>du statt Sie:</strong> Bei unbekanntem Servicepersonal normalerweise <strong>Sie</strong> benutzen.
        </li>
      </ul>
    </Section>

    <Section title="10. Merksatz">
      <div style={note}>
        <strong>Wunsch:</strong> möchte / hätte gern<br />
        <strong>Höfliche Bitte:</strong> könnte / könnten<br />
        <strong>Modalform + Verb:</strong> Infinitiv am Ende<br />
        <strong>Bestelltes Nomen:</strong> oft Akkusativ<br />
        <strong>Frage:</strong> Verb vor dem Subjekt<br />
        <strong>Formell:</strong> Sie
      </div>
    </Section>

    <Section title="11. Anwenden">
      <p style={paragraph}>
        Baue einen kurzen Restaurantdialog mit diesen sechs Schritten:
      </p>
      <ol style={list}>
        <li>Begrüßung.</li>
        <li>Um die Speisekarte bitten.</li>
        <li>Ein Essen und ein Getränk bestellen.</li>
        <li>Eine Frage zum Essen stellen.</li>
        <li>Auf ein kleines Problem reagieren.</li>
        <li>Um die Rechnung bitten.</li>
      </ol>
      <div style={formula}>
        Guten Abend. Könnte ich bitte die Speisekarte bekommen?<br />
        Ich hätte gern einen Salat und ein Mineralwasser.<br />
        Was empfehlen Sie als Dessert?<br />
        Entschuldigung, ich habe den Salat ohne Käse bestellt.<br />
        Könnten Sie das bitte ändern?<br />
        Wir möchten bitte zahlen.
      </div>
    </Section>
  </div>
);

export default function A2Day8ImperativeGrammarPage({ embedded = false }) {
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
