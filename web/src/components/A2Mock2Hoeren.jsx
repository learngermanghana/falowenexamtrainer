import { getStudentMockStorageKey, getA2Mock2StorageKeys, isA2Mock2ReviewReady } from "../utils/mockReviewAccess";
import React, { useEffect, useRef, useState } from "react";
import { arrangeMockChoices, mockDisplayAnswer } from "../utils/mockChoicePresentation";
import AppBackButton from "./navigation/AppBackButton";
import { useAuth } from "../context/AuthContext";
import { fetchA2MockAudioPlaybackUrl } from "../services/a2AudioService";
import { A2_MOCK_2_HOEREN as PARTS, A2_MOCK_2_HOEREN_QUESTIONS as QUESTIONS } from "../data/a2Mock2Hoeren";
import "./A2Mock2Lesen.css";
import "./A2Mock2Hoeren.css";
const STORAGE = "falowen:a2:mock-02:hoeren:v1";
const START = { answers: {}, partIndex: 0, completedAt: null };
const restore = (storageKey) => { try { return { ...START, ...JSON.parse(localStorage.getItem(storageKey) || "null") }; } catch { return START; } };
function A2Mock2HoerenAttempt({ embedded = false, onComplete, reviewReleased = false }) {
  const { idToken, user } = useAuth();
  const storageKey = getStudentMockStorageKey(STORAGE, user?.uid);
  const [exam, setExam] = useState(() => restore(storageKey));
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [started, setStarted] = useState({});
  const [ended, setEnded] = useState({});
  const player = useRef(null);
  const part = PARTS[exam.partIndex];
  const finished = Boolean(exam.completedAt);
  const reveal = (!embedded || reviewReleased) && isA2Mock2ReviewReady(getA2Mock2StorageKeys(user?.uid));
  const correct = QUESTIONS.filter(q => String(exam.answers[q.number] || "") === q.answer).length;
  // Save the completed Hören attempt before notifying the main mock tracker.
  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(exam)); }, [exam, storageKey]);
  useEffect(() => { if (embedded && finished && onComplete) onComplete(); }, [embedded, finished, onComplete]);
  useEffect(() => { setAudioUrl(""); setError(""); }, [exam.partIndex]);
  const update = (number, answer) => { if (!finished) setExam(old => ({ ...old, answers: { ...old.answers, [number]: answer } })); };
  const changePart = (index) => {
    if (player.current) player.current.pause();
    setExam(old => ({ ...old, partIndex: index }));
  };
  const loadAudio = async () => {
    if (!idToken) { setError("Please sign in again."); return; }
    setLoading(true); setError("");
    try {
      const result = await fetchA2MockAudioPlaybackUrl({ mockId: "mock-02", part: part.id, key: part.audioObjectKey, idToken });
      setAudioUrl(result.url);
    } catch (e) { setError(e?.response?.data?.error || e?.message || "This exam audio is unavailable. Please check your access."); }
    finally { setLoading(false); }
  };
  const selections = Object.values(exam.answers).filter(Boolean);
  const chosenPictureIds = new Set(part.id === "teil-2" ? part.questions.map(q => exam.answers[q.number]).filter(Boolean) : []);
  const pictureChoices = part.pictures
    ? arrangeMockChoices(part.pictures.map(([id, label, icon]) => ({id: id.toLowerCase(), label, icon})), "a2-mock2-picture-board")
    : [];
  return <main className="a2-mock2-shell" lang="en" data-a2-mock2-hoeren>
    {!embedded ? <div className="a2-mock2-top"><AppBackButton label="Back to Mock Exams" fallbackPath="/exams/mocks"/><span>A2 · Mock 2 · Hören</span></div> : null}
    {!finished ? <>
      <header className="a2-mock2-progress"><div><strong>Hören · Übungstest 2</strong><span>{selections.length}/20 beantwortet</span></div><strong>Teil {exam.partIndex+1}/4</strong></header>
      <nav className="a2-mock2-nav" aria-label="Hören-Teile">{PARTS.map((p,i)=><button type="button" key={p.id} className={i===exam.partIndex?"selected":""} onClick={()=>changePart(i)}>Teil {i+1}<small>{p.questions.filter(q=>exam.answers[q.number]).length}/5</small></button>)}</nav>
      <section className="a2-mock2-paper"><h1>Teil {exam.partIndex+1}</h1><p>{part.instruction}</p>
        <div className="a2-mock2-audio">
          <strong>Exam audio · Teil {exam.partIndex+1}</strong>
          <p>{part.plays === 2 ? "The required repetition is included in the audio." : "This exam audio plays once."} The exam questions are shown below.</p>
          {!audioUrl ? <button type="button" onClick={loadAudio} disabled={loading}>{loading?"Loading audio …":"Load audio"}</button> :
            <><audio ref={player} src={audioUrl} preload="metadata" controls={false}
              onEnded={()=>setEnded(old=>({...old,[part.id]:true}))}/>
              <button type="button" onClick={()=>{if(player.current) { player.current.currentTime=0; player.current.play().then(()=>setStarted(old=>({...old,[part.id]:true}))).catch(e=>setError(e.message)); }}} disabled={Boolean(started[part.id])}>Start audio</button>
              <span>{ended[part.id]?"Audio finished":started[part.id]?"Audio playing":"Not started"}</span>
            </>}
          {error?<p role="alert">{error}</p>:null}
        </div>
        {part.pictures ? <section><h2>Bilder A–I</h2><p>Use each activity only once. Choose the corresponding picture letter.</p><div className="a2-mock2-image-grid">{pictureChoices.map(({id,displayId,label,icon})=><article key={id}><strong>{displayId.toUpperCase()}</strong><span className="a2-mock2-pictogram" aria-hidden="true">{icon}</span><span>{label}</span></article>)}</div></section>:null}
        {part.questions.map(q=><fieldset key={q.number} className="a2-mock2-question"><legend><strong>{q.number}.</strong> {q.question}</legend>
          {part.pictures ? <select aria-label={`Antwort Aufgabe ${q.number}`} value={exam.answers[q.number]||""} onChange={e=>update(q.number,e.target.value)}><option value="">Please choose</option>{pictureChoices.map(({id,displayId})=><option key={id} value={id} disabled={chosenPictureIds.has(id) && exam.answers[q.number]!==id}>{displayId.toUpperCase()}</option>)}</select> :
          (q.options ? arrangeMockChoices(q.options, `a2-mock2-hoeren-${q.number}`) : [{id:"ja",displayId:"ja",label:"Ja"},{id:"nein",displayId:"nein",label:"Nein"}]).map(o=><label key={o.id} className={exam.answers[q.number]===o.id?"selected":""}><input type="radio" name={`mock2-hoeren-${q.number}`} checked={exam.answers[q.number]===o.id} onChange={()=>update(q.number,o.id)}/><strong>{o.displayId.toUpperCase()}</strong><span>{o.label}</span></label>)}
        </fieldset>)}
      </section>
      <div className="a2-mock2-actions"><button type="button" disabled={exam.partIndex===0} onClick={()=>changePart(exam.partIndex-1)}>Back</button>{exam.partIndex!==3?<button type="button" className="a2-mock2-primary" onClick={()=>changePart(exam.partIndex+1)}>Next</button>:<button type="button" className="a2-mock2-primary" onClick={()=>{if(window.confirm("Submit listening?"))setExam(old=>({...old,completedAt:Date.now()}));}}>Submit listening</button>}</div>
    </>:!reveal ? <p>Listening submitted. Correct answers appear after all four modules are complete.</p> : <section className="a2-mock2-results"><h1>Your listening result</h1><p className="a2-mock2-score">{correct}/20 <small>{Math.round(correct*5)}%</small></p><p>Reading, writing and speaking are not marked here. Listening points: {(correct*25/20).toFixed(1)}/25.</p>
      {PARTS.map((p,i)=><section key={p.id}><h2>Teil {i+1}</h2>{p.questions.map(q=><div className="a2-mock2-review" key={q.number}><strong>{q.number}. {q.question}</strong><p>Your answer: {(p.pictures ? mockDisplayAnswer(p.pictures.map(([id,label,icon]) => ({id:id.toLowerCase(),label,icon})), exam.answers[q.number], "a2-mock2-picture-board") : q.options ? mockDisplayAnswer(q.options, exam.answers[q.number], `a2-mock2-hoeren-${q.number}`) : (exam.answers[q.number]||"—").toUpperCase())} · Correct answer: {p.pictures ? mockDisplayAnswer(p.pictures.map(([id,label,icon]) => ({id:id.toLowerCase(),label,icon})), q.answer, "a2-mock2-picture-board") : q.options ? mockDisplayAnswer(q.options, q.answer, `a2-mock2-hoeren-${q.number}`) : q.answer.toUpperCase()}</p></div>)}</section>)}
      <button type="button" className="a2-mock2-primary" onClick={()=>{if(window.confirm("Start another attempt?")){setExam(START);setStarted({});setEnded({});}}}>Practise again</button>
    </section>}
  </main>;
}

// Switching accounts must remount local exam state, not copy the prior answers.
export default function A2Mock2Hoeren(props) {
  const { user } = useAuth();
  return <A2Mock2HoerenAttempt key={user?.uid || "guest"} {...props} />;
}
