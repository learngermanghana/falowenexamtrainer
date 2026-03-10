import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { styles } from "../styles";
import { InfoBox } from "./ui";
import ExamReadinessBadge from "./ExamReadinessBadge";
import { useAuth } from "../context/AuthContext";
import { ALLOWED_LEVELS } from "../context/ExamContext";
import { courseSchedules } from "../data/courseSchedule";
import { getAssignmentDictionaryEntry } from "../data/germanAssignmentCatalog";
import { buildAssignmentCatalogForLevel, resolveAssignmentCanonicalKey } from "../utils/assignmentIdentity";
import { fetchAnswerKeyRegistry, resolveAnswerKeySource } from "../services/answerKeyRegistryService";
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
const MAX_RESUBMISSION_TRIES = 2;
const ACTION_COOLDOWN_MS = 60 * 1000;
const ABSOLUTE_MAX_SUBMISSION_CHARACTERS = 12000;
const BASE_MAX_BY_LEVEL = { A1: 2500, A2: 3200, B1: 4200, B2: 5500, C1: 7000, C2: 8500 };
const PASS_THRESHOLD_SCORE = 60;

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
    .replace(/[^a-z0-9_-]/g, "_")
    .slice(0, 120);

const safeLower = (v) => String(v || "").toLowerCase();

const normalizeAssignmentIdentity = (value) => String(value || "").toLowerCase().replace(/\s+/g, "").replace(/_/g, "-").trim();

const normalizeSubmissionText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const buildStudentScopeKey = ({ userId, studentCode, studentEmail }) =>
  [userId, studentCode, studentEmail]
    .map((part) => normalizeIdPart(part || ""))
    .filter(Boolean)
    .join("__") || "anonymous";

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

const toLessonArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const getAssignmentLessons = (entry) => {
  if (!entry || typeof entry !== "object") return [];

  const topLevelAssignment =
    entry.assignment || entry.assignmentId || entry.assignmentKey
      ? [
          {
            assignment: entry.assignment,
            assignmentId: entry.assignmentId,
            assignmentKey: entry.assignmentKey,
            chapter: entry.chapter,
            topic: entry.topic,
          },
        ]
      : [];

  const nestedAssignments = [entry.lesen_hören, entry.schreiben_sprechen]
    .flatMap((lessonGroup) => toLessonArray(lessonGroup))
    .filter((lesson) => lesson?.assignment || lesson?.assignmentId || lesson?.assignmentKey);

  return nestedAssignments.length ? nestedAssignments : topLevelAssignment;
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

const AssignmentSubmissionPage = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { user, studentProfile } = useAuth();
  const [badgeRefreshToken, setBadgeRefreshToken] = useState(0);
  const [openedFeedbackId, setOpenedFeedbackId] = useState(null);

  const preferredLevel = useMemo(
    () => (studentProfile?.level || "A1").toUpperCase(),
    [studentProfile?.level]
  );

  const studentCode = useMemo(
    () => studentProfile?.studentCode || studentProfile?.studentcode || studentProfile?.id || "",
    [studentProfile?.id, studentProfile?.studentCode, studentProfile?.studentcode]
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

  const assignmentDictionary = useMemo(() => {
    const levelSchedule = courseSchedules[preferredLevel] || [];
    const catalogByComposite = new Map(
      buildAssignmentCatalogForLevel(preferredLevel)
        .filter((entry) => typeof entry?.day !== "undefined")
        .map((entry) => [`${String(entry.day)}::${entry.occurrence || 1}`, entry])
    );
    const entriesWithLessons = levelSchedule
      .filter((entry) => typeof entry.day !== "undefined" && entry.topic)
      .map((entry) => ({
        ...entry,
        __assignmentLessons: getAssignmentLessons(entry),
      }));

    const duplicateCountByDay = entriesWithLessons.reduce((acc, entry) => {
      const key = String(entry.day);
      const count = entry.__assignmentLessons.length || 1;
      acc[key] = (acc[key] || 0) + count;
      return acc;
    }, {});

    const seenByDay = {};

    return entriesWithLessons.flatMap((entry) => {
      const lessons = entry.__assignmentLessons.length ? entry.__assignmentLessons : [entry];

      return lessons.map((lesson) => {
        const dayKey = String(entry.day);
        seenByDay[dayKey] = (seenByDay[dayKey] || 0) + 1;
        const occurrence = seenByDay[dayKey];
        const dictionaryEntry = getAssignmentDictionaryEntry({
          level: preferredLevel,
          assignmentId: lesson?.assignmentId || entry.assignmentId,
          chapter: lesson?.chapter || entry.chapter,
        });
        const chapter = dictionaryEntry?.chapter || lesson?.chapter || entry.chapter || "";
        const chapterSuffix = chapter ? ` • Chapter ${chapter}` : "";
        const duplicateSuffix = duplicateCountByDay[dayKey] > 1 ? ` • Task ${occurrence}` : "";
        const prefersEnglishTitle = preferredLevel === "A1";
        const topicTitle =
          (prefersEnglishTitle ? dictionaryEntry?.en : dictionaryEntry?.de) ||
          dictionaryEntry?.en ||
          dictionaryEntry?.de ||
          lesson?.topic ||
          entry.topic;
        const label = `Day ${entry.day}${duplicateSuffix}: ${topicTitle}${chapterSuffix}`;

        return {
          day: entry.day,
          topic: topicTitle,
          chapter,
          occurrence,
          label,
          assignmentId: dictionaryEntry?.assignment_id || lesson?.assignmentId || entry.assignmentId || null,
          canonicalAssignmentId:
            catalogByComposite.get(`${String(entry.day)}::${occurrence}`)?.canonicalAssignmentId ||
            resolveAssignmentCanonicalKey({
              level: preferredLevel,
              assignmentId: dictionaryEntry?.assignment_id || lesson?.assignmentId || entry.assignmentId,
              assignmentTitle: label,
            }),
          assignmentKey:
            catalogByComposite.get(`${String(entry.day)}::${occurrence}`)?.assignmentKey ||
            resolveAssignmentCanonicalKey({
              level: preferredLevel,
              assignmentId: dictionaryEntry?.assignment_id || lesson?.assignmentId || entry.assignmentId,
              assignmentTitle: label,
            }),
          assignment: Boolean(lesson?.assignment || lesson?.assignmentId || lesson?.assignmentKey),
        };
      });
    });
  }, [preferredLevel]);

  const assignmentRequiredDaysLabel = useMemo(() => {
    const assignmentDays = assignmentDictionary
      .filter((entry) => entry.assignment)
      .map((entry) => entry.day)
      .filter((day, index, arr) => arr.indexOf(day) === index)
      .sort((a, b) => Number(a) - Number(b));

    if (!assignmentDays.length) return "";

    return assignmentDays.map((day) => `Day ${day}`).join(", ");
  }, [assignmentDictionary]);

  const assignmentOptions = useMemo(() => {
    const names = [];
    const addName = (value) => {
      if (!value) return;
      const label = value.toString();
      if (!names.includes(label)) names.push(label);
    };

    assignmentDictionary.filter(({ assignment }) => assignment).forEach(({ label }) => addName(label));
    addName(studentProfile?.assignmentTitle);

    if (Array.isArray(studentProfile?.assignments)) studentProfile.assignments.forEach(addName);
    if (Array.isArray(studentProfile?.assignmentTitles)) studentProfile.assignmentTitles.forEach(addName);

    return names.length ? names : ["General submission", "Standard assignment"];
  }, [
    assignmentDictionary,
    studentProfile?.assignmentTitle,
    studentProfile?.assignmentTitles,
    studentProfile?.assignments,
  ]);

  const [form, setForm] = useState({
    assignmentTitle: assignmentOptions[0],
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
  const [answerKeyRegistry, setAnswerKeyRegistry] = useState(new Map());

  const isGerman = String(i18n?.resolvedLanguage || i18n?.language || "en").toLowerCase().startsWith("de");
  const uiText = useMemo(
    () =>
      isGerman
        ? {
            pageTitle: "Aufgabe einreichen",
            pageHelper:
              "Lade deine Lösung als Text hoch. Klasse, Niveau, Schülercode und E-Mail werden automatisch ergänzt.",
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
              "Upload your solution as text. Your class, level, student code, and email are auto-filled to avoid mistakes.",
            orientationOnly: "Orientation only",
            statusSubmittable: "This assignment is submittable",
            statusNotSubmittable: "This assignment is not submittable",
            reasonLabel: "Reason",
            ctaFirstSubmission: "Submit your first assignment.",
            quickOpenFeedback: "Open feedback",
          },
    [isGerman]
  );

  const lastAssignmentRef = useRef(assignmentOptions[0]);
  const autosaveTimerRef = useRef(null);
  const lastAutosavedRef = useRef({ assignmentTitle: "", submissionText: "" });

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

  const deriveChapterValue = useCallback(
    (title) => {
      const entry = assignmentDictionary.find((item) => item.label === title);
      if (typeof entry?.day !== "undefined") return entry.day;

      const dayMatch = /^day\s*(\d+)/i.exec(title || "");
      return dayMatch?.[1] ? Number(dayMatch[1]) : null;
    },
    [assignmentDictionary]
  );

  const buildAssignmentId = useCallback(
    (title) => {
      if (!title) return null;

      const entry = assignmentDictionary.find((item) => item.label === title);
      const normalizedLevel = normalizeIdPart(preferredLevel || "general");

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

  const getLockDocId = useCallback(
    (assignmentTitle) => {
      const chapterKey = buildChapterKey(assignmentTitle) || "unknown";
      return `${studentScopeKey}__${normalizeIdPart(preferredLevel)}__${normalizeIdPart(chapterKey)}`;
    },
    [buildChapterKey, preferredLevel, studentScopeKey]
  );

  const getDraftDocId = useCallback(
    (assignmentTitle) => {
      const chapterKey = buildChapterKey(assignmentTitle) || "unknown";
      return `${studentScopeKey}__${normalizeIdPart(preferredLevel)}__${normalizeIdPart(chapterKey)}`;
    },
    [buildChapterKey, preferredLevel, studentScopeKey]
  );

  const buildSubmissionPayload = useCallback(
    (statusLabel) => {
      const resolvedLevel = ALLOWED_LEVELS.includes(preferredLevel) ? preferredLevel : "GENERAL";
      const resolvedAssignmentId = buildAssignmentId(form.assignmentTitle);
      const canonicalAssignmentKey = resolveAssignmentCanonicalKey({
        level: resolvedLevel,
        assignmentId: resolvedAssignmentId,
        assignmentTitle: form.assignmentTitle,
      });
      const answerKeySource = resolveAnswerKeySource(answerKeyRegistry, canonicalAssignmentKey);

      return {
      title: form.assignmentTitle,
      assignmentTitle: form.assignmentTitle,
      level: resolvedLevel,
      chapter: deriveChapterValue(form.assignmentTitle),
      assignmentId: resolvedAssignmentId,
      assignmentKey: canonicalAssignmentKey,
      canonicalAssignmentKey,
      answerKeySource: answerKeySource
        ? {
            assignmentKey: answerKeySource.assignmentKey || canonicalAssignmentKey,
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
      studentName: studentProfile?.name || "",
      className: studentProfile?.className || "",
      status: statusLabel,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    },
    [
      answerKeyRegistry,
      buildChapterKey,
      buildAssignmentId,
      deriveChapterValue,
      form.assignmentTitle,
      form.submissionText,
      preferredLevel,
      studentCode,
      studentScopeKey,
      studentProfile?.className,
      studentProfile?.name,
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
          level: ALLOWED_LEVELS.includes(preferredLevel) ? preferredLevel : "GENERAL",
          lockedAt: serverTimestamp(),
          assignmentTitle: form.assignmentTitle,
          chapter: deriveChapterValue(form.assignmentTitle),
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
      });

      return { ok: true };
    },
    [
      buildChapterKey,
      buildSubmissionPayload,
      deriveChapterValue,
      draftsByAssignment,
      form.assignmentTitle,
      form.submissionText,
      getDraftDocId,
      getLockDocId,
      preferredLevel,
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
    const requestedKey =
      location?.state?.assignmentKey ||
      location?.state?.canonicalAssignmentKey ||
      new URLSearchParams(location?.search || "").get("assignmentKey") ||
      "";
    if (!requestedKey || !assignmentDictionary.length) return;

    const requestedNormalized = normalizeAssignmentIdentity(requestedKey);
    const match = assignmentDictionary.find(
      (entry) => normalizeAssignmentIdentity(entry.assignmentKey || entry.canonicalAssignmentId || "") === requestedNormalized
    );
    if (!match) return;

    setForm((prev) => ({ ...prev, assignmentTitle: match.label }));
  }, [assignmentDictionary, location?.search, location?.state]);

  useEffect(() => {
    const defaultAssignment = assignmentOptions[0];
    const currentAssignment = form.assignmentTitle;
    const hasCurrentAssignment = currentAssignment && assignmentOptions.includes(currentAssignment);

    if (hasCurrentAssignment || !defaultAssignment) return;

    const defaultDraft = draftsByAssignment[defaultAssignment];
    setForm((prev) => ({
      ...prev,
      assignmentTitle: defaultAssignment,
      submissionText: defaultDraft?.submissionText || prev.submissionText,
    }));
  }, [assignmentOptions, draftsByAssignment, form.assignmentTitle]);

  useEffect(() => {
    const loadDraftsAndSubmissions = async () => {
      if (!db || !user?.uid) return;

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

        if (!lockSnapshot.empty) {
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
        }

        // Drafts
        const draftsRef = collection(db, DRAFT_COLLECTION);
        const draftSnapshot = await getDocs(
          query(draftsRef, where("studentId", "==", user.uid), orderBy("updatedAt", "desc"), limit(30))
        );

        if (!draftSnapshot.empty) {
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
        }
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
  const selectedAssignmentId = useMemo(
    () => buildAssignmentId(form.assignmentTitle),
    [buildAssignmentId, form.assignmentTitle]
  );

  const isSameSelectedAssignment = useCallback(
    (entry) => {
      const entryAssignmentId = entry?.assignmentId || entry?.assignment_id || entry?.assignmentKey || null;
      if (selectedAssignmentId && entryAssignmentId) {
        return normalizeAssignmentIdentity(entryAssignmentId) === normalizeAssignmentIdentity(selectedAssignmentId);
      }

      const entryChapterKey = entry?.chapterKey || buildChapterKey(entry?.assignmentTitle || entry?.title || "");
      if (selectedChapterKey && entryChapterKey) return entryChapterKey === selectedChapterKey;

      return safeLower(entry?.assignmentTitle || entry?.title) === safeLower(form.assignmentTitle);
    },
    [buildChapterKey, form.assignmentTitle, selectedAssignmentId, selectedChapterKey]
  );

  const selectedResubmissionCount = useMemo(() => {
    return recentSubmissions.reduce((count, entry) => {
      if (safeLower(entry?.status) !== "resubmitted") return count;

      return isSameSelectedAssignment(entry) ? count + 1 : count;
    }, 0);
  }, [isSameSelectedAssignment, recentSubmissions]);

  const selectedAssignmentPassed = useMemo(() => {
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
    if (preview && safeLower(preview.assignmentTitle) === safeLower(form.assignmentTitle)) return preview;

    const match = recentSubmissions.find(
      (s) => safeLower(s.assignmentTitle || s.title) === safeLower(form.assignmentTitle)
    );

    if (!match?.submissionText) return null;

    return {
      assignmentTitle: match.assignmentTitle || match.title || form.assignmentTitle,
      submissionText: match.submissionText,
      createdAt: match.createdAt || match.updatedAt || null,
    };
  }, [form.assignmentTitle, preview, recentSubmissions]);

  const maxUnlockedDay = useMemo(() => {
    const availableDays = recentSubmissions
      .map((entry) => Number(entry?.chapter))
      .filter((value) => Number.isFinite(value) && value >= 0);
    if (!availableDays.length) return Number.POSITIVE_INFINITY;
    return Math.max(1, ...availableDays) + 1;
  }, [recentSubmissions]);

  const decoratedAssignmentOptions = useMemo(() => {
    return assignmentOptions.map((opt) => {
      const key = buildChapterKey(opt);
      const optionAssignmentId = buildAssignmentId(opt);
      const dayNumber = deriveChapterValue(opt);
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

      const submitted = Boolean((key && lockedChapters.has(key)) || hasSubmission);
      const hasDraft = Boolean(String(draftsByAssignment?.[opt]?.submissionText || "").trim());

      let stateLabel = isGerman ? "Nicht gestartet" : "Not started";
      if (hasDraft) stateLabel = isGerman ? "In Bearbeitung" : "In progress";
      if (submitted) stateLabel = isGerman ? "Eingereicht" : "Submitted";
      if (isDayZero) stateLabel = isGerman ? "Nur Selbstübung (keine Abgabe)" : "Self-practice only (no submission)";
      if (isNotYetAvailable) stateLabel = isGerman ? "Gesperrt (noch nicht verfügbar)" : "Locked (not yet available)";

      return {
        label: `${opt} — ${stateLabel}`,
        value: opt,
        submitted,
        hasDraft,
        isDayZero,
        isNotYetAvailable,
        disabled: isDayZero || isNotYetAvailable,
      };
    });
  }, [
    assignmentOptions,
    buildAssignmentId,
    buildChapterKey,
    deriveChapterValue,
    draftsByAssignment,
    isGerman,
    lockedChapters,
    maxUnlockedDay,
    recentSubmissions,
  ]);


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
    const secondsRemaining = Math.ceil(submissionCooldownRemainingMs / 1000);
    return `${secondsRemaining}s`;
  }, [submissionCooldownRemainingMs]);

  const handleChange = (field) => (event) => {
    const value = field === "confirmed" ? event.target.checked : event.target.value;

    if (field === "assignmentTitle") {
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

  const selectedDayNumber = useMemo(
    () => deriveChapterValue(form.assignmentTitle),
    [deriveChapterValue, form.assignmentTitle]
  );
  const isOrientationDay = selectedDayNumber === 0;
  const selectedOptionMeta = useMemo(
    () => decoratedAssignmentOptions.find((option) => option.value === form.assignmentTitle) || null,
    [decoratedAssignmentOptions, form.assignmentTitle]
  );
  const selectedAssignmentEligibility = useMemo(() => {
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
  }, [isGerman, isSelectedLocked, selectedOptionMeta]);
  const assignmentInfo = useMemo(() => {
    const base = form.assignmentTitle || assignmentOptions[0] || "Assignment";
    return selectedDayNumber ? `${base} (Day ${selectedDayNumber})` : base;
  }, [assignmentOptions, form.assignmentTitle, selectedDayNumber]);

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

      setStatus({ loading: false, error: "", success: "Thanks! Your submission has been saved." });
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
        assignmentKey: selectedAssignmentId,
        canonicalAssignmentKey: selectedAssignmentId,
        title: form.assignmentTitle,
        assignmentTitle: form.assignmentTitle,
        level: ALLOWED_LEVELS.includes(preferredLevel) ? preferredLevel : "GENERAL",
        chapter: deriveChapterValue(form.assignmentTitle),
        assignmentId: buildAssignmentId(form.assignmentTitle),
        chapterKey: buildChapterKey(form.assignmentTitle),
        studentId: user.uid,
        studentEmail: user?.email || "",
        studentCode,
        studentScopeKey,
        studentName: studentProfile?.name || "",
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
        assignmentKey: selectedAssignmentId,
        canonicalAssignmentKey: selectedAssignmentId,
        title: form.assignmentTitle,
        assignmentTitle: form.assignmentTitle,
        level: ALLOWED_LEVELS.includes(preferredLevel) ? preferredLevel : "GENERAL",
        chapter: deriveChapterValue(form.assignmentTitle),
        assignmentId: buildAssignmentId(form.assignmentTitle),
        chapterKey: buildChapterKey(form.assignmentTitle),
        studentId: user.uid,
        studentEmail: user?.email || "",
        studentCode,
        studentScopeKey,
        studentName: studentProfile?.name || "",
        className: studentProfile?.className || "",
        submissionFingerprint: buildSubmissionFingerprint({
          assignmentTitle: form.assignmentTitle,
          chapterKey: buildChapterKey(form.assignmentTitle),
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

      setResubmissionStatus({ loading: false, error: "", success: "Resubmission sent successfully." });
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
                value={form.assignmentTitle || assignmentOptions[0]}
                onChange={handleChange("assignmentTitle")}
                style={styles.select}
              >
                {decoratedAssignmentOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled} title={opt.disabled ? uiText.orientationOnly : ""}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {isSelectedLocked && !selectedAssignmentPassed ? (
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
                value={form.submissionText}
                onChange={handleChange("submissionText")}
                maxLength={dynamicMaxSubmissionCharacters}
                style={{ ...styles.textArea, minHeight: 200 }}
                placeholder={
                  isSelectedLocked
                    ? "This assignment is locked. Your previous submission is shown below."
                    : "Type your answer here or paste it in."
                }
                disabled={isSelectedLocked}
              />
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
              disabled={confirmationLocked || status.loading || isSelectedLocked || isOrientationDay}
            />
            <span style={{ ...styles.label, margin: 0 }}>I confirm this is the correct assignment.</span>
          </label>

          <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 10, background: "#f9fafb" }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>{isGerman ? "Einreichungsübersicht" : "Submission summary"}</div>
            <div style={styles.helperText}>Assignment: {form.assignmentTitle || "–"}</div>
            <div style={styles.helperText}>Class: {studentProfile?.className || "–"}</div>
            <div style={styles.helperText}>Level: {preferredLevel}</div>
            <div style={styles.helperText}>Student code: {studentCode || "–"}</div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              style={styles.secondaryButton}
              onClick={handleSaveDraft}
              disabled={status.loading || isSelectedLocked}
            >
              {status.loading ? "Saving ..." : "Save draft"}
            </button>

            <button
              type="submit"
              style={styles.primaryButton}
              disabled={status.loading || confirmationLocked || isSelectedLocked || isOrientationDay || submissionCooldownRemainingMs > 0}
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

export default AssignmentSubmissionPage;
