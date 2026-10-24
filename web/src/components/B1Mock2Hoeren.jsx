import React,{useEffect,useRef,useState} from "react";
import {useAuth} from "../context/AuthContext";
import AppBackButton from "./navigation/AppBackButton";
import {fetchB1MockAudioPlaybackUrl} from "../services/b1AudioService";
import {getB1Mock2HoerenQuestions,scoreB1Mock2Hoeren} from "../services/b1Mock2HoerenService";
import "./A2Mock2Hoeren.css";

const storageKey=(uid,attemptId="")=>`falowen:b1-mock-02:hoeren:${uid}:v1${attemptId?":"+attemptId:""}`;
function loadLocal(uid,attemptId=""){
  if(!uid)return {};
  try{return JSON.parse(localStorage.getItem(storageKey(uid,attemptId))||"{}")||{}}
  catch{return {}}
}
export default function B1Mock2Hoeren({embedded=false,onProgress,onComplete,expired=false,attemptId="",initialAnswers={}}){
  const {idToken,user}=useAuth();
  const [exam,setExam]=useState(null);
  const [active,setActive]=useState(0);
  const [answers,setAnswers]=useState(()=>({...initialAnswers,...loadLocal(user?.uid,attemptId)}));
  const [result,setResult]=useState(null);
  const [error,setError]=useState("");
  const [audioError,setAudioError]=useState("");
  const [audioUrl,setAudioUrl]=useState("");
  const [audioBusy,setAudioBusy]=useState(false);
  const [played,setPlayed]=useState({});
  const [busy,setBusy]=useState(false);
  const audioRef=useRef(null);
  const parts=exam?.parts||[];
  const part=parts[active];
  const total=Number(exam?.questionCount||30);
  const answered=parts.flatMap(p=>p.questions).filter(q=>typeof answers[q.number]==="string").length;
  useEffect(()=>{setAnswers({...initialAnswers,...loadLocal(user?.uid,attemptId)});setResult(null);},[user?.uid,attemptId]);
  useEffect(()=>{
    let cancelled=false;
    if(!idToken){setExam(null);return;}
    setError("");setExam(null);
    getB1Mock2HoerenQuestions(idToken).then(data=>{if(!cancelled)setExam(data)})
      .catch(e=>{if(!cancelled)setError(e?.response?.data?.error||"Hören Mock 2 kann nicht geladen werden.")});
    return()=>{cancelled=true};
  },[idToken]);
  useEffect(()=>{
    if(user?.uid&&!result)localStorage.setItem(storageKey(user.uid,attemptId),JSON.stringify(answers));
    onProgress?.(answers);
  },[user?.uid,attemptId,answers,result,onProgress]);
  useEffect(()=>{
    if(audioRef.current){audioRef.current.pause();audioRef.current.currentTime=0;}
    setAudioUrl("");setAudioError("");
  },[active]);
  const prepareAudio=async()=>{
    if(audioBusy||!part||!idToken)return;
    setAudioBusy(true);setAudioError("");
    try{
      const signed=await fetchB1MockAudioPlaybackUrl({
        mockId:"mock-02",part:`teil-${part.part}`,key:part.key,idToken
      });
      setAudioUrl(signed.url);
    }catch(e){
      setAudioError(e?.response?.data?.error||e?.message||"Prüfungsaudio kann nicht geladen werden.");
    }finally{setAudioBusy(false)}
  };
  const playAudio=()=>{
    if(!audioRef.current||!part||played[part.part]||expired)return;
    audioRef.current.play().then(()=>setPlayed(prev=>({...prev,[part.part]:true})))
      .catch(()=>setAudioError("Der Browser konnte die Aufnahme nicht starten. Bitte erneut tippen."));
  };
  const submit=async()=>{
    if(busy||answered!==total)return;
    setBusy(true);setError("");
    try{
      const scored=await scoreB1Mock2Hoeren({idToken,answers});
      if(!scored.saved||!scored.practiceOnly)throw new Error("Der Server hat das Ergebnis nicht bestätigt.");
      setResult(scored);
      onComplete?.({answers,result:scored});
    }catch(e){setError(e?.response?.data?.error||e.message||"Ergebnis konnte nicht gespeichert werden.");}
    finally{setBusy(false)}
  };
  const reset=()=>{
    setAnswers({});setResult(null);setPlayed({});setActive(0);setAudioUrl("");setError("");
    if(user?.uid)localStorage.removeItem(storageKey(user.uid,attemptId));
  };
  return <main className="a2-mock2-shell" lang="de" data-b1-mock2-hoeren>
    {!embedded?<div className="a2-mock2-top">
      <AppBackButton label="Zurück zu den Probeprüfungen" fallbackPath="/exams/mocks"/>
      <span>B1 · Mock 2 · Hören</span>
    </div>:null}
    <header className="a2-mock2-progress">
      <div><strong>B1 Mock 2 – Hören Teile 1 bis 4</strong>
        <span>{answered}/{total} Aufgaben beantwortet</span></div>
      <strong>Teil {part?.part||1}</strong>
    </header>
    {!embedded?<p role="note">
      Hören-Übung mit vier Teilen. Die Auswertung wird nach der Abgabe serverseitig
      gespeichert. Das Ergebnis ist noch kein vollständiges B1-Mock-Ergebnis
      für Lesen, Hören, Schreiben und Sprechen.
    </p>:null}
    {error?<p role="alert">{error}</p>:null}
    {!exam&&!error?<p role="status">Prüfungsaufgaben werden geladen …</p>:null}
    {exam&&part?<><nav className="a2-mock2-nav" aria-label="Hören Teile">
      {parts.map((p,i)=><button key={p.part} type="button" className={i===active?"selected":""}
        disabled={expired || Boolean(result)} onClick={()=>setActive(i)}>
        Teil {p.part} <small>{p.questions.filter(q=>answers[q.number]).length}/{p.count}</small>
      </button>)}
    </nav>
    {expired?<p role="alert">Die Hören-Zeit ist abgelaufen. Nicht beantwortete Fragen werden als falsch gewertet.</p>:null}
    <section className="a2-mock2-paper">
      <h1>Hören Teil {part.part}: {part.label}</h1>
      {part.part===1?<p role="note">
        <strong>Bitte beachten:</strong> Im Audio wird nur eine Richtig/Falsch-Aufgabe
        angekündigt. In dieser Übung beantworten Sie jedoch <strong>zwei Aufgaben
        pro Text</strong>: zuerst Richtig/Falsch und dann a, b oder c. Die gesamte
        Aufnahme enthält bereits zwei Durchgänge und wird nur einmal gestartet.
      </p>:<p>Hören Sie die Aufnahme und wählen Sie zu jeder Aufgabe die richtige Antwort.</p>}
      <div className="a2-mock2-audio">
        <strong>Prüfungsaudio · Teil {part.part}</strong>
        <p>Die MP3 wird einmal gestartet. Keine zusätzliche automatische Wiederholung.</p>
        {audioUrl?<><audio ref={audioRef} src={audioUrl} preload="metadata" controls={false}
          onError={()=>setAudioError("Audio konnte nicht abgespielt werden.")}
          onEnded={()=>setPlayed(prev=>({...prev,[part.part]:"ended"}))}/>
          <button type="button" disabled={Boolean(played[part.part])||expired} onClick={playAudio}>
            {played[part.part]?"Aufnahme gestartet":"Audio starten"}
          </button>
        </>:<button type="button" disabled={audioBusy||expired} onClick={prepareAudio}>
          {audioBusy?"Audio wird geladen …":"Audio laden"}
        </button>}
        {audioError?<p role="alert">{audioError}{" "}
          <button type="button" disabled={audioBusy} onClick={()=>{setAudioUrl("");setAudioError("")}}>
            Erneut laden
          </button></p>:null}
      </div>
      {part.questions.map(q=><fieldset className="a2-mock2-question" key={q.number} disabled={Boolean(result)||expired}>
        <legend><strong>{q.number}.</strong> {q.question}</legend>
        {q.options.map(o=><label key={o.id} className={answers[q.number]===o.id?"selected":""}>
          <input type="radio" name={`b1mock2-${q.number}`} value={o.id}
            checked={answers[q.number]===o.id} onChange={()=>setAnswers(prev=>({...prev,[q.number]:o.id}))}/>
          <span>{q.kind==="multiple-choice"?`${o.id}) `:""}{o.label}</span>
        </label>)}
      </fieldset>)}
      {!result?<button type="button" disabled={busy||answered!==total||expired} onClick={submit}>
        {busy?"Wird bewertet und gespeichert …":`Alle ${total} Antworten einreichen`}
      </button>:<section role="status" aria-live="polite">
        <h2>Hören-Ergebnis: {result.correct}/{result.total} ({result.percentage} %)</h2>
        <p>Serverseitig gespeichert. Die vollständige B1-Prüfung wird separat bewertet.</p>
        <ul>{result.perPart.map(p=><li key={p.part}>Teil {p.part}: {p.correct}/{p.total}</li>)}</ul>
        <button type="button" onClick={reset}>Neu üben</button>
      </section>}
    </section></>:null}
  </main>;
}
