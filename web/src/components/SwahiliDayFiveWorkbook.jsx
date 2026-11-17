import React, { useState } from "react";
import WorkbookDayMusic from "./WorkbookDayMusic";
import SwahiliWorkbookRadio from "./SwahiliWorkbookRadio";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GrammarSelfCheck } from "./MgahawaniGrammarPractice";
import { SWAHILI_DAY_FIVE as lesson, FAMILY_GRAMMAR, FAMILY_LISTENING, FAMILY_RADIO_GAPS, FAMILY_RADIO_CHOICES, FAMILY_RADIO_WRITING_TOPICS, FAMILY_READING, FAMILY_WRITING_MODEL } from "../data/swahili/dayFive";
import { A2_B1_WORKBOOK_TABS_WITH_GRAMMAR as tabs, WorkbookTabNav } from "./StandardWorkbookComponents";
import { useSwahiliWorkbookTab, SwahiliWorkbookNavigation } from "./SwahiliWorkbookNavigation";
import "./SwahiliCourseBook.css";

export default function SwahiliDayFiveWorkbook({ preview = false }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useSwahiliWorkbookTab(tabs);
  const [writing, setWriting] = useState("");
  const [readingAnswers, setReadingAnswers] = useState({});
  const [listeningAnswers, setListeningAnswers] = useState({});
  const [radioGaps, setRadioGaps] = useState({});
  const [radioChoices, setRadioChoices] = useState({});
  const [audio, setAudio] = useState({ url: "", loading: false, error: "" });

  async function loadListeningAudio() {
    if (audio.loading) return;
    if (!user?.getIdToken) {
      setAudio({ url: "", loading: false, error: "Sign in to play the recording." });
      return;
    }
    setAudio(current => ({ ...current, loading: true, error: "" }));
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/course-media/swahili/a1/day-5/audio-url", {
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
    <SwahiliWorkbookRadio lesson={lesson} preview={preview}>
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
      <WorkbookTabNav activeTab={activeTab} onChange={setActiveTab}
        tabs={tabs} ariaLabel="Kiswahili Day 5 workbook sections" renderLegacyGrammarPanel={false} />
      <section className="swahili-book__card swahili-book__activity" role="tabpanel" tabIndex={-1}>
        {activeTab === "references" && <>
          <WorkbookDayMusic level="A1" day={lesson.day} program="swahili" compact />
          <p>Follow the lyrics and spot a family word and a possessive. Say your own family phrase aloud using the same pattern.</p>
        </>}
        {activeTab === "grammar" && <>
          <h2>Sarufi · Grammar</h2>
          <p>Learn how to introduce family members, say whose they are, and ask about their names and work.</p>
          {FAMILY_GRAMMAR.map(({ id, title, rule, examples, check }, index) => (
            <details className="swahili-book__tile" key={id} open={index === 0}>
              <summary>{title}</summary>
              <p>{rule}</p>
              <ul>{examples.map((example) => <li key={example}>{example}</li>)}</ul>
              <GrammarSelfCheck questionId={"day-five-" + id} item={check} />
            </details>
          ))}
          <details className="swahili-book__tile">
            <summary>Msamiati · Family words</summary>
            <p>mama · mother, baba · father, kaka · brother, dada · sister, wazazi · parents, ndugu · sibling or relative</p>
          </details>
          {lesson.aiLecture ? <a href={lesson.aiLecture}>Watch AI lecture</a> : <p>The video lecture will appear here after upload.</p>}
        </>}
        {activeTab === "sprechen" && <>
          <h2>Teil 1 · Kuzungumza (Speaking)</h2>
          <p>Work in pairs. Introduce a real or fictional family member. Your partner asks their name and one question about your family, then you swap roles.</p>
          <div className="swahili-book__tile">
            <p><strong>A</strong> Huyu ni kaka yangu.</p>
            <p><strong>B</strong> Anaitwa nani?</p>
            <p><strong>A</strong> Anaitwa Juma.</p>
            <p><strong>B</strong> Una ndugu wangapi?</p>
            <p><strong>A</strong> Nina ndugu watatu.</p>
          </div>
        </>}
        {activeTab === "schreiben" && <>
          <h2>Teil 2 · Kuandika (Writing)</h2>
          <p><strong>9. Andika kuhusu familia yako kwa sentensi zisizopungua saba.</strong> Write at least seven sentences about your family.</p>
          <p>Unaweza kujumuisha · You can include:</p>
          <ul>{FAMILY_RADIO_WRITING_TOPICS.map(topic => <li key={topic}>{topic}</li>)}</ul>
          <p>Start with <strong>Familia yangu ni …</strong> or <strong>Katika familia yangu kuna …</strong>. You may use fictional details.</p>
          <p>Your practice answer stays on this page until you reload or leave the lesson.</p>
          <label className="swahili-book__form" htmlFor="family-writing">Your practice answer
            <textarea id="family-writing" rows={9} value={writing} onChange={(event) => setWriting(event.target.value)} />
          </label>
          
        </>}
        {activeTab === "lesen" && <>
          <h2>Teil 3 · Kusoma (Reading)</h2>
          <p>Read about Asha’s family. Record your answers, then review them in Receive & Submit.</p>
          <p className="swahili-book__tile">{FAMILY_READING.text}</p>
          <ol>{FAMILY_READING.questions.map(({ question }) => <li key={question}>{question}</li>)}</ol>
          
        </>}
        {activeTab === "submit" && <>
          <h2>Wasilisha · Submit</h2>
          <p>Day 5 is practice only. Review your work and suggested answers here; nothing is sent to a tutor.</p>
          <details className="swahili-book__tile"><summary>Review model writing</summary><p>{FAMILY_WRITING_MODEL}</p>{writing && <p><strong>Your answer:</strong> {writing}</p>}</details>
          <details className="swahili-book__tile"><summary>Review reading answers</summary><ol>{FAMILY_READING.questions.map(({ question, answer }) => <li key={question}><strong>{question}</strong>{readingAnswers[question] && <div>Your answer: {readingAnswers[question]}</div>}<div>Suggested answer: {answer}</div></li>)}</ol></details>
          <div className="swahili-book__row">
            <button type="button" className="swahili-book__button" onClick={() => setActiveTab("schreiben")}>Edit writing</button>
            <button type="button" className="swahili-book__button" onClick={() => setActiveTab("lesen")}>Edit reading</button>
            <button type="button" className="swahili-book__button" onClick={() => setActiveTab("hoeren")}>Edit listening</button>
          </div>
        </>}
        {activeTab === "hoeren" && <>
          <h2>Teil 4 · Kusikiliza (Listening)</h2>
          <h3>Falowen Radio · Familia Yangu</h3>
          <p>Sikiliza kipindi hiki mara mbili. Listen to the Falowen Radio episode, then complete A and B.</p>
          <a href={`https://youtu.be/${lesson.radio.youtubeId}`} target="_blank" rel="noreferrer">
            Play Familia Yangu on YouTube
          </a>
          <h3>A. Jaza nafasi · Fill in the blanks</h3>
          <div className="swahili-book__quiz" lang="sw">
            {FAMILY_RADIO_GAPS.map(({ id, question }, index) => (
              <fieldset className="swahili-book__exercise" key={id}>
                <legend>{index + 1}. {question}</legend>
                <input
                  aria-label={`Answer for question ${index + 1}`}
                  type="text"
                  autoComplete="off"
                  value={radioGaps[id] || ""}
                  onChange={event => setRadioGaps(current => ({ ...current, [id]: event.target.value }))}
                />
              </fieldset>
            ))}
          </div>
          <h3>B. Chagua jibu sahihi · Multiple choice</h3>
          <div className="swahili-book__quiz" lang="sw">
            {FAMILY_RADIO_CHOICES.map(({ id, question, choices }, index) => (
              <fieldset className="swahili-book__exercise" key={id}>
                <legend>{index + 5}. {question}</legend>
                <div className="swahili-book__choices">
                  {choices.map((choice, optionIndex) => (
                    <label className="swahili-book__choice" key={choice}>
                      <input type="radio" name={`family-radio-${id}`} value={choice}
                        checked={radioChoices[id] === choice}
                        onChange={() => setRadioChoices(current => ({ ...current, [id]: choice }))} />
                      {String.fromCharCode(97 + optionIndex)}) {choice}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
          <details className="swahili-book__tile">
            <summary>Receive &amp; Submit · Review Falowen Radio answers</summary>
            <ol lang="sw">
              {FAMILY_RADIO_GAPS.map(({ id, answer }) => <li key={id}>{answer}</li>)}
              {FAMILY_RADIO_CHOICES.map(({ id, answer, choices }) => (
                <li key={id}>{String.fromCharCode(97 + choices.indexOf(answer))}) {answer}</li>
              ))}
            </ol>
          </details>
          <h3>Mazungumzo yaliyorekodiwa · Additional listening practice</h3>
          <p>For the separate Day 5 recorded conversation, listen twice and select one answer per question.</p>
          <button type="button" className="swahili-book__button swahili-book__button--soft"
            onClick={loadListeningAudio} disabled={audio.loading}>
            {audio.loading ? "Inapakia sauti…" : audio.url ? "Pakia sauti tena · Refresh audio" : "Sikiliza sauti · Load audio"}
          </button>
          {audio.url && <audio controls preload="none" src={audio.url} aria-label="Familia yangu Day 5 listening recording" />}
          {audio.error && <p className="swahili-book__error" role="alert">{audio.error}</p>}
          <div className="swahili-book__quiz" lang="sw">
            {FAMILY_LISTENING.map(({ id, question, choices }, index) => (
              <fieldset className="swahili-book__exercise" key={id}>
                <legend>{index + 1}. {question}</legend>
                <div className="swahili-book__choices">
                  {choices.map(choice => (
                    <label className="swahili-book__choice" key={choice}>
                      <input type="radio" name={`day-five-listening-${id}`} value={choice}
                        checked={listeningAnswers[id] === choice}
                        onChange={() => setListeningAnswers(current => ({ ...current, [id]: choice }))} />
                      {choice}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
          <details className="swahili-book__tile">
            <summary>Receive &amp; Submit · Review listening answers</summary>
            <ol lang="sw">
              {FAMILY_LISTENING.map(({ id, answer }) => (
                <li key={id}>{answer}</li>
              ))}
            </ol>
          </details>
        </>}
      </section>
      <SwahiliWorkbookNavigation tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
    </main>
    </SwahiliWorkbookRadio>
  );
}
