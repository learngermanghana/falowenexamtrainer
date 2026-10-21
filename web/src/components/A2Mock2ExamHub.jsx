import { getA2Mock2StorageKeys, isA2Mock2ReviewReady } from "../utils/mockReviewAccess";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { announceExamSuccess } from "../services/interactionFeedback";
import AppBackButton from "./navigation/AppBackButton";
import { useAuth } from "../context/AuthContext";
import { getBackendUrl } from "../services/backendUrl";
import { getMockAnswerBackup, restoreA2Mock2Backup, syncA2Mock2Backup } from "../services/a2Mock2Backup";
import A2Mock2Lesen from "./A2Mock2Lesen";
import A2Mock2Hoeren from "./A2Mock2Hoeren";
import A2Mock2Schreiben from "./A2Mock2Schreiben";
import A2Mock2Sprechen from "./A2Mock2ConversationalSpeaking";
import { A2_MOCK_2_LESEN_QUESTIONS } from "../data/a2Mock2Lesen";
import { A2_MOCK_2_HOEREN_QUESTIONS } from "../data/a2Mock2Hoeren";
import "./A2Mock2Lesen.css";
import "./A1FinalMockExamPage.css";
import "./A2Mock2ExamHub.css";

const ORDER = ["lesen", "hoeren", "schreiben", "sprechen"];
const LABELS = ["Lesen", "Hören", "Schreiben", "Sprechen"];
const read = key => { try { return JSON.parse(window.localStorage.getItem(key) || "null") || {}; } catch { return {}; } };
const getProgress = (STORAGE) => {
 const l = read(STORAGE.lesen), h = read(STORAGE.hoeren), w = read(STORAGE.schreiben), s = read(STORAGE.sprechen);
 return {
  lesen: { done: Boolean(l.completedAt), count: Object.values(l.answers || {}).filter(Boolean).length,
   score: A2_MOCK_2_LESEN_QUESTIONS.filter(q => l.answers?.[q.number] === q.answer).length * 1.25 },
  hoeren: { done: Boolean(h.completedAt), count: Object.values(h.answers || {}).filter(Boolean).length,
   score: A2_MOCK_2_HOEREN_QUESTIONS.filter(q => h.answers?.[q.number] === q.answer).length * 1.25 },
  schreiben: { done: Boolean(w.submittedAt), count: [w.sms,w.email].filter(x => String(x || "").trim()).length },
  sprechen: { done: Boolean(["1","2","3"].every(k => s._examinerParts?.[k]?.sessionId && s._examinerParts?.[k]?.assessment) || ["t1_questions","t1_answers","t2_main","t2_followups","t3_plan"].every(k => s[k]?.transcript)), count: ["1","2","3"].filter(k => s._examinerParts?.[k]?.sessionId && s._examinerParts?.[k]?.assessment).length || ["t1_questions","t1_answers","t2_main","t2_followups","t3_plan"].filter(k => s[k]?.transcript).length },
 };
};
const initialize = (STORAGE) => {
 const saved = read(STORAGE.flow);
 if (saved.stage && ["intro",...ORDER,"result"].includes(saved.stage) && (saved.stage !== "result" || isA2Mock2ReviewReady(STORAGE))) return saved;
 const p=getProgress(STORAGE);
 const first=ORDER.find(k => !p[k].done);
 const started=ORDER.some(k=>p[k].done || p[k].count > 0);
 return {stage:started ? (first || "result") : "intro", startedAt: started ? Date.now() : null};
};
function A2Mock2ExamHubAttempt(){
 const { idToken, user } = useAuth();
 const STORAGE = useMemo(() => getA2Mock2StorageKeys(user?.uid), [user?.uid]);
 const [flow,setFlow] = useState(() => initialize(STORAGE));
 const [progress,setProgress] = useState(() => getProgress(STORAGE));
 const [resetError, setResetError] = useState("");
 const [backupNotice,setBackupNotice] = useState("");
 const stage = flow.stage;
 const index = ORDER.indexOf(stage);
 const completed = ORDER.filter(k=>progress[k].done).length;
 const refresh = useCallback(()=>setProgress(getProgress(STORAGE)),[STORAGE]);
 useEffect(()=>{localStorage.setItem(STORAGE.flow,JSON.stringify(flow));},[flow, STORAGE]);
 useEffect(()=>{
  const sync=()=>refresh();
  window.addEventListener("focus",sync); window.addEventListener("storage",sync);
  return ()=>{window.removeEventListener("focus",sync);window.removeEventListener("storage",sync)};
 },[refresh]);
 // Fetch at mount only; preserve the local active attempt. Existing completed
 // sections will be uploaded on the next step even if the student was offline.
 useEffect(() => {
  if (!idToken || !user?.uid) return undefined;
  let alive = true;
  getMockAnswerBackup("a2-mock-02", idToken).then(remote => {
   if (!alive || !restoreA2Mock2Backup(STORAGE, remote)) return;
   setProgress(getProgress(STORAGE));
   setFlow(initialize(STORAGE));
   setBackupNotice("Saved answers restored.");
  }).catch(() => { /* Offline/browser answers remain available. */ });
  return () => { alive = false; };
 }, [idToken, user?.uid, STORAGE]);
 useEffect(() => {
  if (!idToken || !user?.uid || !flow.startedAt) return;
  syncA2Mock2Backup(STORAGE, flow.startedAt, idToken, user.uid)
   .catch(() => { /* Saved locally; next entry/section can retry without blocking. */ });
 }, [idToken, user?.uid, flow.stage, flow.startedAt, progress, STORAGE]);
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
 }, [idToken, stage, progress, flow.startedAt, STORAGE]);
 useEffect(() => {
  if (stage === "intro") return undefined;
  reportProgress();
  if (stage === "result") return undefined;
  const interval = window.setInterval(reportProgress, 300000);
  return () => window.clearInterval(interval);
 }, [reportProgress, stage]);
 const advance = useCallback(()=>{
  setProgress(getProgress(STORAGE));
  setFlow(current=>{
   const i=ORDER.indexOf(current.stage);
   if(i<0)return current;
   return {...current,stage:i===3?"result":ORDER[i+1]};
  });
  announceExamSuccess(stage === "sprechen"
    ? "A2 Mock 2 completed. Review your progress."
    : `${{ lesen: "Lesen", hoeren: "Hören", schreiben: "Schreiben" }[stage] || "Mock"} completed. Continue to the next section.`);
  window.scrollTo({top:0,behavior:"smooth"});
 },[STORAGE, stage]);
 const start = () => {
  announceExamSuccess("A2 Mock 2 started successfully.");
  setFlow({stage:"lesen",startedAt:Date.now()});
  window.scrollTo({top:0,behavior:"smooth"});
 };
 const restart = () => {
  if (!isA2Mock2ReviewReady(STORAGE) || !window.confirm("Start a new full mock? Ihr abgeschlossenes Ergebnis bleibt im Verlauf gespeichert.")) return;
  try {
   const historyKey = `${STORAGE.flow}:history`;
   const history = read(historyKey);
   const completedAttempt = Object.fromEntries(Object.entries(STORAGE).map(([name, key]) => [name, read(key)]));
   localStorage.setItem(historyKey, JSON.stringify([...(Array.isArray(history) ? history : []), completedAttempt]));
   Object.values(STORAGE).forEach(key => localStorage.removeItem(key));
   setFlow({ stage: "intro", startedAt: null });
   setProgress(getProgress(STORAGE));
   setResetError("");
   announceExamSuccess("A2 Mock 2 is ready for a new attempt.");
  } catch (_) { setResetError("Der Verlauf konnte nicht gespeichert werden. Ihr bisheriger Versuch wurde nicht zurückgesetzt."); }
 };
 const screens = {
  lesen:<A2Mock2Lesen embedded onComplete={advance}/>,
  hoeren:<A2Mock2Hoeren embedded onComplete={advance}/>,
  schreiben:<A2Mock2Schreiben embedded onComplete={advance}/>,
  sprechen:<A2Mock2Sprechen embedded onComplete={advance}/>,
 };
 return <main className="a2-mock2-full" lang="en">
   <div className="a2-mock2-top"><AppBackButton label="Back to Mock Exams" fallbackPath="/exams/mocks"/><span>A2 · Full Mock Exam 2</span></div>
   <header className="a2-mock2-full-heading">
    <p className="a2-mock2-kicker">A2 · Full Practice Exam 2</p>
    <h1>A2 Mock 2</h1>
    <p>Reading · Listening · Writing · Speaking — one exam, four modules.</p>
   </header>
   <section className="a2-mock2-full-progress" aria-label="Progress across four exam modules">
    <div className="a2-mock2-full-progress-head"><strong>Exam progress</strong><span>{completed} of 4 modules completed</span></div>{backupNotice ? <p role="status">{backupNotice}</p> : null}
    <div className="a2-mock2-full-track"><div style={{width:`${completed*25}%`}}/></div>
    <div className="a2-mock2-full-stages">{ORDER.map((key,i)=><div key={key} className={progress[key].done?"complete":stage===key?"current":""}>
      <span aria-hidden="true">{progress[key].done?"✓":i+1}</span><strong>{LABELS[i]}</strong>
      <small>{progress[key].done?"Completed":stage===key?"Current":"Not started"}</small>
    </div>)}</div>
   </section>
   {stage==="intro"?<section className="a2-mock2-full-intro">
     <h2>Ready for your second A2 mock exam?</h2>
     <p>Start once. When you submit a module, the next one opens automatically. You can come back to the saved exam, but an active timer keeps running. In Speaking, the AI examiner asks questions in German; listen, then answer using the microphone.</p>
     <p>Reading 30 min · Listening 30 min · Writing 30 min · Speaking approx. 15 min</p>
     <button type="button" className="a2-mock2-primary" onClick={start}>Start full mock exam</button>
   </section>:null}
   {ORDER.includes(stage)?<section className="a2-mock2-full-current" key={stage}>
     <div className="a2-mock2-full-module"><strong>Module {index+1} of 4 · {LABELS[index]}</strong><p>{stage==="sprechen" ? "Listen to your AI examiner and answer in German. Complete all three speaking parts to finish your mock exam." : "Submit this module to move automatically to the next one. Your answers are saved."}</p></div>
     {screens[stage]}
   </section>:null}
   {stage==="result" && isA2Mock2ReviewReady(STORAGE)?<section className="a2-mock2-full-intro">
    <h2>All four modules completed</h2>
    <p>Your submitted answers remain saved on this device. AI practice feedback is separate from submission; if marking fails, retry it without repeating the mock.</p>
    <p>Lesen: <strong>{progress.lesen.score.toFixed(1)}/25</strong> · Hören: <strong>{progress.hoeren.score.toFixed(1)}/25</strong></p>
    <button type="button" className="a2-mock2-primary" onClick={restart}>Start a new full mock</button>
    {resetError ? <p role="alert">{resetError}</p> : null}
    <details><summary>Reading · View answers and solutions</summary><A2Mock2Lesen embedded reviewReleased /></details>
    <details><summary>Listening · View answers and solutions</summary><A2Mock2Hoeren embedded reviewReleased /></details>
    <details><summary>Writing · AI feedback / retry marking</summary><A2Mock2Schreiben embedded reviewReleased /></details>
    <details><summary>Speaking · AI examiner feedback</summary><A2Mock2Sprechen embedded reviewReleased /></details>
    <p>A verified overall score out of 100 is shown only after the writing and speaking assessments have been validated for this Mock 2 attempt.</p>
   </section>:null}
 </main>;
}

// Switching accounts must remount local exam state, not copy the prior answers.
export default function A2Mock2ExamHub(props) {
  const { user } = useAuth();
  return <A2Mock2ExamHubAttempt key={user?.uid || "guest"} {...props} />;
}
