import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
const connectorGridStyle = {
  display: "grid",
  gap: 10,
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
};
const connectorCardStyle = {
  border: "1px solid rgba(59,130,246,0.35)",
  borderRadius: 10,
  padding: 10,
  background: "rgba(59,130,246,0.08)",
};

const A2Day28UeberDieZukunftSprechenGrammarPage = () => {
  const navigate = useNavigate();
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <main style={styles.pageWrap}>
      <div style={{ ...styles.container, display: "grid", gap: 16 }}>
        <button type="button" onClick={() => navigate(-1)} style={styles.backBtn} aria-label="Go back">
          ← Back
        </button>

        <header style={cardStyle}>
          <h1 style={{ margin: 0 }}>A2 · Day 28 Grammar Notes · Über die Zukunft sprechen (10.28)</h1>
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80"
            alt="Students planning future goals on a desk with notebook and laptop"
            style={heroImageStyle}
            loading="lazy"
          />
          <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.72 }}>Header image source: Unsplash</p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            This is your <strong>final A2 grammar note</strong>. Today you focus on clear future communication and strong connectors.
            At B1 level, these connectors are expected in speaking and writing tasks with reasons and logical flow.
          </p>
        </header>

        <section style={cardStyle}>
          <h2 style={{ margin: 0 }}>1) Core connector set: trotzdem, darum, daher, deshalb, deswegen</h2>
          <div style={connectorGridStyle}>
            <div style={connectorCardStyle}>
              <strong>trotzdem</strong>
              <p style={{ margin: "6px 0 0" }}><em>= nevertheless / even so (contrast)</em></p>
              <p style={{ margin: "6px 0 0" }}>Es regnet. <strong>Trotzdem</strong> gehen wir spazieren.</p>
            </div>
            <div style={connectorCardStyle}>
              <strong>darum / daher / deshalb / deswegen</strong>
              <p style={{ margin: "6px 0 0" }}><em>= therefore / for that reason (result)</em></p>
              <p style={{ margin: "6px 0 0" }}>Ich habe morgen eine Prüfung, <strong>deshalb</strong> lerne ich heute länger.</p>
            </div>
          </div>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Important word order: when these connectors are at position 1, the verb comes immediately after.
            Example: <em>Ich bin müde. Deshalb <strong>gehe</strong> ich früh ins Bett.</em>
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={{ margin: 0 }}>2) Other high-value A2 conjunctions you must know</h2>
          <ul style={listStyle}>
            <li><strong>weil</strong> (reason, verb at end): <em>Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte.</em></li>
            <li><strong>dass</strong> (reported thought, verb at end): <em>Ich denke, dass ich nächstes Jahr umziehe.</em></li>
            <li><strong>wenn</strong> (condition/time): <em>Wenn ich Zeit habe, übe ich jeden Abend.</em></li>
            <li><strong>falls</strong> (possible condition, formal): <em>Falls es Probleme gibt, rufe ich dich an.</em></li>
            <li><strong>obwohl</strong> (contrast, verb at end): <em>Obwohl ich müde bin, arbeite ich weiter.</em></li>
            <li><strong>und / aber / oder / denn</strong> (basic connectors, normal main-clause order).</li>
          </ul>
        </section>

        <section style={cardStyle}>
          <h2 style={{ margin: 0 }}>3) A2 → B1 progress plan (what to do next)</h2>
          <ul style={listStyle}>
            <li>Build 8-10 sentence answers instead of 3-4 sentence answers.</li>
            <li>Use at least 3 connectors in one response (reason, contrast, result).</li>
            <li>Train verb-final accuracy in subordinate clauses every day.</li>
            <li>Start giving short opinions with support: <em>Ich finde ..., weil ..., deshalb ...</em></li>
            <li>For B1 writing: practice one short text per week (email, opinion text, complaint, plan).</li>
          </ul>
        </section>

        <section style={cardStyle}>
          <h2 style={{ margin: 0 }}>4) Knowledge test (self-check)</h2>
          <ol style={listStyle}>
            <li>Complete: <em>Ich habe wenig Zeit, ______ lerne ich jeden Morgen 20 Minuten.</em></li>
            <li>Choose the best connector: <em>Es ist spät. ______ machen wir noch die Hausaufgaben.</em> (trotzdem / deshalb)</li>
            <li>Complete with correct order: <em>Ich bleibe zu Hause, weil ich morgen früh ______.</em> (aufstehen muss)</li>
            <li>Complete: <em>______ ich nervös bin, spreche ich im Unterricht.</em> (Obwohl / Deshalb)</li>
            <li>Make one sentence with <em>darum</em> about your future plan.</li>
          </ol>

          <button type="button" onClick={() => setShowAnswers((prev) => !prev)} style={styles.secondaryBtn}>
            {showAnswers ? "Hide sample answers" : "Show sample answers"}
          </button>

          {showAnswers ? (
            <div style={{ border: "1px solid rgba(148,163,184,0.35)", borderRadius: 10, padding: 12 }}>
              <strong>Sample answers:</strong>
              <ol style={{ margin: "8px 0 0", paddingLeft: 18, display: "grid", gap: 6 }}>
                <li>deshalb / deswegen / darum / daher</li>
                <li>trotzdem</li>
                <li>aufstehen muss</li>
                <li>Obwohl</li>
                <li>Example: Ich will an der Uni studieren, darum lerne ich jeden Tag Deutsch.</li>
              </ol>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
};

export default A2Day28UeberDieZukunftSprechenGrammarPage;
