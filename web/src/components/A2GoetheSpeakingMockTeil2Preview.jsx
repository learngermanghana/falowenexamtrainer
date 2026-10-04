import React, { useEffect, useMemo, useRef, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import {
  SPEAKING_AUDIO_MIN_SECONDS,
  buildRecordedAudioBlob,
  createSpeakingMediaRecorder,
  revokeObjectUrl,
  userFacingAudioError,
} from "../lib/speakingAudio";
import "./A1GoetheReadingMockTeil1Preview.css";
import "./A2GoetheSpeakingMockTeil2Preview.css";

export const A2_GOETHE_SPEAKING_TEIL2 = Object.freeze({
  title: "Teil 2",
  topic: "Wochenende",
  prompt:
    "Erzählen Sie etwas über Ihr Wochenende. Sprechen Sie zu jedem Stichwort ein paar Sätze.",
  keywords: [
    { label: "aufstehen", question: "Wann?" },
    { label: "Aktivität", question: "Was?" },
    { label: "Personen", question: "Mit wem?" },
    { label: "Essen", question: "Wo?" },
  ],
  followUp: "Was machst du am liebsten am Sonntag?",
  audio: {
    full: "a2/mock-sprechen/mock-01/teil-2-full.mp3",
    prompt: "a2/mock-sprechen/mock-01/teil-2-prompt.mp3",
    followUp: "a2/mock-sprechen/mock-01/teil-2-follow-up.mp3",
  },
  maxMainRecordingSeconds: 120,
  maxFollowUpRecordingSeconds: 45,
});

const formatTime = (seconds) => {
  const safe = Math.max(0, Number(seconds) || 0);
  const minutes = String(Math.floor(safe / 60)).padStart(2, "0");
  const secs = String(safe % 60).padStart(2, "0");
  return `${minutes}:${secs}`;
};

const useRecorder = () => {
  const [recordingId, setRecordingId] = useState("");
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordings, setRecordings] = useState({});
  const [error, setError] = useState("");

  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const secondsRef = useRef(0);
  const intervalRef = useRef(null);
  const mountedRef = useRef(true);
  const recordingsRef = useRef({});

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

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimer();

      const recorder = recorderRef.current;
      if (recorder) {
        recorder.ondataavailable = null;
        recorder.onstop = null;
        if (recorder.state === "recording") {
          try {
            recorder.stop();
          } catch {
            // The recorder may already be stopping during navigation.
          }
        }
        recorderRef.current = null;
      }

      stopTracks();
      Object.values(recordingsRef.current).forEach((item) => {
        if (item?.url) revokeObjectUrl(item.url);
      });
      recordingsRef.current = {};
    };
  }, []);

  const start = async ({ id, maxSeconds }) => {
    if (recordingId) return;
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
        clearTimer();
        if (!mountedRef.current) {
          stopTracks();
          return;
        }

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
        } finally {
          setRecordingSeconds(0);
          secondsRef.current = 0;
          stopTracks();
        }
      };

      recorder.start(1000);
      setRecordingId(id);
      intervalRef.current = window.setInterval(() => {
        secondsRef.current += 1;
        const next = secondsRef.current;
        setRecordingSeconds(next);
        if (next >= maxSeconds && recorder.state === "recording") recorder.stop();
      }, 1000);
    } catch (recordError) {
      if (mountedRef.current) {
        setError(recordError?.message || "Microphone access was blocked.");
      }
      stopTracks();
    }
  };

  const stop = () => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  };

  const remove = (id) => {
    setRecordings((current) => {
      if (current[id]?.url) revokeObjectUrl(current[id].url);
      const next = { ...current };
      delete next[id];
      recordingsRef.current = next;
      return next;
    });
  };

  return {
    recordingId,
    recordingSeconds,
    recordings,
    error,
    start,
    stop,
    remove,
  };
};

export default function A2GoetheSpeakingMockTeil2Preview() {
  const recorder = useRecorder();
  const [mainSubmitted, setMainSubmitted] = useState(false);
  const [followSubmitted, setFollowSubmitted] = useState(false);

  const main = recorder.recordings.main;
  const follow = recorder.recordings.followup;
  const complete = mainSubmitted && followSubmitted;

  const progressText = useMemo(() => {
    if (complete) return "2/2 responses submitted";
    if (mainSubmitted) return "1/2 responses submitted";
    return "0/2 responses submitted";
  }, [complete, mainSubmitted]);

  return (
    <main className="a1-goethe-mock-shell" data-a2-goethe-speaking-teil2-preview>
      <div className="a1-goethe-mock-topbar">
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span className="a1-goethe-mock-preview-badge">A2 Sprechen Teil 2 · preview only</span>
      </div>

      <article className="a1-goethe-mock-exam a2-sprechen-t2-exam">
        <header className="a1-goethe-mock-header">
          <p className="a1-goethe-mock-kicker">A2 · Sprechen</p>
          <h1>Teil 2</h1>
          <p>You receive one topic card. Speak about all four keywords, then answer one follow-up question.</p>
          <p><strong>Speak in German. Use complete sentences.</strong></p>
        </header>

        <div className="a2-sprechen-t2-progress">
          <span>Progress</span>
          <strong>{progressText}</strong>
        </div>

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

        <section className="a2-sprechen-t2-stage">
          <header>
            <span>Stage 1</span>
            <h2>Talk about your weekend</h2>
            <p>Cover all four Stichwörter. You may connect them naturally instead of answering like a list.</p>
          </header>

          <div className="a2-sprechen-t2-controls">
            <button
              type="button"
              className={recorder.recordingId === "main" ? "a2-sprechen-record recording" : "a2-sprechen-record"}
              onClick={() =>
                recorder.recordingId === "main"
                  ? recorder.stop()
                  : recorder.start({ id: "main", maxSeconds: A2_GOETHE_SPEAKING_TEIL2.maxMainRecordingSeconds })
              }
              disabled={Boolean(recorder.recordingId && recorder.recordingId !== "main") || mainSubmitted}
            >
              {recorder.recordingId === "main"
                ? "Stop recording"
                : main
                  ? "Record again"
                  : "Record answer"}
            </button>

            {recorder.recordingId === "main" ? (
              <strong>{formatTime(recorder.recordingSeconds)}</strong>
            ) : null}

            {main && !mainSubmitted ? (
              <button type="button" className="a2-sprechen-secondary" onClick={() => recorder.remove("main")}>
                Delete recording
              </button>
            ) : null}
          </div>

          {main ? (
            <audio controls src={main.url} preload="metadata">
              Your browser does not support this audio.
            </audio>
          ) : null}

          {main && !mainSubmitted ? (
            <button type="button" className="a2-sprechen-primary" onClick={() => setMainSubmitted(true)}>
              Send answer
            </button>
          ) : null}

          {mainSubmitted ? <p className="a2-sprechen-submitted">Submitted. Continue to the follow-up question.</p> : null}
        </section>

        <section className={mainSubmitted ? "a2-sprechen-t2-stage" : "a2-sprechen-t2-stage locked"}>
          <header>
            <span>Stage 2</span>
            <h2>Answer your partner</h2>
            <p className="a2-sprechen-followup"><strong>{A2_GOETHE_SPEAKING_TEIL2.followUp}</strong></p>
            <p>Answer in complete German sentences.</p>
          </header>

          {mainSubmitted ? (
            <>
              <div className="a2-sprechen-t2-controls">
                <button
                  type="button"
                  className={recorder.recordingId === "followup" ? "a2-sprechen-record recording" : "a2-sprechen-record"}
                  onClick={() =>
                    recorder.recordingId === "followup"
                      ? recorder.stop()
                      : recorder.start({ id: "followup", maxSeconds: A2_GOETHE_SPEAKING_TEIL2.maxFollowUpRecordingSeconds })
                  }
                  disabled={Boolean(recorder.recordingId && recorder.recordingId !== "followup") || followSubmitted}
                >
                  {recorder.recordingId === "followup"
                    ? "Stop recording"
                    : follow
                      ? "Record again"
                      : "Record answer"}
                </button>

                {recorder.recordingId === "followup" ? (
                  <strong>{formatTime(recorder.recordingSeconds)}</strong>
                ) : null}

                {follow && !followSubmitted ? (
                  <button type="button" className="a2-sprechen-secondary" onClick={() => recorder.remove("followup")}>
                    Delete recording
                  </button>
                ) : null}
              </div>

              {follow ? (
                <audio controls src={follow.url} preload="metadata">
                  Your browser does not support this audio.
                </audio>
              ) : null}

              {follow && !followSubmitted ? (
                <button type="button" className="a2-sprechen-primary" onClick={() => setFollowSubmitted(true)}>
                  Send answer
                </button>
              ) : null}

              {followSubmitted ? <p className="a2-sprechen-submitted">Submitted.</p> : null}
            </>
          ) : (
            <p className="a2-sprechen-lock-note">Submit Stage 1 first.</p>
          )}
        </section>

        {recorder.error ? <p className="a2-sprechen-error">{recorder.error}</p> : null}

        {complete ? (
          <section className="a2-sprechen-complete">
            <h2>Teil 2 complete</h2>
            <p>In the full mock, Falowen will transcribe both recordings and mark them together at A2 standard after all three Sprechen parts are finished.</p>
          </section>
        ) : null}

        <aside className="a2-sprechen-audio-plan">
          <strong>Audio plan for final mock</strong>
          <code>{A2_GOETHE_SPEAKING_TEIL2.audio.prompt}</code>
          <code>{A2_GOETHE_SPEAKING_TEIL2.audio.followUp}</code>
          <small>Keep the full recording separately as {A2_GOETHE_SPEAKING_TEIL2.audio.full} for practice/reference.</small>
        </aside>
      </article>
    </main>
  );
}
