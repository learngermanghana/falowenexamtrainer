import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { styles } from "../styles";
import {
  useExam,
  ALLOWED_LEVELS,
  getTasksForLevel,
} from "../context/ExamContext";
import SettingsForm from "./SettingsForm";
import Feedback from "./Feedback";
import ResultHistory from "./ResultHistory";
import { useAuth } from "../context/AuthContext";
import {
  analyzeAudio,
  fetchSpeakingQuestions,
  scoreInteractionAudio,
} from "../services/coachService";

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

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
  const { user, idToken } = useAuth();
  const userId = user?.uid;

  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [waveform, setWaveform] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionError, setQuestionError] = useState("");
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);
  const [simulationMode, setSimulationMode] = useState(false);
  const [currentSimulationStepIndex, setCurrentSimulationStepIndex] =
    useState(0);
  const [simulationCountdown, setSimulationCountdown] = useState(null);
  const [simulationScores, setSimulationScores] = useState([]);
  const [simulationSummary, setSimulationSummary] = useState(null);
  const [hasStartedSpeaking, setHasStartedSpeaking] = useState(false);
  const [inputMode, setInputMode] = useState("record");
  const [interactionMode, setInteractionMode] = useState(false);
  const [interactionSession, setInteractionSession] = useState(null);
  const [interactionResult, setInteractionResult] = useState(null);
  const [selectedFollowUpIndex, setSelectedFollowUpIndex] = useState(0);
  const hasManuallyToggledInteraction = useRef(false);
  const countdownRef = useRef(null);
  const stepAdvanceGuardRef = useRef(false);

  const getActiveIdToken = useCallback(async () => {
    if (idToken) return idToken;
    if (user?.getIdToken) {
      try {
        return await user.getIdToken();
      } catch (tokenError) {
        console.warn("Could not refresh ID token for speaking coach", tokenError);
      }
    }
    return null;
  }, [idToken, user]);

  const teilOptions = useMemo(() => getTasksForLevel(level), [level]);

  const simulationSteps = useMemo(() => {
    if (!teilOptions.length) return [];

    return teilOptions.map((task) => ({
      teil: task.label,
      instructions:
        task.instructions ||
        "Sprich frei zu deinem Prüfungsthema und reagiere auf Rückfragen.",
      thinkSeconds: task.timing?.prepSeconds ?? 30,
      speakSeconds: task.timing?.speakSeconds ?? 120,
    }));
  }, [teilOptions]);

  const interactionAvailable = useMemo(() => {
    const normalizedLevel = (level || "").toUpperCase();
    const normalizedTeil = (teil || "").toLowerCase();

    const isB1Task =
      normalizedLevel === "B1" &&
      (normalizedTeil.includes("präsentation") ||
        normalizedTeil.includes("planung"));

    const isB2OrHigherDiscussion =
      ["B2", "C1", "C2"].includes(normalizedLevel) &&
      normalizedTeil.includes("diskussion");

    return isB1Task || isB2OrHigherDiscussion;
  }, [level, teil]);

  useEffect(() => {
    if (!interactionAvailable) {
      setInteractionMode(false);
      setInteractionSession(null);
      setInteractionResult(null);
      return;
    }

    if (!hasManuallyToggledInteraction.current) {
      setInteractionMode(true);
    }
  }, [interactionAvailable]);

  useEffect(() => {
    setSimulationMode(false);
    setSimulationCountdown(null);
    setCurrentSimulationStepIndex(0);
    setSimulationScores([]);
    setSimulationSummary(null);
    stepAdvanceGuardRef.current = false;
  }, [simulationSteps]);

  useEffect(() => {
    let isMounted = true;

    const loadQuestions = async () => {
      setQuestionsLoading(true);
      setQuestionError("");
      setCurrentQuestionIndex(0);

      try {
        const data = await fetchSpeakingQuestions(level, teil, idToken);
        if (!isMounted) return;

        if (!data || data.length === 0) {
          setQuestionError(
            "Keine Fragen verfügbar. Bitte wähle ein anderes Niveau oder einen anderen Teil."
          );
          setQuestions([]);
        } else {
          const normalized = data.map((entry) => ({
            ...entry,
            text: entry.text || entry.topic || entry.keyword || "Übe deine Vorstellung.",
            hint: entry.hint || entry.keyword || "",
          }));
          setQuestions(normalized);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setQuestionError(
            "Fehler beim Laden der Fragen. Bitte versuche es später erneut."
          );
          setQuestions([]);
        }
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
  }, [level, teil, idToken]);

  const resetAudio = useCallback(
    (options = {}) => {
      setError("");
      setAudioBlob(null);
      setAudioUrl(null);
      if (!options.keepResult) {
        setResult(null);
        setInteractionResult(null);
      }
      setRecordingTime(0);
      setWaveform([]);
    },
    [
      setAudioBlob,
      setAudioUrl,
      setError,
      setInteractionResult,
      setRecordingTime,
      setResult,
      setWaveform,
    ]
  );

  const currentQuestion = questions[currentQuestionIndex] || null;

  const showNextQuestion = () => {
    if (questions.length === 0) return;
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
  };

  const cleanupAudioContext = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
      analyserRef.current = null;
    }
  }, []);

  const startVisualization = (stream) => {
    cleanupAudioContext();

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      analyser.getByteTimeDomainData(dataArray);
      const normalizedData = Array.from(dataArray).map(
        (v) => (v - 128) / 128
      );
      setWaveform(normalizedData);
      animationRef.current = requestAnimationFrame(draw);
    };

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    draw();
  };

  const stopVisualization = useCallback(() => {
    cleanupAudioContext();
    setWaveform([]);
  }, [cleanupAudioContext]);

  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else if (!isRecording && recordingTime !== 0) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, recordingTime]);

  const validateLevel = useCallback(() => {
    if (!ALLOWED_LEVELS.includes(level)) {
      setError("Bitte wähle ein gültiges Sprachniveau (A1–B2).");
      return false;
    }
    return true;
  }, [level, setError]);

  const validateTeil = () => {
    const allowedTeile = teilOptions.map((option) => option.label);

    if (!allowedTeile.includes(teil)) {
      setError("Bitte wähle einen gültigen Prüfungsteil.");
      return false;
    }
    return true;
  };

  const handleAssessment = async () => {
    if (!audioBlob) {
      setError(
        "Bitte nimm zuerst deine Antwort auf oder lade eine Audio-Datei hoch."
      );
      return;
    }

    if (!validateLevel() || !validateTeil()) return;

    setLoading(true);
    setError("");

    try {
      const activeToken = await getActiveIdToken();
      const analysis = await analyzeAudio({
        audioBlob,
        level,
        teil,
        contextType: simulationMode ? "simulation" : "single",
        question: currentQuestion?.text || "",
        interactionMode,
        userId,
        idToken: activeToken,
      });

      setResult(analysis);
      setInteractionResult(analysis?.interaction || null);

      if (interactionMode && analysis?.interaction?.followUpQuestions?.length) {
        setInteractionSession({
          followUpQuestions: analysis.interaction.followUpQuestions,
          initialTranscript: analysis.transcript,
          teil,
          level,
          styleTip: analysis.interaction.style_tip,
          closingPrompt: analysis.interaction.closing_prompt,
        });
        setSelectedFollowUpIndex(0);
      } else {
        setInteractionSession(null);
      }

      addResultToHistory(analysis);

      resetAudio({ keepResult: true });
      stopVisualization();
    } catch (err) {
      console.error(err);
      setError(
        "Die Auswertung ist fehlgeschlagen. Bitte versuche es später erneut."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInteractionToggle = () => {
    hasManuallyToggledInteraction.current = true;
    setInteractionMode((prev) => !prev);
    setInteractionSession(null);
    setInteractionResult(null);
  };

  const handleInteractionAssessment = async () => {
    if (!interactionSession || !interactionSession.followUpQuestions?.length) {
      setError(
        "Starte zuerst eine Auswertung, um Folgefragen vom Prüfer/Partner zu erhalten."
      );
      return;
    }

    const selectedQuestion =
      interactionSession.followUpQuestions[selectedFollowUpIndex] ||
      interactionSession.followUpQuestions[0];

    if (!selectedQuestion) {
      setError("Keine Folgefrage ausgewählt.");
      return;
    }

    if (!audioBlob) {
      setError("Bitte nimm deine Antwort auf eine Folgefrage auf.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const activeToken = await getActiveIdToken();
      const response = await scoreInteractionAudio({
        audioBlob,
        initialTranscript: interactionSession.initialTranscript,
        followUpQuestion: selectedQuestion.prompt || selectedQuestion.text,
        teil: interactionSession.teil || teil,
        level,
        userId,
        targetLevel: level,
        idToken: activeToken,
      });

      setResult(response);
      setInteractionResult(response?.interaction || null);
      addResultToHistory(response);

      resetAudio({ keepResult: true });
      stopVisualization();
    } catch (err) {
      console.error(err);
      setError(
        "Die Bewertung des Gesprächsverlaufs ist fehlgeschlagen. Bitte versuche es später erneut."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSimulationAssessment = useCallback(async () => {
    if (!audioBlob) {
      setError(
        "Bitte nimm zuerst deine Antwort auf oder lade eine Audio-Datei hoch."
      );
      return;
    }

    if (!validateLevel()) return;

    const step = simulationSteps[currentSimulationStepIndex];
    if (!step) {
      setError("Ungültiger Simulationsschritt.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const activeToken = await getActiveIdToken();
      const analysis = await analyzeAudio({
        audioBlob,
        level,
        teil: step.teil,
        contextType: "simulation",
        question: step.instructions,
        userId,
        idToken: activeToken,
      });

      setSimulationScores((prev) => [
        ...prev,
        {
          stepIndex: currentSimulationStepIndex,
          teil: step.teil,
          score: analysis?.totalScore || null,
          feedback: analysis?.feedback || "",
          summary: analysis?.summary || "",
        },
      ]);

      setResult(analysis);
      addResultToHistory(analysis);

      resetAudio({ keepResult: true });
      stopVisualization();

      if (currentSimulationStepIndex < simulationSteps.length - 1) {
        const nextIndex = currentSimulationStepIndex + 1;
        setCurrentSimulationStepIndex(nextIndex);
        setSimulationCountdown({
          type: "think",
          secondsRemaining: simulationSteps[nextIndex].thinkSeconds,
        });
        setHasStartedSpeaking(false);
      } else {
        const scores = simulationScores.concat({
          stepIndex: currentSimulationStepIndex,
          teil: step.teil,
          score: analysis?.totalScore || null,
          feedback: analysis?.feedback || "",
          summary: analysis?.summary || "",
        });

        const validScores = scores
          .map((s) => s.score)
          .filter((s) => typeof s === "number");

        const averageScore =
          validScores.length > 0
            ? Math.round(
                (validScores.reduce((sum, s) => sum + s, 0) / validScores.length) *
                  10
              ) / 10
            : null;

        setSimulationSummary({
          steps: scores,
          averageScore,
          level,
          date: new Date().toISOString(),
        });

        setSimulationCountdown(null);
        setSimulationMode(false);
      }
    } catch (err) {
      console.error(err);
      setError(
        "Die Auswertung für diesen Schritt ist fehlgeschlagen. Bitte versuche es später erneut."
      );
    } finally {
      setLoading(false);
      stepAdvanceGuardRef.current = false;
    }
  }, [
    addResultToHistory,
    audioBlob,
    currentSimulationStepIndex,
    idToken,
    level,
    resetAudio,
    setError,
    setLoading,
    setResult,
    simulationScores,
    simulationSteps,
    stopVisualization,
    userId,
    validateLevel,
  ]);

  const handleRecordClick = async () => {
    if (isRecording) {
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
      setIsRecording(false);
      stopVisualization();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);

        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }
        const newUrl = URL.createObjectURL(blob);
        setAudioUrl(newUrl);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
      setError("");

      startVisualization(stream);
    } catch (err) {
      console.error(err);
      setError(
        "Zugriff auf das Mikrofon verweigert oder nicht möglich. Bitte überprüfe deine Einstellungen."
      );
    }
  };

  const handleUploadClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "audio/*";

    fileInput.onchange = (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      resetAudio();

      const blob = new Blob([file], { type: file.type });
      setAudioBlob(blob);
      const newUrl = URL.createObjectURL(blob);
      setAudioUrl(newUrl);
    };

    fileInput.click();
  };

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      stopVisualization();
    };
  }, [audioUrl, stopVisualization]);

  const handleSimulationStart = () => {
    if (!simulationSteps.length) {
      setError("Für dieses Niveau sind aktuell keine Simulationsteile definiert.");
      return;
    }

    setSimulationMode(true);
    setSimulationScores([]);
    setSimulationSummary(null);
    setCurrentSimulationStepIndex(0);
    setSimulationCountdown({
      type: "think",
      secondsRemaining: simulationSteps[0].thinkSeconds,
    });
    setHasStartedSpeaking(false);
    stepAdvanceGuardRef.current = false;
    setTeil(simulationSteps[0].teil);
  };

  const handleSimulationStop = () => {
    setSimulationMode(false);
    setSimulationCountdown(null);
    setCurrentSimulationStepIndex(0);
    setSimulationScores([]);
    setSimulationSummary(null);
    stepAdvanceGuardRef.current = false;
  };

  useEffect(() => {
    if (!simulationMode || !simulationCountdown) return;

    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    countdownRef.current = setInterval(() => {
      setSimulationCountdown((prev) => {
        if (!prev) return null;

        if (prev.secondsRemaining <= 1) {
          if (prev.type === "think") {
            setHasStartedSpeaking(true);
            return {
              type: "speak",
              secondsRemaining:
                simulationSteps[currentSimulationStepIndex]?.speakSeconds || 0,
            };
          } else {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
            return {
              ...prev,
              secondsRemaining: 0,
            };
          }
        }

        return {
          ...prev,
          secondsRemaining: prev.secondsRemaining - 1,
        };
      });
    }, 1000);

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, [
    simulationMode,
    currentSimulationStepIndex,
    simulationCountdown,
    simulationSteps,
  ]);

  useEffect(() => {
    if (
      !simulationMode ||
      !simulationCountdown ||
      simulationCountdown.type !== "speak" ||
      simulationCountdown.secondsRemaining > 0 ||
      stepAdvanceGuardRef.current
    ) {
      return;
    }

    stepAdvanceGuardRef.current = true;

    const doneTimeout = setTimeout(() => {
      if (audioBlob) {
        handleSimulationAssessment();
      } else {
        setError(
          "Die Sprechzeit ist vorbei, aber es wurde keine Aufnahme gefunden. Bitte wiederhole den Schritt."
        );
        stepAdvanceGuardRef.current = false;
      }
    }, 1000);

    return () => {
      clearTimeout(doneTimeout);
    };
    }, [
      simulationMode,
      simulationCountdown,
      audioBlob,
      handleSimulationAssessment,
      setError,
    ]);

  const handleInputModeChange = (mode) => {
    if (mode === inputMode) return;
    setInputMode(mode);
    resetAudio();
    stopVisualization();
  };

  return (
    <>
      <header style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Sprechen</h2>
        <p style={styles.sectionDescription}>
          Übe das Sprechen für die Goethe-Prüfung. Du kannst Antworten aufnehmen
          oder eine Audio-Datei hochladen. Die KI gibt dir ein Feedback mit
          Punkten, Stärken und Tipps.
        </p>
      </header>

      <section style={styles.card}>
        <SettingsForm />
      </section>

      <section style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Fragen aus der Prüfung</h3>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              style={{
                ...styles.buttonSecondary,
                ...(inputMode === "record"
                  ? styles.buttonSecondaryActive
                  : null),
              }}
              onClick={() => handleInputModeChange("record")}
            >
              Aufnahme
            </button>
            <button
              style={{
                ...styles.buttonSecondary,
                ...(inputMode === "upload"
                  ? styles.buttonSecondaryActive
                  : null),
              }}
              onClick={() => handleInputModeChange("upload")}
            >
              Datei hochladen
            </button>
          </div>
        </div>

        {interactionAvailable && (
          <div
            style={{
              marginTop: 8,
              padding: 12,
              borderRadius: 10,
              border: "1px dashed #9ca3af",
              background: "#f9fafb",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <strong>AI-Prüfer/Partner Modus</strong>
                <p style={{ ...styles.cardSubtitle, margin: "4px 0 0" }}>
                  Für Interaktionsteile (B1 Teil 1 & 3, B2 Diskussion) stellt die KI
                  2–3 Rückfragen und bewertet deinen Dialog.
                </p>
              </div>
              <button
                style={{
                  ...styles.buttonSecondary,
                  ...(interactionMode ? styles.buttonSecondaryActive : null),
                }}
                type="button"
                onClick={handleInteractionToggle}
              >
                {interactionMode ? "Modus aktiviert" : "Modus aktivieren"}
              </button>
            </div>
            {interactionMode && interactionSession?.styleTip && (
              <p style={{ ...styles.helperText, margin: 0 }}>
                Prüfer-Hinweis: {interactionSession.styleTip}
              </p>
            )}
          </div>
        )}

        {questionsLoading && <p>Lade Fragen...</p>}
        {questionError && (
          <p style={{ color: "var(--color-error)" }}>{questionError}</p>
        )}

        {!questionsLoading && !questionError && currentQuestion && (
          <div style={styles.questionBox}>
            <div style={styles.questionHeader}>
              <span style={styles.questionLabel}>Frage</span>
              <span style={styles.questionMeta}>
                Frage {currentQuestionIndex + 1} von {questions.length}
              </span>
            </div>
            <p style={styles.questionText}>{currentQuestion.text}</p>
            {currentQuestion.hint && (
              <p style={styles.questionHint}>{currentQuestion.hint}</p>
            )}
            <button
              style={styles.buttonGhost}
              type="button"
              onClick={showNextQuestion}
            >
              Nächste Frage
            </button>
          </div>
        )}

        <div style={styles.audioControls}>
          <div style={styles.waveformContainer}>
            {waveform.length > 0 ? (
              <svg
                viewBox="0 0 200 50"
                preserveAspectRatio="none"
                style={styles.waveformSvg}
              >
                {waveform.map((value, index) => {
                  const x = (index / waveform.length) * 200;
                  const y = 25;
                  const height = Math.max(2, Math.abs(value) * 50);
                  return (
                    <rect
                      key={index}
                      x={x}
                      y={y - height / 2}
                      width={200 / waveform.length}
                      height={height}
                      rx="1"
                    />
                  );
                })}
              </svg>
            ) : (
              <div style={styles.waveformPlaceholder}>
                <span>
                  {isRecording
                    ? "Sprich jetzt – deine Stimme wird aufgenommen..."
                    : "Hier siehst du deine Sprachaufnahme als Wellenform."}
                </span>
              </div>
            )}
          </div>

          <div style={styles.audioButtonRow}>
            {inputMode === "record" ? (
              <>
                <button
                  style={{
                    ...styles.recordButton,
                    ...(isRecording ? styles.recordButtonActive : null),
                  }}
                  type="button"
                  onClick={handleRecordClick}
                >
                  {isRecording ? "Stoppen" : "Aufnahme starten"}
                </button>
                <span style={styles.recordingTime}>
                  {formatTime(recordingTime)}
                </span>
              </>
            ) : (
              <button
                style={styles.buttonPrimary}
                type="button"
                onClick={handleUploadClick}
              >
                Audio-Datei wählen
              </button>
            )}

            {audioUrl && (
              <audio
                controls
                src={audioUrl}
                style={styles.audioPlayer}
                controlsList="nodownload"
              >
                Dein Browser unterstützt das Audio-Element nicht.
              </audio>
            )}
          </div>

          <button
            style={styles.buttonPrimary}
            type="button"
            onClick={simulationMode ? handleSimulationAssessment : handleAssessment}
            disabled={loading || !audioBlob}
          >
            {loading
              ? "Wird ausgewertet..."
              : simulationMode
              ? "Schritt auswerten"
              : "Antwort auswerten"}
          </button>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <strong>Hinweis:</strong> {error}
          </div>
        )}

        {interactionMode && interactionSession?.followUpQuestions?.length > 0 && (
          <div
            style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              background: "#f8fafc",
              display: "grid",
              gap: 10,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <h4 style={{ ...styles.cardTitle, marginBottom: 4 }}>
                  Folgefragen des Prüfers/Partners
                </h4>
                <p style={styles.cardSubtitle}>
                  Wähle eine Rückfrage, nimm deine Antwort auf und lasse den Dialog bewerten.
                </p>
              </div>
              {interactionSession.closingPrompt && (
                <span style={{ ...styles.helperText, maxWidth: 320 }}>
                  Abschluss-Idee: {interactionSession.closingPrompt}
                </span>
              )}
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              {interactionSession.followUpQuestions.map((item, idx) => (
                <label
                  key={`followup-${idx}`}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    padding: 10,
                    borderRadius: 8,
                    border:
                      selectedFollowUpIndex === idx
                        ? "2px solid #2563eb"
                        : "1px solid #e5e7eb",
                    background:
                      selectedFollowUpIndex === idx ? "#eef2ff" : "#fff",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    checked={selectedFollowUpIndex === idx}
                    onChange={() => setSelectedFollowUpIndex(idx)}
                    style={{ marginTop: 4 }}
                  />
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.prompt || item.text}</div>
                    {item.focus && (
                      <div style={{ ...styles.helperText, marginTop: 4 }}>
                        Fokus: {item.focus}
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button
                style={styles.buttonPrimary}
                type="button"
                onClick={handleInteractionAssessment}
                disabled={loading || !audioBlob}
              >
                Gesprächsbewertung senden
              </button>
              <span style={styles.helperText}>
                Nutze die Aufnahme-Steuerung oben, um deine Folgeantwort einzusprechen.
              </span>
            </div>

            {interactionResult && (
              <div style={{ ...styles.helperText, background: "#ecfeff", padding: 12 }}>
                <strong>Dialog-Zusammenfassung:</strong> {interactionResult.summary || ""}
                <div style={{ marginTop: 6 }}>
                  <div>Turn-Taking: {interactionResult.turn_taking || ""}</div>
                  <div>Follow-ups: {interactionResult.follow_up_quality || ""}</div>
                  <div>Höflichkeit: {interactionResult.politeness || ""}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <section style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Prüfungssimulation (Teil 1–3)</h3>
          <p style={styles.cardSubtitle}>
            Simuliere eine komplette Sprechprüfung mit Vorbereitungszeit und
            Sprechzeit. Die KI bewertet jeden Teil und gibt dir eine Gesamtübersicht.
          </p>
        </div>

        <div style={styles.simulationControls}>
          <button
            style={{
              ...styles.buttonSecondary,
              ...(simulationMode ? styles.buttonSecondaryActive : null),
            }}
            type="button"
            onClick={simulationMode ? handleSimulationStop : handleSimulationStart}
          >
            {simulationMode
              ? "Simulation beenden"
              : "Prüfungssimulation starten"}
          </button>
        </div>

        {simulationMode && (
          <div style={styles.simulationBox}>
            <div style={styles.simulationStepHeader}>
              <span style={styles.simulationStepLabel}>
                {simulationSteps[currentSimulationStepIndex]?.teil || ""}
              </span>
              <span style={styles.simulationStepMeta}>
                Schritt {currentSimulationStepIndex + 1} von{" "}
                {simulationSteps.length}
              </span>
            </div>

            <p style={styles.simulationInstructions}>
              {simulationSteps[currentSimulationStepIndex]?.instructions || ""}
            </p>

            {simulationCountdown && (
              <div style={styles.simulationCountdown}>
                <span style={styles.simulationCountdownLabel}>
                  {simulationCountdown.type === "think"
                    ? "Vorbereitungszeit"
                    : "Sprechzeit"}
                </span>
                <span style={styles.simulationCountdownTime}>
                  {formatTime(simulationCountdown.secondsRemaining)}
                </span>
              </div>
            )}

            {!hasStartedSpeaking && simulationCountdown?.type === "think" && (
              <p style={styles.simulationHint}>
                Nutze die Vorbereitungszeit, um deine Antwort zu planen. Die
                Sprechzeit beginnt automatisch.
              </p>
            )}

            {hasStartedSpeaking && simulationCountdown?.type === "speak" && (
              <p style={styles.simulationHint}>
                Sprich jetzt frei und zusammenhängend. Die Aufnahme läuft, bis
                die Zeit abgelaufen ist. Dann kannst du die Antwort auswerten
                lassen.
              </p>
            )}
          </div>
        )}

        {simulationSummary && (
          <div style={styles.simulationSummaryBox}>
            <h4 style={styles.simulationSummaryTitle}>
              Zusammenfassung der Prüfungssimulation
            </h4>
            <p style={styles.simulationSummaryMeta}>
              Niveau: {simulationSummary.level} · Datum:{" "}
              {new Date(simulationSummary.date).toLocaleString("de-DE")}
            </p>

            {simulationSummary.averageScore !== null && (
              <p style={styles.simulationSummaryScore}>
                Durchschnittliche Punktzahl:{" "}
                <strong>{simulationSummary.averageScore.toFixed(1)}</strong> / 100
              </p>
            )}

            <ul style={styles.simulationSummaryList}>
              {simulationSummary.steps.map((step) => (
                <li key={step.stepIndex} style={styles.simulationSummaryItem}>
                  <div style={styles.simulationSummaryItemHeader}>
                    <span style={styles.simulationSummaryItemLabel}>
                      {step.teil}
                    </span>
                    {typeof step.score === "number" && (
                      <span style={styles.simulationSummaryItemScore}>
                        {step.score} / 100
                      </span>
                    )}
                  </div>
                  {step.summary && (
                    <p style={styles.simulationSummaryItemText}>
                      {step.summary}
                    </p>
                  )}
                  {step.feedback && (
                    <p style={styles.simulationSummaryItemFeedback}>
                      {step.feedback}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <Feedback result={result} />
      <ResultHistory results={resultHistory} />
    </>
  );
};

export default SpeakingPage;
