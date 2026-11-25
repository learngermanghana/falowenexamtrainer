import React, { useState } from "react";
import axios from "axios";
import { getBackendUrl } from "../services/backendUrl";
import "./MockListeningReview.css";

const normalize = value => String(value ?? "").trim().toLowerCase();
export function listeningReviewRow({ number, part, submitted, expected, question, explanation, display = value => String(value ?? "").toUpperCase() }) {
  const known = Boolean(normalize(expected));
  return { number, part, question, explanation,
    submitted: normalize(submitted) ? display(submitted) : "Not answered",
    expected: known ? display(expected) : null,
    status: !known ? "unavailable" : !normalize(submitted) ? "unanswered" : normalize(submitted) === normalize(expected) ? "correct" : "incorrect" };
}
export default function MockListeningReview({ rows = [] }) {
  const [mistakesOnly, setMistakesOnly] = useState(false);
  const correct = rows.filter(row => row.status === "correct").length;
  const incorrect = rows.filter(row => row.status === "incorrect").length;
  const unanswered = rows.filter(row => row.status === "unanswered").length;
  const unavailable = rows.filter(row => row.status === "unavailable").length;
  return <section className="mock-listening-review" aria-label="Hören answer review">
    <h2>Hören review</h2>
    {!rows.length ? <p>Question-level review is not available for this saved attempt. Your score is unchanged.</p> : <>
      <p><strong>{correct}/{rows.length} correct</strong>{!unavailable ? ` · ${Math.round(correct / rows.length * 100)}%` : ""} · {incorrect} incorrect · {unanswered} unanswered{unavailable ? ` · ${unavailable} unavailable` : ""}</p>
      <div className="mock-listening-review-overview" aria-label="Question overview">
        {rows.map(row => <span key={`${row.part}-${row.number}`} className={`review-${row.status}`} aria-label={`Question ${row.number}: ${row.status}`}>{row.number} {row.status === "correct" ? "✓" : row.status === "incorrect" ? "✕" : "–"}</span>)}
      </div>
      <label><input type="checkbox" checked={mistakesOnly} onChange={event => setMistakesOnly(event.target.checked)} /> Show mistakes only</label>
      <div className="mock-listening-review-rows">
        {rows.filter(row => !mistakesOnly || ["incorrect", "unanswered"].includes(row.status)).map(row => <article key={`${row.part}-${row.number}`} className={`review-${row.status}`}>
          <strong>Aufgabe {row.number}{row.part ? ` · Teil ${row.part}` : ""} — {row.status === "correct" ? "Correct" : row.status === "incorrect" ? "Incorrect" : row.status === "unanswered" ? "Not answered" : "Review unavailable"}</strong>
          {row.question ? <p>{row.question}</p> : null}
          <p>Your answer: {row.submitted}</p>
          <p>Correct answer: {row.expected ?? "Unavailable"}</p>
          {row.explanation ? <p>{row.explanation}</p> : null}
        </article>)}
        {mistakesOnly && !incorrect && !unanswered ? <p>No recorded mistakes to review.</p> : null}
      </div>
    </>}
  </section>;
}

export function SavedMockListeningReview({ rows, level, attemptId, idToken }) {
  const [loaded, setLoaded] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const review = rows?.length ? rows : loaded || [];
  async function load() {
    if (busy || !idToken || !attemptId) return;
    setBusy(true); setError("");
    try {
      const response = await axios.post(`${getBackendUrl()}/mock/attempt/listening-review`, { level, attemptId }, {headers:{Authorization:`Bearer ${idToken}`}});
      setLoaded(Array.isArray(response.data?.rows) ? response.data.rows : []);
    } catch {
      setError("Could not load the saved review. Please try again.");
    } finally { setBusy(false); }
  }
  return <>
    <MockListeningReview rows={review.map(row=>listeningReviewRow(row))}/>
    {!review.length && !loaded && attemptId && idToken ? <button type="button" disabled={busy} onClick={load}>{busy?"Loading review…":"Load saved Hören answers"}</button> : null}
    {error ? <p role="alert">{error}</p> : null}
  </>;
}
