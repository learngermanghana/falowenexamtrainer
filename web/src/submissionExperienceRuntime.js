import {
  auth,
  collection,
  db,
  functions,
  getDocs,
  httpsCallable,
  limit,
  onIdTokenChanged,
  query,
  where,
} from "./firebase";
import { fetchStudentResultsHistory } from "./services/resultsApi";

const ORIGINAL_GUIDANCE_ID = "falowen-submit-level-guidance";
const MOVED_CHECKLIST_ID = "falowen-submit-completion-check-below-editor";
const HISTORICAL_RESUBMISSION_ID = "falowen-historical-resubmission";
const PASS_MARK = 60;

const normalizeKey = (value = "") =>
  String(value || "")
    .trim()
    .toUpperCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "");

const normalizeComparableKey = (value = "") => normalizeKey(value).replace(/[^A-Z0-9]/g, "");

const toScore = (value) => {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const match = String(value).match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;
  const score = Number(match[0]);
  return Number.isFinite(score) ? score : null;
};

const toMillis = (value) => {
  if (!value) return 0;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.toDate === "function") return value.toDate().getTime();
  if (typeof value?.seconds === "number") return Number(value.seconds) * 1000;
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
};

const extractKeyFromText = (value = "") =>
  String(value || "").match(/\b(A1|A2|B1|B2|C1)-\d+(?:\.\d+)?\b/i)?.[0] || "";

const rowAliases = (row = {}) => [
  row.canonicalAssignmentKey,
  row.assignmentKey,
  row.assignmentId,
  row.assignment_id,
  row.explicitId,
  extractKeyFromText(row.assignment || row.assignmentTitle || row.title),
].filter(Boolean);

export const findLatestAssignmentResult = (rows = [], assignmentKey = "") => {
  const target = normalizeComparableKey(assignmentKey);
  if (!target) return null;

  return rows
    .filter((row) => rowAliases(row).some((alias) => normalizeComparableKey(alias) === target))
    .map((row) => ({
      ...row,
      normalizedScore: toScore(row.score ?? row.finalScore ?? row.percentage ?? row.mark ?? row.grade),
    }))
    .filter((row) => typeof row.normalizedScore === "number")
    .sort(
      (left, right) =>
        toMillis(right.markedAt || right.scoredAt || right.date || right.updatedAt || right.createdAt) -
        toMillis(left.markedAt || left.scoredAt || left.date || left.updatedAt || left.createdAt),
    )[0] || null;
};

const findChecklistBlock = (card) =>
  Array.from(card?.children || []).find((child) =>
    Array.from(child.querySelectorAll?.("strong") || []).some((strong) =>
      String(strong.textContent || "").trim().startsWith("Confirm every required Teil"),
    ),
  ) || null;

const findSubmissionForm = (root = document) =>
  Array.from(root.querySelectorAll("form")).find(
    (form) => form.querySelector("textarea") && form.querySelector('button[type="submit"]'),
  ) || null;

const syncChecklistClone = (originalBlock, cloneBlock) => {
  const originals = new Map(
    Array.from(originalBlock.querySelectorAll('input[type="checkbox"]')).map((input) => [
      input.getAttribute("data-check-id") || input.value || String(input.name || ""),
      input,
    ]),
  );

  Array.from(cloneBlock.querySelectorAll('input[type="checkbox"]')).forEach((clone) => {
    const key = clone.getAttribute("data-check-id") || clone.value || String(clone.name || "");
    const original = originals.get(key);
    clone.removeAttribute("name");
    if (!original) return;
    clone.checked = original.checked;
    clone.addEventListener("change", () => {
      original.checked = clone.checked;
      original.dispatchEvent(new Event("change", { bubbles: true }));
    });
  });
};

export const moveCompletionChecklistBelowEditor = (root = document) => {
  const card = root.getElementById?.(ORIGINAL_GUIDANCE_ID);
  const form = findSubmissionForm(root);
  const textarea = form?.querySelector("textarea");
  const originalBlock = findChecklistBlock(card);
  if (!card || !form || !textarea || !originalBlock) return false;

  const editorContainer = textarea.closest("label") || textarea.parentElement;
  if (!editorContainer?.parentElement) return false;

  root.getElementById?.(MOVED_CHECKLIST_ID)?.remove();
  const clone = originalBlock.cloneNode(true);
  clone.id = MOVED_CHECKLIST_ID;
  clone.hidden = false;
  clone.style.display = "grid";
  clone.setAttribute("data-checklist-below-editor", "true");
  syncChecklistClone(originalBlock, clone);

  originalBlock.hidden = true;
  originalBlock.setAttribute("data-original-checklist-hidden", "true");
  editorContainer.insertAdjacentElement("afterend", clone);
  return true;
};

const getAssignmentContext = (root = document) => {
  const params = new URLSearchParams(window.location.search || "");
  const inlineRoot = root.querySelector("[data-a1-built-in-submission][data-assignment-key]");
  const selectedAssignment = Array.from(root.querySelectorAll("select")).find((select) =>
    Array.from(select.options || []).some((option) => /A1-|A2-|B1-|Day\s*\d+/i.test(option.textContent || option.value || "")),
  );
  const assignmentTitle = String(selectedAssignment?.selectedOptions?.[0]?.textContent || "").trim();
  const assignmentKey = normalizeKey(
    params.get("assignmentKey") ||
      params.get("assignmentId") ||
      inlineRoot?.getAttribute("data-assignment-key") ||
      extractKeyFromText(assignmentTitle),
  );
  const level = assignmentKey.match(/^(A1|A2|B1|B2|C1)-/)?.[1] || String(params.get("level") || "").toUpperCase();
  const day = Number(assignmentTitle.match(/\bDay\s*(\d+)/i)?.[1] || params.get("day") || 0);
  const chapter = assignmentTitle.match(/\b(?:Chapter|Kapitel)\s*([0-9.]+)/i)?.[1] || assignmentKey.split("-")[1] || "";

  return { assignmentKey, assignmentTitle, level, day, chapter };
};

const findStudentProfile = async (user) => {
  if (!db || !user?.email) return null;
  const emails = [...new Set([user.email, user.email.toLowerCase()].filter(Boolean))];
  for (const email of emails) {
    const snapshot = await getDocs(query(collection(db, "students"), where("email", "==", email), limit(1)));
    if (!snapshot.empty) return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  }
  return null;
};

const fetchScoreRowsFromFirestore = async (studentCode) => {
  if (!db || !studentCode) return [];
  const codes = [...new Set([studentCode, String(studentCode).toLowerCase(), String(studentCode).toUpperCase()])];
  const requests = [];
  codes.forEach((code) => {
    requests.push(getDocs(query(collection(db, "scores"), where("studentcode", "==", code))));
    requests.push(getDocs(query(collection(db, "scores"), where("studentCode", "==", code))));
  });
  const settled = await Promise.allSettled(requests);
  const rows = new Map();
  settled.forEach((result) => {
    if (result.status !== "fulfilled") return;
    result.value.docs.forEach((entry) => rows.set(entry.id, { id: entry.id, ...entry.data() }));
  });
  return [...rows.values()];
};

const loadResultRows = async (user, studentCode) => {
  const token = await user.getIdToken();
  try {
    const apiRows = await fetchStudentResultsHistory({ idToken: token, studentCode });
    if (Array.isArray(apiRows) && apiRows.length) return apiRows;
  } catch (_error) {
    // Fall through to the same Firestore score source used by the tutor dashboard.
  }
  return fetchScoreRowsFromFirestore(studentCode);
};

const hasNativeResubmissionForm = (root = document) =>
  Array.from(root.querySelectorAll("textarea")).some((textarea) =>
    /corrected|resubmission|improved answer/i.test(
      `${textarea.getAttribute("placeholder") || ""} ${textarea.getAttribute("aria-label") || ""}`,
    ),
  );

const createField = ({ label, placeholder, minHeight = 130 }) => {
  const wrapper = document.createElement("label");
  wrapper.style.display = "grid";
  wrapper.style.gap = "6px";
  const title = document.createElement("strong");
  title.textContent = label;
  const textarea = document.createElement("textarea");
  textarea.placeholder = placeholder;
  textarea.style.minHeight = `${minHeight}px`;
  textarea.style.width = "100%";
  textarea.style.boxSizing = "border-box";
  textarea.style.border = "1px solid #94a3b8";
  textarea.style.borderRadius = "12px";
  textarea.style.padding = "12px";
  textarea.style.font = "inherit";
  textarea.style.lineHeight = "1.6";
  wrapper.append(title, textarea);
  return { wrapper, textarea };
};

const buildFingerprint = (assignmentKey, text) =>
  `${normalizeKey(assignmentKey).toLowerCase()}::${String(text || "").trim().toLowerCase().replace(/\s+/g, " ").slice(0, 240)}`;

export const buildHistoricalResubmissionPayload = ({ context, result, profile, user, correctedText, improvementSummary }) => ({
  assignmentKey: context.assignmentKey,
  canonicalAssignmentKey: context.assignmentKey,
  assignmentId: context.assignmentKey,
  assignment_id: context.assignmentKey,
  title: context.assignmentTitle || context.assignmentKey,
  assignmentTitle: context.assignmentTitle || context.assignmentKey,
  level: context.level,
  day: context.day,
  chapter: context.chapter,
  chapterKey: context.chapter ? `chapter-${context.chapter}` : "",
  studentId: user.uid,
  studentEmail: user.email || "",
  studentCode: profile?.studentCode || profile?.studentcode || profile?.id || "",
  studentName: profile?.name || profile?.fullName || user.displayName || "",
  className: profile?.className || "",
  submissionText: correctedText.trim(),
  answer: correctedText.trim(),
  workContent: correctedText.trim(),
  improvementSummary: improvementSummary.trim(),
  previousScore: result.normalizedScore,
  submissionFingerprint: buildFingerprint(context.assignmentKey, correctedText),
});

const renderHistoricalResubmission = ({ root = document, context, result, profile, user }) => {
  if (root.getElementById(HISTORICAL_RESUBMISSION_ID) || hasNativeResubmissionForm(root)) return false;
  const form = findSubmissionForm(root);
  if (!form?.parentElement) return false;

  const section = document.createElement("section");
  section.id = HISTORICAL_RESUBMISSION_ID;
  section.setAttribute("data-historical-resubmission", "true");
  Object.assign(section.style, {
    border: "2px solid #f59e0b",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #fffbeb, #ffffff)",
    padding: "14px",
    display: "grid",
    gap: "12px",
    marginTop: "12px",
  });

  const heading = document.createElement("h3");
  heading.textContent = "Resubmission unlocked";
  heading.style.margin = "0";
  const summary = document.createElement("p");
  summary.style.margin = "0";
  summary.style.lineHeight = "1.6";
  summary.textContent = `${context.assignmentKey} was marked ${Math.round(result.normalizedScore)}/100 (FAIL). Submit the complete corrected task below. The pass mark is ${PASS_MARK}%.`;

  const corrected = createField({
    label: "Corrected complete answer",
    placeholder: "Complete every missing and incorrect question. Submit only your corrected answers.",
    minHeight: 190,
  });
  const improvement = createField({
    label: "What did you improve?",
    placeholder: "Example: I completed Q1–Q9 and corrected the personal-pronoun answer.",
    minHeight: 90,
  });
  const message = document.createElement("p");
  message.style.margin = "0";
  message.setAttribute("role", "status");
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Submit corrected work";
  Object.assign(button.style, {
    border: "0",
    borderRadius: "12px",
    padding: "12px 16px",
    background: "#1d4ed8",
    color: "#ffffff",
    font: "inherit",
    fontWeight: "800",
    cursor: "pointer",
    width: "fit-content",
  });

  button.addEventListener("click", async () => {
    const correctedText = corrected.textarea.value.trim();
    const improvementSummary = improvement.textarea.value.trim();
    if (correctedText.length < 80) {
      message.textContent = "Please submit the complete corrected task (at least 80 characters).";
      message.style.color = "#b91c1c";
      return;
    }
    if (improvementSummary.length < 25) {
      message.textContent = "Please explain clearly what you corrected (at least 25 characters).";
      message.style.color = "#b91c1c";
      return;
    }

    button.disabled = true;
    button.textContent = "Submitting…";
    message.textContent = "";
    try {
      const callable = httpsCallable(functions, "submitHistoricalAssignmentResubmission");
      const payload = buildHistoricalResubmissionPayload({
        context,
        result,
        profile,
        user,
        correctedText,
        improvementSummary,
      });
      const response = await callable(payload);
      message.textContent = `Resubmission sent successfully. Attempt ${response?.data?.attempt || 2}/3 is awaiting tutor marking.`;
      message.style.color = "#166534";
      corrected.textarea.disabled = true;
      improvement.textarea.disabled = true;
      button.textContent = "Resubmission sent";
    } catch (error) {
      message.textContent = error?.message || "Could not save the resubmission. Please try again.";
      message.style.color = "#b91c1c";
      button.disabled = false;
      button.textContent = "Submit corrected work";
    }
  });

  section.append(heading, summary, corrected.wrapper, improvement.wrapper, button, message);
  form.insertAdjacentElement("afterend", section);
  return true;
};

let scheduled = false;
let activeUser = auth?.currentUser || null;
let lastHistoricalLookup = "";

const applySubmissionExperience = async () => {
  moveCompletionChecklistBelowEditor(document);

  const context = getAssignmentContext(document);
  if (!activeUser || !context.assignmentKey || hasNativeResubmissionForm(document)) return;
  const lookupKey = `${activeUser.uid}:${context.assignmentKey}`;
  if (lookupKey === lastHistoricalLookup && document.getElementById(HISTORICAL_RESUBMISSION_ID)) return;
  lastHistoricalLookup = lookupKey;

  try {
    const profile = await findStudentProfile(activeUser);
    const studentCode = profile?.studentCode || profile?.studentcode || profile?.id || "";
    if (!studentCode) return;
    const rows = await loadResultRows(activeUser, studentCode);
    const result = findLatestAssignmentResult(rows, context.assignmentKey);
    if (!result || result.normalizedScore >= PASS_MARK) return;
    renderHistoricalResubmission({ context, result, profile, user: activeUser });
  } catch (error) {
    console.warn("Could not check historical resubmission eligibility", error);
  }
};

const schedule = () => {
  if (scheduled) return;
  scheduled = true;
  window.setTimeout(() => {
    scheduled = false;
    applySubmissionExperience();
  }, 80);
};

if (typeof window !== "undefined" && typeof document !== "undefined") {
  if (auth) {
    onIdTokenChanged(auth, (user) => {
      activeUser = user;
      lastHistoricalLookup = "";
      schedule();
    });
  }
  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("change", schedule, true);
  document.addEventListener("input", schedule, true);
  window.addEventListener("popstate", schedule);
  [100, 400, 1000, 2000].forEach((delay) => window.setTimeout(schedule, delay));
}
