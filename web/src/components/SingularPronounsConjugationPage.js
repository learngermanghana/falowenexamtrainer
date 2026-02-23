import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const sectionStyle = { ...styles.card, display: "grid", gap: 10 };
const tableCellStyle = { border: "1px solid #d1d5db", padding: 8, verticalAlign: "top" };

const SingularPronounsConjugationPage = () => {
  const navigate = useNavigate();

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Singular Pronouns and Verb Conjugation in German</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Day 2 Grammar Note: Alphabets and Personal Pronouns</p>
      </header>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Why conjugation matters</h2>
        <p style={{ margin: 0 }}>
          Verb conjugation means changing a verb to match the subject pronoun. In German, this keeps the sentence clear,
          correct, and polite.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Regular verb endings (singular pronouns)</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 520 }}>
            <thead>
              <tr>
                <th style={tableCellStyle}>Pronoun</th>
                <th style={tableCellStyle}>Ending</th>
                <th style={tableCellStyle}>Example (kommen)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tableCellStyle}><strong>ich</strong> (I)</td>
                <td style={tableCellStyle}>-e</td>
                <td style={tableCellStyle}>ich komme</td>
              </tr>
              <tr>
                <td style={tableCellStyle}><strong>du</strong> (you, informal)</td>
                <td style={tableCellStyle}>-st</td>
                <td style={tableCellStyle}>du kommst</td>
              </tr>
              <tr>
                <td style={tableCellStyle}><strong>er/sie/es</strong> (he/she/it)</td>
                <td style={tableCellStyle}>-t</td>
                <td style={tableCellStyle}>er kommt</td>
              </tr>
              <tr>
                <td style={tableCellStyle}><strong>Sie</strong> (you, formal)</td>
                <td style={tableCellStyle}>-en</td>
                <td style={tableCellStyle}>Sie kommen</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Core singular pronouns</h2>
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 4 }}>
          <li>ich (I)</li>
          <li>du (you - informal)</li>
          <li>er/sie/es (he/she/it)</li>
          <li>Sie (you - formal)</li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Conjugation examples</h2>
        <p style={{ margin: 0 }}><strong>heißen</strong> (to be called): ich heiße, du heißt, er/sie/es heißt, Sie heißen.</p>
        <p style={{ margin: 0 }}><strong>kommen</strong> (to come): ich komme, du kommst, er/sie/es kommt, Sie kommen.</p>
        <p style={{ margin: 0 }}><strong>wohnen</strong> (to live): ich wohne, du wohnst, er/sie/es wohnt, Sie wohnen.</p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Usage notes</h2>
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 4 }}>
          <li>Use <strong>du</strong> for friends, family, and peers (informal).</li>
          <li>Use <strong>Sie</strong> for strangers, superiors, and professional settings (formal).</li>
          <li><strong>Sie</strong> is always capitalized.</li>
          <li>The verb is usually in the second position in a sentence.</li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Quick practice (multiple choice)</h2>
        <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 10 }}>
          <li>
            Ich ___ aus Deutschland.
            <div>A) kommst &nbsp; B) komme &nbsp; C) kommt</div>
          </li>
          <li>
            Du ___ in Berlin.
            <div>A) wohnst &nbsp; B) wohne &nbsp; C) wohnt</div>
          </li>
          <li>
            Er ___ Max.
            <div>A) heißen &nbsp; B) heißt &nbsp; C) heiße</div>
          </li>
          <li>
            Wie ___ Sie?
            <div>A) heißen &nbsp; B) heißt &nbsp; C) heiße</div>
          </li>
        </ol>
        <p style={{ margin: 0, fontWeight: 700 }}>Answers: 1-B, 2-A, 3-B, 4-A</p>
      </section>
    </main>
  );
};

export default memo(SingularPronounsConjugationPage);
