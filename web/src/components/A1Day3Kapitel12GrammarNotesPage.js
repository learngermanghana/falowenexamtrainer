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

const formRows = [
  ["Masculine nominative", "ein", "freundlicher", "Mann"],
  ["Feminine nominative", "eine", "nette", "Frau"],
  ["Neuter nominative", "ein", "kleines", "Kind"],
  ["Masculine accusative", "einen", "großen", "Mann"],
  ["Feminine accusative", "eine", "schöne", "Jacke"],
  ["Neuter accusative", "ein", "rotes", "Auto"],
];

const sentenceRows = [
  ["Das ist ein freundlicher Mann.", "That is a friendly man."],
  ["Sie ist eine nette Frau.", "She is a nice woman."],
  ["Das ist ein kleines Kind.", "That is a small child."],
  ["Ich sehe einen großen Mann.", "I see a tall man."],
  ["Sie hat eine schöne Jacke.", "She has a beautiful jacket."],
  ["Er kauft ein rotes Auto.", "He buys a red car."],
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
            Do not worry about other forms now. This is only your second day in A2, so you should first learn the basic patterns.
          </p>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>2) The pattern</h2>
        <div style={noteStyle}>
          <p style={{ margin: 0 }}>The pattern is:</p>
          <p style={{ margin: "8px 0 0 0", fontWeight: 700 }}>
            article + adjective + noun
          </p>
          <ul style={{ margin: "8px 0 0 0", paddingLeft: 18, display: "grid", gap: 6 }}>
            <li>
              <em>ein freundlicher Mann</em>
            </li>
            <li>
              <em>eine nette Frau</em>
            </li>
            <li>
              <em>ein kleines Kind</em>
            </li>
            <li>
              <em>einen großen Mann</em>
            </li>
          </ul>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>3) The endings for today</h2>
        <div style={endingBoxWrapStyle}>
          <div style={endingCardStyle("#eff6ff", "#93c5fd")}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#1d4ed8" }}>-er</div>
            <div><strong>Masculine nominative</strong></div>
            <div>
              <em>
                ein freundlich
                <span style={endingSpan("#1d4ed8", "#dbeafe")}>er</span> Mann
              </em>
            </div>
          </div>

          <div style={endingCardStyle("#f0fdf4", "#86efac")}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#15803d" }}>-e</div>
            <div><strong>Feminine</strong></div>
            <div>
              <em>
                eine nett
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
                <span style={endingSpan("#c2410c", "#ffedd5")}>es</span> Kind
              </em>
            </div>
          </div>

          <div style={endingCardStyle("#faf5ff", "#c4b5fd")}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#7c3aed" }}>-en</div>
            <div><strong>Masculine accusative</strong></div>
            <div>
              <em>
                einen groß
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
        <h2 style={{ margin: 0 }}>4) Forms to learn now</h2>
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
        <h2 style={{ margin: 0 }}>5) Learn these chunks</h2>
        <div style={noteStyle}>
          <p style={{ margin: 0 }}>
            <strong>Learn these as full chunks:</strong>
          </p>
          <p style={{ margin: "6px 0 0 0" }}>
            <strong>ein freundlicher Mann</strong>
          </p>
          <p style={{ margin: "6px 0 0 0" }}>
            <strong>eine nette Frau</strong>
          </p>
          <p style={{ margin: "6px 0 0 0" }}>
            <strong>ein kleines Kind</strong>
          </p>
          <p style={{ margin: "6px 0 0 0" }}>
            <strong>einen großen Mann</strong>
          </p>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>6) Easy rule summary</h2>
        <div style={noteStyle}>
          <p style={{ margin: 0 }}>
            <strong>Nominative:</strong>
          </p>
          <ul style={{ margin: "8px 0 0 0", paddingLeft: 18, display: "grid", gap: 6 }}>
            <li>
              <em>ein freundlich<strong>er</strong> Mann</em>
            </li>
            <li>
              <em>eine nett<strong>e</strong> Frau</em>
            </li>
            <li>
              <em>ein klein<strong>es</strong> Kind</em>
            </li>
          </ul>

          <p style={{ margin: "10px 0 0 0" }}>
            <strong>Accusative:</strong>
          </p>
          <ul style={{ margin: "8px 0 0 0", paddingLeft: 18, display: "grid", gap: 6 }}>
            <li>
              <em>einen groß<strong>en</strong> Mann</em>
            </li>
            <li>
              <em>eine schön<strong>e</strong> Jacke</em>
            </li>
            <li>
              <em>ein rot<strong>es</strong> Auto</em>
            </li>
          </ul>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>7) Example sentences</h2>
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
        <h2 style={{ margin: 0 }}>8) Practice: 10 questions</h2>
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
            <strong>1.</strong> Das ist ein _____ Mann. (freundlich)
          </p>
          <p style={{ margin: 0 }}>
            <strong>2.</strong> Sie ist eine _____ Frau. (nett)
          </p>
          <p style={{ margin: 0 }}>
            <strong>3.</strong> Das ist ein _____ Kind. (klein)
          </p>
          <p style={{ margin: 0 }}>
            <strong>4.</strong> Ich sehe einen _____ Mann. (groß)
          </p>
          <p style={{ margin: 0 }}>
            <strong>5.</strong> Sie kauft eine _____ Jacke. (schön)
          </p>
          <p style={{ margin: 0 }}>
            <strong>6.</strong> Er hat ein _____ Auto. (rot)
          </p>
          <p style={{ margin: 0 }}>
            <strong>7.</strong> Das ist ein _____ Lehrer. (jung)
          </p>
          <p style={{ margin: 0 }}>
            <strong>8.</strong> Ich habe einen _____ Hund. (klein)
          </p>
          <p style={{ margin: 0 }}>
            <strong>9.</strong> Sie braucht eine _____ Tasche. (neu)
          </p>
          <p style={{ margin: 0 }}>
            <strong>10.</strong> Er kauft ein _____ Handy. (modern)
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
            <p style={{ margin: "6px 0 0 0" }}>1) <strong>freundlicher</strong></p>
            <p style={{ margin: "6px 0 0 0" }}>2) <strong>nette</strong></p>
            <p style={{ margin: "6px 0 0 0" }}>3) <strong>kleines</strong></p>
            <p style={{ margin: "6px 0 0 0" }}>4) <strong>großen</strong></p>
            <p style={{ margin: "6px 0 0 0" }}>5) <strong>schöne</strong></p>
            <p style={{ margin: "6px 0 0 0" }}>6) <strong>rotes</strong></p>
            <p style={{ margin: "6px 0 0 0" }}>7) <strong>junger</strong></p>
            <p style={{ margin: "6px 0 0 0" }}>8) <strong>kleinen</strong></p>
            <p style={{ margin: "6px 0 0 0" }}>9) <strong>neue</strong></p>
            <p style={{ margin: "6px 0 0 0" }}>10) <strong>modernes</strong></p>
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>9) Common mistakes</h2>
        <div style={noteStyle}>
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
            <li>
              ❌ <em>ein freundlich Mann</em> → ✅ <em>ein freundlicher Mann</em>
            </li>
            <li>
              ❌ <em>einen großer Mann</em> → ✅ <em>einen großen Mann</em>
            </li>
            <li>
              ❌ <em>eine schön Jacke</em> → ✅ <em>eine schöne Jacke</em>
            </li>
            <li>
              ❌ <em>ein rot Auto</em> → ✅ <em>ein rotes Auto</em>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default A2Day2GrammarNotesPage;
