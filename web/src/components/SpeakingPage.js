import React, { useEffect, useMemo, useRef, useState } from "react";
import { styles } from "../styles";
import LiveSpeakPage from "./LiveSpeakPage";
import SpeakingExaminationScreen from "./SpeakingExaminationScreen";
import SpeakingPracticeHome, { SpeakingRunResults } from "./SpeakingPracticeHome";
import "./SpeakingExamDesign.css";
import { useExam } from "../context/ExamContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { speakingQuestionDictionary } from "../data/speakingDictionary";
import {
  getVisibleSpeakingTabs,
  normalizeLockedSpeakingLevel,
  normalizeLockedSpeakingTeil,
  resolveInitialSpeakingFilters,
} from "../lib/speakingExamLock";
import { CUSTOM_SPEAKING_CHAT_SESSION_SECONDS, requestCustomSpeakingChatReply, requestSpeakingTextAnalysis } from "../services/presentationCoachService";
import {
  CUSTOM_SPEAKING_CHAT_DURATION_OPTIONS,
  DEFAULT_CUSTOM_SPEAKING_CHAT_DURATION_MINUTES,
  normalizeSpeakingChatDurationMinutes,
  speakingChatSessionSeconds,
} from "../lib/speakingSessionDuration";
import { logStudentActivity } from "../services/studyBuddyService";
import { analyzeAudio } from "../services/coachService";
import { loadSpeakingProgress, saveSpeakingProgress } from "../services/speakingProgressService";
import { freshTaskOptions, isPractised, nextExamTeil, recordExamPractice } from "../lib/speakingPracticeHistory";
import { triggerInteractionFeedback } from "../services/interactionFeedback";
import {
  SPEAKING_AUDIO_MIN_SECONDS as MIN_RECORDING_SECONDS,
  buildRecordedAudioBlob,
  createSpeakingMediaRecorder,
  maxSpeakingRecordingSeconds,
  playAudioElement,
  revokeObjectUrl,
  userFacingAudioError,
} from "../lib/speakingAudio";
import { COACH_TTS_LEVELS, useCustomCoachSpeech } from "../hooks/useCustomCoachSpeech";

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
const GERMAN_KEYS = ["ä", "ö", "ü", "ß"];
const AUDIO_REPLIES_STORAGE_KEY = "falowen.customSpeaking.audioReplies";
const AUTOPLAY_REPLIES_STORAGE_KEY = "falowen.customSpeaking.autoplayReplies";

const readStoredBoolean = (key, fallback) => {
  if (typeof window === "undefined") return fallback;
  const value = window.localStorage.getItem(key);
  if (value === null) return fallback;
  return value === "true";
};

const audioCaptureConstraints = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  channelCount: 1,
};

const SpeakingPage = ({
  mode = "exam",
  lockedLevel: lockedLevelProp = "",
  lockedTeil: lockedTeilProp = "",
  examOnly = false,
  contextLabel = "",
}) => {
  const { level: examLevel } = useExam();
  const { idToken, user, studentProfile } = useAuth();
  const { showToast } = useToast();
  const isExamMode = mode === "exam";
  const isCourseMode = mode === "course";
  const normalizedLockedLevel = normalizeLockedSpeakingLevel(lockedLevelProp);
  const normalizedLockedTeil = normalizeLockedSpeakingTeil(lockedTeilProp);
  const initialSpeakingFilters = resolveInitialSpeakingFilters({
    lockedLevel: normalizedLockedLevel,
    lockedTeil: normalizedLockedTeil,
    examLevel,
  });
  const userId = user?.uid || "";
  const studentCode =
    studentProfile?.studentCode || studentProfile?.studentcode || studentProfile?.id || user?.uid || "";

  const [activeSpeakingTab, setActiveSpeakingTab] = useState(isCourseMode ? "custom" : "exam");
  // One original speaking coach, with optional spoken examiner inside it.
  const [showLiveExaminer, setShowLiveExaminer] = useState(false);
  const [liveExaminerActive, setLiveExaminerActive] = useState(false);
  const showVoiceMode = isExamMode && typeof window !== "undefined" &&
    /^\/exams\/(?:speaking|room)(?:\/|$)/.test(window.location.pathname);
  const [selectedLevel, setSelectedLevel] = useState(initialSpeakingFilters.level);
  const [selectedTeil, setSelectedTeil] = useState(isExamMode && initialSpeakingFilters.teil === "all" ? "1" : initialSpeakingFilters.teil);
  const [practiceStage, setPracticeStage] = useState("home");
  const [fullExam, setFullExam] = useState(false);
  const [runResults, setRunResults] = useState([]);
  const [practiceAttempt, setPracticeAttempt] = useState(0);
  const [taskMode, setTaskMode] = useState("random");
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const previousExamLevelRef = useRef(examLevel);
  useEffect(() => {
    const nextLevel = normalizeLockedSpeakingLevel(examLevel);
    if (!isExamMode || normalizedLockedLevel || !nextLevel || liveExaminerActive) return;
    if (previousExamLevelRef.current === examLevel) return;
    previousExamLevelRef.current = examLevel;
    setPracticeStage("home");
    setFullExam(false);
    setRunResults([]);
    setSelectedLevel(nextLevel);
    setSelectedTeil("1");
    setShowLiveExaminer(false);
  }, [examLevel, isExamMode, normalizedLockedLevel, liveExaminerActive]);
  const [chatMessages, setChatMessages] = useState([
    {
      id: "welcome-1",
      role: "coach",
      type: "text",
      text: "Guten Tag! Wählen Sie einen Prüfungsteil und beginnen Sie mit der Aufgabe.",
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
  const [audioRepliesEnabled, setAudioRepliesEnabled] = useState(() => readStoredBoolean(AUDIO_REPLIES_STORAGE_KEY, true));
  const [autoPlayRepliesEnabled, setAutoPlayRepliesEnabled] = useState(() => readStoredBoolean(AUTOPLAY_REPLIES_STORAGE_KEY, true));
  const [customSessionState, setCustomSessionState] = useState("idle");
  const [customSessionDurationMinutes, setCustomSessionDurationMinutes] = useState(DEFAULT_CUSTOM_SPEAKING_CHAT_DURATION_MINUTES);
  const [customSessionSecondsLeft, setCustomSessionSecondsLeft] = useState(CUSTOM_SPEAKING_CHAT_SESSION_SECONDS);
  const [lastRubric, setLastRubric] = useState(null);
  const [completedQuestionIds, setCompletedQuestionIds] = useState({});
  const [examPracticeHistory, setExamPracticeHistory] = useState({});
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingMode, setRecordingMode] = useState("");
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordingError, setRecordingError] = useState("");
  const [playingMessageId, setPlayingMessageId] = useState("");
  const [playbackError, setPlaybackError] = useState("");
  const [isCompactViewport, setIsCompactViewport] = useState(false);

  const customSessionTimeoutLoggedRef = useRef(false);
  const customDraftRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const recordingSecondsRef = useRef(0);
  const audioRefs = useRef({});
  const audioObjectUrlsRef = useRef(new Set());
  const messagesEndRef = useRef(null);
  const customMessagesEndRef = useRef(null);


  const {
    requestSpeechForMessage: requestSpeechForCustomCoachMessage,
    retrySpeechForMessage: retryCustomCoachAudio,
    playBrowserSpeechForMessage,
    stopBrowserSpeech,
    cleanupCoachSpeech,
    isCoachTtsEligible,
  } = useCustomCoachSpeech({
    selectedLevel,
    activeSpeakingTab,
    idToken,
    audioRepliesEnabled,
    autoPlayRepliesEnabled,
    audioRefs,
    playingMessageId,
    setPlayingMessageId,
    setCustomChatMessages,
  });

  const customSessionLabel = `${String(Math.floor(customSessionSecondsLeft / 60)).padStart(2, "0")}:${String(customSessionSecondsLeft % 60).padStart(2, "0")}`;
  const isCustomSessionEnded = customSessionState === "ended";
  const recordingMaxSeconds = maxSpeakingRecordingSeconds({ level: selectedLevel, context: activeSpeakingTab === "custom" ? "presentation" : "exam" });

  const visibleSpeakingTabs = useMemo(
    () => getVisibleSpeakingTabs({ isCourseMode, examOnly }),
    [examOnly, isCourseMode]
  );

  const logSpeakingChatEvent = (event, metadata = {}) => {
    logStudentActivity({
      event,
      feature: "custom_speaking_chat",
      studentCode,
      userId,
      level: selectedLevel,
      metadata,
    }).catch(() => {});
  };

  const startCustomSession = (source = "manual") => {
    const durationMinutes = normalizeSpeakingChatDurationMinutes(customSessionDurationMinutes);
    const durationSeconds = speakingChatSessionSeconds(durationMinutes);
    setCustomSessionDurationMinutes(durationMinutes);
    setCustomSessionState("running");
    setCustomSessionSecondsLeft(durationSeconds);
    setCustomChatError("");
    customSessionTimeoutLoggedRef.current = false;
    logSpeakingChatEvent("chat_session_start", { source, durationMinutes, durationSeconds });
  };

  const endCustomSession = (source = "manual") => {
    setCustomSessionState("ended");
    appendCustomCoachText(`Session complete 🎉\nYour ${customSessionDurationMinutes}-minute practice session is closed.\nStart a new session when you are ready.`);
    logSpeakingChatEvent("chat_session_end", { source, secondsLeft: customSessionSecondsLeft });
  };

  const insertCharacterAtCursor = (setter, inputRef, character, inputName) => {
    const input = inputRef.current;
    setter((current) => {
      const start = typeof input?.selectionStart === "number" ? input.selectionStart : current.length;
      const end = typeof input?.selectionEnd === "number" ? input.selectionEnd : current.length;
      window.setTimeout(() => {
        if (!input) return;
        try {
          input.focus({ preventScroll: true });
          const position = start + character.length;
          input.setSelectionRange(position, position);
        } catch (error) {
          input.focus();
        }
      }, 0);
      return `${current.slice(0, start)}${character}${current.slice(end)}`;
    });
    logSpeakingChatEvent("umlaut_insert", { character, input: inputName });
  };

  useEffect(() => {
    if (!visibleSpeakingTabs.some((tab) => tab.key === activeSpeakingTab)) {
      setActiveSpeakingTab(visibleSpeakingTabs[0]?.key || "custom");
    }
  }, [activeSpeakingTab, visibleSpeakingTabs]);

  useEffect(() => {
    if (customSessionState !== "running") return undefined;
    const timerId = window.setInterval(() => {
      setCustomSessionSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);
    return () => window.clearInterval(timerId);
  }, [customSessionState]);

  useEffect(() => {
    if (customSessionState !== "running" || customSessionSecondsLeft > 0 || customSessionTimeoutLoggedRef.current) return;
    customSessionTimeoutLoggedRef.current = true;
    setCustomSessionState("ended");
    appendCustomCoachText(
      `Session complete 🎉\nYou practised for ${customSessionDurationMinutes} minutes.\nStart a new session when you are ready.\n\nQuick summary:\n• 2 mistakes to fix: choose your top grammar pattern and pronunciation habit from today.\n• 2 useful phrases: reuse one connector and one topic phrase from the chat.\n• Next speaking task: give a 45-second opinion and one reason.`
    );
    logSpeakingChatEvent("chat_session_timeout", {
      durationMinutes: customSessionDurationMinutes,
      durationSeconds: speakingChatSessionSeconds(customSessionDurationMinutes),
    });
  }, [customSessionDurationMinutes, customSessionSecondsLeft, customSessionState]);

  useEffect(() => {
    if (normalizedLockedLevel) {
      setSelectedLevel(normalizedLockedLevel);
    } else if (isExamMode && examLevel) {
      setSelectedLevel(String(examLevel).toUpperCase());
    }
    if (normalizedLockedTeil) {
      setSelectedTeil(normalizedLockedTeil);
    }
  }, [examLevel, isExamMode, normalizedLockedLevel, normalizedLockedTeil]);

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

  useEffect(()=>{
    // C1/C2 and B2 have exactly two Goethe speaking parts, not a third.
    if (["B2","C1","C2"].includes(selectedLevel) && selectedTeil === "3" && !normalizedLockedTeil && !liveExaminerActive) setSelectedTeil("1");
  },[selectedLevel,selectedTeil,normalizedLockedTeil,liveExaminerActive]);

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
      const options = freshTaskOptions(filteredQuestions, examPracticeHistory, selectedLevel);
      return options[Math.floor(Math.random() * options.length)].id;
    });
  }, [filteredQuestions, examPracticeHistory, selectedLevel]);

  const selectedQuestion = useMemo(
    () => filteredQuestions.find((question) => question.id === selectedQuestionId) || null,
    [filteredQuestions, selectedQuestionId]
  );

  const chooseRandomQuestion = () => {
    if (liveExaminerActive || !filteredQuestions.length) return;
    const alternatives = freshTaskOptions(filteredQuestions, examPracticeHistory, selectedLevel).filter(question => question.id !== selectedQuestionId);
    const options = alternatives.length ? alternatives : freshTaskOptions(filteredQuestions, examPracticeHistory, selectedLevel);
    setSelectedQuestionId(options[Math.floor(Math.random() * options.length)].id);
  };

  const examSteps = {
    A1: {
      1: {title:"Sich vorstellen", german:"Guten Tag. Stellen Sie sich bitte vor.", english:"Introduce yourself: name, age, country, home, languages, work and hobbies.", steps:["Introduce yourself","Spell your surname","Say a number","Answer one personal follow-up"]},
      2: {title:"Fragen stellen und antworten", german:"Stellen Sie eine Frage zu Ihrer Wortkarte.", english:"One theme and word card at a time. Ask a question, listen to your partner and answer their question.", steps:["Ask about the current keyword","Answer the partner","Continue with the next keyword if shown"]},
      3: {title:"Bitten formulieren und reagieren", german:"Formulieren Sie eine Bitte zu Ihrer Karte.", english:"Make a polite request and respond to your partner. Repeat with a second card.", steps:["Request using card 1","React to a request","Request using card 2","React to a request"]},
    },
    A2: {
      1: {title:"Fragen zur Person", german:"Stellen Sie Fragen zu den Wortkarten.", english:"Ask and answer personal questions using the cards.", steps:["Ask and answer across four word cards"]},
      2: {title:"Von sich erzählen", german:"Erzählen Sie bitte über das Thema auf Ihrer Karte. Ich höre zu.", english:"Speak about the assigned topic without interruption, then answer a relevant follow-up.", steps:["Talk about the four points","Answer the examiner's follow-up"]},
      3: {title:"Einen Termin finden", german:"Finden Sie gemeinsam einen Termin.", english:"Discuss the schedules with your AI partner and agree on one possible time.", steps:["Suggest times","Negotiate","Agree on a meeting"]},
    },
    B2: {
      1: {title:"Vortrag halten",german:"Halten Sie einen strukturierten Vortrag und beantworten Sie anschließend eine Frage.",english:"Present alternatives, weigh advantages and disadvantages and explain one option in detail.",steps:["Prepare brief notes","Present for about four minutes","Answer the follow-up"]},
      2: {title:"Diskussion führen",german:"Tauschen Sie Standpunkte und Argumente aus.",english:"Discuss the question with your partner and summarize your position.",steps:["State your position","Respond to counterarguments","Summarize"]},
    },
    B1: {
      1: {title:"Gemeinsam etwas planen", german:"Planen Sie bitte gemeinsam mit Ihrem Partner.", english:"Negotiate a realistic plan with the AI partner.", steps:["Make suggestions","Agree on time, place, travel and responsibilities"]},
      2: {title:"Ein Thema präsentieren", german:"Präsentieren Sie bitte das Thema.", english:"Prepare your notes, then speak without interruption. Questions belong to Teil 3.", steps:["Prepare","Present your topic","Finish your presentation"]},
      3: {title:"Über Präsentationen sprechen", german:"Stellen Sie Fragen zur Präsentation.", english:"Respond to the examiner and your partner's presentation.", steps:["Answer a question","React to the partner's presentation"]},
    },
  };
  examSteps.C1 = {
    1:{title:"Vortrag und Rückfragen",german:"Halten Sie einen strukturierten Vortrag. Beantworten Sie anschließend eine relevante Rückfrage.",english:"Present a complex topic, weigh arguments and respond to one grounded question.",steps:["Prepare a clear argument","Present without interruption","Answer a targeted follow-up"]},
    2:{title:"Kontroverse Diskussion",german:"Diskutieren Sie die Streitfrage differenziert mit Ihrem Gesprächspartner.",english:"Defend a position, respond to counterarguments and conclude.",steps:["State and justify your position","Discuss counterarguments","Form a nuanced conclusion"]}
  };
  examSteps.C2 = {
    1:{title:"Komplexer Vortrag",german:"Halten Sie einen differenzierten Vortrag und erläutern Sie Ihre Argumente auf Nachfrage.",english:"Present a sophisticated argument and respond precisely to two follow-up questions.",steps:["Build a coherent advanced argument","Present without interruption","Defend your reasoning in follow-ups"]},
    2:{title:"Pro-und-Kontra-Gespräch",german:"Führen Sie ein anspruchsvolles Pro-und-Kontra-Gespräch.",english:"Respond to objections with precise, nuanced and persuasive reasoning.",steps:["Take a clear position","Analyse objections","Persuade and synthesize"]}
  };
  const examGuide = examSteps[selectedLevel]?.[selectedTeil] || {
    title:"Speaking practice", german:"Bitte sprechen Sie über das Thema.", english:"Listen to the examiner, then give your answer in German.", steps:["Listen","Speak","Review feedback"]
  };

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
      setExamPracticeHistory(saved?.examPracticeHistory || {});
      const shouldUseSavedLevel = !normalizedLockedLevel && !(isExamMode && examLevel);
      if (saved?.selectedLevel && shouldUseSavedLevel) {
        setSelectedLevel(String(saved.selectedLevel).toUpperCase());
      }
      if (saved?.selectedTeil && !normalizedLockedTeil) setSelectedTeil(saved.selectedTeil === "all" ? "1" : saved.selectedTeil);
      setProgressLoaded(true);
    };

    loadProgress();

    return () => {
      cancelled = true;
    };
  }, [examLevel, isExamMode, mode, normalizedLockedLevel, normalizedLockedTeil, studentCode, userId]);

  useEffect(() => {
    if (!progressLoaded || (!userId && !studentCode)) return;

    saveSpeakingProgress({
      userId,
      studentCode,
      mode,
      data: {
        completedQuestionIds,
        examPracticeHistory,
        selectedLevel,
        selectedTeil,
        selectedQuestionId: selectedQuestionId || null,
      },
    });
  }, [completedQuestionIds, examPracticeHistory, mode, progressLoaded, selectedLevel, selectedQuestionId, selectedTeil, studentCode, userId]);

  const chatMessageCount = chatMessages.length;
  const customChatMessageCount = customChatMessages.length;

  useEffect(() => {
    if (activeSpeakingTab !== "exam") return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeSpeakingTab, chatMessageCount, chatLoading]);

  useEffect(() => {
    if (activeSpeakingTab !== "custom") return;
    customMessagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeSpeakingTab, customChatMessageCount, customChatLoading]);

  useEffect(() => {
    const audioElements = audioRefs.current;
    const objectUrls = audioObjectUrlsRef.current;

    return () => {
      if (recordingIntervalRef.current) window.clearInterval(recordingIntervalRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      Object.values(audioElements).forEach((audio) => {
        if (audio) audio.pause();
      });
      objectUrls.forEach((url) => revokeObjectUrl(url));
      objectUrls.clear();
    };
  }, []);

  const beginSpeakingPractice = (wholeExam = false) => {
    setFullExam(wholeExam);
    setRunResults([]);
    setPracticeAttempt(value=>value+1);
    if (wholeExam) {
      setSelectedTeil("1");
      const firstTasks = speakingQuestionDictionary.filter(question=>question.level===selectedLevel && parseTeilNumber(question.teilLabel || question.teilId)==="1");
      const options = freshTaskOptions(firstTasks,examPracticeHistory,selectedLevel);
      setSelectedQuestionId(options.length ? options[Math.floor(Math.random()*options.length)].id : "");
      setTaskMode("random");
    }
    setPracticeStage("practice");
  };

  const handleSpeakingSessionReset = () => {
    setLiveExaminerActive(false);
    setFullExam(false);
    setRunResults([]);
    setPracticeStage("home");
  };

  const handleExamPartCompleted = (result) => {
    const {taskId,level,teil,topic,keyword,feedback,assessment=null,words=[]} = result;
    if (!taskId || !feedback) return;
    if (progressLoaded) {
      setExamPracticeHistory(previous=>recordExamPractice(previous,{taskId,level,teil,topic,keyword,feedback,assessment,words}));
      setCompletedQuestionIds(previous=>({...previous,[taskId]:true}));
    }
    if (fullExam) {
      setRunResults(previous=>[...previous.filter(item=>item.teil!==teil),result]);
      const next = nextExamTeil(level,teil);
      setLiveExaminerActive(false);
      if (next) {
        setSelectedQuestionId("");
        setSelectedTeil(next);
      } else {
        setPracticeStage("results");
        setFullExam(false);
      }
    } else {
      setRunResults([result]);
      setLiveExaminerActive(false);
      setPracticeStage("results");
    }
  };

  const continueExamToNextTeil = () => {
    const next=nextExamTeil(selectedLevel,selectedTeil);
    if (!next || normalizedLockedTeil) return;
    setSelectedQuestionId("");
    setSelectedTeil(next);
    setTaskMode("random");
    setShowLiveExaminer(false);
  };

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
        taskId: selectedQuestion.id,
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

  const appendCustomCoachText = (text, { withAudio = false } = {}) => {
    const id = `custom-coach-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setCustomChatMessages((current) => [
      ...current,
      {
        id,
        role: "coach",
        type: "text",
        text,
        audioUrl: null,
        audioLoading: Boolean(withAudio && audioRepliesEnabled && isCoachTtsEligible()),
        audioError: false,
        createdAt: new Date().toISOString(),
      },
    ]);
    return id;
  };

  const requestCustomChatReply = async (messageText, historyMessages = customChatMessages) => {
    const history = historyMessages
      .map((message) => ({
        role: message.role === "student" ? "user" : "assistant",
        content: message.type === "audio" ? message.transcript : message.text,
      }))
      .filter((message) => String(message.content || "").trim());

    const response = await requestCustomSpeakingChatReply({
      message: messageText,
      level: selectedLevel,
      history,
      idToken,
      mode: "Speaking",
      lessonContext: { lessonTitle: isCourseMode ? "Course Book custom speaking chat" : "Free custom speaking practice" },
      sessionContext: {
        state: customSessionState === "running" ? "running" : customSessionState === "ended" ? "ended" : "starting",
        durationMinutes: customSessionDurationMinutes,
        minutesLeft: customSessionSecondsLeft / 60,
      },
    });
    return String(response?.reply || "").trim() || "Ich konnte gerade nicht antworten. Bitte versuche es noch einmal.";
  };

  const notifyCustomChatSuccess = () => {
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
  };

  const notifyCustomChatError = () => {
    triggerInteractionFeedback({
      sound: "error",
      toastMessage: "Custom Sprechen chat is unavailable right now.",
      toastVariant: "error",
      showToast,
      vibratePattern: [120],
    });
  };

  const sendCustomChatMessage = async () => {
    const trimmed = customDraftMessage.trim();
    if (!trimmed || customChatLoading || isCustomSessionEnded) return;
    if (customSessionState !== "running") startCustomSession("first_message");

    const studentMessage = {
      id: `custom-student-${Date.now()}`,
      role: "student",
      type: "text",
      text: trimmed,
      createdAt: new Date().toISOString(),
    };

    setCustomChatMessages((current) => [...current, studentMessage]);
    setCustomDraftMessage("");
    setCustomChatLoading(true);
    setCustomChatError("");

    try {
      const replyText = await requestCustomChatReply(trimmed);
      const coachMessageId = appendCustomCoachText(replyText, { withAudio: true });
      setCustomChatLoading(false);
      requestSpeechForCustomCoachMessage(coachMessageId, replyText);
      notifyCustomChatSuccess();
    } catch (error) {
      setCustomChatError(error?.message || "Could not reach the custom Sprechen chat.");
      appendCustomCoachText("Der freie Sprechen-Chat ist gerade nicht verfügbar. Bitte versuche es gleich noch einmal.");
      notifyCustomChatError();
    } finally {
      setCustomChatLoading(false);
    }
  };

  const startRecording = async (targetMode = activeSpeakingTab) => {
    if (isRecording || (targetMode === "exam" && !selectedQuestion) || (targetMode === "custom" && isCustomSessionEnded)) return;
    if (targetMode === "custom" && customSessionState !== "running") startCustomSession("first_voice_message");
    setRecordingError("");
    const recordingTargetMode = targetMode === "custom" ? "custom" : "exam";

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: audioCaptureConstraints,
      });
      streamRef.current = stream;
      const recorder = createSpeakingMediaRecorder(stream);
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

        let blob;
        try {
          blob = buildRecordedAudioBlob(audioChunksRef.current, recorder);
        } catch (error) {
          setRecordingError(userFacingAudioError(error));
          setRecordingSeconds(0);
          recordingSecondsRef.current = 0;
          setIsRecording(false);
          setRecordingMode("");
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }
          return;
        }
        const url = URL.createObjectURL(blob);
        audioObjectUrlsRef.current.add(url);
        const duration = elapsedRecordingSeconds;

        const voiceMessage = {
          id: `voice-${Date.now()}`,
          role: "student",
          type: "audio",
          audioUrl: url,
          duration,
          createdAt: new Date().toISOString(),
        };

        if (recordingTargetMode === "custom") {
          setCustomChatMessages((current) => [...current, voiceMessage]);
          setRecordingSeconds(0);
          recordingSecondsRef.current = 0;
          setIsRecording(false);
          setRecordingMode("");
          setCustomChatLoading(true);
          setCustomChatError("");

          try {
            const response = await analyzeAudio({
              audioBlob: blob,
              teil: "Custom chat",
              level: selectedLevel,
              question: "Free custom speaking conversation",
              userId,
              idToken,
              durationSeconds: duration,
            });

            const transcript = String(response?.transcript || "").trim();
            if (!transcript) {
              appendCustomCoachText("I could not hear a clear sentence. Please try recording again or type your message.");
              return;
            }

            setCustomChatMessages((current) => current.map((message) => (
              message.id === voiceMessage.id ? { ...message, transcript } : message
            )));
            appendCustomCoachText(`Transcript I heard: ${transcript}`);
            const replyText = await requestCustomChatReply(transcript);
            const coachMessageId = appendCustomCoachText(replyText, { withAudio: true });
            setCustomChatLoading(false);
            requestSpeechForCustomCoachMessage(coachMessageId, replyText);
            notifyCustomChatSuccess();
          } catch (error) {
            const message = userFacingAudioError(error, "Could not reach the custom Sprechen chat.");
            setCustomChatError(message);
            appendCustomCoachText(message);
            notifyCustomChatError();
          } finally {
            setCustomChatLoading(false);
          }
        } else {
          setChatMessages((current) => [...current, voiceMessage]);
          setRecordingSeconds(0);
          recordingSecondsRef.current = 0;
          setIsRecording(false);
          setRecordingMode("");
          markPromptCompleted();
          setChatLoading(true);
          setChatError("");

          try {
            const response = await analyzeAudio({
              audioBlob: blob,
              teil: selectedQuestion.teilLabel || selectedQuestion.teilId || "",
              level: selectedLevel,
              question: selectedQuestion.text || selectedQuestion.topicPrompt || "",
              taskId: selectedQuestion.id,
              userId,
              idToken,
              durationSeconds: duration,
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
            const message = userFacingAudioError(error, "Could not reach the AI coach.");
            setChatError(message);
            appendCoachText(message);
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
        }

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start(1000);
      setRecordingSeconds(0);
      recordingSecondsRef.current = 0;
      setIsRecording(true);
      setRecordingMode(recordingTargetMode);
      recordingIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((value) => {
          const nextValue = value + 1;
          recordingSecondsRef.current = nextValue;
          if (nextValue >= recordingMaxSeconds && recorder.state === "recording") {
            window.setTimeout(() => recorder.stop(), 0);
          }
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

  const toggleAudioPlayback = async (messageId) => {
    const message = [...customChatMessages, ...chatMessages].find((item) => item?.id === messageId);
    setPlaybackError("");

    if (message?.browserSpeech) {
      if (playingMessageId === messageId) {
        stopBrowserSpeech();
        return;
      }
      const started = playBrowserSpeechForMessage(messageId, message.text);
      if (!started) setPlaybackError("This device has no German browser voice available.");
      return;
    }

    const currentAudio = audioRefs.current[messageId];
    if (!currentAudio) return;

    if (playingMessageId && playingMessageId !== messageId) {
      stopBrowserSpeech();
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

    try {
      await playAudioElement(currentAudio);
      setPlayingMessageId(messageId);
    } catch (error) {
      setPlayingMessageId("");
      setPlaybackError(error?.message || "Playback could not start.");
    }
  };

  const releaseMessageAudio = (messages = []) => {
    messages.forEach((message) => {
      if (!message?.audioUrl) return;
      revokeObjectUrl(message.audioUrl);
      audioObjectUrlsRef.current.delete(message.audioUrl);
    });
  };

  const clearConversation = () => {
    setPlaybackError("");
    if (activeSpeakingTab === "custom") {
      releaseMessageAudio(customChatMessages);
      cleanupCoachSpeech(customChatMessages);
      setCustomSessionState("idle");
      setCustomSessionSecondsLeft(speakingChatSessionSeconds(customSessionDurationMinutes));
      customSessionTimeoutLoggedRef.current = false;
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
      setPlayingMessageId("");
      setRecordingMode("");
      return;
    }

    releaseMessageAudio(chatMessages);
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
    setRecordingMode("");
  };

  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem(AUDIO_REPLIES_STORAGE_KEY, String(audioRepliesEnabled));
  }, [audioRepliesEnabled]);

  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem(AUTOPLAY_REPLIES_STORAGE_KEY, String(autoPlayRepliesEnabled));
  }, [autoPlayRepliesEnabled]);

  useEffect(() => {
    if (!isExamMode || typeof document === "undefined") return undefined;
    document.body.classList.add("falowen-exam-speaking-page");
    return () => document.body.classList.remove("falowen-exam-speaking-page");
  }, [isExamMode]);

  const completedCount = useMemo(
    () => Object.values(completedQuestionIds).filter(Boolean).length,
    [completedQuestionIds]
  );

  const totalCount = baseFilteredQuestions.length;

  const examVoicePractice = (
    selectedQuestion ? (
                <LiveSpeakPage key={selectedLevel+"-"+selectedTeil+"-"+selectedQuestion.id+"-"+practiceAttempt} embedded initialLevel={selectedLevel}
                  practiceTopic={selectedQuestion.topicPrompt || selectedQuestion.text || "Goethe speaking practice"}
                  practiceSource="exam-speaking-practice"
                  examTask={{
                    id:selectedQuestion.id,
                    teil:selectedQuestion.teilLabel || selectedQuestion.teilId || "",
                    prompt:selectedQuestion.topicPrompt || selectedQuestion.text || "",
                    keywords:selectedQuestion.keywordSubtopic || "",
                    hint:selectedQuestion.hint || "",
                  }}
                  examMode="guided" autoStart={isExamMode && practiceAttempt>0} freshAttempt={practiceAttempt > 0} deferFeedback={fullExam} onActivityChange={setLiveExaminerActive}
                  onSessionReset={handleSpeakingSessionReset}
                   onExamCompleted={handleExamPartCompleted}
                  onContinueToNext={!fullExam && nextExamTeil(selectedLevel,selectedTeil) && !normalizedLockedTeil ? continueExamToNextTeil : undefined}/>
              ) : <p role="status">Choose an exam part to begin.</p>
  );

  return (
    <div className={isExamMode ? ["speaking-exam-page",liveExaminerActive ? "speaking-exam-page--live" : "",practiceStage === "practice" ? "speaking-exam-page--practice" : ""].filter(Boolean).join(" ") : undefined} style={{ ...styles.container, padding: isCompactViewport ? "10px 0 28px" : styles.container.padding }}>
      <div
        style={{
          ...styles.card,
          padding: 0,
          overflow: "hidden",
          borderRadius: isCompactViewport ? 0 : styles.card.borderRadius,
        }}
      >
        <div className={isExamMode ? "speaking-exam-hero" : undefined}
          style={{
            background: "linear-gradient(120deg, #4f46e5, #8b5cf6, #a21caf)",
            color: "#ffffff",
            padding: isExamMode && isCompactViewport ? "14px 16px" : "18px 20px",
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div>
            <p style={{ margin: 0, opacity: 0.85, fontSize: 13 }}>{isExamMode ? "Falowen · Exam Room" : "Online • Ready to practice"}</p>
            <h1 style={{ margin: "4px 0 0", fontSize: isExamMode && isCompactViewport ? 22 : 28 }}>{isExamMode ? "Goethe Speaking Exam" : "Goethe Speaking Exam Coach"}</h1>
            <p style={{ margin: "6px 0 0", opacity: 0.9, fontSize: 13 }}>
              {contextLabel || `Speaking Exams${selectedLevel ? ` • Level ${selectedLevel}` : ""}${normalizedLockedTeil ? ` • Teil ${normalizedLockedTeil}` : ""}`}
            </p>
          </div>
          {!isExamMode ? <button type="button" style={{ ...styles.secondaryButton, background: "rgba(255,255,255,0.95)" }} onClick={clearConversation}>
            Clear conversation
          </button> : null}
        </div>

        {!isExamMode ? (
        <div style={{ display: "flex", gap: 8, padding: "12px 16px", background: "#F8FAFC", borderBottom: "1px solid #E5E7EB", flexWrap: "wrap", alignItems: "center" }}>
          {visibleSpeakingTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              style={{
                ...(activeSpeakingTab === tab.key ? styles.navButtonActive : styles.navButton),
                borderRadius: 999,
                padding: "8px 14px",
              }}
              onClick={() => {
                setActiveSpeakingTab(tab.key);
                logSpeakingChatEvent("chat_mode_change", { mode: tab.key, modeLabel: tab.label });
              }}
            >
              {tab.label}
            </button>
          ))}
          {isCourseMode ? (
            <a href="/exams/speaking" style={{ ...styles.secondaryButton, textDecoration: "none", borderRadius: 999, padding: "8px 14px" }}>
              Full speaking exam room
            </a>
          ) : null}
        </div>
        ) : null}

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

              <div style={{ ...styles.card, margin: 0, padding: 10, display: "grid", gap: 8 }}>
                <label style={{ ...styles.label, margin: 0 }}>Audio replies</label>
                <button type="button" style={styles.secondaryButton} onClick={() => setAudioRepliesEnabled((value) => !value)}>
                  Audio replies: {audioRepliesEnabled ? "On" : "Off"}
                </button>
                <button type="button" style={styles.secondaryButton} onClick={() => setAutoPlayRepliesEnabled((value) => !value)} disabled={!audioRepliesEnabled}>
                  Auto-play replies: {autoPlayRepliesEnabled ? "On" : "Off"}
                </button>
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
                                  background: isStudent ? "rgba(255,255,255,0.25)" : "#D1FAE5",
                                  color: isStudent ? "#fff" : "#047857",
                                }}
                                onClick={() => toggleAudioPlayback(message.id)}
                              >
                                {playingMessageId === message.id ? "⏸" : "▶"}
                              </button>
                              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                                {waveHeights.map((height, index) => (
                                  <span
                                    key={`${message.id}-custom-wave-${index}`}
                                    style={{
                                      display: "inline-block",
                                      width: 3,
                                      height,
                                      borderRadius: 999,
                                      background: isStudent ? "rgba(255,255,255,0.55)" : "#86EFAC",
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
                                  node.onerror = () => { setPlayingMessageId(""); setPlaybackError("This device cannot play the recording format. Please record again."); };
                                }
                              }}
                              src={message.audioUrl}
                            />
                          </div>
                        ) : (
                          <div style={{ display: "grid", gap: 8 }}>
                            <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{message.text}</p>
                            {!isStudent && audioRepliesEnabled && COACH_TTS_LEVELS.has(String(selectedLevel || "").toUpperCase()) ? (
                              message.audioLoading ? (
                                <span style={{ fontSize: 12, color: "#64748B" }}>🔊 Preparing audio…</span>
                              ) : message.audioUrl || message.browserSpeech ? (
                                <div style={{ display: "grid", gap: 6, justifyItems: "start" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <button
                                      type="button"
                                      aria-label={playingMessageId === message.id ? "Pause German reply" : "Play German reply"}
                                      style={{ ...styles.secondaryButton, padding: "6px 10px" }}
                                      onClick={() => toggleAudioPlayback(message.id)}
                                    >
                                      {playingMessageId === message.id ? "⏸" : "▶"} Listen
                                    </button>
                                    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                                      {waveHeights.slice(0, 10).map((height, index) => (
                                        <span key={`${message.id}-reply-wave-${index}`} style={{ display: "inline-block", width: 3, height: Math.max(6, height - 6), borderRadius: 999, background: "#86EFAC" }} />
                                      ))}
                                    </div>
                                    {message.audioUrl ? (
                                      <audio ref={(node) => { if (node) { audioRefs.current[message.id] = node; node.onended = () => setPlayingMessageId("");
                                      node.onerror = () => { setPlayingMessageId(""); setPlaybackError("This device cannot play the recording format. Please record again."); }; } }} src={message.audioUrl} />
                                    ) : null}
                                  </div>
                                  {message.browserSpeech && message.audioErrorMessage ? (
                                    <span role="status" style={{ fontSize: 12, color: "#475569", lineHeight: 1.45 }}>
                                      {message.audioErrorMessage}
                                    </span>
                                  ) : null}
                                </div>
                              ) : message.audioError ? (
                                <div style={{ display: "grid", gap: 6, justifyItems: "start" }}>
                                  <span role="status" style={{ fontSize: 12, color: "#92400E", lineHeight: 1.45 }}>
                                    {message.audioErrorMessage || "The German audio reply could not be prepared."}
                                  </span>
                                  {message.audioRetryable !== false ? (
                                    <button type="button" aria-label="Retry German audio" style={{ ...styles.secondaryButton, padding: "6px 10px", justifySelf: "start" }} onClick={() => retryCustomCoachAudio(message)}>
                                      Retry audio
                                    </button>
                                  ) : null}
                                </div>
                              ) : null
                            ) : null}
                          </div>
                        )}
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
                <div style={{ ...styles.card, margin: 0, padding: 10, background: "#ECFDF5", border: "1px solid #A7F3D0", display: "grid", gap: 8 }}>
                  <div>
                    <strong style={{ fontSize: 13 }}>Choose your chat time</strong>
                    <p style={{ margin: "3px 0 0", fontSize: 12, color: "#047857" }}>Paste your speaking question or topic, choose 10, 20, or 30 minutes, then start chatting.</p>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }} aria-label="Speaking chat duration">
                    {CUSTOM_SPEAKING_CHAT_DURATION_OPTIONS.map((minutes) => {
                      const selected = customSessionDurationMinutes === minutes;
                      return (
                        <button
                          key={minutes}
                          type="button"
                          style={{ ...(selected ? styles.primaryButton : styles.secondaryButton), borderRadius: 999, padding: "6px 12px", fontSize: 12, background: selected ? "#059669" : undefined }}
                          onClick={() => {
                            if (customSessionState === "running") return;
                            setCustomSessionDurationMinutes(minutes);
                            setCustomSessionSecondsLeft(speakingChatSessionSeconds(minutes));
                          }}
                          disabled={customSessionState === "running"}
                        >
                          {minutes} minutes
                        </button>
                      );
                    })}
                  </div>
                  {customSessionState === "running" ? <span style={{ fontSize: 11, color: "#047857" }}>The time is locked until this session ends.</span> : null}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }} aria-live="polite">
                  {customSessionState === "running" ? (
                    <button type="button" style={{ ...styles.secondaryButton, borderRadius: 999, padding: "5px 10px", fontSize: 12 }} onClick={() => endCustomSession("manual")}>End</button>
                  ) : (
                    <button type="button" style={{ ...styles.secondaryButton, borderRadius: 999, padding: "5px 10px", fontSize: 12 }} onClick={() => startCustomSession(customSessionState === "ended" ? "new_session" : "manual")}>{customSessionState === "ended" ? `Start new ${customSessionDurationMinutes}-minute session` : `Start ${customSessionDurationMinutes}-minute session`}</button>
                  )}
                  <span style={{ fontSize: 12, fontWeight: 800, color: "#047857" }}>Session: {customSessionLabel}</span>
                </div>
                {customSessionState === "ended" ? <p style={{ margin: 0, fontSize: 12, color: "#047857" }}>Session complete 🎉 Choose a duration and start a new session when you are ready.</p> : null}
                <p style={{ margin: 0, fontSize: 12, color: "#047857" }}>
                  Free chat mode: write in German when you can. You may use English if you are stuck.
                </p>
                {customChatError ? <p style={{ margin: 0, color: "#B91C1C", fontSize: 12 }}>{customChatError}</p> : null}
                {playbackError ? <p style={{ margin: 0, color: "#B91C1C", fontSize: 12 }}>{playbackError}</p> : null}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    style={{ ...styles.primaryButton, width: "fit-content", background: "#059669" }}
                    onClick={isRecording && recordingMode === "custom" ? stopRecording : () => startRecording("custom")}
                    disabled={customChatLoading || isCustomSessionEnded || (isRecording && recordingMode !== "custom")}
                  >
                    {isRecording && recordingMode === "custom" ? `Stop & Send (${formatTime(recordingSeconds)})` : "🎙️ Record voice"}
                  </button>
                  {recordingError ? <p style={{ ...styles.helperText, margin: 0, color: "#B91C1C" }}>{recordingError}</p> : null}
            {playbackError ? <p style={{ ...styles.helperText, margin: 0, color: "#B91C1C" }}>{playbackError}</p> : null}
                </div>
                <div style={{ display: "flex", gap: 8, flexDirection: isCompactViewport ? "column" : "row" }}>
                  <textarea
                    ref={customDraftRef}
                    style={{ ...styles.input, minHeight: 56, maxHeight: 120, resize: "vertical" }}
                    placeholder="Paste your speaking question or start a German conversation..."
                    value={customDraftMessage}
                    onChange={(event) => setCustomDraftMessage(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        sendCustomChatMessage();
                      }
                    }}
                    disabled={customChatLoading || isCustomSessionEnded}
                  />
                  <button
                    style={{ ...styles.primaryButton, borderRadius: 12, minWidth: isCompactViewport ? "100%" : 88, background: "#059669" }}
                    onClick={sendCustomChatMessage}
                    disabled={customChatLoading || isCustomSessionEnded}
                  >
                    Send
                  </button>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", fontSize: 12, color: "#047857", fontWeight: 800 }} aria-label="German keys">
                  <span>German keys:</span>
                  {GERMAN_KEYS.map((character) => (
                    <button key={character} type="button" style={{ border: "1px solid #A7F3D0", background: "#ECFDF5", borderRadius: 999, minWidth: 28, minHeight: 28, fontWeight: 800, cursor: "pointer" }} onClick={() => insertCharacterAtCursor(setCustomDraftMessage, customDraftRef, character, "custom_speaking_chat")} disabled={customChatLoading || isCustomSessionEnded}>{character}</button>
                  ))}
                </div>
              </div>
            </section>
          </div>
        ) : null}


        {isExamMode && activeSpeakingTab === "exam" && practiceStage === "home" ? (
          <SpeakingPracticeHome level={selectedLevel} teil={selectedTeil} guides={examSteps[selectedLevel]}
            lockedTeil={normalizedLockedTeil} history={examPracticeHistory} ready={progressLoaded}
            onSelectPart={part=>setSelectedTeil(part)}
            onStart={beginSpeakingPractice}/>
        ) : null}
        {isExamMode && practiceStage === "results" ? (
          <SpeakingRunResults level={selectedLevel} results={runResults} onReturn={()=>setPracticeStage("home")} onRepeat={()=>beginSpeakingPractice(runResults.length>1)}/>
        ) : null}
        {isExamMode && practiceStage === "practice" ? <SpeakingExaminationScreen
          level={selectedLevel} teil={selectedTeil} parts={Object.keys(examSteps[selectedLevel] || {})}
          fullExam={fullExam} completed={runResults.length} guide={examGuide} busy={liveExaminerActive}
          onBack={()=>{setPracticeStage("home");setFullExam(false);}}>
          {examVoicePractice}
        </SpeakingExaminationScreen> : null}
        {!isCourseMode && !isExamMode && activeSpeakingTab === "exam" ? (
          <div className={liveExaminerActive ? "speaking-exam-grid is-live" : "speaking-exam-grid"} style={{display:"grid",gridTemplateColumns:isCompactViewport?"minmax(0,1fr)":"minmax(260px,320px) minmax(0,1fr)",gap:0,minWidth:0}}>
            <aside className="speaking-exam-sidebar" style={{padding:isCompactViewport?12:16,background:"#f8fafc",borderRight:isCompactViewport?"none":"1px solid #e2e8f0",borderBottom:isCompactViewport?"1px solid #e2e8f0":"none",display:"grid",alignContent:"start",gap:12,minWidth:0}}>
              <div className="speaking-exam-part-picker" style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                <strong style={{fontSize:13,color:"#1e40af"}}>Level {selectedLevel}</strong>
                <span style={{fontSize:12,color:"#64748b"}}>Exam part</span>
                {normalizedLockedTeil ? <strong>Teil {normalizedLockedTeil}</strong> : (
                  <select aria-label="Choose speaking exam part" style={{...styles.select,maxWidth:150,minHeight:42}} disabled={liveExaminerActive || fullExam} value={selectedTeil} onChange={event=>setSelectedTeil(event.target.value)}>
                    <option value="1">Teil 1</option><option value="2">Teil 2</option>{!["B2","C1","C2"].includes(selectedLevel) ? <option value="3">Teil 3</option> : null}
                  </select>
                )}
              </div>
              {selectedTeil !== "1" ? (
                <div className="speaking-exam-task-picker" role="group" aria-label="Task selection" style={{display:"grid",gap:8}}>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    <button type="button" onClick={()=>setTaskMode("random")} disabled={liveExaminerActive || fullExam}
                      aria-pressed={taskMode==="random"} style={{...styles.secondaryButton,background:taskMode==="random"?"#dbeafe":"#fff",borderColor:taskMode==="random"?"#3b82f6":"#cbd5e1",padding:"8px 10px"}}>
                      Random task
                    </button>
                    <button type="button" onClick={()=>setTaskMode("choose")} disabled={liveExaminerActive || fullExam}
                      aria-pressed={taskMode==="choose"} style={{...styles.secondaryButton,background:taskMode==="choose"?"#dbeafe":"#fff",borderColor:taskMode==="choose"?"#3b82f6":"#cbd5e1",padding:"8px 10px"}}>
                      Choose topic
                    </button>
                  </div>
                  {taskMode==="choose" ? (
                    <label style={{display:"grid",gap:5,fontSize:13}}>
                      Topic or task card
                      <select aria-label="Choose speaking task" style={styles.select} disabled={liveExaminerActive || fullExam} value={selectedQuestionId} onChange={event=>setSelectedQuestionId(event.target.value)}>
                        {filteredQuestions.map(question=><option key={question.id} value={question.id}>{isPractised(examPracticeHistory,selectedLevel,question.id) ? "✓ Practised · " : ""}{formatQuestionDisplay(question)}</option>)}
                      </select>
                    </label>
                  ) : (
                    <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                      <small style={{flex:1,minWidth:110,color:"#475569"}}>{filteredQuestions.some(question=>!isPractised(examPracticeHistory,selectedLevel,question.id)) ? "New, unpractised cards are assigned first." : "All available cards tried. You can repeat for revision."}</small>
                      <button type="button" style={{...styles.secondaryButton,padding:"8px 10px"}} disabled={liveExaminerActive || !selectedQuestion} onClick={chooseRandomQuestion}>
                        Another random task
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
              {isExamMode && <div className="speaking-exam-progress" aria-label="Goethe speaking exam progress" style={{display:"grid",gap:7,padding:"9px 10px",border:"1px solid #e2e8f0",borderRadius:11,background:"#fff"}}>
                <strong style={{fontSize:13}}>Goethe {selectedLevel} · Teil {selectedTeil} of {["B2","C1","C2"].includes(selectedLevel) ? 2 : 3}</strong>
                <div style={{display:"flex",gap:5}} aria-hidden="true">{(["B2","C1","C2"].includes(selectedLevel) ? ["1","2"] : ["1","2","3"]).map(part=><span key={part} style={{height:6,borderRadius:6,flex:1,background:part===selectedTeil?"#2563eb":Object.values(examPracticeHistory).some(item=>item.level===selectedLevel && item.teil==="Teil "+part)?"#16a34a":"#e2e8f0"}} />)}</div>
                <small style={{color:"#475569"}}>{filteredQuestions.filter(q=>isPractised(examPracticeHistory,selectedLevel,q.id)).length} of {filteredQuestions.length} tasks practised in this Teil</small>
                {Object.values(examPracticeHistory).some(item=>item.level===selectedLevel) ? <details>
                  <summary style={{fontSize:12,cursor:"pointer",minHeight:36}}>Review completed tasks and feedback</summary>
                  <div style={{display:"grid",gap:8,marginTop:8,maxHeight:210,overflowY:"auto"}}>
                    {Object.values(examPracticeHistory).filter(item=>item.level===selectedLevel).sort((a,b)=>String(b.completedAt).localeCompare(String(a.completedAt))).map(item=><details key={item.taskId} style={{border:"1px solid #e2e8f0",borderRadius:8,padding:8}}>
                      <summary style={{fontSize:12,cursor:"pointer"}}>{item.teil} · {item.topic || item.taskId} {item.keyword ? "("+item.keyword+")" : ""} · {new Date(item.completedAt).toLocaleDateString()}{Number.isFinite(item.scorePercent) ? " · "+item.scorePercent+"%" : ""}</summary>
                      <p style={{whiteSpace:"pre-wrap",fontSize:12,lineHeight:1.5}}>{item.feedback}</p>
                    </details>)}
                  </div>
                </details> : null}
              </div>}
              <details className="speaking-exam-guide" aria-label="Speaking exam instructions" open={!isCompactViewport && !liveExaminerActive} style={{background:"#fff",border:"1px solid #dbeafe",borderRadius:12,padding:12,display:"grid",gap:7}}>
                <summary style={{color:"#1e3a8a",fontWeight:800,cursor:"pointer",minHeight:36,display:"flex",alignItems:"center"}}>Teil {selectedTeil} · {examGuide.title} {liveExaminerActive && isCompactViewport ? " · Instructions" : ""}</summary>
                <p lang="de" style={{margin:0,fontSize:14,lineHeight:1.55}}>{examGuide.german}</p>
                <p style={{margin:0,fontSize:13,color:"#475569",lineHeight:1.5}}>{examGuide.english}</p>
                <ol style={{margin:"2px 0 0",paddingLeft:20,fontSize:12,color:"#334155",lineHeight:1.6}}>
                  {examGuide.steps.map(step=><li key={step}>{step}</li>)}
                </ol>
              </details>
            </aside>
            <section className="speaking-exam-voice" style={{minWidth:0,padding:isCompactViewport?"10px 12px 18px":16,background:"#fff"}}>
              {examVoicePractice}
            </section>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SpeakingPage;
