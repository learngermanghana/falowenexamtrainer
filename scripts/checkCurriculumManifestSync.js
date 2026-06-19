const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const LEVELS_TO_AUDIT = new Set(['A1', 'A2', 'B1']);
const ROUTE_PROPS = ['grammarPage', 'workbookRoute'];
const URL_PATTERN = /^(?:https?:|mailto:|tel:)/i;

const repoRoot = path.resolve(__dirname, '..');
const webAppPath = path.join(repoRoot, 'web/src/App.js');
const publicRoot = path.join(repoRoot, 'web/public');

const isLocalRoute = (value = '') => {
  const token = String(value || '').trim();
  return token.startsWith('/') && !URL_PATTERN.test(token);
};

const routeExists = (route, appSource) => {
  if (!isLocalRoute(route)) return true;
  const normalized = route.split(/[?#]/)[0].replace(/\/$/, '') || '/';
  const publicCandidates = [
    path.join(publicRoot, `${normalized}.html`),
    path.join(publicRoot, normalized, 'index.html'),
  ];
  const isDynamicLessonRoute = appSource.includes('path="/campus/course/lesson/:level/:day"')
    && /^\/campus\/course\/lesson\/(A1|A2|B1|B2|C1|C2)\/\d+$/i.test(normalized);

  return appSource.includes(`path="${normalized}"`)
    || isDynamicLessonRoute
    || publicCandidates.some((candidate) => fs.existsSync(candidate));
};

const canonicalResourceList = (entry) => {
  if (Array.isArray(entry.resources) && entry.resources.length) return entry.resources;
  return [{
    chapter: entry.chapter,
    title: entry.title,
    grammarPage: entry.grammarPage,
    workbookRoute: entry.workbookRoute,
    video: entry.video,
    submissionRequired: entry.submissionRequired,
    assignmentId: entry.assignmentId,
  }];
};

const validateCanonicalCurriculum = (canonical) => {
  const errors = [];
  const assignmentIds = new Map();
  const appSource = fs.existsSync(webAppPath) ? fs.readFileSync(webAppPath, 'utf8') : '';

  canonical.forEach((entry, entryIndex) => {
    const label = `${entry.level || '??'} day ${entry.day ?? '??'} ${entry.assignmentId || '(no assignmentId)'}`;
    const level = String(entry.level || '').toUpperCase();
    const assignmentId = String(entry.assignmentId || '').trim();
    const resources = canonicalResourceList(entry);

    if (!assignmentId) errors.push(`${label}: missing assignmentId`);
    if (assignmentId) {
      const previous = assignmentIds.get(assignmentId);
      if (previous) errors.push(`${label}: duplicate assignmentId also used by ${previous}`);
      assignmentIds.set(assignmentId, label);
    }

    const entrySubmission = Boolean(entry.submissionRequired);
    const submissionResources = resources.filter((resource) => Boolean(resource.submissionRequired ?? resource.assignment));
    if (entrySubmission && submissionResources.length === 0) {
      errors.push(`${label}: submissionRequired=true but no nested resource is marked for submission`);
    }
    if (!entrySubmission && submissionResources.length > 0) {
      errors.push(`${label}: submissionRequired=false but a nested resource requires submission`);
    }
    submissionResources.forEach((resource) => {
      const resourceId = String(resource.assignmentId || resource.assignment_id || '').trim();
      if (!resourceId) errors.push(`${label}: submission resource ${resource.chapter || '(no chapter)'} is missing assignmentId`);
      if (resourceId && resourceId !== assignmentId && resources.length === 1) {
        errors.push(`${label}: single submission resource uses ${resourceId}, conflicting with parent ${assignmentId}`);
      }
    });
    resources.filter((resource) => !Boolean(resource.submissionRequired ?? resource.assignment)).forEach((resource) => {
      if (resource.assignmentId || resource.assignment_id) {
        errors.push(`${label}: non-submission resource ${resource.chapter || '(no chapter)'} must not carry assignmentId`);
      }
    });

    if (LEVELS_TO_AUDIT.has(level)) {
      if (!String(entry.title || '').trim()) errors.push(`${label}: missing title`);
      resources.forEach((resource, resourceIndex) => {
        const resourceLabel = `${label} resource ${resourceIndex + 1}${resource.chapter ? ` (${resource.chapter})` : ''}`;
        if (!String(resource.title || entry.title || '').trim()) errors.push(`${resourceLabel}: missing title`);
        ROUTE_PROPS.forEach((prop) => {
          const route = String(resource[prop] || '').trim();
          if (route && !routeExists(route, appSource)) errors.push(`${resourceLabel}: local ${prop} route not found: ${route}`);
        });
      });
    }

    if (entryIndex !== canonical.findIndex((candidate) => candidate.level === entry.level && Number(candidate.day) === Number(entry.day))) {
      errors.push(`${label}: duplicate level/day pair`);
    }
  });

  return errors;
};

(async () => {
  const canonical = JSON.parse(fs.readFileSync(path.join(repoRoot, 'shared/curriculumCanonical.json'), 'utf8'));
  const webModule = await import(pathToFileURL(path.join(repoRoot, 'web/src/data/curriculumManifest.js')));
  const functionsModule = require(path.join(repoRoot, 'functions/data/curriculumManifest.js'));

  const webCanonical = webModule.CANONICAL_CURRICULUM || [];
  const functionsCanonical = functionsModule.CANONICAL_CURRICULUM || [];
  const errors = [];

  if (JSON.stringify(canonical) !== JSON.stringify(webCanonical) || JSON.stringify(canonical) !== JSON.stringify(functionsCanonical)) {
    errors.push('Curriculum manifest drift detected. Run: npm run sync:curriculum');
  }

  errors.push(...validateCanonicalCurriculum(canonical));

  if (errors.length) {
    console.error(`Curriculum validation failed with ${errors.length} issue(s):`);
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log('Curriculum manifests are synced and canonical A1–B1 resources passed validation.');
})();
