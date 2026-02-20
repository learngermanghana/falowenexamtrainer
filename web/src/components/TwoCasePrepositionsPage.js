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

const woAnswers = [
  "Ich bin in der Apotheke.",
  "Ich bin in der Buchhandlung.",
  "Ich bin im Kino.",
  "Ich bin im Museum.",
  "Ich bin in der Schule.",
  "Ich bin im Theater.",
  "Ich bin im Supermarkt.",
  "Ich bin im Zirkus.",
];

const wohinAnswers = [
  "Ich gehe in die Apotheke.",
  "Ich gehe in die Buchhandlung.",
  "Ich gehe ins Kino.",
  "Ich gehe ins Museum.",
  "Ich gehe in die Schule.",
  "Ich gehe ins Theater.",
  "Ich gehe in den Supermarkt.",
  "Ich gehe in den Zirkus.",
];

const gameQuestions = [
  {
    sentence: "Ich gehe in ___ Schule.",
    correct: "die",
    hint: "Movement to a destination: accusative.",
  },
  {
    sentence: "Ich bin in ___ Schule.",
    correct: "der",
    hint: "Static location: dative.",
  },
  {
    sentence: "Das Buch liegt auf ___ Tisch.",
    correct: "dem",
    hint: "No movement: dative.",
  },
  {
    sentence: "Er legt das Buch auf ___ Tisch.",
    correct: "den",
    hint: "Change of location: accusative.",
  },
];

const articleOptions = ["den", "die", "das", "dem", "der"];

const fullExamples = [
  {
    preposition: "an",
    accusative: "Ich hänge das Bild an die Wand. (I am hanging the picture on the wall.)",
    dative: "Das Bild hängt an der Wand. (The picture is hanging on the wall.)",
  },
  {
    preposition: "auf",
    accusative: "Ich stelle die Vase auf den Tisch. (I am placing the vase on the table.)",
    dative: "Die Vase steht auf dem Tisch. (The vase is on the table.)",
  },
  {
    preposition: "hinter",
    accusative: "Er geht hinter das Haus. (He is going behind the house.)",
    dative: "Er ist hinter dem Haus. (He is behind the house.)",
  },
  {
    preposition: "in",
    accusative: "Sie geht in die Stadt. (She is going into the city.)",
    dative: "Sie ist in der Stadt. (She is in the city.)",
  },
  {
    preposition: "neben",
    accusative: "Stell den Stuhl neben die Tür. (Place the chair next to the door.)",
    dative: "Der Stuhl steht neben der Tür. (The chair is next to the door.)",
  },
  {
    preposition: "über",
    accusative: "Der Vogel fliegt über das Haus. (The bird is flying over the house.)",
    dative: "Die Lampe hängt über dem Tisch. (The lamp is hanging over the table.)",
  },
  {
    preposition: "unter",
    accusative: "Die Katze läuft unter den Tisch. (The cat runs under the table.)",
    dative: "Die Katze schläft unter dem Tisch. (The cat is sleeping under the table.)",
  },
  {
    preposition: "vor",
    accusative: "Ich stelle das Auto vor das Haus. (I am parking the car in front of the house.)",
    dative: "Das Auto steht vor dem Haus. (The car is in front of the house.)",
  },
  {
    preposition: "zwischen",
    accusative: "Er legt das Buch zwischen die anderen Bücher. (He is placing the book between the other books.)",
    dative: "Das Buch ist zwischen den anderen Büchern. (The book is between the other books.)",
  },
];

const matchItems = [
  { clue: "Eine Lampe ist ____ dem Tisch befestigt.", answer: "über" },
  { clue: "Die Katze schläft ____ dem Stuhl.", answer: "unter" },
  { clue: "Die Schule ist ____ dem Museum und der Bibliothek.", answer: "zwischen" },
  { clue: "Ich lege meine Tasche ____ den Tisch.", answer: "auf" },
  { clue: "Das Fahrrad steht ____ dem Haus.", answer: "vor" },
  { clue: "Das Kind steht ____ der Tür.", answer: "an" },
  { clue: "Der Hund sitzt ____ dem Sofa.", answer: "neben" },
  { clue: "Sie geht ____ das Klassenzimmer.", answer: "in" },
  { clue: "Er versteckt sich ____ dem Baum.", answer: "hinter" },
];

const matchOptions = [
  "an (an, bei)",
  "auf (auf, auf ... drauf)",
  "hinter (hinter)",
  "in (in, hinein)",
  "neben (neben)",
  "über (über)",
  "unter (unter)",
  "vor (vor)",
  "zwischen (zwischen)",
];

const articleTables = [
  {
    title: "Original noun articles (Nominative)",
    rows: [{ caseName: "Nominative", masculine: "der", feminine: "die", neuter: "das", plural: "die" }],
  },
  {
    title: "Definite articles (bestimmter Artikel)",
    rows: [
      { caseName: "Accusative", masculine: "den", feminine: "die", neuter: "das", plural: "die" },
      { caseName: "Dative", masculine: "dem", feminine: "der", neuter: "dem", plural: "den" },
    ],
  },
  {
    title: "Indefinite articles (unbestimmter Artikel)",
    rows: [
      { caseName: "Accusative", masculine: "einen", feminine: "eine", neuter: "ein", plural: "—" },
      { caseName: "Dative", masculine: "einem", feminine: "einer", neuter: "einem", plural: "—" },
    ],
  },
];

const vocabularyPlaces = [
  "die Apotheke (the pharmacy)",
  "die Buchhandlung (the bookstore)",
  "das Kino (the cinema)",
  "das Museum (the museum)",
  "die Schule (the school)",
  "das Theater (the theater)",
  "der Supermarkt (the supermarket)",
  "der Zirkus (the circus)",
];

const quickRuleExamples = [
  "Ich gehe in die Schule. → Bewegung (Akkusativ)",
  "Ich bin in der Schule. → Position (Dativ)",
  "Er legt das Handy auf den Tisch. → Bewegung (Akkusativ)",
  "Das Handy liegt auf dem Tisch. → Position (Dativ)",
  "Wir stellen die Stühle vor das Haus. → Bewegung (Akkusativ)",
  "Die Stühle stehen vor dem Haus. → Position (Dativ)",
  "Sie hängt die Jacke an den Haken. → Bewegung (Akkusativ)",
  "Die Jacke hängt an dem Haken. → Position (Dativ)",
  "Ich setze mich neben den Lehrer. → Bewegung (Akkusativ)",
  "Ich sitze neben dem Lehrer. → Position (Dativ)",
];

const TwoCasePrepositionsPage = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [matchAnswers, setMatchAnswers] = useState({});

  const score = useMemo(
    () =>
      gameQuestions.reduce((total, question, index) => {
        if (answers[index] === question.correct) {
          return total + 1;
        }
        return total;
      }, 0),
    [answers]
  );

  const matchScore = useMemo(
    () =>
      matchItems.reduce((total, item, index) => {
        if (matchAnswers[index] === item.answer) {
          return total + 1;
        }
        return total;
      }, 0),
    [matchAnswers]
  );

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Day 18: Two-Case Prepositions (Wechselpräpositionen)</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          In German, prepositions belong to their own “families” just like verbs. The preposition you choose can change
          the case of the noun that follows.
        </p>
        <p style={{ margin: 0 }}>
          Before we focus on prepositions, remember that some common verbs already create a sentence with a nominative
          subject and an accusative object (for example: <em>Ich sehe den Mann</em>, <em>Sie kauft das Buch</em>,
          <em> Wir lernen die Sprache</em>). We are not adding dative verbs yet.
        </p>
        <p style={{ margin: 0 }}>
          Then with prepositions, German has three groups: accusative prepositions, dative prepositions, and two-case
          prepositions. For now, we focus only on two-case prepositions (Wechselpräpositionen).
        </p>
      </div>

      <Section title="1) What are Wechselpräpositionen?">
        <p style={{ margin: 0 }}>
          Wechselpräpositionen can take either the accusative or the dative case. Use accusative when there is movement
          to a new location (Wohin?), and dative for a static position (Wo?).
        </p>
        <BulletList
          items={[
            "an (on, at)",
            "auf (on, onto)",
            "hinter (behind)",
            "in (in, into)",
            "neben (next to)",
            "über (over, above)",
            "unter (under, below)",
            "vor (in front of)",
            "zwischen (between)",
          ]}
        />
      </Section>

      <Section title="2) Accusative vs Dative (quick rule)">
        <BulletList
          items={[
            "Start by identifying the noun's original article in nominative (der, die, das, die).",
            "Accusative (den, die, das, die): movement or change of location.",
            "Dative (dem, der, dem, den): no movement, static location.",
            "Example: Ich gehe in die Schule. (accusative)",
            "Example: Ich bin in der Schule. (dative)",
          ]}
        />
        <div style={{ display: "grid", gap: 12 }}>
          {articleTables.map((table) => (
            <div key={table.title} style={{ display: "grid", gap: 8 }}>
              <strong>{table.title}</strong>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
                  <thead>
                    <tr>
                      {["Case", "Masculine", "Feminine", "Neuter", "Plural"].map((header) => (
                        <th
                          key={`${table.title}-${header}`}
                          style={{ border: "1px solid #e5e7eb", padding: "8px 10px", textAlign: "left", background: "#f8fafc" }}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row) => (
                      <tr key={`${table.title}-${row.caseName}`}>
                        <td style={{ border: "1px solid #e5e7eb", padding: "8px 10px" }}>{row.caseName}</td>
                        <td style={{ border: "1px solid #e5e7eb", padding: "8px 10px" }}>{row.masculine}</td>
                        <td style={{ border: "1px solid #e5e7eb", padding: "8px 10px" }}>{row.feminine}</td>
                        <td style={{ border: "1px solid #e5e7eb", padding: "8px 10px" }}>{row.neuter}</td>
                        <td style={{ border: "1px solid #e5e7eb", padding: "8px 10px" }}>{row.plural}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
        <p style={{ margin: 0 }}>
          More examples (10):
        </p>
        <BulletList items={quickRuleExamples} />
      </Section>

      <Section title="3) Full examples for all Wechselpräpositionen">
        <p style={{ margin: 0 }}>
          Accusative is used for movement/change (Wohin?), and dative for static location (Wo?).
        </p>
        <div style={{ display: "grid", gap: 10 }}>
          {fullExamples.map((item) => (
            <div key={item.preposition} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
              <strong style={{ textTransform: "capitalize" }}>{item.preposition}</strong>
              <p style={{ margin: "8px 0 0" }}>
                <strong>Accusative:</strong> {item.accusative}
              </p>
              <p style={{ margin: "6px 0 0" }}>
                <strong>Dative:</strong> {item.dative}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="4) Vocabulary (before practice)">
        <p style={{ margin: 0 }}>Learn the following places:</p>
        <BulletList items={vocabularyPlaces} />
      </Section>

      <Section title='5) Assignment: Answer "Wo bist du?"'>
        <p style={{ margin: 0 }}>Use static location + dative case.</p>
        <BulletList items={woAnswers} />
        <p style={{ margin: 0 }}>
          Short note: <strong>im = in dem</strong>.
        </p>
      </Section>

      <Section title='6) Assignment: Answer "Wohin gehst du?"'>
        <p style={{ margin: 0 }}>Use destination + accusative case.</p>
        <BulletList items={wohinAnswers} />
        <p style={{ margin: 0 }}>
          Short note: <strong>ins = in das</strong> and <strong>am = an dem</strong>.
        </p>
      </Section>

      <Section title="7) Simple game: Place the article correctly">
        <p style={{ margin: 0 }}>Choose the best article for each sentence.</p>
        <div style={{ display: "grid", gap: 12 }}>
          {gameQuestions.map((question, index) => {
            const selected = answers[index];
            const isCorrect = selected && selected === question.correct;
            const isWrong = selected && selected !== question.correct;
            return (
              <div
                key={question.sentence}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: 12,
                  display: "grid",
                  gap: 8,
                }}
              >
                <strong>{question.sentence}</strong>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {articleOptions.map((option) => (
                    <button
                      key={`${question.sentence}-${option}`}
                      onClick={() => setAnswers((prev) => ({ ...prev, [index]: option }))}
                      style={{
                        ...styles.secondaryButton,
                        minWidth: 70,
                        background: selected === option ? "#dbeafe" : styles.secondaryButton.background,
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {isCorrect && <span style={{ color: "#166534" }}>Correct ✅ {question.hint}</span>}
                {isWrong && <span style={{ color: "#b91c1c" }}>Try again. Hint: {question.hint}</span>}
              </div>
            );
          })}
        </div>
        <p style={{ margin: 0 }}>
          Score: {score}/{gameQuestions.length}
        </p>
      </Section>

      <Section title="8) Puzzle: Ordne den Hinweis der richtigen Präposition zu">
        <p style={{ margin: 0 }}>
          Lies den Mini-Hinweis und ordne ihn einem dieser Wörter zu: {matchOptions.join(", ")}.
        </p>
        <div style={{ display: "grid", gap: 12 }}>
          {matchItems.map((item, index) => {
            const selected = matchAnswers[index] || "";
            const isCorrect = selected && selected === item.answer;
            const isWrong = selected && selected !== item.answer;
            return (
              <div key={item.clue} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, display: "grid", gap: 8 }}>
                <strong>{item.clue}</strong>
                <select
                  value={selected}
                  onChange={(event) => setMatchAnswers((prev) => ({ ...prev, [index]: event.target.value }))}
                  style={{ ...styles.input, maxWidth: 280 }}
                >
                  <option value="">Choose...</option>
                  {matchOptions.map((option) => {
                    const value = option.split(" ")[0];
                    return (
                      <option key={`${item.clue}-${option}`} value={value}>
                        {option}
                      </option>
                    );
                  })}
                </select>
                {isCorrect && <span style={{ color: "#166534" }}>Correct ✅</span>}
                {isWrong && <span style={{ color: "#b91c1c" }}>Not yet. Try another preposition.</span>}
              </div>
            );
          })}
        </div>
        <p style={{ margin: 0 }}>
          Match score: {matchScore}/{matchItems.length}
        </p>
      </Section>

      <Section title="9) Tips for remembering">
        <BulletList
          items={[
            "If the verb implies movement toward a destination or a change of position, use accusative.",
            "If the verb implies no movement and the location is static, use dative.",
          ]}
        />
      </Section>
    </div>
  );
};

export default TwoCasePrepositionsPage;
