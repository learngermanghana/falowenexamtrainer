import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../lib/formatters";
import { toDateMs } from "../lib/dateUtils";
import { useAuth } from "../context/AuthContext";

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizeText = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

const buildKeywordList = (t, key) => {
  const keywords = t(key, { returnObjects: true });
  return Array.isArray(keywords) ? keywords : [];
};

const buildQuickReplyKeywords = (t) => ({
  attendance: buildKeywordList(t, "studyBuddy.quickReply.keywords.attendance"),
  results: buildKeywordList(t, "studyBuddy.quickReply.keywords.results"),
  assignment: buildKeywordList(t, "studyBuddy.quickReply.keywords.assignment"),
  grammar: buildKeywordList(t, "studyBuddy.quickReply.keywords.grammar"),
  vocab: buildKeywordList(t, "studyBuddy.quickReply.keywords.vocab"),
  exam: buildKeywordList(t, "studyBuddy.quickReply.keywords.exam"),
});

const matchesKeyword = (normalized, keywords) =>
  keywords.some((keyword) => normalized.includes(normalizeText(keyword)));

const getQuickReply = (question, context, t, keywordSets) => {
  const normalized = normalizeText(question);

  if (matchesKeyword(normalized, keywordSets.attendance)) {
    return context.isAttendanceSynced
      ? t("studyBuddy.quickReply.attendance.synced", {
          attendance: context.attendanceLabel,
        })
      : t("studyBuddy.quickReply.attendance.notSynced");
  }

  if (matchesKeyword(normalized, keywordSets.results)) {
    return context.hasResults
      ? t("studyBuddy.quickReply.results.synced", { results: context.resultsLabel })
      : t("studyBuddy.quickReply.results.noResults");
  }

  if (matchesKeyword(normalized, keywordSets.assignment)) {
    return context.hasAssignment
      ? t("studyBuddy.quickReply.assignment.recommended", {
          assignment: context.assignmentLabel,
        })
      : t("studyBuddy.quickReply.assignment.awaiting");
  }

  if (matchesKeyword(normalized, keywordSets.grammar)) {
    return t("studyBuddy.quickReply.grammar");
  }

  if (matchesKeyword(normalized, keywordSets.vocab)) {
    return t("studyBuddy.quickReply.vocab");
  }

  if (matchesKeyword(normalized, keywordSets.exam)) {
    return t("studyBuddy.quickReply.examTips");
  }

  return t("studyBuddy.quickReply.default");
};

const StudyBuddyBar = ({ studentProfile }) => {
  const { i18n, t } = useTranslation();
  const { saveStudentProfile, studentProfile: authProfile } = useAuth();
  const locale = i18n.language;
  const preferenceProfile = authProfile || studentProfile;
  const [question, setQuestion] = useState("");
  const [lastAnswer, setLastAnswer] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return localStorage.getItem("studyBuddyDismissed") === "true";
    } catch (error) {
      return false;
    }
  });
  const [isHighContrast, setIsHighContrast] = useState(() => {
    try {
      return localStorage.getItem("studyBuddyHighContrast") === "true";
    } catch (error) {
      return false;
    }
  });
  const lastSavedPreferences = useRef(null);
  const contentId = "study-buddy-content";

  const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const formatTimeUnit = useCallback(
    (unit, count) => t(`common.${unit}`, { count, formattedCount: numberFormatter.format(count) }),
    [numberFormatter, t]
  );
  const formatMoney = useCallback(
    (value) => formatCurrency(value, { locale, maximumFractionDigits: 2 }),
    [locale]
  );
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
  const keywordSets = useMemo(() => buildQuickReplyKeywords(t), [t, locale]);

  const paymentReminder = useMemo(() => {
    const balanceDue = Number(studentProfile?.balanceDue);
    if (!Number.isFinite(balanceDue) || balanceDue <= 0) return null;
    const contractEndMs = toDateMs(studentProfile?.contractEnd);
    if (!Number.isFinite(contractEndMs)) return null;
    const dayMs = 1000 * 60 * 60 * 24;
    const daysLeft = Math.ceil((contractEndMs - Date.now()) / dayMs);
    if (daysLeft < 0 || daysLeft > 15) return null;

    return {
      amount: formatMoney(balanceDue),
      time: formatTimeUnit("day", Math.max(daysLeft, 0)),
    };
  }, [formatMoney, formatTimeUnit, studentProfile?.balanceDue, studentProfile?.contractEnd]);

  const suggestions = useMemo(() => {
    const tips = [];

    if (latestScore !== null && latestScore < 60) {
      tips.push(t("studyBuddy.suggestions.lowScore"));
    }

    if (attendanceRate !== null && attendanceRate < 80) {
      tips.push(t("studyBuddy.suggestions.lowAttendance"));
    }

    if (paymentReminder) {
      tips.push(
        t("studyBuddy.suggestions.paymentReminder", {
          amount: paymentReminder.amount,
          time: paymentReminder.time,
        })
      );
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
  }, [attendanceRate, assignmentLabel, hasAssignment, latestScore, paymentReminder, t]);

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
    setLastAnswer(getQuickReply(trimmed, context, t, keywordSets));
    setQuestion("");
  };

  useEffect(() => {
    try {
      localStorage.setItem("studyBuddyDismissed", String(isDismissed));
    } catch (error) {
      // Ignore storage errors (privacy mode, etc.)
    }
  }, [isDismissed]);

  useEffect(() => {
    try {
      localStorage.setItem("studyBuddyHighContrast", String(isHighContrast));
    } catch (error) {
      // Ignore storage errors (privacy mode, etc.)
    }
  }, [isHighContrast]);

  useEffect(() => {
    const preferences = preferenceProfile?.studyBuddyPreferences;
    if (!preferences) return;
    if (typeof preferences.dismissed === "boolean") {
      setIsDismissed(preferences.dismissed);
    }
    if (typeof preferences.highContrast === "boolean") {
      setIsHighContrast(preferences.highContrast);
    }
  }, [preferenceProfile?.studyBuddyPreferences]);

  useEffect(() => {
    if (!saveStudentProfile || !preferenceProfile?.id) return;
    const existing = preferenceProfile?.studyBuddyPreferences || {};
    const next = {
      dismissed: Boolean(isDismissed),
      highContrast: Boolean(isHighContrast),
    };
    const normalizedExisting = {
      dismissed: Boolean(existing.dismissed),
      highContrast: Boolean(existing.highContrast),
    };
    if (
      normalizedExisting.dismissed === next.dismissed &&
      normalizedExisting.highContrast === next.highContrast
    ) {
      lastSavedPreferences.current = normalizedExisting;
      return;
    }
    if (
      lastSavedPreferences.current &&
      lastSavedPreferences.current.dismissed === next.dismissed &&
      lastSavedPreferences.current.highContrast === next.highContrast
    ) {
      return;
    }
    saveStudentProfile({ studyBuddyPreferences: next }).catch((error) => {
      console.error("Failed to save Study Buddy preferences", error);
    });
    lastSavedPreferences.current = next;
  }, [
    isDismissed,
    isHighContrast,
    saveStudentProfile,
    preferenceProfile?.id,
    preferenceProfile?.studyBuddyPreferences,
  ]);

  if (isDismissed) {
    return (
      <button
        className={`study-buddy-reopen${isHighContrast ? " is-high-contrast" : ""}`}
        type="button"
        onClick={() => setIsDismissed(false)}
        aria-label={t("studyBuddy.actions.reopenAria")}
      >
        {t("studyBuddy.actions.reopen")}
      </button>
    );
  }

  return (
    <section
      className={`study-buddy-bar${isCollapsed ? " is-collapsed" : ""}${
        isHighContrast ? " is-high-contrast" : ""
      }`}
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
            <div className="study-buddy-buttons">
              <button
                className="study-buddy-toggle"
                type="button"
                onClick={() => setIsCollapsed((prev) => !prev)}
                aria-expanded={!isCollapsed}
                aria-controls={contentId}
              >
                {isCollapsed ? t("studyBuddy.actions.expand") : t("studyBuddy.actions.collapse")}
              </button>
              <button
                className="study-buddy-toggle"
                type="button"
                onClick={() => setIsHighContrast((prev) => !prev)}
                aria-pressed={isHighContrast}
              >
                {isHighContrast ? t("studyBuddy.actions.contrastOff") : t("studyBuddy.actions.contrastOn")}
              </button>
              <button
                className="study-buddy-toggle"
                type="button"
                onClick={() => {
                  setIsDismissed(true);
                  setIsCollapsed(false);
                }}
              >
                {t("studyBuddy.actions.dismiss")}
              </button>
            </div>
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
