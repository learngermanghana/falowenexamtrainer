import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {coverForTrack} from '../web/public/music/cover-art.js';
const catalog=JSON.parse(readFileSync(new URL('../web/public/music/catalog.json',import.meta.url),'utf8'));
test('20 original cover assets exist and do not rely on external hosts',()=>{
 const names=["a1-introduction","a1-identity","a1-address","a1-journey","a1-busy","a1-doctor","a2-conversation","a2-cities","a2-moments","a2-wellbeing","a2-bike","a2-dream","a2-pharmacy","a2-bank","b1-dream","b1-friendship","b1-success","b1-city","motivation-together","motivation-steps"];
 assert.equal(names.length,20);
 for(const slug of names){
  const path=new URL('../web/public/music/covers/'+slug+'.svg',import.meta.url);
  assert.ok(existsSync(path),slug);
  const file=readFileSync(path,'utf8');
  assert.match(file,/<svg /);assert.match(file,/viewBox="0 0 900 600"/);
  assert.doesNotMatch(file,/<image[^>]+href=[\"']https?:/);
 }
});
test('all matching pinned tracks keep the same image on the same recording',()=>{
 assert.ok(catalog.tracks.filter(row=>coverForTrack(row)).length>=16);
 assert.equal(coverForTrack({objectKey:'private/a2/day-01/file.mp3'}),'');
 assert.equal(coverForTrack({level:'B1',day:1}),'/music/covers/photos/music.jpg');
 assert.equal(coverForTrack({level:'B1',day:5}),'/music/covers/photos/music.jpg');
 assert.equal(coverForTrack({id:'gemeinsam-schaffen-wir-das'}),'/music/covers/photos/friendship.jpg');
});
test('the cards, song detail and miniplayer use the artwork with a safe fallback',()=>{
 const app=readFileSync(new URL('../web/public/music/app.js',import.meta.url),'utf8');
 const html=readFileSync(new URL('../web/public/music/index.html',import.meta.url),'utf8');
 assert.match(app,/photo.loading="lazy"/);
 assert.match(app,/photo.onerror/);
 assert.match(app,/coverForTrack\(track\)/);
 assert.match(html,/id="detail-cover"/);
 assert.match(html,/id="player-cover"/);
});

test('all audited course recordings and new public songs have local photo artwork',()=>{
 const coverage=JSON.parse(readFileSync(new URL('../web/public/music/timing-coverage.json',import.meta.url),'utf8'));
 const sources=JSON.parse(readFileSync(new URL('../web/public/music/covers/photo-sources.json',import.meta.url),'utf8'));
 for(const track of [...coverage.courseRecordings,...catalog.tracks,{id:'future-song',objectKey:'music/c1/day-01/new-song.mp3'}]){
  const cover=coverForTrack(track);assert.match(cover,/^\/music\/covers\/photos\/[a-z]+\.jpg$/);
  assert.ok(existsSync(new URL('../web/public'+cover,import.meta.url)),cover);
 }
 for(const photo of Object.values(sources)){assert.match(photo.source,/^https:\/\/www.pexels.com\/photo\//);assert.equal(photo.license,'https://www.pexels.com/license/');}
});
