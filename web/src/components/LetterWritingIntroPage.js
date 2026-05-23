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

const cleanIntroBoxStyle = {
  border: "1px solid #dbeafe",
  background: "#eff6ff",
  borderRadius: 14,
  padding: 14,
  lineHeight: 1.7,
  color: "#1e3a8a",
};

const sectionCardStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const infoBoxStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 14,
  display: "grid",
  gap: 10,
  background: "#fff",
};

const notesBannerStyle = {
  border: "1px solid #bfdbfe",
  background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
  borderRadius: 16,
  padding: 16,
  display: "grid",
  gap: 6,
};

const assignmentBannerStyle = {
  border: "1px solid #fb923c",
  background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 55%, #fed7aa 100%)",
  borderRadius: 18,
  padding: 18,
  display: "grid",
  gap: 10,
  boxShadow: "0 10px 25px rgba(249, 115, 22, 0.08)",
};

const assignmentBannerTopStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
};

const assignmentBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  borderRadius: 999,
  background: "#ea580c",
  color: "#fff",
  fontSize: 20,
  fontWeight: 800,
  flexShrink: 0,
};

const assignmentBannerTitleWrapStyle = {
  display: "grid",
  gap: 2,
};

const assignmentBannerTitleStyle = {
  margin: 0,
  fontSize: 20,
  fontWeight: 900,
  color: "#9a3412",
  lineHeight: 1.2,
};

const assignmentBannerSubtitleStyle = {
  margin: 0,
  color: "#b45309",
  fontSize: 14,
  fontWeight: 700,
};

const assignmentBannerTextStyle = {
  color: "#7c2d12",
  lineHeight: 1.7,
  fontSize: 15,
};

const assignmentBannerActionRowStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  alignItems: "center",
};

const assignmentMiniPillStyle = {
  display: "inline-flex",
  alignItems: "center",
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.72)",
  border: "1px solid #fdba74",
  color: "#9a3412",
  fontSize: 13,
  fontWeight: 700,
};

const assignmentCardStyle = {
  border: "1px solid #fed7aa",
  background: "#fffaf5",
  borderRadius: 14,
  padding: 14,
  display: "grid",
  gap: 10,
};

const scenarioTextStyle = {
  lineHeight: 1.8,
  fontSize: 16,
  color: "#0f172a",
};

const formWrapStyle = {
  border: "1px solid #cbd5e1",
  borderRadius: 16,
  overflow: "hidden",
  background: "#fff",
};

const formHeaderStyle = {
  padding: "14px 16px",
  background: "#f8fafc",
  borderBottom: "1px solid #e5e7eb",
  display: "grid",
  gap: 4,
};

const formTableStyle = {
  display: "grid",
  gap: 0,
};

const formRowStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(120px, 180px) 1fr minmax(110px, 160px)",
  borderBottom: "1px solid #e5e7eb",
};

const mobileFormRowStyle = {
  display: "grid",
  gridTemplateColumns: "1fr",
  borderBottom: "1px solid #e5e7eb",
};

const formLabelStyle = {
  padding: 12,
  fontWeight: 800,
  background: "#f8fafc",
};

const formPromptStyle = {
  padding: 12,
  lineHeight: 1.6,
};

const formAnswerStyle = {
  padding: 12,
  borderLeft: "1px solid #e5e7eb",
  color: "#64748b",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  background: "#fcfcfd",
  fontWeight: 700,
};

const mobileFormAnswerStyle = {
  padding: 12,
  color: "#64748b",
  display: "flex",
  alignItems: "center",
  background: "#fcfcfd",
  borderTop: "1px dashed #cbd5e1",
  fontWeight: 700,
};

const answersGridStyle = {
  display: "grid",
  gap: 10,
};

const answerCardStyle = {
  border: "1px solid #bfdbfe",
  background: "#eff6ff",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 4,
};

const phraseSectionGridStyle = {
  display: "grid",
  gap: 12,
};

const phraseCategoryStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 12,
  background: "#fff",
  display: "grid",
  gap: 10,
};

const phraseCategoryTitleStyle = {
  margin: 0,
  fontSize: 16,
  fontWeight: 800,
  color: "#0f172a",
};

const mobilePhraseListStyle = {
  display: "grid",
  gap: 10,
};

const mobilePhraseCardStyle = {
  border: "1px solid #dbeafe",
  background: "#f8fbff",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 6,
};

const mobilePhraseGermanStyle = {
  fontWeight: 800,
  color: "#1e3a8a",
  lineHeight: 1.5,
  fontSize: 15,
};

const mobilePhraseMeaningStyle = {
  color: "#475569",
  fontSize: 14,
  lineHeight: 1.5,
};

const mobilePhraseExampleStyle = {
  color: "#0f172a",
  fontSize: 14,
  lineHeight: 1.6,
  paddingTop: 4,
  borderTop: "1px dashed #cbd5e1",
};

const mobileTipStyle = {
  border: "1px solid #fde68a",
  background: "#fffbeb",
  borderRadius: 12,
  padding: 12,
  lineHeight: 1.7,
  color: "#92400e",
};

const noteStyle = {
  borderLeft: "4px solid #2563eb",
  paddingLeft: 12,
  color: "#334155",
  lineHeight: 1.6,
};

const exampleBlockStyle = {
  border: "1px solid #dbeafe",
  background: "#f8fbff",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 8,
};

const simpleGridStyle = {
  display: "grid",
  gap: 10,
};

const Section = ({ title, children }) => (
  <section style={sectionCardStyle}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const InfoBox = ({ title, children }) => (
  <div style={infoBoxStyle}>
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
      <p key={`${index}-${item.label}`} style={{ margin: 0, lineHeight: 1.65 }}>
        <strong>{item.label}:</strong> {item.text}
      </p>
    ))}
  </div>
);

const ResponsiveFormRow = ({ label, prompt, answerHint, isStatic = false }) => (
  <>
    <div className="desktop-form-row" style={formRowStyle}>
      <div style={formLabelStyle}>{label}</div>
      <div style={formPromptStyle}>{prompt}</div>
      <div style={formAnswerStyle}>{isStatic ? "" : answerHint}</div>
    </div>

    <div className="mobile-form-row" style={mobileFormRowStyle}>
      <div style={formLabelStyle}>{label}</div>
      <div style={formPromptStyle}>{prompt}</div>
      {!isStatic ? <div style={mobileFormAnswerStyle}>{answerHint}</div> : null}
    </div>
  </>
);

const A1LetterWritingQuestionBookPage = () => {
  const navigate = useNavigate();

  const TEIL1_SCENARIO_TEXT = useMemo(
    () =>
      "Ihre Bekannte Eva Kadavy verbringt mit ihrem Ehemann und zwei Söhnen (8 und 11 Jahre) Ferien in Seeheim. Im Reisebüro reserviert sie für den kommenden Sonntag eine Rundfahrt am Bodensee. Eva Kadavy kann nicht mit Kreditkarte bezahlen. Ergänzen Sie für sie die fünf fehlenden Angaben im Anmeldeformular.",
    []
  );

  const TEIL1_SOLUTIONS = useMemo(
    () => [
      { label: "(1) Anzahl der Personen", value: "4 / vier" },
      { label: "(2) Davon Kinder", value: "2 / zwei" },
      { label: "(3) PLZ, Urlaubsort", value: "78014 Seeheim" },
      { label: "(4) Zahlungsweise", value: "bar" },
      { label: "(5) Reisetermin", value: "Sonntag / nächsten Sonntag" },
    ],
    []
  );

  const FORMAL_STRUCTURE = useMemo(
    () => [
      { label: "Sehr geehrte Frau + Name", text: "Use this for a female person." },
      { label: "Sehr geehrter Herr + Name", text: "Use this for a male person." },
      {
        label: "Sehr geehrte Damen und Herren",
        text: "Use this if you do not know the name of the receiver, for example a school, office, or travel agency.",
      },
      {
        label: "Opening",
        text: "Start politely. Example: Ich hoffe, es geht Ihnen gut. Ich schreibe Ihnen, weil ...",
      },
      {
        label: "Weil rule",
        text: "After 'weil', the verb goes to the end of the sentence. The word that is usually conjugated after the subject now moves to the last position.",
      },
      {
        label: "Simple explanation",
        text: "Normal sentence: Ich komme nicht. After 'weil': ..., weil ich nicht komme. Normal sentence: Ich kann nicht kommen. After 'weil': ..., weil ich nicht kommen kann.",
      },
      {
        label: "Main Body",
        text: "Write your main message clearly. Ask for information, make a request, ask a question, or explain your reason for writing.",
      },
      {
        label: "Conclusion",
        text: "Use this fixed sentence: Ich freue mich im Voraus auf Ihre Antwort.",
      },
      { label: "Closing", text: "Use: Mit freundlichen Grüßen" },
      {
        label: "Opening/Closing split",
        text: "Keep the style formal from beginning to end. Use Ihnen + Ihre + Mit freundlichen Grüßen. Do not mix formal and informal style.",
      },
      { label: "Signature", text: "Write your full name." },
    ],
    []
  );

  const INFORMAL_STRUCTURE = useMemo(
    () => [
      { label: "Hallo [Name]", text: "You can use this for both male and female." },
      {
        label: "Liebe / Lieber [Name]",
        text: "Use Liebe for a female friend and Lieber for a male friend.",
      },
      {
        label: "Opening",
        text: "Start warmly. Example: Wie geht es dir? Ich hoffe, es geht dir gut. Ich schreibe dir, weil ...",
      },
      {
        label: "Weil rule",
        text: "After 'weil', the verb goes to the end of the sentence. The verb that is usually after the subject moves to the last position.",
      },
      {
        label: "Simple explanation",
        text: "Normal sentence: Ich komme morgen. After 'weil': ..., weil ich morgen komme. Normal sentence: Ich will dich besuchen. After 'weil': ..., weil ich dich besuchen will.",
      },
      {
        label: "Main Body",
        text: "Write your message clearly. Congratulate, invite, ask questions, or talk about plans.",
      },
      {
        label: "Conclusion",
        text: "Use this fixed sentence: Ich freue mich im Voraus auf deine Antwort.",
      },
      { label: "Closing", text: "Use: Liebe Grüße / Viele Grüße" },
      {
        label: "Opening/Closing split",
        text: "Keep the style informal from beginning to end. Use dir + deine + Liebe Grüße/Viele Grüße.",
      },
      { label: "Signature", text: "Write your first name." },
    ],
    []
  );

  const FORMAL_PHRASE_GROUPS = useMemo(
    () => [
      {
        title: "1. Why you are writing",
        items: [
          {
            german: "Ich schreibe Ihnen, weil ich eine Anfrage stellen möchte.",
            english: "I am writing because I would like to make an enquiry.",
            example: "Ich schreibe Ihnen, weil ich eine Anfrage zu Ihrem Kurs stellen möchte.",
          },
        ],
      },
      {
        title: "2. Asking for information",
        items: [
          {
            german: "Könnten Sie mir bitte Informationen über ... geben?",
            english: "Could you please give me information about ...?",
            example: "Könnten Sie mir bitte Informationen über Ihre Kurse geben?",
          },
        ],
      },
      {
        title: "3. Asking about price",
        items: [
          {
            german: "Wie viel kostet ...?",
            english: "How much does ... cost?",
            example: "Wie viel kostet der Deutschkurs?",
          },
          {
            german: "Wie kann ich bezahlen?",
            english: "How can I pay?",
            example: "Wie kann ich bezahlen?",
          },
        ],
      },
      {
        title: "4. Requests and appointments",
        items: [
          {
            german: "Ich möchte mich anmelden.",
            english: "I would like to register.",
            example: "Ich möchte mich für den Deutschkurs anmelden.",
          },
          {
            german: "Ich möchte einen Termin absagen.",
            english: "I would like to cancel an appointment.",
            example: "Ich möchte den Termin für Montag absagen.",
          },
        ],
      },
    ],
    []
  );

  const INFORMAL_PHRASES = useMemo(
    () => [
      "Ich gratuliere dir zum Geburtstag. (I congratulate you on your birthday.)",
      "Herzlichen Glückwunsch zum Geburtstag! (Happy birthday!)",
      "Ich wünsche dir alles Gute. (I wish you all the best.)",
      "Machst du eine Feier? (Are you having a celebration?)",
      "Wo findet die Feier statt? (Where does the celebration take place?)",
      "Kann ich mit meiner Familie kommen? (Can I come with my family?)",
      "Ich freue mich auf deine Feier. (I am looking forward to your celebration.)",
      "Ich komme mit meiner Familie. (I am coming with my family.)",
      "Wir fahren mit dem Auto. (We are driving by car.)",
    ],
    []
  );

  const WEIL_EXAMPLES = useMemo(
    () => [
      "Ich komme nicht. → Ich schreibe dir, weil ich nicht komme.",
      "Ich kann nicht kommen. → Ich schreibe dir, weil ich nicht kommen kann.",
      "Ich möchte eine Anfrage stellen. → Ich schreibe Ihnen, weil ich eine Anfrage stellen möchte.",
      "Ich brauche Informationen. → Ich schreibe Ihnen, weil ich Informationen brauche.",
      "Ich mache Ferien in Berlin. → Ich schreibe dir, weil ich Ferien in Berlin mache.",
      "Ich will dich besuchen. → Ich schreibe dir, weil ich dich besuchen will.",
    ],
    []
  );

  const FORMAL_FULL_SAMPLE = useMemo(
    () => [
      "Sehr geehrte Damen und Herren,",
      "",
      "ich hoffe, es geht Ihnen gut.",
      "Ich schreibe Ihnen, weil ich eine Anfrage stellen möchte.",
      "Könnten Sie mir bitte Informationen über Ihre Deutschkurse geben?",
      "Wie viel kostet der Kurs?",
      "Wie kann ich bezahlen?",
      "",
      "Ich freue mich im Voraus auf Ihre Antwort.",
      "Mit freundlichen Grüßen",
      "Max Mustermann",
    ],
    []
  );

  const INFORMAL_FULL_SAMPLE = useMemo(
    () => [
      "Hallo Anna,",
      "",
      "wie geht es dir?",
      "Ich hoffe, es geht dir gut.",
      "Ich schreibe dir, weil ich dir zum Geburtstag gratulieren möchte.",
      "Machst du eine Feier?",
      "Kann ich mit meiner Familie kommen?",
      "",
      "Ich freue mich im Voraus auf deine Antwort.",
      "Viele Grüße",
      "Mia",
    ],
    []
  );

  const BIRTHDAY_STEPS = useMemo(
    () => [
      "Introduction: Start with an informal greeting and a short opening.",
      "Body: Congratulate your friend.",
      "Body: Ask if he or she is planning a celebration.",
      "Body: Ask if you can come with your family.",
      "Conclusion: End with ‘Ich freue mich im Voraus auf deine Antwort.’",
      "Closing: Use ‘Viele Grüße’ or ‘Liebe Grüße’ and your first name.",
    ],
    []
  );

  const BIRTHDAY_SAMPLE = useMemo(
    () => [
      "Warum schreiben Sie?",
      "Gratulieren Sie ihm / ihr.",
      "Fragen Sie, ob er / sie eine Feier plant und ob Sie mit Ihrer Familie kommen können.",
    ],
    []
  );

  const FORMAL_STEPS = useMemo(
    () => [
      "Introduction: Start with a formal greeting.",
      "Introduction: Write your reason with ‘Ich schreibe Ihnen, weil ...’.",
      "Body: Ask for information about courses.",
      "Body: Ask about dates, prices, and payment methods.",
      "Conclusion: End with ‘Ich freue mich im Voraus auf Ihre Antwort.’",
      "Closing: Use ‘Mit freundlichen Grüßen’ and your full name.",
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

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <style>{`
        .mobile-form-row {
          display: none !important;
        }

        .desktop-form-row {
          display: grid !important;
        }

        @media (max-width: 720px) {
          .desktop-form-row {
            display: none !important;
          }

          .mobile-form-row {
            display: grid !important;
          }
        }
      `}</style>

      <header style={heroCardStyle}>
        <div style={heroLayoutStyle}>
          <div style={heroContentStyle}>
            <button
              style={{ ...styles.secondaryButton, width: "fit-content" }}
              onClick={() => navigate("/campus/course")}
            >
              Back to Course
            </button>

            <span style={heroEyebrowStyle}>A1 Schreiben • Day 12.3</span>

            <div style={{ display: "grid", gap: 8 }}>
              <h1 style={{ ...styles.title, marginBottom: 0 }}>
                Letter Writing — Read First
              </h1>
              <p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.7 }}>
                Learn how to write both formal and informal A1 letters step by step.
                Read the structure first, learn useful phrases, understand the{" "}
                <strong>weil</strong> rule, and then write your answer with confidence.
              </p>
            </div>

            <div style={cleanIntroBoxStyle}>
              In the A1 Schreiben exam, there are two important parts. <strong>Teil 1</strong> is
              form filling, where you read a short situation and complete missing information.
              <strong> Teil 2</strong> is letter writing, where you write a short formal or informal
              text. In this course, your main focus is <strong>Teil 2</strong>, so you must learn
              the correct greeting, useful phrases, question forms, and the word order with{" "}
              <strong>weil</strong>.
            </div>
          </div>

          <img
            src={heroImageUrl}
            alt="Notebook, pen, and coffee for German letter-writing practice"
            style={heroImageStyle}
          />
        </div>
      </header>

      <Section title="Notes">
        <div style={notesBannerStyle}>
          <strong style={{ fontSize: 18, color: "#1e3a8a" }}>Read these notes first</strong>
          <div style={{ color: "#1e40af", lineHeight: 1.7 }}>
            Learn the structure, useful phrases, and the <strong>weil</strong> rule before you move
            to the assignments below.
          </div>
        </div>
      </Section>

      <Section title="Watch first (A1 Day 20 • Introduction to Letter Writing 12.3)">
        <InfoBox title="Video ansehen">
          <div style={{ display: "grid", gap: 10 }}>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Before writing, watch this explanation video for chapter <strong>12.3</strong>:
            </p>
            <a
              href="https://youtu.be/JtgoO2fmOpU"
              target="_blank"
              rel="noreferrer"
              style={{ ...styles.secondaryButton, width: "fit-content", textDecoration: "none" }}
            >
              ▶ Video öffnen
            </a>
          </div>
        </InfoBox>
      </Section>

      <Section title="Teil 1 Practice — Formular (Bodensee-Rundfahrt)">
        <InfoBox title="Practice scenario">
          <div style={scenarioTextStyle}>{TEIL1_SCENARIO_TEXT}</div>
        </InfoBox>

        <InfoBox title="Fill this form like the exam">
          <div style={formWrapStyle}>
            <div style={formHeaderStyle}>
              <strong style={{ fontSize: 18 }}>Anmeldung zur Bodensee-Rundfahrt</strong>
              <span style={{ color: "#475569", lineHeight: 1.6 }}>
                Read the scenario and complete the missing information.
              </span>
            </div>

            <div style={formTableStyle}>
              <ResponsiveFormRow
                label="Name"
                prompt="Kadavy, Eva (Beispiel)"
                isStatic
              />

              <ResponsiveFormRow
                label="Anzahl der Personen"
                prompt="Write the total number of people travelling."
                answerHint="(1) ________"
              />

              <ResponsiveFormRow
                label="Davon Kinder"
                prompt="How many of those travellers are children?"
                answerHint="(2) ________"
              />

              <ResponsiveFormRow
                label="Ferienadresse"
                prompt="Hotel Schönblick, Burgstraße 34, 78014 ________"
                answerHint="(3) ________"
              />

              <ResponsiveFormRow
                label="Zahlungsweise"
                prompt="Choose the correct payment method: ________ / Kreditkarte"
                answerHint="(4) ________"
              />

              <div className="desktop-form-row" style={{ ...formRowStyle, borderBottom: "none" }}>
                <div style={formLabelStyle}>Reisetermin</div>
                <div style={formPromptStyle}>Enter the trip date or day mentioned in the task.</div>
                <div style={formAnswerStyle}>(5) ________</div>
              </div>

              <div className="mobile-form-row" style={{ ...mobileFormRowStyle, borderBottom: "none" }}>
                <div style={formLabelStyle}>Reisetermin</div>
                <div style={formPromptStyle}>Enter the trip date or day mentioned in the task.</div>
                <div style={mobileFormAnswerStyle}>(5) ________</div>
              </div>
            </div>
          </div>
        </InfoBox>

        <InfoBox title="Antworten (check after your attempt)">
          <div style={answersGridStyle}>
            {TEIL1_SOLUTIONS.map((item) => (
              <div key={item.label} style={answerCardStyle}>
                <strong>{item.label}</strong>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </InfoBox>
      </Section>

      <Section title="Formal Letter Structure (Read First)">
        <InfoBox title="Structure + Rules">
          <RuleParagraphs items={FORMAL_STRUCTURE} />
        </InfoBox>

        <InfoBox title="Important formal phrases you can use">
          <div style={phraseSectionGridStyle}>
            <div style={mobileTipStyle}>
              <strong>Tip:</strong> Learn the German phrase first. Then read the meaning. After that,
              look at the example. This is easier for small phone screens.
            </div>

            {FORMAL_PHRASE_GROUPS.map((group) => (
              <div key={group.title} style={phraseCategoryStyle}>
                <h3 style={phraseCategoryTitleStyle}>{group.title}</h3>

                <div style={mobilePhraseListStyle}>
                  {group.items.map((item) => (
                    <div key={item.german} style={mobilePhraseCardStyle}>
                      <div style={mobilePhraseGermanStyle}>{item.german}</div>
                      <div style={mobilePhraseMeaningStyle}>{item.english}</div>
                      <div style={mobilePhraseExampleStyle}>
                        <strong>Example:</strong> {item.example}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </InfoBox>

        <InfoBox title="Very short A1 sample (formal)">
          <div style={{ whiteSpace: "pre-line", lineHeight: 1.7 }}>
            {FORMAL_FULL_SAMPLE.join("\n")}
          </div>
        </InfoBox>
      </Section>

      <Section title="Informal Letter Structure (Read First)">
        <InfoBox title="Structure + Rules">
          <RuleParagraphs items={INFORMAL_STRUCTURE} />
        </InfoBox>

        <InfoBox title="Useful informal phrases">
          <BulletList items={INFORMAL_PHRASES} />
        </InfoBox>

        <InfoBox title="Very short A1 sample (informal)">
          <div style={{ whiteSpace: "pre-line", lineHeight: 1.7 }}>
            {INFORMAL_FULL_SAMPLE.join("\n")}
          </div>
        </InfoBox>
      </Section>

      <Section title="How to use WEIL (Very Important)">
        <InfoBox title="Simple rule">
          <div style={{ display: "grid", gap: 8 }}>
            <div style={noteStyle}>
              <strong>Weil = because.</strong> When you use <strong>weil</strong>, the verb moves to
              the end.
            </div>
            <div style={noteStyle}>
              In the original sentence, the verb is usually after the subject. But after{" "}
              <strong>weil</strong>, that conjugated verb goes to the last position.
            </div>
            <div style={noteStyle}>
              If there is a modal verb like <strong>kann, möchte, will</strong>, the main verb stays
              before it, and the modal verb goes to the end.
            </div>
          </div>
        </InfoBox>

        <InfoBox title="Look carefully at the change">
          <div style={simpleGridStyle}>
            <div style={exampleBlockStyle}>
              <div><strong>Normal sentence:</strong> Ich komme nicht.</div>
              <div><strong>With weil:</strong> Ich schreibe dir, weil ich nicht komme.</div>
            </div>

            <div style={exampleBlockStyle}>
              <div><strong>Normal sentence:</strong> Ich kann nicht kommen.</div>
              <div><strong>With weil:</strong> Ich schreibe dir, weil ich nicht kommen kann.</div>
            </div>

            <div style={exampleBlockStyle}>
              <div><strong>Normal sentence:</strong> Ich möchte eine Anfrage stellen.</div>
              <div><strong>With weil:</strong> Ich schreibe Ihnen, weil ich eine Anfrage stellen möchte.</div>
            </div>
          </div>
        </InfoBox>

        <InfoBox title="More WEIL examples">
          <BulletList items={WEIL_EXAMPLES} />
        </InfoBox>
      </Section>

      <Section title="Assignments">
        <div style={assignmentBannerStyle}>
          <div style={assignmentBannerTopStyle}>
            <div style={assignmentBadgeStyle}>✍️</div>

            <div style={assignmentBannerTitleWrapStyle}>
              <h3 style={assignmentBannerTitleStyle}>Your Task</h3>
              <p style={assignmentBannerSubtitleStyle}>
                Read the question • write the letter • submit it
              </p>
            </div>
          </div>

          <div style={assignmentBannerTextStyle}>
            You have finished the notes. Start the assignments below and submit your work when you
            are ready.
          </div>

          <div style={assignmentBannerActionRowStyle}>
            <span style={assignmentMiniPillStyle}>Informal birthday letter</span>
            <span style={assignmentMiniPillStyle}>Formal school letter</span>

            <button
              type="button"
              style={{ ...styles.primaryButton, width: "fit-content" }}
              onClick={() => navigate("/campus/submit")}
            >
              Go to Submit Assignment
            </button>
          </div>
        </div>
      </Section>

      <Section title="Assignment 1 — Informal Birthday Letter">
        <div style={assignmentCardStyle}>
          <InfoBox title="Instructions (Steps)">
            <BulletList items={BIRTHDAY_STEPS} />
          </InfoBox>

          <InfoBox title="Sample Question">
            <div style={{ marginBottom: 8 }}>
              Ihr Freund / Ihre Freundin hat Geburtstag. Schreiben Sie an ihn / sie:
            </div>
            <BulletList items={BIRTHDAY_SAMPLE} />
          </InfoBox>

          <InfoBox title="Write your letter in 3 parts">
            <div style={{ display: "grid", gap: 8, lineHeight: 1.6 }}>
              <div><strong>1) Introduction:</strong> Greeting + opening + reason for writing.</div>
              <div><strong>2) Body:</strong> Birthday wishes + questions + one extra detail.</div>
              <div><strong>3) Conclusion:</strong> Fixed ending + closing + your first name.</div>
            </div>
          </InfoBox>
        </div>
      </Section>

      <Section title="Assignment 2 — Formal Letter">
        <div style={assignmentCardStyle}>
          <InfoBox title="Instructions (Steps)">
            <BulletList items={FORMAL_STEPS} />
          </InfoBox>

          <InfoBox title="Sample Question">
            <div style={{ marginBottom: 8 }}>
              Sie möchten einen Deutschkurs besuchen. Schreiben Sie an die Sprachschule:
            </div>
            <BulletList items={FORMAL_SAMPLE} />
          </InfoBox>

          <InfoBox title="Write your letter in 3 parts">
            <div style={{ display: "grid", gap: 8, lineHeight: 1.6 }}>
              <div><strong>1) Introduction:</strong> Formal greeting + reason for writing.</div>
              <div><strong>2) Body:</strong> Ask for information, prices, dates, and payment.</div>
              <div><strong>3) Conclusion:</strong> Fixed polite ending + formal closing + full name.</div>
            </div>
          </InfoBox>
        </div>
      </Section>

      <Section title="Next step">
        <InfoBox title="Submit your work">
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            After reading the notes and completing the assignment, go to the submission page and
            send your answer.
          </p>
          <div>
            <button
              type="button"
              style={{ ...styles.primaryButton, width: "fit-content" }}
              onClick={() => navigate("/campus/submit")}
            >
              Go to Submit Assignment Page
            </button>
          </div>
        </InfoBox>
      </Section>
    </main>
  );
};

export default memo(A1LetterWritingQuestionBookPage);
