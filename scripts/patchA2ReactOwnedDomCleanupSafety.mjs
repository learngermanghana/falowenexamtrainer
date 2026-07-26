import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetPath = path.join(root, "web/src/components/a2GoetheListeningOnlyCleanup.js");
let source = fs.readFileSync(targetPath, "utf8");

const helperMarker = "const hideReactOwnedNode = (element) =>";
const helperAnchor = `const findByText = (root, selector, phrase) => {
  const normalizedPhrase = normalizeText(phrase);
  return (
    Array.from(root?.querySelectorAll?.(selector) || []).find((element) =>
      normalizeText(element.textContent).includes(normalizedPhrase),
    ) || null
  );
};`;
const helperReplacement = `${helperAnchor}

// These workbook pages are rendered by React. Presentation cleanup must never
// detach or inject children inside React-owned trees, otherwise a later render
// can try to insert before a node React still believes exists and throw
// Node.insertBefore / NotFoundError. Hide obsolete UI in place instead.
const hideReactOwnedNode = (element) => {
  if (!element) return false;
  const alreadyHidden = element.hidden && element.style.display === "none";
  element.hidden = true;
  element.style.display = "none";
  element.setAttribute("aria-hidden", "true");
  element.setAttribute("data-a2-react-owned-hidden", "true");
  return !alreadyHidden;
};

const reusableListeningNotePhrases = [
  "this is a goethe standard horen test",
  "please be aware that this is a goethe standard horverstehen test",
  "the only parts that will be officially evaluated",
  "you must mark your own horen results",
];

const findReusableListeningNote = (parent) =>
  Array.from(parent?.querySelectorAll?.("p") || []).find((paragraph) => {
    const text = normalizeText(paragraph.textContent);
    return reusableListeningNotePhrases.some((phrase) => text.includes(phrase));
  }) || null;`;

if (!source.includes(helperMarker)) {
  if (!source.includes(helperAnchor)) {
    throw new Error("Could not find A2 cleanup helper insertion point.");
  }
  source = source.replace(helperAnchor, helperReplacement);
}

const unsafeRemoveDirectChild = `  if (!child) return false;
  child.remove();
  return true;`;
const safeRemoveDirectChild = `  if (!child) return false;
  return hideReactOwnedNode(child);`;
if (source.includes(unsafeRemoveDirectChild)) {
  source = source.replace(unsafeRemoveDirectChild, safeRemoveDirectChild);
}

const oldEnsureListeningNote = `const ensureListeningNote = (root, heading, text) => {
  if (!heading?.parentElement) return false;
  let note = heading.parentElement.querySelector('[data-a2-goethe-listening-note="true"]');
  if (!note) {
    note = root.createElement("p");
    note.setAttribute("data-a2-goethe-listening-note", "true");
    note.style.margin = "0";
    note.style.lineHeight = "1.7";
    note.style.fontWeight = "700";
    note.style.color = "#1e3a8a";
    note.style.background = "#eff6ff";
    note.style.border = "1px solid #bfdbfe";
    note.style.borderRadius = "10px";
    note.style.padding = "10px 12px";
    heading.insertAdjacentElement("afterend", note);
  }
  if (note.textContent === text) return false;
  note.textContent = text;
  return true;
};`;
const safeEnsureListeningNote = `const ensureListeningNote = (_root, heading, text) => {
  if (!heading?.parentElement) return false;
  let note = heading.parentElement.querySelector('[data-a2-goethe-listening-note="true"]');
  if (!note) note = findReusableListeningNote(heading.parentElement);
  if (!note) return false;

  note.hidden = false;
  note.style.display = "block";
  note.removeAttribute("aria-hidden");
  note.removeAttribute("data-a2-react-owned-hidden");
  note.setAttribute("data-a2-goethe-listening-note", "true");
  note.style.margin = "0";
  note.style.lineHeight = "1.7";
  note.style.fontWeight = "700";
  note.style.color = "#1e3a8a";
  note.style.background = "#eff6ff";
  note.style.border = "1px solid #bfdbfe";
  note.style.borderRadius = "10px";
  note.style.padding = "10px 12px";

  if (note.textContent === text) return false;
  note.textContent = text;
  return true;
};`;
if (source.includes(oldEnsureListeningNote)) {
  source = source.replace(oldEnsureListeningNote, safeEnsureListeningNote);
}

const replacements = [
  ["    note.remove();\n    changed = true;", "    changed = hideReactOwnedNode(note) || changed;"],
  ["    panel.remove();\n    changed = true;", "    changed = hideReactOwnedNode(panel) || changed;"],
  ["    paragraph.remove();\n    changed = true;", "    changed = hideReactOwnedNode(paragraph) || changed;"],
  ["        element.remove();\n        changed = true;", "        changed = hideReactOwnedNode(element) || changed;"],
  ["      listeningItem.remove();\n      changed = true;", "      changed = hideReactOwnedNode(listeningItem) || changed;"],
  ["        sibling.remove();\n        sibling = next;", "        hideReactOwnedNode(sibling);\n        changed = true;\n        sibling = next;"],
  ["      questionHeading.remove();\n      changed = true;", "      changed = hideReactOwnedNode(questionHeading) || changed;"],
];

for (const [unsafe, safe] of replacements) {
  source = source.replaceAll(unsafe, safe);
}

if (!source.includes(helperMarker)) {
  throw new Error("A2 React-owned cleanup safety helper is missing.");
}
if (source.includes('heading.insertAdjacentElement("afterend", note)')) {
  throw new Error("A2 cleanup still injects a listening note into React-owned DOM.");
}
if (/\b(?:child|note|panel|paragraph|element|listeningItem|sibling|questionHeading)\.remove\(\)/.test(source)) {
  throw new Error("A2 cleanup still detaches a React-owned workbook node.");
}
if (!source.includes('data-a2-react-owned-hidden')) {
  throw new Error("A2 cleanup no longer marks safely hidden React-owned nodes.");
}

fs.writeFileSync(targetPath, source, "utf8");
console.log("Patched A2 workbook presentation cleanup to preserve React-owned DOM nodes.");
