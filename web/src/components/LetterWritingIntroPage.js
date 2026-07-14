import React, { memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { styles } from "../styles";
import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell";
import AppBackButton from "./navigation/AppBackButton";

export const A1_DAY20_CHAPTER123_GRAMMAR_ROUTE =
  "/campus/course/letter-writing-intro-12-3";
export const A1_DAY20_CHAPTER123_WORKBOOK_ROUTE =
  "/campus/course/letter-writing-intro-german-a1-day-12-3";
export const A1_DAY20_CHAPTER123_LESSON_ROUTE =
  "/campus/course/lesson/A1/20?chapter=12.3";

const heroImageUrl =
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1800&q=80";

const pageStyle = { ...styles.container, display: "grid", gap: 16 };
const sectionStyle = { ...styles.card, display: "grid", gap: 12, marginBottom: 0 };
const infoBoxStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  padding: 14,
  display: "grid",
  gap: 10,
  background: "#ffffff",
};
const eyebrowStyle = {
  display: "inline-flex",
  width: "fit-content",
  padding: "6px 12px",
  borderRadius: 999,
  background: "#dbeafe",
  color: "#1d4ed8",
  fontSize: 13,
  fontWeight: 800,
};
const blueBannerStyle = {
  border: "1px solid #bfdbfe",
  borderRadius: 16,
  padding: 16,
  background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
  color: "#1e3a8a",
  lineHeight: 1.7,
};
const orangeBannerStyle = {
  border: "1px solid #fed7aa",
  borderRadius: 16,
  padding: 16,
  background: "#fff7ed",
  color: "#9a3412",
  lineHeight: 1.7,
};
const exampleStyle = {
  border: "1px solid #dbeafe",
  borderRadius: 12,
  padding: 12,
  background: "#f8fbff",
  lineHeight: 1.7,
};
const questionCardStyle = {
  border: "1px solid #bfdbfe",
  borderRadius: 18,
  padding: 18,
  display: "grid",
  gap: 12,
  background: "linear-gradient(135deg, #eff6ff, #ffffff 70%)",
};
const gridStyle = {
  display: "grid",
  gap: 12,
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
};
const tableStyle = { width: "100%", borderCollapse: "collapse", fontSize: 15 };
const tableCellStyle = {
  border: "1px solid #cbd5e1",
  padding: "9px 10px",
  textAlign: "left",
  verticalAlign: "top",
};

const Section = ({ title, children }) => (
  <section style={sectionStyle}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const InfoBox = ({ title, children }) => (
  <div style={infoBoxStyle}>
    {title ? <strong>{title}</strong> : null}
    {children}
  </div>
);

const BulletList = ({ items, ordered = false }) => {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag style={{ margin: 0, paddingLeft: 24, display: "grid", gap: 8, lineHeight: 1.68 }}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </Tag>
  );
};

const ComparisonTable = ({ rows }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={{ ...tableCellStyle, background: "#eff6ff" }}>Feature</th>
          <th style={{ ...tableCellStyle, background: "#eff6ff" }}>Informal</th>
          <th style={{ ...tableCellStyle, background: "#eff6ff" }}>Formal</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([feature, informal, formal]) => (
          <tr key={feature}>
            <td style={tableCellStyle}>{feature}</td>
            <td style={tableCellStyle}>{informal}</td>
            <td style={tableCellStyle}>{formal}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const resolveLetterWritingPageMode = (pathname = "") => {
  const normalized = String(pathname || "").replace(/\/+$/, "");
  return normalized === A1_DAY20_CHAPTER123_GRAMMAR_ROUTE ? "grammar" : "workbook";
};

const GrammarNotesPage = () => {
  const navigate = useNavigate();

  return (
    <main style={pageStyle} data-a1-day20-chapter123-grammar-notes="true">
      <header style={{ ...styles.card, padding: 0, overflow: "hidden" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              padding: 24,
              display: "grid",
              gap: 14,
              background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 60%, #f8fafc 100%)",
            }}
          >
            <AppBackButton
              label="Back to Course Book"
              fallbackPath="/campus/course"
              onBack={() => navigate(A1_DAY20_CHAPTER123_LESSON_ROUTE, { replace: true })}
            />
            <span style={eyebrowStyle}>A1 · Day 20 · Kapitel 12.3 · Grammar Notes</span>
            <h1 style={{ ...styles.title, margin: 0 }}>Letter Writing — Start Here</h1>
            <p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.7 }}>
              This is your first complete A1 letter-writing lesson. Learn the difference between a
              form and a letter, choose formal or informal language, answer every task point, and
              check your work before submitting it.
            </p>
            <div style={blueBannerStyle}>
              <strong>Read these notes before the tutor-marked assignment.</strong>
              <div>
                The workbook uses the shared navigation: <strong>Overview, Teil 1, Teil 2</strong>,
                and <strong>Submit</strong>.
              </div>
            </div>
          </div>
          <img
            src={heroImageUrl}
            alt="Notebook, pen, and coffee for German letter-writing practice"
            style={{ width: "100%", height: "100%", minHeight: 260, objectFit: "cover" }}
          />
        </div>
      </header>

      <Section title="Learning goals">
        <BulletList
          items={[
            "Understand Schreiben Teil 1 (form filling) and Schreiben Teil 2 (short message or letter).",
            "Recognise when to use du-language and when to use formal Sie-language.",
            "Build a complete letter with greeting, opening, task points, closing, and name.",
            "Write statements, W-questions, yes/no questions, and weil-clauses correctly.",
            "Use a checklist before submitting the two workbook letters.",
          ]}
        />
      </Section>

      <Section title="First: form and letter are different">
        <div style={orangeBannerStyle}>
          <strong>Do not confuse the exam parts with the workbook tabs.</strong>
          <div>
            In the A1 writing exam, <strong>Teil 1</strong> is commonly a form and{" "}
            <strong>Teil 2</strong> is a short message or letter. In this tutor workbook, Teil 1 and
            Teil 2 simply mean Letter 1 and Letter 2.
          </div>
        </div>
        <div style={gridStyle}>
          <InfoBox title="Exam Schreiben Teil 1 · Formular">
            <BulletList
              items={[
                "Read a short situation with personal information.",
                "Transfer the information into empty fields.",
                "Typical fields: name, birth date, address, phone, email, date, course, and signature.",
                "Do not write a complete letter here.",
              ]}
            />
          </InfoBox>
          <InfoBox title="Exam Schreiben Teil 2 · Nachricht oder Brief">
            <BulletList
              items={[
                "Read the situation and identify the recipient.",
                "Answer every content point in complete sentences or questions.",
                "Choose the correct formal or informal language.",
                "Use a suitable greeting, closing, and name.",
              ]}
            />
          </InfoBox>
        </div>
      </Section>

      <Section title="Schreiben Teil 1: complete a form step by step">
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          A form tests careful reading. Do not invent information. Copy the correct details from the
          situation into the correct fields.
        </p>
        <InfoBox title="Example situation">
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Maria Gómez was born on 14 March 1998. She lives at Gartenstraße 8, 60311 Frankfurt.
            Her telephone number is 0176 23456789 and her email is maria.gomez@example.com. She
            wants the evening German course.
          </p>
        </InfoBox>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={{ ...tableCellStyle, background: "#eff6ff" }}>Form field</th>
                <th style={{ ...tableCellStyle, background: "#eff6ff" }}>Correct entry</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Familienname", "Gómez"],
                ["Vorname", "Maria"],
                ["Geburtsdatum", "14.03.1998"],
                ["Straße / Hausnummer", "Gartenstraße 8"],
                ["PLZ / Ort", "60311 Frankfurt"],
                ["Telefon", "0176 23456789"],
                ["E-Mail", "maria.gomez@example.com"],
                ["Kurs", "Abendkurs Deutsch"],
              ].map(([field, value]) => (
                <tr key={field}>
                  <td style={tableCellStyle}>{field}</td>
                  <td style={tableCellStyle}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <BulletList
          ordered
          items={[
            "Read the complete situation once.",
            "Underline names, dates, numbers, addresses, and the requested service.",
            "Match each detail to the correct field.",
            "Copy spelling, capital letters, accents, and numbers carefully.",
            "Use the date format requested by the form.",
            "Check that no required field is empty.",
          ]}
        />
      </Section>

      <Section title="Schreiben Teil 2: understand the letter task">
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Before writing, find the <strong>situation</strong>, the <strong>recipient</strong>, the{" "}
          <strong>content points</strong>, and the correct <strong>register</strong> (formal or
          informal).
        </p>
        <InfoBox title="The five-part letter plan">
          <BulletList
            ordered
            items={[
              "Anrede: choose the correct greeting.",
              "Einleitung: say why you are writing.",
              "Hauptteil: answer every task point clearly.",
              "Schlusssatz: ask for an answer or add a friendly final sentence.",
              "Gruß und Name: use the correct closing and write your name.",
            ]}
          />
        </InfoBox>
        <div style={exampleStyle}>
          <strong>Planning formula:</strong>
          <div style={{ marginTop: 6 }}>
            Greeting → reason → point 1 → point 2 → point 3 → final sentence → closing → name
          </div>
        </div>
      </Section>

      <Section title="Choose formal or informal language">
        <ComparisonTable
          rows={[
            ["Recipient", "Friend or family", "School, company, office, unknown adult"],
            ["Pronouns", "du, dir, dich, dein/deine", "Sie, Ihnen, Ihr/Ihre"],
            ["Greeting", "Hallo / Liebe / Lieber", "Sehr geehrte ..."],
            ["Request", "Kannst du ...?", "Könnten Sie bitte ...?"],
            ["Closing", "Liebe Grüße / Viele Grüße", "Mit freundlichen Grüßen"],
            ["Name", "Usually first name", "Usually first name and surname"],
          ]}
        />
      </Section>

      <Section title="Informal letter: du-language">
        <div style={gridStyle}>
          <InfoBox title="Greeting and closing">
            <BulletList
              items={[
                "Hallo Anna, / Liebe Anna, / Lieber Paul,",
                "After the greeting, write a comma.",
                "End with Liebe Grüße or Viele Grüße.",
                "Write your first name.",
              ]}
            />
          </InfoBox>
          <InfoBox title="Useful phrases">
            <BulletList
              items={[
                "Wie geht es dir?",
                "Ich schreibe dir, weil ...",
                "Herzlichen Glückwunsch zum Geburtstag!",
                "Machst du eine Feier?",
                "Kann ich mit meiner Familie kommen?",
                "Schreib mir bitte bald.",
              ]}
            />
          </InfoBox>
        </div>
        <InfoBox title="Model informal letter">
          <div style={{ whiteSpace: "pre-line", lineHeight: 1.75 }}>
            {`Hallo Anna,\n\nwie geht es dir? Ich schreibe dir, weil ich dir zum Geburtstag gratulieren möchte. Herzlichen Glückwunsch! Machst du eine Feier? Kann ich mit meiner Familie kommen?\n\nLiebe Grüße\nMia`}
          </div>
        </InfoBox>
      </Section>

      <Section title="Formal letter: Sie-language">
        <div style={gridStyle}>
          <InfoBox title="Greeting and closing">
            <BulletList
              items={[
                "Sehr geehrte Frau Müller, / Sehr geehrter Herr Becker,",
                "Use Sehr geehrte Damen und Herren, when the name is unknown.",
                "End with Mit freundlichen Grüßen.",
                "Write your first name and surname.",
              ]}
            />
          </InfoBox>
          <InfoBox title="Useful phrases">
            <BulletList
              items={[
                "Ich schreibe Ihnen, weil ...",
                "Ich interessiere mich für Ihren Deutschkurs.",
                "Könnten Sie mir bitte Informationen schicken?",
                "Wann beginnt der Kurs?",
                "Wie viel kostet der Kurs?",
                "Wie kann ich bezahlen?",
              ]}
            />
          </InfoBox>
        </div>
        <InfoBox title="Model formal letter">
          <div style={{ whiteSpace: "pre-line", lineHeight: 1.75 }}>
            {`Sehr geehrte Damen und Herren,\n\nich schreibe Ihnen, weil ich mich für Ihren Deutschkurs interessiere. Wann beginnt der nächste Kurs? Wie viel kostet er und wie kann ich bezahlen?\n\nIch freue mich auf Ihre Antwort.\n\nMit freundlichen Grüßen\nMax Mustermann`}
          </div>
        </InfoBox>
      </Section>

      <Section title="Turn every task point into a sentence">
        <div style={gridStyle}>
          <InfoBox title="Informal birthday task">
            <BulletList
              items={[
                "Reason: Ich schreibe dir, weil du Geburtstag hast.",
                "Congratulation: Herzlichen Glückwunsch zum Geburtstag!",
                "Celebration: Machst du eine Feier?",
                "Family: Kann ich mit meiner Familie kommen?",
              ]}
            />
          </InfoBox>
          <InfoBox title="Formal language-school task">
            <BulletList
              items={[
                "Reason: Ich interessiere mich für Ihren Deutschkurs.",
                "Information: Könnten Sie mir bitte Informationen schicken?",
                "Dates: Wann beginnt der nächste Kurs?",
                "Price/payment: Wie viel kostet der Kurs und wie kann ich bezahlen?",
              ]}
            />
          </InfoBox>
        </div>
      </Section>

      <Section title="Question word order and the weil rule">
        <div style={gridStyle}>
          <InfoBox title="W-question">
            <div style={exampleStyle}>
              <strong>Question word + verb + subject</strong>
              <br />
              Wann beginnt der Kurs?
              <br />
              Wo findet die Feier statt?
            </div>
          </InfoBox>
          <InfoBox title="Yes/no question">
            <div style={exampleStyle}>
              <strong>Verb + subject + rest</strong>
              <br />
              Machst du eine Feier?
              <br />
              Kann ich online bezahlen?
            </div>
          </InfoBox>
        </div>
        <InfoBox title="Weil = because">
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            After <strong>weil</strong>, the conjugated verb moves to the end.
          </p>
          <div style={exampleStyle}>
            Ich schreibe dir, weil du Geburtstag <strong>hast</strong>.
            <br />
            Ich schreibe Ihnen, weil ich einen Deutschkurs besuchen <strong>möchte</strong>.
          </div>
        </InfoBox>
      </Section>

      <Section title="Writing rules and common mistakes">
        <div style={gridStyle}>
          <InfoBox title="Remember">
            <BulletList
              items={[
                "German nouns begin with a capital letter.",
                "Write a comma after the greeting and before weil.",
                "Use a question mark after a direct question.",
                "Aim for about 35–50 words per course letter unless the task says otherwise.",
                "Clear A1 sentences are better than long, complicated sentences.",
              ]}
            />
          </InfoBox>
          <InfoBox title="Avoid">
            <BulletList
              items={[
                "Mixing du and Sie.",
                "Forgetting a task point.",
                "Using statement order in a question.",
                "Forgetting the verb at the end after weil.",
                "Using the wrong greeting or closing.",
                "Forgetting your name.",
              ]}
            />
          </InfoBox>
        </div>
      </Section>

      <Section title="Final checklist">
        <BulletList
          ordered
          items={[
            "Did I write to the correct person?",
            "Did I choose du-language or Sie-language correctly?",
            "Do I have the correct greeting?",
            "Did I answer every task point?",
            "Are my questions correctly formed?",
            "Is the verb at the end after weil?",
            "Do nouns begin with capital letters?",
            "Do I have a suitable closing and my name?",
            "Did I read the letter once more?",
          ]}
        />
      </Section>

      <Section title="Watch the explanation">
        <a
          href="https://youtu.be/JtgoO2fmOpU"
          target="_blank"
          rel="noreferrer"
          style={{ ...styles.secondaryButton, width: "fit-content", textDecoration: "none" }}
        >
          ▶ Open A1 Day 20 letter-writing video
        </a>
      </Section>

      <Section title="Ready for the tutor-marked assignment?">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Use Overview, complete Teil 1 and Teil 2, and then submit the informal and formal letters
          together.
        </p>
        <button
          type="button"
          style={{ ...styles.primaryButton, width: "fit-content" }}
          onClick={() => navigate(A1_DAY20_CHAPTER123_WORKBOOK_ROUTE)}
        >
          Open tutor-marked workbook
        </button>
      </Section>
    </main>
  );
};

const WorkbookQuestions = () => (
  <div
    data-a1-day20-chapter123-workbook-content="true"
    style={{ display: "grid", gap: 16 }}
  >
    <section style={{ ...sectionStyle, border: "1px solid #93c5fd", background: "#eff6ff" }}>
      <span style={eyebrowStyle}>Tutor-marked assignment · A1-12.3</span>
      <h2 style={{ margin: 0 }}>How this workbook is organised</h2>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Use the shared navigation: <strong>Overview</strong>, <strong>Teil 1</strong>,{" "}
        <strong>Teil 2</strong>, and <strong>Submit</strong>. Write both letters before submitting.
      </p>
      <div style={orangeBannerStyle}>
        Here, Teil 1 and Teil 2 mean the two workbook letters. In the A1 exam, Schreiben Teil 1 is
        normally the form and Schreiben Teil 2 is the short message or letter.
      </div>
      <a
        href={A1_DAY20_CHAPTER123_GRAMMAR_ROUTE}
        style={{ ...styles.secondaryButton, width: "fit-content", textDecoration: "none" }}
      >
        Review the detailed grammar notes
      </a>
    </section>

    <section style={questionCardStyle}>
      <span style={{ ...eyebrowStyle, background: "#dcfce7", color: "#166534" }}>
        Letter 1 · Informal
      </span>
      <h2 style={{ margin: 0 }}>Teil 1 · Informal letter: Birthday message</h2>
      <InfoBox title="Situation">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Ihr Freund / Ihre Freundin hat Geburtstag. Sie möchten gratulieren und mehr über die
          Geburtstagsfeier wissen.
        </p>
      </InfoBox>
      <InfoBox title="Aufgabe">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Schreiben Sie eine kurze Nachricht. Schreiben Sie etwas zu allen Punkten:
        </p>
        <BulletList
          ordered
          items={[
            "Sagen Sie, warum Sie schreiben.",
            "Gratulieren Sie zum Geburtstag.",
            "Fragen Sie, ob es eine Feier gibt und ob Sie mit Ihrer Familie kommen können.",
          ]}
        />
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Schreiben Sie ungefähr 35–50 Wörter. Schreiben Sie eine passende Anrede, einen Gruß und
          Ihren Namen.
        </p>
      </InfoBox>
      <InfoBox title="Use">
        <BulletList
          items={[
            "du, dir, dich, dein/deine",
            "Hallo, Liebe, or Lieber",
            "Liebe Grüße or Viele Grüße",
          ]}
        />
      </InfoBox>
    </section>

    <section style={questionCardStyle}>
      <span style={{ ...eyebrowStyle, background: "#ffedd5", color: "#9a3412" }}>
        Letter 2 · Formal
      </span>
      <h2 style={{ margin: 0 }}>Teil 2 · Formal letter: Enquiry to a language school</h2>
      <InfoBox title="Situation">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Sie möchten einen Deutschkurs besuchen. Auf der Website einer Sprachschule fehlen
          wichtige Informationen.
        </p>
      </InfoBox>
      <InfoBox title="Aufgabe">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Schreiben Sie eine kurze E-Mail an die Sprachschule. Schreiben Sie etwas zu allen
          Punkten:
        </p>
        <BulletList
          ordered
          items={[
            "Sagen Sie, warum Sie schreiben.",
            "Bitten Sie um Informationen über die Deutschkurse.",
            "Fragen Sie nach Kursterminen, Preisen und Zahlungsmöglichkeiten.",
          ]}
        />
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Schreiben Sie ungefähr 35–50 Wörter. Schreiben Sie eine passende Anrede, einen formellen
          Gruß und Ihren vollständigen Namen.
        </p>
      </InfoBox>
      <InfoBox title="Use">
        <BulletList
          items={[
            "Sie, Ihnen, Ihr/Ihre",
            "Sehr geehrte Damen und Herren,",
            "Mit freundlichen Grüßen + full name",
          ]}
        />
      </InfoBox>
    </section>
  </div>
);

const WorkbookPage = () => (
  <A1TutorMarkedWorkbookShell
    day={20}
    chapter="12.3"
    fallbackAssignmentKey="A1-12.3"
    title="A1 · Day 20 Workbook · Letter Writing"
    subtitle="Kapitel 12.3 · Tutor-marked Schreiben assignment"
    assignmentIntro="Use Overview, complete Teil 1 and Teil 2, then open Submit and send both final letters to your tutor."
    submitTitle="Submit A1 · Day 20 · Kapitel 12.3"
    submitDescription="This submission is locked to A1-12.3. Submit both the informal and formal letter for tutor marking."
  >
    <WorkbookQuestions />
  </A1TutorMarkedWorkbookShell>
);

const LetterWritingIntroPage = () => {
  const location = useLocation();
  const mode = resolveLetterWritingPageMode(location.pathname);
  return mode === "grammar" ? <GrammarNotesPage /> : <WorkbookPage />;
};

export default memo(LetterWritingIntroPage);
