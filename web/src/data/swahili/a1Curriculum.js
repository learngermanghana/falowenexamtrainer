// Planned A1 learning sequence reviewed against Dr. Ruth's 10-topic syllabus.
// Retain the identities and routes of the three existing Falowen workbooks:
// Day 1 = pronunciation, Day 5 = family practice, Day 6 = restaurant.
// Every published A1 workbook supports an explicit tutor submission.
import { SWAHILI_A1_PRACTICE_UNITS } from "./a1PracticeUnits.js";
import { SWAHILI_DAY_ONE } from "./dayOne.js";
import { SWAHILI_DAY_FIVE } from "./dayFive.js";
import { SWAHILI_DAY_SIX } from "./daySix.js";

export const SWAHILI_A1_CURRICULUM = Object.freeze([
  SWAHILI_DAY_ONE,
  SWAHILI_A1_PRACTICE_UNITS[2],
  SWAHILI_A1_PRACTICE_UNITS[3],
  SWAHILI_A1_PRACTICE_UNITS[4],
  SWAHILI_DAY_FIVE,
  SWAHILI_DAY_SIX,
  SWAHILI_A1_PRACTICE_UNITS[7],
  SWAHILI_A1_PRACTICE_UNITS[8],
  SWAHILI_A1_PRACTICE_UNITS[9],
  SWAHILI_A1_PRACTICE_UNITS[10],
  SWAHILI_A1_PRACTICE_UNITS[11],
  SWAHILI_A1_PRACTICE_UNITS[12],
  SWAHILI_A1_PRACTICE_UNITS[13],
  SWAHILI_A1_PRACTICE_UNITS[14],
  SWAHILI_A1_PRACTICE_UNITS[15],
  SWAHILI_A1_PRACTICE_UNITS[16],
  SWAHILI_A1_PRACTICE_UNITS[17],
  SWAHILI_A1_PRACTICE_UNITS[18],
  SWAHILI_A1_PRACTICE_UNITS[19],
  SWAHILI_A1_PRACTICE_UNITS[20],
]);

export const SWAHILI_A1_PUBLISHED_LESSONS = Object.freeze(
  SWAHILI_A1_CURRICULUM.filter((lesson) => lesson.status !== "coming-soon")
);
export const SWAHILI_A1_ASSIGNMENTS = Object.freeze(
  SWAHILI_A1_PUBLISHED_LESSONS.filter((lesson) => !lesson.practiceOnly)
);
