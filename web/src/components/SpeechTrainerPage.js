import React, { useCallback, useEffect, useRef, useState } from "react";
import { styles } from "../styles";
import { sendSpeechTrainerAttempt } from "../services/speechTrainerService";
import { useAuth } from "../context/AuthContext";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

const SpeechTrainerPage = () => {
  const { idToken, studentProfile, user } = useAuth();
  const [level, setLevel] = useState("B1");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [note, setNote] = useState("");
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const profileLevel = (studentProfile?.level || "").toUpperCase();
  const isLevelLocked = LEVELS.includes(profileLevel);

  useEffect(() => {
    if (isLevelLocked && level !== profileLevel) {
      setLevel(profileLevel);
    }
  }, [isLevelLocked, level, profileLevel]);

  useEffect(() => () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  }, [audioUrl]);

  const getActiveIdToken = useCallback(async () => {
    if (idToken) return idToken;
    if (user?.getIdToken) {
      try {
        return await user.getIdToken();
      } catch (tokenError) {
        console.warn("Could not refresh ID token for speech trainer", tokenError);
      }
    }
    return null;
  }, [idToken, user]);

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  const startRecording = async () => {
    setError("");
    setTranscript("");
    setFeedback("");
    setAudioBlob(null);
    setAudioUrl(null);

    if (!navigator?.mediaDevices?.getUserMedia) {
      setError("Recording not possible in this browser. Please allow microphone access.");
      return;
    }

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
        const url = URL.createObjectURL(combined);
        setAudioBlob(combined);
        setAudioUrl(url);
        setIsRecording(false);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      setError("Could not start recording. Please check your microphone permissions.");
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
      return;
    }
    startRecording();
  };

  const resetSession = () => {
    setNote("");
    setTranscript("");
    setFeedback("");
    setError("");
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setIsRecording(false);
    chunksRef.current = [];
  };

  const sendForFeedback = async () => {
    if (!audioBlob) {
      setError("Record a clip first so Whisper can listen.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const activeToken = await getActiveIdToken();
      const response = await sendSpeechTrainerAttempt({
        audioBlob,
        note: note.trim(),
        level,
        idToken: activeToken,
      });

      setTranscript(response?.transcript || "No transcript returned.");
      setFeedback(response?.feedback || "The AI could not generate feedback right now.");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || err.message || "Could not reach the speech trainer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ ...styles.card, background: "#f0f9ff", borderColor: "#bae6fd" }}>
        <h2 style={{ margin: 0 }}>Speech Trainer with Whisper</h2>
        <p style={{ ...styles.helperText, margin: "6px 0 10px 0" }}>
          Swap the old chat buddy for a focused speech trainer. Tap the recorder wand, speak your answer, and get instant
          feedback from Whisper and the AI coach. Keep clips short (30–60 seconds) so the response arrives quickly.
        </p>
        <ul style={{ margin: 0, paddingLeft: 18, color: "#374151", fontSize: 13 }}>
          <li>🎯 Select your target level. If your profile level is set, we’ll keep it locked for the right difficulty.</li>
          <li>🎤 Hit the big recorder wand to start/stop. Add a short note so Whisper knows the topic.</li>
          <li>⚡ After you stop, click “Send to Whisper” to receive transcript and feedback instantly.</li>
        </ul>
      </div>

      <div style={styles.card}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", marginBottom: 12 }}>
          <div style={styles.field}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label style={styles.label} htmlFor="speech-level">
                Target level
              </label>
              {isLevelLocked && <span style={styles.badge}>From profile</span>}
            </div>
            <select
              id="speech-level"
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
          <div style={{ ...styles.field, flex: 1 }}>
            <label style={styles.label} htmlFor="speech-note">
              Optional note for Whisper
            </label>
            <textarea
              id="speech-note"
              style={{ ...styles.input, minHeight: 70, resize: "vertical" }}
              placeholder="Mention the exam part or key words so the AI knows what to listen for."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={loading || isRecording}
            />
          </div>
        </div>

        <div
          style={{
            border: "2px dashed #c7d2fe",
            borderRadius: 16,
            padding: 16,
            background: "linear-gradient(135deg, #eef2ff 0%, #e0f2fe 100%)",
            display: "grid",
            gap: 12,
            justifyItems: "center",
          }}
        >
          <p style={{ ...styles.helperText, margin: 0 }}>
            {isRecording
              ? "Recording... tap the wand to stop."
              : "Tap the wand to start speaking. Keep it clear and under a minute."}
          </p>
          <button
            type="button"
            onClick={handleToggleRecording}
            disabled={loading}
            style={{
              width: 180,
              height: 180,
              borderRadius: "50%",
              border: "none",
              background: isRecording ? "#ea580c" : "#4f46e5",
              color: "white",
              fontSize: 18,
              fontWeight: 700,
              boxShadow: isRecording
                ? "0 10px 30px rgba(234,88,12,0.35)"
                : "0 10px 30px rgba(79,70,229,0.35)",
              cursor: "pointer",
              transition: "transform 120ms ease, box-shadow 120ms ease",
              display: "grid",
              placeItems: "center",
              gap: 4,
            }}
          >
            <span style={{ fontSize: 32 }}>{isRecording ? "⬤" : "✨"}</span>
            <span>{isRecording ? "Stop wand" : "Record wand"}</span>
          </button>
          {audioUrl ? (
            <audio controls src={audioUrl} style={{ width: "100%" }}>
              Your browser does not support the audio element.
            </audio>
          ) : (
            <p style={{ ...styles.helperText, margin: 0 }}>No clip yet. Start recording to capture your practice.</p>
          )}
        </div>

        {error ? <div style={{ ...styles.errorBox, marginTop: 10 }}>{error}</div> : null}

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 12, flexWrap: "wrap" }}>
          <button type="button" style={styles.secondaryButton} onClick={resetSession} disabled={loading || isRecording}>
            Reset
          </button>
          <button type="button" style={styles.primaryButton} onClick={sendForFeedback} disabled={loading || isRecording}>
            {loading ? "Sending..." : "Send to Whisper"}
          </button>
        </div>
      </div>

      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <h3 style={{ ...styles.sectionTitle, margin: 0 }}>Instant feedback</h3>
        <div style={{ display: "grid", gap: 8 }}>
          <div>
            <p style={{ ...styles.label, margin: 0 }}>Transcript</p>
            <div style={{ ...styles.input, minHeight: 80, whiteSpace: "pre-wrap", background: "#f9fafb" }}>
              {transcript || "Your transcript from Whisper will appear here."}
            </div>
          </div>
          <div>
            <p style={{ ...styles.label, margin: 0 }}>Feedback</p>
            <div style={{ ...styles.input, minHeight: 120, whiteSpace: "pre-wrap", background: "#f9fafb" }}>
              {feedback || "Send a clip to receive pronunciation and clarity notes."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeechTrainerPage;
