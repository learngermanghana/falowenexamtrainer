import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import { speakingQuestionDictionary } from "../data/speakingDictionary";

const FALOWEN_SPEAKING_URL = "https://www.falowen.app/exams/speaking";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80";

const TIMER_OPTIONS = [30, 60, 90];

const row = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
};

const grid = {
  display: "grid",
  gap: 12,
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
};

const section = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const heroCard = {
  ...styles.card,
  padding: 0,
  overflow: "hidden",
};

const heroWrap = {
  position: "relative",
  minHeight: 340,
  display: "grid",
  alignItems: "end",
};

const heroImage = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const heroOverlay = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(180deg, rgba(15,23,42,0.18) 0%, rgba(15,23,42,0.85) 100%)",
};

const heroContent = {
  position: "relative",
  zIndex: 2,
  color: "#fff",
  padding: 22,
  display: "grid",
  gap: 12,
};

const heroBadge = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  width: "fit-content",
  padding: "6px 12px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.16)",
  border: "1px solid rgba(255,255,255,0.24)",
  fontSize: 13,
  fontWeight: 700,
  backdropFilter: "blur(4px)",
};

const heroSoftPanel = {
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: 14,
  padding: 14,
  display: "grid",
  gap: 8,
  backdropFilter: "blur(6px)",
};

const timerBox = {
  border: "1px solid #dbeafe",
  borderRadius: 12,
  background: "#eff6ff",
  padding: 16,
  display: "grid",
  gap: 12,
  justifyItems: "center",
};

const chipBase = {
  padding: "8px 12px",
  borderRadius: 999,
  border: "1px solid #cbd5e1",
  minHeight: 40,
  cursor: "pointer",
  fontWeight: 600,
};

const flowWrap = {
  display: "grid",
  gap: 10,
};

const flowGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: 10,
};

const stepCard = (active) => ({
  borderRadius: 14,
  padding: "12px 14px",
  border: active ? "1px solid #2563eb" : "1px solid #e5e7eb",
  background: active ? "#eff6ff" : "#ffffff",
  display: "grid",
  gap: 4,
});

const formatTime = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
    2,
    "0"
  )}`;

const normalize = (v) => String(v || "").trim();

const topic = (p) => normalize(p?.text || p?.topic || p?.thema);
const keyword = (p) => normalize(p?.hint || p?.keyword || p?.stichwort);

const promptId = (p, prefix = "prompt") =>
  p?.id || p?.questionId || `${prefix}-${topic(p)}-${keyword(p)}`;

const randomPrompt = (list, previous = null, prefix = "prompt") => {
  if (!Array.isArray(list) || list.length === 0) return null;
  if (list.length === 1) return list[0];

  const prevId = previous ? promptId(previous, prefix) : null;
  const filtered = prevId
    ? list.filter((item) => promptId(item, prefix) !== prevId)
    : list;

  const pool = filtered.length ? filtered : list;
  return pool[Math.floor(Math.random() * pool.length)] || null;
};

const playBell = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sine";
    osc2.type = "sine";
    osc1.frequency.setValueAtTime(880, now);
    osc2.frequency.setValueAtTime(1320, now + 0.02);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now + 0.02);
    osc1.stop(now + 0.45);
    osc2.stop(now + 0.48);
  } catch {
    // ignore audio restrictions
  }
};

const buildTeil2Model = (prompt) => {
  const word = keyword(prompt);
  if (!word) {
    return {
      question: "Frage: Hast du ...?",
      answer: "Antwort: Ja, ich habe ... .",
    };
  }

  return {
    question: `Frage: ${word} ...?`,
    answer: `Antwort: Ja, ich ${word} ... .`,
  };
};

const buildTeil3Model = (prompt) => {
  const word = keyword(prompt);
  return {
    request: `Bitte: Können Sie bitte ${word || "..."}?`,
    reaction: "Reaktion: Ja, gern. / Tut mir leid, das geht leider nicht.",
  };
};

const Section = ({ title, children }) => (
  <section style={section}>
    <div style={{ display: "grid", gap: 8 }}>
      <h2 style={{ margin: 0 }}>{title}</h2>
      <div
        aria-hidden="true"
        style={{
          width: 72,
          height: 3,
          borderRadius: 999,
          background: "linear-gradient(90deg, #2563eb, #7c3aed)",
        }}
      />
    </div>
    {children}
  </section>
);

const BulletList = ({ items }) => (
  <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
    {items.map((t, i) => (
      <li key={`${t}-${i}`}>{t}</li>
    ))}
  </ul>
);

const Callout = ({ children, ariaLive }) => (
  <div
    aria-live={ariaLive}
    style={{
      background: "#f0f9ff",
      borderLeft: "4px solid #38bdf8",
      padding: 12,
      borderRadius: 10,
      display: "grid",
      gap: 6,
    }}
  >
    {children}
  </div>
);

const Checklist = ({ items }) => (
  <ul
    style={{
      margin: 0,
      paddingLeft: 0,
      listStyle: "none",
      display: "grid",
      gap: 6,
    }}
  >
    {items.map((item, index) => (
      <li
        key={`${item}-${index}`}
        style={{ display: "grid", gridTemplateColumns: "18px 1fr", gap: 8 }}
      >
        <span aria-hidden="true">✅</span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const PrimaryCTA = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{ ...styles.primaryButton, minHeight: 44, width: "fit-content" }}
  >
    {label}
  </button>
);

const SecondaryCTA = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{ ...styles.secondaryButton, minHeight: 44, width: "fit-content" }}
  >
    {label}
  </button>
);

const PromptCard = ({ title, prompt, kind }) => {
  const teil2Model = buildTeil2Model(prompt);
  const teil3Model = buildTeil3Model(prompt);

  return (
    <Callout ariaLive="polite">
      <strong>{title}</strong>
      <p style={{ margin: 0 }}>
        <strong>Thema:</strong> {topic(prompt) || "—"}
      </p>
      <p style={{ margin: 0 }}>
        <strong>Stichwort:</strong> {keyword(prompt) || "—"}
      </p>

      {(topic(prompt) || keyword(prompt)) && (
        <div
          style={{
            display: "grid",
            gap: 6,
            marginTop: 4,
            padding: 10,
            borderRadius: 10,
            background: "#ffffff",
            border: "1px solid #dbeafe",
          }}
        >
          <strong>Model pattern</strong>

          {kind === "teil-2" ? (
            <>
              <p style={{ margin: 0 }}>{teil2Model.question}</p>
              <p style={{ margin: 0 }}>{teil2Model.answer}</p>
            </>
          ) : (
            <>
              <p style={{ margin: 0 }}>{teil3Model.request}</p>
              <p style={{ margin: 0 }}>{teil3Model.reaction}</p>
            </>
          )}
        </div>
      )}
    </Callout>
  );
};

const TimerSelector = ({ selectedSeconds, onSelect, disabled }) => (
  <div style={{ ...row, justifyContent: "center" }}>
    {TIMER_OPTIONS.map((value) => {
      const active = selectedSeconds === value;

      return (
        <button
          key={value}
          type="button"
          onClick={() => onSelect(value)}
          disabled={disabled}
          style={{
            ...chipBase,
            background: active ? "#2563eb" : "#ffffff",
            color: active ? "#ffffff" : "#1e293b",
            borderColor: active ? "#2563eb" : "#cbd5e1",
            opacity: disabled ? 0.75 : 1,
          }}
        >
          {value}s
        </button>
      );
    })}
  </div>
);

const LearningFlow = ({ activeStep = 2 }) => {
  const steps = [
    { id: 1, title: "Recap", subtitle: "allowed vs forbidden" },
    { id: 2, title: "Random Prompts", subtitle: "draw speaking cards" },
    { id: 3, title: "Timed Practice", subtitle: "30s / 60s / 90s" },
    { id: 4, title: "Real Exam Mode", subtitle: "open Falowen" },
  ];

  return (
    <div style={flowWrap}>
      <strong style={{ fontSize: 15 }}>Today’s speaking flow</strong>
      <div style={flowGrid}>
        {steps.map((step) => {
          const active = step.id === activeStep;
          const done = step.id < activeStep;

          return (
            <div key={step.id} style={stepCard(active)}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 700,
                    fontSize: 13,
                    background: done ? "#16a34a" : active ? "#2563eb" : "#e5e7eb",
                    color: done || active ? "#fff" : "#334155",
                  }}
                >
                  {done ? "✓" : step.id}
                </div>
                <strong style={{ fontSize: 14 }}>{step.title}</strong>
              </div>

              <p style={{ margin: 0, fontSize: 13, color: "#475569" }}>
                {step.subtitle}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SpeakingAppCTA = ({ title, description, onOpen }) => (
  <div style={{ ...styles.card, display: "grid", gap: 10 }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    <p style={{ margin: 0 }}>{description}</p>
    <div style={row}>
      <PrimaryCTA label="Open Goethe Exams Page" onClick={onOpen} />
      <SecondaryCTA label="Open in New Tab" onClick={onOpen} />
    </div>
  </div>
);

const GoetheA1SpeakingConfidenceLabPage = () => {
  const bellPlayed = useRef(false);

  const [duration, setDuration] = useState(60);
  const [seconds, setSeconds] = useState(60);
  const [running, setRunning] = useState(false);

  const [t2, setT2] = useState(null);
  const [t3, setT3] = useState(null);
  const [showNext, setShowNext] = useState(false);

  const a1 = useMemo(
    () =>
      speakingQuestionDictionary.filter(
        (q) => normalize(q.level).toUpperCase() === "A1"
      ),
    []
  );

  const teil2 = useMemo(
    () => a1.filter((q) => normalize(q.teilId) === "teil-2"),
    [a1]
  );

  const teil3 = useMemo(
    () => a1.filter((q) => normalize(q.teilId) === "teil-3"),
    [a1]
  );

  const hasTeil2 = teil2.length > 0;
  const hasTeil3 = teil3.length > 0;
  const hasPrompts = hasTeil2 || hasTeil3;

  const drawCards = useCallback(() => {
    setT2((prev) => randomPrompt(teil2, prev, "teil2"));
    setT3((prev) => randomPrompt(teil3, prev, "teil3"));
    setShowNext(false);
  }, [teil2, teil3]);

  useEffect(() => {
    if (hasPrompts) {
      drawCards();
    }
  }, [drawCards, hasPrompts]);

  useEffect(() => {
    if (!running) return undefined;

    const id = window.setInterval(() => {
      setSeconds((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);

    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (seconds === 0 && running) {
      setRunning(false);
      setShowNext(true);

      if (!bellPlayed.current) {
        playBell();
        bellPlayed.current = true;
      }
    }
  }, [seconds, running]);

  const handleSelectDuration = (value) => {
    setDuration(value);
    setSeconds(value);
    setRunning(false);
    setShowNext(false);
    bellPlayed.current = false;
  };

  const startTimer = () => {
    if (seconds === 0) {
      setSeconds(duration);
    }
    bellPlayed.current = false;
    setShowNext(false);
    setRunning(true);
  };

  const pauseTimer = () => {
    setRunning(false);
  };

  const resetTimer = () => {
    setRunning(false);
    setSeconds(duration);
    setShowNext(false);
    bellPlayed.current = false;
  };

  const openFalowen = () =>
    window.open(FALOWEN_SPEAKING_URL, "_blank", "noopener,noreferrer");

  const progress = duration > 0 ? (seconds / duration) * 100 : 0;
  const currentStep = showNext ? 4 : running ? 3 : 2;

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={heroCard}>
        <div style={heroWrap}>
          <img
            src={HERO_IMAGE}
            style={heroImage}
            alt="Students preparing for a speaking exam"
            loading="lazy"
          />
          <div style={heroOverlay} />

          <div style={heroContent}>
            <div style={{ ...row, justifyContent: "space-between", alignItems: "center" }}>
              <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

              <span style={heroBadge}>Day 19 • Chapter 5.9</span>
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                  lineHeight: 1.1,
                  color: "#ffffff",
                }}
              >
                Goethe A1 Speaking Confidence Lab
              </h1>

              <p style={{ margin: 0, opacity: 0.92, maxWidth: 760, lineHeight: 1.6 }}>
                Train with random speaking prompts, build confidence with a timed
                speaking drill, and move straight into Falowen real speaking practice.
              </p>
            </div>

            <div style={heroSoftPanel}>
              <strong style={{ fontSize: 16 }}>Falowen Speaking Exams</strong>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.92)" }}>
                Open the speaking exams page and start practising immediately.
              </p>

              <BulletList
                items={[
                  "Open the speaking exams page",
                  "Choose Teil 1, Teil 2, or Teil 3",
                  "Pick a prompt",
                  "Start practising immediately",
                ]}
              />

              <div style={row}>
                <PrimaryCTA label="Open Goethe Exams Page" onClick={openFalowen} />
                <SecondaryCTA label="Open in New Tab" onClick={openFalowen} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Section title="Your lesson path">
        <LearningFlow activeStep={currentStep} />
      </Section>

      <Section title="Language recap — erlaubt vs. verboten">
        <Callout>
          <strong>Meaning</strong>
          <BulletList
            items={[
              "erlaubt = allowed / permitted",
              "verboten = forbidden / not allowed",
            ]}
          />
        </Callout>

        <Callout>
          <strong>Full conjugation of <em>dürfen</em> (Präsens)</strong>
          <BulletList
            items={[
              "ich darf",
              "du darfst",
              "er / sie / es darf",
              "wir dürfen",
              "ihr dürft",
              "sie / Sie dürfen",
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
          Questions you can use in the exam center or exam hall
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
            A typical card or sign is <em>nicht rauchen!</em> (no smoking).
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

      <Section title="Goethe A1 speaking structure">
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
            "Teil 2: Um Informationen bitten und Informationen geben (ask and answer questions)",
            "Teil 3: Bitte formulieren und darauf reagieren (make requests and respond)",
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

      <Section title="What to do in each Teil — simple A1 templates">
        <h3 style={{ margin: 0 }}>Teil 1 — Introduce yourself</h3>
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

        <h3 style={{ margin: "8px 0 0" }}>Teil 2 — Ask and answer questions</h3>
        <BulletList
          items={[
            "Wo …? / Wann …? / Was …? / Wie …?",
            "Haben Sie …? / Essen Sie …? / Kaufen Sie …?",
          ]}
        />
        <p style={{ margin: 0 }}>Then answer with one simple full sentence.</p>

        <h3 style={{ margin: "8px 0 0" }}>Teil 3 — Requests and reactions</h3>
        <Callout>
          <strong>Make a request</strong>
          <BulletList
            items={[
              "Können Sie bitte + Infinitiv …?",
              "Verb + Sie bitte.",
            ]}
          />
        </Callout>

        <Callout>
          <strong>React politely</strong>
          <BulletList
            items={[
              "Accept: Ja, gern. / Ja, natürlich. / Kein Problem.",
              "Refuse: Tut mir leid, das geht leider nicht. / Leider kann ich nicht.",
            ]}
          />
        </Callout>
      </Section>

      <Section title="Random speaking prompts">
        <p style={{ margin: 0 }}>
          We pull random <strong>A1 only</strong> prompts from the speaking question
          sheet. Practise both cards one after the other.
        </p>

        <Callout>
          <strong>Quick help</strong>
          <BulletList
            items={[
              "Thema = WHAT are we talking about? (topic / situation)",
              "Stichwort = USE THIS WORD in your sentence (keyword)",
              "Rule: Always say the Stichwort in your question or answer.",
            ]}
          />
          <p style={{ margin: 0 }}>
            Example: <strong>Thema:</strong> Hausaufgabe •{" "}
            <strong>Stichwort:</strong> machen →{" "}
            <em>Machst du die Hausaufgabe?</em> /{" "}
            <em>Ja, ich mache die Hausaufgabe.</em>
          </p>
        </Callout>

        {(!hasTeil2 || !hasTeil3) && (
          <Callout>
            <strong>Practice prompts unavailable</strong>
            <p style={{ margin: 0 }}>
              Some speaking prompts could not be loaded from the dictionary.
              Students can still use the Falowen speaking exams page directly.
            </p>
          </Callout>
        )}

        <div style={row}>
          <PrimaryCTA label="Draw New Prompts" onClick={drawCards} />
        </div>

        <div style={grid}>
          <PromptCard title="Teil 2 Prompt" prompt={t2} kind="teil-2" />
          <PromptCard title="Teil 3 Prompt" prompt={t3} kind="teil-3" />
        </div>
      </Section>

      <Section title="Confidence Timer">
        <p style={{ margin: 0 }}>
          Use the <strong>prompts above</strong>. Speak continuously, calmly, and
          clearly until the timer ends.
        </p>

        <Callout>
          <strong>How to use it</strong>
          <BulletList
            items={[
              "Teil 2: Ask one question and answer it with Thema + Stichwort.",
              "Teil 3: Make one request and react politely with Thema + Stichwort.",
              "Repeat smoothly without stopping until the timer ends.",
            ]}
          />
        </Callout>

        <div style={timerBox}>
          <div style={{ display: "grid", gap: 8, justifyItems: "center" }}>
            <strong>Choose timer length</strong>
            <TimerSelector
              selectedSeconds={duration}
              onSelect={handleSelectDuration}
              disabled={running}
            />
          </div>

          <div
            aria-live="polite"
            aria-atomic="true"
            style={{ fontSize: 34, fontWeight: 700, letterSpacing: 1 }}
          >
            {formatTime(seconds)}
          </div>

          <div
            style={{
              width: "100%",
              maxWidth: 340,
              height: 10,
              background: "#dbeafe",
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "linear-gradient(90deg,#2563eb,#7c3aed)",
                transition: "width 0.3s ease",
              }}
            />
          </div>

          <div style={{ ...row, justifyContent: "center" }}>
            <button
              type="button"
              style={styles.primaryButton}
              onClick={startTimer}
              disabled={running}
            >
              ▶ Play
            </button>

            <button
              type="button"
              style={styles.secondaryButton}
              onClick={pauseTimer}
              disabled={!running}
            >
              ⏸ Pause
            </button>

            <button
              type="button"
              style={styles.secondaryButton}
              onClick={resetTimer}
            >
              ↺ Reset
            </button>
          </div>
        </div>

        <Checklist
          items={[
            "Teil 2: ask one question and answer one question in full sentences.",
            "Teil 3: make one polite request and react politely.",
            "Repeat daily. Confidence comes from timed repetition.",
          ]}
        />

        {showNext && (
          <Callout ariaLive="polite">
            <strong>✅ Time! Next step — real exam mode</strong>
            <BulletList
              items={[
                "Now open the Falowen speaking exams page",
                "Choose a speaking practice task",
                "Do 1 real prompt (Teil 2 or Teil 3)",
                "Start practising immediately",
              ]}
            />

            <div style={row}>
              <PrimaryCTA
                label="Open Speaking Exams Page"
                onClick={openFalowen}
              />
            </div>
          </Callout>
        )}
      </Section>

      <Section title="Pass strategy — simple A1 speaking rules that work">
        <h3 style={{ margin: 0 }}>What examiners love</h3>
        <BulletList
          items={[
            "Short, correct sentences",
            "Clear pronunciation",
            "Polite reactions",
            "You speak actively and do not stay silent",
          ]}
        />

        <h3 style={{ margin: "8px 0 0" }}>Common mistakes to avoid</h3>
        <BulletList
          items={[
            "Forgetting to react in Teil 3",
            "Using only one word instead of a mini sentence",
            "Speaking too fast",
          ]}
        />

        <Callout>
          <strong>Mini final checklist</strong>
          <Checklist
            items={[
              "I can introduce myself (Teil 1).",
              "I can ask 2 to 3 questions and answer (Teil 2).",
              "I can make a request and react politely (Teil 3).",
              "I know: Handy / Wörterbuch = nicht erlaubt.",
              "I can use erlaubt / nicht erlaubt / verboten in simple sentences.",
            ]}
          />
        </Callout>
      </Section>

      <SpeakingAppCTA
        title="Practice now on Falowen"
        description="Ready? Open the speaking exams page and start practising immediately."
        onOpen={openFalowen}
      />
    </div>
  );
};

export default GoetheA1SpeakingConfidenceLabPage;
