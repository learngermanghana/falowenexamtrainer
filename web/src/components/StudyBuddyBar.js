import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const getQuickReply = (question, context, t) => {
  const normalized = question.toLowerCase();

  if (normalized.includes("attendance")) {
    return context.isAttendanceSynced
      ? t("studyBuddy.quickReply.attendance.synced", {
          attendance: context.attendanceLabel,
        })
      : t("studyBuddy.quickReply.attendance.notSynced");
  }

  if (normalized.includes("result") || normalized.includes("score")) {
    return context.hasResults
      ? t("studyBuddy.quickReply.results.synced", { results: context.resultsLabel })
      : t("studyBuddy.quickReply.results.noResults");
  }

  if (normalized.includes("assignment")) {
    return context.hasAssignment
      ? t("studyBuddy.quickReply.assignment.recommended", {
          assignment: context.assignmentLabel,
        })
      : t("studyBuddy.quickReply.assignment.awaiting");
  }

  if (normalized.includes("grammar")) {
    return t("studyBuddy.quickReply.grammar");
  }

  if (normalized.includes("vocab") || normalized.includes("vocabulary")) {
    return t("studyBuddy.quickReply.vocab");
  }

  if (normalized.includes("exam") || normalized.includes("test")) {
    return t("studyBuddy.quickReply.examTips");
  }

  return t("studyBuddy.quickReply.default");
};

const StudyBuddyBar = ({ studentProfile }) => {
  const { i18n, t } = useTranslation();
  const [question, setQuestion] = useState("");
  const [lastAnswer, setLastAnswer] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const contentId = "study-buddy-content";

  const numberFormatter = useMemo(() => new Intl.NumberFormat(i18n.language), [i18n.language]);
  const latestScore = useMemo(
    () =>
      toNumber(
        studentProfile?.latestScore ??
          studentProfile?.latestResultScore ??
          studentProfile?.score ??
          studentProfile?.lastScore
      ),
    [studentProfile]
  );
  const attendanceRate = useMemo(
    () =>
      toNumber(
        studentProfile?.attendanceRate ??
          studentProfile?.attendancePercent ??
          studentProfile?.attendancePercentage
      ),
    [studentProfile]
  );
  const attendanceSessions = studentProfile?.attendanceSessions ?? studentProfile?.attendance?.sessions ?? null;
  const assignmentLabel =
    studentProfile?.nextAssignment ||
    studentProfile?.assignmentRecommendation ||
    studentProfile?.assignmentTitle ||
    t("studyBuddy.metrics.awaitingAssignment");

  const resultsLabel =
    latestScore !== null
      ? t("studyBuddy.metrics.scoreValue", {
          score: numberFormatter.format(latestScore),
        })
      : t("studyBuddy.metrics.noResults");
  const attendanceLabel =
    attendanceRate !== null
      ? t("studyBuddy.metrics.attendancePercent", {
          percent: numberFormatter.format(Math.round(attendanceRate)),
        })
      : attendanceSessions
      ? t("studyBuddy.metrics.attendanceSessions", {
          count: numberFormatter.format(attendanceSessions),
        })
      : t("studyBuddy.metrics.notSynced");
  const hasAssignment = assignmentLabel !== t("studyBuddy.metrics.awaitingAssignment");
  const hasResults = latestScore !== null;

  const suggestions = useMemo(() => {
    const tips = [];

    if (latestScore !== null && latestScore < 60) {
      tips.push(t("studyBuddy.suggestions.lowScore"));
    }

    if (attendanceRate !== null && attendanceRate < 80) {
      tips.push(t("studyBuddy.suggestions.lowAttendance"));
    }

    if (assignmentLabel && hasAssignment) {
      tips.push(
        t("studyBuddy.suggestions.assignmentPlan", {
          assignment: assignmentLabel,
        })
      );
    }

    if (!tips.length) {
      tips.push(t("studyBuddy.suggestions.default"));
    }

    return tips;
  }, [attendanceRate, assignmentLabel, hasAssignment, latestScore, t]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;
    const context = {
      resultsLabel,
      attendanceLabel,
      assignmentLabel,
      hasAssignment,
      hasResults,
      isAttendanceSynced: attendanceRate !== null || attendanceSessions !== null,
    };
    setLastAnswer(getQuickReply(trimmed, context, t));
    setQuestion("");
  };

  return (
    <section
      className={`study-buddy-bar${isCollapsed ? " is-collapsed" : ""}`}
      aria-label={t("studyBuddy.ariaLabel")}
    >
      <div className="study-buddy-inner">
        <div className="study-buddy-header">
          <div>
            <div className="study-buddy-title">{t("studyBuddy.title")}</div>
            <div className="study-buddy-subtitle">{t("studyBuddy.subtitle")}</div>
          </div>
          <div className="study-buddy-actions">
            <div className="study-buddy-tags">
              <span className="study-buddy-tag">{t("studyBuddy.tags.results")}</span>
              <span className="study-buddy-tag">{t("studyBuddy.tags.attendance")}</span>
              <span className="study-buddy-tag">{t("studyBuddy.tags.assignments")}</span>
              <span className="study-buddy-tag">{t("studyBuddy.tags.quickQa")}</span>
            </div>
            <button
              className="study-buddy-toggle"
              type="button"
              onClick={() => setIsCollapsed((prev) => !prev)}
              aria-expanded={!isCollapsed}
              aria-controls={contentId}
            >
              {isCollapsed ? t("studyBuddy.actions.expand") : t("studyBuddy.actions.collapse")}
            </button>
          </div>
        </div>

        <div id={contentId} hidden={isCollapsed}>
          <div className="study-buddy-grid">
          <div className="study-buddy-card">
            <h3 className="study-buddy-label">{t("studyBuddy.metrics.latestResult")}</h3>
            <div className="study-buddy-value">{resultsLabel}</div>
            <div className="study-buddy-helper">{t("studyBuddy.metrics.latestHelper")}</div>
          </div>
          <div className="study-buddy-card">
            <h3 className="study-buddy-label">{t("studyBuddy.metrics.attendance")}</h3>
            <div className="study-buddy-value">{attendanceLabel}</div>
            <div className="study-buddy-helper">{t("studyBuddy.metrics.attendanceHelper")}</div>
          </div>
          <div className="study-buddy-card">
            <h3 className="study-buddy-label">{t("studyBuddy.metrics.nextAssignment")}</h3>
            <div className="study-buddy-value">{assignmentLabel}</div>
            <div className="study-buddy-helper">{t("studyBuddy.metrics.assignmentHelper")}</div>
          </div>
          </div>

          <div className="study-buddy-lower">
            <div className="study-buddy-suggestions">
              <h3 className="study-buddy-label">{t("studyBuddy.suggestions.title")}</h3>
              <ul>
                {suggestions.map((tip, index) => (
                  <li key={`tip-${index}`}>{tip}</li>
                ))}
              </ul>
            </div>
            <form className="study-buddy-qa" onSubmit={handleSubmit}>
              <label className="study-buddy-label" htmlFor="study-buddy-question">
                {t("studyBuddy.qa.title")}
              </label>
              <div className="study-buddy-input-row">
                <input
                  id="study-buddy-question"
                  type="text"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder={t("studyBuddy.qa.placeholder")}
                />
                <button type="submit">{t("studyBuddy.qa.send")}</button>
              </div>
              {lastAnswer ? (
                <div className="study-buddy-answer" aria-live="polite">
                  {lastAnswer}
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudyBuddyBar;
