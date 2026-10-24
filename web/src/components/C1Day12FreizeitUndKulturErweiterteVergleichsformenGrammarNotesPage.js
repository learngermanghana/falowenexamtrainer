import React from "react";
import { styles } from "../styles";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1600&q=80";

const cardStyle = {
  ...styles.card,
  marginBottom: 0,
  display: "grid",
  gap: 10,
};

const mcqItems = [
  {
    question: "Welche Formulierung ist auf C1-Niveau am präzisesten?",
    options: [
      "a) Das Angebot ist mehr groß als früher.",
      "b) Das Angebot ist viel groß.",
      "c) Das Angebot ist deutlich vielfältiger als früher.",
      "d) Das Angebot ist am mehr vielfältig.",
    ],
    answer: "c) Das Angebot ist deutlich vielfältiger als früher.",
  },
  {
    question: "Welche Struktur zeigt einen korrekten Je-desto-Satz?",
    options: [
      "a) Je mehr man Kultur erlebt, desto offener wird der Blick.",
      "b) Je man mehr Kultur erlebt, desto wird der Blick offener.",
      "c) Je mehr Kultur erlebt man, desto offener der Blick wird.",
      "d) Je mehr man Kultur erlebt, desto der Blick wird offener.",
    ],
    answer: "a) Je mehr man Kultur erlebt, desto offener wird der Blick.",
  },
  {
    question: "Welche Aussage drückt Gleichheit korrekt aus?",
    options: [
      "a) Das Stadtfest ist so beliebt als das Musikfestival.",
      "b) Das Stadtfest ist so beliebt wie das Musikfestival.",
      "c) Das Stadtfest ist mehr beliebt wie das Musikfestival.",
      "d) Das Stadtfest ist am beliebtesten wie das Musikfestival.",
    ],
    answer: "b) Das Stadtfest ist so beliebt wie das Musikfestival.",
  },
  {
    question: "Welche Variante ist grammatisch korrekt?",
    options: [
      "a) Die Ausstellung war interessanter wie erwartet.",
      "b) Die Ausstellung war am interessanter als erwartet.",
      "c) Die Ausstellung war interessanter als erwartet.",
      "d) Die Ausstellung war mehr interessanter als erwartet.",
    ],
    answer: "c) Die Ausstellung war interessanter als erwartet.",
  },
  {
    question: "Welche Formulierung ist stilistisch am stärksten?",
    options: [
      "a) Das Projekt ist besser.",
      "b) Das Projekt ist ein bisschen besser.",
      "c) Das Projekt ist im Vergleich zur Vorjahresversion erheblich wirksamer.",
      "d) Das Projekt ist am guten.",
    ],
    answer: "c) Das Projekt ist im Vergleich zur Vorjahresversion erheblich wirksamer.",
  },
];

const C1Day12FreizeitUndKulturErweiterteVergleichsformenGrammarNotesPage = () => (
  <div style={{ display: "grid", gap: 16 }}>
    <section style={cardStyle}>
      <img
        src={HERO_IMAGE}
        alt="People enjoying a cultural event in a city"
        loading="lazy"
        style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 12, border: "1px solid #e5e7eb" }}
      />
      <span style={styles.levelPill}>C1 · Day 12 Grammar Notes</span>
      <h1 style={{ ...styles.title, margin: 0 }}>Freizeit und Kultur</h1>
      <p style={{ ...styles.helperText, margin: 0 }}><strong>Erweiterte Vergleichsformen</strong></p>
    </section>

    <section style={cardStyle}>
      <h2 style={{ margin: 0 }}>Einführung</h2>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Auf C1-Niveau reicht ein einfacher Vergleich oft nicht aus. Du sollst feine Unterschiede
        sprachlich präzise ausdrücken: Intensität, Bewertung, Entwicklung und Perspektive.
        Erweiterte Vergleichsformen helfen dir dabei, argumentativ klarer und stilistisch reifer
        zu formulieren.
      </p>
    </section>

    <section style={cardStyle}>
      <h2 style={{ margin: 0 }}>Typische Funktionen</h2>
      <ul style={styles.checklist}>
        <li>Nuancen zwischen ähnlichen Optionen deutlich machen</li>
        <li>Entwicklungen über die Zeit bewerten</li>
        <li>Argumente in Diskussionen differenziert gewichten</li>
        <li>Positionen präzise kontrastieren (z. B. Stadt vs. Land, analog vs. digital)</li>
      </ul>
    </section>

    <section style={cardStyle}>
      <h2 style={{ margin: 0 }}>Formen und Muster</h2>
      <ul style={styles.checklist}>
        <li><strong>Komparativ:</strong> interessanter, vielfältiger, zugänglicher</li>
        <li><strong>Verstärker:</strong> deutlich, weitaus, erheblich, wesentlich + Komparativ</li>
        <li><strong>Gleichheit/Ungleichheit:</strong> so ... wie / nicht so ... wie</li>
        <li><strong>Je-desto/umso:</strong> Je + Komparativ ..., desto/umso + Komparativ ...</li>
        <li><strong>Superlativ:</strong> am + Adjektiv-sten / der-die-das + Adjektiv-ste</li>
        <li><strong>Vergleichsrahmen:</strong> im Vergleich zu, gegenüber, verglichen mit</li>
      </ul>
    </section>

    <section style={cardStyle}>
      <h2 style={{ margin: 0 }}>C1-Beispiele (Freizeit und Kultur)</h2>
      <ul style={styles.checklist}>
        <li>Im Vergleich zu früher ist das Kulturangebot heute <strong>wesentlich breiter</strong> aufgestellt.</li>
        <li>Digitale Formate sind oft <strong>nicht so verbindlich wie</strong> Live-Veranstaltungen.</li>
        <li><strong>Je gezielter</strong> Städte Kultur fördern, <strong>desto sichtbarer</strong> wird lokale Teilhabe.</li>
        <li>Das neue Programm zählt zu den <strong>innovativsten</strong> Freizeitkonzepten der Region.</li>
        <li>Gegenüber rein kommerziellen Angeboten wirken Bürgerprojekte häufig <strong>nachhaltiger</strong>.</li>
      </ul>
    </section>

    <section style={cardStyle}>
      <h2 style={{ margin: 0 }}>Häufige Fehler</h2>
      <ul style={styles.checklist}>
        <li><strong>Falsch:</strong> mehr interessanter · <strong>Richtig:</strong> interessanter / deutlich interessanter</li>
        <li><strong>Falsch:</strong> so spannend als · <strong>Richtig:</strong> so spannend wie</li>
        <li><strong>Falsch:</strong> interessanter wie · <strong>Richtig:</strong> interessanter als</li>
        <li>Unklare Vergleichsbasis: Womit genau wird verglichen?</li>
      </ul>
    </section>

    <section id="knowledge-test" style={cardStyle}>
      <h2 style={{ margin: 0 }}>Mini-Übung (MCQ)</h2>
      <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
        {mcqItems.map((item, index) => (
          <li key={item.question}>
            <p style={{ margin: "0 0 4px" }}><strong>{index + 1}. {item.question}</strong></p>
            <ul style={{ margin: "0 0 8px", paddingLeft: 18 }}>
              {item.options.map((option) => (
                <li key={option}>{option}</li>
              ))}
            </ul>
            <p style={{ margin: 0 }}><strong>Richtige Antwort:</strong> {item.answer}</p>
          </li>
        ))}
      </ol>
    </section>

    <section style={cardStyle}>
      <h2 style={{ margin: 0 }}>Takeaway</h2>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Mit erweiterten Vergleichsformen argumentierst du auf C1-Niveau präziser, nuancierter und
        überzeugender. Besonders in Diskussion, Stellungnahme und Bericht sind sie ein zentrales
        Werkzeug für sprachliche Genauigkeit.
      </p>
    </section>
  </div>
);

export default C1Day12FreizeitUndKulturErweiterteVergleichsformenGrammarNotesPage;
