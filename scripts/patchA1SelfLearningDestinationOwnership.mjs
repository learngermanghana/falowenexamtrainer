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
console.log("Applied native A1 self-learning destination ownership.");
