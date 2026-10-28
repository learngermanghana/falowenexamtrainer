import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
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
    if (id.includes('courseMusic.cjs')) return { signTrack: id => ({ url: 'https://signed.invalid/' + id }) };
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
