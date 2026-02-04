const normalizeNotificationStatus = (status) => {
  const normalized = String(status || "").toLowerCase().trim();
  if (!normalized || normalized === "default") return "idle";
  if (normalized === "denied") return "blocked";
  if (["granted", "pending", "blocked", "stale", "error", "idle"].includes(normalized)) {
    return normalized;
  }
  return "idle";
};

const getNotificationStatusLabel = (status) => {
  const normalized = normalizeNotificationStatus(status);
  switch (normalized) {
    case "granted":
      return "Push on";
    case "pending":
      return "Enabling";
    case "blocked":
      return "Blocked";
    case "stale":
      return "Needs refresh";
    case "error":
      return "Error";
    default:
      return "Off";
  }
};

const shouldPromptForPush = (status) => {
  const normalized = normalizeNotificationStatus(status);
  return normalized !== "granted" && normalized !== "pending";
};

export { getNotificationStatusLabel, normalizeNotificationStatus, shouldPromptForPush };
