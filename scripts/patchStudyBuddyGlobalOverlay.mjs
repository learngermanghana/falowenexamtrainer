import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "web/src/components/StudyBuddyBar.js");
const cssPath = path.join(root, "web/src/components/StudyBuddyBar.css");
const testPath = path.join(root, "web/src/__tests__/StudyBuddyBar.test.js");

let source = fs.readFileSync(sourcePath, "utf8");
let css = fs.readFileSync(cssPath, "utf8");
let testSource = fs.readFileSync(testPath, "utf8");

const reactImport = 'import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";';
const portalImport = 'import { createPortal } from "react-dom";';
if (!source.includes(portalImport)) {
  if (!source.includes(reactImport)) throw new Error("Study Buddy React import anchor missing");
  source = source.replace(reactImport, `${reactImport}\n${portalImport}`);
}

const helperMarker = "const renderStudyBuddyOverlay =";
if (!source.includes(helperMarker)) {
  const anchor = "const StudyBuddyBar = ({ studentProfile }) => {";
  if (!source.includes(anchor)) throw new Error("Study Buddy component anchor missing");
  const helper = `const renderStudyBuddyOverlay = (node) => {\n  if (typeof document === \"undefined\" || !document.body) return node;\n  return createPortal(node, document.body);\n};\n\n`;
  source = source.replace(anchor, `${helper}${anchor}`);
}

// Study Buddy is a persistent campus control. It should begin visible on every
// learning/workbook route instead of starting in a dismissed state.
const dismissedStateOld = "  const [isDismissed, setIsDismissed] = useState(true);";
const dismissedStateNew = "  const [isDismissed, setIsDismissed] = useState(false);";
if (source.includes(dismissedStateOld)) {
  source = source.replace(dismissedStateOld, dismissedStateNew);
} else if (!source.includes(dismissedStateNew)) {
  throw new Error("Study Buddy dismissed-state anchor missing");
}

const dismissedOld = `  if (isDismissed) {\n    return (\n      <button\n        className={\`study-buddy-reopen`;
const dismissedNew = `  if (isDismissed) {\n    return renderStudyBuddyOverlay(\n      <button\n        className={\`study-buddy-reopen`;
if (!source.includes("return renderStudyBuddyOverlay(\n      <button")) {
  if (!source.includes(dismissedOld)) throw new Error("Study Buddy dismissed return anchor missing");
  source = source.replace(dismissedOld, dismissedNew);
}

const expandedOld = `  return (\n    <section\n      className={\`study-buddy-bar`;
const expandedNew = `  return renderStudyBuddyOverlay(\n    <section\n      className={\`study-buddy-bar`;
if (!source.includes("return renderStudyBuddyOverlay(\n    <section")) {
  if (!source.includes(expandedOld)) throw new Error("Study Buddy expanded return anchor missing");
  source = source.replace(expandedOld, expandedNew);
}

css = css.replace(/z-index:\s*900;/g, "z-index: 2147482000;");
css = css.replace(/z-index:\s*901;/g, "z-index: 2147482001;");

const regressionMarker = 'it("renders the visible Study Buddy in document.body so learning-page layouts cannot clip it"';
if (!testSource.includes(regressionMarker)) {
  const endAnchor = "\n});";
  const index = testSource.lastIndexOf(endAnchor);
  if (index < 0) throw new Error("Study Buddy test suite end anchor missing");
  const regression = `\n  it("renders the visible Study Buddy in document.body so learning-page layouts cannot clip it", () => {\n    const pageShell = document.createElement("div");\n    pageShell.style.overflow = "hidden";\n    pageShell.style.transform = "translateZ(0)";\n    document.body.appendChild(pageShell);\n\n    render(<StudyBuddyBar studentProfile={{}} />, { container: pageShell });\n\n    const buddy = document.body.querySelector(".study-buddy-bar");\n    expect(buddy).toBeTruthy();\n    expect(buddy.parentElement).toBe(document.body);\n  });\n`;
  testSource = `${testSource.slice(0, index)}${regression}${testSource.slice(index)}`;
}

fs.writeFileSync(sourcePath, source, "utf8");
fs.writeFileSync(cssPath, css, "utf8");
fs.writeFileSync(testPath, testSource, "utf8");
console.log("Study Buddy now starts visible and renders as a protected global overlay across learning pages.");
