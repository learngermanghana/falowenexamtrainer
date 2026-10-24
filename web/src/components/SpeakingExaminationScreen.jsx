import React from "react";

export default function SpeakingExaminationScreen({level,teil,parts,fullExam,completed,guide,busy,onBack,children}) {
  return <section className="speaking-examination-screen" aria-label="Speaking examination screen">
    <header className="speaking-practice-toolbar">
      <button type="button" disabled={busy} onClick={onBack}>← Choose practice</button>
      <strong>{fullExam ? "Full speaking exam" : "Individual practice"} · {level}</strong>
      <ol className="speaking-active-parts" aria-label="Speaking exam parts">
        {parts.map(part=><li key={part} aria-current={part===teil ? "step" : undefined}>
          {fullExam && Number(part)<Number(teil) ? "✓ " : ""}Teil {part}
        </li>)}
      </ol>
      {fullExam ? <span role="status">{completed} parts complete · continues automatically</span> : null}
    </header>
    <div className="speaking-examination-content">
      <details className="speaking-examination-instructions" aria-label="Speaking exam instructions">
        <summary>Teil {teil} · {guide.title} · Instructions</summary>
        <p lang="de">{guide.german}</p><p>{guide.english}</p>
        <ol>{guide.steps.map(step=><li key={step}>{step}</li>)}</ol>
      </details>
      {children}
    </div>
  </section>;
}
