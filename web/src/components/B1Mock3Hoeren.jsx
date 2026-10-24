import React,{useEffect,useRef,useState} from "react";
import {useAuth} from "../context/AuthContext";
import AppBackButton from "./navigation/AppBackButton";
import {fetchB1MockAudioPlaybackUrl} from "../services/b1AudioService";
import {getB1Mock3HoerenQuestions,scoreB1Mock3Hoeren} from "../services/b1Mock3HoerenService";
import "./A2Mock2Hoeren.css";

const localKey=uid=>"falowen:b1-mock-03:hoeren:"+uid+":v1";
function readSaved(uid){
  if(!uid)return {};
  try{return JSON.parse(localStorage.getItem(localKey(uid))||"{}")||{}}
  catch{return {}}
}
export default function B1Mock3Hoeren(){
  const {user,idToken}=useAuth();
  const [exam,setExam]=useState(null);
  const [active,setActive]=useState(0);
  const [answers,setAnswers]=useState(()=>readSaved(user?.uid));
  const [result,setResult]=useState(null);
  const [error,setError]=useState("");
  const [audioError,setAudioError]=useState("");
  const [audioUrl,setAudioUrl]=useState("");
  const [audioBusy,setAudioBusy]=useState(false);
  const [playing,setPlaying]=useState(false);
  const [played,setPlayed]=useState({});
  const [saving,setSaving]=useState(false);
  const audio=useRef(null);
  const parts=exam?.parts||[];
  const part=parts[active];
  const answered=parts.flatMap(p=>p.questions).filter(q=>typeof answers[q.number]==="string").length;
  useEffect(()=>{setAnswers(readSaved(user?.uid));setResult(null)},[user?.uid]);
  useEffect(()=>{
    if(user?.uid&&!result)localStorage.setItem(localKey(user.uid),JSON.stringify(answers));
  },[answers,user?.uid,result]);
  useEffect(()=>{
    let cancelled=false;
    if(!idToken){setError("Bitte melden Sie sich an.");return}
    setError("");setExam(null);
    getB1Mock3HoerenQuestions(idToken).then(data=>{if(!cancelled)setExam(data)})
      .catch(err=>{if(!cancelled)setError(err?.response?.data?.error||err?.message||"Die Aufgaben sind noch nicht verfügbar.")});
    return()=>{cancelled=true};
  },[idToken]);
  useEffect(()=>{
    if(audio.current)audio.current.pause();
    setAudioUrl("");setAudioError("");setPlaying(false);
  },[active]);
  const loadAudio=async()=>{
    if(audioBusy||!idToken||!part)return;
    setAudioBusy(true);setAudioError("");
    try{
      const signed=await fetchB1MockAudioPlaybackUrl({
        mockId:"mock-03",part:"teil-"+part.part,key:part.key,idToken
      });
      setAudioUrl(signed.url);
    }catch(err){
      setAudioError(err?.response?.data?.error||err?.message||"Audio ist noch nicht verfügbar.");
    }finally{setAudioBusy(false)}
  };
  const playAudio=async()=>{
    if(!audio.current||!part||played[part.part])return;
    setAudioError("");
    try{
      await audio.current.play();
      setPlaying(true);
      setPlayed(old=>({...old,[part.part]:"started"}));
    }catch(err){setAudioError("Audio konnte nicht gestartet werden. Bitte erneut versuchen.")}
  };
  const submit=async()=>{
    if(saving||answered!==30)return;
    setSaving(true);setError("");
    try{
      const scored=await scoreB1Mock3Hoeren({idToken,answers});
      if(!scored.saved||!scored.practiceOnly||!scored.attemptId)throw new Error("Die serverseitige Bewertung konnte nicht bestätigt werden.");
      setResult(scored);
    }catch(err){setError(err?.response?.data?.error||err?.message||"Speichern fehlgeschlagen. Ihre Antworten bleiben erhalten.")}
    finally{setSaving(false)}
  };
  const reset=()=>{
    setAnswers({});setResult(null);setActive(0);setPlayed({});setAudioUrl("");setError("");
    if(user?.uid)localStorage.removeItem(localKey(user.uid));
  };
  return <main className="a2-mock2-shell" lang="de" data-b1-mock3-hoeren>
    <div className="a2-mock2-top">
      <AppBackButton label="Zurück zu den Probeprüfungen" fallbackPath="/exams/mocks"/>
      <span>B1 · Mock 3 · Hören</span>
    </div>
    <header className="a2-mock2-progress">
      <div><strong>B1 Mock 3 – Hören, Teile 1 bis 4</strong>
        <span>{answered}/30 beantwortet</span></div>
      <strong>Teil {part?.part||1}</strong>
    </header>
    <p role="note">Hören-Übung mit vier Teilen. Die Auswertung wird nach der Abgabe serverseitig gespeichert. Das Ergebnis ist noch kein vollständiges B1-Mock-Ergebnis für Lesen, Hören, Schreiben und Sprechen. Die Wiederholungen sind in den Aufnahmen enthalten.</p>
    {error?<p role="alert">{error}</p>:null}
    {!exam&&!error?<p role="status">Aufgaben werden geladen …</p>:null}
    {exam&&part?<><nav className="a2-mock2-nav" aria-label="Hörteile wählen">
      {parts.map((p,index)=><button key={p.part} type="button" className={index===active?"selected":""}
        onClick={()=>setActive(index)}>Teil {p.part}
        <small>{p.questions.filter(q=>answers[q.number]).length}/{p.count}</small>
      </button>)}
    </nav>
    <section className="a2-mock2-paper">
      <h1>Hören Teil {part.part} · {part.label}</h1>
      {part.part===1?<p role="note"><strong>Bitte beachten:</strong> Zu jedem Kurztext gibt es zwei Aufgaben: Richtig/Falsch und a, b oder c. Die Aufnahme enthält bereits die vorgesehenen Durchgänge.</p>:
        <p>Hören Sie die Aufnahme und wählen Sie zu jeder Aufgabe die richtige Antwort.</p>}
      <div className="a2-mock2-audio">
        <strong>Aufnahme Teil {part.part}</strong>
        <p>Die MP3 wird einmal gestartet. Keine zusätzliche automatische Wiederholung.</p>
        {audioUrl?<><audio ref={audio} src={audioUrl} preload="metadata" controls={false}
          onError={()=>setAudioError("Die Audiodatei konnte nicht abgespielt werden.")}
          onEnded={()=>{setPlaying(false);setPlayed(old=>({...old,[part.part]:"ended"}))}}/>
          <button type="button" disabled={Boolean(played[part.part])} onClick={playAudio}>
            {played[part.part]==="ended"?"Aufnahme beendet":playing?"Aufnahme läuft …":"Audio starten"}
          </button>
        </>:<button type="button" disabled={audioBusy} onClick={loadAudio}>
          {audioBusy?"Audio wird geladen …":"Audio laden"}
        </button>}
        {audioError?<p role="alert">{audioError}
          <button type="button" onClick={()=>{setAudioUrl("");setAudioError("");setPlayed(old=>({...old,[part.part]:undefined}))}}>
            Erneut versuchen
          </button>
        </p>:null}
      </div>
      {part.questions.map(q=><fieldset key={q.number} className="a2-mock2-question" disabled={Boolean(result)}>
        <legend><strong>{q.number}.</strong> {q.question}</legend>
        {q.options.map(o=><label key={o.id} className={answers[q.number]===o.id?"selected":""}>
          <input type="radio" name={"b1mock3-"+q.number} value={o.id}
            checked={answers[q.number]===o.id}
            onChange={()=>setAnswers(old=>({...old,[q.number]:o.id}))}/>
          <span>{q.kind==="multiple-choice"?o.id+") ":""}{o.label}</span>
        </label>)}
      </fieldset>)}
      {!result?<button type="button" disabled={saving||answered!==30} onClick={submit}>
        {saving?"Antworten werden geprüft …":'Alle 30 Antworten abgeben'}
      </button>:<section role="status" aria-live="polite">
        <h2>{result.correct}/30 richtig · {result.percentage} %</h2>
        <p>Ihre Antworten wurden vom Server geprüft und als Hören-Übung gespeichert.</p>
        {result.perPart.map(p=><p key={p.part}>Teil {p.part}: {p.correct}/{p.total}</p>)}
        <button type="button" onClick={reset}>Neue Übung starten</button>
      </section>}
    </section></>:null}
  </main>;
}
