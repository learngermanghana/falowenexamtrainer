import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const guidancePath = path.join(root, "web/src/components/A2B1WorkbookGuidance.js");

let source = fs.readFileSync(guidancePath, "utf8");

const day25TabsMarker = "const A2_DAY25_WORKBOOK_TABS = [";
const universalTabsAnchor = "const UNIVERSAL_A2_WORKBOOK_TABS = [";
const day25Tabs = `const A2_DAY25_WORKBOOK_TABS = [
  { key: "sprechen", label: "Teil 1", description: "Sprechen" },
  { key: "schreiben", label: "Teil 2", description: "Schreiben" },
  { key: "lesen", label: "Teil 3", description: "Lesen" },
  { key: "lesen2", label: "Teil 4", description: "Lesen" },
  { key: "references", label: "Ref", description: "Notes" },
  { key: "submit", label: "Submit", description: "Send work" },
];

`;

if (!source.includes(day25TabsMarker)) {
  if (!source.includes(universalTabsAnchor)) {
    throw new Error("Could not find the universal A2 workbook tab definition for Day 25.");
  }
  source = source.replace(universalTabsAnchor, `${day25Tabs}${universalTabsAnchor}`);
}

const day25TargetsMarker = "const A2_DAY25_NAVIGATION_TARGETS = [";
const learningAnchor = "const A2_DAYS_11_TO_15_LEARNING = {";
const day25Targets = `const A2_DAY25_NAVIGATION_TARGETS = [
  ...UNIVERSAL_A2_WORKBOOK_TABS.filter((tab) => tab.key !== "hoeren"),
  { key: "lesen2", legacyKey: "teil4", match: /\\bteil\\s*4\\b|second reading|reading 2|lesen 2/i },
];

`;

if (!source.includes(day25TargetsMarker)) {
  if (!source.includes(learningAnchor)) {
    throw new Error("Could not find the A2 learning-data anchor for Day 25 navigation targets.");
  }
  source = source.replace(learningAnchor, `${day25Targets}${learningAnchor}`);
}

const legacyHandleLookup =
  '    const tab = UNIVERSAL_A2_WORKBOOK_TABS.find((item) => item.key === tabKey);';
const day25HandleLookup = `    const navigationTargets = workbookDay === 25
      ? A2_DAY25_NAVIGATION_TARGETS
      : UNIVERSAL_A2_WORKBOOK_TABS;
    const tab = navigationTargets.find((item) => item.key === tabKey);`;

if (source.includes(legacyHandleLookup)) {
  source = source.replace(legacyHandleLookup, day25HandleLookup);
} else if (!source.includes("const navigationTargets = workbookDay === 25")) {
  throw new Error("Could not route Day 25 shared tab clicks to the second reading target.");
}

const standardNavTabs = "        tabs={STANDARD_WORKBOOK_TABS}";
const day25NavTabs =
  "        tabs={workbookDay === 25 ? A2_DAY25_WORKBOOK_TABS : STANDARD_WORKBOOK_TABS}";

if (source.includes(standardNavTabs)) {
  source = source.replace(standardNavTabs, day25NavTabs);
} else if (!source.includes(day25NavTabs)) {
  throw new Error("Could not apply the Day 25 tab set to the shared A2 navigation.");
}

const genericNavigationCopy = `          Use the shared workbook tabs below: Grammar, Teil 1, Teil 2, Teil 3, Teil 4, Ref and Submit.`;
const day25AwareNavigationCopy = `          {workbookDay === 25
            ? "Use the shared workbook tabs below: Teil 1, Teil 2, Teil 3, Teil 4 Lesen, Ref and Submit."
            : "Use the shared workbook tabs below: Grammar, Teil 1, Teil 2, Teil 3, Teil 4, Ref and Submit."}`;

if (source.includes(genericNavigationCopy)) {
  source = source.replace(genericNavigationCopy, day25AwareNavigationCopy);
}

if (!source.includes(day25TabsMarker)) {
  throw new Error("Day 25 shared workbook tabs were not generated.");
}
if (!source.includes('{ key: "lesen2", label: "Teil 4", description: "Lesen" }')) {
  throw new Error("Day 25 Teil 4 is not exposed as the second reading tab.");
}
if (!source.includes("const navigationTargets = workbookDay === 25")) {
  throw new Error("Day 25 shared navigation does not use its dedicated click targets.");
}
if (!source.includes(day25NavTabs)) {
  throw new Error("Day 25 custom tabs are not mounted by the build-time shared navigation.");
}

fs.writeFileSync(guidancePath, source, "utf8");
console.log("Applied A2 Day 25 reading-only tabs to the build-time shared navigation path.");
