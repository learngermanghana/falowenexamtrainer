import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formatCurrency } from "../lib/formatters";
import { toDateMs } from "../lib/dateUtils";
import { fetchAttendanceSummary } from "../services/attendanceService";
import { fetchResults } from "../services/resultsService";
import { fetchScoreSummary } from "../services/scoreSummaryService";
import { logStudyBuddyUsage, requestStudyBuddyReply } from "../services/studyBuddyService";

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const StudyBuddyBar = ({ studentProfile }) => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const { idToken, user } = useAuth();
  const locale = i18n.language;
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isDismissed, setIsDismissed] = useState(true);
  const [isHighContrast, setIsHighContrast] = useState(() => {
    try {
      return localStorage.getItem("studyBuddyHighContrast") === "true";
    } catch (error) {
      return false;
    }
  });
  const contentId = "study-buddy-content";
  const studentCode =
    studentProfile?.studentcode || studentProfile?.studentCode || studentProfile?.id || "";
  const studentEmail = studentProfile?.email || "";
  const className = studentProfile?.className || "";
  const levelKey = String(studentProfile?.level || studentProfile?.course || "").trim();
  const resolvedLevel = useMemo(() => {
    if (!levelKey) return "";
    const normalized = levelKey
      .split(/[,\s/|]+/)
      .map((entry) => entry.trim())
      .find(Boolean);
    return (normalized || "").toUpperCase();
  }, [levelKey]);
  const [latestResult, setLatestResult] = useState(null);
  const [scoreSummary, setScoreSummary] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState(null);

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
        latestResult?.score ??
          studentProfile?.latestScore ??
          studentProfile?.latestResultScore ??
          studentProfile?.score ??
          studentProfile?.lastScore
      ),
    [latestResult?.score, studentProfile]
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
  const attendanceSessions =
    attendanceSummary?.sessions ??
    studentProfile?.attendanceSessions ??
    studentProfile?.attendance?.sessions ??
    null;
  const assignmentLabel =
    scoreSummary?.student?.nextRecommendation?.label ||
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
  const [questionInput, setQuestionInput] = useState("");
  const [quickReply, setQuickReply] = useState("");
  const [quickReplyError, setQuickReplyError] = useState("");
  const [isReplyLoading, setIsReplyLoading] = useState(false);
  const maxQuestionLength = 160;
  const trimmedQuestion = questionInput.trim();
  const isQuestionTooLong = questionInput.length > maxQuestionLength;
  const isSendDisabled = !trimmedQuestion || isReplyLoading || isQuestionTooLong;

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

  useEffect(() => {
    let isMounted = true;

    const loadMetrics = async () => {
      const tasks = [];

      if (studentCode || studentEmail) {
        tasks.push(
          fetchResults({ studentCode, email: studentEmail })
            .then((response) => {
              if (!isMounted) return;
              const results = response?.results || [];
              if (!results.length) {
                setLatestResult(null);
                return;
              }
              const latest = results.reduce((acc, entry) => {
                const entryDate = new Date(entry.date || entry.created_at || 0);
                const accDate = acc ? new Date(acc.date || acc.created_at || 0) : new Date(0);
                if (Number.isNaN(entryDate.getTime())) return acc;
                if (Number.isNaN(accDate.getTime()) || entryDate > accDate) return entry;
                return acc;
              }, null);
              setLatestResult(latest || null);
            })
            .catch(() => {
              if (isMounted) setLatestResult(null);
            })
        );
      }

      if (className && studentCode) {
        tasks.push(
          fetchAttendanceSummary({ className, studentCode, level: resolvedLevel })
            .then((response) => {
              if (isMounted) setAttendanceSummary(response || null);
            })
            .catch(() => {
              if (isMounted) setAttendanceSummary(null);
            })
        );
      } else {
        setAttendanceSummary(null);
      }

      if (idToken && studentCode) {
        tasks.push(
          fetchScoreSummary({ idToken, studentCode })
            .then((response) => {
              if (isMounted) setScoreSummary(response || null);
            })
            .catch(() => {
              if (isMounted) setScoreSummary(null);
            })
        );
      } else {
        setScoreSummary(null);
      }

      if (tasks.length) {
        await Promise.all(tasks);
      }
    };

    loadMetrics();
    return () => {
      isMounted = false;
    };
  }, [className, idToken, resolvedLevel, studentCode, studentEmail]);

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
  const submitQuickQuestion = useCallback(
    async (question) => {
      const trimmed = question.trim();
      if (!trimmed) return;
      setQuestionInput("");
      setIsReplyLoading(true);
      setQuickReply("");
      setQuickReplyError("");
      try {
        await logStudyBuddyUsage({
          event: "quick_question",
          studentCode,
          studentEmail,
          className,
          userId: user?.uid || null,
          questionLength: trimmed.length,
        });
        const response = await requestStudyBuddyReply({
          message: trimmed,
          level: resolvedLevel || "B1",
          idToken,
        });
        setQuickReply(response?.reply || "");
        if (!response?.reply) {
          setQuickReplyError(t("studyBuddy.qa.error"));
        }
      } catch (error) {
        console.error("Study Buddy quick question failed", error);
        setQuickReplyError(error?.message || t("studyBuddy.qa.error"));
      } finally {
        setIsReplyLoading(false);
      }
    },
    [className, idToken, resolvedLevel, studentCode, studentEmail, t, user?.uid]
  );

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
        action: () => navigate("/exams/overview"),
      },
    ],
    [navigate, t]
  );

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

          <div className="study-buddy-qa">
            <p className="study-buddy-qa-title">{t("studyBuddy.qa.title")}</p>
            <form
              className="study-buddy-qa-form"
              onSubmit={(event) => {
                event.preventDefault();
                submitQuickQuestion(questionInput);
              }}
            >
              <input
                className="study-buddy-qa-input"
                type="text"
                value={questionInput}
                maxLength={maxQuestionLength}
                placeholder={t("studyBuddy.qa.placeholder")}
                onChange={(event) => setQuestionInput(event.target.value)}
                disabled={isReplyLoading}
              />
              <button className="study-buddy-qa-button" type="submit" disabled={isSendDisabled}>
                {t("studyBuddy.qa.send")}
              </button>
            </form>
            <div className="study-buddy-qa-meta">
              <p className="study-buddy-qa-helper">{t("studyBuddy.qa.helper")}</p>
              <p className={`study-buddy-qa-count${isQuestionTooLong ? " is-warning" : ""}`}>
                {t("studyBuddy.qa.charCount", {
                  count: questionInput.length,
                  max: maxQuestionLength,
                })}
              </p>
            </div>
            {isReplyLoading ? (
              <p className="study-buddy-qa-response" aria-live="polite">
                {t("studyBuddy.qa.loading")}
              </p>
            ) : quickReply ? (
              <p className="study-buddy-qa-response" aria-live="polite">
                {quickReply}
              </p>
            ) : quickReplyError ? (
              <p className="study-buddy-qa-response" aria-live="polite">
                {quickReplyError}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudyBuddyBar;
