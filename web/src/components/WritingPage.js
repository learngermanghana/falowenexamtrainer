import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { styles } from "../styles";
import { useExam, ALLOWED_LEVELS } from "../context/ExamContext";
import ResultHistory from "./ResultHistory";
import { fetchIdeasFromCoach, fetchWritingLetters, markLetterWithAI } from "../services/coachService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { writingLetters as courseWritingLetters } from "../data/writingLetters";
import { WRITING_PROMPTS } from "../data/writingExamPrompts";
import { loadWritingProgress, saveWritingProgress } from "../services/writingProgressService";
import {
  isTutorReviewCloudEnabled,
  subscribeTutorReviewsForStudent,
  saveExamLetterForTutorReview,
  saveStudentReplyToTutorReview,
} from "../services/tutorReviewService";
import { triggerInteractionFeedback } from "../services/interactionFeedback";
import WritingFeedbackCard from "./WritingFeedbackCard";
import WritingHistorySection, { buildWritingHistoryRecord } from "./WritingHistorySection";
import WritingReferenceLibrary from "./WritingReferenceLibrary";
import { makeReferenceId, normalizeReferenceNotes } from "../lib/writingReferenceLibrary";

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
  A1: "20–50 words",
  A2: "50–80 words",
  B1: "80–120 words",
  B2: "120–180 words",
  C1: "180–220 words",
};

const WORD_TARGET_RANGES = {
  A1: { min: 20, max: 50 },
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
const GERMAN_SPECIAL_CHARACTERS = ["ä", "ö", "ü", "ß", "Ä", "Ö", "Ü"];

const IMPORTANT_PHRASE_COLORS = ["#1d4ed8", "#7c3aed", "#be123c", "#0f766e", "#b45309"];

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

const SpecialCharacterRow = ({ onInsert, label = "Quick umlaut keys" }) => (
  <div style={{ marginTop: 8 }}>
    <div style={{ ...styles.helperText, margin: "0 0 6px 0" }}>{label}</div>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {GERMAN_SPECIAL_CHARACTERS.map((character) => (
        <button
          key={character}
          type="button"
          style={{ ...styles.chipButton, minWidth: 44, textAlign: "center" }}
          onClick={() => onInsert(character)}
        >
          {character}
        </button>
      ))}
    </div>
  </div>
);

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
  const { showToast } = useToast();
  const userId = user?.uid;
  const studentCode =
    studentProfile?.studentCode || studentProfile?.studentcode || user?.uid || "";
  const isExamMode = mode === "exam";
  const isCourseMode = mode === "course";
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
  const [selectedDraftIds, setSelectedDraftIds] = useState([]);
  const [hiddenDraftIds, setHiddenDraftIds] = useState([]);
  const [editableDraftById, setEditableDraftById] = useState({});
  const [ideaDraftWorkspace, setIdeaDraftWorkspace] = useState("");
  const [referenceTopicInput, setReferenceTopicInput] = useState("");
  const [referenceBodyInput, setReferenceBodyInput] = useState("");
  const [referenceNotes, setReferenceNotes] = useState([]);
  const [editingReferenceNoteId, setEditingReferenceNoteId] = useState(null);
  const [referenceEditTopicInput, setReferenceEditTopicInput] = useState("");
  const [referenceEditBodyInput, setReferenceEditBodyInput] = useState("");
  const [selectedReferenceNoteId, setSelectedReferenceNoteId] = useState("");
  const [referenceSearch, setReferenceSearch] = useState("");
  const [ideasLoading, setIdeasLoading] = useState(false);
  const [ideaError, setIdeaError] = useState("");
  const [ideaSuccess, setIdeaSuccess] = useState("");
  const [markFeedback, setMarkFeedback] = useState("");
  const [markRubric, setMarkRubric] = useState(null);
  const [markCorrections, setMarkCorrections] = useState([]);
  const [markSimpleFeedback, setMarkSimpleFeedback] = useState(null);
  const [markStructuredFeedback, setMarkStructuredFeedback] = useState(null);
  const [feedbackTrend, setFeedbackTrend] = useState(null);
  const [firstDraftSnapshot, setFirstDraftSnapshot] = useState("");
  const [reflectionText, setReflectionText] = useState("");
  const [revisedDraftText, setRevisedDraftText] = useState("");
  const [workflowComplete, setWorkflowComplete] = useState(false);
  const [improvedFeedback, setImprovedFeedback] = useState("");
  const [improvedRubric, setImprovedRubric] = useState(null);
  const [improvedCorrections, setImprovedCorrections] = useState([]);
  const [improvedSimpleFeedback, setImprovedSimpleFeedback] = useState(null);
  const [improvedStructuredFeedback, setImprovedStructuredFeedback] = useState(null);
  const [improvedLoading, setImprovedLoading] = useState(false);
  const [tutorSaveState, setTutorSaveState] = useState({ loading: false, success: "", error: "" });
  const [tutorReviews, setTutorReviews] = useState([]);
  const [selectedTutorReviewId, setSelectedTutorReviewId] = useState("");
  const [studentReplyText, setStudentReplyText] = useState("");
  const [studentReplyState, setStudentReplyState] = useState({ loading: false, success: "", error: "" });
  const latestTutorReview = useMemo(
    () => tutorReviews.find((review) => review.id === selectedTutorReviewId) || tutorReviews[0] || null,
    [selectedTutorReviewId, tutorReviews]
  );
  const [rubricBreakdown, setRubricBreakdown] = useState(() =>
    buildRubricBreakdown("")
  );
  const [draftHistory, setDraftHistory] = useState([]);
  const [writingHistory, setWritingHistory] = useState([]);
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
  const pinnedIdeaQuestion = useMemo(() => {
    const firstUserMessage = chatMessages.find((message) => message.role === "user");
    return firstUserMessage?.content || "";
  }, [chatMessages]);

  const normalizedReferenceSearch = referenceSearch.trim().toLowerCase();
  const filteredReferenceNotes = useMemo(
    () =>
      referenceNotes.filter((note) => {
        if (!normalizedReferenceSearch) return true;
        return `${note.topic} ${note.body}`.toLowerCase().includes(normalizedReferenceSearch);
      }),
    [normalizedReferenceSearch, referenceNotes]
  );
  const selectedReferenceNote = useMemo(
    () =>
      referenceNotes.find((note) => note.id === selectedReferenceNoteId) ||
      filteredReferenceNotes[0] ||
      referenceNotes[0] ||
      null,
    [filteredReferenceNotes, referenceNotes, selectedReferenceNoteId]
  );
  const [remainingSeconds, setRemainingSeconds] = useState(
    (selectedLetter?.durationMinutes || 0) * 60
  );
  const [timerRunning, setTimerRunning] = useState(false);
  const chatLogRef = useRef(null);
  const markDraftRef = useRef(null);
  const ideasPromptRef = useRef(null);
  const ideasWorkspaceRef = useRef(null);
  const referencesRef = useRef(null);

  const insertSpecialCharacter = useCallback((setter, fieldRef, character) => {
    setter((previousValue) => {
      const currentValue = String(previousValue || "");
      const inputElement = fieldRef?.current;
      const hasCursor = inputElement && typeof inputElement.selectionStart === "number";

      if (!hasCursor) return `${currentValue}${character}`;

      const start = inputElement.selectionStart;
      const end = inputElement.selectionEnd;
      return `${currentValue.slice(0, start)}${character}${currentValue.slice(end)}`;
    });

    window.requestAnimationFrame(() => {
      const inputElement = fieldRef?.current;
      if (!inputElement) return;
      const start = typeof inputElement.selectionStart === "number" ? inputElement.selectionStart : inputElement.value.length;
      const end = typeof inputElement.selectionEnd === "number" ? inputElement.selectionEnd : inputElement.value.length;
      const cursorPosition = Math.max(start, end) + character.length;
      inputElement.focus();
      inputElement.setSelectionRange(cursorPosition, cursorPosition);
    });
  }, []);
  const resetWritingWorkspace = useCallback(() => {
    setTypedAnswer("");
    setMarkFeedback("");
    setMarkRubric(null);
    setMarkCorrections([]);
    setMarkSimpleFeedback(null);
    setMarkStructuredFeedback(null);
    setFeedbackTrend(null);
    setFirstDraftSnapshot("");
    setReflectionText("");
    setRevisedDraftText("");
    setWorkflowComplete(false);
    setImprovedFeedback("");
    setImprovedRubric(null);
    setImprovedCorrections([]);
    setImprovedSimpleFeedback(null);
    setImprovedStructuredFeedback(null);
    setImprovedLoading(false);
    setIdeaInput("");
    setChatMessages([IDEA_COACH_INTRO]);
    setHasUnreadCoachReply(false);
    setIsChatOverflowing(false);
    setIsChatScrolled(false);
    setHasHiddenNewerMessages(false);
    setSelectedDraftIds([]);
    setHiddenDraftIds([]);
    setEditableDraftById({});
    setIdeaDraftWorkspace("");
    setReferenceTopicInput("");
    setReferenceBodyInput("");
    setReferenceNotes([]);
    setEditingReferenceNoteId(null);
    setReferenceEditTopicInput("");
    setReferenceEditBodyInput("");
    setSelectedReferenceNoteId("");
    setReferenceSearch("");
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
  // Idea support now lives in Study Buddy so the writing room can stay focused.
  const canUseIdeasGenerator = false;
  const canUsePracticeLetters = isExamMode;
  const canUseFormsPractice = isExamMode && level === "A1";
  const canUseTutorFeedback = isExamMode;
  const isTutorOnlyView = initialTab === "tutor" && canUseTutorFeedback;
  const [revealedFormAnswers, setRevealedFormAnswers] = useState({});
  const availableTabs = useMemo(() => {
    const tabs = [{ key: "mark", label: isCourseMode ? "Analyse my text" : "Mark my letter" }];
    tabs.push({ key: "references", label: "References (notes)" });

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
  }, [canUseFormsPractice, canUsePracticeLetters, canUseTutorFeedback, isCourseMode]);
  const visibleTabs = useMemo(() => {
    if (!isTutorOnlyView) {
      return availableTabs;
    }

    const tutorTabs = availableTabs.filter((tab) => tab.key === "tutor");
    return tutorTabs.length ? tutorTabs : availableTabs;
  }, [availableTabs, isTutorOnlyView]);

  useEffect(() => {
    if (availableTabs.some((tab) => tab.key === initialTab)) {
      setActiveTab(initialTab);
    }
  }, [availableTabs, initialTab]);
  const progressMode = isExamMode ? "exam" : "course";
  const alternateProgressMode = progressMode === "exam" ? "course" : "exam";
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
        const [saved, alternateSaved] = await Promise.all([
          loadWritingProgress({ userId, studentCode, mode: progressMode }),
          loadWritingProgress({ userId, studentCode, mode: alternateProgressMode }),
        ]);
        if (!isMounted) return;

        if (!saved) {
          resetWritingWorkspace();
          return;
        }

        if (typeof saved.typedAnswer === "string") setTypedAnswer(saved.typedAnswer);
        if (typeof saved.markFeedback === "string") setMarkFeedback(saved.markFeedback);
        if (saved.markStructuredFeedback && typeof saved.markStructuredFeedback === "object") setMarkStructuredFeedback(saved.markStructuredFeedback);
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
        if (Array.isArray(saved.hiddenDraftIds)) {
          setHiddenDraftIds(saved.hiddenDraftIds);
        } else {
          setHiddenDraftIds([]);
        }
        if (saved.editableDraftById && typeof saved.editableDraftById === "object") {
          setEditableDraftById(saved.editableDraftById);
        } else {
          setEditableDraftById({});
        }
        if (typeof saved.ideaDraftWorkspace === "string") setIdeaDraftWorkspace(saved.ideaDraftWorkspace);
        if (typeof saved.referenceTopicInput === "string") setReferenceTopicInput(saved.referenceTopicInput);
        if (typeof saved.referenceBodyInput === "string") setReferenceBodyInput(saved.referenceBodyInput);
        if (typeof saved.referenceInput === "string") setReferenceBodyInput(saved.referenceInput);
        const currentModeNotes = normalizeReferenceNotes(saved.referenceNotes);
        const alternateModeNotes = normalizeReferenceNotes(alternateSaved?.referenceNotes);
        const mergedReferenceNotes = [...currentModeNotes, ...alternateModeNotes].filter(
          (note, index, list) =>
            list.findIndex((candidate) => candidate.topic.toLowerCase() === note.topic.toLowerCase()) === index
        );
        setReferenceNotes(mergedReferenceNotes);
        if (
          typeof saved.selectedReferenceNoteId === "string" &&
          mergedReferenceNotes.some((item) => item.id === saved.selectedReferenceNoteId)
        ) {
          setSelectedReferenceNoteId(saved.selectedReferenceNoteId);
        } else {
          setSelectedReferenceNoteId(mergedReferenceNotes[0]?.id || "");
        }
        if (typeof saved.referenceSearch === "string") setReferenceSearch(saved.referenceSearch);
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
        if (Array.isArray(saved.writingHistory)) {
          setWritingHistory(saved.writingHistory);
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
  }, [alternateProgressMode, progressMode, resetWritingWorkspace, studentCode, userId]);

  useEffect(() => {
    if (!progressLoaded || (!userId && !studentCode)) return;

    const timeout = setTimeout(() => {
      const progressPayload = {
        userId,
        studentCode,
        mode: progressMode,
        data: {
          typedAnswer,
          markFeedback,
          markStructuredFeedback,
          firstDraftSnapshot,
          reflectionText,
          revisedDraftText,
          workflowComplete,
          ideaInput,
          chatMessages,
          selectedDraftIds,
          hiddenDraftIds,
          editableDraftById,
          ideaDraftWorkspace,
          referenceTopicInput,
          referenceBodyInput,
          referenceNotes,
          selectedReferenceNoteId,
          referenceSearch,
          remainingSeconds,
          timerRunning,
          rubricBreakdown,
          draftHistory,
          writingHistory,
          completionLog,
          errorBank,
        },
      };

      saveWritingProgress(progressPayload).catch((err) => {
        console.error("Failed to save writing progress", err);
      });

      saveWritingProgress({
        userId,
        studentCode,
        mode: alternateProgressMode,
        data: {
          referenceNotes,
          selectedReferenceNoteId,
          referenceSearch,
        },
      }).catch((err) => {
        console.error("Failed to sync reference notes across writing modes", err);
      });
    }, 800);

    return () => clearTimeout(timeout);
  }, [
    chatMessages,
    completionLog,
    draftHistory,
    writingHistory,
    errorBank,
    editableDraftById,
    ideaDraftWorkspace,
    referenceTopicInput,
    referenceBodyInput,
    referenceNotes,
    selectedReferenceNoteId,
    referenceSearch,
    firstDraftSnapshot,
    ideaInput,
    markFeedback,
    markStructuredFeedback,
    reflectionText,
    revisedDraftText,
    progressLoaded,
    alternateProgressMode,
    progressMode,
    remainingSeconds,
    rubricBreakdown,
    selectedDraftIds,
    hiddenDraftIds,
    timerRunning,
    typedAnswer,
    workflowComplete,
    userId,
    studentCode,
  ]);

  const addReferenceNote = () => {
    const topic = referenceTopicInput.trim().replace(/\s+/g, " ");
    const body = referenceBodyInput.trim();

    if (!topic || !body) {
      setIdeaError("Add both a topic and body before saving your reference.");
      setIdeaSuccess("");
      return;
    }

    const alreadyExists = referenceNotes.some((note) => note.topic.toLowerCase() === topic.toLowerCase());
    if (alreadyExists) {
      setIdeaSuccess("That topic is already saved in your references.");
      setIdeaError("");
      return;
    }

    const newReference = {
      id: makeReferenceId(),
      topic,
      body,
      createdAt: new Date().toISOString(),
    };

    setReferenceNotes((prev) => [newReference, ...prev]);
    setSelectedReferenceNoteId(newReference.id);
    setReferenceTopicInput("");
    setReferenceBodyInput("");
    setIdeaError("");
    setIdeaSuccess("Reference saved. Open the topic to study the body on its own page.");
  };

  const startEditingReferenceNote = (note) => {
    setEditingReferenceNoteId(note.id);
    setReferenceEditTopicInput(note.topic);
    setReferenceEditBodyInput(note.body);
    setIdeaError("");
    setIdeaSuccess("");
  };

  const cancelEditingReferenceNote = () => {
    setEditingReferenceNoteId(null);
    setReferenceEditTopicInput("");
    setReferenceEditBodyInput("");
    setIdeaError("");
  };

  const saveEditedReferenceNote = (originalNote) => {
    const topic = referenceEditTopicInput.trim().replace(/\s+/g, " ");
    const body = referenceEditBodyInput.trim();

    if (!topic || !body) {
      setIdeaError("Reference topics and bodies cannot be empty.");
      setIdeaSuccess("");
      return;
    }

    const alreadyExists = referenceNotes.some(
      (note) => note.id !== originalNote.id && note.topic.toLowerCase() === topic.toLowerCase()
    );

    if (alreadyExists) {
      setIdeaError("That topic is already saved in your references.");
      setIdeaSuccess("");
      return;
    }

    setReferenceNotes((prev) =>
      prev.map((note) =>
        note.id === originalNote.id
          ? {
              ...note,
              topic,
              body,
              updatedAt: new Date().toISOString(),
            }
          : note
      )
    );
    setSelectedReferenceNoteId(originalNote.id);
    setEditingReferenceNoteId(null);
    setReferenceEditTopicInput("");
    setReferenceEditBodyInput("");
    setIdeaSuccess("Reference updated.");
    setIdeaError("");
  };

  const removeReferenceNote = (noteToRemove) => {
    setReferenceNotes((prev) => {
      const remaining = prev.filter((note) => note.id !== noteToRemove.id);
      if (selectedReferenceNoteId === noteToRemove.id) {
        setSelectedReferenceNoteId(remaining[0]?.id || "");
      }
      return remaining;
    });
    if (editingReferenceNoteId === noteToRemove.id) {
      cancelEditingReferenceNote();
    }
  };

  const addReferenceToLetter = (note) => {
    setTypedAnswer((prev) => `${prev}${prev ? "\n" : ""}${note.body}`);
    setIdeaSuccess(`Added “${note.topic}” to your letter draft.`);
    setIdeaError("");
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

  const getTutorStatusMeta = useCallback((status) => {
    if (status === "approved") {
      return {
        label: "Approved",
        icon: "✓",
        accent: "#16a34a",
        soft: "#dcfce7",
      };
    }
    if (status === "needs_improvement") {
      return {
        label: "Needs revision",
        icon: "!",
        accent: "#f97316",
        soft: "#ffedd5",
      };
    }
    return {
      label: "Pending",
      icon: "◷",
      accent: "#ca8a04",
      soft: "#fef9c3",
    };
  }, []);

  const tutorStatusStats = useMemo(() => {
    const stats = { approved: 0, pending: 0, needsRevision: 0 };
    tutorReviews.forEach((review) => {
      if (review?.reviewStatus === "approved") stats.approved += 1;
      else if (review?.reviewStatus === "needs_improvement") stats.needsRevision += 1;
      else stats.pending += 1;
    });
    return stats;
  }, [tutorReviews]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  useEffect(() => {
    if (!isExamMode || !userId) {
      setTutorReviews([]);
      setSelectedTutorReviewId("");
      return;
    }

    const unsubscribe = subscribeTutorReviewsForStudent(
      { userId, studentCode },
      (reviews) => {
        setTutorReviews(reviews);
        setSelectedTutorReviewId((current) => {
          if (current && reviews.some((review) => review.id === current)) return current;
          return reviews[0]?.id || "";
        });
      },
      (error) => {
        console.error("Failed to subscribe to tutor reviews", error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [isExamMode, studentCode, userId]);

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
      triggerInteractionFeedback({
        sound: "success",
        toastMessage: "Reply sent to tutor.",
        toastVariant: "success",
        showToast,
        notificationTitle: "Tutor reply sent",
        notificationBody: "Your message was sent from Writing tab.",
        notificationTag: "writing-reply-sent",
        vibratePattern: [60, 30, 60],
      });
      setTutorReviews((prev) =>
        prev.map((review) => {
          if (review.id !== latestTutorReview.id) return review;
          return {
            ...review,
            studentReplies: [
              ...(review.studentReplies || []),
              {
                message,
                studentName: studentProfile?.name || user?.displayName || "",
                studentCode,
                createdAt: new Date().toISOString(),
              },
            ],
          };
        })
      );
    } catch (err) {
      setStudentReplyState({
        loading: false,
        success: "",
        error: err?.message || "Could not send your reply right now.",
      });
      triggerInteractionFeedback({
        sound: "error",
        toastMessage: "Could not send your tutor reply.",
        toastVariant: "error",
        showToast,
        vibratePattern: [120],
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
    setMarkRubric(null);
    setMarkCorrections([]);
    setMarkSimpleFeedback(null);
    setMarkStructuredFeedback(null);
    setFeedbackTrend(null);

    try {
      const studentName = user?.displayName || user?.email || "Student";
      const data = await markLetterWithAI({
        text: trimmed,
        level,
        studentName,
        idToken,
        program: studentProfile?.program,
        submissionContext: isExamMode ? "exam-room" : "course",
        promptType: derivePromptMeta(selectedLetter || {}).type || "letter",
      });
      const breakdown = data?.rubric
        ? [
            { key: "task", label: "Task completion", score: Number(data.rubric.task || 0), explanation: "Backend rubric" },
            { key: "coherence", label: "Coherence", score: Number(data.rubric.coherence || 0), explanation: "Backend rubric" },
            { key: "grammar", label: "Grammar & accuracy", score: Number(data.rubric.grammar || 0), explanation: "Backend rubric" },
          ]
        : buildRubricBreakdown(data.feedback);
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
      setImprovedRubric(null);
      setImprovedCorrections([]);
      setImprovedSimpleFeedback(null);
      setImprovedStructuredFeedback(null);
      setRubricBreakdown(breakdown);
      setErrorBank(extractErrorBank(data.feedback));
      setMarkRubric(data?.rubric || null);
      setMarkCorrections(Array.isArray(data?.corrections) ? data.corrections : []);
      setMarkSimpleFeedback(data?.simplifiedFeedback || null);
      setMarkStructuredFeedback(data?.structuredFeedback || data || null);
      setFeedbackTrend(data?.trend || null);
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
      setWritingHistory((prev) => [
        ...prev,
        buildWritingHistoryRecord({
          userId,
          studentCode,
          level,
          workbookId: isCourseMode ? "course-writing" : "exam-writing",
          taskId: selectedLetterId || "custom",
          taskTitle: selectedLetter?.letter || selectedLetter?.title || "Custom prompt",
          text: trimmed,
          data: { ...data, score: data?.score ?? overallScore, maxScore: data?.maxScore ?? 12 },
          context: isExamMode ? "exam-room" : "course",
        }),
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

  const handleRetryMarking = () => {
    setMarkFeedback("");
    setMarkRubric(null);
    setMarkCorrections([]);
    setMarkSimpleFeedback(null);
    setMarkStructuredFeedback(null);
    setFeedbackTrend(null);
    setImprovedFeedback("");
    setError("");
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
        promptType: derivePromptMeta(selectedLetter || {}).type || "letter",
      });
      setImprovedFeedback(data.feedback);
      setImprovedRubric(data?.rubric || null);
      setImprovedCorrections(Array.isArray(data?.corrections) ? data.corrections : []);
      setImprovedSimpleFeedback(data?.simplifiedFeedback || null);
      setImprovedStructuredFeedback(data?.structuredFeedback || data || null);
      setFeedbackTrend(data?.trend || null);
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

  const renderImportantPhraseLine = (line) => {
    const importantPattern = /^(?:[-•\d.)\s]*)?(important phrases?|key phrases?)\s*:\s*(.*)$/i;
    const matches = line.match(importantPattern);
    if (!matches) return line;

    const label = matches[1];
    const rawPhrases = matches[2] || "";
    const phrases = rawPhrases
      .split(/[,;\n]/)
      .map((item) => item.trim())
      .filter(Boolean);

    if (!phrases.length) {
      return <strong>{line}</strong>;
    }

    return (
      <>
        <strong style={{ color: "#111827" }}>{label}: </strong>
        {phrases.map((phrase, index) => (
          <span
            key={`${phrase}-${index}`}
            style={{
              display: "inline-block",
              marginRight: 6,
              marginBottom: 6,
              padding: "2px 8px",
              borderRadius: 999,
              background: "#f3f4f6",
              color: IMPORTANT_PHRASE_COLORS[index % IMPORTANT_PHRASE_COLORS.length],
              fontWeight: 800,
            }}
          >
            {phrase}
          </span>
        ))}
      </>
    );
  };

  const renderCoachMessage = (content) => {
    const message = String(content || "");
    const lines = message.split("\n");

    return lines.map((line, index) => {
      const lineKey = `line-${index}`;
      const renderedLine = renderImportantPhraseLine(line);
      return (
        <React.Fragment key={lineKey}>
          <span>{renderedLine}</span>
          {index < lines.length - 1 ? <br /> : null}
        </React.Fragment>
      );
    });
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


  const sendDraftsToMarkTab = () => {
    const combinedDraft = ideaDraftWorkspace.trim();

    if (!combinedDraft) {
      setIdeaError(
        "Add text to the workspace before sending it for marking."
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
    setMarkRubric(null);
    setMarkCorrections([]);
    setMarkSimpleFeedback(null);
    setMarkStructuredFeedback(null);
    setFeedbackTrend(null);
    setIdeaSuccess("Your workspace draft is now pasted into the “Mark my letter” tab.");
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

  const toggleFormAnswers = (taskId) => {
    setRevealedFormAnswers((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const resetFormAnswers = () => {
    setRevealedFormAnswers({});
  };

  const handleAskCoach = async () => {
    const trimmed = ideaInput.trim();
    if (!trimmed || ideasLoading) return;

    setIdeaError("");
    setIdeaSuccess("");
    const userMessage = makeChatMessage("user", trimmed);
    const updatedMessages = [...chatMessages, userMessage];
    setChatMessages(updatedMessages);
    setIdeaDraftWorkspace((prev) => {
      const existing = prev.trim();
      const next = userMessage.content.trim();
      if (!next) return existing;
      return [existing, next].filter(Boolean).join("\n\n");
    });
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
      triggerInteractionFeedback({
        sound: "open",
        toastMessage: "Writing coach replied.",
        toastVariant: "success",
        showToast,
        notificationTitle: "Writing coach response",
        notificationBody: "New feedback is available in your writing chat.",
        notificationTag: "writing-coach-reply",
        vibratePattern: [45],
      });
    } catch (err) {
      console.error("Ideas generator error:", err);
      const msg =
        err?.response?.data?.error ||
        err.message ||
        "Could not fetch ideas from Herr Felix.";
      setIdeaError(msg);
      triggerInteractionFeedback({
        sound: "error",
        toastMessage: "Writing coach is unavailable right now.",
        toastVariant: "error",
        showToast,
        vibratePattern: [120],
      });
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
            : isCourseMode
              ? "Writing – Build first, then finish"
              : "Writing – Practice exam letters"}
        </h2>
        <p style={styles.helperText}>
          {isTutorOnlyView
            ? "View tutor comments and reply from here."
            : isCourseMode
              ? "For Days 1–19, build consistency by writing and analysing one section at a time. From Day 20, write and mark one complete essay."
              : "Write one complete exam response, get feedback, improve one section, then save the version for your tutor."}
        </p>
        <div style={{ ...styles.helperCard, marginTop: 10 }}>
          <p style={{ ...styles.helperText, margin: 0 }}>
            {isTutorOnlyView
              ? "Tutor updates only."
              : isCourseMode
                ? (
                  <>
                    Course-book mode is for short, level-based text analysis and references. If you need help understanding
                    a question, ask <strong>Study Buddy</strong>. From Day 20, open the <a href="/exams/writing">Writing exam room</a> to mark a full essay.
                  </>
                )
                : (
                  <>
                    From Day 20, use <strong>Mark my letter</strong> for one complete essay. Use Study Buddy if a question is unclear.
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
        {!isTutorOnlyView && (
          <div style={{ marginTop: 12 }}>
            <button
              style={styles.dangerButton}
              onClick={handleResetWorkspace}
              type="button"
            >
              Reset writing workspace
            </button>
          </div>
        )}
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

      {activeTab === "forms" && canUseFormsPractice && (
        <>
          <section style={styles.card}>
            <h3 style={styles.sectionTitle}>A1 form practice – Teil 1</h3>
            <p style={styles.helperText}>
              Practise reading a short situation and completing a simple German form. Try the blanks first, then reveal the model answers.
            </p>
            <div style={{ marginTop: 12 }}>
              <button
                type="button"
                style={styles.secondaryButton}
                onClick={resetFormAnswers}
                disabled={Object.keys(revealedFormAnswers).length === 0}
              >
                Hide all answers
              </button>
            </div>
          </section>

          <section style={styles.card}>
            <div style={styles.gridTwo}>
              {A1_FORM_PRACTICE_TASKS.map((task) => {
                const answersVisible = Boolean(revealedFormAnswers[task.id]);

                return (
                  <article key={task.id} style={styles.helperCard}>
                    <div style={styles.metaRow}>
                      <h4 style={{ ...styles.resultHeading, margin: 0 }}>{task.title}</h4>
                      <span style={styles.levelPill}>A1 Teil 1</span>
                    </div>
                    <p style={styles.helperText}>{task.context}</p>
                    <p style={{ margin: "8px 0", fontWeight: 700 }}>{task.prompt}</p>

                    <div
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 12,
                        overflow: "hidden",
                        background: "#ffffff",
                      }}
                    >
                      {task.formFields.map((field) => (
                        <div
                          key={`${task.id}-${field.label}`}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "minmax(120px, 0.9fr) minmax(140px, 1.1fr)",
                            gap: 8,
                            padding: "8px 10px",
                            borderBottom: "1px solid #f3f4f6",
                          }}
                        >
                          <strong>{field.label}</strong>
                          <span>{field.value}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      style={{ ...styles.primaryButton, marginTop: 12 }}
                      onClick={() => toggleFormAnswers(task.id)}
                    >
                      {answersVisible ? "Hide answers" : "Reveal answers"}
                    </button>

                    {answersVisible && (
                      <div style={{ ...styles.successBox, marginTop: 12 }}>
                        <strong>Model answers</strong>
                        <ol style={{ margin: "8px 0 0 18px", padding: 0 }}>
                          {task.answers.map((item) => (
                            <li key={`${task.id}-${item.blank}`} style={{ marginBottom: 6 }}>
                              <strong>{item.blank} {item.answer}</strong> – {item.explanation}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        </>
      )}

      {activeTab === "mark" && (
        <>
          <section style={styles.card}>
            <h3 style={styles.sectionTitle}>{isCourseMode ? "Analyse my text" : "Mark my letter"}</h3>
            <p style={styles.helperText}>
              {isCourseMode
                ? "Write the section you built today. AI will analyse it at your level so you can improve without the pressure of finishing a full essay."
                : "From Day 20, write one complete essay, get full feedback, and save one revised version."}
            </p>
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

            <label style={styles.label}>{isCourseMode ? "Your combined section" : "Your complete letter or essay"}</label>
            <textarea
              ref={markDraftRef}
              value={typedAnswer}
              onChange={(e) => {
                setError("");
                setTypedAnswer(e.target.value);
              }}
              placeholder={isCourseMode ? "Combine what you wrote today and paste it here for level-based analysis..." : "Paste your finished letter or essay here for marking..."}
              style={styles.textArea}
              rows={9}
            />
            <SpecialCharacterRow
              onInsert={(character) => insertSpecialCharacter(setTypedAnswer, markDraftRef, character)}
            />
            <p style={styles.helperText}>
              Words: {typedWordCount} · Characters: {typedAnswer.length}
              {WORD_TARGETS[level] ? ` · Target: ${WORD_TARGETS[level]}` : ""}
            </p>
            <WordCountMeter count={typedWordCount} range={typedWordRange} />

            <div style={{ marginTop: 12 }}>
              <div
                className="writing-mark-actions"
                style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
              >
                <button
                  type="button"
                  style={styles.primaryButton}
                  onClick={markFeedback ? handleRetryMarking : sendTypedAnswerForCorrection}
                  disabled={loading}
                >
                  {loading
                    ? "Getting feedback..."
                    : markFeedback
                      ? "Retry"
                      : isCourseMode
                        ? "Analyse my text"
                        : "Get AI feedback"}
                </button>

                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={handleExportDraft}
                  disabled={!typedAnswer.trim()}
                >
                  Export / Print draft
                </button>
              </div>
            </div>


            <WritingHistorySection
              title={isCourseMode ? "Saved Texts" : "Saved Letters"}
              entries={writingHistory}
              level={level}
              onOpen={(entry) => {
                setTypedAnswer(entry.originalLetter || entry.originalText || "");
                setMarkFeedback(entry.feedback || "");
                setMarkRubric(entry.rubricScores || null);
                setMarkCorrections(Array.isArray(entry.corrections) ? entry.corrections : []);
                setMarkStructuredFeedback(entry.structuredFeedback || null);
              }}
            />

            {markFeedback ? (
              <div style={{ marginTop: 16 }}>
                <WritingFeedbackCard
                  feedback={markFeedback}
                  level={level}
                  draft={typedAnswer}
                  rubric={markRubric}
                  corrections={markCorrections}
                  simplifiedFeedback={markSimpleFeedback}
                  structuredFeedback={markStructuredFeedback}
                  trend={feedbackTrend}
                />
              </div>
            ) : null}

            {markFeedback && isExamMode ? (
              <div
                style={{
                  ...styles.helperCard,
                  marginTop: 18,
                  display: "grid",
                  gap: 14,
                }}
              >
                <div>
                  <h4 style={{ ...styles.resultHeading, marginBottom: 4 }}>
                    Improve your draft
                  </h4>

                  <p style={{ ...styles.helperText, margin: 0 }}>
                    Reflect on the feedback, revise your draft, compare the improved
                    version, and then submit it for tutor review.
                  </p>
                </div>

                <div>
                  <label style={styles.label}>
                    What will you improve?
                  </label>

                  <textarea
                    value={reflectionText}
                    onChange={(event) => {
                      setReflectionText(event.target.value);
                      setWorkflowComplete(false);
                      setTutorSaveState({
                        loading: false,
                        success: "",
                        error: "",
                      });
                    }}
                    placeholder="Example: I will improve my word order and answer every task point."
                    style={styles.textArea}
                    rows={3}
                  />
                </div>

                <div>
                  <label style={styles.label}>
                    Your improved draft
                  </label>

                  <textarea
                    value={revisedDraftText}
                    onChange={(event) => {
                      setRevisedDraftText(event.target.value);
                      setWorkflowComplete(false);
                      setTutorSaveState({
                        loading: false,
                        success: "",
                        error: "",
                      });
                    }}
                    placeholder="Rewrite your improved letter or essay here."
                    style={styles.textArea}
                    rows={9}
                  />

                  <p style={{ ...styles.helperText, marginBottom: 0 }}>
                    Original: {revisionSummary.firstWords} words · Improved:{" "}
                    {revisionSummary.revisedWords} words · Difference:{" "}
                    {revisionSummary.delta >= 0 ? "+" : ""}
                    {revisionSummary.delta}
                  </p>
                </div>

                {revisionSummary.badges.length > 0 ? (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {revisionSummary.badges.map((badge) => (
                      <span key={badge} style={styles.badge}>
                        {badge}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    style={styles.primaryButton}
                    onClick={handleCompleteWorkflow}
                    disabled={
                      reflectionText.trim().length < 12 ||
                      !revisionSummary.changed
                    }
                  >
                    {workflowComplete
                      ? "Improvement completed"
                      : "Complete improvement"}
                  </button>

                  <button
                    type="button"
                    style={styles.secondaryButton}
                    onClick={handleMarkAndCompareImproved}
                    disabled={improvedLoading || !revisionSummary.changed}
                  >
                    {improvedLoading
                      ? "Comparing drafts..."
                      : "Mark improved draft"}
                  </button>

                  <button
                    type="button"
                    style={styles.secondaryButton}
                    onClick={handleSaveForTutorReview}
                    disabled={tutorSaveState.loading || !workflowComplete}
                  >
                    {tutorSaveState.loading
                      ? "Submitting..."
                      : "Save for tutor review"}
                  </button>
                </div>

                {tutorSaveState.error ? (
                  <div style={styles.errorBox}>
                    {tutorSaveState.error}
                  </div>
                ) : null}

                {tutorSaveState.success ? (
                  <div style={styles.successBox}>
                    {tutorSaveState.success}
                  </div>
                ) : null}
              </div>
            ) : null}

            {error && (
              <div style={styles.errorBox}>
                <strong>Note:</strong> {error}
              </div>
            )}
          </section>

          {improvedFeedback ? (
            <section style={styles.card}>
              <h3 style={styles.sectionTitle}>Updated AI feedback</h3>
              <WritingFeedbackCard
                feedback={improvedFeedback}
                level={level}
                draft={revisedDraftText || typedAnswer}
                rubric={improvedRubric}
                corrections={improvedCorrections}
                simplifiedFeedback={improvedSimpleFeedback}
                structuredFeedback={improvedStructuredFeedback}
                trend={feedbackTrend}
              />
              <details style={{ marginTop: 10 }}>
                <summary style={{ cursor: "pointer", fontWeight: 700 }}>Previous AI feedback</summary>
                <WritingFeedbackCard
                  feedback={markFeedback}
                  level={level}
                  draft={typedAnswer}
                  rubric={markRubric}
                  corrections={markCorrections}
                  simplifiedFeedback={markSimpleFeedback}
                  structuredFeedback={markStructuredFeedback}
                  trend={feedbackTrend}
                />
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
          <p style={styles.helperText}>
            Your first pasted question stays pinned here so you can reference it while writing. Keep checking the task bullet points too.
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
                <div style={{ whiteSpace: "pre-wrap" }}>
                  {msg.role === "assistant" ? renderCoachMessage(msg.content) : msg.content}
                </div>
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
          {pinnedIdeaQuestion ? (
            <div
              style={{
                position: "sticky",
                top: 8,
                zIndex: 3,
                marginTop: 12,
                border: "1px solid #bfdbfe",
                borderRadius: 12,
                background: "#eff6ff",
                padding: 10,
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 6, color: "#1d4ed8" }}>📌 Pinned question</div>
              <div style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.5 }}>{pinnedIdeaQuestion}</div>
            </div>
          ) : null}
          <div style={{ marginTop: 12 }}>
            <label style={styles.label}>Your prompt (single box)</label>
            <textarea
              ref={ideasPromptRef}
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
            <SpecialCharacterRow
              onInsert={(character) => insertSpecialCharacter(setIdeaInput, ideasPromptRef, character)}
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
                setEditableDraftById({});
                setHiddenDraftIds([]);
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
              Keep one running draft box so students can keep building and refining what they type.
            </p>
            <div
              style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}
              className="idea-generator-panel"
            >
              <div>
                <label style={styles.label}>Single draft workspace</label>
                <textarea
                  ref={ideasWorkspaceRef}
                  style={styles.textareaSmall}
                  value={ideaDraftWorkspace}
                  onChange={(event) => {
                    setIdeaDraftWorkspace(event.target.value);
                    setIdeaError("");
                    setIdeaSuccess("");
                  }}
                  placeholder="Your best evolving draft stays here. Keep refining it before sending to Mark my letter."
                />
                <SpecialCharacterRow
                  label="Quick umlaut keys for this draft"
                  onInsert={(character) =>
                    insertSpecialCharacter(setIdeaDraftWorkspace, ideasWorkspaceRef, character)
                  }
                />
                <div style={{ ...styles.helperText, marginTop: 4, marginBottom: 0 }}>{countWords(ideaDraftWorkspace)} words</div>
              </div>

              <button style={{ ...styles.primaryButton, marginTop: 10 }} onClick={sendDraftsToMarkTab}>
                Send to “Mark my letter”
              </button>
              {ideaSuccess && (
                <div style={{ ...styles.successBox, marginTop: 8 }}>
                  {ideaSuccess}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {activeTab === "references" && (
        <WritingReferenceLibrary
          emptyText="No references saved yet. Add your first topic above — it will be saved to Firebase with your writing workspace."
          idPrefix="writing-reference"
          topicPlaceholder="e.g., Complaint letter phrases"
          referenceTopicInput={referenceTopicInput}
          setReferenceTopicInput={setReferenceTopicInput}
          referenceBodyInput={referenceBodyInput}
          setReferenceBodyInput={setReferenceBodyInput}
          referenceNotes={referenceNotes}
          filteredReferenceNotes={filteredReferenceNotes}
          selectedReferenceNote={selectedReferenceNote}
          setSelectedReferenceNoteId={setSelectedReferenceNoteId}
          editingReferenceNoteId={editingReferenceNoteId}
          referenceEditTopicInput={referenceEditTopicInput}
          setReferenceEditTopicInput={setReferenceEditTopicInput}
          referenceEditBodyInput={referenceEditBodyInput}
          setReferenceEditBodyInput={setReferenceEditBodyInput}
          referenceSearch={referenceSearch}
          setReferenceSearch={setReferenceSearch}
          ideaError={ideaError}
          ideaSuccess={ideaSuccess}
          setIdeaError={setIdeaError}
          setIdeaSuccess={setIdeaSuccess}
          addReferenceNote={addReferenceNote}
          startEditingReferenceNote={startEditingReferenceNote}
          cancelEditingReferenceNote={cancelEditingReferenceNote}
          saveEditedReferenceNote={saveEditedReferenceNote}
          removeReferenceNote={removeReferenceNote}
          addReferenceToLetter={addReferenceToLetter}
          bodyInputRef={referencesRef}
          bodyInputStyle={styles.textareaSmall}
          bodyRows={7}
          renderBodyTools={() => (
            <SpecialCharacterRow
              label="Quick umlaut keys for reference body"
              onInsert={(character) =>
                insertSpecialCharacter(setReferenceBodyInput, referencesRef, character)
              }
            />
          )}
        />
      )}

      {activeTab === "tutor" && canUseTutorFeedback && (
        <section style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <div>
              <h3 style={{ ...styles.sectionTitle, marginBottom: 4 }}>Tutor Feedback</h3>
              <p style={{ ...styles.helperText, margin: 0 }}>View tutor updates and reply here.</p>
            </div>
          </div>
          <div style={{ ...styles.infoBox, marginTop: 12, display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>ℹ️</span>
            <div style={{ margin: 0 }}>Select a submission to see feedback and next steps.</div>
          </div>
          {!tutorReviewCloudEnabled ? (
            <div style={styles.errorBox}>
              Tutor feedback sync is unavailable because Firebase is not configured in this environment.
            </div>
          ) : null}
          <div style={{ ...styles.helperCard, marginTop: 12 }}>
            {!tutorReviews.length ? (
              <p style={{ ...styles.helperText, margin: 0 }}>
                No feedback yet. To see feedback, go to the Writing tab and save a sample for your tutor to review.
              </p>
            ) : (
              <>
                <label style={styles.label}>Choose submission</label>
                <select
                  style={{ ...styles.input, marginTop: 6, marginBottom: 10 }}
                  value={latestTutorReview?.id || ""}
                  onChange={(event) => setSelectedTutorReviewId(event.target.value)}
                >
                  {tutorReviews.map((review, index) => (
                    <option key={review.id} value={review.id}>
                      {`#${tutorReviews.length - index} · ${review.promptTitle || "Writing submission"} · ${new Date(review.createdAtMs || Date.now()).toLocaleString()}`}
                    </option>
                  ))}
                </select>
                {(() => {
                  const meta = getTutorStatusMeta(latestTutorReview?.reviewStatus);
                  return (
                    <div style={{ marginBottom: 10, border: `1px solid ${meta.soft}`, background: meta.soft, borderRadius: 12, padding: 12, display: "flex", gap: 10, alignItems: "center" }}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", border: `2px solid ${meta.accent}`, color: meta.accent, fontWeight: 800, display: "grid", placeItems: "center" }}>{meta.icon}</div>
                      <div style={{ fontWeight: 800, color: meta.accent }}>Status: {meta.label}</div>
                    </div>
                  );
                })()}
                {latestTutorReview?.reviewedAt ? (
                  <p style={{ ...styles.helperText, margin: "0 0 8px" }}>
                    Reviewed: {new Date(latestTutorReview.reviewedAt).toLocaleString()}
                  </p>
                ) : null}
                {latestTutorReview?.tutorFeedback ? (
                  <pre
                    style={{
                      ...styles.pre,
                      background: "linear-gradient(120deg, #0f172a 0%, #1e293b 100%)",
                      color: "#f8fafc",
                      border: "1px solid #1e3a8a",
                      fontSize: 16,
                      padding: 20,
                    }}
                  >
                    {latestTutorReview.tutorFeedback}
                  </pre>
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
              </>
            )}
          </div>
          {tutorReviewCloudEnabled && tutorReviews.length ? (
            <div style={{ ...styles.helperCard, marginTop: 10 }}>
              <label style={styles.label}>Reply to tutor feedback</label>
              <textarea
                style={{ ...styles.textArea, marginTop: 6, minHeight: 130, borderRadius: 14, border: "1px solid #cbd5e1" }}
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
                  style={{ ...styles.primaryButton, borderRadius: 10, padding: "10px 16px" }}
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
          {tutorReviews.length ? (
            <div style={{ marginTop: 14, display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))" }}>
              {[
                { label: "Approved", value: tutorStatusStats.approved, accent: "#16a34a", soft: "#dcfce7", icon: "✓" },
                { label: "Pending", value: tutorStatusStats.pending, accent: "#ca8a04", soft: "#fef9c3", icon: "◷" },
                { label: "Needs Revision", value: tutorStatusStats.needsRevision, accent: "#f97316", soft: "#ffedd5", icon: "!" },
              ].map((item) => (
                <div key={item.label} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, display: "flex", gap: 10, alignItems: "center", boxShadow: "0 8px 20px rgba(15, 23, 42, 0.06)" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: item.soft, color: item.accent, fontWeight: 900, display: "grid", placeItems: "center" }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: 28, lineHeight: 1, fontWeight: 800 }}>{item.value}</div>
                    <div style={{ ...styles.helperText, margin: 0 }}>{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      )}
    </>
  );
};

export default WritingPage;
