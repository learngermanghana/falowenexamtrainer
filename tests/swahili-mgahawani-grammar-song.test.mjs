import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { MGAHAWANI_GRAMMAR, MGAHAWANI_SONG } from "../web/src/data/swahili/mgahawaniGrammarAndSong.js";

const read = relative => readFileSync(new URL(relative, import.meta.url), "utf8");
const workbook = read("../web/src/components/SwahiliDaySixWorkbook.jsx");
const grammar = read("../web/src/components/MgahawaniGrammar.jsx");
const song = read("../web/src/components/MgahawaniSong.jsx");
const css = read("../web/src/components/SwahiliCourseBook.css");

test("Day 6 grammar covers all seven teacher-provided topics in original sequence", () => {
  assert.deepEqual(MGAHAWANI_GRAMMAR.chapters.map(item => item.id), [
    "polite","persons","present","questions","numbers","agreement","locative",
  ]);
  for (const phrase of [
    "Naomba wali na samaki.","Naomba bili, tafadhali.",
    "Mimi ninataka wali.","Mimi sitaki wali.",
    "Wewe unataka wali.","Wewe hutaki wali.",
    "Mna chakula gani?","Jumla ni shilingi ngapi?",
    "shilingi elfu mbili na mia tano","vikombe viwili",
    "mgahawani","nyumbani",
  ]) {
    assert.ok(JSON.stringify(MGAHAWANI_GRAMMAR).includes(phrase), phrase);
  }
  assert.equal(MGAHAWANI_GRAMMAR.conversation.length, 8);
  assert.equal(MGAHAWANI_GRAMMAR.conversation[0][0], "Mteja");
});

test("Music tab contains the complete supplied lyrics, without a fake audio player", () => {
  assert.deepEqual(MGAHAWANI_SONG.sections.map(section => section.title), [
    "Utangulizi — Karibu!", "Kiitikio", "Ubeti wa kwanza — Chakula",
    "Kiitikio", "Ubeti wa pili — Kinywaji", "Daraja — Kulipa",
    "Kiitikio cha mwisho", "Mwisho — Karibu tena!",
  ]);
  assert.equal(MGAHAWANI_SONG.sections.reduce((n, section) => n + section.lines.length, 0), 52);
  assert.equal(MGAHAWANI_SONG.sections[0].lines[0], "Habari yako?");
  assert.equal(MGAHAWANI_SONG.sections.at(-1).lines.at(-1), "Asante sana, kwa heri!");
  assert.match(song, /no song recording or synced lyric timings/);
  assert.doesNotMatch(song, /<audio|<video|new Audio/);
});

test("Lesson 6 reuses existing Falowen tab navigation and submission workflow", () => {
  assert.match(workbook, /A2_B1_WORKBOOK_TABS_WITH_GRAMMAR/);
  assert.match(workbook, /activeTab === "references"\) return <MgahawaniSong/);
  assert.match(workbook, /activeTab === "grammar"\) return <MgahawaniGrammar/);
  assert.match(workbook, /<WorkbookTabNav/);
  assert.match(workbook, /"swahiliLessons", "day-6"/);
  assert.match(workbook, /teacherView\) return isTeacher/);
});

test("Grammar and responsive styling allow readable, navigable tables", () => {
  assert.match(grammar, /<details className="mgahawani-grammar__chapter"/);
  assert.match(grammar, /<table className="mgahawani-grammar__table">/);
  assert.match(grammar, /<th key=\{column \+ index\} scope="col">/);
  assert.match(grammar, /<SwahiliDictionary/);
  assert.match(css, /\.mgahawani-grammar__table-wrap\{overflow-x:auto/);
  assert.match(css, /\.mgahawani-song__sections/);
});
