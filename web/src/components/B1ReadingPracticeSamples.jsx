import React, { useEffect, useMemo, useState } from "react";
import { ReadingPracticeHeader, ReadingPartNavigation, ReadingPartFooter } from "./ReadingPracticeShell";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { saveExamRoomResult } from "../services/examRoomResultService";
import {
  getReadingPracticeStudentKey,
  getReadingReadinessLabel,
  getWeakestReadingSection,
  saveReadingPracticeAttempt,
} from "../services/readingPracticeHistory";
import {
  B1_READING_PART_KEYS,
  B1_READING_PRACTICE_SAMPLES,
  getB1ReadingQuestions,
} from "../data/b1ReadingPracticeSamples";
import "./B1FinalMockExamPage.css";

const DURATION_SECONDS = 65 * 60;
const timeLabel = (seconds) => {
  const safe = Math.max(0, seconds);
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
};
const PART_COUNT = Object.freeze({ teil1: 6, teil2: 6, teil3: 7, teil4: 7, teil5: 4 });
const choicesFor = (question, partKey) => {
  if (partKey === "teil1") return [["richtig", "Richtig"], ["falsch", "Falsch"]];
  if (partKey === "teil4") return [["ja", "Ja"], ["nein", "Nein"]];
  return question.options.map(({ id, label }) => [id, label]);
};

const Question = ({ question, partKey, answer, onAnswer, submitted }) => {
  const current = answer || "";
  const correct = current === question.answer;
  return (
    <section className="b1-final-question" style={{ padding: "14px 0", borderBottom: "1px solid #dfd4cd" }}>
      <strong>Aufgabe {question.number}. {question.question}</strong>
      <div className="b1-final-choices" role="radiogroup" aria-label={`Aufgabe ${question.number}`}>
        {choicesFor(question, partKey).map(([id, label]) => (
          <label key={id} className={current === id ? "selected" : ""}>
            <input
              type="radio"
              name={`b1-${partKey}-${question.number}`}
              checked={current === id}
              disabled={submitted}
              onChange={() => onAnswer(question.number, id)}
            />
            <strong>{["richtig", "falsch", "ja", "nein"].includes(id) ? "" : id}</strong>
            <span>{label}</span>
          </label>
        ))}
      </div>
      {submitted ? (
        <p role="status" style={{ marginBottom: 0, fontWeight: 700, color: correct ? "#166534" : "#991b1b" }}>
          {correct ? "Correct." : `Correct answer: ${question.answer.toUpperCase()}.`}
        </p>
      ) : null}
    </section>
  );
};

export default function B1ReadingPracticeSamples({ initialSampleId = "", standalone = false }) {
  const navigate = useNavigate();
  const { user, idToken, studentProfile } = useAuth();
  const [selectedId, setSelectedId] = useState(initialSampleId || B1_READING_PRACTICE_SAMPLES[0].id);
  const [partKey, setPartKey] = useState("teil1");
  const [answersBySample, setAnswersBySample] = useState({});
  const [submittedBySample, setSubmittedBySample] = useState({});
  const [savedBySample, setSavedBySample] = useState({});
  const [syncBySample, setSyncBySample] = useState({});
  const [timeBySample, setTimeBySample] = useState({});
  const [timerRunning, setTimerRunning] = useState(false);
  const [deadlineBySample, setDeadlineBySample] = useState({});
  const [hydratedKey, setHydratedKey] = useState("");

  const sample = B1_READING_PRACTICE_SAMPLES.find((item) => item.id === selectedId) || B1_READING_PRACTICE_SAMPLES[0];
  const partQuestions = useMemo(() => getB1ReadingQuestions(sample), [sample]);
  const allQuestions = B1_READING_PART_KEYS.flatMap((key) => partQuestions[key]);
  const answers = answersBySample[sample.id] || {};
  const submitted = Boolean(submittedBySample[sample.id]);
  const deadlineMs = deadlineBySample[sample.id];
  const secondsLeft = deadlineMs
    ? Math.max(0, Math.ceil((deadlineMs - Date.now()) / 1000))
    : (timeBySample[sample.id] ?? DURATION_SECONDS);
  const answeredCount = allQuestions.filter((question) => Boolean(answers[question.number])).length;
  const score = allQuestions.filter((question) => answers[question.number] === question.answer).length;
  const percent = Math.round((score / allQuestions.length) * 100);
  const sectionScores = B1_READING_PART_KEYS.map((key, index) => ({
    label: `Teil ${index + 1}`,
    score: partQuestions[key].filter((question) => answers[question.number] === question.answer).length,
    total: PART_COUNT[key],
  }));
  const weakest = getWeakestReadingSection(sectionScores);
  const studentKey = getReadingPracticeStudentKey({ user, studentProfile });

  // Preserve draft answers for the current student, level and sample.
  const storageKey = `falowen:exams:lesen:b1:three-samples:${studentKey || "guest"}`;
  useEffect(() => {
    setHydratedKey("");
    try {
      const saved = JSON.parse(window.localStorage.getItem(storageKey) || "null");
      if (saved && typeof saved === "object") {
        if (saved.answersBySample) setAnswersBySample(saved.answersBySample);
        if (saved.submittedBySample) setSubmittedBySample(saved.submittedBySample);
        if (saved.timeBySample) setTimeBySample(saved.timeBySample);
        if (saved.deadlineBySample) setDeadlineBySample(saved.deadlineBySample);
        if (!initialSampleId && B1_READING_PRACTICE_SAMPLES.some(item => item.id === saved.selectedId))
          setSelectedId(saved.selectedId);
        if (B1_READING_PART_KEYS.includes(saved.partKey)) setPartKey(saved.partKey);
      }
    } catch { /* Invalid drafts cannot block an exam. */ }
    setHydratedKey(storageKey);
  }, [storageKey, initialSampleId]);

  useEffect(() => {
    if (hydratedKey !== storageKey) return;
    window.localStorage.setItem(storageKey, JSON.stringify({
      selectedId, partKey, answersBySample, submittedBySample, timeBySample,
      deadlineBySample, updatedAt: new Date().toISOString(),
    }));
  }, [storageKey, hydratedKey, selectedId, partKey, answersBySample,
      submittedBySample, timeBySample, deadlineBySample]);

  useEffect(() => {
    if (!timerRunning || submitted) return undefined;
    const timer = window.setInterval(() => setTimeBySample(current => ({
      ...current, [sample.id]: Math.max(0, (current[sample.id] ?? DURATION_SECONDS) - 1),
    })), 1000);
    return () => window.clearInterval(timer);
  }, [timerRunning, submitted, sample.id]);

  useEffect(() => {
    if (secondsLeft === 0 && timerRunning) setTimerRunning(false);
  }, [secondsLeft, timerRunning]);

  const toggleTimer = () => {
    if (submitted || secondsLeft === 0) return;
    if (timerRunning) {
      setTimeBySample(current => ({...current,[sample.id]:secondsLeft}));
      setDeadlineBySample(current => ({...current,[sample.id]:null}));
      setTimerRunning(false);
    } else {
      setDeadlineBySample(current => ({...current,[sample.id]:Date.now() + secondsLeft * 1000}));
      setTimerRunning(true);
    }
  };

  const onAnswer = (number, value) => {
    if (submitted || secondsLeft === 0) return;
    setAnswersBySample((current) => ({
      ...current,
      [sample.id]: { ...(current[sample.id] || {}), [number]: value },
    }));
  };

  const submit = (expired = false) => {
    if (submitted || (!expired && answeredCount !== allQuestions.length)) return;
    setTimerRunning(false);
    setDeadlineBySample(current => ({...current,[sample.id]:null}));
    const attempt = saveReadingPracticeAttempt({
      level: "B1",
      setId: sample.id,
      score,
      total: allQuestions.length,
      elapsedSeconds: DURATION_SECONDS - secondsLeft,
      sectionScores,
      studentKey,
    });
    setSavedBySample((current) => ({ ...current, [sample.id]: attempt }));
    setSubmittedBySample((current) => ({ ...current, [sample.id]: true }));
    if (!attempt || !idToken) return;
    setSyncBySample((current) => ({ ...current, [sample.id]: "saving" }));
    void saveExamRoomResult({
      idToken,
      level: "B1",
      section: "lesen",
      setId: sample.id,
      title: `B1 ${sample.label}`,
      score,
      total: allQuestions.length,
      percent,
      passed: percent >= 60,
      attemptId: attempt.id,
      attemptNumber: attempt.attemptNumber,
      resultType: "practice",
      route: `/exams/lesen/b1/sample-${B1_READING_PRACTICE_SAMPLES.indexOf(sample) + 1}`,
      sectionScores: Object.fromEntries(sectionScores.map(({ label, score: points }) => [
        label.toLowerCase().replace(/\s/g, ""), points,
      ])),
    }).then(() => setSyncBySample((current) => ({ ...current, [sample.id]: "saved" })))
      .catch((error) => {
        console.warn("Could not sync B1 Lesen practice result", error);
        setSyncBySample((current) => ({ ...current, [sample.id]: "failed" }));
      });
  };

  const reset = () => {
    setTimerRunning(false);
    setAnswersBySample((current) => ({ ...current, [sample.id]: {} }));
    setSubmittedBySample((current) => ({ ...current, [sample.id]: false }));
    setSavedBySample((current) => ({ ...current, [sample.id]: null }));
    setSyncBySample((current) => ({ ...current, [sample.id]: "idle" }));
    setTimeBySample((current) => ({ ...current, [sample.id]: DURATION_SECONDS }));
    setDeadlineBySample(current => ({...current,[sample.id]:null}));
    setPartKey("teil1");
  };
  const selectSample = (nextId) => {
    setTimerRunning(false);
    setSelectedId(nextId);
    setPartKey("teil1");
  };
  useEffect(() => {
    if (hydratedKey === storageKey && secondsLeft === 0 && !submitted) submit(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydratedKey, storageKey, secondsLeft, submitted, sample.id]);

  const renderQuestions = (list, key) => list.map((q) => (
    <Question
      key={q.number}
      question={q}
      partKey={key}
      answer={answers[q.number]}
      submitted={submitted}
      onAnswer={onAnswer}
    />
  ));

  return (
    <main className="b1-final-shell" data-b1-reading-practice-samples>
      <ReadingPracticeHeader level="B1" sampleLabel={sample.label} part={Number(partKey.slice(-1))} partCount={5}
   answered={answeredCount} total={30} secondsLeft={secondsLeft}
   onBack={() => navigate(standalone ? "/exams/lesen" : "/exams/overview")}>
   <button type="button" className="reading-unified-back" disabled={submitted}
    onClick={toggleTimer}>{timerRunning ? "Pause" : "Start / resume"}</button>
  </ReadingPracticeHeader>
      <header className="b1-final-module-header">
        <p>B1 · Lesen · Exams Room</p>
        <h1>{sample.label}</h1>
        <p>Three independent reading samples · 30 questions in five Teile · 65 minutes each.</p>
        <button type="button" onClick={() => navigate(standalone ? "/exams/lesen" : "/exams/overview")}>
          {standalone ? "Back to Lesen samples" : "Back to Exams Room"}
        </button>
      </header>

      {!standalone ? (
        <nav aria-label="B1 reading sample selector" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {B1_READING_PRACTICE_SAMPLES.map((item, index) => (
            <button type="button" key={item.id} disabled={item.id === sample.id} onClick={() => selectSample(item.id)}>
              Lesen Sample {index + 1}
            </button>
          ))}
        </nav>
      ) : null}

      <section className="b1-final-paper" style={{ display: "grid", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "space-between" }}>
          <strong>Time left: {timeLabel(secondsLeft)}</strong>
          <button type="button" disabled={submitted || secondsLeft === 0} onClick={toggleTimer}>
            {timerRunning ? "Pause timer" : secondsLeft === DURATION_SECONDS ? "Start timer" : "Resume timer"}
          </button>
          <span>{answeredCount}/30 answered</span>
        </div>
        <ReadingPartNavigation
   parts={B1_READING_PART_KEYS.map(key => ({id:key,answered:partQuestions[key].filter(q=>answers[q.number]).length,total:partQuestions[key].length}))}
   active={Number(partKey.slice(-1))-1}
   onSelect={index => setPartKey("teil"+(index+1))}/>
      </section>

      <section className="b1-final-paper">
        <h2>{sample[partKey].title}</h2>
        {partKey === "teil1" ? (
          <>
            <p>{sample.teil1.intro}</p>
            <div className="b1-final-reading-text">
              <h3>{sample.teil1.heading}</h3><em>{sample.teil1.subheading}</em><p>{sample.teil1.date}</p>
              {sample.teil1.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            {renderQuestions(partQuestions.teil1, "teil1")}
          </>
        ) : null}

        {partKey === "teil2" ? (
          <>
            <p>Lesen Sie die beiden Artikel und wählen Sie a, b oder c.</p>
            <div className="b1-final-press-text">
              <h3>{sample.teil2.heading}</h3>
              {sample.teil2.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            {renderQuestions(sample.teil2.questions, "teil2")}
            <div className="b1-final-press-text">
              <h3>{sample.teil2.text2.heading}</h3>
              {sample.teil2.text2.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            {renderQuestions(sample.teil2.text2.questions, "teil2")}
          </>
        ) : null}

        {partKey === "teil3" ? (
          <>
            <p>{sample.teil3.context}</p>
            <div className="b1-final-ads">
              {sample.teil3.ads.map(([letter, title, description]) => (
                <article key={letter}>
                  <strong>Anzeige {letter}{letter === "C" ? " · Beispiel" : ""}</strong>
                  <h3>{title}</h3><p>{description}</p>
                </article>
              ))}
            </div>
            <div className="b1-final-situations">
              {sample.teil3.situations.map((question) => (
                <label key={question.number}>
                  <span><strong>Aufgabe {question.number}.</strong> {question.text}</span>
                  <select
                    value={answers[question.number] || ""}
                    disabled={submitted}
                    onChange={(event) => onAnswer(question.number, event.target.value)}
                    aria-label={`Anzeige für Aufgabe ${question.number}`}
                  >
                    <option value="">Anzeige wählen</option>
                    <option value="0">0 · keine passende Anzeige</option>
                    {"ABCDEFGHIJ".split("").filter((letter) => letter !== "C").map((letter) => (
                      <option key={letter} value={letter.toLowerCase()}>{letter}</option>
                    ))}
                  </select>
                  {submitted ? (
                    <small style={{ color: answers[question.number] === question.answer ? "#166534" : "#991b1b" }}>
                      {answers[question.number] === question.answer ? "Correct." : `Correct answer: ${question.answer.toUpperCase()}`}
                    </small>
                  ) : null}
                </label>
              ))}
            </div>
          </>
        ) : null}

        {partKey === "teil4" ? (
          <>
            <p>{sample.teil4.context}</p>
            {sample.teil4.comments.map((comment) => (
              <div className="b1-final-comment" key={comment.number}>
                <p><strong>{comment.number}. {comment.person}:</strong> „{comment.text}“</p>
                <Question
                  question={{ ...comment, question: "Welche Meinung vertritt diese Person?" }}
                  partKey="teil4"
                  answer={answers[comment.number]}
                  submitted={submitted}
                  onAnswer={onAnswer}
                />
              </div>
            ))}
          </>
        ) : null}

        {partKey === "teil5" ? (
          <>
            <p>{sample.teil5.context}</p>
            <div className="b1-final-reading-text">
              <h3>{sample.teil5.heading}</h3>
              {sample.teil5.sections.map(([heading, paragraph]) => <section key={heading}><h4>{heading}</h4><p>{paragraph}</p></section>)}
            </div>
            {renderQuestions(partQuestions.teil5, "teil5")}
          </>
        ) : null}
      </section>

      <ReadingPartFooter partIndex={Number(partKey.slice(-1))-1} partCount={5}
   onPrevious={() => setPartKey("teil"+Math.max(1,Number(partKey.slice(-1))-1))}
   onNext={() => setPartKey("teil"+Math.min(5,Number(partKey.slice(-1))+1))}>
   answeredCount/30 answered
  </ReadingPartFooter>
  <footer className="b1-final-paper">
        {!submitted ? (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
            <span>Complete every Teil before checking your answers ({answeredCount}/30).</span>
            <button type="button" className="b1-final-primary" disabled={answeredCount !== 30} onClick={() => submit()}>
              Check answers
            </button>
          </div>
        ) : (
          <div role="status" style={{ display: "grid", gap: 10 }}>
            <h2>Result: {score}/30 · {percent}% · {getReadingReadinessLabel(percent)}</h2>
            <p>{weakest ? `Practise next: ${weakest.label} (${weakest.score}/${weakest.total}).` : ""}</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {sectionScores.map((part) => <span key={part.label}>{part.label}: {part.score}/{part.total}</span>)}
            </div>
            <p>{savedBySample[sample.id] ? `Saved as attempt ${savedBySample[sample.id].attemptNumber}.` : "This result could not be saved locally."}</p>
            {syncBySample[sample.id] === "saving" ? <p>Syncing your result…</p> : null}
            {syncBySample[sample.id] === "saved" ? <p>Your result is synced.</p> : null}
            {syncBySample[sample.id] === "failed" ? <p>Cloud sync could not be confirmed. Your local result remains available.</p> : null}
            <button type="button" onClick={reset}>Try this sample again</button>
          </div>
        )}
      </footer>
    </main>
  );
}
