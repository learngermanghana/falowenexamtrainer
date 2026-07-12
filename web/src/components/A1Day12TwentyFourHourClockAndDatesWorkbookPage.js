import React from "react";
import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell";

import { styles } from "../styles";

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

const questionBlock = {
  display: "grid",
  gap: 6,
  padding: "10px 12px",
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  background: "#fff",
};

const trueFalseQuestionBlock = {
  display: "grid",
  gap: 10,
  padding: "14px",
  border: "1px solid #bfdbfe",
  borderRadius: 12,
  background: "#f8fbff",
};

const trueFalseNumber = {
  alignItems: "center",
  background: "#2563eb",
  borderRadius: "999px",
  color: "#ffffff",
  display: "inline-flex",
  flex: "0 0 34px",
  fontSize: 14,
  fontWeight: 900,
  height: 34,
  justifyContent: "center",
  width: 34,
};

const trueFalseAnswerPrompt = {
  background: "#ffffff",
  border: "1px dashed #93c5fd",
  borderRadius: 10,
  color: "#1e3a8a",
  fontSize: 14,
  fontWeight: 800,
  margin: 0,
  padding: "9px 12px",
};

const videoWrapper = {
  position: "relative",
  width: "100%",
  paddingTop: "56.25%",
  overflow: "hidden",
  borderRadius: 12,
  background: "#000",
};

const videoFrame = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  border: 0,
};

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
  "Der Text sagt, dass der Februar immer 28 Tage hat.",
  "Wenn es 16:00 Uhr ist, bedeutet das vier Uhr nachmittags.",
  "Heute ist Montag.",
  "In Deutschland wird das Datum als Monat.Tag.Jahr geschrieben.",
  "Der fünfte April wird als 05.04 geschrieben.",
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
    <A1TutorMarkedWorkbookShell
      day={12}
      chapter="8"
      fallbackAssignmentKey="A1-8"
      title="A1 · Day 12 Workbook · The 24 Hour Clock and Dates"
      subtitle="Chapter 8 · Tutor-marked assignment"
      submitTitle="Submit A1 · Day 12 · Chapter 8"
    >
      <section style={card}>
        <img
          src={teil1HeroImage}
          alt="Analog wall clock beside a monthly calendar"
          loading="lazy"
          style={{ width: "100%", borderRadius: 10, maxHeight: 300, objectFit: "cover" }}
        />
        <h2 style={sectionTitle}>Teil 1: Lesen (Multiple Choice)</h2>
        <p style={paragraph}>
          Heute ist der dritte Februar. In Deutschland benutzen wir oft die 24-Stunden-Uhr. Das bedeutet, dass der Tag um
          Mitternacht bei null Uhr beginnt und bis 23:59 Uhr dauert. Zum Beispiel, wenn es 14:00 Uhr ist, bedeutet das,
          dass es zwei Uhr nachmittags ist. Wenn es 20:00 Uhr ist, dann ist es acht Uhr abends.
        </p>
        <p style={paragraph}>
          Die Monate des Jahres sind Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober, November
          und Dezember. Der Februar hat normalerweise 28 Tage, aber in einem Schaltjahr hat er 29 Tage.
        </p>
        <p style={paragraph}>
          Die Wochentage sind Montag, Dienstag, Mittwoch, Donnerstag, Freitag, Samstag und Sonntag. Heute ist Mittwoch. Das
          Datum wird in Deutschland als Tag.Monat.Jahr geschrieben. Also, der dritte Februar 2024 wird als 03.02.2024 geschrieben.
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
          Die Monate des Jahres sind Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober, November
          und Dezember. Der Februar hat normalerweise 28 Tage, aber in einem Schaltjahr hat er 29 Tage.
        </p>
        <p style={paragraph}>
          Die Wochentage sind Montag, Dienstag, Mittwoch, Donnerstag, Freitag, Samstag und Sonntag. Heute ist Montag. Das
          Datum wird in Deutschland als Tag.Monat.Jahr geschrieben. Also, der fünfte April 2024 wird als 05.04.2024 geschrieben.
        </p>

        <div
          style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: 12,
            color: "#1e3a8a",
            fontWeight: 700,
            lineHeight: 1.6,
            padding: "11px 13px",
          }}
        >
          Lies jede Aussage. Schreibe im Submit-Tab für jede Nummer entweder <strong>Richtig</strong> oder <strong>Falsch</strong>.
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          {teil2Questions.map((question, index) => (
            <div key={question} style={trueFalseQuestionBlock}>
              <div style={{ alignItems: "flex-start", display: "flex", gap: 12 }}>
                <span aria-hidden="true" style={trueFalseNumber}>{index + 1}</span>
                <p style={{ ...paragraph, flex: 1, fontWeight: 750, paddingTop: 3 }}>{question}</p>
              </div>
              <p style={trueFalseAnswerPrompt}>Antwort: Richtig oder Falsch</p>
            </div>
          ))}
        </div>
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
          Hören Thema: 24-Stunden-Uhr und Daten. Sehen und hören Sie das Video. Beantworten Sie danach die Fragen.
        </p>
        <div style={videoWrapper}>
          <iframe
            src="https://www.youtube-nocookie.com/embed/vm22NeVPFNA"
            title="A1 Day 12 Hörverstehen – 24-Stunden-Uhr und Daten"
            style={videoFrame}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
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
          Focus words: Mitternacht, null Uhr, vierzehn Uhr, sechzehn Uhr, Tag, Monat, Jahr, Datum, Schaltjahr, Montag-Sonntag,
          Januar-Dezember.
        </p>
        <p style={paragraph}>
          Useful date forms: der dritte (3.), der fünfte (5.), der zehnte (10.), der einunddreißigste (31.).
        </p>
      </section>
    </A1TutorMarkedWorkbookShell>
  );
};

export default A1Day12TwentyFourHourClockAndDatesWorkbookPage;
