// A running Live Speak session is owned by the backend. Lesson changes affect
// only the NEXT session, not the topic or level of the current conversation.
const topic = (value) => String(value || "").replace(/\s+/g, " ").trim().slice(0, 120);
const level = (value) => String(value || "A2").trim().toUpperCase();
const source = (value) => String(value || "standalone").trim() || "standalone";

export const liveSpeakSessionContext = (savedSession, requested = {}) =>
  savedSession
    ? {
      level: level(savedSession.level),
      topic: topic(savedSession.topic),
      source: source(savedSession.source),
    }
    : {
      level: level(requested.level),
      topic: topic(requested.topic),
      source: source(requested.source),
    };

export const isDifferentLiveSpeakSessionContext = (savedSession, requested = {}) => {
  if (!savedSession) return false;
  const current = liveSpeakSessionContext(savedSession);
  const next = liveSpeakSessionContext(null, requested);
  return (savedSession.examFlow && savedSession.examFlow.mode !== (requested.examMode || "guided")) ||
    (savedSession.examTask?.id || "") !== (requested.examTask?.id || "") ||
    (savedSession.examTask?.courseAssignmentKey || "") !== (requested.examTask?.courseAssignmentKey || "") ||
    (savedSession.examTask?.mockAttemptId || "") !== (requested.examTask?.mockAttemptId || "") ||
    current.level !== next.level ||
    current.topic !== next.topic ||
    current.source !== next.source;
};
