import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionTitleStyle = {
  margin: 0,
  fontSize: "1.1rem",
  fontWeight: 700,
};

const splitGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 12,
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 14,
  minWidth: 560,
};

const thTdStyle = {
  border: "1px solid #d1d5db",
  padding: "8px 10px",
  textAlign: "left",
  verticalAlign: "top",
};

const noteCardStyle = {
  padding: 12,
  borderRadius: 12,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
};

const practiceCardStyle = {
  padding: 12,
  borderRadius: 12,
  background: "#fffbeb",
  border: "1px solid #fcd34d",
  display: "grid",
  gap: 8,
};

const lessonBlocks = {
  kostenCards: [
    {
      title: "Kostet (singular)",
      lines: [
        "Use with one item. (Use when you ask about one thing.)",
        "Wie viel kostet der Apfel? (How much does the apple cost?)",
        "Der Apfel kostet 1 Euro. (The apple costs 1 euro.)",
      ],
    },
    {
      title: "Kosten (plural)",
      lines: [
        "Use with multiple items. (Use when you ask about more than one thing.)",
        "Wie viel kosten die Äpfel? (How much do the apples cost?)",
        "Die Äpfel kosten 3 Euro. (The apples cost 3 euros.)",
      ],
    },
  ],
  kostenConjugation: [
    { pronoun: "ich", english: "I", form: "koste", note: "Ich koste den Käse. (I taste the cheese.)" },
    { pronoun: "du", english: "you (informal)", form: "kostest", note: "Du kostest die Suppe." },
    { pronoun: "er/sie/es", english: "he/she/it", form: "kostet", note: "Er kostet / Sie kostet / Es kostet." },
    { pronoun: "wir", english: "we", form: "kosten", note: "Wir kosten den Kuchen." },
    { pronoun: "ihr", english: "you all (informal)", form: "kostet", note: "Ihr kostet den Saft." },
    { pronoun: "sie/Sie", english: "they / you (formal)", form: "kosten", note: "Sie kosten." },
  ],
  pronouns: [
    {
      gender: "Masculine",
      article: "der",
      pronoun: "er",
      example: "Der Apfel kostet 3 Euro. Er kostet 3 Euro. (The apple costs 3 euros. It costs 3 euros.)",
    },
    {
      gender: "Feminine",
      article: "die",
      pronoun: "sie",
      example: "Die Banane kostet 2 Euro. Sie kostet 2 Euro. (The banana costs 2 euros. It costs 2 euros.)",
    },
    {
      gender: "Neuter",
      article: "das",
      pronoun: "es",
      example: "Das Buch kostet 10 Euro. Es kostet 10 Euro. (The book costs 10 euros. It costs 10 euros.)",
    },
    {
      gender: "Plural",
      article: "die",
      pronoun: "sie",
      example: "Die Äpfel kosten 3 Euro. Sie kosten 3 Euro. (The apples cost 3 euros. They cost 3 euros.)",
    },
  ],
  gernLieber: [
    {
      title: "gern = like doing",
      lines: [
        "Ich spiele gern Fußball. (I like playing football/soccer.)",
        "Er schwimmt gern. (He likes swimming.)",
      ],
    },
    {
      title: "lieber = prefer",
      lines: [
        "Ich spiele gern Fußball, aber ich spiele lieber Basketball. (I like playing football, but I prefer playing basketball.)",
        "Er schwimmt gern, aber er fährt lieber Fahrrad. (He likes swimming, but he prefers cycling.)",
      ],
    },
  ],
  gernVsMogen: [
    {
      title: "mögen (verb) + noun",
      lines: [
        "Ich mag Pizza. (I like pizza.)",
        "Er mag Hunde. (He likes dogs.)",
        "Wir mögen den Film. (We like the movie.)",
      ],
    },
    {
      title: "gern (adverb) + action",
      lines: ["Ich lese gern. (I like reading.)", "Er kocht gern. (He likes cooking.)", "Sie tanzt gern. (She likes dancing.)"],
    },
  ],
  practice: [
    {
      id: "a",
      title: "A. Fill in: kosten or kostet",
      prompts: [
        "1. Wie viel ____ der Apfel?",
        "2. Die Bücher ____ 20 Euro.",
        "3. Das Eis ____ 2 Euro.",
        "4. Wie viel ____ die Bananen?",
      ],
      answers: "1) kostet 2) kosten 3) kostet 4) kosten",
    },
    {
      id: "b",
      title: "B. Write answers",
      prompts: [
        "1. Wie viel kostet der Stuhl? (20 Euro)",
        "2. Wie viel kosten die Äpfel? (3 Euro)",
        "3. Wie viel kostet das Auto? (5.000 Euro)",
      ],
      answers:
        "Sample answers: Der Stuhl kostet 20 Euro. Die Äpfel kosten 3 Euro. Das Auto kostet 5.000 Euro.",
    },
    {
      id: "c",
      title: "C. Gern or lieber?",
      prompts: [
        "1. Ich schwimme ____, aber ich spiele Tennis ____.",
        "2. Er trinkt Wasser ____, aber er trinkt Cola ____.",
      ],
      answers: "1) gern, lieber 2) gern, lieber",
    },
    {
      id: "d",
      title: "D. Gern or mögen?",
      prompts: [
        "1. Ich ____ den Film.",
        "2. Ich gehe ____ ins Kino.",
        "3. Sie ____ Schokolade.",
        "4. Er läuft ____.",
      ],
      answers: "1) mag 2) gern 3) mag 4) gern",
    },
  ],
};

const A1Day7PricesPreferencesGrammarPage = () => {
  const navigate = useNavigate();
  const [openAnswers, setOpenAnswers] = useState({});
  const isMobile = typeof window !== "undefined" ? window.innerWidth < 640 : false;

  const practiceBlocks = useMemo(() => lessonBlocks.practice, []);

  const toggleAnswer = (id) => {
    setOpenAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={cardStyle}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>

        <div style={{ borderRadius: 14, overflow: "hidden" }}>
          <img
            src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1400&q=80"
            alt="Shopping and prices in a market"
            style={{
              width: "100%",
              height: isMobile ? 170 : 260,
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        <h1 style={{ ...styles.title, margin: 0 }}>A1 Day 7 • Asking About Prices and Preferences</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Grammar notes for <strong>kosten/kostet</strong>, pronouns (<strong>er/sie/es</strong>), and expressing
          preferences with <strong>gern</strong>, <strong>lieber</strong>, and <strong>mögen</strong>.
        </p>
      </header>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>1) Kosten vs. Kostet</h2>
        <div style={splitGridStyle}>
          {lessonBlocks.kostenCards.map((block) => (
            <div key={block.title} style={noteCardStyle}>
              <strong>{block.title}</strong>
              {block.lines.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>
          ))}
        </div>

        <div style={noteCardStyle}>
          <strong>How to answer</strong>
          <div>Singular: Das kostet 5 Euro. (It costs 5 euros.)</div>
          <div>Plural: Die kosten 10 Euro. (They cost 10 euros.)</div>
        </div>

        <div style={noteCardStyle}>
          <strong>Conjugation of kosten (Präsens)</strong>
          {lessonBlocks.kostenConjugation.map((row) => (
            <div key={row.pronoun}>
              <strong>{row.pronoun}</strong> ({row.english}) <strong>{row.form}</strong> — {row.note}
            </div>
          ))}
          <div>
            <strong>Why "kostet" vs. "kosten"?</strong> For the subject <strong>er/sie/es</strong> we use{" "}
            <strong>kostet</strong>. For plural subjects like <strong>wir/sie (they)</strong>, we use <strong>kosten</strong>.
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>2) Pronouns with gender</h2>
        <div style={noteCardStyle}>
          To replace a noun with a pronoun, use <strong>er</strong>, <strong>sie</strong>, or <strong>es</strong> based on the
          noun's grammatical gender: masculine (<strong>der → er</strong>), feminine (<strong>die → sie</strong>), neuter (
          <strong>das → es</strong>). For plural nouns, use <strong>sie</strong>.
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thTdStyle}>Gender</th>
                <th style={thTdStyle}>Article</th>
                <th style={thTdStyle}>Pronoun</th>
                <th style={thTdStyle}>Example</th>
              </tr>
            </thead>
            <tbody>
              {lessonBlocks.pronouns.map((row) => (
                <tr key={row.gender}>
                  <td style={thTdStyle}>{row.gender}</td>
                  <td style={thTdStyle}>{row.article}</td>
                  <td style={thTdStyle}>{row.pronoun}</td>
                  <td style={thTdStyle}>{row.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>3) Gern and Lieber</h2>
        <div style={splitGridStyle}>
          {lessonBlocks.gernLieber.map((block) => (
            <div key={block.title} style={noteCardStyle}>
              <strong>{block.title}</strong>
              {block.lines.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>4) Gern vs. Mögen</h2>
        <div style={noteCardStyle}>
          <strong>Quick difference:</strong> <strong>Ich mag Fußball.</strong> means "I like football" (noun after{" "}
          <strong>mögen</strong>). <strong>Ich spiele gern Fußball.</strong> means "I like to play football" (action verb +
          <strong> gern</strong>). <strong>gern</strong> comes after the conjugated verb, while <strong>mögen</strong> is itself
          the main verb.
        </div>
        <div style={splitGridStyle}>
          {lessonBlocks.gernVsMogen.map((block) => (
            <div key={block.title} style={noteCardStyle}>
              <strong>{block.title}</strong>
              {block.lines.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>
          ))}
        </div>

        <div style={noteCardStyle}>
          <strong>Mögen conjugation (Präsens)</strong>
          <div>ich mag • du magst • er/sie/es mag • wir mögen • ihr mögt • sie/Sie mögen</div>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>5) Practice</h2>
        {practiceBlocks.map((block) => (
          <div key={block.id} style={practiceCardStyle}>
            <strong>{block.title}</strong>
            {block.prompts.map((prompt) => (
              <div key={prompt}>{prompt}</div>
            ))}

            <button
              style={{ ...styles.secondaryButton, width: "fit-content" }}
              onClick={() => toggleAnswer(block.id)}
              aria-expanded={Boolean(openAnswers[block.id])}
              aria-controls={`answer-${block.id}`}
            >
              {openAnswers[block.id] ? "Hide answer" : "Show answer"}
            </button>

            {openAnswers[block.id] && (
              <div id={`answer-${block.id}`} style={{ ...noteCardStyle, marginTop: 2 }}>
                <em>{block.answers}</em>
              </div>
            )}
          </div>
        ))}
      </section>
    </main>
  );
};

export default A1Day7PricesPreferencesGrammarPage;
