export const firestoreCollections = {
  classBoardPosts: (level, className) => ["class_board", level, "classes", className, "posts"],
  qaPosts: () => ["qa_posts"],
  attendanceSessions: (className) => ["attendance", className, "sessions"],
  scores: () => ["scores"],
  students: () => ["students"],
  falowenChatMessages: (userId) => ["falowenChats", userId, "messages"],
};
