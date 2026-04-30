const path = require('path');
const { pathToFileURL } = require('url');

(async () => {
  const repoRoot = path.resolve(__dirname, '..');
  const webManifestPath = path.join(repoRoot, 'web/src/data/curriculumManifest.js');
  const functionsManifestPath = path.join(repoRoot, 'functions/data/curriculumManifest.js');

  const webModule = await import(pathToFileURL(webManifestPath));
  const functionsModule = require(functionsManifestPath);

  const webEntries = webModule.CURRICULUM_ENTRIES || [];
  const functionEntries = functionsModule.CURRICULUM_ENTRIES || [];

  if (JSON.stringify(webEntries) === JSON.stringify(functionEntries)) {
    console.log('Curriculum manifests are in sync.');
    process.exit(0);
  }

  console.error('Curriculum manifest drift detected between web and functions copies. Run: node scripts/syncCurriculumManifest.js');
  process.exit(1);
})();
