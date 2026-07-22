import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(repositoryRoot, "web/src/components/SpeakingPage.js");
let source = fs.readFileSync(sourcePath, "utf8");

const replaceOnce = (before, after, label) => {
  if (source.includes(after)) return;
  if (!source.includes(before)) {
    throw new Error(`Goethe coach audio feedback patch anchor missing: ${label}`);
  }
  source = source.replace(before, after);
};

replaceOnce(
  `    requestSpeechForMessage: requestSpeechForCustomCoachMessage,
    retrySpeechForMessage: retryCustomCoachAudio,
    cleanupCoachSpeech,
    isCoachTtsEligible,`,
  `    requestSpeechForMessage: requestSpeechForCustomCoachMessage,
    retrySpeechForMessage: retryCustomCoachAudio,
    playBrowserSpeechForMessage,
    stopBrowserSpeech,
    cleanupCoachSpeech,
    isCoachTtsEligible,`,
  "browser speech helpers",
);

replaceOnce(
  `  const toggleAudioPlayback = async (messageId) => {
    const currentAudio = audioRefs.current[messageId];
    if (!currentAudio) return;
    setPlaybackError("");

    if (playingMessageId && playingMessageId !== messageId) {
      const previousAudio = audioRefs.current[playingMessageId];
      if (previousAudio) {
        previousAudio.pause();
        previousAudio.currentTime = 0;
      }
    }

    if (playingMessageId === messageId) {
      currentAudio.pause();
      setPlayingMessageId("");
      return;
    }

    try {
      await playAudioElement(currentAudio);
      setPlayingMessageId(messageId);
    } catch (error) {
      setPlayingMessageId("");
      setPlaybackError(error?.message || "Playback could not start.");
    }
  };`,
  `  const toggleAudioPlayback = async (messageId) => {
    const message = [...customChatMessages, ...chatMessages].find((item) => item?.id === messageId);
    setPlaybackError("");

    if (message?.browserSpeech) {
      if (playingMessageId === messageId) {
        stopBrowserSpeech();
        return;
      }
      const started = playBrowserSpeechForMessage(messageId, message.text);
      if (!started) setPlaybackError("This device has no German browser voice available.");
      return;
    }

    const currentAudio = audioRefs.current[messageId];
    if (!currentAudio) return;

    if (playingMessageId && playingMessageId !== messageId) {
      stopBrowserSpeech();
      const previousAudio = audioRefs.current[playingMessageId];
      if (previousAudio) {
        previousAudio.pause();
        previousAudio.currentTime = 0;
      }
    }

    if (playingMessageId === messageId) {
      currentAudio.pause();
      setPlayingMessageId("");
      return;
    }

    try {
      await playAudioElement(currentAudio);
      setPlayingMessageId(messageId);
    } catch (error) {
      setPlayingMessageId("");
      setPlaybackError(error?.message || "Playback could not start.");
    }
  };`,
  "browser-aware playback",
);

replaceOnce(
  `                              ) : message.audioUrl ? (
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <button
                                    type="button"
                                    aria-label={playingMessageId === message.id ? "Pause German reply" : "Play German reply"}
                                    style={{ ...styles.secondaryButton, padding: "6px 10px" }}
                                    onClick={() => toggleAudioPlayback(message.id)}
                                  >
                                    {playingMessageId === message.id ? "⏸" : "▶"} Listen
                                  </button>
                                  <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                                    {waveHeights.slice(0, 10).map((height, index) => (
                                      <span key={\`\${message.id}-reply-wave-\${index}\`} style={{ display: "inline-block", width: 3, height: Math.max(6, height - 6), borderRadius: 999, background: "#86EFAC" }} />
                                    ))}
                                  </div>
                                  <audio ref={(node) => { if (node) { audioRefs.current[message.id] = node; node.onended = () => setPlayingMessageId("");
                                  node.onerror = () => { setPlayingMessageId(""); setPlaybackError("This device cannot play the recording format. Please record again."); }; } }} src={message.audioUrl} />
                                </div>`,
  `                              ) : message.audioUrl || message.browserSpeech ? (
                                <div style={{ display: "grid", gap: 6, justifyItems: "start" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <button
                                      type="button"
                                      aria-label={playingMessageId === message.id ? "Pause German reply" : "Play German reply"}
                                      style={{ ...styles.secondaryButton, padding: "6px 10px" }}
                                      onClick={() => toggleAudioPlayback(message.id)}
                                    >
                                      {playingMessageId === message.id ? "⏸" : "▶"} Listen
                                    </button>
                                    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                                      {waveHeights.slice(0, 10).map((height, index) => (
                                        <span key={\`\${message.id}-reply-wave-\${index}\`} style={{ display: "inline-block", width: 3, height: Math.max(6, height - 6), borderRadius: 999, background: "#86EFAC" }} />
                                      ))}
                                    </div>
                                    {message.audioUrl ? (
                                      <audio ref={(node) => { if (node) { audioRefs.current[message.id] = node; node.onended = () => setPlayingMessageId("");
                                      node.onerror = () => { setPlayingMessageId(""); setPlaybackError("This device cannot play the recording format. Please record again."); }; } }} src={message.audioUrl} />
                                    ) : null}
                                  </div>
                                  {message.browserSpeech && message.audioErrorMessage ? (
                                    <span role="status" style={{ fontSize: 12, color: "#475569", lineHeight: 1.45 }}>
                                      {message.audioErrorMessage}
                                    </span>
                                  ) : null}
                                </div>`,
  "device voice player",
);

replaceOnce(
  `                              ) : message.audioError ? (
                                <button type="button" aria-label="Retry German audio" style={{ ...styles.secondaryButton, padding: "6px 10px", justifySelf: "start" }} onClick={() => retryCustomCoachAudio(message)}>
                                  Retry audio
                                </button>
                              ) : null`,
  `                              ) : message.audioError ? (
                                <div style={{ display: "grid", gap: 6, justifyItems: "start" }}>
                                  <span role="status" style={{ fontSize: 12, color: "#92400E", lineHeight: 1.45 }}>
                                    {message.audioErrorMessage || "The German audio reply could not be prepared."}
                                  </span>
                                  {message.audioRetryable !== false ? (
                                    <button type="button" aria-label="Retry German audio" style={{ ...styles.secondaryButton, padding: "6px 10px", justifySelf: "start" }} onClick={() => retryCustomCoachAudio(message)}>
                                      Retry audio
                                    </button>
                                  ) : null}
                                </div>
                              ) : null`,
  "actionable error message",
);

fs.writeFileSync(sourcePath, source, "utf8");
console.log("Applied Goethe coach audio feedback and device voice fallback.");
