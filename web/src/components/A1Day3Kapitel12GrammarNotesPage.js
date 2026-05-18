import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const sectionStyle = { ...styles.card, display: "grid", gap: 12 };
const noteStyle = {
  background: "#f8fafc",
  border: "1px solid #cbd5e1",
  borderRadius: 12,
  padding: 12,
};
const tableStyle = { width: "100%", borderCollapse: "collapse", fontSize: 15 };
const thTdStyle = {
  border: "1px solid #d1d5db",
  padding: "8px 10px",
  textAlign: "left",
  verticalAlign: "top",
};

const quizCardStyle = {
  border: "1px solid #d1d5db",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 10,
  background: "#fff",
};

const optionButtonStyle = {
  width: "100%",
  textAlign: "left",
  border: "1px solid #cbd5e1",
  borderRadius: 10,
  padding: "8px 10px",
  background: "#f8fafc",
  cursor: "pointer",
};

const pronounRows = [
  ["ich", "I", "Ich lerne Deutsch."],
  ["du", "you (informal, one person)", "Du lernst Deutsch."],
  ["er", "he", "Er lernt Deutsch."],
  ["sie", "she", "Sie lernt Deutsch."],
  ["es", "it", "Es ist neu."],
  ["wir", "we", "Wir lernen Deutsch."],
  ["ihr", "you (informal, plural)", "Ihr lernt Deutsch."],
  ["sie", "they", "Sie lernen Deutsch."],
  ["Sie", "you (formal)", "Sie lernen Deutsch."],
];

const quizQuestions = [
  {
    question: "Ich ___ Deutsch.",
    options: ["lerne", "lernst", "lernt"],
    answer: "lerne",
  },
  {
    question: "Du ___ heute im Kurs.",
    options: ["lernen", "lernst", "lernt"],
    answer: "lernst",
  },
  {
    question: "Er ___ in Berlin.",
    options: ["wohnen", "wohnst", "wohnt"],
    answer: "wohnt",
  },
  {
    question: "Wir ___ jeden Tag.",
    options: ["arbeiten", "arbeitest", "arbeitet"],
    answer: "arbeiten",
  },
  {
    question: "Ihr ___ sehr gut Deutsch.",
    options: ["sprecht", "sprechen", "sprichst"],
    answer: "sprecht",
  },
  {
    question: "Sie (formal) ___ aus Accra?",
    options: ["kommst", "kommen", "kommt"],
    answer: "kommen",
  },
  {
    question: "Sie (they) ___ Fußball.",
    options: ["spielt", "spielen", "spielst"],
    answer: "spielen",
  },
  {
    question: "Es ___ kalt heute.",
    options: ["sein", "bist", "ist"],
    answer: "ist",
  },
];

const A1Day3Kapitel12GrammarNotesPage = () => {
  const navigate = useNavigate();
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    return quizQuestions.reduce((total, current, index) => {
      const selected = selectedAnswers[index];
      return selected === current.answer ? total + 1 : total;
    }, 0);
  }, [selectedAnswers]);

  const handleSelectAnswer = (questionIndex, option) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: option }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 10 }}>
        <button
          type="button"
          style={{ ...styles.secondaryButton, width: "fit-content" }}
          onClick={() => navigate("/campus/course")}
        >
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          A1 · Day 3 · Personal Pronouns · Grammar Notes
        </h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          The right A1 notes for all basic German personal pronouns.
        </p>
      </header>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>1) What are personal pronouns?</h2>
        <div style={noteStyle}>
          <p style={{ margin: 0 }}>
            Personal pronouns replace names and nouns, like <strong>I, you, he, she</strong> in
            English.
          </p>
          <p style={{ margin: "8px 0 0 0" }}>
            In German, we use them all the time with verbs. Learning them early helps you build
            correct sentences.
          </p>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>2) All A1 personal pronouns</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thTdStyle}>German</th>
                <th style={thTdStyle}>English</th>
                <th style={thTdStyle}>Example</th>
              </tr>
            </thead>
            <tbody>
              {pronounRows.map((row) => (
                <tr key={`${row[0]}-${row[1]}`}>
                  {row.map((cell) => (
                    <td key={cell} style={thTdStyle}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>3) Real A1-friendly notes (with English)</h2>
        <div style={noteStyle}>
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
            <li>
              <strong>sie</strong> and <strong>Sie</strong> are different: <em>sie</em> = she/they,
              <em> Sie</em> = formal you.
            </li>
            <li>
              <strong>Sie</strong> is always capitalized because it means formal <em>you</em>.
            </li>
            <li>
              <strong>ihr</strong> means <em>you guys</em> in English (informal plural), and it usually
              takes the verb ending <strong>-t</strong>: <em>ihr lernt</em>, <em>ihr macht</em>,
              <em> ihr kommt</em>.
            </li>
            <li>
              Easy memory tip: <strong>du = -st</strong>, <strong>er/sie/es = -t</strong>,
              <strong> wir/sie/Sie = -en</strong>, <strong>ihr = -t</strong>.
            </li>
          </ul>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>4) Verb endings for all pronouns (English translation)</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thTdStyle}>Pronoun</th>
                <th style={thTdStyle}>English</th>
                <th style={thTdStyle}>Ending</th>
                <th style={thTdStyle}>Example with "lernen"</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={thTdStyle}>ich</td>
                <td style={thTdStyle}>I</td>
                <td style={thTdStyle}>-e</td>
                <td style={thTdStyle}>ich lerne</td>
              </tr>
              <tr>
                <td style={thTdStyle}>du</td>
                <td style={thTdStyle}>you (one person, informal)</td>
                <td style={thTdStyle}>-st</td>
                <td style={thTdStyle}>du lernst</td>
              </tr>
              <tr>
                <td style={thTdStyle}>er / sie / es</td>
                <td style={thTdStyle}>he / she / it</td>
                <td style={thTdStyle}>-t</td>
                <td style={thTdStyle}>er lernt / sie lernt / es lernt</td>
              </tr>
              <tr>
                <td style={thTdStyle}>wir</td>
                <td style={thTdStyle}>we</td>
                <td style={thTdStyle}>-en</td>
                <td style={thTdStyle}>wir lernen</td>
              </tr>
              <tr>
                <td style={thTdStyle}>ihr</td>
                <td style={thTdStyle}>you guys (informal plural)</td>
                <td style={thTdStyle}>-t</td>
                <td style={thTdStyle}>ihr lernt</td>
              </tr>
              <tr>
                <td style={thTdStyle}>sie</td>
                <td style={thTdStyle}>they</td>
                <td style={thTdStyle}>-en</td>
                <td style={thTdStyle}>sie lernen</td>
              </tr>
              <tr>
                <td style={thTdStyle}>Sie</td>
                <td style={thTdStyle}>you (formal)</td>
                <td style={thTdStyle}>-en</td>
                <td style={thTdStyle}>Sie lernen</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>5) More verb conjugation examples (A1)</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thTdStyle}>Pronoun</th>
                <th style={thTdStyle}>kommen (to come)</th>
                <th style={thTdStyle}>machen (to do/make)</th>
                <th style={thTdStyle}>wohnen (to live)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={thTdStyle}>ich</td>
                <td style={thTdStyle}>ich komme</td>
                <td style={thTdStyle}>ich mache</td>
                <td style={thTdStyle}>ich wohne</td>
              </tr>
              <tr>
                <td style={thTdStyle}>du</td>
                <td style={thTdStyle}>du kommst</td>
                <td style={thTdStyle}>du machst</td>
                <td style={thTdStyle}>du wohnst</td>
              </tr>
              <tr>
                <td style={thTdStyle}>er / sie / es</td>
                <td style={thTdStyle}>er/sie/es kommt</td>
                <td style={thTdStyle}>er/sie/es macht</td>
                <td style={thTdStyle}>er/sie/es wohnt</td>
              </tr>
              <tr>
                <td style={thTdStyle}>wir</td>
                <td style={thTdStyle}>wir kommen</td>
                <td style={thTdStyle}>wir machen</td>
                <td style={thTdStyle}>wir wohnen</td>
              </tr>
              <tr>
                <td style={thTdStyle}>ihr</td>
                <td style={thTdStyle}>ihr kommt</td>
                <td style={thTdStyle}>ihr macht</td>
                <td style={thTdStyle}>ihr wohnt</td>
              </tr>
              <tr>
                <td style={thTdStyle}>sie / Sie</td>
                <td style={thTdStyle}>sie/Sie kommen</td>
                <td style={thTdStyle}>sie/Sie machen</td>
                <td style={thTdStyle}>sie/Sie wohnen</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>6) Knowledge test: Verb conjugation (8 questions)</h2>
        <p style={{ margin: 0 }}>
          Choose the correct verb form for each sentence using the correct personal pronoun.
        </p>

        {quizQuestions.map((item, questionIndex) => {
          const selected = selectedAnswers[questionIndex];
          return (
            <div key={item.question} style={quizCardStyle}>
              <strong>
                Question {questionIndex + 1}: {item.question}
              </strong>
              <div style={{ display: "grid", gap: 8 }}>
                {item.options.map((option) => {
                  const isChosen = selected === option;
                  const isCorrect = submitted && option === item.answer;
                  const isWrongChoice = submitted && isChosen && option !== item.answer;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleSelectAnswer(questionIndex, option)}
                      style={{
                        ...optionButtonStyle,
                        borderColor: isCorrect ? "#16a34a" : isWrongChoice ? "#dc2626" : "#cbd5e1",
                        background: isCorrect ? "#dcfce7" : isWrongChoice ? "#fee2e2" : "#f8fafc",
                        fontWeight: isChosen ? 700 : 400,
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" style={styles.button} onClick={handleSubmit}>
            Submit answers
          </button>
          <button type="button" style={styles.secondaryButton} onClick={handleReset}>
            Reset quiz
          </button>
        </div>

        {submitted ? (
          <div style={noteStyle}>
            <strong>
              Your score: {score} / {quizQuestions.length}
            </strong>
            <p style={{ margin: "8px 0 0 0" }}>
              Review the highlighted answers and try again to improve your conjugation accuracy.
            </p>
          </div>
        ) : null}
      </section>
    </main>
  );
};

export default A1Day3Kapitel12GrammarNotesPage;
