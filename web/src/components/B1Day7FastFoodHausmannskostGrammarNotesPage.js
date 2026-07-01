import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 14 };
const sectionTitle = { margin: 0, fontSize: "1.15rem" };
const listStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const box = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, lineHeight: 1.75, background: "#fff" };
const NoteBox = ({ children, tone = "blue" }) => {
  const tones = {
    blue: { border: "#bfdbfe", background: "#eff6ff", color: "#1e3a8a" },
    green: { border: "#bbf7d0", background: "#f0fdf4", color: "#166534" },
    amber: { border: "#fde68a", background: "#fffbeb", color: "#92400e" },
    red: { border: "#fecaca", background: "#fef2f2", color: "#991b1b" },
  };
  const selected = tones[tone] || tones.blue;
  return <div style={{ border: `1px solid ${selected.border}`, background: selected.background, color: selected.color, borderRadius: 14, padding: 14, lineHeight: 1.7 }}>{children}</div>;
};

export default function B1Day7FastFoodHausmannskostGrammarNotesPage() {
  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <header style={card}>
        <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 7 · Kapitel 3.7 · Grammar Notes</span>
        <h1 style={{ ...styles.title, margin: 0 }}>Fast Food vs. Hausmannskost</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Grammatikfokus: Genitiv in festen Ausdrücken und mit wegen/trotz, damit du Ernährung, Zutaten und Gründe präzise beschreiben kannst.</p>
        <img src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1600&q=80" alt="Frische Zutaten und Essen" loading="lazy" style={{ width: "100%", borderRadius: 14, maxHeight: 290, objectFit: "cover" }} />
      </header>

      <section style={card}>
        <h2 style={sectionTitle}>Warum diese Grammatik zum Thema passt</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>Beim Thema Essen musst du oft Besitz, Bestandteile und Gründe nennen: <strong>der Zuckeranteil des Getränks</strong>, <strong>die Vorteile der Hausmannskost</strong>, <strong>wegen des Verpackungsmülls</strong>. Der Genitiv macht deine Meinung schriftlich und mündlich präziser.</p>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Lernziele</h2>
        <ul style={listStyle}>
          <li>Genitivformen mit der/des und Adjektiven erkennen und bilden.</li>
          <li>Gründe mit <strong>wegen + Genitiv</strong> und Gegensätze mit <strong>trotz + Genitiv</strong> ausdrücken.</li>
          <li>Über Zutaten, Zuckeranteil, Zusatzstoffe und Essgewohnheiten genauer sprechen.</li>
          <li>Eine kurze B1-Meinung mit passenden Redemitteln schreiben.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>1. Der Genitiv: einfache Regel</h2>
        <div style={box}>
          <strong>Struktur:</strong> Nomen + Genitiv<br />
          die Nachteile <strong>des Fast Foods</strong> · die Vorteile <strong>der Hausmannskost</strong> · der Geschmack <strong>eines frischen Eintopfs</strong>
        </div>
        <ul style={listStyle}>
          <li>Maskulin/Neutrum Singular: <strong>des/eines</strong> + oft <strong>-s</strong> am Nomen: der Anteil <strong>des Zuckers</strong>.</li>
          <li>Feminin Singular: <strong>der/einer</strong>, kein -s: die Qualität <strong>der Ernährung</strong>.</li>
          <li>Plural: <strong>der</strong>, kein -s: die Zutaten <strong>der Fertiggerichte</strong>.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>2. Wegen und trotz + Genitiv</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
          <div style={box}><strong>wegen + Genitiv = Grund</strong><br />Wegen <strong>des hohen Fettanteils</strong> esse ich Fast Food selten.<br />Wegen <strong>der Zusatzstoffe</strong> kaufe ich nicht jedes Fertiggericht.</div>
          <div style={box}><strong>trotz + Genitiv = Gegengrund</strong><br />Trotz <strong>des Zeitaufwands</strong> koche ich oft selbst.<br />Trotz <strong>der großen Auswahl</strong> wähle ich nicht immer Fast Food.</div>
        </div>
        <NoteBox tone="amber"><strong>Wortstellung:</strong> Wenn die Gruppe am Anfang steht, kommt das Verb auf Position 2: <em>Wegen des Zuckers esse ich weniger Süßigkeiten.</em></NoteBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>3. Richtig oder falsch?</h2>
        <NoteBox tone="green">✅ Richtig: <strong>Wegen des hohen Zuckeranteils</strong> sind viele Softdrinks ungesund.</NoteBox>
        <NoteBox tone="red">❌ Falsch: Wegen <strong>der hohe Zuckeranteil</strong> sind viele Softdrinks ungesund.</NoteBox>
        <NoteBox tone="green">✅ Richtig: Ich achte auf <strong>die Qualität der Zutaten</strong>.</NoteBox>
        <NoteBox tone="red">❌ Falsch: Ich achte auf <strong>die Qualität die Zutaten</strong>.</NoteBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Typische B1-Fehler</h2>
        <ul style={listStyle}>
          <li>Nach <strong>wegen</strong> den Nominativ benutzen: „wegen der Zucker“ → besser: „wegen <strong>des Zuckers</strong>“.</li>
          <li>Das -s bei maskulin/neutrum vergessen: „des Getränk“ → „des Getränk<strong>s</strong>“.</li>
          <li>Zu viele Sätze mit „weil“ beginnen. Variiere mit „wegen“: „Wegen der frischen Zutaten ...“</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Redemittel für Sprechen und Schreiben</h2>
        <ul style={listStyle}>
          <li>Meiner Meinung nach ist Hausmannskost gesünder, weil ...</li>
          <li>Wegen des hohen Fett- und Zuckeranteils sollte man Fast Food nur selten essen.</li>
          <li>Trotz des Zeitaufwands lohnt sich frisches Kochen.</li>
          <li>Ein Vorteil der Fertiggerichte ist die schnelle Zubereitung.</li>
          <li>Ein Nachteil der Verpackungen ist der viele Plastikmüll.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Mini-Übung: Ergänzen Sie die Form</h2>
        <ol style={listStyle}>
          <li>Wegen ___ hohen Zuckeranteils trinke ich weniger Cola. (der)</li>
          <li>Trotz ___ großen Auswahl koche ich lieber selbst. (die)</li>
          <li>Die Vorteile ___ Hausmannskost sind frische Zutaten und Tradition. (die)</li>
          <li>Der Geschmack ___ frischen Essens ist für mich wichtig. (das)</li>
        </ol>
        <NoteBox tone="blue"><strong>Selbstcheck:</strong> Kannst du deine Meinung mit mindestens einem Satz mit <em>wegen</em> und einem Satz mit <em>trotz</em> formulieren?</NoteBox>
      </section>
    </div>
  );
}
