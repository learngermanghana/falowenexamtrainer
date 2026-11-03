import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { matchingDraftEnglishTranslation, matchingEnglishTranslation, sungGermanLines } from '../web/public/music/english-translations.js';

const require = createRequire(import.meta.url);
const { createLyricsHandler, withEnglishTranslation, validateEstimate } = require('../server/musicLyrics.cjs');
const translations = require('../web/public/music/english-translations.json');
const estimates = require('../web/public/music/estimated-timings.json');
const studio = require('../web/public/music/studio-drafts.json');
const key = 'music/a1/day-16/So bestelle ich mein Essen.mp3';
const record = estimates.recordings.find(row => row.objectKey === key);
const row = translations.drafts.find(entry => entry.objectKey === key);
const track = { objectKey: key, level: 'A1', day: 16 };

test('A1 Day 16 has all 17 English lines for exact So bestelle ich published audio', () => {
  const draft = studio.tracks.find(entry => entry.assignmentKey === 'A1-9');
  assert.ok(record && row && draft);
  assert.equal(record.referenceOnly, true);
  assert.equal(record.assignmentKey, 'A1-9');
  assert.equal(record.draftTitle, 'Kein Fleisch, bitte');
  assert.equal(record.lyrics, draft.lyrics);
  assert.equal(row.source, 'course-draft');
  assert.equal(row.assignmentKey, 'A1-9');
  assert.equal(row.draftTitle, 'Kein Fleisch, bitte');
  assert.equal(row.lines.length, 17);
  assert.deepEqual(row.lines.map(x => x.de), sungGermanLines(record.lyrics));
  assert.ok(row.lines.every(x => typeof x.en === 'string' && x.en.trim()));
  assert.equal(matchingDraftEnglishTranslation(translations, track, record), row);
  assert.equal(matchingEnglishTranslation(translations, key, record.lyrics), null,
    'the reference draft must not be promoted to an owner-approved transcript');
});

test('A1 Day 16 translation never leaks to another song or changed German lyrics', () => {
  assert.equal(matchingDraftEnglishTranslation(translations, {...track,objectKey:key+'.other'},record),null);
  assert.equal(matchingDraftEnglishTranslation(translations,track,{...record,lyrics:record.lyrics+'\nNew line.'}),null);
  assert.equal(matchingDraftEnglishTranslation(translations,track,{...record,draftTitle:'Wrong draft'}),null);
  assert.equal(matchingDraftEnglishTranslation(translations,track,{...record,referenceOnly:false}),null);
});

test('public lyrics API supplies A1 Day 16 English alongside estimated timing', async () => {
  assert.ok(validateEstimate(record,key,null));
  const bound = withEnglishTranslation(record);
  assert.equal(bound.englishTranslation?.source, 'course-draft');
  const res = {setHeader(){},status(code){this.code=code;return this;},json(body){this.body=body;return this;}};
  await createLyricsHandler({fetchImpl:async()=>new Response('',{status:404})})(
    {method:'GET',query:{key}},res);
  assert.equal(res.code,200);
  assert.equal(res.body.objectKey,key);
  assert.equal(res.body.referenceOnly,true);
  assert.equal(res.body.englishTranslation?.lines.length,17);
  assert.deepEqual(res.body.englishTranslation.lines,row.lines);
});
