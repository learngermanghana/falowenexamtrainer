import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AppBackButton from "./navigation/AppBackButton";
import A2MockSpeakingExaminer from "./A2MockSpeakingExaminer";
import { getA2KombiSet } from "../data/a2KombiMockSets";
import { startA2MockAttempt, saveA2MockAttempt } from "../services/a2FinalMockService";
import { a2KombiKeys, a2KombiProgress, getA2KombiState, finalizeA2Kombi } from "../services/a2KombiMockFinalization";
import "./A2Mock2Lesen.css";
import "./A2Mock2ExamHub.css";
import "./A2GoetheWritingMockPreview.css";

const ORDER=["lesen","schreiben","sprechen"];
const LABELS={lesen:"Lesen",schreiben:"Schreiben",sprechen:"Sprechen"};
const read=key=>{try{return JSON.parse(localStorage.getItem(key)||"{}")||{};}catch{return {};}};
const duration={lesen:30*60000,schreiben:30*60000};
const asTime=ms=>{const sec=Math.ceil(Math.max(0,ms)/1000);return `${String(Math.floor(sec/60)).padStart(2,"0")}:${String(sec%60).padStart(2,"0")}`;};
const wordCount=value=>String(value||"").trim().split(/\s+/).filter(Boolean).length;

function Speaking({paper,attemptId,storageKey,onFinish}) {
  const [stored,setStored]=useState(()=>read(storageKey));
  const savedParts=stored.parts||{};
  const tasks=useMemo(()=>[
    {teil:"1",title:"Fragen stellen und beantworten",english:"Ask questions with the cards, then answer in German.",
      prompt:`Stellen Sie Ihrem Partner Fragen und beantworten Sie seine Fragen. Themenkarten: ${paper.speaking.cards.map(c=>`${c.theme}: ${c.keyword}`).join("; ")}. Nutzen Sie alle vier Stichwörter.`,
      keywords:paper.speaking.cards.map(c=>c.keyword).join(", "),
      hint:"Ask and answer questions in German."},
    {teil:"2",title:"Von sich erzählen",english:"Speak about your personal life using four guiding points.",
      prompt:`Thema: ${paper.speaking.teil2.topic}. Erzählen Sie über sich zu diesen Punkten: ${paper.speaking.teil2.points.join(" / ")}. Stellen Sie passende Rückfragen.`,
      keywords:paper.speaking.teil2.points.join(", "),hint:"Speak for one to two minutes and respond to follow-up questions."},
    {teil:"3",title:"Etwas gemeinsam planen",english:"Work with the examiner to make a plan.",
      prompt:`Situation: ${paper.speaking.teil3.situation}. Planen Sie gemeinsam: ${paper.speaking.teil3.points.join(" / ")}. Schlagen Sie etwas vor, fragen Sie nach und einigen Sie sich.`,
      keywords:paper.speaking.teil3.points.join(", "),hint:"Negotiate time, place and responsibilities with the examiner."},
  ],[paper]);
  const save=(_teil,_result,parts)=>{
    const next={...read(storageKey),parts};
    localStorage.setItem(storageKey,JSON.stringify(next));
    setStored(next);
    return true;
  };
  return <section className="a2-mock2-paper" data-a2-kombi-sprechen={paper.id}>
    <h2>Sprechen · A2 Mock {paper.number}</h2>
    <p>Teil 1: Vier Themenkarten · Teil 2: {paper.speaking.teil2.topic} · Teil 3: Gemeinsam planen</p>
    {!attemptId?<p role="status">Connecting to your saved exam attempt. Your previous work is safe.</p>:
      <A2MockSpeakingExaminer mockId={paper.id} attemptId={attemptId}
        tasks={tasks} savedParts={savedParts} onSavePart={save}
        onComplete={parts=>{
          if(!tasks.every(t=>parts?.[t.teil]?.sessionId&&parts?.[t.teil]?.assessment)) {
            throw new Error("Please complete all three speaking parts.");
          }
          save(null,null,parts);
          onFinish();
          return true;
        }}/>}
  </section>;
}

function A2KombiAttempt({mockNumber,paper}) {
  const {idToken,user}=useAuth();
  const keys=useMemo(()=>a2KombiKeys(paper.id,user?.uid),[paper.id,user?.uid]);
  const initial=()=>{const flow=read(keys.flow);if(flow.stage)return flow;
    const progress=a2KombiProgress(keys);const stage=ORDER.find(k=>!progress[k].done);
    return {stage:ORDER.some(k=>progress[k].done||progress[k].count) ? (stage||"result") : "intro"};};
  const [flow,setFlow]=useState(initial);
  const [progress,setProgress]=useState(()=>a2KombiProgress(keys));
  const [lesen,setLesen]=useState(()=>read(keys.lesen));
  const [writing,setWriting]=useState(()=>read(keys.schreiben));
  const [part,setPart]=useState(0);
  const [now,setNow]=useState(Date.now());
  const [connecting,setConnecting]=useState(false);
  const [connectionError,setConnectionError]=useState("");
  const [grading,setGrading]=useState(false);
  const [gradingError,setGradingError]=useState("");
  const [retry,setRetry]=useState(0);
  const finalizing=useRef(false);
  const started=Boolean(flow.stage&&flow.stage!=="intro");
  const attemptId=flow.attemptInfo?.attemptId;
  const stage=flow.stage||"intro";
  const currentTimeState=stage==="lesen"?lesen:stage==="schreiben"?writing:null;
  const msRemaining=currentTimeState?.startedAt?currentTimeState.startedAt+duration[stage]-now:duration[stage]||0;

  useEffect(()=>{localStorage.setItem(keys.flow,JSON.stringify(flow));},[keys.flow,flow]);
  useEffect(()=>{localStorage.setItem(keys.lesen,JSON.stringify(lesen));},[keys.lesen,lesen]);
  useEffect(()=>{localStorage.setItem(keys.schreiben,JSON.stringify(writing));},[keys.schreiben,writing]);
  useEffect(()=>{if(!["lesen","schreiben"].includes(stage))return undefined;
    const interval=window.setInterval(()=>setNow(Date.now()),1000);
    return ()=>window.clearInterval(interval);
  },[stage]);
  const advance=useCallback((section)=>{
    setProgress(a2KombiProgress(keys));
    setFlow(current=>{
      const currentIndex=ORDER.indexOf(current.stage);
      if(current.stage!==section||currentIndex<0)return current;
      return {...current,stage:currentIndex===ORDER.length-1?"result":ORDER[currentIndex+1]};
    });
    window.scrollTo?.({top:0,behavior:"smooth"});
  },[keys]);

  useEffect(()=>{
    if(stage==="lesen"&&lesen.startedAt&& !lesen.completedAt&&msRemaining<=0){
      const submitted={...lesen,completedAt:Date.now()};
      localStorage.setItem(keys.lesen,JSON.stringify(submitted));setLesen(submitted);advance("lesen");
    }
    if(stage==="schreiben"&&writing.startedAt&& !writing.submittedAt&&msRemaining<=0){
      const submitted={...writing,submittedAt:Date.now()};
      localStorage.setItem(keys.schreiben,JSON.stringify(submitted));setWriting(submitted);advance("schreiben");
    }
  },[stage,lesen,writing,msRemaining,keys,advance]);

  const begin=async()=>{
    if(!idToken||connecting)return;
    setConnecting(true);setConnectionError("");
    try{
      const reply=await startA2MockAttempt({mockId:paper.id,idToken});
      if(!reply?.attemptId)throw new Error("A saved exam attempt was not returned.");
      const next={stage:"lesen",attemptInfo:{attemptId:reply.attemptId,attemptNumber:reply.attemptNumber,firstAttempt:reply.firstAttempt},startedAt:Date.now()};
      setFlow(next);
      setLesen(old=>({...old,startedAt:old.startedAt||Date.now(),answers:old.answers||{}}));
    }catch(error){setConnectionError(error?.response?.data?.error||error.message||"Could not connect to exam.");}
    finally{setConnecting(false);}
  };

  const reconnect=async()=>{
    if(!idToken||connecting)return;
    setConnecting(true);setConnectionError("");
    try{
      const reply=await startA2MockAttempt({mockId:paper.id,idToken});
      if(!reply?.attemptId)throw new Error("Could not register this attempt.");
      setFlow(current=>({...current,attemptInfo:{attemptId:reply.attemptId,attemptNumber:reply.attemptNumber,firstAttempt:reply.firstAttempt}}));
    }catch(error){setConnectionError(error?.response?.data?.error||error.message);}
    finally{setConnecting(false);}
  };
  useEffect(()=>{if(started&&!attemptId&&idToken&&!connecting&&!connectionError)reconnect();
    // deliberate: reconnect only on a mounted/resumed attempt or explicit retry
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[started,attemptId,idToken]);

  const checkpoint=async(section)=>{
    if(!attemptId)return;
    try{await saveA2MockAttempt({idToken,attemptId,section,status:"in_progress",state:getA2KombiState(keys,paper.id,section)});}
    catch(error){setConnectionError(error?.response?.data?.error||error.message||"A checkpoint could not sync, but your answers are saved.");}
  };
  const submitReading=()=>{
    if(!window.confirm("Lesen abgeben? Nicht beantwortete Fragen werden als falsch gewertet."))return;
    const next={...lesen,completedAt:Date.now()};localStorage.setItem(keys.lesen,JSON.stringify(next));setLesen(next);
    checkpoint("lesen");advance("lesen");setWriting(old=>({...old,startedAt:old.startedAt||Date.now()}));
  };
  const submitWriting=()=>{
    if(!window.confirm("Schreiben abgeben? Die beiden Texte können danach nicht mehr verändert werden."))return;
    const next={...writing,submittedAt:Date.now()};localStorage.setItem(keys.schreiben,JSON.stringify(next));setWriting(next);
    checkpoint("schreiben");advance("schreiben");
  };
  useEffect(()=>{if(stage==="schreiben"&&!writing.startedAt)setWriting(old=>({...old,startedAt:Date.now()}));},[stage,writing.startedAt]);
  useEffect(()=>{
    if(stage!=="result"||flow.verifiedResult||!attemptId||!idToken||finalizing.current)return;
    const complete=a2KombiProgress(keys);
    if(!ORDER.every(name=>complete[name].done))return;
    finalizing.current=true;setGrading(true);setGradingError("");
    finalizeA2Kombi({keys,mockId:paper.id,attemptId,idToken}).then(result=>{
      setFlow(current=>({...current,verifiedResult:result,stage:"result",verifiedAt:Date.now()}));
    }).catch(error=>{setGradingError(error?.response?.data?.error||error.message||"Could not verify the result.");})
      .finally(()=>{setGrading(false);finalizing.current=false;});
  },[stage,flow.verifiedResult,attemptId,idToken,keys,paper.id,retry]);

  const restart=()=>{
    if(!flow.verifiedResult||!window.confirm("Start another attempt? Your previous verified result will remain in Results."))return;
    try{
      const historyKey=`${keys.flow}:history`;
      const past=read(historyKey);
      const history=Array.isArray(past)?past:[];
      localStorage.setItem(historyKey,JSON.stringify([...history,{flow,lesen,writing,speaking:read(keys.sprechen)}]));
      for(const key of Object.values(keys))localStorage.removeItem(key);
      setFlow({stage:"intro"});setProgress(a2KombiProgress(keys));
      setLesen({});setWriting({});setPart(0);setGradingError("");
    }catch{setGradingError("Could not archive the previous attempt; nothing was deleted.");}
  };
  const currentReading=paper.reading[part];
  const sectionIndex=ORDER.indexOf(stage);
  return <main className="a2-mock2-full" data-a2-kombi-mock={paper.id}>
    <div className="a2-mock2-top"><AppBackButton label="Back to Mock Exams" fallbackPath="/exams/mocks"/><span>A2 · Mock {mockNumber}</span></div>
    <header className="a2-mock2-full-heading">
      <p className="a2-mock2-kicker">A2 Kombiprüfung · Mock {mockNumber}</p>
      <h1>A2 Mock {mockNumber}</h1>
      <p>{paper.theme}</p><p><strong>Lesen · Schreiben · Sprechen</strong> · Hören will be added later.</p>
    </header>
    <section className="a2-mock2-full-progress" aria-label="Progress across three exam modules">
      <div className="a2-mock2-full-progress-head"><strong>Exam progress</strong><span>{ORDER.filter(k=>progress[k].done).length} of 3 completed</span></div>
      <div className="a2-mock2-full-track"><div style={{width:`${ORDER.filter(k=>progress[k].done).length/3*100}%`}}/></div>
      <div className="a2-mock2-full-stages">{ORDER.map((name,index)=><div key={name} className={progress[name].done?"complete":stage===name?"current":""}>
        <span>{progress[name].done?"✓":index+1}</span><strong>{LABELS[name]}</strong>
        <small>{progress[name].done?"Completed":stage===name?"Current":"Not started"}</small>
      </div>)}</div>
    </section>
    {stage==="intro"?<section className="a2-mock2-full-intro">
      <h2>Start A2 Mock {mockNumber}</h2>
      <p>Complete the 30-minute reading module, two writing tasks in 30 minutes, and three speaking parts with the German-speaking AI examiner. Your work is saved as you go.</p>
      <p>The verified score is out of <strong>75 points</strong> for the three available modules. Hören is not included and will be added later.</p>
      <button type="button" className="a2-mock2-primary" onClick={begin} disabled={connecting||!idToken}>
        {connecting?"Connecting…":"Start mock exam"}
      </button>
    </section>:null}
    {connectionError?<p role="alert">{connectionError} <button type="button" onClick={reconnect}>Retry server connection</button></p>:null}
    {started&&!attemptId?<p role="status">Connecting your exam attempt. Your saved work remains available.</p>:null}
    {stage==="lesen"?<section className="a2-mock2-shell" lang="de">
      <header className="a2-mock2-progress">
        <div><strong>Lesen · Teil {part+1} von 4</strong><span>{Object.values(lesen.answers||{}).filter(Boolean).length} / 20 Antworten</span></div>
        <strong aria-label="Time remaining">{asTime(msRemaining)}</strong>
      </header>
      <nav className="a2-mock2-nav" aria-label="Lesen Teile">{paper.reading.map((section,index)=><button type="button" key={section.id} className={part===index?"selected":""} onClick={()=>setPart(index)}>
        Teil {index+1} <small>{section.questions.filter(q=>lesen.answers?.[q.number]).length}/5</small>
      </button>)}</nav>
      <article className="a2-mock2-paper">
        <h2>Teil {part+1}: {currentReading.title}</h2><p>{currentReading.instruction}</p>
        <section style={{whiteSpace:"pre-wrap",lineHeight:1.65,padding:16,background:"#f8fafc",borderRadius:12,border:"1px solid #dce5ef",margin:"16px 0"}}>
          {currentReading.passage}
        </section>
        {currentReading.questions.map(question=><fieldset key={question.number} className="a2-mock2-question">
          <legend><strong>{question.number}.</strong> {question.question}</legend>
          {question.options.map(option=><label key={option.id} className={lesen.answers?.[question.number]===option.id?"selected":""}>
            <input type="radio" name={`${paper.id}-lesen-${question.number}`}
              checked={lesen.answers?.[question.number]===option.id}
              onChange={()=>setLesen(current=>({...current,answers:{...current.answers,[question.number]:option.id}}))}/>
            <span><strong>{option.id.toUpperCase()})</strong> {option.label}</span>
          </label>)}
        </fieldset>)}
        <footer className="a2-mock2-actions">
          <button type="button" disabled={part===0} onClick={()=>setPart(i=>i-1)}>Zurück</button>
          {part<3?<button type="button" className="a2-mock2-primary" onClick={()=>setPart(i=>i+1)}>Weiter: Teil {part+2}</button>:
            <button type="button" className="a2-mock2-primary" onClick={submitReading}>Lesen abgeben → Schreiben</button>}
        </footer>
      </article>
    </section>:null}
    {stage==="schreiben"?<section className="a2-mock2-shell" lang="de">
      <header className="a2-mock2-progress"><strong>Schreiben · Teil 1 und 2</strong><strong aria-label="Time remaining">{asTime(msRemaining)}</strong></header>
      <article className="a2-mock2-paper a2-schreiben-exam">
        {paper.writing.map((task,index)=>{const field=index===0?"sms":"email";return <section key={task.id} className="a2-schreiben-part">
          <header className="a2-schreiben-part-header"><h2>Teil {index+1}: {task.title}</h2><p>15 Minuten · {task.wordTarget} Wörter</p></header>
          <div className="a2-schreiben-task-paper"><p><strong>Situation:</strong> {task.situation}</p><p>Schreiben Sie zu allen drei Punkten. Vergessen Sie Anrede und Gruß nicht.</p>
            <ul className="a2-schreiben-points">{task.points.map(point=><li key={point}>{point}</li>)}</ul>
            <div className={index===0?"a2-schreiben-sms-frame":"a2-schreiben-email-frame"}>
              {index===1?<div className="a2-schreiben-email-field"><strong>Betreff:</strong> <span>Ihre Anfrage</span></div>:null}
              <textarea aria-label={`A2 Mock ${mockNumber} Schreiben Teil ${index+1}`}
                rows={index===0?7:11} value={writing[field]||""}
                onChange={event=>setWriting(current=>({...current,[field]:event.target.value}))}/>
            </div>
            <p className="a2-schreiben-count">Wörter: <strong>{wordCount(writing[field])}</strong> · Ziel: {task.wordTarget}</p>
          </div>
        </section>})}
        <footer className="a2-mock2-actions"><button type="button" className="a2-mock2-primary" onClick={submitWriting}>Schreiben abgeben → Sprechen</button></footer>
      </article>
    </section>:null}
    {stage==="sprechen"?<Speaking paper={paper} attemptId={attemptId} storageKey={keys.sprechen} onFinish={()=>advance("sprechen")}/>:null}
    {stage==="result"?<section className="a2-mock2-full-intro">
      <h2>A2 Mock {mockNumber} · Ergebnis</h2>
      {flow.verifiedResult?<div className="a2-mock2-results" role="status">
        <h3>Verified Kombiprüfung result</h3>
        <p><strong>{flow.verifiedResult.overall.points}/75 points</strong> · {flow.verifiedResult.overall.score}% · {flow.verifiedResult.overall.passed?"Passed":"More practice recommended"}</p>
        {ORDER.map(k=><p key={k}>{LABELS[k]}: <strong>{flow.verifiedResult.sectionScores[k]}/25</strong></p>)}
        <p>Hören pending · No Hören points have been added. Your existing result remains unchanged when the Hören module is later published.</p>
        <p>The verified result is saved in Falowen Results.</p>
        <button type="button" className="a2-mock2-primary" onClick={restart}>Start another attempt</button>
      </div>:<>
        <p role="status">{grading?"Verifying scores and saving your results…":"Results are being verified. Your answers are saved."}</p>
        {gradingError?<p role="alert">{gradingError} <button type="button" onClick={()=>setRetry(i=>i+1)}>Retry grading</button></p>:null}
      </>}
    </section>:null}
  </main>;
}
export default function A2KombiMockExamPage({mockNumber}) {
  const {user}=useAuth();
  const paper=getA2KombiSet(`a2-mock-${String(mockNumber).padStart(2,"0")}`);
  if(!paper)return <section className="a2-mock2-shell"><h2>Mock not found</h2></section>;
  return <A2KombiAttempt key={`${paper.id}:${user?.uid||"guest"}`} mockNumber={mockNumber} paper={paper}/>;
}
