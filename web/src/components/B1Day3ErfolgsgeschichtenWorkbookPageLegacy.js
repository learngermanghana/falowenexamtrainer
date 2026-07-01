import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import { styles } from "../styles";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import {
  STANDARD_WORKBOOK_TABS,
  WorkbookTabNav,
  WorkbookTaskCard,
} from "./StandardWorkbookComponents";

const card = { ...styles.card, display: "grid", gap: 12 };
const sectionTitle = { margin: 0, fontSize: "1.1rem" };
const listSpacing = { margin: 0, paddingLeft: 20, lineHeight: 1.7 };
const questionCardStyle = { border: "1px solid #e5e7eb", borderRadius: 10, padding: 12, background: "#fff", display: "grid", gap: 6 };
const tabImageStyle = { width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" };

const speakingBranches = [
  { title: "Beruflicher Erfolg", items: ["Karriereaufstieg", "Unternehmensgründung", "Weiterbildung", "Traumjob finden", "Erfolgreiche Projekte", "Teamarbeit"] },
  { title: "Persönlicher Erfolg", items: ["Sportliche Erfolge", "Sprachen lernen", "Gesunde Lebensweise", "Familie und Beziehungen", "Kulturelle Erlebnisse"] },
  { title: "Hindernisse und Herausforderungen", items: ["Misserfolge überwinden", "Zeitmanagement", "Motivation finden", "Finanzielle Schwierigkeiten", "Stressbewältigung", "Work-Life-Balance"] },
  { title: "Erfolgsstrategien", items: ["Ziele setzen", "Selbstdisziplin entwickeln", "Unterstützung suchen", "Weiterbildung machen", "Networking", "Positiv denken"] },
  { title: "Inspiration und Vorbilder", items: ["Bekannte Persönlichkeiten", "Familienmitglieder", "Kollegen und Freunde", "Bücher und Filme", "Mentoren"] },
];

const lesenQuestions = [
  { stem: "Wer wird im Text als stiller Held beschrieben?", options: ["a) Die Krankenschwester", "b) Der Arzt", "c) Der Polizist", "d) Der Lehrer"] },
  { stem: "Warum wird der alleinerziehende Vater als Held betrachtet?", options: ["a) Weil er berühmt ist", "b) Weil er für seine Kinder kämpft", "c) Weil er viel Geld verdient", "d) Weil er aufgibt"] },
  { stem: "Welche Eigenschaft wird bei den Freiwilligen besonders hervorgehoben?", options: ["a) Ihr Reichtum", "b) Ihr Mut", "c) Ihr Einsatz für andere", "d) Ihre Berühmtheit"] },
  { stem: "Wie unterscheiden sich die stillen Helden von den Helden in Filmen oder Büchern?", options: ["a) Sie sind weniger stark", "b) Sie sind nicht berühmt", "c) Sie sind egoistisch", "d) Sie sind reicher"] },
  { stem: "Was zeigen die stillen Helden jeden Tag?", options: ["a) Dass sie berühmt sind", "b) Dass Mut in kleinen Taten liegt", "c) Dass sie stark sind", "d) Dass sie großartige Taten vollbringen"] },
  { stem: "Wer wird im Text als Beispiel für einen Helden im Alltag genannt?", options: ["a) Ein Pilot", "b) Ein alleinerziehender Vater", "c) Ein Superheld", "d) Ein Schriftsteller"] },
  { stem: "Was ist die Hauptaussage des Textes?", options: ["a) Helden gibt es nur in Filmen", "b) Wahre Helden sind diejenigen, die im Alltag still wirken", "c) Nur berühmte Menschen sind Helden", "d) Helden sind immer reich und berühmt"] },
];

const hoerenQuestions = [
  { stem: "Was macht Herr Müller jeden Morgen um fünf Uhr?", options: ["a) Er geht zur Schule", "b) Er beginnt seine Arbeit als Hausmeister", "c) Er bringt die Schüler zur Schule", "d) Er repariert die Heizung"] },
  { stem: "Warum ist Herr Müllers Arbeit wichtig?", options: ["a) Weil sie im Vordergrund steht", "b) Weil sie den Schultag reibungslos macht", "c) Weil er dafür viel Lob bekommt", "d) Weil er berühmt ist"] },
  { stem: "Was passiert an einem kalten Wintermorgen?", options: ["a) Die Schule ist geschlossen", "b) Herr Müller bleibt zu Hause", "c) Die Heizung fällt aus", "d) Die Schüler kommen zu spät"] },
  { stem: "Wie reagiert Herr Müller, als er die defekte Heizung entdeckt?", options: ["a) Er geht nach Hause", "b) Er ignoriert das Problem", "c) Er behebt das Problem sofort", "d) Er ruft die Polizei"] },
  { stem: "Wie fühlt sich Herr Müller am Ende des Tages?", options: ["a) Erschöpft aber zufrieden", "b) Frustriert und müde", "c) Glücklich und ausgeruht", "d) Ärgerlich und enttäuscht"] },
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

const B1Day3ErfolgsgeschichtenWorkbookPage = () => {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({ sprechen: false, schreiben: false, lesen: false, hoeren: false });
  const setPreparedFor = (tabKey) => (event) => setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 3 · Kapitel 1.3</span>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Erfolgsgeschichten – Workbook</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Select Teil 1–4 below. Each section begins with the exact question or assignment you must complete.
        </p>
        <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80" alt="People discussing goals and success stories" loading="lazy" style={tabImageStyle} />
        <WorkbookTabNav activeTab={activeTab} onChange={setActiveTab} tabs={STANDARD_WORKBOOK_TABS} ariaLabel="B1 Day 3 workbook sections" />
      </div>

      <A2B1WorkbookGuidance level="B1" />

      {activeTab === "sprechen" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 1 · Sprechen (Group Practice)</h2>
          <WorkbookTaskCard
            eyebrow="Question of the Day · Speaking"
            title="Was ist für dich eine Erfolgsgeschichte?"
            practiceOnly
            submissionNote="Prepare a 60–90 second answer for class. Teil 1 is not submitted."
          >
            <p style={{ margin: 0 }}>
              Erkläre, was Erfolg für dich bedeutet, nenne eine konkrete Erfolgsgeschichte und beschreibe mindestens eine Herausforderung und eine Erfolgsstrategie.
            </p>
          </WorkbookTaskCard>
          <p style={{ margin: 0, color: "#475569" }}>The idea cards below support your answer. You do not need to answer every item separately.</p>
          <div style={{ display: "grid", gap: 10 }}>
            {speakingBranches.map((branch) => (
              <div key={branch.title} style={questionCardStyle}>
                <strong>{branch.title}</strong>
                <ul style={listSpacing}>{branch.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            ))}
          </div>
          <h3 style={sectionTitle}>Suggested answer structure</h3>
          <ol style={listSpacing}>
            <li>Definiere Erfolg mit deinen eigenen Worten.</li>
            <li>Nenne eine Person oder Situation als Beispiel.</li>
            <li>Beschreibe eine Herausforderung.</li>
            <li>Erkläre, welche Strategie zum Erfolg geführt hat.</li>
            <li>Formuliere deine persönliche Meinung.</li>
          </ol>
          <CourseInlinePracticePanel type="speaking" />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </section>
      )}

      {activeTab === "schreiben" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 2 · Schreiben (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Writing"
            title="Schreiben Sie an Ihre Sprachkursleiterin Frau Wolmer."
            submissionNote="Write approximately 40 words and submit the finished email through the Submit tab."
          >
            <p style={{ margin: 0 }}>
              Frau Wolmer hat die Gruppe gebeten, eine Präsentation über Erfolgsgeschichten vorzubereiten. Sie können leider nicht teilnehmen.
            </p>
            <ul style={listSpacing}>
              <li>Entschuldigen Sie sich höflich.</li>
              <li>Erklären Sie, warum Sie nicht teilnehmen können.</li>
              <li>Vergessen Sie Anrede und Gruß nicht.</li>
            </ul>
          </WorkbookTaskCard>
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
            title="Lesen Sie den Text und beantworten Sie alle sieben Fragen."
            submissionNote="Submit only the answer letters in this format: 1A, 2B, 3C ..."
          >
            <p style={{ margin: 0 }}>Read the complete text first. Then choose one answer, A–D, for every question.</p>
          </WorkbookTaskCard>
          <h3 style={sectionTitle}>Helden des Alltags: Wer sind sie wirklich?</h3>
          {[
            "Im Alltag begegnen uns viele Menschen, die auf den ersten Blick gewöhnlich erscheinen. Doch wenn wir genauer hinsehen, erkennen wir, dass viele von ihnen wahre Helden sind. Diese Helden sind nicht unbedingt die Menschen, die in den Medien gefeiert werden oder große Taten vollbringen, sondern oft diejenigen, die im Stillen wirken und unser Leben bereichern.",
            "Nehmen wir zum Beispiel die Krankenschwester, die Tag und Nacht für ihre Patienten da ist. Ihre Arbeit mag oft undankbar und anstrengend sein, aber sie erfüllt ihre Aufgaben mit Hingabe und Mitgefühl. In den Augen derer, die ihre Hilfe erhalten, ist sie eine Heldin.",
            "Oder denken wir an den alleinerziehenden Vater, der trotz aller Schwierigkeiten jeden Tag hart arbeitet, um seinen Kindern eine gute Zukunft zu ermöglichen. Er könnte leicht aufgeben, aber er kämpft weiter und zeigt damit eine unglaubliche Stärke.",
            "Auch die Freiwilligen, die ihre Zeit opfern, um anderen zu helfen, verdienen unseren Respekt. Sei es durch die Unterstützung von Obdachlosen, die Betreuung von Senioren oder die Rettung von Tieren – sie sind die stillen Helden, die unsere Gesellschaft zusammenhalten.",
            "Es ist leicht, in den Heldengeschichten aus Filmen oder Büchern zu träumen, aber die wahren Helden sind oft viel näher, als wir denken. Sie sind die Menschen, die uns jeden Tag zeigen, dass wahre Stärke und Mut in den kleinen, alltäglichen Taten liegen.",
          ].map((paragraph) => <p key={paragraph} style={{ margin: 0, lineHeight: 1.7 }}>{paragraph}</p>)}
          <h3 style={sectionTitle}>Questions</h3>
          <QuestionList questions={lesenQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </section>
      )}

      {activeTab === "hoeren" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 4 · Hören (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Listening"
            title="Sehen und hören Sie das Video zweimal. Beantworten Sie danach alle fünf Fragen."
            submissionNote="Submit only the answer letters in this format: 1B, 2A, 3C ..."
          >
            <p style={{ margin: 0 }}>Read the questions first. Listen for Herr Müller's routine, the heating problem, his reaction and how he feels at the end.</p>
          </WorkbookTaskCard>
          <a href="https://youtu.be/bINimMVUjCc" target="_blank" rel="noreferrer" style={{ ...styles.button, width: "fit-content", textDecoration: "none" }}>
            Open Hören video on YouTube
          </a>
          <iframe
            src="https://www.youtube.com/embed/bINimMVUjCc?rel=0"
            title="B1 Day 3 Erfolgsgeschichten Teil 4 Hören video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ width: "100%", aspectRatio: "16 / 9", border: 0, borderRadius: 10 }}
          />
          <h3 style={sectionTitle}>Questions</h3>
          <QuestionList questions={hoerenQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </section>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers level="B1" lesson={{ title: "B1Day3Erfolgsgeschichten", level: "B1", day: 3, workbookId: "B1Day3Erfolgsgeschichten" }} workbookId="B1Day3Erfolgsgeschichten" />
      )}

      {activeTab === "submit" && (
        <section style={card}>
          <h2 style={sectionTitle}>Submit workbook answers</h2>
          <WorkbookTaskCard eyebrow="Final step" title="Submit Teil 2, Teil 3 and Teil 4." submissionNote="Do not submit Teil 1.">
            <p style={{ margin: 0 }}>Paste your final email, seven reading answer letters and five listening answer letters into the form below.</p>
          </WorkbookTaskCard>
          <div className="b1-day3-submission-page" style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}>
            <style>{`.b1-day3-submission-page > div > section:first-child { display: none !important; }
            .b1-day3-submission-page select { display: none !important; }`}</style>
            <AssignmentSubmissionPage submissionContext={{ level: "B1", day: 3, assignmentKey: "B1-1.3", canonicalAssignmentKey: "B1-1.3" }} />
          </div>
        </section>
      )}
    </div>
  );
};

export default B1Day3ErfolgsgeschichtenWorkbookPage;
