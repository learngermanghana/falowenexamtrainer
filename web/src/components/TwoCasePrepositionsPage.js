import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const Section = ({ title, children }) => (
  <section style={{ ...styles.card, display: "grid", gap: 12 }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const BulletList = ({ items }) => (
  <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

const PREPOSITIONS = ["an", "auf", "hinter", "in", "neben", "über", "unter", "vor", "zwischen"];

const examplePairs = [
  ["in", "Ich gehe in die Schule.", "Ich bin in der Schule."],
  ["auf", "Er legt das Buch auf den Tisch.", "Das Buch liegt auf dem Tisch."],
  ["an", "Sie hängt das Bild an die Wand.", "Das Bild hängt an der Wand."],
  ["unter", "Der Hund läuft unter den Tisch.", "Der Hund liegt unter dem Tisch."],
  ["zwischen", "Ich stelle den Stuhl zwischen die Tische.", "Der Stuhl steht zwischen den Tischen."],
];

const visualGame = [
  {
    art: `      🐱
    ───────
     Tisch`,
    sentence: "Die Katze ist ______ dem Tisch.",
    answer: "auf",
  },
  {
    art: `     Tisch
    ───────
      🐱`,
    sentence: "Die Katze ist ______ dem Tisch.",
    answer: "unter",
  },
  {
    art: `🏦      🏫      📚`,
    sentence: "Die Schule ist ______ der Bank und der Bibliothek.",
    answer: "zwischen",
  },
  {
    art: `      🎒
    ───────
     Tisch`,
    sentence: "Ich lege die Tasche ______ den Tisch.",
    answer: "auf",
  },
  {
    art: `     🌳
      👦`,
    sentence: "Der Junge steht ______ dem Baum.",
    answer: "vor",
  },
  {
    art: `      🏠
   🚗`,
    sentence: "Das Auto steht ______ dem Haus.",
    answer: "vor",
  },
  {
    art: `      💡
       |
     🚪`,
    sentence: "Die Lampe hängt ______ der Tür.",
    answer: "an",
  },
  {
    art: `      🛋
      🐶`,
    sentence: "Der Hund sitzt ______ dem Sofa.",
    answer: "auf",
  },
  {
    art: `      📦
    ───────
     Tisch`,
    sentence: "Die Kiste ist ______ dem Tisch.",
    answer: "auf",
  },
];


const practiceQuiz = [
  {
    sentence: "Ich gehe in ___ Park.",
    choices: ["dem", "den", "der"],
    answer: "den",
  },
  {
    sentence: "Ich bin im ___ Park.",
    choices: ["den", "dem", "die"],
    answer: "dem",
  },
  {
    sentence: "Er stellt den Laptop auf ___ Tisch.",
    choices: ["den", "dem", "des"],
    answer: "den",
  },
  {
    sentence: "Der Laptop steht auf ___ Tisch.",
    choices: ["dem", "den", "der"],
    answer: "dem",
  },
  {
    sentence: "Wir setzen uns neben ___ Lehrer.",
    choices: ["dem", "den", "der"],
    answer: "den",
  },
  {
    sentence: "Wir sitzen neben ___ Lehrer.",
    choices: ["den", "dem", "des"],
    answer: "dem",
  },
  {
    sentence: "Sie hängt das Bild an ___ Wand.",
    choices: ["der", "die", "den"],
    answer: "die",
  },
];

const TwoCasePrepositionsPage = () => {
  const navigate = useNavigate();

  // Visual Game state
  const [choices, setChoices] = useState(() => visualGame.map(() => ""));
  const [checked, setChecked] = useState(false);

  // Practice quiz state
  const [practiceChoices, setPracticeChoices] = useState(() => practiceQuiz.map(() => ""));
  const [practiceChecked, setPracticeChecked] = useState(false);

  const score = useMemo(() => {
    if (!checked) return null;
    let s = 0;
    visualGame.forEach((q, i) => {
      if ((choices[i] || "").trim().toLowerCase() === q.answer) s += 1;
    });
    return s;
  }, [checked, choices]);

  const onChangeChoice = (index, value) => {
    setChoices((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setChecked(false);
  };

  const resetGame = () => {
    setChoices(visualGame.map(() => ""));
    setChecked(false);
  };

  const practiceScore = useMemo(() => {
    if (!practiceChecked) return null;
    let s = 0;
    practiceQuiz.forEach((q, i) => {
      if (practiceChoices[i] === q.answer) s += 1;
    });
    return s;
  }, [practiceChecked, practiceChoices]);

  const onChangePracticeChoice = (index, value) => {
    setPracticeChoices((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setPracticeChecked(false);
  };

  const resetPractice = () => {
    setPracticeChoices(practiceQuiz.map(() => ""));
    setPracticeChecked(false);
  };

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Day 18: Two-Case Prepositions (Wechselpräpositionen)</h1>
        <p style={{ margin: 0 }}>
          Some prepositions can take <em>two cases</em>. Use <strong>Accusative</strong> for movement (Wohin?) and{" "}
          <strong>Dative</strong> for position (Wo?).
        </p>
      </header>

      <Section title="0) Start Here: Prepositions have families">
        <p style={{ margin: 0 }}>
          Every preposition belongs to a <strong>family/category</strong>. Prepositions affect your sentence because they control
          which case/article comes after them.
        </p>
        <BulletList
          items={[
            "Some prepositions always take Dative.",
            "Some prepositions always take Akkusative.",
            "Today we check two-case prepositions (Wechselpräpositionen): they can be Dative or Akkusative depending on usage.",
          ]}
        />
        <p style={{ margin: 0 }}>
          For two-case prepositions, the <strong>verb + meaning</strong> decide the case: movement (Wohin?) → Akkusative,
          position (Wo?) → Dative.
        </p>
      <Section title="0) Start Here: How prepositions change a sentence in German">
        <p style={{ margin: 0 }}>
          You already know <strong>Nominative</strong> and <strong>Akkusative</strong>. Now learn this: a <strong>preposition</strong>
          can change the article/case in your sentence.
        </p>
        <p style={{ margin: 0 }}>
          Today we focus on <strong>two-case prepositions</strong>. Here, the <strong>verb + meaning</strong> decide the case:
        </p>
        <BulletList
          items={[
            "Movement to a place (Wohin?) → Akkusative.",
            "Position in a place (Wo?) → Dative.",
            "Same preposition, different meaning: Ich gehe in die Schule. / Ich bin in der Schule.",
          ]}
        />
      </Section>

      <Section title="1) The 9 Wechselpräpositionen">
        <BulletList
          items={[
            "an (on, at)",
            "auf (on, onto)",
            "hinter (behind)",
            "in (in, into)",
            "neben (next to)",
            "über (over, above)",
            "unter (under)",
            "vor (in front of)",
            "zwischen (between)",
          ]}
        />
      </Section>

      <Section title="2) The Golden Rule">
        <p style={{ margin: 0 }}>🔵 <strong>ACCUSATIVE</strong> → Movement (Wohin?)</p>
        <p style={{ margin: 0 }}>🟢 <strong>DATIVE</strong> → Position (Wo?)</p>
        <p style={{ margin: 0, fontSize: 14, opacity: 0.9 }}>
          Tipp: <strong>legen/stellen/hängen</strong> → Wohin? (Akk.) | <strong>liegen/stehen/hängen</strong> → Wo? (Dat.)
        </p>
      </Section>

      <Section title="3) Article Overview">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
            <thead>
              <tr>
                {["Case", "Masculine", "Feminine", "Neuter", "Plural"].map((header) => (
                  <th
                    key={header}
                    style={{ border: "1px solid #e5e7eb", padding: "8px 10px", textAlign: "left", background: "#f8fafc" }}
                  >
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
                  {row.map((cell) => (
                    <td key={`${row[0]}-${cell}`} style={{ border: "1px solid #e5e7eb", padding: "8px 10px" }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="4) Example Pairs">
        <div style={{ display: "grid", gap: 10 }}>
          {examplePairs.map(([preposition, movement, position]) => (
            <div key={preposition} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
              <strong>🔹 {preposition}</strong>
              <p style={{ margin: "8px 0 0" }}>{movement} <span style={{ opacity: 0.8 }}>(Wohin?)</span></p>
              <p style={{ margin: "6px 0 0" }}>{position} <span style={{ opacity: 0.8 }}>(Wo?)</span></p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="5) Short Forms (Important!)">
        <BulletList items={["im = in dem", "ins = in das", "am = an dem", "ans = an das"]} />
      </Section>

      <Section title="6) Quick Check: Choose the correct article (7 questions)">
        <p style={{ margin: 0 }}>Pick one answer for each sentence.</p>

        <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
          {practiceQuiz.map((q, i) => {
            const isCorrect = practiceChecked && practiceChoices[i] === q.answer;
            const isWrong = practiceChecked && practiceChoices[i] && practiceChoices[i] !== q.answer;

            return (
              <div key={q.sentence} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, display: "grid", gap: 8 }}>
                <div style={{ fontWeight: 600 }}>{i + 1}. {q.sentence}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {q.choices.map((option) => (
                    <button
                      key={`${q.sentence}-${option}`}
                      onClick={() => onChangePracticeChoice(i, option)}
                      style={{
                        ...styles.secondaryButton,
                        width: "fit-content",
                        borderColor: practiceChoices[i] === option ? "#111827" : undefined,
                        fontWeight: practiceChoices[i] === option ? 700 : 500,
                      }}
                    >
                      {option}
                    </button>
                  ))}
                  {isCorrect && <span style={{ fontWeight: 700 }}>✅ richtig</span>}
                  {isWrong && <span style={{ fontWeight: 700 }}>❌ falsch</span>}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
          <button style={{ ...styles.primaryButton, width: "fit-content" }} onClick={() => setPracticeChecked(true)}>
            Check answers
          </button>
          <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={resetPractice}>
            Reset
          </button>

          {practiceChecked && (
            <div style={{ marginLeft: "auto", fontWeight: 800 }}>
              Score: {practiceScore}/{practiceQuiz.length}
            </div>
          )}
        </div>
      </Section>

      <Section title="7) Visual Position Game (Interactive)">
        <p style={{ margin: 0 }}>
          Choose the correct preposition: <strong>{PREPOSITIONS.join(" – ")}</strong>
        </p>

        <div style={{ display: "grid", gap: 12, marginTop: 8 }}>
          {visualGame.map((q, i) => {
            const isCorrect = checked && choices[i] === q.answer;
            const isWrong = checked && choices[i] && choices[i] !== q.answer;

            return (
              <div key={i} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, display: "grid", gap: 10 }}>
                <pre
                  style={{
                    margin: 0,
                    padding: 12,
                    borderRadius: 12,
                    background: "#0b1220",
                    color: "#e5e7eb",
                    overflowX: "auto",
                    lineHeight: 1.3,
                  }}
                >
                  {q.art}
                </pre>

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
                      style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #e5e7eb" }}
                      aria-label={`Choose preposition for question ${i + 1}`}
                    >
                      <option value="">— wählen —</option>
                      {PREPOSITIONS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>

                    {isCorrect && <span style={{ fontWeight: 700 }}>✅ richtig</span>}
                    {isWrong && <span style={{ fontWeight: 700 }}>❌ falsch</span>}
                  </div>

                  {checked && !choices[i] && <span style={{ opacity: 0.8 }}>Bitte wähle eine Antwort.</span>}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
          <button style={{ ...styles.primaryButton, width: "fit-content" }} onClick={() => setChecked(true)}>
            Check answers
          </button>
          <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={resetGame}>
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
              <li key={i}>
                {q.answer}
              </li>
            ))}
          </ol>
        </details>
      </Section>
    </main>
  );
};

export default TwoCasePrepositionsPage;
