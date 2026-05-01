import React from "react";
import { styles } from "../styles";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80";

const cardStyle = {
  ...styles.card,
  marginBottom: 0,
  display: "grid",
  gap: 10,
};

const mcqItems = [
  {
    question: "Welche Form ist korrekt? " +
      "Das Konzert war ___ als das Festival im letzten Jahr.",
    options: ["a) viel beeindruckend", "b) weitaus beeindruckender", "c) mehr beeindruckend", "d) am beeindruckendsten"],
    answer: "b) weitaus beeindruckender",
  },
  {
    question: "Welche Struktur zeigt eine doppelte Vergleichsform?",
    options: [
      "a) so interessant wie",
      "b) je häufiger man übt, desto sicherer spricht man",
      "c) am interessantesten",
      "d) nicht so interessant wie",
    ],
    answer: "b) je häufiger man übt, desto sicherer spricht man",
  },
  {
    question: "Welche Aussage drückt einen klaren Unterschied aus?",
    options: [
      "a) Kulturangebote sind wie Freizeitaktivitäten.",
      "b) Das Museum ist ähnlich wie das Theater.",
      "c) Der neue Kulturpass ist deutlich günstiger als früher.",
      "d) Der Film war so wie das Buch.",
    ],
    answer: "c) Der neue Kulturpass ist deutlich günstiger als früher.",
  },
  {
    question: "Welche Variante ist stilistisch am besten für C1?",
    options: [
      "a) Das Event war mehr interessant.",
      "b) Das Event war interessanter.",
      "c) Das Event war erheblich interessanter.",
      "d) Das Event war interessantester.",
    ],
    answer: "c) Das Event war erheblich interessanter.",
  },
  {
    question: "Welche Form ist korrekt ergänzt? " +
      "Die Auswahl an Freizeitangeboten ist heute ___ vielfältig wie vor zehn Jahren.",
    options: ["a) so", "b) mehr", "c) am", "d) desto"],
    answer: "a) so",
  },
];

const C1Day12FreizeitUndKulturErweiterteVergleichsformenGrammarNotesPage = () => (
  <div style={{ display: "grid", gap: 16 }}>
    <section style={cardStyle}>
      <img src={HERO_IMAGE} alt="People enjoying a cultural festival in the evening" loading="lazy" style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 12, border: "1px solid #e5e7eb" }} />
      <span style={styles.levelPill}>C1 · Day 12 Grammar Notes</span>
      <h1 style={{ ...styles.title, margin: 0 }}>Freizeit und Kultur</h1>
      <p style={{ ...styles.helperText, margin: 0 }}><strong>Erweiterte Vergleichsformen</strong></p>
    </section>

    <section style={cardStyle}><h2 style={{ margin: 0 }}>Einführung</h2><p style={{ margin: 0, lineHeight: 1.7 }}>Erweiterte Vergleichsformen helfen dir auf C1-Niveau, feine Unterschiede präzise auszudrücken. Statt nur „größer/kleiner" nutzt du Abstufungen, Verstärker und komplexe Vergleichsstrukturen, um Argumente differenziert darzustellen.</p></section>

    <section style={cardStyle}><h2 style={{ margin: 0 }}>Funktion</h2><ul style={styles.checklist}><li>Nuancen zwischen Optionen sichtbar machen</li><li>Argumente überzeugender strukturieren</li><li>Bewertungen klar abstufen</li><li>Kontraste in Diskussionen präzise formulieren</li></ul></section>

    <section style={cardStyle}><h2 style={{ margin: 0 }}>Formen</h2><ul style={styles.checklist}><li><strong>Komparativ + Verstärker:</strong> deutlich, wesentlich, weitaus, erheblich + Komparativ</li><li><strong>Gleichheit/Ungleichheit:</strong> so ... wie / nicht so ... wie</li><li><strong>Je-desto-Sätze:</strong> Je + Komparativ ..., desto/umso + Komparativ ...</li><li><strong>Superlativ im Kontext:</strong> am + Adjektiv-sten / der-die-das + Adjektiv-ste</li><li><strong>Vergleich mit Bezugspunkt:</strong> im Vergleich zu, gegenüber, verglichen mit</li></ul></section>

    <section style={cardStyle}><h2 style={{ margin: 0 }}>Beispiele</h2><ul style={styles.checklist}><li>Das Theaterprogramm ist <strong>wesentlich vielfältiger</strong> als noch vor fünf Jahren.</li><li>Viele Stadtfeste sind heute <strong>nicht so lokal geprägt wie</strong> früher.</li><li><strong>Je öfter</strong> man Kulturveranstaltungen besucht, <strong>desto differenzierter</strong> wird der eigene Blick.</li><li>Im Vergleich zu reinen Streaming-Angeboten wirkt ein Live-Konzert <strong>deutlich intensiver</strong>.</li><li>Die neue Bibliothek gehört zu den <strong>modernsten</strong> Lernorten der Stadt.</li></ul></section>

    <section style={cardStyle}><h2 style={{ margin: 0 }}>Häufige Fehler</h2><ul style={styles.checklist}><li>*mehr interessanter* statt <strong>interessanter</strong> oder <strong>deutlich interessanter</strong></li><li>Verwechslung von <strong>so ... wie</strong> und <strong>als</strong></li><li>Fehlende Parallelität in je-desto-Sätzen</li><li>Unklare Vergleichsbasis (Womit wird verglichen?)</li></ul></section>

    <section id="knowledge-test" style={cardStyle}><h2 style={{ margin: 0 }}>Mini-Übung / Wissenstest (MCQ)</h2><ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>{mcqItems.map((item, index) => (<li key={item.question}><p style={{ margin: "0 0 4px" }}><strong>{index + 1}. {item.question}</strong></p><ul style={{ margin: "0 0 8px", paddingLeft: 18 }}>{item.options.map((option) => (<li key={option}>{option}</li>))}</ul><p style={{ margin: 0 }}><strong>Richtige Antwort:</strong> {item.answer}</p></li>))}</ol></section>

    <section style={cardStyle}><h2 style={{ margin: 0 }}>Takeaway</h2><p style={{ margin: 0, lineHeight: 1.7 }}>Mit erweiterten Vergleichsformen formulierst du Bewertungen präziser, argumentierst nuancierter und klingst im mündlichen wie schriftlichen Ausdruck klar auf C1-Niveau.</p></section>
  </div>
);

export default C1Day12FreizeitUndKulturErweiterteVergleichsformenGrammarNotesPage;
