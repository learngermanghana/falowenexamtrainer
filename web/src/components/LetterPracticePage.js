import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { useExam, ALLOWED_LEVELS } from "../context/ExamContext";
import { useAuth } from "../context/AuthContext";
import ResultHistory from "./ResultHistory";
import { fetchIdeasFromCoach, markLetterWithAI } from "../services/coachService";
import { writingLetters } from "../data/writingLetters";
import { loadWritingProgress, saveWritingProgress } from "../services/writingProgressService";
import {
  isTutorReviewCloudEnabled,
  subscribeTutorReviewsForStudent,
  saveExamLetterForTutorReview,
  saveStudentReplyToTutorReview,
} from "../services/tutorReviewService";
import { parseImportantPhraseLine } from "../lib/writingCoachFormatting";
import WritingFeedbackCard from "./WritingFeedbackCard";
import WritingReferenceLibrary from "./WritingReferenceLibrary";
import { makeReferenceId, normalizeReferenceNotes } from "../lib/writingReferenceLibrary";

const IDEAS_COACHING_PROMPTS = [
  "Paste the task or your draft.",
  "Ask what is unclear, then request one short explanation and one example sentence.",
  "Summarize the idea in your own words before sending your draft to Mark my letter.",
];
const IMPORTANT_PHRASE_COLORS = ["#1d4ed8", "#7c3aed", "#be123c", "#0f766e", "#b45309"];
const IDEAS_SESSION_TURN_LIMIT = 12;
const CAMPUS_IMPROVEMENT_TRIAL_LIMIT = 3;

const countWords = (value = "") => {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
};

const LetterPracticePage = ({ mode = "exams" }) => {
  const { i18n, t } = useTranslation();
  const numberFormatter = useMemo(() => new Intl.NumberFormat(i18n.language), [i18n.language]);
  const formatTimeUnit = (unit, count) =>
    t(`common.${unit}`, { count, formattedCount: numberFormatter.format(count) });
  const { level, setLevel, error, setError, loading, setLoading, resultHistory, addResultToHistory } = useExam();
  const { user, idToken, studentProfile } = useAuth();
  const location = useLocation();

  const isExamMode = mode === "exams";
  const isCampusMode = mode === "campus";
  const isFrenchProgram = studentProfile?.program === "french";
  const tutorReviewCloudEnabled = isTutorReviewCloudEnabled();
  const studentCode = studentProfile?.studentCode || studentProfile?.studentcode || user?.uid || "";
  const coachDisplayName = isFrenchProgram ? "the French coach" : "Herr Felix";
  const ideaCoachIntro = useMemo(
    () => ({
      id: "intro",
      role: "assistant",
      content: `Paste your task or draft. ${coachDisplayName} will guide you step by step until your letter is ready.`,
    }),
    [coachDisplayName]
  );

  const requestedTab = useMemo(() => new URLSearchParams(location.search).get("tab"), [location.search]);
  const [activeTab, setActiveTab] = useState("mark");
  const [letterText, setLetterText] = useState("");
  const [markFeedback, setMarkFeedback] = useState("");
  const [markRubric, setMarkRubric] = useState(null);
  const [markCorrections, setMarkCorrections] = useState([]);
  const [markSimpleFeedback, setMarkSimpleFeedback] = useState(null);
  const [feedbackTrend, setFeedbackTrend] = useState(null);
  const [markSubmitStatus, setMarkSubmitStatus] = useState(null);
  const [improvedLetterText, setImprovedLetterText] = useState("");
  const [improvedFeedback, setImprovedFeedback] = useState("");
  const [improvedRubric, setImprovedRubric] = useState(null);
  const [improvedCorrections, setImprovedCorrections] = useState([]);
  const [improvedSimpleFeedback, setImprovedSimpleFeedback] = useState(null);
  const [latestMarkedDraftText, setLatestMarkedDraftText] = useState("");
  const [latestMarkedFeedback, setLatestMarkedFeedback] = useState("");
  const [improvedLoading, setImprovedLoading] = useState(false);
  const [campusImproveTrials, setCampusImproveTrials] = useState(0);
  const [ideaInput, setIdeaInput] = useState("");
  const [chatMessages, setChatMessages] = useState([ideaCoachIntro]);
  const [ideasLoading, setIdeasLoading] = useState(false);
  const [ideaError, setIdeaError] = useState("");
  const [ideaSuccess, setIdeaSuccess] = useState("");
  const [ideaSessionActive, setIdeaSessionActive] = useState(false);
  const [ideaTurnCount, setIdeaTurnCount] = useState(0);
  const [selectedDraftIds, setSelectedDraftIds] = useState([]);
  const [editableDraftById, setEditableDraftById] = useState({});
  const [hiddenDraftIds, setHiddenDraftIds] = useState([]);
  const [ideaDraftWorkspace, setIdeaDraftWorkspace] = useState("");
  const [referenceTopicInput, setReferenceTopicInput] = useState("");
  const [referenceBodyInput, setReferenceBodyInput] = useState("");
  const [referenceNotes, setReferenceNotes] = useState([]);
  const [editingReferenceNoteId, setEditingReferenceNoteId] = useState(null);
  const [referenceEditTopicInput, setReferenceEditTopicInput] = useState("");
  const [referenceEditBodyInput, setReferenceEditBodyInput] = useState("");
  const [selectedReferenceNoteId, setSelectedReferenceNoteId] = useState("");
  const [referenceSearch, setReferenceSearch] = useState("");
  const [selectedLetterId, setSelectedLetterId] = useState(writingLetters[0]?.id || "");
  const [timerSeconds, setTimerSeconds] = useState(writingLetters[0]?.durationMinutes * 60 || 0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [tutorReviews, setTutorReviews] = useState([]);
  const [selectedTutorReviewId, setSelectedTutorReviewId] = useState("");
  const [tutorRequestText, setTutorRequestText] = useState("");
  const [tutorRequestState, setTutorRequestState] = useState({ loading: false, success: "", error: "" });
  const [studentReplyText, setStudentReplyText] = useState("");
  const [studentReplyState, setStudentReplyState] = useState({ loading: false, success: "", error: "" });
  const [ideasProgressLoaded, setIdeasProgressLoaded] = useState(false);
  const [practiceLevel, setPracticeLevel] = useState("All");
  const latestTutorReview = useMemo(
    () => tutorReviews.find((review) => review.id === selectedTutorReviewId) || tutorReviews[0] || null,
    [selectedTutorReviewId, tutorReviews]
  );

  const normalizeProfileLevel = (rawLevel) => {
    const normalized = (rawLevel || "").trim().toUpperCase();

    if (ALLOWED_LEVELS.includes(normalized)) {
      return normalized;
    }

    const fuzzyMatch = ALLOWED_LEVELS.find((allowed) => normalized.startsWith(allowed));

    return fuzzyMatch || "";
  };

  const profileLevel = normalizeProfileLevel(studentProfile?.level);
  const isLevelLocked = ALLOWED_LEVELS.includes(profileLevel);
  const isA1Student = isLevelLocked && profileLevel === "A1";
  const canUseIdeasGenerator = !isA1Student;
  const canUsePracticeLetters = isExamMode && !isFrenchProgram && !isA1Student;
  const campusImprovementLocked = isCampusMode && campusImproveTrials >= CAMPUS_IMPROVEMENT_TRIAL_LIMIT;

  const availableTabs = useMemo(
    () => {
      const baseTabs = [{ key: "mark", label: "Mark my letter" }];
      baseTabs.push({ key: "references", label: "Reference" });

      if (canUseIdeasGenerator) {
        baseTabs.push({ key: "ideas", label: "Ideas generator" });
      }

      if (canUsePracticeLetters) {
        baseTabs.unshift({ key: "practice", label: "Practice letters" });
      }

      if (isCampusMode) {
        baseTabs.push({ key: "tutor", label: "Tutor feedback" });
      }

      return baseTabs;
    },
    [canUseIdeasGenerator, canUsePracticeLetters, isCampusMode]
  );

  const resetErrors = () => {
    setError("");
    setIdeaError("");
    setIdeaSuccess("");
  };

  const formatLetterPrompt = (letter) => {
    if (!letter) return "";
    const tagLine = letter.tags?.length ? `Tags: ${letter.tags.join(", ")}` : "";
    const checklist = letter.whatToInclude.map((item) => `- ${item}`).join("\n");

    return [
      `Prompt: ${letter.letter}`,
      tagLine,
      `Situation: ${letter.situation}`,
      "Checklist:",
      checklist,
    ]
      .filter(Boolean)
      .join("\n");
  };

  const sendLetterToMarkTab = () => {
    if (!selectedLetter) return;
    const prompt = formatLetterPrompt(selectedLetter);
    setLetterText((prev) => (prev.trim() ? prev : `${prompt}\n\n`));
    setMarkFeedback("");
    setMarkRubric(null);
    setMarkCorrections([]);
    setMarkSimpleFeedback(null);
    setFeedbackTrend(null);
    setActiveTab("mark");
  };

  const sendLetterToIdeasTab = () => {
    if (!selectedLetter) return;
    const prompt = formatLetterPrompt(selectedLetter);
    setIdeaInput(prompt);
    setIdeaSuccess("");
    setIdeaError("");
    setActiveTab("ideas");
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    resetErrors();
  };

  useEffect(() => {
    if (!availableTabs.find((tab) => tab.key === activeTab)) {
      setActiveTab(availableTabs[0].key);
      setError("");
      setIdeaError("");
      setIdeaSuccess("");
    }
  }, [activeTab, availableTabs, setError, setIdeaError]);

  useEffect(() => {
    if (requestedTab && availableTabs.some((tab) => tab.key === requestedTab)) {
      setActiveTab(requestedTab);
    }
  }, [availableTabs, requestedTab]);

  useEffect(() => {
    setChatMessages([ideaCoachIntro]);
  }, [ideaCoachIntro]);

  const selectedLetter = useMemo(() => writingLetters.find((item) => item.id === selectedLetterId), [selectedLetterId]);
  const ideasProgressMode = useMemo(() => (isCampusMode ? "campus-ideas" : "exam-ideas"), [isCampusMode]);
  const filteredPracticeLetters = useMemo(
    () => writingLetters.filter((item) => (practiceLevel === "All" ? true : item.level === practiceLevel)),
    [practiceLevel]
  );
  const selectedLetterPosition = useMemo(
    () => filteredPracticeLetters.findIndex((item) => item.id === selectedLetterId) + 1,
    [filteredPracticeLetters, selectedLetterId]
  );

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

  useEffect(() => {
    let mounted = true;

    const hydrateIdeas = async () => {
        if (!user?.uid) {
          if (mounted) {
            setIdeasProgressLoaded(true);
            setChatMessages([ideaCoachIntro]);
            setIdeaInput("");
            setSelectedDraftIds([]);
            setEditableDraftById({});
            setHiddenDraftIds([]);
            setIdeaDraftWorkspace("");
            setReferenceTopicInput("");
            setReferenceBodyInput("");
            setReferenceNotes([]);
            setSelectedReferenceNoteId("");
            setReferenceSearch("");
            setIdeaSessionActive(false);
            setIdeaTurnCount(0);
          }
          return;
      }

      setIdeasProgressLoaded(false);
      try {
        const saved = await loadWritingProgress({
          userId: user.uid,
          studentCode,
          mode: ideasProgressMode,
        });
        if (!mounted) return;

        if (!saved) {
          setChatMessages([ideaCoachIntro]);
          setIdeaInput("");
          setSelectedDraftIds([]);
          setEditableDraftById({});
          setHiddenDraftIds([]);
          setIdeaDraftWorkspace("");
          setReferenceTopicInput("");
          setReferenceBodyInput("");
          setReferenceNotes([]);
          setSelectedReferenceNoteId("");
          setReferenceSearch("");
          setIdeaSessionActive(false);
          setIdeaTurnCount(0);
          setIdeasProgressLoaded(true);
          return;
        }

        if (Array.isArray(saved.chatMessages) && saved.chatMessages.length > 0) {
          setChatMessages(saved.chatMessages);
        } else {
          setChatMessages([ideaCoachIntro]);
        }
        if (typeof saved.ideaInput === "string") setIdeaInput(saved.ideaInput);
        if (Array.isArray(saved.selectedDraftIds)) setSelectedDraftIds(saved.selectedDraftIds);
        if (saved.editableDraftById && typeof saved.editableDraftById === "object") {
          setEditableDraftById(saved.editableDraftById);
        } else {
          setEditableDraftById({});
        }
        if (Array.isArray(saved.hiddenDraftIds)) {
          setHiddenDraftIds(saved.hiddenDraftIds);
        } else {
          setHiddenDraftIds([]);
        }
        if (typeof saved.ideaDraftWorkspace === "string") setIdeaDraftWorkspace(saved.ideaDraftWorkspace);
        if (typeof saved.referenceInput === "string") {
          setReferenceBodyInput(saved.referenceInput);
        }
        if (typeof saved.referenceTopicInput === "string") setReferenceTopicInput(saved.referenceTopicInput);
        if (typeof saved.referenceBodyInput === "string") setReferenceBodyInput(saved.referenceBodyInput);
        const normalizedReferences = normalizeReferenceNotes(saved.referenceNotes);
        setReferenceNotes(normalizedReferences);
        if (
          typeof saved.selectedReferenceNoteId === "string" &&
          normalizedReferences.some((item) => item.id === saved.selectedReferenceNoteId)
        ) {
          setSelectedReferenceNoteId(saved.selectedReferenceNoteId);
        } else {
          setSelectedReferenceNoteId(normalizedReferences[0]?.id || "");
        }
        if (typeof saved.referenceSearch === "string") setReferenceSearch(saved.referenceSearch);
        if (typeof saved.ideaSessionActive === "boolean") setIdeaSessionActive(saved.ideaSessionActive);
        if (typeof saved.ideaTurnCount === "number") setIdeaTurnCount(saved.ideaTurnCount);
      } catch (error) {
        console.error("Failed to load idea chat progress", error);
      } finally {
        if (mounted) setIdeasProgressLoaded(true);
      }
    };

    hydrateIdeas();

    return () => {
      mounted = false;
    };
  }, [ideaCoachIntro, ideasProgressMode, studentCode, user?.uid]);

  useEffect(() => {
    if (!ideasProgressLoaded || !user?.uid) return;

    const timeout = setTimeout(() => {
      saveWritingProgress({
        userId: user.uid,
        studentCode,
        mode: ideasProgressMode,
        data: {
          chatMessages,
          ideaInput,
          selectedDraftIds,
          editableDraftById,
          hiddenDraftIds,
          ideaDraftWorkspace,
          referenceTopicInput,
          referenceBodyInput,
          referenceNotes,
          selectedReferenceNoteId,
          referenceSearch,
          ideaSessionActive,
          ideaTurnCount,
        },
      }).catch((error) => {
        console.error("Failed to save idea chat progress", error);
      });
    }, 700);

    return () => clearTimeout(timeout);
  }, [
    chatMessages,
    ideaInput,
    ideaSessionActive,
    ideaTurnCount,
    editableDraftById,
    hiddenDraftIds,
    ideaDraftWorkspace,
    referenceTopicInput,
    referenceBodyInput,
    referenceNotes,
    selectedReferenceNoteId,
    referenceSearch,
    ideasProgressLoaded,
    ideasProgressMode,
    selectedDraftIds,
    studentCode,
    user?.uid,
  ]);

  useEffect(() => {
    if (!selectedLetter) return;

    if (!isLevelLocked) {
      setLevel(selectedLetter.level);
    }

    setTimerSeconds(selectedLetter.durationMinutes * 60);
  }, [isLevelLocked, selectedLetter, setLevel]);

  useEffect(() => {
    if (isLevelLocked && profileLevel !== level) {
      setLevel(profileLevel);
    }
  }, [isLevelLocked, level, profileLevel, setLevel]);

  useEffect(() => {
    if (isLevelLocked && practiceLevel !== profileLevel) {
      setPracticeLevel(profileLevel);
    }
  }, [isLevelLocked, practiceLevel, profileLevel]);

  useEffect(() => {
    if (!timerRunning) return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const validateLevel = () => {
    if (!ALLOWED_LEVELS.includes(level)) {
      setError(
        isFrenchProgram
          ? "Please choose a valid level (A1–B2) for French feedback."
          : "Bitte wähle ein gültiges Niveau (A1–B2) für das Feedback."
      );
      return false;
    }

    return true;
  };

  const handleMarkSubmit = async () => {
    const trimmed = letterText.trim();
    if (!trimmed) {
      setError(`Please paste your letter so ${coachDisplayName} can mark it.`);
      return;
    }

    if (!validateLevel()) return;

    setLoading(true);
    setError("");
    setMarkFeedback("");
    setMarkSubmitStatus(null);

    try {
      const studentName = user?.displayName || user?.email || "Student";
      const data = await markLetterWithAI({
        text: trimmed,
        level,
        studentName,
        idToken,
        program: studentProfile?.program,
        submissionContext: isCampusMode ? "campus-mark" : "exam-room",
        promptType: selectedLetter?.tags?.[0] || "letter",
      });

      setMarkFeedback(data.feedback);
      setMarkRubric(data?.rubric || null);
      setMarkCorrections(Array.isArray(data?.corrections) ? data.corrections : []);
      setMarkSimpleFeedback(data?.simplifiedFeedback || null);
      setFeedbackTrend(data?.trend || null);
      if (isCampusMode) {
        setImprovedLetterText(trimmed);
        setImprovedFeedback("");
        setImprovedRubric(null);
        setImprovedCorrections([]);
        setImprovedSimpleFeedback(null);
        setCampusImproveTrials(0);
        setLatestMarkedDraftText(trimmed);
        setLatestMarkedFeedback(data.feedback || "");
      }
      setMarkSubmitStatus({
        submissionSaved: Boolean(data?.submissionSaved),
        submissionId: data?.submissionId || null,
      });
      addResultToHistory({
        id: Date.now(),
        mode: "Mark my letter",
        level,
        comments: data.feedback,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      const message =
        err?.response?.data?.error || err.message || "Falowen Coach: Could not mark your letter right now.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };


  const handleMarkImprovedDraft = async () => {
    if (!isCampusMode) return;

    if (!markFeedback) {
      setError("Submit your first letter for marking before using the improvement box.");
      return;
    }

    if (campusImprovementLocked) {
      setError("Improvement attempts are now locked. Please read the instructions, fix your errors, and then submit.");
      return;
    }

    const trimmed = improvedLetterText.trim();
    if (!trimmed) {
      setError("Paste your improved letter in the improvement box first.");
      return;
    }

    if (!validateLevel()) return;

    setImprovedLoading(true);
    setError("");

    try {
      const studentName = user?.displayName || user?.email || "Student";
      const data = await markLetterWithAI({
        text: trimmed,
        level,
        studentName,
        idToken,
        program: studentProfile?.program,
        submissionContext: "campus-improved",
        promptType: selectedLetter?.tags?.[0] || "letter",
        previousText: latestMarkedDraftText || letterText,
        previousFeedback: latestMarkedFeedback || markFeedback,
      });

      setImprovedFeedback(data.feedback);
      setImprovedRubric(data?.rubric || null);
      setImprovedCorrections(Array.isArray(data?.corrections) ? data.corrections : []);
      setImprovedSimpleFeedback(data?.simplifiedFeedback || null);
      setFeedbackTrend(data?.trend || null);
      setCampusImproveTrials((prev) => prev + 1);
      setLatestMarkedDraftText(trimmed);
      setLatestMarkedFeedback(data.feedback || "");
    } catch (err) {
      const message =
        err?.response?.data?.error || err.message || "Could not mark improved draft right now.";
      setError(message);
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
    const parsed = parseImportantPhraseLine(line);
    if (!parsed) return line;

    if (!parsed.phrases.length) {
      return <strong>{line}</strong>;
    }

    return (
      <>
        <strong style={{ color: "#111827" }}>{parsed.label}: </strong>
        {parsed.phrases.map((phrase, index) => (
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
              border: `1px solid ${IMPORTANT_PHRASE_COLORS[index % IMPORTANT_PHRASE_COLORS.length]}`,
              fontWeight: 800,
              textDecoration: "underline",
              textUnderlineOffset: 2,
            }}
            aria-label={`Important phrase ${index + 1}: ${phrase}`}
            title="Important phrase"
          >
            ★ {phrase}
          </span>
        ))}
      </>
    );
  };

  const renderCoachMessage = (content) => {
    const message = String(content || "");
    const lines = message.split("\n");

    return lines.map((line, index) => (
      <React.Fragment key={`coach-line-${index}`}>
        <span>{renderImportantPhraseLine(line)}</span>
        {index < lines.length - 1 ? <br /> : null}
      </React.Fragment>
    ));
  };


  const sendDraftsToMarkTab = () => {
    const combinedDraft = ideaDraftWorkspace.trim();

    if (!combinedDraft) {
      setIdeaError(
        "Add text to the workspace before sending it for marking."
      );
      setIdeaSuccess("");
      return;
    }

    setLetterText((prev) => {
      const existing = prev.trim();
      const parts = [existing, combinedDraft].filter(Boolean);
      return parts.join("\n\n");
    });
    setMarkFeedback("");
    setMarkRubric(null);
    setMarkCorrections([]);
    setMarkSimpleFeedback(null);
    setFeedbackTrend(null);
    setIdeaSuccess("Your workspace draft is now pasted into the “Mark my letter” tab.");
    setIdeaError("");
    setSelectedDraftIds([]);
    setIdeaSessionActive(false);
    setActiveTab("mark");
  };

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
      setIdeaSuccess("That topic is already in your reference list.");
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
    setIdeaSuccess("Reference saved. Open the topic to study the body on its own page.");
    setIdeaError("");
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
      setIdeaError("That topic is already in your reference list.");
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
    setLetterText((prev) => `${prev}${prev ? "\n" : ""}${note.body}`);
    setIdeaSuccess(`Added “${note.topic}” to your letter draft.`);
    setIdeaError("");
  };

  const startIdeasSession = () => {
    setChatMessages([ideaCoachIntro]);
    setIdeaInput("");
    setIdeaError("");
    setIdeaSuccess(`Ideas session started. Ask up to ${IDEAS_SESSION_TURN_LIMIT} focused questions, then move your final draft to Mark my letter.`);
    setSelectedDraftIds([]);
    setEditableDraftById({});
    setHiddenDraftIds([]);
    setIdeaDraftWorkspace("");
    setIdeaTurnCount(0);
    setIdeaSessionActive(true);
  };

  const endIdeasSession = () => {
    setIdeaSessionActive(false);
    setIdeaSuccess("Ideas session ended. Use your best draft in Mark my letter for final feedback.");
  };

  const handleAskForIdeas = async () => {
    const trimmed = ideaInput.trim();
    if (!trimmed || ideasLoading) return;

    const currentTurnCount = ideaSessionActive ? ideaTurnCount : 0;

    if (!ideaSessionActive) {
      setIdeaSessionActive(true);
      setIdeaTurnCount(0);
      setIdeaSuccess(`Ideas session started. Ask up to ${IDEAS_SESSION_TURN_LIMIT} focused questions, then move your final draft to Mark my letter.`);
      setIdeaError("");
    }

    if (currentTurnCount >= IDEAS_SESSION_TURN_LIMIT) {
      setIdeaSessionActive(false);
      setIdeaError("This ideas session is complete. Start a new session or move your draft to Mark my letter.");
      return;
    }

    resetErrors();

    const userMessage = makeChatMessage("user", trimmed);
    const updatedMessages = [...chatMessages, userMessage];
    setChatMessages(updatedMessages);
    setIdeaDraftWorkspace((prev) => [prev.trim(), userMessage.content.trim()].filter(Boolean).join("\n\n"));
    setIdeaInput("");
    setIdeasLoading(true);

    try {
      const { reply } = await fetchIdeasFromCoach({
        messages: updatedMessages,
        level,
        idToken,
        program: studentProfile?.program,
      });
      addChatMessage("assistant", reply);
      setIdeaTurnCount((prev) => {
        const next = prev + 1;
        if (next >= IDEAS_SESSION_TURN_LIMIT) {
          setIdeaSessionActive(false);
          setIdeaSuccess("Ideas session complete. You can now send your best draft to Mark my letter.");
        }
        return next;
      });
    } catch (err) {
      const message =
        err?.response?.data?.error || err.message || `Could not fetch ideas from ${coachDisplayName}.`;
      setIdeaError(message);
    } finally {
      setIdeasLoading(false);
    }
  };

  const getTutorStatusMeta = (status) => {
    if (status === "approved") return { label: "Approved", icon: "✓", accent: "#16a34a", soft: "#dcfce7" };
    if (status === "needs_improvement") return { label: "Needs revision", icon: "!", accent: "#f97316", soft: "#ffedd5" };
    return { label: "Pending", icon: "◷", accent: "#ca8a04", soft: "#fef9c3" };
  };

  const tutorStatusStats = useMemo(() => {
    const stats = { approved: 0, pending: 0, needsRevision: 0 };
    tutorReviews.forEach((review) => {
      if (review?.reviewStatus === "approved") stats.approved += 1;
      else if (review?.reviewStatus === "needs_improvement") stats.needsRevision += 1;
      else stats.pending += 1;
    });
    return stats;
  }, [tutorReviews]);

  useEffect(() => {
    if (!user?.uid || !tutorReviewCloudEnabled) {
      setTutorReviews([]);
      setSelectedTutorReviewId("");
      return;
    }

    const unsubscribe = subscribeTutorReviewsForStudent(
      { userId: user.uid, studentCode },
      (reviews) => {
        setTutorReviews(reviews);
        setSelectedTutorReviewId((current) => {
          if (current && reviews.some((review) => review.id === current)) return current;
          return reviews[0]?.id || "";
        });
      },
      () => {
        setTutorReviews([]);
        setSelectedTutorReviewId("");
      }
    );

    return () => {
      unsubscribe();
    };
  }, [studentCode, tutorReviewCloudEnabled, user?.uid]);

  const handleSubmitTutorRequest = async () => {
    const message = tutorRequestText.trim();
    if (!message) {
      setTutorRequestState({ loading: false, success: "", error: "Add your question before sending to tutor." });
      return;
    }

    if (!tutorReviewCloudEnabled) {
      setTutorRequestState({ loading: false, success: "", error: "Tutor sync is unavailable in this environment." });
      return;
    }

    setTutorRequestState({ loading: true, success: "", error: "" });
    try {
      await saveExamLetterForTutorReview({
        user,
        studentProfile,
        level,
        promptTitle: "Campus writing help request",
        promptId: selectedLetterId || "campus-writing",
        draft: improvedLetterText || letterText,
        aiFeedback: markFeedback,
        revisedDraft: improvedLetterText || "",
        reflection: message,
        source: "campus-writing",
      });
      setTutorRequestText("");
      setTutorRequestState({ loading: false, success: "Sent to tutor. Check the Tutor feedback tab for updates.", error: "" });
    } catch (err) {
      setTutorRequestState({ loading: false, success: "", error: err?.message || "Could not send your request right now." });
    }
  };

  const handleStudentReply = async () => {
    if (!latestTutorReview?.id) {
      setStudentReplyState({ loading: false, success: "", error: "No tutor feedback yet." });
      return;
    }

    const message = studentReplyText.trim();
    if (!message) {
      setStudentReplyState({ loading: false, success: "", error: "Write a reply before sending." });
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
      setTutorReviews((prev) =>
        prev.map((review) => {
          if (review.id !== latestTutorReview.id) return review;
          return {
            ...review,
            studentReplies: [
              ...(review.studentReplies || []),
              { message, createdAt: new Date().toISOString() },
            ],
          };
        })
      );
    } catch (err) {
      setStudentReplyState({ loading: false, success: "", error: err?.message || "Could not send reply right now." });
    }
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <p style={{ ...styles.helperText, margin: "0 0 4px 0" }}>
              {isFrenchProgram ? "French writing coach" : "Schreiben trainer"}
            </p>
            <h2 style={{ ...styles.sectionTitle, margin: 0 }}>
              {canUseIdeasGenerator
                ? isExamMode
                  ? isFrenchProgram
                    ? "French writing help + ideas"
                    : "Timed letters + Herr Felix ideas"
                  : isFrenchProgram
                    ? "Mark my letter + French ideas"
                    : "Mark my letter + Herr Felix ideas"
                : "Mark my letter"}
            </h2>
            <p style={{ ...styles.helperText, margin: "6px 0 0 0" }}>
              {canUseIdeasGenerator ? (
                isExamMode ? (
                  <>
                    {isFrenchProgram
                      ? "Start with a draft in French, then paste it into “Mark my letter”. Use the ideas generator to stay organized."
                      : 'Start with a timed practice letter, then paste your draft into "Mark my letter". Use the ideas generator (prompts in '}
                    {isFrenchProgram ? null : <code>functions/functionz/prompts.js</code>}
                    {isFrenchProgram ? null : ") to keep moving."}
                  </>
                ) : (
                  isFrenchProgram
                    ? "Paste your French draft for marking, or use the ideas generator to plan it first."
                    : "Paste your draft for marking, or use the ideas generator to plan it first."
                )
              ) : (
                "A1 students use Mark my letter only."
              )}
            </p>
          </div>
          <span style={styles.badge}>Exam writing lab</span>
        </div>

        <div style={styles.tabList} className="tab-list">
          {availableTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className="tab-button"
              style={activeTab === tab.key ? styles.tabButtonActive : styles.tabButton}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {activeTab === "practice" && canUsePracticeLetters && (
        <section style={styles.card}>
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "grid", gap: 6 }}>
                <label style={styles.label}>Choose a level to browse tasks</label>
                <div style={styles.segmentedControl}>
                  {["All", ...ALLOWED_LEVELS].map((lvl) => (
                    <button
                      key={lvl}
                      style={practiceLevel === lvl ? styles.segmentedActive : styles.segmentedButton}
                      onClick={() => setPracticeLevel(lvl)}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div style={styles.timer}>{formatTime(timerSeconds)}</div>
                <p style={{ ...styles.timerHelp, margin: 0 }}>
                  Start the timer, write without stopping, then switch to "Mark my letter".
                </p>
              </div>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ ...styles.promptList, paddingLeft: 0, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
                {filteredPracticeLetters.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedLetterId(item.id)}
                      style={
                        selectedLetterId === item.id
                          ? { ...styles.tabButtonActive, textAlign: "left" }
                          : { ...styles.tabButton, textAlign: "left" }
                      }
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                        <span>{`${index + 1}. ${item.letter}`}</span>
                        <span style={styles.levelPill}>{item.level}</span>
                      </div>
                      <p style={{ ...styles.helperText, margin: "6px 0 0 0" }}>
                        {formatTimeUnit("minute", item.durationMinutes)} • {item.situation}
                      </p>
                      {item.tags?.length ? (
                        <div style={styles.tagRow}>
                          {item.tags.map((tag) => (
                            <span key={`${item.id}-${tag}`} style={styles.tagPill}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </button>
                  ))}
              </div>
            </div>

            {selectedLetter && (
              <div style={{ ...styles.uploadCard, border: "1px dashed #cbd5e1", background: "#f8fafc" }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ display: "grid", gap: 6 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <span style={styles.levelPill}>{selectedLetter.level}</span>
                      {selectedLetterPosition > 0 ? (
                        <span style={styles.badge}>{`${selectedLetterPosition}/${filteredPracticeLetters.length}`}</span>
                      ) : null}
                      <strong>{selectedLetter.letter}</strong>
                      <span style={styles.badge}>
                        {t("letterPractice.minuteTarget", {
                          time: formatTimeUnit("minute", selectedLetter.durationMinutes),
                        })}
                      </span>
                      {selectedLetter.tags?.length ? (
                        <div style={styles.tagRow}>
                          {selectedLetter.tags.map((tag) => (
                            <span key={`${selectedLetter.id}-${tag}`} style={styles.tagPill}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <p style={{ ...styles.helperText, margin: 0 }}>{selectedLetter.situation}</p>
                    <div>
                      <p style={{ ...styles.helperText, margin: "0 0 4px 0" }}>Checklist</p>
                      <ul style={styles.checklist}>
                        {selectedLetter.whatToInclude.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div style={{ display: "grid", gap: 8, alignItems: "flex-start" }}>
                    <button
                      style={styles.primaryButton}
                      onClick={sendLetterToIdeasTab}
                    >
                      Send prompt to ideas
                    </button>
                    <button
                      style={styles.secondaryButton}
                      onClick={sendLetterToMarkTab}
                    >
                      Send prompt to marking
                    </button>
                    <button
                      style={timerRunning ? styles.secondaryButton : styles.primaryButton}
                      onClick={() => {
                        setTimerSeconds(selectedLetter.durationMinutes * 60);
                        setTimerRunning(true);
                      }}
                    >
                      {timerRunning ? "Restart timer" : "Start timer"}
                    </button>
                    <button
                      style={styles.secondaryButton}
                      onClick={() => {
                        setTimerRunning(false);
                        setTimerSeconds(selectedLetter.durationMinutes * 60);
                      }}
                    >
                      Pause / Reset
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div style={{ ...styles.helperText, marginTop: -4 }}>
              After finishing a draft, switch to <strong>Mark my letter</strong> for feedback.
            </div>
          </div>
        </section>
      )}

      {activeTab === "mark" && (
        <section style={styles.card}>
          <div style={{ display: "grid", gap: 12 }}>
            <h3 style={{ ...styles.sectionTitle, margin: 0 }}>Mark my letter</h3>
            <div style={{ display: "grid", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <label style={styles.label}>Level for feedback</label>
                {isLevelLocked && <span style={styles.badge}>From student profile</span>}
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

            <div style={{ display: "grid", gap: 6 }}>
              <label style={styles.label}>Your letter</label>
              <textarea
                style={styles.textArea}
                placeholder="Paste your finished letter or essay here for marking."
                value={letterText}
                onChange={(e) => setLetterText(e.target.value)}
                rows={10}
                disabled={campusImprovementLocked}
              />
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button style={styles.primaryButton} onClick={handleMarkSubmit} disabled={loading || campusImprovementLocked}>
                {loading ? "Getting AI feedback..." : isCampusMode ? "Get AI feedback" : "Submit for tutor review"}
              </button>
              <button
                style={styles.secondaryButton}
                onClick={() => {
                  setLetterText("");
                  setMarkFeedback("");
                  setMarkRubric(null);
                  setMarkCorrections([]);
                  setMarkSimpleFeedback(null);
                  setFeedbackTrend(null);
                  setMarkSubmitStatus(null);
                  setImprovedLetterText("");
                  setImprovedFeedback("");
                  setImprovedRubric(null);
                  setImprovedCorrections([]);
                  setImprovedSimpleFeedback(null);
                  setCampusImproveTrials(0);
                  resetErrors();
                }}
              >
                Clear
              </button>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <strong>{isFrenchProgram ? "Note" : "Hinweis"}:</strong> {error}
              </div>
            )}


            {markSubmitStatus && (
              <div style={markSubmitStatus.submissionSaved ? styles.successBox : styles.infoBox}>
                {markSubmitStatus.submissionSaved ? (
                  <>
                    ✅ AI feedback generated and submission recorded.
                    {markSubmitStatus.submissionId ? ` Firestore record: ${markSubmitStatus.submissionId}` : ""}
                  </>
                ) : (
                  "Feedback generated, but submission save could not be confirmed in Firestore."
                )}
              </div>
            )}

            {isCampusMode && (
              <div style={{ ...styles.helperCard, border: "1px solid #dbeafe" }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Need tutor help with AI grammar feedback?</div>
                <p style={{ ...styles.helperText, margin: "0 0 8px" }}>
                  If any grammar correction from AI is confusing, send your question here for tutor review. Include what you tried and where you are stuck.
                </p>
                <textarea
                  style={styles.textArea}
                  rows={4}
                  placeholder="Example: Why is this sentence in dative, and how should I rewrite it correctly?"
                  value={tutorRequestText}
                  onChange={(event) => {
                    setTutorRequestText(event.target.value);
                    setTutorRequestState({ loading: false, success: "", error: "" });
                  }}
                />
                <button
                  type="button"
                  style={{ ...styles.primaryButton, marginTop: 8 }}
                  onClick={handleSubmitTutorRequest}
                  disabled={tutorRequestState.loading}
                >
                  {tutorRequestState.loading ? "Sending to tutor..." : "Send question to tutor"}
                </button>
                {tutorRequestState.error ? <p style={{ ...styles.helperText, color: "#b91c1c" }}>{tutorRequestState.error}</p> : null}
                {tutorRequestState.success ? <p style={{ ...styles.helperText, color: "#166534" }}>{tutorRequestState.success}</p> : null}
              </div>
            )}

            {isCampusMode && campusImprovementLocked && (
              <div style={styles.infoBox}>
                Improvement box locked after {CAMPUS_IMPROVEMENT_TRIAL_LIMIT} AI trials. Please read the feedback instructions, fix your errors, and then submit.
              </div>
            )}

            {markFeedback && (
              <div style={{ display: "grid", gap: 10 }}>
                <div>
                  <h4 style={styles.sectionTitle}>AI feedback</h4>
                  <WritingFeedbackCard
                    feedback={markFeedback}
                    level={level}
                    draft={letterText}
                    rubric={markRubric}
                    corrections={markCorrections}
                    simplifiedFeedback={markSimpleFeedback}
                    trend={feedbackTrend}
                  />
                </div>

                {isCampusMode && (
                  <div style={{ display: "grid", gap: 8, border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
                    <h4 style={{ ...styles.sectionTitle, margin: 0 }}>Improvement with AI (Campus only)</h4>
                    <p style={{ ...styles.helperText, margin: 0 }}>
                      Try up to {CAMPUS_IMPROVEMENT_TRIAL_LIMIT} improved drafts. After that, the boxes lock so you can review instructions and fix errors before submission.
                    </p>
                    <p style={{ ...styles.helperText, margin: 0 }}>
                      Trials used: {campusImproveTrials}/{CAMPUS_IMPROVEMENT_TRIAL_LIMIT}
                    </p>
                    <textarea
                      style={styles.textArea}
                      placeholder="Paste your improved version based on AI feedback."
                      value={improvedLetterText}
                      onChange={(e) => setImprovedLetterText(e.target.value)}
                      rows={8}
                      disabled={campusImprovementLocked}
                    />
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button
                        style={styles.primaryButton}
                        onClick={handleMarkImprovedDraft}
                        disabled={improvedLoading || campusImprovementLocked}
                      >
                        {improvedLoading ? "Marking improved draft..." : "Mark improvement with AI"}
                      </button>
                    </div>
                    {improvedFeedback && (
                      <div>
                        <h5 style={{ ...styles.sectionTitle, margin: "4px 0" }}>AI feedback (improved draft)</h5>
                        <WritingFeedbackCard
                          feedback={improvedFeedback}
                          level={level}
                          draft={improvedLetterText || letterText}
                          rubric={improvedRubric}
                          corrections={improvedCorrections}
                          simplifiedFeedback={improvedSimpleFeedback}
                          trend={feedbackTrend}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {activeTab === "references" && (
        <WritingReferenceLibrary
          description="Save each pasted reference with a clear topic and body. The library now shows topics first, so long notes open on their own study page instead of appearing as one long list."
          tip="Use short topics like “Apology letter”, “Complaint phrases”, or “B1 connectors”, then paste the full explanation, example sentences, or corrections in the body."
          emptyText="No saved references yet."
          idPrefix="reference"
          topicPlaceholder="e.g., Apology letter phrases"
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
          bodyInputStyle={styles.textArea}
          bodyRows={7}
        />
      )}

      {activeTab === "ideas" && canUseIdeasGenerator && (
        <section style={styles.card} className="idea-generator-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <label style={styles.label}>Level for coaching</label>
                {isLevelLocked && <span style={styles.badge}>From student profile</span>}
              </div>
              <select
                value={level}
                onChange={(e) => {
                  setLevel(e.target.value);
                  resetErrors();
                }}
                style={styles.select}
                disabled={isLevelLocked}
              >
                {ALLOWED_LEVELS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <span style={styles.levelPill}>Step-by-step writing help</span>
          </div>
          <div style={styles.infoBox}>
            <strong>How to use the ideas coach:</strong>
            <ul style={styles.promptList}>
              {IDEAS_COACHING_PROMPTS.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ul>
            <p style={{ ...styles.helperText, margin: "6px 0 0 0" }}>
              Ideas turns used: <strong>{ideaTurnCount}/{IDEAS_SESSION_TURN_LIMIT}</strong>
            </p>
          </div>

          <div style={{ ...styles.chatLog, marginTop: 12 }} className="idea-generator-chat">
            {chatMessages.map((msg, idx) => (
              <div
                key={msg.id || `${msg.role}-${idx}`}
                style={msg.role === "assistant" ? styles.chatBubbleCoach : styles.chatBubbleUser}
                className={`idea-generator-bubble ${msg.role === "assistant" ? "idea-generator-bubble--coach" : "idea-generator-bubble--user"}`}
              >
                <strong style={{ display: "block", marginBottom: 4 }}>{msg.role === "assistant" ? "Coach" : "You"}</strong>
                <div style={{ whiteSpace: "pre-wrap" }}>
                  {msg.role === "assistant" ? renderCoachMessage(msg.content) : msg.content}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={styles.label}>Your next question or idea</label>
            <textarea
              style={styles.textareaSmall}
              value={ideaInput}
              onChange={(e) => setIdeaInput(e.target.value)}
              placeholder="Paste the exam question or describe the part you want help drafting."
              rows={3}
            />
          </div>

          <div
            style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}
            className="idea-generator-actions"
          >
            <button style={styles.primaryButton} onClick={handleAskForIdeas} disabled={ideasLoading}>
              {ideasLoading ? "Coach is typing..." : "Send to ideas coach"}
            </button>
            <button style={styles.secondaryButton} onClick={startIdeasSession}>
              {ideaSessionActive ? "Restart ideas session" : "Start ideas session"}
            </button>
            <button style={styles.secondaryButton} onClick={endIdeasSession} disabled={!ideaSessionActive}>
              End ideas session
            </button>
            <button
              style={styles.secondaryButton}
              onClick={() => {
                setChatMessages([ideaCoachIntro]);
                setIdeaInput("");
                resetErrors();
                setSelectedDraftIds([]);
                setEditableDraftById({});
                setHiddenDraftIds([]);
                setIdeaDraftWorkspace("");
                setIdeaSessionActive(false);
                setIdeaTurnCount(0);
              }}
            >
              Reset chat
            </button>
          </div>

          {ideaError && (
            <div style={{ ...styles.errorBox, marginTop: 8 }}>
              <strong>{isFrenchProgram ? "Note" : "Hinweis"}:</strong> {ideaError}
            </div>
          )}

          <div style={{ marginTop: 16 }}>
            <h4 style={styles.resultHeading}>Preview & quick copy</h4>
            <p style={styles.helperText}>
              Build one draft here, then send it to Mark my letter.
            </p>
            <div
              style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}
              className="idea-generator-panel"
            >
              <div>
                <label style={styles.label}>Draft workspace</label>
                <textarea
                  style={styles.textareaSmall}
                  value={ideaDraftWorkspace}
                  onChange={(event) => {
                    setIdeaDraftWorkspace(event.target.value);
                    setIdeaError("");
                    setIdeaSuccess("");
                  }}
                  placeholder="Write your best draft here before sending it to Mark my letter."
                />
                <div style={{ ...styles.helperText, marginTop: 4, marginBottom: 0 }}>{countWords(ideaDraftWorkspace)} words</div>
              </div>

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

        </section>
      )}

      {activeTab === "tutor" && isCampusMode && (
        <section style={styles.card}>
          <h3 style={{ ...styles.sectionTitle, marginTop: 0, marginBottom: 4 }}>Tutor Feedback</h3>
          <p style={{ ...styles.helperText, marginTop: 0 }}>View tutor responses on your writing submissions and reply quickly.</p>
          <div style={{ ...styles.infoBox, display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>ℹ️</span>
            <div>This page is focused on tutor updates only to keep feedback easy to track.</div>
          </div>
          {!tutorReviewCloudEnabled ? (
            <div style={styles.errorBox}>Tutor feedback sync is unavailable because Firebase is not configured.</div>
          ) : (
            <>
              <div style={{ ...styles.helperCard, marginTop: 10 }}>
                {tutorReviews.length ? (
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
                  </>
                ) : null}
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
                  <p style={{ ...styles.helperText, margin: "0 0 8px" }}>Reviewed: {new Date(latestTutorReview.reviewedAt).toLocaleString()}</p>
                ) : null}
                {latestTutorReview?.tutorFeedback ? (
                  <pre
                    style={{
                      ...styles.pre,
                      whiteSpace: "pre-wrap",
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
                  <p style={{ ...styles.helperText, margin: 0 }}>No tutor notes yet. Send a question from Mark my letter.</p>
                )}
              </div>
              <div style={{ ...styles.helperCard, marginTop: 10 }}>
                <label style={styles.label}>Reply to tutor</label>
                <textarea
                  style={{ ...styles.textArea, marginTop: 6, minHeight: 130, borderRadius: 14, border: "1px solid #cbd5e1" }}
                  rows={4}
                  value={studentReplyText}
                  onChange={(event) => {
                    setStudentReplyText(event.target.value);
                    setStudentReplyState({ loading: false, success: "", error: "" });
                  }}
                  placeholder="Ask a follow-up question or confirm what you will fix next."
                />
                <button
                  type="button"
                  style={{ ...styles.primaryButton, marginTop: 8 }}
                  onClick={handleStudentReply}
                  disabled={studentReplyState.loading || !latestTutorReview?.id}
                >
                  {studentReplyState.loading ? "Sending..." : "Send reply"}
                </button>
                {studentReplyState.error ? <p style={{ ...styles.helperText, color: "#b91c1c" }}>{studentReplyState.error}</p> : null}
                {studentReplyState.success ? <p style={{ ...styles.helperText, color: "#166534" }}>{studentReplyState.success}</p> : null}
              </div>
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
            </>
          )}
        </section>
      )}

      <ResultHistory results={resultHistory} />
    </div>
  );
};

export default LetterPracticePage;
