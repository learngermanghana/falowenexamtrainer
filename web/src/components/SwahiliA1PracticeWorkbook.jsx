import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { A2_B1_WORKBOOK_TABS_WITH_GRAMMAR, WorkbookTabNav } from "./StandardWorkbookComponents";
import WorkbookDayMusic from "./WorkbookDayMusic";
import { GrammarSelfCheck } from "./MgahawaniGrammarPractice";
import { useSwahiliWorkbookTab, SwahiliWorkbookNavigation } from "./SwahiliWorkbookNavigation";
import { db, doc, serverTimestamp, setDoc } from "../firebase";
import { canSubmitSwahiliWorkbook } from "../utils/campusProgram";
import SwahiliReviewDraft, { SwahiliFinalSubmit, useSwahiliReviewDraft } from "./SwahiliReviewDraft";
import "./SwahiliCourseBook.css";

const tabs = A2_B1_WORKBOOK_TABS_WITH_GRAMMAR.map((tab) =>
  tab.key === "submit" ? { ...tab, label: "Receive & Submit", description: "Review and submit your work" } : tab);

export default function SwahiliA1PracticeWorkbook({ lesson, preview = false }) {
  const { user, studentProfile } = useAuth();
  const tutorMarked = lesson.practiceOnly === false;
  const reviewLabel = tutorMarked ? "Review & Submit" : "Receive & Submit";
  const workbookTabs = tutorMarked ? tabs.map(tab => tab.key === "submit" ? { ...tab, label: reviewLabel } : tab) : tabs;
  const canSubmit = tutorMarked && canSubmitSwahiliWorkbook({ user, studentProfile, preview });
  const [activeTab, selectTab] = useSwahiliWorkbookTab(workbookTabs);
  const [writing, setWriting] = useState("");
  const [reading, setReading] = useState({});
  const [listeningAnswers, setListeningAnswers] = useState({});
  const [audio, setAudio] = useState({ url: "", loading: false, error: "" });
  const { aiLecture, listening } = lesson;
  const lectureHeadingId = `swahili-ai-lecture-${lesson.day}`;
  const grammarSections = lesson.grammarSections || [{ rule: lesson.rule, examples: lesson.examples }];
  const vocabulary = lesson.vocabulary;
  const writingId = "swahili-writing-" + lesson.day;

  const [submission, setSubmission] = useState("idle");
  const [submittedAnswers, setSubmittedAnswers] = useState("");
  const answers = { writing, reading, listeningAnswers };
  const restoreDraft = useCallback(draft => {
    setWriting(typeof draft.writing === "string" ? draft.writing : "");
    setReading(draft.reading || {});
    setListeningAnswers(draft.listeningAnswers || {});
  }, []);
  const draft = useSwahiliReviewDraft(canSubmit ? user.uid : null, lesson.day, answers, restoreDraft);
  const snapshot = JSON.stringify(answers);
  const submitted = submittedAnswers === snapshot;
  const complete = tutorMarked && writing.trim() &&
    lesson.reading.questions.every(({ id, choices }) => choices.includes(reading[id])) &&
    listening.questions.every(({ id, choices }) => choices.includes(listeningAnswers[id]));

  async function submitWork() {
    if (!canSubmit || !complete || !db || submitted || submission === "sending") return;
    setSubmission("sending");
    try {
      await setDoc(doc(db, "users", user.uid, "swahiliLessons", `day-${lesson.day}`), {
        studentId: user.uid, userId: user.uid, program: "swahili", level: "A1",
        day: lesson.day, lessonId: `swahili-day-${lesson.day}`, title: lesson.title,
        status: "submitted", writing: { dialogue: writing.trim() }, readingAnswers: reading,
        listeningAnswers, listeningTeacherLed: false, submittedAt: serverTimestamp(),
        studentName: studentProfile?.name || studentProfile?.displayName || user.displayName || "",
        studentEmail: user.email || "",
      });
      setSubmittedAnswers(snapshot);
      setSubmission("idle");
    } catch {
      setSubmission("error");
    }
  }

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
      <WorkbookTabNav activeTab={activeTab} onChange={selectTab} tabs={workbookTabs}
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
          <label className="swahili-book__form" htmlFor={writingId}>{tutorMarked ? "Your writing answer" : "Your practice answer"}
            <textarea id={writingId} rows={5} value={writing} onChange={(event) => setWriting(event.target.value)} />
          </label>
          <p className="swahili-book__note">When you finish, open {reviewLabel} to review your work.</p>
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
                        checked={reading[id || question] === choice}
                        onChange={() => setReading(prior => ({ ...prior, [id || question]: choice }))} />
                      {choice}
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : (
              <label key={question}>{index + 1}. {question}
                <input value={reading[question] || ""}
                  onChange={(event) => setReading((prior) => ({ ...prior, [question]: event.target.value }))} />
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
              {reviewLabel} · Review your answers
            </button>
          </> : <p>The listening recording and questions will appear here after upload.</p>}
        </>}
        {activeTab === "submit" && tutorMarked && <>
          <h2>Review &amp; Submit · Wasilisha</h2>
          <SwahiliReviewDraft writing={{ Mazungumzo: writing }} questions={lesson.reading.questions}
            reading={reading} listening={listeningAnswers} listeningQuestions={listening.questions}
            draft={canSubmit ? draft : null} />
          {canSubmit ? <>
            {!complete && <p>Complete your writing and all five reading and five listening questions before submitting.</p>}
            <SwahiliFinalSubmit requireListening disabled={!complete || !db || submission === "sending" || submitted} onSubmit={submitWork}>
              {submission === "sending" ? "Submitting…" : "Wasilisha kazi · Submit to tutor"}
            </SwahiliFinalSubmit>
            {submitted && <p role="status">Submitted for tutor review. <Link to="/campus/results">View results</Link></p>}
            {submission === "error" && <p role="alert">Submission failed. Your answers are still here. Please try again.</p>}
          </> : <p>Open this lesson in your signed-in Kiswahili Campus to submit.</p>}
        </>}
        {activeTab === "submit" && !tutorMarked && <>
          <h2>Receive &amp; Submit · Wasilisha</h2>
          <p>Your completed work is collected here for review. This lesson is practice-only, so it is not sent to a tutor or saved as a marked assignment.</p>
          <details className="swahili-book__tile">
            <summary>Teil 2 · Review your writing</summary>
            <p>{lesson.writing.prompt}</p>
            {writing.trim() && <p><strong>Your answer:</strong> {writing}</p>}
            <p><strong>Model answer:</strong> {lesson.writing.model}</p>
          </details>
          <details className="swahili-book__tile">
            <summary>Teil 3 · Review your reading</summary>
            <ol>{lesson.reading.questions.map(({ question, answer }) => (
              <li key={question}>
                <strong>{question}</strong>
                {reading[question]?.trim() && <div>Your answer: {reading[question]}</div>}
                <div>Suggested answer: {answer}</div>
              </li>
            ))}</ol>
          </details>
          {listening && <details className="swahili-book__tile">
            <summary>Teil 4 · Review your listening</summary>
            <ol lang="sw">{listening.questions.map(({ id, question, answer }) => (
              <li key={id}>
                <strong>{question}</strong>
                {listeningAnswers[id] && <div>Your answer: {listeningAnswers[id]}</div>}
                <div>Suggested answer: {answer}</div>
              </li>
            ))}</ol>
          </details>}
        </>}
      </section>
      <SwahiliWorkbookNavigation tabs={workbookTabs} activeTab={activeTab} onChange={selectTab} />
    </main>
  );
}
