// Guard against silently losing timed A1 answers when cloud draft hydration
// or conflict resolution has not completed at 00:00. A disabled submit
// button may be the ungraded completion checklist; when the real cloud draft
// is ready, requestSubmit() can bypass that presentation-only disabled state.
export function shouldDispatchA1TimedAutoSubmit({
  formAvailable = false,
  cloudDraftReady = false,
  draftLoaded = false,
  draftConflict = false,
  finalState = "idle",
} = {}) {
  return Boolean(formAvailable && cloudDraftReady
    && draftLoaded && !draftConflict
    && !["saving", "verified"].includes(String(finalState || "").toLowerCase()));
}
