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
const listStyle = { margin: 0, paddingLeft: 20, display: "grid", gap: 6 };
const noteStyle = {
  borderRadius: 12,
  padding: 12,
  background: "rgba(59,130,246,0.1)",
  border: "1px solid rgba(59,130,246,0.35)",
};

const SectionCard = ({ title, children }) => (
  <section style={cardStyle} aria-label={title}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const A2Day21EinWochenendePlanenWennObFallsGrammarPage = () => {
  const navigate = useNavigate();
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        <button type="button" onClick={() => navigate(-1)} style={styles.backBtn} aria-label="Go back">
          ← Back
        </button>

        <header style={{ ...styles.card, display: "grid", gap: 10, marginBottom: 18 }}>
          <h1 style={{ margin: 0 }}>A2 • Day 21 (8.21) Ein Wochenende planen</h1>
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80"
            alt="Friends planning a weekend trip together"
            style={heroImageStyle}
            loading="lazy"
          />
          <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.72 }}>Header image source: Unsplash</p>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Grammar focus: <strong>wenn, ob, falls</strong>
          </p>
        </header>

        <div style={{ display: "grid", gap: 14 }}>
          <SectionCard title="1) Quick meaning in English">
            <ul style={listStyle}>
              <li>
                <strong>wenn</strong> = <strong>if</strong> (condition) or <strong>when</strong> (repeated time)
              </li>
              <li>
                <strong>ob</strong> = <strong>whether / if</strong> (indirect yes-no question)
              </li>
              <li>
                <strong>falls</strong> = <strong>if</strong> (more formal, often less likely/just in case)
              </li>
            </ul>
            <div style={noteStyle}>
              <strong>Important:</strong> In subordinate clauses with <strong>wenn</strong>, <strong>ob</strong>, and
              <strong> falls</strong>, the conjugated verb goes to the end.
              <ul style={listStyle}>
                <li>Wenn das Wetter gut <strong>ist</strong>, machen wir ein Picknick.</li>
                <li>Ich weiß nicht, ob Paul morgen <strong>kommt</strong>.</li>
                <li>Falls es regnet, <strong>bleiben</strong> wir zu Hause.</li>
              </ul>
            </div>
          </SectionCard>

          <SectionCard title="2) Using wenn">
            <p style={{ margin: 0 }}>
              Use <strong>wenn</strong> for a real condition and for repeated situations in time.
            </p>
            <ul style={listStyle}>
              <li>Wenn wir Zeit haben, besuchen wir das Museum. (if-condition)</li>
              <li>Wenn ich frei habe, schlafe ich länger. (whenever / repeated time)</li>
              <li>Wenn du am Samstag kommst, kochen wir zusammen.</li>
            </ul>
          </SectionCard>

          <SectionCard title="3) Using ob">
            <p style={{ margin: 0 }}>
              Use <strong>ob</strong> after verbs like <em>wissen</em>, <em>fragen</em>, <em>sehen</em>, <em>nicht sicher
              sein</em> when the sentence means <strong>whether</strong>.
            </p>
            <ul style={listStyle}>
              <li>Ich weiß nicht, ob das Café am Sonntag offen ist.</li>
              <li>Kannst du fragen, ob wir einen Tisch reservieren müssen?</li>
              <li>Wir prüfen, ob der Zug pünktlich ist.</li>
            </ul>
          </SectionCard>

          <SectionCard title="4) Using falls">
            <p style={{ margin: 0 }}>
              Use <strong>falls</strong> for a condition too, often like “in case” or when something is less certain.
            </p>
            <ul style={listStyle}>
              <li>Falls es morgen schneit, fahren wir nicht mit dem Fahrrad.</li>
              <li>Nimm einen Pullover mit, falls es abends kalt wird.</li>
              <li>Falls wir zu spät sind, schreiben wir dir eine Nachricht.</li>
            </ul>
          </SectionCard>

          <SectionCard title="5) wenn vs ob vs falls (comparison)">
            <ul style={listStyle}>
              <li>
                <strong>wenn:</strong> condition or repeated time → <em>Wenn es warm ist, grillen wir.</em>
              </li>
              <li>
                <strong>ob:</strong> whether-question inside a sentence → <em>Ich weiß nicht, ob wir grillen.</em>
              </li>
              <li>
                <strong>falls:</strong> in case / less certain condition → <em>Falls es regnet, grillen wir nicht.</em>
              </li>
            </ul>
          </SectionCard>

          <SectionCard title="6) Knowledge check">
            <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8 }}>
              <li>Ich weiß nicht, ___ wir am Samstag arbeiten. (wenn / ob / falls)</li>
              <li>___ ich frei habe, gehe ich oft joggen. (Wenn / Ob / Falls)</li>
              <li>Nimm einen Regenschirm mit, ___ es regnet. (wenn / ob / falls)</li>
              <li>Kannst du prüfen, ___ das Kino geöffnet ist? (wenn / ob / falls)</li>
              <li>___ wir genug Geld haben, fahren wir am Wochenende nach Berlin. (Wenn / Ob / Falls)</li>
            </ol>

            <button type="button" onClick={() => setShowAnswers((prev) => !prev)} style={styles.secondaryBtn}>
              {showAnswers ? "Hide answers" : "Show answers"}
            </button>

            {showAnswers ? (
              <div style={{ border: "1px solid rgba(148,163,184,0.35)", borderRadius: 10, padding: 12 }}>
                <strong>Answers:</strong>
                <ol style={{ margin: "8px 0 0", paddingLeft: 18, display: "grid", gap: 6 }}>
                  <li>ob</li>
                  <li>Wenn</li>
                  <li>falls</li>
                  <li>ob</li>
                  <li>Wenn</li>
                </ol>
              </div>
            ) : null}
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default A2Day21EinWochenendePlanenWennObFallsGrammarPage;
