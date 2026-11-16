import React, { useState } from "react";
import WorkbookDayMusic from "./WorkbookDayMusic";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GrammarSelfCheck } from "./MgahawaniGrammarPractice";
import { SWAHILI_DAY_FIVE as lesson, FAMILY_GRAMMAR, FAMILY_READING, FAMILY_WRITING_MODEL } from "../data/swahili/dayFive";
import { A2_B1_WORKBOOK_TABS_WITH_GRAMMAR as tabs, WorkbookTabNav } from "./StandardWorkbookComponents";
import { useSwahiliWorkbookTab, SwahiliWorkbookNavigation } from "./SwahiliWorkbookNavigation";
import "./SwahiliCourseBook.css";

export default function SwahiliDayFiveWorkbook({ preview = false }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useSwahiliWorkbookTab(tabs);
  const [writing, setWriting] = useState("");
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
          <p>Introduce three family members in 5–7 short sentences. Give each person’s name and say what one person does or likes to do. You can use fictional names.</p>
          <p>Start with <strong>Huyu ni …</strong> and <strong>Anaitwa …</strong>. Add a sentence with <strong>anapenda …</strong> or <strong>yeye ni …</strong>.</p>
          <p>Your practice answer stays on this page until you reload or leave the lesson.</p>
          <label className="swahili-book__form" htmlFor="family-writing">Your practice answer
            <textarea id="family-writing" rows={5} value={writing} onChange={(event) => setWriting(event.target.value)} />
          </label>
          <details><summary>Show model answer</summary><p>{FAMILY_WRITING_MODEL}</p></details>
        </>}
        {activeTab === "lesen" && <>
          <h2>Teil 3 · Kusoma (Reading)</h2>
          <p>Read about Asha’s family. Find the sentence that supports each answer before checking the answer sheet.</p>
          <p className="swahili-book__tile">{FAMILY_READING.text}</p>
          <ol>{FAMILY_READING.questions.map(({ question }) => <li key={question}>{question}</li>)}</ol>
          <details><summary>Show reading answer sheet</summary>
            <ol>{FAMILY_READING.questions.map(({ question, answer }) => <li key={question}>{answer}</li>)}</ol>
          </details>
        </>}
        {activeTab === "submit" && <>
          <h2>Wasilisha · Submit</h2>
          <p>Day 5 is practice only. Compare your work with the model answers in Teil 2 and Teil 3.</p>
          <div className="swahili-book__row">
            <button type="button" className="swahili-book__button" onClick={() => setActiveTab("schreiben")}>Review writing</button>
            <button type="button" className="swahili-book__button" onClick={() => setActiveTab("lesen")}>Review reading</button>
          </div>
        </>}
        {activeTab === "hoeren" && <>
          <h2>Teil 4 · Kusikiliza (Listening)</h2>
          <p>Sikiliza sauti mara mbili. Listen to the recording twice.</p>
          <button type="button" className="swahili-book__button swahili-book__button--soft"
            onClick={loadListeningAudio} disabled={audio.loading}>
            {audio.loading ? "Inapakia sauti…" : audio.url ? "Pakia sauti tena · Refresh audio" : "Sikiliza sauti · Load audio"}
          </button>
          {audio.url && <audio controls preload="none" src={audio.url} aria-label="Familia yangu Day 5 listening recording" />}
          {audio.error && <p className="swahili-book__error" role="alert">{audio.error}</p>}
        </>}
      </section>
      <SwahiliWorkbookNavigation tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
    </main>
  );
}
