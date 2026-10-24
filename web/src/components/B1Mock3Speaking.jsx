import React,{useEffect,useMemo,useRef,useState} from "react";
import {useAuth} from "../context/AuthContext";
import AppBackButton from "./navigation/AppBackButton";
import A2MockSpeakingExaminer from "./A2MockSpeakingExaminer";
import {
  startB1Mock3Speaking,saveB1Mock3SpeakingPart,verifyB1Mock3Speaking
} from "../services/b1Mock3SpeakingService";

// B1 Mock 3 is its own draft conversation, not a copy of Mock 1/2.
const TOPICS={
  a:"Sollten Jugendliche neben der Schule einen Nebenjob haben?",
  b:"Ist Sport im Verein besser als Sport allein?"
};
const key=uid=>`falowen:b1-mock-03:sprechen:${uid}:v1`;
const load=uid=>{
  if(!uid)return null;
  try{return JSON.parse(localStorage.getItem(key(uid))||"null")}
  catch{return null}
};
export default function B1Mock3Speaking({embedded=false,onComplete}){
  const {user,idToken}=useAuth();
  const [choice,setChoice]=useState("a");
  const [attempt,setAttempt]=useState(null);
  const [savedParts,setSavedParts]=useState({});
  const [result,setResult]=useState(null);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [now,setNow]=useState(Date.now());
  const partsRef=useRef({});
  const partsSaved=useMemo(()=>Object.values(savedParts).filter(p=>p?.sessionId&&p?.assessment).length,[savedParts]);
  useEffect(()=>{
    const t=window.setInterval(()=>setNow(Date.now()),1000);
    return()=>window.clearInterval(t);
  },[]);
  useEffect(()=>{
    if(!user?.uid)return;
    const local=load(user.uid);
    if(local?.attemptId&&local?.topicChoice) setChoice(local.topicChoice);
  },[user?.uid]);
  const deadline=attempt?.deadlineMs||0;
  const secondsLeft=attempt?Math.max(0,Math.ceil((deadline-now)/1000)):0;
  const begin=async()=>{
    if(busy||!idToken)return;
    setBusy(true);setError("");
    try {
      const active=await startB1Mock3Speaking({idToken,topicChoice:choice});
      const local=load(user?.uid);
      const parts={...(local?.attemptId===active.attemptId?local.parts:{}),...(active.parts||{})};
      partsRef.current=parts;setSavedParts(parts);setResult(null);setAttempt(active);
      if(user?.uid)localStorage.setItem(key(user.uid),JSON.stringify({
        attemptId:active.attemptId,topicChoice:active.topicChoice,parts
      }));
    }catch(err){setError(err?.response?.data?.error||err?.message||"Die Sprachprüfung konnte nicht geöffnet werden.")}
    finally{setBusy(false)}
  };
  const savePart=(teil,receipt,updated)=>{
    if(!attempt?.attemptId||!receipt?.sessionId)return false;
    const merged={...partsRef.current,...updated};
    partsRef.current=merged;setSavedParts(merged);
    if(user?.uid)localStorage.setItem(key(user.uid),JSON.stringify({
      attemptId:attempt.attemptId,topicChoice:attempt.topicChoice,parts:merged
    }));
    // The result endpoint independently verifies every immutable receipt,
    // even if this progress sync was interrupted by the browser/network.
    saveB1Mock3SpeakingPart({
      idToken,attemptId:attempt.attemptId,teil,sessionId:receipt.sessionId
    }).catch(err=>setError(err?.response?.data?.error||
      "Ein Teil konnte nicht in Ihrem Prüfungsverlauf gesichert werden. Die Sprachaufzeichnung ist weiterhin auf dem Server."));
    return true;
  };
  const finalize=async updated=>{
    if(!attempt?.attemptId)throw new Error("Start a saved B1 mock speaking attempt.");
    const combined={...partsRef.current,...updated};
    const sessionIds=["1","2","3"].map(n=>combined[n]?.sessionId||null);
    setError("");
    try{
      const data=await verifyB1Mock3Speaking({idToken,attemptId:attempt.attemptId,sessionIds});
      if(!data?.saved||!data?.verified||data.result?.verifiedBy!=="immutable-live-speak-results"||
        Number(data.result?.maxScore)!==25||!Number.isFinite(Number(data.result?.score)))
        throw new Error("Your B1 speaking mark has not been verified by Falowen.");
      setResult(data.result);
      onComplete?.(data.result);
      if(user?.uid)localStorage.removeItem(key(user.uid));
      return true;
    }catch(err){
      const reason=err?.response?.data?.error||err?.message||"Verification failed.";
      setError(reason);throw new Error(reason);
    }
  };
  return <main className="speaking-exam-page" data-b1-mock3-speaking style={{maxWidth:940,margin:"0 auto",padding:16}}>
    {!embedded?<AppBackButton label="Zurück zu den Probeprüfungen" fallbackPath="/exams/mocks"/>:null}
    <header style={{display:"grid",gap:5}}>
      <p style={{margin:0}}>B1 · Mock 3 · Sprechen</p>
      <h1>Goethe B1 Sprechen · KI-Prüfungspartner</h1>
      <p>Teil 1: Sprachabend planen · Teil 2: Ein Thema präsentieren · Teil 3: Feedback und Fragen.
        Ihre Antworten werden im Gespräch gespeichert und anschließend serverseitig bewertet.</p>
    </header>
    {error?<p role="alert" style={{color:"#9f1239"}}>{error}</p>:null}
    {result?<section role="status">
      <h2>Sprechen: {result.score}/25 Punkte</h2>
      <p>{result.overall_feedback_en}</p>
      {Object.entries(result.parts||{}).map(([teil,part])=><details key={teil}>
        <summary>{teil.replace("teil","Teil ")}: {part.score}/{part.maxScore}</summary>
        <p>{part.feedback_en}</p>
      </details>)}
      <p>Dieser Entwurf liefert nur die Sprechen-Bewertung; ein vollständiges B1 Mock 3 Ergebnis wird noch nicht veröffentlicht.</p>
    </section>:null}
    {!attempt&&!result?<section style={{display:"grid",gap:12}}>
      <fieldset style={{display:"grid",gap:12,border:"1px solid #cbd5e1",borderRadius:12,padding:16}}>
        <legend><strong>Präsentation für Teil 2 wählen</strong></legend>
        {Object.entries(TOPICS).map(([id,title])=><label key={id}>
          <input type="radio" name="b1-mock3-topic" value={id} checked={choice===id}
            onChange={()=>setChoice(id)} /> {id.toUpperCase()}: {title}
        </label>)}
      </fieldset>
      <button type="button" disabled={busy||!idToken} onClick={begin}>
        {busy?"Gespeicherte Prüfung wird geladen …":"B1 Mock 3 Sprechen starten / fortsetzen"}
      </button>
    </section>:null}
    {attempt&&!result?<section>
      <p role="status">{partsSaved}/3 Teile gespeichert. Verbleibende Zeit: {Math.floor(secondsLeft/60)}:{String(secondsLeft%60).padStart(2,"0")}.</p>
      <A2MockSpeakingExaminer key={attempt.attemptId} level="B1" mockId="b1-mock-03"
        attemptId={attempt.attemptId} tasks={attempt.tasks||[]}
        savedParts={savedParts} externalSecondsLeft={secondsLeft}
        onSavePart={savePart} onComplete={finalize}/>
    </section>:null}
  </main>;
}
