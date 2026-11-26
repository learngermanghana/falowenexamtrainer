// Day 29 diagnostic guidance only; does not change official assessment or persisted scores.
export const B2_MOCK_REVIEW_PLANS = Object.freeze({
  lesen: { label: "Lesen", days: ["Review incorrect answers and underline supporting evidence in the reading text.", "Practise paraphrases, distractors and text connections in a fresh reading exercise.", "Complete timed reading practice without a dictionary; review errors."] },
  hoeren: { label: "Hören", days: ["Review mistakes against the transcript after the listening exercise.", "Practise listening for key details, contrasts and speaker intentions using new audio.", "Complete fresh timed listening practice with the prescribed playback limits."] },
  schreiben: { label: "Schreiben", days: ["Review both writing tasks and identify missing content points, register and grammar errors.", "Write a fresh forum post and formal message; revise connectors and paragraph structure.", "Practise both tasks in 75 minutes and review feedback."] },
  sprechen: { label: "Sprechen", days: ["Review speaking feedback and prepare a clear position with reasons and examples.", "Practise a short presentation and a discussion with follow-up questions.", "Simulate preparation and speaking under timed conditions; seek tutor feedback."] }
});
export function getB2MockReviewPlans(sectionScores = {}) {
  return Object.entries(B2_MOCK_REVIEW_PLANS).filter(([key]) => typeof sectionScores[key] === "number" && Number.isFinite(sectionScores[key]) && sectionScores[key] < 15).map(([key, plan]) => ({ key, ...plan }));
}
