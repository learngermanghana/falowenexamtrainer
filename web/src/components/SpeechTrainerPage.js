import React, { useMemo, useState } from "react";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import { requestPresentationCoachReply } from "../services/presentationCoachService";

const CAMPUS_SPEAKING_LINK =
  "https://script.google.com/macros/s/AKfycbzMIhHuWKqM2ODaOCgtS7uZCikiZJRBhpqv2p6OyBmK1yAVba8HlmVC1zgTcGWSTfrsHA/exec";

const TURN_LIMIT = 6;
const PRESENTATION_CONVERSATION_KEY = "falowen_campus_presentation_conversation";

const initialCoachMessage = {
  role: "assistant",
  content:
    "Hallo! Ich bin dein Präsentations-Coach. Schreib bitte 2–3 Sätze über dein heutiges Präsentationsthema, dann korrigiere ich kurz und stelle die nächste Frage.",
};

const extractFinalPresentation = (text = "") => {
  const marker = "PRÄSENTATION:";
  const index = text.indexOf(marker);
  if (index === -1) return "";
  return text.slice(index + marker.length).trim();
};

const SpeechTrainerPage = () => {
  const { idToken, studentProfile, user } = useAuth();
  const [activeTab, setActiveTab] = useState("external");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([initialCoachMessage]);
  const [answersDone, setAnswersDone] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [conversationId, setConversationId] = useState(() => {
    try {
      return localStorage.getItem(`${PRESENTATION_CONVERSATION_KEY}_${user?.uid || "guest"}`) || "";
    } catch {
      return "";
    }
  });

  const level = useMemo(() => {
    const raw = String(studentProfile?.level || "A1").toUpperCase();
    return ["A1", "A2", "B1", "B2", "C1"].includes(raw) ? raw : "A1";
  }, [studentProfile?.level]);

  const progressPercent = Math.min(100, Math.round((answersDone / TURN_LIMIT) * 100));
  const latestAssistantMessage = [...chatMessages].reverse().find((message) => message.role === "assistant")?.content || "";
  const finalPresentation = completed ? extractFinalPresentation(latestAssistantMessage) : "";

  const handleSend = async () => {
    const trimmed = chatInput.trim();
    if (!trimmed || loading || completed) return;

    const nextUserMessage = { role: "user", content: trimmed };
    const priorHistory = chatMessages.map(({ role, content }) => ({ role, content }));

    setChatMessages((prev) => [...prev, nextUserMessage]);
    setChatInput("");
    setError("");
    setCopyStatus("");
    setLoading(true);

    try {
      const response = await requestPresentationCoachReply({
        message: trimmed,
        level,
        conversationId,
        history: priorHistory,
        idToken,
      });

      const nextConversationId = String(response?.conversationId || "");
      if (nextConversationId) {
        setConversationId(nextConversationId);
        try {
          localStorage.setItem(`${PRESENTATION_CONVERSATION_KEY}_${user?.uid || "guest"}`, nextConversationId);
        } catch {
          // noop
        }
      }

      if (Array.isArray(response?.history) && response.history.length) {
        setChatMessages(response.history);
      } else {
        setChatMessages((prev) => [...prev, { role: "assistant", content: response?.reply || "" }]);
      }

      setAnswersDone(response?.answersDone || 0);
      setCompleted(Boolean(response?.completed));
    } catch (requestError) {
      console.error("Presentation chat error", requestError);
      setError(requestError?.message || "Could not reach the presentation coach. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setChatMessages([initialCoachMessage]);
    setChatInput("");
    setAnswersDone(0);
    setCompleted(false);
    setLoading(false);
    setError("");
    setCopyStatus("");
    setConversationId("");
    try {
      localStorage.removeItem(`${PRESENTATION_CONVERSATION_KEY}_${user?.uid || "guest"}`);
    } catch {
      // noop
    }
  };

  const handleCopyPresentation = async () => {
    if (!finalPresentation) return;
    try {
      await navigator.clipboard.writeText(finalPresentation);
      setCopyStatus("Copied presentation.");
    } catch (copyError) {
      console.error("Copy failed", copyError);
      setCopyStatus("Could not copy automatically. Please copy manually.");
    }
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={styles.tabList} role="tablist" aria-label="Campus speaking tools">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "external"}
          style={activeTab === "external" ? styles.tabButtonActive : styles.tabButton}
          onClick={() => setActiveTab("external")}
        >
          Speaking page
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "presentation-chat"}
          style={activeTab === "presentation-chat" ? styles.tabButtonActive : styles.tabButton}
          onClick={() => setActiveTab("presentation-chat")}
        >
          Presentation chat
        </button>
      </div>

      {activeTab === "external" ? (
        <div
          style={{
            ...styles.card,
            background: "linear-gradient(135deg, #eef2ff 0%, #e0f2fe 100%)",
            borderColor: "#c7d2fe",
            display: "grid",
            gap: 12,
          }}
        >
          <h2 style={{ margin: 0 }}>Campus Speaking Practice</h2>
          <p style={{ ...styles.helperText, margin: 0 }}>Open the dedicated campus speaking practice page.</p>
          <div>
            <a href={CAMPUS_SPEAKING_LINK} target="_blank" rel="noreferrer" style={{ ...styles.primaryButton, textDecoration: "none" }}>
              Open Campus Speaking Page
            </a>
          </div>
        </div>
      ) : null}

      {activeTab === "presentation-chat" ? (
        <div style={{ ...styles.card, display: "grid", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <h2 style={{ margin: 0 }}>Class presentation chat coach</h2>
            <span style={styles.levelPill}>Level {level}</span>
          </div>
          <p style={{ ...styles.helperText, margin: 0 }}>
            6-step preparation flow. You answer by typing, the coach corrects briefly, then asks one next German question.
          </p>

          <div style={{ display: "grid", gap: 6 }}>
            <div style={{ ...styles.helperText, margin: 0 }}>Progress: {answersDone}/{TURN_LIMIT}</div>
            <div style={{ width: "100%", height: 8, background: "#e5e7eb", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: `${progressPercent}%`, height: "100%", background: "#2563eb" }} />
            </div>
          </div>

          <div style={{ ...styles.chatLog, background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
            {chatMessages.map((message, index) => (
              <div key={`${message.role}-${index}`} style={message.role === "assistant" ? styles.chatBubbleCoach : styles.chatBubbleUser}>
                {message.content}
              </div>
            ))}
          </div>

          {completed && finalPresentation ? (
            <div style={{ ...styles.resultCard, margin: 0, display: "grid", gap: 8 }}>
              <p style={{ ...styles.label, margin: 0 }}>Final presentation (copy-ready)</p>
              <p style={{ ...styles.helperText, margin: 0 }}>{finalPresentation}</p>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <button type="button" style={styles.secondaryButton} onClick={handleCopyPresentation}>
                  Copy presentation
                </button>
                {copyStatus ? <span style={{ ...styles.helperText, margin: 0 }}>{copyStatus}</span> : null}
              </div>
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
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button type="button" style={styles.primaryButton} onClick={handleSend} disabled={loading || completed || !chatInput.trim()}>
                {loading ? "Sending..." : "Send"}
              </button>
              <button type="button" style={styles.secondaryButton} onClick={handleReset}>
                Reset chat
              </button>
            </div>
            {completed ? (
              <p style={{ ...styles.helperText, margin: 0, color: "#065f46" }}>
                Great! You completed all 6 answers. Your final short presentation is ready in the chat above.
              </p>
            ) : null}
            {error ? <p style={{ ...styles.helperText, margin: 0, color: "#b91c1c" }}>{error}</p> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SpeechTrainerPage;
