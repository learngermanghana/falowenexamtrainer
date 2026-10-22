const clean = value => String(value || '').trim();
const steps = ['Your account', 'Your learning', 'Contact details'];

// Only explicit form state belongs in a support request. Marketing attribution
// can contain a featured video or an earlier visit and is not a reported issue.
export function buildApplicationSupportMessage({ name, level, className, step, error, problem } = {}) {
  const stepNumber = Number(step);
  return [
    'Hello Falowen, I need help with my application.',
    clean(name) && `Name: ${clean(name)}.`,
    clean(level) && `Level: ${clean(level)}.`,
    clean(className) && `Class: ${clean(className)}.`,
    steps[stepNumber - 1] ? `Current step: ${stepNumber} of 3 — ${steps[stepNumber - 1]}.` : 'Current page: application form.',
    clean(error) ? `Error shown: ${clean(error)}` : 'No error message is currently displayed.',
    clean(problem) ? `Help needed: ${clean(problem)}` : 'Please help me complete this step. I have not described the problem yet.',
  ].filter(Boolean).join('\n');
}
