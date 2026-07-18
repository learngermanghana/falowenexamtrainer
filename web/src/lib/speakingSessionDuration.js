export const CUSTOM_SPEAKING_CHAT_DURATION_OPTIONS = [10, 20, 30];
export const DEFAULT_CUSTOM_SPEAKING_CHAT_DURATION_MINUTES = 10;

export function normalizeSpeakingChatDurationMinutes(value) {
  const minutes = Number(value);
  return CUSTOM_SPEAKING_CHAT_DURATION_OPTIONS.includes(minutes)
    ? minutes
    : DEFAULT_CUSTOM_SPEAKING_CHAT_DURATION_MINUTES;
}

export function speakingChatSessionSeconds(value) {
  return normalizeSpeakingChatDurationMinutes(value) * 60;
}
