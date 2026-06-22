const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const resubmissionFixRunner = path.join(repoRoot, 'scripts/run_resubmission_fix.py');

// The course-book audit already runs before both `start` and `build`.
// Apply the idempotent source fix first so local development and deployments
// always use the corrected cooldown and assignment-status logic.
execFileSync(process.env.PYTHON || 'python3', [resubmissionFixRunner], {
  cwd: repoRoot,
  stdio: 'inherit',
});

const canonicalPath = path.join(repoRoot, 'shared/curriculumCanonical.json');
const webModulePath = path.join(repoRoot, 'web/src/data/a1CourseBookCards.js');

const ALLOWED_ASSESSMENT_TYPES = new Set(['tutor-marked', 'self-practice']);
const ALLOWED_RESOURCE_SECTIONS = new Set(['lesen_hören', 'schreiben_sprechen', 'grammar', 'practice']);
const MULTI_CARD_DAYS = new Set([2, 3, 16, 18]);
const FIRST_DAY = 0;
const LAST_DAY = 24;

const normalize = (value = '') => String(value || '').trim();
const normalizeLower = (value = '') => normalize(value).toLowerCase().replace(/\s+/g, ' ');

const readSource = () => {
  const lessons = JSON.parse(fs.readFileSync(canonicalPath, 'utf8'));
  return {
    schemaVersion: 2,
    level: 'A1',
    cards: lessons
      .filter((lesson) => lesson.level === 'A1')
      .sort((a, b) => Number(a.sequence || 0) - Number(b.sequence || 0))
      .map((lesson) => ({
        lessonId: lesson.id,
        displayDay: lesson.day,
        chapter: lesson.chapter,
        title: lesson.title,
        assessmentType: lesson.submissionRequired ? 'tutor-marked' : 'self-practice',
        assignmentId: lesson.assignmentId,
        resourceSection: lesson.kind || 'lesen_hören',
        submissionRequired: lesson.submissionRequired,
        progressionEligible: lesson.progressionEligible,
        displayLabel: `Day ${lesson.day} ${lesson.chapter}`,
      })),
  };
};

const readGeneratedWebCards = () => {
  if (!fs.existsSync(webModulePath)) return null;
  const source = fs.readFileSync(webModulePath, 'utf8');
  return source.includes('getLessonsByLevel("A1")') && source.includes('getLessonDisplayData(lesson)') ? 'derived' : null;
};

const auditA1CourseBookCards = ({ checkGeneratedModule = true } = {}) => {
  const document = readSource();
  const cards = Array.isArray(document?.cards) ? document.cards : [];
  const errors = [];
  const lessonIds = new Map();
  const assignmentIds = new Map();
  const dayChapterKeys = new Map();
  const dayTitleKeys = new Map();
  const dayCounts = new Map();

  if (document?.level !== 'A1') errors.push('top-level level must be A1');
  if (!cards.length) errors.push('cards must contain at least one A1 lesson');

  cards.forEach((card, index) => {
    const label = `card ${index + 1}${card?.displayLabel ? ` (${card.displayLabel})` : ''}`;
    const day = Number(card?.displayDay);
    const chapter = normalize(card?.chapter);
    const title = normalize(card?.title);
    const lessonId = normalize(card?.lessonId);
    const assignmentId = normalize(card?.assignmentId);
    const assessmentType = normalize(card?.assessmentType);
    const resourceSection = normalize(card?.resourceSection);
    const expectedLabel = `Day ${day} ${chapter}`;

    if (!Number.isInteger(day) || day < FIRST_DAY || day > LAST_DAY) errors.push(`${label}: displayDay must be an integer from ${FIRST_DAY} to ${LAST_DAY}`);
    if (!chapter) errors.push(`${label}: missing chapter`);
    if (!title) errors.push(`${label}: missing title`);
    if (!lessonId) errors.push(`${label}: missing lessonId`);
    if (Boolean(card.submissionRequired) && !assignmentId) errors.push(`${label}: missing assignmentId`);
    if (!ALLOWED_ASSESSMENT_TYPES.has(assessmentType)) errors.push(`${label}: assessmentType must be tutor-marked or self-practice`);
    if (!ALLOWED_RESOURCE_SECTIONS.has(resourceSection)) errors.push(`${label}: invalid resourceSection ${resourceSection || '(empty)'}`);
    if (chapter.includes('_')) errors.push(`${label}: chapter must identify one card, not a combined chapter`);
    if (title.includes('+')) errors.push(`${label}: title must identify one lesson, not a combined parent title`);
    if (card.displayLabel !== expectedLabel) errors.push(`${label}: displayLabel must be ${expectedLabel}`);

    const tutorMarked = assessmentType === 'tutor-marked';
    if (Boolean(card.submissionRequired) !== tutorMarked) errors.push(`${label}: submissionRequired conflicts with assessmentType`);
    if (Boolean(card.progressionEligible) !== tutorMarked) errors.push(`${label}: progressionEligible conflicts with assessmentType`);

    const dayChapterKey = `${day}:${chapter}`;
    const previousDayChapter = dayChapterKeys.get(dayChapterKey);
    if (previousDayChapter) errors.push(`${label}: duplicate day/chapter also used by ${previousDayChapter}`);
    dayChapterKeys.set(dayChapterKey, label);

    const dayTitleKey = `${day}:${normalizeLower(title)}`;
    const previousDayTitle = dayTitleKeys.get(dayTitleKey);
    if (previousDayTitle) errors.push(`${label}: duplicate title on the same day also used by ${previousDayTitle}`);
    dayTitleKeys.set(dayTitleKey, label);

    const previousLessonId = lessonIds.get(lessonId);
    if (previousLessonId) errors.push(`${label}: duplicate lessonId also used by ${previousLessonId}`);
    lessonIds.set(lessonId, label);

    const previousAssignmentId = assignmentIds.get(assignmentId);
    if (previousAssignmentId) errors.push(`${label}: duplicate assignmentId also used by ${previousAssignmentId}`);
    assignmentIds.set(assignmentId, label);
    dayCounts.set(day, (dayCounts.get(day) || 0) + 1);
  });

  for (let day = FIRST_DAY; day <= LAST_DAY; day += 1) {
    const expected = MULTI_CARD_DAYS.has(day) ? 2 : 1;
    const actual = dayCounts.get(day) || 0;
    if (actual !== expected) errors.push(`Day ${day}: expected ${expected} card(s), found ${actual}`);
  }

  if (checkGeneratedModule && !readGeneratedWebCards()) errors.push('Generated web A1 card module is not derived from lessonCatalog. Run: npm run sync:curriculum');

  return { cards, errors };
};

if (require.main === module) {
  const { cards, errors } = auditA1CourseBookCards();
  if (errors.length) {
    console.error(`A1 curriculum audit failed with ${errors.length} issue(s):`);
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }
  console.log(`A1 curriculum audit passed for ${cards.length} canonical lesson cards.`);
}

module.exports = { auditA1CourseBookCards, readSource };
