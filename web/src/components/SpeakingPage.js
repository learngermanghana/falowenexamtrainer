import React, { useRef, useState } from "react";
import { styles } from "../styles";
import { useExam, ALLOWED_LEVELS, ALLOWED_TEILE } from "../context/ExamContext";
import SettingsForm from "./SettingsForm";
import Feedback from "./Feedback";
import { analyzeAudio } from "../services/coachService";

const SpeakingPage = () => {
  const {
    teil,
    level,
    result,
    setResult,
    error,
    setError,
    loading,
    setLoading,
  } = useExam();

  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const chunksRef = useRef([]);

  const resetAudio = () => {
    setError("");
    setAudioBlob(null);
    setAudioUrl(null);
    setResult(null);
  };

  const validateSelections = () => {
    if (!ALLOWED_TEILE.includes(teil)) {
      setError("Bitte wähle einen gültigen Teil aus der Liste.");
      return false;
    }

    if (!ALLOWED_LEVELS.includes(level)) {
      setError("Bitte wähle ein gültiges Niveau (A1–B2).");
      return false;
    }

    setError("");
    return true;
  };

  const startRecording = async () => {
    setError("");
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      alert(
        "Falowen Exam Coach: Microphone access failed. Please allow mic access in your browser."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const sendForCorrection = async () => {
    if (!audioBlob) {
      alert("Please record your answer first.");
      return;
    }

    if (!validateSelections()) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await analyzeAudio(audioBlob, teil, level);
      setResult(data);
    } catch (err) {
      console.error("Falowen frontend error:", err);
      const msg =
        err?.response?.data?.error ||
        err.message ||
        "Falowen Exam Coach: Error sending audio for analysis.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SettingsForm title="1. Choose Exam Settings" />

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>2. Record Your Answer</h2>
        <p style={styles.helperText}>
          🎙️ Click <b>Start Recording</b>, speak your answer, then click <b>Stop</b>.
        </p>

        <div style={styles.row}>
          {!isRecording ? (
            <button style={styles.primaryButton} onClick={startRecording}>
              Start Recording
            </button>
          ) : (
            <button style={styles.dangerButton} onClick={stopRecording}>
              Stop Recording
            </button>
          )}

          <button
            style={styles.secondaryButton}
            onClick={resetAudio}
            disabled={!audioBlob}
          >
            Clear Recording
          </button>
        </div>

        {audioUrl && (
          <div style={{ marginTop: 16 }}>
            <p style={styles.helperText}>▶️ Preview your recording:</p>
            <audio controls src={audioUrl} style={{ width: "100%" }} />
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <button
            style={styles.primaryButton}
            onClick={sendForCorrection}
            disabled={!audioBlob || loading}
          >
            {loading ? "Analyzing..." : "Send to Falowen for Feedback"}
          </button>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <strong>Hinweis:</strong> {error}
          </div>
        )}
      </section>

      <Feedback result={result} />
    </>
  );
};

export default SpeakingPage;
