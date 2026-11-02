// Choose the least fragile transition event for the actual mobile browser.
// Android Chromium emits the ordinary media "ended" event for track handoffs;
// keeping loop=true there would suppress that event and could strand the queue.
// iOS WebKit may close its audio session at ended, so it uses native-loop wrap.
export function prefersNativeLoop({userAgent = "", platform = "", maxTouchPoints = 0} = {}) {
  return /iPhone|iPad|iPod/i.test(userAgent) ||
    (/Mac/i.test(platform) && Number(maxTouchPoints) > 1);
}

export function installEndedHandoff(audio, { isRepeating, hasMoreTracks, advance, replay }) {
  const onEnded = () => {
    // The synchronous callback is important on a locked Android phone. Do not
    // wait for metadata, a timer, a promise or an API call before audio.play().
    if (isRepeating() || !hasMoreTracks()) replay();
    else advance();
  };
  audio.addEventListener("ended", onEnded);
  return onEnded;
}
