import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetPath = path.join(root, "web/src/components/A2LegacyStandardWorkbookNavigationImpl.js");
const navigationWrapperPath = path.join(root, "web/src/components/A2LegacyStandardWorkbookNavigation.js");
const guidancePath = path.join(root, "web/src/components/A2B1WorkbookGuidance.js");
const day23WorkbookPath = path.join(
  root,
  "web/src/components/A2Day23WieKommstDuZurSchuleOderZurArbeitWorkbookPage.js",
);
const day23Path = "/campus/course/a2-day-23-wie-kommst-du-zur-schule-oder-zur-arbeit-workbook";
const legacyPortalBypassPaths = [
  day23Path,
  "/campus/course/a2-day-24-einen-urlaub-planen-workbook",
  "/campus/course/a2-day-25-tagesablauf-workbook",
  "/campus/course/a2-day-26-gefuehle-in-verschiedenen-situationen-workbook",
];
const forcedSharedFallbackPaths = legacyPortalBypassPaths.slice(1);
let source = fs.readFileSync(targetPath, "utf8");
let navigationWrapperSource = fs.readFileSync(navigationWrapperPath, "utf8");
let guidanceSource = fs.readFileSync(guidancePath, "utf8");
let day23Source = fs.readFileSync(day23WorkbookPath, "utf8");

const helperMarker = "export const insertA2LegacyPortalMountBefore";
const helperAnchor = `export const findA2LegacyWorkbookTabRow = (root = document) => {
  if (!root?.querySelectorAll) return null;

  return (
    Array.from(root.querySelectorAll("nav, div"))
      .filter(
        (container) =>
          !container.closest?.("[data-a2-standard-legacy-nav-root]") &&
          !container.hasAttribute?.("data-workbook-tab-navigation"),
      )
      .map((container) => {
        const buttons = Array.from(container.children || []).filter(
          (child) => child.tagName === "BUTTON",
        );
        const keys = new Set(buttons.map((button) => getA2LegacyWorkbookTabKey(button.textContent)));
        return { container, buttons, keys };
      })
      .filter(({ buttons }) => buttons.length >= 4 && buttons.length <= 8)
      .find(({ keys }) => ["teil1", "teil2", "teil3", "teil4"].every((key) => keys.has(key)))
      ?.container || null
  );
};`;

const helperReplacement = `${helperAnchor}

export const insertA2LegacyPortalMountBefore = (parent, mount, referenceNode) => {
  if (!parent || !mount || !referenceNode) return false;
  if (referenceNode.parentNode !== parent || !parent.contains(referenceNode)) return false;

  try {
    parent.insertBefore(mount, referenceNode);
    return mount.parentNode === parent;
  } catch (error) {
    if (error?.name !== "NotFoundError") throw error;
    mount.remove();
    return false;
  }
};`;

if (!source.includes(helperMarker)) {
  if (!source.includes(helperAnchor)) {
    throw new Error("Could not find the A2 legacy tab-row helper insertion point.");
  }
  source = source.replace(helperAnchor, helperReplacement);
}

const oldRemoveMount = `    const removeMount = () => {
      navMountRef.current?.remove();
      navMountRef.current = null;
      setNavRoot(null);
    };`;

const safeRetireMount = `    const retireMount = (mount = navMountRef.current) => {
      if (!mount) return;
      if (navMountRef.current === mount) navMountRef.current = null;
      setNavRoot((current) => (current === mount ? null : current));

      let attempts = 0;
      const removeAfterPortalUnmount = () => {
        if (!mount.isConnected) return;
        if (!mount.hasChildNodes()) {
          mount.remove();
          return;
        }
        attempts += 1;
        if (attempts < 8) window.setTimeout(removeAfterPortalUnmount, 0);
      };

      window.setTimeout(removeAfterPortalUnmount, 0);
    };`;

if (source.includes(oldRemoveMount)) {
  source = source.replace(oldRemoveMount, safeRetireMount);
}

const oldRowReplacement = `      if (nativeRowRef.current && nativeRowRef.current !== row) {
        restoreNativeRow();
        removeMount();
      }`;

const safeRowReplacement = `      if (nativeRowRef.current && nativeRowRef.current !== row) {
        const previousMount = navMountRef.current;
        restoreNativeRow();
        retireMount(previousMount);
        scheduleDecorate();
        return;
      }`;

if (source.includes(oldRowReplacement)) {
  source = source.replace(oldRowReplacement, safeRowReplacement);
}

const oldInsert = `      let mount = row.parentNode.querySelector(":scope > [data-a2-standard-legacy-nav-root]");
      if (!mount) {
        mount = document.createElement("div");
        mount.setAttribute("data-a2-standard-legacy-nav-root", \`day-\${config.day}\`);
        mount.style.width = "100%";
        mount.style.marginTop = "8px";
        row.parentNode.insertBefore(mount, row);
      }

      navMountRef.current = mount;
      setNavRoot(mount);`;

const safeInsert = `      const rowParent = row.parentNode;
      if (!rowParent || row.parentNode !== rowParent || !rowParent.contains(row)) return;

      let mount = rowParent.querySelector(":scope > [data-a2-standard-legacy-nav-root]");
      if (!mount) {
        mount = document.createElement("div");
        mount.setAttribute("data-a2-standard-legacy-nav-root", \`day-\${config.day}\`);
        mount.style.width = "100%";
        mount.style.marginTop = "8px";
        if (!insertA2LegacyPortalMountBefore(rowParent, mount, row)) {
          scheduleDecorate();
          return;
        }
      }

      if (!mount.isConnected || mount.parentNode !== rowParent) {
        scheduleDecorate();
        return;
      }

      navMountRef.current = mount;
      setNavRoot((current) => (current === mount ? current : mount));`;

if (source.includes(oldInsert)) {
  source = source.replace(oldInsert, safeInsert);
}

source = source.replace(
  `      removeMount();\n      setPanelRoot(null);`,
  `      retireMount();\n      setPanelRoot(null);`,
);

const supportedRouteAnchor = "  const isSupportedRoute = A2_LEGACY_STANDARD_NAV_PATHS.has(normalizedPath);";
const previousDay23Guard = `  const isSupportedRoute =
    A2_LEGACY_STANDARD_NAV_PATHS.has(normalizedPath) && normalizedPath !== "${day23Path}";`;
const safeSupportedRoute = `  const isSupportedRoute =
    A2_LEGACY_STANDARD_NAV_PATHS.has(normalizedPath) &&
    !${JSON.stringify(legacyPortalBypassPaths)}.includes(normalizedPath);`;
if (!navigationWrapperSource.includes(safeSupportedRoute)) {
  if (navigationWrapperSource.includes(previousDay23Guard)) {
    navigationWrapperSource = navigationWrapperSource.replace(previousDay23Guard, safeSupportedRoute);
  } else if (navigationWrapperSource.includes(supportedRouteAnchor)) {
    navigationWrapperSource = navigationWrapperSource.replace(supportedRouteAnchor, safeSupportedRoute);
  } else {
    throw new Error("Could not find the A2 legacy supported-route guard.");
  }
}

const forcedPathsAnchor = `  "/campus/course/a2-day-13-vorstellungsgespraech-workbook",
];`;
const forcedPathLines = forcedSharedFallbackPaths.map((route) => `  "${route}",`).join("\n");
const expandedForcedPaths = `  "/campus/course/a2-day-13-vorstellungsgespraech-workbook",
${forcedPathLines}
];`;
if (!forcedSharedFallbackPaths.every((route) => guidanceSource.includes(`  "${route}",`))) {
  if (!guidanceSource.includes(forcedPathsAnchor)) {
    throw new Error("Could not find the forced A2 shared-tab route list.");
  }
  guidanceSource = guidanceSource.replace(forcedPathsAnchor, expandedForcedPaths);
}

// Day 23 owns its navigation natively. Do not use A2B1WorkbookGuidance to discover,
// hide or proxy-click another React tab row on this route.
const day23GuidanceImport =
  'import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";';
const day23NativeImports = `import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import { WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import { STANDARD_WORKBOOK_TABS, WorkbookTabNav } from "./StandardWorkbookComponents";`;
if (day23Source.includes(day23GuidanceImport)) {
  day23Source = day23Source.replace(day23GuidanceImport, day23NativeImports);
}

day23Source = day23Source.replace(
  `const tabs = [
  { key: "teil1", label: "Teil 1 · Group Practice" },
  { key: "teil2", label: "Teil 2 · Schreiben" },
  { key: "teil3", label: "Teil 3 · Lesen" },
  { key: "teil4", label: "Teil 4 · Hören" },
  { key: "references", label: "5. Ref" },
];`,
  "const tabs = STANDARD_WORKBOOK_TABS;",
);

day23Source = day23Source.replace('const [activeTab, setActiveTab] = useState("teil1");', 'const [activeTab, setActiveTab] = useState("grammar");');

day23Source = day23Source.replace(
  `        <p style={{ margin: 0, color: "#4b5563" }}>
          Complete each Teil and submit your final answers in the submission area (not on this page).
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tabs.map((tab) => (
            <button key={tab.key} style={tabButtonStyle(tab.key === activeTab)} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </button>
          ))}
        </div>`,
  `        <p style={{ margin: 0, color: "#4b5563" }}>
          Complete each Teil. Submit only Teil 2 · Schreiben and Teil 3 · Lesen. Teil 4 · Hören is self-check only.
        </p>

        <WorkbookTabNav
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={tabs}
          ariaLabel="A2 Day 23 workbook sections"
        />`,
);

const day23OldGuidance = "      <A2B1WorkbookGuidance />";
const day23NativeGuidance = `      <details
        data-a2-day23-native-guidance="true"
        style={{ ...cardStyle, border: "1px solid #bfdbfe", background: "#eff6ff", color: "#1e3a8a" }}
      >
        <summary style={{ cursor: "pointer", fontWeight: 800 }}>How this workbook works · open guide</summary>
        <div style={{ display: "grid", gap: 8, lineHeight: 1.6 }}>
          <p style={{ margin: 0 }}><strong>Grammar:</strong> review the lesson notes before the four workbook parts.</p>
          <p style={{ margin: 0 }}><strong>Teil 1 · Sprechen:</strong> group practice only; do not submit it.</p>
          <p style={{ margin: 0 }}><strong>Teil 2 · Schreiben and Teil 3 · Lesen:</strong> these are the school-marked parts. Submit only these final answers through Submit.</p>
          <p style={{ margin: 0 }}><strong>Teil 4 · Hören:</strong> self-check only. Check your answers with the Goethe video and do not send Hören through Submit.</p>
        </div>
      </details>`;
if (day23Source.includes(day23OldGuidance)) {
  day23Source = day23Source.replace(day23OldGuidance, day23NativeGuidance);
}

[
  ['activeTab === "teil1"', 'activeTab === "sprechen"'],
  ['activeTab === "teil2"', 'activeTab === "schreiben"'],
  ['activeTab === "teil3"', 'activeTab === "lesen"'],
  ['activeTab === "teil4"', 'activeTab === "hoeren"'],
].forEach(([from, to]) => {
  day23Source = day23Source.replaceAll(from, to);
});

const oldFinalSubmission = `      <div style={{ ...cardStyle, border: "1px solid #bfdbfe", background: "#eff6ff" }}>
        <h2 style={{ ...sectionTitle, color: "#1e3a8a" }}>Final submission</h2>
        <p style={{ margin: 0, lineHeight: 1.7, color: "#1e3a8a" }}>
          Submit your final answers in the submission area. Do not submit answers directly on this workbook page.
        </p>
        <a href="/campus/course?submitWork=1" target="_blank" rel="noreferrer">
          Go to submission area
        </a>
      <WorkbookSubmissionReminder />
      </div>`;
const nativeSubmitPanel = `      {activeTab === "submit" && (
        <section style={cardStyle}>
          <h2 style={sectionTitle}>Submit Workbook · Day 23 · Kapitel 9.23</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Submit only <strong>Teil 2 · Schreiben</strong> and <strong>Teil 3 · Lesen</strong>. Do not submit Teil 1 or Teil 4 · Hören.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7, color: "#475569" }}>
            Teil 4 · Hören is self-check practice; compare your answers with the Goethe video.
          </p>
          <div className="a2-day23-submission-page" style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}>
            <style>{\`.a2-day23-submission-page > div > section:first-child { display: none !important; }
            .a2-day23-submission-page select { display: none !important; }\`}</style>
            <AssignmentSubmissionPage
              submissionContext={{
                level: "A2",
                day: 23,
                assignmentKey: "A2-9.23",
                canonicalAssignmentKey: "A2-9.23",
              }}
            />
          </div>
        </section>
      )}`;
if (day23Source.includes(oldFinalSubmission)) {
  day23Source = day23Source.replace(oldFinalSubmission, nativeSubmitPanel);
}

if (!source.includes(helperMarker)) {
  throw new Error("A2 legacy portal insertion is still missing its stale-reference guard.");
}
if (!source.includes("const retireMount =")) {
  throw new Error("A2 legacy portal host removal is still synchronous.");
}
if (!source.includes("retireMount(previousMount);")) {
  throw new Error("A2 legacy portal row replacement is not staged.");
}
if (!source.includes("insertA2LegacyPortalMountBefore(rowParent, mount, row)")) {
  throw new Error("A2 legacy portal insertion does not use the safe helper.");
}
if (source.includes("row.parentNode.insertBefore(mount, row)")) {
  throw new Error("Unsafe A2 legacy insertBefore call is still present.");
}
if (source.includes("navMountRef.current?.remove()")) {
  throw new Error("A2 legacy portal host is still removed before React unmounts.");
}
if (!navigationWrapperSource.includes(safeSupportedRoute)) {
  throw new Error("A2 Days 23-26 are still routed through the legacy portal navigation.");
}
if (!forcedSharedFallbackPaths.every((route) => guidanceSource.includes(`  "${route}",`))) {
  throw new Error("A2 Days 24-26 are not all forced onto the in-page shared workbook navigation.");
}
if (!day23Source.includes('ariaLabel="A2 Day 23 workbook sections"')) {
  throw new Error("A2 Day 23 still does not own the standard WorkbookTabNav natively.");
}
if (day23Source.includes("<A2B1WorkbookGuidance")) {
  throw new Error("A2 Day 23 still depends on DOM-discovery workbook guidance.");
}
if (!day23Source.includes('data-a2-day23-native-guidance="true"')) {
  throw new Error("A2 Day 23 is missing its route-specific self-check guidance.");
}
if (!day23Source.includes("do not send Hören through Submit")) {
  throw new Error("A2 Day 23 guidance still does not clearly mark Hören as self-check only.");
}

fs.writeFileSync(targetPath, source, "utf8");
fs.writeFileSync(navigationWrapperPath, navigationWrapperSource, "utf8");
fs.writeFileSync(guidancePath, guidanceSource, "utf8");
fs.writeFileSync(day23WorkbookPath, day23Source, "utf8");
console.log("Staged A2 portal safety; Day 23 now owns native tabs and Days 24-26 use the safe shared fallback.");
