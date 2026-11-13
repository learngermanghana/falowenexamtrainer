import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { SWAHILI_DAY_SIX } from "../web/src/data/swahili/daySix.js";

const text = path => readFileSync(new URL(path, import.meta.url), "utf8");
const app = text("../web/src/App.js");
const workbook = text("../web/src/components/SwahiliDaySixWorkbook.jsx");
const dictionary = text("../web/src/components/SwahiliDictionary.jsx");
const index = text("../web/src/components/SwahiliCourseBook.jsx");

test("Somo la 6 Mgahawani is a separate A1 lesson, not topic 4 or an invented Day 2–5", () => {
  assert.equal(SWAHILI_DAY_SIX.day, 6);
  assert.equal(SWAHILI_DAY_SIX.title, "Mgahawani · Restaurant");
  assert.equal(SWAHILI_DAY_SIX.topic, "Mgahawani");
  assert.match(app, /swahili\/day-6/);
  assert.match(index, /Fungua Somo la 6/);
  assert.doesNotMatch(index, /Fungua Somo la [2345]/);
});
test("Restaurant lessons use both original supplied dialogues and menu source words", () => {
  assert.equal(SWAHILI_DAY_SIX.preferenceDialogue[0].speaker, "Amani");
  assert.equal(SWAHILI_DAY_SIX.restaurantDialogue[0].speaker, "Mhudumu");
  assert.equal(SWAHILI_DAY_SIX.restaurantDialogue[1].speaker, "Mteja");
  for(const food of ["wali kuku","wali samaki","ugali nyama","ugali samaki","pilau nyama","ndizi nyama"]){
    assert.ok(SWAHILI_DAY_SIX.food.some(item => item.sw === food),food);
  }
  assert.ok(SWAHILI_DAY_SIX.drinks.some(item => item.sw === "juisi ya embe"));
  assert.ok(SWAHILI_DAY_SIX.phrases.some(item => item.sw.startsWith("Sipendi")));
});
test("Somo la 6 reuses workbook nav and saves an isolated learner-owned submission", () => {
  assert.match(workbook, /A2_B1_WORKBOOK_TABS_WITH_GRAMMAR/);
  assert.match(workbook, /WorkbookTabNav/);
  assert.match(workbook, /"users", user.uid, "swahiliLessons", "day-6"/);
  assert.match(workbook, /lessonId: "swahili-day-6"/);
  assert.match(workbook, /studentId: user.uid/);
  assert.match(workbook, /userId: user.uid/);
  assert.match(workbook, /getMissingSwahiliDaySixWork/);
  assert.match(workbook, /Maoni ya mwalimu · Teacher feedback/);
  assert.equal(SWAHILI_DAY_SIX.radio.youtubeId, "oErMpRojTkg");
});
test("Dictionary includes a selectable sourced Lesson 6 group", () => {
  assert.match(dictionary, /SWAHILI_DAY_SIX/);
  assert.match(dictionary, /source:"day-6"/);
  assert.match(dictionary, /value="day-6"/);
  assert.match(dictionary, /"Mgahawani"/);
});
