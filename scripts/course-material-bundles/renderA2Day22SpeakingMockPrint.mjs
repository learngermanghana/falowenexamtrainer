import fs from "node:fs";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { speakingQuestionDictionary } from "../../web/src/data/speakingDictionary.js";

// A2 Day 22 is a live, graded speaking mock, not a grammar-and-workbook tab
// lesson. The private offline PDF proof must never start a mock attempt or
// request/print students' answers. These paper cards use the very same local
// prompt dictionary as the live mock; its actual prompts are randomized.
const COLORS = {
  navy: rgb(0.06, 0.14, 0.25),
  teal: rgb(0.10, 0.49, 0.51),
  slate: rgb(0.31, 0.39, 0.47),
  rule: rgb(0.73, 0.78, 0.82),
};
const WIDTH = 595.28;
const HEIGHT = 841.89;
const MARGIN = 54;
const textSafe = value => String(value || "")
  .normalize("NFC")
  .replace(/[\u2018\u2019]/g, "'")
  .replace(/[\u201c\u201d]/g, '"')
  .replace(/[\u2013\u2014]/g, "-")
  .replace(/\u2192/g, "to")
  .replace(/[^\x20-\x7e\xa0-\xff]/g, " ")
  .replace(/\s+/g, " ").trim();

export const a2SpeakingMockCards = () => {
  const sections = ["teil-1", "teil-2", "teil-3"].map(part => ({
    part,
    cards: speakingQuestionDictionary.filter(q =>
      q.level === "A2" && q.teilId === part &&
      String(q.id || "").startsWith("a2-") &&
      String(q.topicPrompt || "").trim()
    ).slice(0, 3).map(q => ({
      id: q.id,
      topic: q.topicPrompt,
      keywords: q.keywordSubtopic || "",
      hint: q.hint || "",
    })),
  }));
  if (sections.some(section => section.cards.length !== 3)) {
    throw new Error("A2 Day 22 speaking dictionary requires three real prompt cards for every Teil.");
  }
  return sections;
};

const wrap = (font, words, size, maxWidth) => {
  const lines = [];
  let line = "";
  for (const word of textSafe(words).split(/\s+/).filter(Boolean)) {
    const trial = line ? line + " " + word : word;
    if (font.widthOfTextAtSize(trial, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = trial;
  }
  if (line) lines.push(line);
  return lines;
};

const writeText = (page, text, y, font, size = 11, color = COLORS.navy, maxWidth = WIDTH - 2 * MARGIN, lineHeight = 17) => {
  for (const line of wrap(font, text, size, maxWidth)) {
    if (y < 48) throw new Error("A2 Day 22 print page overflow. Reduce contents, never clip a speaking task.");
    page.drawText(line, { x: MARGIN, y, size, font, color });
    y -= lineHeight;
  }
  return y;
};
const lines = (page, y, count = 3) => {
  for (let i = 0; i < count; i += 1) {
    y -= 24;
    if (y < 48) throw new Error("A2 Day 22 practice ruled lines overflow.");
    page.drawLine({ start: { x: MARGIN, y }, end: { x: WIDTH - MARGIN, y }, thickness: 0.6, color: COLORS.rule });
  }
  return y - 17;
};
const newPage = (pdf, bold, regular, kicker, title) => {
  const page = pdf.addPage([WIDTH, HEIGHT]);
  page.drawRectangle({ x: 0, y: HEIGHT - 17, width: WIDTH, height: 17, color: COLORS.teal });
  page.drawText("FALOWEN | DEUTSCH A2 | DAY 22", { x: MARGIN, y: 780, size: 12, font: bold, color: COLORS.teal });
  page.drawText(textSafe(kicker), { x: MARGIN, y: 751, size: 10, font: regular, color: COLORS.slate });
  const afterTitle = writeText(page, title, 714, bold, 23, COLORS.navy, WIDTH - 2 * MARGIN, 27);
  return { page, y: afterTitle - 19 };
};

export const renderA2Day22SpeakingMockPrint = async ({ lesson, renderDir }) => {
  if (!lesson || Number(lesson.day) !== 22 ||
    !/Goethe A2 Speaking Mock/i.test(String(lesson.title || "")) ||
    !/a2-day-22-die-woche-planung-workbook/i.test(String(lesson.route || ""))) {
    throw new Error("Unexpected A2 Day 22 curriculum route: do not print a substitute lesson.");
  }
  const cards = a2SpeakingMockCards();
  fs.mkdirSync(renderDir, { recursive: true });

  const grammar = await PDFDocument.create();
  const font = await grammar.embedFont(StandardFonts.Helvetica);
  const bold = await grammar.embedFont(StandardFonts.HelveticaBold);
  let { page, y } = newPage(grammar, bold, font, "SPEAKING SUPPORT | NO NEW GRAMMAR LESSON", "Goethe A2 Speaking Mock - Preparation");
  y = writeText(page, "This day is a graded live speaking mock in Falowen, not a normal Grammar and Workbook lesson. The notes below are paper-based speaking support. They do not replace the online exam or provide an AI score.", y, font, 11) - 18;
  y = writeText(page, "Teil 1: Fragen zur Person", y, bold, 14, COLORS.teal) - 8;
  y = writeText(page, "Ask and answer short everyday questions. Give a direct answer, then one detail. Useful expressions: Ich wohne in ... / Ich arbeite als ... / In meiner Freizeit ...", y, font, 11) - 20;
  y = writeText(page, "Teil 2: Von sich erzaehlen", y, bold, 14, COLORS.teal) - 8;
  y = writeText(page, "Speak about a familiar topic. Use a clear beginning, two or three points and a short ending. Connectors: zuerst, dann, ausserdem, weil, deshalb, zum Beispiel.", y, font, 11) - 20;
  y = writeText(page, "Teil 3: Gemeinsam etwas planen", y, bold, 14, COLORS.teal) - 8;
  y = writeText(page, "Plan something with a partner. Make suggestions, ask what they think, respond politely and agree on a concrete decision. Useful phrases: Wir koennten ... / Was haeltst du davon? / Das ist eine gute Idee. / Dann machen wir das so.", y, font, 11) - 24;
  y = writeText(page, "Printed speaking cards: practice examples from Falowen\'s A2 prompt dictionary. The online live examiner chooses tasks separately and marks spoken answers only inside Falowen.", y, font, 10, COLORS.slate);
  const grammarFile = path.join(renderDir, "22-grammar.pdf");
  fs.writeFileSync(grammarFile, await grammar.save());

  const workbook = await PDFDocument.create();
  const regular = await workbook.embedFont(StandardFonts.Helvetica);
  const strong = await workbook.embedFont(StandardFonts.HelveticaBold);
  const details = [
    { name: "Teil 1 - Fragen zur Person", instruction: "With a partner: ask a short question on each card, answer in full sentences and add one detail. Write useful answer words on the lines.", answer: 3 },
    { name: "Teil 2 - Von sich erzaehlen", instruction: "Choose one card and speak for about a minute using the keywords. Practise a clear beginning, details and a short ending. Write keywords, not a memorized script.", answer: 3 },
    { name: "Teil 3 - Gemeinsam etwas planen", instruction: "With a partner: make suggestions, compare options, agree on when and where, and finish with a shared plan. Use the cards as conversation topics.", answer: 3 },
  ];
  for (const [index, section] of cards.entries()) {
    const d = details[index];
    let { page: exercise, y: top } = newPage(workbook, strong, regular, "WORKBOOK | PRINTABLE SPOKEN PRACTICE", d.name);
    top = writeText(exercise, d.instruction, top, regular, 11) - 14;
    for (const [n, card] of section.cards.entries()) {
      top = writeText(exercise, "Card " + (n + 1) + ": " + card.topic, top, strong, 12, COLORS.teal) - 5;
      if (card.keywords) top = writeText(exercise, "Keywords: " + card.keywords, top, regular, 10) - 4;
      if (card.hint) top = writeText(exercise, "Hint: " + card.hint, top, regular, 10) - 4;
      top = lines(exercise, top, d.answer);
    }
    writeText(exercise, "Paper speaking preparation only - no recording, grading, result or certified exam is included in this PDF.", top, regular, 9, COLORS.slate);
  }
  const workbookFile = path.join(renderDir, "22-workbook.pdf");
  fs.writeFileSync(workbookFile, await workbook.save());
  return [{ tab: "grammar", file: grammarFile }, { tab: "workbook", file: workbookFile }];
};
