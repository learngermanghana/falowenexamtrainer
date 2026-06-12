import React from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import CoursebookAudioPlayer from "./CoursebookAudioPlayer";

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

const imageStyle = {
  width: "100%",
  borderRadius: 10,
  maxHeight: 320,
  objectFit: "cover",
};

const questionBoxStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  display: "grid",
  gap: 6,
  background: "#fff",
};

const readingQuestions = [
  "1. Der Autor geht jeden Tag einkaufen.",
  "2. Der Autor kauft im Supermarkt Obst, Gemüse, Brot, Milch und Eier.",
  "3. Der Autor macht oft eine Einkaufsliste, um Geld zu sparen.",
  "4. Der Autor geht gerne auf den Wochenmarkt, weil die Atmosphäre schön ist und die Produkte frisch sind.",
  "5. Letzten Samstag hat der Autor Tomaten, Gurken, Salat und Kartoffeln auf dem Markt gekauft.",
  "6. Der Verkäufer fragt den Kunden, ob er noch etwas möchte.",
  "7. Der Autor bereitet einen Tomatensalat mit Tomaten, Zwiebeln, Salz, Pfeffer und Olivenöl zu.",
  "8. Der Autor kocht nicht gerne nach dem Einkaufen.",
  "9. Der Autor findet, dass die Qualität der Produkte auf dem Wochenmarkt oft schlechter ist als im Supermarkt.",
  "10. Der Tomatensalat dauert 20 Minuten, um ihn zuzubereiten.",
];

const listeningQuestions = [
  {
    stem: "1. Wie oft geht der Sprecher einkaufen?",
    options: ["A) Jeden Tag", "B) Jede Woche", "C) Jeden Monat"],
  },
  {
    stem: "2. Was hat der Sprecher zuerst gekauft?",
    options: ["A) Brot", "B) Tomaten", "C) Äpfel und Bananen"],
  },
  {
    stem: "3. Wie viele Tomaten hat der Sprecher gekauft?",
    options: ["A) Ein halbes Kilo", "B) Ein Kilo", "C) Zwei Kilo"],
  },
  {
    stem: "4. Was hat der gesamte Einkauf gekostet?",
    options: ["A) 5 Euro", "B) 10 Euro", "C) 15 Euro"],
  },
  {
    stem: "5. Was hat die Kassiererin dem Sprecher gewünscht?",
    options: ["A) Einen schönen Abend", "B) Einen schönen Tag", "C) Guten Appetit"],
  },
];

const vocabList = {
  nomen: [
    "der Supermarkt – supermarket",
    "das Obst – fruit",
    "das Gemüse – vegetable",
    "das Brot – bread",
    "die Milch – milk",
    "der Apfel (die Äpfel) – apple",
    "die Banane (die Bananen) – banana",
    "die Tomate (die Tomaten) – tomato",
    "der Einkauf – purchase/shopping",
    "die Kassiererin – cashier (female)",
    "der Kassierer – cashier (male)",
    "der Preis – price",
    "das Kilo – kilogram",
    "das Geld – money",
    "der Euro – euro",
  ],
  verben: [
    "einkaufen – to shop",
    "kaufen – to buy",
    "kosten – to cost",
    "gehen – to go",
    "wünschen – to wish",
    "sein – to be",
    "haben – to have",
  ],
  adjektive: ["frisch – fresh", "freundlich – friendly", "gut – good"],
  phrasen: [
    "Jede Woche – every week",
    "ein Kilo – one kilogram",
    "ein halbes Kilo – half a kilogram",
    "Schönen Tag – Have a nice day",
    "Es war ein guter Einkauf – It was a good shopping trip",
  ],
};

const A1Day16FoodAndNegationKapitel10WorkbookPage = () => {

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={cardStyle}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <h1 style={{ ...styles.title, marginBottom: 0 }}>A1 · Day 16 Workbook · Food and Negation</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 10</p>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Complete all sections, then submit your final answers in the submission area only (not directly on this page).
        </p>
      </div>

      <section style={sectionStyle}>
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80"
          alt="Fresh groceries including vegetables and fruit on display in a market"
          loading="lazy"
          style={imageStyle}
        />
        <h2 style={{ margin: 0 }}>Teil 1 · Lesen / Schreiben</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>📝 Workbook Teil 1 (Lesen):</strong> Einkaufen und Kochen
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Instructions:</strong> Read the text below and choose the correct answer. One answer is correct.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Einkaufen ist wichtig. Ich mache oft eine Einkaufsliste und kaufe Obst, Gemüse, Brot, Milch und Eier im
          Supermarkt. Ich gehe zweimal pro Woche einkaufen. Auf dem Wochenmarkt kaufe ich frisches Obst und Gemüse, die
          oft frischer sind als im Supermarkt. Letzten Samstag habe ich Tomaten, Gurken, Salat und Kartoffeln gekauft.
          Die Preise sind manchmal höher, aber die Qualität ist besser. Nach dem Einkaufen koche ich gerne. Ein
          einfaches Rezept ist Tomatensalat: Tomaten und Zwiebeln schneiden, mit Salz, Pfeffer und Olivenöl mischen.
          Dieser Salat ist schnell gemacht und sehr lecker.
        </p>
      </section>

      <section style={sectionStyle}>
        <p style={{ margin: 0, fontWeight: 600 }}>A) True or False Questions</p>
        {readingQuestions.map((question) => (
          <div key={question} style={questionBoxStyle}>
            <strong>{question}</strong>
            <span>A) Wahr</span>
            <span>B) Falsch</span>
          </div>
        ))}
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Teil 2 · Hören</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Complete Hören from Google Drive, then return to submit answers.
        </p>
        <CoursebookAudioPlayer
          url="https://drive.google.com/file/d/12RITYz1tYLee-FMw9WFzAD9YrtqrjwmC/view?usp=sharing"
          linkLabel="Open Hören Material (Google Drive)"
          linkStyle={{ ...styles.secondaryButton, textDecoration: "none", width: "fit-content" }}
        />
        <p style={{ margin: "8px 0 0", fontWeight: 600 }}>B) Hören Fragen (Multiple Choice)</p>
        {listeningQuestions.map((question) => (
          <div key={question.stem} style={questionBoxStyle}>
            <strong>{question.stem}</strong>
            {question.options.map((option) => (
              <span key={option}>{option}</span>
            ))}
          </div>
        ))}

        <div style={{ ...questionBoxStyle, background: "#f9fafb" }}>
          <strong>Vokabelliste: Einkaufen im Supermarkt</strong>
          <span><strong>Nomen:</strong> {vocabList.nomen.join(" · ")}</span>
          <span><strong>Verben:</strong> {vocabList.verben.join(" · ")}</span>
          <span><strong>Adjektive:</strong> {vocabList.adjektive.join(" · ")}</span>
          <span><strong>Phrasen:</strong> {vocabList.phrasen.join(" · ")}</span>
        </div>
      </section>

      <div style={{ ...cardStyle, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
        <p style={{ margin: 0, fontWeight: 600 }}>Submit your answers in the submission area after finishing all parts.</p>
        <a
          href="https://www.falowen.app/campus/submit"
          target="_blank"
          rel="noreferrer"
          style={{ ...styles.button, width: "fit-content", textDecoration: "none" }}
        >
          Submit Workbook Answers
        </a>
      </div>
    </div>
  );
};

export default A1Day16FoodAndNegationKapitel10WorkbookPage;
