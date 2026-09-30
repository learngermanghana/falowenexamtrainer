export const normalizeTimedAssignmentSession = (
  session,
  durationSeconds,
  now = Date.now(),
) => {
  if (!session) return null;

  const configuredDuration = Math.max(0, Math.floor(Number(durationSeconds) || 0));
  const configuredMs = configuredDuration * 1000;
  const startedAt = Number(session.startedAt) || 0;
  const rawEndsAt = Number(session.endsAt) || 0;

  if (rawEndsAt <= 0) return null;
  if (configuredMs <= 0) return { startedAt, endsAt: rawEndsAt };

  if (startedAt > 0) {
    return {
      startedAt,
      endsAt: Math.min(rawEndsAt, startedAt + configuredMs),
    };
  }

  const cappedEndsAt = Math.min(rawEndsAt, now + configuredMs);
  return {
    startedAt: Math.max(0, cappedEndsAt - configuredMs),
    endsAt: cappedEndsAt,
  };
};

export const getTimedAssignmentRemainingSeconds = (session, durationSeconds, now = Date.now()) => {
  const configuredDuration = Math.max(0, Math.floor(Number(durationSeconds) || 0));
  const normalizedSession = normalizeTimedAssignmentSession(session, durationSeconds, now);
  if (!normalizedSession) return configuredDuration;

  const rawRemaining = Math.max(
    0,
    Math.ceil((Number(normalizedSession.endsAt || 0) - now) / 1000),
  );
  return configuredDuration > 0
    ? Math.min(configuredDuration, rawRemaining)
    : rawRemaining;
};

export default getTimedAssignmentRemainingSeconds;
