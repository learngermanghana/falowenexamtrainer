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

const A2Day23WieKommstDuZurSchuleOderZurArbeitGrammarPage = () => {
  const navigate = useNavigate();
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        <button type="button" onClick={() => navigate(-1)} style={styles.backBtn} aria-label="Go back">
          ← Back
        </button>

        <header style={{ ...styles.card, display: "grid", gap: 10, marginBottom: 18 }}>
          <h1 style={{ margin: 0 }}>A2 • Day 23 (9.23) Wie kommst du zur Schule / zur Arbeit?</h1>
          <img
            src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1400&q=80"
            alt="People commuting in a city with different means of transport"
            style={heroImageStyle}
            loading="lazy"
          />
          <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.72 }}>Header image source: Unsplash</p>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Grammar focus: <strong>Präpositionen mit Verkehrsmitteln</strong>
          </p>
        </header>

        <div style={{ display: "grid", gap: 14 }}>
          <SectionCard title="1) Core idea in English">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              To talk about transportation in German, we often use <strong>mit + dative</strong> (with/by) and
              movement prepositions such as <strong>zu</strong> (to), <strong>in</strong> (into/by car/taxi), and
              <strong> zu Fuß</strong> (on foot).
            </p>
            <div style={noteStyle}>
              <strong>Quick rule:</strong>
              <ul style={listStyle}>
                <li>
                  Use <strong>mit</strong> for most transport methods: <em>mit dem Bus</em>, <em>mit der Bahn</em>,
                  <em> mit dem Fahrrad</em>.
                </li>
                <li>
                  Use <strong>zu Fuß</strong> for walking (not <em>mit Fuß</em>).
                </li>
                <li>
                  Use <strong>in + dative</strong> with some vehicles (especially car/taxi): <em>im Auto</em>,
                  <em> im Taxi</em>.
                </li>
              </ul>
            </div>
          </SectionCard>

          <SectionCard title="2) mit + Dativ (most common pattern)">
            <ul style={listStyle}>
              <li>Ich komme jeden Tag <strong>mit dem Bus</strong> zur Schule.</li>
              <li>Er fährt <strong>mit der U-Bahn</strong> zur Arbeit.</li>
              <li>Wir fahren heute <strong>mit dem Zug</strong> nach Köln.</li>
              <li>Fährst du <strong>mit dem Fahrrad</strong> oder <strong>mit dem Auto</strong>?</li>
            </ul>
          </SectionCard>

          <SectionCard title="3) zu Fuß / im Auto / im Taxi">
            <p style={{ margin: 0 }}>Some very frequent fixed phrases:</p>
            <ul style={listStyle}>
              <li>Sie geht <strong>zu Fuß</strong> zur Uni.</li>
              <li>Ich fahre meistens <strong>im Auto</strong> zur Arbeit.</li>
              <li>Nach der Party fahren wir <strong>im Taxi</strong> nach Hause.</li>
            </ul>
          </SectionCard>

          <SectionCard title="4) Talking about route and destination">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Combine transport with destination prepositions and time expressions.
            </p>
            <ul style={listStyle}>
              <li>Ich fahre morgens mit dem Bus <strong>zur Schule</strong>.</li>
              <li>Meine Mutter fährt um 7 Uhr mit der Bahn <strong>zur Arbeit</strong>.</li>
              <li>Wir gehen erst zu Fuß zur Haltestelle und fahren dann mit der Tram weiter.</li>
              <li>Am Wochenende fahren wir mit dem Zug <strong>in die Stadt</strong>.</li>
            </ul>
          </SectionCard>

          <SectionCard title="5) Knowledge test">
            <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8 }}>
              <li>Ich fahre ___ Bus zur Schule. (mit dem / im / zu)</li>
              <li>Sie geht ___ zur Arbeit. (zu Fuß / mit Fuß / im Fuß)</li>
              <li>Wir fahren ___ Taxi nach Hause. (im / mit der / in den)</li>
              <li>Er kommt jeden Tag ___ U-Bahn. (mit der / im / zu der)</li>
              <li>Ich fahre morgens mit dem Fahrrad ___ Arbeit. (zur / im / in der)</li>
            </ol>

            <button type="button" onClick={() => setShowAnswers((prev) => !prev)} style={styles.secondaryBtn}>
              {showAnswers ? "Hide answers" : "Show answers"}
            </button>

            {showAnswers ? (
              <div style={{ border: "1px solid rgba(148,163,184,0.35)", borderRadius: 10, padding: 12 }}>
                <strong>Answers:</strong>
                <ol style={{ margin: "8px 0 0", paddingLeft: 18, display: "grid", gap: 6 }}>
                  <li>mit dem</li>
                  <li>zu Fuß</li>
                  <li>im</li>
                  <li>mit der</li>
                  <li>zur</li>
                </ol>
              </div>
            ) : null}
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default A2Day23WieKommstDuZurSchuleOderZurArbeitGrammarPage;
