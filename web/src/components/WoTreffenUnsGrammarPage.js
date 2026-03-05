import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = { ...styles.card, display: "grid", gap: 10 };

const WoTreffenUnsGrammarPage = () => {
  const navigate = useNavigate();

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 12 }}>
        <button
          style={{ ...styles.secondaryButton, width: "fit-content" }}
          onClick={() => navigate("/campus/course")}
        >
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>Wo möchten wir uns treffen? (2.4)</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Dative with two-way prepositions for answering <strong>Wo?</strong>
        </p>
      </header>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Introduction</h2>
        <p style={{ margin: 0 }}>
          In German, we have two-way prepositions (Wechselpräpositionen). These prepositions can take
          either the accusative case or the dative case.
        </p>
        <p style={{ margin: 0 }}>
          We use the accusative when there is movement or when we ask <strong>Wohin?</strong> (to where?).
        </p>
        <p style={{ margin: 0 }}>
          We use the dative when there is location / position or when we ask <strong>Wo?</strong> (where?).
        </p>
        <p style={{ margin: 0 }}>
          Today, we focus on dative prepositions for places.
        </p>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Dative articles for Wo?</h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>masculine → <strong>dem</strong></li>
          <li>feminine → <strong>der</strong></li>
          <li>neuter → <strong>dem</strong></li>
          <li>plural → <strong>den</strong></li>
        </ul>
        <p style={{ margin: 0 }}>
          Simple classroom version: <strong>der → dem, die → der, das → dem, die (plural) → den</strong>.
        </p>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>1) The key question</h2>
        <p style={{ margin: 0 }}>
          <strong>Wo treffen wir uns?</strong> = Where are we meeting?
        </p>
        <p style={{ margin: 0 }}>
          For <strong>Wo?</strong>, we usually use <strong>Dativ</strong> after these prepositions.
        </p>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>2) Most useful meeting prepositions (A2)</h2>
        <p style={{ margin: 0 }}>
          <strong>in / an / bei / vor / hinter / neben / zwischen</strong>
        </p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>in = in (inside)</li>
          <li>an = at (often places like station, park, sea)</li>
          <li>bei = at someone&apos;s place / near</li>
          <li>vor = in front of</li>
          <li>hinter = behind</li>
          <li>neben = next to</li>
          <li>zwischen = between</li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>3) Examples</h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>in dem Park → im Park</li>
          <li>an dem Bahnhof → am Bahnhof</li>
          <li>bei der Schule</li>
          <li>vor dem Kino</li>
          <li>in der Stadt</li>
          <li>bei den Freunden</li>
          <li>zwischen dem Café und dem Kino</li>
          <li>in den Parks (plural) ✅</li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>4) Common contractions</h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>in dem → <strong>im</strong></li>
          <li>an dem → <strong>am</strong></li>
          <li>bei dem → <strong>beim</strong></li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>5) Model sentences</h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Wo treffen wir uns?</li>
          <li>Wo möchtest du dich treffen?</li>
          <li>Wir treffen uns im Café.</li>
          <li>Treffen wir uns am Bahnhof?</li>
          <li>Ich bin bei der Schule.</li>
          <li>Wir treffen uns vor dem Kino.</li>
          <li>Komm, wir treffen uns in der Stadt.</li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>6) Common mistakes</h2>
        <p style={{ margin: 0 }}>❌ in die Stadt (that&apos;s Wohin? movement)</p>
        <p style={{ margin: 0 }}>✅ in der Stadt (location = Wo?)</p>
        <p style={{ margin: 0 }}>❌ am Kino (usually wrong)</p>
        <p style={{ margin: 0 }}>✅ im Kino / vor dem Kino</p>
      </section>
    </main>
  );
};

export default memo(WoTreffenUnsGrammarPage);
