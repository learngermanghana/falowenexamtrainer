import React, { useEffect, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { useAuth } from "../context/AuthContext";
import { markLetterWithAI } from "../services/coachService";
import { A2_MOCK_2_SCHREIBEN as TASK } from "../data/a2Mock2Schreiben";
import "./A2Mock2Lesen.css";
import "./A2GoetheWritingMockPreview.css";

const KEY = "falowen:a2:mock-02:schreiben:v1";
const LIMIT = 30 * 60 * 1000;
const initial = () => ({ startedAt: null, submittedAt: null, sms: "", email: "" });
const load = () => { try { const value = JSON.parse(localStorage.getItem(KEY)); return value?.startedAt ? { ...initial(), ...value } : initial(); } catch { return initial(); } };
const count = (s) => s.trim() ? s.trim().split(/\s+/).length : 0;
const clock = (ms) => { const s = Math.ceil(Math.max(0, ms)/1000); return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`; };
const WordCount = ({ value, task }) => <p className="a2-schreiben-count" aria-live="polite">Wörter: <strong>{count(value)}</strong> · Ziel: {task.minWords}–{task.maxWords}</p>;
export default function A2Mock2Schreiben() {
  const [draft, setDraft] = useState(load);
  const [now, setNow] = useState(Date.now());
  const { idToken } = useAuth();
  const [marking, setMarking] = useState(false);
  const [markError, setMarkError] = useState("");
  const deadline = draft.startedAt ? draft.startedAt + LIMIT : null;
  const expired = Boolean(deadline && now >= deadline);
  const done = Boolean(draft.submittedAt || expired);
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(draft)); }, [draft]);
  useEffect(() => { if (!draft.startedAt || draft.submittedAt) return undefined; const t = window.setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, [draft.startedAt, draft.submittedAt]);
  useEffect(() => { if (expired && !draft.submittedAt) setDraft(old => ({ ...old, submittedAt: Date.now() })); }, [expired, draft.submittedAt]);
  const start = () => { setNow(Date.now()); setDraft({ ...initial(), startedAt: Date.now() }); };
  const edit = (field,value) => { if (!done) setDraft(old => ({ ...old, [field]: value })); };
  const mark = async () => {
    if (!done || marking) return;
    setMarking(true); setMarkError("");
    try {
      const grades = await Promise.all(["teil1", "teil2"].map(async (part, i) => {
        const t = TASK[part];
        const result = await markLetterWithAI({text: i === 0 ? draft.sms : draft.email, level: "A2", idToken, taskId: `a2-mock-02-schreiben-${part}`, promptType: i === 0 ? "informal_message" : "formal_email", submissionContext: `A2 Mock 2 Schreiben ${part}`, taskContext: `${t.situation} ${t.instruction} ${t.points.join("; ")} Word target ${t.minWords}-${t.maxWords}. Assess whether all three required points and correct greeting/closing are present. Do not assess any A2 Mock 1 task.`});
        return { part, score: result.score, maxScore: result.maxScore, feedback: result.feedback, structuredFeedback: result.structuredFeedback };
      }));
      setDraft(old => ({...old, aiFeedback: grades}));
    } catch (e) { setMarkError(e?.response?.data?.error || e.message || "Bewertung derzeit nicht verfügbar."); }
    finally {setMarking(false);}
  };
  const submit = () => { if (window.confirm("Beide Texte abgeben? Danach können Sie nichts mehr ändern.")) setDraft(old => ({ ...old, submittedAt: Date.now() })); };
  return <main className="a2-mock2-shell" lang="de">
    <div className="a2-mock2-top"><AppBackButton label="Zurück zum Prüfungsraum" fallbackPath="/exams/mocks" /><span>A2 · Mock 2 · Schreiben</span></div>
    {!draft.startedAt ? <section className="a2-mock2-intro"><p className="a2-mock2-kicker">Übungstest 2</p><h1>A2 Schreiben</h1><p>Sie haben 30 Minuten für zwei Aufgaben. Teil 1: etwa 10 Minuten, Teil 2: etwa 20 Minuten. Schreiben Sie zu allen drei Punkten und achten Sie auf Anrede und Gruß.</p><div className="a2-mock2-stat"><span>30 Minuten</span><span>2 Aufgaben</span><span>20–30 / 30–40 Wörter</span></div><p>Ihre Entwürfe werden auf diesem Gerät automatisch gespeichert. Die Uhr läuft weiter, wenn Sie die Seite verlassen.</p><button type="button" className="a2-mock2-primary" onClick={start}>Schreiben starten</button></section> : <>
      <header className="a2-mock2-progress"><div><strong>Mock 2 · Schreiben</strong><span>Teil 1 und Teil 2</span></div><strong aria-label="Verbleibende Zeit">{clock(deadline-now)}</strong></header>
      <article className="a2-mock2-paper a2-schreiben-exam">
        {[["teil1","sms"],["teil2","email"]].map(([key,field]) => { const task = TASK[key]; return <section key={key} className="a2-schreiben-part"><header className="a2-schreiben-part-header"><h2>{task.title}</h2><p>Richtzeit: ca. {task.minutes} Minuten · {task.minWords}–{task.maxWords} Wörter</p></header><div className="a2-schreiben-task-paper"><p><strong>Situation:</strong> {task.situation}</p><p>{task.instruction}</p><ul className="a2-schreiben-points">{task.points.map(p=><li key={p}>{p}</li>)}</ul>
          {field==="sms" ? <div className="a2-schreiben-sms-frame"><div className="a2-schreiben-sms-header"><span>Nachricht</span><strong>Julia</strong></div><textarea aria-label="A2 Mock 2 Schreiben Teil 1 Nachricht" placeholder="Hallo Julia, ..." value={draft.sms} disabled={done} onChange={e=>edit("sms",e.target.value)} rows={7}/></div> : <div className="a2-schreiben-email-frame"><div className="a2-schreiben-email-field"><strong>An:</strong><span>{task.recipient}</span></div><div className="a2-schreiben-email-field"><strong>Betreff:</strong><span>{task.subject}</span></div><textarea aria-label="A2 Mock 2 Schreiben Teil 2 E-Mail" placeholder="Sehr geehrte Damen und Herren, ..." value={draft.email} disabled={done} onChange={e=>edit("email",e.target.value)} rows={10}/></div>}
          <WordCount value={draft[field]} task={task}/>
        </div></section>; })}
        {done ? <section className="a2-mock2-results"><h2>Schreiben abgegeben</h2><p>Ihre Texte sind gespeichert. Nutzen Sie dieselbe Falowen-KI wie im ersten A2-Mock, mit den Aufgaben von Mock 2 als Bewertungskontext. Das Ergebnis ist Übungsfeedback, keine serververifizierte Abschlussnote.</p><button type="button" className="a2-mock2-primary" disabled={marking} onClick={mark}>{marking ? "KI bewertet …" : "Mit Falowen-KI auswerten"}</button>{markError?<p role="alert">{markError}</p>:null}{draft.aiFeedback?.map(item=><div key={item.part}><h3>{item.part === "teil1" ? "Teil 1" : "Teil 2"} · KI-Feedback</h3><p>{item.feedback}</p>{Number.isFinite(Number(item.score)) && Number.isFinite(Number(item.maxScore)) ? <p>Übungspunkte: {item.score}/{item.maxScore}</p>:null}</div>)}<button type="button" className="a2-mock2-primary" onClick={()=>{if(window.confirm("Neuen Versuch starten? Der gespeicherte Entwurf wird ersetzt."))start();}}>Erneut üben</button></section> : <div className="a2-mock2-actions"><p>Beide Aufgaben abgeben · automatische Speicherung aktiv</p><button type="button" className="a2-mock2-primary" onClick={submit}>Schreiben abgeben</button></div>}
      </article>
    </>}
  </main>;
}
