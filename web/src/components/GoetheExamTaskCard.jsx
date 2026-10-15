import React, {useEffect,useState} from "react";
import "./GoetheExamTaskCard.css";

const PracticeCardHeader = ({part,level="A1"}) => <><div className="goethe-card__header"><span>Deutsch {level} · Übung</span><strong>Sprechen Teil {part}</strong></div><div className="goethe-card__subheader">Falowen · Kandidatenkarte</div></>;

export default function GoetheExamTaskCard({flow,topic,active=false}) {
  const [preparing,setPreparing]=useState(false);
  const [seconds,setSeconds]=useState(flow?.preparationSeconds || 900);
  const [notes,setNotes]=useState("");
  useEffect(()=>{setPreparing(false);setSeconds(flow?.preparationSeconds || 900);setNotes("");},[flow?.key,flow?.preparationSeconds,topic]);
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
    {flow.presentationQuestion ? <p lang="de" style={{margin:0,fontWeight:700}}>{flow.presentationQuestion}</p> : null}
    {flow.stageGuide ? <p style={{margin:0,fontSize:13,color:"#334155"}}>{flow.stageGuide}</p> : null}
    {flow.key === "A1-2" && flow.cards?.length ? (
      <div className="goethe-card-mat">
        <div className="goethe-card goethe-card--word" role="group" aria-label="A1 current word card">
          <PracticeCardHeader part={2}/>
          <div className="goethe-card__theme" lang="de">Thema: {flow.cardThemes?.[Math.min(cardIndex,flow.cards.length-1)] || topic || "Alltag"}</div>
          <div className="goethe-card__keyword" lang="de">{flow.cards[Math.min(cardIndex,flow.cards.length-1)]}</div>
        </div>
        <small className="goethe-card__caption">Karte {Math.min(cardIndex+1,flow.cards.length)} von {flow.cards.length} · {flow.step?.action === "answer-question" ? "Answer your partner’s question." : "Ask your partner a question about this word."}</small>
      </div>
    ) : flow.key === "A1-1" ? null : <p lang="de" style={{margin:0,lineHeight:1.6}}>{flow.scenario || flow.topic || topic}</p>}
    {flow.key === "A2-1" ? <div className="goethe-a2-personal" role="list" aria-label="A2 personal word cards">
      {flow.cards?.map((card,index)=><div className="goethe-card" role="listitem" key={card} aria-current={active && index === cardIndex ? "step" : undefined}>
        <PracticeCardHeader part={1} level="A2"/>
        <div className="goethe-card__theme">Fragen zur Person</div>
        <div className="goethe-card__keyword" lang="de">{card}?</div>
      </div>)}
    </div> : null}
    {flow.key === "A2-2" ? <div className="goethe-card goethe-a2-topic" role="group" aria-label="A2 topic and four keywords">
      <PracticeCardHeader part={2} level="A2"/>
      <div className="goethe-card__theme">Von sich erzählen</div>
      <div className="goethe-a2-mindmap">
        <svg className="goethe-a2-mindmap__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M20 15 40 42M80 15 60 42M20 85 40 58M80 85 60 58"/></svg>
        <strong className="goethe-a2-mindmap__topic" lang="de">{flow.topic || topic}</strong>
        <ul aria-label="Four speaking keywords">{flow.points?.slice(0,4).map(point=><li key={point} lang="de">{point}</li>)}</ul>
      </div>
    </div> : null}
    {flow.key === "A2-3" && flow.studentSchedule?.length ? <div className="goethe-card goethe-a2-calendar" role="group" aria-label="Your planning calendar">
      <PracticeCardHeader part={3} level="A2"/>
      <div className="goethe-card__theme">Ihr Kalender · {flow.calendarDay}</div>
      <table><caption>Finden Sie einen gemeinsamen Termin.</caption><thead><tr><th scope="col">Uhrzeit</th><th scope="col">Ihr Termin</th></tr></thead><tbody>
        {flow.studentSchedule.map(slot=><tr key={slot.time}><th scope="row">{slot.time}</th><td lang="de" className={slot.activity ? "" : "goethe-a2-calendar__free"}>{slot.activity || "frei"}</td></tr>)}
      </tbody></table>
    </div> : null}
    {!["A1-2","A2-1"].includes(flow.key) && flow.cards?.length ? <div className="speaking-exam-word-cards" role="list" aria-label="Word cards" style={{display:"flex",flexWrap:"wrap",gap:8}}>
      {flow.cards.map((card,index)=><span role="listitem" key={index} aria-current={active && index===cardIndex ? "step" : undefined}
        style={{padding:"8px 12px",border:active && index===cardIndex ? "2px solid #2563eb" : "1px solid #cbd5e1",borderRadius:8}}>
        {flow.key === "A2-1" ? <small className="speaking-exam-word-label">WORTKARTE {index+1} / {flow.cards.length}</small> : null}
        <strong lang="de">{card}</strong>
      </span>)}
    </div> : null}
    {flow.key === "A1-1" ? <p style={{margin:0,fontSize:13,color:"#334155"}}>
      Introduce yourself, spell your surname, say a number, then answer one personal follow-up.
    </p> : null}
    {requestCard ? <div className="goethe-card-mat">
      <div className="goethe-card goethe-card--picture" role="group" aria-label="A1 request picture card">
        <PracticeCardHeader part={3}/>
        <div className="goethe-card__picture">
          {requestCard.picture ? <img src={requestCard.picture} alt={requestCard.word} width="160" height="160"/> : <span aria-hidden="true">{requestCard.symbol || "🗂️"}</span>}
          <strong lang="de">{requestCard.word}</strong>
        </div>
      </div>
      <small className="goethe-card__caption">Karte {requestRound+1} von {flow.requestCards.length} · {flow.step?.action === "respond-request"
        ? "Listen to the partner’s request and respond politely."
        : "Ask the partner politely to do this action."}</small>
    </div> : null}
    {active && flow.key === "A2-1" && flow.step ? <p role="status" style={{margin:0,color:"#1d4ed8"}}>
      Card {cardIndex+1} of {flow.cards.length} · {flow.step.action === "ask-question" ? "Ask your partner a question." : "Answer your partner’s question."}
    </p> : null}
    {flow.card ? <strong lang="de">Karte: {flow.card}</strong> : null}
    {flow.key === "A1-1" ? <div className="goethe-introduction" role="list" aria-label="Personal introduction card">
      {(flow.points?.length ? flow.points : ["Name","Alter","Land","Wohnort","Sprachen","Beruf","Hobby"]).map(point=><div role="listitem" key={point} lang="de">{point.replace(/\?$/,"")}?</div>)}
    </div> : null}
    {!["A1-1","A2-2"].includes(flow.key) && flow.points?.length ? <ol style={{margin:"0 0 0 20px",padding:0}}>{flow.points.map(point=><li key={point} lang="de">{point}</li>)}</ol> : null}
    {!flow.studentSchedule?.length && flow.studentCalendar?.length ? <div><strong>Ihr Kalender · freie Termine</strong><ul style={{margin:"5px 0"}}>{flow.studentCalendar.map(slot=><li key={slot} lang="de">{slot}</li>)}</ul><small>Finden Sie einen Termin, der auch Ihrem Partner passt.</small></div> : null}
    {flow.hints?.length ? <details><summary>Practice hints</summary>{flow.hints.map(hint=><p key={hint} style={{margin:"6px 0"}}>{hint}</p>)}</details> : null}
    {flow.preparationSeconds && !active ? <div style={{display:"grid",gap:7}}>
      <button type="button" onClick={()=>setPreparing(value=>!value)}>{preparing ? "Pause preparation" : flow.key?.startsWith("B2-") ? "Optional B2 preparation timer" : flow.key?.startsWith("B1-") ? "Optional B1 preparation timer" : "Preparation timer for "+flow.key?.split("-")[0]}</button>
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
