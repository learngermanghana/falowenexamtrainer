import { StandardFonts, rgb } from "pdf-lib";

const navy = rgb(0.05, 0.12, 0.25);
const deepBlue = rgb(0.07, 0.22, 0.43);
const sky = rgb(0.48, 0.76, 0.99);
const white = rgb(1, 1, 1);
const slate = rgb(0.13, 0.27, 0.44);

/**
 * Falowen A1 retail-edition cover. This is separate from buildPressProof:
 * the press proof remains clearly marked NOT FOR SALE when requested.
 */
export const addA1RetailCover = async (pdf) => {
  if (!pdf || typeof pdf.addPage !== "function") throw new Error("PDF document required.");
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const page = pdf.addPage([595.28, 841.89]);
  const width = 595.28, height = 841.89;

  page.drawRectangle({ x: 0, y: 0, width, height, color: navy });
  page.drawRectangle({ x: 0, y: 0, width: 14, height, color: sky });
  page.drawRectangle({ x: 14, y: 0, width: 5, height, color: deepBlue });
  page.drawEllipse({ x: 410, y: 620, xScale: 260, yScale: 260, color: deepBlue, opacity: 0.95 });
  page.drawEllipse({ x: 500, y: 640, xScale: 120, yScale: 120, borderColor: sky, borderWidth: 1.4, borderOpacity: 0.35 });
  page.drawEllipse({ x: 500, y: 640, xScale: 80, yScale: 80, borderColor: sky, borderWidth: 1.2, borderOpacity: 0.22 });

  page.drawText("FALOWEN", { x: 45, y: 754, font: bold, size: 27, color: white });
  page.drawText("GERMAN LANGUAGE LEARNING", { x: 45, y: 700, font: bold, size: 11.2, characterSpacing: 1.6, color: sky });
  page.drawLine({ start: { x: 45, y: 671 }, end: { x: width - 44, y: 671 }, thickness: 0.8, color: sky, opacity: 0.45 });

  page.drawText("DEUTSCH", { x: 42, y: 518, font: bold, size: 72, color: white });
  page.drawText("A1", { x: 39, y: 353, font: bold, size: 160, color: sky });
  page.drawEllipse({ x: 461, y: 405, xScale: 57, yScale: 57, borderColor: sky, borderWidth: 2.8, color: deepBlue });
  page.drawText("CEFR", { x: 430, y: 409, font: bold, size: 17, color: white });
  page.drawText("LEVEL", { x: 426, y: 383, font: regular, size: 13, color: sky });

  page.drawText("Course & Workbook", { x: 45, y: 306, font: bold, size: 29, color: white });
  page.drawText("Clear explanations. Real practice.", { x: 45, y: 274, font: regular, size: 15, color: rgb(0.84, 0.93, 1) });
  page.drawText("Your first steps in German.", { x: 45, y: 250, font: regular, size: 15, color: rgb(0.84, 0.93, 1) });

  page.drawRectangle({ x: 45, y: 134, width: 500, height: 86, color: rgb(0.14, 0.31, 0.51), opacity: 0.96 });
  page.drawText("GRAMMAR  /  VOCABULARY  /  EXERCISES", { x: 66, y: 181, font: bold, size: 15.5, color: white });
  page.drawText("Learn - practise - build confidence", { x: 66, y: 154, font: regular, size: 13, color: rgb(0.79, 0.91, 1) });

  page.drawRectangle({ x: 0, y: 0, width, height: 90, color: white });
  page.drawRectangle({ x: 45, y: 40, width: 118, height: 10, color: rgb(0.09, 0.1, 0.13) });
  page.drawRectangle({ x: 45, y: 28, width: 118, height: 10, color: rgb(0.82, 0.15, 0.19) });
  page.drawRectangle({ x: 45, y: 16, width: 118, height: 10, color: rgb(0.95, 0.74, 0.23) });
  page.drawText("FALOWEN EDITION", { x: 397, y: 32, font: bold, size: 12.5, color: slate });

  pdf.setTitle("Falowen Deutsch A1 - Course & Workbook");
  pdf.setAuthor("Falowen");
  pdf.setSubject("German A1 grammar notes and workbook exercises - 22 printable lesson days");
  pdf.setCreator("Falowen Course Material Bundle");
  return page;
};
