import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
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

  useEffect(() => {
    setDraft(readA1WorkbookDraft(assignmentKey));
    setSaveState("saved");
  }, [assignmentKey]);

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
    updateAnswer,
    updateSectionText,
  }), [
    assignment,
    assignmentKey,
    progress,
    safeDraft,
    saveState,
    submissionText,
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
