export const firestoreCollections = {
  classBoardPosts: (level, className) => ["class_board", level, "classes", className, "posts"],
  qaPosts: () => ["qa_posts"],
  attendanceSessions: (className) => ["attendance", className, "sessions"],
  submissions: (level) => ["submissions", level, "posts"],
  students: () => ["students"],
  falowenChatMessages: (userId) => ["falowen_chats", userId, "messages"],
};
