import React, { useEffect, useRef, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { useAuth } from "../context/AuthContext";
import { fetchA2MockAudioPlaybackUrl } from "../services/a2AudioService";
import { A2_MOCK_2_HOEREN as PARTS, A2_MOCK_2_HOEREN_QUESTIONS as QUESTIONS } from "../data/a2Mock2Hoeren";
import "./A2Mock2Lesen.css";
import "./A2Mock2Hoeren.css";
const STORAGE = "falowen:a2:mock-02:hoeren:v1";
const START = { answers: {}, partIndex: 0, completedAt: null };
const restore = () => { try { return { ...START, ...JSON.parse(localStorage.getItem(STORAGE) || "null") }; } catch { return START; } };
export default function A2Mock2Hoeren({ embedded = false, onComplete }) {
  const { idToken } = useAuth();
  const [exam, setExam] = useState(restore);
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [started, setStarted] = useState({});
  const [ended, setEnded] = useState({});
  const player = useRef(null);
  const part = PARTS[exam.partIndex];
  const finished = Boolean(exam.completedAt);
  useEffect(() => { if (embedded && finished && onComplete) onComplete(); }, [embedded, finished, onComplete]);
  const correct = QUESTIONS.filter(q => String(exam.answers[q.number] || "") === q.answer).length;
  useEffect(() => { localStorage.setItem(STORAGE, JSON.stringify(exam)); }, [exam]);
  useEffect(() => { setAudioUrl(""); setError(""); }, [exam.partIndex]);
  const update = (number, answer) => { if (!finished) setExam(old => ({ ...old, answers: { ...old.answers, [number]: answer } })); };
  const changePart = (index) => {
    if (player.current) player.current.pause();
    setExam(old => ({ ...old, partIndex: index }));
  };
  const loadAudio = async () => {
    if (!idToken) { setError("Bitte melden Sie sich erneut an."); return; }
    setLoading(true); setError("");
    try {
      const result = await fetchA2MockAudioPlaybackUrl({ mockId: "mock-02", part: part.id, key: part.audioObjectKey, idToken });
      setAudioUrl(result.url);
    } catch (e) { setError(e?.response?.data?.error || e?.message || "Audio noch nicht verfügbar. Bitte prüfen Sie die Datei und den Zugriff."); }
    finally { setLoading(false); }
  };
  const selections = Object.values(exam.answers).filter(Boolean);
  const chosenPictureIds = new Set(part.id === "teil-2" ? part.questions.map(q => exam.answers[q.number]).filter(Boolean) : []);
  return <main className="a2-mock2-shell" lang="de" data-a2-mock2-hoeren>
    {!embedded ? <div className="a2-mock2-top"><AppBackButton label="Zurück zum Prüfungsraum" fallbackPath="/exams/mocks"/><span>A2 · Mock 2 · Hören</span></div> : null}
    {!finished ? <>
      <header className="a2-mock2-progress"><div><strong>Hören · Übungstest 2</strong><span>{selections.length}/20 beantwortet</span></div><strong>Teil {exam.partIndex+1}/4</strong></header>
      <nav className="a2-mock2-nav" aria-label="Hören-Teile">{PARTS.map((p,i)=><button type="button" key={p.id} className={i===exam.partIndex?"selected":""} onClick={()=>changePart(i)}>Teil {i+1}<small>{p.questions.filter(q=>exam.answers[q.number]).length}/5</small></button>)}</nav>
      <section className="a2-mock2-paper"><h1>Teil {exam.partIndex+1}</h1><p>{part.instruction}</p>
        <div className="a2-mock2-audio">
          <strong>Prüfungsaudio · Teil {exam.partIndex+1}</strong>
          <p>{part.plays === 2 ? "Der Text wird zweimal im Audio abgespielt." : "Der Text wird einmal abgespielt."} Die Fragen stehen auf dieser Seite.</p>
          {!audioUrl ? <button type="button" onClick={loadAudio} disabled={loading}>{loading?"Audio wird geladen …":"Audio laden"}</button> :
            <><audio ref={player} src={audioUrl} preload="metadata" controls={false}
              onEnded={()=>setEnded(old=>({...old,[part.id]:true}))}/>
              <button type="button" onClick={()=>{if(player.current) { player.current.currentTime=0; player.current.play().then(()=>setStarted(old=>({...old,[part.id]:true}))).catch(e=>setError(e.message)); }}} disabled={Boolean(started[part.id])}>Audio einmal starten</button>
              <span>{ended[part.id]?"Audio beendet":started[part.id]?"Audio läuft":"Noch nicht gestartet"}</span>
            </>}
          {error?<p role="alert">{error}</p>:null}
        </div>
        {part.pictures ? <section><h2>Bilder A–I</h2><p>Wählen Sie jede Aktivität nur einmal. Die Auswahl erfolgt über die Bildbuchstaben.</p><div className="a2-mock2-image-grid">{part.pictures.map(([id,label,icon])=><article key={id}><strong>{id}</strong><span className="a2-mock2-pictogram" aria-hidden="true">{icon}</span><span>{label}</span></article>)}</div></section>:null}
        {part.questions.map(q=><fieldset key={q.number} className="a2-mock2-question"><legend><strong>{q.number}.</strong> {q.question}</legend>
          {part.pictures ? <select aria-label={`Antwort Aufgabe ${q.number}`} value={exam.answers[q.number]||""} onChange={e=>update(q.number,e.target.value)}><option value="">Bitte wählen</option>{part.pictures.map(([id])=><option key={id} value={id.toLowerCase()} disabled={chosenPictureIds.has(id.toLowerCase()) && exam.answers[q.number]!==id.toLowerCase()}>{id}</option>)}</select> :
          (q.options || [{id:"ja",label:"Ja"},{id:"nein",label:"Nein"}]).map(o=><label key={o.id} className={exam.answers[q.number]===o.id?"selected":""}><input type="radio" name={`mock2-hoeren-${q.number}`} checked={exam.answers[q.number]===o.id} onChange={()=>update(q.number,o.id)}/><strong>{o.id.toUpperCase()}</strong><span>{o.label}</span></label>)}
        </fieldset>)}
      </section>
      <div className="a2-mock2-actions"><button type="button" disabled={exam.partIndex===0} onClick={()=>changePart(exam.partIndex-1)}>Zurück</button>{exam.partIndex!==3?<button type="button" className="a2-mock2-primary" onClick={()=>changePart(exam.partIndex+1)}>Weiter</button>:<button type="button" className="a2-mock2-primary" onClick={()=>{if(window.confirm("Hören abgeben?"))setExam(old=>({...old,completedAt:Date.now()}));}}>Hören abgeben</button>}</div>
    </>:<section className="a2-mock2-results"><h1>Hören-Ergebnis</h1><p className="a2-mock2-score">{correct}/20 <small>{Math.round(correct*5)}%</small></p><p>Lesen, Schreiben und Sprechen werden hier nicht bewertet. Hören-Punktzahl: {(correct*25/20).toFixed(1)}/25.</p>
      {PARTS.map((p,i)=><section key={p.id}><h2>Teil {i+1}</h2>{p.questions.map(q=><div className="a2-mock2-review" key={q.number}><strong>{q.number}. {q.question}</strong><p>Ihre Antwort: {(exam.answers[q.number]||"—").toUpperCase()} · Lösung: {q.answer.toUpperCase()}</p></div>)}</section>)}
      <button type="button" className="a2-mock2-primary" onClick={()=>{if(window.confirm("Neuen Versuch starten?")){setExam(START);setStarted({});setEnded({});}}}>Erneut üben</button>
    </section>}
  </main>;
}
