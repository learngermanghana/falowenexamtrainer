import React from "react";
import { styles } from "../styles";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1600&q=80";

const cardStyle = {
  ...styles.card,
  marginBottom: 0,
  display: "grid",
  gap: 10,
};

const mcqItems = [
  {
    question: "Welche Variante zeigt korrekte indirekte Rede mit Distanzierung?",
    options: [
      "a) Die Studie sagt, Mehrsprachigkeit ist immer ein Vorteil.",
      "b) Die Studie behauptet, Mehrsprachigkeit sei immer ein Vorteil.",
      "c) Die Studie sagt, Mehrsprachigkeit wäre immer ein Vorteil, weil ich finde.",
      "d) Die Studie sagt, Mehrsprachigkeit ist gewesen ein Vorteil.",
    ],
    answer: "b) Die Studie behauptet, Mehrsprachigkeit sei immer ein Vorteil.",
  },
  {
    question: "Welche Distanzmarker-Formulierung ist C1-gerecht?",
    options: [
      "a) Laut dem Bericht ist das sicher richtig.",
      "b) Der Bericht meint eindeutig, also stimmt es.",
      "c) Dem Bericht zufolge lasse sich der Effekt nur teilweise nachweisen.",
      "d) Ich glaube, laut Bericht muss es stimmen.",
    ],
    answer: "c) Dem Bericht zufolge lasse sich der Effekt nur teilweise nachweisen.",
  },
  {
    question: "Welche Zeitform in indirekter Rede passt?",
    options: [
      "a) Die Lehrerin erklärte, die Klasse hat gestern viel diskutiert.",
      "b) Die Lehrerin erklärte, die Klasse habe am Vortag viel diskutiert.",
      "c) Die Lehrerin erklärte, die Klasse hätte am Vortag diskutiert hat.",
      "d) Die Lehrerin erklärte, die Klasse diskutiere am Vortag.",
    ],
    answer: "b) Die Lehrerin erklärte, die Klasse habe am Vortag viel diskutiert.",
  },
];

const C1Day13MehrsprachigkeitGrammarNotesPage = () => (
  <div style={{ display: "grid", gap: 16 }}>
    <section style={cardStyle}>
      <img src={HERO_IMAGE} alt="Mehrsprachige Kommunikation" loading="lazy" style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 12, border: "1px solid #e5e7eb" }} />
      <span style={styles.levelPill}>C1 · Day 13 Grammar Notes</span>
      <h1 style={{ ...styles.title, margin: 0 }}>Mehrsprachigkeit</h1>
      <p style={{ ...styles.helperText, margin: 0 }}><strong>Indirekte Rede und Distanzierung</strong></p>
    </section>

    <section style={cardStyle}><h2 style={{ margin: 0 }}>Einführung</h2><p style={{ margin: 0, lineHeight: 1.7 }}>Im Thema Mehrsprachigkeit werden häufig Positionen aus Studien, Medien und Politik wiedergegeben. Auf C1-Niveau sollst du solche Aussagen präzise berichten, ohne sie automatisch als eigene Meinung zu übernehmen.</p></section>
    <section style={cardStyle}><h2 style={{ margin: 0 }}>Funktion</h2><ul style={styles.checklist}><li>Aussagen anderer korrekt wiedergeben</li><li>Quellen sprachlich markieren</li><li>Distanz, Unsicherheit oder Vorläufigkeit ausdrücken</li><li>Zwischen Fakt, Interpretation und Bewertung unterscheiden</li></ul></section>
    <section style={cardStyle}><h2 style={{ margin: 0 }}>Formen/Muster</h2><ul style={styles.checklist}><li><strong>Konjunktiv I:</strong> Er sagt, Mehrsprachigkeit <em>fördere</em> die kognitive Flexibilität.</li><li><strong>Konjunktiv II (Ersatzform):</strong> Sie meinen, das <em>wäre</em> langfristig sinnvoll.</li><li><strong>Distanzmarker:</strong> laut, zufolge, nach Angaben von, es heißt, es wird berichtet</li><li><strong>Einbettung:</strong> Die Autorin argumentiert, dass ... / Die Studie kommt zu dem Schluss, ...</li></ul></section>
    <section style={cardStyle}><h2 style={{ margin: 0 }}>Beispiele</h2><ul style={styles.checklist}><li>Die Expertin betont, frühe Sprachförderung <strong>erleichtere</strong> Bildungswege.</li><li>Dem Ministerium zufolge <strong>sei</strong> Mehrsprachigkeit ein Standortvorteil.</li><li>In der Debatte wird eingewandt, die Umsetzung <strong>gestalte</strong> sich regional sehr unterschiedlich.</li><li>Die Autorin räumt ein, manche Maßnahmen <strong>wären</strong> ohne zusätzliches Personal kaum realisierbar.</li></ul></section>
    <section style={cardStyle}><h2 style={{ margin: 0 }}>Häufige Fehler</h2><ul style={styles.checklist}><li>Indikativ statt Konjunktiv in berichteter Rede</li><li>Fehlende Quellenmarkierung (Wer sagt das?)</li><li>Unklare Distanz: eigene Meinung und fremde Position vermischen</li><li>Falsche Zeitangaben (z. B. gestern statt am Vortag)</li></ul></section>

    <section id="knowledge-test" style={cardStyle}>
      <h2 style={{ margin: 0 }}>Mini-Übung (MCQ)</h2>
      <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
        {mcqItems.map((item, index) => (
          <li key={item.question}>
            <p style={{ margin: "0 0 4px" }}><strong>{index + 1}. {item.question}</strong></p>
            <ul style={{ margin: "0 0 8px", paddingLeft: 18 }}>{item.options.map((option) => <li key={option}>{option}</li>)}</ul>
            <p style={{ margin: 0 }}><strong>Richtige Antwort:</strong> {item.answer}</p>
          </li>
        ))}
      </ol>
    </section>

    <section style={cardStyle}><h2 style={{ margin: 0 }}>Takeaway</h2><p style={{ margin: 0, lineHeight: 1.7 }}>Mit indirekter Rede und Distanzierung zeigst du auf C1, dass du Quellen differenziert einordnen und argumentativ sauber zwischen Positionen unterscheiden kannst.</p></section>
  </div>
);

export default C1Day13MehrsprachigkeitGrammarNotesPage;
