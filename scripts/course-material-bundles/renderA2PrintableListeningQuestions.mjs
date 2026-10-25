import fs from "node:fs";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { getA2ListeningTask, A2_LISTENING_MODES } from "../../web/src/data/a2ListeningTasks.js";

// Paper-only export of canonical questions when live, protected Hören widgets
// cannot safely be printed. This never requests signed audio or grades work.
const A4 = [595.28, 841.89];
const M = 49;
const navy = rgb(0.07, 0.16, 0.28);
const teal = rgb(0.08, 0.44, 0.46);
const pale = rgb(0.74, 0.80, 0.85);
const safe = text => String(text || "").normalize("NFC")
  .replace(/[\u2018\u2019]/g, "'")
  .replace(/[\u201c\u201d]/g, '"')
  .replace(/[\u2013\u2014]/g, "-")
  .replace(/\u2192/g, " to ")
  .replace(/[^\x20-\x7e\xa0-\xff]/g, " ")
  .replace(/\s+/g, " ").trim();
const wrap = (text, font, size, width) => {
  const lines = []; let pending = "";
  for (const word of safe(text).split(/\s+/).filter(Boolean)) {
    const candidate = pending ? pending + " " + word : word;
    if (pending && font.widthOfTextAtSize(candidate, size) > width) {
      lines.push(pending); pending = word;
    } else pending = candidate;
  }
  if (pending) lines.push(pending);
  return lines;
};
export const a2PrintableListeningQuestions = day => {
  const task = getA2ListeningTask(day);
  if (!task || task.mode === A2_LISTENING_MODES.NONE ||
      !Array.isArray(task.questions) || task.questions.length < 3 ||
      task.questions.some(q => !q.stem || !Array.isArray(q.options) || q.options.length < 2)) {
    throw new Error("No complete canonical A2 Hören questions for Day " + day);
  }
  return task;
};

export const renderA2PrintableListeningQuestions = async ({ lesson, renderDir }) => {
  const day = Number(lesson?.day);
  if (!Number.isInteger(day) || day < 24 || day > 28) {
    throw new Error("Late-course A2 print-only Hören supports Days 24–28 only.");
  }
  const route = String(lesson?.route || "").split("?")[0];
  if (!new RegExp("^/campus/course/a2-day-" + day + "-.+-workbook$").test(route)) {
    throw new Error("Unexpected A2 Day " + day + " source route: do not substitute a listening lesson.");
  }
  const task = a2PrintableListeningQuestions(day);
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const strong = await pdf.embedFont(StandardFonts.HelveticaBold);
  let page, y;
  const beginPage = () => {
    page = pdf.addPage(A4); y = 785;
    page.drawRectangle({ x: 0, y: A4[1] - 12, width: A4[0], height: 12, color: teal });
    page.drawText("FALOWEN A2 | DAY " + day + " | HOEREN", { x: M, y, font: strong, size: 13, color: teal });
    y -= 31;
  };
  const put = (message, { size = 11, bold = false, indent = 0, color = navy, after = 5 } = {}) => {
    const target = bold ? strong : font;
    for (const line of wrap(message, target, size, A4[0] - 2 * M - indent)) {
      if (y < 62) beginPage();
      page.drawText(line, { x: M + indent, y, font: target, size, color });
      y -= size + 5;
    }
    y -= after;
  };
  beginPage();
  put("Listening practice - printable question sheet", { size: 18, bold: true, after: 12 });
  put("These are the published Falowen A2 Day " + day + " listening questions. The audio recording is not embedded in this PDF; protected playback may require a separate active Falowen Course Book account.", { size: 10, after: 13 });
  put(task.task || "Listen to the lesson recording and answer each question.", { size: 11, after: 15 });
  for (const [i, question] of task.questions.entries()) {
    put((i + 1) + ". " + question.stem, { size: 11.5, bold: true, after: 3 });
    for (const option of question.options) put(option, { size: 10.5, indent: 16, after: 2 });
    if (y < 62) beginPage();
    page.drawLine({start:{x:M,y:y-2},end:{x:A4[0]-M,y:y-2},color:pale,thickness:0.5});
    y -= 19;
  }
  put("Mark your answers on paper. This printed practice does not start a timed online attempt or submit a score.", { size: 9, color:teal, after: 0 });
  fs.mkdirSync(renderDir, { recursive: true });
  const file = path.join(renderDir, String(day).padStart(2,"0") + "-workbook-teil-4.pdf");
  fs.writeFileSync(file, await pdf.save());
  return { tab: "workbook-teil-4", file };
};
