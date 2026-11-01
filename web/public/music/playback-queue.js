// Shuffle a snapshot of the selected list without changing the catalogue.
export function buildPlaybackQueue(tracks, currentId, shuffle = false, random = Math.random) {
  const unique = [...new Map(tracks.map(track => [track.id, track])).values()];
  if (!shuffle || unique.length < 2) return unique;
  const current = unique.find(track => track.id === currentId);
  const remaining = unique.filter(track => track.id !== currentId);
  for (let i = remaining.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
  }
  return current ? [current, ...remaining] : remaining;
}

/**
 * Advance a finite playlist without relying on timers (which browsers suspend
 * when a phone locks). A shuffled cycle does not immediately replay the last
 * song, and a missing current ID safely starts from the first/last entry.
 */
export function advancePlaybackQueue(queue, currentId, direction = 1, shuffle = false, random = Math.random) {
  const tracks = [...new Map(queue.map(track => [track.id, track])).values()];
  if (!tracks.length) return { queue: [], track: null };
  let index = tracks.findIndex(track => track.id === currentId);
  if (index < 0) return { queue: tracks, track: direction < 0 ? tracks[tracks.length - 1] : tracks[0] };
  if (shuffle && direction > 0 && index === tracks.length - 1 && tracks.length > 1) {
    const nextQueue = buildPlaybackQueue(tracks, currentId, true, random);
    return { queue: nextQueue, track: nextQueue[1] };
  }
  return {
    queue: tracks,
    track: tracks[(index + direction + tracks.length) % tracks.length],
  };
}
