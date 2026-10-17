import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LiveSpeakPage from "./LiveSpeakPage";
import { SpeakingFeedback } from "./SpeakingPracticeHome";
import { speakingQuestionDictionary } from "../data/speakingDictionary";
import { fetchCourseSpeakingMockStatus, submitCourseSpeakingMock } from "../services/courseSpeakingMockService";
import "./SpeakingExamDesign.css";

const ASSIGNMENTS = Object.freeze({
  "A2-8.22": { level: "A2", day: 22, title: "Goethe A2 Speaking Mock" },
  "B1-7.23": { level: "B1", day: 23, title: "Goethe B1 Speaking Mock" },
});

const partNumber = value => String(value || "").match(/teil\s*([1-3])/i)?.[1] || "";
const cacheKey = (uid, assignmentKey) => `falowen:graded-speaking:${uid}:${assignmentKey}`;
const sectionNames = {
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
  const [activePart, setActivePart] = useState(0);
  const [serverResult, setServerResult] = useState(null);
  const [message, setMessage] = useState("");
  const savingRef = useRef(false);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    document.body.classList.add("falowen-course-speaking-mock");
    return () => document.body.classList.remove("falowen-course-speaking-mock");
  }, []);

  useEffect(() => {
    if (!config || !idToken || !uid) return undefined;
    let cancelled = false;
    setStage("loading");
    fetchCourseSpeakingMockStatus({ idToken, assignmentKey }).then(status => {
      if (cancelled) return;
      if (status.completed) {
        setServerResult(status);
        setStage("complete");
        saveDraft(uid, assignmentKey, null);
        return;
      }
      const draft = readDraft(uid, assignmentKey);
      // The server is authoritative. Recover completed parts even after a
      // browser refresh, lost localStorage or interrupted final submission.
      const cloudParts = status.recovery?.parts || [];
      const completedParts = cloudParts.length >= (draft?.results?.length || 0)
        ? cloudParts : draft.results;
      const selectedTasks = draft?.tasks || chooseTasks(config.level);
      if (selectedTasks && completedParts.length) {
        const restoredTasks = selectedTasks.map((task, i) => {
          const item = completedParts[i];
          return item?.taskId ? speakingQuestionDictionary.find(q =>
            q.level === config.level && q.id === item.taskId) || task : task;
        });
        setTasks(restoredTasks);
        setResults(completedParts);
        saveDraft(uid, assignmentKey, { tasks: restoredTasks, results: completedParts });
        setActivePart(Math.min(2, completedParts.length));
        if (completedParts.length === 3) {
          setStage("submitting");
          submitCourseSpeakingMock({
            idToken, assignmentKey, sessionIds: completedParts.map(part => part.sessionId),
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
      } else if (draft) {
        setTasks(draft.tasks);
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
  }, [assignmentKey, config, idToken, uid]);

  const submit = useCallback(async (parts) => {
    if (savingRef.current) return;
    savingRef.current = true;
    setStage("submitting");
    setMessage("");
    try {
      const response = await submitCourseSpeakingMock({
        idToken, assignmentKey,
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
  }, [idToken, assignmentKey, uid]);

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
    saveDraft(uid, assignmentKey, { tasks, results: next });
    if (activePart === 2) {
      setMessage("✓ All three parts marked. Saving your result…");
      submit(next);
    } else {
      setMessage(`✓ Teil ${activePart + 1} marked and saved. Continue to Teil ${activePart + 2}.`);
      setActivePart(activePart + 1);
    }
    return true;
  }, [activePart, assignmentKey, results, submit, tasks, uid]);

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
  const examPartDetails = config.level === "A2" ? [
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
      <button type="button" className="speaking-course-mock__start" onClick={() => {
        const selectedTasks = chooseTasks(config.level);
        if (!selectedTasks) { setMessage("Speaking tasks are unavailable for one of the three parts."); return; }
        setTasks(selectedTasks); setResults([]); setActivePart(0); setMessage("");
        saveDraft(uid, assignmentKey, { tasks: selectedTasks, results: [] });
        setStage("exam");
      }}>Start speaking mock →</button>
      {message ? <p role="alert">{message}</p> : null}
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
          courseAssignmentKey: assignmentKey,
        }}
        onExamCompleted={onCompletedPart} />
      {message ? <p role="alert" style={{ color: "#b91c1c" }}>{message}</p> : null}
    </section> : null}

    {stage === "submitting" ? <section style={surface} role="status" aria-live="polite"><h2>✓ All three speaking parts recorded and assessed</h2><p>Saving your final course score now. Keep this page open while we confirm storage and synchronization.</p></section> : null}
    {stage === "save-error" ? <section style={surface} role="alert">
      <h2>Submission needs a retry</h2>
      <p>{message}</p><p>Your three assessed parts are retained on this device and on the examiner server. Do not record them again.</p>
      <button type="button" style={button} onClick={() => submit(results)}>Retry score submission</button>
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
      {serverResult.sheet?.ok ? <p role="status" style={{ color: "#166534" }}>Score saved in Falowen and synchronized with the Google results sheet.</p>
        : <div role="status" aria-live="polite" style={{ background: "#fffbeb", padding: 12, borderRadius: 12 }}>
          <p style={{ marginTop: 0 }}>✓ Your course score is stored in Falowen. Google Sheets and Admin sheet synchronization is still pending. Your recording is not lost. {serverResult.sheet?.message || ""}</p>
          <button type="button" style={button} onClick={() => submit()}>Retry Google Sheets sync</button>
        </div>}
      <Link to="/campus/results">View all course results →</Link>
    </section> : null}
  </main>;
}
