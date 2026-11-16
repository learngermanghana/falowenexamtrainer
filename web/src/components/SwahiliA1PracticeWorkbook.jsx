import React, { useState } from "react";
import { Link } from "react-router-dom";
import { A2_B1_WORKBOOK_TABS_WITH_GRAMMAR, WorkbookTabNav } from "./StandardWorkbookComponents";
import { GrammarSelfCheck } from "./MgahawaniGrammarPractice";
import { useSwahiliWorkbookTab, SwahiliWorkbookNavigation } from "./SwahiliWorkbookNavigation";
import "./SwahiliCourseBook.css";

const tabs = A2_B1_WORKBOOK_TABS_WITH_GRAMMAR.map((tab) =>
  tab.key === "submit" ? { ...tab, label: "Answer Sheet", description: "Model answers" } : tab);

export default function SwahiliA1PracticeWorkbook({ lesson, preview = false }) {
  const [activeTab, selectTab] = useSwahiliWorkbookTab(tabs);
  const [writing, setWriting] = useState("");
  const [reading, setReading] = useState({});
  const writingId = "swahili-writing-" + lesson.day;

  return (
    <main className="swahili-book swahili-book--workbook">
      <div className="swahili-book__top">
        <span className="swahili-book__brand">Falowen · Kiswahili</span>
        <Link to={preview ? "/swahili" : "/campus/course"}>← Course Book</Link>
      </div>
      <header className="swahili-book__hero">
        <p className="swahili-book__eyebrow">KISWAHILI · A1</p>
        <h1>{lesson.chapter} · {lesson.title}</h1>
        <p>{lesson.objective}</p>
      </header>
      <WorkbookTabNav activeTab={activeTab} onChange={selectTab} tabs={tabs}
        ariaLabel={lesson.chapter + " workbook sections"} renderLegacyGrammarPanel={false} />
      <section className="swahili-book__card swahili-book__activity" role="tabpanel" tabIndex={-1}>
        {activeTab === "references" && <>
          <h2>Music · Muziki</h2>
          <p>No song is available for this chapter yet.</p>
        </>}
        {activeTab === "grammar" && <>
          <h2>Sarufi · {lesson.grammar}</h2>
          <p>{lesson.rule}</p>
          <div className="swahili-book__grid">
            {lesson.examples.map(({ swahili, english }) => (
              <div className="swahili-book__tile" key={swahili}>
                <strong lang="sw">{swahili}</strong>
                <div className="swahili-book__small">{english}</div>
              </div>
            ))}
          </div>
          <GrammarSelfCheck questionId={"swahili-grammar-" + lesson.day} item={lesson.check} />
        </>}
        {activeTab === "sprechen" && <>
          <h2>Teil 1 · Kuzungumza (Speaking)</h2>
          <p>{lesson.speaking}</p>
          <p>Use the examples in Grammar to prepare your first exchange, then try again with different details.</p>
        </>}
        {activeTab === "schreiben" && <>
          <h2>Teil 2 · Kuandika (Writing)</h2>
          <p>{lesson.writing.prompt}</p>
          <label className="swahili-book__form" htmlFor={writingId}>Your practice answer
            <textarea id={writingId} rows={5} value={writing} onChange={(event) => setWriting(event.target.value)} />
          </label>
        </>}
        {activeTab === "lesen" && <>
          <h2>Teil 3 · Kusoma (Reading)</h2>
          <p className="swahili-book__tile" lang="sw">{lesson.reading.text}</p>
          <div className="swahili-book__form">
            {lesson.reading.questions.map(({ question }, index) => (
              <label key={question}>{index + 1}. {question}
                <input value={reading[question] || ""}
                  onChange={(event) => setReading((prior) => ({ ...prior, [question]: event.target.value }))} />
              </label>
            ))}
          </div>
        </>}
        {activeTab === "hoeren" && <>
          <h2>Teil 4 · Kusikiliza (Listening)</h2>
          <p>The listening recording and questions will appear here after upload.</p>
        </>}
        {activeTab === "submit" && <>
          <h2>Answer Sheet · Majibu</h2>
          <p>Compare your practice with the model answers. Answers entered here stay on this page until you reload or leave the chapter.</p>
          <details className="swahili-book__tile">
            <summary>Teil 2 · Model writing</summary>
            <p>{lesson.writing.prompt}</p>
            {writing.trim() && <p><strong>Your answer:</strong> {writing}</p>}
            <p><strong>Model answer:</strong> {lesson.writing.model}</p>
          </details>
          <details className="swahili-book__tile">
            <summary>Teil 3 · Reading answers</summary>
            <ol>{lesson.reading.questions.map(({ question, answer }) => (
              <li key={question}>
                <strong>{question}</strong>
                {reading[question]?.trim() && <div>Your answer: {reading[question]}</div>}
                <div>Model answer: {answer}</div>
              </li>
            ))}</ol>
          </details>
        </>}
      </section>
      <SwahiliWorkbookNavigation tabs={tabs} activeTab={activeTab} onChange={selectTab} />
    </main>
  );
}
