import React, { useEffect, useMemo, useRef, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { useAuth } from "../context/AuthContext";
import { analyzeAudio, scoreA1MockSpeaking } from "../services/coachService";
import {
  SPEAKING_AUDIO_MIN_SECONDS,
  buildRecordedAudioBlob,
  createSpeakingMediaRecorder,
  revokeObjectUrl,
  userFacingAudioError,
} from "../lib/speakingAudio";
import "./A1GoetheReadingMockTeil1Preview.css";
import "./A1GoetheSpeakingMockPreview.css";

export const A1_GOETHE_SPEAKING_MOCK = Object.freeze({
  durationSeconds: 15 * 60,
  maxScore: 25,
  passScore: 15,
  tasks: [
    {
      id: "teil1",
      teil: "1",
      title: "Teil 1 · Sich vorstellen",
      context: "Persönliche Vorstellung",
      maxRecordingSeconds: 90,
      prompt:
        "Stellen Sie sich kurz vor. Sprechen Sie über Name, Alter, Land, Wohnort, Sprachen, Beruf und Hobby. Buchstabieren Sie am Ende Ihren Familiennamen.",
      card: ["Name", "Alter", "Land", "Wohnort", "Sprachen", "Beruf", "Hobby", "Familienname buchstabieren"],
    },
    {
      id: "teil2",
      teil: "2",
      title: "Teil 2 · Um Informationen bitten",
      context: "Thema: Freizeit",
      maxRecordingSeconds: 45,
      prompt:
        "Thema: Freizeit. Ihr Wort ist „Wochenende“. Stellen Sie eine passende A1-Frage mit diesem Wort.",
      keyword: "Wochenende",
    },
    {
      id: "teil3",
      teil: "3",
      title: "Teil 3 · Eine Bitte formulieren",
      context: "Bitte im Alltag",
      maxRecordingSeconds: 45,
      prompt:
        "Karte: Fenster. Ihnen ist warm. Bitten Sie die andere Person höflich, das Fenster zu öffnen.",
      keyword: "Fenster",
    },
  ],
});

const formatTime = (seconds) => {
  const safe = Math.max(0, Number(seconds) || 0);
  const minutes = String(Math.floor(safe / 60)).padStart(2, "0");
  const secs = String(safe % 60).padStart(2, "0");
  return `${minutes}:${secs}`;
};

const partLabel = (teil) => `Teil ${teil}`;

export default function A1GoetheSpeakingMockPreview() {
  const { idToken, user } = useAuth();
  const [started, setStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(A1_GOETHE_SPEAKING_MOCK.durationSeconds);
  const [attempts, setAttempts] = useState({});
  const [recordingTaskId, setRecordingTaskId] = useState("");
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [marking, setMarking] = useState(false);
  const [result, setResult] = useState(null);

  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const recordingIntervalRef = useRef(null);
  const recordingSecondsRef = useRef(0);
  const activeTaskRef = useRef(null);
  const attemptsRef = useRef({});

  const tasks = A1_GOETHE_SPEAKING_MOCK.tasks;

  useEffect(() => {
    if (!started || secondsLeft <= 0) return undefined;
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [started, secondsLeft]);

  useEffect(() => {
    if (secondsLeft > 0 || !recordingTaskId) return;
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  }, [secondsLeft, recordingTaskId]);

  useEffect(() => {
    attemptsRef.current = attempts;
  }, [attempts]);

  useEffect(
    () => () => {
      if (recordingIntervalRef.current) window.clearInterval(recordingIntervalRef.current);
      if (recorderRef.current?.state === "recording") recorderRef.current.stop();
      if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop());
      Object.values(attemptsRef.current).forEach((attempt) => revokeObjectUrl(attempt?.audioUrl));
    },
    [],
  );

  const completedCount = useMemo(
    () => tasks.filter((task) => Boolean(attempts[task.id]?.transcript)).length,
    [attempts, tasks],
  );

  const isUnlocked = (index) => {
    if (!started) return false;
    if (index === 0) return true;
    return Boolean(attempts[tasks[index - 1].id]?.transcript);
  };

  const clearRecordingTimer = () => {
    if (recordingIntervalRef.current) {
      window.clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
  };

  const replaceAttemptAudio = (taskId, blob, audioUrl, duration) => {
    setAttempts((current) => {
      if (current[taskId]?.audioUrl) revokeObjectUrl(current[taskId].audioUrl);
      return {
        ...current,
        [taskId]: {
          audioBlob: blob,
          audioUrl,
          duration,
          transcript: "",
          analysisFeedback: "",
          submitted: false,
        },
      };
    });
  };

  const startRecording = async (task) => {
    if (!started || secondsLeft <= 0 || recordingTaskId || attempts[task.id]?.submitted) return;
    setError("");
    setStatus("");
    setRecordingSeconds(0);
    recordingSecondsRef.current = 0;
    activeTaskRef.current = task;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = createSpeakingMediaRecorder(stream);
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data?.size) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        clearRecordingTimer();
        setRecordingTaskId("");
        const duration = recordingSecondsRef.current;
        try {
          if (duration < SPEAKING_AUDIO_MIN_SECONDS) {
            throw new Error(`Please record for at least ${SPEAKING_AUDIO_MIN_SECONDS} seconds.`);
          }
          const blob = buildRecordedAudioBlob(chunksRef.current, recorder);
          const audioUrl = URL.createObjectURL(blob);
          replaceAttemptAudio(task.id, blob, audioUrl, duration);
          setStatus(`${task.title}: recording ready. Listen once, then submit it.`);
        } catch (recordError) {
          setError(userFacingAudioError(recordError, recordError?.message || "No usable audio was captured."));
        } finally {
          setRecordingSeconds(0);
          recordingSecondsRef.current = 0;
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }
        }
      };

      recorder.start(1000);
      setRecordingTaskId(task.id);
      recordingIntervalRef.current = window.setInterval(() => {
        recordingSecondsRef.current += 1;
        const next = recordingSecondsRef.current;
        setRecordingSeconds(next);
        if (next >= task.maxRecordingSeconds && recorder.state === "recording") {
          recorder.stop();
        }
      }, 1000);
    } catch (recordError) {
      setError(recordError?.message || "Microphone access was blocked.");
    }
  };

  const stopRecording = () => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  };

  const submitTask = async (task) => {
    const attempt = attempts[task.id];
    if (!attempt?.audioBlob || attempt.submitted) return;

    setError("");
    setStatus(`${task.title}: Falowen is listening and transcribing…`);
    setAttempts((current) => ({
      ...current,
      [task.id]: { ...current[task.id], submitting: true },
    }));

    try {
      const response = await analyzeAudio({
        audioBlob: attempt.audioBlob,
        teil: task.teil,
        level: "A1",
        contextType: "A1 full mock exam",
        question: task.prompt,
        interactionMode: "single-candidate mock",
        userId: user?.uid || "guest",
        idToken,
      });

      const transcript = String(response?.transcript || "").trim();
      if (!transcript) {
        throw new Error("Falowen could not hear a clear answer. Please record this part again.");
      }

      setAttempts((current) => ({
        ...current,
        [task.id]: {
          ...current[task.id],
          transcript,
          analysisFeedback: String(response?.feedback || "").trim(),
          submitted: true,
          submitting: false,
        },
      }));
      setStatus(`${task.title}: answer submitted. Continue to the next Teil.`);
    } catch (submitError) {
      setAttempts((current) => ({
        ...current,
        [task.id]: { ...current[task.id], submitting: false },
      }));
      setError(userFacingAudioError(submitError, submitError?.message || "Could not analyze this recording."));
    }
  };

  const resetUnsubmittedRecording = (taskId) => {
    setAttempts((current) => {
      const target = current[taskId];
      if (!target || target.submitted) return current;
      revokeObjectUrl(target.audioUrl);
      const next = { ...current };
      delete next[taskId];
      return next;
    });
  };

  const markSpeaking = async () => {
    if (completedCount !== tasks.length || marking) return;
    setMarking(true);
    setError("");
    setStatus("Falowen is marking your complete A1 Sprechen mock…");

    try {
      const assessment = await scoreA1MockSpeaking({
        attempts: tasks.map((task) => ({
          teil: task.teil,
          task: task.prompt,
          transcript: attempts[task.id]?.transcript || "",
          analysisFeedback: attempts[task.id]?.analysisFeedback || "",
        })),
        idToken,
      });
      setResult(assessment);
      setStatus("Sprechen result ready.");
    } catch (markError) {
      setError(markError?.message || "Could not mark the complete speaking mock.");
      setStatus("");
    } finally {
      setMarking(false);
    }
  };

  const scorePercent = result
    ? Math.round((Number(result.score || 0) / Number(result.maxScore || 25)) * 100)
    : 0;

  return (
    <main className="a1-goethe-mock-shell" data-a1-goethe-speaking-mock-preview>
      <div className="a1-goethe-mock-topbar">
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span className="a1-goethe-mock-preview-badge">Sprechen mock · AI marked · not in Course Book</span>
      </div>

      <article className="a1-goethe-mock-exam a1-sprechen-mock-exam">
        <header className="a1-goethe-mock-header">
          <p className="a1-goethe-mock-kicker">A1 · Sprechen</p>
          <h1>Prüfungssimulation</h1>
          <p>Bearbeitungszeit: 15 Minuten. Nehmen Sie Ihre Antworten auf Deutsch auf.</p>
          <p><strong>Falowen hört alle drei Teile, transkribiert sie und markiert die komplette Sprechprüfung am Ende.</strong></p>
        </header>

        <div className="a1-sprechen-controlbar">
          <div>
            <span className="a1-sprechen-control-label">Zeit</span>
            <strong className={secondsLeft <= 120 ? "a1-sprechen-timer a1-sprechen-timer-warning" : "a1-sprechen-timer"}>
              {formatTime(secondsLeft)}
            </strong>
          </div>
          <div>
            <span className="a1-sprechen-control-label">Fortschritt</span>
            <strong>{completedCount}/3 Teile abgegeben</strong>
          </div>
          {!started ? (
            <button type="button" className="a1-sprechen-primary" onClick={() => setStarted(true)}>
              Sprechen starten
            </button>
          ) : null}
        </div>

        {tasks.map((task, index) => {
          const attempt = attempts[task.id] || {};
          const unlocked = isUnlocked(index);
          const currentlyRecording = recordingTaskId === task.id;
          const lockedByPrior = started && !unlocked;
          return (
            <section
              className={unlocked ? "a1-sprechen-task" : "a1-sprechen-task a1-sprechen-task-locked"}
              key={task.id}
            >
              <div className="a1-sprechen-task-heading">
                <div>
                  <p className="a1-sprechen-part-kicker">{partLabel(task.teil)}</p>
                  <h2>{task.title.replace(/^Teil \d+ · /, "")}</h2>
                  <p>{task.context}</p>
                </div>
                <span>{task.maxRecordingSeconds} Sek. max.</span>
              </div>

              <div className="a1-sprechen-prompt">
                <strong>Aufgabe</strong>
                <p>{task.prompt}</p>
              </div>

              {task.card ? (
                <div className="a1-sprechen-intro-card">
                  {task.card.map((item) => <span key={item}>{item}</span>)}
                </div>
              ) : null}

              {task.keyword ? (
                <div className="a1-sprechen-keyword-card">
                  <span>{task.teil === "2" ? "Wort" : "Karte"}</span>
                  <strong>{task.keyword}</strong>
                </div>
              ) : null}

              {lockedByPrior ? (
                <p className="a1-sprechen-locked-note">Geben Sie zuerst {tasks[index - 1].title} ab.</p>
              ) : null}

              {unlocked ? (
                <div className="a1-sprechen-recorder">
                  <div className="a1-sprechen-recorder-actions">
                    <button
                      type="button"
                      className={currentlyRecording ? "a1-sprechen-record a1-sprechen-recording" : "a1-sprechen-record"}
                      onClick={() => (currentlyRecording ? stopRecording() : startRecording(task))}
                      disabled={Boolean(recordingTaskId && !currentlyRecording) || attempt.submitted || secondsLeft <= 0}
                    >
                      {currentlyRecording ? "Aufnahme stoppen" : attempt.audioBlob ? "Neu aufnehmen" : "Antwort aufnehmen"}
                    </button>
                    {currentlyRecording ? <strong>{formatTime(recordingSeconds)}</strong> : null}
                    {attempt.audioUrl && !attempt.submitted ? (
                      <button
                        type="button"
                        className="a1-sprechen-secondary"
                        onClick={() => resetUnsubmittedRecording(task.id)}
                      >
                        Aufnahme löschen
                      </button>
                    ) : null}
                  </div>

                  {attempt.audioUrl ? (
                    <audio className="a1-sprechen-audio" controls src={attempt.audioUrl} preload="metadata">
                      Ihr Browser unterstützt dieses Audio nicht.
                    </audio>
                  ) : null}

                  {attempt.audioBlob && !attempt.submitted ? (
                    <button
                      type="button"
                      className="a1-sprechen-primary"
                      onClick={() => submitTask(task)}
                      disabled={attempt.submitting}
                    >
                      {attempt.submitting ? "Wird geprüft …" : "Diese Antwort abgeben"}
                    </button>
                  ) : null}

                  {attempt.submitted ? (
                    <div className="a1-sprechen-submitted">
                      <strong>Abgegeben</strong>
                      <p>Falowen hat Ihre Aufnahme verstanden. Die Bewertung sehen Sie erst nach Teil 3.</p>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </section>
          );
        })}

        {status ? <p className="a1-sprechen-status">{status}</p> : null}
        {error ? <p className="a1-sprechen-error">{error}</p> : null}

        {completedCount === tasks.length && !result ? (
          <div className="a1-sprechen-final-action">
            <h2>Alle drei Teile sind abgegeben.</h2>
            <p>Falowen markiert jetzt Teil 1, Teil 2 und Teil 3 gemeinsam nach A1-Standard.</p>
            <button type="button" className="a1-sprechen-primary" onClick={markSpeaking} disabled={marking}>
              {marking ? "Sprechen wird markiert …" : "Sprechen markieren"}
            </button>
          </div>
        ) : null}

        {result ? (
          <section className="a1-sprechen-result">
            <div className="a1-sprechen-result-summary">
              <div>
                <span>Sprechen</span>
                <strong>{result.score}/{result.maxScore || 25}</strong>
                <small>{scorePercent}%</small>
              </div>
              <div>
                <span>Ergebnis</span>
                <strong>{result.passed ? "Passed" : "Needs more practice"}</strong>
                <small>Pass mark: 15/25</small>
              </div>
            </div>

            <div className="a1-sprechen-feedback">
              <h2>AI feedback</h2>
              <p>{result.overall_feedback_en}</p>
              {result.level_mismatch ? (
                <p className="a1-sprechen-level-note">
                  This response uses language that is noticeably above typical A1 level. Practise expressing the same ideas with simpler A1 structures.
                </p>
              ) : null}
            </div>

            <div className="a1-sprechen-part-results">
              {["teil1", "teil2", "teil3"].map((key) => {
                const part = result.parts?.[key];
                if (!part) return null;
                return (
                  <div key={key}>
                    <strong>{key.replace("teil", "Teil ")} · {part.score}/{part.maxScore}</strong>
                    <p>{part.feedback_en}</p>
                    {part.corrected_example_de ? <small>German example: {part.corrected_example_de}</small> : null}
                  </div>
                );
              })}
            </div>

            <div className="a1-sprechen-result-actions">
              <a href="/exams/question" className="a1-sprechen-primary">Practice more in Exams Room</a>
              <a href="/exams/speaking" className="a1-sprechen-secondary">More Sprechen practice</a>
            </div>
          </section>
        ) : null}
      </article>
    </main>
  );
}
