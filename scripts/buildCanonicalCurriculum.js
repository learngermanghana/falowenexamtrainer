const fs = require('fs');
const path = require('path');
const { courseSchedules } = require('../functions/data/courseSchedule');

const slugOverrides = {1:'small-talk',2:'personen-beschreiben',3:'dinge-und-personen-vergleichen',4:'wo-moechten-wir-uns-treffen',5:'freizeit',6:'moebel-und-raeume',7:'eine-wohnung-suchen',8:'rezepte-und-essen',9:'urlaub',10:'tourismus-und-traditionelle-feste',11:'unterwegs-verkehrsmittel-vergleichen',12:'mein-traumberuf',13:'vorstellungsgespraech',14:'beruf-und-karriere',15:'mein-lieblingssport',16:'wohlbefinden-und-entspannung',17:'in-die-apotheke-gehen',18:'die-bank-anrufen',19:'einkaufen-wo-und-wie',20:'typische-reklamationssituationen',21:'ein-wochenende-planen',22:'die-woche-planung',23:'wie-kommst-du-zur-schule-oder-zur-arbeit',24:'einen-urlaub-planen',25:'tagesablauf',26:'gefuehle-in-verschiedenen-situationen',27:'digitale-kommunikation',28:'ueber-die-zukunft-sprechen'};
const normalizeLevel = (v='') => String(v).trim().toUpperCase();
const normalizeChapter = (v='') => String(v || '').trim();
const first = (...values) => values.find((v) => typeof v === 'string' && v.trim()) || '';
const resourceOf = (entry) => Array.isArray(entry?.lesen_hören) ? entry.lesen_hören[0] : entry?.lesen_hören || {};
const practicalOf = (entry) => Array.isArray(entry?.schreiben_sprechen) ? entry.schreiben_sprechen[0] : entry?.schreiben_sprechen || {};

const canonical = Object.entries(courseSchedules).flatMap(([level, lessons]) => (lessons || [])
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
  }));

fs.writeFileSync(path.join(__dirname, '../shared/curriculumCanonical.json'), JSON.stringify(canonical, null, 2) + '\n');
console.log(`Wrote ${canonical.length} canonical curriculum entries.`);
