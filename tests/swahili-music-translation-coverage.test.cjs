import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const catalog = require('../web/public/music/swahili-catalog.json');
const lyrics = require('../web/public/music/approved-recording-lyrics.json');
const translations = require('../web/public/music/english-translations.json');
const stories = require('../web/public/music/song-stories.json');
const { withEnglishTranslation } = require('../server/musicLyrics.cjs');

test('every published Swahili song has a matching English translation and bilingual description', () => {
  for (const track of catalog.tracks) {
    const pack = lyrics.recordings.find(row => row.objectKey === track.objectKey);
    assert.ok(pack, track.id + ' needs published lyrics');
    const enriched = withEnglishTranslation({...pack});
    const sung = pack.lyrics.split(/\r?\n/).map(line => line.trim())
      .filter(line => line && !/^\[.*\]$/.test(line));
    assert.equal(enriched.englishTranslation?.lines.length, sung.length, track.id);
    assert.ok(enriched.englishTranslation.lines.every((line, index) =>
      line.de === sung[index] && line.en.trim()), track.id);
    const story = stories.byObjectKey[track.objectKey];
    for (const field of ['storyDe', 'storyEn', 'focusDe', 'focusEn'])
      assert.ok(story?.[field]?.trim(), track.id + ' missing ' + field);
    assert.ok(translations.recordings.some(row => row.objectKey === track.objectKey));
  }
});
