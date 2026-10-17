const { execFileSync } = require('node:child_process');

function validateSpeakingSyncConsumer(fn) {
  const filters = fn.eventTrigger?.eventFilters || [];
  const document = filters.find(filter => filter.attribute === 'document')?.value;
  if (fn.state !== 'ACTIVE'
    || fn.buildConfig?.entryPoint !== 'syncAutomaticCourseScore'
    || fn.labels?.['firebase-functions-codebase'] !== 'falowenadmin'
    || fn.eventTrigger?.eventType !== 'google.cloud.firestore.document.v1.created'
    || document !== 'automaticScoreSync/{syncId}') {
    throw new Error('The shared speaking score-sync consumer is missing, inactive or misconfigured. Deploy falowenadmin:syncAutomaticCourseScore before the learner API.');
  }
}

if (require.main === module) {
  try {
    const project = process.env.FIREBASE_PROJECT_ID;
    if (project !== 'falowen-examiner-trainer') throw new Error('Unexpected Firebase project for speaking sync.');
    const json = execFileSync('gcloud', ['functions', 'describe', 'syncAutomaticCourseScore', '--gen2',
      '--region=us-central1', `--project=${project}`, '--format=json'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    // Function metadata may contain environment values. Never print the response.
    validateSpeakingSyncConsumer(JSON.parse(json));
    console.log('Verified active Falowen Admin automaticScoreSync consumer in the shared Firebase project.');
  } catch {
    console.error('Cannot verify the shared score-sync consumer. Deploy falowenadmin:syncAutomaticCourseScore in falowen-examiner-trainer and ensure this deployment account can describe it. See docs/speaking-score-sync.md.');
    process.exitCode = 1;
  }
}
module.exports = { validateSpeakingSyncConsumer };
