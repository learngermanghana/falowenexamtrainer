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

/**
 * Translate a visibly labeled *course draft*, never imply the recording's words
 * or timings have been checked. The draft is independently bound to the exact
 * public MP3 key, lesson level/day, source title and assignment identity.
 */
export function matchingDraftEnglishTranslation(data, track, draft) {
  if (!track?.objectKey || !draft?.referenceOnly || !Array.isArray(data?.drafts)) return null;
  const pack = data.drafts.find(row => row?.source === "course-draft" &&
    row.objectKey === track.objectKey && row.level === track.level &&
    Number(row.day) === Number(track.day) &&
    row.assignmentKey === draft.assignmentKey && row.draftTitle === draft.draftTitle);
  if (!pack || !Array.isArray(pack.lines)) return null;
  const sung = sungGermanLines(draft.lyrics);
  if (!sung.length || sung.length !== pack.lines.length ||
    pack.lines.some((line, i) => !line || line.de !== sung[i] ||
      typeof line.en !== "string" || !line.en.trim())) return null;
  return pack;
}
