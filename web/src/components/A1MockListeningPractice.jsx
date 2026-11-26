import ExamMistakeReview from "./ExamMistakeReview";
import { weakestScoredExamPart } from "../utils/examStudyPartner";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles";
import { A1_MOCK_4_LISTENING } from "../data/a1Mock4Listening";
import { A1_MOCK_5_LISTENING } from "../data/a1Mock5Listening";
import { A1_MOCK_6_LISTENING } from "../data/a1Mock6Listening";
import { A1_MOCK_7_LISTENING } from "../data/a1Mock7Listening";
import { A1_MOCK_8_LISTENING } from "../data/a1Mock8Listening";
import { scoreA1HoerenOnly } from "../services/a2HoerenOnlyService";
import { saveExamRoomResult } from "../services/examRoomResultService";
import { SampleAudio } from "./ListeningPracticeSamplePage";

const papers = { 4: A1_MOCK_4_LISTENING, 5: A1_MOCK_5_LISTENING, 6: A1_MOCK_6_LISTENING,
  7: A1_MOCK_7_LISTENING, 8: A1_MOCK_8_LISTENING };
const binary = [{ id: "richtig", label: "Richtig" }, { id: "falsch", label: "Falsch" }];

export default function A1MockListeningPractice({ mockNumber, allowExamMistakeReview = false }) {
  const navigate = useNavigate();
  const { idToken } = useAuth();
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const audioId = `mock-0${mockNumber}`;
  const title = `A1 Hören Sample ${mockNumber}`;
  const route = `/exams/horen/a1/sample-${mockNumber}`;

  async function submit() {
    setBusy(true);
    setMessage("");
    try {
      const graded = await scoreA1HoerenOnly({ mockId: `a1-${audioId}`, answers, idToken });
      setResult(graded);
      try {
        await saveExamRoomResult({
          idToken, level: "A1", section: "hoeren", setId: `a1-hoeren-sample-${mockNumber}`,
          title, route, score: graded.correct, total: graded.total, percent: graded.percent,
          passed: graded.percent >= 60, sectionScores: graded.partScores, resultType: "practice",
          attemptId: `a1-hoeren-only-${mockNumber}-${Date.now()}`,
        });
        setMessage("Practice result saved to your Exam File.");
      } catch {
        setMessage("Your score is shown here. The Exam File could not be updated.");
      }
    } catch (error) {
      setMessage(error.response?.data?.error || error.message || "Could not check your answers.");
    } finally {
      setBusy(false);
    }
  }

  return <main style={{ display: "grid", gap: 12 }}>
    <header style={styles.card}>
      <button onClick={() => navigate("/exams/horen")}>← Back to Hören samples</button>
      <h1>{title}</h1>
      <p>From A1 Mock {mockNumber} · 3 listening parts · 15 questions</p>
    </header>
    {Object.entries(papers[mockNumber]).map(([partId, part]) => {
      const number = partId.slice(-1);
      return <section key={partId} style={styles.card} lang="de">
        <h2>{part.title}</h2>
        <p>{part.instruction}</p>
        <SampleAudio level="A1" mockAudioId={audioId} part={`teil-${number}`}
          objectKey={part.audioObjectKey} plays={part.plays} idToken={idToken} />
        {part.questions.map(question => {
          const id = `t${number}-${question.number}`;
          return <fieldset key={id} disabled={busy || Boolean(result)}>
            <legend>{question.number}. {question.question || question.statement}</legend>
            {question.context && <p>{question.context}</p>}
            {(question.options || binary).map(option =>
              <label key={option.id} style={{ display: "block", padding: 6 }}>
                <input type="radio" name={id} checked={answers[id] === option.id}
                  onChange={() => setAnswers(old => ({ ...old, [id]: option.id }))} /> {option.label}
              </label>)}
          </fieldset>;
        })}
      </section>;
    })}
    <section style={styles.card}>
      {result ? <>
        <h2>Hören result · {result.correct}/{result.total} · {result.percent}%</h2>
        {allowExamMistakeReview && <ExamMistakeReview level="A1" section="horen" completed={Boolean(result)} part={weakestScoredExamPart(Object.entries(result.partScores || {}).map(([label,score])=>({label,score,total:5})))} />}
        <button disabled={busy} onClick={() => { setAnswers({}); setResult(null); setMessage(""); }}>Practise again</button>
      </> : <button disabled={busy || Object.keys(answers).length !== 15} onClick={submit}>
        {busy ? "Checking answers…" : `Check answers (${Object.keys(answers).length}/15)`}
      </button>}
      {message && <p role="status">{message}</p>}
    </section>
  </main>;
}
