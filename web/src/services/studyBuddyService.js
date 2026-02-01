import { addDoc, collection, db, isFirebaseConfigured, serverTimestamp } from "../firebase";
import { callAI } from "./aiClient";

export const requestStudyBuddyReply = async ({ message, level, idToken }) =>
  callAI({
    path: "/chatbuddy/respond",
    payload: {
      message,
      level,
    },
    idToken,
  });

export const logStudyBuddyUsage = async ({
  event,
  studentCode,
  studentEmail,
  className,
  userId,
  questionLength,
}) => {
  if (!event || !isFirebaseConfigured || !db) return null;

  const payload = {
    event,
    studentCode: studentCode || null,
    studentEmail: studentEmail || null,
    className: className || null,
    userId: userId || null,
    questionLength: Number.isFinite(questionLength) ? questionLength : null,
    createdAt: serverTimestamp(),
  };

  return addDoc(collection(db, "studyBuddyUsage"), payload);
};
