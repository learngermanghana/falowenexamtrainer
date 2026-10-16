import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  TIMED_MOCK_SPEAKING_ANALYZE_TIMEOUT_MS,
  analyzeAudio,
  scoreB1MockSpeaking,
} from "../services/coachService";
import { fetchB1MockAudioPlaybackUrl } from "../services/b1AudioService";
import {
  SPEAKING_AUDIO_MIN_SECONDS,
  buildRecordedAudioBlob,
  createSpeakingMediaRecorder,
  revokeObjectUrl,
  userFacingAudioError,
} from "../lib/speakingAudio";
import { B1_SPEAKING } from "../data/b1FinalMockData";
import "./A1GoetheSpeakingMockPreview.css";
import "./A2GoetheSpeakingMockTeil1Preview.css";
import "./A2GoetheSpeakingMockTeil2Preview.css";
import "./A2GoetheSpeakingMockTeil3Preview.css";

const TASKS = [B1_SPEAKING.teil1, B1_SPEAKING.teil2, B1_SPEAKING.teil3];

const formatTime = (seconds) => {
  const safe = Math.max(0, Number(seconds) || 0);
  const minutes = String(Math.floor(safe / 60)).padStart(2, "0");
  const secs = String(safe % 60).padStart(2, "0");
  return `${minutes}:${secs}`;
};

const taskPrompt = (task) => {
  if (task.id === "teil1") {
    return [
      task.situation,
      "Planungspunkte:",
      ...task.points,
      task.instruction,
      "Bewerte vor allem Interaktion, Vorschläge, Reaktionen und ob die Planungspunkte sinnvoll abgedeckt wurden.",
    ].join("\n");
  }
  if (task.id === "teil2") {
    return [
      `Thema: ${task.topic}`,
      ...task.points,
      "Der Lernende hält eine zusammenhängende B1-Präsentation.",
    ].join("\n");
  }
  return task.prompt;
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

export default function B1FinalMockSpeaking({
  externalSecondsLeft,
  initialAttempts = {},
  initialResult = null,
  attemptId = "",
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
  const [recordingTaskId, setRecordingTaskId] = useState("");
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [marking, setMarking] = useState(false);
  const [result, setResult] = useState(initialResult);
  const [partnerAudioUrl, setPartnerAudioUrl] = useState("");
  const [partnerAudioLoading, setPartnerAudioLoading] = useState(false);
  const [prepSeconds, setPrepSeconds] = useState(Number(B1_SPEAKING.teil2.prepSeconds || 300));
  const [prepRunning, setPrepRunning] = useState(false);

  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const intervalRef = useRef(null);
  const partnerAudioRef = useRef(null);
  const attemptsRef = useRef({});
  const recordingSecondsRef = useRef(0);
  const timeoutAutoSubmitTaskIdRef = useRef("");
  const timeoutMarkTriggeredRef = useRef(false);
  const timeoutMarkRetryTimerRef = useRef(null);
  const timeoutMarkRetryCountRef = useRef(0);
  const [timeoutMarkRetryNonce, setTimeoutMarkRetryNonce] = useState(0);

  const secondsLeft = Math.max(0, Number(externalSecondsLeft) || 0);

  useEffect(() => {
    attemptsRef.current = attempts;
    onProgress?.({
      attempts: sanitizeAttempts(attempts),
      completedCount: TASKS.filter((task) => Boolean(attempts[task.id]?.transcript)).length,
    });
  }, [attempts, onProgress]);

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
      if (timeoutMarkRetryTimerRef.current) window.clearTimeout(timeoutMarkRetryTimerRef.current);
      if (recorderRef.current?.state === "recording") {
        try { recorderRef.current.stop(); } catch (_error) {}
      }
      if (partnerAudioRef.current) partnerAudioRef.current.pause();
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
    () => TASKS.find((task) => {
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

  const isUnlocked = (index) => index === 0 || Boolean(attempts[TASKS[index - 1].id]?.transcript);

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

  const preparePartnerAudio = useCallback(async () => {
    if (partnerAudioUrl) return partnerAudioUrl;
    setPartnerAudioLoading(true);
    try {
      const response = await fetchB1MockAudioPlaybackUrl({
        mockId: "mock-01",
        part: "sprechen-teil-1",
        key: B1_SPEAKING.teil1.audioObjectKey,
        idToken,
      });
      setPartnerAudioUrl(response.url);
      return response.url;
    } finally {
      setPartnerAudioLoading(false);
    }
  }, [idToken, partnerAudioUrl]);

  const startRecorder = async (task, { playPartner = false } = {}) => {
    if (secondsLeft <= 0 || recordingTaskId || attempts[task.id]?.submitted) return;
    setError("");
    setStatus("");
    setRecordingSeconds(0);
    recordingSecondsRef.current = 0;

    try {
      const partnerUrl = playPartner ? await preparePartnerAudio() : "";
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
        if (next >= Number(task.maxRecordingSeconds || 180) && recorder.state === "recording") {
          if (partnerAudioRef.current) partnerAudioRef.current.pause();
          recorder.stop();
        }
      }, 1000);

      if (playPartner && partnerAudioRef.current) {
        partnerAudioRef.current.src = partnerUrl;
        partnerAudioRef.current.currentTime = 0;
        partnerAudioRef.current.onended = () => {
          if (recorder.state === "recording") recorder.stop();
        };
        try {
          await partnerAudioRef.current.play();
          setStatus("Partner audio is playing. Keep your microphone active and answer during each speaking window.");
        } catch (playError) {
          if (recorder.state === "recording") recorder.stop();
          throw playError;
        }
      }
    } catch (recordError) {
      clearRecorderTimer();
      stopTracks();
      setRecordingTaskId("");
      setError(userFacingAudioError(recordError, recordError?.message || "Could not start the speaking task."));
    }
  };

  const stopRecording = () => {
    if (partnerAudioRef.current) partnerAudioRef.current.pause();
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
        level: "B1",
        contextType: "B1 full mock exam",
        question: taskPrompt(task),
        interactionMode: task.id === "teil1" ? "single-candidate simulated partner planning" : "single-candidate B1 mock",
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
  }, [idToken, user?.uid]);

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
    if ((!force && completedCount !== TASKS.length) || marking || result || hasUnsentRecording || hasInFlightSubmission) return;
    setMarking(true);
    setError("");
    setStatus("Falowen is marking your complete B1 Sprechen mock …");
    try {
      const assessment = await scoreB1MockSpeaking({
        attempts: TASKS.map((task) => ({
          id: task.id,
          teil: task.id.replace("teil", ""),
          task: taskPrompt(task),
          transcript: attemptsRef.current[task.id]?.transcript || "",
          analysisFeedback: attemptsRef.current[task.id]?.analysisFeedback || "",
        })),
        attemptId,
        idToken,
      });
      if (timeoutMarkRetryTimerRef.current) {
        window.clearTimeout(timeoutMarkRetryTimerRef.current);
        timeoutMarkRetryTimerRef.current = null;
      }
      timeoutMarkRetryCountRef.current = 0;
      setResult(assessment);
      setStatus("Speaking result ready.");
      onComplete?.(assessment);
    } catch (markError) {
      setError(markError?.message || "Could not mark the complete B1 speaking mock.");
      setStatus("");
      if (secondsLeft <= 0 && timeoutMarkRetryCountRef.current < 3) {
        const delay = [5000, 15000, 30000][timeoutMarkRetryCountRef.current];
        timeoutMarkRetryCountRef.current += 1;
        if (timeoutMarkRetryTimerRef.current) window.clearTimeout(timeoutMarkRetryTimerRef.current);
        timeoutMarkRetryTimerRef.current = window.setTimeout(() => {
          timeoutMarkRetryTimerRef.current = null;
          timeoutMarkTriggeredRef.current = false;
          setTimeoutMarkRetryNonce((value) => value + 1);
        }, delay);
      }
    } finally {
      setMarking(false);
    }
  }, [attemptId, completedCount, idToken, marking, onComplete, result, secondsLeft,
    hasUnsentRecording, hasInFlightSubmission]);

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

    // Never grade an expired mock while unsent audio is still recoverable.
    // If automatic transcription failed, the learner can retry sending it.
    if (hasUnsentRecording) return;
    timeoutMarkTriggeredRef.current = true;
    markSpeaking({ force: true });
  }, [
    secondsLeft,
    result,
    marking,
    recordingTaskId,
    hasInFlightSubmission,
    pendingRecordedTask,
    hasUnsentRecording,
    timeoutMarkRetryNonce,
    submitTask,
    markSpeaking,
  ]);

  return (
    <article className="a1-goethe-mock-exam a1-sprechen-mock-exam">
      <audio ref={partnerAudioRef} preload="metadata" />
      <header className="a1-goethe-mock-header">
        <p className="a1-goethe-mock-kicker">B1 · Sprechen</p>
        <h1>Aufgabe 1–3</h1>
        <p>Complete one planning conversation, one presentation and one reaction. Feedback stays hidden until the end.</p>
      </header>

      <div className="a1-sprechen-controlbar">
        <div><span className="a1-sprechen-control-label">Time left</span><strong>{formatTime(secondsLeft)}</strong></div>
        <div><span className="a1-sprechen-control-label">Progress</span><strong>{completedCount}/3 submitted</strong></div>
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

      {TASKS.map((task, index) => {
        const attempt = attempts[task.id] || {};
        const unlocked = isUnlocked(index);
        const active = recordingTaskId === task.id;
        return (
          <section className={unlocked ? "a1-sprechen-task" : "a1-sprechen-task a1-sprechen-task-locked"} key={task.id}>
            <div className="a1-sprechen-task-heading">
              <div><p className="a1-sprechen-part-kicker">Teil {index + 1}</p><h2>{task.title.replace(/^Aufgabe \d+ · /, "")}</h2></div>
              <span>{task.id === "teil1" ? "Partner simulation" : `${Math.round(task.maxRecordingSeconds / 60)} min max.`}</span>
            </div>

            <div className="a1-sprechen-prompt">
              {task.id === "teil1" ? (
                <>
                  <strong>Überraschungsparty planen</strong>
                  <p>{task.situation}</p>
                  <div className="a2-sprechen-t1-cards">{task.points.map((point) => <strong key={point}>{point}</strong>)}</div>
                  <p>{task.instruction}</p>
                </>
              ) : null}

              {task.id === "teil2" ? (
                <>
                  <strong>Thema A</strong>
                  <h3>{task.topic}</h3>
                  <ul>{task.points.map((point) => <li key={point}>{point}</li>)}</ul>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <strong>Vorbereitung: {formatTime(prepSeconds)}</strong>
                    {!prepRunning && prepSeconds > 0 ? (
                      <button type="button" className="a1-sprechen-secondary" onClick={() => setPrepRunning(true)}>
                        Start 5-minute preparation
                      </button>
                    ) : null}
                    {prepRunning ? (
                      <button type="button" className="a1-sprechen-secondary" onClick={() => { setPrepRunning(false); setPrepSeconds(0); }}>
                        Start presentation now
                      </button>
                    ) : null}
                  </div>
                </>
              ) : null}

              {task.id === "teil3" ? (
                <>
                  <strong>Reagieren Sie.</strong>
                  <p>{task.prompt}</p>
                </>
              ) : null}
            </div>

            {!unlocked ? <p className="a1-sprechen-locked-note">Submit the previous task first.</p> : null}

            {unlocked ? (
              <div className="a1-sprechen-recorder">
                <div className="a1-sprechen-recorder-actions">
                  <button
                    type="button"
                    className={active ? "a1-sprechen-record a1-sprechen-recording" : "a1-sprechen-record"}
                    onClick={() => active ? stopRecording() : startRecorder(task, { playPartner: task.id === "teil1" })}
                    disabled={
                      Boolean(recordingTaskId && !active) ||
                      attempt.submitted ||
                      secondsLeft <= 0 ||
                      partnerAudioLoading ||
                      (task.id === "teil2" && prepRunning)
                    }
                  >
                    {active
                      ? "Stop recording"
                      : partnerAudioLoading
                        ? "Preparing partner audio …"
                        : task.id === "teil1"
                          ? "Start conversation + recording"
                          : attempt.audioBlob
                            ? "Record again"
                            : "Record answer"}
                  </button>
                  {active ? <strong>{formatTime(recordingSeconds)}</strong> : null}
                  {attempt.audioBlob && !attempt.submitted ? (
                    <button type="button" className="a1-sprechen-secondary" onClick={() => resetRecording(task.id)}>Delete recording</button>
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
                  <div className="a1-sprechen-submitted"><strong>Submitted</strong><p>Falowen received this response.</p></div>
                ) : null}
              </div>
            ) : null}
          </section>
        );
      })}

      {secondsLeft === 0 && !result ? (
        <p className="a1-sprechen-status" role="status">
          Speaking time has ended. Falowen is submitting recorded answers and marking this section.
          {hasUnsentRecording ? " A recording still needs to be sent; use Send answer to retry." :
            " If marking fails, your saved transcripts remain available for retry."}
        </p>
      ) : null}
      {status ? <p className="a1-sprechen-status">{status}</p> : null}
      {error ? <p className="a1-sprechen-error">{error}</p> : null}

      {(completedCount === 3 || secondsLeft === 0) && !result ? (
        <div className="a1-sprechen-final-action">
          <h2>{secondsLeft === 0 ? "Sprechen time has ended." : "All speaking tasks are submitted."}</h2>
          <p>{hasUnsentRecording
            ? "Send the remaining recorded answer before Falowen can finalise Sprechen."
            : "Falowen will mark all three speaking tasks together. Missing answers remain unanswered."}</p>
          <button type="button" className="a1-sprechen-primary"
            onClick={() => markSpeaking({ force: secondsLeft === 0 })}
            disabled={marking || hasUnsentRecording || hasInFlightSubmission}>
            {marking ? "Marking speaking …" : secondsLeft === 0 ? "Retry automatic Sprechen submission" : "Mark speaking"}
          </button>
        </div>
      ) : null}
    </article>
  );
}
