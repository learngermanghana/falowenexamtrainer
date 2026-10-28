import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { musicKeyFromAutoId, musicTrackFromKey, listMusicTracks, parseMusicList, authorizedMusicListRequest } = require('../server/musicDiscovery.cjs');
import { validateApprovedTrack, generateSongPage, publishApprovedTrack } from '../scripts/publishApprovedMusic.mjs';

const file = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const catalog = JSON.parse(file('web/public/music/catalog.json'));
const learning = JSON.parse(file('web/public/music/learning.json'));
const source = file('api/approved-music.js');
const template = file('web/public/music/index.html');
function api() {
  const signedCalls = [];
  const fakeRequire = id => {
    if (id.endsWith('catalog.json')) return catalog;
    if (id.includes('courseHoerenPublishing')) return { signedStudioUrl: options => {
      signedCalls.push(options);
      return 'https://signed.invalid/music.mp3';
    } };
    if (id.includes('courseMusic.cjs')) return { signTrack: id => ({ url: 'https://signed.invalid/' + id }), signObject: ({key}) => {signedCalls.push({key});return {url:'https://signed.invalid/'+key};} };
    if (id.includes('musicDiscovery.cjs')) return { musicKeyFromAutoId };
    throw new Error('Unexpected import ' + id);
  };
  const module = { exports: {} };
  runInNewContext(source, { require: fakeRequire, module, exports: module.exports, console }, { filename: 'approved-music.js' });
  return { ...module.exports, handler: module.exports, signedCalls };
}
function response() {
  return { headers: {}, statusCode: 200, jsonBody: null, ended: false,
    setHeader(name,value) { this.headers[name]=value;return this; },
    status(code) { this.statusCode=code;return this; },
    json(body) { this.jsonBody=body;return this; },
    end() { this.ended=true;return this; } };
}
test('only five published tracks, including three actually approved lesson songs', () => {
  assert.equal(catalog.tracks.length, 5);
  const approved = catalog.tracks.filter(track => track.approved === true);
  assert.deepEqual(approved.map(track=>track.id),
    ['a1-day-04-numbers','a1-day-22-health','a2-day-18-bank']);
  assert.equal(approved.every(track=>track.objectKey.startsWith('music/')), true);
  assert.equal(catalog.tracks.some(track=>track.day === 19 && track.level === 'A2'), false,
    'R2 folder link is not an approved song');
});
test('approved keys are derived from exact curated catalog, never arbitrary objects', async () => {
  const { handler, approvedMusicKeys, signedCalls } = api();
  assert.deepEqual(Object.keys(approvedMusicKeys()).sort(), [
    'a1-day-04-numbers','a1-day-22-health','a2-day-18-bank'
  ].sort());
  assert.equal(approvedMusicKeys({tracks:[{ ...catalog.tracks[0], approved:false } ]})['a1-day-04-numbers'], undefined);
  assert.equal(approvedMusicKeys({tracks:[{ ...catalog.tracks[0], objectKey:'a2/day-19/hoeren.mp3' } ]})['a1-day-04-numbers'], undefined);
  assert.equal(approvedMusicKeys({tracks:[{ ...catalog.tracks[0], objectKey:'music/a2/day-04/foreign.mp3' } ]})['a1-day-04-numbers'], undefined);
  assert.equal(approvedMusicKeys({tracks:[{ ...catalog.tracks[0], audioUrl:'https://evil.invalid/song.mp3' } ]})['a1-day-04-numbers'], undefined);
  for (const track of catalog.tracks.filter(item => item.approved)) {
    const res = response();
    await handler({method:'GET', query:{track:track.id}},res);
    assert.equal(res.statusCode,302);
    assert.match(res.headers.Location,/^https:\/\/signed\.invalid\//);
  }
  assert.deepEqual(signedCalls.map(call => call.key),['music/a1/day-22/mein-kopf-tut-weh.mp3']);
  for (const track of ['a2-day-19-shopping', 'a2/day-19/einkaufen-wo-und-wie.mp3', '__proto__']) {
    const res = response();
    await handler({method:'GET',query:{track}},res);
    assert.equal(res.statusCode,404);
    assert.equal(res.headers.Location,undefined);
  }
});
test('approved new A2 Day 19 songs can be registered as a one-file catalog approval', () => {
  const input = { id:'a2-day-19-shopping',title:'Lieber online oder im Laden?',level:'A2',day:19,
    assignmentKey:'A2-7.19',topic:'Einkaufen: wo und wie',genre:'Bossa Pop',
    objectKey:'music/a2/day-19/lieber-online-oder-im-laden.mp3' };
  const candidate=validateApprovedTrack(input);
  assert.equal(candidate.approved,true);
  assert.equal(candidate.audioUrl,'https://www.falowen.app/api/music?track=a2-day-19-shopping');
  const result=publishApprovedTrack({catalog,learning,template,input});
  assert.equal(result.catalog.tracks.length,6);
  assert.equal(result.hasReviewedLearningPack,false,'new audio must not receive draft questions automatically');
  assert.match(result.html,/data-track="a2-day-19-shopping"/);
  assert.match(result.html,/music\.falowen\.app\/music\/songs\/a2-day-19-shopping\.html/);
  assert.equal(catalog.tracks.length,5,'dry-run must not mutate source');
  assert.throws(()=>publishApprovedTrack({catalog,learning,template,input:{...input,id:'a1-day-04-numbers'}}),/already registered/);
  for (const badKey of ['a2/day-19/hoeren.mp3','music/a2/day-18/file.mp3',
    'music/a2/day-19/../private.mp3','music/a2/day-19/file.mp3?x=1','music/a2/day-19/File.MP3'])
    assert.throws(()=>validateApprovedTrack({...input,objectKey:badKey}),/exact approved MP3/);
});
test('learning packs match exactly approved original songs and provide ungraded exercises', () => {
  const approved = catalog.tracks.filter(item=>item.approved);
  assert.equal(Object.keys(learning.lessons).length,3);
  for (const track of approved) {
    const lesson=learning.lessons[track.id];
    assert.equal(lesson.assignmentKey,track.assignmentKey);
    assert.equal(lesson.title,track.title);
    assert.match(lesson.lyrics,/\[Verse 1\]/);
    assert.match(lesson.lyrics,/\[Chorus\]/);
    assert.equal(lesson.questions.length,3);
    assert.equal(lesson.questions.filter(q=>q.type==='listening').length,2);
    assert.equal(lesson.questions.filter(q=>q.type==='speaking').length,1);
    assert.ok(lesson.questions.filter(q=>q.type==='listening')
      .every(q=>q.options[q.correctIndex] && typeof q.answer==='string'));
    assert.ok(lesson.vocabulary.length >= 5);
    assert.ok(lesson.courseUrl.startsWith('https://www.falowen.app/campus/course/'));
  }
  assert.equal(learning.lessons['a2-day-19-shopping'], undefined);
});
test('all five static share pages have grounded metadata and the common learning player', () => {
  for (const track of catalog.tracks) {
    const html = file('web/public/music/songs/' + track.id + '.html');
    assert.match(html,new RegExp('data-track="' + track.id + '"'));
    assert.match(html,new RegExp('<title>' + track.title));
    assert.match(html,new RegExp('og:url" content="https://music.falowen.app/music/songs/' + track.id + '.html'));
    assert.match(html,/music\/app\.js/);
  }
  assert.match(template,/id="song-detail"/);
  assert.match(template,/id="speed"/);
  assert.match(template,/id="repeat"/);
  assert.match(template,/data-category="motivation"/);
  const js=file('web/public/music/app.js');
  assert.match(js,/fetch\("\/music\/learning.json"/);
  assert.match(js,/function renderQuestions/);
  assert.match(js,/function renderLyrics/);
  assert.match(js,/setPlayer\(track/);
  assert.match(js,/audio.loop/);
  assert.match(js,/hasLesson/);
});

test('level shelves show available songs and new uploads require no site build', () => {
  const js=file('web/public/music/app.js');
  assert.match(js,/songs.slice\(0, 4\)/);
  assert.match(js,/const available = \["A1","A2","B1","B2","C1","C2"\]/);
  assert.doesNotMatch(js,/No song yet/);
  assert.match(js,/\/api\/music-library/);
  assert.match(js,/byId\("refresh-music"\)/);
  assert.match(js,/pinnedKeys/);
  assert.match(js,/dynamic\.filter/);
  assert.match(file('web/public/music/index.html'),/Refresh songs/);
  const vercel=JSON.parse(file('vercel.json'));
  assert.ok(vercel.routes.find(r=>r.src==='/api/music-library' && r.dest==='/api/music-library.js'));
});
test('only music/<level>/day-XX/ MP3 files can auto-publish', async () => {
  const good='music/a2/day-19/lieber-online-oder-im-laden.mp3';
  const track=musicTrackFromKey(good);
  assert.ok(track);
  assert.equal(track.id,'r2-a2-day-19-lieber-online-oder-im-laden');
  assert.equal(track.day,19);
  assert.equal(track.level,'A2');
  assert.equal(musicKeyFromAutoId(track.id),good);
  for (const filename of ['Shopping Song (Final).mp3','A2_day_19_music.mp3','NewSong2026.mp3','Einkaufen – wo und wie?.MP3','Lieber online oder im Laden!.mp3','Gefühle und Wünsche.mp3']) {
    const key='music/a2/day-19/'+filename;
    const detected=musicTrackFromKey(key);
    assert.ok(detected,'ordinary MP3 filenames must auto-appear');
    assert.equal(musicKeyFromAutoId(detected.id),key);
  }
  for (const key of [
    'a2/day-19/einkaufen-wo-und-wie.mp3',
    'music/a2/day-19/../../a2/private.mp3',
    'music/a2/day-00/invalid.mp3',
    'music/a2/day-29/invalid.mp3',
    'music/a2/day-19/private.wav',
    'music/a2/day-19/x.mp3?private=true',
    'music/a2/day-19/folder/file.mp3'
  ]) assert.equal(musicTrackFromKey(key),null);
  for(const key of ['a2/day-19/hoeren.mp3','music/a2/day-19/../private','r2-a2-day-19-../hidden'])
    assert.equal(musicKeyFromAutoId(key),'');
  const {handler, signedCalls}=api();
  const res=response();
  await handler({method:'GET',query:{track:track.id}},res);
  assert.equal(res.statusCode,302);
  assert.equal(signedCalls.at(-1).key,good);
});
test('bounded R2 LIST only reads music prefix, never Hören or arbitrary keys',async()=>{
  const xml=[
    '<?xml version="1.0"?>',
    '<ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/">',
    '<IsTruncated>false</IsTruncated>',
    '<Contents><Key>music/a2/day-19/lieber-online-oder-im-laden.mp3</Key></Contents>',
    '<Contents><Key>a2/day-19/einkaufen-wo-und-wie.mp3</Key></Contents>',
    '<Contents><Key>music/a2/day-19/secret.wav</Key></Contents>',
    '</ListBucketResult>'
  ].join('');
  const parsed=parseMusicList(xml);
  assert.deepEqual(parsed.keys,['music/a2/day-19/lieber-online-oder-im-laden.mp3']);
  const env={R2_ACCOUNT_ID:'886b2264d12c796d29879a8e919a2f46',
    R2_ACCESS_KEY_ID:'testAccess',R2_SECRET_ACCESS_KEY:'testSecret',
    R2_AUDIO_BUCKET:'falowen-course-audio'};
  let requests=0;
  const now=()=>new Date('2026-10-28T12:00:00Z');
  const signed=authorizedMusicListRequest(env,'',now());
  assert.match(signed.url,/^https:\/\/886b2264d12c796d29879a8e919a2f46\.r2\.cloudflarestorage\.com\/falowen-course-audio\?/);
  assert.match(signed.url,/prefix=music%2F/);
  assert.doesNotMatch(signed.url,/prefix=a2%2F/);
  assert.match(signed.headers.Authorization,/^AWS4-HMAC-SHA256 Credential=testAccess\//);
  assert.ok(signed.headers['x-amz-content-sha256']);
  assert.equal(signed.url.includes('testSecret'),false);
  const tracks=await listMusicTracks({env,now,fetchImpl:async (url,options)=>{
    requests++;
    assert.match(url,/prefix=music%2F/);
    assert.equal(options.method,'GET');
    assert.match(options.headers.Authorization,/^AWS4-HMAC-SHA256 Credential=/);
    return {ok:true,text:async()=>xml};
  }});
  assert.equal(requests,1);
  assert.equal(tracks.length,1);
  assert.equal(tracks[0].day,19);
  assert.equal(tracks[0].level,'A2');
  const x=musicTrackFromKey('music/a2/day-19/Einkaufen – wo und wie?.MP3');
  assert.equal(musicKeyFromAutoId(x.id),x.objectKey);
  assert.ok(x.id.startsWith('r2-a2-day-19-b64_'));
});

test('embedded campus music accepts its own signed playback API but rejects unrelated paths',()=>{
  const js=file('web/public/music/app.js');
  const source=js.match(/function safeAudioUrl\(value\) \{[\s\S]*?\n\}/)?.[0];
  assert.ok(source,'music URL guard must remain testable');
  const location={origin:'https://www.falowen.app',protocol:'https:'};
  const check=runInNewContext(source+'; safeAudioUrl', { URL, location });
  for(const id of ['a1-day-04-numbers','a2-day-18-bank','r2-a2-day-19-song','r2-a2-day-19-b64_U29uZy5tcDM']) {
    const url='https://www.falowen.app/api/music?track='+id;
    assert.equal(check(url),url,'approved or discovered music must be playable inside campus');
  }
  for(const url of [
    'https://www.falowen.app/api/music?track=abc&private=1',
    'https://www.falowen.app/api/music?track=abc&track=def',
    'https://www.falowen.app/api/music?track=abc%2Fprivate',
    'https://www.falowen.app/api/admin',
    'https://www.falowen.app/a2/day-19/einkaufen-wo-und-wie.mp3',
    'https://falowen-course-audio.886b2264d12c796d29879a8e919a2f46.r2.cloudflarestorage.com/music/a2/day-19/song.mp3',
    'http://www.falowen.app/api/music?track=a2-day-18-bank'
  ]) assert.equal(check(url),'','private or arbitrary URLs must stay blocked');
});
