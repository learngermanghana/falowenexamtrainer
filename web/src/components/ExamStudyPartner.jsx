import React, { useState } from "react";
import { useAssessmentRestricted } from "../hooks/useAssessmentRestriction";
import { buildA1ChatGPTUrl } from "../utils/a1StudyPartner";
import { buildExamStudyPrompt, buildExamRevisionPrompt, buildExamPlanPrompt, REVISION_MINUTES, canShowExamStudyPartner, EXAM_STUDY_SKILLS, EXAM_STUDY_MODES } from "../utils/examStudyPartner";

export default function ExamStudyPartner({ level, section, restricted = false, revisionFocus = null, completedSkills = {}, revisionPlan = null }) {
  const assessmentRestricted = useAssessmentRestricted(restricted);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [mode, setMode] = useState(null);
  const [copyStatus, setCopyStatus] = useState("");
  const [dailyMinutes, setDailyMinutes] = useState(30);
  if (!canShowExamStudyPartner({ level, section, restricted: assessmentRestricted })) return null;
  const skill = section === "overview" ? selectedSkill || revisionFocus?.section || "overview" : section;
  const completed = Object.prototype.hasOwnProperty.call(completedSkills, skill);
  const activity = mode === "mistakes" && !completed ? "practice" : mode || (revisionFocus?.section === skill && completed ? "mistakes" : "practice");
  const isPlan = section === "overview" && activity === "plan" && Boolean(revisionPlan);
  const prompt = isPlan ? buildExamPlanPrompt({ level, ...revisionPlan, minutes: dailyMinutes }) : activity === "mistakes" ? buildExamRevisionPrompt({ level, section: skill, part: completedSkills[skill], completed }) : buildExamStudyPrompt({ level, section: skill, mode: activity });
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
        <p style={{ margin: 0, fontSize: 13 }}>Practise with fresh questions before an exam. Your official results stay in Falowen. Suggested revision uses your existing results locally; no scores or answers are shared.</p>
        {section === "overview" && !isPlan && <label style={{ display: "grid", gap: 4 }}>Choose a skill
          <select value={skill} onChange={e => { setSelectedSkill(e.target.value); setMode(null); setCopyStatus(""); }} style={{ padding: 8, maxWidth: "100%", color: "#14532d", background: "white", borderRadius: 6 }}>
            {EXAM_STUDY_SKILLS.map(item => <option key={item.key} value={item.key}>{item.label}</option>)}
          </select>
        </label>}
        <label style={{ display: "grid", gap: 4 }}>Choose study activity
          <select value={activity} onChange={e => { setMode(e.target.value); setCopyStatus(""); }} style={{ padding: 8, maxWidth: "100%", color: "#14532d", background: "white", borderRadius: 6 }}>
            {EXAM_STUDY_MODES.map(item => <option key={item.key} value={item.key}>{item.label}</option>)}
            {completed && <option value="mistakes">Understand my mistakes</option>}
            {section === "overview" && revisionPlan && <option value="plan">Create my exam revision plan</option>}
          </select>
        </label>
        {isPlan && <div style={{display:"grid",gap:8}}>
          <p style={{margin:0,fontSize:13}}>{revisionPlan.daysRemaining === 0 ? "Your exam is today. Prepare with a light refresher." : revisionPlan.daysRemaining > 0 ? revisionPlan.daysRemaining + " day" + (revisionPlan.daysRemaining === 1 ? "" : "s") + " until your booked exam." : "Add or update your booked exam date above for a countdown-based plan. You can still create a flexible 7-day plan."}</p>
          <label style={{display:"grid",gap:4}}>Daily study time
            <select value={dailyMinutes} onChange={e=>{setDailyMinutes(Number(e.target.value));setCopyStatus("");}} style={{padding:8,maxWidth:"100%",color:"#14532d",background:"white",borderRadius:6}}>
              {REVISION_MINUTES.map(minutes=><option key={minutes} value={minutes}>{minutes} minutes</option>)}
            </select>
          </label>
          <small>{revisionPlan.historyAvailable ? "Uses broad priorities from your existing results across all four skills." : "No reliable results available yet; start with a short diagnostic."} Only remaining days, study time, level and broad priorities are shared, not the booked date or scores.</small>
        </div>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <a href={buildA1ChatGPTUrl(prompt)} target="_blank" rel="noopener noreferrer" style={{ background: "#166534", color: "#fff", padding: "10px 14px", borderRadius: 8, textDecoration: "none", fontWeight: 700 }}>{isPlan ? "Create my plan in ChatGPT ↗" : "Continue to ChatGPT ↗"}</a>
          <button type="button" onClick={copyPrompt} style={{ border: "1px solid #86b69a", background: "#fff", color: "#14532d", borderRadius: 8, padding: "10px 14px" }}>Copy prompt</button>
        </div>
        <p style={{ margin: 0, fontSize: 13 }}>Connect Falowen Learning Companion in ChatGPT for available Falowen practice resources. If the prompt does not open automatically, paste the copied prompt. ChatGPT usage limits may apply.</p>
        <details>
          <summary style={{ cursor: "pointer", fontSize: 13 }}>Preview generated prompt</summary>
          <textarea aria-label="Generated exam preparation prompt" readOnly value={prompt} rows={6} style={{ boxSizing: "border-box", width: "100%", marginTop: 6, padding: 8, color: "#14532d", background: "#fff" }} />
        </details>
        {copyStatus && <p role="status" style={{ margin: 0, fontSize: 13 }}>{copyStatus}</p>}
      </div>
    </details>
  );
}
