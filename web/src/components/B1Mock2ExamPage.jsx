import { canReviewFullMock, restoreFullMockReviewState } from "../utils/mockReviewAccess";
import WritingMistakeList from "./WritingMistakeList";
import { arrangeMockChoices } from "../utils/mockChoicePresentation";
import { useAssessmentRestriction } from "../hooks/useAssessmentRestriction";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { announceExamSuccess } from "../services/interactionFeedback";
import { getMockWritingSubmissionError } from "../services/mockWritingSubmissionError";
import { useAuth } from "../context/AuthContext";

import {
  saveB1MockAttempt,
  scoreB1MockWriting,
  startB1MockAttempt,
} from "../services/b1FinalMockService";
import { B1_READING, B1_WRITING_TASKS } from "../data/b1Mock2Data";
import B1Mock2Hoeren from "./B1Mock2Hoeren";
import axios from "axios";
import { getBackendUrl } from "../services/backendUrl";
import B1Mock2Speaking from "./B1Mock2Speaking";
import { FullMockGuide, FullMockRecovery } from "./FullMockGuidance";
import { FULL_MOCK_SKILLS } from "../utils/fullMockProgress";
import { B1_MOCK_STEPS, getB1MockProgress, getB1MockPracticeRecommendations } from "../utils/b1MockProgress";
import "./B1FinalMockExamPage.css";

const B1_FINAL_MOCK_ID="b1-mock-02";
const B1_FINAL_MOCK_STORAGE_KEY="falowen:b1-final-mock:b1-mock-02";
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
  hoerenAudio: {},
  schreiben: { teil1: "", teil2: "", teil3: "" },
  speakingProgress: { attempts: {} },
  schreibenResult: null,
  speakingResult: null,
  lesenResult: null,
  hoerenResult: null,
  sectionScores: {},
  overall: null,
  writingPending: false,
  completed: false,
  completionVerified: false,
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

const hoerenQuestions = [];

const wordCount = (text) => String(text || "").trim().split(/\s+/).filter(Boolean).length;

const readStoredState = (key) => {
  if (typeof window === "undefined") return emptyState();
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || "null");
    return parsed?.mockId === B1_FINAL_MOCK_ID ? restoreFullMockReviewState({ ...emptyState(), ...parsed }) : emptyState();
  } catch (_error) {
    return emptyState();
  }
};

const ChoiceList = ({ name, options, value, onChange }) => (
  <div className="b1-final-choices" role="radiogroup">
    {arrangeMockChoices(options, name).map((option) => {
      const id = option.id;
      const label = option.label;
      return (
        <label key={id} className={String(value) === String(id) ? "selected" : ""}>
          <input
            type="radio"
            name={name}
            checked={String(value) === String(id)}
            onChange={() => onChange(id)}
          />
          <strong>{["richtig", "falsch"].includes(String(id)) ? "" : option.displayId}</strong>
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

const ReadingPart = ({ children, title, time }) => (
  <section className="b1-final-paper">
    <div className="b1-final-part-heading">
      <h2>{title}</h2>
      {time ? <span>{time}</span> : null}
    </div>
    {children}
  </section>
);

export default function B1Mock2ExamPage() {
  useAssessmentRestriction();
  const { idToken, user } = useAuth();
  const storageKey = `${B1_FINAL_MOCK_STORAGE_KEY}:${user?.uid || "guest"}`;
  const [exam, setExam] = useState(() => readStoredState(storageKey));
  const [now, setNow] = useState(Date.now());
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [confirmIncompleteHoeren, setConfirmIncompleteHoeren] = useState(false);
  const saveTimerRef = useRef(null);
  const lastAutosaveStageRef = useRef("");
  const timeoutHandledRef = useRef("");
  const completionSavedRef = useRef("");
  const completionRetryCountRef = useRef(0);
  const savedCompletionToastRef = useRef("");
  const savedStageToastRef = useRef("");
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

    if (!exam.attemptInfo?.attemptId || !idToken || (exam.completed && !exam.writingPending)) return undefined;
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);

    const stageIdentity = `${exam.attemptInfo.attemptId}:${exam.stage}`;
    const stageChanged = stageIdentity !== lastAutosaveStageRef.current;
    lastAutosaveStageRef.current = stageIdentity;
    saveTimerRef.current = window.setTimeout(() => {
      saveB1MockAttempt({
        idToken,
        attemptId: exam.attemptInfo.attemptId,
        section: exam.stage,
        state: persisted,
        sectionScores: exam.sectionScores,
        status: "in_progress",
        overall: exam.overall,
      }).then(() => {
        const stageKey = `${exam.attemptInfo.attemptId}:${exam.stage}`;
        if (savedStageToastRef.current !== stageKey) {
          savedStageToastRef.current = stageKey;
          announceExamSuccess("Mock progress saved successfully.");
        }
      }).catch((saveError) => {
        console.error("Could not autosave B1 mock", saveError);
      });
    }, stageChanged ? 0 : 12000);

    return () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    };
  }, [exam, idToken, storageKey]);

  useEffect(() => {
    const attemptId = exam.attemptInfo?.attemptId;
    if (!exam.completed || exam.writingPending || exam.completionVerified || !attemptId || !idToken) return undefined;

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
        if(!response?.verifiedOverall || !response?.verifiedSectionScores || response.status!=="completed"){
          throw new Error("Waiting for authoritative server-verified B1 Mock 2 results.");
        }
        setExam(current=>({
          ...current,completionVerified:true,overall:response.verifiedOverall,
          sectionScores:response.verifiedSectionScores,
        }));

        if (savedCompletionToastRef.current !== attemptId) {
          savedCompletionToastRef.current = attemptId;
          announceExamSuccess("B1 mock result saved successfully.");
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
    exam.completionVerified,
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
    const previousSection = { hoeren: "Lesen", schreiben: "Hören", sprechen: "Schreiben" }[stage];
    if (previousSection) announceExamSuccess(`${previousSection} completed successfully. Continue to ${{ hoeren: "Hören", schreiben: "Schreiben", sprechen: "Sprechen" }[stage]}.`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const startExam = async ({ forceNew = false } = {}) => {
    if (busy) return;
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
        announceExamSuccess("B1 mock resumed successfully.");
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
      announceExamSuccess("B1 mock started successfully.");
    } catch (startError) {
      setError(startError?.response?.data?.error || startError?.message || "Could not start the B1 mock.");
    } finally {
      setBusy("");
    }
  };

  const submitLesen = useCallback(async () => {
    if(busy==="lesen")return;
    setBusy("lesen");setError("");
    try{
      const response=await axios.post(`${getBackendUrl()}/b1-mock-02/lesen/score`,
        {answers:exam.lesenAnswers},{headers:{Authorization:`Bearer ${idToken}`}});
      const result=response.data;
      if(result.mockId!=="b1-mock-02"||result.total!==30)throw new Error("Lesen score not verified.");
      moveToSection("hoeren",{lesenResult:result,
        sectionScores:{...exam.sectionScores,lesen:result.score}});
    }catch(error){
      setError(error?.response?.data?.error||error.message||"Lesen konnte nicht bewertet werden. Antworten bleiben gespeichert.");
    }finally{setBusy("");}
  }, [busy,exam.lesenAnswers,exam.sectionScores,idToken,moveToSection]);
  const updateHoerenProgress=useCallback((answers)=>{
    const keyed={};
    for(const [number,answer] of Object.entries(answers||{})){
      const n=Number(number);
      if(!Number.isInteger(n)||n<1||n>30)continue;
      const part=n<=10?1:n<=15?2:n<=22?3:4;
      keyed[`t${part}-${n}`]=answer;
    }
    setExam(current=>JSON.stringify(current.hoerenAnswers||{})===JSON.stringify(keyed)?current:{...current,hoerenAnswers:keyed});
  },[]);
  const onMock2HoerenComplete=useCallback(({answers,result})=>{
    const keyed={};
    for(const [number,answer] of Object.entries(answers||{})){
      const n=Number(number);
      if(!Number.isInteger(n)||n<1||n>30)continue;
      const part=n<=10?1:n<=15?2:n<=22?3:4;
      keyed[`t${part}-${n}`]=answer;
    }
    const score=Number((result.correct/30*25).toFixed(1));
    moveToSection("schreiben",{hoerenAnswers:keyed,hoerenResult:result,sectionScores:{...exam.sectionScores,hoeren:score}});
  },[exam.sectionScores,moveToSection]);

  const submitHoeren = useCallback(() => {
    moveToSection("schreiben",{hoerenResult:{correct:0,total:30,score:0,timedOut:true},
      sectionScores:{...exam.sectionScores,hoeren:0}});
  },[exam.sectionScores,moveToSection]);

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
        writingPending: false,
        sectionScores: { ...exam.sectionScores, schreiben: Number(result?.score || 0) },
      });
    } catch (markError) {
      // Submission and grading are separate. The student keeps the text and
      // moves to Sprechen; no final score is released until retry succeeds.
      moveToSection("sprechen", { writingPending: true });
      setError("");
    } finally {
      setBusy("");
    }
  }, [busy, exam.attemptInfo?.attemptId, exam.schreiben, exam.sectionScores, idToken, moveToSection]);

  const retryPendingWriting = async () => {
    if (busy || !exam.writingPending) return;
    setBusy("schreiben"); setError("");
    try {
      const result = await scoreB1MockWriting({ ...exam.schreiben, attemptId: exam.attemptInfo?.attemptId || "", idToken });
      setExam(current => {
        const sectionScores = {...current.sectionScores, schreiben:Number(result?.score || 0)};
        const total = Number(Object.values(sectionScores)
          .reduce((sum, n) => sum + Number(n || 0), 0).toFixed(1));
        return {...current, schreibenResult:result, writingPending:false, sectionScores,
          overall:current.completed ? {score:total, maxScore:100, passed:total >= 60} : current.overall};
      });
    } catch (markError) {
      setError(getMockWritingSubmissionError(markError));
    } finally { setBusy(""); }
  };

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
    announceExamSuccess("B1 mock completed! Saving your final result.");
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
  const hoerenAudioFinished = 0;
  const hoerenAnswered = Object.keys(exam.hoerenAnswers||{}).length;
  const hoerenIncomplete = hoerenAnswered < 30;
  const confirmHoerenFinish = () => {
    if (secondsLeft > 0 && hoerenIncomplete) {
      setConfirmIncompleteHoeren(true);
      return;
    }
    submitHoeren();
  };

  if (exam.stage === "result" && exam.writingPending) {
    return <main className="b1-final-shell">
      <AppBackButton label="Back to Exams Room" fallbackPath="/exams/overview" />
      <section className="b1-final-rules">
        <h2>All four modules submitted · Schreiben feedback pending</h2>
        <p>Your writing answers are saved in your attempt. AI marking can be retried without repeating Lesen, Hören or Sprechen. Your overall mark will not be published until writing is graded.</p>
        {error ? <p role="alert">{error}</p> : null}
        <button type="button" disabled={busy==="schreiben"} onClick={retryPendingWriting}>
          {busy==="schreiben" ? "Marking…" : "Retry Schreiben marking"}
        </button>
      </section>
    </main>;
  }
  if (exam.stage === "intro") {
    return (
      <main className="b1-final-shell">
        <AppBackButton label="Back to course" fallbackPath="/campus/course" />
        <header className="b1-final-hero">
          <p>B1 · Mock 2 · Complete mock</p>
          <h1>GOETHE-ZERTIFIKAT B1 Mock 2</h1>
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

  if (exam.stage === "result" && !exam.writingPending && !exam.completionVerified) {
    return <main className="b1-final-shell">
      <AppBackButton label="Back to Exams Room" fallbackPath="/exams/overview" />
      <section className="b1-final-rules">
        <h2>Verifying your B1 Mock 2 result</h2>
        <p>All four sections are submitted. Falowen will show a final result only after the server has verified the objective keys and both AI-marked sections.</p>
        {error ? <p role="alert">{error}</p> : null}
        <button type="button" onClick={()=>setCompletionRetryNonce(n=>n+1)}>Retry verification</button>
      </section>
    </main>;
  }
  if (exam.stage === "result" && exam.completionVerified && canReviewFullMock(exam)) {
    const entries = Object.entries(exam.sectionScores || {});
    const sorted = [...entries].sort((a, b) => Number(b[1]) - Number(a[1]));
    const recommendations = getB1MockPracticeRecommendations(exam.sectionScores);
    const weakest = recommendations[0];
    return (
      <main className="b1-final-shell">
        <AppBackButton label="Back to Exams Room" fallbackPath="/exams/overview" />
        <header className="b1-final-hero">
          <p>B1 Mock 2 · All four sections completed</p>
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
          {Object.entries(exam.schreibenResult?.parts || {}).map(([key, part]) => (
            <section key={key}>
              <h4>{key.replace("teil", "Teil ")} · {part.score}/{part.maxScore}</h4>
              <p>{part.feedback_en}</p>
              <WritingMistakeList corrections={part.corrections} level="B1" />
            </section>
          ))}
          {exam.speakingResult?.overall_feedback_en ? <p>{exam.speakingResult.overall_feedback_en}</p> : null}

        </section>
      </main>
    );
  }

  return (
    <main className="b1-final-shell">
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
              <p><em>Eure Laura</em></p>
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
                <article key={letter} className={letter === "E" ? "example" : ""}>
                  <span>Anzeige {letter}{letter === "E" ? " · Beispiel" : ""}</span>
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
                    {"ABCDEFGHIJ".split("").filter((letter) => letter !== "E").map((letter) => (
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

          <button type="button" className="b1-final-primary b1-final-submit" onClick={submitLesen} disabled={busy==="lesen"}>Finish Lesen (1/4) → Hören (2/4)</button>
        </>
      ) : null}

      {exam.stage === "hoeren" ? (
        <B1Mock2Hoeren embedded attemptId={exam.attemptInfo?.attemptId||""}
          initialAnswers={Object.fromEntries(Object.entries(exam.hoerenAnswers||{}).map(([key,value])=>[key.split("-").pop(),value]))}
          onProgress={updateHoerenProgress}
          onComplete={onMock2HoerenComplete} expired={secondsLeft<=0}/>
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
                  placeholder="" autoComplete="off"
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
        <B1Mock2Speaking
          externalSecondsLeft={secondsLeft}
          initialAttempts={exam.speakingProgress?.attempts || {}}
          initialResult={exam.speakingResult}
          initialSelectedTopicId={exam.speakingProgress?.selectedTopicId||"a"}
          attemptId={exam.attemptInfo?.attemptId || ""}
          onProgress={handleSpeakingProgress}
          onComplete={finishSpeaking}
        />
      ) : null}
    </main>
  );
}
