import React from "react";
import { styles } from "../styles";
import { A1_DAY20_CHAPTER123_RESOURCE_HUB_ROUTE } from "../data/a1Day20LetterWritingRoutes";
import A1TutorMarkedWorkbookShell, { WorkbookSection } from "./A1TutorMarkedWorkbookShell";
import A1CourseBookLetterPracticePanel from "./A1CourseBookLetterPracticePanel";
import "./A1Day20LetterWritingWorkbookPage.css";

const taskCard = {
  ...styles.card,
  display: "grid",
  gap: 14,
  border: "1px solid #bfdbfe",
  borderRadius: 18,
  background: "linear-gradient(135deg, #eff6ff, #ffffff 70%)",
  minWidth: 0,
};
const Intro = () => (
  <section style={{ ...taskCard, background: "#eff6ff" }} data-a1-day20-chapter123-workbook-overview="true">
    <h2 style={{ margin: 0 }}>How this workbook is organised</h2>
    <p style={{ margin: 0 }}>
      First read Grammar. Then write two short emails: one informal invitation and one formal
      course enquiry. Use Mark My Letter to improve each draft and submit both together.
    </p>
  </section>
);
const InformalLetterSection = () => (
  <section className="a1-day20-letter-task" style={taskCard} data-a1-letter-task="informal">
    <h2 style={{ margin: 0 }}>Teil 1 · Informal letter: Einladung an Julia</h2>
    <p style={{ margin: 0 }}>
      <strong>Aufgabe:</strong> Sie wollen am Wochenende eine Party feiern und Ihre Freundin Julia
      einladen. Schreiben Sie eine E-Mail an Julia.
    </p>
    <strong>Schreiben Sie zu allen 3 Punkten:</strong>
    <ol style={{ margin: 0, paddingLeft: 24, lineHeight: 1.75 }}>
      <li><strong>Grund des Schreibens:</strong> Einladung zur Party</li>
      <li><strong>Wann und wo:</strong> Tag, Uhrzeit und Ort</li>
      <li><strong>Mitbringen:</strong> Was soll Julia mitbringen? (z. B. Essen/Getränke)</li>
    </ol>
    <p style={{ margin: 0 }}><em>Schreiben Sie ca. 30 Wörter. Vergessen Sie nicht die Anrede und den Gruß!</em></p>
    <div className="a1-day20-write-here" data-a1-day20-write-here="teil-1">
      <strong>Write your informal email here</strong>
      <A1CourseBookLetterPracticePanel
        title="Mark My Informal Letter"
        description="Write your own email to Julia. Mark My Letter checks your writing before you submit both letters."
        taskId="A1-12.3-teil-1-informal-letter"
        taskTitle="Invite Julia to a weekend party"
        taskContext="Assess a short informal email of approximately 30 words to Julia (a friend): (1) invite her to a weekend party, (2) specify day, clock time and location, (3) ask her to bring food or drinks. Check a suitable greeting and closing, use of du/dir/dich, clarity, task coverage and basic grammar. Do not require an exact wording or a weil clause."
        letterType="informal"
        promptType="email"
        placeholder={"Liebe Julia,\n\n[Schreibe deine Einladung hier …]\n\nLiebe Grüße\n[Dein Name]"}
        minimumWords={25}
        maximumWords={40}
      />
    </div>
  </section>
);
const FormalLetterSection = () => (
  <section className="a1-day20-letter-task" style={taskCard} data-a1-letter-task="formal">
    <h2 style={{ margin: 0 }}>Teil 2 · Formal letter: Sprachakademie München</h2>
    <p style={{ margin: 0 }}>
      <strong>Aufgabe:</strong> Sie möchten im Sommer einen Deutschkurs an der Sprachschule
      „Sprachakademie München“ besuchen. Schreiben Sie eine E-Mail an die Sprachschule.
    </p>
    <strong>Schreiben Sie zu allen 3 Punkten:</strong>
    <ol style={{ margin: 0, paddingLeft: 24, lineHeight: 1.75 }}>
      <li><strong>Grund des Schreibens:</strong> Anmeldung zum Deutschkurs</li>
      <li><strong>Informationen:</strong> Kurszeiten und Kosten</li>
      <li><strong>Starttermin:</strong> Wann möchten Sie anfangen?</li>
    </ol>
    <p style={{ margin: 0 }}><em>Schreiben Sie ca. 30 Wörter. Vergessen Sie nicht die Anrede und den Gruß!</em></p>
    <div className="a1-day20-write-here" data-a1-day20-write-here="teil-2">
      <strong>Write your formal email here</strong>
      <A1CourseBookLetterPracticePanel
        title="Mark My Formal Letter"
        description="Write your email to Sprachakademie München and review the feedback before submission."
        taskId="A1-12.3-teil-2-formal-letter"
        taskTitle="Formal Deutschkurs enquiry to Sprachakademie München"
        taskContext="Assess a short formal email of approximately 30 words to Sprachakademie München. Cover three points: (1) intention to register for a summer German course, (2) ask for course times and costs, (3) state when the learner would like to begin. Check a formal greeting and sign-off, use of Sie/Ihnen, correct task coverage and clear A1 grammar. Do not require payment details or a specific month; accept any suitable summer start preference."
        letterType="formal"
        promptType="email"
        placeholder={"Sehr geehrte Damen und Herren,\n\n[Schreiben Sie Ihre E-Mail hier …]\n\nMit freundlichen Grüßen\n[Vor- und Nachname]"}
        minimumWords={25}
        maximumWords={40}
      />
    </div>
  </section>
);
export default function A1Day20LetterWritingWorkbookPage() {
  return (
    <A1TutorMarkedWorkbookShell
      fallbackAssignmentKey="A1-12.3"
      title="A1 · Day 20 Workbook · Letter Writing"
      subtitle="Kapitel 12.3 · Tutor-marked Schreiben assignment"
      assignmentIntro="Write the informal party invitation to Julia and the formal course enquiry to Sprachakademie München. Complete both tasks and submit together."
      submitTitle="Submit A1 · Day 20 · Kapitel 12.3"
      submitDescription="Submit the informal and formal email together for tutor marking."
      backLabel="Back to lesson"
      backTo={A1_DAY20_CHAPTER123_RESOURCE_HUB_ROUTE}
    >
      <Intro />
      <WorkbookSection sectionKey="teil-1">
        <InformalLetterSection />
      </WorkbookSection>
      <WorkbookSection sectionKey="teil-2">
        <FormalLetterSection />
      </WorkbookSection>
    </A1TutorMarkedWorkbookShell>
  );
}
