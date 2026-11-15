import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

test('publishes open Swahili classes separately from the German registration catalogue', async () => {
  const source = fs.readFileSync(new URL('../functions/functionz/routes/publicClasses.js', import.meta.url), 'utf8');
  const module = { exports: {} };
  const common = { startDate: '2099-01-01', levelId: 'A1', generationStatus: 'complete' };
  const docs = [
    ['german', common],
    ['swahili', { ...common, language: 'Swahili', tuitionGhs: 1250 }],
    ['unpriced', { ...common, language: 'Swahili' }],
    ['hidden', { ...common, language: 'Swahili', publicVisible: false }],
    ['closed', { ...common, language: 'Swahili', registrationOpen: false }],
    ['draft', { ...common, language: 'Swahili', status: 'draft' }],
    ['incomplete', { ...common, language: 'Swahili', generationStatus: 'failed' }],
  ].map(([id, data]) => ({ id, data: () => ({ slug: id, ...data }) }));
  vm.runInNewContext(source, {
    module, console, URLSearchParams,
    require(name) {
      assert.equal(name, 'firebase-admin');
      return { firestore: () => ({ collection: () => ({ get: async () => ({ docs }) }) }) };
    },
  });
  let result;
  const res = {
    setHeader() {},
    status(code) {
      assert.equal(code, 200);
      return this;
    },
    json(value) {
      result = JSON.parse(JSON.stringify(value));
    },
  };
  await module.exports.publicClassesHandler({ method: 'GET' }, res);
  assert.deepEqual(result.classes.map(course => course.id), ['german']);
  assert.deepEqual(result.swahiliClasses.map(course => course.id), ['swahili', 'unpriced']);
  const [published, unpriced] = result.swahiliClasses;
  assert.equal(published.classUrl, '/classes/#swahili');
  assert.equal(published.tuitionGhs, 1250);
  assert.equal(published.totalSessions, 0);
  assert.equal(published.scheduleUrl, '');
  assert.deepEqual(published.highlights, []);
  assert.equal(unpriced.tuitionGhs, 0);
});
