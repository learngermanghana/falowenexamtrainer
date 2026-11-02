// iOS WebKit can stop the audio session after a natural "ended" event while
// the page is locked. Keep the native audio element looped and detect its
// time jump back to the start before moving to the next track. No timers,
// secondary silent player, or periodic network activity are needed.
export function createLoopBoundaryDetector(clock = () => Date.now()) {
  let previousTime = 0;
  let nearEnd = false;
  let armed = true;
  let ignoreUntil = 0;

  function reset() {
    previousTime = 0;
    nearEnd = false;
    armed = true;
    ignoreUntil = 0;
  }

  function markUserSeek() {
    // Scrubbing a track from near its end to the beginning is not completion.
    nearEnd = false;
    previousTime = 0;
    ignoreUntil = clock() + 1800;
  }

  function observe(position, duration) {
    if (!Number.isFinite(position) || !Number.isFinite(duration) ||
        duration < 8 || position < 0) return false;

    // Different browsers may skip a few timeupdate events in the background.
    const lastWindow = Math.min(12, Math.max(3, duration * 0.08));
    const atEnd = position >= duration - lastWindow;
    const wrapped = armed && nearEnd && previousTime > duration - lastWindow &&
      position < 1.5 && previousTime - position > 3 && clock() >= ignoreUntil;

    previousTime = position;
    if (wrapped) {
      nearEnd = false;
      armed = false; // Multiple seek/timeupdate events must advance only once.
      return true;
    }
    if (atEnd) nearEnd = true;
    // Once the loop has restarted, re-arm for the next natural completion.
    if (position > 3 && position < duration - lastWindow) {
      nearEnd = false;
      armed = true;
    }
    if (position < 1.5 && !wrapped) nearEnd = false;
    return false;
  }

  return { reset, markUserSeek, observe };
}

export function installLoopHandoff(audio, {
  isActive, shouldAdvance, onComplete, onAdvance, clock = () => Date.now(),
}) {
  const detector = createLoopBoundaryDetector(clock);
  const inspect = () => {
    if (!audio.loop || audio.paused || !isActive()) return;
    if (!detector.observe(audio.currentTime, audio.duration)) return;
    onComplete();
    if (shouldAdvance()) onAdvance();
  };
  for (const event of ["seeking", "seeked", "timeupdate"]) audio.addEventListener(event, inspect);
  for (const event of ["pointerdown", "touchstart", "keydown"]) {
    audio.addEventListener(event, () => detector.markUserSeek(), { passive: true });
  }
  return detector;
}
