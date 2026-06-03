import React, { memo, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const sectionStyle = { ...styles.card, display: "grid", gap: 12 };
const tableCellStyle = { border: "1px solid #d1d5db", padding: 8, textAlign: "left", verticalAlign: "top" };
const helperBoxStyle = {
  border: "1px solid #bfdbfe",
  background: "#eff6ff",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 8,
};

const Section = ({ title, children }) => (
  <section style={sectionStyle} aria-label={title}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const SimpleTable = ({ caption, columns, rows, minWidth = 520 }) => (
  <div style={{ width: "100%", overflowX: "auto" }}>
    <table style={{ borderCollapse: "collapse", width: "100%", minWidth }}>
      <caption style={{ textAlign: "left", padding: "8px 0", fontWeight: 700 }}>{caption}</caption>
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
        {rows.map((row) => (
          <tr key={row.key}>
            {row.cells.map((cell, index) =>
              index === 0 ? (
                <th key={index} scope="row" style={tableCellStyle}>
                  {cell}
                </th>
              ) : (
                <td key={index} style={tableCellStyle}>
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
        {title ? <div style={{ fontWeight: 800 }}>{title}</div> : null}
        {subtitle ? <div style={{ opacity: 0.85 }}>{subtitle}</div> : null}
      </div>
    )}
  </div>
);

const possessiveColumns = ["Person", "Before der/das words", "Before die/plural words", "English"];
const possessiveRows = [
  { key: "ich", cells: ["ich", "mein Tisch / mein Buch", "meine Tasche / meine Bücher", "my"] },
  { key: "du", cells: ["du", "dein Tisch / dein Buch", "deine Tasche / deine Bücher", "your"] },
  { key: "er_es", cells: ["er/es", "sein Tisch / sein Buch", "seine Tasche / seine Bücher", "his/its"] },
  { key: "sie_she", cells: ["sie (she)", "ihr Tisch / ihr Buch", "ihre Tasche / ihre Bücher", "her"] },
  { key: "wir", cells: ["wir", "unser Tisch / unser Buch", "unsere Tasche / unsere Bücher", "our"] },
  { key: "ihr_plural", cells: ["ihr (you all)", "euer Tisch / euer Buch", "eure Tasche / eure Bücher", "your (plural)"] },
  { key: "sie_they", cells: ["sie (they)", "ihr Tisch / ihr Buch", "ihre Tasche / ihre Bücher", "their"] },
  { key: "Sie_formal", cells: ["Sie (formal)", "Ihr Tisch / Ihr Buch", "Ihre Tasche / Ihre Bücher", "your (formal)"] },
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

const IMG_COLORS =
  "https://images.unsplash.com/photo-1684244110880-b7dda6c68618?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400";
const IMG_ROOM =
  "https://images.unsplash.com/photo-1652882861012-95f3263cab63?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400";
const IMG_GRAMMAR_NOTES =
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400";

function shuffleArray(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

const PracticeBlock = () => {
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");

  const Option = ({ name, value, checked, onChange }) => (
    <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} />
      {value}
    </label>
  );

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <p style={{ margin: 0 }}>Choose the correct possessive word.</p>

      <div style={{ display: "grid", gap: 6 }}>
        <strong>1) Das ist ___ Tisch.</strong>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["mein", "meine", "meinen"].map((option) => (
            <Option key={option} name="q1" value={option} checked={q1 === option} onChange={(event) => setQ1(event.target.value)} />
          ))}
        </div>
        {q1 ? (
          <p style={{ margin: 0 }}>
            {q1 === "mein" ? "✅ Correct" : "❌ Try again"} — <strong>der Tisch</strong> uses <strong>mein</strong> in
            this sentence.
          </p>
        ) : null}
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <strong>2) Ich suche ___ Tisch.</strong>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["mein", "meine", "meinen"].map((option) => (
            <Option key={option} name="q2" value={option} checked={q2 === option} onChange={(event) => setQ2(event.target.value)} />
          ))}
        </div>
        {q2 ? (
          <p style={{ margin: 0 }}>
            {q2 === "meinen" ? "✅ Correct" : "❌ Try again"} — <strong>Ich suche den/einen Tisch</strong> changes to{" "}
            <strong>meinen Tisch</strong>.
          </p>
        ) : null}
      </div>
    </div>
  );
};

const ColorsInteractive = () => {
  const [favColor, setFavColor] = useState("");
  const [showEnglish, setShowEnglish] = useState(false);
  const [quizItems, setQuizItems] = useState(() => shuffleArray(COLORS).slice(0, 5));
  const [answers, setAnswers] = useState({});

  const score = useMemo(
    () => quizItems.filter((item) => answers[item.de] && answers[item.de] === item.en).length,
    [answers, quizItems]
  );

  const options = useMemo(() => {
    const base = quizItems.map((item) => item.en);
    const extras = COLORS.map((item) => item.en).filter((item) => !base.includes(item));
    return shuffleArray([...base, ...extras].slice(0, 7));
  }, [quizItems]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <p style={{ margin: 0 }}>
        Key phrase: <strong>Meine Lieblingsfarbe ist ...</strong>
      </p>

      <label style={{ display: "grid", gap: 6 }}>
        <span style={{ fontWeight: 700 }}>1) Pick your favourite colour:</span>
        <select
          value={favColor}
          onChange={(event) => setFavColor(event.target.value)}
          style={{ padding: 10, border: "1px solid #d1d5db", borderRadius: 10 }}
        >
          <option value="">Select a colour...</option>
          {COLORS.map((color) => (
            <option key={color.de} value={color.de}>
              {color.de} {showEnglish ? `(${color.en})` : ""}
            </option>
          ))}
        </select>
      </label>

      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input type="checkbox" checked={showEnglish} onChange={(event) => setShowEnglish(event.target.checked)} />
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

      <div style={{ display: "grid", gap: 10 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontWeight: 800 }}>2) Mini quiz: German to English</span>
          <span style={{ opacity: 0.9 }}>
            Score: {score}/{quizItems.length}
          </span>
          <button
            type="button"
            onClick={() => {
              setAnswers({});
              setQuizItems(shuffleArray(COLORS).slice(0, 5));
            }}
            style={{ ...styles.secondaryButton, width: "fit-content" }}
          >
            Shuffle
          </button>
        </div>

        {quizItems.map((item) => {
          const selected = answers[item.de] || "";
          const correct = selected && selected === item.en;
          const wrong = selected && selected !== item.en;
          return (
            <div key={item.de} style={{ ...styles.card, display: "grid", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <strong>{item.de}</strong>
                <span>{correct ? "✅ Correct" : wrong ? "❌ Try again" : "—"}</span>
              </div>
              <select
                value={selected}
                onChange={(event) => setAnswers((previous) => ({ ...previous, [item.de]: event.target.value }))}
                style={{ padding: 10, border: "1px solid #d1d5db", borderRadius: 10 }}
                aria-label={`Select English meaning for ${item.de}`}
              >
                <option value="">Choose...</option>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {wrong ? (
                <div style={{ opacity: 0.9 }}>
                  Hint: correct answer is <strong>{item.en}</strong>.
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ObjectsInteractive = () => {
  const [category, setCategory] = useState("room");
  const [selectedItems, setSelectedItems] = useState([]);
  const [showEnglish, setShowEnglish] = useState(false);
  const vocab = category === "house" ? HOUSE_VOCAB : ROOM_VOCAB;

  const sentence = useMemo(() => {
    if (!selectedItems.length) return "In meinem Zimmer habe ich ...";
    return `In meinem Zimmer habe ich ${selectedItems.join(", ")}.`;
  }, [selectedItems]);

  const toggleItem = (word) => {
    setSelectedItems((previous) => (previous.includes(word) ? previous.filter((item) => item !== word) : [...previous, word]));
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 800 }}>Category</span>
          <select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setSelectedItems([]);
            }}
            style={{ padding: 10, border: "1px solid #d1d5db", borderRadius: 10 }}
          >
            <option value="room">Im Zimmer</option>
            <option value="house">Im Haus</option>
          </select>
        </label>

        <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 22 }}>
          <input type="checkbox" checked={showEnglish} onChange={(event) => setShowEnglish(event.target.checked)} />
          Show English
        </label>

        <button
          type="button"
          onClick={() => setSelectedItems([])}
          style={{ ...styles.secondaryButton, width: "fit-content", marginTop: 18 }}
        >
          Clear
        </button>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <strong>Pick words. Tap to add or remove.</strong>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
          {vocab.map((word) => {
            const active = selectedItems.includes(word.de);
            return (
              <button
                key={word.de}
                type="button"
                onClick={() => toggleItem(word.de)}
                style={{
                  ...styles.secondaryButton,
                  textAlign: "left",
                  justifyContent: "flex-start",
                  border: active ? "2px solid #111827" : "1px solid #d1d5db",
                  background: active ? "#f3f4f6" : undefined,
                  width: "100%",
                }}
                aria-pressed={active}
              >
                <div style={{ display: "grid", gap: 2 }}>
                  <span style={{ fontWeight: 900 }}>{word.de}</span>
                  {showEnglish ? <span style={{ opacity: 0.85 }}>{word.en}</span> : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ ...styles.card, display: "grid", gap: 6 }}>
        <strong>Sentence frame</strong>
        <div style={{ fontSize: 16 }}>
          <strong>{sentence}</strong>
        </div>
        <div style={{ opacity: 0.9 }}>
          Speaking prompt: <strong>Was hast du in deinem Zimmer?</strong>
        </div>
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <strong>Examples</strong>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>In meinem Zimmer habe ich ein Bett.</li>
          <li>In meinem Zimmer habe ich einen Tisch.</li>
        </ul>
      </div>
    </div>
  );
};

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

      <TopicImageBreak
        src={IMG_COLORS}
        alt="Colour palette photo used as a section break"
        title="Lesson Visual"
        subtitle="We use colours and objects to build simple A1 sentences."
      />

      <Section title="Instruction Note">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          In this lesson, you learn how to say <strong>my, your, his, her, our</strong> with objects and colours.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Do not worry about long grammar words. First look at the article: <strong>der</strong>, <strong>die</strong>, or{" "}
          <strong>das</strong>. Then choose the correct possessive word.
        </p>
      </Section>

      <Section title="Possessive Words: mein, meine, dein, deine">
        <SimpleTable
          caption="A1 reference table"
          columns={possessiveColumns}
          rows={possessiveRows}
          minWidth={760}
        />
        <div style={helperBoxStyle}>
          <strong>Simple rule</strong>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            If the object uses <strong>der</strong> or <strong>das</strong>, start with <strong>mein/dein/sein/ihr</strong>. If the
            object uses <strong>die</strong> or plural, add <strong>-e</strong>: <strong>meine/deine/seine/ihre</strong>.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            For <strong>euer/eure</strong>, the second <strong>e</strong> often disappears: <strong>euer Vater</strong>,{" "}
            <strong>eure Mutter</strong>, <strong>euren Tisch</strong>.
          </p>
        </div>
      </Section>

      <Section title="Quick Guide: ihr / Ihr">
        <div style={helperBoxStyle}>
          <strong>Look at the small letter or capital letter.</strong>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>ihr</strong> with a small <strong>i</strong> can mean <strong>her</strong>, <strong>their</strong>, or{" "}
            <strong>you all</strong>. <strong>Ihr</strong> with capital <strong>I</strong> means formal <strong>your</strong>.
          </p>
        </div>

        <SimpleTable
          caption="Use simple examples to see the difference"
          columns={["Form", "Meaning", "A1 example"]}
          rows={[
            {
              key: "her",
              cells: [
                <strong>ihr + noun</strong>,
                "her / their",
                <>
                  Das ist <strong>ihr</strong> Bruder. = This is her/their brother.
                  <br />
                  Here <strong>ihr</strong> is small because it is not the first word.
                </>,
              ],
            },
            {
              key: "formal",
              cells: [
                <strong>Ihr + noun</strong>,
                "your formal",
                <>
                  Das ist <strong>Ihr</strong> Buch. = This is your book, Sir/Madam.
                  <br />
                  <strong>Ihr</strong> stays capital because it is formal.
                </>,
              ],
            },
            {
              key: "you-all",
              cells: [
                <strong>ihr + verb</strong>,
                "you all",
                <>
                  Wo wohnt <strong>ihr</strong>? = Where do you all live?
                  <br />
                  Heute lernt <strong>ihr</strong> Deutsch. = Today you all learn German.
                </>,
              ],
            },
          ]}
          minWidth={760}
        />
      </Section>

      <Section title="Article Reference: Nominative and Accusative">
        <h3 style={{ margin: 0 }}>Nominative: when you say “This is ...”</h3>
        <SimpleTable caption="Articles in nominative" columns={articleColumns} rows={nominativeRows} />
        <h3 style={{ margin: 0 }}>Accusative: after verbs like ich suche / ich nehme / ich sehe</h3>
        <SimpleTable caption="Articles in accusative" columns={articleColumns} rows={accusativeRows} />
      </Section>

      <TopicImageBreak
        src={IMG_GRAMMAR_NOTES}
        alt="Notebook and pen used as a visual break before grammar notes"
        title="Grammar Focus"
        subtitle="Use ein/eine/einen only as a pattern to choose the possessive ending."
      />

      <Section title="Indefinite Articles and Possessive Words">
        <div style={helperBoxStyle}>
          <strong>Important A1 rule</strong>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Do not put <strong>ein</strong> and <strong>mein</strong> together. You say <strong>ein Tisch</strong> or{" "}
            <strong>mein Tisch</strong>, not “ein mein Tisch”.
          </p>
        </div>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Use <strong>ein / eine / einen</strong> as a small pattern. The pattern helps you choose the ending:
        </p>
        <SimpleTable
          caption="Easy pattern"
          columns={["Article pattern", "Possessive example", "Meaning"]}
          rows={[
            { key: "masc-nom", cells: ["ein Tisch", <strong>mein Tisch</strong>, "my table"] },
            { key: "fem", cells: ["eine Tasche", <strong>meine Tasche</strong>, "my bag"] },
            { key: "neuter", cells: ["ein Buch", <strong>mein Buch</strong>, "my book"] },
            { key: "masc-acc", cells: ["Ich suche einen Tisch", <strong>Ich suche meinen Tisch</strong>, "I am looking for my table"] },
            { key: "fem-acc", cells: ["Ich nehme eine Tasche", <strong>Ich nehme meine Tasche</strong>, "I take my bag"] },
          ]}
          minWidth={760}
        />
      </Section>

      <Section title="Simple Adjective Note: zu, sehr, super">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          These words come before an adjective. They change the strength of the adjective.
        </p>
        <SimpleTable
          caption="A1 difference"
          columns={["Word", "Meaning", "When to use it", "Example"]}
          rows={[
            {
              key: "zu",
              cells: [<strong>zu</strong>, "too", "It is more than good or more than needed.", <><strong>Das Auto ist zu teuer.</strong> = The car is too expensive.</>],
            },
            {
              key: "sehr",
              cells: [<strong>sehr</strong>, "very", "Normal and polite. Use it in class and exams.", <><strong>Das Buch ist sehr interessant.</strong> = The book is very interesting.</>],
            },
            {
              key: "super",
              cells: [<strong>super</strong>, "super / very", "Friendly and informal. Use it when you are happy or excited.", <><strong>Das Essen ist super lecker.</strong> = The food is super delicious.</>],
            },
          ]}
          minWidth={820}
        />

        <div style={helperBoxStyle}>
          <strong>Same adjective, different feeling</strong>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
            <li>
              Das Haus ist <strong>zu groß</strong>. = It is too big. Maybe not good.
            </li>
            <li>
              Das Haus ist <strong>sehr groß</strong>. = It is very big. Neutral.
            </li>
            <li>
              Das Haus ist <strong>super groß</strong>. = It is super big. Informal and excited.
            </li>
          </ul>
        </div>
      </Section>

      <Section title="Practice: Choose the Correct Form">
        <PracticeBlock />
      </Section>

      <TopicImageBreak
        src={IMG_COLORS}
        alt="Colour palette photo used as a break before the colours lesson"
        title="New Topic: Farben"
        subtitle="Now go practical: speaking and quick quiz."
      />

      <Section title="Practical German Colors (Farben)">
        <ColorsInteractive />
      </Section>

      <TopicImageBreak
        src={IMG_ROOM}
        alt="Desk and room interior photo used as a break before room vocabulary"
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
