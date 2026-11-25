import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSwahiliProgress } from "../hooks/useSwahiliProgress";
import { Link, useLocation } from "react-router-dom";
import { PASS_MARK } from "../utils/assignmentProgress";
import ResultHistory from "./ResultHistory";
import { styles } from "../styles";
export default function SwahiliResults({ uid }) {
  const { t } = useTranslation();
  const { hash } = useLocation();
  const { records, failed } = useSwahiliProgress(uid);
  const rows = records?.filter(row => row.submitted).map(row => ({ ...row, title: row.submission?.title || row.title })) ?? null;

  useEffect(() => {
    if (rows?.some(row => "#" + row.id === hash)) {
      document.getElementById(hash.slice(1))?.scrollIntoView?.({ block: "start" });
    }
  }, [hash, records]);

  const results = (rows || []).filter(({ review }) => Number.isInteger(review?.score)).map(({ day, title, review, id, level }) => {
    const writing = Object.entries(review.answerReference?.writing || {});
    const reading = Object.values(review.answerReference?.reading || {});
    return {
      id, assignmentId: id, assignment: `Day ${day} · ${title}`, level,
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
      {pending.map(({ day, title, review, id, route }) => (
        <article id={id} key={id} style={styles.resultCard}>
          <h3>{t("resultsOverview.day", { day })} · {title}</h3>
          <p>{review?.status === "needs_revision" ? t("resultsOverview.revisionNeeded") : review ? t("resultsOverview.reviewed") : t("resultsOverview.awaitingTutor")}</p>
          {review?.feedback && <p style={{ whiteSpace: "pre-wrap" }}>{review.feedback}</p>}
          {review?.status === "needs_revision" && <Link to={`/campus/course/swahili/${route.slice(1)}?view=submit`}>{t("resultsOverview.revise")}</Link>}
        </article>
      ))}
    </div>
  );
}
