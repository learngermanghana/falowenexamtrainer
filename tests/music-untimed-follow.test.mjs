import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateCues,activeLyricIndex} from '../web/public/music/lyrics-timing.js';
test('untimed lyrics never manufacture highlighting',()=>{
 assert.deepEqual(validateCues([], 'Hallo'),[]);
 assert.equal(activeLyricIndex([],100),-1);
});
test('the player reserves Follow for complete matching cues and removes duration-based scrolling',()=>{
 const app=readFileSync('web/public/music/app.js','utf8');
 assert.match(app,/byId\("follow-lyrics"\)\.disabled = !renderedCues\.length/);
 assert.match(app,/Line highlighting unavailable/);
 assert.doesNotMatch(app,/approximateScrollTop|Follow lyrics \(approximate scroll\)/);
 assert.match(app,/activeLyricIndex\(renderedCues, audio\.currentTime\)/);
});
