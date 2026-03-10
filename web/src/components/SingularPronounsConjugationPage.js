import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const sectionStyle = { ...styles.card, display: "grid", gap: 10 };

const tableCellStyle = {
  border: "1px solid #d1d5db",
  padding: 8,
  verticalAlign: "top",
};

const listStyle = {
  margin: 0,
  paddingLeft: 20,
  display: "grid",
  gap: 6,
};

const exampleBoxStyle = {
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 8,
};

const imageStyle = {
  width: "100%",
  maxHeight: 340,
  objectFit: "cover",
  borderRadius: 16,
  border: "1px solid #e5e7eb",
  marginTop: 8,
};

const captionStyle = {
  margin: 0,
  fontSize: 14,
  color: "#6b7280",
};

const conjugationRows = [
  ["ich", "heiße", "komme", "habe", "arbeite", "bin"],
  ["du", "heißt", "kommst", "hast", "arbeitest", "bist"],
  ["er/sie/es", "heißt", "kommt", "hat", "arbeitet", "ist"],
  ["wir", "heißen", "kommen", "haben", "arbeiten", "sind"],
  ["ihr", "heißt", "kommt", "habt", "arbeitet", "seid"],
  ["sie/Sie", "heißen", "kommen", "haben", "arbeiten", "sind"],
];

const pronouns = [
  "ich (I)",
  "du (you, informal singular)",
  "er (he)",
  "sie (she)",
  "es (it)",
  "wir (we)",
  "ihr (you, informal plural)",
  "sie (they)",
  "Sie (you, formal)",
];

const SingularPronounsConjugationPage = () => {
  const navigate = useNavigate();

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          Day 3: Reviewing Pronouns and Verb Conjugation + Introducing Yourself and Reviewing Pronouns
        </h1>

        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter: 1.1 &amp; Kapitel 1.2</p>

        <img
          src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80"
          alt="Students learning in a classroom"
          style={imageStyle}
        />

        <p style={captionStyle}>German learning and classroom study</p>
      </header>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Grammar Note: Difference Between "wo" and "woher"</h2>
        <div style={exampleBoxStyle}>
          <p style={{ margin: 0 }}>
            <strong>Wo</strong> means <strong>where</strong> and asks about location.
          </p>
          <ul style={listStyle}>
            <li>Wo bist du? (Where are you?)</li>
            <li>Wo ist das Buch? (Where is the book?)</li>
            <li>Wo wohnst du? (Where do you live?)</li>
            <li>Wo ist der Bahnhof? (Where is the train station?)</li>
          </ul>
        </div>
        <div style={exampleBoxStyle}>
          <p style={{ margin: 0 }}>
            <strong>Woher</strong> means <strong>from where</strong> and asks about origin.
          </p>
          <ul style={listStyle}>
            <li>Woher kommst du? (Where do you come from?)</li>
            <li>Woher kommt das? (Where does that come from?)</li>
            <li>Woher bist du? (Where are you from?)</li>
            <li>Woher kommt er? (Where does he come from?)</li>
          </ul>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Notes About Pronouns in German</h2>
        <p style={{ margin: 0 }}>
          In German, pronouns replace nouns in a sentence. In the nominative case (subject), the basic
          personal pronouns are:
        </p>
        <ul style={listStyle}>
          {pronouns.map((pronoun) => (
            <li key={pronoun}>{pronoun}</li>
          ))}
        </ul>
        <p style={{ margin: 0 }}>
          Important: <strong>du</strong> (informal singular), <strong>ihr</strong> (informal plural), and <strong>Sie</strong>{" "}
          (formal) all mean "you" in different contexts.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>
          Grammar Note: Regular Verbs "heißen," "kommen," "haben," "arbeiten" and Irregular Verb "sein"
        </h2>

        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 760 }}>
            <thead>
              <tr>
                <th style={tableCellStyle}>Pronoun</th>
                <th style={tableCellStyle}>heißen</th>
                <th style={tableCellStyle}>kommen</th>
                <th style={tableCellStyle}>haben</th>
                <th style={tableCellStyle}>arbeiten</th>
                <th style={tableCellStyle}>sein (irregular)</th>
              </tr>
            </thead>
            <tbody>
              {conjugationRows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => (
                    <td key={`${row[0]}-${cell}`} style={tableCellStyle}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={exampleBoxStyle}>
          <strong>Examples</strong>
          <ul style={listStyle}>
            <li>Ich heiße Felix. (I am called Felix.)</li>
            <li>Ich komme aus Deutschland. (I come from Germany.)</li>
            <li>Ich habe ein Buch. (I have a book.)</li>
            <li>Ich arbeite als Lehrer. (I work as a teacher.)</li>
            <li>Ich bin glücklich. (I am happy.)</li>
          </ul>
        </div>

        <ul style={listStyle}>
          <li>Regular verbs follow predictable endings in the present tense.</li>
          <li>
            <strong>sein</strong> is irregular and must be memorized.
          </li>
          <li>Verb endings change depending on the subject pronoun.</li>
        </ul>
      </section>
    </main>
  );
};

export default memo(SingularPronounsConjugationPage);
