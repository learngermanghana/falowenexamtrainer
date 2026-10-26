import React from "react";
import { styles } from "../styles";
import { A1_DAY20_CHAPTER123_RESOURCE_HUB_ROUTE } from "../data/a1Day20LetterWritingRoutes";
import A1TutorMarkedWorkbookShell, { WorkbookSection } from "./A1TutorMarkedWorkbookShell";
import A1CourseBookLetterPracticePanel from "./A1CourseBookLetterPracticePanel";
import "./A1Day20LetterWritingWorkbookPage.css";

const card = { ...styles.card, display:"grid", gap:16, minWidth:0 };
const fields = ["Kursart", "Kursbeginn — Monat", "Kursdauer — wie viele Wochen?", "Zimmerart im Wohnheim", "Zahlungsweise"];
export default function A1Day20LetterWritingWorkbookPage() {
  return <A1TutorMarkedWorkbookShell
    fallbackAssignmentKey="A1-12.3"
    title="A1 · Day 20 Workbook · Form Filling & Email Writing"
    subtitle="Kapitel 12.3 · Tutor-marked Schreiben assignment"
    assignmentIntro="Study Grammar first. Complete five form answers in Teil 1 and one email to Julia in Teil 2. Review both parts, then submit them together."
    submitTitle="Submit A1 · Day 20 · Kapitel 12.3"
    submitDescription="Submit all five form answers and your email to Julia together for tutor marking."
    backLabel="Back to lesson" backTo={A1_DAY20_CHAPTER123_RESOURCE_HUB_ROUTE}>
    <section style={card} data-a1-day20-chapter123-workbook-overview="true">
      <h2>How this workbook is organised</h2>
      <p>Teil 1: five short form answers (5 raw points). Teil 2: one informal email of approximately 30 words (10 raw points). The timed assignment lasts 20 minutes. Suggested pacing: 5 minutes for the form and 15 minutes for the email.</p>
      <p>Use Grammar, Overview, Teil 1, Teil 2 and Review &amp; Submit. Your answers save into the assignment draft. Write independently during the timed attempt.</p>
    </section>
    <WorkbookSection sectionKey="teil-1">
      <section style={card} data-a1-form-task="maria">
        <h2>Teil 1 · Formular ausfüllen · 5 Punkte</h2>
        <p>Ihre Freundin Maria Rossi kommt aus Rom und möchte in München Deutsch lernen. Sie besucht einen Intensivkurs an der Sprachschule Aktiv. Der Kurs beginnt im August und dauert vier Wochen. Maria möchte ein Einzelzimmer im Wohnheim. Sie bezahlt mit Kreditkarte.</p>
        <p>Helfen Sie Maria. Schreiben Sie die fünf fehlenden Informationen in das Formular. Schreiben Sie keine ganzen Sätze.</p>
        <h3>Anmeldung — Sprachschule Aktiv München</h3>
        <p>Familienname: Rossi · Vorname: Maria · Wohnort: Rom</p>
        <ol>{fields.map(field => <li key={field} style={{padding:"9px 0"}}><strong>{field}</strong>: ____________________</li>)}</ol>
        <p>Enter answers 1–5 in the saved answer fields below. Match each answer to its numbered field.</p>
      </section>
    </WorkbookSection>
    <WorkbookSection sectionKey="teil-2">
      <section style={card} data-a1-letter-task="informal">
        <h2>Teil 2 · E-Mail an Julia · 10 Punkte</h2>
        <p>Sie feiern am Wochenende eine Party bei Ihnen zu Hause. Sie möchten Ihre Freundin Julia einladen. Schreiben Sie Julia eine E-Mail.</p>
        <p>Schreiben Sie etwas zu allen drei Punkten:</p>
        <ul><li><strong>Einladung:</strong> Laden Sie Julia zu Ihrer Party ein.</li><li><strong>Termin und Ort:</strong> An welchem Tag, um wie viel Uhr und an welcher Adresse findet die Party statt?</li><li><strong>Mitbringen:</strong> Bitten Sie Julia, etwas zu essen oder zu trinken mitzubringen.</li></ul>
        <p>Schreiben Sie circa 30 Wörter. Schreiben Sie auch eine passende Anrede und einen Gruß. Benutzen Sie die du-Form.</p>
        <div className="a1-day20-write-here" data-a1-day20-write-here="teil-2">
          <strong>Write Teil 2 here</strong>
          <A1CourseBookLetterPracticePanel title="Mark My Email to Julia"
            description="Write your invitation here. Draft feedback is available outside the timed attempt. Your latest email is saved with this assignment."
            taskId="A1-12.3-teil-2-julia-invitation" taskTitle="Invite Julia to a weekend party"
            taskContext="Write an informal email of approximately 30 words to Julia. Cover exactly three content points: invite her to your party; give the day, time and home address; ask her to bring food or drinks. Use du, a suitable greeting, closing and your name. Assess each content point for understandable completion; do not treat greeting and closing as extra content points."
            letterType="informal" promptType="email" placeholder="Write your own email to Julia…" minimumWords={25} maximumWords={40} />
        </div>
        <p>Before submitting: check all three points, your greeting, closing and name. Approximately 30 words is a target, not an exact word limit.</p>
      </section>
    </WorkbookSection>
  </A1TutorMarkedWorkbookShell>;
}
