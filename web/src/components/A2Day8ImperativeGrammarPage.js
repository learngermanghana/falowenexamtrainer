import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = { ...styles.card, display: "grid", gap: 10 };
const listStyle = { margin: 0, paddingLeft: 20 };
const imageWrapStyle = {
  marginTop: 12,
  borderRadius: 14,
  overflow: "hidden",
  border: "1px solid rgba(0,0,0,0.08)",
};
const imageStyle = {
  width: "100%",
  height: 220,
  objectFit: "cover",
  display: "block",
};
const quizBoxStyle = {
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 12,
  padding: 12,
  background: "rgba(0,0,0,0.02)",
};
const answerStyle = {
  marginTop: 8,
  padding: "8px 10px",
  borderRadius: 10,
  background: "rgba(16,185,129,0.10)",
  border: "1px solid rgba(16,185,129,0.25)",
};

const SectionCard = ({ title, children }) => (
  <section style={cardStyle} aria-label={title}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const InlineCode = ({ children }) => (
  <span
    style={{
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      fontSize: "0.95em",
      padding: "2px 6px",
      borderRadius: 6,
      background: "rgba(0,0,0,0.06)",
    }}
  >
    {children}
  </span>
);

const SelfCheckItem = ({ number, question, answer }) => (
  <div style={quizBoxStyle}>
    <p style={{ margin: 0 }}>
      <strong>{number}.</strong> {question}
    </p>
    <details style={{ marginTop: 10 }}>
      <summary style={{ cursor: "pointer", fontWeight: 600 }}>Show answer</summary>
      <div style={answerStyle}>{answer}</div>
    </details>
  </div>
);

const A2Day8ImperativeGrammarPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={styles.backBtn}
          aria-label="Go back"
        >
          ← Back
        </button>

        <header style={{ marginBottom: 18 }}>
          <h1 style={{ margin: "0 0 8px" }}>A2 • 3.8 Rezepte und Essen</h1>
          <p style={{ margin: 0, opacity: 0.85 }}>
            Grammar focus: <strong>Imperativ</strong>
          </p>
          <p style={{ margin: "8px 0 0", opacity: 0.8 }}>
            This page explains the grammar and gives you a short self-check to test your understanding.
            The full assignment is on a different page.
          </p>

          <div style={imageWrapStyle}>
            <img
              src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1800&q=80"
              alt="Ingredients and cooking preparation for a recipe lesson"
              loading="lazy"
              style={imageStyle}
            />
          </div>
        </header>

        <div style={{ display: "grid", gap: 14 }}>
          <SectionCard title="1) When do we use the imperative?">
            <p style={{ margin: 0 }}>
              We use the imperative to give instructions, commands, advice, or polite requests.
            </p>
            <ul style={listStyle}>
              <li>In recipes: <strong>Schneide die Tomaten.</strong></li>
              <li>In daily life: <strong>Komm bitte pünktlich.</strong></li>
              <li>In polite requests: <strong>Warten Sie bitte einen Moment.</strong></li>
            </ul>
          </SectionCard>

          <SectionCard title="2) How to build the imperative (du, ihr, Sie)">
            <p style={{ margin: 0 }}>
              Start with the verb and then choose the correct form for the person you are speaking to.
            </p>
            <ul style={listStyle}>
              <li>
                <strong>du</strong> (one person, informal): take the <strong>du</strong>-form in Präsens and
                remove the ending <InlineCode>-st</InlineCode>.{" "}
                <InlineCode>du schneidest → Schneid(e)!</InlineCode>
              </li>
              <li>
                <strong>ihr</strong> (more than one person, informal): use the same verb as the present tense{" "}
                <strong>ihr</strong>-form. <InlineCode>ihr schneidet → Schneidet!</InlineCode>
              </li>
              <li>
                <strong>Sie</strong> (formal): infinitive + <InlineCode>Sie</InlineCode>.{" "}
                <InlineCode>schneiden → Schneiden Sie!</InlineCode>
              </li>
            </ul>
          </SectionCard>

          <SectionCard title="3) du-form: step by step">
            <p style={{ margin: 0 }}>
              For most regular verbs, build the <strong>du</strong>-imperative like this:
            </p>
            <ol style={listStyle}>
              <li>Take the infinitive: <InlineCode>machen</InlineCode></li>
              <li>Find the stem: <InlineCode>mach-</InlineCode></li>
              <li>
                Use the stem as command: <InlineCode>Mach!</InlineCode> (optional{" "}
                <InlineCode>-e</InlineCode> in some cases: <InlineCode>Mache!</InlineCode>)
              </li>
            </ol>
            <ul style={listStyle}>
              <li>
                <InlineCode>machen → Mach!</InlineCode>
              </li>
              <li>
                <InlineCode>kochen → Koch!</InlineCode>
              </li>
              <li>
                <InlineCode>schneiden → Schneid(e)!</InlineCode>
              </li>
            </ul>
          </SectionCard>

          <SectionCard title="4) Common irregular verbs and stem changes">
            <p style={{ margin: 0 }}>
              Some verbs change in the <strong>du</strong>-imperative. A good trick: look at the{" "}
              <strong>du</strong>-form first, then remove <InlineCode>-st</InlineCode>.
            </p>
            <ul style={listStyle}>
              <li>
                <InlineCode>du nimmst → Nimm!</InlineCode>
              </li>
              <li>
                <InlineCode>du gibst → Gib!</InlineCode>
              </li>
              <li>
                <InlineCode>du isst → Iss!</InlineCode>
              </li>
              <li>
                <InlineCode>du liest → Lies!</InlineCode>
              </li>
              <li>
                <InlineCode>du siehst → Sieh!</InlineCode>
              </li>
            </ul>
          </SectionCard>

          <SectionCard title="5) Practical examples (kitchen + daily life)">
            <ol style={listStyle}>
              <li>
                <strong>du</strong>: Wasch das Gemüse und schneid die Zwiebel klein.
              </li>
              <li>
                <strong>du</strong>: Nimm eine Pfanne und gib etwas Öl dazu.
              </li>
              <li>
                <strong>ihr</strong>: Wascht die Tomaten und schneidet sie in Stücke.
              </li>
              <li>
                <strong>ihr</strong>: Esst langsam und trinkt genug Wasser.
              </li>
              <li>
                <strong>Sie</strong>: Schneiden Sie das Brot bitte in dünne Scheiben.
              </li>
              <li>
                <strong>Sie</strong>: Nehmen Sie Salz und geben Sie es in die Suppe.
              </li>
            </ol>
            <p style={{ margin: 0, opacity: 0.8 }}>
              Notice: the form changes depending on whether you speak to one person informally, several
              people informally, or one / more people formally.
            </p>
          </SectionCard>

          <SectionCard title="6) Negation and polite requests">
            <ul style={listStyle}>
              <li>
                With <InlineCode>nicht</InlineCode>: <strong>Iss nicht so schnell.</strong>
              </li>
              <li>
                With <InlineCode>kein</InlineCode>: <strong>Nimm kein Fleisch.</strong>
              </li>
              <li>
                With <InlineCode>bitte</InlineCode>: <strong>Schneiden Sie bitte das Brot.</strong>
              </li>
            </ul>
          </SectionCard>

          <SectionCard title="7) Mini Grammar Self-Check">
            <p style={{ margin: 0 }}>
              This is not the full assignment. It is only a short check to test whether you understood the
              grammar on this page.
            </p>

            <div style={{ display: "grid", gap: 12 }}>
              <SelfCheckItem
                number="1"
                question={
                  <>
                    Make the <strong>du</strong>-imperative of <InlineCode>schneiden</InlineCode>.
                  </>
                }
                answer={
                  <>
                    <strong>Schneid(e)!</strong>
                  </>
                }
              />

              <SelfCheckItem
                number="2"
                question={
                  <>
                    Make the <strong>ihr</strong>-imperative of <InlineCode>nehmen</InlineCode>.
                  </>
                }
                answer={
                  <>
                    <strong>Nehmt!</strong>
                  </>
                }
              />

              <SelfCheckItem
                number="3"
                question={
                  <>
                    Make the <strong>Sie</strong>-imperative of <InlineCode>geben</InlineCode>.
                  </>
                }
                answer={
                  <>
                    <strong>Geben Sie!</strong>
                  </>
                }
              />

              <SelfCheckItem
                number="4"
                question={
                  <>
                    Which sentence is correct?
                    <div style={{ marginTop: 8 }}>
                      a) Schneid ihr die Zwiebel.
                      <br />
                      b) Schneidet die Zwiebel.
                      <br />
                      c) Schneiden die Zwiebel Sie.
                    </div>
                  </>
                }
                answer={
                  <>
                    <strong>b) Schneidet die Zwiebel.</strong>
                  </>
                }
              />

              <SelfCheckItem
                number="5"
                question={
                  <>
                    Complete the sentence with <InlineCode>nicht</InlineCode> or{" "}
                    <InlineCode>kein</InlineCode>: <strong>Nimm ______ Fleisch.</strong>
                  </>
                }
                answer={
                  <>
                    <strong>kein</strong>
                  </>
                }
              />

              <SelfCheckItem
                number="6"
                question={
                  <>
                    Which verb is irregular in the <strong>du</strong>-imperative?
                    <div style={{ marginTop: 8 }}>
                      a) kochen
                      <br />
                      b) machen
                      <br />
                      c) essen
                    </div>
                  </>
                }
                answer={
                  <>
                    <strong>c) essen → Iss!</strong>
                  </>
                }
              />
            </div>
          </SectionCard>

          <SectionCard title="8) What should you remember?">
            <ul style={listStyle}>
              <li>The imperative is used for instructions and commands.</li>
              <li>
                <strong>du</strong> usually uses the stem.
              </li>
              <li>
                <strong>ihr</strong> looks like the normal <InlineCode>ihr</InlineCode> present form.
              </li>
              <li>
                <strong>Sie</strong> uses infinitive + <InlineCode>Sie</InlineCode>.
              </li>
              <li>Some verbs are irregular: Nimm, Gib, Iss, Lies.</li>
            </ul>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default A2Day8ImperativeGrammarPage;
