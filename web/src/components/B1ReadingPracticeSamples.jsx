import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { ReadingPracticeHeader, ReadingPracticeParts } from "./ReadingPracticeShell";

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
  const [hydratedStorageKey, setHydratedStorageKey] = useState("");
  const submittedForExpiry = useRef({});

  const sample = B1_READING_PRACTICE_SAMPLES.find((item) => item.id === selectedId) || B1_READING_PRACTICE_SAMPLES[0];
  const partQuestions = useMemo(() => getB1ReadingQuestions(sample), [sample]);
  const allQuestions = B1_READING_PART_KEYS.flatMap((key) => partQuestions[key]);
  const answers = answersBySample[sample.id] || {};
  const submitted = Boolean(submittedBySample[sample.id]);
  const secondsLeft = timeBySample[sample.id] ?? DURATION_SECONDS;
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
  const storageKey = `falowen:exams:lesen:b1:three-samples:${studentKey || "guest"}`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = JSON.parse(window.localStorage.getItem(storageKey) || "null");
      if (!saved || typeof saved !== "object") return;
      if (saved.answersBySample) setAnswersBySample(saved.answersBySample);
      if (saved.submittedBySample) setSubmittedBySample(saved.submittedBySample);
      if (saved.timeBySample) setTimeBySample(saved.timeBySample);
      if (!initialSampleId && B1_READING_PRACTICE_SAMPLES.some(item => item.id === saved.selectedId)) {
        setSelectedId(saved.selectedId);
      }
      if (B1_READING_PART_KEYS.includes(saved.partKey)) setPartKey(saved.partKey);
    } catch (_error) {
      // A damaged local cache cannot prevent reading practice.
    } finally {
      setHydratedStorageKey(storageKey);
    }
  }, [initialSampleId, storageKey]);

  useEffect(() => {
    if (hydratedStorageKey !== storageKey || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({
        selectedId, partKey, answersBySample, submittedBySample, timeBySample,
        updatedAt: new Date().toISOString(),
      }));
    } catch (_error) {
      // Storage limits must not prevent learners from answering.
    }
  }, [hydratedStorageKey,storageKey,selectedId,partKey,answersBySample,submittedBySample,timeBySample]);


  useEffect(() => {
    if (!timerRunning || submitted || secondsLeft <= 0) return undefined;
    const handle = window.setInterval(() => {
      setTimeBySample((current) => ({
        ...current,
        [sample.id]: Math.max(0, (current[sample.id] ?? DURATION_SECONDS) - 1),
      }));
    }, 1000);
    return () => window.clearInterval(handle);
  }, [sample.id, secondsLeft, submitted, timerRunning]);

  useEffect(() => {
    if (secondsLeft === 0) setTimerRunning(false);
  }, [secondsLeft]);

  const onAnswer = (number, value) => {
    if (submitted || secondsLeft <= 0 || hydratedStorageKey !== storageKey) return;
    setAnswersBySample((current) => ({
      ...current,
      [sample.id]: { ...(current[sample.id] || {}), [number]: value },
    }));
  };

  const submit = (allowPartial = false) => {
    if (submitted || hydratedStorageKey !== storageKey || (!allowPartial && answeredCount !== allQuestions.length)) return;
    if (submittedForExpiry.current[sample.id]) return;
    submittedForExpiry.current[sample.id] = true;
    setTimerRunning(false);
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

  useEffect(() => {
    if (hydratedStorageKey !== storageKey || submitted || secondsLeft !== 0) return;
    submit(true); // Practice timeout: unanswered questions count as incorrect.
  }, [hydratedStorageKey, storageKey, submitted, secondsLeft, sample.id]);

  const reset = () => {
    submittedForExpiry.current[sample.id] = false;
    setTimerRunning(false);
    setAnswersBySample((current) => ({ ...current, [sample.id]: {} }));
    setSubmittedBySample((current) => ({ ...current, [sample.id]: false }));
    setSavedBySample((current) => ({ ...current, [sample.id]: null }));
    setSyncBySample((current) => ({ ...current, [sample.id]: "idle" }));
    setTimeBySample((current) => ({ ...current, [sample.id]: DURATION_SECONDS }));
    setPartKey("teil1");
  };
  const selectSample = (nextId) => {
    setTimerRunning(false);
    setSelectedId(nextId);
    setPartKey("teil1");
  };
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
    <main className="b1-final-shell" data-b1-reading-practice-samples data-reading-standard="B1">
      <ReadingPracticeHeader
        level="B1" sampleLabel={sample.label} total={30} partCount={5}
        durationSeconds={DURATION_SECONDS} secondsLeft={secondsLeft} answered={answeredCount}
        timerRunning={timerRunning} submitted={submitted}
        onToggleTimer={() => setTimerRunning(value => !value)}
        onBack={() => navigate(standalone ? "/exams/lesen" : "/exams/overview")}
      />
      {!standalone ? (
        <nav aria-label="B1 reading sample selector" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {B1_READING_PRACTICE_SAMPLES.map((item, index) => (
            <button type="button" key={item.id} disabled={item.id === sample.id} onClick={() => selectSample(item.id)}>
              Lesen Sample {index + 1}
            </button>
          ))}
        </nav>
      ) : null}
      <ReadingPracticeParts level="B1" activePart={partKey} onSelect={setPartKey}
        parts={B1_READING_PART_KEYS.map((key, index) => ({
          id:key,label:`Teil ${index+1}`,total:PART_COUNT[key],
          answered:partQuestions[key].filter(question => answers[question.number]).length,
        }))}/>
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

      <footer className="b1-final-paper">
        {!submitted ? (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
            <span>{secondsLeft === 0 ? "Time expired. Unanswered tasks are scored as incorrect." : `Complete every Teil before checking your answers (${answeredCount}/30).`}</span>
            <button type="button" className="b1-final-primary" disabled={answeredCount !== 30 || submitted} onClick={() => submit(false)}>
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
