import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const GUIDANCE_ID = "falowen-submit-level-guidance";

const LEVEL_COPY = {
  A1: {
    title: "A1 workbook submission",
    badge: "Simple A1 flow",
    body: "Submit your workbook answers for this lesson. Write your answers clearly and check before sending.",
    submitLabel: "Submit workbook answers",
    checklist: [
      "I answered the workbook questions.",
      "I checked my name and assignment.",
      "I am ready to submit.",
    ],
    note: "A1 does not use the Teil 2, Teil 3 and Teil 4 submission structure.",
  },
  A2: {
    title: "A2 final answers",
    badge: "A2 workbook flow",
    body: "Submit only your final answers for Teil 2 · Schreiben, Teil 3 · Lesen and Teil 4 · Hören.",
    submitLabel: "Submit final answers",
    checklist: [
      "I completed Teil 2 · Schreiben.",
      "I answered Teil 3 · Lesen.",
      "I answered Teil 4 · Hören.",
    ],
    note: "Do not submit Teil 1 · Sprechen. Teil 1 is class preparation and speaking practice.",
  },
  B1: {
    title: "B1 final answers",
    badge: "B1 workbook flow",
    body: "Submit only your final answers for Teil 2 · Schreiben, Teil 3 · Lesen and Teil 4 · Hören.",
    submitLabel: "Submit final answers",
    checklist: [
      "I completed Teil 2 · Schreiben.",
      "I answered Teil 3 · Lesen.",
      "I answered Teil 4 · Hören.",
    ],
    note: "Do not submit Teil 1 · Sprechen. Teil 1 is class preparation and speaking practice.",
  },
  B2: {
    title: "B2 self-learning practice",
    badge: "No normal tutor submission",
    body: "B2 is mainly self-learning. Use Falowen AI, improve your answer and mark the lesson complete inside the course lesson.",
    submitLabel: "Self-learning only",
    checklist: [
      "I practised with Falowen AI.",
      "I improved my answer after feedback.",
      "I marked the lesson complete in the course page.",
    ],
    note: "Only use this submit page if your tutor specifically asks you to send a task here.",
  },
  C1: {
    title: "C1 self-learning practice",
    badge: "No normal tutor submission",
    body: "C1 is mainly self-learning. Use Falowen AI, improve your answer and mark the lesson complete inside the course lesson.",
    submitLabel: "Self-learning only",
    checklist: [
      "I practised with Falowen AI.",
      "I improved my answer after feedback.",
      "I marked the lesson complete in the course page.",
    ],
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

const guidanceHtml = (copy, level, assignment) => `
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
    <ul style="margin:0;padding-left:20px;color:#374151;line-height:1.7;font-size:14px;">
      ${copy.checklist.map((item) => `<li>${item}</li>`).join("")}
    </ul>
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

const insertOrUpdateGuidance = () => {
  const level = getLevelFromDom();
  const copy = getCopyForLevel(level);
  const assignment = getAssignmentFromDom();
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

  card.innerHTML = guidanceHtml(copy, level, assignment);
  applySubmitButtonLabel(copy, level);
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

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      observer.disconnect();
      document.removeEventListener("change", scheduleUpdate, true);
      document.getElementById(GUIDANCE_ID)?.remove();
    };
  }, [location.pathname, location.search]);

  return null;
};

export default SubmitPageLevelGuidanceInjector;
