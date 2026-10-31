import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { approximateScrollTop } from '../web/public/music/follow-lyrics.js';
import { validateCues, activeLyricIndex } from '../web/public/music/lyrics-timing.js';

test('untimed song scroll follows duration without inventing line cues', () => {
  assert.equal(approximateScrollTop(0, 139, 1000, 500), 0);
  assert.equal(approximateScrollTop(70, 139, 1000, 500) > 200, true);
  assert.equal(approximateScrollTop(139, 139, 1000, 500), 500);
  assert.equal(approximateScrollTop(35, NaN, 1000, 500), null);
  assert.equal(approximateScrollTop(35, 139, 500, 500), 0);
  assert.deepEqual(validateCues([], '[Verse 1]\\nHallo'), []);
  assert.equal(activeLyricIndex([], 10), -1);
});
test('A1 A2 B1 Follow lyrics stays enabled with honest approximate label when cues are missing', () => {
  const app=readFileSync('web/public/music/app.js','utf8');
  const html=readFileSync('web/public/music/index.html','utf8');
  assert.match(app, /byId\("follow-lyrics"\)\.disabled = false/);
  assert.match(app, /Follow lyrics \(approximate scroll\)/);
  assert.match(app, /COURSE DRAFT — These lyrics have not been checked/);
  assert.match(app, /approximateScrollTop\(audio\.currentTime, audio\.duration/);
  assert.match(html, /id="follow-label"/);
  assert.doesNotMatch(app, /renderedCues = \[\{start:/);
});
