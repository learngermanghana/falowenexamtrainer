import React, { useState } from "react";
import { useSwahiliProgress } from "../hooks/useSwahiliProgress";
import { Link } from "react-router-dom";
import { SWAHILI_LEVELS, summarizeSwahiliLevel } from "../data/swahili/curriculumRegistry";
import { getAccessibleLevels, normalizeCourseLevel } from "../utils/levelAccess";
import CourseBookLevelSelector from "./CourseBookLevelSelector";
import { styles } from "../styles";
import { courseBookStyles as book } from "./courseBookStyles";
import "./CourseTabResponsive.css";

const primaryLink = { ...styles.primaryButton, ...styles.primaryButtonLink, minHeight: 44 };

const FILTERS = [
  { key: "all", label: "All lessons" },
  { key: "available", label: "Available" },
  { key: "next", label: "Next lesson" },
  { key: "toDo", label: "To complete" },
  { key: "needsRevision", label: "Needs revision" },
];

export default function SwahiliCourseOverview({ basePath, preview, uid, assignedLevel }) {
  const levels = getAccessibleLevels(preview ? "A1" : assignedLevel, SWAHILI_LEVELS);
  const enrollment = normalizeCourseLevel(assignedLevel) || "A1";
  const defaultLevel = levels.at(-1);
  const [levelChoice, setLevelChoice] = useState(null);
  const level = levelChoice?.uid === uid && levelChoice?.enrollment === enrollment && levels.includes(levelChoice?.level)
    ? levelChoice.level : defaultLevel;
  const personal = Boolean(!preview && uid);
  const { records: allRecords, failed } = useSwahiliProgress(uid, personal);
  const records = allRecords?.filter(row => row.level === level) ?? null;
  const { lessons: LESSONS, published: PUBLISHED, required: ASSIGNMENTS, completed, reviewed, known: submissionKnown, next, percent, allSubmitted } = summarizeSwahiliLevel(level, records);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  function selectLevel(nextLevel) {
    setLevelChoice({ uid, enrollment, level: nextLevel });
    setSearch("");
    setFilter("all");
  }

  const levelSelector = <CourseBookLevelSelector levels={levels} value={level} onChange={selectLevel} />;

  const nextLabel = allSubmitted ? "Review lessons" : "Continue learning";
  const lessonPath = lesson => basePath + lesson.route;
  const submitPath = lesson => lessonPath(lesson) + "?view=submit";
  const query = search.trim().toLowerCase();
  const visible = LESSONS.filter((lesson) => {
    const record = records?.find((entry) => entry.day === lesson.day);
    const published = lesson.published;
    const matchesFilter = filter === "all" || (filter === "available" && published) ||
      (filter === "next" && lesson === next) ||
      (filter === "toDo" && published && !lesson.practiceOnly && (record?.submitted !== true || record.review?.status === "needs_revision")) ||
      (filter === "needsRevision" && published && record?.review?.status === "needs_revision");
    return matchesFilter &&
      [`Day ${lesson.day}`, `Somo la ${lesson.day}`, lesson.title, lesson.objective, lesson.chapter, lesson.grammar]
        .some((value) => String(value).toLowerCase().includes(query));
  });
  const metrics = [
    ["Completed", submissionKnown ? `${completed}/${ASSIGNMENTS.length}` : `—/${ASSIGNMENTS.length}`],
    ["Next lesson", nextLabel === "Review lessons" ? "Published work submitted" : next ? `Somo la ${next.day}` : "Not published"],
    ["Tutor review", submissionKnown ? `${reviewed} reviewed` : "—"],
  ];

  return (
    <div className={`course-book a2-b1-course-book swahili-course-overview${preview ? " swahili-course-overview--preview" : ""}`}
      data-swahili-course-book="true">
      <section className="course-book-hero course-book-hero--compact" style={book.hero}>
        <div data-a1-coursebook-hero-header="true" style={book.heroHeader}>
          <div className="course-book-hero-copy">
            <p style={book.heroEyebrow}>Kiswahili {level} · Tutor guided</p>
            <h2 style={book.heroTitle}>Kitabu cha Kozi ya Kiswahili</h2>
            <p style={book.heroText}>{allSubmitted ? "All published tutor assignments submitted." : next ? <>Next: <strong>Somo la {next.day} · {next.title}</strong></> : "Workbooks for this level are in preparation."}</p>
          </div>
          <div data-a1-coursebook-hero-actions="true" className="course-book-hero-actions" style={book.heroActions}>
            {levelSelector}
            {!preview && <Link style={{ ...styles.secondaryButton, ...styles.primaryButtonLink, minHeight: 44 }} to="/">← Falowen Home</Link>}
            {next && <Link className="course-book-continue-button" style={primaryLink} to={lessonPath(next)}>{nextLabel}</Link>}
            {next?.required && <Link className="course-book-submit-secondary" style={{ ...styles.secondaryButton, ...styles.primaryButtonLink, minHeight: 44 }} to={submitPath(next)}>Receive &amp; Submit</Link>}
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
            {!personal ? "Personal progress is available in Campus." : failed ? "Progress could not be loaded. Reopen this page to retry." : !records ? "Syncing progress…" :
              !submissionKnown ? "Some submissions could not be loaded." :
              ASSIGNMENTS.length ? `${completed} of ${ASSIGNMENTS.length} required assignments submitted · ${percent}% complete` : "No tutor assignments published for this level yet."}
          </p>
        </div>
      </section>

      <section className="course-book-toolbar" style={book.toolbar}>
        <p style={{ ...styles.helperText, margin: 0 }}>{ASSIGNMENTS.length} published tutor-marked workbooks. Unpublished lessons are curriculum previews.</p>
        <div style={book.toolbarTop}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18 }}>Lessons</h3>
            <p style={{ ...styles.helperText, margin: "4px 0 0" }}>{visible.length} shown from {LESSONS.filter(lesson => lesson.day > 0).length} {level} units · {PUBLISHED.length} available</p>
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
        const published = lesson.status !== "coming-soon";
        const record = published ? records?.find(({ day }) => day === lesson.day) : null;
        const badge = !published ? "Coming soon" : record?.submitted ? {
          reviewed: "Reviewed",
          needs_revision: "Needs revision",
        }[record.review?.status] || "Submitted" : record?.submitted === false ? "Not started" : "Available";
        return (
          <article key={lesson.day} className="course-book-lesson-card"
            style={{ ...book.lessonCard, ...(lesson === next ? book.lessonCardCurrent : {}) }}>
            <div style={book.lessonTop}>
              <div style={book.lessonMain}>
                <span style={book.dayBubble}>{lesson.day === 0 ? "Mwongozo" : `Somo la ${lesson.day}`}</span>
                <div>
                  <h3 style={book.lessonTitle}>{lesson.title}</h3>
                  {lesson.objective && <p style={{ ...styles.helperText, margin: "4px 0 0" }}>{lesson.objective}</p>}
                  {lesson.chapter && <p style={styles.helperText}>Chapter {lesson.chapter}</p>}
                  {lesson.grammar && <p style={{ ...styles.helperText, margin: "6px 0 0" }}><strong>Sarufi · Grammar:</strong> {lesson.grammar}</p>}
                  <div style={book.lessonMeta}>
                    <span style={book.chip}>{!published ? "Curriculum preview" : lesson.practiceOnly ? "Practice" : "Tutor-marked"}</span>
                    <span style={book.chip}>{badge}</span>
                  </div>
                  {published && level === "A1" && <div className="course-book-included" style={book.includedRow}>
                    {["Music", "Grammar", "Teil 1", "Teil 2", "Teil 3", "Teil 4", "Review & Submit"].map((label) =>
                      <span key={label} style={book.includedChip}>{label}</span>)}
                  </div>}
                  {record?.review?.status === "needs_revision" && (
                    <div className="swahili-course-feedback" role="status">
                      <strong>Tutor requested revisions</strong>
                      {record.review.feedback && <p>{record.review.feedback}</p>}
                      <Link to={submitPath(lesson)}>View feedback and resubmit</Link>
                    </div>
                  )}
                  {record?.review?.status === "reviewed" && (
                    <div className="swahili-course-feedback swahili-course-feedback--reviewed">
                      <strong>Reviewed by your tutor</strong>
                      {record.review.feedback && <p>{record.review.feedback}</p>}
                      <Link to={submitPath(lesson)}>View tutor feedback</Link>
                    </div>
                  )}
                </div>
              </div>
              <div className="course-book-lesson-actions" style={book.lessonActions}>
                {published ? <Link to={lessonPath(lesson)} style={primaryLink}>{level === "A1" ? `Fungua Somo la ${lesson.day}` : "Open workbook"}</Link> :
                  <span style={{ ...book.chip, padding: "10px 14px" }} aria-label={`Somo la ${lesson.day} coming soon`}>Coming soon · In preparation</span>}
              </div>
            </div>
          </article>
        );
      })}


    </div>
  );
}
