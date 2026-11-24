import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { loadSwahiliSubmissions } from "../utils/swahiliSubmissions";
import { Link, useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { PASS_MARK } from "../utils/assignmentProgress";
import ResultHistory from "./ResultHistory";
import { styles } from "../styles";
import { getCurrentSwahiliReview } from "../utils/swahiliWorkbookReview";

import { SWAHILI_A1_ASSIGNMENTS } from "../data/swahili/a1Curriculum";

const lessons = [
  { day: 26, title: "B1 · Matatizo ya safari na suluhisho zake" },
  { day: 28, title: "B1 · Kutunza Mazingira katika Maisha ya Kila Siku" },
  ...SWAHILI_A1_ASSIGNMENTS,
];

export default function SwahiliResults({ uid }) {
  const { t } = useTranslation();
  const { hash } = useLocation();
  const [rows, setRows] = useState(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!db || !uid) return;
    let active = true;
    loadSwahiliSubmissions(uid).then(submissions => Promise.all(lessons.map(async ({ day, title }) => {
      const lessonDoc = [26, 28].includes(day) ? `b1-day-${day}` : `day-${day}`;
      const submission = submissions.get(lessonDoc);
      if (submission?.status !== "submitted") return null;
      const review = await getDoc(doc(db, "swahiliTeacherReviews", day === 1 ? uid : `${uid}_${lessonDoc}`));
      return { day, title, review: getCurrentSwahiliReview(submission, review.data()) };
    }))).then((entries) => {
      if (active) setRows(entries.filter(Boolean));
    }).catch(() => {
      if (active) setFailed(true);
    });
    return () => { active = false; };
  }, [uid]);

  useEffect(() => {
    if (/^#swahili-(day-([1-9]|1[0-9]|20)|b1-day-(26|28))$/.test(hash) && rows) {
      document.getElementById(hash.slice(1))?.scrollIntoView?.({ block: "start" });
    }
  }, [hash, rows]);

  const results = (rows || []).filter(({ review }) => Number.isInteger(review?.score)).map(({ day, title, review }) => {
    const id = [26, 28].includes(day) ? `swahili-b1-day-${day}` : `swahili-day-${day}`;
    const writing = Object.entries(review.answerReference?.writing || {});
    const reading = Object.values(review.answerReference?.reading || {});
    return {
      id, assignmentId: id, assignment: `Day ${day} · ${title}`, level: [26, 28].includes(day) ? "B1" : "A1",
      score: review.score, revisionRequested: review.status === "needs_revision", comments: review.feedback, source: "swahili_tutor",
      date: review.reviewedAt?.toDate?.().toISOString(),
      referenceParts: [
        ...(writing.length ? [{ id: "teil2", answers: writing.map(([question, answer]) => ({ question, answer })) }] : []),
        ...(reading.length ? [{ id: "teil3", answers: reading.map(({ prompt, answer }) => ({ question: prompt, answer })) }] : []),
        ...(review.answerReference?.listening ? [{ id: "teil4", answers: Object.values(review.answerReference?.listening || {}).map(({ prompt, answer }) => ({ question: prompt, answer })) }] : []),
      ],
    };
  });
  const passed = results.filter(({ score }) => score >= PASS_MARK).length;
  const pending = (rows || []).filter(({ review }) => !Number.isInteger(review?.score));

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>{t("resultsOverview.title")}</h2>
        {failed && <p role="alert">{t("resultsOverview.refreshError")}</p>}
        {!rows && !failed && <p role="status">{t("resultsOverview.loading")}</p>}
        {rows && <p style={styles.helperText}>{t("resultsOverview.swSummary", { marked: results.length, passed, pending: pending.length })}</p>}
        {results.length > 0 && <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: "12px 14px" }}>
          <strong>{t("resultsOverview.overview")}</strong>
          <p style={styles.helperText}>{t("resultsOverview.swAverage", { average: Math.round(results.reduce((total, item) => total + item.score, 0) / results.length), passMark: PASS_MARK })}</p>
        </div>}
        {rows?.length === 0 && <p>{t("resultsOverview.swEmpty")}</p>}
      </section>
      {results.length > 0 && <ResultHistory results={results} focusedResultId={hash.slice(1)} />}
      {pending.map(({ day, title, review }) => (
        <article id={[26, 28].includes(day) ? `swahili-b1-day-${day}` : `swahili-day-${day}`} key={day} style={styles.resultCard}>
          <h3>{t("resultsOverview.day", { day })} · {title}</h3>
          <p>{review?.status === "needs_revision" ? t("resultsOverview.revisionNeeded") : review ? t("resultsOverview.reviewed") : t("resultsOverview.awaitingTutor")}</p>
          {review?.feedback && <p style={{ whiteSpace: "pre-wrap" }}>{review.feedback}</p>}
          {review?.status === "needs_revision" && <Link to={`/campus/course/swahili/${[26, 28].includes(day) ? `b1/day-${day}` : `day-${day}`}?view=submit`}>{t("resultsOverview.revise")}</Link>}
        </article>
      ))}
    </div>
  );
}
