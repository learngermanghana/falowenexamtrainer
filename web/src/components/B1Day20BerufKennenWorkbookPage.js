import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import {
  STANDARD_WORKBOOK_TABS,
  WorkbookTabNav,
  WorkbookTaskCard,
} from "./StandardWorkbookComponents";
import { styles } from "../styles";

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionTitle = {
  margin: 0,
  fontSize: "1.1rem",
};

const listSpacing = {
  margin: 0,
  paddingLeft: 20,
  lineHeight: 1.7,
};

const questionCardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  background: "#fff",
  display: "grid",
  gap: 7,
  lineHeight: 1.7,
};

const tabImageStyle = {
  width: "100%",
  borderRadius: 10,
  maxHeight: 260,
  objectFit: "cover",
};

const videoStyle = {
  width: "100%",
  minHeight: 315,
  border: 0,
  borderRadius: 10,
};

const professionGroups = [
  {
    title: "1️⃣ Beliebte Berufe (Popular Professions)",
    items: [
      "Arzt/Ärztin (Doctor)",
      "Ingenieur/in (Engineer)",
      "Lehrer/in (Teacher)",
      "Kaufmann/Kauffrau (Businessperson)",
      "Handwerker/in (Craftsperson)",
      "Künstler/in (Artist)",
      "IT-Spezialist/in (IT Specialist)",
    ],
  },
  {
    title: "2️⃣ Ausbildung & Studium (Education & Studies)",
    items: [
      "Schule und Abschluss – Welche Schulbildung braucht man?",
      "Universität/Fachhochschule – Muss man studieren?",
      "Berufsausbildung – Gibt es eine Ausbildung oder Lehre?",
      "Praktische Erfahrung – Muss man ein Praktikum machen?",
    ],
  },
  {
    title: "3️⃣ Wichtige Qualifikationen (Important Qualifications)",
    items: [
      "Soft Skills – Teamarbeit, Kommunikation und Kreativität",
      "Hard Skills – technische Kenntnisse, Sprachkenntnisse und IT-Kenntnisse",
      "Zertifikate und Diplome – Welche Nachweise braucht man?",
    ],
  },
  {
    title: "5️⃣ Herausforderungen und Chancen (Challenges & Opportunities)",
    items: [
      "Lange Ausbildungszeiten – Manche Berufe erfordern viele Jahre Studium.",
      "Kosten für Studium oder Ausbildung – Gibt es finanzielle Unterstützung?",
      "Arbeitsmarkt – Gibt es viele offene Stellen in diesem Bereich?",
      "Aufstiegsmöglichkeiten – Kann man in diesem Beruf Karriere machen?",
    ],
  },
];

const readingQuestions = [
  {
    stem: "Erst durch den Anruf bemerkte Susanne das Fehlen ihrer Brieftasche.",
    options: ["A) Richtig", "B) Falsch"],
  },
  {
    stem: "Susanne glaubte, die Brieftasche beim Bezahlen vergessen zu haben.",
    options: ["A) Richtig", "B) Falsch"],
  },
  {
    stem: "Der Finder hatte die Brieftasche ins Fundbüro gebracht.",
    options: ["A) Richtig", "B) Falsch"],
  },
  {
    stem: "Die Telefonnummer der Bank war in der Brieftasche.",
    options: ["A) Richtig", "B) Falsch"],
  },
  {
    stem: "In Susannes Brieftasche fehlte nichts.",
    options: ["A) Richtig", "B) Falsch"],
  },
  {
    stem: "Susanne konnte dem Finder persönlich für seine Ehrlichkeit danken.",
    options: ["A) Richtig", "B) Falsch"],
  },
];

const PreparedCheckbox = ({ checked, onChange }) => (
  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    I prepared this part.
  </label>
);

const QuestionList = ({ questions }) => (
  <div style={{ display: "grid", gap: 10 }}>
    {questions.map((question, index) => (
      <div key={question.stem} style={questionCardStyle}>
        <strong>{index + 1}. {question.stem}</strong>
        {question.options.map((option) => <span key={option}>{option}</span>)}
      </div>
    ))}
  </div>
);

export default function B1Day20BerufKennenWorkbookPage() {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({
    sprechen: false,
    schreiben: false,
    lesen: false,
    hoeren: false,
  });

  const setPreparedFor = (tabKey) => (event) =>
    setPrepared((previous) => ({ ...previous, [tabKey]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 20 · Kapitel 6.20</span>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>B1 Workbook · Wie wird man …?</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Select Teil 1–4 below. The highlighted card at the top of each section tells you exactly what to prepare, answer or submit.
        </p>
        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80"
          alt="Learners discussing professions, education and career paths"
          loading="lazy"
          style={tabImageStyle}
        />
        <WorkbookTabNav
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={STANDARD_WORKBOOK_TABS}
          ariaLabel="B1 Day 20 Wie wird man workbook sections"
        />
      </div>

      <A2B1WorkbookGuidance level="B1" />

      {activeTab === "sprechen" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 1 · Beruf kennen (Group Practice)</h2>
          <WorkbookTaskCard
            eyebrow="Question of the Day · Speaking"
            title="Welche Ausbildung und Qualifikationen sind für deinen Beruf wichtig?"
            practiceOnly
            submissionNote="Prepare a clear 90–120 second answer for class. Teil 1 is group practice and is not submitted."
          >
            <p style={{ margin: 0 }}>
              Wähle einen Beruf, erkläre den Ausbildungsweg, nenne wichtige Qualifikationen und beschreibe persönliche Erfahrungen sowie die Situation in deinem Heimatland.
            </p>
          </WorkbookTaskCard>

          <div style={questionCardStyle}>
            <strong>📝 Zentrales Thema: Wie wird man ...?</strong>
            <span>(How to Become ...?)</span>
            <p style={{ margin: 0 }}>
              In this chapter, we will engage in group discussions about the topics below. After the discussion, use the main question and speaking structure to prepare your answer.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
            {professionGroups.map((group) => (
              <article key={group.title} style={questionCardStyle}>
                <strong>{group.title}</strong>
                <ul style={listSpacing}>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>

          <div style={questionCardStyle}>
            <strong>4️⃣ Karriereweg (Career Path)</strong>
            <p style={{ margin: 0 }}>
              Schulabschluss → Ausbildung/Studium → Berufseinstieg → Weiterbildung → Karriereaufstieg
            </p>
          </div>

          <div style={{ ...questionCardStyle, background: "#eff6ff", borderColor: "#bfdbfe" }}>
            <strong>Beispiel: Wie wird man Arzt oder Ärztin?</strong>
            <ol style={listSpacing}>
              <li>Abitur machen</li>
              <li>Medizinstudium absolvieren</li>
              <li>Staatsexamen bestehen</li>
              <li>Facharztausbildung machen</li>
              <li>Berufserfahrung sammeln</li>
            </ol>
          </div>

          <div style={questionCardStyle}>
            <strong>6️⃣ Fragen zum Nachdenken (Discussion Questions)</strong>
            <ul style={listSpacing}>
              <li>Welcher Beruf interessiert dich und warum?</li>
              <li>Welche Ausbildung oder Qualifikationen brauchst du für deinen Traumberuf?</li>
              <li>Was ist wichtiger: Erfahrung oder Ausbildung?</li>
              <li>Glaubst du, dass lebenslanges Lernen wichtig ist?</li>
            </ul>
          </div>

          <div style={{ ...questionCardStyle, background: "#f0fdf4", borderColor: "#bbf7d0" }}>
            <strong>Hauptfrage</strong>
            <p style={{ margin: 0 }}>
              Welche Ausbildung und Qualifikationen sind für deinen Beruf wichtig?
            </p>
          </div>

          <h3 style={sectionTitle}>Nutze diese Struktur</h3>
          <ol style={listSpacing}>
            <li><strong>Begrüßung und Vorstellung des Themas</strong></li>
            <li><strong>Inhalt und Struktur</strong> – Beruf, Ausbildung, Qualifikationen und Karriereweg erklären</li>
            <li><strong>Persönliche Erfahrung</strong> – eigenes Beispiel oder eigene Ziele nennen</li>
            <li><strong>Situation in deinem Heimatland</strong> – Ausbildung und Arbeitsmarkt vergleichen</li>
          </ol>

          <div style={questionCardStyle}>
            <strong>Useful phrases</strong>
            <ul style={listSpacing}>
              <li>Heute spreche ich darüber, wie man … wird.</li>
              <li>Für diesen Beruf braucht man …</li>
              <li>Zuerst muss man …, danach kann man …</li>
              <li>Wichtige Qualifikationen sind …</li>
              <li>Persönlich habe ich die Erfahrung gemacht, dass …</li>
              <li>In meinem Heimatland ist der Ausbildungsweg ähnlich/anders, weil …</li>
            </ul>
          </div>

          <CourseInlinePracticePanel type="speaking" />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </section>
      )}

      {activeTab === "schreiben" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 2 · Schreiben (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Writing"
            title="Sind Ausbildung und Qualifikationen wichtig für den Beruf?"
            submissionNote="Write approximately 80–100 words and submit the finished text through the Submit tab."
          >
            <p style={{ margin: 0 }}>
              Reagieren Sie auf Felix' Meinung. Sagen Sie, ob Sie zustimmen, vergleichen Sie Ausbildung mit Erfahrung und nennen Sie ein Beispiel.
            </p>
          </WorkbookTaskCard>

          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Student writing about education and qualifications"
            loading="lazy"
            style={tabImageStyle}
          />

          <div style={questionCardStyle}>
            <strong>Beitrag von Felix</strong>
            <p style={{ margin: 0 }}>
              Eine gute Ausbildung hilft, einen guten Job zu finden. Mit Qualifikationen hat man bessere Chancen auf dem Arbeitsmarkt. Dennoch sind auch Erfahrung und persönliche Fähigkeiten wichtig. Ich finde, dass man immer weiterlernen sollte, um erfolgreich zu sein. Was denken Sie darüber?
            </p>
          </div>

          <div style={questionCardStyle}>
            <strong>Beantworten Sie diese Inhaltspunkte</strong>
            <ul style={listSpacing}>
              <li>Stimmen Sie Felix zu oder nicht?</li>
              <li>Warum sind Ausbildung und Qualifikationen wichtig oder nicht wichtig?</li>
              <li>Was ist wichtiger: Ausbildung oder praktische Erfahrung?</li>
              <li>Nennen Sie ein Beispiel aus Ihrem Leben oder Heimatland.</li>
              <li>Formulieren Sie einen klaren Schluss.</li>
            </ul>
          </div>

          <CourseInlinePracticePanel type="writing" />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </section>
      )}

      {activeTab === "lesen" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 3 · Lesen (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Reading"
            title="Lesen Sie den Blogeintrag und beantworten Sie alle sechs Richtig/Falsch-Fragen."
            submissionNote="Submit only the answer letters in this format: 1A, 2B, 3A …"
          >
            <p style={{ margin: 0 }}>
              Lesen Sie zuerst den vollständigen Text. Entscheiden Sie danach bei jeder Aussage: A) Richtig oder B) Falsch.
            </p>
          </WorkbookTaskCard>

          <img
            src="https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1600&q=80"
            alt="Reading a blog entry for B1 comprehension"
            loading="lazy"
            style={tabImageStyle}
          />

          <article style={questionCardStyle}>
            <h3 style={{ margin: 0 }}>SusannesAlltagsBlog.at</h3>
            <p style={{ margin: 0, color: "#475569" }}>Mein Alltag, meine Gedanken, mein Leben ... · Donnerstag, den 23. Juni</p>
            <p style={{ margin: 0 }}>
              Als Susanne beim Kochen war, rief eine Mitarbeiterin ihrer Bank an. Eine Brieftasche war in der Bankfiliale abgegeben worden. Susanne hatte noch gar nicht bemerkt, dass sie fehlte.
            </p>
            <p style={{ margin: 0 }}>
              Ein junger Mann hatte die Brieftasche auf dem Parkplatz vor dem Supermarkt gefunden. Er wollte sie zuerst ins Fundbüro bringen, aber der Weg war zu weit. Auf der Bankomatkarte fand er Susannes Namen und ihre Bank.
            </p>
            <p style={{ margin: 0 }}>
              Die Bank konnte Susannes Telefonnummer herausfinden. Zum Glück war alles noch in der Brieftasche. Susanne kennt den Finder nicht und kann ihm deshalb nicht persönlich danken.
            </p>
          </article>

          <h3 style={sectionTitle}>Questions</h3>
          <QuestionList questions={readingQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </section>
      )}

      {activeTab === "hoeren" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 4 · Hören (Self-check)</h2>
          <WorkbookTaskCard
            eyebrow="Independent practice · Listening"
            title="Bearbeiten Sie den Goethe-standard Hören-Test und kontrollieren Sie Ihre Antworten selbst."
            practiceOnly
            submissionNote="Teil 4 is self-check practice. Do not submit your Hören answers."
          >
            <p style={{ margin: 0 }}>
              Lesen Sie zuerst die Aufgaben im Video, hören Sie aufmerksam zu und vergleichen Sie Ihre Lösungen danach mit den Antworten im Video.
            </p>
          </WorkbookTaskCard>

          <img
            src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80"
            alt="Headphones for German listening practice"
            loading="lazy"
            style={tabImageStyle}
          />

          <iframe
            style={videoStyle}
            src="https://www.youtube-nocookie.com/embed/fMCYUVNYc9U?rel=0&playsinline=1"
            title="B1 Day 20 Hören"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          <div style={questionCardStyle}>
            <strong>Self-check instructions</strong>
            <ol style={listSpacing}>
              <li>Lesen Sie zuerst alle Aufgaben.</li>
              <li>Hören Sie aufmerksam zu.</li>
              <li>Bearbeiten Sie schwierige Teile ein zweites Mal.</li>
              <li>Vergleichen Sie Ihre Antworten mit den Lösungen im Video.</li>
            </ol>
          </div>

          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </section>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers
          level="B1"
          lesson={{ title: "B1Day20BerufKennen", level: "B1", day: 20, workbookId: "B1Day20BerufKennen" }}
          workbookId="B1Day20BerufKennen"
        />
      )}

      {activeTab === "submit" && (
        <section style={card}>
          <h2 style={sectionTitle}>Submit workbook answers</h2>
          <WorkbookTaskCard
            eyebrow="Final step"
            title="Submit Teil 2 and Teil 3."
            submissionNote="Do not submit Teil 1 or Teil 4."
          >
            <p style={{ margin: 0 }}>
              Paste your final 80–100 word opinion text and your six reading answer letters into the form below.
            </p>
          </WorkbookTaskCard>
          <div className="b1-day20-submission-page" style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}>
            <style>{`.b1-day20-submission-page > div > section:first-child { display: none !important; }
            .b1-day20-submission-page select { display: none !important; }`}</style>
            <AssignmentSubmissionPage
              submissionContext={{
                level: "B1",
                day: 20,
                assignmentKey: "B1-6.20",
                canonicalAssignmentKey: "B1-6.20",
              }}
            />
          </div>
        </section>
      )}
    </div>
  );
}
