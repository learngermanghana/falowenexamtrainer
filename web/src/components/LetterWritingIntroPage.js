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

const sectionCardStyle = {
  ...styles.card,
  display: "grid",
  gap: 10,
};

const softBlueBoxStyle = {
  border: "1px solid #bfdbfe",
  background: "#eff6ff",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 8,
};

const softOrangeBoxStyle = {
  border: "1px solid #fdba74",
  background: "#fff7ed",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 8,
};

const phraseGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 10,
};

const phraseCardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
  background: "#ffffff",
  display: "grid",
  gap: 6,
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

const teil1ScenarioGridStyle = {
  display: "grid",
  gap: 10,
};

const teil1ScenarioCardStyle = {
  display: "grid",
  gridTemplateColumns: "40px 1fr",
  gap: 10,
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
  background: "#fff",
};

const teil1ScenarioNumberStyle = {
  width: 28,
  height: 28,
  borderRadius: 999,
  background: "#dbeafe",
  color: "#1d4ed8",
  fontWeight: 800,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: 2,
};

const teil1FormCardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 14,
  background: "#fff",
  display: "grid",
  gap: 14,
};

const teil1FormHeaderStyle = {
  display: "grid",
  gap: 4,
};

const teil1FormGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
  gap: 12,
};

const teil1FieldCardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 8,
  background: "#fff",
};

const teil1FieldLabelStyle = {
  fontWeight: 800,
  color: "#0f172a",
};

const teil1FieldValueStyle = {
  color: "#334155",
  lineHeight: 1.6,
};

const teil1AnswerBlankStyle = {
  minHeight: 40,
  border: "1px dashed #94a3b8",
  borderRadius: 10,
  display: "flex",
  alignItems: "center",
  padding: "8px 10px",
  color: "#64748b",
  background: "#f8fafc",
};

const teil1HintBoxStyle = {
  border: "1px solid #fde68a",
  background: "#fffbeb",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 8,
};

const Section = ({ title, children }) => (
  <section style={sectionCardStyle}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const InfoBox = ({ title, children, tone = "normal" }) => {
  const boxStyle =
    tone === "blue" ? softBlueBoxStyle : tone === "orange" ? softOrangeBoxStyle : {
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      padding: 12,
      display: "grid",
      gap: 8,
      background: "#fff",
    };

  return (
    <div style={boxStyle}>
      {title && <div style={{ fontWeight: 900 }}>{title}</div>}
      {children}
    </div>
  );
};

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

const PhraseGrid = ({ items }) => (
  <div style={phraseGridStyle}>
    {items.map((item, index) => (
      <div key={`${index}-${item.german}`} style={phraseCardStyle}>
        <strong>{item.german}</strong>
        <span style={{ color: "#475569" }}>{item.english}</span>
        {item.example ? (
          <span style={{ color: "#0f172a", lineHeight: 1.6 }}>
            <strong>Example:</strong> {item.example}
          </span>
        ) : null}
      </div>
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

  const FORMAL_PHRASES = useMemo(
    () => [
      {
        german: "Ich schreibe Ihnen, weil ich eine Anfrage stellen möchte.",
        english: "I am writing to you because I would like to make an enquiry.",
        example: "Ich schreibe Ihnen, weil ich eine Anfrage zu Ihrem Kurs stellen möchte.",
      },
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
      {
        german: "Könnten Sie mir bitte Informationen über ... geben?",
        english: "Could you please give me information about ...?",
        example: "Könnten Sie mir bitte Informationen über Ihre Kurse geben?",
      },
      {
        german: "Wie viel kostet ...?",
        english: "How much does ... cost?",
        example: "Wie viel kostet der Deutschkurs?",
      },
      {
        german: "Wie hoch ist die Gebühr?",
        english: "How much is the fee?",
        example: "Wie hoch ist die Anmeldegebühr?",
      },
      {
        german: "Könnten Sie mir bitte den Preis mitteilen?",
        english: "Could you please tell me the price?",
        example: "Könnten Sie mir bitte den Preis mitteilen?",
      },
      {
        german: "Ich hätte gern weitere Informationen.",
        english: "I would like more information.",
        example: "Ich hätte gern weitere Informationen über die Anmeldung.",
      },
      {
        german: "Bitte antworten Sie mir bald.",
        english: "Please reply to me soon.",
        example: "Bitte antworten Sie mir bald.",
      },
      {
        german: "Könnten Sie mir bitte helfen?",
        english: "Could you please help me?",
        example: "Könnten Sie mir bitte bei der Anmeldung helfen?",
      },
    ],
    []
  );

  const INFORMAL_PHRASES = useMemo(
    () => [
      {
        german: "Ich gratuliere dir.",
        english: "I congratulate you.",
        example: "Ich gratuliere dir zum Geburtstag.",
      },
      {
        german: "Herzlichen Glückwunsch zum Geburtstag!",
        english: "Happy birthday / Congratulations on your birthday!",
        example: "Herzlichen Glückwunsch zum Geburtstag, Anna!",
      },
      {
        german: "Ich wünsche dir alles Gute.",
        english: "I wish you all the best.",
        example: "Ich wünsche dir alles Gute zum Geburtstag.",
      },
      {
        german: "Machst du eine Feier?",
        english: "Are you having a celebration?",
        example: "Machst du am Samstag eine Feier?",
      },
      {
        german: "Wo findet die Feier statt?",
        english: "Where is the celebration taking place?",
        example: "Wo findet die Feier statt?",
      },
      {
        german: "Kann ich mit meiner Familie kommen?",
        english: "Can I come with my family?",
        example: "Kann ich mit meiner Familie kommen?",
      },
      {
        german: "Ich komme in den Urlaub.",
        english: "I am coming on holiday.",
        example: "Ich schreibe dir, weil ich im Sommer in den Urlaub komme.",
      },
      {
        german: "Ich fahre ans Meer.",
        english: "I am going to the sea.",
        example: "Im Juli fahre ich ans Meer.",
      },
      {
        german: "Wir machen Ferien.",
        english: "We are going on vacation.",
        example: "Wir machen im August Ferien.",
      },
      {
        german: "Ich freue mich auf deine Feier.",
        english: "I am looking forward to your celebration.",
        example: "Ich freue mich auf deine Feier.",
      },
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
      "Ich möchte den Termin absagen. → Ich schreibe Ihnen, weil ich den Termin absagen möchte.",
      "Ich habe am Samstag Zeit. → Ich komme, weil ich am Samstag Zeit habe.",
      "Ich lerne Deutsch. → Ich schreibe Ihnen, weil ich Deutsch lerne.",
      "Ich möchte mit meiner Familie kommen. → Ich frage, ob ich mit meiner Familie kommen möchte. (better A1 sentence: Kann ich mit meiner Familie kommen?)",
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
      "Fragen Sie, ob er / sie eine Feier plant.",
      "Fragen Sie, ob Sie mit Ihrer Familie kommen können.",
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
      "Fragen Sie nach Kursterminen.",
      "Fragen Sie nach Preisen und Zahlungsmethoden.",
    ],
    []
  );

  const VOCAB_LIST = useMemo(
    () => ({
      separable: [
        "abholen – to pick up",
        "anmelden – to register",
        "anmachen – to switch on",
        "ausmachen – to switch off",
        "ankommen – to arrive",
        "abreisen – to depart",
        "absagen – to cancel",
        "zusagen – to accept",
        "aufmachen – to open",
        "zumachen – to close",
        "einladen – to invite",
        "gratulieren – to congratulate",
      ],
      key: [
        "der Kurs – course",
        "die Anmeldung – registration",
        "die Gebühr – fee",
        "das Formular – form",
        "das Büro – office",
        "der Urlaub – vacation",
        "die Feier – celebration",
        "die Informationen – information",
        "die Zahlungsmethode – payment method",
        "der Preis – price",
      ],
      occasions: [
        "Alles Gute zum Geburtstag – Happy Birthday",
        "Herzlichen Glückwunsch – Congratulations",
        "der Geburtstag – birthday",
        "die Feier – celebration",
        "die Einladung – invitation",
      ],
    }),
    []
  );

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
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

            <div style={{ display: "grid", gap: 10 }}>
              <h1 style={{ ...styles.title, marginBottom: 0 }}>
                Letter Writing — Read First
              </h1>
              <p style={{ ...styles.subtitle, margin: 0 }}>
                Learn how to write both formal and informal A1 letters step by step.
                Read the structure first, learn useful phrases, understand the weil rule,
                and then write your answer with confidence.
              </p>
            </div>

            <div style={heroHighlightsStyle}>
              {[
                { label: "Teil 1", text: "Read short prompts and complete important form details." },
                { label: "Teil 2", text: "Write correct formal and informal letters." },
                { label: "Focus", text: "Openings, useful phrases, questions, and the weil rule." },
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

      <Section title="How Schreiben works (A1 exam)">
        <InfoBox title="Two parts you must know">
          <div style={{ display: "grid", gap: 8, lineHeight: 1.6 }}>
            <div>
              <strong>Teil 1:</strong> Formular ausfüllen. You read a short situation and complete
              missing details in a form.
            </div>
            <div>
              <strong>Teil 2:</strong> Brief schreiben. You write a complete formal or informal letter.
            </div>
          </div>
        </InfoBox>

        <InfoBox title="Important for this course" tone="blue">
          <div style={{ lineHeight: 1.6 }}>
            Teil 1 is here for practice, but your main writing focus is <strong>Teil 2</strong>.
            This means you must understand greetings, useful phrases, correct questions,
            and the <strong>weil</strong> word order.
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

        <InfoBox title="Fill this form like the exam">
          <div style={teil1FormCardStyle}>
            <div style={teil1FormHeaderStyle}>
              <strong style={{ fontSize: 18 }}>Anmeldung zur Bodensee-Rundfahrt</strong>
              <span style={{ color: "#475569", lineHeight: 1.5 }}>
                Read the scenario and complete each missing detail.
              </span>
            </div>

            <div style={teil1FormGridStyle}>
              <div style={teil1FieldCardStyle}>
                <div style={teil1FieldLabelStyle}>Name</div>
                <div style={teil1FieldValueStyle}>Kadavy, Eva (Beispiel)</div>
              </div>

              <Teil1FormField
                label="Anzahl der Personen"
                prompt="Write the total number of people travelling."
                answerHint="(1) ________"
              />
              <Teil1FormField
                label="Davon Kinder"
                prompt="How many of those travellers are children?"
                answerHint="(2) ________"
              />
              <Teil1FormField
                label="Ferienadresse"
                prompt="Hotel Schönblick, Burgstraße 34, 78014 ________"
                answerHint="(3) ________"
              />
              <Teil1FormField
                label="Zahlungsweise"
                prompt="Choose the correct payment method: ________ / Kreditkarte"
                answerHint="(4) ________"
              />
              <Teil1FormField
                label="Reisetermin"
                prompt="Enter the trip date or day mentioned in the task."
                answerHint="(5) ________"
              />
            </div>
          </div>
        </InfoBox>

        <InfoBox title="Antworten (check after your attempt)">
          <div style={teil1ScenarioGridStyle}>
            {TEIL1_SOLUTIONS.map((item) => (
              <div
                key={item}
                style={{
                  ...teil1ScenarioCardStyle,
                  gap: 6,
                  borderColor: "#bfdbfe",
                  background: "#eff6ff",
                  gridTemplateColumns: "1fr",
                }}
              >
                <strong style={{ color: "#1d4ed8" }}>{item.split(":")[0]}</strong>
                <span style={{ lineHeight: 1.6, color: "#1e3a8a" }}>
                  {item.split(":").slice(1).join(":").trim()}
                </span>
              </div>
            ))}
          </div>
        </InfoBox>

        <InfoBox title="How to think in Teil 1" tone="orange">
          <div style={teil1HintBoxStyle}>
            <strong>Quick method</strong>
            <BulletList
              items={[
                "Count all people carefully.",
                "Read the place name exactly.",
                "If the text says no credit card, the answer is often ‘bar’.",
                "Write the exact date or day from the text.",
              ]}
            />
          </div>
        </InfoBox>
      </Section>

      <Section title="Formal Letter Structure (Read First)">
        <InfoBox title="Structure + Rules">
          <RuleParagraphs items={FORMAL_STRUCTURE} />
        </InfoBox>

        <InfoBox title="Important formal phrases you can use">
          <PhraseGrid items={FORMAL_PHRASES} />
        </InfoBox>

        <InfoBox title="How to ask in a formal letter" tone="blue">
          <div style={{ display: "grid", gap: 8, lineHeight: 1.65 }}>
            <div><strong>To make an enquiry:</strong> Ich schreibe Ihnen, weil ich eine Anfrage stellen möchte.</div>
            <div><strong>To ask for information:</strong> Könnten Sie mir bitte Informationen über ... geben?</div>
            <div><strong>To ask for the price:</strong> Wie viel kostet ...? / Wie hoch ist die Gebühr?</div>
            <div><strong>To make a request:</strong> Könnten Sie mir bitte helfen? / Könnten Sie mir bitte ... mitteilen?</div>
            <div><strong>To cancel an appointment:</strong> Ich möchte den Termin absagen.</div>
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

        <InfoBox title="Useful informal phrases you can use">
          <PhraseGrid items={INFORMAL_PHRASES} />
        </InfoBox>

        <InfoBox title="Useful ideas for birthday, holiday, and celebration letters" tone="blue">
          <div style={{ display: "grid", gap: 8, lineHeight: 1.65 }}>
            <div><strong>Birthday:</strong> Herzlichen Glückwunsch zum Geburtstag! / Ich gratuliere dir.</div>
            <div><strong>Celebration:</strong> Machst du eine Feier? / Wo findet die Feier statt?</div>
            <div><strong>Holiday:</strong> Ich fahre in den Urlaub. / Wir machen Ferien.</div>
            <div><strong>Visit:</strong> Ich möchte dich besuchen.</div>
            <div><strong>Extra simple sentence:</strong> Ich komme mit meiner Familie. / Wir fahren mit dem Auto.</div>
          </div>
        </InfoBox>

        <InfoBox title="Very short A1 sample (informal)">
          <div style={{ whiteSpace: "pre-line", lineHeight: 1.7 }}>
            {INFORMAL_FULL_SAMPLE.join("\n")}
          </div>
        </InfoBox>
      </Section>

      <Section title="How to use WEIL (Very Important)">
        <InfoBox title="Simple rule" tone="orange">
          <div style={{ display: "grid", gap: 8 }}>
            <div style={noteStyle}>
              <strong>Weil = because.</strong> When you use <strong>weil</strong>, the verb moves to the end.
            </div>
            <div style={noteStyle}>
              In the original sentence, the verb is usually after the subject.
              But after <strong>weil</strong>, that conjugated verb goes to the last position.
            </div>
            <div style={noteStyle}>
              If there is a modal verb like <strong>kann, möchte, will</strong>, the main verb stays before it,
              and the modal verb goes to the end.
            </div>
          </div>
        </InfoBox>

        <InfoBox title="Look carefully at the change">
          <div style={exampleBlockStyle}>
            <div><strong>Normal sentence:</strong> Ich komme nicht.</div>
            <div><strong>With weil:</strong> Ich schreibe dir, weil ich nicht komme.</div>
            <div><strong>What changed?</strong> The verb <strong>komme</strong> moved to the end.</div>
          </div>

          <div style={exampleBlockStyle}>
            <div><strong>Normal sentence:</strong> Ich kann nicht kommen.</div>
            <div><strong>With weil:</strong> Ich schreibe dir, weil ich nicht kommen kann.</div>
            <div><strong>What changed?</strong> The modal verb <strong>kann</strong> moved to the end.</div>
          </div>

          <div style={exampleBlockStyle}>
            <div><strong>Normal sentence:</strong> Ich möchte eine Anfrage stellen.</div>
            <div><strong>With weil:</strong> Ich schreibe Ihnen, weil ich eine Anfrage stellen möchte.</div>
            <div><strong>What changed?</strong> The modal verb <strong>möchte</strong> moved to the end.</div>
          </div>
        </InfoBox>

        <InfoBox title="More WEIL examples">
          <BulletList items={WEIL_EXAMPLES} />
        </InfoBox>

        <InfoBox title="Easy pattern for students" tone="blue">
          <div style={{ lineHeight: 1.7 }}>
            You can remember this easy pattern:
            <br />
            <strong>Ich schreibe Ihnen / dir, weil + subject + other words + verb at the end.</strong>
            <br />
            Example:
            <br />
            <strong>Ich schreibe Ihnen, weil ich Informationen brauche.</strong>
            <br />
            <strong>Ich schreibe dir, weil ich dich besuchen möchte.</strong>
          </div>
        </InfoBox>
      </Section>

      <Section title="Assignment 1 — Informal Birthday Letter">
        <InfoBox title="Instructions (Steps)">
          <BulletList items={BIRTHDAY_STEPS} />
        </InfoBox>

        <InfoBox title="Sample Question">
          <div style={{ marginBottom: 8 }}>
            Ihr Freund / Ihre Freundin hat Geburtstag. Schreiben Sie an ihn / sie:
          </div>
          <BulletList items={BIRTHDAY_SAMPLE} />
        </InfoBox>

        <InfoBox title="Important tip" tone="orange">
          <div style={{ lineHeight: 1.6 }}>
            Use simple sentences. It is okay to write short, correct A1 sentences.
            Try to use one <strong>weil</strong> sentence correctly.
          </div>
        </InfoBox>

        <InfoBox title="Write your letter in 3 parts">
          <div style={{ display: "grid", gap: 8, lineHeight: 1.6 }}>
            <div><strong>1) Introduction:</strong> Greeting + opening + reason for writing.</div>
            <div><strong>2) Body:</strong> Birthday wishes + questions + one extra detail.</div>
            <div><strong>3) Conclusion:</strong> Fixed ending + closing + your first name.</div>
          </div>
        </InfoBox>
      </Section>

      <Section title="Assignment 2 — Formal Letter">
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
      </Section>

      <Section title="Essential A1 Vocabulary List">
        <InfoBox title="Useful Verbs">
          <BulletList items={VOCAB_LIST.separable} />
        </InfoBox>

        <InfoBox title="Key Letter Vocabulary">
          <BulletList items={VOCAB_LIST.key} />
        </InfoBox>

        <InfoBox title="Special Occasions">
          <BulletList items={VOCAB_LIST.occasions} />
        </InfoBox>
      </Section>

      <Section title="Next step">
        <p style={{ margin: 0, lineHeight: 1.6 }}>
          After reading the structure, the phrases, and the weil examples, go and submit your
          formal or informal letter on the submission page.
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
      </Section>
    </main>
  );
};

export default memo(A1LetterWritingQuestionBookPage);
