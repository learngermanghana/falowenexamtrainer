import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  A1_WORKBOOK_DRAFT_UPDATED_EVENT,
  buildA1WorkbookDraftStorageKey,
  buildA1WorkbookSubmissionText,
  makeEmptyA1WorkbookDraft,
  readA1WorkbookDraft,
  saveA1WorkbookDraft,
} from "../utils/a1WorkbookDraft";
import { getA1TutorDraftProgress } from "../data/a1TutorDraftProfiles";

const A1TutorWorkbookDraftContext = createContext(null);

export function A1TutorWorkbookDraftProvider({ assignment, children }) {
  const assignmentKey = assignment?.assignmentKey || "";
  const [draft, setDraft] = useState(() => readA1WorkbookDraft(assignmentKey));
  const [saveState, setSaveState] = useState("saved");

  const refreshDraft = useCallback((incomingDraft = null) => {
    const next = incomingDraft?.assignmentKey === assignmentKey
      ? incomingDraft
      : readA1WorkbookDraft(assignmentKey);
    setDraft(next);
    setSaveState("saved");
    return next;
  }, [assignmentKey]);

  useEffect(() => {
    refreshDraft();
  }, [refreshDraft]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const storageKey = buildA1WorkbookDraftStorageKey(assignmentKey);

    const handleDraftUpdated = (event) => {
      const eventAssignmentKey = String(event?.detail?.assignmentKey || "").trim().toUpperCase();
      if (eventAssignmentKey && eventAssignmentKey !== String(assignmentKey).trim().toUpperCase()) return;
      refreshDraft(event?.detail?.draft || null);
    };

    const handleStorage = (event) => {
      if (event.key !== storageKey) return;
      refreshDraft();
    };

    window.addEventListener(A1_WORKBOOK_DRAFT_UPDATED_EVENT, handleDraftUpdated);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(A1_WORKBOOK_DRAFT_UPDATED_EVENT, handleDraftUpdated);
      window.removeEventListener("storage", handleStorage);
    };
  }, [assignmentKey, refreshDraft]);

  const mutateSections = useCallback((updater) => {
    setSaveState("saving");
    setDraft((current) => {
      const nextSections = updater(current?.sections || {});
      const next = saveA1WorkbookDraft({ assignmentKey, sections: nextSections });
      window.setTimeout(() => setSaveState("saved"), 0);
      return next;
    });
  }, [assignmentKey]);

  const updateAnswer = useCallback((sectionKey, number, value) => {
    mutateSections((sections) => ({
      ...sections,
      [sectionKey]: {
        ...(sections[sectionKey] || {}),
        answers: {
          ...(sections[sectionKey]?.answers || {}),
          [number]: value,
        },
      },
    }));
  }, [mutateSections]);

  const updateSectionText = useCallback((sectionKey, text) => {
    mutateSections((sections) => ({
      ...sections,
      [sectionKey]: {
        ...(sections[sectionKey] || {}),
        text,
      },
    }));
  }, [mutateSections]);

  const safeDraft = draft || makeEmptyA1WorkbookDraft(assignmentKey);
  const submissionText = useMemo(
    () => buildA1WorkbookSubmissionText({ assignment, draft: safeDraft }),
    [assignment, safeDraft],
  );
  const progress = useMemo(
    () => getA1TutorDraftProgress({ assignmentKey, draft: safeDraft }),
    [assignmentKey, safeDraft],
  );

  const value = useMemo(() => ({
    assignment,
    assignmentKey,
    draft: safeDraft,
    saveState,
    submissionText,
    progress,
    refreshDraft,
    updateAnswer,
    updateSectionText,
  }), [
    assignment,
    assignmentKey,
    progress,
    safeDraft,
    saveState,
    submissionText,
    refreshDraft,
    updateAnswer,
    updateSectionText,
  ]);

  return (
    <A1TutorWorkbookDraftContext.Provider value={value}>
      {children}
    </A1TutorWorkbookDraftContext.Provider>
  );
}

export const useA1TutorWorkbookDraft = () => useContext(A1TutorWorkbookDraftContext);
