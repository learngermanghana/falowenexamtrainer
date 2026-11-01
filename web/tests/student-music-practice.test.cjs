const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = name => fs.readFileSync(path.join(__dirname, '..', name), 'utf8');

test('only authenticated Campus host associates iframe song events with a student', () => {
  const child = read('public/music/app.js');
  const campus = read('src/components/CampusMusicPage.js');
  assert.match(child, /if \(!embedded \|\| window\.parent === window/);
  assert.match(child, /window\.parent\.postMessage/);
  assert.match(child, /signalCampusPractice\("complete", current\)/);
  assert.match(child, /signalCampusPractice\("quiz", selected\)/);
  assert.match(campus, /event\.origin !== window\.location\.origin/);
  assert.match(campus, /event\.source !== frameRef\.current\?\.contentWindow/);
  assert.match(campus, /recordMusicPractice\(activity\)/);
  assert.doesNotMatch(child, /getIdToken\(/);
});

test('direct lesson players use account-only reporter; public GA4 remains anonymous', () => {
  for (const file of ['src/components/WorkbookDayMusic.jsx', 'src/components/FalowenLessonMusic.jsx']) {
    const source = read(file);
    assert.match(source, /recordMusicPractice/);
    assert.match(source, /event: "play"/);
    assert.match(source, /event: "complete"/);
  }
  const service = read('src/services/musicPracticeService.js');
  assert.match(service, /auth\?\.currentUser/);
  assert.match(service, /getIdToken\(/);
  assert.match(service, /music-analytics\/practice/);
  const ga = read('public/music/analytics.js');
  assert.match(ga, /get\('embedded'\) === '1'\) return/);
  assert.doesNotMatch(ga, /studentId|studentEmail|user_id|auth\.currentUser/);
});
