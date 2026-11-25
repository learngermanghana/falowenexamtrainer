const test = require('node:test');
const assert = require('node:assert/strict');
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

test('Day 12 practice is served only with the matching public song lyrics', async () => {
  const { createLyricsHandler } = require('../server/musicLyrics.cjs');
  const handler = createLyricsHandler({ env: {} });
  async function request(query) {
    const res = {
      setHeader() {},
      status(code) { this.code = code; return this; },
      json(body) { return { code: this.code, body }; },
    };
    return handler({ method: 'GET', query }, res);
  }
  const track = catalog.tracks.find(row => row.id === 'swahili-a1-day-12');
  for (const query of [{ track: track.id }, { key: track.objectKey }]) {
    const { code, body } = await request(query);
    assert.equal(code, 200);
    assert.equal(body.objectKey, track.objectKey);
    assert.match(body.lyrics, /Nina miadi Alhamisi/);
    assert.equal(body.practiceQuestions.length, 7);
    assert.match(body.practiceQuestions[5].answer, /Alhamisi, tarehe ishirini mwezi wa Agosti/);
  }
  const other = await request({ track: 'swahili-a1-day-11' });
  assert.equal(other.body.practiceQuestions, undefined);
  const horen = await request({ key: 'swahili/A1/day-12/day-12.mp3' });
  assert.equal(horen.code, 404);
});
