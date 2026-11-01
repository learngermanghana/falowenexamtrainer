/**
 * Extract only static learner-visible grammar teaching from original Falowen
 * A2/B1 React pages. Dynamic JSX/answers are never evaluated or included.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { parse } = require("@babel/parser");
const tidy = (v, max = 1100) => String(v || "").replace(/\s+/g, " ").trim().slice(0, max);
const forbidden = /\b(?:answer key|correct answer|musterl[oö]sung|l[oö]sungsschl[uü]ssel|solution key|auswertung|bewertungstabelle)\b/i;
const safe = (v, max) => { const x = tidy(v, max); return x && !forbidden.test(x) ? x : ""; };
const tag = (node) => node?.openingElement?.name?.type === "JSXIdentifier"
  ? node.openingElement.name.name : "";

function visibleText(node) {
  if (!node) return "";
  if (node.type === "JSXText") return node.value;
  if (node.type === "JSXFragment") return (node.children || []).map(visibleText).join(" ");
  if (node.type !== "JSXElement" || !/^[a-z]/.test(tag(node))) return "";
  // JSXExpressionContainer is skipped: this never executes expressions or
  // includes quiz answers tucked into component props.
  return (node.children || []).map(visibleText).join(" ");
}
function findNodes(node, predicate, out = []) {
  if (!node || typeof node !== "object") return out;
  if (Array.isArray(node)) { node.forEach((x) => findNodes(x, predicate, out)); return out; }
  if (predicate(node)) out.push(node);
  for (const [k, v] of Object.entries(node)) {
    if (!["loc","start","end","extra"].includes(k) && v && typeof v === "object")
      findNodes(v, predicate, out);
  }
  return out;
}
const jsxElements = (ast, tagName) => findNodes(ast, (n) =>
  n.type === "JSXElement" && (!tagName || tag(n) === tagName));
function staticValue(n) {
  if (n?.type === "StringLiteral") return n.value;
  if (n?.type === "ArrayExpression") {
    const a = n.elements.map(staticValue);
    return a.every((v) => typeof v === "string") ? a : null;
  }
  return null;
}
function literalTeaching(ast) {
  const declarations = findNodes(ast, (n) => n.type === "VariableDeclarator" &&
    n.id?.name === "lesson" && n.init?.type === "ObjectExpression");
  return declarations.slice(0, 2).map((declaration) => {
    const raw = {};
    for (const prop of declaration.init.properties) {
      if (prop.type !== "ObjectProperty") continue;
      const key = prop.key?.name || prop.key?.value;
      if (!["title","english","rule","examples","commonMistake","outputPrompt"].includes(key)) continue;
      raw[key] = staticValue(prop.value);
    }
    const body = [];
    for (const key of ["english","rule","commonMistake","outputPrompt"]) {
      const str = safe(raw[key], 1200);
      if (str) body.push(str);
    }
    for (const example of Array.isArray(raw.examples) ? raw.examples.slice(0, 7) : []) {
      const str = safe(example, 450);
      if (str) body.push(str);
    }
    return body.length ? {
      title: safe(raw.title, 170) || "Grammar teaching",
      explanation: body.join("\n").slice(0, 2900),
    } : null;
  }).filter(Boolean);
}
function jsxTeaching(ast) {
  return jsxElements(ast, "section").map((section) => {
    const titleEl = findNodes(section, (n) => n.type === "JSXElement" && /^h[234]$/.test(tag(n)))[0];
    const title = safe(visibleText(titleEl), 170);
    if (!title) return null;
    const body = safe(visibleText(section), 3600);
    if (!body || body.length < 50) return null;
    return { title, explanation: body.slice(title.length).trim().slice(0, 2600) };
  }).filter((section) => section?.explanation?.length > 30).slice(0, 7);
}
export function extractGrammarTeaching(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const ast = parse(source, { sourceType: "module", plugins: ["jsx", "typescript"] });
  const sections = [...jsxTeaching(ast.program), ...literalTeaching(ast.program)].slice(0, 8);
  return {
    source: "Falowen original learner-facing grammar teaching page",
    fullExplanationIncluded: sections.length > 0,
    sections,
  };
}
export function grammarComponentPaths(root) {
  const index = fs.readFileSync(path.join(root,
    "web/src/components/A2B1WorkbookGrammarNotesContent.js"), "utf8");
  const imports = new Map([...index.matchAll(/^import\s+(\w+)\s+from\s+"\.\/([^"]+)";/gm)]
    .map((match) => [match[1], match[2]]));
  const block = index.match(/const GRAMMAR_NOTES_BY_LEVEL_DAY = \{([\s\S]*?)\n\};/);
  if (!block) throw new Error("Canonical A2/B1 grammar registry not found");
  const result = {};
  for (const level of ["A2", "B1"]) {
    const match = block[1].match(new RegExp(level + ": \\{([\\s\\S]*?)\\n  \\},"));
    if (!match) throw new Error("Missing grammar mapping for " + level);
    result[level] = {};
    for (const row of match[1].matchAll(/(?:^|[,\s])(\d{1,2}):\s*(\w+)/g)) {
      const day = Number(row[1]);
      const filename = imports.get(row[2]);
      if (!filename) throw new Error("Unmapped grammar component " + row[2]);
      result[level][day] = path.join(root, "web/src/components", filename + ".js");
    }
    if (Object.keys(result[level]).length !== 28)
      throw new Error(level + " grammar mapping must contain 28 days");
  }
  return result;
}
