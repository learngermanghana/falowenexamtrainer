import React, { useEffect, useRef, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import {
  SPEAKING_AUDIO_MIN_SECONDS,
  buildRecordedAudioBlob,
  createSpeakingMediaRecorder,
  revokeObjectUrl,
  userFacingAudioError,
} from "../lib/speakingAudio";
import "./A1GoetheReadingMockTeil1Preview.css";
import "./A2GoetheSpeakingMockTeil1Preview.css";

export const A2_GOETHE_SPEAKING_TEIL1 = Object.freeze({
  title: "Teil 1",
  keywords: ["Wohnort", "Familie", "Hobby", "Beruf"],
  partnerQuestions: [
    "Wo wohnst du? Und wie gefällt es dir dort?",
    "Hast du Geschwister? Erzähl mir ein bisschen von deiner Familie.",
    "Was machst du in deiner Freizeit? Wie oft machst du das?",
    "Was bist du von Beruf, oder was lernst du gerade? Was möchtest du später machen?",
  ],
  maxQuestionRecordingSeconds: 90,
  maxAnswerRecordingSeconds: 120,
});

const useRecorder = () => {
  const [recordingId, setRecordingId] = useState("");
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordings, setRecordings] = useState({});
  const [error, setError] = useState("");
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const secondsRef = useRef(0);
  const timerRef = useRef(null);
  const mountedRef = useRef(true);
  const recordingsRef = useRef({});

  const cleanup = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
    if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cleanup();

      const recorder = recorderRef.current;
      if (recorder) {
        recorder.ondataavailable = null;
        recorder.onstop = null;
        if (recorder.state === "recording") {
          try {
            recorder.stop();
          } catch {
            // Recorder may already be stopping while navigating away.
          }
        }
        recorderRef.current = null;
      }

      Object.values(recordingsRef.current).forEach((item) => {
        if (item?.url) revokeObjectUrl(item.url);
      });
      recordingsRef.current = {};
    };
  }, []);

  const start = async ({ id, maxSeconds }) => {
    setError("");
    secondsRef.current = 0;
    setRecordingSeconds(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      });
      if (!mountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = createSpeakingMediaRecorder(stream);
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data?.size) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        cleanup();
        if (!mountedRef.current) return;
        setRecordingId("");
        const duration = secondsRef.current;
        try {
          if (duration < SPEAKING_AUDIO_MIN_SECONDS) {
            throw new Error(`Please record for at least ${SPEAKING_AUDIO_MIN_SECONDS} seconds.`);
          }
          const blob = buildRecordedAudioBlob(chunksRef.current, recorder);
          const url = URL.createObjectURL(blob);
          setRecordings((current) => {
            if (current[id]?.url) revokeObjectUrl(current[id].url);
            const next = { ...current, [id]: { blob, url, duration } };
            recordingsRef.current = next;
            return next;
          });
        } catch (recordError) {
          setError(userFacingAudioError(recordError, recordError?.message || "No usable audio was captured."));
        }
      };

      recorder.start(1000);
      setRecordingId(id);
      timerRef.current = window.setInterval(() => {
        secondsRef.current += 1;
        setRecordingSeconds(secondsRef.current);
        if (secondsRef.current >= maxSeconds && recorder.state === "recording") recorder.stop();
      }, 1000);
    } catch (recordError) {
      cleanup();
      if (mountedRef.current) {
        setError(recordError?.message || "Microphone access was blocked.");
      }
    }
  };

  const stop = () => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  };

  return { recordingId, recordingSeconds, recordings, error, start, stop };
};

const formatTime = (seconds) => {
  const safe = Math.max(0, Number(seconds) || 0);
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
};

export default function A2GoetheSpeakingMockTeil1Preview() {
  const recorder = useRecorder();
  const [questionsSubmitted, setQuestionsSubmitted] = useState(false);
  const [answersSubmitted, setAnswersSubmitted] = useState(false);

  const questions = recorder.recordings.questions;
  const answers = recorder.recordings.answers;

  return (
    <main className="a1-goethe-mock-shell">
      <div className="a1-goethe-mock-topbar">
        <AppBackButton label="Back to A2 Mock Preview" fallbackPath="/campus/course/a2-mock-practice-preview" />
        <span className="a1-goethe-mock-preview-badge">A2 Sprechen · Teil 1</span>
      </div>

      <article className="a1-goethe-mock-exam a2-sprechen-t1-exam">
        <header className="a1-goethe-mock-header">
          <p className="a1-goethe-mock-kicker">A2 · Sprechen</p>
          <h1>Teil 1</h1>
          <p>Ask your partner questions and answer personal questions in German.</p>
        </header>

        <section className="a2-sprechen-t1-stage">
          <span>Stage 1</span>
          <h2>Ask four questions</h2>
          <p>Use each keyword once. Ask one suitable question for each card.</p>
          <div className="a2-sprechen-t1-cards">
            {A2_GOETHE_SPEAKING_TEIL1.keywords.map((keyword) => <strong key={keyword}>{keyword}</strong>)}
          </div>
          <button
            type="button"
            onClick={() =>
              recorder.recordingId === "questions"
                ? recorder.stop()
                : recorder.start({ id: "questions", maxSeconds: A2_GOETHE_SPEAKING_TEIL1.maxQuestionRecordingSeconds })
            }
            disabled={questionsSubmitted || Boolean(recorder.recordingId && recorder.recordingId !== "questions")}
          >
            {recorder.recordingId === "questions" ? "Stop recording" : questions ? "Record again" : "Record questions"}
          </button>
          {recorder.recordingId === "questions" ? <strong>{formatTime(recorder.recordingSeconds)}</strong> : null}
          {questions ? <audio controls src={questions.url} preload="metadata" /> : null}
          {questions && !questionsSubmitted ? (
            <button type="button" onClick={() => setQuestionsSubmitted(true)}>Send questions</button>
          ) : null}
        </section>

        <section className={questionsSubmitted ? "a2-sprechen-t1-stage" : "a2-sprechen-t1-stage locked"}>
          <span>Stage 2</span>
          <h2>Answer your partner</h2>
          <p>Answer all four partner questions in complete German sentences.</p>
          <ol className="a2-sprechen-t1-partner">
            {A2_GOETHE_SPEAKING_TEIL1.partnerQuestions.map((question) => <li key={question}>{question}</li>)}
          </ol>
          {questionsSubmitted ? (
            <>
              <button
                type="button"
                onClick={() =>
                  recorder.recordingId === "answers"
                    ? recorder.stop()
                    : recorder.start({ id: "answers", maxSeconds: A2_GOETHE_SPEAKING_TEIL1.maxAnswerRecordingSeconds })
                }
                disabled={answersSubmitted || Boolean(recorder.recordingId && recorder.recordingId !== "answers")}
              >
                {recorder.recordingId === "answers" ? "Stop recording" : answers ? "Record again" : "Record answers"}
              </button>
              {recorder.recordingId === "answers" ? <strong>{formatTime(recorder.recordingSeconds)}</strong> : null}
              {answers ? <audio controls src={answers.url} preload="metadata" /> : null}
              {answers && !answersSubmitted ? (
                <button type="button" onClick={() => setAnswersSubmitted(true)}>Send answers</button>
              ) : null}
            </>
          ) : <p>Submit Stage 1 first.</p>}
        </section>

        {recorder.error ? <p className="a1-final-mock-error">{recorder.error}</p> : null}
        {questionsSubmitted && answersSubmitted ? (
          <section className="a2-sprechen-t1-complete">
            <strong>Teil 1 complete</strong>
            <p>Falowen has both recordings. AI scoring will be connected in the unified A2 result flow.</p>
          </section>
        ) : null}
      </article>
    </main>
  );
}
