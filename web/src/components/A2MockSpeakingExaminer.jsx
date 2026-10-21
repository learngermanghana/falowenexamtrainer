import React, { useEffect, useMemo, useRef, useState } from "react";
import SpeakingPracticeHome from "./SpeakingPracticeHome";
import LiveSpeakPage from "./LiveSpeakPage";
import "./SpeakingExamDesign.css";

// The same speaking welcome screen and real conversational AI examiner used by
// A1 Exam Room, with task identity and progress isolated for each A2 mock.
export default function A2MockSpeakingExaminer({
  mockId, tasks, savedParts = {}, onSavePart, onComplete, attemptId = "",
  externalSecondsLeft = null,
}) {
  const [stage, setStage] = useState("home");
  const [selectedTeil, setSelectedTeil] = useState("1");
  const [fullExam, setFullExam] = useState(false);
  const [parts, setParts] = useState(() => savedParts || {});
  const [practiceResult, setPracticeResult] = useState(null);
  const [error, setError] = useState("");
  const [run, setRun] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);
  const timeoutHandled = useRef(false);
  const timed = externalSecondsLeft !== null && externalSecondsLeft !== undefined;
  const timeExpired = timed && Number(externalSecondsLeft) <= 0;
  const activeTask = tasks.find(task => task.teil === selectedTeil) || tasks[0];
  const guides = useMemo(() => Object.fromEntries(tasks.map(task => [
    task.teil, { title: task.title, english: task.english },
  ])), [tasks]);
  const finished = tasks.every(task => parts[task.teil]?.sessionId && parts[task.teil]?.assessment);
  const completedCount = tasks.filter(task => parts[task.teil]?.sessionId && parts[task.teil]?.assessment).length;

  const finalize = async updated => {
    setStage("verifying");
    setError("");
    try {
      // A2 Mock 1 must wait until the server stores verifiedSections.sprechen.
      // Never tell the parent that the mock is completed before this succeeds.
      const accepted = await onComplete?.(updated);
      if (accepted === false) throw new Error("Speaking verification did not finish. Retry without re-recording.");
      setStage("results");
      return true;
    } catch (err) {
      setError(err?.message || "Unable to verify your speaking result. Retry without recording again.");
      setStage("verify-error");
      return false;
    }
  };

  useEffect(() => {
    if (!timeExpired || timeoutHandled.current) return;
    timeoutHandled.current=true;
    setFullExam(true);
    setSessionActive(false);
    // Stop the interactive examiner and its microphone immediately at 00:00.
    // Persisted server receipts are graded; unfinished Teils receive zero.
    finalize(parts);
    // Timer expiry happens once per mounted timed exam.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeExpired]);

  const start = (wholeExam) => {
    setError("");
    setPracticeResult(null);
    if (timeExpired) {
      setError("Speaking time has ended. Your saved examiner answers are being verified.");
      return;
    }
    if (wholeExam && finished) {
      setFullExam(true);
      finalize(parts);
      return;
    }
    setFullExam(wholeExam);
    setSelectedTeil(wholeExam ? (tasks.find(task => !parts[task.teil]?.assessment)?.teil || "1") : selectedTeil);
    setRun(value => value + 1);
    setStage("exam");
  };

  const complete = (result) => {
    if (timeExpired) {
      setError("Speaking time is over. Only answers confirmed before the deadline count.");
      return false;
    }
    const expected = `${mockId}-speaking-teil-${activeTask.teil}`;
    const actualTeil = String(result?.teil || "").match(/\d+/)?.[0];
    if (result?.taskId !== expected || result?.level !== "A2" || actualTeil !== activeTask.teil ||
        !result?.sessionId || !result?.feedback) {
      setError("The examiner's saved answer did not match this A2 mock or speaking part. Your previous work remains available.");
      return false;
    }
    // The AI examiner evaluates a complete Teil. Do not fabricate a score or
    // unlock a graded full exam unless that assessment is actually present.
    const assessment = result.assessment;
    if (!assessment || !Number.isFinite(Number(assessment.score)) ||
        !(Number(assessment.maxScore) > 0)) {
      setError("Your spoken answers were received, but marking is not yet complete. Use Retry feedback in the examiner to finish this Teil.");
      return false;
    }
    if (!fullExam) {
      setPracticeResult(result);
      setStage("results");
      setSessionActive(false);
      return true;
    }
    const updated = {...parts, [activeTask.teil]: result};
    try {
      if (onSavePart?.(activeTask.teil, result, updated) === false) {
        setError("Could not save this speaking part. Please retry instead of recording it again.");
        return false;
      }
    } catch (err) {
      setError(err?.message || "Could not save this speaking part. Retry without re-recording.");
      return false;
    }
    setParts(updated);
    setSessionActive(false);
    const next = tasks.find(task => !updated[task.teil]?.assessment);
    if (next) {
      setSelectedTeil(next.teil);
      setRun(value => value + 1);
    } else {
      finalize(updated);
    }
    return true;
  };

  return (
    <section className="speaking-exam-page" data-a2-mock-ai-examiner={mockId}
      style={{maxWidth:880,margin:"0 auto",display:"grid",gap:16}}>
      {timed ? <p role="timer" aria-live="off" style={{margin:0,fontWeight:700}}>
        Speaking time left: {Math.floor(Math.max(0,Number(externalSecondsLeft))/60)}:{String(Math.max(0,Number(externalSecondsLeft))%60).padStart(2,"0")}
      </p> : null}
      {stage === "home" ? <>
        {completedCount ? <p role="status" style={{margin:0}}>
          {completedCount} of {tasks.length} speaking parts are saved. You can resume the full exam without repeating completed parts.
        </p> : null}
        <SpeakingPracticeHome level="A2" teil={selectedTeil} guides={guides}
          history={{}} ready onSelectPart={setSelectedTeil} onStart={start}/>
      </> : null}
      {stage === "exam" && activeTask ? <>
        <div className="speaking-exam-stage-head" style={{display:"flex",gap:12,alignItems:"center",justifyContent:"space-between",flexWrap:"wrap"}}>
          <button type="button" disabled={sessionActive} onClick={() => setStage("home")}>← Choose speaking practice</button>
          <strong>{fullExam ? "Full speaking exam" : "Individual speaking practice"} · Teil {activeTask.teil} of {tasks.length}</strong>
        </div>
        <p style={{margin:0,color:"#475569"}}>
          Listen to the AI examiner speaking German, then answer in German using the microphone.
          {fullExam ? " Each completed part is saved automatically." : " This is individual practice; it does not replace your mock submission."}
        </p>
        <LiveSpeakPage
          key={`${mockId}-${attemptId}-${activeTask.teil}-${run}`}
          embedded initialLevel="A2" practiceSource="exam-speaking-practice"
          practiceTopic={activeTask.prompt} examMode="simulation"
          autoStart freshAttempt={run > 0} deferFeedback={fullExam}
          examTask={{
            id:`${mockId}-speaking-teil-${activeTask.teil}`,
            teil:`Teil ${activeTask.teil}`,
            prompt:activeTask.prompt,
            keywords:activeTask.keywords || "",
            hint:activeTask.hint || "",
            mockAttemptId:attemptId,
          }}
          onActivityChange={setSessionActive}
          onExamCompleted={complete}
        />
      </> : null}
      {stage === "results" ? <section className="speaking-run-results" aria-label="A2 mock speaking results">
        <span className="speaking-eyebrow">A2 · SPEAKING PRACTICE</span>
        <h2>{fullExam ? "All speaking parts completed" : `Teil ${selectedTeil} completed`}</h2>
        <p>{fullExam ? "Your three speaking parts and examiner feedback are saved. Review the complete mock results when available." :
          "This individual practice does not change your full mock score."}</p>
        {(fullExam ? tasks.map(task => parts[task.teil]) : [practiceResult]).filter(Boolean).map((part,i) => (
          <details key={part.sessionId || i}>
            <summary>Teil {String(part.teil || "").match(/\d+/)?.[0] || (i+1)} · View AI feedback</summary>
            <p>{part.feedback || part.assessment?.summary || "Feedback saved."}</p>
          </details>
        ))}
        <button type="button" onClick={()=>setStage("home")}>Back to speaking practice</button>
      </section> : null}
      {stage === "verifying" ? <p role="status">Saving the verified speaking score. Please wait; do not record again.</p> : null}
      {stage === "verify-error" ? <section role="alert" style={{display:"grid",gap:10}}>
        <strong>Speaking result still needs verification</strong>
        <p>Your completed examiner parts remain saved. You can retry server verification without recording again.</p>
        <button type="button" onClick={() => finalize(parts)}>Retry speaking verification</button>
      </section> : null}
      {error ? <p role="alert" style={{color:"#9f1239"}}>{error}</p> : null}
    </section>
  );
}
