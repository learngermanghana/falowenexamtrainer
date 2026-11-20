import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { matchingEnglishTranslation, sungGermanLines } from '../web/public/music/english-translations.js';

const require = createRequire(import.meta.url);
const { createLyricsHandler } = require('../server/musicLyrics.cjs');
const { musicTrackFromKey } = require('../server/musicDiscovery.cjs');
const translations = require('../web/public/music/english-translations.json');
const studio = require('../web/public/music/studio-drafts.json');
const key = 'music/a1/day-16/Ich möchte Suppe.mp3';
const oldKey = 'music/a1/day-16/So bestelle ich mein Essen.mp3';

test('Day 16 resolves only the replacement recording for the restaurant lesson', () => {
  assert.equal(musicTrackFromKey(oldKey),null);
  assert.equal(musicTrackFromKey(key).assignmentKey,'A1-9');
});

test('public lyrics, English and estimated line timings follow the full recorded performance', async () => {
  const res = {setHeader(){},status(code){this.code=code;return this;},json(body){this.body=body;return this;}};
  await createLyricsHandler({fetchImpl:async()=>new Response('',{status:404})})(
    {method:'GET',query:{track:musicTrackFromKey(key).id}},res);
  assert.equal(res.code,200);
  const pack=res.body;
  assert.equal(pack.objectKey,key);
  assert.equal(pack.timingStatus,'estimated');
  assert.equal(pack.recordingSha256,'e85d34c0127fce862f9c982f9fe50eac87d1251537a7da60f2090f7fe77e6200');
  assert.equal(pack.lyrics,studio.tracks.find(row=>row.assignmentKey==='A1-9').lyrics);
  const lines=sungGermanLines(pack.lyrics);
  assert.equal(lines.length,84);
  assert.deepEqual(pack.cues.map(cue=>cue.text),lines);
  assert.ok(pack.cues.every((cue,i)=>cue.start>=0 && cue.end>cue.start && cue.end<=237.192 && (!i || cue.start>=pack.cues[i-1].end)));
  assert.deepEqual(pack.englishTranslation.lines,matchingEnglishTranslation(translations,key,pack.lyrics).lines);
  assert.equal(matchingEnglishTranslation(translations,oldKey,pack.lyrics),null);
  assert.equal(matchingEnglishTranslation(translations,key,pack.lyrics+'\nAnders.'),null);
});
