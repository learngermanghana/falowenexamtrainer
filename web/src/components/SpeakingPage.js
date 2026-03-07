import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import { useExam } from "../context/ExamContext";
import { useAuth } from "../context/AuthContext";
import { speakingSheetQuestions } from "../data/speakingSheet";
import { requestSpeakingTextAnalysis } from "../services/presentationCoachService";
import { loadSpeakingProgress, saveSpeakingProgress } from "../services/speakingProgressService";

const EXAMS_PRACTICE_LINK =
  "https://script.google.com/macros/s/AKfycbyJ5lTeXUgaGw-rejDuh_2ex7El_28JgKLurOOsO1c8LWfVE-Em2-vuWuMn1hC5-_IN/exec";
const CAMPUS_PRACTICE_LINK =
  "https://script.google.com/macros/s/AKfycbzMIhHuWKqM2ODaOCgtS7uZCikiZJRBhpqv2p6OyBmK1yAVba8HlmVC1zgTcGWSTfrsHA/exec";

const A1_TEIL_ONE_LINE = "Name, Alter, Wohnort, Land, Sprache, Familie, Beruf, Hobby";

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
  const { idToken, user, studentProfile } = useAuth();
  const isExamMode = mode === "exam";
  const practiceLink = mode === "campus" ? CAMPUS_PRACTICE_LINK : EXAMS_PRACTICE_LINK;
  const userId = user?.uid || "";
  const studentCode =
    studentProfile?.studentCode || studentProfile?.studentcode || studentProfile?.id || user?.uid || "";

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
  const [completedQuestionIds, setCompletedQuestionIds] = useState({});
  const [progressLoaded, setProgressLoaded] = useState(false);

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

  const baseFilteredQuestions = useMemo(() => {
    return speakingSheetQuestions.filter((question) => {
      const levelMatches = selectedLevel ? question.level === selectedLevel : true;
      const teilNumber = parseTeilNumber(question.teilLabel || question.teilId);
      const teilMatches = selectedTeil === "all" ? true : teilNumber === selectedTeil;
      return levelMatches && teilMatches;
    });
  }, [selectedLevel, selectedTeil]);

  const filteredQuestions = useMemo(() => {
    if (!(selectedLevel === "A1" && (selectedTeil === "1" || selectedTeil === "all"))) {
      return baseFilteredQuestions;
    }

    const introQuestions = baseFilteredQuestions.filter((question) => parseTeilNumber(question.teilLabel || question.teilId) === "1");
    if (!introQuestions.length) return baseFilteredQuestions;

    const introQuestionIds = introQuestions.map((question) => question.id);
    const firstIntro = introQuestions[0];
    const mergedIntroQuestion = {
      ...firstIntro,
      id: "a1-teil-1-intro-line",
      topicPrompt: A1_TEIL_ONE_LINE,
      keywordSubtopic: "Type all intro details in one answer.",
      sourceQuestionIds: introQuestionIds,
    };

    return [mergedIntroQuestion, ...baseFilteredQuestions.filter((question) => !introQuestionIds.includes(question.id))];
  }, [baseFilteredQuestions, selectedLevel, selectedTeil]);

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

  useEffect(() => {
    let cancelled = false;

    const loadProgress = async () => {
      if (!userId && !studentCode) {
        setProgressLoaded(true);
        return;
      }

      const saved = await loadSpeakingProgress({ userId, studentCode, mode });
      if (cancelled) return;
      setCompletedQuestionIds(saved?.completedQuestionIds || {});
      if (saved?.selectedLevel) setSelectedLevel(saved.selectedLevel);
      if (saved?.selectedTeil) setSelectedTeil(saved.selectedTeil);
      setProgressLoaded(true);
    };

    loadProgress();

    return () => {
      cancelled = true;
    };
  }, [mode, studentCode, userId]);

  useEffect(() => {
    if (!progressLoaded || (!userId && !studentCode)) return;

    saveSpeakingProgress({
      userId,
      studentCode,
      mode,
      data: {
        completedQuestionIds,
        selectedLevel,
        selectedTeil,
        selectedQuestionId: selectedQuestionId || null,
      },
    });
  }, [completedQuestionIds, mode, progressLoaded, selectedLevel, selectedQuestionId, selectedTeil, studentCode, userId]);

  const markPromptCompleted = () => {
    if (!selectedQuestion) return;

    const sourceIds = selectedQuestion.sourceQuestionIds || [selectedQuestion.id];
    setCompletedQuestionIds((current) => {
      const updated = { ...current };
      sourceIds.forEach((id) => {
        updated[id] = true;
      });
      updated[selectedQuestion.id] = true;
      return updated;
    });
  };

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
      markPromptCompleted();
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

  const completedCount = useMemo(
    () => Object.values(completedQuestionIds).filter(Boolean).length,
    [completedQuestionIds]
  );

  const totalCount = speakingSheetQuestions.filter((question) => question.level === selectedLevel).length;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Speaking Exams{examLevel ? ` – Level ${examLevel}` : ""}</h1>
        <p style={styles.subtitle}>
          Recorder and chat are now on one page. Open the recorder anytime, then type your answer below for instant feedback.
        </p>

        <div
          style={{
            marginTop: 16,
            padding: 16,
            borderRadius: 12,
            border: "1px solid #E5E7EB",
            background: "#F9FAFB",
            display: "grid",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h3 style={{ margin: 0 }}>🎙️ Speaking Recorder</h3>
            <span style={styles.badge}>
              Progress: {Math.min(completedCount, totalCount)}/{totalCount} completed
            </span>
          </div>
          <p style={{ ...styles.helperText, margin: 0 }}>Use the recorder first, then return below and paste/type what you said.</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a href={practiceLink} target="_blank" rel="noreferrer" style={styles.primaryButton}>
              Open speaking recorder
            </a>
            <button style={styles.secondaryButton} onClick={markPromptCompleted} disabled={!selectedQuestion}>
              Mark selected prompt completed
            </button>
          </div>
          <p style={{ ...styles.helperText, margin: 0, wordBreak: "break-all" }}>{practiceLink}</p>
        </div>

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
                {selectedLevel === "A1" && selectedTeil === "1" ? (
                  <p style={{ ...styles.helperText, margin: "6px 0 0", color: "#4338CA" }}>
                    A1 Teil 1 tip: write/say all intro points in one answer line.
                  </p>
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
            </div>
          </div>

          <div style={{ ...styles.card, background: "#F8FAFC", border: "1px solid #E5E7EB", margin: 0 }}>
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>Suggested next updates</h3>
            <ul style={{ margin: 0, paddingLeft: 18, color: "#374151" }}>
              <li>Add auto-transcription from recorder audio into the chat box to save typing time.</li>
              <li>Show per-Teil completion bars so students know which speaking section needs more work.</li>
              <li>Attach teacher review comments to completed prompts directly from Firestore history.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakingPage;
