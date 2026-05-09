import React from "react";

const cardStyle = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20, display: "grid", gap: 10 };
const HERO_IMAGE = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=80";
const styles = { page: { maxWidth: 980, margin: "0 auto", padding: "32px 16px 48px", display: "grid", gap: 16 }, levelPill: { display: "inline-flex", width: "fit-content", padding: "6px 10px", borderRadius: 999, border: "1px solid #cbd5e1", fontWeight: 700, fontSize: 12, color: "#0f172a", background: "#f8fafc" }, title: { fontSize: "clamp(1.6rem, 2.4vw, 2.1rem)", lineHeight: 1.2, color: "#0f172a" }, checklist: { margin: 0, paddingLeft: 20, display: "grid", gap: 8, lineHeight: 1.65 } };

const C1Day15BildungUndLebenslangesLernenGrammarNotesPage = () => (
  <main style={styles.page}>
    <header style={{ ...cardStyle, gap: 8 }}>
      <span style={styles.levelPill}>C1 · Day 15 Grammar Notes</span>
      <h1 style={{ ...styles.title, margin: 0 }}>Bildung und lebenslanges Lernen</h1>
      <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Grammatikfokus:</strong> Nominalisierung und Passiversatzformen für wissenschaftsnahe Argumentation</p>
    </header>
    <img src={HERO_IMAGE} alt="Erwachsene Lernende in einem modernen Bildungsraum" loading="lazy" style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 12, border: "1px solid #e5e7eb" }} />
    <section style={cardStyle}><h2 style={{ margin: 0 }}>Einführung</h2><p style={{ margin: 0, lineHeight: 1.7 }}>Bei Bildungsthemen auf C1-Niveau musst du komplexe Zusammenhänge präzise und sachlich darstellen. Dafür eignen sich Nominalisierungen und Passiversatzformen, weil sie Informationen verdichten und den Fokus auf Prozesse statt auf handelnde Personen legen.</p></section>
    <section style={cardStyle}><h2 style={{ margin: 0 }}>Funktion</h2><p style={{ margin: 0, lineHeight: 1.7 }}>Mit Nominalstil und Passiversatz kannst du wissenschaftsnahe, strukturierte Texte verfassen: Ursachen, Folgen und Maßnahmen werden klar gegliedert, ohne unnötig persönlich zu wirken.</p></section>
    <section style={cardStyle}><h2 style={{ margin: 0 }}>Formen/Muster</h2><ul style={styles.checklist}><li><strong>Nominalisierung:</strong> „dass man Kompetenzen erweitert“ → „die Erweiterung von Kompetenzen“</li><li><strong>Vorgangspassiv:</strong> „Neue Lernkonzepte werden an Hochschulen getestet.“</li><li><strong>Passiversatz mit <em>sich lassen</em>:</strong> „Lernfortschritte lassen sich digital gut dokumentieren.“</li><li><strong>Passiversatz mit <em>sein + zu + Infinitiv</em>:</strong> „Digitale Lernangebote sind regelmäßig zu evaluieren.“</li></ul></section>
    <section style={cardStyle}><h2 style={{ margin: 0 }}>Beispiele</h2><ul style={styles.checklist}><li>Die <strong>Förderung</strong> von Medienkompetenz gilt als zentrale Voraussetzung für lebenslanges Lernen.</li><li>In vielen Branchen <strong>werden</strong> Weiterbildungsnachweise inzwischen systematisch <strong>berücksichtigt</strong>.</li><li>Komplexe Inhalte <strong>lassen sich</strong> durch Blended-Learning-Modelle flexibler vermitteln.</li><li>Berufsbegleitende Programme <strong>sind</strong> stärker an reale Arbeitsprozesse <strong>anzupassen</strong>.</li></ul></section>
    <section style={cardStyle}><h2 style={{ margin: 0 }}>Häufige Fehler</h2><ul style={styles.checklist}><li><strong>Übernominalisierung:</strong> Zu viele Nomen machen Sätze schwer verständlich. Mischung aus Verbal- und Nominalstil nutzen.</li><li><strong>Falscher Kasus nach Nominalisierung:</strong> „die Förderung <em>von</em> Kompetenzen“, nicht „die Förderung Kompetenzen“.</li><li><strong>Unklare Passivbezüge:</strong> Bei Passiversatz immer deutlich machen, worauf sich „sich“ oder „zu“ bezieht.</li></ul></section>
    <section style={cardStyle}><h2 style={{ margin: 0 }}>Mini-Übung (MCQ)</h2><p style={{ margin: 0 }}><strong>Welche Variante klingt am C1-angemessensten für einen Bildungskommentar?</strong></p><ul style={styles.checklist}><li>a) Man muss Leute weiterbilden, weil alles sich ändert, ja.</li><li>b) Die kontinuierliche Weiterbildung ist als strategische Investition in Beschäftigungsfähigkeit zu verstehen.</li><li>c) Weiterbildung ist cool und bringt halt mehr Chancen.</li><li>d) Man wird machen, dass alle neue Dinge lernen können getan werden.</li></ul><p style={{ margin: 0 }}><strong>Lösung:</strong> b)</p></section>
    <section style={cardStyle}><h2 style={{ margin: 0 }}>Takeaway</h2><p style={{ margin: 0, lineHeight: 1.7 }}>Wenn du Nominalisierung und Passiversatz gezielt einsetzt, wirken deine C1-Texte zu Bildung und Lernen analytisch, präzise und registergerecht – genau passend für Prüfung und akademische Kontexte.</p></section>
  </main>
);

export default C1Day15BildungUndLebenslangesLernenGrammarNotesPage;
