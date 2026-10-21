import React, { useEffect, useState } from "react";
import "./SpeakingExamDesign.css";

// A1–C2 share the same examiner and waiting treatment; no new AI requests.
export const AI_SPEAKING_WAIT_PHASES = Object.freeze({
  connecting: {
    title: "Connecting to your AI examiner",
    detail: "Please wait. Falowen is connecting you to the AI examiner, who will speak first in German.",
  },
  opening: {
    title: "Preparing the examiner's voice",
    detail: "Please wait and listen. Your AI examiner is preparing the German question and its audio.",
  },
  reply: {
    title: "Preparing the examiner's reply",
    detail: "Falowen is processing your answer. Please wait and listen to the next German question.",
  },
  feedback: {
    title: "Preparing your speaking feedback",
    detail: "Your confirmed answers are being reviewed. Please wait while AI marking finishes.",
  },
});

export default function SpeakingAiLoadingStatus({ phase }) {
  const [takingLonger, setTakingLonger] = useState(false);
  const content = AI_SPEAKING_WAIT_PHASES[phase];
  useEffect(() => {
    setTakingLonger(false);
    if (!content) return undefined;
    const delay = setTimeout(() => setTakingLonger(true), 12000);
    return () => clearTimeout(delay);
  }, [phase, Boolean(content)]);
  if (!content) return null;
  return (
    <div className="speaking-ai-wait" role="status" aria-live="polite"
      aria-label="AI speaking loading status" aria-atomic="true" data-ai-wait-phase={phase}>
      <span className="speaking-ai-wait__spinner" aria-hidden="true" />
      <div className="speaking-ai-wait__copy">
        <strong>{content.title}</strong>
        <p>{content.detail}</p>
        {takingLonger ? <p className="speaking-ai-wait__patience">
          This is taking a little longer than usual. Please keep this page open; there is no need to press Start or Send again.
        </p> : null}
      </div>
    </div>
  );
}
