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
