import React, { useCallback, useEffect, useMemo, useState } from "react";
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

const RUBRIC_EXAMPLES = {
  A1: {
    good: "Short note with clear purpose, 2-3 details, polite closing.",
    excellent: "All points covered + simple connectors (und, aber), no major grammar slips.",
  },
  A2: {
    good: "Clear email with context, request, and polite closing.",
    excellent: "Includes reasons, polite modal verbs, and 1–2 supporting details.",
  },
  B1: {
    good: "Organized letter with paragraphs and clear request/complaint.",
    excellent: "Adds justification, cohesive connectors, and accurate tenses.",
  },
  B2: {
    good: "Structured opinion with examples and a clear conclusion.",
    excellent: "Balances pros/cons, varied connectors, and precise grammar.",
  },
  C1: {
    good: "Formal, coherent response with clear stance and examples.",
    excellent: "Sophisticated structure, nuanced argument, and near-native accuracy.",
  },
};

const CONNECTORS_BY_LEVEL = {
  A1: ["und", "aber", "dann", "weil"],
  A2: ["zuerst", "außerdem", "deshalb", "trotzdem"],
  B1: ["zum Beispiel", "deswegen", "daher", "jedoch"],
  B2: ["dennoch", "hingegen", "folglich", "darüber hinaus"],
  C1: ["hingegen", "nichtsdestotrotz", "folglich", "dementsprechend"],
};

const TEMPLATE_SNIPPETS = {
  formal:
    "Sehr geehrte Damen und Herren,\n\nich schreibe Ihnen, weil ...\n\nMit freundlichen Grüßen\n[Name]",
  informal:
    "Hallo [Name],\n\nich wollte dir kurz schreiben, weil ...\n\nLiebe Grüße\n[Name]",
};

const DEFAULT_OUTLINE = [
  { title: "Greeting + context", hint: "Greet and name the situation." },
  { title: "Purpose", hint: "State why you are writing." },
  { title: "Bullet points", hint: "Answer the task points with details." },
  { title: "Closing", hint: "Polite closing line." },
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

const buildPlanOutline = ({ selectedLetter, ideaInput }) => {
  if (selectedLetter?.whatToInclude?.length) {
    return selectedLetter.whatToInclude.map((point, index) => ({
      title: `Bullet point ${index + 1}`,
      hint: point,
      draft: "",
    }));
  }

  if (ideaInput?.trim()) {
    return DEFAULT_OUTLINE.map((step) => ({
      ...step,
      draft: "",
      hint: `${step.hint} (${ideaInput.slice(0, 60)}...)`,
    }));
  }

  return DEFAULT_OUTLINE.map((step) => ({ ...step, draft: "" }));
};

const extractErrorBank = (feedback) => {
  if (!feedback) return [];
  const sentences = splitSentences(feedback);
  const keywords = ["error", "incorrect", "wrong", "fix", "grammar", "spelling", "case", "word order"];
  return sentences.filter((sentence) =>
    keywords.some((keyword) => sentence.toLowerCase().includes(keyword))
  );
};

const buildRevisionTasks = (errors) => {
  if (!errors.length) return [];
  return [
    "Rewrite 3 sentences using weil + correct word order.",
    "Underline articles and check case endings.",
    "Swap 3 connectors with higher-level alternatives.",
  ];
};

const calculateStreak = (logEntries) => {
  if (!logEntries.length) return 0;
  const dates = [...logEntries]
    .map((entry) => new Date(entry.completedAt).toDateString())
    .filter(Boolean);
  const uniqueDates = Array.from(new Set(dates)).sort((a, b) => new Date(b) - new Date(a));
  let streak = 1;
  let current = new Date(uniqueDates[0]);
  for (let index = 1; index < uniqueDates.length; index += 1) {
    const date = new Date(uniqueDates[index]);
    const diffDays = Math.round((current - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak += 1;
      current = date;
    } else {
      break;
    }
  }
  return streak;
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

const WritingPage = ({ mode = "course" }) => {
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

  const [activeTab, setActiveTab] = useState("mark");
  const [writingTasks, setWritingTasks] = useState(() =>
    isExamMode ? examWritingLetters : courseWritingLetters
  );
  const [writingTasksLoading, setWritingTasksLoading] = useState(!isExamMode);
  const [writingTasksError, setWritingTasksError] = useState("");
  const [typedAnswer, setTypedAnswer] = useState("");
  const [practiceDraft, setPracticeDraft] = useState("");
  const [ideaInput, setIdeaInput] = useState("");
  const [chatMessages, setChatMessages] = useState([IDEA_COACH_INTRO]);
  const [selectedDraftIds, setSelectedDraftIds] = useState([]);
  const [ideasLoading, setIdeasLoading] = useState(false);
  const [ideaError, setIdeaError] = useState("");
  const [ideaSuccess, setIdeaSuccess] = useState("");
  const [markFeedback, setMarkFeedback] = useState("");
  const [firstDraftSnapshot, setFirstDraftSnapshot] = useState("");
  const [reflectionText, setReflectionText] = useState("");
  const [revisedDraftText, setRevisedDraftText] = useState("");
  const [workflowComplete, setWorkflowComplete] = useState(false);
  const [tutorSaveState, setTutorSaveState] = useState({ loading: false, success: "", error: "" });
  const [latestTutorReview, setLatestTutorReview] = useState(null);
  const [mockExamMode, setMockExamMode] = useState(false);
  const [showOutlineHelper, setShowOutlineHelper] = useState(true);
  const [examFocusMode, setExamFocusMode] = useState(false);
  const [pendingExamStart, setPendingExamStart] = useState(false);
  const [promptFilters, setPromptFilters] = useState({
    theme: "all",
    type: "all",
    formality: "all",
  });
  const [rubricChecklist, setRubricChecklist] = useState({
    task: false,
    coherence: false,
    grammar: false,
  });
  const [rubricBreakdown, setRubricBreakdown] = useState(() =>
    buildRubricBreakdown("")
  );
  const [draftHistory, setDraftHistory] = useState([]);
  const [completionLog, setCompletionLog] = useState([]);
  const [errorBank, setErrorBank] = useState([]);
  const [planOutline, setPlanOutline] = useState([]);
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
  const taskFilterOptions = useMemo(() => {
    const themes = new Set();
    const types = new Set();
    const formalities = new Set();
    visibleWritingTasks.forEach((task) => {
      const meta = derivePromptMeta(task);
      themes.add(meta.theme);
      types.add(meta.type);
      formalities.add(meta.formality);
    });
    return {
      themes: Array.from(themes).sort(),
      types: Array.from(types).sort(),
      formalities: Array.from(formalities).sort(),
    };
  }, [visibleWritingTasks]);
  const filteredWritingTasks = useMemo(() => {
    return visibleWritingTasks.filter((task) => {
      const meta = derivePromptMeta(task);
      const themeMatch = promptFilters.theme === "all" || meta.theme === promptFilters.theme;
      const typeMatch = promptFilters.type === "all" || meta.type === promptFilters.type;
      const formalityMatch =
        promptFilters.formality === "all" || meta.formality === promptFilters.formality;
      return themeMatch && typeMatch && formalityMatch;
    });
  }, [promptFilters, visibleWritingTasks]);
  const selectedLetter = useMemo(
    () => filteredWritingTasks.find((item) => item.id === selectedLetterId),
    [selectedLetterId, filteredWritingTasks]
  );
  const [remainingSeconds, setRemainingSeconds] = useState(
    (selectedLetter?.durationMinutes || 0) * 60
  );
  const [timerRunning, setTimerRunning] = useState(false);
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
  const canUsePracticeLetters = !isA1Student;
  const availableTabs = useMemo(() => {
    const tabs = [{ key: "mark", label: "Mark my letter" }];

    if (canUseIdeasGenerator) {
      tabs.push({ key: "ideas", label: "Idea generator" });
    }

    if (canUsePracticeLetters) {
      tabs.unshift({ key: "practice", label: "Practice letters" });
    }

    return tabs;
  }, [canUseIdeasGenerator, canUsePracticeLetters]);
  const progressMode = isExamMode ? "exam" : "course";
  const activeTargetLevel = selectedLetter?.level || level;
  const wordTarget = WORD_TARGETS[activeTargetLevel];
  const wordRange = WORD_TARGET_RANGES[activeTargetLevel];
  const mockHintsLocked = mockExamMode && remainingSeconds > 0;

  useEffect(() => {
    if (isLevelLocked && profileLevel !== level) {
      setLevel(profileLevel);
    }
  }, [isLevelLocked, level, profileLevel, setLevel]);

  useEffect(() => {
    if (!availableTabs.some((tab) => tab.key === activeTab)) {
      setActiveTab(availableTabs[0]?.key || "mark");
      setIdeaError("");
      setIdeaSuccess("");
      setError("");
    }
  }, [activeTab, availableTabs, setError]);

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
    if (!filteredWritingTasks.length) return;
    if (
      !selectedLetterId ||
      !filteredWritingTasks.some((item) => item.id === selectedLetterId)
    ) {
      setSelectedLetterId(filteredWritingTasks[0].id);
    }
  }, [filteredWritingTasks, selectedLetterId]);

  const selectedDurationMinutes = selectedLetter?.durationMinutes;

  useEffect(() => {
    if (typeof selectedDurationMinutes === "number") {
      setRemainingSeconds(selectedDurationMinutes * 60);
      setTimerRunning(false);
      if (pendingExamStart) {
        setTimerRunning(true);
        setPendingExamStart(false);
      }
    }
  }, [pendingExamStart, selectedDurationMinutes]);

  useEffect(() => {
    if (!timerRunning) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          setExamFocusMode(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning]);

  useEffect(() => {
    let isMounted = true;

    const resetProgressState = () => {
      setTypedAnswer("");
      setPracticeDraft("");
      setMarkFeedback("");
      setIdeaInput("");
      setChatMessages([IDEA_COACH_INTRO]);
      setSelectedDraftIds([]);
      setIdeaSuccess("");
      setRemainingSeconds((selectedDurationMinutes || 0) * 60);
      setTimerRunning(false);
      setRubricBreakdown(buildRubricBreakdown(""));
      setDraftHistory([]);
      setCompletionLog([]);
      setErrorBank([]);
      setPlanOutline([]);
      setShowOutlineHelper(true);
      setExamFocusMode(false);
      setPendingExamStart(false);
      setPromptFilters({ theme: "all", type: "all", formality: "all" });
    };

    const loadProgress = async () => {
      if (!userId) {
        resetProgressState();
        setProgressLoaded(true);
        return;
      }

      setProgressLoaded(false);
      try {
        const saved = await loadWritingProgress({ userId, studentCode, mode: progressMode });
        if (!isMounted) return;

        if (!saved) {
          resetProgressState();
          return;
        }

        if (typeof saved.typedAnswer === "string") setTypedAnswer(saved.typedAnswer);
        if (typeof saved.practiceDraft === "string") setPracticeDraft(saved.practiceDraft);
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
        if (Array.isArray(saved.planOutline)) {
          setPlanOutline(saved.planOutline);
        }
        if (typeof saved.showOutlineHelper === "boolean") {
          setShowOutlineHelper(saved.showOutlineHelper);
        }
        if (saved.promptFilters) {
          setPromptFilters({
            theme: saved.promptFilters.theme || "all",
            type: saved.promptFilters.type || "all",
            formality: saved.promptFilters.formality || "all",
          });
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
  }, [progressMode, selectedDurationMinutes, studentCode, userId]);

  useEffect(() => {
    if (!progressLoaded || (!userId && !studentCode)) return;

    const timeout = setTimeout(() => {
      saveWritingProgress({
        userId,
        studentCode,
        mode: progressMode,
        data: {
          typedAnswer,
          practiceDraft,
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
          planOutline,
          showOutlineHelper,
          promptFilters,
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
    planOutline,
    promptFilters,
    practiceDraft,
    progressLoaded,
    progressMode,
    remainingSeconds,
    rubricBreakdown,
    selectedDraftIds,
    showOutlineHelper,
    timerRunning,
    typedAnswer,
    workflowComplete,
    userId,
    studentCode,
  ]);

  const handleInsertSnippet = (snippet) => {
    setPracticeDraft((prev) => {
      const spacer = prev.trim() ? "\n\n" : "";
      return `${prev}${spacer}${snippet}`;
    });
  };

  const handleRandomPrompt = () => {
    if (!filteredWritingTasks.length) return;
    const random = filteredWritingTasks[Math.floor(Math.random() * filteredWritingTasks.length)];
    setSelectedLetterId(random.id);
  };

  const handleStartExamPreset = () => {
    if (!filteredWritingTasks.length) return;
    const random = filteredWritingTasks[Math.floor(Math.random() * filteredWritingTasks.length)];
    setSelectedLetterId(random.id);
    setMockExamMode(true);
    setPendingExamStart(true);
    setRemainingSeconds((random.durationMinutes || 0) * 60);
    setExamFocusMode(true);
  };

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

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setError("");
    setTutorSaveState({ loading: false, success: "", error: "" });
    if (tabKey !== "mark") {
      setMarkFeedback("");
    }
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
    const draftToSave = revisedDraftText.trim() || typedAnswer.trim();

    if (!draftToSave) {
      setTutorSaveState({ loading: false, success: "", error: "Please add your final draft before saving for tutor review." });
      return;
    }

    if (!markFeedback) {
      setTutorSaveState({ loading: false, success: "", error: "Get AI feedback first, then save for tutor review." });
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
        success: "Saved. Your tutor can review this exam-room letter after the AI feedback.",
        error: "",
      });
      setLatestTutorReview({ reviewStatus: "pending", tutorFeedback: "", reviewedAt: null });
    } catch (err) {
      console.error("Failed to save tutor review draft", err);
      setTutorSaveState({
        loading: false,
        success: "",
        error: err?.message || "Could not save for tutor review right now.",
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

  const sendPracticeDraftToMarkTab = () => {
    const trimmed = practiceDraft.trim();

    if (!trimmed) {
      alert("Please write your practice draft before sending it to be marked.");
      return;
    }

    setTypedAnswer((prev) => {
      const existing = prev.trim();
      const parts = [existing, trimmed].filter(Boolean);
      return parts.join("\n\n");
    });
    setError("");
    setMarkFeedback("");
    setActiveTab("mark");
  };

  const practiceWordCount = countWords(practiceDraft);
  const typedWordCount = countWords(typedAnswer);
  const typedWordRange = WORD_TARGET_RANGES[level];
  const completionStats = useMemo(() => {
    const lastEntry = completionLog[completionLog.length - 1];
    const bestScore = completionLog.reduce((best, entry) => Math.max(best, entry.score || 0), 0);
    return {
      streak: calculateStreak(completionLog),
      lastCompleted: lastEntry?.completedAt || null,
      bestScore,
    };
  }, [completionLog]);
  const revisionTasks = useMemo(() => buildRevisionTasks(errorBank), [errorBank]);
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
        <button
          style={styles.secondaryButton}
          onClick={handleRandomPrompt}
          disabled={!filteredWritingTasks.length}
        >
          Random prompt
        </button>
        <button
          style={styles.primaryButton}
          onClick={handleStartExamPreset}
          disabled={!filteredWritingTasks.length}
        >
          Start exam preset
        </button>
      </div>
    </div>
  );

  return (
    <>
      {examFocusMode && (
        <div style={styles.focusOverlay}>
          <div style={styles.focusTimer}>{formatTime(remainingSeconds)}</div>
          <p style={{ margin: "0 0 16px", maxWidth: 520 }}>
            Focus mode is on. Keep writing until the timer ends. Hints stay locked during the exam preset.
          </p>
          <button
            style={styles.focusButton}
            onClick={() => setExamFocusMode(false)}
          >
            Exit focus mode
          </button>
        </div>
      )}
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>{canUseIdeasGenerator ? "Writing – Practice exam letters" : "Writing – Mark my letter"}</h2>
        <p style={styles.helperText}>
          {canUseIdeasGenerator
            ? "Choose a letter, write with the timer, get your text graded, or ask the idea generator for wording help."
            : "A1 students should use Mark my letter to get focused feedback on their draft."}
        </p>
        <div style={styles.tabList} className="tab-list" role="tablist" aria-label="Writing workflow tabs">
          {availableTabs.map((tab) => (
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
      </section>

      {activeTab === "practice" && canUsePracticeLetters && (
        <>
          <section style={styles.card}>
            <h3 style={styles.sectionTitle}>Your simulation room</h3>
            {practiceTimerControls}
            <div style={{ ...styles.helperCard, marginTop: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Progress snapshot</div>
              <div style={{ display: "grid", gap: 6 }}>
                <div>
                  <strong>Streak:</strong> {completionStats.streak} day
                  {completionStats.streak === 1 ? "" : "s"}
                </div>
                <div>
                  <strong>Last completed:</strong>{" "}
                  {completionStats.lastCompleted
                    ? new Date(completionStats.lastCompleted).toLocaleDateString()
                    : "No submissions yet"}
                </div>
                <div>
                  <strong>Best feedback score:</strong> {completionStats.bestScore || "—"}
                </div>
              </div>
            </div>
            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
              <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14 }}>
                <input
                  type="checkbox"
                  checked={mockExamMode}
                  onChange={(event) => setMockExamMode(event.target.checked)}
                />
                Mock exam mode (hide hints until timer ends)
              </label>
              {mockExamMode ? (
                <span style={{ ...styles.badge, background: "#fee2e2", color: "#991b1b" }}>
                  Hints locked while timer is running
                </span>
              ) : null}
            </div>
            {selectedLetter && (
              <>
                <div style={styles.badge}>Topic: {selectedLetter.letter}</div>
                <p style={styles.helperText}>{selectedLetter.situation}</p>
                {mockHintsLocked ? (
                  <p style={{ ...styles.helperText, marginTop: 6 }}>
                    Checklist and hints unlock once the timer reaches 00:00.
                  </p>
                ) : (
                  <>
                    <h4 style={styles.resultHeading}>Checklist</h4>
                    <ul style={styles.checklist}>
                      {(selectedLetter.whatToInclude || []).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            )}
            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14 }}>
                  <input
                    type="checkbox"
                    checked={showOutlineHelper}
                    onChange={(event) => setShowOutlineHelper(event.target.checked)}
                    disabled={mockHintsLocked}
                  />
                  Show outline helper
                </label>
                {mockHintsLocked ? (
                  <span style={{ ...styles.badge, background: "#fee2e2", color: "#991b1b" }}>
                    Outline hidden during mock exam timer
                  </span>
                ) : null}
              </div>
              <label style={styles.label}>Your draft</label>
              <textarea
                style={styles.textArea}
                placeholder="Write your letter here while the timer is running..."
                value={practiceDraft}
                onChange={(e) => setPracticeDraft(e.target.value)}
                rows={7}
              />
              {!mockHintsLocked && showOutlineHelper ? (
                <div style={{ ...styles.helperCard, marginTop: 10 }}>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>Outline helper</div>
                  <div style={{ display: "grid", gap: 8 }}>
                    {(selectedLetter?.whatToInclude?.length
                      ? selectedLetter.whatToInclude.map((point) => ({
                          title: "Bullet point",
                          hint: point,
                        }))
                      : DEFAULT_OUTLINE
                    ).map((step, index) => (
                      <div key={`${step.title}-${index}`} style={styles.outlineStep}>
                        <div style={{ fontWeight: 700 }}>{step.title}</div>
                        <div style={styles.helperText}>{step.hint}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              <p style={styles.helperText}>
                Words: {practiceWordCount} · Characters: {practiceDraft.length}
                {!mockHintsLocked && wordTarget ? ` · Target: ${wordTarget}` : ""}
              </p>
              {!mockHintsLocked ? <WordCountMeter count={practiceWordCount} range={wordRange} /> : null}
              <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  style={styles.secondaryButton}
                  onClick={() => handleInsertSnippet(TEMPLATE_SNIPPETS.formal)}
                  disabled={mockHintsLocked}
                >
                  Insert formal snippet
                </button>
                <button
                  style={styles.secondaryButton}
                  onClick={() => handleInsertSnippet(TEMPLATE_SNIPPETS.informal)}
                  disabled={mockHintsLocked}
                >
                  Insert informal snippet
                </button>
              </div>
              <div style={{ marginTop: 10 }}>
                <button
                  style={styles.secondaryButton}
                  onClick={sendPracticeDraftToMarkTab}
                  disabled={!practiceDraft.trim()}
                >
                  Send practice draft to “Mark my letter”
                </button>
              </div>
            </div>
          </section>

          <section style={styles.card}>
            <h3 style={styles.sectionTitle}>Letters from the practice set</h3>
            <div style={styles.filterPanel}>
              <div style={{ fontWeight: 700 }}>Prompt filters</div>
              <div style={styles.filterRow}>
                <label style={styles.label}>
                  Topic/theme
                  <select
                    style={styles.select}
                    value={promptFilters.theme}
                    onChange={(event) =>
                      setPromptFilters((prev) => ({ ...prev, theme: event.target.value }))
                    }
                  >
                    <option value="all">All themes</option>
                    {taskFilterOptions.themes.map((theme) => (
                      <option key={theme} value={theme}>
                        {theme}
                      </option>
                    ))}
                  </select>
                </label>
                <label style={styles.label}>
                  Type
                  <select
                    style={styles.select}
                    value={promptFilters.type}
                    onChange={(event) =>
                      setPromptFilters((prev) => ({ ...prev, type: event.target.value }))
                    }
                  >
                    <option value="all">All types</option>
                    {taskFilterOptions.types.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>
                <label style={styles.label}>
                  Formality
                  <select
                    style={styles.select}
                    value={promptFilters.formality}
                    onChange={(event) =>
                      setPromptFilters((prev) => ({ ...prev, formality: event.target.value }))
                    }
                  >
                    <option value="all">All formalities</option>
                    {taskFilterOptions.formalities.map((formality) => (
                      <option key={formality} value={formality}>
                        {formality}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  style={styles.secondaryButton}
                  onClick={() => setPromptFilters({ theme: "all", type: "all", formality: "all" })}
                >
                  Clear filters
                </button>
                <span style={styles.helperText}>
                  Showing {filteredWritingTasks.length} prompts
                </span>
              </div>
            </div>
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
            ) : filteredWritingTasks.length === 0 ? (
              <p style={styles.helperText}>
                No prompts match the selected filters. Try clearing one filter.
              </p>
            ) : (
              <div style={styles.gridTwo}>
                {filteredWritingTasks.map((item) => {
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
              Paste your finished letter in one box. Herr Felix will score it with the new rubric and highlight what to fix.
            </p>
            <div style={styles.infoBox}>
              <strong>3-step workflow:</strong>
              <ol style={styles.promptList}>
                <li>Paste draft</li>
                <li>Read 2 corrections</li>
                <li>Rewrite 1 paragraph</li>
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
              <h4 style={styles.resultHeading}>Final draft rubric checklist</h4>
              <div style={{ display: "grid", gap: 8 }}>
                {[
                  { key: "task", label: "Task completion: all bullet points answered" },
                  { key: "coherence", label: "Coherence: logical order + connectors" },
                  { key: "grammar", label: "Grammar & spelling: quick proofread done" },
                ].map((item) => (
                  <label key={item.key} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="checkbox"
                      checked={rubricChecklist[item.key]}
                      onChange={() =>
                        setRubricChecklist((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
                      }
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
              <details style={{ marginTop: 10 }}>
                <summary style={{ cursor: "pointer", fontWeight: 700 }}>
                  See rubric examples for {level}
                </summary>
                <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
                  <div style={styles.outlineStep}>
                    <strong>Good:</strong> {RUBRIC_EXAMPLES[level]?.good}
                  </div>
                  <div style={styles.outlineStep}>
                    <strong>Excellent:</strong> {RUBRIC_EXAMPLES[level]?.excellent}
                  </div>
                </div>
              </details>
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
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
                    {tutorSaveState.loading ? "Saving for tutor..." : "Save for tutor review"}
                  </button>
                ) : null}
              </div>
              {isExamMode ? (
                <div style={{ display: "grid", gap: 6 }}>
                  <p style={styles.helperText}>
                    Exam room only: save this marked letter so your tutor can review it after AI feedback.
                  </p>
                  {!tutorReviewCloudEnabled ? (
                    <p style={{ ...styles.helperText, color: "#b45309", margin: "0" }}>
                      Firebase is not configured in this environment, so tutor responses cannot be synced yet.
                    </p>
                  ) : null}
                  <div style={styles.helperCard}>
                    <div style={{ fontWeight: 700 }}>
                      Tutor review status: {formatTutorReviewStatus(latestTutorReview?.reviewStatus)}
                    </div>
                    {latestTutorReview?.tutorFeedback ? (
                      <p style={{ ...styles.helperText, margin: "4px 0 0" }}>{latestTutorReview.tutorFeedback}</p>
                    ) : (
                      <p style={{ ...styles.helperText, margin: "4px 0 0" }}>
                        Tutor feedback appears here after they respond with approval or improvement notes.
                      </p>
                    )}
                  </div>
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
                <button style={{ ...styles.primaryButton, marginTop: 8 }} onClick={handleCompleteWorkflow}>Complete</button>
                {workflowComplete ? <div style={{ ...styles.successBox, marginTop: 8 }}>Workflow complete. Great revision discipline.</div> : null}
              </div>
            ) : null}

            {error && (
              <div style={styles.errorBox}>
                <strong>Note:</strong> {error}
              </div>
            )}
          </section>

          {markFeedback && (
            <>
              <section style={styles.card}>
                <h3 style={styles.sectionTitle}>Rubric scoring breakdown</h3>
                <div style={{ display: "grid", gap: 10 }}>
                  {rubricBreakdown.map((item) => (
                    <div key={item.key} style={styles.scoreCard}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <strong>{item.label}</strong>
                        <span style={styles.scoreBadge}>
                          {item.score ? `${item.score}/5` : "—"}
                        </span>
                      </div>
                      <div style={styles.helperText}>{item.explanation}</div>
                    </div>
                  ))}
                </div>
              </section>
              <section style={styles.card}>
                <h3 style={styles.sectionTitle}>AI feedback</h3>
                <pre style={{ ...styles.pre, whiteSpace: "pre-wrap" }}>{markFeedback}</pre>
              </section>
            </>
          )}

          {draftHistory.length >= 2 && (
            <section style={styles.card}>
              <h3 style={styles.sectionTitle}>Compare drafts</h3>
              <p style={styles.helperText}>
                Review the last two submissions to see improvements before your next attempt.
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
            </section>
          )}

          {(errorBank.length > 0 || revisionTasks.length > 0) && (
            <section style={styles.card}>
              <h3 style={styles.sectionTitle}>Error bank & quick fixes</h3>
              {errorBank.length > 0 ? (
                <ul style={styles.checklist}>
                  {errorBank.map((item, index) => (
                    <li key={`${item}-${index}`}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p style={styles.helperText}>No recurring errors flagged yet.</p>
              )}
              {revisionTasks.length > 0 ? (
                <>
                  <div style={{ fontWeight: 700, marginTop: 10 }}>Quick revision tasks</div>
                  <ul style={styles.checklist}>
                    {revisionTasks.map((task) => (
                      <li key={task}>{task}</li>
                    ))}
                  </ul>
                </>
              ) : null}
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
          <div style={{ ...styles.helperCard, marginTop: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Plan before you write</div>
            <p style={styles.helperText}>
              Generate a quick outline from the prompt, then expand each bullet before sending to the coach.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                style={styles.secondaryButton}
                onClick={() =>
                  setPlanOutline(buildPlanOutline({ selectedLetter, ideaInput }))
                }
              >
                Generate outline
              </button>
              <button
                style={styles.secondaryButton}
                onClick={() => setPlanOutline([])}
                disabled={!planOutline.length}
              >
                Clear outline
              </button>
            </div>
            {planOutline.length > 0 && (
              <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
                {planOutline.map((step, index) => (
                  <div key={`${step.title}-${index}`} style={styles.outlineStep}>
                    <div style={{ fontWeight: 700 }}>{step.title}</div>
                    <div style={styles.helperText}>{step.hint}</div>
                    <textarea
                      style={{ ...styles.textareaSmall, marginTop: 6 }}
                      rows={2}
                      placeholder="Expand this bullet with your own sentence."
                      value={step.draft || ""}
                      onChange={(event) =>
                        setPlanOutline((prev) =>
                          prev.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, draft: event.target.value } : item
                          )
                        )
                      }
                    />
                  </div>
                ))}
                <button
                  style={styles.primaryButton}
                  onClick={() => {
                    const compiled = planOutline
                      .map((step) => `- ${step.draft || step.hint}`)
                      .join("\n");
                    setIdeaInput((prev) => `${prev}${prev.trim() ? "\n\n" : ""}${compiled}`);
                  }}
                >
                  Add outline to prompt
                </button>
              </div>
            )}
          </div>
          <div style={styles.chatLog} className="idea-generator-chat">
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
                  {msg.role === "assistant" ? "Coach" : "You"}
                </strong>
                <span>{msg.content}</span>
              </div>
            ))}
          </div>
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
                <div
                  style={{
                    border: "1px dashed #d1d5db",
                    borderRadius: 10,
                    padding: 10,
                    minHeight: 80,
                    background: "#f8fafc",
                    whiteSpace: "pre-wrap",
                  }}
                  className="idea-generator-preview"
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
    </>
  );
};

export default WritingPage;
