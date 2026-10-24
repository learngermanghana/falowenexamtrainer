import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(root, "web/src/components/SpeakingPage.js");
let source = fs.readFileSync(file, "utf8");

function replaceOnce(before, after, label) {
  if (source.includes(after)) return;
  if (label === "custom reset timer" && source.includes('setCustomSessionState("idle");')) return;
  if (!source.includes(before)) {
    throw new Error(`Custom speaking duration patch anchor missing: ${label}`);
  }
  source = source.replace(before, after);
}

replaceOnce(
  'import { CUSTOM_SPEAKING_CHAT_SESSION_SECONDS, requestCoachSpeech, requestCustomSpeakingChatReply, requestSpeakingTextAnalysis } from "../services/presentationCoachService";',
  'import { CUSTOM_SPEAKING_CHAT_SESSION_SECONDS, requestCoachSpeech, requestCustomSpeakingChatReply, requestSpeakingTextAnalysis } from "../services/presentationCoachService";\nimport {\n  CUSTOM_SPEAKING_CHAT_DURATION_OPTIONS,\n  DEFAULT_CUSTOM_SPEAKING_CHAT_DURATION_MINUTES,\n  normalizeSpeakingChatDurationMinutes,\n  speakingChatSessionSeconds,\n} from "../lib/speakingSessionDuration";',
  "duration helper import",
);

replaceOnce(
  '  const [customSessionState, setCustomSessionState] = useState("idle");\n  const [customSessionSecondsLeft, setCustomSessionSecondsLeft] = useState(CUSTOM_SPEAKING_CHAT_SESSION_SECONDS);',
  '  const [customSessionState, setCustomSessionState] = useState("idle");\n  const [customSessionDurationMinutes, setCustomSessionDurationMinutes] = useState(DEFAULT_CUSTOM_SPEAKING_CHAT_DURATION_MINUTES);\n  const [customSessionSecondsLeft, setCustomSessionSecondsLeft] = useState(CUSTOM_SPEAKING_CHAT_SESSION_SECONDS);',
  "duration state",
);

replaceOnce(
  `  const startCustomSession = (source = "manual") => {
    setCustomSessionState("running");
    setCustomSessionSecondsLeft(CUSTOM_SPEAKING_CHAT_SESSION_SECONDS);
    setCustomChatError("");
    customSessionTimeoutLoggedRef.current = false;
    logSpeakingChatEvent("chat_session_start", { source, durationSeconds: CUSTOM_SPEAKING_CHAT_SESSION_SECONDS });
  };`,
  `  const startCustomSession = (source = "manual") => {
    const durationMinutes = normalizeSpeakingChatDurationMinutes(customSessionDurationMinutes);
    const durationSeconds = speakingChatSessionSeconds(durationMinutes);
    setCustomSessionDurationMinutes(durationMinutes);
    setCustomSessionState("running");
    setCustomSessionSecondsLeft(durationSeconds);
    setCustomChatError("");
    customSessionTimeoutLoggedRef.current = false;
    logSpeakingChatEvent("chat_session_start", { source, durationMinutes, durationSeconds });
  };`,
  "dynamic session start",
);

replaceOnce(
  '    appendCustomCoachText(`Session complete 🎉\\nYou practised in a focused session.\\nStart a new session when you are ready.`);',
  '    appendCustomCoachText(`Session complete 🎉\\nYour ${customSessionDurationMinutes}-minute practice session is closed.\\nStart a new session when you are ready.`);',
  "manual session summary",
);

replaceOnce(
  `    appendCustomCoachText(
      \`Session complete 🎉\\nYou practised for 10 minutes.\\nStart a new session when you are ready.\\n\\nQuick summary:\\n• 2 mistakes to fix: choose your top grammar pattern and pronunciation habit from today.\\n• 2 useful phrases: reuse one connector and one topic phrase from the chat.\\n• Next speaking task: give a 45-second opinion and one reason.\`
    );
    logSpeakingChatEvent("chat_session_timeout", { durationSeconds: CUSTOM_SPEAKING_CHAT_SESSION_SECONDS });
  }, [customSessionSecondsLeft, customSessionState]);`,
  `    appendCustomCoachText(
      \`Session complete 🎉\\nYou practised for \${customSessionDurationMinutes} minutes.\\nStart a new session when you are ready.\\n\\nQuick summary:\\n• 2 mistakes to fix: choose your top grammar pattern and pronunciation habit from today.\\n• 2 useful phrases: reuse one connector and one topic phrase from the chat.\\n• Next speaking task: give a 45-second opinion and one reason.\`
    );
    logSpeakingChatEvent("chat_session_timeout", {
      durationMinutes: customSessionDurationMinutes,
      durationSeconds: speakingChatSessionSeconds(customSessionDurationMinutes),
    });
  }, [customSessionDurationMinutes, customSessionSecondsLeft, customSessionState]);`,
  "dynamic timeout summary",
);

replaceOnce(
  `      sessionContext: {
        state: customSessionState === "running" ? "running" : customSessionState === "ended" ? "ended" : "starting",
        minutesLeft: customSessionSecondsLeft / 60,
      },`,
  `      sessionContext: {
        state: customSessionState === "running" ? "running" : customSessionState === "ended" ? "ended" : "starting",
        durationMinutes: customSessionDurationMinutes,
        minutesLeft: customSessionSecondsLeft / 60,
      },`,
  "duration request context",
);

replaceOnce(
  `    if (activeSpeakingTab === "custom") {
      releaseMessageAudio(customChatMessages);
      setCustomChatMessages([`,
  `    if (activeSpeakingTab === "custom") {
      releaseMessageAudio(customChatMessages);
      setCustomSessionState("idle");
      setCustomSessionSecondsLeft(speakingChatSessionSeconds(customSessionDurationMinutes));
      customSessionTimeoutLoggedRef.current = false;
      setCustomChatMessages([`,
  "custom reset timer",
);

replaceOnce(
  `              <div style={{ borderTop: "1px solid #D1D5DB", padding: 14, background: "#F9FAFB", display: "grid", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }} aria-live="polite">`,
  `              <div style={{ borderTop: "1px solid #D1D5DB", padding: 14, background: "#F9FAFB", display: "grid", gap: 10 }}>
                <div style={{ ...styles.card, margin: 0, padding: 10, background: "#ECFDF5", border: "1px solid #A7F3D0", display: "grid", gap: 8 }}>
                  <div>
                    <strong style={{ fontSize: 13 }}>Choose your chat time</strong>
                    <p style={{ margin: "3px 0 0", fontSize: 12, color: "#047857" }}>Paste your speaking question or topic, choose 10, 20, or 30 minutes, then start chatting.</p>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }} aria-label="Speaking chat duration">
                    {CUSTOM_SPEAKING_CHAT_DURATION_OPTIONS.map((minutes) => {
                      const selected = customSessionDurationMinutes === minutes;
                      return (
                        <button
                          key={minutes}
                          type="button"
                          style={{ ...(selected ? styles.primaryButton : styles.secondaryButton), borderRadius: 999, padding: "6px 12px", fontSize: 12, background: selected ? "#059669" : undefined }}
                          onClick={() => {
                            if (customSessionState === "running") return;
                            setCustomSessionDurationMinutes(minutes);
                            setCustomSessionSecondsLeft(speakingChatSessionSeconds(minutes));
                          }}
                          disabled={customSessionState === "running"}
                        >
                          {minutes} minutes
                        </button>
                      );
                    })}
                  </div>
                  {customSessionState === "running" ? <span style={{ fontSize: 11, color: "#047857" }}>The time is locked until this session ends.</span> : null}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }} aria-live="polite">`,
  "duration selector UI",
);

replaceOnce(
  `{customSessionState === "ended" ? "Start new session" : "Start session"}`,
  `{customSessionState === "ended" ? \`Start new \${customSessionDurationMinutes}-minute session\` : \`Start \${customSessionDurationMinutes}-minute session\`}`,
  "dynamic start button label",
);

replaceOnce(
  '                {customSessionState === "ended" ? <p style={{ margin: 0, fontSize: 12, color: "#047857" }}>Session complete 🎉 Start a new session when you are ready.</p> : null}',
  '                {customSessionState === "ended" ? <p style={{ margin: 0, fontSize: 12, color: "#047857" }}>Session complete 🎉 Choose a duration and start a new session when you are ready.</p> : null}',
  "ended session hint",
);

replaceOnce(
  '                    placeholder="Start a free German conversation..."',
  '                    placeholder="Paste your speaking question or start a German conversation..."',
  "custom chat placeholder",
);

fs.writeFileSync(file, source, "utf8");
console.log("Applied selectable 10, 20, and 30 minute speaking chat sessions.");
