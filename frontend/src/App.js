// src/App.js
import React, { useState, useRef } from "react";
import axios from "axios";

function App() {
  const [teil, setTeil] = useState("Teil 1 – Vorstellung");
  const [level, setLevel] = useState("A1");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const chunksRef = useRef([]);

  const backendUrl = "http://localhost:5000";

  const startRecording = async () => {
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

  const resetAudio = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setResult(null);
  };

  const sendForCorrection = async () => {
    if (!audioBlob) {
      alert("Please record your answer first.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("teil", teil);
      formData.append("level", level);

      const response = await axios.post(
        `${backendUrl}/api/speaking/analyze`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);
    } catch (err) {
      console.error("Falowen frontend error:", err);
      const msg =
        err?.response?.data?.error ||
        err.message ||
        "Falowen Exam Coach: Error sending audio for analysis.";
      alert("Falowen Exam Coach:\n" + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Falowen Exam Coach</h1>
        <p style={styles.subtitle}>
          Sprechen Trainer – Record your answer and get instant AI feedback.
        </p>
      </header>

      <main>
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>1. Choose Exam Settings</h2>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Teil</label>
              <select
                value={teil}
                onChange={(e) => setTeil(e.target.value)}
                style={styles.select}
              >
                <option>Teil 1 – Vorstellung</option>
                <option>Teil 2 – Fragen</option>
                <option>Teil 3 – Bitten / Planen</option>
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Niveau</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                style={styles.select}
              >
                <option>A1</option>
                <option>A2</option>
                <option>B1</option>
                <option>B2</option>
              </select>
            </div>
          </div>
        </section>

        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>2. Record Your Answer</h2>
          <p style={styles.helperText}>
            🎙️ Click <b>Start Recording</b>, speak your answer, then click{" "}
            <b>Stop</b>.
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
        </section>

        {result && (
          <section style={styles.resultCard}>
            <h2 style={styles.sectionTitle}>3. Feedback</h2>

            <h3 style={styles.resultHeading}>
              Transcript (What the AI heard)
            </h3>
            <p style={styles.resultText}>{result.transcript}</p>

            <h3 style={styles.resultHeading}>Corrected German Version</h3>
            <p style={styles.resultText}>{result.corrected_text}</p>

            <h3 style={styles.resultHeading}>
              Mistakes & Explanations (English)
            </h3>
            <pre style={styles.pre}>{result.mistakes}</pre>

            <h3 style={styles.resultHeading}>
              Pronunciation / Fluency (from transcript)
            </h3>
            <p style={styles.resultText}>{result.pronunciation}</p>

            <h3 style={styles.resultHeading}>Score</h3>
            <p style={styles.score}>
              ⭐ <b>{result.score} / 10</b>
            </p>
            <p style={styles.resultText}>{result.comment}</p>
          </section>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "24px 16px 40px",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    backgroundColor: "#f3f4f6",
    minHeight: "100vh",
  },
  header: {
    marginBottom: 24,
    textAlign: "center",
  },
  title: {
    fontSize: 28,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#4b5563",
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
  },
  resultCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
    border: "1px solid #d1d5db",
    backgroundColor: "#f9fafb",
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  row: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 8,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minWidth: 180,
    gap: 4,
  },
  label: {
    fontSize: 13,
    color: "#374151",
  },
  select: {
    padding: "6px 8px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 14,
  },
  primaryButton: {
    padding: "8px 16px",
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    background: "#2563eb",
    color: "#ffffff",
    fontSize: 14,
  },
  secondaryButton: {
    padding: "8px 16px",
    borderRadius: 999,
    border: "1px solid #d1d5db",
    cursor: "pointer",
    background: "#f9fafb",
    fontSize: 14,
  },
  dangerButton: {
    padding: "8px 16px",
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    background: "#dc2626",
    color: "#ffffff",
    fontSize: 14,
  },
  helperText: {
    fontSize: 13,
    color: "#4b5563",
    marginBottom: 8,
  },
  resultHeading: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  resultText: {
    fontSize: 14,
    color: "#111827",
  },
  pre: {
    background: "#111827",
    color: "#e5e7eb",
    padding: 12,
    borderRadius: 8,
    whiteSpace: "pre-wrap",
    fontSize: 13,
    margin: 0,
  },
  score: {
    fontSize: 16,
  },
};

export default App;
