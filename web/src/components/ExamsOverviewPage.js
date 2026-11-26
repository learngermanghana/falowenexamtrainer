import ExamStudyPartner from "./ExamStudyPartner";
import { getExamRevisionFocus, safeExamPart } from "../utils/examStudyPartner";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExam } from "../context/ExamContext";
import { useAuth } from "../context/AuthContext";
import { EXAM_SKILLS, buildExamRoomCoach, examNextActivity } from "../lib/examRoomCoach";
import { getMockExamsForLevel } from "../data/mockExamCatalog";
import { announceExamSuccess } from "../services/interactionFeedback";
import { getReadingPracticeHistory, getReadingPracticeStudentKey } from "../services/readingPracticeHistory";
import { loadExamRoomResults } from "../services/examRoomDashboardService";
import PersonalExamCountdown from "./PersonalExamCountdown";
import "./ExamsOverviewPage.css";

import { useAccessLock, examLockInfo } from "./AccessLockDialog";
import { TrialExam } from "../context/TrialCatalogContext";

const sectionIcons = { lesen: "📖", hoeren: "🎧", schreiben: "✍️", sprechen: "🎤" };
export default function ExamsOverviewPage({ dateInLevelPicker = false, allowExamStudyPartner = false }) {
  const trialExam = React.useContext(TrialExam);
  const isTrial = Boolean(trialExam);
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
  const [loadIssue, setLoadIssue] = useState(false);
  const localReading = useMemo(() => getReadingPracticeHistory(
    currentLevel, getReadingPracticeStudentKey({ user, studentProfile }),
  ), [currentLevel, user, studentProfile]);
  const coach = useMemo(
    () => buildExamRoomCoach({ level: currentLevel, cloudResults, localReading }),
    [currentLevel, cloudResults, localReading],
  );
  const nextActivity = examNextActivity(coach, trialExam);
  const revisionFocus = !loading && !loadIssue ? getExamRevisionFocus(coach) : null;
  const completedSkills = Object.fromEntries(Object.entries({lesen:"lesen",hoeren:"horen",schreiben:"writing",sprechen:"speaking"}).filter(([key])=>coach.latestBySection[key]).map(([key,section])=>[section,safeExamPart(coach.weakParts[key])]));
  const explainLock = (title, event) => openLock(examLockInfo({ title, trialExam, level: currentLevel, examOnly: studentProfile?.accountType === "exam_only" }), event);
  const hasFullMock = useMemo(
    () => getMockExamsForLevel(currentLevel, { includeCourse: true })
      .some((mock) => mock.mode === "full" && mock.status === "ready"),
    [currentLevel],
  );

  useEffect(() => {
    let cancelled = false;
    setCloudHistory({ key: historyKey, results: [] });
    setLoadIssue(false);
    setLoading(false);
    if (!idToken || !user?.uid || isTrial) return undefined;

    setLoading(true);
    loadExamRoomResults({ idToken, level: currentLevel })
      .then(({ results }) => {
        if (cancelled) return;
        setCloudHistory({ key: historyKey, results });
      })
      .catch(() => {
        if (!cancelled) setLoadIssue(true);
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [currentLevel, idToken, user?.uid, historyKey, isTrial]);

  return (
    <main className="exam-room-overview">
      {lockDialog}
      <header className="exam-room-heading">
        <h2>Your {currentLevel} exam room</h2>
        {user?.uid && !dateInLevelPicker && <PersonalExamCountdown key={historyKey} uid={user.uid} level={currentLevel} compact />}
      </header>
      {allowExamStudyPartner && !isTrial && <ExamStudyPartner key={historyKey} level={currentLevel} section="overview" revisionFocus={revisionFocus} completedSkills={completedSkills} />}

      <button
        type="button"
        className="exam-room-mock-entry"
        aria-label={hasFullMock && !trialExam ? "Start or resume a full mock exam" : "Browse available exam practice"}
        onClick={() => openPractice("/exams/mocks", "Mock Exams opened successfully.")}
      >
        <span className="exam-room-mock-icon" aria-hidden="true">📝</span>
        <span className="exam-room-mock-copy">
          <strong>{hasFullMock || (trialExam?.id && !trialExam.locked) ? "Start Mock Test" : "Mock Exams"}</strong>
          <span>{trialExam ? "Choose an available mock exam." : hasFullMock ? "All four skills in one exam." : "A complete " + currentLevel + " mock is not yet published."}</span>
          <span className="exam-room-mock-action">{hasFullMock || (trialExam?.id && !trialExam.locked) ? "Choose a mock" : "View available exams"} <span aria-hidden="true">→</span></span>
        </span>
      </button>

      <section aria-labelledby="exam-room-skills-heading">
        <div className="exam-room-skills-heading">
          <h3 id="exam-room-skills-heading">Practise individual exam sections</h3>
          <p>Choose a skill to start.</p>
        </div>
        <div className="exam-room-skills-grid">
          {EXAM_SKILLS.map((skill) => {
            const last = coach.latestBySection[skill.key];
            const suggested = !trialExam && coach.attempts.length > 0 && coach.focus.key === skill.key;
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
                  {!trialExam && last && <span>Latest: {last.percent}%</span>}
                  <span className="exam-room-skill-action">{trialExam ? "Locked" : "Practise " + skill.title} <span aria-hidden="true">→</span></span>
                </span>
              </button>
            );
          })}
        </div>
        {trialExam && <div className="exam-room-suggestion exam-room-next-activity">
          <button type="button" className="exam-room-text-action"
            onClick={() => openPractice(nextActivity.route, "Recommended practice opened.")}>
            {trialExam?.locked || !trialExam.id || !trialExam.route ? "Browse exams" : "Open trial practice"} →
          </button>
        </div>}
      </section>

      {!trialExam && !loading && !loadIssue && <section className="exam-room-summary" aria-label="Exam room progress">
        <h3 className="exam-room-progress-title">Your progress</h3>
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
      </section>}

      <div className="exam-room-file-link">
        <button type="button" className="exam-room-text-action" onClick={event => trialExam ? explainLock("Exam File", event) : openPractice("/exams/file", "My Exam File opened successfully.")}>
          {trialExam ? "🔒 Exam File" : "Exam File →"}
        </button>
      </div>
    </main>
  );
}
