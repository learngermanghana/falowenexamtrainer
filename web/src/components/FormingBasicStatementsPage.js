import React, { memo, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

/** =========================
 *  Small UI blocks (notes-first)
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
  minHeight: 44,
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
        height: "clamp(160px, 22vw, 220px)",
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
 *  Tiny Tap Check (1 question)
 *  ========================= */
const TapCheck = ({ title = "Quick check", prompt, options, answer, explain }) => {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);

  const isCorrect = checked && picked === answer;
  const isWrong = checked && picked && picked !== answer;

  const choose = (opt) => {
    setPicked(opt);
    setChecked(true);
  };

  const reset = () => {
    setPicked("");
    setChecked(false);
  };

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, display: "grid", gap: 10 }}>
      <div style={{ fontWeight: 900 }}>{title}</div>
      <div style={{ fontWeight: 800 }}>{prompt}</div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {options.map((opt) => (
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
        <button type="button" style={bigTapButton} onClick={reset}>
          Reset
        </button>
        <details>
          <summary style={{ cursor: "pointer", fontWeight: 800 }}>Show answer (Teacher)</summary>
          <div style={{ marginTop: 8 }}>
            <strong>Answer:</strong> {answer}
            {explain ? (
              <div style={{ marginTop: 6, opacity: 0.9 }}>
                <strong>Why:</strong> {explain}
              </div>
            ) : null}
          </div>
        </details>
      </div>
    </div>
  );
};

/** =========================
 *  Optional: One Sentence Builder (only once)
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
      <div style={{ opacity: 0.85 }}>3 clicks only: Subject → Verb → Phrase.</div>

      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ fontWeight: 800 }}>Subject</div>
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
        <div style={{ fontWeight: 800 }}>Verb</div>
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
        <div style={{ fontWeight: 800 }}>Phrase</div>
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
        <div style={{ fontWeight: 900 }}>Preview</div>
        <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}>
          {sentence || "—"}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button type="button" style={primaryTapButton} onClick={copy} disabled={!sentence}>
          Copy sentence
        </button>
        <button type="button" style={bigTapButton} onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
};

/** =========================
 *  Free-to-use images
 *  ========================= */
const IMG_GRAMMAR = "https://source.unsplash.com/n9AaeihA9HI/1600x900";
const IMG_TRAVEL = "https://source.unsplash.com/2JIvboGLeho/1600x900";
const IMG_MAP = "https://source.unsplash.com/6dW3xyQvcYE/1600x900";

/** =========================
 *  Content
 *  ========================= */
const BUILDER_SUBJECTS = ["Ich", "Du", "Er"];
const BUILDER_VERBS = ["war", "hatte", "komme", "fahre"];
const BUILDER_PHRASES = ["schon mal in Accra", "noch nie in Tamale", "in Kumasi", "aus Ghana", "nach Berlin", "in die Schweiz"];

const FormingBasicStatementsPage = () => {
  const navigate = useNavigate();

  const recapText = useMemo(() => {
    return [
      "A1 RECAP (Day 8)",
      "",
      "sein (past): ich war, du warst, er/sie/es war, wir waren, ihr wart, sie/Sie waren",
      "haben (past): ich hatte, du hattest, er/sie/es hatte, wir hatten, ihr hattet, sie/Sie hatten",
      "",
      "schon mal / noch nie:",
      "Warst du schon mal in ...?",
      "Ja, ich war schon mal in ... .",
      "Nein, ich war noch nie in ... .",
      "",
      "wo / woher / wohin:",
      "wo = location | woher = origin | wohin = direction",
      "",
      "nach vs in die (A1):",
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
      </header>

      <ImageBreak src={IMG_GRAMMAR} alt="Notebook and studying" title="Grammar Notes" subtitle="Short rules + one example + one quick check." />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Assignment Focus (what to understand)</h2>
        <p style={{ margin: 0 }}>
          <strong>schon mal, noch nie; irregular verbs; man vs Mann.</strong>
        </p>
        <RuleCard title="Core sentence pattern" rule="Subject + Verb + Information." example="Ich war gestern krank." />
      </section>

      <ImageBreak src={IMG_TRAVEL} alt="Travel" title="1) Präteritum for sein & haben" subtitle="Only two verbs today." />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Past Tense for haben and sein (Präteritum)</h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <span style={chipStyle}>Präsens</span>
          <span style={chipStyle}>Perfekt</span>
          <span style={chipStyle}>Präteritum</span>
          <span style={chipStyle}>Futur</span>
        </div>

        <RuleCard
          title="Must memorize"
          rule="sein/haben in Präteritum are very common in speaking."
          example="Ich war in Berlin. / Ich hatte keinen Stadtplan."
        >
          <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
            <li>
              <strong>haben:</strong> ich hatte, du hattest, er/sie/es hatte, wir hatten, ihr hattet, sie/Sie hatten
            </li>
            <li>
              <strong>sein:</strong> ich war, du warst, er/sie/es war, wir waren, ihr wart, sie/Sie waren
            </li>
          </ul>
        </RuleCard>

        <TapCheck
          title="Quick check (1)"
          prompt="Choose the correct past form: ___ du gestern in Accra?"
          options={["war", "warst", "waren"]}
          answer="warst"
          explain="du → warst"
        />
      </section>

      <ImageBreak src={IMG_TRAVEL} alt="Experience" title="2) schon mal / noch nie" subtitle="Talk about experiences." />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>schon mal and noch nie</h2>

        <RuleCard
          title="Meaning"
          rule="schon mal = at least once before | noch nie = never until now"
          example="Warst du schon mal in Accra? – Ja, ich war schon mal in Accra."
        />

        <TapCheck
          title="Quick check (1)"
          prompt="Warst du schon mal in Tamale?"
          options={["Ja, ich war schon mal in Tamale.", "Nein, ich war noch nie in Tamale."]}
          answer="Nein, ich war noch nie in Tamale."
          explain="noch nie = never until now"
        />

        <TableScroll caption="Copy patterns (A1)">
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

      <ImageBreak src={IMG_MAP} alt="Map" title="3) liegen (city location)" subtitle="Where is the city located?" />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Location Statements with liegen</h2>

        <RuleCard title="liegen" rule="liegen = to be located (a city)." example="Berlin liegt im Osten von Deutschland." />

        <TapCheck
          title="Quick check (1)"
          prompt="Berlin liegt im ___ von Deutschland."
          options={["Osten", "Ost", "östlich"]}
          answer="Osten"
          explain="im Osten = in the east (location)"
        />
      </section>

      <ImageBreak src={IMG_MAP} alt="Directions" title="4) wo / woher / wohin" subtitle="3 question words." />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>wo, woher, wohin</h2>

        <RuleCard title="3 questions" rule="wo = location | woher = origin | wohin = direction" example="Wohin fährst du? – Ich fahre nach Berlin." />

        {/* only 2 checks here (big topic) */}
        <TapCheck
          title="Quick check (1)"
          prompt="___ kommst du? → Ich komme aus Ghana."
          options={["Wo", "Woher", "Wohin"]}
          answer="Woher"
          explain="woher = origin"
        />

        <TapCheck
          title="Quick check (2)"
          prompt="Wir fliegen ___ Schweiz."
          options={["nach", "in die", "in den"]}
          answer="in die"
          explain="Die Schweiz has an article → in die Schweiz"
        />

        <RuleCard
          title="nach vs in (A1)"
          rule="nach for no-article countries/cities. in + article for exceptions."
          example="nach Ghana / nach Berlin — but in die Schweiz, in die USA"
        />
      </section>

      <ImageBreak src={IMG_GRAMMAR} alt="Grammar" title="5) Irregular verbs (quick note)" subtitle="du + er/sie/es often change." />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Irregular Verbs with Vowel Change</h2>

        <RuleCard title="Easy rule" rule="Many vowel changes happen in du + er/sie/es." example="fahren: du fährst, er fährt" />

        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>nehmen: du <strong>nimmst</strong>, er <strong>nimmt</strong></li>
          <li>sprechen: du <strong>sprichst</strong>, er <strong>spricht</strong></li>
          <li>essen: du <strong>isst</strong>, er <strong>isst</strong></li>
          <li>fahren: du <strong>fährst</strong>, er <strong>fährt</strong></li>
          <li>laufen: du <strong>läufst</strong>, er <strong>läuft</strong></li>
        </ul>
      </section>

      <ImageBreak src={IMG_GRAMMAR} alt="People" title="6) man vs Mann" subtitle="One small word, big meaning." />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>man vs Mann</h2>

        <RuleCard title="Difference" rule="man = people in general | Mann = a man (noun)" example="Man kann hier gut essen. / Der Mann ist Lehrer." />

        <TapCheck
          title="Quick check (1)"
          prompt="___ kann hier gut essen."
          options={["man", "Mann"]}
          answer="man"
          explain="man = people in general"
        />
      </section>

      {/* Optional: ONE builder only (notes-friendly) */}
      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Optional: 3-click sentence builder</h2>
        <p style={{ margin: 0, opacity: 0.85 }}>
          Use once to practice. This is NOT an assignment.
        </p>
        <SentenceBuilder title="Build a sentence" subjects={BUILDER_SUBJECTS} verbs={BUILDER_VERBS} phrases={BUILDER_PHRASES} />
      </section>

      <ImageBreak src={IMG_TRAVEL} alt="Recap" title="1-minute recap (copyable)" subtitle="Students can screenshot or copy." />

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

        <button type="button" style={primaryTapButton} onClick={copyRecap}>
          Copy recap
        </button>
      </section>
    </main>
  );
};

export default memo(FormingBasicStatementsPage);
