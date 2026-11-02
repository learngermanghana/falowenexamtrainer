import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {songStoryForTrack} from "../web/public/music/song-story.js";
const catalog=JSON.parse(readFileSync(new URL("../web/public/music/catalog.json",import.meta.url),"utf8")).tracks;
const stories=JSON.parse(readFileSync(new URL("../web/public/music/song-stories.json",import.meta.url),"utf8"));
test("every pinned song displays a distinct German and English Behind the Song plus learning focus",()=>{
  assert.ok(catalog.length>=20);
  for(const track of catalog){
    const story=songStoryForTrack(track,stories);
    assert.equal(story.curated,true,track.title+" has not been given a reviewed story");
    for(const name of ["storyDe","storyEn","focusDe","focusEn"]){
      assert.ok(story[name].length>24,track.title+" "+name+" missing");
      assert.ok(story[name].length<900,track.title+" "+name+" too long");
    }
    assert.notEqual(story.storyDe,story.storyEn);
    assert.notEqual(story.focusDe,story.focusEn);
  }
});
test("recording-specific biographies are never attached to different MP3s",()=>{
  const a=songStoryForTrack({title:"Endlich Urlaub",objectKey:"music/a2/day-24/Endlich Urlaub.mp3",level:"A2"},stories);
  const b=songStoryForTrack({title:"Endlich Urlaub",objectKey:"music/a2/day-25/Endlich Urlaub.mp3",level:"A2"},stories);
  assert.equal(a.curated,true);assert.equal(b.curated,true);
  assert.notEqual(a.storyDe,b.storyDe);
  const wrong=songStoryForTrack({title:"Endlich Urlaub",objectKey:"music/a2/day-27/Endlich Urlaub.mp3",level:"A2"},stories);
  assert.equal(wrong.curated,false);
});
test("new R2 songs have transparent bilingual fallbacks without inventing personal inspiration",()=>{
  for(const level of ["A1","A2","B1","B2","C1","C2","ALL"]){
    const track={id:"new-track",level,title:"Ein neuer Song",objectKey:"music/a2/day-22/new-recording.mp3"};
    const story=songStoryForTrack(track,stories);
    assert.equal(story.curated,false);
    for(const key of ["storyDe","storyEn","focusDe","focusEn"]) assert.ok(story[key].length>15,key);
  }
});
test("German appears before English, and the story stays outside the existing listening tabs",()=>{
  const html=readFileSync(new URL("../web/public/music/index.html",import.meta.url),"utf8");
  const app=readFileSync(new URL("../web/public/music/app.js",import.meta.url),"utf8");
  assert.ok(html.indexOf('id="story-de"')<html.indexOf('id="story-en"'));
  assert.ok(html.indexOf('id="story-focus-de"')<html.indexOf('id="story-focus-en"'));
  assert.ok(html.indexOf('class="behind-song"')<html.indexOf('class="lesson-tabs"'));
  assert.match(html,/id="story-de" lang="de"/);
  assert.match(html,/id="story-en" lang="en"/);
  assert.match(app,/renderBehindTheSong\(track\)/);
  assert.match(app,/song-stories\.json/);
  assert.match(app,/\.textContent=story\.storyDe/);
});
