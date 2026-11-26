import React, { useState } from "react";
import { A1_STUDY_MODES, buildA1StudyPrompt, buildA1ChatGPTUrl, isA1StudyPartnerLesson } from "../utils/a1StudyPartner";

const buttonStyle = { display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 42, padding: "9px 14px", borderRadius: 9, fontWeight: 700, textDecoration: "none", cursor: "pointer" };

export default function A1StudyPartner({ lesson, section = "" }) {
  const [mode, setMode] = useState("explain");
  const [copyStatus, setCopyStatus] = useState("");
  if (!isA1StudyPartnerLesson(lesson)) return null;

  const prompt = buildA1StudyPrompt(lesson, mode, section);
  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyStatus("Prompt copied. Paste it into ChatGPT if needed.");
    } catch {
      setCopyStatus("Please select and copy the prompt below.");
    }
  };

  return (
    <details data-a1-study-partner="true" style={{ background: "#f0fdf4", color: "#14532d", border: "1px solid #bbdfc8", borderRadius: 12, padding: "12px 14px", minWidth: 0 }}>
      <summary style={{ cursor: "pointer", fontWeight: 800, lineHeight: 1.6 }}>
        Study with ChatGPT <span style={{ fontWeight: 400, color: "#466557", fontSize: 13 }}>· Your AI study partner</span>
      </summary>
      <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>Practise this lesson with ChatGPT. Choose what you need help with. Your official assignment and marks stay in Falowen.</p>
        <fieldset style={{ margin: 0, padding: 0, border: 0, display: "grid", gap: 8 }}>
          <legend style={{ fontWeight: 700, marginBottom: 8 }}>How would you like to study?</legend>
          {A1_STUDY_MODES.map(option => (
            <label key={option.key} style={{ display: "flex", gap: 8, alignItems: "center", minHeight: 32 }}>
              <input type="radio" name={"a1-study-mode-" + lesson.day + "-" + lesson.chapter} checked={mode === option.key} onChange={() => { setMode(option.key); setCopyStatus(""); }} />
              {option.label}
            </label>
          ))}
        </fieldset>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <a href={buildA1ChatGPTUrl(prompt)} target="_blank" rel="noopener noreferrer" style={{ ...buttonStyle, color: "#fff", background: "#166534" }}>Continue to ChatGPT ↗</a>
          <button type="button" onClick={copyPrompt} style={{ ...buttonStyle, background: "#fff", color: "#14532d", border: "1px solid #86b69a" }}>Copy prompt</button>
        </div>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>Opens ChatGPT in a new tab. For exact Falowen lesson materials, connect the Falowen Learning Companion in ChatGPT. If the prompt does not appear automatically, copy and paste it there. ChatGPT usage limits may apply.</p>
        {copyStatus && <p role="status" style={{ margin: 0, fontSize: 13 }}>{copyStatus}</p>}
        <details>
          <summary style={{ cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Preview generated prompt</summary>
          <textarea aria-label="Generated study prompt" readOnly value={prompt} rows={6} style={{ boxSizing: "border-box", width: "100%", marginTop: 8, padding: 10, borderRadius: 8, border: "1px solid #bbdfc8", color: "#14532d", background: "#fff", font: "inherit", fontSize: 13 }} />
        </details>
      </div>
    </details>
  );
}
