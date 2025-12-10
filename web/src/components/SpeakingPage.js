import React, { useEffect, useRef, useState } from "react";
import { styles } from "../styles";
import { useExam, ALLOWED_LEVELS, ALLOWED_TEILE } from "../context/ExamContext";
import SettingsForm from "./SettingsForm";
import Feedback from "./Feedback";
import { analyzeAudio, fetchSpeakingQuestions } from "../services/coachService";

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
  const [recordingTime, setRecordingTime] = useState(0);
  const [waveform, setWaveform] = useState([]);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionError, setQuestionError] = useState("");
  const [questionsLoading, setQuestionsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadQuestions = async () => {
      setQuestionsLoading(true);
      setQuestionError("");
      setCurrentQuestionIndex(0);

      try {
        const fetched = await fetchSpeakingQuestions(level, teil);
        if (!isMounted) return;

        setQuestions(fetched);

        if (fetched.length === 0) {
          setQuestionError(
            "Keine passenden Prüfungsfragen für diese Auswahl gefunden."
          );
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Falowen frontend error while loading questions:", err);
        const msg =
          err?.response?.data?.error ||
          err.message ||
          "Fragen konnten nicht geladen werden.";
        setQuestionError(msg);
      } finally {
        if (isMounted) {
          setQuestionsLoading(false);
        }
      }
    };

    loadQuestions();

    return () => {
      isMounted = false;
    };
  }, [level, teil]);

  const resetAudio = () => {
    setError("");
    setAudioBlob(null);
    setAudioUrl(null);
    setResult(null);
    setRecordingTime(0);
    setWaveform([]);
  };

  const currentQuestion = questions[currentQuestionIndex] || null;

  const showNextQuestion = () => {
    if (questions.length === 0) return;
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
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

      streamRef.current = stream;

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

      const drawWaveform = () => {
        if (!analyserRef.current || !dataArrayRef.current) return;

        analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

        const chunkSize = Math.max(
          1,
          Math.floor(dataArrayRef.current.length / 24)
        );

        const bars = [];
        for (let i = 0; i < dataArrayRef.current.length; i += chunkSize) {
          const slice = dataArrayRef.current.slice(i, i + chunkSize);
          const avg =
            slice.reduce((sum, val) => sum + Math.abs(val - 128), 0) /
            (slice.length * 128);
          bars.push(Math.min(avg, 1));
        }

        setWaveform(bars);
        animationFrameRef.current = requestAnimationFrame(drawWaveform);
      };

      drawWaveform();

      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

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

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    dataArrayRef.current = null;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mediaRecorder]);

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
        <h2 style={styles.sectionTitle}>2. Practice question for your level</h2>
        {questionsLoading ? (
          <p style={styles.helperText}>Lade Fragen...</p>
        ) : currentQuestion ? (
          <>
            <p style={styles.helperText}>
              <strong>{currentQuestion.teil}</strong> · {currentQuestion.level}
            </p>
            <p style={styles.helperText}>{currentQuestion.topic}</p>
            {currentQuestion.keyword && (
              <p style={styles.helperText}>
                Stichworte: <em>{currentQuestion.keyword}</em>
              </p>
            )}
            <div style={{ marginTop: 12 }}>
              <button
                style={styles.secondaryButton}
                onClick={showNextQuestion}
                disabled={questions.length < 2}
              >
                {questions.length < 2 ? "Nur eine Frage verfügbar" : "Nächste Frage"}
              </button>
            </div>
          </>
        ) : (
          <p style={styles.helperText}>
            Noch keine Frage gefunden. Bitte wähle ein anderes Niveau oder versuche es
            erneut.
          </p>
        )}

        {questionError && (
          <div style={{ ...styles.errorBox, marginTop: 12 }}>
            <strong>Hinweis:</strong> {questionError}
          </div>
        )}
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>3. Record Your Answer</h2>
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

        <div
          style={{
            marginTop: 12,
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ ...styles.helperText, margin: 0 }}>
            ⏱️ Aufnahmezeit: {Math.floor(recordingTime / 60)
              .toString()
              .padStart(2, "0")}
            :{(recordingTime % 60).toString().padStart(2, "0")}
          </div>

          {waveform.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 4,
                height: 48,
                flexGrow: 1,
              }}
            >
              {waveform.map((value, idx) => (
                <div
                  key={idx}
                  style={{
                    width: 6,
                    borderRadius: 4,
                    background: "linear-gradient(180deg, #4ade80, #16a34a)",
                    height: `${Math.max(8, value * 48)}px`,
                    transition: "height 80ms ease-out",
                  }}
                />
              ))}
            </div>
          )}
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
