import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const sectionStyle = { ...styles.card, display: "grid", gap: 10 };
const tableCell = { border: "1px solid #d1d5db", padding: 8, verticalAlign: "top" };
const quizPromptStyle = {
  margin: 0,
  padding: "10px 12px",
  border: "1px dashed #9ca3af",
  borderRadius: 8,
  background: "#f9fafb",
};

const numbersOneToTwenty = [
  ["0", "Null", "nuu"],
  ["1", "Eins", "ains"],
  ["2", "Zwei", "tsvay"],
  ["3", "Drei", "dry"],
  ["4", "Vier", "feer"],
  ["5", "Fünf", "fuenf"],
  ["6", "Sechs", "zex"],
  ["7", "Sieben", "zee-ben"],
  ["8", "Acht", "ahkt"],
  ["9", "Neun", "noyn"],
  ["10", "Zehn", "tsayn"],
  ["11", "Elf", "elf"],
  ["12", "Zwölf", "tsvurf"],
  ["13", "Dreizehn", "dry-tsayn"],
  ["14", "Vierzehn", "feer-tsayn"],
  ["15", "Fünfzehn", "fuenf-tsayn"],
  ["16", "Sechzehn", "zex-tsayn"],
  ["17", "Siebzehn", "zeeb-tsayn"],
  ["18", "Achtzehn", "ahkt-tsayn"],
  ["19", "Neunzehn", "noyn-tsayn"],
  ["20", "Zwanzig", "tsvan-tsig"],
];

const GermanNumbersGrammarPage = () => {
  const navigate = useNavigate();

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>Back to Course</button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>German Numbers 1-10 with Pronunciation</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 2 • Assignment: German Numbers</p>
      </header>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Goal</h2>
        <p style={{ margin: 0 }}>Learn numbers from 1 to 10,000 and understand the difference between <strong>in</strong> (city) and <strong>in der</strong> (street) with <em>wohnen</em>.</p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>German Numbers 0-20</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 420 }}>
            <thead>
              <tr>
                <th style={tableCell}>Number</th>
                <th style={tableCell}>German</th>
                <th style={tableCell}>Pronunciation</th>
              </tr>
            </thead>
            <tbody>
              {numbersOneToTwenty.map(([num, word, pronunciation]) => (
                <tr key={num}>
                  <td style={tableCell}>{num}</td>
                  <td style={tableCell}><strong>{word}</strong></td>
                  <td style={tableCell}>{pronunciation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={quizPromptStyle}><strong>Quick test (1-10):</strong> Guess the German word for <strong>8</strong>.</p>
        <details>
          <summary>Show answer</summary>
          <p style={{ marginBottom: 0 }}><strong>8 = acht</strong> (pronounced <em>ahkt</em>).</p>
        </details>
        <p style={{ margin: 0 }}>
          After this 1-10 lesson, go to the <strong>Class members</strong> page from the course area and add your phone number to your bio. Use this sentence starter:
          {" "}<strong>Meine Telefonnummer ist ...</strong>. Open: {" "}
          <a href="https://www.falowen.app/campus/course">https://www.falowen.app/campus/course</a>.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Notes on 13-19</h2>
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>Usually: single digit + <strong>zehn</strong> (e.g., <strong>dreizehn</strong>, <strong>vierzehn</strong>, <strong>fünfzehn</strong>).</li>
          <li><strong>Sechzehn (16)</strong>: not <em>sechszehn</em>; the final <em>s</em> is dropped.</li>
          <li><strong>Siebzehn (17)</strong>: not <em>siebenzehn</em>; <em>en</em> is dropped.</li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Numbers 21-100</h2>
        <p style={{ margin: 0 }}>
          Build 21-99 with <strong>unit + und + tens</strong>.
          Example: <strong>einundzwanzig</strong> (21), <strong>dreiundvierzig</strong> (43), <strong>neunundneunzig</strong> (99).
        </p>
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 4 }}>
          <li>30: Dreißig</li>
          <li>40: Vierzig</li>
          <li>50: Fünfzig</li>
          <li>60: Sechzig</li>
          <li>70: Siebzig</li>
          <li>80: Achtzig</li>
          <li>90: Neunzig</li>
          <li>100: Hundert</li>
        </ul>
        <p style={quizPromptStyle}><strong>Quick test (21-100):</strong> Guess the German word for <strong>47</strong>.</p>
        <details>
          <summary>Show answer</summary>
          <p style={{ marginBottom: 0 }}><strong>47 = siebenundvierzig</strong>.</p>
        </details>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Use of “in” and “in der” with wohnen</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 520 }}>
            <thead>
              <tr>
                <th style={tableCell}>Context</th>
                <th style={tableCell}>Pattern</th>
                <th style={tableCell}>Example</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tableCell}>Living in a city</td>
                <td style={tableCell}><strong>in</strong> + city name</td>
                <td style={tableCell}><em>Ich wohne in Berlin.</em></td>
              </tr>
              <tr>
                <td style={tableCell}>Living on a street</td>
                <td style={tableCell}><strong>in der</strong> + street name</td>
                <td style={tableCell}><em>Ich wohne in der Hauptstraße.</em></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Numbers 100-1000</h2>
        <p style={{ margin: 0 }}>Hundreds are formed as one word: <strong>zweihundert</strong>, <strong>dreihundert</strong>, <strong>fünfhundert</strong>, etc.</p>
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 4 }}>
          <li>101: Einhunderteins</li>
          <li>209: Zweihundertneun</li>
          <li>315: Dreihundertfünfzehn</li>
          <li>551: Fünfhunderteinundfünfzig</li>
          <li>777: Siebenhundertsiebenundsiebzig</li>
          <li>1000: Tausend</li>
        </ul>
        <p style={quizPromptStyle}><strong>Quick test (100-1000):</strong> Guess the German word for <strong>642</strong>.</p>
        <details>
          <summary>Show answer</summary>
          <p style={{ marginBottom: 0 }}><strong>642 = sechshundertzweiundvierzig</strong>.</p>
        </details>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Numbers 1000-10000</h2>
        <p style={{ margin: 0 }}>Build numbers as: <strong>thousands + hundreds + tens/ones</strong>.</p>
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 4 }}>
          <li>2000: Zweitausend</li>
          <li>3015: Dreitausendfünfzehn</li>
          <li>5551: Fünftausendfünfhunderteinundfünfzig</li>
          <li>7867: Siebentausendachthundertsiebenundsechzig</li>
          <li>10000: Zehntausend</li>
        </ul>
        <p style={quizPromptStyle}><strong>Quick test (1000-10000):</strong> Guess the German word for <strong>4,326</strong>.</p>
        <details>
          <summary>Show answer</summary>
          <p style={{ marginBottom: 0 }}><strong>4,326 = viertausenddreihundertsechsundzwanzig</strong>.</p>
        </details>
      </section>
    </main>
  );
};

export default GermanNumbersGrammarPage;
