import "./ExamStudyPartnerMobile.css";
import React, { useState } from "react";
import { useAssessmentRestricted } from "../hooks/useAssessmentRestriction";
import { buildA1ChatGPTUrl } from "../utils/a1StudyPartner";
import { buildExamRevisionPrompt, safeExamPart } from "../utils/examStudyPartner";

export default function ExamMistakeReview({ level, section, part, completed = false, restricted = false, label = "Understand my mistakes with ChatGPT" }) {
  const blocked = useAssessmentRestricted(restricted);
  const [status, setStatus] = useState("");
  const prompt = buildExamRevisionPrompt({level, section, part, completed});
  if (blocked || !prompt) return null;
  return <details data-exam-mistake-review={section} style={{ border: "1px solid #bbdfc8", background: "#f0fdf4", color: "#14532d", borderRadius: 9, padding: "9px 12px", minWidth: 0, textAlign: "left" }}>
    <summary style={{cursor:"pointer",fontWeight:700,fontSize:14}}>{label}{safeExamPart(part) ? " · " + safeExamPart(part) : ""}</summary>
    <div style={{display:"grid",gap:8,marginTop:8}}>
      <p style={{margin:0,fontSize:13}}>Connect Falowen Learning Companion to review the underlying mistakes and practise with authorised material. Only your level, skill and exam part are shared, not your answers or score.</p>
      <div className="exam-study-partner-actions" style={{display:"flex",flexWrap:"wrap",gap:8}}>
      <a href={buildA1ChatGPTUrl(prompt)} target="_blank" rel="noopener noreferrer" style={{color:"#14532d",fontWeight:700}}>Continue to ChatGPT ↗</a>
      <button type="button" onClick={async()=>{try{await navigator.clipboard.writeText(prompt);setStatus("Prompt copied.");}catch{setStatus("Select and copy the preview below.");}}} style={{fontSize:13,justifySelf:"start"}}>Copy prompt</button>
      </div>
      {status && <small role="status">{status}</small>}
      <details><summary style={{cursor:"pointer",fontSize:13}}>Preview prompt</summary><textarea readOnly aria-label="Mistake review prompt" value={prompt} rows={6} style={{boxSizing:"border-box",width:"100%",fontSize:13}} /></details>
    </div>
  </details>;
}
