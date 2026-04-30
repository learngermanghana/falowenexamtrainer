const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const webManifestPath = path.join(repoRoot, 'web/src/data/curriculumManifest.js');
const functionsManifestPath = path.join(repoRoot, 'functions/data/curriculumManifest.js');

const source = fs.readFileSync(webManifestPath, 'utf8');
const transformed = source
  .replace(/export\s*\{([\s\S]*?)\};?\s*$/m, (match, names) => `module.exports = {${names}};`);

if (!/module\.exports\s*=\s*\{/.test(transformed)) {
  throw new Error('Failed to transform ESM exports in web curriculum manifest.');
}

fs.writeFileSync(functionsManifestPath, transformed, 'utf8');
console.log('Synced functions/data/curriculumManifest.js from web/src/data/curriculumManifest.js');
