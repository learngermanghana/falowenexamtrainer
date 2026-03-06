import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { styles } from "../styles";
import { useExam, ALLOWED_LEVELS } from "../context/ExamContext";
import ResultHistory from "./ResultHistory";
import { fetchIdeasFromCoach, fetchWritingLetters, markLetterWithAI } from "../services/coachService";
import { useAuth } from "../context/AuthContext";
import { writingLetters as courseWritingLetters } from "../data/writingLetters";
import { WRITING_PROMPTS } from "../data/writingExamPrompts";
import { loadWritingProgress, saveWritingProgress } from "../services/writingProgressService";
import {
  isTutorReviewCloudEnabled,
  loadLatestTutorReviewForStudent,
  saveExamLetterForTutorReview,
  saveStudentReplyToTutorReview,
} from "../services/tutorReviewService";

const DEFAULT_EXAM_TIMINGS = {
  A1: 15,
  A2: 20,
  B1: 20,
  B2: 20,
  C1: 40,
};

const IDEA_COACH_INTRO = {
  id: "intro",
  role: "assistant",
  content:
    "This is a chat between you and the ideas generator. Paste your exam question or draft idea, and I'll guide you step by step with Herr Felix's coaching prompts.",
};

const WORD_TARGETS = {
  A1: "30–50 words",
  A2: "50–80 words",
  B1: "80–120 words",
  B2: "120–180 words",
  C1: "180–220 words",
};

const WORD_TARGET_RANGES = {
  A1: { min: 30, max: 50 },
  A2: { min: 50, max: 80 },
  B1: { min: 80, max: 120 },
  B2: { min: 120, max: 180 },
  C1: { min: 180, max: 220 },
};

const IDEAS_COACHING_PROMPTS = [
  "Start with the task and ask: What is unclear to me?",
  "Request a short explanation and one example sentence.",
  "End by summarizing the idea in your own words.",
];

const RUBRIC_CRITERIA = [
  {
    key: "task",
    label: "Task completion",
    keywords: ["task", "bullet", "question", "answer", "content", "point"],
  },
  {
    key: "coherence",
    label: "Coherence",
    keywords: ["coherence", "structure", "flow", "connector", "paragraph", "order"],
  },
  {
    key: "grammar",
    label: "Grammar & accuracy",
    keywords: ["grammar", "spelling", "case", "verb", "tense", "word order", "article"],
  },
];

const CONNECTORS_BY_LEVEL = {
  A1: ["und", "aber", "dann", "weil"],
  A2: ["zuerst", "außerdem", "deshalb", "trotzdem"],
  B1: ["zum Beispiel", "deswegen", "daher", "jedoch"],
  B2: ["dennoch", "hingegen", "folglich", "darüber hinaus"],
  C1: ["hingegen", "nichtsdestotrotz", "folglich", "dementsprechend"],
};

const A1_FORM_PRACTICE_TASKS = [
  {
    id: "lake-tour-booking",
    title: "Anmeldung für einen Familienausflug",
    context:
      "Deine Freundin Ana reist mit ihrem Mann und zwei Kindern (7 und 10 Jahre). Sie möchte eine Busfahrt am Sonntag rund um ein Seengebiet buchen und kann nur bar bezahlen.",
    prompt:
      "Ergänze die fehlenden Informationen im Anmeldeformular.",
    formFields: [
      { label: "Nachname, Vorname", value: "Neto, Ana (Beispiel)" },
      { label: "Anzahl Personen", value: "(1)" },
      { label: "Kinder", value: "(2)" },
      {
        label: "Urlaubsadresse",
        value: "Hotel Seeblick, Lindenweg 12, 78462 (3)",
      },
      { label: "Zahlungsart", value: "(4) bar / Karte" },
      { label: "Reisedatum", value: "(5)" },
      { label: "Unterschrift", value: "Ana Neto" },
    ],
    answers: [
      { blank: "(1)", answer: "4 / vier", explanation: "Ana, ihr Mann und zwei Kinder sind zusammen vier Personen." },
      { blank: "(2)", answer: "2 / zwei", explanation: "Zwei Reisende sind Kinder." },
      {
        blank: "(3)",
        answer: "Seedorf",
        explanation: "Der Ortsname steht nach der Postleitzahl.",
      },
      {
        blank: "(4)",
        answer: "cash / bar",
        explanation: "Im Text steht, dass sie nicht mit Karte bezahlen kann.",
      },
      {
        blank: "(5)",
        answer: "Sunday / nächsten Sonntag",
        explanation: "Die Busfahrt ist für nächsten Sonntag geplant.",
      },
    ],
  },
  {
    id: "youth-camp-registration",
    title: "Anmeldung für ein Jugendcamp",
    context:
      "Dein Cousin Karim meldet sich für ein deutsches Sommercamp an. Er reist mit seiner Schwester (13) und seinem Bruder (9). Sie wohnen in München und kommen am Montag an.",
    prompt: "Trage die fehlenden Informationen in das Camp-Formular ein.",
    formFields: [
      { label: "Nachname, Vorname", value: "Benali, Karim (Beispiel)" },
      { label: "Teilnehmer insgesamt", value: "(1)" },
      { label: "Kinder unter 14", value: "(2)" },
      { label: "Stadt", value: "(3)" },
      { label: "Zahlung", value: "Überweisung / (4)" },
      { label: "Anreisetag", value: "(5)" },
    ],
    answers: [
      { blank: "(1)", answer: "3 / drei", explanation: "Karim und zwei Geschwister sind drei Teilnehmende." },
      { blank: "(2)", answer: "2 / zwei", explanation: "Die Schwester und der Bruder sind beide unter 14 Jahren." },
      { blank: "(3)", answer: "München", explanation: "Ihr Aufenthaltsort ist München." },
      {
        blank: "(4)",
        answer: "cash / bar",
        explanation: "Die alternative Zahlungsart im Formular ist Barzahlung.",
      },
      { blank: "(5)", answer: "Monday / Montag", explanation: "Im Kontext steht, dass sie am Montag ankommen." },
    ],
  },
];

const mapExamPromptsToLetters = (prompts) =>
  Object.entries(prompts).flatMap(([level, entries]) =>
    (entries || []).map((item, index) => ({
      id: `${level.toLowerCase()}-${index + 1}`,
      letter: `${level}: ${item.Thema}`,
      level,
      durationMinutes: DEFAULT_EXAM_TIMINGS[level] || 20,
      situation: item.Thema,
      whatToInclude: item.Punkte || [],
    }))
  );

const splitSentences = (text = "") => {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [];
  const matches = normalized.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
  return matches ? matches.map((sentence) => sentence.trim()) : [];
};

const countWords = (value = "") => {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
};

const summarizeDraftChanges = (firstDraft = "", revisedDraft = "", level = "A1") => {
  const firstWords = countWords(firstDraft);
  const revisedWords = countWords(revisedDraft);
  const delta = revisedWords - firstWords;
  const changed = firstDraft.trim() !== revisedDraft.trim();
  const connectors = CONNECTORS_BY_LEVEL[level] || [];
  const lower = revisedDraft.toLowerCase();
  const usedConnector = connectors.some((item) => lower.includes(item.toLowerCase()));

  return {
    firstWords,
    revisedWords,
    delta,
    changed,
    badges: [
      changed ? "Rewrote sentence" : null,
      usedConnector ? "Used connector" : null,
      revisedWords >= firstWords && changed ? "Expanded clarity" : null,
    ].filter(Boolean),
  };
};

const scoreFromFeedback = (feedback) => {
  if (!feedback) return 0;
  const positive = [
    "excellent",
    "strong",
    "clear",
    "good",
    "well",
    "effective",
    "solid",
    "accurate",
  ];
  const negative = [
    "missing",
    "unclear",
    "weak",
    "needs",
    "incorrect",
    "errors",
    "poor",
    "limited",
    "confusing",
    "lack",
    "problem",
  ];
  const lower = feedback.toLowerCase();
  const posHits = positive.reduce((count, word) => count + (lower.includes(word) ? 1 : 0), 0);
  const negHits = negative.reduce((count, word) => count + (lower.includes(word) ? 1 : 0), 0);
  const base = 3 + posHits - negHits;
  return Math.min(5, Math.max(1, base));
};

const buildRubricBreakdown = (feedback) => {
  if (!feedback) {
    return RUBRIC_CRITERIA.map((item) => ({
      ...item,
      score: 0,
      explanation: "Awaiting AI feedback.",
    }));
  }

  const sentences = splitSentences(feedback);
  return RUBRIC_CRITERIA.map((item) => {
    const match =
      sentences.find((sentence) =>
        item.keywords.some((keyword) => sentence.toLowerCase().includes(keyword))
      ) || feedback;
    return {
      ...item,
      score: scoreFromFeedback(match),
      explanation: match,
    };
  });
};

const derivePromptMeta = (task) => {
  const tags = (task.tags || []).map((tag) => tag.toLowerCase());
  const label = (task.letter || "").toLowerCase();
  const situation = (task.situation || "").toLowerCase();
  let type = "letter";
  if (label.includes("e-mail") || label.includes("email") || tags.includes("email")) {
    type = "email";
  } else if (label.includes("meinung") || label.includes("opinion") || tags.includes("article")) {
    type = "argument";
  } else if (tags.includes("note")) {
    type = "note";
  }

  let formality = "neutral";
  if (tags.some((tag) => tag.includes("formal")) || situation.includes("rathaus")) {
    formality = "formal";
  } else if (tags.some((tag) => ["birthday", "invitation", "note"].includes(tag))) {
    formality = "informal";
  }

  const theme = tags[0] || "general";
  return { type, formality, theme };
};

const extractErrorBank = (feedback) => {
  if (!feedback) return [];
  const sentences = splitSentences(feedback);
  const keywords = ["error", "incorrect", "wrong", "fix", "grammar", "spelling", "case", "word order"];
  return sentences.filter((sentence) =>
    keywords.some((keyword) => sentence.toLowerCase().includes(keyword))
  );
};

const WordCountMeter = ({ count, range }) => {
  if (!range) return null;
  const progress = Math.min((count / range.max) * 100, 100);
  const isBelow = count < range.min;
  const isAbove = count > range.max;
  const status = isBelow
    ? `Add ${range.min - count} words to reach ${range.min}.`
    : isAbove
      ? `Above target by ${count - range.max} words.`
      : "On target for your level.";

  return (
    <div style={{ marginTop: 8 }}>
      <div
        style={{
          height: 10,
          borderRadius: 999,
          background: "#e5e7eb",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: isAbove ? "#f97316" : "#2563eb",
            transition: "width 0.2s ease",
          }}
        />
      </div>
      <p style={{ ...styles.helperText, margin: "6px 0 0 0" }}>
        Target: {range.min}–{range.max} words. {status}
      </p>
    </div>
  );
};

const WritingPage = ({ mode = "course", initialTab = "mark" }) => {
  const {
    level,
    setLevel,
    resultHistory,
    addResultToHistory,
    error,
    setError,
    loading,
    setLoading,
  } = useExam();
  const { user, idToken, studentProfile } = useAuth();
  const userId = user?.uid;
  const studentCode =
    studentProfile?.studentCode || studentProfile?.studentcode || user?.uid || "";
  const isExamMode = mode === "exam";
  const tutorReviewCloudEnabled = isTutorReviewCloudEnabled();

  const examWritingLetters = useMemo(
    () => mapExamPromptsToLetters(WRITING_PROMPTS),
    []
  );

  const [activeTab, setActiveTab] = useState(initialTab);
  const [writingTasks, setWritingTasks] = useState(() =>
    isExamMode ? examWritingLetters : courseWritingLetters
  );
  const [writingTasksLoading, setWritingTasksLoading] = useState(!isExamMode);
  const [writingTasksError, setWritingTasksError] = useState("");
  const [typedAnswer, setTypedAnswer] = useState("");
  const [ideaInput, setIdeaInput] = useState("");
  const [chatMessages, setChatMessages] = useState([IDEA_COACH_INTRO]);
  const [hasUnreadCoachReply, setHasUnreadCoachReply] = useState(false);
  const [isChatOverflowing, setIsChatOverflowing] = useState(false);
  const [isChatScrolled, setIsChatScrolled] = useState(false);
  const [hasHiddenNewerMessages, setHasHiddenNewerMessages] = useState(false);
  const [isPreviewOverflowing, setIsPreviewOverflowing] = useState(false);
  const [isPreviewScrolled, setIsPreviewScrolled] = useState(false);
  const [selectedDraftIds, setSelectedDraftIds] = useState([]);
  const [ideasLoading, setIdeasLoading] = useState(false);
  const [ideaError, setIdeaError] = useState("");
  const [ideaSuccess, setIdeaSuccess] = useState("");
  const [markFeedback, setMarkFeedback] = useState("");
  const [firstDraftSnapshot, setFirstDraftSnapshot] = useState("");
  const [reflectionText, setReflectionText] = useState("");
  const [revisedDraftText, setRevisedDraftText] = useState("");
  const [workflowComplete, setWorkflowComplete] = useState(false);
  const [improvedFeedback, setImprovedFeedback] = useState("");
  const [, setImprovedRubricBreakdown] = useState(() =>
    buildRubricBreakdown("")
  );
  const [improvedLoading, setImprovedLoading] = useState(false);
  const [tutorSaveState, setTutorSaveState] = useState({ loading: false, success: "", error: "" });
  const [latestTutorReview, setLatestTutorReview] = useState(null);
  const [studentReplyText, setStudentReplyText] = useState("");
  const [studentReplyState, setStudentReplyState] = useState({ loading: false, success: "", error: "" });
  const [rubricBreakdown, setRubricBreakdown] = useState(() =>
    buildRubricBreakdown("")
  );
  const [draftHistory, setDraftHistory] = useState([]);
  const [completionLog, setCompletionLog] = useState([]);
  const [errorBank, setErrorBank] = useState([]);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [selectedLetterId, setSelectedLetterId] = useState(() => {
    const initialList = isExamMode
      ? examWritingLetters.filter((task) => task.level === level)
      : courseWritingLetters;
    return initialList[0]?.id || "";
  });
  const visibleWritingTasks = useMemo(() => {
    if (isExamMode) {
      return writingTasks.filter((task) => task.level === level);
    }

    return writingTasks;
  }, [isExamMode, level, writingTasks]);
  const selectedLetter = useMemo(
    () => visibleWritingTasks.find((item) => item.id === selectedLetterId),
    [selectedLetterId, visibleWritingTasks]
  );
  const [remainingSeconds, setRemainingSeconds] = useState(
    (selectedLetter?.durationMinutes || 0) * 60
  );
  const [timerRunning, setTimerRunning] = useState(false);
  const chatLogRef = useRef(null);
  const previewRef = useRef(null);
  const resetWritingWorkspace = useCallback(() => {
    setTypedAnswer("");
    setMarkFeedback("");
    setFirstDraftSnapshot("");
    setReflectionText("");
    setRevisedDraftText("");
    setWorkflowComplete(false);
    setImprovedFeedback("");
    setImprovedRubricBreakdown(buildRubricBreakdown(""));
    setImprovedLoading(false);
    setIdeaInput("");
    setChatMessages([IDEA_COACH_INTRO]);
    setHasUnreadCoachReply(false);
    setIsChatOverflowing(false);
    setIsChatScrolled(false);
    setHasHiddenNewerMessages(false);
    setIsPreviewOverflowing(false);
    setIsPreviewScrolled(false);
    setSelectedDraftIds([]);
    setIdeaError("");
    setIdeaSuccess("");
    setTutorSaveState({ loading: false, success: "", error: "" });
    setStudentReplyText("");
    setStudentReplyState({ loading: false, success: "", error: "" });
    setRemainingSeconds((selectedLetter?.durationMinutes || 0) * 60);
    setTimerRunning(false);
    setRubricBreakdown(buildRubricBreakdown(""));
    setDraftHistory([]);
    setCompletionLog([]);
    setErrorBank([]);
    setError("");
  }, [selectedLetter?.durationMinutes, setError]);

  const handleResetWorkspace = () => {
    const confirmed = window.confirm(
      "Start fresh? This will clear your draft, AI feedback, and ideas chat history for this writing mode."
    );

    if (!confirmed) return;

    resetWritingWorkspace();
    setActiveTab("mark");
  };

  const normalizeProfileLevel = (rawLevel) => {
    const normalized = (rawLevel || "").trim().toUpperCase();
    if (ALLOWED_LEVELS.includes(normalized)) {
      return normalized;
    }

    const fuzzyMatch = ALLOWED_LEVELS.find((allowed) =>
      normalized.startsWith(allowed)
    );

    return fuzzyMatch || "";
  };

  const profileLevel = normalizeProfileLevel(studentProfile?.level);
  const isLevelLocked = ALLOWED_LEVELS.includes(profileLevel);
  const isA1Student = isLevelLocked && profileLevel === "A1";
  const canUseIdeasGenerator = !isA1Student;
  const canUsePracticeLetters = isExamMode ? true : !isA1Student;
  const canUseFormsPractice = isExamMode && level === "A1";
  const canUseTutorFeedback = isExamMode;
  const [revealedFormAnswers, setRevealedFormAnswers] = useState({});
  const availableTabs = useMemo(() => {
    const tabs = [{ key: "mark", label: "Mark my letter" }];

    if (canUseIdeasGenerator) {
      tabs.push({ key: "ideas", label: "Ideas helper" });
    }

    if (canUsePracticeLetters) {
      tabs.push({ key: "practice", label: "Practice prompts" });
    }

    if (canUseFormsPractice) {
      tabs.push({ key: "forms", label: "Forms (A1 Teil 1)" });
    }

    if (canUseTutorFeedback) {
      tabs.push({ key: "tutor", label: "Tutor feedback" });
    }

    return tabs;
  }, [canUseFormsPractice, canUseIdeasGenerator, canUsePracticeLetters, canUseTutorFeedback]);

  useEffect(() => {
    if (availableTabs.some((tab) => tab.key === initialTab)) {
      setActiveTab(initialTab);
    }
  }, [availableTabs, initialTab]);
  const progressMode = isExamMode ? "exam" : "course";
  useEffect(() => {
    if (isLevelLocked && profileLevel !== level) {
      setLevel(profileLevel);
    }
  }, [isLevelLocked, level, profileLevel, setLevel]);

  useEffect(() => {
    if (!visibleTabs.some((tab) => tab.key === activeTab)) {
      setActiveTab(visibleTabs[0]?.key || "mark");
      setIdeaError("");
      setIdeaSuccess("");
      setError("");
    }
  }, [activeTab, setError, visibleTabs]);

  const loadWritingTasks = useCallback(async () => {
    setWritingTasksLoading(true);
    setWritingTasksError("");
    try {
      const tasks = await fetchWritingLetters(undefined, idToken);

      if (tasks.length > 0) {
        setWritingTasks(tasks);
        setWritingTasksError("");
      } else {
        setWritingTasks(courseWritingLetters);
        setWritingTasksError(
          "No writing tasks found in the sheet – showing sample prompts instead."
        );
      }
    } catch (err) {
      console.error("Failed to load writing tasks", err);
      setWritingTasks(courseWritingLetters);
      setWritingTasksError(
        "Could not load writing tasks. Showing local example data."
      );
    } finally {
      setWritingTasksLoading(false);
    }
  }, [idToken]);

  useEffect(() => {
    if (isExamMode) {
      setWritingTasks(examWritingLetters);
      setWritingTasksError("");
      setWritingTasksLoading(false);
      return;
    }

    loadWritingTasks();
  }, [examWritingLetters, isExamMode, loadWritingTasks]);

  useEffect(() => {
    if (!visibleWritingTasks.length) return;
    if (
      !selectedLetterId ||
      !visibleWritingTasks.some((item) => item.id === selectedLetterId)
    ) {
      setSelectedLetterId(visibleWritingTasks[0].id);
    }
  }, [visibleWritingTasks, selectedLetterId]);

  const selectedDurationMinutes = selectedLetter?.durationMinutes;

  useEffect(() => {
    if (typeof selectedDurationMinutes === "number") {
      setRemainingSeconds(selectedDurationMinutes * 60);
      setTimerRunning(false);
    }
  }, [selectedDurationMinutes]);

  useEffect(() => {
    if (!timerRunning) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning]);

  useEffect(() => {
    let isMounted = true;

    const loadProgress = async () => {
      if (!userId) {
        resetWritingWorkspace();
        setProgressLoaded(true);
        return;
      }

      setProgressLoaded(false);
      try {
        const saved = await loadWritingProgress({ userId, studentCode, mode: progressMode });
        if (!isMounted) return;

        if (!saved) {
          resetWritingWorkspace();
          return;
        }

        if (typeof saved.typedAnswer === "string") setTypedAnswer(saved.typedAnswer);
        if (typeof saved.markFeedback === "string") setMarkFeedback(saved.markFeedback);
        if (typeof saved.firstDraftSnapshot === "string") setFirstDraftSnapshot(saved.firstDraftSnapshot);
        if (typeof saved.reflectionText === "string") setReflectionText(saved.reflectionText);
        if (typeof saved.revisedDraftText === "string") setRevisedDraftText(saved.revisedDraftText);
        if (typeof saved.workflowComplete === "boolean") setWorkflowComplete(saved.workflowComplete);
        if (typeof saved.ideaInput === "string") setIdeaInput(saved.ideaInput);
        if (Array.isArray(saved.chatMessages) && saved.chatMessages.length > 0) {
          setChatMessages(saved.chatMessages);
        } else {
          setChatMessages([IDEA_COACH_INTRO]);
        }
        if (Array.isArray(saved.selectedDraftIds)) {
          setSelectedDraftIds(saved.selectedDraftIds);
        } else {
          setSelectedDraftIds([]);
        }
        if (typeof saved.remainingSeconds === "number") {
          setRemainingSeconds(saved.remainingSeconds);
        }
        if (typeof saved.timerRunning === "boolean") {
          setTimerRunning(saved.timerRunning);
        }
        if (Array.isArray(saved.rubricBreakdown) && saved.rubricBreakdown.length) {
          setRubricBreakdown(saved.rubricBreakdown);
        }
        if (Array.isArray(saved.draftHistory)) {
          setDraftHistory(saved.draftHistory);
        }
        if (Array.isArray(saved.completionLog)) {
          setCompletionLog(saved.completionLog);
        }
        if (Array.isArray(saved.errorBank)) {
          setErrorBank(saved.errorBank);
        }
      } catch (err) {
        console.error("Failed to load writing progress", err);
      } finally {
        if (isMounted) setProgressLoaded(true);
      }
    };

    loadProgress();

    return () => {
      isMounted = false;
    };
  }, [progressMode, resetWritingWorkspace, studentCode, userId]);

  useEffect(() => {
    if (!progressLoaded || (!userId && !studentCode)) return;

    const timeout = setTimeout(() => {
      saveWritingProgress({
        userId,
        studentCode,
        mode: progressMode,
        data: {
          typedAnswer,
          markFeedback,
          firstDraftSnapshot,
          reflectionText,
          revisedDraftText,
          workflowComplete,
          ideaInput,
          chatMessages,
          selectedDraftIds,
          remainingSeconds,
          timerRunning,
          rubricBreakdown,
          draftHistory,
          completionLog,
          errorBank,
        },
      }).catch((err) => {
        console.error("Failed to save writing progress", err);
      });
    }, 800);

    return () => clearTimeout(timeout);
  }, [
    chatMessages,
    completionLog,
    draftHistory,
    errorBank,
    firstDraftSnapshot,
    ideaInput,
    markFeedback,
    reflectionText,
    revisedDraftText,
    progressLoaded,
    progressMode,
    remainingSeconds,
    rubricBreakdown,
    selectedDraftIds,
    timerRunning,
    typedAnswer,
    workflowComplete,
    userId,
    studentCode,
  ]);

  const handleExportDraft = () => {
    const trimmed = typedAnswer.trim();
    if (!trimmed) {
      alert("Please add your final draft before exporting.");
      return;
    }
    const exportWindow = window.open("", "_blank");
    if (!exportWindow) {
      alert("Pop-up blocked. Please allow pop-ups to export your draft.");
      return;
    }
    const title = `Writing Draft – ${level}`;
    exportWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 24px; line-height: 1.6; color: #111827; }
            h1 { font-size: 20px; margin-bottom: 12px; }
            pre { white-space: pre-wrap; font-size: 14px; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <pre>${trimmed.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
        </body>
      </html>
    `);
    exportWindow.document.close();
    exportWindow.focus();
    exportWindow.print();
  };

  const formatTutorReviewStatus = (status) => {
    if (status === "approved") return "Approved";
    if (status === "needs_improvement") return "Needs improvement";
    return "Pending tutor review";
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  useEffect(() => {
    if (!isExamMode || !userId) {
      setLatestTutorReview(null);
      return;
    }

    let cancelled = false;
    loadLatestTutorReviewForStudent({ userId, studentCode })
      .then((review) => {
        if (!cancelled) {
          setLatestTutorReview(review);
        }
      })
      .catch((error) => {
        console.error("Failed to load latest tutor review", error);
      });

    return () => {
      cancelled = true;
    };
  }, [isExamMode, studentCode, tutorSaveState.success, userId]);

  const handleStudentReplySubmit = async () => {
    if (!latestTutorReview?.id) {
      setStudentReplyState({ loading: false, success: "", error: "Tutor has not posted feedback yet." });
      return;
    }

    const message = studentReplyText.trim();
    if (!message) {
      setStudentReplyState({ loading: false, success: "", error: "Write your question or response before sending." });
      return;
    }

    setStudentReplyState({ loading: true, success: "", error: "" });

    try {
      await saveStudentReplyToTutorReview({
        reviewId: latestTutorReview.id,
        message,
        studentName: studentProfile?.name || user?.displayName || user?.email || "",
        studentCode,
      });
      setStudentReplyText("");
      setStudentReplyState({ loading: false, success: "Reply sent to tutor.", error: "" });
      setLatestTutorReview((prev) => ({
        ...(prev || {}),
        studentReplies: [
          ...((prev?.studentReplies || [])),
          {
            message,
            studentName: studentProfile?.name || user?.displayName || "",
            studentCode,
            createdAt: new Date().toISOString(),
          },
        ],
      }));
    } catch (err) {
      setStudentReplyState({
        loading: false,
        success: "",
        error: err?.message || "Could not send your reply right now.",
      });
    }
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setError("");
    setTutorSaveState({ loading: false, success: "", error: "" });
    if (tabKey !== "ideas") {
      setIdeaError("");
      setIdeaSuccess("");
    }
  };

  const validateSelections = () => {
    if (!ALLOWED_LEVELS.includes(level)) {
      setError("Please choose a valid level (A1–B2).");
      return false;
    }

    setError("");
    return true;
  };

  const sendTypedAnswerForCorrection = async () => {
    const trimmed = typedAnswer.trim();

    if (!trimmed) {
      alert("Please paste or type your letter before sending.");
      return;
    }

    if (!validateSelections()) {
      return;
    }

    setLoading(true);
    setMarkFeedback("");

    try {
      const studentName = user?.displayName || user?.email || "Student";
      const data = await markLetterWithAI({
        text: trimmed,
        level,
        studentName,
        idToken,
        program: studentProfile?.program,
        submissionContext: isExamMode ? "exam-room" : "course",
      });
      const breakdown = buildRubricBreakdown(data.feedback);
      const overallScore = breakdown.reduce((sum, item) => sum + (item.score || 0), 0);
      const enrichedResult = {
        id: Date.now(),
        mode: "Mark my letter",
        level,
        comments: data.feedback,
        createdAt: new Date().toISOString(),
      };
      setMarkFeedback(data.feedback);
      setFirstDraftSnapshot(trimmed);
      setRevisedDraftText(trimmed);
      setReflectionText("");
      setWorkflowComplete(false);
      setImprovedFeedback("");
      setImprovedRubricBreakdown(buildRubricBreakdown(""));
      setRubricBreakdown(breakdown);
      setErrorBank(extractErrorBank(data.feedback));
      setDraftHistory((prev) => [
        ...prev,
        {
          id: Date.now(),
          createdAt: new Date().toISOString(),
          promptId: selectedLetterId || "custom",
          promptTitle: selectedLetter?.letter || "Custom prompt",
          draft: trimmed,
          feedback: data.feedback,
          breakdown,
          score: overallScore,
        },
      ]);
      addResultToHistory(enrichedResult);
    } catch (err) {
      console.error("Falowen frontend error:", err);
      const msg =
        err?.response?.data?.error ||
        err.message ||
        "Falowen Learning Hub: Error sending text for analysis.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const revisionSummary = useMemo(
    () => summarizeDraftChanges(firstDraftSnapshot, revisedDraftText, level),
    [firstDraftSnapshot, revisedDraftText, level]
  );

  const handleSaveForTutorReview = async () => {
    if (!isExamMode) return;
    const draftToSave = revisedDraftText.trim();

    if (!draftToSave) {
      setTutorSaveState({ loading: false, success: "", error: "Please add your improved draft before saving for tutor review." });
      return;
    }

    if (!markFeedback) {
      setTutorSaveState({ loading: false, success: "", error: "Get AI feedback first, then save for tutor review." });
      return;
    }

    if (!revisionSummary.changed || !workflowComplete) {
      setTutorSaveState({
        loading: false,
        success: "",
        error: "Please complete the improve step first, then submit only the improved draft to tutor.",
      });
      return;
    }

    if (!tutorReviewCloudEnabled) {
      setTutorSaveState({
        loading: false,
        success: "",
        error: "Tutor workflow requires Firebase. Please enable Firebase config before saving.",
      });
      return;
    }

    setTutorSaveState({ loading: true, success: "", error: "" });

    try {
      await saveExamLetterForTutorReview({
        user,
        studentProfile,
        level,
        promptId: selectedLetterId || "custom",
        promptTitle: selectedLetter?.letter || "Custom prompt",
        draft: firstDraftSnapshot || typedAnswer,
        aiFeedback: markFeedback,
        revisedDraft: revisedDraftText,
        reflection: reflectionText,
      });
      setTutorSaveState({
        loading: false,
        success: "Submitted. A tutor copy is now in the review queue.",
        error: "",
      });
      setLatestTutorReview({ reviewStatus: "pending", tutorFeedback: "", reviewedAt: null });
    } catch (err) {
      console.error("Failed to save tutor review draft", err);
      setTutorSaveState({
        loading: false,
        success: "",
        error: `Save failed: ${err?.message || "Could not save for tutor review right now."}`,
      });
    }
  };

  const handleCompleteWorkflow = () => {
    if (!markFeedback) {
      setError("Step 1 first: get AI feedback.");
      return;
    }
    if (reflectionText.trim().length < 12) {
      setError("Step 2: add a short reflection about what you fixed.");
      return;
    }
    if (!revisedDraftText.trim() || !revisionSummary.changed) {
      setError("Step 2: submit a revised version that differs from your first draft.");
      return;
    }

    setTypedAnswer(revisedDraftText);
    setWorkflowComplete(true);
    setError("");
    setCompletionLog((prev) => [
      ...prev,
      {
        id: Date.now(),
        completedAt: new Date().toISOString(),
        promptId: selectedLetterId || "custom",
        promptTitle: selectedLetter?.letter || "Custom prompt",
        score: revisionSummary.badges.length,
        level,
      },
    ]);
  };

  const handleMarkAndCompareImproved = async () => {
    if (!markFeedback) {
      setError("Step 1 first: get AI feedback.");
      return;
    }
    if (!revisedDraftText.trim() || !revisionSummary.changed) {
      setError("Add a revised draft first so I can compare improvements.");
      return;
    }

    setImprovedLoading(true);
    setError("");

    try {
      const studentName = user?.displayName || user?.email || "Student";
      const data = await markLetterWithAI({
        text: revisedDraftText.trim(),
        level,
        studentName,
        idToken,
        program: studentProfile?.program,
        submissionContext: isExamMode ? "exam-room-improved" : "course-improved",
      });
      setImprovedFeedback(data.feedback);
      setImprovedRubricBreakdown(buildRubricBreakdown(data.feedback));
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err.message ||
        "Could not mark improved draft right now.";
      setError(msg);
    } finally {
      setImprovedLoading(false);
    }
  };

  const makeChatMessage = (role, content) => ({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    content,
  });

  const addChatMessage = (role, content) => {
    setChatMessages((prev) => [...prev, makeChatMessage(role, content)]);
  };

  const insertConnector = (connector) => {
    setIdeaInput((prev) => `${prev}${prev.trim() ? " " : ""}${connector}`);
  };

  const isNearBottom = useCallback((element) => {
    if (!element) return true;
    const remaining = element.scrollHeight - element.scrollTop - element.clientHeight;
    return remaining < 28;
  }, []);

  const scrollChatToBottom = useCallback(() => {
    if (!chatLogRef.current) return;
    chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
  }, []);

  const updateChatScrollMeta = useCallback(() => {
    const chatLog = chatLogRef.current;
    if (!chatLog) return;
    const overflowing = chatLog.scrollHeight > chatLog.clientHeight + 4;
    setIsChatOverflowing(overflowing);
    setIsChatScrolled(overflowing && chatLog.scrollTop > 4);
    setHasHiddenNewerMessages(
      overflowing && !isNearBottom(chatLog)
    );
  }, [isNearBottom]);

  useEffect(() => {
    const chatLog = chatLogRef.current;
    if (!chatLog) return;

    const lastMessage = chatMessages[chatMessages.length - 1];
    const shouldAutoScroll = !lastMessage || lastMessage.role === "user" || isNearBottom(chatLog);

    if (shouldAutoScroll) {
      scrollChatToBottom();
      setHasUnreadCoachReply(false);
      setHasHiddenNewerMessages(false);
      updateChatScrollMeta();
      return;
    }

    if (lastMessage?.role === "assistant") {
      setHasUnreadCoachReply(true);
    }
    updateChatScrollMeta();
  }, [chatMessages, isNearBottom, scrollChatToBottom, updateChatScrollMeta]);

  useEffect(() => {
    updateChatScrollMeta();
  }, [activeTab, chatMessages, updateChatScrollMeta]);

  useEffect(() => {
    const handleResize = () => updateChatScrollMeta();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateChatScrollMeta]);

  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;

    const overflowing = preview.scrollHeight > preview.clientHeight + 4;
    setIsPreviewOverflowing(overflowing);
    setIsPreviewScrolled(overflowing && preview.scrollTop > 4);
  }, [ideaInput]);

  const userMessages = useMemo(
    () => chatMessages.filter((msg) => msg.role === "user"),
    [chatMessages]
  );

  const toggleDraftSelection = (id) => {
    setIdeaSuccess("");
    setIdeaError("");
    setSelectedDraftIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedDraftText = useMemo(() => {
    return userMessages
      .filter((msg) => selectedDraftIds.includes(msg.id))
      .map((msg) => msg.content.trim())
      .filter(Boolean)
      .join("\n\n");
  }, [selectedDraftIds, userMessages]);

  const sendDraftsToMarkTab = () => {
    const livePreview = ideaInput.trim();
    const combinedDraft = [selectedDraftText, livePreview]
      .filter(Boolean)
      .join("\n\n");

    if (!combinedDraft) {
      setIdeaError(
        "Select at least one draft or type something in the live preview before sending it for marking."
      );
      setIdeaSuccess("");
      return;
    }

    setTypedAnswer((prev) => {
      const existing = prev.trim();
      const parts = [existing, combinedDraft].filter(Boolean);
      return parts.join("\n\n");
    });
    setError("");
    setMarkFeedback("");
    setIdeaSuccess("Your selected lines are now pasted into the “Mark my letter” tab.");
    setIdeaError("");
    setSelectedDraftIds([]);
    setActiveTab("mark");
  };

  const typedWordCount = countWords(typedAnswer);
  const typedWordRange = WORD_TARGET_RANGES[level];
  const latestImprovementNotes = useMemo(() => {
    if (!draftHistory.length) return [];
    const latest = draftHistory[draftHistory.length - 1];
    return extractErrorBank(latest.feedback).slice(0, 3);
  }, [draftHistory]);

  const handleAskCoach = async () => {
    const trimmed = ideaInput.trim();
    if (!trimmed || ideasLoading) return;

    setIdeaError("");
    setIdeaSuccess("");
    const userMessage = makeChatMessage("user", trimmed);
    const updatedMessages = [...chatMessages, userMessage];
    setChatMessages(updatedMessages);
    setIdeaInput("");
    setIdeasLoading(true);

    try {
      const payloadMessages = updatedMessages.map(({ role, content }) => ({
        role,
        content,
      }));
      const { reply } = await fetchIdeasFromCoach({
        messages: payloadMessages,
        level,
        idToken,
        program: studentProfile?.program,
      });
      addChatMessage("assistant", reply);
    } catch (err) {
      console.error("Ideas generator error:", err);
      const msg =
        err?.response?.data?.error ||
        err.message ||
        "Could not fetch ideas from Herr Felix.";
      setIdeaError(msg);
    } finally {
      setIdeasLoading(false);
    }
  };

  const practiceTimerControls = (
    <div style={styles.metaRow}>
      <div>
        <div style={styles.timer}>{formatTime(remainingSeconds)}</div>
        <div style={styles.timerHelp}>
          Time for this task: {selectedLetter?.durationMinutes || 0} minutes
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          style={styles.primaryButton}
          onClick={() => setTimerRunning(true)}
          disabled={timerRunning || !remainingSeconds}
        >
          Start
        </button>
        <button
          style={styles.secondaryButton}
          onClick={() => setTimerRunning(false)}
          disabled={!timerRunning}
        >
          Pause
        </button>
        <button
          style={styles.dangerButton}
          onClick={() => {
            setTimerRunning(false);
            setRemainingSeconds((selectedLetter?.durationMinutes || 0) * 60);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );

  return (
    <>
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>
          {isTutorOnlyView
            ? "Writing – Tutor feedback"
            : canUseIdeasGenerator
              ? "Writing – Practice exam letters"
              : "Writing – Mark my letter"}
        </h2>
        <p style={styles.helperText}>
          {isTutorOnlyView
            ? "View tutor comments and reply from here."
            : canUseIdeasGenerator
              ? "Simple flow: paste your letter, get feedback, improve one section, then save the version for your tutor."
              : "A1 students should use Mark my letter to get focused feedback on their draft."}
        </p>
        <div style={{ ...styles.helperCard, marginTop: 10 }}>
          <p style={{ ...styles.helperText, margin: 0 }}>
            {isTutorOnlyView
              ? "This page is focused on tutor updates only to keep feedback easy to track."
              : (
                <>
                  Start in <strong>Mark my letter</strong> for your main workflow. Use the other tabs only when you need
                  extra practice or idea support.
                </>
              )}
          </p>
        </div>
        <div style={styles.tabList} className="tab-list" role="tablist" aria-label="Writing workflow tabs">
          {visibleTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className="tab-button"
              role="tab"
              aria-selected={activeTab === tab.key}
              style={
                activeTab === tab.key ? styles.tabButtonActive : styles.tabButton
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 12 }}>
          <button
            style={styles.dangerButton}
            onClick={handleResetWorkspace}
            type="button"
          >
            Reset writing workspace
          </button>
        </div>
      </section>

      {activeTab === "practice" && canUsePracticeLetters && (
        <>
          <section style={styles.card}>
            <h3 style={styles.sectionTitle}>Your simulation room</h3>
            {practiceTimerControls}
            {selectedLetter && (
              <div style={{ display: "grid", gap: 10 }}>
                <div style={styles.badge}>Topic: {selectedLetter.letter}</div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 16,
                    lineHeight: 1.6,
                    color: "#111827",
                    fontWeight: 500,
                  }}
                >
                  {selectedLetter.situation}
                </p>
                <h4 style={{ ...styles.resultHeading, fontSize: 14, marginTop: 2 }}>Checklist</h4>
                <ul style={{ ...styles.checklist, marginTop: 0, fontSize: 14 }}>
                  {(selectedLetter.whatToInclude || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section style={styles.card}>
            <h3 style={styles.sectionTitle}>Practice prompts</h3>
            {writingTasksError && (
              <div style={{ ...styles.helperText, color: "#b91c1c" }}>
                <p style={{ marginBottom: 8 }}>{writingTasksError}</p>
                <button
                  style={styles.secondaryButton}
                  onClick={loadWritingTasks}
                  disabled={writingTasksLoading}
                >
                  {writingTasksLoading ? "Retrying..." : "Retry load"}
                </button>
              </div>
            )}
            {writingTasksLoading ? (
              <p style={styles.helperText}>Loading writing tasks from the sheet ...</p>
            ) : visibleWritingTasks.length === 0 ? (
              <p style={styles.helperText}>
                No writing tasks are available for this level. Please adjust your level or try again later.
              </p>
            ) : (
              <div style={styles.gridTwo}>
                {visibleWritingTasks.map((item) => {
                  const meta = derivePromptMeta(item);
                  return (
                  <div
                    key={item.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 12,
                      padding: 12,
                      background:
                        selectedLetterId === item.id ? "#eff6ff" : "#f9fafb",
                      boxShadow:
                        selectedLetterId === item.id
                          ? "0 8px 18px rgba(37,99,235,0.15)"
                          : "none",
                    }}
                  >
                    <div style={styles.metaRow}>
                      <div style={{ fontWeight: 800 }}>{item.letter}</div>
                      <span style={styles.levelPill}>Level {item.level}</span>
                    </div>
                    <p style={styles.helperText}>{item.situation}</p>
                    <div style={styles.tagRow}>
                      <span style={styles.tagPill}>{meta.theme}</span>
                      <span style={styles.tagPill}>{meta.type}</span>
                      <span style={styles.tagPill}>{meta.formality}</span>
                    </div>
                    <div style={styles.metaRow}>
                      <span style={styles.badge}>
                        ⏱️ {item.durationMinutes} minutes
                      </span>
                      <button
                        style={
                          selectedLetterId === item.id
                            ? styles.primaryButton
                            : styles.secondaryButton
                        }
                        onClick={() => setSelectedLetterId(item.id)}
                      >
                        {selectedLetterId === item.id ? "Selected" : "Practice"}
                      </button>
                    </div>
                  </div>
                );
                })}
              </div>
            )}
          </section>
        </>
      )}

      {activeTab === "mark" && (
        <>
          <section style={styles.card}>
            <h3 style={styles.sectionTitle}>Mark my letter</h3>
            <p style={styles.helperText}>
              Keep it simple: one text box for your draft, one click for feedback, one revised version to save.
            </p>
            <div style={styles.infoBox}>
              <strong>Student workflow:</strong>
              <ol style={styles.promptList}>
                <li>Paste your full letter draft</li>
                <li>Click <strong>Get AI feedback</strong></li>
                <li>Revise and save a clean tutor version</li>
              </ol>
            </div>

            <div style={{ display: "grid", gap: 8, marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <label style={styles.label}>Level for feedback</label>
                {isLevelLocked && (
                  <span style={styles.badge}>From profile</span>
                )}
              </div>
              <select
                value={level}
                onChange={(e) => {
                  setLevel(e.target.value);
                  setError("");
                }}
                style={styles.select}
                disabled={isLevelLocked}
              >
                {ALLOWED_LEVELS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>

            <label style={styles.label}>Your letter (single box)</label>
            <textarea
              value={typedAnswer}
              onChange={(e) => {
                setError("");
                setTypedAnswer(e.target.value);
              }}
              placeholder="Paste your finished letter or essay here for marking..."
              style={styles.textArea}
              rows={9}
            />
            <p style={styles.helperText}>
              Words: {typedWordCount} · Characters: {typedAnswer.length}
              {WORD_TARGETS[level] ? ` · Target: ${WORD_TARGETS[level]}` : ""}
            </p>
            <WordCountMeter count={typedWordCount} range={typedWordRange} />

            <div style={{ marginTop: 12 }}>
              <div className="writing-mark-actions" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  style={styles.primaryButton}
                  onClick={sendTypedAnswerForCorrection}
                  disabled={loading}
                >
                  {loading ? "Getting feedback..." : "Get AI feedback"}
                </button>
                <button style={styles.secondaryButton} type="button" onClick={handleExportDraft}>
                  Export final draft (PDF/print)
                </button>
                {isExamMode ? (
                  <button
                    style={styles.secondaryButton}
                    type="button"
                    onClick={handleSaveForTutorReview}
                    disabled={tutorSaveState.loading}
                  >
                    {tutorSaveState.loading ? "Submitting to tutor..." : "Submit copy to tutor"}
                  </button>
                ) : null}
              </div>
              {isExamMode ? (
                <div style={{ display: "grid", gap: 6 }}>
                  <p style={styles.helperText}>
                    Exam room only: submit this marked draft so your tutor receives your latest practice.
                  </p>
                  {!tutorReviewCloudEnabled ? (
                    <p style={{ ...styles.helperText, color: "#b45309", margin: "0" }}>
                      Firebase is not configured in this environment, so tutor responses cannot be synced yet.
                    </p>
                  ) : null}
                </div>
              ) : null}
              {tutorSaveState.error ? (
                <div style={{ ...styles.helperText, color: "#b91c1c" }}>{tutorSaveState.error}</div>
              ) : null}
              {tutorSaveState.success ? (
                <div style={{ ...styles.helperText, color: "#166534" }}>{tutorSaveState.success}</div>
              ) : null}
            </div>

            {markFeedback ? (
              <div style={{ ...styles.infoBox, marginTop: 12 }}>
                <strong>Step 2 (required): reflection + revised submission</strong>
                <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
                  <textarea
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    placeholder="What I fixed: ..."
                    style={styles.textareaSmall}
                    rows={2}
                  />
                  <textarea
                    value={revisedDraftText}
                    onChange={(e) => setRevisedDraftText(e.target.value)}
                    placeholder="Submit revised version"
                    style={styles.textArea}
                    rows={7}
                  />
                </div>
                <p style={{ ...styles.helperText, margin: "8px 0 0 0" }}>
                  Attempt 1: {revisionSummary.firstWords} words · Attempt 2: {revisionSummary.revisedWords} words · Δ {revisionSummary.delta}
                </p>
                {revisionSummary.badges.length ? (
                  <div style={styles.tagRow}>
                    {revisionSummary.badges.map((badge) => (
                      <span key={badge} style={styles.tagPill}>{badge}</span>
                    ))}
                  </div>
                ) : null}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                  <button style={styles.primaryButton} onClick={handleCompleteWorkflow}>Complete</button>
                  <button style={styles.secondaryButton} onClick={handleMarkAndCompareImproved} disabled={improvedLoading}>
                    {improvedLoading ? "Marking improved draft..." : "Mark & compare improved"}
                  </button>
                </div>
                {workflowComplete ? <div style={{ ...styles.successBox, marginTop: 8 }}>Workflow complete. Great revision discipline.</div> : null}
              </div>
            ) : null}

            {error && (
              <div style={styles.errorBox}>
                <strong>Note:</strong> {error}
              </div>
            )}
          </section>

          {markFeedback && !improvedFeedback ? (
            <section style={styles.card}>
              <h3 style={styles.sectionTitle}>AI feedback</h3>
              <pre className="writing-feedback-pre" style={{ ...styles.pre, whiteSpace: "pre-wrap" }}>{markFeedback}</pre>
            </section>
          ) : null}

          {improvedFeedback ? (
            <section style={styles.card}>
              <h3 style={styles.sectionTitle}>Updated AI feedback</h3>
              <pre className="writing-feedback-pre" style={{ ...styles.pre, whiteSpace: "pre-wrap" }}>{improvedFeedback}</pre>
              <details style={{ marginTop: 10 }}>
                <summary style={{ cursor: "pointer", fontWeight: 700 }}>Previous AI feedback</summary>
                <pre className="writing-feedback-pre" style={{ ...styles.pre, whiteSpace: "pre-wrap", marginTop: 10 }}>{markFeedback}</pre>
              </details>
            </section>
          ) : null}

          {draftHistory.length >= 2 && (
            <section style={styles.card}>
              <details>
                <summary style={{ cursor: "pointer", fontWeight: 700 }}>Compare drafts (optional)</summary>
                <p style={{ ...styles.helperText, marginTop: 8 }}>
                  Review the last two submissions to track improvements.
                </p>
                <div style={styles.gridTwo}>
                  {draftHistory.slice(-2).map((entry, index) => (
                    <div key={entry.id} style={styles.helperCard}>
                      <div style={{ fontWeight: 700, marginBottom: 6 }}>
                        {index === 0 ? "Previous draft" : "Latest draft"}
                      </div>
                      <div style={styles.helperText}>
                        {entry.promptTitle} · {new Date(entry.createdAt).toLocaleString()}
                      </div>
                      <pre style={{ ...styles.pre, whiteSpace: "pre-wrap" }}>{entry.draft}</pre>
                    </div>
                  ))}
                </div>
                {latestImprovementNotes.length > 0 ? (
                  <>
                    <div style={{ fontWeight: 700, marginTop: 10 }}>Improvement notes</div>
                    <ul style={styles.checklist}>
                      {latestImprovementNotes.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </details>
            </section>
          )}

          <ResultHistory results={resultHistory} />
        </>
      )}

      {activeTab === "ideas" && canUseIdeasGenerator && (
        <section style={styles.card} className="idea-generator-card">
          <h3 style={styles.sectionTitle}>Idea generator</h3>
          <p style={styles.helperText}>
            Paste your task and chat in a single field. Herr Felix replies step by step with the updated coaching prompt.
          </p>
          <div style={styles.infoBox}>
            <strong>Use the coach to learn from your ideas:</strong>
            <ul style={styles.promptList}>
              {IDEAS_COACHING_PROMPTS.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ul>
          </div>
          <div
            ref={chatLogRef}
            style={styles.chatLog}
            className="idea-generator-chat"
            onScroll={() => {
              const atBottom = isNearBottom(chatLogRef.current);
              if (atBottom) {
                setHasUnreadCoachReply(false);
                setHasHiddenNewerMessages(false);
              }
              updateChatScrollMeta();
            }}
          >
            {chatMessages.map((msg, idx) => (
              <div
                key={msg.id || `${msg.role}-${idx}`}
                style={
                  msg.role === "assistant"
                    ? styles.chatBubbleCoach
                    : styles.chatBubbleUser
                }
                className={`idea-generator-bubble ${msg.role === "assistant" ? "idea-generator-bubble--coach" : "idea-generator-bubble--user"}`}
              >
                <strong style={{ display: "block", marginBottom: 4 }}>
                  {msg.role === "assistant"
                    ? "🤖 Herr Felix (AI coach)"
                    : `👩‍🎓 ${user?.displayName || "Student"}`}
                </strong>
                <span>{msg.content}</span>
              </div>
            ))}
          </div>
          {isChatOverflowing ? (
            <div
              style={{
                ...styles.badge,
                marginTop: 8,
                background: "#fff7ed",
                borderColor: "#fed7aa",
                display: "block",
              }}
            >
              {hasHiddenNewerMessages
                ? "You are viewing older messages. Scroll down to see the newest reply."
                : isChatScrolled
                  ? "You are not at the beginning. Scroll up to see earlier context."
                  : "Long chat detected. Scroll to review all messages."}
            </div>
          ) : null}
          {hasUnreadCoachReply ? (
            <button
              type="button"
              style={{ ...styles.secondaryButton, marginTop: 8 }}
              onClick={() => {
                scrollChatToBottom();
                setHasUnreadCoachReply(false);
                setHasHiddenNewerMessages(false);
                updateChatScrollMeta();
              }}
            >
              New AI reply below ↓
            </button>
          ) : null}
          <div style={{ marginTop: 12 }}>
            <label style={styles.label}>Your prompt (single box)</label>
            <textarea
              style={styles.textareaSmall}
              value={ideaInput}
              onChange={(e) => {
                setIdeaInput(e.target.value);
                setIdeaError("");
                setIdeaSuccess("");
              }}
              placeholder="Paste your exam question or the part you need help with."
              rows={3}
            />
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Useful connectors</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {(CONNECTORS_BY_LEVEL[level] || CONNECTORS_BY_LEVEL.B1).map((connector) => (
                <button
                  key={connector}
                  style={styles.chipButton}
                  onClick={() => insertConnector(connector)}
                  type="button"
                >
                  {connector}
                </button>
              ))}
            </div>
          </div>
          <div
            style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}
            className="idea-generator-actions"
          >
            <button
              style={styles.primaryButton}
              onClick={handleAskCoach}
              disabled={ideasLoading}
            >
              {ideasLoading ? "Coach is typing..." : "Send to AI coach"}
            </button>
            <button
              style={styles.secondaryButton}
              onClick={() => {
                setChatMessages([IDEA_COACH_INTRO]);
                setIdeaError("");
                setIdeaInput("");
                setSelectedDraftIds([]);
                setIdeaSuccess("");
                setHasUnreadCoachReply(false);
                setHasHiddenNewerMessages(false);
                setIsChatScrolled(false);
                setIsChatOverflowing(false);
              }}
            >
              Reset chat
            </button>
          </div>

          {ideaError && (
            <div style={{ ...styles.errorBox, marginTop: 8 }}>
              <strong>Note:</strong> {ideaError}
            </div>
          )}

          <div style={{ marginTop: 16 }}>
            <h4 style={styles.resultHeading}>Preview & quick copy</h4>
            <p style={styles.helperText}>
              Choose parts from your chat messages or use the live preview below.
              We will place them in the “Mark my letter” tab so you can get them graded quickly.
            </p>
            <div style={styles.gridTwo} className="idea-generator-grid">
              <div
                style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}
                className="idea-generator-panel"
              >
                <div style={styles.metaRow}>
                  <div style={{ fontWeight: 800 }}>Live preview</div>
                  <span style={styles.badge}>Visible only to you</span>
                </div>
                <p style={styles.helperText}>
                  See what you're typing before you send it.
                </p>
                {isPreviewOverflowing ? (
                  <div style={{ ...styles.badge, marginBottom: 8, background: "#fff7ed", borderColor: "#fed7aa" }}>
                    {isPreviewScrolled ? "You are viewing part of your text. Scroll up for the beginning." : "Long draft detected. Scroll to review all text."}
                  </div>
                ) : null}
                <div
                  ref={previewRef}
                  style={{
                    border: "1px dashed #d1d5db",
                    borderRadius: 10,
                    padding: 10,
                    minHeight: 80,
                    maxHeight: 160,
                    overflowY: "auto",
                    background: "#f8fafc",
                    whiteSpace: "pre-wrap",
                  }}
                  className="idea-generator-preview"
                  onScroll={(event) => {
                    setIsPreviewScrolled(event.currentTarget.scrollTop > 4);
                  }}
                >
                  {ideaInput.trim() || "No draft typed yet."}
                </div>
              </div>

              <div
                style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}
                className="idea-generator-panel"
              >
                <div style={styles.metaRow}>
                  <div style={{ fontWeight: 800 }}>Pick from your chat</div>
                  <span style={styles.badge}>{userMessages.length} drafts</span>
                </div>
                {userMessages.length === 0 ? (
                  <p style={styles.helperText}>
                    Send a question in the chat, then you can select your own messages here.
                  </p>
                ) : (
                  <div
                    style={{ display: "grid", gap: 8, maxHeight: 200, overflowY: "auto" }}
                    className="idea-generator-drafts"
                  >
                    {userMessages.map((msg) => (
                      <label
                        key={msg.id}
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "flex-start",
                          border: "1px solid #e5e7eb",
                          borderRadius: 10,
                          padding: 10,
                          background: selectedDraftIds.includes(msg.id) ? "#eef2ff" : "#f9fafb",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedDraftIds.includes(msg.id)}
                          onChange={() => toggleDraftSelection(msg.id)}
                          style={{ marginTop: 4 }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13, color: "#1f2937" }}>Your chat entry</div>
                          <p style={{ ...styles.helperText, marginBottom: 0, whiteSpace: "pre-wrap" }}>
                            {msg.content}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
                <button
                  style={{ ...styles.primaryButton, marginTop: 10 }}
                  onClick={sendDraftsToMarkTab}
                >
                  Send to “Mark my letter”
                </button>
                {ideaSuccess && (
                  <div style={{ ...styles.successBox, marginTop: 8 }}>
                    {ideaSuccess}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === "forms" && canUseFormsPractice && (
        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>A1 Forms Practice (Teil 1)</h3>
          <p style={styles.helperText}>
            Train form completion before moving to Teil 2 letters. These examples are original practice tasks inspired by exam format,
            so you can learn the pattern without copyright issues. Click to reveal model answers and compare your choices.
          </p>
          <div style={{ display: "grid", gap: 14 }}>
            {A1_FORM_PRACTICE_TASKS.map((task) => {
              const isOpen = Boolean(revealedFormAnswers[task.id]);
              return (
                <article
                  key={task.id}
                  style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 14, background: "#fff" }}
                >
                  <div style={styles.metaRow}>
                    <h4 style={{ margin: 0 }}>{task.title}</h4>
                    <span style={styles.badge}>Sample practice</span>
                  </div>
                  <p style={{ ...styles.helperText, marginTop: 8 }}>{task.context}</p>
                  <p style={{ margin: "8px 0", fontWeight: 600 }}>{task.prompt}</p>
                  <div style={{ border: "1px dashed #d1d5db", borderRadius: 10, padding: 12, background: "#f8fafc" }}>
                    {task.formFields.map((field) => (
                      <p key={field.label} style={{ margin: "8px 0", fontSize: 16, lineHeight: 1.5 }}>
                        <strong>{field.label}:</strong> {field.value}
                      </p>
                    ))}
                  </div>
                  <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      style={styles.primaryButton}
                      onClick={() =>
                        setRevealedFormAnswers((prev) => ({
                          ...prev,
                          [task.id]: !prev[task.id],
                        }))
                      }
                    >
                      {isOpen ? "Hide answers" : "Show answers"}
                    </button>
                  </div>
                  {isOpen && (
                    <div style={{ ...styles.successBox, marginTop: 10 }}>
                      <div style={{ fontWeight: 800, marginBottom: 6 }}>Model answers + why</div>
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {task.answers.map((item) => (
                          <li key={item.blank} style={{ marginBottom: 6 }}>
                            <strong>{item.blank}</strong> → {item.answer}. {item.explanation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
          <div style={{ ...styles.helperCard, marginTop: 14 }}>
            <strong>After Forms (Teil 1):</strong>
            <p style={{ ...styles.helperText, margin: "6px 0 0 0" }}>
              Your main submitted assignment should still focus on Teil 2: one formal and one informal letter.
              Use “Mark my letter” to send those drafts for grading and tutor review.
            </p>
          </div>
        </section>
      )}

      {activeTab === "tutor" && canUseTutorFeedback && (
        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>Tutor feedback</h3>
          <p style={styles.helperText}>
            This tab is only for tutor responses on your submitted writing practice.
          </p>
          {!tutorReviewCloudEnabled ? (
            <div style={styles.errorBox}>
              Tutor feedback sync is unavailable because Firebase is not configured in this environment.
            </div>
          ) : null}
          <div style={styles.helperCard}>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>
              Status: {formatTutorReviewStatus(latestTutorReview?.reviewStatus)}
            </div>
            {latestTutorReview?.reviewedAt ? (
              <p style={{ ...styles.helperText, margin: "0 0 8px" }}>
                Reviewed: {new Date(latestTutorReview.reviewedAt).toLocaleString()}
              </p>
            ) : null}
            {latestTutorReview?.tutorFeedback ? (
              <pre style={{ ...styles.pre, background: "#0f172a", fontSize: 14 }}>{latestTutorReview.tutorFeedback}</pre>
            ) : (
              <p style={{ ...styles.helperText, margin: 0 }}>
                No tutor notes yet. Submit a copy from “Mark my letter” and check back here.
              </p>
            )}
            {Array.isArray(latestTutorReview?.studentReplies) && latestTutorReview.studentReplies.length ? (
              <div style={{ marginTop: 10 }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Your replies</div>
                <div style={{ display: "grid", gap: 8 }}>
                  {latestTutorReview.studentReplies.map((reply, index) => (
                    <div key={`${reply?.createdAt || "reply"}-${index}`} style={{ ...styles.infoBox, margin: 0 }}>
                      <div style={{ ...styles.helperText, margin: "0 0 4px" }}>
                        {reply?.createdAt ? new Date(reply.createdAt).toLocaleString() : "Just now"}
                      </div>
                      <div>{reply?.message || ""}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          {tutorReviewCloudEnabled ? (
            <div style={{ ...styles.helperCard, marginTop: 10 }}>
              <label style={styles.label}>Reply to tutor feedback</label>
              <textarea
                style={{ ...styles.textArea, marginTop: 6 }}
                rows={4}
                placeholder="Tell your tutor what is still confusing or ask a follow-up question."
                value={studentReplyText}
                onChange={(event) => {
                  setStudentReplyText(event.target.value);
                  setStudentReplyState({ loading: false, success: "", error: "" });
                }}
              />
              <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  type="button"
                  style={styles.primaryButton}
                  onClick={handleStudentReplySubmit}
                  disabled={studentReplyState.loading || !latestTutorReview?.id}
                >
                  {studentReplyState.loading ? "Sending..." : "Send reply to tutor"}
                </button>
              </div>
              {studentReplyState.error ? <p style={{ ...styles.helperText, color: "#b91c1c" }}>{studentReplyState.error}</p> : null}
              {studentReplyState.success ? <p style={{ ...styles.helperText, color: "#166534" }}>{studentReplyState.success}</p> : null}
            </div>
          ) : null}
        </section>
      )}
    </>
  );
};

export default WritingPage;
