import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { matchingTranscriptEnglishTranslation } from '../web/public/music/english-translations.js';
const require = createRequire(import.meta.url);
const translations = require('../web/public/music/english-translations.json');
const estimates = require('../web/public/music/estimated-timings.json').recordings;
const approved = require('../web/public/music/approved-recording-lyrics.json').recordings;
const { validateEstimate, withEnglishTranslation } = require('../server/musicLyrics.cjs');

test('every valid estimated recording has complete exact-line English, including automatic transcripts', () => {
  let checked = 0;
  for (const raw of estimates) {
    const pack = validateEstimate(raw, raw.objectKey, approved.find(row => row.objectKey === raw.objectKey));
    if (!pack) continue; // An owner-replaced recording invalidates its older estimate.
    const result = withEnglishTranslation(pack);
    assert.ok(result.englishTranslation, `Missing English: ${raw.objectKey}`);
    const lines = pack.lyrics.split(/\r?\n/).map(s => s.trim()).filter(s => s && !/^\[.*\]$/.test(s));
    assert.deepEqual(result.englishTranslation.lines.map(row => row.de), lines, raw.objectKey);
    assert.ok(result.englishTranslation.lines.every(row => row.en.trim()), raw.objectKey);
    if (pack.transcriptionStatus === 'automatic') {
      assert.equal(result.englishTranslation.source, 'automatic-transcript');
      assert.ok(matchingTranscriptEnglishTranslation(translations, {objectKey: pack.objectKey}, pack));
      assert.equal(matchingTranscriptEnglishTranslation(translations, {objectKey: pack.objectKey}, {...pack, recordingSha256:'0'.repeat(64)}), null);
      assert.equal(matchingTranscriptEnglishTranslation(translations, {objectKey: pack.objectKey}, {...pack, lyrics: pack.lyrics+'\nChanged words'}), null);
    }
    checked++;
  }
  assert.ok(checked >= 40, `Unexpected coverage regression: ${checked}`);
});
