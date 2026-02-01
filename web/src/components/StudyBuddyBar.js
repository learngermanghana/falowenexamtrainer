import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../lib/formatters";
import { toDateMs } from "../lib/dateUtils";

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const StudyBuddyBar = ({ studentProfile }) => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const locale = i18n.language;
  const [isCollapsed, setIsCollapsed] = useState(true);
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

  const primarySuggestion = suggestions[0];

  const quickLinks = useMemo(
    () => [
      {
        key: "course",
        label: t("studyBuddy.shortcuts.course"),
        action: () => navigate("/campus/course"),
      },
      {
        key: "submit",
        label: t("studyBuddy.shortcuts.submit"),
        action: () => navigate("/campus/submit"),
      },
      {
        key: "ai",
        label: t("studyBuddy.shortcuts.ai"),
        action: () => navigate("/campus/grammar"),
      },
      {
        key: "study",
        label: t("studyBuddy.shortcuts.study"),
        action: () => navigate("/exams/study"),
      },
      {
        key: "exams",
        label: t("studyBuddy.shortcuts.exams"),
        action: () => navigate("/exams/speaking"),
      },
    ],
    [navigate, t]
  );

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
                setIsCollapsed(true);
              }}
            >
              {t("studyBuddy.actions.dismiss")}
            </button>
          </div>
        </div>

        <div className="study-buddy-shortcuts" aria-label={t("studyBuddy.shortcuts.ariaLabel")}>
          {quickLinks.map((link) => (
            <button key={link.key} className="study-buddy-shortcut" type="button" onClick={link.action}>
              {link.label}
            </button>
          ))}
        </div>

        <div id={contentId} className="study-buddy-details" hidden={isCollapsed}>
          <div className="study-buddy-insights">
            <div className="study-buddy-insight">
              <p className="study-buddy-label">{t("studyBuddy.insights.nextUp")}</p>
              <div className="study-buddy-value">{primarySuggestion}</div>
            </div>
            <div className="study-buddy-insight">
              <p className="study-buddy-label">{t("studyBuddy.insights.results")}</p>
              <div className="study-buddy-value">{resultsLabel}</div>
            </div>
            <div className="study-buddy-insight">
              <p className="study-buddy-label">{t("studyBuddy.insights.attendance")}</p>
              <div className="study-buddy-value">{attendanceLabel}</div>
            </div>
            <div className="study-buddy-insight">
              <p className="study-buddy-label">{t("studyBuddy.insights.assignment")}</p>
              <div className="study-buddy-value">{assignmentLabel}</div>
            </div>
          </div>

          <div className="study-buddy-source">
            <p className="study-buddy-source-title">{t("studyBuddy.data.title")}</p>
            <p className="study-buddy-source-text">{t("studyBuddy.data.description")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudyBuddyBar;
