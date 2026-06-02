import React, { useEffect, useMemo, useRef, useState } from "react";
import { styles } from "../../styles";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { requestSpeakingTextAnalysis } from "../../services/presentationCoachService";
import { analyzeAudio } from "../../services/coachService";
import { triggerInteractionFeedback } from "../../services/interactionFeedback";

const MIN_RECORDING_SECONDS = 3;
const audioCaptureConstraints = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  channelCount: 1,
};

const extractTag = (text, tag) => {
  const match = String(text || "").match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match?.[1]?.trim() || "";
};

const parseRubric = (text) => {
  const raw = extractTag(text, "rubric");
  if (!raw) return null;
  const parts = raw.split("|").map((item) => item.trim());
  const parseScore = (label) => {
    const hit = parts.find((item) => item.toLowerCase().startsWith(label.toLowerCase()));
    const score = Number((hit?.match(/(\d+)/) || [])[1] || 0);
    return Math.max(0, Math.min(5, score));
  };
  return {
    grammar: parseScore("grammar"),
    vocabulary: parseScore("vocabulary"),
    pronunciationReadiness: parseScore("pronunciation readiness"),
    structure: parseScore("structure"),
  };
};

const rubricToPercent = (rubric) => {
  if (!rubric) return null;
  const values = [rubric.grammar, rubric.vocabulary, rubric.pronunciationReadiness, rubric.structure];
  const total = values.reduce((sum, value) => sum + Number(value || 0), 0);
  return Math.round((total / 20) * 100);
};

const formatTime = (seconds = 0) => {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
};

const buildPromptHeader = ({ lesson, level, speakingTopic }) => [
  `Self-learning speaking level: ${level}`,
  `Lesson: Day ${lesson.day} - ${lesson.title}`,
  `Speaking topic: ${speakingTopic}`,
  "Please mark this response for B2/C1 self-learning. Give score guidance, corrections, vocabulary improvements and one stronger model answer.",
].join("\n");

export default function EmbeddedSpeechPracticePanel({ lesson, speakingTopic, onScoreChange }) {
  const { idToken, user } = useAuth();
  const { showToast } = useToast();
  const [draft, setDraft] = useState("");
  const [feedback, setFeedback] = useState("");
  const [transcript, setTranscript] = useState("");
  const [rubric, setRubric] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordingError, setRecordingError] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const recordingSecondsRef = useRef(0);

  useEffect(() => () => {
    if (recordingIntervalRef.current) window.clearInterval(recordingIntervalRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop());
  }, []);

  const percentScore = useMemo(() => rubricToPercent(rubric), [rubric]);

  useEffect(() => {
    if (percentScore !== null) onScoreChange?.(String(percentScore));
  }, [onScoreChange, percentScore]);

  const analyzeText = async () => {
    const trimmed = draft.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setError("");
    setFeedback("");
    setTranscript("");

    try {
      const response = await requestSpeakingTextAnalysis({
        text: `${buildPromptHeader({ lesson, level: lesson.level, speakingTopic })}\n\nStudent response:\n${trimmed}`,
        teil: "Self-learning speaking",
        level: lesson.level,
        question: speakingTopic || lesson.tasks?.speaking || lesson.topic,
        idToken,
      });
      const replyText = String(response?.feedback || "").trim() || "I could not analyze that answer. Please try again.";
      setRubric(parseRubric(replyText));
      setFeedback(replyText);
      triggerInteractionFeedback({
        sound: "success",
        toastMessage: "Speaking feedback ready.",
        toastVariant: "success",
        showToast,
        vibratePattern: [45],
      });
    } catch (err) {
      setError(err?.message || "Could not reach the speaking coach.");
      triggerInteractionFeedback({
        sound: "error",
        toastMessage: "Speaking coach is unavailable right now.",
        toastVariant: "error",
        showToast,
        vibratePattern: [120],
      });
    } finally {
      setLoading(false);
    }
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = async () => {
    if (isRecording || loading) return;
    setRecordingError("");
    setError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: audioCaptureConstraints });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      recorder.onstop = async () => {
        const elapsed = recordingSecondsRef.current;
        if (recordingIntervalRef.current) {
          window.clearInterval(recordingIntervalRef.current);
          recordingIntervalRef.current = null;
        }
        setIsRecording(false);
        setRecordingSeconds(0);
        recordingSecondsRef.current = 0;

        if (elapsed < MIN_RECORDING_SECONDS) {
          setRecordingError(`Please record for at least ${MIN_RECORDING_SECONDS} seconds.`);
          stopStream();
          return;
        }

        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setLoading(true);
        setFeedback("");
        setTranscript("");

        try {
          const response = await analyzeAudio({
            audioBlob: blob,
            teil: "Self-learning speaking",
            level: lesson.level,
            question: speakingTopic || lesson.tasks?.speaking || lesson.topic,
            userId: user?.uid || "",
            idToken,
          });
          const heard = String(response?.transcript || "").trim();
          const replyText = String(response?.feedback || "").trim() || "I could not analyze that recording. Please try again.";
          setTranscript(heard);
          setRubric(parseRubric(replyText));
          setFeedback(replyText);
          triggerInteractionFeedback({
            sound: "success",
            toastMessage: "Voice feedback ready.",
            toastVariant: "success",
            showToast,
            vibratePattern: [45],
          });
        } catch (err) {
          setError(err?.message || "Could not analyze your recording right now.");
          triggerInteractionFeedback({
            sound: "error",
            toastMessage: "Could not analyze your recording.",
            toastVariant: "error",
            showToast,
            vibratePattern: [120],
          });
        } finally {
          setLoading(false);
          stopStream();
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingSecondsRef.current = 0;
      recordingIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((value) => {
          const nextValue = value + 1;
          recordingSecondsRef.current = nextValue;
          return nextValue;
        });
      }, 1000);
    } catch (err) {
      setRecordingError(err?.message || "Microphone access was blocked.");
      stopStream();
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== "recording") return;
    mediaRecorderRef.current.stop();
  };

  return (
    <div style={{ border: "1px solid #c7d2fe", background: "#eef2ff", borderRadius: 16, padding: 14, display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <div>
          <strong>Speech AI practice</strong>
          <p style={{ margin: "4px 0 0", color: "#4b5563" }}>Practise here without leaving this lesson.</p>
        </div>
        {percentScore !== null ? <span style={{ ...styles.badge, background: "#dcfce7", color: "#166534" }}>Score: {percentScore}/100</span> : null}
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <label style={styles.label}>Your spoken answer transcript / typed answer</label>
        <textarea
          style={{ ...styles.input, minHeight: 110, resize: "vertical", background: "#fff" }}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Type your spoken answer here, or use the voice recorder below."
          disabled={loading}
        />
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" style={styles.primaryButton} onClick={analyzeText} disabled={loading || !draft.trim()}>
          {loading ? "Checking…" : "Check typed answer"}
        </button>
        <button type="button" style={styles.secondaryButton} onClick={isRecording ? stopRecording : startRecording} disabled={loading}>
          {isRecording ? `Stop & send (${formatTime(recordingSeconds)})` : "🎙️ Record voice"}
        </button>
      </div>

      {recordingError ? <p style={{ margin: 0, color: "#b91c1c" }}>{recordingError}</p> : null}
      {error ? <p style={{ margin: 0, color: "#b91c1c" }}>{error}</p> : null}
      {transcript ? (
        <div style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 12, padding: 12 }}>
          <strong>Transcript AI heard</strong>
          <p style={{ margin: "6px 0 0", whiteSpace: "pre-wrap" }}>{transcript}</p>
        </div>
      ) : null}
      {feedback ? (
        <div style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 12, padding: 12 }}>
          <strong>AI feedback</strong>
          <p style={{ margin: "6px 0 0", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{feedback}</p>
        </div>
      ) : null}
    </div>
  );
}
