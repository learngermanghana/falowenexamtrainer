import "./ExamStudyPartnerMobile.css";
import React, { useState } from "react";
import { useAssessmentRestricted } from "../hooks/useAssessmentRestriction";
import { buildA1ChatGPTUrl } from "../utils/a1StudyPartner";
import { buildExamStudyPrompt, buildExamRevisionPrompt, canShowExamStudyPartner, EXAM_STUDY_SKILLS, EXAM_STUDY_MODES } from "../utils/examStudyPartner";

export default function ExamStudyPartner({ level, section, restricted = false, revisionFocus = null, completedSkills = {} }) {
  const assessmentRestricted = useAssessmentRestricted(restricted);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [mode, setMode] = useState(null);
  const [copyStatus, setCopyStatus] = useState("");
  if (!canShowExamStudyPartner({ level, section, restricted: assessmentRestricted })) return null;
  const skill = section === "overview" ? selectedSkill || revisionFocus?.section || "overview" : section;
  const completed = Object.prototype.hasOwnProperty.call(completedSkills, skill);
  const activity = mode === "mistakes" && !completed ? "practice" : mode || (revisionFocus?.section === skill && completed ? "mistakes" : "practice");
  const prompt = activity === "mistakes" ? buildExamRevisionPrompt({ level, section: skill, part: completedSkills[skill], completed }) : buildExamStudyPrompt({ level, section: skill, mode: activity });
  const recommended = EXAM_STUDY_SKILLS.find(item => item.key === revisionFocus?.section);
  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyStatus("Prompt copied. Paste it into ChatGPT.");
    } catch { setCopyStatus("Copy the prompt from the preview below."); }
  };
  const label = EXAM_STUDY_SKILLS.find(item => item.key === section)?.label;
  return (
    <details data-exam-study-partner={section} style={{ background: "#f0fdf4", color: "#14532d", border: "1px solid #bbdfc8", borderRadius: 10, padding: "10px 12px", minWidth: 0 }}>
      <summary style={{ cursor: "pointer", fontWeight: 700, lineHeight: 1.6 }}>
        Prepare with ChatGPT <span style={{ fontSize: 13, fontWeight: 400 }}>· {level}{section === "overview" ? " exam preparation" : " · " + label}</span>
        {recommended && <span style={{display:"block",fontWeight:400,fontSize:13}}>Suggested revision: {recommended.label}{revisionFocus.part ? " · " + revisionFocus.part : ""}</span>}
      </summary>
      <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
        <p style={{ margin: 0, fontSize: 13 }}>Practise with authorised Falowen questions before an exam. Your official results stay in Falowen. Suggested revision uses your existing results locally; only level, skill and Teil are shared.</p>
        {section === "overview" && <label style={{ display: "grid", gap: 4 }}>Choose a skill
          <select value={skill} onChange={e => { setSelectedSkill(e.target.value); setMode(null); setCopyStatus(""); }} style={{ padding: 8, maxWidth: "100%", color: "#14532d", background: "white", borderRadius: 6 }}>
            {EXAM_STUDY_SKILLS.map(item => <option key={item.key} value={item.key}>{item.label}</option>)}
          </select>
        </label>}
        <label style={{ display: "grid", gap: 4 }}>Choose study activity
          <select value={activity} onChange={e => { setMode(e.target.value); setCopyStatus(""); }} style={{ padding: 8, maxWidth: "100%", color: "#14532d", background: "white", borderRadius: 6 }}>
            {EXAM_STUDY_MODES.map(item => <option key={item.key} value={item.key}>{item.label}</option>)}
            {completed && <option value="mistakes">Understand my mistakes</option>}
          </select>
        </label>
        <div className="exam-study-partner-actions" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <a href={buildA1ChatGPTUrl(prompt)} target="_blank" rel="noopener noreferrer" style={{ background: "#166534", color: "#fff", padding: "10px 14px", borderRadius: 8, textDecoration: "none", fontWeight: 700 }}>Continue to ChatGPT ↗</a>
          <button type="button" onClick={copyPrompt} style={{ border: "1px solid #86b69a", background: "#fff", color: "#14532d", borderRadius: 8, padding: "10px 14px" }}>Copy prompt</button>
        </div>
        <p style={{ margin: 0, fontSize: 13 }}>Connect Falowen Learning Companion in ChatGPT before practice. If it is disconnected, ChatGPT will be instructed to explain how to connect in English. If the prompt does not open automatically, paste the copied prompt. ChatGPT usage limits may apply.</p>
        <details>
          <summary style={{ cursor: "pointer", fontSize: 13 }}>Preview generated prompt</summary>
          <textarea aria-label="Generated exam preparation prompt" readOnly value={prompt} rows={6} style={{ boxSizing: "border-box", width: "100%", marginTop: 6, padding: 8, color: "#14532d", background: "#fff" }} />
        </details>
        {copyStatus && <p role="status" style={{ margin: 0, fontSize: 13 }}>{copyStatus}</p>}
      </div>
    </details>
  );
}
