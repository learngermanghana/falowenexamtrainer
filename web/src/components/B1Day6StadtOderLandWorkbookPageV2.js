import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import ContextualAssignmentSubmissionPage from "./ContextualAssignmentSubmissionPage";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import { STANDARD_WORKBOOK_TABS, WorkbookTabNav, WorkbookTaskCard } from "./StandardWorkbookComponents";
import {
  B1_DAY6_CITY_ADVANTAGES,
  B1_DAY6_CITY_DISADVANTAGES,
  B1_DAY6_COUNTRY_ADVANTAGES,
  B1_DAY6_COUNTRY_DISADVANTAGES,
  B1_DAY6_READING_PARAGRAPHS,
  B1_DAY6_READING_QUESTIONS,
  B1_DAY6_LISTENING_QUESTIONS,
} from "../data/b1Day6WorkbookData";
import { styles } from "../styles";

const YOUTUBE_EMBED_URL = "https://www.youtube.com/embed/6zpR_jF26l0";
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

export default function B1Day6StadtOderLandWorkbookPageV2() {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({ sprechen: false, schreiben: false, lesen: false, hoeren: false });
  const mark = (key) => (event) => setPrepared((old) => ({ ...old, [key]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 6 · Kapitel 2.6</span>
        <h1 style={{ ...styles.title, margin: 0 }}>Leben in der Stadt oder auf dem Land?</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Choose Teil 1–4, Ref or Submit. Each section starts with the exact task.</p>
        <WorkbookTabNav activeTab={activeTab} onChange={setActiveTab} tabs={STANDARD_WORKBOOK_TABS} ariaLabel="B1 Day 6 workbook sections" />
      </header>

      <A2B1WorkbookGuidance level="B1" />

      {activeTab === "sprechen" && (
        <section style={card}>
          <h2 style={title}>Teil 1 · Sprechen (Group Practice)</h2>
          <WorkbookTaskCard eyebrow="Question of the Day · Speaking" title="Wo lebt man besser – in der Stadt oder auf dem Land?" practiceOnly submissionNote="Prepare a 1–2 minute answer. Teil 1 is not submitted.">
            <p style={{ margin: 0 }}>Entscheiden Sie sich für Stadt, Land oder den Stadtrand. Nennen Sie mindestens zwei Vorteile, einen möglichen Nachteil und begründen Sie Ihre persönliche Meinung.</p>
          </WorkbookTaskCard>
          <p style={{ margin: 0, color: "#475569" }}>The notes below are supporting ideas. They are not separate questions.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
            <TopicCard title="Leben in der Stadt" advantages={B1_DAY6_CITY_ADVANTAGES} disadvantages={B1_DAY6_CITY_DISADVANTAGES} />
            <TopicCard title="Leben auf dem Land" advantages={B1_DAY6_COUNTRY_ADVANTAGES} disadvantages={B1_DAY6_COUNTRY_DISADVANTAGES} />
          </div>
          <div style={{ ...box, background: "#f0fdf4", borderColor: "#bbf7d0" }}>
            <strong>Suggested speaking structure</strong>
            <ol style={list}><li>Einleitung</li><li>Vorteile und Nachteile der Stadt</li><li>Vorteile und Nachteile des Landes</li><li>Eigene Meinung mit Begründung</li><li>Schluss</li></ol>
          </div>
          <CourseInlinePracticePanel type="speaking" />
          <Prepared checked={prepared.sprechen} onChange={mark("sprechen")} />
        </section>
      )}

      {activeTab === "schreiben" && (
        <section style={card}>
          <h2 style={title}>Teil 2 · Schreiben (Assignment)</h2>
          <WorkbookTaskCard eyebrow="Your assignment · Writing" title="Stadt oder Land – welches ist Ihrer Meinung nach besser und warum?" submissionNote="Write approximately 80 words and submit your final text through Submit.">
            <p style={{ margin: 0 }}>Reagieren Sie auf Tanjas Meinung, vergleichen Sie beide Wohnorte und begründen Sie Ihre persönliche Entscheidung.</p>
          </WorkbookTaskCard>
          <div style={{ ...box, background: "#eff6ff" }}>
            <strong>Meinung von Tanja</strong>
            <p style={{ margin: 0 }}>„Tanja sagt, dass das Leben in der Stadt für sie besser ist, weil dort immer etwas los ist und sie alles schnell erreichen kann. Ich denke anders. Für mich ist das Leben auf dem Land besser, weil es ruhiger ist und ich mehr Kontakt zur Natur habe.“</p>
          </div>
          <div style={box}><strong>Empfohlene Struktur</strong><ol style={list}><li>Einleitung zum Thema</li><li>Vorteil oder Nachteil der Stadt</li><li>Vorteil oder Nachteil des Landes</li><li>Eigene Meinung mit Begründung</li><li>Kurzer Schluss</li></ol></div>
          <CourseInlinePracticePanel type="writing" />
          <WorkbookSubmissionReminder />
          <Prepared checked={prepared.schreiben} onChange={mark("schreiben")} />
        </section>
      )}

      {activeTab === "lesen" && (
        <section style={card}>
          <h2 style={title}>Teil 3 · Lesen (Assignment)</h2>
          <WorkbookTaskCard eyebrow="Your assignment · Reading" title="Lesen Sie den Text und beantworten Sie alle sieben Fragen." submissionNote="Submit only answer letters, for example: 1B, 2C, 3A.">
            <p style={{ margin: 0 }}>Read the complete text first. Then choose one answer, A–C, for every question.</p>
          </WorkbookTaskCard>
          <h3 style={{ margin: 0 }}>Verschiedene Wohnarten in Deutschland</h3>
          {B1_DAY6_READING_PARAGRAPHS.map((paragraph) => <p key={paragraph} style={{ margin: 0, lineHeight: 1.75 }}>{paragraph}</p>)}
          <QuestionList items={B1_DAY6_READING_QUESTIONS} />
          <WorkbookSubmissionReminder />
          <Prepared checked={prepared.lesen} onChange={mark("lesen")} />
        </section>
      )}

      {activeTab === "hoeren" && (
        <section style={card}>
          <h2 style={title}>Teil 4 · Hören (Assignment)</h2>
          <WorkbookTaskCard eyebrow="Your assignment · Listening" title="Hören Sie den Beitrag zweimal und beantworten Sie alle fünf Fragen." submissionNote="Submit only answer letters, for example: 1B, 2A, 3C.">
            <p style={{ margin: 0 }}>Watch the embedded video and listen for information about WGs, family houses, city apartments and sustainable housing.</p>
          </WorkbookTaskCard>
          <iframe
            src={YOUTUBE_EMBED_URL}
            title="B1 Day 6 Hören video"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ width: "100%", aspectRatio: "16 / 9", border: 0, borderRadius: 12 }}
          />
          <QuestionList items={B1_DAY6_LISTENING_QUESTIONS} />
          <WorkbookSubmissionReminder />
          <Prepared checked={prepared.hoeren} onChange={mark("hoeren")} />
        </section>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers level="B1" lesson={{ title: "B1Day6StadtOderLand", level: "B1", day: 6, workbookId: "B1Day6StadtOderLand" }} workbookId="B1Day6StadtOderLand" />
      )}

      {activeTab === "submit" && (
        <section style={card}>
          <h2 style={title}>Submit workbook answers</h2>
          <WorkbookTaskCard eyebrow="Final step" title="Submit Teil 2, Teil 3 and Teil 4." submissionNote="Do not submit Teil 1.">
            <p style={{ margin: 0 }}>Paste your writing, reading answers and listening answers below.</p>
          </WorkbookTaskCard>
          <div className="b1-day6-submission-page" style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}>
            <style>{`.b1-day6-submission-page > div > section:first-child { display: none !important; }.b1-day6-submission-page select { display: none !important; }`}</style>
            <ContextualAssignmentSubmissionPage submissionContext={{ level: "B1", day: 6, assignmentKey: "B1-2.6", canonicalAssignmentKey: "B1-2.6" }} />
          </div>
        </section>
      )}
    </div>
  );
}
