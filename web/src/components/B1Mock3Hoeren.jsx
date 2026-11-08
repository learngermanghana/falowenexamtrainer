import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AppBackButton from "./navigation/AppBackButton";
import { fetchB1MockAudioPlaybackUrl } from "../services/b1AudioService";
import { getB1Mock3HoerenQuestions, scoreB1Mock3Hoeren } from "../services/b1Mock3HoerenService";
import "./A2Mock2Hoeren.css";

const storageKey = uid => `falowen:b1-mock-03:hoeren:practice:${uid}:v1`;
function readDraft(uid){
  if(!uid)return {};
  try {return JSON.parse(localStorage.getItem(storageKey(uid))||"{}")||{};}
  catch {return {};}
}

export default function B1Mock3Hoeren({ embedded = false, initialAnswers = {}, initialPlayed = {}, onAnswersChange, onPlayedChange, onComplete } = {}) {
  const { idToken, user } = useAuth();
  const [exam, setExam] = useState(null);
  const [active, setActive] = useState(0);
  const [answers, setAnswers] = useState(() => embedded ? initialAnswers : readDraft(user?.uid));
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [audioError, setAudioError] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [audioBusy, setAudioBusy] = useState(false);
  const [played, setPlayed] = useState(initialPlayed);
  const [busy, setBusy] = useState(false);
  const audioRef = useRef(null);
  const parts = exam?.parts || [];
  const part = parts[active];
  const target = Number(exam?.verifiedQuestionCount || 0);
  const answered = parts.flatMap(x=>x.questions).filter(q=>typeof answers[q.number]==="string").length;

  useEffect(()=>{if(!embedded){setAnswers(readDraft(user?.uid));setResult(null);setPlayed({});}},[user?.uid,embedded]);
  useEffect(()=>{
    let cancelled=false;
    if(!idToken){setExam(null);setError("Bitte melden Sie sich an.");return undefined;}
    setExam(null);setError("");
    getB1Mock3HoerenQuestions(idToken).then(v=>{if(!cancelled)setExam(v);})
      .catch(e=>{if(!cancelled)setError(e?.response?.data?.error||"B1 Mock 3 Hören konnte nicht geladen werden.");});
    return ()=>{cancelled=true;};
  },[idToken]);
  useEffect(()=>{
    if(embedded){onAnswersChange?.(answers);return;}
    if(!user?.uid || result)return;
    try{localStorage.setItem(storageKey(user.uid),JSON.stringify(answers));}
    catch {setError("Antworten konnten auf diesem Gerät nicht gespeichert werden.");}
  },[user?.uid,answers,result,embedded,onAnswersChange]);

  useEffect(()=>{
    if(audioRef.current){audioRef.current.pause();audioRef.current.currentTime=0;}
    setAudioUrl("");setAudioError("");
  },[active]);
  const prepareAudio=async()=>{
    if(audioBusy||!part||!idToken)return;
    setAudioBusy(true);setAudioError("");
    try{
      const signed=await fetchB1MockAudioPlaybackUrl({
        mockId:"mock-03",part:`teil-${part.part}`,key:part.key,idToken,
      });
      setAudioUrl(signed.url);
    }catch(e){
      setAudioError(e?.response?.data?.error||e?.message||"Die Aufnahme konnte nicht geladen werden. Bitte prüfen Sie, ob das R2-Objekt veröffentlicht wurde.");
    }finally{setAudioBusy(false);}
  };
  const startPlayback=()=>{
    if(!audioRef.current||!part||played[part.part])return;
    audioRef.current.play().then(()=>markPlayback(part.part,"started"))
      .catch(()=>setAudioError("Der Browser konnte das Audio nicht starten. Bitte versuchen Sie es noch einmal."));
  };
  const markPlayback=(partNumber,status)=>{
    setPlayed(prev=>{const next={...prev,[partNumber]:status};onPlayedChange?.(next);return next;});
  };
  const submit=async()=>{
    if(busy||target!==30||answered!==target)return;
    if(embedded){onComplete?.(answers);return;}
    setBusy(true);setError("");
    try{
      const scored=await scoreB1Mock3Hoeren({idToken,answers});
      if(!scored.saved||!scored.practiceOnly||scored.partial||Number(scored.total)!==30)
        throw new Error("Der Server hat die Teilbewertung nicht bestätigt.");
      setResult(scored);
    }catch(e){setError(e?.response?.data?.error||e?.message||"Die Bewertung konnte nicht gespeichert werden.");}
    finally{setBusy(false);}
  };
  const reset=()=>{
    if(!window.confirm("Die bisherigen Antworten ersetzen und neu beginnen?"))return;
    setAnswers({});setResult(null);setPlayed({});setActive(0);setAudioUrl("");setError("");
    if(user?.uid)localStorage.removeItem(storageKey(user.uid));
  };

  return <main className="a2-mock2-shell" data-b1-mock3-hoeren lang="de">
    <div className="a2-mock2-top">
      {!embedded ? <AppBackButton label="Zurück zu den Probeprüfungen" fallbackPath="/exams/mocks"/> : null}
      <span>B1 · Mock 3 · Hören (30 Aufgaben)</span>
    </div>
    <header className="a2-mock2-progress">
      <div>
        <strong>B1 Mock 3 · Hören, Teile 1 bis 4</strong>
        <span>{answered}/{target} Aufgaben beantwortet · 4 Teile · ca. 40 Minuten</span>
      </div>
      <strong>Teil {part?.part||1}</strong>
    </header>
    <p role="note" style={{padding:12,borderRadius:8,background:"#f8fafc",border:"1px solid #cbd5e1"}}>
      <strong>Hören-Modul mit 30 Aufgaben.</strong> Alle vier Originalaufnahmen und die passenden Aufgaben sind vorhanden. Ihre Antworten werden anhand des serverseitigen Lösungsschlüssels bewertet. {embedded ? "Nach der Abgabe geht es mit Schreiben weiter. Das Gesamtergebnis wird nach allen vier Modulen serverseitig geprüft." : "Das Ergebnis gilt für Hören, nicht automatisch als Gesamtbewertung der vier Prüfungsmodule."}
    </p>
    {error?<p role="alert">{error}</p>:null}
    {!exam&&!error?<p role="status">Höraufgaben werden geladen …</p>:null}
    {exam?.introductionNotice?<p role="note">{exam.introductionNotice}</p>:null}

    {exam&&part?<><nav className="a2-mock2-nav" aria-label="Hören Teile">
      {parts.map((p,i)=><button key={p.part} type="button" className={i===active?"selected":""}
        onClick={()=>setActive(i)}>
        Teil {p.part} <small>{`${p.questions.filter(q=>answers[q.number]).length}/${p.count}`}</small>
      </button>)}
    </nav>
    <section className="a2-mock2-paper">
      <h1>Hören Teil {part.part}: {part.label}</h1>
      <p>{part.instruction}</p>
      {part.part===1?<p role="note">Die Audio-Ansage nennt eine Richtig/Falsch-Aufgabe pro Text. Für die standardisierte Falowen-Übung kommt je Text eine ergänzende a/b/c-Aufgabe hinzu. Die Aufnahme wird nicht zusätzlich wiederholt.</p>:null}
      <div className="a2-mock2-audio">
        <strong>Original-Prüfungsaudio · Teil {part.part}</strong>
        <p>Geschützte Aufnahme aus Falowen R2. Starten Sie das Audio erst, wenn Sie bereit sind. Einmal pro Versuch; vorhandene Audio-Wiederholungen sind bereits enthalten.</p>
        {audioUrl?<><audio ref={audioRef} src={audioUrl} preload="metadata" controls={false}
          onError={()=>setAudioError("Die R2-Audiodatei konnte nicht abgespielt werden.")}
          onEnded={()=>markPlayback(part.part,"ended")}/>
          <button type="button" disabled={Boolean(played[part.part])} onClick={startPlayback}>
            {played[part.part]?"Aufnahme gestartet":"Audio starten"}
          </button>
        </>:<button type="button" disabled={audioBusy || Boolean(played[part.part])} onClick={prepareAudio}>
          {audioBusy?"Audio wird geladen …":"Audio laden"}
        </button>}
        {audioError?<p role="alert">{audioError}
          <button type="button" disabled={audioBusy || Boolean(played[part.part])} onClick={()=>{setAudioUrl("");setAudioError("");}}>Erneut laden</button>
        </p>:null}
      </div>

      {part.questions.map(q=><fieldset className="a2-mock2-question" key={q.number} disabled={Boolean(result)}>
        <legend><strong>{q.number}.</strong> {q.question}</legend>
        {q.options.map(o=><label key={o.id} className={answers[q.number]===o.id?"selected":""}>
          <input type="radio" name={`b1mock3-${q.number}`} value={o.id}
            checked={answers[q.number]===o.id}
            onChange={()=>setAnswers(prev=>({...prev,[q.number]:o.id}))}/>
          <span>{q.kind==="multiple-choice"?`${o.id}) `:""}{o.label}</span>
        </label>)}
      </fieldset>)}

      {!result ? <button type="button" disabled={busy || answered!==target} onClick={submit}>
        {busy?"Bewertung wird gespeichert …":embedded ? "Hören abschließen → Schreiben" : `Alle ${target} Hören-Antworten einreichen` }
      </button>:null}
      {result?<section role="status" aria-live="polite">
        <h2>Hören-Ergebnis: {result.correct}/{result.total} ({result.percentage} %)</h2>
        <p>Dieses Ergebnis enthält alle 30 Hören-Aufgaben aus Teil 1–4. Die Gesamtbewertung von Lesen, Hören, Schreiben und Sprechen erfolgt separat.</p>
        <ul>{result.perPart.map(x=><li key={x.part}>Teil {x.part}: {x.correct}/{x.total}</li>)}</ul>
        <button type="button" onClick={reset}>Neue Übung starten</button>
      </section>:null}
    </section></>:null}
  </main>;
}
