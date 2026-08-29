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

// Keep the launcher available everywhere without forcing the chat panel open.
// A recent visibility fix changed this to false, which made the desktop compact
// ask box appear automatically on workbook entry.
const dismissedStateWrong = "  const [isDismissed, setIsDismissed] = useState(false);";
const dismissedStateCorrect = "  const [isDismissed, setIsDismissed] = useState(true);";
if (source.includes(dismissedStateWrong)) {
  source = source.replace(dismissedStateWrong, dismissedStateCorrect);
} else if (!source.includes(dismissedStateCorrect)) {
  throw new Error("Study Buddy dismissed-state anchor missing");
}

// Opening the launcher must go straight to the full chat. The compact desktop
// state intentionally hides conversation history, so allowing text entry there
// makes a sent message look as if it disappeared until the panel is expanded.
const reopenOld = `          setIsDismissed(false);\n          trackStudyBuddyEvent("reopen");`;
const reopenNew = `          setIsCollapsed(false);\n          setIsDismissed(false);\n          playOpenFeedback();\n          trackStudyBuddyEvent("reopen");`;
if (source.includes(reopenOld)) {
  source = source.replace(reopenOld, reopenNew);
} else if (!source.includes(reopenNew)) {
  throw new Error("Study Buddy reopen handler anchor missing");
}

// Closing the full panel returns to the protected launcher instead of the
// input-only compact state.
const toggleOld = `              onClick={() => {\n                const nextCollapsed = !isCollapsed;\n                setIsCollapsed(nextCollapsed);\n                trackStudyBuddyEvent(nextCollapsed ? "collapse" : "expand");\n              }}`;
const toggleNew = `              onClick={() => {\n                if (isCollapsed) {\n                  setIsCollapsed(false);\n                  playOpenFeedback();\n                  trackStudyBuddyEvent("expand");\n                  return;\n                }\n                setIsCollapsed(true);\n                setIsDismissed(true);\n                triggerInteractionFeedback({ sound: "close" });\n                trackStudyBuddyEvent("collapse");\n              }}`;
if (source.includes(toggleOld)) {
  source = source.replace(toggleOld, toggleNew);
} else if (!source.includes(toggleNew)) {
  throw new Error("Study Buddy toggle handler anchor missing");
}

const mobileCloseOld = `            onClick={() => {\n              setIsCollapsed(true);\n              trackStudyBuddyEvent("collapse", { source: "mobile_close" });\n            }}`;
const mobileCloseNew = `            onClick={() => {\n              setIsCollapsed(true);\n              setIsDismissed(true);\n              triggerInteractionFeedback({ sound: "close" });\n              trackStudyBuddyEvent("collapse", { source: "mobile_close" });\n            }}`;
if (source.includes(mobileCloseOld)) {
  source = source.replace(mobileCloseOld, mobileCloseNew);
} else if (!source.includes(mobileCloseNew)) {
  throw new Error("Study Buddy mobile close handler anchor missing");
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

const regressionMarker = 'it("renders the Study Buddy launcher in document.body so learning-page layouts cannot clip it"';
if (!testSource.includes(regressionMarker)) {
  const endAnchor = "\n});";
  const index = testSource.lastIndexOf(endAnchor);
  if (index < 0) throw new Error("Study Buddy test suite end anchor missing");
  const regression = `\n  it("renders the Study Buddy launcher in document.body so learning-page layouts cannot clip it", () => {\n    const pageShell = document.createElement("div");\n    pageShell.style.overflow = "hidden";\n    pageShell.style.transform = "translateZ(0)";\n    document.body.appendChild(pageShell);\n\n    render(<StudyBuddyBar studentProfile={{}} />, { container: pageShell });\n\n    const launcher = screen.getByRole("button", { name: /open study buddy/i });\n    expect(launcher.parentElement).toBe(document.body);\n  });\n`;
  testSource = `${testSource.slice(0, index)}${regression}${testSource.slice(index)}`;
}

fs.writeFileSync(sourcePath, source, "utf8");
fs.writeFileSync(cssPath, css, "utf8");
fs.writeFileSync(testPath, testSource, "utf8");
console.log("Study Buddy now stays as a protected launcher until opened, then opens the full chat.");
