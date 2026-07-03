const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");

const replaceOnce = (relativePath, before, after, label) => {
  const filePath = path.join(repoRoot, relativePath);
  const source = fs.readFileSync(filePath, "utf8");
  const first = source.indexOf(before);
  if (first < 0) {
    throw new Error(`${label}: expected source block was not found in ${relativePath}`);
  }
  if (source.indexOf(before, first + before.length) >= 0) {
    throw new Error(`${label}: source block was not unique in ${relativePath}`);
  }
  fs.writeFileSync(
    filePath,
    `${source.slice(0, first)}${after}${source.slice(first + before.length)}`,
    "utf8",
  );
};

const writingPage = "web/src/components/WritingPage.js";
replaceOnce(
  writingPage,
  'import WritingLibraryTab from "./WritingLibraryTab";\nimport {',
  'import WritingLibraryTab from "./WritingLibraryTab";\nimport PrepositionCaseCoachField from "./PrepositionCaseCoachField";\nimport {',
  "WritingPage coach import",
);
replaceOnce(
  writingPage,
  "  const markDraftRef = useRef(null);\n  const ideasPromptRef = useRef(null);",
  "  const markDraftRef = useRef(null);\n  const revisedDraftRef = useRef(null);\n  const ideasPromptRef = useRef(null);",
  "WritingPage revised draft ref",
);
replaceOnce(
  writingPage,
  `              style={styles.textArea}\n              rows={9}\n            />\n            <SpecialCharacterRow`,
  `              style={styles.textArea}\n              rows={9}\n            />\n            <PrepositionCaseCoachField\n              text={typedAnswer}\n              level={level}\n              textareaRef={markDraftRef}\n              studentProfile={studentProfile}\n            />\n            <SpecialCharacterRow`,
  "WritingPage main field coach",
);
replaceOnce(
  writingPage,
  `                  <textarea\n                    value={revisedDraftText}`,
  `                  <textarea\n                    ref={revisedDraftRef}\n                    value={revisedDraftText}`,
  "WritingPage revised textarea ref",
);
replaceOnce(
  writingPage,
  `                    style={styles.textArea}\n                    rows={9}\n                  />\n\n                  <p style={{ ...styles.helperText, marginBottom: 0 }}>`,
  `                    style={styles.textArea}\n                    rows={9}\n                  />\n                  <PrepositionCaseCoachField\n                    text={revisedDraftText}\n                    level={level}\n                    textareaRef={revisedDraftRef}\n                    studentProfile={studentProfile}\n                  />\n\n                  <p style={{ ...styles.helperText, marginBottom: 0 }}>`,
  "WritingPage revised field coach",
);

const guidedWorkspace = "web/src/components/GuidedWritingWorkspace.js";
replaceOnce(
  guidedWorkspace,
  'import WritingFeedbackCard from "./WritingFeedbackCard";\nimport { normalizeWritingFeedback }',
  'import WritingFeedbackCard from "./WritingFeedbackCard";\nimport PrepositionCaseCoachField from "./PrepositionCaseCoachField";\nimport { normalizeWritingFeedback }',
  "Guided workspace coach import",
);
replaceOnce(
  guidedWorkspace,
  "  const reachedMilestonesRef = useRef(new Set());\n  const userId = user?.uid || \"\";",
  "  const reachedMilestonesRef = useRef(new Set());\n  const questionTextareaRefs = useRef({});\n  const combinedDraftRef = useRef(null);\n  const userId = user?.uid || \"\";",
  "Guided workspace textarea refs",
);
replaceOnce(
  guidedWorkspace,
  `            <textarea\n              aria-label={\`Question \${index + 1}\`}`,
  `            <textarea\n              ref={(node) => {\n                if (node) questionTextareaRefs.current[question.id] = node;\n                else delete questionTextareaRefs.current[question.id];\n              }}\n              aria-label={\`Question \${index + 1}\`}`,
  "Guided question textarea ref",
);
replaceOnce(
  guidedWorkspace,
  `              }}\n            />\n            <div style={{ display: "grid", gap: 6 }}>`,
  `              }}\n            />\n            <PrepositionCaseCoachField\n              text={state.answers[question.id] || ""}\n              level={config.level}\n              getTextarea={() => questionTextareaRefs.current[question.id] || null}\n              studentProfile={studentProfile}\n            />\n            <div style={{ display: "grid", gap: 6 }}>`,
  "Guided question coach",
);
replaceOnce(
  guidedWorkspace,
  `        <textarea\n          aria-label="Your combined text"`,
  `        <textarea\n          ref={combinedDraftRef}\n          aria-label="Your combined text"`,
  "Guided combined textarea ref",
);
replaceOnce(
  guidedWorkspace,
  `          }}\n        />\n        <div>\n          <strong>{countWords(finalEssay)} words</strong>`,
  `          }}\n        />\n        <PrepositionCaseCoachField\n          text={finalEssay}\n          level={config.level}\n          textareaRef={combinedDraftRef}\n          studentProfile={studentProfile}\n        />\n        <div>\n          <strong>{countWords(finalEssay)} words</strong>`,
  "Guided combined coach",
);

const routeServices = "web/src/components/RouteScopedAppServices.js";
replaceOnce(
  routeServices,
  'import PrepositionCaseCoachInjector from "./PrepositionCaseCoachInjector";\n',
  "",
  "Remove injector import",
);
replaceOnce(
  routeServices,
  "      <PrepositionCaseCoachInjector />\n",
  "",
  "Remove injector render",
);

const autoWorkbook = "web/src/components/AutoWorkbookStartGuide.js";
replaceOnce(
  autoWorkbook,
  "  A1_DAY18_CHAPTER121_PATH,\n  A1_DAY18_CHAPTER122_WORKBOOK_PATH,",
  "  A1_DAY18_CHAPTER121_PATH,\n  A1_DAY18_CHAPTER122_GRAMMAR_PATH,\n  A1_DAY18_CHAPTER122_WORKBOOK_PATH,",
  "Support chapter 12.2 self-managed workbook view",
);
replaceOnce(
  autoWorkbook,
  "  if (normalizedPathname === A1_DAY18_CHAPTER122_GRAMMAR_PATH) return false;",
  "  if (normalizedPathname === A1_DAY18_CHAPTER122_GRAMMAR_PATH) return requestedView === \"workbook\";",
  "Render chapter 12.2 workbook query view",
);
replaceOnce(
  autoWorkbook,
  "  if (normalizedPathname === A1_DAY18_CHAPTER122_WORKBOOK_PATH) return <A1Day18Kapitel122WorkbookPage />;",
  "  if (\n    normalizedPathname === A1_DAY18_CHAPTER122_WORKBOOK_PATH\n    || (normalizedPathname === A1_DAY18_CHAPTER122_GRAMMAR_PATH\n      && new URLSearchParams(search || \"\").get(\"view\") === \"workbook\")\n  ) return <A1Day18Kapitel122WorkbookPage />;",
  "Mount chapter 12.2 workbook page",
);

execFileSync(process.execPath, [path.join(repoRoot, "scripts/syncCurriculumManifest.js")], {
  cwd: repoRoot,
  stdio: "inherit",
});

for (const temporaryPath of [
  "scripts/applyCiAndDirectCoachUpdate.js",
  ".github/workflows/apply-ci-direct-coach.yml",
]) {
  const absolutePath = path.join(repoRoot, temporaryPath);
  if (fs.existsSync(absolutePath)) fs.unlinkSync(absolutePath);
}

console.log("Direct writing coach integration, workbook route fix, and curriculum regeneration completed.");
