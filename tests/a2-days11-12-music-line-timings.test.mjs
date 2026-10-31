import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const approved = JSON.parse(readFileSync('web/public/music/approved-recording-lyrics.json', 'utf8'));
const catalog = JSON.parse(readFileSync('web/public/music/catalog.json', 'utf8'));
const drafts = JSON.parse(readFileSync('web/public/music/studio-drafts.json', 'utf8'));
const { validateLyrics, createLyricsHandler } = require('../server/musicLyrics.cjs');
const published = [
  {key:'music/a2/day-11/Mit dem Rad, mit dem Zug.mp3',count:24,sha:'208e3be5013d24a27c17d51b5d5f574fffd9e0df28af6a118a87ec1baef59d1d',duration:141.6},
  {key:'music/a2/day-12/Träume ändern sich.mp3',count:28,sha:'3a0fa44ba3a83261bda42fa23e0759bcda6ba7c518e6af9e35960e80563de281',duration:113.232},
];
const env = {R2_ACCOUNT_ID:'a'.repeat(32),R2_ACCESS_KEY_ID:'test',R2_SECRET_ACCESS_KEY:'test',R2_AUDIO_BUCKET:'test-audio'};
const mkRes=()=>({statusCode:200,setHeader(){return this},status(n){this.statusCode=n;return this},json(body){this.body=body;return this}});

test('Day 11 and Day 12 fingerprint-bound packs cover every sung line in order',()=>{
  for(const {key,count,sha,duration} of published){
    const pack = approved.recordings.find(x=>x.objectKey===key);
    assert.ok(pack, 'missing approved recording '+key);
    assert.equal(pack.recordingSha256,sha);
    assert.equal(pack.duration,duration);
    assert.equal(pack.timingStatus,'estimated');
    assert.equal(pack.cues.length,count);
    assert.deepEqual(validateLyrics(pack,key).cues,pack.cues);
    let previousEnd=-1;
    for(const cue of pack.cues){
      assert.ok(cue.start>previousEnd);
      assert.ok(cue.end>cue.start && cue.end<=duration);
      previousEnd=cue.end;
    }
    assert.ok(catalog.tracks.some(x=>x.objectKey===key && x.approved===true));
  }
});

test('Day 12 public studio text and exact song match the newly uploaded recording',()=>{
  const pack=approved.recordings.find(x=>x.assignmentKey==='A2-5.12');
  const draft=drafts.tracks.find(x=>x.assignmentKey==='A2-5.12');
  const title=catalog.tracks.find(x=>x.assignmentKey==='A2-5.12');
  assert.equal(title.title,'Träume ändern sich');
  assert.equal(draft.title,title.title);
  assert.equal(draft.lyrics,pack.lyrics);
  assert.match(pack.lyrics,/Jetzt interessiert mich die Medizin,/);
  assert.match(pack.lyrics,/Bei Falowen sprechen wir von Träumen,/);
  assert.doesNotMatch(pack.lyrics,/Dein Weg beginnt mit einem kleinen Schritt/);
  const linesBySection=[...pack.lyrics.matchAll(/\[(Verse 1|Verse 2|Chorus|Outro)\]([\s\S]*?)(?=\[(?:Verse 1|Verse 2|Chorus|Outro)\]|$)/g)]
    .map(m=>m[2].split(/\r?\n/).filter(x=>x.trim()).length);
  assert.deepEqual(linesBySection,[8,4,8,4,4]);
});

test('public endpoint serves estimated cues while preserving the priority of teacher-reviewed sidecars',async()=>{
  for(const {key,count} of published){
    const pack=approved.recordings.find(x=>x.objectKey===key);
    const handler=createLyricsHandler({env,fetchImpl:async()=>new Response('',{status:404})});
    const res=mkRes();
    await handler({method:'GET',query:{key}},res);
    assert.equal(res.statusCode,200);
    assert.equal(res.body.cues.length,count);
    assert.equal(res.body.timingStatus,'estimated');
    // Same lyrics but an untimed R2 sidecar must not erase draft cues.
    const empty=createLyricsHandler({env,fetchImpl:async()=>new Response(JSON.stringify({objectKey:key,lyrics:pack.lyrics,cues:[]}))});
    const resEmpty=mkRes();
    await empty({method:'GET',query:{key}},resEmpty);
    assert.equal(resEmpty.body.cues.length,count);
    // A reviewed R2 sidecar takes precedence over built-in estimates.
    const reviewed=createLyricsHandler({env,fetchImpl:async()=>new Response(JSON.stringify({objectKey:key,lyrics:pack.lyrics,cues:pack.cues.map(c=>({start:c.start,text:c.text}))}))});
    const resReviewed=mkRes();
    await reviewed({method:'GET',query:{key}},resReviewed);
    assert.ok(resReviewed.body.cues.every(c=>c.end===undefined));
  }
});