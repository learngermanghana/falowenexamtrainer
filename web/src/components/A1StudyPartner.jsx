import React, { useState } from "react";
import { A1_STUDY_MODES, A1_VOICE_MODES, VOICE_TEACHER_LEVELS, buildVoiceTeacherPrompt, buildStudyPrompt, buildA1ChatGPTUrl, isStudyPartnerLesson } from "../utils/a1StudyPartner";

import { useAssessmentRestricted } from "../hooks/useAssessmentRestriction";

const buttonStyle = { display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 42, padding: "9px 14px", borderRadius: 9, fontWeight: 700, textDecoration: "none", cursor: "pointer" };

export default function StudyPartner({ lesson, section = "", level = "A1" }) {
  const [mode, setMode] = useState("explain");
  const [copyStatus, setCopyStatus] = useState("");
  const assessmentRestricted = useAssessmentRestricted();
  if (assessmentRestricted || !isStudyPartnerLesson(lesson, level)) return null;

  const voiceMode = VOICE_TEACHER_LEVELS.includes(level) && A1_VOICE_MODES.some(item => item.key === mode);
  const prompt = voiceMode ? buildVoiceTeacherPrompt(lesson, mode, level) : buildStudyPrompt(lesson, mode, section, level);
  const options = VOICE_TEACHER_LEVELS.includes(level) ? [...A1_VOICE_MODES, ...A1_STUDY_MODES] : A1_STUDY_MODES;
  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyStatus("Prompt copied. Paste it into ChatGPT if needed.");
    } catch {
      setCopyStatus("Please select and copy the prompt below.");
    }
  };

  return (
    <details data-a1-study-partner={level === "A1" ? "true" : undefined} data-study-partner={level} style={{ background: "#f0fdf4", color: "#14532d", border: "1px solid #bbdfc8", borderRadius: 12, padding: "12px 14px", minWidth: 0 }}>
      <summary style={{ cursor: "pointer", fontWeight: 800, lineHeight: 1.6 }}>
        Study with ChatGPT <span style={{ fontWeight: 400, color: "#466557", fontSize: 13 }}>· Your AI study partner</span>
      </summary>
      <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>Practise this lesson with ChatGPT. Choose what you need help with. Your official assignment and marks stay in Falowen.</p>
        <fieldset style={{ margin: 0, padding: 0, border: 0, display: "grid", gap: 8 }}>
          <legend style={{ fontWeight: 700, marginBottom: 8 }}>How would you like to study?</legend>
          {options.map(option => (
            <label key={option.key} style={{ display: "flex", gap: 8, alignItems: "center", minHeight: 32 }}>
              <input type="radio" name={level.toLowerCase() + "-study-mode-" + lesson.day + "-" + lesson.chapter} checked={mode === option.key} onChange={() => { setMode(option.key); setCopyStatus(""); }} />
              {option.label}
            </label>
          ))}
        </fieldset>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <a href={buildA1ChatGPTUrl(prompt)} target="_blank" rel="noopener noreferrer" style={{ ...buttonStyle, color: "#fff", background: "#166534" }}>{voiceMode ? "Open voice lesson in ChatGPT ↗" : "Continue to ChatGPT ↗"}</a>
          <button type="button" onClick={copyPrompt} style={{ ...buttonStyle, background: "#fff", color: "#14532d", border: "1px solid #86b69a" }}>Copy prompt</button>
        </div>
        {voiceMode && <div style={{display:"grid",gap:5,fontSize:13,lineHeight:1.6}}>
          <strong>Use ChatGPT Live Voice</strong>
          <p style={{margin:0}}>Connect Falowen Learning Companion, open ChatGPT, send the generated prompt (or paste it), then tap the Voice icon. In Settings → Voice choose Live if needed. Allow microphone access in ChatGPT. Your voice session happens in ChatGPT, not in Falowen; account limits apply.</p>
          <p style={{margin:0}}>If the plugin is unavailable, retrieve the lesson in text first or ask for topic-based practice. The microphone does not start automatically.</p>
        </div>}
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>Opens ChatGPT in a new tab. For exact Falowen lesson materials, connect the Falowen Learning Companion in ChatGPT. If the prompt does not appear automatically, copy and paste it there. ChatGPT usage limits may apply.</p>
        <details>
          <summary style={{ cursor: "pointer", fontSize: 13, fontWeight: 700 }}>First time? Connect your Falowen account</summary>
          <p style={{ fontSize: 13, lineHeight: 1.6, margin: "8px 0 0" }}>Open ChatGPT, find Falowen Learning Companion in the plugin directory, select Connect, and sign in to your Falowen account. Then return to this lesson and continue to ChatGPT. You can also practise with the topic prompt without connecting.</p>
        </details>
        {copyStatus && <p role="status" style={{ margin: 0, fontSize: 13 }}>{copyStatus}</p>}
        <details>
          <summary style={{ cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Preview generated prompt</summary>
          <textarea aria-label="Generated study prompt" readOnly value={prompt} rows={6} style={{ boxSizing: "border-box", width: "100%", marginTop: 8, padding: 10, borderRadius: 8, border: "1px solid #bbdfc8", color: "#14532d", background: "#fff", font: "inherit", fontSize: 13 }} />
        </details>
      </div>
    </details>
  );
}
