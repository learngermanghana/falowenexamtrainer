import React, {useEffect,useState} from "react";

export default function GoetheExamTaskCard({flow,topic,active=false}) {
  const [preparing,setPreparing]=useState(false);
  const [seconds,setSeconds]=useState(900);
  const [notes,setNotes]=useState("");
  useEffect(()=>{setPreparing(false);setSeconds(900);setNotes("");},[flow?.key,topic]);
  useEffect(()=>{
    if (!preparing || active || seconds<=0) return undefined;
    const timer=setInterval(()=>setSeconds(value=>Math.max(0,value-1)),1000);
    return ()=>clearInterval(timer);
  },[preparing,active,seconds]);
  if (!flow) return null;
  const cardIndex=Math.floor(((flow.step?.index || 1)-1)/2);
  const requestRound=Math.min(cardIndex,(flow.requestCards?.length || 1)-1);
  const requestCard=flow.key === "A1-3" ? flow.requestCards?.[requestRound] : null;
  return <section className="speaking-exam-task-card" aria-label="Speaking task card" style={{padding:14,border:"1px solid #cbd5e1",borderRadius:12,background:"#fff",display:"grid",gap:8}}>
    <strong>{flow.title} · {flow.mode === "simulation" ? "Exam simulation" : "Guided practice"}</strong>
    {flow.key === "A1-2" ? (
      <div className="speaking-exam-a1-topic" role="group" aria-label="A1 Teil 2 Thema">
        <span className="speaking-exam-a1-topic__label">THEMA</span>
        <strong lang="de">{topic || "Alltag"}</strong>
        <small>Look at the word card. Ask your partner a question about this theme, then answer their question.</small>
      </div>
    ) : <p lang="de" style={{margin:0,lineHeight:1.6}}>{flow.scenario || flow.topic || topic}</p>}
    {flow.cards?.length ? <div className={flow.key === "A1-2" ? "speaking-exam-word-cards speaking-exam-word-cards--a1" : "speaking-exam-word-cards"} role="list" aria-label="Word cards" style={{display:"flex",flexWrap:"wrap",gap:8}}>
      {flow.cards.map((card,index)=><span role="listitem" key={index} aria-current={active && index===cardIndex ? "step" : undefined}
        style={{padding:"8px 12px",border:active && index===cardIndex ? "2px solid #2563eb" : "1px solid #cbd5e1",borderRadius:8}}>
        {flow.key === "A1-2" ? <small className="speaking-exam-word-label">WORTKARTE {index+1} / {flow.cards.length}</small> : null}
        <strong lang="de" className={flow.key === "A1-2" ? "speaking-exam-keyword" : undefined}>{card}</strong>
      </span>)}
    </div> : null}
    {flow.key === "A1-1" ? <p style={{margin:0,fontSize:13,color:"#334155"}}>
      Introduce yourself, spell your surname, say a number, then answer one personal follow-up.
    </p> : null}
    {requestCard ? <div className="speaking-exam-picture-card" role="group" aria-label="A1 request picture card"
      style={{background:"#f8fafc",border:"1px solid #cbd5e1",borderRadius:12,padding:14,display:"grid",gap:8,justifyItems:"center"}}>
      <small style={{color:"#334155",fontWeight:700}}>Teil 3 · Karte {requestRound+1} von {flow.requestCards.length}</small>
      <span aria-hidden="true" style={{fontSize:42,lineHeight:1.2}}>{requestCard.symbol || "🗂️"}</span>
      <strong lang="de" style={{fontSize:19,textAlign:"center"}}>{requestCard.word}</strong>
      <small style={{color:"#475569",textAlign:"center"}}>{flow.step?.action === "respond-request"
        ? "Listen to the partner's request and respond politely."
        : "Ask the partner politely to do this action."}</small>
    </div> : null}
    {flow.card ? <strong lang="de">Karte: {flow.card}</strong> : null}
    {flow.points?.length ? <ol style={{margin:"0 0 0 20px",padding:0}}>{flow.points.map(point=><li key={point} lang="de">{point}</li>)}</ol> : null}
    {flow.studentCalendar?.length ? <div><strong>Ihr Kalender · freie Termine</strong><ul style={{margin:"5px 0"}}>{flow.studentCalendar.map(slot=><li key={slot} lang="de">{slot}</li>)}</ul><small>Finden Sie einen Termin, der auch Ihrem Partner passt.</small></div> : null}
    {flow.hints?.length ? <details><summary>Practice hints</summary>{flow.hints.map(hint=><p key={hint} style={{margin:"6px 0"}}>{hint}</p>)}</details> : null}
    {flow.preparationSeconds && !active ? <div style={{display:"grid",gap:7}}>
      <button type="button" onClick={()=>setPreparing(value=>!value)}>{preparing ? "Pause preparation" : "Optional B1 preparation timer"}</button>
      {preparing ? <span role="timer">{String(Math.floor(seconds/60)).padStart(2,"0")}:{String(seconds%60).padStart(2,"0")}</span> : null}
      <small>Preparation happens before the voice session starts.</small>
    </div> : null}
    {flow.preparationSeconds ? <label style={{display:"grid",gap:5}}>
      Your brief notes
      <textarea rows={2} maxLength={1500} value={notes} onChange={event=>setNotes(event.target.value)} placeholder="Stichwörter …"/>
    </label> : null}
    {active && flow.step ? <p role="status" style={{margin:0,color:"#1d4ed8"}}>
      {flow.step.role === "partner" ? "AI partner" : "Examiner"} · Task {flow.step.index} of {flow.maxAnswers} · up to {flow.step.seconds}s
    </p> : null}
    {flow.partnerPresentation ? <details><summary>Partner presentation · {flow.partnerTopic}</summary><p lang="de">{flow.partnerPresentation}</p></details> : null}
  </section>;
}
