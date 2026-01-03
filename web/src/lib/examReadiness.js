export const computeExamReadiness = ({ attendanceSessions, completedAssignments, totalAssignments }) => {
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
      text: "Ready for exam window",
      detail: `Consistent scores (${averageScore}/100 avg, ${passRate ?? 0}% pass) with ${completionDetail} and solid attendance.`,
      statusLabel: "Ready",
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
      text: "Build a stronger buffer",
      detail: plannedTotal
        ? `Keep aiming for 75+/100 on recent work and reach ${readyTarget}/${plannedTotal} assignments for a green check.`
        : "Keep aiming for 75+/100 on recent work and finish at least 5 marked identifiers for a green check.",
      statusLabel: "Almost Ready",
      statusPillBg: "#fef3c7",
      statusPillBorder: "#fcd34d",
      statusPillText: "#92400e",
    };
  }

  // ❌ NOT READY (red)
  return {
    icon: "❌",
    tone: "#fee2e2",
    text: "Not ready yet",
    detail: plannedTotal
      ? `Complete at least ${almostTarget}/${plannedTotal} assignments with scores and ${evidenceTarget} scored items to unlock readiness tracking.`
      : "Submit more assignments with scores to unlock readiness tracking.",
    statusLabel: "Not ready",
    statusPillBg: "#fee2e2",
    statusPillBorder: "#fca5a5",
    statusPillText: "#991b1b",
  };
};
