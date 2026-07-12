import fs from "fs";
import path from "path";

const readComponent = (fileName) => fs.readFileSync(path.join(__dirname, fileName), "utf8");

test("both C1 page implementations use the shared writing cheat sheet component", () => {
  const compactSource = readComponent("CompactC1LessonPage.js");
  const standardSource = readComponent("StandardFourStageLessonPageV3.js");

  expect(compactSource).toContain("import WritingCheatSheetTabs from \"./WritingCheatSheetTabs\"");
  expect(compactSource).toContain("<WritingCheatSheetTabs level={lesson.level} day={lesson.day}>");
  expect(standardSource).toContain("import WritingCheatSheetTabs from \"./WritingCheatSheetTabs\"");
  expect(standardSource).toContain("<WritingCheatSheetTabs level={lesson.level} day={lesson.day}>");
  expect(compactSource).not.toContain("C1_DAY3_WRITING_CHEAT_SHEET");
});

test("the mapped B2 Day 1 and C1 Days 8 to 9 pages use the shared writing video dictionary", () => {
  const b2Source = readComponent("B2Day1To4GuidedLessonPage.js");
  const c1Source = readComponent("C1Day8To10GuidedLessonPage.js");

  expect(b2Source).toContain("import WritingCheatSheetTabs from \"./WritingCheatSheetTabs\"");
  expect(b2Source).toContain("<WritingCheatSheetTabs level=\"B2\" day={day}>");
  expect(c1Source).toContain("import WritingCheatSheetTabs from \"./WritingCheatSheetTabs\"");
  expect(c1Source).toContain("<WritingCheatSheetTabs level=\"C1\" day={day}>");
});
