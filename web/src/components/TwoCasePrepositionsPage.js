import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

/** =========================
 *  Helpers
 *  ========================= */
const normalizeAnswer = (value) => String(value || "").trim().toLowerCase();

const getChoiceButtonStyle = ({ selected, checked, isCorrectChoice, isWrongChoice }) => {
  if (checked && isCorrectChoice) {
    return {
      ...styles.secondaryButton,
      width: "fit-content",
      borderColor: "#15803d",
      background: "#dcfce7",
      color: "#166534",
      fontWeight: 700,
    };
  }

  if (checked && isWrongChoice) {
    return {
      ...styles.secondaryButton,
      width: "fit-content",
      borderColor: "#dc2626",
      background: "#fee2e2",
      color: "#991b1b",
      fontWeight: 700,
    };
  }

  return {
    ...styles.secondaryButton,
    width: "fit-content",
    borderColor: selected ? "#111827" : undefined,
    background: selected ? "#f3f4f6" : undefined,
    fontWeight: selected ? 700 : 500,
  };
};

const getSelectStyle = ({ checked, isCorrect, isWrong }) => {
  if (checked && isCorrect) {
    return {
      padding: "8px 10px",
      borderRadius: 10,
      border: "1px solid #15803d",
      background: "#dcfce7",
      color: "#166534",
      fontWeight: 700,
    };
  }

  if (checked && isWrong) {
    return {
      padding: "8px 10px",
      borderRadius: 10,
      border: "1px solid #dc2626",
      background: "#fee2e2",
      color: "#991b1b",
      fontWeight: 700,
    };
  }

  return {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    background: "#fff",
  };
};

/** =========================
 *  Reusable UI bits
 *  ========================= */
const Section = ({ title, children }) => (
  <section style={{ ...styles.card, display: "grid", gap: 12 }} aria-label={title}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const BulletList = ({ items }) => (
  <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
    {items.map((item, index) => (
      <li key={`${item}-${index}`}>{item}</li>
    ))}
  </ul>
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
        {title && <div style={{ fontWeight: 900 }}>{title}</div>}
        {subtitle && <div style={{ opacity: 0.85 }}>{subtitle}</div>}
      </div>
    )}
  </div>
);

/** =========================
 *  Visual scene card
 *  ========================= */
const SceneCard = ({ label, emojiLine1, emojiLine2, helper }) => (
  <div
    style={{
      border: "1px solid #dbe4f0",
      borderRadius: 14,
      background: "#f8fafc",
      padding: 14,
      display: "grid",
      gap: 8,
    }}
  >
    <div style={{ fontWeight: 800, fontSize: 14, opacity: 0.8 }}>{label}</div>
    <div
      style={{
        minHeight: 86,
        borderRadius: 12,
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        display: "grid",
        alignItems: "center",
        justifyItems: "center",
        padding: 12,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 32, lineHeight: 1.25 }}>{emojiLine1}</div>
      {emojiLine2 ? <div style={{ fontSize: 32, lineHeight: 1.25 }}>{emojiLine2}</div> : null}
    </div>
    {helper ? <div style={{ fontSize: 13, opacity: 0.75 }}>{helper}</div> : null}
  </div>
);

/** =========================
 *  Free-to-use images
 *  ========================= */
const IMG_NOTEBOOK =
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400";
const IMG_DIRECTIONS =
  "https://images.unsplash.com/photo-1503435980610-a51f3ddfee50?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400";
const IMG_SIGNPOST =
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400";

const PREPOSITION_OPTIONS = ["an", "auf", "hinter", "in", "neben", "über", "unter", "vor", "zwischen"];

const PREPOSITIONS = [
  "an = on / at (attached contact, side, edge)",
  "auf = on top of",
  "hinter = behind",
  "in = in / into",
  "neben = next to / beside",
  "über = above / over",
  "unter = under / below",
  "vor = in front of / before",
  "zwischen = between",
];

const examplePairs = [
  ["in", "Ich gehe in die Schule.", "Ich bin in der Schule."],
  ["auf", "Er legt das Buch auf den Tisch.", "Das Buch liegt auf dem Tisch."],
  ["an", "Sie hängt das Bild an die Wand.", "Das Bild hängt an der Wand."],
  ["unter", "Der Hund läuft unter den Tisch.", "Der Hund liegt unter dem Tisch."],
  ["zwischen", "Ich stelle den Stuhl zwischen die Tische.", "Der Stuhl steht zwischen den Tischen."],
];

const boldPrepositionInSentence = (sentence, preposition) => {
  const marker = ` ${preposition} `;
  const startIndex = sentence.indexOf(marker);

  if (startIndex === -1) return sentence;

  const prepositionStart = startIndex + 1;
  const prepositionEnd = prepositionStart + preposition.length;

  return (
    <>
      {sentence.slice(0, prepositionStart)}
      <strong>{sentence.slice(prepositionStart, prepositionEnd)}</strong>
      {sentence.slice(prepositionEnd)}
    </>
  );
};

const visualGame = [
  {
    label: "Cat + table",
    emojiLine1: "🐱",
    emojiLine2: "🟫 Tisch",
    helper: "The cat is on the table.",
    sentence: "Die Katze ist ______ dem Tisch.",
    answer: "auf",
  },
  {
    label: "Table + cat",
    emojiLine1: "🟫 Tisch",
    emojiLine2: "🐱",
    helper: "The cat is under the table.",
    sentence: "Die Katze ist ______ dem Tisch.",
    answer: "unter",
  },
  {
    label: "Bank – school – library",
    emojiLine1: "🏦   🏫   📚",
    emojiLine2: "",
    helper: "The school is between the bank and the library.",
    sentence: "Die Schule ist ______ der Bank und der Bibliothek.",
    answer: "zwischen",
  },
  {
    label: "Bag + table",
    emojiLine1: "🎒",
    emojiLine2: "🟫 Tisch",
    helper: "The bag goes onto the table.",
    sentence: "Ich lege die Tasche ______ den Tisch.",
    answer: "auf",
  },
  {
    label: "Boy + tree",
    emojiLine1: "👦   🌳",
    emojiLine2: "",
    helper: "The boy stands in front of the tree.",
    sentence: "Der Junge steht ______ dem Baum.",
    answer: "vor",
  },
  {
    label: "Car + house",
    emojiLine1: "🚗",
    emojiLine2: "🏠",
    helper: "The car is in front of the house.",
    sentence: "Das Auto steht ______ dem Haus.",
    answer: "vor",
  },
  {
    label: "Lamp + door",
    emojiLine1: "💡➡️🚪",
    emojiLine2: "",
    helper: "The lamp is attached to the door.",
    sentence: "Die Lampe hängt ______ der Tür.",
    answer: "an",
  },
  {
    label: "Dog + sofa",
    emojiLine1: "🐶",
    emojiLine2: "🛋",
    helper: "The dog is on the sofa.",
    sentence: "Der Hund sitzt ______ dem Sofa.",
    answer: "auf",
  },
  {
    label: "Box + table",
    emojiLine1: "📦",
    emojiLine2: "🟫 Tisch",
    helper: "The box is on the table.",
    sentence: "Die Kiste ist ______ dem Tisch.",
    answer: "auf",
  },
];

const practiceQuiz = [
  { sentence: "Ich gehe in ___ Park.", choices: ["dem", "den", "der"], answer: "den" },
  { sentence: "Ich bin in ___ Park.", choices: ["den", "dem", "der"], answer: "dem" },
  { sentence: "Er stellt den Laptop auf ___ Tisch.", choices: ["den", "dem", "des"], answer: "den" },
  { sentence: "Der Laptop steht auf ___ Tisch.", choices: ["dem", "den", "der"], answer: "dem" },
  { sentence: "Wir setzen uns neben ___ Lehrer.", choices: ["dem", "den", "der"], answer: "den" },
  { sentence: "Wir sitzen neben ___ Lehrer.", choices: ["den", "dem", "des"], answer: "dem" },
  { sentence: "Sie hängt das Bild an ___ Wand.", choices: ["der", "die", "den"], answer: "die" },
];

const anAufQuiz = [
  {
    sentence: "Das Bild hängt ___ der Wand.",
    choices: ["an", "auf"],
    answer: "an",
    tip: "A picture is attached to a wall.",
  },
  {
    sentence: "Das Buch liegt ___ dem Tisch.",
    choices: ["an", "auf"],
    answer: "auf",
    tip: "A book rests on top of a table.",
  },
  {
    sentence: "Die Jacke hängt ___ der Tür.",
    choices: ["an", "auf"],
    answer: "an",
    tip: "The jacket hangs on the side of the door.",
  },
  {
    sentence: "Die Tasche steht ___ dem Boden.",
    choices: ["an", "auf"],
    answer: "auf",
    tip: "The bag stands on top of the floor.",
  },
];

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle = {
  border: "1px solid #e5e7eb",
  padding: "8px 10px",
  textAlign: "left",
  background: "#f8fafc",
};

const tdStyle = {
  border: "1px solid #e5e7eb",
  padding: "8px 10px",
};

const TwoCasePrepositionsPage = () => {
  const navigate = useNavigate();

  const [choices, setChoices] = useState(() => visualGame.map(() => ""));
  const [checked, setChecked] = useState(false);

  const [practiceChoices, setPracticeChoices] = useState(() => practiceQuiz.map(() => ""));
  const [practiceChecked, setPracticeChecked] = useState(false);

  const [anAufChoices, setAnAufChoices] = useState(() => anAufQuiz.map(() => ""));
  const [anAufChecked, setAnAufChecked] = useState(false);

  const score = useMemo(() => {
    if (!checked) return null;
    let s = 0;
    visualGame.forEach((q, i) => {
      if (normalizeAnswer(choices[i]) === normalizeAnswer(q.answer)) s += 1;
    });
    return s;
  }, [checked, choices]);

  const practiceScore = useMemo(() => {
    if (!practiceChecked) return null;
    let s = 0;
    practiceQuiz.forEach((q, i) => {
      if (normalizeAnswer(practiceChoices[i]) === normalizeAnswer(q.answer)) s += 1;
    });
    return s;
  }, [practiceChecked, practiceChoices]);

  const anAufScore = useMemo(() => {
    if (!anAufChecked) return null;
    let s = 0;
    anAufQuiz.forEach((q, i) => {
      if (normalizeAnswer(anAufChoices[i]) === normalizeAnswer(q.answer)) s += 1;
    });
    return s;
  }, [anAufChecked, anAufChoices]);

  const onChangeChoice = (index, value) => {
    setChoices((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setChecked(false);
  };

  const onChangePracticeChoice = (index, value) => {
    setPracticeChoices((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setPracticeChecked(false);
  };

  const onChangeAnAufChoice = (index, value) => {
    setAnAufChoices((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setAnAufChecked(false);
  };

  const resetGame = () => {
    setChoices(visualGame.map(() => ""));
    setChecked(false);
  };

  const resetPractice = () => {
    setPracticeChoices(practiceQuiz.map(() => ""));
    setPracticeChecked(false);
  };

  const resetAnAuf = () => {
    setAnAufChoices(anAufQuiz.map(() => ""));
    setAnAufChecked(false);
  };

  const answeredVisual = choices.filter(Boolean).length;
  const answeredPractice = practiceChoices.filter(Boolean).length;
  const answeredAnAuf = anAufChoices.filter(Boolean).length;

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button
          type="button"
          style={{ ...styles.secondaryButton, width: "fit-content" }}
          onClick={() => navigate("/campus/course")}
          aria-label="Back to course overview"
        >
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          Day 18: Wechselpräpositionen (Two-Case Prepositions)
        </h1>

        <p style={{ margin: 0 }}>
          Some German prepositions can take <em>two cases</em>. Use <strong>Accusative</strong> for movement
          (<strong>Wohin?</strong>) and <strong>Dative</strong> for position (<strong>Wo?</strong>).
        </p>
      </header>

      <TopicImageBreak
        src={IMG_NOTEBOOK}
        alt="Notebook on a desk"
        title="Lesson Notes"
        subtitle="Learn the rule first, then practise with examples and quizzes."
      />

      <Section title="0) Start Here: How two-case prepositions work">
        <p style={{ margin: 0 }}>
          Some German prepositions can take <strong>two cases</strong>. These are called{" "}
          <strong>Wechselpräpositionen</strong>.
        </p>

        <p style={{ margin: 0 }}>
          The case depends on the meaning of the sentence, not only on the preposition.
        </p>

        <BulletList
          items={[
            "Wohin? (movement to a place) → Akkusativ",
            "Wo? (position in a place) → Dativ",
            "The same preposition can change meaning: Ich gehe in die Schule. / Ich bin in der Schule.",
          ]}
        />

        <p style={{ margin: 0 }}>
          So always check the verb and ask: <strong>Wohin?</strong> or <strong>Wo?</strong>
        </p>
      </Section>

      <TopicImageBreak
        src={IMG_DIRECTIONS}
        alt="A sign with arrows showing different directions"
        title="Movement vs Position"
        subtitle="Wohin? → Akkusativ • Wo? → Dativ"
      />

      <Section title="1) The 9 Wechselpräpositionen">
        <BulletList items={PREPOSITIONS} />
      </Section>

      <Section title="2) The Golden Rule">
        <p style={{ margin: 0 }}>
          🔵 <strong>ACCUSATIVE</strong> → movement / direction / change of place
        </p>
        <p style={{ margin: 0 }}>
          🟢 <strong>DATIVE</strong> → position / location / no change of place
        </p>
        <p style={{ margin: 0, fontSize: 14, opacity: 0.9 }}>
          Tipp: <strong>legen, stellen, setzen</strong> usually answer <strong>Wohin?</strong> → Akkusativ.
          <strong> liegen, stehen, sitzen</strong> usually answer <strong>Wo?</strong> → Dativ.
        </p>
      </Section>

      <Section title="3) Helpful verb pairs">
        <div style={{ overflowX: "auto" }}>
          <table style={{ ...tableStyle, minWidth: 420 }}>
            <thead>
              <tr>
                <th style={thStyle}>Akkusativ (Wohin?)</th>
                <th style={thStyle}>Dativ (Wo?)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["legen", "liegen"],
                ["stellen", "stehen"],
                ["setzen", "sitzen"],
                ["hängen", "hängen"],
              ].map(([a, b], index) => (
                <tr key={`${a}-${b}-${index}`}>
                  <td style={tdStyle}>{a}</td>
                  <td style={tdStyle}>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ margin: 0, fontSize: 14, opacity: 0.9 }}>
          <strong>About hängen:</strong> this verb appears in <strong>both columns</strong>.
        </p>
        <BulletList
          items={[
            "Akkusativ (Wohin?): Ich hänge das Bild an die Wand. → I hang/put the picture onto the wall (movement, change of place).",
            "Dativ (Wo?): Das Bild hängt an der Wand. → The picture is hanging on the wall (position, no movement).",
          ]}
        />
      </Section>

      <Section title="4) Article Overview">
        <div style={{ overflowX: "auto" }}>
          <table style={{ ...tableStyle, minWidth: 520 }}>
            <caption style={{ textAlign: "left", padding: "8px 0", fontWeight: 700 }}>
              Articles for Akkusativ vs Dativ (quick reference)
            </caption>
            <thead>
              <tr>
                {["Case", "Masculine", "Feminine", "Neuter", "Plural"].map((header) => (
                  <th key={header} scope="col" style={thStyle}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Accusative (def.)", "den", "die", "das", "die"],
                ["Accusative (indef.)", "einen", "eine", "ein", "—"],
                ["Dative (def.)", "dem", "der", "dem", "den (+n)"],
                ["Dative (indef.)", "einem", "einer", "einem", "—"],
              ].map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, idx) =>
                    idx === 0 ? (
                      <th key={`${row[0]}-${cell}`} scope="row" style={{ ...tdStyle, textAlign: "left" }}>
                        {cell}
                      </th>
                    ) : (
                      <td key={`${row[0]}-${cell}`} style={tdStyle}>
                        {cell}
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="5) Important Difference: an vs auf">
        <p style={{ margin: 0 }}>
          Students often confuse <strong>an</strong> and <strong>auf</strong> because both can mean{" "}
          <strong>on</strong> in English. But German uses them differently.
        </p>

        <div style={{ overflowX: "auto" }}>
          <table style={{ ...tableStyle, minWidth: 520 }}>
            <thead>
              <tr>
                {["Preposition", "Main idea", "Typical image", "Example"].map((header) => (
                  <th key={header} style={thStyle}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...tdStyle, fontWeight: 700 }}>an</td>
                <td style={tdStyle}>on / at a side, edge, vertical surface, or attached to it</td>
                <td style={tdStyle}>something touches the side of something</td>
                <td style={tdStyle}>
                  Das Bild hängt <strong>an der Wand</strong>.
                </td>
              </tr>
              <tr>
                <td style={{ ...tdStyle, fontWeight: 700 }}>auf</td>
                <td style={tdStyle}>on top of a horizontal surface</td>
                <td style={tdStyle}>something rests on the top of something</td>
                <td style={tdStyle}>
                  Das Buch liegt <strong>auf dem Tisch</strong>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <BulletList
          items={[
            "an = attached to the side / wall / door / window / edge",
            "auf = resting on top of a table / chair / floor / bed / shelf",
            "Think: an = side contact, auf = top contact",
          ]}
        />

        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 12,
            background: "#f9fafb",
            display: "grid",
            gap: 8,
          }}
        >
          <strong>Quick memory tip 💡</strong>
          <div>
            <strong>an</strong> → attached to a vertical surface
          </div>
          <div>
            <strong>auf</strong> → on top of a flat surface
          </div>
        </div>
      </Section>

      <Section title="6) Example Pairs">
        <div style={{ display: "grid", gap: 10 }}>
          {examplePairs.map(([preposition, movement, position], index) => (
            <div
              key={`${preposition}-${index}`}
              style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}
            >
              <strong>🔹 {preposition}</strong>
              <p style={{ margin: "8px 0 0" }}>
                {boldPrepositionInSentence(movement, preposition)}{" "}
                <span style={{ opacity: 0.8 }}>(Wohin?)</span>
              </p>
              <p style={{ margin: "6px 0 0" }}>
                {boldPrepositionInSentence(position, preposition)}{" "}
                <span style={{ opacity: 0.8 }}>(Wo?)</span>
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="7) Mini Practice: an oder auf?">
        <p style={{ margin: 0 }}>
          Choose <strong>an</strong> or <strong>auf</strong>. This helps you see the difference clearly.
        </p>
        <p style={{ margin: 0, opacity: 0.85 }}>
          Answered: {answeredAnAuf}/{anAufQuiz.length}
        </p>

        <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
          {anAufQuiz.map((q, i) => {
            const selected = normalizeAnswer(anAufChoices[i]);
            const correct = normalizeAnswer(q.answer);
            const isCorrect = anAufChecked && selected === correct;
            const isWrong = anAufChecked && selected && selected !== correct;

            return (
              <div
                key={`${q.sentence}-${i}`}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: 12,
                  display: "grid",
                  gap: 8,
                }}
              >
                <div style={{ fontWeight: 600 }}>
                  {i + 1}. {q.sentence}
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {q.choices.map((option) => {
                    const normalizedOption = normalizeAnswer(option);
                    const isCorrectChoice = anAufChecked && normalizedOption === correct;
                    const isWrongChoice =
                      anAufChecked && normalizedOption === selected && normalizedOption !== correct;

                    return (
                      <button
                        key={`${q.sentence}-${option}`}
                        type="button"
                        onClick={() => onChangeAnAufChoice(i, option)}
                        style={getChoiceButtonStyle({
                          selected: anAufChoices[i] === option,
                          checked: anAufChecked,
                          isCorrectChoice,
                          isWrongChoice,
                        })}
                        aria-label={`Choose ${option} for: ${q.sentence}`}
                      >
                        {option}
                      </button>
                    );
                  })}

                  {isCorrect && <span style={{ fontWeight: 700, color: "#166534" }}>✅ richtig</span>}
                  {isWrong && <span style={{ fontWeight: 700, color: "#991b1b" }}>❌ falsch — richtig: {q.answer}</span>}
                </div>

                {anAufChecked && (
                  <div style={{ fontSize: 14, opacity: 0.85 }}>
                    <strong>Why?</strong> {q.tip}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
          <button
            type="button"
            style={{ ...styles.primaryButton, width: "fit-content" }}
            onClick={() => setAnAufChecked(true)}
          >
            Check answers
          </button>

          <button
            type="button"
            style={{ ...styles.secondaryButton, width: "fit-content" }}
            onClick={resetAnAuf}
          >
            Reset
          </button>

          {anAufChecked && (
            <div style={{ marginLeft: "auto", fontWeight: 800 }}>
              Score: {anAufScore}/{anAufQuiz.length}
            </div>
          )}
        </div>
      </Section>

      <TopicImageBreak
        src={IMG_NOTEBOOK}
        alt="Notebook on a desk"
        title="Quick Overview"
        subtitle="Articles and short forms"
      />

      <Section title="8) Short Forms (Important!)">
        <BulletList items={["im = in dem", "ins = in das", "am = an dem", "ans = an das"]} />
      </Section>

      <TopicImageBreak
        src={IMG_SIGNPOST}
        alt="A street sign with arrows pointing in different directions"
        title="Practice Time"
        subtitle="Choose the correct articles and prepositions."
      />

      <Section title="9) Quick Check: Choose the correct article (7 questions)">
        <p style={{ margin: 0 }}>Pick one answer for each sentence.</p>
        <p style={{ margin: 0, opacity: 0.85 }}>
          Answered: {answeredPractice}/{practiceQuiz.length}
        </p>

        <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
          {practiceQuiz.map((q, i) => {
            const selected = normalizeAnswer(practiceChoices[i]);
            const correct = normalizeAnswer(q.answer);
            const isCorrect = practiceChecked && selected === correct;
            const isWrong = practiceChecked && selected && selected !== correct;

            return (
              <div
                key={`${q.sentence}-${i}`}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: 12,
                  display: "grid",
                  gap: 8,
                }}
              >
                <div style={{ fontWeight: 600 }}>
                  {i + 1}. {q.sentence}
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {q.choices.map((option) => {
                    const normalizedOption = normalizeAnswer(option);
                    const isCorrectChoice = practiceChecked && normalizedOption === correct;
                    const isWrongChoice =
                      practiceChecked && normalizedOption === selected && normalizedOption !== correct;

                    return (
                      <button
                        key={`${q.sentence}-${option}`}
                        type="button"
                        onClick={() => onChangePracticeChoice(i, option)}
                        style={getChoiceButtonStyle({
                          selected: practiceChoices[i] === option,
                          checked: practiceChecked,
                          isCorrectChoice,
                          isWrongChoice,
                        })}
                        aria-label={`Choose ${option} for: ${q.sentence}`}
                      >
                        {option}
                      </button>
                    );
                  })}

                  {isCorrect && <span style={{ fontWeight: 700, color: "#166534" }}>✅ richtig</span>}
                  {isWrong && (
                    <span style={{ fontWeight: 700, color: "#991b1b" }}>❌ falsch — richtig: {q.answer}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
          <button
            type="button"
            style={{ ...styles.primaryButton, width: "fit-content" }}
            onClick={() => setPracticeChecked(true)}
          >
            Check answers
          </button>

          <button
            type="button"
            style={{ ...styles.secondaryButton, width: "fit-content" }}
            onClick={resetPractice}
          >
            Reset
          </button>

          {practiceChecked && (
            <div style={{ marginLeft: "auto", fontWeight: 800 }}>
              Score: {practiceScore}/{practiceQuiz.length}
            </div>
          )}
        </div>
      </Section>

      <TopicImageBreak
        src={IMG_DIRECTIONS}
        alt="A sign with arrows showing different directions"
        title="Visual Game"
        subtitle="Use the scene and choose the correct preposition."
      />

      <Section title="10) Visual Position Game (Interactive)">
        <p style={{ margin: 0 }}>
          Choose the correct preposition: <strong>{PREPOSITION_OPTIONS.join(" – ")}</strong>
        </p>
        <p style={{ margin: 0, opacity: 0.85 }}>
          Answered: {answeredVisual}/{visualGame.length}
        </p>

        <div style={{ display: "grid", gap: 12, marginTop: 8 }}>
          {visualGame.map((q, i) => {
            const selected = normalizeAnswer(choices[i]);
            const correct = normalizeAnswer(q.answer);
            const isCorrect = checked && selected === correct;
            const isWrong = checked && selected && selected !== correct;

            return (
              <div
                key={`${q.sentence}-${i}`}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: 12,
                  display: "grid",
                  gap: 10,
                }}
              >
                <SceneCard
                  label={q.label}
                  emojiLine1={q.emojiLine1}
                  emojiLine2={q.emojiLine2}
                  helper={q.helper}
                />

                <div style={{ display: "grid", gap: 8 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600 }}>{i + 1}.</span>
                    <span>{q.sentence}</span>
                  </div>

                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <label style={{ fontWeight: 600 }} htmlFor={`prep-${i}`}>
                      Antwort:
                    </label>

                    <select
                      id={`prep-${i}`}
                      value={choices[i]}
                      onChange={(e) => onChangeChoice(i, e.target.value)}
                      style={getSelectStyle({ checked, isCorrect, isWrong })}
                      aria-label={`Choose preposition for question ${i + 1}`}
                    >
                      <option value="">— wählen —</option>
                      {PREPOSITION_OPTIONS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>

                    {isCorrect && <span style={{ fontWeight: 700, color: "#166534" }}>✅ richtig</span>}
                    {isWrong && <span style={{ fontWeight: 700, color: "#991b1b" }}>❌ falsch — richtig: {q.answer}</span>}
                  </div>

                  {checked && !choices[i] && <span style={{ opacity: 0.8 }}>Bitte wähle eine Antwort.</span>}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
          <button
            type="button"
            style={{ ...styles.primaryButton, width: "fit-content" }}
            onClick={() => setChecked(true)}
          >
            Check answers
          </button>

          <button
            type="button"
            style={{ ...styles.secondaryButton, width: "fit-content" }}
            onClick={resetGame}
          >
            Reset
          </button>

          {checked && (
            <div style={{ marginLeft: "auto", fontWeight: 800 }}>
              Score: {score}/{visualGame.length}
            </div>
          )}
        </div>

        <details style={{ marginTop: 10 }}>
          <summary style={{ cursor: "pointer", fontWeight: 700 }}>Antworten anzeigen (Teacher)</summary>
          <ol style={{ margin: "10px 0 0", paddingLeft: 20, display: "grid", gap: 6 }}>
            {visualGame.map((q, i) => (
              <li key={`${q.answer}-${i}`}>{q.answer}</li>
            ))}
          </ol>
        </details>
      </Section>
    </main>
  );
};

export default TwoCasePrepositionsPage;
