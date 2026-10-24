import { getAuth } from "firebase/auth";
import { postMockAssessment } from "./mockAssessmentRequest";
import axios from "axios";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app } from "../firebase";
import { speakingQuestionDictionary } from "../data/speakingDictionary";
import { writingLetters as writingSheetLetters } from "../data/writingLetters";
import { normalizeWritingFeedback } from "../lib/writingFeedbackNormalizer";
import { getBackendUrl, getSpeakingApiUrl } from "./backendUrl";

const backendUrl = getBackendUrl();
const speakingApiUrl = getSpeakingApiUrl() || backendUrl;

export const TIMED_MOCK_SPEAKING_ANALYZE_TIMEOUT_MS = 30_000;

const createSpeakingAnalyzeTimeoutError = () => {
  const error = new Error(
    "Falowen could not finish transcribing this recording in time. Please try again.",
  );
  error.code = "SPEAKING_ANALYZE_TIMEOUT";
  return error;
};

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
    customMetadata: { uid: getAuth().currentUser?.uid || "" },
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
  taskId,
  interactionMode,
  userId,
  idToken,
  timeoutMs = null,
  transcriptionOnly = false,
  persistAudio = true,
}) => {
  const numericTimeoutMs = Number(timeoutMs);
  const hasTimeout =
    timeoutMs !== null &&
    timeoutMs !== undefined &&
    Number.isFinite(numericTimeoutMs) &&
    numericTimeoutMs > 0;
  const controller = hasTimeout ? new AbortController() : null;
  let timeoutId = null;

  const timeoutPromise = hasTimeout
    ? new Promise((_, reject) => {
        timeoutId = globalThis.setTimeout(() => {
          controller.abort();
          reject(createSpeakingAnalyzeTimeoutError());
        }, numericTimeoutMs);
      })
    : null;

  const requestTimeoutConfig = hasTimeout
    ? { signal: controller.signal, timeout: numericTimeoutMs }
    : {};

  const runAnalysis = async () => {
    let durableAudioUrl = "";
    const submitViaFirebaseUrl = async () => {
      const audioUrl = audioBlob ? await uploadSpeakingAudio(audioBlob) : "";
      durableAudioUrl = audioUrl;
      const payload = {
        teil,
        level,
        contextType,
        question,
        taskId,
        interactionMode,
        userId: userId || "guest",
        audioUrl,
        transcriptionOnly,
      };

      const response = await axios.post(`${speakingApiUrl}/speaking/analyze`, payload, {
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(idToken),
        },
        ...requestTimeoutConfig,
      });

      return { ...response.data, audioUrl };
    };

    const submitAsMultipartFallback = async () => {
      const formData = new FormData();
      const filename = audioBlob?.name || "recording.webm";
      formData.append("audio", audioBlob, filename);
      formData.append("teil", teil);
      if (transcriptionOnly) formData.append("transcriptionOnly", "true");
      formData.append("level", level);
      formData.append("userId", userId || "guest");

      if (contextType) formData.append("contextType", contextType);
      if (question) formData.append("question", question);
      if (taskId) formData.append("taskId", taskId);
      if (typeof interactionMode !== "undefined") {
        formData.append("interactionMode", interactionMode);
      }

      const response = await axios.post(`${speakingApiUrl}/speaking/analyze`, formData, {
        headers: {
          ...authHeaders(idToken),
        },
        ...requestTimeoutConfig,
      });

      return { ...response.data, audioUrl: durableAudioUrl || response.data?.audioUrl || "" };
    };

    // Ephemeral mock recordings go straight to the in-memory multipart handler.
    // Never upload these to Firebase Storage, including when the request fails.
    if (!audioBlob || !persistAudio) {
      return submitAsMultipartFallback();
    }

    try {
      return await submitViaFirebaseUrl();
    } catch (error) {
      if (
        hasTimeout &&
        (controller?.signal?.aborted || error?.code === "ECONNABORTED")
      ) {
        throw createSpeakingAnalyzeTimeoutError();
      }
      console.warn("Falling back to direct audio upload for speaking analyze", error);
      return submitAsMultipartFallback();
    }
  };

  if (!hasTimeout) {
    return runAnalysis();
  }

  try {
    return await Promise.race([runAnalysis(), timeoutPromise]);
  } finally {
    if (timeoutId) globalThis.clearTimeout(timeoutId);
  }
};


// A1 tutor checkpoints use direct multipart assessment, never Firebase Storage.
// Only the returned score and brief feedback are persisted in the workbook draft.
export const assessA1TutorSpeaking = async ({ audioBlob, assignmentKey, examPart, question, cardId, idToken }) => {
  const form = new FormData();
  form.append("audio", audioBlob, "a1-tutor-speaking.webm");
  form.append("level", "A1");
  form.append("teil", String(examPart));
  form.append("contextType", `A1 tutor checkpoint ${assignmentKey}`);
  form.append("question", question);
  if (cardId) form.append("cardId", cardId);
  const response = await axios.post(`${speakingApiUrl}/speaking/analyze`, form, {
    headers: authHeaders(idToken),
    timeout: 45000,
  });
  return response.data || {};
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

export const scoreA1MockSpeaking = async ({ attempts, attemptId, mockId = "a1-mock-01", idToken }) => {
  const response = await postMockAssessment(
    `${speakingApiUrl}/speaking/a1-mock-score`,
    { ...(examinerSessionIds !== undefined ? {examinerSessionIds} : {attempts}), attemptId, mockId },
    { headers: authHeaders(idToken) }
  );

  return response.data?.result || response.data;
};

export const scoreA2MockSpeaking = async ({ attempts, attemptId, idToken, mockId = "a2-mock-01", rubric, examinerSessionIds }) => {
  const response = await postMockAssessment(
    `${speakingApiUrl}/speaking/a2-mock-score`,
    { attempts, attemptId, mockId, rubric, ...(examinerSessionIds ? { examinerSessionIds } : {}) },
    { headers: authHeaders(idToken) }
  );

  return response.data?.result || response.data;
};

export const scoreB1MockSpeaking = async ({ attempts, examinerSessionIds, attemptId, idToken, mockId = "b1-mock-01" }) => {
  const response = await postMockAssessment(
    `${speakingApiUrl}/speaking/b1-mock-score`,
    { attempts, attemptId, mockId },
    { headers: authHeaders(idToken) }
  );

  return response.data?.result || response.data;
};

export const scoreB2MockSpeaking = async ({ attempts, selectedTopicId, idToken }) => {
  const response = await postMockAssessment(
    `${speakingApiUrl}/speaking/b2-mock-score`,
    { attempts, selectedTopicId },
    { headers: authHeaders(idToken) }
  );

  return response.data?.result || response.data;
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

export const markLetterWithAI = async ({ text, level, studentName, program, submissionContext, promptType, previousText, previousFeedback, taskId, taskContext, idToken }) => {
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
      taskId,
      taskContext,
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
