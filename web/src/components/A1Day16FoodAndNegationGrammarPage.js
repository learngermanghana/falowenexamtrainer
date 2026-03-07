import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const tableCell = {
  padding: 10,
  borderBottom: "1px solid #eee",
  verticalAlign: "top",
};

const tableHead = {
  ...tableCell,
  fontWeight: 700,
  borderBottom: "1px solid #d9d9d9",
  background: "#fafafa",
};

const tipBox = {
  padding: 14,
  borderRadius: 12,
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
};

const miniCard = {
  padding: 14,
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  background: "#fff",
  display: "grid",
  gap: 6,
};

const chip = {
  display: "inline-block",
  padding: "6px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
  background: "#eef2ff",
  color: "#3730a3",
};

const inputStyle = {
  padding: 12,
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  outline: "none",
  fontSize: 15,
  fontFamily: "inherit",
  boxSizing: "border-box",
  width: "100%",
};

// Fixed Unsplash image, no API key needed
const heroImage =
  "https://images.unsplash.com/photo-1759216279330-c5a83a0a1ebe?auto=format&fit=crop&fm=jpg&q=80&w=1600";

const photoCredit = {
  photographer: "Raamin ka",
  photographerUrl: "https://unsplash.com/@raaminka",
  photoPage:
    "https://unsplash.com/photos/a-table-laden-with-breakfast-dishes-tea-and-coffee-FRiaAccwwMA",
};

const negationRows = [
  {
    type: "Verb / action",
    placement: "Usually later in the sentence or at the end",
    example: "Er arbeitet heute nicht.",
    meaning: "He is not working today.",
  },
  {
    type: "Adjective",
    placement: "Put nicht before the adjective",
    example: "Die Suppe ist nicht heiß.",
    meaning: "The soup is not hot.",
  },
  {
    type: "Adverb",
    placement: "Put nicht before the adverb",
    example: "Sie kocht nicht oft.",
    meaning: "She does not cook often.",
  },
  {
    type: "Prepositional phrase",
    placement: "Put nicht before the place or time phrase",
    example: "Wir essen nicht im Restaurant.",
    meaning: "We are not eating in the restaurant.",
  },
  {
    type: "Noun phrase with article",
    placement: "Put nicht before that noun phrase",
    example: "Das ist nicht mein Teller.",
    meaning: "That is not my plate.",
  },
];

const adjectiveComparisonRows = [
  {
    positive: "schnell",
    comparative: "schneller",
    superlative: "am schnellsten",
    english: "fast → faster → fastest",
  },
  {
    positive: "groß",
    comparative: "größer",
    superlative: "am größten",
    english: "big → bigger → biggest",
  },
  {
    positive: "klein",
    comparative: "kleiner",
    superlative: "am kleinsten",
    english: "small → smaller → smallest",
  },
  {
    positive: "jung",
    comparative: "jünger",
    superlative: "am jüngsten",
    english: "young → younger → youngest",
  },
  {
    positive: "alt",
    comparative: "älter",
    superlative: "am ältesten",
    english: "old → older → oldest",
  },
  {
    positive: "teuer",
    comparative: "teurer",
    superlative: "am teuersten",
    english: "expensive → more expensive → most expensive",
  },
  {
    positive: "schön",
    comparative: "schöner",
    superlative: "am schönsten",
    english: "beautiful → more beautiful → most beautiful",
  },
];

const answerKey = [
  "Nein, ich habe keinen Hund.",
  "Nein, ich esse heute keine Pizza.",
  "Nein, ich möchte keinen Kaffee oder Tee.",
  "Nein, ich gehe nicht oft ins Kino.",
  "Nein, das ist nicht mein neues Auto.",
  "Nein, ich habe kein Fahrrad.",
  "Nein, ich mag diesen Film nicht.",
  "Nein, ich lese das Buch von gestern nicht.",
  "Nein, ich habe kein Geld für die Reise.",
  "Nein, das Wetter ist heute nicht schön.",
];

const commonMistakes = [
  'Use "nein" only as an answer to a question.',
  'Use "kein" with nouns: Ich habe kein Brot.',
  'Use "nicht" for verbs, adjectives, adverbs, or one part of the sentence.',
  'Do not say: "Ich habe nicht Brot." Say: "Ich habe kein Brot."',
];

const vocabularyCards = [
  {
    german: "das Brot",
    english: "bread",
    example: "Ich habe kein Brot.",
    meaning: "I have no bread.",
  },
  {
    german: "die Suppe",
    english: "soup",
    example: "Die Suppe ist nicht heiß.",
    meaning: "The soup is not hot.",
  },
  {
    german: "der Kaffee",
    english: "coffee",
    example: "Nein, ich möchte keinen Kaffee.",
    meaning: "No, I do not want coffee.",
  },
  {
    german: "die Pizza",
    english: "pizza",
    example: "Ich esse heute keine Pizza.",
    meaning: "I am not eating pizza today.",
  },
  {
    german: "das Restaurant",
    english: "restaurant",
    example: "Wir essen nicht im Restaurant.",
    meaning: "We are not eating in the restaurant.",
  },
];

const quizQuestions = [
  {
    question: 'Which word means "no" as an answer?',
    options: ["nicht", "kein", "nein"],
    correct: "nein",
  },
  {
    question: "Which sentence is correct?",
    options: [
      "Ich habe nicht Brot.",
      "Ich habe kein Brot.",
      "Ich habe nein Brot.",
    ],
    correct: "Ich habe kein Brot.",
  },
  {
    question: 'Which word do you use with a noun?',
    options: ["nicht", "kein", "nein"],
    correct: "kein",
  },
  {
    question: 'Which sentence means "The soup is not hot"?',
    options: [
      "Die Suppe ist kein heiß.",
      "Die Suppe ist nicht heiß.",
      "Nein, die Suppe ist heiß.",
    ],
    correct: "Die Suppe ist nicht heiß.",
  },
  {
    question:
      'Complete the answer: Isst du Pizza? – ___, ich esse heute keine Pizza.',
    options: ["Kein", "Nicht", "Nein"],
    correct: "Nein",
  },
];

const fillInQuestions = [
  {
    sentence: "Ich habe ___ Brot.",
    answer: "kein",
    hint: "Use the word for a noun.",
  },
  {
    sentence: "Die Suppe ist ___ heiß.",
    answer: "nicht",
    hint: "Use the word for an adjective.",
  },
  {
    sentence: "Kommst du heute? – ___",
    answer: "Nein",
    hint: "Use the direct answer word.",
  },
  {
    sentence: "Wir essen ___ im Restaurant.",
    answer: "nicht",
    hint: "Use the word before the place phrase.",
  },
];

const starterSentences = [
  "Nein, ich ...",
  "Ich habe kein ...",
  "Das ist nicht ...",
  "Ich esse heute nicht ...",
];

const A1Day16FoodAndNegationGrammarPage = () => {
  const navigate = useNavigate();

  const [showAnswers, setShowAnswers] = useState(false);
  const [flashIndex, setFlashIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [fillAnswers, setFillAnswers] = useState({});
  const [showFillResults, setShowFillResults] = useState(false);
  const [writingText, setWritingText] = useState("");

  const currentCard = vocabularyCards[flashIndex];

  const quizScore = useMemo(() => {
    return quizQuestions.reduce((total, item, index) => {
      return total + (selectedAnswers[index] === item.correct ? 1 : 0);
    }, 0);
  }, [selectedAnswers]);

  const fillScore = useMemo(() => {
    return fillInQuestions.reduce((total, item, index) => {
      const value = (fillAnswers[index] || "").trim().toLowerCase();
      return total + (value === item.answer.toLowerCase() ? 1 : 0);
    }, 0);
  }, [fillAnswers]);

  const progressPercent = useMemo(() => {
    let steps = 0;
    if (showQuizResults) steps += 1;
    if (showFillResults) steps += 1;
    if (showAnswers) steps += 1;
    if (writingText.trim().length > 0) steps += 1;
    return (steps / 4) * 100;
  }, [showQuizResults, showFillResults, showAnswers, writingText]);

  const handleQuizSelect = (questionIndex, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));
  };

  const handleFillChange = (index, value) => {
    setFillAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const nextCard = () => {
    setFlashIndex((prev) => (prev + 1) % vocabularyCards.length);
  };

  const prevCard = () => {
    setFlashIndex(
      (prev) => (prev - 1 + vocabularyCards.length) % vocabularyCards.length
    );
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowQuizResults(false);
  };

  const resetFillExercise = () => {
    setFillAnswers({});
    setShowFillResults(false);
  };

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <section
        style={{
          ...styles.card,
          padding: 0,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            minHeight: 340,
            position: "relative",
            background:
              "linear-gradient(135deg, rgba(17,24,39,0.92), rgba(59,130,246,0.75))",
          }}
        >
          <img
            src={heroImage}
            alt="Food lesson cover"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(15,23,42,0.35), rgba(15,23,42,0.82))",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              padding: 20,
              display: "grid",
              gap: 12,
              color: "#fff",
            }}
          >
            <button
              style={{ ...styles.secondaryButton, width: "fit-content" }}
              onClick={() => navigate("/campus/course")}
            >
              Back to Course
            </button>

            <div
              style={{
                width: "fit-content",
                padding: "6px 10px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.15)",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Kapitel: 9_10
            </div>

            <div style={{ display: "grid", gap: 8, maxWidth: 760 }}>
              <h1 style={{ ...styles.title, margin: 0, color: "#fff" }}>
                Day 16: Food and Negation
              </h1>
              <p
                style={{
                  ...styles.subtitle,
                  margin: 0,
                  color: "rgba(255,255,255,0.92)",
                }}
              >
                Learn how to say <strong>no</strong> in German with{" "}
                <strong>nein</strong>, <strong>nicht</strong>, and{" "}
                <strong>kein</strong>. The explanations are in simple English.
              </p>
            </div>

            <div style={{ display: "grid", gap: 8, maxWidth: 420 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  color: "rgba(255,255,255,0.92)",
                }}
              >
                <span>Lesson progress</span>
                <span>{Math.round(progressPercent)}% completed</span>
              </div>
              <div
                style={{
                  height: 10,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.22)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${progressPercent}%`,
                    height: "100%",
                    background: "#fff",
                    borderRadius: 999,
                  }}
                />
              </div>
            </div>

            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "rgba(255,255,255,0.88)",
              }}
            >
              Photo by{" "}
              <a
                href={photoCredit.photographerUrl}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#fff", fontWeight: 700 }}
              >
                {photoCredit.photographer}
              </a>{" "}
              on{" "}
              <a
                href={photoCredit.photoPage}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#fff", fontWeight: 700 }}
              >
                Unsplash
              </a>
            </p>
          </div>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        <div style={miniCard}>
          <strong>Nein</strong>
          <span>Use it as a full answer to a yes/no question.</span>
          <span>
            <strong>Example:</strong> Kommst du? – Nein.
          </span>
          <span>
            <strong>English:</strong> Are you coming? – No.
          </span>
        </div>

        <div style={miniCard}>
          <strong>Nicht</strong>
          <span>Use it to say not.</span>
          <span>
            <strong>Example:</strong> Ich koche heute nicht.
          </span>
          <span>
            <strong>English:</strong> I am not cooking today.
          </span>
        </div>

        <div style={miniCard}>
          <strong>Kein</strong>
          <span>Use it with nouns.</span>
          <span>
            <strong>Example:</strong> Ich habe kein Brot.
          </span>
          <span>
            <strong>English:</strong> I have no bread.
          </span>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>1) Quick Note</h2>
        <div style={tipBox}>
          <p style={{ margin: 0 }}>
            <strong>Easy rule:</strong> Use <strong>nein</strong> to answer a
            question. Use <strong>nicht</strong> to say <em>not</em>. Use{" "}
            <strong>kein</strong> to say <em>no / not a / not any</em> with
            nouns.
          </p>
        </div>
        <p style={{ margin: 0 }}>
          This lesson helps you say that you do not want something, do not do
          something, or do not have something.
        </p>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>2) "Nicht" = not</h2>
        <p style={{ margin: 0 }}>
          Use <strong>nicht</strong> when you want to negate a verb, an
          adjective, an adverb, or one part of the sentence.
        </p>

        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>
            <strong>Ich esse heute nicht.</strong> — I am not eating today.
          </li>
          <li>
            <strong>Die Suppe ist nicht warm.</strong> — The soup is not warm.
          </li>
          <li>
            <strong>Er kocht nicht oft.</strong> — He does not cook often.
          </li>
          <li>
            <strong>Wir essen nicht im Garten.</strong> — We are not eating in
            the garden.
          </li>
          <li>
            <strong>Das ist nicht mein Teller.</strong> — That is not my plate.
          </li>
        </ul>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={tableHead}>What is negated?</th>
                <th style={tableHead}>Where does nicht go?</th>
                <th style={tableHead}>German example</th>
                <th style={tableHead}>English meaning</th>
              </tr>
            </thead>
            <tbody>
              {negationRows.map((row) => (
                <tr key={row.type}>
                  <td style={tableCell}>{row.type}</td>
                  <td style={tableCell}>{row.placement}</td>
                  <td style={tableCell}>{row.example}</td>
                  <td style={tableCell}>{row.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>3) "Kein" = no / not a / not any</h2>
        <p style={{ margin: 0 }}>
          Use <strong>kein</strong> with nouns. It often replaces{" "}
          <strong>ein</strong> or <strong>eine</strong>.
        </p>

        <div style={tipBox}>
          <p style={{ margin: 0 }}>
            <strong>Simple idea:</strong>
            <br />
            <strong>ein Brot</strong> → <strong>kein Brot</strong>
            <br />
            <strong>eine Pizza</strong> → <strong>keine Pizza</strong>
          </p>
        </div>

        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>
            <strong>Ich habe kein Brot.</strong> — I have no bread.
          </li>
          <li>
            <strong>Sie kauft keine Pizza.</strong> — She is not buying pizza.
          </li>
          <li>
            <strong>Wir haben keine Eier.</strong> — We have no eggs.
          </li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>4) "Nein" = no</h2>
        <p style={{ margin: 0 }}>
          Use <strong>nein</strong> as a direct answer to a yes/no question.
        </p>

        <div style={tipBox}>
          <p style={{ margin: 0 }}>
            <strong>Kommst du heute?</strong> — Are you coming today?
          </p>
          <p style={{ margin: "8px 0 0" }}>
            <strong>Nein.</strong> — No.
          </p>
          <p style={{ margin: "8px 0 0" }}>
            <strong>Nein, ich komme heute nicht.</strong> — No, I am not coming
            today.
          </p>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>
          5) Adjectives: Positive, Comparative, Superlative
        </h2>
        <p style={{ margin: 0 }}>
          The positive form is the base form. The comparative is usually{" "}
          <strong>-er</strong> plus <strong>als</strong>. The superlative is
          often <strong>am ... -sten</strong>.
        </p>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={tableHead}>Positive</th>
                <th style={tableHead}>Comparative</th>
                <th style={tableHead}>Superlative</th>
                <th style={tableHead}>English help</th>
              </tr>
            </thead>
            <tbody>
              {adjectiveComparisonRows.map((row) => (
                <tr key={row.positive}>
                  <td style={tableCell}>{row.positive}</td>
                  <td style={tableCell}>{row.comparative}</td>
                  <td style={tableCell}>{row.superlative}</td>
                  <td style={tableCell}>{row.english}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={tipBox}>
          <p style={{ margin: 0 }}>
            <strong>Example:</strong>
          </p>
          <p style={{ margin: "8px 0 0" }}>
            Die Suppe ist <strong>warm</strong>. — The soup is warm.
            <br />
            Der Tee ist <strong>wärmer</strong>. — The tea is warmer.
            <br />
            Der Kaffee ist <strong>am wärmsten</strong>. — The coffee is the
            warmest.
          </p>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>6) Vocabulary Flashcards</h2>

        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            padding: 20,
            background: "linear-gradient(180deg, #ffffff, #f8fafc)",
            display: "grid",
            gap: 12,
          }}
        >
          <span style={chip}>
            Card {flashIndex + 1} / {vocabularyCards.length}
          </span>

          <h3 style={{ margin: 0, fontSize: 28 }}>{currentCard.german}</h3>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
            {currentCard.english}
          </p>
          <p style={{ margin: 0, color: "#475569" }}>
            <strong>German:</strong> {currentCard.example}
          </p>
          <p style={{ margin: 0, color: "#475569" }}>
            <strong>English:</strong> {currentCard.meaning}
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              style={{ ...styles.secondaryButton, width: "fit-content" }}
              onClick={prevCard}
            >
              Previous
            </button>
            <button
              style={{ ...styles.primaryButton, width: "fit-content" }}
              onClick={nextCard}
            >
              Next Card
            </button>
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>7) Mini Quiz</h2>
        <p style={{ margin: 0 }}>Choose the correct answer for each question.</p>

        <div style={{ display: "grid", gap: 16 }}>
          {quizQuestions.map((item, questionIndex) => (
            <div
              key={item.question}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 14,
                padding: 16,
                display: "grid",
                gap: 12,
              }}
            >
              <p style={{ margin: 0, fontWeight: 700 }}>
                {questionIndex + 1}. {item.question}
              </p>

              <div style={{ display: "grid", gap: 8 }}>
                {item.options.map((option) => {
                  const isSelected = selectedAnswers[questionIndex] === option;
                  const isCorrect = item.correct === option;

                  let border = "1px solid #d1d5db";
                  let background = "#fff";

                  if (isSelected) {
                    border = "2px solid #2563eb";
                    background = "#eff6ff";
                  }

                  if (showQuizResults && isCorrect) {
                    border = "2px solid #16a34a";
                    background = "#f0fdf4";
                  }

                  if (showQuizResults && isSelected && !isCorrect) {
                    border = "2px solid #dc2626";
                    background = "#fef2f2";
                  }

                  return (
                    <button
                      key={option}
                      onClick={() => handleQuizSelect(questionIndex, option)}
                      style={{
                        textAlign: "left",
                        padding: 12,
                        borderRadius: 12,
                        border,
                        background,
                        cursor: "pointer",
                        fontSize: 15,
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {showQuizResults && (
                <p style={{ margin: 0, fontSize: 14 }}>
                  <strong>Correct answer:</strong> {item.correct}
                </p>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            style={{ ...styles.primaryButton, width: "fit-content" }}
            onClick={() => setShowQuizResults(true)}
          >
            Check Answers
          </button>

          <button
            style={{ ...styles.secondaryButton, width: "fit-content" }}
            onClick={resetQuiz}
          >
            Reset Quiz
          </button>
        </div>

        {showQuizResults && (
          <div style={tipBox}>
            <p style={{ margin: 0 }}>
              <strong>Your score:</strong> {quizScore} / {quizQuestions.length}
            </p>
          </div>
        )}
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>8) Fill in the Gaps</h2>
        <p style={{ margin: 0 }}>Type the missing word in each sentence.</p>

        <div style={{ display: "grid", gap: 14 }}>
          {fillInQuestions.map((item, index) => {
            const userValue = fillAnswers[index] || "";
            const isCorrect =
              userValue.trim().toLowerCase() === item.answer.toLowerCase();

            return (
              <div
                key={item.sentence}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 14,
                  padding: 16,
                  display: "grid",
                  gap: 10,
                }}
              >
                <p style={{ margin: 0, fontWeight: 600 }}>
                  {index + 1}. {item.sentence}
                </p>

                <input
                  value={userValue}
                  onChange={(e) => handleFillChange(index, e.target.value)}
                  placeholder="Type your answer"
                  style={inputStyle}
                />

                <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>
                  <strong>Hint:</strong> {item.hint}
                </p>

                {showFillResults && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      color: isCorrect ? "#15803d" : "#b91c1c",
                      fontWeight: 600,
                    }}
                  >
                    {isCorrect ? "✓ Correct" : `✗ Correct answer: ${item.answer}`}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            style={{ ...styles.primaryButton, width: "fit-content" }}
            onClick={() => setShowFillResults(true)}
          >
            Check Fill Answers
          </button>

          <button
            style={{ ...styles.secondaryButton, width: "fit-content" }}
            onClick={resetFillExercise}
          >
            Reset Fill Exercise
          </button>
        </div>

        {showFillResults && (
          <div style={tipBox}>
            <p style={{ margin: 0 }}>
              <strong>Your score:</strong> {fillScore} /{" "}
              {fillInQuestions.length}
            </p>
          </div>
        )}
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>9) Common Mistakes to Avoid</h2>
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8 }}>
          {commonMistakes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>10) Try Writing Your Own Sentences</h2>
        <div style={tipBox}>
          <p style={{ margin: 0 }}>Write 2 or 3 short sentences. Try to write:</p>
          <ul
            style={{
              margin: "8px 0 0",
              paddingLeft: 20,
              display: "grid",
              gap: 4,
            }}
          >
            <li>
              one sentence with <strong>nein</strong>
            </li>
            <li>
              one sentence with <strong>nicht</strong>
            </li>
            <li>
              one sentence with <strong>kein</strong>
            </li>
          </ul>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <strong>Sentence starters:</strong>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {starterSentences.map((item) => (
              <span key={item} style={chip}>
                {item}
              </span>
            ))}
          </div>
        </div>

        <textarea
          value={writingText}
          onChange={(e) => setWritingText(e.target.value)}
          placeholder="Write 2-3 short sentences using nein, nicht, or kein..."
          rows={6}
          style={{
            width: "100%",
            resize: "vertical",
            padding: 14,
            borderRadius: 12,
            border: "1px solid #cbd5e1",
            fontSize: 15,
            fontFamily: "inherit",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </section>

      <section style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0 }}>11) Practice Answer Key</h2>
          <button
            style={{ ...styles.secondaryButton, width: "fit-content" }}
            onClick={() => setShowAnswers((prev) => !prev)}
          >
            {showAnswers ? "Hide Answers" : "Show Answers"}
          </button>
        </div>

        {showAnswers ? (
          <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8 }}>
            {answerKey.map((answer) => (
              <li key={answer}>{answer}</li>
            ))}
          </ol>
        ) : (
          <div style={tipBox}>
            <p style={{ margin: 0 }}>
              Try the exercises first, then click <strong>Show Answers</strong>.
            </p>
          </div>
        )}
      </section>
    </main>
  );
};

export default A1Day16FoodAndNegationGrammarPage;
