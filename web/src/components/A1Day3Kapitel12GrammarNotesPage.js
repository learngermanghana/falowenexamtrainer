import React from "react";
import AppBackButton from "./navigation/AppBackButton";

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

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 10 }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          A1 · Day 3 · Kapitel 1.2 · Personal Pronouns + Introducing Yourself · Grammar Notes
        </h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Day 3 focus: Personal Pronouns and Verb Conjugation + Introducing Yourself (Kapitel 1.2).
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
        <h2 style={{ margin: 0 }}>3) Real A1-friendly notes (with English)</h2>
        <div style={noteStyle}>
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
            <li>
              <strong>sie</strong> and <strong>Sie</strong> are different: <em>sie</em> = she/they,
              <em> Sie</em> = formal you.
            </li>
            <li>
              <strong>Sie</strong> is always capitalized because it means formal <em>you</em>.
            </li>
            <li>
              <strong>ihr</strong> means <em>you guys</em> in English (informal plural), and it usually
              takes the verb ending <strong>-t</strong>: <em>ihr lernt</em>, <em>ihr macht</em>,
              <em> ihr kommt</em>.
            </li>
            <li>
              Easy memory tip: <strong>du = -st</strong>, <strong>er/sie/es = -t</strong>,
              <strong> wir/sie/Sie = -en</strong>, <strong>ihr = -t</strong>.
            </li>
          </ul>
        </div>
      </section>
      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>4) Introducing yourself (Kapitel 1.2)</h2>
        <div style={noteStyle}>
          <p style={{ margin: 0 }}><strong>Useful patterns:</strong> Ich heiße ..., Ich bin ..., Ich komme aus ..., Ich wohne in ... .</p>
          <p style={{ margin: "8px 0 0 0" }}>
            Example: <em>Hallo! Ich heiße Ama. Ich bin Studentin. Ich komme aus Ghana und ich wohne in Berlin.</em>
          </p>
        </div>
      </section>

    </main>
  );
};

export default A1Day3Kapitel12GrammarNotesPage;
