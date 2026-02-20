import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const Section = ({ title, children }) => (
  <section style={{ ...styles.card, display: "grid", gap: 12 }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const BulletList = ({ items }) => (
  <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

const twoWayPrepositionPairs = [
  {
    preposition: "an",
    meaning: "on, at",
    accusative: "Ich hänge das Bild an die Wand.",
    dative: "Das Bild hängt an der Wand.",
  },
  {
    preposition: "auf",
    meaning: "on, onto",
    accusative: "Ich stelle die Vase auf den Tisch.",
    dative: "Die Vase steht auf dem Tisch.",
  },
  {
    preposition: "hinter",
    meaning: "behind",
    accusative: "Er geht hinter das Haus.",
    dative: "Er ist hinter dem Haus.",
  },
  {
    preposition: "in",
    meaning: "in, into",
    accusative: "Sie geht in die Stadt.",
    dative: "Sie ist in der Stadt.",
  },
  {
    preposition: "neben",
    meaning: "next to",
    accusative: "Stell den Stuhl neben die Tür.",
    dative: "Der Stuhl steht neben der Tür.",
  },
  {
    preposition: "über",
    meaning: "over, above",
    accusative: "Der Vogel fliegt über das Haus.",
    dative: "Die Lampe hängt über dem Tisch.",
  },
  {
    preposition: "unter",
    meaning: "under, below",
    accusative: "Die Katze läuft unter den Tisch.",
    dative: "Die Katze schläft unter dem Tisch.",
  },
  {
    preposition: "vor",
    meaning: "in front of",
    accusative: "Ich stelle das Auto vor das Haus.",
    dative: "Das Auto steht vor dem Haus.",
  },
  {
    preposition: "zwischen",
    meaning: "between",
    accusative: "Er legt das Buch zwischen die anderen Bücher.",
    dative: "Das Buch ist zwischen den anderen Büchern.",
  },
];

const woFillInQuestions = [
  { hint: "(pharmacy)", expected: "Ich bin in der Apotheke." },
  { hint: "(bookstore)", expected: "Ich bin in der Buchhandlung." },
  { hint: "(cinema)", expected: "Ich bin im Kino." },
  { hint: "(museum)", expected: "Ich bin im Museum." },
  { hint: "(school)", expected: "Ich bin in der Schule." },
  { hint: "(theater)", expected: "Ich bin im Theater." },
  { hint: "(supermarket)", expected: "Ich bin im Supermarkt." },
  { hint: "(circus)", expected: "Ich bin im Zirkus." },
];

const wohinFillInQuestions = [
  { hint: "(pharmacy)", expected: "Ich gehe in die Apotheke." },
  { hint: "(bookstore)", expected: "Ich gehe in die Buchhandlung." },
  { hint: "(cinema)", expected: "Ich gehe ins Kino." },
  { hint: "(museum)", expected: "Ich gehe ins Museum." },
  { hint: "(school)", expected: "Ich gehe in die Schule." },
  { hint: "(theater)", expected: "Ich gehe ins Theater." },
  { hint: "(supermarket)", expected: "Ich gehe in den Supermarkt." },
  { hint: "(circus)", expected: "Ich gehe in den Zirkus." },
];

const quizBank = [
  {
    sentence: "Ich gehe in ___ Schule.",
    options: ["der", "die", "dem", "den"],
    correct: "die",
    explanation: "Movement/destination (Wohin?) uses accusative.",
  },
  {
    sentence: "Ich bin in ___ Schule.",
    options: ["der", "die", "dem", "den"],
    correct: "der",
    explanation: "Static location (Wo?) uses dative.",
  },
  {
    sentence: "Das Bild hängt an ___ Wand.",
    options: ["die", "der", "den", "dem"],
    correct: "der",
    explanation: "No movement, so dative.",
  },
  {
    sentence: "Ich hänge das Bild an ___ Wand.",
    options: ["die", "der", "den", "dem"],
    correct: "die",
    explanation: "Action changes position, so accusative.",
  },
  {
    sentence: "Sie stellt die Lampe über ___ Tisch.",
    options: ["dem", "den", "der", "die"],
    correct: "den",
    explanation: "Putting something somewhere = movement/change.",
  },
  {
    sentence: "Die Lampe hängt über ___ Tisch.",
    options: ["dem", "den", "der", "die"],
    correct: "dem",
    explanation: "Already hanging (static), so dative.",
  },
  {
    sentence: "Die Katze läuft unter ___ Tisch.",
    options: ["dem", "den", "der", "die"],
    correct: "den",
    explanation: "Running to destination = accusative.",
  },
  {
    sentence: "Die Katze schläft unter ___ Tisch.",
    options: ["dem", "den", "der", "die"],
    correct: "dem",
    explanation: "Sleeping location = dative.",
  },
  {
    sentence: "Er geht hinter ___ Haus.",
    options: ["dem", "das", "der", "den"],
    correct: "das",
    explanation: "He goes behind it (destination), accusative.",
  },
  {
    sentence: "Er ist hinter ___ Haus.",
    options: ["dem", "das", "der", "den"],
    correct: "dem",
    explanation: "He is behind it (static), dative.",
  },
  {
    sentence: "Ich stelle das Auto vor ___ Haus.",
    options: ["das", "dem", "der", "den"],
    correct: "das",
    explanation: "Parking action to a spot = accusative.",
  },
  {
    sentence: "Das Auto steht vor ___ Haus.",
    options: ["das", "dem", "der", "den"],
    correct: "dem",
    explanation: "Car position is static = dative.",
  },
];

const mistakes = [
  {
    wrong: "Ich bin in die Schule.",
    correct: "Ich bin in der Schule.",
    note: "Use dative for static location (Wo?).",
  },
  {
    wrong: "Ich gehe in der Schule.",
    correct: "Ich gehe in die Schule.",
    note: "Use accusative for destination (Wohin?).",
  },
  {
    wrong: "Das Buch liegt auf den Tisch.",
    correct: "Das Buch liegt auf dem Tisch.",
    note: "liegen is static, so use dative.",
  },
  {
    wrong: "Er legt das Buch auf dem Tisch.",
    correct: "Er legt das Buch auf den Tisch.",
    note: "legen implies movement/change to a place.",
  },
];

const normalize = (value) => value.trim().toLowerCase().replace(/\s+/g, " ");

const shuffleItems = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const getBand = (score, total) => {
  const pct = (score / total) * 100;
  if (pct < 50) return "Beginner";
  if (pct < 80) return "Good";
  return "Excellent";
};

const FillInExercise = ({ title, prompt, questions, notes }) => {
  const [inputs, setInputs] = useState({});
  const [checked, setChecked] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  const score = useMemo(
    () =>
      questions.reduce((total, question, index) => {
        if (normalize(inputs[index] || "") === normalize(question.expected)) {
          return total + 1;
        }
        return total;
      }, 0),
    [inputs, questions]
  );

  return (
    <Section title={title}>
      <p style={{ margin: 0 }}>{prompt}</p>
      <div style={{ display: "grid", gap: 8 }}>
        {questions.map((question, index) => {
          const userAnswer = inputs[index] || "";
          const isCorrect = normalize(userAnswer) === normalize(question.expected);
          return (
            <div key={`${title}-${question.hint}`} style={{ display: "grid", gap: 6 }}>
              <label htmlFor={`${title}-${index}`}>
                {index + 1}. {question.hint}
              </label>
              <input
                id={`${title}-${index}`}
                value={userAnswer}
                onChange={(event) => setInputs((prev) => ({ ...prev, [index]: event.target.value }))}
                placeholder="Type your answer in German"
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid #d1d5db",
                  fontSize: 14,
                }}
              />
              {checked && (
                <span style={{ color: isCorrect ? "#166534" : "#b91c1c", fontSize: 13 }}>
                  {isCorrect ? "Correct ✅" : "Check case and article."}
                </span>
              )}
              {showAnswers && <span style={{ fontSize: 13 }}>Answer: {question.expected}</span>}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button style={styles.secondaryButton} onClick={() => setChecked(true)}>
          Check answers
        </button>
        <button style={styles.secondaryButton} onClick={() => setShowAnswers((prev) => !prev)}>
          {showAnswers ? "Hide answers" : "Reveal answers"}
        </button>
      </div>
      {checked && (
        <p style={{ margin: 0 }}>
          Score: {score}/{questions.length}
        </p>
      )}
      <BulletList items={notes} />
    </Section>
  );
};

const TwoCasePrepositionsPage = () => {
  const navigate = useNavigate();
  const [quizQuestions, setQuizQuestions] = useState(() => shuffleItems(quizBank).slice(0, 12));
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  const quizScore = useMemo(
    () =>
      quizQuestions.reduce((total, question, index) => {
        if (quizAnswers[index] === question.correct) {
          return total + 1;
        }
        return total;
      }, 0),
    [quizAnswers, quizQuestions]
  );

  const restartQuiz = (onlyIncorrect = false) => {
    if (onlyIncorrect) {
      const incorrect = quizQuestions.filter((question, index) => quizAnswers[index] !== question.correct);
      if (incorrect.length > 0) {
        setQuizQuestions(shuffleItems(incorrect));
      }
    } else {
      setQuizQuestions(shuffleItems(quizBank).slice(0, 12));
    }
    setQuizAnswers({});
    setShowQuizResults(false);
  };

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Day 18: Two-Case Prepositions (Wechselpräpositionen)</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          In German, prepositions belong to their own “families” just like verbs, and they can change the case of the
          noun that follows.
        </p>
      </div>

      <Section title="1) Two-way prepositions + full dual examples">
        <p style={{ margin: 0 }}>
          Use accusative for movement/change of location and dative for static location.
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr>
                <th style={{ borderBottom: "1px solid #d1d5db", textAlign: "left", padding: 8 }}>Preposition</th>
                <th style={{ borderBottom: "1px solid #d1d5db", textAlign: "left", padding: 8 }}>Meaning</th>
                <th style={{ borderBottom: "1px solid #d1d5db", textAlign: "left", padding: 8 }}>Accusative (Wohin?)</th>
                <th style={{ borderBottom: "1px solid #d1d5db", textAlign: "left", padding: 8 }}>Dative (Wo?)</th>
              </tr>
            </thead>
            <tbody>
              {twoWayPrepositionPairs.map((item) => (
                <tr key={item.preposition}>
                  <td style={{ borderBottom: "1px solid #eef2f7", padding: 8 }}>
                    <strong>{item.preposition}</strong>
                  </td>
                  <td style={{ borderBottom: "1px solid #eef2f7", padding: 8 }}>{item.meaning}</td>
                  <td style={{ borderBottom: "1px solid #eef2f7", padding: 8 }}>{item.accusative}</td>
                  <td style={{ borderBottom: "1px solid #eef2f7", padding: 8 }}>{item.dative}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="2) Wo vs Wohin decision helper">
        <div
          style={{
            border: "1px solid #dbeafe",
            background: "#eff6ff",
            borderRadius: 12,
            padding: 12,
            display: "grid",
            gap: 8,
          }}
        >
          <div>1. Ask: <strong>Am I moving to a destination?</strong></div>
          <div>→ Yes: use <strong>accusative</strong> (Wohin?).</div>
          <div>→ No: ask if I am already in a place.</div>
          <div>2. If static position: use <strong>dative</strong> (Wo?).</div>
          <div>Quick memory: <strong>Wohin = movement</strong>, <strong>Wo = location</strong>.</div>
        </div>
      </Section>

      <FillInExercise
        title='3) Assignment: Answer "Wo bist du?"'
        prompt="For static locations (no movement), use dative. Complete the blanks."
        questions={woFillInQuestions}
        notes={[
          "Useful places: die Apotheke, die Buchhandlung, das Kino, das Museum, die Schule, das Theater, der Supermarkt, der Zirkus.",
          "Short note: im = in dem.",
        ]}
      />

      <FillInExercise
        title='4) Assignment: Answer "Wohin gehst du?"'
        prompt="For destinations (movement), use accusative. Complete the blanks."
        questions={wohinFillInQuestions}
        notes={["Short note: ins = in das, and am = an dem."]}
      />

      <Section title="5) Mini-quiz game (12 randomized questions)">
        <p style={{ margin: 0 }}>Pick the correct article/case. Then submit to see explanations and your level.</p>
        <div style={{ display: "grid", gap: 12 }}>
          {quizQuestions.map((question, index) => {
            const selected = quizAnswers[index];
            const isCorrect = selected === question.correct;
            return (
              <div
                key={`${question.sentence}-${index}`}
                style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, display: "grid", gap: 8 }}
              >
                <strong>
                  {index + 1}. {question.sentence}
                </strong>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {question.options.map((option) => (
                    <button
                      key={`${question.sentence}-${option}`}
                      onClick={() => setQuizAnswers((prev) => ({ ...prev, [index]: option }))}
                      style={{
                        ...styles.secondaryButton,
                        minWidth: 72,
                        background: selected === option ? "#dbeafe" : styles.secondaryButton.background,
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {showQuizResults && (
                  <div style={{ fontSize: 13 }}>
                    <div style={{ color: isCorrect ? "#166534" : "#b91c1c" }}>
                      {isCorrect ? "Correct ✅" : `Incorrect. Correct answer: ${question.correct}`}
                    </div>
                    <div>{question.explanation}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button style={styles.secondaryButton} onClick={() => setShowQuizResults(true)}>
            Submit quiz
          </button>
          <button style={styles.secondaryButton} onClick={() => restartQuiz(true)}>
            Try again (incorrect only)
          </button>
          <button style={styles.secondaryButton} onClick={() => restartQuiz(false)}>
            Shuffle new quiz
          </button>
        </div>

        {showQuizResults && (
          <p style={{ margin: 0 }}>
            Final score: {quizScore}/{quizQuestions.length} — Level: <strong>{getBand(quizScore, quizQuestions.length)}</strong>
          </p>
        )}
      </Section>

      <Section title="6) Common mistakes and corrections">
        <div style={{ display: "grid", gap: 8 }}>
          {mistakes.map((item) => (
            <div key={item.wrong} style={{ border: "1px solid #fee2e2", borderRadius: 10, padding: 10, display: "grid", gap: 4 }}>
              <div>
                ❌ {item.wrong}
              </div>
              <div>
                ✅ {item.correct}
              </div>
              <div style={{ fontSize: 13 }}>{item.note}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default TwoCasePrepositionsPage;
