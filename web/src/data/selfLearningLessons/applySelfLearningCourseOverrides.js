import { courseSchedules } from "../courseSchedule";
import { B2_SELF_LEARNING_COURSE_SCHEDULE } from "./b2/b2SelfLearningCourseSchedule";

// B2/C1 self-learning lessons are now maintained in web/src/data/selfLearningLessons.
// The old courseSchedule.js still contains legacy B2 workbook data, so we override B2 here
// before CourseTab builds the Course Book grid.
courseSchedules.B2 = B2_SELF_LEARNING_COURSE_SCHEDULE;

export default courseSchedules;
