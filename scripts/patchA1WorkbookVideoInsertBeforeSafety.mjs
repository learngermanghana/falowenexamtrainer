import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetPath = path.join(root, "web/src/components/A1WorkbookVideoHeader.js");
const testPath = path.join(root, "web/src/components/A1WorkbookVideoHeader.test.js");

let source = fs.readFileSync(targetPath, "utf8");
let testSource = fs.readFileSync(testPath, "utf8");

const helperAnchor = `const nextNonVideoHeaderSibling = (element) => {\n  let sibling = element?.nextElementSibling || null;\n  while (sibling?.hasAttribute?.(HEADER_ATTRIBUTE)) sibling = sibling.nextElementSibling;\n  return sibling;\n};`;
const helper = `${helperAnchor}\n\nconst safeInsertBefore = (container, node, reference = null) => {\n  if (!container?.appendChild || !node) return false;\n  if (reference && reference.parentNode === container) {\n    container.insertBefore(node, reference);\n  } else {\n    container.appendChild(node);\n  }\n  return true;\n};`;
if (!source.includes("const safeInsertBefore =")) {
  if (!source.includes(helperAnchor)) throw new Error("A1 workbook video insertion helper anchor missing.");
  source = source.replace(helperAnchor, helper);
}

source = source.replace(
  "      insertion.container.insertBefore(existing, insertion.reference);",
  "      safeInsertBefore(insertion.container, existing, insertion.reference);",
);
source = source.replace(
  "  insertion.container.insertBefore(createVideoHeader(model), insertion.reference);",
  "  safeInsertBefore(insertion.container, createVideoHeader(model), insertion.reference);",
);

const privateAnchor = `  createVideoHeader,\n  normalizePath,`;
const privateReplacement = `  createVideoHeader,\n  normalizePath,\n  safeInsertBefore,`;
if (!source.includes("  safeInsertBefore,")) {
  if (!source.includes(privateAnchor)) throw new Error("A1 workbook video private export anchor missing.");
  source = source.replace(privateAnchor, privateReplacement);
}

const testMarker = 'test("falls back safely when the insertBefore reference is stale"';
if (!testSource.includes(testMarker)) {
  const testAnchor = '  test("allows the learner to collapse and reopen the video", () => {';
  const regression = `  test("falls back safely when the insertBefore reference is stale", () => {\n    const container = document.createElement("div");\n    const otherContainer = document.createElement("div");\n    const staleReference = document.createElement("span");\n    const node = document.createElement("section");\n\n    otherContainer.appendChild(staleReference);\n\n    expect(() =>\n      __private__.safeInsertBefore(container, node, staleReference),\n    ).not.toThrow();\n    expect(container.lastElementChild).toBe(node);\n  });\n\n${testAnchor}`;
  if (!testSource.includes(testAnchor)) throw new Error("A1 workbook video stale-reference test anchor missing.");
  testSource = testSource.replace(testAnchor, regression);
}

fs.writeFileSync(targetPath, source);
fs.writeFileSync(testPath, testSource);

console.log("Applied A1 workbook video stale insertBefore safety patch.");
