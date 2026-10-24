// Registration uses the real mounted assessment, so aliases and lesson routes work too.
const assessments = new Set();
const listeners = new Set();
const notify = () => listeners.forEach((listener) => listener());

export const ASSESSMENT_RULES = "Complete this assessment independently. StudyBuddy, translators, dictionaries and outside help are not allowed.";

export function registerAssessmentRestriction() {
  const id = Symbol("assessment");
  assessments.add(id);
  notify();
  return () => {
    if (assessments.delete(id)) notify();
  };
}

export const isAssessmentRestricted = () => assessments.size > 0;
export const subscribeAssessmentRestrictions = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function isMockAssessmentRoute(pathname = "") {
  const path = String(pathname).toLowerCase().replace(/\/+$/, "");
  return /^\/campus\/course\/(?:a1|a2|b1|b2|c1|c2)-(?:final-mock(?:-exam|-[0-9]+)|mock-)/.test(path)
    || ["/campus/course/conjunctions-5-10", "/campus/course/a2-day-29-goethe-exam-orientation", "/campus/course/b1-day-29-goethe-exam-orientation"].includes(path);
}
