import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionStyle = {
  ...styles.card,
  display: "grid",
  gap: 10,
};

const questionBoxStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  display: "grid",
  gap: 6,
  background: "#fff",
};

const imageStyle = {
  width: "100%",
  borderRadius: 10,
  maxHeight: 320,
  objectFit: "cover",
};

const partOneQuestions = [
  {
    stem: "1. Du möchtest im Sommer an den Strand gehen und das warme Wetter genießen. Welche Anzeige wählst du?",
    options: ["A. Anzeige A", "B. Anzeige B"],
  },
  {
    stem: "2. Du liebst Skifahren und möchtest in den Winterurlaub fahren. Welche Anzeige passt zu dir?",
    options: ["A. Anzeige A", "B. Anzeige B"],
  },
  {
    stem: "3. Du willst einen Urlaub planen und suchst nach einem Hotel in Spanien. Welche Anzeige solltest du lesen?",
    options: ["A. Anzeige A", "B. Anzeige B"],
  },
  {
    stem: "4. Du möchtest am Meer arbeiten und suchst nach einem Job in der Gastronomie. Welche Anzeige wählst du?",
    options: ["A. Anzeige A", "B. Anzeige B"],
  },
  {
    stem: "5. Du interessierst dich für eine Karriere im IT-Bereich und möchtest in einer multikulturellen Stadt leben. Welche Anzeige passt zu dir?",
    options: ["A. Anzeige A", "B. Anzeige B"],
  },
  {
    stem: "6. Du willst berufliche Chancen in Kanada erkunden und nahe der Pazifikküste leben. Welche Anzeige ist relevant für dich?",
    options: ["A. Anzeige A", "B. Anzeige B"],
  },
];

const partTwoQuestions = [
  {
    stem: "7. Wo kannst du im Sommer 2024 als Kellner oder Koch arbeiten?",
    options: ["A. In Spanien", "B. In Kanada"],
  },
  {
    stem: "8. Welche Stadt bietet einen Englischkurs und Stadtbesichtigungen an?",
    options: ["A. Mallorca", "B. Toronto"],
  },
  {
    stem: "9. Welche Unterkunft wird in Kanada angeboten?",
    options: ["A. Hotelzimmer", "B. Apartments oder WGs"],
  },
];

const vocab = [
  "Wetter (weather)",
  "Frühling (spring)",
  "Sommer (summer)",
  "mild (mild)",
  "Regen (rain)",
  "sonnig (sunny)",
  "warm (warm)",
  "heiß (hot)",
  "Temperaturen (temperatures)",
  "Urlaub (vacation)",
  "reisen (to travel)",
  "Ausland (abroad)",
  "Strand (beach)",
  "Hotel (hotel)",
  "Flug (flight)",
  "Flughafen (airport)",
  "Koffer (suitcase)",
  "Pass (passport)",
  "Sonne (sun)",
  "Meer (sea)",
  "Sommerurlaub (summer vacation)",
  "Winterurlaub (winter vacation)",
];

const A1Day21WeatherWorkbookPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={cardStyle}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>A1 · Day 21 Workbook · Weather</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 13</p>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Tutor-marked assignment not started. Status is manually controlled — update your own progress here.
        </p>
      </div>

      <section style={sectionStyle}>
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
          alt="Sunny beach and sea"
          loading="lazy"
          style={imageStyle}
        />
        <h2 style={{ margin: 0 }}>Teil 1 · Anzeigen</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Instruction:</strong> There are two sets of advertisements. Read each question and choose the correct
          option.
        </p>
        {partOneQuestions.map((question) => (
          <div key={question.stem} style={questionBoxStyle}>
            <strong>{question.stem}</strong>
            {question.options.map((option) => (
              <span key={option}>{option}</span>
            ))}
          </div>
        ))}
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Teil 2 · Nachricht</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Instruction:</strong> Read Felix&apos;s letter and answer the questions.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Liebe Freunde, ich habe tolle Neuigkeiten! Im Sommer 2024 gibt es Jobs auf Mallorca (Kellner, Koch,
          Reinigungskraft) direkt am Strand mit Hotelzimmern und Spanischkurs. Im Herbst 2024 gibt es Jobs in Toronto
          (Verkäufer, Büroassistent, Fahrer) mit Apartments/WGs und Englischkurs.
        </p>
        {partTwoQuestions.map((question) => (
          <div key={question.stem} style={questionBoxStyle}>
            <strong>{question.stem}</strong>
            {question.options.map((option) => (
              <span key={option}>{option}</span>
            ))}
          </div>
        ))}
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Teil 3 · Schreiben</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Schreiben Sie eine E-Mail an Bina. Sie hat Sie zur Hochzeit eingeladen, aber Sie können nicht kommen.
        </p>
        <ul style={{ margin: "0 0 0 18px", padding: 0, lineHeight: 1.7 }}>
          <li>Warum schreiben Sie?</li>
          <li>Was ist der Grund? (Nutzen Sie einen Grund zum Wetter.)</li>
          <li>Vorschläge: Was kann Bina machen? (verschieben, anderes Treffen, Wünsche)</li>
        </ul>
        <a
          href="https://www.falowen.app/campus/writing"
          target="_blank"
          rel="noreferrer"
          style={{ ...styles.button, width: "fit-content", textDecoration: "none" }}
        >
          Open Writing Tab Support
        </a>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Vokabelliste</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8 }}>
          {vocab.map((word) => (
            <div key={word} style={questionBoxStyle}>
              {word}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default A1Day21WeatherWorkbookPage;
