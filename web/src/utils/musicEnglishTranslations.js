// Shared contract: only an exact, published object key AND every identical
// German sung line authorize displaying an editor-authored English translation.
// Never use this with studio-only drafts or infer English from another song/day.
export function sungGermanLines(lyrics = "") {
  return String(lyrics || "").replace(/\\n/g, "\n").split(/\r?\n/)
    .map(line => line.trim()).filter(line => line && !/^\[.*\]$/.test(line));
}
export function matchingEnglishTranslation(data, objectKey, lyrics) {
  if (!objectKey || !lyrics || !Array.isArray(data?.recordings)) return null;
  const pack = data.recordings.find(row => row?.objectKey === objectKey);
  const sung = sungGermanLines(lyrics);
  if (!pack || !Array.isArray(pack.lines) || sung.length === 0 || sung.length !== pack.lines.length) return null;
  if (pack.lines.some((item, i) => !item || item.de !== sung[i] || typeof item.en !== "string" || !item.en.trim())) return null;
  return pack;
}

// Automatic words need their own translation, bound to fingerprint and text.
export function matchingTranscriptEnglishTranslation(data, track, pack) {
  if (!track?.objectKey || pack?.objectKey !== track.objectKey || pack.transcriptionStatus !== 'automatic' || !/^[a-f0-9]{64}$/.test(pack.recordingSha256 || '')) return null;
  const row = data?.transcripts?.find(item => item.source === 'automatic-transcript' && item.objectKey === track.objectKey && item.recordingSha256 === pack.recordingSha256);
  const lines = sungGermanLines(pack.lyrics);
  return row && lines.length && row.lines?.length === lines.length && row.lines.every((item,i) => item.de === lines[i] && typeof item.en === 'string' && item.en.trim()) ? row : null;
}
