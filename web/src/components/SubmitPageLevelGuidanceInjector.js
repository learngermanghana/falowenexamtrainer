import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const GUIDANCE_ID = "falowen-submit-level-guidance";
const CHECKLIST_NAME = "falowen-submit-completion-check";

const A1_ASSIGNMENT_CHECKLISTS = {
  "A1-0.1": [
    { id: "teil-1", label: "I read Teil 1 · Reading Text.", kind: "read" },
    { id: "teil-2", label: "I answered every question in Teil 2 · Multiple-Choice Questions.", kind: "answer" },
  ],
};

const LEVEL_COPY = {
  A1: {
    title: "A1 workbook submission",
    badge: "Simple A1 flow",
    body: "Submit your workbook answers for this lesson. Write your answers clearly and check before sending.",
    submitLabel: "Submit workbook answers",
    checklist: [{ id: "workbook", label: "I answered every question the workbook asks me to submit.", kind: "answer" }],
    note: "A1 does not use the Teil 2, Teil 3 and Teil 4 submission structure.",
  },
  A2: {
    title: "A2 final answers",
    badge: "A2 workbook flow",
    body: "Submit only your final answers for Teil 2 · Schreiben, Teil 3 · Lesen and Teil 4 · Hören.",
    submitLabel: "Submit final answers",
    checklist: [
      { id: "teil-2", label: "I completed Teil 2 · Schreiben.", kind: "answer" },
      { id: "teil-3", label: "I answered Teil 3 · Lesen.", kind: "answer" },
      { id: "teil-4", label: "I answered Teil 4 · Hören.", kind: "answer" },
    ],
    note: "Do not submit Teil 1 · Sprechen. Teil 1 is class preparation and speaking practice.",
  },
  B1: {
    title: "B1 final answers",
    badge: "B1 workbook flow",
    body: "Submit only your final answers for Teil 2 · Schreiben, Teil 3 · Lesen and Teil 4 · Hören.",
    submitLabel: "Submit final answers",
    checklist: [
      { id: "teil-2", label: "I completed Teil 2 · Schreiben.", kind: "answer" },
      { id: "teil-3", label: "I answered Teil 3 · Lesen.", kind: "answer" },
      { id: "teil-4", label: "I answered Teil 4 · Hören.", kind: "answer" },
    ],
    note: "Do not submit Teil 1 · Sprechen. Teil 1 is class preparation and speaking practice.",
  },
  B2: {
    title: "B2 self-learning practice",
    badge: "No normal tutor submission",
    body: "B2 is mainly self-learning. Use Falowen AI, improve your answer and mark the lesson complete inside the course lesson.",
    submitLabel: "Self-learning only",
    checklist: [{ id: "self-learning", label: "I completed the self-learning steps shown above.", kind: "practice" }],
    note: "Only use this submit page if your tutor specifically asks you to send a task here.",
  },
  C1: {
    title: "C1 self-learning practice",
    badge: "No normal tutor submission",
    body: "C1 is mainly self-learning. Use Falowen AI, improve your answer and mark the lesson complete inside the course lesson.",
    submitLabel: "Self-learning only",
    checklist: [{ id: "self-learning", label: "I completed the self-learning steps shown above.", kind: "practice" }],
    note: "Only use this submit page if your tutor specifically asks you to send a task here.",
  },
};

const getSubmitPageSelects = () => Array.from(document.querySelectorAll("select"));

const getLevelFromDom = () => {
  const selects = getSubmitPageSelects();
  const levelSelect = selects.find((select) =>
    Array.from(select.options || []).some((option) => /^(A1|A2|B1|B2|C1)$/i.test(String(option.value || option.textContent || "").trim()))
  );
  const raw = levelSelect?.value || levelSelect?.selectedOptions?.[0]?.textContent || "";
  return String(raw || "").trim().toUpperCase();
};

const getAssignmentFromDom = () => {
  const selects = getSubmitPageSelects();
  const assignmentSelect = selects.find((select) =>
    Array.from(select.options || []).some((option) => /day\s*\d+|chapter|kapitel/i.test(String(option.textContent || "")))
  );
  return String(assignmentSelect?.selectedOptions?.[0]?.textContent || "").trim();
};

const getCopyForLevel = (level) => LEVEL_COPY[level] || LEVEL_COPY.A1;

export const getAssignmentKey = (assignment, search = "") => {
  const queryKey = new URLSearchParams(search).get("assignmentKey");
  if (queryKey) return String(queryKey).trim().toUpperCase();
  return String(assignment || "").match(/\b(A1|A2|B1)-\d+(?:\.\d+)?\b/i)?.[0]?.toUpperCase() || "";
};

export const getRequiredChecklist = (level, assignmentKey) =>
  (level === "A1" && A1_ASSIGNMENT_CHECKLISTS[assignmentKey]) || getCopyForLevel(level).checklist;

const guidanceHtml = (copy, level, assignment, checklist) => `
  <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;flex-wrap:wrap;">
    <div>
      <div style="font-size:12px;font-weight:800;color:#1d4ed8;text-transform:uppercase;letter-spacing:.04em;">Submit guide</div>
      <h3 style="margin:4px 0 0;font-size:18px;color:#0f172a;">${copy.title}</h3>
      <p style="margin:6px 0 0;color:#475569;line-height:1.6;">${copy.body}</p>
    </div>
    <span style="border:1px solid #bfdbfe;background:#eff6ff;color:#1d4ed8;border-radius:999px;padding:6px 10px;font-size:12px;font-weight:800;white-space:nowrap;">${copy.badge}</span>
  </div>
  <div style="border:1px solid #e5e7eb;background:#fff;border-radius:12px;padding:10px;display:grid;gap:6px;">
    <strong style="font-size:13px;color:#111827;">Before you submit${assignment ? ` · ${assignment.replace(/</g, "&lt;").replace(/>/g, "&gt;")}` : ""}</strong>
    <div style="display:grid;gap:8px;color:#374151;font-size:14px;">
      ${checklist.map((item) => `<label style="display:flex;align-items:flex-start;gap:8px;line-height:1.45;"><input type="checkbox" name="${CHECKLIST_NAME}" data-check-id="${item.id}" style="margin-top:3px;"><span>${item.label}</span></label>`).join("")}
    </div>
    <span style="font-size:12px;color:#64748b;">Reading-only parts are labelled “I read”; only parts containing tasks are labelled “I answered”.</span>
  </div>
  <div style="border:1px solid #fde68a;background:#fffbeb;color:#92400e;border-radius:12px;padding:10px;line-height:1.6;font-size:14px;">
    <strong>Note:</strong> ${copy.note}
  </div>
  <div style="font-size:12px;color:#64748b;">Detected level: <strong>${level || "A1"}</strong>. Change the Submit level above if this is not correct.</div>
`;

const applySubmitButtonLabel = (copy, level) => {
  const buttons = Array.from(document.querySelectorAll("button"));
  const submitButton = buttons.find((button) => button.type === "submit" || /submit assignment|submit final answers|submit workbook answers/i.test(button.textContent || ""));
  if (!submitButton) return;
  if (/submitting|submission locked/i.test(submitButton.textContent || "")) return;

  if (level === "B2" || level === "C1") {
    submitButton.textContent = copy.submitLabel;
    return;
  }

  submitButton.textContent = copy.submitLabel;
};

const applyChecklistGate = () => {
  const checks = Array.from(document.querySelectorAll(`input[name="${CHECKLIST_NAME}"]`));
  const submitButton = Array.from(document.querySelectorAll("button")).find((button) => button.type === "submit");
  if (!submitButton || !checks.length) return;
  const complete = checks.every((check) => check.checked);
  submitButton.dataset.completionChecklistReady = complete ? "true" : "false";
  if (!complete && !submitButton.disabled) {
    submitButton.disabled = true;
    submitButton.dataset.disabledByCompletionChecklist = "true";
  } else if (complete && submitButton.dataset.disabledByCompletionChecklist === "true") {
    submitButton.disabled = false;
    delete submitButton.dataset.disabledByCompletionChecklist;
  }
};

const insertOrUpdateGuidance = () => {
  const level = getLevelFromDom();
  const copy = getCopyForLevel(level);
  const assignment = getAssignmentFromDom();
  const assignmentKey = getAssignmentKey(assignment, window.location.search);
  const checklist = getRequiredChecklist(level, assignmentKey);
  const form = document.querySelector("form");
  if (!form) return;

  let card = document.getElementById(GUIDANCE_ID);
  if (!card) {
    card = document.createElement("section");
    card.id = GUIDANCE_ID;
    card.setAttribute("aria-label", "Level aware submission guide");
    card.style.border = "1px solid #bfdbfe";
    card.style.background = "linear-gradient(135deg, #eff6ff, #ffffff)";
    card.style.borderRadius = "16px";
    card.style.padding = "14px";
    card.style.display = "grid";
    card.style.gap = "10px";
    card.style.boxShadow = "0 10px 24px rgba(15,23,42,.06)";
    form.parentElement?.insertBefore(card, form);
  }

  const checklistIdentity = `${level}:${assignmentKey}:${checklist.map((item) => item.id).join(",")}`;
  if (card.dataset.checklistIdentity !== checklistIdentity) {
    card.innerHTML = guidanceHtml(copy, level, assignment, checklist);
    card.dataset.checklistIdentity = checklistIdentity;
  }
  applySubmitButtonLabel(copy, level);
  applyChecklistGate();
};

const SubmitPageLevelGuidanceInjector = () => {
  const location = useLocation();

  useEffect(() => {
    if (!String(location.pathname || "").includes("/campus/submit")) return undefined;

    let timeoutId = null;
    const scheduleUpdate = () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(insertOrUpdateGuidance, 80);
    };

    scheduleUpdate();
    const observer = new MutationObserver(scheduleUpdate);
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("change", scheduleUpdate, true);
    document.addEventListener("change", applyChecklistGate, true);

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      observer.disconnect();
      document.removeEventListener("change", scheduleUpdate, true);
      document.removeEventListener("change", applyChecklistGate, true);
      document.getElementById(GUIDANCE_ID)?.remove();
    };
  }, [location.pathname, location.search]);

  return null;
};

export default SubmitPageLevelGuidanceInjector;
