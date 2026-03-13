import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = { ...styles.card, display: "grid", gap: 10 };

const SectionCard = ({ title, children }) => (
  <section style={cardStyle}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const InlineCode = ({ children }) => (
  <span
    style={{
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      fontSize: "0.95em",
      padding: "2px 6px",
      borderRadius: 6,
      background: "rgba(0,0,0,0.06)",
    }}
  >
    {children}
  </span>
);

const A2Day8ImperativBefehlsformGrammarPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        <button type="button" onClick={() => navigate(-1)} style={styles.backBtn}>
          ← Back
        </button>

        <header style={{ marginBottom: 18 }}>
          <h1 style={{ margin: "0 0 8px" }}>A2 • 3.8 Rezepte und Essen</h1>
          <p style={{ margin: 0, opacity: 0.85 }}>
            Grammar focus: <strong>Imperativ (Befehlsform)</strong>
          </p>
        </header>

        <div style={{ display: "grid", gap: 14 }}>
          <SectionCard title="1) Was ist der Imperativ?">
            <p style={{ margin: 0 }}>
              Der Imperativ ist die Form für Anweisungen, Tipps und Rezepte. In Kochtexten nutzt man ihn sehr oft,
              z. B. <InlineCode>Schneide</InlineCode>, <InlineCode>Nimm</InlineCode>, <InlineCode>Rühre</InlineCode>.
            </p>
          </SectionCard>

          <SectionCard title="2) Formen im Überblick">
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>
                <strong>du:</strong> Stammform (oft ohne -st) → <InlineCode>Schneid(e) die Zwiebel!</InlineCode>
              </li>
              <li>
                <strong>ihr:</strong> Präsensform ohne <InlineCode>ihr</InlineCode> → <InlineCode>Schneidet die Tomaten!</InlineCode>
              </li>
              <li>
                <strong>Sie (formal):</strong> Verb + <InlineCode>Sie</InlineCode> → <InlineCode>Schneiden Sie die Tomaten!</InlineCode>
              </li>
            </ul>
          </SectionCard>

          <SectionCard title="3) Imperativ bei Rezepten (3.8)">
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>
                <InlineCode>Nimm</InlineCode> zwei Eier und Mehl.
              </li>
              <li>
                <InlineCode>Misch</InlineCode> alles gut.
              </li>
              <li>
                <InlineCode>Backe</InlineCode> den Kuchen 30 Minuten.
              </li>
              <li>
                <InlineCode>Servieren Sie</InlineCode> das Gericht warm.
              </li>
            </ul>
          </SectionCard>

          <SectionCard title="4) Häufige Fehler vermeiden">
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>Subjekt meistens weglassen: nicht „Du schneide", sondern „Schneide!"</li>
              <li>Bei formell immer <InlineCode>Sie</InlineCode> benutzen: <InlineCode>Nehmen Sie...</InlineCode></li>
              <li>Bei ihr-Form an <InlineCode>-t</InlineCode> denken: <InlineCode>Schneidet</InlineCode>, <InlineCode>Rührt</InlineCode></li>
            </ul>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default memo(A2Day8ImperativBefehlsformGrammarPage);
