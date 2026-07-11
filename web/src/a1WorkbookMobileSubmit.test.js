import fs from "fs";
import path from "path";

const readSource = (relativePath) => fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("A1 mobile workbook submission", () => {
  test("loads the A1 mobile submit stylesheet from the production entry point", () => {
    expect(readSource("index.js")).toContain('import "./a1WorkbookMobileSubmit.css";');
  });

  test("uses the same responsive two-column tab grid pattern as A2", () => {
    const css = readSource("a1WorkbookMobileSubmit.css");

    expect(css).toContain('[data-a1-workbook-submission-mount] [role="tablist"]');
    expect(css).toContain("grid-template-columns: repeat(2, minmax(0, 1fr)) !important;");
    expect(css).toContain('[data-a1-workbook-submission-mount] [role="tab"]');
    expect(css).toContain("width: 100% !important;");
    expect(css).toContain("min-width: 0 !important;");
  });

  test("keeps the submit textarea editable on Android and iPhone browsers", () => {
    const css = readSource("a1WorkbookMobileSubmit.css");

    expect(css).toContain("-webkit-appearance: none !important;");
    expect(css).toContain("-webkit-text-fill-color: #111827 !important;");
    expect(css).toContain("caret-color: #111827 !important;");
    expect(css).toContain("pointer-events: auto !important;");
    expect(css).toContain("touch-action: manipulation !important;");
    expect(css).toContain("textarea::placeholder");
    expect(css).toContain("textarea:focus");
  });

  test("prepares assignment context before mounting the mobile form", () => {
    const source = readSource("components/WorkbookInlineEnhancements.jsx");

    expect(source).toContain("isA1SubmissionContextReady");
    expect(source).toContain('nextSearch.set("assignmentKey", submissionAssignmentKey);');
    expect(source).toContain('nextSearch.set("assignmentId", submissionAssignmentKey);');
    expect(source).toContain('nextSearch.set("level", "A1");');
    expect(source).toContain("!submissionContextReady");
    expect(source).toContain('mountedNode.setAttribute("data-submit-context-ready", "true");');
  });

  test("keeps assignment selectors visible as a mobile fallback and provides opt-in diagnostics", () => {
    const css = readSource("a1WorkbookMobileSubmit.css");
    const source = readSource("components/WorkbookInlineEnhancements.jsx");

    expect(css).toContain(".course-book-tab-submission-page select");
    expect(css).toContain("display: block !important;");
    expect(source).toContain('get("submitDebug") === "1"');
    expect(source).toContain("A1 Submit Debug");
    expect(source).toContain("textareaDisabled");
    expect(source).toContain("inputEvents");
  });
});
