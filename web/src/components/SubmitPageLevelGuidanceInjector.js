import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getA1Assignment } from "../data/a1AssignmentRegistry";

const GUIDANCE_ID = "falowen-submit-level-guidance";
const CHECKLIST_NAME = "falowen-submit-completion-check";
const INLINE_SUBMIT_ROOT_SELECTOR = "[data-a1-built-in-submission][data-assignment-key]";

const LEVEL_COPY = {
  A1: {
    title: "A1 workbook submission",
    badge: "Required parts",
    body: "Confirm every required Teil before sending this assignment for tutor marking.",
    submitLabel: "Submit workbook answers",
    checklist: [
      {
        id: "workbook",
        label: "I included every answer the workbook asks me to submit.",
        kind: "answer",
      },
    ],
    note: "The checklist changes automatically when you select a different A1 assignment.",
  },
  A2: {
    title: "A2 final answers",
    badge: "Required parts",
    body: "Confirm that your submission contains all required final answers.",
    submitLabel: "Submit final answers",
    checklist: [
      { id: "teil-2", label: "I included my final answer for Teil 2 · Schreiben.", kind: "answer" },
      { id: "teil-3", label: "I included all answers for Teil 3 · Lesen.", kind: "answer" },
      { id: "teil-4", label: "I included all answers for Teil 4 · Hören.", kind: "answer" },
    ],
    note: "Teil 1 · Sprechen is class preparation and is not included in the written submission.",
  },
  B1: {
    title: "B1 final answers",
    badge: "Required parts",
    body: "Confirm that your submission contains all required final answers.",
    submitLabel: "Submit final answers",
    checklist: [
      { id: "teil-2", label: "I included my final answer for Teil 2 · Schreiben.", kind: "answer" },
      { id: "teil-3", label: "I included all answers for Teil 3 · Lesen.", kind: "answer" },
      { id: "teil-4", label: "I included all answers for Teil 4 · Hören.", kind: "answer" },
    ],
    note: "Teil 1 · Sprechen is class preparation and is not included in the written submission.",
  },
  B2: {
    title: "B2 self-learning practice",
    badge: "Self-learning",
    body: "Confirm that you completed the self-learning steps before sending work requested by your tutor.",
    submitLabel: "Self-learning only",
    checklist: [
      { id: "self-learning", label: "I completed the self-learning steps for this lesson.", kind: "practice" },
    ],
    note: "Use this submit page only when your tutor specifically requests a submission.",
  },
  C1: {
    title: "C1 self-learning practice",
    badge: "Self-learning",
    body: "Confirm that you completed the self-learning steps before sending work requested by your tutor.",
    submitLabel: "Self-learning only",
    checklist: [
      { id: "self-learning", label: "I completed the self-learning steps for this lesson.", kind: "practice" },
    ],
    note: "Use this submit page only when your tutor specifically requests a submission.",
  },
};

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const normalizeLevel = (value = "") => String(value || "").trim().toUpperCase();
const normalizeAssignmentKey = (value = "") =>
  String(value || "")
    .trim()
    .toUpperCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "");

const getSubmitPageSelects = (root = document) => Array.from(root.querySelectorAll("select"));

const getInlineSubmitRoot = (root = document) => root.querySelector(INLINE_SUBMIT_ROOT_SELECTOR);

const getLevelFromDom = (search = "", root = document) => {
  const queryLevel = normalizeLevel(new URLSearchParams(search).get("level"));
  if (queryLevel) return queryLevel;

  const inlineAssignmentKey = normalizeAssignmentKey(
    getInlineSubmitRoot(root)?.getAttribute("data-assignment-key") || "",
  );
  const keyLevel = inlineAssignmentKey.match(/^(A1|A2|B1|B2|C1)-/)?.[1] || "";
  if (keyLevel) return keyLevel;

  const selects = getSubmitPageSelects(root);
  const levelSelect = selects.find((select) =>
    Array.from(select.options || []).some((option) =>
      /^(A1|A2|B1|B2|C1)$/i.test(String(option.value || option.textContent || "").trim()),
    ),
  );
  const raw = levelSelect?.value || levelSelect?.selectedOptions?.[0]?.textContent || "";
  return normalizeLevel(raw);
};

const getAssignmentFromDom = (root = document) => {
  const selects = getSubmitPageSelects(root);
  const assignmentSelect = selects.find((select) =>
    Array.from(select.options || []).some((option) =>
      /day\s*\d+|chapter|kapitel|A1-|A2-|B1-/i.test(String(option.textContent || option.value || "")),
    ),
  );
  return String(assignmentSelect?.selectedOptions?.[0]?.textContent || "").trim();
};

const getCopyForLevel = (level) => LEVEL_COPY[level] || LEVEL_COPY.A1;

export const getAssignmentKey = (assignment, search = "", root = document) => {
  const query = new URLSearchParams(search);
  const queryKey = query.get("assignmentKey") || query.get("assignmentId");
  if (queryKey) return normalizeAssignmentKey(queryKey);

  const inlineKey = getInlineSubmitRoot(root)?.getAttribute("data-assignment-key") || "";
  if (inlineKey) return normalizeAssignmentKey(inlineKey);

  return normalizeAssignmentKey(
    String(assignment || "").match(/\b(A1|A2|B1)-\d+(?:\.\d+)?\b/i)?.[0] || "",
  );
};

const buildA1AssignmentChecklist = (assignmentKey) => {
  const assignment = getA1Assignment(assignmentKey);
  if (!assignment?.sections?.length) return null;

  return assignment.sections.map((section) => {
    const readingOnly = assignmentKey === "A1-0.1" && section.key === "teil-1";
    return {
      id: section.key,
      label: readingOnly
        ? `I read ${section.label}.`
        : `I included my completed work for ${section.label}.`,
      kind: readingOnly ? "read" : "answer",
    };
  });
};

export const getRequiredChecklist = (level, assignmentKey) => {
  const normalizedLevel = normalizeLevel(level) || "A1";
  const normalizedKey = normalizeAssignmentKey(assignmentKey);
  const a1Checklist = normalizedLevel === "A1" ? buildA1AssignmentChecklist(normalizedKey) : null;
  return a1Checklist || getCopyForLevel(normalizedLevel).checklist;
};

const findSubmissionForm = ({ pathname = "", search = "", root = document } = {}) => {
  const forms = Array.from(root.querySelectorAll("form"));
  return forms.find((form) => {
    const submitButton = form.querySelector('button[type="submit"]');
    if (!submitButton || !form.querySelector("textarea")) return false;
    if (form.closest(INLINE_SUBMIT_ROOT_SELECTOR)) return true;
    if (String(pathname || "").includes("/campus/submit")) return true;
    if (new URLSearchParams(search).get("workbookTab") === "submit") return true;
    const formText = String(form.textContent || "");
    return /submit level/i.test(formText) && /assignment/i.test(formText);
  }) || null;
};

const guidanceHtml = (copy, level, assignment, checklist) => `
  <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;flex-wrap:wrap;">
    <div>
      <div style="font-size:12px;font-weight:800;color:#1d4ed8;text-transform:uppercase;letter-spacing:.04em;">Completion consent</div>
      <h3 style="margin:4px 0 0;font-size:18px;color:#0f172a;">${escapeHtml(copy.title)}</h3>
      <p style="margin:6px 0 0;color:#475569;line-height:1.6;">${escapeHtml(copy.body)}</p>
    </div>
    <span style="border:1px solid #bfdbfe;background:#eff6ff;color:#1d4ed8;border-radius:999px;padding:6px 10px;font-size:12px;font-weight:800;white-space:nowrap;">${escapeHtml(copy.badge)}</span>
  </div>
  <div style="border:1px solid #e5e7eb;background:#fff;border-radius:12px;padding:10px;display:grid;gap:8px;">
    <strong style="font-size:13px;color:#111827;">Required final answers${assignment ? ` · ${escapeHtml(assignment)}` : ""}</strong>
    <div style="display:grid;gap:8px;color:#374151;font-size:14px;">
      ${checklist
        .map(
          (item) => `<label style="display:flex;align-items:flex-start;gap:8px;line-height:1.45;"><input type="checkbox" name="${CHECKLIST_NAME}" data-check-id="${escapeHtml(item.id)}" style="margin-top:3px;"><span>${escapeHtml(item.label)}</span></label>`,
        )
        .join("")}
    </div>
    <span style="font-size:12px;color:#64748b;">The Submit button unlocks only after every required item is checked.</span>
  </div>
  <div style="border:1px solid #fde68a;background:#fffbeb;color:#92400e;border-radius:12px;padding:10px;line-height:1.6;font-size:14px;">
    <strong>Note:</strong> ${escapeHtml(copy.note)}
  </div>
  <div style="font-size:12px;color:#64748b;">Detected assignment: <strong>${escapeHtml(assignment || "Select an assignment")}</strong> · Level: <strong>${escapeHtml(level || "A1")}</strong></div>
`;


const findEditorContainer = (form) => {
  const textarea = form?.querySelector?.("textarea");
  if (!textarea) return null;
  return textarea.closest?.("label") || textarea.parentElement;
};

const placeGuidanceBelowEditor = (card, form) => {
  const editorContainer = findEditorContainer(form);
  if (editorContainer?.parentElement) {
    if (editorContainer.nextElementSibling !== card) {
      editorContainer.insertAdjacentElement("afterend", card);
    }
    return;
  }
  if (card.parentElement !== form.parentElement) {
    form.parentElement?.insertBefore(card, form);
  }
};

const getSubmitButton = (form) =>
  form?.querySelector('button[type="submit"]') ||
  Array.from(form?.querySelectorAll("button") || []).find((button) =>
    /submit assignment|submit final answers|submit workbook answers/i.test(button.textContent || ""),
  );

const releaseChecklistGate = (form) => {
  const submitButton = getSubmitButton(form);
  if (submitButton?.dataset.disabledByCompletionChecklist === "true") {
    submitButton.disabled = false;
    delete submitButton.dataset.disabledByCompletionChecklist;
    delete submitButton.dataset.completionChecklistReady;
  }
};

const applyChecklistGate = (form, card) => {
  const checks = Array.from(card?.querySelectorAll(`input[name="${CHECKLIST_NAME}"]`) || []);
  const submitButton = getSubmitButton(form);
  if (!submitButton || !checks.length) return;

  const complete = checks.every((check) => check.checked);
  submitButton.dataset.completionChecklistReady = complete ? "true" : "false";

  if (!complete) {
    if (!submitButton.disabled || submitButton.dataset.disabledByCompletionChecklist === "true") {
      submitButton.disabled = true;
      submitButton.dataset.disabledByCompletionChecklist = "true";
    }
    return;
  }

  if (submitButton.dataset.disabledByCompletionChecklist === "true") {
    submitButton.disabled = false;
    delete submitButton.dataset.disabledByCompletionChecklist;
  }
};

const applySubmitButtonLabel = (copy, level, form) => {
  const submitButton = getSubmitButton(form);
  if (!submitButton) return;
  if (/submitting|submission locked/i.test(submitButton.textContent || "")) return;
  if (level === "B2" || level === "C1") return;
  submitButton.textContent = copy.submitLabel;
};

export const syncSubmitCompletionGuide = ({
  pathname = typeof window !== "undefined" ? window.location.pathname : "",
  search = typeof window !== "undefined" ? window.location.search : "",
  root = document,
} = {}) => {
  const form = findSubmissionForm({ pathname, search, root });
  const existingCard = root.getElementById(GUIDANCE_ID);

  if (!form) {
    if (existingCard) {
      releaseChecklistGate(existingCard.__falowenSubmissionForm || null);
      existingCard.remove();
    }
    return false;
  }

  const level = getLevelFromDom(search, root) || "A1";
  const copy = getCopyForLevel(level);
  const assignment = getAssignmentFromDom(root);
  const assignmentKey = getAssignmentKey(assignment, search, root);
  const checklist = getRequiredChecklist(level, assignmentKey);
  const assignmentRecord = level === "A1" ? getA1Assignment(assignmentKey) : null;
  const assignmentLabel = assignmentRecord
    ? `${assignmentKey} · ${assignmentRecord.title}`
    : assignment || assignmentKey;

  let card = existingCard;
  if (!card) {
    card = document.createElement("section");
    card.id = GUIDANCE_ID;
    card.setAttribute("aria-label", "Assignment completion consent");
    card.setAttribute("data-submission-completion-checklist", "true");
    card.style.border = "1px solid #bfdbfe";
    card.style.background = "linear-gradient(135deg, #eff6ff, #ffffff)";
    card.style.borderRadius = "16px";
    card.style.padding = "14px";
    card.style.display = "grid";
    card.style.gap = "10px";
    card.style.boxShadow = "0 10px 24px rgba(15,23,42,.06)";
    placeGuidanceBelowEditor(card, form);
  } else {
    placeGuidanceBelowEditor(card, form);
  }

  card.__falowenSubmissionForm = form;
  const checklistIdentity = `${level}:${assignmentKey}:${checklist.map((item) => item.id).join(",")}`;
  if (card.dataset.checklistIdentity !== checklistIdentity) {
    card.innerHTML = guidanceHtml(copy, level, assignmentLabel, checklist);
    card.dataset.checklistIdentity = checklistIdentity;
  }

  applySubmitButtonLabel(copy, level, form);
  applyChecklistGate(form, card);
  return true;
};

const SubmitPageLevelGuidanceInjector = () => {
  const location = useLocation();

  useEffect(() => {
    let timeoutId = null;
    const scheduleUpdate = () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(
        () => syncSubmitCompletionGuide({ pathname: location.pathname, search: location.search }),
        60,
      );
    };

    scheduleUpdate();
    const observer = new MutationObserver(scheduleUpdate);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["disabled", "data-assignment-key"],
    });
    document.addEventListener("change", scheduleUpdate, true);
    document.addEventListener("input", scheduleUpdate, true);

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      observer.disconnect();
      document.removeEventListener("change", scheduleUpdate, true);
      document.removeEventListener("input", scheduleUpdate, true);
      const card = document.getElementById(GUIDANCE_ID);
      if (card) {
        releaseChecklistGate(card.__falowenSubmissionForm || null);
        card.remove();
      }
    };
  }, [location.pathname, location.search]);

  return null;
};

export default SubmitPageLevelGuidanceInjector;
