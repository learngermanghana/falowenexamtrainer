// Public information and admissions pages only; never mount in learner lessons,
// signed-in exams, onboarding or authentication forms.
export function isPublicVisitorPath(pathname) {
  const path = String(pathname || '/').replace(/\/+$/, '') || '/';
  return path === '/' || /^(?:\/(?:placement-test|books|book|classes|courses|exam-practice|reviews|help|visitor-guide|videos|music)(?:\/|$)|\/learn-german-(?:ghana|nigeria|sierra-leone|africa|a1|a2|b1|b2|c1|c2)(?:\/|$)|\/goethe-(?:a1|a2|b1|b2|c1|c2)-preparation$|\/mock\/(?:register|checkout|complete|free-hoeren)$|\/(?:german-a[12]-mock-test|a1-listening-practice)(?:\.html)?$)/i.test(path);
}
