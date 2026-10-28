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
