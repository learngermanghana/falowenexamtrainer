import { getInlineCourseAssignments } from "./courseLessonAssignments";
import {
  buildCanonicalAssignmentLockId,
  buildLegacyAssignmentLockId,
  buildLegacyChapterKey,
} from "./courseWorkbookSubmission";

export const buildWorkbookAssignmentList = ({ level, day, studentScopeKey }) =>
  getInlineCourseAssignments(level, day).map((assignment) => {
    const assignmentKey = assignment.assignmentKey;
    const legacyChapterKey = buildLegacyChapterKey({ chapter: assignment.chapter, day });
    return {
      assignment,
      assignmentKey,
      canonicalLockId: buildCanonicalAssignmentLockId({ studentScopeKey, assignmentKey }),
      day,
      legacyChapterKey,
      legacyLockId: buildLegacyAssignmentLockId({ studentScopeKey, level, chapterKey: legacyChapterKey }),
      level,
      studentScopeKey,
    };
  });
