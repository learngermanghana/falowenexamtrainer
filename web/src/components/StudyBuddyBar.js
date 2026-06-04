import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formatCurrency } from "../lib/formatters";
import { toDateMs } from "../lib/dateUtils";
import { fetchAttendanceSummary } from "../services/attendanceService";
import { fetchResults } from "../services/resultsService";
import { fetchScoreSummary } from "../services/scoreSummaryService";
import { logStudyBuddyUsage, requestStudyBuddyReply } from "../services/studyBuddyService";
import { triggerInteractionFeedback } from "../services/interactionFeedback";
import "./StudyBuddyBar.css";

const PASS_MARK = 60;
const ATTENDANCE_TARGET = 80;
const EXAM_SIMULATION_WINDOW_DAYS = 45;
const COLLAPSED_PLAN_LIMIT = 2;
const GERMAN_KEYS = ["ä", "ö", "ü", "ß"];

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const getWeekStartKey = () => {
  const current = new Date();
  const mondayOffset = (current.getDay() + 6) % 7;
  current.setHours(0, 0, 0, 0);
  current.setDate(current.getDate() - mondayOffset);
  return current.toISOString().slice(0, 10);
};

const readStoredPlanState = (storageKey) => {
  try {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) || {} : {};
  } catch (error) {
    return {};
  }
};

const StudyBuddyBar = ({ studentProfile }) => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const { idToken, user } = useAuth();
  const locale = i18n.language;
  const quickQuestionInputRef = useRef(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isDismissed, setIsDismissed] = useState(true);
  const [isPlanExpanded, setIsPlanExpanded] = useState(false);
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
  const studentName = studentProfile?.name || studentProfile?.fullName || studentProfile?.displayName || "";
  const className = studentProfile?.className || "";
  const weekStartKey = useMemo(() => getWeekStartKey(), []);
  const planStorageKey = useMemo(() => {
    const studentIdentity = studentCode || studentEmail || user?.uid || "guest";
    return `studyBuddyWeeklyPlan:${studentIdentity}:${weekStartKey}`;
  }, [studentCode, studentEmail, user?.uid, weekStartKey]);
  const [completedPlanItems, setCompletedPlanItems] = useState(() => readStoredPlanState(planStorageKey));
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
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [recommendedAssignment, setRecommendedAssignment] = useState("");
  const [leaderboardPosition, setLeaderboardPosition] = useState(null);
  const [leaderboardLevel, setLeaderboardLevel] = useState("");

  const trackStudyBuddyEvent = useCallback(
    (event, metadata = {}) =>
      logStudyBuddyUsage({
        event,
        studentCode,
        studentEmail,
        studentName,
        className,
        userId: user?.uid || null,
        level: resolvedLevel,
        weekStart: weekStartKey,
        metadata,
        ...metadata,
      }).catch(() => {}),
    [className, resolvedLevel, studentCode, studentEmail, studentName, user?.uid, weekStartKey]
  );

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
  const resultsLabel =
    leaderboardPosition
      ? `#${numberFormatter.format(leaderboardPosition.rank)} / ${numberFormatter.format(leaderboardPosition.total)}${
          leaderboardLevel ? ` (${leaderboardLevel})` : ""
        }`
      : latestScore !== null
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
  const [questionInput, setQuestionInput] = useState("");
  const [quickReply, setQuickReply] = useState("");
  const [quickReplyError, setQuickReplyError] = useState("");
  const [isReplyLoading, setIsReplyLoading] = useState(false);
  const trimmedQuestion = questionInput.trim();
  const isSendDisabled = !trimmedQuestion || isReplyLoading;
  const playOpenFeedback = useCallback(() => {
    triggerInteractionFeedback({ sound: "open" });
  }, []);
  const insertGermanKey = useCallback(
    (character) => {
      const input = quickQuestionInputRef.current;
      setQuestionInput((current) => {
        const start = typeof input?.selectionStart === "number" ? input.selectionStart : current.length;
        const end = typeof input?.selectionEnd === "number" ? input.selectionEnd : current.length;
        window.setTimeout(() => {
          if (!input) return;
          try {
            input.focus({ preventScroll: true });
            const position = start + character.length;
            input.setSelectionRange(position, position);
          } catch (error) {
            input.focus();
          }
        }, 0);
        return `${current.slice(0, start)}${character}${current.slice(end)}`;
      });
      trackStudyBuddyEvent("umlaut_insert", { character, input: "course_book_chat" });
    },
    [trackStudyBuddyEvent]
  );


  const examDaysLeft = useMemo(() => {
    const examDateMs = toDateMs(
      studentProfile?.examDate ||
        studentProfile?.nextExamDate ||
        studentProfile?.examDateIso ||
        studentProfile?.exam?.date ||
        studentProfile?.exam?.startDate
    );
    if (!Number.isFinite(examDateMs)) return null;
    const dayMs = 1000 * 60 * 60 * 24;
    return Math.max(0, Math.ceil((examDateMs - Date.now()) / dayMs));
  }, [studentProfile]);

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

      if (studentCode) {
        tasks.push(
          fetchScoreSummary({ idToken, studentCode })
            .then((response) => {
              if (!isMounted) return;
              setRecommendedAssignment(response?.student?.nextRecommendation?.label || "");
              const rows = response?.leaderboard?.rows || [];
              setLeaderboardLevel(String(response?.leaderboard?.level || "").trim().toUpperCase());
              const mine = rows.find(
                (row) => String(row.studentCode || "").trim().toLowerCase() === String(studentCode || "").trim().toLowerCase()
              );
              setLeaderboardPosition(mine ? { rank: mine.rank, total: rows.length } : null);
            })
            .catch(() => {
              if (isMounted) setRecommendedAssignment("");
              if (isMounted) setLeaderboardPosition(null);
              if (isMounted) setLeaderboardLevel("");
            })
        );
      } else {
        setRecommendedAssignment("");
        setLeaderboardPosition(null);
        setLeaderboardLevel("");
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

      if (tasks.length) {
        await Promise.all(tasks);
      }
    };

    loadMetrics();
    return () => {
      isMounted = false;
    };
  }, [className, idToken, resolvedLevel, studentCode, studentEmail]);

  useEffect(() => {
    setCompletedPlanItems(readStoredPlanState(planStorageKey));
  }, [planStorageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(planStorageKey, JSON.stringify(completedPlanItems));
    } catch (error) {
      // Ignore storage errors (privacy mode, etc.)
    }
  }, [completedPlanItems, planStorageKey]);

  const suggestions = useMemo(() => {
    const tips = [];

    if (latestScore !== null && latestScore < PASS_MARK) {
      tips.push(t("studyBuddy.suggestions.lowScore"));
    }

    if (attendanceRate !== null && attendanceRate < ATTENDANCE_TARGET) {
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

    if (!tips.length) {
      tips.push(recommendedAssignment || t("studyBuddy.suggestions.default"));
    }

    return tips;
  }, [attendanceRate, latestScore, paymentReminder, recommendedAssignment, t]);

  const primarySuggestion = suggestions[0];
  const latestAssignmentLabel =
    latestResult?.assignment ||
    latestResult?.assignmentTitle ||
    latestResult?.assignmentName ||
    latestResult?.assignment_id ||
    latestResult?.assignmentId ||
    recommendedAssignment ||
    t("studyBuddy.metrics.latestResult");

  const weeklyPlanItems = useMemo(() => {
    const items = [];
    const addItem = (id, title, helper) => {
      if (!items.some((item) => item.id === id)) {
        items.push({ id, title, helper });
      }
    };

    if (latestScore !== null && latestScore < PASS_MARK) {
      addItem(
        "redoFailed",
        t("studyBuddy.weeklyPlan.items.redoFailed", { assignment: latestAssignmentLabel }),
        t("studyBuddy.weeklyPlan.helpers.redoFailed")
      );
    }

    if (attendanceRate !== null && attendanceRate < ATTENDANCE_TARGET) {
      addItem(
        "attendanceReset",
        t("studyBuddy.weeklyPlan.items.attendanceReset"),
        t("studyBuddy.weeklyPlan.helpers.attendanceReset")
      );
    }

    addItem(
      "grammarRepair",
      t("studyBuddy.weeklyPlan.items.grammarRepair"),
      t("studyBuddy.weeklyPlan.helpers.grammarRepair")
    );
    addItem(
      "writingPractice",
      t("studyBuddy.weeklyPlan.items.writingPractice"),
      t("studyBuddy.weeklyPlan.helpers.writingPractice")
    );
    addItem(
      "vocabRecall",
      t("studyBuddy.weeklyPlan.items.vocabRecall"),
      t("studyBuddy.weeklyPlan.helpers.vocabRecall")
    );

    if (examDaysLeft !== null && examDaysLeft <= EXAM_SIMULATION_WINDOW_DAYS) {
      addItem(
        "examSimulation",
        t("studyBuddy.weeklyPlan.items.examSimulation"),
        t("studyBuddy.weeklyPlan.helpers.examSimulation", {
          days: numberFormatter.format(examDaysLeft),
        })
      );
    }

    return items;
  }, [attendanceRate, examDaysLeft, latestAssignmentLabel, latestScore, numberFormatter, t]);

  const completedPlanCount = weeklyPlanItems.filter((item) => completedPlanItems[item.id]).length;
  const pendingPlanCount = Math.max(weeklyPlanItems.length - completedPlanCount, 0);
  const visibleWeeklyPlanItems = isPlanExpanded ? weeklyPlanItems : weeklyPlanItems.slice(0, COLLAPSED_PLAN_LIMIT);
  const hiddenPlanCount = Math.max(weeklyPlanItems.length - visibleWeeklyPlanItems.length, 0);
  const planNudge =
    pendingPlanCount === 0
      ? t("studyBuddy.weeklyPlan.nudges.allDone")
      : pendingPlanCount === 1
      ? t("studyBuddy.weeklyPlan.nudges.oneLeft")
      : t("studyBuddy.weeklyPlan.nudges.pending", {
          count: numberFormatter.format(pendingPlanCount),
        });

  const togglePlanItem = useCallback(
    (itemId) => {
      const completed = !completedPlanItems[itemId];
      setCompletedPlanItems((previous) => ({
        ...previous,
        [itemId]: completed,
      }));
      triggerInteractionFeedback({ sound: completed ? "success" : "open" });
      logStudyBuddyUsage({
        event: "weekly_plan_toggle",
        studentCode,
        studentEmail,
        studentName,
        className,
        userId: user?.uid || null,
        level: resolvedLevel,
        itemId,
        completed,
        weekStart: weekStartKey,
      }).catch(() => {});
    },
    [className, completedPlanItems, resolvedLevel, studentCode, studentEmail, studentName, user?.uid, weekStartKey]
  );

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
          studentName,
          className,
          userId: user?.uid || null,
          level: resolvedLevel,
          questionLength: trimmed.length,
        });
        const response = await requestStudyBuddyReply({
          message: trimmed,
          level: resolvedLevel || "B1",
          idToken,
        });
        setQuickReply(response?.reply || "");
        if (response?.reply) {
          trackStudyBuddyEvent("quick_question_reply", { questionLength: trimmed.length, replyLength: response.reply.length });
          triggerInteractionFeedback({ sound: "success" });
        } else {
          setQuickReplyError(t("studyBuddy.qa.error"));
          triggerInteractionFeedback({ sound: "error" });
        }
      } catch (error) {
        console.error("Study Buddy quick question failed", error);
        setQuickReplyError(error?.message || t("studyBuddy.qa.error"));
        triggerInteractionFeedback({ sound: "error" });
      } finally {
        setIsReplyLoading(false);
      }
    },
    [className, idToken, resolvedLevel, studentCode, studentEmail, studentName, t, trackStudyBuddyEvent, user?.uid]
  );

  const focusQuickQuestion = useCallback(() => {
    setIsCollapsed(false);
    trackStudyBuddyEvent("shortcut_click", { shortcutKey: "ask", shortcutLabel: t("studyBuddy.qa.jumpButton", { defaultValue: "Ask AI" }) });
    triggerInteractionFeedback({ sound: "open" });
    window.setTimeout(() => {
      const input = quickQuestionInputRef.current;
      if (!input) return;
      input.scrollIntoView({ behavior: "smooth", block: "center" });
      try {
        input.focus({ preventScroll: true });
      } catch (error) {
        input.focus();
      }
    }, 80);
  }, [t, trackStudyBuddyEvent]);

  const quickLinks = useMemo(
    () => [
      {
        key: "ask",
        label: t("studyBuddy.qa.jumpButton", { defaultValue: "Ask AI" }),
        action: focusQuickQuestion,
      },
      {
        key: "course",
        label: t("studyBuddy.shortcuts.course"),
        action: () => {
          playOpenFeedback();
          trackStudyBuddyEvent("shortcut_click", { shortcutKey: "course", shortcutLabel: t("studyBuddy.shortcuts.course"), destination: "/campus/course" });
          navigate("/campus/course");
        },
      },
      {
        key: "submit",
        label: t("studyBuddy.shortcuts.submit"),
        action: () => {
          playOpenFeedback();
          trackStudyBuddyEvent("shortcut_click", { shortcutKey: "submit", shortcutLabel: t("studyBuddy.shortcuts.submit"), destination: "/campus/submit" });
          navigate("/campus/submit");
        },
      },
      {
        key: "ai",
        label: t("studyBuddy.shortcuts.ai"),
        action: () => {
          playOpenFeedback();
          trackStudyBuddyEvent("shortcut_click", { shortcutKey: "ai", shortcutLabel: t("studyBuddy.shortcuts.ai"), destination: "/campus/grammar" });
          navigate("/campus/grammar");
        },
      },
      {
        key: "exams",
        label: t("studyBuddy.shortcuts.exams"),
        action: () => {
          playOpenFeedback();
          trackStudyBuddyEvent("shortcut_click", { shortcutKey: "exams", shortcutLabel: t("studyBuddy.shortcuts.exams"), destination: "/exams/overview" });
          navigate("/exams/overview");
        },
      },
    ],
    [focusQuickQuestion, navigate, playOpenFeedback, t, trackStudyBuddyEvent]
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
        onClick={() => {
          setIsDismissed(false);
          trackStudyBuddyEvent("reopen");
        }}
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
              onClick={() => {
                const nextCollapsed = !isCollapsed;
                setIsCollapsed(nextCollapsed);
                trackStudyBuddyEvent(nextCollapsed ? "collapse" : "expand");
              }}
              aria-expanded={!isCollapsed}
              aria-controls={contentId}
            >
              {isCollapsed ? t("studyBuddy.actions.expand") : t("studyBuddy.actions.collapse")}
            </button>
            <button
              className="study-buddy-toggle"
              type="button"
              onClick={() => {
                setIsHighContrast((prev) => {
                  const next = !prev;
                  trackStudyBuddyEvent("high_contrast_toggle", { enabled: next });
                  return next;
                });
              }}
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
                trackStudyBuddyEvent("dismiss");
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
          </div>

          <div className="study-buddy-qa study-buddy-qa-priority">
            <p className="study-buddy-qa-title">{t("studyBuddy.qa.title")}</p>
            <form
              className="study-buddy-qa-form"
              onSubmit={(event) => {
                event.preventDefault();
                submitQuickQuestion(questionInput);
              }}
            >
              <input
                ref={quickQuestionInputRef}
                className="study-buddy-qa-input"
                type="text"
                value={questionInput}
                placeholder={t("studyBuddy.qa.placeholder")}
                onChange={(event) => setQuestionInput(event.target.value)}
                disabled={isReplyLoading}
              />
              <button className="study-buddy-qa-button" type="submit" disabled={isSendDisabled}>
                {t("studyBuddy.qa.send")}
              </button>
            </form>
            <div className="study-buddy-german-keys" aria-label="German keys">
              <span>German keys:</span>
              {GERMAN_KEYS.map((character) => (
                <button key={character} type="button" onClick={() => insertGermanKey(character)} disabled={isReplyLoading}>
                  {character}
                </button>
              ))}
            </div>
            <div className="study-buddy-qa-meta">
              <p className="study-buddy-qa-helper">{t("studyBuddy.qa.helper")}</p>
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

          <div className="study-buddy-plan">
            <div className="study-buddy-plan-header">
              <div>
                <p className="study-buddy-qa-title">{t("studyBuddy.weeklyPlan.title")}</p>
                <p className="study-buddy-plan-progress">{t("studyBuddy.weeklyPlan.description")}</p>
              </div>
              <p className="study-buddy-plan-progress">
                {t("studyBuddy.weeklyPlan.progress", {
                  done: numberFormatter.format(completedPlanCount),
                  total: numberFormatter.format(weeklyPlanItems.length),
                })}
              </p>
            </div>
            <ul className="study-buddy-plan-list">
              {visibleWeeklyPlanItems.map((item) => {
                const isComplete = Boolean(completedPlanItems[item.id]);
                return (
                  <li key={item.id} className="study-buddy-plan-item">
                    <button
                      type="button"
                      className={`study-buddy-plan-check${isComplete ? " is-complete" : ""}`}
                      aria-pressed={isComplete}
                      onClick={() => togglePlanItem(item.id)}
                    >
                      {isComplete ? "✓" : "+"}
                    </button>
                    <div>
                      <p className="study-buddy-plan-item-title">{item.title}</p>
                      <p className="study-buddy-plan-item-helper">{item.helper}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            {hiddenPlanCount > 0 ? (
              <button
                type="button"
                className="study-buddy-plan-more"
                onClick={() => {
                  setIsPlanExpanded(true);
                  trackStudyBuddyEvent("weekly_plan_expand", { hiddenPlanCount });
                }}
              >
                {t("studyBuddy.weeklyPlan.showAll", {
                  count: numberFormatter.format(hiddenPlanCount),
                  defaultValue: `View ${numberFormatter.format(hiddenPlanCount)} more tasks`,
                })}
              </button>
            ) : isPlanExpanded && weeklyPlanItems.length > COLLAPSED_PLAN_LIMIT ? (
              <button
                type="button"
                className="study-buddy-plan-more"
                onClick={() => {
                  setIsPlanExpanded(false);
                  trackStudyBuddyEvent("weekly_plan_collapse");
                }}
              >
                {t("studyBuddy.weeklyPlan.showLess", { defaultValue: "Show fewer tasks" })}
              </button>
            ) : null}
            <p className="study-buddy-plan-nudge">{planNudge}</p>
          </div>
        </div>
        {!isCollapsed ? (
          <button
            type="button"
            className="study-buddy-mobile-close"
            onClick={() => {
              setIsCollapsed(true);
              trackStudyBuddyEvent("collapse", { source: "mobile_close" });
            }}
            aria-label={t("studyBuddy.actions.collapse")}
          >
            {t("studyBuddy.actions.collapse")}
          </button>
        ) : null}
      </div>
    </section>
  );
};

export default StudyBuddyBar;
