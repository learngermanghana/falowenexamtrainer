import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { getB1ReadingTask } from '../web/src/data/b1ReadingTasks.js';
import { getB1WritingTask } from '../web/src/data/b1WritingTasks.js';
import { getB1ListeningTask } from '../web/src/data/b1ListeningTasks.js';
const require = createRequire(import.meta.url);
const read = file => readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const manifest = JSON.parse(read('functions/data/answerKeyManifest.json'));
const key = Object.values(manifest).find(row => row.assignment_id === 'B1-8.24');
const listening = getB1ListeningTask(24);
test('Day 24 seven reading choices exactly match private marking key', () => {
 const task = getB1ReadingTask(24);
 assert.match(task.text.title, /Weniger ist mehr/);
 assert.equal(task.text.questions.length, 7);
 assert.deepEqual(Object.values(key.answers.teil3).map(x => x[0]), [...'ABBABCB']);
 task.text.questions.forEach((q, i) => assert.ok(q.options.some(option => option.toLowerCase() === key.answers.teil3[`Answer${i+1}`].toLowerCase())));
});
test('Day 24 current Laura writing task and all four points reach backend', () => {
 const task = getB1WritingTask(24);
 const backend = JSON.parse(read('functions/data/b1WritingTasks.json'))['B1-8.24'];
 assert.match(task.sourceTitle, /Laura/);
 assert.equal(task.taskPoints.length, 4);
 assert.deepEqual(backend.points, task.taskPoints);
 assert.equal(backend.situation, [task.instructions, task.sourceText].join('\n\n'));
 assert.doesNotMatch(backend.situation, /Paul/);
});
test('New Day 24 audio replaces the old questions without grading an unverified recording', () => {
 assert.equal(listening.submitRequired, false);
 assert.equal(listening.audioKey, 'b1/day-24/day_24.mp3');
 assert.equal(listening.showPublishedPractice, false);
 assert.deepEqual(listening.questions, []);
 // Keep the historic server-owned marking key unchanged for prior attempts.
 // The active lesson profile must omit Teil 4, so this key is not reused for
 // an unreviewed recording.
 assert.equal(Object.values(key.answers.teil4).length, 5);
});
test('R2 signer accepts exact Day 24 upload while rejecting unrelated objects', () => {
 const { validateCourseAudioKey } = require('../functions/functionz/r2CourseAudio.js');
 assert.deepEqual(validateCourseAudioKey({level:'B1',day:24,key:listening.audioKey}), {level:'B1',day:24,key:listening.audioKey});
 for (const key of ['b1/day_24/day-24.mp3','b1/day-24/other.mp3','b1/day-25/day_24.mp3','b1/day-24/../day_24.mp3']) assert.equal(validateCourseAudioKey({level:'B1',day:24,key}), null);
});
