import { getStudentMockStorageKey, getA2Mock2StorageKeys, isA2Mock2ReviewReady } from "../utils/mockReviewAccess";
import React, { useEffect, useRef, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import MockExaminerAudio, { stopMockExaminerAudio } from "./MockExaminerAudio";
import { useAuth } from "../context/AuthContext";
import { analyzeAudio, scoreA2MockSpeaking, TIMED_MOCK_SPEAKING_ANALYZE_TIMEOUT_MS } from "../services/coachService";
import { SPEAKING_AUDIO_MIN_SECONDS, buildRecordedAudioBlob, createSpeakingMediaRecorder, userFacingAudioError } from "../lib/speakingAudio";
import { A2_MOCK_2_SPEAKING as CONTENT, A2_MOCK_2_SPEAKING_RUBRIC as RUBRIC } from "../data/a2Mock2Speaking";
import "./A2Mock2Lesen.css";
import "./A2Mock2Sprechen.css";
const tasks = [
  {id:"t1_questions",teil:"1",title:"Teil 1 · Ask four questions",time:120,display:"Listen to the examiner, then ask one German question for each of the four topic cards.",prompt:`Ask one meaningful German A2 question about each of the four cards: ${CONTENT.cards.map(c=>c.theme+" / "+c.keyword).join("; ")}. ${RUBRIC.teil1}`},
  {id:"t1_answers",teil:"1",title:"Teil 1 · Answer the examiner",time:120,display:"Listen to the examiner's four questions and answer all of them in German.",prompt:`Answer these questions in German: ${CONTENT.cards.map(c=>c.samplePartnerQuestion).join(" | ")}. ${RUBRIC.teil1}`},
  {id:"t2_main",teil:"2",title:"Teil 2 · Talk about yourself",time:120,display:"Speak in German for 1–2 minutes. Cover all four points shown below.",prompt:`${CONTENT.teil2.topic} ${CONTENT.teil2.points.join("; ")}. ${RUBRIC.teil2}`},
  {id:"t2_followups",teil:"2",title:"Teil 2 · Follow-up questions",time:90,display:"Listen to the examiner and answer both follow-up questions in German.",prompt:`${CONTENT.teil2.followups.join(" | ")}. ${RUBRIC.teil2}`},
  {id:"t3_plan",teil:"3",title:"Teil 3 · Plan together",time:240,display:"Listen to your partner's suggestions, then respond in German and plan the party together.",prompt:`${CONTENT.teil3.situation} Punkte: ${CONTENT.teil3.points.join("; ")} Partner sagt: ${CONTENT.teil3.partnerOpening} / ${CONTENT.teil3.partnerFollowup} / ${CONTENT.teil3.partnerLast}. ${RUBRIC.teil3}`},
];

export const getA2Mock2ExaminerPrompt = (id) => {
  switch (id) {
    case "t1_questions": return `Teil eins. Stellen Sie zu jedem Wort eine Frage. ${CONTENT.cards.map(c=>c.keyword).join(". ")}.`;
    case "t1_answers": return `Teil eins. Beantworten Sie bitte diese Fragen. ${CONTENT.cards.map(c=>c.samplePartnerQuestion).join(" ")}`;
    case "t2_main": return `Teil zwei. Erzählen Sie bitte. ${CONTENT.teil2.topic} ${CONTENT.teil2.instruction}`;
    case "t2_followups": return `Teil zwei. Jetzt zwei Fragen. ${CONTENT.teil2.followups.join(" ")}`;
    case "t3_plan": return `Teil drei. Wir planen zusammen eine Feier. ${CONTENT.teil3.partnerOpening} ${CONTENT.teil3.partnerFollowup} ${CONTENT.teil3.partnerLast}`;
    default: return "";
  }
};

const KEY="falowen:a2:mock-02:sprechen:v1";
const getSaved=(storageKey)=>{try{return JSON.parse(localStorage.getItem(storageKey)||"{}")}catch{return {}}};
function A2Mock2SprechenAttempt({ embedded = false, onComplete, reviewReleased = false }){
 const { idToken,user }=useAuth();
 const storageKey = getStudentMockStorageKey(KEY, user?.uid);
 const [attempts,setAttempts]=useState(() => getSaved(storageKey));
 const reveal = (!embedded || reviewReleased) && isA2Mock2ReviewReady(getA2Mock2StorageKeys(user?.uid));
 const [active,setActive]=useState(() => { const saved=getSaved(storageKey);const next=tasks.findIndex(t=>!saved[t.id]?.transcript);return next<0?tasks.length-1:next; });
 const [recording,setRecording]=useState(false);
 const [elapsed,setElapsed]=useState(0);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const [status,setStatus]=useState("");
 const [marking,setMarking]=useState(false);
 const [assessment,setAssessment]=useState(() => getSaved(storageKey)._mock2Assessment || null);
 const [audio,setAudio]=useState(null);
 const recorder=useRef(null),stream=useRef(null),chunks=useRef([]),timer=useRef(null),elapsedRef=useRef(0),urlRef=useRef(null);
 const task=tasks[active];
 useEffect(()=>{localStorage.setItem(storageKey,JSON.stringify(attempts))},[attempts,storageKey]);
 useEffect(()=>()=>{clearInterval(timer.current);if(recorder.current?.state==="recording")recorder.current.stop();stream.current?.getTracks().forEach(t=>t.stop());if(urlRef.current)URL.revokeObjectURL(urlRef.current)},[]);
 const discardPendingAudio=()=>{
  if(urlRef.current)URL.revokeObjectURL(urlRef.current);
  urlRef.current=null;
  chunks.current=[];
  setAudio(null);
 };
 const stop=()=>{if(recorder.current?.state==="recording")recorder.current.stop()};
 const start=async()=>{
  stopMockExaminerAudio();
  setError("");setStatus("");
  try{
   const st=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
   stream.current=st;chunks.current=[];elapsedRef.current=0;setElapsed(0);
   const rec=createSpeakingMediaRecorder(st);recorder.current=rec;
   rec.ondataavailable=e=>{if(e.data?.size)chunks.current.push(e.data)};
   rec.onstop=()=>{
    clearInterval(timer.current);stream.current?.getTracks().forEach(t=>t.stop());stream.current=null;setRecording(false);
    try{
     if(elapsedRef.current<SPEAKING_AUDIO_MIN_SECONDS)throw new Error(`Please record for at least ${SPEAKING_AUDIO_MIN_SECONDS} seconds.`);
     const blob=buildRecordedAudioBlob(chunks.current,rec);
     if(urlRef.current)URL.revokeObjectURL(urlRef.current);
     const url=URL.createObjectURL(blob);urlRef.current=url;setAudio({blob,url,taskId:task.id});setStatus("Recording ready. Play it back, then send your answer.");
    }catch(e){setError(userFacingAudioError(e,e.message))}
   };
   rec.start(1000);setRecording(true);
   timer.current=setInterval(()=>{elapsedRef.current+=1;setElapsed(elapsedRef.current);if(elapsedRef.current>=task.time)stop()},1000);
  }catch(e){stream.current?.getTracks().forEach(t=>t.stop());setError(userFacingAudioError(e,"Microphone access is unavailable."))}
 };
 const send=async()=>{
  if(!audio||audio.taskId!==task.id)return;
  setBusy(true);setError("");setStatus("Transcribing your answer securely …");
  try{
   // Process the recording once, in memory. Only the transcript is needed
   // for the later combined AI evaluation; no Firebase upload or per-clip LLM.
   const response=await analyzeAudio({audioBlob:audio.blob,teil:task.teil,level:"A2",contextType:"A2 Mock 2 Sprechen",question:task.prompt,interactionMode:"single-candidate A2 mock-02 speaking task",userId:user?.uid||"guest",idToken,timeoutMs:TIMED_MOCK_SPEAKING_ANALYZE_TIMEOUT_MS,persistAudio:false,transcriptionOnly:true});
   const transcript=String(response?.transcript||"").trim();
   if(!transcript)throw new Error("No clear speech was detected. Please record your answer again.");
   setAttempts(prev=>({...prev,[task.id]:{transcript,duration:elapsed}}));
   discardPendingAudio();setStatus("Answer saved as a transcript. Your audio recording is not stored.");
   setActive(index => index < tasks.length - 1 ? index + 1 : index);
  }catch(e){setError(userFacingAudioError(e,e.message||"Your recording could not be processed."))}
  finally{setBusy(false)}
 };
 useEffect(() => { if (embedded && tasks.every(t => attempts[t.id]?.transcript) && onComplete) onComplete(); }, [embedded, attempts, onComplete]);
 const completed=tasks.filter(t=>attempts[t.id]?.transcript).length;
 const mark=async()=>{
  if(completed!==tasks.length||marking)return;
  setMarking(true);setError("");
  try {
   const result=await scoreA2MockSpeaking({idToken, mockId:"a2-mock-02", rubric:RUBRIC, attempts:tasks.map(t=>({id:t.id,teil:t.teil,task:t.prompt,transcript:attempts[t.id]?.transcript||"",analysisFeedback:attempts[t.id]?.feedback||""}))});
   setAssessment(result);setStatus("AI practice feedback is ready. A verified final Mock 2 grade is not yet available.");
   const verified = {...attempts, _mock2AiScored:true,_mock2Assessment:result};
   localStorage.setItem(storageKey,JSON.stringify(verified));
   setAttempts(verified);

  } catch(e) {setError(e?.response?.data?.error||e.message||"Speaking could not be marked. Your transcripts are saved; retry marking later.");}
  finally {setMarking(false);}
 };
  // Final AI scoring is opt-in; opening the result page must never incur AI charges.
  return <main className="a2-mock2-shell" lang="en" data-a2-mock2-sprechen>
  {!embedded ? <div className="a2-mock2-top"><AppBackButton label="Back to Mock Exams" fallbackPath="/exams/mocks"/><span>A2 · Mock 2 · Sprechen</span></div> : null}
  <header className="a2-mock2-progress"><div><strong>Sprechen · Übungstest 2</strong><span>{completed}/5 answers submitted · recordings are not stored</span></div><strong>Teil {task.teil}</strong></header>
  <nav className="a2-mock2-speaking-nav">{tasks.map((t,i)=><button type="button" key={t.id} className={active===i?"selected":""} disabled={recording||busy||(i>active&&!attempts[t.id]?.transcript)} onClick={()=>{if(i<=active || Boolean(attempts[t.id]?.transcript)){stopMockExaminerAudio();discardPendingAudio();setActive(i);setError("");}}}>{t.title}{attempts[t.id]?.transcript?" ✓":""}</button>)}</nav>
  <article className="a2-mock2-paper">
   <p className="a2-mock2-kicker">A2 · Sprechen</p><h1>{task.title}</h1><p>{task.display}</p><MockExaminerAudio text={getA2Mock2ExaminerPrompt(task.id)} disabled={recording||busy} />
   {active===0?<div className="a2-mock2-speaking-cards">{CONTENT.cards.map(c=><section key={c.keyword}><small>{c.theme}</small><strong>{c.keyword}</strong></section>)}</div>:null}
   {active===1?<ol>{CONTENT.cards.map(c=><li key={c.keyword}>{c.samplePartnerQuestion}</li>)}</ol>:null}
   {active===2?<section className="a2-mock2-speaking-task"><h2>{CONTENT.teil2.topic}</h2><ul>{CONTENT.teil2.points.map(p=><li key={p}>{p}</li>)}</ul></section>:null}
   {active===3?<ol>{CONTENT.teil2.followups.map(p=><li key={p}>{p}</li>)}</ol>:null}
   {active===4?<section className="a2-mock2-speaking-task"><h2>Überraschungsparty für Thomas</h2><p>{CONTENT.teil3.situation}</p><ul>{CONTENT.teil3.points.map(p=><li key={p}>{p}</li>)}</ul><p><strong>Your partner says:</strong> „{CONTENT.teil3.partnerOpening}“</p><p>„{CONTENT.teil3.partnerFollowup}“</p><p>„{CONTENT.teil3.partnerLast}“</p></section>:null}
   {attempts[task.id]?.transcript?<div className="a2-mock2-speaking-saved"><strong>Answer submitted</strong><p>{attempts[task.id].transcript}</p><p>Only your transcript is saved on this device, not the recording. AI practice marking can review all five transcripts after the mock.</p></div>:<>
   <div className="a2-mock2-speaking-record"><p>Maximum recording time: {Math.floor(task.time/60)} minutes · recorded: {elapsed} seconds</p><button type="button" disabled={busy} onClick={recording?stop:start}>{recording?"Stop recording":"Record answer"}</button>
   {audio?.taskId===task.id?<><audio controls src={audio.url}/><button type="button" onClick={send} disabled={busy}>{busy?"Transcribing …":"Send answer"}</button></>:null}</div></>}
   {assessment && reveal?<section className="a2-mock2-speaking-saved"><h2>Sprechen · AI practice feedback</h2><p>{assessment.overall_feedback_en||assessment.feedback||"Feedback received."}</p>{["teil1","teil2","teil3"].map(k=>assessment.parts?.[k]?<div key={k}><strong>{k.toUpperCase()}</strong><p>{assessment.parts[k].feedback_en||assessment.parts[k].feedback||""}</p></div>:null)}<p>This feedback is for practice only; it is not yet a verified final Mock 2 score.</p></section>:null}
   {status?<p role="status">{status}</p>:null}{error?<p role="alert">{error}</p>:null}
   <div className="a2-mock2-actions"><button type="button" onClick={()=>setActive(i=>Math.max(0,i-1))} disabled={active===0||recording||busy}>Back</button>{active<4?<button type="button" className="a2-mock2-primary" onClick={()=>{stopMockExaminerAudio();discardPendingAudio();setActive(i=>i+1)}} disabled={recording||busy||!attempts[task.id]?.transcript}>Next answer</button>:<strong>{completed===5?<button type="button" className="a2-mock2-primary" onClick={mark} disabled={marking}>{marking?"Marking …":"Get AI speaking feedback"}</button>:"Submit all five answers to finish."}</strong>}</div>
  </article>
 </main>
}

// Switching accounts must remount local exam state, not copy the prior answers.
export default function A2Mock2Sprechen(props) {
  const { user } = useAuth();
  return <A2Mock2SprechenAttempt key={user?.uid || "guest"} {...props} />;
}
