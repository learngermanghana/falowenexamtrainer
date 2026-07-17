const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const root = path.resolve(__dirname, '..');

const firstDifference = (expected = [], actual = []) => {
  const length = Math.max(expected.length, actual.length);
  for (let index = 0; index < length; index += 1) {
    if (JSON.stringify(expected[index]) !== JSON.stringify(actual[index])) {
      return {
        index,
        expected: expected[index] || null,
        actual: actual[index] || null,
      };
    }
  }
  return null;
};

(async () => {
  const canonical = JSON.parse(fs.readFileSync(path.join(root, 'shared/curriculumCanonical.json'), 'utf8'));
  const webModule = await import(pathToFileURL(path.join(root, 'web/src/data/lessonCatalog.js')));
  const functionsModule = require(path.join(root, 'functions/data/lessonCatalog.js'));
  const sources = [
    ['web/src/data/lessonCatalog.js', webModule.lessonCatalog || []],
    ['functions/data/lessonCatalog.js', functionsModule.lessonCatalog || []],
  ];

  sources.forEach(([name, lessons]) => {
    const difference = firstDifference(canonical, lessons);
    if (!difference) {
      console.log(`${name}: synced (${lessons.length} lessons)`);
      return;
    }
    console.log(`${name}: drift at index ${difference.index}`);
    console.log(`expected: ${JSON.stringify(difference.expected)}`);
    console.log(`actual: ${JSON.stringify(difference.actual)}`);
  });
})();
