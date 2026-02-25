import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import { speakingSheetQuestions } from "../data/speakingSheet";

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
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [teil2Prompt, setTeil2Prompt] = useState(null);
  const [teil3Prompt, setTeil3Prompt] = useState(null);

  const teil2Questions = useMemo(
    () => speakingSheetQuestions.filter((item) => item.teilId === "teil-2"),
    []
  );
  const teil3Questions = useMemo(
    () => speakingSheetQuestions.filter((item) => item.teilId === "teil-3"),
    []
  );

  const formatTime = (totalSeconds) => {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const pickRandomPrompt = (items) => items[Math.floor(Math.random() * items.length)] || null;

  const drawRandomPracticeCards = () => {
    setTeil2Prompt(pickRandomPrompt(teil2Questions));
    setTeil3Prompt(pickRandomPrompt(teil3Questions));
  };

  useEffect(() => {
    drawRandomPracticeCards();
  }, []);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }
    const intervalId = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(intervalId);
          setIsRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, [isRunning]);

  const startTimer = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(60);
    }
    setIsRunning(true);
  };

  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(60);
  };

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Day 19: Goethe A1 Speaking Confidence Lab</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Chapter 5.9 — timed speaking drills + random Teil 2 and Teil 3 prompts from our speaking exam sheet.
        </p>
      </div>

      <Section title="1) Main note: see how the Goethe A1 speaking exam works">
        <p style={{ margin: 0 }}>
          Click play and watch this real Goethe-Zertifikat A1 oral exam example before you start practice.
        </p>
        <div style={{ position: "relative", paddingTop: "56.25%", borderRadius: 12, overflow: "hidden", border: "1px solid #e5e7eb" }}>
          <iframe
            title="Goethe-Zertifikat A1: Start Deutsch 1 – Sprechen"
            src="https://www.youtube.com/embed/O6m-GslH2kM"
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        <a href="https://www.youtube.com/watch?v=O6m-GslH2kM" target="_blank" rel="noreferrer">
          Open on YouTube
        </a>
      </Section>

      <Section title="2) Confidence Timer (Press Play and Speak)">
        <p style={{ margin: 0 }}>
          Most students lose marks because of confidence, not grammar. Use this one-minute timer: press play, speak
          continuously, and keep your voice calm and clear.
        </p>
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
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: 1 }}>{formatTime(secondsLeft)}</div>
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
            "Teil 1: speak about yourself for 60 seconds without stopping.",
            "Teil 2: ask one question + answer one question in full sentences.",
            "Teil 3: make one polite request and react politely.",
            "Repeat daily. Confidence comes from timed repetition.",
          ]}
        />
      </Section>

      <Section title="3) Chapter 5.9 quick language recap — erlaubt vs. verboten">
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

      <Section title="4) Goethe A1 Sprechen — Structure">
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

      <Section title="5) What to do in each Teil (simple A1 templates)">
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

      <Section title="6) Random practice cards for Teil 2 + Teil 3">
        <p style={{ margin: 0 }}>
          We now pull random prompts from the speaking question sheet (headers: Level, Teil, Topic/Prompt,
          Keyword/Subtopic). Click below and practise both cards back-to-back.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button style={styles.primaryButton} onClick={drawRandomPracticeCards}>
            Draw Random Questions
          </button>
          <a
            style={{ ...styles.secondaryButton, textDecoration: "none", display: "inline-flex", alignItems: "center" }}
            href="https://docs.google.com/spreadsheets/d/e/2PACX-1vQOBThuga7fR-PiYFEkR0zsfBanlQiRRDAQKl0FQkc--GUkZBkS4SrOz9p6R9ONTCGzSGdDmMBBiTK3/pub?output=csv"
            target="_blank"
            rel="noreferrer"
          >
            Open Published CSV
          </a>
        </div>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
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

      <Section title="7) How to practise on Falowen">
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

      <Section title="8) Pass strategy (A1 speaking) — simple rules that work">
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
