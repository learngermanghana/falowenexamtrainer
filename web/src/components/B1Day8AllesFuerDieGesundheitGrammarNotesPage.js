import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const heroImage =
  "https://images.unsplash.com/photo-1494390248081-4e521a5940db?auto=format&fit=crop&w=1600&q=80";

const card = {
  ...styles.card,
  display: "grid",
  gap: 16,
  border: "1px solid #dbeafe",
  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
};

const list = {
  margin: 0,
  paddingLeft: 22,
  lineHeight: 1.8,
};

const exampleBox = {
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 14,
  lineHeight: 1.75,
  background: "#fff",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 12,
};

const Note = ({ children, tone = "blue" }) => {
  const colors = {
    blue: ["#bfdbfe", "#eff6ff", "#1e3a8a"],
    green: ["#bbf7d0", "#f0fdf4", "#166534"],
    amber: ["#fde68a", "#fffbeb", "#92400e"],
    red: ["#fecaca", "#fef2f2", "#991b1b"],
  }[tone];

  return (
    <div
      style={{
        border: `1px solid ${colors[0]}`,
        background: colors[1],
        color: colors[2],
        borderRadius: 14,
        padding: 14,
        lineHeight: 1.7,
      }}
    >
      {children}
    </div>
  );
};

const RuleCard = ({ title, meaning, example, note }) => (
  <div style={exampleBox}>
    <h3 style={{ margin: "0 0 6px", fontSize: 18 }}>{title}</h3>
    <p style={{ margin: "0 0 8px", color: "#475569" }}>{meaning}</p>
    <p style={{ margin: 0 }}>
      <strong>Beispiel:</strong> {example}
    </p>
    {note ? <p style={{ ...styles.helperText, margin: "8px 0 0" }}>{note}</p> : null}
  </div>
);

export default function B1Day8AllesFuerDieGesundheitGrammarNotesPage() {
  return (
    <div style={{ ...styles.container, display: "grid", gap: 18 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

      <header
        style={{
          ...styles.card,
          position: "relative",
          overflow: "hidden",
          minHeight: 330,
          display: "grid",
          alignContent: "end",
          gap: 12,
          color: "#ffffff",
          border: "none",
          backgroundImage: `linear-gradient(135deg, rgba(15,23,42,0.82), rgba(29,78,216,0.58)), url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow: "0 24px 55px rgba(37, 99, 235, 0.24)",
        }}
      >
        <span
          style={{
            ...styles.badge,
            width: "fit-content",
            background: "rgba(255,255,255,0.92)",
            color: "#1e3a8a",
          }}
        >
          B1 · Day 8 · Kapitel 3.8 · Grammar Notes
        </span>
        <h1 style={{ margin: 0, fontSize: "clamp(2rem, 5vw, 3.4rem)", letterSpacing: -0.8 }}>
          Alles für die Gesundheit
        </h1>
        <p style={{ margin: 0, maxWidth: 760, fontSize: "1.05rem", lineHeight: 1.75, color: "#dbeafe" }}>
          Grammatikfokus: Modalverben für Empfehlungen, Möglichkeiten, Pflichten und gesunde Grenzen.
        </p>
      </header>

      <section style={{ ...card, background: "linear-gradient(135deg, #eff6ff, #ffffff)" }}>
        <h2 style={{ margin: 0 }}>Worum geht es?</h2>
        <p style={{ margin: 0, lineHeight: 1.8 }}>
          Beim Thema Gesundheit sprechen wir oft über Ratschläge, Regeln und persönliche Ziele. Dafür brauchst du
          Modalverben wie <strong>sollte</strong>, <strong>muss</strong>, <strong>kann</strong>, <strong>darf</strong> und <strong>möchte</strong>.
          Sie helfen dir, höflich und klar auf B1-Niveau zu sprechen und zu schreiben.
        </p>
        <Note>
          <strong>Merksatz:</strong> Das Modalverb steht im Hauptsatz auf Position 2. Das zweite Verb steht im Infinitiv am Ende.
        </Note>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>Lernziele</h2>
        <div style={grid}>
          <Note tone="green">Ratschläge mit <strong>sollte/sollten</strong> geben.</Note>
          <Note tone="blue">Notwendigkeit mit <strong>müssen</strong> ausdrücken.</Note>
          <Note tone="amber">Möglichkeit mit <strong>können</strong> erklären.</Note>
          <Note tone="green">Über Ernährung, Sport, Stress und Vorsorge sprechen.</Note>
        </div>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>1. Satzbau mit Modalverben</h2>
        <div style={grid}>
          <div style={exampleBox}>
            <h3 style={{ margin: "0 0 8px" }}>Hauptsatz</h3>
            <p style={{ margin: 0, lineHeight: 1.75 }}>
              <strong>Subjekt + Modalverb + Ergänzung + Infinitiv</strong>
              <br />
              Man <strong>sollte</strong> täglich genug Wasser <strong>trinken</strong>.
              <br />
              Ich <strong>möchte</strong> weniger Zucker <strong>essen</strong>.
            </p>
          </div>
          <div style={exampleBox}>
            <h3 style={{ margin: "0 0 8px" }}>Nebensatz mit weil/dass</h3>
            <p style={{ margin: 0, lineHeight: 1.75 }}>
              Im Nebensatz steht das konjugierte Modalverb am Ende.
              <br />
              Ich glaube, dass man regelmäßig Sport <strong>machen sollte</strong>.
              <br />
              Stress ist gefährlich, weil er den Schlaf <strong>stören kann</strong>.
            </p>
          </div>
        </div>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>2. Bedeutung der Modalverben</h2>
        <div style={grid}>
          <RuleCard
            title="sollte"
            meaning="Empfehlung oder guter Rat"
            example="Man sollte mehr Obst und Gemüse essen."
            note="Nicht zu stark. Gut für höfliche Tipps."
          />
          <RuleCard
            title="muss"
            meaning="Notwendigkeit oder Pflicht"
            example="Bei starken Schmerzen muss man zum Arzt gehen."
            note="Stärker als sollte. Nutze es nur, wenn es wirklich nötig ist."
          />
          <RuleCard
            title="kann"
            meaning="Möglichkeit oder Fähigkeit"
            example="Yoga kann beim Stressabbau helfen."
            note="Gut für mögliche Lösungen."
          />
          <RuleCard
            title="darf"
            meaning="Erlaubnis oder Grenze"
            example="Man darf auch Pausen machen."
            note="Gut, wenn du über gesunde Grenzen sprichst."
          />
        </div>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>3. Richtig oder falsch?</h2>
        <div style={{ display: "grid", gap: 10 }}>
          <Note tone="green">✅ Richtig: Man <strong>sollte</strong> mindestens 1,5 Liter Wasser pro Tag <strong>trinken</strong>.</Note>
          <Note tone="red">❌ Falsch: Man <strong>sollte trinkt</strong> mindestens 1,5 Liter Wasser pro Tag.</Note>
          <Note tone="green">✅ Richtig: Ich glaube, dass regelmäßige Arztbesuche wichtig <strong>sein können</strong>.</Note>
          <Note tone="red">❌ Falsch: Ich glaube, dass regelmäßige Arztbesuche <strong>können wichtig sein</strong>.</Note>
        </div>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>4. Typische B1-Fehler</h2>
        <ul style={list}>
          <li>
            Nach dem Modalverb ein konjugiertes Verb benutzen: <strong>man sollte isst</strong> → <strong>man sollte essen</strong>.
          </li>
          <li>
            Im Nebensatz das Modalverb nicht ans Ende stellen: <strong>weil man sollte schlafen</strong> → <strong>weil man schlafen sollte</strong>.
          </li>
          <li>
            Zu stark formulieren: Statt <strong>alle müssen jeden Tag Sport machen</strong> besser: <strong>man sollte sich regelmäßig bewegen</strong>.
          </li>
          <li>
            Modalverben ohne konkreten Inhalt verwenden. Ergänze Beispiele: Wasser trinken, Zucker reduzieren, zum Zahnarzt gehen.
          </li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>5. Redemittel für Sprechen und Schreiben</h2>
        <div style={grid}>
          <div style={exampleBox}>Ich glaube, dass gesunde Ernährung eine große Rolle spielt, weil ...</div>
          <div style={exampleBox}>Meiner Meinung nach sollte man darauf achten, dass ...</div>
          <div style={exampleBox}>Ein gesundes Leben bedeutet für mich, dass man ...</div>
          <div style={exampleBox}>Man kann Stress reduzieren, indem man ...</div>
          <div style={exampleBox}>In Zukunft möchte ich ... verbessern.</div>
          <div style={exampleBox}>Wenn man krank ist, sollte man ...</div>
        </div>
      </section>

      <section style={{ ...card, background: "#f8fafc" }}>
        <h2 style={{ margin: 0 }}>Mini-Übung: Ergänze das passende Modalverb</h2>
        <ol style={list}>
          <li>Man ___ weniger Zucker essen. <em>(Empfehlung)</em></li>
          <li>Bei Beschwerden ___ man den Hausarzt anrufen. <em>(Notwendigkeit)</em></li>
          <li>Schwimmen ___ die Gelenke schonen. <em>(Möglichkeit)</em></li>
          <li>Ich glaube, dass man genug schlafen ___. <em>(Empfehlung im Nebensatz)</em></li>
        </ol>
        <Note tone="amber">
          <strong>Selbstcheck:</strong> Formuliere drei persönliche Gesundheitstipps mit <em>sollte</em>, <em>kann</em> und <em>möchte</em>.
        </Note>
      </section>
    </div>
  );
}
