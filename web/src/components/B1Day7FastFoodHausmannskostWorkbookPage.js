import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import { STANDARD_WORKBOOK_TABS, WorkbookTabNav, WorkbookTaskCard } from "./StandardWorkbookComponents";
import {
  B1_DAY7_FAST_FOOD_ADVANTAGES,
  B1_DAY7_FAST_FOOD_DISADVANTAGES,
  B1_DAY7_HAUSMANNSKOST_ADVANTAGES,
  B1_DAY7_HAUSMANNSKOST_DISADVANTAGES,
  B1_DAY7_READING_PARAGRAPHS,
  B1_DAY7_READING_QUESTIONS,
  B1_DAY7_AD_QUESTIONS,
  B1_DAY7_LISTENING_QUESTIONS,
} from "../data/b1Day7WorkbookData";
import { styles } from "../styles";

const AUDIO_FILE_ID = "1wBI2f7L7guBKTtb0LqdAYhbukEd6BS2a";
const card = { ...styles.card, display: "grid", gap: 14 };
const title = { margin: 0, fontSize: "1.15rem" };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const box = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 13, background: "#fff", display: "grid", gap: 7 };

const QuestionList = ({ items }) => (
  <div style={{ display: "grid", gap: 10 }}>
    {items.map((item) => (
      <div key={item.stem} style={box}>
        <strong>{item.stem}</strong>
        {item.options.map((option) => <span key={option}>{option}</span>)}
      </div>
    ))}
  </div>
);

const TopicCard = ({ title: heading, advantages, disadvantages }) => (
  <article style={{ ...box, background: "#f8fafc" }}>
    <h3 style={{ margin: 0 }}>{heading}</h3>
    <strong>Vorteile</strong>
    <ul style={list}>{advantages.map((item) => <li key={item}>{item}</li>)}</ul>
    <strong>Nachteile</strong>
    <ul style={list}>{disadvantages.map((item) => <li key={item}>{item}</li>)}</ul>
  </article>
);

const Prepared = ({ checked, onChange }) => (
  <label style={{ display: "inline-flex", gap: 8, alignItems: "center", fontWeight: 700 }}>
    <input type="checkbox" checked={checked} onChange={onChange} /> I prepared this part.
  </label>
);

export default function B1Day7FastFoodHausmannskostWorkbookPage() {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({ sprechen: false, schreiben: false, lesen: false, hoeren: false });
  const mark = (key) => (event) => setPrepared((old) => ({ ...old, [key]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 7 · Kapitel 3.7</span>
        <h1 style={{ ...styles.title, margin: 0 }}>Fast Food vs. Hausmannskost</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Choose Teil 1–4, Ref or Submit. Each section starts with the exact task.</p>
        <WorkbookTabNav activeTab={activeTab} onChange={setActiveTab} tabs={STANDARD_WORKBOOK_TABS} ariaLabel="B1 Day 7 workbook sections" />
      </header>

      <A2B1WorkbookGuidance level="B1" />

      {activeTab === "sprechen" && (
        <section style={card}>
          <h2 style={title}>Teil 1 · Sprechen (Group Practice)</h2>
          <WorkbookTaskCard eyebrow="Question of the Day · Speaking" title="Fast Food oder Hausmannskost – was ist besser?" practiceOnly submissionNote="Prepare a 1–2 minute answer. Teil 1 is not submitted.">
            <p style={{ margin: 0 }}>Diskutieren Sie 1–2 Minuten: Vergleichen Sie Fast Food und Hausmannskost, nennen Sie mindestens zwei Vorteile, zwei Nachteile und begründen Sie Ihre persönliche Essgewohnheit. Nutzen Sie Redemittel wie „einerseits ... andererseits“, „wegen“ und „trotz“.</p>
          </WorkbookTaskCard>
          <p style={{ margin: 0, color: "#475569" }}>The notes below are supporting ideas. They are not separate questions.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
            <TopicCard title="Fast Food" advantages={B1_DAY7_FAST_FOOD_ADVANTAGES} disadvantages={B1_DAY7_FAST_FOOD_DISADVANTAGES} />
            <TopicCard title="Hausmannskost" advantages={B1_DAY7_HAUSMANNSKOST_ADVANTAGES} disadvantages={B1_DAY7_HAUSMANNSKOST_DISADVANTAGES} />
          </div>
          <div style={{ ...box, background: "#f0fdf4", borderColor: "#bbf7d0" }}>
            <strong>Suggested speaking structure</strong>
            <ol style={list}><li>Einleitung</li><li>Vorteile von Fast Food</li><li>Vorteile von Hausmannskost</li><li>Eigene Meinung und Essgewohnheiten</li><li>Schluss</li></ol>
          </div>
          <div style={box}><strong>Useful phrases</strong><ul style={list}><li>Einerseits ist Fast Food praktisch, andererseits enthält es oft viel Fett.</li><li>Wegen des hohen Zuckeranteils esse ich Fertiggerichte nur selten.</li><li>Trotz des Zeitaufwands koche ich lieber frisch.</li></ul></div>
          <CourseInlinePracticePanel type="speaking" />
          <Prepared checked={prepared.sprechen} onChange={mark("sprechen")} />
        </section>
      )}

      {activeTab === "schreiben" && (
        <section style={card}>
          <h2 style={title}>Teil 2 · Schreiben (Assignment)</h2>
          <WorkbookTaskCard eyebrow="Your assignment · Writing" title="Sind Fertiggerichte eine gute Wahl für eine gesunde Ernährung? Schreiben Sie Ihre Meinung." submissionNote="Write approximately 80 words and submit your final text through Submit.">
            <p style={{ margin: 0 }}>Reagieren Sie auf Tanjas Meinung. Erklären Sie, ob Fertiggerichte eine gute Wahl für eine gesunde Ernährung sind. Nennen Sie Vorteile, Nachteile und Ihre persönliche Lösung im Alltag.</p>
          </WorkbookTaskCard>
          <div style={{ ...box, background: "#eff6ff" }}>
            <strong>Meinung von Tanja</strong>
            <p style={{ margin: 0 }}>„Fertiggerichte enthalten oft ungesunde Zutaten und sind nicht immer die beste Wahl für eine ausgewogene Ernährung. Viele Fertiggerichte sind reich an Salz, Zucker und Zusatzstoffen. Dennoch können sie in stressigen Zeiten eine praktische Lösung sein.“</p>
          </div>
          <div style={box}><strong>Empfohlene Struktur</strong><ol style={list}><li>Einleitung zum Thema</li><li>Tanjas Meinung kurz nennen</li><li>Vor- und Nachteile von Fertiggerichten erklären</li><li>Eigene Meinung und Essgewohnheiten</li><li>Kurzer Schluss</li></ol></div>
          <div style={box}><strong>Writing support</strong><ul style={list}><li>Ich stimme Tanja zu, weil ...</li><li>Ein Vorteil von Fertiggerichten ist ..., aber ...</li><li>Meiner Meinung nach sollte man ...</li></ul></div>
          <CourseInlinePracticePanel type="writing" />
          <WorkbookSubmissionReminder />
          <Prepared checked={prepared.schreiben} onChange={mark("schreiben")} />
        </section>
      )}

      {activeTab === "lesen" && (
        <section style={card}>
          <h2 style={title}>Teil 3 · Lesen (Assignment)</h2>
          <WorkbookTaskCard eyebrow="Your assignment · Reading" title="Lesen Sie den Text und beantworten Sie sieben Textfragen und fünf Anzeige-Fragen." submissionNote="Submit only answer letters, for example: Text: 1A, 2B. Anzeigen: 1F, 2B.">
            <p style={{ margin: 0 }}>Read the complete text first. Then choose one answer, A–C, for questions 1–7 and one Anzeige letter, A–F, for questions 1–5.</p>
          </WorkbookTaskCard>
          <h3 style={{ margin: 0 }}>Der Einfluss von Süßigkeiten auf die Gesundheit</h3>
          {B1_DAY7_READING_PARAGRAPHS.map((paragraph) => <p key={paragraph} style={{ margin: 0, lineHeight: 1.75 }}>{paragraph}</p>)}
          <QuestionList items={B1_DAY7_READING_QUESTIONS} />
          <div style={box}><strong>Anzeige-Fragen (A–F)</strong><p style={{ margin: 0 }}>Anzeige A: Sonderangebote im Supermarkt für Fertiggerichte · Anzeige B: Werbung für ein neues Diät-Programm · Anzeige C: Angebot für zuckerfreie Süßigkeiten · Anzeige D: Eröffnung eines neuen Restaurants mit gesunden Gerichten · Anzeige E: Rabatt auf Schokolade im Online-Shop · Anzeige F: Veranstaltung über gesunde Ernährung und Zuckerreduktion</p></div>
          <QuestionList items={B1_DAY7_AD_QUESTIONS} />
          <WorkbookSubmissionReminder />
          <Prepared checked={prepared.lesen} onChange={mark("lesen")} />
        </section>
      )}

      {activeTab === "hoeren" && (
        <section style={card}>
          <h2 style={title}>Teil 4 · Hören (Assignment)</h2>
          <WorkbookTaskCard eyebrow="Your assignment · Listening" title="Hören Sie den Beitrag zweimal und beantworten Sie alle fünf Fragen." submissionNote="Submit only answer letters, for example: 1B, 2A, 3C.">
            <p style={{ margin: 0 }}>Listen for hidden sugar, short-term effects of sugar, long-term health risks and expert recommendations.</p>
          </WorkbookTaskCard>
          <iframe src={`https://drive.google.com/file/d/${AUDIO_FILE_ID}/preview`} title="B1 Day 7 Hören" allow="autoplay" style={{ width: "100%", aspectRatio: "16 / 9", border: 0, borderRadius: 12 }} />
          <QuestionList items={B1_DAY7_LISTENING_QUESTIONS} />
          <WorkbookSubmissionReminder />
          <Prepared checked={prepared.hoeren} onChange={mark("hoeren")} />
        </section>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers level="B1" lesson={{ title: "B1Day7FastFoodHausmannskost", level: "B1", day: 7, workbookId: "B1Day7FastFoodHausmannskost" }} workbookId="B1Day7FastFoodHausmannskost" />
      )}

      {activeTab === "submit" && (
        <section style={card}>
          <h2 style={title}>Submit workbook answers</h2>
          <WorkbookTaskCard eyebrow="Final step" title="Submit Teil 2, Teil 3 and Teil 4." submissionNote="Do not submit Teil 1.">
            <p style={{ margin: 0 }}>Paste your writing, reading answers and listening answers below.</p>
          </WorkbookTaskCard>
          <div className="b1-day7-submission-page" style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}>
            <style>{`.b1-day7-submission-page > div > section:first-child { display: none !important; }.b1-day7-submission-page select { display: none !important; }`}</style>
            <AssignmentSubmissionPage submissionContext={{ level: "B1", day: 7, assignmentKey: "B1-3.7", canonicalAssignmentKey: "B1-3.7" }} />
          </div>
        </section>
      )}
    </div>
  );
}
