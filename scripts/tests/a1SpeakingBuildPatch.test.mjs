import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, copyFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const files = [
  'scripts/patchA1Day19CombinedPracticeAndSpeakingReliability.mjs',
  'scripts/runA1Day19CombinedPracticeAndSpeakingReliabilityPatch.mjs',
  'web/src/components/VerbotenErlaubtPage.js',
  'web/src/components/A1ExamSpeakingPracticePanel.js',
  'web/src/components/A1CoursePracticeAutoMount.js',
  'web/src/data/a1LessonVideoResourceOverrides.js',
  'web/src/lib/speakingAudio.js',
  'web/src/components/SpeakingPage.js',
  'web/src/components/GoetheFreeChatPage.js',
];
for (const legacy of [false, true]) {
  test(`build patch preserves question ID and is rerunnable (${legacy ? 'legacy' : 'current'} payload)`, () => {
    const fixture = mkdtempSync(join(tmpdir(), 'falowen-speaking-patch-'));
    try {
      for (const file of files) {
        mkdirSync(dirname(join(fixture, file)), { recursive: true });
        copyFileSync(join(root, file), join(fixture, file));
      }
      const page = join(fixture, 'web/src/components/SpeakingPage.js');
      if (legacy) writeFileSync(page, readFileSync(page, 'utf8').replace(/^[ \t]*taskId: selectedQuestion.id,\n/gm, ''));
      const run = () => execFileSync(process.execPath, [join(fixture, files[1])], { stdio: 'pipe' });
      run();
      const first = readFileSync(page, 'utf8');
      assert.match(first, /analyzeSpeakingAudioWithTranscriptRetry\(\{[\s\S]*?taskId: selectedQuestion.id/);
      assert.match(first, /transcriptionState: transcript \? "done" : "failed"/);
      run();
      assert.equal(readFileSync(page, 'utf8'), first);
    } finally {
      rmSync(fixture, { recursive: true, force: true });
    }
  });
}
