import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import { useExam } from "../context/ExamContext";
import { useAuth } from "../context/AuthContext";
import { speakingSheetQuestions } from "../data/speakingSheet";
import { requestSpeakingTextAnalysis } from "../services/presentationCoachService";

const EXAMS_PRACTICE_LINK =
  "https://script.google.com/macros/s/AKfycbyJ5lTeXUgaGw-rejDuh_2ex7El_28JgKLurOOsO1c8LWfVE-Em2-vuWuMn1hC5-_IN/exec";
const CAMPUS_PRACTICE_LINK =
  "https://script.google.com/macros/s/AKfycbzMIhHuWKqM2ODaOCgtS7uZCikiZJRBhpqv2p6OyBmK1yAVba8HlmVC1zgTcGWSTfrsHA/exec";

const parseTeilNumber = (teilLabel = "") => {
  const match = String(teilLabel).match(/teil\s*(\d+)/i);
  return match ? match[1] : "";
};

const extractTag = (text, tag) => {
  const match = String(text || "").match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match?.[1]?.trim() || "";
};

const parseRubric = (text) => {
  const raw = extractTag(text, "rubric");
  if (!raw) return null;
  const parts = raw.split("|").map((item) => item.trim());
  const parseScore = (label) => {
    const hit = parts.find((item) => item.toLowerCase().startsWith(label.toLowerCase()));
    const score = Number((hit?.match(/(\d+)/) || [])[1] || 0);
    return Math.max(0, Math.min(5, score));
  };
  return {
    grammar: parseScore("grammar"),
    vocabulary: parseScore("vocabulary"),
    pronunciationReadiness: parseScore("pronunciation readiness"),
    structure: parseScore("structure"),
  };
};

const SpeakingPage = ({ mode = "exam" }) => {
  const { level: examLevel } = useExam();
  const { idToken } = useAuth();
  const isExamMode = mode === "exam";
  const practiceLink = mode === "campus" ? CAMPUS_PRACTICE_LINK : EXAMS_PRACTICE_LINK;

  const [practiceMode, setPracticeMode] = useState("record");
  const [selectedLevel, setSelectedLevel] = useState((examLevel || "A1").toUpperCase());
  const [selectedTeil, setSelectedTeil] = useState("all");
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "coach",
      text: "Hi! Pick a question, then chat your answer. I'll analyze it and score key speaking criteria.",
    },
  ]);
  const [draftMessage, setDraftMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  const [lastRubric, setLastRubric] = useState(null);

  useEffect(() => {
    if (isExamMode && examLevel) {
      setSelectedLevel(String(examLevel).toUpperCase());
    }
  }, [examLevel, isExamMode]);

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

  const sendMessage = async () => {
    const trimmed = draftMessage.trim();
    if (!trimmed || chatLoading || !selectedQuestion) return;

    const studentMessage = { role: "student", text: trimmed };
    setChatMessages((current) => [...current, studentMessage]);
    setDraftMessage("");
    setChatLoading(true);
    setChatError("");

    const promptHeader = [
      `Exam speaking level: ${selectedLevel}`,
      `Task: ${selectedQuestion.teilLabel}`,
      `Prompt: ${selectedQuestion.topicPrompt}`,
      selectedQuestion.keywordSubtopic ? `Keyword to include: ${selectedQuestion.keywordSubtopic}` : null,
      "Please mark and analyze this answer based on Goethe-style speaking expectations.",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const response = await requestSpeakingTextAnalysis({
        text: `${promptHeader}\n\nStudent answer:\n${trimmed}`,
        teil: selectedQuestion.teilLabel || selectedQuestion.teilId || "",
        level: selectedLevel,
        question: selectedQuestion.topicPrompt || "",
        idToken,
      });
      const replyText = String(response?.feedback || "").trim() || "I could not analyze that answer. Please try again.";
      setLastRubric(parseRubric(replyText));
      setChatMessages((current) => [...current, { role: "coach", text: replyText }]);
    } catch (error) {
      setChatError(error?.message || "Could not reach the AI coach.");
      setChatMessages((current) => [
        ...current,
        {
          role: "coach",
          text: "I couldn't analyze your answer right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
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
                {isExamMode ? (
                  <div style={{ ...styles.input, background: "#F3F4F6", color: "#111827", fontWeight: 700 }}>{selectedLevel}</div>
                ) : (
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
                )}
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

              {lastRubric ? (
                <div style={{ ...styles.card, margin: 0, padding: 12, background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
                  <p style={{ margin: 0, fontWeight: 700 }}>Latest AI scoring</p>
                  <p style={{ ...styles.helperText, margin: "6px 0 0" }}>
                    Grammar: {lastRubric.grammar}/5 · Vocabulary: {lastRubric.vocabulary}/5 · Pronunciation readiness: {lastRubric.pronunciationReadiness}/5 · Structure: {lastRubric.structure}/5
                  </p>
                </div>
              ) : null}

              {chatError ? <p style={{ margin: 0, color: "#B91C1C", fontSize: 13 }}>{chatError}</p> : null}

              <textarea
                style={{ ...styles.input, minHeight: 90, resize: "vertical" }}
                placeholder="Type your German answer or question here..."
                value={draftMessage}
                onChange={(event) => setDraftMessage(event.target.value)}
                disabled={chatLoading}
              />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button style={styles.primaryButton} onClick={sendMessage} disabled={chatLoading || !selectedQuestion}>
                  {chatLoading ? "Analyzing..." : "Send"}
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
