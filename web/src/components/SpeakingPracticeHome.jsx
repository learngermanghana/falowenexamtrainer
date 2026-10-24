import React from "react";

export default function SpeakingPracticeHome({level,teil,guides={},lockedTeil,history={},ready,onSelectPart,onStart}) {
  const parts=Object.entries(guides).filter(([part])=>!lockedTeil || part===lockedTeil);
  return <section className="speaking-practice-home" aria-label="Choose speaking practice">
    <header><span className="speaking-eyebrow">DEIN RAUM ZUM DEUTSCHSPRECHEN · {level}</span>
      <h2 lang="de">In Ruhe üben.<br/>Sicherer sprechen.</h2>
      <p>Choose one part or practise the whole speaking exam.</p></header>
    {!lockedTeil ? <section className="speaking-full-exam" aria-label="Full speaking exam">
      <h3 lang="de">Gesamte Prüfung</h3><p>All {parts.length} parts · automatic progression · results at the end</p>
      <div className="speaking-part-track" aria-label="Exam parts">{parts.map(([part])=><span key={part}>Teil {part}</span>)}</div>
      <button type="button" disabled={!ready} onClick={()=>onStart(true)}>Start full speaking exam →</button>
    </section> : null}
    <div className="speaking-section-label"><h3 lang="de">Oder einen Teil wählen</h3><span>Individual practice</span></div>
    <div className="speaking-part-cards" role="group" aria-label="Choose an individual speaking part">
      {parts.map(([part,guide])=>{
        const completed=Object.values(history).filter(item=>item.level===level && item.teil===`Teil ${part}`);
        const latest=completed.sort((a,b)=>String(b.completedAt).localeCompare(String(a.completedAt)))[0];
        return <button type="button" key={part} aria-pressed={teil===part} onClick={()=>onSelectPart(part)}>
          <span className="speaking-part-icon" aria-hidden="true">{part==="1"?"♧":part==="2"?"▤":"☏"}</span>
          <span><strong lang="de">Teil {part} · {guide.title}</strong><small>{guide.english}</small>
            {latest ? <small className="speaking-practised">✓ {completed.length} tasks practised{Number.isFinite(latest.scorePercent)?` · Latest: ${latest.scorePercent}%`:""}</small> : <small>Ready for your first practice</small>}
          </span><span className="speaking-part-check" aria-hidden="true">{teil===part?"✓":"○"}</span>
        </button>;
      })}
    </div>
    <button className="speaking-start-part" type="button" disabled={!ready || !parts.some(([part])=>part===teil)} onClick={()=>onStart(false)}>Practise selected part · Teil {teil} →</button>
    {!ready ? <p role="status">Loading your speaking progress…</p> : null}
    {Object.values(history).some(item=>item.level===level) ? <details className="speaking-result-part">
      <summary>Review previous speaking feedback</summary>
      {Object.values(history).filter(item=>item.level===level).sort((a,b)=>String(b.completedAt).localeCompare(String(a.completedAt))).map(item=><details key={item.taskId}>
        <summary>{item.teil} · {item.topic} · {new Date(item.completedAt).toLocaleDateString()}</summary>
        <p className="speaking-result-feedback">{item.feedback}</p>
      </details>)}
    </details> : null}
    <small className="speaking-practice-footnote">Falowen speaking practice · Independent of Goethe-Institut</small>
  </section>;
}

export function SpeakingRunResults({level,results,onReturn,onRepeat}) {
  const scored=results.filter(item=>Number.isFinite(item.assessment?.score) && Number.isFinite(item.assessment?.maxScore) && item.assessment.maxScore>0);
  const score=scored.reduce((sum,item)=>sum+item.assessment.score,0);
  const maximum=scored.reduce((sum,item)=>sum+item.assessment.maxScore,0);
  return <section className="speaking-run-results" aria-label={results.length>1 ? "Full speaking exam results" : "Speaking practice results"}>
    <header className="speaking-feedback-header"><button type="button" onClick={onReturn}>← Choose practice</button><strong>Your feedback</strong></header>
    <span className="speaking-eyebrow">{level} · SPEAKING PRACTICE COMPLETE</span>
    <div className="speaking-feedback-intro"><span aria-hidden="true">✓</span><h2 lang="de">Gut gemacht.<br/>Weiter so.</h2></div>
    <p>You completed {results.length} speaking parts. Your feedback is saved in Speaking progress.</p>
    {maximum>0 && scored.length===results.length ? <div className="speaking-total-score" aria-label="Combined speaking practice score"><strong>{score} / {maximum}</strong><span>{Math.round(score/maximum*100)}% · all parts combined</span></div> : <p role="status">A combined score is unavailable because a part has no numeric assessment. Review the feedback below.</p>}
    <div className="speaking-results-parts" aria-label="Completed speaking parts">{results.map(item=><span key={item.teil}>✓ {item.teil}</span>)}</div>
    {results.map(item=><details className="speaking-result-part" key={item.teil} open={results.length===1}>
      <summary><strong>{item.teil}{item.assessment ? ` · ${item.assessment.score} / ${item.assessment.maxScore}`:""}</strong><span>View feedback</span></summary>
      <p lang="de">{item.topic}</p><SpeakingFeedback assessment={item.assessment} feedback={item.feedback}/>
    </details>)}
    {onRepeat ? <button type="button" className="speaking-start-part" onClick={onRepeat}>Practise again</button> : null}
    <button type="button" className="speaking-back-to-practice" onClick={onReturn}>Back to speaking practice</button>
    <small>Falowen practice assessment, not an official Goethe result. Transcript feedback does not assess pronunciation.</small>
  </section>;
}


export function SpeakingFeedback({assessment,feedback}) {
  if (!assessment?.summary) return <p className="speaking-result-feedback">{feedback}</p>;
  return <div className="speaking-feedback-cards">
    <p>{assessment.summary}</p>
    {assessment.strength ? <section className="speaking-feedback-strength"><h3>What went well</h3><p>{assessment.strength}</p></section> : null}
    {assessment.priority || assessment.nextPractice ? <section><h3>Make your next answer clearer</h3><ol>
      {assessment.priority ? <li>{assessment.priority}</li> : null}
      {assessment.nextPractice ? <li>{assessment.nextPractice}</li> : null}
    </ol></section> : null}
    {assessment.correctedExample ? <section className="speaking-feedback-example"><h3>Try it like this</h3><p lang="de">{assessment.correctedExample}</p></section> : null}
  </div>;
}
