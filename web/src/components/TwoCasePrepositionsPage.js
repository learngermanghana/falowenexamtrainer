import React, { useState } from "react";
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

const examplePairs = [
  ["an", "Sie hängt das Bild an die Wand. (Akkusativ)", "Das Bild hängt an der Wand. (Dativ)"],
  ["auf", "Er legt das Buch auf den Tisch. (Akkusativ)", "Das Buch liegt auf dem Tisch. (Dativ)"],
  ["hinter", "Der Junge läuft hinter das Haus. (Akkusativ)", "Der Junge steht hinter dem Haus. (Dativ)"],
  ["in", "Ich gehe in die Schule. (Akkusativ)", "Ich bin in der Schule. (Dativ)"],
  ["neben", "Ich stelle den Stuhl neben den Tisch. (Akkusativ)", "Der Stuhl steht neben dem Tisch. (Dativ)"],
  ["über", "Der Vogel fliegt über das Haus. (Akkusativ)", "Der Vogel ist über dem Haus. (Dativ)"],
  ["unter", "Der Hund läuft unter den Tisch. (Akkusativ)", "Der Hund liegt unter dem Tisch. (Dativ)"],
  ["vor", "Wir gehen vor das Kino. (Akkusativ)", "Wir warten vor dem Kino. (Dativ)"],
  ["zwischen", "Ich stelle den Stuhl zwischen die Tische. (Akkusativ)", "Der Stuhl steht zwischen den Tischen. (Dativ)"],
];

const visualGameItems = [
  {
    sentence: "Die Katze ist ______ dem Tisch.",
    options: ["auf", "unter", "zwischen"],
  },
  {
    sentence: "Die Katze ist ______ dem Tisch.",
    options: ["vor", "unter", "über"],
  },
  {
    sentence: "Die Schule ist ______ der Bank und der Bibliothek.",
    options: ["zwischen", "hinter", "vor"],
  },
  {
    sentence: "Ich lege die Tasche ______ den Tisch.",
    options: ["an", "auf", "unter"],
  },
  {
    sentence: "Der Junge steht ______ dem Baum.",
    options: ["hinter", "zwischen", "über"],
  },
  {
    sentence: "Das Auto steht ______ dem Haus.",
    options: ["vor", "an", "in"],
  },
  {
    sentence: "Die Lampe hängt ______ der Tür.",
    options: ["über", "neben", "unter"],
  },
  {
    sentence: "Der Hund sitzt ______ dem Sofa.",
    options: ["neben", "in", "an"],
  },
  {
    sentence: "Die Kiste ist ______ dem Tisch.",
    options: ["unter", "über", "zwischen"],
  },
];

const TwoCasePrepositionsPage = () => {
  const navigate = useNavigate();
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleAnswerSelect = (index, option) => {
    setSelectedAnswers((previous) => ({ ...previous, [index]: option }));
  };

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Day 18: Two-Case Prepositions (Wechselpräpositionen)</h1>
        <p style={{ margin: 0 }}>
          In German, some prepositions can take two different cases. They are called <em>Wechselpräpositionen</em>
          (two-case prepositions).
        </p>
        <p style={{ margin: 0 }}>The case depends on meaning:</p>
        <p style={{ margin: 0 }}>
          <strong>Movement → Accusative (Wohin?)</strong>
        </p>
        <p style={{ margin: 0 }}>
          <strong>Position → Dative (Wo?)</strong>
        </p>
      </div>

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
        <p style={{ margin: 0 }}>🔵 ACCUSATIVE → Movement (Wohin?)</p>
        <p style={{ margin: 0 }}>Use accusative when something moves to a new location.</p>
        <p style={{ margin: 0 }}>🟢 DATIVE → Position (Wo?)</p>
        <p style={{ margin: 0 }}>Use dative when something is already in a position.</p>
      </Section>

      <Section title="3) Article Overview">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
            <thead>
              <tr>
                {["Case", "Masculine", "Feminine", "Neuter", "Plural"].map((header) => (
                  <th key={header} style={{ border: "1px solid #e5e7eb", padding: "8px 10px", textAlign: "left", background: "#f8fafc" }}>
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

      <Section title="4) Clear Example Pairs (Movement vs Position)">
        <div style={{ display: "grid", gap: 10 }}>
          {examplePairs.map(([preposition, movement, position]) => (
            <div key={preposition} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
              <strong>🔹 {preposition}</strong>
              <p style={{ margin: "8px 0 0" }}>{movement}</p>
              <p style={{ margin: "6px 0 0" }}>{position}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="5) Short Forms (Important!)">
        <BulletList items={["im = in dem", "ins = in das", "am = an dem", "ans = an das"]} />
      </Section>

      <Section title="6) Practice A – Wo oder Wohin?">
        <p style={{ margin: 0 }}>Fill in the correct article.</p>
        <BulletList
          items={[
            "Ich gehe in ___ Park.",
            "Ich bin im ___ Park.",
            "Er legt das Handy auf ___ Tisch.",
            "Das Handy liegt auf ___ Tisch.",
            "Wir setzen uns neben ___ Lehrer.",
            "Wir sitzen neben ___ Lehrer.",
          ]}
        />
      </Section>

      <Section title="7) Visual Position Game">
        <p style={{ margin: 0 }}>🧩 Welche Präposition ist das?</p>
        <p style={{ margin: 0 }}>Choose the correct preposition for each sentence.</p>
        <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 10 }}>
          {visualGameItems.map(({ sentence, options }, index) => (
            <li key={`${index}-${sentence}`}>
              <p style={{ margin: "0 0 6px" }}>{sentence}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {options.map((option) => {
                  const isSelected = selectedAnswers[index] === option;
                  return (
                    <button
                      key={`${sentence}-${option}`}
                      type="button"
                      onClick={() => handleAnswerSelect(index, option)}
                      style={{
                        ...styles.secondaryButton,
                        padding: "6px 10px",
                        borderColor: isSelected ? "#2563eb" : undefined,
                        background: isSelected ? "#dbeafe" : undefined,
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
};

export default TwoCasePrepositionsPage;
