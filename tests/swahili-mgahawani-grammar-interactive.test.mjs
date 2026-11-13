import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { MGAHAWANI_GRAMMAR } from "../web/src/data/swahili/mgahawaniGrammarAndSong.js";
import {
  MGAHAWANI_GRAMMAR_CHECKS, MGAHAWANI_RESTAURANT_CHALLENGE,
} from "../web/src/data/swahili/mgahawaniGrammarPractice.js";

const read = relative => readFileSync(new URL(relative, import.meta.url), "utf8");
const grammar = read("../web/src/components/MgahawaniGrammar.jsx");
const practice = read("../web/src/components/MgahawaniGrammarPractice.jsx");
const css = read("../web/src/components/SwahiliCourseBook.css");
const workbook = read("../web/src/components/SwahiliDaySixWorkbook.jsx");

test("one optional question covers each existing source grammar topic", () => {
  assert.deepEqual(Object.keys(MGAHAWANI_GRAMMAR_CHECKS), MGAHAWANI_GRAMMAR.chapters.map(chapter => chapter.id));
  for (const [id, item] of Object.entries(MGAHAWANI_GRAMMAR_CHECKS)) {
    assert.ok(item.question?.length > 15, id);
    assert.equal(item.options.length, 3, id);
    assert.ok(item.answer >= 0 && item.answer < item.options.length, id);
    assert.ok(item.why.length >= 12, id);
  }
});

test("restaurant challenge is fully local and includes ordering, negative, amount and price", () => {
  assert.deepEqual(MGAHAWANI_RESTAURANT_CHALLENGE.steps.map(item => item.id), ["order","decline","tea","bill"]);
  for(const item of MGAHAWANI_RESTAURANT_CHALLENGE.steps){
    assert.ok(item.options[item.answer],item.id);
    assert.ok(item.why,item.id);
  }
  assert.match(practice, /useState\(\{\}\)/);
  assert.match(practice, /disabled=\{!complete\}/);
  assert.match(practice, /role="status"/);
  assert.doesNotMatch(practice, /getDoc|setDoc|firebase|fetch\(/i);
});

test("source grammar is not changed; adds English rules, colour-coded kutaka, and single open chapter navigation", () => {
  assert.deepEqual(MGAHAWANI_GRAMMAR.chapters.map(item => item.number), [1,2,3,4,5,6,7]);
  assert.match(grammar, /openChapter, setOpenChapter/);
  assert.match(grammar, /open=\{openChapter === chapter.id\}/);
  assert.match(grammar, /event.preventDefault\(\); chooseChapter\(chapter.id\)/);
  assert.match(grammar, /<VerbBreakdown \/>/);
  assert.match(grammar, /<GrammarSelfCheck/);
  assert.match(grammar, /<MgahawaniRestaurantChallenge \/>/);
  assert.match(grammar, /English explanation/);
  assert.match(grammar, /chapter.explanation/);
  assert.match(grammar, /chapter.partsRows/);
  assert.match(grammar, /chapter.negativeRows/);
});

test("mobile grammar display is scoped to Mgahawani and uses accessible controls", () => {
  assert.match(css, /\.mgahawani-grammar__rule-example/);
  assert.match(css, /\.mgahawani-grammar__table-wrap\{overflow-x:auto/);
  assert.match(css, /@media\(max-width:540px\)/);
  assert.match(css, /\.mgahawani-grammar__challenge-steps/);
  assert.match(practice, /type="radio"/);
  assert.match(practice, /name=\{questionId\}/);
  assert.match(grammar, /aria-controls=\{"mgahawani-grammar-" \+ section.id\}/);
  assert.match(workbook, /activeTab === "grammar"\) return <MgahawaniGrammar/);
  assert.match(workbook, /"swahiliLessons", "day-6"/);
});
