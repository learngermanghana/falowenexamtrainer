import { getA2Mock2StorageKeys, isA2Mock2ReviewReady } from "../utils/mockReviewAccess";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { announceExamSuccess } from "../services/interactionFeedback";
import AppBackButton from "./navigation/AppBackButton";
import { useAuth } from "../context/AuthContext";
import { getBackendUrl } from "../services/backendUrl";
import { getMockAnswerBackup, restoreA2Mock2Backup, syncA2Mock2Backup } from "../services/a2Mock2Backup";
import { startA2MockAttempt } from "../services/a2FinalMockService";
import { finalizeA2RegisteredMock } from "../services/a2VerifiedMockEngine";
import A2Mock2Lesen from "./A2Mock2Lesen";
import A2Mock2Hoeren from "./A2Mock2Hoeren";
import A2Mock2Schreiben from "./A2Mock2Schreiben";
import A2Mock2Sprechen from "./A2Mock2ConversationalSpeaking";
import { A2_MOCK_2_LESEN_QUESTIONS } from "../data/a2Mock2Lesen";
import { A2_MOCK_2_HOEREN_QUESTIONS } from "../data/a2Mock2Hoeren";
import { A2_MOCK_2_SPEAKING, A2_MOCK_2_SPEAKING_RUBRIC } from "../data/a2Mock2Speaking";
import "./A2Mock2Lesen.css";
import "./A1FinalMockExamPage.css";
import "./A2Mock2ExamHub.css";

const ORDER = ["lesen", "hoeren", "schreiben", "sprechen"];
const LABELS = ["Lesen", "Hören", "Schreiben", "Sprechen"];
const LEGACY_SPEAKING_TASKS=[
 {id:"t1_questions",teil:"1",task:"Ask questions about "+A2_MOCK_2_SPEAKING.cards.map(x=>x.keyword).join(", ")},
 {id:"t1_answers",teil:"1",task:"Respond to: "+A2_MOCK_2_SPEAKING.cards.map(x=>x.samplePartnerQuestion).join(" / ")},
 {id:"t2_main",teil:"2",task:A2_MOCK_2_SPEAKING.teil2.topic+" "+A2_MOCK_2_SPEAKING.teil2.points.join("; ")},
 {id:"t2_followups",teil:"2",task:A2_MOCK_2_SPEAKING.teil2.followups.join(" / ")},
 {id:"t3_plan",teil:"3",task:A2_MOCK_2_SPEAKING.teil3.situation+" "+A2_MOCK_2_SPEAKING.teil3.points.join("; ")},
];
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
 const [progressSyncState,setProgressSyncState] = useState("idle");
 const [attemptBusy,setAttemptBusy] = useState(false);
 const [attemptError,setAttemptError] = useState("");
 const [finalStatus,setFinalStatus] = useState("idle");
 const [finalError,setFinalError] = useState("");
 const attemptCreating=useRef(false);
 const finalizing=useRef(false);
 const stage = flow.stage;
 const index = ORDER.indexOf(stage);
 const completed = ORDER.filter(k=>progress[k].done).length;
 const refresh = useCallback(()=>setProgress(getProgress(STORAGE)),[STORAGE]);
 const attemptId=flow.attemptInfo?.attemptId || "";
 const ensureAttempt = useCallback(async () => {
  if (attemptCreating.current || !idToken || attemptId) return;
  attemptCreating.current=true;
  setAttemptBusy(true);setAttemptError("");
  try {
   const result=await startA2MockAttempt({idToken,mockId:"a2-mock-02"});
   if (!result?.attemptId) throw new Error("Mock 2 server attempt was not created.");
   setFlow(current=>({...current,attemptInfo:{
    attemptId:result.attemptId,attemptNumber:result.attemptNumber,
    firstAttempt:result.firstAttempt,
   }}));
  } catch(error) {
   setAttemptError(error?.response?.data?.error || error.message || "Could not connect to the exam server. Retry safely.");
  } finally {attemptCreating.current=false;setAttemptBusy(false);}
 },[attemptId,idToken]);
 useEffect(() => {
  // Restore a server attempt for students who completed sections on an older build.
  if (flow.stage !== "intro" && !attemptId && idToken) void ensureAttempt();
 },[flow.stage,attemptId,idToken,ensureAttempt]);
 const publishResult=useCallback(async()=>{
  if (finalizing.current || !attemptId || !idToken) return;
  finalizing.current=true;setFinalError("");setFinalStatus("marking");
  try {
   const verified=await finalizeA2RegisteredMock({
    idToken,mockId:"a2-mock-02",attemptId,storageKeys:STORAGE,
    legacySpeakingTasks:LEGACY_SPEAKING_TASKS,speakingRubric:A2_MOCK_2_SPEAKING_RUBRIC,
   });
   setFlow(current=>({...current,verifiedResult:verified}));
   setFinalStatus("completed");
  } catch(error) {
   setFinalError(error?.response?.data?.error || error?.message || "Final result is still pending.");
   setFinalStatus("failed");
  } finally {finalizing.current=false;}
 },[attemptId,idToken,STORAGE]);
 useEffect(()=>{
  // Exactly one automatic finalization per mounted attempt. A failure exposes
  // a manual retry, and server-persisted grades are reused without new OpenAI calls.
  if(stage === "result" && !flow.verifiedResult && attemptId &&
     ORDER.every(section=>progress[section].done) && finalStatus === "idle")
   void publishResult();
 },[stage,flow.verifiedResult,attemptId,progress,finalStatus,publishResult]);

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
   setFlow(current=>({...initialize(STORAGE),attemptInfo:current.attemptInfo || initialize(STORAGE).attemptInfo,verifiedResult:current.verifiedResult}));
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
   setProgressSyncState("sending");
   const response = await fetch(`${getBackendUrl()}/internal/mock-progress`, {
    method: "POST",
    headers: { Authorization: `Bearer ${idToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ mockId: "a2-mock-02", section: stage,
     completedSections, startedAtMs: flow.startedAt, sectionDeadlineMs }),
   });
   if (!response.ok) throw new Error(`Progress reporting failed (${response.status})`);
   setProgressSyncState("saved");
  } catch (_) {
   setProgressSyncState("failed");
   // Never erase answers because monitoring was temporarily unavailable.
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
 const start = async () => {
  if (attemptBusy) return;
  if (!idToken) { setAttemptError("Sign in before starting this scored exam."); return; }
  setAttemptBusy(true);setAttemptError("");
  try {
   const result=await startA2MockAttempt({idToken,mockId:"a2-mock-02"});
   if(!result?.attemptId)throw new Error("The server did not create a scored attempt.");
   setFlow({stage:"lesen",startedAt:Date.now(),attemptInfo:{attemptId:result.attemptId,attemptNumber:result.attemptNumber,firstAttempt:result.firstAttempt}});
   announceExamSuccess("A2 Mock 2 started successfully.");
  } catch(error) {setAttemptError(error?.response?.data?.error || error.message || "Could not start the exam.");}
  finally {setAttemptBusy(false);}
  if (!attemptCreating.current) {
  window.scrollTo({top:0,behavior:"smooth"});
  }
 };
 const restart = () => {
  if (!flow.verifiedResult || !isA2Mock2ReviewReady(STORAGE) || !window.confirm("Start a new full mock? Your verified result remains saved.")) return;
  try {
   const historyKey = `${STORAGE.flow}:history`;
   const history = read(historyKey);
   const completedAttempt = Object.fromEntries(Object.entries(STORAGE).map(([name, key]) => [name, read(key)]));
   localStorage.setItem(historyKey, JSON.stringify([...(Array.isArray(history) ? history : []), completedAttempt]));
   Object.values(STORAGE).forEach(key => localStorage.removeItem(key));
   setFlow({ stage: "intro", startedAt: null, archivedAttemptStartedAtMs: flow.startedAt });
   setFinalStatus("idle");setFinalError("");
   setProgress(getProgress(STORAGE));
   setResetError("");
   announceExamSuccess("A2 Mock 2 is ready for a new attempt.");
  } catch (_) { setResetError("Der Verlauf konnte nicht gespeichert werden. Ihr bisheriger Versuch wurde nicht zurückgesetzt."); }
 };
 const screens = {
  lesen:<A2Mock2Lesen embedded onComplete={advance}/>,
  hoeren:<A2Mock2Hoeren embedded onComplete={advance}/>,
  schreiben:<A2Mock2Schreiben embedded onComplete={advance}/>,
  sprechen:<A2Mock2Sprechen embedded attemptId={attemptId} onComplete={advance}/>,
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
     {attemptError?<p role="alert">{attemptError}</p>:null}
     <button type="button" className="a2-mock2-primary" disabled={attemptBusy} onClick={start}>{attemptBusy?"Connecting to exam server…":"Start full mock exam"}</button>
   </section>:null}
   {ORDER.includes(stage)?<section className="a2-mock2-full-current" key={stage}>
     <div className="a2-mock2-full-module"><strong>Module {index+1} of 4 · {LABELS[index]}</strong><p>{stage==="sprechen" ? "Listen to your AI examiner and answer in German. Complete all three speaking parts to finish your mock exam." : "Submit this module to move automatically to the next one. Your answers are saved."}</p></div>
     {screens[stage]}
   </section>:null}
   {stage==="result" && isA2Mock2ReviewReady(STORAGE)?<section className="a2-mock2-full-intro">
    <h2>All four modules completed</h2>
    {flow.verifiedResult ? <section role="status" aria-label="Verified A2 Mock 2 results">
      <h3>Verified final result · {flow.verifiedResult.overall.score}/100</h3>
      <p>{ORDER.map(key=>LABELS[ORDER.indexOf(key)]+": "+flow.verifiedResult.sectionScores[key]+"/25").join(" · ")}</p>
      <p>{flow.verifiedResult.overall.passed?"Passed":"Further practice recommended"} · Saved to your results.</p>
    </section> : <p role="status"><strong>Final result pending.</strong> Your four sections are saved. Falowen will check the OpenAI assessments and publish verified marks.</p>}
    {!flow.verifiedResult ? <p role="status">{finalStatus==="marking"?"Marking and saving your final exam…":finalError || (attemptBusy?"Restoring your server attempt…":"Preparing automatic final marking…")}</p> : null}
    {attemptError?<p role="alert">{attemptError}</p>:null}
    {!flow.verifiedResult && finalStatus==="failed" ? <button type="button" onClick={publishResult}>Retry final marking and save</button> : null}
    {!flow.verifiedResult && !attemptId && !attemptBusy ? <button type="button" onClick={ensureAttempt}>Recover server attempt</button>:null}
    <p role="status">{progressSyncState === "sending" ? "Synchronising progress…" : progressSyncState === "saved" ? "Progress synchronised; final marking may still be pending." : progressSyncState === "failed" ? "Progress sync failed. Retry safely below." : "Checking progress sync…"}</p>
    <button type="button" onClick={reportProgress} disabled={progressSyncState === "sending"}>Retry progress sync</button>
    <p>Your submitted answers remain saved on this device. AI practice feedback is separate from submission; if marking fails, retry it without repeating the mock.</p>
    <p>Lesen: <strong>{progress.lesen.score.toFixed(1)}/25</strong> · Hören: <strong>{progress.hoeren.score.toFixed(1)}/25</strong></p>
    {flow.verifiedResult?<button type="button" className="a2-mock2-primary" onClick={restart}>Start a new full mock</button>:null}
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
