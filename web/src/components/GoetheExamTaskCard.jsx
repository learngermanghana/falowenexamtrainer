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
  return <section aria-label="Speaking task card" style={{padding:14,border:"1px solid #cbd5e1",borderRadius:12,background:"#fff",display:"grid",gap:8}}>
    <strong>{flow.title} · {flow.mode === "simulation" ? "Exam simulation" : "Guided practice"}</strong>
    <p lang="de" style={{margin:0,lineHeight:1.6}}>{flow.scenario || flow.topic || topic}</p>
    {flow.cards?.length ? <div role="list" aria-label="Word cards" style={{display:"flex",flexWrap:"wrap",gap:8}}>
      {flow.cards.map((card,index)=><span role="listitem" key={index} style={{padding:"8px 12px",border:active && index===cardIndex ? "2px solid #2563eb" : "1px solid #cbd5e1",borderRadius:8}}>{card}</span>)}
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
