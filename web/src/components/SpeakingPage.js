import React, { useEffect, useMemo, useRef, useState } from "react";
import { styles } from "../styles";
import { getTasksForLevel, useExam } from "../context/ExamContext";
import { useAuth } from "../context/AuthContext";
import {
  evaluateGoetheAudio,
  getGoetheLevels,
  getGoethePartnerScript,
  getGoetheQuestions,
} from "../services/goetheRecorderService";

const COMMON_MISTAKES = [
  {
    title: "Missing the task points",
    example: "You talk about the topic but forget one required point.",
    fix: "Repeat the task bullets aloud before you start speaking.",
  },
  {
    title: "Sentence structure slips",
    example: "Word order drifts in questions or subordinate clauses.",
    fix: "Use short main clauses and add one connector at a time.",
  },
  {
    title: "No clear conclusion",
    example: "You end abruptly without a decision or summary.",
    fix: "Finish with “Also, wir entscheiden uns für …” or a summary.",
  },
];

const RECORDING_MIME_CANDIDATES = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus"];
const TARGET_AUDIO_BITRATE = 48_000;

const formatBytes = (bytes = 0) => {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const pickRecordingMimeType = () => {
  if (typeof MediaRecorder === "undefined" || typeof MediaRecorder.isTypeSupported !== "function") {
    return "";
  }

  return RECORDING_MIME_CANDIDATES.find((type) => MediaRecorder.isTypeSupported(type)) || "";
};

const ChecklistItem = ({ icon, children }) => (
  <li
    style={{
      display: "flex",
      gap: 10,
      alignItems: "flex-start",
      padding: "10px 12px",
      border: "1px solid #E5E7EB",
      borderRadius: 12,
      background: "#FFFFFF",
    }}
  >
    <span
      aria-hidden="true"
      style={{
        width: 28,
        height: 28,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        border: "1px solid #E5E7EB",
        background: "#F9FAFB",
        flex: "0 0 auto",
        fontSize: 16,
        lineHeight: 1,
      }}
    >
      {icon}
    </span>

    <div style={{ lineHeight: 1.55, color: "#111827", fontSize: 15 }}>{children}</div>
  </li>
);

const SpeakingPage = () => {
  const { level: examLevel } = useExam();
  const { idToken } = useAuth();
  const tasks = useMemo(() => getTasksForLevel(examLevel), [examLevel]);

  const [levels, setLevels] = useState([]);
  const [level, setLevel] = useState(examLevel || "");
  const [questions, setQuestions] = useState([]);
  const [questionId, setQuestionId] = useState("");
  const [partnerLines, setPartnerLines] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [audioMeta, setAudioMeta] = useState({ sizeLabel: "", mimeType: "" });

  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const recordedChunksRef = useRef([]);

  useEffect(() => {
    let active = true;

    getGoetheLevels()
      .then((items) => {
        if (!active) return;
        const nextLevels = Array.isArray(items) ? items : [];
        setLevels(nextLevels);
        setLevel((currentLevel) => {
          if (examLevel && nextLevels.includes(examLevel)) return examLevel;
          if (!currentLevel && nextLevels.length) return nextLevels[0];
          return currentLevel;
        });
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.response?.data?.error || err.message || "Failed to load levels.");
      });

    return () => {
      active = false;
    };
  }, [examLevel]);

  useEffect(() => {
    if (!audioUrl) return undefined;
    return () => {
      URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  useEffect(
    () => () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    },
    []
  );

  useEffect(() => {
    if (!level) {
      setQuestions([]);
      setQuestionId("");
      return;
    }

    getGoetheQuestions({ level })
      .then((items) => {
        const next = Array.isArray(items) ? items : [];
        setQuestions(next);
        setQuestionId(next[0]?.id || "");
      })
      .catch((err) => {
        setQuestions([]);
        setQuestionId("");
        setError(err?.response?.data?.error || err.message || "Failed to load questions.");
      });
  }, [level]);

  const startRecording = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          noiseSuppression: true,
          echoCancellation: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;
      const mimeType = pickRecordingMimeType();
      const recorderOptions = {
        audioBitsPerSecond: TARGET_AUDIO_BITRATE,
      };
      if (mimeType) recorderOptions.mimeType = mimeType;
      const recorder = new MediaRecorder(stream, recorderOptions);
      recordedChunksRef.current = [];
      setAudioMeta({ sizeLabel: "", mimeType: recorder.mimeType || mimeType || "audio/webm" });

      recorder.ondataavailable = (event) => {
        if (event.data?.size > 0) recordedChunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const blobType = recorder.mimeType || mimeType || "audio/webm";
        const blob = new Blob(recordedChunksRef.current, { type: blobType });
        setAudioBlob(blob);
        setAudioMeta({ sizeLabel: formatBytes(blob.size), mimeType: blobType });
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start(1000);
      setIsRecording(true);
    } catch (_err) {
      setError("Microphone permission denied or unavailable.");
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") return;
    recorder.stop();
    setIsRecording(false);
  };

  const handleGeneratePartnerLines = async () => {
    if (!level || !questionId) return;
    setBusy(true);
    setError("");
    try {
      const response = await getGoethePartnerScript({ level, questionId, idToken });
      setPartnerLines(response?.lines || []);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Failed to generate partner lines.");
    } finally {
      setBusy(false);
    }
  };

  const handleEvaluate = async () => {
    if (!audioBlob) {
      setError("Please record audio first.");
      return;
    }

    setBusy(true);
    setError("");
    setResult(null);

    try {
      const response = await evaluateGoetheAudio({
        audioBlob,
        level,
        questionId,
        idToken,
      });
      setResult(response);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Failed to evaluate audio.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ marginBottom: 12 }}>
          <h1 style={{ ...styles.title, marginBottom: 8 }}>Speaking Exams – Level {examLevel}</h1>
          <p style={styles.subtitle}>Practice inside the exam room and get instant AI feedback.</p>
        </div>

        <div style={{ ...styles.card, margin: 0, boxShadow: "none", border: "1px solid #BFDBFE", background: "#EFF6FF" }}>
          <h3 style={{ marginTop: 0 }}>Goethe Recorder</h3>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Level</label>
              <select style={styles.select} value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="">Select level</option>
                {levels.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Task prompt</label>
              <select style={styles.select} value={questionId} onChange={(e) => setQuestionId(e.target.value)}>
                <option value="">Select task</option>
                {questions.map((question) => (
                  <option key={question.id} value={question.id}>
                    {question.part}: {question.prompt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
            {!isRecording ? (
              <button style={styles.primaryButton} onClick={startRecording} disabled={busy}>
                Start recording
              </button>
            ) : (
              <button style={styles.dangerButton} onClick={stopRecording}>
                Stop recording
              </button>
            )}
            <button style={styles.secondaryButton} onClick={handleGeneratePartnerLines} disabled={busy || !questionId}>
              Generate partner lines
            </button>
            <button style={styles.primaryButton} onClick={handleEvaluate} disabled={busy || !audioBlob || !questionId}>
              {busy ? "Scoring..." : "Evaluate audio"}
            </button>
          </div>

          {audioUrl ? (
            <div style={{ marginTop: 12, display: "grid", gap: 6 }}>
              <audio controls src={audioUrl} style={{ width: "100%" }} />
              <p style={{ ...styles.helperText, margin: 0 }}>
                Compressed recording: {audioMeta.sizeLabel || "pending"} ({audioMeta.mimeType || "audio/webm"}, 48 kbps target)
              </p>
            </div>
          ) : null}

          {partnerLines.length ? (
            <div style={{ marginTop: 12 }}>
              <h4 style={{ margin: "0 0 6px 0" }}>AI Partner lines</h4>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {partnerLines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {error ? (
            <p role="alert" style={{ color: "#b91c1c", marginTop: 12, marginBottom: 0 }}>
              {error}
            </p>
          ) : null}

          {result ? (
            <div style={{ marginTop: 12, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
              <p style={{ margin: 0 }}>
                Total: <strong>{result.total}</strong> / 20
              </p>
              <p style={{ ...styles.resultText, marginTop: 8 }}>
                Pronunciation: {result?.scores?.pronunciation} | Grammar: {result?.scores?.grammar} | Content: {result?.scores?.content} | Fluency: {result?.scores?.fluency}
              </p>
              <h4 style={styles.resultHeading}>Transcript</h4>
              <p style={styles.resultText}>{result.transcript || "-"}</p>
              <h4 style={styles.resultHeading}>Improved answer (German)</h4>
              <p style={styles.resultText}>{result.improved_answer || "-"}</p>
              <h4 style={styles.resultHeading}>Feedback (English)</h4>
              <p style={styles.resultText}>{result.feedback_text || "-"}</p>
            </div>
          ) : null}
        </div>

        <div style={{ display: "grid", gap: 14, marginTop: 14 }}>
          <div style={{ ...styles.card, margin: 0, boxShadow: "none" }}>
            <h3 style={{ ...styles.sectionTitle, margin: "0 0 8px 0" }}>Scoring rubric focus</h3>
            <div style={{ display: "grid", gap: 10 }}>
              {tasks.map((task) => (
                <div key={task.id} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
                  <div style={{ fontWeight: 700 }}>{task.label}</div>
                  <p style={{ ...styles.helperText, margin: "6px 0" }}>{task.instructions}</p>
                  <p style={{ ...styles.helperText, margin: 0 }}>
                    <strong>Scoring focus:</strong> {task.scoringHints}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: 12, borderRadius: 14, border: "1px solid #E5E7EB", background: "#F9FAFB" }}>
            <div style={{ fontSize: 14, color: "#111827", marginBottom: 8 }}>
              <strong>Common mistakes to avoid</strong>
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
              {COMMON_MISTAKES.map((item) => (
                <ChecklistItem key={item.title} icon="⚠️">
                  <strong>{item.title}:</strong> {item.example} <em>Fix:</em> {item.fix}
                </ChecklistItem>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakingPage;
