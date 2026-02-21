import React, { memo, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

/** =========================
 *  Styles + small UI blocks
 *  ========================= */
const sectionStyle = { ...styles.card, display: "grid", gap: 10 };

const chipStyle = {
  display: "inline-block",
  padding: "4px 8px",
  borderRadius: 999,
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
  fontSize: 13,
  fontWeight: 700,
};

const bigTapButton = {
  ...styles.secondaryButton,
  width: "fit-content",
  minHeight: 44, // mobile tap size
};

const primaryTapButton = {
  ...styles.primaryButton,
  width: "fit-content",
  minHeight: 44,
};

const ImageBreak = ({ src, alt, title, subtitle }) => (
  <div style={{ ...styles.card, padding: 0, overflow: "hidden" }}>
    <img
      src={src}
      alt={alt}
      loading="lazy"
      style={{
        width: "100%",
        height: "clamp(160px, 22vw, 220px)", // mobile polish
        objectFit: "cover",
        display: "block",
      }}
    />
    {(title || subtitle) && (
      <div style={{ padding: 12, display: "grid", gap: 4 }}>
        {title && <div style={{ fontWeight: 900 }}>{title}</div>}
        {subtitle && <div style={{ opacity: 0.85 }}>{subtitle}</div>}
      </div>
    )}
  </div>
);

const RuleCard = ({ title, rule, example, children }) => (
  <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, background: "#f8fafc" }}>
    <div style={{ fontWeight: 900, marginBottom: 8 }}>{title}</div>
    <div style={{ display: "grid", gap: 6 }}>
      <div>
        <strong>Rule:</strong> {rule}
      </div>
      <div>
        <strong>Example:</strong> <em>{example}</em>
      </div>
      {children ? <div style={{ marginTop: 6 }}>{children}</div> : null}
    </div>
  </div>
);

const TableScroll = ({ caption, children }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 520 }}>
      <caption style={{ textAlign: "left", paddingBottom: 8, fontWeight: 800 }}>{caption}</caption>
      {children}
    </table>
  </div>
);

/** =========================
 *  Tap Quiz (no typing)
 *  - 1 question at a time
 *  - instant feedback
 *  - Next button
 *  ========================= */
const TapQuiz = ({ title, items, onCorrect }) => {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);

  const q = items[index];
  const isCorrect = checked && picked === q.answer;
  const isWrong = checked && picked && picked !== q.answer;

  const resetForNext = () => {
    setPicked("");
    setChecked(false);
  };

  const next = () => {
    if (index < items.length - 1) {
      setIndex((i) => i + 1);
      resetForNext();
    }
  };

  const choose = (opt) => {
    setPicked(opt);
    setChecked(true);
    if (opt === q.answer) onCorrect?.();
  };

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, display: "grid", gap: 10 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "baseline" }}>
        <div style={{ fontWeight: 900 }}>{title}</div>
        <div style={{ opacity: 0.8, fontSize: 13 }}>
          ({index + 1}/{items.length})
        </div>
      </div>

      <div style={{ fontWeight: 800 }}>{q.prompt}</div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {q.options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => choose(opt)}
            style={{
              ...bigTapButton,
              borderColor: picked === opt ? "#111827" : undefined,
              fontWeight: picked === opt ? 900 : 600,
            }}
          >
            {opt}
          </button>
        ))}
        {isCorrect && <span style={{ fontWeight: 900 }}>✅ richtig</span>}
        {isWrong && <span style={{ fontWeight: 900 }}>❌ falsch</span>}
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button type="button" style={primaryTapButton} onClick={next} disabled={index >= items.length - 1}>
          Next question
        </button>

        <details>
          <summary style={{ cursor: "pointer", fontWeight: 800 }}>Show answer (Teacher)</summary>
          <div style={{ marginTop: 8 }}>
            <strong>Answer:</strong> {q.answer}
            {q.explain ? (
              <div style={{ marginTop: 6, opacity: 0.9 }}>
                <strong>Why:</strong> {q.explain}
              </div>
            ) : null}
          </div>
        </details>
      </div>
    </div>
  );
};

/** =========================
 *  3-Click Sentence Builder
 *  Subject → Verb → Phrase
 *  ========================= */
const SentenceBuilder = ({ title, subjects, verbs, phrases }) => {
  const [subject, setSubject] = useState("");
  const [verb, setVerb] = useState("");
  const [phrase, setPhrase] = useState("");

  const sentence = useMemo(() => {
    const s = [subject, verb, phrase].filter(Boolean).join(" ").trim();
    return s ? `${s}.` : "";
  }, [subject, verb, phrase]);

  const reset = () => {
    setSubject("");
    setVerb("");
    setPhrase("");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(sentence || "");
      alert("Copied!");
    } catch {
      alert("Copy failed. Please copy manually.");
    }
  };

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, display: "grid", gap: 10 }}>
      <div style={{ fontWeight: 900 }}>{title}</div>

      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ fontWeight: 800 }}>1) Choose subject</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {subjects.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setSubject(opt)}
              style={{
                ...bigTapButton,
                borderColor: subject === opt ? "#111827" : undefined,
                fontWeight: subject === opt ? 900 : 600,
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ fontWeight: 800 }}>2) Choose verb</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {verbs.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setVerb(opt)}
              style={{
                ...bigTapButton,
                borderColor: verb === opt ? "#111827" : undefined,
                fontWeight: verb === opt ? 900 : 600,
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ fontWeight: 800 }}>3) Choose phrase</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {phrases.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setPhrase(opt)}
              style={{
                ...bigTapButton,
                borderColor: phrase === opt ? "#111827" : undefined,
                fontWeight: phrase === opt ? 900 : 600,
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div style={{ ...styles.card, display: "grid", gap: 6 }}>
        <div style={{ fontWeight: 900 }}>Preview (copy this)</div>
        <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}>
          {sentence || "—"}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button type="button" style={primaryTapButton} onClick={copy} disabled={!sentence}>
          Copy sentence
        </button>
        <button type="button" style={{ ...bigTapButton }} onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
};

/** =========================
 *  Content (outside component)
 *  ========================= */
const IMG_GRAMMAR = "https://source.unsplash.com/n9AaeihA9HI/1600x900";
const IMG_TRAVEL = "https://source.unsplash.com/2JIvboGLeho/1600x900";
const IMG_MAP = "https://source.unsplash.com/6dW3xyQvcYE/1600x900";

const QUIZ_SCHONMAL = [
  {
    prompt: "Warst du schon mal in Accra?",
    options: ["Ja, ich war schon mal in Accra.", "Nein, ich war noch nie in Accra."],
    answer: "Ja, ich war schon mal in Accra.",
    explain: "schon mal = at least once before (positive experience).",
  },
  {
    prompt: "Warst du schon mal in Tamale?",
    options: ["Ja, ich war schon mal in Tamale.", "Nein, ich war noch nie in Tamale."],
    answer: "Nein, ich war noch nie in Tamale.",
    explain: "noch nie = never until now.",
  },
];

const QUIZ_WO_WOHER_WOHIN = [
  {
    prompt: "___ kommst du? → Ich komme aus Ghana.",
    options: ["Wo", "Woher", "Wohin"],
    answer: "Woher",
    explain: "woher = origin (where from).",
  },
  {
    prompt: "___ wohnst du? → Ich wohne in Kumasi.",
    options: ["Wo", "Woher", "Wohin"],
    answer: "Wo",
    explain: "wo = location (where).",
  },
  {
    prompt: "___ fährst du morgen? → Ich fahre nach Berlin.",
    options: ["Wo", "Woher", "Wohin"],
    answer: "Wohin",
    explain: "wohin = direction (where to).",
  },
];

const QUIZ_NACH_IN = [
  {
    prompt: "Wir fliegen ___ Schweiz.",
    options: ["nach", "in die", "in den"],
    answer: "in die",
    explain: "Die Schweiz has an article → in die Schweiz.",
  },
  {
    prompt: "Ich fahre ___ Ghana.",
    options: ["nach", "in die", "in den"],
    answer: "nach",
    explain: "Ghana has no article → nach Ghana.",
  },
  {
    prompt: "Wir fliegen ___ USA.",
    options: ["nach", "in die", "in den"],
    answer: "in die",
    explain: "die USA (plural) → in die USA.",
  },
];

const QUIZ_LIEGEN = [
  {
    prompt: "Berlin liegt im ___ von Deutschland.",
    options: ["Osten", "Ost", "östlich"],
    answer: "Osten",
    explain: "im Osten = in the east (location).",
  },
  {
    prompt: "Hamburg liegt im ___ von Deutschland.",
    options: ["Norden", "Nord", "nördlich"],
    answer: "Norden",
    explain: "im Norden = in the north.",
  },
];

const QUIZ_MAN_MANN = [
  {
    prompt: "___ kann hier gut essen. (one/people)",
    options: ["man", "Mann"],
    answer: "man",
    explain: "man = people in general.",
  },
  {
    prompt: "Der ___ ist Lehrer. (adult male person)",
    options: ["man", "Mann"],
    answer: "Mann",
    explain: "Mann = noun (a man).",
  },
];

const BUILDER_SUBJECTS = ["Ich", "Du", "Er"];
const BUILDER_VERBS = ["war", "hatte", "komme", "fahre"];
const BUILDER_PHRASES = [
  "schon mal in Accra",
  "noch nie in Tamale",
  "in Kumasi",
  "aus Ghana",
  "nach Berlin",
  "in die Schweiz",
];

/** =========================
 *  Page
 *  ========================= */
const FormingBasicStatementsPage = () => {
  const navigate = useNavigate();

  // Optional: simple progress across quizzes (counts correct taps only)
  const [points, setPoints] = useState(0);

  const recapText = useMemo(() => {
    return [
      "A1 RECAP (Day 8)",
      "",
      "1) Präteritum (past) for sein/haben:",
      "sein: ich war, du warst, er/sie/es war, wir waren, ihr wart, sie/Sie waren",
      "haben: ich hatte, du hattest, er/sie/es hatte, wir hatten, ihr hattet, sie/Sie hatten",
      "",
      "2) schon mal / noch nie:",
      "Warst du schon mal in ...?",
      "Ja, ich war schon mal in ... .",
      "Nein, ich war noch nie in ... .",
      "",
      "3) wo / woher / wohin:",
      "wo = location | woher = origin | wohin = direction",
      "",
      "4) nach vs in die (A1 exceptions):",
      "nach Ghana / nach Berlin / nach Deutschland",
      "in die Schweiz / in die USA",
    ].join("\n");
  }, []);

  const copyRecap = async () => {
    try {
      await navigator.clipboard.writeText(recapText);
      alert("Recap copied!");
    } catch {
      alert("Copy failed. Please copy manually.");
    }
  };

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Forming Basic Statements in German (A1)</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Day 8 Grammar: Countries and Languages (Chapter 4)</p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <span style={chipStyle}>Points: {points}</span>
          <span style={{ opacity: 0.85, fontSize: 13 }}>
            Get points by choosing correct answers in the tap checks.
          </span>
        </div>
      </header>

      <ImageBreak
        src={IMG_GRAMMAR}
        alt="Notebook and studying"
        title="Today’s idea"
        subtitle="Short sentences + correct question words + simple travel statements."
      />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Assignment Focus</h2>
        <p style={{ margin: 0 }}>
          <strong>schon mal, noch nie; irregular verbs; man vs Mann.</strong>
        </p>
        <RuleCard
          title="Core sentence pattern"
          rule="Subject + Verb + Information."
          example="Ich war gestern krank."
        />
      </section>

      <ImageBreak
        src={IMG_TRAVEL}
        alt="Travel photo"
        title="1) Past tense (Präteritum): sein & haben"
        subtitle="Only TWO verbs today."
      />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Past Tense for haben and sein</h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <span style={chipStyle}>Präsens</span>
          <span style={chipStyle}>Perfekt</span>
          <span style={chipStyle}>Präteritum</span>
          <span style={chipStyle}>Plusquamperfekt</span>
          <span style={chipStyle}>Futur I</span>
          <span style={chipStyle}>Futur II</span>
        </div>

        <RuleCard
          title="What we learn today"
          rule="Use Präteritum forms of sein/haben to talk about the past."
          example="Ich war in Berlin. / Ich hatte keinen Stadtplan."
        >
          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ fontWeight: 800 }}>Must memorize</div>
            <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
              <li>
                <strong>haben:</strong> ich hatte, du hattest, er/sie/es hatte, wir hatten, ihr hattet, sie/Sie hatten
              </li>
              <li>
                <strong>sein:</strong> ich war, du warst, er/sie/es war, wir waren, ihr wart, sie/Sie waren
              </li>
            </ul>
          </div>
        </RuleCard>

        <SentenceBuilder
          title="Quick practice: Build 1 sentence (3 clicks)"
          subjects={BUILDER_SUBJECTS}
          verbs={BUILDER_VERBS}
          phrases={BUILDER_PHRASES}
        />
      </section>

      <ImageBreak
        src={IMG_TRAVEL}
        alt="Experience and travel"
        title="2) schon mal / noch nie"
        subtitle="Talk about experiences (Ghana examples)."
      />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>schon mal and noch nie</h2>

        <RuleCard
          title="Meaning"
          rule="schon mal = at least once before | noch nie = never until now"
          example="Warst du schon mal in Accra? – Ja, ich war schon mal in Accra."
        />

        <TapQuiz title="Tap Check (2 questions)" items={QUIZ_SCHONMAL} onCorrect={() => setPoints((p) => p + 1)} />

        <TableScroll caption="Copy patterns">
          <tbody>
            <tr>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>Warst du schon mal in ...?</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>Ja, ich war schon mal in ... .</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>Nein, ich war noch nie in ... .</td>
            </tr>
          </tbody>
        </TableScroll>
      </section>

      <ImageBreak
        src={IMG_MAP}
        alt="Map"
        title="3) Location with liegen"
        subtitle="Where is the city located?"
      />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Location Statements with liegen</h2>

        <RuleCard
          title="Use liegen"
          rule="liegen = to be located (a city)."
          example="Berlin liegt im Osten von Deutschland."
        />

        <TapQuiz title="Tap Check (2 questions)" items={QUIZ_LIEGEN} onCorrect={() => setPoints((p) => p + 1)} />

        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Berlin liegt im Osten von Deutschland.</li>
          <li>Köln liegt im Westen von Deutschland.</li>
          <li>München liegt im Süden von Deutschland.</li>
          <li>Hamburg liegt im Norden von Deutschland.</li>
        </ul>
      </section>

      <ImageBreak
        src={IMG_MAP}
        alt="Directions"
        title="4) wo / woher / wohin"
        subtitle="The 3 question words you MUST know."
      />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>wo, woher, wohin</h2>

        <RuleCard
          title="3 question words"
          rule="wo = location | woher = origin | wohin = direction"
          example="Wohin fährst du? – Ich fahre nach Berlin."
        />

        <TapQuiz title="Tap Check (3 questions)" items={QUIZ_WO_WOHER_WOHIN} onCorrect={() => setPoints((p) => p + 1)} />

        <RuleCard
          title="nach vs in (A1)"
          rule="Use nach for most cities/countries with no article. Use in + article for exceptions."
          example="nach Ghana / nach Berlin — but in die Schweiz, in die USA"
        />

        <TapQuiz title="Tap Check (3 questions)" items={QUIZ_NACH_IN} onCorrect={() => setPoints((p) => p + 1)} />
      </section>

      <ImageBreak
        src={IMG_GRAMMAR}
        alt="Grammar"
        title="5) Irregular verbs (quick note)"
        subtitle="Only du + er/sie/es often change."
      />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Irregular Verbs with Vowel Change</h2>

        <RuleCard
          title="Easy rule"
          rule="Many vowel changes happen in du + er/sie/es."
          example="fahren: du fährst, er fährt"
        />

        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>nehmen: du <strong>nimmst</strong>, er <strong>nimmt</strong></li>
          <li>sprechen: du <strong>sprichst</strong>, er <strong>spricht</strong></li>
          <li>essen: du <strong>isst</strong>, er <strong>isst</strong></li>
          <li>fahren: du <strong>fährst</strong>, er <strong>fährt</strong></li>
          <li>laufen: du <strong>läufst</strong>, er <strong>läuft</strong></li>
        </ul>
      </section>

      <ImageBreak
        src={IMG_GRAMMAR}
        alt="People"
        title="6) man vs Mann"
        subtitle="One small word, big meaning."
      />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>man vs Mann</h2>

        <RuleCard
          title="Difference"
          rule="man = people in general | Mann = a man (noun)"
          example="Man kann hier gut essen. / Der Mann ist Lehrer."
        />

        <TapQuiz title="Tap Check (2 questions)" items={QUIZ_MAN_MANN} onCorrect={() => setPoints((p) => p + 1)} />
      </section>

      <ImageBreak
        src={IMG_TRAVEL}
        alt="Recap"
        title="1-minute recap (copyable)"
        subtitle="Students can screenshot or copy this."
      />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>1-Minute Recap</h2>

        <pre
          style={{
            margin: 0,
            padding: 12,
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            background: "#0b1220",
            color: "#e5e7eb",
            overflowX: "auto",
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
          }}
        >
          {recapText}
        </pre>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" style={primaryTapButton} onClick={copyRecap}>
            Copy recap
          </button>
        </div>
      </section>
    </main>
  );
};

export default memo(FormingBasicStatementsPage);
