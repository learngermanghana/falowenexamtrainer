import React from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";

const sectionStyle = { ...styles.card, display: "grid", gap: 12 };

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 15,
};

const thTdStyle = {
  border: "1px solid #d1d5db",
  padding: "8px 10px",
  textAlign: "left",
  verticalAlign: "top",
};

const noteStyle = {
  background: "#f8fafc",
  border: "1px solid #cbd5e1",
  borderRadius: 12,
  padding: 12,
};

const quizStyle = {
  background: "#f8fafc",
  border: "1px solid #cbd5e1",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 10,
};

const nominativeRows = [
  ["Masculine", "ein", "der → -er", "-er", "ein großer Hund"],
  ["Feminine", "eine", "die → -e", "-e", "eine rote Blume"],
  ["Neuter", "ein", "das → -es", "-es", "ein kleines Auto"],
  ["Plural", "keine", "die → -en", "-en", "keine neuen Bücher"],
];

const accusativeRows = [
  ["Masculine", "einen", "den → -en", "-en", "einen kleinen Hund"],
  ["Feminine", "eine", "die → -e", "-e", "eine schöne Blume"],
  ["Neuter", "ein", "das → -es", "-es", "ein grünes Auto"],
  ["Plural", "keine", "die → -en", "-en", "keine alten Bücher"],
];

const A2Day2GrammarNotesPage = () => {

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 10 }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          Step 1: Adjective Declension First (Indefinite Articles: Nominative + Accusative)
        </h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Start here first. For now, focus only on indefinite articles with adjective endings in nominative and accusative.
        </p>
      </header>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Learning objectives</h2>
        <div style={noteStyle}>
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
            <li>See where adjective endings (-er/-e/-es/-en) come from.</li>
            <li>Connect indefinite forms (ein/eine/einen/keine) to definite article pattern (der/die/das/den).</li>
            <li>Practice with quick clickable mini test items.</li>
          </ul>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Simple core rule</h2>
        <div style={noteStyle}>
          <p style={{ margin: 0 }}>
            The ending in <strong>ein/eine/einen + adjective + noun</strong> is guided by:
          </p>
          <ul style={{ margin: "8px 0 0 0", paddingLeft: 18, display: "grid", gap: 6 }}>
            <li>the article pattern from <strong>der/die/das</strong> in that slot, and</li>
            <li>whether your sentence is <strong>nominative</strong> (subject) or <strong>accusative</strong> (object).</li>
          </ul>
          <p style={{ margin: "8px 0 0 0" }}>We will learn dative adjective declension later.</p>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Very simple trick</h2>
        <div style={noteStyle}>
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
            <li>ein (masculine nominative) → adjective ending -er: <em>ein großer Hund</em></li>
            <li>eine (feminine nominative/accusative) → adjective ending -e: <em>eine rote Blume</em></li>
            <li>ein (neuter nominative/accusative) → adjective ending -es: <em>ein neues Auto</em></li>
            <li>einen (masculine accusative) → adjective ending -en: <em>einen kleinen Hund</em></li>
            <li>keine (plural nominative/accusative) → adjective ending -en: <em>keine alten Bücher</em></li>
          </ul>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Nominative table</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thTdStyle}>Gender</th>
                <th style={thTdStyle}>Article</th>
                <th style={thTdStyle}>Definite pattern</th>
                <th style={thTdStyle}>Ending</th>
                <th style={thTdStyle}>Example</th>
              </tr>
            </thead>
            <tbody>
              {nominativeRows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => (
                    <td key={cell} style={thTdStyle}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={noteStyle}>
          <p style={{ margin: 0 }}><strong>Color key:</strong></p>
          <p style={{ margin: "6px 0 0 0" }}>der → -er</p>
          <p style={{ margin: "6px 0 0 0" }}>die → -e</p>
          <p style={{ margin: "6px 0 0 0" }}>das → -es</p>
          <p style={{ margin: "6px 0 0 0" }}>die plural → -en</p>
          <p style={{ margin: "10px 0 0 0" }}><strong>Color guide:</strong> Yellow = indefinite article · Blue = adjective ending change · Green = noun</p>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Full sentence examples (Nominative)</h2>
        <div style={noteStyle}>
          <p style={{ margin: 0 }}><strong>Nominative Masculine:</strong> Das ist ein großer Hund.</p>
          <p style={{ margin: "6px 0 0 0" }}>Base adjective: groß → declined: großer</p>
          <p style={{ margin: "6px 0 0 0" }}>That is a big dog.</p>

          <p style={{ margin: "10px 0 0 0" }}><strong>Nominative Feminine:</strong> Das ist eine rote Blume.</p>
          <p style={{ margin: "6px 0 0 0" }}>Base adjective: rot → declined: rote</p>
          <p style={{ margin: "6px 0 0 0" }}>That is a red flower.</p>

          <p style={{ margin: "10px 0 0 0" }}><strong>Nominative Neuter:</strong> Das ist ein kleines Auto.</p>
          <p style={{ margin: "6px 0 0 0" }}>Base adjective: klein → declined: kleines</p>
          <p style={{ margin: "6px 0 0 0" }}>That is a small car.</p>

          <p style={{ margin: "10px 0 0 0" }}><strong>Nominative Plural:</strong> Das sind keine neuen Bücher.</p>
          <p style={{ margin: "6px 0 0 0" }}>Base adjective: neu → declined: neuen</p>
          <p style={{ margin: "6px 0 0 0" }}>Those are not new books.</p>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Accusative table</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thTdStyle}>Gender</th>
                <th style={thTdStyle}>Article</th>
                <th style={thTdStyle}>Definite pattern</th>
                <th style={thTdStyle}>Ending</th>
                <th style={thTdStyle}>Example</th>
              </tr>
            </thead>
            <tbody>
              {accusativeRows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => (
                    <td key={cell} style={thTdStyle}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={noteStyle}>
          <p style={{ margin: 0 }}><strong>Color key:</strong></p>
          <p style={{ margin: "6px 0 0 0" }}>den → -en</p>
          <p style={{ margin: "6px 0 0 0" }}>die → -e</p>
          <p style={{ margin: "6px 0 0 0" }}>das → -es</p>
          <p style={{ margin: "6px 0 0 0" }}>die plural → -en</p>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Full sentence examples (Accusative)</h2>
        <div style={noteStyle}>
          <p style={{ margin: 0 }}><strong>Accusative Masculine:</strong> Ich sehe einen kleinen Hund.</p>
          <p style={{ margin: "6px 0 0 0" }}>Base adjective: klein → declined: kleinen</p>
          <p style={{ margin: "6px 0 0 0" }}>I see a small dog.</p>

          <p style={{ margin: "10px 0 0 0" }}><strong>Accusative Feminine:</strong> Ich kaufe eine schöne Blume.</p>
          <p style={{ margin: "6px 0 0 0" }}>Base adjective: schön → declined: schöne</p>
          <p style={{ margin: "6px 0 0 0" }}>I buy a beautiful flower.</p>

          <p style={{ margin: "10px 0 0 0" }}><strong>Accusative Neuter:</strong> Wir haben ein grünes Auto.</p>
          <p style={{ margin: "6px 0 0 0" }}>Base adjective: grün → declined: grünes</p>
          <p style={{ margin: "6px 0 0 0" }}>We have a green car.</p>

          <p style={{ margin: "10px 0 0 0" }}><strong>Accusative Plural:</strong> Er hat keine alten Bücher.</p>
          <p style={{ margin: "6px 0 0 0" }}>Base adjective: alt → declined: alten</p>
          <p style={{ margin: "6px 0 0 0" }}>He has no old books.</p>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Mini adjective ending test (A1)</h2>
        <div style={quizStyle}>
          <p style={{ margin: 0 }}><strong>1.</strong> Das ist ___ groß___ Hund.</p>
          <p style={{ margin: 0 }}><strong>Correct answer:</strong> ein großer Hund</p>

          <p style={{ margin: "8px 0 0 0" }}><strong>2.</strong> Ich sehe ___ klein___ Hund.</p>
          <p style={{ margin: 0 }}><strong>Correct answer:</strong> einen kleinen Hund</p>

          <p style={{ margin: "8px 0 0 0" }}><strong>3.</strong> Sie hat ___ rot___ Blume.</p>
          <p style={{ margin: 0 }}><strong>Correct answer:</strong> eine rote Blume</p>

          <p style={{ margin: "8px 0 0 0" }}><strong>4.</strong> Das ist ___ neu___ Auto.</p>
          <p style={{ margin: 0 }}><strong>Correct answer:</strong> ein neues Auto</p>

          <p style={{ margin: "8px 0 0 0" }}><strong>5.</strong> Wir kaufen ___ alt___ Bücher.</p>
          <p style={{ margin: 0 }}><strong>Correct answer:</strong> keine alten Bücher</p>
        </div>
      </section>
    </main>
  );
};

export default A2Day2GrammarNotesPage;
