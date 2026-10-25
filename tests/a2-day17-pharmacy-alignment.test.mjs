import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { A2_READING_TASKS } from '../web/src/data/a2ReadingTasks.js';
import { getA2ListeningTask } from '../web/src/data/a2ListeningTasks.js';
const manifest = JSON.parse(readFileSync(new URL('../functions/data/answerKeyManifest.json', import.meta.url)));
const entry = Object.values(manifest).find(row => row.assignment_id === 'A2-6.17');
test('Day 17 uses five pharmacy reading questions and five matching listening questions', () => {
  const reading = A2_READING_TASKS[17];
  const listening = getA2ListeningTask(17);
  assert.equal(reading.questions.length, 5);
  assert.equal(listening.questions.length, 5);
  assert.match(reading.text, /Sonnenschutzmittel.*Hautcremes/);
  assert.doesNotMatch(reading.text, /Hamburg|Elbphilharmonie/);
  assert.equal(listening.audioKey, 'a2/day-17/day-17.mp3');
  assert.equal(listening.audioUrl, '');
  for (const [part, questions] of [['teil3', reading.questions], ['teil4', listening.questions]]) {
    assert.equal(Object.keys(entry.answers[part]).length, 5);
    questions.forEach((question, index) => assert.ok(question.options.includes(entry.answers[part]['Answer'+(index+1)])));
  }
  assert.deepEqual(Object.values(entry.answers.teil3).map(answer=>answer[0]), ['B','B','B','A','A']);
  assert.deepEqual(Object.values(entry.answers.teil4).map(answer=>answer[0]), ['B','A','C','A','B']);
  assert.deepEqual(entry.writingParts, []);
  assert.deepEqual(entry.expectedParts, ['teil3','teil4']);
});
test('previous Hamburg key remains archived for historical tutor review', () => {
  const legacy = entry.workbookRevisions['a2-6.17-hamburg-legacy'];
  assert.equal(Object.keys(legacy.answers.teil3).length, 8);
  assert.equal(Object.keys(legacy.answers.teil4).length, 5);
});
