/**
 * Strictly extract source-literal student questions and reading paragraphs
 * from approved legacy workbook React components. No execution/evaluation.
 */
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { parse } = require("@babel/parser");

const asText = (x, length = 1900) => String(x || "").trim().slice(0, length);
const prop = (obj, key) => obj?.properties?.find((x) =>
  x.type === "ObjectProperty" && (x.key?.name || x.key?.value) === key)?.value;
const literal = (node) => node?.type === "StringLiteral" ? node.value : null;

function find(node, predicate, result = []) {
  if (!node || typeof node !== "object") return result;
  if (Array.isArray(node)) { node.forEach((x) => find(x, predicate, result)); return result; }
  if (predicate(node)) result.push(node);
  for (const [key, value] of Object.entries(node)) {
    if (!["loc","start","end","extra"].includes(key) && value && typeof value === "object")
      find(value, predicate, result);
  }
  return result;
}
export function loadWorkbookSource(filename) {
  const source = fs.readFileSync(filename, "utf8");
  return { source, ast: parse(source, { sourceType: "module", plugins: ["jsx"] }) };
}
export function extractLiteralQuestions(parsed, variableName, expectedCount) {
  const array = find(parsed.ast.program, (node) => node.type === "VariableDeclarator" &&
    node.id?.name === variableName && node.init?.type === "ArrayExpression")[0]?.init;
  if (!array) throw new Error("Missing original workbook questions: " + variableName);
  const questions = array.elements.map((row) => {
    const stem = literal(prop(row, "stem"));
    const optionsNode = prop(row, "options");
    const options = optionsNode?.type === "ArrayExpression"
      ? optionsNode.elements.map(literal) : [];
    if (!stem || !options.length || options.some((x) => typeof x !== "string")) {
      throw new Error("Question has dynamic or missing text: " + variableName);
    }
    return {
      question: asText(stem, 420),
      options: options.map((x) => asText(x, 280)),
      ...(literal(prop(row, "translation"))
        ? { translation: asText(literal(prop(row, "translation")), 350) } : {}),
    };
  });
  if (questions.length !== expectedCount)
    throw new Error(variableName + " changed: expected " + expectedCount + " questions");
  return questions;
}
export function extractLiteralParagraphs(parsed, firstPrefix, expectedCount) {
  const arrays = find(parsed.ast.program, (node) => node.type === "ArrayExpression" &&
    node.elements?.length === expectedCount && node.elements.every((x) => x?.type === "StringLiteral") &&
    node.elements[0].value.startsWith(firstPrefix));
  if (arrays.length !== 1) throw new Error("Unverified original reading paragraphs for: " + firstPrefix);
  return arrays[0].elements.map((x) => asText(x.value, 2600));
}
export function extractA1Day3Reading(parsed) {
  const passage = parsed.source.match(/<strong>Reading Passage: Introducing Yourself[\s\S]*?<\/strong>\s*<br\s*\/>\s*([\s\S]*?)<\/p>/);
  if (!passage) throw new Error("A1 Day 3 original Lesen passage changed");
  const paragraphs = [asText(passage[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " "), 1700)];
  if (!paragraphs[0].startsWith("Hallo! Ich heiße Anna.")) throw new Error("A1 Day 3 text drift");
  const fill = parsed.source.match(/<strong>Exercise: Complete the Sentences<\/strong>[\s\S]*?<ol[^>]*>([\s\S]*?)<\/ol>/);
  if (!fill) throw new Error("A1 Day 3 original fill-in exercise missing");
  const questions = [...fill[1].matchAll(/<li>([^<]+)<\/li>/g)].map((match) => ({
    question: asText(match[1], 350), options: [],
  }));
  if (questions.length !== 9) throw new Error("A1 Day 3 fill-in task drift");
  return { title: "Introducing Yourself – Teil 1 Lesen", paragraphs, questions };
}
