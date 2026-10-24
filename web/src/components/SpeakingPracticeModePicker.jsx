import React from "react";

const MODES = [
  {
    key: "coach",
    icon: "📝",
    title: "Exam Coach",
    description: "Type or record your answer and review corrections.",
    detail: "Questions · Feedback",
  },
  {
    key: "voice",
    icon: "🎙️",
    title: "Practise with AI Examiner",
    description: "Listen, speak and receive feedback after the task.",
    detail: "Spoken exam practice",
  },
];

export default function SpeakingPracticeModePicker({ value = "coach", onChange, compact = false, disabled = false }) {
  return (
    <section aria-label="Choose speaking practice mode"
      style={{padding:compact ? "13px 12px" : "17px 20px",background:"#fff",borderBottom:"1px solid #e2e8f0"}}>
      <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",gap:8,flexWrap:"wrap",marginBottom:10}}>
        <h2 style={{fontSize:15,margin:0,color:"#0f172a"}}>How would you like to practise?</h2>

      </div>
      <div role="group" aria-label="Speaking practice mode"
        style={{display:"grid",gridTemplateColumns:compact ? "minmax(0, 1fr)" : "repeat(2, minmax(0, 1fr))",gap:10}}>
        {MODES.map((mode) => {
          const active = value === mode.key;
          return (
            <button key={mode.key} type="button" aria-pressed={active} disabled={disabled}
              onClick={() => { if (!disabled) onChange?.(mode.key); }}
              style={{
                display:"flex",alignItems:"flex-start",gap:10,width:"100%",minWidth:0,
                textAlign:"left",padding:compact ? "12px" : "14px 15px",borderRadius:13,
                border:active ? "2px solid #2563eb" : "1px solid #cbd5e1",
                background:active ? "#eff6ff" : "#fff",color:"#0f172a",cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.6:1,
                boxShadow:active ? "0 2px 8px rgba(37,99,235,.09)" : "none",
              }}>
              <span aria-hidden="true" style={{fontSize:22,lineHeight:1.25}}>{mode.icon}</span>
              <span style={{display:"grid",gap:3,minWidth:0}}>
                <strong style={{fontSize:14}}>{mode.title}</strong>
                <span style={{fontSize:12,lineHeight:1.45,color:"#475569"}}>{mode.description}</span>
                <span style={{fontSize:11,fontWeight:700,color:active?"#1d4ed8":"#64748b"}}>{mode.detail}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
