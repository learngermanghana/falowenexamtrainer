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

const quizStyle = {
  background: "#f8fafc",
  border: "1px solid #cbd5e1",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 8,
};

const pronounRows = [
  ["ich", "I", "heiße", "wohne", "arbeite", "komme", "bin"],
  ["du", "you (informal singular)", "heißt", "wohnst", "arbeitest", "kommst", "bist"],
  ["er", "he", "heißt", "wohnt", "arbeitet", "kommt", "ist"],
  ["sie", "she", "heißt", "wohnt", "arbeitet", "kommt", "ist"],
  ["es", "it", "heißt", "wohnt", "arbeitet", "kommt", "ist"],
  ["wir", "we", "heißen", "wohnen", "arbeiten", "kommen", "sind"],
  ["ihr", "you guys / you all", "heißt", "wohnt", "arbeitet", "kommt", "seid"],
  ["sie", "they", "heißen", "wohnen", "arbeiten", "kommen", "sind"],
  ["Sie", "you (formal)", "heißen", "wohnen", "arbeiten", "kommen", "sind"],
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

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A1 · Day 3 · Kapitel 1.2 Grammar Notes</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Pronouns and Identity Expressions in German</p>

        <img
          src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
          alt="German learner writing grammar notes in a notebook"
          style={{ width: "100%", borderRadius: 12, maxHeight: 320, objectFit: "cover" }}
        />
      </header>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>1) Quick starter: difference between "wo" and "woher"</h2>
        <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
          <li>
            <strong>wo</strong> = where (location): <em>Wo wohnst du?</em>
          </li>
          <li>
            <strong>woher</strong> = where from (origin): <em>Woher kommst du?</em>
          </li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>2) Mini knowledge test (before pronouns)</h2>
        <div style={quizStyle}>
          <p style={{ margin: 0 }}>
            <strong>a)</strong> Which question asks about origin: <em>Wo?</em> or <em>Woher?</em>
          </p>
          <p style={{ margin: 0 }}>
            <strong>b)</strong> Complete: <em>___ kommst du?</em>
          </p>
          <p style={{ margin: 0, color: "#475569" }}>
            Check: a) <strong>Woher</strong>, b) <strong>Woher</strong>.
          </p>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>3) German personal pronouns (all forms for A1)</h2>
        <p style={{ margin: 0 }}>Use this table with key verbs: <strong>heißen, wohnen, arbeiten, kommen, sein</strong>.</p>

        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thTdStyle}>Pronoun</th>
                <th style={thTdStyle}>Meaning</th>
                <th style={thTdStyle}>heißen</th>
                <th style={thTdStyle}>wohnen</th>
                <th style={thTdStyle}>arbeiten</th>
                <th style={thTdStyle}>kommen</th>
                <th style={thTdStyle}>sein</th>
              </tr>
            </thead>
            <tbody>
              {pronounRows.map((row) => (
                <tr key={row[0] + row[1]}>
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
        <h2 style={{ margin: 0 }}>4) The three "sie" forms: how to identify them</h2>
        <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
          <li>
            <strong>sie</strong> (lowercase) = <strong>she</strong> (singular): <em>Sie wohnt in Berlin.</em>
          </li>
          <li>
            <strong>sie</strong> (lowercase) = <strong>they</strong> (plural): <em>Sie wohnen in Berlin.</em>
          </li>
          <li>
            <strong>Sie</strong> (capital S) = <strong>you (formal)</strong>: <em>Wo wohnen Sie?</em>
          </li>
        </ul>
        <p style={{ margin: 0 }}>
          Tip: check <strong>verb form</strong> and <strong>context</strong>. <em>sie/Sie wohnen</em> can be “they live” or
          “you (formal) live.”
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>5) Important conjugation patterns</h2>
        <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
          <li>
            <strong>wir</strong> and <strong>sie/Sie</strong> mostly use the same form as the infinitive:
            <em> wir wohnen, sie wohnen, Sie wohnen</em>.
          </li>
          <li>
            <strong>ihr</strong> means <strong>you guys</strong> and mostly ends in <strong>-t</strong>:
            <em> ihr wohnt, ihr arbeitet, ihr kommt, ihr heißt</em> (and irregular: <em>ihr seid</em>).
          </li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>6) Final knowledge test</h2>
        <div style={quizStyle}>
          <p style={{ margin: 0 }}>
            <strong>1.</strong> Complete: <em>Wir ___ in Hamburg.</em> (wohnen)
          </p>
          <p style={{ margin: 0 }}>
            <strong>2.</strong> Complete: <em>Ihr ___ aus Ghana.</em> (kommen)
          </p>
          <p style={{ margin: 0 }}>
            <strong>3.</strong> Is this “she,” “they,” or “formal you”? <em>Sie arbeiten heute.</em>
          </p>
          <p style={{ margin: 0, color: "#475569" }}>
            Answers: 1) <strong>wohnen</strong>, 2) <strong>kommt</strong>, 3) depends on context: <strong>they</strong> or
            <strong> formal you</strong>.
          </p>
        </div>
      </section>
    </main>
  );
};

export default A1Day3Kapitel12GrammarNotesPage;
