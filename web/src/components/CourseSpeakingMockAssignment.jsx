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
      if (draft) {
        setTasks(draft.tasks);
        setResults(draft.results || []);
        const length = draft.results?.length || 0;
        setActivePart(Math.min(2, length));
        setStage(length === 3 ? "save-error" : "exam");
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
      setMessage("The examiner could not verify this part. Retry the assessment before continuing.");
      return;
    }
    const expectedTeil = `Teil ${activePart + 1}`;
    if (partNumber(result.teil) !== String(activePart + 1)) {
      setMessage("The completed speaking part does not match the current exam.");
      return;
    }
    const next = [...results.slice(0, activePart), { ...result, teil: expectedTeil }];
    setResults(next);
    saveDraft(uid, assignmentKey, { tasks, results: next });
    if (activePart === 2) submit(next);
    else {
      setMessage("");
      setActivePart(activePart + 1);
    }
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
  return <main className="speaking-exam-page" style={{ maxWidth: 960, margin: "0 auto", padding: "16px" }}>
    <section style={{ ...surface, display: "grid", gap: 14, marginBottom: 16, background: "#eff6ff" }}>
      <Link to={`/campus/course/lesson/${config.level}/${config.day}`} style={{ fontSize: 13 }}>← Back to lesson</Link>
      <div>
        <span style={{ fontSize: 12, fontWeight: 800, color: "#1e40af" }}>{config.level} · DAY {config.day} · GRADED ASSIGNMENT</span>
        <h1 style={{ margin: "6px 0" }}>{config.title}</h1>
        <p style={{ margin: 0, color: "#475569" }}>Complete Teil 1, Teil 2 and Teil 3 with the Falowen AI examiner. Each part is assessed after your response; one combined score is saved to your course results.</p>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }} aria-label="Speaking mock parts">
        {sectionNames[config.level].map((label, i) =>
          <span key={i} aria-current={stage === "exam" && activePart === i ? "step" : undefined}
            style={{ padding: "9px 12px", borderRadius: 10, background: i < results.length || stage === "complete" ? "#dcfce7" : i === activePart && stage === "exam" ? "#bfdbfe" : "#fff", fontSize: 13, fontWeight: 600 }}>
            {i < results.length || stage === "complete" ? "✓ " : ""}Teil {i + 1} · {label}
          </span>)}
      </div>
      <small>Falowen AI practice score, not an official Goethe-Institut result. Pronunciation is not graded from corrected transcripts.</small>
    </section>

    {stage === "loading" ? <p role="status">Checking your assignment progress…</p> : null}
    {stage === "status-error" ? <section style={surface} role="alert">
      <p>{message}</p><button type="button" style={button} onClick={() => window.location.reload()}>Retry status check</button>
    </section> : null}
    {stage === "intro" ? <section style={{ ...surface, display: "grid", gap: 14 }}>
      <h2 style={{ margin: 0 }}>Ready for your speaking mock?</h2>
      <p style={{ margin: 0 }}>Use a quiet place and allow microphone access. You must complete all three parts. Only the first verified complete submission is used as your coursework result.</p>
      <button type="button" style={button} onClick={() => {
        const selectedTasks = chooseTasks(config.level);
        if (!selectedTasks) { setMessage("Speaking tasks are unavailable for one of the three parts."); return; }
        setTasks(selectedTasks); setResults([]); setActivePart(0); setMessage("");
        saveDraft(uid, assignmentKey, { tasks: selectedTasks, results: [] });
        setStage("exam");
      }}>Start full speaking mock →</button>
      {message ? <p role="alert">{message}</p> : null}
    </section> : null}

    {stage === "exam" && selected ? <section style={{ ...surface, display: "grid", gap: 12 }}>
      <h2 style={{ margin: 0 }}>Teil {activePart + 1} · {sectionNames[config.level][activePart]}</h2>
      <p style={{ margin: 0, color: "#475569" }}>Speak to the examiner and confirm your responses. The next part opens automatically once feedback is verified.</p>
      <LiveSpeakPage key={`${assignmentKey}-${activePart}-${selected.id}`}
        embedded initialLevel={config.level}
        practiceTopic={selected.topicPrompt || selected.text || config.title}
        practiceSource="exam-speaking-practice" examMode="simulation"
        autoStart freshAttempt deferFeedback
        examTask={{
          id: selected.id, teil: selected.teilLabel || selected.teilId,
          prompt: selected.topicPrompt || selected.text || "",
          keywords: selected.keywordSubtopic || "", hint: selected.hint || "",
          courseAssignmentKey: assignmentKey,
        }}
        onExamCompleted={onCompletedPart} />
      {message ? <p role="alert" style={{ color: "#b91c1c" }}>{message}</p> : null}
    </section> : null}

    {stage === "submitting" ? <section style={surface} role="status"><h2>Exam completed</h2><p>Saving your verified speaking score to Falowen and synchronizing the result sheet…</p></section> : null}
    {stage === "save-error" ? <section style={surface} role="alert">
      <h2>Submission needs a retry</h2>
      <p>{message}</p><p>Your three assessed parts are retained on this device and on the examiner server. Do not record them again.</p>
      <button type="button" style={button} onClick={() => submit(results)}>Retry score submission</button>
    </section> : null}

    {stage === "complete" && serverResult ? <section style={{ ...surface, display: "grid", gap: 16 }}>
      <span style={{ fontWeight: 800, color: "#166534" }}>✓ Speaking assignment completed</span>
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
        : <div role="status" style={{ background: "#fffbeb", padding: 12, borderRadius: 12 }}>
          <p style={{ marginTop: 0 }}>Your course score is saved in Falowen. Google Sheets synchronization is pending. {serverResult.sheet?.message || ""}</p>
          <button type="button" style={button} onClick={() => submit()}>Retry Google Sheets sync</button>
        </div>}
      <Link to="/campus/results">View all course results →</Link>
    </section> : null}
  </main>;
}
