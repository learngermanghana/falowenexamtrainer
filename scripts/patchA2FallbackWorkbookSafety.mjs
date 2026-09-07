import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const guidancePath = path.join(root, "web/src/components/A2B1WorkbookGuidance.js");
const standardComponentsPath = path.join(root, "web/src/components/StandardWorkbookComponents.js");

let guidanceSource = fs.readFileSync(guidancePath, "utf8");
let standardSource = fs.readFileSync(standardComponentsPath, "utf8");

const contextualImport = 'import ContextualAssignmentSubmissionPage from "./ContextualAssignmentSubmissionPage";';
if (!guidanceSource.includes(contextualImport)) {
  const assignmentImport = 'import AssignmentSubmissionPage from "./AssignmentSubmissionPage";';
  if (!guidanceSource.includes(assignmentImport)) {
    throw new Error("Could not find AssignmentSubmissionPage import in A2 workbook guidance.");
  }
  guidanceSource = guidanceSource.replace(
    assignmentImport,
    `${assignmentImport}\n${contextualImport}`,
  );
}

const assignmentsImport = 'import { getInlineCourseAssignments } from "../utils/courseLessonAssignments";';
if (!guidanceSource.includes(assignmentsImport)) {
  const stylesImport = 'import { styles } from "../styles";';
  if (!guidanceSource.includes(stylesImport)) {
    throw new Error("Could not find styles import in A2 workbook guidance.");
  }
  guidanceSource = guidanceSource.replace(stylesImport, `${stylesImport}\n${assignmentsImport}`);
}

const fallbackSubmissionMarker = "export const resolveA2FallbackSubmissionContext";
if (!guidanceSource.includes(fallbackSubmissionMarker)) {
  const universalTabsBlock = `const UNIVERSAL_A2_WORKBOOK_TABS = [
  { key: "grammar", legacyKey: "grammar", match: /\\bgrammar\\b|grammatik/i },
  { key: "sprechen", legacyKey: "teil1", match: /\\bteil\\s*1\\b|sprechen|speak/i },
  { key: "schreiben", legacyKey: "teil2", match: /\\bteil\\s*2\\b|schreiben|write/i },
  { key: "lesen", legacyKey: "teil3", match: /\\bteil\\s*3\\b|lesen|read/i },
  { key: "hoeren", legacyKey: "teil4", match: /\\bteil\\s*4\\b|h[oö]ren|hoeren|listen/i },
  { key: "references", legacyKey: "ref", match: /\\bref\\b|reference|answers|antwort/i },
  { key: "submit", legacyKey: "submit", match: /submit|abgeben|send/i },
];`;
  if (!guidanceSource.includes(universalTabsBlock)) {
    throw new Error("Could not find universal A2 fallback tabs block.");
  }

  const fallbackSubmissionBlock = `${universalTabsBlock}

const A2_FALLBACK_SUBMISSION_CONFIG_BY_DAY = {
  24: { fallbackChapter: "9.24", workbookId: "A2Day24EinenUrlaubPlanen" },
  25: { fallbackChapter: "9.25", workbookId: "A2Day25Tagesablauf" },
  26: { fallbackChapter: "10.26", workbookId: "A2Day26GefuehleInVerschiedenenSituationen" },
};

export const resolveA2FallbackSubmissionContext = (day) => {
  const numericDay = Number(day);
  const config = A2_FALLBACK_SUBMISSION_CONFIG_BY_DAY[numericDay] || null;
  if (!config) return null;

  const assignment = getInlineCourseAssignments("A2", numericDay)[0] || null;
  const chapter = assignment?.chapter || config.fallbackChapter;
  const assignmentKey = assignment?.assignmentKey || \`A2-\${chapter}\`;

  return {
    level: "A2",
    day: numericDay,
    chapter,
    assignmentKey,
    canonicalAssignmentKey: assignmentKey,
    workbookId: config.workbookId,
  };
};`;

  guidanceSource = guidanceSource.replace(universalTabsBlock, fallbackSubmissionBlock);
}

// Day 25 is the one forced shared-fallback lesson whose Part 4 is Lesen rather
// than Hören. Define its visible tab set and proxy-click targets here, in the
// same build-time patch that owns the Days 24-26 fallback, so prebuild/pretest
// runs remain deterministic and idempotent.
const day25TabsMarker = "const A2_DAY25_WORKBOOK_TABS = [";
if (!guidanceSource.includes(day25TabsMarker)) {
  const day25TabsAnchor = "const A2_FALLBACK_SUBMISSION_CONFIG_BY_DAY = {";
  if (!guidanceSource.includes(day25TabsAnchor)) {
    throw new Error("Could not find A2 fallback config anchor for Day 25 navigation.");
  }
  const day25TabsBlock = `const A2_DAY25_WORKBOOK_TABS = [
  { key: "sprechen", label: "Teil 1", description: "Sprechen" },
  { key: "schreiben", label: "Teil 2", description: "Schreiben" },
  { key: "lesen", label: "Teil 3", description: "Lesen" },
  { key: "lesen2", label: "Teil 4", description: "Lesen" },
  { key: "references", label: "Ref", description: "Notes" },
  { key: "submit", label: "Submit", description: "Send work" },
];

const A2_DAY25_NAVIGATION_TARGETS = [
  { key: "sprechen", legacyKey: "teil1", match: /\\bteil\\s*1\\b|sprechen|speak/i },
  { key: "schreiben", legacyKey: "teil2", match: /\\bteil\\s*2\\b|schreiben|write/i },
  { key: "lesen", legacyKey: "teil3", match: /\\bteil\\s*3\\b|first reading|reading 1|lesen 1/i },
  { key: "lesen2", legacyKey: "teil4", match: /\\bteil\\s*4\\b|second reading|reading 2|lesen 2/i },
  { key: "references", legacyKey: "ref", match: /\\bref\\b|reference|answers|antwort/i },
  { key: "submit", legacyKey: "submit", match: /submit|abgeben|send/i },
];

`;
  guidanceSource = guidanceSource.replace(day25TabsAnchor, `${day25TabsBlock}${day25TabsAnchor}`);
}

const workbookDayBlock = `  const workbookDay = useMemo(() => {
    if (typeof window === "undefined") return null;
    return resolveA2B1WorkbookDayFromLocation(
      workbookLevel,
      \`${"${window.location.pathname || \"\"}"}${"${window.location.search || \"\"}"}\`,
    );
  }, [workbookLevel]);`;
const submissionContextBlock = `${workbookDayBlock}
  const routeLockedSubmissionContext = useMemo(
    () => resolveA2FallbackSubmissionContext(workbookDay),
    [workbookDay],
  );`;
if (!guidanceSource.includes("const routeLockedSubmissionContext = useMemo(")) {
  if (!guidanceSource.includes(workbookDayBlock)) {
    throw new Error("Could not find workbook day resolver in universal A2 tabs.");
  }
  guidanceSource = guidanceSource.replace(workbookDayBlock, submissionContextBlock);
}

const unsafeFallbackTabs = `  const fallbackTabs = useMemo(
    () =>
      workbookDay === 25
        ? STANDARD_WORKBOOK_TABS.map((tab) =>
            tab.key === "hoeren" ? { ...tab, description: "Lesen" } : tab,
          )
        : STANDARD_WORKBOOK_TABS,
    [workbookDay],
  );`;
const tabDescriptionOverrideDeclaration = '  const tabDescriptionOverrides = workbookDay === 25 ? { hoeren: "Lesen" } : null;';
if (guidanceSource.includes(unsafeFallbackTabs)) {
  guidanceSource = guidanceSource.replace(
    unsafeFallbackTabs,
    guidanceSource.includes(tabDescriptionOverrideDeclaration) ? "" : tabDescriptionOverrideDeclaration,
  );
} else if (!guidanceSource.includes(tabDescriptionOverrideDeclaration)) {
  const submitRefAnchor = "  const submitRef = useRef(null);";
  if (!guidanceSource.includes(submitRefAnchor)) {
    throw new Error("Could not find universal A2 submit ref for Day 25 label override.");
  }
  guidanceSource = guidanceSource.replace(
    submitRefAnchor,
    `${submitRefAnchor}\n${tabDescriptionOverrideDeclaration}`,
  );
}

const legacyHandleLookup =
  '    const tab = UNIVERSAL_A2_WORKBOOK_TABS.find((item) => item.key === tabKey);';
const day25HandleLookup = `    const navigationTargets = workbookDay === 25
      ? A2_DAY25_NAVIGATION_TARGETS
      : UNIVERSAL_A2_WORKBOOK_TABS;
    const tab = navigationTargets.find((item) => item.key === tabKey);`;
if (guidanceSource.includes(legacyHandleLookup)) {
  guidanceSource = guidanceSource.replace(legacyHandleLookup, day25HandleLookup);
} else if (!guidanceSource.includes("const navigationTargets = workbookDay === 25")) {
  throw new Error("Could not route Day 25 shared tabs to the second reading target.");
}

const fallbackNavWithMappedTabs = `        tabs={fallbackTabs}
        ariaLabel={workbookDay ? \`A2 Day ${"${workbookDay}"} workbook sections\` : "A2 workbook sections"}`;
const standardFallbackNav = `        tabs={STANDARD_WORKBOOK_TABS}
        ariaLabel={workbookDay ? \`A2 Day ${"${workbookDay}"} workbook sections\` : "A2 workbook sections"}`;
const standardFallbackNavWithOverrides = `        tabs={STANDARD_WORKBOOK_TABS}
        tabDescriptionOverrides={tabDescriptionOverrides}
        ariaLabel={workbookDay ? \`A2 Day ${"${workbookDay}"} workbook sections\` : "A2 workbook sections"}`;
const day25FallbackNav = `        tabs={workbookDay === 25 ? A2_DAY25_WORKBOOK_TABS : STANDARD_WORKBOOK_TABS}
        tabDescriptionOverrides={tabDescriptionOverrides}
        ariaLabel={workbookDay ? \`A2 Day ${"${workbookDay}"} workbook sections\` : "A2 workbook sections"}`;

if (guidanceSource.includes(fallbackNavWithMappedTabs)) {
  guidanceSource = guidanceSource.replace(fallbackNavWithMappedTabs, day25FallbackNav);
} else if (guidanceSource.includes(standardFallbackNavWithOverrides)) {
  guidanceSource = guidanceSource.replace(standardFallbackNavWithOverrides, day25FallbackNav);
} else if (guidanceSource.includes(standardFallbackNav)) {
  guidanceSource = guidanceSource.replace(standardFallbackNav, day25FallbackNav);
} else if (!guidanceSource.includes(day25FallbackNav)) {
  throw new Error("Could not apply the Day 25 tab set to the shared A2 fallback navigation.");
}

const genericSubmission = "          <AssignmentSubmissionPage />";
const lockedSubmission = `          {routeLockedSubmissionContext ? (
            <ContextualAssignmentSubmissionPage submissionContext={routeLockedSubmissionContext} />
          ) : (
            <AssignmentSubmissionPage />
          )}`;
const hasRouteLockedSubmission =
  guidanceSource.includes("submissionContext={routeLockedSubmissionContext}") ||
  guidanceSource.includes("submissionContext={resolveA2FallbackSubmissionContext(workbookDay)}");
if (!hasRouteLockedSubmission) {
  if (!guidanceSource.includes(genericSubmission)) {
    throw new Error("Could not find generic fallback assignment submission mount.");
  }
  guidanceSource = guidanceSource.replace(genericSubmission, lockedSubmission);
}

const workbookTabPropsAnchor = `  tabs = STANDARD_WORKBOOK_TABS,
  ariaLabel = "Workbook sections",
  renderLegacyGrammarPanel = true,`;
const workbookTabPropsWithOverrides = `  tabs = STANDARD_WORKBOOK_TABS,
  ariaLabel = "Workbook sections",
  renderLegacyGrammarPanel = true,
  tabDescriptionOverrides = null,`;
if (!standardSource.includes("tabDescriptionOverrides = null")) {
  if (!standardSource.includes(workbookTabPropsAnchor)) {
    throw new Error("Could not find WorkbookTabNav props in StandardWorkbookComponents.");
  }
  standardSource = standardSource.replace(workbookTabPropsAnchor, workbookTabPropsWithOverrides);
}

const effectiveTabsAnchor = `  } = getWorkbookTabsWithLegacyGrammar({ tabs, ariaLabel });
  const activeIndex = Math.max(0, effectiveTabs.findIndex((tab) => tab.key === activeTab));
  const tabNames = effectiveTabs.map((tab) => tab.label).join(", ");`;
const displayTabsBlock = `  } = getWorkbookTabsWithLegacyGrammar({ tabs, ariaLabel });
  const displayTabs = tabDescriptionOverrides
    ? effectiveTabs.map((tab) =>
        Object.prototype.hasOwnProperty.call(tabDescriptionOverrides, tab.key)
          ? { ...tab, description: tabDescriptionOverrides[tab.key] }
          : tab,
      )
    : effectiveTabs;
  const activeIndex = Math.max(0, displayTabs.findIndex((tab) => tab.key === activeTab));
  const tabNames = displayTabs.map((tab) => tab.label).join(", ");`;
if (!standardSource.includes("const displayTabs = tabDescriptionOverrides")) {
  if (!standardSource.includes(effectiveTabsAnchor)) {
    throw new Error("Could not find WorkbookTabNav effective-tabs block.");
  }
  standardSource = standardSource.replace(effectiveTabsAnchor, displayTabsBlock);
}

standardSource = standardSource.replace("          {effectiveTabs.map((tab) => (", "          {displayTabs.map((tab) => (");
standardSource = standardSource.replace(
  "          Tab {activeIndex + 1} of {effectiveTabs.length} · Select {tabNames}.",
  "          Tab {activeIndex + 1} of {displayTabs.length} · Select {tabNames}.",
);

const overrideDeclarationCount = guidanceSource.split(tabDescriptionOverrideDeclaration).length - 1;
if (overrideDeclarationCount !== 1) {
  throw new Error(`Expected exactly one Day 25 label override declaration, found ${overrideDeclarationCount}.`);
}
if (
  !guidanceSource.includes("submissionContext={routeLockedSubmissionContext}") &&
  !guidanceSource.includes("submissionContext={resolveA2FallbackSubmissionContext(workbookDay)}")
) {
  throw new Error("Days 24-26 fallback submissions are not route-locked.");
}
if (guidanceSource.includes("STANDARD_WORKBOOK_TABS.map((tab) =>")) {
  throw new Error("Day 25 fallback still maps STANDARD_WORKBOOK_TABS before WorkbookTabNav.");
}
if (!guidanceSource.includes(day25TabsMarker)) {
  throw new Error("Day 25 shared workbook tabs were not generated.");
}
if (!guidanceSource.includes('{ key: "lesen2", label: "Teil 4", description: "Lesen" }')) {
  throw new Error("Day 25 Teil 4 is not exposed as the second reading tab.");
}
if (!guidanceSource.includes("const navigationTargets = workbookDay === 25")) {
  throw new Error("Day 25 shared navigation does not use its dedicated click targets.");
}
if (!guidanceSource.includes(day25FallbackNav)) {
  throw new Error("Day 25 custom tabs are not mounted by the shared fallback navigation.");
}
if (!standardSource.includes("const displayTabs = tabDescriptionOverrides")) {
  throw new Error("WorkbookTabNav cannot safely apply post-integration label overrides.");
}

fs.writeFileSync(guidancePath, guidanceSource, "utf8");
fs.writeFileSync(standardComponentsPath, standardSource, "utf8");
console.log("Patched A2 fallback submissions, Grammar integration and Day 25 reading-only navigation.");
