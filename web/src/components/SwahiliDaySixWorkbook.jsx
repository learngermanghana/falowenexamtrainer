import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db, doc, getDoc } from "../firebase";
import { saveSwahiliWorkbook } from "../services/swahiliWorkbookService";
import { A2_B1_WORKBOOK_TABS_WITH_GRAMMAR, WorkbookTabNav } from "./StandardWorkbookComponents";
import MgahawaniGrammar from "./MgahawaniGrammar";
import MgahawaniSong from "./MgahawaniSong";
import { SWAHILI_DAY_SIX } from "../data/swahili/daySix";
import SwahiliWorkbookRadio from "./SwahiliWorkbookRadio";
import SwahiliTeacherDayOne from "./SwahiliTeacherDayOne";
import { useSwahiliWorkbookTab, SwahiliWorkbookNavigation } from "./SwahiliWorkbookNavigation";
import SwahiliReviewDraft, { SwahiliFinalSubmit, useSwahiliReviewDraft } from "./SwahiliReviewDraft";
import { getCurrentSwahiliReview } from "../utils/swahiliWorkbookReview";
import { canSubmitSwahiliWorkbook } from "../utils/campusProgram";
import "./SwahiliCourseBook.css";

const TABS = A2_B1_WORKBOOK_TABS_WITH_GRAMMAR.map((tab) =>
  tab.key === "submit" ? { ...tab, label: "Review & Submit" } : tab);
const TAB_DESCRIPTIONS = {
  references: "Muziki", grammar: "Sarufi", sprechen: "Kuzungumza",
  schreiben: "Kuandika", lesen: "Kusoma", hoeren: "Kusikiliza", submit: "Wasilisha",
};
const INITIAL_WRITING = { likes: "", dislikes: "", order: "" };
export function getMissingSwahiliDaySixWork({ writing, readingAnswers, listeningAnswers }) {
  const missing = [];
  if (!String(writing?.likes || "").trim()) missing.push("Teil 2 · Ninapenda");
  if (!String(writing?.dislikes || "").trim()) missing.push("Teil 2 · Sipendi");
  if (!String(writing?.order || "").trim()) missing.push("Teil 2 · Agizo");
  if (!SWAHILI_DAY_SIX.reading.every(({ id }) => readingAnswers?.[id])) missing.push("Teil 3 · Kusoma");
  if (!SWAHILI_DAY_SIX.listening.every(({ id }) => listeningAnswers?.[id])) missing.push("Teil 4 · Kusikiliza");
  return missing;
}

function Dialogue({ lines, label }) {
  return <div className="swahili-book__dialogue" aria-label={label}>
    {lines.map(({ speaker, text }, i) => <p key={speaker + i}><strong>{speaker}:</strong> {text}</p>)}
  </div>;
}

function QuestionSet({ items, answers, onChange, namePrefix, showChoiceLetters = false }) {
  return <div className="swahili-book__quiz">
    {items.map((item, i) => (
      <div className="swahili-book__exercise" key={item.id}>
        <fieldset>
          <legend>{i + 1}. {item.question}</legend>
          <div className="swahili-book__choices">
            {item.choices.map((choice, choiceIndex) => <label className="swahili-book__choice" key={choice}>
              <input type="radio" name={namePrefix + "-" + item.id}
                checked={answers[item.id] === choice} onChange={() => onChange(item.id, choice)} />{showChoiceLetters ? `${String.fromCharCode(65 + choiceIndex)}) ` : ""}{choice}
            </label>)}
          </div>
        </fieldset>
      </div>
    ))}
  </div>;
}

export default function SwahiliDaySixWorkbook({ basePath = "/swahili", preview = false }) {
  const { user, studentProfile } = useAuth();
  const location = useLocation();
  const role = String(studentProfile?.role || "").toLowerCase();
  const isTeacher = ["admin", "staff", "tutor"].includes(role) || studentProfile?.isTutor === true;
  const teacherView = new URLSearchParams(location.search).get("teacher") === "1";
  const lesson = SWAHILI_DAY_SIX;
  const canSubmit = canSubmitSwahiliWorkbook({ user, studentProfile, preview });
  const [activeTab, setActiveTab] = useSwahiliWorkbookTab(TABS);
  const [writing, setWriting] = useState(INITIAL_WRITING);
  const [readingAnswers, setReadingAnswers] = useState({});
  const [listeningAnswers, setListeningAnswers] = useState({});
  const [listeningAudio, setListeningAudio] = useState({ url: "", loading: false, error: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [previouslySubmitted, setPreviouslySubmitted] = useState(false);
  const [teacherReview, setTeacherReview] = useState(null);
  const [submissionVersion, setSubmissionVersion] = useState(0);
  const restoreDraft = useCallback((saved) => {
    if (saved.writing) setWriting(saved.writing);
    if (saved.readingAnswers) setReadingAnswers(saved.readingAnswers);
    if (saved.listeningAnswers) setListeningAnswers(saved.listeningAnswers);
  }, []);
  const draft = useSwahiliReviewDraft(canSubmit ? user?.uid : null, 6,
    { writing, readingAnswers, listeningAnswers }, restoreDraft);

  useEffect(() => {
    setTeacherReview(null);
    if (activeTab !== "submit" || !canSubmit || !db) return undefined;
    let active = true;
    Promise.allSettled([
      getDoc(doc(db, "users", user.uid, "swahiliLessons", "day-6")),
      getDoc(doc(db, "swahiliTeacherReviews", `${user.uid}_day-6`)),
    ]).then(([work, feedback]) => {
      if (!active) return;
      const submission = work.status === "fulfilled" && work.value.exists() ? work.value : null;
      const review = feedback.status === "fulfilled" && feedback.value.exists() ? feedback.value.data() : null;
      const previous = submission?.data();
      if (previous) {
        setWriting(current => Object.values(current).some(Boolean) ? current : previous.writing || current);
        setReadingAnswers(current => Object.keys(current).length ? current : previous.readingAnswers || current);
        setListeningAnswers(current => Object.keys(current).length ? current : previous.listeningAnswers || current);
      }
      setPreviouslySubmitted(Boolean(submission));
      setTeacherReview(getCurrentSwahiliReview(submission?.data(), review));
    });
    return () => { active = false; };
  }, [activeTab, user?.uid, canSubmit, submissionVersion]);

  const setAnswer = (setter, id, value) => {
    setter(old => ({ ...old, [id]: value }));
    setSubmissionResult(null);
  };
  const changeWriting = (key, value) => {
    setWriting(old => ({ ...old, [key]: value }));
    setSubmissionResult(null);
  };
  const missing = getMissingSwahiliDaySixWork({ writing, readingAnswers, listeningAnswers });

  async function loadListeningAudio() {
    if (listeningAudio.loading) return;
    if (!user?.getIdToken) {
      setListeningAudio({ url: "", loading: false, error: "Ingia kwenye akaunti yako ili kusikiliza sauti. Sign in to play the recording." });
      return;
    }
    setListeningAudio(current => ({ ...current, loading: true, error: "" }));
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/course-media/swahili/a1/day-6/audio-url", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok || !result?.url) throw new Error(result?.error || "Could not load the listening recording.");
      setListeningAudio({ url: result.url, loading: false, error: "" });
    } catch (error) {
      setListeningAudio({ url: "", loading: false, error: error.message || "Could not load the listening recording." });
    }
  }

  async function submitWork() {
    if (!canSubmit || !db || submitting || missing.length) return;
    setSubmitting(true);
    setSubmissionResult(null);
    try {
      await saveSwahiliWorkbook(user, {
        studentId: user.uid,
        userId: user.uid,
        program: "swahili",
        level: "A1",
        day: 6,
        lessonId: "swahili-day-6",
        title: lesson.title,
        status: "submitted",
        writing: { ...writing },
        readingAnswers: { ...readingAnswers },
        listeningAnswers: { ...listeningAnswers },
        listeningTeacherLed: false,
        studentName: studentProfile?.name || studentProfile?.displayName || user.displayName || "",
        studentEmail: user.email || "",
        
      });
      setPreviouslySubmitted(true);
      setTeacherReview(null);
      setSubmissionVersion((version) => version + 1);
      setSubmissionResult({ type: "success" });
    } catch {
      setSubmissionResult({ type: "error", message: "Imeshindikana kuhifadhi kazi. Kagua muunganisho wako na ujaribu tena." });
    } finally {
      setSubmitting(false);
    }
  }

  function section() {
    if (activeTab === "references") return <MgahawaniSong />;
    if (activeTab === "grammar") return <MgahawaniGrammar />;
    if (activeTab === "sprechen") return <section className="swahili-book__card swahili-book__activity" aria-label="Teil 1">
      <div className="mgahawani-workbook__section-header"><span>01 · PRACTISE WITH A PARTNER</span><h2>Teil 1 · Kuzungumza (Speaking)</h2><p>From likes and dislikes to a complete restaurant order.</p></div>
      <p><strong>Hatua ya 1: Mapendeleo.</strong> Read the conversation between Amani and Furaha with a partner.</p>
      <Dialogue lines={lesson.preferenceDialogue} label="Amani and Furaha: food and drink preferences" />
      <p><strong>Hatua ya 2: Mgahawani.</strong> Take turns as Mhudumu (server) and Mteja (customer).</p>
      <Dialogue lines={lesson.restaurantDialogue} label="Mhudumu and Mteja: ordering in a restaurant" />
      <p className="swahili-book__note">Scenario from the source: you are in an East African restaurant with friends. Read the menu and tell the server what you like and want to order. Switch roles and ask follow-up questions: “Unapenda chakula gani?” and “Unapenda kunywa nini?”</p>
    </section>;
    if (activeTab === "schreiben") return <section className="swahili-book__card swahili-book__activity" aria-label="Teil 2">
      <div className="mgahawani-workbook__section-header"><span>02 · WRITE</span><h2>Teil 2 · Kuandika (Writing)</h2><p>Use the patterns from Grammar to write your own answers.</p></div>
      <p>Use Ruth's sentence models. Write your own preferences and an order, using the foods and drinks above.</p>
      <div className="swahili-book__form">
        <label htmlFor="swahili-six-likes">1. Ninapenda... · What food and drink do you like?
          <textarea id="swahili-six-likes" rows={2} value={writing.likes} onChange={e => changeWriting("likes", e.target.value)} placeholder="Ninapenda..." />
        </label>
        <label htmlFor="swahili-six-dislikes">2. Sipendi... · What food or drink do you dislike?
          <textarea id="swahili-six-dislikes" rows={2} value={writing.dislikes} onChange={e => changeWriting("dislikes", e.target.value)} placeholder="Sipendi..." />
        </label>
        <label htmlFor="swahili-six-order">3. Agizo · What would you say as the restaurant customer?
          <textarea id="swahili-six-order" rows={3} value={writing.order} onChange={e => changeWriting("order", e.target.value)} placeholder="Mimi ninapenda kula...\nMimi ninapenda kunywa..." />
        </label>
      </div>
      <p className="swahili-book__note">The prompts are workbook adaptations of the supplied PDFs. Answers stay in this page until Submit; no automatic grading.</p>
    </section>;
    if (activeTab === "lesen") return <section className="swahili-book__card swahili-book__activity" aria-label="Teil 3">
      <div className="mgahawani-workbook__section-header"><span>03 · READ AND UNDERSTAND</span><h2>Teil 3 · Kusoma (Reading)</h2><p>Soma hadithi ya Amina na ujibu maswali matano. Read Amina's story and answer the five questions.</p></div>
      <article className="swahili-book__tile" aria-label="Hadithi ya Amina" lang="sw">
        <h3>Amina Mgahawani</h3>
        {lesson.readingPassage.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </article>
      <h3>Maswali ya Ufahamu · Comprehension Questions</h3>
      <QuestionSet items={lesson.reading} answers={readingAnswers} showChoiceLetters
        namePrefix="swahili-six-reading" onChange={(id,v) => setAnswer(setReadingAnswers,id,v)} />
    </section>;
    if (activeTab === "hoeren") return <section className="swahili-book__card swahili-book__activity" aria-label="Teil 4">
      <div className="mgahawani-workbook__section-header"><span>04 · LISTEN</span><h2>Teil 4 · Kusikiliza (Listening)</h2><p>Listen to the restaurant conversation and answer all five questions.</p></div>
      <p className="swahili-book__note">Sikiliza sauti mara mbili, kisha ujibu maswali. Listen twice before selecting your answers.</p>
      <div className="swahili-book__tile">
        <strong>{lesson.listeningAudio.title}</strong>
        <p><button type="button" className="swahili-book__button swahili-book__button--soft" onClick={loadListeningAudio} disabled={listeningAudio.loading}>
          {listeningAudio.loading ? "Inapakia sauti..." : listeningAudio.url ? "Pakia sauti tena · Refresh audio" : "▶ Sikiliza sauti · Load audio"}
        </button></p>
        {listeningAudio.url && <audio aria-label="Mgahawani Day 6 listening recording" controls preload="none" src={listeningAudio.url} style={{ width: "100%", maxWidth: 640 }} />}
        {listeningAudio.error && <p className="swahili-book__error" role="alert">{listeningAudio.error}</p>}
      </div>
      <QuestionSet items={lesson.listening} answers={listeningAnswers}
        namePrefix="swahili-six-listening" onChange={(id,v) => setAnswer(setListeningAnswers,id,v)} />
    </section>;
    return <section className="swahili-book__card swahili-book__activity" aria-label="Review & Submit">
      <div className="mgahawani-workbook__section-header"><span>05 · REVIEW YOUR WORK</span><h2>Review &amp; Submit · Somo la 6</h2><p>Check your writing, reading and listening answers before submission.</p></div>
      <p>Teil 1 is spoken classroom practice. Complete Parts 2, 3 and the new recorded listening exercise in Teil 4 before submission.</p>
      <SwahiliReviewDraft writing={{ Ninapenda: writing.likes, Sipendi: writing.dislikes, Agizo: writing.order }} questions={lesson.reading} reading={readingAnswers}
        listening={listeningAnswers} listeningQuestions={lesson.listening} draft={canSubmit ? draft : null} />
      {missing.length > 0 && <p className="swahili-book__note" role="status">Kamilisha kwanza: {missing.join(" · ")}</p>}
      {!canSubmit ? <p className="swahili-book__note">Ingia kwenye akaunti yako ya Falowen ya Kiswahili kupitia Campus ili kuwasilisha. This preview cannot submit work. <Link to="/login">Ingia</Link></p> :
        <><SwahiliFinalSubmit requireListening disabled={!!missing.length || submitting || !db || submissionResult?.type === "success"} onSubmit={submitWork}>
          {submitting ? "Inahifadhi..." : previouslySubmitted ? "Wasilisha tena" : "Wasilisha kazi"}
        </SwahiliFinalSubmit>
        {submissionResult?.type === "success" && <p className="swahili-book__feedback" role="status">Kazi ya Somo la 6 imehifadhiwa kwenye akaunti yako. Imetumwa kwa mwalimu kwa ukaguzi.</p>}
        {submissionResult?.type === "error" && <p className="swahili-book__error" role="alert">{submissionResult.message}</p>}
        {teacherReview && <div className="swahili-book__tile" role="status">
          <strong>Maoni ya mwalimu · Teacher feedback</strong>
          <p>{teacherReview.status === "needs_revision" ? "Needs revision" : "Reviewed"}</p>
          {teacherReview.feedback && <p>{teacherReview.feedback}</p>}
        </div>}
        <p className="swahili-book__note">Your teacher can review this lesson after submission. There is no automatic grade.</p></>}
    </section>;
  }

  if (teacherView) return isTeacher
    ? <SwahiliTeacherDayOne basePath={basePath} day={6} />
    : <main className="swahili-book"><p className="swahili-book__note">Teacher access required. <Link to={basePath + "/day-6"}>Return to Lesson 6</Link></p></main>;

  return <SwahiliWorkbookRadio lesson={lesson} preview={preview}>
    <main className="swahili-book swahili-book--workbook mgahawani-workbook" lang="sw" data-swahili-course-book="true">
    <div className="swahili-book__top"><strong>Falowen · Kiswahili A1</strong><Link to={preview ? basePath : "/campus/course"}>← Kitabu cha kozi</Link></div>
    <header className="swahili-book__hero">
      <p className="swahili-book__eyebrow">KISWAHILI · A1 · SOMO LA 6</p>
      <h1>{lesson.chapter} · {lesson.title}</h1>
      <p className="mgahawani-workbook__hero-goal">{lesson.objective}</p>
      <div className="swahili-book__meta"><span>Topic 4 · Mgahawani</span><span>Lesson 6</span><span>Music · Grammar · Teil 1–4 · Submit</span></div>
    </header>
    <section className="swahili-book__tile" aria-labelledby="day-six-ai-lecture">
      <h2 id="day-six-ai-lecture">{lesson.aiLecture.title}</h2>
      <iframe title={lesson.aiLecture.title} loading="lazy" allowFullScreen
        style={{ width: "100%", aspectRatio: "16 / 9", border: 0 }}
        src={`https://www.youtube-nocookie.com/embed/${lesson.aiLecture.youtubeId}`} />
      <a href={`https://youtu.be/${lesson.aiLecture.youtubeId}`} target="_blank" rel="noreferrer">Tazama kwenye YouTube</a>
    </section>
    {isTeacher && <p className="swahili-book__spaced"><Link className="swahili-book__button swahili-book__button--soft" to={basePath + "/day-6?teacher=1"}>Teacher review · Somo la 6</Link></p>}
    <div className="mgahawani-workbook__intro" aria-label="Lesson pathway">
      <div><strong>Learn</strong><span>Polite requests, prices, numbers and -ni</span></div>
      <div><strong>Practise</strong><span>Restaurant dialogues, reading and writing</span></div>
      <div><strong>Apply</strong><span>Place a food order and submit your work</span></div>
    </div>
    <div className="swahili-book__workbook-nav">
      <WorkbookTabNav activeTab={activeTab} onChange={setActiveTab} tabs={TABS}
        ariaLabel="Kiswahili A1 Lesson 6 workbook sections"
        renderLegacyGrammarPanel={false} tabDescriptionOverrides={TAB_DESCRIPTIONS}/>
    </div>
    <div role="tabpanel" tabIndex={-1} aria-label={TABS.find(tab => tab.key === activeTab)?.label}>{section()}</div>
    <p className="swahili-book__muted swahili-book__spaced">Practice material based on Ruth's two restaurant lessons. {preview ? "Public preview of this workbook." : ""}</p>
    {canSubmit && ["schreiben", "lesen", "hoeren"].includes(activeTab) && (
      <button type="button" className="swahili-book__button" onClick={() => { draft.saveDraft(); setActiveTab("submit"); }}>
        Save &amp; Review
      </button>
    )}
    <SwahiliWorkbookNavigation tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
    </main>
  </SwahiliWorkbookRadio>;
}
