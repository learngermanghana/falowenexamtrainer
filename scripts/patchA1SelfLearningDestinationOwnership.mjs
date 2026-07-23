import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(repositoryRoot, "web/src/components/A1CoursePracticeAutoMount.js");
let source = fs.readFileSync(sourcePath, "utf8");

const replaceOnce = (before, after, label) => {
  if (source.includes(after)) return;
  if (!source.includes(before)) {
    throw new Error(`A1 self-learning destination patch anchor missing: ${label}`);
  }
  source = source.replace(before, after);
};

const replaceTextOnce = (text, before, after, label) => {
  if (text.includes(after)) return text;
  if (!text.includes(before)) {
    throw new Error(`A1 self-learning destination patch anchor missing: ${label}`);
  }
  return text.replace(before, after);
};

replaceOnce(
  `const A1_SELF_LEARNING_PRACTICES = A1_CANONICAL_LESSON_CATALOG.filter(
  (lesson) => lesson.kind === "practice",
);`,
  `const A1_SELF_LEARNING_PRACTICES = A1_CANONICAL_LESSON_CATALOG.filter(
  (lesson) => lesson.kind === "practice",
);
const A1_NATIVE_DESTINATION_MATERIAL_PATHS = new Set([
  "/campus/course/modal-verbs-day-14-3-6",
]);`,
  "native destination ownership",
);

replaceOnce(
  `    if (practice && currentIsDestination) {
      if (Number(practice.day) === 19) prepareDay19Page(container);

      // The canonical workbook page already owns the Falowen Radio gate. Once
      // Radio is complete, mount the shared materials selector on that same
      // destination so teacher, AI and grammar resources are not skipped.
      if (materialsCompleted || (journeyResources?.radio && !radioCompleted)) {
        return undefined;
      }
    }`,
  `    if (practice && currentIsDestination) {
      if (A1_NATIVE_DESTINATION_MATERIAL_PATHS.has(pathname)) return undefined;
      if (Number(practice.day) === 19) prepareDay19Page(container);

      // The fixed destination overlay owns the materials step. Radio-first
      // destinations wait for the route-level radio gate, while routes without
      // radio open their supporting materials immediately.
      if (materialsCompleted || (journeyResources?.radio && !radioCompleted)) {
        return undefined;
      }
    }`,
  "destination ownership guard",
);

replaceOnce(
  `    const mount = document.createElement("div");
    mount.id = "falowen-a1-practice-mount";
    mount.style.margin = "16px 0";

    if (practice) insertPracticeMount(container, mount);
    else insertWritingMount(container, mount);

    const restoreContent = practice ? hideSelfLearningContent(container, mount) : () => {};`,
  `    const mount = document.createElement("div");
    mount.id = "falowen-a1-practice-mount";
    mount.style.margin = "16px 0";

    const isDestinationOverlay = Boolean(practice && currentIsDestination);
    let restoreContent;

    if (isDestinationOverlay) {
      const previousBodyOverflow = document.body.style.overflow;
      mount.setAttribute("data-a1-self-learning-destination-overlay", "true");
      Object.assign(mount.style, {
        background: "#f8fafc",
        inset: "0",
        margin: "0",
        overflowY: "auto",
        padding: "18px 12px 40px",
        position: "fixed",
        zIndex: "9999",
      });
      document.body.style.overflow = "hidden";
      document.body.appendChild(mount);
      restoreContent = () => {
        document.body.style.overflow = previousBodyOverflow;
      };
    } else {
      if (practice) insertPracticeMount(container, mount);
      else insertWritingMount(container, mount);
      restoreContent = practice ? hideSelfLearningContent(container, mount) : () => {};
    }`,
  "fixed destination materials overlay",
);

fs.writeFileSync(sourcePath, source, "utf8");

const sharedNavigationPath = path.join(
  repositoryRoot,
  "web/src/components/A1SharedPracticeWorkbookNavigation.jsx",
);
let sharedNavigationSource = fs.readFileSync(sharedNavigationPath, "utf8");

sharedNavigationSource = replaceTextOnce(
  sharedNavigationSource,
  `const firstSectionHeading = (section) =>
  Array.from(section?.querySelectorAll?.("h2, h3") || []).find((heading) => normalizeText(heading.textContent)) || null;`,
  `const practiceSectionElements = (root) => {
  if (!root?.querySelectorAll) return [];
  const teilHeadings = Array.from(root.querySelectorAll("h2, h3")).filter((heading) =>
    /^Teil\\s*\\d+\\b/i.test(normalizeText(heading.textContent)),
  );
  if (!teilHeadings.length) return topLevelPracticeSections(root);

  const elements = teilHeadings
    .map((heading) => {
      let current = heading.parentElement;
      let best = current;

      while (current && current !== root) {
        const containsAnotherTeil = teilHeadings.some(
          (candidate) => candidate !== heading && current.contains(candidate),
        );
        if (containsAnotherTeil) break;
        best = current;
        current = current.parentElement;
      }

      return best || heading.parentElement;
    })
    .filter(Boolean);

  return elements.filter((element, index) => elements.indexOf(element) === index);
};

const firstSectionHeading = (section) =>
  Array.from(section?.querySelectorAll?.("h2, h3") || []).find((heading) => normalizeText(heading.textContent)) || null;`,
  "shared self-practice div-card section discovery",
);

sharedNavigationSource = replaceTextOnce(
  sharedNavigationSource,
  `export const findA1PracticeSections = (root) =>
  topLevelPracticeSections(root)`,
  `export const findA1PracticeSections = (root) =>
  practiceSectionElements(root)`,
  "shared self-practice section source",
);

fs.writeFileSync(sharedNavigationPath, sharedNavigationSource, "utf8");

const sectionTabsPath = path.join(repositoryRoot, "web/src/components/A1WorkbookSectionTabs.js");
let sectionTabsSource = fs.readFileSync(sectionTabsPath, "utf8");

sectionTabsSource = replaceTextOnce(
  sectionTabsSource,
  `  const mainRoot = findMainRoot(root);

  if (hasNativeTutorMarkedWorkbookTabs(mainRoot)) {`,
  `  const mainRoot = findMainRoot(root);

  // Shared self-practice navigation is the single owner of completed practice
  // workbooks. The legacy controller must release any elements it previously
  // hid, otherwise its Overview state can leave the selected Teil blank.
  if (mainRoot.querySelector('[data-a1-shared-practice-navigation="true"]')) {
    restoreManagedElements(root);
    return false;
  }

  if (hasNativeTutorMarkedWorkbookTabs(mainRoot)) {`,
  "legacy workbook tabs yield to shared self-practice navigation",
);

fs.writeFileSync(sectionTabsPath, sectionTabsSource, "utf8");

console.log("Applied native A1 self-learning destination ownership and workbook tab compatibility.");
