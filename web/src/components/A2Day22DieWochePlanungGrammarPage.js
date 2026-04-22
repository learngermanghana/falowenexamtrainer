import React from "react";

const cardStyle = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 20,
  boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
};
const heroImageStyle = {
  width: "100%",
  maxHeight: 300,
  objectFit: "cover",
  borderRadius: 12,
  border: "1px solid rgba(148,163,184,0.35)",
};

const A2Day22DieWochePlanungGrammarPage = () => {
  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "24px 16px 64px", color: "#0f172a" }}>
      <header style={{ ...cardStyle, marginBottom: 18, display: "grid", gap: 10 }}>
        <h1 style={{ marginBottom: 8 }}>A2 · Day 22 Grammar Notes · Die Woche Planung (8.22)</h1>
        <img
          src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1400&q=80"
          alt="Weekly planner and calendar used for schedule planning"
          style={heroImageStyle}
          loading="lazy"
        />
        <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.72 }}>Header image source: Unsplash</p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Focus: <strong>present tense for future meaning</strong>, <strong>time phrases</strong>, and{" "}
          <strong>modal verbs for availability</strong>.
        </p>
      </header>

      <section style={{ ...cardStyle, marginBottom: 16 }}>
        <h2 style={{ marginTop: 0 }}>1) Present tense for future meaning</h2>
        <p style={{ lineHeight: 1.7 }}>
          In German, you often use the <strong>present tense</strong> to talk about future plans. This sounds natural
          when a clear time phrase is included.
        </p>
        <ul style={{ lineHeight: 1.8, marginBottom: 0 }}>
          <li>Ich <strong>arbeite</strong> morgen im Homeoffice.</li>
          <li>Wir <strong>treffen</strong> uns am Freitagabend.</li>
          <li>Sie <strong>kommt</strong> nächste Woche nicht in den Kurs.</li>
        </ul>
      </section>

      <section style={{ ...cardStyle, marginBottom: 16 }}>
        <h2 style={{ marginTop: 0 }}>2) Time phrases (Zeitangaben)</h2>
        <p style={{ lineHeight: 1.7 }}>
          Time phrases make the schedule precise. They answer <em>when</em> something happens and help avoid
          confusion.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
          {[
            "heute",
            "morgen",
            "übermorgen",
            "nächsten Montag",
            "am Montag",
            "am Dienstagabend",
            "am Wochenende",
            "nächste Woche",
            "in einer Stunde",
            "in zwei Tagen",
            "später",
          ].map((phrase) => (
            <div key={phrase} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 12px" }}>
              {phrase}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            More examples in German:
          </p>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
            <li>
              <strong>Heute</strong> lerne ich nur 30 Minuten.
            </li>
            <li>
              <strong>Morgen früh</strong> fahre ich ins Büro.
            </li>
            <li>
              <strong>Übermorgen</strong> treffen wir unsere Lehrerin online.
            </li>
            <li>
              <strong>Am Dienstagabend</strong> macht er einen Deutschkurs.
            </li>
            <li>
              <strong>Nächste Woche</strong> schreiben wir einen kleinen Test.
            </li>
            <li>
              <strong>In zwei Tagen</strong> kann ich dir Bescheid geben.
            </li>
          </ul>
        </div>
      </section>

      <section style={{ ...cardStyle, marginBottom: 16 }}>
        <h2 style={{ marginTop: 0 }}>3) Modal verbs for availability</h2>
        <p style={{ lineHeight: 1.7 }}>
          Modal verbs help you say whether you are available, busy, or making a plan.
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
          <li>For future plans, present tense + a time phrase is usually the most natural choice.</li>
          <li>Time phrases are often in position 1: „Morgen arbeite ich länger.“</li>
          <li>With modal verbs, the second verb goes to the end: „Ich kann morgen kommen.“</li>
          <li>For planning language, „können“, „müssen“, and „wollen“ are especially useful.</li>
        </ol>
      </section>
    </main>
  );
};

export default A2Day22DieWochePlanungGrammarPage;
