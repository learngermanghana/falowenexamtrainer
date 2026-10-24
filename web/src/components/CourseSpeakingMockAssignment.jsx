import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LiveSpeakPage from "./LiveSpeakPage";
import { SpeakingFeedback } from "./SpeakingPracticeHome";
import { speakingQuestionDictionary } from "../data/speakingDictionary";
import { fetchCourseSpeakingMockStatus, startCourseSpeakingMock, submitCourseSpeakingMock } from "../services/courseSpeakingMockService";
import "./SpeakingExamDesign.css";
import { preserveSpeakingRecovery, readSpeakingRecovery } from "../lib/courseSpeakingRecovery";
import { announceExamSuccess } from "../services/interactionFeedback";

const ASSIGNMENTS = Object.freeze({
  "A1-5.9": { level: "A1", day: 19, title: "Goethe A1 Speaking Confidence Lab" },
  "A2-8.22": { level: "A2", day: 22, title: "Goethe A2 Speaking Mock" },
  "B1-7.23": { level: "B1", day: 23, title: "Goethe B1 Speaking Mock" },
});

const partNumber = value => String(value || "").match(/teil\s*([1-3])/i)?.[1] || "";
const cacheKey = (uid, assignmentKey) => `falowen:graded-speaking:${uid}:${assignmentKey}`;

// A recovered cloud response may contain Teil 2 or Teil 3 without all earlier
// parts. Only a complete, ordered prefix can advance a student's assessment.
export const contiguousVerifiedSpeakingParts = (parts = []) => {
  const ordered = [];
  for (let index = 1; index <= 3; index += 1) {
    const item = parts.find(part => partNumber(part?.teil) === String(index)
      && Boolean(part?.sessionId) && Number(part?.assessment?.maxScore) > 0);
    if (!item) break;
    ordered.push(item);
  }
  return ordered;
};
const sectionNames = {
  A1: ["Sich vorstellen", "Fragen und Antworten", "Bitten und Reagieren"],
  A2: ["Fragen zur Person", "Von sich erzählen", "Gemeinsam etwas planen"],
  B1: ["Gemeinsam etwas planen", "Ein Thema präsentieren", "Fragen beantworten"],
};
const surface = { border: "1px solid #dbe3f0", background: "#fff", borderRadius: 16, padding: "clamp(16px, 3vw, 24px)" };
const button = { border: 0, borderRadius: 12, padding: "12px 18px", fontWeight: 700, color: "#fff", background: "#1d4ed8", cursor: "pointer" };

function chooseTasks(level) {
  const parts = ["1", "2", "3"].map(number => {
    const pool = speakingQuestionDictionary.filter(question =>
      question.level === level && partNumber(question.teilLabel || question.teilId) === number);
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  });
  return parts.every(Boolean) ? parts : null;
}

function readDraft(uid, assignmentKey) {
  if (!uid || typeof window === "undefined") return null;
  try {
    const raw = JSON.parse(window.localStorage.getItem(cacheKey(uid, assignmentKey)) || "null");
    if (!raw || !Array.isArray(raw.tasks) || raw.tasks.length !== 3 ||
        !Array.isArray(raw.results) || raw.results.length > 3) return null;
    return raw;
  } catch { return null; }
}

function saveDraft(uid, assignmentKey, draft) {
  if (!uid || typeof window === "undefined") return;
  try {
    const previous = readDraft(uid, assignmentKey);
    if (previous?.results?.length && (!draft || previous.attemptId !== draft.attemptId)) {
      preserveSpeakingRecovery(window.localStorage, cacheKey(uid, assignmentKey), previous);
    }
    if (draft) window.localStorage.setItem(cacheKey(uid, assignmentKey), JSON.stringify(draft));
    else window.localStorage.removeItem(cacheKey(uid, assignmentKey));
  } catch { /* Cloud results remain authoritative. */ }
}

export default function CourseSpeakingMockAssignment({ assignmentKey }) {
  const config = ASSIGNMENTS[assignmentKey];
  const { idToken, user } = useAuth();
  const uid = user?.uid || "";
  const [stage, setStage] = useState("loading");
  const [tasks, setTasks] = useState(null);
  const [results, setResults] = useState([]);
  const [attemptId, setAttemptId] = useState("");
  const [legacyParts, setLegacyParts] = useState(0);
  const [recoveryCopies, setRecoveryCopies] = useState([]);
  const [recoveryCheck, setRecoveryCheck] = useState(0);
  const [activePart, setActivePart] = useState(0);
  const [serverResult, setServerResult] = useState(null);
  const [message, setMessage] = useState("");
  const savingRef = useRef(false);
  const completionAnnounced = useRef(false);
  useEffect(() => {
    if (stage === 'complete' && !completionAnnounced.current) {
      completionAnnounced.current = true;
      announceExamSuccess('Speaking mock completed. Your result is saved.');
    }
  }, [stage]);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    document.body.classList.add("falowen-course-speaking-mock");
    return () => document.body.classList.remove("falowen-course-speaking-mock");
  }, []);

  useEffect(() => {
    if (!config || !idToken || !uid) return undefined;
    let cancelled = false;
    setStage("loading");
    setMessage("");
    // Local work remains accessible even if the cloud is offline or already completed.
    const localDraft = readDraft(uid, assignmentKey);
    try {
      setRecoveryCopies(localDraft?.results?.length
        ? preserveSpeakingRecovery(window.localStorage, cacheKey(uid, assignmentKey), localDraft)
        : readSpeakingRecovery(window.localStorage, cacheKey(uid, assignmentKey)));
    } catch {
      // Keep the original draft and expose an in-memory download if archiving is unavailable.
      setRecoveryCopies(localDraft?.results?.length ? [{ savedAt: 'local', draft: localDraft }] : []);
    }
    fetchCourseSpeakingMockStatus({ idToken, assignmentKey }).then(status => {
      if (cancelled) return;
      if (status.completed) {
        setServerResult(status);
        setStage("complete");
        saveDraft(uid, assignmentKey, null);
        return;
      }
      const draft = readDraft(uid, assignmentKey);
      const serverAttemptId = status.attemptId || "";
      setAttemptId(serverAttemptId);
      const verifiedDraft = serverAttemptId && draft?.attemptId === serverAttemptId ? draft : null;
      // An old local draft did not have an attempt ID. Keep it for review,
      // never combine its parts with newer server-owned attempts.
      setLegacyParts(!verifiedDraft && draft?.results?.length ? draft.results.length : 0);
      const cloudParts = contiguousVerifiedSpeakingParts(status.recovery?.parts || []);
      const localParts = contiguousVerifiedSpeakingParts(verifiedDraft?.results || []);
      const completedParts = cloudParts.length >= localParts.length ? cloudParts : localParts;
      const selectedTasks = verifiedDraft?.tasks || chooseTasks(config.level);
      if (selectedTasks && completedParts.length) {
        const restoredTasks = selectedTasks.map((task, i) => {
          const item = completedParts[i];
          return item?.taskId ? speakingQuestionDictionary.find(q =>
            q.level === config.level && q.id === item.taskId) || task : task;
        });
        setTasks(restoredTasks);
        setResults(completedParts);
        saveDraft(uid, assignmentKey, { tasks: restoredTasks, results: completedParts, attemptId: serverAttemptId });
        setActivePart(Math.min(2, completedParts.length));
        if (completedParts.length === 3) {
          setStage("submitting");
          submitCourseSpeakingMock({
            idToken, assignmentKey, attemptId: serverAttemptId,
            sessionIds: completedParts.map(part => part.sessionId),
          }).then(response => {
            if (cancelled) return;
            setServerResult(response);
            setStage("complete");
            saveDraft(uid, assignmentKey, null);
          }).catch(error => {
            if (cancelled) return;
            setMessage(error?.response?.data?.error || error?.message ||
              "Your three parts are graded. Your course score needs submission. Retry below.");
            setStage("save-error");
          });
        } else {
          setMessage(`✓ ${completedParts.length} speaking part${completedParts.length === 1 ? "" : "s"} recovered from Falowen.`);
          setStage("exam");
        }
      } else if (verifiedDraft) {
        setTasks(verifiedDraft.tasks);
        setResults([]);
        setActivePart(0);
        setStage("exam");
      } else setStage("intro");
    }).catch(error => {
      if (!cancelled) {
        setMessage(error?.response?.data?.error || error?.message || "Could not check your exam status.");
        setStage("status-error");
      }
    });
    return () => { cancelled = true; };
  }, [assignmentKey, config, idToken, uid, recoveryCheck]);

  const submit = useCallback(async (parts) => {
    if (savingRef.current) return;
    savingRef.current = true;
    setStage("submitting");
    setMessage("");
    try {
      const response = await submitCourseSpeakingMock({
        idToken, assignmentKey, attemptId,
        sessionIds: parts?.map(part => part.sessionId),
      });
      setServerResult(response);
      setStage("complete");
      saveDraft(uid, assignmentKey, null);
    } catch (error) {
      setMessage(error?.response?.data?.error || error?.message ||
        "Could not save your final exam score. Your completed parts remain available for retry.");
      setStage("save-error");
    } finally {
      savingRef.current = false;
    }
  }, [idToken, assignmentKey, uid, attemptId]);

  // Owner-scoped verification can recover a graded Teil after a lost HTTP
  // response. It is a read, not another transcription or AI evaluation.
  const recoverCompletedParts = useCallback(async () => {
    if (!idToken || !attemptId || savingRef.current) return;
    setMessage("Checking Falowen for saved speaking assessments…");
    try {
      const status = await fetchCourseSpeakingMockStatus({idToken, assignmentKey});
      if (status.completed) {
        setServerResult(status);
        setStage("complete");
        saveDraft(uid, assignmentKey, null);
        return;
      }
      if (status.attemptId !== attemptId) {
        setMessage("A different speaking attempt is now active. Your saved work has not been changed.");
        return;
      }
      const savedParts = contiguousVerifiedSpeakingParts(status.recovery?.parts || []);
      if (savedParts.length <= results.length) {
        setMessage(savedParts.length
          ? `✓ ${savedParts.length} completed Teil(s) verified. Continue with the current step.`
          : "No graded Teil was found yet. Confirm your transcript or retry feedback in the current Teil.");
        return;
      }
      const restoredTasks = tasks.map((task, index) => {
        const saved = savedParts[index];
        return saved?.taskId
          ? speakingQuestionDictionary.find(q => q.level === config.level && q.id === saved.taskId) || task
          : task;
      });
      setTasks(restoredTasks);
      setResults(savedParts);
      saveDraft(uid, assignmentKey, {tasks:restoredTasks,results:savedParts,attemptId});
      if (savedParts.length === 3) {
        setStage("submitting");
        await submit(savedParts);
      } else {
        setActivePart(savedParts.length);
        setStage("exam");
        setMessage(`✓ Teil ${savedParts.length} recovered. Continue to Teil ${savedParts.length+1}; no new recording was required.`);
      }
    } catch (error) {
      setMessage(error?.response?.data?.error || error?.message ||
        "Could not check saved speaking parts. Your current answers are unchanged.");
    }
  }, [idToken, attemptId, assignmentKey, uid, results.length, tasks, config, submit]);

  const onCompletedPart = useCallback(result => {
    if (!result?.sessionId || !result?.assessment ||
        !Number.isFinite(Number(result.assessment.maxScore)) ||
        Number(result.assessment.maxScore) <= 0) {
      setMessage("Marking is still pending. Your recorded answers remain saved. Tap Retry feedback.");
      return false;
    }
    const expectedTeil = `Teil ${activePart + 1}`;
    if (partNumber(result.teil) !== String(activePart + 1)) {
      setMessage("This part did not match the assigned exam. Your answers remain saved; retry feedback.");
      return false;
    }
    const next = [...results.slice(0, activePart), { ...result, teil: expectedTeil }];
    setResults(next);
    saveDraft(uid, assignmentKey, { tasks, results: next, attemptId });
    if (activePart === 2) {
      setMessage("✓ All three parts marked. Saving your result…");
      submit(next);
    } else {
      setMessage(`✓ Teil ${activePart + 1} marked and saved. Continue to Teil ${activePart + 2}.`);
      setActivePart(activePart + 1);
    }
    return true;
  }, [activePart, assignmentKey, results, submit, tasks, uid, attemptId]);

  const selected = tasks?.[activePart];
  const scores = serverResult?.sectionScores || {};
  const displayParts = useMemo(() =>
    serverResult?.speakingParts || Object.fromEntries(
      results.map((r, i) => [`teil${i + 1}`, {
        percent: r.assessment?.percent, summary: r.assessment?.summary,
        strength: r.assessment?.strength, priority: r.assessment?.priority,
      }])
    ), [serverResult, results]);

  if (!config) return <p role="alert">This speaking assignment is not configured.</p>;
  const examPartDetails = config.level === "A1" ? [
    { title: "Sich vorstellen", description: "Introduce yourself, spell your name and say a number." },
    { title: "Fragen und Antworten", description: "Ask and answer questions using everyday topic cards." },
    { title: "Bitten und Reagieren", description: "Make polite requests and respond to your partner." },
  ] : config.level === "A2" ? [
    { title: "Fragen zur Person", description: "Ask and answer short questions about everyday life." },
    { title: "Von sich erzählen", description: "Speak about a topic using the words on your card." },
    { title: "Gemeinsam etwas planen", description: "Discuss suggestions and agree on a plan with your partner." },
  ] : [
    { title: "Gemeinsam etwas planen", description: "Make suggestions, respond to your partner and reach an agreement." },
    { title: "Ein Thema präsentieren", description: "Present a topic with an introduction, examples and your opinion." },
    { title: "Fragen beantworten", description: "React to feedback and answer questions about your presentation." },
  ];

  return <main className="speaking-exam-page speaking-course-mock" data-speaking-mock={config.level}
    style={{ maxWidth: 900, margin: "0 auto", padding: "12px clamp(10px, 3vw, 22px)", minWidth: 0 }}>
    <header className="speaking-course-mock__heading">
      <Link to="/campus/course" className="speaking-course-mock__back">← Course Book</Link>
      <span className="speaking-course-mock__eyebrow">{config.level} · DAY {config.day} · SPEAKING ASSESSMENT</span>
      <h1>{config.title}</h1>
      {stage === "intro" ? <p>Learn the format, then complete all three parts with the Falowen AI examiner.</p>
        : stage === "exam" ? <p>Teil {activePart + 1} of 3 · {sectionNames[config.level][activePart]}</p> : null}
    </header>
    {(stage === "exam" || stage === "complete") ? <nav className="speaking-course-mock__progress" aria-label="Exam progress">
      {sectionNames[config.level].map((part,i)=><span key={part}
        className={i < results.length || stage === "complete" ? "is-complete" : i === activePart ? "is-active" : ""}
        aria-current={stage === "exam" && activePart === i ? "step" : undefined}>
        {i < results.length || stage === "complete" ? "✓ " : ""}Teil {i+1}
      </span>)}
    </nav> : null}

    {stage === "loading" ? <p role="status">Checking your assignment progress…</p> : null}
    {stage === "status-error" ? <section style={surface} role="alert">
      <p>{message}</p><button type="button" style={button} onClick={() => window.location.reload()}>Retry status check</button>
    </section> : null}
    {stage === "intro" ? <section className="speaking-course-mock__intro">
      <div className="speaking-course-mock__intro-head">
        <span className="speaking-course-mock__eyebrow">BEFORE YOU START</span>
        <h2>How the speaking exam works</h2>
        <p>There are three parts. The AI examiner speaks in German, listens to your answers and moves you through the tasks.</p>
      </div>
      <ol className="speaking-course-mock__part-guide">
        {examPartDetails.map((part,i)=><li key={part.title}>
          <span className="speaking-course-mock__part-number">{i+1}</span>
          <div><strong>Teil {i+1} · {part.title}</strong><p>{part.description}</p></div>
        </li>)}
      </ol>
      <div className="speaking-course-mock__howto">
        <h3>During your mock</h3>
        <p><strong>Listen → Record → Confirm.</strong> Speak naturally in German. Check what the microphone heard; correct only speech-recognition errors. The AI assesses each Teil, then saves one combined score when you finish all three.</p>
        <p>Choose a quiet place and allow microphone access. Your score is AI practice feedback, not an official Goethe-Institut result.</p>
      </div>
      {legacyParts ? <p role="status" style={{color:"#9a3412"}}>
        {legacyParts} older speaking part(s) are saved on this device, but could not be matched to the current verified attempt.
        A recovery copy is preserved below. Check cloud progress again before starting a new attempt.
      </p> : null}
      <button type="button" className="speaking-course-mock__start" onClick={async () => {
        const selectedTasks = chooseTasks(config.level);
        if (!selectedTasks) { setMessage("Speaking tasks are unavailable for one of the three parts."); return; }
        setStage("starting");
        setMessage("");
        try {
          const started = await startCourseSpeakingMock({ idToken, assignmentKey });
          if (!started.attemptId) throw new Error("Falowen did not confirm an exam attempt ID.");
          setAttemptId(started.attemptId);
          setTasks(selectedTasks); setResults([]); setActivePart(0);
          saveDraft(uid, assignmentKey, { tasks: selectedTasks, results: [], attemptId: started.attemptId });
          setLegacyParts(0);
          setStage("exam");
        } catch (err) {
          setMessage(err?.response?.data?.error || err.message || "Could not start a verified speaking exam.");
          setStage("intro");
        }
      }}>{legacyParts ? 'Start a new mock · keep older work' : 'Start speaking mock →'}</button>
      {message ? <p role="alert">{message}</p> : null}
    </section> : null}

    {recoveryCopies.length > 0 ? <section style={{ ...surface, marginTop: 16 }} aria-label="Saved speaking recovery">
      <h2>Saved speaking work</h2>
      <p>Your older work is preserved on this device. It is not included in a new graded attempt unless Falowen verifies it belongs to that attempt.</p>
      <button type="button" style={button} disabled={!['intro', 'status-error', 'complete'].includes(stage)} onClick={() => setRecoveryCheck(value => value + 1)}>Check cloud progress again</button>
      <button type="button" style={{ ...button, margin: 8 }} onClick={() => {
        const blob = new Blob([JSON.stringify({ assignmentKey, studentUid: uid, copies: recoveryCopies }, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a'); link.href = url; link.download = `${assignmentKey}-saved-speaking.json`;
        link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      }}>Download saved work for tutor review</button>
      {recoveryCopies.map((copy, index) => <details key={`${copy.savedAt}-${index}`}>
        <summary>Saved attempt {index + 1} · {copy.draft.results.length} part(s)</summary>
        {copy.draft.results.map((part, partIndex) => <div key={part.sessionId || partIndex}>
          <h3>{part.teil || `Teil ${partIndex + 1}`} · {part.assessment?.percent ?? '—'}%</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{part.assessment?.summary || part.feedback || 'Saved assessment available in the download.'}</p>
          <p>Session: {part.sessionId || 'No session ID stored'}</p>
        </div>)}
      </details>)}
    </section> : null}

    {stage === "exam" && selected ? <section className="speaking-course-mock__exam" aria-label={`Speaking Teil ${activePart + 1}`}>
      <LiveSpeakPage key={`${assignmentKey}-${activePart}-${selected.id}`}
        embedded initialLevel={config.level}
        practiceTopic={selected.topicPrompt || selected.text || config.title}
        practiceSource="exam-speaking-practice" examMode="simulation"
        autoStart freshAttempt deferFeedback gradedCourseMock
        examTask={{
          id: selected.id, teil: selected.teilLabel || selected.teilId,
          prompt: selected.topicPrompt || selected.text || "",
          keywords: selected.keywordSubtopic || "", hint: selected.hint || "",
          courseAssignmentKey: assignmentKey, mockAttemptId: attemptId,
        }}
        onExamCompleted={onCompletedPart} onRecoverCompletedParts={recoverCompletedParts} />
      {message ? <p role="alert" style={{ color: "#b91c1c" }}>{message}</p> : null}
    </section> : null}

    {stage === "starting" ? <section style={surface} role="status">Opening your verified speaking exam…</section> : null}
    {stage === "submitting" ? <section style={surface} role="status" aria-live="polite"><h2>✓ All three speaking parts recorded and assessed</h2><p>Saving your result…</p></section> : null}
    {stage === "save-error" ? <section style={surface} role="alert">
      <h2>Submission needs a retry</h2>
      <p>{message}</p><p>Your three assessed parts are retained on this device and on the examiner server. Do not record them again.</p>
      <button type="button" style={button} onClick={() => submit(results)}>Retry score submission</button>
      <button type="button" style={{...button,marginLeft:8,background:"#0f766e"}}
        onClick={recoverCompletedParts}>Check saved speaking results</button>
    </section> : null}

    {stage === "complete" && serverResult ? <section style={{ ...surface, display: "grid", gap: 16 }}>
      <span role="status" aria-live="polite" style={{ fontWeight: 800, color: "#166534" }}>✓ All three speaking parts assessed — course score saved in Falowen</span>
      <div className="speaking-total-score">
        <strong>{serverResult.score} / 100</strong>
        <span>{serverResult.passed ? "Course pass threshold met" : "Further speaking practice recommended"}</span>
      </div>
      <h2 style={{ margin: 0 }}>Your Teil scores</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10 }}>
        {[1,2,3].map(i => <div key={i} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 14 }}>
          <strong>Teil {i}</strong><p style={{ margin: "8px 0 0", fontSize: 24, fontWeight: 800 }}>{scores[`teil${i}`]}%</p>
        </div>)}
      </div>
      {[1,2,3].map(i => <details key={i} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12 }}>
        <summary style={{ cursor: "pointer", fontWeight: 700 }}>Teil {i} · Feedback</summary>
        <SpeakingFeedback assessment={displayParts[`teil${i}`] || {}} feedback={displayParts[`teil${i}`]?.summary || ""}/>
      </details>)}
      <p role="status" style={{ color: "#166534" }}>Your result is saved. Open Results whenever you want to review it.</p>
      <Link to="/campus/results">View all course results →</Link>
    </section> : null}
  </main>;
}
