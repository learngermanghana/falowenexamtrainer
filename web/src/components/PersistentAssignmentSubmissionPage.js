import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";

const BACKUP_PREFIX = "falowen.assignmentSubmissionDraft";

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

  const backupKey = useMemo(() => {
    const params = new URLSearchParams(location.search || "");
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

    return [BACKUP_PREFIX, owner, level, assignmentKey].map(safePart).join(":");
  }, [location.search, location.state, studentProfile, submissionContext, user?.email, user?.uid]);

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
      <AssignmentSubmissionPage submissionContext={submissionContext} />
    </div>
  );
};

export default PersistentAssignmentSubmissionPage;
