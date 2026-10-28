import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { signedStudioUrl } = require('../functions/functionz/courseHoerenPublishing.js');

const env = {
 R2_ACCOUNT_ID:'testaccount',
 R2_ACCESS_KEY_ID:'testaccess',
 R2_SECRET_ACCESS_KEY:'testsecret',
 R2_AUDIO_BUCKET:'falowen-course-audio',
};
const now=new Date('2026-10-28T09:00:00.000Z');
test('only exact approved music keys can receive public GET signatures',()=>{
  for(const key of ['music/a1/day-22/mein-kopf-tut-weh.mp3','music/a2/die-karte-funktioniert-nicht.mp3']){
    const url=new URL(signedStudioUrl({method:'GET',key,env,now}));
    assert.equal(url.hostname,'falowen-course-audio.testaccount.r2.cloudflarestorage.com');
    assert.equal(decodeURIComponent(url.pathname.slice(1)),key);
    assert.equal(url.searchParams.get('X-Amz-Expires'),'900');
    assert.ok(url.searchParams.get('X-Amz-Signature'));
    assert.throws(()=>signedStudioUrl({method:'PUT',key,env,now}),/Invalid private/);
  }
  for(const key of ['a2/day-18/bank-telefonat.mp3','a1/day-22/zoom-day-22.mp3',
    'music/a1/day-22/secret.mp3','music/a2/../a2/day-18/bank-telefonat.mp3']){
    assert.throws(()=>signedStudioUrl({method:'GET',key,env,now}),/Invalid private/);
  }
});
test('public approved music route has static track allowlist and no credentials in source',()=>{
  const route=readFileSync(new URL('../api/approved-music.js',import.meta.url),'utf8');
  const catalog=JSON.parse(readFileSync(new URL('../web/public/music/catalog.json',import.meta.url),'utf8'));
  const vercel=JSON.parse(readFileSync(new URL('../vercel.json',import.meta.url),'utf8'));
  assert.equal(catalog.tracks.filter(x=>x.slides===true).length,3);
  assert.ok(catalog.tracks.filter(x=>x.slides===true).every(x=>x.attendance && x.coursebook));
  assert.ok(catalog.tracks.some(x=>x.assignmentKey==='A1-14.1'));
  assert.ok(catalog.tracks.some(x=>x.assignmentKey==='A2-7.18'));
  assert.ok(vercel.routes.some(x=>x.src==='/api/music'&&x.dest==='/api/approved-music.js'));
  assert.match(route,/Object\.prototype\.hasOwnProperty\.call/);
  assert.match(route,/no-store/);
  assert.doesNotMatch(route,/R2_SECRET_ACCESS_KEY\s*:/);
});

test('approved music redirects to the exact Day 4 and corrected Day 18 recordings', async () => {
  const { signTrack } = require('../server/courseMusic.cjs');
  const trackEnv = { ...env, R2_ACCOUNT_ID: 'a'.repeat(32) };
  const signed = signTrack('a1-day-04-numbers', trackEnv, now);
  assert.equal(new URL(signed.url).pathname, '/music/a1/day-04/welche-nummer-hast-du.mp3');
  assert.throws(() => signTrack('music/a1/day-04/other.mp3', env), /Unknown/);
  const previous = Object.fromEntries(Object.keys(env).map(key => [key, process.env[key]]));
  Object.assign(process.env, trackEnv);
  try {
    const handler = require('../api/approved-music.js');
    for (const [track, path] of [['a1-day-04-numbers','/music/a1/day-04/welche-nummer-hast-du.mp3'], ['a2-day-18-bank','/music/a2/day-18/die-karte-funktioniert-nicht.mp3'], ['r2-a2-day-19-lieber-online-oder-im-laden','/music/a2/day-19/lieber-online-oder-im-laden.mp3'], ['r2-a2-day-20-b64_SMO2ZmxpY2ggcmVrbGFtaWVyZW4ubXAz', '/music/a2/day-20/H%C3%B6flich%20reklamieren.mp3']]) {
    const res = { headers: {}, setHeader(k,v) { this.headers[k]=v; }, status(code) { this.code=code; return this; }, end() {}, json(body) { this.body=body; return this; } };
    await handler({ method: 'GET', query: { track } }, res);
    assert.equal(res.code, 302);
    assert.equal(res.headers['Cache-Control'], 'no-store');
    const url = new URL(res.headers.Location);
    assert.equal(url.pathname, path);
    assert.ok(url.searchParams.get('X-Amz-Signature'));
    }
  } finally {
    for (const [key,value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]; else process.env[key]=value;
    }
  }
});
