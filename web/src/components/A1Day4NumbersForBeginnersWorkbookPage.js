import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import LiveClassResponsePanel from "./LiveClassResponsePanel";

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

const optionLine = {
  margin: 0,
  paddingLeft: 12,
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

const teil2Questions = [
  {
    id: 1,
    stem: "1. Wie heißt die Zahl 7 auf Deutsch?",
    options: ["a) sieben", "b) sechs", "c) neun"],
  },
  {
    id: 2,
    stem: "2. Welche Zahl ist das? (3)",
    options: ["a) vier", "b) drei", "c) zwei"],
  },
  {
    id: 3,
    stem: "3. Welche Zahl kommt nach fünf?",
    options: ["a) vier", "b) sechs", "c) sieben"],
  },
  {
    id: 4,
    stem: "4. Wie heißt die Zahl 9 auf Deutsch?",
    options: ["a) acht", "b) neun", "c) zehn"],
  },
  {
    id: 5,
    stem: "5. Wie viele Tage hat eine Woche?",
    options: ["a) fünf", "b) sieben", "c) neun"],
    classContribution: true,
  },
  {
    id: 6,
    stem: "6. Wie viele Finger hast du an einer Hand?",
    options: ["a) drei", "b) sechs", "c) fünf"],
  },
  {
    id: 7,
    stem: "7. Wie heißt die Zahl 222 auf Deutsch?",
    options: ["a) zweihundertzwanzig", "b) zweihundertzweiundzwanzig", "c) zweihundertneunundzwanzig"],
    classContribution: true,
  },
  {
    id: 8,
    stem: "8. Wie heißt die Zahl 509 auf Deutsch?",
    options: ["a) fünfhundertneun", "b) fünfhundertneunzehn", "c) fünfhundertfünfzig"],
  },
  {
    id: 9,
    stem: "9. Wie heißt die Zahl 2040 auf Deutsch?",
    options: ["a) zweitausendvierzig", "b) zweitausendvier", "c) zweitausendvierhundert"],
  },
  {
    id: 10,
    stem: "10. Wie heißt die Zahl 5509 auf Deutsch?",
    options: ["a) fünftausendfünfhundertneun", "b) fünftausendneunhundertfünf", "c) fünfhundertfünfundneunzig"],
  },
];

const optionKey = (option) => String(option).split(")")[0].trim().toUpperCase();

const A1Day4NumbersForBeginnersWorkbookPage = () => {
  const [classAnswers, setClassAnswers] = useState({});

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          A1 · Day 4 Workbook · Numbers and Addresses
        </h1>

        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 2</p>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Complete the assignment below, then open the Submit tab above to send your answers immediately.
        </p>
      </div>

      <div style={card}>
        <img
          src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1600&q=80"
          alt="Notebook page with numbers and study notes"
          loading="lazy"
          style={{
            width: "100%",
            borderRadius: 10,
            maxHeight: 280,
            objectFit: "cover",
          }}
        />

        <h2 style={sectionTitle}>Teil 1: Reading / Writing</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Numbers for Beginners (A1.1) (Exercise).</strong> Instructions: Read each question carefully and choose
          the correct answer (a, b, or c). Use a dictionary to look up any words you don&apos;t understand.
        </p>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Schreiben Aufgabe (Writing Task): Schreiben Sie die folgenden Zahlen auf Deutsch. Benutzen Sie ein Wörterbuch,
          wenn Sie ein Wort nicht verstehen.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Instructions: Write the following numbers in German. Use a dictionary if you don&apos;t understand a word.
        </p>
        <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
          <li>16</li>
          <li>98</li>
          <li>555</li>
          <li>1020</li>
          <li>8553</li>
        </ol>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Beispiel (Example): 25 – fünfundzwanzig. Extra note from today&apos;s material: zweitausendvier.
        </p>
      </div>

      <div style={card}>
        <h2 style={sectionTitle}>Teil 2: Questions</h2>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Teil 1: Zahlen erkennen und benennen</strong>, <strong>Teil 2: Zahlen in Kontext</strong>, and
          <strong> Teil 3: Größere Zahlen</strong> are combined below.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7, color: "#475569" }}>
          Two questions are marked as <strong>Class contribution</strong>. Choose your own answer first; those two choices are shared live with your class and are not graded.
        </p>

        {teil2Questions.map((question) => (
          <div key={question.stem} style={questionBlock}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <p style={{ margin: 0, fontWeight: 700 }}>{question.stem}</p>
              {question.classContribution ? <span style={styles.badge}>Class contribution</span> : null}
            </div>

            {question.classContribution ? (
              <div style={{ display: "grid", gap: 8 }}>
                {question.options.map((option) => {
                  const key = optionKey(option);
                  const selected = classAnswers[question.id] === key;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setClassAnswers((current) => ({ ...current, [question.id]: key }))}
                      style={{
                        ...styles.secondaryButton,
                        width: "100%",
                        textAlign: "left",
                        justifyContent: "flex-start",
                        border: selected ? "2px solid #2563eb" : "1px solid #d1d5db",
                        background: selected ? "#eff6ff" : "#fff",
                      }}
                    >
                      {option}
                    </button>
                  );
                })}

                <LiveClassResponsePanel
                  lessonId="a1-day-4-numbers-and-addresses"
                  questionId={`teil2-q${question.id}`}
                  questionLabel={question.stem}
                  selectedOption={classAnswers[question.id] || ""}
                  options={question.options.map(optionKey)}
                />
              </div>
            ) : (
              question.options.map((option) => (
                <p key={option} style={optionLine}>{option}</p>
              ))
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          ...card,
          border: "1px solid #c7d2fe",
          background: "#eef2ff",
        }}
      >
        <h2 style={sectionTitle}>Final Submission</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          After completing the workbook tasks, use the Submit tab above. The correct A1 Day 4 assignment is selected automatically.
        </p>
        <p style={{ margin: 0, fontWeight: 700, color: "#1d4ed8" }}>
          Choose Submit above when you are ready.
        </p>
      </div>
    </div>
  );
};

export default A1Day4NumbersForBeginnersWorkbookPage;
