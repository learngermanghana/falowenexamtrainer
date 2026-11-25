import { SavedMockListeningReview } from "./MockListeningReview";
import { runA2MockSubmissionStep } from "../services/a2MockSubmissionDiagnostics";
import { resumeA2MockSections } from "../services/a2MockCloudResume";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AppBackButton from "./navigation/AppBackButton";
import { announceExamSuccess } from "../services/interactionFeedback";
import { startA2MockAttempt, saveA2MockAttempt } from "../services/a2FinalMockService";
import { finalizeA2Mock3, savedA2Mock3State } from "../services/a2Mock3Finalization";
import { getA2Mock3StorageKeys, isA2Mock3ReviewReady } from "../utils/mockReviewAccess";
import A2Mock3Lesen from "./A2Mock3Lesen";
import A2Mock3Hoeren from "./A2Mock3Hoeren";
import A2Mock3Schreiben from "./A2Mock3Schreiben";
import A2Mock3ConversationalSpeaking from "./A2Mock3ConversationalSpeaking";
import "./A2Mock2ExamHub.css";
import "./A2Mock2Lesen.css";

const ORDER = ["lesen","hoeren","schreiben","sprechen"];
const LABELS = ["Lesen","Hören","Schreiben","Sprechen"];
const read = key => {
  try { return JSON.parse(localStorage.getItem(key) || "{}") || {}; }
  catch { return {}; }
};
function progressFor(keys) {
  const l=read(keys.lesen),h=read(keys.hoeren),w=read(keys.schreiben),s=read(keys.sprechen);
  return {
    lesen:{done:Boolean(l.completedAt),count:Object.values(l.answers || {}).filter(Boolean).length},
    hoeren:{done:Boolean(h.completedAt),count:Object.values(h.answers || {}).filter(Boolean).length},
    schreiben:{done:Boolean(w.submittedAt),count:[w.sms,w.email].filter(t=>String(t||"").trim()).length},
    sprechen:{done:["1","2","3"].every(part=>Boolean(s._examinerParts?.[part]?.sessionId && s._examinerParts?.[part]?.assessment)),
      count:["1","2","3"].filter(part=>s._examinerParts?.[part]?.sessionId && s._examinerParts?.[part]?.assessment).length},
  };
}
function initialize(keys) {
  const existing=read(keys.flow);
  const progress=progressFor(keys);
  const next=ORDER.find(k=>!progress[k].done);
  const started=ORDER.some(k=>progress[k].done || progress[k].count>0);
  if(existing?.stage && ["intro",...ORDER,"result"].includes(existing.stage)) {
    if(existing.stage==="result" && !isA2Mock3ReviewReady(keys)) return {...existing,stage:next||"sprechen"};
    return existing;
  }
  return {stage:started?(next||"result"):"intro",startedAt:started?Date.now():null};
}

function A2Mock3ExamHubAttempt() {
  const {idToken,user}=useAuth();
  const keys=useMemo(()=>getA2Mock3StorageKeys(user?.uid),[user?.uid]);
  const [flow,setFlow]=useState(()=>initialize(keys));
  const [progress,setProgress]=useState(()=>progressFor(keys));
  const [connectionError,setConnectionError]=useState("");
  const [retryConnect,setRetryConnect]=useState(0);
  const [finalError,setFinalError]=useState("");
  const [finalBusy,setFinalBusy]=useState(false);
  const [retryFinal,setRetryFinal]=useState(0);
  const connecting=useRef(false);
  const finalizing=useRef(null);
  const stage=flow.stage;
  const [resuming, setResuming] = useState(false);
  const [checkpoint, setCheckpoint] = useState("");
  const [checkpointRetry, setCheckpointRetry] = useState(0);
  const uploadRetry = useRef(false);
  const checkpointSpeaking = useCallback(() => setCheckpointRetry(value => value + 1), []);
  const retryCheckpoint = () => {
    uploadRetry.current = true;
    checkpointSpeaking();
  };
  const resumeAttempt = async (startIfMissing = false) => {
    setResuming(true);
    setConnectionError("");
    try {
      const resumed = await resumeA2MockSections({ keys: keys, idToken, mockId: "a2-mock-03" });
      if (!resumed) {
        if (!startIfMissing) throw new Error("No active attempt was found on your account.");
        setFlow({ stage: "lesen", startedAt: Date.now() });
        return;
      }
      setProgress(progressFor(keys));
      setFlow(resumed);
    } catch (error) {
      setConnectionError(error.message);
    } finally {
      setResuming(false);
    }
  };

  const complete=ORDER.filter(k=>progress[k].done).length;
  const index=ORDER.indexOf(stage);

  useEffect(()=>{localStorage.setItem(keys.flow,JSON.stringify(flow));},[flow,keys]);
  useEffect(()=>{
    const refresh=()=>setProgress(progressFor(keys));
    window.addEventListener("focus",refresh);
    return ()=>window.removeEventListener("focus",refresh);
  },[keys]);

  useEffect(()=>{
    if (!idToken || !user?.uid || stage==="intro" || flow.attemptInfo?.attemptId || connecting.current) return;
    connecting.current=true;
    setConnectionError("");
    startA2MockAttempt({idToken,mockId:"a2-mock-03"}).then(reply=>{
      if(!reply?.attemptId)throw new Error("Exam server did not provide a Mock 03 attempt.");
      setFlow(old=>({...old,attemptInfo:{
        attemptId:reply.attemptId,attemptNumber:reply.attemptNumber,firstAttempt:reply.firstAttempt,
      }}));
    }).catch(err=>{
      setConnectionError(err?.response?.data?.error || err.message || "Could not register Mock 03.");
    }).finally(()=>{connecting.current=false;});
  },[idToken,user?.uid,stage,flow.attemptInfo?.attemptId,retryConnect]);

  useEffect(()=>{
    const attemptId=flow.attemptInfo?.attemptId;
    if(!idToken || !attemptId || stage==="intro" || stage==="result" || flow.verifiedResult)return;
    setCheckpoint("saving");
    let active = true;
    const saveCheckpoint = () => saveA2MockAttempt({
      idToken,attemptId,section:stage,status:"in_progress",
      state:{ ...savedA2Mock3State(keys,stage), attemptStartedAtMs: flow.startedAt },
    });
    const retry = uploadRetry.current;
    uploadRetry.current = false;
    const upload = stage === "sprechen"
      ? runA2MockSubmissionStep({ idToken, mockId: "a2-mock-03", retry }, "schreiben", "upload", saveCheckpoint)
      : saveCheckpoint();
    upload.then(response => { if (active) setCheckpoint(response?.staleIgnored ? "failed" : "saved"); })
      .catch(() => { if (active) setCheckpoint("failed"); });
    return () => { active = false; };
  },[idToken,flow.attemptInfo?.attemptId,flow.verifiedResult,flow.startedAt,stage,keys,checkpointRetry]);

  useEffect(() => {
    const attemptId = flow.attemptInfo?.attemptId;
    if (stage !== "result" || !attemptId || !idToken ||
        flow.verifiedResult || !isA2Mock3ReviewReady(keys)) return;
    // Token refresh can rerun this effect while marking is still in flight.
    // Subscribe to the same request so the refreshed view receives its outcome.
    if (finalizing.current?.attemptId !== attemptId ||
        finalizing.current?.retry !== retryFinal) {
      finalizing.current = {
        attemptId,
        retry: retryFinal,
        promise: finalizeA2Mock3({ keys: keys, attemptId, idToken, retry: retryFinal > 0 }),
      };
    }
    let active = true;
    setFinalBusy(true);
    setFinalError("");
    finalizing.current.promise.then(verifiedResult => {
      if (!active) return;
      setFlow(old => ({ ...old, verifiedResult, verifiedAt: Date.now() }));
      setFinalBusy(false);
      announceExamSuccess("Your verified A2 Mock 3 result was saved.");
    }).catch(error => {
      if (!active) return;
      const moduleLabel = { schreiben: "Schreiben", sprechen: "Sprechen", result: "Results" }[error.submissionModule];
     const message = (moduleLabel ? moduleLabel + " · " : "") +
       (error?.response?.data?.error || error.message || "Could not save the final score.");
      setFinalError(message);
      setFinalBusy(false);
    });
    return () => { active = false; };
  }, [stage, flow.attemptInfo?.attemptId, flow.verifiedResult, idToken, keys, retryFinal]);

  const advance=useCallback(()=>{
    setProgress(progressFor(keys));
    setFlow(current=>{
      const i=ORDER.indexOf(current.stage);
      return i<0?current:{...current,stage:i===3?"result":ORDER[i+1]};
    });
    window.scrollTo?.({top:0,behavior:"smooth"});
  },[keys]);

  const restart=()=>{
    if(!flow.verifiedResult || !window.confirm("Start a new Mock 03? Previous verified results remain in Falowen Results."))return;
    try {
      const completed=Object.fromEntries(Object.entries(keys).map(([name,key])=>[name,read(key)]));
      const historyKey=`${keys.flow}:history`;
      const history=read(historyKey);
      localStorage.setItem(historyKey,JSON.stringify([...(Array.isArray(history)?history:[]),completed]));
      Object.values(keys).forEach(key=>localStorage.removeItem(key));
      setFlow({stage:"intro",startedAt:null});
      setProgress(progressFor(keys));
      setFinalError("");
    } catch {
      setFinalError("Could not archive this result safely. No answers were removed.");
    }
  };

  const screens={
    lesen:<A2Mock3Lesen embedded onComplete={advance}/>,
    hoeren:<A2Mock3Hoeren embedded onComplete={advance}/>,
    schreiben:<A2Mock3Schreiben embedded onComplete={advance}/>,
    sprechen:<A2Mock3ConversationalSpeaking embedded onComplete={advance} onPartSaved={checkpointSpeaking} attemptId={flow.attemptInfo?.attemptId || ""}/>,
  };
  return <main className="a2-mock2-full" lang="en" data-a2-mock3-full>
    <div className="a2-mock2-top"><AppBackButton label="Back to Mock Exams" fallbackPath="/exams/mocks"/><span>A2 · Mock 03</span></div>
    <header className="a2-mock2-full-heading">
      <p className="a2-mock2-kicker">A2 · Mockprüfung 03</p>
      <h1>A2 Mock 3</h1>
      <p>Lesen · Hören · Schreiben · Sprechen — one exam, four modules.</p>
    </header>
    <section className="a2-mock2-full-progress" aria-label="A2 Mock 3 progress">
      <div className="a2-mock2-full-progress-head"><strong>Exam progress</strong><span>{complete} of 4 completed</span></div>
      <div className="a2-mock2-full-track"><div style={{width:`${complete*25}%`}}/></div>
      <div className="a2-mock2-full-stages">{ORDER.map((k,i)=><div key={k} className={progress[k].done?"complete":stage===k?"current":""}>
        <span>{progress[k].done?"✓":i+1}</span><strong>{LABELS[i]}</strong>
        <small>{progress[k].done?"Completed":stage===k?"Current":"Not started"}</small>
      </div>)}</div>
    </section>
    {stage==="intro" ? <section className="a2-mock2-full-intro">
      <h2>Start A2 Mock 3</h2>
      <p>30-minute reading, four protected Hören recordings, two writing tasks and three parts with the live German-speaking AI examiner.</p>
      <p>Only verified server marks are used for the final result. Save progress and resume with your account.</p>
      <button type="button" className="a2-mock2-primary" onClick={() => resumeAttempt(true)} disabled={resuming}>Start full Mock 3</button>
      {idToken ? <button type="button" disabled={resuming} onClick={() => resumeAttempt()}>{resuming ? "Finding attempt…" : "Resume attempt"}</button> : null}
    </section> : null}
    {connectionError ? <p role="alert">{connectionError} <button type="button" onClick={()=>setRetryConnect(n=>n+1)}>Retry connection</button></p> : null}
    {ORDER.includes(stage) ? <section className="a2-mock2-full-current" key={stage}>
      <div className="a2-mock2-full-module"><strong>Module {index+1} of 4 · {LABELS[index]}</strong>
        <p>Submit the current module to continue. Each part stays in its own Mock 03 draft.</p>
      </div>
      {progress.schreiben.done ? <p role="status">{checkpoint === "saved"
       ? "Schreiben submitted to Falowen. AI marking runs after Sprechen."
       : checkpoint === "failed" ? "Schreiben saved on this device. Upload needs a retry."
       : "Schreiben saved on this device. Waiting for server confirmation."}
       {checkpoint === "failed" ? <button type="button" onClick={retryCheckpoint}>Retry saving to Falowen</button> : null}
     </p> : null}
     {screens[stage]}
    </section> : null}
    {stage==="result" ? <section className="a2-mock2-full-intro">
      <h2>Mock 03 · final result</h2>
      {flow.verifiedResult ? <>
        <div role="status" className="a2-mock2-results">
          <h3>Verified A2 Mock 3 result</h3>
          <p><strong>{flow.verifiedResult.overall.score}/100</strong> · {flow.verifiedResult.overall.passed?"Passed":"More practice recommended"}</p>
          {ORDER.map(k=><p key={k}>{LABELS[ORDER.indexOf(k)]}: <strong>{flow.verifiedResult.sectionScores[k]}/25</strong></p>)}
          <p>Saved in Falowen Results and student score records.</p>
        </div>
        <SavedMockListeningReview key={flow.attemptInfo?.attemptId} rows={flow.verifiedResult.listeningReview} level="A2" attemptId={flow.attemptInfo?.attemptId} idToken={idToken}/>
        <button type="button" className="a2-mock2-primary" onClick={restart}>Start another Mock 3 attempt</button>
      </> : <>
        <p role="status">{finalBusy?"AI marking in progress · Schreiben and Sprechen":"Final /100 score is not verified yet. Submitted work remains saved."}</p>
        {finalError ? <p role="alert">{finalError} <button type="button" onClick={()=>setRetryFinal(n=>n+1)}>Retry verification</button></p> : null}
        {!flow.attemptInfo?.attemptId ? <p role="status">Connecting the exam to your student account…</p> : null}
      </>}
    </section> : null}
  </main>;
}
export default function A2Mock3ExamHub() {
  const {user}=useAuth();
  return <A2Mock3ExamHubAttempt key={user?.uid||"guest"}/>;
}
