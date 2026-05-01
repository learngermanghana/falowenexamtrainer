import React, { memo, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

/** =========================
 *  Reusable UI bits
 *  ========================= */
const sectionStyle = { ...styles.card, display: "grid", gap: 10 };
const tableCellStyle = { border: "1px solid #d1d5db", padding: 8, textAlign: "left" };

const Section = ({ title, children }) => (
  <section style={sectionStyle} aria-label={title}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const SimpleTable = ({ caption, columns, rows, minWidth = 520 }) => (
  <div style={{ width: "100%", overflowX: "auto" }}>
    <table style={{ borderCollapse: "collapse", width: "100%", minWidth }}>
      <caption style={{ textAlign: "left", padding: "8px 0", fontWeight: 600 }}>{caption}</caption>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col} scope="col" style={tableCellStyle}>
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, idx) => (
          <tr key={r.key ?? idx}>
            {r.cells.map((cell, cIdx) =>
              cIdx === 0 ? (
                <th key={cIdx} scope="row" style={tableCellStyle}>
                  {cell}
                </th>
              ) : (
                <td key={cIdx} style={tableCellStyle}>
                  {cell}
                </td>
              )
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/** =========================
 *  Topic image break (graphic separator)
 *  ========================= */
const TopicImageBreak = ({ src, alt, title, subtitle }) => (
  <div style={{ ...styles.card, padding: 0, overflow: "hidden" }} aria-label={title || "Topic image"}>
    <img
      src={src}
      alt={alt}
      style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
      loading="lazy"
    />
    {(title || subtitle) && (
      <div style={{ padding: 12, display: "grid", gap: 4 }}>
        {title && <div style={{ fontWeight: 800 }}>{title}</div>}
        {subtitle && <div style={{ opacity: 0.85 }}>{subtitle}</div>}
      </div>
    )}
  </div>
);

/** =========================
 *  Data moved outside component
 *  ========================= */
const possessiveColumns = ["Pronoun", "Masculine/Neuter", "Feminine/Plural", "English"];
const possessiveRows = [
  { key: "ich", cells: ["ich", "mein", "meine", "my"] },
  { key: "du", cells: ["du", "dein", "deine", "your"] },
  { key: "er_es", cells: ["er/es", "sein", "seine", "his/its"] },
  { key: "sie_she", cells: ["sie (she)", "ihr", "ihre", "her"] },
  { key: "wir", cells: ["wir", "unser", "unsere", "our"] },
  { key: "ihr_plural", cells: ["ihr (plural)", "euer", "eure", "your (plural)"] },
  { key: "sie_they", cells: ["sie (they)", "ihr", "ihre", "their"] },
  { key: "Sie_formal", cells: ["Sie (formal)", "Ihr", "Ihre", "your (formal)"] },
];

const articleColumns = ["Gender/Number", "Definite", "Indefinite"];
const nominativeRows = [
  { key: "nom_m", cells: ["Masculine", "der", "ein"] },
  { key: "nom_f", cells: ["Feminine", "die", "eine"] },
  { key: "nom_n", cells: ["Neuter", "das", "ein"] },
  { key: "nom_pl", cells: ["Plural", "die", "-"] },
];
const accusativeRows = [
  { key: "acc_m", cells: ["Masculine", "den", "einen"] },
  { key: "acc_f", cells: ["Feminine", "die", "eine"] },
  { key: "acc_n", cells: ["Neuter", "das", "ein"] },
  { key: "acc_pl", cells: ["Plural", "die", "-"] },
];

/** =========================
 *  Interactive practice (student involvement)
 *  ========================= */
const PracticeBlock = () => {
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");

  const q1Correct = q1 === "mein";
  const q2Correct = q2 === "meinen";

  const Option = ({ name, value, checked, onChange }) => (
    <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} />
      {value}
    </label>
  );

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <p style={{ margin: 0 }}>Quick practice: choose the correct option.</p>

      <div style={{ display: "grid", gap: 6 }}>
        <strong>1) Das ist ___ Tisch.</strong>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["mein", "meine", "meinen"].map((opt) => (
            <Option
              key={opt}
              name="q1"
              value={opt}
              checked={q1 === opt}
              onChange={(e) => setQ1(e.target.value)}
            />
          ))}
        </div>
        {q1 && (
          <p style={{ margin: 0 }}>
            Result: {q1Correct ? "✅ Correct" : "❌ Not quite"} — Nominative masculine uses <strong>mein</strong>.
          </p>
        )}
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <strong>2) Ich suche ___ Tisch.</strong>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["mein", "meine", "meinen"].map((opt) => (
            <Option
              key={opt}
              name="q2"
              value={opt}
              checked={q2 === opt}
              onChange={(e) => setQ2(e.target.value)}
            />
          ))}
        </div>
        {q2 && (
          <p style={{ margin: 0 }}>
            Result: {q2Correct ? "✅ Correct" : "❌ Not quite"} — Accusative masculine uses{" "}
            <strong>meinen</strong>.
          </p>
        )}
      </div>
    </div>
  );
};

/** =========================
 *  Interactive Colors + Objects
 *  ========================= */
const COLORS = [
  { de: "rot", en: "red" },
  { de: "blau", en: "blue" },
  { de: "gelb", en: "yellow" },
  { de: "grün", en: "green" },
  { de: "schwarz", en: "black" },
  { de: "weiß", en: "white" },
  { de: "grau", en: "gray" },
  { de: "braun", en: "brown" },
  { de: "orange", en: "orange" },
  { de: "lila", en: "purple" },
  { de: "rosa", en: "pink" },
];

const HOUSE_VOCAB = [
  { de: "das Haus", en: "house" },
  { de: "die Wohnung", en: "apartment" },
  { de: "das Zimmer", en: "room" },
  { de: "die Küche", en: "kitchen" },
  { de: "das Wohnzimmer", en: "living room" },
  { de: "das Schlafzimmer", en: "bedroom" },
  { de: "das Badezimmer", en: "bathroom" },
  { de: "der Flur", en: "hallway" },
  { de: "der Keller", en: "basement" },
  { de: "der Garten", en: "garden" },
];

const ROOM_VOCAB = [
  { de: "das Bett", en: "bed" },
  { de: "der Tisch", en: "table" },
  { de: "der Stuhl", en: "chair" },
  { de: "die Lampe", en: "lamp" },
  { de: "der Schrank", en: "wardrobe/cabinet" },
  { de: "die Tür", en: "door" },
  { de: "das Fenster", en: "window" },
  { de: "der Teppich", en: "carpet" },
  { de: "das Sofa", en: "sofa" },
  { de: "der Fernseher", en: "TV" },
  { de: "das Bild", en: "picture" },
  { de: "die Uhr", en: "clock/watch" },
  { de: "das Regal", en: "shelf" },
  { de: "die Kommode", en: "dresser" },
  { de: "der Spiegel", en: "mirror" },
];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ColorsInteractive = () => {
  const [favColor, setFavColor] = useState("");
  const [showEN, setShowEN] = useState(false);

  const [quizItems, setQuizItems] = useState(() => shuffleArray(COLORS).slice(0, 5));
  const [answers, setAnswers] = useState({}); // { de: selectedEn }

  const score = useMemo(() => {
    let s = 0;
    for (const item of quizItems) {
      if (answers[item.de] && answers[item.de] === item.en) s++;
    }
    return s;
  }, [answers, quizItems]);

  const options = useMemo(() => {
    const base = quizItems.map((x) => x.en);
    const extras = COLORS.map((x) => x.en).filter((x) => !base.includes(x));
    return shuffleArray([...base, ...extras].slice(0, 7));
  }, [quizItems]);

  const resetQuiz = () => {
    setAnswers({});
    setQuizItems(shuffleArray(COLORS).slice(0, 5));
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gap: 8 }}>
        <p style={{ margin: 0 }}>
          Key phrase: <strong>Meine Lieblingsfarbe ist ...</strong>
        </p>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 700 }}>1) Pick your favorite color:</span>
          <select
            value={favColor}
            onChange={(e) => setFavColor(e.target.value)}
            style={{ padding: 10, border: "1px solid #d1d5db", borderRadius: 10 }}
          >
            <option value="">Select a color…</option>
            {COLORS.map((c) => (
              <option key={c.de} value={c.de}>
                {c.de} {showEN ? `(${c.en})` : ""}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="checkbox" checked={showEN} onChange={(e) => setShowEN(e.target.checked)} />
          Show English meaning
        </label>

        <div style={{ ...styles.card, display: "grid", gap: 6 }}>
          <div style={{ fontWeight: 800 }}>Your sentence</div>
          <div style={{ fontSize: 16 }}>
            Meine Lieblingsfarbe ist <strong>{favColor || "..."}</strong>.
          </div>
          <div style={{ opacity: 0.85 }}>
            Ask a partner: <strong>Was ist deine Lieblingsfarbe?</strong>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontWeight: 800 }}>2) Mini quiz: Match German → English</span>
          <span style={{ opacity: 0.9 }}>
            Score: {score}/{quizItems.length}
          </span>
          <button
            type="button"
            onClick={resetQuiz}
            style={{ ...styles.secondaryButton, width: "fit-content" }}
            aria-label="Shuffle color quiz"
          >
            Shuffle
          </button>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          {quizItems.map((item) => {
            const selected = answers[item.de] || "";
            const correct = selected && selected === item.en;
            const wrong = selected && selected !== item.en;

            return (
              <div key={item.de} style={{ ...styles.card, display: "grid", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                  <div style={{ fontWeight: 900 }}>{item.de}</div>
                  <div style={{ opacity: 0.9 }}>{correct ? "✅ Correct" : wrong ? "❌ Try again" : "—"}</div>
                </div>

                <select
                  value={selected}
                  onChange={(e) => setAnswers((a) => ({ ...a, [item.de]: e.target.value }))}
                  style={{ padding: 10, border: "1px solid #d1d5db", borderRadius: 10 }}
                  aria-label={`Select English meaning for ${item.de}`}
                >
                  <option value="">Choose…</option>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>

                {wrong && (
                  <div style={{ opacity: 0.9 }}>
                    Hint: correct answer is <strong>{item.en}</strong>.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ObjectsInteractive = () => {
  const [category, setCategory] = useState("room"); // room | house
  const vocab = category === "house" ? HOUSE_VOCAB : ROOM_VOCAB;

  const [selectedItems, setSelectedItems] = useState([]);
  const [showEnglish, setShowEnglish] = useState(false);

  const toggleItem = (de) => {
    setSelectedItems((prev) => (prev.includes(de) ? prev.filter((x) => x !== de) : [...prev, de]));
  };

  const sentence = useMemo(() => {
    if (selectedItems.length === 0) return "In meinem Zimmer habe ich ...";
    return `In meinem Zimmer habe ich ${selectedItems.join(", ")}.`;
  }, [selectedItems]);

  const clear = () => setSelectedItems([]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 800 }}>Category</span>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSelectedItems([]);
            }}
            style={{ padding: 10, border: "1px solid #d1d5db", borderRadius: 10 }}
          >
            <option value="room">Im Zimmer</option>
            <option value="house">Im Haus</option>
          </select>
        </label>

        <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 22 }}>
          <input type="checkbox" checked={showEnglish} onChange={(e) => setShowEnglish(e.target.checked)} />
          Show English
        </label>

        <button
          type="button"
          onClick={clear}
          style={{ ...styles.secondaryButton, width: "fit-content", marginTop: 18 }}
          aria-label="Clear selected words"
        >
          Clear
        </button>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ fontWeight: 800 }}>Pick words (tap to add/remove):</div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
          {vocab.map((w) => {
            const active = selectedItems.includes(w.de);
            return (
              <button
                key={w.de}
                type="button"
                onClick={() => toggleItem(w.de)}
                style={{
                  ...styles.secondaryButton,
                  textAlign: "left",
                  justifyContent: "flex-start",
                  border: active ? "2px solid #111827" : "1px solid #d1d5db",
                  background: active ? "#f3f4f6" : undefined,
                  width: "100%",
                }}
                aria-pressed={active}
                aria-label={`Toggle ${w.de}`}
              >
                <div style={{ display: "grid", gap: 2 }}>
                  <span style={{ fontWeight: 900 }}>{w.de}</span>
                  {showEnglish && <span style={{ opacity: 0.85 }}>{w.en}</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ ...styles.card, display: "grid", gap: 6 }}>
        <div style={{ fontWeight: 900 }}>Sentence frame</div>
        <div style={{ fontSize: 16 }}>
          <strong>{sentence}</strong>
        </div>
        <div style={{ opacity: 0.9 }}>
          Speaking prompt: <strong>Was hast du in deinem Zimmer?</strong>
        </div>
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <div style={{ fontWeight: 800 }}>Examples</div>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>In meinem Zimmer habe ich ein Bett.</li>
          <li>In meinem Zimmer habe ich einen Tisch.</li>
        </ul>
      </div>
    </div>
  );
};

/** =========================
 *  Image URLs (free-to-use under Unsplash license)
 *  ========================= */
const IMG_COLORS =
  "https://images.unsplash.com/photo-1684244110880-b7dda6c68618?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400";

const IMG_ROOM =
  "https://images.unsplash.com/photo-1652882861012-95f3263cab63?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400";

const IMG_GRAMMAR_NOTES =
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400";

/** =========================
 *  Page
 *  ========================= */
const ObjectsAndColorsPage = () => {
  const navigate = useNavigate();
  const pageSubtitle = useMemo(() => "Chapter 6 • Possessive Determiners with Nouns", []);

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }} aria-label="Objects and Colors Chapter">
      <header style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button
          style={{ ...styles.secondaryButton, width: "fit-content" }}
          onClick={() => navigate("/campus/course")}
          aria-label="Back to course overview"
        >
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Objects and Colors</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>{pageSubtitle}</p>
      </header>

      {/* Main image for the notes (graphic break) */}
      <TopicImageBreak
        src={IMG_COLORS}
        alt="Color palette photo used as a section break"
        title="Lesson Visual"
        subtitle="We’ll use images as breaks when new main topics start."
      />

      <Section title="Instruction Note">
        <p style={{ margin: 0 }}>
          Understanding possessive and indefinite articles in German is essential for indicating ownership and making
          general statements.
        </p>
        <p style={{ margin: 0 }}>
          Before reading this chapter, students should already be able to differentiate between definite articles (
          <strong>der, die, das</strong>) and indefinite articles (<strong>ein, eine, einen</strong>) in nominative and
          accusative cases.
        </p>
      </Section>

      <Section title="Possessive Determiners (Nominative Reference)">
        <SimpleTable
          caption="Possessive determiners in nominative (reference table)"
          columns={possessiveColumns}
          rows={possessiveRows}
        />
        <p style={{ margin: 0 }}>
          Quick note on <strong>euer/eure</strong>: the second <strong>e</strong> often drops.
          <br />
          Examples: <strong>euer Vater</strong>, <strong>eure Mutter</strong>, <strong>euren Tisch</strong>.
        </p>
      </Section>

      <Section title="Quick Guide: ihr / Ihr">
        <p style={{ margin: 0 }}>
          <strong>Rule of thumb:</strong> if <strong>ihr/Ihr</strong> comes before a <strong>noun</strong>, it is a
          possessive word (her/their/your formal). If <strong>ihr</strong> comes with a <strong>verb</strong>, it is
          usually the pronoun <strong>"you all"</strong>.
        </p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            <strong>Ihr/Ihre + noun</strong> (capitalized) = <strong>your</strong> (formal possession).
            <br />
            Das ist Ihr Buch.
          </li>
          <li>
            <strong>ihr/ihre + noun</strong> (lowercase) = <strong>her</strong> or <strong>their</strong> possession.
            <br />
            Ihr Bruder heißt Tom. / Ihre Bücher sind neu.
          </li>
          <li>
            <strong>ihr + verb</strong> (lowercase pronoun) = <strong>you all</strong> (plural informal).
            <br />
            Wo wohnt ihr?
          </li>
        </ul>
      </Section>

      <Section title="Article Reference (Nominative & Accusative)">
        <h3 style={{ margin: 0 }}>Nominative</h3>
        <SimpleTable caption="Articles in nominative" columns={articleColumns} rows={nominativeRows} />
        <h3 style={{ margin: 0 }}>Accusative</h3>
        <SimpleTable caption="Articles in accusative" columns={articleColumns} rows={accusativeRows} />
      </Section>

      <TopicImageBreak
        src={IMG_GRAMMAR_NOTES}
        alt="Notebook and pen used as a visual break before grammar notes"
        title="Grammar Focus"
        subtitle="Indefinite articles and possessive determiners in action."
      />

      <Section title="Indefinite Articles and Possessive Determiners">
        <p style={{ margin: 0 }}>
          Possessive determiners follow the same ending pattern as <strong>ein / eine / einen</strong>.
        </p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            Base form: <strong>ein</strong> (masculine/neuter nominative).
          </li>
          <li>
            Add <strong>-e</strong> for feminine nominative/accusative: <strong>eine</strong>.
          </li>
          <li>
            Add <strong>-en</strong> for masculine accusative: <strong>einen</strong>.
          </li>
        </ul>
        <p style={{ margin: 0 }}>
          You do not use an indefinite article together with a possessive determiner. The indefinite article pattern
          only helps you choose the correct ending.
        </p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Das ist ein Tisch → Das ist mein/dein/sein/ihr/unser/euer/Ihr Tisch.</li>
          <li>Das ist eine Tasche → Das ist meine/deine/seine/ihre/unsere/eure/Ihre Tasche.</li>
          <li>Ich suche einen Tisch → Ich suche meinen/deinen/seinen/ihren/unseren/euren/Ihren Tisch.</li>
          <li>Ich nehme eine Tasche → Ich nehme meine/deine/seine/ihre/unsere/eure/Ihre Tasche.</li>
        </ul>
      </Section>

      <Section title={'Note on Using Adjectives with "zu," "super," and "sehr"'}>
        <p style={{ margin: 0 }}>
          Adjectives are essential in any language to describe nouns and add detail to your sentences. In German,
          adjectives can be modified by words like <strong>zu</strong>, <strong>super</strong>, and <strong>sehr</strong>
          to change their intensity or degree.
        </p>

        <p style={{ margin: 0 }}>
          <strong>Adjectives with "zu"</strong>
          <br />
          "Zu" means "too" in English and is used to indicate that something is excessive or beyond what is desired.
          <br />
          Structure: <strong>zu + adjective</strong>
        </p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Das Auto ist <strong>zu teuer</strong>. (The car is too expensive.)</li>
          <li>Der Film ist <strong>zu lang</strong>. (The movie is too long.)</li>
        </ul>

        <p style={{ margin: 0 }}>
          <strong>Adjectives with "super"</strong>
          <br />
          "Super" means "super" or "very" and is used to indicate a very high degree (often positive and informal).
          <br />
          Structure: <strong>super + adjective</strong>
        </p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Das Essen ist <strong>super lecker</strong>. (The food is super delicious.)</li>
          <li>Der Lehrer ist <strong>super nett</strong>. (The teacher is super nice.)</li>
        </ul>

        <p style={{ margin: 0 }}>
          <strong>Adjectives with "sehr"</strong>
          <br />
          "Sehr" means "very" and intensifies the adjective in a neutral or positive way.
          <br />
          Structure: <strong>sehr + adjective</strong>
        </p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Das Buch ist <strong>sehr interessant</strong>. (The book is very interesting.)</li>
          <li>Sie ist <strong>sehr freundlich</strong>. (She is very friendly.)</li>
        </ul>

        <p style={{ margin: 0 }}>
          <strong>Comparison of "zu," "super," and "sehr"</strong>
        </p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            <strong>zu</strong>: excessive degree (often negative).
            <br />
            Example: Das Wetter ist <strong>zu kalt</strong>. (The weather is too cold.)
          </li>
          <li>
            <strong>super</strong>: very high degree (positive/informal).
            <br />
            Example: Das Konzert war <strong>super toll</strong>. (The concert was super great.)
          </li>
          <li>
            <strong>sehr</strong>: high degree (neutral or positive).
            <br />
            Example: Er ist <strong>sehr klug</strong>. (He is very smart.)
          </li>
        </ul>

        <p style={{ margin: 0 }}>
          <strong>Usage Tips</strong>
        </p>
        <ol style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            Choose the right modifier: use <strong>zu</strong> for "more than needed," <strong>super</strong> for
            enthusiastic informal emphasis, and <strong>sehr</strong> for standard intensification.
          </li>
          <li>
            Practice with the same adjective to feel the nuance:
            <ul style={{ marginTop: 6, paddingLeft: 20 }}>
              <li>Das Haus ist <strong>zu groß</strong>. (The house is too big.)</li>
              <li>Das Haus ist <strong>super groß</strong>. (The house is super big.)</li>
              <li>Das Haus ist <strong>sehr groß</strong>. (The house is very big.)</li>
            </ul>
          </li>
          <li>
            Remember adjective placement in German:
            <br />
            <strong>Ein sehr schönes Haus.</strong> (A very beautiful house.)
          </li>
        </ol>

        <p style={{ margin: 0 }}>
          <strong>Summary</strong>
        </p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            <strong>Zu</strong> means "too" and indicates an excessive degree.
            <br />
            Example: Die Aufgabe ist <strong>zu schwer</strong>. (The task is too difficult.)
          </li>
          <li>
            <strong>Super</strong> means "super/very" and indicates a very high degree.
            <br />
            Example: Das Spiel war <strong>super spannend</strong>. (The game was super exciting.)
          </li>
          <li>
            <strong>Sehr</strong> means "very" and indicates a high degree.
            <br />
            Example: Er ist <strong>sehr müde</strong>. (He is very tired.)
          </li>
        </ul>
        <p style={{ margin: 0 }}>
          By using <strong>zu</strong>, <strong>super</strong>, and <strong>sehr</strong> correctly, you can add more
          detail and precision to descriptions in German.
        </p>
      </Section>

      <Section title="Practice: Choose the Correct Form">
        <PracticeBlock />
      </Section>

      {/* New topic break image */}
      <TopicImageBreak
        src={IMG_COLORS}
        alt="Color palette photo used as a break before the colors lesson"
        title="New Topic: Farben"
        subtitle="Now we go practical: speaking + quick quiz."
      />

      <Section title="Practical German Colors (Farben)">
        <ColorsInteractive />
      </Section>

      {/* New topic break image */}
      <TopicImageBreak
        src={IMG_ROOM}
        alt="Desk and room interior photo used as a break before the room vocabulary lesson"
        title="New Topic: Gegenstände"
        subtitle="Build your own sentences using room vocabulary."
      />

      <Section title="German Vocabulary: Objects in the House and Room">
        <ObjectsInteractive />
      </Section>
    </main>
  );
};

export default memo(ObjectsAndColorsPage);
