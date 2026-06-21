const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const sourcePath = path.join(repoRoot, 'shared/a1CourseBookCards.json');
const webModulePath = path.join(repoRoot, 'web/src/data/a1CourseBookCards.js');

const ALLOWED_ASSESSMENT_TYPES = new Set(['tutor-marked', 'self-practice']);
const ALLOWED_RESOURCE_SECTIONS = new Set(['lesen_hören', 'schreiben_sprechen']);
const MULTI_CARD_DAYS = new Set([2, 3, 16, 18]);
const FIRST_DAY = 0;
const LAST_DAY = 24;

const normalize = (value = '') => String(value || '').trim();
const normalizeLower = (value = '') => normalize(value).toLowerCase().replace(/\s+/g, ' ');

const readSource = () => JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

const readGeneratedWebCards = () => {
  if (!fs.existsSync(webModulePath)) return null;
  const source = fs.readFileSync(webModulePath, 'utf8');
  const match = source.match(/Object\.freeze\((\[[\s\S]*?\])\.map\(\(card\)=>Object\.freeze\(card\)\)\)/);
  if (!match) return null;
  return JSON.parse(match[1]);
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

  if (document?.schemaVersion !== 1) errors.push('schemaVersion must be 1');
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

    if (!Number.isInteger(day) || day < FIRST_DAY || day > LAST_DAY) {
      errors.push(`${label}: displayDay must be an integer from ${FIRST_DAY} to ${LAST_DAY}`);
    }
    if (!chapter) errors.push(`${label}: missing chapter`);
    if (!title) errors.push(`${label}: missing title`);
    if (!lessonId) errors.push(`${label}: missing lessonId`);
    if (!assignmentId) errors.push(`${label}: missing assignmentId`);
    if (!ALLOWED_ASSESSMENT_TYPES.has(assessmentType)) {
      errors.push(`${label}: assessmentType must be tutor-marked or self-practice`);
    }
    if (!ALLOWED_RESOURCE_SECTIONS.has(resourceSection)) {
      errors.push(`${label}: invalid resourceSection ${resourceSection || '(empty)'}`);
    }
    if (chapter.includes('_')) errors.push(`${label}: chapter must identify one card, not a combined chapter`);
    if (title.includes('+')) errors.push(`${label}: title must identify one lesson, not a combined parent title`);
    if (card.displayLabel !== expectedLabel) {
      errors.push(`${label}: displayLabel must be ${expectedLabel}`);
    }

    const tutorMarked = assessmentType === 'tutor-marked';
    if (Boolean(card.submissionRequired) !== tutorMarked) {
      errors.push(`${label}: submissionRequired conflicts with assessmentType`);
    }
    if (Boolean(card.progressionEligible) !== tutorMarked) {
      errors.push(`${label}: progressionEligible conflicts with assessmentType`);
    }

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

    (card.legacyMatches || []).forEach((match, legacyIndex) => {
      if (!normalize(match?.chapter)) errors.push(`${label}: legacy match ${legacyIndex + 1} is missing chapter`);
      if (match?.title !== undefined && !normalize(match.title)) {
        errors.push(`${label}: legacy match ${legacyIndex + 1} has an empty title`);
      }
    });
  });

  for (let day = FIRST_DAY; day <= LAST_DAY; day += 1) {
    const expected = MULTI_CARD_DAYS.has(day) ? 2 : 1;
    const actual = dayCounts.get(day) || 0;
    if (actual !== expected) errors.push(`Day ${day}: expected ${expected} card(s), found ${actual}`);
  }

  ['12.1', '12.2'].forEach((chapter) => {
    const card = cards.find((item) => Number(item.displayDay) === 18 && item.chapter === chapter);
    if (!card) {
      errors.push(`Day 18 ${chapter}: missing required assignment card`);
    } else if (card.assessmentType !== 'tutor-marked' || !card.submissionRequired) {
      errors.push(`Day 18 ${chapter}: must be a tutor-marked assignment`);
    }
  });

  if (checkGeneratedModule) {
    const generatedCards = readGeneratedWebCards();
    if (!generatedCards) {
      errors.push('Generated web A1 card module is missing or unreadable. Run: npm run sync:curriculum');
    } else if (JSON.stringify(generatedCards) !== JSON.stringify(cards)) {
      errors.push('A1 card module drift detected. Run: npm run sync:curriculum');
    }
  }

  return { cards, errors };
};

if (require.main === module) {
  const { cards, errors } = auditA1CourseBookCards();
  if (errors.length) {
    console.error(`A1 curriculum audit failed with ${errors.length} issue(s):`);
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }
  console.log(`A1 curriculum audit passed for ${cards.length} explicit lesson cards.`);
}

module.exports = { auditA1CourseBookCards, readSource };
