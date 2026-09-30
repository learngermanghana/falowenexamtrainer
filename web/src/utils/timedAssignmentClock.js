export const getTimedAssignmentRemainingSeconds = (session, durationSeconds, now = Date.now()) => {
  const configuredDuration = Math.max(0, Math.floor(Number(durationSeconds) || 0));
  if (!session) return configuredDuration;

  const rawRemaining = Math.max(0, Math.ceil((Number(session.endsAt || 0) - now) / 1000));
  return configuredDuration > 0
    ? Math.min(configuredDuration, rawRemaining)
    : rawRemaining;
};

export default getTimedAssignmentRemainingSeconds;
