import { useMockExamIntegrity, MockExamIntegrityNotice } from "../hooks/useMockExamIntegrity";
import { useAssessmentRestriction } from "../hooks/useAssessmentRestriction";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { getMockWritingSubmissionError } from "../services/mockWritingSubmissionError";
import { useAuth } from "../context/AuthContext";
import { fetchB1MockAudioPlaybackUrl } from "../services/b1AudioService";
import {
  B1_FINAL_MOCK_ID,
  B1_FINAL_MOCK_STORAGE_KEY,
  saveB1MockAttempt,
  scoreB1MockWriting,
  startB1MockAttempt,
} from "../services/b1FinalMockService";
import { B1_LISTENING, B1_READING, B1_WRITING_TASKS } from "../data/b1FinalMockData";
import B1FinalMockSpeaking from "./B1FinalMockSpeaking";
import { FullMockGuide, FullMockRecovery } from "./FullMockGuidance";
import { FULL_MOCK_SKILLS } from "../utils/fullMockProgress";
import { B1_MOCK_STEPS, getB1MockProgress, getB1MockPracticeRecommendations } from "../utils/b1MockProgress";
import "./B1FinalMockExamPage.css";

const SECTION_DURATIONS = Object.freeze({
  lesen: 65 * 60,
  hoeren: 40 * 60,
  schreiben: 75 * 60,
  sprechen: 20 * 60,
});

const SECTION_LABELS = Object.freeze({
  lesen: "Lesen",
  hoeren: "Hören",
  schreiben: "Schreiben",
  sprechen: "Sprechen",
});

const emptyState = () => ({
  version: 1,
  mockId: B1_FINAL_MOCK_ID,
  stage: "intro",
  sectionDeadlineMs: null,
  attemptInfo: null,
  lesenAnswers: {},
  hoerenAnswers: {},
  hoerenAudio: Object.fromEntries(B1_LISTENING.map((part) => [part.id, "not_started"])),
  schreiben: { teil1: "", teil2: "", teil3: "" },
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
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  if (hours) return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
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
  return { correct, total: questions.length, score: normalizeScore(correct, questions.length), maxScore: 25 };
};

const lesenQuestions = [
  ...B1_READING.teil1.questions.map((q) => ({ ...q, key: `t1-${q.number}` })),
  ...B1_READING.teil2.questions.map((q) => ({ ...q, key: `t2-${q.number}` })),
  ...B1_READING.teil2.text2.questions.map((q) => ({ ...q, key: `t2-${q.number}` })),
  ...B1_READING.teil3.situations.map((q) => ({ ...q, question: q.text, key: `t3-${q.number}` })),
  ...B1_READING.teil4.comments.map((q) => ({ ...q, question: q.person, key: `t4-${q.number}` })),
  ...B1_READING.teil5.questions.map((q) => ({ ...q, key: `t5-${q.number}` })),
];

const hoerenQuestions = B1_LISTENING.flatMap((part, index) =>
  part.questions.map((q) => ({ ...q, key: `t${index + 1}-${q.number}` })),
);

const wordCount = (text) => String(text || "").trim().split(/\s+/).filter(Boolean).length;

const readStoredState = (key) => {
  if (typeof window === "undefined") return emptyState();
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || "null");
    return parsed?.mockId === B1_FINAL_MOCK_ID ? { ...emptyState(), ...parsed } : emptyState();
  } catch (_error) {
    return emptyState();
  }
};

const ChoiceList = ({ name, options, value, onChange }) => (
  <div className="b1-final-choices" role="radiogroup">
    {options.map((option) => {
      const id = Array.isArray(option) ? option[0] : option.id;
      const label = Array.isArray(option) ? option[1] : option.label;
      return (
        <label key={id} className={String(value) === String(id) ? "selected" : ""}>
          <input
            type="radio"
            name={name}
            checked={String(value) === String(id)}
            onChange={() => onChange(id)}
          />
          <strong>{["richtig", "falsch"].includes(String(id)) ? "" : id}</strong>
          <span>{label}</span>
        </label>
      );
    })}
  </div>
);

const SectionBar = ({ stage, secondsLeft, attemptInfo }) => (
  <div className="b1-final-sectionbar">
    <div><span>Full mock progress</span><strong>Module {B1_MOCK_STEPS.findIndex((step) => step.key === stage) + 1}/4 · {SECTION_LABELS[stage]}</strong></div>
    <div><span>Time left</span><strong className={secondsLeft <= 120 ? "warning" : ""}>{formatTime(secondsLeft)}</strong></div>
    <div><span>Attempt</span><strong>{attemptInfo?.firstAttempt ? "Readiness 1" : `Practice ${attemptInfo?.attemptNumber || ""}`}</strong></div>
  </div>
);

function LockedAudio({ part, idToken, status, onStatusChange, expired }) {
  const ref = useRef(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(status === "started" || status === "ended");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let active = true;
    fetchB1MockAudioPlaybackUrl({
      mockId: "mock-01",
      part: part.id,
      key: part.audioObjectKey,
      idToken,
    })
      .then((result) => active && setUrl(result.url))
      .catch((loadError) => active && setError(loadError?.message || "Audio could not be prepared."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [idToken, part.audioObjectKey, part.id]);

  useEffect(() => {
    if (expired) ref.current?.pause();
  }, [expired]);

  const start = () => {
    if (!ref.current || !url || loading || expired || status === "ended") return;
    ref.current.currentTime = 0;
    ref.current.play()
      .then(() => {
        setStarted(true);
        onStatusChange("started");
      })
      .catch((playError) => setError(playError?.message || "Audio could not start."));
  };

  return (
    <div className="b1-final-audio">
      <audio
        ref={ref}
        src={url}
        preload="metadata"
        onTimeUpdate={(event) => {
          const current = Number(event.currentTarget.currentTime || 0);
          const duration = Number(event.currentTarget.duration || 0);
          setProgress(duration ? Math.min(100, Math.round((current / duration) * 100)) : 0);
        }}
        onEnded={() => {
          setProgress(100);
          onStatusChange("ended");
        }}
      />
      <div>
        <strong>{part.title} · Exam audio</strong>
        <p>{part.note}</p>
      </div>
      <div className="b1-final-audio-progress"><span style={{ width: `${progress}%` }} /></div>
      {status === "ended" ? (
        <strong className="done">Audio finished</strong>
      ) : (
        <button type="button" onClick={start} disabled={loading || !url || expired || started}>
          {loading ? "Preparing audio …" : started ? "Audio playing …" : "Start audio"}
        </button>
      )}
      {error ? <p className="b1-final-error">{error}</p> : null}
    </div>
  );
}

const ReadingPart = ({ children, title, time }) => (
  <section className="b1-final-paper">
    <div className="b1-final-part-heading">
      <h2>{title}</h2>
      {time ? <span>{time}</span> : null}
    </div>
    {children}
  </section>
);

export default function B1FinalMockExamPage() {
  useAssessmentRestriction();
  const { idToken, user } = useAuth();
  const storageKey = `${B1_FINAL_MOCK_STORAGE_KEY}:${user?.uid || "guest"}`;
  const [exam, setExam] = useState(() => readStoredState(storageKey));
  const integrity = useMockExamIntegrity({ level: "B1", mockId: B1_FINAL_MOCK_ID, idToken, attemptId: exam.attemptInfo?.attemptId, section: exam.stage, active: Boolean(exam.attemptInfo?.attemptId && !exam.completed && SECTION_DURATIONS[exam.stage]) });
  const [now, setNow] = useState(Date.now());
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [confirmIncompleteHoeren, setConfirmIncompleteHoeren] = useState(false);
  const saveTimerRef = useRef(null);
  const timeoutHandledRef = useRef("");
  const completionSavedRef = useRef("");
  const completionRetryCountRef = useRef(0);
  const completionRetryTimerRef = useRef(null);
  const [completionRetryNonce, setCompletionRetryNonce] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const persisted = { ...exam, clientSavedAtMs: Date.now() };

    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, JSON.stringify(persisted));
    }

    if (!exam.attemptInfo?.attemptId || !idToken || exam.completed) return undefined;
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);

    saveTimerRef.current = window.setTimeout(() => {
      saveB1MockAttempt({
        idToken,
        attemptId: exam.attemptInfo.attemptId,
        section: exam.stage,
        state: persisted,
        sectionScores: exam.sectionScores,
        status: "in_progress",
        overall: exam.overall,
      }).catch((saveError) => {
        console.error("Could not autosave B1 mock", saveError);
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
    if (completionSavedRef.current === completionKey) return undefined;
    completionSavedRef.current = completionKey;

    let cancelled = false;

    saveB1MockAttempt({
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
          throw new Error(response.completionSync.error || "Could not sync final B1 mock result.");
        }

        completionRetryCountRef.current = 0;
        if (completionRetryTimerRef.current) {
          window.clearTimeout(completionRetryTimerRef.current);
          completionRetryTimerRef.current = null;
        }
      })
      .catch((saveError) => {
        if (cancelled) return;
        console.error("Could not finalize B1 mock result sync", saveError);
        completionSavedRef.current = "";

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
      if (completionSavedRef.current === completionKey) {
        completionSavedRef.current = "";
      }
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
    integrity.requestFullscreen();
    setBusy("start");
    setError("");
    try {
      if (forceNew && exam.completed && exam.attemptInfo?.attemptId) {
        await saveB1MockAttempt({
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

      const response = await startB1MockAttempt({ idToken, mockId: B1_FINAL_MOCK_ID });
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
      setError(startError?.response?.data?.error || startError?.message || "Could not start the B1 mock.");
    } finally {
      setBusy("");
    }
  };

  const submitLesen = useCallback(() => {
    const result = scoreObjective(exam.lesenAnswers, lesenQuestions);
    moveToSection("hoeren", {
      lesenResult: result,
      sectionScores: { ...exam.sectionScores, lesen: result.score },
    });
  }, [exam.lesenAnswers, exam.sectionScores, moveToSection]);

  const submitHoeren = useCallback(() => {
    const result = scoreObjective(exam.hoerenAnswers, hoerenQuestions);
    moveToSection("schreiben", {
      hoerenResult: result,
      sectionScores: { ...exam.sectionScores, hoeren: result.score },
    });
  }, [exam.hoerenAnswers, exam.sectionScores, moveToSection]);

  const submitSchreiben = useCallback(async () => {
    if (busy) return;
    setBusy("schreiben");
    setError("");
    try {
      const result = await scoreB1MockWriting({
        ...exam.schreiben,
        attemptId: exam.attemptInfo?.attemptId || "",
        idToken,
      });
      moveToSection("sprechen", {
        schreibenResult: result,
        sectionScores: { ...exam.sectionScores, schreiben: Number(result?.score || 0) },
      });
    } catch (markError) {
      setError(getMockWritingSubmissionError(markError));
    } finally {
      setBusy("");
    }
  }, [busy, exam.attemptInfo?.attemptId, exam.schreiben, exam.sectionScores, idToken, moveToSection]);

  const handleSpeakingProgress = useCallback((progress) => {
    setExam((current) => ({
      ...current,
      speakingProgress: { ...current.speakingProgress, ...progress },
    }));
  }, []);

  const finishSpeaking = useCallback((speakingResult) => {
    setExam((current) => {
      const scores = { ...current.sectionScores, sprechen: Number(speakingResult?.score || 0) };
      const overallScore = Number(Object.values(scores).reduce((sum, value) => sum + Number(value || 0), 0).toFixed(1));
      return {
        ...current,
        stage: "result",
        sectionDeadlineMs: null,
        speakingResult,
        sectionScores: scores,
        overall: { score: overallScore, maxScore: 100, passed: overallScore >= 60 },
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

  const setLesen = (key, value) => setExam((current) => ({
    ...current, lesenAnswers: { ...current.lesenAnswers, [key]: value },
  }));
  const setHoeren = (key, value) => setExam((current) => ({
    ...current, hoerenAnswers: { ...current.hoerenAnswers, [key]: value },
  }));

  const mockProgress = getB1MockProgress(exam.stage, exam.sectionScores);
  const hoerenAudioFinished = B1_LISTENING.filter((part) => exam.hoerenAudio?.[part.id] === "ended").length;
  const hoerenAnswered = hoerenQuestions.filter((question) => Boolean(exam.hoerenAnswers?.[question.key])).length;
  const hoerenIncomplete = hoerenAudioFinished < B1_LISTENING.length || hoerenAnswered < hoerenQuestions.length;
  const confirmHoerenFinish = () => {
    if (secondsLeft > 0 && hoerenIncomplete) {
      setConfirmIncompleteHoeren(true);
      return;
    }
    submitHoeren();
  };

  if (exam.stage === "intro") {
    return (
      <main className="b1-final-shell">
        <AppBackButton label="Back to course" fallbackPath="/campus/course" />
        <header className="b1-final-hero">
          <p>B1 · Day 29 · Complete mock</p>
          <h1>GOETHE-ZERTIFIKAT B1 Mock 1</h1>
          <p>This is <strong>one four-section exam</strong>, not four separate short mocks. You must finish Lesen, Hören, Schreiben <strong>and</strong> Sprechen to receive your final result.</p>
        </header>
        <section className="b1-final-rules">
          <h2>Before you start</h2>
          <FullMockGuide level="B1" stage="intro" />
          <div className="b1-final-duration-grid">
            <div><strong>Lesen</strong><span>65 min</span></div>
            <div><strong>Hören</strong><span>40 min</span></div>
            <div><strong>Schreiben</strong><span>75 min</span></div>
            <div><strong>Sprechen</strong><span>20 min</span></div>
          </div>
          <p><strong>How it works:</strong> Finish Lesen (1 of 4), then Hören (2 of 4), Schreiben (3 of 4), and Sprechen (4 of 4). Hören contains four audio Teile, and Sprechen has three speaking tasks.</p>
          <p><strong>If you leave early:</strong> Your answers are saved. Return to this mock to continue your unfinished attempt; the section timer is <strong>not paused</strong> while you are away. An unfinished mock is not a failed mock.</p>
          <p>Audio parts can only be started once in the active attempt. The speaking partner audio already contains the response windows.</p>
          <button type="button" className="b1-final-primary" onClick={() => startExam()} disabled={busy === "start"}>
            {busy === "start" ? "Opening mock …" : "Start or resume complete B1 mock"}
          </button>
          {error ? <p className="b1-final-error">{error}</p> : null}
        </section>
      </main>
    );
  }

  if (exam.stage === "result") {
    const entries = Object.entries(exam.sectionScores || {});
    const sorted = [...entries].sort((a, b) => Number(b[1]) - Number(a[1]));
    const recommendations = getB1MockPracticeRecommendations(exam.sectionScores);
    const weakest = recommendations[0];
    return (
      <main className="b1-final-shell">
        <AppBackButton label="Back to Exams Room" fallbackPath="/exams/overview" />
        <header className="b1-final-hero">
          <p>B1 Mock 1 · All four sections completed</p>
          <h1>{exam.overall?.score || 0}%</h1>
          <p className={exam.overall?.passed ? "b1-final-pass" : "b1-final-needs-work"}>
            {exam.overall?.passed ? "PASS" : "NEEDS MORE PRACTICE"}
          </p>
        </header>
        <FullMockGuide level="B1" stage="result" completedSkills={FULL_MOCK_SKILLS.filter((skill) => Object.prototype.hasOwnProperty.call(exam.sectionScores || {}, skill.key)).map((skill) => skill.key)} complete={exam.completed} />
        <section className="b1-final-result-grid">
          {entries.map(([key, score]) => (
            <div key={key}><span>{SECTION_LABELS[key]}</span><strong>{score}/25</strong></div>
          ))}
        </section>
        <section className="b1-final-rules">
          <p><strong>Strongest:</strong> {SECTION_LABELS[sorted[0]?.[0]] || "—"}</p>
          <p><strong>Practise next:</strong> {weakest?.label || SECTION_LABELS[sorted[sorted.length - 1]?.[0]] || "—"}{weakest ? ` (${weakest.score}/25)` : ""}</p>
          <p>{exam.overall?.passed
            ? "You completed the full mock. You can strengthen any weaker module before your next attempt."
            : "You have completed the whole mock, but your overall score needs improvement. You do not have to restart immediately: practise the sections that need work, then retake the full mock when ready."}</p>
          <FullMockRecovery level="B1" sectionScores={exam.sectionScores} onRetake={() => startExam({ forceNew: true })} retakeDisabled={busy === "start"} retakeNote="A new full attempt begins with Lesen. Your completed result stays in the history." />
          {exam.schreibenResult?.overall_feedback_en ? <p>{exam.schreibenResult.overall_feedback_en}</p> : null}
          {exam.speakingResult?.overall_feedback_en ? <p>{exam.speakingResult.overall_feedback_en}</p> : null}

        </section>
      </main>
    );
  }

  return (
    <main className="b1-final-shell" onCopyCapture={integrity.onCopyCapture} onPasteCapture={integrity.onPasteCapture}>
      <MockExamIntegrityNotice guard={integrity} />
      <AppBackButton label="Leave mock (answers saved; timer continues)" fallbackPath="/campus/course" />
      <SectionBar stage={exam.stage} secondsLeft={secondsLeft} attemptInfo={exam.attemptInfo} />
      <FullMockGuide level="B1" stage={exam.stage} completedSkills={FULL_MOCK_SKILLS.filter((skill) => Object.prototype.hasOwnProperty.call(exam.sectionScores || {}, skill.key)).map((skill) => skill.key)} />
      <p className="b1-final-small-note" role="status">
        Section {mockProgress.currentIndex + 1} of 4 · Completing this section will open
        {mockProgress.nextStep ? ` ${mockProgress.nextStep.label}` : " your final result"}. Do not leave after only one section.
      </p>
      {error ? <p className="b1-final-error">{error}</p> : null}

      {exam.stage === "lesen" ? (
        <>
          <header className="b1-final-module-header"><p>GOETHE-ZERTIFIKAT B1</p><h1>Lesen</h1></header>

          <ReadingPart title="Teil 1" time="10 Minuten">
            <p>{B1_READING.teil1.intro}</p>
            <div className="b1-final-reading-text">
              <h3>{B1_READING.teil1.heading}</h3>
              <em>{B1_READING.teil1.subheading}</em>
              <strong>{B1_READING.teil1.date}</strong>
              {B1_READING.teil1.paragraphs.map((p) => <p key={p}>{p}</p>)}
              <p>Bis bald,<br /><em>eure Susanne</em></p>
            </div>
            {B1_READING.teil1.questions.map((q) => (
              <div className="b1-final-question" key={q.number}>
                <strong>{q.number}. {q.question}</strong>
                <ChoiceList
                  name={`lesen-t1-${q.number}`}
                  options={[["richtig","Richtig"],["falsch","Falsch"]]}
                  value={exam.lesenAnswers[`t1-${q.number}`]}
                  onChange={(value) => setLesen(`t1-${q.number}`, value)}
                />
              </div>
            ))}
          </ReadingPart>

          <ReadingPart title="Teil 2 · Text 1" time="20 Minuten · gesamter Teil 2">
            <div className="b1-final-press-text">
              <small>Text aus der Presse</small>
              <h3>{B1_READING.teil2.heading}</h3>
              {B1_READING.teil2.paragraphs.map((p) => <p key={p}>{p}</p>)}
            </div>
            {B1_READING.teil2.questions.map((q) => (
              <div className="b1-final-question" key={q.number}>
                <strong>{q.number}. {q.question}</strong>
                <ChoiceList name={`lesen-t2-${q.number}`} options={q.options}
                  value={exam.lesenAnswers[`t2-${q.number}`]}
                  onChange={(value) => setLesen(`t2-${q.number}`, value)} />
              </div>
            ))}

            <div className="b1-final-text-divider">
              <strong>{B1_READING.teil2.text2.title}</strong>
              <span>Aufgaben 10–12</span>
            </div>
            <p>{B1_READING.teil2.text2.intro}</p>
            <div className="b1-final-press-text">
              <small>Text aus der Presse</small>
              <h3>{B1_READING.teil2.text2.heading}</h3>
              {B1_READING.teil2.text2.paragraphs.map((p) => <p key={p}>{p}</p>)}
            </div>
            {B1_READING.teil2.text2.questions.map((q) => (
              <div className="b1-final-question" key={q.number}>
                <strong>{q.number}. {q.question}</strong>
                <ChoiceList name={`lesen-t2-${q.number}`} options={q.options}
                  value={exam.lesenAnswers[`t2-${q.number}`]}
                  onChange={(value) => setLesen(`t2-${q.number}`, value)} />
              </div>
            ))}
          </ReadingPart>

          <ReadingPart title="Teil 3">
            <p>{B1_READING.teil3.context}</p>
            <div className="b1-final-ads">
              {B1_READING.teil3.ads.map(([letter, title, copy]) => (
                <article key={letter} className={letter === "C" ? "example" : ""}>
                  <span>Anzeige {letter}{letter === "C" ? " · Beispiel" : ""}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
            <div className="b1-final-situations">
              {B1_READING.teil3.situations.map((q) => (
                <label key={q.number}>
                  <span><strong>{q.number}.</strong> {q.text}</span>
                  <select
                    value={exam.lesenAnswers[`t3-${q.number}`] || ""}
                    onChange={(event) => setLesen(`t3-${q.number}`, event.target.value)}
                  >
                    <option value="">Anzeige wählen</option>
                    <option value="0">0 · keine passende Anzeige</option>
                    {"ABCDEFGHIJ".split("").filter((letter) => letter !== "C").map((letter) => (
                      <option value={letter.toLowerCase()} key={letter}>{letter}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </ReadingPart>

          <ReadingPart title="Teil 4" time="15 Minuten">
            <p>{B1_READING.teil4.context}</p>
            {B1_READING.teil4.comments.map((q) => (
              <div className="b1-final-comment" key={q.number}>
                <p><strong>{q.number}. {q.person}:</strong> „{q.text}“</p>
                <ChoiceList name={`lesen-t4-${q.number}`} options={[["ja","Ja"],["nein","Nein"]]}
                  value={exam.lesenAnswers[`t4-${q.number}`]}
                  onChange={(value) => setLesen(`t4-${q.number}`, value)} />
              </div>
            ))}
          </ReadingPart>

          <ReadingPart title="Teil 5" time="10 Minuten">
            <p>{B1_READING.teil5.context}</p>
            <div className="b1-final-reading-text">
              <h3>{B1_READING.teil5.heading}</h3>
              {B1_READING.teil5.sections.map(([title, copy]) => (
                <div key={title}><h4>{title}</h4><p>{copy}</p></div>
              ))}
            </div>
            {B1_READING.teil5.questions.map((q) => (
              <div className="b1-final-question" key={q.number}>
                <strong>{q.number}. {q.question}</strong>
                <ChoiceList name={`lesen-t5-${q.number}`} options={q.options}
                  value={exam.lesenAnswers[`t5-${q.number}`]}
                  onChange={(value) => setLesen(`t5-${q.number}`, value)} />
              </div>
            ))}
          </ReadingPart>

          <button type="button" className="b1-final-primary b1-final-submit" onClick={submitLesen}>Finish Lesen (1/4) → Hören (2/4)</button>
        </>
      ) : null}

      {exam.stage === "hoeren" ? (
        <>
          <header className="b1-final-module-header">
            <p>GOETHE-ZERTIFIKAT B1 · Module 2 of 4</p>
            <h1>Hören</h1>
            <p>This module has <strong>four separate audio Teile</strong>. Complete all four before moving to Schreiben.</p>
            <p><strong>{hoerenAudioFinished}/4 audio Teile finished · {hoerenAnswered}/30 questions answered</strong></p>
          </header>
          {B1_LISTENING.map((part, partIndex) => (
            <section className="b1-final-paper" key={part.id}>
              <div className="b1-final-part-heading"><h2>{part.title} · Audio {partIndex + 1} of 4</h2></div>
              <LockedAudio
                part={part}
                idToken={idToken}
                status={exam.hoerenAudio?.[part.id]}
                expired={secondsLeft <= 0}
                onStatusChange={(value) => setExam((current) => ({
                  ...current,
                  hoerenAudio: { ...current.hoerenAudio, [part.id]: value },
                }))}
              />
              {part.questions.map((q) => (
                <div className="b1-final-question" key={q.number}>
                  <strong>{q.number}. {q.question}</strong>
                  <ChoiceList
                    name={`hoeren-${part.id}-${q.number}`}
                    options={q.options}
                    value={exam.hoerenAnswers[`t${partIndex + 1}-${q.number}`]}
                    onChange={(value) => setHoeren(`t${partIndex + 1}-${q.number}`, value)}
                  />
                </div>
              ))}
            </section>
          ))}
          {confirmIncompleteHoeren ? (
            <div className="b1-final-hoeren-check" role="alert">
              <strong>Hören is not yet complete.</strong>
              <p>You have finished {hoerenAudioFinished} of 4 audio Teile and answered {hoerenAnswered} of 30 questions.
                Moving on now will score the missing answers as incorrect. It will not finish the full four-module mock.</p>
              <div>
                <button type="button" onClick={() => setConfirmIncompleteHoeren(false)}>Go back and finish Hören</button>
                <button type="button" className="b1-final-primary" onClick={submitHoeren}>Finish Hören anyway → Schreiben</button>
              </div>
            </div>
          ) : (
            <button type="button" className="b1-final-primary b1-final-submit" onClick={confirmHoerenFinish}>
              Finish Hören (2/4) → Schreiben (3/4)
            </button>
          )}
        </>
      ) : null}

      {exam.stage === "schreiben" ? (
        <>
          <header className="b1-final-module-header">
            <p>GOETHE-ZERTIFIKAT B1</p><h1>Schreiben</h1>
            <span>Gesamtdauer: 75 Minuten · Keine Wörterbücher oder Mobiltelefone.</span>
          </header>
          {B1_WRITING_TASKS.map((task) => {
            const text = exam.schreiben?.[task.id] || "";
            return (
              <section className="b1-final-writing-task" key={task.id}>
                <div className="b1-final-part-heading"><h2>{task.title}</h2><span>{task.meta}</span></div>
                <p>{task.prompt}</p>
                <ul>{task.points.map((point) => <li key={point}>{point}</li>)}</ul>
                <div className="b1-final-writing-label">
                  <strong>Ihre Antwort</strong><span>{wordCount(text)} Wörter · ca. {task.target}</span>
                </div>
                <textarea
                  value={text}
                  onChange={(event) => setExam((current) => ({
                    ...current,
                    schreiben: { ...current.schreiben, [task.id]: event.target.value },
                  }))}
                  placeholder="Hier schreiben …"
                  rows={task.id === "teil3" ? 8 : 12}
                />
                <small>Automatisch gespeichert</small>
              </section>
            );
          })}
          <button type="button" className="b1-final-primary b1-final-submit" onClick={submitSchreiben} disabled={busy === "schreiben"}>
            {busy === "schreiben" ? "Marking Schreiben …" : "Finish Schreiben (3/4) → Sprechen (4/4)"}
          </button>
        </>
      ) : null}

      {exam.stage === "sprechen" ? (
        <B1FinalMockSpeaking
          externalSecondsLeft={secondsLeft}
          initialAttempts={exam.speakingProgress?.attempts || {}}
          initialResult={exam.speakingResult}
          attemptId={exam.attemptInfo?.attemptId || ""}
          onProgress={handleSpeakingProgress}
          onComplete={finishSpeaking}
        />
      ) : null}
    </main>
  );
}
