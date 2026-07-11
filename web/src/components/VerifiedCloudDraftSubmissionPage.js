import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  db,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "../firebase";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";

const DRAFT_COLLECTION = "submissionDrafts";
const SUBMISSION_COLLECTION = "submissions";
const LOCK_COLLECTION = "submissionLocks";
const AUTOSAVE_DELAY_MS = 900;
const FINAL_SUBMISSION_VERIFY_DELAY_MS = 1400;
const MIN_FINAL_SUBMISSION_CHARACTERS = 80;

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

const normalizeSubmissionText = (value) =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim();

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

const getSubmissionTextFromData = (data = {}) =>
  String(data.submissionText || data.answer || data.workContent || "").trim();

const getAssignmentKeyFromData = (data = {}) =>
  String(
    data.canonicalAssignmentKey ||
      data.assignmentKey ||
      data.assignmentId ||
      data.assignment_id ||
      ""
  ).trim();

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
  const finalVerifyTimerRef = useRef(null);
  const restoringRef = useRef(false);
  const userEditedRef = useRef(false);
  const existingCreatedAtRef = useRef(null);
  const mountedRef = useRef(true);
  const [cloudState, setCloudState] = useState({
    state: "idle",
    error: "",
    savedAt: null,
    restored: false,
    writeCount: 0,
  });
  const [finalSubmissionState, setFinalSubmissionState] = useState({
    state: "idle",
    error: "",
    submissionId: "",
    path: "",
    fallback: false,
    verifiedAt: null,
  });

  const level = String(submissionContext?.level || "A1").trim().toUpperCase();
  const day = Number(submissionContext?.day || 0);
  const assignmentKey = String(
    submissionContext?.canonicalAssignmentKey || submissionContext?.assignmentKey || ""
  ).trim();
  const chapter = String(submissionContext?.chapter || assignmentKey.replace(/^[A-Z0-9]+-/i, "") || "").trim();
  const studentCode =
    studentProfile?.studentCode || studentProfile?.studentcode || studentProfile?.id || "";
  const studentName =
    studentProfile?.name ||
    studentProfile?.fullName ||
    studentProfile?.displayName ||
    user?.displayName ||
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
  const chapterKey = useMemo(
    () => `chapter-${normalizeIdPart(chapter || assignmentKey || day || "unknown")}`,
    [assignmentKey, chapter, day]
  );
  const draftDocId = useMemo(
    () => `${studentScopeKey}__${normalizeIdPart(level)}__${normalizeIdPart(chapterKey)}`,
    [chapterKey, level, studentScopeKey]
  );
  const fallbackAssignmentTitle = `${level} • Day ${day}${chapter ? ` • Chapter ${chapter}` : ""}`;

  const persistCloudDraft = useCallback(
    async (source = "autosave") => {
      const root = rootRef.current;
      const textarea = getPrimaryTextarea(root);
      const submissionText = String(textarea?.value || "").trim();

      if (!submissionText) return { ok: false, reason: "empty" };
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
        setCloudState((current) => ({ ...current, state: "saving", error: "" }));
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
        cloudPersistenceVersion: 2,
        createdAt: existingCreatedAtRef.current || serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      try {
        await setDoc(draftRef, payload, { merge: true });
        const verifiedSnapshot = await getDoc(draftRef);
        const verifiedData = verifiedSnapshot.exists() ? verifiedSnapshot.data() || {} : null;

        if (!verifiedData || String(verifiedData.submissionText || "").trim() !== submissionText) {
          throw new Error("Firestore write verification did not return the latest draft text.");
        }

        existingCreatedAtRef.current = verifiedData.createdAt || existingCreatedAtRef.current;
        if (mountedRef.current) {
          setCloudState((current) => ({
            ...current,
            state: "saved",
            error: "",
            savedAt: nowLocal,
            writeCount: current.writeCount + 1,
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

  const ensureSubmissionLock = useCallback(
    async ({ assignmentTitle, submissionId, submissionPath }) => {
      const lockRef = doc(db, LOCK_COLLECTION, draftDocId);
      await setDoc(
        lockRef,
        {
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
          submissionId: submissionId || "",
          submissionPath: submissionPath || "",
          lockedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    },
    [
      assignmentKey,
      chapter,
      chapterKey,
      day,
      draftDocId,
      level,
      studentCode,
      studentScopeKey,
      user?.email,
      user?.uid,
    ]
  );

  const findMatchingSubmission = useCallback(
    async ({ assignmentTitle, submissionText }) => {
      const submissionsRef = collection(db, SUBMISSION_COLLECTION);
      const snapshot = await getDocs(query(submissionsRef, where("studentId", "==", user.uid)));
      const normalizedExpectedText = normalizeSubmissionText(submissionText);
      const normalizedExpectedKey = normalizeIdentity(assignmentKey);
      const normalizedExpectedTitle = String(assignmentTitle || "").trim().toLowerCase();

      return (
        snapshot.docs.find((entry) => {
          const data = entry.data() || {};
          const status = String(data.status || "").trim().toLowerCase();
          if (status !== "submitted" && status !== "resubmitted") return false;

          const dataKey = normalizeIdentity(getAssignmentKeyFromData(data));
          const dataTitle = String(data.assignmentTitle || data.title || "").trim().toLowerCase();
          const identityMatches = dataKey
            ? dataKey === normalizedExpectedKey
            : Boolean(normalizedExpectedTitle && dataTitle === normalizedExpectedTitle);

          return (
            identityMatches &&
            normalizeSubmissionText(getSubmissionTextFromData(data)) === normalizedExpectedText
          );
        }) || null
      );
    },
    [assignmentKey, user?.uid]
  );

  const createVerifiedFinalSubmission = useCallback(
    async ({ assignmentTitle, submissionText }) => {
      const submissionRef = doc(collection(db, SUBMISSION_COLLECTION));
      const submissionPath = `${SUBMISSION_COLLECTION}/${submissionRef.id}`;
      const now = serverTimestamp();
      const normalizedFingerprintText = normalizeSubmissionText(submissionText).toLowerCase();
      const submissionFingerprint = `${normalizeIdPart(assignmentTitle)}::${normalizeIdPart(
        chapterKey
      )}::${normalizeIdPart(normalizedFingerprintText).slice(0, 240)}`;
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
        source: "a1_verified_submission_guard",
        createdAt: now,
        updatedAt: now,
        submittedAt: now,
      };

      await setDoc(submissionRef, payload);
      const verifiedSnapshot = await getDoc(submissionRef);
      const verifiedData = verifiedSnapshot.exists() ? verifiedSnapshot.data() || {} : null;
      const verifiedText = getSubmissionTextFromData(verifiedData || {});

      if (
        !verifiedData ||
        verifiedText !== submissionText ||
        String(verifiedData.status || "").toLowerCase() !== "submitted" ||
        verifiedData.studentId !== user.uid
      ) {
        throw new Error(`Final submission verification failed at /${submissionPath}.`);
      }

      await ensureSubmissionLock({
        assignmentTitle,
        submissionId: submissionRef.id,
        submissionPath,
      });

      return { submissionId: submissionRef.id, submissionPath };
    },
    [
      assignmentKey,
      chapter,
      chapterKey,
      day,
      ensureSubmissionLock,
      level,
      studentCode,
      studentName,
      studentProfile?.className,
      studentScopeKey,
      user?.email,
      user?.uid,
    ]
  );

  const ensureFinalSubmission = useCallback(
    async ({ assignmentTitle, submissionText }) => {
      if (!db || !user?.uid || !assignmentKey || !submissionText) return;

      if (mountedRef.current) {
        setFinalSubmissionState({
          state: "checking",
          error: "",
          submissionId: "",
          path: "",
          fallback: false,
          verifiedAt: null,
        });
      }

      try {
        const lockRef = doc(db, LOCK_COLLECTION, draftDocId);
        const lockSnapshot = await getDoc(lockRef);
        let matchingSubmission = null;

        try {
          matchingSubmission = await findMatchingSubmission({ assignmentTitle, submissionText });
        } catch (queryError) {
          console.warn("Could not query existing final submissions before verification", queryError);
        }

        if (matchingSubmission) {
          const verifiedSnapshot = await getDoc(matchingSubmission.ref);
          if (!verifiedSnapshot.exists()) {
            throw new Error("The final submission query returned a document that could not be read back.");
          }

          const submissionPath = `${SUBMISSION_COLLECTION}/${matchingSubmission.id}`;
          await ensureSubmissionLock({
            assignmentTitle,
            submissionId: matchingSubmission.id,
            submissionPath,
          });

          if (mountedRef.current) {
            setFinalSubmissionState({
              state: "verified",
              error: "",
              submissionId: matchingSubmission.id,
              path: submissionPath,
              fallback: false,
              verifiedAt: new Date(),
            });
          }
          return;
        }

        if (lockSnapshot.exists()) {
          if (mountedRef.current) {
            setFinalSubmissionState({
              state: "verified",
              error: "",
              submissionId: String(lockSnapshot.data()?.submissionId || ""),
              path: String(lockSnapshot.data()?.submissionPath || `${SUBMISSION_COLLECTION}/verified-before-lock`),
              fallback: false,
              verifiedAt: new Date(),
            });
          }
          return;
        }

        if (mountedRef.current) {
          setFinalSubmissionState((current) => ({ ...current, state: "recovering" }));
        }

        const recovered = await createVerifiedFinalSubmission({ assignmentTitle, submissionText });
        if (mountedRef.current) {
          setFinalSubmissionState({
            state: "verified",
            error: "",
            submissionId: recovered.submissionId,
            path: recovered.submissionPath,
            fallback: true,
            verifiedAt: new Date(),
          });
        }
      } catch (error) {
        const exactError = formatCloudError(error);
        console.error("Final Firestore submission verification failed", error);
        if (mountedRef.current) {
          setFinalSubmissionState({
            state: "error",
            error: exactError,
            submissionId: "",
            path: "",
            fallback: false,
            verifiedAt: null,
          });
        }
      }
    },
    [
      assignmentKey,
      createVerifiedFinalSubmission,
      draftDocId,
      ensureSubmissionLock,
      findMatchingSubmission,
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
      if (finalVerifyTimerRef.current) window.clearTimeout(finalVerifyTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!db || !user?.uid || !draftDocId) return undefined;

    let cancelled = false;
    let observer = null;
    let restoreAttempts = 0;

    const applyDraftToEditor = (submissionText) => {
      const textarea = getPrimaryTextarea(rootRef.current);
      if (!textarea) return false;
      if (userEditedRef.current || String(textarea.value || "").trim()) return true;

      restoringRef.current = true;
      setControlledTextareaValue(textarea, submissionText);
      restoringRef.current = false;
      if (!cancelled) {
        setCloudState((current) => ({ ...current, state: "restored", error: "", restored: true }));
      }
      return true;
    };

    const loadCloudDraft = async () => {
      try {
        setCloudState((current) => ({ ...current, state: "checking", error: "" }));
        const snapshot = await getDoc(doc(db, DRAFT_COLLECTION, draftDocId));
        if (cancelled) return;

        if (!snapshot.exists()) {
          setCloudState((current) => ({ ...current, state: "idle", error: "" }));
          return;
        }

        const data = snapshot.data() || {};
        existingCreatedAtRef.current = data.createdAt || null;
        const submissionText = String(data.submissionText || data.answer || data.workContent || "");
        if (!submissionText.trim()) {
          setCloudState((current) => ({ ...current, state: "idle", error: "" }));
          return;
        }

        if (applyDraftToEditor(submissionText)) return;

        observer = new MutationObserver(() => {
          restoreAttempts += 1;
          if (applyDraftToEditor(submissionText) || restoreAttempts > 80) {
            observer?.disconnect();
          }
        });
        observer.observe(rootRef.current, { childList: true, subtree: true });
      } catch (error) {
        const exactError = formatCloudError(error);
        console.error("Verified Firestore draft restore failed", error);
        if (!cancelled) {
          setCloudState((current) => ({ ...current, state: "error", error: exactError }));
        }
      }
    };

    loadCloudDraft();

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [draftDocId, user?.uid]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const handleInput = (event) => {
      const textarea = getPrimaryTextarea(root);
      if (!textarea || event.target !== textarea || restoringRef.current) return;
      userEditedRef.current = true;
      scheduleCloudSave();
    };

    const handleClick = (event) => {
      const button = event.target?.closest?.("button");
      if (!button || String(button.textContent || "").trim().toLowerCase() !== "save draft") return;
      const textarea = getPrimaryTextarea(root);
      const form = button.closest("form");
      if (!textarea || !form?.contains(textarea)) return;
      window.setTimeout(() => persistCloudDraft("manual-button"), 0);
    };

    const handleSubmitCapture = (event) => {
      const form = event.target?.closest?.("form") || event.target;
      const submitter = event.submitter || form?.querySelector?.('button[type="submit"]');
      const submitterText = String(submitter?.textContent || "").trim().toLowerCase();
      if (!form || !submitterText.includes("submit assignment")) return;

      const textarea = getPrimaryTextarea(root);
      const checkbox = Array.from(form.querySelectorAll('input[type="checkbox"]')).find(
        (input) => !input.disabled || input.checked
      );
      const submissionText = String(textarea?.value || "").trim();
      const assignmentTitle = getAssignmentTitle(root, fallbackAssignmentTitle);
      const maxLength = Number(textarea?.maxLength || 0);

      if (
        !textarea ||
        !form.contains(textarea) ||
        textarea.disabled ||
        textarea.readOnly ||
        !checkbox?.checked ||
        !assignmentTitle ||
        !assignmentKey ||
        day === 0 ||
        submissionText.length < MIN_FINAL_SUBMISSION_CHARACTERS ||
        (maxLength > 0 && submissionText.length > maxLength)
      ) {
        return;
      }

      if (finalVerifyTimerRef.current) window.clearTimeout(finalVerifyTimerRef.current);
      finalVerifyTimerRef.current = window.setTimeout(() => {
        ensureFinalSubmission({ assignmentTitle, submissionText });
      }, FINAL_SUBMISSION_VERIFY_DELAY_MS);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") persistCloudDraft("visibility-change");
    };

    root.addEventListener("input", handleInput, true);
    root.addEventListener("click", handleClick, true);
    root.addEventListener("submit", handleSubmitCapture, true);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      root.removeEventListener("input", handleInput, true);
      root.removeEventListener("click", handleClick, true);
      root.removeEventListener("submit", handleSubmitCapture, true);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [
    assignmentKey,
    day,
    ensureFinalSubmission,
    fallbackAssignmentTitle,
    persistCloudDraft,
    scheduleCloudSave,
  ]);

  const statusPresentation = useMemo(() => {
    if (cloudState.state === "checking") {
      return { background: "#eff6ff", border: "#bfdbfe", color: "#1d4ed8", text: "Checking Firestore for a saved draft…" };
    }
    if (cloudState.state === "restored") {
      return { background: "#ecfdf5", border: "#bbf7d0", color: "#166534", text: "Cloud draft restored from Firestore." };
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
      text: "Firestore draft protection is ready. Your work is saved after you stop typing.",
    };
  }, [cloudState.error, cloudState.savedAt, cloudState.state]);

  const finalSubmissionPresentation = useMemo(() => {
    if (finalSubmissionState.state === "checking") {
      return {
        background: "#eff6ff",
        border: "#bfdbfe",
        color: "#1d4ed8",
        text: "Checking that the final submission exists in Firestore…",
      };
    }
    if (finalSubmissionState.state === "recovering") {
      return {
        background: "#fffbeb",
        border: "#fde68a",
        color: "#92400e",
        text: "The normal submission write was missing. Recovering it now…",
      };
    }
    if (finalSubmissionState.state === "verified") {
      return {
        background: "#ecfdf5",
        border: "#bbf7d0",
        color: "#166534",
        text: `Final submission saved and verified in Firestore at /${finalSubmissionState.path}${
          finalSubmissionState.fallback ? ". The missing write was recovered safely." : "."
        }`,
      };
    }
    if (finalSubmissionState.state === "error") {
      return {
        background: "#fef2f2",
        border: "#fecaca",
        color: "#991b1b",
        text: `Final submission could not be verified: ${finalSubmissionState.error}`,
      };
    }
    return null;
  }, [finalSubmissionState]);

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
      data-final-submission-state={finalSubmissionState.state}
      data-final-submission-id={finalSubmissionState.submissionId || ""}
      data-final-submission-path={finalSubmissionState.path || ""}
      data-final-submission-error={finalSubmissionState.error || ""}
      data-final-submission-fallback={finalSubmissionState.fallback ? "true" : "false"}
      data-final-submission-verified-at={
        finalSubmissionState.verifiedAt ? finalSubmissionState.verifiedAt.toISOString() : ""
      }
    >
      <div
        role={cloudState.state === "error" ? "alert" : "status"}
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
        {statusPresentation.text}
      </div>
      {finalSubmissionPresentation ? (
        <div
          role={finalSubmissionState.state === "error" ? "alert" : "status"}
          style={{
            background: finalSubmissionPresentation.background,
            border: `1px solid ${finalSubmissionPresentation.border}`,
            borderRadius: 10,
            color: finalSubmissionPresentation.color,
            fontSize: 13,
            fontWeight: 800,
            marginBottom: 10,
            padding: 10,
          }}
        >
          {finalSubmissionPresentation.text}
        </div>
      ) : null}
      <AssignmentSubmissionPage submissionContext={submissionContext} />
    </div>
  );
};

export default VerifiedCloudDraftSubmissionPage;
