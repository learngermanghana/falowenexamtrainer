import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getA2B1WorkbookSectionProfile } from "./a2B1WorkbookSectionProfile";
import {
  WORKBOOK_SUBMISSION_DRAFT_EVENT,
  buildWorkbookDraftStorageKey,
  buildWorkbookStudentScope,
  ensureWorkbookObjectiveSection,
  getWorkbookSubmissionReview,
  readWorkbookSubmissionDraft,
  saveWorkbookObjectiveAnswer,
  saveWorkbookSubmissionOverride,
  saveWorkbookWritingDraft,
  serializeWorkbookSubmissionDraft,
} from "../utils/workbookSubmissionDraft";

const OBJECTIVE_OPTION_RE = /^\s*([A-H])\s*[.)\-:]\s*/i;
const QUESTION_NUMBER_RE = /^\s*(\d+)\s*[.)\-:]/;

const panelStyle = {
  border: "1px solid #bfdbfe",
  borderRadius: 14,
  padding: 12,
  background: "#f8fafc",
  display: "grid",
  gap: 8,
  lineHeight: 1.55,
};

const adoptDraft = (setter, nextDraft) => {
  if (!nextDraft) return;
  setter((previous) => {
    try {
      return JSON.stringify(previous) === JSON.stringify(nextDraft) ? previous : nextDraft;
    } catch (_error) {
      return nextDraft;
    }
  });
};

const setNativeTextareaValue = (textarea, value) => {
  const descriptor = Object.getOwnPropertyDescriptor(
    typeof HTMLTextAreaElement !== "undefined" ? HTMLTextAreaElement.prototype : {},
    "value",
  );
  if (descriptor?.set) descriptor.set.call(textarea, value);
  else textarea.value = value;
};

const dispatchTextareaInput = (textarea) => {
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
  textarea.dispatchEvent(new Event("change", { bubbles: true }));
};

const findActiveSectionRoot = (root, activeTab) => {
  const teilNumber = activeTab === "lesen" ? 3 : activeTab === "hoeren" ? 4 : null;
  if (!teilNumber) return null;
  const heading = Array.from(root.querySelectorAll("h2")).find((candidate) =>
    new RegExp(`^\\s*Teil\\s*${teilNumber}\\b`, "i").test(String(candidate.textContent || "").trim()),
  );
  if (!heading) return null;
  return heading.closest("section") || heading.parentElement;
};

const collectObjectiveGroups = (sectionRoot) => {
  if (!sectionRoot) return [];
  const optionNodes = Array.from(sectionRoot.querySelectorAll("span")).filter((node) =>
    OBJECTIVE_OPTION_RE.test(String(node.textContent || "")),
  );
  const grouped = [];
  const byParent = new Map();

  optionNodes.forEach((optionNode) => {
    const parent = optionNode.parentElement;
    if (!parent || !parent.querySelector("strong")) return;
    if (!byParent.has(parent)) {
      const group = { parent, options: [] };
      byParent.set(parent, group);
      grouped.push(group);
    }
    byParent.get(parent).options.push(optionNode);
  });

  return grouped
    .filter((group) => group.options.length >= 2)
    .map((group, index) => {
      const stem = String(group.parent.querySelector("strong")?.textContent || "").trim();
      const explicitNumber = stem.match(QUESTION_NUMBER_RE)?.[1];
      return {
        ...group,
        questionNumber: explicitNumber ? Number(explicitNumber) : index + 1,
      };
    });
};

const applyOptionPresentation = (optionNode, selected) => {
  optionNode.setAttribute("role", "radio");
  optionNode.setAttribute("tabindex", "0");
  optionNode.setAttribute("aria-checked", selected ? "true" : "false");
  optionNode.setAttribute("data-falowen-clickable-answer", "true");
  Object.assign(optionNode.style, {
    display: "block",
    border: selected ? "2px solid #2563eb" : "1px solid #cbd5e1",
    borderRadius: "10px",
    padding: "10px 12px",
    background: selected ? "#eff6ff" : "#ffffff",
    color: selected ? "#1e3a8a" : "#0f172a",
    fontWeight: selected ? "800" : "600",
    cursor: "pointer",
    outlineOffset: "2px",
  });
};

const formatSavedTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function WorkbookSubmissionCaptureRuntime({ context = null, activeTab = "" }) {
  const { user, studentProfile } = useAuth();
  const level = String(context?.level || "").toUpperCase();
  const day = Number(context?.day || 0);
  const studentScope = useMemo(
    () => buildWorkbookStudentScope({ user, studentProfile }),
    [studentProfile, user],
  );
  const draftContext = useMemo(
    () => ({ studentScope, level, day }),
    [day, level, studentScope],
  );
  const storageKey = useMemo(
    () => buildWorkbookDraftStorageKey(draftContext),
    [draftContext],
  );
  const sectionProfile = useMemo(
    () => getA2B1WorkbookSectionProfile(level, day),
    [day, level],
  );
  const [draft, setDraft] = useState(() => readWorkbookSubmissionDraft(draftContext));
  const latestDraftRef = useRef(draft);

  useEffect(() => {
    const nextDraft = readWorkbookSubmissionDraft(draftContext);
    latestDraftRef.current = nextDraft;
    adoptDraft(setDraft, nextDraft);
  }, [draftContext]);

  useEffect(() => {
    latestDraftRef.current = draft;
  }, [draft]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const onDraftChanged = (event) => {
      if (event?.detail?.storageKey !== storageKey) return;
      const nextDraft = event.detail.draft;
      latestDraftRef.current = nextDraft;
      adoptDraft(setDraft, nextDraft);
    };
    window.addEventListener(WORKBOOK_SUBMISSION_DRAFT_EVENT, onDraftChanged);
    return () => window.removeEventListener(WORKBOOK_SUBMISSION_DRAFT_EVENT, onDraftChanged);
  }, [storageKey]);

  useEffect(() => {
    if (typeof document === "undefined" || !["lesen", "hoeren"].includes(activeTab)) return undefined;
    const root = document.getElementById("root") || document.body;
    const sectionKey = activeTab === "lesen" ? "teil3" : "teil4";
    const includeInSubmission =
      sectionKey === "teil3" || sectionProfile?.part4Submission === "submit";
    let cleanups = [];
    let observer = null;

    const bindOptions = () => {
      cleanups.forEach((cleanup) => cleanup());
      cleanups = [];

      const sectionRoot = findActiveSectionRoot(root, activeTab);
      const groups = collectObjectiveGroups(sectionRoot);
      if (!groups.length) return;
      const questionNumbers = groups.map((group) => group.questionNumber);
      const metadataDraft = ensureWorkbookObjectiveSection(draftContext, {
        section: sectionKey,
        questionNumbers,
        includeInSubmission,
      });
      latestDraftRef.current = metadataDraft;
      adoptDraft(setDraft, metadataDraft);

      groups.forEach((group) => {
        group.options.forEach((optionNode) => {
          const optionMatch = String(optionNode.textContent || "").match(OBJECTIVE_OPTION_RE);
          const answer = String(optionMatch?.[1] || "").toUpperCase();
          if (!answer) return;
          const originalStyle = optionNode.getAttribute("style");
          const originalRole = optionNode.getAttribute("role");
          const originalTabIndex = optionNode.getAttribute("tabindex");
          const originalAriaChecked = optionNode.getAttribute("aria-checked");

          const repaint = () => {
            const currentDraft = latestDraftRef.current || readWorkbookSubmissionDraft(draftContext);
            const selected =
              String(currentDraft.sections?.[sectionKey]?.answers?.[group.questionNumber] || "").toUpperCase() === answer;
            applyOptionPresentation(optionNode, selected);
          };

          const chooseAnswer = () => {
            const nextDraft = saveWorkbookObjectiveAnswer(draftContext, {
              section: sectionKey,
              questionNumber: group.questionNumber,
              answer,
              questionNumbers,
              includeInSubmission,
            });
            latestDraftRef.current = nextDraft;
            adoptDraft(setDraft, nextDraft);
            groups.forEach((otherGroup) => {
              if (otherGroup.questionNumber !== group.questionNumber) return;
              otherGroup.options.forEach((otherOption) => {
                const otherAnswer = String(otherOption.textContent || "").match(OBJECTIVE_OPTION_RE)?.[1] || "";
                applyOptionPresentation(otherOption, String(otherAnswer).toUpperCase() === answer);
              });
            });
          };

          const onClick = (event) => {
            event.preventDefault();
            chooseAnswer();
          };
          const onKeyDown = (event) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            chooseAnswer();
          };

          repaint();
          optionNode.addEventListener("click", onClick);
          optionNode.addEventListener("keydown", onKeyDown);
          cleanups.push(() => {
            optionNode.removeEventListener("click", onClick);
            optionNode.removeEventListener("keydown", onKeyDown);
            optionNode.removeAttribute("data-falowen-clickable-answer");
            if (originalStyle === null) optionNode.removeAttribute("style");
            else optionNode.setAttribute("style", originalStyle);
            if (originalRole === null) optionNode.removeAttribute("role");
            else optionNode.setAttribute("role", originalRole);
            if (originalTabIndex === null) optionNode.removeAttribute("tabindex");
            else optionNode.setAttribute("tabindex", originalTabIndex);
            if (originalAriaChecked === null) optionNode.removeAttribute("aria-checked");
            else optionNode.setAttribute("aria-checked", originalAriaChecked);
          });
        });
      });
    };

    const scheduleBind = () => window.requestAnimationFrame(bindOptions);
    scheduleBind();
    observer = new MutationObserver(scheduleBind);
    observer.observe(root, { childList: true, subtree: true });

    return () => {
      observer?.disconnect();
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [activeTab, draftContext, sectionProfile?.part4Submission]);

  useEffect(() => {
    if (typeof document === "undefined" || activeTab !== "schreiben") return undefined;
    const root = document.getElementById("root") || document.body;
    let textarea = null;
    let interval = null;
    let observer = null;
    let lastObservedValue = null;
    let isHydrating = false;

    const syncWriting = () => {
      if (!textarea || !document.contains(textarea)) return;
      const currentValue = String(textarea.value ?? "");
      if (currentValue === lastObservedValue) return;
      lastObservedValue = currentValue;
      const nextDraft = saveWorkbookWritingDraft(draftContext, currentValue);
      latestDraftRef.current = nextDraft;
      adoptDraft(setDraft, nextDraft);
    };

    const onInput = () => {
      if (isHydrating) return;
      syncWriting();
    };

    const attach = () => {
      const candidate = root.querySelector(`textarea[aria-label="${level} German writing draft"]`);
      if (!candidate || candidate === textarea) return;
      if (textarea) textarea.removeEventListener("input", onInput);
      textarea = candidate;
      const storedValue = String(latestDraftRef.current?.sections?.teil2?.value || "");
      const currentValue = String(textarea.value || "");
      if (storedValue && !currentValue) {
        isHydrating = true;
        setNativeTextareaValue(textarea, storedValue);
        dispatchTextareaInput(textarea);
        isHydrating = false;
        lastObservedValue = storedValue;
      } else {
        lastObservedValue = null;
        syncWriting();
      }
      textarea.addEventListener("input", onInput);
    };

    const onClickCapture = () => {
      window.setTimeout(() => {
        attach();
        syncWriting();
      }, 0);
    };

    attach();
    interval = window.setInterval(() => {
      attach();
      syncWriting();
    }, 250);
    observer = new MutationObserver(attach);
    observer.observe(root, { childList: true, subtree: true });
    root.addEventListener("click", onClickCapture, true);

    return () => {
      syncWriting();
      if (textarea) textarea.removeEventListener("input", onInput);
      root.removeEventListener("click", onClickCapture, true);
      observer?.disconnect();
      if (interval) window.clearInterval(interval);
    };
  }, [activeTab, draftContext, level]);

  useEffect(() => {
    if (typeof document === "undefined" || activeTab !== "submit") return undefined;
    const root = document.getElementById("root") || document.body;
    let textarea = null;
    let interval = null;
    let observer = null;
    let studentTouched = false;
    let isInjecting = false;

    const onSubmitInput = () => {
      if (isInjecting || !textarea) return;
      studentTouched = true;
      const nextDraft = saveWorkbookSubmissionOverride(draftContext, textarea.value);
      latestDraftRef.current = nextDraft;
      adoptDraft(setDraft, nextDraft);
    };

    const attach = () => {
      const candidate = Array.from(root.querySelectorAll("form textarea")).find(
        (node) => !node.readOnly && !node.disabled,
      );
      if (!candidate || candidate === textarea) return;
      if (textarea) textarea.removeEventListener("input", onSubmitInput);
      textarea = candidate;
      textarea.addEventListener("input", onSubmitInput);
    };

    const inject = () => {
      attach();
      if (!textarea || textarea.disabled || studentTouched) return;
      const serialized = serializeWorkbookSubmissionDraft(latestDraftRef.current);
      const review = getWorkbookSubmissionReview(latestDraftRef.current);
      if (!serialized || !review.hasContent || String(textarea.value || "") === serialized) return;
      isInjecting = true;
      setNativeTextareaValue(textarea, serialized);
      dispatchTextareaInput(textarea);
      isInjecting = false;
    };

    attach();
    inject();
    interval = window.setInterval(inject, 250);
    observer = new MutationObserver(inject);
    observer.observe(root, { childList: true, subtree: true });

    return () => {
      if (textarea) textarea.removeEventListener("input", onSubmitInput);
      observer?.disconnect();
      if (interval) window.clearInterval(interval);
    };
  }, [activeTab, draftContext]);

  if (!context || !["A2", "B1"].includes(level) || day <= 0) return null;

  const review = getWorkbookSubmissionReview(draft);
  const activePartId = activeTab === "schreiben" ? "teil2" : activeTab === "lesen" ? "teil3" : activeTab === "hoeren" ? "teil4" : "";
  const activePart = review.parts.find((part) => part.partId === activePartId) || null;
  const savedTime = formatSavedTime(draft.updatedAt);

  if (activeTab === "submit") {
    return (
      <div data-workbook-mapped-submit-review="true" style={{ ...panelStyle, marginTop: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <strong style={{ color: "#1e3a8a" }}>Review & Submit</strong>
          {savedTime ? <span style={{ color: "#64748b", fontSize: 12 }}>Last mapped {savedTime}</span> : null}
        </div>
        <p style={{ margin: 0, color: "#475569" }}>
          Your latest workbook answers are mapped into the submission box below. Check them, confirm the task, then submit.
        </p>
        <div style={{ display: "grid", gap: 7 }}>
          {review.parts.map((part) => (
            <div key={part.partId} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "9px 10px", background: "#fff" }}>
              <strong>{part.heading} · {part.label}</strong>
              {part.kind === "text" ? (
                <div style={{ color: part.complete ? "#166534" : "#92400e", marginTop: 3 }}>
                  {part.complete ? `${part.wordCount} words saved` : "Not answered yet"}
                </div>
              ) : (
                <>
                  <div style={{ color: part.complete ? "#166534" : "#92400e", marginTop: 3 }}>
                    {part.total ? `${part.answered} of ${part.total} answers saved` : `${part.answered} answers saved`}
                    {part.missing?.length ? ` · Missing: ${part.missing.map((number) => `Q${number}`).join(", ")}` : ""}
                  </div>
                  {part.answers?.length ? <div style={{ marginTop: 3, color: "#334155" }}>{part.answers.join(" · ")}</div> : null}
                </>
              )}
            </div>
          ))}
        </div>
        {review.manualOverrideActive ? (
          <div style={{ color: "#1e40af", fontWeight: 700 }}>
            You edited the combined Submit text after mapping. That manual version is now the current final draft; a later Teil 2/3/4 change will remap the newest workbook answers.
          </div>
        ) : null}
      </div>
    );
  }

  if (!activePartId) return null;

  const isSelfCheck =
    activePartId === "teil4" && sectionProfile?.part4Submission !== "submit";
  return (
    <div data-workbook-mapped-save-status="true" style={{ ...panelStyle, marginTop: 10, padding: "9px 11px" }}>
      <strong style={{ color: "#1e3a8a" }}>
        {activePartId === "teil2" ? "Teil 2 autosave" : `${activePartId === "teil3" ? "Teil 3" : "Teil 4"} answer capture`}
      </strong>
      <span style={{ color: "#475569" }}>
        {activePartId === "teil2"
          ? activePart?.complete
            ? `${activePart.wordCount} words saved automatically to Submit${savedTime ? ` · ${savedTime}` : ""}. Analyse uses the same text, and your newest edit remains the saved version.`
            : "Start typing in the German text box. Your latest text will be saved automatically to Submit."
          : isSelfCheck
            ? "Your choices are saved for this self-check, but this Teil 4 is not added to the final submission for this lesson."
            : activePart
              ? `${activePart.answered}${activePart.total ? ` of ${activePart.total}` : ""} answers saved automatically to Submit${savedTime ? ` · ${savedTime}` : ""}. Click another option any time to replace an answer.`
              : "Click an answer option. Your choice will be saved automatically to Submit."}
      </span>
    </div>
  );
}
