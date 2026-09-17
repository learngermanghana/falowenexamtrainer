import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const writingPath = path.join(root, "web/src/components/B1WritingWorkspace.js");
const navPath = path.join(root, "web/src/components/StandardWorkbookComponents.js");
const runtimePath = path.join(root, "web/src/components/WorkbookSubmissionCaptureRuntime.js");
const a2WorkbookPath = path.join(root, "web/src/components/A2StandardTabbedWorkbookPage.js");
const indexCssPath = path.join(root, "web/src/index.css");

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

let runtimeSource = fs.readFileSync(runtimePath, "utf8");
const visibleStatusStart = `  if (!activePartId) return null;

  const isSelfCheck =
`;
if (runtimeSource.includes(visibleStatusStart)) {
  const startIndex = runtimeSource.indexOf(visibleStatusStart);
  const replacement = `  if (!activePartId || activePartId === "teil2") return null;

  const isSelfCheck =
`;
  runtimeSource = `${runtimeSource.slice(0, startIndex)}${runtimeSource.slice(startIndex).replace(visibleStatusStart, replacement)}`;
}
fs.writeFileSync(runtimePath, runtimeSource);

let a2WorkbookSource = fs.readFileSync(a2WorkbookPath, "utf8");
a2WorkbookSource = a2WorkbookSource.replace(
  `      <A2SecondStageWritingUpgrade day={day} />\n`,
  "",
);
fs.writeFileSync(a2WorkbookPath, a2WorkbookSource);

const objectiveChoiceCss = `

/* A2/B1 mapped objective answers: visible radio affordance for every clickable choice. */
[data-falowen-clickable-answer="true"]::before {
  content: "";
  display: inline-block;
  width: 18px;
  height: 18px;
  margin-right: 11px;
  vertical-align: -3px;
  box-sizing: border-box;
  border: 2px solid #94a3b8;
  border-radius: 50%;
  background-color: #ffffff;
  transition: border-color 120ms ease, background-color 120ms ease, box-shadow 120ms ease;
}

[data-falowen-clickable-answer="true"]:hover::before,
[data-falowen-clickable-answer="true"]:focus-visible::before {
  border-color: #2563eb;
}

[data-falowen-clickable-answer="true"][aria-checked="true"]::before {
  border-color: #2563eb;
  background-color: #2563eb;
  box-shadow: inset 0 0 0 4px #ffffff;
}
`;

let indexCssSource = fs.readFileSync(indexCssPath, "utf8");
if (!indexCssSource.includes('[data-falowen-clickable-answer="true"]::before')) {
  indexCssSource = `${indexCssSource.trimEnd()}${objectiveChoiceCss}\n`;
}
fs.writeFileSync(indexCssPath, indexCssSource);

console.log("Simplified A2/B1 Teil 2 writing to the German text box + Analyse only, aligned workbook opening position to the section navigation, and added visible radio indicators to clickable Teil 3/4 answers.");
