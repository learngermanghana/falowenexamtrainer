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
const grammarIssueReportsCollection = (studentId) =>
  collection(db, "students", studentId, "grammar_issue_reports");

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

export const reportGrammarIssue = async ({ studentId, entry = {}, idToken }) => {
  if (!idToken) {
    throw new Error("Authentication token missing for issue reporting.");
  }
  if (!db || !studentId) {
    throw new Error("Missing student context for issue reporting.");
  }

  const payload = {
    studentId,
    answerId: entry.id || "",
    question: entry.question || "",
    answer: entry.answer || "",
    level: entry.level || "",
    responseLanguage: entry.responseLanguage || "",
    responseMode: entry.responseMode || "",
    promptTemplate: entry.promptTemplate || "",
    tags: Array.isArray(entry.tags) ? entry.tags : [],
    status: "open",
    source: "grammar-tab",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await addDoc(grammarIssueReportsCollection(studentId), payload);
  await addDoc(collection(db, "ai_issue_reports"), payload);
};
