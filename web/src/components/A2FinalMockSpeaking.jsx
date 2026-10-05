import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { analyzeAudio, scoreA2MockSpeaking } from "../services/coachService";
import {
  SPEAKING_AUDIO_MIN_SECONDS,
  buildRecordedAudioBlob,
  createSpeakingMediaRecorder,
  revokeObjectUrl,
  userFacingAudioError,
} from "../lib/speakingAudio";
import { A2_GOETHE_SPEAKING_TEIL1 } from "./A2GoetheSpeakingMockTeil1Preview";
import { A2_GOETHE_SPEAKING_TEIL2 } from "./A2GoetheSpeakingMockTeil2Preview";
import { A2_GOETHE_SPEAKING_TEIL3 } from "./A2GoetheSpeakingMockTeil3Preview";
import "./A1GoetheSpeakingMockPreview.css";
import "./A2GoetheSpeakingMockTeil1Preview.css";
import "./A2GoetheSpeakingMockTeil2Preview.css";
import "./A2GoetheSpeakingMockTeil3Preview.css";

const TASKS = Object.freeze([
  {
    id: "teil1_questions",
    teil: "1",
    title: "Teil 1 · Ask four questions",
    prompt: `Use the four keywords ${A2_GOETHE_SPEAKING_TEIL1.keywords.join(", ")}. Ask one suitable A2 question for each keyword.`,
    maxRecordingSeconds: A2_GOETHE_SPEAKING_TEIL1.maxQuestionRecordingSeconds,
  },
  {
    id: "teil1_answers",
    teil: "1",
    title: "Teil 1 · Answer your partner",
    prompt: `Answer all four partner questions in complete German sentences: ${A2_GOETHE_SPEAKING_TEIL1.partnerQuestions.join(" | ")}`,
    maxRecordingSeconds: A2_GOETHE_SPEAKING_TEIL1.maxAnswerRecordingSeconds,
  },
  {
    id: "teil2_main",
    teil: "2",
    title: "Teil 2 · Wochenende",
    prompt: `${A2_GOETHE_SPEAKING_TEIL2.prompt} Stichwörter: ${A2_GOETHE_SPEAKING_TEIL2.keywords
      .map((item) => `${item.label} (${item.question})`)
      .join(", ")}`,
    maxRecordingSeconds: A2_GOETHE_SPEAKING_TEIL2.maxMainRecordingSeconds,
  },
  {
    id: "teil2_followup",
    teil: "2",
    title: "Teil 2 · Nachfrage",
    prompt: A2_GOETHE_SPEAKING_TEIL2.followUp,
    maxRecordingSeconds: A2_GOETHE_SPEAKING_TEIL2.maxFollowUpRecordingSeconds,
  },
  {
    id: "teil3",
    teil: "3",
    title: "Teil 3 · Gemeinsam planen",
    prompt: `${A2_GOETHE_SPEAKING_TEIL3.situation} Partner: ${A2_GOETHE_SPEAKING_TEIL3.partner} ${A2_GOETHE_SPEAKING_TEIL3.prompt} Punkte: ${A2_GOETHE_SPEAKING_TEIL3.points.join(" | ")} ${A2_GOETHE_SPEAKING_TEIL3.finalRequirement}`,
    maxRecordingSeconds: A2_GOETHE_SPEAKING_TEIL3.maxRecordingSeconds,
  },
]);

const formatTime = (seconds) => {
  const safe = Math.max(0, Number(seconds) || 0);
  const minutes = String(Math.floor(safe / 60)).padStart(2, "0");
  const secs = String(safe % 60).padStart(2, "0");
  return `${minutes}:${secs}`;
};

const sanitizeAttemptsForPersistence = (attempts = {}) =>
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

const TaskPrompt = ({ task }) => {
  if (task.id === "teil1_questions") {
    return (
      <>
        <div className="a2-sprechen-t1-cards">
          {A2_GOETHE_SPEAKING_TEIL1.keywords.map((keyword) => <strong key={keyword}>{keyword}</strong>)}
        </div>
        <p>Ask one suitable question for each card.</p>
      </>
    );
  }

  if (task.id === "teil1_answers") {
    return (
      <ol className="a2-sprechen-t1-partner">
        {A2_GOETHE_SPEAKING_TEIL1.partnerQuestions.map((question) => <li key={question}>{question}</li>)}
      </ol>
    );
  }

  if (task.id === "teil2_main") {
    return (
      <>
        <section className="a2-sprechen-t2-card">
          <div className="a2-sprechen-t2-card-heading">
            <span>Thema</span>
            <strong>{A2_GOETHE_SPEAKING_TEIL2.topic}</strong>
          </div>
          <p className="a2-sprechen-t2-prompt">{A2_GOETHE_SPEAKING_TEIL2.prompt}</p>
          <div className="a2-sprechen-t2-keywords">
            {A2_GOETHE_SPEAKING_TEIL2.keywords.map((item, index) => (
              <div key={item.label}>
                <span>{index + 1}</span>
                <strong>{item.label}</strong>
                <small>{item.question}</small>
              </div>
            ))}
          </div>
        </section>
      </>
    );
  }

  if (task.id === "teil2_followup") {
    return <p className="a2-sprechen-followup"><strong>{A2_GOETHE_SPEAKING_TEIL2.followUp}</strong></p>;
  }

  return (
    <>
      <section className="a2-sprechen-t3-situation">
        <span>Situation</span>
        <h2>{A2_GOETHE_SPEAKING_TEIL3.situation}</h2>
      </section>
      <section className="a2-sprechen-t3-partner">
        <span>Your partner says</span>
        <blockquote>„{A2_GOETHE_SPEAKING_TEIL3.partner}“</blockquote>
      </section>
      <div className="a2-sprechen-t3-points">
        {A2_GOETHE_SPEAKING_TEIL3.points.map((point, index) => (
          <div key={point}>
            <span>{index + 1}</span>
            <strong>{point}</strong>
          </div>
        ))}
      </div>
      <p>{A2_GOETHE_SPEAKING_TEIL3.finalRequirement}</p>
    </>
  );
};

export default function A2FinalMockSpeaking({
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
        {
          ...attempt,
          submitted: Boolean(attempt?.submitted || attempt?.transcript),
        },
      ]),
    ),
  );
  const [recordingTaskId, setRecordingTaskId] = useState("");
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [marking, setMarking] = useState(false);
  const [timedOutMarkFailed, setTimedOutMarkFailed] = useState(false);
  const [result, setResult] = useState(initialResult);

  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const intervalRef = useRef(null);
  const recordingSecondsRef = useRef(0);
  const attemptsRef = useRef({});
  const timeoutMarkTriggeredRef = useRef(false);

  const secondsLeft = Math.max(0, Number(externalSecondsLeft) || 0);

  useEffect(() => {
    attemptsRef.current = attempts;
    if (typeof onProgress === "function") {
      onProgress({
        attempts: sanitizeAttemptsForPersistence(attempts),
        completedCount: TASKS.filter((task) => Boolean(attempts[task.id]?.transcript)).length,
      });
    }
  }, [attempts, onProgress]);

  useEffect(
    () => () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (recorderRef.current?.state === "recording") {
        try {
          recorderRef.current.stop();
        } catch (_error) {
          // Recorder can already be stopping during navigation.
        }
      }
      if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop());
      Object.values(attemptsRef.current).forEach((attempt) => revokeObjectUrl(attempt?.audioUrl));
    },
    [],
  );

  useEffect(() => {
    if (secondsLeft > 0 || !recordingTaskId) return;
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  }, [secondsLeft, recordingTaskId]);

  const completedCount = useMemo(
    () => TASKS.filter((task) => Boolean(attempts[task.id]?.transcript)).length,
    [attempts],
  );

  const hasInFlightSubmission = useMemo(
    () => TASKS.some((task) => Boolean(attempts[task.id]?.submitting)),
    [attempts],
  );

  const isUnlocked = (index) => {
    if (index === 0) return true;
    return Boolean(attempts[TASKS[index - 1].id]?.transcript);
  };

  const clearTimer = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const stopTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = async (task) => {
    if (secondsLeft <= 0 || recordingTaskId || attempts[task.id]?.submitted) return;
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
        clearTimer();
        setRecordingTaskId("");
        const duration = recordingSecondsRef.current;
        try {
          if (duration < SPEAKING_AUDIO_MIN_SECONDS) {
            throw new Error(`Please record for at least ${SPEAKING_AUDIO_MIN_SECONDS} seconds.`);
          }
          const blob = buildRecordedAudioBlob(chunksRef.current, recorder);
          const audioUrl = URL.createObjectURL(blob);
          setAttempts((current) => {
            if (current[task.id]?.audioUrl) revokeObjectUrl(current[task.id].audioUrl);
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
          setStatus(`${task.title}: recording ready. Listen once, then send it.`);
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
        if (next >= task.maxRecordingSeconds && recorder.state === "recording") recorder.stop();
      }, 1000);
    } catch (recordError) {
      stopTracks();
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
        level: "A2",
        contextType: "A2 full mock exam",
        question: task.prompt,
        interactionMode: "single-candidate A2 mock",
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
      setStatus(`${task.title}: submitted. Continue to the next task.`);
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

  const markSpeaking = useCallback(async ({ force = false } = {}) => {
    if ((!force && completedCount !== TASKS.length) || marking || result) return;
    setMarking(true);
    setTimedOutMarkFailed(false);
    setError("");
    setStatus("Falowen is marking your complete A2 Sprechen mock …");

    try {
      const assessment = await scoreA2MockSpeaking({
        attempts: TASKS.map((task) => ({
          id: task.id,
          teil: task.teil,
          task: task.prompt,
          transcript: attemptsRef.current[task.id]?.transcript || "",
          analysisFeedback: attemptsRef.current[task.id]?.analysisFeedback || "",
        })),
        attemptId,
        idToken,
      });
      setResult(assessment);
      setStatus("Speaking result ready.");
      if (typeof onComplete === "function") onComplete(assessment);
    } catch (markError) {
      setError(markError?.message || "Could not mark the complete A2 speaking mock.");
      if (force && secondsLeft <= 0) setTimedOutMarkFailed(true);
      setStatus("");
    } finally {
      setMarking(false);
    }
  }, [attemptId, completedCount, idToken, marking, onComplete, result, secondsLeft]);

  useEffect(() => {
    if (
      secondsLeft > 0 ||
      result ||
      marking ||
      hasInFlightSubmission ||
      timeoutMarkTriggeredRef.current
    ) {
      return;
    }
    timeoutMarkTriggeredRef.current = true;
    markSpeaking({ force: true });
  }, [secondsLeft, result, marking, hasInFlightSubmission, markSpeaking]);

  return (
    <article className="a1-goethe-mock-exam a1-sprechen-mock-exam">
      <header className="a1-goethe-mock-header">
        <p className="a1-goethe-mock-kicker">A2 · Sprechen</p>
        <h1>Teil 1–3</h1>
        <p>Record all five required responses in German. Feedback stays hidden until the full mock is complete.</p>
      </header>

      <div className="a1-sprechen-controlbar">
        <div>
          <span className="a1-sprechen-control-label">Time left</span>
          <strong className={secondsLeft <= 120 ? "a1-sprechen-timer a1-sprechen-timer-warning" : "a1-sprechen-timer"}>
            {formatTime(secondsLeft)}
          </strong>
        </div>
        <div>
          <span className="a1-sprechen-control-label">Progress</span>
          <strong>{completedCount}/{TASKS.length} responses submitted</strong>
        </div>
      </div>

      {TASKS.map((task, index) => {
        const attempt = attempts[task.id] || {};
        const unlocked = isUnlocked(index);
        const currentlyRecording = recordingTaskId === task.id;
        return (
          <section
            className={unlocked ? "a1-sprechen-task" : "a1-sprechen-task a1-sprechen-task-locked"}
            key={task.id}
          >
            <div className="a1-sprechen-task-heading">
              <div>
                <p className="a1-sprechen-part-kicker">Teil {task.teil}</p>
                <h2>{task.title.replace(/^Teil \d+ · /, "")}</h2>
              </div>
              <span>{task.maxRecordingSeconds} sec max.</span>
            </div>

            <div className="a1-sprechen-prompt">
              <strong>Task</strong>
              <TaskPrompt task={task} />
            </div>

            {!unlocked ? <p className="a1-sprechen-locked-note">Submit the previous response first.</p> : null}

            {unlocked ? (
              <div className="a1-sprechen-recorder">
                <div className="a1-sprechen-recorder-actions">
                  <button
                    type="button"
                    className={currentlyRecording ? "a1-sprechen-record a1-sprechen-recording" : "a1-sprechen-record"}
                    onClick={() => (currentlyRecording ? stopRecording() : startRecording(task))}
                    disabled={Boolean(recordingTaskId && !currentlyRecording) || attempt.submitted || secondsLeft <= 0}
                  >
                    {currentlyRecording ? "Stop recording" : attempt.audioBlob ? "Record again" : "Record answer"}
                  </button>
                  {currentlyRecording ? <strong>{formatTime(recordingSeconds)}</strong> : null}
                  {attempt.audioUrl && !attempt.submitted ? (
                    <button type="button" className="a1-sprechen-secondary" onClick={() => resetUnsubmittedRecording(task.id)}>
                      Delete recording
                    </button>
                  ) : null}
                </div>

                {attempt.audioUrl ? (
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
                    <p>Falowen received this response. Feedback stays hidden until the end of the exam.</p>
                  </div>
                ) : null}
              </div>
            ) : null}
          </section>
        );
      })}

      {status ? <p className="a1-sprechen-status">{status}</p> : null}
      {error ? <p className="a1-sprechen-error">{error}</p> : null}

      {timedOutMarkFailed && !result ? (
        <div className="a1-sprechen-final-action">
          <h2>Marking could not finish.</h2>
          <p>Your speaking time has ended, but submitted transcripts are saved. Retry the final marking without recording again.</p>
          <button type="button" className="a1-sprechen-primary" onClick={() => markSpeaking({ force: true })} disabled={marking}>
            {marking ? "Marking speaking …" : "Retry speaking marking"}
          </button>
        </div>
      ) : null}

      {completedCount === TASKS.length && !result && !timedOutMarkFailed ? (
        <div className="a1-sprechen-final-action">
          <h2>All speaking responses are submitted.</h2>
          <p>Falowen will now mark Teil 1, Teil 2 and Teil 3 together at A2 standard.</p>
          <button type="button" className="a1-sprechen-primary" onClick={() => markSpeaking()} disabled={marking}>
            {marking ? "Marking speaking …" : "Mark speaking"}
          </button>
        </div>
      ) : null}
    </article>
  );
}
