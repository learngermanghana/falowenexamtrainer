import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import { STANDARD_WORKBOOK_TABS, WorkbookTabNav, WorkbookTaskCard } from "./StandardWorkbookComponents";
import { styles } from "../styles";

const LISTENING_YOUTUBE_ID = "iyydRu3oY4I";
const card = { ...styles.card, display: "grid", gap: 14 };
const title = { margin: 0, fontSize: "1.15rem" };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const box = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 13, background: "#fff", display: "grid", gap: 7, lineHeight: 1.7 };

const branches = [
  { title: "Familie", items: ["Traditionelle Familie", "Alleinerziehende Eltern", "Patchworkfamilien", "Rollenverteilung"] },
  { title: "Wohngemeinschaft (WG)", items: ["Studenten-WG", "geteilte Kosten und Gemeinschaft", "Privatsphäre und Konflikte", "Organisation im Alltag"] },
  { title: "Singleleben", items: ["Unabhängigkeit", "Selbstverwirklichung", "Einsamkeit", "flexible Lebensgestaltung"] },
  { title: "Neue Lebensformen", items: ["gleichgeschlechtliche Partnerschaften", "Fernbeziehungen", "Wohnen auf Zeit", "Co-Parenting"] },
];

const readingQuestions = [
  { stem: "1. Warum ging Frau Müller ins Ausland?", options: ["a) Sie wollte Urlaub machen.", "b) Sie wollte Auslandserfahrung sammeln.", "c) Sie wollte ihre Eltern besuchen.", "d) Sie wollte einen Mann kennenlernen."] },
  { stem: "2. In welchem Land sammelte Frau Müller Auslandserfahrungen?", options: ["a) Niederlande", "b) Hessen", "c) Nordrhein-Westfalen", "d) Österreich"] },
  { stem: "3. Hat Frau Müller Kinder?", options: ["a) Ja, einen Sohn und eine Tochter.", "b) Nein.", "c) Ja, einen Sohn.", "d) Ja, zwei Söhne."] },
  { stem: "4. Hat Frau Müller Geschwister?", options: ["a) Nein.", "b) Ja, zwei Brüder.", "c) Das steht nicht im Text.", "d) Ja, fünf Geschwister."] },
  { stem: "5. Warum möchte Frau Müller wieder nach Nordrhein-Westfalen umziehen?", options: ["a) Weil ihr Mann aus Nordrhein-Westfalen ist.", "b) Weil sie arbeitslos ist.", "c) Weil ihre Eltern dort wohnen.", "d) Weil ihre Geschwister dort wohnen."] },
];

const Prepared = ({ checked, onChange }) => (
  <label style={{ display: "inline-flex", gap: 8, alignItems: "center", fontWeight: 700 }}>
    <input type="checkbox" checked={checked} onChange={onChange} /> I prepared this part.
  </label>
);

const QuestionList = ({ items }) => <div style={{ display: "grid", gap: 10 }}>{items.map((item) => <div key={item.stem} style={box}><strong>{item.stem}</strong>{item.options.map((option) => <span key={option}>{option}</span>)}</div>)}</div>;

export default function B1Day21LebensformenHeuteWorkbookPage() {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({ sprechen: false, schreiben: false, lesen: false, hoeren: false });
  const mark = (key) => (event) => setPrepared((old) => ({ ...old, [key]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 21 · Kapitel 7.21</span>
        <h1 style={{ ...styles.title, margin: 0 }}>Lebensformen heute</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Select Teil 1–4, Ref or Submit. Each section starts with the exact task.</p>
        <WorkbookTabNav activeTab={activeTab} onChange={setActiveTab} tabs={STANDARD_WORKBOOK_TABS} ariaLabel="B1 Day 21 workbook sections" />
      </header>

      <A2B1WorkbookGuidance level="B1" />

      {activeTab === "sprechen" && <section style={card}>
        <h2 style={title}>Teil 1 · Sprechen (Group Practice)</h2>
        <WorkbookTaskCard eyebrow="Question of the Day · Speaking" title="Welche Lebensform findest du am besten – Familie, Wohngemeinschaft oder Singleleben? Warum?" practiceOnly submissionNote="Speak for 1–2 minutes. Teil 1 is class preparation and is not submitted.">
          <p style={{ margin: 0 }}>Beschreiben Sie mehrere Lebensformen, nennen Sie Vor- und Nachteile und erklären Sie genauer, welche Lebensform gut oder nicht gut zu Ihnen passt. Verwenden Sie Redemittel wie „einerseits … andererseits“, „weil“, „obwohl“ und „meiner Meinung nach“.</p>
        </WorkbookTaskCard>
        <p style={{ margin: 0, color: "#475569" }}>The supporting notes below are ideas for your discussion. They are not separate questions to answer one by one.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>{branches.map((branch) => <article key={branch.title} style={{ ...box, background: "#f8fafc" }}><h3 style={{ margin: 0 }}>{branch.title}</h3><ul style={list}>{branch.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div>
        <div style={{ ...box, background: "#f0fdf4", borderColor: "#bbf7d0" }}><strong>Suggested speaking structure</strong><ol style={list}><li>Einleitung: Heute gibt es viele Lebensformen.</li><li>Vergleich: Familie, WG und Singleleben mit Vorteilen und Nachteilen.</li><li>Bewertung: Was ist für Sie wichtiger: Freiheit, Nähe, Kosten oder Sicherheit?</li><li>Persönliche Entscheidung mit Begründung.</li></ol></div>
        <div style={box}><strong>Useful phrases</strong><ul style={list}><li>Meiner Meinung nach …</li><li>Einerseits …, andererseits …</li><li>Ein Vorteil/Nachteil ist, dass …</li><li>Für mich passt … am besten, weil …</li></ul></div>
        <CourseInlinePracticePanel type="speaking" />
        <Prepared checked={prepared.sprechen} onChange={mark("sprechen")} />
      </section>}

      {activeTab === "schreiben" && <section style={card}>
        <h2 style={title}>Teil 2 · Schreiben (Assignment)</h2>
        <WorkbookTaskCard eyebrow="Your assignment · Writing" title="Welche Lebensform ist heute am besten – Familie, Wohngemeinschaft oder Singleleben? Schreiben Sie Ihre Meinung." submissionNote="Write about 80–100 words and submit your final text in the Submit tab.">
          <p style={{ margin: 0 }}>Situation: Mara schreibt, dass die beste Lebensform von der persönlichen Situation abhängt. Reagieren Sie auf Maras Meinung. Beschreiben Sie Familie, WG und Singleleben, nennen Sie Vor- und Nachteile und begründen Sie Ihre eigene Meinung.</p>
        </WorkbookTaskCard>
        <div style={{ ...box, background: "#eff6ff" }}><strong>Meinung von Mara</strong><p style={{ margin: 0 }}>Heute gibt es viele verschiedene Lebensformen, und jede hat ihre Vorteile. Ich finde, dass die beste Lebensform von der persönlichen Situation abhängt. In einer Familie hat man oft viel Unterstützung und Nähe. In einer Wohngemeinschaft lebt man mit anderen zusammen und kann Kosten teilen. Das Singleleben bietet dagegen viel Freiheit und Unabhängigkeit. Dennoch kann es manchmal auch einsam sein. Ich denke, dass jeder selbst entscheiden sollte, welche Lebensform am besten zu ihm passt. Was denken Sie darüber?</p></div>
        <div style={box}><strong>Writing support</strong><ol style={list}><li>Einleitung zum Thema.</li><li>Maras Meinung kurz zusammenfassen.</li><li>Vor- und Nachteile vergleichen.</li><li>Eigene Meinung mit Beispiel.</li><li>Kurzer Schluss.</li></ol></div>
        <CourseInlinePracticePanel type="writing" />
        <WorkbookSubmissionReminder />
        <Prepared checked={prepared.schreiben} onChange={mark("schreiben")} />
      </section>}

      {activeTab === "lesen" && <section style={card}>
        <h2 style={title}>Teil 3 · Lesen (Assignment)</h2>
        <WorkbookTaskCard eyebrow="Your assignment · Reading" title="Lesen Sie den Text und beantworten Sie alle fünf Fragen." submissionNote="Submit only answer letters, for example: 1B, 2A, 3D.">
          <p style={{ margin: 0 }}>Read the complete text first. Then choose one answer, a–d, for every question.</p>
        </WorkbookTaskCard>
        <h3 style={{ margin: 0 }}>Andrea Müller: Familie an verschiedenen Orten</h3>
        <p style={{ margin: 0, lineHeight: 1.75 }}>Mein Name ist Andrea Müller und meine Familie lebt nicht gemeinsam an einem Ort, sondern ist über mehrere Bundesländer innerhalb Deutschlands verstreut. Ursprünglich komme ich aus Nordrhein-Westfalen und habe in Köln studiert. Nach Abschluss des Studiums fand ich jedoch nicht gleich eine Arbeit, die mir zusagte und so entschied ich mich, zunächst einmal ins Ausland zu gehen und Erfahrungen zu sammeln.</p>
        <p style={{ margin: 0, lineHeight: 1.75 }}>Ich lebte zwei Jahre lang in den Niederlanden, wo es mir sehr gut gefiel und ich sowohl meine Englischkenntnisse verbessern, als auch die niederländische Sprache als neue Fremdsprache hinzulernen konnte. Mit dieser internationalen Berufserfahrung und den erweiterten Sprachkenntnissen fand ich eine Anstellung in Hessen.</p>
        <p style={{ margin: 0, lineHeight: 1.75 }}>Dort lernte ich auch meinen Mann kennen, der ursprünglich aus Bayern stammt. Wir heirateten und bekamen zwei Söhne. In Hessen haben wir uns inzwischen einen größeren Kreis an Freunden und Bekannten aufgebaut, unsere Familien leben jedoch noch immer größtenteils in Nordrhein-Westfalen und Bayern. Hinzu kommt, dass meine fünf Geschwister ebenfalls nicht in Nordrhein-Westfalen sesshaft geworden sind, sondern über die gesamte Bundesrepublik Deutschland verstreut leben.</p>
        <p style={{ margin: 0, lineHeight: 1.75 }}>Nur bei größeren Familienfesten und Geburtstagen sehen wir uns alle. Ich würde sehr gern in der Nähe meiner Eltern leben, da diese mittlerweile auch ziemlich alt sind und sicherlich bald Unterstützung benötigen. Auch unsere Kinder vermissen die Großeltern und Verwandten oft.</p>
        <p style={{ margin: 0, lineHeight: 1.75 }}>Unsere mittelfristige Perspektive ist es daher, für meinen Mann und mich in der nächsten Zeit Arbeitsstellen und ein Haus in Nordrhein-Westfalen zu finden.</p>
        <QuestionList items={readingQuestions} />
        <WorkbookSubmissionReminder />
        <Prepared checked={prepared.lesen} onChange={mark("lesen")} />
      </section>}

      {activeTab === "hoeren" && <section style={card}>
        <h2 style={title}>Teil 4 · Hören (Assignment)</h2>
        <WorkbookTaskCard eyebrow="Your assignment · Listening" title="Hören Sie den Goethe-standard Hören-Test und markieren Sie Ihre Ergebnisse selbst." submissionNote="Submit your self-marked Hören result or a short note that you checked the answers in the video.">
          <p style={{ margin: 0 }}>Listen twice. Focus on the task instructions and the answer choices shown in the video. The answers are provided in the YouTube video, so you are responsible for checking your own Hören results.</p>
        </WorkbookTaskCard>
        <iframe src={`https://www.youtube.com/embed/${LISTENING_YOUTUBE_ID}`} title="B1 Day 21 Hören" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen style={{ width: "100%", aspectRatio: "16 / 9", border: 0, borderRadius: 12 }} />
        <div style={box}><strong>Listening answer format</strong><p style={{ margin: 0 }}>After self-checking, write: „Hören checked: __ / __ correct“ or paste the answers required by your teacher. Remember: Lesen and Schreiben are officially evaluated by the school; Hören is self-marked.</p></div>
        <WorkbookSubmissionReminder />
        <Prepared checked={prepared.hoeren} onChange={mark("hoeren")} />
      </section>}

      {activeTab === "references" && <WorkbookReferenceAnswers level="B1" lesson={{ title: "B1Day21LebensformenHeute", level: "B1", day: 21, workbookId: "B1Day21LebensformenHeute" }} workbookId="B1Day21LebensformenHeute" />}

      {activeTab === "submit" && <section style={card}>
        <h2 style={title}>Submit workbook answers</h2>
        <WorkbookTaskCard eyebrow="Final step" title="Submit Teil 2, Teil 3 and Teil 4." submissionNote="Do not submit Teil 1.">
          <p style={{ margin: 0 }}>Paste your writing text, reading answer letters and self-marked listening result into the form below.</p>
        </WorkbookTaskCard>
        <div className="b1-day21-submission-page" style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}>
          <style>{`.b1-day21-submission-page > div > section:first-child { display: none !important; }.b1-day21-submission-page select { display: none !important; }`}</style>
          <AssignmentSubmissionPage submissionContext={{ level: "B1", day: 21, assignmentKey: "B1-7.21", canonicalAssignmentKey: "B1-7.21" }} />
        </div>
      </section>}
    </div>
  );
}
