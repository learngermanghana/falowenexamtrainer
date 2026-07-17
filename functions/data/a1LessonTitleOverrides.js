const A1_LESSON_TITLE_OVERRIDES = Object.freeze({
  "A1-1.1": "Personal Pronouns and Basic Verb Conjugation",
  "A1-1.2": "Introducing Yourself",
  "A1-2": "Numbers, Phone Numbers and Addresses",
  "A1-1.3": "Self-Introduction Practice with Articles",
  "A1-3.5": "Numbers, Time and Prices Revision",
  "A1-4.7": "Goethe A1 Speaking Exam Structure",
  "A1-11": "Instructions and the German Imperative",
  "A1-12.3": "Introduction to Letter Writing",
  "A1-5.10": "Conjunctions and Basic Sentence Structure",
});

const applyA1LessonTitleOverride = (lesson = {}) => {
  const key = String(lesson.id || lesson.assignmentId || lesson.assignment_id || "").trim().toUpperCase();
  const title = A1_LESSON_TITLE_OVERRIDES[key];
  return title ? { ...lesson, title, topic: title, lessonTitle: title } : lesson;
};

module.exports = { A1_LESSON_TITLE_OVERRIDES, applyA1LessonTitleOverride };
