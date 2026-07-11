import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db, doc, getDoc, onSnapshot, serverTimestamp, setDoc } from "../firebase";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";

const DRAFT_COLLECTION = "submissionDrafts";
const AUTOSAVE_DELAY_MS = 900;
const RECONCILE_DELAYS_MS = [0, 60, 180, 400, 900, 1600, 2600, 4000, 6500, 10000];

const normalizeIdPart = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9._-]/g, "_")
    .slice(0, 120);

const buildStudentScopeKey = ({ userId, studentCode, studentEmail }) =>
  [userId, studentCode, studentEmail]
    .map((part) => normalizeIdPart(part || ""))
    .filter(Boolean)
    .join("__") || "anonymous";

const getPrimaryTextarea = (root) => {
  if (!root) return null;
  return (
    Array.from(root.querySelectorAll("textarea")).find(
      (textarea) => !textarea.readOnly && !textarea.closest("[data-assignment-submit-debug]")
    ) || null
  );
};

const getAssignmentTitle = (root, fallback) => {
  if (!root) return fallback;
  const assignmentSelect = Array.from(root.querySelectorAll("select")).find((select) =>
    Array.from(select.options || []).some((option) => /select an assignment/i.test(String(option.textContent || "")))
  );
  return String(assignmentSelect?.value || fallback || "").trim();
};

const getDraftText = (data = {}) =>
  String(data.submissionText || data.answer || data.workContent || "");

const toMillis = (value) => {
  if (!value) return 0;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.toDate === "function") return value.toDate().getTime();
  if (typeof value?.seconds === "number") {
    return Number(value.seconds) * 1000 + Math.floor(Number(value.nanoseconds || 0) / 1000000);
  }
  if (value instanceof Date) return value.getTime();
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
};

const setControlledTextareaValue = (textarea, value) => {
  if (!textarea || typeof window === "undefined") return;
  const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
  if (nativeSetter) nativeSetter.call(textarea, value);
  else textarea.value = value;
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
  textarea.dispatchEvent(new Event("change", { bubbles: true }));
};

const formatSavedTime = (value) => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatCloudError = (error) => {
  const code = error?.code || error?.name || "firestore-error";
  const message = error?.message || String(error || "Unknown Firestore error");
  return `${code}: ${message}`;
};

const VerifiedCloudDraftSubmissionPage = ({ submissionContext = null }) => {
  const { user, studentProfile } = useAuth();
  const rootRef = useRef(null);
  const saveTimerRef = useRef(null);
  const reconcileTimersRef = useRef([]);
  const restoringRef = useRef(false);
  const userEditedRef = useRef(false);
  const existingCreatedAtRef = useRef(null);
  const latestCloudTextRef = useRef("");
  const lastSyncedCloudTextRef = useRef("");
  const latestCloudUpdatedAtRef = useRef(0);
  const mountedRef = useRef(true);
  const [cloudState, setCloudState] = useState({
    state: "idle",
    error: "",
    savedAt: null,
    restored: false,
    writeCount: 0,
    conflict: false,
    remoteUpdatedAt: null,
    remoteSource: "",
  });

  const level = String(submissionContext?.level || "A1").trim().toUpperCase();
  const day = Number(submissionContext?.day || 0);
  const assignmentKey = String(
    submissionContext?.canonicalAssignmentKey || submissionContext?.assignmentKey || ""
  ).trim();
  const chapter = String(submissionContext?.chapter || assignmentKey.replace(/^[A-Z0-9]+-/i, "") || "").trim();
  const studentCode =
    studentProfile?.studentCode || studentProfile?.studentcode || studentProfile?.id || "";
  const studentScopeKey = useMemo(
    () =>
      buildStudentScopeKey({
        userId: user?.uid,
        studentCode,
        studentEmail: user?.email,
      }),
    [studentCode, user?.email, user?.uid]
  );
  const chapterKey = useMemo(
    () => `chapter-${normalizeIdPart(chapter || assignmentKey || day || "unknown")}`,
    [assignmentKey, chapter, day]
  );
  const draftDocId = useMemo(
    () => `${studentScopeKey}__${normalizeIdPart(level)}__${normalizeIdPart(chapterKey)}`,
    [chapterKey, level, studentScopeKey]
  );
  const fallbackAssignmentTitle = `${level} • Day ${day}${chapter ? ` • Chapter ${chapter}` : ""}`;

  const clearReconcileTimers = useCallback(() => {
    reconcileTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    reconcileTimersRef.current = [];
  }, []);

  const applyLatestCloudDraft = useCallback(({ force = false, source = "cloud" } = {}) => {
    const textarea = getPrimaryTextarea(rootRef.current);
    const submissionText = latestCloudTextRef.current;
    if (!textarea || !submissionText.trim()) return false;

    const currentText = String(textarea.value || "");
    const localDirty = userEditedRef.current && currentText !== lastSyncedCloudTextRef.current;
    if (localDirty && !force) return false;

    if (currentText !== submissionText) {
      restoringRef.current = true;
      setControlledTextareaValue(textarea, submissionText);
      restoringRef.current = false;
    }

    lastSyncedCloudTextRef.current = submissionText;
    userEditedRef.current = false;
    if (mountedRef.current) {
      setCloudState((current) => ({
        ...current,
        state: "restored",
        error: "",
        restored: true,
        conflict: false,
        remoteUpdatedAt: latestCloudUpdatedAtRef.current
          ? new Date(latestCloudUpdatedAtRef.current)
          : current.remoteUpdatedAt,
        remoteSource: source,
      }));
    }
    return true;
  }, []);

  const scheduleCloudReconciliation = useCallback(
    (source = "cloud") => {
      clearReconcileTimers();
      reconcileTimersRef.current = RECONCILE_DELAYS_MS.map((delay) =>
        window.setTimeout(() => {
          if (!mountedRef.current || userEditedRef.current) return;
          applyLatestCloudDraft({ source });
        }, delay)
      );
    },
    [applyLatestCloudDraft, clearReconcileTimers]
  );

  const consumeCloudSnapshot = useCallback(
    (snapshot, source = "listener") => {
      if (!snapshot?.exists?.()) {
        latestCloudTextRef.current = "";
        lastSyncedCloudTextRef.current = "";
        latestCloudUpdatedAtRef.current = 0;
        if (mountedRef.current) {
          setCloudState((current) => ({
            ...current,
            state: "idle",
            error: "",
            conflict: false,
            remoteUpdatedAt: null,
            remoteSource: source,
          }));
        }
        return;
      }

      const data = snapshot.data() || {};
      const submissionText = getDraftText(data);
      const remoteUpdatedAtMs = toMillis(data.updatedAt || data.createdAt);
      existingCreatedAtRef.current = data.createdAt || existingCreatedAtRef.current;
      latestCloudTextRef.current = submissionText;
      latestCloudUpdatedAtRef.current = remoteUpdatedAtMs;

      if (!submissionText.trim()) {
        if (mountedRef.current) {
          setCloudState((current) => ({
            ...current,
            state: "idle",
            error: "",
            conflict: false,
            remoteUpdatedAt: remoteUpdatedAtMs ? new Date(remoteUpdatedAtMs) : null,
            remoteSource: source,
          }));
        }
        return;
      }

      const textarea = getPrimaryTextarea(rootRef.current);
      const currentText = String(textarea?.value || "");
      const localDirty = userEditedRef.current && currentText !== lastSyncedCloudTextRef.current;
      const remoteDiffersFromLocal = Boolean(textarea && currentText !== submissionText);

      if (localDirty && remoteDiffersFromLocal) {
        if (mountedRef.current) {
          setCloudState((current) => ({
            ...current,
            state: "conflict",
            error: "A newer draft was found on another device. This device has unsaved changes, so nothing was overwritten.",
            conflict: true,
            remoteUpdatedAt: remoteUpdatedAtMs ? new Date(remoteUpdatedAtMs) : null,
            remoteSource: source,
          }));
        }
        return;
      }

      applyLatestCloudDraft({ source });
      scheduleCloudReconciliation(source);
    },
    [applyLatestCloudDraft, scheduleCloudReconciliation]
  );

  const persistCloudDraft = useCallback(
    async (source = "autosave", { force = false } = {}) => {
      const root = rootRef.current;
      const textarea = getPrimaryTextarea(root);
      const submissionText = String(textarea?.value || "").trim();

      if (!submissionText) return { ok: false, reason: "empty" };
      if (source === "visibility-change" && !userEditedRef.current) {
        return { ok: false, reason: "clean" };
      }
      if (!db || !user?.uid) {
        const error = "No authenticated Firebase user is available for cloud draft saving.";
        if (mountedRef.current) {
          setCloudState((current) => ({ ...current, state: "error", error }));
        }
        return { ok: false, reason: "auth" };
      }

      const assignmentTitle = getAssignmentTitle(root, fallbackAssignmentTitle);
      const draftRef = doc(db, DRAFT_COLLECTION, draftDocId);
      const nowLocal = new Date();

      if (mountedRef.current) {
        setCloudState((current) => ({ ...current, state: "saving", error: "", conflict: false }));
      }

      try {
        const remoteSnapshot = await getDoc(draftRef);
        const remoteData = remoteSnapshot.exists() ? remoteSnapshot.data() || {} : {};
        const remoteText = getDraftText(remoteData).trim();
        const remoteUpdatedAtMs = toMillis(remoteData.updatedAt || remoteData.createdAt);
        const lastSyncedText = String(lastSyncedCloudTextRef.current || "").trim();
        const remoteChangedSinceSync =
          Boolean(remoteText) && remoteText !== lastSyncedText && remoteText !== submissionText;

        if (remoteChangedSinceSync && !force) {
          latestCloudTextRef.current = remoteText;
          latestCloudUpdatedAtRef.current = remoteUpdatedAtMs;
          existingCreatedAtRef.current = remoteData.createdAt || existingCreatedAtRef.current;
          if (mountedRef.current) {
            setCloudState((current) => ({
              ...current,
              state: "conflict",
              error: "A newer draft exists on another device. This older device was blocked from overwriting it.",
              conflict: true,
              remoteUpdatedAt: remoteUpdatedAtMs ? new Date(remoteUpdatedAtMs) : null,
              remoteSource: "pre-write-check",
            }));
          }
          return { ok: false, reason: "conflict" };
        }

        if (remoteText && remoteText === submissionText) {
          latestCloudTextRef.current = submissionText;
          lastSyncedCloudTextRef.current = submissionText;
          latestCloudUpdatedAtRef.current = remoteUpdatedAtMs;
          userEditedRef.current = false;
          if (mountedRef.current) {
            setCloudState((current) => ({
              ...current,
              state: "saved",
              error: "",
              savedAt: nowLocal,
              conflict: false,
              restored: true,
              remoteUpdatedAt: remoteUpdatedAtMs ? new Date(remoteUpdatedAtMs) : current.remoteUpdatedAt,
              remoteSource: "already-current",
            }));
          }
          return { ok: true, draftDocId, savedAt: nowLocal, alreadyCurrent: true };
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
          cloudPersistenceSource: source,
          cloudPersistenceVersion: 3,
          createdAt: existingCreatedAtRef.current || remoteData.createdAt || serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        await setDoc(draftRef, payload, { merge: true });
        const verifiedSnapshot = await getDoc(draftRef);
        const verifiedData = verifiedSnapshot.exists() ? verifiedSnapshot.data() || {} : null;

        if (!verifiedData || String(verifiedData.submissionText || "").trim() !== submissionText) {
          throw new Error("Firestore write verification did not return the latest draft text.");
        }

        const verifiedUpdatedAtMs = toMillis(verifiedData.updatedAt || verifiedData.createdAt) || Date.now();
        existingCreatedAtRef.current = verifiedData.createdAt || existingCreatedAtRef.current;
        latestCloudTextRef.current = submissionText;
        lastSyncedCloudTextRef.current = submissionText;
        latestCloudUpdatedAtRef.current = verifiedUpdatedAtMs;
        userEditedRef.current = false;
        if (mountedRef.current) {
          setCloudState((current) => ({
            ...current,
            state: "saved",
            error: "",
            savedAt: nowLocal,
            writeCount: current.writeCount + 1,
            conflict: false,
            restored: true,
            remoteUpdatedAt: new Date(verifiedUpdatedAtMs),
            remoteSource: source,
          }));
        }
        return { ok: true, draftDocId, savedAt: nowLocal };
      } catch (error) {
        const exactError = formatCloudError(error);
        console.error("Verified Firestore draft save failed", error);
        if (mountedRef.current) {
          setCloudState((current) => ({ ...current, state: "error", error: exactError }));
        }
        return { ok: false, reason: "firestore", error: exactError };
      }
    },
    [
      assignmentKey,
      chapter,
      chapterKey,
      day,
      draftDocId,
      fallbackAssignmentTitle,
      level,
      studentCode,
      studentScopeKey,
      user?.email,
      user?.uid,
    ]
  );

  const scheduleCloudSave = useCallback(() => {
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(() => {
      persistCloudDraft("autosave");
    }, AUTOSAVE_DELAY_MS);
  }, [persistCloudDraft]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
      clearReconcileTimers();
    };
  }, [clearReconcileTimers]);

  useEffect(() => {
    if (!db || !user?.uid || !draftDocId) return undefined;

    setCloudState((current) => ({ ...current, state: "checking", error: "" }));
    const draftRef = doc(db, DRAFT_COLLECTION, draftDocId);
    const unsubscribe = onSnapshot(
      draftRef,
      (snapshot) => {
        const source = snapshot.metadata?.fromCache ? "firestore-cache" : "firestore-server";
        consumeCloudSnapshot(snapshot, source);
      },
      (error) => {
        const exactError = formatCloudError(error);
        console.error("Verified Firestore draft listener failed", error);
        if (mountedRef.current) {
          setCloudState((current) => ({ ...current, state: "error", error: exactError }));
        }
      }
    );

    return () => unsubscribe();
  }, [consumeCloudSnapshot, draftDocId, user?.uid]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const handleInput = (event) => {
      const textarea = getPrimaryTextarea(root);
      if (!textarea || event.target !== textarea || restoringRef.current) return;
      userEditedRef.current = true;
      setCloudState((current) => ({
        ...current,
        state: current.state === "conflict" ? "conflict" : "dirty",
      }));
      scheduleCloudSave();
    };

    const handleClick = (event) => {
      const button = event.target?.closest?.("button");
      if (!button || String(button.textContent || "").trim().toLowerCase() !== "save draft") return;
      const textarea = getPrimaryTextarea(root);
      const form = button.closest("form");
      if (!textarea || !form?.contains(textarea)) return;
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
      window.setTimeout(() => persistCloudDraft("manual-button"), 0);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && userEditedRef.current) {
        persistCloudDraft("visibility-change");
      }
    };

    root.addEventListener("input", handleInput, true);
    root.addEventListener("click", handleClick, true);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      root.removeEventListener("input", handleInput, true);
      root.removeEventListener("click", handleClick, true);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [persistCloudDraft, scheduleCloudSave]);

  const statusPresentation = useMemo(() => {
    if (cloudState.state === "checking") {
      return { background: "#eff6ff", border: "#bfdbfe", color: "#1d4ed8", text: "Checking Firestore for the newest saved draft…" };
    }
    if (cloudState.state === "restored") {
      return { background: "#ecfdf5", border: "#bbf7d0", color: "#166534", text: "Newest cloud draft restored from Firestore." };
    }
    if (cloudState.state === "dirty") {
      return { background: "#fffbeb", border: "#fde68a", color: "#92400e", text: "Changes on this device are waiting to save…" };
    }
    if (cloudState.state === "saving") {
      return { background: "#fffbeb", border: "#fde68a", color: "#92400e", text: "Saving draft to Firestore…" };
    }
    if (cloudState.state === "saved") {
      const savedTime = formatSavedTime(cloudState.savedAt);
      return {
        background: "#ecfdf5",
        border: "#bbf7d0",
        color: "#166534",
        text: `Cloud draft saved and verified in Firestore${savedTime ? ` at ${savedTime}` : ""}.`,
      };
    }
    if (cloudState.state === "conflict") {
      return {
        background: "#fff7ed",
        border: "#fdba74",
        color: "#9a3412",
        text: cloudState.error || "A newer draft exists on another device.",
      };
    }
    if (cloudState.state === "error") {
      return {
        background: "#fef2f2",
        border: "#fecaca",
        color: "#991b1b",
        text: `Cloud draft was not saved: ${cloudState.error}`,
      };
    }
    return {
      background: "#f8fafc",
      border: "#cbd5e1",
      color: "#475569",
      text: "Firestore draft protection is ready. The newest cloud version is used across devices.",
    };
  }, [cloudState.error, cloudState.savedAt, cloudState.state]);

  const loadNewestCloudDraft = () => {
    clearReconcileTimers();
    applyLatestCloudDraft({ force: true, source: "conflict-load-newest" });
  };

  const overwriteCloudWithThisDevice = () => {
    persistCloudDraft("conflict-override", { force: true });
  };

  return (
    <div
      ref={rootRef}
      data-cloud-draft-persistence="verified"
      data-draft-save-state={cloudState.state}
      data-draft-doc-id={draftDocId}
      data-draft-cloud-error={cloudState.error || ""}
      data-draft-loaded={cloudState.restored ? "true" : "false"}
      data-draft-write-count={String(cloudState.writeCount)}
      data-draft-last-saved-at={cloudState.savedAt ? cloudState.savedAt.toISOString() : ""}
      data-draft-conflict={cloudState.conflict ? "true" : "false"}
      data-draft-local-dirty={userEditedRef.current ? "true" : "false"}
      data-draft-remote-updated-at={cloudState.remoteUpdatedAt ? cloudState.remoteUpdatedAt.toISOString() : ""}
      data-draft-remote-source={cloudState.remoteSource || ""}
    >
      <div
        role={cloudState.state === "error" || cloudState.state === "conflict" ? "alert" : "status"}
        style={{
          background: statusPresentation.background,
          border: `1px solid ${statusPresentation.border}`,
          borderRadius: 10,
          color: statusPresentation.color,
          fontSize: 13,
          fontWeight: 800,
          marginBottom: 10,
          padding: 10,
        }}
      >
        <div>{statusPresentation.text}</div>
        {cloudState.state === "conflict" ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            <button type="button" onClick={loadNewestCloudDraft} style={{ padding: "8px 10px" }}>
              Load newest cloud draft
            </button>
            <button type="button" onClick={overwriteCloudWithThisDevice} style={{ padding: "8px 10px" }}>
              Keep this device version
            </button>
          </div>
        ) : null}
      </div>
      <AssignmentSubmissionPage submissionContext={submissionContext} />
    </div>
  );
};

export default VerifiedCloudDraftSubmissionPage;
