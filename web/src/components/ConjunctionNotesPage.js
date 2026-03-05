import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const Section = ({ title, children }) => (
  <div style={{ ...styles.card, display: "grid", gap: 12 }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </div>
);

const BulletList = ({ items }) => (
  <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

const Callout = ({ children }) => (
  <div
    style={{
      background: "#f4f6ff",
      borderLeft: "4px solid #5666f4",
      borderRadius: 10,
      padding: "10px 12px",
      fontSize: 14,
      display: "grid",
      gap: 4,
    }}
  >
    {children}
  </div>
);

const MiniExample = ({ title, prompt, example }) => (
  <div
    style={{
      border: "1px solid #e6e8ef",
      borderRadius: 12,
      padding: 12,
      display: "grid",
      gap: 6,
      background: "#fbfbfd",
    }}
  >
    <strong>{title}</strong>
    <span style={{ color: "#4f5565" }}>{prompt}</span>
    <span>
      <em>Example:</em> {example}
    </span>
  </div>
);

const ConjunctionNotesPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Conjunctions in A1 German Letters</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Use these notes to connect sentences clearly and politely when writing letters.
        </p>
      </div>

      <Section title="Key Takeaways">
        <BulletList
          items={[
            "Denn joins two main clauses and keeps the verb order the same.",
            "Weil sends the conjugated verb to the end of the clause.",
            "Deshalb starts a new clause, so the verb comes right after it.",
            "Use these structures to build clear, exam-ready sentences in letters and messages.",
          ]}
        />
      </Section>

      <Section title="Introduction to Conjunctions">
        <p style={{ margin: 0 }}>
          Conjunctions connect clauses or sentences to make your writing clearer, more coherent, and smoother to read.
          In A1 German, common conjunctions for letters include <em>denn</em>, <em>weil</em>, and <em>deshalb</em>.
        </p>
      </Section>

      <Section title="Conjunctions and Their Usage">
        <h3 style={{ margin: 0 }}>1. Denn (because)</h3>
        <Callout>
          <strong>Word order:</strong> Verb stays in position 2 → <em>denn</em> does not change word order.
        </Callout>
        <BulletList
          items={[
            "Rule → Coordinating conjunction; verb order stays the same.",
            "Structure → Main clause + , denn + subject + verb + ...",
            "Example → Ich schreibe dir, denn ich habe gute Nachrichten.",
          ]}
        />

        <h3 style={{ margin: 0 }}>2. Weil (because)</h3>
        <Callout>
          <strong>Word order:</strong> <em>weil</em> → conjugated verb goes to the end.
        </Callout>
        <BulletList
          items={[
            "Rule → Subordinating conjunction; the conjugated verb moves to the end.",
            "Structure → Main clause + , weil + subject + ... + verb.",
            "Example → Ich schreibe dir, weil ich gute Nachrichten habe.",
            "Example with modal → Ich gehe nach Hause, weil ich schlafen möchte.",
          ]}
        />

        <h3 style={{ margin: 0 }}>3. Deshalb (therefore)</h3>
        <Callout>
          <strong>Word order:</strong> <em>deshalb</em> starts a new clause → verb comes right after it.
        </Callout>
        <BulletList
          items={[
            "Rule → Adverbial conjunction; verb follows immediately after deshalb.",
            "Structure → Main clause + , deshalb + verb + subject + ...",
            "Example → Ich habe gute Nachrichten, deshalb schreibe ich dir.",
          ]}
        />
      </Section>

      <Section title="Quick Comparison: denn, weil, deshalb">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Conjunction", "Type", "Word order", "Example"].map((header) => (
                  <th
                    key={header}
                    style={{
                      textAlign: "left",
                      padding: "8px 10px",
                      borderBottom: "2px solid #e6e8ef",
                      background: "#f7f8fb",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: "denn",
                  type: "Coordinating conjunction",
                  order: "Verb stays in position 2",
                  example: "Ich gehe nicht ins Kino, denn ich habe keine Zeit.",
                },
                {
                  name: "weil",
                  type: "Subordinating conjunction",
                  order: "Conjugated verb goes to the end",
                  example: "Ich gehe nicht ins Kino, weil ich keine Zeit habe.",
                },
                {
                  name: "deshalb",
                  type: "Adverbial conjunction",
                  order: "Verb comes right after deshalb",
                  example: "Ich habe keine Zeit, deshalb gehe ich nicht ins Kino.",
                },
              ].map((row) => (
                <tr key={row.name}>
                  {[row.name, row.type, row.order, row.example].map((cell) => (
                    <td key={cell} style={{ padding: "8px 10px", borderBottom: "1px solid #e6e8ef" }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Practice Exercise: Rearrange Using Conjunctions">
        <h3 style={{ margin: 0 }}>1. Denn (because)</h3>
        <div style={{ display: "grid", gap: 10 }}>
          <div>
            <h4 style={{ margin: "4px 0" }}>A1 core</h4>
            <BulletList
              items={[
                "Ich kann nicht kommen. Ich bin krank.",
                "Wir gehen heute ins Kino. Es gibt einen neuen Film.",
              ]}
            />
          </div>
          <div>
            <h4 style={{ margin: "4px 0" }}>A1+</h4>
            <BulletList items={["Sie bleibt zu Hause. Sie hat viel zu tun."]} />
          </div>
        </div>

        <h3 style={{ margin: 0 }}>2. Weil (because)</h3>
        <div style={{ display: "grid", gap: 10 }}>
          <div>
            <h4 style={{ margin: "4px 0" }}>A1 core</h4>
            <BulletList
              items={[
                "Ich bleibe zu Hause. Ich bin müde.",
                "Er kommt später. Er muss noch arbeiten.",
              ]}
            />
          </div>
          <div>
            <h4 style={{ margin: "4px 0" }}>A1+</h4>
            <BulletList items={["Wir fahren nach Berlin. Wir wollen dort Freunde besuchen."]} />
          </div>
        </div>

        <h3 style={{ margin: 0 }}>3. Deshalb (therefore)</h3>
        <div style={{ display: "grid", gap: 10 }}>
          <div>
            <h4 style={{ margin: "4px 0" }}>A1 core</h4>
            <BulletList
              items={[
                "Es regnet. Wir bleiben drinnen.",
                "Sie ist sehr beschäftigt. Sie kann nicht kommen.",
              ]}
            />
          </div>
          <div>
            <h4 style={{ margin: "4px 0" }}>A1+</h4>
            <BulletList items={["Ich habe die Prüfung bestanden. Ich bin sehr glücklich."]} />
          </div>
        </div>

      </Section>

      <Section title="Solutions">
        <details style={{ display: "grid", gap: 12 }}>
          <summary style={{ cursor: "pointer", fontWeight: 600 }}>Reveal solutions</summary>
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ display: "grid", gap: 8 }}>
              <h3 style={{ margin: 0 }}>1. Denn (because)</h3>
              <BulletList
                items={[
                  "Ich kann nicht kommen, denn ich bin krank.",
                  "Wir gehen heute ins Kino, denn es gibt einen neuen Film.",
                  "Sie bleibt zu Hause, denn sie hat viel zu tun.",
                ]}
              />
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <h3 style={{ margin: 0 }}>2. Weil (because)</h3>
              <BulletList
                items={[
                  "Ich bleibe zu Hause, weil ich müde bin.",
                  "Er kommt später, weil er noch arbeiten muss.",
                  "Wir fahren nach Berlin, weil wir dort Freunde besuchen wollen.",
                ]}
              />
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <h3 style={{ margin: 0 }}>3. Deshalb (therefore)</h3>
              <BulletList
                items={[
                  "Es regnet, deshalb bleiben wir drinnen.",
                  "Sie ist sehr beschäftigt, deshalb kann sie nicht kommen.",
                  "Ich habe die Prüfung bestanden, deshalb bin ich sehr glücklich.",
                ]}
              />
            </div>
          </div>
        </details>
      </Section>

      <Section title="Final Revision: Sentence Formulation Check">
        <p style={{ margin: 0 }}>
          Before your exam, test yourself by building complete sentences correctly. Focus on meaning, punctuation,
          and word order.
        </p>
        <div style={{ display: "grid", gap: 10 }}>
          <MiniExample
            title="1) Statement"
            prompt="Prompt: Say that you live in Berlin."
            example="Ich wohne in Berlin."
          />
          <MiniExample
            title="2) Modal verb statement"
            prompt="Prompt: Say that you want to learn German today."
            example="Ich möchte heute Deutsch lernen."
          />
          <MiniExample
            title="3) W-question"
            prompt="Prompt: Ask where the language school is."
            example="Wo ist die Sprachschule?"
          />
          <MiniExample
            title="4) Yes/No question"
            prompt="Prompt: Ask if your friend is coming tomorrow."
            example="Kommst du morgen?"
          />
          <MiniExample
            title="5) Weil sentence"
            prompt="Prompt: Explain that you are staying home because you are tired."
            example="Ich bleibe zu Hause, weil ich müde bin."
          />
          <MiniExample
            title="6) Grammar mixed check"
            prompt="Prompt: Write one sentence each with correct capitalization, verb position, and punctuation."
            example="Heute lerne ich Deutsch. Danach schreibe ich eine E-Mail an meinen Lehrer."
          />
        </div>
        <Callout>
          <strong>Exam path guidance:</strong>
          <BulletList
            items={[
              "If you are preparing for A1 exams, go to the exam room and make a clear preparation plan with daily sentence practice.",
              "If you are preparing for A2 exams, review letter-writing concepts and important grammar points to keep progressing.",
              "Wishing you success in your German learning journey — keep going!",
            ]}
          />
        </Callout>
      </Section>
    </div>
  );
};

export default ConjunctionNotesPage;
