import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { styles } from "../styles";
import { getCurrentSwahiliReview } from "../utils/swahiliWorkbookReview";

const lessons = [
  { day: 1, title: "Alfabeti, sauti na matamshi" },
  { day: 6, title: "Mgahawani" },
];

export default function SwahiliResults({ uid }) {
  const [rows, setRows] = useState(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!db || !uid) return;
    let active = true;
    Promise.all(lessons.map(async ({ day, title }) => {
      const [submission, review] = await Promise.all([
        getDoc(doc(db, "users", uid, "swahiliLessons", `day-${day}`)),
        getDoc(doc(db, "swahiliTeacherReviews", day === 1 ? uid : `${uid}_day-${day}`)),
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

  return (
    <section style={{ display: "grid", gap: 12 }}>
      <h2>Swahili Results</h2>
      {failed && <p role="alert">Could not load your results. Refresh the page to try again.</p>}
      {!rows && !failed && <p role="status">Loading results…</p>}
      {rows?.length === 0 && <p>Your submitted workbooks will appear here.</p>}
      {rows?.map(({ day, title, review }) => (
        <article key={day} style={styles.card}>
          <h3>Day {day} · {title}</h3>
          <p>{!review ? "Awaiting tutor review" : review.status === "needs_revision" ? "Revision needed" : "Reviewed"}</p>
          {Number.isInteger(review?.score) && <p>Score: {review.score}/100</p>}
          {review?.feedback && <p style={{ whiteSpace: "pre-wrap" }}>{review.feedback}</p>}
          {review?.status === "needs_revision" && (
            <Link to={`/campus/course/swahili/day-${day}?view=submit`}>Revise submission</Link>
          )}
        </article>
      ))}
    </section>
  );
}
