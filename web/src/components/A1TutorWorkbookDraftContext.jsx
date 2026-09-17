import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  buildA1WorkbookSubmissionText,
  makeEmptyA1WorkbookDraft,
  readA1WorkbookDraft,
  saveA1WorkbookDraft,
} from "../utils/a1WorkbookDraft";
import {
  loadA1WorkbookCloudDraft,
  saveA1WorkbookCloudDraft,
} from "../utils/a1WorkbookCloudDraft";
import { getA1TutorDraftProgress } from "../data/a1TutorDraftProfiles";

const A1TutorWorkbookDraftContext = createContext(null);

const toMillis = (value) => {
  if (!value) return 0;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.toDate === "function") return value.toDate().getTime();
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
};

const mergeDraftSections = (base = {}, incoming = {}) => {
  const next = { ...base };
  Object.entries(incoming || {}).forEach(([key, value]) => {
    next[key] = {
      ...(next[key] || {}),
      ...(value || {}),
      answers: {
        ...(next[key]?.answers || {}),
        ...(value?.answers || {}),
      },
    };
  });
  return next;
};

export function A1TutorWorkbookDraftProvider({ assignment, children }) {
  const { user, studentProfile } = useAuth();
  const assignmentKey = assignment?.assignmentKey || "";
  const initialDraftRef = useRef(readA1WorkbookDraft(assignmentKey));
  const [draft, setDraft] = useState(initialDraftRef.current || makeEmptyA1WorkbookDraft(assignmentKey));
  const [hydrated, setHydrated] = useState(false);
  const [saveState, setSaveState] = useState("idle");
  const [cloudMessage, setCloudMessage] = useState("");
  const changeVersionRef = useRef(0);

  useEffect(() => {
    const local = readA1WorkbookDraft(assignmentKey);
    initialDraftRef.current = local;
    setDraft(local);
    setHydrated(false);
    setSaveState("idle");
    setCloudMessage("");
    changeVersionRef.current = 0;

    let active = true;
    const hydrate = async () => {
      if (!user?.uid) {
        if (active) setHydrated(true);
        return;
      }

      const cloud = await loadA1WorkbookCloudDraft({ user, studentProfile, assignment });
      if (!active) return;
      const localMillis = toMillis(local?.updatedAt);
      const cloudMillis = Number(cloud?.updatedAtMillis || 0);
      const cloudSections = cloud?.data?.workbookSections;
      if (cloud?.ok && cloudSections && typeof cloudSections === "object" && cloudMillis >= localMillis) {
        const next = {
          ...makeEmptyA1WorkbookDraft(assignmentKey),
          sections: mergeDraftSections({}, cloudSections),
          updatedAt: new Date(cloudMillis || Date.now()).toISOString(),
        };
        setDraft(next);
        saveA1WorkbookDraft({ assignmentKey, sections: next.sections });
        setCloudMessage("Latest saved assignment draft loaded.");
      }
      setHydrated(true);
    };

    hydrate();
    return () => {
      active = false;
    };
  }, [assignment, assignmentKey, studentProfile, user]);

  const mutateSections = useCallback((updater) => {
    changeVersionRef.current += 1;
    setDraft((current) => {
      const nextSections = updater(current?.sections || {});
      return saveA1WorkbookDraft({ assignmentKey, sections: nextSections });
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

  const submissionText = useMemo(
    () => buildA1WorkbookSubmissionText({ assignment, draft }),
    [assignment, draft],
  );
  const progress = useMemo(
    () => getA1TutorDraftProgress({ assignmentKey, draft }),
    [assignmentKey, draft],
  );

  useEffect(() => {
    if (!hydrated || !user?.uid || changeVersionRef.current === 0) return undefined;
    const versionAtSchedule = changeVersionRef.current;
    setSaveState("saving");
    const timer = window.setTimeout(() => {
      saveA1WorkbookCloudDraft({
        user,
        studentProfile,
        assignment,
        sections: draft.sections,
        submissionText,
        source: "a1-shared-tutor-workbook-autosave",
      }).then((result) => {
        if (changeVersionRef.current !== versionAtSchedule) return;
        setSaveState(result?.ok ? "saved" : "error");
      });
    }, 650);
    return () => window.clearTimeout(timer);
  }, [assignment, draft.sections, hydrated, studentProfile, submissionText, user]);

  const value = useMemo(() => ({
    assignment,
    assignmentKey,
    draft,
    hydrated,
    saveState,
    cloudMessage,
    submissionText,
    progress,
    updateAnswer,
    updateSectionText,
  }), [
    assignment,
    assignmentKey,
    cloudMessage,
    draft,
    hydrated,
    progress,
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

export const __TESTING__ = { mergeDraftSections, toMillis };
