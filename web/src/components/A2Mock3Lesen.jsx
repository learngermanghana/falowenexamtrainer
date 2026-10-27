import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AppBackButton from "./navigation/AppBackButton";
import { getA2Mock3StorageKeys } from "../utils/mockReviewAccess";
import { A2_MOCK_3_LESEN as PARTS } from "../data/a2Mock3Lesen";
import "./A2Mock2Lesen.css";

const LIMIT_MS = 30 * 60 * 1000;
const initial = () => ({ startedAt: null, completedAt: null, answers: {} });
const read = key => {
  try { return { ...initial(), ...(JSON.parse(localStorage.getItem(key) || "{}") || {}) }; }
  catch { return initial(); }
};
const timerText = ms => {
  const sec = Math.ceil(Math.max(0, ms)/1000);
  return `${String(Math.floor(sec/60)).padStart(2,"0")}:${String(sec%60).padStart(2,"0")}`;
};

export default function A2Mock3Lesen({ embedded = false, onComplete, reviewReleased = false }) {
  const { user } = useAuth();
  const keys = getA2Mock3StorageKeys(user?.uid);
  const storageKey = keys.lesen;
  const [state,setState] = useState(() => {
    const saved = read(storageKey);
    return embedded && !saved.startedAt ? { ...saved, startedAt: Date.now() } : saved;
  });
  const [active,setActive] = useState(0);
  const [now,setNow] = useState(Date.now());
  const remaining = Math.max(0,(state.startedAt || now+LIMIT_MS)+LIMIT_MS-now);
  const expired = Boolean(state.startedAt && now >= state.startedAt+LIMIT_MS);
  const done = Boolean(state.completedAt);
  const answers = state.answers || {};
  const answered = Object.values(answers).filter(Boolean).length;
  const part = PARTS[active];
  useEffect(() => { localStorage.setItem(storageKey,JSON.stringify(state)); }, [state,storageKey]);
  useEffect(() => { if (embedded && done) onComplete?.(); }, [embedded,done,onComplete]);
  useEffect(() => {
    if (!state.startedAt || done) return;
    const interval=window.setInterval(()=>setNow(Date.now()),1000);
    return ()=>window.clearInterval(interval);
  },[state.startedAt,done]);
  useEffect(() => {
    if (expired && !done) setState(old=>({...old,completedAt:Date.now()}));
  },[expired,done]);

  const choose=(number,id)=> {
    if (done) return;
    setState(old=>({...old,answers:{...old.answers,[number]:id}}));
  };
  const start=()=>{setNow(Date.now());setState({...initial(),startedAt:Date.now()});};
  const submit=()=> {
    if (window.confirm("Lesen jetzt abgeben? Nicht beantwortete Aufgaben werden als falsch gewertet.")) {
      setState(old=>({...old,completedAt:Date.now()}));
    }
  };
  return <main className="a2-mock2-shell" lang="de" data-a2-mock3-lesen>
    {!embedded ? <div className="a2-mock2-top">
      <AppBackButton label="Zurück zu den Mock-Prüfungen" fallbackPath="/exams/mocks"/>
      <span>A2 · Mock 3 · Lesen</span>
    </div> : null}
    {!state.startedAt ? <section className="a2-mock2-intro">
      <h1>A2 Mock 3 · Lesen</h1><p>Teil 1–4 · 20 Aufgaben · 30 Minuten. Ihre Antworten werden automatisch gespeichert.</p>
      <button type="button" className="a2-mock2-primary" onClick={start}>Lesen starten</button>
    </section> : <>
      <header className="a2-mock2-progress">
        <div><strong>Lesen · Teil {active+1} von 4</strong><span>{answered}/20 Aufgaben beantwortet</span></div>
        <strong role="timer">{timerText(remaining)}</strong>
      </header>
      <nav className="a2-mock2-nav" aria-label="Lesen Teile">
        {PARTS.map((item,index)=><button type="button" key={item.id} className={index===active?"selected":""}
          onClick={()=>setActive(index)}>Teil {index+1} <small>{item.questions.filter(q=>answers[q.number]).length}/5</small></button>)}
      </nav>
      <section className="a2-mock2-paper">
        <h1>Teil {active+1} · {part.title}</h1>
        <p>{part.instruction}</p>
        {part.subject ? <p><strong>Betreff:</strong> {part.subject}</p> : null}
        {part.paragraphs ? <article style={{background:"#f8fafc",border:"1px solid #cbd5e1",borderRadius:12,padding:16}}>
          {part.paragraphs.map((para,index)=><p key={index}>{para}</p>)}
        </article> : null}
        {part.floors ? <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><th scope="col">Etage</th><th scope="col">Abteilungen und Angebote</th></tr></thead>
          <tbody>{part.floors.map(([floor,desc])=><tr key={floor}>
            <th scope="row" style={{border:"1px solid #cbd5e1",padding:10,textAlign:"left"}}>{floor}</th>
            <td style={{border:"1px solid #cbd5e1",padding:10}}>{desc}</td>
          </tr>)}</tbody>
        </table></div> : null}
        {part.ads ? <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10}}>
          {part.ads.map(ad=><article key={ad.id} style={{padding:12,border:"1px solid #cbd5e1",borderRadius:10}}>
            <strong>{ad.id}) {ad.title}</strong><p>{ad.body}</p>
          </article>)}
        </div> : null}
        {part.questions.map(q=><fieldset key={q.number} className="a2-mock2-question" disabled={done}>
          <legend><strong>{q.number}.</strong> {q.question}</legend>
          {q.options.map(choice=>{
            const used = active===3 && choice.id!=="x" && part.questions.some(other => other.number!==q.number && answers[other.number]===choice.id);
            return <label key={choice.id} className={answers[q.number]===choice.id?"selected":""}>
              <input type="radio" name={`a2-mock3-lesen-${q.number}`} value={choice.id}
                checked={answers[q.number]===choice.id} disabled={used || done}
                onChange={()=>choose(q.number,choice.id)} />
              <span><strong>{choice.id.toUpperCase()})</strong> {active===3 && choice.id!=="x"
                ? part.ads.find(ad=>ad.id===choice.id)?.title : choice.label}</span>
            </label>;
          })}
        </fieldset>)}
        {!done ? <footer className="a2-mock2-actions">
          <button type="button" disabled={active===0} onClick={()=>setActive(i=>i-1)}>Zurück</button>
          {active<3 ? <button type="button" className="a2-mock2-primary" onClick={()=>setActive(i=>i+1)}>Weiter: Teil {active+2}</button> :
            <button type="button" className="a2-mock2-primary" onClick={submit}>Lesen abgeben</button>}
        </footer> : <section role="status" className="a2-mock2-results">
          <h2>Lesen abgegeben</h2>
          <p>Die offizielle Mock-03-Lesen-Punktzahl wird erst nach der serverseitigen Gesamtauswertung angezeigt.</p>
          {reviewReleased ? <p>{answered}/20 Antworten eingereicht.</p> : null}
        </section>}
      </section>
    </>}
  </main>;
}
