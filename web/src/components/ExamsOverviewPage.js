import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExam } from "../context/ExamContext";
import { useAuth } from "../context/AuthContext";
import { EXAM_SKILLS, buildExamRoomCoach } from "../lib/examRoomCoach";
import { buildExamRoomInsights, getAttemptBreakdown } from "../lib/examRoomInsights";
import { getMockExamsForLevel } from "../data/mockExamCatalog";
import { getReadingPracticeHistory, getReadingPracticeStudentKey } from "../services/readingPracticeHistory";
import {
  getLocalDailyWarmup,
  loadDailyWarmupProgress,
  loadExamRoomResults,
} from "../services/examRoomDashboardService";
import "./ExamsOverviewPage.css";

const sectionIcons = { lesen: "📖", hoeren: "🎧", schreiben: "✍️", sprechen: "🎤" };
const readableDate = (value) => {
  const date = new Date(value || "");
  return Number.isFinite(date.getTime())
    ? date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : "";
};

export default function ExamsOverviewPage() {
  const navigate = useNavigate();
  const { level } = useExam();
  const { user, idToken, studentProfile } = useAuth();
  const currentLevel = String(level || "A1").toUpperCase();
  const [cloudResults, setCloudResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadIssue, setLoadIssue] = useState("");
  const [limited, setLimited] = useState(false);
  const [dailyCloudStatus, setDailyCloudStatus] = useState(null);
  const localReading = useMemo(() => getReadingPracticeHistory(
    currentLevel, getReadingPracticeStudentKey({ user, studentProfile }),
  ), [currentLevel, user, studentProfile]);
  const localDaily = getLocalDailyWarmup(currentLevel);
  const dailyDone = Boolean(localDaily.practised || dailyCloudStatus?.practised);
  const coach = useMemo(
    () => buildExamRoomCoach({ level: currentLevel, cloudResults, localReading }),
    [currentLevel, cloudResults, localReading],
  );
  const insights = useMemo(() => buildExamRoomInsights(coach, currentLevel), [coach, currentLevel]);
  const hasFullMock = useMemo(
    () => getMockExamsForLevel(currentLevel, { includeCourse: true })
      .some((mock) => mock.mode === "full" && mock.status === "ready"),
    [currentLevel],
  );

  useEffect(() => {
    let cancelled = false;
    setCloudResults([]);
    setDailyCloudStatus(null);
    setLimited(false);
    setLoadIssue("");
    if (!idToken || !user?.uid) return undefined;

    setLoading(true);
    loadExamRoomResults({ idToken, level: currentLevel })
      .then(({ results, limited: wasLimited }) => {
        if (cancelled) return;
        setCloudResults(results);
        setLimited(wasLimited);
      })
      .catch(() => {
        if (!cancelled) setLoadIssue("Cloud results are temporarily unavailable. Lesen history from this device may still appear.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    loadDailyWarmupProgress({ userId: user.uid, level: currentLevel })
      .then((progress) => { if (!cancelled) setDailyCloudStatus(progress); })
      .catch(() => { /* Local warm-up progress remains usable offline. */ });

    return () => { cancelled = true; };
  }, [currentLevel, idToken, user?.uid]);

  return (
    <main className="exam-room-overview">
      <section className="exam-room-summary" aria-label="Exam room progress">
        <div className="exam-room-summary-heading">
          <div>
            <p className="exam-room-eyebrow">Falowen · Exam Room</p>
            <h2>Your {currentLevel} exam room</h2>
            <p className="exam-room-summary-intro">Choose a mock or one skill to practise today.</p>
          </div>
          <span className="exam-room-level">{currentLevel}</span>
        </div>
        <div className="exam-room-metrics">
          <div className="exam-room-metric">
            <strong>{coach.attempts.length}</strong>
            <span>Scored practices</span>
          </div>
          <div className="exam-room-metric">
            <strong>{coach.coveredSkills}/4</strong>
            <span>Skills practised</span>
          </div>
          <div className="exam-room-metric">
            <strong>{coach.latest ? coach.latest.percent + "%" : "—"}</strong>
            <span>Latest score</span>
          </div>
        </div>
        <div className="exam-room-coverage">
          <div className="exam-room-coverage-heading">
            <span>Skill coverage</span>
            <strong>{coach.coveragePercent}%</strong>
          </div>
          <div
            className="exam-room-coverage-track"
            role="progressbar"
            aria-label="Exam skill practice coverage"
            aria-valuenow={coach.coveragePercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="exam-room-coverage-fill" style={{ width: coach.coveragePercent + "%" }} />
          </div>
          <p className="exam-room-coverage-note">Coverage records practice, not an exam pass.</p>
        </div>
      </section>

      <button
        type="button"
        className="exam-room-mock-entry"
        aria-label={hasFullMock ? "Browse full mock exams" : "Browse available exam practice"}
        onClick={() => navigate("/exams/mocks")}
      >
        <span className="exam-room-mock-icon" aria-hidden="true">📝</span>
        <span className="exam-room-mock-copy">
          <strong>{hasFullMock ? "Full Mock Exam" : "Mock Exams & Practice"}</strong>
          <span>{hasFullMock
            ? "Complete Lesen, Hören, Schreiben and Sprechen for a full result. Choose or resume a mock."
            : "A complete " + currentLevel + " mock is not yet published. Explore available section practice."}</span>
        </span>
        <span className="exam-room-arrow" aria-hidden="true">→</span>
      </button>

      <section aria-labelledby="exam-room-skills-heading">
        <div className="exam-room-skills-heading">
          <h3 id="exam-room-skills-heading">Or practise one skill</h3>
          <p>Tap any skill to go straight to its practice area.</p>
        </div>
        <div className="exam-room-skills-grid">
          {EXAM_SKILLS.map((skill) => {
            const last = coach.latestBySection[skill.key];
            const suggested = coach.focus.key === skill.key;
            return (
              <button
                key={skill.key}
                type="button"
                aria-label={"Practise " + skill.title}
                className={"exam-room-skill" + (suggested ? " exam-room-skill-recommended" : "")}
                onClick={() => navigate(skill.path)}
              >
                <span>
                  <span className="exam-room-skill-top">
                    <span className="exam-room-skill-icon" aria-hidden="true">{sectionIcons[skill.key]}</span>
                    {suggested ? <span className="exam-room-skill-suggested">Suggested next</span> : null}
                  </span>
                  <span className="exam-room-skill-title">{skill.title}</span>
                  <span className="exam-room-skill-description">{skill.description}</span>
                </span>
                <span className="exam-room-skill-bottom">
                  <span>{last ? "Latest: " + last.percent + "%" : "Not yet practised"}</span>
                  <span className="exam-room-arrow" aria-hidden="true">→</span>
                </span>
              </button>
            );
          })}
        </div>
        <p className="exam-room-suggestion">
          <strong>Suggested: {coach.focus.title}.</strong> {coach.focus.reason}
          {coach.focus.weakPart ? " Focus on " + coach.focus.weakPart + "." : ""}
        </p>
      </section>

      <section className="exam-room-learning" aria-labelledby="exam-room-learning-heading">
        <div className="exam-room-learning-head">
          <div>
            <h3 id="exam-room-learning-heading">Your exam progress</h3>
            <p>Based on recorded scores at your selected {currentLevel} level.</p>
          </div>
          <span className="exam-room-evidence-label">{insights.evidenceLabel}</span>
        </div>
        <p className="exam-room-evidence-note">{insights.evidenceText}</p>
        <div className="exam-room-scores-by-skill" aria-label="Latest recorded score by skill">
          {insights.skillScores.map((skill) => (
            <div key={skill.key} className="exam-room-score-row">
              <span>{skill.title}</span>
              <div className="exam-room-score-track" aria-hidden="true">
                <span style={{ width: (skill.percent ?? 0) + "%" }} />
              </div>
              <strong>{skill.percent === null ? "—" : skill.percent + "%"}</strong>
            </div>
          ))}
        </div>
        {insights.trend.length ? (
          <div className="exam-room-mock-trend">
            <h4>Server-scored full mock trend</h4>
            <ol>
              {insights.trend.map((point) => (
                <li key={point.id}>
                  <span>{point.label}</span>
                  <div className="exam-room-score-track" aria-hidden="true">
                    <span style={{ width: point.percent + "%" }} />
                  </div>
                  <strong>{point.percent}%</strong>
                </li>
              ))}
            </ol>
            {insights.weakestMockPart ? <p>
              Lowest recorded full-mock section: <strong>{insights.weakestMockPart.label}</strong>
              {" · "}{insights.weakestMockPart.score}/{insights.weakestMockPart.total}.
            </p> : null}
          </div>
        ) : null}
        <details className="exam-room-study-plan">
          <summary>My personalised 7-day practice plan</summary>
          <p>This plan uses your saved practice results. It is study guidance, not an AI-verified exam prediction.</p>
          <ol>
            {insights.weeklyPlan.map((day) => (
              <li key={day.day}>
                <div><strong>Day {day.day} · {day.title}</strong><p>{day.detail}</p><small>{day.status}</small></div>
                <button type="button" className="exam-room-text-action" onClick={() => navigate(day.route)}>
                  Practise →
                </button>
              </li>
            ))}
          </ol>
        </details>
      </section>

      <section className="exam-room-activity" aria-label="Warm-up and recent practice">
        <div className="exam-room-warmup">
          <span className="exam-room-warmup-icon" aria-hidden="true">☀️</span>
          <div className="exam-room-warmup-copy">
            <strong>{dailyDone ? "Warm-up completed" : localDaily.hasDraft ? "Warm-up in progress" : "Daily warm-up"}</strong>
            <p>{dailyDone
              ? "Today's warm-up is recorded."
              : localDaily.hasDraft
                ? "Your saved warm-up is waiting."
                : "A short German task for your level."}</p>
          </div>
          <button type="button" className="exam-room-text-action" onClick={() => navigate("/exams/question")}>
            {dailyDone ? "Review →" : localDaily.hasDraft ? "Continue →" : "Start →"}
          </button>
        </div>
        <div className="exam-room-recent-heading">
          <div>
            <h3>Your recent practice</h3>
            <p>Your latest recorded results.</p>
          </div>
          <button type="button" className="exam-room-text-action" onClick={() => navigate("/exams/file")}>
            Exam File →
          </button>
        </div>
        {loading ? <p className="exam-room-status" role="status">Loading saved practice results…</p> : null}
        {loadIssue ? <p className="exam-room-status" role="status" style={{ color: "#92400e" }}>{loadIssue}</p> : null}
        {limited ? <p className="exam-room-status">Showing results from a limited history window.</p> : null}
        {coach.attempts.length ? (
          <ol className="exam-room-recent-list">
            {coach.attempts.slice(0, 3).map((attempt, index) => (
              <li className="exam-room-recent-item" key={attempt.id || attempt.section + "-" + index}>
                <details className="exam-room-attempt-details">
                  <summary>
                    <span>
                      <strong>{attempt.section === "mixed"
                        ? "Full mock exam"
                        : EXAM_SKILLS.find((skill) => skill.key === attempt.section)?.title}</strong>
                      <span className="exam-room-attempt-subtitle">{readableDate(attempt.completedAt)} · {attempt.title}</span>
                    </span>
                    <strong className="exam-room-recent-score">{attempt.percent}%</strong>
                  </summary>
                  {getAttemptBreakdown(attempt).length ? (
                    <ul className="exam-room-attempt-parts">
                      {getAttemptBreakdown(attempt).map((part) => (
                        <li key={part.label}>
                          <span>{part.label}</span>
                          <strong>{part.score}/{part.total} · {part.percent}%</strong>
                        </li>
                      ))}
                    </ul>
                  ) : <p>Only the overall score is available for this saved attempt. Detailed feedback is not recorded.</p>}
                  <button type="button" className="exam-room-text-action" onClick={() => navigate(attempt.route)}>
                    Open practice →
                  </button>
                </details>
              </li>
            ))}
          </ol>
        ) : (
          <p className="exam-room-status">No scored practice yet. Choose a mock or skill above to begin.</p>
        )}
      </section>
    </main>
  );
}
