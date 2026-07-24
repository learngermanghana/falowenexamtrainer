import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { collection, db, doc, getDoc, serverTimestamp, setDoc } from "../firebase";
import { styles } from "../styles";
import { triggerInteractionFeedback } from "../services/interactionFeedback";
import { getInlineCourseAssignments } from "../utils/courseLessonAssignments";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import ExamReadinessBadge from "./ExamReadinessBadge";
import { InfoBox } from "./ui";

const DRAFT_COLLECTION = "submissionDrafts";
const SUBMISSION_COLLECTION = "submissions";
const LOCK_COLLECTION = "submissionLocks";
const AUTOSAVE_DELAY_MS = 900;
const MIN_SUBMISSION_CHARACTERS = 20;
const MIN_SUBMISSION_WORDS = 20;
const MAX_SUBMISSION_CHARACTERS = 2500;
const GERMAN_SPECIAL_CHARACTERS = ["ä", "ö", "ü", "ß", "Ä", "Ö", "Ü"];

const normalizeIdPart = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9._-]/g, "_")
    .slice(0, 120);

const normalizeIdentity = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/_/g, "-")
    .trim();

const normalizeText = (value) => String(value || "").trim();

const buildStudentScopeKey = ({ userId, studentCode, studentEmail }) =>
  [userId, studentCode, studentEmail]
    .map((part) => normalizeIdPart(part || ""))
    .filter(Boolean)
    .join("__") || "anonymous";

const timestampToMillis = (value) => {
  if (!value) return 0;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.toDate === "function") return value.toDate().getTime();
  if (Number.isFinite(value?.seconds)) return Number(value.seconds) * 1000;
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
};

const timestampToIso = (value) => {
  const milliseconds = timestampToMillis(value);
  return milliseconds ? new Date(milliseconds).toISOString() : "";
};

const formatTime = (value) => {
  const milliseconds = value instanceof Date ? value.getTime() : timestampToMillis(value);
  if (!milliseconds) return "";
  return new Date(milliseconds).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatCloudError = (error) => {
  const code = error?.code || error?.name || "firestore-error";
  const message = error?.message || String(error || "Unknown Firestore error");
  return `${code}: ${message}`;
};

const getDraftText = (data = {}) =>
  String(data.submissionText || data.answer || data.workContent || "");

const makeInitialCloudState = (docId = "") => ({
  state: "checking",
  error: "",
  savedAt: null,
  restored: false,
  loaded: false,
  writeCount: 0,
  docId,
  localDirty: false,
  remoteUpdatedAt: "",
  remoteSource: "",
});

const VerifiedCloudDraftSubmissionPage = ({ submissionContext = null }) => {
  const { user, studentProfile } = useAuth();
  const { showToast } = useToast();
  const textareaRef = useRef(null);
  const autosaveTimerRef = useRef(null);
  const mountedRef = useRef(true);
  const dirtyRef = useRef(false);
  const currentTextRef = useRef("");
  const knownRemoteVersionRef = useRef(0);
  const createdAtRef = useRef(null);

  const level = String(submissionContext?.level || "A1").trim().toUpperCase();
  const day = Number(submissionContext?.day || 0);
  const chapter = String(
    submissionContext?.chapter ||
      String(submissionContext?.assignmentKey || "").replace(/^[A-Z0-9]+-/i, "") ||
      ""
  ).trim();
  const assignmentKey = String(
    submissionContext?.canonicalAssignmentKey || submissionContext?.assignmentKey || ""
  ).trim();

  const assignmentDefinition = useMemo(
    () =>
      getInlineCourseAssignments(level, day).find(
        (item) =>
          normalizeIdentity(item.assignmentKey) === normalizeIdentity(assignmentKey) ||
          String(item.chapter || "").trim() === chapter
      ) || null,
    [assignmentKey, chapter, day, level]
  );

  const assignmentTitle = useMemo(() => {
    if (submissionContext?.assignmentTitle) return String(submissionContext.assignmentTitle).trim();
    const topic = String(assignmentDefinition?.title || "").trim();
    return `${level} • Day ${day}${topic ? `: ${topic}` : ""}${chapter ? ` • Chapter ${chapter}` : ""}`;
  }, [assignmentDefinition?.title, chapter, day, level, submissionContext?.assignmentTitle]);

  const chapterKey = useMemo(
    () => `chapter-${normalizeIdPart(chapter || assignmentKey || day || "unknown")}`,
    [assignmentKey, chapter, day]
  );

  const studentCode =
    studentProfile?.studentCode || studentProfile?.studentcode || studentProfile?.id || "";
  const studentName =
    studentProfile?.name ||
    studentProfile?.fullName ||
    studentProfile?.displayName ||
    user?.displayName ||
    String(user?.email || "").split("@")[0] ||
    "";

  const studentScopeKey = useMemo(
    () =>
      buildStudentScopeKey({
        userId: user?.uid,
        studentCode,
        studentEmail: user?.email,
      }),
    [studentCode, user?.email, user?.uid]
  );

  const draftDocId = useMemo(
    () => `${studentScopeKey}__${normalizeIdPart(level)}__${normalizeIdPart(chapterKey)}`,
    [chapterKey, level, studentScopeKey]
  );

  const [text, setText] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [ready, setReady] = useState(false);
  const [locked, setLocked] = useState(false);
  const [lockData, setLockData] = useState(null);
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });
  const [pendingRemoteDraft, setPendingRemoteDraft] = useState(null);
  const [cloudState, setCloudState] = useState(() => makeInitialCloudState(draftDocId));
  const [finalSubmissionState, setFinalSubmissionState] = useState({
    state: "idle",
    error: "",
    submissionId: "",
    path: "",
    fallback: false,
    verifiedAt: null,
  });

  useEffect(() => {
    currentTextRef.current = text;
  }, [text]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (autosaveTimerRef.current) window.clearTimeout(autosaveTimerRef.current);
    };
  }, []);

  const applyRemoteDraft = useCallback((data, source) => {
    const remoteText = getDraftText(data);
    const remoteVersion = timestampToMillis(data?.updatedAt);
    const remoteUpdatedAt = timestampToIso(data?.updatedAt);

    createdAtRef.current = data?.createdAt || createdAtRef.current;
    knownRemoteVersionRef.current = Math.max(knownRemoteVersionRef.current, remoteVersion);
    currentTextRef.current = remoteText;
    dirtyRef.current = false;
    setText(remoteText);
    setPendingRemoteDraft(null);
    setCloudState((current) => ({
      ...current,
      state: remoteText ? "restored" : "idle",
      error: "",
      restored: Boolean(remoteText),
      loaded: true,
      docId: draftDocId,
      localDirty: false,
      remoteUpdatedAt,
      remoteSource: source,
    }));
  }, [draftDocId]);

  const loadCloudDraft = useCallback(
    async ({ source = "firestore-server", force = false } = {}) => {
      if (!db || !user?.uid || !draftDocId) {
        if (mountedRef.current) {
          setReady(true);
          setCloudState((current) => ({
            ...current,
            state: "error",
            error: "No authenticated Firebase user is available for cloud draft loading.",
            loaded: true,
          }));
        }
        return { ok: false, reason: "auth" };
      }

      try {
        if (mountedRef.current) {
          setCloudState((current) => ({ ...current, state: "checking", error: "", docId: draftDocId }));
        }

        const snapshot = await getDoc(doc(db, DRAFT_COLLECTION, draftDocId));
        if (!mountedRef.current) return { ok: false, reason: "unmounted" };

        if (!snapshot.exists()) {
          knownRemoteVersionRef.current = 0;
          createdAtRef.current = null;
          setCloudState((current) => ({
            ...current,
            state: "idle",
            error: "",
            loaded: true,
            restored: false,
            docId: draftDocId,
            localDirty: dirtyRef.current,
            remoteUpdatedAt: "",
            remoteSource: source,
          }));
          setReady(true);
          return { ok: true, empty: true };
        }

        const data = snapshot.data() || {};
        const remoteText = getDraftText(data);
        const remoteVersion = timestampToMillis(data.updatedAt);
        const localText = currentTextRef.current;
        const hasLocalConflict =
          !force &&
          dirtyRef.current &&
          normalizeText(localText) !== normalizeText(remoteText);

        if (hasLocalConflict) {
          setPendingRemoteDraft({
            text: remoteText,
            version: remoteVersion,
            updatedAt: data.updatedAt || null,
            createdAt: data.createdAt || null,
          });
          setCloudState((current) => ({
            ...current,
            state: "conflict",
            error: "",
            loaded: true,
            docId: draftDocId,
            localDirty: true,
            remoteUpdatedAt: timestampToIso(data.updatedAt),
            remoteSource: source,
          }));
          setReady(true);
          return { ok: false, reason: "conflict" };
        }

        applyRemoteDraft(data, source);
        setReady(true);
        return { ok: true, restored: true };
      } catch (error) {
        const exactError = formatCloudError(error);
        console.error("A1 Firestore draft load failed", error);
        if (mountedRef.current) {
          setReady(true);
          setCloudState((current) => ({
            ...current,
            state: "error",
            error: exactError,
            loaded: true,
            docId: draftDocId,
          }));
        }
        return { ok: false, reason: "firestore", error: exactError };
      }
    },
    [applyRemoteDraft, draftDocId, user?.uid]
  );

  const saveDraft = useCallback(
    async ({ source = "autosave", force = false } = {}) => {
      const submissionText = normalizeText(currentTextRef.current);
      if (!submissionText) return { ok: false, reason: "empty" };
      if (!db || !user?.uid) return { ok: false, reason: "auth" };

      const draftRef = doc(db, DRAFT_COLLECTION, draftDocId);
      const nowLocal = new Date();

      try {
        if (mountedRef.current) {
          setCloudState((current) => ({
            ...current,
            state: "saving",
            error: "",
            docId: draftDocId,
            localDirty: true,
          }));
        }

        const beforeSnapshot = await getDoc(draftRef);
        const beforeData = beforeSnapshot.exists() ? beforeSnapshot.data() || {} : {};
        const remoteText = getDraftText(beforeData);
        const remoteVersion = timestampToMillis(beforeData.updatedAt);
        const remoteChangedSinceLoad =
          remoteVersion > knownRemoteVersionRef.current &&
          normalizeText(remoteText) !== submissionText;

        if (!force && remoteChangedSinceLoad) {
          setPendingRemoteDraft({
            text: remoteText,
            version: remoteVersion,
            updatedAt: beforeData.updatedAt || null,
            createdAt: beforeData.createdAt || null,
          });
          setCloudState((current) => ({
            ...current,
            state: "conflict",
            error: "",
            loaded: true,
            docId: draftDocId,
            localDirty: true,
            remoteUpdatedAt: timestampToIso(beforeData.updatedAt),
            remoteSource: "firestore-preflight",
          }));
          return { ok: false, reason: "conflict" };
        }

        const payload = {
          title: assignmentTitle,
          assignmentTitle,
          level,
          day,
          chapter,
          chapterKey,
          assignmentId: assignmentKey,
          assignment_id: assignmentKey,
          assignmentKey,
          canonicalAssignmentKey: assignmentKey,
          submissionText,
          answer: submissionText,
          workContent: submissionText,
          status: "draft",
          studentId: user.uid,
          userId: user.uid,
          uid: user.uid,
          ownerUid: user.uid,
          studentEmail: user?.email || "",
          studentCode,
          studentScopeKey,
          studentName,
          className: studentProfile?.className || "",
          cloudPersistenceSource: source,
          cloudPersistenceVersion: 4,
          createdAt: beforeData.createdAt || createdAtRef.current || serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        await setDoc(draftRef, payload, { merge: true });
        const verifiedSnapshot = await getDoc(draftRef);
        const verifiedData = verifiedSnapshot.exists() ? verifiedSnapshot.data() || {} : null;

        if (!verifiedData || normalizeText(getDraftText(verifiedData)) !== submissionText) {
          throw new Error("Firestore write verification did not return the latest draft text.");
        }

        createdAtRef.current = verifiedData.createdAt || createdAtRef.current;
        knownRemoteVersionRef.current = timestampToMillis(verifiedData.updatedAt) || Date.now();
        dirtyRef.current = false;
        currentTextRef.current = submissionText;
        setPendingRemoteDraft(null);
        if (mountedRef.current) {
          setCloudState((current) => ({
            ...current,
            state: "saved",
            error: "",
            savedAt: nowLocal,
            restored: current.restored,
            loaded: true,
            writeCount: current.writeCount + 1,
            docId: draftDocId,
            localDirty: false,
            remoteUpdatedAt: timestampToIso(verifiedData.updatedAt) || nowLocal.toISOString(),
            remoteSource: source,
          }));
        }
        return { ok: true, draftDocId };
      } catch (error) {
        const exactError = formatCloudError(error);
        console.error("A1 Firestore draft save failed", error);
        if (mountedRef.current) {
          setCloudState((current) => ({
            ...current,
            state: "error",
            error: exactError,
            loaded: true,
            docId: draftDocId,
            localDirty: dirtyRef.current,
          }));
        }
        return { ok: false, reason: "firestore", error: exactError };
      }
    },
    [
      assignmentKey,
      assignmentTitle,
      chapter,
      chapterKey,
      day,
      draftDocId,
      level,
      studentCode,
      studentName,
      studentProfile?.className,
      studentScopeKey,
      user?.email,
      user?.uid,
    ]
  );

  useEffect(() => {
    dirtyRef.current = false;
    currentTextRef.current = "";
    knownRemoteVersionRef.current = 0;
    createdAtRef.current = null;
    setText("");
    setConfirmed(false);
    setPendingRemoteDraft(null);
    setReady(false);
    setLocked(false);
    setLockData(null);
    setStatus({ loading: false, error: "", success: "" });
    setCloudState(makeInitialCloudState(draftDocId));

    let cancelled = false;
    const initialize = async () => {
      if (!db || !user?.uid) {
        if (!cancelled) {
          setReady(true);
          setCloudState((current) => ({
            ...current,
            state: "error",
            error: "Sign in again before saving or submitting work.",
            loaded: true,
          }));
        }
        return;
      }

      try {
        const lockSnapshot = await getDoc(doc(db, LOCK_COLLECTION, draftDocId));
        if (cancelled) return;
        if (lockSnapshot.exists()) {
          setLockData(lockSnapshot.data() || {});
          setLocked(true);
          setReady(true);
          setCloudState((current) => ({
            ...current,
            state: "locked",
            loaded: true,
            docId: draftDocId,
            localDirty: false,
          }));
          return;
        }

        await loadCloudDraft({ source: "initial-open", force: true });
      } catch (error) {
        if (cancelled) return;
        const exactError = formatCloudError(error);
        setReady(true);
        setCloudState((current) => ({
          ...current,
          state: "error",
          error: exactError,
          loaded: true,
        }));
      }
    };

    initialize();
    return () => {
      cancelled = true;
    };
  }, [draftDocId, loadCloudDraft, user?.uid]);

  useEffect(() => {
    if (!ready || locked || !db || !user?.uid) return undefined;

    const refreshFromCloud = () => {
      if (document.visibilityState === "hidden") return;
      if (document.activeElement === textareaRef.current) return;
      loadCloudDraft({ source: "device-focus", force: false });
    };

    window.addEventListener("focus", refreshFromCloud);
    document.addEventListener("visibilitychange", refreshFromCloud);
    return () => {
      window.removeEventListener("focus", refreshFromCloud);
      document.removeEventListener("visibilitychange", refreshFromCloud);
    };
  }, [loadCloudDraft, locked, ready, user?.uid]);

  useEffect(() => {
    if (autosaveTimerRef.current) window.clearTimeout(autosaveTimerRef.current);
    if (!ready || locked || !dirtyRef.current || !normalizeText(text) || pendingRemoteDraft) return undefined;

    autosaveTimerRef.current = window.setTimeout(() => {
      saveDraft({ source: "react-autosave" });
    }, AUTOSAVE_DELAY_MS);

    return () => {
      if (autosaveTimerRef.current) window.clearTimeout(autosaveTimerRef.current);
    };
  }, [locked, pendingRemoteDraft, ready, saveDraft, text]);

  const handleTextChange = (event) => {
    const nextValue = event.currentTarget.value;
    currentTextRef.current = nextValue;
    dirtyRef.current = true;
    setText(nextValue);
    setStatus((current) => ({ ...current, error: "", success: "" }));
    setCloudState((current) => ({
      ...current,
      state: current.state === "conflict" ? "conflict" : "local",
      localDirty: true,
    }));
  };

  const insertCharacter = (character) => {
    const input = textareaRef.current;
    const start = typeof input?.selectionStart === "number" ? input.selectionStart : text.length;
    const end = typeof input?.selectionEnd === "number" ? input.selectionEnd : start;
    const nextValue = `${text.slice(0, start)}${character}${text.slice(end)}`;
    currentTextRef.current = nextValue;
    dirtyRef.current = true;
    setText(nextValue);
    setCloudState((current) => ({ ...current, state: "local", localDirty: true }));

    window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
      const cursor = start + character.length;
      textareaRef.current?.setSelectionRange(cursor, cursor);
    });
  };

  const handleLoadNewestCloudDraft = () => {
    if (!pendingRemoteDraft) return;
    const remoteData = {
      submissionText: pendingRemoteDraft.text,
      updatedAt: pendingRemoteDraft.updatedAt,
      createdAt: pendingRemoteDraft.createdAt,
    };
    applyRemoteDraft(remoteData, "conflict-load-cloud");
    setStatus({
      loading: false,
      error: "",
      success: "The newest cloud draft was loaded. This device will not overwrite it.",
    });
  };

  const handleKeepDeviceVersion = async () => {
    setPendingRemoteDraft(null);
    const result = await saveDraft({ source: "conflict-keep-device", force: true });
    if (result.ok) {
      setStatus({
        loading: false,
        error: "",
        success: "This device version is now the newest verified cloud draft.",
      });
    } else {
      setStatus({
        loading: false,
        error: "Could not save this device version.",
        success: "",
      });
    }
  };

  const handleManualSave = async () => {
    setStatus({ loading: true, error: "", success: "" });
    const result = await saveDraft({ source: "manual-save", force: false });
    if (result.ok) {
      setStatus({
        loading: false,
        error: "",
        success: "Draft saved and verified in Firestore.",
      });
      triggerInteractionFeedback({
        sound: "info",
        toastMessage: "Draft saved and verified.",
        toastVariant: "info",
        showToast,
      });
      return;
    }

    if (result.reason === "conflict") {
      setStatus({
        loading: false,
        error: "A newer draft exists on another device. Choose which version to keep.",
        success: "",
      });
      return;
    }

    setStatus({
      loading: false,
      error: result.reason === "empty" ? "Type your answer before saving." : "Could not save your draft.",
      success: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const submissionText = normalizeText(currentTextRef.current);

    if (!ready) {
      setStatus({ loading: false, error: "Wait until the cloud draft check is complete.", success: "" });
      return;
    }
    if (pendingRemoteDraft) {
      setStatus({
        loading: false,
        error: "Resolve the newer cloud draft before submitting.",
        success: "",
      });
      return;
    }
    const submissionWordCount = submissionText ? submissionText.split(/\s+/).filter(Boolean).length : 0;
    if (submissionText.length < MIN_SUBMISSION_CHARACTERS) {
      setStatus({
        loading: false,
        error: `Please add a fuller response (${MIN_SUBMISSION_CHARACTERS}+ characters) before submitting.`,
        success: "",
      });
      return;
    }
    if (submissionWordCount < MIN_SUBMISSION_WORDS) {
      setStatus({
        loading: false,
        error: `Please type at least ${MIN_SUBMISSION_WORDS} words before submitting. You currently have ${submissionWordCount} word${submissionWordCount === 1 ? "" : "s"}.`,
        success: "",
      });
      return;
    }
    if (submissionText.length > MAX_SUBMISSION_CHARACTERS) {
      setStatus({
        loading: false,
        error: `Your response is too long (${MAX_SUBMISSION_CHARACTERS} characters maximum).`,
        success: "",
      });
      return;
    }
    if (!confirmed) {
      setStatus({
        loading: false,
        error: "Please confirm that this is the correct assignment.",
        success: "",
      });
      return;
    }
    if (!db || !user?.uid) {
      setStatus({ loading: false, error: "Sign in again before submitting.", success: "" });
      return;
    }

    setStatus({ loading: true, error: "", success: "" });
    setFinalSubmissionState({
      state: "saving",
      error: "",
      submissionId: "",
      path: "",
      fallback: false,
      verifiedAt: null,
    });

    try {
      const draftResult = await saveDraft({ source: "before-final-submit", force: false });
      if (!draftResult.ok && draftResult.reason === "conflict") {
        setFinalSubmissionState((current) => ({ ...current, state: "idle" }));
        setStatus({
          loading: false,
          error: "A newer draft exists on another device. Resolve it before submitting.",
          success: "",
        });
        return;
      }

      const lockRef = doc(db, LOCK_COLLECTION, draftDocId);
      const existingLock = await getDoc(lockRef);
      if (existingLock.exists()) {
        setLockData(existingLock.data() || {});
        setLocked(true);
        setReady(true);
        setStatus({
          loading: false,
          error: "This assignment was already submitted and is locked.",
          success: "",
        });
        return;
      }

      const submissionRef = doc(collection(db, SUBMISSION_COLLECTION));
      const submissionPath = `${SUBMISSION_COLLECTION}/${submissionRef.id}`;
      const now = serverTimestamp();
      const submissionFingerprint = `${normalizeIdPart(assignmentTitle)}::${normalizeIdPart(
        chapterKey
      )}::${normalizeIdPart(submissionText.toLowerCase()).slice(0, 240)}`;

      const payload = {
        submissionId: submissionRef.id,
        path: submissionPath,
        submissionPath,
        title: assignmentTitle,
        assignmentTitle,
        level,
        day,
        chapter,
        chapterKey,
        assignmentId: assignmentKey,
        assignment_id: assignmentKey,
        assignmentKey,
        canonicalAssignmentKey: assignmentKey,
        submissionFingerprint,
        submissionText,
        answer: submissionText,
        workContent: submissionText,
        status: "submitted",
        reviewStatus: "pending_review",
        attempt: 1,
        attemptNumber: 1,
        isResubmission: false,
        assignment: true,
        progressionEligible: true,
        studentId: user.uid,
        userId: user.uid,
        uid: user.uid,
        ownerUid: user.uid,
        studentEmail: user?.email || "",
        studentCode,
        studentScopeKey,
        studentName,
        className: studentProfile?.className || "",
        source: "a1_react_owned_submission",
        createdAt: now,
        updatedAt: now,
        submittedAt: now,
      };

      await setDoc(submissionRef, payload);
      const verifiedSubmission = await getDoc(submissionRef);
      const verifiedData = verifiedSubmission.exists() ? verifiedSubmission.data() || {} : null;
      if (
        !verifiedData ||
        normalizeText(getDraftText(verifiedData)) !== submissionText ||
        verifiedData.studentId !== user.uid ||
        String(verifiedData.status || "").toLowerCase() !== "submitted"
      ) {
        throw new Error(`Final submission verification failed at /${submissionPath}.`);
      }

      const lockPayload = {
        studentId: user.uid,
        userId: user.uid,
        uid: user.uid,
        ownerUid: user.uid,
        studentEmail: user?.email || "",
        studentCode,
        studentScopeKey,
        level,
        day,
        chapter,
        chapterKey,
        assignmentTitle,
        assignmentId: assignmentKey,
        assignment_id: assignmentKey,
        assignmentKey,
        canonicalAssignmentKey: assignmentKey,
        submissionId: submissionRef.id,
        submissionPath,
        lockedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(lockRef, lockPayload, { merge: true });
      const verifiedLock = await getDoc(lockRef);
      if (!verifiedLock.exists() || verifiedLock.data()?.submissionId !== submissionRef.id) {
        throw new Error("The submission was saved, but its submission lock could not be verified.");
      }

      setLockData(verifiedLock.data() || lockPayload);
      setFinalSubmissionState({
        state: "verified",
        error: "",
        submissionId: submissionRef.id,
        path: submissionPath,
        fallback: false,
        verifiedAt: new Date(),
      });
      setStatus({
        loading: false,
        error: "",
        success: `Submission saved and verified at /${submissionPath}.`,
      });
      triggerInteractionFeedback({
        sound: "success",
        toastMessage: "Assignment submitted and verified.",
        toastVariant: "success",
        showToast,
        notificationTitle: "Assignment submitted",
        notificationBody: "Your work was saved and is ready for tutor marking.",
        notificationTag: "submission-success",
        vibratePattern: [70, 40, 100],
      });
      setLocked(true);
    } catch (error) {
      const exactError = formatCloudError(error);
      console.error("A1 final submission failed", error);
      setFinalSubmissionState({
        state: "error",
        error: exactError,
        submissionId: "",
        path: "",
        fallback: false,
        verifiedAt: null,
      });
      setStatus({
        loading: false,
        error: `Could not save your submission. ${exactError}`,
        success: "",
      });
    }
  };

  const cloudStatusText = useMemo(() => {
    if (!ready || cloudState.state === "checking") return "Checking Firestore for the newest draft…";
    if (cloudState.state === "saving") return "Saving and verifying your cloud draft…";
    if (cloudState.state === "saved") {
      const savedTime = formatTime(cloudState.savedAt);
      return `Cloud draft saved and verified${savedTime ? ` at ${savedTime}` : ""}.`;
    }
    if (cloudState.state === "restored") return "Newest cloud draft loaded from Firestore.";
    if (cloudState.state === "conflict") return "A newer draft exists on another device. Choose which version to keep.";
    if (cloudState.state === "error") return `Cloud draft error: ${cloudState.error}`;
    if (cloudState.state === "locked") return "This assignment has already been submitted.";
    if (cloudState.localDirty) return "Unsaved changes on this device…";
    return "Cloud draft protection is ready.";
  }, [cloudState, ready]);

  const cloudTone = cloudState.state === "error" || cloudState.state === "conflict"
    ? "error"
    : cloudState.state === "saved" || cloudState.state === "restored"
    ? "success"
    : "info";

  const debugAttributes = {
    "data-cloud-draft-persistence": "react-owned",
    "data-draft-save-state": cloudState.state,
    "data-draft-doc-id": draftDocId,
    "data-draft-cloud-error": cloudState.error || "",
    "data-draft-loaded": cloudState.loaded ? "true" : "false",
    "data-draft-write-count": String(cloudState.writeCount || 0),
    "data-draft-last-saved-at": cloudState.savedAt ? cloudState.savedAt.toISOString() : "",
    "data-draft-local-dirty": cloudState.localDirty ? "true" : "false",
    "data-draft-conflict": pendingRemoteDraft ? "true" : "false",
    "data-draft-remote-updated-at": cloudState.remoteUpdatedAt || "",
    "data-draft-remote-source": cloudState.remoteSource || "",
    "data-final-submission-state": finalSubmissionState.state,
    "data-final-submission-id": finalSubmissionState.submissionId || lockData?.submissionId || "",
    "data-final-submission-path": finalSubmissionState.path || lockData?.submissionPath || "",
    "data-final-submission-error": finalSubmissionState.error || "",
    "data-final-submission-fallback": finalSubmissionState.fallback ? "true" : "false",
    "data-final-submission-verified-at": finalSubmissionState.verifiedAt
      ? finalSubmissionState.verifiedAt.toISOString()
      : "",
  };

  if (locked) {
    return (
      <div {...debugAttributes}>
        {finalSubmissionState.state === "verified" ? (
          <InfoBox tone="success">
            Final submission saved and verified in Firestore at /{finalSubmissionState.path}.
          </InfoBox>
        ) : null}
        <AssignmentSubmissionPage submissionContext={submissionContext} />
      </div>
    );
  }

  const wordCount = normalizeText(text) ? normalizeText(text).split(/\s+/).filter(Boolean).length : 0;
  const hasMinimumWords = wordCount >= MIN_SUBMISSION_WORDS;

  return (
    <div {...debugAttributes} style={{ display: "grid", gap: 12 }}>
      <InfoBox tone={cloudTone}>{cloudStatusText}</InfoBox>

      {pendingRemoteDraft ? (
        <div
          role="alert"
          style={{
            background: "#fff7ed",
            border: "1px solid #fdba74",
            borderRadius: 12,
            color: "#7c2d12",
            display: "grid",
            gap: 10,
            padding: 12,
          }}
        >
          <strong>Two devices have different drafts</strong>
          <span>
            The cloud version was updated {formatTime(pendingRemoteDraft.updatedAt) || "on another device"}.
            Nothing has been overwritten.
          </span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" style={styles.primaryButton} onClick={handleLoadNewestCloudDraft}>
              Load newest cloud draft
            </button>
            <button type="button" style={styles.secondaryButton} onClick={handleKeepDeviceVersion}>
              Keep this device version
            </button>
          </div>
        </div>
      ) : null}

      <section style={{ ...styles.card, display: "grid", gap: 8 }}>
        <h3 style={{ ...styles.sectionTitle, margin: 0 }}>Certificate readiness</h3>
        <p style={{ ...styles.helperText, margin: 0 }}>
          Keep this visible before every submission so you can spot missed or failed tasks early.
        </p>
        <ExamReadinessBadge studentProfile={studentProfile} variant="button" />
      </section>

      <div style={{ ...styles.card, display: "grid", gap: 12 }}>
        <div>
          <h2 style={styles.sectionTitle}>Submit Assignment</h2>
          <p style={{ ...styles.helperText, margin: 0 }}>
            Type or paste your answer below. Your student details are added automatically.
          </p>
        </div>

        {status.error ? <InfoBox tone="error">{status.error}</InfoBox> : null}
        {status.success ? <InfoBox tone="success">{status.success}</InfoBox> : null}

        <form style={{ display: "grid", gap: 12 }} onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 10,
            }}
          >
            <div style={{ ...styles.field, margin: 0 }}>
              <span style={styles.label}>Submit level</span>
              <input style={styles.input} value={level} readOnly />
            </div>
            <div style={{ ...styles.field, margin: 0 }}>
              <span style={styles.label}>Assignment</span>
              <input style={styles.input} value={assignmentTitle} readOnly />
            </div>
            <details style={{ ...styles.field, margin: 0 }}>
              <summary style={{ ...styles.label, cursor: "pointer", padding: "8px 0" }}>
                Student details
              </summary>
              <div style={{ ...styles.metaRow, padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 10 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{user?.email || "–"}</div>
                  <div style={styles.helperText}>Email • Enrolled level {level}</div>
                </div>
                <span style={styles.badge}>{studentCode || "No code"}</span>
              </div>
            </details>
          </div>

          <div
            style={{
              background: "#ecfdf5",
              border: "1px solid #bbf7d0",
              borderRadius: 10,
              fontWeight: 700,
              padding: "10px 12px",
            }}
          >
            This assignment is submittable
          </div>

          <label style={{ ...styles.field, margin: 0 }}>
            <span style={styles.label}>Your text *</span>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextChange}
              onInput={handleTextChange}
              onCompositionEnd={handleTextChange}
              inputMode="text"
              autoCapitalize="sentences"
              autoCorrect="off"
              spellCheck={false}
              maxLength={MAX_SUBMISSION_CHARACTERS}
              data-minimum-words={MIN_SUBMISSION_WORDS}
              style={{ ...styles.textArea, minHeight: 220 }}
              placeholder={ready ? "Type your answer here or paste it in." : "Checking the newest cloud draft…"}
              disabled={!ready || status.loading}
            />
            <span style={styles.helperText}>
              {text.length.toLocaleString()} / {MAX_SUBMISSION_CHARACTERS.toLocaleString()} characters · {wordCount} words ·{" "}
              {!hasMinimumWords
                ? `Minimum ${MIN_SUBMISSION_WORDS} words before submitting`
                : text.trim().length < MIN_SUBMISSION_CHARACTERS
                ? `Minimum ${MIN_SUBMISSION_CHARACTERS} characters`
                : "Ready to submit"}
            </span>
          </label>

          <div>
            <span style={{ ...styles.helperText, marginTop: 6 }}>Quick umlaut keys:</span>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
              {GERMAN_SPECIAL_CHARACTERS.map((character) => (
                <button
                  key={character}
                  type="button"
                  style={{ ...styles.chipButton, minWidth: 44, textAlign: "center" }}
                  onClick={() => insertCharacter(character)}
                  disabled={!ready || status.loading}
                >
                  {character}
                </button>
              ))}
            </div>
          </div>

          <label style={{ ...styles.field, flexDirection: "row", alignItems: "center", gap: 8, margin: 0 }}>
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(event) => setConfirmed(event.target.checked)}
              disabled={!ready || status.loading}
            />
            <span style={{ ...styles.label, margin: 0 }}>
              I checked that this is the correct assignment.
            </span>
          </label>

          <details style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 10, background: "#f9fafb" }}>
            <summary style={{ fontWeight: 700, cursor: "pointer", padding: "4px 0" }}>Review details</summary>
            <div style={{ marginTop: 6 }}>
              <div style={styles.helperText}>Day: {day}</div>
              <div style={styles.helperText}>Chapter: {chapter || "–"}</div>
              <div style={styles.helperText}>Assignment key: {assignmentKey || "–"}</div>
              <div style={styles.helperText}>Class: {studentProfile?.className || "–"}</div>
            </div>
          </details>

          <div
            data-a1-submission-actions
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 10,
              alignItems: "center",
            }}
          >
            <button
              type="button"
              style={{ ...styles.secondaryButton, display: "inline-flex", justifyContent: "center", minHeight: 44 }}
              onClick={handleManualSave}
              disabled={!ready || status.loading || !normalizeText(text)}
            >
              {status.loading ? "Saving…" : "Save draft"}
            </button>

            <button
              type="submit"
              data-a1-final-submit-button
              aria-label="Submit assignment for tutor marking"
              style={{
                ...styles.primaryButton,
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 44,
                opacity: 1,
                visibility: "visible",
              }}
              disabled={!ready || status.loading || !hasMinimumWords}
            >
              {finalSubmissionState.state === "saving" ? "Submitting…" : "Submit assignment"}
            </button>
          </div>

          <span style={styles.helperText}>Your first confirmed submission is final.</span>
        </form>
      </div>
    </div>
  );
};

export default VerifiedCloudDraftSubmissionPage;
