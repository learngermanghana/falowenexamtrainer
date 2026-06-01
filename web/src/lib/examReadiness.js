const fallbackTranslate = (key, optionsOrFallback) => {
  if (typeof optionsOrFallback === "string") return optionsOrFallback;
  if (optionsOrFallback && typeof optionsOrFallback === "object") return optionsOrFallback.defaultValue || key;
  return key;
};

export const READINESS_WEIGHTS = {
  completion: 30,
  performance: 35,
  attendance: 20,
  improvement: 10,
  examFile: 5,
};

const clampScore = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.min(100, Math.round(numeric)));
};

const toNumericScore = (value) => {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;

  const cleaned = String(value).trim().replace(",", ".");
  const match = cleaned.match(/(\d+(?:\.\d+)?)/);
  if (!match) return null;

  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
};

const scoreFromAssignment = (entry = {}) =>
  toNumericScore(
    entry.bestScore ??
      entry.score ??
      entry.finalScore ??
      entry.highestScore ??
      entry.points ??
      entry.mark
  );

const buildStatus = (score, t) => {
  if (score >= 90) {
    return {
      icon: "🌟",
      tone: "#dcfce7",
      text: t("examReadiness.states.strong.text", "Strongly ready"),
      statusLabel: t("examReadiness.states.strong.statusLabel", "Strongly Ready"),
      statusPillBg: "#dcfce7",
      statusPillBorder: "#86efac",
      statusPillText: "#166534",
    };
  }

  if (score >= 75) {
    return {
      icon: "✅",
      tone: "#dcfce7",
      text: t("examReadiness.states.ready.text", "Ready"),
      statusLabel: t("examReadiness.states.ready.statusLabel", "Ready"),
      statusPillBg: "#dcfce7",
      statusPillBorder: "#86efac",
      statusPillText: "#166534",
    };
  }

  if (score >= 60) {
    return {
      icon: "⚠️",
      tone: "#fef3c7",
      text: t("examReadiness.states.almost.text", "Almost ready"),
      statusLabel: t("examReadiness.states.almost.statusLabel", "Almost Ready"),
      statusPillBg: "#fef3c7",
      statusPillBorder: "#fcd34d",
      statusPillText: "#92400e",
    };
  }

  if (score >= 40) {
    return {
      icon: "📚",
      tone: "#fffbeb",
      text: t("examReadiness.states.building.text", "Building"),
      statusLabel: t("examReadiness.states.building.statusLabel", "Building"),
      statusPillBg: "#fffbeb",
      statusPillBorder: "#fde68a",
      statusPillText: "#92400e",
    };
  }

  return {
    icon: "❌",
    tone: "#fee2e2",
    text: t("examReadiness.states.notReady.text", "Not ready yet"),
    statusLabel: t("examReadiness.states.notReady.statusLabel", "Not Ready"),
    statusPillBg: "#fee2e2",
    statusPillBorder: "#fca5a5",
    statusPillText: "#991b1b",
  };
};

const buildTargetAttendanceSessions = ({ expectedAttendanceSessions, totalAssignments }) => {
  const explicitTarget = Number(expectedAttendanceSessions);
  if (Number.isFinite(explicitTarget) && explicitTarget > 0) return explicitTarget;

  const plannedTotal = Number(totalAssignments);
  if (Number.isFinite(plannedTotal) && plannedTotal > 0) {
    return Math.max(5, Math.ceil(plannedTotal * 0.7));
  }

  return 5;
};

const weightedContribution = (score, weight) => (clampScore(score) * weight) / 100;

export const computeExamReadiness = ({
  attendanceSessions = null,
  completedAssignments,
  failedAssignments,
  missedAssignments,
  retriesThisWeek = 0,
  totalAssignments,
  expectedAttendanceSessions,
  examFileActivity = 100,
  t = fallbackTranslate,
} = {}) => {
  const completed = Array.isArray(completedAssignments) ? completedAssignments : [];
  const failed = Array.isArray(failedAssignments) ? failedAssignments : [];
  const missed = Array.isArray(missedAssignments) ? missedAssignments : [];
  const completedCount = completed.length;
  const plannedTotal = Number.isFinite(Number(totalAssignments)) ? Number(totalAssignments) : null;

  const normalizedScores = completed
    .map(scoreFromAssignment)
    .filter((value) => Number.isFinite(value));

  const averageScore =
    normalizedScores.length > 0
      ? Math.round(normalizedScores.reduce((sum, value) => sum + value, 0) / normalizedScores.length)
      : 0;

  const completionScore = plannedTotal ? clampScore((completedCount / plannedTotal) * 100) : clampScore(completedCount >= 5 ? 100 : (completedCount / 5) * 100);
  const performanceScore = normalizedScores.length ? clampScore(averageScore) : 0;

  const attendanceTarget = buildTargetAttendanceSessions({ expectedAttendanceSessions, totalAssignments: plannedTotal });
  const hasAttendanceEvidence = attendanceSessions !== null && attendanceSessions !== undefined;
  const attendanceScore = hasAttendanceEvidence
    ? clampScore((Number(attendanceSessions || 0) / attendanceTarget) * 100)
    : 0;

  const weakTaskCount = failed.length + missed.length;
  const retryCount = Number(retriesThisWeek || 0);
  const improvementScore = weakTaskCount === 0 ? 100 : clampScore((retryCount / weakTaskCount) * 100);
  const examFileScore = clampScore(examFileActivity);

  const score = clampScore(
    weightedContribution(completionScore, READINESS_WEIGHTS.completion) +
      weightedContribution(performanceScore, READINESS_WEIGHTS.performance) +
      weightedContribution(attendanceScore, READINESS_WEIGHTS.attendance) +
      weightedContribution(improvementScore, READINESS_WEIGHTS.improvement) +
      weightedContribution(examFileScore, READINESS_WEIGHTS.examFile)
  );

  const status = buildStatus(score, t);
  const completionDetail = plannedTotal
    ? `${completedCount}/${plannedTotal} assignments`
    : `${completedCount} assignments`;
  const attendanceDetail = hasAttendanceEvidence
    ? `${Number(attendanceSessions || 0)}/${attendanceTarget} sessions`
    : t("examReadiness.attendanceNotAvailable", "attendance not loaded yet");

  const breakdown = [
    {
      key: "completion",
      label: t("examReadiness.breakdown.completion", "Assignment completion"),
      score: completionScore,
      weight: READINESS_WEIGHTS.completion,
      detail: completionDetail,
    },
    {
      key: "performance",
      label: t("examReadiness.breakdown.performance", "Assignment performance"),
      score: performanceScore,
      weight: READINESS_WEIGHTS.performance,
      detail: normalizedScores.length
        ? t("examReadiness.breakdown.performanceDetail", {
            averageScore,
            count: normalizedScores.length,
            defaultValue: `${averageScore}/100 average from ${normalizedScores.length} scored tasks`,
          })
        : t("examReadiness.breakdown.noScores", "No scored tasks yet"),
    },
    {
      key: "attendance",
      label: t("examReadiness.breakdown.attendance", "Attendance"),
      score: attendanceScore,
      weight: READINESS_WEIGHTS.attendance,
      detail: attendanceDetail,
    },
    {
      key: "improvement",
      label: t("examReadiness.breakdown.improvement", "Redo / weak-task effort"),
      score: improvementScore,
      weight: READINESS_WEIGHTS.improvement,
      detail:
        weakTaskCount === 0
          ? t("examReadiness.breakdown.noWeakTasks", "No failed or missed tasks blocking progress")
          : t("examReadiness.breakdown.weakTasks", {
              weakTaskCount,
              retryCount,
              defaultValue: `${retryCount} recent retries for ${weakTaskCount} failed/missed tasks`,
            }),
    },
    {
      key: "examFile",
      label: t("examReadiness.breakdown.examFile", "Exam File activity"),
      score: examFileScore,
      weight: READINESS_WEIGHTS.examFile,
      detail: t("examReadiness.breakdown.examFileDetail", "Exam readiness file is available for this student"),
    },
  ];

  return {
    ...status,
    score,
    scoreLabel: `${score}%`,
    detail: t("examReadiness.scoreDetail", {
      score,
      completionDetail,
      averageScore,
      attendanceDetail,
      defaultValue: `Falowen readiness score is ${score}%, based on ${completionDetail}, ${averageScore}/100 average score, ${attendanceDetail}, redo effort, and Exam File activity.`,
    }),
    breakdown,
    averageScore,
    completionScore,
    performanceScore,
    attendanceScore,
    improvementScore,
    examFileScore,
    completedCount,
    totalAssignments: plannedTotal,
    attendanceTarget,
    weakTaskCount,
  };
};
