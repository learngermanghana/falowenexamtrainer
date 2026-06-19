const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

(async () => {
  const repoRoot = path.resolve(__dirname, '..');
  const canonical = JSON.parse(fs.readFileSync(path.join(repoRoot, 'shared/curriculumCanonical.json'), 'utf8'));
  const webModule = await import(pathToFileURL(path.join(repoRoot, 'web/src/data/curriculumManifest.js')));
  const functionsModule = require(path.join(repoRoot, 'functions/data/curriculumManifest.js'));

  const webCanonical = webModule.CANONICAL_CURRICULUM || [];
  const functionsCanonical = functionsModule.CANONICAL_CURRICULUM || [];
  if (JSON.stringify(canonical) === JSON.stringify(webCanonical) && JSON.stringify(canonical) === JSON.stringify(functionsCanonical)) {
    console.log('Curriculum manifests are generated from the canonical source of truth.');
    process.exit(0);
  }
  console.error('Curriculum manifest drift detected. Run: npm run sync:curriculum');
  process.exit(1);
})();
