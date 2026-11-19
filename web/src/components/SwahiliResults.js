import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { PASS_MARK } from "../utils/assignmentProgress";
import ResultHistory from "./ResultHistory";
import { styles } from "../styles";
import { getCurrentSwahiliReview } from "../utils/swahiliWorkbookReview";

const lessons = [
  { day: 28, title: "B1 · Kutunza Mazingira katika Maisha ya Kila Siku" },
  { day: 1, title: "Alfabeti, sauti na matamshi" },
  { day: 11, title: "Dukani" },
  { day: 6, title: "Mgahawani" },
];

export default function SwahiliResults({ uid }) {
  const { hash } = useLocation();
  const [rows, setRows] = useState(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!db || !uid) return;
    let active = true;
    Promise.all(lessons.map(async ({ day, title }) => {
      const lessonDoc = day === 28 ? "b1-day-28" : `day-${day}`;
      const [submission, review] = await Promise.all([
        getDoc(doc(db, "users", uid, "swahiliLessons", lessonDoc)),
        getDoc(doc(db, "swahiliTeacherReviews", day === 1 ? uid : `${uid}_${lessonDoc}`)),
      ]);
      if (submission.data()?.status !== "submitted") return null;
      return { day, title, review: getCurrentSwahiliReview(submission.data(), review.data()) };
    })).then((entries) => {
      if (active) setRows(entries.filter(Boolean));
    }).catch(() => {
      if (active) setFailed(true);
    });
    return () => { active = false; };
  }, [uid]);

  useEffect(() => {
    if (/^#swahili-(day-(1|6|11)|b1-day-28)$/.test(hash) && rows) {
      document.getElementById(hash.slice(1))?.scrollIntoView?.({ block: "start" });
    }
  }, [hash, rows]);

  const results = (rows || []).filter(({ review }) => Number.isInteger(review?.score)).map(({ day, title, review }) => {
    const id = day === 28 ? "swahili-b1-day-28" : `swahili-day-${day}`;
    const writing = Object.entries(review.answerReference?.writing || {});
    const reading = Object.values(review.answerReference?.reading || {});
    return {
      id, assignmentId: id, assignment: `Day ${day} · ${title}`, level: day === 28 ? "B1" : "A1",
      score: review.score, revisionRequested: review.status === "needs_revision", comments: review.feedback, source: "swahili_tutor",
      date: review.reviewedAt?.toDate?.().toISOString(),
      referenceParts: [
        ...(writing.length ? [{ id: "teil2", answers: writing.map(([question, answer]) => ({ question, answer })) }] : []),
        ...(reading.length ? [{ id: "teil3", answers: reading.map(({ prompt, answer }) => ({ question: prompt, answer })) }] : []),
        ...(day === 11 ? [{ id: "teil4", answers: Object.values(review.answerReference?.listening || {}).map(({ prompt, answer }) => ({ question: prompt, answer })) }] : []),
      ],
    };
  });
  const passed = results.filter(({ score }) => score >= PASS_MARK).length;
  const pending = (rows || []).filter(({ review }) => !Number.isInteger(review?.score));

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Results</h2>
        {failed && <p role="alert">Could not load your results. Refresh the page to try again.</p>}
        {!rows && !failed && <p role="status">Loading your results…</p>}
        {rows && <p style={styles.helperText}>{results.length} marked · {passed} passed · {pending.length} awaiting a score</p>}
        {results.length > 0 && <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: "12px 14px" }}>
          <strong>Your marked-work overview</strong>
          <p style={styles.helperText}>Average score: {Math.round(results.reduce((total, item) => total + item.score, 0) / results.length)}% · Pass mark: {PASS_MARK}%</p>
        </div>}
        {rows?.length === 0 && <p>Your submitted workbooks will appear here.</p>}
      </section>
      {results.length > 0 && <ResultHistory results={results} focusedResultId={hash.slice(1)} />}
      {pending.map(({ day, title, review }) => (
        <article id={day === 28 ? "swahili-b1-day-28" : `swahili-day-${day}`} key={day} style={styles.resultCard}>
          <h3>Day {day} · {title}</h3>
          <p>{review?.status === "needs_revision" ? "Revision needed" : review ? "Reviewed" : "Awaiting tutor review"}</p>
          {review?.feedback && <p style={{ whiteSpace: "pre-wrap" }}>{review.feedback}</p>}
          {review?.status === "needs_revision" && <Link to={`/campus/course/swahili/${day === 28 ? "b1/day-28" : `day-${day}`}?view=submit`}>Revise submission</Link>}
        </article>
      ))}
    </div>
  );
}
