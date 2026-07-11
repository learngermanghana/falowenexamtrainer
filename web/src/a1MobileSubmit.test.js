import fs from "fs";
import path from "path";

const readSource = (relativePath) =>
  fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("A1 mobile submit text visibility", () => {
  test("loads the course-wide A1 mobile stylesheet from the production entry point", () => {
    const entrySource = readSource("index.js");

    expect(entrySource).toContain('import "./a1MobileSubmit.css";');
  });

  test("keeps typed and composing text visible in every shared A1 submission textarea", () => {
    const cssSource = readSource("a1MobileSubmit.css");

    expect(cssSource).toContain("[data-persistent-assignment-submission] textarea");
    expect(cssSource).toContain('[class^="a1-tutor-marked-submit-"] textarea');
    expect(cssSource).toContain("-webkit-appearance: none !important;");
    expect(cssSource).toContain("background-color: #ffffff !important;");
    expect(cssSource).toContain("color: #111827 !important;");
    expect(cssSource).toContain("-webkit-text-fill-color: #111827 !important;");
    expect(cssSource).toContain("caret-color: #111827 !important;");
    expect(cssSource).toContain("opacity: 1 !important;");
    expect(cssSource).toContain("visibility: visible !important;");
    expect(cssSource).toContain("textarea:focus");
    expect(cssSource).toContain("textarea::placeholder");
  });

  test("uses mobile-safe input and composition fallbacks for the submit textarea", () => {
    const source = readSource("components/AssignmentSubmissionPage.js");

    expect(source).toContain('onInput={(event) => syncTextFieldValue("submissionText", event.currentTarget.value)}');
    expect(source).toContain('onCompositionEnd={(event) => syncTextFieldValue("submissionText", event.currentTarget.value)}');
    expect(source).toContain('inputMode="text"');
    expect(source).toContain('autoCorrect="off"');
    expect(source).toContain('spellCheck={false}');
  });

  test("keeps Day 11 Understanding Time on the shared A1 shell with canonical assignment A1-7", () => {
    const day11Source = readSource("components/A1Day11UnderstandingTimeWorkbookPage.js");

    expect(day11Source).toContain('import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell";');
    expect(day11Source).toContain("<A1TutorMarkedWorkbookShell");
    expect(day11Source).toContain("day={11}");
    expect(day11Source).toContain('chapter="7"');
    expect(day11Source).toContain('fallbackAssignmentKey="A1-7"');
  });
});
