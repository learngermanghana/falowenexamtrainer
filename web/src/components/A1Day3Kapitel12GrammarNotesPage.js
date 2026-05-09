import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const sectionStyle = { ...styles.card, display: "grid", gap: 12 };
const noteStyle = {
  background: "#f8fafc",
  border: "1px solid #cbd5e1",
  borderRadius: 12,
  padding: 12,
};
const tableStyle = { width: "100%", borderCollapse: "collapse", fontSize: 15 };
const thTdStyle = {
  border: "1px solid #d1d5db",
  padding: "8px 10px",
  textAlign: "left",
  verticalAlign: "top",
};

const pronounRows = [
  ["ich", "I", "Ich lerne Deutsch."],
  ["du", "you (informal, one person)", "Du lernst Deutsch."],
  ["er", "he", "Er lernt Deutsch."],
  ["sie", "she", "Sie lernt Deutsch."],
  ["es", "it", "Es ist neu."],
  ["wir", "we", "Wir lernen Deutsch."],
  ["ihr", "you (informal, plural)", "Ihr lernt Deutsch."],
  ["sie", "they", "Sie lernen Deutsch."],
  ["Sie", "you (formal)", "Sie lernen Deutsch."],
];

const A1Day3Kapitel12GrammarNotesPage = () => {
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
          A1 · Day 3 · Personal Pronouns · Grammar Notes
        </h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          The right A1 notes for all basic German personal pronouns.
        </p>
      </header>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>1) What are personal pronouns?</h2>
        <div style={noteStyle}>
          <p style={{ margin: 0 }}>
            Personal pronouns replace names and nouns, like <strong>I, you, he, she</strong> in
            English.
          </p>
          <p style={{ margin: "8px 0 0 0" }}>
            In German, we use them all the time with verbs. Learning them early helps you build
            correct sentences.
          </p>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>2) All A1 personal pronouns</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thTdStyle}>German</th>
                <th style={thTdStyle}>English</th>
                <th style={thTdStyle}>Example</th>
              </tr>
            </thead>
            <tbody>
              {pronounRows.map((row) => (
                <tr key={`${row[0]}-${row[1]}`}>
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
        <h2 style={{ margin: 0 }}>3) Important A1 notes</h2>
        <div style={noteStyle}>
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
            <li>
              <strong>sie</strong> and <strong>Sie</strong> are different: <em>sie</em> = she/they,
              <em> Sie</em> = formal you.
            </li>
            <li>
              <strong>Sie</strong> is always capitalized.
            </li>
            <li>
              Verb endings change with each pronoun: <em>ich lerne</em>, <em>du lernst</em>,
              <em> wir lernen</em>.
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default A1Day3Kapitel12GrammarNotesPage;
