import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const a1Data = readFileSync(new URL("../web/src/data/swahili/a1PracticeUnits.js", import.meta.url), "utf8");
const a1Workbook = readFileSync(new URL("../web/src/components/SwahiliA1PracticeWorkbook.jsx", import.meta.url), "utf8");
const b1Workbook = readFileSync(new URL("../web/src/components/SwahiliB1Day28Workbook.jsx", import.meta.url), "utf8");

test("A1 Day 10 workbook uses the supplied Sokoni AI video and separate Falowen Radio podcast", () => {
  const a1Day10 = a1Data.slice(a1Data.indexOf('  "10": {'), a1Data.indexOf('  "11": {'));
  assert.match(a1Day10, /"aiLecture": \{/);
  assert.match(a1Day10, /"youtubeId": "xLN5QX669JA"/);
  assert.match(a1Day10, /"radio": \{/);
  assert.match(a1Day10, /"youtubeId": "4_ygEiW5QjI"/);
  assert.match(a1Workbook, /youtube-nocookie\.com\/embed\/\$\{aiLecture\.youtubeId\}/);
  assert.match(a1Workbook, /youtube-nocookie\.com\/embed\/\$\{radio\.youtubeId\}/);
  assert.match(a1Workbook, /listening\.audioUrlEndpoint/);
});

test("B1 Day 28 learner workbook embeds the exact supplied AI video without replacing Radio", () => {
  assert.match(b1Workbook, /<h2>Video ya AI · Kutunza Mazingira<\/h2>/);
  assert.match(b1Workbook, /src="https:\/\/www\.youtube-nocookie\.com\/embed\/kcqRGi5KLMs"/);
  assert.match(b1Workbook, /href="https:\/\/youtu\.be\/kcqRGi5KLMs"/);
  assert.ok(b1Workbook.indexOf("Video ya AI · Kutunza Mazingira") < b1Workbook.lastIndexOf("<WorkbookTabNav"),
    "AI video must appear above the lesson tabs");
  assert.match(b1Workbook, /youtubeId: "aeXVw4Q4olE"/);
  assert.match(b1Workbook, /<RadioFirstWorkbookGate /);
  assert.match(b1Workbook, /<SwahiliB1Day28Listening /);
});

test("B1 Day 28 keeps its teacher lecture separate from AI video and radio", () => {
  assert.match(b1Workbook, /type: "teacher-lecture"/);
  assert.match(b1Workbook, /url: "https:\/\/youtu\.be\/6AvbuULcCeg"/);
  assert.match(b1Workbook, /<TeacherLectureSupportingMaterials language="sw" lesson=\{\{ teacherVideo: teacherLecture \}\} \/>/);
  assert.ok(b1Workbook.indexOf("<TeacherLectureSupportingMaterials") > b1Workbook.indexOf('src="https://www.youtube-nocookie.com/embed/kcqRGi5KLMs"'));
  assert.ok(b1Workbook.indexOf("<TeacherLectureSupportingMaterials") < b1Workbook.lastIndexOf("<WorkbookTabNav"));
  assert.doesNotMatch(b1Workbook, /embed\/6AvbuULcCeg/);
});
