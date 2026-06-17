import axios from "axios";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app } from "../firebase";
import { speakingQuestionDictionary } from "../data/speakingDictionary";
import { writingLetters as writingSheetLetters } from "../data/writingLetters";
import { normalizeWritingFeedback } from "../lib/writingFeedbackNormalizer";
import { getBackendUrl, getSpeakingApiUrl } from "./backendUrl";

const backendUrl = getBackendUrl();
const speakingApiUrl = getSpeakingApiUrl() || backendUrl;

const authHeaders = (idToken) =>
  idToken
    ? {
        Authorization: `Bearer ${idToken}`,
      }
    : {};

const buildSpeakingAudioPath = () => {
  const random = Math.random().toString(36).slice(2, 10);
  // Keep speaking uploads under the same Storage prefix covered by our
  // authenticated Firebase Storage rules.
  return `speech-trainer/speaking/${Date.now()}-${random}.webm`;
};

const uploadSpeakingAudio = async (audioBlob) => {
  if (!app) {
    throw new Error("Firebase is not configured for storage uploads.");
  }

  const storage = getStorage(app);
  const storageRef = ref(storage, buildSpeakingAudioPath());

  await uploadBytes(storageRef, audioBlob, {
    contentType: audioBlob?.type || "audio/webm",
    cacheControl: "private, max-age=0, no-cache",
  });

  return getDownloadURL(storageRef);
};

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
  const submitViaFirebaseUrl = async () => {
    const audioUrl = audioBlob ? await uploadSpeakingAudio(audioBlob) : "";
    const payload = {
      teil,
      level,
      contextType,
      question,
      interactionMode,
      userId: userId || "guest",
      audioUrl,
    };

    const response = await axios.post(`${speakingApiUrl}/speaking/analyze`, payload, {
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(idToken),
      },
    });

    return response.data;
  };

  const submitAsMultipartFallback = async () => {
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

  if (!audioBlob) {
    return submitAsMultipartFallback();
  }

  try {
    return await submitViaFirebaseUrl();
  } catch (error) {
    console.warn("Falling back to direct audio upload for speaking analyze", error);
    return submitAsMultipartFallback();
  }
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

const toLegacyRubric = (normalized) => {
  const rubric = Object.fromEntries(
    Object.entries(normalized?.rubric || {}).map(([key, value]) => [
      key,
      Number(value && typeof value === "object" ? value.score : value) || 0,
    ]),
  );

  if (!rubric.overall && Number(normalized?.score) > 0) {
    rubric.overall = Number(normalized.score);
  }

  return rubric;
};

export const markLetterWithAI = async ({ text, level, studentName, program, submissionContext, promptType, previousText, previousFeedback, idToken }) => {
  const response = await axios.post(
    `${backendUrl}/writing/mark`,
    {
      text,
      level,
      studentName,
      program,
      submissionContext,
      promptType,
      previousText,
      previousFeedback,
    },
    { headers: authHeaders(idToken) }
  );

  const raw = response.data || {};
  const normalized = normalizeWritingFeedback(raw?.structuredFeedback ?? raw);

  if (normalized.parseError) {
    const error = new Error(
      "Falowen could not read the AI feedback safely. Please retry; your writing is still here.",
    );
    error.code = "INVALID_WRITING_FEEDBACK";
    throw error;
  }

  return {
    ...raw,
    score: normalized.score,
    maxScore: normalized.maxScore,
    rubric: toLegacyRubric(normalized),
    corrections: normalized.corrections,
    structuredFeedback: normalized,
    feedback: normalized.summary || "Analysis completed.",
  };
};

export const fetchIdeasFromCoach = async ({ messages, level, program, idToken }) => {
  const response = await axios.post(
    `${backendUrl}/writing/ideas`,
    { messages, level, program },
    { headers: authHeaders(idToken) }
  );

  return response.data;
};

export const fetchSpeakingQuestions = async (level, teil, idToken) => {
  const normalizedLevel = (level || "").toUpperCase();
  const normalizedTeil = (teil || "").toLowerCase();

  const filtered = speakingQuestionDictionary.filter((question) => {
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
    const levelOnly = speakingQuestionDictionary.filter((question) => question.level === normalizedLevel);
    if (levelOnly.length) return levelOnly;
  }

  return speakingQuestionDictionary;
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
