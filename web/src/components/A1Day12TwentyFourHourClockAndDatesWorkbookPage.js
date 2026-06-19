import React from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import CoursebookAudioPlayer from "./CoursebookAudioPlayer";

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionTitle = {
  margin: 0,
  fontSize: "1.1rem",
};

const paragraph = {
  margin: 0,
  lineHeight: 1.7,
};

const listStyle = {
  margin: 0,
  paddingLeft: 20,
  lineHeight: 1.7,
};

const questionBlock = {
  display: "grid",
  gap: 6,
  padding: "10px 12px",
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  background: "#fff",
};

const horenLink = "https://drive.google.com/file/d/1CaSUhSWFlX1P8BT3BP22aGGy3Sl1R6BO/view?usp=sharing";
const teil1HeroImage = "https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=1600&q=80";
const teil2HeroImage = "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1600&q=80";
const teil3HeroImage = "https://images.unsplash.com/photo-1495364141860-b0d03eccd065?auto=format&fit=crop&w=1600&q=80";

const teil1Questions = [
  {
    stem: "1. Was bedeutet es, wenn es 14:00 Uhr ist?",
    options: ["A) Zwei Uhr morgens", "B) Zwei Uhr nachmittags", "C) Vier Uhr nachmittags", "D) Acht Uhr abends"],
  },
  {
    stem: "2. Wie viele Tage hat der Februar in einem Schaltjahr?",
    options: ["A) 28 Tage", "B) 29 Tage", "C) 30 Tage", "D) 31 Tage"],
  },
  {
    stem: "3. Welcher Monat kommt nach März?",
    options: ["A) Januar", "B) April", "C) Mai", "D) Juni"],
  },
  {
    stem: "4. Wie schreibt man das Datum \"dritter Februar 2024\" in Deutschland?",
    options: ["A) 03/02/2024", "B) 2024.02.03", "C) 03.02.2024", "D) 02.03.2024"],
  },
  {
    stem: "5. Welcher Tag der Woche ist heute?",
    options: ["A) Montag", "B) Dienstag", "C) Mittwoch", "D) Donnerstag"],
  },
];

const teil2Questions = [
  "1. Der Text sagt, dass der Februar immer 28 Tage hat. (Richtig/Falsch)",
  "2. Wenn es 16:00 Uhr ist, bedeutet das vier Uhr nachmittags. (Richtig/Falsch)",
  "3. Heute ist Montag. (Richtig/Falsch)",
  "4. In Deutschland wird das Datum als Monat.Tag.Jahr geschrieben. (Richtig/Falsch)",
  "5. Der fünfte April wird als 05.04 geschrieben. (Richtig/Falsch)",
];

const horenQuestions = [
  {
    stem: "1. Wann beginnt der Tag in der 24-Stunden-Uhr in Deutschland?",
    options: ["A) Um 6 Uhr", "B) Um Mitternacht", "C) Um 12 Uhr", "D) Um 18 Uhr"],
  },
  {
    stem: "2. Was bedeutet 16:00 Uhr in der 24-Stunden-Uhr?",
    options: ["A) Vier Uhr morgens", "B) Vier Uhr nachmittags", "C) Sechs Uhr abends", "D) Zwei Uhr nachts"],
  },
  {
    stem: "3. Wie viele Tage hat der Februar normalerweise?",
    options: ["A) 30 Tage", "B) 31 Tage", "C) 28 Tage", "D) 29 Tage"],
  },
  {
    stem: "4. Wie wird das Datum in Deutschland geschrieben?",
    options: ["A) Monat.Tag.Jahr", "B) Tag.Monat.Jahr", "C) Jahr.Monat.Tag", "D) Monat.Jahr.Tag"],
  },
  {
    stem: "5. Welcher Tag ist heute laut dem Text?",
    options: ["A) Dienstag", "B) Mittwoch", "C) Freitag", "D) Montag"],
  },
];

const A1Day12TwentyFourHourClockAndDatesWorkbookPage = () => {

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <section style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <h1 style={{ ...styles.title, marginBottom: 0 }}>A1 · Day 12 Workbook · The 24 Hour Clock and Dates</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 8</p>
        <p style={paragraph}>
          Complete each Teil below and submit your final answers in the submission area, not directly on this page.
        </p>
      </section>

      <section style={card}>
        <img
          src={teil1HeroImage}
          alt="Analog wall clock beside a monthly calendar"
          loading="lazy"
          style={{ width: "100%", borderRadius: 10, maxHeight: 300, objectFit: "cover" }}
        />
        <h2 style={sectionTitle}>Teil 1: Lesen (Multiple Choice)</h2>
        <p style={paragraph}>
          Heute ist der dritte Februar. In Deutschland benutzen wir oft die 24-Stunden-Uhr. Das bedeutet, dass der Tag
          um Mitternacht bei null Uhr beginnt und bis 23:59 Uhr dauert. Zum Beispiel, wenn es 14:00 Uhr ist, bedeutet
          das, dass es zwei Uhr nachmittags ist. Wenn es 20:00 Uhr ist, dann ist es acht Uhr abends.
        </p>
        <p style={paragraph}>
          Die Monate des Jahres sind Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober,
          November und Dezember. Der Februar hat normalerweise 28 Tage, aber in einem Schaltjahr hat er 29 Tage.
        </p>
        <p style={paragraph}>
          Die Wochentage sind Montag, Dienstag, Mittwoch, Donnerstag, Freitag, Samstag und Sonntag. Heute ist Mittwoch.
          Das Datum wird in Deutschland als Tag.Monat.Jahr geschrieben. Also, der dritte Februar 2024 wird als
          03.02.2024 geschrieben.
        </p>
        <p style={paragraph}>Jetzt möchte ich, dass ihr ein paar Fragen beantwortet.</p>

        {teil1Questions.map((question) => (
          <div key={question.stem} style={questionBlock}>
            <p style={{ ...paragraph, fontWeight: 700 }}>{question.stem}</p>
            {question.options.map((option) => (
              <p key={option} style={paragraph}>{option}</p>
            ))}
          </div>
        ))}
      </section>

      <section style={card}>
        <img
          src={teil2HeroImage}
          alt="Analog wall clock beside a monthly calendar"
          loading="lazy"
          style={{ width: "100%", borderRadius: 10, maxHeight: 300, objectFit: "cover" }}
        />
        <h2 style={sectionTitle}>Teil 2: Lesen (Richtig/Falsch)</h2>
        <p style={paragraph}>
          Heute ist der fünfte April. In Deutschland benutzen wir oft die 24-Stunden-Uhr. Das bedeutet, dass der Tag um
          Mitternacht bei null Uhr beginnt und bis 23:59 Uhr dauert. Zum Beispiel, wenn es 16:00 Uhr ist, bedeutet das,
          dass es vier Uhr nachmittags ist. Wenn es 21:00 Uhr ist, dann ist es neun Uhr abends.
        </p>
        <p style={paragraph}>
          Die Monate des Jahres sind Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober,
          November und Dezember. Der Februar hat normalerweise 28 Tage, aber in einem Schaltjahr hat er 29 Tage.
        </p>
        <p style={paragraph}>
          Die Wochentage sind Montag, Dienstag, Mittwoch, Donnerstag, Freitag, Samstag und Sonntag. Heute ist Montag.
          Das Datum wird in Deutschland als Tag.Monat.Jahr geschrieben. Also, der fünfte April 2024 wird als
          05.04.2024 geschrieben.
        </p>
        <ol style={listStyle}>
          {teil2Questions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ol>
      </section>

      <section style={card}>
        <img
          src={teil3HeroImage}
          alt="Analog wall clock beside a monthly calendar"
          loading="lazy"
          style={{ width: "100%", borderRadius: 10, maxHeight: 300, objectFit: "cover" }}
        />
        <h2 style={sectionTitle}>Teil 3: Hörverstehen</h2>
        <p style={paragraph}>
          Hören Thema: 24-Stunden-Uhr und Daten. Use the in-app player first. If playback fails, open the Google Drive
          link directly.
        </p>
        <CoursebookAudioPlayer url={horenLink} linkLabel="Open Hören Audio in Google Drive" />
        {horenQuestions.map((question) => (
          <div key={question.stem} style={questionBlock}>
            <p style={{ ...paragraph, fontWeight: 700 }}>{question.stem}</p>
            {question.options.map((option) => (
              <p key={option} style={paragraph}>{option}</p>
            ))}
          </div>
        ))}
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Teil 4: Vocabulary Notes</h2>
        <p style={paragraph}>
          Focus words: Mitternacht, null Uhr, vierzehn Uhr, sechzehn Uhr, Tag, Monat, Jahr, Datum, Schaltjahr,
          Montag-Sonntag, Januar-Dezember.
        </p>
        <p style={paragraph}>
          Useful date forms: der dritte (3.), der fünfte (5.), der zehnte (10.), der einunddreißigste (31.).
        </p>
      </section>

      <section style={{ ...card, border: "1px solid #c7d2fe", background: "#eef2ff" }}>
        <h2 style={sectionTitle}>Final Submission</h2>
        <p style={paragraph}>
          After completing all parts, submit your answers in the submission area only (not on this page).
        </p>
        <a
          href="/campus/course?submitWork=1"
          target="_blank"
          rel="noreferrer"
          style={{ ...styles.button, width: "fit-content", textDecoration: "none" }}
        >
          Go to Submission Area
        </a>
      </section>
    </main>
  );
};

export default A1Day12TwentyFourHourClockAndDatesWorkbookPage;
