import React, { memo, useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const heroStyle = {
  ...styles.card,
  overflow: "hidden",
  padding: 0,
};

const heroImageStyle = {
  width: "100%",
  height: 240,
  objectFit: "cover",
  display: "block",
};

const heroContentStyle = {
  padding: 16,
  display: "grid",
  gap: 8,
};

const SectionCard = ({ title, children }) => (
  <section style={cardStyle}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const InlineCode = ({ children }) => (
  <span
    style={{
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      fontSize: "0.95em",
      padding: "2px 6px",
      borderRadius: 6,
      background: "rgba(0,0,0,0.06)",
    }}
  >
    {children}
  </span>
);

const tipBox = {
  border: "1px solid #dbeafe",
  background: "#eff6ff",
  borderRadius: 10,
  padding: 12,
  display: "grid",
  gap: 6,
};

const merkeBox = {
  border: "1px solid #bbf7d0",
  background: "#f0fdf4",
  borderRadius: 10,
  padding: 12,
  display: "grid",
  gap: 6,
};

const warningBox = {
  border: "1px solid #fde68a",
  background: "#fffbeb",
  borderRadius: 10,
  padding: 12,
  display: "grid",
  gap: 6,
};

const practiceBox = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  background: "#fafafa",
  display: "grid",
  gap: 8,
};

const scoreBox = {
  border: "1px solid #c7d2fe",
  background: "#eef2ff",
  borderRadius: 10,
  padding: 12,
  display: "grid",
  gap: 6,
};

const tableWrapStyle = {
  width: "100%",
  overflowX: "auto",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: 560,
};

const thTdStyle = {
  border: "1px solid #d1d5db",
  padding: 10,
  textAlign: "left",
  verticalAlign: "top",
};

const listStyle = {
  margin: 0,
  paddingLeft: 20,
  display: "grid",
  gap: 8,
};

const exampleStyle = {
  margin: 0,
  lineHeight: 1.7,
};

const answerBtnStyle = {
  border: "none",
  borderRadius: 8,
  padding: "10px 12px",
  cursor: "pointer",
  fontWeight: 600,
  background: "#111827",
  color: "#fff",
  width: "fit-content",
};

const secondaryBtnStyle = {
  border: "1px solid #d1d5db",
  borderRadius: 8,
  padding: "10px 12px",
  cursor: "pointer",
  fontWeight: 600,
  background: "#fff",
  color: "#111827",
  width: "fit-content",
};

const optionBtn = (selected) => ({
  textAlign: "left",
  border: selected ? "2px solid #2563eb" : "1px solid #d1d5db",
  background: selected ? "#eff6ff" : "#fff",
  borderRadius: 10,
  padding: "10px 12px",
  cursor: "pointer",
  width: "100%",
});

const resultBox = (correct) => ({
  border: `1px solid ${correct ? "#86efac" : "#fca5a5"}`,
  background: correct ? "#f0fdf4" : "#fef2f2",
  borderRadius: 10,
  padding: 10,
});

const textareaStyle = {
  width: "100%",
  minHeight: 90,
  border: "1px solid #d1d5db",
  borderRadius: 10,
  padding: 12,
  fontSize: 16,
  fontFamily: "inherit",
  resize: "vertical",
  boxSizing: "border-box",
};

const quizData = [
  {
    id: 1,
    question: "Ich suche eine Wohnung, ___ nicht zu teuer ist.",
    options: ["der", "die", "das"],
    correct: "die",
    explanation: "Wohnung is feminine: die Wohnung → die",
  },
  {
    id: 2,
    question: "Der Makler, ___ heute kommt, ist freundlich.",
    options: ["der", "die", "das"],
    correct: "der",
    explanation: "Makler is masculine: der Makler → der",
  },
  {
    id: 3,
    question: "Das Zimmer, ___ wir mieten wollen, ist klein.",
    options: ["der", "die", "das"],
    correct: "das",
    explanation: "Zimmer is neuter: das Zimmer → das",
  },
  {
    id: 4,
    question: "Die Leute, ___ im Haus wohnen, sind ruhig.",
    options: ["der", "die", "das"],
    correct: "die",
    explanation: "Leute is plural → die",
  },
];

const transformData = [
  {
    id: 1,
    prompt: "Die Wohnung ist groß. Die Wohnung hat zwei Bäder.",
    hint: "Start with: Die Wohnung, ...",
    answer: "Die Wohnung, die zwei Bäder hat, ist groß.",
  },
  {
    id: 2,
    prompt: "Das Haus ist alt. Das Haus gefällt mir.",
    hint: "Start with: Das Haus, ...",
    answer: "Das Haus, das mir gefällt, ist alt.",
  },
  {
    id: 3,
    prompt: "Der Mann ist mein Vermieter. Der Mann wohnt in Accra.",
    hint: "Start with: Der Mann, ...",
    answer: "Der Mann, der in Accra wohnt, ist mein Vermieter.",
  },
];

const revealPracticeData = [
  {
    number: "1",
    prompt: "Ich suche eine Wohnung. Die Wohnung hat drei Zimmer.",
    answer: "Ich suche eine Wohnung, die drei Zimmer hat.",
  },
  {
    number: "2",
    prompt: "Da ist ein Vermieter. Der Vermieter ist nett.",
    answer: "Da ist ein Vermieter, der nett ist.",
  },
  {
    number: "3",
    prompt: "Wir sehen ein Haus. Das Haus hat einen Garten.",
    answer: "Wir sehen ein Haus, das einen Garten hat.",
  },
  {
    number: "4",
    prompt: "Ich kenne Leute. Die Leute suchen eine WG.",
    answer: "Ich kenne Leute, die eine WG suchen.",
  },
];

const QuizCard = ({ item, selected, checked, onSelect, onCheck }) => {
  const isCorrect = selected === item.correct;

  return (
    <div style={practiceBox}>
      <strong>
        {item.id}. {item.question}
      </strong>

      <div style={{ display: "grid", gap: 8 }}>
        {item.options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(item.id, option)}
            style={optionBtn(selected === option)}
          >
            {option}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => onCheck(item.id)}
          style={answerBtnStyle}
          disabled={!selected}
        >
          Check answer
        </button>
      </div>

      {checked && (
        <div style={resultBox(isCorrect)}>
          <p style={{ margin: 0, fontWeight: 700 }}>
            {isCorrect ? "✅ Correct" : "❌ Not correct"}
          </p>
          <p style={{ margin: "6px 0 0" }}>
            Correct answer: <strong>{item.correct}</strong>
          </p>
          <p style={{ margin: "6px 0 0" }}>{item.explanation}</p>
        </div>
      )}
    </div>
  );
};

const RevealPractice = ({ number, prompt, answer }) => {
  const [show, setShow] = useState(false);

  return (
    <div style={practiceBox}>
      <p style={{ margin: 0 }}>
        <strong>{number}.</strong> {prompt}
      </p>
      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
        style={answerBtnStyle}
      >
        {show ? "Hide answer" : "Show answer"}
      </button>
      {show ? (
        <div style={tipBox}>
          <p style={{ margin: 0 }}>
            <strong>Answer:</strong> {answer}
          </p>
        </div>
      ) : null}
    </div>
  );
};

const TransformPractice = ({ item }) => {
  const [text, setText] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div style={practiceBox}>
      <p style={{ margin: 0 }}>
        <strong>{item.id}.</strong> {item.prompt}
      </p>

      <div style={tipBox}>
        <p style={{ margin: 0 }}>
          <strong>Hint:</strong> {item.hint}
        </p>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your new sentence here..."
        style={textareaStyle}
      />

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => setShowAnswer((prev) => !prev)}
          style={answerBtnStyle}
        >
          {showAnswer ? "Hide answer" : "Show answer"}
        </button>

        <button
          type="button"
          onClick={() => {
            setText("");
            setShowAnswer(false);
          }}
          style={secondaryBtnStyle}
        >
          Reset
        </button>
      </div>

      {showAnswer ? (
        <div style={merkeBox}>
          <p style={{ margin: 0 }}>
            <strong>Possible answer:</strong> {item.answer}
          </p>
        </div>
      ) : null}
    </div>
  );
};

const A2Day7RelativeClausesWohnungGrammarPage = () => {

  const [quizSelections, setQuizSelections] = useState({});
  const [quizChecked, setQuizChecked] = useState({});

  const checkedCount = useMemo(
    () => Object.values(quizChecked).filter(Boolean).length,
    [quizChecked]
  );

  const score = useMemo(() => {
    return quizData.reduce((total, item) => {
      const wasChecked = quizChecked[item.id];
      const selected = quizSelections[item.id];
      if (wasChecked && selected === item.correct) {
        return total + 1;
      }
      return total;
    }, 0);
  }, [quizChecked, quizSelections]);

  const handleSelectOption = (id, option) => {
    setQuizSelections((prev) => ({ ...prev, [id]: option }));
    setQuizChecked((prev) => ({ ...prev, [id]: false }));
  };

  const handleCheckAnswer = (id) => {
    setQuizChecked((prev) => ({ ...prev, [id]: true }));
  };

  const resetQuiz = () => {
    setQuizSelections({});
    setQuizChecked({});
  };

  const allChecked = checkedCount === quizData.length;
  const percentage = Math.round((score / quizData.length) * 100);

  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        <AppBackButton label="Back" fallbackPath="/campus/course" />

        <div style={{ display: "grid", gap: 14 }}>
          <section style={heroStyle}>
            <img
              src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
              alt="Eine helle Wohnung mit modernem Wohnzimmer"
              style={heroImageStyle}
            />
            <div style={heroContentStyle}>
              <h1 style={{ margin: 0 }}>A2 • 3.7 Eine Wohnung suchen</h1>
              <p style={{ margin: 0, opacity: 0.85 }}>
                <strong>Grammar focus:</strong> Relativsätze mit <strong>der / die / das</strong>
              </p>
              <p style={{ margin: 0, opacity: 0.85, lineHeight: 1.6 }}>
                In this lesson, you learn how to describe a house, room, landlord,
                or apartment more naturally. Relative clauses help you connect ideas
                and sound more fluent in German.
              </p>
            </div>
          </section>

          <SectionCard title="1) Was ist ein Relativsatz?">
            <p style={{ margin: 0 }}>
              A <strong>Relativsatz</strong> gives extra information about a noun.
              It tells us more about a <strong>person</strong>, <strong>thing</strong>,
              or <strong>place</strong>.
            </p>

            <div style={tipBox}>
              <strong>Simple idea:</strong>
              <p style={{ margin: 0 }}>
                We can join two short sentences and make one better sentence.
              </p>
              <p style={exampleStyle}>
                <strong>Two sentences:</strong> Ich suche eine Wohnung. Die Wohnung ist nicht zu teuer.
              </p>
              <p style={exampleStyle}>
                <strong>One sentence:</strong> Ich suche eine Wohnung, <strong>die</strong> nicht zu teuer ist.
              </p>
            </div>
          </SectionCard>

          <SectionCard title="2) Merke">
            <div style={merkeBox}>
              <p style={{ margin: 0 }}>
                <strong>der</strong> for masculine nouns
              </p>
              <p style={{ margin: 0 }}>
                <strong>die</strong> for feminine nouns and plural nouns
              </p>
              <p style={{ margin: 0 }}>
                <strong>das</strong> for neuter nouns
              </p>
              <p style={{ margin: 0 }}>
                In the relative clause, the verb usually goes to the <strong>end</strong>.
              </p>
            </div>
          </SectionCard>

          <SectionCard title="3) Welche Relativpronomen benutzen wir?">
            <p style={{ margin: 0 }}>
              The relative pronoun usually matches the noun before it in <strong>gender</strong> and <strong>number</strong>.
            </p>

            <div style={tableWrapStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thTdStyle}>Noun</th>
                    <th style={thTdStyle}>Relative pronoun</th>
                    <th style={thTdStyle}>Example</th>
                    <th style={thTdStyle}>English translation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={thTdStyle}>masculine</td>
                    <td style={thTdStyle}>
                      <InlineCode>der</InlineCode>
                    </td>
                    <td style={thTdStyle}>
                      Der Makler, <strong>der</strong> sehr freundlich ist, kommt um 16 Uhr.
                    </td>
                    <td style={thTdStyle}>The real estate agent, who is very friendly, is coming at 4 p.m.</td>
                  </tr>
                  <tr>
                    <td style={thTdStyle}>feminine</td>
                    <td style={thTdStyle}>
                      <InlineCode>die</InlineCode>
                    </td>
                    <td style={thTdStyle}>
                      Die Wohnung, <strong>die</strong> wir suchen, ist im Zentrum.
                    </td>
                    <td style={thTdStyle}>The apartment that we are looking for is in the city center.</td>
                  </tr>
                  <tr>
                    <td style={thTdStyle}>neuter</td>
                    <td style={thTdStyle}>
                      <InlineCode>das</InlineCode>
                    </td>
                    <td style={thTdStyle}>
                      Das Zimmer, <strong>das</strong> sehr hell ist, gefällt mir.
                    </td>
                    <td style={thTdStyle}>I like the room that is very bright.</td>
                  </tr>
                  <tr>
                    <td style={thTdStyle}>plural</td>
                    <td style={thTdStyle}>
                      <InlineCode>die</InlineCode>
                    </td>
                    <td style={thTdStyle}>
                      Die Leute, <strong>die</strong> dort wohnen, sind nett.
                    </td>
                    <td style={thTdStyle}>The people who live there are nice.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard title="4) Wortstellung im Relativsatz">
            <p style={{ margin: 0 }}>
              A relative clause starts after a comma. The conjugated verb goes to the <strong>end</strong>.
            </p>

            <div style={tipBox}>
              <p style={exampleStyle}>
                <strong>Main clause:</strong> Das ist die Wohnung,
              </p>
              <p style={exampleStyle}>
                <strong>Relative clause:</strong> die sehr hell <strong>ist</strong>.
              </p>
              <p style={exampleStyle}>
                <strong>Full sentence:</strong> Das ist die Wohnung, die sehr hell <strong>ist</strong>.
              </p>
            </div>

            <div style={warningBox}>
              <strong>Achtung:</strong>
              <p style={{ margin: 0 }}>Do not put the verb in the middle.</p>
              <p style={exampleStyle}>
                ❌ Das ist die Wohnung, die <strong>ist</strong> sehr hell.
              </p>
              <p style={exampleStyle}>
                ✅ Das ist die Wohnung, die sehr hell <strong>ist</strong>.
              </p>
            </div>
          </SectionCard>

          <SectionCard title="5) Wohnung suchen – useful examples">
            <ul style={listStyle}>
              <li>Ich suche eine Wohnung, <strong>die</strong> nicht zu teuer ist.</li>
              <li>Ich möchte ein Zimmer, <strong>das</strong> einen Balkon hat.</li>
              <li>Der Vermieter, <strong>der</strong> gestern angerufen hat, ist freundlich.</li>
              <li>Wir suchen Nachbarn, <strong>die</strong> ruhig sind.</li>
              <li>Das Haus, <strong>das</strong> in der Nähe der Uni liegt, gefällt mir.</li>
              <li>Die Wohnung, <strong>die</strong> im dritten Stock liegt, ist schon vermietet.</li>
            </ul>
          </SectionCard>

          <SectionCard title="6) So findest du das richtige Pronomen">
            <div style={tipBox}>
              <p style={{ margin: 0 }}>
                Ask yourself: <strong>Which noun am I describing?</strong>
              </p>
              <ul style={listStyle}>
                <li><strong>der Makler</strong> → <InlineCode>der</InlineCode></li>
                <li><strong>die Wohnung</strong> → <InlineCode>die</InlineCode></li>
                <li><strong>das Zimmer</strong> → <InlineCode>das</InlineCode></li>
                <li><strong>die Leute</strong> → <InlineCode>die</InlineCode></li>
              </ul>
            </div>
          </SectionCard>

          <SectionCard title="7) Mini check">
            <p style={{ margin: 0 }}>Choose the correct relative pronoun.</p>

            <div style={scoreBox}>
              <p style={{ margin: 0 }}>
                <strong>Score:</strong> {score}/{quizData.length}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Checked:</strong> {checkedCount}/{quizData.length}
              </p>
              {allChecked ? (
                <p style={{ margin: 0 }}>
                  <strong>Result:</strong> {percentage}%
                </p>
              ) : (
                <p style={{ margin: 0, opacity: 0.8 }}>
                  Check all answers to see your final result.
                </p>
              )}
              <div>
                <button type="button" onClick={resetQuiz} style={secondaryBtnStyle}>
                  Reset mini check
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              {quizData.map((item) => (
                <QuizCard
                  key={item.id}
                  item={item}
                  selected={quizSelections[item.id] || ""}
                  checked={Boolean(quizChecked[item.id])}
                  onSelect={handleSelectOption}
                  onCheck={handleCheckAnswer}
                />
              ))}
            </div>
          </SectionCard>

          <SectionCard title="8) Zwei Sätze → ein Satz">
            <p style={{ margin: 0 }}>
              First try to write the new sentence yourself. Then reveal the answer.
            </p>
            <div style={{ display: "grid", gap: 10 }}>
              {transformData.map((item) => (
                <TransformPractice key={item.id} item={item} />
              ))}
            </div>
          </SectionCard>

          <SectionCard title="9) Quick practice with answers">
            {revealPracticeData.map((item) => (
              <RevealPractice
                key={item.number}
                number={item.number}
                prompt={item.prompt}
                answer={item.answer}
              />
            ))}
          </SectionCard>

          <SectionCard title="10) Common mistakes">
            <ul style={listStyle}>
              <li>
                <strong>Wrong pronoun:</strong> Match the noun correctly.
                <br />
                ❌ Die Makler, die freundlich ist.
                <br />
                ✅ Der Makler, der freundlich ist.
              </li>
              <li>
                <strong>No comma:</strong> In German, we use a comma before the relative clause.
              </li>
              <li>
                <strong>Verb not at the end:</strong>
                <br />
                ❌ Die Wohnung, die ist groß.
                <br />
                ✅ Die Wohnung, die groß ist.
              </li>
            </ul>
          </SectionCard>

          <SectionCard title="11) Remember">
            <div style={merkeBox}>
              <p style={{ margin: 0 }}>
                <strong>Relativsatz = extra information about a noun.</strong>
              </p>
              <p style={{ margin: 0 }}>
                Use <InlineCode>der / die / das</InlineCode>, add a comma, and put the verb at the end.
              </p>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default memo(A2Day7RelativeClausesWohnungGrammarPage);
