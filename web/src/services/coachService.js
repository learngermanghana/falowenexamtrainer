import axios from "axios";
import { speakingSheetQuestions } from "../data/speakingSheet";
import { writingLetters as writingSheetLetters } from "../data/writingLetters";
import { getBackendUrl, getSpeakingApiUrl } from "./backendUrl";

const backendUrl = getBackendUrl();
const speakingApiUrl = getSpeakingApiUrl() || backendUrl;

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
  const filename = audioBlob?.name || "recording.webm";
  formData.append("audio", audioBlob, filename);
  formData.append("teil", teil);
  formData.append("level", level);
  formData.append("userId", userId || "guest");

  if (contextType) formData.append("contextType", contextType);
  if (question) formData.append("question", question);
  if (typeof interactionMode !== "undefined") {
    formData.append("interactionMode", interactionMode);
  }

  const response = await axios.post(`${speakingApiUrl}/speaking/analyze`, formData, {
    headers: {
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
    `${speakingApiUrl}/speaking/interaction-score`,
    formData,
    {
      headers: {
        ...authHeaders(idToken),
      },
    }
  );

  return response.data;
};

export const analyzeText = async ({ text, teil, level, targetLevel, userId, idToken }) => {
  const response = await axios.post(
    `${speakingApiUrl}/speaking/analyze-text`,
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
    `${backendUrl}/writing/mark`,
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
    `${backendUrl}/writing/ideas`,
    { messages, level },
    { headers: authHeaders(idToken) }
  );

  return response.data;
};

export const fetchSpeakingQuestions = async (level, teil, idToken) => {
  const normalizedLevel = (level || "").toUpperCase();
  const normalizedTeil = (teil || "").toLowerCase();

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
    `${backendUrl}/tutor/placement`,
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
    `${backendUrl}/tutor/next-task?userId=${userId || "guest"}`,
    { headers: authHeaders(idToken) }
  );

  return response.data?.nextTask;
};
