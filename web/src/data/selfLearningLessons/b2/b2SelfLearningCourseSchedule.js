import { B2_LESSON_CONTENT_ALIGNMENT } from "../../b2LessonContentAlignment";

const makeB2ScheduleEntry = ({ day, chapter, topic, goal, grammar_topic }) => ({
  day,
  topic,
  chapter,
  goal,
  instruction: "This is a B2 self-learning lesson. Open the guided lesson, learn the topic, practise speaking and writing, improve from feedback and self-mark your progress.",
  grammar_topic,
  assignment: false,
  lesen_hören: {
    video: null,
    youtube_link: null,
    grammarbook_link: null,
    workbook_link:
      day === 0
        ? "/campus/course/b2-day-0-self-learning-orientation-workbook"
        : `/campus/course/lesson/B2/${day}?chapter=${chapter}`,
    assignment: false,
  },
});

const orientation = makeB2ScheduleEntry({
  day: 0,
  chapter: "0",
  topic: "Day 0 Orientation",
  goal: "Start here to learn the B2 self-learning workflow before Day 1.",
  grammar_topic: "Course orientation, writing workflow and honest self-marking",
});

const alignedLessons = Object.values(B2_LESSON_CONTENT_ALIGNMENT)
  .sort((left, right) => Number(left.day) - Number(right.day))
  .map((lesson) =>
    makeB2ScheduleEntry({
      day: lesson.day,
      chapter: lesson.chapter,
      topic: lesson.title,
      goal: lesson.goal,
      grammar_topic: lesson.grammar_topic,
    })
  );

export const B2_SELF_LEARNING_COURSE_SCHEDULE = [orientation, ...alignedLessons];

export default B2_SELF_LEARNING_COURSE_SCHEDULE;
