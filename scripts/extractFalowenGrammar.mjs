/**
 * Extract only static learner-visible grammar teaching from original Falowen
 * A2/B1 React pages. Dynamic JSX/answers are never evaluated or included.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
let parse;
try {
  ({ parse } = require("@babel/parser"));
} catch (error) {
  if (error.code !== "MODULE_NOT_FOUND") throw error;
  // Web CI/Vercel install under web/node_modules, unlike backend CI.
  ({ parse } = createRequire(new URL("../web/package.json", import.meta.url))("@babel/parser"));
}
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
function inlineGrammarProps(ast) {
  // A2 Day 17 renders grammar content as literal props on its existing
  // A2MiniLearningBlock. Only teaching props are read; never its questions,
  // answer indices, feedback, or quiz explanation props.
  return findNodes(ast, (n) => n.type === "JSXElement" &&
    tag(n) === "A2MiniLearningBlock").map((element) => {
    const props = {};
    for (const attr of element.openingElement.attributes || []) {
      if (attr.type !== "JSXAttribute") continue;
      const key = attr.name?.name;
      if (!["title", "english", "rule", "examples", "outputPrompt", "starters"].includes(key)) continue;
      const value = attr.value?.type === "StringLiteral" ? attr.value.value
        : attr.value?.type === "JSXExpressionContainer" ? staticValue(attr.value.expression) : null;
      props[key] = value;
    }
    const body = [];
    for (const key of ["english", "rule", "outputPrompt"]) {
      const v = safe(props[key], 1200);
      if (v) body.push(v);
    }
    for (const example of Array.isArray(props.examples) ? props.examples.slice(0, 7) : []) {
      const v = safe(example, 450);
      if (v) body.push(v);
    }
    return body.length ? {
      title: safe(props.title, 170) || "Grammar teaching",
      explanation: body.join("\n").slice(0, 2700),
    } : null;
  }).filter(Boolean);
}

function jsxTeaching(ast) {
  // Later A2 lessons use a local SectionCard/Section React wrapper whose
  // visible title is a literal JSX attribute, not an h2. The wrapper is
  // learner-facing; we still skip all dynamic quiz/result props.
  const containers = findNodes(ast, (node) =>
    node.type === "JSXElement" &&
    ["section", "SectionCard", "Section"].includes(tag(node)));
  return containers.map((section) => {
    const titleEl = findNodes(section, (n) => n.type === "JSXElement" && /^h[234]$/.test(tag(n)))[0];
    const attr = section.openingElement?.attributes?.find((item) =>
      item.type === "JSXAttribute" && item.name?.name === "title");
    const title = safe(
      attr?.value?.type === "StringLiteral" ? attr.value.value : visibleText(titleEl), 170);
    if (!title || /(?:test|quiz|self-check|knowledge check|prüfung|lösung)/i.test(title)) return null;
    const rawText = tag(section) === "section" ? visibleText(section)
      : (section.children || []).map(visibleText).join(" ");
    const body = safe(rawText, 3600);
    if (!body || body.length < 50) return null;
    const explanation = (tag(section) === "section" ? body.slice(title.length) : body).trim().slice(0, 2600);
    return explanation.length > 30 ? { title, explanation } : null;
  }).filter(Boolean).slice(0, 8);
}
export function extractGrammarTeaching(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const ast = parse(source, { sourceType: "module", plugins: ["jsx", "typescript"] });
  const sections = [...jsxTeaching(ast.program), ...literalTeaching(ast.program), ...inlineGrammarProps(ast.program)].slice(0, 8);
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

/**
 * C1 Days 1–6 use a single literal lesson registry in the actual React page.
 * Read its AST without evaluating JSX, and project only fields the page teaches.
 * Preserve text and table cells verbatim; self-check answers never leave Campus.
 */
export function extractC1GuidedGrammar(root, day, practice) {
  if (!Number.isInteger(day) || day < 1 || day > 28) return null;
  if (day >= 7) return c1LaterGrammar(root, day, practice);
  const file = path.join(root, "web/src/components/C1Day1To6GrammarNotes.js");
  const ast = parse(fs.readFileSync(file, "utf8"), { sourceType: "module", plugins: ["jsx"] });
  const registry = findNodes(ast.program, n => n.type === "VariableDeclarator" &&
    n.id?.name === "lessons" && n.init?.type === "ObjectExpression");
  if (registry.length !== 1) throw new Error("C1 guided grammar registry changed");
  const field = (node, key) => node?.properties?.find(p => p.type === "ObjectProperty" &&
    String(p.key?.name ?? p.key?.value) === String(key))?.value;
  const lesson = field(registry[0].init, day);
  const str = node => {
    if (node?.type !== "StringLiteral" || !node.value.trim())
      throw new Error("Unexpected C1 grammar text on day " + day);
    return node.value;
  };
  const list = (node, map) => {
    if (node?.type !== "ArrayExpression") throw new Error("Unexpected C1 grammar list on day " + day);
    return node.elements.map(map);
  };
  const val = (node, key) => str(field(node, key));
  const texts = node => list(node, str);
  const pairs = node => list(node, row => {
    const values = texts(row);
    if (values.length !== 2) throw new Error("Unexpected C1 grammar pair on day " + day);
    return values;
  });
  const blocks = [
    { type: "heading", text: val(lesson, "title") },
    { type: "paragraph", text: val(lesson, "subtitle") },
    { type: "heading", text: "Warum brauchst du diese Grammatik auf C1?" },
    { type: "paragraph", text: val(lesson, "why") },
    { type: "heading", text: "Nach dieser Lektion kannst du:" },
    { type: "list", items: texts(field(lesson, "goals")) },
    { type: "heading", text: "C1-Grammatik im Kontext" },
    { type: "paragraph", text: practice.grammar },
    { type: "paragraph", text: practice.rule },
    { type: "questions", items: practice.grammarChecks.map(([prompt]) => prompt) },
    { type: "heading", text: "Wortschatz · " + practice.vocabulary.length + " Ausdrücke" },
    { type: "table", rows: practice.vocabulary.map(([term, meaning]) => [term, meaning]) },
  ];
  for (const section of list(field(lesson, "sections"), n => n)) {
    blocks.push({ type: "heading", text: val(section, "title") },
      { type: "paragraph", text: val(section, "text") });
    if (field(section, "rows")) blocks.push({ type: "table",
      headers: ["Struktur / Bedeutung", "Form / Beispiel"], rows: pairs(field(section, "rows")) });
    if (field(section, "examples")) blocks.push({ type: "examples", items: texts(field(section, "examples")) });
    if (field(section, "note")) blocks.push({ type: "note", label: "Merke:", text: val(section, "note") });
    if (field(section, "mistakes")) for (const [wrong, correct] of pairs(field(section, "mistakes")))
      blocks.push({ type: "teachingCorrection", wrong, correct });
  }
  blocks.push({ type: "heading", text: "C1-Modellabsatz" },
    { type: "paragraph", text: val(lesson, "model") },
    { type: "heading", text: "Typische Fehler" },
    { type: "list", items: texts(field(lesson, "common")) },
    { type: "heading", text: "Schrittweise Mini-Übung" },
    { type: "orderedList", items: texts(field(lesson, "practice")) },
    { type: "heading", text: "Selbstkontrolle" },
    { type: "paragraph", text: "Löse die Aufgabe zuerst selbst und öffne danach die Antwort." },
    { type: "questions", items: list(field(lesson, "checks"), (row, index) => {
      if (row?.type !== "ArrayExpression" || row.elements.length !== 2)
        throw new Error("Unexpected C1 self-check on day " + day);
      return (index + 1) + ". " + str(row.elements[0]);
    }) });
  return {
    source: "Falowen original C1 guided grammar notes and academic grammar practice",
    fullExplanationIncluded: true,
    orderedNotes: blocks.map((block, index) => ({ number: index + 1, ...block })),
    clarification: "Read orderedNotes in sequence without paraphrasing when the learner requests the original. Teaching examples and corrections are included; collapsed exercise solutions and completion controls remain in Campus.",
  };
}

/** Exact static JSX teaching for Day 7 and the explicitly selected deep dives.
 * No JSX is executed. Unknown content nodes fail the build instead of silently
 * losing prose. CheckAnswer children and completion labels are never traversed.
 */
function c1StaticBlocks(node, academic) {
  const out = [];
  const attr = (n, key) => n.openingElement.attributes.find(a =>
    a.type === "JSXAttribute" && a.name?.name === key)?.value;
  const literal = n => {
    if (n?.type === "StringLiteral") return n.value;
    if (n?.type === "ArrayExpression") return n.elements.map(literal);
    throw new Error("Unexpected static C1 JSX literal");
  };
  const prop = (n, key) => {
    const value = attr(n, key);
    return literal(value?.type === "JSXExpressionContainer" ? value.expression : value);
  };
  // React's multiline JSX whitespace rules; retain original inline spacing.
  const jsxText = value => {
    const lines = value.split(/\r\n|\n|\r/);
    let lastNonempty = 0;
    lines.forEach((line, i) => { if (/[^ \t]/.test(line)) lastNonempty = i; });
    return lines.map((line, i) => {
      let t = line.replace(/\t/g, " ");
      if (i !== 0) t = t.replace(/^ +/, "");
      if (i !== lines.length - 1) t = t.replace(/ +$/, "");
      return t && i !== lastNonempty ? t + " " : t;
    }).join("");
  };
  const inline = n => {
    if (n.type === "JSXText") return jsxText(n.value);
    if (n.type === "JSXElement" && tag(n) === "br") return "\n";
    if (n.type === "JSXElement" && ["strong", "em", "span", "b", "i"].includes(tag(n)))
      return n.children.map(inline).join("");
    if (n.type === "JSXExpressionContainer" && n.expression.type === "StringLiteral")
      return n.expression.value;
    throw new Error("Unsupported inline C1 grammar node: " + (tag(n) || n.type));
  };
  const content = n => n.children.map(inline).join("").trim();
  const push = (type, text) => { if (text) out.push({ type, text }); };
  const walk = n => {
    if (n.type === "JSXText") { push("paragraph", jsxText(n.value).trim()); return; }
    if (n.type === "JSXFragment") { n.children.forEach(walk); return; }
    if (n.type !== "JSXElement") throw new Error("Unsupported C1 teaching node " + n.type);
    const t = tag(n);
    if (t === "C1AcademicGrammarPractice") { out.push(...academic); return; }
    if (["label", "input"].includes(t)) return;
    if (t === "CheckAnswer") { out.push({ type: "questions", items: [prop(n, "question")] }); return; }
    if (t === "Mistake") { out.push({ type: "teachingCorrection", wrong: prop(n, "wrong"), correct: prop(n, "correct") }); return; }
    if (t === "Table") {
      if (attr(n, "rows")) {
        out.push({ type: "table", headers: prop(n, "headers"), rows: prop(n, "rows") }); return;
      }
      const rows = findNodes(n, x => x.type === "JSXElement" && tag(x) === "tr");
      const cells = (row, type) => row.children.filter(x => x.type === "JSXElement" && tag(x) === type).map(content);
      const headers = rows.flatMap(row => cells(row, "th"));
      const body = rows.map(row => cells(row, "td")).filter(row => row.length);
      if (!headers.length || !body.length || body.some(row => row.length !== headers.length))
        throw new Error("Unexpected C1 JSX table");
      out.push({ type: "table", headers, rows: body }); return;
    }
    if (/^h[1-6]$/.test(t)) { push("heading", content(n)); return; }
    if (["ul", "ol"].includes(t)) {
      const items = n.children.filter(x => x.type === "JSXElement" && tag(x) === "li").map(content);
      out.push({ type: t === "ol" ? "orderedList" : "list", items }); return;
    }
    if (["p", "span", "strong", "ExampleBox", "NoteBox"].includes(t)) {
      if (n.children.some(x => x.type === "JSXElement" && ["ul", "ol", "div", "p"].includes(tag(x)))) {
        n.children.forEach(walk); return;
      }
      push(t === "ExampleBox" ? "example" : t === "NoteBox" ? "note" : "paragraph", content(n)); return;
    }
    if (["div", "section"].includes(t)) { n.children.forEach(walk); return; }
    throw new Error("Unknown C1 static teaching tag " + t);
  };
  walk(node);
  return out;
}

function c1LaterGrammar(root, day, practice) {
  const group = day === 7 ? "7Reisen" : day <= 10 ? "8To10" : day === 11 ? "11" :
    day <= 14 ? "12To14" : day <= 17 ? "15To17" : day <= 20 ? "18To20" :
    day <= 23 ? "21To23" : day <= 26 ? "24To26" : "27To28";
  const file = path.join(root, "web/src/components/C1Day" + group + "GrammarNotes.js");
  const ast = parse(fs.readFileSync(file, "utf8"), { sourceType: "module", plugins: ["jsx"] });
  const academic = [
    { type: "heading", text: "C1-Grammatik im Kontext" },
    { type: "paragraph", text: practice.grammar },
    { type: "paragraph", text: practice.rule },
    { type: "questions", items: practice.grammarChecks.map(([prompt]) => prompt) },
    { type: "heading", text: "Wortschatz · " + practice.vocabulary.length + " Ausdrücke" },
    { type: "table", rows: practice.vocabulary.map(([term, meaning]) => [term, meaning]) },
  ];
  const jsxReturn = fn => {
    const returns = fn.body?.body?.filter(n => n.type === "ReturnStatement" &&
      ["JSXElement", "JSXFragment"].includes(n.argument?.type)) || [];
    if (returns.length !== 1) throw new Error("C1 grammar return changed for day " + day);
    return returns[0].argument;
  };
  const namedJSX = name => {
    const nodes = findNodes(ast.program, n => n.type === "VariableDeclarator" &&
      n.id?.name === name && n.init?.type === "ArrowFunctionExpression");
    if (nodes.length !== 1) throw new Error("Missing C1 grammar section " + name);
    return c1StaticBlocks(jsxReturn(nodes[0].init), academic);
  };
  let blocks;
  if (day === 7) {
    const fn = ast.program.body.find(n => n.type === "ExportDefaultDeclaration")?.declaration;
    blocks = c1StaticBlocks(jsxReturn(fn), academic);
  } else {
    const single = day === 11;
    const declarations = findNodes(ast.program, n => n.type === "VariableDeclarator" &&
      n.id?.name === (single ? "lesson" : "lessons") && n.init?.type === "ObjectExpression");
    if (declarations.length !== 1) throw new Error("C1 grammar registry changed for day " + day);
    const field = (node, key) => node?.properties?.find(p => p.type === "ObjectProperty" &&
      String(p.key?.name ?? p.key?.value) === String(key))?.value;
    const lesson = single ? declarations[0].init : field(declarations[0].init, day);
    const str = n => {
      if (n?.type !== "StringLiteral" || !n.value.trim()) throw new Error("Invalid C1 grammar string on day " + day);
      return n.value;
    };
    const list = (n, map) => {
      if (n?.type !== "ArrayExpression") throw new Error("Invalid C1 grammar list on day " + day);
      return n.elements.map(map);
    };
    const val = (node, key) => str(field(node, key));
    const strings = n => list(n, str);
    const pairs = n => list(n, row => {
      const pair = strings(row);
      if (pair.length !== 2) throw new Error("Invalid C1 grammar pair on day " + day);
      return pair;
    });
    const heading = text => ({ type: "heading", text });
    const paragraph = text => ({ type: "paragraph", text });
    blocks = [...academic, heading(val(lesson, "title")), paragraph(val(lesson, "subtitle"))];
    if (day >= 24 && day <= 26) {
      blocks.push({ type: "note", label: "Warum brauchst du das?", text: val(lesson, "why") }, heading("Lernziele"));
    } else {
      blocks.push(heading(day >= 21 && day <= 23 ? "Was lernst du hier?" : "Warum brauchst du diese Grammatik auf C1?"),
        paragraph(val(lesson, "why")), heading("Nach dieser Lektion kannst du:"));
    }
    blocks.push({ type: "list", items: strings(field(lesson, "goals")) });
    if (day >= 21 && day <= 26) {
      blocks.push(heading(day <= 23 ? "Grammatik Schritt für Schritt" : "Grammar notes"));
      for (const [title, text] of pairs(field(lesson, "explanation"))) blocks.push(heading(title), paragraph(text));
    }
    if (day === 20) blocks.push(...namedJSX("MiniLesson"));
    if (!(day >= 24 && day <= 26)) blocks.push(heading(day >= 21 && day <= 23 ? "Kernstrukturen auf einen Blick" :
      day >= 18 && day <= 20 ? "Kernstrukturen mit Beispielen" : "Kernstrukturen"));
    blocks.push({ type: "table", headers: ["Struktur", "C1-Beispiel"], rows: pairs(field(lesson, "rows")) });
    if (day >= 8 && day <= 10) blocks.push(...namedJSX("Day" + day + "DeepDive"));
    const model = () => blocks.push(heading(day >= 24 && day <= 26 ? "Modellabsatz" :
      day >= 18 && day <= 20 ? "C1-Modellabsatz: So klingt es im Zusammenhang" : "C1-Modellabsatz"),
      paragraph(val(lesson, "model")));
    const quiz = () => {
      blocks.push(heading("Knowledge Test"));
      if (day <= 20) blocks.push(heading("Teste die Grammatik direkt"));
      blocks.push(paragraph(day <= 20 ? "Klicke auf eine Antwort. Du siehst sofort, ob sie richtig ist und warum." :
        day <= 23 ? "Klicke auf eine Antwort. Du siehst sofort, ob sie richtig ist." :
        "Wähle eine Antwort. Du bekommst sofort Feedback und kannst deine Antwort ändern."));
      // Explicit projection: do not even read the answer or feedback fields.
      for (const item of list(field(lesson, "quiz"), n => n)) {
        blocks.push({ type: "multipleChoice", question: val(item, day <= 20 ? "question" : "q"),
          options: strings(field(item, "options")) });
      }
    };
    if (day >= 18 && day <= 23) { quiz(); model(); }
    else if (day >= 24 && day <= 26) { model(); quiz(); }
    else {
      model();
      blocks.push(heading("Selbstkontrolle"), paragraph("Löse die Aufgabe zuerst selbst und öffne danach die Antwort."),
        { type: "questions", items: list(field(lesson, "checks"), (row, index) => {
          if (row?.type !== "ArrayExpression" || row.elements.length !== 2) throw new Error("Invalid C1 self-check");
          return (index + 1) + ". " + str(row.elements[0]);
        }) });
    }
  }
  return {
    source: "Falowen original C1 guided grammar notes and academic grammar practice",
    fullExplanationIncluded: true,
    orderedNotes: blocks.map((block, index) => ({ number: index + 1, ...block })),
    clarification: "Read orderedNotes in sequence without paraphrasing when the learner requests the original. Teaching examples and corrections are included; collapsed exercise solutions and completion controls remain in Campus.",
  };
}

/** Original A1 grammar pages, first four days. Parse only the explicitly
 * selected page return; never run React, quiz callbacks or answer state. */
export function extractA1OriginalGrammar(root, day) {
  const names = { 1: "A1Day1GreetingsGrammarPage", 2: "A1Day2UnifiedGrammarPage",
    3: "A1Day3Kapitel12GrammarNotesPage", 4: "GermanNumbersGrammarPage" };
  const name = names[day];
  if (!name) return extractRemainingA1Grammar(root, day);
  const file = path.join(root, "web/src/components", name + ".js");
  const ast = parse(fs.readFileSync(file, "utf8"), { sourceType: "module", plugins: ["jsx"] });
  const top = ast.program.body.flatMap(n => n.type === "VariableDeclaration" ? n.declarations : [n]);
  const declaration = key => top.find(n => n.type === "VariableDeclarator" && n.id?.name === key)?.init;
  const field = (n, key) => n?.properties?.find(p => p.type === "ObjectProperty" &&
    String(p.key?.name ?? p.key?.value) === key)?.value;
  const literal = n => {
    if (n?.type === "StringLiteral") return n.value;
    if (n?.type === "ArrayExpression") return n.elements.map(literal);
    throw new Error("Unexpected A1 teaching literal, day " + day);
  };
  const fn = declaration(name) || top.find(n => n.type === "ExportDefaultDeclaration" &&
    n.declaration?.id?.name === name)?.declaration;
  const returns = fn?.body?.body?.filter(n => n.type === "ReturnStatement" && n.argument?.type === "JSXElement") || [];
  if (returns.length !== 1) throw new Error("Original A1 grammar page changed: " + name);
  const out = [];
  const attr = (n, key) => n.openingElement.attributes.find(a =>
    a.type === "JSXAttribute" && a.name?.name === key);
  const rawProp = (n, key) => {
    const v = attr(n, key)?.value;
    return v?.type === "JSXExpressionContainer" ? v.expression : v;
  };
  const clean = value => {
    const lines = value.split(/\r\n|\r|\n/);
    let last = 0;
    lines.forEach((line, i) => { if (/[^ \t]/.test(line)) last = i; });
    return lines.map((line, i) => {
      let t = line.replace(/\t/g, " ");
      if (i) t = t.replace(/^ +/, "");
      if (i !== lines.length - 1) t = t.replace(/ +$/, "");
      return t && i !== last ? t + " " : t;
    }).join("");
  };
  const inlineTags = ["strong", "em", "b", "i", "span"];
  const inline = n => {
    if (n.type === "JSXText") return clean(n.value);
    if (n.type === "JSXElement" && tag(n) === "br") return "\n";
    if (n.type === "JSXElement" && inlineTags.includes(tag(n))) return n.children.map(inline).join("");
    if (n.type === "JSXExpressionContainer" && n.expression.type === "StringLiteral") return n.expression.value;
    throw new Error("Unexpected inline A1 grammar node, day " + day + ": " + (tag(n) || n.type));
  };
  const content = n => n.children.map(inline).join("").trim();
  const push = (type, text) => { if (text) out.push({ type, text }); };
  const mappedArray = n => {
    if (n?.type !== "CallExpression" || n.callee?.type !== "MemberExpression" ||
        n.callee.property?.name !== "map") throw new Error("Unexpected A1 teaching map");
    return n.callee.object;
  };
  const rowsFrom = n => {
    if (n?.type === "Identifier") {
      if (!["alphabet", "pronouns", "pronounRows", "conjugationRows",
        "numbersZeroToTwenty", "tens", "hundreds", "thousands"].includes(n.name))
        throw new Error("Unapproved A1 teaching array " + n.name);
      n = declaration(n.name);
    }
    const rows = literal(n);
    if (!Array.isArray(rows) || !rows.every(row => Array.isArray(row) && row.every(x => typeof x === "string")))
      throw new Error("Invalid A1 teaching table");
    return rows;
  };
  const table = (headers, rows) => {
    if (!rows.length || (headers.length && rows.some(r => r.length !== headers.length)))
      throw new Error("Invalid A1 teaching table width");
    out.push({ type: "table", ...(headers.length ? { headers } : {}), rows });
  };
  const questions = ids => {
    const n = declaration("knowledgeQuestions");
    if (n?.type !== "ArrayExpression") throw new Error("Missing A1 knowledge questions");
    const items = n.elements.filter(q => !ids || ids.includes(literal(field(q, "id"))));
    for (const q of items) out.push({ type: "multipleChoice",
      question: literal(field(q, day === 1 ? "prompt" : "question")),
      options: literal(field(q, "options")) });
    if (ids && items.length !== ids.length) throw new Error("A1 knowledge question mapping changed");
  };
  const walk = n => {
    if (n.type === "JSXText") { push("paragraph", clean(n.value).trim()); return; }
    if (n.type === "JSXExpressionContainer") {
      const e = n.expression;
      if (e.type === "JSXEmptyExpression") return;
      if (day === 3 && e.type === "ConditionalExpression" && e.test?.name === "checked") return;
      if (day === 3 && e.type === "CallExpression" && mappedArray(e)?.name === "knowledgeQuestions") {
        questions(); return;
      }
      if (day === 2 && e.type === "CallExpression" && mappedArray(e)?.name === "alphabet") {
        table([], rowsFrom(mappedArray(e))); return;
      }
      throw new Error("Unexpected A1 dynamic grammar node, day " + day);
    }
    if (n.type !== "JSXElement") throw new Error("Unexpected A1 grammar node");
    const t = tag(n);
    if (["AppBackButton", "img", "button"].includes(t) || attr(n, "data-a1-pdf-hide-ui")) return;
    if (t === "KnowledgeCheck" && day === 1) {
      const key = literal(rawProp(n, "sectionKey"));
      const map = declaration("knowledgeQuestionIdsBySection")?.arguments?.[0];
      questions(literal(field(map, key))); return;
    }
    if (t === "NumberTable" && day === 4) {
      table(attr(n, "showPronunciation") ? ["Number", "German", "Pronunciation"] : ["Number", "German"],
        rowsFrom(rawProp(n, "rows"))); return;
    }
    if (t === "table") {
      const part = key => n.children.find(x => x.type === "JSXElement" && tag(x) === key);
      const head = part("thead"), body = part("tbody");
      if (!head || !body) throw new Error("A1 table structure changed");
      const hr = head.children.find(x => x.type === "JSXElement" && tag(x) === "tr");
      const headerMap = hr.children.find(x => x.type === "JSXExpressionContainer");
      const headers = headerMap ? literal(mappedArray(headerMap.expression)) :
        hr.children.filter(x => x.type === "JSXElement" && tag(x) === "th").map(content);
      const dynamic = body.children.find(x => x.type === "JSXExpressionContainer");
      const rows = dynamic ? rowsFrom(mappedArray(dynamic.expression)) :
        body.children.filter(x => x.type === "JSXElement" && tag(x) === "tr").map(row =>
          row.children.filter(x => x.type === "JSXElement" && tag(x) === "td").map(content));
      table(headers, rows); return;
    }
    if (/^h[1-6]$/.test(t)) { push("heading", content(n)); return; }
    if (["ul", "ol"].includes(t)) {
      out.push({ type: t === "ol" ? "orderedList" : "list",
        items: n.children.filter(x => x.type === "JSXElement" && tag(x) === "li").map(content) }); return;
    }
    if (["main", "header", "section", "div"].includes(t)) {
      const isInline = n.children.every(x => x.type === "JSXText" ||
        (x.type === "JSXElement" && ["strong", "em", "b", "i", "br"].includes(tag(x))));
      if (isInline) push("paragraph", content(n));
      else n.children.forEach(walk);
      return;
    }
    if (["p", "span", "strong", "em", "BuilderPiece"].includes(t)) { push("paragraph", content(n)); return; }
    if (t === "br") return;
    throw new Error("Unapproved A1 grammar tag: " + t);
  };
  walk(returns[0].argument);
  if (!out.some(b => b.type === "heading") || out.length < 10) throw new Error("Incomplete A1 original notes");
  return {
    source: "Falowen original A1 learner-facing grammar page",
    fullExplanationIncluded: true,
    orderedNotes: out.map((block, index) => ({ number: index + 1, ...block })),
    clarification: "Read orderedNotes in workbook order. Original English and German teaching is preserved; interactive scores, navigation, images and hidden answers are not exported.",
  };
}

/** Read later A1 grammar pages without executing React. Only reviewed teaching
 * literals and question/option pairs are exported; unsupported UI or dynamic
 * content is explicitly reported rather than pretending the export is complete. */
function extractRemainingA1Grammar(root, day) {
  const routes = {
    7:["A1Day7PricesPreferencesGrammarPage"],8:["FormingBasicStatementsPage"],
    9:["A1Day9NominativeAccusativeGrammarPage"],10:["ObjectsAndColorsPage"],
    11:["TwelveHourClockPage","WeekTimeSeparableGrammarBook"],
    12:["A1Day12TwentyFourHourClockDatesPage"],16:["A1Day16FoodAndNegationGrammarPage"],
    17:["DirectionsImperativePage"],18:["TwoCasePrepositionsPageLegacy"],
    20:["LetterWritingIntroPage","LetterWritingGrammarNotesPage"],
    21:["WeatherPerfektLetterPage"],22:["HealthBodyPartsPage"],
  };
  if(!routes[day])return null;
  const [file,component=file]=routes[day];
  const ast=parse(fs.readFileSync(path.join(root,"web/src/components",file+".js"),"utf8"),
    {sourceType:"module",plugins:["jsx"]});
  const top=ast.program.body.map(n=>["ExportNamedDeclaration","ExportDefaultDeclaration"].includes(n.type)?n.declaration:n)
    .filter(Boolean).flatMap(n=>n.type==="VariableDeclaration"?n.declarations:[n]);
  const def=name=>top.find(n=>n.id?.name===name);
  const decl=name=>def(name)?.init;
  const field=(n,k)=>n?.properties?.find(p=>p.type==="ObjectProperty"&&String(p.key?.name??p.key?.value)===k)?.value;
  const attr=(n,k)=>n.openingElement?.attributes?.find(a=>a.type==="JSXAttribute"&&a.name?.name===k);
  const prop=(n,k)=>{const v=attr(n,k)?.value;return v?.type==="JSXExpressionContainer"?v.expression:v;};
  const unfreeze=n=>n?.type==="CallExpression"&&n.callee?.object?.name==="Object"&&n.callee?.property?.name==="freeze"?n.arguments[0]:n;
  const fail=m=>{throw new Error(m);};
  const blocks=[],missing=new Set();
  const clean=v=>{const lines=v.split(/\r\n|\r|\n/);let last=0;lines.forEach((l,i)=>{if(/[^ \t]/.test(l))last=i;});
    return lines.map((l,i)=>{let t=l.replace(/\t/g," ");if(i)t=t.replace(/^ +/,"");if(i!==lines.length-1)t=t.replace(/ +$/,"");return t&&i!==last?t+" ":t;}).join("");};
  const teaching=new Set("verbForms examples possessiveColumns possessiveRows articleColumns nominativeRows accusativeRows quickGuideRows patternRows clockRows timeExpressionRows daypartRows separableRows keinRows foodWords mistakes speakingCards twoWayPrepositions definiteArticles indefiniteArticles prepositionTypes weatherWords bodyParts schmerzenExamples wehExamplesSingular wehExamplesPlural healthQuestions healthAnswers cancellationLines letterTopics shortSentencePatterns wQuestionPatterns modalVerbExamples weilExamples summaryPoints".split(" "));
  const keys=new Set("title lines prompts description words wrong correct reason sentence english gender note".split(" "));
  function val(n,env={}){
    if(!n)fail("missing literal");
    if(n.type==="StringLiteral"||n.type==="NumericLiteral")return n.value;
    if(n.type==="ArrayExpression")return n.elements.map(x=>val(x,env));
    if(n.type==="ObjectExpression")return Object.fromEntries(n.properties.filter(p=>p.type==="ObjectProperty"&&keys.has(p.key?.name??p.key?.value)).map(p=>[p.key.name??p.key.value,val(p.value,env)]));
    if(n.type==="Identifier"){
      if(Object.hasOwn(env,n.name))return env[n.name];
      if(teaching.has(n.name)||day===12&&n.name==="KNOWLEDGE_TEST_PASS_MARK")return val(unfreeze(decl(n.name)),env);
      if(day===7&&n.name==="practiceBlocks")return val(field(decl("lessonBlocks"),"practice"),env);
    }
    if(n.type==="MemberExpression"&&!n.computed){
      const k=n.property?.name;
      if(day===7&&n.object?.name==="lessonBlocks"&&["kostenCards","kostenConjugation","pronouns","gernLieber","gernVsMogen","mogenConjugation"].includes(k))return val(field(decl("lessonBlocks"),k),env);
      if(keys.has(k)){const o=val(n.object,env);if(o&&Object.hasOwn(o,k))return o[k];}
    }
    if(n.type==="JSXElement")return inline(n,env);
    fail("unsupported learner expression "+n.type);
  }
  const string=x=>typeof x==="string"||typeof x==="number"?String(x):fail("not text");
  const inlineTags=new Set(["strong","em","b","i","span","u","s","Role","TopicLabel"]);
  function inline(n,env){
    if(n.type==="JSXText")return clean(n.value);
    if(n.type==="JSXExpressionContainer")return n.expression.type==="JSXEmptyExpression"?"":string(val(n.expression,env));
    if(n.type==="JSXElement"&&tag(n)==="br")return "\n";
    if(n.type==="JSXElement"&&inlineTags.has(tag(n)))return n.children.map(x=>inline(x,env)).join("");
    fail("unsupported inline "+(tag(n)||n.type));
  }
  const content=(n,env)=>n.children.map(x=>inline(x,env)).join("").trim();
  const push=(type,text)=>{if(text)blocks.push({type,text});};
  const heading=t=>push("heading",t);
  const table=(headers,rows)=>{
    if(!Array.isArray(rows)||!rows.length||rows.some(r=>!Array.isArray(r)||(headers.length&&r.length!==headers.length)))fail("invalid table");
    blocks.push({type:"table",...(headers.length?{headers:headers.map(string)}:{}),rows:rows.map(r=>r.map(string))});
  };
  const quizzes=new Set("knowledgeQuestions questions timeKnowledgeChecks separableKnowledgeChecks lessonChecks KNOWLEDGE_TEST_QUESTIONS quiz quizQuestions mapSteps possessivePracticeQuestions bodyPartsQuiz doctorConsultationQuiz letterWritingQuiz".split(" "));
  function questions(name){
    if(!quizzes.has(name))fail("unapproved quiz");
    const n=unfreeze(decl(name));if(n?.type!=="ArrayExpression")fail("quiz source changed");
    for(const q of n.elements){
      const prompt=field(q,"prompt")||field(q,"question")||field(q,"stem");
      blocks.push({type:"multipleChoice",question:string(val(prompt)),options:val(field(q,"options")).map(string)});
    }
  }
  const mapSource=e=>e?.type==="CallExpression"&&e.callee?.type==="MemberExpression"&&e.callee.property?.name==="map"?e.callee.object:null;
  function mapItems(e,env){
    const source=mapSource(e);
    if(quizzes.has(source.name)){questions(source.name);return;}
    const items=val(source,env),cb=e.arguments[0];
    if(!Array.isArray(items)||cb?.type!=="ArrowFunctionExpression"||cb.body.type==="BlockStatement")fail("unsupported teaching map");
    for(const [index,item] of items.entries()){
      const next={...env},p=cb.params[0];
      if(p?.type==="Identifier")next[p.name]=item;
      else if(p?.type==="ArrayPattern"&&Array.isArray(item))p.elements.forEach((id,i)=>{if(id?.type==="Identifier")next[id.name]=item[i];else fail("map binding");});
      else fail("map binding");
      if(cb.params[1]?.type==="Identifier")next[cb.params[1].name]=index;
      walk(cb.body,next);
    }
  }
  function jsxOf(name){
    const d=def(name),fn=d?.init||d;
    if(["JSXElement","JSXFragment"].includes(fn?.body?.type))return fn.body;
    const rs=fn?.body?.body?.filter(n=>n.type==="ReturnStatement"&&["JSXElement","JSXFragment"].includes(n.argument?.type))||[];
    if(rs.length!==1)fail("grammar return changed: "+name);return rs[0].argument;
  }
  const omit=new Set(["AppBackButton","img","HeroImage","TopicImageBreak","FalowenLessonMusic","iframe","button","input","a"]);
  const containers=new Set(["main","header","section","div","article","Note","Callout","InfoBox","Section","SubSection","pre"]);
  const quizState=new Set(["showResults","showScore","checked","selected","selectedAnswer","mapFeedback"]);
  function walk(n,env={}){
    if(!n)return;
    try{
      if(n.type==="JSXText"){push("paragraph",clean(n.value).trim());return;}
      if(n.type==="JSXFragment"){n.children.forEach(x=>walk(x,env));return;}
      if(n.type==="JSXExpressionContainer"){
        const e=n.expression;if(e.type==="JSXEmptyExpression")return;
        if(mapSource(e)){mapItems(e,env);return;}
        if(e.type==="ConditionalExpression"&&quizState.has(e.test?.name))return;
        if(e.type==="LogicalExpression"&&e.left?.object?.name==="openAnswers")return;
        push("paragraph",string(val(e,env)));return;
      }
      if(n.type!=="JSXElement")fail("unknown node "+n.type);
      const t=tag(n),get=k=>val(prop(n,k),env),has=k=>Boolean(attr(n,k));
      if(omit.has(t)||has("data-a1-pdf-hide-ui"))return;
      if(t==="A1Day10GrammarFocus"){walk(jsxOf(t),env);return;}
      if(t==="Day8QuickPractice"){heading("5. Quick practice");push("paragraph","Choose the correct verb form, question word or country preposition. You can try again.");questions("questions");return;}
      if(t==="PracticeBlock"&&day===10){questions("possessivePracticeQuestions");return;}
      if(t==="KnowledgeTest"&&day===11){heading(get("title"));questions(prop(n,"questions")?.name);return;}
      if(t==="GermanExample"){push("example",get("german"));push("paragraph",get("english"));return;}
      if(t==="WeilExplanation"&&day===20){walk(jsxOf(t),{pronoun:get("pronoun")});return;}
      if(t==="Sentence"&&day===18){push("example",get("parts").map(r=>r[1]).join(" "));push("paragraph",get("english"));return;}
      if(["Table","SimpleTable","ConjugationTable"].includes(t)){
        if(has("caption"))push("paragraph",get("caption"));if(has("label"))push("paragraph",get("label"));
        const h=t==="ConjugationTable"?["Pronoun",get("verb")+" in Präsens","English meaning"]:get(has("columns")?"columns":has("headings")?"headings":"headers");
        table(h,get("rows"));return;
      }
      if(t==="ArticleTable"){table([get("title"),"Masculine","Feminine","Neuter","Plural"],[["Definite",...get("definite")],["Indefinite",...get("indefinite")]]);return;}
      if(t==="ExampleList"){
        const name=prop(n,"examples")?.name;if(!["nominativeMoreExamples","accusativeMoreExamples"].includes(name))fail("unapproved examples");
        for(const item of decl(name).elements){push("example",val(field(item,"sentence")));for(const [k,label] of [["english","English:"],["gender","Gender / number:"],["note","Note:"]])push("paragraph",label+" "+val(field(item,k)));}return;
      }
      if(t==="BulletList"||t==="NumberedList"){blocks.push({type:t==="NumberedList"||has("ordered")?"orderedList":"list",items:get("items").map(string)});return;}
      if(t==="table"){
        const part=k=>n.children.find(x=>x.type==="JSXElement"&&tag(x)===k),head=part("thead"),body=part("tbody");
        const hr=head?.children.find(x=>x.type==="JSXElement"&&tag(x)==="tr");if(!hr||!body)fail("table structure changed");
        const hm=hr.children.find(x=>x.type==="JSXExpressionContainer"),bm=body.children.find(x=>x.type==="JSXExpressionContainer");
        const headers=hm?val(mapSource(hm.expression),env):hr.children.filter(x=>x.type==="JSXElement"&&tag(x)==="th").map(x=>content(x,env));
        const rows=bm?val(mapSource(bm.expression),env):body.children.filter(x=>x.type==="JSXElement"&&tag(x)==="tr").map(r=>r.children.filter(x=>x.type==="JSXElement"&&tag(x)==="td").map(x=>content(x,env)));
        table(headers,rows);return;
      }
      if(/^h[1-6]$/.test(t)){heading(content(n,env));return;}
      if(t==="ul"||t==="ol"){blocks.push({type:t==="ol"?"orderedList":"list",items:n.children.filter(x=>x.type==="JSXElement"&&tag(x)==="li").map(x=>content(x,env))});return;}
      if(t==="br")return;
      if(containers.has(t)){
        if(t==="Section"&&has("title")){
          if(has("eyebrow"))push("paragraph",get("eyebrow"));
          heading((day===18&&has("number")?get("number")+". ":"")+get("title"));
          if(has("subtitle"))push("paragraph",get("subtitle"));
          if(day===17&&get("title")==="9) Interactive map scenario"){questions("mapSteps");missing.add("interactive map instructions");return;}
          if(day===17&&get("title")==="8) Quick Check quiz (instant feedback)"){questions("quizQuestions");return;}
          if(day===12&&get("title")==="Knowledge test: 24-hour clock and dates"){
            push("paragraph","6 questions · Pass mark: "+val(decl("KNOWLEDGE_TEST_PASS_MARK"))+"/6");
            push("paragraph","Answer all six multiple-choice questions before checking your score. Answers are not shown inside the question fields.");
            push("paragraph","Choose one answer for every question.");questions("KNOWLEDGE_TEST_QUESTIONS");return;
          }
        }else if((t==="InfoBox"||t==="SubSection")&&has("title"))heading(get("title"));
        const simple=n.children.every(x=>x.type==="JSXText"||(x.type==="JSXElement"&&(inlineTags.has(tag(x))||tag(x)==="br")));
        if(simple)push("paragraph",content(n,env));else n.children.forEach(x=>walk(x,env));return;
      }
      if(t==="p"||inlineTags.has(t)){push("paragraph",content(n,env));return;}
      fail("unsupported teaching component "+t);
    }catch(error){missing.add(error.message);}
  }
  walk(jsxOf(component));
  if(!blocks.some(b=>b.type==="heading")||blocks.length<5)throw new Error("No usable A1 grammar blocks: "+day);
  // These mixed-layout pages are a conservative first export. Do not claim
  // exact page completeness until each dynamic component has parity tests.
  const omitted=[...missing];
  if([7,9,10,17,18,20].includes(day))omitted.push("Full page parity not verified for this mixed layout");
  return {source:"Falowen original A1 learner-facing grammar page",fullExplanationIncluded:omitted.length===0,
    orderedNotes:blocks.map((b,i)=>({number:i+1,...b})),...(omitted.length?{omittedTeaching:omitted}:{}),
    clarification:omitted.length?"Read only supplied original blocks in order; some interactive or dynamic teaching is not exported or verified. Open the Campus grammar page for those parts. Do not invent missing material.":"Read orderedNotes in workbook order. Original English and German teaching is preserved; interactive scores, navigation, images and hidden answers are not exported."};
}

/** A2 grammar follows the canonical embedded workbook component, not the
 * bounded legacy summaries. Interpret only reviewed literal teaching JSX;
 * never run React, callbacks, state or quiz answer code. */
export function extractA2OrderedGrammar(filePath, day) {
  const ast=parse(fs.readFileSync(filePath,"utf8"),{sourceType:"module",plugins:["jsx"]});
  const program=ast.program;
  const exported=program.body.find(n=>n.type==="ExportDefaultDeclaration")?.declaration;
  const definitions=new Map();
  for(const n of program.body){
    const d=n.type==="ExportDefaultDeclaration"||n.type==="ExportNamedDeclaration"?n.declaration:n;
    if(d?.type==="VariableDeclaration")for(const v of d.declarations)if(v.id.type==="Identifier")definitions.set(v.id.name,v.init);
    if(d?.type==="FunctionDeclaration"&&d.id)definitions.set(d.id.name,d);
  }
  const name=exported?.type==="Identifier"?exported.name:exported?.type==="CallExpression"&&exported.callee?.name==="memo"?exported.arguments[0]?.name:exported?.id?.name;
  const fn=definitions.get(name)||exported;
  const locals=new Map(definitions);
  for(const n of fn?.body?.body||[])if(n.type==="VariableDeclaration")for(const d of n.declarations)if(d.id.type==="Identifier")locals.set(d.id.name,d.init);
  const field=(n,k)=>n?.properties?.find(p=>p.type==="ObjectProperty"&&String(p.key?.name??p.key?.value)===k)?.value;
  const attr=(n,k)=>n.openingElement?.attributes?.find(a=>a.type==="JSXAttribute"&&a.name?.name===k);
  const prop=(n,k)=>{const v=attr(n,k)?.value;return v?.type==="JSXExpressionContainer"?v.expression:v;};
  const fail=m=>{throw new Error(m);};
  const blocks=[],missing=new Set();
  const hidden=/^(?:correct answer|sample answers?|model answers?|answer key|solution key|musterlösung|lösungsschlüssel|lösungen|lösung\s*:)/i;
  const clean=v=>{const lines=v.split(/\r\n|\r|\n/);let last=0;lines.forEach((l,i)=>{if(/[^ \t]/.test(l))last=i;});
    return lines.map((l,i)=>{let t=l.replace(/\t/g," ");if(i)t=t.replace(/^ +/,"");if(i!==lines.length-1)t=t.replace(/ +$/,"");return t&&i!==last?t+" ":t;}).join("");};
  // Only observed grammar reference collections, never generic object evaluation.
  const teachingNames=new Set("nominativeRows accusativeRows articleRows shortcutRows prepositions examples verbs importantPrefixes pronouns reflexiveVerbs".split(" "));
  const teachingKeys=new Set("noun woFull woShort wohinFull wohinShort change infinitive stem prefix meaning german english de en title form pronoun verb example".split(" "));
  function value(n,env={}){
    if(!n)fail("missing teaching value");
    if(n.type==="StringLiteral"||n.type==="NumericLiteral"||n.type==="BooleanLiteral")return n.value;
    if(n.type==="ArrayExpression")return n.elements.map(x=>value(x,env));
    if(n.type==="ObjectExpression")return Object.fromEntries(n.properties.filter(p=>p.type==="ObjectProperty"&&teachingKeys.has(p.key?.name??p.key?.value)).map(p=>[p.key.name??p.key.value,value(p.value,env)]));
    if(n.type==="Identifier"){
      if(Object.hasOwn(env,n.name))return env[n.name];
      if(teachingNames.has(n.name))return value(locals.get(n.name),env);
    }
    if(n.type==="MemberExpression"&&!n.computed&&teachingKeys.has(n.property?.name)){
      const obj=value(n.object,env);if(obj&&Object.hasOwn(obj,n.property.name))return obj[n.property.name];
    }
    if(n.type==="BinaryExpression"&&["===","!=="].includes(n.operator)){
      const a=value(n.left,env),b=value(n.right,env);return n.operator==="==="?a===b:a!==b;
    }
    fail("unsupported A2 literal "+n.type);
  }
  const str=x=>typeof x==="string"||typeof x==="number"?String(x):fail("non-text value");
  const inlineTags=new Set(["strong","em","b","i","span","s","u","code","InlineCode","small","mark"]);
  function inline(n,env){
    if(n.type==="JSXText")return clean(n.value);
    if(n.type==="JSXExpressionContainer")return n.expression.type==="JSXEmptyExpression"?"":str(value(n.expression,env));
    if(n.type==="JSXElement"&&tag(n)==="br")return "\n";
    if(n.type==="JSXElement"&&inlineTags.has(tag(n)))return n.children.map(x=>inline(x,env)).join("");
    fail("unsupported inline "+(tag(n)||n.type));
  }
  const content=(n,env)=>n.children.map(x=>inline(x,env)).join("").trim();
  const push=(type,text)=>{if(text&&!hidden.test(text))blocks.push({type,text});};
  const heading=t=>push("heading",t);
  const table=(headers,rows)=>{
    if(!rows.length||rows.some(r=>!Array.isArray(r)||(headers.length&&r.length!==headers.length)))fail("table shape changed");
    blocks.push({type:"table",...(headers.length?{headers:headers.map(str)}:{}),rows:rows.map(r=>r.map(str))});
  };
  function questions(n){
    if(n?.type!=="ArrayExpression")fail("nonliteral grammar quiz");
    for(const q of n.elements){
      const prompt=field(q,"stem")||field(q,"prompt")||field(q,"question");
      const options=field(q,"options");
      const english=field(q,"english");
      const item={type:"multipleChoice",question:str(value(prompt)),options:value(options).map(str)};
      if(english)item.translation=str(value(english));
      blocks.push(item);
    }
  }
  const mapSource=e=>e?.type==="CallExpression"&&e.callee?.type==="MemberExpression"&&e.callee.property?.name==="map"?e.callee.object:null;
  const quizNames=new Set(["questions","practiceQuestions"]);
  function bindings(pattern,item,env){
    if(pattern?.type==="Identifier"){env[pattern.name]=item;return;}
    if(pattern?.type==="ArrayPattern"&&Array.isArray(item)){pattern.elements.forEach((p,i)=>bindings(p,item[i],env));return;}
    if(pattern?.type==="ObjectPattern"&&item&&typeof item==="object"){
      for(const p of pattern.properties){if(p.type!=="ObjectProperty"||!teachingKeys.has(p.key?.name))fail("unsupported teaching binding");bindings(p.value,item[p.key.name],env);}return;
    }
    fail("unsupported map binding");
  }
  function mapped(e,env,consume){
    const source=mapSource(e),cb=e.arguments[0],items=value(source,env);
    if(!Array.isArray(items)||cb?.type!=="ArrowFunctionExpression"||cb.body.type==="BlockStatement")fail("unsupported teaching map");
    for(const [i,item] of items.entries()){
      const next={...env};bindings(cb.params[0],item,next);if(cb.params[1]?.type==="Identifier")next[cb.params[1].name]=i;
      consume(cb.body,next);
    }
  }
  function jsxOf(d,embedded=false){
    if(["JSXElement","JSXFragment"].includes(d?.body?.type))return d.body;
    const statements=d?.body?.body||[];
    if(embedded){
      const branch=statements.find(n=>n.type==="IfStatement"&&n.test?.name==="embedded");
      if(branch?.consequent?.type==="ReturnStatement")return branch.consequent.argument;
    }
    const rs=statements.filter(n=>n.type==="ReturnStatement"&&["JSXElement","JSXFragment"].includes(n.argument?.type));
    if(rs.length!==1)fail("grammar return changed");return rs[0].argument;
  }
  function mini(n){
    // A2MiniLearningBlock renders null unless essential is set. Honor this
    // explicitly rather than exposing retired question banks.
    const essential=attr(n,"essential");
    if(!essential||essential.value&&prop(n,"essential")?.value!==true)return;
    const spread=n.openingElement.attributes.find(a=>a.type==="JSXSpreadAttribute");
    if(spread&&spread.argument?.name!=="lesson")fail("unreviewed mini lesson spread");
    const record=spread?locals.get("lesson"):null;
    const read=k=>prop(n,k)||field(record,k);
    const text=k=>read(k)?str(value(read(k))):"";
    heading(text("title"));
    if(text("english"))push("paragraph","English support: "+text("english"));
    if(text("rule"))push("paragraph","Regel: "+text("rule"));
    if(read("examples"))for(const e of value(read("examples")))push("example",str(e));
    if(text("commonMistake"))push("paragraph","Häufiger Fehler: "+text("commonMistake"));
    if(read("questions")?.elements?.length){heading("Kurz prüfen.");questions(read("questions"));}
    if(text("outputPrompt")){
      heading("Jetzt selbst anwenden");push("paragraph",text("outputPrompt"));
      if(read("starters"))blocks.push({type:"list",items:value(read("starters")).map(str)});
    }
  }
  const wrappers=new Set(["GrammarContent","FocusedGrammarContent","FocusedContent"]);
  const omit=new Set(["AppBackButton","img","button","input","iframe","video","audio","a"]);
  const stateNames=new Set(["showAnswers","showAnswer","showResults","showScore","checked","selected","answered","allAnswered","showFeedback","isCorrect","selectedAnswers"]);
  const isState=e=>e?.type==="Identifier"&&stateNames.has(e.name);
  const containers=new Set(["main","header","section","div","article","Container","figure","figcaption","aside","pre","blockquote","label","fieldset"]);
  function walk(n,env={}){
    if(!n)return;
    try{
      if(n.type==="JSXText"){push("paragraph",clean(n.value).trim());return;}
      if(n.type==="JSXFragment"){n.children.forEach(x=>walk(x,env));return;}
      if(n.type==="JSXExpressionContainer"){
        const e=n.expression;if(e.type==="JSXEmptyExpression")return;
        const source=mapSource(e);
        if(source){
          if(quizNames.has(source.name)){questions(locals.get(source.name));return;}
          mapped(e,env,walk);return;
        }
        if(e.type==="ConditionalExpression"){
          if(isState(e.test))return;
          if(e.test.type==="BinaryExpression"){walk(value(e.test,env)?e.consequent:e.alternate,env);return;}
          missing.add("dynamic conditional content");return;
        }
        if(e.type==="LogicalExpression"&&e.operator==="&&"){
          if(isState(e.left)||e.left.type==="UnaryExpression"&&e.left.argument?.name==="embedded")return;
          missing.add("dynamic conditional content");return;
        }
        push("paragraph",str(value(e,env)));return;
      }
      if(n.type==="NullLiteral")return;
      if(n.type!=="JSXElement")fail("unknown node "+n.type);
      const t=tag(n),get=k=>value(prop(n,k),env);
      if(omit.has(t))return;
      if(wrappers.has(t)){walk(jsxOf(definitions.get(t)),env);return;}
      if(t==="A2MiniLearningBlock"){mini(n);return;}
      if(t==="MiniPractice"&&day===14){questions(locals.get("practiceQuestions"));return;}
      if(t==="Example"){
        const de=prop(n,"german")||prop(n,"de"),en=prop(n,"english")||prop(n,"en");
        if(de)push("example",str(value(de,env)));if(en)push("paragraph",str(value(en,env)));
        if(!de&&!en)n.children.forEach(x=>walk(x,env));return;
      }
      if(t==="Section"||t==="SectionCard"){
        heading(str(get("title")));if(prop(n,"en"))push("paragraph",str(get("en")));
        n.children.forEach(x=>walk(x,env));return;
      }
      if(t==="details"){
        // The summary is visible before opening; never export its answer body.
        const summary=n.children.find(x=>x.type==="JSXElement"&&tag(x)==="summary");
        if(summary)push("paragraph",content(summary,env));
        missing.add("collapsed content");return;
      }
      if(t==="table"){
        const part=k=>n.children.find(x=>x.type==="JSXElement"&&tag(x)===k);
        const rows=(parent,cell)=>{
          const result=[];if(!parent)return result;
          const add=(r,e)=>{if(tag(r)!=="tr")fail("table row changed");
            const cells=r.children.filter(x=>x.type==="JSXElement"&&tag(x)===cell).map(x=>content(x,e));
            if(cells.length)result.push(cells);else fail("dynamic table cells");};
          for(const x of parent.children){
            if(x.type==="JSXElement"&&tag(x)==="tr"){
              const dyn=x.children.find(y=>y.type==="JSXExpressionContainer"&&mapSource(y.expression));
              if(dyn){
                const list=[];mapped(dyn.expression,env,(c,e)=>list.push(content(c,e)));result.push(list);
              }else add(x,env);
            }else if(x.type==="JSXExpressionContainer"&&mapSource(x.expression)){
              const source=mapSource(x.expression);
              const data=value(source,env);
              // Direct array-of-array tables preserve original rows; object
              // maps are evaluated only against the visible cell templates.
              if(Array.isArray(data)&&data.every(r=>Array.isArray(r)&&r.every(v=>typeof v==="string")))result.push(...data);
              else mapped(x.expression,env,add);
            }
          }return result;
        };
        const headers=rows(part("thead"),"th").flat(),body=rows(part("tbody"),"td");
        table(headers,body);return;
      }
      if(/^h[1-6]$/.test(t)){heading(content(n,env));return;}
      if(t==="ul"||t==="ol"){
        const items=[];
        for(const x of n.children){
          if(x.type==="JSXElement"&&tag(x)==="li"){const item=content(x,env);if(!hidden.test(item))items.push(item);}
          else if(x.type==="JSXExpressionContainer"&&mapSource(x.expression))mapped(x.expression,env,(li,e)=>{const item=content(li,e);if(!hidden.test(item))items.push(item);});
        }
        if(items.length)blocks.push({type:t==="ol"?"orderedList":"list",items});return;
      }
      if(t==="br")return;
      if(containers.has(t)){
        const simple=n.children.every(x=>x.type==="JSXText"||x.type==="JSXExpressionContainer"&&!mapSource(x.expression)||(x.type==="JSXElement"&&(inlineTags.has(tag(x))||tag(x)==="br")));
        if(simple){push("paragraph",content(n,env));return;}
        n.children.forEach(x=>walk(x,env));return;
      }
      if(t==="p"||inlineTags.has(t)){push("paragraph",content(n,env));return;}
      fail("unsupported component "+t);
    }catch(error){missing.add(error.message);}
  }
  walk(jsxOf(fn,true));
  if(!blocks.length)throw new Error("No ordered A2 grammar source for day "+day);
  const omittedTeaching=[...missing];
  return {orderedNotes:blocks.map((b,i)=>({number:i+1,...b})),
    fullExplanationIncluded:omittedTeaching.length===0,
    ...(omittedTeaching.length?{omittedTeaching}:{}),
    clarification:omittedTeaching.length?"Read orderedNotes in sequence, not the legacy summaries. Some original dynamic teaching or collapsed content was not exported; open the Campus grammar page for omitted material. Do not invent it.":"Read orderedNotes in sequence, preserving the original text, tables and questions. Hidden answers and interactive UI remain in Campus."};
}
