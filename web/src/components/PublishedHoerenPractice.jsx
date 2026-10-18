import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getPublishedHoerenLesson, gradePublishedHoerenLesson } from "../services/publishedHoerenService";

const wrap = { border: "1px solid #bfdbfe", borderRadius: 14, padding: 16, background: "#f8fbff", display: "grid", gap: 12 };
const questionStyle = { display: "grid", gap: 8, background: "#fff", padding: 12, border: "1px solid #dce7f5", borderRadius: 10 };

export default function PublishedHoerenPractice({ assignmentKey }) {
  const { idToken } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLesson(null);
    setResult(null);
    setAnswers({});
    setError("");
    if (!idToken || !assignmentKey) return () => { active = false; };
    getPublishedHoerenLesson(assignmentKey, idToken).then(value => {
      if (active) setLesson(value);
    }).catch(reason => {
      if (active && reason?.response?.status !== 404) setError("Zusätzliches Hören konnte nicht geladen werden.");
    });
    return () => { active = false; };
  }, [assignmentKey, idToken]);

  if (!lesson && !error) return null;
  const complete = lesson?.questions.every((_, index) => Object.hasOwn(answers, index));
  const submit = async () => {
    if (!complete || busy || !lesson) return;
    setBusy(true); setError("");
    try {
      const ordered = lesson.questions.map((_, index) => answers[index]);
      const graded = await gradePublishedHoerenLesson({
        assignmentKey, revision: lesson.revision, answers: ordered, idToken,
      });
      setResult(graded);
    } catch (e) { setError(e?.response?.data?.error || "Die Bewertung ist derzeit nicht verfügbar."); }
    finally { setBusy(false); }
  };

  return <section style={wrap} data-published-hoeren={assignmentKey}>
    <div>
      <strong style={{ color: "#1e40af" }}>Zusätzliche Hören-Übung · Falowen Studio</strong>
      <h3 style={{ margin: "6px 0" }}>{lesson?.title || "Hören"}</h3>
      <p style={{ margin: 0, color: "#475569", fontSize: 13 }}>
        Hören Sie die Aufnahme und beantworten Sie alle fünf Fragen. Diese Übung wird automatisch bewertet.
        Sie ersetzt nicht die reguläre Tutor-Abgabe.
      </p>
    </div>
    {lesson ? <>
      <audio controls preload="metadata" src={lesson.audioUrl} style={{ width: "100%" }} aria-label={lesson.title} />
      {lesson.questions.map((entry, index) => <fieldset key={entry.id} style={questionStyle}>
        <legend style={{ fontWeight: 700 }}>{index + 1}. {entry.question}</legend>
        {(lesson.kind === "richtig-falsch" ? ["Richtig", "Falsch"] : (entry.options || []))
          .map((option, choice) => {
            const value = lesson.kind === "richtig-falsch" ? option : choice;
            return <label key={choice} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="radio" name={`studio-${assignmentKey}-${index}`} value={String(value)}
                checked={answers[index] === value} disabled={!!result || busy}
                onChange={() => setAnswers(previous => ({ ...previous, [index]: value }))} />
              {option}
            </label>;
          })}
        {result ? <small style={{ color: "#166534" }}>
          Lösung: {lesson.kind === "richtig-falsch" ? result.correctAnswers[index] : entry.options[result.correctAnswers[index]]}
          {result.evidence?.[index] ? ` · Textstelle: „${result.evidence[index]}“` : ""}
        </small> : null}
      </fieldset>)}
      {result ? <div role="status" style={{ fontWeight: 700 }}>Ergebnis: {result.correct}/5 · {result.score}%</div>
        : <button type="button" onClick={submit} disabled={!complete || busy}
            style={{ padding: 12, color: "#fff", border: 0, background: "#1d4ed8", borderRadius: 9, fontWeight: 700 }}>
            {busy ? "Antworten werden bewertet…" : "5 Antworten kontrollieren"}
          </button>}
    </> : null}
    {error ? <p role="alert" style={{ color: "#b91c1c" }}>{error}</p> : null}
  </section>;
}
