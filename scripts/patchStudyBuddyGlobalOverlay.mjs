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

// Study Buddy is mounted once by App. It may read route metadata, but it must
// never rewrite or wrap the distinct A1/A2/B1/B2/C1 lesson structures.
const routerImportOld = 'import { useNavigate } from "react-router-dom";';
const routerImportNew = 'import { useLocation, useNavigate } from "react-router-dom";';
if (source.includes(routerImportOld)) {
  source = source.replace(routerImportOld, routerImportNew);
} else if (!source.includes(routerImportNew)) {
  throw new Error("Study Buddy router import anchor missing");
}

const routeContextImport = 'import { resolveStudyBuddyRouteContext } from "../utils/studyBuddyRouteContext";';
if (!source.includes(routeContextImport)) {
  const importAnchor = 'import { toDateMs } from "../lib/dateUtils";';
  if (!source.includes(importAnchor)) throw new Error("Study Buddy route context import anchor missing");
  source = source.replace(importAnchor, `${importAnchor}\n${routeContextImport}`);
}

const helperMarker = "const renderStudyBuddyOverlay =";
if (!source.includes(helperMarker)) {
  const anchor = "const StudyBuddyBar = ({ studentProfile }) => {";
  if (!source.includes(anchor)) throw new Error("Study Buddy component anchor missing");
  const helper = `const renderStudyBuddyOverlay = (node) => {\n  if (typeof document === \"undefined\" || !document.body) return node;\n  return createPortal(node, document.body);\n};\n\n`;
  source = source.replace(anchor, `${helper}${anchor}`);
}

const navigateAnchor = "  const navigate = useNavigate();";
const locationAnchor = "  const location = useLocation();";
if (!source.includes(locationAnchor)) {
  if (!source.includes(navigateAnchor)) throw new Error("Study Buddy navigate anchor missing");
  source = source.replace(navigateAnchor, `${navigateAnchor}\n${locationAnchor}`);
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

// Resolve context from the route instead of assuming that all levels share one
// workbook shape. Profile level is only a fallback for legacy pages whose URL
// does not carry a level (for example the dedicated A1 speaking page).
const lessonContextMarker = "  const lessonContext = useMemo(";
if (!source.includes(lessonContextMarker)) {
  const levelEndAnchor = `  }, [levelKey]);\n  const [latestResult, setLatestResult] = useState(null);`;
  const levelContextBlock = `  }, [levelKey]);\n  const lessonContext = useMemo(\n    () =>\n      resolveStudyBuddyRouteContext({\n        pathname: location.pathname,\n        search: location.search,\n        profileLevel: resolvedLevel,\n      }),\n    [location.pathname, location.search, resolvedLevel]\n  );\n  const [latestResult, setLatestResult] = useState(null);`;
  if (!source.includes(levelEndAnchor)) throw new Error("Study Buddy level context anchor missing");
  source = source.replace(levelEndAnchor, levelContextBlock);
}

const historyLevelOld = '  const historyLevel = resolvedLevel || "B1";';
const historyLevelNew = '  const historyLevel = lessonContext.level || resolvedLevel || "B1";';
if (source.includes(historyLevelOld)) {
  source = source.replace(historyLevelOld, historyLevelNew);
} else if (!source.includes(historyLevelNew)) {
  throw new Error("Study Buddy history-level anchor missing");
}

const requestContextOld = `        const response = await requestStudyBuddyReply({\n          message: trimmed,\n          level: historyLevel,\n          idToken,\n        });`;
const requestContextNew = `        const response = await requestStudyBuddyReply({\n          message: trimmed,\n          level: historyLevel,\n          idToken,\n          lessonContext,\n        });`;
if (source.includes(requestContextOld)) {
  source = source.replace(requestContextOld, requestContextNew);
} else if (!source.includes(requestContextNew)) {
  throw new Error("Study Buddy request context anchor missing");
}

// The lesson context changes with navigation. Include it in the callback
// dependency list so a B1 conversation cannot accidentally keep A2 metadata.
const submitDependencyOld = "    [className, historyLevel, idToken, resolvedLevel, studentCode, studentEmail, studentName, t, trackStudyBuddyEvent, user?.uid]";
const submitDependencyNew = "    [className, historyLevel, idToken, lessonContext, resolvedLevel, studentCode, studentEmail, studentName, t, trackStudyBuddyEvent, user?.uid]";
if (source.includes(submitDependencyOld)) {
  source = source.replace(submitDependencyOld, submitDependencyNew);
} else if (!source.includes(submitDependencyNew)) {
  throw new Error("Study Buddy request dependency anchor missing");
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

// Portaling solves workbook clipping without putting Study Buddy above dialogs.
// Keep it below the app's modal layers (50+), including focus and submit overlays.
css = css.replace(/z-index:\s*(?:900|2147482000);/g, "z-index: 40;");
css = css.replace(/z-index:\s*(?:901|2147482001);/g, "z-index: 41;");

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
console.log("Study Buddy stays global and level-aware without rewriting A1-A2-B1-B2-C1 lesson structures.");
