import React, { useRef, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import {
  SPEAKING_AUDIO_MIN_SECONDS,
  buildRecordedAudioBlob,
  createSpeakingMediaRecorder,
  revokeObjectUrl,
  userFacingAudioError,
} from "../lib/speakingAudio";
import "./A1GoetheReadingMockTeil1Preview.css";
import "./A2GoetheSpeakingMockTeil3Preview.css";

export const A2_GOETHE_SPEAKING_TEIL3 = Object.freeze({
  title: "Teil 3",
  situation:
    "Sie möchten am Samstag mit Ihrem Freund oder Ihrer Freundin etwas unternehmen.",
  partner:
    "Am Samstag habe ich ab 15 Uhr Zeit. Ins Schwimmbad möchte ich nicht. Ich würde gern etwas machen und danach zusammen essen.",
  prompt:
    "Planen Sie den Nachmittag. Reagieren Sie auf Ihren Partner und machen Sie einen gemeinsamen Plan.",
  points: [
    "Aktivität – Was möchten Sie machen?",
    "Uhrzeit – Wann?",
    "Treffpunkt – Wo treffen Sie sich?",
    "Essen – Wo oder was möchten Sie essen?",
  ],
  finalRequirement:
    "Reagieren Sie auf die Idee Ihres Partners, machen Sie einen Vorschlag und nennen Sie am Ende einen gemeinsamen Plan.",
  maxRecordingSeconds: 90,
});

const formatTime = (seconds) => {
  const safe = Math.max(0, Number(seconds) || 0);
  const minutes = String(Math.floor(safe / 60)).padStart(2, "0");
  const secs = String(safe % 60).padStart(2, "0");
  return `${minutes}:${secs}`;
};

export default function A2GoetheSpeakingMockTeil3Preview() {
  const [recording, setRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [attempt, setAttempt] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const secondsRef = useRef(0);
  const intervalRef = useRef(null);

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

  const stopRecording = () => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  };

  const startRecording = async () => {
    if (recording || submitted) return;
    setError("");
    setRecordingSeconds(0);
    secondsRef.current = 0;

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
        setRecording(false);
        const duration = secondsRef.current;

        try {
          if (duration < SPEAKING_AUDIO_MIN_SECONDS) {
            throw new Error(`Please record for at least ${SPEAKING_AUDIO_MIN_SECONDS} seconds.`);
          }
          const blob = buildRecordedAudioBlob(chunksRef.current, recorder);
          const url = URL.createObjectURL(blob);
          setAttempt((current) => {
            if (current?.url) revokeObjectUrl(current.url);
            return { blob, url, duration };
          });
        } catch (recordError) {
          setError(userFacingAudioError(recordError, recordError?.message || "No usable audio was captured."));
        } finally {
          setRecordingSeconds(0);
          secondsRef.current = 0;
          stopTracks();
        }
      };

      recorder.start(1000);
      setRecording(true);
      intervalRef.current = window.setInterval(() => {
        secondsRef.current += 1;
        const next = secondsRef.current;
        setRecordingSeconds(next);
        if (
          next >= A2_GOETHE_SPEAKING_TEIL3.maxRecordingSeconds &&
          recorder.state === "recording"
        ) {
          recorder.stop();
        }
      }, 1000);
    } catch (recordError) {
      setError(recordError?.message || "Microphone access was blocked.");
      stopTracks();
    }
  };

  const deleteRecording = () => {
    if (attempt?.url) revokeObjectUrl(attempt.url);
    setAttempt(null);
  };

  return (
    <main className="a1-goethe-mock-shell" data-a2-goethe-speaking-teil3-preview>
      <div className="a1-goethe-mock-topbar">
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span className="a1-goethe-mock-preview-badge">A2 Sprechen Teil 3 · preview only</span>
      </div>

      <article className="a1-goethe-mock-exam a2-sprechen-t3-exam">
        <header className="a1-goethe-mock-header">
          <p className="a1-goethe-mock-kicker">A2 · Sprechen</p>
          <h1>Teil 3</h1>
          <p>Plan something together. Record one complete response in German.</p>
          <p><strong>React to your partner, make suggestions, and finish with a clear plan.</strong></p>
        </header>

        <section className="a2-sprechen-t3-situation">
          <span>Situation</span>
          <h2>{A2_GOETHE_SPEAKING_TEIL3.situation}</h2>
        </section>

        <section className="a2-sprechen-t3-partner">
          <span>Your partner says</span>
          <blockquote>„{A2_GOETHE_SPEAKING_TEIL3.partner}“</blockquote>
        </section>

        <section className="a2-sprechen-t3-task">
          <h2>{A2_GOETHE_SPEAKING_TEIL3.prompt}</h2>
          <div className="a2-sprechen-t3-points">
            {A2_GOETHE_SPEAKING_TEIL3.points.map((point, index) => (
              <div key={point}>
                <span>{index + 1}</span>
                <strong>{point}</strong>
              </div>
            ))}
          </div>
          <p className="a2-sprechen-t3-final">
            {A2_GOETHE_SPEAKING_TEIL3.finalRequirement}
          </p>
        </section>

        <section className="a2-sprechen-t3-recorder">
          <div className="a2-sprechen-t3-controls">
            <button
              type="button"
              className={recording ? "a2-sprechen-t3-record recording" : "a2-sprechen-t3-record"}
              onClick={() => (recording ? stopRecording() : startRecording())}
              disabled={submitted}
            >
              {recording ? "Stop recording" : attempt ? "Record again" : "Record answer"}
            </button>

            {recording ? <strong>{formatTime(recordingSeconds)}</strong> : null}

            {attempt && !submitted ? (
              <button
                type="button"
                className="a2-sprechen-t3-secondary"
                onClick={deleteRecording}
              >
                Delete recording
              </button>
            ) : null}
          </div>

          {attempt ? (
            <audio controls src={attempt.url} preload="metadata">
              Your browser does not support this audio.
            </audio>
          ) : null}

          {attempt && !submitted ? (
            <button
              type="button"
              className="a2-sprechen-t3-primary"
              onClick={() => setSubmitted(true)}
            >
              Send answer
            </button>
          ) : null}

          {submitted ? (
            <div className="a2-sprechen-t3-submitted">
              <strong>Submitted</strong>
              <p>
                In the full mock, Falowen will transcribe this recording and grade
                your planning, reaction, interaction language, clarity, and A2-level German.
              </p>
            </div>
          ) : null}

          {error ? <p className="a2-sprechen-t3-error">{error}</p> : null}
        </section>

        <aside className="a2-sprechen-t3-grading">
          <strong>AI grading target for the final mock</strong>
          <ul>
            <li>reacts to the partner's information</li>
            <li>suggests an activity</li>
            <li>gives a time</li>
            <li>gives a meeting place</li>
            <li>includes food or where to eat</li>
            <li>ends with a clear shared plan</li>
            <li>uses understandable connected A2 German</li>
          </ul>
        </aside>
      </article>
    </main>
  );
}
