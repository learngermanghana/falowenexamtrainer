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

const A2Day6TwoCasePrepositionsGrammarPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        <button type="button" onClick={() => navigate(-1)} style={styles.backBtn}>
          ← Back
        </button>

        <header style={{ marginBottom: 18 }}>
          <h1 style={{ margin: "0 0 8px" }}>A2 • 3.6 Möbel und Räume kennenlernen</h1>
          <p style={{ margin: 0, opacity: 0.85 }}>
            Grammar focus: <strong>Two-case prepositions (Wechselpräpositionen)</strong>
          </p>
          <div
            style={{
              marginTop: 12,
              borderRadius: 14,
              overflow: "hidden",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1800&q=80"
              alt="Bright room with furniture for preposition practice"
              loading="lazy"
              style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
            />
          </div>
        </header>

        <div style={{ display: "grid", gap: 14 }}>
          <SectionCard title="1) Rule: Wo? vs. Wohin?">
            <p style={{ margin: 0 }}>
              Two-case prepositions use either dative or accusative, depending on meaning:
            </p>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>
                <InlineCode>Wo? (position, no movement) → Dativ</InlineCode>
              </li>
              <li>
                <InlineCode>Wohin? (direction, movement) → Akkusativ</InlineCode>
              </li>
            </ul>
          </SectionCard>

          <SectionCard title="2) Core prepositions for rooms and furniture">
            <p style={{ margin: 0 }}>
              <InlineCode>an, auf, hinter, in, neben, über, unter, vor, zwischen</InlineCode>
            </p>
            <p style={{ margin: 0 }}>
              These prepositions are common when describing where furniture is and where we move it.
            </p>
          </SectionCard>

          <SectionCard title="3) A2 examples in Möbel und Räume context">
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>
                <strong>Wo?</strong> Der Tisch steht <strong>im</strong> Wohnzimmer. / Die Lampe hängt <strong>an der</strong> Wand.
              </li>
              <li>
                <strong>Wohin?</strong> Ich stelle den Stuhl <strong>in das</strong> Wohnzimmer. / Ich hänge das Bild <strong>an die</strong>{" "}
                Wand.
              </li>
              <li>
                Das Bett steht <strong>neben dem</strong> Schrank, aber ich schiebe das Bett <strong>neben den</strong> Schrank.
              </li>
            </ul>
          </SectionCard>

          <SectionCard title="4) Quick article guide (A2)">
            <p style={{ margin: 0 }}>
              Dative after <InlineCode>Wo?</InlineCode>: <InlineCode>dem / der / den (+n)</InlineCode>
            </p>
            <p style={{ margin: 0 }}>
              Accusative after <InlineCode>Wohin?</InlineCode>: <InlineCode>den / die / das</InlineCode>
            </p>
          </SectionCard>

          <SectionCard title="5) Common mistakes to avoid">
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>Do not use dative when there is clear movement to a destination.</li>
              <li>Do not use accusative if the object is already in a fixed location.</li>
              <li>Always check the question first: <strong>Wo?</strong> or <strong>Wohin?</strong></li>
            </ul>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default memo(A2Day6TwoCasePrepositionsGrammarPage);
