import React from "react";
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
  ["in", "Ich gehe in die Schule.", "Ich bin in der Schule."],
  ["auf", "Er legt das Buch auf den Tisch.", "Das Buch liegt auf dem Tisch."],
  ["an", "Sie hängt das Bild an die Wand.", "Das Bild hängt an der Wand."],
  ["unter", "Der Hund läuft unter den Tisch.", "Der Hund liegt unter dem Tisch."],
  ["zwischen", "Ich stelle den Stuhl zwischen die Tische.", "Der Stuhl steht zwischen den Tischen."],
];

const visualGameItems = [
  "Die Katze ist ______ dem Tisch.",
  "Die Katze ist ______ dem Tisch.",
  "Die Schule ist ______ der Bank und der Bibliothek.",
  "Ich lege die Tasche ______ den Tisch.",
  "Der Junge steht ______ dem Baum.",
  "Das Auto steht ______ dem Haus.",
  "Die Lampe hängt ______ der Tür.",
  "Der Hund sitzt ______ dem Sofa.",
  "Die Kiste ist ______ dem Tisch.",
];

const TwoCasePrepositionsPage = () => {
  const navigate = useNavigate();

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
              <p style={{ margin: "8px 0 0" }}>{movement} (movement)</p>
              <p style={{ margin: "6px 0 0" }}>{position} (position)</p>
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
        <p style={{ margin: 0 }}>
          Look at the drawing and choose the correct preposition: an – auf – hinter – in – neben – über – unter – vor – zwischen
        </p>
        <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          {visualGameItems.map((sentence, index) => (
            <li key={`${index}-${sentence}`}>{sentence}</li>
          ))}
        </ol>
      </Section>
    </div>
  );
};

export default TwoCasePrepositionsPage;
