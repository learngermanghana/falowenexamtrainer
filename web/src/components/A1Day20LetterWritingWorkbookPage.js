import React from "react";
import { styles } from "../styles";
import {
  A1_DAY20_CHAPTER123_GRAMMAR_ROUTE,
  A1_DAY20_CHAPTER123_RESOURCE_HUB_ROUTE,
} from "../data/a1Day20LetterWritingRoutes";
import A1TutorMarkedWorkbookShell, { WorkbookSection } from "./A1TutorMarkedWorkbookShell";
import A1CourseBookLetterPracticePanel from "./A1CourseBookLetterPracticePanel";

const sectionStyle = {
  ...styles.card,
  display: "grid",
  gap: 14,
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

const questionCardStyle = {
  border: "1px solid #bfdbfe",
  borderRadius: 18,
  padding: 18,
  display: "grid",
  gap: 12,
  background: "linear-gradient(135deg, #eff6ff, #ffffff 70%)",
};

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
      {items.map((item) => <li key={item}>{item}</li>)}
    </Tag>
  );
};

const GrammarNotesAction = () => (
  <a
    href={A1_DAY20_CHAPTER123_GRAMMAR_ROUTE}
    data-a1-day20-grammar-notes-action="persistent"
    style={{
      ...styles.primaryButton,
      ...styles.primaryButtonLink,
      minHeight: 42,
      width: "fit-content",
    }}
  >
    Open grammar notes
  </a>
);

const InformalLetterPractice = () => (
  <A1CourseBookLetterPracticePanel
    title="Mark My Informal Letter"
    description="Write or paste your birthday letter here. Falowen will mark it and explain the corrections before you copy the improved version to Submit."
    taskId="A1-12.3-teil-1-informal-letter"
    taskTitle="Informal birthday letter to a friend"
    taskContext="informal birthday note to a friend using du, dir and an informal closing"
    letterType="informal"
    promptType="note"
    placeholder={"Hallo Anna,\n\nwie geht es dir? Ich schreibe dir, weil ...\n\nLiebe Grüße\nMia"}
    minimumWords={35}
    maximumWords={50}
  />
);

const FormalLetterPractice = () => (
  <A1CourseBookLetterPracticePanel
    title="Mark My Formal Letter"
    description="Write or paste your enquiry to the language school here. Improve it with the feedback before copying the final version to Submit."
    taskId="A1-12.3-teil-2-formal-letter"
    taskTitle="Formal enquiry to a language school"
    taskContext="formal email to a language school using Sie, Ihnen, a formal greeting and a formal closing"
    letterType="formal"
    promptType="email"
    placeholder={"Sehr geehrte Damen und Herren,\n\nich schreibe Ihnen, weil ...\n\nMit freundlichen Grüßen\nMax Mustermann"}
    minimumWords={35}
    maximumWords={50}
  />
);

const WorkbookOverview = () => (
  <section
    style={{ ...sectionStyle, border: "1px solid #93c5fd", background: "#eff6ff" }}
    data-a1-day20-chapter123-workbook-overview="true"
  >
    <span style={eyebrowStyle}>Tutor-marked assignment · A1-12.3</span>
    <h2 style={{ margin: 0 }}>How this workbook is organised</h2>
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      Use the shared navigation: <strong>Overview</strong>, <strong>Teil 1</strong>,{" "}
      <strong>Teil 2</strong>, and <strong>Submit</strong>. Open each Teil, write the letter,
      use <strong>Mark My Letter</strong> below the task, and improve it before final submission.
    </p>
    <a
      href={A1_DAY20_CHAPTER123_GRAMMAR_ROUTE}
      style={{ ...styles.secondaryButton, width: "fit-content", textDecoration: "none" }}
    >
      Open grammar notes
    </a>
  </section>
);

const InformalLetterSection = () => (
  <section style={questionCardStyle} data-a1-letter-task="informal">
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
    <InformalLetterPractice />
  </section>
);

const FormalLetterSection = () => (
  <section style={questionCardStyle} data-a1-letter-task="formal">
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
        Schreiben Sie eine kurze E-Mail an die Sprachschule. Schreiben Sie etwas zu allen Punkten:
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
    <FormalLetterPractice />
  </section>
);

export default function A1Day20LetterWritingWorkbookPage() {
  return (
    <A1TutorMarkedWorkbookShell
      fallbackAssignmentKey="A1-12.3"
      title="A1 · Day 20 Workbook · Letter Writing"
      subtitle="Kapitel 12.3 · Tutor-marked Schreiben assignment"
      assignmentIntro="Use Overview, complete Teil 1 and Teil 2, check both drafts with Mark My Letter, then open Submit and send both final letters to your tutor."
      submitTitle="Submit A1 · Day 20 · Kapitel 12.3"
      submitDescription="This submission is locked to A1-12.3. Submit both the informal and formal letter for tutor marking."
      backLabel="Back to lesson"
      backTo={A1_DAY20_CHAPTER123_RESOURCE_HUB_ROUTE}
      headerActions={<GrammarNotesAction />}
    >
      <WorkbookOverview />
      <WorkbookSection sectionKey="teil-1">
        <InformalLetterSection />
      </WorkbookSection>
      <WorkbookSection sectionKey="teil-2">
        <FormalLetterSection />
      </WorkbookSection>
    </A1TutorMarkedWorkbookShell>
  );
}
