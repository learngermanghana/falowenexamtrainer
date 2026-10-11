// Shared by push and in-app senders. The marker is set in the same transaction
// as the deletion request and removed on recovery; it does not alter preferences.
const notificationsPaused = (student = {}) => student.notificationsPausedForDeletion === true || ["pending", "processing", "completed"].includes(student.accountDeletionStatus);
const currentNotificationStudent = async (db, studentDocId) => {
  const snapshot = await db.collection("students").doc(studentDocId).get();
  if (!snapshot.exists || notificationsPaused(snapshot.data())) return null;
  const student = snapshot.data();
  const deletion = await db.collection("accountDeletionRequests").doc(student.uid || studentDocId).get();
  if (["pending", "processing", "completed"].includes(deletion.data()?.status)) return null;
  return student;
};
module.exports = { notificationsPaused, currentNotificationStudent };
