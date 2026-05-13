import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { styles } from "../styles";
import { InfoBox } from "./ui";
import ExamReadinessBadge from "./ExamReadinessBadge";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { ALLOWED_LEVELS } from "../context/ExamContext";
import { courseSchedules } from "../data/courseSchedule";
import { getCurriculumEntriesForLevel } from "../data/germanAssignmentCatalog";
import { resolveAssignmentCanonicalKey } from "../utils/assignmentIdentity";
import { mergeAssignmentProgress } from "../utils/assignmentProgress";
import { fetchAnswerKeyRegistry, resolveAnswerKeySource } from "../services/answerKeyRegistryService";
import { triggerInteractionFeedback } from "../services/interactionFeedback";
import {
  addDoc,
  collection,
  db,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "../firebase";

const SUBMISSION_COLLECTION = "submissions";
const DRAFT_COLLECTION = "submissionDrafts";
const LOCK_COLLECTION = "submissionLocks";
const MIN_SUBMISSION_CHARACTERS = 80;
const MIN_RESUBMISSION_IMPROVEMENT_CHARACTERS = 25;
const MIN_RESUBMISSION_CHANGED_CHARACTERS = 40;
const MIN_RESUBMISSION_NEW_WORDS = 8;
const MIN_OBJECTIVE_CHANGED_ANSWERS = 3;
const MAX_RESUBMISSION_TRIES = 2;
const ACTION_COOLDOWN_MS = 10 * 60 * 1000;
const ABSOLUTE_MAX_SUBMISSION_CHARACTERS = 12000;
const BASE_MAX_BY_LEVEL = { A1: 2500, A2: 3200, B1: 4200, B2: 5500, C1: 7000, C2: 8500 };
const MAX_ASSIGNMENT_DAY_BY_LEVEL = { A1: 22, A2: 28, B1: 28 };
const PASS_THRESHOLD_SCORE = 60;
const GERMAN_SPECIAL_CHARACTERS = ["ä", "ö", "ü", "ß", "Ä", "Ö", "Ü"];

const formatDate = (timestamp) => {
  if (!timestamp) return "–";

  const date =
    typeof timestamp?.toDate === "function"
      ? timestamp.toDate()
      : new Date(timestamp?.seconds ? timestamp.seconds * 1000 : timestamp);

  if (!date || Number.isNaN(date.getTime())) return "–";

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const normalizeIdPart = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9._-]/g, "_")
    .slice(0, 120);

const safeLower = (v) => String(v || "").toLowerCase();

const normalizeAssignmentIdentity = (value) => String(value || "").toLowerCase().replace(/\s+/g, "").replace(/_/g, "-").trim();

const normalizeSubmissionText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const tokenizeSubmission = (value) =>
  normalizeSubmissionText(value)
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .split(" ")
    .map((token) => token.trim())
    .filter(Boolean);

const countNewWordOccurrences = (previousText, currentText) => {
  const previousWordCounts = tokenizeSubmission(previousText).reduce((counts, word) => {
    counts.set(word, (counts.get(word) || 0) + 1);
    return counts;
  }, new Map());

  return tokenizeSubmission(currentText).reduce((newWordCount, word) => {
    const remainingCount = previousWordCounts.get(word) || 0;
    if (remainingCount > 0) {
      previousWordCounts.set(word, remainingCount - 1);
      return newWordCount;
    }
    return newWordCount + 1;
  }, 0);
};

const SECTION_HEADING_REGEX = /^teil\s*:?[\s-]*([a-z0-9._-]+)/i;
const SINGLE_OBJECTIVE_ANSWER_REGEX = /^(\d+)\s*[).:-]?\s*([a-zA-Z0-9]+)$/;
const INLINE_OBJECTIVE_ANSWER_REGEX = /(\d+)\s*[).:-]?\s*([a-zA-Z0-9]+)(?=\s+\d+\s*[).:-]?\s*[a-zA-Z0-9]+|\s*$)/g;

const normalizeInlineObjectiveSequence = (value) =>
  String(value || "")
    .trim()
    .replace(/\s+/g, " ");

const analyzeObjectiveAnswers = (value) => {
  const lines = String(value || "").split(/\r?\n/);
  const answersByQuestion = new Map();
  let currentSection = "default";
  let hasNonObjectiveNumberedLines = false;

  lines.forEach((line) => {
    const trimmedLine = String(line || "").trim();
    if (!trimmedLine) return;

    const sectionMatch = SECTION_HEADING_REGEX.exec(trimmedLine);
    if (sectionMatch?.[1]) {
      currentSection = sectionMatch[1].toLowerCase();
      return;
    }

    const singleMatch = SINGLE_OBJECTIVE_ANSWER_REGEX.exec(trimmedLine);
    if (singleMatch) {
      const questionNumber = String(singleMatch[1] || "").trim();
      const answer = String(singleMatch[2] || "").trim().toLowerCase();
      if (questionNumber && answer) answersByQuestion.set(`${currentSection}::${questionNumber}`, answer);
      return;
    }

    const inlineMatches = [...trimmedLine.matchAll(INLINE_OBJECTIVE_ANSWER_REGEX)];
    if (inlineMatches.length) {
      const normalizedLine = normalizeInlineObjectiveSequence(trimmedLine);
      const normalizedMatches = normalizeInlineObjectiveSequence(inlineMatches.map((match) => match[0]).join(" "));
      if (normalizedLine === normalizedMatches) {
        inlineMatches.forEach((match) => {
          const questionNumber = String(match[1] || "").trim();
          const answer = String(match[2] || "").trim().toLowerCase();
          if (questionNumber && answer) answersByQuestion.set(`${currentSection}::${questionNumber}`, answer);
        });
        return;
      }
    }

    if (/^\d+\s*[).:-]?\s*\S+/.test(trimmedLine)) {
      hasNonObjectiveNumberedLines = true;
    }
  });

  return {
    answersByQuestion: answersByQuestion.size ? answersByQuestion : null,
    hasNonObjectiveNumberedLines,
  };
};

const parseObjectiveAnswers = (value) => analyzeObjectiveAnswers(value).answersByQuestion;

const countCharacterChanges = (previousText, currentText) => {
  const previousNormalized = normalizeSubmissionText(previousText);
  const currentNormalized = normalizeSubmissionText(currentText);
  const minLength = Math.min(previousNormalized.length, currentNormalized.length);

  let mismatches = 0;
  for (let index = 0; index < minLength; index += 1) {
    if (previousNormalized[index] !== currentNormalized[index]) mismatches += 1;
  }

  return mismatches + Math.abs(currentNormalized.length - previousNormalized.length);
};

const buildResubmissionDiff = ({ previousSubmissionText, currentSubmissionText }) => {
  const previousNormalized = normalizeSubmissionText(previousSubmissionText);
  const currentNormalized = normalizeSubmissionText(currentSubmissionText);

  if (!previousNormalized || !currentNormalized) {
    return {
      mode: "text",
      changedCharacters: 0,
      newWordsCount: 0,
    };
  }

  const previousObjectiveAnalysis = analyzeObjectiveAnswers(previousSubmissionText);
  const currentObjectiveAnalysis = analyzeObjectiveAnswers(currentSubmissionText);
  const previousObjective = previousObjectiveAnalysis.answersByQuestion;
  const currentObjective = currentObjectiveAnalysis.answersByQuestion;

  const changedCharacters = countCharacterChanges(previousSubmissionText, currentSubmissionText);
  const newWordsCount = countNewWordOccurrences(previousSubmissionText, currentSubmissionText);

  if (
    previousObjective &&
    currentObjective &&
    !previousObjectiveAnalysis.hasNonObjectiveNumberedLines &&
    !currentObjectiveAnalysis.hasNonObjectiveNumberedLines
  ) {
    const overlappingQuestions = [...previousObjective.keys()].filter((question) => currentObjective.has(question));
    if (overlappingQuestions.length >= 3) {
      const changedAnswers = overlappingQuestions.filter(
        (question) => previousObjective.get(question) !== currentObjective.get(question)
      ).length;

      return {
        mode: "objective",
        changedAnswers,
        overlappingQuestions: overlappingQuestions.length,
        changedCharacters,
        newWordsCount,
      };
    }
  }

  return {
    mode: "text",
    changedCharacters,
    newWordsCount,
  };
};

const buildStudentScopeKey = ({ userId, studentCode, studentEmail }) =>
  [userId, studentCode, studentEmail]
    .map((part) => normalizeIdPart(part || ""))
    .filter(Boolean)
    .join("__") || "anonymous";

const resolvePreferredStudentName = ({ studentProfile, userDisplayName, userEmail }) => {
  const profileNameCandidates = [
    studentProfile?.name,
    studentProfile?.fullName,
    studentProfile?.displayName,
    [studentProfile?.firstName, studentProfile?.lastName].filter(Boolean).join(" "),
    studentProfile?.firstName,
  ];

  const profileName = profileNameCandidates.map((value) => String(value || "").trim()).find(Boolean);
  if (profileName) return profileName;

  const authName = String(userDisplayName || "").trim();
  if (authName) return authName;

  const emailLocalPart = String(userEmail || "").split("@")[0]?.trim();
  if (emailLocalPart) return emailLocalPart;

  return "";
};

const doesEntryMatchSelectedAssignment = ({
  entry,
  selectedAssignmentId,
  selectedCanonicalAssignmentKey,
  selectedChapterKey,
  assignmentTitle,
  buildChapterKey,
}) => {
  const normalizedSelectedKeys = [selectedCanonicalAssignmentKey, selectedAssignmentId]
    .map((value) => normalizeAssignmentIdentity(value))
    .filter(Boolean);

  const normalizedEntryKeys = [
    entry?.canonicalAssignmentKey,
    entry?.assignmentKey,
    entry?.assignmentId,
    entry?.assignment_id,
  ]
    .map((value) => normalizeAssignmentIdentity(value))
    .filter(Boolean);

  if (normalizedSelectedKeys.length && normalizedEntryKeys.length) {
    return normalizedEntryKeys.some((value) => normalizedSelectedKeys.includes(value));
  }

  const entryChapterKey = entry?.chapterKey || buildChapterKey(entry?.assignmentTitle || entry?.title || "");
  if (selectedChapterKey && entryChapterKey) return entryChapterKey === selectedChapterKey;

  return safeLower(entry?.assignmentTitle || entry?.title) === safeLower(assignmentTitle);
};

const buildSubmissionFingerprint = ({ assignmentTitle, chapterKey, submissionText }) =>
  `${normalizeIdPart(assignmentTitle)}::${normalizeIdPart(chapterKey)}::${normalizeIdPart(
    normalizeSubmissionText(submissionText)
  ).slice(0, 240)}`;

const toDateValue = (timestamp) => {
  if (!timestamp) return null;
  if (typeof timestamp?.toDate === "function") return timestamp.toDate();
  if (timestamp?.seconds) return new Date(timestamp.seconds * 1000);

  const fallback = new Date(timestamp);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
};

const getBaseMaxByLevel = (level) => BASE_MAX_BY_LEVEL[level] || 4200;

const normalizeLevel = (level) => {
  const normalized = String(level || "").toUpperCase();
  return ALLOWED_LEVELS.includes(normalized) ? normalized : "GENERAL";
};

const levelMatches = (entryLevel, selectedLevel) => {
  const normalizedEntryLevel = normalizeLevel(entryLevel);
  const normalizedSelectedLevel = normalizeLevel(selectedLevel);

  return normalizedEntryLevel === "GENERAL" || normalizedEntryLevel === normalizedSelectedLevel;
};

const formatCharacterCount = (count) => new Intl.NumberFormat().format(count);

const toChapterSortValue = (chapter) => {
  const token = String(chapter || "").trim();
  if (!token) return Number.POSITIVE_INFINITY;

  const parts = token.split(".").map((part) => Number(part));
  if (!parts.every((part) => Number.isFinite(part))) return Number.POSITIVE_INFINITY;

  return parts.reduce((acc, part, index) => acc + part / 10 ** (index * 2), 0);
};

const parseDayFromTitle = (title) => {
  const dayMatch = /^.*?\bday\s*(\d+)/i.exec(title || "");
  return dayMatch?.[1] ? Number(dayMatch[1]) : null;
};

const parseChapterFromTitle = (title) => {
  const chapterMatch = /chapter\s*([a-z0-9._-]+)/i.exec(title || "");
  return chapterMatch?.[1] ? String(chapterMatch[1]).trim() : "";
};


const getMaxAssignmentDayForLevel = (level) => {
  const normalizedLevel = String(level || "").toUpperCase();
  return MAX_ASSIGNMENT_DAY_BY_LEVEL[normalizedLevel] ?? 28;
};

const isDayWithinSubmissionWindow = (level, day) => {
  const numericDay = Number(day);
  if (!Number.isFinite(numericDay)) return true;
  if (numericDay <= 0) return false;
  return numericDay <= getMaxAssignmentDayForLevel(level);
};

const getFeedbackFromSubmission = (entry) =>
  entry?.feedback || entry?.tutorFeedback || entry?.reviewFeedback || entry?.reviewNotes || "";

const toNumericScore = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const normalized = value.replace("%", "").trim();
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const normalizePreferredLevel = (rawLevel) => {
  const token = String(rawLevel || "").toUpperCase();
  const directMatch = token.match(/\b(A1|A2|B1|B2|C1|C2)\b/);
  return directMatch ? directMatch[1] : "A1";
};

const AssignmentSubmissionPage = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { showToast } = useToast();
  const { user, studentProfile } = useAuth();
  const [badgeRefreshToken, setBadgeRefreshToken] = useState(0);
  const [openedFeedbackId, setOpenedFeedbackId] = useState(null);

  const preferredLevel = useMemo(
    () => normalizePreferredLevel(studentProfile?.level),
    [studentProfile?.level]
  );

  const studentCode = useMemo(
    () => studentProfile?.studentCode || studentProfile?.studentcode || studentProfile?.id || "",
    [studentProfile?.id, studentProfile?.studentCode, studentProfile?.studentcode]
  );
  const studentName = useMemo(
    () =>
      resolvePreferredStudentName({
        studentProfile,
        userDisplayName: user?.displayName,
        userEmail: user?.email,
      }),
    [studentProfile, user?.displayName, user?.email]
  );

  const studentScopeKey = useMemo(
    () =>
      buildStudentScopeKey({
        userId: user?.uid,
        studentCode,
        studentEmail: user?.email,
      }),
    [studentCode, user?.email, user?.uid]
  );

  const assignmentDictionary = useMemo(
    () =>
      [preferredLevel].flatMap((dictionaryLevel) => {
        const levelSchedule = courseSchedules[dictionaryLevel] || [];
        const curriculumEntries = getCurriculumEntriesForLevel(dictionaryLevel);
        const entriesByDay = curriculumEntries.reduce((acc, entry) => {
          const day = Number(entry?.assignmentDay);
          if (!Number.isFinite(day) || day < 0) return acc;
          if (!acc[day]) acc[day] = [];
          acc[day].push(entry);
          return acc;
        }, {});

        const dictionaryEntries = Object.entries(entriesByDay)
          .sort((a, b) => Number(a[0]) - Number(b[0]))
          .flatMap(([dayKey, entries]) => {
            const day = Number(dayKey);
            return entries
              .slice()
              .sort((a, b) => toChapterSortValue(a?.chapter) - toChapterSortValue(b?.chapter))
              .map((entry, index) => {
                const occurrence = index + 1;
                const duplicateSuffix = entries.length > 1 ? ` • Task ${occurrence}` : "";
                const chapter = entry?.chapter || "";
                const chapterSuffix = chapter ? ` • Chapter ${chapter}` : "";
                const modeSuffix = entry?.mode ? ` • ${entry.mode}` : "";
                const label = `${dictionaryLevel} • Day ${day}${duplicateSuffix}: ${entry.topic}${chapterSuffix}${modeSuffix}`;
                const assignmentId = entry?.assignment_id || null;
                const canonicalAssignmentId =
                  assignmentId ||
                  resolveAssignmentCanonicalKey({
                    level: dictionaryLevel,
                    assignmentId,
                    assignmentTitle: label,
                  });

                return {
                  level: dictionaryLevel,
                  day,
                  topic: entry.topic,
                  chapter,
                  occurrence,
                  label,
                  assignmentId,
                  canonicalAssignmentId,
                  assignmentKey: canonicalAssignmentId,
                  assignment: Boolean(entry.assignment),
                  progressionEligible: entry.progressionEligible !== false,
                  sourceType: entry.mode || "curriculum",
                };
              });
          });

        const dayZeroEntry = levelSchedule.find((entry) => Number(entry?.day) === 0 && entry?.topic);
        if (dayZeroEntry) {
          const label = `${dictionaryLevel} • Day 0: ${dayZeroEntry.topic}${dayZeroEntry.chapter ? ` • Chapter ${dayZeroEntry.chapter}` : ""}`;
          dictionaryEntries.unshift({
            level: dictionaryLevel,
            day: 0,
            topic: dayZeroEntry.topic,
            chapter: dayZeroEntry.chapter || "",
            occurrence: 1,
            label,
            assignmentId: null,
            canonicalAssignmentId: resolveAssignmentCanonicalKey({
              level: dictionaryLevel,
              assignmentId: `DAY-0`,
              assignmentTitle: label,
            }),
            assignmentKey: resolveAssignmentCanonicalKey({
              level: dictionaryLevel,
              assignmentId: `DAY-0`,
              assignmentTitle: label,
            }),
            assignment: false,
            progressionEligible: false,
            sourceType: "orientation",
          });
        }

        return dictionaryEntries;
      }),
    [preferredLevel]
  );

  const assignmentRequiredDaysLabel = useMemo(() => {
    const assignmentDays = assignmentDictionary
      .filter((entry) => entry.assignment && isDayWithinSubmissionWindow(entry.level || preferredLevel, entry.day))
      .map((entry) => entry.day)
      .filter((day, index, arr) => arr.indexOf(day) === index)
      .sort((a, b) => Number(a) - Number(b));

    if (!assignmentDays.length) return "";

    return assignmentDays.map((day) => `Day ${day}`).join(", ");
  }, [assignmentDictionary, preferredLevel]);

  const deriveAssignmentDay = useCallback(
    (title) => {
      const entry = assignmentDictionary.find((item) => item.label === title);
      if (typeof entry?.day !== "undefined") return entry.day;
      return parseDayFromTitle(title);
    },
    [assignmentDictionary]
  );

  const deriveAssignmentChapter = useCallback(
    (title) => {
      const entry = assignmentDictionary.find((item) => item.label === title);
      if (entry?.chapter) return String(entry.chapter).trim();
      return parseChapterFromTitle(title);
    },
    [assignmentDictionary]
  );

  const assignmentOptions = useMemo(() => {
    const names = [];
    const includeDiagnostics = [];
    const courseFallbackNames = assignmentDictionary
      .filter(
        ({ assignment, progressionEligible, day, level }) =>
          assignment && progressionEligible && isDayWithinSubmissionWindow(level || preferredLevel, day)
      )
      .map(({ label }) => label);
    const tutorMarkedLabels = new Set(
      assignmentDictionary.filter(({ assignment, progressionEligible }) => assignment && progressionEligible).map(({ label }) => label)
    );

    const addIfTutorMarked = (value, source) => {
      if (!value) return;
      const label = value.toString();
      if (tutorMarkedLabels.has(label)) {
        if (!names.includes(label)) names.push(label);
        return;
      }

      const dayNumber = deriveAssignmentDay(label);
      const maxDayForLevel = getMaxAssignmentDayForLevel(preferredLevel);
      const blockedByDayZero = dayNumber === 0;
      const blockedByAssignmentWindow = Number.isFinite(dayNumber) && dayNumber > maxDayForLevel;
      includeDiagnostics.push({
        source,
        label,
        dayNumber: Number.isFinite(dayNumber) ? dayNumber : null,
        blocked: true,
        blockedByDayZero,
        blockedByAssignmentWindow,
        maxDayForLevel,
        blockedByTutorMarkedFilter: true,
      });
    };

    assignmentDictionary
      .filter(
        ({ assignment, progressionEligible, day, level }) =>
          assignment && progressionEligible && isDayWithinSubmissionWindow(level || preferredLevel, day)
      )
      .forEach(({ label }) => addIfTutorMarked(label, "courseSchedule"));

    addIfTutorMarked(studentProfile?.assignmentTitle, "studentProfile.assignmentTitle");

    if (Array.isArray(studentProfile?.assignments)) {
      studentProfile.assignments.forEach((name) => addIfTutorMarked(name, "studentProfile.assignments"));
    }
    if (Array.isArray(studentProfile?.assignmentTitles)) {
      studentProfile.assignmentTitles.forEach((name) => addIfTutorMarked(name, "studentProfile.assignmentTitles"));
    }

    if (includeDiagnostics.length) {
      console.debug("[AssignmentSubmissionPage][Diagnostic][FilteredNonTutorOptions]", {
        preferredLevel,
        blockedSources: includeDiagnostics,
      });
    }

    if (names.length) return names;
    if (courseFallbackNames.length) return courseFallbackNames;
    return ["General submission", "Standard assignment"];
  }, [
    assignmentDictionary,
    deriveAssignmentDay,
    preferredLevel,
    studentProfile?.assignmentTitle,
    studentProfile?.assignmentTitles,
    studentProfile?.assignments,
  ]);

  const [form, setForm] = useState({
    assignmentTitle: "",
    submissionText: "",
    confirmed: false,
  });

  const [status, setStatus] = useState({ loading: false, error: "", success: "" });
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

  const [lockedChapters, setLockedChapters] = useState(new Set());
  const [lockInfoByChapterKey, setLockInfoByChapterKey] = useState({}); // { [chapterKey]: { lockedAt, assignmentTitle } }

  const [confirmationLocked, setConfirmationLocked] = useState(false);
  const [draftsByAssignment, setDraftsByAssignment] = useState({});

  const [preview, setPreview] = useState(null); // { assignmentTitle, submissionText, createdAt }
  const [copyStatus, setCopyStatus] = useState("");
  const [autosaveStatus, setAutosaveStatus] = useState({ state: "idle", savedAt: null });
  const [resubmissionText, setResubmissionText] = useState("");
  const [resubmissionImprovement, setResubmissionImprovement] = useState("");
  const [resubmissionStatus, setResubmissionStatus] = useState({ loading: false, error: "", success: "" });

  useEffect(() => {
    if (status.error) {
      triggerInteractionFeedback({ sound: "error" });
    }
  }, [status.error]);

  useEffect(() => {
    if (resubmissionStatus.error) {
      triggerInteractionFeedback({ sound: "error" });
    }
  }, [resubmissionStatus.error]);
  const [answerKeyRegistry, setAnswerKeyRegistry] = useState(new Map());

  const isGerman = String(i18n?.resolvedLanguage || i18n?.language || "en").toLowerCase().startsWith("de");
  const uiText = useMemo(
    () =>
      isGerman
        ? {
            pageTitle: "Aufgabe einreichen",
            pageHelper:
              "Schreibe deine Lösung unten als Text. Klasse, Niveau, Schülercode und E-Mail werden automatisch ergänzt, um Fehler zu vermeiden. Scrolle nach unten und tippe deine Antworten direkt ein — du lädst keine Datei hoch.",
            orientationOnly: "Nur Orientierungstag",
            statusSubmittable: "Diese Aufgabe ist einreichbar",
            statusNotSubmittable: "Diese Aufgabe ist nicht einreichbar",
            reasonLabel: "Grund",
            ctaFirstSubmission: "Reiche deine erste Aufgabe ein.",
            quickOpenFeedback: "Feedback öffnen",
          }
        : {
            pageTitle: "Submit Assignment",
            pageHelper:
              "Write your solution below as text. Your class, level, student code, and email are auto-filled to avoid mistakes. Scroll down and type your answers directly — you do not upload a file.",
            orientationOnly: "Orientation only",
            statusSubmittable: "This assignment is submittable",
            statusNotSubmittable: "This assignment is not submittable",
            reasonLabel: "Reason",
            ctaFirstSubmission: "Submit your first assignment.",
            quickOpenFeedback: "Open feedback",
          },
    [isGerman]
  );

  const lastAssignmentRef = useRef("");
  const autosaveTimerRef = useRef(null);
  const lastAutosavedRef = useRef({ assignmentTitle: "", submissionText: "" });
  const submissionTextRef = useRef(null);

  const buildChapterKey = useCallback(
    (title) => {
      if (!title) return null;

      const entry = assignmentDictionary.find((item) => item.label === title);
      if (entry?.chapter) return `chapter-${normalizeIdPart(entry.chapter)}`;
      if (typeof entry?.day !== "undefined") {
        if (entry.occurrence && entry.occurrence > 1) return `day-${entry.day}-task-${entry.occurrence}`;
        return `day-${entry.day}`;
      }

      const chapterMatch = /chapter\s*([a-z0-9._-]+)/i.exec(title);
      if (chapterMatch?.[1]) return `chapter-${normalizeIdPart(chapterMatch[1])}`;

      const dayTaskMatch = /^day\s*(\d+)\s*[•\-|:]?\s*task\s*(\d+)/i.exec(title);
      if (dayTaskMatch?.[1] && dayTaskMatch?.[2]) return `day-${dayTaskMatch[1]}-task-${dayTaskMatch[2]}`;

      const dayMatch = /^day\s*(\d+)/i.exec(title);
      if (dayMatch?.[1]) return `day-${dayMatch[1]}`;

      return String(title).toLowerCase().trim();
    },
    [assignmentDictionary]
  );

  const buildAssignmentId = useCallback(
    (title) => {
      if (!title) return null;

      const entry = assignmentDictionary.find((item) => item.label === title);
      const normalizedLevel = normalizeIdPart(entry?.level || preferredLevel || "general");

      if (entry?.canonicalAssignmentId) return entry.canonicalAssignmentId;
      if (entry?.assignmentId) return `${normalizedLevel}-${normalizeIdPart(entry.assignmentId)}`;
      if (entry?.chapter) return `${normalizedLevel}-${normalizeIdPart(entry.chapter)}`;

      const chapterMatch = String(title).match(/\b(\d+(?:\.\d+)?)\b/);
      if (chapterMatch?.[1]) return `${normalizedLevel}-${normalizeIdPart(chapterMatch[1])}`;

      const chapterKey = buildChapterKey(title);
      if (chapterKey) return `${normalizedLevel}-${normalizeIdPart(chapterKey)}`;

      return `${normalizedLevel}-${normalizeIdPart(title)}`;
    },
    [assignmentDictionary, buildChapterKey, preferredLevel]
  );

  const requestedAssignmentKey = useMemo(
    () =>
      location?.state?.assignmentKey ||
      location?.state?.canonicalAssignmentKey ||
      new URLSearchParams(location?.search || "").get("assignmentKey") ||
      "",
    [location?.search, location?.state]
  );

  const requestedAssignmentMatch = useMemo(() => {
    if (!requestedAssignmentKey || !assignmentDictionary.length) return null;
    const requestedNormalized = normalizeAssignmentIdentity(requestedAssignmentKey);
    return (
      assignmentDictionary.find(
        (entry) => normalizeAssignmentIdentity(entry.assignmentKey || entry.canonicalAssignmentId || "") === requestedNormalized
      ) || null
    );
  }, [assignmentDictionary, requestedAssignmentKey]);

  const [assignmentSelectionUnlocked, setAssignmentSelectionUnlocked] = useState(false);
  const isAssignmentContextLocked = Boolean(requestedAssignmentMatch && !assignmentSelectionUnlocked);

  const selectedAssignmentEntry = useMemo(
    () => assignmentDictionary.find((item) => item.label === form.assignmentTitle) || null,
    [assignmentDictionary, form.assignmentTitle]
  );

  const selectedAssignmentDay = useMemo(
    () => (form.assignmentTitle ? deriveAssignmentDay(form.assignmentTitle) : null),
    [deriveAssignmentDay, form.assignmentTitle]
  );

  const selectedAssignmentChapter = useMemo(
    () => (form.assignmentTitle ? deriveAssignmentChapter(form.assignmentTitle) : ""),
    [deriveAssignmentChapter, form.assignmentTitle]
  );

  const selectedAssignmentId = useMemo(
    () => (form.assignmentTitle ? buildAssignmentId(form.assignmentTitle) : null),
    [buildAssignmentId, form.assignmentTitle]
  );

  const selectedAssignmentLevel = useMemo(() => {
    const rawLevel = selectedAssignmentEntry?.level || preferredLevel;
    return ALLOWED_LEVELS.includes(rawLevel) ? rawLevel : "GENERAL";
  }, [preferredLevel, selectedAssignmentEntry?.level]);

  const selectedCanonicalAssignmentKey = useMemo(
    () =>
      form.assignmentTitle
        ? resolveAssignmentCanonicalKey({
            level: selectedAssignmentLevel,
            assignmentId: selectedAssignmentId,
            assignmentTitle: form.assignmentTitle,
          })
        : "",
    [form.assignmentTitle, selectedAssignmentId, selectedAssignmentLevel]
  );

  const getLockDocId = useCallback(
    (assignmentTitle) => {
      const chapterKey = buildChapterKey(assignmentTitle) || "unknown";
      const assignmentLevel = assignmentDictionary.find((item) => item.label === assignmentTitle)?.level || preferredLevel;
      return `${studentScopeKey}__${normalizeIdPart(assignmentLevel)}__${normalizeIdPart(chapterKey)}`;
    },
    [assignmentDictionary, buildChapterKey, preferredLevel, studentScopeKey]
  );

  const getDraftDocId = useCallback(
    (assignmentTitle) => {
      const chapterKey = buildChapterKey(assignmentTitle) || "unknown";
      const assignmentLevel = assignmentDictionary.find((item) => item.label === assignmentTitle)?.level || preferredLevel;
      return `${studentScopeKey}__${normalizeIdPart(assignmentLevel)}__${normalizeIdPart(chapterKey)}`;
    },
    [assignmentDictionary, buildChapterKey, preferredLevel, studentScopeKey]
  );

  const buildSubmissionPayload = useCallback(
    (statusLabel) => {
      const answerKeySource = resolveAnswerKeySource(answerKeyRegistry, selectedCanonicalAssignmentKey);

      return {
      title: form.assignmentTitle,
      assignmentTitle: form.assignmentTitle,
      level: selectedAssignmentLevel,
      day: selectedAssignmentDay,
      chapter: selectedAssignmentChapter || "",
      assignmentId: selectedAssignmentId,
      assignmentKey: selectedCanonicalAssignmentKey || selectedAssignmentId,
      canonicalAssignmentKey: selectedCanonicalAssignmentKey || selectedAssignmentId,
      answerKeySource: answerKeySource
        ? {
            assignmentKey: answerKeySource.assignmentKey || selectedCanonicalAssignmentKey || selectedAssignmentId,
            answerUrl: answerKeySource.answer_url || answerKeySource.answerUrl || null,
            format: answerKeySource.format || null,
            version: answerKeySource.version || null,
          }
        : null,
      chapterKey: buildChapterKey(form.assignmentTitle),
      submissionLink: null,
      submissionText: form.submissionText.trim(),
      studentEmail: user?.email || "",
      studentId: user?.uid || "",
      studentCode,
      studentScopeKey,
      submissionFingerprint: buildSubmissionFingerprint({
        assignmentTitle: form.assignmentTitle,
        chapterKey: buildChapterKey(form.assignmentTitle),
        submissionText: form.submissionText,
      }),
      studentName,
      className: studentProfile?.className || "",
      status: statusLabel,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    },
    [
      answerKeyRegistry,
      buildChapterKey,
      form.assignmentTitle,
      form.submissionText,
      selectedAssignmentChapter,
      selectedAssignmentDay,
      selectedAssignmentId,
      selectedAssignmentLevel,
      selectedCanonicalAssignmentKey,
      studentCode,
      studentScopeKey,
      studentProfile?.className,
      studentName,
      user?.email,
      user?.uid,
    ]
  );

  const persistSubmission = useCallback(
    async ({ statusLabel = "submitted" } = {}) => {
      const trimmedText = form.submissionText.trim();
      if (!form.assignmentTitle || !trimmedText || !db || !user?.uid) return { ok: false, reason: "missing" };

      const submissionPayload = buildSubmissionPayload(statusLabel);

      // Drafts: deterministic doc ID -> no duplicates
      if (statusLabel === "draft") {
        const draftId = getDraftDocId(form.assignmentTitle);
        const draftRef = doc(db, DRAFT_COLLECTION, draftId);

        const existingDraft = draftsByAssignment[form.assignmentTitle];
        const payloadWithTimestamps = {
          ...submissionPayload,
          createdAt: existingDraft?.createdAt || submissionPayload.createdAt,
        };

        await setDoc(draftRef, payloadWithTimestamps, { merge: true });

        setDraftsByAssignment((prev) => ({
          ...prev,
          [form.assignmentTitle]: { id: draftId, ...payloadWithTimestamps },
        }));

        return { ok: true };
      }

      // Submitted: check lock first
      const lockId = getLockDocId(form.assignmentTitle);
      const lockRef = doc(db, LOCK_COLLECTION, lockId);

      const lockSnap = await getDoc(lockRef);
      if (lockSnap.exists()) {
        const chapterKey = buildChapterKey(form.assignmentTitle);
        if (chapterKey) setLockedChapters((prev) => new Set([...prev, chapterKey]));
        setConfirmationLocked(true);
        return { ok: false, reason: "locked" };
      }

      // Add submission history
      await addDoc(collection(db, SUBMISSION_COLLECTION), submissionPayload);

      // Create lock deterministically
      const nowLocal = new Date();
      await setDoc(
        lockRef,
        {
          studentId: user?.uid || "",
          studentEmail: user?.email || "",
          studentCode,
          level: selectedAssignmentLevel,
          lockedAt: serverTimestamp(),
          assignmentTitle: form.assignmentTitle,
          day: selectedAssignmentDay,
          chapter: selectedAssignmentChapter || "",
          chapterKey: buildChapterKey(form.assignmentTitle),
        },
        { merge: true }
      );

      const currentChapterKey = buildChapterKey(form.assignmentTitle);
      if (currentChapterKey) {
        setLockedChapters((prev) => new Set([...prev, currentChapterKey]));
        setLockInfoByChapterKey((prev) => ({
          ...prev,
          [currentChapterKey]: { lockedAt: nowLocal, assignmentTitle: form.assignmentTitle },
        }));
      }

      // Preview (use local time immediately)
      setPreview({
        assignmentTitle: form.assignmentTitle,
        submissionText: trimmedText,
        createdAt: nowLocal,
        assignmentId: selectedAssignmentId,
        canonicalAssignmentKey: selectedCanonicalAssignmentKey || selectedAssignmentId,
        chapterKey: currentChapterKey,
      });

      return { ok: true };
    },
    [
      buildChapterKey,
      buildSubmissionPayload,
      draftsByAssignment,
      form.assignmentTitle,
      form.submissionText,
      getDraftDocId,
      getLockDocId,
      selectedAssignmentChapter,
      selectedAssignmentDay,
      selectedAssignmentId,
      selectedAssignmentLevel,
      selectedCanonicalAssignmentKey,
      studentCode,
      user?.email,
      user?.uid,
    ]
  );

  useEffect(() => {
    let mounted = true;
    fetchAnswerKeyRegistry()
      .then((registry) => {
        if (mounted) setAnswerKeyRegistry(registry);
      })
      .catch(() => {
        if (mounted) setAnswerKeyRegistry(new Map());
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setAssignmentSelectionUnlocked(false);
  }, [requestedAssignmentKey]);

  useEffect(() => {
    if (!requestedAssignmentMatch?.label) return;

    setForm((prev) => {
      if (prev.assignmentTitle === requestedAssignmentMatch.label) return prev;
      const matchedDraft = draftsByAssignment[requestedAssignmentMatch.label];
      return {
        ...prev,
        assignmentTitle: requestedAssignmentMatch.label,
        submissionText: matchedDraft?.submissionText || prev.submissionText,
        confirmed: false,
      };
    });
  }, [draftsByAssignment, requestedAssignmentMatch]);

  useEffect(() => {
    if (form.assignmentTitle && assignmentOptions.includes(form.assignmentTitle)) return;
    if (requestedAssignmentMatch?.label) return;
    if (!assignmentOptions.length) return;

    setForm((prev) => {
      if (!prev.assignmentTitle) return prev;
      return {
        ...prev,
        assignmentTitle: "",
        submissionText: "",
        confirmed: false,
      };
    });
  }, [assignmentOptions, form.assignmentTitle, requestedAssignmentMatch]);

  useEffect(() => {
    const loadDraftsAndSubmissions = async () => {
      if (!db || !user?.uid) {
        setRecentSubmissions([]);
        setLockedChapters(new Set());
        setLockInfoByChapterKey({});
        setDraftsByAssignment({});
        return;
      }

      setSubmissionsLoading(true);
      try {
        // Recent submissions
        const submissionsRef = collection(db, SUBMISSION_COLLECTION);
        const submissionSnapshot = await getDocs(
          query(submissionsRef, where("studentId", "==", user.uid), orderBy("createdAt", "desc"), limit(25))
        );

        const entries = submissionSnapshot.docs
          .map((entry) => {
            const data = entry.data() || {};
            const computedAssignmentKey =
              data.assignmentKey ||
              data.canonicalAssignmentKey ||
              resolveAssignmentCanonicalKey({
                level: data.level || preferredLevel,
                assignmentId: data.assignmentId,
                assignmentTitle: data.assignmentTitle || data.title,
              });

            if (!data.assignmentKey && computedAssignmentKey) {
              setDoc(doc(db, SUBMISSION_COLLECTION, entry.id), { assignmentKey: computedAssignmentKey }, { merge: true }).catch(() => {});
            }

            return {
              id: entry.id,
              ...data,
              assignmentKey: computedAssignmentKey,
              canonicalAssignmentKey: computedAssignmentKey,
            };
          })
          .filter((entry) => levelMatches(entry.level, preferredLevel));
        setRecentSubmissions(entries);

        // Locks
        const lockRef = collection(db, LOCK_COLLECTION);
        const lockSnapshot = await getDocs(query(lockRef, where("studentId", "==", user.uid)));

        const locked = new Set();
        const lockMeta = {};

        lockSnapshot.docs.forEach((docSnap) => {
          const data = docSnap.data();
          if (!levelMatches(data.level, preferredLevel)) return;

          const chapterKey =
            data.chapterKey ||
            buildChapterKey(data.assignmentTitle) ||
            (data.chapter ? `day-${data.chapter}` : null);

          if (chapterKey) {
            locked.add(chapterKey);
            lockMeta[chapterKey] = {
              assignmentTitle: data.assignmentTitle || "",
              lockedAt: data.lockedAt || data.createdAt || null,
            };
          }
        });

        setLockedChapters(locked);
        setLockInfoByChapterKey(lockMeta);

        // Drafts
        const draftsRef = collection(db, DRAFT_COLLECTION);
        const draftSnapshot = await getDocs(
          query(draftsRef, where("studentId", "==", user.uid), orderBy("updatedAt", "desc"), limit(30))
        );

        const latestDrafts = {};
        draftSnapshot.docs.forEach((docSnap) => {
          const data = docSnap.data();
          const computedAssignmentKey =
            data.assignmentKey ||
            data.canonicalAssignmentKey ||
            resolveAssignmentCanonicalKey({
              level: data.level || preferredLevel,
              assignmentId: data.assignmentId,
              assignmentTitle: data.assignmentTitle || data.title,
            });
          if (!levelMatches(data.level, preferredLevel)) return;

          if (!data.assignmentKey && computedAssignmentKey) {
            setDoc(doc(db, DRAFT_COLLECTION, docSnap.id), { assignmentKey: computedAssignmentKey }, { merge: true }).catch(() => {});
          }

          const assignmentKey = data.assignmentTitle || data.title || assignmentOptions[0];
          if (!latestDrafts[assignmentKey]) {
            latestDrafts[assignmentKey] = {
              id: docSnap.id,
              ...data,
              assignmentKey: computedAssignmentKey,
              canonicalAssignmentKey: computedAssignmentKey,
            };
          }
        });
        setDraftsByAssignment(latestDrafts);
      } catch (error) {
        console.error("Failed to load submissions", error);
        setStatus((prev) => ({ ...prev, error: "Could not load your previous submissions." }));
      } finally {
        setSubmissionsLoading(false);
      }
    };

    loadDraftsAndSubmissions();
  }, [assignmentOptions, buildChapterKey, preferredLevel, user?.uid]);

  // When assignment changes, pull draft text (if any) into editor.
  useEffect(() => {
    const currentAssignment = form.assignmentTitle;
    const draft = draftsByAssignment[currentAssignment];
    const assignmentChanged = lastAssignmentRef.current !== currentAssignment;
    lastAssignmentRef.current = currentAssignment;

    if (assignmentChanged) {
      setForm((prev) => ({
        ...prev,
        submissionText: draft?.submissionText || "",
        confirmed: false,
      }));
      setStatus((prev) => ({ ...prev, error: "", success: "" }));
      setCopyStatus("");
      setAutosaveStatus((prev) => ({ ...prev, state: "idle" }));
      setResubmissionText(draft?.resubmissionText || "");
      setResubmissionImprovement(draft?.resubmissionImprovement || "");
      setResubmissionStatus({ loading: false, error: "", success: "" });
    } else if (!form.submissionText && draft?.submissionText) {
      setForm((prev) => ({
        ...prev,
        submissionText: draft.submissionText,
        confirmed: false,
      }));
    }

    if (!assignmentChanged && !resubmissionText && draft?.resubmissionText) {
      setResubmissionText(draft.resubmissionText);
    }

    if (!assignmentChanged && !resubmissionImprovement && draft?.resubmissionImprovement) {
      setResubmissionImprovement(draft.resubmissionImprovement);
    }
  }, [
    draftsByAssignment,
    form.assignmentTitle,
    form.submissionText,
    resubmissionImprovement,
    resubmissionText,
  ]);

  // Locked state for currently selected assignment.
  const selectedChapterKey = useMemo(
    () => buildChapterKey(form.assignmentTitle),
    [buildChapterKey, form.assignmentTitle]
  );

  const selectedLockInfo = useMemo(
    () => (selectedChapterKey ? lockInfoByChapterKey[selectedChapterKey] : null),
    [lockInfoByChapterKey, selectedChapterKey]
  );

  const isSelectedLocked = Boolean(selectedChapterKey && lockedChapters.has(selectedChapterKey));

  const isSameSelectedAssignment = useCallback(
    (entry) =>
      doesEntryMatchSelectedAssignment({
        entry,
        selectedAssignmentId,
        selectedCanonicalAssignmentKey,
        selectedChapterKey,
        assignmentTitle: form.assignmentTitle,
        buildChapterKey,
      }),
    [buildChapterKey, form.assignmentTitle, selectedAssignmentId, selectedCanonicalAssignmentKey, selectedChapterKey]
  );

  const selectedResubmissionCount = useMemo(() => {
    return recentSubmissions.reduce((count, entry) => {
      if (safeLower(entry?.status) !== "resubmitted") return count;

      return isSameSelectedAssignment(entry) ? count + 1 : count;
    }, 0);
  }, [isSameSelectedAssignment, recentSubmissions]);

  const selectedAssignmentPassedFromSubmission = useMemo(() => {
    return recentSubmissions.some((entry) => {
      if (!isSameSelectedAssignment(entry)) return false;

      const normalizedStatus = safeLower(entry?.reviewStatus || entry?.status || entry?.result);
      if (["approved", "pass", "passed", "complete", "completed"].includes(normalizedStatus)) return true;

      const score = toNumericScore(entry?.score ?? entry?.finalScore ?? entry?.mark ?? entry?.grade);
      return typeof score === "number" && score >= PASS_THRESHOLD_SCORE;
    });
  }, [isSameSelectedAssignment, recentSubmissions]);

  const remainingResubmissions = Math.max(0, MAX_RESUBMISSION_TRIES - selectedResubmissionCount);
  const resubmissionLimitReached = remainingResubmissions === 0;

  useEffect(() => {
    setConfirmationLocked(isSelectedLocked);
    if (isSelectedLocked) setForm((prev) => ({ ...prev, confirmed: true }));
  }, [isSelectedLocked]);

  useEffect(() => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = null;
    }

    if (isSelectedLocked || status.loading) return;

    const trimmedText = form.submissionText.trim();
    if (!trimmedText) return;

    const lastAutosaved = lastAutosavedRef.current;
    if (
      lastAutosaved.assignmentTitle === form.assignmentTitle &&
      lastAutosaved.submissionText === trimmedText
    ) {
      return;
    }

    setAutosaveStatus((prev) => ({ ...prev, state: "saving" }));
    autosaveTimerRef.current = setTimeout(async () => {
      try {
        const saved = await persistSubmission({ statusLabel: "draft" });
        if (saved.ok) {
          const nowLocal = new Date();
          lastAutosavedRef.current = { assignmentTitle: form.assignmentTitle, submissionText: trimmedText };
          setAutosaveStatus({ state: "saved", savedAt: nowLocal });
        } else {
          setAutosaveStatus((prev) => ({ ...prev, state: "idle" }));
        }
      } catch (error) {
        console.error("Autosave failed", error);
        setAutosaveStatus((prev) => ({ ...prev, state: "idle" }));
      }
    }, 900);

    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, [form.assignmentTitle, form.submissionText, isSelectedLocked, persistSubmission, status.loading]);

  // Preview for selected assignment:
  const selectedPreview = useMemo(() => {
    if (preview && isSameSelectedAssignment(preview)) return preview;

    const match = recentSubmissions.find((entry) => isSameSelectedAssignment(entry));

    if (!match?.submissionText) return null;

    return {
      assignmentTitle: match.assignmentTitle || match.title || form.assignmentTitle,
      submissionText: match.submissionText,
      createdAt: match.createdAt || match.updatedAt || null,
      assignmentId: match.assignmentId || match.assignment_id || null,
      canonicalAssignmentKey: match.canonicalAssignmentKey || match.assignmentKey || null,
      chapterKey: match.chapterKey || buildChapterKey(match.assignmentTitle || match.title || ""),
    };
  }, [buildChapterKey, form.assignmentTitle, isSameSelectedAssignment, preview, recentSubmissions]);

  const mergedProgressByTitle = useMemo(() => {
    const curriculumEntries = assignmentOptions.map((label) => ({
      level: preferredLevel,
      assignmentId: buildAssignmentId(label),
      title: label,
      assignmentDay: deriveAssignmentDay(label),
      assignment: true,
    }));

    const firestoreDrafts = Object.entries(draftsByAssignment || {}).map(([title, draft]) => ({
      ...(draft || {}),
      level: preferredLevel,
      assignmentTitle: title,
      assignmentId: buildAssignmentId(title),
    }));

    const firestoreSubmissions = (recentSubmissions || []).map((entry) => ({
      ...entry,
      level: entry.level || preferredLevel,
      assignmentId: entry.assignmentId || entry.assignment_id || entry.assignmentKey || buildAssignmentId(entry.assignmentTitle || entry.title),
    }));

    const merged = mergeAssignmentProgress({
      curriculumEntries,
      firestoreDrafts,
      firestoreSubmissions,
      sheetResults: firestoreSubmissions,
      studentCode,
    });

    return merged.reduce((acc, entry) => {
      const title = curriculumEntries.find((item) => item.assignmentId && item.assignmentId === entry.assignmentId)?.title;
      if (title) acc[title] = entry;
      return acc;
    }, {});
  }, [assignmentOptions, buildAssignmentId, deriveAssignmentDay, draftsByAssignment, preferredLevel, recentSubmissions, studentCode]);

  const maxUnlockedDay = useMemo(() => {
    const availableDays = recentSubmissions
      .filter((entry) => entry?.assignment)
      .map((entry) => Number(entry?.chapter))
      .filter((value) => Number.isFinite(value) && value >= 0);
    if (!availableDays.length) return Number.POSITIVE_INFINITY;
    return Math.max(1, ...availableDays) + 1;
  }, [recentSubmissions]);

  const decoratedAssignmentOptions = useMemo(() => {
    return assignmentOptions.map((opt) => {
      const key = buildChapterKey(opt);
      const optionAssignmentId = buildAssignmentId(opt);
      const dayNumber = deriveAssignmentDay(opt);
      const isDayZero = dayNumber === 0;
      const isNotYetAvailable =
        Number.isFinite(dayNumber) && Number.isFinite(maxUnlockedDay) && dayNumber > maxUnlockedDay;

      const hasSubmission = recentSubmissions.some((entry) => {
        const statusLabel = safeLower(entry?.status);
        if (!["submitted", "resubmitted"].includes(statusLabel)) return false;

        const entryAssignmentId = entry?.assignmentId || entry?.assignment_id || entry?.assignmentKey || null;
        if (optionAssignmentId && entryAssignmentId) {
          return normalizeAssignmentIdentity(optionAssignmentId) === normalizeAssignmentIdentity(entryAssignmentId);
        }

        const entryChapterKey = entry?.chapterKey || buildChapterKey(entry?.assignmentTitle || entry?.title || "");
        if (key && entryChapterKey) return key === entryChapterKey;

        return safeLower(entry?.assignmentTitle || entry?.title) === safeLower(opt);
      });

      const progress = mergedProgressByTitle[opt] || null;
      const submitted = Boolean((key && lockedChapters.has(key)) || hasSubmission || progress?.submitted);
      const hasDraft = Boolean(progress?.hasDraft || String(draftsByAssignment?.[opt]?.submissionText || "").trim());

      let stateLabel = isGerman ? "Nicht gestartet" : "Not started";
      if (progress?.status === "passed") stateLabel = isGerman ? "Bestanden" : "Passed";
      else if (progress?.status === "failed") stateLabel = isGerman ? "Wiederholen" : "Failed";
      else if (progress?.status === "submitted") stateLabel = isGerman ? "Eingereicht" : "Submitted";
      else if (hasDraft || progress?.status === "in_progress") stateLabel = isGerman ? "In Bearbeitung" : "In progress";
      if (isNotYetAvailable) stateLabel = isGerman ? "Gesperrt (noch nicht verfügbar)" : "Locked (not yet available)";

      return {
        label: `${opt} — ${stateLabel}`,
        value: opt,
        submitted,
        hasDraft,
        isDayZero,
        isNotYetAvailable,
        disabled: isNotYetAvailable,
      };
    });
  }, [
    assignmentOptions,
    buildAssignmentId,
    buildChapterKey,
    deriveAssignmentDay,
    draftsByAssignment,
    isGerman,
    lockedChapters,
    maxUnlockedDay,
    recentSubmissions,
    mergedProgressByTitle,
  ]);

  const selectedAssignmentPassedFromProgress = useMemo(() => {
    if (!form.assignmentTitle) return false;
    const progress = mergedProgressByTitle[form.assignmentTitle];
    if (!progress) return false;
    if (progress.status === "passed") return true;

    const score = toNumericScore(progress.score ?? progress.finalScore ?? progress.mark ?? progress.grade);
    return typeof score === "number" && score >= PASS_THRESHOLD_SCORE;
  }, [form.assignmentTitle, mergedProgressByTitle]);

  const selectedAssignmentPassed = selectedAssignmentPassedFromSubmission || selectedAssignmentPassedFromProgress;

  const assignmentProgressSnapshot = useMemo(() => {
    const total = normalizedAssignmentOptions.length;
    if (!total) return { submittedCount: 0, remainingPercent: 100 };

    const submittedCount = normalizedAssignmentOptions.reduce(
      (count, option) => (option.submitted ? count + 1 : count),
      0
    );
    const remainingPercent = Math.max(0, Math.round(((total - submittedCount) / total) * 100));
    return { submittedCount, remainingPercent };
  }, [normalizedAssignmentOptions]);


  const dynamicMaxSubmissionCharacters = useMemo(() => {
    const baseLimit = getBaseMaxByLevel(preferredLevel);
    const previousLength = (selectedPreview?.submissionText || "").trim().length;
    const expectedLimit = previousLength > 0 ? Math.ceil(previousLength * 1.6) : baseLimit;
    const bounded = Math.min(ABSOLUTE_MAX_SUBMISSION_CHARACTERS, Math.max(baseLimit, expectedLimit));
    return Math.max(MIN_SUBMISSION_CHARACTERS + 200, bounded);
  }, [preferredLevel, selectedPreview?.submissionText]);

  const selectedDraft = useMemo(() => draftsByAssignment[form.assignmentTitle], [draftsByAssignment, form.assignmentTitle]);
  const hasDraftForSelection = Boolean(selectedDraft?.submissionText);

  const latestSubmissionActionAt = useMemo(() => {
    const latest = recentSubmissions.reduce((acc, item) => {
      const statusLabel = safeLower(item?.status);
      if (!["submitted", "resubmitted"].includes(statusLabel)) return acc;

      const itemDate = toDateValue(item.createdAt || item.updatedAt);
      if (!itemDate) return acc;
      if (!acc || itemDate > acc) return itemDate;
      return acc;
    }, null);

    return latest;
  }, [recentSubmissions]);

  const submissionCooldownRemainingMs = useMemo(() => {
    if (!latestSubmissionActionAt) return 0;
    const elapsed = Date.now() - latestSubmissionActionAt.getTime();
    const boundedElapsed = Math.max(0, elapsed);
    return Math.max(0, Math.min(ACTION_COOLDOWN_MS, ACTION_COOLDOWN_MS - boundedElapsed));
  }, [latestSubmissionActionAt]);

  const submissionCooldownLabel = useMemo(() => {
    if (!submissionCooldownRemainingMs) return "";
    const totalSecondsRemaining = Math.ceil(submissionCooldownRemainingMs / 1000);
    const minutesRemaining = Math.floor(totalSecondsRemaining / 60);
    const secondsRemaining = totalSecondsRemaining % 60;
    return minutesRemaining > 0 ? `${minutesRemaining}m ${secondsRemaining}s` : `${secondsRemaining}s`;
  }, [submissionCooldownRemainingMs]);

  const handleChange = (field) => (event) => {
    const value = field === "confirmed" ? event.target.checked : event.target.value;

    if (field === "assignmentTitle") {
      setAssignmentSelectionUnlocked(true);
      const draft = draftsByAssignment[value];
      lastAssignmentRef.current = value;
      setForm((prev) => ({
        ...prev,
        assignmentTitle: value,
        submissionText: draft?.submissionText || "",
        confirmed: false,
      }));
      setStatus((prev) => ({ ...prev, error: "", success: "" }));
      setCopyStatus("");
      return;
    }

    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "confirmed") setStatus((prev) => ({ ...prev, error: "" }));
  };

  const insertSubmissionCharacter = useCallback((character) => {
    setForm((previousForm) => {
      const currentValue = String(previousForm?.submissionText || "");
      const inputElement = submissionTextRef.current;
      const hasCursor = inputElement && typeof inputElement.selectionStart === "number";
      if (!hasCursor) {
        return { ...previousForm, submissionText: `${currentValue}${character}` };
      }

      const start = inputElement.selectionStart;
      const end = inputElement.selectionEnd;
      return {
        ...previousForm,
        submissionText: `${currentValue.slice(0, start)}${character}${currentValue.slice(end)}`,
      };
    });

    window.requestAnimationFrame(() => {
      const inputElement = submissionTextRef.current;
      if (!inputElement) return;
      const start = typeof inputElement.selectionStart === "number" ? inputElement.selectionStart : inputElement.value.length;
      const end = typeof inputElement.selectionEnd === "number" ? inputElement.selectionEnd : inputElement.value.length;
      const cursorPosition = Math.max(start, end) + character.length;
      inputElement.focus();
      inputElement.setSelectionRange(cursorPosition, cursorPosition);
    });
  }, []);

  const hasSelectedAssignment = Boolean(form.assignmentTitle);
  const selectedDayNumber = selectedAssignmentDay;
  const isOrientationDay = hasSelectedAssignment && selectedDayNumber === 0;
  const selectedOptionMeta = useMemo(
    () => decoratedAssignmentOptions.find((option) => option.value === form.assignmentTitle) || null,
    [decoratedAssignmentOptions, form.assignmentTitle]
  );
  const selectedAssignmentEligibility = useMemo(() => {
    if (!hasSelectedAssignment) {
      return {
        submittable: false,
        reason: isGerman ? "Bitte Aufgabe auswählen" : "Select an assignment first",
      };
    }
    if (!isDayWithinSubmissionWindow(preferredLevel, selectedDayNumber)) {
      return {
        submittable: false,
        reason: isGerman ? "Außerhalb des Aufgabenzeitraums" : "Outside assignment window",
      };
    }
    if (selectedOptionMeta?.isDayZero) {
      return {
        submittable: false,
        reason: isGerman ? "Nur Selbstübung" : "Self-practice only",
      };
    }
    if (selectedOptionMeta?.isNotYetAvailable) {
      return {
        submittable: false,
        reason: isGerman ? "Noch nicht verfügbar" : "Locked",
      };
    }
    if (isSelectedLocked) {
      return {
        submittable: false,
        reason: isGerman ? "Bereits eingereicht" : "Already submitted",
      };
    }
    return { submittable: true, reason: isGerman ? "Bereit" : "Ready to submit" };
  }, [hasSelectedAssignment, isGerman, isSelectedLocked, preferredLevel, selectedDayNumber, selectedOptionMeta]);
  const assignmentInfo = useMemo(() => {
    const parts = [form.assignmentTitle || "Assignment"];
    if (selectedDayNumber || selectedDayNumber === 0) parts.push(`Day ${selectedDayNumber}`);
    if (selectedAssignmentChapter) parts.push(`Chapter ${selectedAssignmentChapter}`);
    if (selectedCanonicalAssignmentKey) parts.push(selectedCanonicalAssignmentKey);
    return parts.join(" • ");
  }, [form.assignmentTitle, selectedAssignmentChapter, selectedCanonicalAssignmentKey, selectedDayNumber]);

  const hasMatchingRecentSubmission = useCallback(
    (submissionText, { includeResubmitted = true } = {}) => {
      const currentChapterKey = buildChapterKey(form.assignmentTitle);
      const fingerprint = buildSubmissionFingerprint({
        assignmentTitle: form.assignmentTitle,
        chapterKey: currentChapterKey,
        submissionText,
      });

      return recentSubmissions.some((entry) => {
        const statusLabel = safeLower(entry?.status);
        if (statusLabel !== "submitted" && (!includeResubmitted || statusLabel !== "resubmitted")) return false;

        const entryFingerprint = entry?.submissionFingerprint
          || buildSubmissionFingerprint({
            assignmentTitle: entry?.assignmentTitle || entry?.title,
            chapterKey: entry?.chapterKey || buildChapterKey(entry?.assignmentTitle || entry?.title),
            submissionText: entry?.submissionText,
          });

        return entryFingerprint === fingerprint;
      });
    },
    [buildChapterKey, form.assignmentTitle, recentSubmissions]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: "", success: "" });

    if (!form.assignmentTitle || !form.submissionText.trim()) {
      setStatus({ loading: false, error: "Please select an assignment and enter your text.", success: "" });
      return;
    }

    if (form.submissionText.trim().length < MIN_SUBMISSION_CHARACTERS) {
      setStatus({
        loading: false,
        error: `Please add a fuller response (${MIN_SUBMISSION_CHARACTERS}+ characters) before submitting.`,
        success: "",
      });
      return;
    }

    if (form.submissionText.trim().length > dynamicMaxSubmissionCharacters) {
      setStatus({
        loading: false,
        error: `Your response is too long for this task (${formatCharacterCount(dynamicMaxSubmissionCharacters)} characters max for now).`,
        success: "",
      });
      return;
    }

    if (hasMatchingRecentSubmission(form.submissionText, { includeResubmitted: true })) {
      setStatus({
        loading: false,
        error: "Duplicate submission detected for this assignment. Please edit your text before submitting again.",
        success: "",
      });
      return;
    }

    if (isOrientationDay) {
      setStatus({
        loading: false,
        error: "Day 0 is orientation only. Please select another day to submit an assignment.",
        success: "",
      });
      return;
    }

    if (!form.confirmed) {
      setStatus({ loading: false, error: "Please confirm that you are submitting the correct task.", success: "" });
      return;
    }

    if (submissionCooldownRemainingMs > 0) {
      setStatus({
        loading: false,
        error: `Please wait ${submissionCooldownLabel} before sending another submission.`,
        success: "",
      });
      return;
    }

    try {
      const saved = await persistSubmission({ statusLabel: "submitted" });

      if (!saved.ok && saved.reason === "locked") {
        setStatus({
          loading: false,
          error: "This assignment is already submitted (locked). If you need changes, use the resubmission request for THIS assignment.",
          success: "",
        });
        return;
      }

      if (!saved.ok) {
        setStatus({ loading: false, error: "Could not submit. Please try again.", success: "" });
        return;
      }

      const remainingPercentCopy = assignmentProgressSnapshot.remainingPercent;
      setStatus({
        loading: false,
        error: "",
        success: `Great effort! Your submission is saved. Your result will appear in the Results tab, and we will also send it by email. You have ${remainingPercentCopy}% remaining — keep going.`,
      });
      triggerInteractionFeedback({
        sound: "success",
        toastMessage: `Submission saved. Check Results tab for updates. ${remainingPercentCopy}% remaining.`,
        toastVariant: "success",
        showToast,
        notificationTitle: "Assignment submitted",
        notificationBody: "Great effort — your result will be emailed and shown in Results.",
        notificationTag: "submission-success",
        vibratePattern: [70, 40, 100],
      });
      setBadgeRefreshToken((prev) => prev + 1);

      // Clear editor after submission (preview remains available below)
      setForm((prev) => ({ ...prev, submissionText: "", confirmed: true }));

      // Refresh list
      if (user?.uid) {
        const submissionsRef = collection(db, SUBMISSION_COLLECTION);
        const snapshot = await getDocs(
          query(submissionsRef, where("studentId", "==", user.uid), orderBy("createdAt", "desc"), limit(25))
        );
        setRecentSubmissions(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })));
      }
    } catch (error) {
      console.error("Failed to save submission", error);
      setStatus({ loading: false, error: "Could not save your submission.", success: "" });
    }
  };

  const handleSaveDraft = async () => {
    setStatus({ loading: true, error: "", success: "" });

    try {
      const saved = await persistSubmission({ statusLabel: "draft" });
      if (!saved.ok) {
        setStatus({ loading: false, error: "Add your text before saving a draft.", success: "" });
        return;
      }
      setStatus({ loading: false, error: "", success: "Draft saved. You can keep editing before submitting." });
      triggerInteractionFeedback({
        sound: "info",
        toastMessage: "Draft saved.",
        toastVariant: "info",
        showToast,
      });
    } catch (error) {
      console.error("Failed to save draft", error);
      setStatus({ loading: false, error: "Could not save your draft.", success: "" });
    }
  };

  const handleSaveResubmissionDraft = async () => {
    setResubmissionStatus({ loading: true, error: "", success: "" });

    const trimmedResubmission = resubmissionText.trim();
    const trimmedImprovement = resubmissionImprovement.trim();

    if (!db || !user?.uid || !form.assignmentTitle) {
      setResubmissionStatus({ loading: false, error: "Could not save your resubmission draft.", success: "" });
      return;
    }

    if (!trimmedResubmission && !trimmedImprovement) {
      setResubmissionStatus({
        loading: false,
        error: "Add corrected text or an improvement summary before saving a draft.",
        success: "",
      });
      return;
    }

    try {
      const draftId = getDraftDocId(form.assignmentTitle);
      const draftRef = doc(db, DRAFT_COLLECTION, draftId);
      const existingDraft = draftsByAssignment[form.assignmentTitle];
      const nowLocal = new Date();

      const payload = {
        assignmentKey: selectedCanonicalAssignmentKey || selectedAssignmentId,
        canonicalAssignmentKey: selectedCanonicalAssignmentKey || selectedAssignmentId,
        title: form.assignmentTitle,
        assignmentTitle: form.assignmentTitle,
        level: selectedAssignmentLevel,
        day: selectedAssignmentDay,
        chapter: selectedAssignmentChapter || "",
        assignmentId: selectedAssignmentId,
        chapterKey: selectedChapterKey,
        studentId: user.uid,
        studentEmail: user?.email || "",
        studentCode,
        studentScopeKey,
        studentName,
        className: studentProfile?.className || "",
        status: "resubmission_draft",
        resubmissionText: trimmedResubmission,
        resubmissionImprovement: trimmedImprovement,
        createdAt: existingDraft?.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(draftRef, payload, { merge: true });

      setDraftsByAssignment((prev) => ({
        ...prev,
        [form.assignmentTitle]: {
          ...(prev[form.assignmentTitle] || {}),
          ...payload,
          updatedAt: nowLocal,
        },
      }));

      setResubmissionStatus({ loading: false, error: "", success: "Resubmission draft saved." });
    } catch (error) {
      console.error("Failed to save resubmission draft", error);
      setResubmissionStatus({ loading: false, error: "Could not save your resubmission draft.", success: "" });
    }
  };

  const handleCopyPreview = async () => {
    setCopyStatus("");
    const text = selectedPreview?.submissionText || "";
    if (!text) return;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopyStatus("Copied ✅");
      setTimeout(() => setCopyStatus(""), 1500);
    } catch (err) {
      console.error("Copy failed", err);
      setCopyStatus("Copy failed");
      setTimeout(() => setCopyStatus(""), 2000);
    }
  };

  const handleResubmit = async () => {
    setResubmissionStatus({ loading: true, error: "", success: "" });

    const trimmedResubmission = resubmissionText.trim();
    const trimmedImprovement = resubmissionImprovement.trim();

    if (!trimmedResubmission) {
      setResubmissionStatus({ loading: false, error: "Please add your improved text before resubmitting.", success: "" });
      return;
    }

    if (!trimmedImprovement) {
      setResubmissionStatus({
        loading: false,
        error: "Please explain what you improved in this submission.",
        success: "",
      });
      return;
    }

    if (trimmedResubmission.length < MIN_SUBMISSION_CHARACTERS) {
      setResubmissionStatus({
        loading: false,
        error: `Please add a fuller corrected text (${MIN_SUBMISSION_CHARACTERS}+ characters).`,
        success: "",
      });
      return;
    }

    if (trimmedResubmission.length > dynamicMaxSubmissionCharacters) {
      setResubmissionStatus({
        loading: false,
        error: `Your corrected text is too long for this task (${formatCharacterCount(dynamicMaxSubmissionCharacters)} characters max for now).`,
        success: "",
      });
      return;
    }

    if (trimmedImprovement.length < MIN_RESUBMISSION_IMPROVEMENT_CHARACTERS) {
      setResubmissionStatus({
        loading: false,
        error: `Please give a more specific improvement summary (${MIN_RESUBMISSION_IMPROVEMENT_CHARACTERS}+ characters).`,
        success: "",
      });
      return;
    }

    const resubmissionDiff = buildResubmissionDiff({
      previousSubmissionText: selectedPreview?.submissionText || "",
      currentSubmissionText: trimmedResubmission,
    });

    const hasStrongTextEdits =
      resubmissionDiff.changedCharacters >= MIN_RESUBMISSION_CHANGED_CHARACTERS &&
      resubmissionDiff.newWordsCount >= MIN_RESUBMISSION_NEW_WORDS;

    if (selectedPreview?.submissionText && resubmissionDiff.mode === "objective") {
      if (resubmissionDiff.changedAnswers < MIN_OBJECTIVE_CHANGED_ANSWERS && !hasStrongTextEdits) {
        setResubmissionStatus({
          loading: false,
          error: `For short answer lists (for example: 1.a 2.b 3.c), change at least ${MIN_OBJECTIVE_CHANGED_ANSWERS} answers from your previous attempt before resubmitting, or expand your corrections with fuller text.`,
          success: "",
        });
        return;
      }
    }

    if (
      selectedPreview?.submissionText &&
      resubmissionDiff.mode === "text" &&
      !hasStrongTextEdits
    ) {
      setResubmissionStatus({
        loading: false,
        error: `Please make stronger edits before resubmitting (at least ${MIN_RESUBMISSION_CHANGED_CHARACTERS} changed characters and ${MIN_RESUBMISSION_NEW_WORDS} new words compared with your last attempt).`,
        success: "",
      });
      return;
    }

    if (hasMatchingRecentSubmission(trimmedResubmission, { includeResubmitted: true })) {
      setResubmissionStatus({
        loading: false,
        error: "This corrected text is the same as a recent submission. Please make it unique before resubmitting.",
        success: "",
      });
      return;
    }

    if (!db || !user?.uid || !isSelectedLocked) {
      setResubmissionStatus({
        loading: false,
        error: "Resubmission is only available after your first submission is locked.",
        success: "",
      });
      return;
    }

    if (selectedAssignmentPassed) {
      setResubmissionStatus({
        loading: false,
        error: "This assignment is already passed, so resubmission is disabled.",
        success: "",
      });
      return;
    }

    if (resubmissionLimitReached) {
      setResubmissionStatus({
        loading: false,
        error: `You have used all ${MAX_RESUBMISSION_TRIES} resubmissions for this assignment. This work has already been submitted 3 times in total, so a late mark of ${PASS_THRESHOLD_SCORE} is applied.`,
        success: "",
      });
      return;
    }

    if (submissionCooldownRemainingMs > 0) {
      setResubmissionStatus({
        loading: false,
        error: `Please wait ${submissionCooldownLabel} before sending another submission.`,
        success: "",
      });
      return;
    }

    try {
      const payload = {
        assignmentKey: selectedCanonicalAssignmentKey || selectedAssignmentId,
        canonicalAssignmentKey: selectedCanonicalAssignmentKey || selectedAssignmentId,
        title: form.assignmentTitle,
        assignmentTitle: form.assignmentTitle,
        level: selectedAssignmentLevel,
        day: selectedAssignmentDay,
        chapter: selectedAssignmentChapter || "",
        assignmentId: selectedAssignmentId,
        chapterKey: selectedChapterKey,
        studentId: user.uid,
        studentEmail: user?.email || "",
        studentCode,
        studentScopeKey,
        studentName,
        className: studentProfile?.className || "",
        submissionFingerprint: buildSubmissionFingerprint({
          assignmentTitle: form.assignmentTitle,
          chapterKey: selectedChapterKey,
          submissionText: trimmedResubmission,
        }),
        submissionText: trimmedResubmission,
        improvementSummary: trimmedImprovement,
        previousSubmissionText: selectedPreview?.submissionText || "",
        originalSubmittedAt: selectedLockInfo?.lockedAt || selectedPreview?.createdAt || null,
        status: "resubmitted",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, SUBMISSION_COLLECTION), payload);

      const totalAttemptsUsed = Math.min(3, selectedResubmissionCount + 2);
      const attemptsLeft = Math.max(0, 3 - totalAttemptsUsed);
      setResubmissionStatus({
        loading: false,
        error: "",
        success: `Resubmission sent successfully. Attempts used: ${totalAttemptsUsed}/3 (${attemptsLeft} left). If your score is below ${PASS_THRESHOLD_SCORE}%, read your teacher comments, apply the fixes, then scroll down and resubmit.`,
      });
      triggerInteractionFeedback({
        sound: "success",
        toastMessage: "Resubmission sent. Check Results and email for marking updates.",
        toastVariant: "success",
        showToast,
        notificationTitle: "Resubmission received",
        notificationBody: "Your corrected work has been sent to tutors.",
        notificationTag: "resubmission-success",
        vibratePattern: [70, 30, 70],
      });
      setResubmissionText("");
      setResubmissionImprovement("");

      const submissionsRef = collection(db, SUBMISSION_COLLECTION);
      const snapshot = await getDocs(
        query(submissionsRef, where("studentId", "==", user.uid), orderBy("createdAt", "desc"), limit(25))
      );
      setRecentSubmissions(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })));
    } catch (error) {
      console.error("Failed to save resubmission", error);
      setResubmissionStatus({ loading: false, error: "Could not save your resubmission.", success: "" });
    }
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={{ ...styles.card, display: "grid", gap: 8 }}>
        <h3 style={{ ...styles.sectionTitle, margin: 0 }}>{t("examReadiness.certificate.title")}</h3>
        <p style={{ ...styles.helperText, margin: 0 }}>
          {t("examReadiness.certificate.submitHelper")}
        </p>
        <ExamReadinessBadge studentProfile={studentProfile} variant="button" refreshToken={badgeRefreshToken} />
      </section>
      <div style={{ ...styles.card, display: "grid", gap: 12 }}>
        <div>
          <h2 style={styles.sectionTitle}>{uiText.pageTitle}</h2>
          <p style={{ ...styles.helperText, margin: 0 }}>
            {uiText.pageHelper}
          </p>
        </div>

        {status.error ? <InfoBox tone="error">{status.error}</InfoBox> : null}
        {status.success ? <InfoBox tone="success">{status.success}</InfoBox> : null}

        <form style={{ display: "grid", gap: 12 }} onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 10,
            }}
          >
            <div style={{ ...styles.field, margin: 0 }}>
              <span style={styles.label}>Assignment</span>
              <select
                value={form.assignmentTitle}
                onChange={handleChange("assignmentTitle")}
                style={styles.select}
                disabled={isAssignmentContextLocked}
              >
                <option value="" disabled>
                  Select an assignment
                </option>
                {decoratedAssignmentOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled} title={opt.disabled ? uiText.orientationOnly : ""}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {isAssignmentContextLocked && requestedAssignmentMatch ? (
                <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
                  <span style={styles.helperText}>
                    Opened from course/workbook link. Assignment locked to <strong>{requestedAssignmentMatch.label}</strong> to prevent wrong-chapter submissions.
                  </span>
                  <button
                    type="button"
                    style={{ ...styles.secondaryButton, width: "fit-content", padding: "8px 12px" }}
                    onClick={() => setAssignmentSelectionUnlocked(true)}
                  >
                    Choose a different assignment instead
                  </button>
                </div>
              ) : isSelectedLocked && !selectedAssignmentPassed ? (
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span
                    style={{
                      ...styles.badge,
                      background: "#ecfdf5",
                      borderColor: "#bbf7d0",
                      color: "#065f46",
                    }}
                  >
                    {(isGerman ? "Eingereicht am" : "Submitted on")} {formatDate(selectedLockInfo?.lockedAt || selectedPreview?.createdAt)}
                  </span>
                  <span style={styles.helperText}>This assignment is locked. Resubmission is available for THIS assignment only.</span>
                </div>
              ) : (
                <p style={{ ...styles.helperText, margin: "6px 0 0" }}>
                  Choose the assignment using Day/Task/Chapter details so similar workbook tasks stay clearly separated.
                </p>
              )}
              {isOrientationDay ? (
                <p style={{ ...styles.helperText, margin: "6px 0 0", color: "#b45309" }}>
                  Day 0 is orientation only, so submissions are disabled for this selection.
                </p>
              ) : null}
              {assignmentRequiredDaysLabel ? (
                <p style={{ ...styles.helperText, margin: "6px 0 0" }}>
                  Assignment-required days from the course book: {assignmentRequiredDaysLabel}
                </p>
              ) : null}
            </div>

            <div style={{ ...styles.field, margin: 0 }}>
              <span style={styles.label}>Your details</span>
              <div style={{ ...styles.metaRow, padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 10 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{user?.email || "–"}</div>
                  <div style={styles.helperText}>Email • Level {preferredLevel}</div>
                </div>
                <span style={styles.badge}>{studentCode || "No code"}</span>
              </div>
              <p style={{ ...styles.helperText, margin: "6px 0 0" }}>Class: {studentProfile?.className || "–"}</p>
            </div>
          </div>

          <div>
            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                background: selectedAssignmentEligibility.submittable ? "#ecfdf5" : "#fff7ed",
                padding: "10px 12px",
                marginBottom: 10,
              }}
            >
              <div style={{ fontWeight: 700 }}>
                {selectedAssignmentEligibility.submittable ? uiText.statusSubmittable : uiText.statusNotSubmittable}
              </div>
              <div style={styles.helperText}>
                {uiText.reasonLabel}: {selectedAssignmentEligibility.reason}
              </div>
            </div>
            <label style={{ ...styles.field, margin: 0 }}>
              <span style={{ ...styles.label, display: "flex", alignItems: "center", gap: 8 }}>
                Your text *
                {hasDraftForSelection ? (
                  <span style={{ ...styles.badge, background: "#ecfeff", borderColor: "#a5f3fc", color: "#0ea5e9" }}>
                    Draft loaded
                  </span>
                ) : null}
              </span>
              <textarea
                ref={submissionTextRef}
                value={form.submissionText}
                onChange={handleChange("submissionText")}
                maxLength={dynamicMaxSubmissionCharacters}
                style={{ ...styles.textArea, minHeight: 200 }}
                placeholder={
                  !hasSelectedAssignment
                    ? "Select an assignment first."
                    : isSelectedLocked
                    ? "This assignment is locked. Your previous submission is shown below."
                    : "Type your answer here or paste it in."
                }
                disabled={isSelectedLocked || !hasSelectedAssignment}
              />
              <span style={{ ...styles.helperText, marginTop: 6 }}>Quick umlaut keys:</span>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
                {GERMAN_SPECIAL_CHARACTERS.map((character) => (
                  <button
                    key={character}
                    type="button"
                    style={{ ...styles.chipButton, minWidth: 44, textAlign: "center" }}
                    onClick={() => insertSubmissionCharacter(character)}
                    disabled={isSelectedLocked || !hasSelectedAssignment}
                  >
                    {character}
                  </button>
                ))}
              </div>
              <span style={styles.helperText}>
                Minimum {MIN_SUBMISSION_CHARACTERS} and dynamic maximum {formatCharacterCount(dynamicMaxSubmissionCharacters)} characters.
              </span>
              <span style={styles.helperText}>
                {formatCharacterCount(form.submissionText.length)} / {formatCharacterCount(dynamicMaxSubmissionCharacters)} · {form.submissionText.length < MIN_SUBMISSION_CHARACTERS ? `Need ${MIN_SUBMISSION_CHARACTERS} minimum to submit.` : "Minimum reached."}
              </span>
            </label>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
              <span style={styles.helperText}>
                {hasDraftForSelection && selectedDraft?.updatedAt
                  ? `Draft updated ${formatDate(selectedDraft.updatedAt)}`
                  : "Drafts save automatically while you type."}
              </span>
              {autosaveStatus.state === "saving" ? (
                <span style={styles.helperText}>Autosaving ...</span>
              ) : autosaveStatus.state === "saved" ? (
                <span style={styles.helperText}>Autosaved {formatDate(autosaveStatus.savedAt)}</span>
              ) : null}
            </div>
          </div>

          <label style={{ ...styles.field, flexDirection: "row", alignItems: "center", gap: 8, margin: 0 }}>
            <input
              type="checkbox"
              checked={form.confirmed || confirmationLocked}
              onChange={handleChange("confirmed")}
              disabled={confirmationLocked || status.loading || isSelectedLocked || isOrientationDay || !hasSelectedAssignment}
            />
            <span style={{ ...styles.label, margin: 0 }}>
              I confirm I am submitting {selectedAssignmentChapter ? `Chapter ${selectedAssignmentChapter}` : "this assignment"}
              {selectedCanonicalAssignmentKey ? ` (${selectedCanonicalAssignmentKey})` : ""}.
            </span>
          </label>

          <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 10, background: "#f9fafb" }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>{isGerman ? "Einreichungsübersicht" : "Submission summary"}</div>
            <div style={styles.helperText}>Assignment: {form.assignmentTitle || "–"}</div>
            <div style={styles.helperText}>Day: {hasSelectedAssignment && (selectedDayNumber || selectedDayNumber === 0) ? selectedDayNumber : "–"}</div>
            <div style={styles.helperText}>Chapter: {selectedAssignmentChapter || "–"}</div>
            <div style={styles.helperText}>Canonical ID: {selectedCanonicalAssignmentKey || selectedAssignmentId || "–"}</div>
            <div style={styles.helperText}>Class: {studentProfile?.className || "–"}</div>
            <div style={styles.helperText}>Level: {preferredLevel}</div>
            <div style={styles.helperText}>Student code: {studentCode || "–"}</div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              style={styles.secondaryButton}
              onClick={handleSaveDraft}
              disabled={status.loading || isSelectedLocked || !hasSelectedAssignment}
            >
              {status.loading ? "Saving ..." : "Save draft"}
            </button>

            <button
              type="submit"
              style={styles.primaryButton}
              disabled={status.loading || confirmationLocked || isSelectedLocked || isOrientationDay || submissionCooldownRemainingMs > 0 || !hasSelectedAssignment}
            >
              {status.loading ? "Submitting ..." : confirmationLocked || isSelectedLocked ? "Submission locked" : "Submit assignment"}
            </button>

            <span style={styles.helperText}>Drafts can be saved anytime. Submission is locked after the first confirmed send.</span>
            {isSelectedLocked && !selectedAssignmentPassed ? (
              <span style={{ ...styles.helperText, color: "#b45309" }}>
                Locked: you already submitted this assignment.
              </span>
            ) : null}
            {isOrientationDay ? (
              <span style={{ ...styles.helperText, color: "#b45309" }}>
                Orientation Day (Day 0) cannot be submitted.
              </span>
            ) : null}
            {submissionCooldownRemainingMs > 0 ? (
              <span style={{ ...styles.helperText, color: "#b45309" }}>
                Anti-spam cooldown: wait {submissionCooldownLabel} before submitting.
              </span>
            ) : null}
          </div>
        </form>

        {/* ✅ UX: Read-only preview + copy */}
        {selectedPreview ? (
          <div style={{ marginTop: 6, borderTop: "1px solid #e5e7eb", paddingTop: 12, display: "grid", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontWeight: 800 }}>Submitted preview</div>
                <div style={styles.helperText}>
                  {selectedPreview.assignmentTitle} · Saved {formatDate(selectedPreview.createdAt)}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button
                  type="button"
                  style={{ ...styles.secondaryButton, padding: "10px 12px" }}
                  onClick={handleCopyPreview}
                >
                  Copy submission text
                </button>
                {copyStatus ? (
                  <span style={{ ...styles.badge, background: "#ecfeff", borderColor: "#a5f3fc", color: "#0ea5e9" }}>
                    {copyStatus}
                  </span>
                ) : null}
              </div>
            </div>

            <textarea
              readOnly
              value={selectedPreview.submissionText}
              style={{ ...styles.textArea, minHeight: 160, background: "#f9fafb" }}
            />
          </div>
        ) : null}
      </div>

      {/* ✅ Resubmission (PER ASSIGNMENT) */}
      <div style={{ ...styles.card, display: "grid", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <h3 style={{ margin: 0 }}>Resubmission</h3>
          <span style={styles.badge}>{isSelectedLocked && !selectedAssignmentPassed ? "Available" : "Not available"}</span>
        </div>

        <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 8, background: !isSelectedLocked ? "#ecfdf5" : "#f9fafb" }}>
            <strong>{isGerman ? "Noch nicht eingereicht" : "Not submitted yet"}</strong>
            <div style={styles.helperText}>{!isSelectedLocked ? (isGerman ? "Aktueller Status" : "Current state") : ""}</div>
          </div>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 8, background: isSelectedLocked && !resubmissionStatus.success ? "#fff7ed" : "#f9fafb" }}>
            <strong>{isGerman ? "Eingereicht – wartet auf Korrektur" : "Submitted – awaiting review"}</strong>
          </div>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 8, background: isSelectedLocked ? "#ecfdf5" : "#f9fafb" }}>
            <strong>{isGerman ? "Wiedereinreichung freigeschaltet" : "Resubmission unlocked"}</strong>
          </div>
        </div>

        {isSelectedLocked && !selectedAssignmentPassed ? (
          <>
            <p style={{ ...styles.helperText, margin: 0 }}>
              You can resubmit <strong>{assignmentInfo}</strong> here in the app. Tell us exactly what improved so tutors can see this is stronger work.
            </p>
            <p style={{ ...styles.helperText, margin: "6px 0 0" }}>
              {resubmissionLimitReached
                ? `Resubmissions used: ${selectedResubmissionCount}/${MAX_RESUBMISSION_TRIES}.`
                : `Resubmissions left: ${remainingResubmissions}/${MAX_RESUBMISSION_TRIES}.`}
            </p>
            <p style={{ ...styles.helperText, margin: "6px 0 0" }}>
              First submission is #1. The school can mark only two resubmissions (#2 and #3). If one work reaches 3 total submissions, a late mark of {PASS_THRESHOLD_SCORE} is given.
            </p>
            <p style={{ ...styles.helperText, margin: "6px 0 0" }}>
              If your score is below {PASS_THRESHOLD_SCORE}%, read the tutor comments, apply every fix, then scroll down and submit your improved version.
            </p>

            <label style={{ ...styles.field, margin: 0 }}>
              <span style={styles.label}>Corrected text</span>
              <textarea
                value={resubmissionText}
                onChange={(event) => setResubmissionText(event.target.value)}
                maxLength={dynamicMaxSubmissionCharacters}
                style={{ ...styles.textArea, minHeight: 160 }}
                placeholder="Paste your corrected letter/text here."
              />
              <span style={styles.helperText}>
                Minimum {MIN_SUBMISSION_CHARACTERS} and dynamic maximum {formatCharacterCount(dynamicMaxSubmissionCharacters)} characters.
              </span>
            </label>

            <label style={{ ...styles.field, margin: 0 }}>
              <span style={styles.label}>What did you improve in this submission? *</span>
              <textarea
                value={resubmissionImprovement}
                onChange={(event) => setResubmissionImprovement(event.target.value)}
                style={{ ...styles.textArea, minHeight: 120 }}
                placeholder="Example: I fixed verb placement in Nebensätze, corrected article endings, and rewrote the opening paragraph to match the prompt."
              />
              <span style={styles.helperText}>Add at least {MIN_RESUBMISSION_IMPROVEMENT_CHARACTERS} characters.</span>
            </label>

            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                style={styles.secondaryButton}
                onClick={handleSaveResubmissionDraft}
                disabled={resubmissionStatus.loading || resubmissionLimitReached}
              >
                {resubmissionStatus.loading ? "Saving ..." : "Save draft"}
              </button>
              <button
                type="button"
                style={styles.primaryButton}
                onClick={handleResubmit}
                disabled={resubmissionStatus.loading || resubmissionLimitReached}
              >
                {resubmissionStatus.loading ? "Saving ..." : "Submit resubmission"}
              </button>
            </div>

            {resubmissionStatus.error ? <InfoBox tone="error">{resubmissionStatus.error}</InfoBox> : null}
            {resubmissionStatus.success ? <InfoBox tone="success">{resubmissionStatus.success}</InfoBox> : null}

            <p style={{ ...styles.helperText, margin: 0 }}>
              Tip: if your text is mostly the same, explain clearly which objective you still need help with.
            </p>
            <p style={{ ...styles.helperText, margin: 0 }}>
              Resubmissions must include clear edits. For full text: at least {MIN_RESUBMISSION_CHANGED_CHARACTERS} changed characters and {MIN_RESUBMISSION_NEW_WORDS} new words. For short answer lists (1.a, 2.b...), change at least {MIN_OBJECTIVE_CHANGED_ANSWERS} answers.
            </p>
            {submissionCooldownRemainingMs > 0 ? (
              <p style={{ ...styles.helperText, margin: 0, color: "#b45309" }}>
                Anti-spam cooldown active: wait {submissionCooldownLabel} before submitting again.
              </p>
            ) : null}
          </>
        ) : (
          <p style={{ ...styles.helperText, margin: 0 }}>
            {selectedAssignmentPassed
              ? "Great news: this assignment is already passed, so no resubmission is needed."
              : <>
                  Resubmission is only available after you submit <strong>this selected assignment</strong>.  
                  If you haven’t submitted it yet, submit first — then the resubmission button will appear here.
                </>}
          </p>
        )}
      </div>

      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <h3 style={{ margin: 0 }}>Recent submissions</h3>
          {submissionsLoading ? <span style={styles.helperText}>Loading ...</span> : null}
        </div>

        {recentSubmissions.length === 0 && !submissionsLoading ? (
          <p style={{ ...styles.helperText, margin: 0 }}>{uiText.ctaFirstSubmission}</p>
        ) : null}

        <div style={{ display: "grid", gap: 8 }}>
          {recentSubmissions.map((entry) => (
            <div
              key={entry.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: 10,
                background: "#f9fafb",
                display: "grid",
                gap: 4,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <strong>{entry.assignmentTitle || entry.title || "Submission"}</strong>
                <span style={styles.levelPill}>{entry.level || preferredLevel}</span>
              </div>
              <div style={{ ...styles.helperText, margin: 0 }}>Class: {entry.className || "–"}</div>
              <div style={{ ...styles.helperText, margin: 0 }}>Saved: {formatDate(entry.createdAt)}</div>
              <div style={{ ...styles.helperText, margin: 0 }}>
                Status: {safeLower(entry.status) === "resubmitted" ? "pending" : getFeedbackFromSubmission(entry) ? "marked" : "pending"}
              </div>
              {entry.submissionText ? (
                <div style={{ ...styles.helperText, margin: 0 }}>
                  Preview: {String(entry.submissionText).slice(0, 110)}
                  {String(entry.submissionText).length > 110 ? "..." : ""}
                </div>
              ) : null}
              {getFeedbackFromSubmission(entry) ? (
                <button
                  type="button"
                  onClick={() => setOpenedFeedbackId((prev) => (prev === entry.id ? null : entry.id))}
                  style={{ ...styles.secondaryButton, width: "fit-content", padding: "6px 10px" }}
                >
                  {uiText.quickOpenFeedback}
                </button>
              ) : null}
              {openedFeedbackId === entry.id && getFeedbackFromSubmission(entry) ? (
                <div style={{ ...styles.helperText, margin: 0, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 8 }}>
                  {getFeedbackFromSubmission(entry)}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const __TESTING__ = {
  buildResubmissionDiff,
  countNewWordOccurrences,
  parseObjectiveAnswers,
  resolvePreferredStudentName,
};

export default AssignmentSubmissionPage;
