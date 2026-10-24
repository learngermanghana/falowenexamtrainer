import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

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
const questionStyle = {
  border: "1px solid #dbeafe",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 10,
  background: "#fff",
};

const pronounRows = [
  ["ich", "I", "one person speaking", "Ich wohne in Accra."],
  ["du", "you", "informal, one person", "Du kommst aus Ghana."],
  ["er", "he", "one male person", "Er arbeitet in Berlin."],
  ["sie", "she", "one female person", "Sie heißt Anna."],
  ["es", "it", "a thing, animal or neutral noun", "Es wohnt hier."],
  ["wir", "we", "the speaker and other people", "Wir lernen Deutsch."],
  ["ihr", "you guys / you all", "informal, two or more people", "Ihr wohnt in Accra."],
  ["sie", "they", "two or more people", "Sie kommen aus Ghana."],
  ["Sie", "you", "formal, one or more people", "Woher kommen Sie?"],
];

const conjugationRows = [
  ["ich", "lerne", "mache", "arbeite", "wohne", "komme", "heiße"],
  ["du", "lernst", "machst", "arbeitest", "wohnst", "kommst", "heißt"],
  ["er / sie / es", "lernt", "macht", "arbeitet", "wohnt", "kommt", "heißt"],
  ["wir", "lernen", "machen", "arbeiten", "wohnen", "kommen", "heißen"],
  ["ihr", "lernt", "macht", "arbeitet", "wohnt", "kommt", "heißt"],
  ["sie / Sie", "lernen", "machen", "arbeiten", "wohnen", "kommen", "heißen"],
];

const knowledgeQuestions = [
  {
    question: "1. What does ihr mean when it is the subject of a sentence?",
    options: ["you, formal", "you guys / you all, informal", "they", "she"],
    answer: 1,
    explanation: "ihr addresses two or more people informally. The verb normally ends in -t.",
  },
  {
    question: "2. Choose the correct form: Ihr ___ in Accra.",
    options: ["wohne", "wohnst", "wohnt", "wohnen"],
    answer: 2,
    explanation: "ihr takes the -t form: ihr wohnt.",
  },
  {
    question: "3. Which sentence formally asks one adult where they come from?",
    options: ["Woher kommst du?", "Woher kommt ihr?", "Woher kommen Sie?", "Woher kommen sie?"],
    answer: 2,
    explanation: "Formal Sie uses the same -en verb form as wir and sie: Sie kommen.",
  },
  {
    question: "4. What does Sie mean in: Sie kommt aus Berlin?",
    options: ["she", "they", "formal you", "you guys"],
    answer: 0,
    explanation: "The verb kommt is singular. Here Sie is sentence-initial sie meaning she.",
  },
  {
    question: "5. At the beginning of a sentence, Sie kommen aus Ghana can mean:",
    options: ["only she", "formal you or they, depending on context", "only you guys", "only he"],
    answer: 1,
    explanation: "At sentence start, both sie and formal Sie appear with a capital S. The -en form fits both they and formal you, so context decides.",
  },
  {
    question: "6. Which sentence clearly means they because sie is inside the sentence and lowercase?",
    options: ["Sie arbeiten heute.", "Heute arbeiten Sie.", "Heute arbeiten sie.", "Ihr arbeitet heute."],
    answer: 2,
    explanation: "Inside a sentence, lowercase sie means they or she. The plural verb arbeiten shows that it means they.",
  },
  {
    question: "7. Choose the correct form: Du ___ in einem Büro.",
    options: ["arbeite", "arbeitst", "arbeitest", "arbeiten"],
    answer: 2,
    explanation: "With stems ending in -t or -d, German adds an extra e: du arbeitest.",
  },
  {
    question: "8. Choose the correct form: Wir ___ aus Ghana.",
    options: ["komme", "kommst", "kommt", "kommen"],
    answer: 3,
    explanation: "wir takes the infinitive ending -en: wir kommen.",
  },
];

const A1Day3Kapitel12GrammarNotesPage = () => {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);

  const score = useMemo(
    () => knowledgeQuestions.reduce((total, item, index) => total + (answers[index] === item.answer ? 1 : 0), 0),
    [answers]
  );
  const allAnswered = Object.keys(answers).length === knowledgeQuestions.length;

  const selectAnswer = (questionIndex, optionIndex) => {
    if (checked) return;
    setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }));
  };

  const resetTest = () => {
    setAnswers({});
    setChecked(false);
  };

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 10 }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          A1 · Day 3 · Kapitel 1.2 · German Subject Pronouns, Verb Conjugation and Introducing Yourself
        </h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Learn all German subject pronouns, conjugate useful everyday verbs, distinguish informal and formal “you,” and introduce yourself.
        </p>
      </header>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>1) German subject pronouns</h2>
        <div style={noteStyle}>
          <p style={{ margin: 0 }}>
            A subject pronoun tells us <strong>who performs the action</strong>. This lesson includes singular,
            plural, informal and formal forms—not only one-person pronouns.
          </p>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thTdStyle}>German</th>
                <th style={thTdStyle}>English</th>
                <th style={thTdStyle}>When to use it</th>
                <th style={thTdStyle}>Example</th>
              </tr>
            </thead>
            <tbody>
              {pronounRows.map((row) => (
                <tr key={`${row[0]}-${row[1]}`}>
                  {row.map((cell) => (
                    <td key={cell} style={thTdStyle}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>2) Verb endings in the present tense</h2>
        <div style={noteStyle}>
          <p style={{ margin: 0 }}>
            Remove <strong>-en</strong> from a regular verb to find the stem, then add the correct ending:
            <strong> ich -e, du -st, er/sie/es -t, wir -en, ihr -t, sie/Sie -en</strong>.
          </p>
          <p style={{ margin: "8px 0 0" }}>
            Example: <strong>wohnen → wohn- → ich wohne, du wohnst, ihr wohnt, wir wohnen</strong>.
          </p>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thTdStyle}>Pronoun</th>
                <th style={thTdStyle}>lernen</th>
                <th style={thTdStyle}>machen</th>
                <th style={thTdStyle}>arbeiten</th>
                <th style={thTdStyle}>wohnen</th>
                <th style={thTdStyle}>kommen</th>
                <th style={thTdStyle}>heißen</th>
              </tr>
            </thead>
            <tbody>
              {conjugationRows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => (
                    <td key={cell} style={thTdStyle}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={noteStyle}>
          <p style={{ margin: 0 }}><strong>Meaning:</strong> lernen = learn, machen = do/make, arbeiten = work, wohnen = live/reside, kommen = come, heißen = be called.</p>
          <ul style={{ margin: "8px 0 0", paddingLeft: 20, lineHeight: 1.7 }}>
            <li><strong>arbeiten</strong> needs an extra <strong>e</strong> in some forms: du arbeitest, er arbeitet, ihr arbeitet.</li>
            <li><strong>heißen</strong> does not add another s sound: du heißt, er heißt, ihr heißt.</li>
          </ul>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>3) ihr means “you guys / you all”</h2>
        <div style={noteStyle}>
          <p style={{ margin: 0 }}>
            Use <strong>ihr</strong> when speaking informally to <strong>two or more people</strong>. It is the plural partner of <strong>du</strong>.
          </p>
          <p style={{ margin: "8px 0 0" }}>
            <strong>Du wohnst in Accra.</strong> = You live in Accra. (one friend)
            <br /><strong>Ihr wohnt in Accra.</strong> = You guys live in Accra. (several friends)
          </p>
          <p style={{ margin: "8px 0 0" }}>
            Memory rule: <strong>ihr normally takes a verb ending in -t</strong>: ihr lernt, ihr macht, ihr arbeitet, ihr wohnt, ihr kommt, ihr heißt.
          </p>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>4) How to distinguish sie, Sie and ihr</h2>
        <div style={noteStyle}>
          <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 10, lineHeight: 1.65 }}>
            <li><strong>sie + singular -t verb</strong> usually means <strong>she</strong>: sie kommt, sie wohnt, sie arbeitet.</li>
            <li><strong>sie + plural -en verb</strong> means <strong>they</strong>: sie kommen, sie wohnen, sie arbeiten.</li>
            <li><strong>Sie + -en verb</strong> means formal <strong>you</strong>: Kommen Sie? Wohnen Sie hier?</li>
            <li><strong>ihr + -t verb</strong> means informal plural <strong>you guys / you all</strong>: ihr kommt, ihr wohnt, ihr arbeitet.</li>
          </ul>
        </div>
        <div style={{ ...noteStyle, background: "#fff7ed", borderColor: "#fed7aa" }}>
          <p style={{ margin: 0 }}><strong>Important: At the beginning of a sentence, capitalization alone is not enough.</strong></p>
          <p style={{ margin: "8px 0 0" }}>
            German capitalizes the first word of every sentence. Therefore, sentence-initial <strong>Sie</strong> may be formal you,
            she or they. Check the <strong>verb ending</strong> and the <strong>conversation context</strong>.
          </p>
          <ul style={{ margin: "8px 0 0", paddingLeft: 20, lineHeight: 1.7 }}>
            <li><strong>Sie kommt aus Berlin.</strong> → she, because <em>kommt</em> is singular.</li>
            <li><strong>Sie kommen aus Berlin.</strong> → formal you or they; the context tells you which one.</li>
            <li><strong>Heute kommen sie.</strong> → they, because lowercase <em>sie</em> appears inside the sentence.</li>
            <li><strong>Woher kommen Sie?</strong> → formal you, because the speaker is directly and politely addressing someone.</li>
          </ul>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>5) Introducing yourself</h2>
        <div style={noteStyle}>
          <p style={{ margin: 0 }}><strong>Useful patterns:</strong></p>
          <ul style={{ margin: "8px 0 0", paddingLeft: 20, lineHeight: 1.7 }}>
            <li>Ich heiße Ama.</li>
            <li>Ich komme aus Ghana.</li>
            <li>Ich wohne in Accra.</li>
            <li>Ich arbeite als Lehrerin. / Ich bin Student.</li>
            <li>Ich lerne Deutsch.</li>
          </ul>
          <p style={{ margin: "8px 0 0" }}>
            Example: <em>Hallo! Ich heiße Ama. Ich komme aus Ghana und wohne in Accra. Ich arbeite als Lehrerin und lerne Deutsch.</em>
          </p>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>6) Multiple-choice knowledge test</h2>
        <p style={{ margin: 0, color: "#475569" }}>
          Choose one answer for every question. Then check your score.
        </p>

        {knowledgeQuestions.map((item, questionIndex) => (
          <div key={item.question} style={questionStyle}>
            <strong>{item.question}</strong>
            <div style={{ display: "grid", gap: 8 }}>
              {item.options.map((option, optionIndex) => {
                const selected = answers[questionIndex] === optionIndex;
                const correct = item.answer === optionIndex;
                const background = checked
                  ? correct
                    ? "#ecfdf5"
                    : selected
                      ? "#fef2f2"
                      : "#fff"
                  : selected
                    ? "#eff6ff"
                    : "#fff";
                const borderColor = checked
                  ? correct
                    ? "#16a34a"
                    : selected
                      ? "#dc2626"
                      : "#cbd5e1"
                  : selected
                    ? "#2563eb"
                    : "#cbd5e1";

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => selectAnswer(questionIndex, optionIndex)}
                    style={{
                      textAlign: "left",
                      border: `1px solid ${borderColor}`,
                      borderRadius: 10,
                      padding: "10px 12px",
                      background,
                      cursor: checked ? "default" : "pointer",
                      fontSize: 15,
                    }}
                  >
                    {String.fromCharCode(65 + optionIndex)}) {option}
                  </button>
                );
              })}
            </div>
            {checked ? (
              <p style={{ margin: 0, color: answers[questionIndex] === item.answer ? "#166534" : "#991b1b", lineHeight: 1.55 }}>
                <strong>{answers[questionIndex] === item.answer ? "Correct." : "Review this point."}</strong> {item.explanation}
              </p>
            ) : null}
          </div>
        ))}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <button
            type="button"
            disabled={!allAnswered || checked}
            onClick={() => setChecked(true)}
            style={{
              ...styles.button,
              opacity: !allAnswered || checked ? 0.55 : 1,
              cursor: !allAnswered || checked ? "not-allowed" : "pointer",
            }}
          >
            Check answers
          </button>
          {checked ? (
            <button type="button" onClick={resetTest} style={styles.secondaryButton || styles.button}>
              Try again
            </button>
          ) : null}
          {checked ? <strong>Score: {score}/{knowledgeQuestions.length}</strong> : null}
        </div>
      </section>
    </main>
  );
};

export default A1Day3Kapitel12GrammarNotesPage;
