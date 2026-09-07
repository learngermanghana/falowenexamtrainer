import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const guidancePath = path.join(root, "web/src/components/A2B1WorkbookGuidance.js");
const legacyWrapperPath = path.join(root, "web/src/components/A2LegacyStandardWorkbookNavigation.js");

let guidance = fs.readFileSync(guidancePath, "utf8");
let legacyWrapper = fs.readFileSync(legacyWrapperPath, "utf8");

const profileImport = 'import { getA2B1WorkbookSectionProfile } from "./a2B1WorkbookSectionProfile";';
if (!guidance.includes(profileImport)) {
  const stylesImport = 'import { styles } from "../styles";';
  if (!guidance.includes(stylesImport)) throw new Error("Could not find A2 guidance styles import.");
  guidance = guidance.replace(stylesImport, `${stylesImport}\n${profileImport}`);
}

const workbookDayBlock = `  const workbookDay = useMemo(() => {
    if (typeof window === "undefined") return null;
    return resolveA2B1WorkbookDayFromLocation(
      workbookLevel,
      \`${"${window.location.pathname || \"\"}"}${"${window.location.search || \"\"}"}\`,
    );
  }, [workbookLevel]);`;
const nativeOwnershipBlock = `${workbookDayBlock}
  const usesNativeLateWorkbook =
    workbookLevel === "A2" && [23, 24, 25, 26, 27, 28].includes(Number(workbookDay));`;
if (!guidance.includes("const usesNativeLateWorkbook =")) {
  const universalComponentIndex = guidance.indexOf("const UniversalA2WorkbookTabs =");
  if (universalComponentIndex < 0) throw new Error("Could not find UniversalA2WorkbookTabs.");
  const workbookDayIndex = guidance.indexOf(workbookDayBlock, universalComponentIndex);
  if (workbookDayIndex < 0) throw new Error("Could not find Universal A2 workbook day resolver.");
  guidance = `${guidance.slice(0, workbookDayIndex)}${nativeOwnershipBlock}${guidance.slice(workbookDayIndex + workbookDayBlock.length)}`;
}

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

const lateSubmissionMarker = "const A2LateWorkbookSubmissionPanel =";
if (!guidance.includes(lateSubmissionMarker)) {
  const componentAnchor = "export const A2B1WorkbookGuidance = ({ level = \"\" }) => {";
  if (!guidance.includes(componentAnchor)) throw new Error("Could not find A2B1WorkbookGuidance component anchor.");

  const lateSubmissionComponent = `const A2LateWorkbookSubmissionPanel = ({ level = "" }) => {
  const workbookLevel = useMemo(() => resolveWorkbookLevel(level), [level]);
  const workbookDay = useMemo(() => {
    if (typeof window === "undefined") return null;
    return resolveA2B1WorkbookDayFromLocation(
      workbookLevel,
      \`${"${window.location.pathname || \"\"}"}${"${window.location.search || \"\"}"}\`,
    );
  }, [workbookLevel]);
  const submissionContext = useMemo(
    () => resolveA2FallbackSubmissionContext(workbookDay),
    [workbookDay],
  );
  const profile = useMemo(
    () => getA2B1WorkbookSectionProfile(workbookLevel, workbookDay),
    [workbookLevel, workbookDay],
  );

  if (workbookLevel !== "A2" || ![24, 25, 26].includes(Number(workbookDay)) || !submissionContext) {
    return null;
  }

  const part4Label = profile.part4 === "reading" ? "Teil 4 · Lesen" : "Teil 4 · Hören";
  const part4Copy =
    profile.part4Submission === "self-check"
      ? \`${"${part4Label}"} is self-check practice and is not submitted.\`
      : \`${"${part4Label}"} is part of the submitted workbook.\`;

  return (
    <details
      data-a2-late-native-submission={workbookDay}
      style={{ ...styles.card, margin: 0, border: "1px solid #bfdbfe", background: "#f8fbff" }}
    >
      <summary style={{ cursor: "pointer", fontWeight: 800 }}>
        Submit workbook · Day {workbookDay}
      </summary>
      <div style={{ display: "grid", gap: 10, paddingTop: 12 }}>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
          Submit Teil 2 · Schreiben and Teil 3 · Lesen. {part4Copy}
        </p>
        <ContextualAssignmentSubmissionPage submissionContext={submissionContext} />
      </div>
    </details>
  );
};

${componentAnchor}`;
  guidance = guidance.replace(componentAnchor, lateSubmissionComponent);
}

const guidanceMount = "      <UniversalA2WorkbookTabs level={workbookLevel} />";
const lateSubmissionMount = `${guidanceMount}\n      <A2LateWorkbookSubmissionPanel level={workbookLevel} />`;
if (!guidance.includes("<A2LateWorkbookSubmissionPanel level={workbookLevel} />")) {
  if (!guidance.includes(guidanceMount)) throw new Error("Could not find Universal A2 workbook mount.");
  guidance = guidance.replace(guidanceMount, lateSubmissionMount);
}

const legacyPathsBlock = `export const A2_LEGACY_STANDARD_NAV_PATHS = new Set([
  A2_DAY20_PATH,
  ...A2_DAYS_22_TO_26_PATHS,
]);`;
const nativeLateLegacyPathsBlock = `export const A2_LEGACY_STANDARD_NAV_PATHS = new Set([
  A2_DAY20_PATH,
  A2_DAY22_PATH,
]);`;
if (legacyWrapper.includes(legacyPathsBlock)) {
  legacyWrapper = legacyWrapper.replace(legacyPathsBlock, nativeLateLegacyPathsBlock);
}

const cleanupDeclaration = `  const shouldCleanPresentation =
    A2_GOETHE_LISTENING_ONLY_PATHS.has(normalizedPath) ||
    A2_LEGACY_SUBMISSION_CLEANUP_PATHS.has(normalizedPath);`;
const nativeCleanupDeclaration = `  const usesNativeLateWorkbook = /\\/a2-day-(?:23|24|25|26|27|28)-/.test(normalizedPath);
  const shouldCleanPresentation =
    !usesNativeLateWorkbook &&
    (A2_GOETHE_LISTENING_ONLY_PATHS.has(normalizedPath) ||
      A2_LEGACY_SUBMISSION_CLEANUP_PATHS.has(normalizedPath));`;
if (legacyWrapper.includes(cleanupDeclaration)) {
  legacyWrapper = legacyWrapper.replace(cleanupDeclaration, nativeCleanupDeclaration);
}

if (!guidance.includes("usesNativeLateWorkbook || !showFallbackTabs")) {
  throw new Error("A2 Days 23-28 still depend on UniversalA2WorkbookTabs fallback detection.");
}
if (!guidance.includes("data-a2-late-native-submission")) {
  throw new Error("A2 Days 24-26 native submission panel was not generated.");
}
if (!legacyWrapper.includes("A2_DAY22_PATH,")) {
  throw new Error("A2 Day 22 legacy support was accidentally removed.");
}
if (!legacyWrapper.includes("const usesNativeLateWorkbook =")) {
  throw new Error("A2 late native pages are still eligible for legacy presentation cleanup.");
}

fs.writeFileSync(guidancePath, guidance, "utf8");
fs.writeFileSync(legacyWrapperPath, legacyWrapper, "utf8");
console.log("A2 Days 23-28 now keep native React navigation; Days 24-26 use route-locked native submission panels.");
