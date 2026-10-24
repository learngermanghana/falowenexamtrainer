import React from "react";
import "./ReadingPracticeShell.css";

export const readingLevelConfig = Object.freeze({
  A1: {questions:15,parts:3,minutes:25,available:true},
  A2: {questions:20,parts:4,minutes:30,available:true},
  B1: {questions:30,parts:5,minutes:65,available:true},
  B2: {available:false},
  C1: {questions:26,parts:4,minutes:65,available:true},
  C2: {available:false},
});
export const formatReadingTime = value => {
  const seconds=Math.max(0,Math.floor(Number(value)||0));
  return `${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;
};
export const readingProgressPercent = (answered,total) => total>0
  ? Math.min(100,Math.round(Math.max(0,answered)/total*100)) : 0;

export function ReadingPracticeHeader({
  level, sampleLabel, total, partCount, durationSeconds, secondsLeft,
  answered, onBack, timerRunning=false, onToggleTimer, submitted=false,
  timerPolicy="pausable", timerLabel="Time remaining",
}) {
  return <header className="reading-standard-header">
    <div className="reading-standard-breadcrumb">
      <button type="button" className="reading-standard-back" onClick={onBack}>
        <span aria-hidden="true">←</span> All Lesen samples
      </button>
      <span className="reading-standard-mode">{timerPolicy==="continuous"?"Timed practice · Timer continues while away":"Practice mode · Timer can be paused"}</span>
    </div>
    <div className="reading-standard-intro">
      <div>
        <p className="reading-standard-kicker">FALOWEN · EXAMS ROOM · {level} LESEN</p>
        <h1>{sampleLabel}</h1>
        <p>{partCount} Teile · {total} questions · {Math.round(durationSeconds/60)} minutes
          <span className="reading-standard-note"> · Answers are saved on this device</span>
        </p>
      </div>
      <div className="reading-standard-clock" aria-label="Reading practice time remaining">
        <span>{timerLabel}</span>
        <strong aria-live="off">{formatReadingTime(secondsLeft)}</strong>
        {onToggleTimer && !submitted ? <button type="button"
          disabled={secondsLeft===0} onClick={onToggleTimer}>
          {timerRunning?"Pause timer":secondsLeft===durationSeconds?"Start timer":"Resume timer"}
        </button> : <small>{submitted?"Completed":timerPolicy==="continuous"?"Exam-style clock":"Readiness practice"}</small>}
      </div>
    </div>
    <div className="reading-standard-progress-row">
      <span><strong>{answered}/{total}</strong> answered</span>
      <span>{readingProgressPercent(answered,total)}% complete</span>
    </div>
    <div className="reading-standard-progress" role="progressbar"
      aria-label="Questions answered" aria-valuemin={0} aria-valuemax={total}
      aria-valuenow={answered}>
      <span style={{width:`${readingProgressPercent(answered,total)}%`}}/>
    </div>
  </header>;
}

export function ReadingPracticeParts({level,parts,activePart,onSelect,readOnly=false}) {
  const current=parts.findIndex(p=>p.id===activePart);
  const PartTag=readOnly?"div":"button";
  return <nav className="reading-standard-parts" aria-label={`${level} Lesen part selector`}>
    <div className="reading-standard-parts-track">
      {parts.map((p,i)=><PartTag key={p.id} type={readOnly?undefined:"button"}
        className={`reading-standard-part${p.id===activePart?" is-current":""}${p.answered===p.total?" is-complete":""}`}
        aria-current={p.id===activePart?"step":undefined}
        onClick={readOnly?undefined:()=>onSelect(p.id)}>
        <span>Teil {i+1}</span>
        <small>{p.answered}/{p.total} answered</small>
      </PartTag>)}
    </div>
    {!readOnly ? <div className="reading-standard-step-actions">
      <button type="button" disabled={current<=0}
        onClick={()=>onSelect(parts[current-1].id)}>← Previous Teil</button>
      <span>Teil {current+1} of {parts.length}</span>
      <button type="button" disabled={current<0||current===parts.length-1}
        onClick={()=>onSelect(parts[current+1].id)}>Next Teil →</button>
    </div> : <div className="reading-standard-step-actions"><span>Teil {current+1} of {parts.length} · Continue in order</span></div>}
  </nav>;
}

export function ReadingPracticeSampleList({level,samples,onOpen,results=[]}) {
  return <section className="reading-standard-library" aria-label={`${level} Lesen samples`}>
    <div className="reading-standard-library-heading">
      <div>
        <h2>{level} · Reading samples</h2>
        <p>Select a practice paper. Completed results and attempts remain accessible.</p>
      </div>
      <strong>{samples.length} samples</strong>
    </div>
    <div className="reading-standard-samples">
      {samples.map((sample,index)=>{
        const last=results.find(r=>r.setId===sample.id);
        const state=sample.status|| (last?"Completed":"Not started");
        return <button key={sample.id} type="button"
          className="reading-standard-sample" onClick={()=>onOpen(sample)}>
          <span className="reading-standard-sample-number">{String(index+1).padStart(2,"0")}</span>
          <span className="reading-standard-sample-copy">
            <strong>{sample.label}</strong>
            <small>{sample.detail}</small>
            <span>{state}{last?` · Latest: ${last.percent}%`:""}</span>
          </span>
          <span aria-hidden="true">→</span>
        </button>;
      })}
    </div>
  </section>;
}
