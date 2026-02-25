import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import { speakingSheetQuestions } from "../data/speakingSheet";

const FALOWEN_SPEAKING_URL =
  "https://script.google.com/macros/s/AKfycbyJ5lTeXUgaGw-rejDuh_2ex7El_28JgKLurOOsO1c8LWfVE-Em2-vuWuMn1hC5-_IN/exec";

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
      <li
        key={item}
        style={{ display: "grid", gridTemplateColumns: "18px 1fr", gap: 8 }}
      >
        <span>✅</span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const VerbotenErlaubtPage = () => {
  const navigate = useNavigate();

  // Timer state
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);

  // Random practice cards state
  const [teil2Prompt, setTeil2Prompt] = useState(null);
  const [teil3Prompt, setTeil3Prompt] = useState(null);

  // ✅ Show Falowen next-step callout after timer ends
  const [showFalowenNextStep, setShowFalowenNextStep] = useState(false);

  // ✅ ONLY A1 (no A2, no B levels)
  const a1Only = useMemo(() => {
    return speakingSheetQuestions.filter(
      (item) => String(item.level || "").toUpperCase().trim() === "A1"
    );
  }, []);

  const teil2Questions = useMemo(() => {
    return a1Only.filter((item) => item.teilId === "teil-2");
  }, [a1Only]);

  const teil3Questions = useMemo(() => {
    return a1Only.filter((item) => item.teilId === "teil-3");
  }, [a1Only]);

  const formatTime = (totalSeconds) => {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const pickRandomPrompt = (items) =>
    items[Math.floor(Math.random() * items.length)] || null;

  const drawRandomPracticeCards = useCallback(() => {
    setTeil2Prompt(pickRandomPrompt(teil2Questions));
    setTeil3Prompt(pickRandomPrompt(teil3Questions));
    // When they draw new cards, hide next-step until they finish the next round
    setShowFalowenNextStep(false);
  }, [teil2Questions, teil3Questions]);

  useEffect(() => {
    drawRandomPracticeCards();
  }, [drawRandomPracticeCards]);

  useEffect(() => {
    if (!isRunning) return undefined;

    const intervalId = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(intervalId);
          setIsRunning(false);
          // ✅ Timer finished → show Falowen next step
          setShowFalowenNextStep(true);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isRunning]);

  const startTimer = () => {
    // Starting a new timed round hides the next-step callout (until time ends)
    setShowFalowenNextStep(false);
    if (secondsLeft === 0) setSecondsLeft(60);
    setIsRunning(true);
  };

  const pauseTimer = () => setIsRunning(false);

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(60);
    setShowFalowenNextStep(false);
  };

  const openSpeakingPractice = () => {
    window.open(FALOWEN_SPEAKING_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button
          style={{ ...styles.secondaryButton, width: "fit-content" }}
          onClick={() => navigate("/campus/course")}
        >
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          Day 19: Goethe A1 Speaking Confidence Lab
        </h1>

        <p style={{ ...styles.subtitle, margin: 0 }}>
          Chapter 5.9 — random Teil 2 & Teil 3 cards + timed confidence drill.
        </p>

        <a
          href="https://www.youtube.com/watch?v=O6m-GslH2kM"
          target="_blank"
          rel="noreferrer"
        >
          Watch: Goethe-Zertifikat A1 Start Deutsch 1 – Sprechen (oral exam)
        </a>
      </div>

      <Section title="2) Chapter 5.9 quick language recap — erlaubt vs. verboten">
        <Callout>
          <strong>Meaning</strong>
          <BulletList
            items={[
              "erlaubt = allowed / permitted",
              "verboten = forbidden / not allowed",
            ]}
          />
        </Callout>

        <h3 style={{ margin: "8px 0 0" }}>The easiest A1 sentences</h3>
        <BulletList
          items={[
            "Das ist erlaubt. (That is allowed.)",
            "Das ist nicht erlaubt. (That is not allowed.)",
            "Das ist verboten. (That is forbidden.)",
          ]}
        />

        <h3 style={{ margin: "8px 0 0" }}>
          Questions you can use in the exam center / exam hall
        </h3>
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
          <p style={{ margin: 0 }}>
            A typical card/sign is <em>nicht rauchen!</em> (no smoking).
          </p>
          <BulletList
            items={[
              "Rauchen ist hier verboten.",
              "Rauchen ist hier nicht erlaubt.",
              "Bitte rauchen Sie nicht.",
            ]}
          />
        </Callout>
      </Section>

      <Section title="3) Goethe A1 Sprechen — Structure">
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
            During the real exam, aids like dictionaries or mobile phones are{" "}
            <strong>not allowed</strong>.
          </p>
        </Callout>
      </Section>

      <Section title="4) What to do in each Teil (simple A1 templates)">
        <h3 style={{ margin: 0 }}>
          Teil 1 — Introduce yourself (short + clear)
        </h3>
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
        <BulletList
          items={[
            "Wo …? / Wann …? / Was …? / Wie …?",
            "Haben Sie …? / Essen Sie …? / Kaufen Sie …?",
          ]}
        />
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

      {/* ✅ Random cards first */}
      <Section title="5) Random practice cards for Teil 2 + Teil 3">
        <p style={{ margin: 0 }}>
          We pull random <strong>A1 only</strong> prompts from the speaking question sheet.
          Practise both cards back-to-back.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button style={styles.primaryButton} onClick={drawRandomPracticeCards}>
            Draw Random Questions
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}
        >
          <Callout>
            <strong>Teil 2 prompt</strong>
            <p style={{ margin: 0 }}>{teil2Prompt?.text || "No prompt available yet."}</p>
            <p style={{ margin: 0, color: "#0f172a" }}>{teil2Prompt?.hint || ""}</p>
          </Callout>

          <Callout>
            <strong>Teil 3 prompt</strong>
            <p style={{ margin: 0 }}>{teil3Prompt?.text || "No prompt available yet."}</p>
            <p style={{ margin: 0, color: "#0f172a" }}>{teil3Prompt?.hint || ""}</p>
          </Callout>
        </div>
      </Section>

      {/* ✅ Timer AFTER random cards and connected to them */}
      <Section title="6) Confidence Timer (Press Play and Speak)">
        <p style={{ margin: 0 }}>
          Use the <strong>cards you just drew above</strong>. Press play and speak continuously for 60 seconds,
          calm and clear.
        </p>

        <Callout>
          <strong>How to use it (connect it to the cards)</strong>
          <BulletList
            items={[
              "Look at the Teil 2 card: ask ONE full question + answer it.",
              "Look at the Teil 3 card: make ONE polite request + react politely.",
              "Repeat smoothly without stopping until the timer ends.",
            ]}
          />
        </Callout>

        <div
          style={{
            border: "1px solid #dbeafe",
            borderRadius: 12,
            background: "#eff6ff",
            padding: 16,
            display: "grid",
            gap: 12,
            justifyItems: "center",
          }}
        >
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: 1 }}>
            {formatTime(secondsLeft)}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            <button style={styles.primaryButton} onClick={startTimer} disabled={isRunning}>
              ▶️ Play
            </button>
            <button style={styles.secondaryButton} onClick={pauseTimer} disabled={!isRunning}>
              ⏸ Pause
            </button>
            <button style={styles.secondaryButton} onClick={resetTimer}>
              ↺ Reset
            </button>
          </div>
        </div>

        <Checklist
          items={[
            "Teil 1: speak about yourself for 60 seconds without stopping (optional warm-up).",
            "Teil 2: ask one question + answer one question in full sentences (use the drawn card).",
            "Teil 3: make one polite request and react politely (use the drawn card).",
            "Repeat daily. Confidence comes from timed repetition.",
          ]}
        />

        {/* ✅ Appears ONLY after timer ends */}
        {showFalowenNextStep && (
          <Callout>
            <strong>✅ Time! Next step (real exam mode)</strong>
            <BulletList
              items={[
                "Open Falowen",
                "Enter your Student Code",
                "Do 1 real prompt (Teil 2 or Teil 3)",
                "Click “Ask & AI” for marking and feedback",
              ]}
            />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <button style={styles.primaryButton} onClick={openSpeakingPractice}>
                Open Falowen Practice
              </button>
            </div>
          </Callout>
        )}
      </Section>

      <Section title="7) Pass strategy (A1 speaking) — simple rules that work">
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
