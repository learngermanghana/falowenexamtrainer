import React from "react";
import { useNavigate } from "react-router-dom";
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

const endingBoxWrapStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: 10,
};

const endingCardStyle = (bg, border) => ({
  background: bg,
  border: `1px solid ${border}`,
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 6,
});

const endingSpan = (color, bg) => ({
  color,
  background: bg,
  padding: "1px 6px",
  borderRadius: 6,
  fontWeight: 700,
});

const definiteArticleRows = [
  ["Masculine", "der", "den"],
  ["Feminine", "die", "die"],
  ["Neuter", "das", "das"],
  ["Plural", "die", "die"],
];

const formRows = [
  ["Masculine nominative", "ein", "kleiner", "Mann"],
  ["Feminine nominative", "eine", "kleine", "Frau"],
  ["Neuter nominative", "ein", "kleines", "Haus"],
  ["Masculine accusative", "einen", "kleinen", "Mann"],
  ["Feminine accusative", "eine", "kleine", "Frau"],
  ["Neuter accusative", "ein", "kleines", "Haus"],
];

const sentenceRows = [
  ["Das ist ein kleiner Mann.", "That is a short/small man."],
  ["Sie ist eine kleine Frau.", "She is a short/small woman."],
  ["Das ist ein kleines Haus.", "That is a small house."],
  ["Ich sehe einen kleinen Mann.", "I see a short/small man."],
  ["Sie besucht eine kleine Frau.", "She visits a short/small woman."],
  ["Er kauft ein kleines Haus.", "He buys a small house."],
];

const A2Day2GrammarNotesPage = () => {
  const navigate = useNavigate();

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 10 }}>
        <button
          type="button"
          style={{ ...styles.secondaryButton, width: "fit-content" }}
          onClick={() => navigate("/campus/course")}
        >
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          A2 · Day 2 · Adjective Declension · Grammar Notes
        </h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Indefinite article + adjective + noun in nominative and accusative
        </p>

        <img
          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1600&q=80"
          alt="Portrait of a smiling person"
          style={{ width: "100%", borderRadius: 12, maxHeight: 320, objectFit: "cover" }}
        />
      </header>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>1) What are we learning today?</h2>
        <div style={noteStyle}>
          <p style={{ margin: 0 }}>
            Today we only learn <strong>indefinite article + adjective + noun</strong>.
          </p>
          <p style={{ margin: "8px 0 0 0" }}>
            We only focus on <strong>nominative</strong> and <strong>accusative</strong>.
          </p>
          <p style={{ margin: "8px 0 0 0" }}>
            Do not worry about other forms now. This is only your second day in A2, so you
            should first learn the basic patterns.
          </p>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>2) The simple idea</h2>
        <div style={noteStyle}>
          <p style={{ margin: 0 }}>
            The adjective ending comes from the <strong>definite article pattern</strong>.
          </p>
          <p style={{ margin: "8px 0 0 0" }}>
            So first, we look at the definite article. Then we use that ending on the adjective.
          </p>
          <p style={{ margin: "8px 0 0 0" }}>
            Example:
          </p>
          <ul style={{ margin: "8px 0 0 0", paddingLeft: 18, display: "grid", gap: 6 }}>
            <li>
              <em>der</em> → <em>ein klein<strong>er</strong> Mann</em>
            </li>
            <li>
              <em>die</em> → <em>eine klein<strong>e</strong> Frau</em>
            </li>
            <li>
              <em>das</em> → <em>ein klein<strong>es</strong> Haus</em>
            </li>
            <li>
              <em>den</em> → <em>einen klein<strong>en</strong> Mann</em>
            </li>
          </ul>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>3) Definite articles in nominative and accusative</h2>
        <div style={noteStyle}>
          <p style={{ margin: 0 }}>
            These definite articles help us choose the adjective ending.
          </p>
          <p style={{ margin: "8px 0 0 0" }}>
            We are not learning definite article phrases fully today. We only use them as a
            guide for the adjective endings.
          </p>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thTdStyle}>Gender</th>
                <th style={thTdStyle}>Nominative</th>
                <th style={thTdStyle}>Accusative</th>
              </tr>
            </thead>
            <tbody>
              {definiteArticleRows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => (
                    <td key={cell} style={thTdStyle}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={noteStyle}>
          <p style={{ margin: 0 }}>
            <strong>Important for today:</strong>
          </p>
          <p style={{ margin: "6px 0 0 0" }}>
            <strong>der → -er</strong>
          </p>
          <p style={{ margin: "6px 0 0 0" }}>
            <strong>die → -e</strong>
          </p>
          <p style={{ margin: "6px 0 0 0" }}>
            <strong>das → -es</strong>
          </p>
          <p style={{ margin: "6px 0 0 0" }}>
            <strong>den → -en</strong>
          </p>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>4) The pattern</h2>
        <div style={noteStyle}>
          <p style={{ margin: 0 }}>The pattern is:</p>
          <p style={{ margin: "8px 0 0 0", fontWeight: 700 }}>
            article + adjective + noun
          </p>
          <ul style={{ margin: "8px 0 0 0", paddingLeft: 18, display: "grid", gap: 6 }}>
            <li>
              <em>ein kleiner Mann</em>
            </li>
            <li>
              <em>eine kleine Frau</em>
            </li>
            <li>
              <em>ein kleines Haus</em>
            </li>
            <li>
              <em>einen kleinen Mann</em>
            </li>
          </ul>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>5) The endings for today</h2>
        <div style={endingBoxWrapStyle}>
          <div style={endingCardStyle("#eff6ff", "#93c5fd")}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#1d4ed8" }}>-er</div>
            <div><strong>Masculine nominative</strong></div>
            <div>
              <em>
                ein klein
                <span style={endingSpan("#1d4ed8", "#dbeafe")}>er</span> Mann
              </em>
            </div>
          </div>

          <div style={endingCardStyle("#f0fdf4", "#86efac")}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#15803d" }}>-e</div>
            <div><strong>Feminine</strong></div>
            <div>
              <em>
                eine klein
                <span style={endingSpan("#15803d", "#dcfce7")}>e</span> Frau
              </em>
            </div>
          </div>

          <div style={endingCardStyle("#fff7ed", "#fdba74")}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#c2410c" }}>-es</div>
            <div><strong>Neuter</strong></div>
            <div>
              <em>
                ein klein
                <span style={endingSpan("#c2410c", "#ffedd5")}>es</span> Haus
              </em>
            </div>
          </div>

          <div style={endingCardStyle("#faf5ff", "#c4b5fd")}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#7c3aed" }}>-en</div>
            <div><strong>Masculine accusative</strong></div>
            <div>
              <em>
                einen klein
                <span style={endingSpan("#7c3aed", "#ede9fe")}>en</span> Mann
              </em>
            </div>
          </div>
        </div>

        <div style={noteStyle}>
          <p style={{ margin: 0 }}>
            For Day 2, remember only these four endings:
            <strong> -er, -e, -es, -en</strong>.
          </p>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>6) Forms to learn now</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thTdStyle}>Use</th>
                <th style={thTdStyle}>Article</th>
                <th style={thTdStyle}>Adjective</th>
                <th style={thTdStyle}>Noun</th>
              </tr>
            </thead>
            <tbody>
              {formRows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => (
                    <td key={cell} style={thTdStyle}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>7) Learn these chunks</h2>
        <div style={noteStyle}>
          <p style={{ margin: 0 }}>
            <strong>Learn these as full chunks:</strong>
          </p>
          <p style={{ margin: "6px 0 0 0" }}>
            <strong>ein kleiner Mann</strong>
          </p>
          <p style={{ margin: "6px 0 0 0" }}>
            <strong>eine kleine Frau</strong>
          </p>
          <p style={{ margin: "6px 0 0 0" }}>
            <strong>ein kleines Haus</strong>
          </p>
          <p style={{ margin: "6px 0 0 0" }}>
            <strong>einen kleinen Mann</strong>
          </p>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>8) Easy rule summary</h2>
        <div style={noteStyle}>
          <p style={{ margin: 0 }}>
            <strong>Nominative:</strong>
          </p>
          <ul style={{ margin: "8px 0 0 0", paddingLeft: 18, display: "grid", gap: 6 }}>
            <li>
              <em>ein klein<strong>er</strong> Mann</em>
            </li>
            <li>
              <em>eine klein<strong>e</strong> Frau</em>
            </li>
            <li>
              <em>ein klein<strong>es</strong> Haus</em>
            </li>
          </ul>

          <p style={{ margin: "10px 0 0 0" }}>
            <strong>Accusative:</strong>
          </p>
          <ul style={{ margin: "8px 0 0 0", paddingLeft: 18, display: "grid", gap: 6 }}>
            <li>
              <em>einen klein<strong>en</strong> Mann</em>
            </li>
            <li>
              <em>eine klein<strong>e</strong> Frau</em>
            </li>
            <li>
              <em>ein klein<strong>es</strong> Haus</em>
            </li>
          </ul>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>9) Example sentences</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thTdStyle}>German</th>
                <th style={thTdStyle}>English</th>
              </tr>
            </thead>
            <tbody>
              {sentenceRows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => (
                    <td key={cell} style={thTdStyle}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>10) Practice: 10 questions</h2>
        <div style={quizStyle}>
          <p style={{ margin: 0 }}>
            <strong>Choose the correct adjective ending.</strong>
          </p>
          <p style={{ margin: 0, color: "#475569" }}>
            Look at the article first. Then complete the adjective.
          </p>
          <p style={{ margin: 0, color: "#475569" }}>
            <strong>Tip:</strong> ein = masculine/neuter, eine = feminine, einen = masculine accusative.
          </p>

          <p style={{ margin: 0 }}>
            <strong>1.</strong> Das ist ein _____ Mann. (klein)
          </p>
          <p style={{ margin: 0 }}>
            <strong>2.</strong> Sie ist eine _____ Frau. (klein)
          </p>
          <p style={{ margin: 0 }}>
            <strong>3.</strong> Das ist ein _____ Haus. (klein)
          </p>
          <p style={{ margin: 0 }}>
            <strong>4.</strong> Ich sehe einen _____ Mann. (klein)
          </p>
          <p style={{ margin: 0 }}>
            <strong>5.</strong> Sie besucht eine _____ Frau. (klein)
          </p>
          <p style={{ margin: 0 }}>
            <strong>6.</strong> Er kauft ein _____ Haus. (klein)
          </p>
          <p style={{ margin: 0 }}>
            <strong>7.</strong> Das ist ein _____ Lehrer. (jung)
          </p>
          <p style={{ margin: 0 }}>
            <strong>8.</strong> Ich habe einen _____ Hund. (alt)
          </p>
          <p style={{ margin: 0 }}>
            <strong>9.</strong> Sie braucht eine _____ Tasche. (neu)
          </p>
          <p style={{ margin: 0 }}>
            <strong>10.</strong> Er kauft ein _____ Auto. (modern)
          </p>

          <div
            style={{
              marginTop: 8,
              background: "#ffffff",
              border: "1px dashed #94a3b8",
              borderRadius: 10,
              padding: 10,
              color: "#475569",
            }}
          >
            <p style={{ margin: 0 }}>
              <strong>Answers:</strong>
            </p>
            <p style={{ margin: "6px 0 0 0" }}>1) <strong>kleiner</strong></p>
            <p style={{ margin: "6px 0 0 0" }}>2) <strong>kleine</strong></p>
            <p style={{ margin: "6px 0 0 0" }}>3) <strong>kleines</strong></p>
            <p style={{ margin: "6px 0 0 0" }}>4) <strong>kleinen</strong></p>
            <p style={{ margin: "6px 0 0 0" }}>5) <strong>kleine</strong></p>
            <p style={{ margin: "6px 0 0 0" }}>6) <strong>kleines</strong></p>
            <p style={{ margin: "6px 0 0 0" }}>7) <strong>junger</strong></p>
            <p style={{ margin: "6px 0 0 0" }}>8) <strong>alten</strong></p>
            <p style={{ margin: "6px 0 0 0" }}>9) <strong>neue</strong></p>
            <p style={{ margin: "6px 0 0 0" }}>10) <strong>modernes</strong></p>
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>11) Common mistakes</h2>
        <div style={noteStyle}>
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
            <li>
              ❌ <em>ein kleiner Haus</em> → ✅ <em>ein kleines Haus</em>
            </li>
            <li>
              ❌ <em>einen kleiner Mann</em> → ✅ <em>einen kleinen Mann</em>
            </li>
            <li>
              ❌ <em>eine klein Haus</em> → ✅ <em>eine kleine Frau</em>
            </li>
            <li>
              ❌ <em>ein modern Auto</em> → ✅ <em>ein modernes Auto</em>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default A2Day2GrammarNotesPage;
