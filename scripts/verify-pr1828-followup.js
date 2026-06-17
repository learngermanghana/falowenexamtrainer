const fs = require('fs');
const path = require('path');
const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const files = [];
const walk = (dir) => fs.readdirSync(path.join(root, dir), { withFileTypes: true }).forEach((entry) => {
  const rel = path.join(dir, entry.name);
  if (entry.isDirectory()) return walk(rel);
  if (/WorkbookPage\.js$/.test(entry.name)) files.push(rel);
});
walk('web/src/components');
const withRefs = files.filter((file) => read(file).includes('WorkbookReferenceAnswers'));
for (const file of withRefs) {
  const src = read(file);
  assert(src.includes('key: "references"'), `${file} renders references without a tab`);
  assert(src.includes('5. Ref') || src.includes('5. References'), `${file} missing Ref tab label`);
}
assert(!read('web/src/components/WorkbookReferenceAnswers.js').includes('Reference Answers'), 'static Reference Answers label remains');
assert(read('web/src/components/WorkbookReferenceAnswers.js').includes('initialTab="references"'), 'Ref wrapper does not use WritingPage references');
assert(read('web/src/components/selfLearning/SelfLearningTabbedLessonPage.js').includes('["ref", "5. Ref"]'), 'B2/C1 lesson page does not expose Ref as tab 5');
assert(read('web/src/data/advancedWritingProgression.js').includes('FULL_ESSAY_START_DAY = 21'), 'full essay mode must start on day 21');
assert(read('web/src/lib/writingFeedbackNormalizer.js').includes('JSON.parse') && !read('web/src/lib/writingFeedbackNormalizer.js').includes('eval('), 'normalizer must parse without eval');
assert(!/allow read, write: if request\.auth != null/.test(read('firestore.rules')), 'permissive Firestore catch-all still present');
console.log(`Verified ${withRefs.length} workbook Ref tabs and PR #1828 follow-up invariants.`);
