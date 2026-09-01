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
  guidanceSource = guidanceSource.replace(assignmentImport, `${assignmentImport}\n${contextualImport}`);
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
  const learningAnchor = `];\n\nconst A2_DAYS_11_TO_15_LEARNING = {`;
  if (!guidanceSource.includes(learningAnchor)) {
    throw new Error("Could not find the universal A2 fallback tabs boundary.");
  }

  const resolverBlock = `];

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
};

const A2_DAYS_11_TO_15_LEARNING = {`;

  guidanceSource = guidanceSource.replace(learningAnchor, resolverBlock);
}

// Older versions of this patch introduced a memoized variable that a later runtime
// safety patch intentionally removed from the JSX. Remove it here as well so repeated
// pretest runs converge on one stable representation instead of re-wrapping Submit.
const obsoleteRouteLockedMemo = `  const routeLockedSubmissionContext = useMemo(
    () => resolveA2FallbackSubmissionContext(workbookDay),
    [workbookDay],
  );\n`;
if (guidanceSource.includes(obsoleteRouteLockedMemo)) {
  guidanceSource = guidanceSource.replace(obsoleteRouteLockedMemo, "");
}

const tabDescriptionOverrideDeclaration = '  const tabDescriptionOverrides = workbookDay === 25 ? { hoeren: "Lesen" } : null;';
if (!guidanceSource.includes(tabDescriptionOverrideDeclaration)) {
  const submitRefAnchor = "  const submitRef = useRef(null);";
  if (!guidanceSource.includes(submitRefAnchor)) {
    throw new Error("Could not find universal A2 submit ref for Day 25 label override.");
  }
  guidanceSource = guidanceSource.replace(
    submitRefAnchor,
    `${submitRefAnchor}\n${tabDescriptionOverrideDeclaration}`,
  );
}

// patchA2ReactOwnedDomCleanupSafety may run immediately before this script and add a
// Day-25-only mapped `fallbackTabs` array. That copy breaks the identity check used to
// integrate Grammar. Collapse it back to STANDARD_WORKBOOK_TABS and let WorkbookTabNav
// apply only a display-label override. Do this every run so the patch chain is idempotent.
const mappedFallbackTabs = `  const fallbackTabs = useMemo(
    () =>
      workbookDay === 25
        ? STANDARD_WORKBOOK_TABS.map((tab) =>
            tab.key === "hoeren" ? { ...tab, description: "Lesen" } : tab,
          )
        : STANDARD_WORKBOOK_TABS,
    [workbookDay],
  );`;
if (guidanceSource.includes(mappedFallbackTabs)) {
  guidanceSource = guidanceSource.replace(mappedFallbackTabs, "");
}

const mappedTabsProp = "        tabs={fallbackTabs}";
const standardTabsProp = "        tabs={STANDARD_WORKBOOK_TABS}";
const overrideProp = "        tabDescriptionOverrides={tabDescriptionOverrides}";
if (guidanceSource.includes(mappedTabsProp)) {
  guidanceSource = guidanceSource.replace(
    mappedTabsProp,
    `${standardTabsProp}\n${overrideProp}`,
  );
} else if (!guidanceSource.includes(overrideProp)) {
  if (!guidanceSource.includes(standardTabsProp)) {
    throw new Error("Could not find universal A2 WorkbookTabNav tabs prop.");
  }
  guidanceSource = guidanceSource.replace(
    standardTabsProp,
    `${standardTabsProp}\n${overrideProp}`,
  );
}

const unsafeRouteLockedSubmission = `          {routeLockedSubmissionContext ? (
            <ContextualAssignmentSubmissionPage submissionContext={routeLockedSubmissionContext} />
          ) : (
            <AssignmentSubmissionPage />
          )}`;
const safeSubmission = `          {resolveA2FallbackSubmissionContext(workbookDay) ? (
            <ContextualAssignmentSubmissionPage submissionContext={resolveA2FallbackSubmissionContext(workbookDay)} />
          ) : (
            <AssignmentSubmissionPage />
          )}`;

if (!guidanceSource.includes(safeSubmission)) {
  if (guidanceSource.includes(unsafeRouteLockedSubmission)) {
    guidanceSource = guidanceSource.replace(unsafeRouteLockedSubmission, safeSubmission);
  } else {
    const genericFallbackMount = `          <AssignmentSubmissionPage />
        </div>
      ) : null}
    </section>`;
    const lockedFallbackMount = `${safeSubmission}
        </div>
      ) : null}
    </section>`;
    if (!guidanceSource.includes(genericFallbackMount)) {
      throw new Error("Could not find the generic universal A2 fallback submission mount.");
    }
    guidanceSource = guidanceSource.replace(genericFallbackMount, lockedFallbackMount);
  }
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
if (!guidanceSource.includes(safeSubmission)) {
  throw new Error("Days 24-26 fallback submissions are not route-locked with the runtime-safe resolver.");
}
if (guidanceSource.includes("submissionContext={routeLockedSubmissionContext}")) {
  throw new Error("Obsolete routeLockedSubmissionContext JSX remains in A2 workbook guidance.");
}
if (guidanceSource.includes("const fallbackTabs = useMemo(") || guidanceSource.includes("tabs={fallbackTabs}")) {
  throw new Error("Day 25 fallback still maps STANDARD_WORKBOOK_TABS before Grammar integration.");
}
if (!guidanceSource.includes(standardTabsProp) || !guidanceSource.includes(overrideProp)) {
  throw new Error("Day 25 fallback no longer preserves STANDARD_WORKBOOK_TABS identity through Grammar integration.");
}
if (!standardSource.includes("const displayTabs = tabDescriptionOverrides")) {
  throw new Error("WorkbookTabNav cannot safely apply post-integration label overrides.");
}

fs.writeFileSync(guidancePath, guidanceSource, "utf8");
fs.writeFileSync(standardComponentsPath, standardSource, "utf8");
console.log("Patched A2 fallback tabs idempotently with route-locked submission context and Grammar integration.");
