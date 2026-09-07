import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

await import("./patchA2Day22NativeWorkbook.mjs");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const guidancePath = path.join(root, "web/src/components/A2B1WorkbookGuidance.js");
const legacyWrapperPath = path.join(root, "web/src/components/A2LegacyStandardWorkbookNavigation.js");
const inlineEnhancementsPath = path.join(root, "web/src/components/WorkbookInlineEnhancements.jsx");

let guidance = fs.readFileSync(guidancePath, "utf8");
let legacyWrapper = fs.readFileSync(legacyWrapperPath, "utf8");
let inlineEnhancements = fs.readFileSync(inlineEnhancementsPath, "utf8");

const workbookDayBlock = `  const workbookDay = useMemo(() => {
    if (typeof window === "undefined") return null;
    return resolveA2B1WorkbookDayFromLocation(
      workbookLevel,
      \`${"${window.location.pathname || \"\"}"}${"${window.location.search || \"\"}"}\`,
    );
  }, [workbookLevel]);`;
const nativeOwnershipBlock = `${workbookDayBlock}
  const usesNativeLateWorkbook =
    workbookLevel === "A2" && [22, 23, 24, 25, 26, 27, 28].includes(Number(workbookDay));`;
if (!guidance.includes("const usesNativeLateWorkbook =")) {
  const universalComponentIndex = guidance.indexOf("const UniversalA2WorkbookTabs =");
  if (universalComponentIndex < 0) throw new Error("Could not find UniversalA2WorkbookTabs.");
  const workbookDayIndex = guidance.indexOf(workbookDayBlock, universalComponentIndex);
  if (workbookDayIndex < 0) throw new Error("Could not find Universal A2 workbook day resolver.");
  guidance = `${guidance.slice(0, workbookDayIndex)}${nativeOwnershipBlock}${guidance.slice(workbookDayIndex + workbookDayBlock.length)}`;
}
guidance = guidance.replace(
  '[23, 24, 25, 26, 27, 28].includes(Number(workbookDay))',
  '[22, 23, 24, 25, 26, 27, 28].includes(Number(workbookDay))',
);

const workbookLevelGuard = `    if (workbookLevel !== "A2") {
      setShowFallbackTabs(false);
      return undefined;
    }`;
const nativeWorkbookGuard = `${workbookLevelGuard}

    if (usesNativeLateWorkbook) {
      setShowFallbackTabs(false);
      return undefined;
    }`;
if (!guidance.includes("if (usesNativeLateWorkbook)")) {
  const universalComponentIndex = guidance.indexOf("const UniversalA2WorkbookTabs =");
  const guardIndex = guidance.indexOf(workbookLevelGuard, universalComponentIndex);
  if (guardIndex < 0) throw new Error("Could not find Universal A2 workbook fallback guard.");
  guidance = `${guidance.slice(0, guardIndex)}${nativeWorkbookGuard}${guidance.slice(guardIndex + workbookLevelGuard.length)}`;
}
guidance = guidance.replace(
  "  }, [workbookLevel]);\n\n  if (workbookLevel !== \"A2\" || !showFallbackTabs) return null;",
  "  }, [workbookLevel, usesNativeLateWorkbook]);\n\n  if (workbookLevel !== \"A2\" || usesNativeLateWorkbook || !showFallbackTabs) return null;",
);

const legacyPathsBlock = `export const A2_LEGACY_STANDARD_NAV_PATHS = new Set([
  A2_DAY20_PATH,
  ...A2_DAYS_22_TO_26_PATHS,
]);`;
const previousNativeLateLegacyPathsBlock = `export const A2_LEGACY_STANDARD_NAV_PATHS = new Set([
  A2_DAY20_PATH,
  A2_DAY22_PATH,
]);`;
const nativeLateLegacyPathsBlock = `export const A2_LEGACY_STANDARD_NAV_PATHS = new Set([
  A2_DAY20_PATH,
]);`;
for (const oldBlock of [legacyPathsBlock, previousNativeLateLegacyPathsBlock]) {
  if (legacyWrapper.includes(oldBlock)) {
    legacyWrapper = legacyWrapper.replace(oldBlock, nativeLateLegacyPathsBlock);
  }
}

const cleanupDeclaration = `  const shouldCleanPresentation =
    A2_GOETHE_LISTENING_ONLY_PATHS.has(normalizedPath) ||
    A2_LEGACY_SUBMISSION_CLEANUP_PATHS.has(normalizedPath);`;
const previousNativeCleanupDeclaration = `  const usesNativeLateWorkbook = /\\/a2-day-(?:23|24|25|26|27|28)-/.test(normalizedPath);
  const shouldCleanPresentation =
    !usesNativeLateWorkbook &&
    (A2_GOETHE_LISTENING_ONLY_PATHS.has(normalizedPath) ||
      A2_LEGACY_SUBMISSION_CLEANUP_PATHS.has(normalizedPath));`;
const nativeCleanupDeclaration = `  const usesNativeLateWorkbook = /\\/a2-day-(?:22|23|24|25|26|27|28)-/.test(normalizedPath);
  const shouldCleanPresentation =
    !usesNativeLateWorkbook &&
    (A2_GOETHE_LISTENING_ONLY_PATHS.has(normalizedPath) ||
      A2_LEGACY_SUBMISSION_CLEANUP_PATHS.has(normalizedPath));`;
if (legacyWrapper.includes(cleanupDeclaration)) {
  legacyWrapper = legacyWrapper.replace(cleanupDeclaration, nativeCleanupDeclaration);
} else if (legacyWrapper.includes(previousNativeCleanupDeclaration)) {
  legacyWrapper = legacyWrapper.replace(previousNativeCleanupDeclaration, nativeCleanupDeclaration);
}

const panelImport = 'import A2LateWorkbookSubmissionPanel from "./A2LateWorkbookSubmissionPanel";';
if (!inlineEnhancements.includes(panelImport)) {
  const importAnchor = 'import CourseWorkbookSubmissionTabs from "./CourseWorkbookSubmissionTabs";';
  if (!inlineEnhancements.includes(importAnchor)) {
    throw new Error("Could not find workbook inline enhancement import anchor.");
  }
  inlineEnhancements = inlineEnhancements.replace(importAnchor, `${importAnchor}\n${panelImport}`);
}

const anchorMarkup = '      <span ref={anchorRef} data-workbook-inline-enhancements-anchor hidden />';
const panelMarkup = `${anchorMarkup}\n      <A2LateWorkbookSubmissionPanel pathname={activePathname} />`;
if (!inlineEnhancements.includes("<A2LateWorkbookSubmissionPanel pathname={activePathname} />")) {
  if (!inlineEnhancements.includes(anchorMarkup)) {
    throw new Error("Could not find workbook inline enhancements render anchor.");
  }
  inlineEnhancements = inlineEnhancements.replace(anchorMarkup, panelMarkup);
}

if (!guidance.includes("[22, 23, 24, 25, 26, 27, 28].includes(Number(workbookDay))")) {
  throw new Error("A2 Days 22-28 are not all marked as native workbook owners.");
}
if (!guidance.includes("usesNativeLateWorkbook || !showFallbackTabs")) {
  throw new Error("A2 Days 22-28 still depend on UniversalA2WorkbookTabs fallback detection.");
}
if (!legacyWrapper.includes(nativeLateLegacyPathsBlock)) {
  throw new Error("Legacy A2 navigation still owns a late workbook route.");
}
if (!legacyWrapper.includes("const usesNativeLateWorkbook =")) {
  throw new Error("A2 late native pages are still eligible for legacy presentation cleanup.");
}
if (!legacyWrapper.includes("(?:22|23|24|25|26|27|28)")) {
  throw new Error("A2 Day 22 is still eligible for legacy presentation cleanup.");
}
if (!inlineEnhancements.includes(panelImport) || !inlineEnhancements.includes("<A2LateWorkbookSubmissionPanel pathname={activePathname} />")) {
  throw new Error("A2 late native submission panel is not mounted by global workbook enhancements.");
}

fs.writeFileSync(guidancePath, guidance, "utf8");
fs.writeFileSync(legacyWrapperPath, legacyWrapper, "utf8");
fs.writeFileSync(inlineEnhancementsPath, inlineEnhancements, "utf8");
console.log("A2 Days 22-28 now keep native React navigation; Days 24-26 submissions mount globally without fallback tabs.");
