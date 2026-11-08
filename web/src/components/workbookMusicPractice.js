// Workbook music listening is optional, not graded, and only reports actual playback.
// One start and at most one progress + one completion write per session; no timers
// or per-second network requests. Private Hören audio is never passed here.
const SONG_ID = /^[a-zA-Z0-9_-]{1,245}$/;
export const MIN_WORKBOOK_PROGRESS_SECONDS = 15;

export function createWorkbookMusicPracticeTracker({ trackId, title, level, day, send, now = () => Date.now() }) {
  const valid = SONG_ID.test(String(trackId || '')) && typeof send === 'function';
  let started = false, playing = false, progressWritten = false;
  let lastPosition = 0, lastWall = 0, listened = 0, reported = 0;

  const report = (kind, seconds = 0) => {
    if (!valid) return;
    try {
      const result = send({
        kind, trackId, title, level, day, source: 'workbook',
        seconds: Math.min(600, Math.max(0, Math.floor(seconds))),
      });
      // Reporting must never block or break workbook playback.
      if (result && typeof result.catch === 'function') result.catch(() => {});
    } catch { /* best effort */ }
  };
  const position = value => Number.isFinite(Number(value)) && Number(value) >= 0 ? Number(value) : 0;
  const sample = value => {
    if (!playing) return;
    const current = position(value);
    const wall = now();
    const mediaDelta = current - lastPosition;
    const wallDelta = Math.max(0, (wall - lastWall) / 1000);
    // Scrubbing forwards is not listened time, even if it triggers timeupdate.
    if (mediaDelta > 0 && mediaDelta <= wallDelta + 1.5) listened += mediaDelta;
    lastPosition = current;
    lastWall = wall;
  };
  const flushProgressOnce = () => {
    if (!started || progressWritten || listened < MIN_WORKBOOK_PROGRESS_SECONDS) return;
    const seconds = Math.min(600, Math.floor(listened));
    if (seconds < MIN_WORKBOOK_PROGRESS_SECONDS) return;
    report('progress', seconds);
    reported = seconds;
    progressWritten = true;
  };
  return {
    play(value = 0) {
      if (!valid || playing) return;
      if (!started) {
        started = true;
        report('start');
      }
      playing = true;
      lastPosition = position(value);
      lastWall = now();
    },
    timeUpdate(value) { sample(value); },
    seeked(value) { lastPosition = position(value); lastWall = now(); },
    pause(value = lastPosition) {
      if (!playing) return;
      sample(value);
      playing = false;
      flushProgressOnce();
    },
    ended(value = lastPosition, duration = 0) {
      if (!started) return;
      sample(value);
      playing = false;
      const total = position(duration);
      // An "ended" event after skipping to the end is not a full listen.
      const complete = total > 0
        ? listened >= total * 0.8
        : listened >= 30;
      if (complete) report('complete', Math.max(0, listened - reported));
      else flushProgressOnce();
      started = false;
      progressWritten = false;
      listened = 0;
      reported = 0;
    },
    stop() {
      if (playing) {
        sample(lastPosition);
        playing = false;
      }
      flushProgressOnce();
    },
  };
}
