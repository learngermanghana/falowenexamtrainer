import React, { useEffect, useRef, useState } from "react";

// Spoken German exam prompts are synthesized on the student's device: no new
// AI request, no audio storage, and no microphone permission is needed.
export function stopMockExaminerAudio() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export default function MockExaminerAudio({ text, disabled = false }) {
  const [speaking, setSpeaking] = useState(false);
  const [message, setMessage] = useState("");
  const utteranceRef = useRef(null);

  useEffect(() => {
    return () => {
      if (utteranceRef.current) stopMockExaminerAudio();
      utteranceRef.current = null;
    };
  }, [text]);

  const play = () => {
    if (typeof window === "undefined" || !window.speechSynthesis ||
        typeof window.SpeechSynthesisUtterance !== "function") {
      setMessage("German voice playback is unavailable on this device. Follow the written German prompt instead.");
      return;
    }
    stopMockExaminerAudio();
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = "de-DE";
    utterance.rate = 0.88;
    const voices = window.speechSynthesis.getVoices?.() || [];
    utterance.voice = voices.find(voice => voice.lang?.toLowerCase() === "de-de") ||
      voices.find(voice => voice.lang?.toLowerCase().startsWith("de")) || null;
    utterance.onend = () => {
      if (utteranceRef.current === utterance) {
        utteranceRef.current = null;
        setSpeaking(false);
      }
    };
    utterance.onerror = () => {
      if (utteranceRef.current === utterance) {
        utteranceRef.current = null;
        setSpeaking(false);
        setMessage("Could not play the examiner's voice. Use the written prompt and continue.");
      }
    };
    utteranceRef.current = utterance;
    setSpeaking(true);
    setMessage("");
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    stopMockExaminerAudio();
    utteranceRef.current = null;
    setSpeaking(false);
  };

  return (
    <section className="mock-examiner-voice" aria-label="German speaking examiner" style={{padding:"12px 14px",background:"#f1f7fa",border:"1px solid #bfd7e8",borderRadius:12,margin:"12px 0",display:"grid",gap:8}}>
      <strong>Listen to the German examiner</strong>
      <p style={{margin:0,fontSize:14}}>First play the examiner's prompt. Then record your answer in German. The German exam question remains visible below.</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
        <button type="button" onClick={play} disabled={disabled} aria-label="Play German examiner prompt">
          {speaking ? "Replay examiner" : "Play examiner"}
        </button>
        {speaking ? <button type="button" onClick={stop}>Stop examiner audio</button> : null}
      </div>
      {message ? <p role="status" style={{margin:0}}>{message}</p> : null}
    </section>
  );
}
