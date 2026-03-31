import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const heroImage =
  "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1600&q=80";

const sectionTitleStyle = {
  margin: 0,
  fontSize: "1.1rem",
  fontWeight: 700,
};

const listStyle = {
  margin: 0,
  paddingLeft: 18,
  display: "grid",
  gap: 6,
};

const tableWrapStyle = {
  overflowX: "auto",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 14,
  minWidth: 620,
};

const cellStyle = {
  border: "1px solid #d1d5db",
  padding: "8px 10px",
  textAlign: "left",
  verticalAlign: "top",
};

const subjectHighlightStyle = {
  backgroundColor: "#dbeafe",
  color: "#1d4ed8",
  padding: "1px 6px",
  borderRadius: 999,
  fontWeight: 700,
};

const objectHighlightStyle = {
  backgroundColor: "#fee2e2",
  color: "#b91c1c",
  padding: "1px 6px",
  borderRadius: 999,
  fontWeight: 700,
};

const verbHighlightStyle = {
  backgroundColor: "#fef3c7",
  color: "#92400e",
  padding: "1px 6px",
  borderRadius: 999,
  fontWeight: 700,
};

const knowledgeQuestionStyle = {
  display: "grid",
  gap: 10,
  padding: 14,
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  backgroundColor: "#fff",
};

const knowledgeQuestions = [
  {
    id: "q1",
    prompt: "Ich sehe ____ Mann jeden Tag.",
    options: ["der", "den", "dem"],
    correctAnswer: "den",
    feedback: "Correct: 'sehen' takes an accusative object, so masculine 'der Mann' becomes 'den Mann'.",
    highlightedSentence: {
      subject: "Ich",
      verb: "sehe",
      noun: "den Mann",
      rest: "jeden Tag.",
    },
    englishTranslation: "I see the man every day.",
  },
  {
    id: "q2",
    prompt: "____ Frau arbeitet im Büro.",
    options: ["die", "den", "dem"],
    correctAnswer: "die",
    feedback: "Correct: the subject is nominative, and feminine nominative definite article is 'die'.",
    highlightedSentence: {
      subject: "Die Frau",
      verb: "arbeitet",
      noun: "Die Frau",
      rest: "im Büro.",
    },
    englishTranslation: "The woman works in the office.",
  },
  {
    id: "q3",
    prompt: "Wir kaufen ____ Buch.",
    options: ["das", "dem", "des"],
    correctAnswer: "das",
    feedback: "Correct: 'kaufen' takes accusative. Neuter article stays 'das' in accusative.",
    highlightedSentence: {
      subject: "Wir",
      verb: "kaufen",
      noun: "das Buch.",
      rest: "",
    },
    englishTranslation: "We buy the book.",
  },
  {
    id: "q4",
    prompt: "Der Lehrer erklärt ____ Schüler die Aufgabe.",
    options: ["der", "den", "dem"],
    correctAnswer: "den",
    feedback: "Correct: 'erklären' here takes a direct object in accusative ('den Schüler').",
    highlightedSentence: {
      subject: "Der Lehrer",
      verb: "erklärt",
      noun: "den Schüler",
      rest: "die Aufgabe.",
    },
    englishTranslation: "The teacher explains the task to the student.",
  },
  {
    id: "q5",
    prompt: "____ Kind spielt im Garten.",
    options: ["das", "den", "dem"],
    correctAnswer: "das",
    feedback: "Correct: this is the subject (nominative), so we use 'das Kind'.",
    highlightedSentence: {
      subject: "Das Kind",
      verb: "spielt",
      noun: "Das Kind",
      rest: "im Garten.",
    },
    englishTranslation: "The child plays in the garden.",
  },
  {
    id: "q6",
    prompt: "Wir brauchen ____ Computer für den Kurs.",
    options: ["der", "den", "dem"],
    correctAnswer: "den",
    feedback: "Correct: 'brauchen' takes accusative, so masculine 'der Computer' becomes 'den Computer'.",
    highlightedSentence: {
      subject: "Wir",
      verb: "brauchen",
      noun: "den Computer",
      rest: "für den Kurs.",
    },
    englishTranslation: "We need the computer for the course.",
  },
  {
    id: "q7",
    prompt: "____ Bücher sind interessant.",
    options: ["die", "den", "dem"],
    correctAnswer: "die",
    feedback: "Correct: plural nominative uses 'die'.",
    highlightedSentence: {
      subject: "Die Bücher",
      verb: "sind",
      noun: "Die Bücher",
      rest: "interessant.",
    },
    englishTranslation: "The books are interesting.",
  },
  {
    id: "q8",
    prompt: "Ich lese ____ Bücher jeden Abend.",
    options: ["die", "den", "dem"],
    correctAnswer: "die",
    feedback: "Correct: plural accusative also uses 'die'.",
    highlightedSentence: {
      subject: "Ich",
      verb: "lese",
      noun: "die Bücher",
      rest: "jeden Abend.",
    },
    englishTranslation: "I read the books every evening.",
  },
];

const A1Day9NominativeAccusativeGrammarPage = () => {
  const navigate = useNavigate();
  const [knowledgeAnswers, setKnowledgeAnswers] = useState({});

  const handleKnowledgeAnswerSelect = (questionId, answer) => {
    setKnowledgeAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questionId]: answer,
    }));
  };

  const getKnowledgeOptionStyle = (question, option) => {
    const selectedAnswer = knowledgeAnswers[question.id];
    const isSelected = selectedAnswer === option;
    const isCorrect = option === question.correctAnswer;

    if (!selectedAnswer) {
      return {
        ...styles.secondaryButton,
        width: "100%",
        justifyContent: "flex-start",
        textAlign: "left",
      };
    }

    if (isCorrect) {
      return {
        ...styles.secondaryButton,
        width: "100%",
        justifyContent: "flex-start",
        textAlign: "left",
        border: "1px solid #10b981",
        backgroundColor: "#ecfdf5",
        color: "#065f46",
      };
    }

    if (isSelected) {
      return {
        ...styles.secondaryButton,
        width: "100%",
        justifyContent: "flex-start",
        textAlign: "left",
        border: "1px solid #ef4444",
        backgroundColor: "#fef2f2",
        color: "#991b1b",
      };
    }

    return {
      ...styles.secondaryButton,
      width: "100%",
      justifyContent: "flex-start",
      textAlign: "left",
      opacity: 0.7,
    };
  };

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={cardStyle}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <img
          src={heroImage}
          alt="Students studying German grammar together"
          style={{ width: "100%", maxHeight: 260, objectFit: "cover", borderRadius: 12 }}
        />
        <h1 style={{ ...styles.title, margin: 0 }}>A1 Day 9 • Nominative and Accusative Cases</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          In-app grammar notes for <strong>German plurals</strong> and the core idea of German{" "}
          <strong>cases as a family system</strong> (Nominativ, Akkusativ, Dativ, Genitiv).
        </p>
        <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>Header image source: Unsplash</p>
      </header>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>1) German plurals (quick guide)</h2>
        <ul style={listStyle}>
          <li>German nouns can have different plural endings, so plural forms should be learned with each noun.</li>
          <li>Plural nouns do not have grammatical gender, and the definite article is always <strong>die</strong>.</li>
          <li>
            With negation in plural, use <strong>keine</strong> (for example: <strong>keine Bücher</strong>).
          </li>
          <li>
            Quick English bridge: <strong>definite article</strong> means <strong>"the"</strong> (specific thing),
            while <strong>indefinite article</strong> means <strong>"a / an"</strong> (one non-specific thing).
          </li>
        </ul>

        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cellStyle}>Type</th>
                <th style={cellStyle}>Masculine</th>
                <th style={cellStyle}>Feminine</th>
                <th style={cellStyle}>Neuter</th>
                <th style={cellStyle}>Plural</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={cellStyle}>Definite articles ("the")</td>
                <td style={cellStyle}>der</td>
                <td style={cellStyle}>die</td>
                <td style={cellStyle}>das</td>
                <td style={cellStyle}>die</td>
              </tr>
              <tr>
                <td style={cellStyle}>Indefinite / negation ("a / an" / "no")</td>
                <td style={cellStyle}>ein</td>
                <td style={cellStyle}>eine</td>
                <td style={cellStyle}>ein</td>
                <td style={cellStyle}>keine</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ul style={listStyle}>
          <li>Der Hund → Die Hunde | Ich sehe den Hund. / Ich sehe die Hunde.</li>
          <li>Das Buch → Die Bücher | Ich lese das Buch. / Ich lese die Bücher.</li>
          <li>Die Blume → Die Blumen | Ich kaufe die Blume. / Ich kaufe die Blumen.</li>
          <li>Ein Apfel → Keine Äpfel | Ich habe einen Apfel. / Ich habe keine Äpfel.</li>
        </ul>
        <p style={{ margin: 0 }}>
          Teaching note for next chapter: when students understand <strong>the</strong> vs{" "}
          <strong>a / an</strong>, it becomes much easier to teach possessive determiners like{" "}
          <strong>mein / meine</strong> ("my"), <strong>dein / deine</strong> ("your"), and{" "}
          <strong>sein / seine</strong> ("his"), because they follow similar article patterns.
        </p>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>2) The big idea: German cases are like a family of classes</h2>
        <p style={{ margin: 0 }}>
          In German, sentence parts change form based on their function. This is the <strong>case system</strong>.
          Think of it as four related categories: <strong>Nominativ</strong>, <strong>Akkusativ</strong>,{" "}
          <strong>Dativ</strong>, and <strong>Genitiv</strong>.
        </p>
        <ul style={listStyle}>
          <li>
            At A1 level, focus first on <strong>Nominativ</strong> and <strong>Akkusativ</strong>. Dativ comes next.
          </li>
          <li>Cases can be determined by verbs, direction (wo/wohin), and prepositions.</li>
          <li>
            In this lesson, we focus only on <strong>verbs</strong> as the case signal.
          </li>
          <li>
            Step 1: identify sentence role (subject/direct object), then choose the matching article form.
          </li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>3) Nominative case (Der Nominativ)</h2>
        <p style={{ margin: 0 }}>
          Use nominative for the <strong>subject</strong> (who/what does the action). A beginner tip: with{" "}
          <strong>sein</strong> and <strong>werden</strong>, you often get a subject + description pattern (no direct
          object).
        </p>
        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cellStyle}>Nominative articles</th>
                <th style={cellStyle}>Masculine</th>
                <th style={cellStyle}>Feminine</th>
                <th style={cellStyle}>Neuter</th>
                <th style={cellStyle}>Plural</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={cellStyle}>Definite</td>
                <td style={cellStyle}>der</td>
                <td style={cellStyle}>die</td>
                <td style={cellStyle}>das</td>
                <td style={cellStyle}>die</td>
              </tr>
              <tr>
                <td style={cellStyle}>Indefinite / negation</td>
                <td style={cellStyle}>ein</td>
                <td style={cellStyle}>eine</td>
                <td style={cellStyle}>ein</td>
                <td style={cellStyle}>keine</td>
              </tr>
            </tbody>
          </table>
        </div>
        <ul style={listStyle}>
          <li>
            <span style={subjectHighlightStyle}>Der Mann</span> <span style={verbHighlightStyle}>ist</span> nett.
          </li>
          <li>
            <span style={subjectHighlightStyle}>Die Frau</span> <span style={verbHighlightStyle}>arbeitet</span>.
          </li>
          <li>
            <span style={subjectHighlightStyle}>Das Kind</span> <span style={verbHighlightStyle}>spielt</span>.
          </li>
          <li>
            <span style={subjectHighlightStyle}>Das</span> <span style={verbHighlightStyle}>ist</span> ein Haus. /{" "}
            <span style={subjectHighlightStyle}>Er</span> <span style={verbHighlightStyle}>wird</span> Lehrer.
          </li>
        </ul>

        <p style={{ margin: 0 }}>
          More nominative examples (subject-focused): in nominative-only patterns, highlight the{" "}
          <strong>subject</strong>.
        </p>
        <ul style={listStyle}>
          <li>
            <span style={subjectHighlightStyle}>Der Lehrer</span> <span style={verbHighlightStyle}>ist</span> freundlich.
          </li>
          <li>
            <span style={subjectHighlightStyle}>Ein Lehrer</span> <span style={verbHighlightStyle}>ist</span> freundlich.
          </li>
          <li>
            <span style={subjectHighlightStyle}>Die Lehrerin</span> <span style={verbHighlightStyle}>ist</span> freundlich.
          </li>
          <li>
            <span style={subjectHighlightStyle}>Eine Lehrerin</span> <span style={verbHighlightStyle}>ist</span>{" "}
            freundlich.
          </li>
          <li>
            <span style={subjectHighlightStyle}>Das Kind</span> <span style={verbHighlightStyle}>ist</span> ruhig.
          </li>
          <li>
            <span style={subjectHighlightStyle}>Ein Kind</span> <span style={verbHighlightStyle}>ist</span> ruhig.
          </li>
          <li>
            <span style={subjectHighlightStyle}>Die Kinder</span> <span style={verbHighlightStyle}>sind</span> ruhig.
          </li>
          <li>
            <span style={subjectHighlightStyle}>Keine Kinder</span> <span style={verbHighlightStyle}>sind</span> laut.
          </li>
        </ul>
        <p style={{ margin: 0 }}>
          Quick tip: if your sentence is mainly <strong>subject + verb + description</strong>, it is usually
          nominative-focused.
        </p>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>4) Accusative case (Der Akkusativ)</h2>
        <p style={{ margin: 0 }}>
          Use accusative for the <strong>direct object</strong> (the person or thing directly affected by the action).
        </p>
        <p style={{ margin: 0 }}>
          First-time learner tip: accusative sentences are often{" "}
          <strong>
            <span style={subjectHighlightStyle}>subject</span> + <span style={verbHighlightStyle}>verb</span> +{" "}
            <span style={objectHighlightStyle}>noun (object)</span>
          </strong>
          .
        </p>

        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cellStyle}>Accusative articles</th>
                <th style={cellStyle}>Masculine</th>
                <th style={cellStyle}>Feminine</th>
                <th style={cellStyle}>Neuter</th>
                <th style={cellStyle}>Plural</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={cellStyle}>Definite</td>
                <td style={cellStyle}>den</td>
                <td style={cellStyle}>die</td>
                <td style={cellStyle}>das</td>
                <td style={cellStyle}>die</td>
              </tr>
              <tr>
                <td style={cellStyle}>Indefinite / negation</td>
                <td style={cellStyle}>einen</td>
                <td style={cellStyle}>eine</td>
                <td style={cellStyle}>ein</td>
                <td style={cellStyle}>keine</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ul style={listStyle}>
          <li>
            <span style={subjectHighlightStyle}>Ich</span> <span style={verbHighlightStyle}>habe</span>{" "}
            <span style={objectHighlightStyle}>den Hund</span>.
          </li>
          <li>
            <span style={subjectHighlightStyle}>Sie</span> <span style={verbHighlightStyle}>kauft</span>{" "}
            <span style={objectHighlightStyle}>die Blume</span>.
          </li>
          <li>
            <span style={subjectHighlightStyle}>Er</span> <span style={verbHighlightStyle}>isst</span>{" "}
            <span style={objectHighlightStyle}>das Brot</span>.
          </li>
          <li>
            <span style={subjectHighlightStyle}>Wir</span> <span style={verbHighlightStyle}>treffen</span>{" "}
            <span style={objectHighlightStyle}>die Freunde</span>.
          </li>
        </ul>

        <p style={{ margin: 0 }}>
          More accusative examples (definite + indefinite from masculine to plural). Watch how the{" "}
          <strong>verb influences the object case</strong>:
        </p>
        <ul style={listStyle}>
          <li>
            <span style={subjectHighlightStyle}>Der Student</span> <span style={verbHighlightStyle}>sieht</span>{" "}
            <span style={objectHighlightStyle}>den Lehrer</span>. / <span style={subjectHighlightStyle}>Der Student</span>{" "}
            <span style={verbHighlightStyle}>sieht</span> <span style={objectHighlightStyle}>einen Lehrer</span>.
          </li>
          <li>
            <span style={subjectHighlightStyle}>Der Student</span> <span style={verbHighlightStyle}>sieht</span>{" "}
            <span style={objectHighlightStyle}>die Lehrerin</span>. / <span style={subjectHighlightStyle}>Der Student</span>{" "}
            <span style={verbHighlightStyle}>sieht</span> <span style={objectHighlightStyle}>eine Lehrerin</span>.
          </li>
          <li>
            <span style={subjectHighlightStyle}>Der Student</span> <span style={verbHighlightStyle}>sieht</span>{" "}
            <span style={objectHighlightStyle}>das Kind</span>. / <span style={subjectHighlightStyle}>Der Student</span>{" "}
            <span style={verbHighlightStyle}>sieht</span> <span style={objectHighlightStyle}>ein Kind</span>.
          </li>
          <li>
            <span style={subjectHighlightStyle}>Der Student</span> <span style={verbHighlightStyle}>sieht</span>{" "}
            <span style={objectHighlightStyle}>die Kinder</span>. / <span style={subjectHighlightStyle}>Der Student</span>{" "}
            <span style={verbHighlightStyle}>sieht</span> <span style={objectHighlightStyle}>keine Kinder</span>.
          </li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>5) Helpful verb tips for beginners</h2>
        <ul style={listStyle}>
          <li>
            <strong>Nominative focus:</strong> sein, werden (often no direct object, but a description/complement)
          </li>
          <li>
            <strong>Accusative object verbs:</strong> haben, sehen, finden, kaufen, nehmen, brauchen, essen, trinken,
            hören, lesen
          </li>
        </ul>
        <p style={{ margin: 0 }}>
          Examples: <strong>Ich habe einen Stift.</strong> (Stift = masculine), <strong>Sie hat ein Buch.</strong>{" "}
          (Buch = neuter), <strong>Er kauft ein Auto.</strong> (Auto = neuter),{" "}
          <strong>Wir kaufen eine Karte.</strong> (Karte = feminine).
        </p>
        <p style={{ margin: 0 }}>
          Tip: first find the verb, then identify who does the action (subject = nominative) and who/what receives the
          action (direct object = accusative).
        </p>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>6) Knowledge test (instant feedback)</h2>
        <p style={{ margin: 0 }}>
          Click one option for each sentence and you will immediately see whether your answer is correct.
        </p>
        <div style={{ display: "grid", gap: 12 }}>
          {knowledgeQuestions.map((question, index) => {
            const selectedAnswer = knowledgeAnswers[question.id];
            const isCorrect = selectedAnswer === question.correctAnswer;

            return (
              <article key={question.id} style={knowledgeQuestionStyle}>
                <h3 style={{ margin: 0, fontSize: "1rem" }}>
                  {index + 1}. {question.prompt}
                </h3>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
                  <strong>German (idea):</strong> <strong>{question.highlightedSentence.subject}</strong>{" "}
                  {question.highlightedSentence.verb} <strong>{question.highlightedSentence.noun}</strong>{" "}
                  {question.highlightedSentence.rest}
                </p>
                <p style={{ margin: 0, fontSize: 14, color: "#374151" }}>
                  <strong>English:</strong> {question.englishTranslation}
                </p>
                <div style={{ display: "grid", gap: 8 }}>
                  {question.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      style={getKnowledgeOptionStyle(question, option)}
                      onClick={() => handleKnowledgeAnswerSelect(question.id, option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {selectedAnswer ? (
                  <p
                    style={{
                      margin: 0,
                      padding: "10px 12px",
                      borderRadius: 10,
                      fontWeight: 600,
                      border: isCorrect ? "1px solid #10b981" : "1px solid #ef4444",
                      backgroundColor: isCorrect ? "#ecfdf5" : "#fef2f2",
                      color: isCorrect ? "#065f46" : "#991b1b",
                    }}
                  >
                    {isCorrect ? "✅ Correct!" : "❌ Not quite."} {question.feedback}
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>7) What comes next</h2>
        <p style={{ margin: 0 }}>
          Great start. Keep practicing nominative and accusative first. Later, we add <strong>Dativ</strong> and{" "}
          <strong>Genitiv</strong> so you can build more complete German sentences confidently.
        </p>
      </section>
    </main>
  );
};

export default A1Day9NominativeAccusativeGrammarPage;
