import { getStudentMockStorageKey, getA2Mock3StorageKeys, isA2Mock3ReviewReady } from "../utils/mockReviewAccess";
import React, { useCallback, useEffect, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { useAuth } from "../context/AuthContext";
import { markLetterWithAI } from "../services/coachService";
import { A2_MOCK_3_SCHREIBEN as TASK } from "../data/a2Mock3Schreiben";
import "./A2Mock2Lesen.css";
import "./A2GoetheWritingMockPreview.css";

const KEY = "falowen:a2:mock-03:schreiben:v1";
const LIMIT = 30 * 60 * 1000;
const initial = () => ({ startedAt: null, submittedAt: null, sms: "", email: "" });
const load = (storageKey) => { try { const value = JSON.parse(localStorage.getItem(storageKey)); return value?.startedAt ? { ...initial(), ...value } : initial(); } catch { return initial(); } };
const count = (s) => s.trim() ? s.trim().split(/\s+/).length : 0;
const clock = (ms) => { const s = Math.ceil(Math.max(0, ms)/1000); return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`; };
const WordCount = ({ value, task }) => <p className="a2-schreiben-count" aria-live="polite">Words: <strong>{count(value)}</strong> · Target: {task.minWords}–{task.maxWords}</p>;
function A2Mock3SchreibenAttempt({ embedded = false, onComplete, reviewReleased = false }) {
  const { idToken, user } = useAuth();
  const storageKey = getStudentMockStorageKey(KEY, user?.uid);
  const reveal = (!embedded || reviewReleased) && isA2Mock3ReviewReady(getA2Mock3StorageKeys(user?.uid));
  const [draft, setDraft] = useState(() => { const v = load(storageKey); return embedded && !v.startedAt ? { ...v, startedAt: Date.now() } : v; });
  const [now, setNow] = useState(Date.now());
  const [marking, setMarking] = useState(false);
  const [markError, setMarkError] = useState("");
  const deadline = draft.startedAt ? draft.startedAt + LIMIT : null;
  const expired = Boolean(deadline && now >= deadline);
  const done = Boolean(draft.submittedAt || expired);
  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(draft)); }, [draft, storageKey]);
  useEffect(() => { if (!draft.startedAt || draft.submittedAt) return undefined; const t = window.setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, [draft.startedAt, draft.submittedAt]);
  useEffect(() => { if (expired && !draft.submittedAt) setDraft(old => ({ ...old, submittedAt: Date.now() })); }, [expired, draft.submittedAt]);
  const start = () => { setNow(Date.now()); setDraft({ ...initial(), startedAt: Date.now() }); };
  const edit = (field,value) => { if (!done) setDraft(old => ({ ...old, [field]: value })); };
  const clearField = (field) => {
    if (done || !String(draft[field] || "").trim()) return;
    if (!window.confirm("Clear the saved text in this answer field?")) return;
    setDraft(old => ({ ...old, [field]: "" }));
  };
  const mark = useCallback(async () => {
    if (!done || marking) return;
    setMarking(true); setMarkError("");
    try {
      const grades = await Promise.all(["teil1", "teil2"].map(async (part, i) => {
        const t = TASK[part];
        const responseText = i === 0 ? draft.sms : draft.email;
        if (!String(responseText || "").trim()) return { part, score: 0, maxScore: 0, feedback: "No answer submitted." };
        const result = await markLetterWithAI({text: responseText, level: "A2", idToken, taskId: `a2-mock-03-schreiben-${part}`, promptType: i === 0 ? "informal_message" : "formal_email", submissionContext: `A2 Mock 3 Schreiben ${part}`, taskContext: { situation: t.situation, whatToInclude: t.points }});
        return { part, score: result.score, maxScore: result.maxScore, feedback: result.feedback, structuredFeedback: result.structuredFeedback };
      }));
      const completedDraft = {...draft, aiFeedback: grades};
      localStorage.setItem(storageKey, JSON.stringify(completedDraft));
      setDraft(completedDraft);

    } catch (e) { setMarkError(e?.response?.data?.error || e.message || "Bewertung derzeit nicht verfügbar."); }
    finally {setMarking(false);}
  }, [done, marking, draft, idToken, storageKey]);
  useEffect(() => { if (embedded && draft.submittedAt && onComplete) onComplete(); }, [embedded, draft.submittedAt, onComplete]);
  const submit = () => { if (window.confirm("Submit both texts? You cannot change them afterward.")) setDraft(old => ({ ...old, submittedAt: Date.now() })); };
  // AI grading is opt-in after submission to avoid unnecessary model charges.
  return <main className="a2-mock2-shell" lang="en">
    {!embedded ? <div className="a2-mock2-top"><AppBackButton label="Back to Mock Exams" fallbackPath="/exams/mocks" /><span>A2 · Mock 3 · Schreiben</span></div> : null}
    {!draft.startedAt ? <section className="a2-mock2-intro"><p className="a2-mock2-kicker">Mock Exam 3</p><h1>A2 Schreiben</h1><p>You have 30 minutes for two writing tasks. Spend about 15 minutes on each Teil. Write in German and cover all three required points.</p><div className="a2-mock2-stat"><span>30 minutes</span><span>2 tasks</span><span>20–30 / 30–40 words</span></div><p>Your drafts are saved automatically on this device. The timer continues if you leave.</p><button type="button" className="a2-mock2-primary" onClick={start}>Start writing</button></section> : <>
      <header className="a2-mock2-progress"><div><strong>Mock 3 · Schreiben</strong><span>Teil 1 und Teil 2</span></div><strong aria-label="Time remaining">{clock(deadline-now)}</strong></header>
      <article className="a2-mock2-paper a2-schreiben-exam">
        {[["teil1","sms"],["teil2","email"]].map(([key,field]) => { const task = TASK[key]; return <section key={key} className="a2-schreiben-part"><header className="a2-schreiben-part-header"><h2>{task.title}</h2><p>Suggested time: approx. {task.minutes} minutes · {task.minWords}–{task.maxWords} Wörter</p></header><div className="a2-schreiben-task-paper"><p><strong>Situation:</strong> {task.situation}</p><p>{task.instruction}</p><ul className="a2-schreiben-points">{task.points.map(p=><li key={p}>{p}</li>)}</ul>
          {field==="sms" ? <div className="a2-schreiben-sms-frame"><div className="a2-schreiben-sms-header"><span>Nachricht</span><strong>Julia</strong></div><textarea aria-label="A2 Mock 3 Schreiben Teil 1 Nachricht" placeholder="" autoComplete="off" value={draft.sms} disabled={done} onChange={e=>edit("sms",e.target.value)} rows={7}/></div> : <div className="a2-schreiben-email-frame"><div className="a2-schreiben-email-field"><strong>To:</strong><span>{task.recipient}</span></div><div className="a2-schreiben-email-field"><strong>Subject:</strong><span>{task.subject}</span></div><textarea aria-label="A2 Mock 3 Schreiben Teil 2 E-Mail" placeholder="" autoComplete="off" value={draft.email} disabled={done} onChange={e=>edit("email",e.target.value)} rows={10}/></div>}
          {!done && draft[field] ? <button type="button" className="a2-mock2-clear-text" onClick={() => clearField(field)}>Clear answer</button> : null}
          <WordCount value={draft[field]} task={task}/>
        </div></section>; })}
        {done ? <section className="a2-mock2-results"><h2>Writing submitted</h2><p>Your writing is saved on this device. In the complete mock, verified AI grading runs automatically after the speaking exam. Practice feedback is separate from the saved final grade.</p>{!embedded ? <button type="button" className="a2-mock2-primary" disabled={marking} onClick={mark}>{marking ? "AI marking …" : "Get AI writing feedback (practice only)"}</button> : null}{markError?<p role="alert">{markError}</p>:null}{reveal ? draft.aiFeedback?.map(item=><div key={item.part}><h3>{item.part === "teil1" ? "Teil 1" : "Teil 2"} · AI feedback</h3><p>{item.feedback}</p>{Number.isFinite(Number(item.score)) && Number.isFinite(Number(item.maxScore)) ? <p>Practice points: {item.score}/{item.maxScore}</p>:null}</div>) : <p>Feedback appears after all four modules are complete.</p>}{!embedded ? <button type="button" className="a2-mock2-primary" onClick={()=>{if(window.confirm("Start another attempt? The saved draft will be replaced."))start();}}>Practise again</button> : null}</section> : <div className="a2-mock2-actions"><p>Submit both tasks · autosave is on</p><button type="button" className="a2-mock2-primary" onClick={submit}>Submit writing</button></div>}
      </article>
    </>}
  </main>;
}

// Switching accounts must remount local exam state, not copy the prior answers.
export default function A2Mock3Schreiben(props) {
  const { user } = useAuth();
  return <A2Mock3SchreibenAttempt key={user?.uid || "guest"} {...props} />;
}
