import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { scoreB1MockWriting } from "../services/b1FinalMockService";
import { saveExamRoomResult } from "../services/examRoomResultService";
import { B1_MOCK4_WRITING_TASKS, B1_MOCK4_SCHREIBEN_MINUTES, B1_MOCK4_SCHREIBEN_RUBRIC } from "../data/b1Mock4WritingTasks";
import WritingMistakeList from "./WritingMistakeList";
import AppBackButton from "./navigation/AppBackButton";
import "./B1FinalMockExamPage.css";

const STORE = "falowen:b1:mock-04:schreiben:v1";
const LIMIT = B1_MOCK4_SCHREIBEN_MINUTES * 60 * 1000;
const emptyAttempt = () => ({
  startedAt: null, submittedAt: null,
  teil1: "", teil2: "", teil3: "",
  result: null, cloudSaved: false,
});
const readAttempt = (key) => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(key) || "null");
    if (!saved || typeof saved !== "object") return emptyAttempt();
    return { ...emptyAttempt(), ...saved };
  } catch {
    return emptyAttempt();
  }
};
const wordCount = (text) => String(text || "").trim().split(/\s+/).filter(Boolean).length;
const countdown = (remainingMs) => {
  const time = Math.max(0, Math.ceil(remainingMs / 1000));
  return `${String(Math.floor(time / 60)).padStart(2, "0")}:${String(time % 60).padStart(2, "0")}`;
};

function B1Mock4SchreibenAttempt({ storageKey }) {
  const { idToken } = useAuth();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(() => readAttempt(storageKey));
  const [now, setNow] = useState(Date.now());
  const [activePart, setActivePart] = useState("teil1");
  const [marking, setMarking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [markError, setMarkError] = useState("");
  const [saveError, setSaveError] = useState("");
  const deadline = attempt.startedAt ? attempt.startedAt + LIMIT : null;
  const timeExpired = Boolean(deadline && now >= deadline);
  const submitted = Boolean(attempt.submittedAt || timeExpired);
  const task = B1_MOCK4_WRITING_TASKS.find((item) => item.id === activePart);

  useEffect(() => {
    try { window.localStorage.setItem(storageKey, JSON.stringify(attempt)); }
    catch (error) { console.warn("Could not save B1 Mock 4 Schreiben draft", error); }
  }, [attempt, storageKey]);

  // Use a wall-clock deadline so refreshing or navigating away never pauses this exam.
  useEffect(() => {
    if (!attempt.startedAt || attempt.submittedAt) return undefined;
    const handle = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(handle);
  }, [attempt.startedAt, attempt.submittedAt]);

  useEffect(() => {
    if (timeExpired && !attempt.submittedAt) {
      setAttempt((prev) => ({ ...prev, submittedAt: Date.now() }));
    }
  }, [timeExpired, attempt.submittedAt]);

  const start = () => {
    setNow(Date.now());
    setActivePart("teil1");
    setMarkError("");
    setSaveError("");
    setAttempt({ ...emptyAttempt(), startedAt: Date.now() });
  };

  const submit = () => {
    if (submitted || !attempt.startedAt) return;
    if (!window.confirm("Submit all three writing tasks? Answers cannot be changed after submission.")) return;
    setAttempt((prev) => ({ ...prev, submittedAt: Date.now() }));
  };

  const saveResult = async (result, submittedAttempt = attempt) => {
    if (!idToken || !submittedAttempt.startedAt || !result || saving) return;
    setSaving(true);
    setSaveError("");
    try {
      const score = Number(result.score);
      if (!Number.isFinite(score) || score < 0 || score > 25) throw new Error("Invalid writing score received.");
      await saveExamRoomResult({
        idToken, level: "B1", section: "schreiben", setId: "b1-mock-04-schreiben",
        title: "B1 Mock 4 · Schreiben",
        score, total: 25, percent: Math.round(score * 4), passed: score >= 15,
        attemptId: `b1-mock-04-schreiben-${submittedAttempt.startedAt}`, attemptNumber: 1,
        resultType: "practice", route: "/campus/course/b1-mock-3-schreiben",
        sectionScores: {
          teil1: Number(result.parts?.teil1?.score || 0) * 4,
          teil2: Number(result.parts?.teil2?.score || 0) * 4,
          teil3: Number(result.parts?.teil3?.score || 0) * 4,
        },
      });
      setAttempt((prev) => ({ ...prev, cloudSaved: true }));
    } catch (error) {
      setSaveError(error?.response?.data?.error || error?.message || "Could not sync the practice result.");
    } finally { setSaving(false); }
  };

  const mark = async () => {
    if (!submitted || marking || attempt.result) return;
    if (!idToken) {
      setMarkError("Sign in to get AI writing feedback.");
      return;
    }
    setMarking(true);
    setMarkError("");
    try {
      // One server-side assessment for all three tasks. No full mock attemptId:
      // this is practice and must not write an unverified four-module grade.
      const result = await scoreB1MockWriting({
        teil1: attempt.teil1, teil2: attempt.teil2, teil3: attempt.teil3,
        idToken, mockId: "b1-mock-04",
      });
      if (!result || !Number.isFinite(Number(result.score))) throw new Error("The writing result was incomplete.");
      setAttempt((prev) => ({ ...prev, result }));
      await saveResult(result);
    } catch (error) {
      setMarkError(error?.response?.data?.error || error?.message || "Writing feedback is unavailable. Your answers remain saved.");
    } finally { setMarking(false); }
  };

  return (
    <main className="b1-final-shell" data-b1-mock4-schreiben>
      <AppBackButton label="Back to B1 mocks" fallbackPath="/exams/mocks" />
      <header className="b1-final-module-header">
        <p>GOETHE-ZERTIFIKAT B1 · MOCK 4 · SCHREIBEN</p>
        <h1>Schreiben</h1>
        <span>3 Aufgaben · 60 Minuten · circa 80 / 80 / 40 Wörter</span>
      </header>

      {!attempt.startedAt ? (
        <section className="b1-final-rules">
          <h2>Schreiben · Prüfungsmodul</h2>
          <p>Bearbeiten Sie alle drei Aufgaben in deutscher Sprache. Die Aufgaben stammen aus dem bereitgestellten Übungssatz. Sie schreiben direkt hier; das PDF wird nicht angezeigt.</p>
          <p>Teil 1: 20 Minuten · Teil 2: 25 Minuten · Teil 3: 15 Minuten.</p>
          <p>Die Antworten werden auf diesem Gerät automatisch gespeichert. Die 60-Minuten-Uhr läuft auch dann weiter, wenn Sie die Seite verlassen.</p>
          <button type="button" className="b1-final-primary" onClick={start}>Schreiben starten</button>
        </section>
      ) : (
        <>
          <section className="b1-final-rules" aria-label="Schreiben Fortschritt">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <strong>{submitted ? "Abgegeben" : "Verbleibende Zeit"}: {countdown((deadline || now) - now)}</strong>
              <span>{B1_MOCK4_WRITING_TASKS.filter((item) => wordCount(attempt[item.id]) > 0).length}/3 Aufgaben begonnen</span>
            </div>
            <nav aria-label="Schreiben Teil wählen" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
              {B1_MOCK4_WRITING_TASKS.map((item, index) => (
                <button type="button" key={item.id} aria-current={activePart === item.id ? "step" : undefined}
                  onClick={() => setActivePart(item.id)} disabled={activePart === item.id}>
                  Teil {index + 1} · {wordCount(attempt[item.id])} Wörter
                </button>
              ))}
            </nav>
          </section>

          <section className="b1-final-writing-task" lang="de">
            <div className="b1-final-part-heading">
              <h2>{task.title}</h2><span>{task.meta}</span>
            </div>
            <p>{task.prompt}</p>
            {task.quote ? <blockquote><strong>{task.quoteBy}:</strong> „{task.quote}“</blockquote> : null}
            {task.points.length ? <ul>{task.points.map((point) => <li key={point}>{point}</li>)}</ul> : null}
            <p><strong>{task.instruction}</strong></p>
            <div className="b1-final-writing-label">
              <strong>Ihre Antwort</strong>
              <span>{wordCount(attempt[task.id])} Wörter · Ziel: circa {task.target}</span>
            </div>
            <textarea
              aria-label={`B1 Mock 4 Schreiben ${task.id} Antwort`}
              value={attempt[task.id]}
              onChange={(event) => setAttempt((prev) => ({ ...prev, [task.id]: event.target.value }))}
              disabled={submitted}
              placeholder=""
              autoComplete="off"
              rows={task.id === "teil3" ? 8 : 12}
            />
            <small>{submitted ? "Abgegeben · Schreibschutz aktiv" : "Automatisch auf diesem Gerät gespeichert"}</small>
          </section>

          {submitted ? (
            <section className="b1-final-rules" role="status">
              <h2>Schreiben abgegeben</h2>
              <p>Ihre drei Antworten sind gespeichert. Die KI-Bewertung ist eine separate Übungsbewertung, noch kein verifiziertes Gesamtergebnis aus Lesen, Hören, Schreiben und Sprechen.</p>
              {!attempt.result ? (
                <button type="button" className="b1-final-primary" disabled={marking} onClick={mark}>
                  {marking ? "Schreiben wird bewertet …" : "KI-Bewertung anfordern"}
                </button>
              ) : (
                <>
                  <h3>Schreiben: {Math.round(Number(attempt.result.score || 0) * 4)} / {B1_MOCK4_SCHREIBEN_RUBRIC.totalPoints} Punkte (Übung)</h3>
                  {attempt.result.overall_feedback_en ? <p>{attempt.result.overall_feedback_en}</p> : null}
                  {B1_MOCK4_WRITING_TASKS.map((item) => {
                    const part = attempt.result.parts?.[item.id] || {};
                    return <section key={item.id}>
                      <h4>{item.title}: {Number((Number(part.score || 0) * 4).toFixed(1))}/{item.maxPoints}</h4>
                      {part.feedback_en ? <p>{part.feedback_en}</p> : null}
                      <WritingMistakeList corrections={part.corrections || []} level="B1" />
                    </section>;
                  })}
                  <p>{attempt.cloudSaved ? "Ihr Übungsergebnis wurde mit Falowen synchronisiert." : "Das Ergebnis ist auf diesem Gerät gespeichert."}</p>
                  {!attempt.cloudSaved ? (
                    <button type="button" disabled={saving} onClick={() => saveResult(attempt.result)}>
                      {saving ? "Ergebnis wird gespeichert …" : "Ergebnis mit Falowen synchronisieren"}
                    </button>
                  ) : null}
                </>
              )}
              {markError ? <p role="alert">{markError}</p> : null}
              {saveError ? <p role="alert">{saveError}</p> : null}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
                <button type="button" onClick={() => navigate("/campus/course/b1-mock-4-lesen")}>B1 Mock 4 · Lesen öffnen</button>
                <button type="button" onClick={() => {
                  if (window.confirm("Start another writing attempt? This device's previous draft will be replaced.")) start();
                }}>Erneut üben</button>
              </div>
            </section>
          ) : (
            <section className="b1-final-rules">
              <p>Alle drei Aufgaben können über die Teil-Navigation bearbeitet werden. Geben Sie die Arbeit ab, wenn Sie fertig sind.</p>
              <button type="button" className="b1-final-primary" onClick={submit}>Alle drei Aufgaben abgeben</button>
            </section>
          )}
        </>
      )}
    </main>
  );
}

export default function B1Mock4Schreiben() {
  const { user } = useAuth();
  const studentId = user?.uid || "guest";
  const key = `${STORE}:${studentId}`;
  // Prevent drafts from one account being shown to another when users switch.
  return <B1Mock4SchreibenAttempt key={studentId} storageKey={key} />;
}
