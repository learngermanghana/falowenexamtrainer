import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { useAuth } from "../context/AuthContext";
import { fetchA2MockAudioPlaybackUrl } from "../services/a2AudioService";
import {
  A2_FINAL_MOCK_ID,
  A2_FINAL_MOCK_STORAGE_KEY,
  saveA2MockAttempt,
  scoreA2MockWriting,
  startA2MockAttempt,
} from "../services/a2FinalMockService";
import { A2_GOETHE_READING_MOCK } from "./A2GoetheReadingMockPreview";
import { A2_GOETHE_LISTENING_TEIL1 } from "./A2GoetheListeningMockTeil1Preview";
import { A2_GOETHE_LISTENING_TEIL2 } from "./A2GoetheListeningMockTeil2Preview";
import { A2_GOETHE_LISTENING_TEIL3 } from "./A2GoetheListeningMockTeil3Preview";
import { A2_GOETHE_LISTENING_TEIL4 } from "./A2GoetheListeningMockTeil4Preview";
import { A2_GOETHE_WRITING_MOCK } from "./A2GoetheWritingMockPreview";
import A2FinalMockSpeaking from "./A2FinalMockSpeaking";
import "./A1GoetheReadingMockTeil1Preview.css";
import "./A1GoetheListeningMockPreview.css";
import "./A1FinalMockExamPage.css";
import "./A2GoetheReadingMockPreview.css";
import "./A2GoetheListeningMockTeil2Preview.css";
import "./A2GoetheListeningMockTeil3Preview.css";
import "./A2GoetheListeningMockTeil4Preview.css";
import "./A2GoetheWritingMockPreview.css";

const SECTION_DURATIONS = Object.freeze({
  lesen: 30 * 60,
  hoeren: 30 * 60,
  schreiben: 30 * 60,
  sprechen: 15 * 60,
});

const SECTION_LABELS = Object.freeze({
  lesen: "Lesen",
  hoeren: "Hören",
  schreiben: "Schreiben",
  sprechen: "Sprechen",
});

const emptyState = () => ({
  version: 1,
  mockId: A2_FINAL_MOCK_ID,
  stage: "intro",
  sectionDeadlineMs: null,
  attemptInfo: null,
  lesenAnswers: {},
  hoerenAnswers: {},
  hoerenAudio: {
    "teil-1": "not_started",
    "teil-2": "not_started",
    "teil-3": "not_started",
    "teil-4": "not_started",
  },
  schreibenSms: "",
  schreibenEmail: "",
  speakingProgress: { attempts: {} },
  schreibenResult: null,
  speakingResult: null,
  lesenResult: null,
  hoerenResult: null,
  sectionScores: {},
  overall: null,
  completed: false,
});

const formatTime = (seconds) => {
  const safe = Math.max(0, Number(seconds) || 0);
  const minutes = String(Math.floor(safe / 60)).padStart(2, "0");
  const secs = String(safe % 60).padStart(2, "0");
  return `${minutes}:${secs}`;
};

const normalizeScore = (correct, total) =>
  Number(((Math.max(0, correct) / Math.max(1, total)) * 25).toFixed(1));

const scoreObjective = (answers, questions) => {
  const correct = questions.reduce(
    (count, question) =>
      String(answers?.[question.key] || "").toLowerCase() === String(question.answer || "").toLowerCase()
        ? count + 1
        : count,
    0,
  );
  return {
    correct,
    total: questions.length,
    score: normalizeScore(correct, questions.length),
    maxScore: 25,
  };
};

const lesenScoredQuestions = [
  ...A2_GOETHE_READING_MOCK.teil1.questions.map((question) => ({ ...question, key: `t1-${question.number}` })),
  ...A2_GOETHE_READING_MOCK.teil2.questions.map((question) => ({ ...question, key: `t2-${question.number}` })),
  ...A2_GOETHE_READING_MOCK.teil3.questions.map((question) => ({ ...question, key: `t3-${question.number}` })),
  ...A2_GOETHE_READING_MOCK.teil4.people.map((question) => ({
    ...question,
    question: question.person,
    key: `t4-${question.number}`,
    answer: String(question.answer || "").toLowerCase(),
  })),
];

const hoerenScoredQuestions = [
  ...A2_GOETHE_LISTENING_TEIL1.questions.map((question) => ({ ...question, key: `t1-${question.number}` })),
  ...A2_GOETHE_LISTENING_TEIL2.tasks.map((question) => ({
    ...question,
    question: question.day,
    key: `t2-${question.number}`,
  })),
  ...A2_GOETHE_LISTENING_TEIL3.questions.map((question) => ({ ...question, key: `t3-${question.number}` })),
  ...A2_GOETHE_LISTENING_TEIL4.questions.map((question) => ({
    ...question,
    question: question.statement,
    key: `t4-${question.number}`,
  })),
];

const readStoredState = (storageKey) => {
  if (typeof window === "undefined") return emptyState();
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) || "null");
    if (!parsed || parsed.mockId !== A2_FINAL_MOCK_ID) return emptyState();
    return { ...emptyState(), ...parsed };
  } catch (_error) {
    return emptyState();
  }
};

const ChoiceList = ({ name, options, value, onChange, disabled = false }) => (
  <div className="a2-mock-choice-list">
    {options.map((option) => (
      <label className="a2-mock-choice" key={option.id}>
        <input
          type="radio"
          name={name}
          checked={String(value).toLowerCase() === String(option.id).toLowerCase()}
          onChange={() => onChange(option.id)}
          disabled={disabled}
        />
        <strong>{option.id}</strong>
        <span>{option.label}</span>
      </label>
    ))}
  </div>
);

const MultipleChoice = ({ name, options, value, onChange }) => (
  <div className="a1-hoeren-mock-multiple-choice" role="radiogroup">
    {options.map((option) => (
      <label key={option.id} className="a1-hoeren-mock-option">
        <input
          type="radio"
          name={name}
          checked={String(value).toLowerCase() === String(option.id).toLowerCase()}
          onChange={() => onChange(option.id)}
        />
        <span className="a1-hoeren-mock-option-letter">{option.id}</span>
        <span className="a1-hoeren-mock-option-copy">
          <strong>{option.label}</strong>
          {option.short ? <small>{option.short}</small> : null}
        </span>
      </label>
    ))}
  </div>
);

const BinaryChoice = ({ name, value, onChange }) => (
  <div className="a2-t4-binary" role="radiogroup">
    {[
      ["ja", "Ja"],
      ["nein", "Nein"],
    ].map(([id, label]) => (
      <label className={value === id ? "a2-t4-choice selected" : "a2-t4-choice"} key={id}>
        <input
          type="radio"
          name={name}
          checked={value === id}
          onChange={() => onChange(id)}
        />
        <span>{label}</span>
      </label>
    ))}
  </div>
);

const SectionHeader = ({ label, secondsLeft, attemptInfo }) => (
  <div className="a1-final-mock-sectionbar">
    <div>
      <span>Current section</span>
      <strong>{label}</strong>
    </div>
    <div>
      <span>Time left</span>
      <strong className={secondsLeft <= 120 ? "warning" : ""}>{formatTime(secondsLeft)}</strong>
    </div>
    <div>
      <span>Attempt</span>
      <strong>{attemptInfo?.firstAttempt ? "Readiness 1" : `Practice ${attemptInfo?.attemptNumber || ""}`}</strong>
    </div>
  </div>
);

const LockedExamAudio = ({ part, config, idToken, status, onStatusChange, expired = false }) => {
  const audioRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [startedThisMount, setStartedThisMount] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    fetchA2MockAudioPlaybackUrl({
      mockId: "mock-01",
      part,
      key: config.audioObjectKey,
      idToken,
    })
      .then((result) => {
        if (active) setAudioUrl(result.url);
      })
      .catch((loadError) => {
        if (active) setError(loadError?.response?.data?.error || loadError?.message || "Could not load the audio.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [config.audioObjectKey, idToken, part]);

  useEffect(() => {
    if (!expired || !audioRef.current) return;
    audioRef.current.pause();
  }, [expired]);

  const startAudio = () => {
    if (expired || loading || status === "ended" || !audioRef.current || !audioUrl) return;
    const audio = audioRef.current;
    audio.currentTime = 0;
    audio.play()
      .then(() => {
        setStartedThisMount(true);
        onStatusChange("started");
      })
      .catch((playError) => setError(playError?.message || "Could not start the audio."));
  };

  return (
    <div className="a1-final-mock-audio">
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onTimeUpdate={(event) => {
          const current = Number(event.currentTarget.currentTime || 0);
          const duration = Number(event.currentTarget.duration || 0);
          setProgress(duration > 0 ? Math.min(100, Math.round((current / duration) * 100)) : 0);
        }}
        onEnded={() => {
          setProgress(100);
          onStatusChange("ended");
        }}
      />
      <div>
        <strong>Exam audio · {part.replace("teil-", "Teil ")}</strong>
        <p>{config.plays === 2 ? "The required repetition is already included in this exam audio." : "This exam audio is heard once."}</p>
      </div>
      <div className="a1-final-mock-audio-progress" aria-label={`Audio progress ${progress}%`}>
        <span style={{ width: `${progress}%` }} />
      </div>
      {status === "ended" ? (
        <strong className="a1-final-mock-audio-done">Audio finished</strong>
      ) : (
        <button type="button" onClick={startAudio} disabled={expired || loading || !audioUrl || startedThisMount}>
          {loading
            ? "Preparing audio …"
            : startedThisMount
              ? "Audio playing …"
              : status === "started"
                ? "Restart interrupted audio"
                : "Start audio"}
        </button>
      )}
      {error ? <p className="a1-final-mock-error">{error}</p> : null}
    </div>
  );
};

const WordCount = ({ text, min, max }) => {
  const count = text.trim() ? text.trim().split(/\s+/).length : 0;
  return (
    <div className={count >= min && count <= max ? "a2-schreiben-count in-range" : "a2-schreiben-count"}>
      Words: <strong>{count}</strong> · Target: {min}–{max}
    </div>
  );
};

export default function A2FinalMockExamPage() {
  const { idToken, user } = useAuth();
  const storageKey = `${A2_FINAL_MOCK_STORAGE_KEY}:${user?.uid || "guest"}`;
  const [exam, setExam] = useState(() => readStoredState(storageKey));
  const [now, setNow] = useState(Date.now());
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const timeoutHandledRef = useRef("");
  const saveTimerRef = useRef(null);
  const completionSaveRef = useRef("");
  const completionRetryCountRef = useRef(0);
  const completionRetryTimerRef = useRef(null);
  const [completionRetryNonce, setCompletionRetryNonce] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const persistedState = {
      ...exam,
      clientSavedAtMs: Date.now(),
    };

    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, JSON.stringify(persistedState));
    }

    if (!exam.attemptInfo?.attemptId || !idToken || exam.completed) return undefined;
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);

    saveTimerRef.current = window.setTimeout(() => {
      saveA2MockAttempt({
        idToken,
        attemptId: exam.attemptInfo.attemptId,
        section: exam.stage,
        state: persistedState,
        sectionScores: exam.sectionScores,
        status: "in_progress",
        overall: exam.overall,
      }).catch((saveError) => {
        console.error("Could not autosave A2 mock", saveError);
      });
    }, 900);

    return () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    };
  }, [exam, idToken, storageKey]);

  useEffect(() => {
    const attemptId = exam.attemptInfo?.attemptId;
    if (!exam.completed || !attemptId || !idToken) return undefined;

    const completionKey = `${attemptId}:${Number(exam.overall?.score || 0)}:${completionRetryNonce}`;
    if (completionSaveRef.current === completionKey) return undefined;
    completionSaveRef.current = completionKey;

    let cancelled = false;
    saveA2MockAttempt({
      idToken,
      attemptId,
      section: "result",
      state: exam,
      sectionScores: exam.sectionScores,
      status: "completed",
      overall: exam.overall,
    })
      .then((response) => {
        if (cancelled) return;
        if (response?.completionSync && response.completionSync.ok === false) {
          throw new Error(response.completionSync.error || "Could not sync final A2 mock result.");
        }
        completionRetryCountRef.current = 0;
        if (completionRetryTimerRef.current) {
          window.clearTimeout(completionRetryTimerRef.current);
          completionRetryTimerRef.current = null;
        }
      })
      .catch((saveError) => {
        if (cancelled) return;
        console.error("Could not finalize A2 mock result sync", saveError);
        completionSaveRef.current = "";
        const retryIndex = Math.min(completionRetryCountRef.current, 3);
        const retryDelay = [3000, 10000, 30000, 60000][retryIndex];
        completionRetryCountRef.current += 1;
        if (completionRetryTimerRef.current) window.clearTimeout(completionRetryTimerRef.current);
        completionRetryTimerRef.current = window.setTimeout(() => {
          completionRetryTimerRef.current = null;
          setCompletionRetryNonce((value) => value + 1);
        }, retryDelay);
      });

    return () => {
      cancelled = true;
    };
  }, [
    completionRetryNonce,
    exam,
    exam.attemptInfo?.attemptId,
    exam.completed,
    exam.overall,
    exam.sectionScores,
    idToken,
  ]);

  useEffect(
    () => () => {
      if (completionRetryTimerRef.current) window.clearTimeout(completionRetryTimerRef.current);
    },
    [],
  );

  const secondsLeft = useMemo(() => {
    if (!exam.sectionDeadlineMs || !SECTION_DURATIONS[exam.stage]) return 0;
    return Math.max(0, Math.ceil((Number(exam.sectionDeadlineMs) - now) / 1000));
  }, [exam.sectionDeadlineMs, exam.stage, now]);

  const moveToSection = useCallback((stage, patch = {}) => {
    setExam((current) => ({
      ...current,
      ...patch,
      stage,
      sectionDeadlineMs: Date.now() + SECTION_DURATIONS[stage] * 1000,
    }));
    timeoutHandledRef.current = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const startExam = async ({ forceNew = false } = {}) => {
    if (busy) return;
    setBusy("start");
    setError("");
    try {
      if (forceNew && exam.completed && exam.attemptInfo?.attemptId) {
        await saveA2MockAttempt({
          idToken,
          attemptId: exam.attemptInfo.attemptId,
          section: "result",
          state: exam,
          sectionScores: exam.sectionScores,
          status: "completed",
          overall: exam.overall,
        });
      }

      if (forceNew && typeof window !== "undefined") {
        window.localStorage.removeItem(storageKey);
      }

      const response = await startA2MockAttempt({ idToken, mockId: A2_FINAL_MOCK_ID });
      if (response?.resumed && response?.state && !forceNew) {
        const sameLocalAttempt = exam.attemptInfo?.attemptId === response.attemptId;
        const localSavedAt = Number(exam.clientSavedAtMs || 0);
        const serverSavedAt = Number(response.state?.clientSavedAtMs || 0);
        const newestState =
          sameLocalAttempt && localSavedAt > serverSavedAt
            ? exam
            : response.state;

        setExam({
          ...emptyState(),
          ...newestState,
          attemptInfo: {
            attemptId: response.attemptId,
            attemptNumber: response.attemptNumber,
            firstAttempt: response.firstAttempt,
          },
        });
        return;
      }

      setExam({
        ...emptyState(),
        stage: "lesen",
        sectionDeadlineMs: Date.now() + SECTION_DURATIONS.lesen * 1000,
        attemptInfo: {
          attemptId: response.attemptId,
          attemptNumber: response.attemptNumber,
          firstAttempt: response.firstAttempt,
        },
      });
    } catch (startError) {
      setError(startError?.response?.data?.error || startError?.message || "Could not start the A2 mock exam.");
    } finally {
      setBusy("");
    }
  };

  const submitLesen = useCallback(() => {
    const result = scoreObjective(exam.lesenAnswers, lesenScoredQuestions);
    moveToSection("hoeren", {
      sectionScores: { ...exam.sectionScores, lesen: result.score },
      lesenResult: result,
    });
  }, [exam.lesenAnswers, exam.sectionScores, moveToSection]);

  const submitHoeren = useCallback(() => {
    const result = scoreObjective(exam.hoerenAnswers, hoerenScoredQuestions);
    moveToSection("schreiben", {
      sectionScores: { ...exam.sectionScores, hoeren: result.score },
      hoerenResult: result,
    });
  }, [exam.hoerenAnswers, exam.sectionScores, moveToSection]);

  const submitSchreiben = useCallback(async () => {
    if (busy) return;
    setBusy("schreiben");
    setError("");
    try {
      const result = await scoreA2MockWriting({
        sms: exam.schreibenSms,
        email: exam.schreibenEmail,
        attemptId: exam.attemptInfo?.attemptId || "",
        idToken,
      });
      moveToSection("sprechen", {
        schreibenResult: result,
        sectionScores: { ...exam.sectionScores, schreiben: Number(result?.score || 0) },
        speakingProgress: exam.speakingProgress || { attempts: {} },
      });
    } catch (markError) {
      setError(markError?.response?.data?.error || markError?.message || "Could not mark A2 Schreiben.");
    } finally {
      setBusy("");
    }
  }, [
    busy,
    exam.attemptInfo?.attemptId,
    exam.schreibenEmail,
    exam.schreibenSms,
    exam.sectionScores,
    exam.speakingProgress,
    idToken,
    moveToSection,
  ]);

  const finishExamWithSpeaking = useCallback((speakingResult) => {
    setExam((current) => {
      const scores = {
        ...current.sectionScores,
        sprechen: Number(speakingResult?.score || 0),
      };
      const overallScore = Number(
        Object.values(scores).reduce((sum, value) => sum + Number(value || 0), 0).toFixed(1),
      );
      return {
        ...current,
        stage: "result",
        sectionDeadlineMs: null,
        speakingResult,
        sectionScores: scores,
        overall: {
          score: overallScore,
          maxScore: 100,
          passed: overallScore >= 60,
        },
        completed: true,
      };
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!SECTION_DURATIONS[exam.stage] || exam.stage === "sprechen" || secondsLeft > 0) return;
    if (timeoutHandledRef.current === exam.stage) return;
    timeoutHandledRef.current = exam.stage;
    if (exam.stage === "lesen") submitLesen();
    if (exam.stage === "hoeren") submitHoeren();
    if (exam.stage === "schreiben") submitSchreiben();
  }, [exam.stage, secondsLeft, submitHoeren, submitLesen, submitSchreiben]);

  const setLesenAnswer = (key, value) =>
    setExam((current) => ({
      ...current,
      lesenAnswers: { ...current.lesenAnswers, [key]: value },
    }));

  const setHoerenAnswer = (key, value) =>
    setExam((current) => ({
      ...current,
      hoerenAnswers: { ...current.hoerenAnswers, [key]: value },
    }));

  const allHoerenAudioEnded = Object.values(exam.hoerenAudio || {}).every((status) => status === "ended");

  const speakingProgressHandler = useCallback((progress) => {
    setExam((current) => ({
      ...current,
      speakingProgress: {
        ...current.speakingProgress,
        ...progress,
      },
    }));
  }, []);

  const strongestAndWeakest = useMemo(() => {
    const entries = Object.entries(exam.sectionScores || {}).filter(([, score]) => Number.isFinite(Number(score)));
    if (!entries.length) return { strongest: "", weakest: "" };
    const sorted = [...entries].sort((a, b) => Number(b[1]) - Number(a[1]));
    return {
      strongest: SECTION_LABELS[sorted[0][0]] || sorted[0][0],
      weakest: SECTION_LABELS[sorted[sorted.length - 1][0]] || sorted[sorted.length - 1][0],
    };
  }, [exam.sectionScores]);

  const renderLesen = () => (
    <>
      <SectionHeader label="Lesen · 30 min" secondsLeft={secondsLeft} attemptInfo={exam.attemptInfo} />
      <article className="a2-mock-exam">
        <header className="a2-mock-title">
          <p>A2 · Lesen</p>
          <h1>Teil 1–4</h1>
          <span>{Object.keys(exam.lesenAnswers).length}/20 answered</span>
        </header>

        <section className="a2-mock-part">
          <header className="a2-mock-part-heading">
            <h2>{A2_GOETHE_READING_MOCK.teil1.title}</h2>
            {A2_GOETHE_READING_MOCK.teil1.instruction.map((line) => <p key={line}>{line}</p>)}
          </header>
          <article className="a2-mock-newspaper">
            <h3>{A2_GOETHE_READING_MOCK.teil1.article.title}</h3>
            {A2_GOETHE_READING_MOCK.teil1.article.subtitle ? <h4>{A2_GOETHE_READING_MOCK.teil1.article.subtitle}</h4> : null}
            {A2_GOETHE_READING_MOCK.teil1.article.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </article>
          {A2_GOETHE_READING_MOCK.teil1.questions.map((question) => (
            <section className="a2-mock-question" key={question.number}>
              <h3>Aufgabe {question.number}</h3>
              <p>{question.question}</p>
              <ChoiceList
                name={`a2-final-t1-${question.number}`}
                options={question.options}
                value={exam.lesenAnswers[`t1-${question.number}`] || ""}
                onChange={(value) => setLesenAnswer(`t1-${question.number}`, value)}
              />
            </section>
          ))}
        </section>

        <section className="a2-mock-part">
          <header className="a2-mock-part-heading">
            <h2>{A2_GOETHE_READING_MOCK.teil2.title}</h2>
            {A2_GOETHE_READING_MOCK.teil2.instruction.map((line) => <p key={line}>{line}</p>)}
          </header>
          <article className="a2-mock-directory">
            <h3>{A2_GOETHE_READING_MOCK.teil2.store.title}</h3>
            {A2_GOETHE_READING_MOCK.teil2.store.floors.map(([floor, items]) => (
              <div className="a2-mock-floor" key={floor}>
                <strong>{floor}</strong>
                <p>{items}</p>
              </div>
            ))}
          </article>
          {A2_GOETHE_READING_MOCK.teil2.questions.map((question) => (
            <section className="a2-mock-question" key={question.number}>
              <h3>Aufgabe {question.number}</h3>
              <p>{question.question}</p>
              <ChoiceList
                name={`a2-final-t2-${question.number}`}
                options={question.options}
                value={exam.lesenAnswers[`t2-${question.number}`] || ""}
                onChange={(value) => setLesenAnswer(`t2-${question.number}`, value)}
              />
            </section>
          ))}
        </section>

        <section className="a2-mock-part">
          <header className="a2-mock-part-heading">
            <h2>{A2_GOETHE_READING_MOCK.teil3.title}</h2>
            {A2_GOETHE_READING_MOCK.teil3.instruction.map((line) => <p key={line}>{line}</p>)}
          </header>
          <article className="a2-mock-email">
            <div className="a2-mock-email-field"><strong>Von:</strong><span>{A2_GOETHE_READING_MOCK.teil3.email.from}</span></div>
            <div className="a2-mock-email-field"><strong>An:</strong><span>{A2_GOETHE_READING_MOCK.teil3.email.to}</span></div>
            <div className="a2-mock-email-field"><strong>Betreff:</strong><span>{A2_GOETHE_READING_MOCK.teil3.email.subject}</span></div>
            <div className="a2-mock-email-body">
              <p>{A2_GOETHE_READING_MOCK.teil3.email.greeting}</p>
              {A2_GOETHE_READING_MOCK.teil3.email.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {A2_GOETHE_READING_MOCK.teil3.email.closing.map((line) => <p key={line}>{line}</p>)}
            </div>
          </article>
          {A2_GOETHE_READING_MOCK.teil3.questions.map((question) => (
            <section className="a2-mock-question" key={question.number}>
              <h3>Aufgabe {question.number}</h3>
              <p>{question.question}</p>
              <ChoiceList
                name={`a2-final-t3-${question.number}`}
                options={question.options}
                value={exam.lesenAnswers[`t3-${question.number}`] || ""}
                onChange={(value) => setLesenAnswer(`t3-${question.number}`, value)}
              />
            </section>
          ))}
        </section>

        <section className="a2-mock-part a2-mock-teil4">
          <header className="a2-mock-part-heading">
            <h2>{A2_GOETHE_READING_MOCK.teil4.title}</h2>
            {A2_GOETHE_READING_MOCK.teil4.instruction.map((line) => <p key={line}>{line}</p>)}
          </header>
          <div className="a2-mock-people-sheet">
            {A2_GOETHE_READING_MOCK.teil4.people.map((item) => (
              <div className="a2-mock-person-row" key={item.number}>
                <div>
                  <strong>Aufgabe {item.number}</strong>
                  <p>{item.person}</p>
                </div>
                <label>
                  Anzeige:
                  <select
                    value={exam.lesenAnswers[`t4-${item.number}`] || ""}
                    onChange={(event) => setLesenAnswer(`t4-${item.number}`, event.target.value)}
                  >
                    <option value="">—</option>
                    {["a", "b", "c", "d", "e", "f", "X"].map((option) => (
                      <option value={option} key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>
            ))}
          </div>
          <h3 className="a2-mock-ads-title">Internet-Anzeigen</h3>
          <div className="a2-mock-ads-grid">
            {A2_GOETHE_READING_MOCK.teil4.ads.map((ad) => (
              <article className="a2-mock-ad" key={ad.id}>
                <div className="a2-mock-ad-browser"><strong>{ad.id}</strong><span>{ad.url}</span></div>
                <div className="a2-mock-ad-body">
                  <h4>{ad.title}</h4>
                  {ad.body.map((line) => <p key={line}>{line}</p>)}
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="a1-final-mock-submitbar">
          <span>{Object.keys(exam.lesenAnswers).length}/20 answered</span>
          <button type="button" onClick={submitLesen}>Submit Lesen → Hören</button>
        </div>
      </article>
    </>
  );

  const renderHoeren = () => {
    const selectedTeil2 = new Set(
      Object.entries(exam.hoerenAnswers)
        .filter(([key]) => key.startsWith("t2-"))
        .map(([, value]) => String(value).toUpperCase()),
    );

    return (
      <>
        <SectionHeader label="Hören · 30 min" secondsLeft={secondsLeft} attemptInfo={exam.attemptInfo} />
        <article className="a1-goethe-mock-exam a1-hoeren-mock-exam">
          <header className="a1-goethe-mock-header">
            <p className="a1-goethe-mock-kicker">A2 · Hören</p>
            <h1>Teil 1–4</h1>
            <p>Start each exam audio once. Required repetitions are already built into the supplied recordings.</p>
          </header>

          <section className="a1-hoeren-mock-part">
            <h2>Teil 1</h2>
            <p>{A2_GOETHE_LISTENING_TEIL1.instruction}</p>
            <LockedExamAudio
              part="teil-1"
              config={A2_GOETHE_LISTENING_TEIL1}
              expired={secondsLeft <= 0}
              idToken={idToken}
              status={exam.hoerenAudio?.["teil-1"] || "not_started"}
              onStatusChange={(status) => setExam((current) => ({
                ...current,
                hoerenAudio: { ...current.hoerenAudio, "teil-1": status },
              }))}
            />
            {A2_GOETHE_LISTENING_TEIL1.questions.map((question) => (
              <section className="a1-hoeren-mock-question" key={question.number}>
                <p className="a1-hoeren-mock-number">Aufgabe {question.number}</p>
                <p className="a1-hoeren-mock-context">{question.context}</p>
                <h3>{question.question}</h3>
                <MultipleChoice
                  name={`a2-final-hoeren-t1-${question.number}`}
                  options={question.options}
                  value={exam.hoerenAnswers[`t1-${question.number}`] || ""}
                  onChange={(value) => setHoerenAnswer(`t1-${question.number}`, value)}
                />
              </section>
            ))}
          </section>

          <section className="a1-hoeren-mock-part">
            <h2>Teil 2</h2>
            <p>{A2_GOETHE_LISTENING_TEIL2.instruction}</p>
            <p><strong>{A2_GOETHE_LISTENING_TEIL2.responseInstruction}</strong></p>
            <LockedExamAudio
              part="teil-2"
              config={A2_GOETHE_LISTENING_TEIL2}
              expired={secondsLeft <= 0}
              idToken={idToken}
              status={exam.hoerenAudio?.["teil-2"] || "not_started"}
              onStatusChange={(status) => setExam((current) => ({
                ...current,
                hoerenAudio: { ...current.hoerenAudio, "teil-2": status },
              }))}
            />
            <section className="a2-hoeren-answer-sheet">
              {A2_GOETHE_LISTENING_TEIL2.tasks.map((task) => (
                <label className="a2-hoeren-day-answer" key={task.number}>
                  <span>Aufgabe {task.number}</span>
                  <strong>{task.day}</strong>
                  <select
                    value={exam.hoerenAnswers[`t2-${task.number}`] || ""}
                    onChange={(event) => setHoerenAnswer(`t2-${task.number}`, event.target.value)}
                  >
                    <option value="">—</option>
                    {A2_GOETHE_LISTENING_TEIL2.pictures.map((picture) => (
                      <option
                        key={picture.id}
                        value={picture.id}
                        disabled={
                          selectedTeil2.has(picture.id) &&
                          String(exam.hoerenAnswers[`t2-${task.number}`] || "").toUpperCase() !== picture.id
                        }
                      >
                        {picture.id} · {picture.label}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </section>
          </section>

          <section className="a1-hoeren-mock-part">
            <h2>Teil 3</h2>
            <p>{A2_GOETHE_LISTENING_TEIL3.instruction}</p>
            <LockedExamAudio
              part="teil-3"
              config={A2_GOETHE_LISTENING_TEIL3}
              expired={secondsLeft <= 0}
              idToken={idToken}
              status={exam.hoerenAudio?.["teil-3"] || "not_started"}
              onStatusChange={(status) => setExam((current) => ({
                ...current,
                hoerenAudio: { ...current.hoerenAudio, "teil-3": status },
              }))}
            />
            {A2_GOETHE_LISTENING_TEIL3.questions.map((question) => (
              <section className="a1-hoeren-mock-question" key={question.number}>
                <p className="a1-hoeren-mock-number">Aufgabe {question.number}</p>
                <p className="a1-hoeren-mock-context">{question.context}</p>
                <h3>{question.question}</h3>
                <MultipleChoice
                  name={`a2-final-hoeren-t3-${question.number}`}
                  options={question.options}
                  value={exam.hoerenAnswers[`t3-${question.number}`] || ""}
                  onChange={(value) => setHoerenAnswer(`t3-${question.number}`, value)}
                />
              </section>
            ))}
          </section>

          <section className="a1-hoeren-mock-part">
            <h2>Teil 4</h2>
            <p>{A2_GOETHE_LISTENING_TEIL4.instruction}</p>
            <LockedExamAudio
              part="teil-4"
              config={A2_GOETHE_LISTENING_TEIL4}
              expired={secondsLeft <= 0}
              idToken={idToken}
              status={exam.hoerenAudio?.["teil-4"] || "not_started"}
              onStatusChange={(status) => setExam((current) => ({
                ...current,
                hoerenAudio: { ...current.hoerenAudio, "teil-4": status },
              }))}
            />
            {A2_GOETHE_LISTENING_TEIL4.questions.map((question) => (
              <article className="a2-t4-question" key={question.number}>
                <div>
                  <strong>Aufgabe {question.number}</strong>
                  <p>{question.statement}</p>
                </div>
                <BinaryChoice
                  name={`a2-final-hoeren-t4-${question.number}`}
                  value={exam.hoerenAnswers[`t4-${question.number}`] || ""}
                  onChange={(value) => setHoerenAnswer(`t4-${question.number}`, value)}
                />
              </article>
            ))}
          </section>

          <div className="a1-final-mock-submitbar">
            <span>{Object.keys(exam.hoerenAnswers).length}/20 answered</span>
            <button type="button" onClick={submitHoeren} disabled={!allHoerenAudioEnded}>
              {allHoerenAudioEnded ? "Submit Hören → Schreiben" : "Finish all four audios first"}
            </button>
          </div>
        </article>
      </>
    );
  };

  const renderSchreiben = () => (
    <>
      <SectionHeader label="Schreiben · 30 min" secondsLeft={secondsLeft} attemptInfo={exam.attemptInfo} />
      <article className="a1-goethe-mock-exam a2-schreiben-exam">
        <header className="a1-goethe-mock-header">
          <p className="a1-goethe-mock-kicker">A2 · Schreiben</p>
          <h1>Teil 1–2</h1>
          <p>Falowen marks both texts at A2 standard. Feedback remains hidden until the full mock is finished.</p>
        </header>

        <section className="a2-schreiben-part">
          <header className="a2-schreiben-part-header">
            <h2>{A2_GOETHE_WRITING_MOCK.teil1.title}</h2>
            <p>{A2_GOETHE_WRITING_MOCK.teil1.situation}</p>
          </header>
          <div className="a2-schreiben-task-paper sms">
            <ul className="a2-schreiben-points">
              {A2_GOETHE_WRITING_MOCK.teil1.points.map((point) => <li key={point}>{point}</li>)}
            </ul>
            <p><strong>{A2_GOETHE_WRITING_MOCK.teil1.instruction}</strong></p>
            <div className="a2-schreiben-sms-frame">
              <div className="a2-schreiben-sms-header"><span>SMS</span><strong>Mila</strong></div>
              <textarea
                value={exam.schreibenSms}
                onChange={(event) => setExam((current) => ({ ...current, schreibenSms: event.target.value }))}
                rows={7}
                placeholder="Hallo Mila, ..."
                aria-label="A2 Schreiben Teil 1 SMS"
              />
            </div>
            <WordCount text={exam.schreibenSms} min={20} max={30} />
          </div>
        </section>

        <section className="a2-schreiben-part">
          <header className="a2-schreiben-part-header">
            <h2>{A2_GOETHE_WRITING_MOCK.teil2.title}</h2>
            <p>{A2_GOETHE_WRITING_MOCK.teil2.situation}</p>
          </header>
          <div className="a2-schreiben-task-paper email">
            <ul className="a2-schreiben-points">
              {A2_GOETHE_WRITING_MOCK.teil2.points.map((point) => <li key={point}>{point}</li>)}
            </ul>
            <p><strong>{A2_GOETHE_WRITING_MOCK.teil2.instruction}</strong></p>
            <div className="a2-schreiben-email-frame">
              <div className="a2-schreiben-email-field"><strong>An:</strong><span>Frau Becker</span></div>
              <div className="a2-schreiben-email-field"><strong>Betreff:</strong><span>Sommerfest</span></div>
              <textarea
                value={exam.schreibenEmail}
                onChange={(event) => setExam((current) => ({ ...current, schreibenEmail: event.target.value }))}
                rows={10}
                placeholder="Sehr geehrte Frau Becker, ..."
                aria-label="A2 Schreiben Teil 2 E-Mail"
              />
            </div>
            <WordCount text={exam.schreibenEmail} min={30} max={40} />
          </div>
        </section>

        {error ? <p className="a1-final-mock-error">{error}</p> : null}
        <div className="a1-final-mock-submitbar">
          <span>Results remain hidden until the full mock is complete.</span>
          <button type="button" onClick={submitSchreiben} disabled={busy === "schreiben"}>
            {busy === "schreiben" ? "Marking Schreiben …" : "Submit Schreiben → Sprechen"}
          </button>
        </div>
      </article>
    </>
  );

  const renderResult = () => {
    const overall = exam.overall || { score: 0, maxScore: 100, passed: false };
    const attemptLabel = exam.attemptInfo?.firstAttempt
      ? "First readiness attempt"
      : `Practice Attempt ${exam.attemptInfo?.attemptNumber || ""}`;

    return (
      <article className="a1-final-mock-result">
        <header>
          <p className="a1-goethe-mock-kicker">A2 Final Mock Exam</p>
          <h1>{overall.score}% — {overall.passed ? "PASSED" : "NEEDS MORE PRACTICE"}</h1>
          <p>{attemptLabel}</p>
        </header>

        <div className="a1-final-mock-scoregrid">
          {["lesen", "hoeren", "schreiben", "sprechen"].map((key) => (
            <div key={key}>
              <span>{SECTION_LABELS[key]}</span>
              <strong>{Number(exam.sectionScores?.[key] || 0).toFixed(1)}/25</strong>
            </div>
          ))}
        </div>

        <div className="a1-final-mock-insight">
          <p><strong>Strongest area:</strong> {strongestAndWeakest.strongest}</p>
          <p><strong>Area to practise next:</strong> {strongestAndWeakest.weakest}</p>
        </div>

        <section className="a1-final-mock-review">
          <h2>Lesen review</h2>
          {lesenScoredQuestions.map((question) => {
            const submitted = exam.lesenAnswers?.[question.key] || "—";
            const correct = String(submitted).toLowerCase() === String(question.answer).toLowerCase();
            return (
              <div className={correct ? "correct" : "incorrect"} key={question.key}>
                <strong>Aufgabe {question.number}</strong>
                <span>Your answer: {submitted}</span>
                <span>Correct answer: {question.answer}</span>
              </div>
            );
          })}
        </section>

        <section className="a1-final-mock-review">
          <h2>Hören review</h2>
          {hoerenScoredQuestions.map((question) => {
            const submitted = exam.hoerenAnswers?.[question.key] || "—";
            const correct = String(submitted).toLowerCase() === String(question.answer).toLowerCase();
            return (
              <div className={correct ? "correct" : "incorrect"} key={question.key}>
                <strong>Aufgabe {question.number}</strong>
                <span>Your answer: {submitted}</span>
                <span>Correct answer: {question.answer}</span>
              </div>
            );
          })}
        </section>

        <section className="a1-final-mock-feedback">
          <h2>Schreiben feedback</h2>
          <p>{exam.schreibenResult?.overall_feedback_en}</p>
          {["teil1", "teil2"].map((key) => {
            const part = exam.schreibenResult?.parts?.[key];
            if (!part) return null;
            return (
              <div key={key}>
                <strong>{key.replace("teil", "Teil ")} · {part.score}/{part.maxScore}</strong>
                <p>{part.feedback_en}</p>
                {(part.corrections || []).map((correction, index) => (
                  <div className="a1-final-mock-correction" key={`${key}-${index}`}>
                    <span>{correction.original_de}</span>
                    <strong>{correction.corrected_de}</strong>
                    <small>{correction.explanation_en}</small>
                  </div>
                ))}
              </div>
            );
          })}
        </section>

        <section className="a1-final-mock-feedback">
          <h2>Sprechen feedback</h2>
          <p>{exam.speakingResult?.overall_feedback_en}</p>
          {["teil1", "teil2", "teil3"].map((key) => {
            const part = exam.speakingResult?.parts?.[key];
            if (!part) return null;
            return (
              <div className="a1-final-mock-speaking-review" key={key}>
                <strong>{key.replace("teil", "Teil ")} · {part.score}/{part.maxScore}</strong>
                <p>{part.feedback_en}</p>
                {part.corrected_example_de ? <small>German example: {part.corrected_example_de}</small> : null}
              </div>
            );
          })}
        </section>

        <div className="a1-final-mock-result-actions">
          <a href="/exams/overview">Continue in Exams Room</a>
          <a href="/exams/speaking">More Sprechen practice</a>
          <button type="button" onClick={() => startExam({ forceNew: true })} disabled={busy === "start"}>
            Practice the full mock again
          </button>
        </div>

        <p className="a1-final-mock-certificate-note">
          This mock is repeatable readiness practice and does not add a new certificate assignment.
        </p>
      </article>
    );
  };

  if (exam.stage === "intro") {
    return (
      <main className="a1-goethe-mock-shell a1-final-mock-shell">
        <div className="a1-goethe-mock-topbar">
          <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
          <span className="a1-goethe-mock-preview-badge">A2 Final Mock · repeatable practice</span>
        </div>
        <article className="a1-final-mock-intro">
          <p className="a1-goethe-mock-kicker">Day 29 · A2</p>
          <h1>A2 Final Mock Exam</h1>
          <p>Complete all four sections in order. Your answers are autosaved and feedback is revealed only after the full mock is finished.</p>

          <div className="a1-final-mock-overview">
            <div><strong>Lesen</strong><span>30 min · 25 points</span></div>
            <div><strong>Hören</strong><span>30 min · 25 points</span></div>
            <div><strong>Schreiben</strong><span>30 min · 25 points</span></div>
            <div><strong>Sprechen</strong><span>15 min · 25 points</span></div>
          </div>

          <div className="a1-final-mock-rules">
            <strong>Pass mark: 60/100</strong>
            <p>Your first completed attempt is kept as your readiness score. Later attempts are saved as practice attempts.</p>
            <p>Your progress is autosaved. Completed sections are locked.</p>
          </div>

          {error ? <p className="a1-final-mock-error">{error}</p> : null}
          <button type="button" className="a1-final-mock-start" onClick={() => startExam()} disabled={busy === "start"}>
            {busy === "start" ? "Preparing mock …" : "Start A2 Mock"}
          </button>
        </article>
      </main>
    );
  }

  return (
    <main className="a1-goethe-mock-shell a1-final-mock-shell" data-a2-final-mock>
      <div className="a1-goethe-mock-topbar">
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span className="a1-goethe-mock-preview-badge">
          {exam.completed ? "Mock complete" : "A2 Final Mock · answers autosaved"}
        </span>
      </div>

      {exam.stage === "lesen" ? renderLesen() : null}
      {exam.stage === "hoeren" ? renderHoeren() : null}
      {exam.stage === "schreiben" ? renderSchreiben() : null}
      {exam.stage === "sprechen" ? (
        <>
          <SectionHeader label="Sprechen · 15 min" secondsLeft={secondsLeft} attemptInfo={exam.attemptInfo} />
          <A2FinalMockSpeaking
            externalSecondsLeft={secondsLeft}
            initialAttempts={exam.speakingProgress?.attempts || {}}
            initialResult={exam.speakingResult}
            attemptId={exam.attemptInfo?.attemptId || ""}
            onProgress={speakingProgressHandler}
            onComplete={finishExamWithSpeaking}
          />
        </>
      ) : null}
      {exam.stage === "result" ? renderResult() : null}
    </main>
  );
}
