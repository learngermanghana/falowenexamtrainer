const labelOf = (item) => {
  if (!item) return "";
  if (typeof item === "string") return item;
  return item.label || item.identifier || item.assignment || "";
};

const pluralize = (count, singular, plural) => (count === 1 ? singular : plural);

export const computeCertificateReadiness = ({
  loading = false,
  scoreSummary = null,
  t = (_key, { defaultValue }) => defaultValue,
} = {}) => {
  const failedAssignments = scoreSummary?.failedAssignments || [];
  const missedAssignments = scoreSummary?.missedAssignments || [];
  const failedIdentifiers = scoreSummary?.failedIdentifiers || [];
  const blocked = Boolean(scoreSummary?.recommendationBlocked);
  const firstFailed = labelOf(failedAssignments[0]) || failedIdentifiers[0] || "";
  // Never call a learner certificate-ready solely because nothing is "missed":
  // the final Day 23 mock cannot be missed until someone has reached it.
  const required = Number(scoreSummary?.totalAssignments);
  const completed = Number(scoreSummary?.completedCount);
  const hasCounts = scoreSummary?.totalAssignments != null
    && scoreSummary?.completedCount != null
    && Number.isFinite(required) && required > 0 && Number.isFinite(completed);


  if (loading) {
    return {
      state: "loading",
      label: t("examReadiness.certificate.stateChecking", { defaultValue: "Checking..." }),
      detail: t("examReadiness.certificate.detailLoading", { defaultValue: "Loading assignment progress" }),
      pillBg: "#e5e7eb",
      pillBorder: "#d1d5db",
      pillText: "#111827",
      canResolve: false,
    };
  }

  if (!scoreSummary) {
    return {
      state: "needs_sync",
      label: t("examReadiness.certificate.stateNeedsSync", { defaultValue: "Needs sync" }),
      detail: t("examReadiness.certificate.detailNeedsSync", { defaultValue: "No score summary yet" }),
      pillBg: "#e5e7eb",
      pillBorder: "#d1d5db",
      pillText: "#111827",
      canResolve: false,
    };
  }

  if (failedAssignments.length > 0 || blocked) {
    const count = failedAssignments.length;
    const countLabel = t("examReadiness.certificate.failedCount", {
      count,
      defaultValue: `${count} ${pluralize(count, "failed item", "failed items")}`,
    });
    const detail = firstFailed
      ? t("examReadiness.certificate.detailBlockedWithItem", {
          count,
          item: firstFailed,
          countLabel,
          defaultValue: `${countLabel}: ${firstFailed}`,
        })
      : t("examReadiness.certificate.detailBlocked", {
          count,
          countLabel,
          defaultValue: `${countLabel}. Resolve failed tasks to unlock certificate eligibility.`,
        });

    return {
      state: "blocked",
      label: t("examReadiness.certificate.stateBlocked", { defaultValue: "Blocked" }),
      detail,
      pillBg: "#fee2e2",
      pillBorder: "#fecaca",
      pillText: "#991b1b",
      canResolve: true,
    };
  }

  if (missedAssignments.length > 0 || (hasCounts && completed < required)) {
    const count = Math.max(missedAssignments.length, hasCounts ? required - completed : 0);
    const firstMissed = labelOf(missedAssignments[0]);
    const detail = firstMissed
      ? t("examReadiness.certificate.detailIncompleteWithItem", {
          count,
          item: firstMissed,
          defaultValue: `${count} missed items: ${firstMissed}`,
        })
      : t("examReadiness.certificate.detailIncomplete", {
          count,
          defaultValue: `${count} missed items. Complete them to unlock certificate eligibility.`,
        });

    return {
      state: "incomplete",
      label: t("examReadiness.certificate.stateIncomplete", { defaultValue: "Incomplete" }),
      detail,
      pillBg: "#fef3c7",
      pillBorder: "#fde68a",
      pillText: "#92400e",
      canResolve: true,
    };
  }

  return {
    state: "ready",
    label: t("examReadiness.certificate.stateReady", { defaultValue: "Ready" }),
    detail: t("examReadiness.certificate.detailReady", { defaultValue: "No failed or missed assignments" }),
    pillBg: "#dcfce7",
    pillBorder: "#86efac",
    pillText: "#166534",
    canResolve: false,
  };
};
