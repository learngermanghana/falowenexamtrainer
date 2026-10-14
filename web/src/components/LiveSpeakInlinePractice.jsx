import React, { Suspense, lazy, useState } from "react";
import { styles } from "../styles";

// Load the existing voice tutor only after a learner asks to speak.
// This uses the SAME backend, free trial credits and global cost cap everywhere.
const LiveSpeakPage = lazy(() => import("./LiveSpeakPage"));

export default function LiveSpeakInlinePractice({
  level = "",
  topic = "",
  source = "speaking-practice",
}) {
  const [open, setOpen] = useState(false);

  return (
    <section
      data-live-speak-entry={source}
      aria-label="Live German voice conversation practice"
      style={{
        border: "1px solid #bfdbfe", borderRadius: 14,
        background: "#eff6ff", padding: "14px 16px",
        display: "grid", gap: 9, minWidth: 0,
      }}
    >
      <div style={{ display: "grid", gap: 5 }}>
        <strong style={{ color: "#1e3a8a", fontSize: 16 }}>🎤 Live Speak · German voice conversation</strong>
        <p style={{ margin: 0, color: "#334155", lineHeight: 1.55, fontSize: 13 }}>
          Hear a natural German voice, speak your answer, review what the microphone heard,
          and receive a spoken correction and follow-up. Uses your existing free Live Speak allowance.
        </p>
        {topic ? <p style={{ margin: 0, color: "#1e40af", fontSize: 13 }}><strong>Practice topic:</strong> {topic}</p> : null}
        <small style={{ color: "#475569" }}>
          Optional practice only. It does not answer, submit or alter timed or graded exam work.
          No payment required.
        </small>
      </div>
      <div>
        <button
          type="button"
          style={{ ...styles.secondaryButton, borderRadius: 10 }}
          aria-expanded={open}
          onClick={() => setOpen(value => !value)}
        >
          {open ? "Hide Live Speak" : "Start live voice conversation"}
        </button>
      </div>
      {open ? (
        <Suspense fallback={<p role="status">Preparing the German voice tutor…</p>}>
          <LiveSpeakPage
            embedded
            initialLevel={level}
            practiceTopic={topic}
            practiceSource={source}
          />
        </Suspense>
      ) : null}
    </section>
  );
}
