import React, { memo, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

/** =========================
 *  Helpers
 *  ========================= */
const Section = ({ title, children }) => (
  <section style={{ ...styles.card, display: "grid", gap: 10 }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const TopicImageBreak = ({ src, alt, title, subtitle }) => (
  <div style={{ ...styles.card, padding: 0, overflow: "hidden" }}>
    <img
      src={src}
      alt={alt}
      style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
      loading="lazy"
    />
    {(title || subtitle) && (
      <div style={{ padding: 12, display: "grid", gap: 4 }}>
        {title && <div style={{ fontWeight: 900 }}>{title}</div>}
        {subtitle && <div style={{ opacity: 0.85 }}>{subtitle}</div>}
      </div>
    )}
  </div>
);

const Chip = ({ children }) => (
  <span
    style={{
      border: "1px solid #cbd5e1",
      background: "#ffffff",
      borderRadius: 999,
      padding: "6px 10px",
      fontSize: 13,
      fontWeight: 700,
      color: "#0f172a",
    }}
  >
    {children}
  </span>
);

const ChoiceRow = ({ label, options, value, onChange }) => (
  <div style={{ display: "grid", gap: 8 }}>
    <div style={{ fontWeight: 900 }}>{label}</div>
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          style={{
            ...styles.secondaryButton,
            width: "fit-content",
            borderColor: value === o.value ? "#111827" : undefined,
            fontWeight: value === o.value ? 900 : 500,
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  </div>
);

const MiniCheck = ({ prompt, options, value, onChange, answer, checked }) => {
  const isCorrect = checked && value === answer;
  const isWrong = checked && value && value !== answer;

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, display: "grid", gap: 8 }}>
      <div style={{ fontWeight: 900 }}>{prompt}</div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            style={{
              ...styles.secondaryButton,
              width: "fit-content",
              borderColor: value === o ? "#111827" : undefined,
              fontWeight: value === o ? 900 : 500,
            }}
          >
            {o}
          </button>
        ))}
        {isCorrect && <span style={{ fontWeight: 900 }}>✅ richtig</span>}
        {isWrong && <span style={{ fontWeight: 900 }}>❌ falsch</span>}
      </div>
    </div>
  );
};

/** =========================
 *  NEW: Bullet Letter Task (NO drag & drop)
 *  - Students read bullets, tick them, then write notes
 *  ========================= */
const LetterBulletTask = ({ title, bullets, tips = [], noteLabel = "Your quick notes (optional)" }) => {
  const [checks, setChecks] = useState(() => bullets.map(() => false));
  const [notes, setNotes] = useState("");

  const toggle = (idx) => {
    setChecks((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  const doneCount = checks.filter(Boolean).length;

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, display: "grid", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
        <div style={{ fontWeight: 900 }}>{title}</div>
        <div style={{ fontWeight: 900, opacity: 0.9 }}>
          {doneCount}/{bullets.length} done
        </div>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ fontWeight: 800 }}>Read the points, then tick ✅ as you include them:</div>

        <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
          {bullets.map((b, i) => (
            <li key={`${b}-${i}`} style={{ display: "grid", gap: 6 }}>
              <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
                <input type="checkbox" checked={checks[i]} onChange={() => toggle(i)} style={{ marginTop: 3 }} />
                <span>
                  <span style={{ fontWeight: 900 }}>{b.title}</span>
                  {b.example && (
                    <div style={{ marginTop: 3, opacity: 0.9 }}>
                      Beispiel: <strong>{b.example}</strong>
                    </div>
                  )}
                </span>
              </label>
            </li>
          ))}
        </ul>

        {tips.length > 0 && (
          <div style={{ borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0", padding: 10 }}>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>Tips</div>
            <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
              {tips.map((t, idx) => (
                <li key={idx} style={{ opacity: 0.95 }}>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div style={{ ...styles.card, display: "grid", gap: 6 }}>
        <label style={{ fontWeight: 900 }}>{noteLabel}</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Write 1–2 short lines to help you remember what to say..."
          style={{
            width: "100%",
            borderRadius: 10,
            border: "1px solid #d1d5db",
            padding: 10,
          }}
        />
        <div style={{ fontSize: 13, opacity: 0.85 }}>
          Tip: Don’t copy the bullets as-is. Convert them into full sentences.
        </div>
      </div>
    </div>
  );
};

/** Read the bullet words and type the sentence (no drag/tap ordering) */
const WordOrderBulletExercise = ({ id, label, words, correctSentence, tip, onSentenceChange }) => {
  const [typedSentence, setTypedSentence] = useState("");
  const normalizedTyped = typedSentence.trim().replace(/\s+/g, " ");
  const isDone = normalizedTyped.length > 0;

  const handleChange = (value) => {
    setTypedSentence(value);
    onSentenceChange(value);
  };

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, display: "grid", gap: 10 }}>
      <div style={{ fontWeight: 900 }}>{label}</div>

      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ fontWeight: 800 }}>Read the words, then write the correct sentence:</div>
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 4 }}>
          {words.map((w, idx) => (
            <li key={`${w}-${idx}`}>{w}</li>
          ))}
        </ul>
        {tip && (
          <div style={{ opacity: 0.9, fontSize: 13 }}>
            Tip: {tip}
          </div>
        )}
      </div>

      <div style={{ ...styles.card, display: "grid", gap: 6 }}>
        <label htmlFor={id} style={{ fontWeight: 900 }}>
          Your sentence
        </label>
        <textarea
          id={id}
          value={typedSentence}
          onChange={(e) => handleChange(e.target.value)}
          rows={2}
          placeholder="Ich möchte dir ..."
          style={{
            width: "100%",
            borderRadius: 10,
            border: "1px solid #d1d5db",
            padding: 10,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          }}
        />

        {isDone && (
          <div style={{ fontWeight: 900 }}>
            {normalizedTyped === correctSentence ? "✅ Correct order!" : "❌ Check word order again."}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button type="button" style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => handleChange("")}>
          Clear
        </button>
        <details>
          <summary style={{ cursor: "pointer", fontWeight: 800 }}>Show answer (Teacher)</summary>
          <div style={{ marginTop: 8 }}>{correctSentence}</div>
        </details>
      </div>
    </div>
  );
};

/** =========================
 *  Free-to-use images (Unsplash License)
 *  ========================= */
const IMG_LETTER =
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400";
const IMG_SCHOOL =
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400";

/** =========================
 *  Page
 *  ========================= */
const A1LetterWritingQuestionBookPage = () => {
  const navigate = useNavigate();

  /** ===== Vocabulary (on page) ===== */
  const VOCAB = useMemo(
    () => ({
      verbs: [
        "abholen (pick up)",
        "anmelden (register)",
        "anmachen (switch on)",
        "ausmachen (switch off)",
        "anreisen (arrive)",
        "ankommen (arrive)",
        "abreisen (depart)",
        "absagen (cancel)",
        "zusagen (accept)",
        "zumachen (close)",
        "aufmachen (open)",
        "einsteigen (get in)",
        "umsteigen (change trains)",
        "aussteigen (get out)",
        "vereinbaren (arrange)",
        "einladen (invite)",
        "gratulieren (congratulate)",
      ],
      key: [
        "der Geburtstag (birthday)",
        "die Feier (celebration/party)",
        "der Kurs (course)",
        "die Anmeldung (registration)",
        "die Gebühr (fee)",
        "das Formular (form)",
        "das Büro (office)",
        "die Informationen (information)",
        "der Preis (price)",
        "der Termin (appointment)",
      ],
      travelWeather: [
        "der Koffer (suitcase)",
        "die Ferien / der Urlaub (vacation)",
        "das Meer (sea)",
        "das Ausland (abroad)",
        "der Ausflug (excursion)",
        "das Wetter (weather)",
        "die Sonne (sun)",
        "der Regen (rain)",
        "der Schnee (snow)",
        "der Wind (wind)",
        "die Wolke (cloud)",
        "das Gewitter (thunderstorm)",
        "der Sturm (storm)",
        "die Temperatur (temperature)",
        "der Himmel (sky)",
      ],
    }),
    []
  );

  /** =========================
   *  Birthday (Informal) – states
   *  ========================= */
  const [b_gender, setB_gender] = useState("male"); // male|female
  const [b_name, setB_name] = useState("Max");

  const birthdayGreeting = useMemo(() => {
    if (!b_name) return b_gender === "female" ? "Liebe ...," : "Lieber ...,";
    return b_gender === "female" ? `Liebe ${b_name},` : `Lieber ${b_name},`;
  }, [b_gender, b_name]);

  const [b_weilPick, setB_weilPick] = useState("");
  const [, setB_wordOrderSentence] = useState("");

  const [b_wish, setB_wish] = useState("Alles Gute zum Geburtstag!");
  const [b_partyQuestion, setB_partyQuestion] = useState("Planst du eine Feier?");
  const [b_extra] = useState("Kann ich mit meiner Familie kommen?");
  const [b_includeExtra, setB_includeExtra] = useState(false);

  const [b_closing, setB_closing] = useState("Ich freue mich im Voraus auf deine Antwort.");
  const [b_sign, setB_sign] = useState("Viele Grüße,");

  /** =========================
   *  Formal (Language School) – states
   *  ========================= */
  const formalGreeting = `Sehr geehrte Damen und Herren,`;

  const [f_weilPick, setF_weilPick] = useState("");
  const [f_requestPick, setF_requestPick] = useState("");
  const [f_datesPick, setF_datesPick] = useState("");
  const [f_closing, setF_closing] = useState("Ich freue mich im Voraus auf Ihre Antwort.");
  const [f_sign, setF_sign] = useState("Mit freundlichen Grüßen,");

  const [checkedBirthday, setCheckedBirthday] = useState(false);
  const [checkedFormal, setCheckedFormal] = useState(false);

  const birthdayLetter = useMemo(() => {
    const lines = [];
    lines.push(birthdayGreeting);
    lines.push("");
    lines.push("Wie geht es dir? Ich hoffe, es geht dir gut.");
    lines.push("Ich schreibe dir, weil ich dir zum Geburtstag gratulieren möchte.");
    lines.push("");
    lines.push(b_wish);
    lines.push(b_partyQuestion);
    if (b_includeExtra) lines.push(b_extra);
    lines.push("");
    lines.push(b_closing);
    lines.push(b_sign);
    lines.push("[Dein Name]");
    return lines.join("\n");
  }, [birthdayGreeting, b_wish, b_partyQuestion, b_includeExtra, b_extra, b_closing, b_sign]);

  const formalLetter = useMemo(() => {
    const lines = [];
    lines.push(formalGreeting);
    lines.push("");
    lines.push("Ich hoffe, es geht Ihnen gut.");
    lines.push("Ich schreibe Ihnen, weil ich einen Deutschkurs besuchen möchte.");
    lines.push("");
    lines.push("Könnten Sie mir bitte Informationen über Ihre Deutschkurse geben?");
    lines.push("Könnten Sie mir auch die Kurstermine mitteilen?");
    lines.push("Wie viel kostet der Kurs?");
    lines.push("Wie soll ich bezahlen? Mit Kreditkarte oder bar?");
    lines.push("");
    lines.push(f_closing);
    lines.push(f_sign);
    lines.push("[Ihr voller Name]");
    return lines.join("\n");
  }, [formalGreeting, f_closing, f_sign]);

  const fullPack = useMemo(() => {
    return `=== Birthday Letter (Informal) ===\n\n${birthdayLetter}\n\n\n=== Formal Letter (Language School) ===\n\n${formalLetter}`;
  }, [birthdayLetter, formalLetter]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullPack);
      alert("Copied!");
    } catch {
      alert("Copy failed. Please copy manually.");
    }
  };

  const B_WEIL_CORRECT = "Ich schreibe dir, weil ich dir zum Geburtstag gratulieren möchte.";
  const B_WEIL_WRONG = "Ich schreibe dir, weil ich möchte dir gratulieren.";

  const F_WEIL_CORRECT = "Ich schreibe Ihnen, weil ich Anfragen stellen möchte.";
  const F_WEIL_WRONG = "Ich schreibe Ihnen, weil ich möchte Anfragen stellen.";

  const F_REQUEST_CORRECT = "Könnten Sie mir bitte Informationen über Ihre Deutschkurse geben?";
  const F_REQUEST_WRONG = "Können mir Sie bitte Informationen geben?";

  const F_DATES_CORRECT = "Könnten Sie mir auch die Kurstermine mitteilen?";
  const F_DATES_WRONG = "Könnten Sie auch mitteilen mir die Kurstermine?";

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Introduction to Letter Writing 12.3</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Assignment: Formal and Informal Letter.</p>
      </header>

      {/* ... keep your existing sections above ... */}

      <Section title="1) Birthday Letter (Informal) — Question Book">
        <div style={{ display: "grid", gap: 12 }}>
          {/* NEW: Bullet letter task (no drag & drop) */}
          <LetterBulletTask
            title="Letter Task (Read bullets → tick → write)"
            bullets={[
              { title: "Greeting (informal)", example: "Lieber Max," },
              { title: "Reason (weil)", example: "…weil ich dir gratulieren möchte." },
              { title: "Congratulate / wish", example: "Alles Gute zum Geburtstag!" },
              { title: "Ask about party", example: "Planst du eine Feier?" },
              { title: "Closing + sign-off", example: "Viele Grüße, + Name" },
            ]}
            tips={[
              "Don’t write single words. Write full sentences.",
              "Because of **weil**, the verb goes to the end.",
              "Keep it short: 5–7 lines is enough for A1.",
            ]}
          />

          {/* Q1 */}
          <ChoiceRow
            label="Q1) Choose the greeting (Max)"
            options={[
              { value: "male", label: "Lieber Max," },
              { value: "female", label: "Liebe Max," },
            ]}
            value={b_gender}
            onChange={(v) => setB_gender(v)}
          />

          {/* Q2 weil */}
          <MiniCheck
            prompt="Q2) Choose the correct weil sentence"
            options={[B_WEIL_CORRECT, B_WEIL_WRONG]}
            value={b_weilPick}
            onChange={setB_weilPick}
            answer={B_WEIL_CORRECT}
            checked={checkedBirthday}
          />

          {/* Q3 word order (bullet list + writing) */}
          <WordOrderBulletExercise
            id="b-wordorder-1"
            label="Q3) Build the sentence from this bullet list (modal verb rule)"
            words={["Ich", "möchte", "dir", "zu", "deinem", "Geburtstag", "gratulieren."]}
            correctSentence="Ich möchte dir zu deinem Geburtstag gratulieren."
            tip={
              <>
                With <strong>möchte</strong>, keep the second verb <strong>gratulieren</strong> at the end.
              </>
            }
            onSentenceChange={setB_wordOrderSentence}
          />

          {/* ... keep the rest of your birthday questions ... */}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              style={{ ...styles.primaryButton, width: "fit-content" }}
              onClick={() => setCheckedBirthday(true)}
            >
              Check Birthday answers
            </button>
            <div style={{ opacity: 0.85 }}>(This will mark only the weil question. Others are choices + practice.)</div>
          </div>
        </div>
      </Section>

      <TopicImageBreak src={IMG_SCHOOL} alt="School and studying" title="Now the second letter" subtitle="Formal letter to a language school." />

      <Section title="2) Formal Letter — Question Book (Language School)">
        <div style={{ display: "grid", gap: 12 }}>
          {/* NEW: Bullet letter task (no drag & drop) */}
          <LetterBulletTask
            title="Letter Task (Read bullets → tick → write)"
            bullets={[
              { title: "Greeting (formal)", example: "Sehr geehrte Damen und Herren," },
              { title: "Reason (weil)", example: "…weil ich einen Deutschkurs besuchen möchte." },
              { title: "Request course info", example: "Könnten Sie mir bitte Informationen … geben?" },
              { title: "Ask about dates", example: "Könnten Sie mir auch die Kurstermine mitteilen?" },
              { title: "Ask about price + payment", example: "Wie viel kostet…? Wie soll ich bezahlen?" },
              { title: "Closing + sign-off", example: "Mit freundlichen Grüßen, + voller Name" },
            ]}
            tips={[
              "Use **Sie/Ihnen/Ihre** (formal). Don’t use **du/dir/dein**.",
              "Because of **weil**, the verb goes to the end.",
              "Ask in questions (Könnten Sie…?). Keep it polite.",
            ]}
          />

          {/* Q1 greeting */}
          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ fontWeight: 900 }}>Q1) Greeting</div>
            <div style={{ ...styles.card }}>
              <div style={{ fontWeight: 900 }}>{formalGreeting}</div>
              <div style={{ opacity: 0.85, fontSize: 13 }}>Tip: Use this when receiver is unknown (a school/office).</div>
            </div>
          </div>

          {/* Q2 weil */}
          <MiniCheck
            prompt="Q2) Choose the correct weil sentence"
            options={[F_WEIL_CORRECT, F_WEIL_WRONG]}
            value={f_weilPick}
            onChange={setF_weilPick}
            answer={F_WEIL_CORRECT}
            checked={checkedFormal}
          />

          {/* Q3 request info */}
          <MiniCheck
            prompt="Q3) Choose the correct request sentence"
            options={[F_REQUEST_CORRECT, F_REQUEST_WRONG]}
            value={f_requestPick}
            onChange={setF_requestPick}
            answer={F_REQUEST_CORRECT}
            checked={checkedFormal}
          />

          {/* Q5 course dates */}
          <MiniCheck
            prompt="Q5) Choose the correct course dates sentence"
            options={[F_DATES_CORRECT, F_DATES_WRONG]}
            value={f_datesPick}
            onChange={setF_datesPick}
            answer={F_DATES_CORRECT}
            checked={checkedFormal}
          />

          {/* Q6 closing */}
          <ChoiceRow
            label="Q6) Closing sentence (fixed)"
            options={[
              { value: "Ich freue mich im Voraus auf Ihre Antwort.", label: "Ich freue mich im Voraus auf Ihre Antwort." },
              { value: "Ich warte auf Ihre Antwort.", label: "Ich warte auf Ihre Antwort." },
            ]}
            value={f_closing}
            onChange={setF_closing}
          />

          {/* Q7 sign-off */}
          <ChoiceRow
            label="Q7) Sign-off"
            options={[
              { value: "Mit freundlichen Grüßen,", label: "Mit freundlichen Grüßen," },
              { value: "Viele Grüße,", label: "Viele Grüße," },
            ]}
            value={f_sign}
            onChange={setF_sign}
          />

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              style={{ ...styles.primaryButton, width: "fit-content" }}
              onClick={() => setCheckedFormal(true)}
              disabled={!f_weilPick || !f_requestPick || !f_datesPick}
            >
              Check Formal answers
            </button>
            <div style={{ opacity: 0.85 }}>(Marks Q2, Q3, Q5.)</div>
          </div>
        </div>
      </Section>

      <Section title="Copy & Submit (2 Letters)">
        <p style={{ margin: 0 }}>Copy the two letters below and submit as your assignment.</p>

        <pre
          style={{
            margin: 0,
            padding: 12,
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            background: "#0b1220",
            color: "#e5e7eb",
            overflowX: "auto",
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
          }}
        >
          {fullPack}
        </pre>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" style={{ ...styles.primaryButton, width: "fit-content" }} onClick={copy}>
            Copy both letters
          </button>
        </div>

        <div style={{ borderRadius: 10, background: "#ecfdf5", border: "1px solid #86efac", padding: 10 }}>
          ✅ After copying, replace <strong>[Dein Name]</strong> / <strong>[Ihr voller Name]</strong> with your name.
        </div>
      </Section>
    </main>
  );
};

export default memo(A1LetterWritingQuestionBookPage);
