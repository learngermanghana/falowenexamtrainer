import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { getInlineCourseAssignments } from "../utils/courseLessonAssignments";
import {
  buildCanonicalAssignmentLockId,
  buildLegacyAssignmentLockId,
  buildLegacyChapterKey,
  buildWorkbookStudentScopeKey,
} from "../utils/courseWorkbookSubmission";

const normalize = (value) => String(value || "").trim().toLowerCase();

const useWorkbookSubmissionIdentity = (match) => {
  const { user, studentProfile } = useAuth();
  const level = String(match?.level || "").toUpperCase();
  const day = Number(match?.day);
  const assignment = useMemo(() => {
    const items = getInlineCourseAssignments(level, day);
    const chapter = normalize(match?.resource?.chapter);
    return items.find((item) => normalize(item.chapter) === chapter) || items[0] || null;
  }, [day, level, match?.resource?.chapter]);
  const assignmentKey = assignment?.assignmentKey || "";
  const studentCode = studentProfile?.studentCode || studentProfile?.studentcode || studentProfile?.id || "";
  const studentScopeKey = useMemo(
    () => buildWorkbookStudentScopeKey({ userId: user?.uid, studentCode, studentEmail: user?.email }),
    [studentCode, user?.email, user?.uid]
  );
  const legacyChapterKey = buildLegacyChapterKey({ chapter: assignment?.chapter || match?.resource?.chapter, day });

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
};

export default useWorkbookSubmissionIdentity;
