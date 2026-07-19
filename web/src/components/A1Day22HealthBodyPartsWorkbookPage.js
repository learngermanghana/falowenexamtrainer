import React from "react";
import A1TutorMarkedWorkbookShell, { WorkbookSection } from "./A1TutorMarkedWorkbookShell";
import A1CourseBookLetterPracticePanel from "./A1CourseBookLetterPracticePanel";
import { styles } from "../styles";

const DAY22_ASSIGNMENT_KEY = "A1-14.1";

const sectionStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const imageStyle = {
  width: "100%",
  borderRadius: 12,
  maxHeight: 320,
  objectFit: "cover",
};

const infoBoxStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 14,
  background: "#f9fafb",
  display: "grid",
  gap: 8,
};

const questionBoxStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 14,
  background: "#fff",
  display: "grid",
  gap: 8,
};

const teil1Questions = [
  {
    title: "Frage 1",
    prompt: "Sie brauchen einen Arzttermin für eine Untersuchung.",
    adA: [
      "Allgemeinarzt Dr. Müller",
      "Öffnungszeiten:",
      "• Montag - Freitag: 8:00 - 16:00 Uhr",
      "• Samstag: 9:00 - 12:00 Uhr",
      "Adresse: Musterstraße 10, 12345 Berlin",
    ],
    adB: [
      "Hausarzt Dr. Schmidt",
      "Öffnungszeiten:",
      "• Montag - Freitag: 9:00 - 18:00 Uhr",
      "• Samstag: 10:00 - 14:00 Uhr",
      "Adresse: Beispielstraße 20, 67890 München",
    ],
  },
  {
    title: "Frage 2",
    prompt:
      "Sie brauchen einen Termin für Physiotherapie. Sie arbeiten von Montag bis Freitag und haben am Wochenende nur mittags Zeit.",
    adA: [
      "Physiotherapiezentrum GesundFit",
      "Öffnungszeiten:",
      "• Montag - Freitag: 7:00 - 19:00 Uhr",
      "• Samstag: 8:00 - 9:00 Uhr",
      "Adresse: Hauptstraße 50, 12345 Berlin",
    ],
    adB: [
      "Physiotherapie Gesundheit",
      "Öffnungszeiten:",
      "• Montag - Freitag: 8:00 - 17:00 Uhr",
      "• Samstag: 9:00 - 13:00 Uhr",
      "Adresse: Nebenstraße 30, 67890 München",
    ],
  },
  {
    title: "Frage 3",
    prompt: "Sie brauchen eine Apotheke, die um zehn Minuten vor halb neun geöffnet ist.",
    adA: [
      "Apotheke am Markt",
      "Öffnungszeiten:",
      "• Montag - Freitag: 10:00 - 14:00 Uhr",
      "• Samstag: 8:00 - 8:10 Uhr",
      "• Sonntag: geschlossen",
      "Adresse: Marktstraße 15, 12345 Berlin",
    ],
    adB: [
      "City Apotheke",
      "Öffnungszeiten:",
      "• Montag - Freitag: 6:10 - 7:30 Uhr",
      "• Samstag: 8:00 - 8:45 Uhr",
      "• Sonntag: geschlossen",
      "Adresse: Hauptplatz 1, 67890 München",
    ],
  },
  {
    title: "Frage 4",
    prompt: "Sie brauchen einen Termin beim Zahnarzt in der Hauptstadt Deutschlands.",
    adA: [
      "Zahnarztpraxis Dr. Lenz",
      "Öffnungszeiten:",
      "• Montag - Freitag: 7:30 - 16:00 Uhr",
      "• Samstag: nach Vereinbarung",
      "Adresse: Bahnhofstraße 25, 12345 Berlin",
    ],
    adB: [
      "Zahnarzt Dr. Klein",
      "Öffnungszeiten:",
      "• Montag - Freitag: 8:00 - 17:00 Uhr",
      "• Samstag: geschlossen",
      "Adresse: Gartenstraße 8, 67890 München",
    ],
  },
  {
    title: "Frage 5",
    prompt: "Sie brauchen Informationen über eine Grippeimpfung. Sie möchten dort am Nachmittag vorbeikommen.",
    adA: [
      "Impfzentrum Berlin",
      "Öffnungszeiten:",
      "• Montag - Freitag: 9:00 - 18:00 Uhr",
      "• Samstag: 10:00 - 13:00 Uhr",
      "Adresse: Ringstraße 30, 12345 Berlin",
    ],
    adB: [
      "Impfzentrum München",
      "Öffnungszeiten:",
      "• Montag - Freitag: 8:00 - 13:00 Uhr",
      "• Samstag: 9:00 - 12:00 Uhr",
      "Adresse: Hauptstraße 20, 67890 München",
    ],
  },
];

const vocabItems = [
  "a. Head – ___________",
  "b. Arm – ___________",
  "c. Leg – ___________",
  "d. Eye – ___________",
  "e. Nose – ___________",
  "f. Ear – ___________",
  "g. Mouth – ___________",
  "h. Hand – ___________",
  "i. Foot – ___________",
  "j. Stomach / Belly – ___________",
];

const HealthOverview = () => (
  <section style={sectionStyle} data-a1-day22-health-overview="true">
    <h2 style={{ margin: 0 }}>A1 Day 22 · Kapitel 14.1 Assignment Overview</h2>
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      Complete Teil 1, write the Teil 2 E-Mail, check it with Mark My Letter, finish Teil 3 vocabulary, then open Submit.
    </p>
  </section>
);

const Teil1Content = () => (
      <section style={sectionStyle} data-a1-day22-health-teil="1">
        <img
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80"
          alt="Doctor speaking with a patient in a clinic about health and appointments"
          loading="lazy"
          style={imageStyle}
        />

        <h2 style={{ margin: 0 }}>Teil 1 · Lesen: Anzeigen und Termine</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Aufgabe:</strong> Read each advertisement pair and choose the correct option.
        </p>

        {teil1Questions.map((question) => (
          <div key={question.title} style={questionBoxStyle}>
            <strong style={{ lineHeight: 1.6 }}>{question.title}:</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>{question.prompt}</p>

            <div style={infoBoxStyle}>
              <strong>Anzeige A</strong>
              {question.adA.map((line) => (
                <span key={`${question.title}-a-${line}`}>{line}</span>
              ))}
            </div>

            <div style={infoBoxStyle}>
              <strong>Anzeige B</strong>
              {question.adB.map((line) => (
                <span key={`${question.title}-b-${line}`}>{line}</span>
              ))}
            </div>

            <p style={{ margin: 0 }}>
              <strong>Welche Anzeige ist richtig?</strong>
            </p>
            <span>1. Anzeige A</span>
            <span>2. Anzeige B</span>
          </div>
        ))}
      </section>
);

const Teil2Content = () => (
      <section style={sectionStyle} data-a1-day22-health-teil="2">
        <h2 style={{ margin: 0 }}>Teil 2 · Schreiben: E-Mail an Felix</h2>

        <div style={infoBoxStyle}>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Schreiben Sie eine E-Mail an Felix. Sie hat Sie zum Geburtstag eingeladen, aber Sie können nicht teilnehmen.
          </p>

          <p style={{ margin: 0 }}><strong>Punkte:</strong></p>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
            <li>Warum schreiben Sie?</li>
            <li>Was ist der Grund? (Use a health-related reason connected to class content.)</li>
            <li>Fragen Sie nach einem anderen Termin.</li>
          </ul>
        </div>

        <div style={infoBoxStyle}>
          <p style={{ margin: 0 }}><strong>Structure / Aufbau</strong></p>
          <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
            <li>Begrüßung / Greeting</li>
            <li>Einleitung / Introduction</li>
            <li>Hauptteil / Main Part (2–3 Sätze / Sentences)</li>
            <li>Schluss und Abschied / Conclusion &amp; Final Greeting</li>
          </ol>
        </div>

        <A1CourseBookLetterPracticePanel
          title="Mark My Health Letter"
          description="Write or paste your E-Mail to Felix here. Falowen will mark it and explain the corrections before you copy the improved version to Submit."
          taskId="A1-14.1-teil-2-health-letter"
          taskTitle="Health reason email to Felix"
          taskContext="email to Felix declining a birthday invitation with a health reason and asking for another appointment"
          letterType="informal"
          promptType="email"
          placeholder={"Lieber Felix,\n\nich schreibe dir, weil ...\n\nLiebe Grüße\n..."}
          minimumWords={35}
          maximumWords={50}
          assignmentKey={DAY22_ASSIGNMENT_KEY}
          workbookId="A1-14.1-health-body-parts-workbook"
          day={22}
          chapter="14.1"
          lessonId="A1-day-22-chapter-14.1"
        />
      </section>
);

const Teil3Content = () => (
      <section style={sectionStyle} data-a1-day22-health-teil="3">
        <h2 style={{ margin: 0 }}>Teil 3 · Wortschatz: Translate into German</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Write the correct German word for each body part below.
        </p>
        <div style={questionBoxStyle}>
          {vocabItems.map((item) => (
            <span key={item} style={{ lineHeight: 1.7 }}>
              {item}
            </span>
          ))}
        </div>
      </section>
);

const A1Day22HealthBodyPartsWorkbookPage = () => (
  <A1TutorMarkedWorkbookShell
    fallbackAssignmentKey={DAY22_ASSIGNMENT_KEY}
    title="A1 · Day 22 Workbook · Health and Body Parts"
    subtitle="Kapitel 14.1 · Tutor-marked Lesen & Schreiben assignment"
    assignmentIntro="Use Overview, complete Teil 1, Teil 2 and Teil 3 separately, check your writing with Mark My Letter, then open Submit and send your final answers to your tutor."
    submitTitle="Submit A1 · Day 22 · Kapitel 14.1"
    submitDescription="This submission is locked to A1-14.1. Submit your reading answers, final writing task and vocabulary answers for tutor marking."
  >
    <HealthOverview />
    <WorkbookSection sectionKey="teil-1"><Teil1Content /></WorkbookSection>
    <WorkbookSection sectionKey="teil-2"><Teil2Content /></WorkbookSection>
    <WorkbookSection sectionKey="teil-3"><Teil3Content /></WorkbookSection>
  </A1TutorMarkedWorkbookShell>
);

export default A1Day22HealthBodyPartsWorkbookPage;
