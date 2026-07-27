const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const webAlignmentPath = path.join(repoRoot, 'web/src/data/b2LessonContentAlignment.js');
const functionsAlignmentPath = path.join(repoRoot, 'functions/data/b2LessonContentAlignment.js');
const checkerPath = path.join(repoRoot, 'scripts/checkCurriculumManifestSync.js');

const lessonTopicAnchor = '    lessonTopic: "Transport, Urlaub und nachhaltige Entscheidungen",\n';
const nestedMetadata = [
  '    futureMetadata: Object.freeze({',
  '      tags: Object.freeze(["mobility", "comparison"]),',
  '      rubric: Object.freeze({',
  '        focus: "structure",',
  '        weights: Object.freeze([1, 2, 3]),',
  '      }),',
  '    }),',
  '',
].join('\n');

const injectNestedMetadata = (source, label) => {
  if (!source.includes(lessonTopicAnchor)) {
    throw new Error(`${label}: Day 8 lessonTopic anchor was not found.`);
  }
  if (source.includes('futureMetadata: Object.freeze({')) {
    throw new Error(`${label}: structural-parity fixture already exists.`);
  }
  return source.replace(lessonTopicAnchor, `${lessonTopicAnchor}${nestedMetadata}`);
};

const originals = new Map([
  [webAlignmentPath, fs.readFileSync(webAlignmentPath, 'utf8')],
  [functionsAlignmentPath, fs.readFileSync(functionsAlignmentPath, 'utf8')],
]);

try {
  fs.writeFileSync(
    webAlignmentPath,
    injectNestedMetadata(originals.get(webAlignmentPath), 'web alignment'),
    'utf8',
  );
  fs.writeFileSync(
    functionsAlignmentPath,
    injectNestedMetadata(originals.get(functionsAlignmentPath), 'Functions alignment'),
    'utf8',
  );

  const result = spawnSync(process.execPath, [checkerPath], {
    cwd: repoRoot,
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    throw new Error(
      `Structural B2 parity regression failed.\nSTDOUT:\n${result.stdout || ''}\nSTDERR:\n${result.stderr || ''}`,
    );
  }

  console.log('B2 curriculum parity accepts equivalent nested object and array metadata.');
} finally {
  originals.forEach((source, filePath) => fs.writeFileSync(filePath, source, 'utf8'));
}
