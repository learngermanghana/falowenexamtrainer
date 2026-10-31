// Untimed recordings scroll their *page* with progress. This helper is not
// lyric alignment: never create synthetic start/end cues from this position.
export function approximateScrollTop(currentTime, duration, scrollHeight, viewportHeight) {
  if (![currentTime,duration,scrollHeight,viewportHeight].every(Number.isFinite)) return null;
  if (duration <= 0 || currentTime < 0 || scrollHeight < 0 || viewportHeight <= 0) return null;
  const maxScroll = Math.max(0, scrollHeight - viewportHeight);
  // Reserve a little space for song intros and for reading the closing lines.
  const progress = Math.min(1, Math.max(0, (currentTime / duration - 0.05) / 0.88));
  return Math.round(maxScroll * progress);
}
