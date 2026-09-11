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

const currentLegacyPaths = `export const A2_LEGACY_STANDARD_NAV_PATHS = new Set([
  A2_DAY20_PATH,
  ...A2_DAYS_22_TO_26_PATHS,
]);`;
const previousLateOnlyPaths = `export const A2_LEGACY_STANDARD_NAV_PATHS = new Set([
  A2_DAY20_PATH,
]);`;
const retiredNativePaths = "export const A2_LEGACY_STANDARD_NAV_PATHS = new Set([]);";
for (const oldBlock of [currentLegacyPaths, previousLateOnlyPaths]) {
  if (legacyWrapper.includes(oldBlock)) legacyWrapper = legacyWrapper.replace(oldBlock, retiredNativePaths);
}

const cleanupDeclaration = `  const shouldCleanPresentation =
    A2_GOETHE_LISTENING_ONLY_PATHS.has(normalizedPath) ||
    A2_LEGACY_SUBMISSION_CLEANUP_PATHS.has(normalizedPath);`;
const previousCleanupDeclaration = `  const usesNativeLateWorkbook = /\\/a2-day-(?:22|23|24|25|26|27|28)-/.test(normalizedPath);
  const shouldCleanPresentation =
    !usesNativeLateWorkbook &&
    (A2_GOETHE_LISTENING_ONLY_PATHS.has(normalizedPath) ||
      A2_LEGACY_SUBMISSION_CLEANUP_PATHS.has(normalizedPath));`;
const cleanedWorkbookDeclaration = `  const usesCleanStandardWorkbook = /\\/a2-day-(?:20|21|22|23|24|25|26|27|28)-/.test(normalizedPath);
  const shouldCleanPresentation =
    !usesCleanStandardWorkbook &&
    (A2_GOETHE_LISTENING_ONLY_PATHS.has(normalizedPath) ||
      A2_LEGACY_SUBMISSION_CLEANUP_PATHS.has(normalizedPath));`;
if (legacyWrapper.includes(cleanupDeclaration)) {
  legacyWrapper = legacyWrapper.replace(cleanupDeclaration, cleanedWorkbookDeclaration);
} else if (legacyWrapper.includes(previousCleanupDeclaration)) {
  legacyWrapper = legacyWrapper.replace(previousCleanupDeclaration, cleanedWorkbookDeclaration);
}

const panelImport = 'import A2LateWorkbookSubmissionPanel from "./A2LateWorkbookSubmissionPanel";\n';
inlineEnhancements = inlineEnhancements.replace(panelImport, "");
inlineEnhancements = inlineEnhancements.replace(
  '      <A2LateWorkbookSubmissionPanel pathname={activePathname} />\n',
  "",
);

if (!guidance.includes("[22, 23, 24, 25, 26, 27, 28].includes(Number(workbookDay))")) {
  throw new Error("A2 Days 22-28 are not marked as native workbook owners.");
}
if (!guidance.includes("usesNativeLateWorkbook || !showFallbackTabs")) {
  throw new Error("A2 Days 22-28 still depend on UniversalA2WorkbookTabs fallback detection.");
}
if (!legacyWrapper.includes(retiredNativePaths)) {
  throw new Error("Legacy A2 navigation still owns a cleaned Day 20-28 workbook route.");
}
if (!legacyWrapper.includes("usesCleanStandardWorkbook")) {
  throw new Error("Cleaned A2 workbooks are still eligible for legacy presentation cleanup.");
}
if (inlineEnhancements.includes("A2LateWorkbookSubmissionPanel")) {
  throw new Error("The retired late-A2 global submission bridge is still mounted.");
}

fs.writeFileSync(guidancePath, guidance, "utf8");
fs.writeFileSync(legacyWrapperPath, legacyWrapper, "utf8");
fs.writeFileSync(inlineEnhancementsPath, inlineEnhancements, "utf8");
console.log("A2 Days 20-28 now rely on their cleaned React workbook shells without legacy navigation or duplicate submission panels.");
