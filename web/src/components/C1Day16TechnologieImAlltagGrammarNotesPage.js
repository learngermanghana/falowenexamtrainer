import React from "react";

const cardStyle = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20, display: "grid", gap: 10 };
const HERO_IMAGE = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80";
const styles = { page: { maxWidth: 980, margin: "0 auto", padding: "32px 16px 48px", display: "grid", gap: 16 }, levelPill: { display: "inline-flex", width: "fit-content", padding: "6px 10px", borderRadius: 999, border: "1px solid #cbd5e1", fontWeight: 700, fontSize: 12, color: "#0f172a", background: "#f8fafc" }, title: { fontSize: "clamp(1.6rem, 2.4vw, 2.1rem)", lineHeight: 1.2, color: "#0f172a" }, checklist: { margin: 0, paddingLeft: 20, display: "grid", gap: 8, lineHeight: 1.65 } };

const C1Day16TechnologieImAlltagGrammarNotesPage = () => (
  <main style={styles.page}>
    <header style={{ ...cardStyle, gap: 8 }}>
      <span style={styles.levelPill}>C1 · Day 16 Grammar Notes</span>
      <h1 style={{ ...styles.title, margin: 0 }}>Technologie im Alltag</h1>
      <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Grammatikfokus:</strong> Ursache-Wirkung-Strukturen</p>
    </header>
    <img src={HERO_IMAGE} alt="Mensch nutzt digitale Geräte im Alltag" loading="lazy" style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 12, border: "1px solid #e5e7eb" }} />
    <section style={cardStyle}><h2 style={{ margin: 0 }}>Einführung</h2><p style={{ margin: 0, lineHeight: 1.7 }}>Wenn du über Digitalisierung im Alltag schreibst oder sprichst, musst du komplexe Zusammenhänge klar darstellen: Was führt wozu? Welche Folgen haben technologische Entwicklungen? C1-typisch ist eine präzise und differenzierte Darstellung von Ursachen und Konsequenzen.</p></section>
    <section style={cardStyle}><h2 style={{ margin: 0 }}>Funktion</h2><p style={{ margin: 0, lineHeight: 1.7 }}>Ursache-Wirkung-Strukturen helfen dir, Argumente logisch aufzubauen, Positionen zu begründen und gesellschaftliche Auswirkungen einzuordnen. So klingen deine Beiträge analytisch statt nur meinungsbasiert.</p></section>
    <section style={cardStyle}><h2 style={{ margin: 0 }}>Formen/Muster</h2><ul style={styles.checklist}><li><strong>Kausal:</strong> weil, da, aufgrund (+ Genitiv), infolge (+ Genitiv)</li><li><strong>Konsekutiv:</strong> sodass, so ... dass, folglich, demzufolge</li><li><strong>Präpositionalstil:</strong> wegen der ständigen Erreichbarkeit, als Folge der Automatisierung</li><li><strong>Nominalstil:</strong> Die Digitalisierung führt <em>zur Veränderung</em> von Kommunikationsmustern.</li></ul></section>
    <section style={cardStyle}><h2 style={{ margin: 0 }}>Beispiele</h2><ul style={styles.checklist}><li><strong>Da</strong> viele Prozesse automatisiert werden, verändern sich Berufsprofile spürbar.</li><li><strong>Aufgrund</strong> der algorithmischen Filterung sehen Nutzer:innen oft nur einen begrenzten Ausschnitt von Informationen.</li><li>Die permanente Verfügbarkeit digitaler Tools ist hilfreich, <strong>sodass</strong> Arbeitsabläufe flexibler organisiert werden können.</li><li>Die starke Datennutzung hat zugenommen; <strong>demzufolge</strong> rückt Datenschutz stärker in den Fokus.</li></ul></section>
    <section style={cardStyle}><h2 style={{ margin: 0 }}>Häufige Fehler</h2><ul style={styles.checklist}><li><strong>weil + Verb-Endstellung vergessen:</strong> „..., weil Technologien den Alltag verändern.“</li><li><strong>aufgrund + falscher Kasus:</strong> korrekt ist Genitiv („aufgrund <em>der</em> Vernetzung“).</li><li><strong>Ursache und Folge vermischt:</strong> erst Ursache benennen, dann klare Folge formulieren.</li></ul></section>
    <section style={cardStyle}><h2 style={{ margin: 0 }}>Mini-Übung (MCQ)</h2><p style={{ margin: 0 }}><strong>Welche Aussage ist grammatisch und stilistisch am besten für C1 geeignet?</strong></p><ul style={styles.checklist}><li>a) Wegen man viel online ist, gibt es Stress und so.</li><li>b) Aufgrund der ständigen Erreichbarkeit verschwimmen Arbeits- und Freizeitgrenzen, sodass viele Beschäftigte bewusste Offline-Zeiten einplanen.</li><li>c) Da Technologie ist überall, deshalb ist alles anders geworden.</li><li>d) Es gibt Folgen weil digital und dann macht man Anpassung.</li></ul><p style={{ margin: 0 }}><strong>Lösung:</strong> b)</p></section>
    <section style={cardStyle}><h2 style={{ margin: 0 }}>Takeaway</h2><p style={{ margin: 0, lineHeight: 1.7 }}>Wenn du Kausal- und Konsekutivstrukturen präzise einsetzt, argumentierst du zu Technologie im Alltag klar, logisch und C1-angemessen.</p></section>
  </main>
);

export default C1Day16TechnologieImAlltagGrammarNotesPage;
