export const computeExamReadiness = ({ attendanceSessions, completedAssignments }) => {
  const completed = completedAssignments || [];
  const completedCount = completed.length;

  const normalizedScores = completed
    .map((entry) => Number(entry.score))
    .filter((value) => Number.isFinite(value));

  const averageScore =
    normalizedScores.length > 0
      ? Math.round(normalizedScores.reduce((sum, value) => sum + value, 0) / normalizedScores.length)
      : null;

  const passCount = normalizedScores.filter((value) => value >= 70).length;
  const passRate = normalizedScores.length ? Math.round((passCount / normalizedScores.length) * 100) : null;

  // ✅ READY (green)
  if (completedCount >= 5 && averageScore !== null && averageScore >= 75 && attendanceSessions >= 5) {
    return {
      icon: "✅",
      tone: "#dcfce7",
      text: "Ready for exam window",
      detail: `Consistent scores (${averageScore}/100 avg, ${passRate ?? 0}% pass) with solid attendance.`,
      statusLabel: "Ready",
      statusPillBg: "#dcfce7",
      statusPillBorder: "#86efac",
      statusPillText: "#166534",
    };
  }

  // ⚠️ ALMOST (yellow)
  if (completedCount >= 2 && averageScore !== null && averageScore >= 50) {
    return {
      icon: "⚠️",
      tone: "#fef3c7",
      text: "Build a stronger buffer",
      detail: "Keep aiming for 75+/100 on recent work and finish at least 5 marked identifiers for a green check.",
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
    detail: "Submit more assignments with scores to unlock readiness tracking.",
    statusLabel: "Not ready",
    statusPillBg: "#fee2e2",
    statusPillBorder: "#fca5a5",
    statusPillText: "#991b1b",
  };
};
