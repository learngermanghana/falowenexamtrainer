import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const write = (relativePath, source) => fs.writeFileSync(path.join(root, relativePath), source, "utf8");

const replaceOnce = (source, before, after, label) => {
  if (source.includes(after)) return source;
  if (!source.includes(before)) throw new Error(`B2 exam-domain patch anchor missing: ${label}`);
  return source.replace(before, after);
};

const addImport = (source, anchor, importLine, label) => {
  if (source.includes(importLine)) return source;
  if (!source.includes(anchor)) throw new Error(`B2 exam-domain import anchor missing: ${label}`);
  return source.replace(anchor, `${anchor}\n${importLine}`);
};

// 1. Make every canonical B2 fallback lesson carry the redesigned grammar and speaking content.
{
  const file = "web/src/components/SelfLearningLessonRegistry.js";
  let source = read(file);
  source = addImport(
    source,
    'import { buildDefaultLesson } from "../data/selfLearningLessons/buildSelfLearningLesson";',
    'import { enhanceB2ExamDomainLesson } from "../data/b2ExamDomainTeaching";',
    "SelfLearningLessonRegistry enhancer import",
  );

  const before = `const b2FallbackLessons = Object.values(B2_LESSON_CONTENT_ALIGNMENT)
  .sort((left, right) => Number(left.day) - Number(right.day))
  .map(({ day, chapter, title, lessonTopic }) => buildDefaultLesson({ level: "B2", day, chapter, title, topic: lessonTopic }));`;
  const after = `const b2FallbackLessons = Object.values(B2_LESSON_CONTENT_ALIGNMENT)
  .sort((left, right) => Number(left.day) - Number(right.day))
  .map((alignment) => enhanceB2ExamDomainLesson(
    buildDefaultLesson({ level: "B2", day: alignment.day, chapter: alignment.chapter, title: alignment.title, topic: alignment.lessonTopic }),
    alignment,
  ));`;
  source = replaceOnce(source, before, after, "B2 fallback lesson enhancement");
  write(file, source);
}

const pageSpecs = [
  {
    file: "web/src/components/B2Day1To4GuidedLessonPage.js",
    deepBefore: '<GrammarNotes lesson={lesson} checked={progress.learnDone} onCheckedChange={(checked) => setProgress((old) => ({ ...old, learnDone: checked }))} />',
    deepAfter: '<B2ExamDomainGrammarNotes lesson={lesson} checked={progress.learnDone} onCheckedChange={(checked) => setProgress((old) => ({ ...old, learnDone: checked }))} />',
  },
  {
    file: "web/src/components/B2Day6To10SelfTutoringPage.jsx",
    guidedBefore: 'const guidedLesson = useMemo(() => enhanceLesson(lesson), [lesson]);',
    guidedAfter: 'const guidedLesson = useMemo(() => enhanceB2ExamDomainLesson(enhanceLesson(lesson)), [lesson]);',
    deepBefore: '<GrammarNotes day={day} checked={progress.learnNotesDone} onCheckedChange={(learnNotesDone) => setProgress((old) => ({ ...old, learnNotesDone }))} />',
    deepAfter: '<B2ExamDomainGrammarNotes lesson={guidedLesson} checked={progress.learnNotesDone} onCheckedChange={(learnNotesDone) => setProgress((old) => ({ ...old, learnNotesDone }))} />',
  },
  {
    file: "web/src/components/B2Day11To15SelfTutoringPage.jsx",
    guidedBefore: 'const guidedLesson = useMemo(() => enhanceLesson(lesson), [lesson]);',
    guidedAfter: 'const guidedLesson = useMemo(() => enhanceB2ExamDomainLesson(enhanceLesson(lesson)), [lesson]);',
    deepBefore: '<GrammarNotes day={day} checked={progress.learnNotesDone} onCheckedChange={(learnNotesDone) => setProgress((old) => ({ ...old, learnNotesDone }))} />',
    deepAfter: '<B2ExamDomainGrammarNotes lesson={guidedLesson} checked={progress.learnNotesDone} onCheckedChange={(learnNotesDone) => setProgress((old) => ({ ...old, learnNotesDone }))} />',
  },
  {
    file: "web/src/components/B2Day16To20SelfTutoringPage.jsx",
    guidedBefore: 'const guidedLesson = useMemo(() => enhanceB2Day16To20Lesson(lesson), [lesson]);',
    guidedAfter: 'const guidedLesson = useMemo(() => enhanceB2ExamDomainLesson(enhanceB2Day16To20Lesson(lesson)), [lesson]);',
    deepBefore: '<GrammarNotes day={day} checked={progress.learnNotesDone} onCheckedChange={(checked)=>setProgress((old)=>({...old,learnNotesDone:checked}))} />',
    deepAfter: '<B2ExamDomainGrammarNotes lesson={guidedLesson} checked={progress.learnNotesDone} onCheckedChange={(checked)=>setProgress((old)=>({...old,learnNotesDone:checked}))} />',
  },
  {
    file: "web/src/components/B2Day21To25SelfTutoringPage.jsx",
    guidedBefore: 'const guidedLesson = useMemo(() => enhanceLesson(lesson), [lesson]);',
    guidedAfter: 'const guidedLesson = useMemo(() => enhanceB2ExamDomainLesson(enhanceLesson(lesson)), [lesson]);',
    deepBefore: '<GrammarNotes day={day} checked={progress.learnNotesDone} onCheckedChange={(checked) => setProgress((old) => ({ ...old, learnNotesDone:checked }))} />',
    deepAfter: '<B2ExamDomainGrammarNotes lesson={guidedLesson} checked={progress.learnNotesDone} onCheckedChange={(checked) => setProgress((old) => ({ ...old, learnNotesDone:checked }))} />',
  },
  {
    file: "web/src/components/B2Day26To28SelfTutoringPage.jsx",
    guidedBefore: 'const guidedLesson = useMemo(() => enhanceLesson(lesson), [lesson]);',
    guidedAfter: 'const guidedLesson = useMemo(() => enhanceB2ExamDomainLesson(enhanceLesson(lesson)), [lesson]);',
    deepBefore: '<B2Day25To28GrammarNotes day={day} checked={progress.learnNotesDone} onCheckedChange={(checked) => setProgress((old) => ({ ...old, learnNotesDone:checked }))} />',
    deepAfter: '<B2ExamDomainGrammarNotes lesson={guidedLesson} checked={progress.learnNotesDone} onCheckedChange={(checked) => setProgress((old) => ({ ...old, learnNotesDone:checked }))} />',
  },
];

for (const spec of pageSpecs) {
  let source = read(spec.file);
  source = addImport(
    source,
    'import B2SpeakingSupportGuide from "./B2SpeakingSupportGuide";',
    'import B2ExamDomainGrammarNotes from "./B2ExamDomainGrammarNotes";',
    `${spec.file} dynamic grammar import`,
  );
  if (spec.guidedBefore) {
    source = addImport(
      source,
      'import { styles } from "../styles";',
      'import { enhanceB2ExamDomainLesson } from "../data/b2ExamDomainTeaching";',
      `${spec.file} enhancer import`,
    );
    source = replaceOnce(source, spec.guidedBefore, spec.guidedAfter, `${spec.file} final lesson enhancement`);
  }
  source = replaceOnce(source, spec.deepBefore, spec.deepAfter, `${spec.file} deep grammar renderer`);
  write(spec.file, source);
}

console.log("Applied canonical B2 exam-domain grammar and speaking content to Course Book lessons.");
