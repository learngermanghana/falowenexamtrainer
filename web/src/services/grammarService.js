import {
  addDoc,
  collection,
  db,
  doc,
  getDocs,
  limit,
  orderBy,
  serverTimestamp,
  startAfter,
  query,
  updateDoc,
} from "../firebase";
import { callAI } from "./aiClient";

const grammarAnswersCollection = (studentId) => collection(db, "students", studentId, "grammar_answers");

const toMillis = (value) => (value?.toMillis ? value.toMillis() : value || null);

const saveGrammarSubmission = async ({
  studentId,
  question,
  level,
  answer,
  normalizedQuestion = "",
  cleanedPrompt = "",
  responseLanguage = "de_only",
  responseMode = "short_exam",
  promptTemplate = "",
  tags = [],
}) => {
  if (!db || !studentId) return null;
  return addDoc(grammarAnswersCollection(studentId), {
    studentId,
    question,
    normalizedQuestion,
    cleanedPrompt,
    level,
    answer,
    responseLanguage,
    responseMode,
    promptTemplate,
    pinned: false,
    practiced: false,
    tags,
    issueReported: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const fetchGrammarHistory = async ({ studentId, pageSize = 10, cursor, idToken } = {}) => {
  if (!idToken) {
    throw new Error("Authentication token missing for grammar history.");
  }
  if (!db || !studentId) return { entries: [], nextCursor: null };

  const constraints = [orderBy("createdAt", "desc"), limit(pageSize)];
  if (cursor) constraints.push(startAfter(cursor));

  const snapshot = await getDocs(query(grammarAnswersCollection(studentId), ...constraints));
  const docs = snapshot.docs || [];
  const entries = docs.map((docSnapshot) => {
    const data = docSnapshot.data();
    return {
      id: docSnapshot.id,
      ...data,
      createdAt: toMillis(data.createdAt),
      updatedAt: toMillis(data.updatedAt),
    };
  });

  const nextCursor = docs.length === pageSize ? docs[docs.length - 1] : null;
  return { entries, nextCursor };
};

export async function askGrammarQuestion({
  question,
  cleanedPrompt,
  level,
  studentId,
  program,
  responseLanguage,
  responseMode,
  promptTemplate,
  idToken,
  timeoutMs = 20000,
}) {
  try {
    const response = await callAI({
      path: "/grammar/ask",
      payload: {
        question,
        cleanedPrompt,
        level,
        studentId,
        program,
        responseLanguage,
        responseMode,
        promptTemplate,
      },
      idToken,
      timeoutMs,
    });

    try {
      await saveGrammarSubmission({
        studentId,
        question,
        normalizedQuestion: cleanedPrompt || "",
        cleanedPrompt: response?.cleanedPrompt || cleanedPrompt || question,
        level,
        answer: response?.answer || "",
        responseLanguage,
        responseMode,
        promptTemplate,
      });
    } catch (loggingError) {
      console.error("Failed to save grammar submission", loggingError);
    }

    return response;
  } catch (error) {
    if (error.message === "The AI service took too long to respond. Please try again.") {
      throw new Error("The grammar coach took too long to respond. Please try again.");
    }

    throw error;
  }
}

export const updateGrammarHistoryEntry = async ({ studentId, entryId, patch }) => {
  if (!db || !studentId || !entryId || !patch || typeof patch !== "object") return;
  const targetRef = doc(db, "students", studentId, "grammar_answers", entryId);
  await updateDoc(targetRef, {
    ...patch,
    updatedAt: serverTimestamp(),
  });
};
