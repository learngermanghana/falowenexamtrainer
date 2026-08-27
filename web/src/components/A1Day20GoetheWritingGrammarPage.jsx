import React from "react";
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

const taskStyle = {
  margin: 0,
  lineHeight: 1.8,
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  padding: 14,
  display: "grid",
  gap: 12,
};

const FormRow = ({ label, value }) => (
  <div style={formRowStyle}>
    <strong>{label}</strong>
    <span>{value}</span>
  </div>
);

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
      <span style={labelStyle}>Teil 1 – Beispiel</span>
      <h2 id="form-sample-heading" style={{ margin: 0 }}>
        Formular ausfüllen: lesen, finden und übertragen
      </h2>
      <p style={paragraphStyle}>
        Lesen Sie die Informationen. Ergänzen Sie die Felder <strong>1–3</strong>. So kann Teil 1
        in der Goethe-A1-Prüfung aussehen.
      </p>
      <div style={gridStyle}>
        <article style={cardStyle}>
          <h3 style={{ margin: 0 }}>Informationen</h3>
          <p style={paragraphStyle}>
            Kwame Mensah wurde am 14. Juni 1998 geboren. Er wohnt in Accra. Seine Adresse ist
            24 Market Road. Seine Telefonnummer lautet 020 123 4567 und seine E-Mail-Adresse ist
            kwame.mensah@example.com. Er möchte ab dem 12. August 2026 einen Deutschkurs A1 am
            Abend besuchen.
          </p>
        </article>

        <article style={{ ...cardStyle, background: "#ffffff" }} aria-label="Formularübung">
          <h3 style={{ margin: 0 }}>Formular</h3>
          <div>
            <FormRow label="Familienname" value="1. ____________________" />
            <FormRow label="Vorname" value="Kwame" />
            <FormRow label="Geburtsdatum" value="2. ____________________" />
            <FormRow label="Straße / Hausnummer" value="24 Market Road" />
            <FormRow label="Wohnort" value="Accra" />
            <FormRow label="Telefon" value="020 123 4567" />
            <FormRow label="E-Mail" value="kwame.mensah@example.com" />
            <FormRow label="Kurs" value="Deutsch A1" />
            <FormRow label="Kurszeit" value="Abendkurs" />
            <FormRow label="Kursbeginn" value="3. ____________________" />
          </div>
        </article>
      </div>

      <div style={{ ...cardStyle, borderColor: "#86efac", background: "#f0fdf4" }}>
        <h3 style={{ margin: 0 }}>Answers for reference</h3>
        <ol style={listStyle}>
          <li><strong>Mensah</strong></li>
          <li><strong>14.06.1998</strong></li>
          <li><strong>12.08.2026</strong></li>
        </ol>
      </div>

      <div style={cardStyle}>
        <h3 style={{ margin: 0 }}>Tips for completing the form</h3>
        <ul style={listStyle}>
          <li>
            <strong>Familienname</strong> means surname / last name; <strong>Vorname</strong> means
            first name.
          </li>
          <li>Write dates clearly, for example: 14.06.1998.</li>
          <li>Check every digit in telephone numbers and dates.</li>
          <li>Copy the e-mail address exactly, including the full stop and @ sign.</li>
          <li>Enter only information that is given in the text.</li>
        </ul>
      </div>
    </section>

    <section style={sectionStyle} aria-labelledby="formal-informal-comparison-heading">
      <span style={labelStyle}>Teil 2 – Schreibaufgaben</span>
      <h2 id="formal-informal-comparison-heading" style={{ margin: 0 }}>
        Formelle und informelle Schreibaufgaben
      </h2>
      <p style={paragraphStyle}>
        Üben Sie beide Aufgaben. Schreiben Sie zu jedem Punkt einen klaren Satz und verwenden Sie
        die passende Anrede und den passenden Gruß.
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
        <article
          style={{ ...cardStyle, borderColor: "#fdba74", background: "#fff7ed" }}
          aria-label="Formelle Schreibaufgabe"
        >
          <span style={{ ...labelStyle, background: "#ffedd5", color: "#9a3412" }}>
            Formelle Aufgabe
          </span>
          <h3 style={{ margin: 0 }}>E-Mail an eine Sprachschule</h3>
          <div style={taskStyle}>
            <p style={paragraphStyle}>
              Sie möchten einen Deutschkurs besuchen. Schreiben Sie eine E-Mail an eine
              Sprachschule.
            </p>
            <strong>Schreiben Sie etwas zu:</strong>
            <ul style={listStyle}>
              <li>Wann beginnt der nächste Kurs?</li>
              <li>Wie viel kostet der Kurs?</li>
              <li>Gibt es einen Abendkurs?</li>
            </ul>
            <p style={paragraphStyle}>
              Schreiben Sie circa 30 Wörter. Schreiben Sie eine Anrede und einen Gruß.
            </p>
          </div>
        </article>

        <article
          style={{ ...cardStyle, borderColor: "#86efac", background: "#f0fdf4" }}
          aria-label="Informelle Schreibaufgabe"
        >
          <span style={{ ...labelStyle, background: "#dcfce7", color: "#166534" }}>
            Informelle Aufgabe
          </span>
          <h3 style={{ margin: 0 }}>E-Mail an eine Freundin</h3>
          <div style={taskStyle}>
            <p style={paragraphStyle}>
              Sie haben am Samstag Geburtstag und möchten Ihre Freundin Anna einladen. Schreiben
              Sie eine E-Mail an Anna.
            </p>
            <strong>Schreiben Sie etwas zu:</strong>
            <ul style={listStyle}>
              <li>Warum schreiben Sie?</li>
              <li>Wann und wo ist die Feier?</li>
              <li>Was soll Anna mitbringen?</li>
            </ul>
            <p style={paragraphStyle}>
              Schreiben Sie circa 30 Wörter. Schreiben Sie eine Anrede und einen Gruß.
            </p>
          </div>
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
