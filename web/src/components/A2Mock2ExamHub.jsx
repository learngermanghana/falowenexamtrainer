import { getA2Mock2StorageKeys, isA2Mock2ReviewReady } from "../utils/mockReviewAccess";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { announceExamSuccess } from "../services/interactionFeedback";
import AppBackButton from "./navigation/AppBackButton";
import { useAuth } from "../context/AuthContext";
import { getBackendUrl } from "../services/backendUrl";
import { syncA2Mock2Backup } from "../services/a2Mock2Backup";
import { getMockAnswerBackup, restoreA2Mock2Backup, syncA2Mock2Backup } from "../services/a2Mock2Backup";
import A2Mock2Lesen from "./A2Mock2Lesen";
import A2Mock2Hoeren from "./A2Mock2Hoeren";
import A2Mock2Schreiben from "./A2Mock2Schreiben";
import A2Mock2Sprechen from "./A2Mock2Sprechen";
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
  sprechen: { done: Boolean(["t1_questions","t1_answers","t2_main","t2_followups","t3_plan"].every(k => s[k]?.transcript)), count: ["t1_questions","t1_answers","t2_main","t2_followups","t3_plan"].filter(k => s[k]?.transcript).length },
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
   setBackupNotice("Gespeicherte Antworten wiederhergestellt.");
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
 // Back up only completed text/choice modules, never speaking/audio.
 // Failures are best effort and must not interfere with the exam.
 useEffect(() => {
  if (!idToken || !user?.uid || !flow.startedAt) return;
  const eligible = ["lesen","hoeren","schreiben"].some(key => progress[key].done);
  if (!eligible) return;
  syncA2Mock2Backup(STORAGE, flow.startedAt, idToken, user.uid).catch(() => {
   // The browser copy remains available; retry when progress changes.
  });
 }, [idToken, user?.uid, flow.startedAt, progress, STORAGE]);
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
  if (!isA2Mock2ReviewReady(STORAGE) || !window.confirm("Neuen vollständigen Mocktest starten? Ihr abgeschlossenes Ergebnis bleibt im Verlauf gespeichert.")) return;
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
 return <main className="a2-mock2-full" lang="de">
   <div className="a2-mock2-top"><AppBackButton label="Zurück zu den Mocktests" fallbackPath="/exams/mocks"/><span>A2 · Mockprüfung 2</span></div>
   <header className="a2-mock2-full-heading">
    <p className="a2-mock2-kicker">A2 · Vollständiger Übungstest 2</p>
    <h1>A2 Mock 2</h1>
    <p>Lesen · Hören · Schreiben · Sprechen — ein Start, vier Prüfungsteile.</p>
   </header>
   <section className="a2-mock2-full-progress" aria-label="Fortschritt der vier Module">
    <div className="a2-mock2-full-progress-head"><strong>Prüfungsfortschritt</strong><span>{completed} von 4 Modulen abgeschlossen</span></div>{backupNotice ? <p role="status">{backupNotice}</p> : null}
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
   {stage==="result" && isA2Mock2ReviewReady(STORAGE)?<section className="a2-mock2-full-intro">
    <h2>Alle vier Module bearbeitet</h2>
    <p>Vielen Dank. Ihre Antworten bleiben auf diesem Gerät gespeichert. Die KI-Auswertung erfolgt separat und kann bei einem Fehler erneut gestartet werden, ohne den Mocktest zu wiederholen.</p>
    <p>Lesen: <strong>{progress.lesen.score.toFixed(1)}/25</strong> · Hören: <strong>{progress.hoeren.score.toFixed(1)}/25</strong></p>
    <button type="button" className="a2-mock2-primary" onClick={restart}>Neuen vollständigen Mocktest starten</button>
    {resetError ? <p role="alert">{resetError}</p> : null}
    <details><summary>Lesen · Antworten und Lösungen ansehen</summary><A2Mock2Lesen embedded reviewReleased /></details>
    <details><summary>Hören · Antworten und Lösungen ansehen</summary><A2Mock2Hoeren embedded reviewReleased /></details>
    <details><summary>Schreiben · KI-Feedback / erneut bewerten</summary><A2Mock2Schreiben embedded reviewReleased /></details>
    <details><summary>Sprechen · KI-Feedback / erneut bewerten</summary><A2Mock2Sprechen embedded reviewReleased /></details>
    <p>Ein verifiziertes Gesamtergebnis von 100 Punkten wird erst angezeigt, wenn die KI-Bewertungen von Schreiben und Sprechen sicher dem zweiten Mocktest zugeordnet werden können.</p>
   </section>:null}
 </main>;
}

// Switching accounts must remount local exam state, not copy the prior answers.
export default function A2Mock2ExamHub(props) {
  const { user } = useAuth();
  return <A2Mock2ExamHubAttempt key={user?.uid || "guest"} {...props} />;
}
