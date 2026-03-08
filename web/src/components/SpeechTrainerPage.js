import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import {
  loadPresentationSessions,
  requestPresentationCoachReply,
  savePresentationSession,
  updatePresentationSession,
} from "../services/presentationCoachService";
import InlineSpeechTrainer from "./speechTrainer/InlineSpeechTrainer";
import { sendSpeechTrainerAttempt } from "../services/speechTrainerService";

const TURN_LIMIT = 6;
const MIN_ANSWER_LENGTH = 20;
const SESSION_HISTORY_PAGE_SIZE = 10;
const AUDIO_FALLBACK_CHAT_MESSAGE = "[Audio submission]";

const getInitialCoachMessage = (isA1A2, t) => ({
  role: "assistant",
  content: isA1A2 ? t("speechTrainer.initialCoachMessage.a1a2") : t("speechTrainer.initialCoachMessage.default"),
});

const extractTag = (text, tag) => {
  const match = String(text || "").match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match?.[1]?.trim() || "";
};

const extractAllTaggedFields = (text) => {
  const fields = [];
  const regex = /<([a-z_]+)>([\s\S]*?)<\/\1>/gi;
  let match = regex.exec(String(text || ""));
  while (match) {
    fields.push({ tag: match[1].toLowerCase(), value: match[2].trim() });
    match = regex.exec(String(text || ""));
  }
  return fields;
};

const normalizeLabel = (tag, t) =>
  ({
    question_de: t("speechTrainer.tags.nextQuestion"),
    feedback_en: t("speechTrainer.tags.feedback"),
    feedback_mix: t("speechTrainer.tags.feedback"),
    motivation_de: t("speechTrainer.tags.motivation"),
    vocab_explain: t("speechTrainer.tags.vocabulary"),
    progress_de: t("speechTrainer.tags.progress"),
    abschluss_de: t("speechTrainer.tags.closing"),
    praesentation_de: t("speechTrainer.tags.presentation"),
    script_short: t("speechTrainer.tags.shortScript"),
    script_medium: t("speechTrainer.tags.mediumScript"),
    script_long: t("speechTrainer.tags.longScript"),
    error_intel: t("speechTrainer.tags.errorIntelligence"),
    rubric: t("speechTrainer.tags.rubric"),
  }[tag] || tag.replace(/_/g, " "));

const extractErrorTags = (text) => {
  const normalized = String(text || "").toLowerCase();
  const tags = [];
  if (normalized.includes("article") || normalized.includes("artikel") || normalized.includes("case") || normalized.includes("kasus")) tags.push("article_case");
  if (normalized.includes("verb") && (normalized.includes("position") || normalized.includes("ende") || normalized.includes("zweit"))) tags.push("verb_position");
  if (normalized.includes("tense") || normalized.includes("tempus") || normalized.includes("perfekt") || normalized.includes("präteritum")) tags.push("tense_slip");
  return tags;
};

const parseRubric = (text) => {
  const raw = extractTag(text, "rubric");
  if (!raw) return null;
  const parts = raw.split("|").map((item) => item.trim());
  const parseScore = (label) => {
    const hit = parts.find((item) => item.toLowerCase().startsWith(label.toLowerCase()));
    if (!hit) return 0;
    const num = Number((hit.match(/(\d+)/) || [])[1] || 0);
    return Math.max(0, Math.min(5, num));
  };
  return {
    grammar: parseScore("grammar"),
    vocabulary: parseScore("vocabulary"),
    structure: parseScore("structure"),
  };
};

const scorePill = (label, value) => (
  <div style={{ ...styles.card, margin: 0, padding: "8px 10px", minWidth: 140 }} role="group" aria-label={`${label} rubric score`}>
    <div style={{ fontWeight: 700, fontSize: 13 }}>{label}</div>
    <div style={{ ...styles.helperText, margin: 0 }}>{value}/5</div>
  </div>
);

const PRIMARY_TAGS = ["question_de", "abschluss_de", "praesentation_de"];


const TOPIC_PRESET_META = [
  { emoji: "🏘️", fallback: "My hometown" },
  { emoji: "⚽", fallback: "My favorite hobby" },
  { emoji: "💼", fallback: "My dream job" },
  { emoji: "✈️", fallback: "A place I want to visit" },
  { emoji: "🍲", fallback: "Traditional food" },
  { emoji: "🎓", fallback: "My campus life" },
];

const renderAssistantContent = (content, isA1A2Level, t) => {
  const taggedFields = extractAllTaggedFields(content).filter((field) => field.value);
  if (!taggedFields.length) {
    return <div style={{ whiteSpace: "pre-wrap" }}>{content}</div>;
  }

  const hasAnyXml = /<([a-z_]+)>[\s\S]*?<\/\1>/i.test(String(content || ""));
  if (!hasAnyXml) {
    return <div style={{ whiteSpace: "pre-wrap" }}>{content}</div>;
  }

  const blockStyle = {
    padding: "8px 10px",
    borderRadius: 10,
    background: "#ffffff",
    border: "1px solid #dbeafe",
    display: "grid",
    gap: 4,
  };

  const primaryFields = taggedFields.filter((field) => PRIMARY_TAGS.includes(field.tag));
  const secondaryFields = taggedFields.filter((field) => !PRIMARY_TAGS.includes(field.tag));

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {(primaryFields.length ? primaryFields : taggedFields).map((field) => (
        <div key={`${field.tag}-${field.value.slice(0, 20)}`} style={blockStyle}>
          <strong style={{ fontSize: 12, color: "#1d4ed8", textTransform: "uppercase", letterSpacing: 0.3 }}>
            {normalizeLabel(field.tag, t)}
          </strong>
          <div style={{ whiteSpace: "pre-wrap" }}>{field.value}</div>
        </div>
      ))}
      {secondaryFields.length ? (
        <details style={{ ...blockStyle, background: "#f8fafc", borderColor: "#e5e7eb" }}>
          <summary style={{ cursor: "pointer", fontWeight: 600 }}>{isA1A2Level ? t("speechTrainer.moreHelpA1A2") : t("speechTrainer.moreHelp")}</summary>
          {isA1A2Level ? (
            <div style={{ fontSize: 12, color: "#475569", marginTop: 6 }}>
              {t("speechTrainer.moreHelpDescription")}
            </div>
          ) : null}
          <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
            {secondaryFields.map((field) => (
              <div key={`${field.tag}-${field.value.slice(0, 30)}`}>
                <strong style={{ fontSize: 12, color: "#1d4ed8", textTransform: "uppercase", letterSpacing: 0.3 }}>
                  {normalizeLabel(field.tag, t)}
                </strong>
                <div style={{ whiteSpace: "pre-wrap" }}>{field.value}</div>
              </div>
            ))}
          </div>
        </details>
      ) : null}
    </div>
  );
};

const SpeechTrainerPage = () => {
  const { t } = useTranslation();
  const { idToken, studentProfile } = useAuth();
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([getInitialCoachMessage(false, t)]);
  const [answersDone, setAnswersDone] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [retryablePayload, setRetryablePayload] = useState(null);
  const [error, setError] = useState("");
  const [errorType, setErrorType] = useState("");
  const [topic, setTopic] = useState("");
  const [finalScripts, setFinalScripts] = useState({ short: "", medium: "", long: "" });
  const [rubric, setRubric] = useState(null);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState("");
  const [sessionHistory, setSessionHistory] = useState([]);
  const [inlineAudioState, setInlineAudioState] = useState({ hasAudio: false, audioBlob: null, clearAudio: null });
  const [audioCoachStatus, setAudioCoachStatus] = useState("");
  const [audioCoachError, setAudioCoachError] = useState("");
  const [customTopicInput, setCustomTopicInput] = useState("");
  const [errorIntelExpanded, setErrorIntelExpanded] = useState(false);
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const chatLogRef = useRef(null);
  const autosaveTimerRef = useRef(null);
  const skipAutoRestoreRef = useRef(false);

  const level = useMemo(() => {
    const raw = String(studentProfile?.level || "A1").toUpperCase();
    return ["A1", "A2", "B1", "B2", "C1"].includes(raw) ? raw : "A1";
  }, [studentProfile?.level]);



  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return undefined;

    const mediaQuery = window.matchMedia("(max-width: 900px)");
    const applyViewportMode = (event) => setIsCompactViewport(event.matches);
    setIsCompactViewport(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", applyViewportMode);
      return () => mediaQuery.removeEventListener("change", applyViewportMode);
    }

    mediaQuery.addListener(applyViewportMode);
    return () => mediaQuery.removeListener(applyViewportMode);
  }, []);

  const isA1A2Level = level === "A1" || level === "A2";
  const topicPresets = useMemo(() => {
    const translated = t("speechTrainer.topicPresets", { returnObjects: true });
    const presets = Array.isArray(translated) ? translated : [];
    return TOPIC_PRESET_META.map((entry, index) => ({
      emoji: entry.emoji,
      label: presets[index] || entry.fallback,
    }));
  }, [t]);
  const flowStepsForLevel = useMemo(
    () =>
      isA1A2Level
        ? t("speechTrainer.flowSteps.a1a2", { returnObjects: true })
        : t("speechTrainer.flowSteps.default", { returnObjects: true }),
    [isA1A2Level, t]
  );

  const studentName =
    studentProfile?.firstName ||
    studentProfile?.displayName ||
    studentProfile?.name ||
    studentProfile?.fullName ||
    t("speechTrainer.studentFallbackName");
  const tutorName = t("speechTrainer.tutorName");

  const progressPercent = Math.min(100, Math.round((answersDone / TURN_LIMIT) * 100));
  const trimmedInput = chatInput.trim();
  const charsCount = trimmedInput.length;
  const hasText = Boolean(trimmedInput);
  const hasAudio = Boolean(inlineAudioState?.hasAudio && inlineAudioState?.audioBlob);
  const minLengthReached = charsCount >= MIN_ANSWER_LENGTH;
  const canSubmitText = hasText && minLengthReached;
  const canSubmitAudio = hasAudio;
  const canSubmitComposer = !loading && !completed && (canSubmitText || canSubmitAudio);
  const composerCtaLabel = hasAudio && hasText
    ? t("speechTrainer.composerSendTextAndRecording")
    : hasAudio
      ? t("speechTrainer.composerSendRecording")
      : t("speechTrainer.composerSendMessage");
  const currentStepLabel =
    flowStepsForLevel[Math.min(answersDone, TURN_LIMIT - 1)] || flowStepsForLevel[flowStepsForLevel.length - 1];
  const completedSteps = Math.min(answersDone + 1, TURN_LIMIT);
  const selectedTopicLabel = topic || customTopicInput.trim();
  const remainingQuestions = Math.max(0, TURN_LIMIT - answersDone);

  const getDynamicHelperText = useCallback((done) => {
    if (done <= 0) return t("speechTrainer.dynamicHelper.0");
    if (done === 1) return t("speechTrainer.dynamicHelper.1");
    if (done === 2) return t("speechTrainer.dynamicHelper.2");
    if (done === 3) return t("speechTrainer.dynamicHelper.3");
    if (done === 4) return t("speechTrainer.dynamicHelper.4");
    return t("speechTrainer.dynamicHelper.5");
  }, [t]);

  const classifyError = useCallback((requestError) => {
    const message = String(requestError?.message || "").toLowerCase();
    if (message.includes("unauthorized") || message.includes("forbidden") || message.includes("token") || message.includes("login")) {
      return "auth";
    }
    if (
      message.includes("failed to fetch") ||
      message.includes("network") ||
      message.includes("too long") ||
      message.includes("timed out") ||
      message.includes("503") ||
      message.includes("502") ||
      message.includes("429")
    ) {
      return "transient";
    }
    return "generic";
  }, []);

  const refreshHistory = useCallback(async () => {
    if (!idToken) return;
    try {
      const response = await loadPresentationSessions({ idToken, limit: SESSION_HISTORY_PAGE_SIZE });
      setSessionHistory(Array.isArray(response?.sessions) ? response.sessions : []);
    } catch (historyError) {
      console.warn("Could not load presentation session history", historyError);
    }
  }, [idToken]);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  const restoreSessionFromFirestore = useCallback(
    (session) => {
      if (!session?.id) return;
      const restoredHistory = Array.isArray(session.chatHistory)
        ? session.chatHistory
            .map((entry) => ({ role: entry?.role === "user" ? "user" : "assistant", content: String(entry?.content || "").trim() }))
            .filter((entry) => entry.content)
            .slice(-30)
        : [];

      if (restoredHistory.length) {
        setChatMessages(restoredHistory);
      } else {
        setChatMessages([getInitialCoachMessage(isA1A2Level, t)]);
      }

      setActiveSessionId(session.id);
      setTopic(String(session.topic || ""));
      const done = Math.max(0, Math.min(TURN_LIMIT, Number(session.answersDone) || 0));
      setAnswersDone(done);
      const isDone = String(session.completionStatus || "").toLowerCase() === "completed";
      setCompleted(isDone);
      setSessionSaved(isDone);
      setChatInput("");

      const savedRubric = session?.rubric
        ? {
            grammar: Number(session.rubric.grammar || 0),
            vocabulary: Number(session.rubric.vocabulary || 0),
            structure: Number(session.rubric.structure || 0),
          }
        : null;
      setRubric(savedRubric);
      const savedFinalScript = String(session.finalScript || "").trim();
      setFinalScripts((prev) => ({
        short: prev.short || "",
        medium: prev.medium || "",
        long: savedFinalScript || prev.long || "",
      }));
    },
    [isA1A2Level, t]
  );


  useEffect(() => {
    const lastMessage = chatLogRef.current?.lastElementChild;
    if (lastMessage?.scrollIntoView) {
      lastMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [chatMessages]);

  const submitMessage = async (payload, attempt = 0) => {
    setError("");
    setErrorType("");
    setLoading(true);
    setRetryablePayload({ ...payload, messageAlreadyAppended: true });

    const nextUserMessage = { role: "user", content: payload.userMessageContent || payload.message };
    const priorHistory = payload.history;

    if (!payload.messageAlreadyAppended) {
      setChatMessages((prev) => [...prev, nextUserMessage]);
      setChatInput("");
    }

    try {
      const coachingHistory = isA1A2Level
        ? [...priorHistory, { role: "assistant", content: t("speechTrainer.coachStyleA1A2") }]
        : priorHistory;

      const response = await requestPresentationCoachReply({
        message: payload.message,
        level,
        history: coachingHistory,
        idToken,
      });

      const coachReply = response?.reply || "";
      setChatMessages((prev) => [...prev, { role: "assistant", content: coachReply }]);
      setAnswersDone(response?.answersDone || 0);
      const isCompleted = Boolean(response?.completed);
      setCompleted(isCompleted);

      if (isCompleted) {
        setRubric(parseRubric(coachReply));
        setFinalScripts({
          short: extractTag(coachReply, "script_short"),
          medium: extractTag(coachReply, "script_medium"),
          long: extractTag(coachReply, "script_long"),
        });
      }
    } catch (requestError) {
      console.error("Presentation chat error", requestError);
      const type = classifyError(requestError);
      if (type === "transient" && attempt === 0) {
        setTimeout(() => {
          submitMessage(payload, 1);
        }, 1200);
        return;
      }
      setErrorType(type);
      if (type === "auth") {
        setError(t("speechTrainer.errors.auth"));
      } else if (type === "transient") {
        setError(t("speechTrainer.errors.transient"));
      } else {
        setError(requestError?.message || t("speechTrainer.errors.generic"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!trimmedInput || loading || completed) return;
    if (trimmedInput.length < MIN_ANSWER_LENGTH) {
      setError(t("speechTrainer.errors.minLength", { minLength: MIN_ANSWER_LENGTH, tutorName }));
      return;
    }

    const history = chatMessages.map(({ role, content }) => ({ role, content }));
    await submitMessage({ message: trimmedInput, history });
  };

  const handleSendRecording = async () => {
    if (!inlineAudioState?.audioBlob || loading) return;

    try {
      setAudioCoachError("");
      setAudioCoachStatus(t("speechTrainer.audioSendingStatus"));
      const response = await sendSpeechTrainerAttempt({
        audioBlob: inlineAudioState.audioBlob,
        note: trimmedInput,
        level,
        idToken,
      });

      const transcript = String(response?.transcript || "").trim();
      const note = trimmedInput;
      const messageForCoach = note || transcript || AUDIO_FALLBACK_CHAT_MESSAGE;
      const hasCoachMessage = messageForCoach.length >= MIN_ANSWER_LENGTH;

      const feedbackParts = [
        transcript ? `${t("speechTrainer.audioTranscriptLabel")}: ${transcript}` : "",
        response?.feedback || response?.notes || response?.summary
          ? `${t("speechTrainer.audioFeedbackLabel")}: ${response.feedback || response?.notes || response?.summary}`
          : "",
        response?.nextSteps || response?.actions
          ? `${t("speechTrainer.audioNextStepsLabel")}: ${response.nextSteps || response?.actions}`
          : "",
      ].filter(Boolean);

      if (!completed && hasCoachMessage) {
        const history = chatMessages.map(({ role, content }) => ({ role, content }));
        const userMessageContent = note && transcript && note !== transcript
          ? `${note}\n\n${t("speechTrainer.audioTranscriptLabel")}: ${transcript}`
          : messageForCoach;
        await submitMessage({ message: messageForCoach, history, userMessageContent });
      } else if (feedbackParts.length) {
        setChatMessages((prev) => [...prev, { role: "assistant", content: feedbackParts.join("\n\n"), meta: { type: "audio_feedback" } }]);
      }

      setAudioCoachStatus(completed ? t("speechTrainer.audioAssessmentReadyStatus") : t("speechTrainer.audioReadyStatus"));
      if (inlineAudioState?.clearAudio) inlineAudioState.clearAudio();
      if (trimmedInput) setChatInput("");
    } catch (submitError) {
      const backendError =
        submitError?.response?.data?.error ||
        submitError?.response?.data?.message ||
        submitError?.message ||
        t("speechTrainer.audioFallbackError");
      setAudioCoachError(String(backendError));
      setAudioCoachStatus("");
    }
  };

  const handleComposerSubmit = async () => {
    if (!canSubmitComposer) return;
    if (canSubmitAudio) {
      await handleSendRecording();
      return;
    }
    if (canSubmitText) {
      await handleSend();
    }
  };

  const handleRetry = async () => {
    if (!retryablePayload || loading || completed) return;
    await submitMessage(retryablePayload);
  };

  const handleTopicPresetClick = async (presetTopic) => {
    if (loading || completed) return;
    setTopic(presetTopic);
    const message = isA1A2Level
      ? t("speechTrainer.topicSelectedA1A2", { presetTopic })
      : t("speechTrainer.topicSelected", { presetTopic });
    const history = chatMessages.map(({ role, content }) => ({ role, content }));
    await submitMessage({ message, history });
  };

  const handleStartWithCustomTopic = async () => {
    const selectedTopic = customTopicInput.trim();
    if (!selectedTopic || loading || completed) return;
    await handleTopicPresetClick(selectedTopic);
  };


  const handleReset = () => {
    const hasContent = chatMessages.length > 1 || chatInput.trim();
    if (hasContent && !window.confirm(t("speechTrainer.confirmReset"))) return;

    skipAutoRestoreRef.current = true;
    setChatMessages([getInitialCoachMessage(isA1A2Level, t)]);
    setChatInput("");
    setAnswersDone(0);
    setCompleted(false);
    setLoading(false);
    setError("");
    setErrorType("");
    setTopic("");
    setRubric(null);
    setFinalScripts({ short: "", medium: "", long: "" });
    setCustomTopicInput("");
    setSessionSaved(false);
    setActiveSessionId("");
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      handleReset();
      return;
    }
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    const persistSession = async () => {
      if (!idToken) return;

      const hasMeaningfulActivity = answersDone > 0 || chatMessages.some((message) => message.role === "user" && String(message.content || "").trim());
      if (!hasMeaningfulActivity) return;

      const finalScript = finalScripts.long || finalScripts.medium || finalScripts.short || extractTag(chatMessages.at(-1)?.content, "praesentation_de") || "";
      const errorIntel = extractTag(chatMessages.at(-1)?.content, "error_intel");
      const inferredTags = extractErrorTags(errorIntel);
      const filteredChatHistory = chatMessages
        .map(({ role, content }) => ({ role, content: String(content || "").trim() }))
        .filter((entry) => entry.content)
        .slice(-30);

      if (!filteredChatHistory.length) return;

      const basePayload = {
        topic: topic || t("speechTrainer.customTopic"),
        level,
        finalScript,
        chatHistory: filteredChatHistory,
        answersDone,
        commonErrorTags: inferredTags,
        completionStatus: completed ? "completed" : "in_progress",
        rubric: rubric || {
          grammar: 0,
          vocabulary: 0,
          structure: 0,
        },
        studentName,
        tutorName,
      };

      try {
        if (activeSessionId) {
          await updatePresentationSession({
            idToken,
            sessionId: activeSessionId,
            payload: basePayload,
          });
        } else {
          const response = await savePresentationSession({
            idToken,
            payload: basePayload,
          });
          if (response?.id) setActiveSessionId(response.id);
        }
        if (completed) setSessionSaved(true);
        refreshHistory();
      } catch (persistError) {
        console.error("Failed to save presentation session", persistError);
      }
    };

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(() => {
      persistSession();
    }, 900);

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
        autosaveTimerRef.current = null;
      }
    };
  }, [completed, sessionSaved, idToken, topic, level, finalScripts, rubric, chatMessages, studentName, tutorName, t, refreshHistory, activeSessionId, answersDone]);

  useEffect(() => {
    if (skipAutoRestoreRef.current) {
      skipAutoRestoreRef.current = false;
      return;
    }
    if (!sessionHistory.length || activeSessionId || answersDone > 0 || chatMessages.length > 1 || chatInput.trim()) return;
    const openSession = [...sessionHistory].find(
      (session) => String(session.completionStatus || "").toLowerCase() !== "completed" && Array.isArray(session.chatHistory) && session.chatHistory.length
    );
    if (openSession) restoreSessionFromFirestore(openSession);
  }, [sessionHistory, activeSessionId, answersDone, chatMessages, chatInput, restoreSessionFromFirestore]);
  useEffect(() => () => {
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
  }, []);

  return (
    <div style={{ display: "grid", gap: 12, marginInline: isCompactViewport ? -12 : 0 }}>
      <div style={{ ...styles.card, display: "grid", gap: 10, borderRadius: isCompactViewport ? 0 : styles.card.borderRadius }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
          <h2 style={{ ...styles.sectionTitle, margin: 0 }}>{t("speechTrainer.title")}</h2>
          <span style={styles.helperText}>Level: {level}</span>
        </div>
        <div style={{ ...styles.card, margin: 0, background: "#f8fafc", border: "1px solid #e2e8f0", display: "grid", gap: 8 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>{t("speechTrainer.progress", { answersDone: completedSteps, turnLimit: TURN_LIMIT, currentStepLabel })}</p>
          <div style={{ width: "100%", height: 8, background: "#e5e7eb", borderRadius: 999, overflow: "hidden" }} role="progressbar" aria-label={t("speechTrainer.progressAria")} aria-valuemin={0} aria-valuemax={TURN_LIMIT} aria-valuenow={answersDone}>
            <div style={{ width: `${progressPercent}%`, height: "100%", background: answersDone >= TURN_LIMIT ? "#22c55e" : "#f97316", transition: "width 180ms ease" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8 }}>
            {flowStepsForLevel.map((step, index) => {
              const active = index === answersDone;
              const done = index < answersDone;
              return (
                <div key={step} style={{ ...styles.card, margin: 0, padding: "10px 12px", background: active ? "#fff7ed" : done ? "#ecfdf5" : "#f8fafc", border: active ? "1px solid #fb923c" : done ? "1px solid #86efac" : "1px solid #e2e8f0" }}>
                  <div style={{ fontWeight: 700, color: active ? "#ea580c" : done ? "#166534" : "#64748b" }}>{index + 1}</div>
                  <div style={{ fontSize: 14, color: active ? "#c2410c" : "#334155" }}>{step}</div>
                </div>
              );
            })}
          </div>
        </div>

        {!answersDone ? (
          <div style={{ ...styles.filterPanel, margin: 0, display: "grid", gap: 10 }}>
            <strong style={{ fontSize: 16 }}>{t("speechTrainer.initialCoachMessage.default")}</strong>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
              {topicPresets.map((presetTopic) => (
                <button
                  key={presetTopic.label}
                  type="button"
                  style={{ ...styles.secondaryButton, padding: "16px", minHeight: 90, textAlign: "left", display: "grid", gap: 8 }}
                  onClick={() => handleTopicPresetClick(presetTopic.label)}
                  disabled={loading}
                >
                  <span style={{ fontSize: 24 }}>{presetTopic.emoji}</span>
                  <span style={{ fontWeight: 700 }}>{presetTopic.label}</span>
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input
                value={customTopicInput}
                onChange={(event) => setCustomTopicInput(event.target.value)}
                placeholder={t("speechTrainer.customTopic")}
                style={{ ...styles.input, flex: "1 1 240px" }}
                disabled={loading || completed}
              />
              <button type="button" style={styles.primaryButton} onClick={handleStartWithCustomTopic} disabled={!customTopicInput.trim() || loading || completed}>
                Start
              </button>
            </div>
          </div>
        ) : null}
        <div style={{ display: "grid", gap: 6 }}>
          <div style={{ ...styles.helperText, margin: 0 }}>{selectedTopicLabel ? `Topic: ${selectedTopicLabel}` : ""}</div>
          <div style={{ ...styles.helperText, margin: 0 }}>{getDynamicHelperText(answersDone)}</div>
          <div style={{ ...styles.card, margin: 0, background: "#fff7ed", border: "1px solid #fdba74", color: "#9a3412" }}>
            {`Noch ${remainingQuestions} Frage(n)`}
          </div>
        </div>

        <div
          style={{ ...styles.chatLog, border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, maxHeight: "55vh" }}
          aria-live="polite"
          ref={chatLogRef}
        >
          {chatMessages.map((message, index) => {
            const isUser = message.role === "user";
            return (
              <div key={`${message.role}-${index}`} style={{ display: "grid", gap: 6, justifyItems: isUser ? "end" : "start" }}>
                <div style={{ ...(isUser ? styles.chatBubbleUser : styles.chatBubbleCoach), maxWidth: "min(92%, 680px)", borderBottomRightRadius: isUser ? 6 : 14, borderBottomLeftRadius: isUser ? 14 : 6 }}>
                  {isUser ? <div style={{ whiteSpace: "pre-wrap" }}>{message.content}</div> : renderAssistantContent(message.content, isA1A2Level, t)}
                  {message?.meta?.type === "upgrade" && message?.meta?.why ? (
                    <details style={{ marginTop: 8 }}>
                      <summary style={{ cursor: "pointer" }}>{t("speechTrainer.whyUpgrade")}</summary>
                      <p style={{ ...styles.helperText, margin: "6px 0 0" }}>{message.meta.why}</p>
                    </details>
                  ) : null}
                </div>
                {!isUser && extractTag(message.content, "error_intel") ? (
                  <div style={{ ...styles.card, margin: 0, background: "#fef2f2", border: "1px solid #fca5a5", display: "grid", gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => setErrorIntelExpanded((prev) => !prev)}
                      style={{ background: "transparent", border: "none", textAlign: "left", padding: 0, cursor: "pointer", color: "#991b1b", fontWeight: 700 }}
                    >
                      {t("speechTrainer.tags.errorIntelligence")} {errorIntelExpanded ? "▾" : "▸"}
                    </button>
                    <p style={{ ...styles.helperText, margin: 0 }}>{extractTag(message.content, "error_intel")}</p>

                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {completed && rubric ? (
          <div style={{ ...styles.card, margin: 0, background: "#eff6ff", display: "grid", gap: 8 }}>
            <strong style={{ fontSize: 14 }}>{t("speechTrainer.rubricTitle")}</strong>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }} aria-label={t("speechTrainer.rubricScoresAria")}>
              {scorePill(t("speechTrainer.rubric.grammar"), rubric.grammar)}
              {scorePill(t("speechTrainer.rubric.vocabulary"), rubric.vocabulary)}
              {scorePill(t("speechTrainer.rubric.structure"), rubric.structure)}
            </div>
          </div>
        ) : null}

        {completed ? (
          <div style={{ ...styles.card, margin: 0, background: "#ecfdf5", display: "grid", gap: 8 }}>
            <strong style={{ fontSize: 14 }}>{t("speechTrainer.outputTitle")}</strong>
            {finalScripts.short ? <div><strong>{t("speechTrainer.scriptLabels.short")}</strong><p style={{ margin: "4px 0 0" }}>{finalScripts.short}</p></div> : null}
            {finalScripts.medium ? <div><strong>{t("speechTrainer.scriptLabels.medium")}</strong><p style={{ margin: "4px 0 0" }}>{finalScripts.medium}</p></div> : null}
            {finalScripts.long ? <div><strong>{t("speechTrainer.scriptLabels.long")}</strong><p style={{ margin: "4px 0 0" }}>{finalScripts.long}</p></div> : null}
          </div>
        ) : null}

        <div style={{ ...styles.card, margin: 0, display: "grid", gap: 8 }}>
          <textarea
            value={chatInput}
            onChange={(event) => setChatInput(event.target.value)}
            onKeyDown={handleInputKeyDown}
            rows={4}
            style={styles.textareaSmall}
            placeholder={isA1A2Level ? t("speechTrainer.placeholderA1A2") : t("speechTrainer.placeholder")}
            disabled={loading || completed}
          />
          <div style={{ ...styles.helperText, margin: 0 }} aria-live="polite">
            {t("speechTrainer.charCounter", { charsCount, minLength: MIN_ANSWER_LENGTH })}
          </div>
          <div style={{ width: "100%", height: 6, background: "#e5e7eb", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ width: `${Math.min((charsCount / MIN_ANSWER_LENGTH) * 100, 100)}%`, height: "100%", background: minLengthReached ? "#16a34a" : "#f59e0b" }} />
          </div>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <InlineSpeechTrainer profileLevel={level} compact onAudioStateChange={setInlineAudioState} />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", flexDirection: isCompactViewport ? "column" : "row" }}>
            <button
              type="button"
              style={{ ...styles.primaryButton, width: isCompactViewport ? "100%" : "auto" }}
              onClick={handleComposerSubmit}
              disabled={!canSubmitComposer}
              aria-label={t("speechTrainer.sendAria")}
            >
              {loading ? t("speechTrainer.sending", { tutorName }) : `${composerCtaLabel} at Level ${level}`}
            </button>
            <button
              type="button"
              style={{ ...styles.secondaryButton, width: isCompactViewport ? "100%" : "auto" }}
              onClick={handleReset}
              aria-label={t("speechTrainer.resetAria")}
              disabled={loading}
            >
              {t("speechTrainer.reset")}
            </button>
            {errorType === "auth" ? (
              <button type="button" style={styles.secondaryButton} onClick={() => window.location.assign("/login")} aria-label={t("speechTrainer.reloginAria")}>
                {t("speechTrainer.relogin")}
              </button>
            ) : null}
            {error ? (
              <button type="button" style={styles.secondaryButton} onClick={handleRetry} disabled={!retryablePayload || loading} aria-label={t("speechTrainer.retryAria")}>
                {t("speechTrainer.retry")}
              </button>
            ) : null}
          </div>
          <div style={{ ...styles.helperText, margin: 0 }} aria-live="polite">
            {audioCoachStatus || (hasAudio ? t("speechTrainer.composerStatusHintRecordingPriority") : t("speechTrainer.composerStatusHint"))}
          </div>
          {completed && !hasAudio ? (
            <p style={{ ...styles.helperText, margin: 0, color: "#065f46" }}>
              🏆 {t("speechTrainer.completedMessage")}
            </p>
          ) : null}
          {audioCoachError ? <p style={{ ...styles.helperText, margin: 0, color: "#b91c1c" }}>{audioCoachError}</p> : null}
          {error ? <p style={{ ...styles.helperText, margin: 0, color: "#b91c1c" }}>{error}</p> : null}
        </div>
      </div>

    </div>
  );
};

export default SpeechTrainerPage;
