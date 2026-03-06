import React, { useMemo, useState } from "react";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import { requestPresentationCoachReply } from "../services/presentationCoachService";

const CAMPUS_SPEAKING_LINK =
  "https://script.google.com/macros/s/AKfycbzMIhHuWKqM2ODaOCgtS7uZCikiZJRBhpqv2p6OyBmK1yAVba8HlmVC1zgTcGWSTfrsHA/exec";

const TURN_LIMIT = 6;

const initialCoachMessage = {
  role: "assistant",
  content:
    "Hallo! Ich bin dein Präsentations-Coach. Schreib bitte 2–3 Sätze über dein heutiges Präsentationsthema, dann korrigiere ich kurz und stelle die nächste Frage.",
};

const SpeechTrainerPage = () => {
  const { idToken, studentProfile } = useAuth();
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([initialCoachMessage]);
  const [answersDone, setAnswersDone] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const level = useMemo(() => {
    const raw = String(studentProfile?.level || "A1").toUpperCase();
    return ["A1", "A2", "B1", "B2", "C1"].includes(raw) ? raw : "A1";
  }, [studentProfile?.level]);

  const progressPercent = Math.min(100, Math.round((answersDone / TURN_LIMIT) * 100));
  const studentCode = String(studentProfile?.studentCode || studentProfile?.studentcode || "").trim();
  const recorderLink = `${CAMPUS_SPEAKING_LINK}?code=${encodeURIComponent(studentCode)}`;

  const handleSend = async () => {
    const trimmed = chatInput.trim();
    if (!trimmed || loading || completed) return;

    const nextUserMessage = { role: "user", content: trimmed };
    const priorHistory = chatMessages.map(({ role, content }) => ({ role, content }));

    setChatMessages((prev) => [...prev, nextUserMessage]);
    setChatInput("");
    setError("");
    setLoading(true);

    try {
      const response = await requestPresentationCoachReply({
        message: trimmed,
        level,
        history: priorHistory,
        idToken,
      });

      setChatMessages((prev) => [...prev, { role: "assistant", content: response?.reply || "" }]);
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
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ ...styles.card, display: "grid", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <h2 style={{ margin: 0 }}>Class presentation chat coach</h2>
          <span style={styles.levelPill}>Level {level}</span>
        </div>
        <p style={{ ...styles.helperText, margin: 0 }}>
          6-step preparation flow. You answer by typing, the coach corrects briefly, then asks one next German question.
        </p>
        <div style={{ ...styles.card, margin: 0, background: "#f8fafc", display: "grid", gap: 8 }}>
          <p style={{ ...styles.helperText, margin: 0 }}>
            You can stay here for chat practice, or open the speaking recorder if you want to submit an audio recording.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a href={CAMPUS_SPEAKING_LINK} target="_blank" rel="noreferrer" style={{ ...styles.secondaryButton, textDecoration: "none" }}>
              Open speaking page
            </a>
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
          {chatMessages.map((message, index) => (
            <div key={`${message.role}-${index}`} style={message.role === "assistant" ? styles.chatBubbleCoach : styles.chatBubbleUser}>
              {message.content}
            </div>
          ))}
        </div>

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
    </div>
  );
};

export default SpeechTrainerPage;
