import React from "react";

const cardStyle = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20, display: "grid", gap: 10 };
const styles = { page: { maxWidth: 980, margin: "0 auto", padding: "32px 16px 48px", display: "grid", gap: 16 }, levelPill: { display: "inline-flex", width: "fit-content", padding: "6px 10px", borderRadius: 999, border: "1px solid #cbd5e1", fontWeight: 700, fontSize: 12, color: "#0f172a", background: "#f8fafc" }, title: { fontSize: "clamp(1.6rem, 2.4vw, 2.1rem)", lineHeight: 1.2, color: "#0f172a" }, checklist: { margin: 0, paddingLeft: 20, display: "grid", gap: 8, lineHeight: 1.65 } };

const C1Day14InnovationUndZukunftGrammarNotesPage = () => (
  <main style={styles.page}>
    <header style={{ ...cardStyle, gap: 8 }}>
      <span style={styles.levelPill}>C1 · Day 14 Grammar Notes</span>
      <h1 style={{ ...styles.title, margin: 0 }}>Innovation und Zukunft</h1>
      <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Grammatikfokus:</strong> Futurformen und Prognosesprache</p>
    </header>
    <section style={cardStyle}><h2 style={{ margin: 0 }}>Einführung</h2><p style={{ margin: 0, lineHeight: 1.7 }}>Wenn du über Innovationen sprichst, musst du Chancen, Risiken und Entwicklungsszenarien präzise formulieren. Auf C1-Niveau brauchst du dafür nicht nur Zukunftsformen, sondern auch sprachliche Mittel, um Prognosen differenziert und glaubwürdig zu markieren.</p></section>
    <section style={cardStyle}><h2 style={{ margin: 0 }}>Funktion</h2><p style={{ margin: 0, lineHeight: 1.7 }}>Futur I, Futur II und Prognosemarker helfen dir, zukünftige Entwicklungen einzuordnen: sicher, wahrscheinlich, unsicher oder spekulativ. So wirkt dein Text analytisch statt pauschal.</p></section>
    <section style={cardStyle}><h2 style={{ margin: 0 }}>Formen/Muster</h2><ul style={styles.checklist}><li><strong>Futur I:</strong> In fünf Jahren <em>wird</em> KI viele Routineaufgaben <em>übernehmen</em>.</li><li><strong>Futur II:</strong> Bis 2035 <em>wird</em> sich der Energiemarkt stark <em>verändert haben</em>.</li><li><strong>Prognosemarker:</strong> vermutlich, voraussichtlich, aller Wahrscheinlichkeit nach, es ist anzunehmen, dass ...</li><li><strong>Konditionale Zukunft:</strong> Falls die Infrastruktur ausgebaut wird, könnten Start-ups schneller wachsen.</li></ul></section>
    <section style={cardStyle}><h2 style={{ margin: 0 }}>Beispiele</h2><ul style={styles.checklist}><li>Expert:innen gehen davon aus, dass hybride Arbeitsmodelle langfristig dominieren <strong>werden</strong>.</li><li>Viele Berufe <strong>werden sich verändert haben</strong>, bevor neue Ausbildungsstandards flächendeckend greifen.</li><li>Aller Wahrscheinlichkeit nach <strong>wird</strong> der Innovationsdruck in kleinen Unternehmen weiter steigen.</li><li>Es ist nicht auszuschließen, dass bestimmte Technologien gesellschaftlich stärker reguliert <strong>werden</strong>.</li></ul></section>
    <section style={cardStyle}><h2 style={{ margin: 0 }}>Häufige Fehler</h2><ul style={styles.checklist}><li><strong>Zu absolute Aussagen:</strong> „Technologie löst alle Probleme.“ → besser: „Technologie <em>kann</em> unter bestimmten Bedingungen ..."</li><li><strong>Falsches Futur-II-Muster:</strong> „wird verändert“ statt „wird verändert <em>haben</em>“ bei abgeschlossenem Zukunftsbezug.</li><li><strong>Registerbruch:</strong> Umgangssprachliche Prognosen („safe“, „fix“) in formellen C1-Texten vermeiden.</li></ul></section>
    <section style={cardStyle}><h2 style={{ margin: 0 }}>Mini-Übung (MCQ)</h2><p style={{ margin: 0 }}><strong>Welche Formulierung ist für eine vorsichtige C1-Prognose am passendsten?</strong></p><ul style={styles.checklist}><li>a) KI übernimmt morgen alle Jobs.</li><li>b) KI wird vielleicht eventuell irgendwie viele Jobs machen.</li><li>c) Aller Wahrscheinlichkeit nach wird KI bestimmte Tätigkeiten automatisieren, während neue Berufsfelder entstehen.</li><li>d) KI hat alle Tätigkeiten ersetzt haben.</li></ul><p style={{ margin: 0 }}><strong>Lösung:</strong> c)</p></section>
    <section style={cardStyle}><h2 style={{ margin: 0 }}>Takeaway</h2><p style={{ margin: 0, lineHeight: 1.7 }}>Mit Futurformen und präziser Prognosesprache zeigst du auf C1, dass du Zukunftsthemen differenziert bewerten kannst: faktennah, argumentativ und sprachlich kontrolliert.</p></section>
  </main>
);

export default C1Day14InnovationUndZukunftGrammarNotesPage;
