import WorkbookDayMusic from './WorkbookDayMusic';
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db, doc, getDoc, serverTimestamp, setDoc } from "../firebase";
import { A2_B1_WORKBOOK_TABS_WITH_GRAMMAR, WorkbookTabNav } from "./StandardWorkbookComponents";
import { SWAHILI_DAY_ONE } from "../data/swahili/dayOne";
import SwahiliDictionary from "./SwahiliDictionary";
import SwahiliWorkbookRadio from "./SwahiliWorkbookRadio";
import SwahiliTeacherDayOne from "./SwahiliTeacherDayOne";
import SwahiliCourseOverview from "./SwahiliCourseOverview";
import { useSwahiliWorkbookTab, SwahiliWorkbookNavigation } from "./SwahiliWorkbookNavigation";
import { getCurrentSwahiliReview } from "../utils/swahiliWorkbookReview";
import { canSubmitSwahiliWorkbook } from "../utils/campusProgram";
import "./SwahiliCourseBook.css";

const LETTERS = ["A", "E", "I", "O", "U"];
const TABS = A2_B1_WORKBOOK_TABS_WITH_GRAMMAR;
const TAB_DESCRIPTIONS = {
  references: "Hiari",
  grammar: "Matamshi",
  sprechen: "Kuzungumza",
  schreiben: "Kuandika",
  lesen: "Kusoma",
  hoeren: "Kusikiliza",
  submit: "Wasilisha",
};
const EMPTY_WRITING = { vowels: "", syllables: "", words: "" };

export const scoreListeningAnswers = (answers) =>
  SWAHILI_DAY_ONE.listening.reduce(
    (total, item, index) => total + (answers[index] === item.answer ? 1 : 0),
    0
  );

export const scoreReadingAnswers = (answers) =>
  SWAHILI_DAY_ONE.reading.reduce(
    (total, item) => total + (answers[item.id] === item.answer ? 1 : 0),
    0
  );

export const getMissingSwahiliDayOneWork = ({ writing, readingAnswers }) => {
  const missing = [];
  if (!String(writing?.vowels || "").trim()) missing.push("Teil 2 · Vokali");
  if (!String(writing?.syllables || "").trim()) missing.push("Teil 2 · Silabi");
  if (!String(writing?.words || "").trim()) missing.push("Teil 2 · Maneno");
  if (!SWAHILI_DAY_ONE.reading.every((question) => Boolean(readingAnswers?.[question.id]))) {
    missing.push("Teil 3 · Kusoma");
  }
  // Teil 1 is teacher-led; Teil 4 is optional until the instructor provides listening audio.
  return missing;
};

function DayOneContent({
  activeTab,
  writing,
  setWriting,
  readingAnswers,
  setReadingAnswers,
  readingChecked,
  setReadingChecked,
  listeningAnswers,
  setListeningAnswers,
  listeningChecked,
  setListeningChecked,
  user,
  canSubmit,
  submitting,
  submissionResult,
  submitWork,
  previouslySubmitted,
  teacherReview,
}) {
  const lesson = SWAHILI_DAY_ONE;
  const changeWriting = (field, value) => setWriting((prior) => ({ ...prior, [field]: value }));

  if (activeTab === "references") return (
    <section className="swahili-book__card swahili-book__activity" aria-label="Music">
      <h2>Music · Muziki wa Somo la 1</h2>
      <WorkbookDayMusic level="SWAHILI" day={1} compact />
    </section>
  );

  if (activeTab === "grammar") return (
    <section className="swahili-book__card swahili-book__activity" aria-label="Grammar">
      <div>
        <h2>Grammar · Sarufi na matamshi</h2>
        <p className="swahili-book__prompt">{lesson.objective}</p>
      </div>
      <div>
        <h2>Vokali tano · A E I O U</h2>
        <p>Sikiliza, rudia, na linganisha vokali na maneno.</p>
        <div className="swahili-book__grid">
          {lesson.vowels.map((item) => (
            <div className="swahili-book__tile" key={item.letter}>
              <div className="swahili-book__letter">{item.letter}</div>
              <strong>{item.word}</strong>
              <div className="swahili-book__small">{item.meaning}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2>Silabi · Kuunganisha konsonanti na vokali</h2>
        <div className="swahili-book__grid">
          {lesson.syllables.map((item) => (
            <div className="swahili-book__tile" key={item.stem}>
              <strong>{item.stem}</strong>
              <p>{item.forms}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2>Miunganiko ya herufi</h2>
        <div className="swahili-book__grid">
          {lesson.combinations.map((item) => (
            <div className="swahili-book__tile" key={item.letters}>
              <strong>{item.letters}</strong> · {item.word}
              <div className="swahili-book__small">{item.meaning}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2>Mkazo wa neno</h2>
        <p>Kwa kawaida, mkazo huwa kwenye silabi ya pili kutoka mwisho. Silabi yenye herufi kubwa ina mkazo.</p>
        <p><strong>{lesson.stress.join(" · ")}</strong></p>
      </div>
      <p className="swahili-book__note">Mwalimu asome tofauti za sauti: ng / ng’ · s / sh · t / th.</p>
      <details>
        <summary>Msamiati wa Somo la 1 · Day 1 vocabulary</summary>
        <SwahiliDictionary />
      </details>
    </section>
  );

  if (activeTab === "sprechen") return (
    <section className="swahili-book__card swahili-book__activity" aria-label="Teil 1">
      <h2>Teil 1 · Kuzungumza (Speaking)</h2>
      <p><strong>Rudia baada ya mwalimu.</strong> Tamka polepole, kisha jaribu bila kusoma.</p>
      <ol>
        <li>A · E · I · O · U, halafu U · O · I · E · A.</li>
        <li>ba · be · bi · bo · bu.</li>
        <li>cha · che · chi · cho · chu.</li>
        <li>MA-ma · ra-FI-ki · mwa-LI-mu.</li>
        <li>chai · shule · nyanya · ng’ombe.</li>
      </ol>
      <p className="swahili-book__note">Katika jozi, mwanafunzi mmoja asome, mwenzake arudie. Mwalimu arekebishe matamshi. Sehemu hii ni mazoezi ya darasani, si kazi ya kuandika.</p>
    </section>
  );

  if (activeTab === "schreiben") return (
    <section className="swahili-book__card swahili-book__activity" aria-label="Teil 2">
      <h2>Teil 2 · Kuandika (Writing)</h2>
      <p>Andika vokali tano, silabi tano za B na maneno matatu kutoka somo. Majibu haya yataonekana kwenye Submit.</p>
      <div className="swahili-book__form">
        <label htmlFor="swahili-vowels">1. Vokali tano
          <input id="swahili-vowels" value={writing.vowels} onChange={(e) => changeWriting("vowels", e.target.value)} placeholder="A, E, I, O, U" />
        </label>
        <label htmlFor="swahili-syllables">2. Silabi za B
          <input id="swahili-syllables" value={writing.syllables} onChange={(e) => changeWriting("syllables", e.target.value)} placeholder="ba, be, bi, bo, bu" />
        </label>
        <label htmlFor="swahili-words">3. Maneno matatu
          <textarea id="swahili-words" rows={3} value={writing.words} onChange={(e) => changeWriting("words", e.target.value)} placeholder="mama, kiti, kuku" />
        </label>
      </div>
      <p className="swahili-book__note">Andika mwenyewe. Majibu yanabaki kwenye ukurasa huu mpaka uwasilishe; usifunge ukurasa kabla ya kuwasilisha.</p>
    </section>
  );

  if (activeTab === "lesen") return (
    <section className="swahili-book__card swahili-book__activity" aria-label="Teil 3">
      <h2>Teil 3 · Kusoma (Reading)</h2>
      <p>Soma na tambua maneno. Kisha jibu maswali manne mafupi.</p>
      <div className="swahili-book__grid">
        {lesson.vowels.map((item) => (
          <div className="swahili-book__tile" key={item.word}>
            <strong>{item.word}</strong>
            <div className="swahili-book__small">{item.meaning}</div>
          </div>
        ))}
      </div>
      <div className="swahili-book__quiz">
        {lesson.reading.map((item, index) => (
          <div className="swahili-book__exercise" key={item.id}>
            <fieldset>
              <legend>{index + 1}. {item.question}</legend>
              <div className="swahili-book__choices">
                {item.choices.map((choice) => (
                  <label className="swahili-book__choice" key={choice}>
                    <input type="radio" name={"swahili-reading-" + item.id}
                      checked={readingAnswers[item.id] === choice}
                      onChange={() => { setReadingAnswers((prior) => ({ ...prior, [item.id]: choice })); setReadingChecked(false); }} />
                    {choice}
                  </label>
                ))}
              </div>
            </fieldset>
            {readingChecked ? <span className="swahili-book__small">{readingAnswers[item.id] === item.answer ? "Sahihi ✓" : "Jaribu tena"}</span> : null}
          </div>
        ))}
      </div>
      <div className="swahili-book__row">
        <button type="button" className="swahili-book__button"
          disabled={lesson.reading.some((item) => !readingAnswers[item.id])}
          onClick={() => setReadingChecked(true)}>Kagua majibu</button>
        {readingChecked ? <p className="swahili-book__result" role="status">{scoreReadingAnswers(readingAnswers)} / {lesson.reading.length} sahihi</p> : null}
      </div>
    </section>
  );

  if (activeTab === "hoeren") return (
    <section className="swahili-book__card swahili-book__activity" aria-label="Teil 4">
      <h2>Teil 4 · Kusikiliza (Listening)</h2>
      <p>Mwalimu aseme neno moja moja. Chagua vokali inayojirudia katika kila neno; kisha kagua majibu yako.</p>
      <p className="swahili-book__note">Sauti iliyorekodiwa bado haijapatikana. Kwa sasa mwalimu atasoma maneno. Hii ni sehemu ya mazoezi ya hiari mpaka sauti itakapopakiwa.</p>
      <div className="swahili-book__quiz">
        {lesson.listening.map((item, index) => (
          <div className="swahili-book__quizItem" key={item.word}>
            <label htmlFor={"swahili-listen-" + index}>Neno la {index + 1}</label>
            <select id={"swahili-listen-" + index} value={listeningAnswers[index] || ""}
              onChange={(event) => { setListeningAnswers((prior) => ({ ...prior, [index]: event.target.value })); setListeningChecked(false); }}>
              <option value="">Chagua vokali</option>
              {LETTERS.map((vowel) => <option key={vowel} value={vowel}>{vowel}</option>)}
            </select>
            {listeningChecked ? <span className="swahili-book__small">{listeningAnswers[index] === item.answer ? "Sahihi ✓" : "Jaribu tena"}</span> : null}
          </div>
        ))}
      </div>
      <div className="swahili-book__row">
        <button type="button" className="swahili-book__button"
          disabled={lesson.listening.some((item, index) => !listeningAnswers[index])}
          onClick={() => setListeningChecked(true)}>Kagua majibu</button>
        {listeningChecked ? <p className="swahili-book__result" role="status">{scoreListeningAnswers(listeningAnswers)} / {lesson.listening.length} sahihi · mazoezi tu</p> : null}
      </div>
      <details>
        <summary>Kwa mwalimu: maneno ya kusoma</summary>
        <p>{lesson.listening.map((item) => item.word).join(" · ")}</p>
      </details>
    </section>
  );

  const missing = getMissingSwahiliDayOneWork({ writing, readingAnswers });
  const isReady = missing.length === 0;
  return (
    <section className="swahili-book__card swahili-book__activity" aria-label="Submit">
      <h2>Submit · Wasilisha kazi ya Somo la 1</h2>
      <p>Kagua majibu yako kabla ya kuwasilisha. Teil 1 ni mazoezi ya darasani. Teil 4 ni ya hiari mpaka rekodi itakapopakiwa.</p>
      <ul className="swahili-book__submit-summary">
        <li>Teil 2 · Vokali: <strong>{writing.vowels || "Bado"}</strong></li>
        <li>Teil 2 · Silabi: <strong>{writing.syllables || "Bado"}</strong></li>
        <li>Teil 2 · Maneno: <strong>{writing.words || "Bado"}</strong></li>
        <li>Teil 3 · Kusoma: <strong>{lesson.reading.filter((item) => readingAnswers[item.id]).length} / {lesson.reading.length} majibu</strong></li>
        <li>Teil 4 · Kusikiliza: <strong>{Object.values(listeningAnswers).filter(Boolean).length} / {lesson.listening.length} majibu (hiari)</strong></li>
      </ul>
      {missing.length ? <p className="swahili-book__note" role="status">Kamilisha kwanza: {missing.join(" · ")}</p> : null}
      {!canSubmit ? (
        <p className="swahili-book__note">Ingia kwenye akaunti yako ya Falowen ya Kiswahili na ufungue Campus ili kuwasilisha. This public preview cannot submit work. <Link to="/login">Ingia</Link></p>
      ) : (
        <>
          <button className="swahili-book__button" type="button"
            onClick={submitWork} disabled={!isReady || submitting || !db}>
            {submitting ? "Inahifadhi..." : previouslySubmitted ? "Wasilisha tena" : "Wasilisha kazi"}
          </button>
          {submissionResult?.type === "success" ? (
            <p className="swahili-book__feedback" role="status">Kazi imehifadhiwa kwenye akaunti yako ya Falowen. Hakuna alama za moja kwa moja.</p>
          ) : null}
          {submissionResult?.type === "error" ? <p className="swahili-book__error" role="alert">{submissionResult.message}</p> : null}
          {teacherReview && <div className="swahili-book__tile" role="status">
            <strong>Maoni ya mwalimu · Teacher feedback</strong>
            <p>{teacherReview.status === "needs_revision" ? "Needs revision" : "Reviewed"}</p>
            {teacherReview.feedback && <p>{teacherReview.feedback}</p>}
          </div>}
          <p className="swahili-book__note">Kazi hii inahifadhiwa kwenye akaunti yako. Mwalimu anaweza kukagua na kutoa maoni; hakuna alama za moja kwa moja.</p>
        </>
      )}
    </section>
  );
}

export default function SwahiliCourseBook({ day = null, basePath = "/swahili", preview = false }) {
  const { user, studentProfile } = useAuth();
  const location = useLocation();
  const role = String(studentProfile?.role || "").toLowerCase();
  const isTeacher = ["admin", "staff", "tutor"].includes(role) || studentProfile?.isTutor === true;
  const teacherView = day === 1 && new URLSearchParams(location.search).get("teacher") === "1";
  const [activeTab, setActiveTab] = useSwahiliWorkbookTab(TABS);
  const [writing, setWriting] = useState(EMPTY_WRITING);
  const [readingAnswers, setReadingAnswers] = useState({});
  const [readingChecked, setReadingChecked] = useState(false);
  const [listeningAnswers, setListeningAnswers] = useState({});
  const [listeningChecked, setListeningChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [previouslySubmitted, setPreviouslySubmitted] = useState(false);
  const [teacherReview, setTeacherReview] = useState(null);
  const [submissionVersion, setSubmissionVersion] = useState(0);
  const lesson = SWAHILI_DAY_ONE;
  const canSubmit = canSubmitSwahiliWorkbook({ user, studentProfile, preview });

  useEffect(() => {
    setTeacherReview(null);
    if (day !== 1 || activeTab !== "submit" || !canSubmit || !db) return undefined;
    let active = true;
    Promise.allSettled([
      getDoc(doc(db, "users", user.uid, "swahiliLessons", "day-1")),
      getDoc(doc(db, "swahiliTeacherReviews", user.uid)),
    ]).then(([work, feedback]) => {
      if (!active) return;
      const submission = work.status === "fulfilled" && work.value.exists() ? work.value : null;
      const review = feedback.status === "fulfilled" && feedback.value.exists() ? feedback.value.data() : null;
      setPreviouslySubmitted(Boolean(submission));
      setTeacherReview(getCurrentSwahiliReview(submission?.data(), review));
    });
    return () => { active = false; };
  }, [activeTab, day, user?.uid, canSubmit, submissionVersion]);

  const submitWork = async () => {
    if (!canSubmit || !db || submitting) return;
    if (getMissingSwahiliDayOneWork({ writing, readingAnswers }).length) return;
    setSubmitting(true);
    setSubmissionResult(null);
    try {
      await setDoc(doc(db, "users", user.uid, "swahiliLessons", "day-1"), {
        userId: user.uid,
        studentId: user.uid,
        program: "swahili",
        level: "beginner",
        day: 1,
        lessonId: "swahili-day-1",
        title: lesson.title,
        status: "submitted",
        writing: { ...writing },
        readingAnswers: { ...readingAnswers },
        listeningAnswers: { ...listeningAnswers },
        listeningTeacherLed: true,
        studentName: studentProfile?.name || studentProfile?.displayName || user?.displayName || "",
        studentEmail: user?.email || "",
        submittedAt: serverTimestamp(),
      }, { merge: true });
      setPreviouslySubmitted(true);
      setTeacherReview(null);
      setSubmissionVersion((version) => version + 1);
      setSubmissionResult({ type: "success" });
    } catch (error) {
      setSubmissionResult({ type: "error", message: "Imeshindikana kuhifadhi kazi. Kagua muunganisho wako na ujaribu tena." });
    } finally {
      setSubmitting(false);
    }
  };

  if (!day) return <SwahiliCourseOverview basePath={basePath} preview={preview} uid={user?.uid} />;

  if (teacherView) {
    return isTeacher
      ? <SwahiliTeacherDayOne basePath={basePath} />
      : <main className="swahili-book"><p className="swahili-book__note">Teacher access required. <Link to={basePath + "/day-1"}>Return to Day 1</Link></p></main>;
  }

  return (
    <SwahiliWorkbookRadio lesson={lesson} preview={preview}>
    <main className="swahili-book swahili-book--workbook" lang="sw" data-swahili-course-book="true">
      <div className="swahili-book__top">
        <div className="swahili-book__brand">Falowen · Kiswahili</div>
        <Link className="swahili-book__link" to={preview ? basePath : "/campus/course"}>← Rudi kwenye kitabu cha kozi</Link>
      </div>
      <header className="swahili-book__hero">
        <p className="swahili-book__eyebrow">KISWAHILI · KIWANGO CHA MWANZO</p>
        <h1>{lesson.chapter} · {lesson.title}</h1>
        <p>{lesson.objective}</p>
        <div className="swahili-book__meta">
          <span>Somo la 1</span><span>Alfabeti na matamshi</span><span>Music · Grammar · Teil 1–4 · Submit</span>
        </div>
      </header>
      {isTeacher && <p className="swahili-book__spaced"><Link className="swahili-book__button swahili-book__button--soft" to={basePath + "/day-1?teacher=1"}>Teacher slides & marking</Link></p>}
      <div className="swahili-book__workbook-nav">
        <WorkbookTabNav activeTab={activeTab} onChange={setActiveTab}
          tabs={TABS} ariaLabel="Kiswahili Day 1 workbook sections"
          renderLegacyGrammarPanel={false} tabDescriptionOverrides={TAB_DESCRIPTIONS} />
      </div>
      <div role="tabpanel" tabIndex={-1} aria-label={TABS.find((tab) => tab.key === activeTab)?.label}>
        <DayOneContent
          activeTab={activeTab} writing={writing} setWriting={(updater) => { setWriting(updater); setSubmissionResult(null); }}
          readingAnswers={readingAnswers} setReadingAnswers={(updater) => { setReadingAnswers(updater); setSubmissionResult(null); }}
          readingChecked={readingChecked} setReadingChecked={setReadingChecked}
          listeningAnswers={listeningAnswers} setListeningAnswers={(updater) => { setListeningAnswers(updater); setSubmissionResult(null); }}
          listeningChecked={listeningChecked} setListeningChecked={setListeningChecked}
          user={user} canSubmit={canSubmit} submitting={submitting} submissionResult={submissionResult}
          submitWork={submitWork} previouslySubmitted={previouslySubmitted} teacherReview={teacherReview} />
      </div>
      <p className="swahili-book__muted swahili-book__spaced">Mazoezi haya ni ya kiwango cha mwanzo. {preview ? "Huu ni mfano wa kitabu cha kozi." : ""}</p>
      <SwahiliWorkbookNavigation tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
    </main>
    </SwahiliWorkbookRadio>
  );
}
