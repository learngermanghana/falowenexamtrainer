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
const tableStyle = { width: "100%", borderCollapse: "collapse", fontSize: ".95rem" };
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

const Table = ({ children }) => (
  <div style={{ width: "100%", overflowX: "auto" }}><table style={tableStyle}>{children}</table></div>
);

const ExampleBox = ({ children }) => (
  <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, background: "#fff", lineHeight: 1.75 }}>{children}</div>
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

export default function B2Day5HealthGrammarNotes({ checked = false, onCheckedChange }) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section style={card}>
        <span style={{ ...styles.badge, width: "fit-content" }}>B2 · Day 5 · Grammar Notes</span>
        <h2 style={{ ...styles.title, margin: 0, fontSize: "clamp(1.7rem,4vw,2.5rem)" }}>Ursache und Folge klar verbinden</h2>
        <p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.7 }}>
          Grammatik zum Thema <strong>Gesundheit und Wohlbefinden</strong>: Stressursachen erklären, Folgen logisch darstellen und Empfehlungen überzeugend begründen.
        </p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Warum brauchst du diese Grammatik auf B2?</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Auf B2 reicht es nicht, nur zu sagen: <em>Ich bin gestresst.</em> Du solltest erklären, warum der Stress entsteht, welche Folgen er hat und welche realistische Lösung helfen könnte. Dafür musst du Ursache und Folge sprachlich klar unterscheiden.
        </p>
        <NoteBox>
          <strong>Nach dieser Lektion kannst du:</strong>
          <ul style={{ ...listStyle, marginTop: 8 }}>
            <li>Ursachen mit <em>weil</em> und <em>da</em> formulieren,</li>
            <li>Folgen mit <em>deshalb, daher</em> und <em>aus diesem Grund</em> ausdrücken,</li>
            <li>die richtige Verbposition in Neben- und Hauptsätzen verwenden,</li>
            <li>Ursache, Folge, Beispiel und Empfehlung zu einer B2-Antwort verbinden und</li>
            <li>Wiederholungen durch passende Umformulierungen vermeiden.</li>
          </ul>
        </NoteBox>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>1. Was ist die Ursache und was ist die Folge?</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>Bestimme zuerst die logische Beziehung. Danach wählst du den passenden Konnektor.</p>
        <Table>
          <thead><tr><th style={cellStyle}>Frage</th><th style={cellStyle}>Bedeutung</th><th style={cellStyle}>Beispiel</th></tr></thead>
          <tbody>
            <tr><td style={cellStyle}><strong>Warum?</strong></td><td style={cellStyle}>Ursache / Grund</td><td style={cellStyle}>Viele Menschen sind erschöpft, <strong>weil</strong> sie zu wenig schlafen.</td></tr>
            <tr><td style={cellStyle}><strong>Was ist die Folge?</strong></td><td style={cellStyle}>Ergebnis / Konsequenz</td><td style={cellStyle}>Viele Menschen schlafen zu wenig. <strong>Deshalb</strong> sind sie tagsüber erschöpft.</td></tr>
            <tr><td style={cellStyle}><strong>Welche Lösung folgt daraus?</strong></td><td style={cellStyle}>Empfehlung</td><td style={cellStyle}>Aus diesem Grund sollte man feste Schlafzeiten einplanen.</td></tr>
          </tbody>
        </Table>
        <NoteBox tone="amber"><strong>Merke:</strong> Derselbe Zusammenhang kann aus zwei Perspektiven formuliert werden: <em>Ich bin müde, weil ich wenig schlafe.</em> – <em>Ich schlafe wenig; deshalb bin ich müde.</em></NoteBox>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>2. Ursache mit weil und da</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}><em>Weil</em> und <em>da</em> leiten einen Nebensatz ein. Das konjugierte Verb steht am Ende.</p>
        <Table>
          <thead><tr><th style={cellStyle}>Konnektor</th><th style={cellStyle}>Verwendung</th><th style={cellStyle}>Beispiel</th></tr></thead>
          <tbody>
            <tr><td style={cellStyle}><strong>weil</strong></td><td style={cellStyle}>häufig in Alltag und Schrift</td><td style={cellStyle}>Ich mache regelmäßig Pausen, weil ich konzentriert bleiben möchte.</td></tr>
            <tr><td style={cellStyle}><strong>da</strong></td><td style={cellStyle}>oft formeller oder bei bekanntem Grund</td><td style={cellStyle}>Da Bewegung Stress reduziert, sollte sie zum Alltag gehören.</td></tr>
            <tr><td style={cellStyle}><strong>Nebensatz zuerst</strong></td><td style={cellStyle}>danach Verb vor Subjekt</td><td style={cellStyle}>Weil viele Beschäftigte kaum Pausen machen, sinkt ihre Konzentration.</td></tr>
            <tr><td style={cellStyle}><strong>mit Modalverb</strong></td><td style={cellStyle}>gesamte Verbgruppe am Ende</td><td style={cellStyle}>Viele Menschen sind gestresst, weil sie ständig erreichbar sein müssen.</td></tr>
          </tbody>
        </Table>
        <Mistake wrong="Ich mache Pausen, weil ich möchte konzentriert bleiben." correct="Ich mache Pausen, weil ich konzentriert bleiben möchte." />
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>3. Folge mit deshalb, daher und aus diesem Grund</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>Diese Ausdrücke leiten einen Hauptsatz ein. Sie stehen häufig auf Position eins; direkt danach folgt das konjugierte Verb.</p>
        <Table>
          <thead><tr><th style={cellStyle}>Ausdruck</th><th style={cellStyle}>Struktur</th><th style={cellStyle}>Beispiel</th></tr></thead>
          <tbody>
            <tr><td style={cellStyle}><strong>deshalb</strong></td><td style={cellStyle}>deshalb + Verb + Subjekt</td><td style={cellStyle}>Ich schlafe zu wenig. Deshalb bin ich tagsüber müde.</td></tr>
            <tr><td style={cellStyle}><strong>daher</strong></td><td style={cellStyle}>daher + Verb + Subjekt</td><td style={cellStyle}>Viele Beschäftigte machen kaum Pausen; daher sinkt ihre Konzentration.</td></tr>
            <tr><td style={cellStyle}><strong>aus diesem Grund</strong></td><td style={cellStyle}>Aus diesem Grund + Verb + Subjekt</td><td style={cellStyle}>Aus diesem Grund sollte man kleine Erholungszeiten einplanen.</td></tr>
            <tr><td style={cellStyle}><strong>Position drei</strong></td><td style={cellStyle}>Subjekt + Verb + deshalb</td><td style={cellStyle}>Ich plane deshalb jeden Nachmittag eine kurze Pause ein.</td></tr>
          </tbody>
        </Table>
        <Mistake wrong="Ich schlafe wenig, deshalb ich bin müde." correct="Ich schlafe wenig; deshalb bin ich müde." />
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>4. weil oder deshalb?</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>Beide verbinden Ursache und Folge, aber die Satzstruktur und der Schwerpunkt sind unterschiedlich.</p>
        <Table>
          <thead><tr><th style={cellStyle}>Schwerpunkt</th><th style={cellStyle}>Struktur</th><th style={cellStyle}>Beispiel</th></tr></thead>
          <tbody>
            <tr><td style={cellStyle}><strong>Grund hervorheben</strong></td><td style={cellStyle}>Folge + weil + Ursache</td><td style={cellStyle}>Ich gehe früher schlafen, weil ich morgens konzentrierter sein möchte.</td></tr>
            <tr><td style={cellStyle}><strong>Folge hervorheben</strong></td><td style={cellStyle}>Ursache. Deshalb + Folge</td><td style={cellStyle}>Ich möchte morgens konzentrierter sein. Deshalb gehe ich früher schlafen.</td></tr>
            <tr><td style={cellStyle}><strong>formeller Grund</strong></td><td style={cellStyle}>Da + Ursache, Folge</td><td style={cellStyle}>Da ausreichend Schlaf die Leistungsfähigkeit verbessert, sind feste Schlafzeiten sinnvoll.</td></tr>
          </tbody>
        </Table>
        <Mistake wrong="Deshalb weil ich müde bin, mache ich eine Pause." correct="Weil ich müde bin, mache ich eine Pause. / Ich bin müde; deshalb mache ich eine Pause." />
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>5. Eine vollständige B2-Argumentation aufbauen</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>Verbinde nicht nur zwei Sätze. Entwickle einen klaren Gedankengang aus Ursache, Folge, Beispiel und Empfehlung.</p>
        <ExampleBox>
          <div><strong>1. Ursache:</strong> Viele Menschen fühlen sich gestresst, weil sie Arbeit und private Verpflichtungen gleichzeitig organisieren müssen.</div>
          <div><strong>2. Folge:</strong> Dadurch schlafen sie häufig schlechter und können sich weniger gut konzentrieren.</div>
          <div><strong>3. Beispiel:</strong> Wer abends noch berufliche Nachrichten beantwortet, findet oft nur schwer Ruhe.</div>
          <div><strong>4. Empfehlung:</strong> Aus diesem Grund sollte man feste handyfreie Zeiten einplanen.</div>
          <div><strong>5. Vorteil:</strong> Der Vorteil besteht darin, dass Körper und Geist regelmäßig Erholung erhalten.</div>
        </ExampleBox>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>B2-Modellabsatz</h2>
        <NoteBox tone="green">
          Meiner Meinung nach sind kleine tägliche Gewohnheiten wirksamer als große kurzfristige Veränderungen. Viele Menschen fühlen sich überfordert, weil sie ständig erreichbar sind und kaum Pausen einplanen. Deshalb leiden häufig ihre Konzentration und ihr Schlaf. Da gesunde Routinen realistisch zum Alltag passen müssen, sollte man mit kleinen Schritten beginnen. Eine Möglichkeit wäre, jeden Tag einen kurzen Spaziergang zu machen und das Handy vor dem Schlafen auszuschalten. Aus diesem Grund lassen sich solche Gewohnheiten leichter langfristig beibehalten. Ein weiterer Vorteil besteht darin, dass regelmäßige Erholung Stress reduziert und das allgemeine Wohlbefinden verbessert.
        </NoteBox>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Typische Fehler</h2>
        <ul style={listStyle}>
          <li>das Verb nach <em>weil</em> oder <em>da</em> nicht ans Ende stellen,</li>
          <li>nach <em>deshalb</em> oder <em>daher</em> das Subjekt vor das Verb setzen,</li>
          <li><em>deshalb weil</em> als Doppelverbindung verwenden,</li>
          <li>Ursache und Folge logisch vertauschen,</li>
          <li>mehrfach nur <em>weil</em> benutzen, obwohl andere Verbindungen möglich sind,</li>
          <li>eine Empfehlung nennen, ohne sie mit der beschriebenen Ursache zu verbinden.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Schrittweise Mini-Übung</h2>
        <ol style={listStyle}>
          <li>Markiere in vier Beispielen jeweils Ursache und Folge.</li>
          <li>Verbinde zwei Satzpaare mit <em>weil</em> und zwei mit <em>da</em>.</li>
          <li>Forme zwei weil-Sätze mit <em>deshalb</em> oder <em>daher</em> um.</li>
          <li>Ergänze zu einer Stressursache eine Folge, ein Beispiel und eine Empfehlung.</li>
          <li>Schreibe 90–110 Wörter über eine gesunde Routine und nutze mindestens vier verschiedene kausale Verbindungen.</li>
        </ol>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Selbstkontrolle</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>Löse die Aufgabe zuerst selbst und öffne danach die Antwort.</p>
        <CheckAnswer question="1. Ich mache Pausen, weil ich konzentriert bleiben ___.">
          <strong>Lösung:</strong> möchte. Im weil-Nebensatz steht das konjugierte Verb am Ende.
        </CheckAnswer>
        <CheckAnswer question="2. Ich schlafe zu wenig. Deshalb ___ ich tagsüber müde.">
          <strong>Lösung:</strong> bin. Nach deshalb folgt das Verb auf Position zwei.
        </CheckAnswer>
        <CheckAnswer question="3. Forme um: Ich bin erschöpft, weil ich kaum Pausen mache.">
          <strong>Lösung:</strong> Ich mache kaum Pausen; deshalb bin ich erschöpft.
        </CheckAnswer>
        <CheckAnswer question="4. Welche Verbindung ist korrekt: Deshalb weil ich Stress habe / Weil ich Stress habe / Deshalb ich habe Stress?">
          <strong>Lösung:</strong> Weil ich Stress habe, … / Ich habe Stress; deshalb …
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
