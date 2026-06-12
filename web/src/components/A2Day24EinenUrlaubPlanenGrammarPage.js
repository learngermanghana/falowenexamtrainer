import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";

const cardStyle = { ...styles.card, display: "grid", gap: 12 };
const heroImageStyle = {
  width: "100%",
  maxHeight: 280,
  objectFit: "cover",
  borderRadius: 12,
  border: "1px solid rgba(148,163,184,0.35)",
};
const listStyle = { margin: 0, paddingLeft: 20, lineHeight: 1.8 };
const highlightStyle = {
  borderRadius: 12,
  padding: 12,
  background: "rgba(245, 158, 11, 0.14)",
  border: "1px solid rgba(245, 158, 11, 0.45)",
};

const A2Day24EinenUrlaubPlanenGrammarPage = () => {
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <main style={styles.pageWrap}>
      <div style={{ ...styles.container, display: "grid", gap: 16 }}>
        <AppBackButton label="Back" fallbackPath="/campus/course" />

        <header style={cardStyle}>
          <h1 style={{ margin: 0 }}>A2 · Day 24 Grammar Notes · Einen Urlaub planen (9.24)</h1>
          <img
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80"
            alt="Travel planning notes, map, and camera for vacation preparation"
            style={heroImageStyle}
            loading="lazy"
          />
          <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.72 }}>Header image source: Unsplash</p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            This is your <strong>last A2 grammar note before B1</strong>. Focus on clear communication for travel plans,
            because B1 expects you to explain plans, reasons, and alternatives confidently.
          </p>
        </header>

        <section style={cardStyle}>
          <h2 style={{ margin: 0 }}>1) Core language for planning a trip</h2>
          <ul style={listStyle}>
            <li>
              <strong>Destination + time:</strong> <em>Ich möchte im August nach Wien fahren.</em>
            </li>
            <li>
              <strong>Transport:</strong> <em>Wir fahren mit dem Zug / fliegen mit dem Flugzeug.</em>
            </li>
            <li>
              <strong>Accommodation:</strong> <em>Wir buchen ein Hotel / eine Ferienwohnung.</em>
            </li>
            <li>
              <strong>Activities:</strong> <em>Wir wollen Museen besuchen und lokale Spezialitäten probieren.</em>
            </li>
            <li>
              <strong>Budget:</strong> <em>Unser Budget liegt bei 900 Euro.</em>
            </li>
          </ul>
        </section>

        <section style={cardStyle}>
          <h2 style={{ margin: 0 }}>2) Most important A2 → B1 grammar to keep</h2>
          <div style={highlightStyle}>
            <strong>Must-know rule:</strong> In connected speech, use a main clause + connector + verb-at-the-end
            subordinate clause.
            <ul style={listStyle}>
              <li>
                <strong>weil / dass / wenn:</strong> <em>Wir reisen im Juli, weil das Wetter gut ist.</em>
              </li>
              <li>
                <strong>um ... zu:</strong> <em>Wir sparen Geld, um länger zu reisen.</em>
              </li>
              <li>
                <strong>modal verb + infinitive:</strong> <em>Wir wollen ein günstiges Hotel finden.</em>
              </li>
            </ul>
          </div>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            If you control <strong>word order</strong> and can give <strong>reasons + goals</strong>, you are ready for
            stronger B1 speaking and writing tasks.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={{ margin: 0 }}>3) High-value sentence frames (exam-friendly)</h2>
          <ul style={listStyle}>
            <li>
              <em>Ich schlage vor, dass wir ...</em>
            </li>
            <li>
              <em>Was hältst du davon, wenn wir ...?</em>
            </li>
            <li>
              <em>Ich finde diese Option besser, weil ...</em>
            </li>
            <li>
              <em>Wir sollten früh buchen, um ... zu ...</em>
            </li>
            <li>
              <em>Falls das zu teuer ist, können wir ...</em>
            </li>
          </ul>
        </section>

        <section style={cardStyle}>
          <h2 style={{ margin: 0 }}>4) Final A2 checklist before B1</h2>
          <ul style={listStyle}>
            <li>I can describe a trip plan in 5-6 connected sentences.</li>
            <li>I can compare options (transport, hotel, cost) and justify my choice.</li>
            <li>I can use at least two connectors correctly with verb-final structure.</li>
            <li>I can make a polite suggestion and respond to a suggestion.</li>
          </ul>
        </section>

        <section style={cardStyle}>
          <h2 style={{ margin: 0 }}>5) Knowledge test</h2>
          <ol style={listStyle}>
            <li>
              Complete: <em>Wir bleiben im Hostel, ___ es günstig ist.</em> (weil / und / aber)
            </li>
            <li>
              Complete: <em>Ich spare Geld, ___ im Sommer nach Spanien zu reisen.</em> (um / weil / dass)
            </li>
            <li>
              Choose correct order: <em>Ich denke, dass wir morgen ___.</em> (abfahren / fahren ab / abgefahren)
            </li>
            <li>
              Complete: <em>___ das Hotel voll ist, buchen wir eine Ferienwohnung.</em> (Falls / Dass / Um)
            </li>
            <li>
              Complete: <em>Was hältst du davon, ___ wir mit dem Zug fahren?</em> (wenn / um / weil)
            </li>
          </ol>

          <button type="button" onClick={() => setShowAnswers((prev) => !prev)} style={styles.secondaryBtn}>
            {showAnswers ? "Hide answers" : "Show answers"}
          </button>

          {showAnswers ? (
            <div style={{ border: "1px solid rgba(148,163,184,0.35)", borderRadius: 10, padding: 12 }}>
              <strong>Answers:</strong>
              <ol style={{ margin: "8px 0 0", paddingLeft: 18, display: "grid", gap: 6 }}>
                <li>weil</li>
                <li>um</li>
                <li>abfahren</li>
                <li>Falls</li>
                <li>wenn</li>
              </ol>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
};

export default A2Day24EinenUrlaubPlanenGrammarPage;
