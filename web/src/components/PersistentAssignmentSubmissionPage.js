import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db, doc, getDoc, serverTimestamp, setDoc } from "../firebase";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";

const BACKUP_PREFIX = "falowen.assignmentSubmissionDraft";
const DRAFT_COLLECTION = "submissionDrafts";

const safePart = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "_")
    .slice(0, 120) || "unknown";

const getTextareaKey = (textarea, index) =>
  textarea.getAttribute("aria-label") ||
  textarea.getAttribute("name") ||
  textarea.id ||
  `textarea-${index}`;

const readBackup = (backupKey) => {
  if (typeof window === "undefined" || !backupKey) return null;
  try {
    return JSON.parse(window.localStorage.getItem(backupKey) || "null");
  } catch (_error) {
    return null;
  }
};

const writeBackup = (backupKey, payload) => {
  if (typeof window === "undefined" || !backupKey) return false;
  try {
    window.localStorage.setItem(backupKey, JSON.stringify(payload));
    return true;
  } catch (_error) {
    return false;
  }
};

const getEditableTextarea = (target) => {
  if (typeof window === "undefined" || !(target instanceof window.HTMLTextAreaElement)) return null;
  if (target.disabled || target.readOnly) return null;
  return target;
};

const setTextareaValue = (textarea, value, { emit = true } = {}) => {
  const element = textarea;
  const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
  if (nativeSetter) nativeSetter.call(element, value);
  else element.value = value;

  if (emit) {
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }
};

const getTextareaSelection = (textarea) => {
  const valueLength = String(textarea.value || "").length;
  const start = typeof textarea.selectionStart === "number" ? textarea.selectionStart : valueLength;
  const end = typeof textarea.selectionEnd === "number" ? textarea.selectionEnd : start;
  return { start, end };
};

const buildBeforeInputFallback = (textarea, event) => {
  const currentValue = String(textarea.value || "");
  const { start, end } = getTextareaSelection(textarea);
  const replaceSelection = (insertedText) => {
    const nextValue = `${currentValue.slice(0, start)}${insertedText}${currentValue.slice(end)}`;
    return { value: nextValue, cursor: start + insertedText.length };
  };

  switch (event.inputType) {
    case "insertText":
    case "insertReplacementText":
    case "insertFromPaste":
    case "insertFromDrop":
      return typeof event.data === "string" ? replaceSelection(event.data) : null;
    case "insertLineBreak":
    case "insertParagraph":
      return replaceSelection("\n");
    case "deleteByCut":
      return start !== end ? replaceSelection("") : null;
    case "deleteContentBackward":
      if (start !== end) return replaceSelection("");
      if (start <= 0) return { value: currentValue, cursor: 0 };
      return {
        value: `${currentValue.slice(0, start - 1)}${currentValue.slice(end)}`,
        cursor: start - 1,
      };
    case "deleteContentForward":
      if (start !== end) return replaceSelection("");
      if (end >= currentValue.length) return { value: currentValue, cursor: end };
      return {
        value: `${currentValue.slice(0, start)}${currentValue.slice(end + 1)}`,
        cursor: start,
      };
    default:
      return null;
  }
};

const collectTextareaDrafts = (root) => {
  if (!root) return [];
  return Array.from(root.querySelectorAll("textarea")).map((textarea, index) => ({
    key: getTextareaKey(textarea, index),
    value: textarea.value || "",
  }));
};

const PersistentAssignmentSubmissionPage = ({ submissionContext = null } = {}) => {
  const location = useLocation();
  const { user, studentProfile } = useAuth();
  const rootRef = useRef(null);
  const lastSerializedRef = useRef("");
  const [backupState, setBackupState] = useState({ restored: false, savedAt: null });
  const [firestoreTestState, setFirestoreTestState] = useState({ status: "idle", message: "" });

  const params = useMemo(() => new URLSearchParams(location.search || ""), [location.search]);
  const showFirestoreDiagnostic =
    params.get("draftDebug") === "1" ||
    params.get("testDraft") === "1" ||
    params.get("firestoreTest") === "1";

  const identity = useMemo(() => {
    const level = submissionContext?.level || params.get("level") || studentProfile?.level || "general";
    const assignmentKey =
      submissionContext?.canonicalAssignmentKey ||
      submissionContext?.assignmentKey ||
      params.get("assignmentKey") ||
      params.get("assignmentId") ||
      location.state?.canonicalAssignmentKey ||
      location.state?.assignmentKey ||
      location.state?.assignmentId ||
      "general";
    const owner =
      studentProfile?.studentCode ||
      studentProfile?.studentcode ||
      studentProfile?.id ||
      user?.uid ||
      user?.email ||
      "anonymous";

    return { level, assignmentKey, owner };
  }, [location.state, params, studentProfile, submissionContext, user?.email, user?.uid]);

  const backupKey = useMemo(
    () => [BACKUP_PREFIX, identity.owner, identity.level, identity.assignmentKey].map(safePart).join(":"),
    [identity]
  );

  const runFirestoreDraftTest = useCallback(async () => {
    if (!db) {
      setFirestoreTestState({ status: "fail", message: "Firestore db is not initialized in this browser session." });
      return;
    }
    if (!user?.uid) {
      setFirestoreTestState({ status: "fail", message: "No logged-in Firebase user found. request.auth would be null." });
      return;
    }

    const nonce = `draft-test-${Date.now()}`;
    const testDocId = ["diagnostic", user.uid, identity.level, identity.assignmentKey].map(safePart).join("__");
    const testRef = doc(db, DRAFT_COLLECTION, testDocId);
    const testPayload = {
      diagnostic: true,
      assignmentTitle: "Firestore Draft Diagnostic",
      assignmentKey: identity.assignmentKey,
      canonicalAssignmentKey: identity.assignmentKey,
      level: identity.level,
      studentId: user.uid,
      userId: user.uid,
      uid: user.uid,
      ownerUid: user.uid,
      studentCode: studentProfile?.studentCode || studentProfile?.studentcode || "",
      studentEmail: user.email || "",
      submissionText: `Firestore draft diagnostic text: ${nonce}`,
      nonce,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    };

    setFirestoreTestState({ status: "running", message: "Writing test draft to Firestore..." });

    try {
      await setDoc(testRef, testPayload, { merge: true });
      const snapshot = await getDoc(testRef);
      const saved = snapshot.exists() ? snapshot.data() : null;

      if (saved?.nonce === nonce) {
        setFirestoreTestState({
          status: "pass",
          message: `PASS: Firestore saved and read back the test draft in ${DRAFT_COLLECTION}/${testDocId}.`,
        });
      } else {
        setFirestoreTestState({
          status: "fail",
          message: "Write finished, but the read-back document did not contain the latest test nonce.",
        });
      }
    } catch (error) {
      setFirestoreTestState({
        status: "fail",
        message: `FAIL: ${error?.code || error?.name || "Firestore error"} — ${error?.message || String(error)}`,
      });
    }
  }, [identity.assignmentKey, identity.level, studentProfile?.studentCode, studentProfile?.studentcode, user?.email, user?.uid]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const liveSnapshots = new WeakMap();
    const composingTextareas = new WeakSet();
    const frameIds = new Set();
    const timeoutIds = new Set();

    const restoreSelection = (textarea, selection) => {
      try {
        textarea.setSelectionRange(selection.start, selection.end);
      } catch (_error) {
        // Some iOS WebKit states temporarily reject selection updates.
      }
    };

    const scheduleRepair = (textarea, snapshot) => {
      const repair = () => {
        if (!root.contains(textarea) || liveSnapshots.get(textarea) !== snapshot) return;
        if (document.activeElement !== textarea && !snapshot.composing) return;
        if (textarea.value === snapshot.value) return;

        setTextareaValue(textarea, snapshot.value);
        restoreSelection(textarea, snapshot.selection);
      };

      const frameId = window.requestAnimationFrame(() => {
        frameIds.delete(frameId);
        repair();
      });
      frameIds.add(frameId);

      const timeoutId = window.setTimeout(() => {
        timeoutIds.delete(timeoutId);
        repair();
      }, 80);
      timeoutIds.add(timeoutId);
    };

    const rememberTextareaValue = (textarea) => {
      const selection = getTextareaSelection(textarea);
      const snapshot = {
        value: String(textarea.value || ""),
        selection,
        composing: composingTextareas.has(textarea),
      };
      liveSnapshots.set(textarea, snapshot);
      scheduleRepair(textarea, snapshot);
    };

    const preserveInputValue = (event) => {
      const textarea = getEditableTextarea(event.target);
      if (!textarea) return;
      rememberTextareaValue(textarea);
    };

    const preserveBeforeInput = (event) => {
      const textarea = getEditableTextarea(event.target);
      if (!textarea) return;

      const originalValue = String(textarea.value || "");
      const fallback = buildBeforeInputFallback(textarea, event);
      if (!fallback) return;

      const frameId = window.requestAnimationFrame(() => {
        frameIds.delete(frameId);
        if (!root.contains(textarea) || textarea.disabled || textarea.readOnly) return;

        if (textarea.value !== originalValue) {
          rememberTextareaValue(textarea);
          return;
        }

        setTextareaValue(textarea, fallback.value);
        restoreSelection(textarea, { start: fallback.cursor, end: fallback.cursor });
        rememberTextareaValue(textarea);
      });
      frameIds.add(frameId);
    };

    const handleCompositionStart = (event) => {
      const textarea = getEditableTextarea(event.target);
      if (!textarea) return;
      composingTextareas.add(textarea);
      rememberTextareaValue(textarea);
    };

    const handleCompositionEnd = (event) => {
      const textarea = getEditableTextarea(event.target);
      if (!textarea) return;
      composingTextareas.delete(textarea);
      rememberTextareaValue(textarea);
    };

    root.addEventListener("beforeinput", preserveBeforeInput, true);
    root.addEventListener("input", preserveInputValue, true);
    root.addEventListener("change", preserveInputValue, true);
    root.addEventListener("compositionstart", handleCompositionStart, true);
    root.addEventListener("compositionend", handleCompositionEnd, true);
    root.addEventListener("focusin", preserveInputValue, true);

    return () => {
      root.removeEventListener("beforeinput", preserveBeforeInput, true);
      root.removeEventListener("input", preserveInputValue, true);
      root.removeEventListener("change", preserveInputValue, true);
      root.removeEventListener("compositionstart", handleCompositionStart, true);
      root.removeEventListener("compositionend", handleCompositionEnd, true);
      root.removeEventListener("focusin", preserveInputValue, true);
      frameIds.forEach((frameId) => window.cancelAnimationFrame(frameId));
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, [backupKey]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !backupKey) return undefined;

    const persistLocalBackup = () => {
      const fields = collectTextareaDrafts(root);
      const hasText = fields.some((field) => String(field.value || "").trim());
      if (!hasText) return;

      const payload = {
        fields,
        assignmentKey: identity.assignmentKey,
        level: identity.level,
        updatedAt: new Date().toISOString(),
      };
      const serialized = JSON.stringify(payload);
      if (serialized === lastSerializedRef.current) return;
      lastSerializedRef.current = serialized;
      if (writeBackup(backupKey, payload)) {
        setBackupState((current) => ({ ...current, savedAt: payload.updatedAt }));
      }
    };

    const restoreLocalBackup = () => {
      const backup = readBackup(backupKey);
      const savedFields = Array.isArray(backup?.fields) ? backup.fields : [];
      if (!savedFields.length) return false;

      const textareas = Array.from(root.querySelectorAll("textarea"));
      if (!textareas.length) return false;

      let restored = false;
      textareas.forEach((textarea, index) => {
        if (String(textarea.value || "").trim()) return;
        const key = getTextareaKey(textarea, index);
        const saved =
          savedFields.find((field) => field.key === key) ||
          savedFields[index] ||
          null;
        if (!saved?.value) return;
        setTextareaValue(textarea, saved.value);
        restored = true;
      });

      if (restored) {
        setBackupState({ restored: true, savedAt: backup.updatedAt || null });
      }
      return restored;
    };

    let attempts = 0;
    const restoreTimer = window.setInterval(() => {
      attempts += 1;
      if (restoreLocalBackup() || attempts >= 12) {
        window.clearInterval(restoreTimer);
      }
    }, 250);

    const saveTimer = window.setInterval(persistLocalBackup, 1200);
    root.addEventListener("input", persistLocalBackup, true);
    root.addEventListener("change", persistLocalBackup, true);
    window.addEventListener("beforeunload", persistLocalBackup);

    return () => {
      window.clearInterval(restoreTimer);
      window.clearInterval(saveTimer);
      root.removeEventListener("input", persistLocalBackup, true);
      root.removeEventListener("change", persistLocalBackup, true);
      window.removeEventListener("beforeunload", persistLocalBackup);
      persistLocalBackup();
    };
  }, [backupKey, identity.assignmentKey, identity.level]);

  return (
    <div ref={rootRef} data-persistent-assignment-submission>
      <style>{`
        [data-persistent-assignment-submission] textarea {
          pointer-events: auto !important;
          -webkit-user-select: text !important;
          user-select: text !important;
          -webkit-touch-callout: default !important;
          touch-action: auto !important;
          font-size: 16px !important;
          line-height: 1.7 !important;
          position: relative !important;
          z-index: 1 !important;
          caret-color: #111827 !important;
          cursor: text !important;
        }
        [data-persistent-assignment-submission] textarea:not([disabled]):not([readonly]) {
          background: #ffffff !important;
          color: #111827 !important;
          -webkit-text-fill-color: #111827 !important;
        }
      `}</style>
      <div
        style={{
          border: "1px solid #bbf7d0",
          borderRadius: 12,
          padding: 10,
          marginBottom: 10,
          background: "#f0fdf4",
          color: "#166534",
          fontSize: 13,
          fontWeight: 800,
        }}
      >
        Device backup is active. Your typed draft is also saved in this browser while Firestore syncs.
        {backupState.restored ? " Last local draft was restored." : ""}
      </div>

      {showFirestoreDiagnostic ? (
        <div
          style={{
            border: "1px solid #fde68a",
            borderRadius: 12,
            padding: 10,
            marginBottom: 10,
            background: "#fffbeb",
            color: "#92400e",
            display: "grid",
            gap: 8,
            fontSize: 13,
          }}
        >
          <strong>Firestore draft diagnostic</strong>
          <span>
            Click this to write a test draft to Firestore and read it back immediately. This appears only with
            <code> draftDebug=1</code>, <code>testDraft=1</code>, or <code>firestoreTest=1</code> in the URL.
          </span>
          <button
            type="button"
            onClick={runFirestoreDraftTest}
            disabled={firestoreTestState.status === "running"}
            style={{ width: "fit-content", padding: "8px 12px", borderRadius: 10, border: "1px solid #f59e0b", fontWeight: 800 }}
          >
            {firestoreTestState.status === "running" ? "Testing Firestore..." : "Test Firestore draft save"}
          </button>
          {firestoreTestState.message ? (
            <span
              style={{
                color: firestoreTestState.status === "pass" ? "#166534" : firestoreTestState.status === "fail" ? "#991b1b" : "#92400e",
                fontWeight: 800,
              }}
            >
              {firestoreTestState.message}
            </span>
          ) : null}
        </div>
      ) : null}

      <AssignmentSubmissionPage submissionContext={submissionContext} />
    </div>
  );
};

export default PersistentAssignmentSubmissionPage;
