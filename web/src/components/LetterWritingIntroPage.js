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

/** Tap words in order (A1-friendly, no drag) */
const WordOrderTap = ({ label, words, correctSentence, onSentenceChange }) => {
  const [picked, setPicked] = useState([]);
  const remaining = words.filter((w) => !picked.includes(w));

  const sentence = picked.join(" ");
  const isDone = picked.length === words.length;

  const reset = () => {
    setPicked([]);
    onSentenceChange("");
  };

  const pick = (w) => {
    const next = [...picked, w];
    setPicked(next);
    onSentenceChange(next.join(" "));
  };

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, display: "grid", gap: 10 }}>
      <div style={{ fontWeight: 900 }}>{label}</div>

      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ fontWeight: 800 }}>Tap the words in order:</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {remaining.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => pick(w)}
              style={{ ...styles.secondaryButton, width: "fit-content" }}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      <div style={{ ...styles.card, display: "grid", gap: 6 }}>
        <div style={{ fontWeight: 900 }}>Your sentence</div>
        <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}>
          {sentence || "—"}
        </div>

        {isDone && (
          <div style={{ fontWeight: 900 }}>
            {sentence === correctSentence ? "✅ Correct order!" : "❌ Check word order again."}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button type="button" style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={reset}>
          Reset
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
 *  Use direct images.unsplash.com links for more reliable loading in-app.
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
    if (!b_name) return b_gender === "female" ? "Liebe ...,": "Lieber ...,";
    return b_gender === "female" ? `Liebe ${b_name},` : `Lieber ${b_name},`;
  }, [b_gender, b_name]);

  // Q2: weil sentence (choose correct)
  const [b_weilPick, setB_weilPick] = useState("");
  // Q3 word order sentence
  const [, setB_wordOrderSentence] = useState("");

  // Body choices (simple buttons)
  const [b_wish, setB_wish] = useState("Alles Gute zum Geburtstag!");
  const [b_partyQuestion, setB_partyQuestion] = useState("Planst du eine Feier?");
  const [b_extra] = useState("Kann ich mit meiner Familie kommen?"); // optional
  const [b_includeExtra, setB_includeExtra] = useState(false);

  // Closing choice
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

  /** =========================
   *  Check buttons
   *  ========================= */
  const [checkedBirthday, setCheckedBirthday] = useState(false);
  const [checkedFormal, setCheckedFormal] = useState(false);

  /** =========================
   *  Build final letters (auto)
   *  1) Only ONE box at the end
   *  ========================= */
  const birthdayLetter = useMemo(() => {
    const lines = [];
    lines.push(birthdayGreeting);
    lines.push("");
    lines.push("Wie geht es dir? Ich hoffe, es geht dir gut.");

    // weil line: we generate correct version regardless of pick, so final is always good
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
    // we use selections but keep A1 simple
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

  /** =========================
   *  Correct answers (A1)
   *  ========================= */
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
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Assignment: Formal and Informal Letter.
        </p>
      </header>



      <Section title="How to use this page">
        <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>Read the formal and informal letter structures carefully.</li>
          <li>Complete the informal birthday question book first.</li>
          <li>Complete the formal language-school question book next.</li>
          <li>Use StuddyBuddy for ideas and sentence support before writing.</li>
          <li>Before submission, use Marky My Letter to fix basic errors: <a href="https://www.falowen.app/campus/writing" target="_blank" rel="noreferrer">https://www.falowen.app/campus/writing</a></li>
        </ol>
      </Section>

      <TopicImageBreak
        src={IMG_LETTER}
        alt="Writing a letter"
        title="Letter Writing (A1)"
        subtitle="We focus on greetings + simple sentences + weil word order."
      />

      {/* NOTE (short + clear) */}
      <Section title="A1 Note (Read first)">
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ fontWeight: 900 }}>Formal</div>
          <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
            <li>Sehr geehrte Frau + Name / Sehr geehrter Herr + Name</li>
            <li>Sehr geehrte Damen und Herren (unknown)</li>
            <li>Ich hoffe, es geht Ihnen gut. Ich schreibe Ihnen, weil ...</li>
            <li><strong>weil rule:</strong> verb goes to the end</li>
          </ul>

          <div style={{ fontWeight: 900, marginTop: 8 }}>Informal</div>
          <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
            <li>Hallo [Name] / Liebe [Name] / Lieber [Name]</li>
            <li>Wie geht es dir? Ich hoffe, es geht dir gut. Ich schreibe dir, weil ...</li>
            <li><strong>weil rule:</strong> verb goes to the end</li>
          </ul>
        </div>
      </Section>



      <Section title="Formal Letter Structure (quick guide)">
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>Sehr geehrte Frau + Name (female recipient)</li>
          <li>Sehr geehrter Herr + Name (male recipient)</li>
          <li>Sehr geehrte Damen und Herren (unknown recipient)</li>
          <li>Opening: Ich hoffe, es geht Ihnen gut. Ich schreibe Ihnen, weil ...</li>
          <li>Use these in the body: Ich möchte wissen, ob / deshalb / weil.</li>
          <li>Conclusion (fixed): Ich freue mich im Voraus auf Ihre Antwort.</li>
          <li>Sign-off: Mit freundlichen Grüßen, + full name</li>
        </ul>
      </Section>

      <Section title="Informal Letter Structure (quick guide)">
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>Hallo [Name], or Liebe/Lieber [first name],</li>
          <li>Opening: Wie geht es dir? Ich hoffe, es geht dir gut.</li>
          <li>Reason: Ich schreibe dir, weil ... (verb goes to the end).</li>
          <li>Use these in the body: Ich möchte wissen, ob / deshalb / weil.</li>
          <li>Conclusion (fixed): Ich freue mich im Voraus auf deine Antwort.</li>
          <li>Sign-off: Viele Grüße / Liebe Grüße + first name</li>
        </ul>
      </Section>

      {/* VOCAB ON PAGE */}
      <Section title="Essential A1 Vocabulary (for these letters)">
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ fontWeight: 900 }}>Verbs</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {VOCAB.verbs.map((w) => (
              <Chip key={w}>{w}</Chip>
            ))}
          </div>

          <div style={{ fontWeight: 900, marginTop: 6 }}>Key words</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {VOCAB.key.map((w) => (
              <Chip key={w}>{w}</Chip>
            ))}
          </div>

          <div style={{ fontWeight: 900, marginTop: 6 }}>Travel/weather words</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {VOCAB.travelWeather.map((w) => (
              <Chip key={w}>{w}</Chip>
            ))}
          </div>

          <div style={{ fontWeight: 900, marginTop: 6 }}>Special occasions</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              "die Glückwünsche (congratulations)",
              "die Hochzeit (wedding)",
              "Alles Gute zum Geburtstag (happy birthday)",
              "Herzlichen Glückwunsch (congratulations)",
              "der Geburtstag (birthday)",
              "die Feier (celebration)",
            ].map((w) => (
              <Chip key={w}>{w}</Chip>
            ))}
          </div>
        </div>
      </Section>

      {/* =========================
          1) Birthday Letter Question Book (Informal)
         ========================= */}
      <Section title="1) Birthday Letter (Informal) — Question Book">
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ ...styles.card, display: "grid", gap: 8 }}>
            <div style={{ fontWeight: 900 }}>Instructions</div>
            <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
              <li>Start with an informal greeting.</li>
              <li>Write why you are writing to your friend.</li>
              <li>Give birthday wishes and congratulate them.</li>
              <li>Ask if they are planning a celebration.</li>
              <li>Close politely and sign with your first name.</li>
            </ol>
            <div style={{ fontWeight: 900, marginTop: 6 }}>Sample Question</div>
            <div>
              Ihr Freund hat Geburtstag. Schreiben Sie an Ihren Freund:
              <ul style={{ margin: "6px 0 0", paddingLeft: 20 }}>
                <li>Warum schreiben Sie?</li>
                <li>Gratulieren Sie ihm.</li>
                <li>Fragen Sie: ob er eine Feier plant?</li>
              </ul>
            </div>
            <div style={{ opacity: 0.9 }}>Encouragement: Take your time and use the hints. Practice makes perfect.</div>
          </div>

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
          <div style={{ display: "grid", gap: 6 }}>
            <div style={{ fontWeight: 900 }}>Name</div>
            <input
              value={b_name}
              onChange={(e) => setB_name(e.target.value)}
              style={{ padding: 10, borderRadius: 10, border: "1px solid #d1d5db", maxWidth: 240 }}
              placeholder="Max"
            />
            <div style={{ ...styles.card, display: "grid", gap: 6 }}>
              <div style={{ fontWeight: 900 }}>Greeting preview</div>
              <div>{birthdayGreeting}</div>
            </div>
            <div style={{ opacity: 0.85, fontSize: 13 }}>
              Tip: For a boy: <strong>Lieber</strong>. For a girl: <strong>Liebe</strong>.
            </div>
          </div>

          {/* Q2 weil */}
          <MiniCheck
            prompt="Q2) Choose the correct weil sentence"
            options={[B_WEIL_CORRECT, B_WEIL_WRONG]}
            value={b_weilPick}
            onChange={setB_weilPick}
            answer={B_WEIL_CORRECT}
            checked={checkedBirthday}
          />

          {/* Q3 word order (tap words) */}
          <WordOrderTap
            label="Q3) Tap words in correct order (modal verb rule)"
            words={["Ich", "möchte", "dir", "zu", "deinem", "Geburtstag", "gratulieren."]}
            correctSentence="Ich möchte dir zu deinem Geburtstag gratulieren."
            onSentenceChange={setB_wordOrderSentence}
          />

          {/* Q4 wish */}
          <ChoiceRow
            label="Q4) Birthday wish"
            options={[
              { value: "Alles Gute zum Geburtstag!", label: 'Alles Gute zum Geburtstag!' },
              { value: "Herzlichen Glückwunsch!", label: "Herzlichen Glückwunsch!" },
            ]}
            value={b_wish}
            onChange={setB_wish}
          />

          {/* Q5 party question */}
          <ChoiceRow
            label="Q5) Ask about the celebration"
            options={[
              { value: "Planst du eine Feier?", label: "Planst du eine Feier?" },
              { value: "Hast du eine Feier?", label: "Hast du eine Feier?" },
            ]}
            value={b_partyQuestion}
            onChange={setB_partyQuestion}
          />

          {/* Q6 optional extra */}
          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ fontWeight: 900 }}>Q6) Optional: ask if you can come with your family</div>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" checked={b_includeExtra} onChange={(e) => setB_includeExtra(e.target.checked)} />
              Include: <strong>{b_extra}</strong>
            </label>
          </div>

          {/* Q8 closing */}
          <ChoiceRow
            label="Q8) Choose the closing sentence"
            options={[
              { value: "Ich freue mich im Voraus auf deine Antwort.", label: "Ich freue mich im Voraus auf deine Antwort." },
              { value: "Bis bald.", label: "Bis bald." },
            ]}
            value={b_closing}
            onChange={setB_closing}
          />

          {/* Q9 sign-off */}
          <ChoiceRow
            label="Q9) Choose the sign-off"
            options={[
              { value: "Viele Grüße,", label: "Viele Grüße," },
              { value: "Liebe Grüße,", label: "Liebe Grüße," },
            ]}
            value={b_sign}
            onChange={setB_sign}
          />

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              style={{ ...styles.primaryButton, width: "fit-content" }}
              onClick={() => setCheckedBirthday(true)}
            >
              Check Birthday answers
            </button>
            <div style={{ opacity: 0.85 }}>
              (This will mark only the weil question. Others are choices + practice.)
            </div>
          </div>
        </div>
      </Section>

      <TopicImageBreak
        src={IMG_SCHOOL}
        alt="School and studying"
        title="Now the second letter"
        subtitle="Formal letter to a language school."
      />

      {/* =========================
          2) Formal Letter Question Book
         ========================= */}
      <Section title="2) Formal Letter — Question Book (Language School)">
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ ...styles.card, display: "grid", gap: 8 }}>
            <div style={{ fontWeight: 900 }}>Instructions</div>
            <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
              <li>Start with a formal greeting.</li>
              <li>Explain why you are writing (weil).</li>
              <li>Request information about courses.</li>
              <li>Ask about dates, prices, and payment.</li>
              <li>Conclude politely.</li>
            </ol>
            <div style={{ opacity: 0.9 }}>Encouragement: Use formal language and include all required details.</div>

            <div style={{ fontWeight: 900, marginTop: 6 }}>Sample Question</div>
            <div>
              Sie möchten einen Deutschkurs besuchen. Schreiben Sie an die Sprachschule:
              <ul style={{ margin: "6px 0 0", paddingLeft: 20 }}>
                <li>Warum schreiben Sie?</li>
                <li>Bitten Sie um Informationen über Kurse.</li>
                <li>Fragen Sie nach Kursterminen, Preisen und Zahlungsmethoden.</li>
              </ul>
            </div>
          </div>

          {/* Q1 greeting */}
          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ fontWeight: 900 }}>Q1) Greeting</div>
            <div style={{ ...styles.card }}>
              <div style={{ fontWeight: 900 }}>{formalGreeting}</div>
              <div style={{ opacity: 0.85, fontSize: 13 }}>
                Tip: Use this when receiver is unknown (a school/office).
              </div>
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
            <div style={{ opacity: 0.85 }}>
              (Marks Q2, Q3, Q5.)
            </div>
          </div>
        </div>
      </Section>

      {/* =========================
          Final copy (ONE box)
         ========================= */}
      <Section title="Copy & Submit (2 Letters)">
        <p style={{ margin: 0 }}>
          Copy the two letters below and submit as your assignment.
        </p>

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
