import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(scriptDir, "../../web/src/data");
const canonical = async (filename) => {
  const source = fs.readFileSync(path.join(dataDir, filename), "utf8");
  if (/^\s*import\s/m.test(source)) throw new Error("Print source is not standalone: " + filename);
  return import("data:text/javascript;base64," + Buffer.from(source).toString("base64"));
};
const esc = (s) => String(s ?? "").replace(/Falowen\s+Radio/gi, "pre-lesson audio")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;")
  .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const paragraph = (s) => "<p>" + esc(s) + "</p>";
const list = (xs) => "<ol>" + xs.map(s => "<li>" + esc(s) + "</li>").join("") + "</ol>";
const questions = (xs) => "<ol class=\"questions\">" + xs.map(q =>
  "<li><strong>" + esc(q.stem || q.text || "") + "</strong>" +
  (q.options?.length ? list(q.options) : "") + "</li>").join("") + "</ol>";
const html = ({ day, chapter, section, title, intro, body, footer }) => {
  if (!body || body.replace(/<[^>]*>/g, "").trim().length < 90)
    throw new Error("A2 Day " + day + " " + section + ": printable content is incomplete");
  return '<!doctype html><html lang="de"><head><meta charset="utf-8"><style>' +
    '@page{size:A4;margin:15mm 15mm 17mm}html,body{color:#172033;font:12pt/1.5 Arial,sans-serif}' +
    'h1{font-size:22pt}h2{font-size:16pt;margin-top:18px}li{margin:7px 0;break-inside:avoid}' +
    'p{white-space:pre-wrap}.reading{white-space:pre-wrap;line-height:1.6;padding:15px;border:1px solid #cbd5e1}' +
    'header{border-bottom:2px solid #1d4ed8;padding-bottom:10px}.hint{background:#eff6ff;padding:12px}' +
    'footer{border-top:1px solid #ddd;margin-top:22px;padding-top:9px;color:#475569;font-size:9pt}' +
    '</style></head><body><header><strong>FALOWEN · A2 COURSE BOOK · DAY ' + day + '</strong>' +
    '<h1>' + esc(title) + '</h1><div>Kapitel ' + esc(chapter || "—") + ' · ' + esc(section) + '</div></header>' +
    (intro ? '<div class="hint">' + paragraph(intro) + '</div>' : '') +
    '<main>' + body + '</main><footer>' + esc(footer ||
      'Read-only printed practice. Submit graded coursework in Falowen.') + '</footer></body></html>';
};
const writing = async (day) => {
  const { getA2GoetheWritingTask } = await canonical("a2GoetheWritingTasks.js");
  const t = getA2GoetheWritingTask(day);
  if (!t?.situation || !Array.isArray(t.points) || t.points.length < 2)
    throw new Error("A2 Day " + day + ": canonical writing task missing");
  return html({ day, chapter:t.assignmentKey, section:"Teil 2 · Schreiben", title:t.title,
    intro:"Schreiben Sie Ihre Antwort auf Papier. Diese Seite startet keine benotete Prüfung.",
    body:paragraph(t.situation) + "<h2>Bearbeiten Sie alle Punkte</h2>" + list(t.points) +
      "<h2>Ihre Antwort</h2>" + "<p>_____________________________________________________________</p>".repeat(6) });
};
const reading = async (day) => {
  const { getA2ReadingTask } = await canonical("a2ReadingTasks.js");
  const t = getA2ReadingTask(day);
  if (!t?.text || !t.questions?.length)
    throw new Error("A2 Day " + day + ": canonical reading task missing");
  return html({day,chapter:t.chapter,section:"Teil 3 · Lesen",title:t.title,
    intro:t.strategy,
    body:"<h2>Lesetext</h2><div class=\"reading\">" + esc(t.text) + "</div><h2>Fragen</h2>" + questions(t.questions)});
};
const listening = async (day, lessonUrl, audioQrDataUrl) => {
  const { getA2ListeningTask } = await canonical("a2ListeningTasks.js");
  const t = getA2ListeningTask(day);
  if (!t || t.mode === "none" || (!t.audioUrl && !t.audioKey) ||
    (!t.task && !t.questions?.length))
    throw new Error("A2 Day " + day + ": canonical Hören material missing");
  // Reuse the A1 retail-book convention. The QR opens a stable authenticated
  // lesson; never print signed R2 URLs, storage keys or tokenized media links.
  const audioCallout = lessonUrl && audioQrDataUrl
    ? '<aside data-a2-pdf-audio-companion="true" style="display:flex;align-items:center;gap:12px;padding:12px;background:#eff6ff;border:1px solid #bfd3eb;border-radius:8px;break-inside:avoid">' +
      '<img src="' + esc(audioQrDataUrl) + '" width="90" height="90" alt="A2 Hören audio QR">' +
      '<div><strong>Hören · Audio im Falowen Course Book</strong>' +
      '<p>Scan the QR code, log in and open Teil 4 · Hören.</p>' +
      '<a href="' + esc(lessonUrl) + '">' + esc(lessonUrl) + '</a></div></aside>'
    : '<p>Hören-Audio: Im Falowen Course Book anmelden und Teil 4 öffnen.</p>';
  return html({day,chapter:t.chapter,section:"Teil 4 · Hören",title:"Hörverstehen",
    intro:"Die Audiodatei ist nicht im PDF. Verwenden Sie die Falowen-Lektion zum Anhören.",
    body:paragraph(t.task) + "<h2>Audio</h2>" + audioCallout +
      (t.questions?.length ? "<h2>Fragen</h2>" + questions(t.questions) :
        paragraph("Selbstkontrolle: Hören Sie die Übung in Falowen und kontrollieren Sie dort die Antworten.")) });
};
const speaking = async (day, lesson) => html({
  day,chapter:"",section:"Teil 1 · Sprechen",title:lesson.title,
  intro:"Mündliche Übung. Keine Sprachaufnahme und keine Benotung.",
  body:"<h2>Übung: " + esc(lesson.title) + "</h2>" + list([
    "Stellen Sie das Thema vor und nennen Sie zwei Details.",
    "Erzählen Sie von Ihrer eigenen Erfahrung.",
    "Begründen Sie Ihre Meinung mit weil, denn oder deshalb.",
    "Stellen Sie Ihrem Partner eine Rückfrage und reagieren Sie."
  ])
});
const PARTS = [
  {n:1,title:"Fragen zur Person",hint:"Antworten Sie kurz und stellen Sie eine Rückfrage."},
  {n:2,title:"Von sich erzählen",hint:"Beschreiben Sie Ihr Thema mit Einleitung, Beispielen und Schluss."},
  {n:3,title:"Gemeinsam etwas planen",hint:"Machen Sie Vorschläge und reagieren Sie höflich auf Ihren Partner."},
];
const speakingMock = async (part) => {
  const { speakingQuestionDictionary } = await canonical("speakingDictionary.js");
  const tasks = PARTS.map(p => {
    const prompts = speakingQuestionDictionary.filter(q => q.level === "A2" &&
      Number(String(q.teilId || q.teilLabel).match(/[1-3]/)?.[0]) === p.n).slice(0, 3);
    if (!prompts.length) throw new Error("A2 Day 22: missing Teil " + p.n + " speaking prompts");
    return { ...p, prompts };
  });
  if (part === "grammar") return html({day:22,chapter:"8.22",section:"Grammar · Sprechhilfen",
    title:"Sprechen: Satzbau und Redemittel",
    intro:"Teacher-review companion; keine benotete Sprechprüfung oder Aufnahme.",
    body:"<h2>Fragen und Sätze</h2>" + list([
      "Wo wohnen Sie? Was machen Sie beruflich? Warum lernen Sie Deutsch?",
      "Im Hauptsatz steht das Verb an zweiter Stelle: Ich lerne heute Deutsch.",
      "Bei weil steht das Verb am Ende: Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte.",
      "Vorschläge: Wir könnten ... / Wollen wir ...? / Ich schlage vor, dass ...",
      "Reaktionen: Das ist eine gute Idee. / Vielleicht lieber ... / Einverstanden!"
    ])+"<h2>Vorbereitung</h2>"+paragraph("Stellen Sie Rückfragen, begründen Sie Ihre Vorschläge und hören Sie aufmerksam zu."),
    footer:"Supplementary teacher-review practice, not a graded speaking result."});
  if (part === "workbook") return html({day:22,chapter:"8.22",section:"Workbook · Goethe A2 Sprechen",
    title:"Mündliche Prüfung · Übungsaufgaben",
    intro:"Ausgewählte Aufgaben aus dem Falowen A2 Sprechfragen-Wörterbuch. Die benotete Prüfung findet nur online statt.",
    body:tasks.map(p => "<section><h2>Teil " + p.n + " · " + esc(p.title) + "</h2>" +
      paragraph(p.hint) + list(p.prompts.map(q => [q.topicPrompt || q.text, q.keywordSubtopic, q.hint]
        .filter(Boolean).join(" · "))) + "</section>").join(""),
    footer:"Selected static practice questions, no recording or student data."});
  throw new Error("A2 Day 22 only supports grammar/workbook static sections");
};
export async function buildA2ReadOnlyPrintHtml({day, part, lesson = {}, lessonUrl = "", audioQrDataUrl = ""}) {
  day = Number(day);
  if (!Number.isInteger(day) || day < 1 || day > 28)
    throw new Error("Invalid A2 print day: " + day);
  if (day === 22) return speakingMock(part);
  switch (part) {
    case "teil-1": return speaking(day, lesson);
    case "teil-2": return writing(day);
    case "teil-3": return reading(day);
    case "teil-4": return listening(day, lessonUrl, audioQrDataUrl);
    default: throw new Error("Missing A2 print companion: " + part);
  }
}
