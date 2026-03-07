import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import {
  loadPresentationSessions,
  deletePresentationSession,
  deleteAllPresentationSessions,
  requestPresentationCoachReply,
  requestPresentationUpgrade,
  savePresentationSession,
  updatePresentationSession,
} from "../services/presentationCoachService";
import InlineSpeechTrainer from "./speechTrainer/InlineSpeechTrainer";
import { sendSpeechTrainerAttempt } from "../services/speechTrainerService";
import { useToast } from "../context/ToastContext";

const TURN_LIMIT = 6;
const MIN_ANSWER_LENGTH = 20;
const SESSION_HISTORY_PAGE_SIZE = 10;
const DELETE_UNDO_MS = 8000;

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
  const { showToast } = useToast();
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
  const [upgradeLoadingByIndex, setUpgradeLoadingByIndex] = useState({});
  const [selectedUpgradesByIndex, setSelectedUpgradesByIndex] = useState({});
  const [historyFilter, setHistoryFilter] = useState({ topic: "", level: "" });
  const [deletingSessionId, setDeletingSessionId] = useState("");
  const [deletingAllSessions, setDeletingAllSessions] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [historyNextCursor, setHistoryNextCursor] = useState("");
  const [historyHasMore, setHistoryHasMore] = useState(false);
  const [historyLoadingMore, setHistoryLoadingMore] = useState(false);
  const [inlineAudioState, setInlineAudioState] = useState({ hasAudio: false, audioBlob: null, clearAudio: null });
  const [audioCoachStatus, setAudioCoachStatus] = useState("");
  const [audioCoachError, setAudioCoachError] = useState("");
  const chatLogRef = useRef(null);
  const autosaveTimerRef = useRef(null);
  const pendingDeleteTimerRef = useRef(null);

  const level = useMemo(() => {
    const raw = String(studentProfile?.level || "A1").toUpperCase();
    return ["A1", "A2", "B1", "B2", "C1"].includes(raw) ? raw : "A1";
  }, [studentProfile?.level]);


  const isA1A2Level = level === "A1" || level === "A2";
  const topicPresets = useMemo(() => t("speechTrainer.topicPresets", { returnObjects: true }), [t]);
  const flowStepsForLevel = useMemo(
    () =>
      isA1A2Level
        ? t("speechTrainer.flowSteps.a1a2", { returnObjects: true })
        : t("speechTrainer.flowSteps.default", { returnObjects: true }),
    [isA1A2Level, t]
  );
  const upgradeOptions = useMemo(() => t("speechTrainer.upgradeOptions", { returnObjects: true }), [t]);

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
  const composerCtaLabel = hasText && hasAudio
    ? t("speechTrainer.composerSendTextAndRecording")
    : hasAudio
      ? t("speechTrainer.composerSendRecording")
      : t("speechTrainer.composerSendMessage");
  const currentStepLabel =
    flowStepsForLevel[Math.min(answersDone, TURN_LIMIT - 1)] || flowStepsForLevel[flowStepsForLevel.length - 1];

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
      setHistoryNextCursor(String(response?.nextCursor || ""));
      setHistoryHasMore(Boolean(response?.hasMore));
    } catch (historyError) {
      console.warn("Could not load presentation session history", historyError);
    }
  }, [idToken]);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);


  const loadMoreHistory = useCallback(async () => {
    if (!idToken || !historyHasMore || !historyNextCursor || historyLoadingMore) return;
    try {
      setHistoryLoadingMore(true);
      const response = await loadPresentationSessions({
        idToken,
        limit: SESSION_HISTORY_PAGE_SIZE,
        startAfter: historyNextCursor,
      });
      const nextSessions = Array.isArray(response?.sessions) ? response.sessions : [];
      setSessionHistory((prev) => {
        const seen = new Set(prev.map((session) => session.id));
        const merged = [...prev];
        nextSessions.forEach((session) => {
          if (!seen.has(session.id)) merged.push(session);
        });
        return merged;
      });
      setHistoryNextCursor(String(response?.nextCursor || ""));
      setHistoryHasMore(Boolean(response?.hasMore));
    } catch (historyError) {
      console.warn("Could not load more presentation sessions", historyError);
    } finally {
      setHistoryLoadingMore(false);
    }
  }, [idToken, historyHasMore, historyNextCursor, historyLoadingMore]);

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

    const nextUserMessage = { role: "user", content: payload.message };
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
    if (!inlineAudioState?.audioBlob || loading || completed) return;

    try {
      setAudioCoachError("");
      setAudioCoachStatus(t("speechTrainer.audioSendingStatus"));
      const response = await sendSpeechTrainerAttempt({
        audioBlob: inlineAudioState.audioBlob,
        note: trimmedInput,
        level,
        idToken,
      });
      const feedbackParts = [
        response?.transcript ? `${t("speechTrainer.audioTranscriptLabel")}: ${response.transcript}` : "",
        response?.feedback || response?.notes || response?.summary
          ? `${t("speechTrainer.audioFeedbackLabel")}: ${response.feedback || response?.notes || response?.summary}`
          : "",
        response?.nextSteps || response?.actions
          ? `${t("speechTrainer.audioNextStepsLabel")}: ${response.nextSteps || response?.actions}`
          : "",
      ].filter(Boolean);
      if (feedbackParts.length) {
        setChatMessages((prev) => [...prev, { role: "assistant", content: feedbackParts.join("

"), meta: { type: "audio_feedback" } }]);
      }
      setAudioCoachStatus(t("speechTrainer.audioReadyStatus"));
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
    if (canSubmitText) {
      await handleSend();
    }
    if (canSubmitAudio) {
      await handleSendRecording();
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

  const handleUpgrade = async ({ message, index, mode, label }) => {
    if (loading || !message?.content) return;
    setUpgradeLoadingByIndex((prev) => ({ ...prev, [index]: mode }));
    try {
      const response = await requestPresentationUpgrade({
        answer: message.content,
        level,
        mode,
        idToken,
      });
      const upgraded = extractTag(response?.reply || "", "upgrade_de") || response?.reply || "";
      const why = extractTag(response?.reply || "", "why_en");
      setChatMessages((prev) => [...prev, { role: "assistant", content: t("speechTrainer.upgradeResult", { label, upgraded }), meta: { type: "upgrade", why } }]);
    } catch (upgradeError) {
      setError(upgradeError?.message || t("speechTrainer.errors.upgrade"));
    } finally {
      setUpgradeLoadingByIndex((prev) => ({ ...prev, [index]: "" }));
    }
  };

  const handleToggleUpgradeMode = (index, mode) => {
    setSelectedUpgradesByIndex((prev) => {
      const activeModes = new Set(prev[index] || []);
      if (activeModes.has(mode)) activeModes.delete(mode);
      else activeModes.add(mode);
      return { ...prev, [index]: Array.from(activeModes) };
    });
  };

  const handleApplySelectedUpgrades = async (message, index) => {
    const selectedModes = selectedUpgradesByIndex[index] || [];
    if (!selectedModes.length || loading) return;

    for (const mode of selectedModes) {
      const option = upgradeOptions.find((item) => item.mode === mode);
      // eslint-disable-next-line no-await-in-loop
      await handleUpgrade({ message, index, mode, label: option?.label || mode });
    }
  };

  const handleReset = () => {
    const hasContent = chatMessages.length > 1 || chatInput.trim();
    if (hasContent && !window.confirm(t("speechTrainer.confirmReset"))) return;

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
    setSessionSaved(false);
    setActiveSessionId("");
  };

  const finalizePendingDelete = useCallback(async (pending) => {
    if (!pending?.session?.id) return;
    try {
      setDeletingSessionId(pending.session.id);
      await deletePresentationSession({ sessionId: pending.session.id, idToken });
    } catch (deleteError) {
      setSessionHistory((prev) => [pending.session, ...prev]);
      setError(deleteError?.message || t("speechTrainer.deleteSessionError"));
    } finally {
      setDeletingSessionId("");
      setPendingDelete((current) => (current?.session?.id === pending.session.id ? null : current));
    }
  }, [idToken, t]);

  const handleUndoDelete = useCallback(() => {
    if (!pendingDelete) return;
    if (pendingDeleteTimerRef.current) {
      clearTimeout(pendingDeleteTimerRef.current);
      pendingDeleteTimerRef.current = null;
    }
    setSessionHistory((prev) => [pendingDelete.session, ...prev]);
    setPendingDelete(null);
    showToast(t("speechTrainer.sessionDeleteUndone"), "info");
  }, [pendingDelete, showToast, t]);

  const handleDeleteSession = (sessionId) => {
    if (!sessionId || deletingSessionId || loading || pendingDelete) return;
    const confirmed = window.confirm(t("speechTrainer.confirmDeleteSession"));
    if (!confirmed) return;

    const target = sessionHistory.find((session) => session.id === sessionId);
    if (!target) return;

    if (pendingDeleteTimerRef.current) {
      clearTimeout(pendingDeleteTimerRef.current);
      pendingDeleteTimerRef.current = null;
    }

    setSessionHistory((prev) => prev.filter((session) => session.id !== sessionId));
    setPendingDelete({ session: target });
    showToast(t("speechTrainer.sessionDeletePending"), "info");

    pendingDeleteTimerRef.current = setTimeout(() => {
      finalizePendingDelete({ session: target });
    }, DELETE_UNDO_MS);

    if (activeSessionId === sessionId) {
      handleReset();
    }
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
    if (!sessionHistory.length || activeSessionId || answersDone > 0 || chatMessages.length > 1 || chatInput.trim()) return;
    const openSession = [...sessionHistory].find(
      (session) => String(session.completionStatus || "").toLowerCase() !== "completed" && Array.isArray(session.chatHistory) && session.chatHistory.length
    );
    if (openSession) restoreSessionFromFirestore(openSession);
  }, [sessionHistory, activeSessionId, answersDone, chatMessages, chatInput, restoreSessionFromFirestore]);


  const handleDeleteAllSessions = async () => {
    if (!idToken || deletingAllSessions || loading) return;
    const confirmed = window.confirm(t("speechTrainer.confirmDeleteAllSessions"));
    if (!confirmed) return;

    try {
      setDeletingAllSessions(true);
      await deleteAllPresentationSessions({ idToken });
      setSessionHistory([]);
      setHistoryNextCursor("");
      setHistoryHasMore(false);
      if (activeSessionId) handleReset();
      showToast(t("speechTrainer.deleteAllSuccess"), "success");
    } catch (deleteError) {
      setError(deleteError?.message || t("speechTrainer.deleteAllError"));
    } finally {
      setDeletingAllSessions(false);
    }
  };

  useEffect(() => () => {
    if (pendingDeleteTimerRef.current) clearTimeout(pendingDeleteTimerRef.current);
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
  }, []);

  const sortedSessionHistory = useMemo(() => {
    const clone = [...sessionHistory];
    clone.sort((a, b) => {
      const aMs = a?.createdAt?._seconds ? a.createdAt._seconds * 1000 : new Date(a?.createdAt || 0).getTime();
      const bMs = b?.createdAt?._seconds ? b.createdAt._seconds * 1000 : new Date(b?.createdAt || 0).getTime();
      return bMs - aMs;
    });
    return clone;
  }, [sessionHistory]);

  const filteredSessionHistory = useMemo(
    () =>
      sortedSessionHistory.filter((session) => {
        const topicPass = !historyFilter.topic || String(session.topic || "").toLowerCase().includes(historyFilter.topic.toLowerCase());
        const levelPass = !historyFilter.level || String(session.level || "").toUpperCase() === historyFilter.level;
        return topicPass && levelPass;
      }),
    [sortedSessionHistory, historyFilter]
  );

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ ...styles.card, display: "grid", gap: 10 }}>
        <div style={{ ...styles.filterRow, gridTemplateColumns: "1fr auto" }}>
          <h2 style={{ ...styles.sectionTitle, margin: 0 }}>{t("speechTrainer.title")}</h2>
          <span style={styles.levelPill}>{t("speechTrainer.levelBadge", { level })}</span>
        </div>
        <p style={{ ...styles.helperText, margin: 0 }}>
          {t("speechTrainer.welcome", { studentName, tutorName })} {isA1A2Level ? t("speechTrainer.mode.a1a2") : t("speechTrainer.mode.default")}
        </p>
        <div style={{ ...styles.filterPanel, margin: 0, background: "#eff6ff" }}>
          <strong style={{ fontSize: 13 }}>{t("speechTrainer.beforeStartTitle")}</strong>
          <p style={{ ...styles.helperText, margin: "4px 0 0" }}>{t("speechTrainer.beforeStartDescription")}</p>
        </div>

        {!answersDone ? (
          <div style={{ ...styles.filterPanel, margin: 0 }}>
            <strong style={{ fontSize: 14 }}>{t("speechTrainer.contextsTitle")}</strong>
            <div style={styles.filterRow}>
              {topicPresets.map((presetTopic) => (
                <button
                  key={presetTopic}
                  type="button"
                  style={styles.secondaryButton}
                  onClick={() => handleTopicPresetClick(presetTopic)}
                  disabled={loading}
                >
                  {presetTopic}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div style={{ ...styles.card, margin: 0, display: "grid", gap: 10, background: "#f8fafc", border: "1px solid #e5e7eb" }}>
          <strong style={{ fontSize: 14 }}>{t("speechTrainer.answerWorkspaceTitle")}</strong>
          <p style={{ ...styles.helperText, margin: 0 }}>
            {t("speechTrainer.answerWorkspaceDescription")}
          </p>

          <div style={{ display: "grid", gap: 8 }}>
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

          <InlineSpeechTrainer profileLevel={level} compact onAudioStateChange={setInlineAudioState} />
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          <div style={{ ...styles.helperText, margin: 0 }}>
            {t("speechTrainer.progress", { answersDone, turnLimit: TURN_LIMIT, currentStepLabel })}
          </div>
          <div style={{ ...styles.helperText, margin: 0 }}>{getDynamicHelperText(answersDone)}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {flowStepsForLevel.map((step, index) => (
              <span
                key={step}
                title={step}
                style={{
                  ...styles.levelPill,
                  background: index < answersDone ? "#dbeafe" : "#f3f4f6",
                  color: index < answersDone ? "#1d4ed8" : "#4b5563",
                }}
              >
                {index + 1}. {step}
              </span>
            ))}
          </div>
          <div style={{ width: "100%", height: 8, background: "#e5e7eb", borderRadius: 999, overflow: "hidden" }} role="progressbar" aria-label={t("speechTrainer.progressAria")} aria-valuemin={0} aria-valuemax={TURN_LIMIT} aria-valuenow={answersDone}>
            <div style={{ width: `${progressPercent}%`, height: "100%", background: "#2563eb" }} />
          </div>
        </div>

        <div
          style={{ ...styles.chatLog, background: "#f1f5f9", border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}
          aria-live="polite"
          ref={chatLogRef}
        >
          {chatMessages.map((message, index) => {
            const isUser = message.role === "user";
            return (
              <div key={`${message.role}-${index}`} style={{ display: "grid", gap: 6, justifyItems: isUser ? "end" : "start" }}>
                <div style={{ ...(isUser ? styles.chatBubbleUser : styles.chatBubbleCoach), maxWidth: "80%", borderBottomRightRadius: isUser ? 6 : 14, borderBottomLeftRadius: isUser ? 14 : 6 }}>
                  {isUser ? <div style={{ whiteSpace: "pre-wrap" }}>{message.content}</div> : renderAssistantContent(message.content, isA1A2Level, t)}
                  {message?.meta?.type === "upgrade" && message?.meta?.why ? (
                    <details style={{ marginTop: 8 }}>
                      <summary style={{ cursor: "pointer" }}>{t("speechTrainer.whyUpgrade")}</summary>
                      <p style={{ ...styles.helperText, margin: "6px 0 0" }}>{message.meta.why}</p>
                    </details>
                  ) : null}
                </div>
                {!isUser && extractTag(message.content, "error_intel") ? (
                  <div style={{ ...styles.card, margin: 0, background: "#fff7ed" }}>
                    <strong style={{ fontSize: 13 }}>{t("speechTrainer.tags.errorIntelligence")}</strong>
                    <p style={{ ...styles.helperText, margin: "4px 0 0" }}>{extractTag(message.content, "error_intel")}</p>
                  </div>
                ) : null}
                {isUser ? (
                  <div style={{ display: "grid", gap: 6 }}>
                    {upgradeOptions.map((option) => (
                      <label key={`${index}-${option.mode}`} style={{ display: "flex", gap: 6, alignItems: "center", ...styles.helperText, margin: 0 }} title={option.description}>
                        <input
                          type="checkbox"
                          checked={Boolean((selectedUpgradesByIndex[index] || []).includes(option.mode))}
                          onChange={() => handleToggleUpgradeMode(index, option.mode)}
                          disabled={Boolean(upgradeLoadingByIndex[index]) || loading}
                        />
                        {option.label}
                      </label>
                    ))}
                    <button
                      type="button"
                      style={styles.secondaryButton}
                      disabled={Boolean(upgradeLoadingByIndex[index]) || loading || !(selectedUpgradesByIndex[index] || []).length}
                      onClick={() => handleApplySelectedUpgrades(message, index)}
                      aria-label={t("speechTrainer.applyUpgradesAria")}
                    >
                      {upgradeLoadingByIndex[index] ? t("speechTrainer.upgrading") : t("speechTrainer.applyUpgrades")}
                    </button>
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

        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <button
              type="button"
              style={styles.primaryButton}
              onClick={handleComposerSubmit}
              disabled={!canSubmitComposer}
              aria-label={t("speechTrainer.sendAria")}
            >
              {loading ? t("speechTrainer.sending", { tutorName }) : composerCtaLabel}
            </button>
            <button type="button" style={styles.secondaryButton} onClick={handleReset} aria-label={t("speechTrainer.resetAria")} disabled={loading}>
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
            {audioCoachStatus || t("speechTrainer.composerStatusHint")}
          </div>
          {completed ? (
            <p style={{ ...styles.helperText, margin: 0, color: "#065f46" }}>
              {t("speechTrainer.completedMessage")}
            </p>
          ) : null}
          {audioCoachError ? <p style={{ ...styles.helperText, margin: 0, color: "#b91c1c" }}>{audioCoachError}</p> : null}
          {error ? <p style={{ ...styles.helperText, margin: 0, color: "#b91c1c" }}>{error}</p> : null}
        </div>
      </div>

      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <div style={{ display: "flex", gap: 8, justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
          <h3 style={{ margin: 0 }}>{t("speechTrainer.sessionHistoryTitle")}</h3>
          <button
            type="button"
            style={{ ...styles.secondaryButton, borderColor: "#fecaca", color: "#b91c1c", background: "#fff1f2" }}
            onClick={handleDeleteAllSessions}
            disabled={deletingAllSessions || !sessionHistory.length}
          >
            {deletingAllSessions ? t("speechTrainer.deletingAllSessions") : t("speechTrainer.deleteAllSessions")}
          </button>
        </div>
        <div style={styles.filterRow}>
          <input
            type="text"
            value={historyFilter.topic}
            onChange={(event) => setHistoryFilter((prev) => ({ ...prev, topic: event.target.value }))}
            placeholder={t("speechTrainer.filterByTopic")}
            style={{ ...styles.input, minWidth: 180 }}
            aria-label={t("speechTrainer.filterByTopicAria")}
          />
          <select
            value={historyFilter.level}
            onChange={(event) => setHistoryFilter((prev) => ({ ...prev, level: event.target.value }))}
            style={{ ...styles.input, minWidth: 120 }}
            aria-label={t("speechTrainer.filterByLevelAria")}
          >
            <option value="">{t("speechTrainer.allLevels")}</option>
            {["A1", "A2", "B1", "B2", "C1"].map((sessionLevel) => (
              <option key={sessionLevel} value={sessionLevel}>{sessionLevel}</option>
            ))}
          </select>
        </div>
        {!filteredSessionHistory.length ? (
          <p style={{ ...styles.helperText, margin: 0 }}>{t("speechTrainer.noSessions")}</p>
        ) : (
          filteredSessionHistory.map((session) => {
            const createdAt = session?.createdAt?._seconds
              ? new Date(session.createdAt._seconds * 1000)
              : new Date(session?.createdAt || Date.now());
            const isIncomplete = String(session.completionStatus || "").toLowerCase() !== "completed";
            return (
              <details key={session.id} style={{ ...styles.card, margin: 0 }}>
                <summary style={{ cursor: "pointer" }}>
                  <strong>{session.topic}</strong> • {t("speechTrainer.levelBadge", { level: session.level })} • {createdAt.toLocaleString()}
                </summary>
                <div style={{ ...styles.helperText, margin: "8px 0 0" }}>{t("speechTrainer.status", { status: session.completionStatus || t("speechTrainer.unknown") })}</div>
                {session.finalScript ? <div style={{ ...styles.helperText, margin: "4px 0" }}>{t("speechTrainer.finalScript", { finalScript: session.finalScript })}</div> : null}
                {session.rubric ? (
                  <div style={{ ...styles.helperText, margin: "4px 0" }}>
                    {t("speechTrainer.rubricHistory", { grammar: Number(session.rubric.grammar || 0), vocabulary: Number(session.rubric.vocabulary || 0), structure: Number(session.rubric.structure || 0) })}
                  </div>
                ) : null}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                  {isIncomplete ? (
                    <button
                      type="button"
                      style={styles.secondaryButton}
                      aria-label={t("speechTrainer.continueAria")}
                      onClick={() => {
                        restoreSessionFromFirestore(session);
                      }}
                    >
                      {t("speechTrainer.continue")}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    style={{ ...styles.secondaryButton, borderColor: "#fecaca", color: "#b91c1c", background: "#fff1f2" }}
                    onClick={() => handleDeleteSession(session.id)}
                    disabled={deletingSessionId === session.id || Boolean(pendingDelete)}
                    aria-label={t("speechTrainer.deleteSessionAria")}
                  >
                    {deletingSessionId === session.id
                      ? t("speechTrainer.deletingSession")
                      : t("speechTrainer.deleteSession")}
                  </button>
                </div>
              </details>
            );
          })
        )}
        {historyHasMore ? (
          <button type="button" style={styles.secondaryButton} onClick={loadMoreHistory} disabled={historyLoadingMore}>
            {historyLoadingMore ? t("speechTrainer.loadingMore") : t("speechTrainer.loadMore")}
          </button>
        ) : null}
        {pendingDelete ? (
          <button type="button" style={styles.secondaryButton} onClick={handleUndoDelete}>
            {t("speechTrainer.undoDelete")}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default SpeechTrainerPage;
