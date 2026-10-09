import React, { useCallback, useEffect, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { useAuth } from "../context/AuthContext";
import { getBackendUrl } from "../services/backendUrl";
import A2Mock2Lesen from "./A2Mock2Lesen";
import A2Mock2Hoeren from "./A2Mock2Hoeren";
import A2Mock2Schreiben from "./A2Mock2Schreiben";
import A2Mock2Sprechen from "./A2Mock2Sprechen";
import { A2_MOCK_2_LESEN_QUESTIONS } from "../data/a2Mock2Lesen";
import { A2_MOCK_2_HOEREN_QUESTIONS } from "../data/a2Mock2Hoeren";
import "./A2Mock2Lesen.css";
import "./A1FinalMockExamPage.css";
import "./A2Mock2ExamHub.css";

const FLOW_KEY = "falowen:a2:mock-02:full-flow:v2";
const ORDER = ["lesen", "hoeren", "schreiben", "sprechen"];
const LABELS = ["Lesen", "Hören", "Schreiben", "Sprechen"];
const STORAGE = {
  lesen:"falowen:a2:mock-02:lesen:v1",
  hoeren:"falowen:a2:mock-02:hoeren:v1",
  schreiben:"falowen:a2:mock-02:schreiben:v1",
  sprechen:"falowen:a2:mock-02:sprechen:v1",
};
const read = key => { try { return JSON.parse(window.localStorage.getItem(key) || "null") || {}; } catch { return {}; } };
const getProgress = () => {
 const l = read(STORAGE.lesen), h = read(STORAGE.hoeren), w = read(STORAGE.schreiben), s = read(STORAGE.sprechen);
 return {
  lesen: { done: Boolean(l.completedAt), count: Object.values(l.answers || {}).filter(Boolean).length,
   score: A2_MOCK_2_LESEN_QUESTIONS.filter(q => l.answers?.[q.number] === q.answer).length * 1.25 },
  hoeren: { done: Boolean(h.completedAt), count: Object.values(h.answers || {}).filter(Boolean).length,
   score: A2_MOCK_2_HOEREN_QUESTIONS.filter(q => h.answers?.[q.number] === q.answer).length * 1.25 },
  schreiben: { done: Boolean(w.aiFeedback?.length === 2), count: [w.sms,w.email].filter(x => String(x || "").trim()).length },
  sprechen: { done: Boolean(s._mock2AiScored), count: ["t1_questions","t1_answers","t2_main","t2_followups","t3_plan"].filter(k => s[k]?.transcript).length },
 };
};
const initialize = () => {
 const saved = read(FLOW_KEY);
 if (saved.stage && ["intro",...ORDER,"result"].includes(saved.stage)) return saved;
 const p=getProgress();
 const first=ORDER.find(k => !p[k].done);
 const started=ORDER.some(k=>p[k].done || p[k].count > 0);
 return {stage:started ? (first || "result") : "intro", startedAt: started ? Date.now() : null};
};
export default function A2Mock2ExamHub(){
 const { idToken } = useAuth();
 const [flow,setFlow] = useState(initialize);
 const [progress,setProgress] = useState(getProgress);
 const stage = flow.stage;
 const index = ORDER.indexOf(stage);
 const completed = ORDER.filter(k=>progress[k].done).length;
 const refresh = useCallback(()=>setProgress(getProgress()),[]);
 useEffect(()=>{localStorage.setItem(FLOW_KEY,JSON.stringify(flow));},[flow]);
 useEffect(()=>{
  const sync=()=>refresh();
  window.addEventListener("focus",sync); window.addEventListener("storage",sync);
  return ()=>{window.removeEventListener("focus",sync);window.removeEventListener("storage",sync)};
 },[refresh]);
 // Lightweight staff monitoring signal: metadata only, never answers or audio.
 const reportProgress = useCallback(async () => {
  if (!idToken || stage === "intro") return;
  const completedSections = ORDER.filter(k => progress[k].done);
  const sectionData = ORDER.includes(stage) ? read(STORAGE[stage]) : {};
  const rawStart = Number(sectionData.startedAt);
  const sectionDeadlineMs = ["lesen", "schreiben"].includes(stage) && rawStart > 0
    ? rawStart + 30 * 60 * 1000 : null;
  try {
   await fetch(`${getBackendUrl()}/internal/mock-progress`, {
    method: "POST",
    headers: { Authorization: `Bearer ${idToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ mockId: "a2-mock-02", section: stage,
     completedSections, startedAtMs: flow.startedAt, sectionDeadlineMs }),
   });
  } catch (_) {
   // Monitoring must never block the learner's exam or submission.
  }
 }, [idToken, stage, progress, flow.startedAt]);
 useEffect(() => {
  if (stage === "intro") return undefined;
  reportProgress();
  if (stage === "result") return undefined;
  const interval = window.setInterval(reportProgress, 60000);
  return () => window.clearInterval(interval);
 }, [reportProgress, stage]);
 const advance = useCallback(()=>{
  setProgress(getProgress());
  setFlow(current=>{
   const i=ORDER.indexOf(current.stage);
   if(i<0)return current;
   return {...current,stage:i===3?"result":ORDER[i+1]};
  });
  window.scrollTo({top:0,behavior:"smooth"});
 },[]);
 const start = () => {
  setFlow({stage:"lesen",startedAt:Date.now()});
  window.scrollTo({top:0,behavior:"smooth"});
 };
 const screens = {
  lesen:<A2Mock2Lesen embedded onComplete={advance}/>,
  hoeren:<A2Mock2Hoeren embedded onComplete={advance}/>,
  schreiben:<A2Mock2Schreiben embedded onComplete={advance}/>,
  sprechen:<A2Mock2Sprechen embedded onComplete={advance}/>,
 };
 return <main className="a2-mock2-full" lang="de">
   <div className="a2-mock2-top"><AppBackButton label="Zurück zu den Mocktests" fallbackPath="/exams/mocks"/><span>A2 · Mockprüfung 2</span></div>
   <header className="a2-mock2-full-heading">
    <p className="a2-mock2-kicker">A2 · Vollständiger Übungstest 2</p>
    <h1>A2 Mock 2</h1>
    <p>Lesen · Hören · Schreiben · Sprechen — ein Start, vier Prüfungsteile.</p>
   </header>
   <section className="a2-mock2-full-progress" aria-label="Fortschritt der vier Module">
    <div className="a2-mock2-full-progress-head"><strong>Prüfungsfortschritt</strong><span>{completed} von 4 Modulen abgeschlossen</span></div>
    <div className="a2-mock2-full-track"><div style={{width:`${completed*25}%`}}/></div>
    <div className="a2-mock2-full-stages">{ORDER.map((key,i)=><div key={key} className={progress[key].done?"complete":stage===key?"current":""}>
      <span aria-hidden="true">{progress[key].done?"✓":i+1}</span><strong>{LABELS[i]}</strong>
      <small>{progress[key].done?"Abgeschlossen":stage===key?"Aktuell":"Noch offen"}</small>
    </div>)}</div>
   </section>
   {stage==="intro"?<section className="a2-mock2-full-intro">
     <h2>Bereit für Ihren zweiten A2-Mocktest?</h2>
     <p>Starten Sie einmal. Nach jeder Abgabe öffnet sich automatisch das nächste Modul. Wenn Sie diese Seite verlassen, können Sie dort weitermachen, wo Sie aufgehört haben. Ein laufender Timer wird nicht angehalten.</p>
     <p>Lesen 30 Min. · Hören 30 Min. · Schreiben 30 Min. · Sprechen ca. 15 Min.</p>
     <button type="button" className="a2-mock2-primary" onClick={start}>Gesamten Mocktest starten</button>
   </section>:null}
   {ORDER.includes(stage)?<section className="a2-mock2-full-current" key={stage}>
     <div className="a2-mock2-full-module"><strong>Modul {index+1} von 4 · {LABELS[index]}</strong><p>Nach Abgabe wechseln Sie automatisch zum nächsten Modul.</p></div>
     {screens[stage]}
   </section>:null}
   {stage==="result"?<section className="a2-mock2-full-intro">
    <h2>Alle vier Module bearbeitet</h2>
    <p>Vielen Dank. Ihre Antworten und KI-Übungsrückmeldungen bleiben auf diesem Gerät gespeichert.</p>
    <p>Lesen: <strong>{progress.lesen.score.toFixed(1)}/25</strong> · Hören: <strong>{progress.hoeren.score.toFixed(1)}/25</strong></p>
    <p>Ein verifiziertes Gesamtergebnis von 100 Punkten wird erst angezeigt, wenn die KI-Bewertungen von Schreiben und Sprechen sicher dem zweiten Mocktest zugeordnet werden können.</p>
   </section>:null}
 </main>;
}
