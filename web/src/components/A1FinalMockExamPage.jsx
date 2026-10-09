import { useAssessmentRestriction } from "../hooks/useAssessmentRestriction";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { getMockWritingSubmissionError } from "../services/mockWritingSubmissionError";
import { FullMockGuide, FullMockRecovery } from "./FullMockGuidance";
import { FULL_MOCK_SKILLS } from "../utils/fullMockProgress";
import { useAuth } from "../context/AuthContext";
import { fetchA1MockAudioPlaybackUrl } from "../services/a1AudioService";
import {
  A1_FINAL_MOCK_ID,
  A1_FINAL_MOCK_STORAGE_KEY,
  saveA1MockAttempt,
  scoreA1MockWriting,
  startA1MockAttempt,
} from "../services/a1FinalMockService";
import { A1_GOETHE_READING_MOCK_TEIL1 } from "./A1GoetheReadingMockTeil1Preview";
import { A1_GOETHE_READING_MOCK_TEIL2 } from "./A1GoetheReadingMockTeil2Preview";
import { A1_GOETHE_READING_MOCK_TEIL3 } from "./A1GoetheReadingMockTeil3Preview";
import { A1_GOETHE_LISTENING_MOCK } from "./A1GoetheListeningMockPreview";
import { A1_GOETHE_WRITING_MOCK } from "./A1GoetheWritingMockPreview";
import { A1_FINAL_MOCK_WRITING_TASK } from "../data/a1FinalMockWritingTask";
import A1GoetheSpeakingMockPreview from "./A1GoetheSpeakingMockPreview";
import "./A1GoetheReadingMockTeil1Preview.css";
import "./A1GoetheReadingMockTeil2Preview.css";
import "./A1GoetheReadingMockTeil3Preview.css";
import "./A1GoetheListeningMockPreview.css";
import "./A1GoetheWritingMockPreview.css";
import "./A1GoetheSpeakingMockPreview.css";
import "./A1FinalMockExamPage.css";

const SECTION_DURATIONS = Object.freeze({
  lesen: 25 * 60,
  hoeren: 20 * 60,
  schreiben: 20 * 60,
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
  mockId: A1_FINAL_MOCK_ID,
  stage: "intro",
  sectionDeadlineMs: null,
  attemptInfo: null,
  lesenAnswers: {},
  hoerenAnswers: {},
  hoerenAudio: {
    "teil-1": "not_started",
    "teil-2": "not_started",
    "teil-3": "not_started",
  },
  schreibenForm: {},
  schreibenText: "",
  speakingProgress: { attempts: {} },
  writingResult: null,
  speakingResult: null,
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

const scoreObjective = (answers, questions, keyForQuestion) => {
  const correct = questions.reduce(
    (count, question) =>
      String(answers?.[keyForQuestion(question)] || "").toLowerCase() ===
      String(question.answer || "").toLowerCase()
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
  ...A1_GOETHE_READING_MOCK_TEIL1.questions.map((question) => ({ ...question, part: "t1" })),
  ...A1_GOETHE_READING_MOCK_TEIL2.questions.map((question) => ({ ...question, part: "t2" })),
  ...A1_GOETHE_READING_MOCK_TEIL3.questions.map((question) => ({ ...question, part: "t3" })),
];

const hoerenScoredQuestions = [
  ...A1_GOETHE_LISTENING_MOCK.teil1.questions.map((question) => ({ ...question, part: "t1" })),
  ...A1_GOETHE_LISTENING_MOCK.teil2.questions.map((question) => ({ ...question, part: "t2" })),
  ...A1_GOETHE_LISTENING_MOCK.teil3.questions.map((question) => ({ ...question, part: "t3" })),
];

const readingKey = (question) => `${question.part}-${question.number}`;
const listeningKey = (question) => `${question.part}-${question.number}`;

const readStoredState = (storageKey) => {
  if (typeof window === "undefined") return emptyState();
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) || "null");
    if (!parsed || parsed.mockId !== A1_FINAL_MOCK_ID) return emptyState();
    return { ...emptyState(), ...parsed };
  } catch (_error) {
    return emptyState();
  }
};

const BinaryChoices = ({ name, value, onChange, disabled = false }) => (
  <div className="a1-goethe-mock-choices" role="radiogroup">
    {[
      ["richtig", "Richtig."],
      ["falsch", "Falsch."],
    ].map(([option, label]) => (
      <label key={option} className="a1-goethe-mock-choice">
        <input
          type="radio"
          name={name}
          checked={value === option}
          onChange={() => onChange(option)}
          disabled={disabled}
        />
        <span>{label}</span>
      </label>
    ))}
  </div>
);

const LetterChoices = ({ name, options, value, onChange, disabled = false }) => (
  <div className="a1-final-mock-letter-choices" role="radiogroup">
    {options.map((option) => (
      <label key={option.id} className="a1-hoeren-mock-option">
        <input
          type="radio"
          name={name}
          checked={value === option.id}
          onChange={() => onChange(option.id)}
          disabled={disabled}
        />
        <span className="a1-hoeren-mock-option-letter">{option.id}</span>
        <span className="a1-hoeren-mock-option-copy">
          <strong>{option.label || option.url || option.id}</strong>
          {option.short ? <small>{option.short}</small> : null}
        </span>
      </label>
    ))}
  </div>
);

const ReadingPaper = ({ title, lines }) => (
  <figure className="a1-goethe-mock-paper">
    <figcaption className="sr-only">{title}</figcaption>
    <div className="a1-goethe-mock-paper-copy">
      {lines.map((line, index) => (
        <p key={`${title}-${index}`} className="a1-goethe-mock-paper-line">
          {line}
        </p>
      ))}
    </div>
  </figure>
);

const BrowserPanel = ({ option }) => (
  <article className="a1-goethe-mock-browser-panel">
    <div className="a1-goethe-mock-browser-greenbar"><strong>Internet</strong><span>◧</span></div>
    <div className="a1-goethe-mock-browser-toolbar">
      <span className="a1-goethe-mock-browser-icon">⌂</span>
      <span className="a1-goethe-mock-browser-url">{option.url}</span>
    </div>
    <div className="a1-goethe-mock-browser-page">
      <div className="a1-goethe-mock-browser-visual"><span>{option.id}</span></div>
      <div className="a1-goethe-mock-browser-copy">
        <h3>{option.title}</h3>
        <strong>{option.subtitle}</strong>
        {option.lines.map((line) => <p key={line}>{line}</p>)}
      </div>
    </div>
  </article>
);

const Timetable = ({ option }) => (
  <article className="a1-goethe-mock-timetable-card">
    <div className="a1-goethe-mock-timetable-heading">
      <strong>{option.id}</strong><span>{option.url}</span>
    </div>
    <div className="a1-goethe-mock-table-scroll">
      <table className="a1-goethe-mock-timetable">
        <thead>
          <tr><th></th><th>Bahnhof</th><th>Datum</th><th>Zeit</th><th>Dauer</th><th>Umsteigen</th><th>Angebot</th></tr>
        </thead>
        <tbody>
          {option.rows.map((row, index) => (
            <tr key={`${option.id}-${index}`}>
              {row.map((cell, cellIndex) => <td key={`${option.id}-${index}-${cellIndex}`}>{cell || "\u00a0"}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </article>
);

const NoticeCard = ({ notice }) => (
  <div className={`a1-goethe-mock-notice-card a1-goethe-mock-notice-${notice.kind}`}>
    <div className="a1-goethe-mock-notice-inner">
      <h3>{notice.heading}</h3>
      {notice.lines.map((line, index) =>
        line
          ? <p key={`${notice.heading}-${index}`}>{line}</p>
          : <div key={`${notice.heading}-${index}`} className="a1-goethe-mock-notice-gap" />
      )}
    </div>
  </div>
);

const LockedExamAudio = ({ part, objectKey, idToken, status, onStatusChange }) => {
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

    fetchA1MockAudioPlaybackUrl({
      mockId: "mock-01",
      part,
      key: objectKey,
      idToken,
    })
      .then((result) => {
        if (!active) return;
        setAudioUrl(result.url);
      })
      .catch((loadError) => {
        if (!active) return;
        setError(loadError?.response?.data?.error || loadError?.message || "Could not load the audio.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [idToken, objectKey, part]);

  const startAudio = () => {
    if (loading || status === "ended" || !audioRef.current || !audioUrl) return;
    setError("");
    const audio = audioRef.current;
    audio.currentTime = 0;
    audio.play()
      .then(() => {
        setStartedThisMount(true);
        onStatusChange("started");
      })
      .catch((playError) => {
        setError(playError?.message || "Could not start the audio.");
      });
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
        <p>Once started, this audio cannot be paused or restarted during the same exam session.</p>
      </div>
      <div className="a1-final-mock-audio-progress" aria-label={`Audio progress ${progress}%`}>
        <span style={{ width: `${progress}%` }} />
      </div>
      {status === "ended" ? (
        <strong className="a1-final-mock-audio-done">Audio finished</strong>
      ) : (
        <button
          type="button"
          onClick={startAudio}
          disabled={loading || !audioUrl || startedThisMount}
        >
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

const SectionHeader = ({ label, secondsLeft, attemptInfo }) => (
  <div className="a1-final-mock-sectionbar">
    <div>
      <span>Full mock · {FULL_MOCK_SKILLS.findIndex((step) => label.startsWith(step.label)) + 1}/4</span>
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

export default function A1FinalMockExamPage() {
  useAssessmentRestriction();
  const { idToken, user } = useAuth();
  const storageKey = `${A1_FINAL_MOCK_STORAGE_KEY}:${user?.uid || "guest"}`;
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
      saveA1MockAttempt({
        idToken,
        attemptId: exam.attemptInfo.attemptId,
        section: exam.stage,
        state: persistedState,
        sectionScores: exam.sectionScores,
        status: "in_progress",
        overall: exam.overall,
      }).catch((saveError) => {
        console.error("Could not autosave A1 mock", saveError);
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

    saveA1MockAttempt({
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
          const syncError = new Error(response.completionSync.error || "Could not sync final mock result.");
          syncError.retryable = true;
          throw syncError;
        }
        completionRetryCountRef.current = 0;
        if (completionRetryTimerRef.current) {
          window.clearTimeout(completionRetryTimerRef.current);
          completionRetryTimerRef.current = null;
        }
      })
      .catch((saveError) => {
        if (cancelled) return;
        console.error("Could not finalize A1 mock result sync", saveError);
        completionSaveRef.current = "";

        const retryIndex = Math.min(completionRetryCountRef.current, 3);
        const retryDelay = [3000, 10000, 30000, 60000][retryIndex];
        completionRetryCountRef.current += 1;

        if (completionRetryTimerRef.current) {
          window.clearTimeout(completionRetryTimerRef.current);
        }
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
    exam.completed,
    exam.attemptInfo?.attemptId,
    exam.overall,
    exam.sectionScores,
    exam,
    idToken,
  ]);

  useEffect(
    () => () => {
      if (completionRetryTimerRef.current) {
        window.clearTimeout(completionRetryTimerRef.current);
      }
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
        await saveA1MockAttempt({
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

      const response = await startA1MockAttempt({ idToken, mockId: A1_FINAL_MOCK_ID });
      if (response?.resumed && response?.state && !forceNew) {
        const sameLocalAttempt = exam.attemptInfo?.attemptId === response.attemptId;
        const localSavedAt = Number(exam.clientSavedAtMs || 0);
        const serverSavedAt = Number(response.state?.clientSavedAtMs || 0);
        const newestState =
          sameLocalAttempt && localSavedAt > serverSavedAt
            ? exam
            : response.state;

        setExam({ ...emptyState(), ...newestState, attemptInfo: {
          attemptId: response.attemptId,
          attemptNumber: response.attemptNumber,
          firstAttempt: response.firstAttempt,
        }});
        return;
      }

      const next = {
        ...emptyState(),
        stage: "lesen",
        sectionDeadlineMs: Date.now() + SECTION_DURATIONS.lesen * 1000,
        attemptInfo: {
          attemptId: response.attemptId,
          attemptNumber: response.attemptNumber,
          firstAttempt: response.firstAttempt,
        },
      };
      setExam(next);
    } catch (startError) {
      setError(startError?.message || "Could not start the mock exam.");
    } finally {
      setBusy("");
    }
  };

  const submitLesen = useCallback(() => {
    const result = scoreObjective(exam.lesenAnswers, lesenScoredQuestions, readingKey);
    moveToSection("hoeren", {
      sectionScores: { ...exam.sectionScores, lesen: result.score },
      lesenResult: result,
    });
  }, [exam.lesenAnswers, exam.sectionScores, moveToSection]);

  const submitHoeren = useCallback(() => {
    const result = scoreObjective(exam.hoerenAnswers, hoerenScoredQuestions, listeningKey);
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
      const result = await scoreA1MockWriting({
        formValues: exam.schreibenForm,
        text: exam.schreibenText,
        attemptId: exam.attemptInfo?.attemptId || "",
        idToken,
      });
      moveToSection("sprechen", {
        writingResult: result,
        sectionScores: { ...exam.sectionScores, schreiben: Number(result?.score || 0) },
        speakingProgress: exam.speakingProgress || { attempts: {} },
      });
    } catch (markError) {
      setError(getMockWritingSubmissionError(markError));
    } finally {
      setBusy("");
    }
  }, [busy, exam.attemptInfo?.attemptId, exam.schreibenForm, exam.schreibenText, exam.sectionScores, exam.speakingProgress, idToken, moveToSection]);

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
  }, [exam.stage, secondsLeft, submitLesen, submitHoeren, submitSchreiben]);

  const setLesenAnswer = (key, value) =>
    setExam((current) => ({ ...current, lesenAnswers: { ...current.lesenAnswers, [key]: value } }));
  const setHoerenAnswer = (key, value) =>
    setExam((current) => ({ ...current, hoerenAnswers: { ...current.hoerenAnswers, [key]: value } }));

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
      <SectionHeader label="Lesen · 25 min" secondsLeft={secondsLeft} attemptInfo={exam.attemptInfo} />
      <article className="a1-goethe-mock-exam">
        <header className="a1-goethe-mock-header">
          <p className="a1-goethe-mock-kicker">A1 · Lesen</p>
          <h1>Teil 1–3</h1>
          <p>Bearbeiten Sie alle 15 Aufgaben. Nach der Abgabe können Sie nicht zurückgehen.</p>
        </header>

        <section className="a1-final-mock-part">
          <h2>Teil 1</h2>
          <p>Lesen Sie die beiden Texte. Kreuzen Sie an: Richtig oder Falsch.</p>

          <section className="a1-goethe-mock-question a1-goethe-mock-question-example">
            <h3>Beispiel 0</h3>
            <p className="a1-goethe-mock-statement">{A1_GOETHE_READING_MOCK_TEIL1.example.statement}</p>
            <ReadingPaper title={A1_GOETHE_READING_MOCK_TEIL1.text1.title} lines={A1_GOETHE_READING_MOCK_TEIL1.text1.body} />
            <BinaryChoices name="lesen-example-1" value={A1_GOETHE_READING_MOCK_TEIL1.example.answer} onChange={() => {}} disabled />
          </section>

          {A1_GOETHE_READING_MOCK_TEIL1.questions.map((question, index) => (
            <section className="a1-goethe-mock-question" key={question.number}>
              <h3>Aufgabe {question.number}</h3>
              <p className="a1-goethe-mock-statement">{question.statement}</p>
              {index === 2 ? (
                <ReadingPaper title={A1_GOETHE_READING_MOCK_TEIL1.text2.title} lines={A1_GOETHE_READING_MOCK_TEIL1.text2.body} />
              ) : null}
              <BinaryChoices
                name={`lesen-t1-${question.number}`}
                value={exam.lesenAnswers[`t1-${question.number}`] || ""}
                onChange={(value) => setLesenAnswer(`t1-${question.number}`, value)}
              />
            </section>
          ))}
        </section>

        <section className="a1-final-mock-part">
          <h2>Teil 2</h2>
          <p>Welche Anzeige passt? Kreuzen Sie an: a oder b.</p>
          {A1_GOETHE_READING_MOCK_TEIL2.questions.map((question) => (
            <section className="a1-goethe-mock-question" key={question.number}>
              <h3>Aufgabe {question.number}</h3>
              <p className="a1-goethe-mock-statement">{question.statement}</p>
              {question.timetable ? (
                <div className="a1-goethe-mock-timetable-stack">
                  {question.options.map((option) => <Timetable key={option.id} option={option} />)}
                </div>
              ) : (
                <div className="a1-goethe-mock-website-grid">
                  {question.options.map((option) => <BrowserPanel key={option.id} option={option} />)}
                </div>
              )}
              <LetterChoices
                name={`lesen-t2-${question.number}`}
                options={question.options}
                value={exam.lesenAnswers[`t2-${question.number}`] || ""}
                onChange={(value) => setLesenAnswer(`t2-${question.number}`, value)}
              />
            </section>
          ))}
        </section>

        <section className="a1-final-mock-part">
          <h2>Teil 3</h2>
          <p>Lesen Sie die Hinweise. Kreuzen Sie an: Richtig oder Falsch.</p>
          {A1_GOETHE_READING_MOCK_TEIL3.questions.map((question) => (
            <section className="a1-goethe-mock-question a1-goethe-mock-teil3-question" key={question.number}>
              <h3>Aufgabe {question.number}</h3>
              <p className="a1-goethe-mock-location">{question.location}</p>
              <NoticeCard notice={question.notice} />
              <p className="a1-goethe-mock-teil3-statement">{question.statement}</p>
              <BinaryChoices
                name={`lesen-t3-${question.number}`}
                value={exam.lesenAnswers[`t3-${question.number}`] || ""}
                onChange={(value) => setLesenAnswer(`t3-${question.number}`, value)}
              />
            </section>
          ))}
        </section>

        <div className="a1-final-mock-submitbar">
          <span>{Object.keys(exam.lesenAnswers).length}/15 answered</span>
          <button type="button" onClick={submitLesen}>Submit Lesen → Hören</button>
        </div>
      </article>
    </>
  );

  const renderHoerenQuestions = (partName, config) => (
    <section className="a1-hoeren-mock-part">
      <header className="a1-hoeren-mock-part-header">
        <h2>{config.title}</h2>
        <p>{config.instruction}</p>
        <p><strong>{config.responseInstruction}</strong></p>
      </header>

      <LockedExamAudio
        part={partName}
        objectKey={config.audioObjectKey}
        idToken={idToken}
        status={exam.hoerenAudio?.[partName] || "not_started"}
        onStatusChange={(status) =>
          setExam((current) => ({
            ...current,
            hoerenAudio: { ...current.hoerenAudio, [partName]: status },
          }))
        }
      />

      {config.questions.map((question) => {
        const partShort = partName.replace("teil-", "t");
        const key = `${partShort}-${question.number}`;
        return (
          <section className="a1-hoeren-mock-question" key={key}>
            <p className="a1-hoeren-mock-number">Aufgabe {question.number}</p>
            <p className="a1-hoeren-mock-context">{question.context}</p>
            <h3>{question.question || question.statement}</h3>
            {question.options ? (
              <LetterChoices
                name={`hoeren-${key}`}
                options={question.options}
                value={exam.hoerenAnswers[key] || ""}
                onChange={(value) => setHoerenAnswer(key, value)}
              />
            ) : (
              <BinaryChoices
                name={`hoeren-${key}`}
                value={exam.hoerenAnswers[key] || ""}
                onChange={(value) => setHoerenAnswer(key, value)}
              />
            )}
          </section>
        );
      })}
    </section>
  );

  const renderHoeren = () => (
    <>
      <SectionHeader label="Hören · max. 20 min" secondsLeft={secondsLeft} attemptInfo={exam.attemptInfo} />
      <article className="a1-goethe-mock-exam a1-hoeren-mock-exam">
        <header className="a1-goethe-mock-header">
          <p className="a1-goethe-mock-kicker">A1 · Hören</p>
          <h1>Teil 1–3</h1>
          <p>Start each exam audio once. It will play without pause until it ends.</p>
        </header>

        {renderHoerenQuestions("teil-1", A1_GOETHE_LISTENING_MOCK.teil1)}
        {renderHoerenQuestions("teil-2", A1_GOETHE_LISTENING_MOCK.teil2)}
        {renderHoerenQuestions("teil-3", A1_GOETHE_LISTENING_MOCK.teil3)}

        <div className="a1-final-mock-submitbar">
          <span>{Object.keys(exam.hoerenAnswers).length}/15 answered</span>
          <button type="button" onClick={submitHoeren} disabled={!allHoerenAudioEnded}>
            {allHoerenAudioEnded ? "Submit Hören → Schreiben" : "Finish all three audios first"}
          </button>
        </div>
      </article>
    </>
  );

  const renderSchreiben = () => {
    const wordCount = exam.schreibenText.trim() ? exam.schreibenText.trim().split(/\s+/).length : 0;
    return (
      <>
        <SectionHeader label="Schreiben · 20 min" secondsLeft={secondsLeft} attemptInfo={exam.attemptInfo} />
        <article className="a1-goethe-mock-exam a1-schreiben-mock-exam">
          <header className="a1-goethe-mock-header">
            <p className="a1-goethe-mock-kicker">A1 · Schreiben</p>
            <h1>Teil 1–2</h1>
            <p>Teil 1 is marked automatically. Teil 2 is marked by Falowen at A1 standard.</p>
          </header>

          <section className="a1-schreiben-part">
            <header className="a1-schreiben-part-header">
              <h2>Teil 1</h2>
              {A1_GOETHE_WRITING_MOCK.teil1.scenario.map((line) => <p key={line}>{line}</p>)}
              <p><strong>{A1_GOETHE_WRITING_MOCK.teil1.instruction}</strong></p>
            </header>

            <div className="a1-schreiben-form-paper">
              <div className="a1-schreiben-form-header">
                <div><strong>REISEBÜRO</strong><span>Stadttour & Ausflug</span></div>
                <div className="a1-schreiben-form-title">ANMELDUNG</div>
              </div>
              <div className="a1-schreiben-form-body">
                {A1_GOETHE_WRITING_MOCK.teil1.formRows.map((field) => {
                  if (field.kind === "prefilled") {
                    return (
                      <div
                        className={field.example ? "a1-schreiben-form-row a1-schreiben-form-example" : "a1-schreiben-form-row"}
                        key={field.label}
                      >
                        <span className="a1-schreiben-form-label">{field.label}</span>
                        <span className="a1-schreiben-form-prefilled">
                          {field.value}
                          {field.example ? <small>Beispiel (0)</small> : null}
                        </span>
                      </div>
                    );
                  }

                  if (field.kind === "choice") {
                    return (
                      <fieldset className="a1-schreiben-form-row a1-schreiben-form-choice-row" key={field.number}>
                        <legend className="a1-schreiben-form-label">{field.label}</legend>
                        <span className="a1-schreiben-form-number">{field.number}</span>
                        <div className="a1-schreiben-form-choice-list">
                          {field.options.map((option) => (
                            <label key={option.value}>
                              <input
                                type="radio"
                                name={`a1-final-mock-form-${field.number}`}
                                value={option.value}
                                checked={(exam.schreibenForm?.[field.number] || "") === option.value}
                                onChange={(event) =>
                                  setExam((current) => ({
                                    ...current,
                                    schreibenForm: {
                                      ...current.schreibenForm,
                                      [field.number]: event.target.value,
                                    },
                                  }))
                                }
                              />
                              <span>{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    );
                  }

                  return (
                    <label className="a1-schreiben-form-row" key={field.number}>
                      <span className="a1-schreiben-form-label">{field.label}</span>
                      <span className="a1-schreiben-form-number">{field.number}</span>
                      <input
                        type="text"
                        value={exam.schreibenForm?.[field.number] || ""}
                        onChange={(event) =>
                          setExam((current) => ({
                            ...current,
                            schreibenForm: { ...current.schreibenForm, [field.number]: event.target.value },
                          }))
                        }
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="a1-schreiben-part">
            <header className="a1-schreiben-part-header">
              <h2>Teil 2</h2>
              <p>{A1_FINAL_MOCK_WRITING_TASK.situation}</p>
              <p><strong>{A1_GOETHE_WRITING_MOCK.teil2.instruction}</strong></p>
            </header>
            <div className="a1-schreiben-letter-task">
              <div className="a1-schreiben-three-points">
                {A1_FINAL_MOCK_WRITING_TASK.points.map((point, index) => (
                  <div className="a1-schreiben-point" key={point}>
                    <span>{index + 1}</span><p>{point}</p>
                  </div>
                ))}
              </div>
              <p className="a1-schreiben-reminder">{A1_GOETHE_WRITING_MOCK.teil2.reminder}</p>
              <label className="a1-schreiben-textarea-label" htmlFor="a1-final-mock-letter">Ihre E-Mail</label>
              <textarea
                id="a1-final-mock-letter"
                value={exam.schreibenText}
                onChange={(event) => setExam((current) => ({ ...current, schreibenText: event.target.value }))}
                rows={11}
                placeholder="Sehr geehrte Damen und Herren, ..."
              />
              <div className="a1-schreiben-word-count">Wörter: <strong>{wordCount}</strong> · Ziel: ungefähr 30</div>
            </div>
          </section>

          {error ? <p className="a1-final-mock-error">{error}</p> : null}
          <div className="a1-final-mock-submitbar">
            <span>Falowen feedback is shown only after the full mock.</span>
            <button type="button" onClick={submitSchreiben} disabled={busy === "schreiben"}>
              {busy === "schreiben" ? "Marking Schreiben …" : "Submit Schreiben → Sprechen"}
            </button>
          </div>
        </article>
      </>
    );
  };

  const renderResult = () => {
    const overall = exam.overall || { score: 0, maxScore: 100, passed: false };
    const attemptLabel = exam.attemptInfo?.firstAttempt
      ? "First readiness attempt"
      : `Practice Attempt ${exam.attemptInfo?.attemptNumber || ""}`;

    return (
      <article className="a1-final-mock-result">
        <header>
          <p className="a1-goethe-mock-kicker">A1 Final Mock Exam</p>
          <h1>{overall.score}% — {overall.passed ? "PASSED" : "NEEDS MORE PRACTICE"}</h1>
          <p>{attemptLabel}</p>
        </header>

        <FullMockGuide level="A1" stage="result" completedSkills={FULL_MOCK_SKILLS.filter((skill) => Object.prototype.hasOwnProperty.call(exam.sectionScores || {}, skill.key)).map((skill) => skill.key)} complete={exam.completed} />
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
            const key = readingKey(question);
            const submitted = exam.lesenAnswers?.[key] || "—";
            const correct = String(submitted).toLowerCase() === String(question.answer).toLowerCase();
            return (
              <div className={correct ? "correct" : "incorrect"} key={key}>
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
            const key = listeningKey(question);
            const submitted = exam.hoerenAnswers?.[key] || "—";
            const correct = String(submitted).toLowerCase() === String(question.answer).toLowerCase();
            return (
              <div className={correct ? "correct" : "incorrect"} key={key}>
                <strong>Aufgabe {question.number}</strong>
                <span>Your answer: {submitted}</span>
                <span>Correct answer: {question.answer}</span>
              </div>
            );
          })}
        </section>

        <section className="a1-final-mock-feedback">
          <h2>Schreiben feedback</h2>
          <p><strong>Form:</strong> {exam.writingResult?.form?.score || 0}/10</p>
          <div className="a1-final-mock-review">
            {(exam.writingResult?.form?.fields || []).map((field) => (
              <div className={field.correct ? "correct" : "incorrect"} key={field.number}>
                <strong>Form {field.number}</strong>
                <span>Your answer: {field.submitted || "—"}</span>
                <span>Expected: {field.expected}</span>
              </div>
            ))}
          </div>
          <p><strong>Email:</strong> {exam.writingResult?.letter?.score || 0}/15</p>
          <p>{exam.writingResult?.letter?.feedback_en}</p>
          {exam.writingResult?.letter?.level_mismatch ? (
            <p className="a1-final-mock-level-note">
              This response uses language that is noticeably above typical A1 level. Practise the same task again using simpler A1 structures.
            </p>
          ) : null}
          {(exam.writingResult?.letter?.corrections || []).map((correction, index) => (
            <div className="a1-final-mock-correction" key={index}>
              <span>{correction.original_de}</span>
              <strong>{correction.corrected_de}</strong>
              <small>{correction.explanation_en}</small>
            </div>
          ))}
        </section>

        <section className="a1-final-mock-feedback">
          <h2>Sprechen feedback</h2>
          <p>{exam.speakingResult?.overall_feedback_en}</p>
          {["teil1", "teil2", "teil3"].map((key) => {
            const task = exam.speakingProgress?.attempts?.[key];
            const part = exam.speakingResult?.parts?.[key];
            return (
              <div className="a1-final-mock-speaking-review" key={key}>
                <strong>{key.replace("teil", "Teil ")} · {part?.score || 0}/{part?.maxScore || (key === "teil1" ? 9 : 8)}</strong>
                <p>Transcript: {task?.transcript || "No answer submitted."}</p>
                <p>{part?.feedback_en}</p>
                {part?.corrected_example_de ? <small>German example: {part.corrected_example_de}</small> : null}
              </div>
            );
          })}
        </section>

        <FullMockRecovery level="A1" sectionScores={exam.sectionScores} onRetake={() => startExam({ forceNew: true })} retakeDisabled={busy === "start"} retakeNote="Completed attempts stay recorded; a retake starts again from Lesen." />
        <div className="a1-final-mock-result-actions">
          <a href="/exams/overview">Continue in Exams Room</a>
          <a href="/exams/speaking">More Sprechen practice</a>
          
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
          <span className="a1-goethe-mock-preview-badge">A1 Final Mock · repeatable practice</span>
        </div>
        <article className="a1-final-mock-intro">
          <p className="a1-goethe-mock-kicker">Day 23 · A1</p>
          <h1>A1 Final Mock Exam</h1>
          <p>Complete all four sections in order. Answers and AI feedback are revealed only after the full mock is finished.</p>

          <FullMockGuide level="A1" stage="intro" />
          <div className="a1-final-mock-overview">
            <div><strong>Lesen</strong><span>25 min · 25 points</span></div>
            <div><strong>Hören</strong><span>max. 20 min · 25 points</span></div>
            <div><strong>Schreiben</strong><span>20 min · 25 points</span></div>
            <div><strong>Sprechen</strong><span>15 min · 25 points</span></div>
          </div>

          <div className="a1-final-mock-rules">
            <strong>Pass mark: 60/100</strong>
            <p>Your first completed attempt is kept as your readiness score. Later attempts are saved as practice attempts.</p>
            <p>Your progress is saved automatically. Completed sections are locked. <strong>Leaving does not pause the section timer.</strong> Return to this page to resume the unfinished attempt; it is not a failed mock.</p>
          </div>

          {error ? <p className="a1-final-mock-error">{error}</p> : null}
          <button type="button" className="a1-final-mock-start" onClick={() => startExam()} disabled={busy === "start"}>
            {busy === "start" ? "Preparing mock …" : "Start or resume all 4 modules"}
          </button>
        </article>
      </main>
    );
  }

  return (
    <main className="a1-goethe-mock-shell a1-final-mock-shell" data-a1-final-mock>
      <div className="a1-goethe-mock-topbar">
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span className="a1-goethe-mock-preview-badge">
          {exam.completed ? "Mock complete" : "A1 Final Mock"}
        </span>
      </div>

      {exam.stage !== "result" ? <FullMockGuide level="A1" stage={exam.stage} completedSkills={FULL_MOCK_SKILLS.filter((skill) => Object.prototype.hasOwnProperty.call(exam.sectionScores || {}, skill.key)).map((skill) => skill.key)} /> : null}

      {exam.stage === "lesen" ? renderLesen() : null}
      {exam.stage === "hoeren" ? renderHoeren() : null}
      {exam.stage === "schreiben" ? renderSchreiben() : null}
      {exam.stage === "sprechen" ? (
        <>
          <SectionHeader label="Sprechen · 15 min" secondsLeft={secondsLeft} attemptInfo={exam.attemptInfo} />
          <A1GoetheSpeakingMockPreview
            embedded
            autoStart
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
