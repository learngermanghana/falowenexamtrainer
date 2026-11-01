import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateCues,activeLyricIndex,lyricLines} from "../web/public/music/lyrics-timing.js";
import {matchingDraftEnglishTranslation} from "../web/public/music/english-translations.js";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url);
const {validateLyrics}=require("../server/musicLyrics.cjs");
const approved=require("../web/public/music/approved-recording-lyrics.json");
const studio=require("../web/public/music/studio-drafts.json");
const english=require("../web/public/music/english-translations.json");

test("A1 Day22 has 33 exact original MP3-aligned, clearly estimated cue lines",()=>{
 const p=approved.recordings.find(x=>x.objectKey==="music/a1/day-22/Arzttermin.mp3");
 assert.equal(p.timingStatus,"estimated");
 assert.equal(p.matchCoverage,0.99);
 assert.match(p.recordingSha256,/^[0-9a-f]{64}$/);
 assert.equal(p.cues.length,33);
 assert.equal(validateCues(p.cues,p.lyrics).length,lyricLines(p.lyrics).length);
 assert.ok(validateLyrics(p,p.objectKey));
 assert.ok(p.cues.every((x,i)=>x.end>x.start && (i===0||x.start>p.cues[i-1].end)));
 assert.equal(activeLyricIndex(p.cues,0),-1);
});

test("B1 Day4 can highlight its 17 MP3-based draft lines, without granting recording approval",()=>{
 const pack=studio.tracks.find(x=>x.level==="B1"&&x.day===4);
 assert.equal(pack.recordingObjectKey,"music/b1/day-04/Ort zum Leben.mp3");
 assert.match(pack.recordingSha256,/^[0-9a-f]{64}$/);
 assert.equal(pack.timingStatus,"estimated");
 assert.equal(pack.cues.length,17);
 assert.equal(validateCues(pack.cues,pack.lyrics).length,17);
 assert.ok(pack.cues.every((x,i)=>x.end>x.start && (i===0||x.start>pack.cues[i-1].end)));
 assert.equal(activeLyricIndex(pack.cues,0),-1);
 assert.ok(matchingDraftEnglishTranslation(english,{
   objectKey:pack.recordingObjectKey, level:"B1", day:4
 },{referenceOnly:true,lyrics:pack.lyrics,assignmentKey:pack.assignmentKey,draftTitle:pack.title}));
 assert.ok(!approved.recordings.some(x=>x.objectKey===pack.recordingObjectKey),
   "estimated studio cues do not appear as owner-approved lyrics");
 const app=readFileSync("web/public/music/app.js","utf8");
 assert.match(app,/draft\.recordingObjectKey === track\.objectKey/);
 assert.match(app,/Follow lyrics \(estimated\)/);
 assert.match(app,/not been teacher-verified/);
});
