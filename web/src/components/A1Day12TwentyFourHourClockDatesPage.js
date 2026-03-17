import React from "react";
import { styles } from "../styles";

const pageWrap = {
  ...styles.container,
  display: "grid",
  gap: 16,
};

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const listStyle = {
  margin: 0,
  paddingLeft: 20,
  lineHeight: 1.7,
};

const paragraph = {
  margin: 0,
  lineHeight: 1.7,
};

const tableCell = {
  textAlign: "left",
  padding: 8,
  borderBottom: "1px solid #e5e7eb",
  verticalAlign: "top",
};

const pdfLink = "https://drive.google.com/file/d/1fW2ChjnDKW_5SEr65ZgE1ylJy1To46_p/view?usp=sharing";

export default function A1Day12TwentyFourHourClockDatesPage() {
  return (
    <main style={pageWrap}>
      <section style={card}>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>A1 · The 24 Hour Clock and Dates</h1>
        <p style={paragraph}>
          In German, the 24-hour clock is used in formal contexts like timetables and schedules. It avoids
          AM/PM confusion and makes time communication clear.
        </p>
        <a href={pdfLink} target="_blank" rel="noreferrer" style={{ fontWeight: 700 }}>
          Open grammar notes PDF
        </a>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>1) The 24-Hour Clock (24-Stunden-System)</h2>
        <ul style={listStyle}>
          <li>00:00 — Mitternacht (null Uhr)</li>
          <li>01:00 — ein Uhr</li>
          <li>12:00 — Mittag</li>
          <li>13:00 — dreizehn Uhr (1 PM)</li>
          <li>20:00 — zwanzig Uhr (8 PM)</li>
        </ul>
        <p style={paragraph}>
          Usually, say the hour + <strong>Uhr</strong>, then minutes.
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={tableCell}>Time</th>
              <th style={tableCell}>German</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tableCell}>08:00</td>
              <td style={tableCell}>acht Uhr</td>
            </tr>
            <tr>
              <td style={tableCell}>15:30</td>
              <td style={tableCell}>fünfzehn Uhr dreißig</td>
            </tr>
            <tr>
              <td style={tableCell}>19:45</td>
              <td style={tableCell}>neunzehn Uhr fünfundvierzig</td>
            </tr>
            <tr>
              <td style={tableCell}>14:20</td>
              <td style={tableCell}>vierzehn Uhr zwanzig</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>2) Half / Quarter / vor / nach</h2>
        <ul style={listStyle}>
          <li>07:30 — sieben Uhr dreißig / halb acht</li>
          <li>09:15 — neun Uhr fünfzehn / viertel nach neun</li>
          <li>09:45 — neun Uhr fünfundvierzig / viertel vor zehn</li>
          <li>01:05 — fünf nach eins</li>
          <li>01:25 — fünf vor halb zwei</li>
          <li>01:35 — fünf nach halb zwei</li>
          <li>01:50 — zehn vor zwei</li>
        </ul>
        <p style={paragraph}>
          <strong>Halb zwei</strong> means 1:30 (half to two), not 2:30.
        </p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>3) Days and Months</h2>
        <p style={paragraph}>
          <strong>Wochentage:</strong> Montag, Dienstag, Mittwoch, Donnerstag, Freitag, Samstag, Sonntag.
        </p>
        <p style={paragraph}>
          <strong>Monate:</strong> Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober,
          November, Dezember.
        </p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>4) Dates in German</h2>
        <p style={paragraph}>
          Dates are written as <strong>day.month.year</strong> (for example: 05.03.2023).
        </p>
        <p style={paragraph}>
          For ordinal numbers: from 1–19 add <strong>-te</strong>, from 20+ add <strong>-ste</strong>.
        </p>
        <ul style={listStyle}>
          <li>erste, zweite, dritte, vierte, fünfte ... neunzehnte</li>
          <li>zwanzigste, einundzwanzigste ... einunddreißigste</li>
        </ul>
        <p style={paragraph}>
          Examples: <em>Heute ist der dritte April.</em> / <em>Mein Geburtstag ist der fünfte Mai.</em>
        </p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>Practice Sentences</h2>
        <ol style={listStyle}>
          <li>Heute ist der erste Januar.</li>
          <li>Mein Geburtstag ist der zehnte Februar.</li>
          <li>Weihnachten ist der fünfundzwanzigste Dezember.</li>
          <li>Der Nationalfeiertag ist der dritte Oktober.</li>
        </ol>
      </section>
    </main>
  );
}
