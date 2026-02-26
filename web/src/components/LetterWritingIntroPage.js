import React, { memo, useMemo } from "react";
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
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Letter Writing — Read First</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Schreiben has two parts: Teil 1 (Formular) and Teil 2 (Brief). Start with Teil 1 practice in the app,
          then move to formal and informal letters for submission.
        </p>
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
              <BulletList items={TEIL1_FORM_SAMPLE} />
            </InfoBox>

            <InfoBox title="Goethe sample (direct)">
              <div style={{ lineHeight: 1.6 }}>
                You can also view a direct sample from the Goethe website here: {" "}
                <a href="https://bfu.goethe.de/a1_sd1/schreiben.php" target="_blank" rel="noreferrer">
                  https://bfu.goethe.de/a1_sd1/schreiben.php
                </a>
              </div>
            </InfoBox>

            <InfoBox title="Form snippet (what to fill)">
              <div style={{ display: "grid", gap: 8, lineHeight: 1.6 }}>
                <div>
                  <strong>Anmeldung zur Bodensee-Rundfahrt</strong>
                </div>
                <div>Name: Kadavy, Eva (Beispiel)</div>
                <div>Anzahl der Personen: (1)</div>
                <div>Davon Kinder: (2)</div>
                <div>Ferienadresse: Hotel Schönblick, Burgstraße 34, 78014 (3)</div>
                <div>Zahlungsweise: (4) / Kreditkarte</div>
                <div>Reisetermin: (5)</div>
              </div>
            </InfoBox>

            <InfoBox title="Antworten (erst nach dem Versuch prüfen)">
              <BulletList items={TEIL1_SOLUTIONS} />
            </InfoBox>

            <InfoBox title="How to think in Teil 1">
              <BulletList
                items={[
                  "Count all people carefully (parents + children) before writing numbers.",
                  "For place fields, combine PLZ + Urlaubsort exactly as given in the text.",
                  "If the task says no credit card, select/pay with ‘bar’.",
                  "For dates, use the exact day phrase from the prompt (e.g., nächsten Sonntag).",
                ]}
              />
            </InfoBox>
          </Section>

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
