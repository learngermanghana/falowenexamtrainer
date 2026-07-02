import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import {
  STANDARD_WORKBOOK_TABS,
  WorkbookTabNav,
  WorkbookTaskCard,
} from "./StandardWorkbookComponents";

const DAY = 20;
const CHAPTER = "6.20";
const ASSIGNMENT_KEY = "B1-6.20";
const WORKBOOK_ID = "B1Day20WieWirdMan";

const card = { ...styles.card, display: "grid", gap: 12 };
const sectionTitle = { margin: 0, fontSize: "1.1rem" };
const listSpacing = { margin: 0, paddingLeft: 20, lineHeight: 1.7 };
const questionCardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  background: "#fff",
  display: "grid",
  gap: 6,
};
const tabImageStyle = { width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" };
const videoPreviewStyle = { width: "100%", minHeight: 315, border: 0, borderRadius: 10 };

const careerBranches = [
  {
    title: "Beliebte Berufe",
    items: ["Arzt/Ärztin", "Ingenieur/in", "Lehrer/in", "Kaufmann/Kauffrau", "Handwerker/in", "Künstler/in", "IT-Spezialist/in"],
  },
  {
    title: "Ausbildung & Studium",
    items: ["Schule und Abschluss: Welche Schulbildung braucht man?", "Universität/Fachhochschule: Muss man studieren?", "Berufsausbildung oder Lehre: Gibt es einen praktischen Weg?", "Praktische Erfahrung: Muss man ein Praktikum machen?"],
  },
  {
    title: "Wichtige Qualifikationen",
    items: ["Soft Skills: Teamarbeit, Kommunikation, Kreativität", "Hard Skills: technische Kenntnisse, Sprachkenntnisse, IT-Kenntnisse", "Zertifikate und Diplome: Welche Nachweise braucht man?"],
  },
  {
    title: "Karriereweg",
    items: ["Schulabschluss", "Ausbildung oder Studium", "Berufseinstieg", "Weiterbildung", "Karriereaufstieg"],
  },
  {
    title: "Herausforderungen und Chancen",
    items: ["lange Ausbildungszeiten", "Kosten für Studium oder Ausbildung", "finanzielle Unterstützung", "Arbeitsmarkt und offene Stellen", "Aufstiegsmöglichkeiten"],
  },
];

const lesenQuestions = [
  { stem: "Erst durch den Anruf bemerkte Susanne das Fehlen ihrer Brieftasche.", options: ["a) Richtig", "b) Falsch"] },
  { stem: "Susanne glaubte, die Brieftasche beim Bezahlen vergessen zu haben.", options: ["a) Richtig", "b) Falsch"] },
  { stem: "Der Finder hatte die Brieftasche ins Fundbüro gebracht.", options: ["a) Richtig", "b) Falsch"] },
  { stem: "Die Telefonnummer der Bank war in der Brieftasche.", options: ["a) Richtig", "b) Falsch"] },
  { stem: "In Susannes Brieftasche fehlte nichts.", options: ["a) Richtig", "b) Falsch"] },
  { stem: "Susanne konnte dem Finder persönlich für seine Ehrlichkeit danken.", options: ["a) Richtig", "b) Falsch"] },
];

const listeningQuestions = [
  "Notieren Sie Ihre Antworten während des Videos.",
  "Vergleichen Sie Ihre Antworten mit den Lösungen im YouTube-Video.",
  "Schreiben Sie für die Abgabe kurz, wie viele Aufgaben Sie richtig hatten und welche Hörstrategie Ihnen geholfen hat.",
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

const B1Day20WieWirdManWorkbookPage = () => {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({ sprechen: false, schreiben: false, lesen: false, hoeren: false });
  const setPreparedFor = (tabKey) => (event) => setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day {DAY} · Kapitel {CHAPTER}</span>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Wie wird man …? · Ausbildung und Qualifikationen</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Select Teil 1–4, Ref or Submit. Each section starts with the exact task you need to prepare or submit.
        </p>
        <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80" alt="Learners discussing career paths, education and qualifications" loading="lazy" style={tabImageStyle} />
        <WorkbookTabNav activeTab={activeTab} onChange={setActiveTab} tabs={STANDARD_WORKBOOK_TABS} ariaLabel="B1 Day 20 Wie wird man workbook sections" />
      </div>

      <A2B1WorkbookGuidance level="B1" />

      {activeTab === "sprechen" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 1 · Sprechen (Group Practice)</h2>
          <WorkbookTaskCard
            eyebrow="Question of the Day · Speaking"
            title="Welche Ausbildung und Qualifikationen sind für deinen Beruf wichtig?"
            practiceOnly
            submissionNote="Prepare a 2-minute answer for class. Teil 1 is class preparation and is not submitted."
          >
            <p style={{ margin: 0 }}>
              Diskutiere deinen Wunschberuf oder einen Beruf, den du gut kennst. Erkläre den Bildungsweg, wichtige Qualifikationen, persönliche Erfahrungen, die Situation in deinem Heimatland sowie Vor- und Nachteile. Nutze Redemittel wie <strong>Meiner Meinung nach</strong>, <strong>man braucht</strong>, <strong>einerseits … andererseits</strong> und <strong>weil/denn</strong>.
            </p>
          </WorkbookTaskCard>

          <p style={{ margin: 0, color: "#475569" }}>
            The supporting notes below are idea banks. They are not separate questions you must answer one by one.
          </p>
          <div style={{ display: "grid", gap: 10 }}>
            {careerBranches.map((branch) => (
              <div key={branch.title} style={questionCardStyle}>
                <strong>{branch.title}</strong>
                <ul style={listSpacing}>{branch.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            ))}
          </div>

          <h3 style={sectionTitle}>Suggested speaking structure</h3>
          <ol style={listSpacing}>
            <li>Begrüßung und Vorstellung des Themas: „Heute spreche ich über den Beruf …“</li>
            <li>Ausbildung und Qualifikationen: Abschluss, Studium, Ausbildung, Praktikum, Zertifikate.</li>
            <li>Persönliche Erfahrung: Warum interessiert dich dieser Beruf?</li>
            <li>Situation in deinem Heimatland: Chancen, Arbeitsmarkt, typische Wege.</li>
            <li>Vor- und Nachteile: Zeit, Kosten, Sicherheit, Karrierechancen.</li>
          </ol>

          <h3 style={sectionTitle}>Useful phrases</h3>
          <ul style={listSpacing}>
            <li>Für diesen Beruf braucht man …</li>
            <li>Man muss zuerst … machen und danach … absolvieren.</li>
            <li>Praktische Erfahrung ist wichtig, weil …</li>
            <li>In meinem Heimatland ist der Karriereweg ähnlich/anders.</li>
            <li>Einerseits dauert die Ausbildung lange, andererseits hat man gute Chancen.</li>
          </ul>

          <CourseInlinePracticePanel type="speaking" />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </section>
      )}

      {activeTab === "schreiben" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 2 · Schreiben (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Writing"
            title="Schreiben Sie Ihre Meinung: Sind Ausbildung und Qualifikationen wichtig für den Beruf?"
            submissionNote="Write about 80–100 words and submit the final text in the Submit tab."
          >
            <p style={{ margin: 0 }}>
              Situation: Felix schreibt in einem Forum über Ausbildung und Arbeit. Antworten Sie auf seinen Beitrag.
            </p>
            <p style={{ margin: 0 }}>
              <strong>Felix:</strong> „Eine gute Ausbildung hilft, einen guten Job zu finden. Ich stimme dem zu, denn mit Qualifikationen hat man bessere Chancen auf dem Arbeitsmarkt. Dennoch sind auch Erfahrung und persönliche Fähigkeiten wichtig. Ich finde, dass man immer weiterlernen sollte, um erfolgreich zu sein. Was denken Sie darüber?“
            </p>
            <ul style={listSpacing}>
              <li>Sagen Sie, ob Sie Felix zustimmen oder nicht.</li>
              <li>Begründen Sie Ihre Meinung zu Ausbildung und Qualifikationen.</li>
              <li>Vergleichen Sie Ausbildung mit praktischer Erfahrung.</li>
              <li>Nennen Sie ein Beispiel aus Ihrem Leben oder aus Ihrem Heimatland.</li>
              <li>Schreiben Sie einen klaren Schluss.</li>
            </ul>
          </WorkbookTaskCard>

          <h3 style={sectionTitle}>Writing support</h3>
          <ol style={listSpacing}>
            <li>Einleitung: „Ich möchte meine Meinung zu diesem Thema äußern.“</li>
            <li>Meinung: „Ich stimme Felix zu/nicht ganz zu, weil …“</li>
            <li>Begründung und Beispiel: Ausbildung, Erfahrung, Soft Skills, Arbeitsmarkt.</li>
            <li>Schluss: „Zusammenfassend finde ich, dass …“</li>
          </ol>
          <ul style={listSpacing}>
            <li>eine Ausbildung machen / ein Studium absolvieren / ein Praktikum machen</li>
            <li>Berufserfahrung sammeln / sich weiterbilden / Karriere machen</li>
            <li>bessere Chancen haben / auf dem Arbeitsmarkt erfolgreich sein</li>
          </ul>

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
            title="Lesen Sie den Blogeintrag und beantworten Sie 6 Richtig/Falsch-Fragen."
            submissionNote="Submit your answer letters in the Submit tab, for example: 1a, 2b, 3a ..."
          >
            <p style={{ margin: 0 }}>
              Lesen Sie den vollständigen Text. Entscheiden Sie bei jeder Aussage: a) Richtig oder b) Falsch.
            </p>
          </WorkbookTaskCard>

          <h3 style={sectionTitle}>SusannesAlltagsBlog.at</h3>
          <p style={{ margin: 0, color: "#475569" }}>Mein Alltag, meine Gedanken, mein Leben ...</p>
          <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Donnerstag, den 23. Juni</strong></p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>Was mir heute passiert ist, das glaubt mir keiner: Als ich zu Mittag nichts ahnend in der Küche beim Kochen stand, läutete mein Handy. Eine Frauenstimme erklärte mir, dass meine Brieftasche in der Bankfiliale abgegeben worden war und ich sie dort abholen könnte. Mir wurde ganz heiß – mir war noch gar nicht aufgefallen, dass sie fehlte. Und ich hatte ja auch noch relativ viel Bargeld eingesteckt!</p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>Schnell holte ich meine Handtasche hervor und suchte nach der Brieftasche. Es stimmte! Auch nach längerem Kramen in der Tasche konnte ich sie nicht finden. Mein Geld war tatsächlich verschwunden! Ich machte mich also auf den Weg zur Bank und überlegte, wo ich meine Brieftasche liegen gelassen hatte: Sicherlich im Supermarkt an der Kasse. Jedenfalls kam ich bei der Bank an und war schon gespannt darauf zu erfahren, wo meine Brieftasche gefunden worden war und natürlich, ob etwas fehlte. Die Bankangestellte teilte mir mit, dass ein junger Mann die Brieftasche abgegeben hatte.</p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>Er hatte sie auf dem Parkplatz vor dem Supermarkt gefunden und wollte sie eigentlich ins Fundbüro bringen – wie man es in so einem Fall eben macht. Der Weg dorthin war für ihn zu weit und so suchte er nach einer anderen Möglichkeit, mir die Brieftasche zurückzugeben. Das muss man sich einmal vorstellen: Er war so clever, dass er auf der Bankomatkarte nach meinem und dem Namen meiner Bank suchte ... Die Bank würde ja die Kontaktdaten zu meinem Namen haben und könnte mich so anrufen. Er fuhr in die nächste Filiale meiner Bank und dank der Computervernetzung der Filialen konnte meine Telefonnummer schnell herausgefunden werden.</p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>Da stand ich nun mit meiner Brieftasche, die mir beim Verlassen des Supermarktes aus der Handtasche gerutscht sein muss. Zum Glück war alles noch da! Ich bin sooo froh, dass diese Episode so gut ausgegangen ist.</p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>Nun weiß ich leider gar nicht, wie ich dem ehrlichen Finder danken kann. Vielleicht liest er ja diesen Blogeintrag oder es liest ihn jemand, dem er die Geschichte erzählt hat: „Vielen, vielen Dank, lieber Finder!“</p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>Bis bald,<br />eure Susanne</p>

          <h3 style={sectionTitle}>Aufgaben · Richtig oder Falsch</h3>
          <QuestionList questions={lesenQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </section>
      )}

      {activeTab === "hoeren" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 4 · Hören (Self-check + submission note)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Listening"
            title="Bearbeiten Sie den Goethe-standard Hören-Test im Video."
            submissionNote="Listen twice if possible. The answers are in the YouTube video; mark your own Hören results and paste a short self-check note in the Submit tab."
          >
            <p style={{ margin: 0 }}>
              Hören Sie auf die Hauptinformationen, Namen, Zeiten, Gründe und Entscheidungen. Notieren Sie Ihre Antworten, kontrollieren Sie sie mit dem Video und schreiben Sie danach kurz Ihr Ergebnis auf.
            </p>
          </WorkbookTaskCard>

          <iframe
            style={videoPreviewStyle}
            src="https://www.youtube.com/embed/fMCYUVNYc9U"
            title="B1 Day 20 Hören Goethe-standard test"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Please note: this is a Goethe-standard Hören test and the answers are already provided in the YouTube video. You are responsible for checking your own answers. The only parts officially evaluated by the school are Lesen and Schreiben. You must mark your own Hören results. This process requires motivation and self-discipline.
          </p>
          <div style={{ display: "grid", gap: 10 }}>
            {listeningQuestions.map((item, index) => (
              <div key={item} style={questionCardStyle}>
                <strong>{index + 1}. {item}</strong>
              </div>
            ))}
          </div>
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </section>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers
          level="B1"
          lesson={{ title: WORKBOOK_ID, level: "B1", workbookId: WORKBOOK_ID }}
          workbookId={WORKBOOK_ID}
        />
      )}

      {activeTab === "submit" && (
        <section style={card}>
          <h2 style={sectionTitle}>Submit Workbook · Day {DAY} · Kapitel {CHAPTER}</h2>
          <WorkbookTaskCard
            eyebrow="Submit"
            title="Submit Teil 2, Teil 3 and Teil 4 only. Do not submit Teil 1."
            submissionNote="Paste your final writing, reading answers and short Hören self-check into the form below."
          >
            <ul style={listSpacing}>
              <li><strong>Teil 2 Schreiben:</strong> paste your final 80–100 word opinion text.</li>
              <li><strong>Teil 3 Lesen:</strong> paste your six answer letters.</li>
              <li><strong>Teil 4 Hören:</strong> paste your self-marked result or short listening note.</li>
              <li><strong>Teil 1 Sprechen:</strong> class preparation only; do not submit it.</li>
            </ul>
          </WorkbookTaskCard>
          <div className="b1-day20-submission-page" style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}>
            <style>{`.b1-day20-submission-page > div > section:first-child { display: none !important; }.b1-day20-submission-page select { display: none !important; }`}</style>
            <AssignmentSubmissionPage
            submissionContext={{
              level: "B1",
              day: DAY,
              assignmentKey: ASSIGNMENT_KEY,
              canonicalAssignmentKey: ASSIGNMENT_KEY,
            }}
          />
          </div>
        </section>
      )}
    </div>
  );
};

export default B1Day20WieWirdManWorkbookPage;
