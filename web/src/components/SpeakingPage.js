import React, { useEffect, useMemo, useRef, useState } from "react";
import { styles } from "../styles";
import { useExam } from "../context/ExamContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { speakingQuestionDictionary } from "../data/speakingDictionary";
import { requestCustomSpeakingChatReply, requestSpeakingTextAnalysis } from "../services/presentationCoachService";
import { analyzeAudio } from "../services/coachService";
import { loadSpeakingProgress, saveSpeakingProgress } from "../services/speakingProgressService";
import { triggerInteractionFeedback } from "../services/interactionFeedback";

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

const formatTime = (seconds = 0) => {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
};


const formatQuestionDisplay = (question) => {
  if (!question) return "";
  const keyword = String(question.keywordSubtopic || "").trim();
  if (!keyword) return `${question.teilLabel} • ${question.topicPrompt}`;
  return `${question.teilLabel} • ${question.topicPrompt} (Keyword: ${keyword})`;
};

const formatClock = (date) =>
  new Date(date).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

const waveHeights = [8, 16, 24, 18, 26, 14, 20, 30, 22, 28, 16, 24, 14, 20, 12];
const MIN_RECORDING_SECONDS = 3;
const audioCaptureConstraints = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  channelCount: 1,
};

const SpeakingPage = ({ mode = "exam" }) => {
  const { level: examLevel } = useExam();
  const { idToken, user, studentProfile } = useAuth();
  const { showToast } = useToast();
  const isExamMode = mode === "exam";
  const userId = user?.uid || "";
  const studentCode =
    studentProfile?.studentCode || studentProfile?.studentcode || studentProfile?.id || user?.uid || "";

  const [activeSpeakingTab, setActiveSpeakingTab] = useState("exam");
  const [selectedLevel, setSelectedLevel] = useState((examLevel || "A1").toUpperCase());
  const [selectedTeil, setSelectedTeil] = useState("all");
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      id: "welcome-1",
      role: "coach",
      type: "text",
      text: "Hallo! Pick a speaking prompt and send text or voice. I will coach you step by step.",
      createdAt: new Date().toISOString(),
    },
  ]);
  const [draftMessage, setDraftMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  const [customChatMessages, setCustomChatMessages] = useState([
    {
      id: "custom-welcome-1",
      role: "coach",
      type: "text",
      text: "Hallo! This is your custom Sprechen chat. Talk about anything you like, and I will answer, correct gently, and ask you one follow-up question.",
      createdAt: new Date().toISOString(),
    },
  ]);
  const [customDraftMessage, setCustomDraftMessage] = useState("");
  const [customChatLoading, setCustomChatLoading] = useState(false);
  const [customChatError, setCustomChatError] = useState("");
  const [lastRubric, setLastRubric] = useState(null);
  const [completedQuestionIds, setCompletedQuestionIds] = useState({});
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordingError, setRecordingError] = useState("");
  const [playingMessageId, setPlayingMessageId] = useState("");
  const [isCompactViewport, setIsCompactViewport] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const recordingSecondsRef = useRef(0);
  const audioRefs = useRef({});
  const messagesEndRef = useRef(null);
  const customMessagesEndRef = useRef(null);

  useEffect(() => {
    if (isExamMode && examLevel) {
      setSelectedLevel(String(examLevel).toUpperCase());
    }
  }, [examLevel, isExamMode]);

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

  const levelOptions = useMemo(() => {
    const levels = new Set(speakingQuestionDictionary.map((question) => question.level));
    const ordered = ["A1", "A2", "B1", "B2", "C1", "C2"];

    return ordered.filter((level) => levels.has(level));
  }, []);

  const baseFilteredQuestions = useMemo(() => {
    return speakingQuestionDictionary.filter((question) => {
      const levelMatches = selectedLevel ? question.level === selectedLevel : true;
      const teilNumber = parseTeilNumber(question.teilLabel || question.teilId);
      const teilMatches = selectedTeil === "all" ? true : teilNumber === selectedTeil;
      return levelMatches && teilMatches;
    });
  }, [selectedLevel, selectedTeil]);
  const filteredQuestions = baseFilteredQuestions;

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

  const quickTopics = useMemo(() => {
    const fromSheet = filteredQuestions.slice(0, 3).map((question) => question.topicPrompt);
    return [...new Set([...(selectedQuestion ? [selectedQuestion.topicPrompt] : []), ...fromSheet])].slice(0, 4);
  }, [filteredQuestions, selectedQuestion]);

  const customQuickStarters = useMemo(
    () => [
      "Lass uns über meinen Alltag sprechen.",
      "Frag mich über meine Hobbys.",
      "Ich möchte Smalltalk im Café üben.",
      "Hilf mir, flüssiger über Arbeit oder Schule zu sprechen.",
    ],
    []
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
      const shouldUseSavedLevel = !(isExamMode && examLevel);
      if (saved?.selectedLevel && shouldUseSavedLevel) {
        setSelectedLevel(String(saved.selectedLevel).toUpperCase());
      }
      if (saved?.selectedTeil) setSelectedTeil(saved.selectedTeil);
      setProgressLoaded(true);
    };

    loadProgress();

    return () => {
      cancelled = true;
    };
  }, [examLevel, isExamMode, mode, studentCode, userId]);

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

  useEffect(() => {
    if (activeSpeakingTab !== "exam") return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeSpeakingTab, chatMessages, chatLoading]);

  useEffect(() => {
    if (activeSpeakingTab !== "custom") return;
    customMessagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeSpeakingTab, customChatLoading, customChatMessages]);

  useEffect(() => {
    const audioElements = audioRefs.current;

    return () => {
      if (recordingIntervalRef.current) window.clearInterval(recordingIntervalRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      Object.values(audioElements).forEach((audio) => {
        if (audio) audio.pause();
      });
    };
  }, []);

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

  const appendCoachText = (text) => {
    setChatMessages((current) => [
      ...current,
      {
        id: `coach-${Date.now()}`,
        role: "coach",
        type: "text",
        text,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const sendMessage = async () => {
    const trimmed = draftMessage.trim();
    if (!trimmed || chatLoading || !selectedQuestion) return;

    const studentMessage = {
      id: `student-${Date.now()}`,
      role: "student",
      type: "text",
      text: trimmed,
      createdAt: new Date().toISOString(),
    };
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
        question: selectedQuestion.text || selectedQuestion.topicPrompt || "",
        idToken,
      });
      const replyText = String(response?.feedback || "").trim() || "I could not analyze that answer. Please try again.";
      setLastRubric(parseRubric(replyText));
      appendCoachText(replyText);
      markPromptCompleted();
      triggerInteractionFeedback({
        sound: "success",
        toastMessage: "Speaking coach replied.",
        toastVariant: "success",
        showToast,
        notificationTitle: "Speaking coach response",
        notificationBody: "Your text answer has been reviewed.",
        notificationTag: "speaking-text-reply",
        vibratePattern: [45],
      });
    } catch (error) {
      setChatError(error?.message || "Could not reach the AI coach.");
      appendCoachText("I couldn't analyze your answer right now. Please try again in a moment.");
      triggerInteractionFeedback({
        sound: "error",
        toastMessage: "Speaking coach is unavailable right now.",
        toastVariant: "error",
        showToast,
        vibratePattern: [120],
      });
    } finally {
      setChatLoading(false);
    }
  };

  const appendCustomCoachText = (text) => {
    setCustomChatMessages((current) => [
      ...current,
      {
        id: `custom-coach-${Date.now()}`,
        role: "coach",
        type: "text",
        text,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const sendCustomChatMessage = async () => {
    const trimmed = customDraftMessage.trim();
    if (!trimmed || customChatLoading) return;

    const studentMessage = {
      id: `custom-student-${Date.now()}`,
      role: "student",
      type: "text",
      text: trimmed,
      createdAt: new Date().toISOString(),
    };
    const history = customChatMessages
      .filter((message) => message.type === "text")
      .map((message) => ({
        role: message.role === "student" ? "user" : "assistant",
        content: message.text,
      }));

    setCustomChatMessages((current) => [...current, studentMessage]);
    setCustomDraftMessage("");
    setCustomChatLoading(true);
    setCustomChatError("");

    try {
      const response = await requestCustomSpeakingChatReply({
        message: trimmed,
        level: selectedLevel,
        history,
        idToken,
      });
      const replyText = String(response?.reply || "").trim() || "Ich konnte gerade nicht antworten. Bitte versuche es noch einmal.";
      appendCustomCoachText(replyText);
      triggerInteractionFeedback({
        sound: "success",
        toastMessage: "Custom Sprechen chat replied.",
        toastVariant: "success",
        showToast,
        notificationTitle: "Custom Sprechen chat",
        notificationBody: "Your speaking partner replied.",
        notificationTag: "custom-speaking-chat-reply",
        vibratePattern: [45],
      });
    } catch (error) {
      setCustomChatError(error?.message || "Could not reach the custom Sprechen chat.");
      appendCustomCoachText("Der freie Sprechen-Chat ist gerade nicht verfügbar. Bitte versuche es gleich noch einmal.");
      triggerInteractionFeedback({
        sound: "error",
        toastMessage: "Custom Sprechen chat is unavailable right now.",
        toastVariant: "error",
        showToast,
        vibratePattern: [120],
      });
    } finally {
      setCustomChatLoading(false);
    }
  };

  const startRecording = async () => {
    if (isRecording || !selectedQuestion) return;
    setRecordingError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: audioCaptureConstraints,
      });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      recorder.onstop = async () => {
        const elapsedRecordingSeconds = recordingSecondsRef.current;
        if (recordingIntervalRef.current) {
          window.clearInterval(recordingIntervalRef.current);
          recordingIntervalRef.current = null;
        }
        if (elapsedRecordingSeconds < MIN_RECORDING_SECONDS) {
          setRecordingError(`Please record for at least ${MIN_RECORDING_SECONDS} seconds so the AI can hear you clearly.`);
          setRecordingSeconds(0);
          recordingSecondsRef.current = 0;
          setIsRecording(false);
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }
          return;
        }

        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        const duration = elapsedRecordingSeconds;

        setChatMessages((current) => [
          ...current,
          {
            id: `voice-${Date.now()}`,
            role: "student",
            type: "audio",
            audioUrl: url,
            duration,
            createdAt: new Date().toISOString(),
          },
        ]);
        setRecordingSeconds(0);
        recordingSecondsRef.current = 0;
        setIsRecording(false);
        markPromptCompleted();
        setChatLoading(true);
        setChatError("");

        try {
          const response = await analyzeAudio({
            audioBlob: blob,
            teil: selectedQuestion.teilLabel || selectedQuestion.teilId || "",
            level: selectedLevel,
            question: selectedQuestion.text || selectedQuestion.topicPrompt || "",
            userId,
            idToken,
          });

          const transcript = String(response?.transcript || "").trim();
          const replyText = String(response?.feedback || "").trim() || "I could not analyze that answer. Please try again.";

          if (transcript) {
            appendCoachText(`Transcript I heard: ${transcript}`);
          }
          setLastRubric(parseRubric(replyText));
          appendCoachText(replyText);
          triggerInteractionFeedback({
            sound: "success",
            toastMessage: "Voice feedback received.",
            toastVariant: "success",
            showToast,
            notificationTitle: "Speaking voice review ready",
            notificationBody: "Your recording has been analyzed.",
            notificationTag: "speaking-audio-reply",
            vibratePattern: [45],
          });
        } catch (error) {
          setChatError(error?.message || "Could not reach the AI coach.");
          appendCoachText("I couldn't analyze your recording right now. Please try again in a moment.");
          triggerInteractionFeedback({
            sound: "error",
            toastMessage: "Could not analyze your recording right now.",
            toastVariant: "error",
            showToast,
            vibratePattern: [120],
          });
        } finally {
          setChatLoading(false);
        }

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecordingSeconds(0);
      recordingSecondsRef.current = 0;
      setIsRecording(true);
      recordingIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((value) => {
          const nextValue = value + 1;
          recordingSecondsRef.current = nextValue;
          return nextValue;
        });
      }, 1000);
    } catch (error) {
      setRecordingError(error?.message || "Microphone access was blocked.");
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== "recording") return;
    mediaRecorderRef.current.stop();
  };

  const toggleAudioPlayback = (messageId) => {
    const currentAudio = audioRefs.current[messageId];
    if (!currentAudio) return;

    if (playingMessageId && playingMessageId !== messageId) {
      const previousAudio = audioRefs.current[playingMessageId];
      if (previousAudio) {
        previousAudio.pause();
        previousAudio.currentTime = 0;
      }
    }

    if (playingMessageId === messageId) {
      currentAudio.pause();
      setPlayingMessageId("");
      return;
    }

    currentAudio.play();
    setPlayingMessageId(messageId);
  };

  const clearConversation = () => {
    if (activeSpeakingTab === "custom") {
      setCustomChatMessages([
        {
          id: `custom-welcome-${Date.now()}`,
          role: "coach",
          type: "text",
          text: "Custom Sprechen chat cleared. Start any German conversation topic when you are ready.",
          createdAt: new Date().toISOString(),
        },
      ]);
      setCustomChatError("");
      setCustomDraftMessage("");
      return;
    }

    setChatMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "coach",
        type: "text",
        text: "Conversation cleared. Pick a prompt and start again.",
        createdAt: new Date().toISOString(),
      },
    ]);
    setLastRubric(null);
    setChatError("");
    setDraftMessage("");
    setPlayingMessageId("");
  };

  const completedCount = useMemo(
    () => Object.values(completedQuestionIds).filter(Boolean).length,
    [completedQuestionIds]
  );

  const totalCount = speakingQuestionDictionary.filter((question) => question.level === selectedLevel).length;

  return (
    <div style={{ ...styles.container, padding: isCompactViewport ? "10px 0 28px" : styles.container.padding }}>
      <div
        style={{
          ...styles.card,
          padding: 0,
          overflow: "hidden",
          borderRadius: isCompactViewport ? 0 : styles.card.borderRadius,
        }}
      >
        <div
          style={{
            background: "linear-gradient(120deg, #4f46e5, #8b5cf6, #a21caf)",
            color: "#ffffff",
            padding: "18px 20px",
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div>
            <p style={{ margin: 0, opacity: 0.85, fontSize: 13 }}>Online • Ready to practice</p>
            <h1 style={{ margin: "4px 0 0", fontSize: 28 }}>Goethe Speaking Exam Coach</h1>
            <p style={{ margin: "6px 0 0", opacity: 0.9, fontSize: 13 }}>
              Speaking Exams {examLevel ? `• Level ${examLevel}` : ""}
            </p>
          </div>
          <button style={{ ...styles.secondaryButton, background: "rgba(255,255,255,0.95)" }} onClick={clearConversation}>
            Clear conversation
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, padding: "12px 16px", background: "#F8FAFC", borderBottom: "1px solid #E5E7EB", flexWrap: "wrap" }}>
          {[
            { key: "exam", label: "Exam prompts" },
            { key: "custom", label: "Custom chat" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              style={{
                ...(activeSpeakingTab === tab.key ? styles.navButtonActive : styles.navButton),
                borderRadius: 999,
                padding: "8px 14px",
              }}
              onClick={() => setActiveSpeakingTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeSpeakingTab === "custom" ? (
          <div style={{ display: "grid", gridTemplateColumns: isCompactViewport ? "1fr" : "minmax(240px, 320px) 1fr", gap: 0 }}>
            <aside
              style={{
                borderRight: isCompactViewport ? "none" : "1px solid #E5E7EB",
                borderBottom: isCompactViewport ? "1px solid #E5E7EB" : "none",
                background: "#F8FAFC",
                padding: isCompactViewport ? 12 : 16,
                display: "grid",
                alignContent: "start",
                gap: 14,
              }}
            >
              <span style={styles.badge}>Free Sprechen practice • {selectedLevel}</span>

              <div style={{ ...styles.card, margin: 0, padding: 12, background: "#ECFDF5", border: "1px solid #A7F3D0" }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 13 }}>How custom chat works</p>
                <p style={{ ...styles.helperText, margin: "8px 0 0" }}>
                  Talk freely about school, work, travel, family, daily life, or any topic. The AI keeps the conversation at your level, corrects gently, and asks a new German question.
                </p>
              </div>

              <div style={{ display: "grid", gap: 6 }}>
                <label style={styles.label}>Quick starters</label>
                {customQuickStarters.map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    style={{ ...styles.secondaryButton, justifyContent: "flex-start", textAlign: "left" }}
                    onClick={() => setCustomDraftMessage(starter)}
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </aside>

            <section style={{ background: "#E5E7EB", minHeight: isCompactViewport ? 480 : 580, display: "grid", gridTemplateRows: "1fr auto" }}>
              <div style={{ padding: 16, overflowY: "auto", display: "grid", gap: 12 }}>
                {customChatMessages.map((message) => {
                  const isStudent = message.role === "student";
                  return (
                    <div
                      key={message.id}
                      style={{
                        display: "flex",
                        justifyContent: isStudent ? "flex-end" : "flex-start",
                        alignItems: "flex-start",
                        gap: 10,
                      }}
                    >
                      {!isStudent ? (
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#BBF7D0", display: "grid", placeItems: "center" }}>
                          💬
                        </div>
                      ) : null}
                      <div
                        style={{
                          maxWidth: "78%",
                          borderRadius: 18,
                          padding: "10px 14px",
                          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.08)",
                          background: isStudent ? "linear-gradient(120deg, #059669, #0f766e)" : "#ffffff",
                          color: isStudent ? "#ffffff" : "#1f2937",
                        }}
                      >
                        <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{message.text}</p>
                        <p style={{ margin: "6px 0 0", opacity: 0.75, fontSize: 11 }}>{formatClock(message.createdAt)}</p>
                      </div>
                      {isStudent ? (
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#D1FAE5", display: "grid", placeItems: "center" }}>
                          👤
                        </div>
                      ) : null}
                    </div>
                  );
                })}

                {customChatLoading ? (
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#BBF7D0", display: "grid", placeItems: "center" }}>
                      💬
                    </div>
                    <div style={{ background: "#ffffff", borderRadius: 16, padding: "10px 14px", color: "#4B5563", fontSize: 13 }}>
                      Custom Sprechen chat is typing…
                    </div>
                  </div>
                ) : null}
                <div ref={customMessagesEndRef} />
              </div>

              <div style={{ borderTop: "1px solid #D1D5DB", padding: 14, background: "#F9FAFB", display: "grid", gap: 10 }}>
                <p style={{ margin: 0, fontSize: 12, color: "#047857" }}>
                  Free chat mode: write in German when you can. You may use English if you are stuck.
                </p>
                {customChatError ? <p style={{ margin: 0, color: "#B91C1C", fontSize: 12 }}>{customChatError}</p> : null}
                <div style={{ display: "flex", gap: 8, flexDirection: isCompactViewport ? "column" : "row" }}>
                  <textarea
                    style={{ ...styles.input, minHeight: 56, maxHeight: 120, resize: "vertical" }}
                    placeholder="Start a free German conversation..."
                    value={customDraftMessage}
                    onChange={(event) => setCustomDraftMessage(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        sendCustomChatMessage();
                      }
                    }}
                    disabled={customChatLoading}
                  />
                  <button
                    style={{ ...styles.primaryButton, borderRadius: 12, minWidth: isCompactViewport ? "100%" : 88, background: "#059669" }}
                    onClick={sendCustomChatMessage}
                    disabled={customChatLoading}
                  >
                    Send
                  </button>
                </div>
              </div>
            </section>
          </div>
        ) : null}

        <div style={{ display: activeSpeakingTab === "exam" ? "grid" : "none", gridTemplateColumns: isCompactViewport ? "1fr" : "minmax(240px, 320px) 1fr", gap: 0 }}>
          <aside
            style={{
              borderRight: isCompactViewport ? "none" : "1px solid #E5E7EB",
              borderBottom: isCompactViewport ? "1px solid #E5E7EB" : "none",
              background: "#F8FAFC",
              padding: isCompactViewport ? 12 : 16,
              display: "grid",
              gap: 14,
            }}
          >
            <span style={styles.badge}>
              Progress: {Math.min(completedCount, totalCount)}/{totalCount}
            </span>

            <div style={{ display: "grid", gap: 6 }}>
              <label style={styles.label}>Level</label>
              {isExamMode ? (
                <div style={{ ...styles.input, background: "#EEF2FF", fontWeight: 700 }}>{selectedLevel}</div>
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
              <label style={styles.label}>Question</label>
              <select style={styles.select} value={selectedQuestionId} onChange={(event) => setSelectedQuestionId(event.target.value)}>
                {filteredQuestions.map((question) => (
                  <option key={question.id} value={question.id}>
                    {formatQuestionDisplay(question)}
                  </option>
                ))}
              </select>
            </div>

            <button style={styles.primaryButton} onClick={isRecording ? stopRecording : startRecording} disabled={!selectedQuestion}>
              {isRecording ? `Stop & Send (${formatTime(recordingSeconds)})` : "🎙️ Start voice recording"}
            </button>
            {recordingError ? <p style={{ ...styles.helperText, margin: 0, color: "#B91C1C" }}>{recordingError}</p> : null}
            <p style={{ ...styles.helperText, margin: 0 }}>
              Listening tip: use a headset, reduce background noise, and speak for at least {MIN_RECORDING_SECONDS} seconds.
            </p>

            <div style={{ ...styles.card, margin: 0, padding: 12, background: "#EEF2FF", border: "1px solid #C7D2FE" }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 13 }}>Quick practice topics</p>
              <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                {quickTopics.map((topic) => (
                  <button
                    key={topic}
                    style={{ ...styles.secondaryButton, padding: "6px 10px", fontSize: 12 }}
                    onClick={() => setDraftMessage(`Zum Thema "${topic}": `)}
                  >
                    {topic.slice(0, 40)}{topic.length > 40 ? "…" : ""}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section style={{ background: "#E5E7EB", minHeight: isCompactViewport ? 480 : 580, display: "grid", gridTemplateRows: "1fr auto" }}>
            <div style={{ padding: 16, overflowY: "auto", display: "grid", gap: 12 }}>
              {chatMessages.map((message) => {
                const isStudent = message.role === "student";
                return (
                  <div
                    key={message.id}
                    style={{
                      display: "flex",
                      justifyContent: isStudent ? "flex-end" : "flex-start",
                      alignItems: "flex-start",
                      gap: 10,
                    }}
                  >
                    {!isStudent ? (
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#C7D2FE", display: "grid", placeItems: "center" }}>
                        🤖
                      </div>
                    ) : null}
                    <div
                      style={{
                        maxWidth: "78%",
                        borderRadius: 18,
                        padding: "10px 14px",
                        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.08)",
                        background: isStudent ? "linear-gradient(120deg, #4f46e5, #9333ea)" : "#ffffff",
                        color: isStudent ? "#ffffff" : "#1f2937",
                      }}
                    >
                      {message.type === "audio" ? (
                        <div style={{ display: "grid", gap: 8 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <button
                              style={{
                                border: "none",
                                borderRadius: "50%",
                                width: 34,
                                height: 34,
                                cursor: "pointer",
                                background: "rgba(255,255,255,0.25)",
                                color: "#fff",
                              }}
                              onClick={() => toggleAudioPlayback(message.id)}
                            >
                              {playingMessageId === message.id ? "⏸" : "▶"}
                            </button>
                            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                              {waveHeights.map((height, index) => (
                                <span
                                  key={`${message.id}-wave-${index}`}
                                  style={{
                                    display: "inline-block",
                                    width: 3,
                                    height,
                                    borderRadius: 999,
                                    background: "rgba(255,255,255,0.55)",
                                  }}
                                />
                              ))}
                            </div>
                            <span style={{ fontSize: 12, opacity: 0.95 }}>{formatTime(message.duration || 0)}</span>
                          </div>
                          <audio
                            ref={(node) => {
                              if (node) {
                                audioRefs.current[message.id] = node;
                                node.onended = () => setPlayingMessageId("");
                              }
                            }}
                            src={message.audioUrl}
                          />
                        </div>
                      ) : (
                        <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{message.text}</p>
                      )}
                      <p style={{ margin: "6px 0 0", opacity: 0.75, fontSize: 11 }}>{formatClock(message.createdAt)}</p>
                    </div>
                    {isStudent ? (
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#E9D5FF", display: "grid", placeItems: "center" }}>
                        👤
                      </div>
                    ) : null}
                  </div>
                );
              })}

              {chatLoading ? (
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#C7D2FE", display: "grid", placeItems: "center" }}>
                    🤖
                  </div>
                  <div style={{ background: "#ffffff", borderRadius: 16, padding: "10px 14px", color: "#4B5563", fontSize: 13 }}>
                    AI is typing…
                  </div>
                </div>
              ) : null}
              <div ref={messagesEndRef} />
            </div>

            <div style={{ borderTop: "1px solid #D1D5DB", padding: 14, background: "#F9FAFB", display: "grid", gap: 10 }}>
              {selectedQuestion ? (
                <p style={{ margin: 0, fontSize: 12, color: "#4338CA" }}>
                  {formatQuestionDisplay(selectedQuestion)}
                </p>
              ) : null}

              {lastRubric ? (
                <p style={{ margin: 0, fontSize: 12, color: "#1E3A8A" }}>
                  Latest score — Grammar: {lastRubric.grammar}/5 · Vocabulary: {lastRubric.vocabulary}/5 · Pronunciation: {lastRubric.pronunciationReadiness}/5 · Structure: {lastRubric.structure}/5
                </p>
              ) : null}

              {chatError ? <p style={{ margin: 0, color: "#B91C1C", fontSize: 12 }}>{chatError}</p> : null}

              <div style={{ display: "flex", gap: 8, flexDirection: isCompactViewport ? "column" : "row" }}>
                <textarea
                  style={{ ...styles.input, minHeight: 56, maxHeight: 120, resize: "vertical" }}
                  placeholder="Type your German response and press Enter..."
                  value={draftMessage}
                  onChange={(event) => setDraftMessage(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      sendMessage();
                    }
                  }}
                  disabled={chatLoading}
                />
                <button
                  style={{ ...styles.primaryButton, borderRadius: 12, minWidth: isCompactViewport ? "100%" : 88 }}
                  onClick={sendMessage}
                  disabled={chatLoading || !selectedQuestion}
                >
                  Send
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SpeakingPage;
