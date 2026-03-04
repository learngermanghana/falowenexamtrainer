import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = { ...styles.card, display: "grid", gap: 10 };

const ComparingThingsAndPeopleGrammarPage = () => {
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

        <h1 style={{ ...styles.title, marginBottom: 0 }}>Dinge und Personen vergleichen (1.3)</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Positive, Comparative, and Superlative in German</p>
      </header>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Positive Form (Positiv)</h2>
        <p style={{ margin: 0 }}>
          The positive form is the base adjective with no comparison.
        </p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>groß (big)</li>
          <li>klein (small)</li>
          <li>schnell (fast)</li>
          <li>langsam (slow)</li>
          <li>schön (beautiful)</li>
          <li>interessant (interesting)</li>
          <li>teuer (expensive)</li>
          <li>billig (cheap)</li>
          <li>hoch (high)</li>
          <li>niedrig (low)</li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Comparative Form (Komparativ)</h2>
        <p style={{ margin: 0 }}>
          Compare two things by usually adding <strong>-er</strong>. Some vowels may change to
          umlaut forms (ä, ö, ü).
        </p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>groß → größer</li>
          <li>klein → kleiner</li>
          <li>schnell → schneller</li>
          <li>langsam → langsamer</li>
          <li>schön → schöner</li>
          <li>interessant → interessanter</li>
          <li>teuer → teurer</li>
          <li>billig → billiger</li>
          <li>hoch → höher</li>
          <li>niedrig → niedriger</li>
        </ul>
        <p style={{ margin: 0 }}>
          Use <strong>als</strong> (than) for unequal comparison:
        </p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Peter ist größer als Maria.</li>
          <li>Das Auto ist schneller als das Fahrrad.</li>
          <li>Dieses Buch ist interessanter als das andere.</li>
          <li>Der Berg ist höher als der Hügel.</li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Superlative Form (Superlativ)</h2>
        <p style={{ margin: 0 }}>
          Describe the highest degree with <strong>am</strong> + adjective + <strong>-sten</strong> / <strong>-esten</strong>.
        </p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>am größten</li>
          <li>am kleinsten</li>
          <li>am schnellsten</li>
          <li>am langsamsten</li>
          <li>am schönsten</li>
          <li>am interessantesten</li>
          <li>am teuersten</li>
          <li>am billigsten</li>
          <li>am höchsten</li>
          <li>am niedrigsten</li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>"genauso ... wie" and "als"</h2>
        <p style={{ margin: 0 }}>
          Use <strong>genauso + adjective + wie</strong> for equality, and comparative + <strong>als</strong> for
          inequality.
        </p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Peter ist genauso groß wie Maria.</li>
          <li>Das Auto ist genauso schnell wie das Motorrad.</li>
          <li>Peter ist größer als Maria.</li>
          <li>Das Auto ist schneller als das Fahrrad.</li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Summary</h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Positive: no comparison (groß, klein, schön).</li>
          <li>Comparative: compare two things (-er, e.g., größer).</li>
          <li>Superlative: strongest degree (am größten).</li>
          <li>genauso ... wie: equal comparison.</li>
          <li>... als: unequal comparison.</li>
        </ul>
      </section>
    </main>
  );
};

export default memo(ComparingThingsAndPeopleGrammarPage);
