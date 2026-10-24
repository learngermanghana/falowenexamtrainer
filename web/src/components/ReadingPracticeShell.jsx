import React from "react";
import "./ReadingPracticeShell.css";

export const READING_LEVELS=Object.freeze({
 A1:{questions:15,parts:3,minutes:25,samples:3},
 A2:{questions:20,parts:4,minutes:30,samples:3},
 B1:{questions:30,parts:5,minutes:65,samples:3},
 B2:{questions:30,parts:5,minutes:65,samples:0},
 C1:{questions:30,parts:4,minutes:65,samples:1},
 C2:{questions:null,parts:null,minutes:null,samples:0},
});
export const readingTimeLabel=seconds=>{
 const n=Math.max(0,Math.floor(Number(seconds)||0));
 return String(Math.floor(n/60)).padStart(2,"0")+":"+String(n%60).padStart(2,"0");
};
export function ReadingPracticeHeader({level,sampleLabel,part,partCount,answered,total,secondsLeft,onBack,children}){
 return <header className="reading-unified-header">
  <div className="reading-unified-title">
   <div><p className="reading-unified-eyebrow">FALOWEN · EXAMS ROOM · {level} LESEN</p>
    <h1>{sampleLabel||"Reading practice"}</h1>
    <p>{partCount} Teile · {total} questions · answers are saved during practice</p>
   </div>
   {onBack?<button type="button" className="reading-unified-back" onClick={onBack}>← All samples</button>:null}
  </div>
  <div className="reading-unified-status">
   <div><span>Progress</span><strong>{answered}/{total} answered</strong></div>
   <div><span>Current section</span><strong>Teil {part} of {partCount}</strong></div>
   <div><span>Time remaining</span><strong className={secondsLeft===0?"reading-unified-timeout":""}>{readingTimeLabel(secondsLeft)}</strong></div>
   {children}
  </div>
  <div className="reading-unified-track" role="progressbar" aria-label="Reading answers completed"
   aria-valuenow={answered} aria-valuemin={0} aria-valuemax={total}>
   <div style={{width:`${Math.max(0,Math.min(100,answered/Math.max(1,total)*100))}%`}} />
  </div>
 </header>;
}
export function ReadingPartNavigation({parts,active,onSelect}){
 return <nav className="reading-unified-parts" aria-label="Lesen part navigation">
  {parts.map((part,i)=><button type="button" key={part.id||i}
   aria-current={active===i?"step":undefined}
   className={active===i?"is-active":part.answered===part.total?"is-complete":""}
   onClick={()=>onSelect(i)}>
   <span>Teil {i+1}</span><small>{part.answered}/{part.total} answered</small>
  </button>)}
 </nav>;
}
export function ReadingPartFooter({partIndex,partCount,onPrevious,onNext,children}){
 return <footer className="reading-unified-footer">
  <button type="button" disabled={partIndex===0} onClick={onPrevious}>← Previous Teil</button>
  <div>{children}</div>
  <button type="button" disabled={partIndex===partCount-1} onClick={onNext}>Next Teil →</button>
 </footer>;
}
