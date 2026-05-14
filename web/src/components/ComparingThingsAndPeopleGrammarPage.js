import React, { memo, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = { ...styles.card, display: "grid", gap: 10 };

const noteStyle = {
  padding: "10px 12px",
  borderRadius: 10,
  background: "#f8f9fb",
  border: "1px solid #e5e7eb",
  lineHeight: 1.6,
};

const imageWrapperStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
  justifyItems: "center",
  textAlign: "center",
};

const positiveBox = {
  padding: "12px 14px",
  borderRadius: 12,
  background: "#ecfdf5",
  border: "1px solid #a7f3d0",
  color: "#065f46",
  fontWeight: 600,
};

const comparativeBox = {
  padding: "12px 14px",
  borderRadius: 12,
  background: "#eff6ff",
  border: "1px solid #93c5fd",
  color: "#1d4ed8",
  fontWeight: 600,
};

const superlativeBox = {
  padding: "12px 14px",
  borderRadius: 12,
  background: "#fff7ed",
  border: "1px solid #fdba74",
  color: "#c2410c",
  fontWeight: 600,
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  overflow: "hidden",
  borderRadius: 12,
};

const thStyle = {
  textAlign: "left",
  padding: "10px 12px",
  border: "1px solid #e5e7eb",
  background: "#f3f4f6",
};

const tdStyle = {
  padding: "10px 12px",
  border: "1px solid #e5e7eb",
  verticalAlign: "top",
};

const questionCardStyle = {
  display: "grid",
  gap: 10,
  padding: "14px",
  borderRadius: 14,
  border: "1px solid #e5e7eb",
  background: "#ffffff",
};

const optionsGridStyle = {
  display: "grid",
  gap: 8,
};

const explanationStyle = {
  padding: "10px 12px",
  borderRadius: 10,
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  lineHeight: 1.6,
};

const comparingImage = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="800" height="320" viewBox="0 0 800 320">
    <rect width="800" height="320" fill="#f8fafc"/>
    <text x="400" y="40" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" font-weight="bold" fill="#1f2937">
      Dinge und Personen vergleichen
    </text>

    <rect x="110" y="140" width="120" height="120" rx="12" fill="#86efac"/>
    <rect x="285" y="100" width="120" height="160" rx="12" fill="#60a5fa"/>
    <rect x="520" y="70" width="120" height="190" rx="12" fill="#fb923c"/>

    <text x="170" y="280" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#111827">groß</text>
    <text x="345" y="280" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#111827">größer</text>
    <text x="580" y="280" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#111827">am größten</text>

    <text x="255" y="175" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" fill="#111827">→</text>
    <text x="465" y="175" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" fill="#111827">→</text>
  </svg>
`)}`;

const questions = [
  {
    id: 1,
    question: 'Peter ist ________ als Tom. (groß)',
    options: ["groß", "größer", "am größten"],
    correctAnswer: "größer",
    explanation: 'We compare two people, so we use the comparative: "größer als".',
  },
  {
    id: 2,
    question: 'Anna ist ________ schön wie Mia.',
    options: ["als", "genauso", "am"],
    correctAnswer: "genauso",
    explanation: 'For equal comparison, German uses "genauso ... wie".',
  },
  {
    id: 3,
    question: 'Das Auto ist am ________. (schnell)',
    options: ["schneller", "schnell", "schnellsten"],
    correctAnswer: "schnellsten",
    explanation: 'After "am", we use the superlative form: "am schnellsten".',
  },
  {
    id: 4,
    question: 'Mein Buch ist ________ als dein Buch. (interessant)',
    options: ["interessant", "interessanter", "am interessantesten"],
    correctAnswer: "interessanter",
    explanation: 'Two things are compared, so we use the comparative: "interessanter als".',
  },
  {
    id: 5,
    question: 'Dieser Berg ist am ________. (hoch)',
    options: ["höher", "höchsten", "hoch"],
    correctAnswer: "höchsten",
    explanation: 'The superlative of "hoch" here is "am höchsten".',
  },
];

const ComparingThingsAndPeopleGrammarPage = () => {
  const navigate = useNavigate();
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleSelect = (questionId, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
  };

  const score = useMemo(() => {
    return questions.reduce((total, question) => {
      return total + (selectedAnswers[question.id] === question.correctAnswer ? 1 : 0);
    }, 0);
  }, [selectedAnswers]);

  const answeredCount = Object.keys(selectedAnswers).length;
  const allAnswered = answeredCount === questions.length;

  const getOptionStyle = (question, option) => {
    const selected = selectedAnswers[question.id];
    const isSelected = selected === option;
    const isCorrect = option === question.correctAnswer;
    const answered = Boolean(selected);

    if (!answered) {
      return {
        ...styles.secondaryButton,
        width: "100%",
        textAlign: "left",
        justifyContent: "flex-start",
      };
    }

    if (isCorrect) {
      return {
        ...styles.secondaryButton,
        width: "100%",
        textAlign: "left",
        justifyContent: "flex-start",
        background: "#ecfdf5",
        border: "1px solid #10b981",
        color: "#065f46",
      };
    }

    if (isSelected && !isCorrect) {
      return {
        ...styles.secondaryButton,
        width: "100%",
        textAlign: "left",
        justifyContent: "flex-start",
        background: "#fef2f2",
        border: "1px solid #ef4444",
        color: "#991b1b",
      };
    }

    return {
      ...styles.secondaryButton,
      width: "100%",
      textAlign: "left",
      justifyContent: "flex-start",
      opacity: 0.75,
    };
  };

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 12 }}>
        <button
          style={{ ...styles.secondaryButton, width: "fit-content" }}
          onClick={() => navigate("/campus/course")}
        >
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          Dinge und Personen vergleichen (1.3)
        </h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Positive, Comparative, and Superlative in German
        </p>
        <p style={{ margin: 0, color: "#4b5563" }}>
          English support: Comparing things and people (positive, comparative, superlative).
        </p>
      </header>

      <section style={imageWrapperStyle}>
        <img
          src={comparingImage}
          alt="Simple illustration showing groß, größer, and am größten"
          style={{
            width: "100%",
            maxWidth: 720,
            borderRadius: 16,
            objectFit: "cover",
          }}
        />
        <p style={{ margin: 0, color: "#4b5563" }}>
          In German, we can compare people and things in different ways.
        </p>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>1. The Three Forms</h2>

        <div style={positiveBox}>
          Positiv = normal adjective, no comparison
          <div style={{ fontWeight: 400, marginTop: 6 }}>Example: Maria ist groß.</div>
        </div>

        <div style={comparativeBox}>
          Komparativ = compare two things
          <div style={{ fontWeight: 400, marginTop: 6 }}>
            Example: Maria ist größer als Anna.
          </div>
        </div>

        <div style={superlativeBox}>
          Superlativ = the highest degree
          <div style={{ fontWeight: 400, marginTop: 6 }}>
            Example: Maria ist am größten.
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>2. Positive Form (Positiv)</h2>
        <p style={{ margin: 0 }}>
          The <strong>positive form</strong> is the normal adjective. We use it
          when we only describe one person or one thing.
        </p>

        <div style={noteStyle}>
          <strong>Use it for:</strong> simple description, not comparison.
        </div>

        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>groß = big / tall</li>
          <li>klein = small / short</li>
          <li>schnell = fast</li>
          <li>langsam = slow</li>
          <li>schön = beautiful</li>
          <li>interessant = interesting</li>
          <li>teuer = expensive</li>
          <li>billig = cheap</li>
          <li>hoch = high</li>
          <li>niedrig = low</li>
        </ul>

        <div style={noteStyle}>
          <strong>Examples:</strong>
          <ul style={{ margin: "8px 0 0", paddingLeft: 20 }}>
            <li>Das Haus ist groß.</li>
            <li>Das Fahrrad ist schnell.</li>
            <li>Das Buch ist interessant.</li>
          </ul>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>3. Comparative Form (Komparativ)</h2>
        <p style={{ margin: 0 }}>
          The <strong>comparative form</strong> compares <strong>two</strong>
          people or things.
        </p>
        <p style={{ margin: 0 }}>
          We usually add <strong>-er</strong> to the adjective.
          Sometimes the vowel changes:
          <strong> a → ä</strong>, <strong>o → ö</strong>, <strong>u → ü</strong>.
        </p>

        <div style={noteStyle}>
          <strong>Use it for:</strong> saying that one thing is bigger, smaller,
          faster, more beautiful, etc. than another thing.
        </div>

        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>groß → größer</li>
          <li>klein → kleiner</li>
          <li>schnell → schneller</li>
          <li>langsam → langsamer</li>
          <li>schön → schöner</li>
          <li>interessant → interessanter</li>
          <li>teuer → teurer</li>
          <li>billig → billiger</li>
          <li>hoch → höher</li>
          <li>niedrig → niedriger</li>
        </ul>

        <p style={{ margin: 0 }}>
          We often use <strong>als</strong> (= than) after the comparative.
        </p>

        <div style={noteStyle}>
          <strong>Pattern:</strong>
          <br />
          Person / Thing + <strong>ist</strong> + comparative + <strong>als</strong> + person / thing
        </div>

        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Peter ist größer als Maria.</li>
          <li>Das Auto ist schneller als das Fahrrad.</li>
          <li>Dieses Buch ist interessanter als das andere.</li>
          <li>Der Berg ist höher als der Hügel.</li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>4. Superlative Form (Superlativ)</h2>
        <p style={{ margin: 0 }}>
          The <strong>superlative form</strong> shows the <strong>highest degree</strong>.
        </p>

        <div style={noteStyle}>
          <strong>Use it for:</strong> showing that one person or thing is number 1
          in a group.
        </div>

        <p style={{ margin: 0 }}>
          A common structure is:
          <strong> am + adjective + -sten / -esten</strong>
        </p>

        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>am größten</li>
          <li>am kleinsten</li>
          <li>am schnellsten</li>
          <li>am langsamsten</li>
          <li>am schönsten</li>
          <li>am interessantesten</li>
          <li>am teuersten</li>
          <li>am billigsten</li>
          <li>am höchsten</li>
          <li>am niedrigsten</li>
        </ul>

        <div style={noteStyle}>
          <strong>Examples:</strong>
          <ul style={{ margin: "8px 0 0", paddingLeft: 20 }}>
            <li>Peter ist am größten in der Klasse.</li>
            <li>Das Flugzeug ist am schnellsten.</li>
            <li>Dieses Hotel ist am teuersten.</li>
          </ul>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>5. "genauso ... wie" and "als"</h2>
        <p style={{ margin: 0 }}>
          German has two important ways to compare:
        </p>

        <div style={noteStyle}>
          <strong>Equality:</strong> <strong>genauso + adjective + wie</strong>
          <br />
          Use this when two things are the same.
        </div>

        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Peter ist genauso groß wie Maria.</li>
          <li>Das Auto ist genauso schnell wie das Motorrad.</li>
        </ul>

        <div style={noteStyle}>
          <strong>Inequality:</strong> comparative + <strong>als</strong>
          <br />
          Use this when two things are different.
        </div>

        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Peter ist größer als Maria.</li>
          <li>Das Auto ist schneller als das Fahrrad.</li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>6. Comparison Table</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Form</th>
                <th style={thStyle}>Meaning</th>
                <th style={thStyle}>Example</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}><strong>Positiv</strong></td>
                <td style={tdStyle}>normal adjective</td>
                <td style={tdStyle}>groß</td>
              </tr>
              <tr>
                <td style={tdStyle}><strong>Komparativ</strong></td>
                <td style={tdStyle}>compare two things</td>
                <td style={tdStyle}>größer als</td>
              </tr>
              <tr>
                <td style={tdStyle}><strong>Superlativ</strong></td>
                <td style={tdStyle}>highest degree</td>
                <td style={tdStyle}>am größten</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>7. Easy Rule to Remember</h2>
        <div style={noteStyle}>
          <strong>Positiv</strong> = just describe
          <br />
          <strong>Komparativ</strong> = compare 2 things
          <br />
          <strong>Superlativ</strong> = the highest in a group
        </div>

        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>groß</li>
          <li>größer als</li>
          <li>am größten</li>
        </ul>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <h2 style={{ margin: 0 }}>8. Mini Practice Quiz</h2>
          <div style={noteStyle}>
            <strong>Score:</strong> {score} / {questions.length}
          </div>
        </div>

        <p style={{ margin: 0 }}>
          Choose the correct answer for each sentence.
        </p>

        {questions.map((item, index) => {
          const selected = selectedAnswers[item.id];
          const isCorrect = selected === item.correctAnswer;
          const hasAnswered = Boolean(selected);

          return (
            <div key={item.id} style={questionCardStyle}>
              <strong>
                {index + 1}. {item.question}
              </strong>

              <div style={optionsGridStyle}>
                {item.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    style={getOptionStyle(item, option)}
                    onClick={() => handleSelect(item.id, option)}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {hasAnswered && (
                <div
                  style={{
                    ...explanationStyle,
                    background: isCorrect ? "#ecfdf5" : "#fef2f2",
                    border: isCorrect ? "1px solid #10b981" : "1px solid #ef4444",
                    color: isCorrect ? "#065f46" : "#991b1b",
                  }}
                >
                  <strong>{isCorrect ? "Correct!" : "Not quite."}</strong>
                  <div style={{ marginTop: 6 }}>
                    {item.explanation}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="button"
            style={styles.secondaryButton}
            onClick={resetQuiz}
          >
            Reset Quiz
          </button>

          {allAnswered && (
            <div style={noteStyle}>
              <strong>Finished!</strong> You got {score} out of {questions.length}.
            </div>
          )}
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Summary</h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            <strong>Positive</strong>: no comparison → <em>groß, klein, schön</em>
          </li>
          <li>
            <strong>Comparative</strong>: compare two things → <em>größer, schneller</em>
          </li>
          <li>
            <strong>Superlative</strong>: strongest form → <em>am größten, am schnellsten</em>
          </li>
          <li>
            <strong>genauso ... wie</strong>: equal comparison
          </li>
          <li>
            <strong>... als</strong>: unequal comparison
          </li>
        </ul>
      </section>
    </main>
  );
};

export default memo(ComparingThingsAndPeopleGrammarPage);
