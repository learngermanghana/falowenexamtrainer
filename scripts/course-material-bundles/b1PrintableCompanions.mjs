import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { B1_PRESERVED_READING_PRINT_DATA, B1_DAY22_SECOND_READING_PRINT_DATA } from "./b1PreservedReadingPrintData.mjs";

const dataDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../web/src/data");
const modules = new Map();
const allowedSources = new Set(["b1WritingTasks.js", "b1ReadingTasks.js", "b1ListeningTasks.js", "b1WritingSchedule.js", "speakingDictionary.js", "b1Days23To28LessonMetadata.js"]);

// Read the same canonical B1 lesson data the student application uses, without
// loading React, opening a graded tab, or reading any student's saved work.
const canonical = (filename) => {
  if (!allowedSources.has(filename)) throw new Error("Unsupported B1 print source: " + filename);
  if (!modules.has(filename)) {
    let source = fs.readFileSync(path.join(dataDir, filename), "utf8");
    // b1ListeningTasks imports three question-only data modules without .js
    // extensions (supported by Vite but not Node's data: module loader).
    source = source.replace(/from\s+(["'])(\.\/b1Day[678]WorkbookData)\1/g, (_, quote, specifier) => {
      const dependency = fs.readFileSync(path.join(dataDir, specifier.slice(2) + ".js"), "utf8");
      if (/^\s*import\s/m.test(dependency)) throw new Error("Unexpected nested B1 print-source import");
      return 'from "data:text/javascript;base64,' + Buffer.from(dependency).toString("base64") + '"';
    });
    if (/\bfrom\s+["']\.\//.test(source)) throw new Error("Unresolved B1 print-source import: " + filename);
    modules.set(filename, import("data:text/javascript;base64," + Buffer.from(source).toString("base64")));
  }
  return modules.get(filename);
};

const escapeHtml = (value) => String(value ?? "")
  .replace(/Falowen\s+Radio/gi, "pre-lesson audio")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const paragraph = (value) => "<p>" + escapeHtml(value) + "</p>";
const orderedList = (values) => "<ol>" + values.map(value => "<li>" + escapeHtml(value) + "</li>").join("") + "</ol>";
const questions = (values, label) => {
  if (!Array.isArray(values) || !values.length) throw new Error(label + ": canonical questions missing");
  return '<ol class="questions">' + values.map((question, index) => {
    const stem = String(question.stem || question.text || question.question || "").trim();
    const options = question.options;
    if (!stem || !Array.isArray(options) || options.length < 2 || options.some(o => typeof o !== "string" || !o.trim())) {
      throw new Error(label + ": incomplete question or choices at " + (index + 1));
    }
    return "<li><strong>" + escapeHtml(stem) + "</strong><ul>" +
      options.map(option => "<li>" + escapeHtml(option) + "</li>").join("") + "</ul></li>";
  }).join("") + "</ol>";
};
const pageHtml = ({ day, section, title, body, intro = "" }) => {
  if (body.replace(/<[^>]*>/g, "").replace(/[_\s]/g, "").length < 90) {
    throw new Error("B1 Day " + day + " " + section + ": canonical print content is incomplete");
  }
  return '<!doctype html><html lang="de"><head><meta charset="utf-8"><style>' +
    '@page{size:A4;margin:12mm 13mm 14mm}body{font:11pt/1.45 Arial,sans-serif;color:#172033}' +
    'header{border-bottom:2px solid #2257aa;padding-bottom:12px;margin-bottom:16px}' +
    'header small{color:#3b6599;font-weight:700}h1{font-size:19pt;margin:6px 0}h2{font-size:13pt;margin:20px 0 8px}' +
    'p{white-space:pre-line}li{margin:7px 0}li,aside{break-inside:avoid}' +
    '.questions>li{margin:16px 0}.questions ul{list-style:none;padding-left:18px}' +
    '.hint{background:#edf4ff;border-left:4px solid #3970b8;padding:10px}' +
    'footer{border-top:1px solid #cbd5e1;margin-top:24px;padding-top:10px;font-size:9pt;color:#4b5563}' +
    '</style></head><body><header><small>FALOWEN · B1 · Tag ' + day + '</small><h1>' +
    escapeHtml(title) + '</h1><div>' + escapeHtml(section) + '</div></header>' +
    (intro ? '<div class="hint">' + paragraph(intro) + '</div>' : "") +
    '<main>' + body + '</main><footer>Schriftliche Übungen können Sie auf Papier bearbeiten. Audio und benotete Abgabe bleiben in der Falowen-Lektion.</footer></body></html>';
};

const writing = async (day) => {
  const { getB1WritingTask } = await canonical("b1WritingTasks.js");
  const task = getB1WritingTask(day);
  if (!task?.instructions || !task.title) throw new Error("B1 Day " + day + ": canonical writing task missing");
  const prompt = [task.instructions, task.sourceTitle, task.sourceText].filter(Boolean).join(" ");
  if (prompt.length < 70) throw new Error("B1 Day " + day + ": writing prompt is incomplete");
  const body = paragraph(task.instructions) +
    (task.sourceText ? "<h2>" + escapeHtml(task.sourceTitle || "Lesetext") + "</h2>" + paragraph(task.sourceText) : "") +
    (task.taskPoints?.length ? "<h2>Bearbeiten Sie alle Punkte</h2>" + orderedList(task.taskPoints) : "") +
    "<h2>Ihre Antwort</h2>" + Array(9).fill("<p>_________________________________________________________</p>").join("");
  // Do not print task.template: that is an example answer, not a student question.
  return pageHtml({ day, section: "Teil 2 · Schreiben", title: task.title, body });
};

// Some older B1 preserved workbook panels keep their full exercises in JSX,
// while the shared canonical task registry has metadata only. Never invent
// questions or silently skip a locked tab: provide an explicit online-only
// companion until those panels are migrated into canonical print data.
const onlineOnly = ({ day, section, title, instructions = "", lessonUrl, audioQrDataUrl }) => {
  if (!lessonUrl || !audioQrDataUrl) {
    throw new Error("B1 Day " + day + " " + section + ": authenticated online-only QR required");
  }
  const body = '<div data-b1-pdf-online-only="true"><h2>Diese Aufgabe ist nur online verfügbar</h2>' +
    '<p>Die vollständigen Aufgaben dieses Abschnitts sind noch nicht als eigenständige Druckquelle hinterlegt. ' +
    'Öffnen Sie die authentifizierte Falowen-Lektion und bearbeiten Sie dort ' + escapeHtml(section) + '.</p>' +
    (instructions ? paragraph(instructions) : "") +
    '<aside style="display:flex;align-items:center;gap:12px;padding:12px;background:#eff6ff;border:1px solid #bfd3eb">' +
    '<img width="90" height="90" src="' + escapeHtml(audioQrDataUrl) + '" alt="B1 online lesson QR">' +
    '<div><strong>Vollständige Aufgabe online öffnen</strong><p>' + escapeHtml(lessonUrl) + '</p></div></aside></div>';
  return pageHtml({ day, section, title, body });
};

const reading = async (day, lessonUrl, audioQrDataUrl) => {
  const { getB1ReadingTask } = await canonical("b1ReadingTasks.js");
  const task = getB1ReadingTask(day);
  if (!task) throw new Error("B1 Day " + day + ": canonical reading task missing");
  // Some preserved graded workbooks hold the complete reading exercise in
  // their original React lesson, while the central registry only has metadata.
  // The source-controlled print transcription is derived from those exact
  // public passages and question choices; never guess missing exercises.
  const preserved = B1_PRESERVED_READING_PRINT_DATA[day];
  const source = preserved || task.text;
  const paragraphs = preserved?.paragraphs || (typeof source === "string" ? [source] : source?.paragraphs);
  const prompts = preserved?.questions || source?.questions || task.questions;
  if (!Array.isArray(paragraphs) || !paragraphs.length || !Array.isArray(prompts) || !prompts.length) {
    throw new Error("B1 Day " + day + ": full printable reading exercise is required for publication");
  }
  if (paragraphs.some(p => typeof p !== "string" || !p.trim())) {
    throw new Error("B1 Day " + day + ": canonical reading passage is incomplete");
  }
  const body = (preserved ? paragraph(day === 22
    ? "Empfohlene Arbeitszeit: 15 Minuten. Lesen Sie den Text und die Aufgaben 1–3. Welche Lösung (a, b oder c) ist jeweils richtig?"
    : task.instructions) : (task.instructions ? paragraph(task.instructions) : "")) +
    "<h2>" + escapeHtml(preserved?.passageTitle || source?.title || "Lesetext") + "</h2>" +
    paragraphs.map(paragraph).join("") +
    "<h2>" + escapeHtml(source?.questionTitle || "Fragen") + "</h2>" +
    questions(prompts, "B1 Day " + day + " Lesen");
  return pageHtml({ day, section: "Teil 3 · Lesen", title: task.title || "Lesen", body });
};

const listening = async (day, lessonUrl, audioQrDataUrl) => {
  const { getB1ListeningTask } = await canonical("b1ListeningTasks.js");
  const task = getB1ListeningTask(day);
  if (!task || task.status === "unavailable") throw new Error("B1 Day " + day + ": canonical listening task missing");
  const isReadingFallback = task.mode === "reading-fallback";
  const media = Boolean(task.audioKey || task.audioUrl || task.embedUrl || task.externalUrl);
  if (media && (!lessonUrl || !audioQrDataUrl)) throw new Error("B1 Day " + day + ": listening QR is required");
  const audio = media
    ? '<aside style="display:flex;align-items:center;gap:12px;padding:12px;border:1px solid #bfd3eb;background:#eff6ff">' +
      '<img width="90" height="90" src="' + escapeHtml(audioQrDataUrl) + '" alt="B1 lesson audio QR">' +
      '<div><strong>Audio in der Falowen-Lektion</strong><p>QR-Code scannen, anmelden und Teil 4 öffnen.</p>' +
      '<p>' + escapeHtml(lessonUrl) + '</p></div></aside>'
    : "";
  // B1 Day 22 Teil 4 is a second printed reading task, not missing audio.
  // Its three expert views and seven matching statements are taken from the
  // preserved Day 22 workbook, without answer keys.
  if (day === 22 && isReadingFallback) {
    const source = B1_DAY22_SECOND_READING_PRINT_DATA;
    if (source.experts.length !== 3 || source.statements.length !== 7)
      throw new Error("B1 Day 22 Teil 4: incomplete preserved second reading");
    const body = paragraph(source.instructions) +
      "<h2>" + escapeHtml(source.title) + "</h2>" +
      source.experts.map(expert => "<h3>" + escapeHtml(expert.name) + "</h3>" + paragraph(expert.text)).join("") +
      "<h2>Aussagen 1–7</h2>" + paragraph("Welche Person äußert das? Wählen Sie A, B, C oder 0 (passt zu keiner Person).") +
      orderedList(source.statements);
    return pageHtml({ day, section:"Teil 4 · Lesen", title:source.title, body });
  }
  if (!Array.isArray(task.questions) || !task.questions.length) {
    throw new Error("B1 Day " + day + ": full printable Teil 4 exercise is required for publication");
  }
  const body = (task.instructions ? paragraph(task.instructions) : "") +
    audio + "<h2>Fragen</h2>" + questions(task.questions, "B1 Day " + day + " Teil 4");
  // Never embed the raw R2 audio key, transcript, correct answers, or a user session.
  return pageHtml({ day, section: isReadingFallback ? "Teil 4 · Lesen" : "Teil 4 · Hören",
    title: task.title || (isReadingFallback ? "Lesen" : "Hören"), body });
};


/**
 * B1 Day 23 is a three-part graded speaking mock, not a normal tabbed
 * workbook. Print read-only preparation and canonical example topic cards.
 * Never start an attempt, inspect student state, or present sample cards as
 * the actual randomly selected online exam questions.
 */
const b1SpeakingMockPage = async (part, lessonUrl, audioQrDataUrl) => {
  if (!lessonUrl || !audioQrDataUrl) throw new Error("B1 Day 23 print QR to authenticated speaking mock required");
  const [{ speakingQuestionDictionary }, { getB1Days23To28LessonMetadata }] =
    await Promise.all([canonical("speakingDictionary.js"), canonical("b1Days23To28LessonMetadata.js")]);
  const metadata = getB1Days23To28LessonMetadata(23);
  if (!metadata?.goal || !metadata?.instruction) throw new Error("B1 Day 23 canonical speaking mock metadata is missing");
  const parts = [
    ["teil-1", "Gemeinsam etwas planen"],
    ["teil-2", "Ein Thema präsentieren"],
    ["teil-3", "Fragen beantworten"],
  ];
  const samples = parts.map(([id, heading]) => {
    const candidates = speakingQuestionDictionary.filter(item => item.level === "B1" && item.teilId === id);
    if (!candidates.length) throw new Error("B1 Day 23 missing canonical speaking " + id + " prompts");
    const chosen = candidates[0];
    return "<h2>" + escapeHtml(id.replace("teil-", "Teil ")) + " · " + escapeHtml(heading) + "</h2>" +
      paragraph(chosen.topicPrompt || chosen.text) +
      (chosen.keywordSubtopic ? paragraph(chosen.keywordSubtopic) : "") +
      (chosen.hint ? paragraph(chosen.hint) : "");
  }).join("");
  const link = '<aside style="padding:12px;border:1px solid #bfd3eb;background:#eff6ff">' +
    '<img width="90" height="90" src="' + escapeHtml(audioQrDataUrl) + '" alt="Authenticated B1 speaking mock QR">' +
    '<p><strong>Prüfung nur online starten:</strong> ' + escapeHtml(lessonUrl) + '</p></aside>';
  const intro = paragraph(metadata.goal) + paragraph(metadata.instruction) +
    '<p>Dies ist eine Vorbereitung mit Beispielen aus dem Falowen B1-Aufgabenpool. ' +
    'Die benotete Online-Prüfung wählt Aufgaben zufällig aus. ' +
    'Hier wird kein Prüfungsversuch gestartet und keine Leistung bewertet.</p>';
  const body = part === "grammar"
    ? intro + link + "<h2>Prüfungsaufbau</h2>" +
      "<ol><li>Gemeinsam etwas planen</li><li>Ein Thema präsentieren</li><li>Fragen beantworten</li></ol>" +
      "<p>Üben Sie Vorschläge, begründete Meinungen und passende Antworten auf Rückfragen.</p>" + link
    : intro + link + samples + "<h2>Notizen zur Übung</h2>" +
      Array(4).fill("<p>___________________________________________________</p>").join("");
  return pageHtml({ day:23, section:part === "grammar" ? "Grammar · Sprechprüfung vorbereiten" : "Workbook · Sprechprüfung üben",
    title:metadata.title, body });
};

export const getB1PdfLessonCompanionUrl = (route, baseUrl = "https://www.falowen.app") => {
  const origin = new URL(baseUrl);
  const url = new URL(route, baseUrl);
  if (origin.protocol !== "https:" || url.origin !== origin.origin || url.username || url.password ||
      !/^\/campus\/course\/lesson\/B1\/(?:[1-9]|1\d|2[0-8])\/?$/i.test(url.pathname)) {
    throw new Error("B1 PDF audio QR must point to an authenticated Falowen B1 lesson");
  }
  url.search = "";
  url.hash = "";
  return url.toString();
};

export const getB1ReadOnlyParts = async day => {
  day = Number(day);
  if (!Number.isInteger(day) || day < 1 || day > 28) throw new Error("Invalid B1 print day: " + day);
  const [{ getB1WritingTask }, { getB1ReadingTask }, { getB1ListeningTask }, { isB1WritingRequired }] =
    await Promise.all(["b1WritingTasks.js", "b1ReadingTasks.js", "b1ListeningTasks.js", "b1WritingSchedule.js"].map(canonical));
  const listen = getB1ListeningTask(day);
  return [
    ...(isB1WritingRequired(day) && getB1WritingTask(day) ? ["teil-2"] : []),
    ...(getB1ReadingTask(day) ? ["teil-3"] : []),
    ...(listen && listen.status !== "unavailable" ? ["teil-4"] : []),
  ];
};

export async function buildB1ReadOnlyPrintHtml({ day, part, lessonUrl = "", audioQrDataUrl = "" }) {
  day = Number(day);
  if (!Number.isInteger(day) || day < 1 || day > 28) throw new Error("Invalid B1 print day: " + day);
  if (day === 23 && (part === "grammar" || part === "workbook"))
    return b1SpeakingMockPage(part, lessonUrl, audioQrDataUrl);
  switch (part) {
    case "teil-2": return writing(day);
    case "teil-3": return reading(day, lessonUrl, audioQrDataUrl);
    case "teil-4": return listening(day, lessonUrl, audioQrDataUrl);
    default: throw new Error("Missing B1 print companion: " + part);
  }
}
