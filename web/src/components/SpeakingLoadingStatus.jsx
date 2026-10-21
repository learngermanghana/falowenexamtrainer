import React, { useEffect, useState } from "react";
import "./SpeakingLoadingStatus.css";

export default function SpeakingLoadingStatus({ phase }) {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    setSlow(false);
    const timer = setTimeout(() => setSlow(true), 12000);
    return () => clearTimeout(timer);
  }, [phase]);

  const title = {
    connecting: "Connecting to your AI speaking examiner…",
    opening: "Preparing your German examiner’s voice…",
    response: "Processing your answer and preparing the examiner’s reply…",
    feedback: "Preparing your speaking feedback…",
  }[phase];
  return (
    <div className="speaking-loading-status" role="status" aria-live="polite" aria-atomic="true">
      <span className="speaking-loading-status__spinner" aria-hidden="true" />
      <div>
        <strong>{title}</strong>
        <p>{phase === "connecting" || phase === "opening"
          ? "Please wait. The AI will speak first. Listen before answering."
          : "Please wait. You do not need to record again."}</p>
        {slow ? <p className="speaking-loading-status__slow">This is taking longer than usual. We’re still waiting for the AI. Please keep this page open.</p> : null}
      </div>
    </div>
  );
}
