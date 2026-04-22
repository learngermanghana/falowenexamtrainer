import React from "react";

const cardStyle = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 20,
  boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
};

const A2Day22DieWochePlanungGrammarPage = () => {
  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "24px 16px 64px", color: "#0f172a" }}>
      <header style={{ marginBottom: 18 }}>
        <h1 style={{ marginBottom: 8 }}>A2 · Day 22 Grammar Notes · Die Woche Planung (8.22)</h1>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Fokus: <strong>Präsens für die Zukunft</strong>, <strong>Zeitangaben</strong> und <strong>Modalverben für
          Verfügbarkeit</strong>.
        </p>
      </header>

      <section style={{ ...cardStyle, marginBottom: 16 }}>
        <h2 style={{ marginTop: 0 }}>1) Präsens für die Zukunft</h2>
        <p style={{ lineHeight: 1.7 }}>
          Im Deutschen benutzt man sehr oft das <strong>Präsens</strong>, wenn man über die Zukunft spricht. Das geht
          besonders gut mit einem klaren Zeitwort.
        </p>
        <ul style={{ lineHeight: 1.8, marginBottom: 0 }}>
          <li>Ich <strong>arbeite</strong> morgen im Homeoffice.</li>
          <li>Wir <strong>treffen</strong> uns am Freitagabend.</li>
          <li>Sie <strong>kommt</strong> nächste Woche nicht in den Kurs.</li>
        </ul>
      </section>

      <section style={{ ...cardStyle, marginBottom: 16 }}>
        <h2 style={{ marginTop: 0 }}>2) Time phrases (Zeitangaben)</h2>
        <p style={{ lineHeight: 1.7 }}>Mit Zeitangaben wird klar, wann etwas passiert.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
          {[
            "heute",
            "morgen",
            "übermorgen",
            "am Montag",
            "am Wochenende",
            "nächste Woche",
            "in zwei Tagen",
            "später",
          ].map((phrase) => (
            <div key={phrase} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 12px" }}>
              {phrase}
            </div>
          ))}
        </div>
        <p style={{ marginTop: 12, marginBottom: 0, lineHeight: 1.7 }}>
          Beispiel: <strong>Am Wochenende</strong> besuche ich meine Freunde und <strong>nächste Woche</strong> lerne
          ich für die Prüfung.
        </p>
      </section>

      <section style={{ ...cardStyle, marginBottom: 16 }}>
        <h2 style={{ marginTop: 0 }}>3) Modal verbs for availability</h2>
        <p style={{ lineHeight: 1.7 }}>
          Modalverben helfen dir zu sagen, ob du Zeit hast oder nicht.
        </p>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <strong>können</strong>: Ich <strong>kann</strong> am Mittwoch lernen.
          </li>
          <li>
            <strong>müssen</strong>: Ich <strong>muss</strong> am Donnerstag arbeiten.
          </li>
          <li>
            <strong>wollen</strong>: Wir <strong>wollen</strong> uns am Samstag treffen.
          </li>
        </ul>
        <p style={{ marginBottom: 0, lineHeight: 1.7 }}>
          Kurzantworten: <strong>Ich kann.</strong> / <strong>Ich kann leider nicht.</strong> / <strong>Ich muss
          erst arbeiten.</strong>
        </p>
      </section>

      <section style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Knowledge (after the notes)</h2>
        <ol style={{ lineHeight: 1.8, marginBottom: 0 }}>
          <li>Für Zukunft ist Präsens + Zeitangabe im Alltag am natürlichsten.</li>
          <li>Setze Zeitangaben oft an Position 1: „Morgen arbeite ich länger.“</li>
          <li>Bei Modalverben steht das zweite Verb am Ende: „Ich kann morgen kommen.“</li>
          <li>Für Planungssprache sind „können“, „müssen“ und „wollen“ besonders wichtig.</li>
        </ol>
      </section>
    </main>
  );
};

export default A2Day22DieWochePlanungGrammarPage;
