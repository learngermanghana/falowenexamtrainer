import { useAuth } from "../context/AuthContext";
import { getStudentMockStorageKey, getA2Mock2StorageKeys, isA2Mock2ReviewReady } from "../utils/mockReviewAccess";
import React, { useEffect, useState } from "react";
import { arrangeMockChoices, mockDisplayAnswer } from "../utils/mockChoicePresentation";
import AppBackButton from "./navigation/AppBackButton";
import { A2_MOCK_2_LESEN, A2_MOCK_2_LESEN_QUESTIONS } from "../data/a2Mock2Lesen";
import "./A2Mock2Lesen.css";

const DURATION = 30 * 60 * 1000;
const KEY = "falowen:a2:mock-02:lesen:v1";
const blank = () => ({ startedAt: null, answers: {}, completedAt: null });
function readState(storageKey) {
  try {
    const stored = JSON.parse(window.localStorage.getItem(storageKey) || "null");
    return stored && typeof stored === "object" ? { ...blank(), ...stored } : blank();
  } catch { return blank(); }
}
const timeLabel = (ms) => {
  const seconds = Math.ceil(Math.max(0, ms) / 1000);
  return String(Math.floor(seconds / 60)).padStart(2, "0") + ":" + String(seconds % 60).padStart(2, "0");
};
function A2Mock2LesenAttempt({ embedded = false, onComplete, reviewReleased = false }) {
  const { user } = useAuth();
  const storageKey = getStudentMockStorageKey(KEY, user?.uid);
  const reveal = (!embedded || reviewReleased) && isA2Mock2ReviewReady(getA2Mock2StorageKeys(user?.uid));
  const [state, setState] = useState(() => { const v = readState(storageKey); return embedded && !v.startedAt ? { ...v, startedAt: Date.now() } : v; });
  const [now, setNow] = useState(Date.now());
  const [active, setActive] = useState(0);
  const deadline = state.startedAt ? state.startedAt + DURATION : null;
  const expired = Boolean(deadline && now >= deadline);
  const finished = Boolean(state.completedAt || expired);
  const answers = state.answers || {};
  const answered = Object.keys(answers).filter(key => answers[key]).length;
  const correct = A2_MOCK_2_LESEN_QUESTIONS.filter(q => answers[q.number] === q.answer).length;

  // Persist the submitted section before the hub reads browser storage to
  // update the completion tracker and open the next module.
  useEffect(() => { window.localStorage.setItem(storageKey, JSON.stringify(state)); }, [state, storageKey]);
  useEffect(() => { if (embedded && finished && state.completedAt && onComplete) onComplete(); }, [embedded, finished, state.completedAt, onComplete]);
  useEffect(() => {
    if (!state.startedAt || state.completedAt) return undefined;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [state.startedAt, state.completedAt]);
  useEffect(() => {
    if (expired && !state.completedAt) setState(current => ({ ...current, completedAt: Date.now() }));
  }, [expired, state.completedAt]);
  const choose = (number, option) => {
    if (finished) return;
    setState(current => ({ ...current, answers: { ...current.answers, [number]: option } }));
  };
  const start = () => { setNow(Date.now()); setState({ ...blank(), startedAt: Date.now() }); setActive(0); };
  const finish = () => { if (window.confirm("Lesen jetzt abgeben? Nicht answerede Aufgaben werden als falsch gewertet.")) setState(current => ({ ...current, completedAt: Date.now() })); };
  const part = A2_MOCK_2_LESEN[active];
  return <main className="a2-mock2-shell" lang="en">
    {!embedded ? <div className="a2-mock2-top"><AppBackButton label="Back to Mock Exams" fallbackPath="/exams/mocks" /><span>A2 · Mock 2 · Lesen</span></div> : null}
    {!state.startedAt ? <section className="a2-mock2-intro">
      <p className="a2-mock2-kicker">Übungstest 2</p><h1>A2 Lesen</h1>
      <p>Vier Teile, 20 Aufgaben. Sie haben 30 Minuten Zeit. Lesen Sie alle Texte und wählen Sie die richtige Antwort.</p>
      <div className="a2-mock2-stat"><span>30 Minuten</span><span>20 Aufgaben</span><span>4 Teile</span></div>
      <p>Your answers are saved on this device. The timer keeps running even if you leave. Correct answers are shown after all four modules are complete.</p>
      <button type="button" className="a2-mock2-primary" onClick={start}>Start reading</button>
    </section> : <>
      <header className="a2-mock2-progress"><div><strong>Mock 2 · Lesen</strong><span>{answered}/20 answered</span></div><strong aria-label="Time remaining">{timeLabel(deadline - now)}</strong></header>
      {!finished ? <>
        <nav className="a2-mock2-nav" aria-label="Prüfungsteile">{A2_MOCK_2_LESEN.map((p,i) => <button type="button" key={p.id} className={active === i ? "selected" : ""} onClick={() => setActive(i)}>Teil {i+1}<small>{p.questions.filter(q=>answers[q.number]).length}/5</small></button>)}</nav>
        <section className="a2-mock2-paper"><p className="a2-mock2-kicker">Teil {active+1} · Aufgaben {active*5+1}–{active*5+5}</p><h2>{part.title}</h2><p>{part.instruction}</p>
          {part.paragraphs?.length ? <article className="a2-mock2-source">{part.paragraphs.map((p,i)=><p key={i}>{p}</p>)}</article> : null}
          {part.ads?.length ? <div className="a2-mock2-ads">{part.ads.map(([id,title,copy])=><article key={id}><strong>Anzeige {id} · {title}</strong><p>{copy}</p></article>)}</div> : null}
          {part.questions.map(q=><fieldset key={q.number} className="a2-mock2-question"><legend><strong>{q.number}.</strong> {q.question}</legend>{(q.options.length ? arrangeMockChoices(q.options, `a2-mock2-lesen-${q.number}`) : ["a","b","c","d","e","f","x"].map(id=>({id,displayId:id,label:id==="x"?"X · Keine passende Anzeige":`Anzeige ${id.toUpperCase()}`}))).map(o=><label key={o.id} className={answers[q.number]===o.id?"selected":""}><input type="radio" name={`lesen-${q.number}`} value={o.id} checked={answers[q.number]===o.id} onChange={()=>choose(q.number,o.id)}/><strong>{o.displayId.toUpperCase()}</strong><span>{o.label}</span></label>)}</fieldset>)}
        </section>
        <footer className="a2-mock2-actions"><button type="button" disabled={active===0} onClick={()=>setActive(v=>v-1)}>Back</button>{active<3?<button type="button" className="a2-mock2-primary" onClick={()=>setActive(v=>v+1)}>Next: Teil {active+2}</button>:<button type="button" className="a2-mock2-primary" onClick={finish}>Submit reading</button>}</footer>
      </> : !reveal ? <p>Reading submitted. Correct answers appear after all four modules are complete.</p> : <section className="a2-mock2-results">
        <p className="a2-mock2-kicker">Auswertung · {expired && !state.completedAt ? "Zeit abgelaufen" : "Abgegeben"}</p><h1>Ihr Lesen-Ergebnis</h1>
        <p className="a2-mock2-score">{correct} / 20 <small>richtig · {Math.round(correct/20*100)}%</small></p>
        <p>Lesen-Punktzahl (von 25): <strong>{(correct/20*25).toFixed(1)}</strong>. Dies ist nur das Lesen-Ergebnis, kein Gesamtergebnis für einen vollständigen Mocktest.</p>
        {A2_MOCK_2_LESEN.map((p,i)=><section key={p.id}><h2>Teil {i+1}</h2>{p.questions.map(q=><div className="a2-mock2-review" key={q.number}><strong>{q.number}. {q.question}</strong><p>Ihre Antwort: {q.options.length ? mockDisplayAnswer(q.options, answers[q.number], `a2-mock2-lesen-${q.number}`) : String(answers[q.number]||"—").toUpperCase()} · Richtige Antwort: {q.options.length ? mockDisplayAnswer(q.options, q.answer, `a2-mock2-lesen-${q.number}`) : q.answer.toUpperCase()} {answers[q.number]===q.answer?"✓":"✗"}</p><p>{q.explanation}</p></div>)}</section>)}
        {!embedded ? <button type="button" className="a2-mock2-primary" onClick={() => { if (window.confirm("Start another attempt? Your saved answers on this device will be replaced.")) start(); }}>Practise again</button> : null}
      </section>}
    </>}
  </main>;
}

// Switching accounts must remount local exam state, not copy the prior answers.
export default function A2Mock2Lesen(props) {
  const { user } = useAuth();
  return <A2Mock2LesenAttempt key={user?.uid || "guest"} {...props} />;
}
