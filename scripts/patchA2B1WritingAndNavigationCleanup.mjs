import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const writingPath = path.join(root, "web/src/components/B1WritingWorkspace.js");
const navPath = path.join(root, "web/src/components/StandardWorkbookComponents.js");
const a2WorkbookPath = path.join(root, "web/src/components/A2StandardTabbedWorkbookPage.js");
const submissionRuntimePath = path.join(root, "web/src/components/WorkbookSubmissionCaptureRuntime.js");

const writingSource = fs.readFileSync(writingPath, "utf8");
const simpleWorkspace = `export default function B1WritingWorkspace({ writingContext = {} }) {
  const [germanDraft, setGermanDraft] = useState("");
  const level = String(writingContext.level || writingContext.courseLevel || "B1").toUpperCase() === "A2" ? "A2" : "B1";

  return (
    <div data-a2-b1-writing-workspace="standard" style={{ display: "grid", gap: 14 }}>
      <section style={cardStyle} aria-label={\`${"${level}"} German writing\`}>
        <textarea
          aria-label={\`${"${level}"} German writing draft\`}
          value={germanDraft}
          onChange={(event) => setGermanDraft(event.target.value)}
          placeholder={writingContext.draftPlaceholder || "Write your complete German text here..."}
          style={{ ...textareaStyle, minHeight: 260 }}
        />

        <B1InlineWritingAnalyser
          text={germanDraft}
          level={level}
          taskTitle={writingContext.taskTitle || \`${"${level}"} writing task\`}
        />
      </section>
    </div>
  );
}
`;

const writingFunctionStart = writingSource.indexOf("export default function B1WritingWorkspace");
if (writingFunctionStart < 0) {
  throw new Error("Could not find B1WritingWorkspace export for A2/B1 writing cleanup.");
}

let nextWritingSource = `${writingSource.slice(0, writingFunctionStart)}${simpleWorkspace}`;
nextWritingSource = nextWritingSource.replace(
  'import React, { useMemo, useState } from "react";',
  'import React, { useState } from "react";',
);
fs.writeFileSync(writingPath, nextWritingSource);

let a2WorkbookSource = fs.readFileSync(a2WorkbookPath, "utf8");
a2WorkbookSource = a2WorkbookSource.replace(
  '      <A2SecondStageWritingUpgrade day={day} />\n',
  "",
);
fs.writeFileSync(a2WorkbookPath, a2WorkbookSource);

let submissionRuntime = fs.readFileSync(submissionRuntimePath, "utf8");
const activePartAnchor = `  if (!activePartId) return null;\n\n  const isSelfCheck =`;
const silentWritingAnchor = `  if (!activePartId) return null;\n  if (activePartId === "teil2") return null;\n\n  const isSelfCheck =`;
if (!submissionRuntime.includes(silentWritingAnchor)) {
  if (!submissionRuntime.includes(activePartAnchor)) {
    throw new Error("Could not find mapped submission status anchor for silent Teil 2 autosave.");
  }
  submissionRuntime = submissionRuntime.replace(activePartAnchor, silentWritingAnchor);
}
fs.writeFileSync(submissionRuntimePath, submissionRuntime);

let navSource = fs.readFileSync(navPath, "utf8");
navSource = navSource.replace(
  'import React from "react";',
  'import React, { useEffect, useRef } from "react";',
);

const progressAnchor = `  const sectionProgress = effectiveTabs.length
    ? Math.round(((activeIndex + 1) / effectiveTabs.length) * 100)
    : 0;
`;

const navAlignmentBlock = `${progressAnchor}
  const navRef = useRef(null);
  const workbookNavigationKey = legacyGrammarContext
    ? \`${"${legacyGrammarContext.level}"}-${"${legacyGrammarContext.day}"}\`
    : "";

  useEffect(() => {
    if (!workbookNavigationKey || typeof window === "undefined" || !navRef.current) return undefined;

    const alignNavigation = () => {
      navRef.current?.scrollIntoView({ behavior: "auto", block: "start", inline: "nearest" });
    };

    const frame = window.requestAnimationFrame(alignNavigation);
    const settleTimer = window.setTimeout(alignNavigation, 450);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(settleTimer);
    };
  }, [workbookNavigationKey]);
`;

if (!navSource.includes("const workbookNavigationKey = legacyGrammarContext")) {
  if (!navSource.includes(progressAnchor)) {
    throw new Error("Could not find WorkbookTabNav progress anchor for navigation alignment.");
  }
  navSource = navSource.replace(progressAnchor, navAlignmentBlock);
}

if (!navSource.includes('ref={navRef}\n        aria-label={ariaLabel}')) {
  const navAnchor = `      <nav
        aria-label={ariaLabel}`;
  if (!navSource.includes(navAnchor)) {
    throw new Error("Could not find WorkbookTabNav nav element for navigation ref.");
  }
  navSource = navSource.replace(
    navAnchor,
    `      <nav
        ref={navRef}
        aria-label={ariaLabel}`,
  );
}

if (!navSource.includes("scrollMarginTop: 96")) {
  const styleAnchor = `          position: "relative",
          zIndex: 30,`;
  if (!navSource.includes(styleAnchor)) {
    throw new Error("Could not find WorkbookTabNav style anchor for scroll margin.");
  }
  navSource = navSource.replace(
    styleAnchor,
    `          position: "relative",
          scrollMarginTop: 96,
          zIndex: 30,`,
  );
}

fs.writeFileSync(navPath, navSource);

console.log("Simplified A2/B1 Teil 2 writing to task + German text/Analyse, kept Teil 2 autosave silent, removed the extra A2 writing-plan card, and aligned workbook opening to the section navigation.");
