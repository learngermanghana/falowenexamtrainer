import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
  transition: "transform 180ms ease, box-shadow 180ms ease",
};

const listStyle = { margin: 0, paddingLeft: 20, display: "grid", gap: 8 };

const noteStyle = {
  margin: 0,
  fontSize: 14,
  lineHeight: 1.7,
  color: "#374151",
  background: "#f9fafb",
  border: "1px dashed #9ca3af",
  borderRadius: 12,
  padding: 12,
};

const boxStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
  lineHeight: 1.75,
  background: "white",
};

const chipRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
};

const chip = {
  display: "inline-block",
  padding: "4px 10px",
  borderRadius: 999,
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
  fontSize: 13,
  fontWeight: 700,
};

const imgStyle = {
  width: "100%",
  borderRadius: 12,
  marginBottom: 12,
  objectFit: "cover",
  maxHeight: 180,
  border: "1px solid #e5e7eb",
  transition: "transform 220ms ease",
};

const linkBtn = {
  ...styles.primaryButton,
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
};

const quizQuestionStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
  background: "#fff",
  display: "grid",
  gap: 10,
};

const optionBtn = (selected, correct, showResult) => ({
  width: "100%",
  textAlign: "left",
  padding: "12px 14px",
  borderRadius: 12,
  border: showResult
    ? selected === correct
      ? "1px solid #16a34a"
      : selected
      ? "1px solid #dc2626"
      : "1px solid #e5e7eb"
    : selected
    ? "1px solid #4f46e5"
    : "1px solid #e5e7eb",
  background: showResult
    ? selected === correct
      ? "#f0fdf4"
      : selected
      ? "#fef2f2"
      : "#fff"
    : selected
    ? "#eef2ff"
    : "#fff",
  cursor: "pointer",
  fontSize: 15,
  lineHeight: 1.5,
});

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #d1d5db",
  fontSize: 15,
  outline: "none",
  boxSizing: "border-box",
};

const normalize = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.?!,]/g, "");

const quizData = [
  {
    id: 1,
    type: "mcq",
    question: 'Which word do we use for months? ("in August")',
    options: ["am", "im", "um"],
    correct: "im",
    explanation: 'We use "im" with months: Im August.',
  },
  {
    id: 2,
    type: "mcq",
    question: 'Which word do we use for days? ("on Monday")',
    options: ["am", "im", "um"],
    correct: "am",
    explanation: 'We use "am" with days: Am Montag.',
  },
  {
    id: 3,
    type: "mcq",
    question: 'Which word do we use for time? ("at 10 o’clock")',
    options: ["um", "im", "am"],
    correct: "um",
    explanation: 'We use "um" for clock time: Um 10 Uhr.',
  },
  {
    id: 4,
    type: "mcq",
    question: 'Choose the correct sentence:',
    options: [
      "Im Montag habe ich Deutsch.",
      "Am Montag habe ich Deutsch.",
      "Um Montag habe ich Deutsch.",
    ],
    correct: "Am Montag habe ich Deutsch.",
    explanation: 'Days take "am".',
  },
  {
    id: 5,
    type: "mcq",
    question: 'Choose the correct sentence:',
    options: [
      "Um August fahre ich nach Kumasi.",
      "Im August fahre ich nach Kumasi.",
      "Am August fahre ich nach Kumasi.",
    ],
    correct: "Im August fahre ich nach Kumasi.",
    explanation: 'Months take "im".',
  },
  {
    id: 6,
    type: "mcq",
    question: 'Choose the correct sentence:',
    options: [
      "Ich komme am 8 Uhr.",
      "Ich komme im 8 Uhr.",
      "Ich komme um 8 Uhr.",
    ],
    correct: "Ich komme um 8 Uhr.",
    explanation: 'Clock time takes "um".',
  },
  {
    id: 7,
    type: "mcq",
    question: 'What is the correct weather sentence?',
    options: ["Es ist regnet.", "Es regnet.", "Es Regen."],
    correct: "Es regnet.",
    explanation: 'For weather, say: "Es regnet."',
  },
  {
    id: 8,
    type: "mcq",
    question: 'Which one means: "The sun is shining"?',
    options: ["Die Sonne scheint.", "Die Sonne ist kalt.", "Es schneit."],
    correct: "Die Sonne scheint.",
    explanation: '"Die Sonne scheint" = The sun is shining.',
  },
  {
    id: 9,
    type: "mcq",
    question: 'Which one is a season?',
    options: ["der Montag", "der Sommer", "der März"],
    correct: "der Sommer",
    explanation: '"der Sommer" is a season.',
  },
  {
    id: 10,
    type: "mcq",
    question: 'Which sentence uses Perfekt correctly?',
    options: [
      "Ich habe gegangen.",
      "Ich bin gegangen.",
      "Ich bin gespielt.",
    ],
    correct: "Ich bin gegangen.",
    explanation: '"gehen" uses "sein" in Perfekt.',
  },
  {
    id: 11,
    type: "mcq",
    question: 'Which sentence uses Perfekt correctly?',
    options: [
      "Er hat gegessen.",
      "Er ist gegessen.",
      "Er hat gegangen.",
    ],
    correct: "Er hat gegessen.",
    explanation: '"essen" normally uses "haben".',
  },
  {
    id: 12,
    type: "input",
    question: 'Complete with one word: ___ Montag habe ich einen Termin.',
    correctAnswers: ["am"],
    explanation: 'Correct: "Am Montag ..."',
  },
  {
    id: 13,
    type: "input",
    question: 'Complete with one word: ___ 10 Uhr komme ich.',
    correctAnswers: ["um"],
    explanation: 'Correct: "Um 10 Uhr ..."',
  },
  {
    id: 14,
    type: "input",
    question: 'Complete with one word: ___ Juli haben wir Ferien.',
    correctAnswers: ["im"],
    explanation: 'Correct: "Im Juli ..."',
  },
  {
    id: 15,
    type: "input",
    question: 'Write the missing auxiliary verb: Ich ___ gespielt.',
    correctAnswers: ["habe"],
    explanation: 'Correct: "Ich habe gespielt."',
  },
  {
    id: 16,
    type: "input",
    question: 'Write the missing auxiliary verb: Wir ___ gefahren.',
    correctAnswers: ["sind"],
    explanation: 'Correct: "Wir sind gefahren."',
  },
];

const WeatherPerfektLetterPage = () => {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const score = useMemo(() => {
    let total = quizData.length;
    let correct = 0;

    quizData.forEach((q) => {
      const userAnswer = answers[q.id];

      if (q.type === "mcq") {
        if (userAnswer === q.correct) correct += 1;
      } else {
        const normalizedUser = normalize(userAnswer || "");
        const ok = q.correctAnswers.some((ans) => normalize(ans) === normalizedUser);
        if (ok) correct += 1;
      }
    });

    return { correct, total };
  }, [answers]);

  const isCorrect = (q) => {
    const userAnswer = answers[q.id];
    if (q.type === "mcq") return userAnswer === q.correct;
    const normalizedUser = normalize(userAnswer || "");
    return q.correctAnswers.some((ans) => normalize(ans) === normalizedUser);
  };

  const resetQuiz = () => {
    setAnswers({});
    setShowResults(false);
  };

  return (
    <div style={styles.page}>
      <style>{`
        .falowen-section { animation: falowenFadeUp 420ms ease both; }
        .falowen-section:nth-child(2) { animation-delay: 40ms; }
        .falowen-section:nth-child(3) { animation-delay: 80ms; }
        .falowen-section:nth-child(4) { animation-delay: 120ms; }
        .falowen-section:nth-child(5) { animation-delay: 160ms; }
        .falowen-section:nth-child(6) { animation-delay: 200ms; }
        .falowen-section:nth-child(7) { animation-delay: 240ms; }
        .falowen-section:nth-child(8) { animation-delay: 280ms; }
        .falowen-section:nth-child(9) { animation-delay: 320ms; }

        @keyframes falowenFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hoverCard:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,0,0,0.08); }
        .hoverImg:hover { transform: scale(1.01); }

        .quizGrid {
          display: grid;
          gap: 12px;
        }

        @media (max-width: 640px) {
          .quizActions {
            display: grid !important;
            gap: 10px !important;
          }
        }
      `}</style>

      <AppBackButton label="Back" fallbackPath="/campus/course" />

      <section style={cardStyle} className="falowen-section hoverCard">
        <h1 style={{ margin: 0 }}>
          Day 21 · Chapter 13: Weather + Seasons + Dates/Time + Simple Letter Writing (A1)
        </h1>

        <p style={{ margin: 0, lineHeight: 1.65 }}>
          Learn to talk about <strong>weather</strong>, <strong>seasons</strong>,
          and use <strong>im</strong>, <strong>am</strong>, <strong>um</strong>.
          <br />
          Practice simple letters using <strong>weil</strong>.
        </p>

        <div style={chipRow}>
          <span style={chip}>im = months</span>
          <span style={chip}>am = days</span>
          <span style={chip}>um = time</span>
          <span style={chip}>weil = verb at end</span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <a
            href="https://www.falowen.app/campus/course/weather-perfekt-letter-13"
            target="_blank"
            rel="noreferrer"
            style={linkBtn}
          >
            Open this course lesson ↗
          </a>
          <span style={{ ...noteStyle, padding: "8px 10px", borderStyle: "solid" }}>
            Tip: Read the lesson, then practice the light test below.
          </span>
        </div>
      </section>

      <section style={cardStyle} className="falowen-section hoverCard">
        <h2 style={{ margin: 0 }}>1) Weather (A1)</h2>

        <img
          src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=70"
          alt="Weather"
          style={imgStyle}
          className="hoverImg"
        />

        <ul style={listStyle}>
          <li>Es regnet. (It is raining.)</li>
          <li>Es schneit. (It is snowing.)</li>
          <li>Es ist kalt / warm / windig. (It is cold / warm / windy.)</li>
          <li>Die Sonne scheint. (The sun is shining.)</li>
        </ul>

        <div style={noteStyle}>
          <strong>Important:</strong> For weather with a verb, use only <strong>es + verb</strong>.
          <div>✅ Es regnet. / Es schneit.</div>
          <div>❌ Es ist regnet. / Es ist schneit.</div>
          <div style={{ marginTop: 8 }}>
            Use <strong>Es ist ...</strong> only with adjectives: <em>Es ist kalt/warm/windig.</em>
          </div>
        </div>
      </section>

      <section style={cardStyle} className="falowen-section hoverCard">
        <h2 style={{ margin: 0, fontSize: 30 }}>1.1) How to ask for the weather (A1)</h2>

        <div style={{ ...noteStyle, fontSize: 16 }}>
          <strong>Simple questions:</strong>
          <div>• Wie ist das Wetter? (How is the weather?)</div>
          <div>• Wie ist das Wetter heute? (How is the weather today?)</div>
          <div>• Wie ist das Wetter in Accra? (…in Accra?)</div>
          <div style={{ marginTop: 10 }}>
            <strong>Follow-up questions:</strong>
            <div>• Regnet es? (Is it raining?)</div>
            <div>• Schneit es? (Is it snowing?)</div>
            <div>• Ist es warm oder kalt? (Is it warm or cold?)</div>
            <div>• Gibt es viel Wind? / Ist es windig? (Is it windy?)</div>
          </div>

          <div style={{ marginTop: 10 }}>
            <strong>Mini dialogue:</strong>
            <div>— Wie ist das Wetter heute?</div>
            <div>— Es ist warm, aber es regnet.</div>
          </div>
        </div>

        <div style={boxStyle}>
          <strong>Quick speaking practice (30 seconds):</strong>
          <ul style={listStyle}>
            <li>Heute ist es … (warm/kalt/windig).</li>
            <li>In Accra ist es …</li>
            <li>Ich mag das Wetter, weil …</li>
          </ul>
        </div>
      </section>

      <section style={cardStyle} className="falowen-section hoverCard">
        <h2 style={{ margin: 0 }}>2) Seasons + Months</h2>

        <img
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=70"
          alt="Seasons"
          style={imgStyle}
          className="hoverImg"
        />

        <div style={boxStyle}>
          <strong>Seasons:</strong>
          <ul style={listStyle}>
            <li>der Frühling (spring)</li>
            <li>der Sommer (summer)</li>
            <li>der Herbst (autumn / fall)</li>
            <li>der Winter (winter)</li>
          </ul>

          <strong>Months:</strong>
          <p style={{ margin: 0 }}>
            Januar, Februar, März, April, Mai, Juni, Juli, August, September,
            Oktober, November, Dezember
          </p>
        </div>
      </section>

      <section style={cardStyle} className="falowen-section hoverCard">
        <h2 style={{ margin: 0 }}>3) im / am / um</h2>

        <div style={boxStyle}>
          <ul style={listStyle}>
            <li>Im August fahre ich in den Urlaub.</li>
            <li>Am Montag habe ich einen Termin.</li>
            <li>Um 10 Uhr komme ich.</li>
          </ul>
        </div>
      </section>

      <section style={cardStyle} className="falowen-section hoverCard">
        <h2 style={{ margin: 0 }}>3.1) A1 Grammar Notes: Perfekt (Past Tense)</h2>

        <div style={noteStyle}>
          <strong>Teaching note:</strong> We teach <strong>Perfekt</strong> for A1
          students so you can talk about the past in a simple, correct way.
        </div>

        <div style={boxStyle}>
          <h3 style={{ marginTop: 0 }}>Präteritum vs. Perfekt (quick idea in simple English first)</h3>
          <p style={{ marginTop: 0 }}>
            In A1, we focus on <strong>Perfekt</strong> because it is the most common
            past tense in spoken German. <strong>Präteritum</strong> is also past tense,
            but you will often see it in books, stories, news, and with common verbs
            like <em>sein</em> and <em>haben</em>.
          </p>
          <ul style={listStyle}>
            <li><strong>Perfekt</strong> = most common in speaking.</li>
            <li><strong>Präteritum</strong> = common in writing and narration.</li>
          </ul>
          <ul style={listStyle}>
            <li><strong>Präteritum:</strong> Ich aß. (I ate.)</li>
            <li><strong>Perfekt:</strong> Ich habe gegessen. (I have eaten / I ate.)</li>
            <li><strong>Präteritum:</strong> Ich war müde. (I was tired.)</li>
            <li><strong>Perfekt:</strong> Ich bin müde gewesen. (I was tired.)</li>
          </ul>

          <h3 style={{ marginTop: 0 }}>Statements using "haben" and "sein"</h3>

          <h4 style={{ marginBottom: 8 }}>1) Overview of Perfekt</h4>
          <p style={{ marginTop: 0 }}>
            The <strong>Perfekt</strong> tense is used to talk about actions or
            events that happened in the past. It is commonly used in spoken
            German and is formed with an auxiliary verb (<strong>haben</strong>{" "}
            or <strong>sein</strong>) and the past participle of the main verb.
          </p>

          <h4 style={{ marginBottom: 8 }}>2) Auxiliary verbs: "haben" and "sein"</h4>
          <ul style={listStyle}>
            <li>
              <strong>Haben:</strong> Used for actions or events that you can
              control.
            </li>
            <li>
              <strong>Sein:</strong> Used for movements (directional verbs) or
              changes of state (things you cannot control).
            </li>
          </ul>

          <h4 style={{ marginBottom: 8 }}>3) Forming the past participle</h4>
          <ul style={listStyle}>
            <li>
              <strong>Regular verbs:</strong> start with "ge-" and end with "-t".
              <br />
              <em>Example:</em> spielen (to play) → gespielt
            </li>
            <li>
              <strong>Irregular verbs:</strong> start with "ge-" and end with
              "-en".
              <br />
              <em>Example:</em> sprechen (to speak) → gesprochen
            </li>
            <li>
              <strong>Separable verbs:</strong> "ge-" is placed in the middle,
              between the prefix and the verb stem.
              <br />
              <em>Example:</em> aufräumen (to tidy up) → aufgeräumt
            </li>
          </ul>

          <h4 style={{ marginBottom: 8 }}>4) Using "haben" in Perfekt</h4>
          <p style={{ marginTop: 0 }}>
            Most verbs use <strong>haben</strong> as the auxiliary verb.
          </p>
          <ul style={listStyle}>
            <li>Ich habe gespielt. (I played.)</li>
            <li>Er hat gegessen. (He ate.)</li>
          </ul>

          <h4 style={{ marginBottom: 8 }}>5) Using "sein" in Perfekt</h4>
          <p style={{ marginTop: 0 }}>
            <strong>Sein</strong> is used with verbs indicating a change of place
            or state.
          </p>
          <ul style={listStyle}>
            <li>Ich bin gegangen. (I went.)</li>
            <li>Sie ist gefahren. (She drove.)</li>
            <li>
              Some exceptions still use <strong>sein</strong>, such as <em>bleiben</em>{" "}
              (to stay) and <em>sein</em> (to be).
            </li>
          </ul>

          <h4 style={{ marginBottom: 8 }}>6) More examples</h4>
          <p style={{ marginBottom: 6 }}>
            <strong>Regular verbs with "haben":</strong>
          </p>
          <ul style={listStyle}>
            <li>machen (to do/make) → Ich habe gemacht. (I did/made.)</li>
            <li>arbeiten (to work) → Du hast gearbeitet. (You worked.)</li>
          </ul>

          <p style={{ marginBottom: 6 }}>
            <strong>Irregular verbs with "haben":</strong>
          </p>
          <ul style={listStyle}>
            <li>sehen (to see) → Er hat gesehen. (He saw.)</li>
            <li>schreiben (to write) → Wir haben geschrieben. (We wrote.)</li>
          </ul>

          <p style={{ marginBottom: 6 }}>
            <strong>Directional verbs with "sein":</strong>
          </p>
          <ul style={listStyle}>
            <li>kommen (to come) → Ihr seid gekommen. (You all came.)</li>
            <li>fahren (to drive/go) → Sie sind gefahren. (They drove/went.)</li>
          </ul>

          <p style={{ marginBottom: 6 }}>
            <strong>Separable verbs:</strong>
          </p>
          <ul style={listStyle}>
            <li>aufräumen (to tidy up) → Ich habe aufgeräumt. (I tidied up.)</li>
            <li>anrufen (to call) → Du hast angerufen. (You called.)</li>
          </ul>
        </div>

        <div style={noteStyle}>
          <strong>Small quick practice (2 minutes):</strong>
          <div>
            Make 6 Perfekt sentences (3 with <strong>haben</strong>, 3 with{" "}
            <strong>sein</strong>):
          </div>
          <div style={{ marginTop: 8 }}>
            • spielen / lernen / aufräumen <br />
            • gehen / kommen / fahren
          </div>
          <div style={{ marginTop: 8 }}>
            Example: <em>Ich habe gelernt.</em> / <em>Ich bin gegangen.</em>
          </div>
        </div>
      </section>

      <section style={cardStyle} className="falowen-section hoverCard">
        <h2 style={{ margin: 0 }}>4) Asking for Price (A1) — Important for Letter Writing</h2>

        <img
          src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1600&q=70"
          alt="Payment"
          style={imgStyle}
          className="hoverImg"
        />

        <div style={noteStyle}>
          <strong>Simple price questions:</strong>
          <div>• Wie viel kostet der Kurs?</div>
          <div>• Was kostet der Kurs?</div>

          <div style={{ marginTop: 10 }}>
            <strong>Payment:</strong>
            <div>• Wie kann ich bezahlen?</div>
            <div>• Mit Kreditkarte oder bar?</div>
          </div>

          <div style={{ marginTop: 10 }}>
            <strong>Polite request:</strong>
            <div>• Könnten Sie mir bitte Informationen geben?</div>
            <div>• Wann fängt der Kurs an?</div>
          </div>
        </div>
      </section>

      <section style={cardStyle} className="falowen-section hoverCard">
        <h2 style={{ margin: 0 }}>5) Light Knowledge Test</h2>

        <div style={noteStyle}>
          This is a small practice check inside the grammar book. It is only for
          quick understanding.
        </div>

        {showResults && (
          <div
            style={{
              ...boxStyle,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: 10,
              alignItems: "center",
            }}
          >
            <div>
              <strong>Your score:</strong> {score.correct}/{score.total}
            </div>
            <div
              style={{
                fontWeight: 700,
                color:
                  score.correct >= Math.ceil(score.total * 0.7) ? "#166534" : "#991b1b",
              }}
            >
              {score.correct >= Math.ceil(score.total * 0.7)
                ? "Good understanding"
                : "Review the notes again"}
            </div>
          </div>
        )}

        <div className="quizGrid">
          {quizData.map((q, index) => (
            <div key={q.id} style={quizQuestionStyle}>
              <div style={{ fontWeight: 700, lineHeight: 1.55 }}>
                {index + 1}. {q.question}
              </div>

              {q.type === "mcq" ? (
                <div style={{ display: "grid", gap: 8 }}>
                  {q.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [q.id]: option,
                        }))
                      }
                      style={optionBtn(answers[q.id] === option, q.correct, showResults)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  value={answers[q.id] || ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [q.id]: e.target.value,
                    }))
                  }
                  placeholder="Write your answer"
                  style={inputStyle}
                />
              )}

              {showResults && (
                <div
                  style={{
                    borderRadius: 12,
                    padding: 10,
                    fontSize: 14,
                    lineHeight: 1.65,
                    background: isCorrect(q) ? "#f0fdf4" : "#fef2f2",
                    border: isCorrect(q) ? "1px solid #bbf7d0" : "1px solid #fecaca",
                    color: isCorrect(q) ? "#166534" : "#991b1b",
                  }}
                >
                  <strong>{isCorrect(q) ? "Correct." : "Not correct."}</strong>{" "}
                  {q.explanation}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="quizActions" style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <button
            type="button"
            style={styles.primaryButton}
            onClick={() => setShowResults(true)}
          >
            Check answers
          </button>

          <button
            type="button"
            style={styles.secondaryButton}
            onClick={resetQuiz}
          >
            Reset
          </button>
        </div>
      </section>
    </div>
  );
};

export default WeatherPerfektLetterPage;
