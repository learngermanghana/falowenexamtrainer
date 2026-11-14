import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { db, doc, getDoc } from "../firebase";
import { SWAHILI_DAY_ONE } from "../data/swahili/dayOne";
import { SWAHILI_DAY_SIX } from "../data/swahili/daySix";
import { getCurrentSwahiliReview } from "../utils/swahiliWorkbookReview";
import { styles } from "../styles";
import { courseBookStyles as book } from "./courseBookStyles";
import "./CourseTabResponsive.css";

const primaryLink = { ...styles.primaryButton, ...styles.primaryButtonLink, minHeight: 44 };

const LESSONS = [SWAHILI_DAY_ONE, SWAHILI_DAY_SIX];
const FILTERS = [
  { key: "all", label: "All lessons" },
  { key: "next", label: "Next lesson" },
  { key: "toDo", label: "To complete" },
  { key: "needsRevision", label: "Needs revision" },
];

export default function SwahiliCourseOverview({ basePath, preview, uid }) {
  const [progress, setProgress] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const submitDialog = useRef(null);

  useEffect(() => {
    if (preview || !uid || !db) return undefined;
    let active = true;
    Promise.all(LESSONS.map(async ({ day }) => {
      const [submission, review] = await Promise.allSettled([
        getDoc(doc(db, "users", uid, "swahiliLessons", `day-${day}`)),
        getDoc(doc(db, "swahiliTeacherReviews", day === 1 ? uid : `${uid}_day-${day}`)),
      ]);
      const work = submission.status === "fulfilled" && submission.value.exists() ? submission.value.data() : null;
      const feedback = review.status === "fulfilled" && review.value.exists() ? review.value.data() : null;
      // A fresh resubmission must not inherit an older tutor decision.
      const currentReview = getCurrentSwahiliReview(work, feedback);
      return {
        day,
        submitted: submission.status === "fulfilled" ? submission.value.exists() : null,
        review: currentReview?.status || null,
        feedback: currentReview?.feedback || "",
      };
    })).then((records) => {
      if (active) setProgress({ uid, records });
    });
    return () => { active = false; };
  }, [preview, uid]);

  const personal = Boolean(!preview && uid && db);
  const records = personal && progress?.uid === uid ? progress.records : null;
  const submissionKnown = records?.every(({ submitted }) => submitted !== null);
  const completed = records?.filter(({ submitted }) => submitted).length ?? 0;
  const percent = submissionKnown ? Math.round(completed / LESSONS.length * 100) : null;
  const reviewed = records?.filter(({ submitted, review }) => submitted && review === "reviewed").length ?? 0;
  const needsRevision = (lesson) => records?.find((record) => record.day === lesson.day)?.review === "needs_revision";
  const next = LESSONS.find(needsRevision) ??
    LESSONS.find(({ day }) => records?.find((entry) => entry.day === day)?.submitted !== true) ??
    LESSONS[0];
  const nextLabel = submissionKnown && completed === LESSONS.length && !records.some(({ review }) => review === "needs_revision")
    ? "Review lessons" : "Continue learning";
  const lessonPath = ({ day }) => `${basePath}/day-${day}`;
  const submitPath = (lesson) => `${lessonPath(lesson)}?view=submit`;
  const showSubmit = () => submitDialog.current?.showModal?.();
  const query = search.trim().toLowerCase();
  const visible = LESSONS.filter((lesson) => {
    const record = records?.find((entry) => entry.day === lesson.day);
    const matchesFilter = filter === "all" ||
      (filter === "next" && lesson === next) ||
      (filter === "toDo" && (record?.submitted !== true || record.review === "needs_revision")) ||
      (filter === "needsRevision" && record?.review === "needs_revision");
    return matchesFilter &&
      [`Day ${lesson.day}`, `Somo la ${lesson.day}`, lesson.title, lesson.objective, lesson.chapter]
        .some((value) => String(value).toLowerCase().includes(query));
  });
  const metrics = [
    ["Completed", submissionKnown ? `${completed}/${LESSONS.length}` : `—/${LESSONS.length}`],
    ["Next lesson", nextLabel === "Review lessons" ? "Published work submitted" : `Somo la ${next.day}`],
    ["Tutor review", submissionKnown ? `${reviewed} reviewed` : "—"],
  ];

  return (
    <div className={`course-book a2-b1-course-book swahili-course-overview${preview ? " swahili-course-overview--preview" : ""}`}
      data-swahili-course-book="true">
      <section className="course-book-hero course-book-hero--compact" style={book.hero}>
        <div data-a1-coursebook-hero-header="true" style={book.heroHeader}>
          <div className="course-book-hero-copy">
            <p style={book.heroEyebrow}>Kiswahili A1 · Tutor guided</p>
            <h2 style={book.heroTitle}>Kitabu cha Kozi ya Kiswahili</h2>
            <p style={book.heroText}>{nextLabel === "Review lessons" ? "All published workbooks submitted." : <>Next: <strong>Somo la {next.day} · {next.title}</strong></>}</p>
          </div>
          <div data-a1-coursebook-hero-actions="true" className="course-book-hero-actions" style={book.heroActions}>
            {!preview && <Link style={{ ...styles.secondaryButton, ...styles.primaryButtonLink, minHeight: 44 }} to="/">← Back to Campus</Link>}
            <Link className="course-book-continue-button" style={primaryLink} to={lessonPath(next)}>{nextLabel}</Link>
            <button className="course-book-submit-secondary" type="button" style={{ ...styles.secondaryButton, minHeight: 44 }} aria-haspopup="dialog" onClick={showSubmit}>Submit work</button>
          </div>
        </div>
        <div className="course-book-quick-stats" style={book.statGrid}>
          {metrics.map(([label, value]) => (
            <div key={label} style={book.statCard}>
              <p style={book.statLabel}>{label}</p>
              <p style={book.statValue}>{value}</p>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {percent !== null && (
            <div role="progressbar" aria-label="Kiswahili course progress" aria-valuenow={percent} style={book.progressShell}>
              <div style={{ ...book.progressFill, width: `${percent}%` }} />
            </div>
          )}
          <p style={{ ...book.heroText, fontSize: 13 }} role="status">
            {!personal ? "Personal progress is available in Campus." : !records ? "Syncing progress…" :
              !submissionKnown ? "Some submissions could not be loaded." :
              `${completed} of ${LESSONS.length} required assignments submitted · ${percent}% complete`}
          </p>
        </div>
      </section>

      <section className="course-book-toolbar" style={book.toolbar}>
        <div style={book.toolbarTop}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18 }}>Lessons</h3>
            <p style={{ ...styles.helperText, margin: "4px 0 0" }}>{visible.length} shown from {LESSONS.length}</p>
          </div>
          <div className="course-book-filter-row" role="group" aria-label="Course Book lesson filters" style={book.filterRow}>
            {FILTERS.map(({ key, label }) => (
              <button key={key} type="button" aria-pressed={filter === key} onClick={() => setFilter(key)}
                style={filter === key ? book.filterButtonActive : book.filterButton}>{label}</button>
            ))}
          </div>
        </div>
        <input aria-label="Search lessons" placeholder="Search by day, topic or chapter…" value={search}
          onChange={(event) => setSearch(event.target.value)} style={book.searchInput} />
      </section>

      {visible.length === 0 && <p style={book.emptyState}>{filter === "needsRevision" ? "No lessons currently need revision." : "No lessons match your search or filter."}</p>}
      {visible.map((lesson) => {
        const record = records?.find(({ day }) => day === lesson.day);
        const badge = record?.submitted ? {
          reviewed: "Reviewed",
          needs_revision: "Needs revision",
        }[record.review] || "Submitted" : record?.submitted === false ? "Not started" : "Available";
        return (
          <article key={lesson.day} className="course-book-lesson-card"
            style={{ ...book.lessonCard, ...(lesson === next ? book.lessonCardCurrent : {}) }}>
            <div style={book.lessonTop}>
              <div style={book.lessonMain}>
                <span style={book.dayBubble}>Somo la {lesson.day}</span>
                <div>
                  <h3 style={book.lessonTitle}>{lesson.title}</h3>
                  <p style={{ ...styles.helperText, margin: "4px 0 0" }}>{lesson.objective}</p>
                  <div style={book.lessonMeta}>
                    <span style={book.chip}>Tutor-marked</span>
                    <span style={book.chip}>{badge}</span>
                  </div>
                  <div className="course-book-included" style={book.includedRow}>
                    {["Music", "Grammar", "Teil 1", "Teil 2", "Teil 3", "Teil 4", "Submit"].map((label) =>
                      <span key={label} style={book.includedChip}>{label}</span>)}
                  </div>
                  {record?.review === "needs_revision" && (
                    <div className="swahili-course-feedback" role="status">
                      <strong>Tutor requested revisions</strong>
                      {record.feedback && <p>{record.feedback}</p>}
                      <Link to={submitPath(lesson)}>View feedback and resubmit</Link>
                    </div>
                  )}
                  {record?.review === "reviewed" && (
                    <div className="swahili-course-feedback swahili-course-feedback--reviewed">
                      <strong>Reviewed by your tutor</strong>
                      {record.feedback && <p>{record.feedback}</p>}
                      <Link to={submitPath(lesson)}>View tutor feedback</Link>
                    </div>
                  )}
                </div>
              </div>
              <div className="course-book-lesson-actions" style={book.lessonActions}>
                <Link to={lessonPath(lesson)} style={primaryLink}>Fungua Somo la {lesson.day}</Link>
              </div>
            </div>
          </article>
        );
      })}

      <nav className="course-book-mobile-actions swahili-course-actions" aria-label="Course Book actions">
        <Link to={lessonPath(next)}>Continue</Link>
        <button type="button" aria-haspopup="dialog" onClick={showSubmit}>Submit</button>
      </nav>
      <dialog className="swahili-submit-dialog" ref={submitDialog} aria-labelledby="swahili-submit-title">
        <div style={book.submitPanelHeader}>
          <h3 id="swahili-submit-title">Submit your workbook answers</h3>
          <button type="button" style={styles.secondaryButton} onClick={() => submitDialog.current.close()}>Close</button>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {LESSONS.map((lesson) => (
            <Link key={lesson.day} to={submitPath(lesson)} style={{ ...styles.secondaryButton, ...styles.primaryButtonLink, minHeight: 44 }}>
              Somo la {lesson.day} · {lesson.title}
            </Link>
          ))}
        </div>
      </dialog>
    </div>
  );
}
