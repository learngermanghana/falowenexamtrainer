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

          <SectionCard title="2) Main imperative forms">
            <ul style={listStyle}>
              <li>
                <strong>du</strong>: usually verb stem only →{" "}
                <InlineCode>Schneid die Tomaten.</InlineCode>
              </li>
              <li>
                <strong>ihr</strong>: same as present tense with <InlineCode>ihr</InlineCode> →{" "}
                <InlineCode>Schneidet die Tomaten.</InlineCode>
              </li>
              <li>
                <strong>Sie</strong>: infinitive + <InlineCode>Sie</InlineCode> →{" "}
                <InlineCode>Schneiden Sie die Tomaten.</InlineCode>
              </li>
            </ul>
          </SectionCard>

          <SectionCard title="3) Important rule for the du-form">
            <p style={{ margin: 0 }}>
              The <strong>du</strong>-imperative is usually made with the verb stem. Often the final{" "}
              <InlineCode>-e</InlineCode> is dropped in everyday German.
            </p>
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

          <SectionCard title="4) Common irregular verbs">
            <p style={{ margin: 0 }}>
              Some verbs change in the <strong>du</strong>-imperative.
            </p>
            <ul style={listStyle}>
              <li>
                <InlineCode>nehmen → Nimm!</InlineCode>
              </li>
              <li>
                <InlineCode>geben → Gib!</InlineCode>
              </li>
              <li>
                <InlineCode>essen → Iss!</InlineCode>
              </li>
              <li>
                <InlineCode>lesen → Lies!</InlineCode>
              </li>
              <li>
                <InlineCode>sehen → Sieh!</InlineCode>
              </li>
            </ul>
          </SectionCard>

          <SectionCard title="5) Imperative in recipes">
            <ol style={listStyle}>
              <li>
                <strong>du</strong>: Wasch das Gemüse.
              </li>
              <li>
                <strong>du</strong>: Schneide die Zwiebel klein.
              </li>
              <li>
                <strong>ihr</strong>: Erhitzt das Öl in der Pfanne.
              </li>
              <li>
                <strong>Sie</strong>: Geben Sie Salz und Pfeffer dazu.
              </li>
              <li>
                <strong>du</strong>: Serviere das Essen warm.
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
