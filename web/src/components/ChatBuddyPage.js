import React, { useCallback, useEffect, useRef, useState } from "react";
import { styles } from "../styles";
import { sendChatBuddyMessage } from "../services/chatBuddyService";
import { useAuth } from "../context/AuthContext";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

const initialHistory = [
  {
    role: "assistant",
    content:
      "Hello! I’m your Falowen Chat Buddy. Type or speak to me and I’ll reply with short tips plus a follow-up question.",
  },
];

const ChatBuddyPage = () => {
  const { idToken, studentProfile, user } = useAuth();
  const [level, setLevel] = useState("B1");
  const [inputMode, setInputMode] = useState("text");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState(initialHistory);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const historyEndRef = useRef(null);
  const profileLevel = (studentProfile?.level || "").toUpperCase();
  const isLevelLocked = LEVELS.includes(profileLevel);

  useEffect(() => {
    if (historyEndRef.current) {
      historyEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]);

  useEffect(() => {
    if (isLevelLocked && level !== profileLevel) {
      setLevel(profileLevel);
    }
  }, [isLevelLocked, level, profileLevel]);

  const startRecording = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const combined = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(combined);
        setAudioUrl(URL.createObjectURL(combined));
        setIsRecording(false);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      setError("Could not access your microphone. Please allow mic permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  const resetAudio = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setIsRecording(false);
    chunksRef.current = [];
  };

  const resetConversation = () => {
    resetAudio();
    setMessage("");
    setError("");
    setHistory(initialHistory);
  };

  const getActiveIdToken = useCallback(async () => {
    if (idToken) return idToken;
    if (user?.getIdToken) {
      try {
        return await user.getIdToken();
      } catch (tokenError) {
        console.warn("Could not refresh ID token for chat buddy", tokenError);
      }
    }
    return null;
  }, [idToken, user]);

  const handleSend = async () => {
    if (!message.trim() && !audioBlob) {
      setError("Please enter a message or record audio.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const activeToken = await getActiveIdToken();
      const response = await sendChatBuddyMessage({
        text: message.trim(),
        level,
        audioBlob,
        idToken: activeToken,
      });

      const userEntry = {
        role: "user",
        content: message.trim() || "🎙️ Voice message",
        transcript: response?.transcript || (audioBlob ? "(Transcript loading...)" : null),
      };

      const assistantEntry = {
        role: "assistant",
        content: response?.reply || "The buddy could not respond right now.",
      };

      setHistory((prev) => [...prev, userEntry, assistantEntry]);
      setMessage("");
      resetAudio();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || err.message || "Failed to reach chat buddy.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ ...styles.card, background: "#f8fafc" }}>
        <h2 style={{ margin: 0 }}>Chat Buddy: better exam practice</h2>
        <p style={{ ...styles.helperText, margin: "6px 0 10px 0" }}>
          Keep your messages short (2–4 sentences) and let the buddy reply with a follow-up question. It trains the back-and-forth
          rhythm you need in the exam.
        </p>
        <ul style={{ margin: 0, paddingLeft: 18, color: "#374151", fontSize: 13 }}>
          <li>🎯 Start with your level. If your profile has a level, we’ll lock it here so you practise the right difficulty.</li>
          <li>🎤 In record mode you can add a keyword note. It helps the AI understand your audio faster.</li>
          <li>🔁 Send 3–4 messages back and forth, then click "Reset conversation" to start a new loop.</li>
        </ul>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Chat Buddy</h2>
        <p style={styles.subtitle}>
          Practise speaking or writing with a friendly partner. Record a short message or type your question and
          the buddy will respond with a follow-up prompt.
        </p>
        <div style={styles.row}>
          <div style={styles.field}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label style={styles.label} htmlFor="level-select">
                Target level
              </label>
              {isLevelLocked && <span style={styles.badge}>From profile</span>}
            </div>
            <select
              id="level-select"
              style={styles.select}
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              disabled={loading || isLevelLocked}
            >
              {LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Input mode</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                type="button"
                style={inputMode === "text" ? styles.navButtonActive : styles.navButton}
                onClick={() => setInputMode("text")}
                disabled={loading}
              >
                Type
              </button>
              <button
                type="button"
                style={inputMode === "audio" ? styles.navButtonActive : styles.navButton}
                onClick={() => setInputMode("audio")}
                disabled={loading}
              >
                Record
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ ...styles.card, maxHeight: 360, overflow: "auto" }}>
        <h3 style={{ ...styles.sectionTitle, marginBottom: 8 }}>Conversation</h3>
        <div style={{ display: "grid", gap: 10 }}>
          {history.map((entry, idx) => (
            <div
              key={`${entry.role}-${idx}`}
              style={{
                padding: 12,
                borderRadius: 12,
                background: entry.role === "assistant" ? "#eef2ff" : "#ecfdf3",
                border: "1px solid #e5e7eb",
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 6 }}>
                {entry.role === "assistant" ? "Buddy" : "You"}
              </div>
              <div style={{ whiteSpace: "pre-wrap", color: "#111827" }}>{entry.content}</div>
              {entry.transcript ? (
                <div style={{ marginTop: 6, fontSize: 13, color: "#4b5563" }}>
                  Transcript: {entry.transcript}
                </div>
              ) : null}
            </div>
          ))}
          <div ref={historyEndRef} />
        </div>
      </div>

      <div style={styles.card}>
        {inputMode === "text" ? (
          <div style={{ display: "grid", gap: 8 }}>
            <label style={styles.label} htmlFor="chat-message">
              Message
            </label>
            <textarea
              id="chat-message"
              style={{ ...styles.input, minHeight: 100, resize: "vertical" }}
              placeholder="Describe your day, ask a question, or practise your exam topic."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
            />
          </div>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                style={isRecording ? styles.dangerButton : styles.primaryButton}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={loading}
              >
                {isRecording ? "Stop recording" : "Start recording"}
              </button>
              <button type="button" style={styles.secondaryButton} onClick={resetAudio} disabled={loading}>
                Clear audio
              </button>
              {isRecording ? <span style={{ color: "#b91c1c" }}>Recording... speak now</span> : null}
            </div>
            {audioUrl ? (
              <audio controls src={audioUrl} style={{ width: "100%" }}>
                Your browser does not support the audio element.
              </audio>
            ) : (
              <p style={{ ...styles.subtitle, margin: 0 }}>
                No clip yet. Click "Start recording" and tell the buddy about your day or exam practice topic.
              </p>
            )}
            <label style={styles.label} htmlFor="chat-note">
              Add an optional note
            </label>
            <textarea
              id="chat-note"
              style={{ ...styles.input, minHeight: 80, resize: "vertical" }}
              placeholder="Mention keywords or the exam part you want to practise."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
            />
          </div>
        )}

        {error ? <div style={{ ...styles.errorBox, marginTop: 10 }}>{error}</div> : null}

        <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
          <button type="button" style={styles.secondaryButton} onClick={resetConversation} disabled={loading}>
            Reset conversation
          </button>
          <button type="button" style={styles.secondaryButton} onClick={() => setMessage("")} disabled={loading}>
            Clear text
          </button>
          <button type="button" style={styles.primaryButton} onClick={handleSend} disabled={loading}>
            {loading ? "Sending..." : "Send to buddy"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBuddyPage;
