import axios from "axios";
import {
  addDoc,
  collection,
  db,
  getDocs,
  isFirebaseConfigured,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "../firebase";

const backendUrl =
  process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:5000");

const getUserChatCollection = (userId) => {
  if (!userId) return null;
  return collection(db, "falowenChats", userId, "messages");
};

export const subscribeToChatMessages = (userId, callback) => {
  const chatRef = getUserChatCollection(userId);
  if (!isFirebaseConfigured || !chatRef) return () => {};

  const chatQuery = query(chatRef, orderBy("createdAt", "asc"));
  return onSnapshot(chatQuery, (snapshot) => {
    const rows = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        sender: data.sender,
        text: data.text,
        kind: data.kind || "text",
        createdAt: data.createdAt?.toDate?.() || null,
      };
    });
    callback(rows);
  });
};

export const appendChatMessages = async (userId, messages = []) => {
  const chatRef = getUserChatCollection(userId);
  if (!isFirebaseConfigured || !chatRef || !messages.length) return;

  await Promise.all(
    messages.map((message) =>
      addDoc(chatRef, {
        ...message,
        createdAt: message.createdAt || serverTimestamp(),
      })
    )
  );
};

export const ensureIntroMessage = async (userId, introMessage) => {
  const chatRef = getUserChatCollection(userId);
  if (!isFirebaseConfigured || !chatRef) return;

  const existing = await getDocs(query(chatRef, limit(1)));
  if (!existing.empty) return;

  await appendChatMessages(userId, [introMessage]);
};

export const requestFalowenReply = async ({ messages = [], level, studentName } = {}) => {
  const response = await axios.post(`${backendUrl}/api/falowen/chat`, {
    messages,
    level,
    studentName,
  });

  return response.data;
};
