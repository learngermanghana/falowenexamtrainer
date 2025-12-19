import axios from "axios";
import { speakingSheetQuestions } from "../data/speakingSheet";
import { writingLetters as writingSheetLetters } from "../data/writingLetters";
import { fetchExamPrompts } from "./sheetContentService";

const backendUrl =
  process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:5000");

const authHeaders = (idToken) =>
  idToken
    ? {
        Authorization: `Bearer ${idToken}`,
      }
    : {};

export const analyzeAudio = async ({
  audioBlob,
  teil,
  level,
  contextType,
  question,
  interactionMode,
  userId,
  idToken,
}) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");
  formData.append("teil", teil);
  formData.append("level", level);
  formData.append("userId", userId || "guest");

  if (contextType) formData.append("contextType", contextType);
  if (question) formData.append("question", question);
  if (typeof interactionMode !== "undefined") {
    formData.append("interactionMode", interactionMode);
  }

  const response = await axios.post(`${backendUrl}/api/speaking/analyze`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...authHeaders(idToken),
    },
  });

  return response.data;
};

export const scoreInteractionAudio = async ({
  audioBlob,
  initialTranscript,
  followUpQuestion,
  teil,
  level,
  userId,
  targetLevel,
  idToken,
}) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "interaction-followup.webm");
  formData.append("initialTranscript", initialTranscript);
  formData.append("followUpQuestion", followUpQuestion);
  formData.append("teil", teil);
  formData.append("level", level);
  if (userId) formData.append("userId", userId);
  if (targetLevel) formData.append("targetLevel", targetLevel);

  const response = await axios.post(
    `${backendUrl}/api/speaking/interaction-score`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        ...authHeaders(idToken),
      },
    }
  );

  return response.data;
};

export const analyzeText = async ({ text, teil, level, targetLevel, userId, idToken }) => {
  const response = await axios.post(
    `${backendUrl}/api/speaking/analyze-text`,
    {
      text,
      teil,
      level,
      targetLevel,
      userId: userId || "guest",
    },
    {
      headers: authHeaders(idToken),
    }
  );

  return response.data;
};

export const markLetterWithAI = async ({ text, level, studentName, idToken }) => {
  const response = await axios.post(
    `${backendUrl}/api/writing/mark`,
    {
      text,
      level,
      studentName,
    },
    { headers: authHeaders(idToken) }
  );

  return response.data;
};

export const fetchIdeasFromCoach = async ({ messages, level, idToken }) => {
  const response = await axios.post(
    `${backendUrl}/api/writing/ideas`,
    { messages, level },
    { headers: authHeaders(idToken) }
  );

  return response.data;
};

export const fetchSpeakingQuestions = async (level, teil, idToken, options = {}) => {
  const normalizedLevel = (level || "").toUpperCase();
  const normalizedTeil = (teil || "").toLowerCase();
  const preferredTopic = (options.topic || "").toLowerCase();

  if (options.preferExamSheet) {
    try {
      const sourcePrompts = Array.isArray(options.examPrompts)
        ? options.examPrompts
        : await fetchExamPrompts();

      const filteredExamPrompts = sourcePrompts.filter((prompt) => {
        const matchesLevel = normalizedLevel
          ? !prompt.level || prompt.level === normalizedLevel
          : true;
        const matchesTeil = normalizedTeil
          ? prompt.teil?.toLowerCase() === normalizedTeil ||
            prompt.teil?.toLowerCase().includes(normalizedTeil)
          : true;
        const matchesTopic = preferredTopic
          ? (prompt.topic || "").toLowerCase() === preferredTopic
          : true;
        return matchesLevel && matchesTeil && matchesTopic;
      });

      if (filteredExamPrompts.length) {
        return filteredExamPrompts.map((prompt, idx) => ({
          id: prompt.id || `exam-${idx}`,
          level: prompt.level || normalizedLevel,
          teilId: prompt.teil || normalizedTeil,
          teilLabel: prompt.teil || teil,
          text: prompt.prompt || prompt.topic || "Prüfungsfrage", 
          hint: prompt.hint || prompt.topic || "",
          topic: prompt.topic || "Prüfung",
        }));
      }
    } catch (error) {
      console.error("Exam sheet fetch failed, falling back to local questions", error);
    }
  }

  const filtered = speakingSheetQuestions.filter((question) => {
    const matchesLevel = normalizedLevel ? question.level === normalizedLevel : true;
    const matchesTeil = normalizedTeil
      ? question.teilLabel?.toLowerCase() === normalizedTeil || question.teilId?.toLowerCase() === normalizedTeil
      : true;
    return matchesLevel && matchesTeil;
  });

  if (filtered.length > 0) {
    return filtered;
  }

  // fallback: return all questions for the level or the full list
  if (normalizedLevel) {
    const levelOnly = speakingSheetQuestions.filter((question) => question.level === normalizedLevel);
    if (levelOnly.length) return levelOnly;
  }

  return speakingSheetQuestions;
};

export const fetchWritingLetters = async (level, idToken) => {
  const normalizedLevel = (level || "").toUpperCase();
  const filtered = writingSheetLetters.filter((letter) =>
    normalizedLevel ? letter.level === normalizedLevel : true
  );

  if (filtered.length > 0) {
    return filtered;
  }

  return writingSheetLetters;
};

export const fetchBackendHealth = async () => {
  const response = await fetch(`${backendUrl}/health`);
  return response.json();
};

export const startPlacement = async ({ answers = [], userId, targetLevel, idToken }) => {
  const response = await axios.post(
    `${backendUrl}/api/tutor/placement`,
    {
      userId: userId || "guest",
      targetLevel,
      answers,
    },
    { headers: authHeaders(idToken) }
  );

  return response.data;
};

export const fetchNextTask = async ({ userId, idToken }) => {
  const response = await axios.get(
    `${backendUrl}/api/tutor/next-task?userId=${userId || "guest"}`,
    { headers: authHeaders(idToken) }
  );

  return response.data?.nextTask;
};
