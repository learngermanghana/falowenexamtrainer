import React from "react";
import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell";
import { styles } from "../styles";

const GRAMMAR_ROUTE = "/campus/course/a1-day-12-the-24-hour-clock-and-dates";

const pageGrid = {
  display: "grid",
  gap: 16,
  minHeight: 1,
  width: "100%",
};

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
  marginBottom: 0,
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
  gap: 7,
  padding: "12px 14px",
  border: "1px solid #dbeafe",
  borderRadius: 12,
  background: "#ffffff",
};

const instructionBox = {
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  borderRadius: 12,
  color: "#1e3a8a",
  lineHeight: 1.65,
  padding: "12px 14px",
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

const videoWrapper = {
  position: "relative",
  width: "100%",
  paddingTop: "56.25%",
  overflow: "hidden",
  borderRadius: 12,
  background: "#000000",
};

const videoFrame = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  border: 0,
};

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
    stem: "4. Wie schreibt man das Datum ‚dritter Februar 2024‘ in Deutschland?",
    options: ["A) 03/02/2024", "B) 2024.02.03", "C) 03.02.2024", "D) 02.03.2024"],
  },
  {
    stem: "5. Welcher Tag ist heute laut dem Text?",
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
    stem: "1. Wann beginnt der Tag in der 24-Stunden-Uhr?",
    options: ["A) Um 6 Uhr", "B) Um Mitternacht", "C) Um 12 Uhr", "D) Um 18 Uhr"],
  },
  {
    stem: "2. Was bedeutet 16:00 Uhr?",
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
    stem: "5. Welcher Tag ist heute laut dem Hörtext?",
    options: ["A) Dienstag", "B) Mittwoch", "C) Freitag", "D) Montag"],
  },
];

const QuestionList = ({ questions }) => (
  <div style={{ display: "grid", gap: 10 }}>
    {questions.map((question) => (
      <div key={question.stem} style={questionBlock}>
        <p style={{ ...paragraph, fontWeight: 800 }}>{question.stem}</p>
        {question.options.map((option) => (
          <p key={option} style={paragraph}>{option}</p>
        ))}
      </div>
    ))}
  </div>
);

const A1Day12TwentyFourHourClockAndDatesWorkbookPage = () => (
  <A1TutorMarkedWorkbookShell
    day={12}
    chapter="8"
    fallbackAssignmentKey="A1-8"
    title="A1 · Day 12 Workbook · The 24-Hour Clock and Dates"
    subtitle="Chapter 8 · Tutor-marked assignment"
    assignmentIntro="The complete workbook is shown below. Finish Teil 1, Teil 2 and Teil 3, then open Submit and send your numbered answers."
    submitTitle="Submit A1 · Day 12 · Chapter 8"
  >
    <div data-a1-day12-workbook-content="true" style={pageGrid}>
      <section style={{ ...card, border: "1px solid #93c5fd", background: "linear-gradient(135deg, #eff6ff, #ffffff)" }}>
        <p style={{ margin: 0, color: "#1d4ed8", fontSize: 12, fontWeight: 900, letterSpacing: ".05em", textTransform: "uppercase" }}>
          Workbook content
        </p>
        <h2 style={sectionTitle}>Start here</h2>
        <p style={paragraph}>
          The assignment has three assessed parts: multiple choice, Richtig/Falsch and listening. Write your answers with their question numbers in the Submit tab.
        </p>
        <a href={GRAMMAR_ROUTE} style={{ ...styles.secondaryButton, textDecoration: "none", width: "fit-content" }}>
          Review the grammar notes first
        </a>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Teil 1: Lesen · Multiple Choice</h2>
        <div style={instructionBox}>
          Read the text carefully. Choose one answer, A–D, for each question.
        </div>
        <p style={paragraph}>
          Heute ist der dritte Februar. In Deutschland benutzen wir oft die 24-Stunden-Uhr. Der Tag beginnt um Mitternacht bei null Uhr und endet um 23:59 Uhr. 14:00 Uhr bedeutet zwei Uhr nachmittags und 20:00 Uhr bedeutet acht Uhr abends.
        </p>
        <p style={paragraph}>
          Die Monate heißen Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober, November und Dezember. Der Februar hat normalerweise 28 Tage, in einem Schaltjahr aber 29 Tage.
        </p>
        <p style={paragraph}>
          Heute ist Mittwoch. Das Datum wird in Deutschland als Tag.Monat.Jahr geschrieben. Der dritte Februar 2024 wird deshalb als 03.02.2024 geschrieben.
        </p>
        <QuestionList questions={teil1Questions} />
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Teil 2: Lesen · Richtig oder Falsch</h2>
        <div style={instructionBox}>
          Read the second text. For questions 1–5, write only <strong>Richtig</strong> or <strong>Falsch</strong>.
        </div>
        <p style={paragraph}>
          Heute ist der fünfte April. 16:00 Uhr bedeutet vier Uhr nachmittags und 21:00 Uhr bedeutet neun Uhr abends. Der Februar hat normalerweise 28 Tage, in einem Schaltjahr 29 Tage. Heute ist Montag. In Deutschland schreibt man das Datum als Tag.Monat.Jahr. Der fünfte April wird als 05.04 geschrieben.
        </p>
        <div style={{ display: "grid", gap: 10 }}>
          {teil2Questions.map((question, index) => (
            <div key={question} style={questionBlock}>
              <div style={{ alignItems: "flex-start", display: "flex", gap: 12 }}>
                <span aria-hidden="true" style={trueFalseNumber}>{index + 1}</span>
                <p style={{ ...paragraph, flex: 1, fontWeight: 800, paddingTop: 3 }}>{question}</p>
              </div>
              <p style={{ margin: 0, color: "#1e3a8a", fontWeight: 800 }}>Antwort: Richtig oder Falsch</p>
            </div>
          ))}
        </div>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Teil 3: Hörverstehen</h2>
        <div style={instructionBox}>
          Watch and listen to the video. Then choose one answer, A–D, for each question.
        </div>
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
        <QuestionList questions={horenQuestions} />
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Teil 4: Vocabulary reminder</h2>
        <p style={paragraph}>
          Time: Mitternacht, null Uhr, vierzehn Uhr, sechzehn Uhr, morgens, nachmittags, abends.
        </p>
        <p style={paragraph}>
          Dates: Januar–Dezember and ordinal forms such as <strong>der dritte Februar</strong>, <strong>der fünfte April</strong>, <strong>der zwanzigste Mai</strong> and <strong>der einunddreißigste Dezember</strong>.
        </p>
        <p style={paragraph}>
          In the next chapter, you will practise dates again in more sentence-building activities.
        </p>
      </section>
    </div>
  </A1TutorMarkedWorkbookShell>
);

export default A1Day12TwentyFourHourClockAndDatesWorkbookPage;
