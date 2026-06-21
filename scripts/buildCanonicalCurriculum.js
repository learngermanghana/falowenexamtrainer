const fs = require('fs');
const path = require('path');
const { courseSchedules } = require('../functions/data/courseSchedule');
const a1Document = require('../shared/a1CourseBookCards.json');

const slugOverrides = {1:'small-talk',2:'personen-beschreiben',3:'dinge-und-personen-vergleichen',4:'wo-moechten-wir-uns-treffen',5:'freizeit',6:'moebel-und-raeume',7:'eine-wohnung-suchen',8:'rezepte-und-essen',9:'urlaub',10:'tourismus-und-traditionelle-feste',11:'unterwegs-verkehrsmittel-vergleichen',12:'mein-traumberuf',13:'vorstellungsgespraech',14:'beruf-und-karriere',15:'mein-lieblingssport',16:'wohlbefinden-und-entspannung',17:'in-die-apotheke-gehen',18:'die-bank-anrufen',19:'einkaufen-wo-und-wie',20:'typische-reklamationssituationen',21:'ein-wochenende-planen',22:'die-woche-planung',23:'wie-kommst-du-zur-schule-oder-zur-arbeit',24:'einen-urlaub-planen',25:'tagesablauf',26:'gefuehle-in-verschiedenen-situationen',27:'digitale-kommunikation',28:'ueber-die-zukunft-sprechen'};
const normalizeLevel = (v='') => String(v).trim().toUpperCase();
const normalizeChapter = (v='') => String(v || '').trim();
const normalizeTitle = (v='') => String(v || '').trim().toLowerCase().replace(/\s+/g, ' ');
const first = (...values) => values.find((v) => typeof v === 'string' && v.trim()) || '';
const toArray = (value) => Array.isArray(value) ? value : value ? [value] : [];
const resourceOf = (entry) => Array.isArray(entry?.lesen_hören) ? entry.lesen_hören[0] : entry?.lesen_hören || {};
const practicalOf = (entry) => Array.isArray(entry?.schreiben_sprechen) ? entry.schreiben_sprechen[0] : entry?.schreiben_sprechen || {};

const getA1Tasks = (lesson = {}) => {
  const tasks = [
    ...toArray(lesson.lesen_hören).map((task) => ({ section: 'lesen_hören', task })),
    ...toArray(lesson.schreiben_sprechen).map((task) => ({ section: 'schreiben_sprechen', task })),
  ];
  return tasks.length ? tasks : [{ section: lesson.assignment ? 'lesen_hören' : 'schreiben_sprechen', task: lesson }];
};

const taskMatchesCard = (task = {}, lesson = {}, card = {}) => {
  const chapter = normalizeChapter(task.displayChapter || task.chapter || lesson.displayChapter || lesson.chapter);
  const title = normalizeTitle(task.title || task.topic || task.lessonTitle || lesson.title || lesson.topic);
  if (chapter === card.chapter) return true;
  return (card.legacyMatches || []).some(
    (match) =>
      chapter === normalizeChapter(match.chapter) &&
      (!match.title || title === normalizeTitle(match.title))
  );
};

const buildA1Canonical = () => {
  const schedule = courseSchedules.A1 || [];
  const cards = Array.isArray(a1Document.cards) ? a1Document.cards : [];

  return cards.map((card, index) => {
    const lesson = schedule.find(
      (candidate) => Number(candidate.displayDay ?? candidate.day) === Number(card.displayDay)
    ) || {};
    const matched = getA1Tasks(lesson).find(({ task }) => taskMatchesCard(task, lesson, card));
    const task = matched?.task || {};
    const section = matched?.section || card.resourceSection;
    const grammarPage = first(card.grammarPage, task.grammarPage, task.grammarbook_link, task.grammar_link, lesson.grammarPage, lesson.grammarbook_link, lesson.grammar_link);
    const workbookRoute = first(card.workbookRoute, task.workbookRoute, task.workbook_link, lesson.workbookRoute, lesson.workbook_link);
    const video = first(card.video, task.video, task.youtube_link, lesson.video, lesson.youtube_link);
    const submissionRequired = Boolean(card.submissionRequired);
    const resource = {
      kind: section,
      chapter: card.chapter,
      title: card.title,
      video,
      grammarPage,
      workbookRoute,
      submissionRequired,
      ...(submissionRequired ? { assignmentId: card.assignmentId } : {}),
    };

    return {
      level: 'A1',
      day: index,
      chapter: card.chapter,
      title: card.title,
      assignmentId: card.assignmentId,
      assignmentType: section === 'schreiben_sprechen' ? 'Schreiben & Sprechen' : 'Lesen & Hören',
      grammarPage,
      workbookRoute,
      video,
      submissionRequired,
      progressionEligible: Boolean(card.progressionEligible),
      resources: [resource],
      displayDay: Number(card.displayDay),
      displayChapter: card.chapter,
      displayLabel: card.displayLabel,
    };
  });
};

const buildOtherLevels = () => Object.entries(courseSchedules).flatMap(([level, lessons]) => {
  if (normalizeLevel(level) === 'A1') return [];
  return (lessons || [])
    .filter((lesson) => normalizeChapter(lesson.chapter) && normalizeChapter(lesson.chapter).toLowerCase() !== 'completion')
    .map((lesson) => {
      const res = resourceOf(lesson);
      const practical = practicalOf(lesson);
      const day = Number(lesson.day ?? lesson.assignmentDay ?? 0);
      const chapter = normalizeChapter(lesson.chapter);
      const assignmentId = /^[A-Z][0-9]-/.test(String(lesson.assignmentId || '')) ? lesson.assignmentId : `${normalizeLevel(level)}-${chapter}`;
      const a2Workbook = level === 'A2' && slugOverrides[day] ? `/campus/course/a2-day-${day}-${slugOverrides[day]}-workbook` : '';
      return {
        level: normalizeLevel(level),
        day,
        chapter,
        title: first(lesson.topic, lesson.title, lesson.assignmentTitle, lesson.de),
        assignmentId,
        assignmentType: first(lesson.mode, res.mode, practical.mode, 'Lesen & Hören'),
        grammarPage: first(res.grammarbook_link, res.grammar_link, practical.grammarbook_link, practical.grammar_link, lesson.grammarbook_link, lesson.grammar_link),
        workbookRoute: first(a2Workbook, res.workbook_link, practical.workbook_link, lesson.workbook_link),
        video: first(res.video, res.youtube_link, lesson.video, lesson.youtube_link, practical.video, practical.youtube_link),
        submissionRequired: Boolean(lesson.assignment || res.assignment || practical.assignment),
        progressionEligible: Boolean(lesson.progressionEligible ?? lesson.assignment ?? res.assignment ?? practical.assignment),
      };
    });
});

const canonical = [...buildA1Canonical(), ...buildOtherLevels()];

fs.writeFileSync(path.join(__dirname, '../shared/curriculumCanonical.json'), JSON.stringify(canonical, null, 2) + '\n');
console.log(`Wrote ${canonical.length} canonical curriculum entries, including ${a1Document.cards.length} explicit A1 cards.`);
