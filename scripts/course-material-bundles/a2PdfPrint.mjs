export const a2PrintCss = "\n@page { size: A4; margin: 12mm 10mm 15mm; }\nhtml, body, #root, main { background: #fff !important; }\nbody { color: #17233b !important; print-color-adjust: exact; -webkit-print-color-adjust: exact; }\nmain { width: 100% !important; max-width: 100% !important; }\n.app-header, .app-header-meta, nav, [role=\"navigation\"], [role=\"banner\"],\n[role=\"tablist\"], [role=\"tab\"], [data-workbook-tab-navigation], [data-a2-b1-grammar-video],\n[data-a2-day16-teacher-lecture], [data-a2-day17-teacher-lecture],\n[data-radio-first-workbook-gate], [class*=\"falowen-radio\" i],\n[class*=\"teacher-video\" i], [data-teacher-video],\n[data-universal-a2-workbook-tabs], [data-hidden-legacy-workbook-tabs],\n[data-sticky-navigation], [data-course-inline-practice],\n[data-a2-print-private], [data-a1-print-private],\n[data-live-class-response], [data-live-class-response-mount],\n[data-pdf-exclude], [class*=\"study-buddy\" i], [class*=\"floating\" i],\n[class*=\"chat-widget\" i], [class*=\"video-card\" i], .book-print-stamp,\n.book-pdf-download-action, iframe, video, audio, button[type=\"submit\"],\nbutton[type=\"reset\"], [aria-label*=\"download\" i],\n[aria-label*=\"Study Buddy\" i], [data-workbook-panel=\"references\"],\n[data-workbook-panel=\"submit\"], [data-workbook-panel=\"ref\"] { display: none !important; }\nsection:has(> iframe), section:has(> video) { display: none !important; }\n[style*=\"position: sticky\"], [style*=\"position: fixed\"] { position: static !important; }\n/* Preserve workbook multiple-choice answer buttons and radio/checkbox controls! */\nbutton:not([type=\"submit\"]):not([type=\"reset\"]):not([role=\"tab\"]) {\n background: #fff !important; color: #18233a !important;\n border: 1px solid #cbd5e1 !important; opacity: 1 !important;\n box-shadow: none !important; text-align: left !important;\n white-space: normal !important; min-height: 0 !important;\n}\ninput[type=\"checkbox\"], input[type=\"radio\"] {\n appearance: auto !important; -webkit-appearance: auto !important;\n visibility: visible !important; opacity: 1 !important;\n}\n[data-a2-pdf-answer-space] {\n padding: 8px 12px !important; margin: 8px 0 !important;\n border: 1px solid #cbd5e1 !important; background: #fff !important;\n}\n[data-a2-pdf-answer-rule] { height: 22px; border-bottom: 1px solid #94a3b8; }\n[data-a2-pdf-choice-key] { font-size: 11px !important; line-height: 1.4 !important;\n display: block !important; padding: 4px 0 !important; }\nimg { max-width: 100% !important; break-inside: avoid-page !important; }\nimg:not([alt*=\"QR\" i]):not([data-pdf-qr]) {\n max-height: 180px !important; object-fit: contain !important;\n}\nh1, h2, h3, h4, legend { break-after: avoid-page !important; }\nli, tr, pre, blockquote, [data-a2-pdf-answer-space] {\n break-inside: avoid-page !important; page-break-inside: avoid !important;\n}\n/* Whole lesson cards cannot be unbreakable or they cause orphan pages. */\nsection, article, table, div { break-inside: auto; }\na { color: inherit !important; text-decoration: none !important; }\n";

// A2-specific print-only export logic. Do not import into online workbooks.
const LOADING = /Loading the app|Connecting to Falowen|Please wait|Unexpected Application Error|Page not found|Loading failed|Cannot log in right now/i;

export const a2SectionReady = (section, snapshot) => {
 const text = String(snapshot?.text || "").replace(/\s+/g, " ").trim();
 const headings = (snapshot?.headings || []).join(" ").replace(/\s+/g, " ");
 const marker = {
   grammar: /(?:grammar|grammatik|sprachbausteine)/i,
   "teil-1": /(?:teil\s*1|sprechen)/i,
   "teil-2": /(?:teil\s*2|schreiben)/i,
   "teil-3": /(?:teil\s*3|lesen)/i,
   "teil-4": /(?:teil\s*4|hören|hoeren)/i,
 }[section];
 return !!marker && text.length >= 160 && !LOADING.test(text)
  && (section === "grammar" ? snapshot?.grammarVisible === true : marker.test(headings))
  && text.length > headings.length + 90;
};

export const findA2PdfLeaks = value => {
 const text = String(value || "");
 const candidates = [
  ["shared class answers", /What Your Classmates Shared|Write and share with your class/i],
  ["saved student draft", /Your saved answers|Your saved draft|Your previous submission/i],
  ["private learner assessment", /Your final score|Your latest score|Your marking feedback/i],
  ["online submission", /Contextual Assignment Submission|Submit workbook answers|Analyse my text/i],
  ["live practice", /Live AI examiner|Study Buddy chat|Talk with examiner/i],
 ];
 return candidates.filter(([, pattern]) => pattern.test(text)).map(([label]) => label);
};

// Run via page.evaluate only for PDF. Reset answers and redact personal widgets
// without editing a student React component or exposing a saved Firestore draft.
export const sanitizeA2PrintDocument = (section = "") => {
 const root = document.querySelector("main") || document.body;
 // Hide workbook tabs from the PDF with print CSS only. Never delete
 // React-owned tab controls during a multi-section render.
 const nodes = [...root.querySelectorAll(
  '[data-course-inline-practice], [data-a2-print-private], [data-a1-print-private], ' +
  '[data-live-class-response], [data-live-class-response-mount]'
 )];
 for (const node of nodes) node.remove();

 const makeLines = (count = 6) => {
  const block = document.createElement("div");
  block.setAttribute("data-a2-pdf-answer-space", "true");
  for (let i = 0; i < count; i += 1) {
   const line = document.createElement("div");
   line.setAttribute("data-a2-pdf-answer-rule", "");
   block.appendChild(line);
  }
  return block;
 };

 // The book is a paper workbook, not an exported website screen. Drop
 // navigation, Falowen Radio prompts and teacher-video action controls only.
 // Avoid removing the workbook tab navigation: React needs it for the next
 // exercise capture, and it is hidden by print CSS instead.
 const offlineChrome = document.body.querySelectorAll(
  '[data-radio-first-workbook-gate], [data-teacher-video], ' +
  '[data-falowen-radio], [data-a2-pdf-web-chrome]'
 );
 for (const node of offlineChrome) node.remove();
 const webOnlyAction = /^(?:(?:back|return) to course book|(?:open|watch|view) teacher video(?: on youtube)?|teacher video|(?:open|listen to|play) falowen radio|falowen radio)$/i;
 for (const node of [...document.body.querySelectorAll('a,button,[role="link"],[role="button"]')]) {
  const label = String(node.textContent || node.getAttribute("aria-label") || "")
   .replace(/\\s+/g, " ").trim();
  if (webOnlyAction.test(label)) node.remove();
 }

 // Legacy class-sharing widgets include classmates' names, dates and prose.
 for (const field of [...root.querySelectorAll('textarea[id^="workbook-share-"]')]) {
  let wrapper = field.parentElement;
  for (let depth = 0; wrapper && wrapper !== root && depth < 7; depth += 1) {
   const content = String(wrapper.textContent || "");
   if (/Write and share with your class/i.test(content)
     && /What Your Classmates Shared/i.test(content)) {
    wrapper.replaceWith(makeLines(7));
    break;
   }
   wrapper = wrapper.parentElement;
  }
 }
 for (const field of [...root.querySelectorAll("textarea")]) {
  field.replaceWith(makeLines(7));
 }
 // Live A2 writing pages normally have only an AI writing workspace, which we
 // redact. Add paper answer lines after the actual printed writing task.
 if (section === "workbook-teil-2" && !root.querySelector("[data-a2-pdf-answer-space]")) {
  const heading = [...root.querySelectorAll("h2,h3")]
   .find(node => /Teil\s*2.*Schreiben/i.test(node.textContent || ""));
  if (heading?.parentElement) {
   const label = document.createElement("h3");
   label.textContent = "Schreiben · Your answer";
   heading.parentElement.append(label, makeLines(8));
  }
 }
 for (const input of [...root.querySelectorAll("input")]) {
  const type = String(input.type || "text").toLowerCase();
  if (type === "checkbox" || type === "radio") input.checked = false;
  else if (!["hidden", "file"].includes(type)) {
   input.value = "";
   input.removeAttribute("value");
  }
 }
 // HTML select prints only a student's saved selection; instead show every
 // available exercise choice and clear the personal selection.
 for (const select of [...root.querySelectorAll("select")]) {
  const choices = [...select.options].map(option => option.textContent?.trim())
   .filter(Boolean).filter(v => !/^choose|select|wählen|bitte auswählen/i.test(v));
  if (choices.length >= 2 && choices.length <= 12) {
   const options = document.createElement("span");
   options.setAttribute("data-a2-pdf-choice-key", "");
   options.textContent = "Options: " + choices.join("  |  ");
   select.before(options);
  }
  select.selectedIndex = -1;
 }
};

export const extractA2PrintSnapshot = () => {
 const root = document.querySelector("main") || document.body;
 const visible = element => {
  if (!element.getClientRects().length) return false;
  const style = window.getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden";
 };
 const headings = [...root.querySelectorAll("h1,h2,h3,h4")]
  .filter(visible).map(element => element.innerText || element.textContent || "");
 const text = [...root.querySelectorAll("h1,h2,h3,h4,p,li,legend,label,strong,blockquote")]
  .filter(visible).map(element => element.innerText || element.textContent || "")
  .join(" ").replace(/\s+/g, " ").trim();
 const listeningPanel = root.querySelector('[data-a2-pdf-listening-task="true"]');
 const listeningVisible = Boolean(listeningPanel && visible(listeningPanel));
 const listeningQuestionCount = listeningVisible
  ? [...listeningPanel.querySelectorAll("strong")].filter(visible).length
  : 0;
 return {
  headings, text,
  grammarVisible: Boolean(root.querySelector("[data-a2-focused-grammar]")),
  listeningVisible,
  listeningQuestionCount,
 };
};
