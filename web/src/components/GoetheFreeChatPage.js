import React, { useEffect, useMemo, useRef, useState } from "react";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { requestCustomSpeakingChatReply } from "../services/presentationCoachService";
import { analyzeAudio } from "../services/coachService";
import { logStudentActivity } from "../services/studyBuddyService";
import { triggerInteractionFeedback } from "../services/interactionFeedback";
import {
  SPEAKING_AUDIO_MIN_SECONDS,
  buildRecordedAudioBlob,
  createSpeakingMediaRecorder,
  maxSpeakingRecordingSeconds,
  playAudioElement,
  revokeObjectUrl,
  userFacingAudioError,
} from "../lib/speakingAudio";
import {
  CUSTOM_SPEAKING_CHAT_DURATION_OPTIONS,
  DEFAULT_CUSTOM_SPEAKING_CHAT_DURATION_MINUTES,
  normalizeSpeakingChatDurationMinutes,
  speakingChatSessionSeconds,
} from "../lib/speakingSessionDuration";

const GERMAN_KEYS = ["ä", "ö", "ü", "ß"];
const audioCaptureConstraints = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  channelCount: 1,
};

const formatTime = (seconds = 0) => {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
};

const formatClock = (date) =>
  new Date(date).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

const readRouteMeta = () => {
  if (typeof window === "undefined") return { level: "", day: 0 };
  const path = String(window.location?.pathname || "").toLowerCase();
  const match =
    path.match(/\/campus\/course\/lesson\/(a1|a2|b1|b2|c1)\/(\d+)/) ||
    path.match(/(a1|a2|b1|b2|c1)-day-(\d+)/);
  return match ? { level: match[1].toUpperCase(), day: Number(match[2]) } : { level: "", day: 0 };
};

const normalizeLevel = (value = "") => {
  const level = String(value || "").trim().toUpperCase();
  return ["A2", "B1", "B2", "C1"].includes(level) ? level : "A2";
};

const makeWelcomeMessage = (level) => ({
  id: `goethe-free-chat-welcome-${Date.now()}`,
  role: "coach",
  type: "text",
  text: `Hallo! This is your ${level} Goethe free Sprechen chat. Write or record a German message. I will answer in text, correct gently and ask one follow-up question.`,
  createdAt: new Date().toISOString(),
});

export default function GoetheFreeChatPage({ lockedLevel = "", contextLabel = "", speakingContext = {} }) {
  const routeMeta = useMemo(() => readRouteMeta(), []);
  const inheritedContext = useMemo(() => {
    const globalContext = typeof window !== "undefined" ? window.__FALOWEN_COURSE_SPEAKING_CONTEXT__ || {} : {};
    return { ...globalContext, ...speakingContext };
  }, [speakingContext]);
  const level = normalizeLevel(lockedLevel || inheritedContext.level || routeMeta.level || "A2");
  const topic = String(inheritedContext.topic || inheritedContext.question || "").trim();
  const { idToken, user, studentProfile } = useAuth();
  const { showToast } = useToast();
  const userId = user?.uid || "";
  const studentCode = studentProfile?.studentCode || studentProfile?.studentcode || studentProfile?.id || userId;

  const [messages, setMessages] = useState(() => [makeWelcomeMessage(level)]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessionState, setSessionState] = useState("idle");
  const [durationMinutes, setDurationMinutes] = useState(DEFAULT_CUSTOM_SPEAKING_CHAT_DURATION_MINUTES);
  const [secondsLeft, setSecondsLeft] = useState(speakingChatSessionSeconds(DEFAULT_CUSTOM_SPEAKING_CHAT_DURATION_MINUTES));
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordingError, setRecordingError] = useState("");
  const [playingMessageId, setPlayingMessageId] = useState("");

  const draftRef = useRef(null);
  const messagesEndRef = useRef(null);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const recordingIntervalRef = useRef(null);
  const recordingSecondsRef = useRef(0);
  const audioRefs = useRef({});
  const objectUrlsRef = useRef(new Set());
  const timeoutLoggedRef = useRef(false);

  const isEnded = sessionState === "ended";
  const recordingMaxSeconds = maxSpeakingRecordingSeconds({ level, context: "presentation" });
  const sessionLabel = formatTime(secondsLeft);

  const quickStarters = useMemo(() => {
    const starters = [
      "Lass uns über meinen Alltag sprechen.",
      "Frag mich über meine Hobbys.",
      "Ich möchte über Arbeit oder Schule sprechen.",
    ];
    if (topic) starters.unshift(`Lass uns über ${topic} sprechen.`);
    return starters.slice(0, 4);
  }, [topic]);

  const logEvent = (event, metadata = {}) => {
    logStudentActivity({
      event,
      feature: "goethe_free_speaking_chat",
      studentCode,
      userId,
      level,
      metadata: { day: routeMeta.day, topic, ...metadata },
    }).catch(() => {});
  };

  const appendCoachText = (text) => {
    setMessages((current) => [
      ...current,
      {
        id: `goethe-free-chat-coach-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        role: "coach",
        type: "text",
        text,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const startSession = (source = "manual") => {
    const normalizedMinutes = normalizeSpeakingChatDurationMinutes(durationMinutes);
    setDurationMinutes(normalizedMinutes);
    setSecondsLeft(speakingChatSessionSeconds(normalizedMinutes));
    setSessionState("running");
    setError("");
    timeoutLoggedRef.current = false;
    logEvent("chat_session_start", { source, durationMinutes: normalizedMinutes });
  };

  const endSession = (source = "manual") => {
    setSessionState("ended");
    appendCoachText(`Session complete. You practised for up to ${durationMinutes} minutes. Start a new session when you are ready.`);
    logEvent("chat_session_end", { source, secondsLeft });
  };

  useEffect(() => {
    if (sessionState !== "running") return undefined;
    const timer = window.setInterval(() => setSecondsLeft((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [sessionState]);

  useEffect(() => {
    if (sessionState !== "running" || secondsLeft > 0 || timeoutLoggedRef.current) return;
    timeoutLoggedRef.current = true;
    setSessionState("ended");
    appendCoachText(`Session complete. You practised for ${durationMinutes} minutes. Review one correction and one useful phrase before you continue.`);
    logEvent("chat_session_timeout", { durationMinutes });
  }, [durationMinutes, secondsLeft, sessionState]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView?.({ behavior: "smooth", block: "end" });
  }, [loading, messages.length]);

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) window.clearInterval(recordingIntervalRef.current);
      streamRef.current?.getTracks?.().forEach((track) => track.stop());
      Object.values(audioRefs.current).forEach((audio) => audio?.pause?.());
      objectUrlsRef.current.forEach((url) => revokeObjectUrl(url));
      objectUrlsRef.current.clear();
    };
  }, []);

  const requestReply = async (messageText, historyMessages = messages) => {
    const history = historyMessages
      .map((message) => ({
        role: message.role === "student" ? "user" : "assistant",
        content: message.type === "audio" ? message.transcript : message.text,
      }))
      .filter((message) => String(message.content || "").trim());

    const response = await requestCustomSpeakingChatReply({
      message: messageText,
      level,
      history,
      idToken,
      mode: "Speaking",
      lessonContext: {
        lessonTitle: contextLabel || (topic ? `Course Book speaking: ${topic}` : "Course Book free speaking chat"),
        topic,
        allowedScope: inheritedContext.allowedScope || "",
      },
      sessionContext: {
        state: sessionState === "running" ? "running" : sessionState === "ended" ? "ended" : "starting",
        durationMinutes,
        minutesLeft: secondsLeft / 60,
      },
    });

    return String(response?.reply || "").trim() || "Ich konnte gerade nicht antworten. Bitte versuche es noch einmal.";
  };

  const notifySuccess = () => {
    triggerInteractionFeedback({
      sound: "success",
      toastMessage: "Free Sprechen chat replied.",
      toastVariant: "success",
      showToast,
      notificationTitle: "Goethe free Sprechen chat",
      notificationBody: "Your speaking partner replied.",
      notificationTag: "goethe-free-speaking-chat-reply",
      vibratePattern: [45],
    });
  };

  const notifyError = () => {
    triggerInteractionFeedback({
      sound: "error",
      toastMessage: "Free Sprechen chat is unavailable right now.",
      toastVariant: "error",
      showToast,
      vibratePattern: [120],
    });
  };

  const sendMessage = async () => {
    const trimmed = draft.trim();
    if (!trimmed || loading || isEnded) return;
    if (sessionState !== "running") startSession("first_message");

    const studentMessage = {
      id: `goethe-free-chat-student-${Date.now()}`,
      role: "student",
      type: "text",
      text: trimmed,
      createdAt: new Date().toISOString(),
    };

    setMessages((current) => [...current, studentMessage]);
    setDraft("");
    setLoading(true);
    setError("");

    try {
      const replyText = await requestReply(trimmed);
      appendCoachText(replyText);
      notifySuccess();
    } catch (requestError) {
      setError(requestError?.message || "Could not reach the free Sprechen chat.");
      appendCoachText("Der freie Sprechen-Chat ist gerade nicht verfügbar. Bitte versuche es gleich noch einmal.");
      notifyError();
    } finally {
      setLoading(false);
    }
  };

  const stopRecording = () => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  };

  const startRecording = async () => {
    if (isRecording || loading || isEnded) return;
    if (sessionState !== "running") startSession("first_voice_message");
    setRecordingError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: audioCaptureConstraints });
      streamRef.current = stream;
      const recorder = createSpeakingMediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data?.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = async () => {
        const duration = recordingSecondsRef.current;
        if (recordingIntervalRef.current) {
          window.clearInterval(recordingIntervalRef.current);
          recordingIntervalRef.current = null;
        }
        setIsRecording(false);
        setRecordingSeconds(0);
        recordingSecondsRef.current = 0;

        if (duration < SPEAKING_AUDIO_MIN_SECONDS) {
          setRecordingError(`Please record for at least ${SPEAKING_AUDIO_MIN_SECONDS} seconds so the AI can hear you clearly.`);
          streamRef.current?.getTracks?.().forEach((track) => track.stop());
          streamRef.current = null;
          return;
        }

        let blob;
        try {
          blob = buildRecordedAudioBlob(chunksRef.current, recorder);
        } catch (blobError) {
          setRecordingError(userFacingAudioError(blobError));
          streamRef.current?.getTracks?.().forEach((track) => track.stop());
          streamRef.current = null;
          return;
        }

        const audioUrl = URL.createObjectURL(blob);
        objectUrlsRef.current.add(audioUrl);
        const voiceMessage = {
          id: `goethe-free-chat-voice-${Date.now()}`,
          role: "student",
          type: "audio",
          audioUrl,
          duration,
          transcript: "",
          createdAt: new Date().toISOString(),
        };

        setMessages((current) => [...current, voiceMessage]);
        setLoading(true);
        setError("");

        try {
          const response = await analyzeAudio({
            audioBlob: blob,
            teil: "Custom chat",
            level,
            question: topic || "Free custom speaking conversation",
            userId,
            idToken,
            durationSeconds: duration,
          });
          const transcript = String(response?.transcript || "").trim();
          if (!transcript) {
            appendCoachText("I could not hear a clear sentence. Please try recording again or type your message.");
            return;
          }

          setMessages((current) => current.map((message) => (
            message.id === voiceMessage.id ? { ...message, transcript } : message
          )));
          appendCoachText(`Transcript I heard: ${transcript}`);
          const replyText = await requestReply(transcript);
          appendCoachText(replyText);
          notifySuccess();
        } catch (voiceError) {
          const message = userFacingAudioError(voiceError, "Could not reach the free Sprechen chat.");
          setError(message);
          appendCoachText(message);
          notifyError();
        } finally {
          setLoading(false);
          streamRef.current?.getTracks?.().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      recorder.start(1000);
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingSecondsRef.current = 0;
      recordingIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((current) => {
          const next = current + 1;
          recordingSecondsRef.current = next;
          if (next >= recordingMaxSeconds && recorder.state === "recording") {
            window.setTimeout(() => recorder.stop(), 0);
          }
          return next;
        });
      }, 1000);
    } catch (recordingStartError) {
      setRecordingError(recordingStartError?.message || "Microphone access was blocked.");
    }
  };

  const toggleRecordingPlayback = async (messageId) => {
    const audio = audioRefs.current[messageId];
    if (!audio) return;
    if (playingMessageId && playingMessageId !== messageId) {
      const previous = audioRefs.current[playingMessageId];
      previous?.pause?.();
      if (previous) previous.currentTime = 0;
    }
    if (playingMessageId === messageId) {
      audio.pause();
      setPlayingMessageId("");
      return;
    }
    try {
      await playAudioElement(audio);
      setPlayingMessageId(messageId);
    } catch (playError) {
      setRecordingError(playError?.message || "This recording could not be played on this device.");
    }
  };

  const clearConversation = () => {
    messages.forEach((message) => {
      if (message?.type !== "audio" || !message.audioUrl) return;
      revokeObjectUrl(message.audioUrl);
      objectUrlsRef.current.delete(message.audioUrl);
    });
    setMessages([makeWelcomeMessage(level)]);
    setDraft("");
    setError("");
    setRecordingError("");
    setSessionState("idle");
    setSecondsLeft(speakingChatSessionSeconds(durationMinutes));
    timeoutLoggedRef.current = false;
    setPlayingMessageId("");
  };

  const insertCharacter = (character) => {
    const input = draftRef.current;
    setDraft((current) => {
      const start = typeof input?.selectionStart === "number" ? input.selectionStart : current.length;
      const end = typeof input?.selectionEnd === "number" ? input.selectionEnd : current.length;
      window.setTimeout(() => {
        input?.focus?.();
        input?.setSelectionRange?.(start + character.length, start + character.length);
      }, 0);
      return `${current.slice(0, start)}${character}${current.slice(end)}`;
    });
  };

  return (
    <div data-goethe-free-chat="text-first" style={{ ...styles.card, margin: 0, padding: 0, overflow: "hidden" }}>
      <header style={{ padding: 16, background: "linear-gradient(120deg,#047857,#0f766e)", color: "#fff", display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div>
          <strong style={{ fontSize: 20 }}>Goethe Free Sprechen Chat · {level}</strong>
          <p style={{ margin: "5px 0 0", opacity: 0.9, fontSize: 13 }}>{contextLabel || topic || "Free German conversation practice"}</p>
        </div>
        <button type="button" style={{ ...styles.secondaryButton, background: "#fff" }} onClick={clearConversation}>Clear conversation</button>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(220px,300px) minmax(0,1fr)" }}>
        <aside style={{ padding: 14, background: "#f8fafc", borderRight: "1px solid #e5e7eb", display: "grid", alignContent: "start", gap: 12 }}>
          <span style={{ ...styles.badge, width: "fit-content" }}>Text-first stable chat</span>
          <div style={{ padding: 12, borderRadius: 12, border: "1px solid #a7f3d0", background: "#ecfdf5", lineHeight: 1.6, fontSize: 13 }}>
            Type or record your German. The AI replies in text so the conversation stays reliable. Voice recordings are still transcribed and analysed.
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            <strong style={{ fontSize: 13 }}>Quick starters</strong>
            {quickStarters.map((starter) => (
              <button key={starter} type="button" style={{ ...styles.secondaryButton, textAlign: "left", justifyContent: "flex-start" }} onClick={() => setDraft(starter)}>{starter}</button>
            ))}
          </div>
        </aside>

        <section style={{ minHeight: 540, display: "grid", gridTemplateRows: "1fr auto", background: "#e5e7eb" }}>
          <div style={{ padding: 16, display: "grid", gap: 12, overflowY: "auto", alignContent: "start" }}>
            {messages.map((message) => {
              const isStudent = message.role === "student";
              return (
                <div key={message.id} style={{ display: "flex", justifyContent: isStudent ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "82%", padding: "10px 14px", borderRadius: 18, background: isStudent ? "#047857" : "#fff", color: isStudent ? "#fff" : "#1f2937", boxShadow: "0 2px 8px rgba(15,23,42,.08)" }}>
                    {message.type === "audio" ? (
                      <div style={{ display: "grid", gap: 7 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <button type="button" aria-label={playingMessageId === message.id ? "Pause my recording" : "Play my recording"} style={{ ...styles.secondaryButton, padding: "5px 9px" }} onClick={() => toggleRecordingPlayback(message.id)}>
                            {playingMessageId === message.id ? "Pause" : "Play"}
                          </button>
                          <span style={{ fontSize: 12 }}>{formatTime(message.duration || 0)}</span>
                        </div>
                        {message.transcript ? <span style={{ fontSize: 12, lineHeight: 1.5 }}>You said: {message.transcript}</span> : <span style={{ fontSize: 12 }}>Transcribing…</span>}
                        <audio ref={(node) => { if (node) { audioRefs.current[message.id] = node; node.onended = () => setPlayingMessageId(""); } }} src={message.audioUrl} />
                      </div>
                    ) : (
                      <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.55 }}>{message.text}</p>
                    )}
                    <p style={{ margin: "6px 0 0", opacity: 0.7, fontSize: 11 }}>{formatClock(message.createdAt)}</p>
                  </div>
                </div>
              );
            })}
            {loading ? <div style={{ justifySelf: "start", background: "#fff", borderRadius: 16, padding: "10px 14px", color: "#4b5563", fontSize: 13 }}>Free Sprechen chat is typing…</div> : null}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ borderTop: "1px solid #d1d5db", padding: 14, background: "#f9fafb", display: "grid", gap: 10 }}>
            <div style={{ padding: 10, borderRadius: 12, border: "1px solid #a7f3d0", background: "#ecfdf5", display: "grid", gap: 8 }}>
              <strong style={{ fontSize: 13 }}>Choose your chat time</strong>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {CUSTOM_SPEAKING_CHAT_DURATION_OPTIONS.map((minutes) => (
                  <button key={minutes} type="button" disabled={sessionState === "running"} style={{ ...(durationMinutes === minutes ? styles.primaryButton : styles.secondaryButton), borderRadius: 999, padding: "6px 12px", fontSize: 12 }} onClick={() => { setDurationMinutes(minutes); setSecondsLeft(speakingChatSessionSeconds(minutes)); }}>
                    {minutes} minutes
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                {sessionState === "running" ? (
                  <button type="button" style={{ ...styles.secondaryButton, padding: "5px 10px" }} onClick={() => endSession("manual")}>End</button>
                ) : (
                  <button type="button" style={{ ...styles.secondaryButton, padding: "5px 10px" }} onClick={() => startSession(sessionState === "ended" ? "new_session" : "manual")}>Start {durationMinutes}-minute session</button>
                )}
                <strong style={{ fontSize: 12, color: "#047857" }}>Session: {sessionLabel}</strong>
              </div>
            </div>

            {error ? <p style={{ margin: 0, color: "#b91c1c", fontSize: 12 }}>{error}</p> : null}
            {recordingError ? <p style={{ margin: 0, color: "#b91c1c", fontSize: 12 }}>{recordingError}</p> : null}

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button type="button" style={{ ...styles.primaryButton, background: "#047857" }} onClick={isRecording ? stopRecording : startRecording} disabled={loading || isEnded}>
                {isRecording ? `Stop & Send (${formatTime(recordingSeconds)})` : "Record voice"}
              </button>
              <span style={{ alignSelf: "center", fontSize: 12, color: "#475569" }}>Minimum {SPEAKING_AUDIO_MIN_SECONDS}s · maximum {formatTime(recordingMaxSeconds)}</span>
            </div>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {GERMAN_KEYS.map((character) => <button key={character} type="button" style={{ ...styles.secondaryButton, padding: "5px 9px" }} onClick={() => insertCharacter(character)}>{character}</button>)}
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <textarea ref={draftRef} style={{ ...styles.input, minHeight: 58, flex: "1 1 280px", resize: "vertical" }} placeholder={topic ? `Answer in German about: ${topic}` : "Write a German message…"} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(); } }} disabled={loading || isEnded} />
              <button type="button" style={{ ...styles.primaryButton, minWidth: 88, background: "#047857" }} onClick={sendMessage} disabled={loading || isEnded || !draft.trim()}>Send</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
