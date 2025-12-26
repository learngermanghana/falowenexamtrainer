export const computeExamReadiness = ({ attendanceSessions, completedAssignments }) => {
  const completed = completedAssignments || [];
  const completedCount = completed.length;

  const scored = completed.filter((entry) => typeof entry.score === "number");
  const averageScore =
    scored.length > 0 ? Math.round(scored.reduce((sum, entry) => sum + entry.score, 0) / scored.length) : null;

  const passCount = scored.filter((entry) => entry.score >= 70).length;
  const passRate = scored.length ? Math.round((passCount / scored.length) * 100) : null;

  if (completedCount >= 5 && averageScore !== null && averageScore >= 75 && attendanceSessions >= 5) {
    return {
      icon: "✅",
      tone: "#dcfce7",
      text: "Ready for exam window",
      detail: `Consistent scores (${averageScore}/100 avg, ${passRate ?? 0}% pass) with solid attendance.`,
    };
  }

  if (completedCount >= 2 && averageScore !== null && averageScore >= 50) {
    return {
      icon: "⚠️",
      tone: "#fef3c7",
      text: "Build a stronger buffer",
      detail: "Keep aiming for 75+/100 on recent work and finish at least 5 marked identifiers for a green check.",
    };
  }

  return {
    icon: "❌",
    tone: "#fee2e2",
    text: "Not ready yet",
    detail: "Submit more assignments and this will change.",
  };
};
