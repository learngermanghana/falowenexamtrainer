import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

/* ----------------------------- UI helpers ----------------------------- */

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionTitle = { margin: 0, fontSize: "1.1rem" };
const listStyle = { margin: 0, paddingLeft: 20, lineHeight: 1.7 };

const primaryBtn = styles.primaryButton || styles.secondaryButton;
const secondaryBtn = styles.secondaryButton || styles.primaryButton;

function normalizeGermanInput(text) {
  return (text || "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.。]$/g, "")
    .toLowerCase();
}

function isCorrect(user, expected) {
  return normalizeGermanInput(user) === normalizeGermanInput(expected);
}

const SectionCard = ({ title, children }) => (
  <div style={card}>
    <h2 style={sectionTitle}>{title}</h2>
    {children}
  </div>
);

const ChipRow = ({ items }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
    {items.map((w, idx) => (
      <span
        key={`${w}-${idx}`}
        style={{
          padding: "6px 10px",
          borderRadius: 999,
          background: "#f3f4f6",
          border: "1px solid #e5e7eb",
          fontSize: 14,
        }}
      >
        {w}
      </span>
    ))}
  </div>
);

function ExerciseItem({
  id,
  index,
  words,
  answer,
  placeholder = "Type the correct sentence…",
  resetKey,
  onMark,
}) {
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const correct = useMemo(() => isCorrect(value, answer), [value, answer]);

  useEffect(() => {
    // Reset when parent requests it
    setValue("");
    setChecked(false);
    setShowAnswer(false);
    onMark?.(id, null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  return (
    <li style={{ marginBottom: 14 }}>
      <div style={{ display: "grid", gap: 10 }}>
        <ChipRow items={words} />

        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setChecked(false);
            onMark?.(id, null);
          }}
          placeholder={placeholder}
          aria-label={`Exercise ${index + 1}`}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #d1d5db",
            outline: "none",
            fontSize: 15,
          }}
        />

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <button
            style={{ ...primaryBtn, width: "fit-content" }}
            onClick={() => {
              setChecked(true);
              onMark?.(id, correct);
            }}
            disabled={!value.trim()}
          >
            Check
          </button>

          <button
            style={{ ...secondaryBtn, width: "fit-content" }}
            onClick={() => setShowAnswer((s) => !s)}
          >
            {showAnswer ? "Hide Answer" : "Show Answer"}
          </button>

          {checked && (
            <span style={{ fontWeight: 600, color: correct ? "#16a34a" : "#dc2626" }}>
              {correct ? "Correct ✅" : "Not quite ❌ (try again)"}
            </span>
          )}
        </div>

        {showAnswer && (
          <div style={{ color: "#4b5563" }}>
            <strong>Answer:</strong> {answer}
          </div>
        )}
      </div>
    </li>
  );
}

const TicketRow = ({ label, time, place }) => (
  <div style={{ display: "flex", gap: 18 }}>
    <span style={{ minWidth: 70 }}>
      <strong>{label}</strong>
    </span>
    <span style={{ minWidth: 60 }}>{time}</span>
    <span>{place}</span>
  </div>
);

/* ----------------------------- Content data ---------------------------- */

const modalVerbs = [
  { verb: "können", meaning: "can / to be able to", forms: "ich kann · du kannst · er/sie/es kann" },
  { verb: "müssen", meaning: "must / to have to", forms: "ich muss · du musst · er/sie/es muss" },
  { verb: "dürfen", meaning: "may / to be allowed to", forms: "ich darf · du darfst · er/sie/es darf" },
  { verb: "wollen", meaning: "to want to (strong)", forms: "ich will · du willst · er/sie/es will" },
  { verb: "sollen", meaning: "should / to be supposed to", forms: "ich soll · du sollst · er/sie/es soll" },
  { verb: "mögen", meaning: "to like", forms: "ich mag · du magst · er/sie/es mag" },
  { verb: "möchten", meaning: "would like (polite)", forms: "ich möchte · du möchtest · er/sie/es möchte" },
];

const sentenceBuilding = [
  {
    id: "m1",
    words: ["können", "ich", "morgen", "um 15 Uhr", "einchecken"],
    answer: "Ich kann morgen um 15 Uhr einchecken.",
  },
  {
    id: "m2",
    words: ["müssen", "wir", "heute", "um 10 Uhr", "auschecken"],
    answer: "Wir müssen heute um 10 Uhr auschecken.",
  },
  {
    id: "m3",
    words: ["dürfen", "er", "hier", "nicht", "rauchen"],
    answer: "Er darf hier nicht rauchen.",
  },
  {
    id: "m4",
    words: ["möchten", "ich", "in Deutschland", "Urlaub", "machen"],
    answer: "Ich möchte in Deutschland Urlaub machen.",
  },
  {
    id: "m5",
    words: ["wollen", "sie", "ein Zimmer", "mit Balkon", "buchen"],
    answer: "Sie will ein Zimmer mit Balkon buchen.",
  },
];

const separableNoModal = [
  { id: "s1", words: ["ichsteheum 6 Uhrauf"], answer: "Ich stehe um 6 Uhr auf." },
  { id: "s2", words: ["ersiehtabendsfern"], answer: "Er sieht abends fern." },
  { id: "s3", words: ["wirkaufenam Samstagein"], answer: "Wir kaufen am Samstag ein." },
  { id: "s4", words: ["siebringteinen Kuchenmit"], answer: "Sie bringt einen Kuchen mit." },
  { id: "s5", words: ["duwachstum 7 Uhrauf"], answer: "Du wachst um 7 Uhr auf." },
];

// NEW: separable verbs WITH modal verbs
const separableWithModal = [
  {
    id: "sm1",
    words: ["müssen", "ich", "morgen", "um 6 Uhr", "aufstehen"],
    answer: "Ich muss morgen um 6 Uhr aufstehen.",
  },
  {
    id: "sm2",
    words: ["wollen", "wir", "am Samstag", "einkaufen"],
    answer: "Wir wollen am Samstag einkaufen.",
  },
  {
    id: "sm3",
    words: ["können", "er", "heute", "fernsehen"],
    answer: "Er kann heute fernsehen.",
  },
  {
    id: "sm4",
    words: ["möchten", "sie", "morgen", "einen Kuchen", "mitbringen"],
    answer: "Sie möchte morgen einen Kuchen mitbringen.",
  },
  {
    id: "sm5",
    words: ["sollen", "du", "früh", "aufwachen"],
    answer: "Du sollst früh aufwachen.",
  },
];

/* ------------------------------ Page component ------------------------------ */

const A1Day14ModalVerbsWorkbookPage = () => {
  const navigate = useNavigate();

  // Stable Unsplash CDN image URL (no login/API key required for simple embedding).
  const heroImg =
    "https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1600&q=80";
  const heroCreditName = "Lukas S";
  const heroCreditUrl = "https://unsplash.com/photos/blue-and-white-train-on-railway-station-9QjA0rNQp4s";

  // Score tracking: id -> true/false (null/undefined = not counted)
  const [marks, setMarks] = useState({});
  const [resetKey, setResetKey] = useState(0);

  const allExercises = useMemo(() => [...sentenceBuilding, ...separableNoModal, ...separableWithModal], []);
  const totalExercises = allExercises.length;

  const attemptedCount = useMemo(
    () => Object.values(marks).filter((v) => typeof v === "boolean").length,
    [marks]
  );
  const correctCount = useMemo(
    () => Object.values(marks).filter((v) => v === true).length,
    [marks]
  );

  const progressPct = totalExercises ? Math.round((correctCount / totalExercises) * 100) : 0;

  function handleMark(id, value) {
    setMarks((prev) => {
      const next = { ...prev };
      if (value === null) {
        delete next[id];
      } else {
        next[id] = value;
      }
      return next;
    });
  }

  function resetAll() {
    setMarks({});
    setResetKey((k) => k + 1);
  }

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      {/* HERO / HEADER */}
      <div style={{ ...card, gap: 14, overflow: "hidden", padding: 0 }}>
        <div style={{ position: "relative" }}>
          <img
            src={heroImg}
            alt="Germany travel theme"
            loading="lazy"
            style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(0,0,0,0.42), rgba(0,0,0,0.12))",
            }}
          />
          <div style={{ position: "absolute", left: 14, right: 14, bottom: 12, color: "white" }}>
            <div style={{ fontWeight: 800, fontSize: 18 }}>A1 · Day 14 · Modal Verbs</div>
            <div style={{ opacity: 0.92, fontSize: 13 }}>Travel & hotel sentences · Ab / An ticket language</div>
          </div>
        </div>

        <div style={{ padding: 16, display: "grid", gap: 12 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
            <button
              style={{ ...secondaryBtn, width: "fit-content" }}
              onClick={() => navigate("/campus/course")}
            >
              Back to Course
            </button>

            <button
              style={{ ...secondaryBtn, width: "fit-content" }}
              onClick={resetAll}
              title="Clear all inputs and scores"
            >
              Reset Exercises
            </button>
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <h1 style={{ ...styles.title, margin: 0 }}>A1 · Day 14 In-App Workbook · Modal Verbs</h1>
            <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 3.6 · Schreiben &amp; Sprechen · Self-practice</p>
            <p style={{ margin: 0, color: "#4b5563" }}>
              Objective: Use modal verbs + infinitive correctly, and understand separable verbs with/without a modal.
            </p>
            <p style={{ margin: 0, color: "#6b7280", fontSize: 12 }}>
              Photo by{" "}
              <a href={heroCreditUrl} target="_blank" rel="noreferrer" style={{ color: "inherit" }}>
                {heroCreditName}
              </a>{" "}
              on Unsplash
            </p>
          </div>

          {/* Score / progress */}
          <div
            style={{
              padding: 12,
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              background: "#ffffff",
              display: "grid",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
              <div style={{ fontWeight: 700 }}>Progress</div>
              <div style={{ color: "#4b5563" }}>
                Correct: <strong>{correctCount}</strong> / {totalExercises} · Attempted:{" "}
                <strong>{attemptedCount}</strong>
              </div>
            </div>

            <div style={{ height: 10, borderRadius: 999, background: "#f3f4f6", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${progressPct}%`,
                  background: "#111827",
                }}
              />
            </div>

            <div style={{ color: "#6b7280", fontSize: 12 }}>
              Tip: Students should aim for <strong>80–100%</strong> before moving to the next day.
            </div>
          </div>
        </div>
      </div>

      <SectionCard title="1) Bridge from statement rule to modal verbs">
        <p style={{ margin: 0 }}>
          Quick reminder from the previous practice: in a basic statement, we often build with
          <strong> Subject + verb + time + details</strong>.
        </p>
        <p style={{ margin: 0 }}>
          With modal verbs, we keep the same statement flow, but now the <strong>modal verb</strong> is
          conjugated in Position 2 and the main verb moves to the end in the <strong>infinitive</strong>.
        </p>
        <p style={{ margin: 0 }}>
          <strong>Pattern:</strong> Subject + modal + time + details + main verb (infinitive).
        </p>
        <p style={{ margin: 0 }}>
          <strong>Example:</strong> Ich möchte morgen nach Deutschland reisen.
        </p>
      </SectionCard>

      <SectionCard title="2) Modal verbs + meanings (Präsens)">
        <p style={{ margin: 0 }}>
          <strong>What is a modal verb?</strong> A modal verb is a <strong>supporting (helper) verb</strong>. It
          adds meaning such as ability, permission, obligation, or desire, and it supports a second verb
          (the main action) in infinitive form.
        </p>
        <p style={{ margin: 0 }}>
          <strong>Helper pattern:</strong> Subject + modal verb + ... + main verb (infinitive at the end).
        </p>
        <ul style={listStyle}>
          {modalVerbs.map((item) => (
            <li key={item.verb}>
              <strong>{item.verb}</strong> — {item.meaning}
              <br />
              <span style={{ color: "#4b5563" }}>{item.forms}</span>
            </li>
          ))}
        </ul>
        <p style={{ margin: 0, color: "#4b5563" }}>
          Note: <strong>möchten</strong> is the polite “would like” form (very common in hotels/restaurants).
        </p>
      </SectionCard>

      <SectionCard title="3) Example sentences">
        <ol style={listStyle}>
          <li>
            Ich <strong>kann</strong> um 15 Uhr <strong>einchecken</strong>.
          </li>
          <li>
            Wir <strong>müssen</strong> um 12 Uhr <strong>auschecken</strong>.
          </li>
          <li>
            Du <strong>darfst</strong> nicht in diesem Zimmer <strong>rauchen</strong>.
          </li>
          <li>
            Ich <strong>will</strong> ein Zimmer mit Blick aufs Meer <strong>haben</strong>.
          </li>
          <li>
            Wir <strong>sollen</strong> unseren Reiseplan <strong>ändern</strong>.
          </li>
          <li>
            Er <strong>mag</strong> Hotels. / Ich <strong>mag</strong> in Hotels <strong>übernachten</strong>.
          </li>
        </ol>
      </SectionCard>

      <SectionCard title="4) Difference: wollen vs. möchten">
        <ul style={listStyle}>
          <li>
            <strong>wollen</strong> = strong intention: <em>Ich will nach Deutschland reisen.</em>
          </li>
          <li>
            <strong>möchten</strong> = polite/softer: <em>Ich möchte nach Deutschland reisen.</em>
          </li>
        </ul>
      </SectionCard>

      <SectionCard title="5) Arrival & Departure on German tickets (Ab / An)">
        <p style={{ margin: 0 }}>
          On German tickets and station displays you often see:
          <strong> Ab</strong> = Abfahrt (Departure) and <strong> An</strong> = Ankunft (Arrival).
        </p>

        <div
          style={{
            marginTop: 10,
            padding: 12,
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            background: "#f9fafb",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            lineHeight: 1.8,
          }}
        >
          <div style={{ fontWeight: 800, marginBottom: 6, color: "#111827" }}>TICKET / BOARD</div>
          <TicketRow label="Ab" time="10:12" place="Frankfurt (Main) Hbf" />
          <TicketRow label="Halt" time="10:58" place="Kassel-Wilhelmshöhe" />
          <TicketRow label="Halt" time="11:46" place="Göttingen" />
          <TicketRow label="Halt" time="12:32" place="Hannover Hbf" />
          <TicketRow label="An" time="13:48" place="Berlin Hbf" />
          <div style={{ marginTop: 8, color: "#6b7280" }}>
            Often also: <strong>Gleis</strong> (platform), <strong>Umst.</strong> (transfers)
          </div>
        </div>

        <div
          style={{
            marginTop: 10,
            padding: 12,
            borderRadius: 12,
            border: "1px dashed #d1d5db",
            background: "#ffffff",
          }}
        >
          <strong>Mini practice:</strong> Write a sentence using “abfahren” and “ankommen”.
          <div style={{ marginTop: 8, color: "#4b5563" }}>
            Example: <em>Der Zug fährt um 10:12 Uhr ab und kommt um 13:48 Uhr an.</em>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="6) Practice path (recommended order)">
        <p style={{ margin: 0 }}>
          Before practice, remember another useful A1 pattern:
          <strong> gehen + infinitive</strong> (to go do something).
        </p>
        <ul style={listStyle}>
          <li>
            Ich gehe am Montag <strong>einkaufen</strong>. (I am going shopping on Monday.)
          </li>
          <li>
            Wir gehen heute Abend <strong>essen</strong>. (We are going to eat this evening.)
          </li>
          <li>
            Sie geht morgen <strong>schwimmen</strong>. (She goes swimming tomorrow.)
          </li>
        </ul>
        <p style={{ margin: 0, color: "#4b5563" }}>
          With this structure, <strong>gehen</strong> is conjugated and the other verb stays in infinitive at
          the end.
        </p>
        <p style={{ margin: 0 }}>
          To avoid confusion, complete the exercises in this order:
          <strong> 6 → 7 → 8</strong>.
        </p>
        <ul style={listStyle}>
          <li>
            <strong>Step 1:</strong> Modal verbs only (Questions 1–5)
          </li>
          <li>
            <strong>Step 2:</strong> Separable verbs without modal (Questions 6–10)
          </li>
          <li>
            <strong>Step 3:</strong> Separable verbs with modal (Questions 11–15)
          </li>
        </ul>
      </SectionCard>

      <SectionCard title="7) Practice 1: Build sentences with modal verbs (Questions 1–5)">
        <p style={{ margin: 0 }}>
          Ordnen Sie die Wörter zu einem korrekten Satz. Tippen Sie den Satz und klicken Sie <strong>Check</strong>.
        </p>

        <ol style={{ ...listStyle, marginTop: 10 }}>
          {sentenceBuilding.map((ex, idx) => (
            <ExerciseItem
              key={ex.id}
              id={ex.id}
              index={idx}
              words={ex.words}
              answer={ex.answer}
              placeholder="Type the full German sentence…"
              resetKey={resetKey}
              onMark={handleMark}
            />
          ))}
        </ol>
      </SectionCard>

      <SectionCard title="8) Practice 2: Separable verbs without modal (Questions 6–10)">
        <p style={{ margin: 0 }}>
          <strong>Without</strong> a modal: the prefix separates → Ich stehe um 6 Uhr <strong>auf</strong>.
        </p>
        <p style={{ margin: 0 }}>
          <strong>With</strong> a modal: the separable verb stays together as infinitive at the end →
          Ich muss um 6 Uhr <strong>aufstehen</strong>.
        </p>

        <h3 style={{ ...sectionTitle, marginTop: 10 }}>Practice (without modal) — Type + Check</h3>

        <ol style={{ ...listStyle, marginTop: 10 }}>
          {separableNoModal.map((ex, idx) => (
            <ExerciseItem
              key={ex.id}
              id={ex.id}
              index={idx}
              words={ex.words}
              answer={ex.answer}
              placeholder="Type the full sentence…"
              resetKey={resetKey}
              onMark={handleMark}
            />
          ))}
        </ol>
      </SectionCard>

      <SectionCard title="9) Practice 3: Separable verbs + modal verbs (Questions 11–15)">
        <p style={{ margin: 0 }}>
          <strong>Word order reminder:</strong> Subject + modal (Position 2) + time + details + main verb (infinitive at the
          end)
        </p>

        <div
          style={{
            marginTop: 10,
            padding: 12,
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            background: "#f9fafb",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            lineHeight: 1.8,
          }}
        >
          <div style={{ fontWeight: 800, marginBottom: 6, color: "#111827" }}>SLOT MAP</div>
          <div>Ich | muss | morgen | um 6 Uhr | aufstehen.</div>
          <div>Wir | dürfen | hier | nicht | rauchen.</div>
        </div>

        <h3 style={{ ...sectionTitle, marginTop: 12 }}>A) Separable verbs with a modal (verb stays together)</h3>
        <p style={{ margin: 0, color: "#4b5563" }}>
          With a modal verb, the separable verb stays together in infinitive form at the end:
          <strong> aufstehen</strong>, <strong> einkaufen</strong>, <strong> mitbringen</strong>.
        </p>

        <ol style={{ ...listStyle, marginTop: 10 }}>
          {separableWithModal.map((ex, idx) => (
            <ExerciseItem
              key={ex.id}
              id={ex.id}
              index={idx}
              words={ex.words}
              answer={ex.answer}
              placeholder="Type the full sentence…"
              resetKey={resetKey}
              onMark={handleMark}
            />
          ))}
        </ol>
      </SectionCard>
    </div>
  );
};

export default A1Day14ModalVerbsWorkbookPage;
