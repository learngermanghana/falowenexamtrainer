// Package the exact learner-facing task data for both backend deployments.
// JSX modules are not executable on the server; evaluate only their named data initializers.
import { readFileSync, writeFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { writingLetters } from '../web/src/data/writingLetters.js';
import { WRITING_PROMPTS } from '../web/src/data/writingExamPrompts.js';
import { speakingQuestionDictionary } from '../web/src/data/speakingDictionary.js';
import { A1_FINAL_MOCK_WRITING_TASK } from '../web/src/data/a1FinalMockWritingTask.js';
import { A1_MOCK_2_READING, A1_MOCK_2_LISTENING, A1_MOCK_2_WRITING, A1_MOCK_2_WRITING_TASK, A1_MOCK_2_SPEAKING } from '../web/src/data/a1FinalMock2Data.js';
import { B1_WRITING_TASKS, B1_SPEAKING } from '../web/src/data/b1FinalMockData.js';
import { B2_WRITING_TASKS, B2_SPEAKING } from '../web/src/data/b2FinalMockData.js';

function data(file, name, bindings = {}) {
  const source = readFileSync(new URL('../web/src/components/' + file, import.meta.url), 'utf8');
  const marker = `const ${name} = `;
  const start = source.indexOf(marker);
  assert.ok(start >= 0, `Missing ${name} in ${file}`);
  const expressionStart = start + marker.length;
  const closing = source.slice(expressionStart).startsWith('Object.freeze([') ? '\n]);' : '\n});';
  const end = source.indexOf(closing, expressionStart);
  assert.ok(end > expressionStart, `Missing end of ${name}`);
  return runInNewContext(source.slice(expressionStart, end + closing.length - 1), bindings, { timeout: 1000 });
}
const a2Bindings = Object.fromEntries([1, 2, 3].map(n => {
  const name = `A2_GOETHE_SPEAKING_TEIL${n}`;
  return [name, data(`A2GoetheSpeakingMockTeil${n}Preview.jsx`, name)];
}));
const registry = {
  mockSets: {
    'a1-mock-02': {
      level: 'A1',
      writing: { ...A1_MOCK_2_WRITING_TASK, modelAnswer: undefined, form: A1_MOCK_2_WRITING.teil1 },
      speaking: A1_MOCK_2_SPEAKING.tasks,
      readingAnswerKey: Object.fromEntries(Object.values(A1_MOCK_2_READING).flatMap((part, index) => part.questions.map(question => [`t${index + 1}-${question.number}`, question.answer]))),
      listeningAnswerKey: Object.fromEntries([A1_MOCK_2_LISTENING.teil1, A1_MOCK_2_LISTENING.teil2, A1_MOCK_2_LISTENING.teil3].flatMap((part, index) => part.questions.map(question => [`t${index + 1}-${question.number}`, question.answer]))),
    },
  },
  writing: Object.fromEntries([
    ...writingLetters,
    ...Object.entries(WRITING_PROMPTS).flatMap(([level, rows]) => rows.map((row, i) => ({
      id: `${level.toLowerCase()}-${i + 1}`, level, situation: row.Thema, whatToInclude: row.Punkte,
    }))),
  ].map(task => [task.id, task])),
  speaking: Object.fromEntries(speakingQuestionDictionary.map(task => [task.id, task])),
  mocks: {
    A1: { writing: { ...A1_FINAL_MOCK_WRITING_TASK, instruction: data('A1GoetheWritingMockPreview.jsx', 'A1_GOETHE_WRITING_MOCK').teil2.instruction }, speaking: data('A1GoetheSpeakingMockPreview.jsx', 'A1_GOETHE_SPEAKING_MOCK').tasks },
    A2: { writing: data('A2GoetheWritingMockPreview.jsx', 'A2_GOETHE_WRITING_MOCK'), speaking: data('A2FinalMockSpeaking.jsx', 'TASKS', a2Bindings) },
    B1: { writing: B1_WRITING_TASKS, speaking: B1_SPEAKING },
    B2: { writing: B2_WRITING_TASKS, speaking: B2_SPEAKING },
  },
};
assert.equal(registry.mocks.A1.writing.points.length, 3, 'A1 writing rubric requires three points');
for (const part of Object.values(registry.mocks.A2.writing)) assert.equal(part.points.length, 3, 'A2 writing rubric requires three points');
for (const part of registry.mocks.B1.writing) assert.equal(part.points.length, 3, 'B1 writing rubric requires three points');
for (const part of registry.mocks.B2.writing) assert.equal(part.points.length, 4, 'B2 writing rubric requires four points');
const versions = Object.fromEntries(Object.entries(registry.mocks).map(([level, kinds]) => [level, Object.fromEntries(Object.entries(kinds).map(([kind, task]) => [kind, createHash('sha256').update(JSON.stringify(task)).digest('hex')]))]));
versions.A1_MOCK_2 = Object.fromEntries(['writing', 'speaking'].map(kind => [kind, createHash('sha256').update(JSON.stringify(registry.mockSets['a1-mock-02'][kind])).digest('hex')]));
const versionTarget = new URL('../web/src/data/assessmentTaskVersions.json', import.meta.url);
const versionText = JSON.stringify(versions, null, 2) + '\n';
if (process.argv.includes('--check')) assert.equal(readFileSync(versionTarget, 'utf8'), versionText, 'Mock task versions are stale');
else writeFileSync(versionTarget, versionText);
const target = new URL('../functions/data/assessmentTasks.json', import.meta.url);
const expected = JSON.stringify(registry, null, 2) + '\n';
if (process.argv.includes('--check')) {
  assert.equal(readFileSync(target, 'utf8'), expected, 'Assessment tasks are stale; regenerate with node scripts/generateAssessmentTaskRegistry.mjs');
} else writeFileSync(target, expected);
console.log('Assessment tasks match learner-facing writing, speaking and A1–B2 mocks.');
