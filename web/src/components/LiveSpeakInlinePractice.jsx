import React, { useState } from "react";
import { styles } from "../styles";
import LiveSpeakPage from "./LiveSpeakPage";

// Small practice control inside the existing workbook speaking UI.
export default function LiveSpeakInlinePractice({ level = "", topic = "", source = "speaking-practice" }) {
  const [open, setOpen] = useState(false);
  return (
    <section data-live-speak-entry={source} aria-label="German voice practice"
      style={{display:"grid",gap:10,minWidth:0}}>
      <div style={{display:"flex",gap:9,alignItems:"center",flexWrap:"wrap"}}>
        <button type="button" aria-expanded={open}
          style={{...styles.secondaryButton,borderRadius:10,minHeight:40}}
          onClick={() => setOpen(value => !value)}>
          {open ? "Close voice practice" : "🎤 Practise speaking with AI"}
        </button>
        {!open && topic ? <span style={{fontSize:12,color:"#64748b"}}>{topic}</span> : null}
      </div>
      {open ? (
        <LiveSpeakPage embedded initialLevel={level} practiceTopic={topic} practiceSource={source} />
      ) : null}
    </section>
  );
}
