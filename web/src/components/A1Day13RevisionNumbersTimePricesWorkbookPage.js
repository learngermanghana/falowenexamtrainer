import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const sectionStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const listStyle = {
  margin: 0,
  paddingLeft: 18,
  lineHeight: 1.7,
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.95rem",
};

const thtdStyle = {
  border: "1px solid #e5e7eb",
  padding: "8px 10px",
  textAlign: "left",
};

const sentencePrompts = [
  "kochen",
  "Freunde treffen",
  "Hausaufgaben machen",
  "fernsehen",
  "lesen",
  "im Park spazieren gehen",
  "zur Schule gehen",
  "arbeiten",
  "Sport treiben",
  "einkaufen gehen",
];

const numberPractice = [56, 248, 1234, 3452, 4560, 5678, 6789, 7890, 9999];

const A1Day13RevisionNumbersTimePricesWorkbookPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button style={styles.secondaryButton} onClick={() => navigate(-1)}>
          ← Back
        </button>

        <section style={sectionStyle}>
          <h1 style={{ ...styles.title, marginBottom: 0 }}>
            A1 · Day 13 Workbook · Revision: Numbers, Time and Prices
          </h1>
          <p style={styles.paragraph}>
            Hello dear students! Today we revise numbers, asking for time, saying years and birthdays,
            asking for prices, and building correct German sentence order.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={styles.subtitle}>1) Number Practice (1–10,000)</h2>
          <p style={styles.paragraph}>Say each number out loud in German.</p>
          <ul style={listStyle}>
            {numberPractice.map((number) => (
              <li key={number}>{number.toLocaleString()}</li>
            ))}
          </ul>
          <p style={styles.paragraph}>
            Examples: <strong>56</strong> = sechsundfünfzig, <strong>248</strong> = zweihundertachtundvierzig,
            <strong>1,234</strong> = eintausendzweihundertvierunddreißig.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={styles.subtitle}>2) Asking for the Time</h2>
          <ul style={listStyle}>
            <li>
              <strong>Wie spät ist es?</strong>
            </li>
            <li>
              <strong>Wie viel Uhr ist es?</strong>
            </li>
          </ul>
          <p style={styles.paragraph}>Example answers:</p>
          <ul style={listStyle}>
            <li>Es ist ein Uhr.</li>
            <li>Es ist drei Uhr.</li>
            <li>Es ist halb vier.</li>
            <li>Es ist Viertel nach zwei.</li>
            <li>Es ist Viertel vor sechs.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={styles.subtitle}>3) Speaking About Years</h2>
          <p style={styles.paragraph}>
            Years between 1000 and 1999 are often spoken with <strong>hundert</strong>. Years from 2000 are read as
            full thousands.
          </p>
          <ul style={listStyle}>
            <li>1453 → vierzehnhundertdreiundfünfzig</li>
            <li>1944 → neunzehnhundertvierundvierzig</li>
            <li>2000 → zweitausend</li>
            <li>2025 → zweitausendfünfundzwanzig</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={styles.subtitle}>4) Birthdate Structure</h2>
          <p style={styles.paragraph}>
            Use: <strong>Ich bin am [date] geboren.</strong>
          </p>
          <ul style={listStyle}>
            <li>Ich bin am zwölften Mai neunzehnhundertfünfundneunzig geboren.</li>
            <li>Ich bin am dritten Juli neunzehnhundertachtzig geboren.</li>
          </ul>
          <p style={styles.paragraph}>
            After <strong>am</strong>, ordinal numbers take dative endings: <strong>-ten</strong> or <strong>-sten</strong>.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={styles.subtitle}>5) Asking and Saying Prices</h2>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thtdStyle}>Object</th>
                <th style={thtdStyle}>German</th>
                <th style={thtdStyle}>Question</th>
                <th style={thtdStyle}>Answer</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={thtdStyle}>Book</td>
                <td style={thtdStyle}>das Buch</td>
                <td style={thtdStyle}>Wie viel kostet das Buch?</td>
                <td style={thtdStyle}>Es kostet zehn Euro.</td>
              </tr>
              <tr>
                <td style={thtdStyle}>Apple</td>
                <td style={thtdStyle}>der Apfel</td>
                <td style={thtdStyle}>Wie viel kostet der Apfel?</td>
                <td style={thtdStyle}>Er kostet zwei Euro.</td>
              </tr>
              <tr>
                <td style={thtdStyle}>Banana</td>
                <td style={thtdStyle}>die Banane</td>
                <td style={thtdStyle}>Wie viel kostet die Banane?</td>
                <td style={thtdStyle}>Sie kostet einen Euro.</td>
              </tr>
            </tbody>
          </table>
          <ul style={listStyle}>
            <li>
              <strong>kostet</strong> = one item
            </li>
            <li>
              <strong>kosten</strong> = multiple items
            </li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={styles.subtitle}>6) Sentence Order Practice</h2>
          <p style={styles.paragraph}>Use one of these structures only:</p>
          <ol style={listStyle}>
            <li>Subject + Verb + Time + Other Elements</li>
            <li>Time + Verb + Subject + Other Elements</li>
          </ol>
          <p style={styles.paragraph}>
            Days: Montag, Dienstag, Mittwoch, Donnerstag, Freitag, Samstag, Sonntag.
          </p>
          <p style={styles.paragraph}>Activities to use:</p>
          <ul style={listStyle}>
            {sentencePrompts.map((prompt) => (
              <li key={prompt}>{prompt}</li>
            ))}
          </ul>
          <p style={styles.paragraph}>
            Example 1: <strong>Ich gehe am Montag zur Schule.</strong>
            <br />
            Example 2: <strong>Am Dienstag treibe ich Sport.</strong>
          </p>
        </section>
      </div>
    </div>
  );
};

export default A1Day13RevisionNumbersTimePricesWorkbookPage;
