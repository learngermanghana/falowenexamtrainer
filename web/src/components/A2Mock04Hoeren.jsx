import React, { useEffect, useRef, useState } from "react";
import { fetchA2MockAudioPlaybackUrl } from "../services/a2AudioService";
import { A2_MOCK_04_HOEREN } from "../data/a2Mock04Hoeren";
import { A2_MOCK_06_HOEREN } from "../data/a2Mock06Hoeren";
import { A2_MOCK_07_HOEREN } from "../data/a2Mock07Hoeren";
import "./A2Mock2Hoeren.css";

// No answer key or transcript is shipped to the student browser.
export default function A2Mock04Hoeren({ mockId = "a2-mock-04", idToken, value = {}, onChange, onSubmit, timeRemaining }) {
  const parts = mockId === "a2-mock-07" ? A2_MOCK_07_HOEREN : mockId === "a2-mock-06" ? A2_MOCK_06_HOEREN : A2_MOCK_04_HOEREN;
  const [active,setActive] = useState(0);
  const [urls,setUrls] = useState({});
  const [loading,setLoading] = useState(false);
  const [audioError,setAudioError] = useState("");
  const player=useRef(null);
  const part=parts[active];
  const totalAnswered=parts.flatMap(p=>p.questions).filter(q=>value[q.number]).length;
  useEffect(()=>{
    if(player.current){player.current.pause();player.current.currentTime=0;}
    setAudioError("");
  },[active]);
  async function loadAudio() {
    if(loading)return;
    if(!idToken){setAudioError("Bitte melden Sie sich erneut an.");return;}
    setLoading(true);setAudioError("");
    try {
      const result=await fetchA2MockAudioPlaybackUrl({
        mockId:mockId.slice(3),part:part.id,key:part.audioObjectKey,idToken
      });
      setUrls(previous=>({...previous,[part.id]:result.url}));
    }catch(error){
      setAudioError(error?.response?.data?.error || error.message || "Audio konnte nicht geladen werden.");
    }finally{setLoading(false);}
  }
  return <section className="a2-mock2-shell" lang="de" data-a2-kombi-hoeren={mockId}>
    <header className="a2-mock2-progress">
      <div><strong>Hören · Teil {active+1} von 4</strong>
        <span>{totalAnswered} / 20 Antworten</span></div>
      <strong aria-label="Time remaining">{timeRemaining}</strong>
    </header>
    <nav className="a2-mock2-nav" aria-label="Hören Teile">
      {parts.map((section,index)=>
        <button type="button" key={section.id}
          className={index===active?"selected":""} onClick={()=>setActive(index)}>
          Teil {index+1} <small>{section.questions.filter(q=>value[q.number]).length}/5</small>
        </button>)}
    </nav>
    <article className="a2-mock2-paper">
      <h2>Hören Teil {active+1}: {part.title}</h2>
      <p>{part.instruction}</p>
      <div className="a2-mock2-audio">
        <strong>Prüfungsaudio · Teil {active+1}</strong>
        <p>Die Wiederholungen sind bereits in der Aufnahme enthalten. Bitte spielen Sie die Datei nicht zusätzlich automatisch ab.</p>
        {urls[part.id]
          ? <audio ref={player} src={urls[part.id]} controls preload="metadata"
              onError={()=>setAudioError("Die Audiodatei konnte nicht abgespielt werden. Bitte laden Sie sie erneut.")}/>
          : <button type="button" onClick={loadAudio} disabled={loading}>
              {loading?"Audio wird geladen …":"Audio laden"}
            </button>}
        {audioError?<p role="alert">{audioError} <button type="button" onClick={()=>{
          setUrls(old=>({...old,[part.id]:null}));setAudioError("");
        }}>Erneut versuchen</button></p>:null}
      </div>
      {part.questions.map(q=><fieldset key={q.number} className="a2-mock2-question">
        <legend><strong>{q.number}.</strong> {q.question}</legend>
        {q.options.map(option=><label key={option.id} className={value[q.number]===option.id?"selected":""}>
          <input type="radio" name={`a2-${mockId}-hoeren-${q.number}`}
            checked={value[q.number]===option.id}
            onChange={()=>onChange({...value,[q.number]:option.id})}/>
          <span><strong>{active===3?"":`${option.id.toUpperCase()})`}</strong> {option.label}</span>
        </label>)}
      </fieldset>)}
      <footer className="a2-mock2-actions">
        <button type="button" disabled={active===0} onClick={()=>setActive(i=>i-1)}>Zurück</button>
        {active<3
          ?<button type="button" className="a2-mock2-primary" onClick={()=>setActive(i=>i+1)}>Weiter: Teil {active+2}</button>
          :<button type="button" className="a2-mock2-primary" onClick={onSubmit}>Hören abgeben → Schreiben</button>}
      </footer>
    </article>
  </section>;
}
