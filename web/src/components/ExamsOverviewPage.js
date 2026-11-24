import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExam } from "../context/ExamContext";
import { useAuth } from "../context/AuthContext";
import { EXAM_SKILLS, buildExamRoomCoach, examNextActivity } from "../lib/examRoomCoach";
import { getMockExamsForLevel } from "../data/mockExamCatalog";
import { announceExamSuccess } from "../services/interactionFeedback";
import { getReadingPracticeHistory, getReadingPracticeStudentKey } from "../services/readingPracticeHistory";
import {
  getLocalDailyWarmup,
  loadDailyWarmupProgress,
  loadExamRoomResults,
} from "../services/examRoomDashboardService";
import PersonalExamCountdown from "./PersonalExamCountdown";
import "./ExamsOverviewPage.css";

import { useAccessLock, examLockInfo } from "./AccessLockDialog";
import { TrialExam } from "../context/TrialCatalogContext";

const sectionIcons = { lesen: "📖", hoeren: "🎧", schreiben: "✍️", sprechen: "🎤" };
const readableDate = (value) => {
  const date = new Date(value || "");
  return Number.isFinite(date.getTime())
    ? date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : "";
};

export default function ExamsOverviewPage() {
  const trialExam = React.useContext(TrialExam);
  const { openLock, lockDialog } = useAccessLock();
  const navigate = useNavigate();
  const openPractice = (path, message) => {
    announceExamSuccess(message);
    navigate(path);
  };
  const { level } = useExam();
  const { user, idToken, studentProfile } = useAuth();
  const currentLevel = String(level || "A1").toUpperCase();
  const historyKey = (user?.uid || "") + ":" + currentLevel;
  const [cloudHistory, setCloudHistory] = useState({ key: "", results: [] });
  const cloudResults = cloudHistory.key === historyKey ? cloudHistory.results : [];
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
  const nextActivity = examNextActivity(coach, trialExam);
  const explainLock = (title, event) => openLock(examLockInfo({ title, trialExam, level: currentLevel, examOnly: studentProfile?.accountType === "exam_only" }), event);
  const hasFullMock = useMemo(
    () => getMockExamsForLevel(currentLevel, { includeCourse: true })
      .some((mock) => mock.mode === "full" && mock.status === "ready"),
    [currentLevel],
  );

  useEffect(() => {
    let cancelled = false;
    setCloudHistory({ key: historyKey, results: [] });
    setDailyCloudStatus(null);
    setLimited(false);
    setLoadIssue("");
    if (!idToken || !user?.uid) return undefined;

    setLoading(true);
    loadExamRoomResults({ idToken, level: currentLevel })
      .then(({ results, limited: wasLimited }) => {
        if (cancelled) return;
        setCloudHistory({ key: historyKey, results });
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
  }, [currentLevel, idToken, user?.uid, historyKey]);

  return (
    <main className="exam-room-overview">
      {lockDialog}
      <section className="exam-room-summary" aria-label="Exam room progress">
        <div className="exam-room-summary-heading">
          <div>
            <p className="exam-room-eyebrow">Falowen · Exam Room</p>
            <h2>Your {currentLevel} exam room</h2>
            <p className="exam-room-summary-intro">{hasFullMock ? "Choose an available full mock or focus on one skill below. Your progress and latest results appear here." : "A complete mock is not yet available at this level. Practise the available skills below and review your progress here."}</p>
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
        <div className="exam-room-performance">
          <div>
            <h3>Exam performance</h3>
            <strong className="exam-room-overall-score">{coach.overallPercent === null ? "—" : coach.overallPercent + "%"}</strong>
            <p>{coach.overallPercent === null
              ? "Record all four skills to see your overall practice score."
              : "Equal-weight average of your latest four skill scores."}</p>
            {coach.missingSkills.length > 0 && <p>Still to assess: {coach.missingSkills.map(skill => skill.title).join(", ")}</p>}
            <small>Practice indicator only — not an official Goethe score or a pass prediction.</small>
          </div>
          <div className="exam-room-performance-skills">
            {EXAM_SKILLS.map(skill => {
              const result = coach.latestBySection[skill.key];
              return <div key={skill.key} className="exam-room-performance-skill">
                <span>{skill.title}</span><strong>{result ? result.percent + "%" : "Not assessed"}</strong>
                <div className="exam-room-performance-track" aria-hidden="true">
                  <div style={{width: (result?.percent || 0) + "%"}} />
                </div>
              </div>;
            })}
          </div>
        </div>
        {user?.uid && <PersonalExamCountdown key={historyKey} uid={user.uid} level={currentLevel} />}
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
        aria-label={hasFullMock && !trialExam ? "Start or resume a full mock exam" : "Browse available exam practice"}
        onClick={() => openPractice("/exams/mocks", "Mock Exams opened successfully.")}
      >
        <span className="exam-room-mock-icon" aria-hidden="true">📝</span>
        <span className="exam-room-mock-copy">
          <span className="exam-room-mock-eyebrow">{hasFullMock && !trialExam ? "Option 1 · Complete exam" : "Available exam practice"}</span>
          <strong>{hasFullMock && !trialExam ? "Start Full Mock" : "Explore Mock Practice"}</strong>
          <span>{trialExam ? "Browse the full catalogue and see which activities your current access includes." : hasFullMock
            ? "Take Lesen, Hören, Schreiben and Sprechen together. Start a new mock or resume one already in progress."
            : "A complete " + currentLevel + " mock is not yet published. Explore the available practice."}</span>
          <span className="exam-room-mock-action">{hasFullMock && !trialExam ? "Choose or resume a full mock" : "See available practice"} <span aria-hidden="true">→</span></span>
        </span>
        </button>

      <section aria-labelledby="exam-room-skills-heading">
        <div className="exam-room-skills-heading">
          <span className="exam-room-skills-eyebrow">Option 2 · Practice in parts</span>
          <h3 id="exam-room-skills-heading">Practise individual exam sections</h3>
          <p>Not ready for a complete mock? Choose Lesen, Hören, Schreiben or Sprechen below and practise one section at a time.</p>
        </div>
        <div className="exam-room-skills-grid">
          {EXAM_SKILLS.map((skill) => {
            const last = coach.latestBySection[skill.key];
            const trend = coach.skillTrends[skill.key];
            const suggested = !trialExam && coach.focus.key === skill.key;
            return (
              <button
                key={skill.key}
                type="button"
                aria-label={(trialExam ? "Locked: " : "Practise ") + skill.title}
                className={"exam-room-skill" + (suggested ? " exam-room-skill-recommended" : "")}
                onClick={event => trialExam ? explainLock(skill.title, event) : openPractice(skill.path, `${skill.title} practice opened successfully.`)}
              >
                <span>
                  <span className="exam-room-skill-top">
                    <span className="exam-room-skill-icon" aria-hidden="true">{trialExam ? "🔒" : sectionIcons[skill.key]}</span>
                    {suggested ? <span className="exam-room-skill-suggested">Suggested next</span> : null}
                  </span>
                  <span className="exam-room-skill-title">{skill.title}</span>
                  <span className="exam-room-skill-description">{skill.description}</span>
                </span>
                <span className="exam-room-skill-bottom">
                  <span>{last ? "Latest: " + last.percent + "%" : "Not yet practised"}</span>
                  <span className="exam-room-arrow" aria-hidden="true">→</span>
                {trend.count ? (
                  <span className="exam-room-skill-trend">
                    <span>{trend.count} scored attempt{trend.count === 1 ? "" : "s"} · Average {trend.average}%</span>
                    {coach.weakParts[skill.key] && <span>Lowest-scoring part: {coach.weakParts[skill.key]}</span>}
                    {trend.change !== null ? (
                      <span className="exam-room-skill-change" aria-label={`Change from previous attempt: ${trend.change > 0 ? "up " : trend.change < 0 ? "down " : "unchanged "}${Math.abs(trend.change)} percentage points`}>
                        {trend.change > 0 ? "↑ +" : trend.change < 0 ? "↓ " : "→ "}{trend.change} pp vs previous
                      </span>
                    ) : null}
                  </span>
                ) : null}
                </span>
              </button>
            );
          })}
        </div>
        <div className="exam-room-suggestion exam-room-next-activity">
          <p><strong>Suggested: {nextActivity.title}.</strong> {nextActivity.reason}
            {nextActivity.weakPart ? " Focus on " + nextActivity.weakPart + "." : ""}
          </p>
          <button type="button" className="exam-room-text-action"
            onClick={() => openPractice(nextActivity.route, "Recommended practice opened.")}>
            {trialExam?.locked ? "Browse exams" : trialExam ? "Open trial practice" : "Practise recommended skill"} →
          </button>
        </div>
      </section>

      <section className="exam-room-activity" aria-label="Full mock history">
        <div className="exam-room-recent-heading">
          <div><h3>Full mock history</h3><p>Completed mock results recorded for {currentLevel}.</p></div>
          <button type="button" className="exam-room-text-action" onClick={() => openPractice("/exams/mocks", "Mock Exams opened successfully.")}>Browse mocks →</button>
        </div>
        {coach.mockHistory.length ? <ol className="exam-room-recent-list">
          {coach.mockHistory.slice(0,5).map((attempt,index) => <li className="exam-room-recent-item" key={attempt.id || index}>
            <div><strong>{attempt.title}</strong><p>{readableDate(attempt.completedAt)}</p></div>
            <strong className="exam-room-recent-score">{attempt.percent}%</strong>
          </li>)}
        </ol> : <p className="exam-room-status">{loading ? "Loading mock results…" : loadIssue ? "Mock history temporarily unavailable." : "No recorded full mock results yet."}</p>}
        {coach.mockHistory.length > 5 && <p className="exam-room-status">Showing the latest five recorded mocks.</p>}
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
          <button type="button" className="exam-room-text-action" onClick={event => trialExam ? explainLock("Daily warm-up", event) : openPractice("/exams/question", "Daily exam practice opened successfully.")}>
            {trialExam ? "🔒 Locked" : dailyDone ? "Review →" : localDaily.hasDraft ? "Continue →" : "Start →"}
          </button>
        </div>
        <div className="exam-room-recent-heading">
          <div>
            <h3>Your recent practice</h3>
            <p>Your latest individual practice results.</p>
          </div>
          <button type="button" className="exam-room-text-action" onClick={event => trialExam ? explainLock("Exam File", event) : openPractice("/exams/file", "My Exam File opened successfully.")}>
            {trialExam ? "🔒 Exam File" : "Exam File →"}
          </button>
        </div>
        {loading ? <p className="exam-room-status" role="status">Loading saved practice results…</p> : null}
        {loadIssue ? <p className="exam-room-status" role="status" style={{ color: "#92400e" }}>{loadIssue}</p> : null}
        {limited ? <p className="exam-room-status">Showing results from a limited history window.</p> : null}
        {coach.practiceHistory.length ? (
          <ol className="exam-room-recent-list">
            {coach.practiceHistory.slice(0, 3).map((attempt, index) => (
              <li className="exam-room-recent-item" key={attempt.id || attempt.section + "-" + index}>
                <div>
                  <strong>{attempt.section === "mixed"
                    ? "Full mock exam"
                    : EXAM_SKILLS.find((skill) => skill.key === attempt.section)?.title}</strong>
                  <p>{readableDate(attempt.completedAt)} · {attempt.title}</p>
                </div>
                <strong className="exam-room-recent-score">{attempt.percent}%</strong>
              </li>
            ))}
          </ol>
        ) : (
          <p className="exam-room-status">No individual scored practice yet. Choose an available skill to begin.</p>
        )}
      </section>
    </main>
  );
}
