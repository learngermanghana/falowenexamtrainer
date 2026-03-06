import React, { useCallback, useEffect, useMemo, useState } from "react";
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

const TOPIC_PRESETS = ["My hometown", "My studies", "A cultural festival", "An environmental problem + solution"];

const UPGRADE_OPTIONS = [
  { label: "Make it A2/B1", mode: "a2-b1" },
  { label: "Make it more formal", mode: "formal" },
  { label: "Add linking words", mode: "linking" },
];

const initialCoachMessage = {
  role: "assistant",
  content:
    "Hallo! Ich bin Herr Felix, dein Präsentations-Coach. Wähle zuerst einen Kontext oder schreibe dein eigenes Thema, dann starten wir.",
};

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
  <div style={{ ...styles.card, margin: 0, padding: "8px 10px", minWidth: 140 }}>
    <div style={{ fontWeight: 700, fontSize: 13 }}>{label}</div>
    <div style={{ ...styles.helperText, margin: 0 }}>{value}/5</div>
  </div>
);

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

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {taggedFields.map((field) => (
        <div key={`${field.tag}-${field.value.slice(0, 20)}`} style={blockStyle}>
          <strong style={{ fontSize: 12, color: "#1d4ed8", textTransform: "uppercase", letterSpacing: 0.3 }}>
            {normalizeLabel(field.tag)}
          </strong>
          <div style={{ whiteSpace: "pre-wrap" }}>{field.value}</div>
        </div>
      ))}
    </div>
  );
};

const SpeechTrainerPage = () => {
  const { idToken, studentProfile } = useAuth();
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([initialCoachMessage]);
  const [answersDone, setAnswersDone] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [retryablePayload, setRetryablePayload] = useState(null);
  const [error, setError] = useState("");
  const [topic, setTopic] = useState("");
  const [finalScripts, setFinalScripts] = useState({ short: "", medium: "", long: "" });
  const [rubric, setRubric] = useState(null);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [upgradeLoadingByIndex, setUpgradeLoadingByIndex] = useState({});

  const level = useMemo(() => {
    const raw = String(studentProfile?.level || "A1").toUpperCase();
    return ["A1", "A2", "B1", "B2", "C1"].includes(raw) ? raw : "A1";
  }, [studentProfile?.level]);

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

  const submitMessage = async (payload) => {
    setError("");
    setLoading(true);
    setRetryablePayload(payload);

    const nextUserMessage = { role: "user", content: payload.message };
    const priorHistory = payload.history;

    setChatMessages((prev) => [...prev, nextUserMessage]);
    setChatInput("");

    try {
      const response = await requestPresentationCoachReply({
        message: payload.message,
        level,
        history: priorHistory,
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
      setError(requestError?.message || "Could not reach the presentation coach. Please try again.");
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
    const message = `Topic selected: ${presetTopic}. Please start the 6-step coaching flow with the first German question.`;
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
      const prefixed = `Upgrade (${label}):\n${upgraded}${why ? `\n\nWhy: ${why}` : ""}`;
      setChatMessages((prev) => [...prev, { role: "assistant", content: prefixed }]);
    } catch (upgradeError) {
      setError(upgradeError?.message || "Could not upgrade your answer right now.");
    } finally {
      setUpgradeLoadingByIndex((prev) => ({ ...prev, [index]: "" }));
    }
  };

  const handleReset = () => {
    const hasContent = chatMessages.length > 1 || chatInput.trim();
    if (hasContent && !window.confirm("Are you sure you want to reset? Your current chat will be cleared.")) return;

    setChatMessages([initialCoachMessage]);
    setChatInput("");
    setAnswersDone(0);
    setCompleted(false);
    setLoading(false);
    setError("");
    setTopic("");
    setRubric(null);
    setFinalScripts({ short: "", medium: "", long: "" });
    setSessionSaved(false);
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

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ ...styles.card, display: "grid", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <h2 style={{ margin: 0 }}>Class presentation chat coach</h2>
          <span style={styles.levelPill}>Level {level}</span>
        </div>
        <p style={{ ...styles.helperText, margin: 0 }}>
          Welcome {studentName}. You are chatting with {tutorName}. 6-step preparation flow with corrections, upgrades, and final speaking scripts.
        </p>

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
            <a href={recorderLink} target="_blank" rel="noreferrer" style={{ ...styles.primaryButton, textDecoration: "none" }}>
              Open recorder link
            </a>
          </div>
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          <div style={{ ...styles.helperText, margin: 0 }}>Progress: {answersDone}/{TURN_LIMIT}</div>
          <div style={{ width: "100%", height: 8, background: "#e5e7eb", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ width: `${progressPercent}%`, height: "100%", background: "#2563eb" }} />
          </div>
        </div>

        <div style={{ ...styles.chatLog, background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
          {chatMessages.map((message, index) => {
            const isUser = message.role === "user";
            return (
              <div key={`${message.role}-${index}`} style={{ display: "grid", gap: 6 }}>
                <div style={isUser ? styles.chatBubbleUser : styles.chatBubbleCoach}>
                  {isUser ? <div style={{ whiteSpace: "pre-wrap" }}>{message.content}</div> : renderAssistantContent(message.content)}
                </div>
                {!isUser && extractTag(message.content, "error_intel") ? (
                  <div style={{ ...styles.card, margin: 0, background: "#fff7ed" }}>
                    <strong style={{ fontSize: 13 }}>Error intelligence</strong>
                    <p style={{ ...styles.helperText, margin: "4px 0 0" }}>{extractTag(message.content, "error_intel")}</p>
                  </div>
                ) : null}
                {isUser ? (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {UPGRADE_OPTIONS.map((option) => (
                      <button
                        key={`${index}-${option.mode}`}
                        type="button"
                        style={styles.secondaryButton}
                        disabled={Boolean(upgradeLoadingByIndex[index]) || loading}
                        onClick={() => handleUpgrade({ message, index, mode: option.mode, label: option.label })}
                      >
                        {upgradeLoadingByIndex[index] === option.mode ? "Upgrading..." : option.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {completed && rubric ? (
          <div style={{ ...styles.card, margin: 0, background: "#eff6ff", display: "grid", gap: 8 }}>
            <strong style={{ fontSize: 14 }}>Rubric-based feedback (1–5)</strong>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
            rows={4}
            style={styles.textareaSmall}
            placeholder="Type your answer in German..."
            disabled={loading || completed}
          />
          <div style={{ ...styles.helperText, margin: 0 }}>
            {charsCount} characters{!minLengthReached ? ` • Write at least ${MIN_ANSWER_LENGTH} characters` : ""}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" style={styles.primaryButton} onClick={handleSend} disabled={loading || completed || !chatInput.trim()}>
              {loading ? "Sir Felix is thinking..." : "Send"}
            </button>
            <button type="button" style={styles.secondaryButton} onClick={handleReset}>
              Reset chat
            </button>
            {error ? (
              <button type="button" style={styles.secondaryButton} onClick={handleRetry} disabled={!retryablePayload || loading}>
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
        {!sessionHistory.length ? (
          <p style={{ ...styles.helperText, margin: 0 }}>No saved presentation sessions yet.</p>
        ) : (
          sessionHistory.map((session) => (
            <div key={session.id} style={{ ...styles.card, margin: 0 }}>
              <div><strong>{session.topic}</strong> • Level {session.level}</div>
              <div style={{ ...styles.helperText, margin: "4px 0" }}>Status: {session.completionStatus || "unknown"}</div>
              {session.finalScript ? <div style={{ ...styles.helperText, margin: 0 }}>Final script: {String(session.finalScript).slice(0, 180)}...</div> : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SpeechTrainerPage;
