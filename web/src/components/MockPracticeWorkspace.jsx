import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useAuth} from "../context/AuthContext";
import {getBackendUrl} from "../services/backendUrl";
import AppBackButton from "./navigation/AppBackButton";
import "./MockPracticeWorkspace.css";

const LABELS={lesen:"Lesen",hoeren:"Hören",schreiben:"Schreiben",sprechen:"Sprechen"};
const read=key=>{try{return JSON.parse(localStorage.getItem(key)||"null")||{}}catch{return {}}};
const normalize=v=>String(v??"").trim().toLowerCase();
export const practiceStorageKey=(uid,mockId)=>`falowen:mock-practice:v1:${uid}:${mockId}`;
export const practiceModules=mockId=>mockId==="a2-mock-08"?["lesen","schreiben","sprechen"]:Object.keys(LABELS);
export function MockModeGate({mockId, title, timed, practice, defaultTimed=true}) {
  const initial=()=>{const mode=new URLSearchParams(typeof window==="undefined"?"":window.location.search).get("mode");return mode==="practice"?"practice":mode==="timed"||defaultTimed?"timed":""};
  const [mode,setMode]=useState(initial);
  if(mode==="timed") return <><div className="mock-mode-switch"><button type="button" onClick={()=>{if(window.confirm("Leave the timed view? Your saved attempt is retained and its timer continues."))setMode("")}}>Choose another mode</button></div>{timed}</>;
  if(mode==="practice") return <><div className="mock-mode-switch"><button type="button" onClick={()=>setMode("")}>Choose another mode</button></div>{practice}</>;
  return <main className="mock-practice"><AppBackButton label="Back to Mock Exams" fallbackPath="/exams/mocks"/><h1>{title}</h1><p>Choose how you want to work on this paper.</p>
    <div className="mock-mode-grid">
      <article><h2>Practice Mode</h2><p>No countdown. Choose a module, replay audio and check Lesen/Hören answers. Repeat anytime. Writing and speaking are self-practice.</p><button className="mock-practice-primary" onClick={()=>setMode("practice")}>Start Practice</button></article>
      <article><h2>Timed Exam Mode</h2><p>Exam time limits, saved exam attempts and verified results. Continue an unfinished exam or retake a completed paper.</p><button className="mock-practice-primary" onClick={()=>setMode("timed")}>Start / Resume Timed Exam</button></article>
    </div></main>;
}

export function PracticeAudio({load}) {
  const [url,setUrl]=useState(""),[busy,setBusy]=useState(false),[error,setError]=useState("");
  const alive=useRef(true);
  useEffect(()=>{alive.current=true;return()=>{alive.current=false}},[]);
  async function prepare(){setBusy(true);setError("");try{const result=await load();if(alive.current)setUrl(result.url)}catch(e){if(alive.current)setError(e?.response?.data?.error||e.message||"Audio unavailable.")}finally{if(alive.current)setBusy(false)}}
  return <div className="mock-practice-audio">{url?<audio controls preload="metadata" src={url} onError={()=>setError("Audio could not play. Reload the recording.")}/>:null}
    <button type="button" disabled={busy} onClick={prepare}>{busy?"Loading…":url?"Reload audio":"Load audio"}</button>{error?<p role="alert">{error}</p>:null}</div>;
}
export function PracticeQuestions({questions=[],answers,onChange,optionsFor,keyFor=q=>String(q.number)}) {
  return questions.map(q=>{const key=keyFor(q);const options=optionsFor?optionsFor(q):q.options;
    return <fieldset className="mock-practice-question" key={key}><legend>{q.number}. {q.question||q.statement||q.person||q.text||q.day}</legend>{q.context?<p>{q.context}</p>:null}
    {(options||[]).map(opt=>{const [id,label]=Array.isArray(opt)?opt:[opt.id,opt.label];return <label key={id}><input type="radio" name={key} value={id} checked={answers[key]===id} onChange={()=>onChange(key,id)}/><span>{/^[a-z]$/i.test(String(id))?`${String(id).toUpperCase()}) `:""}{label||id}</span>{opt.imagePath?<img loading="lazy" src={opt.imagePath} alt={opt.imageAlt||label}/>:null}</label>})}</fieldset>})
}
function PracticeReview({rows,section,displayAnswer}) {
  const [mistakes,setMistakes]=useState(false);
  const correct=rows.filter(r=>r.status==="correct").length;
  return <section className="mock-practice-review"><h2>{LABELS[section]} practice result</h2><p><strong>{correct}/{rows.length} correct</strong> · {rows.length-correct} incorrect or unanswered</p>
  <div className="mock-practice-numbers">{rows.map(r=><span key={r.number} className={r.status} aria-label={`Question ${r.number}: ${r.status}`}>{r.number} {r.status==="correct"?"✓":"×"}</span>)}</div>
  <label><input type="checkbox" checked={mistakes} onChange={e=>setMistakes(e.target.checked)}/> Show mistakes only</label>
  {rows.filter(r=>!mistakes||r.status!=="correct").map(r=><article className={r.status} key={r.number}><strong>Aufgabe {r.number} · {r.status==="correct"?"Correct":r.status==="unanswered"?"Not answered":"Incorrect"}</strong><p>Your answer: {r.submitted?(displayAnswer?.(section,r,r.submitted)||r.submitted.toUpperCase()):"—"} · Correct answer: {displayAnswer?.(section,r,r.expected)||r.expected?.toUpperCase()}</p></article>)}</section>;
}
export function PracticeWriting({tasks,answers,onChange}) {
  return <>{tasks.map((task,i)=><article className="mock-practice-paper" key={i}><h2>{task.title||`Teil ${i+1}`}</h2>
    {(Array.isArray(task.scenario)?task.scenario:[task.situation||task.scenario||task.prompt||task.context]).filter(Boolean).map((line,j)=><p key={j}>{line}</p>)}
    {task.quote?<blockquote>{task.quoteBy?<strong>{task.quoteBy}</strong>:null}<p>{task.quote}</p></blockquote>:null}<p>{task.instruction}</p>{task.points?.length?<ul>{task.points.map((p,j)=><li key={j}>{p}</li>)}</ul>:null}
    {task.formRows?.length?task.formRows.filter(r=>r.kind==="input").map((r,j)=><label key={j}>{r.label}<input value={answers[`form-${j}`]||""} onChange={e=>onChange(`form-${j}`,e.target.value)}/></label>):<textarea aria-label={`Writing task ${i+1}`} rows={7} value={answers[String(i)]||""} onChange={e=>onChange(String(i),e.target.value)}/>}
    <p>{task.reminder||""} {task.wordTarget?`Target: ${task.wordTarget} words`:task.target?`Target: ${task.target} words`:task.minWords&&task.maxWords?`Target: ${task.minWords}–${task.maxWords} words`:""}</p></article>)}</>;
}
export function PracticeSpeaking({tasks,answers,onChange}) {
  return <>{tasks.map((t,i)=><article className="mock-practice-paper" key={i}><h2>{t.title||`Teil ${i+1}`}</h2><p>{t.prompt||t.situation}</p><p>{t.context} {t.keyword} {t.pictureAlt}</p>{Array.isArray(t.card)?<p>{t.card.join(" · ")}</p>:null}<p>{t.followUp||t.hint}</p>
    <p>Practise aloud with a partner or on your own. Write notes here if useful.</p><textarea aria-label={`Speaking notes ${i+1}`} rows={3} value={answers[String(i)]||""} onChange={e=>onChange(String(i),e.target.value)}/></article>)}</>;
}
export default function MockPracticeWorkspace({mockId,title,reading,listening,writing,speaking,displayAnswer}) {
  const {user,idToken}=useAuth();
  return <PracticeAttempt key={`${user?.uid}:${mockId}`} {...{mockId,title,reading,listening,writing,speaking,displayAnswer,idToken,uid:user?.uid}}/>;
}
function PracticeAttempt({mockId,title,reading,listening,writing,speaking,displayAnswer,idToken,uid}) {
  const key=practiceStorageKey(uid,mockId);
  const [saved,setSaved]=useState(()=>uid?read(key):{});
  const [section,setSection]=useState("lesen"),[busy,setBusy]=useState(false),[error,setError]=useState("");
  const [review,setReview]=useState(null);
  const modules=practiceModules(mockId);
  const answers=saved.drafts?.[section]||{};
  const history=Array.isArray(saved.history)?saved.history:[];
  const objective=["lesen","hoeren"].includes(section);
  const render={lesen:reading,hoeren:listening,schreiben:writing,sprechen:speaking}[section];
  const save=next=>{try{localStorage.setItem(key,JSON.stringify(next));setSaved(next);return true}catch{setError("Device storage is full or unavailable. Your saved history was not deleted.");return false}};
  const change=(id,value)=>{if(busy||review)return;save({...saved,drafts:{...saved.drafts,[section]:{...answers,[id]:value}}})};
  const choose=next=>{setSection(next);setReview(null);setError("")};
  const reset=()=>{if(save({...saved,drafts:{...saved.drafts,[section]:{}}})){setReview(null);setError("")}};
  const submit=async()=>{if(busy||!uid||!idToken)return;setBusy(true);setError("");
    try{
      let rows=[];
      if(objective){const r=await axios.post(`${getBackendUrl()}/mock/practice/review`,{mockId,section,answers},{headers:{Authorization:`Bearer ${idToken}`}});if(!r.data.practiceOnly||!Array.isArray(r.data.rows)||!r.data.rows.length)throw Error("Practice review unavailable");rows=r.data.rows}
      const entry={section,at:Date.now(),rows,correct:objective?rows.filter(r=>r.status==="correct").length:null,total:objective?rows.length:null};
      if(save({...saved,history:[...history,entry]}))setReview(entry);
    }catch(e){setError(e?.response?.data?.error||e.message||"Could not check answers.")}finally{setBusy(false)}
  };
  if(!uid)return <p>Please sign in to practise.</p>;
  return <main className="mock-practice"><AppBackButton label="Back to Mock Exams" fallbackPath="/exams/mocks"/><h1>{title} · Practice Mode</h1><p>No time limit · Practice is saved on this device only. It does not count towards a certificate or verified exam score.</p>
    <nav className="mock-practice-tabs" aria-label="Practice modules">{modules.map(s=><button key={s} disabled={busy} type="button" aria-pressed={section===s} onClick={()=>choose(s)}>{LABELS[s]}</button>)}</nav>
    {error?<p role="alert">{error}</p>:null}
    {review?<>{objective?<PracticeReview rows={review.rows} section={section} displayAnswer={displayAnswer}/>:<section><h2>Practice completed</h2><p>Self-practice only: check that you covered every task point and used clear German. No AI or tutor grade was requested.</p></section>}<button type="button" className="mock-practice-primary" onClick={reset}>Practise this module again</button></>:<>
      {render?.({answers,onChange:change,idToken,section})}
      {render?<div className="mock-practice-actions"><button className="mock-practice-primary" disabled={busy||objective&&!Object.values(answers).some(v=>normalize(v))} type="button" onClick={submit}>{busy?"Checking…":objective?"Check answers":"Finish self-practice"}</button><button type="button" disabled={busy} onClick={()=>{if(window.confirm("Clear this practice draft? Past practice results stay saved."))reset()}}>Start module again</button></div>:null}
    </>}
    <details><summary>Practice history ({history.length})</summary>{history.slice().reverse().map((entry,i)=><div className="mock-practice-history" key={`${entry.at}:${i}`}><strong>{LABELS[entry.section]} · {entry.total?`${entry.correct}/${entry.total}`:"Self-practice"}</strong> <small>{new Date(entry.at).toLocaleString()}</small>{entry.total?<button type="button" disabled={busy} onClick={()=>{setSection(entry.section);setReview(entry)}}>Review</button>:null}</div>)}</details>
  </main>;
}
