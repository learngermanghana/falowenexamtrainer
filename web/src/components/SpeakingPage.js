import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import { useExam } from "../context/ExamContext";
import { speakingSheetQuestions } from "../data/speakingSheet";

const EXAMS_PRACTICE_LINK =
  "https://script.google.com/macros/s/AKfycbyJ5lTeXUgaGw-rejDuh_2ex7El_28JgKLurOOsO1c8LWfVE-Em2-vuWuMn1hC5-_IN/exec";
const CAMPUS_PRACTICE_LINK =
  "https://script.google.com/macros/s/AKfycbzMIhHuWKqM2ODaOCgtS7uZCikiZJRBhpqv2p6OyBmK1yAVba8HlmVC1zgTcGWSTfrsHA/exec";

const parseTeilNumber = (teilLabel = "") => {
  const match = String(teilLabel).match(/teil\s*(\d+)/i);
  return match ? match[1] : "";
};

const randomCoachReply = (selectedQuestion) => {
  if (!selectedQuestion) {
    return "Choose a question first, then I can guide your speaking practice.";
  }

  const keyword = selectedQuestion.keywordSubtopic
    ? ` and include "${selectedQuestion.keywordSubtopic}"`
    : "";

  const replyBank = [
    `Great start. Answer in 3-4 simple sentences${keyword}.`,
    "Good. Add one reason using weil/denn and one example.",
    `Nice attempt. Repeat this prompt once more with a different detail${keyword}.`,
  ];

  return replyBank[Math.floor(Math.random() * replyBank.length)];
};

const SpeakingPage = ({ mode = "exam" }) => {
  const { level: examLevel } = useExam();
  const practiceLink = mode === "campus" ? CAMPUS_PRACTICE_LINK : EXAMS_PRACTICE_LINK;

  const [practiceMode, setPracticeMode] = useState("record");
  const [selectedLevel, setSelectedLevel] = useState((examLevel || "A1").toUpperCase());
  const [selectedTeil, setSelectedTeil] = useState("all");
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "coach",
      text: "Hi! Pick a level and question, then chat your answer. You can still open the recording link anytime.",
    },
  ]);
  const [draftMessage, setDraftMessage] = useState("");

  useEffect(() => {
    if (examLevel) {
      setSelectedLevel(String(examLevel).toUpperCase());
    }
  }, [examLevel]);

  const levelOptions = useMemo(() => {
    const levels = new Set(speakingSheetQuestions.map((question) => question.level));
    const ordered = ["A1", "A2", "B1", "B2", "C1", "C2"];

    return ordered.filter((level) => levels.has(level));
  }, []);

  const filteredQuestions = useMemo(() => {
    return speakingSheetQuestions.filter((question) => {
      const levelMatches = selectedLevel ? question.level === selectedLevel : true;
      const teilNumber = parseTeilNumber(question.teilLabel || question.teilId);
      const teilMatches = selectedTeil === "all" ? true : teilNumber === selectedTeil;
      return levelMatches && teilMatches;
    });
  }, [selectedLevel, selectedTeil]);

  useEffect(() => {
    if (!filteredQuestions.length) {
      setSelectedQuestionId("");
      return;
    }

    setSelectedQuestionId((currentId) => {
      if (filteredQuestions.some((question) => question.id === currentId)) {
        return currentId;
      }
      return filteredQuestions[0].id;
    });
  }, [filteredQuestions]);

  const selectedQuestion = useMemo(
    () => filteredQuestions.find((question) => question.id === selectedQuestionId) || null,
    [filteredQuestions, selectedQuestionId]
  );

  const sendMessage = () => {
    const trimmed = draftMessage.trim();
    if (!trimmed) return;

    setChatMessages((current) => [
      ...current,
      { role: "student", text: trimmed },
      { role: "coach", text: randomCoachReply(selectedQuestion) },
    ]);
    setDraftMessage("");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Speaking Exams{examLevel ? ` – Level ${examLevel}` : ""}</h1>
        <p style={styles.subtitle}>
          Choose how you want to practise: use the recording link directly, or open chat mode and practise with prompts from the speaking
          sheet.
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
          <button
            style={practiceMode === "record" ? styles.primaryButton : styles.secondaryButton}
            onClick={() => setPracticeMode("record")}
          >
            Use recording link
          </button>
          <button
            style={practiceMode === "chat" ? styles.primaryButton : styles.secondaryButton}
            onClick={() => setPracticeMode("chat")}
          >
            Chat practice
          </button>
        </div>

        {practiceMode === "record" ? (
          <div
            style={{
              marginTop: 16,
              padding: 16,
              borderRadius: 12,
              border: "1px solid #E5E7EB",
              background: "#F9FAFB",
            }}
          >
            <a href={practiceLink} target="_blank" rel="noreferrer" style={styles.primaryButton}>
              Open speaking exam practice link
            </a>
            <p style={{ ...styles.helperText, marginTop: 12, marginBottom: 0, wordBreak: "break-all" }}>{practiceLink}</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
            <div style={{ ...styles.uploadCard, display: "grid", gap: 10 }}>
              <div style={{ display: "grid", gap: 6 }}>
                <label style={styles.label}>Level</label>
                <select
                  style={styles.select}
                  value={selectedLevel}
                  onChange={(event) => {
                    setSelectedLevel(event.target.value);
                    setSelectedTeil("all");
                  }}
                >
                  {levelOptions.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gap: 6 }}>
                <label style={styles.label}>Teil</label>
                <select style={styles.select} value={selectedTeil} onChange={(event) => setSelectedTeil(event.target.value)}>
                  <option value="all">All</option>
                  <option value="1">Teil 1</option>
                  <option value="2">Teil 2</option>
                  <option value="3">Teil 3</option>
                </select>
              </div>

              <div style={{ display: "grid", gap: 6 }}>
                <label style={styles.label}>Question from sheet</label>
                <select
                  style={styles.select}
                  value={selectedQuestionId}
                  onChange={(event) => setSelectedQuestionId(event.target.value)}
                >
                  {filteredQuestions.map((question) => (
                    <option key={question.id} value={question.id}>
                      {`${question.teilLabel} • ${question.topicPrompt}${
                        question.keywordSubtopic ? ` (${question.keywordSubtopic})` : ""
                      }`}
                    </option>
                  ))}
                </select>
              </div>

              {selectedQuestion ? (
                <div style={{ ...styles.card, margin: 0, padding: 12, background: "#F8FAFC" }}>
                  <p style={{ margin: 0, fontWeight: 600 }}>
                    {selectedQuestion.teilLabel} · {selectedQuestion.topicPrompt}
                  </p>
                  {selectedQuestion.keywordSubtopic ? (
                    <p style={{ ...styles.helperText, margin: "6px 0 0" }}>Keyword: {selectedQuestion.keywordSubtopic}</p>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div style={{ ...styles.uploadCard, display: "grid", gap: 10 }}>
              <div style={{ maxHeight: 220, overflowY: "auto", display: "grid", gap: 8 }}>
                {chatMessages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    style={{
                      alignSelf: message.role === "student" ? "end" : "start",
                      background: message.role === "student" ? "#EEF2FF" : "#F3F4F6",
                      borderRadius: 10,
                      padding: "8px 10px",
                      maxWidth: "90%",
                    }}
                  >
                    <p style={{ margin: 0, fontSize: 13, color: "#111827" }}>{message.text}</p>
                  </div>
                ))}
              </div>

              <textarea
                style={{ ...styles.input, minHeight: 90, resize: "vertical" }}
                placeholder="Type your German answer or question here..."
                value={draftMessage}
                onChange={(event) => setDraftMessage(event.target.value)}
              />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button style={styles.primaryButton} onClick={sendMessage}>
                  Send
                </button>
                <a href={practiceLink} target="_blank" rel="noreferrer" style={styles.secondaryButton}>
                  Prefer recording? Open link
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeakingPage;
