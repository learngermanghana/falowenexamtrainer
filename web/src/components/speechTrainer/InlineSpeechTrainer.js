import React, { useEffect, useRef, useState } from "react";
import { styles } from "../../styles";
import { useAuth } from "../../context/AuthContext";
import { sendSpeechTrainerAttempt } from "../../services/speechTrainerService";

const InlineSpeechTrainer = ({ profileLevel }) => {
  const { idToken } = useAuth();
  const displayLevel = profileLevel || "A2";

  const [note, setNote] = useState("Hallo");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("Could not reach the coach right now. Please try again in a moment.");
  const [feedback, setFeedback] = useState(null);

  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startRecording = async () => {
    if (isRecording) return;

    setError("");
    setStatus("");
    setRecordingTime(0);
    setAudioBlob(null);
    setFeedback(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        stopTimer();
        setIsRecording(false);
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);

        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }

        const nextUrl = URL.createObjectURL(blob);
        setAudioUrl(nextUrl);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (recordError) {
      console.error("Microphone error", recordError);
      setError("Microphone not available. Please allow access and try again.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    stopTimer();
  };

  const resetAudio = () => {
    stopRecording();
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!audioBlob && !note.trim()) {
      setError("Add a quick note or a short recording before requesting feedback.");
      return;
    }

    try {
      setError("");
      setStatus("Sending to the coach…");

      const response = await sendSpeechTrainerAttempt({
        audioBlob,
        note: note.trim(),
        level: displayLevel,
        idToken,
      });

      setFeedback(response);
      setStatus("Feedback ready below.");
    } catch (submitError) {
      console.error(submitError);
      setError("Could not reach the coach right now. Please try again in a moment.");
      setStatus("");
    }
  };

  const recordingLabel = isRecording ? "Stop recording" : "Record answer";

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  const feedbackEntries = feedback
    ? [
        { label: "Transcript", value: feedback.transcript },
        { label: "Feedback", value: feedback.feedback || feedback.notes || feedback.summary },
        { label: "Next steps", value: feedback.nextSteps || feedback.actions },
      ]
    : [];

  const hasReadableFeedback = feedbackEntries.some((entry) => Boolean(entry.value));

  return (
    <div style={{ ...styles.card, display: "grid", gap: 12 }}>
      <h3 style={{ ...styles.sectionTitle, margin: 0 }}>Practice inside the app</h3>
      <p style={{ ...styles.helperText, margin: 0 }}>
        Type a short answer or record yourself here. When you submit, the coach will listen and send focused notes for
        your level ({displayLevel}).
      </p>

      <form style={{ display: "grid", gap: 12 }} onSubmit={handleSubmit}>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ ...styles.label, margin: 0 }}>Type your answer</span>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Type your answer"
            rows={4}
            style={{
              ...styles.input,
              resize: "vertical",
              minHeight: 96,
            }}
          />
        </label>

        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 12,
            display: "grid",
            gap: 8,
            background: "#f9fafb",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              style={{
                ...styles.primaryButton,
                background: isRecording ? "#dc2626" : styles.primaryButton.background,
              }}
            >
              {recordingLabel}
            </button>
            <span style={{ ...styles.helperText, margin: 0 }}>
              {isRecording ? "Recording…" : "Max 2 minutes is plenty."}
            </span>
            <span style={{ ...styles.badge, alignSelf: "center" }}>{formatTime(recordingTime)}</span>
            {audioUrl ? (
              <button type="button" onClick={resetAudio} style={{ ...styles.secondaryButton }}>
                Clear clip
              </button>
            ) : null}
          </div>

          {audioUrl ? (
            <div style={{ display: "grid", gap: 6 }}>
              <span style={{ ...styles.helperText, margin: 0 }}>Your latest recording</span>
              <audio controls src={audioUrl} style={{ width: "100%" }} />
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button type="submit" style={{ ...styles.primaryButton }}>
            Send for feedback
          </button>
          {status ? <span style={{ ...styles.helperText, margin: 0 }}>{status}</span> : null}
          {error ? (
            <span style={{ ...styles.helperText, margin: 0, color: "#b91c1c" }}>{error}</span>
          ) : null}
        </div>
      </form>

      {feedback ? (
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 12,
            background: "white",
            display: "grid",
            gap: 8,
          }}
        >
          <h4 style={{ ...styles.sectionTitle, margin: 0 }}>Coach response</h4>
          {hasReadableFeedback ? (
            <div style={{ display: "grid", gap: 8 }}>
              {feedbackEntries
                .filter((entry) => Boolean(entry.value))
                .map((entry) => (
                  <div key={entry.label} style={{ ...styles.resultCard, margin: 0 }}>
                    <p style={{ ...styles.label, margin: "0 0 4px 0" }}>{entry.label}</p>
                    <p style={{ ...styles.helperText, margin: 0 }}>{entry.value}</p>
                  </div>
                ))}
            </div>
          ) : (
            <pre
              style={{
                background: "#f9fafb",
                borderRadius: 8,
                padding: 12,
                margin: 0,
                fontSize: 12,
                overflow: "auto",
              }}
            >
              {JSON.stringify(feedback, null, 2)}
            </pre>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default InlineSpeechTrainer;
