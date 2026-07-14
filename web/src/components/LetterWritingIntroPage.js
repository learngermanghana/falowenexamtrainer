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
  "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1600&q=80";

const pageStyle = { ...styles.container, display: "grid", gap: 16 };
const sectionStyle = { ...styles.card, display: "grid", gap: 14, marginBottom: 0 };
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
  lineHeight: 1.75,
};
const questionCardStyle = {
  border: "1px solid #bfdbfe",
  borderRadius: 18,
  padding: 18,
  display: "grid",
  gap: 12,
  background: "linear-gradient(135deg, #eff6ff, #ffffff 70%)",
};
const structureCardStyle = {
  border: "1px solid #dbeafe",
  borderRadius: 18,
  padding: 18,
  display: "grid",
  gap: 16,
  background: "linear-gradient(135deg, #ffffff, #f8fbff)",
};
const labelStyle = {
  margin: 0,
  color: "#1e3a8a",
  fontSize: 14,
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: ".04em",
};
const fixedEndingStyle = {
  borderLeft: "4px solid #2563eb",
  padding: "12px 14px",
  background: "#eff6ff",
  borderRadius: "0 12px 12px 0",
  whiteSpace: "pre-line",
  lineHeight: 1.8,
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
    <Tag style={{ margin: 0, paddingLeft: 24, display: "grid", gap: 8, lineHeight: 1.7 }}>
      {items.map((item) => (
        <li key={typeof item === "string" ? item : undefined}>{item}</li>
      ))}
    </Tag>
  );
};

const WeilExplanation = ({ pronoun = "Ihnen" }) => (
  <div style={{ display: "grid", gap: 10 }}>
    <p style={{ margin: 0, lineHeight: 1.75 }}>
      After <strong>weil</strong>, move the conjugated verb or modal verb to the end of the clause.
    </p>
    <div style={exampleStyle}>
      <strong>Example 1</strong>
      <br />
      Ich kann nicht kommen.
      <br />
      Ich schreibe {pronoun}, weil ich nicht kommen <strong>kann</strong>.
    </div>
    <div style={exampleStyle}>
      <strong>Example 2</strong>
      <br />
      Ich komme nicht.
      <br />
      Ich schreibe {pronoun}, weil ich nicht <strong>komme</strong>.
    </div>
    <div style={blueBannerStyle}>
      <strong>Useful pattern:</strong>{" "}
      Ich schreibe {pronoun}, weil ich den Termin absagen <strong>möchte</strong>.
    </div>
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
      <header
        style={{ ...styles.card, display: "grid", gap: 14, padding: 16, marginBottom: 0 }}
        data-compact-letter-hero="true"
      >
        <AppBackButton
          label="Back to Course Book"
          fallbackPath="/campus/course"
          onBack={() => navigate(A1_DAY20_CHAPTER123_LESSON_ROUTE, { replace: true })}
        />
        <span style={eyebrowStyle}>A1 · Day 20 · Kapitel 12.3 · Grammar Notes</span>
        <div style={{ display: "grid", gap: 7 }}>
          <h1 style={{ ...styles.title, margin: 0 }}>Formal and Informal Letter Writing</h1>
          <p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.7 }}>
            Learn how to begin the letter, organise the main body, use <strong>weil</strong>,
            and finish with the correct fixed conclusion.
          </p>
        </div>
        <img
          src={heroImageUrl}
          alt="Notebook and pen prepared for writing a German letter"
          loading="eager"
          style={{
            width: "100%",
            height: 145,
            objectFit: "cover",
            objectPosition: "center 48%",
            borderRadius: 14,
            display: "block",
          }}
        />
      </header>

      <Section title="Before you write">
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          First decide who will receive your letter. Write a <strong>formal letter</strong> to a
          school, company, office, travel agency, or an adult you do not know personally. Write an{" "}
          <strong>informal letter</strong> to a friend or family member.
        </p>
        <div style={orangeBannerStyle}>
          Do not mix the two styles. Formal letters use <strong>Sie, Ihnen, Ihr/Ihre</strong>.
          Informal letters use <strong>du, dir, dich, dein/deine</strong>.
        </div>
      </Section>

      <section style={structureCardStyle} aria-label="Formal Letter Structure">
        <span style={{ ...eyebrowStyle, background: "#ffedd5", color: "#9a3412" }}>
          Formal letter
        </span>
        <h2 style={{ margin: 0 }}>Formal Letter Structure</h2>

        <div style={{ display: "grid", gap: 8 }}>
          <p style={labelStyle}>1. Greeting</p>
          <BulletList
            items={[
              <span key="formal-female">
                <strong>Sehr geehrte Frau + surname,</strong> — use this for a female recipient.
              </span>,
              <span key="formal-male">
                <strong>Sehr geehrter Herr + surname,</strong> — use this for a male recipient.
              </span>,
              <span key="formal-unknown">
                <strong>Sehr geehrte Damen und Herren,</strong> — use this when the recipient is
                unknown, for example a school or travel agency.
              </span>,
            ]}
          />
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <p style={labelStyle}>2. Opening and reason for writing</p>
          <div style={exampleStyle}>
            Ich hoffe, es geht Ihnen gut.
            <br />
            Ich schreibe Ihnen, weil [reason for writing].
          </div>
          <WeilExplanation pronoun="Ihnen" />
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <p style={labelStyle}>3. Main body</p>
          <p style={{ margin: 0, lineHeight: 1.75 }}>
            Answer every task point clearly. Use the following connectors where they fit:
          </p>
          <BulletList
            items={[
              <span key="formal-ob">
                <strong>Ich möchte wissen, ob ...</strong> — use this for an indirect yes/no
                question.
              </span>,
              <span key="formal-deshalb">
                <strong>deshalb</strong> — use this to show a result or consequence.
              </span>,
              <span key="formal-weil">
                <strong>weil</strong> — use this to give a reason; the verb goes to the end.
              </span>,
            ]}
          />
          <p style={{ margin: 0, lineHeight: 1.75 }}>
            Keep your sentences clear, well structured, and suitable for the situation.
          </p>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <p style={labelStyle}>4. Conclusion</p>
          <div style={fixedEndingStyle}>
            {`Ich freue mich im Voraus auf Ihre Antwort.\n\nMit freundlichen Grüßen\n[Your full name]`}
          </div>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Ich freue mich im Voraus auf Ihre Antwort.</strong> is the fixed conclusion for
            this lesson.
          </p>
        </div>

        <InfoBox title="Complete formal example">
          <div style={{ whiteSpace: "pre-line", lineHeight: 1.8 }}>
            {`Sehr geehrte Damen und Herren,\n\nich hoffe, es geht Ihnen gut. Ich schreibe Ihnen, weil ich mich für Ihren Deutschkurs anmelden möchte. Ich möchte wissen, ob der Kurs im August beginnt. Der Kurs ist wichtig für meine Arbeit, deshalb möchte ich bald anfangen. Wie viel kostet der Kurs und wie kann ich bezahlen?\n\nIch freue mich im Voraus auf Ihre Antwort.\n\nMit freundlichen Grüßen\nMax Mustermann`}
          </div>
        </InfoBox>
      </section>

      <section style={structureCardStyle} aria-label="Informal Letter Structure">
        <span style={{ ...eyebrowStyle, background: "#dcfce7", color: "#166534" }}>
          Informal letter
        </span>
        <h2 style={{ margin: 0 }}>Informal Letter Structure</h2>

        <div style={{ display: "grid", gap: 8 }}>
          <p style={labelStyle}>1. Greeting</p>
          <BulletList
            items={[
              <span key="informal-hallo">
                <strong>Hallo [first name],</strong> — use this for both male and female friends.
              </span>,
              <span key="informal-liebe">
                <strong>Liebe [first name],</strong> — use this for a female friend.
              </span>,
              <span key="informal-lieber">
                <strong>Lieber [first name],</strong> — use this for a male friend.
              </span>,
            ]}
          />
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <p style={labelStyle}>2. Opening and reason for writing</p>
          <div style={exampleStyle}>
            Wie geht es dir?
            <br />
            Ich hoffe, es geht dir gut.
            <br />
            Ich schreibe dir, weil [reason for writing].
          </div>
          <WeilExplanation pronoun="dir" />
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <p style={labelStyle}>3. Main body</p>
          <p style={{ margin: 0, lineHeight: 1.75 }}>
            Answer every task point in friendly, simple sentences. Use these connectors where they
            fit:
          </p>
          <BulletList
            items={[
              <span key="informal-ob">
                <strong>Ich möchte wissen, ob ...</strong> — use this for an indirect yes/no
                question.
              </span>,
              <span key="informal-deshalb">
                <strong>deshalb</strong> — use this to show a result or consequence.
              </span>,
              <span key="informal-weil">
                <strong>weil</strong> — use this to give a reason; the verb goes to the end.
              </span>,
            ]}
          />
          <p style={{ margin: 0, lineHeight: 1.75 }}>
            Read your sentences again and make sure the language remains informal throughout.
          </p>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <p style={labelStyle}>4. Conclusion</p>
          <div style={fixedEndingStyle}>
            {`Ich freue mich im Voraus auf deine Antwort.\n\nLiebe Grüße / Viele Grüße\n[Your first name]`}
          </div>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            You may use either <strong>Liebe Grüße</strong> or <strong>Viele Grüße</strong>.
          </p>
        </div>

        <InfoBox title="Complete informal example">
          <div style={{ whiteSpace: "pre-line", lineHeight: 1.8 }}>
            {`Hallo Anna,\n\nwie geht es dir? Ich hoffe, es geht dir gut. Ich schreibe dir, weil ich dir zum Geburtstag gratulieren möchte. Herzlichen Glückwunsch! Ich möchte wissen, ob du eine Feier planst. Ich bin am Samstag frei, deshalb kann ich kommen.\n\nIch freue mich im Voraus auf deine Antwort.\n\nLiebe Grüße\nMia`}
          </div>
        </InfoBox>
      </section>

      <Section title="Final check before the workbook">
        <BulletList
          ordered
          items={[
            "Did I choose formal or informal language?",
            "Did I use the correct greeting?",
            "Did I explain why I am writing?",
            "Did I answer every task point in the main body?",
            "Is the verb at the end after weil?",
            "Did I use the correct fixed conclusion and closing?",
            "Did I write my first name or full name as required?",
          ]}
        />
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
      <a
        href={A1_DAY20_CHAPTER123_GRAMMAR_ROUTE}
        style={{ ...styles.secondaryButton, width: "fit-content", textDecoration: "none" }}
      >
        Review the letter structures
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
