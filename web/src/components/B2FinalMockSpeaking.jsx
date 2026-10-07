import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  TIMED_MOCK_SPEAKING_ANALYZE_TIMEOUT_MS,
  analyzeAudio,
  scoreB2MockSpeaking,
} from "../services/coachService";
import {
  SPEAKING_AUDIO_MIN_SECONDS,
  buildRecordedAudioBlob,
  createSpeakingMediaRecorder,
  revokeObjectUrl,
  userFacingAudioError,
} from "../lib/speakingAudio";
import { B2_SPEAKING } from "../data/b2FinalMockData";
import "./A1GoetheSpeakingMockPreview.css";
import "./A2GoetheSpeakingMockTeil1Preview.css";
import "./A2GoetheSpeakingMockTeil2Preview.css";
import "./A2GoetheSpeakingMockTeil3Preview.css";

const TASKS = [B2_SPEAKING.teil1, B2_SPEAKING.teil2];

const formatTime = (seconds) => {
  const safe = Math.max(0, Number(seconds) || 0);
  const minutes = String(Math.floor(safe / 60)).padStart(2, "0");
  const secs = String(safe % 60).padStart(2, "0");
  return `${minutes}:${secs}`;
};

const sanitizeAttempts = (attempts = {}) =>
  Object.fromEntries(
    Object.entries(attempts).map(([key, attempt]) => [
      key,
      {
        duration: Number(attempt?.duration || 0),
        transcript: String(attempt?.transcript || ""),
        analysisFeedback: String(attempt?.analysisFeedback || ""),
        submitted: Boolean(attempt?.submitted || attempt?.transcript),
      },
    ]),
  );

const presentationTheme = (themeId) =>
  B2_SPEAKING.teil1.themes.find((theme) => theme.id === themeId) || null;

const taskPrompt = (task, selectedTopic) => {
  if (task.id === "teil1") {
    const theme = presentationTheme(selectedTopic);
    return [
      "B2 Sprechen Teil 1 · Präsentation",
      theme ? `Thema: ${theme.title}` : "Thema nicht gewählt",
      theme?.prompt || "",
      task.instruction,
      "Bewerte Struktur, Argumentation, Beispiele, Kohäsion und B2-Sprachmittel.",
    ].filter(Boolean).join("\n");
  }

  return [
    "B2 Sprechen Teil 2 · Diskutieren / Standpunkte austauschen",
    `Thema: ${task.topic}`,
    ...task.points,
    task.simulationNote,
    "Bewerte Pro/Contra, Reaktion auf ein Gegenargument, höfliches Zustimmen/Widersprechen und ein klares Fazit.",
  ].join("\n");
};

export default function B2FinalMockSpeaking({
  externalSecondsLeft,
  initialAttempts = {},
  initialSelectedTopic = "",
  initialResult = null,
  onProgress,
  onComplete,
}) {
  const { idToken, user } = useAuth();
  const [attempts, setAttempts] = useState(() =>
    Object.fromEntries(
      Object.entries(initialAttempts || {}).map(([key, attempt]) => [
        key,
        { ...attempt, submitted: Boolean(attempt?.submitted || attempt?.transcript) },
      ]),
    ),
  );
  const [selectedTopic, setSelectedTopic] = useState(initialSelectedTopic || "");
  const [prepSeconds, setPrepSeconds] = useState(Number(B2_SPEAKING.teil1.prepSeconds || 900));
  const [prepRunning, setPrepRunning] = useState(false);
  const [recordingTaskId, setRecordingTaskId] = useState("");
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [marking, setMarking] = useState(false);
  const [result, setResult] = useState(initialResult);

  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const intervalRef = useRef(null);
  const attemptsRef = useRef({});
  const recordingSecondsRef = useRef(0);
  const timeoutAutoSubmitTaskIdRef = useRef("");
  const timeoutMarkTriggeredRef = useRef(false);

  const secondsLeft = Math.max(0, Number(externalSecondsLeft) || 0);

  useEffect(() => {
    attemptsRef.current = attempts;
    onProgress?.({
      attempts: sanitizeAttempts(attempts),
      selectedTopic,
      completedCount: TASKS.filter((task) => Boolean(attempts[task.id]?.transcript)).length,
    });
  }, [attempts, onProgress, selectedTopic]);

  useEffect(() => {
    if (!prepRunning || prepSeconds <= 0) return undefined;
    const timer = window.setInterval(() => {
      setPrepSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setPrepRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [prepRunning, prepSeconds]);

  useEffect(
    () => () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (recorderRef.current?.state === "recording") {
        try { recorderRef.current.stop(); } catch (_error) {}
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
      Object.values(attemptsRef.current).forEach((attempt) => revokeObjectUrl(attempt?.audioUrl));
    },
    [],
  );

  const completedCount = useMemo(
    () => TASKS.filter((task) => Boolean(attempts[task.id]?.transcript)).length,
    [attempts],
  );

  const hasInFlightSubmission = useMemo(
    () => TASKS.some((task) => Boolean(attempts[task.id]?.submitting)),
    [attempts],
  );

  const pendingRecordedTask = useMemo(
    () =>
      TASKS.find((task) => {
        const attempt = attempts[task.id];
        return Boolean(
          attempt?.audioBlob &&
          !attempt?.submitted &&
          !attempt?.submitting &&
          !attempt?.timeoutSubmissionFailed
        );
      }) || null,
    [attempts],
  );

  const hasUnsentRecording = useMemo(
    () =>
      Boolean(recordingTaskId) ||
      TASKS.some((task) => Boolean(attempts[task.id]?.audioBlob && !attempts[task.id]?.submitted)),
    [attempts, recordingTaskId],
  );

  useEffect(() => {
    if (!hasUnsentRecording) return undefined;

    const warnBeforeRefresh = (event) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", warnBeforeRefresh);
    return () => window.removeEventListener("beforeunload", warnBeforeRefresh);
  }, [hasUnsentRecording]);

  const clearRecorderTimer = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const stopTracks = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const startRecorder = async (task) => {
    if (secondsLeft <= 0 || recordingTaskId || attempts[task.id]?.submitted) return;
    if (task.id === "teil1" && !selectedTopic) {
      setError("Choose Thema 1 or Thema 2 before recording your presentation.");
      return;
    }

    setError("");
    setStatus("");
    setRecordingSeconds(0);
    recordingSecondsRef.current = 0;

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
        clearRecorderTimer();
        setRecordingTaskId("");
        const duration = recordingSecondsRef.current;
        try {
          if (duration < SPEAKING_AUDIO_MIN_SECONDS) {
            throw new Error(`Please record for at least ${SPEAKING_AUDIO_MIN_SECONDS} seconds.`);
          }
          const blob = buildRecordedAudioBlob(chunksRef.current, recorder);
          const audioUrl = URL.createObjectURL(blob);
          setAttempts((current) => {
            revokeObjectUrl(current[task.id]?.audioUrl);
            return {
              ...current,
              [task.id]: {
                ...current[task.id],
                audioBlob: blob,
                audioUrl,
                duration,
                transcript: "",
                analysisFeedback: "",
                submitted: false,
              },
            };
          });
          setStatus(`${task.title}: recording ready. Send it when you are satisfied.`);
        } catch (recordError) {
          setError(userFacingAudioError(recordError, recordError?.message || "No usable audio was captured."));
        } finally {
          setRecordingSeconds(0);
          recordingSecondsRef.current = 0;
          stopTracks();
        }
      };

      recorder.start(1000);
      setRecordingTaskId(task.id);
      intervalRef.current = window.setInterval(() => {
        recordingSecondsRef.current += 1;
        const next = recordingSecondsRef.current;
        setRecordingSeconds(next);
        if (next >= Number(task.maxRecordingSeconds || 300) && recorder.state === "recording") {
          recorder.stop();
        }
      }, 1000);
    } catch (recordError) {
      clearRecorderTimer();
      stopTracks();
      setRecordingTaskId("");
      setError(userFacingAudioError(recordError, recordError?.message || "Could not start the speaking task."));
    }
  };

  const stopRecording = () => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  };

  const submitTask = useCallback(async (task, { timeoutAuto = false } = {}) => {
    const attempt = attemptsRef.current[task.id];
    if (!attempt?.audioBlob || attempt.submitted || attempt.submitting) return;

    setError("");
    setStatus(`${task.title}: Falowen is listening and transcribing…`);
    setAttempts((current) => ({
      ...current,
      [task.id]: { ...current[task.id], submitting: true },
    }));

    try {
      const response = await analyzeAudio({
        audioBlob: attempt.audioBlob,
        teil: task.id.replace("teil", ""),
        level: "B2",
        contextType: "B2 full mock exam",
        question: taskPrompt(task, selectedTopic),
        interactionMode:
          task.id === "teil2"
            ? "single-candidate simulated B2 discussion"
            : "single-candidate B2 presentation",
        userId: user?.uid || "guest",
        idToken,
        timeoutMs: TIMED_MOCK_SPEAKING_ANALYZE_TIMEOUT_MS,
      });
      const transcript = String(response?.transcript || "").trim();
      if (!transcript) throw new Error("Falowen could not hear a clear answer. Please record this part again.");

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
      setStatus(`${task.title}: submitted. Continue to the next task.`);
    } catch (submitError) {
      setAttempts((current) => ({
        ...current,
        [task.id]: {
          ...current[task.id],
          submitting: false,
          timeoutSubmissionFailed: timeoutAuto,
        },
      }));
      setError(userFacingAudioError(submitError, submitError?.message || "Could not analyze this recording."));
    }
  }, [idToken, selectedTopic, user?.uid]);

  const resetRecording = (taskId) => {
    setAttempts((current) => {
      const target = current[taskId];
      if (!target || target.submitted) return current;
      revokeObjectUrl(target.audioUrl);
      const next = { ...current };
      delete next[taskId];
      return next;
    });
  };

  const markSpeaking = useCallback(async ({ force = false } = {}) => {
    if ((!force && completedCount !== TASKS.length) || marking || result) return;
    setMarking(true);
    setError("");
    setStatus("Falowen is marking your complete B2 Sprechen mock …");

    try {
      const assessment = await scoreB2MockSpeaking({
        attempts: TASKS.map((task) => ({
          id: task.id,
          teil: task.id.replace("teil", ""),
          task: taskPrompt(task, selectedTopic),
          transcript: attemptsRef.current[task.id]?.transcript || "",
          analysisFeedback: attemptsRef.current[task.id]?.analysisFeedback || "",
        })),
        idToken,
      });
      setResult(assessment);
      setStatus("Speaking result ready.");
      onComplete?.(assessment);
    } catch (markError) {
      setError(markError?.message || "Could not mark the complete B2 speaking mock.");
      setStatus("");
    } finally {
      setMarking(false);
    }
  }, [completedCount, idToken, marking, onComplete, result, selectedTopic]);

  useEffect(() => {
    if (secondsLeft > 0 || result || marking || timeoutMarkTriggeredRef.current) return;

    if (recordingTaskId) {
      if (recorderRef.current?.state === "recording") recorderRef.current.stop();
      return;
    }

    if (hasInFlightSubmission) return;

    if (pendingRecordedTask) {
      if (timeoutAutoSubmitTaskIdRef.current !== pendingRecordedTask.id) {
        timeoutAutoSubmitTaskIdRef.current = pendingRecordedTask.id;
        submitTask(pendingRecordedTask, { timeoutAuto: true });
      }
      return;
    }

    timeoutMarkTriggeredRef.current = true;
    markSpeaking({ force: true });
  }, [
    secondsLeft,
    result,
    marking,
    recordingTaskId,
    hasInFlightSubmission,
    pendingRecordedTask,
    submitTask,
    markSpeaking,
  ]);

  const presentationSubmitted = Boolean(attempts.teil1?.transcript);

  return (
    <article className="a1-goethe-mock-exam a1-sprechen-mock-exam">
      <header className="a1-goethe-mock-header">
        <p className="a1-goethe-mock-kicker">B2 · Sprechen</p>
        <h1>Teil 1–2</h1>
        <p>One presentation and one discussion simulation. Feedback stays hidden until the end.</p>
      </header>

      <div className="a1-sprechen-controlbar">
        <div><span className="a1-sprechen-control-label">Time left</span><strong>{formatTime(secondsLeft)}</strong></div>
        <div><span className="a1-sprechen-control-label">Progress</span><strong>{completedCount}/2 submitted</strong></div>
      </div>

      {hasUnsentRecording ? (
        <div
          role="alert"
          style={{
            margin: "12px 0",
            padding: 12,
            border: "1px solid #f59e0b",
            borderRadius: 10,
            background: "#fffbeb",
            color: "#92400e",
            lineHeight: 1.55,
          }}
        >
          <strong>Do not refresh yet.</strong> This recording is still only on this device. Send the answer first;
          after submission, the transcript and speaking result are autosaved and the raw audio is no longer needed.
        </div>
      ) : null}

      <section className="a1-sprechen-task">
        <div className="a1-sprechen-task-heading">
          <div><p className="a1-sprechen-part-kicker">Teil 1</p><h2>Präsentation</h2></div>
          <span>4 min max.</span>
        </div>

        <div className="a1-sprechen-prompt">
          <strong>Wählen Sie ein Thema.</strong>
          <div className="a2-sprechen-t1-cards" style={{ marginTop: 10 }}>
            {B2_SPEAKING.teil1.themes.map((theme) => (
              <button
                key={theme.id}
                type="button"
                className={selectedTopic === theme.id ? "a1-sprechen-primary" : "a1-sprechen-secondary"}
                onClick={() => !attempts.teil1?.submitted && setSelectedTopic(theme.id)}
                disabled={Boolean(attempts.teil1?.submitted)}
              >
                {theme.title}
              </button>
            ))}
          </div>

          {presentationTheme(selectedTopic) ? (
            <>
              <h3>{presentationTheme(selectedTopic).title}</h3>
              <p>{presentationTheme(selectedTopic).prompt}</p>
              <p>{B2_SPEAKING.teil1.instruction}</p>
            </>
          ) : null}

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginTop: 12 }}>
            <strong>Vorbereitung: {formatTime(prepSeconds)}</strong>
            {!prepRunning && prepSeconds > 0 ? (
              <button type="button" className="a1-sprechen-secondary" onClick={() => setPrepRunning(true)}>
                Start 15-minute preparation
              </button>
            ) : null}
            {prepRunning ? (
              <button
                type="button"
                className="a1-sprechen-secondary"
                onClick={() => {
                  setPrepRunning(false);
                  setPrepSeconds(0);
                }}
              >
                Start presentation now
              </button>
            ) : null}
          </div>
        </div>

        <Recorder
          task={B2_SPEAKING.teil1}
          attempt={attempts.teil1 || {}}
          active={recordingTaskId === "teil1"}
          recordingTaskId={recordingTaskId}
          recordingSeconds={recordingSeconds}
          secondsLeft={secondsLeft}
          prepRunning={prepRunning}
          startRecorder={startRecorder}
          stopRecording={stopRecording}
          resetRecording={resetRecording}
          submitTask={submitTask}
        />
      </section>

      <section className={presentationSubmitted ? "a1-sprechen-task" : "a1-sprechen-task a1-sprechen-task-locked"}>
        <div className="a1-sprechen-task-heading">
          <div><p className="a1-sprechen-part-kicker">Teil 2</p><h2>Diskutieren / Standpunkte austauschen</h2></div>
          <span>ca. 5 min</span>
        </div>

        <div className="a1-sprechen-prompt">
          <strong>{B2_SPEAKING.teil2.topic}</strong>
          <ul>{B2_SPEAKING.teil2.points.map((point) => <li key={point}>{point}</li>)}</ul>
          <p>{B2_SPEAKING.teil2.simulationNote}</p>
        </div>

        {!presentationSubmitted ? <p className="a1-sprechen-locked-note">Submit Teil 1 first.</p> : null}

        {presentationSubmitted ? (
          <Recorder
            task={B2_SPEAKING.teil2}
            attempt={attempts.teil2 || {}}
            active={recordingTaskId === "teil2"}
            recordingTaskId={recordingTaskId}
            recordingSeconds={recordingSeconds}
            secondsLeft={secondsLeft}
            prepRunning={false}
            startRecorder={startRecorder}
            stopRecording={stopRecording}
            resetRecording={resetRecording}
            submitTask={submitTask}
          />
        ) : null}
      </section>

      {status ? <p className="a1-sprechen-status">{status}</p> : null}
      {error ? <p className="a1-sprechen-error">{error}</p> : null}

      {completedCount === 2 && !result ? (
        <div className="a1-sprechen-final-action">
          <h2>Both speaking tasks are submitted.</h2>
          <p>Falowen will mark the complete B2 Sprechen mock.</p>
          <button type="button" className="a1-sprechen-primary" onClick={markSpeaking} disabled={marking}>
            {marking ? "Marking speaking …" : "Mark speaking"}
          </button>
        </div>
      ) : null}
    </article>
  );
}

function Recorder({
  task,
  attempt,
  active,
  recordingTaskId,
  recordingSeconds,
  secondsLeft,
  prepRunning,
  startRecorder,
  stopRecording,
  resetRecording,
  submitTask,
}) {
  return (
    <div className="a1-sprechen-recorder">
      <div className="a1-sprechen-recorder-actions">
        <button
          type="button"
          className={active ? "a1-sprechen-record a1-sprechen-recording" : "a1-sprechen-record"}
          onClick={() => active ? stopRecording() : startRecorder(task)}
          disabled={
            Boolean(recordingTaskId && !active) ||
            attempt.submitted ||
            secondsLeft <= 0 ||
            prepRunning
          }
        >
          {active ? "Stop recording" : attempt.audioBlob ? "Record again" : "Record answer"}
        </button>
        {active ? <strong>{formatTime(recordingSeconds)}</strong> : null}
        {attempt.audioBlob && !attempt.submitted ? (
          <button type="button" className="a1-sprechen-secondary" onClick={() => resetRecording(task.id)}>
            Delete recording
          </button>
        ) : null}
      </div>

      {attempt.audioUrl && !active ? (
        <audio className="a1-sprechen-audio" controls src={attempt.audioUrl} preload="metadata">
          Your browser does not support this audio.
        </audio>
      ) : null}

      {attempt.audioBlob && !attempt.submitted ? (
        <button type="button" className="a1-sprechen-primary" onClick={() => submitTask(task)} disabled={attempt.submitting}>
          {attempt.submitting ? "Sending …" : "Send answer"}
        </button>
      ) : null}

      {attempt.submitted ? (
        <div className="a1-sprechen-submitted">
          <strong>Submitted</strong>
          <p>Falowen received this response.</p>
        </div>
      ) : null}
    </div>
  );
}
