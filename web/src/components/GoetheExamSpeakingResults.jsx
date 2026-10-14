import React from "react";

const sectionStyle = {display:"grid",gap:7,padding:"14px 0",borderBottom:"1px solid #e2e8f0"};
const cap = {fontSize:13,color:"#334155",fontWeight:750,margin:0};
const textStyle = {margin:0,fontSize:14,lineHeight:1.65,color:"#334155",whiteSpace:"pre-wrap"};

export default function GoetheExamSpeakingResults({report, feedback, onNewTask, level, task}) {
  const hasReport = Boolean(report && (report.taskCompletion || report.strengths ||
    report.improvements?.length || report.modelAnswer));
  const improvements = Array.isArray(report?.improvements) ? report.improvements.slice(0,2) : [];
  return (
    <section aria-label="Your speaking practice feedback" data-exam-speaking-results="true"
      style={{display:"grid",gap:14,background:"#fff",padding:"clamp(16px,4vw,24px)",border:"1px solid #dbeafe",borderRadius:16}}>
      <header style={{display:"grid",gap:5}}>
        <span style={{fontWeight:750,color:"#1d4ed8",fontSize:12}}>PRACTICE COMPLETED · {level}</span>
        <h2 style={{fontSize:23,margin:0,color:"#0f172a"}}>Your Speaking Feedback</h2>
        {task ? <p style={{...textStyle,fontSize:13}}>{task}</p> : null}
      </header>
      {hasReport ? (
        <>
          <div style={sectionStyle}>
            <h3 style={cap}>✓ Task completion</h3>
            <p style={textStyle}>{report.taskCompletion || "Review the task requirements and check which points you covered."}</p>
          </div>
          {report.strengths ? (
            <div style={sectionStyle}>
              <h3 style={cap}>✓ What went well</h3>
              <p style={textStyle}>{report.strengths}</p>
            </div>
          ) : null}
          {improvements.length ? (
            <div style={sectionStyle}>
              <h3 style={cap}>↗ Improve next time</h3>
              <ol style={{margin:"3px 0 0",paddingLeft:20,display:"grid",gap:9}}>
                {improvements.map((entry,i)=><li key={i} style={textStyle}>{entry}</li>)}
              </ol>
            </div>
          ) : null}
          {report.modelAnswer ? (
            <div style={{padding:15,borderRadius:12,background:"#f1f5f9",display:"grid",gap:7}}>
              <h3 style={cap}>German example answer</h3>
              <p lang="de" style={{...textStyle,color:"#0f172a"}}>{report.modelAnswer}</p>
            </div>
          ) : null}
          {report.nextStep ? <p style={textStyle}><strong>Next step:</strong> {report.nextStep}</p> : null}
        </>
      ) : (
        <p style={textStyle}>{feedback || "Your feedback is not available right now."}</p>
      )}
      <p style={{color:"#64748b",fontSize:12,lineHeight:1.6,margin:0}}>
        Practice feedback based on confirmed transcripts, not an official Goethe exam score.
        Pronunciation is not scored from transcripts.
      </p>
      <div>
        <button type="button" onClick={onNewTask}
          style={{border:0,borderRadius:10,background:"#1d4ed8",padding:"12px 17px",fontWeight:750,color:"#fff",cursor:"pointer"}}>
          Try another task
        </button>
      </div>
    </section>
  );
}
