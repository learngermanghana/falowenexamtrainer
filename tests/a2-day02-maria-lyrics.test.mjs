import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => JSON.parse(readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const drafts=read('web/public/music/studio-drafts.json').tracks;
const catalog=read('web/public/music/catalog.json').tracks;
const recorded=read('web/public/music/approved-recording-lyrics.json').recordings;
const translations=read('web/public/music/english-translations.json').recordings;
const sections=lyrics=>[...lyrics.matchAll(/^\[([^\]]+)\]\n([^[]*)/gm)].map(m=>({
  name:m[1],
  lines:m[2].trim().split('\n').map(x=>x.trim()).filter(Boolean),
}));

test('A2-1.2 Personen beschreiben replaces the Lea reference with the exact new Maria story',()=>{
  const rows=drafts.filter(row=>row.assignmentKey==='A2-1.2');
  assert.equal(rows.length,1);
  const draft=rows[0];
  assert.equal(draft.level,'A2');
  assert.equal(draft.day,2);
  assert.equal(draft.title,'Maria, meine Mama');
  assert.deepEqual(sections(draft.lyrics).map(x=>[x.name,x.lines.length]),[
    ['Verse 1',4],['Bridge – 2 Zeilen',2],['Chorus',4],
    ['Verse 2',8],['Chorus',8],['Outro',4],
  ]);
  assert.ok(draft.lyrics.includes('Maria heißt sie, ich kenn sie genau.'));
  assert.ok(draft.lyrics.includes('Sie arbeitet im Krankenhaus,'));
  assert.ok(draft.lyrics.includes('Maria ist stark und wunderbar,'));
  assert.ok(draft.lyrics.includes('du bist mein Vorbild, Jahr für Jahr.'));
  assert.equal(draft.lyrics.match(/Maria ist freundlich, immer da,/g)?.length,2);
  assert.doesNotMatch(draft.lyrics,/Die neue Kollegin|Lea|Tennis spielen/);
});

test('Maria remains a reference draft until an exact A2 Day 2 MP3 is supplied/reviewed',()=>{
  assert.ok(!catalog.some(row=>row.level==='A2'&&row.day===2&&!row.retired));
  assert.ok(!recorded.some(row=>row.assignmentKey==='A2-1.2'));
  assert.ok(!translations.some(row=>row.objectKey?.startsWith('music/a2/day-02/')));
  assert.ok(!drafts.some(row=>row.assignmentKey==='A2-1.2'&&Array.isArray(row.cues)&&row.cues.length));
});
