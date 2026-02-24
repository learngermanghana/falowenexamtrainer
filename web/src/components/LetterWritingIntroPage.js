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

const Tabs = ({ value, onChange, tabs }) => (
  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
    {tabs.map((t) => (
      <button
        key={t.value}
        type="button"
        onClick={() => onChange(t.value)}
        style={{
          ...styles.secondaryButton,
          width: "fit-content",
          borderColor: value === t.value ? "#111827" : undefined,
          fontWeight: value === t.value ? 900 : 600,
        }}
      >
        {t.label}
      </button>
    ))}
  </div>
);

const InfoBox = ({ title, children }) => (
  <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, display: "grid", gap: 8 }}>
    {title && <div style={{ fontWeight: 900 }}>{title}</div>}
    {children}
  </div>
);

const BulletList = ({ items }) => (
  <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8 }}>
    {items.map((x, i) => (
      <li key={`${i}-${String(x).slice(0, 20)}`}>{x}</li>
    ))}
  </ul>
);

const RuleParagraphs = ({ items }) => (
  <div style={{ display: "grid", gap: 8 }}>
    {items.map((item, index) => (
      <p key={`${index}-${item.label}`} style={{ margin: 0, lineHeight: 1.6 }}>
        <strong>{item.label}:</strong> {item.text}
      </p>
    ))}
  </div>
);

const QuestionCard = ({ q, value, onChange }) => (
  <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, display: "grid", gap: 10 }}>
    <div style={{ fontWeight: 900 }}>{q.title}</div>

    {q.hint && (
      <div style={{ borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0", padding: 10 }}>
        <div style={{ fontWeight: 900, marginBottom: 6 }}>Hint</div>
        <div style={{ opacity: 0.95, lineHeight: 1.5 }}>{q.hint}</div>
      </div>
    )}

    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={q.rows ?? 3}
      placeholder={q.placeholder ?? "Type your answer in German..."}
      style={{
        width: "100%",
        borderRadius: 10,
        border: "1px solid #d1d5db",
        padding: 10,
        fontFamily: q.mono ? "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" : undefined,
      }}
    />
  </div>
);

/** =========================
 *  Page
 *  ========================= */
const A1LetterWritingQuestionBookPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("learn"); // learn | submit

  /** =========================
   *  READ-FIRST CONTENT (your exact text)
   *  ========================= */
  const FORMAL_STRUCTURE = useMemo(
    () => [
      { label: "Sehr geehrte Frau + Name", text: "Use this for female." },
      { label: "Sehr geehrter Herr + Name", text: "Use this for male." },
      {
        label: "Sehr geehrte Damen und Herren",
        text: "Use this if the receiver is unknown (e.g., school or travel agency).",
      },
      {
        label: "Opening",
        text: "Ich hoffe, es geht Ihnen gut. Ich schreibe Ihnen, weil [reason for writing].",
      },
      { label: "Weil rule", text: "Move the verb (or main verb after modal) to the end." },
      {
        label: "Example 1",
        text: "Ich kann nicht kommen… → Ich schreibe Ihnen, weil ich nicht kommen kann.",
      },
      { label: "Example 2", text: "Ich komme nicht… → Ich schreibe Ihnen, weil ich nicht komme." },
      {
        label: "Tip",
        text: 'Often you can start with "Ich" and end with "möchte" because of "weil". Example: Ich schreibe Ihnen, weil ich den Termin absagen möchte.',
      },
      {
        label: "Main Body",
        text: "Use these conjunctions: Ich möchte wissen, ob / deshalb / weil.",
      },
      { label: "Conclusion (don’t change)", text: "Ich freue mich im Voraus auf Ihre Antwort." },
      { label: "Closing", text: "Mit freundlichen Grüßen," },
      { label: "Signature", text: "[Your Full Name]" },
    ],
    []
  );

  const INFORMAL_STRUCTURE = useMemo(
    () => [
      { label: "Hallo [Name]", text: "Can be used for both male and female." },
      { label: "Liebe / Lieber [Recipient’s First Name]", text: "Liebe for female, Lieber for male." },
      {
        label: "Opening",
        text: "Wie geht es dir? Ich hoffe, es geht dir gut. Ich schreibe dir, weil [reason for writing].",
      },
      { label: "Weil rule", text: "Move the verb (or main verb after modal) to the end." },
      { label: "Example 1", text: "Ich kann nicht kommen… → Ich schreibe dir, weil ich nicht kommen kann." },
      { label: "Example 2", text: "Ich komme nicht… → Ich schreibe dir, weil ich nicht komme." },
      {
        label: "Tip",
        text: 'Often you can start with "Ich" and end with "möchte" because of "weil". Example: Ich schreibe dir, weil ich den Termin absagen möchte.',
      },
      {
        label: "Main Body",
        text: "Use these conjunctions: Ich möchte wissen, ob / deshalb / weil.",
      },
      { label: "Conclusion (don’t change)", text: "Ich freue mich im Voraus auf deine Antwort." },
      { label: "Closing", text: "Liebe Grüße / Viele Grüße (you can use any)." },
      { label: "Signature", text: "[Your First Name]" },
    ],
    []
  );

  /** =========================
   *  QUESTION BOOK (READ ONLY)
   *  ========================= */
  const BIRTHDAY_STEPS = useMemo(
    () => [
      "Introduction: Start with an informal greeting and a short opening (How are you? / I hope you are well / reason for writing).",
      "Body: Give birthday wishes and ask where the party is planned.",
      "Body: Ask if you can come with your family and add one extra sentence (for example: Wir fahren mit dem Auto).",
      "Conclusion: End politely with ‘Ich freue mich im Voraus auf deine Antwort.’",
      "Conclusion: Close with ‘Viele Grüße’ (or ‘Liebe Grüße’) and your first name.",
    ],
    []
  );

  const BIRTHDAY_SAMPLE = useMemo(
    () => [
      "Warum schreiben Sie?",
      "Gratulieren Sie ihm.",
      "Fragen Sie: ob er eine Feier plant?",
    ],
    []
  );

  const FORMAL_STEPS = useMemo(
    () => [
      "Introduction: Start with a formal greeting (‘Sehr geehrte Damen und Herren’) and opening sentence.",
      "Introduction: State why you are writing using ‘Ich schreibe Ihnen, weil ...’.",
      "Body: Request information about German courses (Könnten Sie mir bitte Informationen über ... geben?).",
      "Body: Ask about course dates, prices, and payment methods.",
      "Conclusion: End with ‘Ich freue mich im Voraus auf Ihre Antwort.’ + ‘Mit freundlichen Grüßen’ and your full name.",
    ],
    []
  );

  const FORMAL_SAMPLE = useMemo(
    () => [
      "Warum schreiben Sie?",
      "Bitten Sie um Informationen über Kurse.",
      "Fragen Sie nach Kursterminen, Preisen und Zahlungsmethoden.",
    ],
    []
  );

  /** =========================
   *  SUBMIT TAB QUESTIONS (students type here)
   *  ========================= */
  const birthdayQuestions = useMemo(
    () => [
      {
        key: "bq1",
        title: 'Q1) Start the letter to your friend Max (use "Lieber" or "Liebe").',
        hint: 'Male: "Lieber Max," | Female: "Liebe Anna,"',
        placeholder: "Lieber Max,",
      },
      {
        key: "bq2",
        title: 'Q2) Translate: "How are you? I hope you are well. I am writing to you because..."',
        hint:
          'Use: "Wie geht es dir? Ich hoffe, es geht dir gut. Ich schreibe dir, weil ..." (weil verb at the end)',
        rows: 4,
      },
      {
        key: "bq3",
        title: "Q3) Rearrange and write the correct sentence (modal verb rule).",
        hint: "Words: gratulieren, Ich, dir, möchte, Geburtstag, zu deinem.",
        placeholder: "Ich möchte dir zu deinem Geburtstag gratulieren.",
        mono: true,
      },
      {
        key: "bq4",
        title: 'Q4) How do you say "Happy Birthday" in German?',
        placeholder: "Alles Gute zum Geburtstag!",
      },
      {
        key: "bq5",
        title: "Q5) Ask: Where are you planning the party? (W-question rule, end with: die Feier)",
        hint: 'Start with "Wo" and use "planen".',
        placeholder: "Wo planst du die Feier?",
      },
      {
        key: "bq6",
        title: "Q6) Ask: Can I come with my family? (modal question rule + main verb “kommen”)",
        hint: 'Use: "Kann ich ... mit meiner Familie ... kommen?" (main verb at the end)',
        placeholder: "Kann ich mit meiner Familie kommen?",
      },
      {
        key: "bq7",
        title: 'Q7) Translate: "We drive with the car." (fahren + Auto)',
        placeholder: "Wir fahren mit dem Auto.",
      },
      {
        key: "bq8",
        title: 'Q8) End sentence: "I look forward to your reply in advance."',
        placeholder: "Ich freue mich im Voraus auf deine Antwort.",
      },
      {
        key: "bq9",
        title: 'Q9) Closing: write "Viele Grüße" and sign with your first name.',
        placeholder: "Viele Grüße,\nFelix",
        rows: 3,
      },
    ],
    []
  );

  const formalQuestions = useMemo(
    () => [
      {
        key: "fq1",
        title: "Q1) Start a formal letter to a language school (unknown receiver).",
        hint: 'Use: "Sehr geehrte Damen und Herren,"',
        placeholder: "Sehr geehrte Damen und Herren,",
      },
      {
        key: "fq2",
        title:
          'Q2) Write: "I hope you are well." + explain why you are writing using "Ich schreibe Ihnen, weil..."',
        hint:
          'Use "Anfragen stellen". Example: "Ich schreibe Ihnen, weil ich Anfragen stellen möchte." (weil → verb at end)',
        rows: 4,
      },
      {
        key: "fq3",
        title: "Q3) Formally ask for course information (modal verb + geben at the end).",
        hint: 'Pattern: "Könnten Sie mir bitte Informationen über ... geben?"',
        placeholder: "Könnten Sie mir bitte Informationen über Ihre Deutschkurse geben?",
        rows: 3,
      },
      {
        key: "fq4",
        title: "Q4) Ask about prices + payment options (credit card or cash).",
        hint: 'Use: "Wie viel kostet ...?" + "Wie soll ich bezahlen? Mit Kreditkarte oder bar?"',
        rows: 4,
      },
      {
        key: "fq5",
        title: "Q5) Ask about course dates (Kurstermine).",
        hint: 'Use: "Könnten Sie mir auch die Kurstermine mitteilen?"',
        placeholder: "Könnten Sie mir auch die Kurstermine mitteilen?",
      },
      {
        key: "fq6",
        title: "Q6) Polite conclusion (don’t change).",
        placeholder: "Ich freue mich im Voraus auf Ihre Antwort.",
      },
      {
        key: "fq7",
        title: 'Q7) Closing: write "Mit freundlichen Grüßen" and sign with your full name.',
        placeholder: "Mit freundlichen Grüßen,\nFelix Asadu",
        rows: 3,
      },
    ],
    []
  );

  /** =========================
   *  Answers state (Submit tab)
   *  ========================= */
  const [birthdayAns, setBirthdayAns] = useState(() =>
    Object.fromEntries(birthdayQuestions.map((q) => [q.key, ""]))
  );
  const [formalAns, setFormalAns] = useState(() =>
    Object.fromEntries(formalQuestions.map((q) => [q.key, ""]))
  );

  const copySubmit = async () => {
    const pack = [
      "=== Birthday Letter Question Book (Answers) ===",
      ...birthdayQuestions.map((q) => `${q.title}\n${birthdayAns[q.key] || ""}\n`),
      "\n=== Formal Letter Question Book (Answers) ===",
      ...formalQuestions.map((q) => `${q.title}\n${formalAns[q.key] || ""}\n`),
    ].join("\n");

    try {
      await navigator.clipboard.writeText(pack);
      alert("Copied answers!");
    } catch {
      alert("Copy failed. Please copy manually.");
    }
  };

  /** =========================
   *  Vocabulary list (read only)
   *  ========================= */
  const VOCAB_LIST = useMemo(
    () => ({
      separable: [
        "Abholen – to pick up/take",
        "Anmelden – to register",
        "Anmachen – to switch on",
        "Ausmachen – to switch off",
        "Anreisen – to arrive",
        "Ankommen – to arrive",
        "Abreisen – to depart",
        "Absagen – to cancel",
        "Zusagen – to accept",
        "Zumachen – to close",
        "Aufmachen – to open",
        "Einsteigen – to enter (e.g., a car)",
        "Umsteigen – to change (e.g., trains)",
        "Aussteigen – to get out/drop off",
        "Vereinbaren – to arrange",
        "Einladen – to invite",
        "Gratulieren – to congratulate",
      ],
      key: [
        "Günstig/Billig – cheap",
        "Koffer – suitcase",
        "Feiern – to celebrate",
        "Übernachten – stay overnight",
        "Angebot – offer",
        "Ferien – vacation",
        "Wanderung – hiking",
        "Führerschein – license",
        "Urlaub – vacation",
        "Meer – sea",
        "Ausland – abroad",
        "Ausflug – excursion",
        "Das Wetter – weather",
        "Die Sonne – sun",
        "Der Regen – rain",
        "Der Schnee – snow",
        "Der Wind – wind",
        "Die Wolke – cloud",
        "Das Gewitter – thunderstorm",
        "Der Sturm – storm",
        "Die Temperatur – temperature",
        "Der Himmel – sky",
      ],
      additional: [
        "Die Ankunft – arrival",
        "Die Abreise – departure",
        "Die Absage – cancellation",
        "Die Anreise – arrival (travel)",
        "Das Angebot – offer",
        "Die Wanderung – hike",
        "Der Führerschein – driver’s license",
        "Der Urlaub – vacation",
        "Das Meer – sea",
        "Das Ausland – abroad",
        "Der Ausflug – excursion",
        "Der Kurs – course",
        "Die Anmeldung – registration",
        "Die Gebühr – fee",
        "Das Formular – form",
        "Das Büro – office",
        "Der Lehrer / die Lehrerin – teacher",
        "Der Teilnehmer / die Teilnehmerin – participant",
        "Die Bestätigung – confirmation",
      ],
      occasions: [
        "Die Glückwünsche – congratulations",
        "Die Hochzeit – wedding",
        "Alles Gute zum Geburtstag – Happy Birthday",
        "Herzlichen Glückwunsch – Congratulations",
        "Der Geburtstag – birthday",
        "Die Feier – celebration",
      ],
    }),
    []
  );

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Letter Writing — Read First, Then Submit</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Students must read the structures and question books first. Answers are typed only in the Submit tab.
        </p>

        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { value: "learn", label: "📘 Learn (Read)" },
            { value: "submit", label: "📝 Submit Answers" },
          ]}
        />
      </header>

      {tab === "learn" && (
        <>
          <Section title="Formal Letter Structure (Read First)">
            <InfoBox title="Structure + Rules">
              <RuleParagraphs items={FORMAL_STRUCTURE} />
            </InfoBox>
          </Section>

          <Section title="Informal Letter Structure (Read First)">
            <InfoBox title="Structure + Rules">
              <RuleParagraphs items={INFORMAL_STRUCTURE} />
            </InfoBox>
          </Section>

          <Section title="Assignment 1 — Birthday Letter Question Book (Read First)">
            <InfoBox title="Instructions (Steps)">
              <BulletList items={BIRTHDAY_STEPS} />
              <div style={{ marginTop: 8, opacity: 0.9 }}>
                Encouragement: Take your time and use the hints. Practice makes perfect.
              </div>
            </InfoBox>

            <InfoBox title="Sample Question">
              <div style={{ marginBottom: 8 }}>Ihr Freund hat Geburtstag. Schreiben Sie an Ihren Freund:</div>
              <BulletList items={BIRTHDAY_SAMPLE} />
            </InfoBox>

            <InfoBox title="Important tip (for this assignment)">
              <div style={{ lineHeight: 1.6 }}>
                Don’t rush to submit. Read the structure again, then answer in full sentences. Use <strong>weil</strong>{" "}
                and place the verb at the end.
              </div>
            </InfoBox>

            <InfoBox title="Write your letter in 3 clear parts">
              <div style={{ display: "grid", gap: 8, lineHeight: 1.6 }}>
                <div>
                  <strong>1) Introduction:</strong> Greeting + opening sentences + reason for writing.
                </div>
                <div>
                  <strong>2) Body:</strong> Main message (birthday wishes, questions, and details).
                </div>
                <div>
                  <strong>3) Conclusion:</strong> Polite ending sentence + closing phrase + your name.
                </div>
              </div>
            </InfoBox>

            <div style={{ borderRadius: 10, background: "#fff7ed", border: "1px solid #fdba74", padding: 10 }}>
              ✅ When you finish reading, go to <strong>Submit Answers</strong> tab and type your answers.
            </div>
          </Section>

          <Section title="Assignment 2 — Formal Letter Question Book (Read First)">
            <InfoBox title="Instructions (Steps)">
              <BulletList items={FORMAL_STEPS} />
              <div style={{ marginTop: 8, opacity: 0.9 }}>
                Encouragement: Use formal language and include the required details.
              </div>
            </InfoBox>

            <InfoBox title="Sample Question">
              <div style={{ marginBottom: 8 }}>
                Sie möchten einen Deutschkurs besuchen. Schreiben Sie an die Sprachschule:
              </div>
              <BulletList items={FORMAL_SAMPLE} />
            </InfoBox>

            <InfoBox title="Write your letter in 3 clear parts">
              <div style={{ display: "grid", gap: 8, lineHeight: 1.6 }}>
                <div>
                  <strong>1) Introduction:</strong> Formal greeting + polite opening + reason for writing.
                </div>
                <div>
                  <strong>2) Body:</strong> Ask for required information (courses, dates, price, payment).
                </div>
                <div>
                  <strong>3) Conclusion:</strong> Fixed polite sentence + formal sign-off + full name.
                </div>
              </div>
            </InfoBox>

            <div style={{ borderRadius: 10, background: "#fff7ed", border: "1px solid #fdba74", padding: 10 }}>
              ✅ When you finish reading, go to <strong>Submit Answers</strong> tab and type your answers.
            </div>
          </Section>

          <Section title="Essential A1 Vocabulary List (Read & use in your answers)">
            <InfoBox title="Separable Verbs (Trennbare Verben)">
              <BulletList items={VOCAB_LIST.separable} />
            </InfoBox>
            <InfoBox title="Key Vocabulary">
              <BulletList items={VOCAB_LIST.key} />
            </InfoBox>
            <InfoBox title="Additional Words">
              <BulletList items={VOCAB_LIST.additional} />
            </InfoBox>
            <InfoBox title="Special Occasions">
              <BulletList items={VOCAB_LIST.occasions} />
            </InfoBox>
          </Section>
        </>
      )}

      {tab === "submit" && (
        <>
          <Section title="Submit Answers (Birthday Letter — Question Book)">
            <div style={{ borderRadius: 10, background: "#ecfeff", border: "1px solid #67e8f9", padding: 10 }}>
              Tip: Answer in full sentences. Check <strong>weil</strong> verb-at-the-end before submitting.
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {birthdayQuestions.map((q) => (
                <QuestionCard
                  key={q.key}
                  q={q}
                  value={birthdayAns[q.key]}
                  onChange={(val) => setBirthdayAns((prev) => ({ ...prev, [q.key]: val }))}
                />
              ))}
            </div>
          </Section>

          <Section title="Submit Answers (Formal Letter — Question Book)">
            <div style={{ borderRadius: 10, background: "#f0fdf4", border: "1px solid #86efac", padding: 10 }}>
              Tip: Use <strong>Sie/Ihnen/Ihre</strong>. Don’t use du/dir/dein in a formal letter.
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {formalQuestions.map((q) => (
                <QuestionCard
                  key={q.key}
                  q={q}
                  value={formalAns[q.key]}
                  onChange={(val) => setFormalAns((prev) => ({ ...prev, [q.key]: val }))}
                />
              ))}
            </div>
          </Section>

          <Section title="Copy Answers (Optional)">
            <p style={{ margin: 0 }}>
              If you want, copy your answers and paste into your submission system.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" style={{ ...styles.primaryButton, width: "fit-content" }} onClick={copySubmit}>
                Copy all answers
              </button>
              <button
                type="button"
                style={{ ...styles.secondaryButton, width: "fit-content" }}
                onClick={() => navigate("/campus/submit")}
              >
                Go to Submit Assignment Page
              </button>
            </div>
          </Section>
        </>
      )}
    </main>
  );
};

export default memo(A1LetterWritingQuestionBookPage);
