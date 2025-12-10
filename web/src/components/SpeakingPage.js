import React, { useEffect, useRef, useState } from "react";
import { styles } from "../styles";
import { useExam, ALLOWED_LEVELS, ALLOWED_TEILE } from "../context/ExamContext";
import SettingsForm from "./SettingsForm";
import Feedback from "./Feedback";
import ResultHistory from "./ResultHistory";
import { analyzeAudio, fetchSpeakingQuestions } from "../services/coachService";

const SIMULATION_STEPS = [
  {
    teil: "Teil 1 – Vorstellung",
    thinkSeconds: 30,
    speakSeconds: 90,
    instructions:
      "Begrüße die Prüfer:innen, nenne deinen Namen, Herkunft und zwei kurze Fakten über dich (z. B. Beruf, Hobbys).",
  },
  {
    teil: "Teil 2 – Fragen",
    thinkSeconds: 30,
    speakSeconds: 90,
    instructions:
      "Reagiere auf 2–3 Alltagsfragen. Sprich ganze Sätze, gib kurze Begründungen und stelle selbst eine Rückfrage.",
  },
  {
    teil: "Teil 3 – Bitten / Planen",
    thinkSeconds: 45,
    speakSeconds: 120,
    instructions:
      "Plane etwas mit einer anderen Person. Mache mindestens drei höfliche Bitten oder Vorschläge und reagiere flexibel, falls etwas nicht passt.",
  },
];

const SpeakingPage = () => {
  const {
    teil,
    setTeil,
    level,
    result,
    setResult,
    resultHistory,
    addResultToHistory,
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
  const [simulationMode, setSimulationMode] = useState(false);
  const [simulationPhase, setSimulationPhase] = useState("idle");
  const [simulationStepIndex, setSimulationStepIndex] = useState(0);
  const [simulationCountdown, setSimulationCountdown] = useState(null);
  const [simulationScores, setSimulationScores] = useState([]);
  const [simulationSummary, setSimulationSummary] = useState(null);
  const [hasStartedSpeaking, setHasStartedSpeaking] = useState(false);
  const [inputMode, setInputMode] = useState("record");
  const countdownRef = useRef(null);
  const stepAdvanceGuardRef = useRef(false);

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
      if (simulationMode && simulationPhase === "speaking") {
        setHasStartedSpeaking(true);
      }
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

  useEffect(() => {
    if (!simulationMode || simulationCountdown === null) return undefined;

    if (simulationCountdown <= 0) {
      handleCountdownComplete();
      return undefined;
    }

    countdownRef.current = setTimeout(() => {
      setSimulationCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => {
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, [simulationCountdown, simulationMode, simulationPhase]);

  useEffect(() => {
    if (!simulationMode || simulationPhase !== "speaking") return;
    if (!isRecording && hasStartedSpeaking) {
      finishCurrentTeil("recording");
    }
  }, [hasStartedSpeaking, isRecording, simulationMode, simulationPhase]);

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
      const feedback = data.feedback || data;
      const enrichedResult = {
        ...feedback,
        transcript: data.transcript,
        teil,
        level,
        mode: "Speaking",
      };
      setResult(enrichedResult);
      addResultToHistory(enrichedResult);
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

  const formatCountdown = (seconds) => {
    if (seconds === null || seconds < 0) return "--:--";
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const buildSummaryText = (score) => {
    const levelHint =
      score >= 85
        ? `Du klingst wie ein starkes ${level}, teilweise schon Richtung ${level === "B2" ? "C1" : "B2"}.`
        : score >= 70
        ? `Du bist ein solides ${level} und wirkst oft flüssig. Mit etwas Feinschliff wird der nächste Schritt erreichbar.`
        : `Du deckst die Basics auf ${level}-Niveau ab, wirkst aber noch zögerlich.`;

    const grammarHint =
      score >= 85
        ? "Feinschliff: präzise Zeitformen und klarere Artikel helfen dir, noch natürlicher zu klingen."
        : score >= 70
        ? "Achte auf Vergangenheitsformen und Übergänge, damit deine Sätze sauber verbunden sind."
        : "Trainiere feste Redemittel und sichere Grammatik in Präsens und Perfekt, bevor du schneller sprichst.";

    return `${levelHint} ${grammarHint}`;
  };

  const startSpeakingPhase = (step) => {
    setSimulationPhase("speaking");
    setSimulationCountdown(step.speakSeconds);
    stepAdvanceGuardRef.current = false;
    setHasStartedSpeaking(false);
    resetAudio();
  };

  const handleCountdownComplete = () => {
    const currentStep = SIMULATION_STEPS[simulationStepIndex];
    if (!currentStep) return;

    if (simulationPhase === "thinking") {
      startSpeakingPhase(currentStep);
      return;
    }

    if (simulationPhase === "speaking") {
      if (isRecording) {
        stopRecording();
      }
      finishCurrentTeil("timer");
    }
  };

  const finalizeSummary = (scores) => {
    const total = scores.reduce((sum, item) => sum + item.score, 0);
    const maxScore = SIMULATION_STEPS.length * 25;
    const overall = Math.round((total / maxScore) * 100);

    setSimulationSummary({
      overall,
      details: scores,
      text: buildSummaryText(overall),
    });
  };

  const finishCurrentTeil = (reason) => {
    if (!simulationMode || simulationPhase !== "speaking") return;
    if (stepAdvanceGuardRef.current) return;
    stepAdvanceGuardRef.current = true;

    const currentStep = SIMULATION_STEPS[simulationStepIndex];
    if (!currentStep) return;

    const baseScores = { A1: 72, A2: 78, B1: 84, B2: 90 };
    const normalizedBase = baseScores[level] ?? 75;
    const scaledTeilScore = Math.min(
      25,
      Math.max(12, Math.round((normalizedBase / 100) * 25 + simulationStepIndex))
    );

    setSimulationScores((prev) => {
      const updated = [...prev, { teil: currentStep.teil, score: scaledTeilScore, reason }];

      if (simulationStepIndex >= SIMULATION_STEPS.length - 1) {
        finalizeSummary(updated);
        setSimulationMode(false);
        setSimulationPhase("summary");
        setSimulationCountdown(null);
      } else {
        const nextIndex = simulationStepIndex + 1;
        const nextStep = SIMULATION_STEPS[nextIndex];
        setSimulationStepIndex(nextIndex);
        setTeil(nextStep.teil);
        setSimulationPhase("thinking");
        setSimulationCountdown(nextStep.thinkSeconds);
        setHasStartedSpeaking(false);
      }

      return updated;
    });

    resetAudio();
  };

  const handleInputModeChange = (mode) => {
    if (mode === inputMode) return;
    if (isRecording) {
      stopRecording();
    }
    setInputMode(mode);
    resetAudio();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAudioBlob(file);
    setAudioUrl(URL.createObjectURL(file));
    setError("");
  };

  const startSimulation = () => {
    setSimulationSummary(null);
    setSimulationScores([]);
    setSimulationStepIndex(0);
    setSimulationMode(true);
    setSimulationPhase("thinking");
    setSimulationCountdown(SIMULATION_STEPS[0].thinkSeconds);
    setTeil(SIMULATION_STEPS[0].teil);
    setHasStartedSpeaking(false);
    stepAdvanceGuardRef.current = false;
    resetAudio();
  };

  const stopSimulation = () => {
    setSimulationMode(false);
    setSimulationPhase("idle");
    setSimulationCountdown(null);
    setSimulationSummary(null);
    setSimulationScores([]);
    setHasStartedSpeaking(false);
    stepAdvanceGuardRef.current = false;
    if (countdownRef.current) {
      clearTimeout(countdownRef.current);
      countdownRef.current = null;
    }
  };

  const currentSimulationStep = SIMULATION_STEPS[simulationStepIndex] || null;

  return (
    <>
      <SettingsForm title="1. Choose Exam Settings" />

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>2. Guided exam simulation</h2>
        <p style={styles.helperText}>
          Wähle dein Niveau und starte die geführte Simulation. Du bekommst pro Teil
          eine Vorbereitungszeit und eine feste Sprechzeit. Danach geht es
          automatisch weiter.
        </p>

        <div style={styles.row}>
          <button
            style={styles.primaryButton}
            onClick={startSimulation}
            disabled={simulationMode || questionsLoading}
          >
            {simulationMode ? "Simulation läuft" : "Simulate real exam"}
          </button>

          <button
            style={styles.secondaryButton}
            onClick={stopSimulation}
            disabled={!simulationMode && simulationPhase !== "summary"}
          >
            {simulationPhase === "summary" ? "Reset simulation" : "Cancel"}
          </button>
        </div>

        {simulationMode && currentSimulationStep && (
          <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
            <div style={{ ...styles.helperText, margin: 0 }}>
              <strong>Aktueller Abschnitt:</strong> {currentSimulationStep.teil} · Niveau {level}
            </div>
            <div style={{ ...styles.helperText, margin: 0 }}>
              <strong>Phase:</strong> {simulationPhase === "thinking" ? "Vorbereitungszeit" : "Sprechzeit"}
              {simulationCountdown !== null &&
                ` – Countdown: ${formatCountdown(simulationCountdown)}`}
            </div>
            <div style={styles.helperText}>{currentSimulationStep.instructions}</div>
            {simulationPhase === "speaking" && (
              <div style={{ ...styles.errorBox, background: "#ecfeff", borderColor: "#22d3ee", color: "#0f172a" }}>
                Wenn du fertig bist, klicke auf <b>Stop Recording</b>. Der nächste Teil
                startet automatisch, sobald die Zeit endet oder deine Aufnahme stoppt.
              </div>
            )}
          </div>
        )}

        {simulationSummary && (
          <div style={{ ...styles.resultCard, marginTop: 16 }}>
            <h3 style={styles.resultHeading}>Simulation summary</h3>
            <p style={{ ...styles.resultText, fontWeight: 700, fontSize: 16 }}>
              Overall score: {simulationSummary.overall}/100
            </p>
            <ul style={{ ...styles.promptList, marginTop: 8 }}>
              {simulationSummary.details.map((item) => (
                <li key={item.teil}>
                  {item.teil}: {item.score}/25
                </li>
              ))}
            </ul>
            <p style={{ ...styles.helperText, marginTop: 8 }}>{simulationSummary.text}</p>
          </div>
        )}
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>3. Practice question for your level</h2>
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
        <h2 style={styles.sectionTitle}>4. Capture Your Answer</h2>
        <div style={styles.segmentedControl}>
          <button
            style={inputMode === "record" ? styles.segmentedActive : styles.segmentedButton}
            onClick={() => handleInputModeChange("record")}
          >
            Record now
          </button>
          <button
            style={inputMode === "upload" ? styles.segmentedActive : styles.segmentedButton}
            onClick={() => handleInputModeChange("upload")}
          >
            Upload audio
          </button>
        </div>

        {inputMode === "record" ? (
          <div style={styles.recordCard}>
            <div style={styles.recordStatus}>{
              isRecording ? "Recording… Tap to stop" : "Tap once to start your answer"
            }</div>
            <button
              style={isRecording ? styles.recordButtonActive : styles.recordButton}
              onClick={isRecording ? stopRecording : startRecording}
              aria-label={isRecording ? "Stop recording" : "Start recording"}
            >
              {isRecording ? "Stop" : "Record"}
            </button>

            <div style={styles.recordMetaRow}>
              <span style={styles.recordTimer}>
                ⏱️ {Math.floor(recordingTime / 60)
                  .toString()
                  .padStart(2, "0")}
                :{(recordingTime % 60).toString().padStart(2, "0")}
              </span>
              {waveform.length > 0 && (
                <div style={styles.waveform}>
                  {waveform.map((value, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: 6,
                        borderRadius: 4,
                        background: "linear-gradient(180deg, #22c55e, #16a34a)",
                        height: `${Math.max(10, value * 52)}px`,
                        transition: "height 80ms ease-out",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={styles.uploadCard}>
            <p style={{ ...styles.helperText, marginBottom: 6 }}>
              Choose a clear audio file (webm, m4a, mp3, wav) from your phone.
            </p>
            <label style={styles.uploadLabel}>
              <input
                type="file"
                accept="audio/*"
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
              <span>{audioBlob ? "Replace file" : "Upload from device"}</span>
            </label>
            {audioBlob && (
              <p style={{ ...styles.helperText, marginTop: 8 }}>
                Selected: {audioBlob.name || "Audio clip"}
              </p>
            )}
          </div>
        )}

        {audioUrl && (
          <div style={{ marginTop: 12 }}>
            <p style={{ ...styles.helperText, marginBottom: 6 }}>Preview</p>
            <audio controls src={audioUrl} style={{ width: "100%" }} />
          </div>
        )}

        <div style={styles.row}>
          <button
            style={styles.primaryButton}
            onClick={sendForCorrection}
            disabled={!audioBlob || loading}
          >
            {loading ? "Analyzing..." : "Send to Falowen for Feedback"}
          </button>

          <button
            style={styles.secondaryButton}
            onClick={resetAudio}
            disabled={!audioBlob}
          >
            Clear audio
          </button>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <strong>Hinweis:</strong> {error}
          </div>
        )}
      </section>

      <Feedback result={result} />
      <ResultHistory results={resultHistory} />
    </>
  );
};

export default SpeakingPage;
