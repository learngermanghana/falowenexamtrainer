import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionTitleStyle = {
  margin: 0,
  fontSize: "1.1rem",
  fontWeight: 700,
};

const listStyle = {
  margin: 0,
  paddingLeft: 18,
  display: "grid",
  gap: 6,
};

const tableWrapStyle = {
  overflowX: "auto",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 14,
  minWidth: 620,
};

const cellStyle = {
  border: "1px solid #d1d5db",
  padding: "8px 10px",
  textAlign: "left",
  verticalAlign: "top",
};

const A1Day9NominativeAccusativeGrammarPage = () => {
  const navigate = useNavigate();

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={cardStyle}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, margin: 0 }}>A1 Day 9 • Nominative and Accusative Cases</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          In-app grammar notes for <strong>German plurals</strong> and the <strong>nominative / accusative</strong> cases.
        </p>
      </header>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>1) German plurals (quick guide)</h2>
        <ul style={listStyle}>
          <li>German nouns can have different plural endings, so plural forms should be learned with each noun.</li>
          <li>Plural nouns do not have grammatical gender, and the definite article is always <strong>die</strong>.</li>
          <li>
            With negation in plural, use <strong>keine</strong> (for example: <strong>keine Bücher</strong>).
          </li>
        </ul>

        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cellStyle}>Type</th>
                <th style={cellStyle}>Masculine</th>
                <th style={cellStyle}>Feminine</th>
                <th style={cellStyle}>Neuter</th>
                <th style={cellStyle}>Plural</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={cellStyle}>Definite articles</td>
                <td style={cellStyle}>der</td>
                <td style={cellStyle}>die</td>
                <td style={cellStyle}>das</td>
                <td style={cellStyle}>die</td>
              </tr>
              <tr>
                <td style={cellStyle}>Indefinite / negation</td>
                <td style={cellStyle}>ein</td>
                <td style={cellStyle}>eine</td>
                <td style={cellStyle}>ein</td>
                <td style={cellStyle}>keine</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ul style={listStyle}>
          <li>Der Hund → Die Hunde | Ich sehe den Hund. / Ich sehe die Hunde.</li>
          <li>Das Buch → Die Bücher | Ich lese das Buch. / Ich lese die Bücher.</li>
          <li>Die Blume → Die Blumen | Ich kaufe die Blume. / Ich kaufe die Blumen.</li>
          <li>Ein Apfel → Keine Äpfel | Ich habe einen Apfel. / Ich habe keine Äpfel.</li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>2) Nominative case (Der Nominativ)</h2>
        <p style={{ margin: 0 }}>
          Use nominative for the <strong>subject</strong> (the person or thing doing the action).
        </p>
        <ul style={listStyle}>
          <li>Der Mann ist nett.</li>
          <li>Die Frau arbeitet.</li>
          <li>Das Kind spielt.</li>
          <li>Das ist ein Haus.</li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>3) Accusative case (Der Akkusativ)</h2>
        <p style={{ margin: 0 }}>
          Use accusative for the <strong>direct object</strong> (the person or thing directly affected by the action).
        </p>

        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cellStyle}>Accusative articles</th>
                <th style={cellStyle}>Masculine</th>
                <th style={cellStyle}>Feminine</th>
                <th style={cellStyle}>Neuter</th>
                <th style={cellStyle}>Plural</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={cellStyle}>Definite</td>
                <td style={cellStyle}>den</td>
                <td style={cellStyle}>die</td>
                <td style={cellStyle}>das</td>
                <td style={cellStyle}>die</td>
              </tr>
              <tr>
                <td style={cellStyle}>Indefinite / negation</td>
                <td style={cellStyle}>einen</td>
                <td style={cellStyle}>eine</td>
                <td style={cellStyle}>ein</td>
                <td style={cellStyle}>keine</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ul style={listStyle}>
          <li>Ich habe den Hund.</li>
          <li>Sie kauft die Blume.</li>
          <li>Er isst das Brot.</li>
          <li>Wir treffen die Freunde.</li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>4) Verbs that often signal nominative or accusative</h2>
        <ul style={listStyle}>
          <li>
            <strong>Nominative focus:</strong> sein, werden
          </li>
          <li>
            <strong>Accusative object verbs:</strong> haben, sehen, finden, kaufen, nehmen, brauchen, essen, trinken,
            hören, lesen
          </li>
        </ul>
        <p style={{ margin: 0 }}>
          Tip: first find the verb, then identify who does the action (subject) and who/what receives the action
          (direct object).
        </p>
      </section>
    </main>
  );
};

export default A1Day9NominativeAccusativeGrammarPage;
