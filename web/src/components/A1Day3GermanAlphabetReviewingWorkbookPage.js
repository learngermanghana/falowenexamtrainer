import React, { useEffect, useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { updatePageMeta } from "../lib/pageMeta";
import { styles } from "../styles";
import CoursebookAudioPlayer from "./CoursebookAudioPlayer";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import { getInlineCourseAssignments } from "../utils/courseLessonAssignments";

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
  maxHeight: 260,
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

const listeningItems = [
  {
    number: 1,
    prompt: "W _ _ s _ _ r",
    link: "https://drive.google.com/file/d/1fPjvzp0V05rNSohX7juS0qqvvcMHGmLb/view?usp=sharing",
  },
  {
    number: 2,
    prompt: "K _ _ f _",
    link: "https://drive.google.com/file/d/1Kvd8GeoQ8Dv30ySvYfVEtXKK_bqoqQJ-/view?usp=sharing",
  },
  {
    number: 3,
    prompt: "B _ _ _ _ _",
    link: "https://drive.google.com/file/d/1v1YEj3qD0aSO0fiFHkq312Ek_lU6HzkM/view?usp=sharing",
  },
  {
    number: 4,
    prompt: "S _ _ _ _ _",
    link: "https://drive.google.com/file/d/1MZ1hCy0aXGJbj3aLEsHfnXuxI6xLXxlI/view?usp=sharing",
  },
  {
    number: 5,
    prompt: "T _ _ _ _",
    link: "https://drive.google.com/file/d/1n0r_1mLeWPINZSADyFeU7o6pZ8C9FfWG/view?usp=sharing",
  },
];

const questions = [
  {
    stem: "1. Wie viele Buchstaben hat das deutsche Alphabet?",
    translation: "How many letters does the German alphabet have?",
    options: ["A) 24", "B) 25", "C) 26", "D) 27"],
  },
  {
    stem: "2. Welche zusätzlichen Buchstaben gibt es im deutschen Alphabet?",
    translation: "Which additional letters are there in the German alphabet?",
    options: ["A) Ä, Ö, Ü, ß", "B) Å, È, Ì, Ñ", "C) Á, É, Í, Ó", "D) Â, Ê, Î, Ô"],
  },
  {
    stem: "3. Wie heißt der Buchstabe ß?",
    translation: "What is the letter ß called?",
    options: ["A) Eszett", "B) Scharfes B", "C) Doppel-S", "D) Großes S"],
  },
  {
    stem: "4. Welcher Buchstabe kommt nach J im Alphabet?",
    translation: "Which letter comes after J in the alphabet?",
    options: ["A) K", "B) L", "C) I", "D) M"],
  },
  {
    stem: "5. Wie nennt man den Buchstaben Ä?",
    translation: "What is the letter Ä called?",
    options: ["A) A-Umlaut", "B) E-Umlaut", "C) O-Umlaut", "D) U-Umlaut"],
  },
  {
    stem: "6. Welche Buchstaben gehören nicht zum Standardalphabet, aber werden im Deutschen benutzt?",
    translation: "Which letters are not part of the standard alphabet but are used in German?",
    options: ["A) Ä, Ö, Ü, ß", "B) À, È, Ì, Ò", "C) Á, É, Í, Ó", "D) Å, Ê, Î, Ô"],
  },
  {
    stem: "7. Wie viele zusätzliche Buchstaben gibt es im deutschen Alphabet?",
    translation: "How many additional letters are there in the German alphabet?",
    options: ["A) 3", "B) 4", "C) 5", "D) 6"],
  },
];

const listeningBoxStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  display: "grid",
  gap: 8,
  background: "#fff",
};

const A1Day3GermanAlphabetReviewingWorkbookPage = () => {
  const level = "A1";
  const day = 2;
  const [activeTab, setActiveTab] = useState("assignment");
  const assignmentKey = useMemo(() => {
    const alphabetAssignment = getInlineCourseAssignments(level, day).find((assignment) => assignment.chapter === "0.2");
    return alphabetAssignment?.assignmentKey || "A1-0.2";
  }, []);


  useEffect(() => {
    updatePageMeta({
      title: "A1 · Day 2 Workbook · German Alphabet + Reviewing",
      canonicalPath: "/campus/course/a1-day-2-german-alphabet-reviewing-workbook",
    });
  }, []);

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={cardStyle}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          A1 · Day 2 Workbook · German Alphabet + Reviewing
        </h1>

        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 0.2 · Assignment for tutor marking</p>

        <p style={{ ...styles.subtitle, margin: 0 }}>
          Complete the workbook in the Assignment tab, then use the Submit tab below to send final answers for this exact
          assignment.
        </p>

        <div
          role="tablist"
          aria-label="A1 Day 2 workbook tabs"
          style={{ display: "flex", gap: 8, flexWrap: "wrap", borderTop: "1px solid #dbeafe", paddingTop: 12 }}
        >
          {[
            { key: "assignment", label: "Assignment" },
            { key: "submit", label: "Submit" },
          ].map((tab) => {
            const selected = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  ...styles.secondaryButton,
                  background: selected ? "#2563eb" : "#ffffff",
                  borderColor: selected ? "#2563eb" : "#93c5fd",
                  color: selected ? "#ffffff" : "#1d4ed8",
                  fontWeight: 800,
                  minWidth: 120,
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === "assignment" ? (
        <>
      <section style={sectionStyle}>
        <img
          src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1600&q=80"
          alt="Open notebook with alphabet study notes on a classroom desk"
          loading="lazy"
          style={imageStyle}
        />

        <h2 style={{ margin: 0 }}>Teil 1 · Reading and Writing</h2>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Instruction:</strong> Read the text carefully and answer the questions below. Each question has one correct
          answer.
        </p>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Text:</strong> The German alphabet has 26 letters. There are also some additional letters like Ä, Ö, Ü, and
          ß, which is called "Eszett" or "sharp S." Each letter has a name and a sound. The letters of the alphabet are: A,
          B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z. The additional letters are: Ä, Ö, Ü,
          and ß. The alphabet is often used to spell words, write names, and learn in school. For example: A as in Apfel
          (apple), B as in Ball (ball), C as in Computer (computer), D as in Deutschland (Germany). It is important to know
          the alphabet well in order to read and write correctly.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Teil 2 · Questions</h2>

        {questions.map((question) => (
          <div key={question.stem} style={questionBoxStyle}>
            <strong>{question.stem}</strong>
            <span style={{ color: "#4b5563" }}>Translation: {question.translation}</span>

            {question.options.map((option) => (
              <span key={option}>{option}</span>
            ))}
          </div>
        ))}
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Teil 3 · Hören</h2>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Instruction:</strong> Listen to each audio from Google Drive. Each question has its own audio link. Write
          the missing letters to complete the word, then return and submit your answers.
        </p>

        <p style={{ margin: 0, color: "#4b5563" }}>
          Complete Hören from Google Drive, then return to submit answers.
        </p>

        <div style={{ display: "grid", gap: 12 }}>
          {listeningItems.map((item) => (
            <div key={item.number} style={listeningBoxStyle}>
              <strong style={{ fontSize: 16 }}>
                {item.number}. {item.prompt}
              </strong>

              <CoursebookAudioPlayer
                url={item.link}
                linkLabel={`Open Audio ${item.number}`}
                linkStyle={{ ...styles.button, width: "fit-content", textDecoration: "none" }}
              />
            </div>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Vocabulary Notes · Alphabet in German</h2>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Additional Letters (Zusätzliche Buchstaben):</strong> Ä (A-Umlaut), Ö (O-Umlaut), Ü (U-Umlaut), ß (Eszett /
          scharfes S).
          <br />
          <strong>Example Words (Beispielwörter):</strong> Apfel, Ball, Computer, Deutschland.
          <br />
          <strong>Useful Phrases:</strong> Wie buchstabiert man...?, Wie viele Buchstaben...?, Welche Buchstaben...?, Das
          Alphabet, der Buchstabe, das Wort, das Lesen, das Schreiben, lernen, buchstabieren, richtig, falsch.
        </p>
      </section>

      <div style={{ ...cardStyle, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
        <p style={{ margin: 0, fontWeight: 600 }}>
          Finished the workbook? Open the Submit tab above and paste your final answers there.
        </p>
      </div>
        </>
      ) : (
        <section style={{ ...sectionStyle, border: "1px solid #bfdbfe" }} aria-label="Submit A1 Day 2 workbook answers">
          <div>
            <p style={{ color: "#1d4ed8", fontSize: 13, fontWeight: 900, letterSpacing: ".04em", margin: 0, textTransform: "uppercase" }}>
              Tutor-marked assignment
            </p>
            <h2 style={{ margin: "4px 0" }}>Submit A1 · Day 2 · German Alphabet</h2>
            <p style={{ color: "#475569", margin: 0 }}>
              This submission box is locked to {assignmentKey}, so your work is saved under the correct assignment.
            </p>
          </div>
          <div className="a1-day2-workbook-submit-tab">
            <style>{`.a1-day2-workbook-submit-tab > div > section:first-child { display: none !important; }
              .a1-day2-workbook-submit-tab select { display: none !important; }`}</style>
            <AssignmentSubmissionPage
              submissionContext={{
                level,
                day,
                assignmentKey,
                canonicalAssignmentKey: assignmentKey,
              }}
            />
          </div>
        </section>
      )}
    </div>
  );
};

export default A1Day3GermanAlphabetReviewingWorkbookPage;
