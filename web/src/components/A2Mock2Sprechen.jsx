import React, { useEffect, useRef, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { useAuth } from "../context/AuthContext";
import { analyzeAudio, scoreA2MockSpeaking, TIMED_MOCK_SPEAKING_ANALYZE_TIMEOUT_MS } from "../services/coachService";
import { SPEAKING_AUDIO_MIN_SECONDS, buildRecordedAudioBlob, createSpeakingMediaRecorder, userFacingAudioError } from "../lib/speakingAudio";
import { A2_MOCK_2_SPEAKING as CONTENT, A2_MOCK_2_SPEAKING_RUBRIC as RUBRIC } from "../data/a2Mock2Speaking";
import "./A2Mock2Lesen.css";
import "./A2Mock2Sprechen.css";
const tasks = [
  {id:"t1_questions",teil:"1",title:"Teil 1 · Fragen stellen",time:120,display:"Stellen Sie eine Frage zu jeder Themenkarte.",prompt:`Ask one meaningful German A2 question about each of the four cards: ${CONTENT.cards.map(c=>c.theme+" / "+c.keyword).join("; ")}. ${RUBRIC.teil1}`},
  {id:"t1_answers",teil:"1",title:"Teil 1 · Antworten",time:120,display:"Antworten Sie auf die vier Partnerfragen.",prompt:`Answer these questions in German: ${CONTENT.cards.map(c=>c.samplePartnerQuestion).join(" | ")}. ${RUBRIC.teil1}`},
  {id:"t2_main",teil:"2",title:"Teil 2 · Von sich erzählen",time:120,display:CONTENT.teil2.instruction,prompt:`${CONTENT.teil2.topic} ${CONTENT.teil2.points.join("; ")}. ${RUBRIC.teil2}`},
  {id:"t2_followups",teil:"2",title:"Teil 2 · Prüferfragen",time:90,display:"Beantworten Sie beide Prüferfragen.",prompt:`${CONTENT.teil2.followups.join(" | ")}. ${RUBRIC.teil2}`},
  {id:"t3_plan",teil:"3",title:"Teil 3 · Gemeinsam planen",time:240,display:"Antworten Sie auf die Vorschläge Ihres Partners und besprechen Sie alle vier Punkte.",prompt:`${CONTENT.teil3.situation} Punkte: ${CONTENT.teil3.points.join("; ")} Partner sagt: ${CONTENT.teil3.partnerOpening} / ${CONTENT.teil3.partnerFollowup} / ${CONTENT.teil3.partnerLast}. ${RUBRIC.teil3}`},
];
const KEY="falowen:a2:mock-02:sprechen:v1";
const getSaved=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch{return {}}};
export default function A2Mock2Sprechen({ embedded = false, onComplete }){
 const { idToken,user }=useAuth();
 const [attempts,setAttempts]=useState(getSaved);
 const [active,setActive]=useState(0);
 const [recording,setRecording]=useState(false);
 const [elapsed,setElapsed]=useState(0);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const [status,setStatus]=useState("");
 const [marking,setMarking]=useState(false);
 const [assessment,setAssessment]=useState(null);
 const [audio,setAudio]=useState(null);
 const recorder=useRef(null),stream=useRef(null),chunks=useRef([]),timer=useRef(null),elapsedRef=useRef(0),urlRef=useRef(null);
 const task=tasks[active];
 useEffect(()=>{localStorage.setItem(KEY,JSON.stringify(attempts))},[attempts]);
 useEffect(()=>()=>{clearInterval(timer.current);if(recorder.current?.state==="recording")recorder.current.stop();stream.current?.getTracks().forEach(t=>t.stop());if(urlRef.current)URL.revokeObjectURL(urlRef.current)},[]);
 const stop=()=>{if(recorder.current?.state==="recording")recorder.current.stop()};
 const start=async()=>{
  setError("");setStatus("");
  try{
   const st=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
   stream.current=st;chunks.current=[];elapsedRef.current=0;setElapsed(0);
   const rec=createSpeakingMediaRecorder(st);recorder.current=rec;
   rec.ondataavailable=e=>{if(e.data?.size)chunks.current.push(e.data)};
   rec.onstop=()=>{
    clearInterval(timer.current);stream.current?.getTracks().forEach(t=>t.stop());stream.current=null;setRecording(false);
    try{
     if(elapsedRef.current<SPEAKING_AUDIO_MIN_SECONDS)throw new Error(`Bitte mindestens ${SPEAKING_AUDIO_MIN_SECONDS} Sekunden aufnehmen.`);
     const blob=buildRecordedAudioBlob(chunks.current,rec);
     if(urlRef.current)URL.revokeObjectURL(urlRef.current);
     const url=URL.createObjectURL(blob);urlRef.current=url;setAudio({blob,url,taskId:task.id});setStatus("Aufnahme bereit. Hören Sie sie an und senden Sie sie.");
    }catch(e){setError(userFacingAudioError(e,e.message))}
   };
   rec.start(1000);setRecording(true);
   timer.current=setInterval(()=>{elapsedRef.current+=1;setElapsed(elapsedRef.current);if(elapsedRef.current>=task.time)stop()},1000);
  }catch(e){stream.current?.getTracks().forEach(t=>t.stop());setError(userFacingAudioError(e,"Mikrofonzugriff nicht möglich."))}
 };
 const send=async()=>{
  if(!audio||audio.taskId!==task.id)return;
  setBusy(true);setError("");setStatus("Audio wird transkribiert und für diese Aufgabe geprüft …");
  try{
   const response=await analyzeAudio({audioBlob:audio.blob,teil:task.teil,level:"A2",contextType:"A2 Mock 2 Sprechen — "+RUBRIC.assessmentIdentity,question:task.prompt,interactionMode:"single-candidate A2 mock-02 speaking task",userId:user?.uid||"guest",idToken,timeoutMs:TIMED_MOCK_SPEAKING_ANALYZE_TIMEOUT_MS});
   const transcript=String(response?.transcript||"").trim();
   if(!transcript)throw new Error("Keine verständliche Aufnahme erkannt. Bitte erneut aufnehmen.");
   setAttempts(prev=>({...prev,[task.id]:{transcript,duration:elapsed,feedback:String(response?.feedback||"")}}));
   if(urlRef.current)URL.revokeObjectURL(urlRef.current);urlRef.current=null;setAudio(null);setStatus("Antwort gespeichert. Weiter zur nächsten Aufgabe.");
  }catch(e){setError(userFacingAudioError(e,e.message||"Audio konnte nicht ausgewertet werden."))}
  finally{setBusy(false)}
 };
 const completed=tasks.filter(t=>attempts[t.id]?.transcript).length;
 const mark=async()=>{
  if(completed!==tasks.length||marking)return;
  setMarking(true);setError("");
  try {
   const result=await scoreA2MockSpeaking({idToken, mockId:"a2-mock-02", rubric:RUBRIC, attempts:tasks.map(t=>({id:t.id,teil:t.teil,task:t.prompt,transcript:attempts[t.id]?.transcript||"",analysisFeedback:attempts[t.id]?.feedback||""}))});
   setAssessment(result);setStatus("KI-Feedback erhalten. Die abschließende serververifizierte Mock-2-Note ist noch nicht verfügbar.");
   const verified = {...attempts, _mock2AiScored:true};
   localStorage.setItem(KEY,JSON.stringify(verified));
   setAttempts(verified);
   if(embedded && onComplete) onComplete();
  } catch(e) {setError(e?.response?.data?.error||e.message||"Sprechen konnte nicht bewertet werden.");}
  finally {setMarking(false);}
 };
 useEffect(()=>{if(embedded && completed===5 && !marking && !assessment && !error && !attempts._mock2AiScored)mark();},[embedded,completed,marking,assessment,error,attempts._mock2AiScored]);
  return <main className="a2-mock2-shell" lang="de" data-a2-mock2-sprechen>
  {!embedded ? <div className="a2-mock2-top"><AppBackButton label="Zurück zum Prüfungsraum" fallbackPath="/exams/mocks"/><span>A2 · Mock 2 · Sprechen</span></div> : null}
  <header className="a2-mock2-progress"><div><strong>Sprechen · Übungstest 2</strong><span>{completed}/5 Aufnahmen abgegeben</span></div><strong>Teil {task.teil}</strong></header>
  <nav className="a2-mock2-speaking-nav">{tasks.map((t,i)=><button type="button" key={t.id} className={active===i?"selected":""} disabled={recording||busy} onClick={()=>{setActive(i);setAudio(null);setError("");}}>{t.title}{attempts[t.id]?.transcript?" ✓":""}</button>)}</nav>
  <article className="a2-mock2-paper">
   <p className="a2-mock2-kicker">A2 · Sprechen</p><h1>{task.title}</h1><p>{task.display}</p>
   {active===0?<div className="a2-mock2-speaking-cards">{CONTENT.cards.map(c=><section key={c.keyword}><small>{c.theme}</small><strong>{c.keyword}</strong></section>)}</div>:null}
   {active===1?<ol>{CONTENT.cards.map(c=><li key={c.keyword}>{c.samplePartnerQuestion}</li>)}</ol>:null}
   {active===2?<section className="a2-mock2-speaking-task"><h2>{CONTENT.teil2.topic}</h2><ul>{CONTENT.teil2.points.map(p=><li key={p}>{p}</li>)}</ul></section>:null}
   {active===3?<ol>{CONTENT.teil2.followups.map(p=><li key={p}>{p}</li>)}</ol>:null}
   {active===4?<section className="a2-mock2-speaking-task"><h2>Überraschungsparty für Thomas</h2><p>{CONTENT.teil3.situation}</p><ul>{CONTENT.teil3.points.map(p=><li key={p}>{p}</li>)}</ul><p><strong>Ihr Partner:</strong> „{CONTENT.teil3.partnerOpening}“</p><p>„{CONTENT.teil3.partnerFollowup}“</p><p>„{CONTENT.teil3.partnerLast}“</p></section>:null}
   {attempts[task.id]?.transcript?<div className="a2-mock2-speaking-saved"><strong>Antwort eingereicht</strong><p>{attempts[task.id].transcript}</p><p>Ihre Aufnahme wurde transkribiert. Die endgültige Mock-2-Bewertung wird erst nach Einrichtung der passenden Bewertungslogik angezeigt.</p>{(assessment || attempts._mock2AiScored) && attempts[task.id]?.feedback ? <p><strong>KI-Aufgabenfeedback:</strong> {attempts[task.id].feedback}</p> : null}</div>:<>
   <div className="a2-mock2-speaking-record"><p>Maximale Aufnahmezeit: {Math.floor(task.time/60)} Minuten · aufgenommen: {elapsed} Sekunden</p><button type="button" disabled={busy} onClick={recording?stop:start}>{recording?"Aufnahme beenden":"Aufnahme starten"}</button>
   {audio?.taskId===task.id?<><audio controls src={audio.url}/><button type="button" onClick={send} disabled={busy}>{busy?"Wird verarbeitet …":"Antwort senden"}</button></>:null}</div></>}
   {assessment?<section className="a2-mock2-speaking-saved"><h2>Sprechen · KI-Übungsfeedback</h2><p>{assessment.overall_feedback_en||assessment.feedback||"Auswertung empfangen."}</p>{["teil1","teil2","teil3"].map(k=>assessment.parts?.[k]?<div key={k}><strong>{k.toUpperCase()}</strong><p>{assessment.parts[k].feedback_en||assessment.parts[k].feedback||""}</p></div>:null)}<p>Diese Auswertung ist noch nicht als Mock-2-Gesamtergebnis verifiziert.</p></section>:null}
   {status?<p role="status">{status}</p>:null}{error?<p role="alert">{error}</p>:null}
   <div className="a2-mock2-actions"><button type="button" onClick={()=>setActive(i=>Math.max(0,i-1))} disabled={active===0||recording||busy}>Zurück</button>{active<4?<button type="button" className="a2-mock2-primary" onClick={()=>{setActive(i=>i+1);setAudio(null)}} disabled={recording||busy}>Weiter</button>:<strong>{completed===5?<button type="button" className="a2-mock2-primary" onClick={mark} disabled={marking}>{marking?"KI bewertet …":"Sprechen mit KI bewerten"}</button>:"Bitte alle fünf Aufnahmen einreichen."}</strong>}</div>
  </article>
 </main>
}
