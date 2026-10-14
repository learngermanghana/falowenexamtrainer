import React, { useState } from "react";
import { styles } from "../styles";
import LiveSpeakPage from "./LiveSpeakPage";

// One speaking engine and allowance, reused by Course Book lessons and Exam Room.
export default function LiveSpeakInlinePractice({
  level = "",
  topic = "",
  source = "speaking-practice",
}) {
  const [open, setOpen] = useState(false);

  return (
    <section data-live-speak-entry={source} aria-label="Live German voice conversation practice"
      style={{
        border: "1px solid #dbeafe", borderRadius: 14,
        background: "#f8fbff", padding: "clamp(12px, 3vw, 17px)",
        display: "grid", gap: 11, minWidth: 0,
      }}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
        <div style={{display:"grid",gap:5,flex:"1 1 220px",minWidth:0}}>
          <span style={{fontSize:11,fontWeight:800,color:"#1d4ed8",letterSpacing:".04em",textTransform:"uppercase"}}>
            Optional · German speaking practice
          </span>
          <h3 style={{margin:0,fontSize:18,color:"#0f172a"}}>🎤 Talk with your German AI partner</h3>
          <p style={{margin:0,color:"#475569",lineHeight:1.55,fontSize:13}}>
            Speak naturally, check what the microphone heard and get a spoken German reply.
            Uses your existing free Live Speak allowance.
          </p>
          {topic ? <p style={{margin:"3px 0 0",color:"#1e40af",fontSize:12,overflowWrap:"anywhere"}}>
            <strong>Lesson topic:</strong> {topic}
          </p> : null}
        </div>
        <button type="button"
          style={{...styles.secondaryButton,borderRadius:10,whiteSpace:"normal",minHeight:40,flex:"0 0 auto"}}
          aria-expanded={open} onClick={() => setOpen(value => !value)}>
          {open ? "Hide Live Speak" : "Start live voice conversation"}
        </button>
      </div>
      <p style={{margin:0,color:"#64748b",fontSize:11,lineHeight:1.5}}>
        Optional, ungraded practice. Workbook answers, mock results and teacher marking are not changed. No payment required.
      </p>
      {open ? (
        <div style={{borderTop:"1px solid #dbeafe",paddingTop:12,minWidth:0}}>
          <LiveSpeakPage embedded initialLevel={level} practiceTopic={topic} practiceSource={source} />
        </div>
      ) : null}
    </section>
  );
}
