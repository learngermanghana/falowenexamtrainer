import React, { memo } from "react";
import AppBackButton from "./navigation/AppBackButton";

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

  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        <AppBackButton label="Back" fallbackPath="/campus/course" />

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

          <SectionCard title="3) Real room examples: no movement vs. movement">
            <p style={{ margin: 0 }}>
              The <strong>same preposition</strong> changes the case depending on meaning:
            </p>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>
                <strong>in</strong>: Die Kommode steht <strong>im</strong> Flur. (no movement, dative) →
                Ich stelle die Kommode <strong>in den</strong> Flur. (movement, accusative)
              </li>
              <li>
                <strong>an</strong>: Das Poster hängt <strong>an der</strong> Wand. (no movement, dative) →
                Ich hänge das Poster <strong>an die</strong> Wand. (movement, accusative)
              </li>
              <li>
                <strong>auf</strong>: Die Bücher liegen <strong>auf dem</strong> Tisch. (no movement, dative) →
                Ich lege die Bücher <strong>auf den</strong> Tisch. (movement, accusative)
              </li>
              <li>
                <strong>unter</strong>: Der Teppich liegt <strong>unter dem</strong> Bett. (no movement, dative) →
                Ich schiebe den Teppich <strong>unter das</strong> Bett. (movement, accusative)
              </li>
              <li>
                <strong>zwischen</strong>: Der Sessel steht <strong>zwischen dem</strong> Sofa und der Lampe. (no movement, dative) →
                Ich stelle den Sessel <strong>zwischen das</strong> Sofa und die Lampe. (movement, accusative)
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
