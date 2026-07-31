import React, { useState } from "react";
import { LetterWritingGrammarNotesPage } from "./LetterWritingIntroPage";

const pageStyle = {
  display: "grid",
  gap: 18,
};

const sectionStyle = {
  border: "1px solid #dbeafe",
  borderRadius: 18,
  padding: 18,
  background: "#ffffff",
  display: "grid",
  gap: 14,
};

const introStyle = {
  ...sectionStyle,
  background: "linear-gradient(135deg, #eff6ff, #ffffff 75%)",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 14,
};

const cardStyle = {
  border: "1px solid #cbd5e1",
  borderRadius: 14,
  padding: 15,
  background: "#f8fafc",
  display: "grid",
  gap: 10,
};

const labelStyle = {
  display: "inline-flex",
  width: "fit-content",
  padding: "5px 10px",
  borderRadius: 999,
  background: "#dbeafe",
  color: "#1d4ed8",
  fontSize: 13,
  fontWeight: 800,
};

const paragraphStyle = {
  margin: 0,
  lineHeight: 1.75,
};

const listStyle = {
  margin: 0,
  paddingLeft: 22,
  display: "grid",
  gap: 7,
  lineHeight: 1.65,
};

const formRowStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(120px, 0.7fr) minmax(150px, 1.3fr)",
  gap: 12,
  alignItems: "baseline",
  padding: "9px 0",
  borderBottom: "1px solid #e2e8f0",
};

const formFieldStyle = {
  display: "grid",
  gap: 7,
  padding: "10px 0",
  borderBottom: "1px solid #e2e8f0",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #94a3b8",
  borderRadius: 10,
  padding: "10px 12px",
  fontSize: 16,
  background: "#ffffff",
};

const primaryButtonStyle = {
  border: 0,
  borderRadius: 10,
  padding: "10px 14px",
  background: "#2563eb",
  color: "#ffffff",
  fontWeight: 800,
  cursor: "pointer",
};

const secondaryButtonStyle = {
  border: "1px solid #94a3b8",
  borderRadius: 10,
  padding: "10px 14px",
  background: "#ffffff",
  color: "#0f172a",
  fontWeight: 800,
  cursor: "pointer",
};

const letterStyle = {
  margin: 0,
  whiteSpace: "pre-line",
  lineHeight: 1.8,
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  padding: 14,
};

export const FORM_PRACTICE_FIELDS = [
  { id: "familienname", label: "Familienname", answer: "Mensah" },
  { id: "vorname", label: "Vorname", answer: "Kwame" },
  {
    id: "geburtsdatum",
    label: "Geburtsdatum",
    answer: "14.06.1998",
    inputMode: "text",
    placeholder: "TT.MM.JJJJ",
  },
  { id: "adresse", label: "Straße / Hausnummer", answer: "24 Market Road" },
  { id: "wohnort", label: "Wohnort", answer: "Accra" },
  { id: "telefon", label: "Telefon", answer: "020 123 4567", inputMode: "tel" },
  {
    id: "email",
    label: "E-Mail",
    answer: "kwame.mensah@example.com",
    inputMode: "email",
  },
  { id: "kurs", label: "Kurs", answer: "Deutsch A1" },
  { id: "kurszeit", label: "Kurszeit", answer: "Abendkurs" },
  {
    id: "kursbeginn",
    label: "Kursbeginn",
    answer: "12.08.2026",
    inputMode: "text",
    placeholder: "TT.MM.JJJJ",
  },
];

const createEmptyFormAnswers = () =>
  FORM_PRACTICE_FIELDS.reduce((answers, field) => ({ ...answers, [field.id]: "" }), {});

export const normalizeFormPracticeAnswer = (value = "") =>
  String(value).trim().toLocaleLowerCase("de-DE").replace(/\s+/g, " ");

export const isFormPracticeAnswerCorrect = (field, value) =>
  normalizeFormPracticeAnswer(value) === normalizeFormPracticeAnswer(field.answer);

export const getFormPracticeScore = (answers = {}) =>
  FORM_PRACTICE_FIELDS.reduce(
    (score, field) => score + (isFormPracticeAnswerCorrect(field, answers[field.id]) ? 1 : 0),
    0,
  );

const FormRow = ({ label, value }) => (
  <div style={formRowStyle}>
    <strong>{label}</strong>
    <span>{value}</span>
  </div>
);

const InteractiveFormPractice = () => {
  const [answers, setAnswers] = useState(createEmptyFormAnswers);
  const [checked, setChecked] = useState(false);
  const [showCompletedForm, setShowCompletedForm] = useState(false);

  const score = checked ? getFormPracticeScore(answers) : 0;

  const updateAnswer = (fieldId, value) => {
    setAnswers((current) => ({ ...current, [fieldId]: value }));
    setChecked(false);
    setShowCompletedForm(false);
  };

  const checkAnswers = (event) => {
    event.preventDefault();
    setChecked(true);
    setShowCompletedForm(false);
  };

  const resetForm = () => {
    setAnswers(createEmptyFormAnswers());
    setChecked(false);
    setShowCompletedForm(false);
  };

  return (
    <article style={{ ...cardStyle, background: "#ffffff" }} aria-label="Interactive form practice">
      <h3 style={{ margin: 0 }}>Complete the form</h3>
      <p style={paragraphStyle}>
        Read the information first. Type the correct detail in every field, then press
        <strong> Check answers</strong>.
      </p>

      <form onSubmit={checkAnswers} noValidate autoComplete="off">
        <div style={{ display: "grid" }}>
          {FORM_PRACTICE_FIELDS.map((field) => {
            const correct = checked && isFormPracticeAnswerCorrect(field, answers[field.id]);
            const incorrect = checked && !correct;
            const feedbackId = `${field.id}-feedback`;

            return (
              <div key={field.id} style={formFieldStyle}>
                <label htmlFor={field.id} style={{ fontWeight: 800 }}>
                  {field.label}
                </label>
                <input
                  id={field.id}
                  name={`practice-${field.id}`}
                  value={answers[field.id]}
                  onChange={(event) => updateAnswer(field.id, event.target.value)}
                  inputMode={field.inputMode || "text"}
                  placeholder={field.placeholder}
                  autoComplete="off"
                  aria-invalid={incorrect ? "true" : "false"}
                  aria-describedby={checked ? feedbackId : undefined}
                  style={{
                    ...inputStyle,
                    borderColor: correct ? "#16a34a" : incorrect ? "#dc2626" : "#94a3b8",
                  }}
                />
                {checked ? (
                  <span
                    id={feedbackId}
                    style={{
                      color: correct ? "#166534" : "#b91c1c",
                      fontWeight: 800,
                      lineHeight: 1.5,
                    }}
                  >
                    {correct ? "Correct" : `Correct answer: ${field.answer}`}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
          <button type="submit" style={primaryButtonStyle}>
            Check answers
          </button>
          <button type="button" style={secondaryButtonStyle} onClick={resetForm}>
            Reset form
          </button>
          {checked ? (
            <button
              type="button"
              style={secondaryButtonStyle}
              onClick={() => setShowCompletedForm((visible) => !visible)}
              aria-expanded={showCompletedForm}
            >
              {showCompletedForm ? "Hide completed form" : "Show completed form"}
            </button>
          ) : null}
        </div>
      </form>

      {checked ? (
        <div
          role="status"
          aria-live="polite"
          style={{
            border: "1px solid #bfdbfe",
            borderRadius: 12,
            padding: 12,
            background: "#eff6ff",
            lineHeight: 1.65,
          }}
        >
          <strong>Your score: {score}/{FORM_PRACTICE_FIELDS.length}</strong>
          <br />
          {score === FORM_PRACTICE_FIELDS.length
            ? "Excellent. Every form field is correct."
            : "Review the red fields, correct them, and check again."}
        </div>
      ) : null}

      {checked && showCompletedForm ? (
        <article style={cardStyle} aria-label="Completed form sample">
          <h3 style={{ margin: 0 }}>Completed form</h3>
          <div>
            {FORM_PRACTICE_FIELDS.map((field) => (
              <FormRow key={field.id} label={field.label} value={field.answer} />
            ))}
          </div>
        </article>
      ) : null}
    </article>
  );
};

const DifferenceRow = ({ feature, formal, informal }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "minmax(90px, 0.7fr) repeat(2, minmax(130px, 1fr))",
      gap: 10,
      padding: "10px 0",
      borderBottom: "1px solid #e2e8f0",
      alignItems: "start",
      lineHeight: 1.55,
    }}
  >
    <strong>{feature}</strong>
    <span>{formal}</span>
    <span>{informal}</span>
  </div>
);

const A1Day20GoetheWritingGrammarPage = () => (
  <div style={pageStyle} data-a1-day20-goethe-writing-grammar="true">
    <section style={introStyle} aria-labelledby="goethe-a1-writing-heading">
      <span style={labelStyle}>Goethe A1 · Schreiben</span>
      <h1 id="goethe-a1-writing-heading" style={{ margin: 0 }}>
        Goethe A1 Schreiben has two parts
      </h1>
      <p style={paragraphStyle}>
        In the A1 writing exam, you must complete <strong>both parts</strong>. Teil 1 checks whether
        you can transfer information correctly into a form. Teil 2 checks whether you can write a
        short message, letter, or e-mail for a clear situation.
      </p>

      <div style={gridStyle}>
        <article style={cardStyle}>
          <span style={labelStyle}>Teil 1</span>
          <h2 style={{ margin: 0, fontSize: 21 }}>Formular ausfüllen</h2>
          <p style={paragraphStyle}>
            Read the information and enter the correct details in the matching form fields.
          </p>
          <ul style={listStyle}>
            <li>Copy names, numbers, dates, and addresses exactly.</li>
            <li>Write only the requested information in each field.</li>
            <li>Do not invent information that is not given.</li>
          </ul>
        </article>

        <article style={cardStyle}>
          <span style={labelStyle}>Teil 2</span>
          <h2 style={{ margin: 0, fontSize: 21 }}>Kurze Nachricht oder E-Mail</h2>
          <p style={paragraphStyle}>
            Write a short text and answer every task point. Decide first whether the situation is
            formal or informal.
          </p>
          <ul style={listStyle}>
            <li>Use a suitable greeting and closing.</li>
            <li>Answer all the content points.</li>
            <li>Keep formal and informal language separate.</li>
          </ul>
        </article>
      </div>

      <div
        style={{
          border: "1px solid #fdba74",
          borderRadius: 14,
          padding: 14,
          background: "#fff7ed",
          lineHeight: 1.7,
        }}
      >
        <strong>Remember:</strong> Teil 1 is a form, not a letter. Teil 2 is a short written message,
        not a list of form fields.
      </div>
    </section>

    <section style={sectionStyle} aria-labelledby="form-sample-heading">
      <span style={labelStyle}>Teil 1 practice</span>
      <h2 id="form-sample-heading" style={{ margin: 0 }}>
        Form filling: read, find, and copy
      </h2>
      <div style={gridStyle}>
        <article style={cardStyle}>
          <h3 style={{ margin: 0 }}>Information given</h3>
          <p style={paragraphStyle}>
            Kwame Mensah was born on 14 June 1998. He lives at 24 Market Road in Accra. His telephone
            number is 020 123 4567 and his e-mail address is kwame.mensah@example.com. He wants to
            attend a German A1 evening course beginning on 12 August 2026.
          </p>
        </article>

        <InteractiveFormPractice />
      </div>

      <div style={cardStyle}>
        <h3 style={{ margin: 0 }}>Form-filling rules</h3>
        <ul style={listStyle}>
          <li>
            <strong>Familienname</strong> means surname; <strong>Vorname</strong> means first name.
          </li>
          <li>Write dates clearly, for example: 14.06.1998.</li>
          <li>Check every digit in telephone numbers and dates.</li>
          <li>Copy the e-mail address exactly, including dots and the @ sign.</li>
          <li>When boxes are provided, mark only the option supported by the information.</li>
        </ul>
      </div>
    </section>

    <section style={sectionStyle} aria-labelledby="formal-informal-comparison-heading">
      <span style={labelStyle}>Teil 2 samples</span>
      <h2 id="formal-informal-comparison-heading" style={{ margin: 0 }}>
        Formal and informal letters: see the difference
      </h2>
      <p style={paragraphStyle}>
        The structure is similar, but the recipient, pronouns, greeting, tone, closing, and name are
        different.
      </p>

      <div style={{ overflowX: "auto" }} aria-label="Formal and informal letter comparison">
        <div style={{ minWidth: 560 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(90px, 0.7fr) repeat(2, minmax(130px, 1fr))",
              gap: 10,
              padding: "10px 0",
              borderBottom: "2px solid #94a3b8",
              fontWeight: 900,
            }}
          >
            <span>Feature</span>
            <span>Formal</span>
            <span>Informal</span>
          </div>
          <DifferenceRow feature="Recipient" formal="School, company, office, unknown adult" informal="Friend or family member" />
          <DifferenceRow feature="Greeting" formal="Sehr geehrte Damen und Herren," informal="Hallo Anna, / Liebe Anna," />
          <DifferenceRow feature="Pronouns" formal="Sie, Ihnen, Ihr/Ihre" informal="du, dir, dich, dein/deine" />
          <DifferenceRow feature="Closing" formal="Mit freundlichen Grüßen" informal="Liebe Grüße / Viele Grüße" />
          <DifferenceRow feature="Name" formal="Full name" informal="First name" />
        </div>
      </div>

      <div style={gridStyle}>
        <article style={{ ...cardStyle, borderColor: "#fdba74", background: "#fff7ed" }}>
          <span style={{ ...labelStyle, background: "#ffedd5", color: "#9a3412" }}>
            Formal sample
          </span>
          <h3 style={{ margin: 0 }}>E-mail to a language school</h3>
          <p style={letterStyle}>
            {`Sehr geehrte Damen und Herren,\n\nich schreibe Ihnen, weil ich mich für Ihren Deutschkurs interessiere. Wann beginnt der nächste Kurs? Wie viel kostet er? Gibt es Unterricht am Abend? Bitte senden Sie mir weitere Informationen.\n\nMit freundlichen Grüßen\nMia Mensah`}
          </p>
        </article>

        <article style={{ ...cardStyle, borderColor: "#86efac", background: "#f0fdf4" }}>
          <span style={{ ...labelStyle, background: "#dcfce7", color: "#166534" }}>
            Informal sample
          </span>
          <h3 style={{ margin: 0 }}>Invitation to a friend</h3>
          <p style={letterStyle}>
            {`Liebe Anna,\n\nwie geht es dir? Ich schreibe dir, weil ich am Samstag Geburtstag habe. Die Feier beginnt um 18 Uhr bei mir zu Hause. Kannst du kommen? Bitte bring etwas zu trinken mit.\n\nLiebe Grüße\nMia`}
          </p>
        </article>
      </div>

      <div
        style={{
          border: "1px solid #bfdbfe",
          borderRadius: 14,
          padding: 14,
          background: "#eff6ff",
          lineHeight: 1.7,
        }}
      >
        <strong>Quick check:</strong> Never write <strong>Sehr geehrte Damen und Herren</strong> with
        <strong> du</strong>, and never finish a formal letter with <strong>Liebe Grüße</strong>.
      </div>
    </section>

    <section style={{ ...sectionStyle, background: "#f8fafc" }}>
      <h2 style={{ margin: 0 }}>Now study the complete letter structure</h2>
      <p style={paragraphStyle}>
        The detailed grammar notes below show the greeting, opening, main body, use of
        <strong> weil</strong>, conclusion, and complete formal and informal examples.
      </p>
    </section>

    <LetterWritingGrammarNotesPage />
  </div>
);

export default A1Day20GoetheWritingGrammarPage;
