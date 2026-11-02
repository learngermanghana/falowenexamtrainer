const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const moduleUrl = '../public/music/background-playback.js';
const file = path.join(__dirname, '../public/music/app.js');
const policy = () => import(moduleUrl);

test('Android Chrome, Samsung Browser, and Brave choose native ended transitions', async () => {
  const {prefersNativeLoop} = await policy();
  for (const ua of [
    'Mozilla/5.0 (Linux; Android 16; Pixel 8) AppleWebKit/537.36 Chrome/150.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 15; SM-S918B) AppleWebKit/537.36 SamsungBrowser/29.0 Chrome/134.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 16) AppleWebKit/537.36 Brave/1.93 Chrome/150.0 Mobile Safari/537.36',
  ]) assert.equal(prefersNativeLoop({userAgent:ua,platform:'Linux armv8l',maxTouchPoints:5}),false);
});

test('iPhones and touch-enabled iPads get native loop-boundary transitions', async () => {
  const {prefersNativeLoop} = await policy();
  assert.equal(prefersNativeLoop({userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X)',platform:'iPhone'}),true);
  assert.equal(prefersNativeLoop({userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X)',platform:'MacIntel',maxTouchPoints:5}),true);
  assert.equal(prefersNativeLoop({userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X)',platform:'MacIntel',maxTouchPoints:0}),false);
});

test('locked Android auto-advances synchronously on ended without a delayed task', async () => {
  const {installEndedHandoff} = await policy();
  const audio = new EventTarget();
  let backgrounded = true, activeTrack = 'A', calls = 0;
  installEndedHandoff(audio,{
    isRepeating: () => false,
    hasMoreTracks: () => true,
    advance: () => { assert.equal(backgrounded,true); activeTrack = 'B'; calls += 1; },
    replay: () => assert.fail('Should advance the playlist'),
  });
  audio.dispatchEvent(new Event('ended'));
  assert.equal(activeTrack,'B');
  assert.equal(calls,1);
});

test('Android repeat one or one-song playlist replays instead of skipping', async () => {
  const {installEndedHandoff} = await policy();
  for(const {repeat,more} of [{repeat:true,more:true},{repeat:false,more:false}]) {
    const audio = new EventTarget();
    let replayed=0;
    installEndedHandoff(audio,{
      isRepeating:()=>repeat,
      hasMoreTracks:()=>more,
      advance:()=>assert.fail('wrong advance'),
      replay:()=>{replayed++},
    });
    audio.dispatchEvent(new Event('ended'));
    assert.equal(replayed,1);
  }
});

test('player starts next song before DOM, history and localStorage updates', () => {
  const src = fs.readFileSync(file,'utf8');
  const start=src.indexOf('function setPlayer(track, start = false)');
  const end=src.indexOf('function populateFeatured()',start);
  assert.ok(start >= 0 && end > start);
  const body=src.slice(start,end);
  const playAt=body.indexOf('if (start) playCurrentTrack()');
  assert.ok(playAt >= 0);
  assert.ok(playAt < body.indexOf('byId("now-title")'));
  assert.ok(playAt < body.indexOf('localStorage.setItem'));
  assert.doesNotMatch(body,/audio\.pause\(/);
  assert.match(src,/syncAudioLoop\(\) \{ audio\.loop = iosLoopMode \|\| byId\("repeat"\)\.checked/);
});
