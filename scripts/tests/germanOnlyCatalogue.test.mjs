import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../../', import.meta.url));
test('public catalogue publishes only German A1–C2 and removes old French output', () => {
  execFileSync(process.execPath, ['web/scripts/generate-public-course-catalogue-safe.mjs'], { cwd: root });
  const catalogue = JSON.parse(readFileSync(root + 'web/public/course-catalogue.json', 'utf8'));
  assert.equal(catalogue.courses.length, 6);
  assert.deepEqual(catalogue.courses.map(course => course.slug), ['german-a1', 'german-a2', 'german-b1', 'german-b2', 'german-c1', 'german-c2']);
  assert.ok(catalogue.courses.every(course => course.language === 'German'));
  assert.equal(existsSync(root + 'web/public/courses/french-a1.html'), false);
  for (const file of ['courses/index.html', 'sitemap-courses.xml', 'falowen-course-schedules.md']) {
    assert.doesNotMatch(readFileSync(root + 'web/public/' + file, 'utf8'), /French|french-a1|program=french/);
  }
  assert.ok(existsSync(root + 'web/src/data/frenchCourseSchedule.js'));
});
