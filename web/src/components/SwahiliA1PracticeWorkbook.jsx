import React from "react";
import { useSwahiliSignedAudio } from "../hooks/useSwahiliSignedAudio";
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
  const { aiLecture, radio, listening } = lesson;
  const {audio,setAudio,loadAudio:loadListeningAudio} = useSwahiliSignedAudio(user,listening?.audioUrlEndpoint,{signIn:"Sign in to play the recording.",failed:"Could not load the listening recording."});
  const lectureHeadingId = `swahili-ai-lecture-${lesson.day}`;
  const grammarSections = lesson.grammarSections || [{ rule: lesson.rule, examples: lesson.examples }];
  const hasLessonSong = [2, 10, 11, 12].includes(lesson.day);
  const vocabulary = lesson.vocabulary;
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
      {aiLecture && aiLecture.placement !== "grammar" && (
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
          {hasLessonSong && <WorkbookDayMusic level="A1" day={lesson.day} program="swahili" hideLegacyNotes compact />}
          {lesson.referencePractice ? <div className="swahili-day2-practice">
            <div className="swahili-day2-practice__header"><h3>{lesson.referencePractice.heading}</h3><p>{lesson.referencePractice.instruction}</p></div>
            <div className="swahili-day2-practice__phrases">{lesson.referencePractice.phrases.map(item => <div key={item.swahili}><strong lang="sw">{item.swahili}</strong><span>{item.english}</span></div>)}</div>
            <button type="button" className="swahili-book__button" onClick={() => selectTab("sprechen")}>Go to Group Practice</button>
          </div> : !hasLessonSong && <p>No song is available for this chapter yet.</p>}
        </>}
        {activeTab === "grammar" && <>
          <h2>Sarufi · {lesson.grammar}</h2>
          {aiLecture?.placement === "grammar" && <section className="swahili-book__tile" aria-labelledby={lectureHeadingId}>
            <h3 id={lectureHeadingId}>{aiLecture.title}</h3>
            <iframe title={aiLecture.title} loading="lazy" allowFullScreen
              style={{ width: "100%", aspectRatio: "16 / 9", border: 0 }}
              src={`https://www.youtube-nocookie.com/embed/${aiLecture.youtubeId}`} />
            <a href={`https://youtu.be/${aiLecture.youtubeId}`} target="_blank" rel="noreferrer">Tazama kwenye YouTube</a>
          </section>}
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
        {activeTab === "sprechen" && (lesson.groupPractice ? <div className="swahili-day2-practice">
          <header className="swahili-day2-practice__header"><span className="swahili-day2-practice__eyebrow">TEIL 1 · GROUP PRACTICE</span><h2>{lesson.groupPractice.heading || "Kuzungumza · Salamu na kujitambulisha"}</h2><p>{lesson.groupPractice.intro || "Practise together. Change partners and swap roles after every conversation."}</p></header>
          <div className="swahili-day2-practice__steps" aria-label="Group practice stages">
            {lesson.groupPractice.stages.map((stage, index) => <article className="swahili-day2-practice__step" key={stage.title}>
              <span className="swahili-day2-practice__number">{index + 1}</span><div><h3>{stage.title}</h3><p>{stage.instruction}</p></div>
            </article>)}
          </div>
          <section className="swahili-day2-practice__model"><p className="swahili-day2-practice__eyebrow">MFANO · SPEAKING SUPPORT</p><h3>Sentensi za kusaidia · Useful phrases</h3>
            <div className="swahili-day2-practice__phrases">{lesson.groupPractice.phrases.map(item => <div key={item.swahili}><strong lang="sw">{item.swahili}</strong><span>{item.english}</span></div>)}</div>
          </section>
          <div className="swahili-day2-practice__challenge"><strong>Jaribio la kikundi · Group challenge</strong><p>{lesson.groupPractice.challenge}</p></div>
          <button type="button" className="swahili-book__button" onClick={() => selectTab("schreiben")}>Next: Teil 2 · Schreiben</button>
        </div> : <>
          <h2>Teil 1 · Kuzungumza (Speaking)</h2>
          <p>{lesson.speaking}</p>
          <p>Use the examples in Grammar to prepare your first exchange, then try again with different details.</p>
        </>)}
        {activeTab === "schreiben" && (lesson.writing.guide ? <div className="swahili-day2-practice">
          <header className="swahili-day2-practice__header"><span className="swahili-day2-practice__eyebrow">TEIL 2 · SCHREIBEN</span><h2>{lesson.writing.guide.heading || "Kuandika · Mazungumzo ya salamu"}</h2><p>{lesson.writing.prompt}</p></header>
          <div className="swahili-day2-practice__writing-grid">
            <section className="swahili-day2-practice__task"><h3>Kazi yako · Your task</h3><ol>{lesson.writing.guide.steps.map(step => <li key={step}>{step}</li>)}</ol></section>
            <section className="swahili-day2-practice__task swahili-day2-practice__task--hint"><h3>Maneno muhimu · Phrase bank</h3><div className="swahili-day2-practice__hint-list">{lesson.writing.guide.phrases.map(phrase => <span key={phrase} lang="sw">{phrase}</span>)}</div><p>Use your own names and responses. These are hints, not a completed answer.</p></section>
          </div>
          <div className="swahili-day2-practice__editor"><div className="swahili-day2-practice__editor-heading"><label htmlFor={writingId}>Jibu lako · Your writing</label><span aria-live="polite">{writing.trim() ? writing.trim().split(/\s+/).length : 0} words</span></div>
            <textarea id={writingId} rows={9} placeholder={lesson.writing.guide.placeholder} value={writing} onChange={(event) => setWriting(event.target.value)} />
            <p>Write at least {lesson.writing.guide.minimumLines || 4} lines. Your response stays in your assignment draft until you submit it.</p>
          </div>
          <div className="swahili-day2-practice__footer"><span>Ready? Review your answer and the Lesen/Hören tasks before sending to your tutor.</span><button type="button" className="swahili-book__button" onClick={() => selectTab("submit")}>Review &amp; Submit</button></div>
        </div> : <>
          <h2>Teil 2 · Kuandika (Writing)</h2>
          <p>{lesson.writing.prompt}</p>
          <label className="swahili-book__form" htmlFor={writingId}>Your writing answer
            <textarea id={writingId} rows={5} value={writing} onChange={(event) => setWriting(event.target.value)} />
          </label>
          <p className="swahili-book__note">When you finish, open Review &amp; Submit to review your work.</p>
        </>)}
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
            {listening.teacherLed ? <div className="swahili-book__note"><p>Teacher-led listening: ask your teacher or partner to read the dialogue twice. Audio recording not yet supplied.</p><details><summary>Transcript for teacher / self-study</summary><p style={{whiteSpace:"pre-wrap"}}>{listening.transcript}</p></details></div> : <><button type="button" className="swahili-book__button swahili-book__button--soft"
              onClick={loadListeningAudio} disabled={audio.loading}>
              {audio.loading ? "Inapakia sauti…" : audio.url ? "Pakia sauti tena · Refresh audio" : "Sikiliza sauti · Load audio"}
            </button>
            {audio.url && <audio controls preload="none" src={audio.url} aria-label={lesson.title + " listening recording"} />}
            {audio.error && <p className="swahili-book__error" role="alert">{audio.error}</p>}</>}
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
