import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import {
  loadPresentationSessions,
  requestPresentationCoachReply,
  requestPresentationUpgrade,
  savePresentationSession,
} from "../services/presentationCoachService";

const CAMPUS_SPEAKING_LINK =
  "https://script.google.com/macros/s/AKfycbzMIhHuWKqM2ODaOCgtS7uZCikiZJRBhpqv2p6OyBmK1yAVba8HlmVC1zgTcGWSTfrsHA/exec";

const TURN_LIMIT = 6;
const MIN_ANSWER_LENGTH = 20;
const CHAT_DRAFT_STORAGE_KEY = "falowen.speechTrainer.chatDraft.v1";

const TOPIC_PRESETS = ["My hometown", "My studies", "A cultural festival", "An environmental problem + solution"];

const FLOW_STEPS = [
  "Describe your topic",
  "Explain your situation",
  "Present your solution",
  "Give supporting details",
  "Use richer vocabulary and structure",
  "Deliver your final presentation",
];

const UPGRADE_OPTIONS = [
  { label: "Make it A2/B1", mode: "a2-b1", description: "Targets clear A2/B1 grammar and natural exam-ready phrasing." },
  { label: "Make it more formal", mode: "formal", description: "Emphasises politeness, formality, and clearer sentence patterns." },
  { label: "Add linking words", mode: "linking", description: "Adds connectors like zuerst, dann, außerdem, deshalb, and zum Schluss." },
];

const getInitialCoachMessage = (isA1A2) => ({
  role: "assistant",
  content: isA1A2
    ? "Hallo! I am Herr Felix 👋. Wir üben mit einfachem Deutsch + little English help. Wähle ein Thema, dann starten wir."
    : "Hallo! Ich bin Herr Felix, dein Präsentations-Coach. Wähle zuerst einen Kontext oder schreibe dein eigenes Thema, dann starten wir.",
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

const normalizeLabel = (tag) =>
  ({
    question_de: "Nächste Frage",
    feedback_en: "Feedback",
    feedback_mix: "Feedback",
    motivation_de: "Motivation",
    vocab_explain: "Wortschatz",
    progress_de: "Fortschritt",
    abschluss_de: "Abschluss",
    praesentation_de: "Präsentation",
    script_short: "Short script",
    script_medium: "Medium script",
    script_long: "Long script",
    error_intel: "Error intelligence",
    rubric: "Rubric",
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

const renderAssistantContent = (content) => {
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
            {normalizeLabel(field.tag)}
          </strong>
          <div style={{ whiteSpace: "pre-wrap" }}>{field.value}</div>
        </div>
      ))}
      {secondaryFields.length ? (
        <details style={{ ...blockStyle, background: "#f8fafc", borderColor: "#e5e7eb" }}>
          <summary style={{ cursor: "pointer", fontWeight: 600 }}>Mehr Hinweise anzeigen</summary>
          <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
            {secondaryFields.map((field) => (
              <div key={`${field.tag}-${field.value.slice(0, 30)}`}>
                <strong style={{ fontSize: 12, color: "#1d4ed8", textTransform: "uppercase", letterSpacing: 0.3 }}>
                  {normalizeLabel(field.tag)}
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
  const { idToken, studentProfile } = useAuth();
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([getInitialCoachMessage(false)]);
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
  const [sessionHistory, setSessionHistory] = useState([]);
  const [upgradeLoadingByIndex, setUpgradeLoadingByIndex] = useState({});
  const [selectedUpgradesByIndex, setSelectedUpgradesByIndex] = useState({});
  const [historyFilter, setHistoryFilter] = useState({ topic: "", level: "" });
  const chatLogRef = useRef(null);

  const level = useMemo(() => {
    const raw = String(studentProfile?.level || "A1").toUpperCase();
    return ["A1", "A2", "B1", "B2", "C1"].includes(raw) ? raw : "A1";
  }, [studentProfile?.level]);


  const isA1A2Level = level === "A1" || level === "A2";
  const flowStepsForLevel = isA1A2Level ? FLOW_STEPS_A1_A2 : FLOW_STEPS;

  const studentCode = String(studentProfile?.studentCode || studentProfile?.studentcode || "").trim();
  const studentName =
    studentProfile?.firstName ||
    studentProfile?.displayName ||
    studentProfile?.name ||
    studentProfile?.fullName ||
    "Student";
  const tutorName = "Sir Felix";

  const progressPercent = Math.min(100, Math.round((answersDone / TURN_LIMIT) * 100));
  const recorderLink = `${CAMPUS_SPEAKING_LINK}?code=${encodeURIComponent(studentCode)}`;
  const charsCount = chatInput.trim().length;
  const minLengthReached = charsCount >= MIN_ANSWER_LENGTH;
  const currentStepLabel = FLOW_STEPS[Math.min(answersDone, TURN_LIMIT - 1)] || FLOW_STEPS[FLOW_STEPS.length - 1];

  const getDynamicHelperText = useCallback((done) => {
    if (done <= 0) return "Start with a clear topic introduction and one key point.";
    if (done === 1) return "Great start. Now expand vocabulary range and vary your sentence structure.";
    if (done === 2) return "Add a concrete example so your explanation is persuasive.";
    if (done === 3) return "Link ideas with connectors and show cause/effect clearly.";
    if (done === 4) return "Refine grammar and make your conclusion concise and confident.";
    return "Final step: deliver a fluent full response with strong structure.";
  }, []);

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
      const response = await loadPresentationSessions({ idToken });
      setSessionHistory(Array.isArray(response?.sessions) ? response.sessions : []);
    } catch (historyError) {
      console.warn("Could not load presentation session history", historyError);
    }
  }, [idToken]);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  useEffect(() => {
    try {
      const cachedDraft = window.localStorage.getItem(CHAT_DRAFT_STORAGE_KEY);
      if (cachedDraft) setChatInput(cachedDraft);
    } catch (storageError) {
      console.warn("Could not restore speech trainer draft", storageError);
    }
  }, []);

  useEffect(() => {
    try {
      if (chatInput) window.localStorage.setItem(CHAT_DRAFT_STORAGE_KEY, chatInput);
      else window.localStorage.removeItem(CHAT_DRAFT_STORAGE_KEY);
    } catch (storageError) {
      console.warn("Could not persist speech trainer draft", storageError);
    }
  }, [chatInput]);

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
      window.localStorage.removeItem(CHAT_DRAFT_STORAGE_KEY);
    }

    try {
      const coachingHistory = isA1A2Level
        ? [...priorHistory, { role: "assistant", content: "Coach style: use easy German (A1/A2), short sentences, and brief English support for difficult words." }]
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
        setError("Your session expired. Please log in again to continue.");
      } else if (type === "transient") {
        setError("Temporary network issue. Please retry in a moment.");
      } else {
        setError(requestError?.message || "Could not reach the presentation coach. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    const trimmed = chatInput.trim();
    if (!trimmed || loading || completed) return;
    if (trimmed.length < MIN_ANSWER_LENGTH) {
      setError(`Please write at least ${MIN_ANSWER_LENGTH} characters so Sir Felix can coach you better.`);
      return;
    }

    const history = chatMessages.map(({ role, content }) => ({ role, content }));
    await submitMessage({ message: trimmed, history });
  };

  const handleRetry = async () => {
    if (!retryablePayload || loading || completed) return;
    await submitMessage(retryablePayload);
  };

  const handleTopicPresetClick = async (presetTopic) => {
    if (loading || completed) return;
    setTopic(presetTopic);
    const message = isA1A2Level
      ? `Topic selected: ${presetTopic}. Please start with easy German + short English help for A1/A2 learner.`
      : `Topic selected: ${presetTopic}. Please start the 6-step coaching flow with the first German question.`;
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
      setChatMessages((prev) => [...prev, { role: "assistant", content: `Upgrade (${label}):\n${upgraded}`, meta: { type: "upgrade", why } }]);
    } catch (upgradeError) {
      setError(upgradeError?.message || "Could not upgrade your answer right now.");
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
      const option = UPGRADE_OPTIONS.find((item) => item.mode === mode);
      // eslint-disable-next-line no-await-in-loop
      await handleUpgrade({ message, index, mode, label: option?.label || mode });
    }
  };

  const handleReset = () => {
    const hasContent = chatMessages.length > 1 || chatInput.trim();
    if (hasContent && !window.confirm("Are you sure you want to reset? Your current chat will be cleared.")) return;

    setChatMessages([getInitialCoachMessage(isA1A2Level)]);
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
    window.localStorage.removeItem(CHAT_DRAFT_STORAGE_KEY);
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
      if (!completed || sessionSaved || !idToken) return;
      const finalScript = finalScripts.long || finalScripts.medium || finalScripts.short || extractTag(chatMessages.at(-1)?.content, "praesentation_de") || "";
      const errorIntel = extractTag(chatMessages.at(-1)?.content, "error_intel");
      const inferredTags = extractErrorTags(errorIntel);

      try {
        await savePresentationSession({
          idToken,
          payload: {
            topic: topic || "Custom topic",
            level,
            finalScript,
            commonErrorTags: inferredTags,
            completionStatus: "completed",
            rubric: rubric || {
              grammar: 0,
              vocabulary: 0,
              structure: 0,
            },
            studentName,
            tutorName,
          },
        });
        setSessionSaved(true);
        refreshHistory();
      } catch (persistError) {
        console.error("Failed to save presentation session", persistError);
      }
    };

    persistSession();
  }, [completed, sessionSaved, idToken, topic, level, finalScripts, rubric, chatMessages, studentName, refreshHistory]);

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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <h2 style={{ margin: 0 }}>Class presentation chat coach</h2>
          <span style={styles.levelPill}>Level {level}</span>
        </div>
        <p style={{ ...styles.helperText, margin: 0 }}>
          Welcome {studentName}. You are chatting with {tutorName}. {isA1A2Level ? "Simple German + English support mode." : "6-step preparation flow with corrections, upgrades, and final speaking scripts."}
        </p>
        <div style={{ ...styles.card, margin: 0, background: "#eff6ff" }}>
          <strong style={{ fontSize: 13 }}>Before you begin</strong>
          <p style={{ ...styles.helperText, margin: "4px 0 0" }}>
            You will answer six guided prompts. After each reply, Sir Felix gives feedback and asks the next question. Aim for clear structure,
            varied vocabulary, and complete sentences.
          </p>
        </div>

        {!answersDone ? (
          <div style={{ ...styles.card, margin: 0, background: "#f8fafc", display: "grid", gap: 8 }}>
            <strong style={{ fontSize: 14 }}>Presentation contexts</strong>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {TOPIC_PRESETS.map((presetTopic) => (
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

        <div style={{ ...styles.card, margin: 0, background: "#f8fafc", display: "grid", gap: 8 }}>
          <p style={{ ...styles.helperText, margin: 0 }}>
            You can stay here for chat practice, or open the recorder if you want to submit an audio recording.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a href={recorderLink} target="_blank" rel="noreferrer" style={{ ...styles.primaryButton, textDecoration: "none" }} aria-label="Open speech recorder link">
              Open recorder link
            </a>
          </div>
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          <div style={{ ...styles.helperText, margin: 0 }}>
            Progress: {answersDone}/{TURN_LIMIT} • Current step: {currentStepLabel}
          </div>
          <div style={{ ...styles.helperText, margin: 0 }}>{getDynamicHelperText(answersDone)}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {FLOW_STEPS.map((step, index) => (
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
          <div style={{ width: "100%", height: 8, background: "#e5e7eb", borderRadius: 999, overflow: "hidden" }} role="progressbar" aria-label="Six-step coaching progress" aria-valuemin={0} aria-valuemax={TURN_LIMIT} aria-valuenow={answersDone}>
            <div style={{ width: `${progressPercent}%`, height: "100%", background: "#2563eb" }} />
          </div>
        </div>

        <div
          style={{ ...styles.chatLog, background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}
          aria-live="polite"
          ref={chatLogRef}
        >
          {chatMessages.map((message, index) => {
            const isUser = message.role === "user";
            return (
              <div key={`${message.role}-${index}`} style={{ display: "grid", gap: 6 }}>
                <div style={isUser ? styles.chatBubbleUser : styles.chatBubbleCoach}>
                  {isUser ? <div style={{ whiteSpace: "pre-wrap" }}>{message.content}</div> : renderAssistantContent(message.content)}
                  {message?.meta?.type === "upgrade" && message?.meta?.why ? (
                    <details style={{ marginTop: 8 }}>
                      <summary style={{ cursor: "pointer" }}>Why this upgrade</summary>
                      <p style={{ ...styles.helperText, margin: "6px 0 0" }}>{message.meta.why}</p>
                    </details>
                  ) : null}
                </div>
                {!isUser && extractTag(message.content, "error_intel") ? (
                  <div style={{ ...styles.card, margin: 0, background: "#fff7ed" }}>
                    <strong style={{ fontSize: 13 }}>Error intelligence</strong>
                    <p style={{ ...styles.helperText, margin: "4px 0 0" }}>{extractTag(message.content, "error_intel")}</p>
                  </div>
                ) : null}
                {isUser ? (
                  <div style={{ display: "grid", gap: 6 }}>
                    {UPGRADE_OPTIONS.map((option) => (
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
                      aria-label="Apply selected upgrade options"
                    >
                      {upgradeLoadingByIndex[index] ? "Upgrading..." : "Apply selected upgrades"}
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {completed && rubric ? (
          <div style={{ ...styles.card, margin: 0, background: "#eff6ff", display: "grid", gap: 8 }}>
            <strong style={{ fontSize: 14 }}>Rubric-based feedback (1–5)</strong>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }} aria-label="Rubric scores">
              {scorePill("Grammar", rubric.grammar)}
              {scorePill("Vocabulary range", rubric.vocabulary)}
              {scorePill("Structure", rubric.structure)}
            </div>
          </div>
        ) : null}

        {completed ? (
          <div style={{ ...styles.card, margin: 0, background: "#ecfdf5", display: "grid", gap: 8 }}>
            <strong style={{ fontSize: 14 }}>Speaking-ready output block</strong>
            {finalScripts.short ? <div><strong>Short (45 sec):</strong><p style={{ margin: "4px 0 0" }}>{finalScripts.short}</p></div> : null}
            {finalScripts.medium ? <div><strong>Medium (90 sec):</strong><p style={{ margin: "4px 0 0" }}>{finalScripts.medium}</p></div> : null}
            {finalScripts.long ? <div><strong>Long (2 min):</strong><p style={{ margin: "4px 0 0" }}>{finalScripts.long}</p></div> : null}
          </div>
        ) : null}

        <div style={{ display: "grid", gap: 8 }}>
          <textarea
            value={chatInput}
            onChange={(event) => setChatInput(event.target.value)}
            onKeyDown={handleInputKeyDown}
            rows={4}
            style={styles.textareaSmall}
            placeholder={isA1A2Level ? "Write simple German. You may add small English support words..." : "Type your answer in German..."}
            disabled={loading || completed}
          />
          <div style={{ ...styles.helperText, margin: 0 }} aria-live="polite">
            {charsCount}/{MIN_ANSWER_LENGTH} characters minimum
          </div>
          <div style={{ width: "100%", height: 6, background: "#e5e7eb", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ width: `${Math.min((charsCount / MIN_ANSWER_LENGTH) * 100, 100)}%`, height: "100%", background: minLengthReached ? "#16a34a" : "#f59e0b" }} />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {minLengthReached ? (
              <button type="button" style={styles.primaryButton} onClick={handleSend} disabled={loading || completed || !chatInput.trim()} aria-label="Send message">
                {loading ? "Sir Felix is thinking..." : "Send"}
              </button>
            ) : null}
            <button type="button" style={styles.secondaryButton} onClick={handleReset} aria-label="Reset chat and clear messages" disabled={loading}>
              Reset chat
            </button>
            {errorType === "auth" ? (
              <button type="button" style={styles.secondaryButton} onClick={() => window.location.assign("/login")} aria-label="Log in again">
                Re-login
              </button>
            ) : null}
            {error ? (
              <button type="button" style={styles.secondaryButton} onClick={handleRetry} disabled={!retryablePayload || loading} aria-label="Retry last message">
                Retry
              </button>
            ) : null}
          </div>
          {completed ? (
            <p style={{ ...styles.helperText, margin: 0, color: "#065f46" }}>
              Great! You completed all 6 answers. Your final speaking scripts are ready above.
            </p>
          ) : null}
          {error ? <p style={{ ...styles.helperText, margin: 0, color: "#b91c1c" }}>{error}</p> : null}
        </div>
      </div>

      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <h3 style={{ margin: 0 }}>Session history</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            type="text"
            value={historyFilter.topic}
            onChange={(event) => setHistoryFilter((prev) => ({ ...prev, topic: event.target.value }))}
            placeholder="Filter by topic"
            style={{ ...styles.input, minWidth: 180 }}
            aria-label="Filter session history by topic"
          />
          <select
            value={historyFilter.level}
            onChange={(event) => setHistoryFilter((prev) => ({ ...prev, level: event.target.value }))}
            style={{ ...styles.input, minWidth: 120 }}
            aria-label="Filter session history by level"
          >
            <option value="">All levels</option>
            {["A1", "A2", "B1", "B2", "C1"].map((sessionLevel) => (
              <option key={sessionLevel} value={sessionLevel}>{sessionLevel}</option>
            ))}
          </select>
        </div>
        {!filteredSessionHistory.length ? (
          <p style={{ ...styles.helperText, margin: 0 }}>No saved presentation sessions yet.</p>
        ) : (
          filteredSessionHistory.map((session) => {
            const createdAt = session?.createdAt?._seconds
              ? new Date(session.createdAt._seconds * 1000)
              : new Date(session?.createdAt || Date.now());
            const isIncomplete = String(session.completionStatus || "").toLowerCase() !== "completed";
            return (
              <details key={session.id} style={{ ...styles.card, margin: 0 }}>
                <summary style={{ cursor: "pointer" }}>
                  <strong>{session.topic}</strong> • Level {session.level} • {createdAt.toLocaleString()}
                </summary>
                <div style={{ ...styles.helperText, margin: "8px 0 0" }}>Status: {session.completionStatus || "unknown"}</div>
                {session.finalScript ? <div style={{ ...styles.helperText, margin: "4px 0" }}>Final script: {session.finalScript}</div> : null}
                {session.rubric ? (
                  <div style={{ ...styles.helperText, margin: "4px 0" }}>
                    Rubric — Grammar: {Number(session.rubric.grammar || 0)}/5, Vocabulary: {Number(session.rubric.vocabulary || 0)}/5, Structure: {Number(session.rubric.structure || 0)}/5
                  </div>
                ) : null}
                {isIncomplete ? (
                  <button
                    type="button"
                    style={styles.secondaryButton}
                    aria-label="Continue incomplete session"
                    onClick={() => {
                      setTopic(session.topic || "");
                      setChatInput(session.finalScript || "");
                    }}
                  >
                    Continue
                  </button>
                ) : null}
              </details>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SpeechTrainerPage;
