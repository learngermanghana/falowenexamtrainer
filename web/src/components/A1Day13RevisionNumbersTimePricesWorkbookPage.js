import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 12 };

const section = {
  ...styles.card,
  display: "grid",
  gap: 14,
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
};

const lightBtn = {
  padding: "8px 12px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  background: "#fff",
  cursor: "pointer",
};

const darkBtn = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #111827",
  background: "#111827",
  color: "#fff",
  cursor: "pointer",
};

const answerBox = {
  border: "1px solid #d1d5db",
  borderRadius: 10,
  padding: 10,
  background: "#ecfdf5",
};

const infoBox = {
  border: "1px solid #bfdbfe",
  background: "#eff6ff",
  borderRadius: 10,
  padding: 12,
  display: "grid",
  gap: 6,
};

const heroImage =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80";

const heroCard = {
  ...styles.card,
  padding: 0,
  overflow: "hidden",
};

const numberItems = [
  ["56", "sechsundfünfzig"],
  ["248", "zweihundertachtundvierzig"],
  ["1,234", "eintausendzweihundertvierunddreißig"],
  ["3,452", "dreitausendvierhundertzweiundfünfzig"],
  ["4,560", "viertausendfünfhundertsechzig"],
  ["5,678", "fünftausendsechshundertachtundsiebzig"],
  ["6,789", "sechstausendsiebenhundertneunundachtzig"],
  ["7,890", "siebentausendachthundertneunzig"],
  ["9,999", "neuntausendneunhundertneunundneunzig"],
];

const timeItems = [
  ["2:15", "Viertel nach zwei"],
  ["5:45", "Viertel vor sechs"],
  ["7:30", "halb acht"],
  ["10:10", "zehn nach zehn"],
  ["8:20", "zwanzig nach acht"],
];

const priceItems = [
  ["5 €", "fünf Euro"],
  ["12 €", "zwölf Euro"],
  ["20 €", "zwanzig Euro"],
  ["45 €", "fünfundvierzig Euro"],
  ["99 €", "neunundneunzig Euro"],
  ["5,50 €", "fünf Euro fünfzig"],
  ["12,99 €", "zwölf Euro neunundneunzig"],
];

const shoppingSentenceItems = [
  ["Ich möchte ___.", "Ich möchte das."],
  ["Das kostet ___.", "Das kostet zwanzig Euro."],
  ["Ich habe ___.", "Ich habe fünfzehn Euro."],
  ["Das ist ___.", "Das ist billig."],
  ["Das ist ___.", "Das ist teuer."],
];

const yearItems = [
  ["1453", "vierzehnhundertdreiundfünfzig"],
  ["1944", "neunzehnhundertvierundvierzig"],
  ["2000", "zweitausend"],
  ["2025", "zweitausendfünfundzwanzig"],
];

const completeSentenceItems = [
  ["Ich habe ___ Euro.", "Ich habe zwanzig Euro."],
  ["Ich habe ___ Euro.", "Ich habe fünfundvierzig Euro."],
  ["Das kostet ___ Euro.", "Das kostet zwölf Euro."],
  ["Das kostet ___ Euro.", "Das kostet neunundneunzig Euro."],
  ["Es ist ___.", "Es ist halb acht."],
  ["Es ist ___.", "Es ist Viertel nach zwei."],
  ["Der Kurs beginnt um ___.", "Der Kurs beginnt um zehn Uhr."],
  ["Der Kurs beginnt um ___.", "Der Kurs beginnt um Viertel vor sechs."],
  ["Ich bin am ___ geboren.", "Ich bin am ersten Januar zweitausendeins geboren."],
  [
    "Ich bin am ___ geboren.",
    "Ich bin am zwölften Mai neunzehnhundertfünfundneunzig geboren.",
  ],
];

const buildSentenceItems = [
  {
    prompt: "Ich / habe / 20 Euro",
    answer: "Ich habe 20 Euro.",
  },
  {
    prompt: "Das / kostet / 12 Euro",
    answer: "Das kostet 12 Euro.",
  },
  {
    prompt: "Es / ist / halb acht",
    answer: "Es ist halb acht.",
  },
  {
    prompt: "Der Kurs / beginnt / um / 10 Uhr",
    answer: "Der Kurs beginnt um 10 Uhr.",
  },
  {
    prompt: "Ich / bin / am / 3. Juli 1980 / geboren",
    answer: "Ich bin am dritten Juli neunzehnhundertachtzig geboren.",
  },
];

const shoppingBuildSentenceItems = [
  {
    prompt: "Ich / möchte / das",
    answer: "Ich möchte das.",
  },
  {
    prompt: "Das / kostet / 20 Euro",
    answer: "Das kostet 20 Euro.",
  },
  {
    prompt: "Ich / habe / 15 Euro",
    answer: "Ich habe 15 Euro.",
  },
  {
    prompt: "Das / ist / billig",
    answer: "Das ist billig.",
  },
  {
    prompt: "Das / ist / teuer",
    answer: "Das ist teuer.",
  },
];

const mcqItems = [
  {
    q: "Choose the correct sentence.",
    options: [
      "Ich habe 50 Euro.",
      "Ich bin 50 Euro.",
      "Ich kostet 50 Euro.",
    ],
    correct: 0,
  },
  {
    q: "Choose the correct sentence.",
    options: [
      "Das kostet 20 Euro.",
      "Das haben 20 Euro.",
      "Das ist kostet 20 Euro.",
    ],
    correct: 0,
  },
  {
    q: "Choose the correct sentence.",
    options: [
      "Es ist halb acht.",
      "Es halb acht ist.",
      "Ist es halb acht um.",
    ],
    correct: 0,
  },
  {
    q: "Choose the correct sentence.",
    options: [
      "Der Kurs beginnt um zehn Uhr.",
      "Der Kurs um zehn Uhr beginnt.",
      "Beginnt der Kurs um zehn Uhr ist.",
    ],
    correct: 0,
  },
  {
    q: "Choose the correct sentence.",
    options: [
      "Ich bin am ersten Januar zweitausendeins geboren.",
      "Ich bin am ein Januar zweitausendeins geboren.",
      "Ich bin am erste Januar 2001 geboren.",
    ],
    correct: 0,
  },
];

const miniPracticeItems = [
  {
    question: "Wie viel Geld hast du?",
    answer: "Ich habe 30 Euro.",
  },
  {
    question: "Wie viel kostet das?",
    answer: "Das kostet 10 Euro.",
  },
  {
    question: "Wie spät ist es?",
    answer: "Es ist Viertel vor sechs.",
  },
  {
    question: "Wann beginnt der Kurs?",
    answer: "Der Kurs beginnt um halb acht.",
  },
  {
    question: "Wann bist du geboren?",
    answer: "Ich bin am dritten Juli neunzehnhundertachtzig geboren.",
  },
];

const shoppingMiniPracticeItems = [
  {
    question: "Was möchtest du?",
    answer: "Ich möchte das.",
  },
  {
    question: "Wie viel kostet das?",
    answer: "Das kostet 20 Euro.",
  },
  {
    question: "Wie viel Geld hast du?",
    answer: "Ich habe 15 Euro.",
  },
  {
    question: "Ist das billig oder teuer?",
    answer: "Das ist billig.",
  },
];

function RevealPractice({
  title,
  subtitle,
  items,
  placeholder = "Type your answer...",
}) {
  const [show, setShow] = useState({});
  const [inputs, setInputs] = useState({});

  return (
    <section style={section}>
      <div style={{ display: "grid", gap: 6 }}>
        <h2 style={{ margin: 0 }}>{title}</h2>
        {subtitle ? <p style={{ margin: 0 }}>{subtitle}</p> : null}
      </div>

      {items.map(([q, a], i) => (
        <div key={`${q}-${i}`} style={card}>
          <strong>{q}</strong>

          <input
            style={inputStyle}
            placeholder={placeholder}
            value={inputs[i] || ""}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, [i]: e.target.value }))
            }
          />

          <button
            type="button"
            style={lightBtn}
            onClick={() => setShow((prev) => ({ ...prev, [i]: !prev[i] }))}
          >
            {show[i] ? "Hide answer" : "Show answer"}
          </button>

          {show[i] ? <div style={answerBox}>{a}</div> : null}
        </div>
      ))}
    </section>
  );
}

function BuildSentenceSection() {
  const [show, setShow] = useState({});
  const [inputs, setInputs] = useState({});

  return (
    <section style={section}>
      <h2 style={{ margin: 0 }}>Build the Basic Statement</h2>
      <p style={{ margin: 0 }}>
        Rearrange the words to make a correct A1 sentence.
      </p>

      {buildSentenceItems.map((item, i) => (
        <div key={i} style={card}>
          <strong>{item.prompt}</strong>

          <input
            style={inputStyle}
            placeholder="Write the correct sentence..."
            value={inputs[i] || ""}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, [i]: e.target.value }))
            }
          />

          <button
            type="button"
            style={lightBtn}
            onClick={() => setShow((prev) => ({ ...prev, [i]: !prev[i] }))}
          >
            {show[i] ? "Hide answer" : "Show answer"}
          </button>

          {show[i] ? <div style={answerBox}>{item.answer}</div> : null}
        </div>
      ))}
    </section>
  );
}

function ShoppingBuildSentenceSection() {
  const [show, setShow] = useState({});
  const [inputs, setInputs] = useState({});

  return (
    <section style={section}>
      <h2 style={{ margin: 0 }}>Shopping Sentences</h2>
      <p style={{ margin: 0 }}>
        Practice short A1 shopping statements.
      </p>

      {shoppingBuildSentenceItems.map((item, i) => (
        <div key={i} style={card}>
          <strong>{item.prompt}</strong>

          <input
            style={inputStyle}
            placeholder="Write the correct sentence..."
            value={inputs[i] || ""}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, [i]: e.target.value }))
            }
          />

          <button
            type="button"
            style={lightBtn}
            onClick={() => setShow((prev) => ({ ...prev, [i]: !prev[i] }))}
          >
            {show[i] ? "Hide answer" : "Show answer"}
          </button>

          {show[i] ? <div style={answerBox}>{item.answer}</div> : null}
        </div>
      ))}
    </section>
  );
}

function MCQSection() {
  const [selected, setSelected] = useState({});
  const [checked, setChecked] = useState({});

  return (
    <section style={section}>
      <h2 style={{ margin: 0 }}>Choose the Correct A1 Sentence</h2>

      {mcqItems.map((item, qi) => (
        <div key={qi} style={card}>
          <strong>{item.q}</strong>

          {item.options.map((opt, oi) => {
            const isCorrect = checked[qi] && oi === item.correct;
            const isWrong =
              checked[qi] && selected[qi] === oi && oi !== item.correct;

            return (
              <button
                key={oi}
                type="button"
                style={{
                  ...lightBtn,
                  textAlign: "left",
                  background: isCorrect ? "#dcfce7" : isWrong ? "#fee2e2" : "#fff",
                }}
                onClick={() =>
                  setSelected((prev) => ({ ...prev, [qi]: oi }))
                }
              >
                {String.fromCharCode(65 + oi)}. {opt}
              </button>
            );
          })}

          <button
            type="button"
            style={darkBtn}
            onClick={() =>
              setChecked((prev) => ({ ...prev, [qi]: true }))
            }
          >
            Check answer
          </button>
        </div>
      ))}
    </section>
  );
}

function MiniPracticeSection() {
  const [show, setShow] = useState({});

  return (
    <section style={section}>
      <h2 style={{ margin: 0 }}>Mini Speaking Models</h2>
      <p style={{ margin: 0 }}>
        Use these short question-and-answer patterns for basic A1 communication.
      </p>

      {miniPracticeItems.map((item, i) => (
        <div key={i} style={card}>
          <strong>{item.question}</strong>

          <button
            type="button"
            style={lightBtn}
            onClick={() => setShow((prev) => ({ ...prev, [i]: !prev[i] }))}
          >
            {show[i] ? "Hide answer" : "Show answer"}
          </button>

          {show[i] ? <div style={answerBox}>{item.answer}</div> : null}
        </div>
      ))}
    </section>
  );
}

function ShoppingMiniPracticeSection() {
  const [show, setShow] = useState({});

  return (
    <section style={section}>
      <h2 style={{ margin: 0 }}>Mini Shopping Practice</h2>
      <p style={{ margin: 0 }}>
        Use these short question-and-answer models in simple shopping situations.
      </p>

      {shoppingMiniPracticeItems.map((item, i) => (
        <div key={i} style={card}>
          <strong>{item.question}</strong>

          <button
            type="button"
            style={lightBtn}
            onClick={() => setShow((prev) => ({ ...prev, [i]: !prev[i] }))}
          >
            {show[i] ? "Hide answer" : "Show answer"}
          </button>

          {show[i] ? <div style={answerBox}>{item.answer}</div> : null}
        </div>
      ))}
    </section>
  );
}

export default function A1RevisionStatementsPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.pageWrap}>
      <div style={styles.page}>
        <section style={heroCard}>
          <img
            src={heroImage}
            alt="Students learning German online"
            style={{ width: "100%", height: 240, objectFit: "cover", display: "block" }}
          />
          <div style={{ padding: 18, display: "grid", gap: 8 }}>
            <h1 style={{ margin: 0 }}>
              A1 Revision — Numbers, Time, Price, Years, and Basic Statements
            </h1>
            <p style={{ margin: 0 }}>
              Main goal: help students use numbers, time, prices, and dates in simple A1 statements.
            </p>
            <button type="button" style={lightBtn} onClick={() => navigate(-1)}>
              ← Back
            </button>
          </div>
        </section>

        <section style={section}>
          <h2 style={{ margin: 0 }}>Main A1 Sentence Patterns</h2>
          <div style={infoBox}>
            <div><strong>Ich habe …</strong></div>
            <div><strong>Das kostet …</strong></div>
            <div><strong>Es ist …</strong></div>
            <div><strong>Der Kurs beginnt um …</strong></div>
            <div><strong>Ich bin am … geboren.</strong></div>
            <div><strong>Ich möchte das.</strong></div>
            <div><strong>Das ist billig.</strong></div>
            <div><strong>Das ist teuer.</strong></div>
          </div>
        </section>

        <RevealPractice
          title="1. Numbers Revision"
          subtitle="Read the numbers in German."
          items={numberItems}
          placeholder="Type the number in German..."
        />

        <RevealPractice
          title="2. Time Revision"
          subtitle="Practice common German time expressions."
          items={timeItems}
          placeholder="Type the time in German..."
        />

        <RevealPractice
          title="3. Price Revision"
          subtitle="Practice saying prices in German."
          items={priceItems}
          placeholder="Type the price in German..."
        />

        <RevealPractice
          title="4. Shopping Statements"
          subtitle="Use prices in short everyday shopping sentences."
          items={shoppingSentenceItems}
          placeholder="Write the full sentence..."
        />

        <ShoppingBuildSentenceSection />
        <ShoppingMiniPracticeSection />

        <section style={section}>
          <h2 style={{ margin: 0 }}>5. Speaking About Years</h2>
          <div style={infoBox}>
            <div>
              <strong>Years from 1000 to 1999</strong> are often spoken with{" "}
              <strong>hundert</strong>.
            </div>
            <div>
              Example: <strong>1453</strong> = <strong>14 hundred 53</strong>
            </div>
            <div>
              Example: <strong>1944</strong> = <strong>19 hundred 44</strong>
            </div>
            <div>
              <strong>Years from 2000 onward</strong> are usually spoken as full thousands.
            </div>
            <div>
              Example: <strong>2025</strong> = <strong>zweitausendfünfundzwanzig</strong>
            </div>
          </div>
        </section>

        <RevealPractice
          title="6. Year Practice"
          subtitle="Notice the difference between older years and years from 2000 onward."
          items={yearItems}
          placeholder="Type the year in German..."
        />

        <RevealPractice
          title="7. Complete the Basic Statement"
          subtitle="Use only the main A1 sentence patterns."
          items={completeSentenceItems}
          placeholder="Write the full sentence..."
        />

        <BuildSentenceSection />
        <MCQSection />
        <MiniPracticeSection />
      </div>
    </div>
  );
}
