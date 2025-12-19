export const collectionNames = {
  classBoard: "class_board",
  qaPosts: "qa_posts",
  attendance: "attendance",
  scores: "scores",
  students: "students",
  studentsV2: "students_v2",
  drafts: "drafts_v2",
  submissions: "submissions",
  submissionLocks: "submission_locks",
  chats: "falowen_chats",
};

export const firestoreCollections = {
  classBoardPosts: (level, className) => [
    collectionNames.classBoard,
    level,
    "classes",
    className,
    "posts",
  ],
  qaPosts: () => [collectionNames.qaPosts],
  attendanceSessions: (className) => [collectionNames.attendance, className, "sessions"],
  scores: () => [collectionNames.scores],
  students: () => [collectionNames.students],
  studentDoc: (studentCode) => [collectionNames.students, studentCode],
  studentMappingDoc: (uid) => [collectionNames.studentsV2, uid],
  submissions: (level) => [collectionNames.submissions, level, "posts"],
  submissionLockDoc: (lockId) => [collectionNames.submissionLocks, lockId],
  draftsForLesson: (studentCode, lessonKey) => [
    collectionNames.drafts,
    studentCode,
    "lessons",
    lessonKey,
  ],
  falowenChatMessages: (userId) => [collectionNames.chats, userId, "messages"],
};

export const legacyStudentKey = (profile = {}) =>
  profile.studentcode || profile.studentCode || profile.legacyStudentCode || null;
