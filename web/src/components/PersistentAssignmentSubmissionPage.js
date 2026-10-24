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

const setTextareaValue = (textarea, value) => {
  const element = textarea;
  const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
  if (nativeSetter) nativeSetter.call(element, value);
  else element.value = value;
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
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
    if (!root || !backupKey) return undefined;

    const persistLocalBackup = () => {
      const fields = collectTextareaDrafts(root);
      const hasText = fields.some((field) => String(field.value || "").trim());
      if (!hasText) return;

      const payload = {
        fields,
        assignmentKey:
          submissionContext?.canonicalAssignmentKey ||
          submissionContext?.assignmentKey ||
          "",
        level: submissionContext?.level || "",
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
  }, [backupKey, submissionContext]);

  return (
    <div ref={rootRef} data-persistent-assignment-submission>
      <style>{`
        [data-persistent-assignment-submission] textarea {
          pointer-events: auto !important;
          -webkit-user-select: text !important;
          user-select: text !important;
          -webkit-touch-callout: default !important;
          touch-action: manipulation !important;
          font-size: 16px !important;
          line-height: 1.7 !important;
          position: relative !important;
          z-index: 1 !important;
          caret-color: #111827 !important;
        }
        [data-persistent-assignment-submission] textarea:not([disabled]):not([readonly]) {
          background: #ffffff !important;
          color: #111827 !important;
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
