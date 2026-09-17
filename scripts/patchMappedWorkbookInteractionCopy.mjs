import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const replaceText = (relativePath, replacements) => {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) return;
  let source = fs.readFileSync(filePath, "utf8");
  replacements.forEach(([from, to]) => {
    if (source.includes(from)) source = source.replaceAll(from, to);
  });
  fs.writeFileSync(filePath, source);
};

replaceText("web/src/components/A2StandardTabbedWorkbookPage.js", [
  [
    "Write approximately 60–80 words, then copy your finished answer into the Submit tab.",
    "Write approximately 60–80 words. Your latest text is saved to Review & Submit automatically, where you can still edit the final answer before submitting.",
  ],
  [
    "Read the text and review the questions. <strong>Do not answer directly on this page.</strong> Submit answers through the Submit tab.",
    "Read the text and answer directly on this page. Tap one answer for each question; your choices save automatically to Review & Submit and can be changed at any time before submission.",
  ],
  [
    "Listen to the lesson audio or video from the Course Book, then submit your final answer letters through the Submit tab if required by your tutor.",
    "Listen to the lesson audio or video, then tap your answers directly in the workbook. Required answers save automatically to Review & Submit.",
  ],
]);

replaceText("web/src/components/B1StandardWorkbookPage.js", [
  [
    "Write approximately 80–100 words and submit the finished text through the Submit tab.",
    "Write approximately 80–100 words. Your latest text is saved to Review & Submit automatically, where you can edit the final answer before submitting.",
  ],
  [
    "Submit only the answer letters through the Submit tab.",
    "Tap one answer directly beside each question. Your choices save automatically to Review & Submit.",
  ],
  [
    "Submit your final listening answers through the Submit tab.",
    "Tap your listening answers directly in the workbook. Required answers save automatically to Review & Submit.",
  ],
]);

replaceText("web/src/components/A2B1WorkbookGuidance.js", [
  [
    "Reminder: Practise here, then submit only your final answers through the Submit tab.",
    "Answer directly in the workbook. Your required choices and writing are saved to Review & Submit automatically. You can edit the final answer there before submitting.",
  ],
]);

replaceText("web/src/components/AssignmentSubmissionPage.js", [
  [
    "Your first confirmed submission is final.",
    "You can edit this final answer until you press Submit assignment.",
  ],
]);

replaceText("web/src/components/A1CanonicalSubmissionPanel.jsx", [
  [
    "This submission is locked to ${assignmentKey}.",
    "This submission belongs to ${assignmentKey}. You can edit the final answer below before submitting.",
  ],
  [
    "Your workbook answers are mapped into the submission form below. Check them, then press the final Submit Assignment button. Until that succeeds, your tutor has not received this work.",
    "Your workbook answers are mapped into the submission form below. Check them and edit anything you need, then press the final Submit Assignment button. Until that succeeds, your tutor has not received this work.",
  ],
]);

replaceText("web/src/components/A1TutorDraftSectionCapture.jsx", [
  [
    'import React, { useEffect, useRef, useState } from "react";',
    'import React, { useEffect, useMemo, useRef, useState } from "react";',
  ],
  [
    '  const choiceItems = sectionProfile?.items?.filter((item) => item.type === "choice") || [];\n  const shortItems = sectionProfile?.items?.filter((item) => item.type === "short") || [];',
    '  const choiceItems = useMemo(\n    () => sectionProfile?.items?.filter((item) => item.type === "choice") || [],\n    [sectionProfile?.items],\n  );\n  const shortItems = useMemo(\n    () => sectionProfile?.items?.filter((item) => item.type === "short") || [],\n    [sectionProfile?.items],\n  );',
  ],
]);

const cssPath = path.join(root, "web/src/index.css");
if (fs.existsSync(cssPath)) {
  let css = fs.readFileSync(cssPath, "utf8");
  const a1RadioCss = `

/* A1 tutor-marked mapped answers use the same visible radio affordance as A2/B1. */
[data-a1-clickable-answer="true"]::before {
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

[data-a1-clickable-answer="true"]:hover::before,
[data-a1-clickable-answer="true"]:focus-visible::before {
  border-color: #2563eb;
}

[data-a1-clickable-answer="true"][aria-checked="true"]::before {
  border-color: #2563eb;
  background-color: #2563eb;
  box-shadow: inset 0 0 0 4px #ffffff;
}
`;
  if (!css.includes('[data-a1-clickable-answer="true"]::before')) {
    css = `${css.trimEnd()}${a1RadioCss}\n`;
    fs.writeFileSync(cssPath, css);
  }
}

console.log("Aligned A1/A2/B1 mapped-workbook guidance with direct answer capture, stable answer bindings, shared radio affordances and editable final review.");
