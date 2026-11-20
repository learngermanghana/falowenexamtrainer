import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { A2_B1_WORKBOOK_TABS_WITH_GRAMMAR, WorkbookTabNav } from "./StandardWorkbookComponents";
import WorkbookDayMusic from "./WorkbookDayMusic";
import { GrammarSelfCheck } from "./MgahawaniGrammarPractice";
import { useSwahiliWorkbookTab, SwahiliWorkbookNavigation } from "./SwahiliWorkbookNavigation";
import SwahiliAssignmentReview, { useSwahiliAssignment } from "./SwahiliAssignmentReview";
import "./SwahiliCourseBook.css";

const tabs = A2_B1_WORKBOOK_TABS_WITH_GRAMMAR.map((tab) =>
  tab.key === "submit" ? { ...tab, label: "Review & Submit", description: "Review and submit your work" } : tab);

export default function SwahiliA1PracticeWorkbook({ lesson, preview = false }) {
  const { user } = useAuth();
  const [activeTab, selectTab] = useSwahiliWorkbookTab(tabs);
  const assignment = useSwahiliAssignment(lesson, preview, activeTab, lesson.reading.questions, lesson.listening?.questions);
  const { writing, setWriting, reading, setReading, listeningAnswers, setListeningAnswers } = assignment;
  const [audio, setAudio] = useState({ url: "", loading: false, error: "" });
  const { aiLecture, radio, listening } = lesson;
  const lectureHeadingId = `swahili-ai-lecture-${lesson.day}`;
  const grammarSections = lesson.grammarSections || [{ rule: lesson.rule, examples: lesson.examples }];
  const vocabulary = lesson.vocabulary;
  const writingId = "swahili-writing-" + lesson.day;

  async function loadListeningAudio() {
    if (!listening || audio.loading) return;
    if (!user?.getIdToken) {
      setAudio({ url: "", loading: false, error: "Sign in to play the recording." });
      return;
    }
    setAudio(current => ({ ...current, loading: true, error: "" }));
    try {
      const token = await user.getIdToken();
      const response = await fetch(listening.audioUrlEndpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok || !result?.url) throw new Error(result?.error || "Could not load the listening recording.");
      setAudio({ url: result.url, loading: false, error: "" });
    } catch (error) {
      setAudio(current => ({ ...current, loading: false, error: error.message || "Could not load the listening recording." }));
    }
  }

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
      {aiLecture && (
        <section className="swahili-book__tile" aria-labelledby={lectureHeadingId}>
          <h2 id={lectureHeadingId}>{aiLecture.title}</h2>
          <iframe title={aiLecture.title} loading="lazy" allowFullScreen
            style={{ width: "100%", aspectRatio: "16 / 9", border: 0 }}
            src={`https://www.youtube-nocookie.com/embed/${aiLecture.youtubeId}`} />
          <a href={`https://youtu.be/${aiLecture.youtubeId}`} target="_blank" rel="noreferrer">Tazama kwenye YouTube</a>
        </section>
      )}
      {radio?.youtubeId && (
        <section className="swahili-book__tile" aria-label="Falowen Radio podcast">
          <h2>{radio.title}</h2>
          <p>{radio.instruction}</p>
          <iframe title={radio.title} loading="lazy" allowFullScreen
            style={{ width: "100%", aspectRatio: "16 / 9", border: 0 }}
            src={`https://www.youtube-nocookie.com/embed/${radio.youtubeId}`} />
          <a href={`https://youtu.be/${radio.youtubeId}`} target="_blank" rel="noopener noreferrer">Play Falowen Radio on YouTube</a>
          <p className="swahili-book__note">Falowen Radio is for language practice. Teil 4 has a separate listening recording and assignment questions.</p>
          <button type="button" className="swahili-book__button swahili-book__button--soft"
            onClick={() => selectTab("hoeren")}>Go to Teil 4 · Listening</button>
        </section>
      )}
      <WorkbookTabNav activeTab={activeTab} onChange={selectTab} tabs={tabs}
        ariaLabel={lesson.chapter + " workbook sections"} renderLegacyGrammarPanel={false} />
      <section className="swahili-book__card swahili-book__activity" role="tabpanel" tabIndex={-1}>
        {activeTab === "references" && <>
          <h2>Music · Muziki</h2>
          {lesson.day === 10 ? <WorkbookDayMusic level="A1" day={lesson.day} program="swahili" compact /> : <p>No song is available for this chapter yet.</p>}
        </>}
        {activeTab === "grammar" && <>
          <h2>Sarufi · {lesson.grammar}</h2>
          {grammarSections.map(({ title, rule, examples }) => (
            <section key={title || rule} className="swahili-book__activity">
              {title && <h3>{title}</h3>}
              <p>{rule}</p>
              <div className="swahili-book__grid">
                {examples.map(({ swahili, english }) => (
                  <div className="swahili-book__tile" key={swahili}>
                    <strong lang="sw">{swahili}</strong>
                    <div className="swahili-book__small">{english}</div>
                  </div>
                ))}
              </div>
            </section>
          ))}
          {vocabulary?.length > 0 && (
            <section className="swahili-book__activity">
              <h3>Msamiati · Vocabulary</h3>
              <dl className="swahili-book__grid">
                {vocabulary.map(({ sw, en }) => (
                  <div className="swahili-book__tile" key={sw}>
                    <dt lang="sw"><strong>{sw}</strong></dt>
                    <dd className="swahili-book__small" lang="en">{en}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
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
          <label className="swahili-book__form" htmlFor={writingId}>Your writing answer
            <textarea id={writingId} rows={5} value={writing} onChange={(event) => setWriting(event.target.value)} />
          </label>
          <p className="swahili-book__note">When you finish, open Review &amp; Submit to review your work.</p>
        </>}
        {activeTab === "lesen" && <>
          <h2>Teil 3 · Kusoma (Reading)</h2>
          <div className="swahili-book__tile" lang="sw">
            {lesson.reading.title && <h3>{lesson.reading.title}</h3>}
            {lesson.reading.text.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <div className="swahili-book__form">
            {lesson.reading.questions.map(({ id, question, choices }, index) => choices ? (
              <fieldset className="swahili-book__exercise" key={question}>
                <legend>{index + 1}. {question}</legend>
                <div className="swahili-book__choices">
                  {choices.map(choice => (
                    <label className="swahili-book__choice" key={choice}>
                      <input type="radio" name={`swahili-${lesson.day}-reading-${index}`}
                        checked={reading[id] === choice}
                        onChange={() => setReading(prior => ({ ...prior, [id]: choice }))} />
                      {choice}
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : (
              <label key={question}>{index + 1}. {question}
                <input value={reading[id] || ""}
                  onChange={(event) => setReading((prior) => ({ ...prior, [id]: event.target.value }))} />
              </label>
            ))}
          </div>
        </>}
        {activeTab === "hoeren" && <>
          <h2>Teil 4 · Kusikiliza (Listening)</h2>
          {listening ? <>
            <p>Sikiliza mazungumzo mara mbili. Chagua jibu moja kwa kila swali.</p>
            <button type="button" className="swahili-book__button swahili-book__button--soft"
              onClick={loadListeningAudio} disabled={audio.loading}>
              {audio.loading ? "Inapakia sauti…" : audio.url ? "Pakia sauti tena · Refresh audio" : "Sikiliza sauti · Load audio"}
            </button>
            {audio.url && <audio controls preload="none" src={audio.url} aria-label={lesson.title + " listening recording"} />}
            {audio.error && <p className="swahili-book__error" role="alert">{audio.error}</p>}
            <div className="swahili-book__quiz" lang="sw">
              {listening.questions.map(({ id, question, choices }, index) => (
                <fieldset className="swahili-book__exercise" key={id}>
                  <legend>{index + 1}. {question}</legend>
                  <div className="swahili-book__choices">
                    {choices.map(choice => (
                      <label className="swahili-book__choice" key={choice}>
                        <input type="radio" name={`swahili-${lesson.day}-listening-${id}`}
                          checked={listeningAnswers[id] === choice}
                          onChange={() => setListeningAnswers(current => ({ ...current, [id]: choice }))} />
                        {choice}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
            <button type="button" className="swahili-book__button swahili-book__button--soft" onClick={() => selectTab("submit")}>
              Review &amp; Submit · Review your answers
            </button>
          </> : <p>The listening recording and questions will appear here after upload.</p>}
        </>}
        {activeTab === "submit" && <SwahiliAssignmentReview assignment={assignment} />}
      </section>
      <SwahiliWorkbookNavigation tabs={tabs} activeTab={activeTab} onChange={selectTab} />
    </main>
  );
}
