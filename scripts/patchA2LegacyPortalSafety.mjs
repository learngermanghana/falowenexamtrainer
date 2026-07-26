import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetPath = path.join(root, "web/src/components/A2LegacyStandardWorkbookNavigationImpl.js");
const navigationWrapperPath = path.join(root, "web/src/components/A2LegacyStandardWorkbookNavigation.js");
const guidancePath = path.join(root, "web/src/components/A2B1WorkbookGuidance.js");
const inPageSharedNavPaths = [
  "/campus/course/a2-day-23-wie-kommst-du-zur-schule-oder-zur-arbeit-workbook",
  "/campus/course/a2-day-24-einen-urlaub-planen-workbook",
  "/campus/course/a2-day-25-tagesablauf-workbook",
  "/campus/course/a2-day-26-gefuehle-in-verschiedenen-situationen-workbook",
];
let source = fs.readFileSync(targetPath, "utf8");
let navigationWrapperSource = fs.readFileSync(navigationWrapperPath, "utf8");
let guidanceSource = fs.readFileSync(guidancePath, "utf8");

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
    A2_LEGACY_STANDARD_NAV_PATHS.has(normalizedPath) && normalizedPath !== "${inPageSharedNavPaths[0]}";`;
const safeSupportedRoute = `  const isSupportedRoute =
    A2_LEGACY_STANDARD_NAV_PATHS.has(normalizedPath) &&
    !${JSON.stringify(inPageSharedNavPaths)}.includes(normalizedPath);`;
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
const forcedPathLines = inPageSharedNavPaths.map((route) => `  "${route}",`).join("\n");
const expandedForcedPaths = `  "/campus/course/a2-day-13-vorstellungsgespraech-workbook",
${forcedPathLines}
];`;
if (!inPageSharedNavPaths.every((route) => guidanceSource.includes(`  "${route}",`))) {
  if (!guidanceSource.includes(forcedPathsAnchor)) {
    throw new Error("Could not find the forced A2 shared-tab route list.");
  }
  guidanceSource = guidanceSource.replace(forcedPathsAnchor, expandedForcedPaths);
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
if (!inPageSharedNavPaths.every((route) => guidanceSource.includes(`  "${route}",`))) {
  throw new Error("A2 Days 23-26 are not all forced onto the in-page shared workbook navigation.");
}

fs.writeFileSync(targetPath, source, "utf8");
fs.writeFileSync(navigationWrapperPath, navigationWrapperSource, "utf8");
fs.writeFileSync(guidancePath, guidanceSource, "utf8");
console.log("Staged A2 legacy portal safety and routed Days 23-26 through the in-page shared tabs.");
