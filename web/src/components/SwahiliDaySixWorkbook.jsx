import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db, doc, getDoc, serverTimestamp, setDoc } from "../firebase";
import { A2_B1_WORKBOOK_TABS_WITH_GRAMMAR, WorkbookTabNav } from "./StandardWorkbookComponents";
import MgahawaniGrammar from "./MgahawaniGrammar";
import MgahawaniSong from "./MgahawaniSong";
import { SWAHILI_DAY_SIX } from "../data/swahili/daySix";
import SwahiliWorkbookRadio from "./SwahiliWorkbookRadio";
import SwahiliTeacherDayOne from "./SwahiliTeacherDayOne";
import { useSwahiliWorkbookTab, SwahiliWorkbookNavigation } from "./SwahiliWorkbookNavigation";
import "./SwahiliCourseBook.css";

const TABS = A2_B1_WORKBOOK_TABS_WITH_GRAMMAR;
const TAB_DESCRIPTIONS = {
  references: "Muziki", grammar: "Sarufi", sprechen: "Kuzungumza",
  schreiben: "Kuandika", lesen: "Kusoma", hoeren: "Kusikiliza", submit: "Wasilisha",
};
const INITIAL_WRITING = { likes: "", dislikes: "", order: "" };
export function getMissingSwahiliDaySixWork({ writing, readingAnswers }) {
  const missing = [];
  if (!String(writing?.likes || "").trim()) missing.push("Teil 2 · Ninapenda");
  if (!String(writing?.dislikes || "").trim()) missing.push("Teil 2 · Sipendi");
  if (!String(writing?.order || "").trim()) missing.push("Teil 2 · Agizo");
  if (!SWAHILI_DAY_SIX.reading.every(({ id }) => readingAnswers?.[id])) missing.push("Teil 3 · Kusoma");
  return missing;
}

function Dialogue({ lines, label }) {
  return <div className="swahili-book__dialogue" aria-label={label}>
    {lines.map(({ speaker, text }, i) => <p key={speaker + i}><strong>{speaker}:</strong> {text}</p>)}
  </div>;
}

function QuestionSet({ items, answers, onChange, checked, namePrefix }) {
  return <div className="swahili-book__quiz">
    {items.map((item, i) => (
      <div className="swahili-book__exercise" key={item.id}>
        <fieldset>
          <legend>{i + 1}. {item.question}</legend>
          <div className="swahili-book__choices">
            {item.choices.map(choice => <label className="swahili-book__choice" key={choice}>
              <input type="radio" name={namePrefix + "-" + item.id}
                checked={answers[item.id] === choice} onChange={() => onChange(item.id, choice)} />{choice}
            </label>)}
          </div>
        </fieldset>
        {checked && <span className="swahili-book__small">{answers[item.id] === item.answer ? "Sahihi ✓" : "Jaribu tena"}</span>}
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
  const [activeTab, setActiveTab] = useSwahiliWorkbookTab(TABS);
  const [writing, setWriting] = useState(INITIAL_WRITING);
  const [readingAnswers, setReadingAnswers] = useState({});
  const [listeningAnswers, setListeningAnswers] = useState({});
  const [readingChecked, setReadingChecked] = useState(false);
  const [listeningChecked, setListeningChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [previouslySubmitted, setPreviouslySubmitted] = useState(false);
  const [teacherReview, setTeacherReview] = useState(null);
  const checkedUser = useRef(null);

  useEffect(() => {
    if (activeTab !== "submit" || !user?.uid || !db || checkedUser.current === user.uid) return;
    checkedUser.current = user.uid;
    let cancelled = false;
    getDoc(doc(db, "users", user.uid, "swahiliLessons", "day-6"))
      .then(snapshot => { if (!cancelled && snapshot.exists()) setPreviouslySubmitted(true); })
      .catch(() => { /* A failed lookup must not block the lesson. */ });
    getDoc(doc(db, "swahiliTeacherReviews", `${user.uid}_day-6`))
      .then(snapshot => {
        if (!cancelled && snapshot.exists() && snapshot.data().lessonId === "swahili-day-6") setTeacherReview(snapshot.data());
      })
      .catch(() => { /* No published teacher feedback yet. */ });
    return () => { cancelled = true; };
  }, [activeTab, user?.uid]);

  const setAnswer = (setter, id, value, setChecked) => {
    setter(old => ({ ...old, [id]: value }));
    setChecked(false);
    setSubmissionResult(null);
  };
  const changeWriting = (key, value) => {
    setWriting(old => ({ ...old, [key]: value }));
    setSubmissionResult(null);
  };
  const missing = getMissingSwahiliDaySixWork({ writing, readingAnswers });
  const readingCount = lesson.reading.filter(item => readingAnswers[item.id]).length;
  const listeningCount = lesson.listening.filter(item => listeningAnswers[item.id]).length;
  const checkScore = (items, answers) => items.filter(item => answers[item.id] === item.answer).length;

  async function submitWork() {
    if (!user?.uid || !db || submitting || missing.length) return;
    setSubmitting(true);
    setSubmissionResult(null);
    try {
      await setDoc(doc(db, "users", user.uid, "swahiliLessons", "day-6"), {
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
        listeningTeacherLed: true,
        studentName: studentProfile?.name || studentProfile?.displayName || user.displayName || "",
        studentEmail: user.email || "",
        submittedAt: serverTimestamp(),
      }, { merge: true });
      setPreviouslySubmitted(true);
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
      <div className="mgahawani-workbook__section-header"><span>03 · READ AND UNDERSTAND</span><h2>Teil 3 · Kusoma (Reading)</h2><p>Read a menu and find information in a restaurant dialogue.</p></div>
      <p>Read the restaurant menu and the original Mhudumu/Mteja dialogue. Answer the questions using the text.</p>
      <div className="swahili-book__menu">
        <h3>Menyu · Mgahawani</h3><p className="swahili-book__small">Practice menu assembled from the items in the Ordering Food PDF; no prices were supplied.</p>
        <div className="swahili-book__menu-cols"><div><h4>Chakula</h4>{lesson.food.map(item => <p key={item.sw}>{item.sw}</p>)}</div>
        <div><h4>Vinywaji</h4>{lesson.drinks.map(item => <p key={item.sw}>{item.sw}</p>)}</div></div>
      </div>
      <Dialogue lines={lesson.restaurantDialogue} label="Restaurant reading dialogue" />
      <QuestionSet items={lesson.reading} answers={readingAnswers} checked={readingChecked}
        namePrefix="swahili-six-reading" onChange={(id,v) => setAnswer(setReadingAnswers,id,v,setReadingChecked)} />
      <div className="swahili-book__row"><button type="button" className="swahili-book__button"
        disabled={readingCount < lesson.reading.length} onClick={() => setReadingChecked(true)}>Kagua majibu</button>
        {readingChecked && <p role="status" className="swahili-book__result">{checkScore(lesson.reading,readingAnswers)} / {lesson.reading.length} sahihi · mazoezi tu</p>}</div>
    </section>;
    if (activeTab === "hoeren") return <section className="swahili-book__card swahili-book__activity" aria-label="Teil 4">
      <div className="mgahawani-workbook__section-header"><span>04 · LISTEN</span><h2>Teil 4 · Kusikiliza (Listening)</h2><p>Teacher-led listening while recorded audio is pending.</p></div>
      <p className="swahili-book__note">No approved recording yet. The teacher reads the original restaurant dialogue; hide the text while listening. This is optional classroom practice until audio is uploaded.</p>
      <QuestionSet items={lesson.listening} answers={listeningAnswers} checked={listeningChecked}
        namePrefix="swahili-six-listening" onChange={(id,v) => setAnswer(setListeningAnswers,id,v,setListeningChecked)} />
      <div className="swahili-book__row"><button type="button" className="swahili-book__button"
        disabled={listeningCount < lesson.listening.length} onClick={() => setListeningChecked(true)}>Kagua majibu</button>
        {listeningChecked && <p role="status" className="swahili-book__result">{checkScore(lesson.listening,listeningAnswers)} / {lesson.listening.length} sahihi · mazoezi tu</p>}</div>
      <details><summary>Kwa mwalimu · Read the original dialogue aloud</summary><Dialogue lines={lesson.restaurantDialogue} label="Teacher listening script" /></details>
    </section>;
    return <section className="swahili-book__card swahili-book__activity" aria-label="Submit">
      <div className="mgahawani-workbook__section-header"><span>05 · REVIEW YOUR WORK</span><h2>Submit · Wasilisha kazi ya Somo la 6</h2><p>Check your writing and reading answers before submission.</p></div>
      <p>Teil 1 is spoken classroom practice; Teil 4 is optional until an audio recording is supplied. Only writing and reading are required for this submission.</p>
      <ul className="swahili-book__submit-summary">
        <li>Teil 2 · Ninapenda: <strong>{writing.likes ? "Imeandikwa" : "Bado"}</strong></li>
        <li>Teil 2 · Sipendi: <strong>{writing.dislikes ? "Imeandikwa" : "Bado"}</strong></li>
        <li>Teil 2 · Agizo: <strong>{writing.order ? "Imeandikwa" : "Bado"}</strong></li>
        <li>Teil 3 · Kusoma: <strong>{readingCount} / {lesson.reading.length}</strong></li>
        <li>Teil 4 · Kusikiliza: <strong>{listeningCount} / {lesson.listening.length} (hiari)</strong></li>
      </ul>
      {missing.length > 0 && <p className="swahili-book__note" role="status">Kamilisha kwanza: {missing.join(" · ")}</p>}
      {!user ? <p className="swahili-book__note">Ingia kwenye akaunti yako ya Falowen ili kuwasilisha. <Link to="/login">Ingia</Link></p> :
        <><button type="button" className="swahili-book__button" disabled={!!missing.length || submitting || !db} onClick={submitWork}>
          {submitting ? "Inahifadhi..." : previouslySubmitted ? "Wasilisha tena" : "Wasilisha kazi"}
        </button>
        {submissionResult?.type === "success" && <p className="swahili-book__feedback" role="status">Kazi ya Somo la 6 imehifadhiwa kwenye akaunti yako. Hakuna alama za moja kwa moja.</p>}
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
    <SwahiliWorkbookNavigation tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
    </main>
  </SwahiliWorkbookRadio>;
}
