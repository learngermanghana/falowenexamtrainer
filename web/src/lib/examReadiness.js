const fallbackTranslate = (key, optionsOrFallback) => {
  if (typeof optionsOrFallback === "string") return optionsOrFallback;
  if (optionsOrFallback && typeof optionsOrFallback === "object") return optionsOrFallback.defaultValue || key;
  return key;
};

export const computeExamReadiness = ({
  attendanceSessions,
  completedAssignments,
  totalAssignments,
  t = fallbackTranslate,
}) => {
  const completed = completedAssignments || [];
  const completedCount = completed.length;
  const plannedTotal = Number.isFinite(Number(totalAssignments)) ? Number(totalAssignments) : null;

  const normalizedScores = completed
    .map((entry) => Number(entry.score))
    .filter((value) => Number.isFinite(value));

  const averageScore =
    normalizedScores.length > 0
      ? Math.round(normalizedScores.reduce((sum, value) => sum + value, 0) / normalizedScores.length)
      : null;

  const passCount = normalizedScores.filter((value) => value >= 70).length;
  const passRate = normalizedScores.length ? Math.round((passCount / normalizedScores.length) * 100) : null;

  const completionRate = plannedTotal ? Math.round((completedCount / plannedTotal) * 100) : null;
  const readyTarget = plannedTotal ? Math.ceil(plannedTotal * 0.7) : 5;
  const almostTarget = plannedTotal ? Math.max(3, Math.ceil(plannedTotal * 0.5)) : 3;
  const evidenceTarget = plannedTotal ? Math.max(3, Math.ceil(plannedTotal * 0.3)) : 3;
  const completionDetail = plannedTotal
    ? `${completedCount}/${plannedTotal} assignments (${completionRate ?? 0}%)`
    : `${completedCount} assignments`;

  // ✅ READY (green)
  if (
    completedCount >= readyTarget &&
    normalizedScores.length >= readyTarget &&
    averageScore !== null &&
    averageScore >= 75 &&
    passRate !== null &&
    passRate >= 70 &&
    attendanceSessions >= 5
  ) {
    return {
      icon: "✅",
      tone: "#dcfce7",
      text: t("examReadiness.states.ready.text", "Ready for exam window"),
      detail: t("examReadiness.states.ready.detail", {
        averageScore,
        passRate: passRate ?? 0,
        completionDetail,
        defaultValue: `Consistent scores (${averageScore}/100 avg, ${passRate ?? 0}% pass) with ${completionDetail} and solid attendance.`,
      }),
      statusLabel: t("examReadiness.states.ready.statusLabel", "Ready"),
      statusPillBg: "#dcfce7",
      statusPillBorder: "#86efac",
      statusPillText: "#166534",
    };
  }

  // ⚠️ ALMOST (yellow)
  if (
    completedCount >= almostTarget &&
    normalizedScores.length >= evidenceTarget &&
    averageScore !== null &&
    averageScore >= 60 &&
    passRate !== null &&
    passRate >= 50 &&
    attendanceSessions >= 3
  ) {
    return {
      icon: "⚠️",
      tone: "#fef3c7",
      text: t("examReadiness.states.almost.text", "Build a stronger buffer"),
      detail: plannedTotal
        ? t("examReadiness.states.almost.detailWithTotal", {
            readyTarget,
            plannedTotal,
            defaultValue: `Keep aiming for 75+/100 on recent work and reach ${readyTarget}/${plannedTotal} assignments for a green check.`,
          })
        : t(
            "examReadiness.states.almost.detail",
            "Keep aiming for 75+/100 on recent work and finish at least 5 marked identifiers for a green check."
          ),
      statusLabel: t("examReadiness.states.almost.statusLabel", "Almost Ready"),
      statusPillBg: "#fef3c7",
      statusPillBorder: "#fcd34d",
      statusPillText: "#92400e",
    };
  }

  // ❌ NOT READY (red)
  return {
    icon: "❌",
    tone: "#fee2e2",
    text: t("examReadiness.states.notReady.text", "Not ready yet"),
    detail: plannedTotal
      ? t("examReadiness.states.notReady.detailWithTotal", {
          almostTarget,
          plannedTotal,
          evidenceTarget,
          defaultValue: `Complete at least ${almostTarget}/${plannedTotal} assignments with scores and ${evidenceTarget} scored items to unlock readiness tracking.`,
        })
      : t("examReadiness.states.notReady.detail", "Submit more assignments with scores to unlock readiness tracking."),
    statusLabel: t("examReadiness.states.notReady.statusLabel", "Not ready"),
    statusPillBg: "#fee2e2",
    statusPillBorder: "#fca5a5",
    statusPillText: "#991b1b",
  };
};
