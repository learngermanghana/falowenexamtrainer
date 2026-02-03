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

const Callout = ({ children }) => (
  <div
    style={{
      background: "#f0f9ff",
      borderLeft: "4px solid #38bdf8",
      borderRadius: 10,
      padding: "10px 12px",
      fontSize: 14,
      display: "grid",
      gap: 6,
    }}
  >
    {children}
  </div>
);

const Checklist = ({ items }) => (
  <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
    {items.map((item) => (
      <li key={item} style={{ display: "grid", gridTemplateColumns: "18px 1fr", gap: 8 }}>
        <span>✅</span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const VerbotenErlaubtPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Day 19: Verboten & Erlaubt (A1 Workbook Notes)</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Chapter 5.9 — Erlaubt & Verboten + How to practice and pass Goethe-Zertifikat A1 Sprechen.
        </p>
      </div>

      <Section title="1) Chapter 5.9 — Erlaubt vs. Verboten">
        <Callout>
          <strong>Meaning</strong>
          <BulletList items={["erlaubt = allowed / permitted", "verboten = forbidden / not allowed"]} />
        </Callout>
        <h3 style={{ margin: "8px 0 0" }}>The easiest A1 sentences</h3>
        <BulletList
          items={[
            "Das ist erlaubt. (That is allowed.)",
            "Das ist nicht erlaubt. (That is not allowed.)",
            "Das ist verboten. (That is forbidden.)",
          ]}
        />
        <h3 style={{ margin: "8px 0 0" }}>Questions you can use in the exam center / exam hall</h3>
        <BulletList
          items={[
            "Ist das erlaubt? (Is that allowed?)",
            "Ist das verboten? (Is that forbidden?)",
            "Darf ich hier …? (Am I allowed to … here?)",
            "Darf ich hier sitzen?",
            "Darf ich hier mein Handy benutzen?",
            "Darf ich hier essen oder trinken?",
          ]}
        />
        <Callout>
          <strong>Very common sign</strong>
          <p style={{ margin: 0 }}>A typical card/sign is <em>nicht rauchen!</em> (no smoking).</p>
          <BulletList
            items={[
              "Rauchen ist hier verboten.",
              "Rauchen ist hier nicht erlaubt.",
              "Bitte rauchen Sie nicht.",
            ]}
          />
        </Callout>
      </Section>

      <Section title="2) Goethe A1 Sprechen — Structure">
        <BulletList
          items={[
            "Prüfungszeit: 15 Minuten",
            "3 Teile",
            "You speak in a group",
            "Each part is about 5 minutes",
          ]}
        />
        <h3 style={{ margin: "8px 0 0" }}>The 3 parts</h3>
        <BulletList
          items={[
            "Teil 1: Sich vorstellen (introduce yourself)",
            "Teil 2: Um Informationen bitten und Informationen geben (ask & answer questions)",
            "Teil 3: Bitte formulieren und darauf reagieren (make requests + respond)",
          ]}
        />
        <Callout>
          <strong>Important exam hall rule</strong>
          <p style={{ margin: 0 }}>
            During the real exam, aids like dictionaries or mobile phones are <strong>not allowed</strong>.
          </p>
        </Callout>
      </Section>

      <Section title="3) What to do in each Teil (simple A1 templates)">
        <h3 style={{ margin: 0 }}>Teil 1 — Introduce yourself (short + clear)</h3>
        <BulletList
          items={[
            "Ich heiße …",
            "Ich bin … Jahre alt.",
            "Ich komme aus …",
            "Ich wohne in …",
            "Ich spreche …",
            "Ich bin … (Beruf).",
            "Mein Hobby ist …",
          ]}
        />
        <h3 style={{ margin: "8px 0 0" }}>Teil 2 — Ask & answer questions</h3>
        <BulletList items={["Wo …? / Wann …? / Was …? / Wie …?", "Haben Sie …? / Essen Sie …? / Kaufen Sie …?"]} />
        <p style={{ margin: 0 }}>Then answer with a simple full sentence.</p>
        <h3 style={{ margin: "8px 0 0" }}>Teil 3 — Requests + reactions</h3>
        <Callout>
          <strong>Make a request (choose one)</strong>
          <BulletList items={["Können Sie bitte + Infinitiv …?", "Verb + Sie bitte."]} />
        </Callout>
        <Callout>
          <strong>React (accept or refuse politely)</strong>
          <BulletList
            items={[
              "Accept: Ja, gern. / Ja, natürlich. / Kein Problem.",
              "Refuse: Tut mir leid, das geht leider nicht. / Leider kann ich nicht.",
            ]}
          />
        </Callout>
      </Section>

      <Section title="4) How to practise on Falowen">
        <p style={{ margin: 0 }}>
          Open the speaking practice link and use your checklist exactly like exam training:
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button
            style={styles.primaryButton}
            onClick={() =>
              window.open(
                "https://script.google.com/macros/s/AKfycbyJ5lTeXUgaGw-rejDuh_2ex7El_28JgKLurOOsO1c8LWfVE-Em2-vuWuMn1hC5-_IN/exec",
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            Open Goethe Speaking Exams
          </button>
        </div>
        <Checklist
          items={[
            "Click Open Goethe Speaking Exams and enter your Student Code.",
            "Go to Question tab and choose: Teil 1 / Teil 2 / Teil 3.",
            "Read the description carefully before you start.",
            "Click Start Recording, then ask/answer yourself (like a real exam).",
            "Click Ask & AI for marking, feedback, and results.",
            "Optional: tick the checkbox to use the AI as your speaking partner.",
            "Tip: do Teil 3 daily — it builds fast confidence.",
          ]}
        />
      </Section>

      <Section title="5) Pass strategy (A1 speaking) — simple rules that work">
        <h3 style={{ margin: 0 }}>✅ What examiners love</h3>
        <BulletList
          items={[
            "Short, correct sentences (not long grammar)",
            "Clear pronunciation",
            "Polite reactions (yes/no politely)",
            "You speak actively (don’t stay silent)",
          ]}
        />
        <h3 style={{ margin: "8px 0 0" }}>✅ Common mistakes to avoid</h3>
        <BulletList
          items={[
            "Forgetting to react in Teil 3 (you MUST answer your partner)",
            "Using only one word (try to use a full mini sentence)",
            "Speaking too fast (slow = clearer = better)",
          ]}
        />
        <Callout>
          <strong>Mini final checklist (before the exam)</strong>
          <Checklist
            items={[
              "I can introduce myself (Teil 1).",
              "I can ask 2–3 questions and answer (Teil 2).",
              "I can make a request + react politely (Teil 3).",
              "I know: Handy/Wörterbuch = nicht erlaubt.",
              "I can use erlaubt / nicht erlaubt / verboten in simple sentences.",
            ]}
          />
        </Callout>
      </Section>
    </div>
  );
};

export default VerbotenErlaubtPage;
