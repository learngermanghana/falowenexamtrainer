import React, { memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const heroImageUrl =
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1800&q=80";

const heroCardStyle = {
  ...styles.card,
  padding: 0,
  overflow: "hidden",
};

const heroLayoutStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  alignItems: "stretch",
};

const heroContentStyle = {
  padding: 24,
  display: "grid",
  gap: 14,
  background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 60%, #f8fafc 100%)",
};

const heroEyebrowStyle = {
  display: "inline-flex",
  alignItems: "center",
  width: "fit-content",
  padding: "6px 12px",
  borderRadius: 999,
  background: "#dbeafe",
  color: "#1d4ed8",
  fontWeight: 700,
  fontSize: 13,
};

const heroImageStyle = {
  width: "100%",
  height: "100%",
  minHeight: 260,
  objectFit: "cover",
};

const heroHighlightsStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: 10,
};

const heroHighlightCardStyle = {
  border: "1px solid #dbeafe",
  borderRadius: 14,
  padding: 12,
  background: "rgba(255,255,255,0.85)",
  display: "grid",
  gap: 4,
};


const teil1ScenarioGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 10,
};

const teil1ScenarioCardStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  padding: 14,
  background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
  display: "grid",
  gap: 8,
};

const teil1ScenarioNumberStyle = {
  width: 28,
  height: 28,
  borderRadius: 999,
  background: "#dbeafe",
  color: "#1d4ed8",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  fontSize: 14,
};

const teil1FormCardStyle = {
  border: "1px solid #cbd5e1",
  borderRadius: 18,
  padding: 18,
  background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
  display: "grid",
  gap: 14,
  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
};

const teil1FormHeaderStyle = {
  display: "grid",
  gap: 6,
  paddingBottom: 12,
  borderBottom: "1px solid #e2e8f0",
};

const teil1FormGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 12,
};

const teil1FieldCardStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  padding: 12,
  background: "#ffffff",
  display: "grid",
  gap: 8,
};

const teil1FieldLabelStyle = {
  fontWeight: 700,
  color: "#0f172a",
};

const teil1FieldValueStyle = {
  color: "#334155",
  lineHeight: 1.6,
};

const teil1AnswerBlankStyle = {
  minHeight: 44,
  borderRadius: 12,
  border: "1.5px dashed #60a5fa",
  background: "#eff6ff",
  display: "flex",
  alignItems: "center",
  padding: "0 12px",
  fontWeight: 700,
  color: "#1d4ed8",
};

const teil1HintBoxStyle = {
  borderRadius: 14,
  border: "1px solid #bfdbfe",
  background: "#eff6ff",
  padding: 14,
  display: "grid",
  gap: 8,
};

/** =========================
 *  Helpers
 *  ========================= */
const Section = ({ title, children }) => (
  <section style={{ ...styles.card, display: "grid", gap: 10 }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
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


const Teil1FormField = ({ label, prompt, answerHint }) => (
  <div style={teil1FieldCardStyle}>
    <div style={teil1FieldLabelStyle}>{label}</div>
    <div style={teil1FieldValueStyle}>{prompt}</div>
    <div style={teil1AnswerBlankStyle}>{answerHint}</div>
  </div>
);

/** =========================
 *  Page
 *  ========================= */
const A1LetterWritingQuestionBookPage = () => {
  const navigate = useNavigate();

  const TEIL1_FORM_SAMPLE = useMemo(
    () => [
      "Ihre Bekannte Eva Kadavy verbringt mit ihrem Ehemann und zwei Söhnen (8 und 11 Jahre) Ferien in Seeheim.",
      "Im Reisebüro reserviert sie für den kommenden Sonntag eine Rundfahrt am Bodensee.",
      "Eva Kadavy kann nicht mit Kreditkarte bezahlen.",
      "Ergänzen Sie für sie die fünf fehlenden Angaben im Anmeldeformular.",
    ],
    []
  );

  const TEIL1_SOLUTIONS = useMemo(
    () => [
      "(1) Anzahl der Personen: 4 / vier",
      "(2) Davon Kinder: 2 / zwei",
      "(3) PLZ, Urlaubsort: 78014 Seeheim",
      "(4) Zahlungsweise: bar",
      "(5) Reisetermin: Sonntag / nächsten Sonntag",
    ],
    []
  );

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
        text: "Structure + Rules: write 5 or 6 words, follow statement rule, question rule, yes/no-question rule, and modal-verb statement rule.",
      },
      { label: "Conclusion (don’t change)", text: "Ich freue mich im Voraus auf Ihre Antwort." },
      { label: "Closing", text: "Mit freundlichen Grüßen," },
      {
        label: "Opening/Closing split",
        text: "Keep formal style together: use Ihnen + Mit freundlichen Grüßen. Do not mix formal opening with informal closing.",
      },
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
        text: "Structure + Rules: write 5 or 6 words, follow statement rule, question rule, yes/no-question rule, and modal-verb statement rule.",
      },
      { label: "Conclusion (don’t change)", text: "Ich freue mich im Voraus auf deine Antwort." },
      { label: "Closing", text: "Liebe Grüße / Viele Grüße (you can use any)." },
      {
        label: "Opening/Closing split",
        text: "Keep informal style together: use dir + Liebe Grüße/Viele Grüße. Do not mix informal opening with formal closing.",
      },
      { label: "Signature", text: "[Your First Name]" },
    ],
    []
  );

  
  const FORMAL_FULL_SAMPLE = useMemo(
    () => [
      "Sehr geehrte Damen und Herren,",
      "",
      "Ich hoffe, es geht Ihnen gut.",
      "Ich schreibe Ihnen, weil ich lerne.",
      "Wie viel kostet das?",
      "Wie soll ich bezahlen?",
      "Mit Kreditkarte oder bar?",
      "",
      "Ich freue mich im Voraus auf Ihre Antwort.",
      "Mit freundlichen Grüßen,",
      "Max Mustermann",
    ],
    []
  );

  const INFORMAL_FULL_SAMPLE = useMemo(
    () => [
      "Hallo Anna,",
      "",
      "Wie geht es dir?",
      "Ich hoffe, es geht dir gut.",
      "Ich schreibe dir, weil ich komme.",
      "Wann beginnt deine Feier?",
      "Kann ich meine Familie mitbringen?",
      "",
      "Ich freue mich im Voraus auf deine Antwort.",
      "Viele Grüße",
      "Mia",
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
      <header style={heroCardStyle}>
        <div style={heroLayoutStyle}>
          <div style={heroContentStyle}>
            <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
              Back to Course
            </button>
            <span style={heroEyebrowStyle}>A1 Schreiben • Day 12.3</span>
            <div style={{ display: "grid", gap: 10 }}>
              <h1 style={{ ...styles.title, marginBottom: 0 }}>Letter Writing — Read First</h1>
              <p style={{ ...styles.subtitle, margin: 0 }}>
                Master both parts of A1 Schreiben with a clear path: practice forms first, then build confident
                formal and informal letters for submission.
              </p>
            </div>
            <div style={heroHighlightsStyle}>
              {[
                { label: "Teil 1", text: "Read short prompts and complete important form details accurately." },
                { label: "Teil 2", text: "Use the right opening, word order, and closing in every letter." },
                { label: "Goal", text: "Move from guided examples to ready-to-submit writing practice." },
              ].map((item) => (
                <div key={item.label} style={heroHighlightCardStyle}>
                  <strong style={{ fontSize: 14 }}>{item.label}</strong>
                  <span style={{ lineHeight: 1.5, color: "#334155" }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <img
            src={heroImageUrl}
            alt="Notebook, pen, and coffee for German letter-writing practice"
            style={heroImageStyle}
          />
        </div>
      </header>

      <>
          <Section title="How Schreiben works (A1 exam)">
            <InfoBox title="Two parts you must know">
              <div style={{ display: "grid", gap: 8, lineHeight: 1.6 }}>
                <div>
                  <strong>Teil 1:</strong> Formular ausfüllen (forms). You read a short situation and write missing
                  details in the form.
                </div>
                <div>
                  <strong>Teil 2:</strong> Brief schreiben (letter writing). This is where you write a complete formal
                  or informal text.
                </div>
              </div>
            </InfoBox>
            <InfoBox title="Important for this course">
              <div style={{ lineHeight: 1.6 }}>
                Teil 1 is available as <strong>in-app practice</strong> with answers shown after you click to check.
                The assignment you submit is focused on <strong>formal and informal writing (Teil 2)</strong>.
              </div>
            </InfoBox>
          </Section>

          <Section title="Teil 1 Practice — Formular (Bodensee-Rundfahrt)">
            <InfoBox title="Practice scenario">
              <div style={teil1ScenarioGridStyle}>
                {TEIL1_FORM_SAMPLE.map((item, index) => (
                  <div key={item} style={teil1ScenarioCardStyle}>
                    <span style={teil1ScenarioNumberStyle}>{index + 1}</span>
                    <div style={{ lineHeight: 1.6 }}>{item}</div>
                  </div>
                ))}
              </div>
            </InfoBox>

            <InfoBox title="Goethe sample (direct)">
              <div style={{ lineHeight: 1.6 }}>
                You can also view a direct sample from the Goethe website here:{" "}
                <a href="https://bfu.goethe.de/a1_sd1/schreiben.php" target="_blank" rel="noreferrer">
                  https://bfu.goethe.de/a1_sd1/schreiben.php
                </a>
              </div>
            </InfoBox>

            <InfoBox title="Fill this form like the exam">
              <div style={teil1FormCardStyle}>
                <div style={teil1FormHeaderStyle}>
                  <strong style={{ fontSize: 18 }}>Anmeldung zur Bodensee-Rundfahrt</strong>
                  <span style={{ color: "#475569", lineHeight: 1.5 }}>
                    Read the scenario, then complete each missing detail exactly like you would in Teil 1 of the exam.
                  </span>
                </div>

                <div style={teil1FormGridStyle}>
                  <div style={teil1FieldCardStyle}>
                    <div style={teil1FieldLabelStyle}>Name</div>
                    <div style={teil1FieldValueStyle}>Kadavy, Eva (Beispiel)</div>
                  </div>

                  <Teil1FormField label="Anzahl der Personen" prompt="Write the total number of people travelling." answerHint="(1) ________" />
                  <Teil1FormField label="Davon Kinder" prompt="How many of those travellers are children?" answerHint="(2) ________" />
                  <Teil1FormField
                    label="Ferienadresse"
                    prompt="Hotel Schönblick, Burgstraße 34, 78014 ________"
                    answerHint="(3) ________"
                  />
                  <Teil1FormField label="Zahlungsweise" prompt="Choose the correct payment method: ________ / Kreditkarte" answerHint="(4) ________" />
                  <Teil1FormField label="Reisetermin" prompt="Enter the trip date or day mentioned in the task." answerHint="(5) ________" />
                </div>
              </div>
            </InfoBox>

            <InfoBox title="Antworten (erst nach dem Versuch prüfen)">
              <div style={teil1ScenarioGridStyle}>
                {TEIL1_SOLUTIONS.map((item) => (
                  <div key={item} style={{ ...teil1ScenarioCardStyle, gap: 6, borderColor: "#bfdbfe", background: "#eff6ff" }}>
                    <strong style={{ color: "#1d4ed8" }}>{item.split(":")[0]}</strong>
                    <span style={{ lineHeight: 1.6, color: "#1e3a8a" }}>{item.split(":").slice(1).join(":").trim()}</span>
                  </div>
                ))}
              </div>
            </InfoBox>

            <InfoBox title="How to think in Teil 1">
              <div style={teil1HintBoxStyle}>
                <strong>Quick method</strong>
                <BulletList
                  items={[
                    "Count all people carefully (parents + children) before writing numbers.",
                    "For place fields, combine PLZ + Urlaubsort exactly as given in the text.",
                    "If the task says no credit card, select/pay with ‘bar’.",
                    "For dates, use the exact day phrase from the prompt (e.g., nächsten Sonntag).",
                  ]}
                />
              </div>
            </InfoBox>
          </Section>

          <Section title="Formal Letter Structure (Read First)">
            <InfoBox title="Structure + Rules">
              <RuleParagraphs items={FORMAL_STRUCTURE} />
            </InfoBox>
            <InfoBox title="Very short A1 sample (formal)">
              <div style={{ whiteSpace: "pre-line", lineHeight: 1.6 }}>
                {FORMAL_FULL_SAMPLE.join("\n")}
              </div>
            </InfoBox>
          </Section>

          <Section title="Informal Letter Structure (Read First)">
            <InfoBox title="Structure + Rules">
              <RuleParagraphs items={INFORMAL_STRUCTURE} />
            </InfoBox>
            <InfoBox title="Very short A1 sample (informal)">
              <div style={{ whiteSpace: "pre-line", lineHeight: 1.6 }}>
                {INFORMAL_FULL_SAMPLE.join("\n")}
              </div>
            </InfoBox>
            <div style={{ marginTop: -8, opacity: 0.9 }}>
              Use the same rules above when answering the steps below.
            </div>
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
              ✅ When you finish reading, submit your work on the <strong>Submit Assignment</strong> page.
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
              ✅ When you finish reading, submit your work on the <strong>Submit Assignment</strong> page.
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
          <Section title="Next step">
            <p style={{ margin: 0 }}>
              After Teil 1 practice, write and submit your formal/informal letter assignment from the submission page.
            </p>
            <div>
              <button type="button" style={{ ...styles.primaryButton, width: "fit-content" }} onClick={() => navigate("/campus/submit")}>
                Go to Submit Assignment Page
              </button>
            </div>
          </Section>
      </>
    </main>
  );
};

export default memo(A1LetterWritingQuestionBookPage);
