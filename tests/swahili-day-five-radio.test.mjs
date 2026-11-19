import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  SWAHILI_DAY_FIVE,
  FAMILY_RADIO_GAPS,
  FAMILY_RADIO_CHOICES,
  FAMILY_RADIO_WRITING_TOPICS,
  FAMILY_WRITING_MODEL,
  FAMILY_LISTENING,
} from "../web/src/data/swahili/dayFive.js";

const workbook = readFileSync(new URL("../web/src/components/SwahiliDayFiveWorkbook.jsx", import.meta.url), "utf8");

test("Day 5 Falowen Radio uses the approved Familia Yangu YouTube episode", () => {
  assert.equal(SWAHILI_DAY_FIVE.radio.resourceRole, "falowenRadio");
  assert.equal(SWAHILI_DAY_FIVE.radio.youtubeId, "qfgDXc8yYiE");
  assert.match(workbook, /lesson\.radio\.youtubeId/);
  assert.match(workbook, /SwahiliWorkbookRadio lesson=\{lesson\}/);
});

test("Day 5 radio questions are complete and preserve the supplied key", () => {
  assert.equal(FAMILY_RADIO_GAPS.length, 4);
  assert.deepEqual(FAMILY_RADIO_GAPS.map(item => item.answer.toLowerCase()), ["wazazi", "bibi", "watoto", "mmoja"]);
  assert.equal(FAMILY_RADIO_CHOICES.length, 4);
  assert.deepEqual(FAMILY_RADIO_CHOICES.map(item => item.choices.indexOf(item.answer)), [1, 1, 2, 0]);
  assert.equal(FAMILY_RADIO_WRITING_TOPICS.length, 7);
  assert.match(FAMILY_WRITING_MODEL, /Tunapenda kupika na kula pamoja/);
  assert.match(workbook, /zisizopungua saba/);
  assert.match(workbook, /listeningAnswers\["radio-" \+ id\]/);
  // This other listening activity belongs to a different recorded dialogue.
  assert.equal(FAMILY_LISTENING.length, 5);
  assert.match(workbook, /Additional listening practice/);
});
