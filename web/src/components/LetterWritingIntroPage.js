import React, { memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { styles } from "../styles";
import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell";
import AppBackButton from "./navigation/AppBackButton";

export const A1_DAY20_CHAPTER123_GRAMMAR_ROUTE =
  "/campus/course/letter-writing-intro-12-3";
export const A1_DAY20_CHAPTER123_WORKBOOK_ROUTE =
  "/campus/course/letter-writing-intro-german-a1-day-12-3";

const heroImageUrl =
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1800&q=80";

const pageStyle = {
  ...styles.container,
  display: "grid",
  gap: 16,
};

const heroStyle = {
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

const heroImageStyle = {
  width: "100%",
  height: "100%",
  minHeight: 260,
  objectFit: "cover",
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

const sectionStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
  marginBottom: 0,
};

const infoBoxStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  padding: 14,
  display: "grid",
  gap: 10,
  background: "#ffffff",
};

const noteBannerStyle = {
  border: "1px solid #bfdbfe",
  borderRadius: 16,
  padding: 16,
  background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
  color: "#1e3a8a",
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

const BulletList = ({ items }) => (
  <ul style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8, lineHeight: 1.65 }}>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

export const resolveLetterWritingPageMode = (pathname = "") => {
  const normalized = String(pathname || "").replace(/\/+$/, "");
  return normalized === A1_DAY20_CHAPTER123_GRAMMAR_ROUTE ? "grammar" : "workbook";
};

const FormalNotes = () => (
  <>
    <InfoBox title="Formal greeting and structure">
      <BulletList
        items={[
          "Sehr geehrte Frau + Name — use this for a female person.",
          "Sehr geehrter Herr + Name — use this for a male person.",
          "Sehr geehrte Damen und Herren — use this when you do not know the name.",
          "Opening: Ich hoffe, es geht Ihnen gut. Ich schreibe Ihnen, weil ...",
          "Main body: Ask for information, make a request, explain your reason, or ask questions.",
          "Conclusion: Ich freue mich im Voraus auf Ihre Antwort.",
          "Closing: Mit freundlichen Grüßen + your full name.",
        ]}
      />
    </InfoBox>

    <InfoBox title="Useful formal phrases">
      <BulletList
        items={[
          "Ich schreibe Ihnen, weil ich eine Anfrage stellen möchte.",
          "Könnten Sie mir bitte Informationen über ... geben?",
          "Wie viel kostet der Deutschkurs?",
          "Wann beginnt der Kurs?",
          "Wie kann ich bezahlen?",
          "Ich möchte mich für den Kurs anmelden.",
        ]}
      />
    </InfoBox>

    <InfoBox title="Short formal example">
      <div style={{ whiteSpace: "pre-line", lineHeight: 1.7 }}>
        {`Sehr geehrte Damen und Herren,\n\nich schreibe Ihnen, weil ich eine Anfrage zu Ihrem Deutschkurs stellen möchte.\nKönnten Sie mir bitte Informationen über die Kurstermine geben?\nWie viel kostet der Kurs und wie kann ich bezahlen?\n\nIch freue mich im Voraus auf Ihre Antwort.\nMit freundlichen Grüßen\nMax Mustermann`}
      </div>
    </InfoBox>
  </>
);

const InformalNotes = () => (
  <>
    <InfoBox title="Informal greeting and structure">
      <BulletList
        items={[
          "Hallo [Name] — suitable for a male or female friend.",
          "Liebe [Name] — use this for a female friend.",
          "Lieber [Name] — use this for a male friend.",
          "Opening: Wie geht es dir? Ich hoffe, es geht dir gut. Ich schreibe dir, weil ...",
          "Main body: Congratulate, invite, ask questions, or explain your plans.",
          "Conclusion: Ich freue mich im Voraus auf deine Antwort.",
          "Closing: Liebe Grüße / Viele Grüße + your first name.",
        ]}
      />
    </InfoBox>

    <InfoBox title="Useful informal phrases">
      <BulletList
        items={[
          "Herzlichen Glückwunsch zum Geburtstag!",
          "Ich wünsche dir alles Gute.",
          "Machst du eine Feier?",
          "Wo findet die Feier statt?",
          "Kann ich mit meiner Familie kommen?",
          "Ich freue mich auf deine Feier.",
        ]}
      />
    </InfoBox>

    <InfoBox title="Short informal example">
      <div style={{ whiteSpace: "pre-line", lineHeight: 1.7 }}>
        {`Hallo Anna,\n\nwie geht es dir? Ich hoffe, es geht dir gut.\nIch schreibe dir, weil ich dir zum Geburtstag gratulieren möchte.\nMachst du eine Feier? Kann ich mit meiner Familie kommen?\n\nIch freue mich im Voraus auf deine Antwort.\nViele Grüße\nMia`}
      </div>
    </InfoBox>
  </>
);

const GrammarNotesPage = () => {
  const navigate = useNavigate();

  return (
    <main style={pageStyle} data-a1-day20-chapter123-grammar-notes="true">
      <header style={heroStyle}>
        <div style={heroLayoutStyle}>
          <div style={heroContentStyle}>
            <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
            <span style={eyebrowStyle}>A1 · Day 20 · Kapitel 12.3 · Grammar Notes</span>
            <h1 style={{ ...styles.title, margin: 0 }}>Letter Writing — Read First</h1>
            <p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.7 }}>
              Learn how to write both formal and informal A1 letters step by step. Read the
              structure first, learn useful phrases, understand the <strong>weil</strong> rule,
              and then write your answer with confidence.
            </p>
            <div style={noteBannerStyle}>
              <strong>Read these notes before the tutor-marked assignment</strong>
              <div>
                Chapter 12.3 is not self-learning. After reading these notes, complete both
                workbook letters and submit them to your tutor through the Submit tab.
              </div>
            </div>
          </div>
          <img
            src={heroImageUrl}
            alt="Notebook, pen, and coffee for German letter-writing practice"
            style={heroImageStyle}
          />
        </div>
      </header>

      <Section title="A1 Schreiben exam overview">
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          In the A1 Schreiben exam, <strong>Teil 1</strong> is form filling and
          <strong> Teil 2</strong> is letter writing. In this course, your main focus is Teil 2,
          so you must learn the correct greeting, useful phrases, question forms, and the word
          order with <strong>weil</strong>.
        </p>
      </Section>

      <Section title="Watch first">
        <InfoBox title="A1 Day 20 · Introduction to Letter Writing 12.3">
          <a
            href="https://youtu.be/JtgoO2fmOpU"
            target="_blank"
            rel="noreferrer"
            style={{ ...styles.secondaryButton, width: "fit-content", textDecoration: "none" }}
          >
            ▶ Open explanation video
          </a>
        </InfoBox>
      </Section>

      <Section title="Formal letter notes">
        <FormalNotes />
      </Section>

      <Section title="Informal letter notes">
        <InformalNotes />
      </Section>

      <Section title="The weil rule">
        <InfoBox title="Weil = because">
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            After <strong>weil</strong>, the conjugated verb moves to the end of the clause.
          </p>
          <div style={exampleStyle}>
            <strong>Normal:</strong> Ich komme nicht.<br />
            <strong>With weil:</strong> Ich schreibe dir, weil ich nicht komme.
          </div>
          <div style={exampleStyle}>
            <strong>Normal:</strong> Ich kann nicht kommen.<br />
            <strong>With weil:</strong> Ich schreibe dir, weil ich nicht kommen kann.
          </div>
          <div style={exampleStyle}>
            <strong>Normal:</strong> Ich möchte eine Anfrage stellen.<br />
            <strong>With weil:</strong> Ich schreibe Ihnen, weil ich eine Anfrage stellen möchte.
          </div>
        </InfoBox>
      </Section>

      <Section title="Ready for the tutor-marked assignment?">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          The workbook contains two required writing questions: one informal letter and one formal
          letter. Submit both answers for tutor marking.
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
      <h2 style={{ margin: 0 }}>Complete and submit both letters</h2>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Use the Assignment tab to read the questions. When both letters are ready, open the Submit
        tab and send your final answers to your tutor.
      </p>
      <a
        href={A1_DAY20_CHAPTER123_GRAMMAR_ROUTE}
        style={{ ...styles.secondaryButton, width: "fit-content", textDecoration: "none" }}
      >
        Review grammar notes
      </a>
    </section>

    <section style={questionCardStyle}>
      <span style={{ ...eyebrowStyle, background: "#dcfce7", color: "#166534" }}>
        Question 1 · Informal letter
      </span>
      <h2 style={{ margin: 0 }}>Birthday letter to a friend</h2>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Ihr Freund / Ihre Freundin hat Geburtstag. Schreiben Sie an ihn / sie:
      </p>
      <BulletList
        items={[
          "Warum schreiben Sie?",
          "Gratulieren Sie ihm / ihr.",
          "Fragen Sie, ob er / sie eine Feier plant und ob Sie mit Ihrer Familie kommen können.",
        ]}
      />
    </section>

    <section style={questionCardStyle}>
      <span style={{ ...eyebrowStyle, background: "#ffedd5", color: "#9a3412" }}>
        Question 2 · Formal letter
      </span>
      <h2 style={{ margin: 0 }}>Letter to a language school</h2>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Sie möchten einen Deutschkurs besuchen. Schreiben Sie an die Sprachschule:
      </p>
      <BulletList
        items={[
          "Warum schreiben Sie?",
          "Bitten Sie um Informationen über Kurse.",
          "Fragen Sie nach Kursterminen, Preisen und Zahlungsmethoden.",
        ]}
      />
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
    assignmentIntro="Write the informal and formal letters below. Then open Submit and send both final answers to your tutor."
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
