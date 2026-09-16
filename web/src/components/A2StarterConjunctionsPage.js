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
        <p style={{ ...styles.subtitle, margin: 0 }}>Grammatik: <strong>Gründe und Folgen</strong> mit <strong>weil</strong>, <strong>denn</strong> und <strong>deshalb</strong>.</p>
        <p style={paragraph}>
          <strong>Lernziel:</strong> Du sollst nicht nur drei Wörter auswendig lernen. Du sollst verstehen, ob du einen
          <strong> Grund</strong> oder eine <strong>Folge</strong> ausdrücken möchtest und danach die richtige Wortstellung bilden.
        </p>
      </header>

      <section style={card}>
        <h2 style={{ margin: 0 }}>1. Zuerst die Bedeutung verstehen: Grund oder Folge?</h2>
        <p style={paragraph}>
          Im Small Talk erklärst du oft <strong>warum</strong> etwas so ist. Dafür brauchst du <strong>weil</strong> oder
          <strong> denn</strong>. Wenn du dagegen sagst, <strong>was als Ergebnis passiert</strong>, benutzt du <strong>deshalb</strong>.
        </p>
        <ul style={list}>
          <li><strong>Grund:</strong> Ich bin heute müde. Warum? → Ich habe schlecht geschlafen.</li>
          <li><strong>Mit weil:</strong> Ich bin heute müde, <strong>weil ich schlecht geschlafen habe</strong>.</li>
          <li><strong>Mit denn:</strong> Ich bin heute müde, <strong>denn ich habe schlecht geschlafen</strong>.</li>
          <li><strong>Folge:</strong> Ich habe schlecht geschlafen. <strong>Deshalb bin ich heute müde</strong>.</li>
        </ul>
        <p style={paragraph}>
          Die Information kann ähnlich sein, aber die Blickrichtung ist anders: <strong>weil/denn erklären den Grund;</strong>
          <strong> deshalb nennt die Folge.</strong>
        </p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>2. „weil“: Der konjugierte Verbteil geht ans Ende</h2>
        <p style={paragraph}>
          <strong>weil</strong> leitet einen Nebensatz ein. In einem Nebensatz steht das konjugierte Verb am Ende. Zwischen Hauptsatz
          und weil-Satz steht normalerweise ein Komma.
        </p>
        <ul style={list}>
          <li>Ich lerne Deutsch, <strong>weil ich in Deutschland arbeiten möchte</strong>.</li>
          <li>Ich bleibe heute zu Hause, <strong>weil ich krank bin</strong>.</li>
          <li>Ich bin entspannt, <strong>weil ich heute frei habe</strong>.</li>
        </ul>
        <p style={paragraph}>
          <strong>Mit Modalverb:</strong> „möchte“ steht am Ende: … weil ich in Deutschland arbeiten <strong>möchte</strong>.
          <br /><strong>Mit Perfekt:</strong> das Hilfsverb steht am Ende: … weil ich schlecht geschlafen <strong>habe</strong>.
        </p>
        <p style={paragraph}>
          Du kannst den weil-Satz auch zuerst stellen: <strong>Weil ich morgen früh arbeite, gehe ich heute früh ins Bett.</strong>
          Nach dem Nebensatz beginnt der Hauptsatz direkt mit dem Verb: <strong>gehe ich</strong>.
        </p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>3. „denn“: Der zweite Satz bleibt ein normaler Hauptsatz</h2>
        <p style={paragraph}>
          <strong>denn</strong> bedeutet ebenfalls „because“, aber es verändert die Wortstellung nicht. Nach <strong>denn</strong>
          steht wieder ein normaler Hauptsatz: Subjekt + konjugiertes Verb + weitere Informationen.
        </p>
        <ul style={list}>
          <li>Ich lerne Deutsch, <strong>denn ich möchte in Deutschland arbeiten</strong>.</li>
          <li>Ich trinke Tee, <strong>denn Kaffee ist mir zu stark</strong>.</li>
          <li>Ich gehe heute früh nach Hause, <strong>denn ich bin müde</strong>.</li>
        </ul>
        <p style={paragraph}>
          Vergleiche: <strong>weil ich müde bin</strong> ↔ <strong>denn ich bin müde</strong>. Die Bedeutung ist ähnlich, aber die
          Grammatik ist verschieden.
        </p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>4. „deshalb“: Die Folge kommt zuerst, dann sofort das Verb</h2>
        <p style={paragraph}>
          <strong>deshalb</strong> ist keine Konjunktion wie <strong>weil</strong> oder <strong>denn</strong>. Es ist ein Konjunktionaladverb.
          Wenn <strong>deshalb</strong> an Position 1 steht, muss das konjugierte Verb direkt danach an Position 2 kommen.
        </p>
        <ul style={list}>
          <li>Ich bin müde. <strong>Deshalb gehe ich</strong> früh schlafen.</li>
          <li>Es regnet. <strong>Deshalb bleibe ich</strong> zu Hause.</li>
          <li>Ich habe morgen Unterricht. <strong>Deshalb stehe ich</strong> früh auf.</li>
        </ul>
        <p style={paragraph}>
          <strong>Falsch:</strong> Deshalb ich gehe früh schlafen. <br />
          <strong>Richtig:</strong> Deshalb <strong>gehe ich</strong> früh schlafen.
        </p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>5. Derselbe Inhalt mit drei verschiedenen Strukturen</h2>
        <p style={paragraph}>Grundidee: <strong>Ich bin krank. Ich bleibe zu Hause.</strong></p>
        <ul style={list}>
          <li><strong>weil:</strong> Ich bleibe zu Hause, <strong>weil ich krank bin</strong>.</li>
          <li><strong>denn:</strong> Ich bleibe zu Hause, <strong>denn ich bin krank</strong>.</li>
          <li><strong>deshalb:</strong> Ich bin krank. <strong>Deshalb bleibe ich zu Hause</strong>.</li>
        </ul>
        <p style={paragraph}>
          Merkhilfe: <strong>weil = Verb am Ende</strong> · <strong>denn = normale Wortstellung</strong> ·
          <strong> deshalb = deshalb + Verb + Subjekt</strong>.
        </p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>6. So benutzt du die Grammatik im echten Small Talk</h2>
        <p style={paragraph}>
          Eine natürliche Antwort besteht oft aus einer Information, einem Grund und einer Rückfrage. Dadurch klingt das Gespräch
          nicht wie ein Fragebogen.
        </p>
        <p style={paragraph}>
          <strong>A:</strong> Wie geht es dir heute?<br />
          <strong>B:</strong> Ganz gut, <strong>weil ich heute frei habe</strong>. Und dir?<br />
          <strong>A:</strong> Ich bin etwas müde, <strong>denn ich habe gestern lange gearbeitet</strong>.<br />
          <strong>B:</strong> Ach so. Musst du heute wieder arbeiten?<br />
          <strong>A:</strong> Nein. Ich habe heute keine Termine. <strong>Deshalb kann ich mich ausruhen</strong>.
        </p>
        <p style={paragraph}>
          Achte darauf: Die Grammatik ist hier kein isoliertes Thema. Sie hilft dir, <strong>eine Antwort zu verlängern und ein Gespräch weiterzuführen</strong>.
        </p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>7. Häufige Fehler</h2>
        <ul style={list}>
          <li><strong>Falsch:</strong> weil ich bin müde. → <strong>Richtig:</strong> weil ich müde <strong>bin</strong>.</li>
          <li><strong>Falsch:</strong> denn ich müde bin. → <strong>Richtig:</strong> denn ich <strong>bin</strong> müde.</li>
          <li><strong>Falsch:</strong> Deshalb ich bleibe zu Hause. → <strong>Richtig:</strong> Deshalb <strong>bleibe ich</strong> zu Hause.</li>
          <li><strong>Falsch:</strong> Ich lerne Deutsch weil ich in Deutschland arbeiten möchte. → Besser mit Komma: Ich lerne Deutsch, <strong>weil</strong> ...</li>
          <li><strong>Bedeutungsfehler:</strong> „deshalb“ beantwortet nicht direkt „Warum?“. Es zeigt die <strong>Folge</strong>.</li>
        </ul>
      </section>

      <A2MiniLearningBlock
        title="Knowledge Test · weil, denn, deshalb"
        rule="Entscheide zuerst zwischen Grund und Folge. Prüfe danach die Wortstellung."
        examples={[
          "Grund + weil → Verb am Ende",
          "Grund + denn → normale Hauptsatz-Wortstellung",
          "Folge + deshalb → deshalb + Verb + Subjekt",
        ]}
        questions={[
          { stem: "Welcher Satz mit weil ist richtig?", options: ["Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte.", "Ich lerne Deutsch, weil ich möchte in Deutschland arbeiten."], answer: 0, explanation: "Im weil-Satz steht das konjugierte Verb am Ende: arbeiten möchte." },
          { stem: "Welcher Satz mit denn ist richtig?", options: ["Ich bin müde, denn ich habe schlecht geschlafen.", "Ich bin müde, denn ich schlecht geschlafen habe."], answer: 0, explanation: "Nach denn bleibt die normale Hauptsatz-Wortstellung." },
          { stem: "Es regnet. ___ bleibe ich zu Hause.", options: ["Weil", "Deshalb", "Denn"], answer: 1, explanation: "Regen ist der Grund; zu Hause bleiben ist die Folge. Deshalb zeigt die Folge." },
          { stem: "Welche Wortstellung ist nach deshalb richtig?", options: ["Deshalb ich gehe früh.", "Deshalb gehe ich früh.", "Deshalb ich früh gehe."], answer: 1, explanation: "Deshalb steht auf Position 1, das Verb kommt direkt danach auf Position 2." },
          { stem: "Welche Form bedeutet: I stay home because I am sick?", options: ["Ich bleibe zu Hause, weil ich krank bin.", "Ich bin krank. Deshalb bleibe ich zu Hause.", "Beide sind sinnvoll, aber A nennt den Grund direkt mit because."], answer: 2, explanation: "A entspricht direkt because; B beschreibt dieselbe Logik als Grund plus Folge." },
          { stem: "Wo steht das Verb bei: weil ich gestern lange gearbeitet ___?", options: ["habe", "bin", "hat"], answer: 0, explanation: "Im Perfekt steht das konjugierte Hilfsverb im weil-Satz am Ende: gearbeitet habe." },
          { stem: "Welche Antwort klingt im Small Talk natürlicher?", options: ["Gut.", "Gut, weil ich heute frei habe. Und dir?"], answer: 1, explanation: "Eine kleine Information plus Grund und Rückfrage hält das Gespräch am Laufen." },
          { stem: "Welche Aussage ist richtig?", options: ["weil und denn haben immer dieselbe Wortstellung.", "deshalb zeigt meistens eine Folge.", "nach denn steht das Verb am Satzende."], answer: 1, explanation: "Deshalb verbindet einen Grund mit seiner Folge; die anderen Aussagen sind grammatisch falsch." },
        ]}
        outputPrompt="Schreibe oder sage fünf Small-Talk-Sätze über deinen Tag: zwei mit weil, einen mit denn, einen mit deshalb und eine Rückfrage an deinen Gesprächspartner."
        starters={["Mir geht es ..., weil ...", "Ich ..., denn ...", "Ich habe ..., deshalb ...", "Und du? ..."]}
      />
    </div>
  );
}
