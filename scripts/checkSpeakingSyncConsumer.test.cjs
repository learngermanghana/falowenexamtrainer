const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validateSpeakingSyncConsumer } = require('./checkSpeakingSyncConsumer.cjs');
const consumer = { state: 'ACTIVE', buildConfig: { entryPoint: 'syncAutomaticCourseScore' },
  labels: { 'firebase-functions-codebase': 'falowenadmin' }, eventTrigger: {
    eventType: 'google.cloud.firestore.document.v1.created', eventFilters: [{ attribute: 'document', value: 'automaticScoreSync/{syncId}' }] } };
test('accepts the shared Admin consumer', () => assert.doesNotThrow(() => validateSpeakingSyncConsumer(consumer)));
test('rejects inactive, wrong-collection and wrong-codebase consumers', () => {
  for (const patch of [{ state: 'FAILED' }, { labels: {} }, { buildConfig: {} }, { eventTrigger: {} },
    { eventTrigger: { ...consumer.eventTrigger, eventFilters: [{ attribute: 'document', value: 'another/{id}' }] } }]) {
    assert.throws(() => validateSpeakingSyncConsumer({ ...consumer, ...patch }), /consumer/);
  }
});
