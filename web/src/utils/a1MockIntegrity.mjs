// Browser-side exam-integrity signals are review flags, not proof of misconduct.
export const A1_INTEGRITY_TYPES = Object.freeze([
  "tab_hidden", "window_blur", "fullscreen_exit", "paste_attempt", "copy_attempt",
]);
export const A1_INTEGRITY_MESSAGES = Object.freeze({
  tab_hidden: "You left the exam tab. Your teacher can review this incident.",
  window_blur: "The exam window lost focus. Your teacher can review this incident.",
  fullscreen_exit: "You left fullscreen mode. Return to fullscreen to continue normally.",
  paste_attempt: "Pasting is disabled during the A1 mock. Type your own answer.",
  copy_attempt: "Copying exam content is disabled during the A1 mock.",
});
export function appendA1MockIntegrityEvent(previous = {}, type, section, at = Date.now()) {
  if (!A1_INTEGRITY_TYPES.includes(type)) return previous;
  const counts = Object.fromEntries(A1_INTEGRITY_TYPES.map(key => [
    key, Math.max(0, Number(previous?.counts?.[key]) || 0) + (key === type ? 1 : 0),
  ]));
  const events = [...(Array.isArray(previous?.events) ? previous.events : []),
    { type, section: String(section || "").slice(0, 30), at: new Date(at).toISOString() }]
    .slice(-30);
  return { counts, events };
}
