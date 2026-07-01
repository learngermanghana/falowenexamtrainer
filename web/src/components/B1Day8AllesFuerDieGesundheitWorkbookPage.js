import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import { STANDARD_WORKBOOK_TABS, WorkbookTabNav, WorkbookTaskCard } from "./StandardWorkbookComponents";
import { B1_DAY8_HEALTH_NOTES, B1_DAY8_LISTENING_QUESTIONS, B1_DAY8_READING_PARAGRAPHS, B1_DAY8_READING_QUESTIONS } from "../data/b1Day8WorkbookData";
import { styles } from "../styles";

const AUDIO_FILE_ID = "1Ob1312L9Cp2z5-sHGVfAKhoCWc-oFI6-";
const card = { ...styles.card, display: "grid", gap: 14 };
const title = { margin: 0, fontSize: "1.15rem" };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const box = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 13, background: "#fff", display: "grid", gap: 7 };

const QuestionList = ({ items }) => <div style={{ display: "grid", gap: 10 }}>{items.map((item) => <div key={item.stem} style={box}><strong>{item.stem}</strong>{item.options.map((option) => <span key={option}>{option}</span>)}</div>)}</div>;
const Prepared = ({ checked, onChange }) => <label style={{ display: "inline-flex", gap: 8, alignItems: "center", fontWeight: 700 }}><input type="checkbox" checked={checked} onChange={onChange} /> I prepared this part.</label>;

export default function B1Day8AllesFuerDieGesundheitWorkbookPage() {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({ sprechen: false, schreiben: false, lesen: false, hoeren: false });
  const mark = (key) => (event) => setPrepared((old) => ({ ...old, [key]: event.target.checked }));

  return <div style={{ ...styles.container, display: "grid", gap: 16 }}>
    <header style={card}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 8 · Kapitel 3.8</span>
      <h1 style={{ ...styles.title, margin: 0 }}>Alles für die Gesundheit</h1>
      <p style={{ ...styles.subtitle, margin: 0 }}>Select Teil 1–4, Ref or Submit. Each tab begins with the exact task and preparation instructions.</p>
      <WorkbookTabNav activeTab={activeTab} onChange={setActiveTab} tabs={STANDARD_WORKBOOK_TABS} ariaLabel="B1 Day 8 workbook sections" />
    </header>

    <A2B1WorkbookGuidance level="B1" />

    {activeTab === "sprechen" && <section style={card}>
      <h2 style={title}>Teil 1 · Sprechen (Class Preparation)</h2>
      <WorkbookTaskCard eyebrow="Question of the Day · Speaking" title="Wie wichtig ist eine gesunde Lebensweise für dich?" practiceOnly submissionNote="Speak for 1–2 minutes. Teil 1 is class preparation and is not submitted.">
        <p style={{ margin: 0 }}>Diskutieren Sie, was Sie tun, um fit und gesund zu bleiben. Sprechen Sie über Ernährung, Sport, Stress und Arztbesuche. Nutzen Sie Modalverben und Redemittel wie „Man sollte ...“, „Ich glaube, dass ...“ und „Meiner Meinung nach ...“.</p>
      </WorkbookTaskCard>
      <p style={{ margin: 0, color: "#475569" }}>The notes below are idea banks. You do not need to answer them one by one.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>{B1_DAY8_HEALTH_NOTES.map((note) => <article key={note.title} style={{ ...box, background: "#f8fafc" }}><h3 style={{ margin: 0 }}>{note.title}</h3><ul style={list}>{note.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div>
      <div style={{ ...box, background: "#f0fdf4", borderColor: "#bbf7d0" }}><strong>Suggested speaking structure</strong><ol style={list}><li>Einleitung: Ein gesundes Leben bedeutet für mich ...</li><li>Ernährung und Bewegung: Ich sollte / man sollte ...</li><li>Mentale Gesundheit und Stress: Wenn ich Stress habe, ...</li><li>Gesundheitsvorsorge: Arztbesuche sind wichtig, weil ...</li><li>Schluss: In Zukunft möchte ich ... verbessern.</li></ol></div>
      <div style={box}><strong>Useful phrases</strong><ul style={list}><li>Ich glaube, dass Bewegung eine große Rolle spielt, weil ...</li><li>Meiner Meinung nach ist es wichtig, genug Wasser zu trinken.</li><li>Man sollte darauf achten, dass man weniger Zucker isst.</li><li>Stress ist ein ernstes Problem, weil ...</li><li>Die richtige Ernährung ist entscheidend für die Gesundheit.</li></ul></div>
      <CourseInlinePracticePanel type="speaking" />
      <Prepared checked={prepared.sprechen} onChange={mark("sprechen")} />
    </section>}

    {activeTab === "schreiben" && <section style={card}>
      <h2 style={title}>Teil 2 · Schreiben (Assignment)</h2>
      <WorkbookTaskCard eyebrow="Your assignment · Writing" title="Sind regelmäßige Sporteinheiten der Schlüssel zu einem gesunden Leben? Schreiben Sie Ihre Meinung." submissionNote="Write about 80–100 words and submit the final text in Submit.">
        <p style={{ margin: 0 }}>Situation: Max sagt, dass regelmäßige Sporteinheiten helfen, fit zu bleiben und das Immunsystem zu stärken. Schreiben Sie Ihre Meinung. Gehen Sie auf Max ein, nennen Sie Vorteile von Sport, erklären Sie die Rolle von Ernährung und schreiben Sie, was Sie persönlich im Alltag tun oder verbessern möchten.</p>
      </WorkbookTaskCard>
      <div style={{ ...box, background: "#eff6ff" }}><strong>Max</strong><p style={{ margin: 0 }}>Regelmäßige Sporteinheiten helfen, fit zu bleiben und das Immunsystem zu stärken. Ich stimme dem zu, denn Bewegung reduziert das Risiko für viele Krankheiten wie Herzprobleme oder Diabetes. Dennoch ist auch eine ausgewogene Ernährung wichtig, um gesund zu bleiben. Ich finde, dass jeder eine Sportart finden sollte, die ihm Spaß macht, damit Bewegung langfristig Teil des Alltags wird. Was denken Sie darüber?</p></div>
      <div style={box}><strong>Writing support</strong><ol style={list}><li>Einleitung: Thema nennen.</li><li>Auf Max reagieren: zustimmen oder teilweise widersprechen.</li><li>Sport und Ernährung begründen.</li><li>Eigene Gewohnheiten und Verbesserung nennen.</li><li>Kurzer Schluss.</li></ol></div>
      <CourseInlinePracticePanel type="writing" />
      <WorkbookSubmissionReminder />
      <Prepared checked={prepared.schreiben} onChange={mark("schreiben")} />
    </section>}

    {activeTab === "lesen" && <section style={card}>
      <h2 style={title}>Teil 3 · Lesen (Assignment)</h2>
      <WorkbookTaskCard eyebrow="Your assignment · Reading" title="Lesen Sie den Text „Ein moderner Held in der Medizinwelt“ und beantworten Sie 7 Fragen." submissionNote="Submit only answer letters, for example: 1A, 2B, 3C."><p style={{ margin: 0 }}>Read the complete text. Choose one answer, a–d, for each question.</p></WorkbookTaskCard>
      <h3 style={{ margin: 0 }}>Ein moderner Held in der Medizinwelt</h3>
      {B1_DAY8_READING_PARAGRAPHS.map((paragraph) => <p key={paragraph} style={{ margin: 0, lineHeight: 1.75 }}>{paragraph}</p>)}
      <QuestionList items={B1_DAY8_READING_QUESTIONS} />
      <WorkbookSubmissionReminder />
      <Prepared checked={prepared.lesen} onChange={mark("lesen")} />
    </section>}

    {activeTab === "hoeren" && <section style={card}>
      <h2 style={title}>Teil 4 · Hören (Assignment)</h2>
      <WorkbookTaskCard eyebrow="Your assignment · Listening" title="Hören Sie den Beitrag zweimal und beantworten Sie 5 Fragen." submissionNote="Submit only answer letters, for example: 1B, 2A, 3C."><p style={{ margin: 0 }}>Listen for Herr Webers daily work, attitude, calm problem-solving, emotional support and how patients and colleagues see him.</p></WorkbookTaskCard>
      <iframe src={`https://drive.google.com/file/d/${AUDIO_FILE_ID}/preview`} title="B1 Day 8 Hören" allow="autoplay" style={{ width: "100%", aspectRatio: "16 / 9", border: 0, borderRadius: 12 }} />
      <QuestionList items={B1_DAY8_LISTENING_QUESTIONS} />
      <WorkbookSubmissionReminder />
      <Prepared checked={prepared.hoeren} onChange={mark("hoeren")} />
    </section>}

    {activeTab === "references" && <WorkbookReferenceAnswers level="B1" lesson={{ title: "B1Day8AllesFuerDieGesundheit", level: "B1", day: 8, workbookId: "B1Day8AllesFuerDieGesundheit" }} workbookId="B1Day8AllesFuerDieGesundheit" />}

    {activeTab === "submit" && <section style={card}><h2 style={title}>Submit workbook answers</h2><WorkbookTaskCard eyebrow="Final step" title="Submit Teil 2, Teil 3 and Teil 4." submissionNote="Do not submit Teil 1."><p style={{ margin: 0 }}>Paste your final writing text, reading answer letters and listening answer letters into the form below.</p></WorkbookTaskCard><div className="b1-day8-submission-page" style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}><style>{`.b1-day8-submission-page > div > section:first-child { display: none !important; }.b1-day8-submission-page select { display: none !important; }`}</style><AssignmentSubmissionPage submissionContext={{ level: "B1", day: 8, assignmentKey: "B1-3.8", canonicalAssignmentKey: "B1-3.8" }} /></div></section>}
  </div>;
}
